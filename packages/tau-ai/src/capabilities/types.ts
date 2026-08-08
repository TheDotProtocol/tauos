/**
 * Tau AI capability identifiers (AI-3.0).
 *
 * Capabilities describe what Tau can do — not which provider performs it.
 * Future capabilities extend via string ids without rewriting the registry.
 */

/** Well-known Tau capabilities — initial set for AI-3. */
export const TAU_CAPABILITIES = {
  TEXT_REASONING: 'TEXT_REASONING',
  CODE: 'CODE',
  IMAGE_UNDERSTANDING: 'IMAGE_UNDERSTANDING',
  IMAGE_GENERATION: 'IMAGE_GENERATION',
  VIDEO_GENERATION: 'VIDEO_GENERATION',
  SPEECH_TO_TEXT: 'SPEECH_TO_TEXT',
  TEXT_TO_SPEECH: 'TEXT_TO_SPEECH',
  EMBEDDING: 'EMBEDDING',
  GENERAL_TOOL_USE: 'GENERAL_TOOL_USE',
} as const;

export type KnownCapability =
  (typeof TAU_CAPABILITIES)[keyof typeof TAU_CAPABILITIES];

/**
 * Extensible capability id — known capabilities plus future additions
 * (e.g. DOCUMENT_ANALYSIS) without registry rewrite.
 */
export type CapabilityId = KnownCapability | (string & {});

/** Input/output modalities a capability may involve. */
export type Modality = 'text' | 'image' | 'audio' | 'video' | 'embedding' | 'tool';

/** How a capability is typically invoked. */
export type CapabilityInvocationKind =
  | 'generate'
  | 'transcribe'
  | 'synthesize'
  | 'embed'
  | 'execute';

export type CapabilityDefinition = {
  id: CapabilityId;
  label: string;
  description: string;
  modalities: Modality[];
  invocationKind: CapabilityInvocationKind;
  /** Known capabilities are built-in; custom entries are extensions. */
  builtIn?: boolean;
};
