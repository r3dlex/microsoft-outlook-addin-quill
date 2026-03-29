# ADR-007: MiniMax via Anthropic-Compatible API

## Status

Accepted

## Context

Quill supports multiple LLM providers: Claude (Anthropic), GPT (OpenAI), Gemini (Google), and MiniMax. Each provider typically requires a dedicated HTTP client module in the Phoenix backend. MiniMax offers an API endpoint that is compatible with the Anthropic Messages API format, accepting the same request/response structure with a different base URL and API key. Implementing a separate client for MiniMax would duplicate logic already present in the Anthropic client.

## Decision

We reuse the existing Anthropic HTTP client module for MiniMax requests by parameterizing the base URL and API key. The provider configuration specifies which endpoint and credentials to use. The Anthropic client module accepts a provider config struct rather than hardcoding Anthropic's URL, enabling it to serve both Anthropic and MiniMax with zero code duplication.

## Consequences

- No additional HTTP client module needed for MiniMax, reducing maintenance burden.
- The Anthropic client becomes a reusable foundation for any future provider that adopts the same API format.
- If MiniMax diverges from Anthropic's API format in the future, a dedicated client can be extracted at that point.
- Provider selection logic must map MiniMax to the Anthropic client with overridden configuration.
- Test coverage for the Anthropic client implicitly covers MiniMax API interactions.
