#!/usr/bin/env node

/**
 * TauCore™ Actual Schema Checker
 * Checks what columns actually exist in the users table
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

async function checkActualSchema() {
    try {
        console.log('🔍 Checking Actual Users Table Schema');
        console.log('======================================');
        
        // Get all columns from users table
        const columnsResult = await pool.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            ORDER BY ordinal_position
        `);
        
        console.log('\n📋 Available Columns in Users Table:');
        columnsResult.rows.forEach((col, index) => {
            console.log(`${index + 1}. ${col.column_name} (${col.data_type}) - ${col.is_nullable === 'YES' ? 'nullable' : 'not null'}`);
        });
        
        // Check for specific columns we need
        const columnNames = columnsResult.rows.map(col => col.column_name);
        
        console.log('\n🔍 Required Columns Check:');
        console.log(`✅ Has 'id': ${columnNames.includes('id')}`);
        console.log(`✅ Has 'email': ${columnNames.includes('email')}`);
        console.log(`✅ Has 'full_name': ${columnNames.includes('full_name')}`);
        console.log(`✅ Has 'password_hash': ${columnNames.includes('password_hash')}`);
        console.log(`✅ Has 'is_email_verified': ${columnNames.includes('is_email_verified')}`);
        console.log(`❌ Has 'role': ${columnNames.includes('role')}`);
        console.log(`✅ Has 'is_active': ${columnNames.includes('is_active')}`);
        console.log(`✅ Has 'created_at': ${columnNames.includes('created_at')}`);
        console.log(`✅ Has 'updated_at': ${columnNames.includes('updated_at')}`);
        
        // Check if we have aud column (Supabase auth)
        console.log(`✅ Has 'aud': ${columnNames.includes('aud')}`);
        
        if (columnNames.includes('aud')) {
            console.log('\n📋 This appears to be a Supabase Auth users table');
            console.log('We need to use the Supabase auth schema format');
        }
        
    } catch (error) {
        console.error('❌ Schema check failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

checkActualSchema();
