/**
 * @file RuleEngine.ts
 * @description YYC³ AI浮窗系统规则引擎 - 可配置的自适应规则系统
 * @module lib/rules
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-20
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { EventEmitter } from 'events';

export interface RuleCondition {
  id: string;
  type: 'simple' | 'composite' | 'temporal' | 'statistical';
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'contains' | 'between' | 'regex';
  value?: unknown;
  threshold?: number;
  timeWindow?: number;
  aggregation?: 'avg' | 'sum' | 'count' | 'min' | 'max' | 'std';
  logicalOperator?: 'and' | 'or' | 'not';
  conditions?: RuleCondition[];
}

export interface RuleAction {
  id: string;
  type: 'ui-adjustment' | 'resource-allocation' | 'feature-prioritization' | 'behavior-change' | 'performance-optimization';
  target: string;
  parameters: Record<string, unknown>;
  priority: number;
  delay?: number;
  duration?: number;
  rollback?: boolean;
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'user-experience' | 'resource' | 'security' | 'custom';
  conditions: RuleCondition;
  actions: RuleAction[];
  priority: number;
  enabled: boolean;
  version: string;
  createdAt: number;
  updatedAt: number;
  metadata?: Record<string, unknown>;
  statistics?: RuleStatistics;
}

export interface RuleStatistics {
  triggeredCount: number;
  executedCount: number;
  failedCount: number;
  avgExecutionTime: number;
  lastTriggeredAt?: number;
  lastExecutedAt?: number;
  successRate: number;
}

export interface RuleContext {
  timestamp: number;
  environment: Record<string, unknown>;
  user: Record<string, unknown>;
  system: Record<string, unknown>;
  history: Array<{ timestamp: number; data: Record<string, unknown> }>;
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
  }>;
  timestamp: number;
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
}

export interface RuleConflict {
  type: 'priority' | 'resource' | 'mutual-exclusion' | 'dependency';
  rules: string[];
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolution?: ConflictResolution;
}

export interface ConflictResolution {
  strategy: 'priority' | 'merge' | 'sequential' | 'parallel' | 'custom';
  selectedRules: string[];
  mergedActions?: RuleAction[];
  customLogic?: string;
}

export interface RuleEngineConfig {
  maxHistorySize: number;
  evaluationTimeout: number;
  executionTimeout: number;
  conflictResolutionStrategy: 'priority' | 'merge' | 'sequential' | 'parallel';
  enableStatistics: boolean;
  enableRollback: boolean;
  enableLogging: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export class RuleEngine extends EventEmitter {
  private static instance: RuleEngine;
  private rules: Map<string, Rule> = new Map();
  private ruleHistory: Array<{ timestamp: number; ruleId: string; result: RuleEvaluationResult }> = [];
  private executionHistory: Array<{ timestamp: number; result: RuleExecutionResult }> = [];
  private config: RuleEngineConfig;
  private conflictResolver: RuleConflictResolver;
  private conditionEvaluator: ConditionEvaluator;
  private actionExecutor: ActionExecutor;

  private constructor(config?: Partial<RuleEngineConfig>) {
    super();
    this.config = this.initializeConfig(config);
    this.conflictResolver = new RuleConflictResolver(this.config);
    this.conditionEvaluator = new ConditionEvaluator(this.config);
    this.actionExecutor = new ActionExecutor(this.config);
    this.initialize();
  }

  static getInstance(config?: Partial<RuleEngineConfig>): RuleEngine {
    if (!RuleEngine.instance) {
      RuleEngine.instance = new RuleEngine(config);
    }
    return RuleEngine.instance;
  }

  private initializeConfig(config?: Partial<RuleEngineConfig>): RuleEngineConfig {
    return {
      maxHistorySize: 1000,
      evaluationTimeout: 5000,
      executionTimeout: 10000,
      conflictResolutionStrategy: 'priority',
      enableStatistics: true,
      enableRollback: true,
      enableLogging: true,
      logLevel: 'info',
      ...config,
    };
  }

  private async initialize(): Promise<void> {
    this.loadDefaultRules();
    this.emit('initialized', this.getStatistics());
  }

  private loadDefaultRules(): void {
    const defaultRules: Rule[] = [
      {
        id: 'rule-mobile-optimization',
        name: 'Mobile Optimization',
        description: 'Optimize UI for mobile devices',
        category: 'user-experience',
        conditions: {
          id: 'cond-mobile-device',
          type: 'simple',
          field: 'environment.device.type',
          operator: 'eq',
          value: 'mobile',
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
            },
            priority: 10,
          },
        ],
        priority: 10,
        enabled: true,
        version: '1.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        statistics: {
          triggeredCount: 0,
          executedCount: 0,
          failedCount: 0,
          avgExecutionTime: 0,
          successRate: 1,
        },
      },
      {
        id: 'rule-low-network-optimization',
        name: 'Low Network Optimization',
        description: 'Optimize for slow network',
        category: 'performance',
        conditions: {
          id: 'cond-slow-network',
          type: 'simple',
          field: 'environment.network.speed',
          operator: 'eq',
          value: 'slow',
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
            },
            priority: 9,
          },
        ],
        priority: 9,
        enabled: true,
        version: '1.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        statistics: {
          triggeredCount: 0,
          executedCount: 0,
          failedCount: 0,
          avgExecutionTime: 0,
          successRate: 1,
        },
      },
      {
        id: 'rule-battery-saving',
        name: 'Battery Saving',
        description: 'Enable battery saving mode',
        category: 'resource',
        conditions: {
          id: 'cond-low-battery',
          type: 'simple',
          field: 'environment.device.battery.level',
          operator: 'lt',
          threshold: 20,
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
            },
            priority: 8,
          },
        ],
        priority: 8,
        enabled: true,
        version: '1.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        statistics: {
          triggeredCount: 0,
          executedCount: 0,
          failedCount: 0,
          avgExecutionTime: 0,
          successRate: 1,
        },
      },
      {
        id: 'rule-work-hours-focus',
        name: 'Work Hours Focus',
        description: 'Focus mode during work hours',
        category: 'user-experience',
        conditions: {
          id: 'cond-work-hours',
          type: 'simple',
          field: 'environment.time.isWorkHours',
          operator: 'eq',
          value: true,
        },
        actions: [
          {
            id: 'action-focus-mode',
            type: 'feature-prioritization',
            target: 'widget',
            parameters: {
              notifications: 'important',
              autoResponse: false,
              focusMode: true,
            },
            priority: 7,
          },
        ],
        priority: 7,
        enabled: true,
        version: '1.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        statistics: {
          triggeredCount: 0,
          executedCount: 0,
          failedCount: 0,
          avgExecutionTime: 0,
          successRate: 1,
        },
      },
      {
        id: 'rule-idle-mode',
        name: 'Idle Mode',
        description: 'Reduce resource usage when idle',
        category: 'resource',
        conditions: {
          id: 'cond-idle',
          type: 'simple',
          field: 'user.activity',
          operator: 'eq',
          value: 'idle',
        },
        actions: [
          {
            id: 'action-reduce-resources',
            type: 'resource-allocation',
            target: 'system',
            parameters: {
              pollingInterval: 30000,
              backgroundTasks: false,
            },
            priority: 6,
          },
        ],
        priority: 6,
        enabled: true,
        version: '1.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        statistics: {
          triggeredCount: 0,
          executedCount: 0,
          failedCount: 0,
          avgExecutionTime: 0,
          successRate: 1,
        },
      },
    ];

    defaultRules.forEach(rule => this.addRule(rule));
  }

  public addRule(rule: Rule): void {
    this.validateRule(rule);
    this.rules.set(rule.id, rule);
    this.emit('rule-added', rule);
    this.log('info', `Rule added: ${rule.id} (${rule.name})`);
  }

  public updateRule(ruleId: string, updates: Partial<Rule>): void {
    const existingRule = this.rules.get(ruleId);
    if (!existingRule) {
      throw new Error(`Rule not found: ${ruleId}`);
    }

    const updatedRule: Rule = {
      ...existingRule,
      ...updates,
      id: ruleId,
      updatedAt: Date.now(),
      version: this.incrementVersion(existingRule.version),
    };

    this.validateRule(updatedRule);
    this.rules.set(ruleId, updatedRule);
    this.emit('rule-updated', updatedRule);
    this.log('info', `Rule updated: ${ruleId}`);
  }

  public removeRule(ruleId: string): void {
    const removed = this.rules.delete(ruleId);
    if (removed) {
      this.emit('rule-removed', ruleId);
      this.log('info', `Rule removed: ${ruleId}`);
    }
  }

  public enableRule(ruleId: string): void {
    const rule = this.rules.get(ruleId);
    if (!rule) {
      throw new Error(`Rule not found: ${ruleId}`);
    }
    rule.enabled = true;
    this.emit('rule-enabled', ruleId);
    this.log('info', `Rule enabled: ${ruleId}`);
  }

  public disableRule(ruleId: string): void {
    const rule = this.rules.get(ruleId);
    if (!rule) {
      throw new Error(`Rule not found: ${ruleId}`);
    }
    rule.enabled = false;
    this.emit('rule-disabled', ruleId);
    this.log('info', `Rule disabled: ${ruleId}`);
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
          this.updateRuleStatistics(ruleId, 'triggered');
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

  private async evaluateRule(rule: Rule, context: RuleContext): Promise<RuleEvaluationResult> {
    const conditionResults = await this.conditionEvaluator.evaluate(rule.conditions, context);
    const matched = conditionResults.every(r => r.matched);
    const confidence = this.calculateConfidence(conditionResults);

    return {
      ruleId: rule.id,
      matched,
      confidence,
      conditions: conditionResults,
      timestamp: Date.now(),
    };
  }

  private calculateConfidence(conditionResults: Array<{ matched: boolean }>): number {
    if (conditionResults.length === 0) return 0;
    const matchedCount = conditionResults.filter(r => r.matched).length;
    return matchedCount / conditionResults.length;
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

  private async executeAction(ruleId: string, action: RuleAction, context: RuleContext): Promise<RuleExecutionResult> {
    const startTime = Date.now();

    try {
      await this.actionExecutor.execute(action, context);

      const executionTime = Date.now() - startTime;
      this.log('info', `Action executed: ${action.id} for rule ${ruleId} (${executionTime}ms)`);

      return {
        ruleId,
        actionId: action.id,
        success: true,
        executionTime,
        timestamp: Date.now(),
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.log('error', `Action failed: ${action.id} for rule ${ruleId}: ${error}`);

      if (action.rollback && this.config.enableRollback) {
        try {
          await this.actionExecutor.rollback(action, context);
          return {
            ruleId,
            actionId: action.id,
            success: false,
            error: error as Error,
            executionTime,
            rollback: true,
            rollbackSuccess: true,
            timestamp: Date.now(),
          };
        } catch (rollbackError) {
          return {
            ruleId,
            actionId: action.id,
            success: false,
            error: error as Error,
            executionTime,
            rollback: true,
            rollbackSuccess: false,
            rollbackError: rollbackError as Error,
            timestamp: Date.now(),
          };
        }
      }

      return {
        ruleId,
        actionId: action.id,
        success: false,
        error: error as Error,
        executionTime,
        timestamp: Date.now(),
      };
    }
  }

  private detectConflicts(results: RuleEvaluationResult[]): RuleConflict[] {
    const conflicts: RuleConflict[] = [];
    const ruleIds = results.map(r => r.ruleId);

    for (let i = 0; i < ruleIds.length; i++) {
      for (let j = i + 1; j < ruleIds.length; j++) {
        const rule1 = this.rules.get(ruleIds[i]);
        const rule2 = this.rules.get(ruleIds[j]);

        if (!rule1 || !rule2) continue;

        const conflict = this.checkConflict(rule1, rule2);
        if (conflict) {
          conflicts.push({
            ...conflict,
            rules: [ruleIds[i], ruleIds[j]],
          });
        }
      }
    }

    return conflicts;
  }

  private checkConflict(rule1: Rule, rule2: Rule): Omit<RuleConflict, 'rules'> | null {
    if (rule1.priority === rule2.priority) {
      return {
        type: 'priority',
        description: `Rules ${rule1.id} and ${rule2.id} have the same priority`,
        severity: 'medium',
      };
    }

    const actionTargets1 = new Set(rule1.actions.map(a => a.target));
    const actionTargets2 = new Set(rule2.actions.map(a => a.target));

    const commonTargets = [...actionTargets1].filter(t => actionTargets2.has(t));
    if (commonTargets.length > 0) {
      return {
        type: 'resource',
        description: `Rules ${rule1.id} and ${rule2.id} target the same resources: ${commonTargets.join(', ')}`,
        severity: 'high',
      };
    }

    return null;
  }

  private updateRuleStatistics(ruleId: string, type: 'triggered' | 'executed' | 'failed', executionTime?: number): void {
    if (!this.config.enableStatistics) return;

    const rule = this.rules.get(ruleId);
    if (!rule || !rule.statistics) return;

    switch (type) {
      case 'triggered':
        rule.statistics.triggeredCount++;
        rule.statistics.lastTriggeredAt = Date.now();
        break;
      case 'executed':
        rule.statistics.executedCount++;
        rule.statistics.lastExecutedAt = Date.now();
        if (executionTime) {
          const totalTime = rule.statistics.avgExecutionTime * (rule.statistics.executedCount - 1);
          rule.statistics.avgExecutionTime = (totalTime + executionTime) / rule.statistics.executedCount;
        }
        break;
      case 'failed':
        rule.statistics.failedCount++;
        break;
    }

    const total = rule.statistics.executedCount + rule.statistics.failedCount;
    rule.statistics.successRate = total > 0 ? rule.statistics.executedCount / total : 1;
  }

  private validateRule(rule: Rule): void {
    if (!rule.id || !rule.name) {
      throw new Error('Rule must have id and name');
    }

    if (!rule.conditions) {
      throw new Error('Rule must have conditions');
    }

    if (!rule.actions || rule.actions.length === 0) {
      throw new Error('Rule must have at least one action');
    }

    if (rule.priority < 0 || rule.priority > 100) {
      throw new Error('Rule priority must be between 0 and 100');
    }
  }

  private incrementVersion(version: string): string {
    const parts = version.split('.');
    const patch = parseInt(parts[2] || '0', 10) + 1;
    return `${parts[0]}.${parts[1]}.${patch}`;
  }

  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string): void {
    if (!this.config.enableLogging) return;

    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.config.logLevel);
    const messageLevelIndex = levels.indexOf(level);

    if (messageLevelIndex >= currentLevelIndex) {
      this.emit('log', { level, message, timestamp: Date.now() });
    }
  }

  public getRule(ruleId: string): Rule | undefined {
    return this.rules.get(ruleId);
  }

  public getAllRules(): Rule[] {
    return Array.from(this.rules.values());
  }

  public getEnabledRules(): Rule[] {
    return Array.from(this.rules.values()).filter(r => r.enabled);
  }

  public getStatistics(): {
    totalRules: number;
    enabledRules: number;
    disabledRules: number;
    totalTriggers: number;
    totalExecutions: number;
    totalFailures: number;
    avgSuccessRate: number;
  } {
    const rules = Array.from(this.rules.values());
    const statistics = rules.map(r => r.statistics || {
      triggeredCount: 0,
      executedCount: 0,
      failedCount: 0,
      avgExecutionTime: 0,
      successRate: 1,
    });

    const totalTriggers = statistics.reduce((sum, s) => sum + s.triggeredCount, 0);
    const totalExecutions = statistics.reduce((sum, s) => sum + s.executedCount, 0);
    const totalFailures = statistics.reduce((sum, s) => sum + s.failedCount, 0);
    const avgSuccessRate = statistics.length > 0
      ? statistics.reduce((sum, s) => sum + s.successRate, 0) / statistics.length
      : 1;

    return {
      totalRules: rules.length,
      enabledRules: rules.filter(r => r.enabled).length,
      disabledRules: rules.filter(r => !r.enabled).length,
      totalTriggers,
      totalExecutions,
      totalFailures,
      avgSuccessRate,
    };
  }

  public getConfig(): RuleEngineConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<RuleEngineConfig>): void {
    this.config = { ...this.config, ...updates };
    this.emit('config-updated', this.config);
  }

  public async reset(): Promise<void> {
    this.rules.clear();
    this.ruleHistory = [];
    this.executionHistory = [];
    this.loadDefaultRules();
    this.emit('reset', this.getStatistics());
  }
}

class ConditionEvaluator {
  constructor(private config: RuleEngineConfig) {}

  async evaluate(condition: RuleCondition, context: RuleContext): Promise<Array<{ conditionId: string; matched: boolean; value?: unknown; expected?: unknown }>> {
    const results: Array<{ conditionId: string; matched: boolean; value?: unknown; expected?: unknown }> = [];

    if (condition.type === 'composite' && condition.conditions) {
      for (const subCondition of condition.conditions) {
        const subResults = await this.evaluate(subCondition, context);
        results.push(...subResults);
      }
    } else {
      const value = this.extractValue(condition.field, context);
      const matched = this.evaluateCondition(condition, value);
      results.push({
        conditionId: condition.id,
        matched,
        value,
        expected: condition.value,
      });
    }

    return results;
  }

  private extractValue(field: string, context: RuleContext): unknown {
    const parts = field.split('.');
    let value: unknown = context;

    for (const part of parts) {
      if (value && typeof value === 'object') {
        value = (value as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }

    return value;
  }

  private evaluateCondition(condition: RuleCondition, value: unknown): boolean {
    switch (condition.operator) {
      case 'eq':
        return value === condition.value;
      case 'ne':
        return value !== condition.value;
      case 'gt':
        return typeof value === 'number' && typeof condition.value === 'number' && value > condition.value;
      case 'lt':
        return typeof value === 'number' && typeof condition.value === 'number' && value < condition.value;
      case 'gte':
        return typeof value === 'number' && typeof condition.value === 'number' && value >= condition.value;
      case 'lte':
        return typeof value === 'number' && typeof condition.value === 'number' && value <= condition.value;
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(value);
      case 'contains':
        return typeof value === 'string' && typeof condition.value === 'string' && value.includes(condition.value);
      case 'between':
        return typeof value === 'number' &&
          Array.isArray(condition.value) &&
          condition.value.length === 2 &&
          value >= condition.value[0] &&
          value <= condition.value[1];
      case 'regex':
        return typeof value === 'string' &&
          typeof condition.value === 'string' &&
          new RegExp(condition.value).test(value);
      default:
        return false;
    }
  }
}

class ActionExecutor {
  constructor(private config: RuleEngineConfig) {}

  async execute(action: RuleAction, context: RuleContext): Promise<void> {
    if (action.delay) {
      await new Promise(resolve => setTimeout(resolve, action.delay));
    }

    this.emit('action-executed', { action, context });

    if (action.duration) {
      setTimeout(async () => {
        if (action.rollback) {
          await this.rollback(action, context);
        }
      }, action.duration);
    }
  }

  async rollback(action: RuleAction, context: RuleContext): Promise<void> {
    this.emit('action-rolled-back', { action, context });
  }

  private emit(event: string, data: unknown): void {
  }
}

class RuleConflictResolver {
  constructor(private config: RuleEngineConfig) {}

  resolve(conflict: RuleConflict, rules: Map<string, Rule>): ConflictResolution {
    switch (this.config.conflictResolutionStrategy) {
      case 'priority':
        return this.resolveByPriority(conflict, rules);
      case 'merge':
        return this.resolveByMerge(conflict, rules);
      case 'sequential':
        return this.resolveSequentially(conflict, rules);
      case 'parallel':
        return this.resolveInParallel(conflict, rules);
      default:
        return this.resolveByPriority(conflict, rules);
    }
  }

  private resolveByPriority(conflict: RuleConflict, rules: Map<string, Rule>): ConflictResolution {
    const sortedRules = conflict.rules
      .map(id => rules.get(id))
      .filter((r): r is Rule => r !== undefined)
      .sort((a, b) => b.priority - a.priority);

    return {
      strategy: 'priority',
      selectedRules: sortedRules.map(r => r.id),
    };
  }

  private resolveByMerge(conflict: RuleConflict, rules: Map<string, Rule>): ConflictResolution {
    const allActions: RuleAction[] = [];

    for (const ruleId of conflict.rules) {
      const rule = rules.get(ruleId);
      if (rule) {
        allActions.push(...rule.actions);
      }
    }

    return {
      strategy: 'merge',
      selectedRules: conflict.rules,
      mergedActions: allActions,
    };
  }

  private resolveSequentially(conflict: RuleConflict, rules: Map<string, Rule>): ConflictResolution {
    const sortedRules = conflict.rules
      .map(id => rules.get(id))
      .filter((r): r is Rule => r !== undefined)
      .sort((a, b) => b.priority - a.priority);

    return {
      strategy: 'sequential',
      selectedRules: sortedRules.map(r => r.id),
    };
  }

  private resolveInParallel(conflict: RuleConflict, rules: Map<string, Rule>): ConflictResolution {
    return {
      strategy: 'parallel',
      selectedRules: conflict.rules,
    };
  }
}

export default RuleEngine;
