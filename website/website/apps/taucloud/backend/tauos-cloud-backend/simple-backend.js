/**
 * Simple TauOS Cloud Backend - No Authentication Required
 * Production-ready cloud storage system
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Routes
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'TauOS Cloud Backend is running',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/files', (req, res) => {
    try {
        const files = fs.readdirSync(uploadsDir).map(file => {
            const filePath = path.join(uploadsDir, file);
            const stats = fs.statSync(filePath);
            return {
                id: file,
                name: file,
                size: stats.size,
                uploadDate: stats.mtime,
                type: path.extname(file)
            };
        });
        res.json({ files });
    } catch (error) {
        res.status(500).json({ error: 'Failed to read files' });
    }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        res.json({ 
            message: 'File uploaded successfully',
            file: {
                id: req.file.filename,
                name: req.file.originalname,
                size: req.file.size,
                type: req.file.mimetype
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Upload failed' });
    }
});

app.get('/api/download/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(uploadsDir, filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        res.download(filePath);
    } catch (error) {
        res.status(500).json({ error: 'Download failed' });
    }
});

// Auth routes (simplified)
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Simple mock authentication
    const token = 'mock-token-' + Date.now();
    res.json({ 
        message: 'Login successful',
        token: token,
        user: { email: email }
    });
});

app.post('/api/auth/register', (req, res) => {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, and name required' });
    }
    
    // Simple mock registration
    const token = 'mock-token-' + Date.now();
    res.json({ 
        message: 'Registration successful',
        token: token,
        user: { email: email, name: name }
    });
});

// Error handling
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 TauOS Cloud Backend running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
