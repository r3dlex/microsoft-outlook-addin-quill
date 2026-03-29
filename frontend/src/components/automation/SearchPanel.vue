<script setup lang="ts">
import { ref } from 'vue';

/**
 * SearchPanel provides mailbox search functionality for the Automation tab.
 * Will integrate with useMailbox to search messages across folders with
 * filters for date, sender, subject, and content.
 */
const searchQuery = ref<string>('');
</script>

<template>
  <div class="search-panel">
    <h3 class="section-title">Search Mailbox</h3>
    <p class="section-description">
      Search across your mailbox folders with advanced filters.
      Results can be used with batch operations and automation rules.
    </p>
    <div class="search-input-row">
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="Search emails..."
      />
      <button class="search-button" :disabled="!searchQuery.trim()">
        Search
      </button>
    </div>
    <div class="placeholder-content">
      Search results will appear here.
    </div>
  </div>
</template>

<style scoped>
.search-panel {
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.section-description {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
}

.search-input-row {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.search-input {
  flex: 1;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  outline: none;
}

.search-input:focus {
  border-color: var(--color-primary);
}

.search-button {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.search-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.placeholder-content {
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  font-size: 13px;
  text-align: center;
}
</style>
