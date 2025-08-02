const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// In-memory storage (replace with database in production)
let users = [];
let files = [];

// Serve TauCloud interface
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// API endpoints
app.post('/api/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { id: Date.now(), email, password: hashedPassword, name, storage: 0, maxStorage: 5 * 1024 * 1024 * 1024 }; // 5GB
        users.push(user);
        
        const token = jwt.sign({ userId: user.id }, 'tauos-secret-key', { expiresIn: '24h' });
        
        res.json({ 
            success: true, 
            user: { id: user.id, email, name, storage: user.storage, maxStorage: user.maxStorage },
            token 
        });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = users.find(u => u.email === email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ userId: user.id }, 'tauos-secret-key', { expiresIn: '24h' });
        
        res.json({ 
            success: true, 
            user: { id: user.id, email, name: user.name, storage: user.storage, maxStorage: user.maxStorage },
            token 
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.get('/api/files/:userId', (req, res) => {
    const userFiles = files.filter(f => f.userId == req.params.userId);
    res.json(userFiles);
});

app.post('/api/files', (req, res) => {
    const { userId, name, size, type } = req.body;
    const file = { 
        id: Date.now(), 
        userId, 
        name, 
        size, 
        type, 
        date: new Date() 
    };
    files.push(file);
    res.json({ success: true, file });
});

// Vercel serverless function export
module.exports = app;

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(3001, () => {
        console.log('TauCloud running on port 3001');
    });
} 