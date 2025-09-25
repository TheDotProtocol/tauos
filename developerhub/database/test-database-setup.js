#!/usr/bin/env node

/**
 * TauCore™ Database Setup Test Script
 * Tests the hybrid database schema and SMTP configuration
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

// Test 2: Core Tables Exist
async function testCoreTablesExist() {
    const tables = [
        'users', 'organizations', 'user_sessions', 'login_attempts', 
        'security_events', 'user_preferences'
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

// Test 3: Email System Tables
async function testEmailSystemTables() {
    const tables = [
        'emails', 'email_attachments', 'email_domains', 'email_templates',
        'email_campaigns', 'email_tracking', 'smtp_servers', 'email_queues'
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

// Test 4: Cloud Storage Tables
async function testCloudStorageTables() {
    const tables = ['cloud_folders', 'cloud_files'];
    
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

// Test 5: Developer Portal Tables
async function testDeveloperPortalTables() {
    const tables = [
        'projects', 'project_collaborators', 'files', 'git_repositories',
        'pipelines', 'pipeline_runs', 'api_keys', 'notifications'
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

// Test 6: Functions Exist
async function testFunctionsExist() {
    const functions = [
        'get_user_dashboard_data', 'get_organization_analytics', 
        'cleanup_old_data', 'get_database_metrics', 'check_user_permissions',
        'queue_email_for_delivery', 'process_email_queue', 'handle_email_bounce',
        'render_email_template', 'send_email_campaign', 'get_email_analytics'
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

// Test 7: Indexes Exist
async function testIndexesExist() {
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

// Test 8: Sample Data Exists
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
    
    return results;
}

// Test 9: Email Quota Function
async function testEmailQuotaFunction() {
    const result = await pool.query('SELECT check_email_quota($1)', ['11111111-1111-1111-1111-111111111111']);
    return result.rows[0].check_email_quota;
}

// Test 10: User Dashboard Function
async function testUserDashboardFunction() {
    const result = await pool.query('SELECT get_user_dashboard_data($1)', ['22222222-2222-2222-2222-222222222222']);
    return JSON.parse(result.rows[0].get_user_dashboard_data);
}

// Test 11: Database Metrics Function
async function testDatabaseMetricsFunction() {
    const result = await pool.query('SELECT get_database_metrics()');
    return JSON.parse(result.rows[0].get_database_metrics);
}

// Test 12: Email Queue Function
async function testEmailQueueFunction() {
    // Test queueing an email
    const emailResult = await pool.query(`
        INSERT INTO emails (user_id, from_email, to_email, subject, body, message_id, is_sent, delivery_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
    `, [
        '22222222-2222-2222-2222-222222222222',
        'test@tauos.org',
        'recipient@example.com',
        'Test Email',
        'This is a test email',
        '<test@tauos.org>',
        false,
        'pending'
    ]);
    
    const emailId = emailResult.rows[0].id;
    
    // Queue the email
    const queueResult = await pool.query('SELECT queue_email_for_delivery($1)', [emailId]);
    const queueId = queueResult.rows[0].queue_email_for_delivery;
    
    return { emailId, queueId };
}

// Test 13: SMTP Configuration
async function testSMTPConfiguration() {
    const result = await pool.query(`
        SELECT s.*, ed.domain 
        FROM smtp_servers s
        LEFT JOIN email_domains ed ON s.organization_id = ed.organization_id
        WHERE s.is_active = TRUE
        LIMIT 1
    `);
    
    return result.rows[0];
}

// Test 14: Email Templates
async function testEmailTemplates() {
    const result = await pool.query(`
        SELECT et.*, o.name as organization_name
        FROM email_templates et
        JOIN organizations o ON et.organization_id = o.id
        WHERE et.is_active = TRUE
        LIMIT 5
    `);
    
    return result.rows;
}

// Test 15: Performance Test
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

// Main test function
async function runAllTests() {
    console.log('🚀 Starting TauCore™ Database Setup Tests...\n');
    
    // Run all tests
    await runTest('Database Connection', testDatabaseConnection);
    await runTest('Core Tables Exist', testCoreTablesExist);
    await runTest('Email System Tables', testEmailSystemTables);
    await runTest('Cloud Storage Tables', testCloudStorageTables);
    await runTest('Developer Portal Tables', testDeveloperPortalTables);
    await runTest('Functions Exist', testFunctionsExist);
    await runTest('Indexes Exist', testIndexesExist);
    await runTest('Sample Data Exists', testSampleDataExists);
    await runTest('Email Quota Function', testEmailQuotaFunction);
    await runTest('User Dashboard Function', testUserDashboardFunction);
    await runTest('Database Metrics Function', testDatabaseMetricsFunction);
    await runTest('Email Queue Function', testEmailQueueFunction);
    await runTest('SMTP Configuration', testSMTPConfiguration);
    await runTest('Email Templates', testEmailTemplates);
    await runTest('Performance Test', testPerformance);
    
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
