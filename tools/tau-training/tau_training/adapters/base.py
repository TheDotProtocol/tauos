"""Base model adapter boundary."""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class AdapterInfo:
    adapter_id: str
    base_model_id: str
    template_id: str
    provider: str  # third-party label — e.g. qwen, meta, mistral


class BaseModelAdapter(ABC):
    """Format Tau records and load models without hard-coding the whole pipeline."""

    @property
    @abstractmethod
    def info(self) -> AdapterInfo:
        raise NotImplementedError

    @abstractmethod
    def record_to_messages(self, record: dict[str, Any]) -> list[dict[str, str]]:
        raise NotImplementedError

    @abstractmethod
    def apply_chat_template(self, tokenizer: Any, messages: list[dict[str, str]]) -> str:
        raise NotImplementedError

    @abstractmethod
    def load_tokenizer(self, model_id: str, *, trust_remote_code: bool = True) -> Any:
        raise NotImplementedError

    @abstractmethod
    def load_base_model(self, model_id: str, *, torch_dtype: Any = None, device_map: str | None = None) -> Any:
        raise NotImplementedError

    def lora_target_modules(self) -> list[str] | None:
        """Return adapter-specific LoRA targets, or None for defaults."""
        return None


def get_adapter(adapter_id: str) -> BaseModelAdapter:
    from .qwen import QwenAdapter
    from .llama import LlamaAdapter
    from .mistral import MistralAdapter
    from .smoke import SmokeTinyAdapter

    registry: dict[str, BaseModelAdapter] = {
        "qwen2.5": QwenAdapter(),
        "llama3": LlamaAdapter(),
        "mistral": MistralAdapter(),
        "smoke-tiny": SmokeTinyAdapter(),
    }
    key = adapter_id.lower()
    if key not in registry:
        raise ValueError(f"Unknown adapter_id: {adapter_id}. Available: {', '.join(registry)}")
    return registry[key]
