const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://postgres:Ak1233@@5@db.tviqcormikopltejomkc.supabase.co:5432/postgres',
    ssl: {
        rejectUnauthorized: false
    }
});

async function fixStorageQuota() {
    try {
        console.log('🔧 Fixing storage quota function...');
        
        // Drop and recreate the function with proper integer handling
        await pool.query(`
            CREATE OR REPLACE FUNCTION check_storage_quota(user_uuid UUID, file_size BIGINT)
            RETURNS BOOLEAN AS $$
            DECLARE
                org_storage_limit BIGINT;
                user_storage_used BIGINT;
            BEGIN
                -- Get organization storage limit in bytes (using BIGINT arithmetic)
                SELECT (o.storage_limit_gb::BIGINT * 1024 * 1024 * 1024) INTO org_storage_limit
                FROM users u
                JOIN organizations o ON u.organization_id = o.id
                WHERE u.id = user_uuid;
                
                -- Get current storage used by user
                SELECT COALESCE(SUM(f.file_size), 0) INTO user_storage_used
                FROM files f
                WHERE f.user_id = user_uuid;
                
                -- Check if adding this file would exceed quota
                RETURN (user_storage_used + file_size) <= org_storage_limit;
            END;
            $$ LANGUAGE plpgsql;
        `);
        
        console.log('✅ Storage quota function updated');
        
        // Test the function
        const quotaResult = await pool.query('SELECT check_storage_quota($1, $2) as can_upload', ['e41f4185-cb88-4df1-9981-84cf723eb98e', 100]);
        console.log('✅ Can upload 100 bytes:', quotaResult.rows[0].can_upload);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

fixStorageQuota();
