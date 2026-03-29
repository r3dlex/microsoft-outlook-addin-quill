"""CLI entrypoint for the Quill Pipeline Runner."""

from pathlib import Path

import click

from pipeline_runner.runner import run_pipeline


def _project_root() -> Path:
    """Resolve the project root (two levels up from tools/pipeline_runner/)."""
    return Path(__file__).resolve().parent.parent.parent.parent


@click.group()
@click.option(
    "--project-root",
    type=click.Path(exists=True, file_okay=False, resolve_path=True),
    default=None,
    help="Project root directory. Defaults to auto-detected root.",
)
@click.pass_context
def cli(ctx: click.Context, project_root: str | None) -> None:
    """Quill Pipeline Runner - orchestrate CI/CD steps for the Quill project."""
    ctx.ensure_object(dict)
    ctx.obj["project_root"] = Path(project_root) if project_root else _project_root()


@cli.command()
@click.pass_context
def lint(ctx: click.Context) -> None:
    """Run linters across all project components."""
    run_pipeline(ctx.obj["project_root"], ["lint"])


@cli.command()
@click.pass_context
def test(ctx: click.Context) -> None:
    """Run unit tests with coverage for all components."""
    run_pipeline(ctx.obj["project_root"], ["test"])


@cli.command("ui-test")
@click.pass_context
def ui_test(ctx: click.Context) -> None:
    """Run UI/E2E tests for the Vue task pane."""
    run_pipeline(ctx.obj["project_root"], ["ui_test"])


@cli.command()
@click.pass_context
def build(ctx: click.Context) -> None:
    """Build frontend and docs for production."""
    run_pipeline(ctx.obj["project_root"], ["build"])


@cli.command()
@click.pass_context
def coverage(ctx: click.Context) -> None:
    """Enforce coverage thresholds across all components."""
    run_pipeline(ctx.obj["project_root"], ["coverage"])


@cli.command("adr-check")
@click.pass_context
def adr_check(ctx: click.Context) -> None:
    """Validate Architecture Decision Records."""
    run_pipeline(ctx.obj["project_root"], ["adr_check"])


@cli.command("manifest-validate")
@click.pass_context
def manifest_validate(ctx: click.Context) -> None:
    """Validate Outlook add-in manifests."""
    run_pipeline(ctx.obj["project_root"], ["manifest"])


@cli.command("all")
@click.pass_context
def all_steps(ctx: click.Context) -> None:
    """Run the full pipeline: lint, test, ui-test, coverage, adr-check, build, manifest-validate."""
    run_pipeline(
        ctx.obj["project_root"],
        ["lint", "test", "ui_test", "coverage", "adr_check", "build", "manifest"],
    )


if __name__ == "__main__":
    cli()
