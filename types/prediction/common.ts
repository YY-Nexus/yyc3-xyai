/**
 * @file 预测引擎类型定义
 * @description 定义预测引擎相关的类型接口
 * @module types/prediction
 * @author YYC³
 * @version 2.0.0
 * @updated 2025-01-30
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

/**
 * 预测数据
 */
export interface PredictionData {
  features: number[];
  labels?: number[];
  timestamps?: number[];
  frequency?: string;
  dataType?: 'timeseries' | 'cross-sectional' | 'panel' | 'mixed';
  data?: DataPoint[];
  metadata?: Record<string, any>;
}

/**
 * 数据点
 */
export interface DataPoint {
  value: number;
  features?: Record<string, number>;
  timestamp?: number;
  label?: number;
}

/**
 * 预测结果
 */
export interface PredictionResult {
  modelId: string;
  prediction: number | number[];
  values: number[];
  confidence: number;
  confidenceInterval?: [number, number];
  id?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * 预测任务
 */
export interface PredictionTask {
  id: string;
  name: string;
  type: 'regression' | 'classification' | 'forecasting' | 'anomaly_detection';
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  constraints: {
    maxTrainingTime?: number;
    memoryLimit?: number;
    accuracyThreshold?: number;
    realTimeCapability?: boolean;
  };
  requirements: {
    minAccuracy?: number;
    maxLatency?: number;
    preferredModels?: string[];
  };
  status?: 'pending' | 'running' | 'completed' | 'failed';
}

/**
 * 预测配置
 */
export interface PredictionConfig {
  name?: string;
  algorithm?: string;
  modelType: 'regression' | 'classification' | 'forecasting' | 'anomaly_detection';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  constraints?: {
    maxTrainingTime?: number;
    memoryLimit?: number;
    accuracyThreshold?: number;
    realTimeCapability?: boolean;
  };
  requirements?: {
    minAccuracy?: number;
    maxLatency?: number;
    preferredModels?: string[];
    accuracy?: 'low' | 'medium' | 'high';
    speed?: 'low' | 'medium' | 'high';
    interpretability?: 'low' | 'medium' | 'high';
    scalability?: 'low' | 'medium' | 'high';
  };
  parameters?: Record<string, any>;
  preprocessing?: {
    normalize?: boolean;
    scale?: boolean;
    handleMissing?: 'drop' | 'fill' | 'interpolate' | 'mean' | 'median';
    featureEngineering?: boolean;
    outlierRemoval?: boolean;
  };
  validation?: {
    method?: 'cross_validation' | 'holdout' | 'time_series_split';
    crossValidation?: boolean;
    testSplit?: number;
    testSize?: number;
    validationSplit?: number;
    folds?: number;
  };
}

/**
 * 模型约束
 */
export interface ModelConstraints {
  maxComplexity?: number;
  maxFeatures?: number;
  maxTrainingTime?: number;
  memoryLimit?: number;
  maxModels?: number;
  accuracyThreshold?: number;
  realTimeCapability?: boolean;
}

/**
 * 模型评估
 */
export interface ModelEvaluation {
  modelId: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rmse: number;
  mae: number;
  r2Score: number;
  timestamp: Date;
}

/**
 * 质量指标
 */
export interface QualityMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rmse: number;
  mae: number;
  r2Score: number;
  timestamp: number;
  customMetrics: {
    mape: number;
    n: number;
    avgConfidence: number;
    timestampRange: number;
  };
}

/**
 * 偏差报告
 */
export interface BiasReport {
  modelId: string;
  biasScore: number;
  overall?: 'low' | 'medium' | 'high';
  biasMetrics: {
    genderBias?: number;
    ageBias?: number;
    regionBias?: number;
  };
  recommendations: string[];
  timestamp: Date;
}

/**
 * 校准结果
 */
export interface CalibrationResult {
  modelId: string;
  calibrationScore: number;
  calibrationCurve: Array<{
    predicted: number;
    actual: number;
  }>;
  timestamp: Date;
}

/**
 * 敏感数据
 */
export interface SensitiveData {
  dataPoints?: Array<{
    index: number;
    sensitivity: 'high' | 'medium' | 'low';
    features: string[];
  }>;
  recommendations?: string[];
  [key: string]: unknown;
}

/**
 * 模型选择
 */
export interface ModelSelection {
  reasoning: string;
  selectedModel: ModelFitAssessment;
  alternativeModels: ModelFitAssessment[];
  selectionReason: string;
  expectedPerformance: number;
  confidence: number;
  fittingTime: number;
  goodnessOfFit: number;
  residualAnalysis: ResidualAnalysis;
  stabilityMetrics: StabilityMetrics;
  biasVarianceTradeoff: BiasVarianceTradeoff;
  recommendations: string[];
}

/**
 * 模型拟合评估
 */
export interface ModelFitAssessment {
  modelId: string;
  accuracy: number;
  fittingTime: number;
  complexityScore: number;
  generalizationScore: number;
  confidenceScore: number;
  [key: string]: any;
}

/**
 * 集成引擎接口
 */
export interface EnsembleEngine {
  predict: (data: PredictionData, horizon?: number) => Promise<PredictionResult>;
  train: (data: PredictionData) => Promise<ModelEvaluation>;
  getModelInfo: () => { modelId: string };
  detectConceptDrift?: (data: PredictionData) => Promise<boolean>;
}

/**
 * 预测器接口
 */
export interface Predictor {
  predict: (data: PredictionData, horizon?: number) => Promise<PredictionResult>;
  train: (data: PredictionData) => Promise<ModelEvaluation>;
  getModelInfo: () => { modelId: string };
  evaluate: (data: PredictionData) => Promise<ModelEvaluation>;
  saveModel: () => Promise<void>;
  loadModel: (modelId: string) => Promise<void>;
  featureEngineering: (data: PredictionData) => Promise<PredictionData>;
}

/**
 * 时间序列引擎接口
 */
export interface TimeSeriesEngine {
  predict: (data: PredictionData, horizon?: number) => Promise<PredictionResult>;
  train: (data: PredictionData) => Promise<ModelEvaluation>;
  getModelInfo: () => { modelId: string };
  detectConceptDrift?: (data: PredictionData) => Promise<boolean>;
}

/**
 * 异常检测引擎接口
 */
export interface AnomalyDetectionEngine {
  predict: (data: PredictionData, horizon?: number) => Promise<PredictionResult>;
  train: (data: PredictionData) => Promise<ModelEvaluation>;
  getModelInfo: () => { modelId: string };
}

/**
 * 因果推断引擎接口
 */
export interface CausalInferenceEngine {
  predict: (data: PredictionData, horizon?: number) => Promise<PredictionResult>;
  train: (data: PredictionData) => Promise<ModelEvaluation>;
  getModelInfo: () => { modelId: string };
}

/**
 * 任务信息
 */
export interface TaskInfo {
  taskId: string;
  modelId: string;
  ensemble: {
    predict: (data: PredictionData, horizon?: number) => Promise<PredictionResult>;
    train: (data: PredictionData) => Promise<ModelEvaluation>;
    getModelInfo: () => { modelId: string };
    detectConceptDrift?: (data: PredictionData) => Promise<boolean>;
    addPredictor?: (predictor: any) => void;
  };
  config: Record<string, unknown>;
  data: PredictionData;
  modelSelection: ModelSelection;
  createdAt: number;
  lastUpdated?: number;
  predictor?: any;
}

/**
 * 稳定性指标
 */
export interface StabilityMetrics {
  modelId: string;
  score: number;
  variance: number;
  drift: number;
  timestamp: Date;
}

/**
 * 偏差-方差权衡
 */
export interface BiasVarianceTradeoff {
  bias: number;
  variance: number;
  irreducibleError: number;
  totalError: number;
  optimalComplexity: number;
}

/**
 * 残差分析
 */
export interface ResidualAnalysis {
  residuals: number[];
  mean: number;
  std: number;
  pattern: 'random' | 'systematic' | 'heteroscedastic';
  timestamp: Date;
}

/**
 * 训练结果
 */
export interface TrainingResult {
  modelId: string;
  accuracy: number;
  trainingTime: number;
  timestamp: Date;
  metrics: Record<string, number>;
}

/**
 * 性能历史
 */
export interface PerformanceHistory {
  modelId: string;
  history: Array<{
    timestamp: Date;
    accuracy: number;
    latency: number;
  }>;
}

/**
 * 数据漂移指标
 */
export interface DataDriftMetrics {
  modelId: string;
  driftScore: number;
  driftType: 'concept' | 'data' | 'none';
  timestamp: Date;
  affectedFeatures: string[];
}

/**
 * 更新的权重
 */
export interface UpdatedWeights {
  modelId: string;
  weights: number[];
  timestamp: Date;
}

/**
 * 漂移检测
 */
export interface DriftDetection {
  detected: boolean;
  driftType: 'concept' | 'data' | 'none';
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
}

/**
 * 预测器配置
 */
export interface PredictorConfig {
  modelType: string;
  name?: string;
  algorithm?: string;
  parameters?: Record<string, any>;
  preprocessing?: {
    normalize?: boolean;
    scale?: boolean;
    handleMissing?: 'drop' | 'fill' | 'interpolate';
  };
  validation?: {
    method: 'cross_validation' | 'holdout' | 'time_series_split';
    folds?: number;
    testSize?: number;
  };
  maxPredictors?: number;
}

/**
 * 季节性分析
 */
export interface SeasonalityAnalysis {
  hasSeasonality: boolean;
  seasonalityType: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'none';
  strength: number;
  period?: number;
}

/**
 * 概率预测
 */
export interface ProbabilisticForecast {
  predictions: Array<{
    value: number;
    probability: number;
    confidenceInterval: [number, number];
  }>;
  timestamp: Date;
}

/**
 * 异常报告
 */
export interface AnomalyReport {
  anomalies: Anomaly[];
  summary: {
    totalAnomalies: number;
    severity: 'low' | 'medium' | 'high';
    timeRange: [Date, Date];
  };
  timestamp: Date;
}

/**
 * 异常
 */
export interface Anomaly {
  id: string;
  timestamp: Date;
  value: number;
  expectedValue: number;
  severity: 'low' | 'medium' | 'high';
  explanation?: AnomalyExplanation;
}

/**
 * 异常解释
 */
export interface AnomalyExplanation {
  reason: string;
  factors: string[];
  confidence: number;
}

/**
 * 因果图
 */
export interface CausalGraph {
  nodes: Array<{
    id: string;
    name: string;
    type: 'feature' | 'target' | 'confounder';
  }>;
  edges: Array<{
    source: string;
    target: string;
    strength: number;
    direction: 'positive' | 'negative';
  }>;
}

/**
 * 反事实结果
 */
export interface CounterfactualResult {
  originalPrediction: number;
  counterfactualPrediction: number;
  changes: Record<string, number>;
  confidence: number;
}

/**
 * 干预
 */
export interface Intervention {
  action: string;
  target: string;
  expectedImpact: number;
  confidence: number;
  timestamp: Date;
}

/**
 * 预测洞察
 */
export interface PredictionInsights {
  modelId: string;
  insights: KeyInsight[];
  summary: string;
  recommendations: Recommendation[];
  timestamp: Date;
  keyPoints?: KeyInsight[];
  performanceMetrics?: ModelPerformanceMetrics;
  driftAlerts?: DriftAlert[];
  riskAssessment?: RiskAssessment;
  confidence?: number;
}

/**
 * 流式预测
 */
export interface StreamingPrediction {
  predictionId: string;
  result: PredictionResult;
  streamId: string;
  timestamp: Date;
  prediction: number | number[];
  confidence: number;
  processingTime: number;
  dataQuality: any;
  modelVersion: string;
}

/**
 * 数据流
 */
export interface DataStream {
  streamId: string;
  data: DataPoint[];
  metadata: Record<string, any>;
  isActive: boolean;
  qualityMetrics: any;
}

/**
 * 性能指标
 */
export interface ModelPerformanceMetrics {
  modelId: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  latency: number;
  throughput: number;
  timestamp: Date;
  confidence?: number;
}

/**
 * 漂移警报
 */
export interface DriftAlert {
  modelId: string;
  alertType: 'concept_drift' | 'data_drift' | 'performance_degradation';
  type?: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: number;
  detected?: boolean;
  driftType?: string;
}

/**
 * 推荐
 */
export interface Recommendation {
  type: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  expectedImpact: number;
}

/**
 * 风险评估
 */
export interface RiskAssessment {
  modelId: string;
  riskLevel: 'low' | 'medium' | 'high';
  overall?: 'low' | 'medium' | 'high';
  riskFactors: string[];
  mitigationStrategies: string[];
  timestamp: Date;
}

/**
 * 关键洞察
 */
export interface KeyInsight {
  type: string;
  description: string;
  importance: number;
  severity?: 'low' | 'medium' | 'high';
  confidence?: number;
  actionability?: boolean;
  timestamp: Date;
}
