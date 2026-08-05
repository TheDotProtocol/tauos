import { Pool, type PoolConfig } from 'pg';

let poolInstance: Pool | null = null;

function isServerlessRuntime(): boolean {
  return Boolean(process.env.VERCEL);
}

function resolveConnectionString(): string {
  let connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  const isSupabasePooler = connectionString.includes('pooler.supabase.com');

  // Session pooler (:5432) caps concurrent clients (~15). Serverless needs transaction pooler (:6543).
  if (isServerlessRuntime() && isSupabasePooler && connectionString.includes(':5432/')) {
    connectionString = connectionString.replace(':5432/', ':6543/');
  }

  const [base, existingQuery = ''] = connectionString.split('?');
  const params = new URLSearchParams(existingQuery);

  if (isServerlessRuntime() && isSupabasePooler) {
    params.set('pgbouncer', 'true');
    params.set('connection_limit', '1');
  }

  params.set('sslmode', 'disable');

  return `${base}?${params.toString()}`;
}

function poolConfig(): PoolConfig {
  const serverless = isServerlessRuntime();

  return {
    connectionString: resolveConnectionString(),
    ssl: { rejectUnauthorized: false },
    max: serverless ? 1 : 10,
    idleTimeoutMillis: serverless ? 5_000 : 30_000,
    connectionTimeoutMillis: serverless ? 5_000 : 2_000,
    allowExitOnIdle: serverless,
  };
}

export function getPool(): Pool {
  if (!poolInstance) {
    poolInstance = new Pool(poolConfig());
  }
  return poolInstance;
}

export function getJwtSecret(
  scope: 'taumail' | 'taucloud' | 'tauid' | 'taubrowser' | 'tautalk' | 'default' = 'default'
): string {
  const byScope: Record<string, string | undefined> = {
    taumail: process.env.JWT_SECRET_TAUMAIL,
    taucloud: process.env.JWT_SECRET_TAUCLOUD ?? process.env.JWT_SECRET,
    tauid: process.env.JWT_SECRET_TAUID ?? process.env.JWT_SECRET,
    taubrowser: process.env.JWT_SECRET_TAUBROWSER ?? process.env.JWT_SECRET,
    tautalk: process.env.JWT_SECRET_TAUTALK ?? process.env.JWT_SECRET,
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
