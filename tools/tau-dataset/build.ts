/**
 * TF-1 — Build manifest, splits, and validation report for Tau Dataset v0.1.
 */

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DATASET_VERSION, SCHEMA_VERSION } from './constants';
import { buildGoldSeedRecords } from './seed/gold-records';
import type { TauDatasetRecord } from './schema';
import {
  countByCategory,
  countByLicenseStatus,
  countByProvenanceType,
  countBySplit,
  validateDataset,
} from './validate';

export type DatasetManifest = {
  datasetVersion: typeof DATASET_VERSION;
  schemaVersion: typeof SCHEMA_VERSION;
  validationVersion: string;
  generatedAt: string;
  recordCounts: {
    total: number;
    train: number;
    validation: number;
    test: number;
  };
  categoryCounts: Record<string, number>;
  provenanceCounts: Record<string, number>;
  licenseCounts: Record<string, number>;
  contentHash: string;
  provenanceSummary: {
    tauCreated: number;
    synthetic: number;
    thirdParty: number;
    requiresLegalReview: number;
  };
  validationStatus: 'PASS' | 'FAIL';
  sources: string[];
};

function sha256(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

function toJsonl(records: TauDatasetRecord[]): string {
  return records.map((r) => JSON.stringify(r)).join('\n') + '\n';
}

function loadJsonlDir(dir: string): TauDatasetRecord[] {
  if (!existsSync(dir)) return [];
  const files = readdirSync(dir).filter((f) => f.endsWith('.jsonl'));
  const records: TauDatasetRecord[] = [];
  for (const file of files) {
    const lines = readFileSync(join(dir, file), 'utf8').split('\n').filter(Boolean);
    for (const line of lines) {
      records.push(JSON.parse(line) as TauDatasetRecord);
    }
  }
  return records;
}

function loadJsonlFile(path: string): TauDatasetRecord[] {
  if (!existsSync(path)) return [];
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as TauDatasetRecord);
}

export function buildDataset(root: string): {
  manifest: DatasetManifest;
  reportPath: string;
} {
  const goldDir = join(root, 'curated', 'gold');
  mkdirSync(goldDir, { recursive: true });

  const seedPath = join(goldDir, 'seed-authors.jsonl');
  const existingSeed = loadJsonlFile(seedPath);
  const seedRecords = existingSeed.length > 0 ? existingSeed : buildGoldSeedRecords();
  if (existingSeed.length === 0) {
    writeFileSync(seedPath, toJsonl(seedRecords));
  }

  const pendingSynthetic = loadJsonlDir(join(root, 'curated', 'synthetic'));
  const eligible = [...seedRecords, ...pendingSynthetic.filter((r) => r.provenance.reviewStatus !== 'REJECTED')];

  const { records, report } = validateDataset(eligible, { assignSplits: true });
  if (!report.passed) {
    throw new Error(`Dataset validation failed with ${report.errorCount} errors`);
  }

  const train = records.filter((r) => r.split === 'train');
  const validation = records.filter((r) => r.split === 'validation');
  const test = records.filter((r) => r.split === 'test');

  for (const [name, subset] of [
    ['train', train],
    ['validation', validation],
    ['test', test],
  ] as const) {
    mkdirSync(join(root, name), { recursive: true });
    writeFileSync(join(root, name, `${DATASET_VERSION}.jsonl`), toJsonl(subset));
  }

  const contentHash = sha256(toJsonl(records));
  const manifest: DatasetManifest = {
    datasetVersion: DATASET_VERSION,
    schemaVersion: SCHEMA_VERSION,
    validationVersion: report.validationVersion,
    generatedAt: new Date().toISOString(),
    recordCounts: {
      total: records.length,
      train: train.length,
      validation: validation.length,
      test: test.length,
    },
    categoryCounts: countByCategory(records),
    provenanceCounts: countByProvenanceType(records),
    licenseCounts: countByLicenseStatus(records),
    contentHash,
    provenanceSummary: {
      tauCreated: records.filter((r) => r.provenance.type === 'TAU_CREATED').length,
      synthetic: records.filter((r) => r.provenance.synthetic).length,
      thirdParty: records.filter(
        (r) => r.provenance.type === 'THIRD_PARTY_LICENSED' || r.provenance.type === 'THIRD_PARTY_TRANSFORMED',
      ).length,
      requiresLegalReview: records.filter(
        (r) => r.provenance.legalStatus === 'REQUIRES_LEGAL_REVIEW' || r.license.status === 'REQUIRES_LEGAL_REVIEW',
      ).length,
    },
    validationStatus: 'PASS',
    sources: ['curated/gold/seed-authors.jsonl', ...pendingSynthetic.length ? ['curated/synthetic/'] : []],
  };

  mkdirSync(join(root, 'manifests'), { recursive: true });
  mkdirSync(join(root, 'reports'), { recursive: true });
  mkdirSync(join(root, 'provenance'), { recursive: true });

  writeFileSync(join(root, 'manifests', `${DATASET_VERSION}.json`), JSON.stringify(manifest, null, 2) + '\n');
  const reportPath = join(root, 'reports', `${DATASET_VERSION}-validation.json`);
  writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');

  writeFileSync(
    join(root, 'provenance', 'registry.yaml'),
    `# TF-1 provenance registry — ${DATASET_VERSION}\n` +
      `generatedAt: ${manifest.generatedAt}\n` +
      `contentHash: ${contentHash}\n` +
      `sources:\n${manifest.sources.map((s) => `  - ${s}`).join('\n')}\n`,
  );

  return { manifest, reportPath };
}
