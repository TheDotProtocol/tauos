const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://postgres:Ak1233@@5@db.tviqcormikopltejomkc.supabase.co:5432/postgres',
    ssl: {
        rejectUnauthorized: false
    }
});

async function checkStorageQuota() {
    try {
        console.log('🔍 Checking storage quota...');
        
        // Get user and organization info
        const result = await pool.query(`
            SELECT u.id, u.email, u.storage_used_bytes, 
                   o.storage_limit_gb, o.storage_limit_gb * 1024 * 1024 * 1024 as storage_limit_bytes
            FROM users u
            JOIN organizations o ON u.organization_id = o.id
            WHERE u.email = $1
        `, ['john@tauos.org']);
        
        if (result.rows.length > 0) {
            const user = result.rows[0];
            console.log('👤 User:', user.email);
            console.log('💾 Storage used:', user.storage_used_bytes, 'bytes');
            console.log('📊 Storage limit:', user.storage_limit_gb, 'GB');
            console.log('📊 Storage limit bytes:', user.storage_limit_bytes, 'bytes');
            console.log('📈 Usage percentage:', ((user.storage_used_bytes / user.storage_limit_bytes) * 100).toFixed(2) + '%');
        }
        
        // Test the storage quota function
        const quotaResult = await pool.query('SELECT check_storage_quota($1, $2) as can_upload', ['e41f4185-cb88-4df1-9981-84cf723eb98e', 100]);
        console.log('✅ Can upload 100 bytes:', quotaResult.rows[0].can_upload);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkStorageQuota();
