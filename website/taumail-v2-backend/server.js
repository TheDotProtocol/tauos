const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: ['https://www.tauos.org', 'https://tauos.org', 'http://localhost:3000'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import routes
const emailRoutes = require('./routes/emails');
const webhookRoutes = require('./routes/webhook');
const healthRoutes = require('./routes/health');

// API routes
app.use('/api/v2/emails', emailRoutes);
app.use('/api/v2/webhook', webhookRoutes);
app.use('/api/v2/health', healthRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'TauMail v2 Backend API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'API endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TauMail v2 Backend running on port ${PORT}`);
  console.log(`📧 Email API: http://localhost:${PORT}/api/v2/emails`);
  console.log(`🔗 Webhook: http://localhost:${PORT}/api/v2/webhook`);
  console.log(`❤️ Health: http://localhost:${PORT}/api/v2/health`);
});

module.exports = app;
