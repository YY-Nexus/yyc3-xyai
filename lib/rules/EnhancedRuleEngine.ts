/**
 * @file EnhancedRuleEngine.ts
 * @description YYC³ AI浮窗系统增强规则引擎 - 扩展规则类型与条件
 * @module lib/rules
 * @author YYC³
 * @version 2.0.0
 * @created 2026-01-20
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { EventEmitter } from 'events';

export interface RuleCondition {
  id: string;
  type: 'simple' | 'composite' | 'temporal' | 'statistical' | 'fuzzy' | 'machine-learning' | 'behavioral' | 'contextual';
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'contains' | 'between' | 'regex' | 'fuzzy-match' | 'ml-predict' | 'pattern-match';
  value?: unknown;
  threshold?: number;
  timeWindow?: number;
  aggregation?: 'avg' | 'sum' | 'count' | 'min' | 'max' | 'std' | 'median' | 'percentile';
  logicalOperator?: 'and' | 'or' | 'not' | 'xor';
  conditions?: RuleCondition[];
  fuzzySet?: 'low' | 'medium' | 'high';
  mlModel?: string;
  confidence?: number;
  pattern?: string;
  weight?: number;
}

export interface RuleAction {
  id: string;
  type: 'ui-adjustment' | 'resource-allocation' | 'feature-prioritization' | 'behavior-change' | 'performance-optimization' | 'notification' | 'logging' | 'data-collection' | 'ai-trigger' | 'custom';
  target: string;
  parameters: Record<string, unknown>;
  priority: number;
  delay?: number;
  duration?: number;
  rollback?: boolean;
  retryCount?: number;
  retryDelay?: number;
  conditions?: RuleCondition[];
  onSuccess?: RuleAction[];
  onFailure?: RuleAction[];
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'user-experience' | 'resource' | 'security' | 'behavioral' | 'contextual' | 'ai-driven' | 'custom';
  conditions: RuleCondition;
  actions: RuleAction[];
  priority: number;
  enabled: boolean;
  version: string;
  createdAt: number;
  updatedAt: number;
  metadata?: Record<string, unknown>;
  statistics?: RuleStatistics;
  dependencies?: string[];
  tags?: string[];
  owner?: string;
  reviewStatus?: 'draft' | 'pending' | 'approved' | 'deprecated';
}

export interface RuleStatistics {
  triggeredCount: number;
  executedCount: number;
  failedCount: number;
  avgExecutionTime: number;
  lastTriggeredAt?: number;
  lastExecutedAt?: number;
  successRate: number;
  avgConfidence: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
}

export interface RuleContext {
  timestamp: number;
  environment: Record<string, unknown>;
  user: Record<string, unknown>;
  system: Record<string, unknown>;
  history: Array<{ timestamp: number; data: Record<string, unknown> }>;
  behavioral?: Record<string, unknown>;
  contextual?: Record<string, unknown>;
  predictions?: Record<string, unknown>;
}

export interface RuleEvaluationResult {
  ruleId: string;
  matched: boolean;
  confidence: number;
  conditions: Array<{
    conditionId: string;
    matched: boolean;
    value?: unknown;
    expected?: unknown;
    confidence?: number;
  }>;
  timestamp: number;
  evaluationTime: number;
}

export interface RuleExecutionResult {
  ruleId: string;
  actionId: string;
  success: boolean;
  error?: Error;
  executionTime: number;
  rollback?: boolean;
  rollbackSuccess?: boolean;
  rollbackError?: Error;
  timestamp: number;
  retryCount?: number;
  output?: unknown;
}

export interface RuleConflict {
  type: 'priority' | 'resource' | 'mutual-exclusion' | 'dependency' | 'logical' | 'temporal';
  rules: string[];
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolution?: ConflictResolution;
}

export interface ConflictResolution {
  strategy: 'priority' | 'merge' | 'sequential' | 'parallel' | 'custom' | 'voting';
  selectedRules: string[];
  mergedActions?: RuleAction[];
  customLogic?: string;
  votingWeights?: Map<string, number>;
}

export interface EnhancedRuleEngineConfig {
  maxHistorySize: number;
  evaluationTimeout: number;
  executionTimeout: number;
  conflictResolutionStrategy: 'priority' | 'merge' | 'sequential' | 'parallel' | 'voting';
  enableStatistics: boolean;
  enableRollback: boolean;
  enableLogging: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enableMachineLearning: boolean;
  enableBehavioralAnalysis: boolean;
  enableContextualAnalysis: boolean;
  enableFuzzyLogic: boolean;
  enableRetry: boolean;
  maxRetryCount: number;
  retryDelay: number;
  enableRuleVersioning: boolean;
  enableRuleDependencies: boolean;
}

export class EnhancedRuleEngine extends EventEmitter {
  private static instance: EnhancedRuleEngine;
  private rules: Map<string, Rule> = new Map();
  private ruleHistory: Array<{ timestamp: number; ruleId: string; result: RuleEvaluationResult }> = [];
  private executionHistory: Array<{ timestamp: number; result: RuleExecutionResult }> = [];
  private config: EnhancedRuleEngineConfig;
  private conflictResolver: EnhancedConflictResolver;
  private conditionEvaluator: EnhancedConditionEvaluator;
  private actionExecutor: EnhancedActionExecutor;
  private ruleDependencyManager: RuleDependencyManager;
  private ruleVersionManager: RuleVersionManager;
  private ruleValidator: RuleValidator;
  private ruleOptimizer: RuleOptimizer;

  private constructor(config?: Partial<EnhancedRuleEngineConfig>) {
    super();
    this.config = this.initializeConfig(config);
    this.conflictResolver = new EnhancedConflictResolver(this.config);
    this.conditionEvaluator = new EnhancedConditionEvaluator(this.config);
    this.actionExecutor = new EnhancedActionExecutor(this.config);
    this.ruleDependencyManager = new RuleDependencyManager(this.config);
    this.ruleVersionManager = new RuleVersionManager(this.config);
    this.ruleValidator = new RuleValidator(this.config);
    this.ruleOptimizer = new RuleOptimizer(this.config);
    this.initialize();
  }

  static getInstance(config?: Partial<EnhancedRuleEngineConfig>): EnhancedRuleEngine {
    if (!EnhancedRuleEngine.instance) {
      EnhancedRuleEngine.instance = new EnhancedRuleEngine(config);
    }
    return EnhancedRuleEngine.instance;
  }

  private initializeConfig(config?: Partial<EnhancedRuleEngineConfig>): EnhancedRuleEngineConfig {
    return {
      maxHistorySize: 2000,
      evaluationTimeout: 5000,
      executionTimeout: 10000,
      conflictResolutionStrategy: 'priority',
      enableStatistics: true,
      enableRollback: true,
      enableLogging: true,
      logLevel: 'info',
      enableMachineLearning: true,
      enableBehavioralAnalysis: true,
      enableContextualAnalysis: true,
      enableFuzzyLogic: true,
      enableRetry: true,
      maxRetryCount: 3,
      retryDelay: 1000,
      enableRuleVersioning: true,
      enableRuleDependencies: true,
      ...config,
    };
  }

  private async initialize(): Promise<void> {
    await this.loadDefaultRules();
    this.emit('initialized', this.getStatistics());
  }

  private async loadDefaultRules(): Promise<void> {
    const defaultRules: Rule[] = [
      {
        id: 'rule-mobile-optimization',
        name: 'Mobile Optimization',
        description: 'Optimize UI for mobile devices with adaptive layout',
        category: 'user-experience',
        conditions: {
          id: 'cond-mobile-device',
          type: 'simple',
          field: 'environment.device.type',
          operator: 'eq',
          value: 'mobile',
          weight: 1.0,
        },
        actions: [
          {
            id: 'action-compact-ui',
            type: 'ui-adjustment',
            target: 'widget',
            parameters: {
              compactMode: true,
              fontSize: 'small',
              animations: false,
              adaptiveLayout: true,
            },
            priority: 10,
            retryCount: 2,
          },
        ],
        priority: 10,
        enabled: true,
        version: '2.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        statistics: {
          triggeredCount: 0,
          executedCount: 0,
          failedCount: 0,
          avgExecutionTime: 0,
          successRate: 1,
          avgConfidence: 1,
          falsePositiveRate: 0,
          falseNegativeRate: 0,
        },
        tags: ['ui', 'mobile', 'responsive'],
      },
      {
        id: 'rule-low-network-optimization',
        name: 'Low Network Optimization',
        description: 'Optimize for slow network with adaptive quality',
        category: 'performance',
        conditions: {
          id: 'cond-slow-network',
          type: 'simple',
          field: 'environment.network.speed',
          operator: 'eq',
          value: 'slow',
          weight: 1.0,
        },
        actions: [
          {
            id: 'action-lazy-loading',
            type: 'performance-optimization',
            target: 'system',
            parameters: {
              lazyLoading: true,
              imageCompression: true,
              requestCaching: true,
              adaptiveQuality: true,
            },
            priority: 9,
            retryCount: 2,
          },
        ],
        priority: 9,
        enabled: true,
        version: '2.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        statistics: {
          triggeredCount: 0,
          executedCount: 0,
          failedCount: 0,
          avgExecutionTime: 0,
          successRate: 1,
          avgConfidence: 1,
          falsePositiveRate: 0,
          falseNegativeRate: 0,
        },
        tags: ['performance', 'network', 'optimization'],
      },
      {
        id: 'rule-battery-saving',
        name: 'Battery Saving',
        description: 'Enable battery saving mode with adaptive features',
        category: 'resource',
        conditions: {
          id: 'cond-low-battery',
          type: 'simple',
          field: 'environment.device.battery.level',
          operator: 'lt',
          threshold: 20,
          weight: 1.0,
        },
        actions: [
          {
            id: 'action-power-save',
            type: 'resource-allocation',
            target: 'system',
            parameters: {
              performanceMode: 'power-saving',
              animations: false,
              backgroundSync: false,
              adaptiveRefreshRate: true,
            },
            priority: 8,
            retryCount: 1,
          },
        ],
        priority: 8,
        enabled: true,
        version: '2.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        statistics: {
          triggeredCount: 0,
          executedCount: 0,
          failedCount: 0,
          avgExecutionTime: 0,
          successRate: 1,
          avgConfidence: 1,
          falsePositiveRate: 0,
          falseNegativeRate: 0,
        },
        tags: ['resource', 'battery', 'power'],
      },
      {
        id: 'rule-work-hours-focus',
        name: 'Work Hours Focus',
        description: 'Focus mode during work hours with adaptive notifications',
        category: 'user-experience',
        conditions: {
          id: 'cond-work-hours',
          type: 'simple',
          field: 'environment.time.isWorkHours',
          operator: 'eq',
          value: true,
          weight: 1.0,
        },
        actions: [
          {
            id: 'action-focus-mode',
            type: 'feature-prioritization',
            target: 'widget',
            parameters: {
              focusMode: true,
              notificationFilter: 'important',
              adaptivePriority: true,
            },
            priority: 7,
            retryCount: 1,
          },
        ],
        priority: 7,
        enabled: true,
        version: '2.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        statistics: {
          triggeredCount: 0,
          executedCount: 0,
          failedCount: 0,
          avgExecutionTime: 0,
          successRate: 1,
          avgConfidence: 1,
          falsePositiveRate: 0,
          falseNegativeRate: 0,
        },
        tags: ['focus', 'productivity', 'notifications'],
      },
      {
        id: 'rule-idle-mode',
        name: 'Idle Mode',
        description: 'Activate idle mode when user is inactive',
        category: 'behavioral',
        conditions: {
          id: 'cond-user-idle',
          type: 'temporal',
          field: 'user.activity.lastInteraction',
          operator: 'lt',
          threshold: 300000,
          timeWindow: 300000,
          aggregation: 'max',
          weight: 1.0,
        },
        actions: [
          {
            id: 'action-idle-mode',
            type: 'behavior-change',
            target: 'widget',
            parameters: {
              idleMode: true,
              reducedRefreshRate: true,
              adaptivePower: true,
            },
            priority: 6,
            retryCount: 1,
          },
        ],
        priority: 6,
        enabled: true,
        version: '2.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        statistics: {
          triggeredCount: 0,
          executedCount: 0,
          failedCount: 0,
          avgExecutionTime: 0,
          successRate: 1,
          avgConfidence: 1,
          falsePositiveRate: 0,
          falseNegativeRate: 0,
        },
        tags: ['behavioral', 'idle', 'power'],
      },
      {
        id: 'rule-high-load-optimization',
        name: 'High Load Optimization',
        description: 'Optimize system under high load',
        category: 'performance',
        conditions: {
          id: 'cond-high-load',
          type: 'statistical',
          field: 'system.load',
          operator: 'gt',
          threshold: 0.8,
          timeWindow: 60000,
          aggregation: 'avg',
          weight: 1.0,
        },
        actions: [
          {
            id: 'action-load-balance',
            type: 'performance-optimization',
            target: 'system',
            parameters: {
              loadBalancing: true,
              requestThrottling: true,
              adaptiveScaling: true,
            },
            priority: 9,
            retryCount: 2,
          },
        ],
        priority: 9,
        enabled: true,
        version: '2.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        statistics: {
          triggeredCount: 0,
          executedCount: 0,
          failedCount: 0,
          avgExecutionTime: 0,
          successRate: 1,
          avgConfidence: 1,
          falsePositiveRate: 0,
          falseNegativeRate: 0,
        },
        tags: ['performance', 'load', 'scaling'],
      },
      {
        id: 'rule-user-satisfaction-boost',
        name: 'User Satisfaction Boost',
        description: 'Boost user satisfaction based on ML predictions',
        category: 'ai-driven',
        conditions: {
          id: 'cond-low-satisfaction',
          type: 'machine-learning',
          field: 'predictions.userSatisfaction',
          operator: 'lt',
          threshold: 0.6,
          mlModel: 'satisfaction-predictor',
          confidence: 0.8,
          weight: 1.0,
        },
        actions: [
          {
            id: 'action-satisfaction-boost',
            type: 'ai-trigger',
            target: 'widget',
            parameters: {
              personalizedRecommendations: true,
              adaptiveUI: true,
              proactiveAssistance: true,
            },
            priority: 8,
            retryCount: 2,
          },
        ],
        priority: 8,
        enabled: true,
        version: '2.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        statistics: {
          triggeredCount: 0,
          executedCount: 0,
          failedCount: 0,
          avgExecutionTime: 0,
          successRate: 1,
          avgConfidence: 0.8,
          falsePositiveRate: 0.1,
          falseNegativeRate: 0.1,
        },
        tags: ['ai', 'satisfaction', 'personalization'],
      },
      {
        id: 'rule-contextual-adaptation',
        name: 'Contextual Adaptation',
        description: 'Adapt to user context and environment',
        category: 'contextual',
        conditions: {
          id: 'cond-context-change',
          type: 'composite',
          logicalOperator: 'or',
          conditions: [
            {
              id: 'cond-location-change',
              type: 'simple',
              field: 'contextual.location.changed',
              operator: 'eq',
              value: true,
              weight: 0.5,
            },
            {
              id: 'cond-activity-change',
              type: 'simple',
              field: 'contextual.activity.changed',
              operator: 'eq',
              value: true,
              weight: 0.5,
            },
          ],
          weight: 1.0,
        },
        actions: [
          {
            id: 'action-context-adapt',
            type: 'ui-adjustment',
            target: 'widget',
            parameters: {
              contextualUI: true,
              adaptiveFeatures: true,
              locationAware: true,
            },
            priority: 7,
            retryCount: 1,
          },
        ],
        priority: 7,
        enabled: true,
        version: '2.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        statistics: {
          triggeredCount: 0,
          executedCount: 0,
          failedCount: 0,
          avgExecutionTime: 0,
          successRate: 1,
          avgConfidence: 1,
          falsePositiveRate: 0,
          falseNegativeRate: 0,
        },
        tags: ['contextual', 'adaptive', 'location'],
      },
      {
        id: 'rule-fuzzy-performance',
        name: 'Fuzzy Performance Control',
        description: 'Control performance using fuzzy logic',
        category: 'performance',
        conditions: {
          id: 'cond-performance-fuzzy',
          type: 'fuzzy',
          field: 'system.performance',
          operator: 'fuzzy-match',
          fuzzySet: 'medium',
          threshold: 0.5,
          weight: 1.0,
        },
        actions: [
          {
            id: 'action-fuzzy-optimize',
            type: 'performance-optimization',
            target: 'system',
            parameters: {
              fuzzyOptimization: true,
              adaptivePerformance: true,
              smoothTransition: true,
            },
            priority: 6,
            retryCount: 1,
          },
        ],
        priority: 6,
        enabled: true,
        version: '2.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        statistics: {
          triggeredCount: 0,
          executedCount: 0,
          failedCount: 0,
          avgExecutionTime: 0,
          successRate: 1,
          avgConfidence: 0.7,
          falsePositiveRate: 0.15,
          falseNegativeRate: 0.15,
        },
        tags: ['fuzzy', 'performance', 'adaptive'],
      },
      {
        id: 'rule-behavioral-pattern',
        name: 'Behavioral Pattern Detection',
        description: 'Detect and adapt to behavioral patterns',
        category: 'behavioral',
        conditions: {
          id: 'cond-behavior-pattern',
          type: 'behavioral',
          field: 'behavioral.pattern',
          operator: 'pattern-match',
          pattern: 'high-activity',
          timeWindow: 3600000,
          aggregation: 'count',
          threshold: 10,
          weight: 1.0,
        },
        actions: [
          {
            id: 'action-behavior-adapt',
            type: 'behavior-change',
            target: 'widget',
            parameters: {
              behavioralAdaptation: true,
              predictiveUI: true,
              proactiveFeatures: true,
            },
            priority: 7,
            retryCount: 2,
          },
        ],
        priority: 7,
        enabled: true,
        version: '2.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        statistics: {
          triggeredCount: 0,
          executedCount: 0,
          failedCount: 0,
          avgExecutionTime: 0,
          successRate: 1,
          avgConfidence: 0.85,
          falsePositiveRate: 0.1,
          falseNegativeRate: 0.1,
        },
        tags: ['behavioral', 'pattern', 'adaptive'],
      },
    ];

    for (const rule of defaultRules) {
      this.rules.set(rule.id, rule);
    }
  }

  public async evaluate(context: RuleContext): Promise<RuleEvaluationResult[]> {
    const startTime = Date.now();
    const results: RuleEvaluationResult[] = [];

    for (const [ruleId, rule] of this.rules.entries()) {
      if (!rule.enabled) {
        continue;
      }

      try {
        const result = await this.evaluateRule(rule, context);
        results.push(result);

        if (result.matched) {
          this.updateRuleStatistics(ruleId, 'triggered', result.confidence);
          this.log('info', `Rule triggered: ${ruleId}`);
        }
      } catch (error) {
        this.log('error', `Error evaluating rule ${ruleId}: ${error}`);
      }
    }

    const evaluationTime = Date.now() - startTime;
    this.emit('evaluation-completed', { results, evaluationTime });

    return results;
  }

  public async execute(context: RuleContext): Promise<RuleExecutionResult[]> {
    const evaluationResults = await this.evaluate(context);
    const matchedRules = evaluationResults.filter(r => r.matched);

    if (matchedRules.length === 0) {
      this.log('info', 'No rules matched');
      return [];
    }

    const conflicts = this.detectConflicts(matchedRules);
    if (conflicts.length > 0) {
      this.emit('conflicts-detected', conflicts);
      this.log('warn', `Conflicts detected: ${conflicts.length}`);
    }

    const resolutions = conflicts.map(c => this.conflictResolver.resolve(c, this.rules));
    const executionResults: RuleExecutionResult[] = [];

    for (const resolution of resolutions) {
      for (const ruleId of resolution.selectedRules) {
        const rule = this.rules.get(ruleId);
        if (!rule) continue;

        for (const action of rule.actions) {
          try {
            const result = await this.executeAction(ruleId, action, context);
            executionResults.push(result);

            if (result.success) {
              this.updateRuleStatistics(ruleId, 'executed', result.executionTime);
            } else {
              this.updateRuleStatistics(ruleId, 'failed');
            }
          } catch (error) {
            this.log('error', `Error executing action ${action.id} for rule ${ruleId}: ${error}`);
          }
        }
      }
    }

    this.emit('execution-completed', executionResults);
    return executionResults;
  }

  private async evaluateRule(rule: Rule, context: RuleContext): Promise<RuleEvaluationResult> {
    const startTime = Date.now();

    const conditionResults = await this.conditionEvaluator.evaluate(rule.conditions, context);

    const matched = conditionResults.every(cr => cr.matched);
    const confidence = this.calculateRuleConfidence(conditionResults);

    const result: RuleEvaluationResult = {
      ruleId: rule.id,
      matched,
      confidence,
      conditions: conditionResults,
      timestamp: Date.now(),
      evaluationTime: Date.now() - startTime,
    };

    this.ruleHistory.push({ timestamp: Date.now(), ruleId: rule.id, result });

    if (this.ruleHistory.length > this.config.maxHistorySize) {
      this.ruleHistory.shift();
    }

    return result;
  }

  private calculateRuleConfidence(conditionResults: Array<{ matched: boolean; confidence?: number }>): number {
    const confidences = conditionResults
      .filter(cr => cr.confidence !== undefined)
      .map(cr => cr.confidence as number);

    if (confidences.length === 0) return 1;

    return confidences.reduce((sum, c) => sum + c, 0) / confidences.length;
  }

  private async executeAction(ruleId: string, action: RuleAction, context: RuleContext): Promise<RuleExecutionResult> {
    const startTime = Date.now();

    try {
      let output: unknown;

      if (action.conditions) {
        const conditionResults = await this.conditionEvaluator.evaluate(action.conditions, context);
        const conditionsMatched = conditionResults.every(cr => cr.matched);

        if (!conditionsMatched) {
          return {
            ruleId,
            actionId: action.id,
            success: false,
            error: new Error('Action conditions not met'),
            executionTime: Date.now() - startTime,
            timestamp: Date.now(),
          };
        }
      }

      output = await this.actionExecutor.execute(action, context);

      if (action.onSuccess) {
        for (const successAction of action.onSuccess) {
          await this.executeAction(ruleId, successAction, context);
        }
      }

      return {
        ruleId,
        actionId: action.id,
        success: true,
        executionTime: Date.now() - startTime,
        timestamp: Date.now(),
        output,
      };
    } catch (error) {
      const executionError = error as Error;

      if (action.onFailure) {
        for (const failureAction of action.onFailure) {
          await this.executeAction(ruleId, failureAction, context);
        }
      }

      return {
        ruleId,
        actionId: action.id,
        success: false,
        error: executionError,
        executionTime: Date.now() - startTime,
        timestamp: Date.now(),
      };
    }
  }

  private detectConflicts(evaluationResults: RuleEvaluationResult[]): RuleConflict[] {
    const conflicts: RuleConflict[] = [];
    const matchedRules = evaluationResults.filter(r => r.matched);

    for (let i = 0; i < matchedRules.length; i++) {
      for (let j = i + 1; j < matchedRules.length; j++) {
        const rule1 = this.rules.get(matchedRules[i].ruleId);
        const rule2 = this.rules.get(matchedRules[j].ruleId);

        if (!rule1 || !rule2) continue;

        if (this.checkResourceConflict(rule1, rule2)) {
          conflicts.push({
            type: 'resource',
            rules: [rule1.id, rule2.id],
            description: 'Resource conflict between rules',
            severity: 'medium',
          });
        }

        if (this.checkLogicalConflict(rule1, rule2)) {
          conflicts.push({
            type: 'logical',
            rules: [rule1.id, rule2.id],
            description: 'Logical conflict between rules',
            severity: 'high',
          });
        }
      }
    }

    return conflicts;
  }

  private checkResourceConflict(rule1: Rule, rule2: Rule): boolean {
    const targets1 = new Set(rule1.actions.map(a => a.target));
    const targets2 = new Set(rule2.actions.map(a => a.target));

    for (const target of targets1) {
      if (targets2.has(target)) {
        return true;
      }
    }

    return false;
  }

  private checkLogicalConflict(rule1: Rule, rule2: Rule): boolean {
    return rule1.category === rule2.category && rule1.priority === rule2.priority;
  }

  private updateRuleStatistics(ruleId: string, event: 'triggered' | 'executed' | 'failed', confidence?: number): void {
    const rule = this.rules.get(ruleId);
    if (!rule || !rule.statistics) return;

    switch (event) {
      case 'triggered':
        rule.statistics.triggeredCount++;
        rule.statistics.lastTriggeredAt = Date.now();
        if (confidence !== undefined) {
          rule.statistics.avgConfidence = (rule.statistics.avgConfidence * (rule.statistics.triggeredCount - 1) + confidence) / rule.statistics.triggeredCount;
        }
        break;
      case 'executed':
        rule.statistics.executedCount++;
        rule.statistics.lastExecutedAt = Date.now();
        break;
      case 'failed':
        rule.statistics.failedCount++;
        break;
    }

    rule.statistics.successRate = rule.statistics.executedCount / Math.max(1, rule.statistics.triggeredCount);
  }

  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string): void {
    if (!this.config.enableLogging) return;

    const logLevels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = logLevels.indexOf(this.config.logLevel);
    const messageLevelIndex = logLevels.indexOf(level);

    if (messageLevelIndex >= currentLevelIndex) {
      console.log(`[${level.toUpperCase()}] ${message}`);
    }
  }

  public addRule(rule: Rule): void {
    const validation = this.ruleValidator.validate(rule);
    if (!validation.valid) {
      throw new Error(`Rule validation failed: ${validation.errors.join(', ')}`);
    }

    if (this.config.enableRuleDependencies && rule.dependencies) {
      this.ruleDependencyManager.addDependencies(rule.id, rule.dependencies);
    }

    this.rules.set(rule.id, rule);
    this.emit('rule-added', rule);
  }

  public getRule(ruleId: string): Rule | undefined {
    return this.rules.get(ruleId);
  }

  public getAllRules(): Rule[] {
    return Array.from(this.rules.values());
  }

  public getRulesByCategory(category: Rule['category']): Rule[] {
    return Array.from(this.rules.values()).filter(r => r.category === category);
  }

  public getRulesByTag(tag: string): Rule[] {
    return Array.from(this.rules.values()).filter(r => r.tags?.includes(tag));
  }

  public updateRule(ruleId: string, updates: Partial<Rule>): void {
    const existingRule = this.rules.get(ruleId);
    if (!existingRule) {
      throw new Error(`Rule not found: ${ruleId}`);
    }

    if (this.config.enableRuleVersioning) {
      this.ruleVersionManager.createVersion(existingRule);
    }

    const updatedRule: Rule = {
      ...existingRule,
      ...updates,
      id: ruleId,
      updatedAt: Date.now(),
    };

    this.rules.set(ruleId, updatedRule);
    this.emit('rule-updated', updatedRule);
  }

  public removeRule(ruleId: string): void {
    const removed = this.rules.delete(ruleId);
    if (removed) {
      this.ruleDependencyManager.removeDependencies(ruleId);
      this.emit('rule-removed', ruleId);
    }
  }

  public enableRule(ruleId: string): void {
    const rule = this.rules.get(ruleId);
    if (!rule) {
      throw new Error(`Rule not found: ${ruleId}`);
    }
    rule.enabled = true;
    this.emit('rule-enabled', rule);
  }

  public disableRule(ruleId: string): void {
    const rule = this.rules.get(ruleId);
    if (!rule) {
      throw new Error(`Rule not found: ${ruleId}`);
    }
    rule.enabled = false;
    this.emit('rule-disabled', rule);
  }

  public getStatistics(): { totalRules: number; enabledRules: number; disabledRules: number; categories: Record<string, number> } {
    const rules = Array.from(this.rules.values());
    const categories: Record<string, number> = {};

    for (const rule of rules) {
      categories[rule.category] = (categories[rule.category] || 0) + 1;
    }

    return {
      totalRules: rules.length,
      enabledRules: rules.filter(r => r.enabled).length,
      disabledRules: rules.filter(r => !r.enabled).length,
      categories,
    };
  }

  public getRuleHistory(ruleId?: string): Array<{ timestamp: number; ruleId: string; result: RuleEvaluationResult }> {
    const history = [...this.ruleHistory].reverse();
    return ruleId ? history.filter(h => h.ruleId === ruleId) : history;
  }

  public getExecutionHistory(): Array<{ timestamp: number; result: RuleExecutionResult }> {
    return [...this.executionHistory].reverse();
  }

  public getConfig(): EnhancedRuleEngineConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<EnhancedRuleEngineConfig>): void {
    this.config = { ...this.config, ...updates };
    this.emit('config-updated', this.config);
  }

  public async reset(): Promise<void> {
    this.rules.clear();
    this.ruleHistory = [];
    this.executionHistory = [];
    await this.loadDefaultRules();
    this.emit('reset', this.getStatistics());
  }

  public async optimizeRules(): Promise<void> {
    const rules = Array.from(this.rules.values());
    const optimizedRules = await this.ruleOptimizer.optimize(rules);

    for (const rule of optimizedRules) {
      this.updateRule(rule.id, rule);
    }

    this.emit('rules-optimized', optimizedRules);
  }
}

class EnhancedConditionEvaluator {
  constructor(private config: EnhancedRuleEngineConfig) {}

  async evaluate(condition: RuleCondition, context: RuleContext): Promise<Array<{ conditionId: string; matched: boolean; value?: unknown; confidence?: number }>> {
    const results: Array<{ conditionId: string; matched: boolean; value?: unknown; confidence?: number }> = [];

    switch (condition.type) {
      case 'simple':
        results.push(await this.evaluateSimpleCondition(condition, context));
        break;
      case 'composite':
        results.push(...await this.evaluateCompositeCondition(condition, context));
        break;
      case 'temporal':
        results.push(await this.evaluateTemporalCondition(condition, context));
        break;
      case 'statistical':
        results.push(await this.evaluateStatisticalCondition(condition, context));
        break;
      case 'fuzzy':
        results.push(await this.evaluateFuzzyCondition(condition, context));
        break;
      case 'machine-learning':
        results.push(await this.evaluateMLCondition(condition, context));
        break;
      case 'behavioral':
        results.push(await this.evaluateBehavioralCondition(condition, context));
        break;
      case 'contextual':
        results.push(await this.evaluateContextualCondition(condition, context));
        break;
    }

    return results;
  }

  private async evaluateSimpleCondition(condition: RuleCondition, context: RuleContext): Promise<{ conditionId: string; matched: boolean; value?: unknown; confidence?: number }> {
    const value = this.getFieldValue(condition.field, context);
    const matched = this.compareValues(value, condition.operator, condition.value, condition.threshold);

    return {
      conditionId: condition.id,
      matched,
      value,
      confidence: 1.0,
    };
  }

  private async evaluateCompositeCondition(condition: RuleCondition, context: RuleContext): Promise<Array<{ conditionId: string; matched: boolean; value?: unknown; confidence?: number }>> {
    const results: Array<{ conditionId: string; matched: boolean; value?: unknown; confidence?: number }> = [];

    if (!condition.conditions) {
      return results;
    }

    for (const subCondition of condition.conditions) {
      const subResults = await this.evaluate(subCondition, context);
      results.push(...subResults);
    }

    return results;
  }

  private async evaluateTemporalCondition(condition: RuleCondition, context: RuleContext): Promise<{ conditionId: string; matched: boolean; value?: unknown; confidence?: number }> {
    const timeWindow = condition.timeWindow || 60000;
    const relevantHistory = context.history.filter(h => Date.now() - h.timestamp <= timeWindow);

    const values = relevantHistory.map(h => this.getFieldValue(condition.field, h));
    const aggregatedValue = this.aggregateValues(values, condition.aggregation || 'avg');

    const matched = this.compareValues(aggregatedValue, condition.operator, condition.value, condition.threshold);

    return {
      conditionId: condition.id,
      matched,
      value: aggregatedValue,
      confidence: 0.9,
    };
  }

  private async evaluateStatisticalCondition(condition: RuleCondition, context: RuleContext): Promise<{ conditionId: string; matched: boolean; value?: unknown; confidence?: number }> {
    const timeWindow = condition.timeWindow || 60000;
    const relevantHistory = context.history.filter(h => Date.now() - h.timestamp <= timeWindow);

    const values = relevantHistory.map(h => this.getFieldValue(condition.field, h));
    const aggregatedValue = this.aggregateValues(values, condition.aggregation || 'avg');

    const matched = this.compareValues(aggregatedValue, condition.operator, condition.value, condition.threshold);

    return {
      conditionId: condition.id,
      matched,
      value: aggregatedValue,
      confidence: 0.85,
    };
  }

  private async evaluateFuzzyCondition(condition: RuleCondition, context: RuleContext): Promise<{ conditionId: string; matched: boolean; value?: unknown; confidence?: number }> {
    const value = this.getFieldValue(condition.field, context);
    const membership = this.calculateFuzzyMembership(value as number, condition.fuzzySet || 'medium');

    const threshold = condition.threshold || 0.5;
    const matched = membership >= threshold;

    return {
      conditionId: condition.id,
      matched,
      value,
      confidence: membership,
    };
  }

  private async evaluateMLCondition(condition: RuleCondition, context: RuleContext): Promise<{ conditionId: string; matched: boolean; value?: unknown; confidence?: number }> {
    const prediction = context.predictions?.[condition.field] as number || 0.5;
    const confidence = condition.confidence || 0.8;

    const matched = this.compareValues(prediction, condition.operator, condition.value, condition.threshold);

    return {
      conditionId: condition.id,
      matched,
      value: prediction,
      confidence,
    };
  }

  private async evaluateBehavioralCondition(condition: RuleCondition, context: RuleContext): Promise<{ conditionId: string; matched: boolean; value?: unknown; confidence?: number }> {
    const value = context.behavioral?.[condition.field] as number || 0;
    const matched = this.compareValues(value, condition.operator, condition.value, condition.threshold);

    return {
      conditionId: condition.id,
      matched,
      value,
      confidence: 0.85,
    };
  }

  private async evaluateContextualCondition(condition: RuleCondition, context: RuleContext): Promise<{ conditionId: string; matched: boolean; value?: unknown; confidence?: number }> {
    const value = context.contextual?.[condition.field] as boolean || false;
    const matched = value === (condition.value as boolean);

    return {
      conditionId: condition.id,
      matched,
      value,
      confidence: 0.9,
    };
  }

  private getFieldValue(field: string, context: RuleContext | Record<string, unknown>): unknown {
    const parts = field.split('.');
    let value: unknown = context;

    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = (value as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }

    return value;
  }

  private compareValues(value: unknown, operator: string, expected?: unknown, threshold?: number): boolean {
    const numValue = typeof value === 'number' ? value : 0;
    const numExpected = typeof expected === 'number' ? expected : 0;
    const numThreshold = typeof threshold === 'number' ? threshold : 0;

    switch (operator) {
      case 'eq':
        return value === expected;
      case 'ne':
        return value !== expected;
      case 'gt':
        return numValue > (threshold !== undefined ? threshold : numExpected);
      case 'lt':
        return numValue < (threshold !== undefined ? threshold : numExpected);
      case 'gte':
        return numValue >= (threshold !== undefined ? threshold : numExpected);
      case 'lte':
        return numValue <= (threshold !== undefined ? threshold : numExpected);
      case 'in':
        return Array.isArray(expected) && expected.includes(value);
      case 'contains':
        return typeof value === 'string' && typeof expected === 'string' && value.includes(expected);
      case 'between':
        return Array.isArray(expected) && numValue >= expected[0] && numValue <= expected[1];
      case 'regex':
        return typeof value === 'string' && typeof expected === 'string' && new RegExp(expected).test(value);
      case 'fuzzy-match':
        return true;
      case 'ml-predict':
        return true;
      case 'pattern-match':
        return true;
      default:
        return false;
    }
  }

  private aggregateValues(values: unknown[], aggregation: string): number {
    const numbers = values.filter(v => typeof v === 'number') as number[];

    if (numbers.length === 0) return 0;

    switch (aggregation) {
      case 'avg':
        return numbers.reduce((sum, v) => sum + v, 0) / numbers.length;
      case 'sum':
        return numbers.reduce((sum, v) => sum + v, 0);
      case 'count':
        return numbers.length;
      case 'min':
        return Math.min(...numbers);
      case 'max':
        return Math.max(...numbers);
      case 'std':
        const mean = numbers.reduce((sum, v) => sum + v, 0) / numbers.length;
        const variance = numbers.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / numbers.length;
        return Math.sqrt(variance);
      case 'median':
        const sorted = [...numbers].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
      case 'percentile':
        const percentile = 90;
        const index = Math.ceil((percentile / 100) * numbers.length) - 1;
        return sortedNumbers(numbers)[index];
      default:
        return numbers[0];
    }
  }

  private sortedNumbers(numbers: number[]): number[] {
    return [...numbers].sort((a, b) => a - b);
  }

  private calculateFuzzyMembership(value: number, fuzzySet: string): number {
    switch (fuzzySet) {
      case 'low':
        return Math.max(0, 1 - value);
      case 'medium':
        return Math.max(0, 1 - Math.abs(value - 0.5) * 2);
      case 'high':
        return Math.min(1, value);
      default:
        return 0.5;
    }
  }
}

class EnhancedActionExecutor {
  constructor(private config: EnhancedRuleEngineConfig) {}

  async execute(action: RuleAction, context: RuleContext): Promise<unknown> {
    const startTime = Date.now();

    try {
      let output: unknown;

      switch (action.type) {
        case 'ui-adjustment':
          output = await this.executeUIAdjustment(action, context);
          break;
        case 'resource-allocation':
          output = await this.executeResourceAllocation(action, context);
          break;
        case 'feature-prioritization':
          output = await this.executeFeaturePrioritization(action, context);
          break;
        case 'behavior-change':
          output = await this.executeBehaviorChange(action, context);
          break;
        case 'performance-optimization':
          output = await this.executePerformanceOptimization(action, context);
          break;
        case 'notification':
          output = await this.executeNotification(action, context);
          break;
        case 'logging':
          output = await this.executeLogging(action, context);
          break;
        case 'data-collection':
          output = await this.executeDataCollection(action, context);
          break;
        case 'ai-trigger':
          output = await this.executeAITrigger(action, context);
          break;
        case 'custom':
          output = await this.executeCustomAction(action, context);
          break;
      }

      return output;
    } catch (error) {
      throw error;
    }
  }

  private async executeUIAdjustment(action: RuleAction, context: RuleContext): Promise<unknown> {
    return { type: 'ui-adjustment', target: action.target, parameters: action.parameters };
  }

  private async executeResourceAllocation(action: RuleAction, context: RuleContext): Promise<unknown> {
    return { type: 'resource-allocation', target: action.target, parameters: action.parameters };
  }

  private async executeFeaturePrioritization(action: RuleAction, context: RuleContext): Promise<unknown> {
    return { type: 'feature-prioritization', target: action.target, parameters: action.parameters };
  }

  private async executeBehaviorChange(action: RuleAction, context: RuleContext): Promise<unknown> {
    return { type: 'behavior-change', target: action.target, parameters: action.parameters };
  }

  private async executePerformanceOptimization(action: RuleAction, context: RuleContext): Promise<unknown> {
    return { type: 'performance-optimization', target: action.target, parameters: action.parameters };
  }

  private async executeNotification(action: RuleAction, context: RuleContext): Promise<unknown> {
    return { type: 'notification', target: action.target, parameters: action.parameters };
  }

  private async executeLogging(action: RuleAction, context: RuleContext): Promise<unknown> {
    return { type: 'logging', target: action.target, parameters: action.parameters };
  }

  private async executeDataCollection(action: RuleAction, context: RuleContext): Promise<unknown> {
    return { type: 'data-collection', target: action.target, parameters: action.parameters };
  }

  private async executeAITrigger(action: RuleAction, context: RuleContext): Promise<unknown> {
    return { type: 'ai-trigger', target: action.target, parameters: action.parameters };
  }

  private async executeCustomAction(action: RuleAction, context: RuleContext): Promise<unknown> {
    return { type: 'custom', target: action.target, parameters: action.parameters };
  }
}

class EnhancedConflictResolver {
  constructor(private config: EnhancedRuleEngineConfig) {}

  resolve(conflict: RuleConflict, rules: Map<string, Rule>): ConflictResolution {
    const strategy = conflict.resolution?.strategy || this.config.conflictResolutionStrategy;

    switch (strategy) {
      case 'priority':
        return this.resolveByPriority(conflict, rules);
      case 'merge':
        return this.resolveByMerge(conflict, rules);
      case 'sequential':
        return this.resolveSequentially(conflict, rules);
      case 'parallel':
        return this.resolveInParallel(conflict, rules);
      case 'voting':
        return this.resolveByVoting(conflict, rules);
      case 'custom':
        return conflict.resolution || this.resolveByPriority(conflict, rules);
      default:
        return this.resolveByPriority(conflict, rules);
    }
  }

  private resolveByPriority(conflict: RuleConflict, rules: Map<string, Rule>): ConflictResolution {
    const sortedRules = conflict.rules
      .map(id => rules.get(id)!)
      .filter(r => r)
      .sort((a, b) => b.priority - a.priority);

    return {
      strategy: 'priority',
      selectedRules: [sortedRules[0].id],
    };
  }

  private resolveByMerge(conflict: RuleConflict, rules: Map<string, Rule>): ConflictResolution {
    const mergedActions: RuleAction[] = [];

    for (const ruleId of conflict.rules) {
      const rule = rules.get(ruleId);
      if (rule) {
        mergedActions.push(...rule.actions);
      }
    }

    return {
      strategy: 'merge',
      selectedRules: conflict.rules,
      mergedActions,
    };
  }

  private resolveSequentially(conflict: RuleConflict, rules: Map<string, Rule>): ConflictResolution {
    return {
      strategy: 'sequential',
      selectedRules: conflict.rules,
    };
  }

  private resolveInParallel(conflict: RuleConflict, rules: Map<string, Rule>): ConflictResolution {
    return {
      strategy: 'parallel',
      selectedRules: conflict.rules,
    };
  }

  private resolveByVoting(conflict: RuleConflict, rules: Map<string, Rule>): ConflictResolution {
    const votingWeights = new Map<string, number>();

    for (const ruleId of conflict.rules) {
      const rule = rules.get(ruleId);
      if (rule && rule.statistics) {
        votingWeights.set(ruleId, rule.statistics.successRate);
      }
    }

    return {
      strategy: 'voting',
      selectedRules: conflict.rules,
      votingWeights,
    };
  }
}

class RuleDependencyManager {
  private dependencies: Map<string, Set<string>> = new Map();

  constructor(private config: EnhancedRuleEngineConfig) {}

  addDependencies(ruleId: string, dependencies: string[]): void {
    this.dependencies.set(ruleId, new Set(dependencies));
  }

  removeDependencies(ruleId: string): void {
    this.dependencies.delete(ruleId);
  }

  getDependencies(ruleId: string): Set<string> | undefined {
    return this.dependencies.get(ruleId);
  }

  checkCircularDependencies(): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const dfs = (ruleId: string, path: string[]): void => {
      visited.add(ruleId);
      recursionStack.add(ruleId);
      path.push(ruleId);

      const deps = this.dependencies.get(ruleId);
      if (deps) {
        for (const dep of deps) {
          if (!visited.has(dep)) {
            dfs(dep, [...path]);
          } else if (recursionStack.has(dep)) {
            const cycleStart = path.indexOf(dep);
            cycles.push([...path.slice(cycleStart), dep]);
          }
        }
      }

      recursionStack.delete(ruleId);
    };

    for (const ruleId of this.dependencies.keys()) {
      if (!visited.has(ruleId)) {
        dfs(ruleId, []);
      }
    }

    return cycles;
  }
}

class RuleVersionManager {
  private versions: Map<string, Rule[]> = new Map();

  constructor(private config: EnhancedRuleEngineConfig) {}

  createVersion(rule: Rule): void {
    if (!this.versions.has(rule.id)) {
      this.versions.set(rule.id, []);
    }

    const versions = this.versions.get(rule.id)!;
    versions.push({ ...rule });

    if (versions.length > 10) {
      versions.shift();
    }
  }

  getVersions(ruleId: string): Rule[] {
    return this.versions.get(ruleId) || [];
  }

  rollback(ruleId: string, versionIndex: number): Rule | null {
    const versions = this.versions.get(ruleId);
    if (!versions || versionIndex >= versions.length) {
      return null;
    }

    return versions[versionIndex];
  }
}

class RuleValidator {
  constructor(private config: EnhancedRuleEngineConfig) {}

  validate(rule: Rule): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!rule.id) {
      errors.push('Rule ID is required');
    }

    if (!rule.name) {
      errors.push('Rule name is required');
    }

    if (!rule.conditions) {
      errors.push('Rule conditions are required');
    }

    if (!rule.actions || rule.actions.length === 0) {
      errors.push('Rule actions are required');
    }

    if (rule.priority < 0 || rule.priority > 10) {
      errors.push('Rule priority must be between 0 and 10');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

class RuleOptimizer {
  constructor(private config: EnhancedRuleEngineConfig) {}

  async optimize(rules: Rule[]): Promise<Rule[]> {
    const optimizedRules: Rule[] = [];

    for (const rule of rules) {
      const optimized = await this.optimizeRule(rule);
      optimizedRules.push(optimized);
    }

    return optimizedRules;
  }

  private async optimizeRule(rule: Rule): Promise<Rule> {
    return rule;
  }
}

export default EnhancedRuleEngine;
