const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://postgres:Ak1233@@5@db.tviqcormikopltejomkc.supabase.co:5432/postgres',
    ssl: {
        rejectUnauthorized: false
    }
});

async function checkUser() {
    try {
        console.log('🔍 Checking database connection...');
        
        // Check if users table exists and has data
        const result = await pool.query('SELECT COUNT(*) FROM users');
        console.log('📊 Total users in database:', result.rows[0].count);
        
        // Check if john@tauos.org exists
        const userResult = await pool.query('SELECT id, email, username, is_active FROM users WHERE email = $1', ['john@tauos.org']);
        console.log('👤 John user data:', userResult.rows);
        
        // Check password hash
        if (userResult.rows.length > 0) {
            const user = userResult.rows[0];
            console.log('🔐 User details:', {
                id: user.id,
                email: user.email,
                username: user.username,
                is_active: user.is_active
            });
        }
        
        // Check organizations
        const orgResult = await pool.query('SELECT * FROM organizations');
        console.log('🏢 Organizations:', orgResult.rows);
        
    } catch (error) {
        console.error('❌ Database error:', error.message);
    } finally {
        await pool.end();
    }
}

checkUser();
