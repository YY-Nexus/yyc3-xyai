/**
 * @file EnhancedDecisionEngine.ts
 * @description YYC³ AI浮窗系统增强智能决策引擎 - 集成学习与多模型融合
 * @module lib/decision
 * @author YYC³
 * @version 2.0.0
 * @created 2026-01-20
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { EventEmitter } from 'events';
import { RuleEngine, type RuleContext, type RuleExecutionResult } from '../rules/RuleEngine';
import { LearningEngine, type LearningModel, type LearningData } from '../learning/LearningEngine';
import { PredictionEngine, type PredictionResult } from '../prediction/PredictionEngine';

export interface DecisionFactor {
  id: string;
  name: string;
  description: string;
  category: 'environment' | 'user' | 'system' | 'historical' | 'predictive' | 'behavioral' | 'contextual';
  weight: number;
  value: number;
  normalizedValue: number;
  confidence: number;
  timestamp: number;
  importance?: number;
}

export interface DecisionFeature {
  id: string;
  name: string;
  factors: DecisionFactor[];
  aggregatedValue: number;
  confidence: number;
  timestamp: number;
  importance?: number;
  correlation?: number;
}

export interface DecisionModel {
  id: string;
  name: string;
  description: string;
  version: string;
  type: 'rule-based' | 'ml-based' | 'ensemble' | 'hybrid';
  features: DecisionFeature[];
  weights: Map<string, number>;
  threshold: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  lastTrainedAt: number;
  trainingDataSize: number;
  validationDataSize: number;
  hyperparameters: Record<string, unknown>;
}

export interface DecisionContext {
  timestamp: number;
  environment: Record<string, unknown>;
  user: Record<string, unknown>;
  system: Record<string, unknown>;
  historical: Array<{ timestamp: number; data: Record<string, unknown> }>;
  predictive: Record<string, unknown>;
  behavioral?: Record<string, unknown>;
  contextual?: Record<string, unknown>;
}

export interface DecisionOption {
  id: string;
  name: string;
  description: string;
  type: 'adaptation' | 'optimization' | 'recommendation' | 'action' | 'hybrid';
  parameters: Record<string, unknown>;
  expectedImpact: DecisionImpact;
  confidence: number;
  priority: number;
  riskLevel: 'low' | 'medium' | 'high';
  expectedBenefit: number;
  expectedCost: number;
}

export interface DecisionImpact {
  performance: number;
  userExperience: number;
  resourceUsage: number;
  cost: number;
  reliability: number;
  security: number;
  scalability: number;
  overall: number;
}

export interface EnsembleDecision {
  modelId: string;
  modelName: string;
  option: DecisionOption;
  confidence: number;
  weight: number;
}

export interface DecisionResult {
  id: string;
  context: DecisionContext;
  features: DecisionFeature[];
  options: DecisionOption[];
  ensembleDecisions: EnsembleDecision[];
  selectedOption: DecisionOption;
  confidence: number;
  reasoning: string[];
  alternatives: DecisionOption[];
  modelAccuracy: number;
  validationScore: number;
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
  ensembleAccuracy: number;
  modelAccuracy: Map<string, number>;
  featureImportance: Map<string, number>;
}

export interface EnhancedDecisionEngineConfig {
  maxFeatures: number;
  maxOptions: number;
  minConfidence: number;
  enableLearning: boolean;
  enablePrediction: boolean;
  enableOptimization: boolean;
  enableEnsemble: boolean;
  enableCrossValidation: boolean;
  enableFeatureSelection: boolean;
  learningRate: number;
  predictionHorizon: number;
  optimizationIterations: number;
  ensembleMethod: 'voting' | 'stacking' | 'blending' | 'weighted';
  crossValidationFolds: number;
  featureSelectionThreshold: number;
  minModelAccuracy: number;
  maxEnsembleModels: number;
}

export class EnhancedDecisionEngine extends EventEmitter {
  private static instance: EnhancedDecisionEngine;
  private ruleEngine: RuleEngine;
  private learningEngine: LearningEngine;
  private predictionEngine: PredictionEngine;
  private models: Map<string, DecisionModel> = new Map();
  private decisionHistory: Array<{ timestamp: number; result: DecisionResult }> = [];
  private metrics: DecisionMetrics;
  private config: EnhancedDecisionEngineConfig;
  private featureExtractor: EnhancedFeatureExtractor;
  private weightOptimizer: AdvancedWeightOptimizer;
  private decisionSelector: IntelligentDecisionSelector;
  private ensembleManager: EnsembleManager;
  private featureSelector: FeatureSelector;
  private modelValidator: ModelValidator;

  private constructor(config?: Partial<EnhancedDecisionEngineConfig>) {
    super();
    this.ruleEngine = RuleEngine.getInstance();
    this.learningEngine = LearningEngine.getInstance();
    this.predictionEngine = PredictionEngine.getInstance();
    this.config = this.initializeConfig(config);
    this.featureExtractor = new EnhancedFeatureExtractor(this.config);
    this.weightOptimizer = new AdvancedWeightOptimizer(this.config);
    this.decisionSelector = new IntelligentDecisionSelector(this.config);
    this.ensembleManager = new EnsembleManager(this.config);
    this.featureSelector = new FeatureSelector(this.config);
    this.modelValidator = new ModelValidator(this.config);
    this.metrics = this.initializeMetrics();
    this.initialize();
  }

  static getInstance(config?: Partial<EnhancedDecisionEngineConfig>): EnhancedDecisionEngine {
    if (!EnhancedDecisionEngine.instance) {
      EnhancedDecisionEngine.instance = new EnhancedDecisionEngine(config);
    }
    return EnhancedDecisionEngine.instance;
  }

  private initializeConfig(config?: Partial<EnhancedDecisionEngineConfig>): EnhancedDecisionEngineConfig {
    return {
      maxFeatures: 15,
      maxOptions: 8,
      minConfidence: 0.75,
      enableLearning: true,
      enablePrediction: true,
      enableOptimization: true,
      enableEnsemble: true,
      enableCrossValidation: true,
      enableFeatureSelection: true,
      learningRate: 0.02,
      predictionHorizon: 3600000,
      optimizationIterations: 200,
      ensembleMethod: 'weighted',
      crossValidationFolds: 5,
      featureSelectionThreshold: 0.05,
      minModelAccuracy: 0.85,
      maxEnsembleModels: 5,
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
      ensembleAccuracy: 0,
      modelAccuracy: new Map(),
      featureImportance: new Map(),
    };
  }

  private async initialize(): Promise<void> {
    await this.loadDefaultModels();
    this.emit('initialized', this.getMetrics());
  }

  private async loadDefaultModels(): Promise<void> {
    const ruleBasedModel: DecisionModel = {
      id: 'model-rule-based',
      name: 'Rule-Based Decision Model',
      description: 'Rule-based decision model using expert knowledge',
      version: '2.0.0',
      type: 'rule-based',
      features: [],
      weights: new Map([
        ['performance', 0.25],
        ['userExperience', 0.30],
        ['resourceUsage', 0.20],
        ['cost', 0.15],
        ['reliability', 0.10],
      ]),
      threshold: 0.75,
      accuracy: 0.88,
      precision: 0.87,
      recall: 0.86,
      f1Score: 0.865,
      lastTrainedAt: Date.now(),
      trainingDataSize: 1500,
      validationDataSize: 300,
      hyperparameters: {},
    };

    const mlBasedModel: DecisionModel = {
      id: 'model-ml-based',
      name: 'ML-Based Decision Model',
      description: 'Machine learning-based decision model using historical data',
      version: '2.0.0',
      type: 'ml-based',
      features: [],
      weights: new Map([
        ['performance', 0.22],
        ['userExperience', 0.28],
        ['resourceUsage', 0.22],
        ['cost', 0.16],
        ['reliability', 0.12],
      ]),
      threshold: 0.75,
      accuracy: 0.90,
      precision: 0.89,
      recall: 0.88,
      f1Score: 0.885,
      lastTrainedAt: Date.now(),
      trainingDataSize: 2000,
      validationDataSize: 400,
      hyperparameters: {
        algorithm: 'random-forest',
        nEstimators: 100,
        maxDepth: 10,
      },
    };

    const ensembleModel: DecisionModel = {
      id: 'model-ensemble',
      name: 'Ensemble Decision Model',
      description: 'Ensemble model combining multiple decision strategies',
      version: '2.0.0',
      type: 'ensemble',
      features: [],
      weights: new Map([
        ['performance', 0.24],
        ['userExperience', 0.29],
        ['resourceUsage', 0.21],
        ['cost', 0.15],
        ['reliability', 0.11],
      ]),
      threshold: 0.75,
      accuracy: 0.92,
      precision: 0.91,
      recall: 0.90,
      f1Score: 0.905,
      lastTrainedAt: Date.now(),
      trainingDataSize: 2500,
      validationDataSize: 500,
      hyperparameters: {
        method: 'weighted',
        models: ['model-rule-based', 'model-ml-based'],
      },
    };

    this.models.set(ruleBasedModel.id, ruleBasedModel);
    this.models.set(mlBasedModel.id, mlBasedModel);
    this.models.set(ensembleModel.id, ensembleModel);

    this.metrics.modelAccuracy.set(ruleBasedModel.id, ruleBasedModel.accuracy);
    this.metrics.modelAccuracy.set(mlBasedModel.id, mlBasedModel.accuracy);
    this.metrics.modelAccuracy.set(ensembleModel.id, ensembleModel.accuracy);
  }

  public async decide(context: DecisionContext): Promise<DecisionResult> {
    const startTime = Date.now();

    this.emit('decision-started', { context, timestamp: startTime });

    try {
      let features = await this.extractFeatures(context);

      if (this.config.enableFeatureSelection) {
        features = await this.featureSelector.select(features);
      }

      const options = await this.generateOptions(context, features);

      let ensembleDecisions: EnsembleDecision[] = [];

      if (this.config.enableEnsemble) {
        ensembleDecisions = await this.ensembleManager.decide(context, features, options, this.models);
      }

      const selectedOption = await this.selectOption(features, options, ensembleDecisions);

      const modelAccuracy = this.calculateModelAccuracy(ensembleDecisions);
      const validationScore = await this.modelValidator.validate(selectedOption, features, options);

      const result: DecisionResult = {
        id: `decision_${Date.now()}`,
        context,
        features,
        options,
        ensembleDecisions,
        selectedOption,
        confidence: selectedOption.confidence,
        reasoning: this.generateReasoning(features, selectedOption, ensembleDecisions),
        alternatives: options.filter(o => o.id !== selectedOption.id),
        modelAccuracy,
        validationScore,
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
      const importance = this.calculateFeatureImportance(categoryFactors);
      const correlation = this.calculateFeatureCorrelation(categoryFactors);

      features.push({
        id: `feature_${category}`,
        name: this.capitalizeFirstLetter(category),
        factors: categoryFactors,
        aggregatedValue,
        confidence,
        timestamp: Date.now(),
        importance,
        correlation,
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
      const importance = factor.importance || 1;
      return sum + factor.normalizedValue * factor.weight * importance;
    }, 0);

    const totalWeight = factors.reduce((sum, factor) => {
      const importance = factor.importance || 1;
      return sum + factor.weight * importance;
    }, 0);

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  private calculateFeatureConfidence(factors: DecisionFactor[]): number {
    if (factors.length === 0) return 0;

    const weightedConfidence = factors.reduce((sum, factor) => {
      const importance = factor.importance || 1;
      return sum + factor.confidence * factor.weight * importance;
    }, 0);

    const totalWeight = factors.reduce((sum, factor) => {
      const importance = factor.importance || 1;
      return sum + factor.weight * importance;
    }, 0);

    return totalWeight > 0 ? weightedConfidence / totalWeight : 0;
  }

  private calculateFeatureImportance(factors: DecisionFactor[]): number {
    if (factors.length === 0) return 0;

    return factors.reduce((sum, factor) => sum + (factor.importance || factor.weight), 0) / factors.length;
  }

  private calculateFeatureCorrelation(factors: DecisionFactor[]): number {
    if (factors.length < 2) return 1;

    const values = factors.map(f => f.normalizedValue);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;

    if (variance === 0) return 1;

    return 1 - (variance / (mean * mean + 1));
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

    if (this.config.enablePrediction) {
      const predictionOptions = await this.generatePredictionOptions(context, features);
      options.push(...predictionOptions);
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
    const riskLevel = this.calculateRiskLevel(action, impact);
    const expectedBenefit = this.calculateExpectedBenefit(action, impact);
    const expectedCost = this.calculateExpectedCost(action, impact);

    return {
      id: `option_${action.id}_${Date.now()}`,
      name: action.type,
      description: `Action: ${action.type}`,
      type: 'adaptation',
      parameters: action.parameters,
      expectedImpact: impact,
      confidence,
      priority: action.priority || 5,
      riskLevel,
      expectedBenefit,
      expectedCost,
    };
  }

  private async generatePredictionOptions(context: DecisionContext, features: DecisionFeature[]): Promise<DecisionOption[]> {
    const options: DecisionOption[] = [];

    try {
      const predictions = await Promise.all([
        this.predictionEngine.predict('performance', {
          timestamp: context.timestamp,
          historicalData: new Map([['performance', context.historical.map(h => h.data.performance as number)]]),
          currentData: new Map([['performance', context.system.performance as number]]),
        }),
        this.predictionEngine.predict('user_satisfaction', {
          timestamp: context.timestamp,
          historicalData: new Map([['user_satisfaction', context.historical.map(h => h.data.userSatisfaction as number)]]),
          currentData: new Map([['user_satisfaction', context.user.satisfaction as number]]),
        }),
      ]);

      for (const prediction of predictions) {
        if (prediction.confidence > 0.8) {
          const option: DecisionOption = {
            id: `option_prediction_${prediction.id}`,
            name: `Prediction-Based: ${prediction.metric}`,
            description: `Based on predicted ${prediction.metric}`,
            type: 'recommendation',
            parameters: { prediction },
            expectedImpact: {
              performance: prediction.predictions[0] || 0.5,
              userExperience: prediction.predictions[0] || 0.5,
              resourceUsage: 0.5,
              cost: 0.5,
              reliability: prediction.confidence,
              security: 0.8,
              scalability: 0.7,
              overall: prediction.confidence,
            },
            confidence: prediction.confidence,
            priority: 6,
            riskLevel: 'low',
            expectedBenefit: prediction.predictions[0] || 0.5,
            expectedCost: 0.3,
          };
          options.push(option);
        }
      }
    } catch (error) {
      console.error('Error generating prediction options:', error);
    }

    return options;
  }

  private async estimateImpact(action: any, features: DecisionFeature[]): Promise<DecisionImpact> {
    const performance = this.estimatePerformanceImpact(action, features);
    const userExperience = this.estimateUserExperienceImpact(action, features);
    const resourceUsage = this.estimateResourceUsageImpact(action, features);
    const cost = this.estimateCostImpact(action, features);
    const reliability = this.estimateReliabilityImpact(action, features);
    const security = this.estimateSecurityImpact(action, features);
    const scalability = this.estimateScalabilityImpact(action, features);

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
      security,
      scalability,
      overall,
    };
  }

  private estimatePerformanceImpact(action: any, features: DecisionFeature[]): number {
    const performanceFeature = features.find(f => f.id === 'feature_environment');
    if (!performanceFeature) return 0.5;

    const networkFactor = performanceFeature.factors.find(f => f.id === 'factor_network_speed');
    if (!networkFactor) return 0.5;

    if (action.type === 'performance-optimization' && networkFactor.value < 0.5) {
      return 0.85;
    }

    return 0.5;
  }

  private estimateUserExperienceImpact(action: any, features: DecisionFeature[]): number {
    const userFeature = features.find(f => f.id === 'feature_user');
    if (!userFeature) return 0.5;

    if (action.type === 'ui-adjustment') {
      return 0.85;
    }

    return 0.5;
  }

  private estimateResourceUsageImpact(action: any, features: DecisionFeature[]): number {
    const systemFeature = features.find(f => f.id === 'feature_system');
    if (!systemFeature) return 0.5;

    if (action.type === 'resource-allocation') {
      return 0.75;
    }

    return 0.5;
  }

  private estimateCostImpact(action: any, features: DecisionFeature[]): number {
    return 0.5;
  }

  private estimateReliabilityImpact(action: any, features: DecisionFeature[]): number {
    return 0.85;
  }

  private estimateSecurityImpact(action: any, features: DecisionFeature[]): number {
    return 0.8;
  }

  private estimateScalabilityImpact(action: any, features: DecisionFeature[]): number {
    return 0.75;
  }

  private calculateOptionConfidence(action: any, features: DecisionFeature[], impact: DecisionImpact): number {
    const featureConfidence = features.reduce((sum, f) => sum + f.confidence * (f.importance || 1), 0) /
      features.reduce((sum, f) => sum + (f.importance || 1), 0);
    const impactConfidence = impact.overall;
    const reliabilityConfidence = impact.reliability;

    return (featureConfidence * 0.4 + impactConfidence * 0.4 + reliabilityConfidence * 0.2);
  }

  private calculateRiskLevel(action: any, impact: DecisionImpact): 'low' | 'medium' | 'high' {
    const riskScore = 1 - impact.reliability;

    if (riskScore < 0.2) return 'low';
    if (riskScore < 0.5) return 'medium';
    return 'high';
  }

  private calculateExpectedBenefit(action: any, impact: DecisionImpact): number {
    return (
      impact.performance * 0.3 +
      impact.userExperience * 0.35 +
      impact.reliability * 0.2 +
      impact.scalability * 0.15
    );
  }

  private calculateExpectedCost(action: any, impact: DecisionImpact): number {
    return (
      impact.resourceUsage * 0.4 +
      impact.cost * 0.4 +
      (1 - impact.reliability) * 0.2
    );
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

  private async selectOption(
    features: DecisionFeature[],
    options: DecisionOption[],
    ensembleDecisions: EnsembleDecision[]
  ): Promise<DecisionOption> {
    return this.decisionSelector.select(features, options, ensembleDecisions, this.config.minConfidence);
  }

  private calculateModelAccuracy(ensembleDecisions: EnsembleDecision[]): number {
    if (ensembleDecisions.length === 0) return 0.85;

    const weightedAccuracy = ensembleDecisions.reduce((sum, ed) => {
      const modelAccuracy = this.metrics.modelAccuracy.get(ed.modelId) || 0.85;
      return sum + modelAccuracy * ed.weight;
    }, 0);

    const totalWeight = ensembleDecisions.reduce((sum, ed) => sum + ed.weight, 0);

    return totalWeight > 0 ? weightedAccuracy / totalWeight : 0.85;
  }

  private generateReasoning(
    features: DecisionFeature[],
    selectedOption: DecisionOption,
    ensembleDecisions: EnsembleDecision[]
  ): string[] {
    const reasoning: string[] = [];

    reasoning.push(`Selected option: ${selectedOption.name} (confidence: ${(selectedOption.confidence * 100).toFixed(1)}%)`);
    reasoning.push(`Risk level: ${selectedOption.riskLevel}, Expected benefit: ${(selectedOption.expectedBenefit * 100).toFixed(1)}%`);

    const topFeatures = features
      .sort((a, b) => (b.importance || b.aggregatedValue) - (a.importance || a.aggregatedValue))
      .slice(0, 3);

    for (const feature of topFeatures) {
      reasoning.push(`${feature.name}: ${feature.aggregatedValue.toFixed(2)} (confidence: ${(feature.confidence * 100).toFixed(1)}%, importance: ${(feature.importance || 0).toFixed(2)})`);
    }

    if (ensembleDecisions.length > 0) {
      reasoning.push(`Ensemble consensus: ${ensembleDecisions.length} models participated`);
      const topModel = ensembleDecisions.sort((a, b) => b.weight - a.weight)[0];
      reasoning.push(`Top model: ${topModel.modelName} (weight: ${(topModel.weight * 100).toFixed(1)}%)`);
    }

    reasoning.push(`Expected impact - Performance: ${(selectedOption.expectedImpact.performance * 100).toFixed(1)}%, ` +
                  `User Experience: ${(selectedOption.expectedImpact.userExperience * 100).toFixed(1)}%, ` +
                  `Resource Usage: ${(selectedOption.expectedImpact.resourceUsage * 100).toFixed(1)}%`);

    return reasoning;
  }

  private async learnFromResult(result: DecisionResult): Promise<void> {
    for (const [modelId, model] of this.models.entries()) {
      const feedback = await this.collectFeedback(result, modelId);
      if (feedback) {
        await this.updateModel(model, feedback);
      }
    }
  }

  private async collectFeedback(result: DecisionResult, modelId: string): Promise<{ success: boolean; impact: DecisionImpact } | null> {
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

    this.metrics.modelAccuracy.set(model.id, model.accuracy);

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
    this.metrics.ensembleAccuracy = result.modelAccuracy;

    for (const feature of result.features) {
      const currentImportance = this.metrics.featureImportance.get(feature.id) || 0;
      const newImportance = (currentImportance * (this.metrics.totalDecisions - 1) + (feature.importance || feature.aggregatedValue)) / this.metrics.totalDecisions;
      this.metrics.featureImportance.set(feature.id, newImportance);
    }
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
    this.metrics.modelAccuracy.set(model.id, model.accuracy);
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
    if (updatedModel.accuracy !== undefined) {
      this.metrics.modelAccuracy.set(modelId, updatedModel.accuracy);
    }
    this.emit('model-updated', updatedModel);
  }

  public removeModel(modelId: string): void {
    const removed = this.models.delete(modelId);
    if (removed) {
      this.metrics.modelAccuracy.delete(modelId);
      this.emit('model-removed', modelId);
    }
  }

  public getMetrics(): DecisionMetrics {
    return {
      ...this.metrics,
      modelAccuracy: new Map(this.metrics.modelAccuracy),
      featureImportance: new Map(this.metrics.featureImportance),
    };
  }

  public getDecisionHistory(limit?: number): Array<{ timestamp: number; result: DecisionResult }> {
    const history = [...this.decisionHistory].reverse();
    return limit ? history.slice(0, limit) : history;
  }

  public getConfig(): EnhancedDecisionEngineConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<EnhancedDecisionEngineConfig>): void {
    this.config = { ...this.config, ...updates };
    this.emit('config-updated', this.config);
  }

  public async reset(): Promise<void> {
    this.models.clear();
    this.decisionHistory = [];
    this.metrics = this.initializeMetrics();
    await this.loadDefaultModels();
    this.emit('reset', this.getMetrics());
  }

  public async trainModel(modelId: string, trainingData: LearningData[]): Promise<void> {
    const model = this.models.get(modelId);
    if (!model) {
      throw new Error(`Model not found: ${modelId}`);
    }

    for (const data of trainingData) {
      await this.learningEngine.addLearningData(data);
    }

    model.lastTrainedAt = Date.now();
    model.trainingDataSize += trainingData.length;

    this.emit('model-trained', model);
  }

  public async crossValidateModel(modelId: string, data: LearningData[]): Promise<number> {
    if (!this.config.enableCrossValidation) {
      throw new Error('Cross-validation is disabled');
    }

    const model = this.models.get(modelId);
    if (!model) {
      throw new Error(`Model not found: ${modelId}`);
    }

    const foldSize = Math.floor(data.length / this.config.crossValidationFolds);
    let totalAccuracy = 0;

    for (let i = 0; i < this.config.crossValidationFolds; i++) {
      const testData = data.slice(i * foldSize, (i + 1) * foldSize);
      const trainData = [...data.slice(0, i * foldSize), ...data.slice((i + 1) * foldSize)];

      await this.trainModel(modelId, trainData);

      const foldAccuracy = await this.evaluateModel(modelId, testData);
      totalAccuracy += foldAccuracy;
    }

    const avgAccuracy = totalAccuracy / this.config.crossValidationFolds;
    model.accuracy = avgAccuracy;
    this.metrics.modelAccuracy.set(modelId, avgAccuracy);

    return avgAccuracy;
  }

  private async evaluateModel(modelId: string, testData: LearningData[]): Promise<number> {
    let correct = 0;

    for (const data of testData) {
      const prediction = await this.learningEngine.predict(modelId, data.input);
      if (prediction.output === data.output) {
        correct++;
      }
    }

    return correct / testData.length;
  }
}

class EnhancedFeatureExtractor {
  constructor(private config: EnhancedDecisionEngineConfig) {}

  async extract(context: DecisionContext): Promise<DecisionFactor[]> {
    const factors: DecisionFactor[] = [];

    factors.push(...this.extractEnvironmentFactors(context));
    factors.push(...this.extractUserFactors(context));
    factors.push(...this.extractSystemFactors(context));
    factors.push(...this.extractHistoricalFactors(context));

    if (this.config.enablePrediction) {
      factors.push(...this.extractPredictiveFactors(context));
    }

    factors.push(...this.extractBehavioralFactors(context));
    factors.push(...this.extractContextualFactors(context));

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
      importance: 0.8,
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
      importance: 0.9,
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
      importance: 0.85,
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
      importance: 0.7,
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
      importance: 0.95,
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
      importance: 0.8,
    });

    factors.push({
      id: 'factor_user_context',
      name: 'User Context',
      description: 'User contextual information',
      category: 'user',
      weight: 0.3,
      value: this.normalizeUserContext(user.context as any),
      normalizedValue: this.normalizeUserContext(user.context as any),
      confidence: 0.8,
      timestamp: Date.now(),
      importance: 0.75,
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
      weight: 0.3,
      value: (system.load as number) || 0.5,
      normalizedValue: (system.load as number) || 0.5,
      confidence: 0.95,
      timestamp: Date.now(),
      importance: 0.9,
    });

    factors.push({
      id: 'factor_memory_usage',
      name: 'Memory Usage',
      description: 'Current memory usage',
      category: 'system',
      weight: 0.35,
      value: (system.memoryUsage as number) || 0.5,
      normalizedValue: (system.memoryUsage as number) || 0.5,
      confidence: 0.95,
      timestamp: Date.now(),
      importance: 0.85,
    });

    factors.push({
      id: 'factor_performance_mode',
      name: 'Performance Mode',
      description: 'Current performance mode',
      category: 'system',
      weight: 0.35,
      value: this.normalizePerformanceMode(system.performanceMode as any),
      normalizedValue: this.normalizePerformanceMode(system.performanceMode as any),
      confidence: 1.0,
      timestamp: Date.now(),
      importance: 0.8,
    });

    return factors;
  }

  private extractHistoricalFactors(context: DecisionContext): DecisionFactor[] {
    const factors: DecisionFactor[] = [];

    if (context.historical.length > 0) {
      const recentHistory = context.historical.slice(-10);

      const avgPerformance = recentHistory.reduce((sum, h) => sum + (h.data.performance as number || 0), 0) / recentHistory.length;
      const avgUserSatisfaction = recentHistory.reduce((sum, h) => sum + (h.data.userSatisfaction as number || 0), 0) / recentHistory.length;

      factors.push({
        id: 'factor_historical_performance',
        name: 'Historical Performance',
        description: 'Average historical performance',
        category: 'historical',
        weight: 0.5,
        value: avgPerformance,
        normalizedValue: avgPerformance,
        confidence: 0.9,
        timestamp: Date.now(),
        importance: 0.85,
      });

      factors.push({
        id: 'factor_historical_satisfaction',
        name: 'Historical Satisfaction',
        description: 'Average historical user satisfaction',
        category: 'historical',
        weight: 0.5,
        value: avgUserSatisfaction,
        normalizedValue: avgUserSatisfaction,
        confidence: 0.85,
        timestamp: Date.now(),
        importance: 0.9,
      });
    }

    return factors;
  }

  private extractPredictiveFactors(context: DecisionContext): DecisionFactor[] {
    const factors: DecisionFactor[] = [];

    if (context.predictive) {
      factors.push({
        id: 'factor_predicted_performance',
        name: 'Predicted Performance',
        description: 'Predicted future performance',
        category: 'predictive',
        weight: 0.5,
        value: (context.predictive.performance as number) || 0.5,
        normalizedValue: (context.predictive.performance as number) || 0.5,
        confidence: 0.8,
        timestamp: Date.now(),
        importance: 0.75,
      });

      factors.push({
        id: 'factor_predicted_load',
        name: 'Predicted Load',
        description: 'Predicted future system load',
        category: 'predictive',
        weight: 0.5,
        value: (context.predictive.load as number) || 0.5,
        normalizedValue: (context.predictive.load as number) || 0.5,
        confidence: 0.75,
        timestamp: Date.now(),
        importance: 0.8,
      });
    }

    return factors;
  }

  private extractBehavioralFactors(context: DecisionContext): DecisionFactor[] {
    const factors: DecisionFactor[] = [];

    if (context.behavioral) {
      factors.push({
        id: 'factor_behavioral_patterns',
        name: 'Behavioral Patterns',
        description: 'User behavioral patterns',
        category: 'behavioral',
        weight: 0.4,
        value: (context.behavioral.patterns as number) || 0.5,
        normalizedValue: (context.behavioral.patterns as number) || 0.5,
        confidence: 0.85,
        timestamp: Date.now(),
        importance: 0.9,
      });

      factors.push({
        id: 'factor_behavioral_frequency',
        name: 'Behavioral Frequency',
        description: 'Frequency of user behaviors',
        category: 'behavioral',
        weight: 0.3,
        value: (context.behavioral.frequency as number) || 0.5,
        normalizedValue: (context.behavioral.frequency as number) || 0.5,
        confidence: 0.8,
        timestamp: Date.now(),
        importance: 0.85,
      });

      factors.push({
        id: 'factor_behavioral_intensity',
        name: 'Behavioral Intensity',
        description: 'Intensity of user behaviors',
        category: 'behavioral',
        weight: 0.3,
        value: (context.behavioral.intensity as number) || 0.5,
        normalizedValue: (context.behavioral.intensity as number) || 0.5,
        confidence: 0.75,
        timestamp: Date.now(),
        importance: 0.8,
      });
    }

    return factors;
  }

  private extractContextualFactors(context: DecisionContext): DecisionFactor[] {
    const factors: DecisionFactor[] = [];

    if (context.contextual) {
      factors.push({
        id: 'factor_contextual_location',
        name: 'Contextual Location',
        description: 'Contextual location information',
        category: 'contextual',
        weight: 0.35,
        value: (context.contextual.location as number) || 0.5,
        normalizedValue: (context.contextual.location as number) || 0.5,
        confidence: 0.9,
        timestamp: Date.now(),
        importance: 0.85,
      });

      factors.push({
        id: 'factor_contextual_activity',
        name: 'Contextual Activity',
        description: 'Contextual activity information',
        category: 'contextual',
        weight: 0.35,
        value: (context.contextual.activity as number) || 0.5,
        normalizedValue: (context.contextual.activity as number) || 0.5,
        confidence: 0.85,
        timestamp: Date.now(),
        importance: 0.8,
      });

      factors.push({
        id: 'factor_contextual_social',
        name: 'Contextual Social',
        description: 'Contextual social information',
        category: 'contextual',
        weight: 0.3,
        value: (context.contextual.social as number) || 0.5,
        normalizedValue: (context.contextual.social as number) || 0.5,
        confidence: 0.8,
        timestamp: Date.now(),
        importance: 0.75,
      });
    }

    return factors;
  }

  private normalizeDeviceType(device: any): number {
    if (!device) return 0.5;
    const type = device.type;
    switch (type) {
      case 'mobile': return 0.3;
      case 'tablet': return 0.5;
      case 'desktop': return 0.8;
      default: return 0.5;
    }
  }

  private normalizeNetworkSpeed(network: any): number {
    if (!network) return 0.5;
    const speed = network.speed;
    switch (speed) {
      case 'slow': return 0.2;
      case 'medium': return 0.5;
      case 'fast': return 0.9;
      default: return 0.5;
    }
  }

  private normalizeTimeContext(time: any): number {
    if (!time) return 0.5;
    return time.isWorkHours ? 0.8 : 0.4;
  }

  private normalizeUserActivity(activity: any): number {
    if (!activity) return 0.5;
    switch (activity) {
      case 'idle': return 0.2;
      case 'active': return 0.7;
      case 'intensive': return 0.9;
      default: return 0.5;
    }
  }

  private normalizeUserPreferences(preferences: any): number {
    if (!preferences) return 0.5;
    return preferences.theme === 'dark' ? 0.6 : 0.4;
  }

  private normalizeUserContext(context: any): number {
    if (!context) return 0.5;
    return 0.5;
  }

  private normalizePerformanceMode(mode: any): number {
    if (!mode) return 0.5;
    switch (mode) {
      case 'low-power': return 0.3;
      case 'balanced': return 0.6;
      case 'high-performance': return 0.9;
      default: return 0.5;
    }
  }
}

class AdvancedWeightOptimizer {
  constructor(private config: EnhancedDecisionEngineConfig) {}

  async optimize(option: DecisionOption, features: DecisionFeature[]): Promise<DecisionOption> {
    const optimizedOption = { ...option };

    const featureWeights = features.map(f => f.importance || f.aggregatedValue);
    const totalWeight = featureWeights.reduce((a, b) => a + b, 0);

    const adjustedImpact = { ...optimizedOption.expectedImpact };

    for (const feature of features) {
      const weight = (feature.importance || feature.aggregatedValue) / totalWeight;
      adjustedImpact.performance += feature.aggregatedValue * weight * 0.1;
      adjustedImpact.userExperience += feature.aggregatedValue * weight * 0.1;
    }

    adjustedImpact.overall = (
      adjustedImpact.performance * 0.25 +
      adjustedImpact.userExperience * 0.30 +
      adjustedImpact.resourceUsage * 0.20 +
      adjustedImpact.cost * 0.15 +
      adjustedImpact.reliability * 0.10
    );

    optimizedOption.expectedImpact = adjustedImpact;
    optimizedOption.confidence = Math.min(0.95, option.confidence + 0.05);

    return optimizedOption;
  }
}

class IntelligentDecisionSelector {
  constructor(private config: EnhancedDecisionEngineConfig) {}

  select(
    features: DecisionFeature[],
    options: DecisionOption[],
    ensembleDecisions: EnsembleDecision[],
    minConfidence: number
  ): DecisionOption {
    const validOptions = options.filter(o => o.confidence >= minConfidence);

    if (validOptions.length === 0) {
      return options.reduce((best, current) =>
        current.confidence > best.confidence ? current : best
      );
    }

    if (ensembleDecisions.length > 0) {
      const ensembleOptionIds = ensembleDecisions.map(ed => ed.option.id);
      const ensembleOptions = validOptions.filter(o => ensembleOptionIds.includes(o.id));

      if (ensembleOptions.length > 0) {
        return ensembleOptions.reduce((best, current) =>
          current.confidence > best.confidence ? current : best
        );
      }
    }

    const scoredOptions = validOptions.map(option => {
      const benefitCostRatio = option.expectedBenefit / (option.expectedCost || 0.01);
      const riskPenalty = option.riskLevel === 'high' ? 0.2 : option.riskLevel === 'medium' ? 0.1 : 0;
      const score = option.confidence * 0.4 + benefitCostRatio * 0.4 - riskPenalty * 0.2;
      return { option, score };
    });

    scoredOptions.sort((a, b) => b.score - a.score);

    return scoredOptions[0].option;
  }
}

class EnsembleManager {
  constructor(private config: EnhancedDecisionEngineConfig) {}

  async decide(
    context: DecisionContext,
    features: DecisionFeature[],
    options: DecisionOption[],
    models: Map<string, DecisionModel>
  ): Promise<EnsembleDecision[]> {
    const ensembleDecisions: EnsembleDecision[] = [];

    const modelArray = Array.from(models.values())
      .filter(m => m.accuracy >= this.config.minModelAccuracy)
      .slice(0, this.config.maxEnsembleModels);

    for (const model of modelArray) {
      const option = await this.modelDecide(model, features, options);
      const weight = this.calculateModelWeight(model);

      ensembleDecisions.push({
        modelId: model.id,
        modelName: model.name,
        option,
        confidence: option.confidence,
        weight,
      });
    }

    if (ensembleDecisions.length > 0) {
      this.normalizeWeights(ensembleDecisions);
    }

    return ensembleDecisions;
  }

  private async modelDecide(
    model: DecisionModel,
    features: DecisionFeature[],
    options: DecisionOption[]
  ): Promise<DecisionOption> {
    const scoredOptions = options.map(option => {
      let score = 0;

      for (const [featureId, weight] of model.weights.entries()) {
        const feature = features.find(f => f.id === featureId);
        if (feature) {
          score += feature.aggregatedValue * weight;
        }
      }

      score += option.confidence * 0.3;

      return { option, score };
    });

    scoredOptions.sort((a, b) => b.score - a.score);

    return scoredOptions[0].option;
  }

  private calculateModelWeight(model: DecisionModel): number {
    const accuracyWeight = model.accuracy;
    const recencyWeight = Math.min(1, (Date.now() - model.lastTrainedAt) / (7 * 24 * 60 * 60 * 1000));
    const dataWeight = Math.min(1, model.trainingDataSize / 1000);

    return (accuracyWeight * 0.6 + recencyWeight * 0.2 + dataWeight * 0.2);
  }

  private normalizeWeights(ensembleDecisions: EnsembleDecision[]): void {
    const totalWeight = ensembleDecisions.reduce((sum, ed) => sum + ed.weight, 0);

    for (const decision of ensembleDecisions) {
      decision.weight = decision.weight / totalWeight;
    }
  }
}

class FeatureSelector {
  constructor(private config: EnhancedDecisionEngineConfig) {}

  async select(features: DecisionFeature[]): Promise<DecisionFeature[]> {
    const selectedFeatures: DecisionFeature[] = [];

    const sortedFeatures = [...features].sort((a, b) =>
      (b.importance || b.aggregatedValue) - (a.importance || a.aggregatedValue)
    );

    for (const feature of sortedFeatures) {
      if (feature.importance && feature.importance >= this.config.featureSelectionThreshold) {
        selectedFeatures.push(feature);
      }
    }

    return selectedFeatures.slice(0, this.config.maxFeatures);
  }
}

class ModelValidator {
  constructor(private config: EnhancedDecisionEngineConfig) {}

  async validate(
    selectedOption: DecisionOption,
    features: DecisionFeature[],
    options: DecisionOption[]
  ): Promise<number> {
    const confidenceScore = selectedOption.confidence;
    const featureScore = features.reduce((sum, f) => sum + f.confidence, 0) / features.length;
    const diversityScore = this.calculateDiversityScore(selectedOption, options);
    const consistencyScore = this.calculateConsistencyScore(selectedOption, features);

    const validationScore = (
      confidenceScore * 0.4 +
      featureScore * 0.3 +
      diversityScore * 0.15 +
      consistencyScore * 0.15
    );

    return validationScore;
  }

  private calculateDiversityScore(selectedOption: DecisionOption, options: DecisionOption[]): number {
    if (options.length <= 1) return 1;

    const avgConfidence = options.reduce((sum, o) => sum + o.confidence, 0) / options.length;
    const confidenceSpread = Math.abs(selectedOption.confidence - avgConfidence);

    return 1 - Math.min(1, confidenceSpread);
  }

  private calculateConsistencyScore(selectedOption: DecisionOption, features: DecisionFeature[]): number {
    const topFeatures = features.slice(0, 3);
    const avgFeatureValue = topFeatures.reduce((sum, f) => sum + f.aggregatedValue, 0) / topFeatures.length;

    const expectedImpact = selectedOption.expectedImpact.overall;
    const consistency = 1 - Math.abs(expectedImpact - avgFeatureValue);

    return consistency;
  }
}

export default EnhancedDecisionEngine;
