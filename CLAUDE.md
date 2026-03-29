# Quill - AI Mail Assistant for Microsoft Outlook

Pure client-side Outlook Add-in (Vue 3 + Vite + TypeScript) with multi-LLM support (Claude, OpenAI, Gemini, MiniMax). No backend server. LLM API calls made directly from the task pane. VitePress for documentation.

## Spec

Full specification split across `spec/*.md` files. Read `spec/overview.md` first for project context.

## Agents

See `AGENTS.md` for agent-specific instructions, sub-agent definitions, and task delegation patterns.

## Commands

```bash
# Development
cd frontend && npm install && npm run dev   # HTTPS dev server on port 4200
cd frontend && npm run build                # Production build
cd frontend && npx vitest run --coverage    # Tests with coverage

# VitePress docs
cd frontend && npx vitepress dev docs       # Dev docs server
cd frontend && npx vitepress build docs     # Build docs

# Pipeline
cd tools/pipeline_runner && poetry install
poetry run pipeline-runner all              # Full pipeline

# Manifest validation
npx office-addin-manifest validate manifests/manifest.xml
```

## Key Architecture Decisions

- Pure client-side add-in. No backend server, no database.
- Office.js for all Outlook operations (read/compose email, categories, multi-select).
- LLM API calls go directly from browser to provider APIs via fetch() with ReadableStream for streaming.
- CORS proxy (Cloudflare Worker) needed for providers that don't support browser CORS (Anthropic, OpenAI, MiniMax). Gemini supports CORS natively.
- API keys encrypted with Web Crypto API (AES-256-GCM, PBKDF2 key derivation from user passphrase).
- Settings and encrypted keys stored in `Office.context.roamingSettings` (32KB, syncs across devices).
- Chat history stored in localStorage (device-local, auto-pruned).
- Per-item metadata stored in `item.customProperties` (2,500 chars).

## Things That Will Bite You

- Office.js nullifies `window.history.pushState`. Cache and restore it BEFORE Office.js loads or Vue Router breaks.
- `roamingSettings` has a 32KB limit. Be frugal with what you store.
- Most LLM APIs don't set CORS headers. You MUST use a CORS proxy for Anthropic/OpenAI/MiniMax.
- Event-based activation (Smart Alerts) requires admin deployment. Will not fire when sideloaded.
- `loadItemByIdAsync` (needed for multi-select full content) requires requirement set 1.14+.
- Older Outlook clients use IE-based WebView (no ReadableStream). Target WebView2+ only.

## Code Conventions

- Vue: Composition API with `<script setup lang="ts">`. Pinia for state management. Composables for Office.js and chat integration.
- TypeScript strict mode everywhere.
- All Office.js API calls go through `useOffice()` composable.
- LLM provider clients in `src/services/llm/` with shared interface.
- Python pipeline runner: Poetry, pyproject.toml, ruff for linting, pytest for tests.
