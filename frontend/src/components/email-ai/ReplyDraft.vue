<script setup lang="ts">
/**
 * ReplyDraft provides AI-assisted reply drafting.
 * Will integrate with useChat to generate reply suggestions based on
 * the current email context, and with useOffice to insert the draft
 * into the Outlook compose window.
 */
</script>

<template>
  <div class="reply-draft">
    <h3 class="section-title">
      Reply Draft
    </h3>
    <p class="section-description">
      Generate AI-powered reply drafts based on the current email context.
      Edit and refine before inserting into your reply.
    </p>
    <div class="placeholder-content">
      Select a tone and click "Generate Reply" to create a draft response.
    </div>
  </div>
</template>

<style scoped>
.reply-draft {
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
