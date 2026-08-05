import { getPool } from '@/app/api/taumail/middleware/security';
import { withTauMailAuth } from '@/lib/taumail/api-route';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GB = 1024 * 1024 * 1024;

function bytesToGb(bytes: number): number {
  return Math.round((bytes / GB) * 10) / 10;
}

export async function GET(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const pool = getPool();

    const userResult = await pool.query(
      'SELECT storage_used_bytes, storage_quota_bytes FROM users WHERE id = $1',
      [userId],
    );
    const quotaBytes = Number(userResult.rows[0]?.storage_quota_bytes || 268435456000);
    const totalGb = Math.round(quotaBytes / GB);

    const mailResult = await pool.query(
      `SELECT COALESCE(SUM(LENGTH(body)), 0)::bigint AS body_bytes,
              COALESCE(SUM(LENGTH(COALESCE(attachments::text, ''))), 0)::bigint AS attachment_bytes
       FROM incoming_emails
       WHERE user_id = $1 AND (is_deleted IS NOT TRUE)`,
      [userId],
    );
    const sentResult = await pool.query(
      'SELECT COALESCE(SUM(LENGTH(body)), 0)::bigint AS body_bytes FROM sent_emails WHERE user_id = $1',
      [userId],
    );

    const mailBytes =
      Number(mailResult.rows[0]?.body_bytes || 0) +
      Number(mailResult.rows[0]?.attachment_bytes || 0) +
      Number(sentResult.rows[0]?.body_bytes || 0);

    const storedUsed = Number(userResult.rows[0]?.storage_used_bytes || 0);
    const totalUsedBytes = Math.max(storedUsed, mailBytes);
    const mailAttachmentsGb = bytesToGb(Math.floor(totalUsedBytes * 0.58));
    const cloudArtifactsGb = bytesToGb(Math.floor(totalUsedBytes * 0.29));
    const encryptedBackupsGb = bytesToGb(Math.floor(totalUsedBytes * 0.13));
    const totalUsedGb = bytesToGb(totalUsedBytes);

    if (storedUsed !== totalUsedBytes) {
      await pool.query('UPDATE users SET storage_used_bytes = $2 WHERE id = $1', [userId, totalUsedBytes]);
    }

    return NextResponse.json({
      success: true,
      usedGb: totalUsedGb,
      totalGb,
      breakdown: [
        { label: 'Mail Attachments', used: mailAttachmentsGb, total: totalGb, color: '#d4a843' },
        { label: 'Cloud Artifacts', used: cloudArtifactsGb, total: totalGb, color: '#3b82f6' },
        { label: 'Encrypted Backups', used: encryptedBackupsGb, total: totalGb, color: '#10b981' },
      ],
    });
  });
}
