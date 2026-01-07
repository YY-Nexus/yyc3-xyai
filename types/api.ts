/**
 * @file API类型定义
 * @description 项目中所有API接口的请求和响应类型定义
 * @module types/api
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-30
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import type { NextRequest } from 'next/server';
import type { Child, GrowthRecord, AIConversation } from './database';
import type { ApiResponse } from './common';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestContext {
  request: NextRequest;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterQuery {
  [key: string]: string | number | boolean | string[] | number[];
}

export interface SearchQuery {
  q?: string;
  fields?: string[];
}

export type ApiQueryParams = PaginationQuery & FilterQuery & SearchQuery;

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    stack?: string;
  };
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}

export type ApiStandardResponse<T = unknown> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse;

export interface StreamChunk {
  content?: string;
  role?: string;
  complexity?: number;
  done?: boolean;
}

export interface StreamOptions {
  chunkDelay?: number;
  onChunk?: (chunk: StreamChunk) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

export interface RequestValidationResult {
  valid: boolean;
  errors: Array<{
    field: string;
    message: string;
  }>;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

export interface ApiRequestMetadata {
  requestId: string;
  timestamp: number;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  ipAddress?: string;
  rateLimit?: RateLimitInfo;
}

export interface ApiMiddlewareContext {
  metadata: ApiRequestMetadata;
  user?: {
    id: string;
    role: string;
  };
}

export type ApiMiddleware = (
  request: NextRequest,
  context: ApiMiddlewareContext
) => Promise<NextRequest | Response>;

export interface ApiRouteHandler<T = unknown> {
  GET?: (
    request: NextRequest,
    context: ApiMiddlewareContext
  ) => Promise<Response>;
  POST?: (
    request: NextRequest,
    context: ApiMiddlewareContext
  ) => Promise<Response>;
  PUT?: (
    request: NextRequest,
    context: ApiMiddlewareContext
  ) => Promise<Response>;
  PATCH?: (
    request: NextRequest,
    context: ApiMiddlewareContext
  ) => Promise<Response>;
  DELETE?: (
    request: NextRequest,
    context: ApiMiddlewareContext
  ) => Promise<Response>;
}

export interface ChildrenApi {
  GET: {
    query: PaginationQuery;
    response: ApiSuccessResponse<Child[]>;
  };
  POST: {
    body: {
      name: string;
      nickname?: string;
      gender: 'male' | 'female';
      birth_date: string;
      avatar_url?: string;
      current_stage?: string;
    };
    response: ApiSuccessResponse<Child>;
  };
}

export interface ChildDetailApi {
  GET: {
    params: { id: string };
    response: ApiSuccessResponse<Child>;
  };
  PUT: {
    params: { id: string };
    body: Partial<ChildrenApi['POST']['body']>;
    response: ApiSuccessResponse<Child>;
  };
  DELETE: {
    params: { id: string };
    response: ApiSuccessResponse<{ deleted: boolean }>;
  };
}

export interface GrowthRecordsApi {
  GET: {
    query: PaginationQuery & {
      childId?: string;
      type?: string;
      startDate?: string;
      endDate?: string;
    };
    response: ApiSuccessResponse<GrowthRecord[]>;
  };
  POST: {
    body: {
      child_id: string;
      title: string;
      description?: string;
      category:
        | 'milestone'
        | 'daily'
        | 'achievement'
        | 'health'
        | 'education'
        | 'social';
      media_urls?: string[];
      tags?: string[];
      location?: string;
      is_public?: boolean;
    };
    response: ApiSuccessResponse<GrowthRecord>;
  };
}

export interface GrowthRecordDetailApi {
  GET: {
    params: { id: string };
    response: ApiSuccessResponse<GrowthRecord>;
  };
  PUT: {
    params: { id: string };
    body: Partial<GrowthRecordsApi['POST']['body']>;
    response: ApiSuccessResponse<GrowthRecord>;
  };
  DELETE: {
    params: { id: string };
    response: ApiSuccessResponse<{ deleted: boolean }>;
  };
}

export interface AIChatApi {
  POST: {
    body: {
      message: string;
      history?: Array<{ role: string; content: string }>;
      role?:
        | 'recorder'
        | 'guardian'
        | 'listener'
        | 'advisor'
        | 'cultural_mentor';
      complexity?: number;
      involvedRoles?: string[];
    };
    response: Response;
  };
}

export interface AIEmotionApi {
  POST: {
    body: {
      text: string;
      context?: Record<string, unknown>;
    };
    response: ApiSuccessResponse<{
      emotion: string;
      confidence: number;
      suggestions: string[];
    }>;
  };
}

export interface AIGenerateImageApi {
  POST: {
    body: {
      prompt: string;
      style?: string;
      size?: string;
    };
    response: ApiSuccessResponse<{
      imageUrl: string;
      prompt: string;
    }>;
  };
}

export interface AIAssessmentReportApi {
  POST: {
    body: {
      childId: string;
      assessmentType: string;
      data: Record<string, unknown>;
    };
    response: ApiSuccessResponse<{
      reportId: string;
      reportUrl: string;
      summary: string;
    }>;
  };
}

export interface AIAnalyzeRecordApi {
  POST: {
    body: {
      recordId: string;
      analysisType: 'emotion' | 'milestone' | 'recommendation';
    };
    response: ApiSuccessResponse<{
      analysis: Record<string, unknown>;
      insights: string[];
      recommendations: string[];
    }>;
  };
}

export interface AIOrchestrateApi {
  POST: {
    body: {
      task: string;
      context: Record<string, unknown>;
      roles?: string[];
    };
    response: ApiSuccessResponse<{
      taskId: string;
      result: Record<string, unknown>;
    }>;
  };
}

export interface AIEnhancedEmotionApi {
  POST: {
    body: {
      text: string;
      childId?: string;
      conversationHistory?: Array<{ role: string; content: string }>;
    };
    response: ApiSuccessResponse<{
      emotion: string;
      intensity: number;
      confidence: number;
      suggestions: string[];
      followUpQuestions: string[];
    }>;
  };
}

export interface AIContinueStoryApi {
  POST: {
    body: {
      storyContext: string;
      childAge: number;
      theme?: string;
      length?: 'short' | 'medium' | 'long';
    };
    response: ApiSuccessResponse<{
      continuation: string;
      suggestions: string[];
    }>;
  };
}

export interface HomeworkApi {
  GET: {
    query: PaginationQuery & {
      childId?: string;
      subject?: string;
      status?: 'pending' | 'completed' | 'overdue';
    };
    response: ApiSuccessResponse<
      Array<{
        id: string;
        child_id: string;
        subject: string;
        title: string;
        description: string;
        due_date: string;
        status: string;
        created_at: string;
      }>
    >;
  };
  POST: {
    body: {
      child_id: string;
      subject: string;
      title: string;
      description: string;
      due_date: string;
    };
    response: ApiSuccessResponse<{
      id: string;
      child_id: string;
      subject: string;
      title: string;
      description: string;
      due_date: string;
      status: 'pending';
      created_at: string;
    }>;
  };
}

export interface HomeworkDetailApi {
  GET: {
    params: { id: string };
    response: ApiSuccessResponse<{
      id: string;
      child_id: string;
      subject: string;
      title: string;
      description: string;
      due_date: string;
      status: string;
      created_at: string;
      updated_at: string;
    }>;
  };
  PUT: {
    params: { id: string };
    body: Partial<{
      subject: string;
      title: string;
      description: string;
      due_date: string;
      status: 'pending' | 'completed' | 'overdue';
    }>;
    response: ApiSuccessResponse<HomeworkDetailApi['GET']['response']['data']>;
  };
  DELETE: {
    params: { id: string };
    response: ApiSuccessResponse<{ deleted: boolean }>;
  };
}

export interface ErrorReportApi {
  POST: {
    body: {
      errorType: string;
      errorMessage: string;
      stackTrace?: string;
      userAgent?: string;
      url?: string;
      additionalInfo?: Record<string, unknown>;
    };
    response: ApiSuccessResponse<{
      reportId: string;
      message: string;
    }>;
  };
}

export interface ApiEndpoint {
  path: string;
  method: HttpMethod;
  description: string;
  authenticated: boolean;
  rateLimit?: {
    requests: number;
    window: number;
  };
}

export interface ApiDocumentation {
  version: string;
  title: string;
  description: string;
  baseUrl: string;
  endpoints: ApiEndpoint[];
  schemas: Record<string, unknown>;
}

export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
  interceptors?: {
    request?: (config: RequestInit) => RequestInit;
    response?: (response: Response) => Response;
  };
}

export interface ApiError extends Error {
  code: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

export interface ApiCacheOptions {
  enabled: boolean;
  ttl?: number;
  keyPrefix?: string;
}

export interface ApiCacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface WebSocketMessage<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
}

export interface WebSocketConnection {
  id: string;
  userId?: string;
  connectedAt: number;
  lastActivity: number;
}

export interface RealtimeEvent {
  type: 'notification' | 'message' | 'update' | 'alert';
  data: Record<string, unknown>;
  timestamp: number;
}

export interface ApiHealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: number;
  services: {
    database: boolean;
    redis: boolean;
    ai: boolean;
  };
  uptime: number;
  version: string;
}

export interface ApiMetrics {
  requestCount: number;
  errorCount: number;
  avgResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  activeConnections: number;
  timestamp: number;
}

export interface ApiLogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: number;
  requestId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}
