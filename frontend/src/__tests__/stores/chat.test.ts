import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('@/services/storage', () => ({
  getLocalStorage: vi.fn(() => undefined),
  setLocalStorage: vi.fn(),
  removeLocalStorage: vi.fn(),
}));

let chatStore: ReturnType<typeof import('@/stores/chat').useChatStore>;

describe('useChatStore', () => {
  beforeEach(async () => {
    setActivePinia(createPinia());
    const mod = await import('@/stores/chat');
    chatStore = mod.useChatStore();
  });

  it('messages initial state is empty array', () => {
    expect(chatStore.messages).toEqual([]);
  });

  it('addMessage adds a message with timestamp', () => {
    chatStore.addMessage({ role: 'user', content: 'Hello' });
    expect(chatStore.messages.length).toBe(1);
    expect(chatStore.messages[0].role).toBe('user');
    expect(chatStore.messages[0].content).toBe('Hello');
    expect(typeof chatStore.messages[0].timestamp).toBe('number');
  });

  it('appendToLastAssistant appends to last assistant message', () => {
    chatStore.addMessage({ role: 'assistant', content: 'Hello' });
    chatStore.appendToLastAssistant(' world');
    expect(chatStore.messages[0].content).toBe('Hello world');
  });

  it('appendToLastAssistant does nothing if no assistant message', () => {
    chatStore.addMessage({ role: 'user', content: 'Hello' });
    chatStore.appendToLastAssistant(' world');
    expect(chatStore.messages[0].content).toBe('Hello');
  });

  it('clearMessages clears the array', () => {
    chatStore.addMessage({ role: 'user', content: 'Hello' });
    chatStore.addMessage({ role: 'assistant', content: 'Hi' });
    chatStore.clearMessages();
    expect(chatStore.messages).toEqual([]);
  });

  it('setProvider sets currentProvider', () => {
    chatStore.setProvider('anthropic');
    expect(chatStore.currentProvider).toBe('anthropic');
  });

  it('setModel sets currentModel', () => {
    chatStore.setModel('claude-sonnet-4-20250514');
    expect(chatStore.currentModel).toBe('claude-sonnet-4-20250514');
  });

  it('addMessage triggers localStorage persistence via watch', async () => {
    const { setLocalStorage } = await import('@/services/storage');
    chatStore.addMessage({ role: 'user', content: 'Hello' });
    expect(setLocalStorage).toHaveBeenCalledWith(
      'quill:chatHistory',
      expect.arrayContaining([
        expect.objectContaining({ role: 'user', content: 'Hello' }),
      ]),
    );
  });
});
