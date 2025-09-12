const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const sgMail = require('@sendgrid/mail');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(), 
        version: '3.2 - PRODUCTION READY',
        sendgrid: process.env.SENDGRID_API_KEY ? 'configured' : 'not configured'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '3.2 - PRODUCTION READY' });
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const result = await pool.query(
            'SELECT id, username, email, password_hash, full_name FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.full_name
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Send email endpoint
app.post('/api/emails/send', async (req, res) => {
    try {
        const { to, subject, text } = req.body;
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const userResult = await pool.query(
            'SELECT username, email, full_name FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userResult.rows[0];

        if (process.env.SENDGRID_API_KEY) {
            const msg = {
                to: to,
                from: {
                    email: user.email,
                    name: user.full_name || user.username
                },
                subject: subject,
                text: text,
                html: `<p>${text}</p><br><p>Sent from TauOS Mail - Privacy-First Email</p>`
            };

            const response = await sgMail.send(msg);
            const messageId = response[0].headers['x-message-id'];
            
            // Store sent email in database
            await pool.query(
                'INSERT INTO sent_emails (user_id, recipient_email, subject, body, message_id, smtp_status, sent_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())',
                [userId, to, subject, text, messageId, 'SendGrid']
            );
            
            res.json({
                message: 'Email sent successfully via SendGrid!',
                messageId: messageId,
                provider: 'SendGrid',
                from: user.email,
                fromName: user.full_name || user.username
            });
        } else {
            res.status(500).json({ error: 'SendGrid not configured' });
        }

    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
});

// Get sent emails endpoint
app.get('/api/emails/sent', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const result = await pool.query(
            'SELECT * FROM sent_emails WHERE user_id = $1 ORDER BY sent_at DESC',
            [userId]
        );

        const sentEmails = result.rows.map(email => ({
            id: email.id,
            to: email.recipient_email,
            subject: email.subject,
            text: email.body,
            messageId: email.message_id,
            provider: email.smtp_status || 'unknown',
            sentAt: email.sent_at || email.created_at,
            unread: false
        }));

        res.json(sentEmails);

    } catch (error) {
        console.error('Get sent emails error:', error);
        res.status(500).json({ error: 'Failed to fetch sent emails', details: error.message });
    }
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

module.exports = app;