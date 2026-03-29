"""ADR check step: validates Architecture Decision Records using @archgate/cli."""

from __future__ import annotations

import subprocess
from pathlib import Path

from rich.console import Console

from pipeline_runner.config import DEFAULT_CONFIG

console = Console()


def run(project_root: Path) -> bool:
    """Run ADR validation. Returns True if all checks pass."""
    adr_dir = DEFAULT_CONFIG.resolve(project_root, DEFAULT_CONFIG.adr_dir)

    if not adr_dir.is_dir():
        console.print(f"[yellow]Skipping ADR check: {adr_dir} not found[/yellow]")
        return True

    console.print(f"  Running [cyan]@archgate/cli check[/cyan] in {project_root} ...")
    result = subprocess.run(
        ["npx", "@archgate/cli", "check"],
        cwd=project_root,
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        console.print(f"  [red]ADR check failed (exit {result.returncode})[/red]")
        if result.stdout:
            console.print(result.stdout)
        if result.stderr:
            console.print(result.stderr)
        return False

    console.print("  [green]ADR check passed[/green]")
    return True
