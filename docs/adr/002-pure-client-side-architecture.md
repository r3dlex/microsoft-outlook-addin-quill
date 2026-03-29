# ADR-002: Pure Client-Side Architecture (No Backend Server)

## Status
Accepted

## Context
The original architecture included an Elixir/Phoenix backend server for AI API proxying, credential storage, mailbox access (Graph API + DavMail), and automation. This required server infrastructure, database management, and complex deployment.

The target audience is corporate Outlook users who need AI email assistance. Many of these users cannot easily deploy server infrastructure but can sideload an Outlook add-in.

## Decision
Adopt a pure client-side architecture where the entire application runs in the Outlook task pane WebView. LLM API calls go directly from the browser to provider endpoints. A lightweight CORS proxy (Cloudflare Worker) handles providers that don't support browser CORS.

API keys are encrypted with Web Crypto API and stored in `roamingSettings`. No database, no server-side processing, no background jobs.

## Consequences
- **Positive**: Zero infrastructure to maintain. Users can start using the add-in immediately after sideloading. No server costs.
- **Positive**: API keys never leave the user's control (encrypted locally, decrypted only in memory).
- **Negative**: No background processing (no automated replies, no inbox rules, no scheduled actions).
- **Negative**: Cross-mailbox operations limited to what Office.js provides (multi-select only, no search/folder access).
- **Negative**: CORS proxy needed for most LLM providers, adding a network hop.
