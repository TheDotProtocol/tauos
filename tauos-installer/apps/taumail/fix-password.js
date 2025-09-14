const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
    connectionString: 'postgresql://postgres:Ak1233@@5@db.tviqcormikopltejomkc.supabase.co:5432/postgres',
    ssl: {
        rejectUnauthorized: false
    }
});

async function fixPassword() {
    try {
        console.log('🔧 Fixing password hash...');
        
        // Generate new hash
        const newHash = await bcrypt.hash('password123', 12);
        console.log('🆕 New hash:', newHash);
        
        // Update database
        const result = await pool.query(
            'UPDATE users SET password_hash = $1 WHERE email = $2',
            [newHash, 'john@tauos.org']
        );
        
        console.log('✅ Password updated for john@tauos.org');
        console.log('📊 Rows affected:', result.rowCount);
        
        // Test the new hash
        const testResult = await pool.query('SELECT password_hash FROM users WHERE email = $1', ['john@tauos.org']);
        const storedHash = testResult.rows[0].password_hash;
        const isValid = await bcrypt.compare('password123', storedHash);
        console.log('✅ New hash verification:', isValid);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

fixPassword();
