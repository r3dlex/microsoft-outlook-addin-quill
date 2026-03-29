<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

interface Tab {
  label: string;
  path: string;
}

const tabs: Tab[] = [
  { label: 'Email AI', path: '/email-ai' },
  { label: 'Smart Actions', path: '/automation' },
  { label: 'Settings', path: '/settings' },
];

function navigateTo(path: string): void {
  router.push(path);
}

function isActive(path: string): boolean {
  return route.path === path;
}
</script>

<template>
  <div class="app-shell">
    <nav class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.path"
        class="tab-button"
        :class="{ active: isActive(tab.path) }"
        @click="navigateTo(tab.path)"
      >
        {{ tab.label }}
      </button>
    </nav>
    <main class="tab-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tab-bar {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-bg-secondary);
  flex-shrink: 0;
}

.tab-button {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  font-weight: 600;
  font-size: 13px;
  transition: color 0.15s, border-color 0.15s;
  border-bottom: 2px solid transparent;
}

.tab-button:hover {
  color: var(--color-primary);
}

.tab-button.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.tab-content {
  flex: 1;
  overflow-y: auto;
}
</style>
