"""LoRA SFT trainer and PIPELINE SMOKE TEST."""

from __future__ import annotations

import json
from dataclasses import asdict
from pathlib import Path
from typing import Any

from . import PIPELINE_VERSION
from .adapters.base import get_adapter
from .checkpoint import save_checkpoint_bundle
from .constants import DATASET_VERSION
from .export import export_split
from .gate import run_training_gate
from .manifest import TrainingConfig, build_training_manifest, config_from_yaml, write_manifest


class TrainingPipelineError(Exception):
    pass


def _require_torch_stack() -> None:
    try:
        import torch  # noqa: F401
        import transformers  # noqa: F401
        import peft  # noqa: F401
    except ImportError as exc:
        raise TrainingPipelineError(
            "PyTorch stack not installed. Install tools/tau-training/requirements.txt for smoke tests.",
        ) from exc


def load_training_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.strip():
            rows.append(json.loads(line))
    return rows


def run_smoke_test(
    *,
    dataset_root: Path,
    output_dir: Path,
    config_path: Path,
) -> dict[str, Any]:
    """PIPELINE SMOKE TEST — not a model quality benchmark."""

    _require_torch_stack()
    import torch
    from peft import LoraConfig, get_peft_model
    from torch.optim import AdamW

    config = config_from_yaml(config_path)
    if not config.smoke_mode:
        raise TrainingPipelineError("Smoke runner requires smoke_mode: true in config")

    gate = run_training_gate(dataset_root)
    gate.raise_if_blocked()

    export_dir = output_dir / "exports"
    export_manifest = export_split(dataset_root, export_dir, adapter_id=config.adapter_id, split="train")
    adapter = get_adapter(config.adapter_id)

    train_rows = load_training_jsonl(
        export_dir / f"train-{DATASET_VERSION}-{adapter.info.adapter_id}.jsonl",
    )[:2]

    tokenizer = adapter.load_tokenizer(config.base_model_id)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    model = adapter.load_base_model(config.base_model_id)
    model.train()

    targets = adapter.lora_target_modules() or ["q_proj", "v_proj"]
    lora_cfg = LoraConfig(
        r=config.lora.r,
        lora_alpha=config.lora.lora_alpha,
        lora_dropout=config.lora.lora_dropout,
        bias=config.lora.bias,
        task_type=config.lora.task_type,
        target_modules=targets,
    )
    model = get_peft_model(model, lora_cfg)

    optimizer = AdamW(model.parameters(), lr=config.learning_rate)
    losses: list[float] = []

    for row in train_rows:
        text = row["text"]
        tokens = tokenizer(text, return_tensors="pt", truncation=True, max_length=min(128, config.max_seq_length))
        input_ids = tokens["input_ids"]
        attention_mask = tokens["attention_mask"]
        labels = input_ids.clone()
        outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
        loss = outputs.loss
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()
        losses.append(float(loss.detach().cpu().item()))

    adapter_dir = output_dir / "adapter"
    adapter_dir.mkdir(parents=True, exist_ok=True)
    model.save_pretrained(adapter_dir)
    tokenizer.save_pretrained(adapter_dir)

    # reload check
    from peft import PeftModel

    base_reloaded = adapter.load_base_model(config.base_model_id)
    reloaded = PeftModel.from_pretrained(base_reloaded, adapter_dir)
    reloaded.eval()

    manifest = build_training_manifest(
        config=config,
        dataset_version=DATASET_VERSION,
        dataset_hash=export_manifest.datasetManifestHash,
        export_hash=export_manifest.exportHash,
        template_id=adapter.info.template_id,
        source_split="train",
        output_checkpoint=str(output_dir),
        provenance_status="PASS",
        validation_status="PIPELINE_SMOKE_TEST",
    )
    save_checkpoint_bundle(output_dir, adapter_path=adapter_dir, manifest=manifest)

    result = {
        "status": "PIPELINE_SMOKE_TEST_PASS",
        "pipelineVersion": PIPELINE_VERSION,
        "losses": losses,
        "steps": len(losses),
        "checkpoint": str(output_dir),
        "label": manifest.label,
        "downloadedModels": [config.base_model_id],
        "note": "Smoke test only — not Tau Foundation Model v0.1",
    }
    (output_dir / "smoke-result.json").write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    return result


def prepare_training(config_path: Path, dataset_root: Path, exports_dir: Path) -> dict[str, Any]:
    """Validate gate + export train/validation without running full training."""

    config = config_from_yaml(config_path)
    gate = run_training_gate(dataset_root)
    gate.raise_if_blocked()

    train_export = export_split(
        dataset_root,
        exports_dir,
        adapter_id=config.adapter_id,
        split="train",
        training_config_hash=config.config_hash(),
    )
    val_export = None
    val_path = dataset_root / "validation" / f"{DATASET_VERSION}.jsonl"
    if val_path.exists() and val_path.stat().st_size > 0:
        val_export = export_split(
            dataset_root,
            exports_dir,
            adapter_id=config.adapter_id,
            split="validation",
            training_config_hash=config.config_hash(),
        )

    prep_manifest = build_training_manifest(
        config=config,
        dataset_version=DATASET_VERSION,
        dataset_hash=train_export.datasetManifestHash,
        export_hash=train_export.exportHash,
        template_id=get_adapter(config.adapter_id).info.template_id,
        source_split="train",
        output_checkpoint=str(exports_dir),
        provenance_status="PASS",
        validation_status="PREPARED_NOT_TRAINED",
    )
    write_manifest(exports_dir / "prepare-manifest.json", prep_manifest)

    return {
        "status": "PREPARED",
        "trainRecords": train_export.recordCount,
        "validationRecords": val_export.recordCount if val_export else 0,
        "trainingConfigHash": config.config_hash(),
        "config": asdict(config),
    }
