/**
 * AI-11 — TauMail → Tau Foundation bridge.
 * Mail UI/workflows stay in TauMail; intelligence via Foundation.
 */

import type { ChatMessage } from '@tau/ai';
import type { EcosystemChatResult, EcosystemIntegrationLevel } from '@tau/ai';
import { createEcosystemFoundationClient } from '@/lib/tau-ai/ecosystem-foundation-service';

/** Product context — TauMail scope; not global Tau memory */
export const TAUMAIL_APP_ID = 'taumail';

export const TAUMAIL_SYSTEM_PREAMBLE = `You are Tau AI assisting within TauMail.
Help with email-related tasks: summarize threads, draft replies, suggest scheduling, analyze attachments.
You cannot send, delete, or modify emails — only draft text for user confirmation.
Mail-specific user preferences remain in TauMail product scope unless promoted via governed memory rules.`;

export type TauMailFoundationChatParams = {
  userId: string;
  messages: ChatMessage[];
  privacyMode?: boolean;
  threadId?: string;
};

function integrationLevel(hasMessage: boolean, hasSubstrate: boolean): EcosystemIntegrationLevel {
  if (hasMessage && hasSubstrate) return 'LIVE_MODEL_VERIFIED';
  if (hasMessage) return 'INTEGRATION_VERIFIED';
  return 'ADAPTER_VERIFIED';
}

export async function runTauMailFoundationChat(
  params: TauMailFoundationChatParams,
): Promise<EcosystemChatResult> {
  const client = createEcosystemFoundationClient(TAUMAIL_APP_ID);

  const withoutSystem = params.messages.filter((m) => m.role !== 'system');
  const messages: ChatMessage[] = [
    { role: 'system', content: TAUMAIL_SYSTEM_PREAMBLE },
    ...withoutSystem,
  ];

  const result = await client.chat({
    messages,
    userId: params.userId,
    threadId: params.threadId,
    options: {
      privacyMode: params.privacyMode ?? true,
      agent: 'taumail-assistant',
    },
  });

  return {
    message: result.message ?? '',
    model: result.model ?? 'none',
    substrateId: result.substrateId,
    capability: result.capability,
    integrationLevel: integrationLevel(Boolean(result.message), Boolean(result.substrateId)),
    integrationPath: 'foundation',
    appId: TAUMAIL_APP_ID,
    timestamp: new Date().toISOString(),
  };
}
