/**
 * Tau AI message types — provider-agnostic.
 * Aligned with existing ai-gateway shapes; apps must not import provider SDKs.
 */

export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

export type ChatMessage = {
  role: MessageRole;
  content: string;
  /** Tool name when role is 'tool'. */
  name?: string;
};

export type TokenUsage = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd?: number;
};

export type FinishReason = 'stop' | 'length' | 'tool_calls' | 'error' | 'cancelled';
