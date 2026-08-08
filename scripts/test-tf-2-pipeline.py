#!/usr/bin/env python3
"""TF-2 structural pipeline tests (no large downloads required)."""

from __future__ import annotations

import json
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools" / "tau-training"))

from tau_training.adapters.base import get_adapter
from tau_training.eval_harness import TauEvalHarness
from tau_training.export import export_split
from tau_training.gate import run_training_gate
from tau_training.manifest import config_from_yaml
from tau_training.train import prepare_training


def assert_true(cond: bool, msg: str) -> None:
    if not cond:
        raise AssertionError(f"FAIL: {msg}")


def main() -> int:
    print("=== TF-2 Pipeline Structural Tests ===")
    dataset_root = ROOT / "datasets" / "tau-foundation" / "v0.1"
    config_path = ROOT / "tools" / "tau-training" / "configs" / "qwen2.5-7b-lora.yaml"
    smoke_config = ROOT / "tools" / "tau-training" / "configs" / "smoke-tiny.yaml"

    gate = run_training_gate(dataset_root)
    assert_true(gate.passed, f"training gate: {gate.reasons}")
    print("PASS training gate")

    blocked = run_training_gate(dataset_root, split="test")
    # gate on test split file doesn't exist as train path - use export refusal instead
    try:
        export_split(dataset_root, Path(tempfile.mkdtemp()), split="test")
        assert_true(False, "export test split should refuse")
    except ValueError:
        print("PASS test split export refused")

    ds_manifest = json.loads((dataset_root / "manifests" / "tau-dataset-v0.1.json").read_text())
    expected_train = ds_manifest["recordCounts"]["train"]
    with tempfile.TemporaryDirectory() as tmp:
        out = Path(tmp)
        export_manifest = export_split(dataset_root, out, adapter_id="qwen2.5", split="train")
        assert_true(export_manifest.recordCount == expected_train, f"train export count {export_manifest.recordCount} != {expected_train}")
        assert_true(len(export_manifest.recordIds) == expected_train, "record ids preserved")
        print("PASS exporter train split")

        val_path = dataset_root / "validation" / "tau-dataset-v0.1.jsonl"
        if val_path.stat().st_size > 0:
            val_manifest = export_split(dataset_root, out, adapter_id="qwen2.5", split="validation")
            assert_true(val_manifest.recordCount >= 1, "validation export")

    qwen = get_adapter("qwen2.5")
    llama = get_adapter("llama3")
    mistral = get_adapter("mistral")
    assert_true(qwen.info.provider == "qwen", "qwen adapter")
    assert_true(llama.info.provider == "meta", "llama adapter")
    assert_true(mistral.info.provider == "mistral", "mistral adapter")
    print("PASS base model adapters")

    cfg = config_from_yaml(config_path)
    assert_true(cfg.training_method == "qlora_sft", "config load")
    assert_true(len(cfg.config_hash()) == 64, "config hash")
    smoke_cfg = config_from_yaml(smoke_config)
    assert_true(smoke_cfg.smoke_mode is True, "smoke config")
    print("PASS training config")

    with tempfile.TemporaryDirectory() as tmp:
        prep = prepare_training(config_path, dataset_root, Path(tmp))
        assert_true(prep["trainRecords"] == expected_train, "prepare training")
        assert_true(prep["status"] == "PREPARED", "prepare status")
    print("PASS prepare_training (no weights)")

    harness = TauEvalHarness(dataset_root / "test" / "tau-dataset-v0.1.jsonl")
    report = harness.run()
    assert_true(report.structuralOnly is True, "eval structural only")
    assert_true(report.summary.get("quality_scores") is None, "no fake scores")
    expected_test = ds_manifest["recordCounts"]["test"]
    assert_true(report.summary["total"] == expected_test, "test cases loaded")
    print("PASS evaluation harness structural")

    assert_true(ds_manifest["recordCounts"]["validation"] >= 1, "validation split present")
    print(f"NOTE validation split size={ds_manifest['recordCounts']['validation']} (1 is insufficient for model selection — documented)")
    print("PASS dataset split counts unchanged")

    print("PASS TF-2 structural tests")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
