/**
 * Routes to the correct LLM provider based on provider name selection.
 */

import type { LlmProvider, ProviderName } from './provider';
import { claudeProvider } from './claude';
import { openaiProvider } from './openai';
import { geminiProvider } from './gemini';
import { minimaxProvider } from './minimax';

const providers: Record<ProviderName, LlmProvider> = {
  anthropic: claudeProvider,
  openai: openaiProvider,
  gemini: geminiProvider,
  minimax: minimaxProvider,
};

/**
 * Get the LLM provider implementation for a given provider name.
 */
export function getProvider(name: ProviderName): LlmProvider {
  const provider = providers[name];
  if (!provider) {
    throw new Error(`Unknown LLM provider: ${name}`);
  }
  return provider;
}

/**
 * Get all available provider implementations.
 */
export function getAllProviders(): LlmProvider[] {
  return Object.values(providers);
}

/**
 * Get all provider names.
 */
export function getProviderNames(): ProviderName[] {
  return Object.keys(providers) as ProviderName[];
}
