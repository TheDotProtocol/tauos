const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg'); // PostgreSQL client
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'tauos-secret-key-change-in-production';

// For Vercel serverless, we'll use in-memory storage instead of file system
const UPLOAD_DIR = process.env.NODE_ENV === 'production' ? '/tmp' : './uploads';

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Test database connection with retry logic
const testDatabaseConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT NOW()');
      client.release();
      console.log('✅ Database connected successfully');
      return true;
    } catch (err) {
      console.error(`❌ Database connection attempt ${i + 1} failed:`, err.message);
      if (i < retries - 1) {
        console.log(`🔄 Retrying in 5 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
  console.error('❌ All database connection attempts failed');
  return false;
};

// Initialize database connection
testDatabaseConnection();

// Configure multer for file uploads (memory storage for serverless)
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
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Get TauOS organization
    const orgResult = await pool.query(
      'SELECT id FROM organizations WHERE domain = $1',
      ['tauos.org']
    );

    if (orgResult.rows.length === 0) {
      return res.status(500).json({ error: 'Organization not found' });
    }

    const organizationId = orgResult.rows[0].id;

    // Create user
    const result = await pool.query(
      `INSERT INTO users (organization_id, username, email, password_hash, recovery_email) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email`,
      [organizationId, username, email, passwordHash, recovery_email]
    );

    const token = generateToken(result.rows[0].id, result.rows[0].username);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.rows[0].id,
        username: result.rows[0].username,
        email: result.rows[0].email
      },
      token
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

    // Find user
    const result = await pool.query(
      'SELECT id, username, email, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    const token = generateToken(user.id, user.username);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, recovery_email, created_at, last_login FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Upload file (simplified for serverless)
app.post('/api/files/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { originalname, buffer, size, mimetype } = req.file;
    const fileType = getFileType(mimetype);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${originalname}`;

    // Get organization ID
    const orgResult = await pool.query(
      'SELECT organization_id FROM users WHERE id = $1',
      [req.user.userId]
    );

    const organizationId = orgResult.rows[0].organization_id;

    // Check storage limits
    const storageResult = await pool.query(
      'SELECT check_storage_limit($1, $2, $3) as can_upload',
      [organizationId, req.user.userId, size]
    );

    if (!storageResult.rows[0].can_upload) {
      return res.status(413).json({ error: 'Storage limit exceeded' });
    }

    // Save file record (without physical file for serverless)
    const result = await pool.query(
      `INSERT INTO files (organization_id, user_id, original_name, filename, file_path, file_size, mime_type, file_type) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [organizationId, req.user.userId, originalname, filename, 'memory://' + filename, size, mimetype, fileType]
    );

    // Update storage usage
    await pool.query(
      'SELECT update_storage_usage($1, $2, $3)',
      [organizationId, req.user.userId, size]
    );

    res.json({
      message: 'File uploaded successfully',
      file_id: result.rows[0].id,
      file_type: fileType
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Get user files
app.get('/api/files', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, original_name, filename, file_size, mime_type, file_type, created_at 
       FROM files 
       WHERE user_id = $1 AND is_deleted = false 
       ORDER BY created_at DESC`,
      [req.user.userId]
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Failed to get files' });
  }
});

// Download file (simplified for serverless)
app.get('/api/files/:id/download', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT filename, original_name, mime_type FROM files WHERE id = $1 AND user_id = $2 AND is_deleted = false',
      [req.params.id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = result.rows[0];

    // For serverless, we can't serve actual files, so return file info
    res.json({
      message: 'File info retrieved',
      filename: file.original_name,
      mime_type: file.mime_type,
      note: 'File download not available in serverless environment'
    });

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to get file info' });
  }
});

// Delete file
app.delete('/api/files/:id', authenticateToken, async (req, res) => {
  try {
    // Get file info
    const result = await pool.query(
      'SELECT filename, file_size FROM files WHERE id = $1 AND user_id = $2 AND is_deleted = false',
      [req.params.id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = result.rows[0];

    // Mark as deleted
    await pool.query(
      'UPDATE files SET is_deleted = true WHERE id = $1',
      [req.params.id]
    );

    // Update storage usage (subtract file size)
    const orgResult = await pool.query(
      'SELECT organization_id FROM users WHERE id = $1',
      [req.user.userId]
    );

    const organizationId = orgResult.rows[0].organization_id;

    await pool.query(
      'SELECT update_storage_usage($1, $2, $3)',
      [organizationId, req.user.userId, -file.file_size]
    );

    res.json({ message: 'File deleted successfully' });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Create folder
app.post('/api/folders', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Folder name is required' });
    }

    // Get organization ID
    const orgResult = await pool.query(
      'SELECT organization_id FROM users WHERE id = $1',
      [req.user.userId]
    );

    const organizationId = orgResult.rows[0].organization_id;

    const result = await pool.query(
      `INSERT INTO folders (organization_id, user_id, name) 
       VALUES ($1, $2, $3) RETURNING id, name`,
      [organizationId, req.user.userId, name]
    );

    res.status(201).json({
      message: 'Folder created successfully',
      folder: result.rows[0]
    });

  } catch (error) {
    console.error('Create folder error:', error);
    res.status(500).json({ error: 'Failed to create folder' });
  }
});

// Get storage stats
app.get('/api/storage/stats', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT get_user_storage_stats($1) as stats',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const stats = result.rows[0].stats;

    res.json({
      user_storage_used: parseInt(stats.user_storage_used),
      user_storage_limit: parseInt(stats.user_storage_limit),
      user_storage_percentage: parseFloat(stats.user_storage_percentage),
      org_storage_used: parseInt(stats.org_storage_used),
      org_storage_limit: parseInt(stats.org_storage_limit),
      org_storage_percentage: parseFloat(stats.org_storage_percentage)
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get storage stats' });
  }
});

// Password reset request
app.post('/api/password/reset-request', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    const result = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // In production, send reset email
    res.json({ message: 'Password reset email sent (simulated)' });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
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

// Vercel serverless function export
module.exports = app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`☁️ TauCloud server running on http://localhost:${PORT}`);
    console.log(`📧 Email domain: @tauos.org`);
    console.log(`💾 Database: PostgreSQL (Supabase)`);
    console.log(`📁 Upload directory: ${UPLOAD_DIR}`);
  });
} 