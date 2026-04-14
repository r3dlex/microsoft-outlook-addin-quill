<script setup lang="ts">
import { computed } from 'vue';
import Message from 'primevue/message';
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
    case 'user': return 'You';
    case 'assistant': return 'Quill';
    case 'system': return 'System';
    default: return props.role;
  }
});

/** PrimeVue severity: info=user, secondary=assistant, warn=system */
const severity = computed(() => {
  switch (props.role) {
    case 'user': return 'info';
    case 'assistant': return 'secondary';
    case 'system': return 'warn';
    default: return 'info';
  }
});
</script>

<template>
  <Message
    :severity="severity"
    :closable="false"
  >
    <div class="message-header">
      <span class="message-role">{{ roleLabel }}</span>
      <span class="message-time">{{ formattedTime }}</span>
    </div>
    <span class="message-content">{{ content }}</span>
  </Message>
</template>

<style scoped>
.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
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
