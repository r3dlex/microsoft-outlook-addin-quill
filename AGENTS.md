# Agents

This file defines sub-agent roles, their responsibilities, and which spec files they must read before starting work. Every agent MUST read `spec/overview.md` first for project context.

## General Rules

- Before starting any implementation step, read all spec files listed for your role.
- After completing a step, update all relevant `*.md` files (spec files, CLAUDE.md, this file, README.md).
- README.md is always updated last.
- All pipelines run through `tools/pipeline_runner`. See `spec/pipelines.md`.
- ADR validation via `@archgate/cli` is mandatory. See `spec/pipelines.md`.
- Coverage thresholds are enforced by pipelines. Code must meet targets before merge.

---

## Agent: Frontend

**Role**: Vue task pane development, Office.js integration, UI components, LLM client services.

**Required reading before work**:
- `spec/overview.md` - Project context and architecture
- `spec/vue-frontend.md` - Full frontend spec, project structure, Office.js integration notes
- `spec/tab1-email-ai.md` - Tab 1 feature requirements (current-item AI operations)
- `spec/tab2-automation.md` - Tab 2 feature requirements (smart actions on selected items)
- `spec/llm-providers.md` - LLM provider APIs, CORS considerations, streaming
- `spec/auth.md` - API key encryption, passphrase management, Web Crypto API
- `spec/storage.md` - roamingSettings, customProperties, localStorage usage
- `spec/manifest.md` - Manifest format
- `spec/constraints.md` - Office.js limitations, CORS, storage limits
- `spec/pipelines.md` - Coverage targets (75% line coverage), UI test requirements

**Key responsibilities**:
- Vue 3 + Vite project (no Yeoman template)
- Office.js bootstrap with `Office.onReady()` and history API cache/restore
- `useOffice()` composable wrapping all Office.js callbacks
- LLM provider clients (`src/services/llm/`) with streaming via ReadableStream
- Web Crypto encryption service (`src/services/crypto.ts`)
- Storage service (`src/services/storage.ts`) wrapping roamingSettings
- `useChat()` composable for direct LLM streaming
- Pinia stores for auth, chat, settings state
- Views: EmailAiView, AutomationView (Smart Actions), SettingsView
- Shared components: ChatMessage, ProviderSelector, LoadingIndicator
- VitePress documentation site
- UI tests with mocked Office.js and MSW for LLM API mocking

---

## Agent: Pipeline

**Role**: CI/CD pipeline setup, coverage enforcement, ADR validation, test orchestration.

**Required reading before work**:
- `spec/overview.md` - Project context
- `spec/pipelines.md` - Full pipeline spec, coverage targets, ADR integration, testing strategy
- `spec/constraints.md` - Testing strategy details
- `spec/dev-setup.md` - Prerequisites, build commands

**Key responsibilities**:
- `tools/pipeline_runner` Python module with Poetry (`pyproject.toml`)
- Zero-install: `poetry install && poetry run pipeline-runner <command>`
- Pipeline steps: lint, test, ui-test, build, coverage, adr-check, manifest-validate
- Coverage enforcement: 75% frontend, 90% pipeline runner
- `@archgate/cli` integration for ADR validation
- Pipeline runner's own test suite (pytest)

---

## Agent: Manifest

**Role**: Outlook add-in manifest creation and validation.

**Required reading before work**:
- `spec/overview.md` - Project context
- `spec/manifest.md` - Manifest spec
- `spec/constraints.md` - Sideloading vs admin deployment constraints

**Key responsibilities**:
- `manifests/manifest.xml` (single manifest, no variants)
- No `<WebApplicationInfo>` (no Graph API)
- Ribbon icons (16x16, 32x32, 80x80) in `frontend/src/assets/icons/`
- Manifest validation via `npx office-addin-manifest validate`

---

## Agent: DevOps

**Role**: Development environment setup, deployment configuration, documentation.

**Required reading before work**:
- `spec/overview.md` - Project context
- `spec/dev-setup.md` - Full dev setup spec
- `spec/pipelines.md` - Pipeline runner setup
- `spec/llm-providers.md` - CORS proxy requirements

**Key responsibilities**:
- CORS proxy deployment (Cloudflare Worker template)
- Static site deployment guide
- SSL certificate generation scripts
- Sideloading instructions

---

## Agent: ADR

**Role**: Architecture Decision Records.

**Required reading before work**:
- `spec/overview.md` - All architectural decisions
- `spec/llm-providers.md` - Provider selection and CORS decisions
- `spec/vue-frontend.md` - Vue 3 + Vite decision
- `spec/manifest.md` - XML manifest decision
- `spec/storage.md` - Storage architecture decisions
- `spec/auth.md` - Encryption approach decision
- `spec/pipelines.md` - ADR validation requirements

**Key responsibilities**:
- `docs/adr/` directory with ADR template
- Initial ADRs:
  - ADR-001: XML manifest over unified JSON manifest
  - ADR-002: Pure client-side architecture (no backend server)
  - ADR-003: Vue 3 + Vite over Yeoman Office template
  - ADR-004: Web Crypto API for API key encryption
  - ADR-005: CORS proxy for LLM provider access
  - ADR-006: Python pipeline runner over shell scripts
  - ADR-007: MiniMax via Anthropic-compatible API reuse
  - ADR-008: roamingSettings for cross-device settings sync
- `@archgate/cli` configuration for ADR validation

---

## Workflow: Implementation Steps

Each phase from `spec/overview.md` should follow this pattern:

1. **Read** all spec files listed for the agents involved
2. **Plan** the implementation (use `EnterPlanMode` for non-trivial work)
3. **Implement** the code changes
4. **Test** with coverage enforcement via `tools/pipeline_runner`
5. **Update docs** - all relevant `spec/*.md`, `CLAUDE.md`, `AGENTS.md`
6. **Update README.md** last (always the final file updated)

### Phase 1: Foundation
- Agents: Frontend, Pipeline, Manifest, ADR
- Spec files: all of `spec/`
- Deliverables: Vue scaffold, Office.js integration, roamingSettings persistence, Web Crypto encryption, Claude provider client, Tab 1 summarize/reply, pipeline runner, manifest, ADRs

### Phase 2: Multi-Provider and Compose
- Agents: Frontend
- Spec files: `spec/llm-providers.md`, `spec/tab1-email-ai.md`, `spec/vue-frontend.md`
- Deliverables: OpenAI/Gemini/MiniMax clients, provider selector, compose features, streaming

### Phase 3: Smart Actions
- Agents: Frontend
- Spec files: `spec/tab2-automation.md`, `spec/constraints.md`
- Deliverables: Tab 2 multi-select operations, batch categorize, bulk extraction, bulk drafts

### Phase 4: Polish
- Agents: Frontend, DevOps
- Spec files: all of `spec/`
- Deliverables: Smart Alerts, Gemini OAuth, CORS proxy template, deployment guide, performance
