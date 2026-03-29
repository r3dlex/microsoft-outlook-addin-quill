"""Test step: runs unit tests with coverage for frontend and pipeline components."""

from __future__ import annotations

import subprocess
from pathlib import Path

from rich.console import Console

from pipeline_runner.config import DEFAULT_CONFIG

console = Console()


def run(project_root: Path) -> bool:
    """Run unit tests for all components. Returns True if all pass."""
    results: list[bool] = []

    # Frontend: Vitest
    frontend_dir = DEFAULT_CONFIG.resolve(project_root, DEFAULT_CONFIG.frontend_dir)
    if frontend_dir.is_dir():
        results.append(
            _run_command(
                ["npx", "vitest", "run", "--coverage"],
                cwd=frontend_dir,
                label="vitest --coverage",
            )
        )
    else:
        console.print(f"[yellow]Skipping frontend tests: {frontend_dir} not found[/yellow]")

    # Pipeline: pytest
    pipeline_dir = DEFAULT_CONFIG.resolve(project_root, DEFAULT_CONFIG.pipeline_dir)
    if pipeline_dir.is_dir():
        results.append(
            _run_command(
                ["pytest", "--cov=pipeline_runner", "--cov-fail-under=90"],
                cwd=pipeline_dir,
                label="pytest --cov",
            )
        )
    else:
        console.print(f"[yellow]Skipping pipeline tests: {pipeline_dir} not found[/yellow]")

    return all(results) if results else True


def _run_command(cmd: list[str], cwd: Path, label: str) -> bool:
    """Execute a command and return True on success."""
    console.print(f"  Running [cyan]{label}[/cyan] in {cwd} ...")
    result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if result.returncode != 0:
        console.print(f"  [red]{label} failed (exit {result.returncode})[/red]")
        if result.stdout:
            console.print(result.stdout)
        if result.stderr:
            console.print(result.stderr)
        return False
    console.print(f"  [green]{label} passed[/green]")
    return True
