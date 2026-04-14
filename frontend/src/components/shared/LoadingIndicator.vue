<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner';

withDefaults(defineProps<{ text?: string }>(), { text: 'Thinking...' });
</script>

<template>
  <div class="loading-indicator">
    <ProgressSpinner
      stroke-width="4"
      style="width: 20px; height: 20px"
      fill="transparent"
    />
    <span class="loading-text">{{ text }}</span>
  </div>
</template>

<style scoped>
.loading-indicator {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
}

.loading-text {
  font-size: 12px;
  color: var(--color-text-secondary);
}
</style>
