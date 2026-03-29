"""Core pipeline orchestrator that runs steps sequentially and reports results."""

from __future__ import annotations

import importlib
import time
from pathlib import Path

from rich.console import Console
from rich.table import Table

console = Console()

STEP_MODULES = {
    "lint": "pipeline_runner.steps.lint",
    "test": "pipeline_runner.steps.test",
    "ui_test": "pipeline_runner.steps.ui_test",
    "build": "pipeline_runner.steps.build",
    "coverage": "pipeline_runner.steps.coverage",
    "adr_check": "pipeline_runner.steps.adr_check",
    "manifest": "pipeline_runner.steps.manifest",
}


def run_pipeline(project_root: Path, steps: list[str]) -> bool:
    """Run the specified pipeline steps sequentially.

    Args:
        project_root: Absolute path to the project root directory.
        steps: List of step names to execute in order.

    Returns:
        True if all steps passed, False if any step failed.
    """
    console.rule("[bold blue]Quill Pipeline Runner[/bold blue]")
    console.print(f"Project root: [cyan]{project_root}[/cyan]")
    console.print(f"Steps: [cyan]{', '.join(steps)}[/cyan]\n")

    results: list[tuple[str, bool, float]] = []
    all_passed = True

    for step_name in steps:
        if step_name not in STEP_MODULES:
            console.print(f"[bold red]Unknown step:[/bold red] {step_name}")
            results.append((step_name, False, 0.0))
            all_passed = False
            continue

        console.rule(f"[bold yellow]Step: {step_name}[/bold yellow]")
        module = importlib.import_module(STEP_MODULES[step_name])

        start = time.monotonic()
        try:
            passed = module.run(project_root)
        except Exception as exc:
            console.print(f"[bold red]Step {step_name} raised an exception:[/bold red] {exc}")
            passed = False
        elapsed = time.monotonic() - start

        results.append((step_name, passed, elapsed))

        if passed:
            console.print(f"[bold green]PASSED[/bold green] ({elapsed:.1f}s)\n")
        else:
            console.print(f"[bold red]FAILED[/bold red] ({elapsed:.1f}s)\n")
            all_passed = False

    _print_summary(results, all_passed)

    if not all_passed:
        raise SystemExit(1)

    return all_passed


def _print_summary(results: list[tuple[str, bool, float]], all_passed: bool) -> None:
    """Print a summary table of all step results."""
    console.rule("[bold blue]Pipeline Summary[/bold blue]")

    table = Table(show_header=True, header_style="bold")
    table.add_column("Step", style="cyan")
    table.add_column("Result", justify="center")
    table.add_column("Duration", justify="right")

    for name, passed, elapsed in results:
        status = "[bold green]PASS[/bold green]" if passed else "[bold red]FAIL[/bold red]"
        table.add_row(name, status, f"{elapsed:.1f}s")

    console.print(table)

    total_time = sum(e for _, _, e in results)
    if all_passed:
        console.print(f"\n[bold green]All steps passed[/bold green] in {total_time:.1f}s")
    else:
        failed = [n for n, p, _ in results if not p]
        console.print(
            f"\n[bold red]Pipeline failed[/bold red] in {total_time:.1f}s. "
            f"Failed steps: {', '.join(failed)}"
        )
