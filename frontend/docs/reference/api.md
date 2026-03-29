# API Reference

## Composables

### `useOffice()`

Wraps Office.js mailbox item calls. Returns reactive refs for the current email.

| Return | Type | Description |
|--------|------|-------------|
| `subject` | `Ref<string>` | Current email subject |
| `from` | `Ref<string>` | Sender email address |
| `body` | `Ref<string>` | Email body text |
| `conversationId` | `Ref<string>` | Outlook conversation ID |
| `isLoading` | `Ref<boolean>` | Loading state |
| `error` | `Ref<string \| null>` | Error message |
| `refresh()` | `() => Promise<void>` | Re-read the current item |

### `useChat()`

Phoenix Channel connection for AI streaming.

| Return | Type | Description |
|--------|------|-------------|
| `messages` | `ComputedRef<ChatMessage[]>` | Chat message history |
| `isStreaming` | `Ref<boolean>` | Whether AI is currently responding |
| `isConnected` | `Ref<boolean>` | WebSocket connection state |
| `sendMessage()` | `(content: string) => void` | Send a user message |
| `connect()` | `(token?: string) => void` | Connect to Phoenix |
| `joinConversation()` | `(id: string) => void` | Join a conversation channel |
| `disconnect()` | `() => void` | Close the connection |

### `useAuth()`

Authentication composable supporting MSAL.js NAA and fallback auth.

### `useSettings()`

Provider configuration and adapter toggle management.

### `useMailbox()`

REST calls for mailbox operations (folders, search, move, rules).

## Pinia Stores

### `useAuthStore`

Manages authentication token and user information.

### `useChatStore`

Manages chat messages, current AI provider, and conversation state.

### `useSettingsStore`

Manages user preferences including AI provider and mail adapter configuration.
