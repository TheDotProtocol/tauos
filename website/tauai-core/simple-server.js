const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3012;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3006', 
        'http://localhost:3007',
        'https://www.tauos.org',
        'https://tauos.org',
        'https://cloud.tauos.org',
        'https://mail.tauos.org',
        'https://id.tauos.org',
        'https://store.tauos.org',
        'https://browser.tauos.org'
    ],
    credentials: true
}));
app.use(express.json());

// Simple TauAI responses
const responses = {
    'tau open email': {
        success: true,
        message: "Opening TauMail for you",
        action: 'navigate',
        target: 'https://tauos-6skj.vercel.app/taumail'
    },
    'tau open cloud': {
        success: true,
        message: "Opening TauCloud for you",
        action: 'navigate',
        target: 'https://tauos-6skj.vercel.app/taucloud'
    },
    'tau open store': {
        success: true,
        message: "Opening TauStore for you",
        action: 'navigate',
        target: 'https://tauos-store-backend.vercel.app'
    },
    'tau open browser': {
        success: true,
        message: "Opening TauBrowser for you",
        action: 'navigate',
        target: 'https://tauos-nmlq.vercel.app'
    },
    'tau open id': {
        success: true,
        message: "Opening TauID for you",
        action: 'navigate',
        target: 'https://tauos-6skj.vercel.app/tauid'
    },
    'tau check calendar': {
        success: true,
        message: "Checking your calendar... You have 3 meetings today and 2 tomorrow.",
        action: 'info'
    },
    'tau check weather': {
        success: true,
        message: "Today's weather: 72°F, partly cloudy. Perfect day for outdoor activities!",
        action: 'info'
    },
    'tau sync files': {
        success: true,
        message: "Syncing your files... 15 files synchronized successfully.",
        action: 'sync'
    },
    'tau check security': {
        success: true,
        message: "Security check complete. All systems secure. No threats detected.",
        action: 'security'
    },
    'tau help': {
        success: true,
        message: "I can help you with: Opening apps (Tau open email), checking calendar, weather, syncing files, security checks, and more. Just say 'Tau' followed by what you need!",
        action: 'help'
    }
};

// REST API endpoints
app.post('/api/tau/command', (req, res) => {
    try {
        const { command } = req.body;
        const lowerCommand = command.toLowerCase();
        
        // Find matching response
        let response = responses[lowerCommand];
        
        if (!response) {
            // Try partial matching
            for (const [key, value] of Object.entries(responses)) {
                if (lowerCommand.includes(key)) {
                    response = value;
                    break;
                }
            }
        }
        
        if (!response) {
            response = {
                success: false,
                message: "I didn't quite understand that. Try saying 'Tau help' for available commands.",
                action: 'clarification'
            };
        }
        
        res.json(response);
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            action: 'error'
        });
    }
});

app.get('/api/tau/status', (req, res) => {
    res.json({
        status: 'online',
        wakeWord: 'tau',
        capabilities: [
            'voice_commands',
            'app_navigation',
            'local_processing',
            'privacy_native'
        ],
        message: 'TauAI is ready to assist you'
    });
});

app.get('/api/tau/help', (req, res) => {
    res.json({
        wakeWord: 'tau',
        commands: [
            'tau open [app] - Open any TauOS app',
            'tau check calendar - View your schedule',
            'tau check weather - Get weather information',
            'tau sync files - Synchronize your data',
            'tau check security - Run security scan',
            'tau help - Show this help message'
        ],
        examples: [
            'tau open email',
            'tau check calendar',
            'tau what is the weather',
            'tau sync files',
            'tau check security'
        ]
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'TauAI Core',
        timestamp: new Date().toISOString()
    });
});

// Serve static files
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`🚀 TauAI Core running on port ${PORT}`);
    console.log(`🧠 Privacy-Native AI Assistant ready!`);
    console.log(`👂 Wake word: "Tau"`);
    console.log(`🌐 Access at: http://localhost:${PORT}`);
});
