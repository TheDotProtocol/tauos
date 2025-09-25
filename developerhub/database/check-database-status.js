#!/usr/bin/env node

/**
 * TauCore™ Database Status Checker
 * Checks what's in the database and creates master user if needed
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

async function checkDatabaseStatus() {
    try {
        console.log('🔍 Checking Database Status');
        console.log('==========================');
        
        // Check database connection
        console.log('\n1️⃣ Database Connection:');
        const connectionResult = await pool.query('SELECT NOW() as current_time');
        console.log(`✅ Connected: ${connectionResult.rows[0].current_time}`);
        
        // Check if tables exist
        console.log('\n2️⃣ Checking Tables:');
        const tablesResult = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);
        console.log(`✅ Found ${tablesResult.rows.length} tables:`);
        tablesResult.rows.forEach(row => console.log(`   - ${row.table_name}`));
        
        // Check users table
        console.log('\n3️⃣ Checking Users:');
        const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
        console.log(`✅ Total users: ${usersResult.rows[0].count}`);
        
        if (usersResult.rows[0].count > 0) {
            const sampleUsers = await pool.query('SELECT id, email, full_name FROM users LIMIT 5');
            console.log('📧 Sample users:');
            sampleUsers.rows.forEach(user => {
                console.log(`   - ${user.full_name} (${user.email})`);
            });
        }
        
        // Check if master user exists
        console.log('\n4️⃣ Checking Master User:');
        const masterUserResult = await pool.query('SELECT * FROM users WHERE email = $1', ['saleena@tauos.org']);
        if (masterUserResult.rows.length > 0) {
            const masterUser = masterUserResult.rows[0];
            console.log(`✅ Master user found: ${masterUser.full_name} (${masterUser.email})`);
        } else {
            console.log('❌ Master user saleena@tauos.org not found');
            console.log('🔧 Creating master user...');
            
            // Create master user
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash('Saleena@132', 12);
            
            const createUserResult = await pool.query(`
                INSERT INTO users (id, email, password_hash, full_name, is_email_verified, role, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
                RETURNING id, email, full_name
            `, [
                '00000000-0000-0000-0000-000000000001',
                'saleena@tauos.org',
                hashedPassword,
                'Saleena Falcon',
                true,
                'admin'
            ]);
            
            const newUser = createUserResult.rows[0];
            console.log(`✅ Master user created: ${newUser.full_name} (${newUser.email})`);
        }
        
        // Check SMTP configuration
        console.log('\n5️⃣ Checking SMTP Configuration:');
        const smtpResult = await pool.query('SELECT COUNT(*) as count FROM smtp_servers');
        console.log(`✅ SMTP servers: ${smtpResult.rows[0].count}`);
        
        // Check email domains
        const domainsResult = await pool.query('SELECT COUNT(*) as count FROM email_domains');
        console.log(`✅ Email domains: ${domainsResult.rows[0].count}`);
        
        // Check organizations
        const orgsResult = await pool.query('SELECT COUNT(*) as count FROM organizations');
        console.log(`✅ Organizations: ${orgsResult.rows[0].count}`);
        
        // Check emails
        const emailsResult = await pool.query('SELECT COUNT(*) as count FROM emails');
        console.log(`✅ Emails: ${emailsResult.rows[0].count}`);
        
        // Check cloud files
        const filesResult = await pool.query('SELECT COUNT(*) as count FROM cloud_files');
        console.log(`✅ Cloud files: ${filesResult.rows[0].count}`);
        
        // Check projects
        const projectsResult = await pool.query('SELECT COUNT(*) as count FROM projects');
        console.log(`✅ Projects: ${projectsResult.rows[0].count}`);
        
        // Check store apps
        const appsResult = await pool.query('SELECT COUNT(*) as count FROM store_apps');
        console.log(`✅ Store apps: ${appsResult.rows[0].count}`);
        
        // Check browser bookmarks
        const bookmarksResult = await pool.query('SELECT COUNT(*) as count FROM browser_bookmarks');
        console.log(`✅ Browser bookmarks: ${bookmarksResult.rows[0].count}`);
        
        // Check AI conversations
        const aiResult = await pool.query('SELECT COUNT(*) as count FROM ai_conversations');
        console.log(`✅ AI conversations: ${aiResult.rows[0].count}`);
        
        console.log('\n🎉 DATABASE STATUS CHECK COMPLETE!');
        console.log('===================================');
        console.log('✅ Database connection working');
        console.log('✅ All tables present');
        console.log('✅ Master user ready');
        console.log('✅ Ready for email flow testing');
        
    } catch (error) {
        console.error('❌ Database status check failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

checkDatabaseStatus();
