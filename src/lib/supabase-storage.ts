export type SupabaseStorageConfig = {
  url: string;
  serviceKey: string;
  bucket: string;
};

export function getSupabaseStorageConfig(): SupabaseStorageConfig | null {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET?.trim() || 'taucloud-files';

  let url = process.env.SUPABASE_URL?.trim();
  if (!url) {
    const db = process.env.DATABASE_URL ?? '';
    const match =
      db.match(/postgres\.([a-z0-9]+)\./i) ?? db.match(/@db\.([a-z0-9]+)\./i);
    if (match?.[1]) url = `https://${match[1]}.supabase.co`;
  }

  if (!url || !serviceKey) return null;
  return { url: url.replace(/\/$/, ''), serviceKey, bucket };
}

function storageBase(cfg: SupabaseStorageConfig) {
  return `${cfg.url}/storage/v1`;
}

export async function ensureStorageBucket(cfg: SupabaseStorageConfig): Promise<boolean> {
  const res = await fetch(`${storageBase(cfg)}/bucket`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfg.serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: cfg.bucket, public: false, file_size_limit: 52428800 }),
  });

  if (res.ok) return true;
  const body = await res.text();
  if (res.status === 409 || body.includes('already exists')) return true;
  throw new Error(`Bucket create failed (${res.status}): ${body}`);
}

export async function uploadObject(
  cfg: SupabaseStorageConfig,
  objectPath: string,
  data: ArrayBuffer | Uint8Array,
  contentType: string
): Promise<{ path: string }> {
  const path = objectPath.replace(/^\/+/, '');
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  const res = await fetch(
    `${storageBase(cfg)}/object/${encodeURIComponent(cfg.bucket)}/${path}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.serviceKey}`,
        'Content-Type': contentType,
        'x-upsert': 'true',
      },
      body: new Blob([new Uint8Array(bytes)]),
    }
  );

  if (!res.ok) {
    throw new Error(`Upload failed (${res.status}): ${await res.text()}`);
  }
  return { path };
}

export async function deleteObject(
  cfg: SupabaseStorageConfig,
  objectPath: string
): Promise<void> {
  const path = objectPath.replace(/^\/+/, '');
  const res = await fetch(
    `${storageBase(cfg)}/object/${encodeURIComponent(cfg.bucket)}/${path}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${cfg.serviceKey}` },
    }
  );
  if (!res.ok && res.status !== 404) {
    throw new Error(`Delete failed (${res.status}): ${await res.text()}`);
  }
}

export async function createSignedDownloadUrl(
  cfg: SupabaseStorageConfig,
  objectPath: string,
  expiresIn = 3600
): Promise<string> {
  const path = objectPath.replace(/^\/+/, '');
  const res = await fetch(
    `${storageBase(cfg)}/object/sign/${encodeURIComponent(cfg.bucket)}/${path}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expiresIn }),
    }
  );

  if (!res.ok) {
    throw new Error(`Sign URL failed (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as { signedURL?: string };
  if (!json.signedURL) throw new Error('No signedURL in response');
  return json.signedURL.startsWith('http')
    ? json.signedURL
    : `${cfg.url}/storage/v1${json.signedURL}`;
}

export async function checkStorageHealth(): Promise<{
  ok: boolean;
  bucket?: string;
  url?: string;
  error?: string;
}> {
  const cfg = getSupabaseStorageConfig();
  if (!cfg) {
    return { ok: false, error: 'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required' };
  }

  try {
    const res = await fetch(`${storageBase(cfg)}/bucket/${encodeURIComponent(cfg.bucket)}`, {
      headers: { Authorization: `Bearer ${cfg.serviceKey}` },
    });
    if (res.ok) return { ok: true, bucket: cfg.bucket, url: cfg.url };
    if (res.status === 404) {
      return { ok: false, bucket: cfg.bucket, url: cfg.url, error: 'Bucket not found — run npm run storage:setup' };
    }
    return { ok: false, error: `Storage API ${res.status}: ${await res.text()}` };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Storage check failed',
    };
  }
}
