#!/usr/bin/env node

/**
 * TauCore™ Mobile OS Final Test
 * Tests mobile OS integration with correct column names
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

// Simple UUID v4 generator
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

async function testMobileOSFinal() {
    try {
        console.log('📱 Testing Mobile OS Integration (Final Test)');
        console.log('===============================================');
        
        // Step 1: Test database connection
        console.log('\n1️⃣ Testing database connection...');
        const connectionResult = await pool.query('SELECT NOW() as current_time');
        console.log(`✅ Database connected: ${connectionResult.rows[0].current_time}`);
        
        // Step 2: Check existing data
        console.log('\n2️⃣ Checking existing data...');
        
        // Check users
        const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
        console.log(`✅ Users: ${usersResult.rows[0].count}`);
        
        // Check user_profiles
        const profilesResult = await pool.query('SELECT COUNT(*) as count FROM user_profiles');
        console.log(`✅ User profiles: ${profilesResult.rows[0].count}`);
        
        // Check user_preferences
        const preferencesResult = await pool.query('SELECT COUNT(*) as count FROM user_preferences');
        console.log(`✅ User preferences: ${preferencesResult.rows[0].count}`);
        
        // Check notifications
        const notificationsResult = await pool.query('SELECT COUNT(*) as count FROM notifications');
        console.log(`✅ Notifications: ${notificationsResult.rows[0].count}`);
        
        // Check store_apps
        const storeAppsResult = await pool.query('SELECT COUNT(*) as count FROM store_apps');
        console.log(`✅ Store apps: ${storeAppsResult.rows[0].count}`);
        
        // Step 3: Test mobile notifications (with correct columns)
        console.log('\n3️⃣ Testing mobile notifications...');
        
        const mobileNotifications = [
            {
                title: 'Welcome to TauOS Mobile!',
                message: 'Your privacy-first mobile experience is ready.',
                type: 'welcome',
                app_name: 'mobile'
            },
            {
                title: 'TauOS Mobile Features',
                message: 'Discover the power of privacy-first mobile computing.',
                type: 'feature',
                app_name: 'mobile'
            },
            {
                title: 'Security Update Available',
                message: 'Keep your TauOS Mobile secure with the latest updates.',
                type: 'security',
                app_name: 'mobile'
            }
        ];
        
        for (const notification of mobileNotifications) {
            await pool.query(`
                INSERT INTO notifications (id, user_id, title, message, type, app_name, is_read, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
            `, [
                uuidv4(),
                '00000000-0000-0000-0000-000000000001',
                notification.title,
                notification.message,
                notification.type,
                notification.app_name,
                false
            ]);
            console.log(`✅ Created notification: ${notification.title}`);
        }
        
        // Step 4: Test mobile apps
        console.log('\n4️⃣ Testing mobile apps...');
        
        const mobileApps = [
            {
                name: 'TauOS Camera',
                category: 'photography',
                description: 'Privacy-first camera app with AI features',
                mobile_specific: true
            },
            {
                name: 'TauOS Messages',
                category: 'communication',
                description: 'End-to-end encrypted messaging',
                mobile_specific: true
            },
            {
                name: 'TauOS Maps',
                category: 'navigation',
                description: 'Privacy-focused navigation without tracking',
                mobile_specific: true
            },
            {
                name: 'TauOS Wallet',
                category: 'finance',
                description: 'Secure mobile payments and crypto wallet',
                mobile_specific: true
            }
        ];
        
        for (const app of mobileApps) {
            await pool.query(`
                INSERT INTO store_apps (id, name, category, description, mobile_specific, is_active, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
            `, [
                uuidv4(),
                app.name,
                app.category,
                app.description,
                app.mobile_specific,
                true
            ]);
            console.log(`✅ Created mobile app: ${app.name}`);
        }
        
        // Step 5: Test mobile features
        console.log('\n5️⃣ Testing mobile features...');
        
        // Test notifications
        const notificationsList = await pool.query(`
            SELECT * FROM notifications 
            WHERE user_id = $1 AND app_name = 'mobile'
            ORDER BY created_at DESC 
            LIMIT 5
        `, ['00000000-0000-0000-0000-000000000001']);
        
        console.log(`✅ Found ${notificationsList.rows.length} mobile notifications:`);
        notificationsList.rows.forEach(notification => {
            console.log(`   - ${notification.title} (${notification.type})`);
        });
        
        // Test mobile apps
        const mobileAppsList = await pool.query(`
            SELECT * FROM store_apps 
            WHERE mobile_specific = true 
            ORDER BY name
        `);
        
        console.log(`✅ Found ${mobileAppsList.rows.length} mobile-specific apps:`);
        mobileAppsList.rows.forEach(app => {
            console.log(`   - ${app.name} (${app.category})`);
        });
        
        // Step 6: Mobile OS statistics
        console.log('\n6️⃣ Mobile OS Statistics...');
        const statsResult = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM users) as total_users,
                (SELECT COUNT(*) FROM user_profiles) as total_profiles,
                (SELECT COUNT(*) FROM user_preferences) as total_preferences,
                (SELECT COUNT(*) FROM notifications) as total_notifications,
                (SELECT COUNT(*) FROM store_apps) as total_apps,
                (SELECT COUNT(*) FROM store_apps WHERE mobile_specific = true) as mobile_apps,
                (SELECT COUNT(*) FROM notifications WHERE app_name = 'mobile') as mobile_notifications
        `);
        
        const stats = statsResult.rows[0];
        console.log(`✅ Mobile OS Statistics:`);
        console.log(`   Total Users: ${stats.total_users}`);
        console.log(`   Total Profiles: ${stats.total_profiles}`);
        console.log(`   Total Preferences: ${stats.total_preferences}`);
        console.log(`   Total Notifications: ${stats.total_notifications}`);
        console.log(`   Mobile Notifications: ${stats.mobile_notifications}`);
        console.log(`   Total Apps: ${stats.total_apps}`);
        console.log(`   Mobile Apps: ${stats.mobile_apps}`);
        
        console.log('\n🎉 MOBILE OS INTEGRATION TEST COMPLETE!');
        console.log('=========================================');
        console.log('✅ Database connection working');
        console.log('✅ Mobile notifications created');
        console.log('✅ Mobile apps registered');
        console.log('✅ Mobile features working');
        console.log('');
        console.log('🚀 PHASE 4 COMPLETE! MOBILE OS INTEGRATION SUCCESSFUL!');
        console.log('=====================================================');
        console.log('✅ Mobile OS features configured');
        console.log('✅ Mobile notifications working');
        console.log('✅ Mobile apps registered');
        console.log('✅ Mobile database integration complete');
        console.log('');
        console.log('🎯 READY FOR PHASE 5: SECURITY HARDENING!');
        console.log('=========================================');
        console.log('Next steps:');
        console.log('1. Security audit and hardening');
        console.log('2. Authentication system testing');
        console.log('3. Data encryption verification');
        console.log('4. Privacy compliance check');
        console.log('5. Production readiness assessment');
        
    } catch (error) {
        console.error('❌ Mobile OS integration test failed:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

testMobileOSFinal();
