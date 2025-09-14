const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Mock user data (for testing without database)
const mockUsers = [
    {
        id: 'd20c4746-30ca-4f57-81d1-6af839c5bc25',
        username: 'saleena',
        email: 'saleena@tauos.org',
        password_hash: '$2b$10$example_hash', // This won't work for real login
        full_name: 'Saleena Thamani'
    }
];

// Function to create new users dynamically
const createUser = (email, username, fullName) => {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newUser = {
        id: userId,
        username: username,
        email: email,
        password_hash: '$2b$10$example_hash',
        full_name: fullName
    };
    mockUsers.push(newUser);
    return newUser;
};

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '3.0 - Test Backend (No Database)',
        services: {
            database: 'mock',
            sendgrid: process.env.SENDGRID_API_KEY ? 'configured' : 'not configured'
        }
    });
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Test endpoint working!' });
});

// User registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, fullName } = req.body;
        
        // Check if user already exists
        const existingUser = mockUsers.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create new user
        const newUser = createUser(email, username, fullName);
        
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Registration successful',
            token: token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                fullName: newUser.full_name
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Mock login (for testing)
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        let user = mockUsers.find(u => u.email === email);
        
        // If user doesn't exist, create them (for demo purposes)
        if (!user) {
            const username = email.split('@')[0];
            const fullName = username.charAt(0).toUpperCase() + username.slice(1);
            user = createUser(email, username, fullName);
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token: token,
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

// Mock sent emails storage
let sentEmails = [];
let inboxEmails = [];

// Mock sent emails
app.get('/api/emails/sent', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Return sent emails for this user
        const userSentEmails = sentEmails.filter(email => email.userId === decoded.userId);
        res.json(userSentEmails);

    } catch (error) {
        console.error('Get sent emails error:', error);
        res.status(500).json({ error: 'Failed to fetch sent emails', details: error.message });
    }
});

// Webhook to receive incoming emails
app.post('/api/webhook/incoming-email', (req, res) => {
    try {
        const { from, to, subject, text, html } = req.body;
        
        // Find the user by email
        const user = mockUsers.find(u => u.email === to);
        if (user) {
            const incomingEmail = {
                id: `inbox_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId: user.id,
                from: from,
                to: to,
                subject: subject,
                body: text || html,
                received_at: new Date().toISOString()
            };
            inboxEmails.push(incomingEmail);
            console.log('📧 Incoming email received:', incomingEmail);
        }
        
        res.json({ message: 'Email received successfully' });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Failed to process incoming email' });
    }
});

// Mock inbox
app.get('/api/emails/inbox', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Return inbox emails for this user
        const userInboxEmails = inboxEmails.filter(email => email.userId === decoded.userId);
        
        // Add some mock emails if inbox is empty
        if (userInboxEmails.length === 0) {
            const mockEmails = [
                {
                    id: 'inbox_1',
                    userId: decoded.userId,
                    from: 'sender@example.com',
                    subject: 'Welcome to TauMail',
                    body: 'This is a welcome email',
                    received_at: new Date().toISOString()
                }
            ];
            inboxEmails.push(...mockEmails);
            res.json({ emails: mockEmails });
        } else {
            res.json({ emails: userInboxEmails });
        }

    } catch (error) {
        console.error('Get inbox emails error:', error);
        res.status(500).json({ error: 'Failed to fetch inbox emails', details: error.message });
    }
});

// Email sending (with SendGrid)
app.post('/api/emails/send', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { to, cc, bcc, subject, text } = req.body;

        if (!process.env.SENDGRID_API_KEY) {
            return res.status(500).json({ error: 'SendGrid not configured' });
        }

        // Get user info
        const user = mockUsers.find(u => u.id === decoded.userId);
        
        // Send email via SendGrid
        const msg = {
            to: to,
            from: user ? user.email : 'noreply@tauos.org',
            subject: subject,
            text: text,
            html: `<p>${text}</p>`
        };

        if (cc) msg.cc = cc;
        if (bcc) msg.bcc = bcc;

        const result = await sgMail.send(msg);
        const messageId = result[0].headers['x-message-id'];

        // Add to sent emails
        const sentEmail = {
            id: `sent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: decoded.userId,
            to: to,
            cc: cc || null,
            bcc: bcc || null,
            subject: subject,
            body: text,
            sent_at: new Date().toISOString(),
            messageId: messageId
        };
        sentEmails.push(sentEmail);

        res.json({
            message: 'Email sent successfully via SendGrid!',
            messageId: messageId,
            provider: 'SendGrid',
            from: 'noreply@tauos.org'
        });

    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
});

// Start server
if (require.main === module) {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`🚀 TauOS Mail Test Backend running on port ${PORT}`);
        console.log(`📧 Health check: http://localhost:${PORT}/health`);
        console.log(`🔧 Test endpoint: http://localhost:${PORT}/api/test`);
        console.log(`⚠️  Using mock data - no database connection`);
    });
}

module.exports = app;
