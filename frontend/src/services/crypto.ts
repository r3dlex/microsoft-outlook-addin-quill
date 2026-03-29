/**
 * Web Crypto API wrapper for encrypting/decrypting API keys.
 * Uses AES-GCM with PBKDF2 key derivation from a user-provided passphrase.
 */

const PBKDF2_ITERATIONS = 310_000;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;

/**
 * Derive a CryptoKey from a passphrase and salt using PBKDF2.
 */
export async function deriveKey(
  passphrase: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

/**
 * Encrypt a plaintext string with AES-GCM.
 * Returns base64-encoded iv and ciphertext.
 */
export async function encrypt(
  data: string,
  key: CryptoKey,
): Promise<{ iv: string; ciphertext: string }> {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(data),
  );
  return {
    iv: uint8ToBase64(iv),
    ciphertext: uint8ToBase64(new Uint8Array(encrypted)),
  };
}

/**
 * Decrypt AES-GCM ciphertext back to plaintext string.
 */
export async function decrypt(
  encrypted: { iv: string; ciphertext: string },
  key: CryptoKey,
): Promise<string> {
  const iv = base64ToUint8(encrypted.iv);
  const ciphertext = base64ToUint8(encrypted.ciphertext);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext,
  );
  return new TextDecoder().decode(decrypted);
}

/**
 * Generate a random salt for PBKDF2 key derivation.
 */
export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

/**
 * Convert salt Uint8Array to base64 for storage.
 */
export function saltToBase64(salt: Uint8Array): string {
  return uint8ToBase64(salt);
}

/**
 * Convert base64 salt back to Uint8Array.
 */
export function base64ToSalt(b64: string): Uint8Array {
  return base64ToUint8(b64);
}

// --- helpers ---

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToUint8(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
