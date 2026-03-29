import { ref, computed } from 'vue';
import { useChatStore } from '@/stores/chat';
import { useSettingsStore } from '@/stores/settings';
import { useAuthStore } from '@/stores/auth';
import { getProvider } from '@/services/llm/router';
import { decrypt } from '@/services/crypto';
import type { ChatMessage } from '@/stores/chat';
import type { LlmMessage } from '@/services/llm/provider';

/**
 * Composable for direct LLM API chat streaming.
 * Replaces the Phoenix Channel approach with direct fetch() calls
 * to provider APIs, using ReadableStream for streaming.
 */
export function useChat() {
  const chatStore = useChatStore();
  const settingsStore = useSettingsStore();
  const authStore = useAuthStore();

  const isStreaming = ref<boolean>(false);
  const error = ref<string | null>(null);

  const messages = computed<ChatMessage[]>(() => chatStore.messages);

  /** Abort controller for cancelling in-flight requests */
  let abortController: AbortController | null = null;

  /**
   * Send a message and stream the AI response directly from the provider API.
   */
  async function sendMessage(content: string, systemPrompt?: string): Promise<void> {
    const providerName = chatStore.currentProvider;
    const providerConfig = settingsStore.providerSettings[providerName];

    if (!providerConfig?.encryptedKey) {
      error.value = `No API key configured for ${providerName}. Go to Settings to add one.`;
      return;
    }

    if (!authStore.cryptoKey) {
      error.value = 'Please enter your passphrase to unlock API keys.';
      return;
    }

    // Decrypt the API key
    let apiKey: string;
    try {
      apiKey = await decrypt(providerConfig.encryptedKey, authStore.cryptoKey);
    } catch {
      error.value = 'Failed to decrypt API key. Is your passphrase correct?';
      return;
    }

    // Add user message to store
    chatStore.addMessage({ role: 'user', content });

    // Add placeholder for assistant response
    chatStore.addMessage({ role: 'assistant', content: '' });

    isStreaming.value = true;
    error.value = null;

    try {
      const provider = getProvider(providerName);
      const model = chatStore.currentModel || providerConfig.defaultModel;

      // Build message history for the API
      const llmMessages: LlmMessage[] = chatStore.messages
        .filter((m) => m.content.length > 0 || m.role === 'assistant')
        .slice(0, -1) // Exclude the empty assistant placeholder
        .map((m) => ({ role: m.role, content: m.content }));

      const stream = provider.stream({
        messages: llmMessages,
        model,
        apiKey,
        systemPrompt,
        maxTokens: 4096,
      });

      for await (const chunk of stream) {
        chatStore.appendToLastAssistant(chunk);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Streaming failed';
      error.value = message;
      // Append error indication to the assistant message
      chatStore.appendToLastAssistant(`\n\n[Error: ${message}]`);
    } finally {
      isStreaming.value = false;
      abortController = null;
    }
  }

  /**
   * Cancel an in-flight streaming request.
   */
  function cancelStream(): void {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
    isStreaming.value = false;
  }

  /**
   * Clear all messages.
   */
  function clearMessages(): void {
    chatStore.clearMessages();
  }

  return {
    messages,
    isStreaming,
    error,
    sendMessage,
    cancelStream,
    clearMessages,
  };
}
