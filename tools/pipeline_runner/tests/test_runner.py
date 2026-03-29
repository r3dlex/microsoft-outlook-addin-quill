"""Tests for the pipeline runner orchestrator."""

from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest

from pipeline_runner.runner import STEP_MODULES, run_pipeline


class TestRunPipeline:
    """Tests for run_pipeline function."""

    def test_unknown_step_fails(self, tmp_path):
        """An unknown step name should cause the pipeline to fail."""
        with pytest.raises(SystemExit):
            run_pipeline(tmp_path, ["nonexistent_step"])

    @patch("pipeline_runner.runner.importlib.import_module")
    def test_single_passing_step(self, mock_import, tmp_path):
        """A single passing step should return True."""
        mock_module = MagicMock()
        mock_module.run.return_value = True
        mock_import.return_value = mock_module

        result = run_pipeline(tmp_path, ["lint"])
        assert result is True
        mock_module.run.assert_called_once_with(tmp_path)

    @patch("pipeline_runner.runner.importlib.import_module")
    def test_single_failing_step(self, mock_import, tmp_path):
        """A single failing step should raise SystemExit."""
        mock_module = MagicMock()
        mock_module.run.return_value = False
        mock_import.return_value = mock_module

        with pytest.raises(SystemExit):
            run_pipeline(tmp_path, ["lint"])

    @patch("pipeline_runner.runner.importlib.import_module")
    def test_multiple_steps_all_pass(self, mock_import, tmp_path):
        """Multiple passing steps should return True."""
        mock_module = MagicMock()
        mock_module.run.return_value = True
        mock_import.return_value = mock_module

        result = run_pipeline(tmp_path, ["lint", "test"])
        assert result is True
        assert mock_module.run.call_count == 2

    @patch("pipeline_runner.runner.importlib.import_module")
    def test_step_exception_is_caught(self, mock_import, tmp_path):
        """A step that raises an exception should be treated as a failure."""
        mock_module = MagicMock()
        mock_module.run.side_effect = RuntimeError("boom")
        mock_import.return_value = mock_module

        with pytest.raises(SystemExit):
            run_pipeline(tmp_path, ["lint"])

    def test_step_modules_registry_has_expected_keys(self):
        """STEP_MODULES should contain all expected pipeline steps."""
        expected = {"lint", "test", "ui_test", "build", "coverage", "adr_check", "manifest"}
        assert set(STEP_MODULES.keys()) == expected
