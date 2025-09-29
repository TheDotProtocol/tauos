#!/usr/bin/env node

/**
 * Check Database Schema
 * 
 * This script checks what columns actually exist in the users table
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function checkDatabaseSchema() {
  console.log('🔍 Checking Database Schema...');
  console.log('=' .repeat(50));
  
  try {
    // Check users table structure
    console.log('1. Checking users table structure...');
    const usersResult = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Users table columns:');
    usersResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Check if last_login column exists
    const hasLastLogin = usersResult.rows.some(row => row.column_name === 'last_login');
    console.log(`\n🔍 last_login column exists: ${hasLastLogin ? 'YES' : 'NO'}`);
    
    // Check organizations table
    console.log('\n2. Checking organizations table...');
    const orgsResult = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'organizations' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Organizations table columns:');
    orgsResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Check if we have any data
    console.log('\n3. Checking data...');
    const userCount = await pool.query('SELECT COUNT(*) as count FROM users');
    const orgCount = await pool.query('SELECT COUNT(*) as count FROM organizations');
    
    console.log(`👥 Users: ${userCount.rows[0].count}`);
    console.log(`🏢 Organizations: ${orgCount.rows[0].count}`);
    
    if (orgCount.rows[0].count === '0') {
      console.log('\n⚠️ No organizations found. Creating default organization...');
      await pool.query(`
        INSERT INTO organizations (name, domain, storage_limit, user_limit) 
        VALUES ('TauOS', 'tauos.org', 5368709120, 1000)
        ON CONFLICT (domain) DO NOTHING
      `);
      console.log('✅ Default organization created');
    }
    
    return { hasLastLogin, userCount: userCount.rows[0].count, orgCount: orgCount.rows[0].count };
    
  } catch (error) {
    console.error('❌ Schema check failed:', error.message);
    return null;
  } finally {
    await pool.end();
  }
}

// Run the check
if (require.main === module) {
  checkDatabaseSchema()
    .then(result => {
      if (result) {
        console.log('\n🎯 Schema Analysis Complete!');
        if (!result.hasLastLogin) {
          console.log('🔧 Need to add last_login column to users table');
        }
      }
    })
    .catch(error => {
      console.error('❌ Schema check failed:', error);
      process.exit(1);
    });
}

module.exports = { checkDatabaseSchema };
