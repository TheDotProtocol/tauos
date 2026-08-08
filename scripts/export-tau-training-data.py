#!/usr/bin/env python3
"""Export Tau Dataset splits for training."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools" / "tau-training"))

from tau_training.export import export_split  # noqa: E402


def main() -> int:
    parser = argparse.ArgumentParser(description="Export Tau Dataset for training")
    parser.add_argument("--dataset-root", default="datasets/tau-foundation/v0.1")
    parser.add_argument("--output-dir", default="datasets/tau-foundation/v0.1/exports")
    parser.add_argument("--adapter-id", default="qwen2.5")
    parser.add_argument("--split", default="train", choices=["train", "validation"])
    args = parser.parse_args()

    manifest = export_split(
        Path(args.dataset_root),
        Path(args.output_dir),
        adapter_id=args.adapter_id,
        split=args.split,
    )
    print(f"PASS export {args.split}: {manifest.recordCount} records")
    print(f"exportHash={manifest.exportHash[:16]}...")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
