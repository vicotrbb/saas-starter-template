/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from 'openai';
import logger from '../api/logger';
import { estimateTokenCount } from '../utils';

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-2024-05-13';
const DEFAULT_MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS || '4096');
const DEFAULT_TEMPERATURE = parseFloat(process.env.OPENAI_TEMPERATURE || '0.7');

let openaiClient: OpenAI | null = null;

/**
 * Get the OpenAI client instance
 * @returns Initialized OpenAI client
 * @throws Error if API key is not configured
 */
export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    openaiClient = new OpenAI({ apiKey });
  }

  return openaiClient;
}

/**
 * Configuration options for OpenAI chat completion
 */
export interface ChatCompletionOptions {
  /** OpenAI model to use (default: from env or gpt-4o-2024-05-13) */
  model?: string;
  /** Maximum tokens in the response (default: from env or 4096) */
  maxTokens?: number;
  /** Temperature for generation (default: from env or 0.7) */
  temperature?: number;
  /** Whether to stream the response */
  stream?: boolean;
  /** Custom response format */
  responseFormat?: { type: string };
}

/**
 * Generate completion using OpenAI chat API
 * @param systemPrompt - System prompt to use
 * @param userPrompt - User prompt content
 * @param options - Configuration options
 * @returns Generated content
 * @throws Error if the API call fails
 */
export async function generateChatCompletion(
  systemPrompt: string,
  userPrompt: string,
  options: ChatCompletionOptions = {}
): Promise<string> {
  const client = getOpenAIClient();

  try {
    const promptTokens = estimateTokenCount(systemPrompt + userPrompt);
    logger.info(`Estimated prompt tokens: ${promptTokens}`);

    const {
      model = DEFAULT_MODEL,
      maxTokens = DEFAULT_MAX_TOKENS,
      temperature = DEFAULT_TEMPERATURE,
      stream = false,
    } = options;

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature,
      stream,
    });

    const content = (completion as any)?.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No completion content found in the response');
    }

    return content;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        throw new Error('OpenAI rate limit exceeded. Please try again later.');
      }

      throw new Error(`OpenAI API error: ${error.message}`);
    }

    logger.error('Error generating chat completion:', error);
    throw error instanceof Error ? error : new Error('Failed to generate completion');
  }
}

/**
 * Generate completion with streaming support
 * @param systemPrompt - System prompt to use
 * @param userPrompt - User prompt content
 * @param onChunk - Callback for each chunk of streamed content
 * @param options - Configuration options
 * @returns Complete generated content as string
 */
export async function generateStreamingCompletion(
  systemPrompt: string,
  userPrompt: string,
  onChunk: (_chunk: string) => void,
  options: ChatCompletionOptions = {}
): Promise<string> {
  const client = getOpenAIClient();

  try {
    const promptTokens = estimateTokenCount(systemPrompt + userPrompt);
    logger.info(`Estimated prompt tokens: ${promptTokens}`);

    const {
      model = DEFAULT_MODEL,
      maxTokens = DEFAULT_MAX_TOKENS,
      temperature = DEFAULT_TEMPERATURE,
    } = options;

    const stream = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature,
      stream: true,
    });

    let fullContent = '';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';

      if (content) {
        fullContent += content;
        onChunk(content);
      }
    }

    return fullContent;
  } catch (error) {
    logger.error('Error generating streaming completion:', error as Error);
    throw error instanceof Error ? error : new Error('Failed to generate streaming completion');
  }
}
