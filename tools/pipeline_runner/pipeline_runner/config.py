"""Pipeline configuration: paths, commands, and coverage thresholds."""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path


@dataclass(frozen=True)
class CoverageThreshold:
    """Coverage threshold for a single component."""

    component: str
    threshold: float
    description: str


@dataclass(frozen=True)
class PipelineConfig:
    """Central configuration for all pipeline steps."""

    # -- Relative paths from project root --
    frontend_dir: str = "frontend"
    pipeline_dir: str = "tools/pipeline_runner"
    docs_dir: str = "docs"
    adr_dir: str = "docs/adr"
    manifests_dir: str = "manifests"

    # -- Coverage thresholds --
    coverage_thresholds: tuple[CoverageThreshold, ...] = field(
        default_factory=lambda: (
            CoverageThreshold("frontend", 75.0, "Vue frontend (TypeScript)"),
            CoverageThreshold("pipeline", 90.0, "Pipeline runner (Python)"),
        )
    )

    # -- Manifest files --
    manifest_files: tuple[str, ...] = field(
        default_factory=lambda: (
            "manifests/manifest.xml",
        )
    )

    def resolve(self, project_root: Path, relative: str) -> Path:
        """Resolve a relative path against the project root."""
        return project_root / relative


# Singleton default configuration
DEFAULT_CONFIG = PipelineConfig()
