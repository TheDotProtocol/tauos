"""Training manifest and configuration hashing."""

from __future__ import annotations

import hashlib
import json
import platform
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from . import PIPELINE_VERSION


@dataclass
class LoRAConfig:
    r: int = 16
    lora_alpha: int = 32
    lora_dropout: float = 0.05
    bias: str = "none"
    task_type: str = "CAUSAL_LM"


@dataclass
class TrainingConfig:
    pipeline_version: str
    adapter_id: str
    base_model_id: str
    base_model_revision: str | None
    training_method: str
    max_seq_length: int
    per_device_train_batch_size: int
    gradient_accumulation_steps: int
    learning_rate: float
    num_train_epochs: float
    max_steps: int
    seed: int
    lora: LoRAConfig
    smoke_mode: bool = False

    def config_hash(self) -> str:
        payload = json.dumps(asdict(self), sort_keys=True)
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()


@dataclass
class TrainingManifest:
    pipelineVersion: str
    datasetVersion: str
    datasetHash: str
    exportHash: str
    baseModel: str
    baseModelRevision: str | None
    adapterId: str
    templateId: str
    tokenizer: str
    trainingMethod: str
    loraConfig: dict[str, Any]
    hyperparameters: dict[str, Any]
    hardware: dict[str, Any]
    seed: int
    sourceSplit: str
    outputCheckpoint: str
    provenanceStatus: str
    validationStatus: str
    trainingConfigHash: str
    timestamps: dict[str, str]
    checkpointType: str
    merged: bool = False
    label: str = "TAU_CHECKPOINT"

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def build_training_manifest(
    *,
    config: TrainingConfig,
    dataset_version: str,
    dataset_hash: str,
    export_hash: str,
    template_id: str,
    source_split: str,
    output_checkpoint: str,
    provenance_status: str,
    validation_status: str,
) -> TrainingManifest:
    now = datetime.now(timezone.utc).isoformat()
    return TrainingManifest(
        pipelineVersion=PIPELINE_VERSION,
        datasetVersion=dataset_version,
        datasetHash=dataset_hash,
        exportHash=export_hash,
        baseModel=config.base_model_id,
        baseModelRevision=config.base_model_revision,
        adapterId=config.adapter_id,
        templateId=template_id,
        tokenizer=config.base_model_id,
        trainingMethod=config.training_method,
        loraConfig=asdict(config.lora),
        hyperparameters={
            "max_seq_length": config.max_seq_length,
            "per_device_train_batch_size": config.per_device_train_batch_size,
            "gradient_accumulation_steps": config.gradient_accumulation_steps,
            "learning_rate": config.learning_rate,
            "num_train_epochs": config.num_train_epochs,
            "max_steps": config.max_steps,
        },
        hardware={
            "platform": platform.platform(),
            "python": platform.python_version(),
            "processor": platform.processor(),
            "machine": platform.machine(),
        },
        seed=config.seed,
        sourceSplit=source_split,
        outputCheckpoint=output_checkpoint,
        provenanceStatus=provenance_status,
        validationStatus=validation_status,
        trainingConfigHash=config.config_hash(),
        timestamps={"createdAt": now, "completedAt": now},
        checkpointType="lora_adapter",
        merged=False,
        label="PIPELINE_SMOKE_TEST" if config.smoke_mode else "TAU_CHECKPOINT",
    )


def write_manifest(path: Path, manifest: TrainingManifest) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(manifest.to_dict(), indent=2) + "\n", encoding="utf-8")


def load_yaml_config(path: Path) -> dict[str, Any]:
    try:
        import yaml
    except ImportError as exc:
        json_path = path.with_suffix('.json')
        if json_path.exists():
            return json.loads(json_path.read_text(encoding='utf-8'))
        raise RuntimeError(
            "PyYAML required for YAML config loading: pip install pyyaml "
            f"(or provide {json_path.name})",
        ) from exc
    return yaml.safe_load(path.read_text(encoding='utf-8'))


def config_from_yaml(path: Path) -> TrainingConfig:
    raw = load_yaml_config(path)
    lora_raw = raw.get("lora", {})
    lora = LoRAConfig(
        r=int(lora_raw.get("r", 16)),
        lora_alpha=int(lora_raw.get("lora_alpha", 32)),
        lora_dropout=float(lora_raw.get("lora_dropout", 0.05)),
        bias=str(lora_raw.get("bias", "none")),
        task_type=str(lora_raw.get("task_type", "CAUSAL_LM")),
    )
    return TrainingConfig(
        pipeline_version=PIPELINE_VERSION,
        adapter_id=str(raw.get("adapter_id", "qwen2.5")),
        base_model_id=str(raw.get("base_model_id", "Qwen/Qwen2.5-7B-Instruct")),
        base_model_revision=raw.get("base_model_revision"),
        training_method=str(raw.get("training_method", "lora_sft")),
        max_seq_length=int(raw.get("max_seq_length", 2048)),
        per_device_train_batch_size=int(raw.get("per_device_train_batch_size", 1)),
        gradient_accumulation_steps=int(raw.get("gradient_accumulation_steps", 4)),
        learning_rate=float(raw.get("learning_rate", 2e-4)),
        num_train_epochs=float(raw.get("num_train_epochs", 1)),
        max_steps=int(raw.get("max_steps", -1)),
        seed=int(raw.get("seed", 42)),
        lora=lora,
        smoke_mode=bool(raw.get("smoke_mode", False)),
    )
