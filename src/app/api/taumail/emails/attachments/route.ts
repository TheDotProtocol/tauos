import { verifyTauMailToken } from '@/app/api/taumail/middleware/security';
import { NextRequest, NextResponse } from 'next/server';
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
    const auth = await verifyTauMailToken(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const userId = auth.userId;

    const { filename, contentType, size } = await request.json();
    const validationError = validatePrepareUpload(String(filename || ''), Number(size));
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const attachmentId = randomUUID();
    const upload = await prepareMailAttachmentUpload(
      userId,
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
