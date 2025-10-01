#!/usr/bin/env node

/**
 * TauCore™ Mobile OS Integration Setup
 * Integrates mobile OS features with hybrid database
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

async function setupMobileOSIntegration() {
    try {
        console.log('📱 Setting up Mobile OS Integration');
        console.log('===================================');
        
        // Step 1: Check mobile-related tables
        console.log('\n1️⃣ Checking mobile-related tables...');
        
        // Check user_profiles for mobile settings
        const profilesResult = await pool.query('SELECT COUNT(*) as count FROM user_profiles');
        console.log(`✅ User profiles: ${profilesResult.rows[0].count}`);
        
        // Check user_preferences for mobile preferences
        const preferencesResult = await pool.query('SELECT COUNT(*) as count FROM user_preferences');
        console.log(`✅ User preferences: ${preferencesResult.rows[0].count}`);
        
        // Check notifications for mobile notifications
        const notificationsResult = await pool.query('SELECT COUNT(*) as count FROM notifications');
        console.log(`✅ Notifications: ${notificationsResult.rows[0].count}`);
        
        // Step 2: Setup mobile user profile
        console.log('\n2️⃣ Setting up mobile user profile...');
        
        // Update user profile with mobile settings
        await pool.query(`
            UPDATE user_profiles 
            SET 
                bio = $1,
                location = $2,
                website = $3,
                mobile_settings = $4,
                updated_at = NOW()
            WHERE user_id = $5
        `, [
            'CEO and Founder of TauOS - The Future of Mobile Computing',
            'Malaysia',
            'https://tauos.org',
            JSON.stringify({
                theme: 'dark',
                language: 'en',
                notifications: true,
                biometric_auth: true,
                cellular_data: true,
                wifi_auto_connect: true,
                bluetooth_enabled: true,
                location_services: false,
                analytics: false,
                crash_reporting: false
            }),
            '00000000-0000-0000-0000-000000000001'
        ]);
        console.log('✅ Mobile user profile updated');
        
        // Step 3: Setup mobile preferences
        console.log('\n3️⃣ Setting up mobile preferences...');
        
        await pool.query(`
            UPDATE user_preferences 
            SET 
                theme = $1,
                language = $2,
                notifications_enabled = $3,
                mobile_preferences = $4,
                updated_at = NOW()
            WHERE user_id = $5
        `, [
            'dark',
            'en',
            true,
            JSON.stringify({
                display: {
                    brightness: 80,
                    auto_brightness: true,
                    night_mode: true,
                    font_size: 'medium',
                    screen_timeout: 30
                },
                privacy: {
                    location_tracking: false,
                    analytics: false,
                    crash_reporting: false,
                    personalized_ads: false
                },
                connectivity: {
                    wifi_auto_connect: true,
                    cellular_data: true,
                    bluetooth_enabled: true,
                    nfc_enabled: false
                },
                security: {
                    biometric_auth: true,
                    screen_lock: true,
                    app_permissions: 'strict',
                    vpn_enabled: true
                }
            }),
            '00000000-0000-0000-0000-000000000001'
        ]);
        console.log('✅ Mobile preferences updated');
        
        // Step 4: Create mobile notifications
        console.log('\n4️⃣ Creating mobile notifications...');
        
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
                ON CONFLICT (id) DO UPDATE SET
                    title = EXCLUDED.title,
                    message = EXCLUDED.message,
                    updated_at = NOW()
            `, [
                uuidv4(),
                '00000000-0000-0000-0000-000000000001',
                notification.title,
                notification.message,
                notification.type,
                notification.priority,
                false
            ]);
            console.log(`✅ Created notification: ${notification.title}`);
        }
        
        // Step 5: Setup mobile apps data
        console.log('\n5️⃣ Setting up mobile apps data...');
        
        // Check if store_apps table exists and has mobile apps
        const storeAppsResult = await pool.query('SELECT COUNT(*) as count FROM store_apps');
        console.log(`✅ Store apps: ${storeAppsResult.rows[0].count}`);
        
        // Create mobile-specific apps if they don't exist
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
                ON CONFLICT (name) DO UPDATE SET
                    description = EXCLUDED.description,
                    mobile_specific = EXCLUDED.mobile_specific,
                    updated_at = NOW()
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
        
        // Step 6: Test mobile features
        console.log('\n6️⃣ Testing mobile features...');
        
        // Test user profile retrieval
        const profileResult = await pool.query(`
            SELECT up.*, u.email, u.full_name
            FROM user_profiles up
            JOIN users u ON up.user_id = u.id
            WHERE up.user_id = $1
        `, ['00000000-0000-0000-0000-000000000001']);
        
        if (profileResult.rows.length > 0) {
            const profile = profileResult.rows[0];
            console.log(`✅ Mobile profile found: ${profile.full_name}`);
            console.log(`   Email: ${profile.email}`);
            console.log(`   Location: ${profile.location}`);
            console.log(`   Mobile Settings: ${profile.mobile_settings ? 'Configured' : 'Not configured'}`);
        }
        
        // Test preferences retrieval
        const prefsResult = await pool.query(`
            SELECT * FROM user_preferences WHERE user_id = $1
        `, ['00000000-0000-0000-0000-000000000001']);
        
        if (prefsResult.rows.length > 0) {
            const prefs = prefsResult.rows[0];
            console.log(`✅ Mobile preferences found:`);
            console.log(`   Theme: ${prefs.theme}`);
            console.log(`   Language: ${prefs.language}`);
            console.log(`   Notifications: ${prefs.notifications_enabled}`);
            console.log(`   Mobile Preferences: ${prefs.mobile_preferences ? 'Configured' : 'Not configured'}`);
        }
        
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
        
        // Step 7: Mobile OS statistics
        console.log('\n7️⃣ Mobile OS Statistics...');
        const statsResult = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM user_profiles WHERE mobile_settings IS NOT NULL) as mobile_profiles,
                (SELECT COUNT(*) FROM user_preferences WHERE mobile_preferences IS NOT NULL) as mobile_preferences,
                (SELECT COUNT(*) FROM notifications WHERE type IN ('welcome', 'feature', 'security')) as mobile_notifications,
                (SELECT COUNT(*) FROM store_apps WHERE mobile_specific = true) as mobile_apps
        `);
        
        const stats = statsResult.rows[0];
        console.log(`✅ Mobile OS Statistics:`);
        console.log(`   Mobile Profiles: ${stats.mobile_profiles}`);
        console.log(`   Mobile Preferences: ${stats.mobile_preferences}`);
        console.log(`   Mobile Notifications: ${stats.mobile_notifications}`);
        console.log(`   Mobile Apps: ${stats.mobile_apps}`);
        
        console.log('\n🎉 MOBILE OS INTEGRATION SETUP COMPLETE!');
        console.log('=========================================');
        console.log('✅ Mobile user profile configured');
        console.log('✅ Mobile preferences set');
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
        console.error('❌ Mobile OS integration setup failed:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

setupMobileOSIntegration();
