const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'tauos-secret-key-change-in-production';

// In-memory storage for local development
const users = [];
const emails = [];
let userIdCounter = 1;
let emailIdCounter = 1;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

console.log('🚀 TauMail server running on http://localhost:3001');
console.log('📧 Email domain: @tauos.org');
console.log('💾 Database: In-Memory (Local Development)');

// Email configuration for TauMail email service
const emailConfig = {
  // Development (mock)
  development: {
    transporter: {
      sendMail: async (mailOptions) => {
        console.log('📧 EMAIL SENT:', {
          from: mailOptions.from,
          to: mailOptions.to,
          subject: mailOptions.subject,
          text: mailOptions.text
        });
        return { messageId: 'demo-' + Date.now() };
      }
    }
  },
  
  // Production (real SMTP)
  production: {
    transporter: nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.tauos.org',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'noreply@tauos.org',
        pass: process.env.SMTP_PASSWORD
      }
    })
  }
};

// Use appropriate transporter based on environment
const emailTransporter = process.env.NODE_ENV === 'production' 
  ? emailConfig.production.transporter 
  : emailConfig.development.transporter;

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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    users.push(newUser);

    const token = generateToken(newUser.id, newUser.username);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
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
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
app.get('/api/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      recovery_email: user.recovery_email
    }
  });
});

// Send email
app.post('/api/send-email', authenticateToken, async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    const user = users.find(u => u.id === req.user.userId);

    if (!to || !subject || !body) {
      return res.status(400).json({ error: 'To, subject, and body are required' });
    }

    const newEmail = {
      id: emailIdCounter++,
      from: user.email,
      to: to,
      subject: subject,
      body: body,
      user_id: user.id,
      organization_id: user.organization_id,
      is_starred: false,
      is_read: false,
      folder: 'sent',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    emails.push(newEmail);

    // Send email using transporter
    try {
      await emailTransporter.sendMail({
        from: user.email,
        to: to,
        subject: subject,
        text: body
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Continue anyway for demo purposes
    }

    res.status(201).json({
      message: 'Email sent successfully',
      email: {
        id: newEmail.id,
        from: newEmail.from,
        to: newEmail.to,
        subject: newEmail.subject,
        created_at: newEmail.created_at
      }
    });
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get emails
app.get('/api/emails', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  const { folder = 'inbox', page = 1, limit = 20 } = req.query;

  let userEmails = emails.filter(email => {
    if (folder === 'inbox') {
      return email.to === user.email;
    } else if (folder === 'sent') {
      return email.from === user.email;
    } else if (folder === 'starred') {
      return email.is_starred && (email.to === user.email || email.from === user.email);
    }
    return email.to === user.email;
  });

  // Sort by created_at descending
  userEmails.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedEmails = userEmails.slice(startIndex, endIndex);

  res.json({
    emails: paginatedEmails,
    total: userEmails.length,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(userEmails.length / limit)
  });
});

// Get email by ID
app.get('/api/emails/:id', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  const emailId = parseInt(req.params.id);
  
  const email = emails.find(e => e.id === emailId && (e.to === user.email || e.from === user.email));
  
  if (!email) {
    return res.status(404).json({ error: 'Email not found' });
  }

  // Mark as read
  email.is_read = true;
  email.updated_at = new Date().toISOString();

  res.json({ email });
});

// Star/unstar email
app.patch('/api/emails/:id/star', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  const emailId = parseInt(req.params.id);
  
  const email = emails.find(e => e.id === emailId && (e.to === user.email || e.from === user.email));
  
  if (!email) {
    return res.status(404).json({ error: 'Email not found' });
  }

  email.is_starred = !email.is_starred;
  email.updated_at = new Date().toISOString();

  res.json({
    message: email.is_starred ? 'Email starred' : 'Email unstarred',
    email: {
      id: email.id,
      is_starred: email.is_starred
    }
  });
});

// Delete email
app.delete('/api/emails/:id', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  const emailId = parseInt(req.params.id);
  
  const emailIndex = emails.findIndex(e => e.id === emailId && (e.to === user.email || e.from === user.email));
  
  if (emailIndex === -1) {
    return res.status(404).json({ error: 'Email not found' });
  }

  emails.splice(emailIndex, 1);

  res.json({ message: 'Email deleted successfully' });
});

// Get email counts
app.get('/api/email-counts', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  
  const inboxCount = emails.filter(e => e.to === user.email).length;
  const sentCount = emails.filter(e => e.from === user.email).length;
  const starredCount = emails.filter(e => e.is_starred && (e.to === user.email || e.from === user.email)).length;

  res.json({
    inbox: inboxCount,
    sent: sentCount,
    starred: starredCount
  });
});

// Update user profile
app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { recovery_email } = req.body;
    const user = users.find(u => u.id === req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.recovery_email = recovery_email;
    user.updated_at = new Date().toISOString();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        recovery_email: user.recovery_email
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 