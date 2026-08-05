import { getPool } from '@/app/api/taumail/middleware/security';
import { withTauMailAuth } from '@/lib/taumail/api-route';
import { parseStoredIncomingAttachments } from '@/lib/taumail-inbound';
import { sanitizeFilename } from '@/lib/taumail-attachments';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { emailId: string } },
) {
  return withTauMailAuth(request, async (userId) => {
    const index = Number(request.nextUrl.searchParams.get('index') ?? '0');
    if (!Number.isInteger(index) || index < 0) {
      return NextResponse.json({ error: 'Invalid attachment index' }, { status: 400 });
    }

    const result = await getPool().query(
      `SELECT attachments FROM incoming_emails
       WHERE id = $1 AND user_id::text = $2::text
         AND COALESCE(is_deleted, false) = false
       LIMIT 1`,
      [params.emailId, userId],
    );

    if (!result.rows.length) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    const attachments = parseStoredIncomingAttachments(result.rows[0].attachments, {
      requireContent: true,
    });
    const attachment = attachments[index];
    if (!attachment?.content) {
      return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });
    }

    const filename = sanitizeFilename(attachment.filename);
    const bytes = Buffer.from(attachment.content.replace(/\s/g, ''), 'base64');
    const disposition = request.nextUrl.searchParams.get('inline') === '1' ? 'inline' : 'attachment';

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        'Content-Type': attachment.contentType || 'application/octet-stream',
        'Content-Disposition': `${disposition}; filename="${filename}"`,
        'Content-Length': String(bytes.length),
        'Cache-Control': 'private, max-age=3600',
      },
    });
  });
}
