<script setup lang="ts">
import ChatPanel from '@/components/email-ai/ChatPanel.vue';
import { useOffice } from '@/composables/useOffice';
import Panel from 'primevue/panel';
import Tag from 'primevue/tag';

const office = useOffice();
</script>

<template>
  <div class="email-ai-view">
    <Panel
      v-if="office.isLoading.value"
      class="context-loading"
    >
      <template #header>
        Loading email context...
      </template>
    </Panel>
    <Panel
      v-else-if="office.error.value"
      class="context-error"
    >
      <template #header>
        Error
      </template>
      {{ office.error.value }}
    </Panel>
    <Panel
      v-else
      class="email-context"
    >
      <template #header>
        <Tag
          :value="office.subject.value || 'No email selected'"
          severity="info"
        />
      </template>
      <span class="email-from">{{ office.from.value }}</span>
    </Panel>
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

.email-from {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.chat-section {
  flex: 1;
  min-height: 0;
}
</style>
