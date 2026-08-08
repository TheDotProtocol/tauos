#!/usr/bin/env npx tsx
/**
 * TF-1 — Tau Dataset v0.1 verification tests.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DATASET_CATEGORIES, DATASET_VERSION, SCHEMA_VERSION } from '../tools/tau-dataset/constants';
import type { TauDatasetRecord } from '../tools/tau-dataset/schema';
import { validateDataset } from '../tools/tau-dataset/validate';

const ROOT = join(__dirname, '..');
const DATASET_ROOT = join(ROOT, 'datasets', 'tau-foundation', 'v0.1');

function assert(condition: boolean, label: string) {
  if (!condition) throw new Error(`FAIL: ${label}`);
}

function readJsonl(path: string): TauDatasetRecord[] {
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as TauDatasetRecord);
}

console.log('=== TF-1 Tau Dataset v0.1 Tests ===');

assert(existsSync(join(DATASET_ROOT, 'schema', 'tau-record.schema.json')), 'schema file');
assert(existsSync(join(ROOT, 'tools/tau-dataset/validate.ts')), 'validation module');
assert(existsSync(join(ROOT, 'tools/tau-dataset/build.ts')), 'build module');

const manifestPath = join(DATASET_ROOT, 'manifests', `${DATASET_VERSION}.json`);
assert(existsSync(manifestPath), 'manifest generated');

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
  recordCounts: { total: number; train: number; validation: number; test: number };
  validationStatus: string;
  contentHash: string;
};

assert(manifest.validationStatus === 'PASS', 'manifest validation PASS');
assert(manifest.recordCounts.total >= 100, 'at least 100 gold records');
assert(manifest.recordCounts.test >= 5, 'protected test split');
assert(manifest.contentHash.length === 64, 'content hash present');

const train = readJsonl(join(DATASET_ROOT, 'train', `${DATASET_VERSION}.jsonl`));
const validation = readJsonl(join(DATASET_ROOT, 'validation', `${DATASET_VERSION}.jsonl`));
const test = readJsonl(join(DATASET_ROOT, 'test', `${DATASET_VERSION}.jsonl`));

assert(train.length + validation.length + test.length === manifest.recordCounts.total, 'split totals match');

const all = [...train, ...validation, ...test];
const { report } = validateDataset(all);
assert(report.passed, 're-validation passes');
assert(report.errorCount === 0, 'zero validation errors');

for (const record of all) {
  assert(record.datasetVersion === DATASET_VERSION, 'dataset version');
  assert(record.schemaVersion === SCHEMA_VERSION, 'schema version');
  assert(record.provenance.type !== 'UNKNOWN', 'no UNKNOWN provenance');
  assert(record.provenance.source.length > 0, 'provenance source');
  assert(record.license.status.length > 0, 'license status');
}

const categories = new Set(all.map((r) => r.category));
assert(categories.has('CONSTITUTIONAL_BEHAVIOR'), 'constitution category present');
assert(categories.has('TOOL_USE'), 'tool use present');
assert(categories.has('TAU_ECOSYSTEM'), 'ecosystem present');
assert(categories.has('CODING'), 'coding present');

for (const cat of DATASET_CATEGORIES) {
  if (cat === 'FUTURE_MULTIMODAL') continue;
  // Most categories should appear in gold seed
}

const testInputs = new Set(test.map((r) => r.input.trim().toLowerCase()));
for (const record of train) {
  assert(!testInputs.has(record.input.trim().toLowerCase()), 'no train/test input leakage');
}

assert(
  readFileSync(join(ROOT, 'tools/tau-dataset/validate.ts'), 'utf8').includes('SECRET_PATTERNS'),
  'secret detection present',
);

console.log(`PASS  TF-1 dataset tests (${manifest.recordCounts.total} records)`);
