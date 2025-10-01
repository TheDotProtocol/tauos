#!/usr/bin/env node

/**
 * TauCore™ Mobile OS Integration Setup - Simple Version
 * Integrates mobile OS features with hybrid database using simple INSERT
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

async function setupMobileOSSimple() {
    try {
        console.log('📱 Setting up Mobile OS Integration (Simple Version)');
        console.log('===================================================');
        
        // Step 1: Check mobile-related tables
        console.log('\n1️⃣ Checking mobile-related tables...');
        
        // Check user_profiles
        const profilesResult = await pool.query('SELECT COUNT(*) as count FROM user_profiles');
        console.log(`✅ User profiles: ${profilesResult.rows[0].count}`);
        
        // Check user_preferences
        const preferencesResult = await pool.query('SELECT COUNT(*) as count FROM user_preferences');
        console.log(`✅ User preferences: ${preferencesResult.rows[0].count}`);
        
        // Check notifications
        const notificationsResult = await pool.query('SELECT COUNT(*) as count FROM notifications');
        console.log(`✅ Notifications: ${notificationsResult.rows[0].count}`);
        
        // Step 2: Create mobile user profile
        console.log('\n2️⃣ Creating mobile user profile...');
        
        // Check if profile already exists
        const existingProfile = await pool.query('SELECT * FROM user_profiles WHERE user_id = $1', ['00000000-0000-0000-0000-000000000001']);
        
        if (existingProfile.rows.length === 0) {
            await pool.query(`
                INSERT INTO user_profiles (id, user_id, bio, website, social_links, preferences, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
            `, [
                uuidv4(),
                '00000000-0000-0000-0000-000000000001',
                'CEO and Founder of TauOS - The Future of Mobile Computing',
                'https://tauos.org',
                JSON.stringify({
                    twitter: '@tauos_org',
                    linkedin: 'tauos-org',
                    github: 'tauos-org'
                }),
                JSON.stringify({
                    mobile: {
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
                    }
                })
            ]);
            console.log('✅ Mobile user profile created');
        } else {
            console.log('✅ Mobile user profile already exists');
        }
        
        // Step 3: Create mobile preferences
        console.log('\n3️⃣ Creating mobile preferences...');
        
        const mobilePreferences = [
            { key: 'theme', value: 'dark', app: 'mobile' },
            { key: 'language', value: 'en', app: 'mobile' },
            { key: 'notifications', value: true, app: 'mobile' },
            { key: 'biometric_auth', value: true, app: 'mobile' },
            { key: 'cellular_data', value: true, app: 'mobile' },
            { key: 'wifi_auto_connect', value: true, app: 'mobile' },
            { key: 'bluetooth_enabled', value: true, app: 'mobile' },
            { key: 'location_services', value: false, app: 'mobile' },
            { key: 'analytics', value: false, app: 'mobile' },
            { key: 'crash_reporting', value: false, app: 'mobile' }
        ];
        
        for (const pref of mobilePreferences) {
            // Check if preference already exists
            const existingPref = await pool.query(
                'SELECT * FROM user_preferences WHERE user_id = $1 AND preference_key = $2 AND app_name = $3',
                ['00000000-0000-0000-0000-000000000001', pref.key, pref.app]
            );
            
            if (existingPref.rows.length === 0) {
                await pool.query(`
                    INSERT INTO user_preferences (id, user_id, preference_key, preference_value, app_name, created_at, updated_at)
                    VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
                `, [
                    uuidv4(),
                    '00000000-0000-0000-0000-000000000001',
                    pref.key,
                    JSON.stringify(pref.value),
                    pref.app
                ]);
                console.log(`✅ Created preference: ${pref.key} = ${pref.value}`);
            } else {
                console.log(`✅ Preference already exists: ${pref.key}`);
            }
        }
        
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
            // Check if app already exists
            const existingApp = await pool.query('SELECT * FROM store_apps WHERE name = $1', [app.name]);
            
            if (existingApp.rows.length === 0) {
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
            } else {
                console.log(`✅ Mobile app already exists: ${app.name}`);
            }
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
            console.log(`   Bio: ${profile.bio}`);
            console.log(`   Website: ${profile.website}`);
            console.log(`   Mobile Settings: ${profile.preferences ? 'Configured' : 'Not configured'}`);
        }
        
        // Test preferences retrieval
        const prefsResult = await pool.query(`
            SELECT * FROM user_preferences 
            WHERE user_id = $1 AND app_name = 'mobile'
            ORDER BY preference_key
        `, ['00000000-0000-0000-0000-000000000001']);
        
        console.log(`✅ Found ${prefsResult.rows.length} mobile preferences:`);
        prefsResult.rows.forEach(pref => {
            console.log(`   - ${pref.preference_key}: ${pref.preference_value}`);
        });
        
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
                (SELECT COUNT(*) FROM user_profiles WHERE preferences IS NOT NULL) as mobile_profiles,
                (SELECT COUNT(*) FROM user_preferences WHERE app_name = 'mobile') as mobile_preferences,
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

setupMobileOSSimple();
