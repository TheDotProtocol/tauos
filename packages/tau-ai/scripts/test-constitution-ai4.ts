/**
 * AI-4 — deterministic Constitution test matrix.
 */
import { TAU_CAPABILITIES } from '../src/capabilities/types';
import {
  TAU_CONSTITUTION_VERSION,
  createConstitutionEvaluator,
  createTauConstitutionV01,
  derivePrivacyModeFromRequest,
  evaluateConstitutionalRouting,
  type EvaluationResult,
} from '../src';

function assertResult(actual: EvaluationResult, expected: EvaluationResult, label: string) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
}

function assert(c: boolean, m: string) {
  if (!c) throw new Error(m);
}

function main() {
  const evaluator = createConstitutionEvaluator();
  const constitution = createTauConstitutionV01();
  let n = 0;

  assertResult(
    evaluator.evaluate({
      kind: 'RESPONSE',
      claimsVerifiedFact: true,
      hasEvidence: true,
    }).overall,
    'PASS',
    'truthful response',
  );
  n++;

  assertResult(
    evaluator.evaluate({
      kind: 'RESPONSE',
      informationComplete: false,
      expressesUncertainty: true,
    }).overall,
    'PASS',
    'uncertain response',
  );
  n++;

  assertResult(
    evaluator.evaluate({
      kind: 'RESPONSE',
      claimedCapabilities: [TAU_CAPABILITIES.IMAGE_GENERATION],
      availableCapabilities: [TAU_CAPABILITIES.TEXT_REASONING],
    }).overall,
    'BLOCK',
    'fabricated capability claim',
  );
  n++;

  assertResult(
    evaluator.evaluate({
      kind: 'REQUEST',
      privacyMode: 'LOCAL_ONLY',
      requestedRemoteSubstrate: false,
    }).overall,
    'PASS',
    'privacy LOCAL_ONLY request',
  );
  n++;

  assertResult(
    evaluator.evaluate({
      kind: 'REQUEST',
      privacyMode: 'LOCAL_ONLY',
      requestedRemoteSubstrate: true,
    }).overall,
    'BLOCK',
    'remote under LOCAL_ONLY',
  );
  n++;

  assertResult(
    evaluator.evaluate({
      kind: 'TOOL_USE',
      toolName: 'missing',
      toolRegistered: false,
      authorizationPresent: false,
    }).overall,
    'BLOCK',
    'unavailable tool',
  );
  n++;

  assertResult(
    evaluator.evaluate({
      kind: 'TOOL_USE',
      toolName: 'deploy',
      toolRegistered: true,
      authorizationPresent: false,
      createsExternalSideEffect: true,
    }).overall,
    'BLOCK',
    'unauthorized external action',
  );
  n++;

  assertResult(
    evaluator.evaluate({
      kind: 'TOOL_USE',
      toolName: 'read_file',
      toolRegistered: true,
      authorizationPresent: true,
      scopeAllowed: true,
    }).overall,
    'PASS',
    'valid authorized action',
  );
  n++;

  assertResult(
    evaluator.evaluate({
      kind: 'EXTERNAL_CONTENT',
      contentRole: 'RETRIEVED',
      attemptsInstructionOverride: true,
    }).overall,
    'BLOCK',
    'external instruction override',
  );
  n++;

  assertResult(
    evaluator.evaluate({
      kind: 'REQUEST',
      privacyMode: 'LOCAL_ONLY',
      userExplicitLocalOnly: true,
      requestedRemoteSubstrate: true,
    }).overall,
    'BLOCK',
    'user local vs remote substrate conflict',
  );
  n++;

  assertResult(
    evaluator.evaluate({
      kind: 'MEMORY_WRITE',
      memoryPreferenceKey: 'prefer_remote',
      conflictsWithPrivacy: true,
    }).overall,
    'BLOCK',
    'memory vs privacy',
  );
  n++;

  assertResult(
    evaluator.evaluate({
      kind: 'RESPONSE',
      acknowledgesPriorError: true,
    }).overall,
    'PASS',
    'prior error correction',
  );
  n++;

  assertResult(
    evaluator.evaluate({
      kind: 'RESPONSE',
      provenanceAvailable: false,
    }).overall,
    'WARN',
    'provenance unavailable',
  );
  n++;

  assertResult(
    evaluator.evaluate({
      kind: 'RESPONSE',
      provenanceAvailable: true,
    }).overall,
    'PASS',
    'provenance available',
  );
  n++;

  assertResult(
    evaluator.evaluate({
      kind: 'RESPONSE',
      claimedCapabilities: [TAU_CAPABILITIES.CODE],
      availableCapabilities: [],
    }).overall,
    'BLOCK',
    'model capability unavailable',
  );
  n++;

  assertResult(
    evaluator.evaluate({
      kind: 'RESPONSE',
      claimsVerifiedFact: true,
      hasEvidence: false,
    }).overall,
    'BLOCK',
    'fabricated verified fact',
  );
  n++;

  assertResult(
    evaluator.evaluate({
      kind: 'ROUTING',
      privacyMode: 'LOCAL_ONLY',
      selectedSubstratePrivacyClass: 'REMOTE',
    }).overall,
    'BLOCK',
    'routing remote under LOCAL_ONLY',
  );
  n++;

  const routingPolicy = evaluateConstitutionalRouting({
    privacyMode: 'LOCAL_ONLY',
    selectedSubstratePrivacyClass: 'LOCAL',
    userRequestedLocalOnly: true,
  });
  assert(!routingPolicy.blocked, 'constitutional routing allows local');
  n++;

  const privacyMode = derivePrivacyModeFromRequest({
    messages: [{ role: 'user', content: 'keep local' }],
    options: { privacyMode: true },
  });
  assert(privacyMode === 'LOCAL_ONLY', 'derive LOCAL_ONLY from request');
  n++;

  assert(constitution.version === TAU_CONSTITUTION_VERSION, 'constitution version');
  n++;

  assert(constitution.principles.length === 10, 'ten principles');
  n++;

  const fragment = constitution.buildContextFragment('LOCAL_ONLY');
  assert(fragment.constitutionVersion === TAU_CONSTITUTION_VERSION, 'fragment version');
  assert(fragment.constraints.some((c) => c.includes('LOCAL_ONLY')), 'local constraint');
  n++;

  console.log(`PASS  AI-4 constitution matrix (${n} scenarios)`);
}

main();
