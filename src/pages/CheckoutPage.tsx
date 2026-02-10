import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ordersApi, cartApi } from '../lib/api';
import CheckoutForm, { type CheckoutFormData } from '../components/checkout/CheckoutForm';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkingOut, setCheckingOut] = useState(false);

    useEffect(() => {
        // Check if there's a buyNow product in session storage
        const buyNowProduct = sessionStorage.getItem('buyNowProduct');
        
        if (buyNowProduct) {
            // Guest checkout with single product
            try {
                const product = JSON.parse(buyNowProduct);
                setCartItems([product]);
                setLoading(false);
            } catch (error) {
                console.error('Error parsing buyNow product:', error);
                navigate('/');
            }
        } else {
            // Regular checkout from cart (requires login)
            fetchCart();
        }
    }, [navigate]);

    const fetchCart = async () => {
        setLoading(true);
        const response = await cartApi.getAll();
        if (response.error) {
            // User not logged in or cart empty
            navigate('/cart');
        } else if (response.data) {
            const items = response.data.cart || [];
            if (items.length === 0) {
                navigate('/cart');
            } else {
                setCartItems(items.map((item: any) => ({
                    product_id: item.product_id,
                    product: item.product,
                    quantity: item.quantity,
                    size: item.size
                })));
            }
        }
        setLoading(false);
    };

    const handleCheckoutSubmit = async (formData: CheckoutFormData) => {
        setCheckingOut(true);

        const subtotal = cartItems.reduce((sum, item) => {
            const product = item.product;
            if (!product) return sum;
            const price = product.price * (1 - (product.discount_percentage || 0) / 100);
            return sum + (price * item.quantity);
        }, 0);

        // Prepare order data
        const orderData: any = {
            cart_items: cartItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                size: item.size || null,
                product: item.product,
            })),
            customer_name: formData.customer_name,
            customer_email: formData.customer_email,
            customer_phone: formData.customer_phone,
            shipping_address: formData.shipping_address,
            shipping_city: formData.shipping_city,
            shipping_state: formData.shipping_state,
            shipping_postal_code: formData.shipping_postal_code,
            shipping_country: formData.shipping_country,
            payment_method: formData.payment_method,
            shipping_cost: subtotal > 5000 ? 0 : 500,
        };

        // Add Razorpay payment details if present
        if (formData.razorpay_order_id) {
            orderData.razorpay_order_id = formData.razorpay_order_id;
        }
        if (formData.razorpay_payment_id) {
            orderData.razorpay_payment_id = formData.razorpay_payment_id;
        }
        if (formData.razorpay_signature) {
            orderData.razorpay_signature = formData.razorpay_signature;
        }

        const response = await ordersApi.create(orderData);
        console.log('Order creation response:', response);
        
        if (response.error) {
            alert(response.error);
            setCheckingOut(false);
            return;
        }
        
        // Clear buyNow product from session storage
        sessionStorage.removeItem('buyNowProduct');
        
        // Extract order data - backend returns { data: { order: {...}, message: "..." } }
        const order = response.data?.order;
        console.log('Order object:', order);
        
        if (order && order.id) {
            console.log('Navigating to confirmation page with order ID:', order.id);
            // Use navigate with replace to avoid back button issues
            navigate(`/order-confirmation?order_id=${order.id}`, { replace: true });
        } else {
            // Fallback: show alert with order number if we have it
            const orderNumber = order?.order_number || response.data?.order_number;
            console.log('No order ID, showing alert. Order number:', orderNumber);
            alert(`Order placed successfully!${orderNumber ? ' Order Number: ' + orderNumber : ''}`);
            navigate('/', { replace: true });
        }
        
        setCheckingOut(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const subtotal = cartItems.reduce((sum, item) => {
        const product = item.product;
        if (!product) return sum;
        const price = product.price * (1 - (product.discount_percentage || 0) / 100);
        return sum + (price * item.quantity);
    }, 0);

    const shipping = subtotal > 5000 ? 0 : 500;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-gray-50">
            <CheckoutForm
                cartItems={cartItems}
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
                onCheckout={handleCheckoutSubmit}
                onCancel={() => {
                    sessionStorage.removeItem('buyNowProduct');
                    navigate(-1);
                }}
                isSubmitting={checkingOut}
            />
        </div>
    );
};

export default CheckoutPage;
