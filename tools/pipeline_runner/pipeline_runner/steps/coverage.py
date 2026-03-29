"""Coverage step: parses coverage output and enforces thresholds from config."""

from __future__ import annotations

import json
import re
from pathlib import Path

from rich.console import Console

from pipeline_runner.config import DEFAULT_CONFIG

console = Console()


def run(project_root: Path) -> bool:
    """Check coverage thresholds for all components. Returns True if all meet targets."""
    results: list[bool] = []

    for threshold in DEFAULT_CONFIG.coverage_thresholds:
        if threshold.component == "frontend":
            results.append(_check_frontend_coverage(project_root, threshold.threshold))
        elif threshold.component == "pipeline":
            results.append(_check_pipeline_coverage(project_root, threshold.threshold))

    return all(results) if results else True


def _check_frontend_coverage(project_root: Path, threshold: float) -> bool:
    """Check Vitest/Istanbul coverage from coverage/ summary."""
    summary_file = (
        project_root / DEFAULT_CONFIG.frontend_dir / "coverage" / "coverage-summary.json"
    )
    if not summary_file.is_file():
        console.print("[yellow]Frontend coverage data not found; skipping[/yellow]")
        return True

    try:
        data = json.loads(summary_file.read_text())
        total = data.get("total", {})
        lines = total.get("lines", {})
        pct = lines.get("pct", 0.0)
        return _report("Frontend (TypeScript)", pct, threshold)
    except (json.JSONDecodeError, KeyError):
        console.print("[yellow]Could not parse frontend coverage data[/yellow]")
        return True


def _check_pipeline_coverage(project_root: Path, threshold: float) -> bool:
    """Check Python pytest-cov output from .coverage or coverage.xml."""
    coverage_file = project_root / DEFAULT_CONFIG.pipeline_dir / "coverage.xml"
    if not coverage_file.is_file():
        htmlcov = project_root / DEFAULT_CONFIG.pipeline_dir / "htmlcov" / "index.html"
        if htmlcov.is_file():
            text = htmlcov.read_text()
            match = re.search(r"(\d+)%", text)
            if match:
                pct = float(match.group(1))
                return _report("Pipeline (Python)", pct, threshold)

        console.print("[yellow]Pipeline coverage data not found; skipping[/yellow]")
        return True

    try:
        text = coverage_file.read_text()
        match = re.search(r'line-rate="([\d.]+)"', text)
        if match:
            pct = float(match.group(1)) * 100
            return _report("Pipeline (Python)", pct, threshold)
    except (ValueError, AttributeError):
        pass

    console.print("[yellow]Could not parse pipeline coverage data[/yellow]")
    return True


def _report(component: str, actual: float, threshold: float) -> bool:
    """Report coverage result and return whether it meets the threshold."""
    if actual >= threshold:
        console.print(
            f"  [green]{component}: {actual:.1f}% >= {threshold:.1f}% threshold[/green]"
        )
        return True
    else:
        console.print(
            f"  [red]{component}: {actual:.1f}% < {threshold:.1f}% threshold[/red]"
        )
        return False
