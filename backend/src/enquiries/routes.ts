import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../supabase/client.js';
import { requireAuth } from '../auth/middleware.js';

const router = Router();

/**
 * GET /enquiries
 * Get all contact enquiries (admin only)
 */
router.get('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, search } = req.query;

    let query = supabaseAdmin!
      .from('contact_enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    res.status(200).json({ enquiries: data || [] });
  } catch (error) {
    console.error('Get enquiries error:', error);
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

/**
 * GET /enquiries/:id
 * Get single enquiry (admin only)
 */
router.get('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin!
      .from('contact_enquiries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      res.status(404).json({ error: 'Enquiry not found' }); return;
    }

    res.status(200).json({ enquiry: data });
  } catch (error) {
    console.error('Get enquiry error:', error);
    res.status(500).json({ error: 'Failed to fetch enquiry' });
  }
});

/**
 * POST /enquiries
 * Create new contact enquiry (public)
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      res.status(400).json({ error: 'All fields are required' }); return;
    }

    const { data, error } = await supabaseAdmin!
      .from('contact_enquiries')
      .insert({
        name,
        email,
        subject,
        message,
        status: 'new',
      })
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    res.status(201).json({ enquiry: data, message: 'Enquiry submitted successfully' });
  } catch (error) {
    console.error('Create enquiry error:', error);
    res.status(500).json({ error: 'Failed to submit enquiry' });
  }
});

/**
 * PUT /enquiries/:id/status
 * Update enquiry status (admin only)
 */
router.put('/:id/status', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['new', 'read', 'replied', 'resolved'];
    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
      return;
    }

    const { data, error } = await supabaseAdmin!
      .from('contact_enquiries')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    if (!data) {
      res.status(404).json({ error: 'Enquiry not found' }); return;
    }

    res.status(200).json({ enquiry: data, message: 'Enquiry status updated' });
  } catch (error) {
    console.error('Update enquiry status error:', error);
    res.status(500).json({ error: 'Failed to update enquiry status' });
  }
});

/**
 * POST /enquiries/:id/reply
 * Send email reply to enquiry (admin only)
 */
router.post('/:id/reply', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      res.status(400).json({ error: 'To, subject, and message are required' });
      return;
    }

    // Get the enquiry to verify it exists
    const { data: enquiry, error: enquiryError } = await supabaseAdmin!
      .from('contact_enquiries')
      .select('*')
      .eq('id', id)
      .single();

    if (enquiryError || !enquiry) {
      res.status(404).json({ error: 'Enquiry not found' });
      return;
    }

    // In a real application, you would send an email here using a service like:
    // - Nodemailer with SMTP
    // - SendGrid
    // - AWS SES
    // - Resend
    // For now, we'll just log it and update the status
    
    console.log('Email Reply:', {
      to,
      subject,
      message,
      enquiryId: id,
      originalSubject: enquiry.subject,
    });

    // Update enquiry status to 'replied'
    const { error: updateError } = await supabaseAdmin!
      .from('contact_enquiries')
      .update({ status: 'replied' })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating enquiry status:', updateError);
    }

    // TODO: Implement actual email sending
    // Example with nodemailer:
    // const transporter = nodemailer.createTransport({...});
    // await transporter.sendMail({ to, subject, text: message });

    res.status(200).json({ 
      message: 'Reply sent successfully (simulated). In production, this would send an actual email.',
      note: 'Email functionality needs to be configured with an email service provider'
    });
  } catch (error) {
    console.error('Send reply error:', error);
    res.status(500).json({ error: 'Failed to send reply' });
  }
});

/**
 * DELETE /enquiries/:id
 * Delete enquiry (admin only)
 */
router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin!
      .from('contact_enquiries')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(400).json({ error: error.message }); return;
    }

    res.status(200).json({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error('Delete enquiry error:', error);
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

export default router;

