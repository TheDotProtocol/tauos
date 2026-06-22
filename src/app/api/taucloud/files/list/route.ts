import { getPool, getJwtSecret } from '@/lib/db-pool';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Database connection - production ready


export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Verify token
    const jwtSecret = getJwtSecret('taucloud');
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'root';

    // Get user's files
    const result = await getPool().query(
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
