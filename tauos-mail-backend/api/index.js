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

// Database connection - Force IPv4 to avoid connectivity issues
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Ak1233%40%405@db.tviqcormikopltejomkc.supabase.co:5432/postgres?sslmode=require',
    host: 'db.tviqcormikopltejomkc.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'Ak1233@@5',
    ssl: {
        rejectUnauthorized: false
    },
    // Force IPv4 connection
    family: 4
});

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Initialize database tables
const initializeDatabase = async () => {
    try {
        // Create sent_emails table if it doesn't exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS sent_emails (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                recipient_email VARCHAR(255) NOT NULL,
                subject VARCHAR(500) NOT NULL,
                body TEXT NOT NULL,
                message_id VARCHAR(255),
                smtp_status VARCHAR(100),
                sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create incoming_emails table if it doesn't exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS incoming_emails (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                from_email VARCHAR(255) NOT NULL,
                subject VARCHAR(500) NOT NULL,
                body TEXT NOT NULL,
                message_id VARCHAR(255),
                received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('✅ Database tables initialized successfully');
    } catch (error) {
        console.error('❌ Database initialization error:', error);
    }
};

// Initialize database on startup
initializeDatabase();

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(), 
        version: '3.0 - Complete TauMail Backend',
        services: {
            database: 'connected',
            sendgrid: process.env.SENDGRID_API_KEY ? 'configured' : 'not configured'
        }
    });
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(), 
        version: '3.0 - Complete TauMail Backend',
        sendgrid: process.env.SENDGRID_API_KEY ? 'configured' : 'not configured'
    });
});

// User registration endpoint
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, username, fullName } = req.body;
        
        // Validate input
        if (!email || !password || !username || !fullName) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create user
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash, full_name) VALUES ($1, $2, $3, $4) RETURNING id, username, email, full_name',
            [username, email, passwordHash, fullName]
        );

        const user = result.rows[0];

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.full_name
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User login endpoint
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
        const { to, subject, text, cc, bcc } = req.body;
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Get user details
        const userResult = await pool.query(
            'SELECT username, email, full_name FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userResult.rows[0];

        if (!process.env.SENDGRID_API_KEY) {
            return res.status(500).json({ error: 'SendGrid not configured' });
        }

        // Prepare email message
        const msg = {
            to: to,
            from: {
                email: user.email,
                name: user.full_name || user.username
            },
            subject: subject,
            text: text,
            html: `<p>${text.replace(/\n/g, '<br>')}</p><br><p>Sent from TauOS Mail - Privacy-First Email</p>`
        };

        // Add CC and BCC if provided
        if (cc) msg.cc = cc;
        if (bcc) msg.bcc = bcc;

        // Send email via SendGrid
        const response = await sgMail.send(msg);
        const messageId = response[0].headers['x-message-id'];
        
        // Store sent email in database
        await pool.query(
            'INSERT INTO sent_emails (user_id, recipient_email, subject, body, message_id, smtp_status) VALUES ($1, $2, $3, $4, $5, $6)',
            [userId, to, subject, text, messageId, 'sent']
        );
        
        res.json({
            message: 'Email sent successfully via SendGrid!',
            messageId: messageId,
            provider: 'SendGrid',
            from: user.email,
            fromName: user.full_name || user.username
        });

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

// Get inbox emails endpoint
app.get('/api/emails/inbox', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const result = await pool.query(
            'SELECT * FROM incoming_emails WHERE user_id = $1 ORDER BY received_at DESC',
            [userId]
        );

        const inboxEmails = result.rows.map(email => ({
            id: email.id,
            from: email.from_email,
            subject: email.subject,
            preview: email.body.substring(0, 100) + '...',
            time: new Date(email.received_at).toLocaleString(),
            unread: !email.is_read,
            starred: false
        }));

        res.json({ emails: inboxEmails });

    } catch (error) {
        console.error('Get inbox emails error:', error);
        res.status(500).json({ error: 'Failed to fetch inbox emails', details: error.message });
    }
});

// Webhook endpoint for incoming emails
app.post('/api/webhook/incoming-email', async (req, res) => {
    try {
        const { to, from, subject, text, messageId } = req.body;
        
        // Extract username from email (e.g., john@tauos.org -> john)
        const username = to.split('@')[0];
        
        // Find user by username
        const userResult = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [username]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userResult.rows[0].id;

        // Store incoming email
        await pool.query(
            'INSERT INTO incoming_emails (user_id, from_email, subject, body, message_id) VALUES ($1, $2, $3, $4, $5)',
            [userId, from, subject, text, messageId]
        );

        res.json({ message: 'Email received and stored successfully' });

    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Failed to process incoming email' });
    }
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server if running directly
if (require.main === module) {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`🚀 TauOS Mail Backend running on port ${PORT}`);
        console.log(`📧 Health check: http://localhost:${PORT}/health`);
        console.log(`🔧 Test endpoint: http://localhost:${PORT}/api/test`);
    });
}

module.exports = app;
