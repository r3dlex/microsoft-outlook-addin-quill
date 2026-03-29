import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useSettingsStore } from '@/stores/settings';
import { deriveKey, generateSalt, saltToBase64, base64ToSalt } from '@/services/crypto';

/**
 * Composable for authentication.
 * In the no-backend architecture, "auth" is simply whether the user
 * has configured at least one API key and entered their passphrase
 * to unlock the encrypted keys.
 */
export function useAuth() {
  const authStore = useAuthStore();
  const settingsStore = useSettingsStore();
  const isAuthenticating = ref<boolean>(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const isUnlocked = computed(() => authStore.isUnlocked);
  const hasApiKeys = computed(() => authStore.hasApiKeys);

  /**
   * Enter passphrase to derive encryption key and unlock stored API keys.
   * If no salt exists yet (first time), a new salt is generated and stored.
   */
  async function unlock(passphrase: string): Promise<void> {
    if (!passphrase) {
      error.value = 'Passphrase is required';
      return;
    }

    isAuthenticating.value = true;
    error.value = null;

    try {
      // Get or create salt
      let saltB64 = settingsStore.getSalt();
      let salt: Uint8Array;

      if (saltB64) {
        salt = base64ToSalt(saltB64);
      } else {
        salt = generateSalt();
        saltB64 = saltToBase64(salt);
        await settingsStore.saveSalt(saltB64);
      }

      // Derive crypto key from passphrase
      const cryptoKey = await deriveKey(passphrase, salt);

      // Unlock the auth store
      authStore.unlock(cryptoKey);

      // Load settings to check if keys exist
      settingsStore.loadFromStorage();
      authStore.setHasApiKeys(settingsStore.hasAnyKey());
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to derive key';
    } finally {
      isAuthenticating.value = false;
    }
  }

  /**
   * Lock the session, clearing the crypto key from memory.
   */
  function lock(): void {
    authStore.lock();
  }

  /**
   * Initialize: load settings and check if keys are configured.
   */
  function initialize(): void {
    settingsStore.loadFromStorage();
    authStore.setHasApiKeys(settingsStore.hasAnyKey());
  }

  return {
    isAuthenticated,
    isUnlocked,
    hasApiKeys,
    isAuthenticating,
    error,
    unlock,
    lock,
    initialize,
  };
}
