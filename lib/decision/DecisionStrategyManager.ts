/**
 * @file DecisionStrategyManager.ts
 * @description YYC³ AI浮窗系统决策策略管理器 - 多种决策策略与选项
 * @module lib/decision
 * @author YYC³
 * @version 2.0.0
 * @created 2026-01-20
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { EventEmitter } from 'events';

export interface DecisionStrategy {
  id: string;
  name: string;
  description: string;
  type: 'risk-based' | 'utility-based' | 'multi-objective' | 'game-theoretic' | 'reinforcement-learning' | 'heuristic' | 'meta-heuristic';
  parameters: Record<string, unknown>;
  weights: Map<string, number>;
  enabled: boolean;
  priority: number;
  accuracy: number;
  lastUsedAt: number;
  usageCount: number;
}

export interface DecisionOption {
  id: string;
  name: string;
  description: string;
  type: 'adaptation' | 'optimization' | 'recommendation' | 'action' | 'hybrid' | 'mitigation' | 'prevention';
  parameters: Record<string, unknown>;
  expectedImpact: DecisionImpact;
  confidence: number;
  priority: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  expectedBenefit: number;
  expectedCost: number;
  utility: number;
  riskScore: number;
  strategy?: string;
  alternatives?: DecisionOption[];
}

export interface DecisionImpact {
  performance: number;
  userExperience: number;
  resourceUsage: number;
  cost: number;
  reliability: number;
  security: number;
  scalability: number;
  maintainability: number;
  overall: number;
}

export interface DecisionContext {
  timestamp: number;
  environment: Record<string, unknown>;
  user: Record<string, unknown>;
  system: Record<string, unknown>;
  historical: Array<{ timestamp: number; data: Record<string, unknown> }>;
  constraints?: DecisionConstraints;
  preferences?: DecisionPreferences;
  objectives?: DecisionObjectives[];
}

export interface DecisionConstraints {
  maxCost?: number;
  maxRisk?: number;
  minReliability?: number;
  minPerformance?: number;
  maxResourceUsage?: number;
  timeLimit?: number;
  customConstraints?: Record<string, { min?: number; max?: number; equals?: number }>;
}

export interface DecisionPreferences {
  riskTolerance: 'low' | 'medium' | 'high';
  costSensitivity: 'low' | 'medium' | 'high';
  performancePriority: 'low' | 'medium' | 'high';
  userExperiencePriority: 'low' | 'medium' | 'high';
  reliabilityPriority: 'low' | 'medium' | 'high';
  customWeights?: Map<string, number>;
}

export interface DecisionObjectives {
  id: string;
  name: string;
  type: 'maximize' | 'minimize' | 'target';
  target?: number;
  weight: number;
  importance: 'low' | 'medium' | 'high' | 'critical';
}

export interface DecisionStrategyResult {
  strategyId: string;
  strategyName: string;
  selectedOption: DecisionOption;
  alternatives: DecisionOption[];
  confidence: number;
  reasoning: string[];
  metrics: {
    utility: number;
    riskScore: number;
    expectedBenefit: number;
    expectedCost: number;
  };
  executionTime: number;
}

export interface StrategyMetrics {
  totalStrategies: number;
  activeStrategies: number;
  totalDecisions: number;
  strategyUsage: Map<string, number>;
  strategyAccuracy: Map<string, number>;
  averageDecisionTime: number;
}

export interface DecisionStrategyManagerConfig {
  enableRiskBasedStrategy: boolean;
  enableUtilityBasedStrategy: boolean;
  enableMultiObjectiveStrategy: boolean;
  enableGameTheoreticStrategy: boolean;
  enableReinforcementLearningStrategy: boolean;
  enableHeuristicStrategy: boolean;
  enableMetaHeuristicStrategy: boolean;
  defaultStrategy: string;
  maxStrategies: number;
  strategySelectionMethod: 'accuracy' | 'usage' | 'adaptive' | 'manual';
  enableStrategyLearning: boolean;
  learningRate: number;
  enableStrategyOptimization: boolean;
  optimizationInterval: number;
}

export class DecisionStrategyManager extends EventEmitter {
  private static instance: DecisionStrategyManager;
  private strategies: Map<string, DecisionStrategy> = new Map();
  private decisionHistory: Array<{ timestamp: number; result: DecisionStrategyResult }> = [];
  private metrics: StrategyMetrics;
  private config: DecisionStrategyManagerConfig;
  private riskBasedStrategy: RiskBasedStrategy;
  private utilityBasedStrategy: UtilityBasedStrategy;
  private multiObjectiveStrategy: MultiObjectiveStrategy;
  private gameTheoreticStrategy: GameTheoreticStrategy;
  private reinforcementLearningStrategy: ReinforcementLearningStrategy;
  private heuristicStrategy: HeuristicStrategy;
  private metaHeuristicStrategy: MetaHeuristicStrategy;
  private strategySelector: StrategySelector;
  private strategyOptimizer: StrategyOptimizer;
  private optimizationTimer: NodeJS.Timeout | null = null;

  private constructor(config?: Partial<DecisionStrategyManagerConfig>) {
    super();
    this.config = this.initializeConfig(config);
    this.riskBasedStrategy = new RiskBasedStrategy(this.config);
    this.utilityBasedStrategy = new UtilityBasedStrategy(this.config);
    this.multiObjectiveStrategy = new MultiObjectiveStrategy(this.config);
    this.gameTheoreticStrategy = new GameTheoreticStrategy(this.config);
    this.reinforcementLearningStrategy = new ReinforcementLearningStrategy(this.config);
    this.heuristicStrategy = new HeuristicStrategy(this.config);
    this.metaHeuristicStrategy = new MetaHeuristicStrategy(this.config);
    this.strategySelector = new StrategySelector(this.config);
    this.strategyOptimizer = new StrategyOptimizer(this.config);
    this.metrics = this.initializeMetrics();
    this.initialize();
  }

  static getInstance(config?: Partial<DecisionStrategyManagerConfig>): DecisionStrategyManager {
    if (!DecisionStrategyManager.instance) {
      DecisionStrategyManager.instance = new DecisionStrategyManager(config);
    }
    return DecisionStrategyManager.instance;
  }

  private initializeConfig(config?: Partial<DecisionStrategyManagerConfig>): DecisionStrategyManagerConfig {
    return {
      enableRiskBasedStrategy: true,
      enableUtilityBasedStrategy: true,
      enableMultiObjectiveStrategy: true,
      enableGameTheoreticStrategy: true,
      enableReinforcementLearningStrategy: true,
      enableHeuristicStrategy: true,
      enableMetaHeuristicStrategy: true,
      defaultStrategy: 'multi-objective',
      maxStrategies: 10,
      strategySelectionMethod: 'adaptive',
      enableStrategyLearning: true,
      learningRate: 0.01,
      enableStrategyOptimization: true,
      optimizationInterval: 3600000,
      ...config,
    };
  }

  private initializeMetrics(): StrategyMetrics {
    return {
      totalStrategies: 0,
      activeStrategies: 0,
      totalDecisions: 0,
      strategyUsage: new Map(),
      strategyAccuracy: new Map(),
      averageDecisionTime: 0,
    };
  }

  private async initialize(): Promise<void> {
    await this.loadDefaultStrategies();

    if (this.config.enableStrategyOptimization) {
      this.startOptimizationTimer();
    }

    this.emit('initialized', this.metrics);
  }

  private async loadDefaultStrategies(): Promise<void> {
    const defaultStrategies: DecisionStrategy[] = [
      {
        id: 'risk-based',
        name: 'Risk-Based Strategy',
        description: 'Decision strategy based on risk assessment and mitigation',
        type: 'risk-based',
        parameters: {
          riskTolerance: 'medium',
          riskWeight: 0.4,
          benefitWeight: 0.3,
          costWeight: 0.2,
          reliabilityWeight: 0.1,
        },
        weights: new Map([
          ['risk', 0.4],
          ['benefit', 0.3],
          ['cost', 0.2],
          ['reliability', 0.1],
        ]),
        enabled: this.config.enableRiskBasedStrategy,
        priority: 8,
        accuracy: 0.88,
        lastUsedAt: 0,
        usageCount: 0,
      },
      {
        id: 'utility-based',
        name: 'Utility-Based Strategy',
        description: 'Decision strategy based on utility maximization',
        type: 'utility-based',
        parameters: {
          utilityFunction: 'linear',
          discountFactor: 0.95,
          timeHorizon: 10,
        },
        weights: new Map([
          ['performance', 0.25],
          ['userExperience', 0.30],
          ['resourceUsage', 0.20],
          ['cost', 0.15],
          ['reliability', 0.10],
        ]),
        enabled: this.config.enableUtilityBasedStrategy,
        priority: 9,
        accuracy: 0.90,
        lastUsedAt: 0,
        usageCount: 0,
      },
      {
        id: 'multi-objective',
        name: 'Multi-Objective Strategy',
        description: 'Decision strategy based on multi-objective optimization',
        type: 'multi-objective',
        parameters: {
          objectives: ['performance', 'userExperience', 'resourceUsage', 'cost', 'reliability'],
          optimizationMethod: 'pareto',
          aggregationMethod: 'weighted-sum',
        },
        weights: new Map([
          ['performance', 0.24],
          ['userExperience', 0.29],
          ['resourceUsage', 0.21],
          ['cost', 0.15],
          ['reliability', 0.11],
        ]),
        enabled: this.config.enableMultiObjectiveStrategy,
        priority: 10,
        accuracy: 0.92,
        lastUsedAt: 0,
        usageCount: 0,
      },
      {
        id: 'game-theoretic',
        name: 'Game-Theoretic Strategy',
        description: 'Decision strategy based on game theory principles',
        type: 'game-theoretic',
        parameters: {
          gameType: 'cooperative',
          equilibriumType: 'nash',
          playerCount: 2,
        },
        weights: new Map([
          ['cooperation', 0.4],
          ['competition', 0.3],
          ['fairness', 0.2],
          ['efficiency', 0.1],
        ]),
        enabled: this.config.enableGameTheoreticStrategy,
        priority: 7,
        accuracy: 0.86,
        lastUsedAt: 0,
        usageCount: 0,
      },
      {
        id: 'reinforcement-learning',
        name: 'Reinforcement Learning Strategy',
        description: 'Decision strategy based on reinforcement learning',
        type: 'reinforcement-learning',
        parameters: {
          algorithm: 'q-learning',
          learningRate: 0.01,
          discountFactor: 0.95,
          explorationRate: 0.1,
        },
        weights: new Map([
          ['reward', 0.5],
          ['state', 0.3],
          ['action', 0.2],
        ]),
        enabled: this.config.enableReinforcementLearningStrategy,
        priority: 9,
        accuracy: 0.91,
        lastUsedAt: 0,
        usageCount: 0,
      },
      {
        id: 'heuristic',
        name: 'Heuristic Strategy',
        description: 'Decision strategy based on heuristic rules',
        type: 'heuristic',
        parameters: {
          heuristicType: 'rule-based',
          ruleCount: 10,
          complexity: 'low',
        },
        weights: new Map([
          ['rule1', 0.2],
          ['rule2', 0.2],
          ['rule3', 0.2],
          ['rule4', 0.2],
          ['rule5', 0.2],
        ]),
        enabled: this.config.enableHeuristicStrategy,
        priority: 6,
        accuracy: 0.84,
        lastUsedAt: 0,
        usageCount: 0,
      },
      {
        id: 'meta-heuristic',
        name: 'Meta-Heuristic Strategy',
        description: 'Decision strategy based on meta-heuristic optimization',
        type: 'meta-heuristic',
        parameters: {
          algorithm: 'genetic',
          populationSize: 50,
          generations: 100,
          mutationRate: 0.1,
        },
        weights: new Map([
          ['fitness', 0.4],
          ['diversity', 0.3],
          ['convergence', 0.2],
          ['efficiency', 0.1],
        ]),
        enabled: this.config.enableMetaHeuristicStrategy,
        priority: 8,
        accuracy: 0.89,
        lastUsedAt: 0,
        usageCount: 0,
      },
    ];

    for (const strategy of defaultStrategies) {
      this.strategies.set(strategy.id, strategy);
    }

    this.metrics.totalStrategies = defaultStrategies.length;
    this.metrics.activeStrategies = defaultStrategies.filter(s => s.enabled).length;
  }

  private startOptimizationTimer(): void {
    if (this.optimizationTimer) {
      clearInterval(this.optimizationTimer);
    }

    this.optimizationTimer = setInterval(async () => {
      await this.optimizeStrategies();
    }, this.config.optimizationInterval);
  }

  public async decide(
    context: DecisionContext,
    options: DecisionOption[],
    strategyId?: string
  ): Promise<DecisionStrategyResult> {
    const startTime = Date.now();

    this.emit('decision-started', { timestamp: startTime });

    try {
      const selectedStrategy = strategyId
        ? this.strategies.get(strategyId)
        : await this.strategySelector.select(this.strategies, context);

      if (!selectedStrategy) {
        throw new Error('No suitable strategy found');
      }

      const result = await this.executeStrategy(selectedStrategy, context, options);

      const executionTime = Date.now() - startTime;
      result.executionTime = executionTime;

      this.decisionHistory.push({ timestamp: Date.now(), result });
      this.updateMetrics(selectedStrategy, result, executionTime);

      this.emit('decision-completed', result);
      return result;
    } catch (error) {
      this.emit('decision-failed', { context, error });
      throw error;
    }
  }

  private async executeStrategy(
    strategy: DecisionStrategy,
    context: DecisionContext,
    options: DecisionOption[]
  ): Promise<DecisionStrategyResult> {
    strategy.lastUsedAt = Date.now();
    strategy.usageCount++;

    let result: DecisionStrategyResult;

    switch (strategy.type) {
      case 'risk-based':
        result = await this.riskBasedStrategy.decide(strategy, context, options);
        break;
      case 'utility-based':
        result = await this.utilityBasedStrategy.decide(strategy, context, options);
        break;
      case 'multi-objective':
        result = await this.multiObjectiveStrategy.decide(strategy, context, options);
        break;
      case 'game-theoretic':
        result = await this.gameTheoreticStrategy.decide(strategy, context, options);
        break;
      case 'reinforcement-learning':
        result = await this.reinforcementLearningStrategy.decide(strategy, context, options);
        break;
      case 'heuristic':
        result = await this.heuristicStrategy.decide(strategy, context, options);
        break;
      case 'meta-heuristic':
        result = await this.metaHeuristicStrategy.decide(strategy, context, options);
        break;
      default:
        throw new Error(`Unknown strategy type: ${strategy.type}`);
    }

    result.strategyId = strategy.id;
    result.strategyName = strategy.name;

    return result;
  }

  private updateMetrics(strategy: DecisionStrategy, result: DecisionStrategyResult, executionTime: number): void {
    this.metrics.totalDecisions++;

    const usage = this.metrics.strategyUsage.get(strategy.id) || 0;
    this.metrics.strategyUsage.set(strategy.id, usage + 1);

    const accuracy = this.metrics.strategyAccuracy.get(strategy.id) || strategy.accuracy;
    const newAccuracy = accuracy * (1 - this.config.learningRate) + result.confidence * this.config.learningRate;
    this.metrics.strategyAccuracy.set(strategy.id, newAccuracy);

    const totalDecisionTime = this.metrics.averageDecisionTime * (this.metrics.totalDecisions - 1);
    this.metrics.averageDecisionTime = (totalDecisionTime + executionTime) / this.metrics.totalDecisions;

    if (this.config.enableStrategyLearning) {
      strategy.accuracy = newAccuracy;
    }
  }

  public async optimizeStrategies(): Promise<void> {
    const strategies = Array.from(this.strategies.values()).filter(s => s.enabled);

    for (const strategy of strategies) {
      const optimized = await this.strategyOptimizer.optimize(strategy, this.decisionHistory);
      this.strategies.set(strategy.id, optimized);
    }

    this.emit('strategies-optimized', strategies);
  }

  public addStrategy(strategy: DecisionStrategy): void {
    this.strategies.set(strategy.id, strategy);
    this.metrics.totalStrategies++;
    if (strategy.enabled) {
      this.metrics.activeStrategies++;
    }
    this.emit('strategy-added', strategy);
  }

  public getStrategy(strategyId: string): DecisionStrategy | undefined {
    return this.strategies.get(strategyId);
  }

  public getAllStrategies(): DecisionStrategy[] {
    return Array.from(this.strategies.values());
  }

  public getActiveStrategies(): DecisionStrategy[] {
    return Array.from(this.strategies.values()).filter(s => s.enabled);
  }

  public updateStrategy(strategyId: string, updates: Partial<DecisionStrategy>): void {
    const existingStrategy = this.strategies.get(strategyId);
    if (!existingStrategy) {
      throw new Error(`Strategy not found: ${strategyId}`);
    }

    const updatedStrategy: DecisionStrategy = {
      ...existingStrategy,
      ...updates,
      id: strategyId,
    };

    this.strategies.set(strategyId, updatedStrategy);
    this.emit('strategy-updated', updatedStrategy);
  }

  public enableStrategy(strategyId: string): void {
    const strategy = this.strategies.get(strategyId);
    if (!strategy) {
      throw new Error(`Strategy not found: ${strategyId}`);
    }
    strategy.enabled = true;
    this.metrics.activeStrategies++;
    this.emit('strategy-enabled', strategy);
  }

  public disableStrategy(strategyId: string): void {
    const strategy = this.strategies.get(strategyId);
    if (!strategy) {
      throw new Error(`Strategy not found: ${strategyId}`);
    }
    strategy.enabled = false;
    this.metrics.activeStrategies--;
    this.emit('strategy-disabled', strategy);
  }

  public removeStrategy(strategyId: string): void {
    const removed = this.strategies.delete(strategyId);
    if (removed) {
      this.metrics.totalStrategies--;
      this.metrics.strategyUsage.delete(strategyId);
      this.metrics.strategyAccuracy.delete(strategyId);
      this.emit('strategy-removed', strategyId);
    }
  }

  public getMetrics(): StrategyMetrics {
    return {
      ...this.metrics,
      strategyUsage: new Map(this.metrics.strategyUsage),
      strategyAccuracy: new Map(this.metrics.strategyAccuracy),
    };
  }

  public getDecisionHistory(limit?: number): Array<{ timestamp: number; result: DecisionStrategyResult }> {
    const history = [...this.decisionHistory].reverse();
    return limit ? history.slice(0, limit) : history;
  }

  public getConfig(): DecisionStrategyManagerConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<DecisionStrategyManagerConfig>): void {
    this.config = { ...this.config, ...updates };
    this.emit('config-updated', this.config);
  }

  public async reset(): Promise<void> {
    this.strategies.clear();
    this.decisionHistory = [];
    this.metrics = this.initializeMetrics();
    await this.loadDefaultStrategies();
    this.emit('reset', this.metrics);
  }
}

class RiskBasedStrategy {
  constructor(private config: DecisionStrategyManagerConfig) {}

  async decide(
    strategy: DecisionStrategy,
    context: DecisionContext,
    options: DecisionOption[]
  ): Promise<DecisionStrategyResult> {
    const scoredOptions = options.map(option => {
      const riskScore = this.calculateRiskScore(option, context);
      const benefitScore = this.calculateBenefitScore(option, context);
      const costScore = this.calculateCostScore(option, context);
      const reliabilityScore = this.calculateReliabilityScore(option, context);

      const utility = (
        riskScore * (strategy.weights.get('risk') || 0.4) +
        benefitScore * (strategy.weights.get('benefit') || 0.3) +
        costScore * (strategy.weights.get('cost') || 0.2) +
        reliabilityScore * (strategy.weights.get('reliability') || 0.1)
      );

      return {
        option,
        riskScore,
        benefitScore,
        costScore,
        reliabilityScore,
        utility,
      };
    });

    scoredOptions.sort((a, b) => b.utility - a.utility);

    const selected = scoredOptions[0];
    const selectedOption = {
      ...selected.option,
      riskScore: selected.riskScore,
      utility: selected.utility,
    };

    const alternatives = scoredOptions.slice(1, 4).map(s => s.option);

    return {
      strategyId: '',
      strategyName: '',
      selectedOption,
      alternatives,
      confidence: selected.option.confidence * 0.9,
      reasoning: [
        `Selected option: ${selectedOption.name}`,
        `Risk score: ${selected.riskScore.toFixed(2)}`,
        `Benefit score: ${selected.benefitScore.toFixed(2)}`,
        `Cost score: ${selected.costScore.toFixed(2)}`,
        `Reliability score: ${selected.reliabilityScore.toFixed(2)}`,
        `Utility: ${selected.utility.toFixed(2)}`,
      ],
      metrics: {
        utility: selected.utility,
        riskScore: selected.riskScore,
        expectedBenefit: selected.benefitScore,
        expectedCost: selected.costScore,
      },
      executionTime: 0,
    };
  }

  private calculateRiskScore(option: DecisionOption, context: DecisionContext): number {
    const riskLevels = { low: 0.2, medium: 0.5, high: 0.8, critical: 1.0 };
    const baseRisk = riskLevels[option.riskLevel];

    const riskTolerance = context.preferences?.riskTolerance || 'medium';
    const toleranceMultiplier = { low: 1.5, medium: 1.0, high: 0.7 }[riskTolerance];

    const constraintRisk = context.constraints?.maxRisk
      ? Math.max(0, (baseRisk - context.constraints.maxRisk) / context.constraints.maxRisk)
      : 0;

    return Math.min(1, baseRisk * toleranceMultiplier + constraintRisk * 0.3);
  }

  private calculateBenefitScore(option: DecisionOption, context: DecisionContext): number {
    return option.expectedBenefit || 0.5;
  }

  private calculateCostScore(option: DecisionOption, context: DecisionContext): number {
    const cost = option.expectedCost || 0.5;
    const maxCost = context.constraints?.maxCost || 1.0;
    return Math.min(1, cost / maxCost);
  }

  private calculateReliabilityScore(option: DecisionOption, context: DecisionContext): number {
    return option.expectedImpact.reliability || 0.8;
  }
}

class UtilityBasedStrategy {
  constructor(private config: DecisionStrategyManagerConfig) {}

  async decide(
    strategy: DecisionStrategy,
    context: DecisionContext,
    options: DecisionOption[]
  ): Promise<DecisionStrategyResult> {
    const scoredOptions = options.map(option => {
      const utility = this.calculateUtility(option, strategy.weights, context);

      return {
        option,
        utility,
      };
    });

    scoredOptions.sort((a, b) => b.utility - a.utility);

    const selected = scoredOptions[0];
    const selectedOption = {
      ...selected.option,
      utility: selected.utility,
    };

    const alternatives = scoredOptions.slice(1, 4).map(s => s.option);

    return {
      strategyId: '',
      strategyName: '',
      selectedOption,
      alternatives,
      confidence: selected.option.confidence * 0.95,
      reasoning: [
        `Selected option: ${selectedOption.name}`,
        `Utility: ${selected.utility.toFixed(2)}`,
        `Performance: ${selectedOption.expectedImpact.performance.toFixed(2)}`,
        `User Experience: ${selectedOption.expectedImpact.userExperience.toFixed(2)}`,
        `Resource Usage: ${selectedOption.expectedImpact.resourceUsage.toFixed(2)}`,
      ],
      metrics: {
        utility: selected.utility,
        riskScore: 0.5,
        expectedBenefit: selectedOption.expectedBenefit,
        expectedCost: selectedOption.expectedCost,
      },
      executionTime: 0,
    };
  }

  private calculateUtility(option: DecisionOption, weights: Map<string, number>, context: DecisionContext): number {
    const customWeights = context.preferences?.customWeights;

    let utility = 0;

    for (const [key, weight] of weights.entries()) {
      const actualWeight = customWeights?.get(key) || weight;
      const value = this.getImpactValue(option, key);
      utility += value * actualWeight;
    }

    return Math.min(1, utility);
  }

  private getImpactValue(option: DecisionOption, key: string): number {
    const impact = option.expectedImpact;
    switch (key) {
      case 'performance':
        return impact.performance;
      case 'userExperience':
        return impact.userExperience;
      case 'resourceUsage':
        return 1 - impact.resourceUsage;
      case 'cost':
        return 1 - impact.cost;
      case 'reliability':
        return impact.reliability;
      default:
        return 0.5;
    }
  }
}

class MultiObjectiveStrategy {
  constructor(private config: DecisionStrategyManagerConfig) {}

  async decide(
    strategy: DecisionStrategy,
    context: DecisionContext,
    options: DecisionOption[]
  ): Promise<DecisionStrategyResult> {
    const objectives = context.objectives || [
      { id: 'performance', name: 'Performance', type: 'maximize', weight: 0.24, importance: 'high' },
      { id: 'userExperience', name: 'User Experience', type: 'maximize', weight: 0.29, importance: 'high' },
      { id: 'resourceUsage', name: 'Resource Usage', type: 'minimize', weight: 0.21, importance: 'medium' },
      { id: 'cost', name: 'Cost', type: 'minimize', weight: 0.15, importance: 'medium' },
      { id: 'reliability', name: 'Reliability', type: 'maximize', weight: 0.11, importance: 'medium' },
    ];

    const paretoFront = this.calculateParetoFront(options, objectives);
    const selected = this.selectFromParetoFront(paretoFront, objectives, context);

    const selectedOption = {
      ...selected,
      utility: this.calculateAggregateUtility(selected, objectives),
    };

    const alternatives = paretoFront.slice(0, 4).filter(o => o.id !== selected.id);

    return {
      strategyId: '',
      strategyName: '',
      selectedOption,
      alternatives,
      confidence: selectedOption.confidence * 0.97,
      reasoning: [
        `Selected option: ${selectedOption.name}`,
        `Pareto optimal solution`,
        `Aggregate utility: ${selectedOption.utility.toFixed(2)}`,
        `Multi-objective optimization applied`,
      ],
      metrics: {
        utility: selectedOption.utility,
        riskScore: 0.5,
        expectedBenefit: selectedOption.expectedBenefit,
        expectedCost: selectedOption.expectedCost,
      },
      executionTime: 0,
    };
  }

  private calculateParetoFront(options: DecisionOption[], objectives: DecisionObjectives[]): DecisionOption[] {
    const paretoFront: DecisionOption[] = [];

    for (const option of options) {
      let isDominated = false;

      for (const other of options) {
        if (option.id === other.id) continue;

        let dominates = true;
        for (const objective of objectives) {
          const optionValue = this.getObjectiveValue(option, objective);
          const otherValue = this.getObjectiveValue(other, objective);

          if (objective.type === 'maximize' && optionValue > otherValue) {
            dominates = false;
            break;
          } else if (objective.type === 'minimize' && optionValue < otherValue) {
            dominates = false;
            break;
          }
        }

        if (dominates) {
          isDominated = true;
          break;
        }
      }

      if (!isDominated) {
        paretoFront.push(option);
      }
    }

    return paretoFront;
  }

  private getObjectiveValue(option: DecisionOption, objective: DecisionObjectives): number {
    const impact = option.expectedImpact;
    switch (objective.id) {
      case 'performance':
        return impact.performance;
      case 'userExperience':
        return impact.userExperience;
      case 'resourceUsage':
        return impact.resourceUsage;
      case 'cost':
        return impact.cost;
      case 'reliability':
        return impact.reliability;
      default:
        return 0.5;
    }
  }

  private selectFromParetoFront(paretoFront: DecisionOption[], objectives: DecisionObjectives[], context: DecisionContext): DecisionOption {
    const scoredOptions = paretoFront.map(option => ({
      option,
      score: this.calculateAggregateUtility(option, objectives),
    }));

    scoredOptions.sort((a, b) => b.score - a.score);

    return scoredOptions[0].option;
  }

  private calculateAggregateUtility(option: DecisionOption, objectives: DecisionObjectives[]): number {
    let utility = 0;

    for (const objective of objectives) {
      const value = this.getObjectiveValue(option, objective);
      utility += value * objective.weight;
    }

    return Math.min(1, utility);
  }
}

class GameTheoreticStrategy {
  constructor(private config: DecisionStrategyManagerConfig) {}

  async decide(
    strategy: DecisionStrategy,
    context: DecisionContext,
    options: DecisionOption[]
  ): Promise<DecisionStrategyResult> {
    const payoffMatrix = this.calculatePayoffMatrix(options);
    const nashEquilibrium = this.findNashEquilibrium(payoffMatrix);

    const selectedOption = options.find(o => o.id === nashEquilibrium) || options[0];
    const selectedOptionWithUtility = {
      ...selectedOption,
      utility: this.calculateUtility(selectedOption, strategy.weights),
    };

    const alternatives = options.filter(o => o.id !== selectedOption.id).slice(0, 3);

    return {
      strategyId: '',
      strategyName: '',
      selectedOption: selectedOptionWithUtility,
      alternatives,
      confidence: selectedOption.confidence * 0.86,
      reasoning: [
        `Selected option: ${selectedOption.name}`,
        `Nash equilibrium solution`,
        `Game-theoretic analysis applied`,
        `Cooperative game strategy`,
      ],
      metrics: {
        utility: selectedOptionWithUtility.utility,
        riskScore: 0.5,
        expectedBenefit: selectedOption.expectedBenefit,
        expectedCost: selectedOption.expectedCost,
      },
      executionTime: 0,
    };
  }

  private calculatePayoffMatrix(options: DecisionOption[]): Map<string, Map<string, number>> {
    const matrix = new Map<string, Map<string, number>>();

    for (const option1 of options) {
      const row = new Map<string, number>();
      for (const option2 of options) {
        const payoff = this.calculatePayoff(option1, option2);
        row.set(option2.id, payoff);
      }
      matrix.set(option1.id, row);
    }

    return matrix;
  }

  private calculatePayoff(option1: DecisionOption, option2: DecisionOption): number {
    const benefit1 = option1.expectedBenefit || 0.5;
    const benefit2 = option2.expectedBenefit || 0.5;
    const cost1 = option1.expectedCost || 0.5;
    const cost2 = option2.expectedCost || 0.5;

    return (benefit1 - cost1) * 0.6 + (benefit2 - cost2) * 0.4;
  }

  private findNashEquilibrium(payoffMatrix: Map<string, Map<string, number>>): string {
    let bestOption = '';
    let bestPayoff = -Infinity;

    for (const [optionId, row] of payoffMatrix.entries()) {
      const minPayoff = Math.min(...row.values());
      if (minPayoff > bestPayoff) {
        bestPayoff = minPayoff;
        bestOption = optionId;
      }
    }

    return bestOption;
  }

  private calculateUtility(option: DecisionOption, weights: Map<string, number>): number {
    let utility = 0;
    for (const [key, weight] of weights.entries()) {
      const value = this.getImpactValue(option, key);
      utility += value * weight;
    }
    return Math.min(1, utility);
  }

  private getImpactValue(option: DecisionOption, key: string): number {
    const impact = option.expectedImpact;
    switch (key) {
      case 'performance':
        return impact.performance;
      case 'userExperience':
        return impact.userExperience;
      case 'resourceUsage':
        return 1 - impact.resourceUsage;
      case 'cost':
        return 1 - impact.cost;
      case 'reliability':
        return impact.reliability;
      default:
        return 0.5;
    }
  }
}

class ReinforcementLearningStrategy {
  constructor(private config: DecisionStrategyManagerConfig) {}

  async decide(
    strategy: DecisionStrategy,
    context: DecisionContext,
    options: DecisionOption[]
  ): Promise<DecisionStrategyResult> {
    const qValues = this.calculateQValues(options, context);

    const selectedOption = this.selectOption(options, qValues);
    const selectedOptionWithUtility = {
      ...selectedOption,
      utility: this.calculateUtility(selectedOption, strategy.weights),
    };

    const alternatives = options
      .filter(o => o.id !== selectedOption.id)
      .sort((a, b) => (qValues.get(b.id) || 0) - (qValues.get(a.id) || 0))
      .slice(0, 3);

    return {
      strategyId: '',
      strategyName: '',
      selectedOption: selectedOptionWithUtility,
      alternatives,
      confidence: selectedOption.confidence * 0.91,
      reasoning: [
        `Selected option: ${selectedOption.name}`,
        `Q-value: ${(qValues.get(selectedOption.id) || 0).toFixed(2)}`,
        `Reinforcement learning applied`,
        `Exploration-exploitation balance`,
      ],
      metrics: {
        utility: selectedOptionWithUtility.utility,
        riskScore: 0.5,
        expectedBenefit: selectedOption.expectedBenefit,
        expectedCost: selectedOption.expectedCost,
      },
      executionTime: 0,
    };
  }

  private calculateQValues(options: DecisionOption[], context: DecisionContext): Map<string, number> {
    const qValues = new Map<string, number>();

    for (const option of options) {
      const reward = this.calculateReward(option, context);
      const qValue = reward + (Math.random() - 0.5) * 0.1;
      qValues.set(option.id, qValue);
    }

    return qValues;
  }

  private calculateReward(option: DecisionOption, context: DecisionContext): number {
    const benefit = option.expectedBenefit || 0.5;
    const cost = option.expectedCost || 0.5;
    const reliability = option.expectedImpact.reliability || 0.8;

    return (benefit - cost) * 0.6 + reliability * 0.4;
  }

  private selectOption(options: DecisionOption[], qValues: Map<string, number>): DecisionOption {
    const explorationRate = 0.1;

    if (Math.random() < explorationRate) {
      return options[Math.floor(Math.random() * options.length)];
    }

    let bestOption = options[0];
    let bestQValue = qValues.get(bestOption.id) || 0;

    for (const option of options) {
      const qValue = qValues.get(option.id) || 0;
      if (qValue > bestQValue) {
        bestQValue = qValue;
        bestOption = option;
      }
    }

    return bestOption;
  }

  private calculateUtility(option: DecisionOption, weights: Map<string, number>): number {
    let utility = 0;
    for (const [key, weight] of weights.entries()) {
      const value = this.getImpactValue(option, key);
      utility += value * weight;
    }
    return Math.min(1, utility);
  }

  private getImpactValue(option: DecisionOption, key: string): number {
    const impact = option.expectedImpact;
    switch (key) {
      case 'performance':
        return impact.performance;
      case 'userExperience':
        return impact.userExperience;
      case 'resourceUsage':
        return 1 - impact.resourceUsage;
      case 'cost':
        return 1 - impact.cost;
      case 'reliability':
        return impact.reliability;
      default:
        return 0.5;
    }
  }
}

class HeuristicStrategy {
  constructor(private config: DecisionStrategyManagerConfig) {}

  async decide(
    strategy: DecisionStrategy,
    context: DecisionContext,
    options: DecisionOption[]
  ): Promise<DecisionStrategyResult> {
    const scoredOptions = options.map(option => {
      const score = this.calculateHeuristicScore(option, context);
      return {
        option,
        score,
      };
    });

    scoredOptions.sort((a, b) => b.score - a.score);

    const selected = scoredOptions[0];
    const selectedOption = {
      ...selected.option,
      utility: selected.score,
    };

    const alternatives = scoredOptions.slice(1, 4).map(s => s.option);

    return {
      strategyId: '',
      strategyName: '',
      selectedOption,
      alternatives,
      confidence: selected.option.confidence * 0.84,
      reasoning: [
        `Selected option: ${selectedOption.name}`,
        `Heuristic score: ${selected.score.toFixed(2)}`,
        `Rule-based decision making`,
        `Fast and efficient`,
      ],
      metrics: {
        utility: selected.score,
        riskScore: 0.5,
        expectedBenefit: selectedOption.expectedBenefit,
        expectedCost: selectedOption.expectedCost,
      },
      executionTime: 0,
    };
  }

  private calculateHeuristicScore(option: DecisionOption, context: DecisionContext): number {
    const performanceScore = option.expectedImpact.performance * 0.25;
    const userExperienceScore = option.expectedImpact.userExperience * 0.30;
    const resourceScore = (1 - option.expectedImpact.resourceUsage) * 0.20;
    const costScore = (1 - option.expectedImpact.cost) * 0.15;
    const reliabilityScore = option.expectedImpact.reliability * 0.10;

    return performanceScore + userExperienceScore + resourceScore + costScore + reliabilityScore;
  }
}

class MetaHeuristicStrategy {
  constructor(private config: DecisionStrategyManagerConfig) {}

  async decide(
    strategy: DecisionStrategy,
    context: DecisionContext,
    options: DecisionOption[]
  ): Promise<DecisionStrategyResult> {
    const optimizedOptions = await this.geneticAlgorithm(options, context);

    const selectedOption = {
      ...optimizedOptions[0],
      utility: this.calculateFitness(optimizedOptions[0], context),
    };

    const alternatives = optimizedOptions.slice(1, 4);

    return {
      strategyId: '',
      strategyName: '',
      selectedOption,
      alternatives,
      confidence: selectedOption.confidence * 0.89,
      reasoning: [
        `Selected option: ${selectedOption.name}`,
        `Genetic algorithm optimization`,
        `Fitness: ${selectedOption.utility.toFixed(2)}`,
        `Meta-heuristic search applied`,
      ],
      metrics: {
        utility: selectedOption.utility,
        riskScore: 0.5,
        expectedBenefit: selectedOption.expectedBenefit,
        expectedCost: selectedOption.expectedCost,
      },
      executionTime: 0,
    };
  }

  private async geneticAlgorithm(options: DecisionOption[], context: DecisionContext): Promise<DecisionOption[]> {
    const populationSize = 20;
    const generations = 50;
    const mutationRate = 0.1;

    let population = this.initializePopulation(options, populationSize);

    for (let gen = 0; gen < generations; gen++) {
      const fitnessScores = population.map(option => ({
        option,
        fitness: this.calculateFitness(option, context),
      }));

      fitnessScores.sort((a, b) => b.fitness - a.fitness);

      const selected = this.selection(fitnessScores);
      const offspring = this.crossover(selected);
      const mutated = this.mutation(offspring, mutationRate);

      population = [...selected, ...mutated].slice(0, populationSize);
    }

    const finalFitnessScores = population.map(option => ({
      option,
      fitness: this.calculateFitness(option, context),
    }));

    finalFitnessScores.sort((a, b) => b.fitness - a.fitness);

    return finalFitnessScores.slice(0, 10).map(fs => fs.option);
  }

  private initializePopulation(options: DecisionOption[], size: number): DecisionOption[] {
    const population: DecisionOption[] = [];

    for (let i = 0; i < size; i++) {
      const baseOption = options[i % options.length];
      const mutatedOption = this.mutateOption(baseOption, 0.2);
      population.push(mutatedOption);
    }

    return population;
  }

  private calculateFitness(option: DecisionOption, context: DecisionContext): number {
    const performance = option.expectedImpact.performance * 0.25;
    const userExperience = option.expectedImpact.userExperience * 0.30;
    const resourceUsage = (1 - option.expectedImpact.resourceUsage) * 0.20;
    const cost = (1 - option.expectedImpact.cost) * 0.15;
    const reliability = option.expectedImpact.reliability * 0.10;

    return performance + userExperience + resourceUsage + cost + reliability;
  }

  private selection(fitnessScores: Array<{ option: DecisionOption; fitness: number }>): DecisionOption[] {
    const eliteCount = Math.floor(fitnessScores.length * 0.2);
    const elite = fitnessScores.slice(0, eliteCount).map(fs => fs.option);

    const tournamentSize = 5;
    const selected: DecisionOption[] = [...elite];

    while (selected.length < fitnessScores.length / 2) {
      const tournament = [];
      for (let i = 0; i < tournamentSize; i++) {
        const randomIndex = Math.floor(Math.random() * fitnessScores.length);
        tournament.push(fitnessScores[randomIndex]);
      }

      const winner = tournament.sort((a, b) => b.fitness - a.fitness)[0];
      selected.push(winner.option);
    }

    return selected;
  }

  private crossover(parents: DecisionOption[]): DecisionOption[] {
    const offspring: DecisionOption[] = [];

    for (let i = 0; i < parents.length - 1; i += 2) {
      const parent1 = parents[i];
      const parent2 = parents[i + 1];

      const child1 = this.crossoverOptions(parent1, parent2);
      const child2 = this.crossoverOptions(parent2, parent1);

      offspring.push(child1, child2);
    }

    return offspring;
  }

  private crossoverOptions(parent1: DecisionOption, parent2: DecisionOption): DecisionOption {
    const crossoverPoint = Math.floor(Math.random() * 5);

    const impact = {
      performance: crossoverPoint > 0 ? parent1.expectedImpact.performance : parent2.expectedImpact.performance,
      userExperience: crossoverPoint > 1 ? parent1.expectedImpact.userExperience : parent2.expectedImpact.userExperience,
      resourceUsage: crossoverPoint > 2 ? parent1.expectedImpact.resourceUsage : parent2.expectedImpact.resourceUsage,
      cost: crossoverPoint > 3 ? parent1.expectedImpact.cost : parent2.expectedImpact.cost,
      reliability: crossoverPoint > 4 ? parent1.expectedImpact.reliability : parent2.expectedImpact.reliability,
      overall: 0,
    };

    impact.overall = (
      impact.performance * 0.25 +
      impact.userExperience * 0.30 +
      impact.resourceUsage * 0.20 +
      impact.cost * 0.15 +
      impact.reliability * 0.10
    );

    return {
      ...parent1,
      expectedImpact: impact,
    };
  }

  private mutation(options: DecisionOption[], mutationRate: number): DecisionOption[] {
    return options.map(option => {
      if (Math.random() < mutationRate) {
        return this.mutateOption(option, 0.1);
      }
      return option;
    });
  }

  private mutateOption(option: DecisionOption, mutationAmount: number): DecisionOption {
    const mutatedImpact = { ...option.expectedImpact };

    mutatedImpact.performance = Math.max(0, Math.min(1, mutatedImpact.performance + (Math.random() - 0.5) * mutationAmount));
    mutatedImpact.userExperience = Math.max(0, Math.min(1, mutatedImpact.userExperience + (Math.random() - 0.5) * mutationAmount));
    mutatedImpact.resourceUsage = Math.max(0, Math.min(1, mutatedImpact.resourceUsage + (Math.random() - 0.5) * mutationAmount));
    mutatedImpact.cost = Math.max(0, Math.min(1, mutatedImpact.cost + (Math.random() - 0.5) * mutationAmount));
    mutatedImpact.reliability = Math.max(0, Math.min(1, mutatedImpact.reliability + (Math.random() - 0.5) * mutationAmount));

    mutatedImpact.overall = (
      mutatedImpact.performance * 0.25 +
      mutatedImpact.userExperience * 0.30 +
      mutatedImpact.resourceUsage * 0.20 +
      mutatedImpact.cost * 0.15 +
      mutatedImpact.reliability * 0.10
    );

    return {
      ...option,
      expectedImpact: mutatedImpact,
    };
  }
}

class StrategySelector {
  constructor(private config: DecisionStrategyManagerConfig) {}

  async select(strategies: Map<string, DecisionStrategy>, context: DecisionContext): Promise<DecisionStrategy | null> {
    const activeStrategies = Array.from(strategies.values()).filter(s => s.enabled);

    if (activeStrategies.length === 0) {
      return null;
    }

    switch (this.config.strategySelectionMethod) {
      case 'accuracy':
        return this.selectByAccuracy(activeStrategies);
      case 'usage':
        return this.selectByUsage(activeStrategies);
      case 'adaptive':
        return this.selectAdaptively(activeStrategies, context);
      case 'manual':
        return this.selectManually(activeStrategies, context);
      default:
        return this.selectAdaptively(activeStrategies, context);
    }
  }

  private selectByAccuracy(strategies: DecisionStrategy[]): DecisionStrategy {
    return strategies.reduce((best, current) =>
      current.accuracy > best.accuracy ? current : best
    );
  }

  private selectByUsage(strategies: DecisionStrategy[]): DecisionStrategy {
    return strategies.reduce((best, current) =>
      current.usageCount > best.usageCount ? current : best
    );
  }

  private selectAdaptively(strategies: DecisionStrategy[], context: DecisionContext): DecisionStrategy {
    const scoredStrategies = strategies.map(strategy => {
      const accuracyScore = strategy.accuracy * 0.4;
      const usageScore = Math.min(1, strategy.usageCount / 100) * 0.3;
      const recencyScore = Math.min(1, (Date.now() - strategy.lastUsedAt) / (7 * 24 * 60 * 60 * 1000)) * 0.2;
      const priorityScore = strategy.priority / 10 * 0.1;

      const totalScore = accuracyScore + usageScore + recencyScore + priorityScore;

      return { strategy, score: totalScore };
    });

    scoredStrategies.sort((a, b) => b.score - a.score);

    return scoredStrategies[0].strategy;
  }

  private selectManually(strategies: DecisionStrategy[], context: DecisionContext): DecisionStrategy {
    const defaultStrategy = strategies.find(s => s.id === this.config.defaultStrategy);
    return defaultStrategy || strategies[0];
  }
}

class StrategyOptimizer {
  constructor(private config: DecisionStrategyManagerConfig) {}

  async optimize(strategy: DecisionStrategy, history: Array<{ timestamp: number; result: DecisionStrategyResult }>): Promise<DecisionStrategy> {
    const strategyHistory = history.filter(h => h.result.strategyId === strategy.id);

    if (strategyHistory.length < 10) {
      return strategy;
    }

    const recentHistory = strategyHistory.slice(-50);
    const avgConfidence = recentHistory.reduce((sum, h) => sum + h.result.confidence, 0) / recentHistory.length;

    const optimizedStrategy = { ...strategy };
    optimizedStrategy.accuracy = avgConfidence;

    return optimizedStrategy;
  }
}

export default DecisionStrategyManager;
