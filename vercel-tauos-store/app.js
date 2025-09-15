/**
 * TauStore Backend - Complete App Marketplace
 * Production-ready with authentication, payments, and full functionality
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const helmet = require('helmet');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3004;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again later.',
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=disable',
  ssl: false
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected successfully');
  }
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || '143d8c3e98e6b97a969d4c2ffd7b99ad547043c370e34cf3a9062a51c25d9f0f728742117635598c75e701ee98f44c0c62bb6f503c34cbc370bd77e6b34080c0';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Input validation
const validateRegistration = [
  body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('fullName').trim().isLength({ min: 2, max: 100 }).withMessage('Full name required'),
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
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

// Authentication routes
app.post('/api/auth/register', validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, fullName, phone, country } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM taustore_users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Get organization ID
    const orgResult = await pool.query('SELECT id FROM organizations WHERE domain = $1', ['tauos.org']);
    const organizationId = orgResult.rows[0]?.id;

    // Create user
    const userResult = await pool.query(
      'INSERT INTO taustore_users (username, email, password_hash, full_name, phone, country, organization_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, username, email, full_name, created_at',
      [username, email, passwordHash, fullName, phone, country, organizationId]
    );

    const user = userResult.rows[0];

    // Create user profile
    await pool.query(
      'INSERT INTO user_profiles (user_id, preferences) VALUES ($1, $2)',
      [user.id, JSON.stringify({ theme: 'dark', notifications: true })]
    );

    // Create user points record
    await pool.query(
      'INSERT INTO user_points (user_id, total_points, available_points) VALUES ($1, $2, $3)',
      [user.id, 100, 100] // Welcome bonus
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        createdAt: user.created_at
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const userResult = await pool.query(
      'SELECT id, username, email, password_hash, full_name, is_active FROM taustore_users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await pool.query(
      'UPDATE taustore_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User profile routes
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT u.*, p.bio, p.website, p.social_links, p.preferences, up.total_points, up.available_points FROM taustore_users u LEFT JOIN user_profiles p ON u.id = p.user_id LEFT JOIN user_points up ON u.id = up.user_id WHERE u.id = $1',
      [req.user.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        avatarUrl: user.avatar_url,
        phone: user.phone,
        country: user.country,
        bio: user.bio,
        website: user.website,
        socialLinks: user.social_links,
        preferences: user.preferences,
        totalPoints: user.total_points,
        availablePoints: user.available_points,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { fullName, bio, website, socialLinks, preferences } = req.body;

    // Update user profile
    await pool.query(
      'UPDATE taustore_users SET full_name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [fullName, req.user.userId]
    );

    // Update or create user profile
    await pool.query(
      'INSERT INTO user_profiles (user_id, bio, website, social_links, preferences) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (user_id) DO UPDATE SET bio = $2, website = $3, social_links = $4, preferences = $5, updated_at = CURRENT_TIMESTAMP',
      [req.user.userId, bio, website, JSON.stringify(socialLinks), JSON.stringify(preferences)]
    );

    res.json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Payment methods routes
app.get('/api/user/payment-methods', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, payment_type, provider, card_last_four, card_brand, expiry_month, expiry_year, is_default, is_active FROM payment_methods WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
      [req.user.userId]
    );

    res.json({ paymentMethods: result.rows });

  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/user/payment-methods', authenticateToken, async (req, res) => {
  try {
    const { paymentType, provider, providerId, cardLastFour, cardBrand, expiryMonth, expiryYear, isDefault } = req.body;

    // If setting as default, unset other defaults
    if (isDefault) {
      await pool.query(
        'UPDATE payment_methods SET is_default = false WHERE user_id = $1',
        [req.user.userId]
      );
    }

    const result = await pool.query(
      'INSERT INTO payment_methods (user_id, payment_type, provider, provider_id, card_last_four, card_brand, expiry_month, expiry_year, is_default) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [req.user.userId, paymentType, provider, providerId, cardLastFour, cardBrand, expiryMonth, expiryYear, isDefault]
    );

    res.status(201).json({
      message: 'Payment method added successfully',
      paymentMethod: result.rows[0]
    });

  } catch (error) {
    console.error('Add payment method error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// App routes
app.get('/api/apps', async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT a.*, ac.name as category_name, ac.color as category_color 
      FROM apps a 
      LEFT JOIN app_categories ac ON a.category_id = ac.id 
      WHERE a.is_active = true
    `;
    const params = [];
    let paramCount = 0;

    if (category && category !== 'all') {
      paramCount++;
      query += ` AND ac.slug = $${paramCount}`;
      params.push(category);
    }
    
    if (search) {
      paramCount++;
      query += ` AND (a.name ILIKE $${paramCount} OR a.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }
    
    if (sort === 'price_low') {
      query += ' ORDER BY a.price ASC';
    } else if (sort === 'price_high') {
      query += ' ORDER BY a.price DESC';
    } else if (sort === 'rating') {
      query += ' ORDER BY a.rating DESC';
    } else if (sort === 'downloads') {
      query += ' ORDER BY a.download_count DESC';
    } else {
      query += ' ORDER BY a.created_at DESC';
    }

    query += ` LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(parseInt(limit), offset);

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
    
    const appResult = await pool.query(
      'SELECT a.*, ac.name as category_name, ac.color as category_color FROM apps a LEFT JOIN app_categories ac ON a.category_id = ac.id WHERE a.id = $1 AND a.is_active = true',
      [appId]
    );
    
    if (appResult.rows.length === 0) {
      return res.status(404).json({ error: 'App not found' });
    }

    // Get app reviews
    const reviewsResult = await pool.query(
      'SELECT r.*, u.username, u.full_name FROM app_reviews r JOIN taustore_users u ON r.user_id = u.id WHERE r.app_id = $1 ORDER BY r.created_at DESC LIMIT 10',
      [appId]
    );

    res.json({ 
      app: appResult.rows[0],
      reviews: reviewsResult.rows
    });

  } catch (error) {
    console.error('Get app error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT c.*, COUNT(a.id) as app_count FROM app_categories c LEFT JOIN apps a ON c.id = a.category_id AND a.is_active = true GROUP BY c.id, c.name, c.slug, c.description, c.icon, c.color, c.is_active, c.sort_order, c.created_at ORDER BY c.sort_order'
    );
    res.json({ categories: result.rows });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/featured', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT a.*, ac.name as category_name, ac.color as category_color FROM apps a LEFT JOIN app_categories ac ON a.category_id = ac.id WHERE a.featured = true AND a.is_active = true ORDER BY a.rating DESC, a.download_count DESC LIMIT 10'
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
      'SELECT a.*, ac.name as category_name, ac.color as category_color FROM apps a LEFT JOIN app_categories ac ON a.category_id = ac.id WHERE a.price = 0 AND a.is_active = true ORDER BY a.download_count DESC, a.rating DESC LIMIT 20'
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
      'SELECT a.*, ac.name as category_name, ac.color as category_color FROM apps a LEFT JOIN app_categories ac ON a.category_id = ac.id WHERE a.price > 0 AND a.is_active = true ORDER BY a.download_count DESC, a.rating DESC LIMIT 20'
    );
    res.json({ apps: result.rows });
  } catch (error) {
    console.error('Get top paid apps error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download routes
app.post('/api/apps/:appId/download', authenticateToken, async (req, res) => {
  try {
    const { appId } = req.params;
    
    // Check if already downloaded
    const existingDownload = await pool.query(
      'SELECT id FROM user_downloads WHERE user_id = $1 AND app_id = $2',
      [req.user.userId, appId]
    );

    if (existingDownload.rows.length === 0) {
      // Add to user downloads
      await pool.query(
        'INSERT INTO user_downloads (user_id, app_id) VALUES ($1, $2)',
        [req.user.userId, appId]
      );

      // Increment download count
      await pool.query(
        'UPDATE apps SET download_count = download_count + 1 WHERE id = $1',
        [appId]
      );

      // Add points for download
      await pool.query(
        'INSERT INTO rewards (user_id, points, source, source_id, description) VALUES ($1, $2, $3, $4, $5)',
        [req.user.userId, 10, 'download', appId, 'Downloaded app']
      );

      // Update user points
      await pool.query(
        'UPDATE user_points SET total_points = total_points + 10, available_points = available_points + 10 WHERE user_id = $1',
        [req.user.userId]
      );
    }
    
    res.json({ message: 'Download recorded successfully' });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Review routes
app.post('/api/apps/:appId/review', authenticateToken, async (req, res) => {
  try {
    const { appId } = req.params;
    const { rating, title, comment } = req.body;
    
    // Check if user has downloaded the app
    const downloadCheck = await pool.query(
      'SELECT id FROM user_downloads WHERE user_id = $1 AND app_id = $2',
      [req.user.userId, appId]
    );

    if (downloadCheck.rows.length === 0) {
      return res.status(400).json({ error: 'You must download the app before reviewing' });
    }

    const newReview = await pool.query(
      'INSERT INTO app_reviews (app_id, user_id, rating, title, comment, is_verified_purchase) VALUES ($1, $2, $3, $4, $5, true) ON CONFLICT (app_id, user_id) DO UPDATE SET rating = $3, title = $4, comment = $5, updated_at = CURRENT_TIMESTAMP RETURNING *',
      [appId, req.user.userId, rating, title, comment]
    );
    
    // Update app rating
    const avgRating = await pool.query(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM app_reviews WHERE app_id = $1',
      [appId]
    );
    
    await pool.query(
      'UPDATE apps SET rating = $1, review_count = $2 WHERE id = $3',
      [parseFloat(avgRating.rows[0].avg_rating).toFixed(1), avgRating.rows[0].review_count, appId]
    );

    // Add points for review
    await pool.query(
      'INSERT INTO rewards (user_id, points, source, source_id, description) VALUES ($1, $2, $3, $4, $5)',
      [req.user.userId, 25, 'review', appId, 'Reviewed app']
    );

    // Update user points
    await pool.query(
      'UPDATE user_points SET total_points = total_points + 25, available_points = available_points + 25 WHERE user_id = $1',
      [req.user.userId]
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

// Wishlist routes
app.get('/api/user/wishlist', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT a.*, ac.name as category_name, ac.color as category_color FROM user_wishlist w JOIN apps a ON w.app_id = a.id LEFT JOIN app_categories ac ON a.category_id = ac.id WHERE w.user_id = $1 ORDER BY w.created_at DESC',
      [req.user.userId]
    );
    res.json({ apps: result.rows });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/apps/:appId/wishlist', authenticateToken, async (req, res) => {
  try {
    const { appId } = req.params;
    
    await pool.query(
      'INSERT INTO user_wishlist (user_id, app_id) VALUES ($1, $2) ON CONFLICT (user_id, app_id) DO NOTHING',
      [req.user.userId, appId]
    );
    
    res.json({ message: 'Added to wishlist' });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/apps/:appId/wishlist', authenticateToken, async (req, res) => {
  try {
    const { appId } = req.params;
    
    await pool.query(
      'DELETE FROM user_wishlist WHERE user_id = $1 AND app_id = $2',
      [req.user.userId, appId]
    );
    
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User downloads route
app.get('/api/user/downloads', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT a.*, ac.name as category_name, ac.color as category_color, ud.download_date FROM user_downloads ud JOIN apps a ON ud.app_id = a.id LEFT JOIN app_categories ac ON a.category_id = ac.id WHERE ud.user_id = $1 ORDER BY ud.download_date DESC',
      [req.user.userId]
    );
    res.json({ apps: result.rows });
  } catch (error) {
    console.error('Get downloads error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Rewards route
app.get('/api/user/rewards', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM rewards WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.user.userId]
    );
    res.json({ rewards: result.rows });
  } catch (error) {
    console.error('Get rewards error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('🛍️ TauStore server running on http://localhost:' + PORT);
  console.log('📱 Complete app marketplace for TauOS ecosystem');
  console.log('💾 Database: PostgreSQL');
  console.log('🔐 Authentication: JWT');
  console.log('💳 Payment: Ready for integration');
});

module.exports = app;