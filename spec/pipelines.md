# Pipelines and CI/CD

## Pipeline Runner

All pipelines are run using the `tools/pipeline_runner` Python module. Zero-install based (no global deps required).

### Stack
- Python 3.12+
- `pyproject.toml` with Poetry for dependency management
- Zero-install: `poetry install && poetry run pipeline-runner <command>`

### Project Structure
```
tools/
└── pipeline_runner/
    ├── pyproject.toml
    ├── poetry.lock
    ├── README.md
    ├── pipeline_runner/
    │   ├── __init__.py
    │   ├── __main__.py           # CLI entrypoint
    │   ├── runner.py             # Core pipeline orchestrator
    │   ├── steps/
    │   │   ├── __init__.py
    │   │   ├── lint.py           # Linting (frontend only)
    │   │   ├── test.py           # Unit tests with coverage
    │   │   ├── ui_test.py        # UI/E2E tests
    │   │   ├── build.py          # Build frontend
    │   │   ├── coverage.py       # Coverage enforcement
    │   │   ├── adr_check.py      # @archgate/cli ADR validation
    │   │   └── manifest.py       # Manifest validation
    │   └── config.py             # Pipeline configuration
    └── tests/
        ├── __init__.py
        ├── test_runner.py
        └── test_steps.py
```

### Commands
```bash
cd tools/pipeline_runner
poetry install
poetry run pipeline-runner lint
poetry run pipeline-runner test
poetry run pipeline-runner ui-test
poetry run pipeline-runner build
poetry run pipeline-runner coverage
poetry run pipeline-runner adr-check
poetry run pipeline-runner all        # Run full pipeline
```

## Coverage Targets

Basic coverage must be warranted by pipelines. Minimum thresholds:

| Component | Target | Tool |
|-----------|--------|------|
| Vue frontend (TypeScript) | 75% line coverage | Vitest + Istanbul/v8 |
| Pipeline runner (Python) | 90% line coverage | pytest + coverage.py |

Coverage is enforced by `pipeline_runner/steps/coverage.py`. Pipeline fails if thresholds are not met.

## ADR Validation

Architecture Decision Records (ADRs) are validated using `@archgate/cli`.

- ADRs stored in `docs/adr/` directory
- `@archgate/cli` checks that:
  - All ADRs follow the expected template format
  - Referenced components exist in the codebase
  - No orphaned or contradictory decisions
- Integrated into the pipeline via `pipeline_runner/steps/adr_check.py`
- Pipeline fails if ADR validation fails

## Testing Strategy (Pipeline-Enforced)

### Unit Tests
- **Frontend**: `npx vitest run --coverage`, enforced via Vitest coverage thresholds in `vite.config.ts`
- **Pipeline runner**: `pytest --cov=pipeline_runner --cov-fail-under=90`

### UI Tests
- Mocked Office.js environment for task pane component testing
- Verify that mocked functionality (Office.js stubs, AI provider stubs) works as per expectation
- Framework: Playwright or Cypress for E2E browser tests against the Vue task pane
- Mock LLM API responses via MSW (Mock Service Worker)

### Integration Tests
- AI provider mocking via MSW
- Office.js mocking via `@anthropic/office-addin-mock` or custom stubs
- Sideload testing in OWA with test mailbox

## Pipeline Stages (Full Run)

1. **Lint** - Vue/TypeScript (`npx eslint .`), Python (`ruff`)
2. **Test** - Unit tests for frontend and pipeline runner with coverage enforcement
3. **UI Test** - E2E tests for Vue task pane with mocked Office.js and LLM APIs
4. **ADR Check** - `@archgate/cli` validation of architecture decisions
5. **Build** - Vue/Vite production build, VitePress docs build
6. **Manifest Validation** - `npx office-addin-manifest validate`
