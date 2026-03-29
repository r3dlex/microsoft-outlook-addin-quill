/**
 * Direct HTTP client for the Google Gemini API.
 * Uses fetch with ReadableStream to parse JSON streaming responses.
 * Gemini uses a different streaming format: newline-delimited JSON arrays.
 */

import type { LlmProvider, StreamRequest, LlmMessage } from './provider';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

interface GeminiContent {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export const geminiProvider: LlmProvider = {
  name: 'gemini',
  displayName: 'Google Gemini',
  defaultModel: 'gemini-2.0-flash',
  availableModels: [
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
  ],

  async *stream(request: StreamRequest): AsyncIterable<string> {
    const contents: GeminiContent[] = [];

    for (const m of request.messages) {
      if (m.role === 'system') continue; // Handled via systemInstruction
      contents.push({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      });
    }

    const body: Record<string, unknown> = {
      contents,
      generationConfig: {
        maxOutputTokens: request.maxTokens ?? 4096,
      },
    };

    if (request.temperature !== undefined) {
      (body.generationConfig as Record<string, unknown>).temperature = request.temperature;
    }

    if (request.systemPrompt) {
      body.systemInstruction = {
        parts: [{ text: request.systemPrompt }],
      };
    }

    const url = `${GEMINI_API_BASE}/${request.model}:streamGenerateContent?alt=sse&key=${request.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
    }

    if (!response.body) {
      throw new Error('No response body from Gemini API');
    }

    yield* parseGeminiStream(response.body);
  },

  async testConnection(apiKey: string): Promise<boolean> {
    const url = `${GEMINI_API_BASE}/gemini-2.0-flash-lite:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Hi' }] }],
        generationConfig: { maxOutputTokens: 10 },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
    }

    return true;
  },
};

/**
 * Parse Gemini SSE stream.
 * With alt=sse, Gemini sends SSE events with JSON data containing:
 *   data: {"candidates":[{"content":{"parts":[{"text":"Hello"}]}}]}
 */
async function* parseGeminiStream(body: ReadableStream<Uint8Array>): AsyncIterable<string> {
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
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr);
            const parts = event.candidates?.[0]?.content?.parts;
            if (Array.isArray(parts)) {
              for (const part of parts) {
                if (part.text) {
                  yield part.text;
                }
              }
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
