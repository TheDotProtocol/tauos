const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3007;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.get('/api/phone-status', (req, res) => {
    res.json({
        status: 'connected',
        battery: 85,
        signal: 4,
        wifi: true,
        bluetooth: true,
        location: true,
        time: new Date().toISOString(),
        services: {
            taucloud: 'available',
            tauid: 'available',
            taustore: 'available',
            taubrowser: 'available'
        }
    });
});

// Integration endpoints for TauOS services
app.get('/api/services/status', async (req, res) => {
    const services = {
        taucloud: { url: 'http://localhost:3002', status: 'checking' },
        tauid: { url: 'http://localhost:3003', status: 'checking' },
        taustore: { url: 'http://localhost:3004', status: 'checking' },
        taubrowser: { url: 'http://localhost:3005', status: 'checking' }
    };

    // Check each service
    for (const [service, config] of Object.entries(services)) {
        try {
            const response = await fetch(`${config.url}/api/health`);
            if (response.ok) {
                config.status = 'online';
            } else {
                config.status = 'offline';
            }
        } catch (error) {
            config.status = 'offline';
        }
    }

    res.json({ services });
});

// Proxy endpoints for cross-service communication
app.get('/api/proxy/taucloud/*', async (req, res) => {
    const path = req.params[0];
    try {
        const response = await fetch(`http://localhost:3002/api/${path}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Service unavailable' });
    }
});

app.get('/api/proxy/tauid/*', async (req, res) => {
    const path = req.params[0];
    try {
        const response = await fetch(`http://localhost:3003/api/${path}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Service unavailable' });
    }
});

app.get('/api/proxy/taustore/*', async (req, res) => {
    const path = req.params[0];
    try {
        const response = await fetch(`http://localhost:3004/api/${path}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Service unavailable' });
    }
});

app.get('/api/contacts', (req, res) => {
    res.json([
        { id: 1, name: 'John Doe', phone: '+1-555-0123', avatar: '👨‍💼', lastSeen: '2 minutes ago' },
        { id: 2, name: 'Jane Smith', phone: '+1-555-0456', avatar: '👩‍💻', lastSeen: 'Online' },
        { id: 3, name: 'Mike Johnson', phone: '+1-555-0789', avatar: '👨‍🔬', lastSeen: '1 hour ago' },
        { id: 4, name: 'Sarah Wilson', phone: '+1-555-0321', avatar: '👩‍🎨', lastSeen: 'Yesterday' },
        { id: 5, name: 'David Brown', phone: '+1-555-0654', avatar: '👨‍🚀', lastSeen: '3 days ago' }
    ]);
});

app.get('/api/messages', (req, res) => {
    res.json([
        {
            id: 1,
            contact: 'John Doe',
            avatar: '👨‍💼',
            lastMessage: 'Hey, how are you doing?',
            timestamp: '2 min ago',
            unread: 2,
            messages: [
                { id: 1, sender: 'John Doe', text: 'Hello!', time: '10:30 AM', type: 'received' },
                { id: 2, sender: 'You', text: 'Hi John!', time: '10:31 AM', type: 'sent' },
                { id: 3, sender: 'John Doe', text: 'Hey, how are you doing?', time: '10:32 AM', type: 'received' }
            ]
        },
        {
            id: 2,
            contact: 'Jane Smith',
            avatar: '👩‍💻',
            lastMessage: 'Thanks for the help!',
            timestamp: '1 hour ago',
            unread: 0,
            messages: [
                { id: 1, sender: 'Jane Smith', text: 'Can you help me with the project?', time: '9:00 AM', type: 'received' },
                { id: 2, sender: 'You', text: 'Of course! What do you need?', time: '9:05 AM', type: 'sent' },
                { id: 3, sender: 'Jane Smith', text: 'Thanks for the help!', time: '9:30 AM', type: 'received' }
            ]
        }
    ]);
});

app.get('/api/apps', (req, res) => {
    res.json([
        { id: 'camera', name: 'Camera', icon: '📷', category: 'media', description: 'Take photos and videos' },
        { id: 'gallery', name: 'Gallery', icon: '🖼️', category: 'media', description: 'View photos and videos' },
        { id: 'messages', name: 'Messages', icon: '💬', category: 'communication', description: 'Send and receive messages' },
        { id: 'phone', name: 'Phone', icon: '📞', category: 'communication', description: 'Make calls' },
        { id: 'contacts', name: 'Contacts', icon: '👥', category: 'communication', description: 'Manage contacts' },
        { id: 'whatsapp', name: 'WhatsApp', icon: '💚', category: 'communication', description: 'WhatsApp messaging' },
        { id: 'tautalk', name: 'TauTalk', icon: '📹', category: 'communication', description: 'Video calls' },
        { id: 'music', name: 'Music', icon: '🎵', category: 'media', description: 'Play music' },
        { id: 'maps', name: 'Maps', icon: '🗺️', category: 'navigation', description: 'Navigation and maps' },
        { id: 'weather', name: 'Weather', icon: '🌤️', category: 'utilities', description: 'Weather forecast' },
        { id: 'calculator', name: 'Calculator', icon: '🧮', category: 'utilities', description: 'Calculator app' },
        { id: 'notes', name: 'Notes', icon: '📝', category: 'productivity', description: 'Take notes' },
        { id: 'calendar', name: 'Calendar', icon: '📅', category: 'productivity', description: 'Manage calendar' },
        { id: 'settings', name: 'Settings', icon: '⚙️', category: 'system', description: 'System settings' },
        { id: 'taumail', name: 'TauMail', icon: '📧', category: 'productivity', description: 'Secure email' },
        { id: 'taubrowser', name: 'TauBrowser', icon: '🌐', category: 'internet', description: 'Privacy browser' }
    ]);
});

app.post('/api/upload-photo', upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    res.json({
        success: true,
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`
    });
});

app.post('/api/upload-video', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No video uploaded' });
    }
    
    res.json({
        success: true,
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`
    });
});

// Socket.IO for real-time features
io.on('connection', (socket) => {
    console.log('📱 Mobile phone connected:', socket.id);
    
    socket.on('join-call', (data) => {
        socket.join(data.roomId);
        socket.to(data.roomId).emit('user-joined', { userId: socket.id, name: data.name });
    });
    
    socket.on('leave-call', (data) => {
        socket.leave(data.roomId);
        socket.to(data.roomId).emit('user-left', { userId: socket.id });
    });
    
    socket.on('call-signal', (data) => {
        socket.to(data.roomId).emit('call-signal', data);
    });

    socket.on('call-offer', (data) => {
        socket.to(data.roomId).emit('call-offer', data);
    });

    socket.on('call-answer', (data) => {
        socket.to(data.roomId).emit('call-answer', data);
    });

    socket.on('ice-candidate', (data) => {
        socket.to(data.roomId).emit('ice-candidate', data);
    });

    socket.on('send-message', (data) => {
        // Broadcast message to all connected clients
        socket.broadcast.emit('new-message', {
            ...data,
            senderId: socket.id,
            timestamp: new Date().toISOString()
        });
    });
    
    socket.on('disconnect', () => {
        console.log('📱 Mobile phone disconnected:', socket.id);
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`📱 TauOS Mobile Phone UI running on http://localhost:${PORT}`);
    console.log(`🎨 Full smartphone experience with camera, calls, and messaging`);
    console.log(`🔗 Desktop connectivity: Apple/Windows phone integration`);
});
