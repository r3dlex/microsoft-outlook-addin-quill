<script setup lang="ts">
import { useChatStore } from '@/stores/chat';
import { getAllProviders } from '@/services/llm/router';
import type { ProviderName } from '@/services/llm/provider';
import Select from 'primevue/select';

const chatStore = useChatStore();
const providers = getAllProviders();

function onProviderChange(value: ProviderName): void {
  chatStore.setProvider(value);
}

function onModelChange(event: { value: string }): void {
  chatStore.setModel(event.value);
}

function currentProviderModels(): string[] {
  const provider = providers.find((p) => p.name === chatStore.currentProvider);
  return provider?.availableModels ?? [];
}
</script>

<template>
  <div class="provider-selector">
    <Select
      :model-value="chatStore.currentProvider"
      :options="providers"
      option-label="displayName"
      option-value="name"
      placeholder="Provider"
      class="selector-dropdown"
      @update:model-value="onProviderChange"
    />
    <Select
      :model-value="chatStore.currentModel"
      :options="currentProviderModels()"
      placeholder="Model"
      class="selector-dropdown model-dropdown"
      @update:model-value="onModelChange"
    />
  </div>
</template>

<style scoped>
.provider-selector {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

:deep(.selector-dropdown) {
  font-size: 12px;
}

.model-dropdown {
  max-width: 160px;
}
</style>
