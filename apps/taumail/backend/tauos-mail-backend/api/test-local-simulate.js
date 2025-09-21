const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mock user data
const mockUsers = [
    {
        id: 'd20c4746-30ca-4f57-81d1-6af839c5bc25',
        username: 'saleena',
        email: 'saleena@tauos.org',
        full_name: 'Saleena Thamani'
    }
];

// Mock sent emails storage
let mockSentEmails = [];
let mockInboxEmails = [];

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '3.0 - Test Backend (Simulated Email)',
        services: {
            database: 'mock',
            sendgrid: 'simulated'
        }
    });
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Test endpoint working!' });
});

// Mock login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = mockUsers.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
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

// Mock sent emails
app.get('/api/emails/sent', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        res.json(mockSentEmails);

    } catch (error) {
        console.error('Get sent emails error:', error);
        res.status(500).json({ error: 'Failed to fetch sent emails', details: error.message });
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
        
        res.json({
            emails: mockInboxEmails
        });

    } catch (error) {
        console.error('Get inbox emails error:', error);
        res.status(500).json({ error: 'Failed to fetch inbox emails', details: error.message });
    }
});

// Simulated email sending
app.post('/api/emails/send', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { to, cc, bcc, subject, text } = req.body;

        // Simulate email sending
        const emailId = `email_${Date.now()}`;
        const sentEmail = {
            id: emailId,
            to: to,
            cc: cc || '',
            bcc: bcc || '',
            subject: subject,
            body: text,
            sent_at: new Date().toISOString(),
            status: 'sent'
        };

        // Add to sent emails
        mockSentEmails.unshift(sentEmail);

        // Simulate receiving the email (for testing)
        const receivedEmail = {
            id: `received_${Date.now()}`,
            from: 'saleena@tauos.org',
            to: to,
            subject: `Re: ${subject}`,
            body: `This is a simulated reply to: ${text}`,
            received_at: new Date().toISOString(),
            is_read: false
        };
        mockInboxEmails.unshift(receivedEmail);

        console.log(`📧 Simulated email sent to ${to}: ${subject}`);

        res.json({
            message: 'Email sent successfully (simulated)!',
            messageId: emailId,
            provider: 'TauMail Simulator',
            from: 'saleena@tauos.org',
            fromName: 'Saleena Thamani'
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
        console.log(`🚀 TauOS Mail Simulator running on port ${PORT}`);
        console.log(`📧 Health check: http://localhost:${PORT}/health`);
        console.log(`🔧 Test endpoint: http://localhost:${PORT}/api/test`);
        console.log(`📨 Email sending is simulated - no real emails sent`);
    });
}

module.exports = app;
