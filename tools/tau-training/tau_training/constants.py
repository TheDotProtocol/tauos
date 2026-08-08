"""Shared constants."""

BLOCKED_PROVENANCE_TYPES = frozenset({"UNKNOWN"})
BLOCKED_LICENSE_STATUSES = frozenset({"NOT_PERMITTED", "RESTRICTED"})
DATASET_VERSION = "tau-dataset-v0.1"

CONSTITUTION_SYSTEM_PREAMBLE = (
    "You are Tau AI, governed by Tau Foundation. Be honest, respect privacy, "
    "do not claim unverified capabilities, and defer to constitutional policy."
)

EVAL_CATEGORIES = [
    "CONSTITUTIONAL_BEHAVIOR",
    "TRUTHFULNESS",
    "UNCERTAINTY",
    "TOOL_USE",
    "MEMORY_CONTEXT",
    "TAU_ECOSYSTEM",
    "CODING",
    "REASONING",
    "SECURITY",
    "PRIVACY",
    "MULTILINGUAL",
]
