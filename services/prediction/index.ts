/**
 * @file YYC³ 智能预测系统 - 预测服务主入口
 * @description 提供统一的预测服务接口和智能预测功能
 * @module services/prediction
 * @author YYC³
 * @version 1.0.0
 * @created 2024-12-14
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { EnsembleEngine } from '../../lib/prediction/adaptive-ensemble';
import {
  TimeSeriesEngine,
  AnomalyDetectionEngine,
  CausalInferenceEngine,
} from '../../lib/prediction/specialized-engines';
import { DynamicModelSelector } from './model-selector';
import { PredictionQualityMonitor } from './quality-monitor';
import type {
  PredictionData,
  PredictionConfig,
  PredictionTask,
  PredictionResult,
  PredictionInsights,
  StreamingPrediction,
  DataStream,
  QualityMetrics,
  BiasReport,
  CalibrationResult,
  ModelSelection,
  TaskInfo,
  Predictor,
  ModelPerformanceMetrics,
  DriftAlert,
  Recommendation,
  RiskAssessment,
  KeyInsight,
  PredictorConfig,
} from '../../types/prediction/common';

/**
 * 智能预测服务主类
 */
export class IntelligentPredictionService {
  private ensembleEngine: EnsembleEngine;
  private modelSelector: DynamicModelSelector;
  private qualityMonitor: PredictionQualityMonitor;
  private activePredictors: Map<string, TaskInfo> = new Map();
  private realtimePredictors: Map<string, TimeSeriesEngine> = new Map();
  private predictionHistory: PredictionResult[] = [];

  constructor() {
    this.ensembleEngine = new EnsembleEngine({
      modelType: 'ensemble' as const,
      name: 'adaptive_ensemble',
      algorithm: 'adaptive_ensemble',
      parameters: {
        method: 'weighted' as const,
        adaptationThreshold: 0.1,
        maxPredictors: 10,
      },
    });

    this.modelSelector = new DynamicModelSelector();
    this.qualityMonitor = new PredictionQualityMonitor();
  }

  /**
   * 创建智能预测任务
   */
  async createPredictionTask(
    config: PredictionConfig,
    data: PredictionData
  ): Promise<PredictionTask> {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    // 自动确定任务类型
    const taskType = this.inferTaskType(data);

    // 智能选择最佳模型组合
    const modelSelection = await this.modelSelector.selectOptimalModel(
      data,
      {
        id: taskId,
        name: config.name || `智能预测任务_${taskId}`,
        type: taskType,
        description: '',
        priority: 'medium' as const,
        constraints: config.constraints || {},
        requirements: config.requirements || {},
      },
      config.constraints || {}
    );

    // 创建集成预测器
    const ensemble = await this.buildOptimalEnsemble(modelSelection, config);

    // 初始化预测器
    await this.initializePredictors(ensemble, data);

    const task: PredictionTask = {
      id: taskId,
      name: config.name || `智能预测任务_${taskId}`,
      type: taskType,
      description: `基于${modelSelection.selectedModel || '未知模型'}的智能预测`,
      priority: config.priority || ('medium' as const),
      constraints: config.constraints || {},
      requirements: config.requirements || {},
    };

    // 保存任务信息
    this.activePredictors.set(taskId, {
      taskId,
      modelId: taskId,
      ensemble: ensemble as any,
      config: config as unknown as Record<string, unknown>,
      data,
      modelSelection,
      createdAt: Date.now(),
    });

    return task;
  }

  /**
   * 执行预测
   */
  async executePrediction(
    taskId: string,
    data?: PredictionData,
    horizon?: number
  ): Promise<PredictionResult> {
    const taskInfo = this.activePredictors.get(taskId);
    if (!taskInfo) {
      throw new Error(`预测任务 ${taskId} 不存在`);
    }

    const { ensemble } = taskInfo;
    const predictionData = data || taskInfo.data;

    // 执行预测
    const result = await ensemble.predict(predictionData, horizon);

    // 保存预测历史
    this.predictionHistory.push(result);

    // 质量监控
    await this.qualityMonitor.recordPrediction(result);

    return result;
  }

  /**
   * 实时流式预测
   */
  async executeRealTimePrediction(
    stream: DataStream,
    modelId?: string
  ): Promise<StreamingPrediction> {
    const startTime = Date.now();

    let predictor: TimeSeriesEngine | null = null;
    let predictorId: string = modelId || `realtime_${Date.now()}`;

    if (modelId) {
      predictor = this.realtimePredictors.get(modelId) || null;
    }

    if (!predictor) {
      const timeSeriesConfig = {
        modelType: 'timeseries' as const,
        name: 'realtime_timeseries',
        algorithm: 'exponential_smoothing',
        parameters: {
          alpha: 0.3,
          beta: 0.1,
          windowSize: Math.min(50, stream.data.length),
        },
      };

      predictor = new TimeSeriesEngine(timeSeriesConfig);
      await predictor.train({ data: stream.data, features: [] });

      predictorId = `realtime_${Date.now()}`;
      this.realtimePredictors.set(predictorId, predictor);
    }

    const prediction = await predictor.predict(
      { data: stream.data, features: [] },
      1
    );
    const processingTime = Date.now() - startTime;

    const streamingPrediction: StreamingPrediction = {
      predictionId: predictorId,
      result: prediction,
      streamId: stream.streamId,
      timestamp: new Date(),
      prediction: Array.isArray(prediction.prediction)
        ? prediction.prediction[0] || 0
        : prediction.prediction || 0,
      confidence: prediction.confidence || 0,
      processingTime,
      dataQuality: stream.qualityMetrics,
      modelVersion: '1.0.0',
    };

    return streamingPrediction;
  }

  /**
   * 生成预测洞察
   */
  async generatePredictionInsights(
    taskId: string,
    results?: PredictionResult[]
  ): Promise<PredictionInsights> {
    const taskInfo = this.activePredictors.get(taskId);
    const predictionResults = results || this.predictionHistory.slice(-10);

    if (!taskInfo) {
      throw new Error(`预测任务 ${taskId} 不存在`);
    }

    const performanceMetrics =
      await this.analyzePredictionPerformance(predictionResults);

    // 检测漂移
    const driftAlerts = await this.detectPredictionDrift(predictionResults);

    // 生成推荐
    const recommendations = await this.generateRecommendations(
      performanceMetrics,
      driftAlerts
    );

    // 风险评估
    const riskAssessment = this.assessPredictionRisk(
      performanceMetrics,
      driftAlerts
    );

    // 关键洞察点
    const keyPoints = this.extractKeyInsights(
      predictionResults,
      performanceMetrics
    );

    return {
      modelId: taskId,
      summary: this.generateInsightsSummary(
        performanceMetrics,
        driftAlerts,
        recommendations
      ),
      insights: keyPoints,
      keyPoints,
      performanceMetrics,
      driftAlerts,
      recommendations,
      riskAssessment,
      confidence: this.calculateOverallConfidence(
        performanceMetrics,
        driftAlerts
      ),
      timestamp: new Date(),
    };
  }

  /**
   * 监控预测质量
   */
  async monitorPredictionQuality(
    results: PredictionResult[]
  ): Promise<QualityMetrics> {
    return this.qualityMonitor.monitorPredictionAccuracy(
      results,
      results.map(r => {
        const prediction = Array.isArray(r.prediction)
          ? r.prediction[0]
          : r.prediction;
        return prediction || 0;
      })
    );
  }

  /**
   * 检测预测偏见
   */
  async detectPredictionBias(
    results: PredictionResult[],
    sensitiveAttributes: Record<string, unknown>
  ): Promise<BiasReport> {
    return this.qualityMonitor.detectPredictionBias(
      results,
      sensitiveAttributes
    );
  }

  /**
   * 校准预测不确定性
   */
  async calibratePredictionUncertainty(
    results: PredictionResult[]
  ): Promise<CalibrationResult> {
    return this.qualityMonitor.calibratePredictionUncertainty(results);
  }

  /**
   * 更新模型
   */
  async updateModel(taskId: string, newData: PredictionData): Promise<void> {
    const taskInfo = this.activePredictors.get(taskId);
    if (!taskInfo) {
      throw new Error(`预测任务 ${taskId} 不存在`);
    }

    const { ensemble } = taskInfo;

    // 检测概念漂移
    const driftDetection = await ensemble.detectConceptDrift?.(newData);

    if (driftDetection) {
      console.log(`检测到概念漂移, 重新训练模型`);
    }

    // 重新训练模型
    await ensemble.train(newData);

    // 更新任务信息
    taskInfo.data = newData;
    taskInfo.lastUpdated = Date.now();
  }

  /**
   * 获取任务状态
   */
  getTaskStatus(taskId: string): {
    taskId: string;
    modelInfo: { modelId: string };
    config: Record<string, unknown>;
    createdAt: number;
    lastUpdated: number | undefined;
    predictionCount: number;
  } | null {
    const taskInfo = this.activePredictors.get(taskId);
    if (!taskInfo) {
      return null;
    }

    return {
      taskId,
      modelInfo: { modelId: taskId },
      config: taskInfo.config,
      createdAt: taskInfo.createdAt,
      lastUpdated: taskInfo.lastUpdated,
      predictionCount: this.predictionHistory.filter(r =>
        r.modelId?.includes?.(taskId)
      ).length,
    };
  }

  /**
   * 列出所有活动任务
   */
  listActiveTasks(): string[] {
    return Array.from(this.activePredictors.keys());
  }

  /**
   * 删除任务
   */
  async deleteTask(taskId: string): Promise<void> {
    this.activePredictors.delete(taskId);
    // 清理相关的预测历史
    this.predictionHistory = this.predictionHistory.filter(
      r => !r.modelId.includes(taskId)
    );
  }

  // 私有辅助方法

  private inferTaskType(
    data: PredictionData
  ): 'regression' | 'classification' | 'forecasting' | 'anomaly_detection' {
    if (data.dataType === 'timeseries') {
      return 'forecasting';
    }

    const values = (data.data || []).slice(0, 10).map((p: any) => p.value);
    const uniqueValues = new Set(values);

    if (uniqueValues.size <= 10 && values.length > 20) {
      return 'classification';
    }

    return 'regression';
  }

  private async buildOptimalEnsemble(
    modelSelection: ModelSelection,
    config: PredictionConfig
  ): Promise<EnsembleEngine> {
    const ensemble = new EnsembleEngine({
      modelType: 'ensemble' as const,
      name: 'optimal_ensemble',
      algorithm: 'adaptive_ensemble',
      parameters: {
        method: 'weighted' as const,
        adaptationThreshold: 0.1,
        maxPredictors: 5,
      },
    });

    // 根据选择的模型创建基础预测器
    const algorithms = [
      modelSelection.selectedModel,
      ...(modelSelection.alternativeModels || []),
    ];
    for (let i = 0; i < algorithms.length; i++) {
      const algorithm = algorithms[i];
      if (typeof algorithm === 'string') {
        try {
          const predictor = this.createPredictor(algorithm, config);
          ensemble.addPredictor(predictor as any);
        } catch (error) {
          console.warn(`创建预测器失败: ${algorithm}`, error);
        }
      }
    }

    return ensemble;
  }

  private async initializePredictors(
    ensemble: EnsembleEngine,
    data: PredictionData
  ): Promise<void> {
    await ensemble.train(data);
  }

  private createPredictor(algorithm: string, config: PredictionConfig): any {
    const baseConfig = {
      modelType: 'timeseries' as const,
      name: algorithm,
      algorithm,
      parameters: config.parameters || {},
    };

    switch (algorithm) {
      case 'time_series_exponential_smoothing':
        return new TimeSeriesEngine(baseConfig);
      case 'statistical_anomaly_detection':
        return new AnomalyDetectionEngine(baseConfig);
      case 'causal_inference':
        return new CausalInferenceEngine(baseConfig);
      default:
        return new TimeSeriesEngine(baseConfig);
    }
  }

  private async analyzePredictionPerformance(
    results: PredictionResult[]
  ): Promise<ModelPerformanceMetrics> {
    if (results.length === 0) {
      return {
        modelId: 'unknown',
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1Score: 0,
        latency: 0,
        throughput: 0,
        timestamp: new Date(),
        confidence: 0,
      };
    }

    const avgConfidence =
      results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
    const avgLatency = 0;
    const stability = this.calculateStability(results);

    return {
      modelId: 'ensemble',
      accuracy: avgConfidence,
      precision: avgConfidence,
      recall: avgConfidence,
      f1Score: avgConfidence,
      latency: avgLatency,
      throughput: results.length,
      timestamp: new Date(),
      confidence: avgConfidence,
    };
  }

  private async detectPredictionDrift(
    results: PredictionResult[]
  ): Promise<DriftAlert[]> {
    if (results.length < 10) return [];

    const alerts: DriftAlert[] = [];
    const recentResults = results.slice(-10);
    const olderResults = results.slice(-20, -10);

    if (olderResults.length > 0) {
      const recentAvgConfidence =
        recentResults.reduce((sum, r) => sum + (r.confidence || 0), 0) /
        recentResults.length;
      const olderAvgConfidence =
        olderResults.reduce((sum, r) => sum + (r.confidence || 0), 0) /
        olderResults.length;

      if (recentAvgConfidence < olderAvgConfidence * 0.8) {
        alerts.push({
          modelId: 'ensemble',
          alertType: 'performance_degradation' as const,
          message: '预测置信度下降',
          severity: 'medium' as const,
          timestamp: Date.now(),
        });
      }
    }

    return alerts;
  }

  private async generateRecommendations(
    metrics: ModelPerformanceMetrics,
    alerts: DriftAlert[]
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    if ((metrics.confidence || 0) < 0.7) {
      recommendations.push({
        type: 'model_update' as const,
        priority: 'high' as const,
        description: '模型置信度较低，建议重新训练',
        expectedImpact: 0.2,
      });
    }

    if (alerts.length > 0) {
      recommendations.push({
        type: 'data_refresh' as const,
        priority: 'medium' as const,
        description: '检测到数据漂移，建议更新训练数据',
        expectedImpact: 0.15,
      });
    }

    return recommendations;
  }

  private assessPredictionRisk(
    metrics: ModelPerformanceMetrics,
    alerts: DriftAlert[]
  ): RiskAssessment {
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    if ((metrics.confidence || 0) < 0.6) {
      riskLevel = 'high';
    }

    if (alerts.length > 2) {
      riskLevel = 'medium';
    }

    return {
      modelId: 'ensemble',
      riskLevel,
      riskFactors: [],
      mitigationStrategies: [],
      timestamp: new Date(),
    };
  }

  private extractKeyInsights(
    results: PredictionResult[],
    _metrics: ModelPerformanceMetrics
  ): KeyInsight[] {
    const insights: KeyInsight[] = [];

    if (results.length > 0) {
      const latestResult = results[results.length - 1];

      if (latestResult && (latestResult.confidence || 0) > 0.9) {
        insights.push({
          type: 'opportunity' as const,
          description: '最新预测具有高置信度，可以作为重要决策依据',
          severity: 'low' as const,
          confidence: latestResult.confidence || 0,
          importance: 1.0,
          timestamp: new Date(),
        });
      }

      if (latestResult && (latestResult.confidence || 0) < 0.5) {
        insights.push({
          type: 'risk' as const,
          description: '最新预测置信度较低，建议谨慎使用',
          severity: 'medium' as const,
          confidence: 1 - (latestResult.confidence || 0),
          importance: 0.7,
          timestamp: new Date(),
        });
      }
    }

    return insights;
  }

  private generateInsightsSummary(
    metrics: ModelPerformanceMetrics,
    alerts: DriftAlert[],
    recommendations: Recommendation[]
  ): string {
    const summary = [];

    if ((metrics.confidence || 0) > 0.8) {
      summary.push('预测性能良好');
    } else if ((metrics.confidence || 0) < 0.6) {
      summary.push('预测性能需要改进');
    }

    if (alerts.length > 0) {
      summary.push(`检测到${alerts.length}个性能问题`);
    }

    if (recommendations.length > 0) {
      summary.push(`有${recommendations.length}个改进建议`);
    }

    return summary.join('，') + '。';
  }

  private calculateOverallConfidence(
    metrics: ModelPerformanceMetrics,
    alerts: DriftAlert[]
  ): number {
    let confidence = metrics.confidence || 0;

    // 根据警报调整置信度
    if (alerts.length > 0) {
      const penalty = alerts.reduce((sum, alert) => {
        return (
          sum +
          (alert.severity === 'high'
            ? 0.2
            : alert.severity === 'medium'
              ? 0.1
              : 0.05)
        );
      }, 0);
      confidence = Math.max(0, confidence - penalty);
    }

    return confidence;
  }

  private calculateStability(results: PredictionResult[]): number {
    if (results.length < 2) return 1;

    const confidences = results.map(r => r.confidence || 0);
    const mean = confidences.reduce((a, b) => a + b, 0) / confidences.length;
    const variance =
      confidences.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) /
      confidences.length;

    // 稳定性 = 1 - 变异系数
    const cv = Math.sqrt(variance) / mean;
    return Math.max(0, 1 - cv);
  }
}
