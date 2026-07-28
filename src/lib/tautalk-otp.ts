import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { getPool } from '@/lib/db-pool';
import { sendMail } from '@/lib/mail-transport';

export type OtpChannel = 'email' | 'phone';

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizePhone(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 7) return null;
  return trimmed.startsWith('+') ? `+${digits}` : digits;
}

function generateCode(): string {
  return String(crypto.randomInt(100000, 999999));
}

export async function sendEmailOtp(email: string): Promise<{ devCode?: string }> {
  const destination = normalizeEmail(email);
  if (!destination.includes('@')) {
    throw new Error('Valid email required');
  }

  const existing = await getPool().query('SELECT id FROM users WHERE email = $1', [destination]);
  if (existing.rows.length > 0) {
    throw new Error('An account with this email already exists');
  }

  const code = generateCode();
  const codeHash = await bcrypt.hash(code, 8);

  await getPool().query(
    `INSERT INTO tautalk_otp_verifications (channel, destination, code_hash, expires_at)
     VALUES ('email', $1, $2, NOW() + INTERVAL '10 minutes')`,
    [destination, codeHash]
  );

  try {
    await sendMail({
      from: {
        email: process.env.SENDGRID_FROM_EMAIL?.trim() || 'noreply@tauos.org',
        name: process.env.SENDGRID_FROM_NAME?.trim() || 'TauTalk',
      },
      to: destination,
      subject: 'Your TauTalk verification code',
      text: `Your TauTalk verification code is ${code}. It expires in 10 minutes.\n\nIf you did not request this, ignore this email.`,
      html: `<p>Your <strong>TauTalk</strong> verification code is:</p><p style="font-size:28px;font-weight:bold;letter-spacing:4px">${code}</p><p>Expires in 10 minutes.</p>`,
    });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[tautalk-otp] dev email code for', destination, code);
      return { devCode: code };
    }
    throw err instanceof Error ? err : new Error('Could not send verification email');
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[tautalk-otp] dev email code for', destination, code);
    return { devCode: code };
  }

  return {};
}

export async function sendPhoneOtp(phoneRaw: string): Promise<{ devCode?: string }> {
  const destination = normalizePhone(phoneRaw);
  if (!destination) throw new Error('Valid phone number required (include country code, e.g. +1…)');

  const existing = await getPool().query('SELECT id FROM users WHERE phone = $1', [destination]);
  if (existing.rows.length > 0) {
    throw new Error('An account with this phone already exists');
  }

  const code = generateCode();
  const codeHash = await bcrypt.hash(code, 8);

  await getPool().query(
    `INSERT INTO tautalk_otp_verifications (channel, destination, code_hash, expires_at)
     VALUES ('phone', $1, $2, NOW() + INTERVAL '10 minutes')`,
    [destination, codeHash]
  );

  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
  const from = process.env.TWILIO_PHONE_NUMBER?.trim();

  if (!sid || !token || !from) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[tautalk-otp] dev SMS code for', destination, code);
      return { devCode: code };
    }
    throw new Error('SMS verification is not configured yet (Twilio env vars on server)');
  }

  const body = new URLSearchParams({
    To: destination,
    From: from,
    Body: `Your TauTalk code is ${code}. Expires in 10 minutes.`,
  });

  const auth = Buffer.from(`${sid}:${token}`).toString('base64');
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('[tautalk-otp] Twilio error:', errText);
    throw new Error('Could not send SMS verification code');
  }

  return {};
}

export async function verifyOtp(channel: OtpChannel, destination: string, code: string): Promise<boolean> {
  const dest = channel === 'email' ? normalizeEmail(destination) : normalizePhone(destination);
  if (!dest || !code?.trim()) return false;

  const result = await getPool().query(
    `SELECT id, code_hash, attempts FROM tautalk_otp_verifications
     WHERE channel = $1 AND destination = $2 AND consumed_at IS NULL AND expires_at > NOW()
     ORDER BY created_at DESC LIMIT 1`,
    [channel, dest]
  );

  if (result.rows.length === 0) return false;

  const row = result.rows[0];
  if (row.attempts >= MAX_ATTEMPTS) {
    throw new Error('Too many attempts — request a new code');
  }

  const ok = await bcrypt.compare(code.trim(), row.code_hash);
  await getPool().query(
    `UPDATE tautalk_otp_verifications
     SET attempts = attempts + 1, consumed_at = CASE WHEN $2 THEN NOW() ELSE consumed_at END
     WHERE id = $1`,
    [row.id, ok]
  );

  return ok;
}

export { OTP_TTL_MS };
