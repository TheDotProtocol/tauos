#!/usr/bin/env npx tsx
/**
 * TF-1 — Build Tau Dataset v0.1 artifacts.
 * Run: npx tsx scripts/build-tau-dataset-v01.ts
 */

import { join } from 'node:path';
import { buildDataset } from '../tools/tau-dataset/build';

const ROOT = join(__dirname, '..', 'datasets', 'tau-foundation', 'v0.1');

console.log('=== TF-1 Build Tau Dataset v0.1 ===');

const { manifest, reportPath } = buildDataset(ROOT);

console.log(`PASS  records: ${manifest.recordCounts.total}`);
console.log(`      train: ${manifest.recordCounts.train}`);
console.log(`      validation: ${manifest.recordCounts.validation}`);
console.log(`      test: ${manifest.recordCounts.test}`);
console.log(`      hash: ${manifest.contentHash.slice(0, 16)}...`);
console.log(`      report: ${reportPath}`);
console.log('=== TF-1 build complete ===');
