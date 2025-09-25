#!/usr/bin/env node

/**
 * TauCore™ Mobile OS Simple Test
 * Tests mobile OS integration without complex database operations
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

async function testMobileOSSimple() {
    try {
        console.log('📱 Testing Mobile OS Integration (Simple Test)');
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
        
        // Step 3: Test mobile notifications (simple insert)
        console.log('\n3️⃣ Testing mobile notifications...');
        
        const mobileNotifications = [
            {
                title: 'Welcome to TauOS Mobile!',
                message: 'Your privacy-first mobile experience is ready.',
                type: 'welcome',
                priority: 'high'
            },
            {
                title: 'TauOS Mobile Features',
                message: 'Discover the power of privacy-first mobile computing.',
                type: 'feature',
                priority: 'medium'
            },
            {
                title: 'Security Update Available',
                message: 'Keep your TauOS Mobile secure with the latest updates.',
                type: 'security',
                priority: 'high'
            }
        ];
        
        for (const notification of mobileNotifications) {
            await pool.query(`
                INSERT INTO notifications (id, user_id, title, message, type, priority, is_read, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
            `, [
                '00000000-0000-0000-0000-000000000001',
                '00000000-0000-0000-0000-000000000001',
                notification.title,
                notification.message,
                notification.type,
                notification.priority,
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
                '00000000-0000-0000-0000-000000000001',
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
            WHERE user_id = $1 
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
                (SELECT COUNT(*) FROM store_apps WHERE mobile_specific = true) as mobile_apps
        `);
        
        const stats = statsResult.rows[0];
        console.log(`✅ Mobile OS Statistics:`);
        console.log(`   Total Users: ${stats.total_users}`);
        console.log(`   Total Profiles: ${stats.total_profiles}`);
        console.log(`   Total Preferences: ${stats.total_preferences}`);
        console.log(`   Total Notifications: ${stats.total_notifications}`);
        console.log(`   Total Apps: ${stats.total_apps}`);
        console.log(`   Mobile Apps: ${stats.mobile_apps}`);
        
        console.log('\n🎉 MOBILE OS INTEGRATION TEST COMPLETE!');
        console.log('=========================================');
        console.log('✅ Database connection working');
        console.log('✅ Mobile notifications created');
        console.log('✅ Mobile apps registered');
        console.log('✅ Mobile features working');
        console.log('');
        console.log('🚀 READY FOR MOBILE OS TESTING!');
        console.log('===============================');
        console.log('Next steps:');
        console.log('1. Test mobile UI functionality');
        console.log('2. Test mobile app integration');
        console.log('3. Test mobile notifications');
        console.log('4. Test mobile preferences');
        console.log('5. Proceed to Phase 5: Security Hardening');
        
    } catch (error) {
        console.error('❌ Mobile OS integration test failed:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

testMobileOSSimple();
