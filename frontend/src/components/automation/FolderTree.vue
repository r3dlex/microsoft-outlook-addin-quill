<script setup lang="ts">
import { onMounted } from 'vue';
import { useMailbox } from '@/composables/useMailbox';

/**
 * FolderTree displays the user's mailbox folder hierarchy.
 * Integrates with useMailbox to fetch folders from the Phoenix backend.
 * Supports selecting folders for search scope and batch operations.
 */
const mailbox = useMailbox();

onMounted(() => {
  // Folder fetching will be triggered when backend is available
  // mailbox.fetchFolders();
});
</script>

<template>
  <div class="folder-tree">
    <h3 class="section-title">Folders</h3>
    <p class="section-description">
      Browse your mailbox folder structure. Select a folder to scope
      searches or apply batch operations.
    </p>
    <div v-if="mailbox.isLoading.value" class="loading-state">
      Loading folders...
    </div>
    <div v-else-if="mailbox.folders.value.length === 0" class="placeholder-content">
      Connect to your mailbox to view folder structure.
    </div>
    <ul v-else class="folder-list">
      <li
        v-for="folder in mailbox.folders.value"
        :key="folder.id"
        class="folder-item"
      >
        {{ folder.displayName }} ({{ folder.unreadItemCount }})
      </li>
    </ul>
  </div>
</template>

<style scoped>
.folder-tree {
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

.loading-state {
  color: var(--color-text-secondary);
  font-size: 13px;
  text-align: center;
  padding: var(--spacing-md);
}

.placeholder-content {
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  font-size: 13px;
  text-align: center;
}

.folder-list {
  list-style: none;
}

.folder-item {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: 13px;
  cursor: pointer;
  border-radius: var(--radius-sm);
}

.folder-item:hover {
  background: var(--color-bg-secondary);
}
</style>
