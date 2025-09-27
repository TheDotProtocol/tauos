const { Pool } = require('pg');

// Test database connection
const pool = new Pool({
  connectionString: 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await pool.query('SELECT COUNT(*) FROM users');
    console.log('✅ Database connection successful!');
    console.log('User count:', result.rows[0].count);
    
    // Test user lookup
    const userResult = await pool.query('SELECT id, username, email FROM users WHERE email = $1', ['saleena@tauos.org']);
    console.log('User lookup result:', userResult.rows);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await pool.end();
  }
}

testConnection();