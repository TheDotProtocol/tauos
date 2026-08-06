import jwt from 'jsonwebtoken';
import { getJwtSecret } from '@/lib/db-pool';

export type TauTokenPayload = {
  userId: number | string;
  email: string;
  username: string;
  app?: string;
  sso?: boolean;
  fullName?: string;
};

const VERIFY_SCOPES = ['tauid', 'taumail', 'taucloud', 'taubrowser', 'tautalk', 'default'] as const;

/** Master SSO signing secret — Tau ID tokens work across all apps */
export function getSsoSecret(): string {
  return (
    process.env.JWT_SECRET_SSO ??
    process.env.JWT_SECRET_TAUID ??
    process.env.JWT_SECRET ??
    getJwtSecret('tauid')
  );
}

export function issueSsoToken(user: {
  id: number | string;
  email: string;
  username: string;
  fullName?: string;
}): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      app: 'tauid',
      sso: true,
    },
    getSsoSecret(),
    { expiresIn: '15m' }
  );
}

/** Verify JWT from any Tau app or SSO token */
export function verifyTauToken(token: string): TauTokenPayload | null {
  const secrets = new Set<string>();
  secrets.add(getSsoSecret());

  for (const scope of VERIFY_SCOPES) {
    try {
      secrets.add(getJwtSecret(scope));
    } catch {
      /* scope not configured */
    }
  }

  for (const secret of Array.from(secrets)) {
    try {
      return jwt.verify(token, secret) as TauTokenPayload;
    } catch {
      /* try next secret */
    }
  }

  return null;
}

export { TAU_TOKEN_KEY, TAU_USER_KEY } from '@/lib/tau-auth-constants';