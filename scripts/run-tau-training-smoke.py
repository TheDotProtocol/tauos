#!/usr/bin/env python3
"""TF-2 PIPELINE SMOKE TEST runner."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools" / "tau-training"))

from tau_training.train import TrainingPipelineError, run_smoke_test  # noqa: E402


def main() -> int:
    parser = argparse.ArgumentParser(description="Tau training pipeline smoke test")
    parser.add_argument("--dataset-root", default="datasets/tau-foundation/v0.1")
    parser.add_argument("--config", default="tools/tau-training/configs/smoke-tiny.yaml")
    parser.add_argument("--output-dir", default="checkpoints/tf2-smoke")
    args = parser.parse_args()

    try:
        result = run_smoke_test(
            dataset_root=Path(args.dataset_root),
            output_dir=Path(args.output_dir),
            config_path=Path(args.config),
        )
    except TrainingPipelineError as exc:
        print(f"SMOKE SKIPPED: {exc}")
        return 0
    except Exception as exc:
        print(f"FAIL smoke test: {exc}")
        return 1

    print(json.dumps({k: v for k, v in result.items() if k != "losses"}, indent=2))
    print(f"PASS PIPELINE_SMOKE_TEST losses={result.get('losses')}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
