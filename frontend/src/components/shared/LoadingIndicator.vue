<script setup lang="ts">
/**
 * LoadingIndicator shows a simple animated spinner.
 * Used during AI streaming responses and data loading operations.
 */
</script>

<template>
  <div class="loading-indicator">
    <div class="spinner" />
    <span class="loading-text">Thinking...</span>
  </div>
</template>

<style scoped>
.loading-indicator {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 12px;
  color: var(--color-text-secondary);
}
</style>
