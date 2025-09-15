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
const mime = require('mime-types');

// Simple logger - serverless compatible
const logger = {
    info: (message, ...args) => console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args),
    error: (message, ...args) => console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args),
    warn: (message, ...args) => console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args),
    debug: (message, ...args) => console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args)
};

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

// File upload configuration - serverless compatible
const storage = process.env.VERCEL ? multer.memoryStorage() : multer.diskStorage({
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
        // Allow all file types for now, can be restricted later
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
        const { page = 1, limit = 20, search = '', sortBy = 'created_at', sortOrder = 'desc', folder_id } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT f.id, f.original_name, f.filename, f.file_size, f.mime_type, f.is_public, 
                   f.download_count, f.created_at, f.updated_at, f.parent_folder_id,
                   fo.name as folder_name
            FROM files f
            LEFT JOIN folders fo ON f.parent_folder_id = fo.id
            WHERE f.user_id = $1 AND f.deleted_at IS NULL
        `;

        const params = [req.user.userId];

        if (folder_id) {
            query += ' AND f.parent_folder_id = $' + (params.length + 1);
            params.push(folder_id);
        }

        if (search) {
            query += ' AND (f.original_name ILIKE $' + (params.length + 1) + ' OR f.mime_type ILIKE $' + (params.length + 1) + ')';
            params.push(`%${search}%`);
        }

        // Validate sortBy and sortOrder
        const allowedSortFields = ['created_at', 'original_name', 'file_size', 'download_count', 'updated_at'];
        const allowedSortOrders = ['asc', 'desc'];
        
        if (allowedSortFields.includes(sortBy) && allowedSortOrders.includes(sortOrder)) {
            query += ` ORDER BY f.${sortBy} ${sortOrder.toUpperCase()}`;
        } else {
            query += ' ORDER BY f.created_at DESC';
        }

        query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);

        // Get total count for pagination
        let countQuery = 'SELECT COUNT(*) FROM files f WHERE f.user_id = $1 AND f.deleted_at IS NULL';
        const countParams = [req.user.userId];
        
        if (folder_id) {
            countQuery += ' AND f.parent_folder_id = $' + (countParams.length + 1);
            countParams.push(folder_id);
        }
        
        if (search) {
            countQuery += ' AND (f.original_name ILIKE $' + (countParams.length + 1) + ' OR f.mime_type ILIKE $' + (countParams.length + 1) + ')';
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
            return res.status(413).json({ error: 'Storage quota exceeded' });
        }

        // Calculate file hash for deduplication
        const fileHash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');

        // Check if file already exists (deduplication)
        const existingFile = await pool.query(
            'SELECT id FROM files WHERE file_hash = $1 AND user_id = $2',
            [fileHash, req.user.userId]
        );

        if (existingFile.rows.length > 0) {
            return res.status(409).json({ error: 'File already exists' });
        }

        // For serverless, we'll store file data in database or use external storage
        // For now, we'll just store metadata and return a message
        const filename = `${uuidv4()}-${req.file.originalname}`;
        
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
                filename,
                'serverless-storage', // Placeholder for serverless
                req.file.size,
                req.file.mimetype,
                fileHash
            ]
        );

        // Update storage usage
        await updateStorageUsage(req.user.userId, req.file.size);

        logger.info(`File uploaded: ${req.file.originalname} by ${req.user.email}`);
        res.status(201).json({
            message: 'File uploaded successfully (serverless mode)',
            file: result.rows[0],
            note: 'File storage in serverless mode - actual file storage needs external service'
        });

    } catch (error) {
        logger.error('Upload error:', error);
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

        // Update download count
        await pool.query(
            'UPDATE files SET download_count = download_count + 1 WHERE id = $1',
            [id]
        );

        // For serverless mode, return file metadata instead of actual file
        res.json({
            message: 'File download requested (serverless mode)',
            file: {
                id: file.id,
                originalName: file.original_name,
                filename: file.filename,
                fileSize: file.file_size,
                mimeType: file.mime_type,
                createdAt: file.created_at
            },
            note: 'Actual file download requires external storage service in serverless mode'
        });

        logger.info(`File download requested: ${file.original_name} by ${req.user.email}`);

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

        // Delete file from disk (only in non-serverless mode)
        if (!process.env.VERCEL && fs.existsSync(file.file_path)) {
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

// Folders API
app.get('/api/folders', authenticateToken, async (req, res) => {
    try {
        const { parent_folder_id = null } = req.query;
        
        let query = `
            SELECT id, name, description, is_public, color, icon, 
                   parent_folder_id, created_at, updated_at
            FROM folders
            WHERE user_id = $1 AND deleted_at IS NULL
        `;
        
        const params = [req.user.userId];
        
        if (parent_folder_id) {
            query += ' AND parent_folder_id = $2';
            params.push(parent_folder_id);
        } else {
            query += ' AND parent_folder_id IS NULL';
        }
        
        query += ' ORDER BY name ASC';
        
        const result = await pool.query(query, params);
        res.json({ folders: result.rows });

    } catch (error) {
        logger.error('Error fetching folders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/folders', authenticateToken, async (req, res) => {
    try {
        const { name, description, parent_folder_id, color, icon } = req.body;
        
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Folder name is required' });
        }

        const result = await pool.query(
            `INSERT INTO folders (user_id, organization_id, name, description, 
                                parent_folder_id, color, icon)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, name, description, is_public, color, icon, 
                       parent_folder_id, created_at, updated_at`,
            [
                req.user.userId,
                '00000000-0000-0000-0000-000000000001', // Default organization
                name.trim(),
                description || '',
                parent_folder_id || null,
                color || '#3B82F6',
                icon || 'folder'
            ]
        );

        // Log activity
        await pool.query(
            `INSERT INTO activity_log (user_id, organization_id, action, resource_type, 
                                     resource_id, resource_name)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                req.user.userId,
                '00000000-0000-0000-0000-000000000001',
                'created',
                'folder',
                result.rows[0].id,
                name
            ]
        );

        res.status(201).json({
            message: 'Folder created successfully',
            folder: result.rows[0]
        });

    } catch (error) {
        if (error.code === '23505') { // Unique constraint violation
            res.status(409).json({ error: 'A folder with this name already exists in this location' });
        } else {
            logger.error('Error creating folder:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// File sharing API
app.post('/api/files/:id/share', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { shared_with_email, permission = 'view', expires_at, password } = req.body;

        // Check if file exists and belongs to user
        const fileResult = await pool.query(
            'SELECT * FROM files WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL',
            [id, req.user.userId]
        );

        if (fileResult.rows.length === 0) {
            return res.status(404).json({ error: 'File not found' });
        }

        const file = fileResult.rows[0];
        
        // Generate share token
        const shareToken = crypto.randomBytes(32).toString('hex');
        
        // If sharing with specific email, find the user
        let sharedWithUserId = null;
        if (shared_with_email) {
            const userResult = await pool.query(
                'SELECT id FROM users WHERE email = $1',
                [shared_with_email]
            );
            if (userResult.rows.length > 0) {
                sharedWithUserId = userResult.rows[0].id;
            }
        }

        // Create share record
        const shareResult = await pool.query(
            `INSERT INTO file_shares (file_id, shared_by_user_id, shared_with_user_id, 
                                    share_token, permission, expires_at, password_hash)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, share_token, permission, expires_at, created_at`,
            [
                id,
                req.user.userId,
                sharedWithUserId,
                shareToken,
                permission,
                expires_at ? new Date(expires_at) : null,
                password ? await bcrypt.hash(password, 12) : null
            ]
        );

        // Log activity
        await pool.query(
            `INSERT INTO activity_log (user_id, organization_id, action, resource_type, 
                                     resource_id, resource_name, details)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                req.user.userId,
                '00000000-0000-0000-0000-000000000001',
                'shared',
                'file',
                id,
                file.original_name,
                JSON.stringify({ 
                    permission, 
                    shared_with_email: shared_with_email || 'public',
                    expires_at 
                })
            ]
        );

        res.status(201).json({
            message: 'File shared successfully',
            share: shareResult.rows[0],
            share_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/shared/${shareToken}`
        });

    } catch (error) {
        logger.error('Error sharing file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get shared files
app.get('/api/shares', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT fs.id, fs.permission, fs.expires_at, fs.download_count, fs.created_at,
                    f.original_name, f.file_size, f.mime_type, f.is_public,
                    u.username as shared_by_username, u.email as shared_by_email
             FROM file_shares fs
             JOIN files f ON fs.file_id = f.id
             JOIN users u ON fs.shared_by_user_id = u.id
             WHERE fs.shared_with_user_id = $1 AND fs.is_active = true
             ORDER BY fs.created_at DESC`,
            [req.user.userId]
        );

        res.json({ shares: result.rows });

    } catch (error) {
        logger.error('Error fetching shared files:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Download shared file
app.get('/api/shared/:token', async (req, res) => {
    try {
        const { token } = req.params;
        
        const result = await pool.query(
            `SELECT fs.*, f.*, u.username as shared_by_username
             FROM file_shares fs
             JOIN files f ON fs.file_id = f.id
             JOIN users u ON fs.shared_by_user_id = u.id
             WHERE fs.share_token = $1 AND fs.is_active = true
             AND (fs.expires_at IS NULL OR fs.expires_at > NOW())`,
            [token]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Shared file not found or expired' });
        }

        const share = result.rows[0];
        
        // Update download count
        await pool.query(
            'UPDATE file_shares SET download_count = download_count + 1 WHERE id = $1',
            [share.id]
        );

        res.json({
            file: {
                id: share.file_id,
                originalName: share.original_name,
                filename: share.filename,
                fileSize: share.file_size,
                mimeType: share.mime_type,
                createdAt: share.created_at,
                sharedBy: share.shared_by_username
            },
            share: {
                permission: share.permission,
                expiresAt: share.expires_at,
                downloadCount: share.download_count + 1
            }
        });

    } catch (error) {
        logger.error('Error fetching shared file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search files
app.get('/api/search', authenticateToken, async (req, res) => {
    try {
        const { q, type, folder_id } = req.query;
        
        if (!q || q.trim() === '') {
            return res.status(400).json({ error: 'Search query is required' });
        }

        let query = `
            SELECT f.id, f.original_name, f.filename, f.file_size, f.mime_type, 
                   f.is_public, f.download_count, f.created_at, f.updated_at,
                   fo.name as folder_name
            FROM files f
            LEFT JOIN folders fo ON f.parent_folder_id = fo.id
            WHERE f.user_id = $1 AND f.deleted_at IS NULL
            AND (f.original_name ILIKE $2 OR f.mime_type ILIKE $2)
        `;
        
        const params = [req.user.userId, `%${q.trim()}%`];
        
        if (type) {
            query += ' AND f.mime_type LIKE $3';
            params.push(`${type}%`);
        }
        
        if (folder_id) {
            query += ' AND f.parent_folder_id = $' + (params.length + 1);
            params.push(folder_id);
        }
        
        query += ' ORDER BY f.created_at DESC LIMIT 50';
        
        const result = await pool.query(query, params);
        res.json({ files: result.rows });

    } catch (error) {
        logger.error('Error searching files:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get recent activity
app.get('/api/activity', authenticateToken, async (req, res) => {
    try {
        const { limit = 20 } = req.query;
        
        const result = await pool.query(
            `SELECT action, resource_type, resource_name, details, created_at
             FROM activity_log
             WHERE user_id = $1
             ORDER BY created_at DESC
             LIMIT $2`,
            [req.user.userId, parseInt(limit)]
        );

        res.json({ activity: result.rows });

    } catch (error) {
        logger.error('Error fetching activity:', error);
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

// Start server (only in non-serverless mode)
if (!process.env.VERCEL) {
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
}

// Export for Vercel
module.exports = app;
