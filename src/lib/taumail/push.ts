import type { Pool } from 'pg';
import { getPool } from '@/lib/db-pool';
import { isFcmV1Configured, isRemotePushConfigured, sendFcmV1Notification } from '@/lib/taumail/fcm-v1';
import { ensureTauMailSchema } from '@/lib/taumail/schema';

export { isRemotePushConfigured };

export type PushPlatform = 'ios' | 'android' | 'unknown';

export type PushDeviceInput = {
  deviceId: string;
  platform: PushPlatform;
  pushToken?: string | null;
};

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const mins = Math.max(1, Math.floor(diffMs / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export async function isPushEnabledForUser(pool: Pool, userId: string): Promise<boolean> {
  await ensureTauMailSchema(pool);
  const result = await pool.query(
    `SELECT COALESCE(push_notifications_enabled, true) AS enabled
     FROM users WHERE id::text = $1::text LIMIT 1`,
    [userId],
  );
  if (!result.rows.length) return true;
  return Boolean(result.rows[0].enabled);
}

export async function registerPushDevice(userId: string, input: PushDeviceInput): Promise<void> {
  const pool = getPool();
  await ensureTauMailSchema(pool);
  await pool.query(
    `INSERT INTO taumail_push_devices (user_id, device_id, platform, push_token, updated_at)
     VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
     ON CONFLICT (user_id, device_id)
     DO UPDATE SET
       platform = EXCLUDED.platform,
       push_token = COALESCE(EXCLUDED.push_token, taumail_push_devices.push_token),
       updated_at = CURRENT_TIMESTAMP`,
    [userId, input.deviceId, input.platform, input.pushToken ?? null],
  );
}

export async function unregisterPushDevice(userId: string, deviceId: string): Promise<void> {
  const pool = getPool();
  await ensureTauMailSchema(pool);
  await pool.query(
    `DELETE FROM taumail_push_devices WHERE user_id = $1 AND device_id = $2`,
    [userId, deviceId],
  );
}

export async function setPushPreference(userId: string, enabled: boolean): Promise<void> {
  const pool = getPool();
  await ensureTauMailSchema(pool);
  await pool.query(
    `UPDATE users SET push_notifications_enabled = $2 WHERE id::text = $1::text`,
    [userId, enabled],
  );
}

export async function createMailNotification(
  userId: string,
  title: string,
  meta: string,
  tone: 'info' | 'success' | 'warning' | 'danger' = 'info',
): Promise<string | null> {
  const pool = getPool();
  await ensureTauMailSchema(pool);
  const result = await pool.query(
    `INSERT INTO taumail_notifications (user_id, title, meta, tone, is_read)
     VALUES ($1, $2, $3, $4, false)
     RETURNING id`,
    [userId, title, meta, tone],
  );
  return result.rows[0]?.id ? String(result.rows[0].id) : null;
}

async function sendFcmNotificationLegacy(
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>,
): Promise<boolean> {
  const serverKey = process.env.FCM_SERVER_KEY?.trim();
  if (!serverKey) return false;

  try {
    const res = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        Authorization: `key=${serverKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: token,
        priority: 'high',
        notification: { title, body, sound: 'default' },
        data: data ?? {},
      }),
    });
    if (!res.ok) {
      console.warn('[push] FCM legacy send failed:', await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.warn('[push] FCM legacy error:', error);
    return false;
  }
}

async function sendFcmNotification(
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>,
): Promise<boolean> {
  if (!isRemotePushConfigured()) return false;
  if (isFcmV1Configured()) {
    return sendFcmV1Notification(token, title, body, data);
  }
  return sendFcmNotificationLegacy(token, title, body, data);
}

export async function sendPushToUser(
  userId: string,
  payload: { title: string; body: string; data?: Record<string, string> },
): Promise<{ attempted: number; sent: number }> {
  const pool = getPool();
  await ensureTauMailSchema(pool);

  if (!(await isPushEnabledForUser(pool, userId))) {
    return { attempted: 0, sent: 0 };
  }

  const devices = await pool.query(
    `SELECT push_token FROM taumail_push_devices
     WHERE user_id = $1 AND push_token IS NOT NULL AND push_token <> ''`,
    [userId],
  );

  let sent = 0;
  for (const row of devices.rows) {
    const token = String(row.push_token || '');
    if (!token || token.startsWith('poll:')) continue;
    const ok = await sendFcmNotification(token, payload.title, payload.body, payload.data);
    if (ok) sent += 1;
  }

  return { attempted: devices.rows.length, sent };
}

export async function notifyUserOfNewEmail(
  userId: string,
  input: { emailId: string | number; subject: string; fromLabel: string },
): Promise<void> {
  const pool = getPool();
  const title = `New message: ${input.subject || 'No Subject'}`;
  const meta = formatRelativeTime(new Date());
  await createMailNotification(userId, title, meta, 'info');
  await sendPushToUser(userId, {
    title: 'Tau Mail',
    body: `${input.fromLabel}: ${input.subject || 'No Subject'}`,
    data: {
      type: 'new_email',
      emailId: String(input.emailId),
    },
  });
}
