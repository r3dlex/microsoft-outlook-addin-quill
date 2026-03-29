# Authentication and Key Management

There is no user identity management system. The Outlook user IS the identity. No MSAL.js, no OBO flow, no token exchange, no Entra app registration, no user accounts.

## User Identity

The signed-in Outlook user is the only identity context. `Office.context.mailbox.userProfile` provides the user's display name and email address. No separate authentication is needed.

## API Key Management

- User enters LLM provider API keys in the Settings panel
- Keys are encrypted client-side using Web Crypto API before storage
- Encrypted keys stored in `Office.context.roamingSettings` (syncs across devices, 32KB limit)
- Keys are decrypted into memory only when needed for API calls
- Keys are never stored in plaintext anywhere

## Encryption Flow

1. **First-time setup**: User creates a passphrase in the Settings panel
2. **Key derivation**: Passphrase is run through PBKDF2 (100,000 iterations, SHA-256) with a random salt to produce an AES-256-GCM encryption key
3. **Encrypt**: Each API key is encrypted with the derived key and a random 12-byte IV
4. **Store**: The salt, IV, and ciphertext are concatenated and base64-encoded, then saved to roamingSettings under the provider name
5. **Decrypt on session start**: User enters passphrase, key is re-derived, API keys are decrypted into memory
6. **Passphrase validation**: A known test value is encrypted and stored alongside keys. On passphrase entry, this test value is decrypted to verify correctness before attempting to decrypt API keys.

## Passphrase Handling

- The passphrase is never stored; it exists only in memory during derivation
- If the user forgets the passphrase, they must re-enter all API keys (no recovery mechanism)
- The passphrase salt is stored in roamingSettings (not secret, only used for derivation)
- Optional: allow the user to skip encryption (store keys in plaintext in roamingSettings) with a clear warning about the security trade-off

## Gemini OAuth (Optional)

- For users who prefer OAuth over API key for Gemini:
- Dialog API opens a popup to Google's OAuth consent screen
- Auth code returned via `Office.context.ui.messageParent()`
- Task pane exchanges the auth code for tokens directly with Google's token endpoint (`https://oauth2.googleapis.com/token`)
- Access token held in memory; refresh token encrypted and stored in roamingSettings (same encryption as API keys)
- Token refresh handled in-memory when access token expires

## Security Considerations

- All API calls use HTTPS
- API keys transit through the browser/WebView to provider APIs (or CORS proxy)
- roamingSettings data is synced via Microsoft's servers (encrypted keys are safe to sync)
- No secrets exist in the manifest or source code
- CSP headers whitelist: add-in domain, `appsforoffice.microsoft.com`, LLM provider domains (or CORS proxy domain)
