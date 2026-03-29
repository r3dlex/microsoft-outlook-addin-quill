/**
 * Direct HTTP client for the Anthropic Claude API.
 * Uses fetch with ReadableStream to parse SSE streaming responses.
 */

import type { LlmProvider, StreamRequest, LlmMessage } from './provider';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const claudeProvider: LlmProvider = {
  name: 'anthropic',
  displayName: 'Anthropic Claude',
  defaultModel: 'claude-sonnet-4-20250514',
  availableModels: [
    'claude-sonnet-4-20250514',
    'claude-opus-4-20250514',
    'claude-3-5-haiku-20241022',
  ],

  async *stream(request: StreamRequest): AsyncIterable<string> {
    // Anthropic separates system prompt from messages
    const messages: AnthropicMessage[] = request.messages
      .filter((m: LlmMessage) => m.role !== 'system')
      .map((m: LlmMessage) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    const body: Record<string, unknown> = {
      model: request.model,
      max_tokens: request.maxTokens ?? 4096,
      stream: true,
      messages,
    };

    if (request.systemPrompt) {
      body.system = request.systemPrompt;
    }

    if (request.temperature !== undefined) {
      body.temperature = request.temperature;
    }

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': request.apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Anthropic API error (${response.status}): ${errorBody}`);
    }

    if (!response.body) {
      throw new Error('No response body from Anthropic API');
    }

    yield* parseAnthropicSSE(response.body);
  },

  async testConnection(apiKey: string): Promise<boolean> {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Anthropic API error (${response.status}): ${errorBody}`);
    }

    return true;
  },
};

/**
 * Parse Anthropic SSE stream.
 * Anthropic sends events like:
 *   event: content_block_delta
 *   data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hello"}}
 */
async function* parseAnthropicSSE(body: ReadableStream<Uint8Array>): AsyncIterable<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      // Keep the last potentially incomplete line in the buffer
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6);
          if (jsonStr === '[DONE]') return;

          try {
            const event = JSON.parse(jsonStr);
            if (
              event.type === 'content_block_delta' &&
              event.delta?.type === 'text_delta' &&
              event.delta.text
            ) {
              yield event.delta.text;
            }
          } catch {
            // Skip malformed JSON lines
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
