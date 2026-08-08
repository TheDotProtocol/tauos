/**
 * TF-1 — Deterministic Tau Dataset validation (no LLM judge).
 */

import { createHash } from 'node:crypto';
import {
  DATASET_VERSION,
  SCHEMA_VERSION,
  SECRET_PATTERNS,
  SPLIT_POLICY,
  type DatasetCategory,
  type DatasetSplit,
} from './constants';
import type { TauDatasetRecord, ValidationIssue, ValidationReport } from './schema';
import {
  isConstitutionalPrinciple,
  isDatasetCategory,
  isDatasetSplit,
  isLicenseStatus,
  isProvenanceType,
  isReviewStatus,
} from './schema';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function issue(
  level: ValidationIssue['level'],
  code: string,
  message: string,
  recordId?: string,
): ValidationIssue {
  return { level, code, recordId, message };
}

function contentFingerprint(record: TauDatasetRecord): string {
  const payload = `${record.input}\n---\n${record.output}`.trim().toLowerCase();
  return createHash('sha256').update(payload).digest('hex');
}

export function assignSplit(recordId: string): DatasetSplit {
  const hash = createHash('sha256').update(recordId).digest();
  const bucket = hash.readUInt16BE(0) % SPLIT_POLICY.hashMod;
  if (bucket <= SPLIT_POLICY.testMaxBucket) return 'test';
  if (bucket <= SPLIT_POLICY.validationMaxBucket) return 'validation';
  return 'train';
}

function scanSecrets(text: string): boolean {
  return SECRET_PATTERNS.some((pattern) => pattern.test(text));
}

export function validateRecord(record: TauDatasetRecord, index: number): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const id = record.id || `index:${index}`;

  if (!record.id || !UUID_RE.test(record.id)) {
    issues.push(issue('error', 'INVALID_ID', 'id must be UUID v4', id));
  }
  if (record.datasetVersion !== DATASET_VERSION) {
    issues.push(issue('error', 'INVALID_DATASET_VERSION', `datasetVersion must be ${DATASET_VERSION}`, id));
  }
  if (record.schemaVersion !== SCHEMA_VERSION) {
    issues.push(issue('error', 'INVALID_SCHEMA_VERSION', `schemaVersion must be ${SCHEMA_VERSION}`, id));
  }
  if (!isDatasetCategory(record.category)) {
    issues.push(issue('error', 'INVALID_CATEGORY', `invalid category: ${record.category}`, id));
  }
  if (!record.taskType?.trim()) {
    issues.push(issue('error', 'MISSING_TASK_TYPE', 'taskType is required', id));
  }
  if (!record.input?.trim()) {
    issues.push(issue('error', 'EMPTY_INPUT', 'input must not be empty', id));
  }
  if (!record.output?.trim()) {
    issues.push(issue('error', 'EMPTY_OUTPUT', 'output must not be empty', id));
  }

  if (!record.metadata) {
    issues.push(issue('error', 'MISSING_METADATA', 'metadata is required', id));
  } else {
    if (!record.metadata.language?.trim()) {
      issues.push(issue('error', 'MISSING_LANGUAGE', 'metadata.language is required', id));
    }
    if (record.metadata.modality !== 'text') {
      issues.push(issue('error', 'INVALID_MODALITY', 'only text modality in v0.1', id));
    }
    if (!['low', 'medium', 'high'].includes(record.metadata.difficulty)) {
      issues.push(issue('error', 'INVALID_DIFFICULTY', 'metadata.difficulty invalid', id));
    }
    for (const tag of record.metadata.constitutionalTags ?? []) {
      if (!isConstitutionalPrinciple(tag)) {
        issues.push(issue('error', 'INVALID_CONSTITUTION_TAG', `unknown principle: ${tag}`, id));
      }
    }
  }

  if (!record.provenance) {
    issues.push(issue('error', 'MISSING_PROVENANCE', 'provenance is required', id));
  } else {
    if (!isProvenanceType(record.provenance.type)) {
      issues.push(issue('error', 'INVALID_PROVENANCE_TYPE', `invalid type: ${record.provenance.type}`, id));
    }
    if (record.provenance.type === 'UNKNOWN') {
      issues.push(issue('error', 'UNKNOWN_PROVENANCE', 'UNKNOWN provenance cannot enter dataset', id));
    }
    if (!record.provenance.source?.trim()) {
      issues.push(issue('error', 'MISSING_PROVENANCE_SOURCE', 'provenance.source is required', id));
    }
    if (!record.provenance.creationMethod?.trim()) {
      issues.push(issue('error', 'MISSING_CREATION_METHOD', 'provenance.creationMethod is required', id));
    }
    if (!isReviewStatus(record.provenance.reviewStatus)) {
      issues.push(issue('error', 'INVALID_REVIEW_STATUS', 'invalid reviewStatus', id));
    }
    if (record.provenance.reviewStatus === 'REJECTED') {
      issues.push(issue('error', 'REJECTED_RECORD', 'rejected records must not ship', id));
    }
    if (!isLicenseStatus(record.provenance.licenseStatus)) {
      issues.push(issue('error', 'INVALID_LICENSE_STATUS', 'invalid provenance.licenseStatus', id));
    }
    if (record.provenance.licenseStatus === 'NOT_PERMITTED') {
      issues.push(issue('error', 'NOT_PERMITTED', 'record marked NOT_PERMITTED', id));
    }
    if (record.provenance.synthetic && record.provenance.type !== 'TAU_SYNTHETIC') {
      issues.push(
        issue('error', 'SYNTHETIC_MISMATCH', 'synthetic=true requires provenance.type TAU_SYNTHETIC', id),
      );
    }
    if (record.provenance.type === 'TAU_SYNTHETIC' && !record.provenance.synthetic) {
      issues.push(issue('error', 'SYNTHETIC_FLAG', 'TAU_SYNTHETIC requires synthetic=true', id));
    }
    if (record.provenance.type === 'TAU_SYNTHETIC' && !record.provenance.generatorModel) {
      issues.push(issue('warning', 'MISSING_GENERATOR', 'synthetic record should name generatorModel', id));
    }
    if (record.provenance.humanReviewed && record.provenance.reviewStatus === 'UNREVIEWED') {
      issues.push(issue('error', 'REVIEW_INCONSISTENT', 'humanReviewed=true requires REVIEWED status', id));
    }
  }

  if (!record.license) {
    issues.push(issue('error', 'MISSING_LICENSE', 'license block is required', id));
  } else if (!isLicenseStatus(record.license.status)) {
    issues.push(issue('error', 'INVALID_LICENSE_BLOCK', 'invalid license.status', id));
  }

  if (record.split && !isDatasetSplit(record.split)) {
    issues.push(issue('error', 'INVALID_SPLIT', `invalid split: ${record.split}`, id));
  }

  if (!record.createdAt || !record.updatedAt) {
    issues.push(issue('error', 'MISSING_TIMESTAMPS', 'createdAt and updatedAt required', id));
  }

  const blob = JSON.stringify(record);
  if (scanSecrets(blob)) {
    issues.push(issue('error', 'SECRET_DETECTED', 'possible secret/credential pattern detected', id));
  }

  return issues;
}

export type ValidateDatasetOptions = {
  assignSplits?: boolean;
};

export function validateDataset(
  records: TauDatasetRecord[],
  options: ValidateDatasetOptions = {},
): { records: TauDatasetRecord[]; report: ValidationReport } {
  const issues: ValidationIssue[] = [];
  const ids = new Set<string>();
  const fingerprints = new Map<string, string>();
  const splitInputs = new Map<string, string>();

  const normalized = records.map((record, index) => {
    const split = options.assignSplits ? assignSplit(record.id) : record.split;
    return { ...record, split };
  });

  for (const [index, record] of normalized.entries()) {
    issues.push(...validateRecord(record, index));

    if (ids.has(record.id)) {
      issues.push(issue('error', 'DUPLICATE_ID', `duplicate id: ${record.id}`, record.id));
    }
    ids.add(record.id);

    const fp = contentFingerprint(record);
    const prior = fingerprints.get(fp);
    if (prior) {
      issues.push(
        issue('warning', 'DUPLICATE_CONTENT', `duplicate content: ${record.id} matches ${prior}`, record.id),
      );
    } else {
      fingerprints.set(fp, record.id);
    }

    if (record.split === 'test') {
      splitInputs.set(record.input.trim().toLowerCase(), record.id);
    }
  }

  for (const record of normalized) {
    if (record.split !== 'test') {
      const key = record.input.trim().toLowerCase();
      const testId = splitInputs.get(key);
      if (testId) {
        issues.push(
          issue(
            'error',
            'TRAIN_TEST_LEAKAGE',
            `input overlaps test record ${testId}`,
            record.id,
          ),
        );
      }
    }
  }

  const errorCount = issues.filter((i) => i.level === 'error').length;
  const warningCount = issues.filter((i) => i.level === 'warning').length;

  return {
    records: normalized,
    report: {
      datasetVersion: DATASET_VERSION,
      schemaVersion: SCHEMA_VERSION,
      validationVersion: '1.0.0',
      recordCount: normalized.length,
      errorCount,
      warningCount,
      issues,
      passed: errorCount === 0,
    },
  };
}

export function countByCategory(records: TauDatasetRecord[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const record of records) {
    counts[record.category] = (counts[record.category] ?? 0) + 1;
  }
  return counts;
}

export function countBySplit(records: TauDatasetRecord[]): Record<DatasetSplit, number> {
  return records.reduce(
    (acc, record) => {
      const split = record.split ?? 'train';
      acc[split] = (acc[split] ?? 0) + 1;
      return acc;
    },
    { train: 0, validation: 0, test: 0 } as Record<DatasetSplit, number>,
  );
}

export function countByProvenanceType(records: TauDatasetRecord[]): Record<string, number> {
  return records.reduce<Record<string, number>>((acc, record) => {
    acc[record.provenance.type] = (acc[record.provenance.type] ?? 0) + 1;
    return acc;
  }, {});
}

export function countByLicenseStatus(records: TauDatasetRecord[]): Record<string, number> {
  return records.reduce<Record<string, number>>((acc, record) => {
    acc[record.license.status] = (acc[record.license.status] ?? 0) + 1;
    return acc;
  }, {});
}
