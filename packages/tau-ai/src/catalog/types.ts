/**
 * Open model catalog types (AI-3.4).
 *
 * Distinguishes: MODEL FAMILY ≠ INFERENCE RUNTIME ≠ CONCRETE SUBSTRATE
 */

import type { CapabilityId } from '../capabilities/types';
import type { InferenceRequirements } from '../hardware/requirements';

export type CatalogVerificationLevel =
  | 'CATALOG_ONLY'
  | 'METADATA_VERIFIED'
  | 'ADAPTER_VERIFIED'
  | 'ROUTING_VERIFIED'
  | 'MODEL_LIVE_VERIFIED'
  | 'PERFORMANCE_VERIFIED'
  | 'PRODUCTION_READY';

export type InferenceRuntime = 'ollama' | 'vllm' | 'openrouter' | 'api' | 'unknown';

export type ModelFamilyCatalogEntry = {
  id: string;
  family: string;
  label: string;
  /** Example model identifiers — not installed. */
  exampleModelIds: string[];
  typicalCapabilities: CapabilityId[];
  inferenceRuntimes: InferenceRuntime[];
  license: string | 'UNKNOWN';
  inferenceRequirements: InferenceRequirements;
  verificationLevel: CatalogVerificationLevel;
  notes: string;
};

export type RuntimeCatalogEntry = {
  id: InferenceRuntime;
  label: string;
  role: 'INFERENCE_RUNTIME';
  inferenceRequirements: InferenceRequirements;
  verificationLevel: CatalogVerificationLevel;
  notes: string;
};

export type ConcreteSubstrateCatalogEntry = {
  id: string;
  label: string;
  role: 'CONCRETE_SUBSTRATE';
  family?: string;
  runtime?: InferenceRuntime;
  provider: string;
  inferenceRequirements: InferenceRequirements;
  verificationLevel: CatalogVerificationLevel;
  notes: string;
};

export type OpenModelCatalog = {
  families: ModelFamilyCatalogEntry[];
  runtimes: RuntimeCatalogEntry[];
  concreteSubstrates: ConcreteSubstrateCatalogEntry[];
};
