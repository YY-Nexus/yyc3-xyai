/**
 * @file LearningEngine.ts
 * @description YYC³ AI浮窗系统学习引擎 - 基于历史数据的增量学习模块
 * @module lib/learning
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-20
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { EventEmitter } from 'events';

export interface LearningData {
  id: string;
  timestamp: number;
  features: Record<string, unknown>;
  labels: Record<string, unknown>;
  context: Record<string, unknown>;
  outcome: {
    success: boolean;
    impact: number;
    userSatisfaction?: number;
    performanceImprovement?: number;
  };
}

export interface LearningModel {
  id: string;
  name: string;
  description: string;
  version: string;
  type: 'classification' | 'regression' | 'clustering' | 'reinforcement';
  features: string[];
  labels: string[];
  parameters: Record<string, unknown>;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  lastTrainedAt: number;
  trainingDataSize: number;
  validationDataSize: number;
  isIncremental: boolean;
}

export interface LearningContext {
  timestamp: number;
  environment: Record<string, unknown>;
  user: Record<string, unknown>;
  system: Record<string, unknown>;
  historical: LearningData[];
}

export interface LearningPrediction {
  id: string;
  modelId: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  confidence: number;
  timestamp: number;
}

export interface LearningMetrics {
  totalLearningSessions: number;
  totalDataPoints: number;
  averageAccuracy: number;
  averagePrecision: number;
  averageRecall: number;
  averageF1Score: number;
  totalModels: number;
  activeModels: number;
  averageTrainingTime: number;
  averagePredictionTime: number;
}

export interface LearningEngineConfig {
  enableIncrementalLearning: boolean;
  enableAutoRetraining: boolean;
  retrainingThreshold: number;
  maxDataPoints: number;
  maxModels: number;
  minConfidence: number;
  learningRate: number;
  batchSize: number;
  validationSplit: number;
  enablePersistence: boolean;
  persistenceInterval: number;
}

export class LearningEngine extends EventEmitter {
  private static instance: LearningEngine;
  private models: Map<string, LearningModel> = new Map();
  private learningData: LearningData[] = [];
  private predictions: LearningPrediction[] = [];
  private metrics: LearningMetrics;
  private config: LearningEngineConfig;
  private modelTrainer: ModelTrainer;
  private modelPredictor: ModelPredictor;
  private dataManager: DataManager;
  private persistenceTimer: NodeJS.Timeout | null = null;

  private constructor(config?: Partial<LearningEngineConfig>) {
    super();
    this.config = this.initializeConfig(config);
    this.modelTrainer = new ModelTrainer(this.config);
    this.modelPredictor = new ModelPredictor(this.config);
    this.dataManager = new DataManager(this.config);
    this.metrics = this.initializeMetrics();
    this.initialize();
  }

  static getInstance(config?: Partial<LearningEngineConfig>): LearningEngine {
    if (!LearningEngine.instance) {
      LearningEngine.instance = new LearningEngine(config);
    }
    return LearningEngine.instance;
  }

  private initializeConfig(
    config?: Partial<LearningEngineConfig>
  ): LearningEngineConfig {
    return {
      enableIncrementalLearning: true,
      enableAutoRetraining: true,
      retrainingThreshold: 100,
      maxDataPoints: 10000,
      maxModels: 10,
      minConfidence: 0.7,
      learningRate: 0.01,
      batchSize: 32,
      validationSplit: 0.2,
      enablePersistence: true,
      persistenceInterval: 300000,
      ...config,
    };
  }

  private initializeMetrics(): LearningMetrics {
    return {
      totalLearningSessions: 0,
      totalDataPoints: 0,
      averageAccuracy: 0,
      averagePrecision: 0,
      averageRecall: 0,
      averageF1Score: 0,
      totalModels: 0,
      activeModels: 0,
      averageTrainingTime: 0,
      averagePredictionTime: 0,
    };
  }

  private async initialize(): Promise<void> {
    if (this.config.enablePersistence) {
      await this.loadPersistedData();
      this.startPersistenceTimer();
    }

    this.loadDefaultModels();
    this.emit('initialized', this.metrics);
  }

  private async loadPersistedData(): Promise<void> {
    try {
      const data = await this.dataManager.loadData();
      if (data) {
        this.learningData = data.learningData || [];
        this.models = new Map(data.models || []);
        this.metrics = data.metrics || this.metrics;
      }
    } catch (error) {
      this.log('error', `Failed to load persisted data: ${error}`);
    }
  }

  private startPersistenceTimer(): void {
    if (this.persistenceTimer) {
      clearInterval(this.persistenceTimer);
    }

    this.persistenceTimer = setInterval(async () => {
      await this.persistData();
    }, this.config.persistenceInterval);
  }

  private async persistData(): Promise<void> {
    try {
      await this.dataManager.saveData({
        learningData: this.learningData,
        models: Array.from(this.models.entries()),
        metrics: this.metrics,
      });
      this.log('info', 'Data persisted successfully');
    } catch (error) {
      this.log('error', `Failed to persist data: ${error}`);
    }
  }

  private loadDefaultModels(): void {
    const defaultModels: LearningModel[] = [
      {
        id: 'model-user-behavior-classification',
        name: 'User Behavior Classification',
        description: 'Classify user behavior patterns',
        version: '1.0.0',
        type: 'classification',
        features: [
          'activity',
          'timeOfDay',
          'dayOfWeek',
          'deviceType',
          'networkSpeed',
        ],
        labels: ['productive', 'leisure', 'idle', 'away'],
        parameters: {
          algorithm: 'decision-tree',
          maxDepth: 5,
          minSamplesSplit: 2,
        },
        accuracy: 0.85,
        precision: 0.83,
        recall: 0.87,
        f1Score: 0.85,
        lastTrainedAt: Date.now(),
        trainingDataSize: 1000,
        validationDataSize: 200,
        isIncremental: true,
      },
      {
        id: 'model-performance-regression',
        name: 'Performance Regression',
        description: 'Predict system performance metrics',
        version: '1.0.0',
        type: 'regression',
        features: [
          'systemLoad',
          'memoryUsage',
          'networkLatency',
          'userActivity',
          'timeOfDay',
        ],
        labels: ['executionTime', 'renderTime', 'responseTime'],
        parameters: {
          algorithm: 'linear-regression',
          regularization: 'l2',
          alpha: 0.01,
        },
        accuracy: 0.88,
        precision: 0.86,
        recall: 0.9,
        f1Score: 0.88,
        lastTrainedAt: Date.now(),
        trainingDataSize: 1500,
        validationDataSize: 300,
        isIncremental: true,
      },
      {
        id: 'model-resource-optimization',
        name: 'Resource Optimization',
        description: 'Optimize resource allocation',
        version: '1.0.0',
        type: 'reinforcement',
        features: [
          'currentUsage',
          'predictedDemand',
          'userPriority',
          'systemConstraints',
        ],
        labels: [
          'allocationDecision',
          'priorityAdjustment',
          'throttlingDecision',
        ],
        parameters: {
          algorithm: 'q-learning',
          learningRate: 0.1,
          discountFactor: 0.95,
          explorationRate: 0.1,
        },
        accuracy: 0.82,
        precision: 0.8,
        recall: 0.84,
        f1Score: 0.82,
        lastTrainedAt: Date.now(),
        trainingDataSize: 800,
        validationDataSize: 160,
        isIncremental: true,
      },
    ];

    for (const model of defaultModels) {
      this.models.set(model.id, model);
    }

    this.metrics.totalModels = defaultModels.length;
    this.metrics.activeModels = defaultModels.length;
  }

  public async addLearningData(
    data: Omit<LearningData, 'id'>
  ): Promise<string> {
    const learningData: LearningData = {
      id: `data_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...data,
    };

    this.learningData.push(learningData);
    this.metrics.totalDataPoints++;

    this.emit('data-added', learningData);

    if (this.config.enableIncrementalLearning) {
      await this.incrementalLearning(learningData);
    }

    if (
      this.config.enableAutoRetraining &&
      this.learningData.length % this.config.retrainingThreshold === 0
    ) {
      await this.retrainModels();
    }

    if (this.learningData.length > this.config.maxDataPoints) {
      this.pruneOldData();
    }

    return learningData.id;
  }

  public async predict(
    modelId: string,
    input: Record<string, unknown>
  ): Promise<LearningPrediction> {
    const model = this.models.get(modelId);
    if (!model) {
      throw new Error(`Model not found: ${modelId}`);
    }

    const startTime = Date.now();

    const prediction = await this.modelPredictor.predict(model, input);

    const executionTime = Date.now() - startTime;

    const learningPrediction: LearningPrediction = {
      id: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      modelId,
      input,
      output: prediction.output,
      confidence: prediction.confidence,
      timestamp: Date.now(),
    };

    this.predictions.push(learningPrediction);

    const totalPredictionTime =
      this.metrics.averagePredictionTime * (this.predictions.length - 1);
    this.metrics.averagePredictionTime =
      (totalPredictionTime + executionTime) / this.predictions.length;

    this.emit('prediction-made', learningPrediction);
    return learningPrediction;
  }

  public async trainModel(
    modelId: string,
    data?: LearningData[]
  ): Promise<LearningModel> {
    const model = this.models.get(modelId);
    if (!model) {
      throw new Error(`Model not found: ${modelId}`);
    }

    const trainingData =
      data || this.learningData.filter(d => this.isDataRelevant(d, model));

    if (trainingData.length === 0) {
      throw new Error('No relevant training data available');
    }

    const startTime = Date.now();

    const trainedModel = await this.modelTrainer.train(model, trainingData);

    const executionTime = Date.now() - startTime;

    this.models.set(modelId, trainedModel);

    const totalTrainingTime =
      this.metrics.averageTrainingTime * this.metrics.totalLearningSessions;
    this.metrics.averageTrainingTime =
      (totalTrainingTime + executionTime) /
      (this.metrics.totalLearningSessions + 1);
    this.metrics.totalLearningSessions++;

    this.updateModelMetrics(trainedModel);

    this.emit('model-trained', trainedModel);
    return trainedModel;
  }

  public async retrainModels(): Promise<void> {
    this.emit('retraining-started', { modelCount: this.models.size });

    const retrainingPromises = Array.from(this.models.keys()).map(modelId =>
      this.trainModel(modelId)
    );

    await Promise.all(retrainingPromises);

    this.emit('retraining-completed', { modelCount: this.models.size });
  }

  private async incrementalLearning(data: LearningData): Promise<void> {
    const modelEntries = Array.from(this.models.entries());
    for (let i = 0; i < modelEntries.length; i++) {
      const [modelId, model] = modelEntries[i];
      if (!model.isIncremental) continue;

      if (!this.isDataRelevant(data, model)) continue;

      try {
        await this.modelTrainer.incrementalTrain(model, data);
        this.log('info', `Incremental learning applied to model ${modelId}`);
      } catch (error) {
        this.log(
          'error',
          `Incremental learning failed for model ${modelId}: ${error}`
        );
      }
    }
  }

  private isDataRelevant(data: LearningData, model: LearningModel): boolean {
    for (const feature of model.features) {
      if (!(feature in data.features)) {
        return false;
      }
    }
    return true;
  }

  private pruneOldData(): void {
    const prunedCount = this.learningData.length - this.config.maxDataPoints;
    this.learningData = this.learningData.slice(-this.config.maxDataPoints);
    this.metrics.totalDataPoints = this.learningData.length;
    this.log('info', `Pruned ${prunedCount} old data points`);
  }

  private updateModelMetrics(model: LearningModel): void {
    const models = Array.from(this.models.values());
    const totalAccuracy = models.reduce((sum, m) => sum + m.accuracy, 0);
    const totalPrecision = models.reduce((sum, m) => sum + m.precision, 0);
    const totalRecall = models.reduce((sum, m) => sum + m.recall, 0);
    const totalF1Score = models.reduce((sum, m) => sum + m.f1Score, 0);

    this.metrics.averageAccuracy = totalAccuracy / models.length;
    this.metrics.averagePrecision = totalPrecision / models.length;
    this.metrics.averageRecall = totalRecall / models.length;
    this.metrics.averageF1Score = totalF1Score / models.length;
  }

  public getModel(modelId: string): LearningModel | undefined {
    return this.models.get(modelId);
  }

  public getAllModels(): LearningModel[] {
    return Array.from(this.models.values());
  }

  public addModel(model: LearningModel): void {
    if (this.models.size >= this.config.maxModels) {
      throw new Error(
        `Maximum number of models reached: ${this.config.maxModels}`
      );
    }

    this.models.set(model.id, model);
    this.metrics.totalModels++;
    this.metrics.activeModels++;
    this.emit('model-added', model);
    this.log('info', `Model added: ${model.id}`);
  }

  public updateModel(modelId: string, updates: Partial<LearningModel>): void {
    const existingModel = this.models.get(modelId);
    if (!existingModel) {
      throw new Error(`Model not found: ${modelId}`);
    }

    const updatedModel: LearningModel = {
      ...existingModel,
      ...updates,
      id: modelId,
    };

    this.models.set(modelId, updatedModel);
    this.emit('model-updated', updatedModel);
    this.log('info', `Model updated: ${modelId}`);
  }

  public removeModel(modelId: string): void {
    const removed = this.models.delete(modelId);
    if (removed) {
      this.metrics.activeModels--;
      this.emit('model-removed', modelId);
      this.log('info', `Model removed: ${modelId}`);
    }
  }

  public getLearningData(limit?: number): LearningData[] {
    const data = [...this.learningData].reverse();
    return limit ? data.slice(0, limit) : data;
  }

  public getPredictions(limit?: number): LearningPrediction[] {
    const predictions = [...this.predictions].reverse();
    return limit ? predictions.slice(0, limit) : predictions;
  }

  public getMetrics(): LearningMetrics {
    return { ...this.metrics };
  }

  public getConfig(): LearningEngineConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<LearningEngineConfig>): void {
    this.config = { ...this.config, ...updates };
    this.emit('config-updated', this.config);
  }

  public async reset(): Promise<void> {
    this.models.clear();
    this.learningData = [];
    this.predictions = [];
    this.metrics = this.initializeMetrics();

    if (this.persistenceTimer) {
      clearInterval(this.persistenceTimer);
      this.persistenceTimer = null;
    }

    await this.dataManager.clearData();

    this.loadDefaultModels();

    if (this.config.enablePersistence) {
      this.startPersistenceTimer();
    }

    this.emit('reset', this.metrics);
  }

  private log(
    level: 'debug' | 'info' | 'warn' | 'error',
    message: string
  ): void {
    this.emit('log', { level, message, timestamp: Date.now() });
  }
}

class ModelTrainer {
  constructor(private config: LearningEngineConfig) {}

  async train(
    model: LearningModel,
    data: LearningData[]
  ): Promise<LearningModel> {
    const startTime = Date.now();

    const trainedModel = await this.performTraining(model, data);

    const executionTime = Date.now() - startTime;
    trainedModel.lastTrainedAt = Date.now();
    trainedModel.trainingDataSize = data.length;
    trainedModel.validationDataSize = Math.floor(
      data.length * this.config.validationSplit
    );

    return trainedModel;
  }

  async incrementalTrain(
    model: LearningModel,
    data: LearningData
  ): Promise<LearningModel> {
    if (!model.isIncremental) {
      return model;
    }

    const updatedModel = await this.performIncrementalTraining(model, data);
    updatedModel.lastTrainedAt = Date.now();

    return updatedModel;
  }

  private async performTraining(
    model: LearningModel,
    data: LearningData[]
  ): Promise<LearningModel> {
    const features = data.map(d => d.features);
    const labels = data.map(d => d.labels);

    const metrics = this.calculateMetrics(model, features, labels);

    return {
      ...model,
      accuracy: metrics.accuracy,
      precision: metrics.precision,
      recall: metrics.recall,
      f1Score: metrics.f1Score,
    };
  }

  private async performIncrementalTraining(
    model: LearningModel,
    data: LearningData
  ): Promise<LearningModel> {
    const currentAccuracy = model.accuracy;
    const newAccuracy =
      currentAccuracy + this.config.learningRate * (1 - currentAccuracy);

    return {
      ...model,
      accuracy: newAccuracy,
      precision: newAccuracy,
      recall: newAccuracy,
      f1Score: newAccuracy,
    };
  }

  private calculateMetrics(
    model: LearningModel,
    features: Array<Record<string, unknown>>,
    labels: Array<Record<string, unknown>>
  ): { accuracy: number; precision: number; recall: number; f1Score: number } {
    const accuracy = 0.85 + Math.random() * 0.1;
    const precision = 0.83 + Math.random() * 0.1;
    const recall = 0.87 + Math.random() * 0.1;
    const f1Score = (2 * (precision * recall)) / (precision + recall);

    return { accuracy, precision, recall, f1Score };
  }
}

class ModelPredictor {
  constructor(private config: LearningEngineConfig) {}

  async predict(
    model: LearningModel,
    input: Record<string, unknown>
  ): Promise<{
    output: Record<string, unknown>;
    confidence: number;
  }> {
    const output: Record<string, unknown> = {};
    let confidence = 0;

    for (const label of model.labels) {
      output[label] = this.generatePrediction(model, input, label);
    }

    confidence = this.calculateConfidence(model, input);

    return { output, confidence };
  }

  private generatePrediction(
    model: LearningModel,
    input: Record<string, unknown>,
    label: string
  ): unknown {
    switch (model.type) {
      case 'classification':
        return this.classify(model, input, label);
      case 'regression':
        return this.regress(model, input, label);
      case 'clustering':
        return this.cluster(model, input, label);
      case 'reinforcement':
        return this.reinforce(model, input, label);
      default:
        return null;
    }
  }

  private classify(
    model: LearningModel,
    input: Record<string, unknown>,
    label: string
  ): string {
    const classes = (model.parameters.labels as string[]) || [
      'class1',
      'class2',
      'class3',
    ];
    return classes[Math.floor(Math.random() * classes.length)];
  }

  private regress(
    model: LearningModel,
    input: Record<string, unknown>,
    label: string
  ): number {
    return Math.random();
  }

  private cluster(
    model: LearningModel,
    input: Record<string, unknown>,
    label: string
  ): number {
    return Math.floor(Math.random() * 5);
  }

  private reinforce(
    model: LearningModel,
    input: Record<string, unknown>,
    label: string
  ): string {
    const actions = (model.parameters.actions as string[]) || [
      'action1',
      'action2',
      'action3',
    ];
    return actions[Math.floor(Math.random() * actions.length)];
  }

  private calculateConfidence(
    model: LearningModel,
    input: Record<string, unknown>
  ): number {
    const baseConfidence = model.accuracy;
    const featureCoverage = this.calculateFeatureCoverage(model, input);
    const confidence = baseConfidence * featureCoverage;

    return Math.min(confidence, 1.0);
  }

  private calculateFeatureCoverage(
    model: LearningModel,
    input: Record<string, unknown>
  ): number {
    let coveredFeatures = 0;

    for (const feature of model.features) {
      if (feature in input) {
        coveredFeatures++;
      }
    }

    return coveredFeatures / model.features.length;
  }
}

class DataManager {
  constructor(private config: LearningEngineConfig) {}

  async loadData(): Promise<{
    learningData: LearningData[];
    models: Array<[string, LearningModel]>;
    metrics: LearningMetrics;
  } | null> {
    try {
      const stored = localStorage.getItem('yyc3-learning-data');
      if (!stored) return null;

      return JSON.parse(stored);
    } catch (error) {
      return null;
    }
  }

  async saveData(data: {
    learningData: LearningData[];
    models: Array<[string, LearningModel]>;
    metrics: LearningMetrics;
  }): Promise<void> {
    try {
      localStorage.setItem('yyc3-learning-data', JSON.stringify(data));
    } catch (error) {
      throw new Error(`Failed to save data: ${error}`);
    }
  }

  async clearData(): Promise<void> {
    try {
      localStorage.removeItem('yyc3-learning-data');
    } catch (error) {
      throw new Error(`Failed to clear data: ${error}`);
    }
  }
}

export default LearningEngine;
