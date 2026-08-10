import { jsonAuthHeaders } from '../session';
import { tauMobileFetch } from '../network';
import type { TauMailAiMessage } from '../types';

export async function fetchAiHistory(): Promise<{
  messages: TauMailAiMessage[];
  prompts: string[];
}> {
  const res = await tauMobileFetch('/api/taumail/ai', { headers: await jsonAuthHeaders() });
  if (!res.ok) return { messages: [], prompts: [] };
  const data = (await res.json()) as { messages?: TauMailAiMessage[]; prompts?: string[] };
  return { messages: data.messages || [], prompts: data.prompts || [] };
}

export async function sendAiMessage(
  message: string,
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const res = await tauMobileFetch('/api/taumail/ai', {
    method: 'POST',
    headers: await jsonAuthHeaders(),
    body: JSON.stringify({ message }),
  });
  const data = (await res.json()) as {
    message?: string | TauMailAiMessage;
    error?: string;
  };
  if (!res.ok) return { ok: false, error: data.error || 'AI request failed' };
  const reply = data.message;
  const text = typeof reply === 'string' ? reply : reply?.text || '';
  return { ok: true, text };
}
