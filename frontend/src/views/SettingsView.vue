<script setup lang="ts">
import ProviderConfig from '@/components/settings/ProviderConfig.vue';
</script>

<template>
  <div class="settings-view">
    <h2 class="view-title">Settings</h2>
    <p class="view-description">
      Configure your AI providers, API keys, and model preferences.
    </p>
    <div class="settings-sections">
      <ProviderConfig />
    </div>
  </div>
</template>

<style scoped>
.settings-view {
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

.settings-sections {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}
</style>
