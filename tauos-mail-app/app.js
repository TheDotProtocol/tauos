const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// In-memory storage (replace with database in production)
let users = [];
let emails = [];

// Serve TauMail interface
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
        const user = { id: Date.now(), email, password: hashedPassword, name };
        users.push(user);
        
        const token = jwt.sign({ userId: user.id }, 'tauos-secret-key', { expiresIn: '24h' });
        
        res.json({ 
            success: true, 
            user: { id: user.id, email, name },
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
            user: { id: user.id, email, name: user.name },
            token 
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.get('/api/emails/:userId', (req, res) => {
    const userEmails = emails.filter(e => e.userId == req.params.userId);
    res.json(userEmails);
});

app.post('/api/emails', (req, res) => {
    const { userId, to, subject, body } = req.body;
    const email = { 
        id: Date.now(), 
        userId, 
        to, 
        subject, 
        body, 
        date: new Date(),
        from: users.find(u => u.id == userId)?.email || 'unknown@tauos.org'
    };
    emails.push(email);
    res.json({ success: true, email });
});

app.listen(3000, () => {
    console.log('TauMail running on port 3000');
});
