/**
 * Deterministic instruction hierarchy (AI-4).
 *
 * External content must never automatically become governing instructions.
 */

import type { InstructionHierarchyLevel } from './types';

export const INSTRUCTION_HIERARCHY: InstructionHierarchyLevel[] = [
  {
    rank: 1,
    id: 'CONSTITUTIONAL_RULES',
    label: 'Constitutional rules',
    description: 'Tau Constitution principles — highest authority.',
  },
  {
    rank: 2,
    id: 'SYSTEM_POLICIES',
    label: 'System policies',
    description: 'Platform privacy, security, and routing policies.',
  },
  {
    rank: 3,
    id: 'DEVELOPER_CONSTRAINTS',
    label: 'Developer constraints',
    description: 'App-level constraints registered with Tau AI.',
  },
  {
    rank: 4,
    id: 'USER_INSTRUCTIONS',
    label: 'User instructions',
    description: 'Current explicit user request within constitutional bounds.',
  },
  {
    rank: 5,
    id: 'EXTERNAL_CONTENT',
    label: 'External content',
    description: 'Retrieved or pasted content — untrusted by default.',
  },
  {
    rank: 6,
    id: 'MODEL_SUGGESTIONS',
    label: 'Model-generated suggestions',
    description: 'Substrate output — never governing without validation.',
  },
];

/** Memory preferences sit below constitutional and system policy layers. */
export const MEMORY_HIERARCHY_NOTE =
  'Remembered preferences cannot override privacy, security, or system policy.';
