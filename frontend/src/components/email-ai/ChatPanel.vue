<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';
import { useChat } from '@/composables/useChat';
import { useOffice } from '@/composables/useOffice';
import ChatMessage from '@/components/shared/ChatMessage.vue';
import ProviderSelector from '@/components/shared/ProviderSelector.vue';
import LoadingIndicator from '@/components/shared/LoadingIndicator.vue';

const chat = useChat();
const office = useOffice();
const inputText = ref<string>('');
const messagesContainer = ref<HTMLElement | null>(null);

function handleSend(): void {
  const text = inputText.value.trim();
  if (!text || chat.isStreaming.value) return;

  // Build a system prompt with email context if available
  let systemPrompt: string | undefined;
  if (office.subject.value || office.body.value) {
    systemPrompt = `You are Quill, an AI email assistant embedded in Microsoft Outlook.
The user is viewing an email with the following context:
Subject: ${office.subject.value}
From: ${office.from.value}
Body:
${office.body.value}

Help the user with this email. You can summarize, draft replies, extract information, or answer questions about it.`;
  }

  chat.sendMessage(text, systemPrompt);
  inputText.value = '';
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleSend();
  }
}

function handleClear(): void {
  chat.clearMessages();
}

// Auto-scroll to bottom when new messages arrive
watch(
  () => chat.messages.value.length,
  async () => {
    await nextTick();
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  },
);
</script>

<template>
  <div class="chat-panel">
    <div class="chat-header">
      <ProviderSelector />
      <button
        v-if="chat.messages.value.length > 0"
        class="clear-button"
        @click="handleClear"
      >
        Clear
      </button>
    </div>

    <div ref="messagesContainer" class="messages-list">
      <div v-if="chat.messages.value.length === 0" class="empty-state">
        <p>Ask Quill about this email. You can request summaries, draft replies, or extract information.</p>
      </div>
      <ChatMessage
        v-for="(msg, index) in chat.messages.value"
        :key="index"
        :role="msg.role"
        :content="msg.content"
        :timestamp="msg.timestamp"
      />
      <LoadingIndicator v-if="chat.isStreaming.value" />
    </div>

    <div v-if="chat.error.value" class="chat-error">
      {{ chat.error.value }}
    </div>

    <div class="chat-input-area">
      <textarea
        v-model="inputText"
        class="chat-input"
        placeholder="Ask about this email..."
        rows="2"
        @keydown="handleKeydown"
      />
      <div class="input-actions">
        <button
          v-if="chat.isStreaming.value"
          class="cancel-button"
          @click="chat.cancelStream"
        >
          Stop
        </button>
        <button
          v-else
          class="send-button"
          :disabled="!inputText.trim()"
          @click="handleSend"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.clear-button {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.clear-button:hover {
  background: var(--color-bg-secondary);
}

.messages-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-secondary);
  text-align: center;
  font-size: 13px;
  padding: var(--spacing-lg);
}

.chat-error {
  padding: var(--spacing-xs) var(--spacing-md);
  background-color: #fde7e9;
  color: var(--color-error);
  font-size: 12px;
}

.chat-input-area {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-top: 1px solid var(--color-border);
  background: var(--color-bg);
}

.chat-input {
  flex: 1;
  resize: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm);
  font-size: 13px;
  line-height: 1.4;
  outline: none;
}

.chat-input:focus {
  border-color: var(--color-primary);
}

.input-actions {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.send-button,
.cancel-button {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}

.send-button {
  background-color: var(--color-primary);
  color: #fff;
}

.send-button:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-button {
  background-color: var(--color-error);
  color: #fff;
}

.cancel-button:hover {
  opacity: 0.9;
}
</style>
