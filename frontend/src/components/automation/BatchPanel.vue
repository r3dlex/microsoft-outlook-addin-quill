<script setup lang="ts">
import Button from 'primevue/button';
import Card from 'primevue/card';
</script>

<template>
  <Card class="batch-panel">
    <template #title>
      <h3 class="section-title">
        Batch Operations
      </h3>
    </template>
    <template #subtitle>
      Apply actions to multiple emails at once.
    </template>
    <template #content>
      <div class="batch-actions">
        <Button
          label="Move Selected"
          disabled
        />
        <Button
          label="Apply Rule"
          disabled
        />
        <Button
          label="Export"
          disabled
        />
      </div>
      <div class="placeholder-content">
        Select emails from search results to enable batch operations.
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

.batch-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
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
