import type { SessionStorageAdapter } from './config';

const DRAFT_PREFIX = 'taumail_draft:';

export async function saveLocalDraft(
  storage: SessionStorageAdapter,
  id: string,
  payload: { to: string; subject: string; body: string },
): Promise<void> {
  await storage.setItem(`${DRAFT_PREFIX}${id}`, JSON.stringify({ ...payload, updatedAt: Date.now() }));
}

export async function loadLocalDraft(
  storage: SessionStorageAdapter,
  id: string,
): Promise<{ to: string; subject: string; body: string } | null> {
  const raw = await storage.getItem(`${DRAFT_PREFIX}${id}`);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { to: string; subject: string; body: string };
    return { to: parsed.to, subject: parsed.subject, body: parsed.body };
  } catch {
    return null;
  }
}

export async function clearLocalDraft(storage: SessionStorageAdapter, id: string): Promise<void> {
  await storage.removeItem(`${DRAFT_PREFIX}${id}`);
}
