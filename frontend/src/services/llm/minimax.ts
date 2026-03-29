/**
 * Direct HTTP client for the MiniMax API.
 * MiniMax uses an Anthropic-compatible SSE streaming format.
 */

import type { LlmProvider, StreamRequest, LlmMessage } from './provider';

const MINIMAX_API_URL = 'https://api.minimaxi.chat/v1/text/chatcompletion_v2';

interface MiniMaxMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const minimaxProvider: LlmProvider = {
  name: 'minimax',
  displayName: 'MiniMax',
  defaultModel: 'MiniMax-Text-01',
  availableModels: [
    'MiniMax-Text-01',
    'abab6.5s-chat',
    'abab6.5-chat',
  ],

  async *stream(request: StreamRequest): AsyncIterable<string> {
    const messages: MiniMaxMessage[] = [];

    if (request.systemPrompt) {
      messages.push({ role: 'system', content: request.systemPrompt });
    }

    for (const m of request.messages) {
      if (m.role === 'system' && request.systemPrompt) continue;
      messages.push({ role: m.role, content: m.content });
    }

    const body: Record<string, unknown> = {
      model: request.model,
      stream: true,
      messages,
    };

    if (request.maxTokens) {
      body.max_tokens = request.maxTokens;
    }

    if (request.temperature !== undefined) {
      body.temperature = request.temperature;
    }

    const response = await fetch(MINIMAX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${request.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`MiniMax API error (${response.status}): ${errorBody}`);
    }

    if (!response.body) {
      throw new Error('No response body from MiniMax API');
    }

    yield* parseMiniMaxSSE(response.body);
  },

  async testConnection(apiKey: string): Promise<boolean> {
    const response = await fetch(MINIMAX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'abab6.5s-chat',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`MiniMax API error (${response.status}): ${errorBody}`);
    }

    return true;
  },
};

/**
 * Parse MiniMax SSE stream.
 * MiniMax sends SSE events similar to OpenAI format:
 *   data: {"choices":[{"delta":{"content":"Hello"}}]}
 *   data: [DONE]
 */
async function* parseMiniMaxSSE(body: ReadableStream<Uint8Array>): AsyncIterable<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') return;

          try {
            const event = JSON.parse(jsonStr);
            const content = event.choices?.[0]?.delta?.content;
            if (content) {
              yield content;
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
