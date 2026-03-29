<script setup lang="ts">
/**
 * ExtractView provides AI-powered data extraction from emails.
 * Will use useChat to extract structured data such as dates, addresses,
 * amounts, tracking numbers, and other key information from the email body.
 */
</script>

<template>
  <div class="extract-view">
    <h3 class="section-title">Data Extraction</h3>
    <p class="section-description">
      Extract structured information from the current email: dates, addresses,
      amounts, tracking numbers, and other key data points.
    </p>
    <div class="placeholder-content">
      Extracted data fields will appear here after analysis.
    </div>
  </div>
</template>

<style scoped>
.extract-view {
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
