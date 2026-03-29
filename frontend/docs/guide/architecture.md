# Architecture

## Overview

Quill is an Outlook Add-in with a Vue 3 frontend task pane that communicates with a Phoenix (Elixir) backend. The frontend runs inside Outlook's WebView2 (Windows), WebKit (macOS), or an iframe (OWA).

## Frontend Architecture

### Office.js Integration

The app bootstraps inside `Office.onReady()` to ensure the Office.js runtime is available. History API methods are cached before Office.js loads, since Office.js nullifies `pushState`/`replaceState` which breaks Vue Router.

### State Management

- **Pinia stores** manage global state (auth, chat messages, settings)
- **Composables** provide feature-specific reactive logic and side effects

### Communication with Backend

- **REST API** - Settings, one-shot operations (via `fetch`)
- **Phoenix Channels** - AI streaming, real-time notifications (via `phoenix` npm package)

### Authentication

Two auth flows are supported:
1. **MSAL.js NAA** - When Entra ID is available, acquires JWT via nested app auth
2. **Quill Account** - Fallback with session JWT stored in `Office.context.roamingSettings`

## Tabs

1. **Email AI** - Chat-based AI interaction for the current email
2. **Automation** - Mailbox search, folder management, rules, and batch operations
3. **Settings** - Provider configuration, adapter selection, connection preferences
