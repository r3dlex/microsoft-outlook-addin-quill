# LLM Providers

Four providers. All API calls made directly from the browser/WebView via HTTPS fetch(). API keys stored encrypted in roamingSettings.

## Anthropic Claude

- Auth: API key (`x-api-key` header, prefix `sk-ant-api03-`)
- Models: claude-sonnet-4-20250514, claude-opus-4-0-20250819
- Endpoint: `https://api.anthropic.com/v1/messages`
- Streaming: SSE via `stream: true`, parsed with ReadableStream
- CORS: Anthropic API does not set CORS headers for browser requests. Requires a lightweight proxy (see CORS Proxy section below).

## OpenAI

- Auth: API key (`Authorization: Bearer sk-...`)
- Models: gpt-4o, gpt-4o-mini, o3, o4-mini, codex-mini
- Endpoint: `https://api.openai.com/v1/chat/completions`
- Streaming: SSE via `stream: true`, parsed with ReadableStream
- CORS: OpenAI API does not set CORS headers for browser requests. Requires a lightweight proxy (see CORS Proxy section below).

## Google Gemini

- Auth: API key (`x-goog-api-key` header) OR OAuth 2.0 via Google Cloud
- Models: gemini-2.5-pro, gemini-2.5-flash
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/{model}:streamGenerateContent`
- Streaming: Server-streamed JSON, parsed with ReadableStream
- CORS: Google APIs generally support CORS for browser requests.
- OAuth path: Register OAuth client in Google Cloud Console. Use Dialog API in the task pane to run the OAuth flow. Exchange auth code for tokens directly from the task pane. Store refresh token encrypted in roamingSettings.
- Decision: Support both API key (default) and OAuth (opt-in).

## MiniMax (Anthropic-compatible API)

- Auth: API key (`x-api-key` header)
- Models: MiniMax-M2.7
- Endpoint: `https://api.minimax.io/anthropic/v1/messages`
- Streaming: SSE (same format as Anthropic), parsed with ReadableStream
- CORS: Same considerations as Anthropic. May require proxy.

## Provider Abstraction

The `provider-router.ts` service in the Vue task pane routes requests to the correct provider client. The Vue frontend calls:

```typescript
const client = getProviderClient(provider); // 'claude' | 'openai' | 'gemini' | 'minimax'
const stream = client.chatStream(messages, { model, systemPrompt });
for await (const chunk of stream) {
  // Render chunk in chat UI
}
```

Each provider client handles its own request format, authentication headers, and SSE parsing. API keys are decrypted from roamingSettings into memory at session start.

## CORS Proxy (Optional)

Most LLM provider APIs (Anthropic, OpenAI, MiniMax) do not set `Access-Control-Allow-Origin` headers, meaning direct browser fetch() calls will be blocked by CORS policy.

Options to handle this:

1. **Cloudflare Worker** (recommended): A minimal proxy that forwards requests and adds CORS headers. Stateless, no credentials stored server-side. The worker simply forwards the request (including the API key from the client) and relays the response with appropriate CORS headers.
2. **Vercel Edge Function**: Same approach as Cloudflare Worker.
3. **Self-hosted CORS proxy**: Minimal Express/Hono server that adds CORS headers.

The proxy must:
- Forward all request headers (including auth headers with API keys)
- Support streaming (SSE pass-through)
- Add `Access-Control-Allow-Origin: *` (or the add-in's specific origin)
- Add `Access-Control-Allow-Headers: *`
- NOT store or log API keys

The proxy URL is configurable in settings. If a provider supports CORS natively (e.g., Gemini), the proxy is bypassed for that provider.
