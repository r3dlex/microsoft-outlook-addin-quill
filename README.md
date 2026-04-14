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
| Frontend | Vue 3, Vite, TypeScript, Pinia, VitePress, PrimeVue v4 |
| Styling | Tailwind CSS v4 (CSS-first config), CSS custom properties |
| Office Integration | Office.js (read/compose email, categories, multi-select) |
| AI Providers | Claude, OpenAI, Gemini, MiniMax (direct HTTPS fetch) |
| Encryption | Web Crypto API (AES-256-GCM, PBKDF2) |
| Storage | roamingSettings (synced), localStorage (local), customProperties (per-item) |
| CORS Proxy | Cloudflare Worker (for providers without browser CORS) |
| Pipelines | Python, Poetry, @archgate/cli |

## Icon Assets

All icon variations are generated from the source SVG and live in `frontend/public/assets/`.

| File | Size | Purpose |
|------|------|---------|
| `logo.svg` | vector | Source logo, app header, VitePress |
| `icon-16.png` | 16x16 | Outlook ribbon (small) |
| `icon-32.png` | 32x32 | Outlook ribbon (medium), favicon |
| `icon-64.png` | 64x64 | Outlook store listing |
| `icon-80.png` | 80x80 | Outlook ribbon (large) |
| `icon-128.png` | 128x128 | Outlook high-res icon |
| `icon-256.png` | 256x256 | README, marketing |
| `favicon.ico` | 16+32+48 | Browser tab |
| `apple-touch-icon.png` | 180x180 | iOS home screen |
