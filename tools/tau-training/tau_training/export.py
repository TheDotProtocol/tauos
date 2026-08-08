"""Deterministic Tau Dataset → training JSONL exporter."""

from __future__ import annotations

import hashlib
import json
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from . import PIPELINE_VERSION
from .adapters.base import get_adapter
from .constants import DATASET_VERSION
from .gate import load_jsonl, load_manifest, run_training_gate


@dataclass
class ExportManifest:
    pipelineVersion: str
    datasetVersion: str
    datasetManifestHash: str
    adapterId: str
    baseModelId: str
    templateId: str
    split: str
    recordIds: list[str]
    recordCount: int
    exportHash: str
    createdAt: str
    trainingConfigHash: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def hash_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def format_training_text(messages: list[dict[str, str]]) -> str:
    """Stable text fallback when tokenizer is unavailable during export."""
    return "\n".join(f"{m['role']}: {m['content']}" for m in messages)


def export_split(
    dataset_root: Path,
    output_dir: Path,
    *,
    adapter_id: str = "qwen2.5",
    split: str = "train",
    training_config_hash: str | None = None,
) -> ExportManifest:
    if split == "test":
        raise ValueError("Refusing to export protected test split for training")

    gate = run_training_gate(dataset_root, split=split)
    gate.raise_if_blocked()

    manifest = load_manifest(dataset_root)
    adapter = get_adapter(adapter_id)
    records = load_jsonl(dataset_root / split / f"{DATASET_VERSION}.jsonl")

    output_dir.mkdir(parents=True, exist_ok=True)
    out_path = output_dir / f"{split}-{DATASET_VERSION}-{adapter.info.adapter_id}.jsonl"

    exported: list[dict[str, Any]] = []
    record_ids: list[str] = []
    for record in records:
        messages = adapter.record_to_messages(record)
        exported.append(
            {
                "id": record["id"],
                "sourceRecordId": record["id"],
                "datasetVersion": DATASET_VERSION,
                "category": record.get("category"),
                "messages": messages,
                "text": format_training_text(messages),
            },
        )
        record_ids.append(record["id"])

    lines = "\n".join(json.dumps(row, ensure_ascii=False) for row in exported) + "\n"
    out_path.write_text(lines, encoding="utf-8")

    export_manifest = ExportManifest(
        pipelineVersion=PIPELINE_VERSION,
        datasetVersion=DATASET_VERSION,
        datasetManifestHash=manifest["contentHash"],
        adapterId=adapter.info.adapter_id,
        baseModelId=adapter.info.base_model_id,
        templateId=adapter.info.template_id,
        split=split,
        recordIds=record_ids,
        recordCount=len(record_ids),
        exportHash=hash_text(lines),
        createdAt=datetime.now(timezone.utc).isoformat(),
        trainingConfigHash=training_config_hash,
    )

    manifest_path = output_dir / f"export-manifest-{split}.json"
    manifest_path.write_text(json.dumps(export_manifest.to_dict(), indent=2) + "\n", encoding="utf-8")
    return export_manifest
