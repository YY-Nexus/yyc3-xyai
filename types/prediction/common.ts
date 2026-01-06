/**
 * @file 预测系统通用类型定义
 * @description 定义预测结果、质量指标、偏见报告等核心类型
 * @module types/prediction
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-29
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

/**
 * 预测结果
 */
export interface PredictionResult {
  id: string
  prediction: number | number[]
  confidence: number
  timestamp: number
  metadata?: Record<string, unknown>
}

/**
 * 质量指标
 */
export interface QualityMetrics {
  timestamp: number
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  rmse: number
  mae: number
  r2Score: number
  customMetrics?: Record<string, unknown>
}

/**
 * 偏见报告
 */
export interface BiasReport {
  overall: 'low' | 'medium' | 'high'
  metrics: {
    demographicParity: number
    disparateImpact: number
    equalOpportunity: number
  }
  recommendations: string[]
  affectedGroups: string[]
  mitigation: string[]
}

/**
 * 敏感数据
 */
export interface SensitiveData {
  groups?: Record<string, number[]>
  attributes?: Record<string, unknown[]>
  labels?: string[]
}

/**
 * 校准结果
 */
export interface CalibrationResult {
  originalMetrics: {
    avgConfidence: number
    confidenceVariance: number
    calibrationError: number
    overconfidentRatio: number
  }
  calibratedMetrics: {
    avgConfidence: number
    confidenceVariance: number
    calibrationError: number
    overconfidentRatio: number
  }
  reliabilityDiagram: Array<{
    confidence: number
    empiricalAccuracy: number
    count: number
  }>
  calibrationCurve: Array<{
    predicted: number
    actual: number
    count: number
  }>
  improvement: number
  recommendedMethod: string
}

/**
 * 预测数据点
 */
export interface PredictionDataPoint {
  timestamp: number
  value: number
  features?: Record<string, unknown>
}

/**
 * 预测数据
 */
export interface PredictionData {
  data: PredictionDataPoint[]
  dataType: 'timeseries' | 'tabular' | 'sequential'
  features?: string[]
  target?: string
}

/**
 * 预测配置
 */
export interface PredictionConfig {
  name: string
  algorithm: string
  parameters: Record<string, unknown>
  preprocessing: {
    normalize: boolean
    handleMissing: 'interpolate' | 'mean' | 'median' | 'drop'
    featureEngineering: boolean
    outlierRemoval: boolean
  }
  validation: {
    method: string
    folds: number
    testSize: number
  }
  constraints: {
    maxTrainingTime: number
    memoryLimit: number
    accuracyThreshold: number
    realTimeCapability: boolean
  }
  requirements: {
    accuracy: 'high' | 'medium' | 'low'
    speed: 'high' | 'medium' | 'low'
    interpretability: 'high' | 'medium' | 'low'
    scalability: 'high' | 'medium' | 'low'
  }
}

/**
 * 预测任务
 */
export interface PredictionTask {
  id: string
  name: string
  type: 'regression' | 'classification' | 'forecasting' | 'anomaly_detection'
  description: string
  priority: 'low' | 'medium' | 'high'
  constraints: {
    maxTrainingTime: number
    memoryLimit: number
    accuracyThreshold: number
    realTimeCapability: boolean
  }
  requirements: {
    accuracy: 'high' | 'medium' | 'low'
    speed: 'high' | 'medium' | 'low'
    interpretability: 'high' | 'medium' | 'low'
    scalability: 'high' | 'medium' | 'low'
  }
}

/**
 * 预测洞察
 */
export interface PredictionInsights {
  summary: string
  keyPoints: Array<{
    type: string
    description: string
    severity: string
    confidence?: number
    actionability?: string
  }>
  performanceMetrics: {
    accuracy: number
    confidence: number
    stability: number
    avgLatency: number
    predictionCount?: number
  }
  driftAlerts: Array<{
    type: string
    severity: string
    description: string
    timestamp: number
  }>
  recommendations: Array<{
    category: string
    priority: string
    description: string
    expectedImpact: string
    effort: string
  }>
  riskAssessment: {
    overall: 'low' | 'medium' | 'high'
    factors: Array<{
      type: string
      severity: string
      description: string
      impact: string
    }>
    mitigation: string[]
    monitoring: string[]
  }
  confidence: number
}

/**
 * 流式预测
 */
export interface StreamingPrediction {
  timestamp: number
  prediction: number
  confidence: number
  processingTime: number
  dataQuality?: Record<string, unknown>
  modelVersion: string
}

/**
 * 数据流
 */
export interface DataStream {
  data: PredictionDataPoint[]
  qualityMetrics?: Record<string, unknown>
  metadata?: Record<string, unknown>
}

/**
 * 模型选择
 */
export interface ModelSelection {
  selectedModel: string
  alternativeModels: string[]
  confidence: number
  reasoning: string
}

/**
 * 任务信息
 */
export interface TaskInfo {
  ensemble: {
    predict: (data: PredictionData, horizon?: number) => Promise<PredictionResult>
    train: (data: PredictionData) => Promise<void>
    getModelInfo: () => { modelId: string }
    detectConceptDrift?: (data: PredictionData) => Promise<{ detected: boolean; driftType: string } | undefined>
  }
  config: Record<string, unknown>
  data: PredictionData
  modelSelection: ModelSelection
  createdAt: number
  lastUpdated?: number
}

/**
 * 预测器
 */
export interface Predictor {
  predict: (data: PredictionData, horizon?: number) => Promise<PredictionResult>
  train: (data: PredictionData) => Promise<void>
  getModelInfo: () => { modelId: string }
}

/**
 * 性能指标
 */
export interface PerformanceMetrics {
  accuracy: number
  confidence: number
  stability: number
  avgLatency: number
  predictionCount?: number
}

/**
 * 漂移警报
 */
export interface DriftAlert {
  type: string
  severity: string
  description: string
  timestamp: number
}

/**
 * 推荐
 */
export interface Recommendation {
  category: string
  priority: string
  description: string
  expectedImpact: string
  effort: string
}

/**
 * 风险评估
 */
export interface RiskAssessment {
  overall: 'low' | 'medium' | 'high'
  factors: Array<{
    type: string
    severity: string
    description: string
    impact: string
  }>
  mitigation: string[]
  monitoring: string[]
}

/**
 * 关键洞察
 */
export interface KeyInsight {
  type: string
  description: string
  severity: string
  confidence?: number
  actionability?: string
}

/**
 * 模型拟合评估
 */
export interface ModelFitAssessment {
  goodnessOfFit: number
  residualAnalysis: ResidualAnalysis
  stabilityMetrics: StabilityMetrics
  biasVarianceTradeoff: BiasVarianceTradeoff
  recommendations: string[]
}

/**
 * 稳定性指标
 */
export interface StabilityMetrics {
  parameterStability: number
  predictionStability: number
  temporalStability: number
  sensitivity: {
    noise: number
    complexity: number
  }
}

/**
 * 偏差方差权衡
 */
export interface BiasVarianceTradeoff {
  bias: number
  variance: number
  irreducibleError: number
  totalError: number
  decomposition: string
}

/**
 * 残差分析
 */
export interface ResidualAnalysis {
  meanError: number
  stdError: number
  skewness: number
  kurtosis: number
  autocorrelation: number
  heteroscedasticity: boolean
}

/**
 * 模型约束
 */
export interface ModelConstraints {
  maxTrainingTime?: number
  memoryLimit?: number
  accuracyThreshold?: number
  maxModels?: number
  minAccuracy?: number
  maxLatency?: number
  realTimeCapability?: boolean
}

/**
 * 模型选择
 */
export interface ModelSelection {
  selectedModel: string
  alternativeModels: string[]
  selectionReason: string
  expectedPerformance: number
  confidence: number
  fittingTime: number
}
