const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3006;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/desktop', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'desktop.html'));
});

app.get('/mobile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mobile.html'));
});

// API Routes for desktop functionality
app.get('/api/apps', (req, res) => {
    const apps = [
        {
            id: 'taumail',
            name: 'TauMail',
            icon: '📧',
            url: 'http://localhost:3001',
            category: 'productivity',
            description: 'Secure email client'
        },
        {
            id: 'taucloud',
            name: 'TauCloud',
            icon: '☁️',
            url: 'http://localhost:3002',
            category: 'storage',
            description: 'File storage and sync'
        },
        {
            id: 'tauid',
            name: 'TauID',
            icon: '🆔',
            url: 'http://localhost:3003',
            category: 'security',
            description: 'Identity management'
        },
        {
            id: 'taustore',
            name: 'TauStore',
            icon: '🛍️',
            url: 'http://localhost:3004',
            category: 'marketplace',
            description: 'App marketplace'
        },
        {
            id: 'taubrowser',
            name: 'TauBrowser',
            icon: '🌐',
            url: 'http://localhost:3005',
            category: 'browser',
            description: 'Privacy-first browser'
        },
        {
            id: 'settings',
            name: 'Settings',
            icon: '⚙️',
            url: '#',
            category: 'system',
            description: 'System preferences'
        },
        {
            id: 'terminal',
            name: 'Terminal',
            icon: '💻',
            url: '#',
            category: 'development',
            description: 'Command line interface'
        },
        {
            id: 'files',
            name: 'Files',
            icon: '📁',
            url: '#',
            category: 'system',
            description: 'File manager'
        }
    ];
    res.json(apps);
});

app.get('/api/system-info', (req, res) => {
    const systemInfo = {
        os: 'TauOS',
        version: '1.0.0',
        architecture: 'x86_64',
        memory: '16GB',
        storage: '512GB SSD',
        cpu: 'Apple M2',
        uptime: '2h 34m',
        network: 'Connected',
        battery: '85%'
    };
    res.json(systemInfo);
});

// Start server
app.listen(PORT, () => {
    console.log(`🖥️  TauOS Desktop UI running on http://localhost:${PORT}`);
    console.log(`📱 Desktop Interface: http://localhost:${PORT}/desktop`);
    console.log(`📱 Mobile Interface: http://localhost:${PORT}/mobile`);
    console.log(`🎨 Hybrid Design: Apple + Windows + Linux inspired`);
});
