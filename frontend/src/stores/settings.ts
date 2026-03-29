import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getRoamingSetting, setRoamingSetting } from '@/services/storage';
import type { ProviderName } from '@/services/llm/provider';

export type { ProviderName };

/**
 * Encrypted API key stored in roaming settings.
 */
export interface EncryptedKey {
  iv: string;
  ciphertext: string;
}

/**
 * Per-provider configuration stored in roaming settings.
 */
export interface ProviderSettings {
  encryptedKey?: EncryptedKey;
  defaultModel: string;
}

const SETTINGS_KEY = 'quill:settings';
const SALT_KEY = 'quill:salt';

export const useSettingsStore = defineStore('settings', () => {
  const currentProvider = ref<ProviderName>('openai');
  const providerSettings = ref<Record<ProviderName, ProviderSettings>>({
    openai: { defaultModel: 'gpt-4o' },
    anthropic: { defaultModel: 'claude-sonnet-4-20250514' },
    gemini: { defaultModel: 'gemini-2.0-flash' },
    minimax: { defaultModel: 'MiniMax-Text-01' },
  });

  function setProvider(provider: ProviderName): void {
    currentProvider.value = provider;
  }

  function setProviderKey(provider: ProviderName, encrypted: EncryptedKey): void {
    providerSettings.value[provider] = {
      ...providerSettings.value[provider],
      encryptedKey: encrypted,
    };
  }

  function removeProviderKey(provider: ProviderName): void {
    const settings = providerSettings.value[provider];
    if (settings) {
      delete settings.encryptedKey;
    }
  }

  function setDefaultModel(provider: ProviderName, model: string): void {
    providerSettings.value[provider] = {
      ...providerSettings.value[provider],
      defaultModel: model,
    };
  }

  function hasAnyKey(): boolean {
    return Object.values(providerSettings.value).some((s) => !!s.encryptedKey);
  }

  /**
   * Load settings from roamingSettings (or localStorage fallback).
   */
  function loadFromStorage(): void {
    const stored = getRoamingSetting(SETTINGS_KEY) as {
      currentProvider?: ProviderName;
      providerSettings?: Record<ProviderName, ProviderSettings>;
    } | undefined;

    if (stored) {
      if (stored.currentProvider) {
        currentProvider.value = stored.currentProvider;
      }
      if (stored.providerSettings) {
        // Merge with defaults to ensure all providers exist
        for (const key of Object.keys(stored.providerSettings) as ProviderName[]) {
          providerSettings.value[key] = {
            ...providerSettings.value[key],
            ...stored.providerSettings[key],
          };
        }
      }
    }
  }

  /**
   * Persist settings to roamingSettings.
   */
  async function saveToStorage(): Promise<void> {
    await setRoamingSetting(SETTINGS_KEY, {
      currentProvider: currentProvider.value,
      providerSettings: providerSettings.value,
    });
  }

  /**
   * Get the stored salt (base64) or undefined.
   */
  function getSalt(): string | undefined {
    return getRoamingSetting(SALT_KEY) as string | undefined;
  }

  /**
   * Store the salt (base64).
   */
  async function saveSalt(saltB64: string): Promise<void> {
    await setRoamingSetting(SALT_KEY, saltB64);
  }

  return {
    currentProvider,
    providerSettings,
    setProvider,
    setProviderKey,
    removeProviderKey,
    setDefaultModel,
    hasAnyKey,
    loadFromStorage,
    saveToStorage,
    getSalt,
    saveSalt,
  };
});
