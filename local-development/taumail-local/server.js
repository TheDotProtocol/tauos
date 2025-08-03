const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
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

// Send email
app.post('/api/emails/send', authenticateToken, async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    
    if (!to || !subject || !body) {
      return res.status(400).json({ error: 'To, subject, and body are required' });
    }

    // Find recipient
    const recipient = users.find(u => u.email === to);
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Create email
    const newEmail = {
      id: emailIdCounter++,
      organization_id: 1,
      sender_id: req.user.userId,
      recipient_id: recipient.id,
      subject,
      body,
      is_read: false,
      is_starred: false,
      is_deleted: false,
      created_at: new Date().toISOString()
    };

    emails.push(newEmail);

    res.json({
      message: 'Email sent successfully',
      email_id: newEmail.id
    });

  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Get inbox emails
app.get('/api/emails/inbox', authenticateToken, async (req, res) => {
  try {
    const userEmails = emails.filter(e => 
      e.recipient_id === req.user.userId && !e.is_deleted
    );

    const emailsWithSender = userEmails.map(email => {
      const sender = users.find(u => u.id === email.sender_id);
      return {
        id: email.id,
        subject: email.subject,
        body: email.body,
        is_read: email.is_read,
        is_starred: email.is_starred,
        created_at: email.created_at,
        sender_username: sender ? sender.username : 'Unknown',
        sender_email: sender ? sender.email : 'unknown@tauos.org'
      };
    });

    res.json(emailsWithSender);

  } catch (error) {
    console.error('Get inbox error:', error);
    res.status(500).json({ error: 'Failed to get inbox' });
  }
});

// Get sent emails
app.get('/api/emails/sent', authenticateToken, async (req, res) => {
  try {
    const userEmails = emails.filter(e => 
      e.sender_id === req.user.userId && !e.is_deleted
    );

    const emailsWithRecipient = userEmails.map(email => {
      const recipient = users.find(u => u.id === email.recipient_id);
      return {
        id: email.id,
        subject: email.subject,
        body: email.body,
        created_at: email.created_at,
        recipient_username: recipient ? recipient.username : 'Unknown',
        recipient_email: recipient ? recipient.email : 'unknown@tauos.org'
      };
    });

    res.json(emailsWithRecipient);

  } catch (error) {
    console.error('Get sent error:', error);
    res.status(500).json({ error: 'Failed to get sent emails' });
  }
});

// Get single email
app.get('/api/emails/:id', authenticateToken, async (req, res) => {
  try {
    const email = emails.find(e => 
      e.id === parseInt(req.params.id) && 
      (e.sender_id === req.user.userId || e.recipient_id === req.user.userId)
    );

    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    const sender = users.find(u => u.id === email.sender_id);
    const recipient = users.find(u => u.id === email.recipient_id);

    const emailWithDetails = {
      ...email,
      sender_username: sender ? sender.username : 'Unknown',
      sender_email: sender ? sender.email : 'unknown@tauos.org',
      recipient_username: recipient ? recipient.username : 'Unknown',
      recipient_email: recipient ? recipient.email : 'unknown@tauos.org'
    };

    res.json(emailWithDetails);

  } catch (error) {
    console.error('Get email error:', error);
    res.status(500).json({ error: 'Failed to get email' });
  }
});

// Mark email as read
app.put('/api/emails/:id/read', authenticateToken, async (req, res) => {
  try {
    const email = emails.find(e => 
      e.id === parseInt(req.params.id) && 
      e.recipient_id === req.user.userId
    );

    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    email.is_read = true;
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
    
    const email = emails.find(e => 
      e.id === parseInt(req.params.id) && 
      (e.sender_id === req.user.userId || e.recipient_id === req.user.userId)
    );

    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    email.is_starred = starred;
    res.json({ message: starred ? 'Email starred' : 'Email unstarred' });

  } catch (error) {
    console.error('Star email error:', error);
    res.status(500).json({ error: 'Failed to star email' });
  }
});

// Delete email
app.delete('/api/emails/:id', authenticateToken, async (req, res) => {
  try {
    const email = emails.find(e => 
      e.id === parseInt(req.params.id) && 
      (e.sender_id === req.user.userId || e.recipient_id === req.user.userId)
    );

    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    email.is_deleted = true;
    res.json({ message: 'Email deleted' });

  } catch (error) {
    console.error('Delete email error:', error);
    res.status(500).json({ error: 'Failed to delete email' });
  }
});

// Get email stats
app.get('/api/emails/stats', authenticateToken, async (req, res) => {
  try {
    const inboxCount = emails.filter(e => 
      e.recipient_id === req.user.userId && !e.is_deleted && !e.is_read
    ).length;

    const sentCount = emails.filter(e => 
      e.sender_id === req.user.userId && !e.is_deleted
    ).length;

    const starredCount = emails.filter(e => 
      (e.sender_id === req.user.userId || e.recipient_id === req.user.userId) && 
      e.is_starred && !e.is_deleted
    ).length;

    res.json({
      inbox: inboxCount,
      sent: sentCount,
      starred: starredCount
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
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // In production, send reset email
    res.json({ message: 'Password reset email sent (simulated)' });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

// Serve static files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 