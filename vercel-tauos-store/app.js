const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3004;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/api/', limiter);

// Input validation middleware
const validateSearch = [
  body('query').trim().isLength({ min: 1, max: 100 }).withMessage('Search query must be 1-100 characters'),
];

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Ak1233%40%405@db.tviqcormikopltejomkc.supabase.co:5432/postgres',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected successfully');
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

app.get('/store', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Endpoints
app.get('/api/apps', async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    
    let query = 'SELECT * FROM apps WHERE 1=1';
    const params = [];
    
    if (category && category !== 'all') {
      query += ' AND category = $1';
      params.push(category);
    }
    
    if (search) {
      query += ' AND (name ILIKE $' + (params.length + 1) + ' OR description ILIKE $' + (params.length + 1) + ')';
      params.push(`%${search}%`);
    }
    
    if (sort === 'price_low') {
      query += ' ORDER BY price ASC';
    } else if (sort === 'price_high') {
      query += ' ORDER BY price DESC';
    } else if (sort === 'rating') {
      query += ' ORDER BY rating DESC';
    } else if (sort === 'downloads') {
      query += ' ORDER BY downloads DESC';
    } else {
      query += ' ORDER BY created_at DESC';
    }
    
    const result = await pool.query(query, params);
    res.json({ apps: result.rows });
  } catch (error) {
    console.error('Get apps error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/apps/:appId', async (req, res) => {
  try {
    const { appId } = req.params;
    
    const app = await pool.query(
      'SELECT * FROM apps WHERE id = $1',
      [appId]
    );
    
    if (app.rows.length === 0) {
      return res.status(404).json({ error: 'App not found' });
    }
    
    // Get app reviews
    const reviews = await pool.query(
      'SELECT * FROM app_reviews WHERE app_id = $1 ORDER BY created_at DESC LIMIT 10',
      [appId]
    );
    
    res.json({ 
      app: app.rows[0],
      reviews: reviews.rows
    });
  } catch (error) {
    console.error('Get app error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT category FROM apps ORDER BY category');
    res.json({ categories: result.rows.map(row => row.category) });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/featured', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM apps WHERE featured = true ORDER BY rating DESC, downloads DESC LIMIT 10'
    );
    res.json({ apps: result.rows });
  } catch (error) {
    console.error('Get featured apps error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/top-free', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM apps WHERE price = 0 ORDER BY downloads DESC, rating DESC LIMIT 20'
    );
    res.json({ apps: result.rows });
  } catch (error) {
    console.error('Get top free apps error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/top-paid', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM apps WHERE price > 0 ORDER BY downloads DESC, rating DESC LIMIT 20'
    );
    res.json({ apps: result.rows });
  } catch (error) {
    console.error('Get top paid apps error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/apps/:appId/download', async (req, res) => {
  try {
    const { appId } = req.params;
    
    // Increment download count
    await pool.query(
      'UPDATE apps SET downloads = downloads + 1 WHERE id = $1',
      [appId]
    );
    
    res.json({ message: 'Download count updated' });
  } catch (error) {
    console.error('Update download count error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/apps/:appId/review', async (req, res) => {
  try {
    const { appId } = req.params;
    const { rating, comment, reviewer_name } = req.body;
    
    const newReview = await pool.query(
      'INSERT INTO app_reviews (app_id, rating, comment, reviewer_name, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [appId, rating, comment, reviewer_name]
    );
    
    // Update app rating
    const avgRating = await pool.query(
      'SELECT AVG(rating) as avg_rating FROM app_reviews WHERE app_id = $1',
      [appId]
    );
    
    await pool.query(
      'UPDATE apps SET rating = $1 WHERE id = $2',
      [parseFloat(avgRating.rows[0].avg_rating).toFixed(1), appId]
    );
    
    res.status(201).json({
      message: 'Review added successfully',
      review: newReview.rows[0]
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('🛍️ TauStore server running on http://localhost:' + PORT);
  console.log('📱 App marketplace for TauOS ecosystem');
  console.log('💾 Database: PostgreSQL');
});

module.exports = app;
