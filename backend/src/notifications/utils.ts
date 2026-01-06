import { supabaseAdmin } from '../supabase/client.js';

export interface NotificationData {
  user_id: string;
  type: 'order' | 'order_status' | 'low_stock' | 'stock_warning' | 'new_customer' | 'new_enquiry';
  title: string;
  message?: string;
  data?: any;
}

/**
 * Create a notification
 */
export async function createNotification(notification: NotificationData): Promise<void> {
  try {
    if (!supabaseAdmin) {
      console.error('Supabase admin client not initialized');
      return;
    }

    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: notification.user_id,
        type: notification.type,
        title: notification.title,
        message: notification.message || null,
        data: notification.data || null,
        is_read: false,
      });
  } catch (error) {
    console.error('Create notification error:', error);
  }
}

/**
 * Create notification for admin users
 */
export async function createAdminNotification(
  type: NotificationData['type'],
  title: string,
  message?: string,
  data?: any
): Promise<void> {
  try {
    if (!supabaseAdmin) {
      console.error('Supabase admin client not initialized');
      return;
    }

    // Get all admin users
    const { data: admins } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('role', 'admin');

    if (!admins || admins.length === 0) {
      return;
    }

    // Create notification for each admin
    const notifications = admins.map(admin => ({
      user_id: admin.id,
      type,
      title,
      message: message || null,
      data: data || null,
      is_read: false,
    }));

    await supabaseAdmin
      .from('notifications')
      .insert(notifications);
  } catch (error) {
    console.error('Create admin notification error:', error);
  }
}

/**
 * Check and create low stock notifications
 */
export async function checkLowStock(productId: string, productName: string, quantity: number): Promise<void> {
  try {
    // Warning if less than 3
    if (quantity < 3) {
      await createAdminNotification(
        'stock_warning',
        `Stock Warning: ${productName}`,
        `Only ${quantity} items left in stock. Please restock immediately.`,
        { product_id: productId, quantity }
      );
    }
    // Low stock if less than 5
    else if (quantity < 5) {
      await createAdminNotification(
        'low_stock',
        `Low Stock: ${productName}`,
        `Only ${quantity} items left in stock.`,
        { product_id: productId, quantity }
      );
    }
  } catch (error) {
    console.error('Check low stock error:', error);
  }
}


