<script setup lang="ts">
import { useChatStore } from '@/stores/chat';
import { getAllProviders } from '@/services/llm/router';
import type { ProviderName } from '@/services/llm/provider';

/**
 * ProviderSelector is a compact dropdown for quickly switching the
 * AI provider within the chat interface. Appears in the ChatPanel header.
 */
const chatStore = useChatStore();
const providers = getAllProviders();

function onProviderChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  chatStore.setProvider(target.value as ProviderName);
}

function onModelChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  chatStore.setModel(target.value);
}

function currentProviderModels(): string[] {
  const provider = providers.find((p) => p.name === chatStore.currentProvider);
  return provider?.availableModels ?? [];
}
</script>

<template>
  <div class="provider-selector">
    <select
      class="selector-dropdown"
      :value="chatStore.currentProvider"
      @change="onProviderChange"
    >
      <option
        v-for="provider in providers"
        :key="provider.name"
        :value="provider.name"
      >
        {{ provider.displayName }}
      </option>
    </select>
    <select
      class="selector-dropdown model-dropdown"
      :value="chatStore.currentModel"
      @change="onModelChange"
    >
      <option value="">Default</option>
      <option
        v-for="model in currentProviderModels()"
        :key="model"
        :value="model"
      >
        {{ model }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.provider-selector {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.selector-dropdown {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 12px;
  background: var(--color-bg);
  outline: none;
}

.selector-dropdown:focus {
  border-color: var(--color-primary);
}

.model-dropdown {
  max-width: 160px;
}
</style>
