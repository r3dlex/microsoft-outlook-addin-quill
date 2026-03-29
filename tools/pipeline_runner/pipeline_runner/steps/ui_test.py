"""UI test step: runs E2E browser tests for the Vue task pane."""

from __future__ import annotations

import subprocess
from pathlib import Path

from rich.console import Console

from pipeline_runner.config import DEFAULT_CONFIG

console = Console()


def run(project_root: Path) -> bool:
    """Run UI/E2E tests. Returns True if all pass."""
    frontend_dir = DEFAULT_CONFIG.resolve(project_root, DEFAULT_CONFIG.frontend_dir)

    if not frontend_dir.is_dir():
        console.print(f"[yellow]Skipping UI tests: {frontend_dir} not found[/yellow]")
        return True

    console.print(f"  Running [cyan]Playwright tests[/cyan] in {frontend_dir} ...")
    result = subprocess.run(
        ["npx", "playwright", "test"],
        cwd=frontend_dir,
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        console.print(f"  [red]Playwright tests failed (exit {result.returncode})[/red]")
        if result.stdout:
            console.print(result.stdout)
        if result.stderr:
            console.print(result.stderr)
        return False

    console.print("  [green]Playwright tests passed[/green]")
    return True
