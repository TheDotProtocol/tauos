/**
 * TauOS Mail Backend - Vercel Serverless Function
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
const sgMail = require('@sendgrid/mail');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
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

const app = express();

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
    logger.info('SendGrid initialized successfully');
} else {
    logger.warn('SendGrid API key not found, using SMTP fallback');
}

// Test database connection
pool.on('connect', () => {
    logger.info('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    logger.error('Database connection error:', err);
});

// Middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:3000', 'https://www.tauos.org', 'https://tauos.org'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const generalLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: { error: 'Too many requests, please try again later' }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: { error: 'Too many authentication attempts, please try again later' }
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
const validateRegister = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('username').isLength({ min: 3 }).isAlphanumeric(),
    body('fullName').isLength({ min: 2 })
];

const validateLogin = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 1 })
];

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'TauOS Mail Backend is running',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
    });
});

// Authentication routes
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
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create user
        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash, full_name, created_at) 
             VALUES ($1, $2, $3, $4, NOW()) 
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

app.post('/api/auth/login', validateLogin, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Invalid input data', details: errors.array() });
        }

        const { email, password } = req.body;

        // Find user
        const result = await pool.query(
            'SELECT id, username, email, password_hash, full_name FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        logger.info(`User logged in: ${email}`);
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

// Test email endpoint
app.post('/api/auth/send-test-email', async (req, res) => {
    try {
        const { to, subject, text, userEmail, userName } = req.body;
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        let fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@tauos.org';
        let fromName = process.env.SENDGRID_FROM_NAME || 'TauOS Mail';
        
        // If user information is provided, use it
        if (userEmail && userName) {
            fromEmail = userEmail;
            fromName = userName;
        } else if (token) {
            // Try to get user info from token
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const userResult = await pool.query(
                    'SELECT email, fullName FROM users WHERE id = $1',
                    [decoded.userId]
                );
                if (userResult.rows.length > 0) {
                    fromEmail = userResult.rows[0].email;
                    fromName = userResult.rows[0].fullName || userResult.rows[0].email.split('@')[0];
                }
            } catch (error) {
                logger.warn('Could not decode token for user info:', error.message);
            }
        }

        // Use SendGrid if available, otherwise fallback to SMTP
        if (process.env.SENDGRID_API_KEY) {
            const msg = {
                to: to,
                from: {
                    email: fromEmail,
                    name: fromName
                },
                subject: subject,
                text: text,
                html: `<p>${text}</p><br><p>Sent from TauOS Mail - Privacy-First Email</p>`
            };

            const response = await sgMail.send(msg);
            logger.info(`Test email sent via SendGrid: ${response[0].headers['x-message-id']}`);
            res.json({
                message: 'Test email sent successfully via SendGrid!',
                messageId: response[0].headers['x-message-id'],
                provider: 'SendGrid',
                from: fromEmail,
                fromName: fromName
            });
        } else {
            // Fallback to SMTP
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                },
                tls: {
                    rejectUnauthorized: false // Allow self-signed certificates
                }
            });

            const info = await transporter.sendMail({
                from: `TauOS Test <${process.env.SMTP_USER}>`,
                to: to,
                subject: subject,
                text: text
            });

            logger.info(`Test email sent via SMTP: ${info.messageId}`);
            res.json({
                message: 'Test email sent successfully via SMTP!',
                messageId: info.messageId,
                provider: 'SMTP'
            });
        }

    } catch (error) {
        logger.error('Test email error:', error);
        res.status(500).json({ error: 'Failed to send test email', details: error.message });
    }
});

// Send email endpoint (authenticated)
app.post('/api/emails/send', async (req, res) => {
    try {
        const { to, subject, text } = req.body;
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Get user details from database
        const userResult = await pool.query(
            'SELECT username, email, fullName FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userResult.rows[0];

        // Use SendGrid if available, otherwise fallback to SMTP
        if (process.env.SENDGRID_API_KEY) {
            const msg = {
                to: to,
                from: {
                    email: user.email, // Use user's email as sender
                    name: user.fullName || user.username // Use user's name
                },
                subject: subject,
                text: text,
                html: `<p>${text}</p><br><p>Sent from TauOS Mail - Privacy-First Email</p>`
            };

            const response = await sgMail.send(msg);
            logger.info(`Email sent via SendGrid from ${user.email}: ${response[0].headers['x-message-id']}`);
            res.json({
                message: 'Email sent successfully via SendGrid!',
                messageId: response[0].headers['x-message-id'],
                provider: 'SendGrid',
                from: user.email,
                fromName: user.fullName || user.username
            });
        } else {
            // Fallback to SMTP
            const transporter = nodemailer.createTransporter({
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
            });

            const info = await transporter.sendMail({
                from: `${user.fullName || user.username} <${user.email}>`,
                to: to,
                subject: subject,
                text: text
            });

            logger.info(`Email sent via SMTP from ${user.email}: ${info.messageId}`);
            res.json({
                message: 'Email sent successfully via SMTP!',
                messageId: info.messageId,
                provider: 'SMTP',
                from: user.email,
                fromName: user.fullName || user.username
            });
        }

    } catch (error) {
        logger.error('Email sending error:', error);
        res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '2.0' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((error, req, res, next) => {
    logger.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Export for Vercel
module.exports = app;
