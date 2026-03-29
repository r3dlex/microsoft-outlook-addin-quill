import { computed } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import { useAuthStore } from '@/stores/auth';
import { encrypt, decrypt } from '@/services/crypto';
import { getProvider } from '@/services/llm/router';
import type { ProviderName } from '@/services/llm/provider';

/**
 * Composable for managing user settings: AI provider configuration,
 * API key encryption/decryption, and default model preferences.
 * Settings are persisted in Office roamingSettings (or localStorage fallback).
 */
export function useSettings() {
  const settingsStore = useSettingsStore();
  const authStore = useAuthStore();

  const currentProvider = computed(() => settingsStore.currentProvider);
  const providerSettings = computed(() => settingsStore.providerSettings);

  function setProvider(provider: ProviderName): void {
    settingsStore.setProvider(provider);
    settingsStore.saveToStorage();
  }

  function setDefaultModel(provider: ProviderName, model: string): void {
    settingsStore.setDefaultModel(provider, model);
    settingsStore.saveToStorage();
  }

  /**
   * Encrypt and store an API key for a provider.
   */
  async function saveApiKey(provider: ProviderName, apiKey: string): Promise<void> {
    if (!authStore.cryptoKey) {
      throw new Error('Passphrase not entered. Please unlock first.');
    }
    const encrypted = await encrypt(apiKey, authStore.cryptoKey);
    settingsStore.setProviderKey(provider, encrypted);
    authStore.setHasApiKeys(true);
    await settingsStore.saveToStorage();
  }

  /**
   * Decrypt and return the API key for a provider.
   */
  async function getApiKey(provider: ProviderName): Promise<string | null> {
    const config = settingsStore.providerSettings[provider];
    if (!config?.encryptedKey || !authStore.cryptoKey) {
      return null;
    }
    try {
      return await decrypt(config.encryptedKey, authStore.cryptoKey);
    } catch {
      return null;
    }
  }

  /**
   * Remove the API key for a provider.
   */
  async function removeApiKey(provider: ProviderName): Promise<void> {
    settingsStore.removeProviderKey(provider);
    authStore.setHasApiKeys(settingsStore.hasAnyKey());
    await settingsStore.saveToStorage();
  }

  /**
   * Test the API key for a provider by making a minimal API call.
   */
  async function testConnection(provider: ProviderName): Promise<boolean> {
    const apiKey = await getApiKey(provider);
    if (!apiKey) {
      throw new Error('No API key configured for this provider');
    }
    const llmProvider = getProvider(provider);
    return llmProvider.testConnection(apiKey);
  }

  /**
   * Check if a provider has a key configured.
   */
  function hasKey(provider: ProviderName): boolean {
    return !!settingsStore.providerSettings[provider]?.encryptedKey;
  }

  /**
   * Load settings from storage.
   */
  function loadSettings(): void {
    settingsStore.loadFromStorage();
  }

  /**
   * Save settings to storage.
   */
  async function saveSettings(): Promise<void> {
    await settingsStore.saveToStorage();
  }

  return {
    currentProvider,
    providerSettings,
    setProvider,
    setDefaultModel,
    saveApiKey,
    getApiKey,
    removeApiKey,
    testConnection,
    hasKey,
    loadSettings,
    saveSettings,
  };
}
