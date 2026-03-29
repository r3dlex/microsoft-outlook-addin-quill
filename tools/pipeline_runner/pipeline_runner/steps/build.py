"""Build step: builds frontend and docs for production."""

from __future__ import annotations

import subprocess
from pathlib import Path

from rich.console import Console

from pipeline_runner.config import DEFAULT_CONFIG

console = Console()


def run(project_root: Path) -> bool:
    """Run production builds. Returns True if all pass."""
    results: list[bool] = []

    # Frontend: Vite build
    frontend_dir = DEFAULT_CONFIG.resolve(project_root, DEFAULT_CONFIG.frontend_dir)
    if frontend_dir.is_dir():
        results.append(
            _run_command(
                ["npm", "run", "build"],
                cwd=frontend_dir,
                label="npm run build (frontend)",
            )
        )
    else:
        console.print(f"[yellow]Skipping frontend build: {frontend_dir} not found[/yellow]")

    # Docs: VitePress build
    frontend_docs = frontend_dir / "docs"
    if frontend_docs.is_dir():
        results.append(
            _run_command(
                ["npx", "vitepress", "build", "docs"],
                cwd=frontend_dir,
                label="vitepress build docs",
            )
        )
    else:
        console.print(f"[yellow]Skipping docs build: {frontend_docs} not found[/yellow]")

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
