<script setup lang="ts">
/**
 * SummaryView displays an AI-generated summary of the current email.
 * Will integrate with useChat to request and display one-shot summaries
 * of the email body, highlighting key points and action items.
 */
</script>

<template>
  <div class="summary-view">
    <h3 class="section-title">Email Summary</h3>
    <p class="section-description">
      AI-generated summary of the current email, highlighting key points,
      action items, and important dates.
    </p>
    <div class="placeholder-content">
      Summary will appear here after selecting an email and requesting a summary.
    </div>
  </div>
</template>

<style scoped>
.summary-view {
  padding: var(--spacing-md);
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
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-size: 13px;
  text-align: center;
}
</style>
