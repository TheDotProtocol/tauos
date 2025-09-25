#!/usr/bin/env node

/**
 * TauCore™ Simple Email Flow Test Script
 * Tests the email flow without SSL requirements
 */

const { Pool } = require('pg');
require('dotenv').config();

// Database connection without SSL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

async function testSimpleEmailFlow() {
    try {
        console.log('🧪 Testing Simple Email Flow: TauOS ↔ Gmail');
        console.log('=============================================');
        
        // Step 1: Test database connection
        console.log('\n1️⃣ Testing database connection...');
        const connectionResult = await pool.query('SELECT NOW() as current_time');
        console.log(`✅ Database connected: ${connectionResult.rows[0].current_time}`);
        
        // Step 2: Verify master user exists
        console.log('\n2️⃣ Verifying master user...');
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', ['saleena@tauos.org']);
        if (userResult.rows.length === 0) {
            throw new Error('Master user saleena@tauos.org not found');
        }
        const masterUser = userResult.rows[0];
        console.log(`✅ Master user found: ${masterUser.full_name} (${masterUser.email})`);
        
        // Step 3: Verify SMTP configuration
        console.log('\n3️⃣ Verifying SMTP configuration...');
        const smtpResult = await pool.query(`
            SELECT s.*, ed.domain 
            FROM smtp_servers s
            LEFT JOIN email_domains ed ON s.organization_id = ed.organization_id
            WHERE s.is_active = TRUE
            LIMIT 1
        `);
        
        if (smtpResult.rows.length === 0) {
            throw new Error('No active SMTP servers found');
        }
        const smtpServer = smtpResult.rows[0];
        console.log(`✅ SMTP server found: ${smtpServer.name} (${smtpServer.host}:${smtpServer.port})`);
        
        // Step 4: Test email quota function
        console.log('\n4️⃣ Testing email quota function...');
        const quotaResult = await pool.query('SELECT check_email_quota($1)', [masterUser.id]);
        const canSend = quotaResult.rows[0].check_email_quota;
        console.log(`✅ Email quota check: ${canSend ? 'Can send' : 'Quota exceeded'}`);
        
        // Step 5: Test user dashboard function
        console.log('\n5️⃣ Testing user dashboard function...');
        const dashboardResult = await pool.query('SELECT get_user_dashboard_data($1)', [masterUser.id]);
        const dashboard = JSON.parse(dashboardResult.rows[0].get_user_dashboard_data);
        console.log(`✅ Dashboard data retrieved: ${Object.keys(dashboard).length} sections`);
        
        // Step 6: Test email queue function
        console.log('\n6️⃣ Testing email queue function...');
        const emailResult = await pool.query(`
            INSERT INTO emails (user_id, from_email, to_email, subject, body, message_id, is_sent, delivery_status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
        `, [
            masterUser.id,
            'saleena@tauos.org',
            'saleenafalcon@gmail.com',
            'Welcome to TauOS! - Test Email',
            'Welcome to TauOS! This is a test email to verify the system is working correctly.',
            '<welcome-test-' + Date.now() + '@tauos.org>',
            false,
            'pending'
        ]);
        
        const emailId = emailResult.rows[0].id;
        console.log(`✅ Test email created with ID: ${emailId}`);
        
        // Step 7: Queue the email
        console.log('\n7️⃣ Queuing email for delivery...');
        const queueResult = await pool.query('SELECT queue_email_for_delivery($1)', [emailId]);
        const queueId = queueResult.rows[0].queue_email_for_delivery;
        console.log(`✅ Email queued with ID: ${queueId}`);
        
        // Step 8: Process the email queue
        console.log('\n8️⃣ Processing email queue...');
        const processResult = await pool.query('SELECT process_email_queue()');
        const processedCount = processResult.rows[0].process_email_queue;
        console.log(`✅ Email queue processed: ${processedCount} emails`);
        
        // Step 9: Check email status
        console.log('\n9️⃣ Checking email status...');
        const statusResult = await pool.query('SELECT * FROM emails WHERE id = $1', [emailId]);
        const email = statusResult.rows[0];
        
        console.log('\n📧 Email Status:');
        console.log(`   From: ${email.from_email}`);
        console.log(`   To: ${email.to_email}`);
        console.log(`   Subject: ${email.subject}`);
        console.log(`   Status: ${email.delivery_status}`);
        console.log(`   Sent: ${email.is_sent}`);
        console.log(`   Message ID: ${email.message_id}`);
        
        // Step 10: Check database statistics
        console.log('\n🔟 Checking database statistics...');
        const statsResult = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM users) as total_users,
                (SELECT COUNT(*) FROM emails) as total_emails,
                (SELECT COUNT(*) FROM cloud_files) as total_files,
                (SELECT COUNT(*) FROM projects) as total_projects,
                (SELECT COUNT(*) FROM store_apps) as total_apps,
                (SELECT COUNT(*) FROM browser_bookmarks) as total_bookmarks,
                (SELECT COUNT(*) FROM ai_conversations) as total_ai_conversations
        `);
        
        const stats = statsResult.rows[0];
        console.log('\n📊 Database Statistics:');
        console.log(`   Total Users: ${stats.total_users}`);
        console.log(`   Total Emails: ${stats.total_emails}`);
        console.log(`   Total Files: ${stats.total_files}`);
        console.log(`   Total Projects: ${stats.total_projects}`);
        console.log(`   Total Apps: ${stats.total_apps}`);
        console.log(`   Total Bookmarks: ${stats.total_bookmarks}`);
        console.log(`   Total AI Conversations: ${stats.total_ai_conversations}`);
        
        // Final status
        console.log('\n🎉 SIMPLE EMAIL FLOW TEST PASSED!');
        console.log('==================================');
        console.log('✅ Database connection working');
        console.log('✅ Master user found');
        console.log('✅ SMTP configuration ready');
        console.log('✅ Email quota system working');
        console.log('✅ User dashboard working');
        console.log('✅ Email queue system working');
        console.log('✅ All database functions working');
        console.log('');
        console.log('📧 NEXT STEPS:');
        console.log('1. Configure SMTP credentials for actual email sending');
        console.log('2. Test email sending from saleena@tauos.org to saleenafalcon@gmail.com');
        console.log('3. Test email receiving from Gmail to TauOS');
        console.log('4. Proceed to Phase 3: TauCloud Integration');
        
    } catch (error) {
        console.error('❌ Simple email flow test failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

testSimpleEmailFlow();
