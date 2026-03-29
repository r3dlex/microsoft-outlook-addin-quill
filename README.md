<p align="center">
  <img src="frontend/public/logo.svg" alt="Quill Logo" width="128" height="128">
</p>

<h1 align="center">Quill</h1>
<p align="center"><strong>AI Mail Assistant for Microsoft Outlook</strong></p>
<p align="center">Pure client-side Outlook Add-in with multi-LLM support (Claude, OpenAI, Gemini, MiniMax).<br>Vue 3 task pane, no backend server. LLM API calls made directly from the browser.</p>

---

## Documentation

- `CLAUDE.md` - Project instructions for Claude Code
- `AGENTS.md` - Sub-agent roles and delegation patterns
- `spec/` - Detailed specification files:
  - `overview.md` - Architecture and implementation phases
  - `vue-frontend.md` - Vue 3 + Vite + VitePress frontend
  - `llm-providers.md` - AI provider APIs and CORS proxy
  - `tab1-email-ai.md` - Email AI features (current item)
  - `tab2-automation.md` - Smart Actions (selected items)
  - `manifest.md` - Outlook XML manifest
  - `auth.md` - API key encryption with Web Crypto
  - `storage.md` - roamingSettings, customProperties, localStorage
  - `pipelines.md` - CI/CD, coverage, ADR validation
  - `constraints.md` - Limitations and security
  - `dev-setup.md` - Development and deployment

## Quick Start

```bash
cd frontend && npm install && npm run dev
# Sideload manifests/manifest.xml via https://aka.ms/olksideload
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3, Vite, TypeScript, Pinia, VitePress |
| Office Integration | Office.js (read/compose email, categories, multi-select) |
| AI Providers | Claude, OpenAI, Gemini, MiniMax (direct HTTPS fetch) |
| Encryption | Web Crypto API (AES-256-GCM, PBKDF2) |
| Storage | roamingSettings (synced), localStorage (local), customProperties (per-item) |
| CORS Proxy | Cloudflare Worker (for providers without browser CORS) |
| Pipelines | Python, Poetry, @archgate/cli |
