const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3006;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'TauOS Desktop UI v2.0',
    timestamp: new Date().toISOString()
  });
});

// Serve desktop interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get system info
app.get('/api/system', (req, res) => {
  res.json({
    success: true,
    system: {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    }
  });
});

// Get app status
app.get('/api/apps/status', async (req, res) => {
  const apps = [
    { name: 'TauMail', port: 3001, status: 'running' },
    { name: 'TauCloud', port: 3002, status: 'running' },
    { name: 'TauID', port: 3003, status: 'running' },
    { name: 'TauStore', port: 3004, status: 'running' },
    { name: 'TauBrowser', port: 3005, status: 'running' },
    { name: 'Desktop UI', port: 3006, status: 'running' },
    { name: 'Mobile UI', port: 3007, status: 'running' }
  ];

  res.json({
    success: true,
    apps
  });
});

app.listen(PORT, () => {
  console.log(`TauOS Desktop UI running on port ${PORT}`);
});
