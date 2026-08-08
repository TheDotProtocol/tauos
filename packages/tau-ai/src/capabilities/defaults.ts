/**
 * Default Tau capability definitions (AI-3.0).
 */

import { createCapabilityRegistry } from './registry';
import { TAU_CAPABILITIES, type CapabilityDefinition } from './types';

export const DEFAULT_CAPABILITY_DEFINITIONS: CapabilityDefinition[] = [
  {
    id: TAU_CAPABILITIES.TEXT_REASONING,
    label: 'Text Reasoning',
    description:
      'General language understanding, explanation, analysis, and conversational intelligence.',
    modalities: ['text'],
    invocationKind: 'generate',
    builtIn: true,
  },
  {
    id: TAU_CAPABILITIES.CODE,
    label: 'Code',
    description:
      'Software development, code generation, refactoring, and technical problem solving.',
    modalities: ['text'],
    invocationKind: 'generate',
    builtIn: true,
  },
  {
    id: TAU_CAPABILITIES.IMAGE_UNDERSTANDING,
    label: 'Image Understanding',
    description:
      'Vision and multimodal understanding — describe, analyse, or answer questions about images.',
    modalities: ['text', 'image'],
    invocationKind: 'generate',
    builtIn: true,
  },
  {
    id: TAU_CAPABILITIES.IMAGE_GENERATION,
    label: 'Image Generation',
    description:
      'Create images from text prompts via dedicated image-generation substrates.',
    modalities: ['text', 'image'],
    invocationKind: 'generate',
    builtIn: true,
  },
  {
    id: TAU_CAPABILITIES.VIDEO_GENERATION,
    label: 'Video Generation',
    description:
      'Create or transform video content via dedicated video-generation substrates.',
    modalities: ['text', 'video'],
    invocationKind: 'generate',
    builtIn: true,
  },
  {
    id: TAU_CAPABILITIES.SPEECH_TO_TEXT,
    label: 'Speech to Text',
    description: 'Transcribe audio recordings to text.',
    modalities: ['audio', 'text'],
    invocationKind: 'transcribe',
    builtIn: true,
  },
  {
    id: TAU_CAPABILITIES.TEXT_TO_SPEECH,
    label: 'Text to Speech',
    description: 'Synthesise spoken audio from text.',
    modalities: ['text', 'audio'],
    invocationKind: 'synthesize',
    builtIn: true,
  },
  {
    id: TAU_CAPABILITIES.EMBEDDING,
    label: 'Embedding',
    description:
      'Vector embeddings for memory, semantic search, and knowledge retrieval.',
    modalities: ['text', 'embedding'],
    invocationKind: 'embed',
    builtIn: true,
  },
  {
    id: TAU_CAPABILITIES.GENERAL_TOOL_USE,
    label: 'General Tool Use',
    description:
      'Orchestration of registered tools under constitution and execution policy.',
    modalities: ['text', 'tool'],
    invocationKind: 'execute',
    builtIn: true,
  },
];

export function createDefaultCapabilityRegistry() {
  return createCapabilityRegistry(DEFAULT_CAPABILITY_DEFINITIONS);
}
