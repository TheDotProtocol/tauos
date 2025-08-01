const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { logger } = require('../utils/logger');
const { minioClient } = require('../utils/minio');
const File = require('../models/File');
const User = require('../models/User');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types for now, can be restricted later
    cb(null, true);
  },
});

/**
 * @swagger
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         originalName:
 *           type: string
 *         size:
 *           type: number
 *         mimeType:
 *           type: string
 *         path:
 *           type: string
 *         folderId:
 *           type: string
 *         userId:
 *           type: string
 *         isEncrypted:
 *           type: boolean
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 */

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               folderId:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: Validation error
 *       413:
 *         description: File too large
 */
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided',
      });
    }

    const { folderId, name } = req.body;
    const userId = req.user.userId;

    // Check user storage quota
    const user = await User.findById(userId);
    if (user.storageUsed + req.file.size > user.storageLimit) {
      return res.status(413).json({
        success: false,
        message: 'Storage quota exceeded',
      });
    }

    // Generate encryption key (in real implementation, this would be derived from user's password)
    const encryptionKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    // Encrypt file content
    const cipher = crypto.createCipher('aes-256-gcm', encryptionKey);
    let encryptedData = cipher.update(req.file.buffer, null, 'hex');
    encryptedData += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    // Generate unique file ID
    const fileId = uuidv4();
    const fileName = name || req.file.originalname;
    const filePath = `${userId}/${fileId}`;

    // Upload encrypted file to MinIO
    await minioClient.putObject(
      process.env.MINIO_BUCKET,
      filePath,
      Buffer.from(encryptedData, 'hex'),
      {
        'Content-Type': req.file.mimetype,
        'X-Amz-Meta-Encryption-Key': encryptionKey.toString('base64'),
        'X-Amz-Meta-IV': iv.toString('base64'),
        'X-Amz-Meta-Auth-Tag': authTag.toString('base64'),
      }
    );

    // Save file metadata to database
    const file = await File.create({
      id: fileId,
      name: fileName,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
      path: filePath,
      folderId: folderId || null,
      userId,
      isEncrypted: true,
      encryptionKey: encryptionKey.toString('base64'),
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
    });

    // Update user storage usage
    await User.updateStorageUsage(userId, user.storageUsed + req.file.size);

    logger.info(`File uploaded: ${fileName} by user ${userId}`);

    res.status(201).json({
      success: true,
      file: {
        id: file.id,
        name: file.name,
        originalName: file.originalName,
        size: file.size,
        mimeType: file.mimeType,
        folderId: file.folderId,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
      },
    });
  } catch (error) {
    logger.error('File upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * @swagger
 * /api/files/download/{fileId}:
 *   get:
 *     summary: Download a file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *       404:
 *         description: File not found
 *       403:
 *         description: Access denied
 */
router.get('/download/:fileId', authenticateToken, async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user.userId;

    // Get file metadata
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    // Check access permissions
    if (file.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Download encrypted file from MinIO
    const encryptedData = await minioClient.getObject(process.env.MINIO_BUCKET, file.path);

    // Decrypt file content
    const encryptionKey = Buffer.from(file.encryptionKey, 'base64');
    const iv = Buffer.from(file.iv, 'base64');
    const authTag = Buffer.from(file.authTag, 'base64');

    const decipher = crypto.createDecipher('aes-256-gcm', encryptionKey);
    decipher.setAuthTag(authTag);

    let decryptedData = decipher.update(encryptedData, null, 'utf8');
    decryptedData += decipher.final('utf8');

    // Set response headers
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.setHeader('Content-Length', file.size);

    // Send decrypted file
    res.send(Buffer.from(decryptedData, 'utf8'));

    logger.info(`File downloaded: ${file.name} by user ${userId}`);
  } catch (error) {
    logger.error('File download error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * @swagger
 * /api/files/{fileId}:
 *   get:
 *     summary: Get file metadata
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File metadata retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 file:
 *                   $ref: '#/components/schemas/File'
 *       404:
 *         description: File not found
 */
router.get('/:fileId', authenticateToken, async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user.userId;

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    // Check access permissions
    if (file.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      file: {
        id: file.id,
        name: file.name,
        originalName: file.originalName,
        size: file.size,
        mimeType: file.mimeType,
        folderId: file.folderId,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Get file error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * @swagger
 * /api/files/{fileId}:
 *   put:
 *     summary: Update file metadata
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               folderId:
 *                 type: string
 *     responses:
 *       200:
 *         description: File updated successfully
 *       404:
 *         description: File not found
 */
router.put('/:fileId', [
  authenticateToken,
  body('name').optional().trim().isLength({ min: 1 }).withMessage('Name cannot be empty'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { fileId } = req.params;
    const userId = req.user.userId;
    const { name, folderId } = req.body;

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    // Check access permissions
    if (file.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Update file
    const updatedFile = await File.update(fileId, {
      name: name || file.name,
      folderId: folderId !== undefined ? folderId : file.folderId,
    });

    logger.info(`File updated: ${file.name} by user ${userId}`);

    res.json({
      success: true,
      file: {
        id: updatedFile.id,
        name: updatedFile.name,
        originalName: updatedFile.originalName,
        size: updatedFile.size,
        mimeType: updatedFile.mimeType,
        folderId: updatedFile.folderId,
        createdAt: updatedFile.createdAt,
        updatedAt: updatedFile.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Update file error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * @swagger
 * /api/files/{fileId}:
 *   delete:
 *     summary: Delete a file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       404:
 *         description: File not found
 */
router.delete('/:fileId', authenticateToken, async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user.userId;

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    // Check access permissions
    if (file.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Delete file from MinIO
    await minioClient.removeObject(process.env.MINIO_BUCKET, file.path);

    // Delete file metadata from database
    await File.delete(fileId);

    // Update user storage usage
    const user = await User.findById(userId);
    await User.updateStorageUsage(userId, user.storageUsed - file.size);

    logger.info(`File deleted: ${file.name} by user ${userId}`);

    res.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    logger.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * @swagger
 * /api/files/search:
 *   get:
 *     summary: Search files
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: folderId
 *         schema:
 *           type: string
 *         description: Folder ID to search in
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Files retrieved successfully
 */
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { q, folderId, page = 1, limit = 20 } = req.query;

    const files = await File.search(userId, {
      query: q,
      folderId,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      files: files.map(file => ({
        id: file.id,
        name: file.name,
        originalName: file.originalName,
        size: file.size,
        mimeType: file.mimeType,
        folderId: file.folderId,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: files.length,
      },
    });
  } catch (error) {
    logger.error('Search files error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

module.exports = router; 