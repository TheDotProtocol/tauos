#!/usr/bin/env node

/**
 * TauCore™ Exact Columns Checker
 * Checks the exact columns that exist in the users table
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

async function checkExactColumns() {
    try {
        console.log('🔍 Checking Exact Columns in Users Table');
        console.log('=========================================');
        
        // Get exact column names
        const columnsResult = await pool.query(`
            SELECT column_name
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            ORDER BY ordinal_position
        `);
        
        console.log('\n📋 Exact Column Names:');
        columnsResult.rows.forEach((col, index) => {
            console.log(`${index + 1}. ${col.column_name}`);
        });
        
        // Check for role column specifically
        const hasRole = columnsResult.rows.some(col => col.column_name === 'role');
        console.log(`\n🔍 Role column exists: ${hasRole}`);
        
        // Try to describe the table structure
        console.log('\n📋 Table Structure:');
        const structureResult = await pool.query(`
            SELECT 
                column_name,
                data_type,
                is_nullable,
                column_default
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            AND column_name IN ('id', 'email', 'full_name', 'password_hash', 'role', 'is_email_verified', 'is_active', 'created_at', 'updated_at')
            ORDER BY ordinal_position
        `);
        
        console.log('Key columns:');
        structureResult.rows.forEach(col => {
            console.log(`   ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
        });
        
    } catch (error) {
        console.error('❌ Column check failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

checkExactColumns();
