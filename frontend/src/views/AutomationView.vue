<script setup lang="ts">
import { useMailbox } from '@/composables/useMailbox';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Message from 'primevue/message';

const mailbox = useMailbox();
</script>

<template>
  <div class="smart-actions-view">
    <h2 class="view-title">
      Smart Actions
    </h2>
    <p class="view-description">
      Select multiple emails in Outlook and apply AI-powered actions to them.
    </p>

    <Card class="multi-select-panel">
      <template #title>
        <h3 class="panel-title">
          Multi-Select Operations
        </h3>
      </template>
      <template #subtitle>
        Select emails in your Outlook mail list, then use the button below
        to load them for batch processing.
      </template>
      <template #content>
        <Button
          :label="mailbox.isLoading.value ? 'Loading...' : 'Get Selected Emails'"
          :disabled="mailbox.isLoading.value"
          @click="mailbox.getSelectedItems()"
        />

        <Message
          v-if="mailbox.error.value"
          severity="error"
          :closable="false"
        >
          {{ mailbox.error.value }}
        </Message>

        <div
          v-if="mailbox.selectedItems.value.length > 0"
          class="selected-list"
        >
          <h4 class="list-title">
            Selected ({{ mailbox.selectedItems.value.length }})
          </h4>
          <ul class="items-list">
            <li
              v-for="item in mailbox.selectedItems.value"
              :key="item.itemId"
              class="item-entry"
            >
              {{ item.subject || '(No subject)' }}
            </li>
          </ul>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.smart-actions-view {
  padding: var(--spacing-md);
}

.view-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.view-description {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
}

.multi-select-panel {
  margin-bottom: var(--spacing-md);
}

.panel-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
}

.list-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.items-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-entry {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
