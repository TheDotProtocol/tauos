/**
 * Tau Foundation Model track — planning interfaces only (AI-9).
 *
 * TF-1+ is NOT implemented. No training, no weights, no fake checkpoints.
 * See docs/tau-foundation-model-track.md for the documented sequence.
 */

/** Track phase identifiers — TF-0 through TF-10 per approved product spec */
export type TauFoundationModelPhase =
  | 'TF-0'
  | 'TF-1'
  | 'TF-2'
  | 'TF-3'
  | 'TF-4'
  | 'TF-5'
  | 'TF-6'
  | 'TF-7'
  | 'TF-8'
  | 'TF-9'
  | 'TF-10';

export type TauFoundationModelPhaseStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'BLOCKED'
  | 'COMPLETE';

export type TauFoundationModelPhaseDefinition = {
  id: TauFoundationModelPhase;
  title: string;
  description: string;
  status: TauFoundationModelPhaseStatus;
  /** When true, phase requires explicit human approval before execution */
  requiresApproval: boolean;
};

export type TauFoundationModelTrackState = {
  version: '0.1-planning';
  currentPhase: TauFoundationModelPhase;
  phases: TauFoundationModelPhaseDefinition[];
  /** Tau-owned weights do NOT exist yet */
  weightsAvailable: false;
  substrateId: 'tau-foundation';
};

export const TAU_FOUNDATION_MODEL_PHASES: TauFoundationModelPhaseDefinition[] = [
  {
    id: 'TF-0',
    title: 'Model & license evaluation',
    description: 'Evaluate candidate base models, licenses, dataset and training plan.',
    status: 'COMPLETE',
    requiresApproval: true,
  },
  {
    id: 'TF-1',
    title: 'Tau Dataset v0.1',
    description: 'Dataset schema, provenance registry, gold seed corpus, validation, and manifest.',
    status: 'COMPLETE',
    requiresApproval: true,
  },
  {
    id: 'TF-2',
    title: 'Training pipeline',
    description: 'Reproducible LoRA/SFT training pipeline infrastructure.',
    status: 'COMPLETE',
    requiresApproval: true,
  },
  {
    id: 'TF-3',
    title: 'First checkpoint',
    description: 'First Tau Foundation Model training checkpoint.',
    status: 'NOT_STARTED',
    requiresApproval: true,
  },
  {
    id: 'TF-4',
    title: 'Internal evaluation',
    description: 'Run tau-eval-v0.1 on checkpoint vs baseline.',
    status: 'NOT_STARTED',
    requiresApproval: true,
  },
  {
    id: 'TF-5',
    title: 'Tau Foundation Model v0.1',
    description: 'Promoted v0.1 checkpoint with model card.',
    status: 'NOT_STARTED',
    requiresApproval: true,
  },
  {
    id: 'TF-6',
    title: 'Private beta',
    description: 'Tau ecosystem private beta deployment.',
    status: 'NOT_STARTED',
    requiresApproval: true,
  },
  {
    id: 'TF-7',
    title: 'Public beta',
    description: 'Public beta release with honest capability claims.',
    status: 'NOT_STARTED',
    requiresApproval: true,
  },
  {
    id: 'TF-8',
    title: 'Production substrate integration',
    description: 'Integrate live weights into tau-foundation ModelSubstrate.',
    status: 'NOT_STARTED',
    requiresApproval: true,
  },
  {
    id: 'TF-9',
    title: 'Constitution alignment pass',
    description: 'Additional constitution-focused tuning and eval if required.',
    status: 'NOT_STARTED',
    requiresApproval: true,
  },
  {
    id: 'TF-10',
    title: 'Extended evaluation',
    description: 'Extended benchmark and ecosystem evaluation before major release.',
    status: 'NOT_STARTED',
    requiresApproval: true,
  },
];

export function getTauFoundationModelTrackState(): TauFoundationModelTrackState {
  return {
    version: '0.1-planning',
    currentPhase: 'TF-3',
    phases: TAU_FOUNDATION_MODEL_PHASES,
    weightsAvailable: false,
    substrateId: 'tau-foundation',
  };
}

/** Returns whether a phase may begin — all prior phases must be COMPLETE */
export function canBeginPhase(
  phase: TauFoundationModelPhase,
  state: TauFoundationModelTrackState = getTauFoundationModelTrackState(),
): boolean {
  const index = state.phases.findIndex((p) => p.id === phase);
  if (index <= 0) return true;
  return state.phases.slice(0, index).every((p) => p.status === 'COMPLETE');
}
