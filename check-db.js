import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kbtgpgkiojeqnssenlof.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtidGdwZ2tpb2plcW5zc2VubG9mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzYxMDA2OCwiZXhwIjoyMDgzMTg2MDY4fQ.vaBvvy1SisYMqYnvujCPmVI0fpdD_YxD7AGjUq0g0-0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
    console.log('=== CHECKING ORDERS TABLE ===\n');
    
    // Check if razorpay columns exist
    const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .limit(5)
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('Error fetching orders:', error);
    } else {
        console.log('Recent Orders:');
        orders.forEach(order => {
            console.log(`\nOrder #${order.order_number}`);
            console.log(`  ID: ${order.id}`);
            console.log(`  User ID: ${order.user_id || 'GUEST'}`);
            console.log(`  Customer: ${order.customer_name} (${order.customer_email})`);
            console.log(`  Total: ₹${order.total_amount}`);
            console.log(`  Payment: ${order.payment_method} (${order.payment_status})`);
            console.log(`  Razorpay Order ID: ${order.razorpay_order_id || 'N/A'}`);
            console.log(`  Razorpay Payment ID: ${order.razorpay_payment_id || 'N/A'}`);
            console.log(`  Created: ${order.created_at}`);
        });
        
        // Check if razorpay columns exist
        if (orders.length > 0) {
            const firstOrder = orders[0];
            console.log('\n=== CHECKING RAZORPAY COLUMNS ===');
            console.log('razorpay_order_id exists:', 'razorpay_order_id' in firstOrder);
            console.log('razorpay_payment_id exists:', 'razorpay_payment_id' in firstOrder);
            console.log('razorpay_signature exists:', 'razorpay_signature' in firstOrder);
        }
    }
    
    // Count guest vs user orders
    const { count: totalCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
    
    const { count: guestCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .is('user_id', null);
    
    console.log('\n=== ORDER STATISTICS ===');
    console.log(`Total Orders: ${totalCount}`);
    console.log(`Guest Orders (user_id = NULL): ${guestCount}`);
    console.log(`User Orders (user_id != NULL): ${totalCount - guestCount}`);
    
    // Check users table
    console.log('\n=== CHECKING USERS ===');
    const { data: profiles } = await supabase
        .from('user_profiles')
        .select('id, role')
        .limit(5);
    
    console.log(`Total user profiles: ${profiles?.length || 0}`);
    if (profiles) {
        profiles.forEach(p => console.log(`  ${p.id}: ${p.role}`));
    }
}

checkDatabase().catch(console.error);
