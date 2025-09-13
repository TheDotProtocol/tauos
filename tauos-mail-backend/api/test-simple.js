const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/test', (req, res) => {
    res.json({ status: 'ok', version: '3.0 - Simple test' });
});

app.post('/api/emails/send', (req, res) => {
    res.json({ message: 'Test endpoint working', body: req.body });
});

module.exports = app;
