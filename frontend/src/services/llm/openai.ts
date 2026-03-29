/**
 * Direct HTTP client for the OpenAI API.
 * Uses fetch with ReadableStream to parse SSE streaming responses.
 */

import type { LlmProvider, StreamRequest, LlmMessage } from './provider';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface OpenAiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const openaiProvider: LlmProvider = {
  name: 'openai',
  displayName: 'OpenAI',
  defaultModel: 'gpt-4o',
  availableModels: [
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-3.5-turbo',
  ],

  async *stream(request: StreamRequest): AsyncIterable<string> {
    const messages: OpenAiMessage[] = [];

    // Add system prompt as a system message if provided
    if (request.systemPrompt) {
      messages.push({ role: 'system', content: request.systemPrompt });
    }

    for (const m of request.messages) {
      if (m.role === 'system' && request.systemPrompt) continue; // already added
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

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${request.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${errorBody}`);
    }

    if (!response.body) {
      throw new Error('No response body from OpenAI API');
    }

    yield* parseOpenAiSSE(response.body);
  },

  async testConnection(apiKey: string): Promise<boolean> {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${errorBody}`);
    }

    return true;
  },
};

/**
 * Parse OpenAI SSE stream.
 * OpenAI sends events like:
 *   data: {"id":"...","object":"chat.completion.chunk","choices":[{"delta":{"content":"Hello"},...}]}
 *   data: [DONE]
 */
async function* parseOpenAiSSE(body: ReadableStream<Uint8Array>): AsyncIterable<string> {
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
