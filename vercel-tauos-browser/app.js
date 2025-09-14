const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection (disabled for demo)
let pool = null;
console.log('⚠️ Database connection disabled for demo - using mock data');

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'TauBrowser API is working!' });
});

// API Routes
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Mock registration for demo
        const user = { 
            id: uuidv4(), 
            username: username, 
            email: email 
        };
        const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '24h' });

        res.json({ 
            success: true, 
            user: user,
            token 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Mock login for demo - accept john@tauos.org / password123
        if (email === 'john@tauos.org' && password === 'password123') {
            const user = { 
                id: uuidv4(), 
                username: 'john', 
                email: 'john@tauos.org' 
            };
            const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '24h' });

            res.json({ 
                success: true, 
                user: user,
                token 
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

app.get('/api/user/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, 'your-secret-key');
        
        // Mock user profile
        const user = {
            id: decoded.userId,
            username: 'john',
            email: 'john@tauos.org',
            created_at: new Date().toISOString()
        };

        res.json({ user });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});

app.get('/api/browsing/history', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, 'your-secret-key');
        
        // Mock browsing history
        const history = [
            {
                id: uuidv4(),
                url: 'https://tauos.org',
                title: 'TauOS - Privacy-First Operating System',
                favicon: 'https://tauos.org/favicon.ico',
                visited_at: new Date().toISOString()
            },
            {
                id: uuidv4(),
                url: 'https://github.com',
                title: 'GitHub',
                favicon: 'https://github.com/favicon.ico',
                visited_at: new Date(Date.now() - 3600000).toISOString()
            }
        ];

        res.json({ history });
    } catch (error) {
        console.error('History error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

app.post('/api/browsing/history', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, 'your-secret-key');
        const { url, title, favicon } = req.body;

        // Mock save - just return success
        res.json({ success: true });
    } catch (error) {
        console.error('History save error:', error);
        res.status(500).json({ error: 'Failed to save history' });
    }
});

app.get('/api/bookmarks', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, 'your-secret-key');
        
        // Mock bookmarks
        const bookmarks = [
            {
                id: uuidv4(),
                url: 'https://tauos.org',
                title: 'TauOS Official Website',
                favicon: 'https://tauos.org/favicon.ico',
                created_at: new Date().toISOString()
            }
        ];

        res.json({ bookmarks });
    } catch (error) {
        console.error('Bookmarks error:', error);
        res.status(500).json({ error: 'Failed to fetch bookmarks' });
    }
});

app.post('/api/bookmarks', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, 'your-secret-key');
        const { url, title, favicon } = req.body;

        // Mock save - just return success
        res.json({ success: true });
    } catch (error) {
        console.error('Bookmark save error:', error);
        res.status(500).json({ error: 'Failed to save bookmark' });
    }
});

// Static files middleware
app.use(express.static('public'));

// Start server
app.listen(PORT, () => {
    console.log('🌐 TauBrowser server running on http://localhost:' + PORT);
    console.log('🔒 Privacy-first web browsing');
    console.log('💾 Database: PostgreSQL (Supabase)');
});
