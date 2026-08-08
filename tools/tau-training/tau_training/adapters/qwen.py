"""Qwen2.5 chat template adapter (third-party base model — not Tau-owned)."""

from __future__ import annotations

from typing import Any

from ..constants import CONSTITUTION_SYSTEM_PREAMBLE
from .base import AdapterInfo, BaseModelAdapter


class QwenAdapter(BaseModelAdapter):
    @property
    def info(self) -> AdapterInfo:
        return AdapterInfo(
            adapter_id="qwen2.5",
            base_model_id="Qwen/Qwen2.5-7B-Instruct",
            template_id="qwen2.5-chatml",
            provider="qwen",
        )

    def record_to_messages(self, record: dict[str, Any]) -> list[dict[str, str]]:
        system = record.get("systemContext") or CONSTITUTION_SYSTEM_PREAMBLE
        if record.get("messages"):
            return record["messages"]
        return [
            {"role": "system", "content": system},
            {"role": "user", "content": record["input"]},
            {"role": "assistant", "content": record["output"]},
        ]

    def apply_chat_template(self, tokenizer: Any, messages: list[dict[str, str]]) -> str:
        if hasattr(tokenizer, "apply_chat_template"):
            return tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=False)
        # Fallback ChatML-like formatting
        parts: list[str] = []
        for msg in messages:
            role = msg["role"]
            parts.append(f"<|im_start|>{role}\n{msg['content']}")
        parts.append("<|im_start|>assistant\n")
        return "\n".join(parts)

    def load_tokenizer(self, model_id: str, *, trust_remote_code: bool = True) -> Any:
        from transformers import AutoTokenizer

        return AutoTokenizer.from_pretrained(model_id, trust_remote_code=trust_remote_code)

    def load_base_model(self, model_id: str, *, torch_dtype: Any = None, device_map: str | None = None) -> Any:
        from transformers import AutoModelForCausalLM

        kwargs: dict[str, Any] = {"trust_remote_code": True}
        if torch_dtype is not None:
            kwargs["torch_dtype"] = torch_dtype
        if device_map is not None:
            kwargs["device_map"] = device_map
        return AutoModelForCausalLM.from_pretrained(model_id, **kwargs)

    def lora_target_modules(self) -> list[str] | None:
        return ["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"]
