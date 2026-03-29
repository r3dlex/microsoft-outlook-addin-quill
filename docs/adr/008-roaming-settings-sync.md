# ADR-008: roamingSettings for Cross-Device Settings Sync

## Status
Accepted

## Context
The add-in needs to persist user settings (encrypted API keys, provider preferences, CORS proxy URL) across sessions and devices. Without a backend database, the options are:
1. `Office.context.roamingSettings` - 32KB limit, syncs across devices via Exchange
2. `localStorage` - 5-10MB, device-local only
3. `item.customProperties` - 2,500 chars per item, item-scoped

## Decision
Use `roamingSettings` as the primary storage for all user settings and encrypted API keys. Use `localStorage` for device-local data (chat history, action logs) that doesn't need to sync. Use `customProperties` for per-email metadata (extraction results, AI classifications).

## Consequences
- **Positive**: Settings automatically sync across all devices where the user has Outlook.
- **Positive**: No backend needed for user state management.
- **Negative**: 32KB limit requires careful space management. Store only essential data.
- **Negative**: Chat history does not sync across devices (localStorage is local-only).
- **Negative**: `saveAsync()` must be called explicitly after changes; forgetting it loses data.
