<script setup lang="ts">
withDefaults(defineProps<{ text?: string }>(), { text: 'Thinking...' });
</script>

<template>
  <div class="loading-indicator">
    <div class="logo-spinner">
      <img src="/logo.svg" alt="" class="spinner-logo" />
    </div>
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

.logo-spinner {
  width: 20px;
  height: 20px;
  animation: pulse 1.2s ease-in-out infinite;
}

.spinner-logo {
  width: 100%;
  height: 100%;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.loading-text {
  font-size: 12px;
  color: var(--color-text-secondary);
}
</style>
