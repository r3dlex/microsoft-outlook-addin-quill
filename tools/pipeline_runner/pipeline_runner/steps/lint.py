"""Lint step: runs linters for frontend and pipeline components."""

from __future__ import annotations

import subprocess
from pathlib import Path

from rich.console import Console

from pipeline_runner.config import DEFAULT_CONFIG

console = Console()


def run(project_root: Path) -> bool:
    """Run all linters. Returns True if all pass."""
    results: list[bool] = []

    # Frontend: ESLint
    frontend_dir = DEFAULT_CONFIG.resolve(project_root, DEFAULT_CONFIG.frontend_dir)
    if frontend_dir.is_dir():
        results.append(
            _run_command(["npx", "eslint", "."], cwd=frontend_dir, label="eslint")
        )
    else:
        console.print(f"[yellow]Skipping frontend lint: {frontend_dir} not found[/yellow]")

    # Pipeline: Ruff
    pipeline_dir = DEFAULT_CONFIG.resolve(project_root, DEFAULT_CONFIG.pipeline_dir)
    if pipeline_dir.is_dir():
        results.append(
            _run_command(["ruff", "check", "."], cwd=pipeline_dir, label="ruff")
        )
    else:
        console.print(f"[yellow]Skipping pipeline lint: {pipeline_dir} not found[/yellow]")

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
