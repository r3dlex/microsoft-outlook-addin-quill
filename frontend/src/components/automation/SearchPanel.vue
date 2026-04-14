<script setup lang="ts">
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Card from 'primevue/card';

const searchQuery = ref<string>('');
</script>

<template>
  <Card class="search-panel">
    <template #title>
      <h3 class="section-title">
        Search Mailbox
      </h3>
    </template>
    <template #subtitle>
      Search across your mailbox folders with advanced filters.
    </template>
    <template #content>
      <div class="search-input-row">
        <InputText
          v-model="searchQuery"
          class="search-input"
          placeholder="Search emails..."
        />
        <Button
          label="Search"
          :disabled="!searchQuery.trim()"
        />
      </div>
      <div class="placeholder-content">
        Search results will appear here.
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

.search-input-row {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.search-input {
  flex: 1;
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
