/**
 * TauOS Mail Backend - Clean Architecture v2.0
 * Production-ready email system with proper error handling
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');

// Initialize logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console()
    ]
});

// Add file logging only in non-serverless environments
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
    // Create logs directory if it doesn't exist
    if (!fs.existsSync('logs')) {
        fs.mkdirSync('logs');
    }
    logger.add(new winston.transports.File({ filename: 'logs/error.log', level: 'error' }));
    logger.add(new winston.transports.File({ filename: 'logs/combined.log' }));
}

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test database connection
pool.on('connect', () => {
    logger.info('✅ Database connected successfully');
});

pool.on('error', (err) => {
    logger.error('❌ Database connection error:', err);
});

// SMTP Configuration
const smtpConfig = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
};

// Initialize SMTP transporter
let smtpTransporter = null;
let smtpWorking = false;

async function initializeSMTP() {
    try {
        smtpTransporter = nodemailer.createTransport(smtpConfig);
        await smtpTransporter.verify();
        smtpWorking = true;
        logger.info('✅ SMTP server connected successfully');
    } catch (error) {
        smtpWorking = false;
        logger.error('❌ SMTP connection failed:', error.message);
    }
}

// Initialize SMTP on startup
initializeSMTP();

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

app.use(cors({
    origin: [
        'http://localhost:3000', 
        'http://localhost:3006', 
        'http://localhost:3007',
        'https://www.tauos.org',
        'https://tauos.org',
        'https://cloud.tauos.org',
        'https://mail.tauos.org',
        'https://id.tauos.org',
        'https://store.tauos.org',
        'https://browser.tauos.org'
    ],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const generalLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: { error: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: { error: 'Too many authentication attempts, please try again later.' }
});

app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// File upload configuration (using memory storage for Vercel)
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
    },
    fileFilter: (req, file, cb) => {
        // Allow all file types for email attachments
        cb(null, true);
    }
});

// Validation middleware
const validateLogin = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 })
];

const validateRegister = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('username').isLength({ min: 3 }).isAlphanumeric(),
    body('fullName').isLength({ min: 2 })
];

const validateEmail = [
    body('to').isEmail().normalizeEmail(),
    body('subject').isLength({ min: 1, max: 500 }),
    body('body').isLength({ min: 1 })
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Utility functions
async function checkEmailQuota(userId) {
    try {
        const result = await pool.query('SELECT check_email_quota($1) as can_send', [userId]);
        return result.rows[0].can_send;
    } catch (error) {
        logger.error('Error checking email quota:', error);
        return false;
    }
}

async function updateEmailQuota(userId) {
    try {
        await pool.query(
            'UPDATE users SET email_quota_used = email_quota_used + 1 WHERE id = $1',
            [userId]
        );
    } catch (error) {
        logger.error('Error updating email quota:', error);
    }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'TauOS Mail Backend v2.0',
        timestamp: new Date().toISOString(),
        smtp: smtpWorking ? 'connected' : 'disconnected',
        database: 'connected'
    });
});

// Authentication routes
app.post('/api/auth/login', validateLogin, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Invalid input data', details: errors.array() });
        }

        const { email, password } = req.body;
        logger.info(`Login attempt for: ${email}`);

        const result = await pool.query(
            'SELECT id, username, email, password_hash, full_name, is_active FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        if (!user.is_active) {
            return res.status(401).json({ error: 'Account is deactivated' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        await pool.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );

        const token = jwt.sign(
            { userId: user.id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        logger.info(`Successful login for: ${email}`);
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
        logger.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/auth/register', validateRegister, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Invalid input data', details: errors.array() });
        }

        const { email, password, username, fullName } = req.body;

        // Check if user already exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Hash password
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create user
        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash, full_name, organization_id) 
             VALUES ($1, $2, $3, $4, '00000000-0000-0000-0000-000000000001') 
             RETURNING id, username, email, full_name`,
            [username, email, passwordHash, fullName]
        );

        const user = result.rows[0];
        const token = jwt.sign(
            { userId: user.id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        logger.info(`New user registered: ${email}`);
        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.full_name
            }
        });

    } catch (error) {
        logger.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Custom domain registration endpoint
app.post('/api/auth/register-custom-domain', validateRegister, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Invalid input data', details: errors.array() });
        }

        const { email, password, username, fullName, customDomain } = req.body;

        // Validate custom domain format
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
        if (!domainRegex.test(customDomain)) {
            return res.status(400).json({ error: 'Invalid domain format' });
        }

        // Check if user already exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Hash password
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create user with custom domain
        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash, full_name, organization_id, custom_domain) 
             VALUES ($1, $2, $3, $4, '00000000-0000-0000-0000-000000000001', $5) 
             RETURNING id, username, email, full_name, custom_domain`,
            [username, email, passwordHash, fullName, customDomain]
        );

        const user = result.rows[0];
        const token = jwt.sign(
            { userId: user.id, email: user.email, username: user.username, customDomain: user.custom_domain },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        logger.info(`New custom domain user registered: ${email} for domain ${customDomain}`);
        res.status(201).json({
            message: 'Custom domain registration successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.full_name,
                customDomain: user.custom_domain
            }
        });

    } catch (error) {
        logger.error('Custom domain registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Email routes
app.get('/api/emails', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 20, folder = 'inbox' } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT e.*, u.username as sender_username, u.full_name as sender_name
            FROM emails e
            LEFT JOIN users u ON e.sender_id = u.id
            WHERE e.user_id = $1
        `;

        const params = [req.user.userId];

        if (folder === 'inbox') {
            query += ' AND e.to_email = $2';
            params.push(req.user.email);
        } else if (folder === 'sent') {
            query += ' AND e.sender_id = $2';
            params.push(req.user.userId);
        } else if (folder === 'drafts') {
            query += ' AND e.is_draft = true';
        }

        query += ' ORDER BY e.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
        params.push(limit, offset);

        const result = await pool.query(query, params);
        res.json({ emails: result.rows });

    } catch (error) {
        logger.error('Error fetching emails:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/emails/send', authenticateToken, validateEmail, upload.array('attachments', 10), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Invalid input data', details: errors.array() });
        }

        // Check email quota
        const canSend = await checkEmailQuota(req.user.userId);
        if (!canSend) {
            return res.status(429).json({ error: 'Daily email quota exceeded' });
        }

        const { to, cc, bcc, subject, body, replyTo } = req.body;
        const messageId = `<${uuidv4()}@${process.env.EMAIL_DOMAIN}>`;

        // Get recipient user ID
        const recipientResult = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [to]
        );

        const recipientId = recipientResult.rows.length > 0 ? recipientResult.rows[0].id : null;

        // Save email to database
        const emailResult = await pool.query(
            `INSERT INTO emails (
                user_id, sender_id, recipient_id, from_email, to_email, cc_emails, bcc_emails,
                subject, body, message_id, reply_to_email, is_sent, delivery_status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING id`,
            [
                req.user.userId, // user_id (sender)
                req.user.userId, // sender_id
                recipientId,     // recipient_id
                req.user.email,  // from_email
                to,              // to_email
                cc ? cc.split(',').map(e => e.trim()) : [], // cc_emails
                bcc ? bcc.split(',').map(e => e.trim()) : [], // bcc_emails
                subject,         // subject
                body,            // body
                messageId,       // message_id
                replyTo || req.user.email, // reply_to_email
                false,           // is_sent
                'pending'        // delivery_status
            ]
        );

        const emailId = emailResult.rows[0].id;

        // Handle attachments
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                await pool.query(
                    `INSERT INTO email_attachments (email_id, filename, original_name, file_path, file_size, mime_type)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [emailId, file.filename, file.originalname, file.path, file.size, file.mimetype]
                );
            }
        }

        // Send email via SMTP
        if (smtpWorking && smtpTransporter) {
            try {
                const mailOptions = {
                    from: `${req.user.fullName || req.user.username} <foundationtau@gmail.com>`,
                    to: to,
                    cc: cc,
                    bcc: bcc,
                    replyTo: replyTo || req.user.email,
                    subject: subject,
                    text: body,
                    messageId: messageId
                };

                // Add attachments
                if (req.files && req.files.length > 0) {
                    mailOptions.attachments = req.files.map(file => ({
                        filename: file.originalname,
                        path: file.path
                    }));
                }

                const info = await smtpTransporter.sendMail(mailOptions);
                
                // Update email status
                await pool.query(
                    'UPDATE emails SET is_sent = true, delivery_status = $1, sent_at = CURRENT_TIMESTAMP WHERE id = $2',
                    ['sent', emailId]
                );

                // Update quota
                await updateEmailQuota(req.user.userId);

                logger.info(`Email sent successfully: ${messageId}`);
                res.json({
                    message: 'Email sent successfully',
                    messageId: info.messageId,
                    emailId: emailId
                });

            } catch (smtpError) {
                logger.error('SMTP send error:', smtpError);
                
                // Update email status to failed
                await pool.query(
                    'UPDATE emails SET delivery_status = $1, error_message = $2 WHERE id = $3',
                    ['failed', smtpError.message, emailId]
                );

                res.status(500).json({
                    error: 'Email saved but delivery failed',
                    messageId: messageId,
                    emailId: emailId
                });
            }
        } else {
            // SMTP not working, just save to database
            await pool.query(
                'UPDATE emails SET delivery_status = $1, error_message = $2 WHERE id = $3',
                ['pending', 'SMTP server unavailable', emailId]
            );

            res.json({
                message: 'Email saved (SMTP unavailable)',
                messageId: messageId,
                emailId: emailId
            });
        }

    } catch (error) {
        logger.error('Send email error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get email by ID
app.get('/api/emails/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT e.*, u.username as sender_username, u.full_name as sender_name
             FROM emails e
             LEFT JOIN users u ON e.sender_id = u.id
             WHERE e.id = $1 AND (e.user_id = $2 OR e.sender_id = $2)`,
            [id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Email not found' });
        }

        const email = result.rows[0];

        // Get attachments
        const attachmentsResult = await pool.query(
            'SELECT * FROM email_attachments WHERE email_id = $1',
            [id]
        );

        email.attachments = attachmentsResult.rows;

        // Mark as read if it's an incoming email
        if (email.to_email === req.user.email && !email.is_read) {
            await pool.query(
                'UPDATE emails SET is_read = true WHERE id = $1',
                [id]
            );
        }

        res.json({ email });

    } catch (error) {
        logger.error('Error fetching email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Mark email as read/unread
app.patch('/api/emails/:id/read', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { isRead } = req.body;

        await pool.query(
            'UPDATE emails SET is_read = $1 WHERE id = $2 AND user_id = $3',
            [isRead, id, req.user.userId]
        );

        res.json({ message: 'Email status updated' });

    } catch (error) {
        logger.error('Error updating email status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete email
app.delete('/api/emails/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            'DELETE FROM emails WHERE id = $1 AND user_id = $2',
            [id, req.user.userId]
        );

        res.json({ message: 'Email deleted' });

    } catch (error) {
        logger.error('Error deleting email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Test email endpoint (no authentication required for testing)
app.post('/api/auth/send-test-email', async (req, res) => {
    try {
        const { to, subject, text } = req.body;

        if (!to || !subject || !text) {
            return res.status(400).json({ error: 'Missing required fields: to, subject, text' });
        }

        if (!smtpWorking || !smtpTransporter) {
            return res.status(500).json({ error: 'SMTP server not available' });
        }

        const mailOptions = {
            from: `TauOS Test <foundationtau@gmail.com>`,
            to: to,
            subject: subject,
            text: text
        };

        const info = await smtpTransporter.sendMail(mailOptions);
        
        logger.info(`Test email sent successfully to: ${to}`);
        res.json({
            message: 'Test email sent successfully',
            messageId: info.messageId,
            to: to
        });

    } catch (error) {
        logger.error('Test email error:', error);
        res.status(500).json({ error: 'Failed to send test email', details: error.message });
    }
});

// Get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, username, email, full_name, avatar_url, email_quota_used, storage_used_bytes, created_at FROM users WHERE id = $1',
            [req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: result.rows[0] });

    } catch (error) {
        logger.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    logger.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server (only if not in Vercel environment)
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        logger.info(`🚀 TauOS Mail Backend v2.0 running on http://localhost:${PORT}`);
        logger.info(`📧 Email domain: @${process.env.EMAIL_DOMAIN}`);
        logger.info(`💾 Database: PostgreSQL (Supabase)`);
        logger.info(`🔒 Security: Rate limiting, input validation, JWT auth`);
        logger.info(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
}

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    pool.end(() => {
        logger.info('Database connection closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    pool.end(() => {
        logger.info('Database connection closed');
        process.exit(0);
    });
});

// Export for Vercel
module.exports = app;
