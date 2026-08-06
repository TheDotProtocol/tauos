import { verifyTauMailToken } from '@/app/api/taumail/middleware/security';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { uploadObject, getSupabaseStorageConfig } from '@/lib/supabase-storage';
import {
  TAUMAIL_INLINE_ATTACHMENT_BYTES,
  sanitizeFilename,
} from '@/lib/taumail-attachments';
import { buildMailAttachmentPath } from '@/lib/taumail-attachment-storage';

/** Server-side attachment upload (fallback when signed URL fails; max ~4 MB on Vercel). */
export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyTauMailToken(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const userId = auth.userId;

    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'file is required' }, { status: 400 });
    }

    if (file.size > TAUMAIL_INLINE_ATTACHMENT_BYTES) {
      return NextResponse.json(
        {
          error: `File too large for direct upload (${file.size} bytes). Use storage upload for files over ${TAUMAIL_INLINE_ATTACHMENT_BYTES} bytes.`,
        },
        { status: 400 }
      );
    }

    const cfg = getSupabaseStorageConfig();
    if (!cfg) {
      return NextResponse.json({ error: 'File storage is not configured' }, { status: 500 });
    }

    const attachmentId = randomUUID();
    const safeName = sanitizeFilename(file.name);
    const path = buildMailAttachmentPath(userId, attachmentId, safeName);
    const bytes = await file.arrayBuffer();

    await uploadObject(cfg, path, bytes, file.type || 'application/octet-stream');

    return NextResponse.json({
      success: true,
      attachmentId,
      path,
      filename: safeName,
      contentType: file.type || 'application/octet-stream',
      size: file.size,
    });
  } catch (error) {
    console.error('TauMail attachment upload error:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload attachment',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
