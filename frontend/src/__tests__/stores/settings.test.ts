import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import * as storageService from '@/services/storage';

vi.mock('@/services/storage', () => ({
  getRoamingSetting: vi.fn(() => undefined),
  setRoamingSetting: vi.fn().mockResolvedValue(undefined),
  removeSetting: vi.fn().mockResolvedValue(undefined),
}));

let settingsStore: ReturnType<typeof import('@/stores/settings').useSettingsStore>;

describe('useSettingsStore', () => {
  beforeEach(async () => {
    setActivePinia(createPinia());
    const mod = await import('@/stores/settings');
    settingsStore = mod.useSettingsStore();
  });

  it('currentProvider default is openai', () => {
    expect(settingsStore.currentProvider).toBe('openai');
  });

  it('setProvider changes currentProvider', () => {
    settingsStore.setProvider('anthropic');
    expect(settingsStore.currentProvider).toBe('anthropic');
  });

  it('setProviderKey sets an encrypted key', async () => {
    const encrypted = { iv: 'abc', ciphertext: 'xyz' };
    await settingsStore.setProviderKey('anthropic', encrypted);
    expect(settingsStore.providerSettings.anthropic.encryptedKey).toEqual(encrypted);
  });

  it('removeProviderKey removes the key', async () => {
    const encrypted = { iv: 'abc', ciphertext: 'xyz' };
    await settingsStore.setProviderKey('openai', encrypted);
    await settingsStore.removeProviderKey('openai');
    expect(settingsStore.providerSettings.openai.encryptedKey).toBeUndefined();
  });

  it('setDefaultModel sets the model', async () => {
    await settingsStore.setDefaultModel('openai', 'gpt-4o-mini');
    expect(settingsStore.providerSettings.openai.defaultModel).toBe('gpt-4o-mini');
  });

  it('hasAnyKey returns false initially', () => {
    expect(settingsStore.hasAnyKey()).toBe(false);
  });

  it('hasAnyKey returns true after setting a key', async () => {
    const encrypted = { iv: 'abc', ciphertext: 'xyz' };
    await settingsStore.setProviderKey('anthropic', encrypted);
    expect(settingsStore.hasAnyKey()).toBe(true);
  });

  it('loadFromStorage loads persisted settings', () => {
    vi.mocked(storageService.getRoamingSetting).mockImplementation((key: string) => {
      if (key === 'quill:settings') {
        return { currentProvider: 'gemini', providerSettings: { gemini: { defaultModel: 'custom-model' } } };
      }
      return undefined;
    });
    settingsStore.loadFromStorage();
    expect(settingsStore.currentProvider).toBe('gemini');
    expect(settingsStore.providerSettings.gemini.defaultModel).toBe('custom-model');
  });

  it('saveToStorage persists settings', async () => {
    settingsStore.setProvider('minimax');
    await settingsStore.saveToStorage();
    expect(vi.mocked(storageService.setRoamingSetting)).toHaveBeenCalledWith(
      'quill:settings',
      expect.objectContaining({ currentProvider: 'minimax' }),
    );
  });

  it('getSalt returns stored salt', () => {
    vi.mocked(storageService.getRoamingSetting).mockImplementation((key: string) => {
      if (key === 'quill:salt') return 'bXltYWxrc2FsdA==';
      return undefined;
    });
    expect(settingsStore.getSalt()).toBe('bXltYWxrc2FsdA==');
  });

  it('saveSalt persists the salt', async () => {
    await settingsStore.saveSalt('bXltYWxrc2FsdA==');
    expect(vi.mocked(storageService.setRoamingSetting)).toHaveBeenCalledWith(
      'quill:salt',
      'bXltYWxrc2FsdA==',
    );
  });
});
