/**
 * Deterministic Constitution evaluator (AI-4).
 *
 * Rule infrastructure only — not an AI judge.
 */

import {
  TAU_CONSTITUTION_VERSION,
  type ConstitutionalAuditRecord,
  type ConstitutionalEvaluation,
  type ConstitutionalEvaluationInput,
  type EvaluationResult,
  type RuleEvaluation,
} from './types';

function worstResult(results: EvaluationResult[]): EvaluationResult {
  if (results.some((r) => r === 'BLOCK')) return 'BLOCK';
  if (results.some((r) => r === 'WARN')) return 'WARN';
  return 'PASS';
}

function auditFromRule(rule: RuleEvaluation): ConstitutionalAuditRecord {
  return {
    constitutionVersion: TAU_CONSTITUTION_VERSION,
    rule: rule.rule,
    result: rule.result,
    reason: rule.reason,
    timestamp: new Date().toISOString(),
  };
}

function evaluateResponse(input: Extract<ConstitutionalEvaluationInput, { kind: 'RESPONSE' }>): RuleEvaluation[] {
  const rules: RuleEvaluation[] = [];

  if (input.claimsVerifiedFact && !input.hasEvidence) {
    rules.push({
      principle: 'TRUTHFULNESS',
      rule: 'no-fabricated-facts',
      result: 'BLOCK',
      reason: 'Verified fact claimed without evidence.',
    });
  } else if (input.claimsVerifiedFact && input.hasEvidence) {
    rules.push({
      principle: 'TRUTHFULNESS',
      rule: 'verified-fact-with-evidence',
      result: 'PASS',
      reason: 'Fact claim supported by evidence.',
    });
  } else {
    rules.push({
      principle: 'TRUTHFULNESS',
      rule: 'no-false-verified-claim',
      result: 'PASS',
      reason: 'No unsupported verified-fact claim.',
    });
  }

  if (input.informationComplete === false && !input.expressesUncertainty) {
    rules.push({
      principle: 'UNCERTAINTY',
      rule: 'express-uncertainty',
      result: 'WARN',
      reason: 'Incomplete information without expressed uncertainty.',
    });
  } else if (input.expressesUncertainty) {
    rules.push({
      principle: 'UNCERTAINTY',
      rule: 'uncertainty-acknowledged',
      result: 'PASS',
      reason: 'Uncertainty appropriately represented.',
    });
  } else {
    rules.push({
      principle: 'UNCERTAINTY',
      rule: 'information-complete-or-uncertain',
      result: 'PASS',
      reason: 'No missing uncertainty signal required.',
    });
  }

  if (input.claimsActionPerformed && input.actionActuallyPerformed === false) {
    rules.push({
      principle: 'TRANSPARENCY',
      rule: 'action-claim-matches-reality',
      result: 'BLOCK',
      reason: 'Action claimed but not performed.',
    });
  } else {
    rules.push({
      principle: 'TRANSPARENCY',
      rule: 'action-claim-matches-reality',
      result: 'PASS',
      reason: 'No false action claim.',
    });
  }

  const claimed = input.claimedCapabilities ?? [];
  const available = new Set(input.availableCapabilities ?? []);
  const unavailable = claimed.filter((c) => !available.has(c));
  if (unavailable.length > 0) {
    rules.push({
      principle: 'CAPABILITY_HONESTY',
      rule: 'claimed-capabilities-available',
      result: 'BLOCK',
      reason: `Claimed unavailable capabilities: ${unavailable.join(', ')}.`,
    });
  } else if (claimed.length > 0) {
    rules.push({
      principle: 'CAPABILITY_HONESTY',
      rule: 'claimed-capabilities-available',
      result: 'PASS',
      reason: 'Claimed capabilities are available.',
    });
  } else {
    rules.push({
      principle: 'CAPABILITY_HONESTY',
      rule: 'no-false-capability-claim',
      result: 'PASS',
      reason: 'No capability claims to verify.',
    });
  }

  if (input.citesFabricatedSource) {
    rules.push({
      principle: 'PROVENANCE',
      rule: 'no-fabricated-sources',
      result: 'BLOCK',
      reason: 'Fabricated source or citation detected.',
    });
  } else if (input.provenanceAvailable === false) {
    rules.push({
      principle: 'PROVENANCE',
      rule: 'provenance-when-available',
      result: 'WARN',
      reason: 'Provenance unavailable — do not invent sources.',
    });
  } else if (input.provenanceAvailable === true) {
    rules.push({
      principle: 'PROVENANCE',
      rule: 'provenance-present',
      result: 'PASS',
      reason: 'Provenance available and preserved.',
    });
  } else {
    rules.push({
      principle: 'PROVENANCE',
      rule: 'provenance-not-required',
      result: 'PASS',
      reason: 'No provenance claim in scope.',
    });
  }

  if (input.acknowledgesPriorError) {
    rules.push({
      principle: 'CORRECTION',
      rule: 'prior-error-acknowledged',
      result: 'PASS',
      reason: 'Prior error acknowledged — prior response does not bind truth.',
    });
  } else {
    rules.push({
      principle: 'CORRECTION',
      rule: 'correction-ready',
      result: 'PASS',
      reason: 'No correction conflict.',
    });
  }

  return rules;
}

function evaluateRequest(input: Extract<ConstitutionalEvaluationInput, { kind: 'REQUEST' }>): RuleEvaluation[] {
  const rules: RuleEvaluation[] = [];

  const privacyMode = input.privacyMode ?? (input.userExplicitLocalOnly ? 'LOCAL_ONLY' : 'REMOTE_ALLOWED');

  if (privacyMode === 'LOCAL_ONLY' && input.requestedRemoteSubstrate) {
    rules.push({
      principle: 'PRIVACY',
      rule: 'local-only-no-remote',
      result: 'BLOCK',
      reason: 'Remote substrate requested under LOCAL_ONLY privacy mode.',
    });
  } else if (privacyMode === 'LOCAL_ONLY') {
    rules.push({
      principle: 'PRIVACY',
      rule: 'local-only-respected',
      result: 'PASS',
      reason: 'LOCAL_ONLY request does not target remote substrate.',
    });
  } else {
    rules.push({
      principle: 'PRIVACY',
      rule: 'privacy-mode-respected',
      result: 'PASS',
      reason: 'Privacy mode allows requested operation.',
    });
  }

  return rules;
}

function evaluateTool(input: Extract<ConstitutionalEvaluationInput, { kind: 'TOOL_USE' }>): RuleEvaluation[] {
  const rules: RuleEvaluation[] = [];

  if (!input.toolRegistered) {
    rules.push({
      principle: 'CAPABILITY_HONESTY',
      rule: 'tool-must-exist',
      result: 'BLOCK',
      reason: `Tool "${input.toolName}" is not registered.`,
    });
  } else {
    rules.push({
      principle: 'CAPABILITY_HONESTY',
      rule: 'tool-registered',
      result: 'PASS',
      reason: 'Tool is registered.',
    });
  }

  if (!input.authorizationPresent) {
    rules.push({
      principle: 'USER_AUTONOMY',
      rule: 'tool-authorization-required',
      result: 'BLOCK',
      reason: 'Tool execution lacks authorization.',
    });
  } else {
    rules.push({
      principle: 'USER_AUTONOMY',
      rule: 'tool-authorized',
      result: 'PASS',
      reason: 'Tool authorization present.',
    });
  }

  if (input.requiresConfirmation && !input.confirmationPresent) {
    rules.push({
      principle: 'USER_AUTONOMY',
      rule: 'tool-confirmation-required',
      result: 'BLOCK',
      reason: 'Consequential tool action requires user confirmation.',
    });
  }

  if (input.scopeAllowed === false) {
    rules.push({
      principle: 'SECURITY',
      rule: 'tool-scope-allowed',
      result: 'BLOCK',
      reason: 'Tool action outside authorized scope.',
    });
  } else {
    rules.push({
      principle: 'SECURITY',
      rule: 'tool-scope-allowed',
      result: 'PASS',
      reason: 'Tool action within scope.',
    });
  }

  if (
    input.involvesProtectedData &&
    input.privacyMode === 'LOCAL_ONLY' &&
    input.createsExternalSideEffect
  ) {
    rules.push({
      principle: 'PRIVACY',
      rule: 'protected-data-local-only',
      result: 'BLOCK',
      reason: 'Protected data would leave local boundary under LOCAL_ONLY.',
    });
  } else if (input.involvesProtectedData && input.privacyMode === 'LOCAL_ONLY') {
    rules.push({
      principle: 'PRIVACY',
      rule: 'protected-data-local-only',
      result: 'PASS',
      reason: 'Protected data remains local.',
    });
  }

  return rules;
}

function evaluateRouting(input: Extract<ConstitutionalEvaluationInput, { kind: 'ROUTING' }>): RuleEvaluation[] {
  const rules: RuleEvaluation[] = [];

  if (
    input.privacyMode === 'LOCAL_ONLY' &&
    input.selectedSubstratePrivacyClass === 'REMOTE'
  ) {
    rules.push({
      principle: 'PRIVACY',
      rule: 'routing-local-only',
      result: 'BLOCK',
      reason: 'Remote substrate selected under LOCAL_ONLY — constitution blocks bypass.',
    });
  } else if (input.privacyMode === 'LOCAL_ONLY') {
    rules.push({
      principle: 'PRIVACY',
      rule: 'routing-local-only',
      result: 'PASS',
      reason: 'Routing respects LOCAL_ONLY.',
    });
  } else {
    rules.push({
      principle: 'PRIVACY',
      rule: 'routing-privacy-compliant',
      result: 'PASS',
      reason: 'Routing privacy mode satisfied.',
    });
  }

  if (input.userRequestedLocalOnly && input.selectedSubstratePrivacyClass === 'REMOTE') {
    rules.push({
      principle: 'INSTRUCTION_HIERARCHY',
      rule: 'user-local-preference-over-capability',
      result: 'BLOCK',
      reason: 'User local-only intent cannot be bypassed for a more capable remote model.',
    });
  }

  return rules;
}

function evaluateExternalContent(
  input: Extract<ConstitutionalEvaluationInput, { kind: 'EXTERNAL_CONTENT' }>,
): RuleEvaluation[] {
  const rules: RuleEvaluation[] = [];

  if (input.attemptsInstructionOverride) {
    rules.push({
      principle: 'INSTRUCTION_HIERARCHY',
      rule: 'external-content-not-governing',
      result: 'BLOCK',
      reason: 'External content attempted to override governing instructions.',
    });
    rules.push({
      principle: 'SECURITY',
      rule: 'untrusted-content-isolation',
      result: 'BLOCK',
      reason: 'Untrusted external content must not become governing instructions.',
    });
  } else if (input.contentRole === 'RETRIEVED' && input.markedUntrusted !== false) {
    rules.push({
      principle: 'SECURITY',
      rule: 'untrusted-content-isolation',
      result: 'PASS',
      reason: 'Retrieved content treated as untrusted — no override attempt.',
    });
    rules.push({
      principle: 'INSTRUCTION_HIERARCHY',
      rule: 'external-content-not-governing',
      result: 'PASS',
      reason: 'External content remains subordinate.',
    });
  } else {
    rules.push({
      principle: 'SECURITY',
      rule: 'content-trust-boundary',
      result: 'PASS',
      reason: 'No instruction override from external content.',
    });
  }

  return rules;
}

function evaluateMemory(input: Extract<ConstitutionalEvaluationInput, { kind: 'MEMORY_WRITE' }>): RuleEvaluation[] {
  const rules: RuleEvaluation[] = [];

  if (input.conflictsWithPrivacy) {
    rules.push({
      principle: 'INSTRUCTION_HIERARCHY',
      rule: 'memory-cannot-override-privacy',
      result: 'BLOCK',
      reason: 'Memory preference cannot override privacy policy.',
    });
  } else if (input.memoryPreferenceKey) {
    rules.push({
      principle: 'INSTRUCTION_HIERARCHY',
      rule: 'memory-subordinate-to-policy',
      result: 'PASS',
      reason: 'Memory write does not conflict with privacy policy.',
    });
  }

  if (input.conflictsWithSecurity) {
    rules.push({
      principle: 'INSTRUCTION_HIERARCHY',
      rule: 'memory-cannot-override-security',
      result: 'BLOCK',
      reason: 'Memory preference cannot override security policy.',
    });
  }

  return rules;
}

export interface ConstitutionEvaluator {
  evaluate(input: ConstitutionalEvaluationInput): ConstitutionalEvaluation;
}

export class DeterministicConstitutionEvaluator implements ConstitutionEvaluator {
  evaluate(input: ConstitutionalEvaluationInput): ConstitutionalEvaluation {
    let evaluations: RuleEvaluation[];

    switch (input.kind) {
      case 'RESPONSE':
        evaluations = evaluateResponse(input);
        break;
      case 'REQUEST':
        evaluations = evaluateRequest(input);
        break;
      case 'TOOL_USE':
        evaluations = evaluateTool(input);
        break;
      case 'ROUTING':
        evaluations = evaluateRouting(input);
        break;
      case 'EXTERNAL_CONTENT':
        evaluations = evaluateExternalContent(input);
        break;
      case 'MEMORY_WRITE':
        evaluations = evaluateMemory(input);
        break;
      default:
        evaluations = [];
    }

    const overall = worstResult(evaluations.map((e) => e.result));
    const auditRecords = evaluations.map(auditFromRule);

    return {
      constitutionVersion: TAU_CONSTITUTION_VERSION,
      overall,
      evaluations,
      auditRecords,
    };
  }
}

export function createConstitutionEvaluator(): ConstitutionEvaluator {
  return new DeterministicConstitutionEvaluator();
}
