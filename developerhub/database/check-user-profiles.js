#!/usr/bin/env node

/**
 * TauCore™ User Profiles Structure Checker
 * Checks the actual structure of user_profiles table
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

async function checkUserProfiles() {
    try {
        console.log('🔍 Checking User Profiles Table Structure');
        console.log('=========================================');
        
        // Check user_profiles structure
        console.log('\n1️⃣ User Profiles Table Structure:');
        const profilesResult = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'user_profiles' 
            ORDER BY ordinal_position
        `);
        
        profilesResult.rows.forEach(col => {
            console.log(`   ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
        });
        
        // Check user_preferences structure
        console.log('\n2️⃣ User Preferences Table Structure:');
        const preferencesResult = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'user_preferences' 
            ORDER BY ordinal_position
        `);
        
        preferencesResult.rows.forEach(col => {
            console.log(`   ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
        });
        
        console.log('\n🎉 User Profiles Structure Check Complete!');
        console.log('===========================================');
        console.log('✅ User profiles table structure known');
        console.log('✅ User preferences table structure known');
        console.log('✅ Ready for mobile OS integration');
        
    } catch (error) {
        console.error('❌ User profiles check failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

checkUserProfiles();
