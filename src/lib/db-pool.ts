import { Pool } from 'pg';

let poolInstance: Pool | null = null;

function resolveConnectionString(): string {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  if (connectionString.includes('sslmode=')) {
    return connectionString.replace(/sslmode=[^&]*/, 'sslmode=disable');
  }
  const sep = connectionString.includes('?') ? '&' : '?';
  return `${connectionString}${sep}sslmode=disable`;
}

export function getPool(): Pool {
  if (!poolInstance) {
    poolInstance = new Pool({
      connectionString: resolveConnectionString(),
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return poolInstance;
}

export function getJwtSecret(
  scope: 'taumail' | 'taucloud' | 'tauid' | 'taubrowser' | 'default' = 'default'
): string {
  const byScope: Record<string, string | undefined> = {
    taumail: process.env.JWT_SECRET_TAUMAIL,
    taucloud: process.env.JWT_SECRET_TAUCLOUD ?? process.env.JWT_SECRET,
    tauid: process.env.JWT_SECRET_TAUID ?? process.env.JWT_SECRET,
    taubrowser: process.env.JWT_SECRET_TAUBROWSER ?? process.env.JWT_SECRET,
    default: process.env.JWT_SECRET,
  };
  const secret = byScope[scope] ?? process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(`JWT secret not configured for ${scope}`);
  }
  return secret;
}

export function isProductionDeploy(): boolean {
  return (
    process.env.VERCEL_ENV === 'production' ||
    process.env.NODE_ENV === 'production'
  );
}
