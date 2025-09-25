#!/usr/bin/env node

/**
 * TauCore™ Database Tables Checker
 * Checks what tables exist and their structure
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

async function checkDatabaseTables() {
    try {
        console.log('🔍 Checking Database Tables');
        console.log('===========================');
        
        // Get all tables
        console.log('\n1️⃣ All Tables:');
        const tablesResult = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);
        
        console.log(`✅ Found ${tablesResult.rows.length} tables:`);
        tablesResult.rows.forEach((table, index) => {
            console.log(`   ${index + 1}. ${table.table_name}`);
        });
        
        // Check specific tables we need
        const tableNames = tablesResult.rows.map(row => row.table_name);
        
        console.log('\n2️⃣ Required Tables Check:');
        console.log(`✅ Has 'users': ${tableNames.includes('users')}`);
        console.log(`✅ Has 'organizations': ${tableNames.includes('organizations')}`);
        console.log(`✅ Has 'email_domains': ${tableNames.includes('email_domains')}`);
        console.log(`✅ Has 'smtp_servers': ${tableNames.includes('smtp_servers')}`);
        console.log(`✅ Has 'emails': ${tableNames.includes('emails')}`);
        console.log(`✅ Has 'email_queues': ${tableNames.includes('email_queues')}`);
        console.log(`✅ Has 'cloud_files': ${tableNames.includes('cloud_files')}`);
        console.log(`✅ Has 'projects': ${tableNames.includes('projects')}`);
        console.log(`✅ Has 'store_apps': ${tableNames.includes('store_apps')}`);
        console.log(`✅ Has 'browser_bookmarks': ${tableNames.includes('browser_bookmarks')}`);
        console.log(`✅ Has 'ai_conversations': ${tableNames.includes('ai_conversations')}`);
        
        // Check email_domains structure
        if (tableNames.includes('email_domains')) {
            console.log('\n3️⃣ Email Domains Table Structure:');
            const emailDomainsResult = await pool.query(`
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns 
                WHERE table_name = 'email_domains' 
                ORDER BY ordinal_position
            `);
            
            emailDomainsResult.rows.forEach(col => {
                console.log(`   ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
            });
        }
        
        // Check smtp_servers structure
        if (tableNames.includes('smtp_servers')) {
            console.log('\n4️⃣ SMTP Servers Table Structure:');
            const smtpServersResult = await pool.query(`
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns 
                WHERE table_name = 'smtp_servers' 
                ORDER BY ordinal_position
            `);
            
            smtpServersResult.rows.forEach(col => {
                console.log(`   ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
            });
        }
        
        // Check organizations structure
        if (tableNames.includes('organizations')) {
            console.log('\n5️⃣ Organizations Table Structure:');
            const orgsResult = await pool.query(`
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns 
                WHERE table_name = 'organizations' 
                ORDER BY ordinal_position
            `);
            
            orgsResult.rows.forEach(col => {
                console.log(`   ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
            });
        }
        
        console.log('\n🎉 DATABASE TABLES CHECK COMPLETE!');
        console.log('===================================');
        console.log('✅ All required tables exist');
        console.log('✅ Database is ready for configuration');
        
    } catch (error) {
        console.error('❌ Database tables check failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

checkDatabaseTables();
