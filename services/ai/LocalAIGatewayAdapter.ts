/**
 * @file LocalAIGatewayAdapter.ts
 * @description YYC³ AI小语智能成长守护系统 - 本地AI网关适配器，将LocalAIGatewayClient适配到AIServiceAdapter接口
 * @module services/ai
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-19
 * @updated 2026-01-19
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import LocalAIGatewayClient, {
  type LocalAIGatewayConfig,
  type GatewayChatRequest,
  type GatewayChatResponse,
  type GatewayModelsResponse,
  type GatewayHealthResponse,
  type GatewayMetricsResponse,
} from './LocalAIGatewayClient';
import type {
  ChatMessage,
  ChatOptions,
  ChatResponse,
  ModelInfo,
  HealthStatus,
  ServiceMetrics,
  AIServiceAdapter,
} from './AIServiceAdapter';

export class LocalAIGatewayAdapter implements AIServiceAdapter {
  private client: LocalAIGatewayClient;
  private currentModel: string;

  constructor(config?: LocalAIGatewayConfig) {
    this.client = new LocalAIGatewayClient(config);
    this.currentModel = '';
  }

  getType(): string {
    return 'local-gateway';
  }

  async chat(
    messages: ChatMessage[],
    options?: ChatOptions
  ): Promise<ChatResponse> {
    const request: GatewayChatRequest = {
      messages,
      options: {
        model: options?.model || this.currentModel,
        temperature: options?.temperature,
        max_tokens: options?.max_tokens,
        top_p: options?.top_p,
        stream: options?.stream,
      },
      use_rag: false,
    };

    const response: GatewayChatResponse = await this.client.chat(request);

    if (!response.success || !response.data) {
      throw new Error(
        response.error || response.code || 'Chat request failed'
      );
    }

    return {
      message: {
        role: 'assistant',
        content: response.data.answer,
        timestamp: Date.now(),
      },
      usage: {
        prompt_tokens: response.data.usage.prompt_tokens,
        completion_tokens: response.data.usage.completion_tokens,
        total_tokens: response.data.usage.total_tokens,
      },
      model: response.data.model,
      created_at: response.timestamp,
      done: true,
      thinking_time: response.data.thinking_time,
    };
  }

  async listModels(): Promise<ModelInfo[]> {
    const response: GatewayModelsResponse = await this.client.listModels();

    if (!response.success || !response.data) {
      throw new Error(
        response.error || response.code || 'Failed to list models'
      );
    }

    this.currentModel = response.data.current_model;
    return response.data.models;
  }

  async switchModel(modelName: string): Promise<void> {
    const response: GatewayChatResponse = await this.client.switchModel(modelName);

    if (!response.success) {
      throw new Error(
        response.error || response.code || 'Failed to switch model'
      );
    }

    this.currentModel = modelName;
  }

  getCurrentModel(): string {
    return this.currentModel;
  }

  async healthCheck(): Promise<HealthStatus> {
    const response: GatewayHealthResponse = await this.client.healthCheck();

    if (response.status === 'unhealthy') {
      return {
        status: 'unhealthy',
        models_loaded: [],
        gpu_available: false,
        memory_usage: { used: 0, total: 0, percentage: 0 },
        response_time: { avg: 0, p95: 0, p99: 0 },
      };
    }

    const ollamaHealth = response.services.ollama;

    return {
      status: ollamaHealth.status,
      models_loaded: ollamaHealth.models_loaded,
      gpu_available: ollamaHealth.gpu_available,
      memory_usage: ollamaHealth.memory_usage,
      response_time: ollamaHealth.response_time,
    };
  }

  async getMetrics(): Promise<ServiceMetrics> {
    const response: GatewayMetricsResponse = await this.client.getMetrics();

    if (!response.success || !response.data) {
      throw new Error(
        response.error || response.code || 'Failed to get metrics'
      );
    }

    return {
      total_requests: response.data.ollama.total_requests,
      successful_requests: response.data.ollama.successful_requests,
      failed_requests: response.data.ollama.failed_requests,
      avg_response_time: response.data.ollama.avg_response_time,
      requests_per_minute: response.data.ollama.requests_per_minute,
      gpu_utilization: response.data.ollama.gpu_utilization,
      memory_usage: response.data.ollama.memory_usage,
      model_load_time: response.data.ollama.model_load_time,
    };
  }

  cancelRequest(requestId: string): boolean {
    return this.client.cancelRequest(requestId);
  }

  cleanup(): void {
    this.client.cleanup();
  }
}

export const createLocalAIGatewayAdapter = (
  config?: LocalAIGatewayConfig
): LocalAIGatewayAdapter => {
  return new LocalAIGatewayAdapter(config);
};

export default LocalAIGatewayAdapter;
