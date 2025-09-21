import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

// Database connection - production ready
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Verify token
    const jwtSecret = process.env.JWT_SECRET_TAUCLOUD || 'tauos-prod-jwt-secret-2025-launch-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'root';

    // Get user's files
    const result = await pool.query(
      `SELECT id, original_name, file_name, file_size, mime_type, folder, uploaded_at, is_shared
       FROM taucloud_files 
       WHERE user_id = $1 AND folder = $2
       ORDER BY uploaded_at DESC`,
      [decoded.userId, folder]
    );

    return NextResponse.json({
      success: true,
      files: result.rows
    });

  } catch (error) {
    console.error('TauCloud List Files Error:', error);
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
  }
}
