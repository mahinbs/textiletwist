# Razorpay Payment Gateway Setup

This guide will help you set up Razorpay payment gateway for your Textile Twist e-commerce application.

## Prerequisites

- Razorpay account (Sign up at https://razorpay.com/)
- Backend and frontend applications running

## Step 1: Get Razorpay Credentials

1. Log in to your Razorpay Dashboard: https://dashboard.razorpay.com/
2. Navigate to **Settings** → **API Keys**
3. Generate API Keys if you haven't already
4. Note down:
   - **Key ID** (starts with `rzp_test_` for test mode or `rzp_live_` for live mode)
   - **Key Secret** (keep this confidential)

## Step 2: Configure Backend Environment Variables

1. Navigate to the `backend` folder
2. Open or create a `.env` file
3. Add the following Razorpay configuration:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

**Example:**
```env
RAZORPAY_KEY_ID=rzp_test_1234567890abcd
RAZORPAY_KEY_SECRET=your_secret_key_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

## Step 3: Update Database Schema

Run the SQL migration to add Razorpay fields to the orders table:

```bash
cd backend
```

Then execute the SQL file `add-razorpay-fields.sql` in your Supabase SQL editor or run:

```sql
-- Add Razorpay payment fields to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS razorpay_signature VARCHAR(255);

-- Create index for faster lookup
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_payment ON orders(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order ON orders(razorpay_order_id);
```

## Step 4: Configure Webhooks (Optional but Recommended)

Webhooks allow Razorpay to notify your server about payment events.

1. In Razorpay Dashboard, go to **Settings** → **Webhooks**
2. Click **Create New Webhook**
3. Set the Webhook URL: `https://your-backend-domain.com/payment/webhook`
4. Select the following events:
   - `payment.captured`
   - `payment.failed`
5. Note down the **Webhook Secret**
6. Add the webhook secret to your backend `.env` file as `RAZORPAY_WEBHOOK_SECRET`

## Step 5: Test the Integration

### Test Mode (Recommended First)

1. Use test API keys (starting with `rzp_test_`)
2. Start your backend and frontend servers:
   ```bash
   # Backend
   cd backend
   npm run dev

   # Frontend (in a new terminal)
   cd ..
   npm run dev
   ```

3. Navigate to your application and add items to cart
4. Proceed to checkout and select "Online Payment"
5. Use Razorpay test cards:
   - **Card Number:** 4111 1111 1111 1111
   - **CVV:** Any 3 digits
   - **Expiry:** Any future date
   - **Name:** Any name

### Test UPI (Test Mode)

- **UPI ID:** success@razorpay
- **UPI ID (failure):** failure@razorpay

## Step 6: Go Live

When you're ready to accept real payments:

1. Complete KYC verification on Razorpay Dashboard
2. Activate your account
3. Replace test API keys with live API keys:
   - Live keys start with `rzp_live_`
4. Update your `.env` files with live credentials
5. Restart your backend server

## Payment Flow

Here's how the payment flow works:

1. **User adds items to cart** → Proceeds to checkout
2. **Fills checkout form** → Selects "Online Payment"
3. **Frontend creates Razorpay order** → Calls `/payment/create-order` API
4. **Razorpay checkout opens** → User enters payment details
5. **Payment successful** → Razorpay returns payment details
6. **Backend verifies payment** → Calls `/payment/verify` API
7. **Order created** → Payment status updated to "paid"
8. **User redirected** → Order confirmation page

## API Endpoints

### Create Payment Order
```
POST /payment/create-order
Body: { amount: number, currency: string, receipt: string, notes: object }
```

### Verify Payment
```
POST /payment/verify
Body: { 
  razorpay_order_id: string, 
  razorpay_payment_id: string, 
  razorpay_signature: string,
  order_id: string (optional)
}
```

### Get Payment Status
```
GET /payment/status/:payment_id
```

### Webhook Handler
```
POST /payment/webhook
```

## Security Best Practices

1. **Never expose Key Secret** - Keep it only on the backend
2. **Use HTTPS** - Always use secure connections in production
3. **Verify signatures** - Always verify Razorpay signatures on backend
4. **Implement rate limiting** - Prevent abuse of payment endpoints
5. **Monitor webhooks** - Set up alerts for failed payments
6. **Regular security audits** - Review payment logs regularly

## Troubleshooting

### Payment creation fails
- Check if Razorpay credentials are correct
- Verify backend environment variables are loaded
- Check backend logs for detailed error messages

### Payment verification fails
- Ensure signature verification logic is correct
- Check if Key Secret matches the one used to create order
- Verify payment details are being passed correctly

### Webhook not receiving events
- Verify webhook URL is publicly accessible
- Check webhook secret matches the one in Razorpay Dashboard
- Test webhook using Razorpay Dashboard's "Send Test Webhook" feature

## Support

- **Razorpay Documentation:** https://razorpay.com/docs/
- **Razorpay Support:** https://razorpay.com/support/
- **API Reference:** https://razorpay.com/docs/api/

## Order Management

Orders with online payments will have:
- `payment_method`: "online"
- `payment_status`: "paid" (after successful payment)
- `razorpay_order_id`: Razorpay order ID
- `razorpay_payment_id`: Razorpay payment ID
- `razorpay_signature`: Payment signature for verification

COD orders will have:
- `payment_method`: "cod"
- `payment_status`: "pending"
- No Razorpay fields

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Razorpay credentials are configured
- [ ] Database migration completed
- [ ] Can create order with COD
- [ ] Can initiate online payment
- [ ] Razorpay checkout opens correctly
- [ ] Test payment succeeds
- [ ] Order created with payment details
- [ ] Webhook receives events (if configured)
- [ ] Order status updates correctly

## Notes

- In test mode, payments are not actually charged
- Test mode has some limitations (e.g., no international payments)
- Production mode requires completed KYC
- Keep your Key Secret secure and never commit it to version control
- Consider implementing payment retry logic for failed payments
- Set up email notifications for successful/failed payments
