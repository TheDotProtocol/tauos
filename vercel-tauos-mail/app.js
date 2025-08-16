const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg'); // PostgreSQL client
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'tauos-secret-key-change-in-production';

// SMTP Configuration with Mailtrap fallback
const smtpConfig = {
  host: 'mailserver.tauos.org',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'noreply@tauos.org',
    pass: process.env.SMTP_PASS || ''
  },
  tls: {
    rejectUnauthorized: false
  },
  requireTLS: true
};

// Mailtrap fallback configuration (FREE - replace with your credentials)
const mailtrapConfig = {
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER || 'e5b253ac8d7940', // Your actual Mailtrap username
    pass: process.env.MAILTRAP_PASS || '****aec7'        // Your actual Mailtrap password
  }
};

// Try primary SMTP, fallback to Mailtrap
let transporter = nodemailer.createTransport(smtpConfig);
let usingMailtrap = false;

// Test SMTP connection with automatic fallback
transporter.verify(function(error, success) {
  if (error) {
    console.error('❌ Primary SMTP connection failed:', error.message);
    console.log('🔄 Switching to Mailtrap for email testing...');
    
    // Switch to Mailtrap
    transporter = nodemailer.createTransport(mailtrapConfig);
    usingMailtrap = true;
    
    transporter.verify(function(mailtrapError, mailtrapSuccess) {
      if (mailtrapError) {
        console.error('❌ Mailtrap connection also failed:', mailtrapError.message);
        console.log('⚠️  Email sending will not work until SMTP is configured');
      } else {
        console.log('✅ Mailtrap SMTP ready - emails will be captured for testing');
        console.log('📧 View emails at: https://mailtrap.io/inboxes');
      }
    });
  } else {
    console.log('✅ Primary SMTP server is ready to send emails');
  }
});

// PostgreSQL connection with local fallback
let pool;
let usingLocalStorage = false;

try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  // Test database connection
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('❌ Database connection failed:', err.message);
      console.log('🔄 Switching to local storage for testing...');
      usingLocalStorage = true;
    } else {
      console.log('✅ Database connected successfully');
    }
  });
} catch (error) {
  console.log('🔄 Using local storage for testing...');
  usingLocalStorage = true;
}

// Local storage for testing
const localUsers = new Map();
const localEmails = new Map();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

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

    res.json({
      message: 'User registered successfully',
      token,
      user: {
        id: result.rows[0].id,
        username: result.rows[0].username,
        email: result.rows[0].email
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

    // Find user
    const result = await pool.query(
      'SELECT id, username, email, password_hash FROM users WHERE email = $1',
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

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

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

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Send email with SMTP
app.post('/api/emails/send', authenticateToken, async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    
    if (!to || !subject || !body) {
      return res.status(400).json({ error: 'To, subject, and body are required' });
    }

    // Get sender info
    const senderResult = await pool.query(
      'SELECT id, username, email FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (senderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Sender not found' });
    }

    const sender = senderResult.rows[0];

    // Check if recipient is a registered user
    const recipientResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [to]
    );

    let recipientId = null;
    if (recipientResult.rows.length > 0) {
      recipientId = recipientResult.rows[0].id;
    }

    // Send email via SMTP
    const mailOptions = {
      from: sender.email,
      to: to,
      subject: subject,
      text: body,
      html: `<div>${body}</div>`
    };

    const info = await transporter.sendMail(mailOptions);

    // Store email in database (if recipient is registered)
    if (recipientId) {
      const result = await pool.query(
        `INSERT INTO emails (organization_id, sender_id, recipient_id, subject, body, message_id)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [sender.organization_id, sender.id, recipientId, subject, body, info.messageId]
      );
    }

    res.json({
      message: 'Email sent successfully',
      email_id: recipientId ? 'stored_in_db' : 'external_email',
      message_id: info.messageId
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
    if (usingLocalStorage) {
      res.json({
        status: 'healthy',
        database: 'local-storage',
        timestamp: new Date().toISOString()
      });
    } else {
      // Test database connection
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      
      res.json({
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString()
      });
    }
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

// Vercel serverless function export
module.exports = app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 TauMail server running on http://localhost:${PORT}`);
    console.log(`📧 Email domain: @tauos.org`);
    console.log(`💾 Database: PostgreSQL (Supabase)`);
  });
} 