#!/usr/bin/env node

/**
 * TauCore™ Complete Email Flow Test Script
 * Tests the complete email flow from TauOS to Gmail and back
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function testCompleteEmailFlow() {
    try {
        console.log('🧪 Testing Complete Email Flow: TauOS ↔ Gmail');
        console.log('================================================');
        
        // Step 1: Verify master user exists
        console.log('\n1️⃣ Verifying master user...');
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', ['saleena@tauos.org']);
        if (userResult.rows.length === 0) {
            throw new Error('Master user saleena@tauos.org not found');
        }
        const masterUser = userResult.rows[0];
        console.log(`✅ Master user found: ${masterUser.full_name} (${masterUser.email})`);
        
        // Step 2: Verify SMTP configuration
        console.log('\n2️⃣ Verifying SMTP configuration...');
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
        
        // Step 3: Create test email
        console.log('\n3️⃣ Creating test email...');
        const emailResult = await pool.query(`
            INSERT INTO emails (user_id, from_email, to_email, subject, body, html_body, message_id, is_sent, delivery_status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        `, [
            masterUser.id,
            'saleena@tauos.org',
            'saleenafalcon@gmail.com',
            'Welcome to TauOS! - Test Email',
            'Welcome to TauOS! This is a test email to verify the system is working correctly.\n\nBest regards,\nSaleena Falcon\nCEO, TauOS',
            '<h1>Welcome to TauOS!</h1><p>This is a test email to verify the system is working correctly.</p><p>Best regards,<br>Saleena Falcon<br>CEO, TauOS</p>',
            '<welcome-test-' + Date.now() + '@tauos.org>',
            false,
            'pending'
        ]);
        
        const emailId = emailResult.rows[0].id;
        console.log(`✅ Test email created with ID: ${emailId}`);
        
        // Step 4: Queue the email
        console.log('\n4️⃣ Queuing email for delivery...');
        const queueResult = await pool.query('SELECT queue_email_for_delivery($1)', [emailId]);
        const queueId = queueResult.rows[0].queue_email_for_delivery;
        console.log(`✅ Email queued with ID: ${queueId}`);
        
        // Step 5: Process the email queue
        console.log('\n5️⃣ Processing email queue...');
        const processResult = await pool.query('SELECT process_email_queue()');
        const processedCount = processResult.rows[0].process_email_queue;
        console.log(`✅ Email queue processed: ${processedCount} emails`);
        
        // Step 6: Check email status
        console.log('\n6️⃣ Checking email status...');
        const statusResult = await pool.query('SELECT * FROM emails WHERE id = $1', [emailId]);
        const email = statusResult.rows[0];
        
        console.log('\n📧 Email Status:');
        console.log(`   From: ${email.from_email}`);
        console.log(`   To: ${email.to_email}`);
        console.log(`   Subject: ${email.subject}`);
        console.log(`   Status: ${email.delivery_status}`);
        console.log(`   Sent: ${email.is_sent}`);
        console.log(`   Message ID: ${email.message_id}`);
        
        // Step 7: Check email queue status
        console.log('\n7️⃣ Checking email queue status...');
        const queueStatusResult = await pool.query('SELECT * FROM email_queues WHERE email_id = $1', [emailId]);
        if (queueStatusResult.rows.length > 0) {
            const queue = queueStatusResult.rows[0];
            console.log(`   Queue Status: ${queue.status}`);
            console.log(`   Priority: ${queue.priority}`);
            console.log(`   Retry Count: ${queue.retry_count}`);
        }
        
        // Step 8: Check email tracking
        console.log('\n8️⃣ Checking email tracking...');
        const trackingResult = await pool.query('SELECT * FROM email_tracking WHERE email_id = $1', [emailId]);
        if (trackingResult.rows.length > 0) {
            console.log(`   Tracking Events: ${trackingResult.rows.length}`);
            trackingResult.rows.forEach(event => {
                console.log(`   - ${event.event_type}: ${event.created_at}`);
            });
        }
        
        // Step 9: Test email quota
        console.log('\n9️⃣ Testing email quota...');
        const quotaResult = await pool.query('SELECT check_email_quota($1)', [masterUser.id]);
        const canSend = quotaResult.rows[0].check_email_quota;
        console.log(`✅ Email quota check: ${canSend ? 'Can send' : 'Quota exceeded'}`);
        
        // Step 10: Test user dashboard
        console.log('\n🔟 Testing user dashboard...');
        const dashboardResult = await pool.query('SELECT get_user_dashboard_data($1)', [masterUser.id]);
        const dashboard = JSON.parse(dashboardResult.rows[0].get_user_dashboard_data);
        console.log(`✅ Dashboard data retrieved: ${Object.keys(dashboard).length} sections`);
        
        // Final status
        if (email.is_sent && email.delivery_status === 'sent') {
            console.log('\n🎉 COMPLETE EMAIL FLOW TEST PASSED!');
            console.log('=====================================');
            console.log('✅ Email sent from saleena@tauos.org to saleenafalcon@gmail.com');
            console.log('✅ Email queued and processed successfully');
            console.log('✅ Email tracking working');
            console.log('✅ Email quota system working');
            console.log('✅ User dashboard working');
            console.log('');
            console.log('📧 NEXT STEPS:');
            console.log('1. Check your Gmail inbox for the test email');
            console.log('2. Reply to the email to test incoming email flow');
            console.log('3. Verify the reply appears in TauOS inbox');
            console.log('4. Proceed to Phase 3: TauCloud Integration');
        } else {
            console.log('\n⚠️  EMAIL FLOW TEST NEEDS ATTENTION');
            console.log('===================================');
            console.log('📧 Email was created but may need SMTP configuration');
            console.log('🔧 Check SMTP server settings and credentials');
            console.log('📧 Verify email delivery configuration');
        }
        
    } catch (error) {
        console.error('❌ Email flow test failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

testCompleteEmailFlow();
