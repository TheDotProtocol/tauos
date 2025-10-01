const express = require('express');
const { query } = require('../config/database');
const router = express.Router();

// Incoming email webhook
router.post('/incoming', async (req, res) => {
  try {
    console.log('📨 Webhook received - processing incoming email...');
    
    // Handle different content types
    let fromEmail, toEmail, subject, body;
    
    if (req.headers['content-type']?.includes('application/json')) {
      // JSON format
      ({ from: fromEmail, to: toEmail, subject, text: body } = req.body);
    } else {
      // Form data format
      fromEmail = req.body.from;
      toEmail = req.body.to;
      subject = req.body.subject;
      body = req.body.text || req.body.html;
    }
    
    console.log('📧 Email data:', { fromEmail, toEmail, subject });
    
    if (!fromEmail || !toEmail) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['from', 'to']
      });
    }
    
    // Clean email format - handle angle brackets
    let recipientEmail = toEmail;
    if (recipientEmail.includes('<') && recipientEmail.includes('>')) {
      const match = recipientEmail.match(/<([^>]+)>/);
      if (match) {
        recipientEmail = match[1];
      }
    }
    
    // Find user ID for recipient email
    const userResult = await query(`
      SELECT id FROM auth.users WHERE email = $1
    `, [recipientEmail]);
    
    if (userResult.rows.length === 0) {
      console.log('❌ User not found:', recipientEmail);
      return res.status(404).json({
        error: 'User not found',
        email: recipientEmail
      });
    }
    
    const userId = userResult.rows[0].id;
    console.log('👤 User ID:', userId);
    
    // Get inbox folder ID
    const folderResult = await query(`
      SELECT id FROM taumail_v2.folders 
      WHERE user_id = $1 AND type = 'inbox'
    `, [userId]);
    
    if (folderResult.rows.length === 0) {
      return res.status(500).json({
        error: 'Inbox folder not found'
      });
    }
    
    // Insert email into database
    const result = await query(`
      INSERT INTO taumail_v2.emails (
        user_id, folder_id, from_email, to_email, subject, 
        body_text, body_html, received_at, is_read
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, NOW(), false
      ) RETURNING id
    `, [
      userId,
      folderResult.rows[0].id,
      fromEmail,
      recipientEmail,
      subject || 'No Subject',
      body || '',
      body || '',
    ]);
    
    console.log('✅ Email saved with ID:', result.rows[0].id);
    
    res.json({
      success: true,
      message: 'Email received and processed',
      emailId: result.rows[0].id,
      userId: userId
    });
    
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({
      error: 'Failed to process email',
      details: error.message
    });
  }
});

// Webhook health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'TauMail v2 Webhook is active',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
