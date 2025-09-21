const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3005;

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
    service: 'TauOS Browser Backend v2.0',
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// Get bookmarks
app.get('/api/bookmarks', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, url, favicon, created_at FROM bookmarks ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      bookmarks: result.rows
    });
  } catch (error) {
    console.error('Bookmarks error:', error);
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

// Add bookmark
app.post('/api/bookmarks', async (req, res) => {
  try {
    const { title, url, favicon } = req.body;
    
    const result = await pool.query(
      'INSERT INTO bookmarks (title, url, favicon) VALUES ($1, $2, $3) RETURNING id, title, url, favicon, created_at',
      [title, url, favicon]
    );

    res.json({
      success: true,
      bookmark: result.rows[0]
    });
  } catch (error) {
    console.error('Add bookmark error:', error);
    res.status(500).json({ error: 'Failed to add bookmark' });
  }
});

// Delete bookmark
app.delete('/api/bookmarks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM bookmarks WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Bookmark deleted'
    });
  } catch (error) {
    console.error('Delete bookmark error:', error);
    res.status(500).json({ error: 'Failed to delete bookmark' });
  }
});

// Get browsing history
app.get('/api/history', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, url, visit_count, last_visited FROM browsing_history ORDER BY last_visited DESC LIMIT 100'
    );

    res.json({
      success: true,
      history: result.rows
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Add to history
app.post('/api/history', async (req, res) => {
  try {
    const { title, url } = req.body;
    
    // Check if URL already exists
    const existing = await pool.query(
      'SELECT id, visit_count FROM browsing_history WHERE url = $1',
      [url]
    );

    if (existing.rows.length > 0) {
      // Update visit count
      await pool.query(
        'UPDATE browsing_history SET visit_count = visit_count + 1, last_visited = NOW() WHERE id = $1',
        [existing.rows[0].id]
      );
    } else {
      // Insert new entry
      await pool.query(
        'INSERT INTO browsing_history (title, url, visit_count) VALUES ($1, $2, 1)',
        [title, url]
      );
    }

    res.json({
      success: true,
      message: 'History updated'
    });
  } catch (error) {
    console.error('Add history error:', error);
    res.status(500).json({ error: 'Failed to add to history' });
  }
});

app.listen(PORT, () => {
  console.log(`TauOS Browser Backend running on port ${PORT}`);
});
