/**
 * TypeScript interface for LLM providers.
 * Each provider implementation must conform to this contract.
 */

export type ProviderName = 'anthropic' | 'openai' | 'gemini' | 'minimax';

export interface LlmMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface StreamRequest {
  messages: LlmMessage[];
  model: string;
  apiKey: string;
  /** Optional system prompt (handled differently per provider) */
  systemPrompt?: string;
  /** Max tokens to generate */
  maxTokens?: number;
  /** Temperature 0-2 */
  temperature?: number;
}

export interface LlmProvider {
  readonly name: ProviderName;
  readonly displayName: string;
  readonly defaultModel: string;
  readonly availableModels: string[];

  /**
   * Stream a chat completion. Returns an AsyncIterable that yields
   * text chunks as they arrive from the provider API.
   */
  stream(request: StreamRequest): AsyncIterable<string>;

  /**
   * Test connectivity with a minimal API call.
   * Returns true if the key is valid and the API is reachable.
   * Throws an error with a descriptive message on failure.
   */
  testConnection(apiKey: string): Promise<boolean>;
}
