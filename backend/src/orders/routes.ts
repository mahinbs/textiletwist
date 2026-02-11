import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../supabase/client.js';
import { requireAuth, optionalAuth } from '../auth/middleware.js';

const router = Router();

/**
 * Generate unique order number
 */
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

/**
 * GET /orders
 * Get orders (user's own orders or all orders for admin)
 */
router.get('/', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' }); return;
    }

    // Check if user is actually admin
    const { data: userProfile } = await supabaseAdmin!
      .from('user_profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();
    
    const isAdmin = userProfile?.role === 'admin';
    
    let query = supabaseAdmin!
      .from('orders')
      .select(`
        *,
        order_items(*),
        coupon:coupons(code, name)
      `)
      .order('created_at', { ascending: false });

    if (!isAdmin) {
      // Regular users can only see their own orders (where user_id matches)
      query = query.eq('user_id', req.user.id);
    }
    // Admins see all orders (no filter)

    const { data, error } = await query;

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    res.status(200).json({ orders: data || [] });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

/**
 * GET /orders/track/:orderNumber
 * Track order by order number (public - no auth required)
 */
router.get('/track/:orderNumber', async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderNumber } = req.params;
    const { email } = req.query;

    if (!orderNumber) {
      res.status(400).json({ error: 'Order number is required' });
      return;
    }

    let query = supabaseAdmin!
      .from('orders')
      .select(`
        *,
        order_items(*),
        coupon:coupons(code, name)
      `)
      .eq('order_number', orderNumber.toUpperCase());

    // If email provided, verify it matches
    if (email) {
      query = query.eq('customer_email', email);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.status(200).json({ order: data });
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({ error: 'Failed to track order' });
  }
});

/**
 * GET /orders/:id
 * Get single order by ID
 */
router.get('/:id', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' }); return;
    }

    const { id } = req.params;

    // Load user profile to determine role
    const { data: userProfile } = await supabaseAdmin!
      .from('user_profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    const { data, error } = await supabaseAdmin!
      .from('orders')
      .select(`
        *,
        order_items(*),
        coupon:coupons(code, name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      res.status(404).json({ error: 'Order not found' }); return;
    }

    // Check if user owns this order or is admin
    const isAdmin = userProfile?.role === 'admin';
    if (!isAdmin && data.user_id !== req.user.id) {
      res.status(403).json({ error: 'Access denied' }); return;
    }

    res.status(200).json({ order: data });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

/**
 * POST /orders
 * Create new order
 */
router.post('/', optionalAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      cart_items,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_city,
      shipping_state,
      shipping_postal_code,
      shipping_country,
      coupon_code,
      shipping_cost,
      payment_method,
    } = req.body;

    // Validation
    if (!cart_items || !Array.isArray(cart_items) || cart_items.length === 0) {
      res.status(400).json({ error: 'Cart items are required' }); return;
    }

    if (!customer_name || !customer_email || !customer_phone || !shipping_address) {
      res.status(400).json({
        error: 'Customer name, email, phone, and shipping address are required',
      });
      return;
    }

    // Get cart items if user is authenticated
    let itemsToOrder = cart_items;
    if (req.user) {
      const { data: cartItems } = await supabaseAdmin!
        .from('cart')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', req.user.id);

      if (cartItems && cartItems.length > 0) {
        itemsToOrder = cartItems.map((item: any) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          product: item.product,
        }));
      }
    }

    // Validate products and calculate totals
    let subtotal = 0;
    const orderItems: any[] = [];

    for (const item of itemsToOrder) {
      const productId = item.product_id || item.product?.id;
      const quantity = item.quantity;
      const product = item.product;

      if (!product) {
        // Fetch product if not provided
        const { data: productData } = await supabaseAdmin!
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (!productData || !productData.is_active) {
          res.status(400).json({ error: `Product ${productId} not found or inactive` }); return;
        }

        if (productData.quantity < quantity) {
          res.status(400).json({ error: `Insufficient stock for product ${productData.name}` }); return;
        }

        const price = productData.price;
        const discount = productData.discount_percentage || 0;
        const itemPrice = price * (1 - discount / 100);
        const itemSubtotal = itemPrice * quantity;

        subtotal += itemSubtotal;
        orderItems.push({
          product_id: productId,
          product_name: productData.name,
          product_price: itemPrice,
          quantity,
          subtotal: itemSubtotal,
        });
      } else {
        const price = product.price;
        const discount = product.discount_percentage || 0;
        const itemPrice = price * (1 - discount / 100);
        const itemSubtotal = itemPrice * quantity;

        subtotal += itemSubtotal;
        orderItems.push({
          product_id: productId,
          product_name: product.name,
          product_price: itemPrice,
          quantity,
          subtotal: itemSubtotal,
        });
      }
    }

    // Apply coupon if provided
    let discountAmount = 0;
    let couponId = null;

    if (coupon_code) {
      const { data: coupon } = await supabaseAdmin!
        .from('coupons')
        .select('*')
        .eq('code', coupon_code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (coupon) {
        // Validate coupon
        const now = new Date();
        if (
          new Date(coupon.valid_from) <= now &&
          (!coupon.valid_until || new Date(coupon.valid_until) >= now) &&
          subtotal >= coupon.min_order_amount
        ) {
          // Check if user already used this coupon
          if (req.user) {
            const { data: usage } = await supabaseAdmin!
              .from('coupon_usage')
              .select('id')
              .eq('coupon_id', coupon.id)
              .eq('user_id', req.user.id)
              .single();

            if (usage) {
              res.status(400).json({ error: 'You have already used this coupon' }); return;
            }
          }

          // Calculate discount
          if (coupon.discount_type === 'percentage') {
            discountAmount = subtotal * (coupon.discount_value / 100);
            if (coupon.max_discount_amount) {
              discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
            }
          } else {
            discountAmount = coupon.discount_value;
          }

          discountAmount = Math.min(discountAmount, subtotal);
          couponId = coupon.id;
        }
      }
    }

    const shipping = shipping_cost ? parseFloat(shipping_cost) : 0;
    const totalAmount = subtotal - discountAmount + shipping;

    // Create order
    const orderNumber = generateOrderNumber();
    const orderData: any = {
      order_number: orderNumber,
      user_id: req.user?.id || null,
      status: 'pending',
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_city: shipping_city || null,
      shipping_state: shipping_state || null,
      shipping_postal_code: shipping_postal_code || null,
      shipping_country: shipping_country || 'India',
      subtotal,
      discount_amount: discountAmount,
      coupon_id: couponId,
      shipping_cost: shipping,
      total_amount: totalAmount,
      payment_method: payment_method || 'cod',
      payment_status: payment_method === 'cod' ? 'pending' : 'pending',
    };

    // Add Razorpay fields if present
    if (req.body.razorpay_order_id) {
      orderData.razorpay_order_id = req.body.razorpay_order_id;
    }
    if (req.body.razorpay_payment_id) {
      orderData.razorpay_payment_id = req.body.razorpay_payment_id;
      orderData.payment_status = 'paid';
    }
    if (req.body.razorpay_signature) {
      orderData.razorpay_signature = req.body.razorpay_signature;
    }

    const { data: order, error: orderError } = await supabaseAdmin!
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      res.status(400).json({ error: orderError.message }); return;
    }

    // Create order items
    const orderItemsData = orderItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_price: item.product_price,
      quantity: item.quantity,
      subtotal: item.subtotal,
    }));

    const { error: itemsError } = await supabaseAdmin!
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) {
      // Rollback order creation
      await supabaseAdmin!.from('orders').delete().eq('id', order.id);
      res.status(400).json({ error: itemsError.message }); return;
    }

    // Record coupon usage
    if (couponId && req.user) {
      await supabaseAdmin!.from('coupon_usage').insert({
        coupon_id: couponId,
        user_id: req.user.id,
        order_id: order.id,
      });
    }

    // Update product quantities and check for low stock
    const { createAdminNotification, checkLowStock } = await import('../notifications/utils.js');
    
    for (const item of orderItems) {
      // Get current product
      const { data: product } = await supabaseAdmin!
        .from('products')
        .select('quantity, name')
        .eq('id', item.product_id)
        .single();

      if (product) {
        const newQuantity = Math.max(0, product.quantity - item.quantity);
        
        // Update quantity
        await supabaseAdmin!
          .from('products')
          .update({ quantity: newQuantity })
          .eq('id', item.product_id);

        // Check for low stock and create notifications
        await checkLowStock(item.product_id, product.name, newQuantity);
      }
    }

    // Create order notification for admin
    await createAdminNotification(
      'order',
      `New Order #${orderNumber}`,
      `New order received from ${customer_name}`,
      { order_id: order.id, order_number: orderNumber }
    );

    // Create order notification for customer (if logged in)
    if (req.user) {
      const { createNotification } = await import('../notifications/utils.js');
      await createNotification({
        user_id: req.user.id,
        type: 'order',
        title: `Order #${orderNumber} Placed`,
        message: `Your order has been placed successfully. Total: ₹${totalAmount.toLocaleString()}`,
        data: { order_id: order.id, order_number: orderNumber },
      });
    }

    // Clear user's cart if authenticated
    if (req.user) {
      await supabaseAdmin!.from('cart').delete().eq('user_id', req.user.id);
    }

    // Fetch complete order with items
    const { data: completeOrder } = await supabaseAdmin!
      .from('orders')
      .select(`
        *,
        order_items(*),
        coupon:coupons(code, name)
      `)
      .eq('id', order.id)
      .single();

    res.status(201).json({ order: completeOrder, message: 'Order created successfully' });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

/**
 * PUT /orders/:id/status
 * Update order status (admin only)
 */
router.put('/:id/status', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
      return;
    }

    // Get order with user_id before updating
    const { data: existingOrder } = await supabaseAdmin!
      .from('orders')
      .select('user_id, order_number, customer_name')
      .eq('id', id)
      .single();

    if (!existingOrder) {
      res.status(404).json({ error: 'Order not found' }); return;
    }

    const { data, error } = await supabaseAdmin!
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select(`
        *,
        order_items(*),
        coupon:coupons(code, name)
      `)
      .single();

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    if (!data) {
      res.status(404).json({ error: 'Order not found' }); return;
    }

    // Create notification for customer when order status changes
    if (existingOrder.user_id) {
      const { createNotification } = await import('../notifications/utils.js');
      const statusMessages: Record<string, string> = {
        processing: 'Your order is being processed',
        confirmed: 'Your order has been confirmed',
        shipped: 'Your order has been shipped',
        delivered: 'Your order has been delivered',
        cancelled: 'Your order has been cancelled',
      };

      await createNotification({
        user_id: existingOrder.user_id,
        type: 'order_status',
        title: `Order #${existingOrder.order_number} ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: statusMessages[status] || `Your order status has been updated to ${status}`,
        data: { order_id: id, order_number: existingOrder.order_number, status },
      });
    }

    res.status(200).json({ order: data, message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;

