const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'TauOS Simple Backend v1.0',
    timestamp: new Date().toISOString()
  });
});

// File routes
app.get('/api/files', (req, res) => {
  res.json({
    files: [
      {
        id: 1,
        name: 'Welcome.txt',
        size: 1024,
        type: 'text/plain',
        created: new Date().toISOString()
      }
    ]
  });
});

app.post('/api/upload', (req, res) => {
  res.json({
    message: 'File uploaded successfully',
    fileId: Math.random().toString(36).substr(2, 9)
  });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email && password) {
    res.json({
      message: 'Login successful',
      token: 'demo-token-' + Math.random().toString(36).substr(2, 9),
      user: {
        id: 1,
        email: email,
        username: email.split('@')[0]
      }
    });
  } else {
    res.status(400).json({ error: 'Email and password required' });
  }
});

// Email routes
app.get('/api/emails/inbox', (req, res) => {
  res.json({
    emails: [
      {
        id: 1,
        from: 'welcome@tauos.org',
        subject: 'Welcome to TauOS!',
        preview: 'Your account is ready to use.',
        time: 'Just now',
        unread: true
      }
    ]
  });
});

app.post('/api/emails/send', (req, res) => {
  res.json({
    message: 'Email sent successfully',
    messageId: 'msg-' + Math.random().toString(36).substr(2, 9)
  });
});

// Catch all
app.get('*', (req, res) => {
  res.json({ error: 'Endpoint not found' });
});

// Start server
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Simple Backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;
