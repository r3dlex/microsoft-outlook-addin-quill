# ADR-006: Python Pipeline Runner Over Shell Scripts

## Status

Accepted

## Context

Quill's CI/CD pipeline orchestrates tasks across three technology stacks: Elixir/Phoenix (backend), Vue/TypeScript (frontend), and Python (pipeline tooling). A unified runner must invoke linters, test suites, build steps, coverage enforcement, ADR validation, and manifest validation. Options include raw shell scripts, Make, a Node.js-based runner, or a Python CLI tool. The project already uses Python for tooling, and the team is proficient in it.

## Decision

We implement the pipeline runner as a Python CLI tool using Click for command parsing and Rich for terminal output. The tool lives at `tools/pipeline_runner/` with Poetry for dependency management. Each pipeline stage is a separate module under `steps/` with a uniform `run(project_root) -> bool` interface. The runner executes steps sequentially and reports results in a summary table.

## Consequences

- A single `poetry run pipeline-runner all` command runs the entire pipeline.
- Python provides robust subprocess management, cross-platform path handling, and rich output formatting.
- The runner itself has 90% test coverage enforced, ensuring pipeline reliability.
- Contributors need Python 3.12+ and Poetry installed, but these are lightweight requirements.
- Shell-specific edge cases (quoting, exit codes, platform differences) are handled by Python's subprocess module rather than raw shell.
