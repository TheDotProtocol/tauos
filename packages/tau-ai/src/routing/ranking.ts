/**
 * Deterministic substrate ranking (AI-3.2).
 *
 * Priority order (documented algorithm):
 * 1. Privacy compliance (already filtered)
 * 2. Capability compatibility (already filtered)
 * 3. Availability (already filtered)
 * 4. Hardware compatibility (already filtered — AI-3.3)
 * 5. Explicit user preferred substrate
 * 5. Local preference (PREFER_LOCAL or user preferLocal)
 * 6. Cost preference
 * 7. Latency preference
 * 8. Stable substrate priority (lower number wins)
 * 9. Lexicographic substrate ID tie-break
 */

import type { CostClass, LatencyClass } from '../models/metadata';
import type { HardwareCompatibility } from '../hardware/types';
import type {
  CostPreference,
  LatencyPreference,
  PrivacyMode,
  RoutableSubstrate,
  SelectionReasonCode,
  UserRoutingPreferences,
} from './routing-types';
import { isLocalSubstrate } from './filters';

const COST_ORDER: Record<CostClass, number> = {
  FREE: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  UNKNOWN: 4,
};

const LATENCY_ORDER: Record<LatencyClass, number> = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
  UNKNOWN: 3,
};

export type RankedSubstrate = {
  entry: RoutableSubstrate;
  selectionReasons: SelectionReasonCode[];
  sortKey: string;
};

export function rankEligibleSubstrates(
  eligible: RoutableSubstrate[],
  privacyMode: PrivacyMode,
  userPreferences?: UserRoutingPreferences,
  hardwareCompatibilityById?: Map<string, HardwareCompatibility>,
): RankedSubstrate[] {
  const preferLocal =
    privacyMode === 'PREFER_LOCAL' ||
    userPreferences?.preferLocal === true;

  const costPref = userPreferences?.costPreference ?? 'ANY';
  const latencyPref = userPreferences?.latencyPreference ?? 'ANY';

  const ranked = eligible.map((entry) => {
    const reasons: SelectionReasonCode[] = [
      'CAPABILITY_MATCH',
      'PRIVACY_COMPLIANT',
      'AVAILABLE',
    ];

    const hw = hardwareCompatibilityById?.get(entry.substrate.id) ?? 'UNKNOWN';
    if (hw === 'COMPATIBLE') reasons.push('HARDWARE_COMPATIBLE');
    else reasons.push('HARDWARE_COMPATIBILITY_UNKNOWN');

    let userPrefRank = 1;
    if (
      userPreferences?.preferredSubstrateId &&
      entry.substrate.id === userPreferences.preferredSubstrateId
    ) {
      userPrefRank = 0;
      reasons.push('USER_PREFERRED_SUBSTRATE');
    }

    let localRank = 1;
    if (preferLocal && isLocalSubstrate(entry)) {
      localRank = 0;
      reasons.push('PREFER_LOCAL');
    }

    const costRank =
      costPref === 'PREFER_FREE' || costPref === 'PREFER_LOW'
        ? COST_ORDER[entry.substrate.metadata.costClass]
        : 0;
    if (costPref !== 'ANY') reasons.push('COST_PREFERENCE');

    const latencyRank =
      latencyPref === 'PREFER_LOW'
        ? LATENCY_ORDER[entry.substrate.metadata.latencyClass]
        : 0;
    if (latencyPref !== 'ANY') reasons.push('LATENCY_PREFERENCE');

    reasons.push('STABLE_PRIORITY', 'STABLE_ID_TIEBREAK');

    const sortKey = [
      userPrefRank,
      localRank,
      costRank,
      latencyRank,
      entry.priority,
      entry.substrate.id,
    ].join('|');

    return { entry, selectionReasons: reasons, sortKey };
  });

  ranked.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  return ranked;
}

export function buildSelectionSummary(
  substrateId: string,
  reasons: SelectionReasonCode[],
): string {
  return `Selected: ${substrateId}. Reason: ${reasons.join(' + ')}`;
}
