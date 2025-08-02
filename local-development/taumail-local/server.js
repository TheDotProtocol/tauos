const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg'); // PostgreSQL client
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'tauos-secret-key-change-in-production';

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Ak1233%40%405@db.tviqcormikopltejomkc.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Database connected successfully');
  }
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

// Send email
app.post('/api/emails/send', authenticateToken, async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    
    if (!to || !subject || !body) {
      return res.status(400).json({ error: 'To, subject, and body are required' });
    }

    // Find recipient
    const recipientResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [to]
    );

    if (recipientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const recipientId = recipientResult.rows[0].id;

    // Get organization ID
    const orgResult = await pool.query(
      'SELECT organization_id FROM users WHERE id = $1',
      [req.user.userId]
    );

    const organizationId = orgResult.rows[0].organization_id;

    // Create email
    const result = await pool.query(
      `INSERT INTO emails (organization_id, sender_id, recipient_id, subject, body) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [organizationId, req.user.userId, recipientId, subject, body]
    );

    res.json({
      message: 'Email sent successfully',
      email_id: result.rows[0].id
    });

  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Get inbox emails
app.get('/api/emails/inbox', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.id, e.subject, e.body, e.is_read, e.is_starred, e.created_at,
              u.username as sender_username, u.email as sender_email
       FROM emails e
       JOIN users u ON e.sender_id = u.id
       WHERE e.recipient_id = $1 AND e.is_deleted = false
       ORDER BY e.created_at DESC`,
      [req.user.userId]
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Get inbox error:', error);
    res.status(500).json({ error: 'Failed to get inbox' });
  }
});

// Get sent emails
app.get('/api/emails/sent', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.id, e.subject, e.body, e.created_at,
              u.username as recipient_username, u.email as recipient_email
       FROM emails e
       JOIN users u ON e.recipient_id = u.id
       WHERE e.sender_id = $1 AND e.is_deleted = false
       ORDER BY e.created_at DESC`,
      [req.user.userId]
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Get sent error:', error);
    res.status(500).json({ error: 'Failed to get sent emails' });
  }
});

// Get single email
app.get('/api/emails/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, 
              sender.username as sender_username, sender.email as sender_email,
              recipient.username as recipient_username, recipient.email as recipient_email
       FROM emails e
       JOIN users sender ON e.sender_id = sender.id
       JOIN users recipient ON e.recipient_id = recipient.id
       WHERE e.id = $1 AND (e.sender_id = $2 OR e.recipient_id = $2)`,
      [req.params.id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Get email error:', error);
    res.status(500).json({ error: 'Failed to get email' });
  }
});

// Mark email as read
app.patch('/api/emails/:id/read', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE emails SET is_read = true WHERE id = $1 AND recipient_id = $2',
      [req.params.id, req.user.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    res.json({ message: 'Email marked as read' });

  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to mark email as read' });
  }
});

// Star/unstar email
app.patch('/api/emails/:id/star', authenticateToken, async (req, res) => {
  try {
    const { starred } = req.body;
    
    const result = await pool.query(
      'UPDATE emails SET is_starred = $1 WHERE id = $2 AND (sender_id = $3 OR recipient_id = $3)',
      [starred, req.params.id, req.user.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    res.json({ message: starred ? 'Email starred' : 'Email unstarred' });

  } catch (error) {
    console.error('Star email error:', error);
    res.status(500).json({ error: 'Failed to star email' });
  }
});

// Delete email
app.delete('/api/emails/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE emails SET is_deleted = true WHERE id = $1 AND (sender_id = $2 OR recipient_id = $2)',
      [req.params.id, req.user.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    res.json({ message: 'Email deleted' });

  } catch (error) {
    console.error('Delete email error:', error);
    res.status(500).json({ error: 'Failed to delete email' });
  }
});

// Get email stats
app.get('/api/emails/stats', authenticateToken, async (req, res) => {
  try {
    const inboxCount = await pool.query(
      'SELECT COUNT(*) as count FROM emails WHERE recipient_id = $1 AND is_deleted = false AND is_read = false',
      [req.user.userId]
    );

    const sentCount = await pool.query(
      'SELECT COUNT(*) as count FROM emails WHERE sender_id = $1 AND is_deleted = false',
      [req.user.userId]
    );

    const starredCount = await pool.query(
      'SELECT COUNT(*) as count FROM emails WHERE (sender_id = $1 OR recipient_id = $1) AND is_starred = true AND is_deleted = false',
      [req.user.userId]
    );

    res.json({
      inbox: parseInt(inboxCount.rows[0].count),
      sent: parseInt(sentCount.rows[0].count),
      starred: parseInt(starredCount.rows[0].count)
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
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

app.get('/email', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'email.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TauMail server running on http://localhost:${PORT}`);
  console.log(`📧 Email domain: @tauos.org`);
  console.log(`💾 Database: PostgreSQL (Supabase)`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down TauMail server...');
  pool.end();
  process.exit(0);
}); 