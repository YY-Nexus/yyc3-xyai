/**
 * @file 学习引擎类型定义
 * @description 定义学习引擎相关的类型接口
 * @module types/learning
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

/**
 * 学习模型
 */
export interface LearningModel {
  id: string;
  name: string;
  type: 'supervised' | 'unsupervised' | 'reinforcement' | 'meta';
  version: string;
  description?: string;
  parameters: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 学习会话
 */
export interface LearningSession {
  id: string;
  userId: string;
  modelId: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'failed';
  progress: number;
  metadata?: Record<string, unknown>;
}

/**
 * 学习结果
 */
export interface LearningResult {
  sessionId: string;
  modelId: string;
  accuracy: number;
  loss: number;
  metrics: Record<string, number>;
  predictions: unknown[];
  timestamp: Date;
}

/**
 * 元学习配置
 */
export interface MetaLearningConfig {
  baseModel: LearningModel;
  adaptationRate: number;
  regularization: number;
  maxIterations: number;
  convergenceThreshold: number;
}

/**
 * 学习任务
 */
export interface LearningTask {
  id: string;
  type: 'training' | 'inference' | 'adaptation' | 'evaluation';
  status: 'pending' | 'running' | 'completed' | 'failed';
  modelId: string;
  data: unknown[];
  config: MetaLearningConfig;
  createdAt: Date;
  completedAt?: Date;
}

/**
 * 学习事件
 */
export interface LearningEvent {
  eventId: string;
  sessionId: string;
  type: 'start' | 'progress' | 'complete' | 'error';
  timestamp: Date;
  data: Record<string, unknown>;
}

/**
 * 学习指标
 */
export interface LearningMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  loss: number;
  trainingTime: number;
  inferenceTime: number;
}

/**
 * 学习历史
 */
export interface LearningHistory {
  modelId: string;
  sessions: LearningSession[];
  results: LearningResult[];
  metrics: LearningMetrics;
  lastUpdated: Date;
}
