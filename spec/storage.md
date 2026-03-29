# Data Storage

No database. All persistence uses Outlook's built-in mechanisms and browser storage. Three storage tiers with different characteristics.

## Tier 1: Office.context.roamingSettings (Primary)

- **Capacity**: 32KB per add-in per user
- **Sync**: Automatically synced across all devices where the user is signed in
- **Persistence**: Tied to the user's Exchange mailbox; survives browser cache clears
- **Access**: Async read/write via `roamingSettings.get()` / `roamingSettings.set()` / `roamingSettings.saveAsync()`

### Stored Data

| Key | Content | Approx Size |
|-----|---------|-------------|
| `encrypted_keys` | Encrypted API keys for all providers (JSON object) | ~2KB |
| `passphrase_salt` | PBKDF2 salt for key derivation (base64) | ~50B |
| `passphrase_check` | Encrypted test value for passphrase validation | ~200B |
| `provider_config` | Active provider, default models, enabled providers (JSON) | ~500B |
| `proxy_url` | CORS proxy URL (if configured) | ~200B |
| `ui_preferences` | Theme, default tab, chat display preferences (JSON) | ~500B |
| `gemini_refresh_token` | Encrypted OAuth refresh token (if using Gemini OAuth) | ~1KB |

**Total estimated usage**: ~5KB of 32KB limit. Ample headroom.

## Tier 2: item.customProperties (Per-Email Metadata)

- **Capacity**: 2,500 characters per item
- **Sync**: Tied to the specific mail item; persists across sessions
- **Persistence**: Stored on the Exchange server as part of the item
- **Access**: Async via `item.loadCustomPropertiesAsync()` then `customProperties.get()` / `customProperties.set()` / `customProperties.saveAsync()`

### Stored Data

| Key | Content | Approx Size |
|-----|---------|-------------|
| `quill_summary` | Cached AI summary of this email | ~500-1500 chars |
| `quill_category` | AI-suggested category classification | ~100 chars |
| `quill_extracted` | Extracted structured data (JSON) | ~500-1000 chars |
| `quill_last_action` | Timestamp and type of last Quill action | ~50 chars |

**Strategy**: Store the most recent/useful result only. If space is tight, prioritize `quill_category` and `quill_extracted` over `quill_summary`.

## Tier 3: Browser localStorage (Fallback, Non-Sensitive)

- **Capacity**: ~5-10MB (varies by browser/WebView)
- **Sync**: None. Local to this device and browser profile only.
- **Persistence**: Survives page reloads but can be cleared by the user or browser
- **Access**: Synchronous `localStorage.getItem()` / `localStorage.setItem()`

### Stored Data

| Key | Content | Approx Size |
|-----|---------|-------------|
| `quill_chat_history` | Recent chat sessions (JSON array) | ~500KB max |
| `quill_action_log` | Log of recent Smart Actions (JSON array) | ~100KB max |

### Auto-Pruning Strategy

Chat history and action logs are bounded to prevent unbounded growth:

- **Chat history**: Keep the most recent 50 sessions. Each session stores up to 20 message pairs. Older sessions are evicted FIFO.
- **Action log**: Keep the most recent 200 entries. Older entries evicted FIFO.
- **Total localStorage budget**: 1MB soft limit. Pruning runs on every write if total size exceeds the budget.
- **Pruning implementation**: A `useStorage` composable wraps localStorage with size tracking and automatic eviction.

## Data Flow Summary

```
User Settings, API Keys  -->  roamingSettings (encrypted, synced)
Per-Email AI Results      -->  customProperties (per-item, synced)
Chat History, Logs        -->  localStorage (local-only, auto-pruned)
```

## Migration and Reset

- **Clear all data**: Settings panel provides a "Reset Quill" button that clears all three tiers
- **Export settings**: User can export provider config (not keys) as JSON for backup
- **No migration needed**: No database schema to migrate. Storage format versioned via a `quill_version` key in roamingSettings; future versions can handle format changes.
