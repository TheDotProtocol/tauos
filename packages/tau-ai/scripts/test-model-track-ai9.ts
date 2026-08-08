/**
 * AI-9 / TF-2 — Tau Foundation Model track interface tests.
 */

import {
  TAU_FOUNDATION_MODEL_PHASES,
  canBeginPhase,
  getTauFoundationModelTrackState,
} from '../src/model-track';

function assert(condition: boolean, label: string) {
  if (!condition) throw new Error(`FAIL: ${label}`);
}

console.log('=== AI-9 Model Track Tests ===');

const state = getTauFoundationModelTrackState();
assert(state.weightsAvailable === false, 'weights not available');
assert(state.currentPhase === 'TF-3', 'current phase TF-3 after TF-2');
assert(state.substrateId === 'tau-foundation', 'substrate id');
assert(TAU_FOUNDATION_MODEL_PHASES.length === 11, '11 phases TF-0..TF-10');

const tf2 = TAU_FOUNDATION_MODEL_PHASES.find((p) => p.id === 'TF-2');
assert(tf2?.status === 'COMPLETE', 'TF-2 complete');
assert(canBeginPhase('TF-3'), 'TF-3 can begin');
assert(!canBeginPhase('TF-4'), 'TF-4 blocked until TF-3 complete');

console.log('PASS  model track interfaces (7 checks)');
