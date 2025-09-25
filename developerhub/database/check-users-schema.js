#!/usr/bin/env node

/**
 * TauCore™ Users Schema Checker
 * Checks the current users table schema
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

async function checkUsersSchema() {
    try {
        console.log('🔍 Checking Users Table Schema');
        console.log('==============================');
        
        // Check users table columns
        const columnsResult = await pool.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            ORDER BY ordinal_position
        `);
        
        console.log('\n📋 Current Users Table Schema:');
        console.log('Column Name | Data Type | Nullable | Default');
        console.log('------------|-----------|----------|--------');
        columnsResult.rows.forEach(col => {
            console.log(`${col.column_name.padEnd(11)} | ${col.data_type.padEnd(9)} | ${col.is_nullable.padEnd(8)} | ${col.column_default || 'none'}`);
        });
        
        // Check if we have the new schema
        const hasRole = columnsResult.rows.some(col => col.column_name === 'role');
        const hasIsEmailVerified = columnsResult.rows.some(col => col.column_name === 'is_email_verified');
        
        console.log('\n🔍 Schema Analysis:');
        console.log(`✅ Has 'role' column: ${hasRole}`);
        console.log(`✅ Has 'is_email_verified' column: ${hasIsEmailVerified}`);
        
        if (!hasRole || !hasIsEmailVerified) {
            console.log('\n⚠️  OLD SCHEMA DETECTED!');
            console.log('The database has the old schema. We need to run the new hybrid schema.');
            console.log('\n🔧 Next Steps:');
            console.log('1. Run the hybrid-schema-complete.sql file');
            console.log('2. Run the hybrid-seed-complete.sql file');
            console.log('3. Test the email flow');
        } else {
            console.log('\n✅ NEW SCHEMA DETECTED!');
            console.log('The database has the new hybrid schema. Ready for testing.');
        }
        
    } catch (error) {
        console.error('❌ Schema check failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

checkUsersSchema();
