<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

const router = useRouter();
const route = useRoute();

const tabs = [
  { label: 'Email AI', value: '/email-ai' },
  { label: 'Smart Actions', value: '/automation' },
  { label: 'Settings', value: '/settings' },
];

const activeIndex = computed(() => {
  const idx = tabs.findIndex((t) => t.value === route.path);
  return idx >= 0 ? idx : 0;
});
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <img
        src="/logo.svg"
        alt="Quill"
        class="app-logo"
      >
      <span class="app-title">Quill</span>
    </header>
    <TabView
      v-model:active-index="activeIndex"
      class="quill-tabview"
    >
      <TabPanel
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
      >
        {{ tab.label }}
      </TabPanel>
    </TabView>
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

.app-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.app-logo {
  width: 24px;
  height: 24px;
}

.app-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: -0.3px;
}

.quill-tabview {
  flex-shrink: 0;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
}

:deep(.p-tabview-nav) {
  background-color: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
}

:deep(.p-tabview-header) {
  font-size: 13px;
  font-weight: 600;
}
</style>
