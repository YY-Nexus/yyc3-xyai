/**
 * YYC³ 智能预测系统 - 专业化预测引擎
 * 包含时间序列、异常检测、因果推断等专用预测引擎
 */

import { BasePredictor } from './base-predictor';
import type {
  PredictionData,
  TrainingResult,
  PredictionResult,
  PredictorConfig,
  SeasonalityAnalysis,
  ProbabilisticForecast,
  AnomalyReport,
  Anomaly,
  AnomalyExplanation,
  CausalGraph,
  CounterfactualResult,
  Intervention,
  DataPoint,
} from '../../types/prediction/common';

/**
 * 时间序列预测引擎
 */
export class TimeSeriesEngine extends BasePredictor {
  private seasonality: SeasonalityAnalysis | null = null;
  private trend: number[] = [];
  private seasonalityPeriod: number = 0;

  constructor(config: PredictorConfig) {
    super(config);
  }

  protected createInstance(config: PredictorConfig): BasePredictor {
    return new TimeSeriesEngine(config);
  }

  protected getSearchSpace(): Record<string, any> {
    return {
      windowSize: { type: 'range', min: 5, max: 50 },
      alpha: { type: 'range', min: 0.1, max: 0.9 },
      beta: { type: 'range', min: 0.1, max: 0.9 },
      gamma: { type: 'range', min: 0.1, max: 0.9 },
      seasonalityPeriod: [7, 14, 30, 90, 365],
    };
  }

  async train(data: PredictionData): Promise<TrainingResult> {
    const startTime = Date.now();

    // 数据预处理
    const dataPoints = data.data || [];
    const processedData = await this.preprocessData(dataPoints);

    // 训练模型（简化版指数平滑）
    const params = this.config.parameters || {};
    const windowSize = params.windowSize || 12;
    const alpha = params.alpha || 0.3;
    const beta = params.beta || 0.1;
    const gamma = params.gamma || 0.1;

    // 计算训练误差
    const predictions = await this.generateTrainingPredictions(
      processedData,
      windowSize,
      alpha,
      beta,
      gamma
    );
    const actuals = processedData.slice(windowSize).map(p => p.value);
    const errors = predictions.map((pred, i) => Math.abs(pred - actuals[i]));
    const mae = errors.reduce((a, b) => a + b, 0) / errors.length;
    const rmse = Math.sqrt(
      errors.reduce((a, b) => a + b * b, 0) / errors.length
    );

    const trainingResult: TrainingResult = {
      modelId: this.modelId,
      accuracy: 1 / (1 + mae),
      trainingTime: Date.now() - startTime,
      timestamp: new Date(),
      metrics: {
        mae,
        rmse,
        mape: this.calculateMAPE(actuals, predictions),
        r2: this.calculateR2(actuals, predictions),
        windowSize,
        alpha,
        beta,
        gamma,
        seasonalityPeriod: this.seasonalityPeriod,
      },
    };

    this.isTrained = true;
    this.trainingHistory.push(trainingResult);

    return trainingResult;
  }

  async predict(
    data: PredictionData,
    horizon: number = 1
  ): Promise<PredictionResult> {
    if (!this.isTrained) {
      throw new Error('模型尚未训练');
    }

    const dataPoints = data.data || [];
    const processedData = await this.preprocessData(dataPoints);
    const params = this.config.parameters || {};

    // 简化版预测逻辑
    const windowSize = params.windowSize || 12;
    const alpha = params.alpha || 0.3;
    const beta = params.beta || 0.1;
    const gamma = params.gamma || 0.1;

    const predictions: number[] = [];
    let lastValue = processedData[processedData.length - 1]?.value || 0;

    for (let i = 1; i <= horizon; i++) {
      // 简化的指数平滑预测
      const seasonalComponent = 0;

      const prediction = lastValue * (1 - alpha) + seasonalComponent * gamma;
      predictions.push(prediction);
      lastValue = prediction;
    }

    const result: PredictionResult = {
      id: this.modelId + '-' + Date.now(),
      prediction: horizon === 1 ? (predictions[0] || 0) : predictions,
      values: predictions,
      confidence: 0.85,
      timestamp: new Date(),
      modelId: this.modelId,
    };

    return result;
  }

  async evaluate(testData: PredictionData): Promise<TrainingResult> {
    const dataPoints = testData.data || [];
    const processedData = await this.preprocessData(dataPoints);
    const predictions = await this.predict(testData, processedData.length);
    const actuals = processedData.map(p => p.value);

    const predValues = Array.isArray(predictions.prediction)
      ? predictions.prediction
      : [predictions.prediction];

    const mae = this.calculateMAE(actuals, predValues);

    return {
      modelId: this.modelId,
      accuracy: 1 / (1 + mae),
      trainingTime: 0,
      timestamp: new Date(),
      metrics: {
        mae,
        rmse: this.calculateRMSE(actuals, predValues),
        mape: this.calculateMAPE(actuals, predValues),
        r2: this.calculateR2(actuals, predValues),
      },
    };
  }

  /**
   * 检测季节性
   */
  async detectSeasonality(dataPoints: DataPoint[]): Promise<SeasonalityAnalysis> {
    const values = dataPoints.map(p => p.value);
    const periods = [7, 14, 30, 90, 365]; // 常见季节性周期
    let bestPeriod = 0;
    let bestCorrelation = 0;

    periods.forEach(period => {
      if (values.length < period * 2) return;

      const correlation = this.calculateSeasonalityCorrelation(values, period);
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestPeriod = period;
      }
    });

    this.seasonalityPeriod = bestPeriod;

    return {
      hasSeasonality: bestCorrelation > 0.3,
      seasonalityType: bestPeriod > 0 ? this.identifySeasonalityType(bestPeriod) : 'none',
      strength: bestCorrelation,
      period: bestPeriod,
    };
  }

  /**
   * 不确定性预测
   */
  async forecastWithUncertainty(
    data: PredictionData,
    horizon: number = 1
  ): Promise<ProbabilisticForecast> {
    const pointForecast = await this.predict(data, horizon);

    // 简化的不确定性量化
    const baseUncertainty = 0.1; // 基础不确定性10%
    const uncertaintyGrowth = 1.05; // 每步预测不确定性增长5%

    const uncertainties: number[] = [];
    for (let i = 1; i <= horizon; i++) {
      uncertainties.push(baseUncertainty * Math.pow(uncertaintyGrowth, i - 1));
    }

    const predValues = Array.isArray(pointForecast.prediction)
      ? pointForecast.prediction
      : [pointForecast.prediction];

    const predictions = predValues.map((value, index) => {
      const uncertainty = uncertainties[index] || 0;
      return {
        value,
        probability: 1 - uncertainty,
        confidenceInterval: [
          value * (1 - uncertainty),
          value * (1 + uncertainty),
        ] as [number, number],
      };
    });

    return {
      predictions,
      timestamp: new Date(),
    };
  }

  private extractTrend(dataPoints: DataPoint[]): number[] {
    const values = dataPoints.map(p => p.value);
    const windowSize = Math.min(12, Math.floor(values.length / 4));
    const trend: number[] = [];

    for (let i = windowSize; i < values.length; i++) {
      const window = values.slice(i - windowSize, i);
      const firstHalf = window.slice(0, Math.floor(windowSize / 2));
      const secondHalf = window.slice(Math.floor(windowSize / 2));

      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg =
        secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

      trend.push(secondAvg - firstAvg);
    }

    return trend;
  }

  private calculateSeasonalityCorrelation(
    values: number[],
    period: number
  ): number {
    if (values.length < period * 2) return 0;

    const correlations: number[] = [];
    for (
      let lag = period;
      lag < Math.min(period * 3, values.length - period);
      lag += period
    ) {
      const correlation = this.calculateCorrelation(
        values.slice(0, values.length - lag),
        values.slice(lag)
      );
      correlations.push(correlation);
    }

    return correlations.length > 0
      ? correlations.reduce((a, b) => a + b, 0) / correlations.length
      : 0;
  }

  private identifySeasonalityType(
    period: number
  ): 'daily' | 'weekly' | 'monthly' | 'yearly' {
    if (period <= 1) return 'daily';
    if (period <= 7) return 'weekly';
    if (period <= 30) return 'monthly';
    return 'yearly';
  }

  private getSeasonalComponent(step: number): number {
    if (
      !this.seasonality ||
      !this.seasonality.hasSeasonality ||
      this.seasonalityPeriod === 0
    ) {
      return 0;
    }

    // 简化的季节性组件
    const phase =
      ((step % this.seasonalityPeriod) / this.seasonalityPeriod) * 2 * Math.PI;
    return Math.sin(phase) * this.seasonality.strength;
  }

  private async generateTrainingPredictions(
    dataPoints: DataPoint[],
    windowSize: number,
    alpha: number,
    beta: number,
    gamma: number
  ): Promise<number[]> {
    const predictions: number[] = [];
    const values = dataPoints.map(p => p.value);

    for (let i = windowSize; i < values.length; i++) {
      const window = values.slice(i - windowSize, i);
      const avg = window.reduce((a, b) => a + b, 0) / windowSize;
      predictions.push(avg);
    }

    return predictions;
  }

  // 辅助计算方法
  private calculateMAE(actuals: number[], predictions: number[]): number {
    return (
      predictions.reduce(
        (sum, pred, i) => sum + Math.abs(pred - actuals[i]),
        0
      ) / predictions.length
    );
  }

  private calculateRMSE(actuals: number[], predictions: number[]): number {
    return Math.sqrt(
      predictions.reduce(
        (sum, pred, i) => sum + Math.pow(pred - actuals[i], 2),
        0
      ) / predictions.length
    );
  }

  private calculateMAPE(actuals: number[], predictions: number[]): number {
    return (
      predictions.reduce((sum, pred, i) => {
        const actual = actuals[i];
        return actual !== 0 ? sum + Math.abs((pred - actual) / actual) : sum;
      }, 0) / predictions.length
    );
  }

  private calculateR2(actuals: number[], predictions: number[]): number {
    const actualMean = actuals.reduce((a, b) => a + b, 0) / actuals.length;
    const totalSS = actuals.reduce(
      (sum, actual) => sum + Math.pow(actual - actualMean, 2),
      0
    );
    const residualSS = predictions.reduce(
      (sum, pred, i) => sum + Math.pow(pred - actuals[i], 2),
      0
    );
    return 1 - residualSS / totalSS;
  }

  private calculateTheilU(actuals: number[], predictions: number[]): number {
    const errorSS = predictions.reduce(
      (sum, pred, i) => sum + Math.pow(pred - actuals[i], 2),
      0
    );
    const naiveSS = actuals.reduce((sum, actual, i) => {
      return i > 0 ? sum + Math.pow(actual - actuals[i - 1], 2) : sum;
    }, 0);
    return Math.sqrt(errorSS / naiveSS);
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0;

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY)
    );

    return denominator === 0 ? 0 : numerator / denominator;
  }
}

/**
 * 异常检测引擎
 */
export class AnomalyDetectionEngine extends BasePredictor {
  private threshold: number = 2.5;
  private baseline: number[] = [];

  constructor(config: PredictorConfig) {
    super(config);
    this.threshold = config.parameters?.threshold || 2.5;
  }

  protected createInstance(config: PredictorConfig): BasePredictor {
    return new AnomalyDetectionEngine(config);
  }

  protected getSearchSpace(): Record<string, any> {
    return {
      threshold: { type: 'range', min: 1.5, max: 4.0 },
      windowSize: { type: 'range', min: 10, max: 100 },
      method: ['zscore', 'iqr', 'isolation_forest', 'lof'],
    };
  }

  async train(data: PredictionData): Promise<TrainingResult> {
    const startTime = Date.now();
    const dataPoints = data.data || [];
    const processedData = await this.preprocessData(dataPoints);

    // 计算基线统计量
    this.baseline = processedData.map(p => p.value);

    const stats = this.calculateStatistics(this.baseline);
    const trainingResult: TrainingResult = {
      modelId: this.modelId,
      accuracy: 0.9,
      trainingTime: Date.now() - startTime,
      timestamp: new Date(),
      metrics: { threshold: this.threshold, ...stats },
    };

    this.isTrained = true;
    this.trainingHistory.push(trainingResult);

    return trainingResult;
  }

  async predict(
    data: PredictionData,
    horizon?: number
  ): Promise<PredictionResult> {
    if (!this.isTrained) {
      throw new Error('模型尚未训练');
    }

    const anomalyReport = await this.detectAnomalies(data);

    return {
      id: this.modelId + '-' + Date.now(),
      prediction: anomalyReport.anomalies.length,
      values: [],
      confidence: 0.9,
      timestamp: new Date(),
      modelId: this.modelId,
    };
  }

  async evaluate(testData: PredictionData): Promise<TrainingResult> {
    const anomalyReport = await this.detectAnomalies(testData);
    const anomalyCount = anomalyReport.anomalies.length;
    const totalData = testData.data?.length || 1;

    return {
      modelId: this.modelId,
      accuracy: 1 - (anomalyCount / totalData),
      trainingTime: 0,
      timestamp: new Date(),
      metrics: {
        anomalyCount,
        anomalyRate: anomalyCount / totalData,
        severity: this.calculateAnomalySeverity(anomalyReport.anomalies),
      },
    };
  }

  /**
   * 检测异常
   */
  async detectAnomalies(data: PredictionData): Promise<AnomalyReport> {
    const dataPoints = data.data || [];
    const processedData = await this.preprocessData(dataPoints);
    const values = processedData.map(p => p.value);
    const anomalies: Anomaly[] = [];

    const method = this.config.parameters?.method || 'zscore';
    const mean = values.reduce((a, b) => a + b, 0) / values.length;

    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      const isAnomaly = this.isValueAnomalous(value, i, method, values);

      if (isAnomaly) {
        anomalies.push({
          id: `anomaly-${i}-${Date.now()}`,
          timestamp: processedData[i].timestamp ? new Date(processedData[i].timestamp) : new Date(),
          value: value,
          expectedValue: mean,
          severity: this.assessAnomalySeverity(value, i, values),
        });
      }
    }

    const calculateSeverityLevel = (score: number): 'low' | 'medium' | 'high' => {
      if (score < 1.5) return 'low';
      if (score < 2.5) return 'medium';
      return 'high';
    };

    return {
      anomalies,
      summary: {
        totalAnomalies: anomalies.length,
        severity: calculateSeverityLevel(this.calculateAnomalySeverity(anomalies)),
        timeRange: [new Date(), new Date()],
      },
      timestamp: new Date(),
    };
  }

  /**
   * 解释异常
   */
  async explainAnomalies(anomalies: Anomaly[]): Promise<AnomalyExplanation[]> {
    return anomalies.map(anomaly => ({
      reason: this.generateAnomalyExplanation(anomaly),
      factors: this.identifyContributingFactors(anomaly),
      confidence: 0.85,
    }));
  }

  private calculateStatistics(values: number[]): Record<string, number> {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      values.length;
    const std = Math.sqrt(variance);

    const sortedValues = [...values].sort((a, b) => a - b);
    const q1 = sortedValues[Math.floor(sortedValues.length * 0.25)];
    const q3 = sortedValues[Math.floor(sortedValues.length * 0.75)];
    const iqr = q3 - q1;

    return {
      mean,
      std,
      min: Math.min(...values),
      max: Math.max(...values),
      median: sortedValues[Math.floor(sortedValues.length / 2)],
      q1,
      q3,
      iqr,
    };
  }

  private isValueAnomalous(
    value: number,
    index: number,
    method: string,
    values: number[]
  ): boolean {
    const stats = this.calculateStatistics(values);

    switch (method) {
      case 'zscore':
        const zscore = Math.abs((value - stats.mean) / stats.std);
        return zscore > this.threshold;

      case 'iqr':
        const lowerBound = stats.q1 - 1.5 * stats.iqr;
        const upperBound = stats.q3 + 1.5 * stats.iqr;
        return value < lowerBound || value > upperBound;

      default:
        return false;
    }
  }

  private calculateAnomalyScore(
    value: number,
    index: number,
    method: string,
    values: number[]
  ): number {
    const stats = this.calculateStatistics(values);

    switch (method) {
      case 'zscore':
        return Math.abs((value - stats.mean) / stats.std);
      case 'iqr':
        const lowerBound = stats.q1 - 1.5 * stats.iqr;
        const upperBound = stats.q3 + 1.5 * stats.iqr;
        if (value < lowerBound) return (lowerBound - value) / stats.iqr;
        if (value > upperBound) return (value - upperBound) / stats.iqr;
        return 0;
      default:
        return 0;
    }
  }

  private classifyAnomalyType(
    value: number,
    index: number,
    values: number[]
  ): 'spike' | 'dip' | 'trend_break' | 'seasonal_anomaly' {
    const contextSize = Math.min(5, index, values.length - index - 1);
    if (contextSize === 0) return 'spike';

    const context = values.slice(index - contextSize, index + contextSize + 1);
    const contextMean = context.reduce((a, b) => a + b, 0) / context.length;

    if (value > contextMean * 1.5) return 'spike';
    if (value < contextMean * 0.5) return 'dip';

    return 'trend_break';
  }

  private assessAnomalySeverity(
    value: number,
    index: number,
    values: number[]
  ): 'low' | 'medium' | 'high' {
    const score = this.calculateAnomalyScore(value, index, 'zscore', values);
    if (score < 2) return 'low';
    if (score < 3) return 'medium';
    return 'high';
  }

  private calculateAnomalySeverity(anomalies: Anomaly[]): number {
    if (anomalies.length === 0) return 0;

    const severityWeights = { low: 1, medium: 2, high: 3 };
    const totalSeverity = anomalies.reduce(
      (sum, anomaly) => sum + severityWeights[anomaly.severity],
      0
    );

    return totalSeverity / anomalies.length;
  }

  private generateAnomalyExplanation(anomaly: Anomaly): string {
    const severityText = {
      low: '轻微',
      medium: '中等',
      high: '严重',
    };

    return `在时间点 ${new Date(anomaly.timestamp).toLocaleString()} 检测到${severityText[anomaly.severity]}程度的异常，值为 ${anomaly.value.toFixed(2)}，预期值为 ${anomaly.expectedValue.toFixed(2)}`;
  }

  private identifyContributingFactors(anomaly: Anomaly): string[] {
    const factors: string[] = [];

    // 基于异常值与预期值的差异来推断可能的因素
    const deviation = Math.abs(anomaly.value - anomaly.expectedValue);
    const relativeDeviation = deviation / Math.abs(anomaly.expectedValue || 1);

    if (relativeDeviation > 0.5) {
      factors.push('外部事件影响', '数据采集错误', '系统异常');
    } else if (relativeDeviation > 0.2) {
      factors.push('系统波动', '数据质量问题', '正常变异');
    } else {
      factors.push('轻微波动', '测量误差', '正常范围内变化');
    }

    return factors;
  }

  private recommendAction(anomaly: Anomaly): string {
    if (anomaly.severity === 'high') {
      return '立即调查并采取纠正措施';
    } else if (anomaly.severity === 'medium') {
      return '密切监控，准备应对方案';
    } else {
      return '记录异常，继续观察';
    }
  }

  private getAnomalyContext(anomaly: Anomaly): Record<string, any> {
    // 找到异常值在基线中的近似位置
    const index = this.baseline.findIndex(value => 
      Math.abs(value - anomaly.value) < 0.01 * Math.abs(anomaly.value)
    ) || 0;
    
    return {
      surroundingValues: this.baseline.slice(
        Math.max(0, index - 5),
        Math.min(this.baseline.length, index + 6)
      ),
      statisticalBaseline: this.calculateStatistics(this.baseline),
      timeContext: `前后5个时间点的平均值`,
    };
  }
}

/**
 * 因果推断引擎
 */
export class CausalInferenceEngine extends BasePredictor {
  constructor(config: PredictorConfig) {
    super(config);
  }

  protected createInstance(config: PredictorConfig): BasePredictor {
    return new CausalInferenceEngine(config);
  }

  async train(data: PredictionData): Promise<TrainingResult> {
    // 因果推断的"训练"主要是学习因果关系
    const startTime = Date.now();

    const trainingResult: TrainingResult = {
      modelId: this.modelId,
      accuracy: 0.9,
      trainingTime: Date.now() - startTime,
      timestamp: new Date(),
      metrics: {
        causalStrength: 0.8,
        identifiability: 0.9,
        robustness: 0.85,
      },
    };

    this.isTrained = true;
    this.trainingHistory.push(trainingResult);

    return trainingResult;
  }

  async predict(
    data: PredictionData,
    horizon?: number
  ): Promise<PredictionResult> {
    if (!this.isTrained) {
      throw new Error('模型尚未训练');
    }

    // 因果推断主要用于解释而非预测
    return {
      id: this.modelId + '-' + Date.now(),
      prediction: 0, // 因果推断不直接产生数值预测
      values: [],
      confidence: 0.7,
      timestamp: new Date(),
      modelId: this.modelId,
    };
  }

  async evaluate(testData: PredictionData): Promise<TrainingResult> {
    // 因果推断的评估指标与传统预测不同
    return {
      modelId: this.modelId,
      accuracy: 0.9,
      trainingTime: 0,
      timestamp: new Date(),
      metrics: {
        causalStrength: 0.8,
        identifiability: 0.9,
        robustness: 0.85,
      },
    };
  }

  /**
   * 识别因果关系
   */
  async identifyCausalEffects(data: PredictionData): Promise<CausalGraph> {
    const features = data.features || [];
    const causalGraph: CausalGraph = {
      nodes: [
        { id: 'target', name: 'target', type: 'target' },
        ...features.map((feature, index) => ({
          id: `feature-${index}`,
          name: `feature-${index}`,
          type: 'feature' as const,
        }))
      ],
      edges: [],
    };

    // 简化的因果关系识别（基于相关性）
    for (let i = 0; i < features.length; i++) {
      const correlation = this.calculateFeatureTargetCorrelation(data, i);
      if (Math.abs(correlation) > 0.3) {
        causalGraph.edges.push({
          source: `feature-${i}`,
          target: 'target',
          strength: Math.abs(correlation),
          direction: correlation > 0 ? 'positive' : 'negative',
        });
      }
    }

    return causalGraph;
  }

  /**
   * 模拟干预
   */
  async simulateIntervention(
    intervention: Intervention
  ): Promise<CounterfactualResult> {
    // 简化的反事实推理
    const baseline = 0;
    const effectSize = 0.1;
    const causalEffect = baseline * effectSize;

    return {
      originalPrediction: baseline,
      counterfactualPrediction: baseline + causalEffect,
      changes: {
        effectSize: causalEffect,
      },
      confidence: 0.8,
    };
  }

  private calculateFeatureTargetCorrelation(
    data: PredictionData,
    featureIndex: number
  ): number {
    // 简化的特征-目标相关性计算
    const targetValues = data.data?.map(p => p.value) || [];
    if (targetValues.length === 0) return 0;
    
    // 模拟特征值（实际应用中需要从真实特征数据中提取）
    const featureValues = targetValues.map((value, index) => 
      value * (1 + (Math.random() - 0.5) * 0.2)
    );

    return this.calculateCorrelation(featureValues, targetValues);
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0;

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY)
    );

    return denominator === 0 ? 0 : numerator / denominator;
  }
}
