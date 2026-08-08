"""Tiny adapter for PIPELINE SMOKE TEST only — not a quality benchmark."""

from __future__ import annotations

from typing import Any

from ..constants import CONSTITUTION_SYSTEM_PREAMBLE
from .base import AdapterInfo, BaseModelAdapter


class SmokeTinyAdapter(BaseModelAdapter):
    """Uses HF tiny test models — preserves pipeline interfaces without 7B download."""

    @property
    def info(self) -> AdapterInfo:
        return AdapterInfo(
            adapter_id="smoke-tiny",
            base_model_id="hf-internal-testing/tiny-random-LlamaForCausalLM",
            template_id="llama-generic-smoke",
            provider="huggingface-test",
        )

    def record_to_messages(self, record: dict[str, Any]) -> list[dict[str, str]]:
        system = record.get("systemContext") or CONSTITUTION_SYSTEM_PREAMBLE
        return [
            {"role": "system", "content": system},
            {"role": "user", "content": record["input"]},
            {"role": "assistant", "content": record["output"]},
        ]

    def apply_chat_template(self, tokenizer: Any, messages: list[dict[str, str]]) -> str:
        if hasattr(tokenizer, "apply_chat_template"):
            try:
                return tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=False)
            except Exception:
                pass
        return "\n".join(f"{m['role']}: {m['content']}" for m in messages)

    def load_tokenizer(self, model_id: str, *, trust_remote_code: bool = True) -> Any:
        from transformers import AutoTokenizer

        return AutoTokenizer.from_pretrained(model_id, trust_remote_code=trust_remote_code)

    def load_base_model(self, model_id: str, *, torch_dtype: Any = None, device_map: str | None = None) -> Any:
        from transformers import AutoModelForCausalLM

        return AutoModelForCausalLM.from_pretrained(model_id, trust_remote_code=True)

    def lora_target_modules(self) -> list[str] | None:
        return ["q_proj", "v_proj"]
