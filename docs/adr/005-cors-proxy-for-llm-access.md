# ADR-005: CORS Proxy for LLM Provider Access

## Status
Accepted

## Context
Most LLM provider APIs (Anthropic, OpenAI, MiniMax) do not set `Access-Control-Allow-Origin` headers, meaning direct `fetch()` calls from the Outlook WebView are blocked by CORS policy. Google Gemini generally supports CORS for browser requests.

Without a backend server to proxy requests, an alternative is needed.

## Decision
Use a lightweight, stateless CORS proxy (Cloudflare Worker recommended) that:
- Forwards all request headers including authentication
- Supports SSE streaming pass-through
- Adds CORS headers to responses
- Does not store or log API keys

The proxy URL is user-configurable in Settings. Providers that support CORS natively (Gemini) bypass the proxy.

## Consequences
- **Positive**: Enables direct browser-to-LLM communication for all providers.
- **Positive**: Proxy is stateless and cheap to run (Cloudflare Worker free tier is sufficient).
- **Positive**: API keys still flow directly from user to provider (proxy doesn't store them).
- **Negative**: Adds a network hop and slight latency.
- **Negative**: Proxy is a single point of failure for non-Gemini providers.
- **Negative**: Users or admins must deploy and maintain the proxy.
