/** Browser client for Tau Foundation product API (AI-9) */

import { tauFetch } from '@/lib/tau-auth-client';

export type TauFoundationChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type TauFoundationChatRequest = {
  messages: TauFoundationChatMessage[];
  threadId?: string;
  privacyMode?: boolean;
};

export type TauFoundationChatResponse = {
  success: boolean;
  message?: string;
  model?: string;
  substrateId?: string;
  capability?: string;
  error?: string;
  timestamp?: string;
  /** Shadow metadata — routing/constitution only, no message content */
  shadow?: Record<string, unknown>;
};

export async function sendTauFoundationChat(
  request: TauFoundationChatRequest,
): Promise<TauFoundationChatResponse> {
  const res = await tauFetch('/api/tau-foundation/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  const data = (await res.json()) as TauFoundationChatResponse;
  if (!res.ok) {
    throw new Error(data.error ?? 'Tau Foundation chat failed');
  }
  return data;
}
