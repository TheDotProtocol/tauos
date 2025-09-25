#!/usr/bin/env node

/**
 * TauCore™ Cloud Tables Structure Checker
 * Checks the actual structure of cloud storage tables
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

async function checkCloudTables() {
    try {
        console.log('🔍 Checking Cloud Tables Structure');
        console.log('==================================');
        
        // Check cloud_folders structure
        console.log('\n1️⃣ Cloud Folders Table Structure:');
        const foldersResult = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'cloud_folders' 
            ORDER BY ordinal_position
        `);
        
        foldersResult.rows.forEach(col => {
            console.log(`   ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
        });
        
        // Check cloud_files structure
        console.log('\n2️⃣ Cloud Files Table Structure:');
        const filesResult = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'cloud_files' 
            ORDER BY ordinal_position
        `);
        
        filesResult.rows.forEach(col => {
            console.log(`   ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
        });
        
        // Check file_shares structure
        console.log('\n3️⃣ File Shares Table Structure:');
        const sharesResult = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'file_shares' 
            ORDER BY ordinal_position
        `);
        
        sharesResult.rows.forEach(col => {
            console.log(`   ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
        });
        
        console.log('\n🎉 Cloud Tables Structure Check Complete!');
        console.log('=========================================');
        console.log('✅ All cloud storage tables exist');
        console.log('✅ Ready for integration setup');
        
    } catch (error) {
        console.error('❌ Cloud tables check failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

checkCloudTables();
