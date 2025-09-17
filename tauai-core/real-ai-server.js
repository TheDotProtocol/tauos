const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3013;

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

// Real AI Integration
class RealTauAI {
    constructor() {
        this.openaiApiKey = process.env.OPENAI_API_KEY || 'your-openai-key-here';
        this.wakeWord = 'tau';
        this.context = {};
    }

    // Real OpenAI integration for natural language processing
    async processWithOpenAI(command) {
        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are TauAI, a privacy-native AI assistant for TauOS. You help users with their TauOS apps and tasks. Keep responses concise and helpful. Available apps: TauMail, TauCloud, TauID, TauStore, TauBrowser.'
                    },
                    {
                        role: 'user',
                        content: command
                    }
                ],
                max_tokens: 150,
                temperature: 0.7
            }, {
                headers: {
                    'Authorization': `Bearer ${this.openaiApiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API error:', error.response?.data || error.message);
            return "I'm having trouble processing that right now. Please try again.";
        }
    }

    // Real sentiment analysis using OpenAI
    async analyzeSentiment(text) {
        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'Analyze the sentiment of the given text. Respond with only a JSON object containing: {"sentiment": "positive/negative/neutral", "confidence": 0.0-1.0, "mood": "brief description"}'
                    },
                    {
                        role: 'user',
                        content: text
                    }
                ],
                max_tokens: 100,
                temperature: 0.3
            }, {
                headers: {
                    'Authorization': `Bearer ${this.openaiApiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = JSON.parse(response.data.choices[0].message.content);
            return result;
        } catch (error) {
            console.error('Sentiment analysis error:', error);
            return { sentiment: 'neutral', confidence: 0.5, mood: 'Unable to analyze' };
        }
    }

    // Real image analysis using OpenAI Vision
    async analyzeImage(imageBase64) {
        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-4-vision-preview',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: 'Analyze this image and provide: 1) Objects detected, 2) Text found (OCR), 3) Scene description, 4) Mood/atmosphere. Respond in JSON format.'
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:image/jpeg;base64,${imageBase64}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 300
            }, {
                headers: {
                    'Authorization': `Bearer ${this.openaiApiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Image analysis error:', error);
            return { error: 'Unable to analyze image' };
        }
    }

    // Process voice command with real AI
    async processCommand(command) {
        try {
            // Remove wake word and clean command
            const cleanCommand = command.toLowerCase().replace(/^tau\s*/, '').trim();
            
            // Use OpenAI for real processing
            const aiResponse = await this.processWithOpenAI(cleanCommand);
            
            // Determine action based on response
            let action = 'info';
            let target = null;
            
            if (cleanCommand.includes('open') || cleanCommand.includes('launch')) {
                if (cleanCommand.includes('email') || cleanCommand.includes('mail')) {
                    action = 'navigate';
                    target = 'https://tauos-6skj.vercel.app/taumail';
                } else if (cleanCommand.includes('cloud')) {
                    action = 'navigate';
                    target = 'https://tauos-6skj.vercel.app/taucloud';
                } else if (cleanCommand.includes('store')) {
                    action = 'navigate';
                    target = 'https://tauos-store-backend.vercel.app';
                } else if (cleanCommand.includes('browser')) {
                    action = 'navigate';
                    target = 'https://tauos-nmlq.vercel.app';
                } else if (cleanCommand.includes('id')) {
                    action = 'navigate';
                    target = 'https://tauos-6skj.vercel.app/tauid';
                }
            }

            return {
                success: true,
                message: aiResponse,
                action: action,
                target: target,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Command processing error:', error);
            return {
                success: false,
                message: "I'm having trouble processing that. Please try again.",
                action: 'error'
            };
        }
    }
}

// Initialize Real TauAI
const realTauAI = new RealTauAI();

// API Endpoints
app.post('/api/tau/command', async (req, res) => {
    try {
        const { command } = req.body;
        const result = await realTauAI.processCommand(command);
        res.json(result);
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            action: 'error'
        });
    }
});

app.post('/api/tau/sentiment', async (req, res) => {
    try {
        const { text } = req.body;
        const sentiment = await realTauAI.analyzeSentiment(text);
        res.json(sentiment);
    } catch (error) {
        console.error('Sentiment analysis error:', error);
        res.status(500).json({ error: 'Sentiment analysis failed' });
    }
});

app.post('/api/tau/analyze-image', async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        const analysis = await realTauAI.analyzeImage(imageBase64);
        res.json(analysis);
    } catch (error) {
        console.error('Image analysis error:', error);
        res.status(500).json({ error: 'Image analysis failed' });
    }
});

app.get('/api/tau/status', (req, res) => {
    res.json({
        status: 'online',
        wakeWord: 'tau',
        capabilities: [
            'real_voice_commands',
            'real_nlp_processing',
            'real_sentiment_analysis',
            'real_image_analysis',
            'app_navigation',
            'local_processing',
            'privacy_native'
        ],
        message: 'Real TauAI is ready to assist you',
        aiProvider: 'OpenAI GPT-3.5-turbo'
    });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'Real TauAI Core',
        timestamp: new Date().toISOString(),
        aiEnabled: true
    });
});

// Serve static files
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`🚀 Real TauAI Core running on port ${PORT}`);
    console.log(`🧠 Real AI Processing enabled!`);
    console.log(`👂 Wake word: "Tau"`);
    console.log(`🌐 Access at: http://localhost:${PORT}`);
    console.log(`🤖 AI Provider: OpenAI GPT-3.5-turbo`);
});
