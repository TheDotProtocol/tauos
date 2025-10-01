// Vercel serverless function for TauMail v2 Backend
// This is the main entry point for all API routes

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, query } = require('../config/database');
const emailRoutes = require('../routes/emails');
const webhookRoutes = require('../routes/webhook');
const healthRoutes = require('../routes/health');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Connect to Database
connectDB();

// Routes
app.use('/api/v2/emails', emailRoutes);
app.use('/api/v2/webhook', webhookRoutes);
app.use('/api/v2/health', healthRoutes);

// Basic root route
app.get('/', (req, res) => {
  res.send('TauMail v2 Backend is running on Vercel!');
});

// Export for Vercel
module.exports = app;
