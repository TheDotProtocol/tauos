const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'tauos-secret-key-change-in-production';

// In-memory storage for local development
const users = [];
const files = [];
let userIdCounter = 1;
let fileIdCounter = 1;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

console.log('☁️ TauCloud server running on http://localhost:3002');
console.log('📧 Email domain: @tauos.org');
console.log('💾 Database: In-Memory (Local Development)');
console.log('📁 Upload directory: ./uploads');

// Configure multer for file uploads (memory storage for local development)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage, 
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

const generateToken = (userId, username) => {
  return jwt.sign(
    { userId, username },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Helper function to determine file type from MIME type
const getFileType = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('text/') || mimeType.includes('document') || mimeType.includes('pdf')) return 'document';
  return 'other';
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: 'in-memory',
    timestamp: new Date().toISOString()
  });
});

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, recovery_email } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const email = `${username}@tauos.org`;
    const passwordHash = await bcrypt.hash(password, 12);

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create user
    const newUser = {
      id: userIdCounter++,
      username,
      email,
      password_hash: passwordHash,
      recovery_email,
      organization_id: 1,
      created_at: new Date().toISOString()
    };

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser.id, newUser.username);

    res.json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const email = `${username}@tauos.org`;
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id, user.username);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Upload file
app.post('/api/files/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { originalname, mimetype, size, buffer } = req.file;
    const fileType = getFileType(mimetype);

    // Create file record
    const newFile = {
      id: fileIdCounter++,
      organization_id: 1,
      user_id: req.user.userId,
      name: originalname,
      type: fileType,
      size: size,
      mime_type: mimetype,
      data: buffer,
      created_at: new Date().toISOString()
    };

    files.push(newFile);

    res.json({
      message: 'File uploaded successfully',
      file: {
        id: newFile.id,
        name: newFile.name,
        type: newFile.type,
        size: newFile.size,
        created_at: newFile.created_at
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Get files
app.get('/api/files', authenticateToken, async (req, res) => {
  try {
    const userFiles = files.filter(f => f.user_id === req.user.userId);

    const filesWithDetails = userFiles.map(file => ({
      id: file.id,
      name: file.name,
      type: file.type,
      size: file.size,
      mime_type: file.mime_type,
      created_at: file.created_at
    }));

    res.json(filesWithDetails);

  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Failed to get files' });
  }
});

// Download file
app.get('/api/files/:id/download', authenticateToken, async (req, res) => {
  try {
    const file = files.find(f => 
      f.id === parseInt(req.params.id) && f.user_id === req.user.userId
    );

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.setHeader('Content-Type', file.mime_type);
    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
    res.send(file.data);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// Delete file
app.delete('/api/files/:id', authenticateToken, async (req, res) => {
  try {
    const fileIndex = files.findIndex(f => 
      f.id === parseInt(req.params.id) && f.user_id === req.user.userId
    );

    if (fileIndex === -1) {
      return res.status(404).json({ error: 'File not found' });
    }

    files.splice(fileIndex, 1);

    res.json({ message: 'File deleted successfully' });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Get storage stats
app.get('/api/storage/stats', authenticateToken, async (req, res) => {
  try {
    const userFiles = files.filter(f => f.user_id === req.user.userId);
    const totalSize = userFiles.reduce((sum, file) => sum + file.size, 0);
    const fileCount = userFiles.length;

    res.json({
      total_size: totalSize,
      file_count: fileCount,
      used_gb: (totalSize / (1024 * 1024 * 1024)).toFixed(2),
      total_gb: 10
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to get storage stats' });
  }
});

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/files', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'files.html'));
});

// Catch-all route for other static files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 