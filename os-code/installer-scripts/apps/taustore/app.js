const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3004;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Ak1233%40%405@db.tviqcormikopltejomkc.supabase.co:5432/postgres'
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'TauOS Store Backend v2.0',
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// Get all apps
app.get('/api/apps', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, description, version, category, price, download_url, icon_url, created_at FROM apps ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      apps: result.rows
    });
  } catch (error) {
    console.error('Apps fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch apps' });
  }
});

// Get app by ID
app.get('/api/apps/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT id, name, description, version, category, price, download_url, icon_url, created_at FROM apps WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'App not found' });
    }

    res.json({
      success: true,
      app: result.rows[0]
    });
  } catch (error) {
    console.error('App fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch app' });
  }
});

// Search apps
app.get('/api/apps/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    const result = await pool.query(
      'SELECT id, name, description, version, category, price, download_url, icon_url FROM apps WHERE name ILIKE $1 OR description ILIKE $1',
      [`%${query}%`]
    );

    res.json({
      success: true,
      apps: result.rows
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT category FROM apps WHERE category IS NOT NULL ORDER BY category'
    );

    res.json({
      success: true,
      categories: result.rows.map(row => row.category)
    });
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.listen(PORT, () => {
  console.log(`TauOS Store Backend running on port ${PORT}`);
});
