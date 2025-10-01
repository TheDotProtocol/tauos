const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    const startTime = Date.now();
    
    // Test database connection
    const dbResult = await pool.query('SELECT NOW() as timestamp, current_database() as database');
    const dbResponseTime = Date.now() - startTime;
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: 'healthy',
          responseTime: `${dbResponseTime}ms`,
          database: dbResult.rows[0].database,
          timestamp: dbResult.rows[0].timestamp
        },
        api: {
          status: 'healthy',
          responseTime: `${dbResponseTime}ms`
        }
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV || 'development',
        DATABASE_URL: !!process.env.DATABASE_URL,
        PORT: process.env.PORT || 3001
      },
      version: '2.0.0',
      uptime: process.uptime()
    };
    
    res.json(health);
    
  } catch (error) {
    console.error('❌ Health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      services: {
        database: {
          status: 'unhealthy',
          error: error.message
        }
      }
    });
  }
});

module.exports = router;
