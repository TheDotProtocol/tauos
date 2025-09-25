#!/usr/bin/env node

/**
 * TauCore™ Store Apps Table Structure Checker
 * Checks the actual structure of store_apps table
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

async function checkStoreAppsTable() {
    try {
        console.log('🔍 Checking Store Apps Table Structure');
        console.log('======================================');
        
        // Check store_apps structure
        console.log('\n1️⃣ Store Apps Table Structure:');
        const storeAppsResult = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'store_apps' 
            ORDER BY ordinal_position
        `);
        
        storeAppsResult.rows.forEach(col => {
            console.log(`   ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
        });
        
        console.log('\n🎉 Store Apps Table Structure Check Complete!');
        console.log('=============================================');
        console.log('✅ Store apps table structure known');
        console.log('✅ Ready for mobile OS integration');
        
    } catch (error) {
        console.error('❌ Store apps table check failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

checkStoreAppsTable();
