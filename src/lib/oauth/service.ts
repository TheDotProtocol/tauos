import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { getPool } from '@/lib/db-pool';
import { OAuthProviderConfig } from '@/lib/oauth/config';

export type OAuthProfile = {
  providerUserId: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  emailVerified: boolean;
};

async function ensureOAuthTable() {
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS oauth_identities (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      provider TEXT NOT NULL,
      provider_user_id TEXT NOT NULL,
      email TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (provider, provider_user_id)
    )
  `);
}

export async function exchangeOAuthCode(
  provider: OAuthProviderConfig,
  code: string,
  redirectUri: string
): Promise<string> {
  const body = new URLSearchParams({
    client_id: provider.clientId!,
    client_secret: provider.clientSecret!,
    code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  const res = await fetch(provider.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body,
  });

  const data = (await res.json()) as { access_token?: string; error?: string };
  if (!res.ok || !data.access_token) {
    throw new Error(data.error || 'OAuth token exchange failed');
  }
  return data.access_token;
}

export async function fetchOAuthProfile(
  provider: OAuthProviderConfig,
  accessToken: string
): Promise<OAuthProfile> {
  const res = await fetch(provider.userUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'User-Agent': 'TauOS-OAuth',
    },
  });
  const data = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    throw new Error('Failed to load OAuth profile');
  }

  if (provider.id === 'google') {
    return {
      providerUserId: String(data.sub),
      email: String(data.email || ''),
      fullName: String(data.name || data.email || 'Tau User'),
      avatarUrl: (data.picture as string) || null,
      emailVerified: Boolean(data.email_verified),
    };
  }

  let email =
    typeof data.email === 'string'
      ? data.email
      : Array.isArray(data.emails) && data.emails[0]?.email
        ? String(data.emails[0].email)
        : '';

  if (!email) {
    const emailsRes = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'TauOS-OAuth',
      },
    });
    if (emailsRes.ok) {
      const emails = (await emailsRes.json()) as Array<{ email: string; primary?: boolean; verified?: boolean }>;
      const primary = emails.find((e) => e.primary && e.verified) || emails.find((e) => e.verified) || emails[0];
      email = primary?.email || '';
    }
  }

  return {
    providerUserId: String(data.id),
    email,
    fullName: String(data.name || data.login || email || 'Tau User'),
    avatarUrl: (data.avatar_url as string) || null,
    emailVerified: Boolean(email),
  };
}

function usernameFromEmail(email: string): string {
  const base = email.split('@')[0]?.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 24) || 'user';
  return `${base}_${crypto.randomBytes(2).toString('hex')}`;
}

export async function findOrCreateUserFromOAuth(
  providerId: string,
  profile: OAuthProfile
): Promise<{ id: string; email: string; username: string; fullName: string }> {
  if (!profile.email) {
    throw new Error('OAuth provider did not return an email address');
  }

  await ensureOAuthTable();

  const linked = await getPool().query(
    `SELECT u.id, u.email, u.username, u.full_name
     FROM oauth_identities o
     JOIN users u ON u.id = o.user_id
     WHERE o.provider = $1 AND o.provider_user_id = $2`,
    [providerId, profile.providerUserId]
  );

  if (linked.rows.length > 0) {
    const row = linked.rows[0];
    return {
      id: String(row.id),
      email: row.email,
      username: row.username,
      fullName: row.full_name || profile.fullName,
    };
  }

  const existing = await getPool().query('SELECT id, email, username, full_name FROM users WHERE LOWER(email) = LOWER($1)', [
    profile.email,
  ]);

  let userId: string;
  let username: string;
  let fullName: string;

  if (existing.rows.length > 0) {
    const row = existing.rows[0];
    userId = String(row.id);
    username = row.username;
    fullName = row.full_name || profile.fullName;
    await getPool().query(
      `UPDATE users SET email_verified = $2, avatar_url = COALESCE(avatar_url, $3) WHERE id = $1`,
      [userId, profile.emailVerified, profile.avatarUrl]
    );
  } else {
    username = usernameFromEmail(profile.email);
    fullName = profile.fullName;
    const randomPassword = crypto.randomBytes(32).toString('hex');
    const passwordHash = await bcrypt.hash(randomPassword, 12);
    const inserted = await getPool().query(
      `INSERT INTO users (username, email, password_hash, full_name, email_verified, avatar_url, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       RETURNING id`,
      [username, profile.email.toLowerCase(), passwordHash, fullName, profile.emailVerified, profile.avatarUrl]
    );
    userId = String(inserted.rows[0].id);
  }

  await getPool().query(
    `INSERT INTO oauth_identities (user_id, provider, provider_user_id, email)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (provider, provider_user_id) DO UPDATE SET email = EXCLUDED.email`,
    [userId, providerId, profile.providerUserId, profile.email]
  );

  return { id: userId, email: profile.email.toLowerCase(), username, fullName };
}
