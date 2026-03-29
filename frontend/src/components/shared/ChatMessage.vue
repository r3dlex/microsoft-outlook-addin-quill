<script setup lang="ts">
import { computed } from 'vue';
import type { MessageRole } from '@/stores/chat';

const props = defineProps<{
  role: MessageRole;
  content: string;
  timestamp: number;
}>();

const formattedTime = computed(() => {
  const date = new Date(props.timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
});

const roleLabel = computed(() => {
  switch (props.role) {
    case 'user':
      return 'You';
    case 'assistant':
      return 'Quill';
    case 'system':
      return 'System';
    default:
      return props.role;
  }
});
</script>

<template>
  <div class="chat-message" :class="[`role-${role}`]">
    <div class="message-header">
      <span class="message-role">{{ roleLabel }}</span>
      <span class="message-time">{{ formattedTime }}</span>
    </div>
    <div class="message-content">
      {{ content }}
    </div>
  </div>
</template>

<style scoped>
.chat-message {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 13px;
  line-height: 1.5;
}

.role-user {
  background: #e8f0fe;
  align-self: flex-end;
  margin-left: var(--spacing-lg);
}

.role-assistant {
  background: var(--color-bg-secondary);
  align-self: flex-start;
  margin-right: var(--spacing-lg);
}

.role-system {
  background: #fff8e1;
  align-self: center;
  font-style: italic;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
}

.message-role {
  font-weight: 600;
  font-size: 12px;
}

.message-time {
  font-size: 11px;
  color: var(--color-text-secondary);
}

.message-content {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
