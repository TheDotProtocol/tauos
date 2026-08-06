import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { getPool } from '@/lib/db-pool';
import { sendMail } from '@/lib/mail-transport';
import { normalizeEmail } from '@/lib/tauid/validation';

export type TauIdOtpPurpose = 'email_verify' | 'password_reset';

const OTP_TTL_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function generateCode(): string {
  return String(crypto.randomInt(100000, 999999));
}

async function ensureOtpTable() {
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS tauid_otp_codes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      purpose TEXT NOT NULL,
      destination TEXT NOT NULL,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      code_hash TEXT NOT NULL,
      attempts INT DEFAULT 0,
      expires_at TIMESTAMPTZ NOT NULL,
      consumed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await getPool().query(`
    CREATE INDEX IF NOT EXISTS idx_tauid_otp_lookup
    ON tauid_otp_codes (purpose, destination, created_at DESC)
  `);
}

export async function sendTauIdOtp(
  purpose: TauIdOtpPurpose,
  email: string,
  userId?: string
): Promise<{ devCode?: string }> {
  await ensureOtpTable();
  const destination = normalizeEmail(email);
  if (!destination.includes('@')) throw new Error('Valid email required');

  const code = generateCode();
  const codeHash = await bcrypt.hash(code, 8);

  await getPool().query(
    `INSERT INTO tauid_otp_codes (purpose, destination, user_id, code_hash, expires_at)
     VALUES ($1, $2, $3, $4, NOW() + INTERVAL '15 minutes')`,
    [purpose, destination, userId ?? null, codeHash]
  );

  const subject =
    purpose === 'password_reset'
      ? 'Reset your Tau ID password'
      : 'Verify your Tau ID email';
  const appLabel = purpose === 'password_reset' ? 'password reset' : 'email verification';

  try {
    await sendMail({
      from: {
        email: process.env.SENDGRID_FROM_EMAIL?.trim() || 'noreply@tauos.org',
        name: process.env.SENDGRID_FROM_NAME?.trim() || 'Tau ID',
      },
      to: destination,
      subject,
      text: `Your Tau ID ${appLabel} code is ${code}. It expires in 15 minutes.\n\nIf you did not request this, ignore this email.`,
      html: `<p>Your <strong>Tau ID</strong> ${appLabel} code is:</p><p style="font-size:28px;font-weight:bold;letter-spacing:4px">${code}</p><p>Expires in 15 minutes.</p>`,
    });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[tauid-otp] dev code (${purpose}) for`, destination, code);
      return { devCode: code };
    }
    throw err instanceof Error ? err : new Error('Could not send email');
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[tauid-otp] dev code (${purpose}) for`, destination, code);
    return { devCode: code };
  }

  return {};
}

export async function verifyTauIdOtp(
  purpose: TauIdOtpPurpose,
  email: string,
  code: string
): Promise<{ ok: boolean; userId?: string; error?: string }> {
  await ensureOtpTable();
  const destination = normalizeEmail(email);
  if (!destination || !code?.trim()) return { ok: false, error: 'Invalid code' };

  const result = await getPool().query(
    `SELECT id, code_hash, attempts, user_id FROM tauid_otp_codes
     WHERE purpose = $1 AND destination = $2 AND consumed_at IS NULL AND expires_at > NOW()
     ORDER BY created_at DESC LIMIT 1`,
    [purpose, destination]
  );

  if (result.rows.length === 0) return { ok: false, error: 'Code expired or not found' };

  const row = result.rows[0];
  if (row.attempts >= MAX_ATTEMPTS) {
    return { ok: false, error: 'Too many attempts — request a new code' };
  }

  const ok = await bcrypt.compare(code.trim(), row.code_hash);
  await getPool().query(
    `UPDATE tauid_otp_codes
     SET attempts = attempts + 1, consumed_at = CASE WHEN $2 THEN NOW() ELSE consumed_at END
     WHERE id = $1`,
    [row.id, ok]
  );

  if (!ok) return { ok: false, error: 'Invalid verification code' };
  return { ok: true, userId: row.user_id ?? undefined };
}

export { OTP_TTL_MS };
