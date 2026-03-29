<script setup lang="ts">
import ChatPanel from '@/components/email-ai/ChatPanel.vue';
import { useOffice } from '@/composables/useOffice';

const office = useOffice();
</script>

<template>
  <div class="email-ai-view">
    <div v-if="office.isLoading.value" class="context-loading">
      Loading email context...
    </div>
    <div v-else-if="office.error.value" class="context-error">
      {{ office.error.value }}
    </div>
    <div v-else class="email-context">
      <div class="email-subject">{{ office.subject.value || 'No email selected' }}</div>
      <div class="email-from">{{ office.from.value }}</div>
    </div>
    <ChatPanel class="chat-section" />
  </div>
</template>

<style scoped>
.email-ai-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.context-loading,
.context-error {
  padding: var(--spacing-md);
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.context-error {
  color: var(--color-error);
}

.email-context {
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
}

.email-subject {
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.email-from {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.chat-section {
  flex: 1;
  min-height: 0;
}
</style>
