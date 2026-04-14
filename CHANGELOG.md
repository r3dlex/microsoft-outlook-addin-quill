# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2026-04-14

### Added
- **PrimeVue v4** (`primevue@^4`, `@primevue/themes`) — component library integration with `unstyled: true` mode for full Tailwind compatibility
- **Tailwind CSS v4** (`tailwindcss@^4`) — CSS-first configuration with `@tailwind` directives; design tokens preserved as CSS custom properties
- **QuillPreset** — custom PrimeVue theme preset mapping Outlook Fluent palette (#0078d4 primary) to design token system
- App-wide `ToastService` and `DialogService` wired via PrimeVue singleton
- PrimeVue `ProgressSpinner` replacing custom spinner in `LoadingIndicator`
- PrimeVue `Message` replacing custom chat message markup in `ChatMessage`
- PrimeVue `Textarea` replacing raw `<textarea>` in `ChatPanel`
- PrimeVue `Button` replacing all custom send/cancel/submit buttons across the app
- PrimeVue `InputText` replacing raw `<input>` elements in `ChatPanel` and `SearchPanel`
- PrimeVue `Select` replacing raw `<select>` elements in `ProviderSelector` and `ProviderConfig`
- PrimeVue `Password` replacing raw `<input type="password">` in `ProviderConfig`
- PrimeVue `Accordion` replacing raw settings sections in `ProviderConfig`
- PrimeVue `Panel` wrapping email context display in `EmailAiView`
- PrimeVue `Tag` replacing inline category chips in `EmailAiView`
- PrimeVue `Card` wrapping `EmptyState` placeholder, settings about section, `SearchPanel`, `BatchPanel`, `RulesEditor`, and automation view sections
- PrimeVue `TabView` replacing custom tab-bar implementation in `App.vue`

### Changed
- **Breaking**: `App.vue` — tab navigation now uses PrimeVue `TabView`/`TabPanel` with `v-model:activeIndex` binding; removed `@tab-change` event handler
- Migrated all form inputs to PrimeVue component wrappers while preserving data flow and emit behavior
- CSS reset replaced with `@tailwind base/components/utilities` directives

### Fixed
- SSL certificate files (`localhost-key.pem`, `localhost.pem`) generated for HTTPS dev server (required by Outlook add-in)
- ESLint unused variable false positives on composable destructuring

### Technical
- `tailwind.config.js` created with content paths for JIT compilation
- `postcss.config.js` created with `tailwindcss` and `autoprefixer` plugins
- `frontend/src/styles/quill-preset.ts` — custom PrimeVue 4 theme preset using `@primeuix/themes/aura` as base

### Test Coverage
- Vitest bootstrap: `happy-dom` environment, `src/__tests__/setup.ts` with localStorage mock and Pinia reset
- `src/__tests__/stores/auth.test.ts` — 7 tests (100% lines)
- `src/__tests__/stores/chat.test.ts` — 7 tests (98% lines)
- `src/__tests__/stores/settings.test.ts` — 12 tests (100% lines)
- Stores coverage: 99.38% lines (threshold: 75%)

## [0.1.0] - 2025-01-01

### Added
- Initial scaffold — pure client-side Outlook add-in with Vue 3 + Vite
- Multi-LLM support (Claude, OpenAI, Gemini, MiniMax)
- Office.js integration (read/compose email, categories)
- Web Crypto API encryption for API keys
- VitePress documentation
