# ADR-004: Web Crypto API for API Key Encryption

## Status
Accepted

## Context
Users must store LLM provider API keys to use the add-in. Without a backend server, keys must be stored client-side in `roamingSettings` (which syncs across devices via Microsoft's Exchange servers). Storing API keys in plaintext poses a security risk if the roamingSettings data is compromised.

## Decision
Use the Web Crypto API (available in all modern WebView engines) to encrypt API keys before storage. The encryption scheme:
- PBKDF2 (100,000 iterations, SHA-256) derives an AES-256-GCM key from a user-provided passphrase
- Each API key is encrypted with a random 12-byte IV
- Salt, IV, and ciphertext are concatenated and base64-encoded for storage
- A known test value is encrypted alongside keys for passphrase validation

## Consequences
- **Positive**: Keys are encrypted at rest in roamingSettings. Safe to sync across devices.
- **Positive**: No server-side key storage needed. User retains full control.
- **Positive**: Web Crypto API is performant and widely supported in WebView2.
- **Negative**: User must remember their passphrase. No recovery mechanism.
- **Negative**: Keys exist decrypted in memory during the session.
- **Negative**: Adds UX friction (passphrase entry on each session).
