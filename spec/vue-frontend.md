# Vue Task Pane (Application)

This is the entire application. There is no backend server. The Vue task pane handles all logic including LLM API calls, data persistence, and Office.js operations.

## Stack

- Framework: Vue 3 with TypeScript (strict mode), Vite as build tool
- VitePress for project documentation site
- Runs inside Outlook's WebView2 (Windows), WebKit (macOS), or iframe (OWA)
- Loads Office.js from Microsoft CDN for mailbox operations
- Makes direct HTTPS fetch() calls to LLM provider APIs
- Streaming via native fetch with ReadableStream
- Data persistence via Office.js roamingSettings, customProperties, and browser localStorage
- API key encryption via Web Crypto API (AES-GCM with user passphrase)
- Two tabs: Email AI (Tab 1) and Smart Actions (Tab 2)

## Office.js Integration Notes

- Bootstrap Vue inside `Office.onReady()`: call `createApp(App).mount('#app')` only after Office.js confirms readiness.
- Cache and restore `window.history.pushState` and `window.history.replaceState` before Office.js loads. Office.js nullifies these, breaking Vue Router.
- Use a composable (`useOffice()`) that wraps all Office.js callbacks to handle async properly.
- Do NOT use the Yeoman template. Create a standard Vite + Vue project and integrate Office.js manually.

## Project Structure

```
src/
├── main.ts                        # Office.onReady() bootstrap
├── App.vue
├── router/
│   └── index.ts                   # Vue Router setup
├── composables/
│   ├── useOffice.ts               # Office.js wrapper composable
│   ├── useChat.ts                 # LLM streaming via fetch/ReadableStream
│   ├── useSettings.ts             # roamingSettings persistence
│   ├── useStorage.ts              # localStorage with auto-pruning
│   └── useCrypto.ts               # Web Crypto API key encryption
├── services/
│   ├── llm/
│   │   ├── types.ts               # Shared LLM types (Message, StreamEvent, etc.)
│   │   ├── base-client.ts         # Base fetch + streaming logic
│   │   ├── claude-client.ts       # Anthropic Claude API client
│   │   ├── openai-client.ts       # OpenAI API client
│   │   ├── gemini-client.ts       # Google Gemini API client
│   │   ├── minimax-client.ts      # MiniMax API client (Anthropic-compatible)
│   │   └── provider-router.ts     # Routes to correct provider client
│   ├── crypto.ts                  # AES-GCM encrypt/decrypt with Web Crypto API
│   └── settings.ts                # roamingSettings read/write helpers
├── views/
│   ├── EmailAiView.vue            # Tab 1
│   ├── SmartActionsView.vue       # Tab 2
│   └── SettingsView.vue
├── components/
│   ├── email-ai/
│   │   ├── ChatPanel.vue
│   │   ├── SummaryView.vue
│   │   ├── ReplyDraft.vue
│   │   └── ExtractView.vue
│   ├── smart-actions/
│   │   ├── BatchCategorize.vue
│   │   ├── BulkExtract.vue
│   │   └── BulkDraftReply.vue
│   ├── settings/
│   │   ├── ProviderConfig.vue
│   │   ├── ApiKeyManager.vue
│   │   └── PassphraseSetup.vue
│   └── shared/
│       ├── ChatMessage.vue
│       ├── ProviderSelector.vue
│       └── LoadingIndicator.vue
├── stores/                        # Pinia stores
│   ├── chat.ts
│   └── settings.ts
├── types/
│   └── office.d.ts                # Office.js type augmentations
├── assets/
│   └── icons/                     # 16x16, 32x32, 80x80 ribbon icons
└── styles/
```

## Key Libraries

- `vue` 3.x with Composition API
- `vue-router` for tab navigation
- `pinia` for state management
- `@microsoft/office-js` types

No Phoenix, no MSAL.js, no external auth libraries needed.

## LLM Client Service Layer

Each provider has a dedicated client class in `services/llm/`. All clients implement a common interface:

```typescript
interface LLMClient {
  chat(messages: ChatMessage[], options: ChatOptions): Promise<ChatResponse>;
  chatStream(messages: ChatMessage[], options: ChatOptions): AsyncGenerator<StreamChunk>;
}
```

Streaming is implemented via native `fetch()` with `ReadableStream`:

```typescript
const response = await fetch(endpoint, { method: 'POST', headers, body });
const reader = response.body!.getReader();
const decoder = new TextDecoder();
// Parse SSE events from chunks
```

The `provider-router.ts` selects the correct client based on the user's chosen provider from settings.

## Web Crypto API for Key Encryption

API keys are encrypted before storage in roamingSettings:

1. User sets a passphrase on first use
2. Passphrase is derived into an AES-GCM key via PBKDF2 (100,000 iterations, SHA-256)
3. Each API key is encrypted with a random IV
4. Encrypted blob (IV + ciphertext + salt) stored in roamingSettings as base64
5. On session start, user enters passphrase to decrypt keys into memory
6. Keys exist only in memory during the session; never stored in plaintext

## Gemini OAuth via Dialog API

- Dialog API opens a popup to Google's OAuth consent screen
- Auth code sent back via `Office.context.ui.messageParent()`
- Task pane exchanges the auth code for tokens directly with Google's token endpoint
- Refresh token encrypted and stored in roamingSettings (same encryption as API keys)

## VitePress Documentation

- Project documentation served via VitePress at `/docs`
- Auto-generated from `docs/` directory
- Includes: getting started guide, architecture overview, API reference, deployment guide
- Build: `npx vitepress build docs`
- Dev: `npx vitepress dev docs`
