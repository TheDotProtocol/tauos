import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// CHECK SALEENA USER API - FIND THE CORRECT USER ID
const pool = new Pool({
  connectionString: 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 CHECKING SALEENA USER...');
    
    // Check if saleena@tauos.org exists
    const saleenaUser = await pool.query(`
      SELECT id, email, username, full_name
      FROM users 
      WHERE email = 'saleena@tauos.org'
    `);
    
    console.log('🔍 Saleena user found:', saleenaUser.rows.length);
    
    // Check if there's a user with the ID we're using
    const userIdCheck = await pool.query(`
      SELECT id, email, username, full_name
      FROM users 
      WHERE id = '00000000-0000-0000-0000-000000000001'
    `);
    
    console.log('🔍 User with ID 00000000-0000-0000-0000-000000000001:', userIdCheck.rows.length);
    
    // Check all users with saleena in email
    const allSaleenaUsers = await pool.query(`
      SELECT id, email, username, full_name
      FROM users 
      WHERE email LIKE '%saleena%'
    `);
    
    console.log('🔍 All users with saleena in email:', allSaleenaUsers.rows.length);
    
    return NextResponse.json({
      success: true,
      saleenaUser: saleenaUser.rows,
      userIdCheck: userIdCheck.rows,
      allSaleenaUsers: allSaleenaUsers.rows,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ CHECK SALEENA USER ERROR:', error);
    return NextResponse.json({ 
      error: 'Check saleena user failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
