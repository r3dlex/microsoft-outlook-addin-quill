<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useSettings } from '@/composables/useSettings';
import { useAuth } from '@/composables/useAuth';
import { getAllProviders } from '@/services/llm/router';
import type { ProviderName } from '@/services/llm/provider';

/**
 * ProviderConfig is the main settings component.
 * Provides passphrase entry, per-provider API key input with save/test buttons,
 * and default model selection per provider.
 */
const settings = useSettings();
const auth = useAuth();

const providers = getAllProviders();

const passphrase = ref<string>('');
const passphraseError = ref<string>('');

// Per-provider state
const providerState = reactive<
  Record<string, {
    apiKeyInput: string;
    isSaving: boolean;
    isTesting: boolean;
    message: string;
    messageType: 'success' | 'error' | '';
  }>
>({});

// Initialize provider state
for (const p of providers) {
  providerState[p.name] = {
    apiKeyInput: '',
    isSaving: false,
    isTesting: false,
    message: '',
    messageType: '',
  };
}

onMounted(() => {
  auth.initialize();
});

async function handleUnlock(): Promise<void> {
  passphraseError.value = '';
  await auth.unlock(passphrase.value);
  if (auth.error.value) {
    passphraseError.value = auth.error.value;
  }
}

function handleLock(): void {
  auth.lock();
  passphrase.value = '';
}

async function saveKey(providerName: ProviderName): Promise<void> {
  const state = providerState[providerName];
  if (!state.apiKeyInput.trim()) return;

  state.isSaving = true;
  state.message = '';
  try {
    await settings.saveApiKey(providerName, state.apiKeyInput.trim());
    state.apiKeyInput = '';
    state.message = 'API key saved successfully';
    state.messageType = 'success';
  } catch (e) {
    state.message = e instanceof Error ? e.message : 'Failed to save key';
    state.messageType = 'error';
  } finally {
    state.isSaving = false;
  }
}

async function testKey(providerName: ProviderName): Promise<void> {
  const state = providerState[providerName];
  state.isTesting = true;
  state.message = '';
  try {
    await settings.testConnection(providerName);
    state.message = 'Connection successful!';
    state.messageType = 'success';
  } catch (e) {
    state.message = e instanceof Error ? e.message : 'Connection failed';
    state.messageType = 'error';
  } finally {
    state.isTesting = false;
  }
}

async function removeKey(providerName: ProviderName): Promise<void> {
  const state = providerState[providerName];
  state.message = '';
  try {
    await settings.removeApiKey(providerName);
    state.message = 'API key removed';
    state.messageType = 'success';
  } catch (e) {
    state.message = e instanceof Error ? e.message : 'Failed to remove key';
    state.messageType = 'error';
  }
}

function selectProvider(providerName: ProviderName): void {
  settings.setProvider(providerName);
}

function selectModel(providerName: ProviderName, model: string): void {
  settings.setDefaultModel(providerName, model);
}
</script>

<template>
  <div class="provider-config">
    <!-- Passphrase Section -->
    <div class="section">
      <h3 class="section-title">Passphrase</h3>
      <p class="section-description">
        Enter a passphrase to encrypt your API keys. Keys are stored locally
        in your Outlook roaming settings, encrypted with AES-256-GCM.
      </p>
      <div v-if="!auth.isUnlocked.value" class="passphrase-form">
        <input
          v-model="passphrase"
          type="password"
          class="field-input"
          placeholder="Enter passphrase to unlock"
          @keydown.enter="handleUnlock"
        />
        <button
          class="action-button primary"
          :disabled="!passphrase || auth.isAuthenticating.value"
          @click="handleUnlock"
        >
          {{ auth.isAuthenticating.value ? 'Unlocking...' : 'Unlock' }}
        </button>
        <div v-if="passphraseError" class="message error">{{ passphraseError }}</div>
      </div>
      <div v-else class="passphrase-unlocked">
        <span class="unlocked-badge">Unlocked</span>
        <button class="action-button" @click="handleLock">Lock</button>
      </div>
    </div>

    <!-- Provider Settings -->
    <div class="section">
      <h3 class="section-title">AI Providers</h3>
      <p class="section-description">
        Configure API keys and select default models for each provider.
        Select your preferred default provider below.
      </p>

      <div class="provider-list">
        <div
          v-for="provider in providers"
          :key="provider.name"
          class="provider-card"
          :class="{ selected: settings.currentProvider.value === provider.name }"
        >
          <div class="provider-header" @click="selectProvider(provider.name)">
            <span class="provider-label">{{ provider.displayName }}</span>
            <span
              v-if="settings.hasKey(provider.name)"
              class="key-badge"
            >Key saved</span>
            <span
              v-if="settings.currentProvider.value === provider.name"
              class="default-badge"
            >Default</span>
          </div>

          <div v-if="auth.isUnlocked.value" class="provider-body">
            <!-- Model Selection -->
            <div class="form-field">
              <label class="field-label">Default Model</label>
              <select
                class="field-select"
                :value="settings.providerSettings.value[provider.name]?.defaultModel"
                @change="selectModel(provider.name, ($event.target as HTMLSelectElement).value)"
              >
                <option
                  v-for="model in provider.availableModels"
                  :key="model"
                  :value="model"
                >
                  {{ model }}
                </option>
              </select>
            </div>

            <!-- API Key Input -->
            <div class="form-field">
              <label class="field-label">API Key</label>
              <div class="key-input-row">
                <input
                  v-model="providerState[provider.name].apiKeyInput"
                  type="password"
                  class="field-input"
                  :placeholder="settings.hasKey(provider.name) ? '(key saved - enter new to replace)' : 'Enter API key'"
                />
                <button
                  class="action-button primary"
                  :disabled="!providerState[provider.name].apiKeyInput.trim() || providerState[provider.name].isSaving"
                  @click="saveKey(provider.name)"
                >
                  {{ providerState[provider.name].isSaving ? '...' : 'Save' }}
                </button>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="provider-actions">
              <button
                v-if="settings.hasKey(provider.name)"
                class="action-button"
                :disabled="providerState[provider.name].isTesting"
                @click="testKey(provider.name)"
              >
                {{ providerState[provider.name].isTesting ? 'Testing...' : 'Test Connection' }}
              </button>
              <button
                v-if="settings.hasKey(provider.name)"
                class="action-button danger"
                @click="removeKey(provider.name)"
              >
                Remove Key
              </button>
            </div>

            <!-- Status Message -->
            <div
              v-if="providerState[provider.name].message"
              class="message"
              :class="providerState[provider.name].messageType"
            >
              {{ providerState[provider.name].message }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.provider-config {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.section {
  display: flex;
  flex-direction: column;
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

.passphrase-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.passphrase-unlocked {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.unlocked-badge {
  padding: 2px 8px;
  background: #e6f4ea;
  color: #1e7e34;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
}

.provider-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.provider-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.provider-card.selected {
  border-color: var(--color-primary);
}

.provider-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  background: var(--color-bg);
}

.provider-card.selected .provider-header {
  background: #f0f6ff;
}

.provider-header:hover {
  background: var(--color-bg-secondary);
}

.provider-label {
  font-weight: 600;
  font-size: 13px;
  flex: 1;
}

.key-badge {
  padding: 1px 6px;
  background: #e6f4ea;
  color: #1e7e34;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 600;
}

.default-badge {
  padding: 1px 6px;
  background: #e8f0fe;
  color: var(--color-primary);
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 600;
}

.provider-body {
  padding: var(--spacing-sm) var(--spacing-md) var(--spacing-md);
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.field-input,
.field-select {
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  outline: none;
  font-size: 13px;
}

.field-input:focus,
.field-select:focus {
  border-color: var(--color-primary);
}

.key-input-row {
  display: flex;
  gap: var(--spacing-sm);
}

.key-input-row .field-input {
  flex: 1;
}

.provider-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.action-button {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.action-button:hover:not(:disabled) {
  background: var(--color-bg-secondary);
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button.primary {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.action-button.primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.action-button.danger {
  color: var(--color-error);
  border-color: var(--color-error);
}

.action-button.danger:hover:not(:disabled) {
  background: #fde7e9;
}

.message {
  font-size: 12px;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
}

.message.success {
  background: #e6f4ea;
  color: #1e7e34;
}

.message.error {
  background: #fde7e9;
  color: var(--color-error);
}
</style>
