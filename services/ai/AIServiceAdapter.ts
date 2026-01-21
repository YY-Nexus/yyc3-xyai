/**
 * @file AIServiceAdapter.ts
 * @description YYC³ AI小语智能成长守护系统 - AI服务适配器，提供统一的AI服务接口，支持多种AI服务（Ollama、OpenAI、Claude等）
 * @module services/ai
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-19
 * @updated 2026-01-19
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import ollamaService, {
  ChatMessage as OllamaChatMessage,
  ChatOptions as OllamaChatOptions,
  ChatResponse as OllamaChatResponse,
  ModelInfo as OllamaModelInfo,
  HealthStatus as OllamaHealthStatus,
} from './OllamaService';
import { LocalAIGatewayAdapter, createLocalAIGatewayAdapter } from './LocalAIGatewayAdapter';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

export interface ChatOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
}

export interface ChatResponse {
  message: ChatMessage;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
  created_at: string;
  done: boolean;
  thinking_time?: number;
}

export interface ModelInfo {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    parent_model: string;
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

export interface HealthStatus {
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
}

export interface ServiceMetrics {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  avg_response_time: number;
  requests_per_minute: number;
  gpu_utilization: number;
  memory_usage: number;
  model_load_time: number;
}

export interface AIServiceConfig {
  type: 'ollama' | 'openai' | 'claude' | 'anthropic' | 'local-gateway';
  baseUrl?: string;
  apiKey?: string;
  defaultModel?: string;
}

export interface AIServiceAdapter {
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse>;
  listModels(): Promise<ModelInfo[]>;
  switchModel(modelName: string): Promise<void>;
  getCurrentModel(): string;
  healthCheck(): Promise<HealthStatus>;
  getMetrics(): Promise<ServiceMetrics>;
  cancelRequest(requestId: string): boolean;
  cleanup(): void;
  getType(): string;
}

export class OllamaServiceAdapter implements AIServiceAdapter {
  private ollamaService: typeof ollamaService;

  constructor() {
    this.ollamaService = ollamaService;
  }

  getType(): string {
    return 'ollama';
  }

  async chat(
    messages: ChatMessage[],
    options?: ChatOptions
  ): Promise<ChatResponse> {
    const ollamaMessages: OllamaChatMessage[] = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
    }));

    const ollamaOptions: OllamaChatOptions = {
      model: options?.model,
      temperature: options?.temperature,
      max_tokens: options?.max_tokens,
      top_p: options?.top_p,
      stream: options?.stream,
    };

    return await this.ollamaService.chat(ollamaMessages, ollamaOptions);
  }

  async listModels(): Promise<ModelInfo[]> {
    return await this.ollamaService.listModels();
  }

  async switchModel(modelName: string): Promise<void> {
    await this.ollamaService.switchModel(modelName);
  }

  getCurrentModel(): string {
    return this.ollamaService.getCurrentModel();
  }

  async healthCheck(): Promise<HealthStatus> {
    return await this.ollamaService.healthCheck();
  }

  async getMetrics(): Promise<ServiceMetrics> {
    const metrics = await this.ollamaService.getMetrics();
    return {
      total_requests: metrics.total_requests,
      successful_requests: metrics.successful_requests,
      failed_requests: metrics.failed_requests,
      avg_response_time: metrics.avg_response_time,
      requests_per_minute: metrics.requests_per_minute,
      gpu_utilization: metrics.gpu_utilization,
      memory_usage: metrics.memory_usage,
      model_load_time: metrics.model_load_time,
    };
  }

  cancelRequest(requestId: string): boolean {
    return this.ollamaService.cancelRequest(requestId);
  }

  cleanup(): void {
    this.ollamaService.cleanup();
  }
}

export class OpenAIServiceAdapter implements AIServiceAdapter {
  private apiKey: string;
  private baseUrl: string;
  private currentModel: string;

  constructor(config: { apiKey: string; baseUrl?: string; defaultModel?: string }) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.openai.com/v1';
    this.currentModel = config.defaultModel || 'gpt-4';
  }

  getType(): string {
    return 'openai';
  }

  async chat(
    messages: ChatMessage[],
    options?: ChatOptions
  ): Promise<ChatResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options?.model || this.currentModel,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.max_tokens ?? 2048,
        top_p: options?.top_p ?? 0.9,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `OpenAI API error: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    return {
      message: {
        role: 'assistant',
        content: result.choices[0].message.content,
        timestamp: Date.now(),
      },
      usage: {
        prompt_tokens: result.usage.prompt_tokens,
        completion_tokens: result.usage.completion_tokens,
        total_tokens: result.usage.total_tokens,
      },
      model: result.model,
      created_at: new Date(result.created * 1000).toISOString(),
      done: true,
    };
  }

  async listModels(): Promise<ModelInfo[]> {
    const response = await fetch(`${this.baseUrl}/models`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `OpenAI API error: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    return result.data.map((model: any) => ({
      name: model.id,
      model: model.id,
      modified_at: new Date().toISOString(),
      size: 0,
      digest: '',
      details: {
        parent_model: '',
        format: '',
        family: '',
        families: [],
        parameter_size: '',
        quantization_level: '',
      },
    }));
  }

  async switchModel(modelName: string): Promise<void> {
    this.currentModel = modelName;
  }

  getCurrentModel(): string {
    return this.currentModel;
  }

  async healthCheck(): Promise<HealthStatus> {
    try {
      const startTime = Date.now();
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        signal: AbortSignal.timeout(5000),
      });

      const checkTime = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.statusText}`);
      }

      return {
        status: checkTime < 2000 ? 'healthy' : 'degraded',
        models_loaded: [],
        gpu_available: true,
        memory_usage: { used: 0, total: 0, percentage: 0 },
        response_time: {
          avg: checkTime,
          p95: checkTime * 1.5,
          p99: checkTime * 2,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        models_loaded: [],
        gpu_available: false,
        memory_usage: { used: 0, total: 0, percentage: 0 },
        response_time: { avg: 0, p95: 0, p99: 0 },
      };
    }
  }

  async getMetrics(): Promise<ServiceMetrics> {
    return {
      total_requests: 0,
      successful_requests: 0,
      failed_requests: 0,
      avg_response_time: 0,
      requests_per_minute: 0,
      gpu_utilization: 0,
      memory_usage: 0,
      model_load_time: 0,
    };
  }

  cancelRequest(_requestId: string): boolean {
    return false;
  }

  cleanup(): void {
  }
}

export class AIServiceManager {
  private currentAdapter: AIServiceAdapter;
  private adapters: Map<string, AIServiceAdapter> = new Map();

  constructor(initialAdapter: AIServiceAdapter) {
    this.currentAdapter = initialAdapter;
    this.adapters.set(initialAdapter.getType(), initialAdapter);
  }

  registerAdapter(adapter: AIServiceAdapter): void {
    this.adapters.set(adapter.getType(), adapter);
  }

  switchAdapter(type: string): boolean {
    const adapter = this.adapters.get(type);
    if (adapter) {
      this.currentAdapter = adapter;
      return true;
    }
    return false;
  }

  getAdapter(): AIServiceAdapter {
    return this.currentAdapter;
  }

  getCurrentAdapterType(): string {
    return this.currentAdapter.getType();
  }

  getAvailableAdapters(): string[] {
    return Array.from(this.adapters.keys());
  }

  async healthCheckAll(): Promise<Map<string, HealthStatus>> {
    const results = new Map<string, HealthStatus>();

    for (const [type, adapter] of Array.from(this.adapters.entries())) {
      try {
        const health = await adapter.healthCheck();
        results.set(type, health);
      } catch (error) {
        console.error(`Health check failed for ${type}:`, error);
        results.set(type, {
          status: 'unhealthy',
          models_loaded: [],
          gpu_available: false,
          memory_usage: { used: 0, total: 0, percentage: 0 },
          response_time: { avg: 0, p95: 0, p99: 0 },
        });
      }
    }

    return results;
  }

  cleanup(): void {
    for (const adapter of Array.from(this.adapters.values())) {
      adapter.cleanup();
    }
    this.adapters.clear();
  }
}

export const createAIServiceAdapter = (
  config: AIServiceConfig
): AIServiceAdapter => {
  switch (config.type) {
    case 'ollama':
      return new OllamaServiceAdapter();
    case 'local-gateway':
      return createLocalAIGatewayAdapter({
        baseUrl: config.baseUrl,
      });
    case 'openai':
      if (!config.apiKey) {
        throw new Error('OpenAI API key is required');
      }
      return new OpenAIServiceAdapter({
        apiKey: config.apiKey,
        baseUrl: config.baseUrl,
        defaultModel: config.defaultModel,
      });
    default:
      throw new Error(`Unsupported AI service type: ${config.type}`);
  }
};

export const createAIServiceManager = (
  configs: AIServiceConfig[]
): AIServiceManager => {
  const adapters = configs.map(config => createAIServiceAdapter(config));
  const manager = new AIServiceManager(adapters[0]);

  for (let i = 1; i < adapters.length; i++) {
    manager.registerAdapter(adapters[i]);
  }

  return manager;
};

export default AIServiceManager;
