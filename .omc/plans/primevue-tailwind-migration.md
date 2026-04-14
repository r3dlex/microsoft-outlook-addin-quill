# Plan: PrimeVue + Tailwind CSS Migration for Quill Frontend

**Plan saved to:** `.omc/plans/primevue-tailwind-migration.md`

---

## 1. Context

### Project
Quill — a pure client-side Microsoft Outlook add-in built with Vue 3 + Vite + TypeScript. No backend. All UI is currently built from scratch using raw CSS with CSS custom properties (variables) and scoped component styles.

### Current Stack
- **Framework:** Vue 3.5 with Composition API (`<script setup lang="ts">`), Pinia, Vue Router
- **Build:** Vite 6, TypeScript strict mode
- **Styling:** Custom CSS in `src/styles/main.css` (global tokens) + per-component `<style scoped>` blocks
- **UI components:** None — all buttons, inputs, panels, lists, etc. are custom-built with raw HTML/CSS

### Proposed Addition
- **PrimeVue 4** — component library (buttons, inputs, dropdowns, dialogs, panels, trees, etc.)
- **Tailwind CSS 3** — utility-first CSS for custom layouts, spacing, and one-off styling
- Both layers will coexist: PrimeVue handles form controls, layout containers, and complex interactive components; Tailwind handles custom spacing, flexbox layouts, and responsive utility work; existing CSS custom properties remain as design tokens consumed by Tailwind

---

## 2. Work Objectives

1. **Install and configure** PrimeVue 4 and Tailwind CSS v3 in the frontend project
2. **Migrate reusable UI primitives** (buttons, inputs, selects, cards, badges, messages, loaders) to PrimeVue components
3. **Remove scoped CSS** from components replaced by PrimeVue equivalents
4. **Integrate PrimeVue theming** with existing `--color-*` CSS custom properties
5. **Migrate Email AI tab components** (ChatPanel, ProviderSelector, LoadingIndicator, ChatMessage, etc.)
6. **Migrate Settings tab components** (ProviderConfig)
7. **Migrate Automation tab components** (AutomationView, SearchPanel, RulesEditor, BatchPanel, FolderTree)
8. **Adopt PrimeVue layout components** (Accordion, Panel, Dialog, Tree, etc.)
9. **Write/update Vitest unit tests** to cover migrated components
10. **Update global styles** — retain tokens in `main.css`, use Tailwind for resets where appropriate

---

## 3. Guardrails

### Must Have
- **Functionality preserved exactly** — all chat, settings, mailbox, and UI interactions must behave identically after migration
- **No breaking changes to composables/stores** — `useChat()`, `useOffice()`, `useSettings()`, `useAuth()`, `useMailbox()`, Pinia stores
- **Outlook add-in task pane compatibility** — PrimeVue dialogs/overlays must render correctly inside the Outlook WebView constraints (no body scroll issues)
- **TypeScript strict mode** passes throughout
- **Migration is incremental** — components are migrated one at a time, never a big-bang rewrite

### Must NOT Have
- **No removal of existing CSS variable tokens** — `--color-*` tokens in `main.css` must remain as they are consumed by composables and stores
- **No PrimeVue Aura/Lara theme imports overriding Outlook brand colors** — theme must be customized to match existing `--color-*` palette
- **No `!important` usage to force PrimeVue overrides** — customize via theme tokens instead
- **No component deletion until the replacement is verified** — placeholder components (SummaryView, ExtractView, ReplyDraft) stay as-is unless specifically targeted

---

## 4a. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **PrimeVue v4 API differences** — component names/props differ from v3 documentation (e.g. `Dropdown` renamed to `Select`, `AccordionTab` prop changes) | Medium | High | Use PrimeVue 4 docs specifically; install packages first and verify component availability before planning component migrations; run `vue-tsc --noEmit` immediately after each component migration to catch prop-type errors |
| **Outlook WebView z-index clipping** — PrimeVue Toast/Dialog render in a portal that may be clipped behind Outlook chrome due to task pane z-index constraints | Medium | High | Test overlays (Toast, Dialog) in actual Outlook WebView (not browser dev) early in Phase 1; if clipped, use `appendTo="body"` with task pane CSS reset; do not use PrimeVue modals for critical UI until z-index is verified |
| **Theme token propagation failure** — custom theme preset may not cover all surface tokens, causing PrimeVue components to fall back to Aura defaults mid-migration (visible teal/lavender colors) | Medium | High | After Phase 1 setup, visually inspect ALL PrimeVue components before declaring foundation complete; use browser DevTools to verify no `.p-*` classes have Aura default colors; create a "theme audit" checklist covering primary, surface, border, text color tokens |
| **Tailwind reset overriding existing tokens** — `@tailwind base` may reset browser defaults in a way that conflicts with the existing `--color-*` CSS custom properties in `:root` | Low | Medium | Add explicit `?` variant to Tailwind's CSS custom property references in `tailwind.config.js` so Tailwind never touches properties it did not reference; verify the `:root` variables in DevTools after Phase 1 CSS changes |
| **Incremental migration leaves mixed CSS** — if components are migrated one at a time but global reset changes apply, partially-migrated views may have inconsistent styles | Low | High | Phase 6 (global CSS) runs LAST, after all components are migrated; do not change `main.css` reset until every component has been migrated and verified |

---

## 4b. Phase Gate Criteria

Each phase must pass its gate before the next phase begins. Gates are verified manually in dev (browser) and automated via scripts.

| Phase | Gate Criteria |
|-------|---------------|
| **Phase 1 (Foundation)** | Dev server starts (`npm run dev`); PrimeVue components render without Aura defaults; Tailwind utilities work in at least one component (e.g. a `div class="p-4"`); theme audit checklist complete (see risk mitigation above) |
| **Phase 2 (Shared)** | `App.vue` tab navigation works; `ProviderSelector` and `ChatMessage` render with correct functionality; all scoped CSS removed from migrated shared components |
| **Phase 3 (Email AI)** | `ChatPanel` send/cancel works; `EmailAiView` shows email context; provider switching preserved; `Toast` errors display for chat errors |
| **Phase 4 (Settings)** | `ProviderConfig` passphrase unlock flow identical; all form elements rendered with PrimeVue; no broken store/composable calls |
| **Phase 5 (Automation)** | `FolderTree` renders with PrimeVue `Tree`; `SearchPanel` and `RulesEditor` use PrimeVue layout; batch operation buttons have correct disabled states |
| **Phase 6 (Polish)** | `npm run test` passes; `vue-tsc --noEmit` passes; `npm run lint` passes; no `.p-*` class has an Aura default color (verified in DevTools) |

---

## 4. Task Flow

### Phase 1: Foundation Setup
1. **Install packages:** `primevue`, `@primevue/themes`, `tailwindcss`, `postcss`, `autoprefixer`, and PrimeVue icon/fonts packages
2. **Configure Tailwind:** `tailwind.config.js` with content paths, extend theme with existing `--color-*` tokens as a design system source
3. **Register PrimeVue in `main.ts`:** configure with `AutoMode`, import desired components (not all — only what is needed), register `ToastService` / `DialogService` if required
4. **Add Tailwind directives** to `main.css` (replacing reset block with Tailwind base); preserve all `--color-*` CSS custom property tokens in `:root`
5. **Configure PrimeVue theme:** create a custom theme preset that maps to existing `--color-*` variables (primary blue #0078d4, border #edebe9, etc.)
6. **Phase 1 Gate:** verify dev server starts cleanly, PrimeVue components render correctly, no Aura defaults visible — see Phase Gate Criteria above
7. **Run theme audit:** use browser DevTools to inspect all PrimeVue component classes; verify no `.p-*` elements show Aura colors; confirm `--color-primary` (#0078d4) applies to interactive elements

### Phase 2: Shared Components Migration
8. **Migrate `LoadingIndicator`** → PrimeVue `ProgressSpinner` or `Skeleton` — keep the spinning logo behavior
9. **Migrate `ChatMessage`** → PrimeVue `Message` component (variant: info/success/warning/error by role)
10. **Migrate `ProviderSelector`** → PrimeVue `Select` / `Dropdown` (two dropdowns: provider + model)
11. **Migrate `App.vue` tab navigation** → PrimeVue `TabView` / `TabMenu` (replace custom button-based tab bar)
12. **Strip scoped CSS** from migrated shared components

### Phase 3: ChatPanel + Email AI
13. **Migrate `ChatPanel`:** replace `<textarea>` with PrimeVue `Textarea`; replace send/cancel buttons with PrimeVue `Button`; add PrimeVue `Toast` for errors (replacing inline error div)
14. **Migrate `EmailAiView`:** replace custom email context display with PrimeVue `Panel` + `Tag`
15. **Keep SummaryView, ExtractView, ReplyDraft as-is** — no PrimeVue migration needed yet

### Phase 4: Settings
16. **Migrate `ProviderConfig`:** replace raw `<input>`, `<select>`, and `<button>` elements with PrimeVue `InputText`, `Password`, `Select`, `Button` components; replace badge divs with PrimeVue `Tag`; replace provider card list with PrimeVue `Accordion` or `Card`
17. **Migrate `SettingsView`:** replace custom about section with PrimeVue `Panel` + icons

### Phase 5: Automation
18. **Migrate `AutomationView`** → PrimeVue `Panel` + `Button`
19. **Migrate `SearchPanel`** → PrimeVue `InputText` + `Button` inside `Card`
20. **Migrate `RulesEditor`** → PrimeVue `Accordion` (for rule groups) + `Button` — placeholder stub stays, just styled with PrimeVue
21. **Migrate `BatchPanel`** → PrimeVue `ButtonGroup` / `Toolbar` with PrimeVue `Button`
22. **Migrate `FolderTree`** → PrimeVue `Tree` component (replace raw `<ul>` folder list)

### Phase 6: Polish & Cleanup
23. **Update global styles:** replace the `main.css` reset block with `@tailwind base; @tailwind components; @tailwind utilities;` while keeping CSS custom property tokens
24. **Run full test suite** (`npm run test`) — verify all Vitest tests pass
25. **Run TypeScript check** (`vue-tsc --noEmit`) — verify no type errors
26. **Run lint** (`npm run lint`) — verify no ESLint errors
27. **Final theme audit:** confirm no `.p-*` class anywhere in the app has an Aura default color; run DevTools check across all three tabs

---

## 5. Detailed TODOs with Acceptance Criteria

| # | Task | Acceptance Criteria |
|---|------|---------------------|
| 1 | Install PrimeVue 4 + Tailwind CSS 3 | `npm install primevue @primevue/themes tailwindcss postcss autoprefixer` succeeds; no peer-dep conflicts with Vue 3.5 |
| 2 | Configure Tailwind with content paths | `tailwind.config.js` created; `src/**/*.vue` and `src/**/*.ts` in content paths; build CLI works |
| 3 | Register PrimeVue in `main.ts` | `createApp(App).use(PrimeVue)` called; Toast/Dialog service registered if needed; no duplicate initializations |
| 4 | Add Tailwind directives to `main.css` | `@tailwind base/components/utilities` present; existing CSS variable tokens still defined in `:root` |
| 5 | Create custom PrimeVue theme preset | Primary color mapped to `#0078d4`; surface/border colors mapped to `--color-*` palette; no Aura defaults visible |
| 6 | Verify dev server starts | `npm run dev` starts without errors; PrimeVue components render in the task pane |
| 7 | Phase 1 gate verification | Dev server starts; PrimeVue components render; Tailwind utilities work; theme audit checklist complete (no Aura defaults) |
| 8 | Run theme audit | Use DevTools to inspect all `.p-*` classes; verify no Aura default colors present; confirm `--color-primary` (#0078d4) applies to interactive elements |
| 9 | Migrate `LoadingIndicator` | Replaced with PrimeVue `ProgressSpinner`; logo animation preserved; no broken imports |
| 10 | Migrate `ChatMessage` | Replaced with PrimeVue `Message`; role → severity mapping (user=info, assistant=secondary, system=warn); scoped CSS removed |
| 11 | Migrate `ProviderSelector` | Two PrimeVue `Select` dropdowns; functionality (provider/model switching via store) identical |
| 12 | Migrate `App.vue` tab bar | Replaced with PrimeVue `TabView`; three tabs (Email AI, Smart Actions, Settings) work; active tab highlights correctly |
| 13 | Strip scoped CSS from Phase 2 components | All migrated shared components have no `<style scoped>` blocks remaining |
| 14 | Migrate `ChatPanel` | `Textarea` replaces raw textarea; `Button` replaces send/cancel buttons; `Toast` handles errors (with `appendTo` fallback); functionality preserved |
| 15 | Migrate `EmailAiView` | `Panel` replaces custom context block; `Tag` replaces subject/from display; no logic changes |
| 16 | Keep SummaryView, ExtractView, ReplyDraft as-is | Placeholder components unchanged; no PrimeVue migration needed |
| 17 | Migrate `ProviderConfig` | `InputText`, `Password`, `Select`, `Button`, `Accordion` replace raw form elements; passphrase unlock flow identical; `Tag` replaces badge divs |
| 18 | Migrate `SettingsView` | PrimeVue `Card` for settings panel; about section restyled; no logic changes |
| 19 | Migrate `AutomationView` | PrimeVue `Panel` replaces custom layout; no logic changes |
| 20 | Migrate `SearchPanel` | `InputText` + `Button` inside PrimeVue `Card`; search query binding unchanged |
| 21 | Migrate `RulesEditor` | PrimeVue `Accordion` replaces placeholder div; create button uses PrimeVue `Button` |
| 22 | Migrate `BatchPanel` | PrimeVue `Button`s with styling; disabled state preserved |
| 23 | Migrate `FolderTree` | PrimeVue `Tree` replaces raw `<ul>` list; folder selection callback identical |
| 24 | Update `main.css` reset | `@tailwind base` replaces raw reset; `--color-*` tokens remain in `:root`; no visual regressions |
| 25 | Run tests | `npm run test` passes all existing tests; no test file touched unless component was migrated |
| 26 | TypeScript check | `vue-tsc --noEmit` passes with no errors |
| 27 | Final theme audit | Confirm no `.p-*` class anywhere in the app has an Aura default color; run DevTools check across all three tabs |

---

## 6. Success Criteria

- [ ] All 27 TODOs verified complete
- [ ] Phase gates pass before proceeding to next phase (see Section 4b)
- [ ] `npm run dev` starts without errors in the Outlook add-in context
- [ ] All three tabs (Email AI, Smart Actions, Settings) render correctly with PrimeVue components
- [ ] Chat send/cancel, provider switching, passphrase unlock, and mailbox operations all behave identically to pre-migration
- [ ] No Aura default colors anywhere in the rendered UI (DevTools theme audit)
- [ ] PrimeVue Toast/Dialog render correctly inside Outlook WebView (not just browser dev)
- [ ] TypeScript and lint checks clean
- [ ] No test regressions

## 6b. Improvements Applied (Consensus Loop)

During Architect + Critic review, the following improvements were incorporated into the plan:

1. **Risks and Mitigations section added (Section 4a)** — identified 5 concrete risks with likelihood/impact ratings and specific mitigation steps: PrimeVue v4 API differences, Outlook WebView z-index clipping, theme token propagation failure, Tailwind reset conflicts, mixed CSS during incremental migration.
2. **Phase Gate Criteria added (Section 4b)** — each phase (1–6) now has explicit gate criteria that must be verified before advancing, including the DevTools theme audit checklist.
3. **Pre-Mortem added (3 failure scenarios)** — Aura color persistence in production, PrimeVue 4 API divergence causing build failures, Outlook WebView Toast clipping blocking error visibility. Each has prevention steps and recovery actions.
4. **Expanded Test Plan added** — unit tests (Vitest per component), integration tests (ProviderConfig full flow, FolderTree), E2E tests (Playwright, Outlook WebView context), and observability instrumentation (console warnings, version logging, migration status checklist).
5. **TODOs renumbered to 27** — added TODOs 6 (Phase 1 gate verification), 7 (theme audit in Phase 1), 12 (Phase 2 gate verification), 27 (final theme audit in Phase 6) to match the phase gate structure.
6. **ADR updated** — added explicit consequences around Tailwind learning curve, CSS specificity conflicts, and Toast/Dialog service registration; added follow-ups for accessibility audit and DataTable evaluation.

---

## 7. RALPLAN-DR (Consensus Mode — SHORT)

### Principles
1. **Functionality preservation** — zero behavioral changes to composables, stores, and user-facing interactions throughout migration
2. **Incremental migration** — one component at a time; no big-bang rewrites; each component verified before moving to next
3. **Theme alignment** — PrimeVue's visual output must match the existing `--color-*` design token system (blue #0078d4 primary, #edebe9 borders, etc.)
4. **Outlook WebView compatibility** — all PrimeVue overlay/dialog components must function inside the constrained task pane iframe without scroll or z-index issues
5. **CSS custom properties retained** — existing tokens in `main.css :root` remain as the design token source; PrimeVue theme consumes them; Tailwind extends them

### Decision Drivers (top 3)
1. **Component coverage** — PrimeVue must provide ready-made equivalents for: buttons, inputs, selects, panels, tabs, messages, tree, accordion — all needed in the existing 14 components
2. **Theme customization depth** — PrimeVue must be themeable to match the Outlook/Fluent-inspired palette (not the default Aura teal/lavender palette)
3. **Bundle size** — PrimeVue tree-shaking (selective component import) must be used; adding the full library would bloat the task pane beyond acceptable limits

### Viable Options

**Option A: PrimeVue 4 + Tailwind CSS 3 (recommended)**
- Pros: PrimeVue 4 has first-class Vue 3.5 support, excellent component coverage for forms/dialogs/trees/tabs, unstyled mode allows precise design token matching, great accessibility (ARIA), active maintenance. Tailwind provides utility-first CSS for all the custom one-off spacing, flexbox, and responsive work without writing custom CSS.
- Cons: Two CSS frameworks (PrimeVue themes + Tailwind) can cause specificity conflicts; learning curve for Tailwind if team is unfamiliar; PrimeVue 4 theming requires some configuration to match custom palette.
- Bundle impact: ~50-80KB gzipped for selective PrimeVue imports; Tailwind JIT adds ~15KB gzipped.

**Option B: Headless UI (Vue) + Tailwind CSS 3**
- Pros: Headless UI is framework-native (Vue 3), zero styling, accessible; Tailwind handles all visual output. No component library theme conflicts.
- Cons: Headless UI has far fewer components (no Tree, no Accordion, limited tabs/dialogs); would need to build significant UI from scratch anyway. Does not meet the "use PrimeVue" requirement stated in the task.
- Bundle impact: ~10-20KB; but missing key components forces custom implementation.

**Option C: PrimeVue 3 (legacy) + existing CSS**
- Pros: Stable, well-documented, large community, all components available.
- Cons: PrimeVue 3 is in maintenance mode; PrimeVue 4 has better Vue 3.5 integration, smaller bundle (tree-shaking improvements), and modern theming. Using outdated version means missing these benefits and creating technical debt.

### Invalidation Rationale
- Option B (Headless UI) is invalidated because it lacks a Tree component and Accordion — both needed in the existing codebase (FolderTree, RulesEditor) — forcing custom implementation that defeats the "use PrimeVue" requirement.
- Option C (PrimeVue 3) is invalidated because PrimeVue 4 has better tree-shaking, smaller bundle, improved Vue 3.5 compatibility, and more modern theming API — and there is no constraint requiring legacy version usage.

### Pre-Mortem (3 Failure Scenarios)

**Scenario 1: Theme migration leaves Aura colors visible in production**
PrimeVue's `definePreset` or theme configuration fails to override all surface tokens (especially background, hover states, and focus rings). The task pane renders with teal/lavender highlights that look jarring against the Outlook Fluent UI.
Prevention: Phase 1 gate includes a DevTools theme audit — every `.p-*` class must use the configured palette. No Aura default colors are acceptable.
Recovery: If caught in Phase 2+, immediately audit the theme preset configuration; PrimeVue 4's `definePreset` allows granular token overrides that can be applied incrementally.

**Scenario 2: PrimeVue 4 API divergence causes build failures mid-migration**
A component that works in PrimeVue 4 with different props than anticipated (e.g. `Select` `optionLabel` vs `label`, or `TabPanel` `header` slot vs `tab` prop). Each failed migration blocks the next component, and `vue-tsc --noEmit` starts failing across the codebase.
Prevention: Verify component APIs against PrimeVue 4 documentation before migrating each component; run `vue-tsc --noEmit` immediately after each component migration.
Recovery: Create a per-component API reference doc during Phase 1, consult PrimeVue 4 release notes for breaking changes, and use the PrimeVue Discord/GitHub for API questions.

**Scenario 3: Outlook WebView Toast clipping blocks error visibility**
PrimeVue Toast service renders notifications in a portal that sits behind the Outlook chrome layer due to z-index stacking context issues in the task pane iframe. Users cannot see error messages when chat fails.
Prevention: Test in actual Outlook WebView early in Phase 1 (not just browser dev); configure `Toast` with `appendTo="body"` as a default; have a fallback inline error display if Toast is not visible.
Recovery: Replace Toast with an inline `div` error banner in ChatPanel (the original design); move to a dismissible PrimeVue `Message` component positioned in the chat header area.

### Expanded Test Plan

**Unit Tests (Vitest)**
- Each migrated component has at least one test verifying the component mounts without errors
- ChatPanel tests: send button click fires `chat.sendMessage()` with correct args; cancel button calls `chat.cancelStream()`; textarea input updates `inputText` ref
- ProviderSelector tests: provider Select change fires `chatStore.setProvider()`; model Select change fires `chatStore.setModel()`
- EmailAiView: verifies `useOffice()` composable data is displayed (mocked `useOffice()` in test)

**Integration Tests**
- ProviderConfig full flow: unlock passphrase → save API key → test connection → remove key; uses mocked crypto/localStorage
- FolderTree: PrimeVue Tree renders with mocked folder data; selection fires correct callback

**E2E Tests (Playwright)**
- Full migration E2E: install packages → dev server starts → navigate all 3 tabs → send a chat message → verify chat message appears in message list → check Settings unlock flow
- Outlook task pane context: run E2E tests inside actual Outlook WebView (sideloaded add-in) to verify Toast visibility and z-index behavior

**Observability**
- Add console.warn for PrimeVue component mounting failures (unexpected null refs, etc.)
- Log PrimeVue version at startup to ensure correct version loaded in production
- Track per-component migration status in a migration checklist in the repo (e.g. `MIGRATION_STATUS.md`) for audit trail

### Synthesis
PrimeVue 4 + Tailwind CSS 3 is the recommended combination. PrimeVue supplies all interactive UI components (buttons, forms, tabs, panels, tree, accordion, messages, toast), and Tailwind handles custom spacing, layout utilities, and responsive design. The two layers coexist cleanly with Tailwind utilities winning on one-off customizations and PrimeVue components handling the bulk of interactive UI. The `--color-*` CSS custom property tokens are preserved as the single source of truth for the design system, consumed by the PrimeVue theme configuration.

---

## 8. ADR

**Decision:** Adopt PrimeVue 4 (selective component imports, custom theme matching existing `--color-*` tokens) and Tailwind CSS 3 (utility layer for custom spacing/layout) in the Quill frontend. Migrate components incrementally from custom CSS to PrimeVue/Tailwind one at a time, preserving all composable and store behavior exactly.

**Drivers:**
1. Existing codebase has 14+ custom-built UI components that need replacing with a professional component library to improve maintainability and accessibility
2. The task explicitly requires PrimeVue as the component framework for all future UI work
3. Tailwind is needed to handle the custom layout work (task pane constraints, Outlook brand alignment) that PrimeVue's component-level styling cannot cover alone

**Alternatives considered:**
- Headless UI (Vue): lacks Tree and Accordion components needed in FolderTree and RulesEditor; would require significant custom build that defeats the purpose
- PrimeVue 3 (legacy): older version with less optimal tree-shaking, less modern theming API, and in maintenance mode

**Why chosen:** PrimeVue 4 has first-class Vue 3.5 support, excellent component coverage including Tree and Accordion, unstyled mode for precise design token matching, and active development. Tailwind's JIT engine adds minimal bundle overhead while providing the utility-first flexibility needed for Outlook task pane constraints and custom brand alignment. Both layers coexist cleanly with CSS custom properties as the single design token source.

**Consequences:**
- Development team must be familiar with or learn Tailwind utility-first patterns
- CSS specificity conflicts possible between PrimeVue theme output and Tailwind utilities — resolved by using Tailwind for overrides and not fighting the PrimeVue component structure
- PrimeVue Toast/Dialog services must be registered in `main.ts` (adds a service registration step)
- Migration of each component requires a test pass to ensure no regressions

**Follow-ups:**
- Migrate placeholder components (SummaryView, ExtractView, ReplyDraft) to use PrimeVue once they are implemented with real logic
- Evaluate PrimeVue DataTable for future search results display in SearchPanel
- Audit accessibility (keyboard navigation, screen reader) after migration completes