/**
 * TF-1 — Canonical Tau Dataset record schema.
 */

import {
  CONSTITUTIONAL_PRINCIPLES,
  DATASET_CATEGORIES,
  DATASET_SPLITS,
  DATASET_VERSION,
  LICENSE_STATUSES,
  PROVENANCE_TYPES,
  REVIEW_STATUSES,
  SCHEMA_VERSION,
  type ConstitutionalPrinciple,
  type DatasetCategory,
  type DatasetSplit,
  type LicenseStatus,
  type ProvenanceType,
  type ReviewStatus,
} from './constants';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type TauDatasetProvenance = {
  type: ProvenanceType;
  source: string;
  transformation: 'NONE' | string;
  synthetic: boolean;
  creationMethod: string;
  generatorModel?: string | null;
  humanReviewed: boolean;
  reviewStatus: ReviewStatus;
  reviewer?: string | null;
  licenseStatus: LicenseStatus;
  legalStatus: 'VERIFIED' | 'UNKNOWN' | 'REQUIRES_LEGAL_REVIEW';
};

export type TauDatasetLicense = {
  spdx?: string | null;
  status: LicenseStatus;
  notes?: string;
};

export type TauDatasetMetadata = {
  language: string;
  modality: 'text';
  difficulty: 'low' | 'medium' | 'high';
  qualityScore?: number;
  safetyTags?: string[];
  constitutionalTags?: ConstitutionalPrinciple[];
  behaviorType?: 'good' | 'bad' | 'corrected' | 'uncertain';
  productContext?: 'taumail' | 'tau-developer' | 'tau-ai' | 'general' | null;
  taskSubtype?: string;
};

export type TauDatasetRecord = {
  id: string;
  datasetVersion: typeof DATASET_VERSION;
  schemaVersion: typeof SCHEMA_VERSION;
  category: DatasetCategory;
  taskType: string;
  input: string;
  output: string;
  systemContext?: string;
  messages?: ChatMessage[];
  metadata: TauDatasetMetadata;
  provenance: TauDatasetProvenance;
  license: TauDatasetLicense;
  split?: DatasetSplit;
  createdAt: string;
  updatedAt: string;
};

export type ValidationIssue = {
  level: 'error' | 'warning';
  code: string;
  recordId?: string;
  message: string;
};

export type ValidationReport = {
  datasetVersion: typeof DATASET_VERSION;
  schemaVersion: typeof SCHEMA_VERSION;
  validationVersion: '1.0.0';
  recordCount: number;
  errorCount: number;
  warningCount: number;
  issues: ValidationIssue[];
  passed: boolean;
};

export const SCHEMA_FIELD_PURPOSE: Record<string, string> = {
  id: 'Stable unique identifier (UUID v4)',
  datasetVersion: 'Dataset release identifier',
  schemaVersion: 'Record schema version for migrations',
  category: 'Taxonomy bucket for balancing and evaluation',
  taskType: 'Fine-grained task label within category',
  input: 'Primary user/task prompt (plain text)',
  output: 'Target assistant response (plain text)',
  systemContext: 'Optional system preamble for SFT formatting',
  messages: 'Optional multi-turn chat form for training export',
  metadata: 'Language, difficulty, constitution tags, product context',
  provenance: 'Origin, review, and legal classification',
  license: 'Permitted use status for this record',
  split: 'Assigned train/validation/test partition',
  createdAt: 'ISO8601 creation timestamp',
  updatedAt: 'ISO8601 last update timestamp',
};

export function isDatasetCategory(value: string): value is DatasetCategory {
  return (DATASET_CATEGORIES as readonly string[]).includes(value);
}

export function isProvenanceType(value: string): value is ProvenanceType {
  return (PROVENANCE_TYPES as readonly string[]).includes(value);
}

export function isLicenseStatus(value: string): value is LicenseStatus {
  return (LICENSE_STATUSES as readonly string[]).includes(value);
}

export function isReviewStatus(value: string): value is ReviewStatus {
  return (REVIEW_STATUSES as readonly string[]).includes(value);
}

export function isDatasetSplit(value: string): value is DatasetSplit {
  return (DATASET_SPLITS as readonly string[]).includes(value);
}

export function isConstitutionalPrinciple(value: string): value is ConstitutionalPrinciple {
  return (CONSTITUTIONAL_PRINCIPLES as readonly string[]).includes(value);
}
