import { Router, Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { supabaseAdmin } from '../supabase/client.js';

const router = Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

/**
 * POST /payment/create-order
 * Create Razorpay order
 */
router.post('/create-order', async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({ error: 'Valid amount is required' });
      return;
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Create Razorpay order error:', error);
    res.status(500).json({
      error: 'Failed to create payment order',
      message: error.message,
    });
  }
});

/**
 * POST /payment/verify
 * Verify Razorpay payment signature
 */
router.post('/verify', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id, // Our internal order ID
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({ error: 'Missing payment verification parameters' });
      return;
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(sign.toString())
      .digest('hex');

    if (expectedSign !== razorpay_signature) {
      res.status(400).json({ error: 'Invalid payment signature', verified: false });
      return;
    }

    // Payment verified successfully
    // Update order status if order_id is provided
    if (order_id) {
      const { error: updateError } = await supabaseAdmin!
        .from('orders')
        .update({
          payment_status: 'paid',
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        })
        .eq('id', order_id);

      if (updateError) {
        console.error('Error updating order payment status:', updateError);
      }
    }

    res.status(200).json({
      success: true,
      verified: true,
      message: 'Payment verified successfully',
    });
  } catch (error: any) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      error: 'Failed to verify payment',
      message: error.message,
    });
  }
});

/**
 * POST /payment/webhook
 * Handle Razorpay webhooks
 */
router.post('/webhook', async (req: Request, res: Response): Promise<void> => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

    // Verify webhook signature
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    const signature = req.headers['x-razorpay-signature'] as string;

    if (digest === signature) {
      // Webhook verified
      const event = req.body.event;
      const payload = req.body.payload.payment.entity;

      console.log('Razorpay webhook event:', event);

      // Handle different events
      switch (event) {
        case 'payment.captured':
          // Payment successful
          console.log('Payment captured:', payload.id);
          break;

        case 'payment.failed':
          // Payment failed
          console.log('Payment failed:', payload.id);
          break;

        default:
          console.log('Unhandled webhook event:', event);
      }

      res.status(200).json({ status: 'ok' });
    } else {
      res.status(403).json({ error: 'Invalid signature' });
    }
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * GET /payment/status/:payment_id
 * Get payment status
 */
router.get('/status/:payment_id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { payment_id } = req.params;

    const payment = await razorpay.payments.fetch(payment_id);

    res.status(200).json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        method: payment.method,
        captured: payment.captured,
      },
    });
  } catch (error: any) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      error: 'Failed to get payment status',
      message: error.message,
    });
  }
});

export default router;
