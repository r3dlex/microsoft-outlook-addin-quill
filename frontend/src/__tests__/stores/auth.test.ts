import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

let authStore: ReturnType<typeof import('@/stores/auth').useAuthStore>;

describe('useAuthStore', () => {
  beforeEach(async () => {
    setActivePinia(createPinia());
    const mod = await import('@/stores/auth');
    authStore = mod.useAuthStore();
  });

  it('hasApiKeys initial state is false', () => {
    expect(authStore.hasApiKeys).toBe(false);
  });

  it('isUnlocked initial state is false', () => {
    expect(authStore.isUnlocked).toBe(false);
  });

  it('setHasApiKeys sets hasApiKeys', () => {
    authStore.setHasApiKeys(true);
    expect(authStore.hasApiKeys).toBe(true);
  });

  it('unlock sets cryptoKey and isUnlocked=true', async () => {
    const testKey = await crypto.subtle.importKey(
      'raw',
      new Uint8Array(32),
      { name: 'AES-GCM' },
      false,
      ['encrypt'],
    );
    authStore.unlock(testKey);
    expect(authStore.cryptoKey).toBe(testKey);
    expect(authStore.isUnlocked).toBe(true);
  });

  it('lock clears cryptoKey and isUnlocked=false', async () => {
    const testKey = await crypto.subtle.importKey(
      'raw',
      new Uint8Array(32),
      { name: 'AES-GCM' },
      false,
      ['encrypt'],
    );
    authStore.unlock(testKey);
    authStore.lock();
    expect(authStore.cryptoKey).toBeNull();
    expect(authStore.isUnlocked).toBe(false);
  });

  it('clearAuth resets everything', () => {
    authStore.setHasApiKeys(true);
    authStore.clearAuth();
    expect(authStore.hasApiKeys).toBe(false);
    expect(authStore.cryptoKey).toBeNull();
    expect(authStore.isUnlocked).toBe(false);
  });

  it('isAuthenticated computed is true only when both hasApiKeys AND isUnlocked', async () => {
    expect(authStore.isAuthenticated).toBe(false);
    authStore.setHasApiKeys(true);
    expect(authStore.isAuthenticated).toBe(false);
    const testKey = await crypto.subtle.importKey(
      'raw',
      new Uint8Array(32),
      { name: 'AES-GCM' },
      false,
      ['encrypt'],
    );
    authStore.unlock(testKey);
    expect(authStore.isAuthenticated).toBe(true);
    authStore.setHasApiKeys(false);
    expect(authStore.isAuthenticated).toBe(false);
  });
});
