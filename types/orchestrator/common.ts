/**
 * @file 编排器类型定义
 * @description 定义编排器相关的类型接口
 * @module types/orchestrator
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

/**
 * 服务定义
 */
export interface ServiceDefinition {
  id: string;
  name: string;
  version: string;
  host: string;
  port: number;
  protocol: 'http' | 'https' | 'grpc' | 'ws' | 'wss';
  basePath: string;
  healthCheckPath: string;
  authentication: boolean;
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  circuitBreaker: boolean;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 服务状态
 */
export type ServiceStatus = 'healthy' | 'degraded' | 'unhealthy' | 'unknown';

/**
 * 服务实例
 */
export interface ServiceInstance {
  serviceId: string;
  instanceId: string;
  host: string;
  port: number;
  status: ServiceStatus;
  lastHealthCheck: Date;
  metadata?: Record<string, unknown>;
}

/**
 * 网关配置
 */
export interface GatewayConfig {
  services: ServiceDefinition[];
  routes: Route[];
  authentication?: AuthenticationConfig;
  rateLimiting?: RateLimitConfig;
  circuitBreaker?: CircuitBreakerConfig;
  logging?: LoggingConfig;
  metadata?: Record<string, unknown>;
}

/**
 * 认证配置
 */
export interface AuthenticationConfig {
  enabled: boolean;
  type: 'jwt' | 'oauth' | 'basic' | 'api-key';
  secret?: string;
  issuer?: string;
  audience?: string;
  [key: string]: any;
}

/**
 * 速率限制配置
 */
export interface RateLimitConfig {
  enabled: boolean;
  windowMs: number;
  maxRequests: number;
  skipFailedRequests?: boolean;
  skipSuccessfulRequests?: boolean;
}

/**
 * 熔断器配置
 */
export interface CircuitBreakerConfig {
  enabled: boolean;
  threshold: number;
  timeout: number;
  resetTimeout: number;
}

/**
 * 日志配置
 */
export interface LoggingConfig {
  enabled: boolean;
  level: 'error' | 'warn' | 'info' | 'debug';
  format: 'json' | 'text';
}

/**
 * 路由
 */
export interface Route {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  serviceId: string;
  targetPath: string;
  timeout?: number;
  retryPolicy?: RetryPolicy;
  metadata?: Record<string, unknown>;
}

/**
 * 重试策略
 */
export interface RetryPolicy {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier?: number;
  retryableStatusCodes?: number[];
}

/**
 * 编排任务
 */
export interface OrchestrationTask {
  id: string;
  name: string;
  type: 'sequential' | 'parallel' | 'conditional';
  steps: OrchestrationStep[];
  input?: Record<string, unknown>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: Record<string, unknown>;
  createdAt: Date;
  completedAt?: Date;
}

/**
 * 编排步骤
 */
export interface OrchestrationStep {
  id: string;
  name: string;
  serviceId: string;
  method: string;
  path: string;
  input?: Record<string, unknown>;
  output?: unknown;
  status: 'pending' | 'running' | 'completed' | 'failed';
  error?: string;
  startTime?: Date;
  endTime?: Date;
  dependencies?: string[];
  retryPolicy?: RetryPolicy;
  timeout?: number;
}

/**
 * 编排结果
 */
export interface OrchestrationResult {
  taskId: string;
  status: 'completed' | 'failed';
  steps: OrchestrationStep[];
  output?: Record<string, unknown>;
  error?: string;
  startTime: Date;
  endTime: Date;
  duration: number;
}

/**
 * 服务健康检查
 */
export interface ServiceHealthCheck {
  serviceId: string;
  status: ServiceStatus;
  timestamp: Date;
  responseTime: number;
  error?: string;
}
