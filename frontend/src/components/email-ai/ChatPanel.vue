<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';
import { useChat } from '@/composables/useChat';
import { useOffice } from '@/composables/useOffice';
import ChatMessage from '@/components/shared/ChatMessage.vue';
import ProviderSelector from '@/components/shared/ProviderSelector.vue';
import LoadingIndicator from '@/components/shared/LoadingIndicator.vue';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const chat = useChat();
const office = useOffice();
const toast = useToast();
const inputText = ref<string>('');
const messagesContainer = ref<HTMLElement | null>(null);

function handleSend(): void {
  const text = inputText.value.trim();
  if (!text || chat.isStreaming.value) return;

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

// Show error in Toast when chat.error changes
watch(
  () => chat.error.value,
  (error) => {
    if (error) {
      toast.add({
        severity: 'error',
        summary: 'Chat Error',
        detail: error,
        life: 5000,
      });
    }
  },
);

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
    <Toast />
    <div class="chat-header">
      <ProviderSelector />
      <Button
        v-if="chat.messages.value.length > 0"
        label="Clear"
        severity="secondary"
        size="small"
        @click="handleClear"
      />
    </div>

    <div
      ref="messagesContainer"
      class="messages-list"
    >
      <div
        v-if="chat.messages.value.length === 0"
        class="empty-state"
      >
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

    <div class="chat-input-area">
      <Textarea
        v-model="inputText"
        class="chat-input"
        placeholder="Ask about this email..."
        :rows="2"
        @keydown="handleKeydown"
      />
      <div class="input-actions">
        <Button
          v-if="chat.isStreaming.value"
          label="Stop"
          severity="danger"
          @click="chat.cancelStream"
        />
        <Button
          v-else
          label="Send"
          :disabled="!inputText.trim()"
          @click="handleSend"
        />
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
}

.input-actions {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

:deep(.p-inputtextarea) {
  font-size: 13px;
}
</style>
