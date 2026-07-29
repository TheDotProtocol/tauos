import { getPool } from '@/lib/db-pool';
import { ensureSchema, dbAvailable, fileStoreRead, fileStoreWrite } from './db';
import { encryptSecret, maskSecret } from './crypto';

export async function listSecrets(projectId: string) {
  if (await dbAvailable()) {
    await ensureSchema();
    const res = await getPool().query(
      'SELECT id, key, secret_type, created_at, updated_at FROM tau_ide_secrets WHERE project_id = $1',
      [projectId]
    );
    return res.rows.map((r) => ({ ...r, masked: true }));
  }
  const secrets = fileStoreRead<{ key: string; secret_type: string }[]>(`global`, `secrets-${projectId}`, []);
  return secrets.map((s) => ({ ...s, masked: true }));
}

export async function setSecret(projectId: string, key: string, value: string, secretType = 'env') {
  const encrypted = encryptSecret(value);
  if (await dbAvailable()) {
    await ensureSchema();
    await getPool().query(
      `INSERT INTO tau_ide_secrets (project_id, key, encrypted_value, secret_type, updated_at)
       VALUES ($1,$2,$3,$4,NOW()) ON CONFLICT (project_id, key) DO UPDATE SET encrypted_value = $3, updated_at = NOW()`,
      [projectId, key, encrypted, secretType]
    );
    return { key, masked: maskSecret(value) };
  }
  const secrets = fileStoreRead<{ key: string; encrypted_value: string; secret_type: string }[]>(`global`, `secrets-${projectId}`, []);
  const idx = secrets.findIndex((s) => s.key === key);
  const row = { key, encrypted_value: encrypted, secret_type: secretType };
  if (idx >= 0) secrets[idx] = row; else secrets.push(row);
  fileStoreWrite(`global`, `secrets-${projectId}`, secrets);
  return { key, masked: maskSecret(value) };
}

export async function getSecretValue(projectId: string, key: string): Promise<string | null> {
  if (await dbAvailable()) {
    await ensureSchema();
    const res = await getPool().query('SELECT encrypted_value FROM tau_ide_secrets WHERE project_id = $1 AND key = $2', [projectId, key]);
    if (!res.rows[0]) return null;
    const { decryptSecret } = await import('./crypto');
    return decryptSecret(res.rows[0].encrypted_value);
  }
  return null;
}

export async function deleteSecret(projectId: string, key: string) {
  if (await dbAvailable()) {
    await ensureSchema();
    await getPool().query('DELETE FROM tau_ide_secrets WHERE project_id = $1 AND key = $2', [projectId, key]);
  }
}
