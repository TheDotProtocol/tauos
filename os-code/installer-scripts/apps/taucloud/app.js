/**
 * TauOS Cloud Backend - Clean Architecture v2.0
 * Production-ready cloud storage system with proper error handling
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
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');
const mime = require('mime-types');

// Initialize logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

// Create logs directory if it doesn't exist
if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}

const app = express();
const PORT = process.env.PORT || 3002;

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
        smtpTransporter = nodemailer.createTransporter(smtpConfig);
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
    origin: ['http://localhost:3000', 'http://localhost:3006', 'http://localhost:3007'],
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

const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 uploads per window
    message: { error: 'Too many uploads, please try again later.' }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: { error: 'Too many authentication attempts, please try again later.' }
});

app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);
app.use('/api/upload', uploadLimiter);

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = process.env.UPLOAD_DIR || './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024 // 100MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = process.env.ALLOWED_FILE_TYPES.split(',');
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`File type ${file.mimetype} not allowed`), false);
        }
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
function calculateFileHash(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);
        
        stream.on('data', (data) => hash.update(data));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', reject);
    });
}

async function checkStorageQuota(userId, fileSize) {
    try {
        const result = await pool.query('SELECT check_storage_quota($1, $2) as can_upload', [userId, fileSize]);
        return result.rows[0].can_upload;
    } catch (error) {
        logger.error('Error checking storage quota:', error);
        return false;
    }
}

async function updateStorageUsage(userId, fileSize) {
    try {
        await pool.query(
            'UPDATE users SET storage_used_bytes = storage_used_bytes + $1 WHERE id = $2',
            [fileSize, userId]
        );
    } catch (error) {
        logger.error('Error updating storage usage:', error);
    }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'TauOS Cloud Backend v2.0',
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

// File routes
app.get('/api/files', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '', sortBy = 'created_at', sortOrder = 'desc' } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT id, original_name, filename, file_size, mime_type, is_public, download_count, created_at
            FROM files
            WHERE user_id = $1
        `;

        const params = [req.user.userId];

        if (search) {
            query += ' AND original_name ILIKE $2';
            params.push(`%${search}%`);
        }

        // Validate sortBy and sortOrder
        const allowedSortFields = ['created_at', 'original_name', 'file_size', 'download_count'];
        const allowedSortOrders = ['asc', 'desc'];
        
        if (allowedSortFields.includes(sortBy) && allowedSortOrders.includes(sortOrder)) {
            query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
        } else {
            query += ' ORDER BY created_at DESC';
        }

        query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);

        // Get total count for pagination
        let countQuery = 'SELECT COUNT(*) FROM files WHERE user_id = $1';
        const countParams = [req.user.userId];
        
        if (search) {
            countQuery += ' AND original_name ILIKE $2';
            countParams.push(`%${search}%`);
        }

        const countResult = await pool.query(countQuery, countParams);
        const totalFiles = parseInt(countResult.rows[0].count);

        res.json({
            files: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalFiles,
                pages: Math.ceil(totalFiles / limit)
            }
        });

    } catch (error) {
        logger.error('Error fetching files:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/upload', authenticateToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Check storage quota
        const canUpload = await checkStorageQuota(req.user.userId, req.file.size);
        if (!canUpload) {
            // Delete the uploaded file
            fs.unlinkSync(req.file.path);
            return res.status(413).json({ error: 'Storage quota exceeded' });
        }

        // Calculate file hash for deduplication
        const fileHash = await calculateFileHash(req.file.path);

        // Check if file already exists (deduplication)
        const existingFile = await pool.query(
            'SELECT id FROM files WHERE file_hash = $1 AND user_id = $2',
            [fileHash, req.user.userId]
        );

        if (existingFile.rows.length > 0) {
            // Delete the duplicate file
            fs.unlinkSync(req.file.path);
            return res.status(409).json({ error: 'File already exists' });
        }

        // Save file metadata to database
        const result = await pool.query(
            `INSERT INTO files (
                user_id, organization_id, original_name, filename, file_path, 
                file_size, mime_type, file_hash
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, original_name, filename, file_size, mime_type, created_at`,
            [
                req.user.userId,
                '00000000-0000-0000-0000-000000000001', // Default organization
                req.file.originalname,
                req.file.filename,
                req.file.path,
                req.file.size,
                req.file.mimetype,
                fileHash
            ]
        );

        // Update storage usage
        await updateStorageUsage(req.user.userId, req.file.size);

        logger.info(`File uploaded: ${req.file.originalname} by ${req.user.email}`);
        res.status(201).json({
            message: 'File uploaded successfully',
            file: result.rows[0]
        });

    } catch (error) {
        logger.error('Upload error:', error);
        
        // Clean up file if it was uploaded
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/files/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM files WHERE id = $1 AND user_id = $2',
            [id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'File not found' });
        }

        const file = result.rows[0];

        // Check if file exists on disk
        if (!fs.existsSync(file.file_path)) {
            return res.status(404).json({ error: 'File not found on disk' });
        }

        // Update download count
        await pool.query(
            'UPDATE files SET download_count = download_count + 1 WHERE id = $1',
            [id]
        );

        // Set appropriate headers
        res.setHeader('Content-Type', file.mime_type || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${file.original_name}"`);
        res.setHeader('Content-Length', file.file_size);

        // Stream the file
        const fileStream = fs.createReadStream(file.file_path);
        fileStream.pipe(res);

        logger.info(`File downloaded: ${file.original_name} by ${req.user.email}`);

    } catch (error) {
        logger.error('Download error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/files/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT file_path, file_size FROM files WHERE id = $1 AND user_id = $2',
            [id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'File not found' });
        }

        const file = result.rows[0];

        // Delete file from disk
        if (fs.existsSync(file.file_path)) {
            fs.unlinkSync(file.file_path);
        }

        // Delete from database
        await pool.query('DELETE FROM files WHERE id = $1', [id]);

        // Update storage usage
        await pool.query(
            'UPDATE users SET storage_used_bytes = storage_used_bytes - $1 WHERE id = $2',
            [file.file_size, req.user.userId]
        );

        logger.info(`File deleted: ${id} by ${req.user.email}`);
        res.json({ message: 'File deleted successfully' });

    } catch (error) {
        logger.error('Delete error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.patch('/api/files/:id/visibility', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { isPublic } = req.body;

        await pool.query(
            'UPDATE files SET is_public = $1 WHERE id = $2 AND user_id = $3',
            [isPublic, id, req.user.userId]
        );

        res.json({ message: 'File visibility updated' });

    } catch (error) {
        logger.error('Error updating file visibility:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Share file via email
app.post('/api/files/:id/share', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { email, message } = req.body;

        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'Valid email address required' });
        }

        const result = await pool.query(
            'SELECT * FROM files WHERE id = $1 AND user_id = $2',
            [id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'File not found' });
        }

        const file = result.rows[0];

        if (smtpWorking && smtpTransporter) {
            const shareUrl = `http://localhost:${PORT}/api/files/${id}/download`;
            
            const mailOptions = {
                from: `${req.user.fullName || req.user.username} <${req.user.email}>`,
                to: email,
                subject: `File shared: ${file.original_name}`,
                text: `
Hello,

${req.user.fullName || req.user.username} has shared a file with you.

File: ${file.original_name}
Size: ${(file.file_size / 1024 / 1024).toFixed(2)} MB
Type: ${file.mime_type}

${message || 'No message provided.'}

Download link: ${shareUrl}

Best regards,
TauOS Cloud
                `,
                html: `
                    <h3>File Shared</h3>
                    <p><strong>${req.user.fullName || req.user.username}</strong> has shared a file with you.</p>
                    <ul>
                        <li><strong>File:</strong> ${file.original_name}</li>
                        <li><strong>Size:</strong> ${(file.file_size / 1024 / 1024).toFixed(2)} MB</li>
                        <li><strong>Type:</strong> ${file.mime_type}</li>
                    </ul>
                    <p>${message || 'No message provided.'}</p>
                    <p><a href="${shareUrl}">Download File</a></p>
                    <p>Best regards,<br>TauOS Cloud</p>
                `
            };

            await smtpTransporter.sendMail(mailOptions);
            logger.info(`File shared via email: ${file.original_name} to ${email}`);
            
            res.json({ message: 'File shared successfully via email' });
        } else {
            res.status(503).json({ error: 'Email service unavailable' });
        }

    } catch (error) {
        logger.error('Share error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user profile and storage info
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT u.id, u.username, u.email, u.full_name, u.avatar_url, 
                    u.storage_used_bytes, u.created_at,
                    o.storage_limit_gb
             FROM users u
             JOIN organizations o ON u.organization_id = o.id
             WHERE u.id = $1`,
            [req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        const storageLimitBytes = user.storage_limit_gb * 1024 * 1024 * 1024;
        const storageUsedPercent = (user.storage_used_bytes / storageLimitBytes) * 100;

        res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.full_name,
                avatarUrl: user.avatar_url,
                createdAt: user.created_at
            },
            storage: {
                used: user.storage_used_bytes,
                limit: storageLimitBytes,
                usedPercent: Math.round(storageUsedPercent * 100) / 100,
                available: storageLimitBytes - user.storage_used_bytes
            }
        });

    } catch (error) {
        logger.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ error: 'File too large' });
        }
    }
    
    logger.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    logger.info(`☁️ TauOS Cloud Backend v2.0 running on http://localhost:${PORT}`);
    logger.info(`📧 Email domain: @${process.env.EMAIL_DOMAIN}`);
    logger.info(`💾 Database: PostgreSQL (Supabase)`);
    logger.info(`🔒 Security: Rate limiting, input validation, JWT auth`);
    logger.info(`📊 Health check: http://localhost:${PORT}/api/health`);
});

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
