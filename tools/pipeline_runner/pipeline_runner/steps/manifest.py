"""Manifest validation step: validates Outlook add-in XML manifests."""

from __future__ import annotations

import subprocess
from pathlib import Path

from rich.console import Console

from pipeline_runner.config import DEFAULT_CONFIG

console = Console()


def run(project_root: Path) -> bool:
    """Validate all manifest files. Returns True if all pass."""
    results: list[bool] = []

    for manifest_rel in DEFAULT_CONFIG.manifest_files:
        manifest_path = DEFAULT_CONFIG.resolve(project_root, manifest_rel)
        if not manifest_path.is_file():
            console.print(f"[yellow]Skipping manifest: {manifest_path} not found[/yellow]")
            continue

        console.print(f"  Validating [cyan]{manifest_rel}[/cyan] ...")
        result = subprocess.run(
            ["npx", "office-addin-manifest", "validate", str(manifest_path)],
            cwd=project_root,
            capture_output=True,
            text=True,
        )

        if result.returncode != 0:
            console.print(f"  [red]{manifest_rel} validation failed[/red]")
            if result.stdout:
                console.print(result.stdout)
            if result.stderr:
                console.print(result.stderr)
            results.append(False)
        else:
            console.print(f"  [green]{manifest_rel} is valid[/green]")
            results.append(True)

    return all(results) if results else True
