"""Evaluation harness interface (TF-2 — structural only, no quality scores)."""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any

from .constants import EVAL_CATEGORIES, DATASET_VERSION


@dataclass
class EvalCase:
    id: str
    category: str
    input: str
    expected_behavior: str


@dataclass
class EvalResult:
    case_id: str
    category: str
    status: str
    notes: str
    score: float | None = None


@dataclass
class EvalReport:
    harnessVersion: str
    datasetVersion: str
    checkpointLabel: str
    structuralOnly: bool
    categories: list[str]
    results: list[dict[str, Any]]
    summary: dict[str, Any]

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


class TauEvalHarness:
    """Interface for TF-4+ evaluation. TF-2 runs structural checks only."""

    harness_version = "0.1.0"

    def __init__(self, test_split_path: Path):
        self.test_split_path = test_split_path

    def load_cases(self) -> list[EvalCase]:
        cases: list[EvalCase] = []
        if not self.test_split_path.exists():
            return cases
        for line in self.test_split_path.read_text(encoding="utf-8").splitlines():
            if not line.strip():
                continue
            row = json.loads(line)
            cases.append(
                EvalCase(
                    id=row["id"],
                    category=row.get("category", "GENERAL_INSTRUCTION"),
                    input=row["input"],
                    expected_behavior=row.get("output", "")[:120],
                ),
            )
        return cases

    def structural_check(self) -> EvalReport:
        cases = self.load_cases()
        results: list[EvalResult] = []
        for case in cases:
            ok = bool(case.input.strip()) and case.category in EVAL_CATEGORIES or case.category
            results.append(
                EvalResult(
                    case_id=case.id,
                    category=case.category,
                    status="STRUCTURAL_PASS" if ok else "STRUCTURAL_FAIL",
                    notes="TF-2 structural check only — no model inference",
                    score=None,
                ),
            )
        passed = sum(1 for r in results if r.status == "STRUCTURAL_PASS")
        return EvalReport(
            harnessVersion=self.harness_version,
            datasetVersion=DATASET_VERSION,
            checkpointLabel="NONE",
            structuralOnly=True,
            categories=sorted(set(c.category for c in cases)),
            results=[asdict(r) for r in results],
            summary={
                "total": len(results),
                "structural_pass": passed,
                "quality_scores": None,
                "note": "No benchmark or quality scores in TF-2",
            },
        )

    def run(self, checkpoint_dir: Path | None = None) -> EvalReport:
        report = self.structural_check()
        if checkpoint_dir:
            meta_path = checkpoint_dir / "checkpoint-meta.json"
            if meta_path.exists():
                meta = json.loads(meta_path.read_text(encoding="utf-8"))
                report.checkpointLabel = str(meta.get("label", "UNKNOWN"))
        return report
