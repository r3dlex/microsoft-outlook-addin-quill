<script setup lang="ts">
/**
 * BatchPanel provides batch operations on selected emails.
 * Supports bulk move, delete, label, and rule application
 * across search results or folder contents.
 */
</script>

<template>
  <div class="batch-panel">
    <h3 class="section-title">Batch Operations</h3>
    <p class="section-description">
      Apply actions to multiple emails at once. Select emails from search
      results, then choose an operation to apply in bulk.
    </p>
    <div class="batch-actions">
      <button class="batch-button" disabled>Move Selected</button>
      <button class="batch-button" disabled>Apply Rule</button>
      <button class="batch-button" disabled>Export</button>
    </div>
    <div class="placeholder-content">
      Select emails from search results to enable batch operations.
    </div>
  </div>
</template>

<style scoped>
.batch-panel {
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

.batch-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.batch-button {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  font-size: 13px;
  font-weight: 600;
}

.batch-button:disabled {
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
