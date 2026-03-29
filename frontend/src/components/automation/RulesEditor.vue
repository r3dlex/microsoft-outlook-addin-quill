<script setup lang="ts">
/**
 * RulesEditor allows users to create and manage automation rules.
 * Rules define conditions (sender, subject, content patterns) and
 * actions (move, label, forward, auto-reply) that can be applied
 * to incoming or existing emails.
 */
</script>

<template>
  <div class="rules-editor">
    <h3 class="section-title">Automation Rules</h3>
    <p class="section-description">
      Create rules to automatically organize, label, or process emails
      based on sender, subject, content, and other criteria.
    </p>
    <div class="placeholder-content">
      <p>No rules configured yet.</p>
      <button class="add-rule-button">Create New Rule</button>
    </div>
  </div>
</template>

<style scoped>
.rules-editor {
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.section-description {
  font-size: 12px;
  color: var(--color-text-secondary);
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

.add-rule-button {
  margin-top: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 13px;
}
</style>
