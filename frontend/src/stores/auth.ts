import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

/**
 * Auth store. In the no-backend architecture, "authenticated" simply
 * means the user has configured at least one API key and entered
 * their passphrase to unlock it.
 */
export const useAuthStore = defineStore('auth', () => {
  /** Whether at least one provider API key is configured */
  const hasApiKeys = ref<boolean>(false);

  /** Whether the passphrase has been entered and keys are unlocked */
  const isUnlocked = ref<boolean>(false);

  /** The derived CryptoKey from the passphrase (kept in memory only) */
  const cryptoKey = ref<CryptoKey | null>(null);

  const isAuthenticated = computed(() => hasApiKeys.value && isUnlocked.value);

  function setHasApiKeys(value: boolean): void {
    hasApiKeys.value = value;
  }

  function unlock(key: CryptoKey): void {
    cryptoKey.value = key;
    isUnlocked.value = true;
  }

  function lock(): void {
    cryptoKey.value = null;
    isUnlocked.value = false;
  }

  function clearAuth(): void {
    hasApiKeys.value = false;
    cryptoKey.value = null;
    isUnlocked.value = false;
  }

  return {
    hasApiKeys,
    isUnlocked,
    isAuthenticated,
    cryptoKey,
    setHasApiKeys,
    unlock,
    lock,
    clearAuth,
  };
});
