"""Checkpoint packaging — LoRA adapter kept separate from base model."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Iterable

from .manifest import TrainingManifest, write_manifest


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def write_checksums(root: Path, files: Iterable[Path]) -> Path:
    lines: list[str] = []
    for file in sorted(files, key=lambda p: str(p)):
        if file.is_file():
            rel = file.relative_to(root)
            lines.append(f"{sha256_file(file)}  {rel}")
    checksum_path = root / "checksums.sha256"
    checksum_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return checksum_path


def save_checkpoint_bundle(
    output_dir: Path,
    *,
    adapter_path: Path,
    manifest: TrainingManifest,
    extra_files: list[Path] | None = None,
) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    manifest_path = output_dir / "training-manifest.json"
    write_manifest(manifest_path, manifest)

    readme = output_dir / "README.txt"
    readme.write_text(
        "Tau training checkpoint bundle (TF-2).\n"
        "This is NOT Tau Foundation Model v0.1 unless explicitly promoted in TF-5.\n"
        "LoRA adapter is kept separate from the third-party base model.\n"
        f"Label: {manifest.label}\n",
        encoding="utf-8",
    )

    files = [manifest_path, readme]
    if adapter_path.exists():
        files.extend([p for p in adapter_path.rglob("*") if p.is_file()])
    if extra_files:
        files.extend(extra_files)
    write_checksums(output_dir, files)
    meta = {
        "checkpointType": manifest.checkpointType,
        "merged": manifest.merged,
        "baseModel": manifest.baseModel,
        "adapterId": manifest.adapterId,
        "label": manifest.label,
    }
    (output_dir / "checkpoint-meta.json").write_text(json.dumps(meta, indent=2) + "\n", encoding="utf-8")
    return output_dir
