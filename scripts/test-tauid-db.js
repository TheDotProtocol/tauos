const { Pool } = require('pg');

// Test database connection for TauID
const pool = new Pool({
  connectionString: 'postgresql://postgres:Ak1233%40%405@db.tviqcormikopltejomkc.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    console.log('🔄 Testing TauID database connection...');
    
    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Database connection successful');
    
    // Test if users table exists
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    
    console.log('📊 Users table columns:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });
    
    // Test if we can insert a test user
    const testUser = await client.query(`
      INSERT INTO users (id, username, email, password_hash, full_name, organization_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING
      RETURNING id, username, email
    `, [
      '00000000-0000-0000-0000-000000000001',
      'testuser',
      'test@tauos.org',
      '$2b$10$test.hash.here',
      'Test User',
      '00000000-0000-0000-0000-000000000000'
    ]);
    
    if (testUser.rows.length > 0) {
      console.log('✅ Test user created successfully:', testUser.rows[0]);
    } else {
      console.log('ℹ️ Test user already exists');
    }
    
    client.release();
    console.log('🎉 TauID database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

testConnection();
