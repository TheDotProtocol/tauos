/**
 * Compile-time interface satisfaction checks for AI-1 verification.
 * Not exported from the public package surface.
 */

import type { Constitution } from '../src/constitution/constitution';
import type { IntelligenceService } from '../src/core/intelligence';
import type { ExecutionAdapter, ExecutionAdapterRegistry } from '../src/execution/adapter';
import type { MemoryStore } from '../src/memory/store';
import type { ModelSubstrate, ModelSubstrateRegistry } from '../src/models/substrate';
import type { ModelRouter } from '../src/routing/router';
import type { ToolRegistry, TauTool } from '../src/tools/registry';
import type { TauAIClient } from '../src/client/tau-ai-client';

/** Ensures all seven core contracts are structurally present. */
type CoreContracts = {
  intelligence: IntelligenceService;
  memory: MemoryStore;
  router: ModelRouter;
  constitution: Constitution;
  tools: ToolRegistry;
  execution: ExecutionAdapter;
  client: TauAIClient;
};

/** Secondary contracts referenced by the architecture. */
type SupportingContracts = {
  substrate: ModelSubstrate;
  substrateRegistry: ModelSubstrateRegistry;
  executionRegistry: ExecutionAdapterRegistry;
  tool: TauTool;
};

declare const _contracts: CoreContracts;
declare const _supporting: SupportingContracts;

void _contracts;
void _supporting;

export {};
