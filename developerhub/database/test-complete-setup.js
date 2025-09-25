#!/usr/bin/env node

/**
 * TauCore™ Complete Database Setup Test Script
 * Tests the complete hybrid database schema and all applications
 */

const { Pool } = require('pg');
require('dotenv').config();

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test results
const testResults = {
    passed: 0,
    failed: 0,
    tests: []
};

// Helper function to run test
async function runTest(testName, testFunction) {
    try {
        console.log(`\n🧪 Testing: ${testName}`);
        const result = await testFunction();
        testResults.passed++;
        testResults.tests.push({ name: testName, status: 'PASSED', result });
        console.log(`✅ ${testName}: PASSED`);
        return result;
    } catch (error) {
        testResults.failed++;
        testResults.tests.push({ name: testName, status: 'FAILED', error: error.message });
        console.log(`❌ ${testName}: FAILED - ${error.message}`);
        return null;
    }
}

// Test 1: Database Connection
async function testDatabaseConnection() {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    client.release();
    return result.rows[0];
}

// Test 2: Master User Exists
async function testMasterUserExists() {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', ['saleena@tauos.org']);
    if (result.rows.length === 0) {
        throw new Error('Master user saleena@tauos.org not found');
    }
    return result.rows[0];
}

// Test 3: Organization Exists
async function testOrganizationExists() {
    const result = await pool.query('SELECT * FROM organizations WHERE domain = $1', ['tauos.org']);
    if (result.rows.length === 0) {
        throw new Error('TauOS Foundation organization not found');
    }
    return result.rows[0];
}

// Test 4: SMTP Configuration
async function testSMTPConfiguration() {
    const result = await pool.query(`
        SELECT s.*, ed.domain 
        FROM smtp_servers s
        LEFT JOIN email_domains ed ON s.organization_id = ed.organization_id
        WHERE s.is_active = TRUE
        LIMIT 1
    `);
    
    if (result.rows.length === 0) {
        throw new Error('No active SMTP servers found');
    }
    
    return result.rows[0];
}

// Test 5: Email Templates
async function testEmailTemplates() {
    const result = await pool.query(`
        SELECT et.*, o.name as organization_name
        FROM email_templates et
        JOIN organizations o ON et.organization_id = o.id
        WHERE et.is_active = TRUE
        LIMIT 5
    `);
    
    if (result.rows.length === 0) {
        throw new Error('No email templates found');
    }
    
    return result.rows;
}

// Test 6: Email Quota Function
async function testEmailQuotaFunction() {
    const result = await pool.query('SELECT check_email_quota($1)', ['11111111-1111-1111-1111-111111111111']);
    return result.rows[0].check_email_quota;
}

// Test 7: User Dashboard Function
async function testUserDashboardFunction() {
    const result = await pool.query('SELECT get_user_dashboard_data($1)', ['11111111-1111-1111-1111-111111111111']);
    return JSON.parse(result.rows[0].get_user_dashboard_data);
}

// Test 8: Email Queue Function
async function testEmailQueueFunction() {
    // Test queueing an email
    const emailResult = await pool.query(`
        INSERT INTO emails (user_id, from_email, to_email, subject, body, message_id, is_sent, delivery_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
    `, [
        '11111111-1111-1111-1111-111111111111',
        'saleena@tauos.org',
        'saleenafalcon@gmail.com',
        'Test Email from TauOS',
        'This is a test email from TauOS to verify the system is working.',
        '<test-' + Date.now() + '@tauos.org>',
        false,
        'pending'
    ]);
    
    const emailId = emailResult.rows[0].id;
    
    // Queue the email
    const queueResult = await pool.query('SELECT queue_email_for_delivery($1)', [emailId]);
    const queueId = queueResult.rows[0].queue_email_for_delivery;
    
    return { emailId, queueId };
}

// Test 9: Process Email Queue
async function testProcessEmailQueue() {
    const result = await pool.query('SELECT process_email_queue()');
    return result.rows[0].process_email_queue;
}

// Test 10: Sample Data Exists
async function testSampleDataExists() {
    const results = {};
    
    // Test organizations
    const orgResult = await pool.query('SELECT COUNT(*) as count FROM organizations');
    results.organizations = orgResult.rows[0].count;
    
    // Test users
    const userResult = await pool.query('SELECT COUNT(*) as count FROM users');
    results.users = userResult.rows[0].count;
    
    // Test emails
    const emailResult = await pool.query('SELECT COUNT(*) as count FROM emails');
    results.emails = emailResult.rows[0].count;
    
    // Test projects
    const projectResult = await pool.query('SELECT COUNT(*) as count FROM projects');
    results.projects = projectResult.rows[0].count;
    
    // Test cloud files
    const fileResult = await pool.query('SELECT COUNT(*) as count FROM cloud_files');
    results.cloud_files = fileResult.rows[0].count;
    
    // Test store apps
    const appResult = await pool.query('SELECT COUNT(*) as count FROM store_apps');
    results.store_apps = appResult.rows[0].count;
    
    // Test browser bookmarks
    const bookmarkResult = await pool.query('SELECT COUNT(*) as count FROM browser_bookmarks');
    results.browser_bookmarks = bookmarkResult.rows[0].count;
    
    // Test AI conversations
    const aiResult = await pool.query('SELECT COUNT(*) as count FROM ai_conversations');
    results.ai_conversations = aiResult.rows[0].count;
    
    return results;
}

// Test 11: All Tables Exist
async function testAllTablesExist() {
    const tables = [
        'users', 'organizations', 'user_sessions', 'login_attempts', 
        'security_events', 'user_preferences', 'emails', 'email_attachments',
        'smtp_servers', 'email_domains', 'email_templates', 'email_campaigns',
        'email_tracking', 'email_queues', 'cloud_folders', 'cloud_files',
        'store_categories', 'store_apps', 'browser_bookmarks', 'browser_history',
        'ai_models', 'ai_conversations', 'projects', 'project_collaborators',
        'files', 'git_repositories', 'pipelines', 'pipeline_runs',
        'api_keys', 'notifications'
    ];
    
    const results = {};
    for (const table of tables) {
        const result = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = $1
            )
        `, [table]);
        results[table] = result.rows[0].exists;
    }
    
    return results;
}

// Test 12: All Functions Exist
async function testAllFunctionsExist() {
    const functions = [
        'check_email_quota', 'get_user_dashboard_data', 'queue_email_for_delivery',
        'process_email_queue', 'update_updated_at_column', 'create_default_user_preferences'
    ];
    
    const results = {};
    for (const func of functions) {
        const result = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.routines 
                WHERE routine_schema = 'public' 
                AND routine_name = $1
            )
        `, [func]);
        results[func] = result.rows[0].exists;
    }
    
    return results;
}

// Test 13: All Indexes Exist
async function testAllIndexesExist() {
    const indexes = [
        'idx_users_email', 'idx_users_username', 'idx_emails_user_id',
        'idx_cloud_files_user_id', 'idx_projects_user_id', 'idx_email_queues_status'
    ];
    
    const results = {};
    for (const index of indexes) {
        const result = await pool.query(`
            SELECT EXISTS (
                SELECT FROM pg_indexes 
                WHERE indexname = $1
            )
        `, [index]);
        results[index] = result.rows[0].exists;
    }
    
    return results;
}

// Test 14: Performance Test
async function testPerformance() {
    const startTime = Date.now();
    
    // Run a complex query
    const result = await pool.query(`
        SELECT 
            u.username,
            COUNT(e.id) as email_count,
            COUNT(cf.id) as file_count,
            COUNT(p.id) as project_count
        FROM users u
        LEFT JOIN emails e ON u.id = e.user_id
        LEFT JOIN cloud_files cf ON u.id = cf.user_id
        LEFT JOIN projects p ON u.id = p.user_id
        GROUP BY u.id, u.username
        ORDER BY email_count DESC
        LIMIT 10
    `);
    
    const endTime = Date.now();
    const executionTime = endTime - startTime;
    
    return {
        executionTime,
        resultCount: result.rows.length,
        performance: executionTime < 1000 ? 'GOOD' : executionTime < 3000 ? 'ACCEPTABLE' : 'SLOW'
    };
}

// Test 15: Email Flow Test (Critical)
async function testEmailFlow() {
    // Create a test email from saleena@tauos.org to saleenafalcon@gmail.com
    const emailResult = await pool.query(`
        INSERT INTO emails (user_id, from_email, to_email, subject, body, html_body, message_id, is_sent, delivery_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
    `, [
        '11111111-1111-1111-1111-111111111111',
        'saleena@tauos.org',
        'saleenafalcon@gmail.com',
        'Welcome to TauOS!',
        'Welcome to TauOS! This is a test email to verify the system is working correctly.',
        '<h1>Welcome to TauOS!</h1><p>This is a test email to verify the system is working correctly.</p><p>Best regards,<br>Saleena Falcon<br>CEO, TauOS</p>',
        '<welcome-test@tauos.org>',
        false,
        'pending'
    ]);
    
    const emailId = emailResult.rows[0].id;
    
    // Queue the email for delivery
    const queueResult = await pool.query('SELECT queue_email_for_delivery($1)', [emailId]);
    const queueId = queueResult.rows[0].queue_email_for_delivery;
    
    // Process the email queue
    const processResult = await pool.query('SELECT process_email_queue()');
    const processedCount = processResult.rows[0].process_email_queue;
    
    return {
        emailId,
        queueId,
        processedCount,
        message: 'Email flow test completed - email queued and processed'
    };
}

// Main test function
async function runAllTests() {
    console.log('🚀 Starting TauCore™ Complete Database Setup Tests...\n');
    
    // Run all tests
    await runTest('Database Connection', testDatabaseConnection);
    await runTest('Master User Exists', testMasterUserExists);
    await runTest('Organization Exists', testOrganizationExists);
    await runTest('SMTP Configuration', testSMTPConfiguration);
    await runTest('Email Templates', testEmailTemplates);
    await runTest('Email Quota Function', testEmailQuotaFunction);
    await runTest('User Dashboard Function', testUserDashboardFunction);
    await runTest('Email Queue Function', testEmailQueueFunction);
    await runTest('Process Email Queue', testProcessEmailQueue);
    await runTest('Sample Data Exists', testSampleDataExists);
    await runTest('All Tables Exist', testAllTablesExist);
    await runTest('All Functions Exist', testAllFunctionsExist);
    await runTest('All Indexes Exist', testAllIndexesExist);
    await runTest('Performance Test', testPerformance);
    await runTest('Email Flow Test (Critical)', testEmailFlow);
    
    // Print summary
    console.log('\n📊 Test Summary:');
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(2)}%`);
    
    // Print detailed results
    console.log('\n📋 Detailed Results:');
    testResults.tests.forEach(test => {
        const status = test.status === 'PASSED' ? '✅' : '❌';
        console.log(`${status} ${test.name}: ${test.status}`);
        if (test.status === 'FAILED') {
            console.log(`   Error: ${test.error}`);
        }
    });
    
    // Final status
    if (testResults.failed === 0) {
        console.log('\n🎉 All tests passed! Database setup is complete and ready for production.');
        console.log('\n🚀 Next Steps:');
        console.log('1. Run the SQL files in Supabase:');
        console.log('   - hybrid-schema-complete.sql');
        console.log('   - hybrid-seed-complete.sql');
        console.log('2. Test email sending from saleena@tauos.org to saleenafalcon@gmail.com');
        console.log('3. Verify email receiving in TauOS inbox');
        console.log('4. Proceed to Phase 2: TauMail Integration');
    } else {
        console.log('\n⚠️  Some tests failed. Please review the errors and fix them before proceeding.');
    }
    
    return testResults.failed === 0;
}

// Run tests
if (require.main === module) {
    runAllTests()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('❌ Test execution failed:', error);
            process.exit(1);
        });
}

module.exports = { runAllTests, runTest };
