<script setup lang="ts">
import ProviderConfig from '@/components/settings/ProviderConfig.vue';
</script>

<template>
  <div class="settings-view">
    <h2 class="view-title">Settings</h2>
    <p class="view-description">
      Configure your AI providers, API keys, and model preferences.
    </p>
    <div class="settings-sections">
      <ProviderConfig />
    </div>

    <footer class="about-section">
      <img src="/logo.svg" alt="Quill" class="about-logo" />
      <div class="about-text">
        <span class="about-name">Quill</span>
        <span class="about-version">v1.0.0</span>
      </div>
      <p class="about-tagline">AI Mail Assistant for Microsoft Outlook</p>
    </footer>
  </div>
</template>

<style scoped>
.settings-view {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.view-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.view-description {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
}

.settings-sections {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  flex: 1;
}

.about-section {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.about-logo {
  width: 40px;
  height: 40px;
  opacity: 0.8;
}

.about-text {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-xs);
}

.about-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-primary);
}

.about-version {
  font-size: 11px;
  color: var(--color-text-secondary);
}

.about-tagline {
  font-size: 11px;
  color: var(--color-text-secondary);
}
</style>
