/**
 * @file LocalAIGatewayClient.ts
 * @description YYC³ AI小语智能成长守护系统 - 本地AI网关API客户端，提供与LocalAIGateway的安全连接
 * @module services/ai
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-19
 * @updated 2026-01-19
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import type {
  ChatMessage,
  ChatOptions,
  ChatResponse,
  ModelInfo,
  HealthStatus,
  ServiceMetrics,
} from './AIServiceAdapter';

export interface LocalAIGatewayConfig {
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
}

export interface GatewayHealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    ollama: {
      status: 'healthy' | 'degraded' | 'unhealthy';
      models_loaded: string[];
      gpu_available: boolean;
      memory_usage: {
        used: number;
        total: number;
        percentage: number;
      };
      response_time: {
        avg: number;
        p95: number;
        p99: number;
      };
    };
    gateway: {
      status: 'healthy';
      uptime: number;
      memory: NodeJS.MemoryUsage;
    };
  };
  metrics: {
    total_requests: number;
    successful_requests: number;
    avg_response_time: number;
  };
}

export interface GatewayChatRequest {
  messages: ChatMessage[];
  options?: ChatOptions;
  use_rag?: boolean;
  user_context?: Record<string, unknown>;
}

export interface GatewayChatResponse {
  success: boolean;
  data?: {
    answer: string;
    sources: Array<{
      id: string;
      content: string;
      score: number;
    }>;
    confidence: number;
    reasoning: string;
    related_questions: string[];
    follow_up_suggestions: string[];
    model: string;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
    thinking_time?: number;
  };
  error?: string;
  code?: string;
  timestamp: string;
}

export interface GatewayModelsResponse {
  success: boolean;
  data?: {
    models: ModelInfo[];
    current_model: string;
  };
  error?: string;
  code?: string;
  timestamp: string;
}

export interface GatewayMetricsResponse {
  success: boolean;
  data?: {
    ollama: ServiceMetrics;
    health: HealthStatus;
    knowledge: {
      total_documents: number;
      total_chunks: number;
      last_updated: string;
    };
    system: {
      uptime: number;
      memory: NodeJS.MemoryUsage;
      cpu: NodeJS.CpuUsage;
    };
  };
  error?: string;
  code?: string;
  timestamp: string;
}

export class LocalAIGatewayClient {
  private baseUrl: string;
  private timeout: number;
  private maxRetries: number;
  private retryDelay: number;
  private requestQueue: Map<string, AbortController> = new Map();

  constructor(config: LocalAIGatewayConfig = {}) {
    this.baseUrl = config.baseUrl || 'http://localhost:8081';
    this.timeout = config.timeout || 30000;
    this.maxRetries = config.maxRetries || 3;
    this.retryDelay = config.retryDelay || 1000;
  }

  private async fetchWithRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    retries = this.maxRetries
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const requestId = this.generateRequestId();

    try {
      const controller = new AbortController();
      this.requestQueue.set(requestId, controller);

      const timeoutId = setTimeout(() => {
        controller.abort();
      }, this.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);
      this.requestQueue.delete(requestId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Gateway API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`
        );
      }

      return await response.json();
    } catch (error) {
      this.requestQueue.delete(requestId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }

      if (retries > 0) {
        console.warn(`Request failed, retrying... (${retries} attempts left)`, error);
        await this.delay(this.retryDelay);
        return this.fetchWithRetry<T>(endpoint, options, retries - 1);
      }

      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async healthCheck(): Promise<GatewayHealthResponse> {
    return this.fetchWithRetry<GatewayHealthResponse>('/health');
  }

  async chat(
    request: GatewayChatRequest
  ): Promise<GatewayChatResponse> {
    return this.fetchWithRetry<GatewayChatResponse>('/api/chat', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async chatStream(
    request: GatewayChatRequest,
    onMessage: (message: string, done: boolean) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    const url = `${this.baseUrl}/api/chat/stream`;
    const requestId = this.generateRequestId();

    try {
      const controller = new AbortController();
      this.requestQueue.set(requestId, controller);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Gateway API error: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body available');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() && line.startsWith('data: ')) {
            try {
              const data = line.slice(6);
              if (data === '[DONE]') {
                onMessage('', true);
                break;
              }

              const parsed = JSON.parse(data);
              if (parsed.type === 'message') {
                onMessage(parsed.content || '', parsed.done || false);
              } else if (parsed.type === 'error') {
                onError(new Error(parsed.error || 'Unknown error'));
              }
            } catch (e) {
              console.error('Failed to parse SSE data:', e);
            }
          }
        }
      }

      this.requestQueue.delete(requestId);
    } catch (error) {
      this.requestQueue.delete(requestId);
      onError(error as Error);
    }
  }

  async listModels(): Promise<GatewayModelsResponse> {
    return this.fetchWithRetry<GatewayModelsResponse>('/api/models');
  }

  async pullModel(
    model: string,
    onProgress?: (progress: {
      status: string;
      completed: number;
      total: number;
      percentage: number;
    }) => void
  ): Promise<void> {
    const url = `${this.baseUrl}/api/models/pull`;
    const requestId = this.generateRequestId();

    try {
      const controller = new AbortController();
      this.requestQueue.set(requestId, controller);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Gateway API error: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body available');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() && line.startsWith('data: ')) {
            try {
              const data = line.slice(6);
              const parsed = JSON.parse(data);

              if (parsed.type === 'progress' && onProgress) {
                onProgress({
                  status: parsed.status,
                  completed: parsed.completed,
                  total: parsed.total,
                  percentage: parsed.percentage,
                });
              } else if (parsed.type === 'completed') {
                break;
              } else if (parsed.type === 'error') {
                throw new Error(parsed.error || 'Unknown error');
              }
            } catch (e) {
              console.error('Failed to parse SSE data:', e);
            }
          }
        }
      }

      this.requestQueue.delete(requestId);
    } catch (error) {
      this.requestQueue.delete(requestId);
      throw error;
    }
  }

  async switchModel(model: string): Promise<GatewayChatResponse> {
    return this.fetchWithRetry<GatewayChatResponse>('/api/models/switch', {
      method: 'POST',
      body: JSON.stringify({ model }),
    });
  }

  async deleteModel(model: string): Promise<GatewayChatResponse> {
    return this.fetchWithRetry<GatewayChatResponse>(`/api/models/${model}`, {
      method: 'DELETE',
    });
  }

  async getMetrics(): Promise<GatewayMetricsResponse> {
    return this.fetchWithRetry<GatewayMetricsResponse>('/api/metrics');
  }

  cancelRequest(requestId: string): boolean {
    const controller = this.requestQueue.get(requestId);
    if (controller) {
      controller.abort();
      this.requestQueue.delete(requestId);
      return true;
    }
    return false;
  }

  cleanup(): void {
    for (const [requestId, controller] of Array.from(this.requestQueue.entries())) {
      controller.abort();
    }
    this.requestQueue.clear();
  }
}

export const createLocalAIGatewayClient = (
  config?: LocalAIGatewayConfig
): LocalAIGatewayClient => {
  return new LocalAIGatewayClient(config);
};

export default LocalAIGatewayClient;
