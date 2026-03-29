import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { getLocalStorage, setLocalStorage } from '@/services/storage';
import type { ProviderName } from '@/services/llm/provider';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp: number;
}

const CHAT_STORAGE_KEY = 'quill:chatHistory';
const MAX_STORED_MESSAGES = 200;

export const useChatStore = defineStore('chat', () => {
  // Load persisted messages from localStorage
  const stored = getLocalStorage(CHAT_STORAGE_KEY) as ChatMessage[] | undefined;
  const messages = ref<ChatMessage[]>(stored ?? []);

  const currentProvider = ref<ProviderName>('openai');
  const currentModel = ref<string>('');

  function addMessage(msg: Omit<ChatMessage, 'timestamp'>): void {
    messages.value.push({
      ...msg,
      timestamp: Date.now(),
    });
  }

  /**
   * Append a streaming token to the last assistant message.
   * Used by the direct LLM streaming handler.
   */
  function appendToLastAssistant(token: string): void {
    for (let i = messages.value.length - 1; i >= 0; i--) {
      if (messages.value[i].role === 'assistant') {
        messages.value[i].content += token;
        return;
      }
    }
  }

  function clearMessages(): void {
    messages.value = [];
  }

  function setProvider(provider: ProviderName): void {
    currentProvider.value = provider;
  }

  function setModel(model: string): void {
    currentModel.value = model;
  }

  // Auto-persist to localStorage with pruning
  watch(
    messages,
    (newMessages) => {
      const toStore = newMessages.length > MAX_STORED_MESSAGES
        ? newMessages.slice(-MAX_STORED_MESSAGES)
        : newMessages;
      setLocalStorage(CHAT_STORAGE_KEY, toStore);
    },
    { deep: true },
  );

  return {
    messages,
    currentProvider,
    currentModel,
    addMessage,
    appendToLastAssistant,
    clearMessages,
    setProvider,
    setModel,
  };
});
