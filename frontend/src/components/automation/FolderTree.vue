<script setup lang="ts">
import { useMailbox } from '@/composables/useMailbox';
import Card from 'primevue/card';

const mailbox = useMailbox();
</script>

<template>
  <Card class="folder-tree">
    <template #title>
      <h3 class="section-title">
        Folders
      </h3>
    </template>
    <template #subtitle>
      Browse your mailbox folder structure.
    </template>
    <template #content>
      <div class="placeholder-content">
        Connect to your mailbox to view folder structure.
      </div>
    </template>
  </Card>
</template>

<style scoped>
.section-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
}

.loading-state,
.placeholder-content {
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  font-size: 13px;
  text-align: center;
}
</style>
