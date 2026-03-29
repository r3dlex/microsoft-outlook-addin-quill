"""Tests for individual pipeline step modules."""

from __future__ import annotations

from pathlib import Path
from unittest.mock import MagicMock, patch

from pipeline_runner.steps import lint, test, ui_test, build, adr_check, manifest, coverage


class TestLintStep:
    """Tests for the lint step."""

    def test_skips_when_dirs_missing(self, tmp_path):
        """Lint should pass when component directories do not exist."""
        assert lint.run(tmp_path) is True

    @patch("pipeline_runner.steps.lint.subprocess.run")
    def test_passes_when_commands_succeed(self, mock_run, tmp_path):
        """Lint should pass when all commands return 0."""
        (tmp_path / "backend").mkdir()
        (tmp_path / "frontend").mkdir()
        (tmp_path / "tools" / "pipeline_runner").mkdir(parents=True)

        mock_run.return_value = MagicMock(returncode=0, stdout="", stderr="")
        assert lint.run(tmp_path) is True

    @patch("pipeline_runner.steps.lint.subprocess.run")
    def test_fails_when_command_fails(self, mock_run, tmp_path):
        """Lint should fail when any command returns non-zero."""
        (tmp_path / "backend").mkdir()

        mock_run.return_value = MagicMock(returncode=1, stdout="error", stderr="")
        assert lint.run(tmp_path) is False


class TestTestStep:
    """Tests for the test step."""

    def test_skips_when_dirs_missing(self, tmp_path):
        """Test step should pass when component directories do not exist."""
        assert test.run(tmp_path) is True

    @patch("pipeline_runner.steps.test.subprocess.run")
    def test_passes_when_tests_succeed(self, mock_run, tmp_path):
        """Test step should pass when all test commands return 0."""
        (tmp_path / "backend").mkdir()
        (tmp_path / "frontend").mkdir()
        (tmp_path / "tools" / "pipeline_runner").mkdir(parents=True)

        mock_run.return_value = MagicMock(returncode=0, stdout="", stderr="")
        assert test.run(tmp_path) is True


class TestUITestStep:
    """Tests for the UI test step."""

    def test_skips_when_dir_missing(self, tmp_path):
        """UI test should pass when frontend directory does not exist."""
        assert ui_test.run(tmp_path) is True

    @patch("pipeline_runner.steps.ui_test.subprocess.run")
    def test_passes_when_playwright_succeeds(self, mock_run, tmp_path):
        """UI test should pass when Playwright returns 0."""
        (tmp_path / "frontend").mkdir()
        mock_run.return_value = MagicMock(returncode=0, stdout="", stderr="")
        assert ui_test.run(tmp_path) is True


class TestBuildStep:
    """Tests for the build step."""

    def test_skips_when_dirs_missing(self, tmp_path):
        """Build should pass when component directories do not exist."""
        assert build.run(tmp_path) is True

    @patch("pipeline_runner.steps.build.subprocess.run")
    def test_passes_when_builds_succeed(self, mock_run, tmp_path):
        """Build should pass when all build commands return 0."""
        (tmp_path / "frontend").mkdir()
        (tmp_path / "docs").mkdir()
        (tmp_path / "backend").mkdir()

        mock_run.return_value = MagicMock(returncode=0, stdout="", stderr="")
        assert build.run(tmp_path) is True


class TestAdrCheckStep:
    """Tests for the ADR check step."""

    def test_skips_when_dir_missing(self, tmp_path):
        """ADR check should pass when adr directory does not exist."""
        assert adr_check.run(tmp_path) is True

    @patch("pipeline_runner.steps.adr_check.subprocess.run")
    def test_passes_when_check_succeeds(self, mock_run, tmp_path):
        """ADR check should pass when archgate returns 0."""
        (tmp_path / "docs" / "adr").mkdir(parents=True)
        mock_run.return_value = MagicMock(returncode=0, stdout="", stderr="")
        assert adr_check.run(tmp_path) is True


class TestManifestStep:
    """Tests for the manifest validation step."""

    def test_passes_when_no_manifests_found(self, tmp_path):
        """Manifest validation should pass when no manifest files exist."""
        assert manifest.run(tmp_path) is True

    @patch("pipeline_runner.steps.manifest.subprocess.run")
    def test_passes_when_validation_succeeds(self, mock_run, tmp_path):
        """Manifest validation should pass when all manifests are valid."""
        manifest_dir = tmp_path / "manifests"
        manifest_dir.mkdir()
        (manifest_dir / "manifest-graph.xml").write_text("<xml/>")
        (manifest_dir / "manifest-davmail.xml").write_text("<xml/>")

        mock_run.return_value = MagicMock(returncode=0, stdout="", stderr="")
        assert manifest.run(tmp_path) is True


class TestCoverageStep:
    """Tests for the coverage enforcement step."""

    def test_passes_when_no_coverage_data(self, tmp_path):
        """Coverage step should pass when no coverage data exists."""
        assert coverage.run(tmp_path) is True
