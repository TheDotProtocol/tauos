const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Main landing page
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TauOS - Privacy-First Operating System</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
            }
            .header {
                padding: 2rem;
                text-align: center;
                background: rgba(0,0,0,0.1);
                backdrop-filter: blur(10px);
            }
            .logo {
                font-size: 4rem;
                font-weight: bold;
                margin-bottom: 1rem;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .tagline {
                font-size: 1.5rem;
                opacity: 0.9;
                margin-bottom: 2rem;
            }
            .services {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
                padding: 2rem;
                flex: 1;
            }
            .service-card {
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
                border-radius: 15px;
                padding: 2rem;
                text-align: center;
                transition: transform 0.3s ease;
                border: 1px solid rgba(255,255,255,0.2);
            }
            .service-card:hover {
                transform: translateY(-5px);
                background: rgba(255,255,255,0.15);
            }
            .service-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            .service-title {
                font-size: 1.5rem;
                font-weight: bold;
                margin-bottom: 1rem;
            }
            .service-description {
                margin-bottom: 1.5rem;
                opacity: 0.9;
            }
            .service-link {
                display: inline-block;
                background: rgba(255,255,255,0.2);
                color: white;
                text-decoration: none;
                padding: 0.75rem 1.5rem;
                border-radius: 25px;
                transition: background 0.3s ease;
                border: 1px solid rgba(255,255,255,0.3);
            }
            .service-link:hover {
                background: rgba(255,255,255,0.3);
            }
            .footer {
                text-align: center;
                padding: 2rem;
                background: rgba(0,0,0,0.1);
                backdrop-filter: blur(10px);
            }
            .status {
                display: inline-block;
                background: #34c759;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.9rem;
                margin: 0.5rem;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">τOS</div>
            <div class="tagline">Privacy-First Operating System</div>
            <div class="status">🟢 All Systems Operational</div>
        </div>
        
        <div class="services">
            <div class="service-card">
                <div class="service-icon">📧</div>
                <div class="service-title">TauMail</div>
                <div class="service-description">Secure email with end-to-end encryption and sovereign infrastructure</div>
                <a href="http://localhost:3001" class="service-link">Access TauMail</a>
            </div>
            
            <div class="service-card">
                <div class="service-icon">☁️</div>
                <div class="service-title">TauCloud</div>
                <div class="service-description">Privacy-first cloud storage with zero-knowledge architecture</div>
                <a href="http://localhost:3002" class="service-link">Access TauCloud</a>
            </div>
            
            <div class="service-card">
                <div class="service-icon">🆔</div>
                <div class="service-title">TauID</div>
                <div class="service-description">Decentralized identity management and authentication</div>
                <a href="http://localhost:3003" class="service-link">Access TauID</a>
            </div>
            
            <div class="service-card">
                <div class="service-icon">🛍️</div>
                <div class="service-title">TauStore</div>
                <div class="service-description">App marketplace for the TauOS ecosystem</div>
                <a href="http://localhost:3004" class="service-link">Access TauStore</a>
            </div>
            
            <div class="service-card">
                <div class="service-icon">🌐</div>
                <div class="service-title">TauBrowser</div>
                <div class="service-description">Privacy-focused web browser with built-in security</div>
                <a href="http://localhost:3005" class="service-link">Access TauBrowser</a>
            </div>
            
            <div class="service-card">
                <div class="service-icon">🖥️</div>
                <div class="service-title">Desktop UI</div>
                <div class="service-description">Full desktop experience with Apple/Windows/Linux integration</div>
                <a href="http://localhost:3006" class="service-link">Access Desktop</a>
            </div>
            
            <div class="service-card">
                <div class="service-icon">📱</div>
                <div class="service-title">Mobile UI</div>
                <div class="service-description">Smartphone interface with camera, contacts, and messaging</div>
                <a href="http://localhost:3007" class="service-link">Access Mobile</a>
            </div>
        </div>
        
        <div class="footer">
            <p>© 2024 TauOS - Privacy-First Operating System</p>
            <p>All services running locally for development and testing</p>
        </div>
    </body>
    </html>
    `);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'TauOS Main Landing',
        timestamp: new Date().toISOString(),
        services: {
            'TauMail': 'http://localhost:3001',
            'TauCloud': 'http://localhost:3002',
            'TauID': 'http://localhost:3003',
            'TauStore': 'http://localhost:3004',
            'TauBrowser': 'http://localhost:3005',
            'Desktop UI': 'http://localhost:3006',
            'Mobile UI': 'http://localhost:3007'
        }
    });
});

// API endpoint to check all services status
app.get('/api/services/status', async (req, res) => {
    const services = [
        { name: 'TauMail', url: 'http://localhost:3001/api/health' },
        { name: 'TauCloud', url: 'http://localhost:3002/api/health' },
        { name: 'TauID', url: 'http://localhost:3003/api/health' },
        { name: 'TauStore', url: 'http://localhost:3004/api/health' },
        { name: 'TauBrowser', url: 'http://localhost:3005/api/health' },
        { name: 'Desktop UI', url: 'http://localhost:3006' },
        { name: 'Mobile UI', url: 'http://localhost:3007' }
    ];
    
    const status = await Promise.allSettled(
        services.map(async (service) => {
            try {
                const response = await fetch(service.url);
                return {
                    name: service.name,
                    status: response.ok ? 'healthy' : 'unhealthy',
                    url: service.url
                };
            } catch (error) {
                return {
                    name: service.name,
                    status: 'offline',
                    url: service.url,
                    error: error.message
                };
            }
        })
    );
    
    res.json({
        timestamp: new Date().toISOString(),
        services: status.map(result => result.value || result.reason)
    });
});

app.listen(PORT, () => {
    console.log(`🌐 TauOS Main Landing running on http://localhost:${PORT}`);
    console.log(`🏠 tauos.org homepage accessible`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔍 Services status: http://localhost:${PORT}/api/services/status`);
});
