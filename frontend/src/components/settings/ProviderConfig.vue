<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useSettings } from '@/composables/useSettings';
import { useAuth } from '@/composables/useAuth';
import { getAllProviders } from '@/services/llm/router';
import type { ProviderName } from '@/services/llm/provider';
import Password from 'primevue/password';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Tag from 'primevue/tag';

const settings = useSettings();
const auth = useAuth();
const providers = getAllProviders();

const passphrase = ref<string>('');
const passphraseError = ref<string>('');

const providerState = reactive<
  Record<string, {
    apiKeyInput: string;
    isSaving: boolean;
    isTesting: boolean;
    message: string;
    messageType: 'success' | 'error' | '';
  }>
>({});

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

function selectModel(providerName: ProviderName, event: { value: string }): void {
  settings.setDefaultModel(providerName, event.value);
}
</script>

<template>
  <div class="provider-config">
    <!-- Passphrase Section -->
    <div class="section">
      <h3 class="section-title">
        Passphrase
      </h3>
      <p class="section-description">
        Enter a passphrase to encrypt your API keys. Keys are stored locally
        in your Outlook roaming settings, encrypted with AES-256-GCM.
      </p>
      <div
        v-if="!auth.isUnlocked.value"
        class="passphrase-form"
      >
        <Password
          v-model="passphrase"
          class="field-input"
          placeholder="Enter passphrase to unlock"
          :feedback="false"
          toggle-mask
          @keydown.enter="handleUnlock"
        />
        <Button
          label="Unlock"
          :disabled="!passphrase || auth.isAuthenticating.value"
          @click="handleUnlock"
        />
        <div
          v-if="passphraseError"
          class="message error"
        >
          {{ passphraseError }}
        </div>
      </div>
      <div
        v-else
        class="passphrase-unlocked"
      >
        <Tag
          value="Unlocked"
          severity="success"
        />
        <Button
          label="Lock"
          severity="secondary"
          size="small"
          @click="handleLock"
        />
      </div>
    </div>

    <!-- Provider Settings -->
    <div class="section">
      <h3 class="section-title">
        AI Providers
      </h3>
      <p class="section-description">
        Configure API keys and select default models for each provider.
      </p>

      <Accordion>
        <AccordionPanel
          v-for="provider in providers"
          :key="provider.name"
          :value="provider.name"
        >
          <AccordionHeader>
            <div class="provider-header-row">
              <span
                class="provider-label"
                :class="{ selected: settings.currentProvider.value === provider.name }"
                @click="selectProvider(provider.name)"
              >
                {{ provider.displayName }}
              </span>
              <div class="provider-badges">
                <Tag
                  v-if="settings.hasKey(provider.name)"
                  value="Key saved"
                  severity="success"
                />
                <Tag
                  v-if="settings.currentProvider.value === provider.name"
                  value="Default"
                  severity="info"
                />
              </div>
            </div>
          </AccordionHeader>
          <AccordionContent>
            <div
              v-if="auth.isUnlocked.value"
              class="provider-body"
            >
              <!-- Model Selection -->
              <div class="form-field">
                <label class="field-label">Default Model</label>
                <Select
                  :model-value="settings.providerSettings.value[provider.name]?.defaultModel"
                  :options="provider.availableModels"
                  placeholder="Select model"
                  class="field-select"
                  @update:model-value="(val) => selectModel(provider.name, { value: val })"
                />
              </div>

              <!-- API Key Input -->
              <div class="form-field">
                <label class="field-label">API Key</label>
                <div class="key-input-row">
                  <Password
                    v-model="providerState[provider.name].apiKeyInput"
                    class="field-input"
                    :placeholder="settings.hasKey(provider.name) ? '(key saved - enter new to replace)' : 'Enter API key'"
                    :feedback="false"
                    toggle-mask
                  />
                  <Button
                    label="Save"
                    :disabled="!providerState[provider.name].apiKeyInput.trim() || providerState[provider.name].isSaving"
                    @click="saveKey(provider.name)"
                  />
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="provider-actions">
                <Button
                  v-if="settings.hasKey(provider.name)"
                  label="Test Connection"
                  severity="secondary"
                  size="small"
                  :loading="providerState[provider.name].isTesting"
                  @click="testKey(provider.name)"
                />
                <Button
                  v-if="settings.hasKey(provider.name)"
                  label="Remove Key"
                  severity="danger"
                  size="small"
                  @click="removeKey(provider.name)"
                />
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
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
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

.provider-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.provider-badges {
  display: flex;
  gap: var(--spacing-xs);
}

.provider-label {
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}

.provider-label.selected {
  color: var(--color-primary);
}

.provider-body {
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
  width: 100%;
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

:deep(.p-accordioncontent-content) {
  padding: var(--spacing-md);
}
</style>
