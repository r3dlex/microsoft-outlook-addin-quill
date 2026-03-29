<script setup lang="ts">
import { useMailbox } from '@/composables/useMailbox';

const mailbox = useMailbox();
</script>

<template>
  <div class="smart-actions-view">
    <h2 class="view-title">Smart Actions</h2>
    <p class="view-description">
      Select multiple emails in Outlook and apply AI-powered actions to them.
    </p>

    <div class="actions-section">
      <div class="multi-select-panel">
        <h3 class="panel-title">Multi-Select Operations</h3>
        <p class="panel-description">
          Select emails in your Outlook mail list, then use the button below
          to load them for batch processing.
        </p>

        <button
          class="action-button"
          :disabled="mailbox.isLoading.value"
          @click="mailbox.getSelectedItems()"
        >
          {{ mailbox.isLoading.value ? 'Loading...' : 'Get Selected Emails' }}
        </button>

        <div v-if="mailbox.error.value" class="error-message">
          {{ mailbox.error.value }}
        </div>

        <div v-if="mailbox.selectedItems.value.length > 0" class="selected-list">
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
      </div>
    </div>
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

.actions-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.multi-select-panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.panel-title {
  font-size: 15px;
  font-weight: 600;
}

.panel-description {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.action-button {
  align-self: flex-start;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}

.action-button:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: #fde7e9;
  color: var(--color-error);
  border-radius: var(--radius-sm);
  font-size: 12px;
}

.selected-list {
  margin-top: var(--spacing-sm);
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
