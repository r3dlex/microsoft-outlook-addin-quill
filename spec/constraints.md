# Constraints, Limitations, and Security

## Office.js Limitations

- Current-item scope only. No mailbox-wide access beyond multi-select.
- No `OnNewMailReceive` event. Cannot detect new mail via Office.js.
- Event handlers timeout after 300 seconds.
- `roamingSettings` limited to 32KB per add-in per user.
- `customProperties` limited to 2,500 characters per item.
- Multi-select (`getSelectedItemsAsync`) returns basic metadata only. Full content requires `loadItemByIdAsync` (requirement set 1.14+).
- No folder enumeration or navigation.
- No ability to read attachment binary content in read mode without Graph API.
- No background execution; task pane must be open for all operations.

## Browser / Client-Side Limitations

- **CORS**: Most LLM provider APIs (Anthropic, OpenAI, MiniMax) do not set CORS headers for browser-origin requests. A lightweight CORS proxy (Cloudflare Worker, Vercel Edge Function) is required for these providers. Google Gemini generally supports CORS.
- **No background processing**: There is no server to run scheduled tasks, automated replies, or inbox rules. All actions require user initiation via the task pane.
- **No cross-mailbox operations**: Cannot search across folders, enumerate mailbox contents, create inbox rules, or process mail outside the current view.
- **localStorage not synced**: Chat history and action logs are device-local only. Switching devices loses local chat history.
- **WebView restrictions**: Some Outlook clients use older WebView engines. Ensure fetch() with ReadableStream is supported (WebView2 on Windows is fine; older IE-based Outlook clients are not supported).

## Storage Limits

| Storage | Limit | Scope |
|---------|-------|-------|
| roamingSettings | 32KB | Per add-in, per user, synced |
| customProperties | 2,500 chars | Per mail item |
| localStorage | ~5-10MB | Per browser profile, local only |

## AI Provider Limitations

- All providers except Gemini are API-key-only (no OAuth)
- Streaming requires ReadableStream support in the WebView
- Context window limits vary by model; truncation strategy needed for long emails
- Smart Alert LLM calls must complete within 300-second event handler timeout
- API keys are transmitted from the browser to provider APIs (or proxy) on every request

## Security

- All LLM API calls over HTTPS
- API keys encrypted at rest in roamingSettings using AES-256-GCM via Web Crypto API
- Keys decrypted into memory only during active sessions
- No secrets in source code or manifest
- CORS proxy (if used) must not store or log API keys
- CSP headers whitelist: add-in domain, `appsforoffice.microsoft.com`, LLM provider domains or CORS proxy domain
- roamingSettings data transits through Microsoft's Exchange servers (encrypted keys are safe)
- No user authentication system to compromise (Outlook identity is implicit)

## Testing Strategy

- Unit tests: Vitest (TypeScript)
- UI tests: Playwright or Cypress with mocked Office.js environment
- AI provider mocking: MSW (Mock Service Worker) for HTTP mocking in tests
- Manifest validation: `npx office-addin-manifest validate`
- E2E: Sideload in OWA with test mailbox
