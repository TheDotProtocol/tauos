const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
    connectionString: 'postgresql://postgres:Ak1233@@5@db.tviqcormikopltejomkc.supabase.co:5432/postgres',
    ssl: {
        rejectUnauthorized: false
    }
});

async function testPassword() {
    try {
        console.log('🔍 Testing password verification...');
        
        // Get user password hash from database
        const result = await pool.query('SELECT password_hash FROM users WHERE email = $1', ['john@tauos.org']);
        
        if (result.rows.length === 0) {
            console.log('❌ User not found');
            return;
        }
        
        const storedHash = result.rows[0].password_hash;
        console.log('🔐 Stored hash:', storedHash);
        
        // Test password verification
        const testPassword = 'password123';
        const isValid = await bcrypt.compare(testPassword, storedHash);
        console.log('✅ Password verification result:', isValid);
        
        // Generate a new hash for comparison
        const newHash = await bcrypt.hash(testPassword, 12);
        console.log('🆕 New hash would be:', newHash);
        
        // Test the new hash
        const newHashValid = await bcrypt.compare(testPassword, newHash);
        console.log('✅ New hash verification:', newHashValid);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

testPassword();
