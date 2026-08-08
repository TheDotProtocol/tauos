/**
 * TF-1 — Tau Dataset v0.1 constants.
 */

export const DATASET_VERSION = 'tau-dataset-v0.1' as const;
export const SCHEMA_VERSION = '1.0.0' as const;

export const DATASET_CATEGORIES = [
  'GENERAL_INSTRUCTION',
  'REASONING',
  'CODING',
  'TOOL_USE',
  'PLANNING',
  'MEMORY_CONTEXT',
  'TRUTHFULNESS',
  'UNCERTAINTY',
  'PROVENANCE',
  'PRIVACY',
  'SECURITY',
  'CORRECTION',
  'CONSTITUTIONAL_BEHAVIOR',
  'TAU_ECOSYSTEM',
  'CONVERSATIONAL',
  'EXECUTIVE_DECISION',
  'MULTILINGUAL',
  'FUTURE_MULTIMODAL',
] as const;

export type DatasetCategory = (typeof DATASET_CATEGORIES)[number];

export const PROVENANCE_TYPES = [
  'TAU_CREATED',
  'THIRD_PARTY_LICENSED',
  'THIRD_PARTY_TRANSFORMED',
  'TAU_SYNTHETIC',
  'EXTERNAL_DATA',
  'UNKNOWN',
] as const;

export type ProvenanceType = (typeof PROVENANCE_TYPES)[number];

export const LICENSE_STATUSES = [
  'CLEAR',
  'UNKNOWN',
  'REQUIRES_LEGAL_REVIEW',
  'RESTRICTED',
  'NOT_PERMITTED',
] as const;

export type LicenseStatus = (typeof LICENSE_STATUSES)[number];

export const REVIEW_STATUSES = ['UNREVIEWED', 'REVIEWED', 'REJECTED'] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export const DATASET_SPLITS = ['train', 'validation', 'test'] as const;
export type DatasetSplit = (typeof DATASET_SPLITS)[number];

export const CONSTITUTIONAL_PRINCIPLES = [
  'TRUTHFULNESS',
  'UNCERTAINTY',
  'TRANSPARENCY',
  'USER_AUTONOMY',
  'PRIVACY',
  'SECURITY',
  'PROVENANCE',
  'CORRECTION',
  'CAPABILITY_HONESTY',
  'INSTRUCTION_HIERARCHY',
] as const;

export type ConstitutionalPrinciple = (typeof CONSTITUTIONAL_PRINCIPLES)[number];

/** Recommended v0.1 gold distribution (Phase A target ~120–250) */
export const RECOMMENDED_CATEGORY_WEIGHTS: Record<DatasetCategory, number> = {
  CONSTITUTIONAL_BEHAVIOR: 0.18,
  TOOL_USE: 0.1,
  TAU_ECOSYSTEM: 0.1,
  PRIVACY: 0.07,
  SECURITY: 0.07,
  TRUTHFULNESS: 0.06,
  UNCERTAINTY: 0.06,
  PROVENANCE: 0.05,
  CORRECTION: 0.05,
  GENERAL_INSTRUCTION: 0.08,
  REASONING: 0.07,
  CODING: 0.08,
  PLANNING: 0.05,
  MEMORY_CONTEXT: 0.05,
  CONVERSATIONAL: 0.04,
  EXECUTIVE_DECISION: 0.03,
  MULTILINGUAL: 0.02,
  FUTURE_MULTIMODAL: 0.0,
};

/** Split policy: deterministic hash bucket on record id */
export const SPLIT_POLICY = {
  testMaxBucket: 4,
  validationMaxBucket: 9,
  hashMod: 100,
} as const;

export const SECRET_PATTERNS = [
  /sk-[a-zA-Z0-9]{20,}/,
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN (RSA |EC )?PRIVATE KEY-----/,
  /\bapi[_-]?key\s*[:=]\s*['"][a-zA-Z0-9_-]{16,}/i,
  /\bpassword\s*[:=]\s*['"][^'"]{4,}/i,
  /\bBearer\s+[a-zA-Z0-9._-]{20,}/,
] as const;
