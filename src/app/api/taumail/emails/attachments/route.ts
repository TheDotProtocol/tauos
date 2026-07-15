import { getJwtSecret } from '@/lib/db-pool';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import {
  TAUMAIL_MAX_ATTACHMENT_BYTES,
  TAUMAIL_MAX_FILES,
  formatAttachmentSize,
  sanitizeFilename,
} from '@/lib/taumail-attachments';
import { prepareMailAttachmentUpload } from '@/lib/taumail-attachment-storage';

function validatePrepareUpload(filename: string, size: number) {
  if (!filename?.trim()) return 'filename is required';
  if (typeof size !== 'number' || size <= 0) return 'size must be a positive number';
  if (size > TAUMAIL_MAX_ATTACHMENT_BYTES) {
    return `"${filename}" exceeds the ${formatAttachmentSize(TAUMAIL_MAX_ATTACHMENT_BYTES)} limit`;
  }
  return null;
}

/** Prepare a direct-to-Supabase upload URL (bypasses Vercel 4.5MB body limit). */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const jwtSecret = getJwtSecret('taumail');
    const decoded = jwt.verify(token, jwtSecret) as { userId: number | string };

    const { filename, contentType, size } = await request.json();
    const validationError = validatePrepareUpload(String(filename || ''), Number(size));
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const attachmentId = randomUUID();
    const upload = await prepareMailAttachmentUpload(
      decoded.userId,
      attachmentId,
      sanitizeFilename(String(filename))
    );

    return NextResponse.json({
      success: true,
      attachmentId,
      path: upload.path,
      uploadUrl: upload.signedUrl,
      token: upload.token,
      maxBytes: TAUMAIL_MAX_ATTACHMENT_BYTES,
      maxFiles: TAUMAIL_MAX_FILES,
    });
  } catch (error) {
    console.error('TauMail attachment prepare error:', error);
    return NextResponse.json(
      {
        error: 'Failed to prepare attachment upload',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
