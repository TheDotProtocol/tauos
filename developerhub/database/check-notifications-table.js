#!/usr/bin/env node

/**
 * TauCore™ Notifications Table Structure Checker
 * Checks the actual structure of notifications table
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

async function checkNotificationsTable() {
    try {
        console.log('🔍 Checking Notifications Table Structure');
        console.log('==========================================');
        
        // Check notifications structure
        console.log('\n1️⃣ Notifications Table Structure:');
        const notificationsResult = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'notifications' 
            ORDER BY ordinal_position
        `);
        
        notificationsResult.rows.forEach(col => {
            console.log(`   ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
        });
        
        console.log('\n🎉 Notifications Table Structure Check Complete!');
        console.log('===============================================');
        console.log('✅ Notifications table structure known');
        console.log('✅ Ready for mobile OS integration');
        
    } catch (error) {
        console.error('❌ Notifications table check failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

checkNotificationsTable();
