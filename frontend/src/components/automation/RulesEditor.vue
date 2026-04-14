<script setup lang="ts">
import Button from 'primevue/button';
import Card from 'primevue/card';
</script>

<template>
  <Card class="rules-editor">
    <template #title>
      <h3 class="section-title">
        Automation Rules
      </h3>
    </template>
    <template #subtitle>
      Create rules to automatically organize emails.
    </template>
    <template #content>
      <div class="placeholder-content">
        <p>No rules configured yet.</p>
        <Button
          label="Create New Rule"
          class="add-rule-button"
        />
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

.placeholder-content {
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  font-size: 13px;
  text-align: center;
}

:deep(.add-rule-button) {
  margin-top: var(--spacing-sm);
}
</style>
