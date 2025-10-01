const express = require('express');
const { query } = require('../config/database');
const router = express.Router();

// Get inbox emails
router.get('/inbox', async (req, res) => {
  try {
    console.log('📧 Fetching inbox emails...');
    
    const result = await query(`
      SELECT 
        e.id,
        e.from_email,
        e.to_email,
        e.subject,
        e.body_text,
        e.body_html,
        e.received_at,
        e.sent_at,
        e.is_read,
        e.is_starred,
        e.is_spam,
        e.message_id,
        f.name as folder_name,
        f.type as folder_type
      FROM taumail_v2.emails e
      LEFT JOIN taumail_v2.folders f ON e.folder_id = f.id
      WHERE e.user_id = $1 
        AND e.is_deleted = false
        AND (f.type = 'inbox' OR f.type IS NULL)
      ORDER BY e.received_at DESC
      LIMIT 50
    `, ['d60c22bb-0b23-4a09-9e14-ac6cbc7c1547']); // saleena@tauos.org user ID
    
    console.log(`📧 Found ${result.rows.length} emails`);
    
    res.json({
      success: true,
      emails: result.rows,
      total: result.rows.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Inbox error:', error);
    res.status(500).json({
      error: 'Failed to fetch inbox',
      details: error.message
    });
  }
});

// Get sent emails
router.get('/sent', async (req, res) => {
  try {
    console.log('📤 Fetching sent emails...');
    
    const result = await query(`
      SELECT 
        e.id,
        e.from_email,
        e.to_email,
        e.subject,
        e.body_text,
        e.sent_at,
        e.is_read,
        e.is_starred,
        f.name as folder_name
      FROM taumail_v2.emails e
      LEFT JOIN taumail_v2.folders f ON e.folder_id = f.id
      WHERE e.user_id = $1 
        AND e.is_deleted = false
        AND f.type = 'sent'
      ORDER BY e.sent_at DESC
      LIMIT 50
    `, ['d60c22bb-0b23-4a09-9e14-ac6cbc7c1547']);
    
    res.json({
      success: true,
      emails: result.rows,
      total: result.rows.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Sent emails error:', error);
    res.status(500).json({
      error: 'Failed to fetch sent emails',
      details: error.message
    });
  }
});

// Send email
router.post('/send', async (req, res) => {
  try {
    const { to, subject, body, from } = req.body;
    
    if (!to || !subject || !body) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['to', 'subject', 'body']
      });
    }
    
    console.log('📤 Sending email:', { to, subject, from });
    
    // Get sent folder ID
    const folderResult = await query(`
      SELECT id FROM taumail_v2.folders 
      WHERE user_id = $1 AND type = 'sent'
    `, ['d60c22bb-0b23-4a09-9e14-ac6cbc7c1547']);
    
    if (folderResult.rows.length === 0) {
      return res.status(500).json({
        error: 'Sent folder not found'
      });
    }
    
    // Insert email into database
    const result = await query(`
      INSERT INTO taumail_v2.emails (
        user_id, folder_id, from_email, to_email, subject, 
        body_text, body_html, sent_at, is_read
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, NOW(), true
      ) RETURNING id
    `, [
      '00000000-0000-0000-0000-000000000001',
      folderResult.rows[0].id,
      from || 'saleena@tauos.org',
      to,
      subject,
      body,
      body,
    ]);
    
    console.log('✅ Email saved with ID:', result.rows[0].id);
    
    res.json({
      success: true,
      message: 'Email sent successfully',
      emailId: result.rows[0].id
    });
    
  } catch (error) {
    console.error('❌ Send email error:', error);
    res.status(500).json({
      error: 'Failed to send email',
      details: error.message
    });
  }
});

// Mark email as read
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_read } = req.body;
    
    await query(`
      UPDATE taumail_v2.emails 
      SET is_read = $1, updated_at = NOW()
      WHERE id = $2 AND user_id = $3
    `, [is_read, id, '00000000-0000-0000-0000-000000000001']);
    
    res.json({
      success: true,
      message: 'Email status updated'
    });
    
  } catch (error) {
    console.error('❌ Mark read error:', error);
    res.status(500).json({
      error: 'Failed to update email status',
      details: error.message
    });
  }
});

// Delete email
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await query(`
      UPDATE taumail_v2.emails 
      SET is_deleted = true, updated_at = NOW()
      WHERE id = $1 AND user_id = $2
    `, [id, '00000000-0000-0000-0000-000000000001']);
    
    res.json({
      success: true,
      message: 'Email deleted'
    });
    
  } catch (error) {
    console.error('❌ Delete email error:', error);
    res.status(500).json({
      error: 'Failed to delete email',
      details: error.message
    });
  }
});

module.exports = router;
