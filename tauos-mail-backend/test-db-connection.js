const { Pool } = require('pg');

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Ak1233%40%405@db.tviqcormikopltejomkc.supabase.co:5432/postgres',
    ssl: {
        rejectUnauthorized: false
    }
});

async function testConnection() {
    try {
        console.log('🔍 Testing database connection...');
        
        // Test basic connection
        const result = await pool.query('SELECT NOW() as current_time');
        console.log('✅ Database connected successfully');
        console.log('⏰ Current time:', result.rows[0].current_time);
        
        // Check if users table exists
        const usersTable = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            );
        `);
        
        console.log('👥 Users table exists:', usersTable.rows[0].exists);
        
        // Check if sent_emails table exists
        const sentEmailsTable = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'sent_emails'
            );
        `);
        
        console.log('📤 Sent emails table exists:', sentEmailsTable.rows[0].exists);
        
        // Check if incoming_emails table exists
        const incomingEmailsTable = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'incoming_emails'
            );
        `);
        
        console.log('📥 Incoming emails table exists:', incomingEmailsTable.rows[0].exists);
        
        // Create tables if they don't exist
        if (!usersTable.rows[0].exists) {
            console.log('🔨 Creating users table...');
            await pool.query(`
                CREATE TABLE users (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    full_name VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log('✅ Users table created');
        }
        
        if (!sentEmailsTable.rows[0].exists) {
            console.log('🔨 Creating sent_emails table...');
            await pool.query(`
                CREATE TABLE sent_emails (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    user_id VARCHAR(255) NOT NULL,
                    recipient_email VARCHAR(255) NOT NULL,
                    subject VARCHAR(500) NOT NULL,
                    body TEXT NOT NULL,
                    message_id VARCHAR(255),
                    smtp_status VARCHAR(100),
                    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log('✅ Sent emails table created');
        }
        
        if (!incomingEmailsTable.rows[0].exists) {
            console.log('🔨 Creating incoming_emails table...');
            await pool.query(`
                CREATE TABLE incoming_emails (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    user_id VARCHAR(255) NOT NULL,
                    from_email VARCHAR(255) NOT NULL,
                    subject VARCHAR(500) NOT NULL,
                    body TEXT NOT NULL,
                    message_id VARCHAR(255),
                    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    is_read BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log('✅ Incoming emails table created');
        }
        
        console.log('🎉 Database setup complete!');
        
    } catch (error) {
        console.error('❌ Database error:', error);
    } finally {
        await pool.end();
    }
}

testConnection();
