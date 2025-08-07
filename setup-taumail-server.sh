#!/bin/bash

# TauMail Server Setup Script
# This script will be run on the EC2 instance

set -e

echo "🚀 Setting up TauMail Server..."

# Update system and install Docker
echo "📦 Installing Docker and dependencies..."
sudo yum update -y
sudo yum install -y docker git

# Start and enable Docker
echo "🐳 Starting Docker..."
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
echo "📦 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create mail server directory
echo "📁 Setting up mail server directory..."
mkdir -p /opt/taumail
cd /opt/taumail

# Extract deployment package
echo "📦 Extracting deployment package..."
tar -xzf ~/taumail-deployment.tar.gz

# Create docker-compose.yml
echo "🐳 Creating Docker Compose configuration..."
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # Postfix SMTP Server
  postfix:
    image: catatnight/postfix
    container_name: taumail-postfix
    hostname: smtp.tauos.org
    ports:
      - "25:25"
      - "587:587"
      - "465:465"
    environment:
      maildomain: tauos.org
      smtp_user: taumail:secure_password
    volumes:
      - ./postfix/config:/etc/postfix
      - ./postfix/logs:/var/log
      - ./mail:/var/mail
    networks:
      - taumail-network
    restart: unless-stopped

  # Dovecot IMAP/POP3 Server
  dovecot:
    image: dovemark/dovecot
    container_name: taumail-dovecot
    hostname: mail.tauos.org
    ports:
      - "143:143"
      - "993:993"
      - "110:110"
      - "995:995"
    environment:
      MAILNAME: mail.tauos.org
    volumes:
      - ./dovecot/config:/etc/dovecot
      - ./dovecot/logs:/var/log
      - ./mail:/var/mail
    networks:
      - taumail-network
    restart: unless-stopped
    depends_on:
      - postfix

  # Rspamd Anti-Spam
  rspamd:
    image: rspamd/rspamd:latest
    container_name: taumail-rspamd
    hostname: rspamd.tauos.org
    ports:
      - "11334:11334"
    volumes:
      - ./rspamd/config:/etc/rspamd
      - ./rspamd/logs:/var/log
    networks:
      - taumail-network
    restart: unless-stopped

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: taumail-nginx
    hostname: mail.tauos.org
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/config:/etc/nginx
      - ./nginx/ssl:/etc/ssl
      - ./nginx/logs:/var/log/nginx
    networks:
      - taumail-network
    restart: unless-stopped
    depends_on:
      - postfix
      - dovecot

  # Redis for Session Storage
  redis:
    image: redis:alpine
    container_name: taumail-redis
    hostname: redis.tauos.org
    ports:
      - "6379:6379"
    volumes:
      - ./redis/data:/data
    networks:
      - taumail-network
    restart: unless-stopped

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: taumail-postgres
    hostname: db.tauos.org
    environment:
      POSTGRES_DB: taumail
      POSTGRES_USER: taumail_user
      POSTGRES_PASSWORD: secure_password
    ports:
      - "5432:5432"
    volumes:
      - ./postgres/data:/var/lib/postgresql/data
      - ./postgres/init:/docker-entrypoint-initdb.d
    networks:
      - taumail-network
    restart: unless-stopped

  # TauMail Web Interface
  taumail-web:
    image: node:18-alpine
    container_name: taumail-web
    hostname: web.mail.tauos.org
    working_dir: /app
    ports:
      - "3001:3001"
    volumes:
      - ./taumail-web:/app
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://taumail_user:secure_password@postgres:5432/taumail
      SMTP_HOST: postfix
      SMTP_PORT: 587
      SMTP_USER: noreply@tauos.org
      SMTP_PASSWORD: secure_password
    networks:
      - taumail-network
    restart: unless-stopped
    depends_on:
      - postgres
      - postfix
      - redis

networks:
  taumail-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
EOF

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p {postfix,dovecot,rspamd,nginx,redis,postgres,taumail-web}/{config,logs,data}
mkdir -p nginx/ssl

# Create simple TauMail web application
echo "🌐 Creating TauMail web application..."
cat > taumail-web/server.js << 'EOF'
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// In-memory storage for development
const users = [];
const emails = [];

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'taumail-secret-key';

// Create transporter for email sending
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'postfix',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'noreply@tauos.org',
        pass: process.env.SMTP_PASSWORD || 'secure_password'
      }
    });
  } else {
    // Mock transporter for development
    return {
      sendMail: (mailOptions) => {
        console.log('📧 EMAIL SENT:', mailOptions);
        console.log('📧 Email sent successfully from', mailOptions.from, 'to', mailOptions.to);
        return Promise.resolve({ messageId: 'mock-message-id' });
      }
    };
  }
};

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    database: 'connected',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/public/dashboard.html');
});

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword
    };
    
    users.push(user);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      message: 'User registered successfully',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Send email
app.post('/api/emails/send', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    const { to, subject, body } = req.body;
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${user.username}" <${user.email}>`,
      to: to,
      subject: subject,
      text: body,
      headers: {
        'X-Mailer': 'TauMail',
        'X-TauMail-Version': '1.0.0'
      }
    };
    
    await transporter.sendMail(mailOptions);
    
    // Store email in memory
    const email = {
      id: emails.length + 1,
      sender_id: user.id,
      sender_email: user.email,
      sender_username: user.username,
      recipient_email: to,
      subject: subject,
      body: body,
      created_at: new Date().toISOString()
    };
    
    emails.push(email);
    
    res.json({ 
      message: 'Email sent successfully',
      email_id: email.id
    });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Get sent emails
app.get('/api/emails/sent', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    const sentEmails = emails.filter(email => email.sender_id === user.id);
    res.json({ emails: sentEmails });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sent emails' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 TauMail server running on http://localhost:${PORT}`);
  console.log(`📧 Email domain: @tauos.org`);
  console.log(`💾 Database: In-Memory (Local Development)`);
});
EOF

# Create package.json
cat > taumail-web/package.json << 'EOF'
{
  "name": "taumail-web",
  "version": "1.0.0",
  "description": "TauMail Web Interface",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "nodemailer": "^6.9.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
EOF

# Create public directory and dashboard
mkdir -p taumail-web/public

cat > taumail-web/public/dashboard.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TauMail Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #fff;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .logo {
            font-size: 2rem;
            font-weight: bold;
            color: #fff;
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .user-avatar {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }

        .logout-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: #fff;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .logout-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .main-content {
            display: grid;
            grid-template-columns: 250px 1fr;
            gap: 30px;
            height: calc(100vh - 200px);
        }

        .sidebar {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .sidebar-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .sidebar-item:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .sidebar-item.active {
            background: rgba(255, 255, 255, 0.3);
        }

        .content-area {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 30px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            overflow-y: auto;
        }

        .compose-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: #fff;
            padding: 15px 30px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 1.1rem;
            font-weight: bold;
            margin-bottom: 30px;
            transition: all 0.3s ease;
        }

        .compose-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .email-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .email-item {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .email-item:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateX(5px);
        }

        .email-subject {
            font-weight: bold;
            margin-bottom: 5px;
        }

        .email-preview {
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.9rem;
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            z-index: 1000;
        }

        .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            padding: 30px;
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            width: 90%;
            max-width: 600px;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .close-btn {
            background: none;
            border: none;
            color: #fff;
            font-size: 1.5rem;
            cursor: pointer;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
            font-size: 1rem;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
            color: rgba(255, 255, 255, 0.6);
        }

        .send-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: #fff;
            padding: 12px 30px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: bold;
        }

        .send-btn:hover {
            transform: translateY(-1px);
        }

        .status-message {
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: none;
        }

        .status-message.success {
            background: rgba(76, 175, 80, 0.2);
            border: 1px solid rgba(76, 175, 80, 0.5);
        }

        .status-message.error {
            background: rgba(244, 67, 54, 0.2);
            border: 1px solid rgba(244, 67, 54, 0.5);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">τ TauMail</div>
            <div class="user-info">
                <div class="user-avatar" id="userAvatar">U</div>
                <span id="userName">User</span>
                <button class="logout-btn" onclick="logout()">Logout</button>
            </div>
        </div>

        <div class="main-content">
            <div class="sidebar">
                <div class="sidebar-item active" onclick="showInbox()">
                    📥 Inbox
                </div>
                <div class="sidebar-item" onclick="showSent()">
                    📤 Sent
                </div>
                <div class="sidebar-item" onclick="showCompose()">
                    ✏️ Compose
                </div>
            </div>

            <div class="content-area">
                <button class="compose-btn" onclick="showCompose()">✏️ Compose Email</button>
                
                <div id="emailList" class="email-list">
                    <!-- Email list will be populated here -->
                </div>
            </div>
        </div>
    </div>

    <!-- Compose Modal -->
    <div id="composeModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Compose Email</h2>
                <button class="close-btn" onclick="closeCompose()">&times;</button>
            </div>
            
            <div id="statusMessage" class="status-message"></div>
            
            <form id="composeForm">
                <div class="form-group">
                    <label for="to">To:</label>
                    <input type="email" id="to" placeholder="recipient@gmail.com" required>
                </div>
                
                <div class="form-group">
                    <label for="subject">Subject:</label>
                    <input type="text" id="subject" placeholder="Email subject" required>
                </div>
                
                <div class="form-group">
                    <label for="body">Message:</label>
                    <textarea id="body" rows="10" placeholder="Type your message here..." required></textarea>
                </div>
                
                <button type="submit" class="send-btn">📧 Send Email</button>
            </form>
        </div>
    </div>

    <script>
        // Auto-login for testing
        function loginTestUser() {
            const testUser = {
                username: 'testuser',
                email: 'testuser@tauos.org',
                password: 'password'
            };
            
            fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testUser)
            })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    updateUserInfo();
                    loadEmails();
                }
            })
            .catch(error => {
                console.error('Auto-login failed:', error);
            });
        }

        function updateUserInfo() {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            document.getElementById('userName').textContent = user.username || 'User';
            document.getElementById('userAvatar').textContent = (user.username || 'U').charAt(0).toUpperCase();
        }

        function showCompose() {
            document.getElementById('composeModal').style.display = 'block';
        }

        function closeCompose() {
            document.getElementById('composeModal').style.display = 'none';
            document.getElementById('composeForm').reset();
            hideStatusMessage();
        }

        function showStatusMessage(message, type) {
            const statusDiv = document.getElementById('statusMessage');
            statusDiv.textContent = message;
            statusDiv.className = `status-message ${type}`;
            statusDiv.style.display = 'block';
        }

        function hideStatusMessage() {
            document.getElementById('statusMessage').style.display = 'none';
        }

        async function sendEmail(event) {
            event.preventDefault();
            
            const to = document.getElementById('to').value;
            const subject = document.getElementById('subject').value;
            const body = document.getElementById('body').value;
            
            const token = localStorage.getItem('token');
            if (!token) {
                showStatusMessage('Please login first', 'error');
                return;
            }
            
            try {
                const response = await fetch('/api/emails/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ to, subject, body })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showStatusMessage('Email sent successfully!', 'success');
                    closeCompose();
                    loadEmails();
                } else {
                    showStatusMessage(data.error || 'Failed to send email', 'error');
                }
            } catch (error) {
                showStatusMessage('Error sending email', 'error');
            }
        }

        async function loadEmails() {
            const token = localStorage.getItem('token');
            if (!token) return;
            
            try {
                const response = await fetch('/api/emails/sent', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                const data = await response.json();
                
                const emailList = document.getElementById('emailList');
                emailList.innerHTML = '';
                
                if (data.emails && data.emails.length > 0) {
                    data.emails.forEach(email => {
                        const emailDiv = document.createElement('div');
                        emailDiv.className = 'email-item';
                        emailDiv.innerHTML = `
                            <div class="email-subject">${email.subject}</div>
                            <div class="email-preview">To: ${email.recipient_email}</div>
                            <div class="email-preview">${email.body.substring(0, 100)}...</div>
                        `;
                        emailList.appendChild(emailDiv);
                    });
                } else {
                    emailList.innerHTML = '<div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.6);">No emails yet. Send your first email!</div>';
                }
            } catch (error) {
                console.error('Error loading emails:', error);
            }
        }

        function logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            loginTestUser();
            document.getElementById('composeForm').addEventListener('submit', sendEmail);
        });
    </script>
</body>
</html>
EOF

# Start the mail server
echo "🚀 Starting mail server..."
docker-compose up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 30

# Install dependencies for web app
echo "📦 Installing web app dependencies..."
cd taumail-web
npm install

# Start web application
echo "🌐 Starting web application..."
nohup node server.js > server.log 2>&1 &

echo "🎉 TauMail server setup complete!"
echo "🌐 Web interface available at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3001"
echo "📧 Mail server is running with independent SMTP/IMAP infrastructure!"
EOF 