"""Training gate — fail closed before any training run."""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from .constants import BLOCKED_LICENSE_STATUSES, BLOCKED_PROVENANCE_TYPES

DATASET_VERSION = "tau-dataset-v0.1"


@dataclass
class GateResult:
    passed: bool
    reasons: list[str]

    def raise_if_blocked(self) -> None:
        if not self.passed:
            raise TrainingGateError("\n".join(f"- {r}" for r in self.reasons))


class TrainingGateError(Exception):
    """Training refused by governed gate."""


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.strip():
            records.append(json.loads(line))
    return records


def load_manifest(dataset_root: Path) -> dict[str, Any]:
    manifest_path = dataset_root / "manifests" / f"{DATASET_VERSION}.json"
    if not manifest_path.exists():
        raise TrainingGateError(f"Dataset manifest missing: {manifest_path}")
    return json.loads(manifest_path.read_text(encoding="utf-8"))


def validate_record_provenance(record: dict[str, Any], reasons: list[str], prefix: str) -> None:
    record_id = record.get("id", "unknown")
    provenance = record.get("provenance") or {}
    license_block = record.get("license") or {}

    ptype = provenance.get("type")
    if ptype in BLOCKED_PROVENANCE_TYPES:
        reasons.append(f"{prefix} record {record_id}: provenance.type={ptype} is blocked")
    if provenance.get("reviewStatus") == "REJECTED":
        reasons.append(f"{prefix} record {record_id}: reviewStatus=REJECTED")
    if license_block.get("status") in BLOCKED_LICENSE_STATUSES:
        reasons.append(f"{prefix} record {record_id}: license.status={license_block.get('status')}")
    if not provenance.get("source"):
        reasons.append(f"{prefix} record {record_id}: missing provenance.source")
    if not provenance.get("creationMethod"):
        reasons.append(f"{prefix} record {record_id}: missing provenance.creationMethod")


def run_training_gate(
    dataset_root: Path,
    *,
    expected_manifest_hash: str | None = None,
    split: str = "train",
) -> GateResult:
    reasons: list[str] = []

    manifest = load_manifest(dataset_root)
    if manifest.get("validationStatus") != "PASS":
        reasons.append(f"Dataset validationStatus is not PASS: {manifest.get('validationStatus')}")
    if manifest.get("datasetVersion") != DATASET_VERSION:
        reasons.append(f"Unexpected datasetVersion: {manifest.get('datasetVersion')}")

    content_hash = manifest.get("contentHash")
    if expected_manifest_hash and content_hash != expected_manifest_hash:
        reasons.append(
            f"Manifest hash mismatch: expected {expected_manifest_hash}, got {content_hash}",
        )
    if not content_hash:
        reasons.append("Dataset manifest missing contentHash")

    split_path = dataset_root / split / f"{DATASET_VERSION}.jsonl"
    test_path = dataset_root / "test" / f"{DATASET_VERSION}.jsonl"
    if not split_path.exists():
        reasons.append(f"Missing split file: {split_path}")
        return GateResult(passed=False, reasons=reasons)

    train_records = load_jsonl(split_path)
    test_records = load_jsonl(test_path) if test_path.exists() else []
    test_ids = {r["id"] for r in test_records if "id" in r}
    test_inputs = {r.get("input", "").strip().lower() for r in test_records}

    if split == "train" and len(train_records) == 0:
        reasons.append("Train split is empty")

    for record in train_records:
        validate_record_provenance(record, reasons, split)
        rid = record.get("id")
        if rid in test_ids:
            reasons.append(f"TEST LEAKAGE: train record id {rid} appears in test split")
        inp = record.get("input", "").strip().lower()
        if inp and inp in test_inputs:
            reasons.append(f"TEST LEAKAGE: train input matches protected test prompt (id={rid})")
        if record.get("split") == "test":
            reasons.append(f"Record {rid} marked split=test inside train file")

    report_path = dataset_root / "reports" / f"{DATASET_VERSION}-validation.json"
    if report_path.exists():
        report = json.loads(report_path.read_text(encoding="utf-8"))
        if not report.get("passed", False):
            reasons.append("Dataset validation report passed=false")
        if report.get("errorCount", 0) > 0:
            reasons.append(f"Dataset validation report errorCount={report.get('errorCount')}")
    else:
        reasons.append(f"Missing validation report: {report_path}")

    return GateResult(passed=len(reasons) == 0, reasons=reasons)
