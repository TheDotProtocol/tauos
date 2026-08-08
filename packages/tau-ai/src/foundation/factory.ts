/**
 * Factory for Tau Foundation pipeline with default governed layers (AI-8).
 */

import { createDefaultCapabilityRegistry } from '../capabilities/defaults';
import { createTauConstitutionV01 } from '../constitution/tau-constitution-v01';
import { createGovernedExecutionExecutor } from '../execution/executor';
import { createExecutionAdapterRegistry } from '../execution/registry-impl';
import { registerTestExecutionAdapters } from '../execution/test-adapters';
import { createDefaultHardwareDetector } from '../hardware/detector';
import { createInMemoryGovernedMemoryStore } from '../memory/in-memory-store';
import { createTauFoundationSubstrateStub } from '../models/tau-foundation-substrate';
import { createDeterministicModelRouter } from '../routing/deterministic-router';
import type { RoutableSubstrate } from '../routing/routing-types';
import { createGovernedToolExecutor } from '../tools/executor';
import { createToolRegistry } from '../tools/registry-impl';
import { registerTestTools } from '../tools/test-tools';
import { createTauFoundationPipeline, type TauFoundationPipeline } from './pipeline';
import type { TauFoundationPipelineDeps } from './types';
import type { IntelligenceService } from '../core/intelligence';

export type CreateFoundationPipelineOptions = {
  substrates?: RoutableSubstrate[];
  intelligence?: IntelligenceService;
  includeTestTools?: boolean;
  includeTestExecutionAdapters?: boolean;
};

/** Build test/gateway substrates including tau-foundation placeholder. */
export function buildDefaultTestSubstrates(extra: RoutableSubstrate[] = []): RoutableSubstrate[] {
  const tauFoundation = createTauFoundationSubstrateStub();
  return [
    ...extra,
    { substrate: tauFoundation, priority: 100 },
  ].sort((a, b) => a.priority - b.priority);
}

export function createDefaultFoundationPipeline(
  options: CreateFoundationPipelineOptions = {},
): TauFoundationPipeline {
  const memory = createInMemoryGovernedMemoryStore({
    constitution: createTauConstitutionV01(),
  });
  const constitution = createTauConstitutionV01();
  const toolRegistry = createToolRegistry();
  const executionRegistry = createExecutionAdapterRegistry();

  if (options.includeTestTools !== false) {
    registerTestTools(toolRegistry);
  }
  if (options.includeTestExecutionAdapters !== false) {
    registerTestExecutionAdapters(executionRegistry);
  }

  void createDefaultCapabilityRegistry();

  const deps: TauFoundationPipelineDeps = {
    memory,
    constitution,
    router: createDeterministicModelRouter(),
    toolExecutor: createGovernedToolExecutor({ registry: toolRegistry, constitution }),
    executionExecutor: createGovernedExecutionExecutor({ registry: executionRegistry, constitution }),
    toolRegistry,
    executionRegistry,
    substrates: options.substrates ?? buildDefaultTestSubstrates(),
    intelligence: options.intelligence,
    hardwareDetector: createDefaultHardwareDetector(),
  };

  return createTauFoundationPipeline(deps);
}
