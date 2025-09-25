import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Database connection - production ready
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

export async function POST(request: NextRequest) {
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
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'root';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check user's storage quota
    const quotaResult = await pool.query(
      'SELECT storage_quota, storage_used FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (quotaResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = quotaResult.rows[0];
    const fileSize = file.size;
    const newStorageUsed = (user.storage_used || 0) + fileSize;

    if (newStorageUsed > (user.storage_quota || 1073741824)) { // 1GB default
      return NextResponse.json({ error: 'Storage quota exceeded' }, { status: 413 });
    }

    // Generate unique filename
    const fileId = uuidv4();
    const fileExtension = file.name.split('.').pop() || '';
    const fileName = `${fileId}.${fileExtension}`;
    const filePath = join(process.cwd(), 'uploads', 'taucloud', decoded.userId.toString(), folder, fileName);

    // Create directory if it doesn't exist
    await mkdir(join(process.cwd(), 'uploads', 'taucloud', decoded.userId.toString(), folder), { recursive: true });

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Save file metadata to database
    const result = await pool.query(
      `INSERT INTO taucloud_files (id, user_id, original_name, file_name, file_path, file_size, mime_type, folder, uploaded_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
       RETURNING id, original_name, file_size, uploaded_at`,
      [fileId, decoded.userId, file.name, fileName, filePath, fileSize, file.type, folder]
    );

    // Update user's storage usage
    await pool.query(
      'UPDATE users SET storage_used = $1 WHERE id = $2',
      [newStorageUsed, decoded.userId]
    );

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      file: result.rows[0]
    });

  } catch (error) {
    console.error('TauCloud Upload Error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
