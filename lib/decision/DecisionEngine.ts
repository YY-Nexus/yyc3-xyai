/**
 * @file DecisionEngine.ts
 * @description YYC³ AI浮窗系统智能决策引擎 - 基于多因素分析的决策模型
 * @module lib/decision
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-20
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { EventEmitter } from 'events';
import { RuleEngine, type RuleContext, type RuleExecutionResult } from '../rules/RuleEngine';

export interface DecisionFactor {
  id: string;
  name: string;
  description: string;
  category: 'environment' | 'user' | 'system' | 'historical' | 'predictive';
  weight: number;
  value: number;
  normalizedValue: number;
  confidence: number;
  timestamp: number;
}

export interface DecisionFeature {
  id: string;
  name: string;
  factors: DecisionFactor[];
  aggregatedValue: number;
  confidence: number;
  timestamp: number;
}

export interface DecisionModel {
  id: string;
  name: string;
  description: string;
  version: string;
  features: DecisionFeature[];
  weights: Map<string, number>;
  threshold: number;
  accuracy: number;
  lastTrainedAt: number;
  trainingDataSize: number;
}

export interface DecisionContext {
  timestamp: number;
  environment: Record<string, unknown>;
  user: Record<string, unknown>;
  system: Record<string, unknown>;
  historical: Array<{ timestamp: number; data: Record<string, unknown> }>;
  predictive: Record<string, unknown>;
}

export interface DecisionOption {
  id: string;
  name: string;
  description: string;
  type: 'adaptation' | 'optimization' | 'recommendation' | 'action';
  parameters: Record<string, unknown>;
  expectedImpact: DecisionImpact;
  confidence: number;
  priority: number;
}

export interface DecisionImpact {
  performance: number;
  userExperience: number;
  resourceUsage: number;
  cost: number;
  reliability: number;
  overall: number;
}

export interface DecisionResult {
  id: string;
  context: DecisionContext;
  features: DecisionFeature[];
  options: DecisionOption[];
  selectedOption: DecisionOption;
  confidence: number;
  reasoning: string[];
  alternatives: DecisionOption[];
  timestamp: number;
  executionTime: number;
}

export interface DecisionMetrics {
  totalDecisions: number;
  successfulDecisions: number;
  failedDecisions: number;
  averageConfidence: number;
  averageExecutionTime: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export interface DecisionEngineConfig {
  maxFeatures: number;
  maxOptions: number;
  minConfidence: number;
  enableLearning: boolean;
  enablePrediction: boolean;
  enableOptimization: boolean;
  learningRate: number;
  predictionHorizon: number;
  optimizationIterations: number;
}

export class DecisionEngine extends EventEmitter {
  private static instance: DecisionEngine;
  private ruleEngine: RuleEngine;
  private models: Map<string, DecisionModel> = new Map();
  private decisionHistory: Array<{ timestamp: number; result: DecisionResult }> = [];
  private metrics: DecisionMetrics;
  private config: DecisionEngineConfig;
  private featureExtractor: FeatureExtractor;
  private weightOptimizer: WeightOptimizer;
  private decisionSelector: DecisionSelector;

  private constructor(config?: Partial<DecisionEngineConfig>) {
    super();
    this.ruleEngine = RuleEngine.getInstance();
    this.config = this.initializeConfig(config);
    this.featureExtractor = new FeatureExtractor(this.config);
    this.weightOptimizer = new WeightOptimizer(this.config);
    this.decisionSelector = new DecisionSelector(this.config);
    this.metrics = this.initializeMetrics();
    this.initialize();
  }

  static getInstance(config?: Partial<DecisionEngineConfig>): DecisionEngine {
    if (!DecisionEngine.instance) {
      DecisionEngine.instance = new DecisionEngine(config);
    }
    return DecisionEngine.instance;
  }

  private initializeConfig(config?: Partial<DecisionEngineConfig>): DecisionEngineConfig {
    return {
      maxFeatures: 10,
      maxOptions: 5,
      minConfidence: 0.7,
      enableLearning: true,
      enablePrediction: true,
      enableOptimization: true,
      learningRate: 0.01,
      predictionHorizon: 3600000,
      optimizationIterations: 100,
      ...config,
    };
  }

  private initializeMetrics(): DecisionMetrics {
    return {
      totalDecisions: 0,
      successfulDecisions: 0,
      failedDecisions: 0,
      averageConfidence: 0,
      averageExecutionTime: 0,
      accuracy: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
    };
  }

  private async initialize(): Promise<void> {
    this.loadDefaultModels();
    this.emit('initialized', this.getMetrics());
  }

  private loadDefaultModels(): void {
    const defaultModel: DecisionModel = {
      id: 'model-default',
      name: 'Default Decision Model',
      description: 'Default multi-factor decision model',
      version: '1.0.0',
      features: [],
      weights: new Map([
        ['performance', 0.25],
        ['userExperience', 0.30],
        ['resourceUsage', 0.20],
        ['cost', 0.15],
        ['reliability', 0.10],
      ]),
      threshold: 0.7,
      accuracy: 0.85,
      lastTrainedAt: Date.now(),
      trainingDataSize: 1000,
    };

    this.models.set(defaultModel.id, defaultModel);
  }

  public async decide(context: DecisionContext): Promise<DecisionResult> {
    const startTime = Date.now();

    this.emit('decision-started', { context, timestamp: startTime });

    try {
      const features = await this.extractFeatures(context);
      const options = await this.generateOptions(context, features);
      const selectedOption = await this.selectOption(features, options);

      const result: DecisionResult = {
        id: `decision_${Date.now()}`,
        context,
        features,
        options,
        selectedOption,
        confidence: selectedOption.confidence,
        reasoning: this.generateReasoning(features, selectedOption),
        alternatives: options.filter(o => o.id !== selectedOption.id),
        timestamp: Date.now(),
        executionTime: Date.now() - startTime,
      };

      this.decisionHistory.push({ timestamp: Date.now(), result });
      this.updateMetrics(result);

      if (this.config.enableLearning) {
        await this.learnFromResult(result);
      }

      this.emit('decision-completed', result);
      return result;
    } catch (error) {
      this.metrics.failedDecisions++;
      this.emit('decision-failed', { context, error });
      throw error;
    }
  }

  private async extractFeatures(context: DecisionContext): Promise<DecisionFeature[]> {
    const factors = await this.featureExtractor.extract(context);
    const features: DecisionFeature[] = [];

    const featureGroups = this.groupFactorsByCategory(factors);

    for (const [category, categoryFactors] of featureGroups.entries()) {
      const aggregatedValue = this.aggregateFactors(categoryFactors);
      const confidence = this.calculateFeatureConfidence(categoryFactors);

      features.push({
        id: `feature_${category}`,
        name: this.capitalizeFirstLetter(category),
        factors: categoryFactors,
        aggregatedValue,
        confidence,
        timestamp: Date.now(),
      });
    }

    return features.slice(0, this.config.maxFeatures);
  }

  private groupFactorsByCategory(factors: DecisionFactor[]): Map<string, DecisionFactor[]> {
    const groups = new Map<string, DecisionFactor[]>();

    for (const factor of factors) {
      if (!groups.has(factor.category)) {
        groups.set(factor.category, []);
      }
      groups.get(factor.category)!.push(factor);
    }

    return groups;
  }

  private aggregateFactors(factors: DecisionFactor[]): number {
    if (factors.length === 0) return 0;

    const weightedSum = factors.reduce((sum, factor) => {
      return sum + factor.normalizedValue * factor.weight;
    }, 0);

    const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0);

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  private calculateFeatureConfidence(factors: DecisionFactor[]): number {
    if (factors.length === 0) return 0;

    const avgConfidence = factors.reduce((sum, factor) => sum + factor.confidence, 0) / factors.length;
    return avgConfidence;
  }

  private async generateOptions(context: DecisionContext, features: DecisionFeature[]): Promise<DecisionOption[]> {
    const options: DecisionOption[] = [];

    const ruleResults = await this.ruleEngine.execute({
      timestamp: context.timestamp,
      environment: context.environment,
      user: context.user,
      system: context.system,
      history: context.historical,
    });

    for (const ruleResult of ruleResults) {
      if (!ruleResult.success) continue;

      const rule = this.ruleEngine.getRule(ruleResult.ruleId);
      if (!rule) continue;

      for (const action of rule.actions) {
        const option = await this.createOptionFromAction(action, features);
        if (option) {
          options.push(option);
        }
      }
    }

    if (this.config.enableOptimization) {
      const optimizedOptions = await this.optimizeOptions(options, features);
      options.push(...optimizedOptions);
    }

    return options.slice(0, this.config.maxOptions);
  }

  private async createOptionFromAction(action: any, features: DecisionFeature[]): Promise<DecisionOption | null> {
    const impact = await this.estimateImpact(action, features);
    const confidence = this.calculateOptionConfidence(action, features, impact);

    return {
      id: `option_${action.id}_${Date.now()}`,
      name: action.type,
      description: `Action: ${action.type}`,
      type: 'adaptation',
      parameters: action.parameters,
      expectedImpact: impact,
      confidence,
      priority: action.priority || 5,
    };
  }

  private async estimateImpact(action: any, features: DecisionFeature[]): Promise<DecisionImpact> {
    const performance = this.estimatePerformanceImpact(action, features);
    const userExperience = this.estimateUserExperienceImpact(action, features);
    const resourceUsage = this.estimateResourceUsageImpact(action, features);
    const cost = this.estimateCostImpact(action, features);
    const reliability = this.estimateReliabilityImpact(action, features);

    const overall = (
      performance * 0.25 +
      userExperience * 0.30 +
      resourceUsage * 0.20 +
      cost * 0.15 +
      reliability * 0.10
    );

    return {
      performance,
      userExperience,
      resourceUsage,
      cost,
      reliability,
      overall,
    };
  }

  private estimatePerformanceImpact(action: any, features: DecisionFeature[]): number {
    const performanceFeature = features.find(f => f.id === 'feature_environment');
    if (!performanceFeature) return 0.5;

    const networkFactor = performanceFeature.factors.find(f => f.id === 'factor_network_speed');
    if (!networkFactor) return 0.5;

    if (action.type === 'performance-optimization' && networkFactor.value < 0.5) {
      return 0.8;
    }

    return 0.5;
  }

  private estimateUserExperienceImpact(action: any, features: DecisionFeature[]): number {
    const userFeature = features.find(f => f.id === 'feature_user');
    if (!userFeature) return 0.5;

    if (action.type === 'ui-adjustment') {
      return 0.8;
    }

    return 0.5;
  }

  private estimateResourceUsageImpact(action: any, features: DecisionFeature[]): number {
    const systemFeature = features.find(f => f.id === 'feature_system');
    if (!systemFeature) return 0.5;

    if (action.type === 'resource-allocation') {
      return 0.7;
    }

    return 0.5;
  }

  private estimateCostImpact(action: any, features: DecisionFeature[]): number {
    return 0.5;
  }

  private estimateReliabilityImpact(action: any, features: DecisionFeature[]): number {
    return 0.8;
  }

  private calculateOptionConfidence(action: any, features: DecisionFeature[], impact: DecisionImpact): number {
    const featureConfidence = features.reduce((sum, f) => sum + f.confidence, 0) / features.length;
    const impactConfidence = impact.overall;

    return (featureConfidence + impactConfidence) / 2;
  }

  private async optimizeOptions(options: DecisionOption[], features: DecisionFeature[]): Promise<DecisionOption[]> {
    const optimizedOptions: DecisionOption[] = [];

    for (let i = 0; i < this.config.optimizationIterations; i++) {
      for (const option of options) {
        const optimized = await this.weightOptimizer.optimize(option, features);
        if (optimized.confidence > option.confidence) {
          optimizedOptions.push(optimized);
        }
      }
    }

    return optimizedOptions;
  }

  private async selectOption(features: DecisionFeature[], options: DecisionOption[]): Promise<DecisionOption> {
    return this.decisionSelector.select(features, options, this.config.minConfidence);
  }

  private generateReasoning(features: DecisionFeature[], selectedOption: DecisionOption): string[] {
    const reasoning: string[] = [];

    reasoning.push(`Selected option: ${selectedOption.name} (confidence: ${(selectedOption.confidence * 100).toFixed(1)}%)`);

    const topFeatures = features
      .sort((a, b) => b.aggregatedValue - a.aggregatedValue)
      .slice(0, 3);

    for (const feature of topFeatures) {
      reasoning.push(`${feature.name}: ${feature.aggregatedValue.toFixed(2)} (confidence: ${(feature.confidence * 100).toFixed(1)}%)`);
    }

    reasoning.push(`Expected impact - Performance: ${(selectedOption.expectedImpact.performance * 100).toFixed(1)}%, ` +
                  `User Experience: ${(selectedOption.expectedImpact.userExperience * 100).toFixed(1)}%, ` +
                  `Resource Usage: ${(selectedOption.expectedImpact.resourceUsage * 100).toFixed(1)}%`);

    return reasoning;
  }

  private async learnFromResult(result: DecisionResult): Promise<void> {
    const model = this.models.get('model-default');
    if (!model) return;

    const feedback = await this.collectFeedback(result);
    if (feedback) {
      await this.updateModel(model, feedback);
    }
  }

  private async collectFeedback(result: DecisionResult): Promise<{ success: boolean; impact: DecisionImpact } | null> {
    return {
      success: result.confidence >= this.config.minConfidence,
      impact: result.selectedOption.expectedImpact,
    };
  }

  private async updateModel(model: DecisionModel, feedback: { success: boolean; impact: DecisionImpact }): Promise<void> {
    if (feedback.success) {
      model.accuracy = model.accuracy * (1 - this.config.learningRate) + 1 * this.config.learningRate;
    } else {
      model.accuracy = model.accuracy * (1 - this.config.learningRate) + 0 * this.config.learningRate;
    }

    model.lastTrainedAt = Date.now();
    model.trainingDataSize++;

    this.emit('model-updated', model);
  }

  private updateMetrics(result: DecisionResult): void {
    this.metrics.totalDecisions++;
    this.metrics.successfulDecisions++;

    const totalConfidence = this.metrics.averageConfidence * (this.metrics.totalDecisions - 1);
    this.metrics.averageConfidence = (totalConfidence + result.confidence) / this.metrics.totalDecisions;

    const totalExecutionTime = this.metrics.averageExecutionTime * (this.metrics.totalDecisions - 1);
    this.metrics.averageExecutionTime = (totalExecutionTime + result.executionTime) / this.metrics.totalDecisions;

    this.metrics.accuracy = this.metrics.successfulDecisions / this.metrics.totalDecisions;
  }

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  public getModel(modelId: string): DecisionModel | undefined {
    return this.models.get(modelId);
  }

  public getAllModels(): DecisionModel[] {
    return Array.from(this.models.values());
  }

  public addModel(model: DecisionModel): void {
    this.models.set(model.id, model);
    this.emit('model-added', model);
  }

  public updateModel(modelId: string, updates: Partial<DecisionModel>): void {
    const existingModel = this.models.get(modelId);
    if (!existingModel) {
      throw new Error(`Model not found: ${modelId}`);
    }

    const updatedModel: DecisionModel = {
      ...existingModel,
      ...updates,
      id: modelId,
    };

    this.models.set(modelId, updatedModel);
    this.emit('model-updated', updatedModel);
  }

  public removeModel(modelId: string): void {
    const removed = this.models.delete(modelId);
    if (removed) {
      this.emit('model-removed', modelId);
    }
  }

  public getMetrics(): DecisionMetrics {
    return { ...this.metrics };
  }

  public getDecisionHistory(limit?: number): Array<{ timestamp: number; result: DecisionResult }> {
    const history = [...this.decisionHistory].reverse();
    return limit ? history.slice(0, limit) : history;
  }

  public getConfig(): DecisionEngineConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<DecisionEngineConfig>): void {
    this.config = { ...this.config, ...updates };
    this.emit('config-updated', this.config);
  }

  public async reset(): Promise<void> {
    this.models.clear();
    this.decisionHistory = [];
    this.metrics = this.initializeMetrics();
    this.loadDefaultModels();
    this.emit('reset', this.getMetrics());
  }
}

class FeatureExtractor {
  constructor(private config: DecisionEngineConfig) {}

  async extract(context: DecisionContext): Promise<DecisionFactor[]> {
    const factors: DecisionFactor[] = [];

    factors.push(...this.extractEnvironmentFactors(context));
    factors.push(...this.extractUserFactors(context));
    factors.push(...this.extractSystemFactors(context));
    factors.push(...this.extractHistoricalFactors(context));

    if (this.config.enablePrediction) {
      factors.push(...this.extractPredictiveFactors(context));
    }

    return factors;
  }

  private extractEnvironmentFactors(context: DecisionContext): DecisionFactor[] {
    const factors: DecisionFactor[] = [];
    const env = context.environment;

    factors.push({
      id: 'factor_device_type',
      name: 'Device Type',
      description: 'Type of device being used',
      category: 'environment',
      weight: 0.2,
      value: this.normalizeDeviceType(env.device as any),
      normalizedValue: this.normalizeDeviceType(env.device as any),
      confidence: 1.0,
      timestamp: Date.now(),
    });

    factors.push({
      id: 'factor_network_speed',
      name: 'Network Speed',
      description: 'Network connection speed',
      category: 'environment',
      weight: 0.3,
      value: this.normalizeNetworkSpeed(env.network as any),
      normalizedValue: this.normalizeNetworkSpeed(env.network as any),
      confidence: 0.9,
      timestamp: Date.now(),
    });

    factors.push({
      id: 'factor_battery_level',
      name: 'Battery Level',
      description: 'Current battery level',
      category: 'environment',
      weight: 0.25,
      value: (env.device as any)?.battery?.level || 1,
      normalizedValue: (env.device as any)?.battery?.level || 1,
      confidence: 0.95,
      timestamp: Date.now(),
    });

    factors.push({
      id: 'factor_time_context',
      name: 'Time Context',
      description: 'Current time context',
      category: 'environment',
      weight: 0.25,
      value: this.normalizeTimeContext(env.time as any),
      normalizedValue: this.normalizeTimeContext(env.time as any),
      confidence: 1.0,
      timestamp: Date.now(),
    });

    return factors;
  }

  private extractUserFactors(context: DecisionContext): DecisionFactor[] {
    const factors: DecisionFactor[] = [];
    const user = context.user;

    factors.push({
      id: 'factor_user_activity',
      name: 'User Activity',
      description: 'Current user activity level',
      category: 'user',
      weight: 0.4,
      value: this.normalizeUserActivity(user.activity as any),
      normalizedValue: this.normalizeUserActivity(user.activity as any),
      confidence: 0.9,
      timestamp: Date.now(),
    });

    factors.push({
      id: 'factor_user_preferences',
      name: 'User Preferences',
      description: 'User preference settings',
      category: 'user',
      weight: 0.3,
      value: this.normalizeUserPreferences(user.preferences as any),
      normalizedValue: this.normalizeUserPreferences(user.preferences as any),
      confidence: 0.85,
      timestamp: Date.now(),
    });

    factors.push({
      id: 'factor_user_context',
      name: 'User Context',
      description: 'Current user context',
      category: 'user',
      weight: 0.3,
      value: this.normalizeUserContext(user.context as any),
      normalizedValue: this.normalizeUserContext(user.context as any),
      confidence: 0.8,
      timestamp: Date.now(),
    });

    return factors;
  }

  private extractSystemFactors(context: DecisionContext): DecisionFactor[] {
    const factors: DecisionFactor[] = [];
    const system = context.system;

    factors.push({
      id: 'factor_system_load',
      name: 'System Load',
      description: 'Current system load',
      category: 'system',
      weight: 0.4,
      value: this.normalizeSystemLoad(system.load as any),
      normalizedValue: this.normalizeSystemLoad(system.load as any),
      confidence: 0.95,
      timestamp: Date.now(),
    });

    factors.push({
      id: 'factor_memory_usage',
      name: 'Memory Usage',
      description: 'Current memory usage',
      category: 'system',
      weight: 0.3,
      value: this.normalizeMemoryUsage(system.memoryUsage as any),
      normalizedValue: this.normalizeMemoryUsage(system.memoryUsage as any),
      confidence: 0.9,
      timestamp: Date.now(),
    });

    factors.push({
      id: 'factor_performance_mode',
      name: 'Performance Mode',
      description: 'Current performance mode',
      category: 'system',
      weight: 0.3,
      value: this.normalizePerformanceMode(system.performanceMode as any),
      normalizedValue: this.normalizePerformanceMode(system.performanceMode as any),
      confidence: 1.0,
      timestamp: Date.now(),
    });

    return factors;
  }

  private extractHistoricalFactors(context: DecisionContext): DecisionFactor[] {
    const factors: DecisionFactor[] = [];
    const history = context.historical;

    if (history.length > 0) {
      const recentHistory = history.slice(-10);

      factors.push({
        id: 'factor_historical_patterns',
        name: 'Historical Patterns',
        description: 'Patterns from historical data',
        category: 'historical',
        weight: 0.5,
        value: this.analyzeHistoricalPatterns(recentHistory),
        normalizedValue: this.analyzeHistoricalPatterns(recentHistory),
        confidence: 0.8,
        timestamp: Date.now(),
      });

      factors.push({
        id: 'factor_trend_analysis',
        name: 'Trend Analysis',
        description: 'Trend from historical data',
        category: 'historical',
        weight: 0.5,
        value: this.analyzeTrends(recentHistory),
        normalizedValue: this.analyzeTrends(recentHistory),
        confidence: 0.75,
        timestamp: Date.now(),
      });
    }

    return factors;
  }

  private extractPredictiveFactors(context: DecisionContext): DecisionFactor[] {
    const factors: DecisionFactor[] = [];
    const predictive = context.predictive;

    factors.push({
      id: 'factor_predicted_load',
      name: 'Predicted Load',
      description: 'Predicted system load',
      category: 'predictive',
      weight: 0.4,
      value: this.normalizePredictedLoad(predictive.load as any),
      normalizedValue: this.normalizePredictedLoad(predictive.load as any),
      confidence: 0.7,
      timestamp: Date.now(),
    });

    factors.push({
      id: 'factor_predicted_user_activity',
      name: 'Predicted User Activity',
      description: 'Predicted user activity',
      category: 'predictive',
      weight: 0.3,
      value: this.normalizePredictedUserActivity(predictive.userActivity as any),
      normalizedValue: this.normalizePredictedUserActivity(predictive.userActivity as any),
      confidence: 0.65,
      timestamp: Date.now(),
    });

    factors.push({
      id: 'factor_predicted_resource_demand',
      name: 'Predicted Resource Demand',
      description: 'Predicted resource demand',
      category: 'predictive',
      weight: 0.3,
      value: this.normalizePredictedResourceDemand(predictive.resourceDemand as any),
      normalizedValue: this.normalizePredictedResourceDemand(predictive.resourceDemand as any),
      confidence: 0.6,
      timestamp: Date.now(),
    });

    return factors;
  }

  private normalizeDeviceType(device: any): number {
    if (!device) return 0.5;
    switch (device.type) {
      case 'mobile':
        return 0.3;
      case 'tablet':
        return 0.5;
      case 'desktop':
        return 0.8;
      default:
        return 0.5;
    }
  }

  private normalizeNetworkSpeed(network: any): number {
    if (!network) return 0.5;
    switch (network.speed) {
      case 'slow':
        return 0.2;
      case 'medium':
        return 0.5;
      case 'fast':
        return 0.8;
      default:
        return 0.5;
    }
  }

  private normalizeTimeContext(time: any): number {
    if (!time) return 0.5;
    return time.isWorkHours ? 0.8 : 0.4;
  }

  private normalizeUserActivity(activity: any): number {
    if (!activity) return 0.5;
    switch (activity) {
      case 'active':
        return 0.9;
      case 'idle':
        return 0.4;
      case 'away':
        return 0.2;
      default:
        return 0.5;
    }
  }

  private normalizeUserPreferences(preferences: any): number {
    if (!preferences) return 0.5;
    return 0.7;
  }

  private normalizeUserContext(context: any): number {
    if (!context) return 0.5;
    return 0.6;
  }

  private normalizeSystemLoad(load: any): number {
    if (typeof load !== 'number') return 0.5;
    return 1 - load;
  }

  private normalizeMemoryUsage(usage: any): number {
    if (typeof usage !== 'number') return 0.5;
    return 1 - usage;
  }

  private normalizePerformanceMode(mode: any): number {
    if (!mode) return 0.5;
    switch (mode) {
      case 'performance':
        return 0.9;
      case 'balanced':
        return 0.6;
      case 'power-saving':
        return 0.3;
      default:
        return 0.5;
    }
  }

  private analyzeHistoricalPatterns(history: Array<{ timestamp: number; data: Record<string, unknown> }>): number {
    if (history.length === 0) return 0.5;
    return 0.6;
  }

  private analyzeTrends(history: Array<{ timestamp: number; data: Record<string, unknown> }>): number {
    if (history.length === 0) return 0.5;
    return 0.55;
  }

  private normalizePredictedLoad(load: any): number {
    if (typeof load !== 'number') return 0.5;
    return 1 - load;
  }

  private normalizePredictedUserActivity(activity: any): number {
    if (typeof activity !== 'number') return 0.5;
    return activity;
  }

  private normalizePredictedResourceDemand(demand: any): number {
    if (typeof demand !== 'number') return 0.5;
    return 1 - demand;
  }
}

class WeightOptimizer {
  constructor(private config: DecisionEngineConfig) {}

  async optimize(option: DecisionOption, features: DecisionFeature[]): Promise<DecisionOption> {
    const optimized = { ...option };

    for (const feature of features) {
      if (feature.aggregatedValue > 0.7 && feature.confidence > 0.8) {
        optimized.confidence = Math.min(optimized.confidence + 0.05, 1.0);
      }
    }

    return optimized;
  }
}

class DecisionSelector {
  constructor(private config: DecisionEngineConfig) {}

  select(features: DecisionFeature[], options: DecisionOption[], minConfidence: number): DecisionOption {
    const validOptions = options.filter(o => o.confidence >= minConfidence);

    if (validOptions.length === 0) {
      return options.reduce((best, current) =>
        current.confidence > best.confidence ? current : best
      );
    }

    const scoredOptions = validOptions.map(option => ({
      option,
      score: this.calculateScore(option, features),
    }));

    scoredOptions.sort((a, b) => b.score - a.score);

    return scoredOptions[0].option;
  }

  private calculateScore(option: DecisionOption, features: DecisionFeature[]): number {
    const confidenceScore = option.confidence * 0.4;
    const impactScore = option.expectedImpact.overall * 0.3;
    const priorityScore = (option.priority / 10) * 0.2;
    const featureScore = features.reduce((sum, f) => sum + f.aggregatedValue * f.confidence, 0) / features.length * 0.1;

    return confidenceScore + impactScore + priorityScore + featureScore;
  }
}

export default DecisionEngine;
