#!/usr/bin/env node

/**
 * Check Organizations Table Schema
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function checkOrganizationsSchema() {
  console.log('🔍 Checking Organizations Table Schema...');
  console.log('=' .repeat(50));
  
  try {
    // Check organizations table structure
    console.log('1. Checking organizations table structure...');
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'organizations' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Organizations table columns:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Check data
    console.log('\n2. Checking data...');
    const dataResult = await pool.query('SELECT COUNT(*) as count FROM organizations');
    console.log(`🏢 Organizations: ${dataResult.rows[0].count}`);
    
    if (dataResult.rows[0].count > 0) {
      const orgData = await pool.query('SELECT * FROM organizations LIMIT 1');
      console.log('📊 Sample organization data:');
      console.log(JSON.stringify(orgData.rows[0], null, 2));
    }
    
    return result.rows;
    
  } catch (error) {
    console.error('❌ Schema check failed:', error.message);
    return null;
  } finally {
    await pool.end();
  }
}

// Run the check
if (require.main === module) {
  checkOrganizationsSchema()
    .then(result => {
      if (result) {
        console.log('\n🎯 Organizations Schema Analysis Complete!');
      }
    })
    .catch(error => {
      console.error('❌ Schema check failed:', error);
      process.exit(1);
    });
}

module.exports = { checkOrganizationsSchema };
