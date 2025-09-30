#!/usr/bin/env node

/**
 * Check Incoming Emails Table Schema
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function checkIncomingEmailsSchema() {
  console.log('🔍 Checking Incoming Emails Table Schema...');
  console.log('=' .repeat(50));
  
  try {
    // Check incoming_emails table structure
    console.log('1. Checking incoming_emails table structure...');
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'incoming_emails' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Incoming emails table columns:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Check if specific columns exist
    const hasFromName = result.rows.some(row => row.column_name === 'from_name');
    const hasFromEmail = result.rows.some(row => row.column_name === 'from_email');
    const hasIsSpam = result.rows.some(row => row.column_name === 'is_spam');
    const hasIsImportant = result.rows.some(row => row.column_name === 'is_important');
    const hasIsDeleted = result.rows.some(row => row.column_name === 'is_deleted');
    
    console.log(`\n🔍 Column analysis:`);
    console.log(`  - from_name: ${hasFromName ? 'EXISTS' : 'MISSING'}`);
    console.log(`  - from_email: ${hasFromEmail ? 'EXISTS' : 'MISSING'}`);
    console.log(`  - is_spam: ${hasIsSpam ? 'EXISTS' : 'MISSING'}`);
    console.log(`  - is_important: ${hasIsImportant ? 'EXISTS' : 'MISSING'}`);
    console.log(`  - is_deleted: ${hasIsDeleted ? 'EXISTS' : 'MISSING'}`);
    
    // Check data
    console.log('\n2. Checking data...');
    const dataResult = await pool.query('SELECT COUNT(*) as count FROM incoming_emails');
    console.log(`📨 Incoming emails: ${dataResult.rows[0].count}`);
    
    return { 
      hasFromName, 
      hasFromEmail, 
      hasIsSpam, 
      hasIsImportant, 
      hasIsDeleted,
      count: dataResult.rows[0].count
    };
    
  } catch (error) {
    console.error('❌ Schema check failed:', error.message);
    return null;
  } finally {
    await pool.end();
  }
}

// Run the check
if (require.main === module) {
  checkIncomingEmailsSchema()
    .then(result => {
      if (result) {
        console.log('\n🎯 Schema Analysis Complete!');
        if (!result.hasFromName) {
          console.log('🔧 Need to add missing columns to incoming_emails table');
        }
      }
    })
    .catch(error => {
      console.error('❌ Schema check failed:', error);
      process.exit(1);
    });
}

module.exports = { checkIncomingEmailsSchema };
