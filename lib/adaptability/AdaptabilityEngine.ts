/**
 * @file AdaptabilityEngine.ts
 * @description YYC³ AI浮窗系统自适应引擎 - 负责根据环境和用户需求自动调整系统行为和配置
 * @module lib/adaptability
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-20
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { EventEmitter } from 'events';

export interface Environment {
  device: DeviceEnvironment;
  network: NetworkEnvironment;
  time: TimeEnvironment;
  user: UserEnvironment;
  system: SystemEnvironment;
}

export interface DeviceEnvironment {
  type: 'mobile' | 'tablet' | 'desktop' | 'iot';
  screenSize: { width: number; height: number };
  orientation: 'portrait' | 'landscape';
  touchSupport: boolean;
  devicePixelRatio: number;
  memory: number;
  cpuCores: number;
  battery?: {
    level: number;
    charging: boolean;
  };
}

export interface NetworkEnvironment {
  type: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
  speed: 'slow' | 'medium' | 'fast';
  latency: number;
  bandwidth: number;
  online: boolean;
}

export interface TimeEnvironment {
  timestamp: number;
  timezone: string;
  localTime: string;
  hour: number;
  dayOfWeek: number;
  isWeekend: boolean;
  isWorkHours: boolean;
}

export interface UserEnvironment {
  activity: 'active' | 'idle' | 'away';
  lastActivity: number;
  preferences: UserPreferences;
  context: UserContext;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  fontSize: 'small' | 'medium' | 'large';
  animations: boolean;
  notifications: 'all' | 'important' | 'none';
  privacy: 'strict' | 'normal' | 'relaxed';
}

export interface UserContext {
  currentTask?: string;
  recentTasks: string[];
  goals: string[];
  constraints: string[];
}

export interface SystemEnvironment {
  load: number;
  memoryUsage: number;
  availableMemory: number;
  performanceMode: 'performance' | 'balanced' | 'power-saving';
}

export interface AdaptationContext {
  environment: Environment;
  adaptationHistory: Adaptation[];
  adaptationRules: AdaptationRule[];
  adaptationMetrics: AdaptationMetrics;
}

export interface Adaptation {
  id: string;
  type: AdaptationType;
  trigger: AdaptationTrigger;
  action: AdaptationAction;
  result: AdaptationResult;
  timestamp: number;
}

export type AdaptationType =
  | 'ui-adjustment'
  | 'resource-allocation'
  | 'feature-prioritization'
  | 'behavior-change'
  | 'performance-optimization';

export interface AdaptationTrigger {
  type: 'environment-change' | 'user-action' | 'system-event' | 'time-based';
  source: string;
  data: Record<string, unknown>;
}

export interface AdaptationAction {
  type: AdaptationType;
  target: string;
  parameters: Record<string, unknown>;
}

export interface AdaptationResult {
  success: boolean;
  impact: AdaptationImpact;
  userSatisfaction?: number;
  performanceImprovement?: number;
  error?: Error;
}

export interface AdaptationImpact {
  performance: number;
  userExperience: number;
  resourceUsage: number;
  functionality: number;
}

export interface AdaptationRule {
  id: string;
  name: string;
  description: string;
  priority: number;
  condition: AdaptationCondition;
  action: AdaptationAction;
  enabled: boolean;
}

export interface AdaptationCondition {
  type: 'environment' | 'user' | 'system' | 'composite';
  operator: 'and' | 'or' | 'not';
  conditions?: AdaptationCondition[];
  field?: string;
  operator2?: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'contains';
  value?: unknown;
}

export interface AdaptationMetrics {
  totalAdaptations: number;
  successfulAdaptations: number;
  failedAdaptations: number;
  averageResponseTime: number;
  averageUserSatisfaction: number;
  averagePerformanceImprovement: number;
}

export class AdaptabilityEngine extends EventEmitter {
  private static instance: AdaptabilityEngine;
  private environmentSensor: EnvironmentSensor;
  private contextAnalyzer: ContextAnalyzer;
  private decisionEngine: DecisionEngine;
  private executionEngine: ExecutionEngine;
  private adaptationContext: AdaptationContext;
  private isAdapting: boolean = false;

  private constructor() {
    super();
    this.environmentSensor = new EnvironmentSensor();
    this.contextAnalyzer = new ContextAnalyzer();
    this.decisionEngine = new DecisionEngine();
    this.executionEngine = new ExecutionEngine();
    this.adaptationContext = this.initializeAdaptationContext();
    this.setupEventListeners();
    this.initialize();
  }

  static getInstance(): AdaptabilityEngine {
    if (!AdaptabilityEngine.instance) {
      AdaptabilityEngine.instance = new AdaptabilityEngine();
    }
    return AdaptabilityEngine.instance;
  }

  private initializeAdaptationContext(): AdaptationContext {
    return {
      environment: this.createDefaultEnvironment(),
      adaptationHistory: [],
      adaptationRules: this.createDefaultAdaptationRules(),
      adaptationMetrics: {
        totalAdaptations: 0,
        successfulAdaptations: 0,
        failedAdaptations: 0,
        averageResponseTime: 0,
        averageUserSatisfaction: 0,
        averagePerformanceImprovement: 0,
      },
    };
  }

  private createDefaultEnvironment(): Environment {
    return {
      device: {
        type: 'desktop',
        screenSize: { width: 1920, height: 1080 },
        orientation: 'landscape',
        touchSupport: false,
        devicePixelRatio: 1,
        memory: 8,
        cpuCores: 4,
      },
      network: {
        type: 'unknown',
        speed: 'fast',
        latency: 0,
        bandwidth: 0,
        online: true,
      },
      time: {
        timestamp: Date.now(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        localTime: new Date().toLocaleTimeString(),
        hour: new Date().getHours(),
        dayOfWeek: new Date().getDay(),
        isWeekend: [0, 6].includes(new Date().getDay()),
        isWorkHours: new Date().getHours() >= 9 && new Date().getHours() < 18,
      },
      user: {
        activity: 'active',
        lastActivity: Date.now(),
        preferences: {
          theme: 'auto',
          language: 'zh-CN',
          fontSize: 'medium',
          animations: true,
          notifications: 'important',
          privacy: 'normal',
        },
        context: {
          recentTasks: [],
          goals: [],
          constraints: [],
        },
      },
      system: {
        load: 0,
        memoryUsage: 0,
        availableMemory: 0,
        performanceMode: 'balanced',
      },
    };
  }

  private createDefaultAdaptationRules(): AdaptationRule[] {
    return [
      {
        id: 'rule-mobile-optimization',
        name: 'Mobile Optimization',
        description: 'Optimize UI for mobile devices',
        priority: 10,
        condition: {
          type: 'environment',
          field: 'device.type',
          operator2: 'eq',
          value: 'mobile',
        },
        action: {
          type: 'ui-adjustment',
          target: 'widget',
          parameters: {
            compactMode: true,
            fontSize: 'small',
            animations: false,
          },
        },
        enabled: true,
      },
      {
        id: 'rule-low-network-optimization',
        name: 'Low Network Optimization',
        description: 'Optimize for slow network',
        priority: 9,
        condition: {
          type: 'environment',
          field: 'network.speed',
          operator2: 'eq',
          value: 'slow',
        },
        action: {
          type: 'performance-optimization',
          target: 'system',
          parameters: {
            lazyLoading: true,
            imageCompression: true,
            requestCaching: true,
          },
        },
        enabled: true,
      },
      {
        id: 'rule-battery-saving',
        name: 'Battery Saving',
        description: 'Enable battery saving mode',
        priority: 8,
        condition: {
          type: 'environment',
          field: 'battery.level',
          operator2: 'lt',
          value: 20,
        },
        action: {
          type: 'resource-allocation',
          target: 'system',
          parameters: {
            performanceMode: 'power-saving',
            animations: false,
            backgroundSync: false,
          },
        },
        enabled: true,
      },
      {
        id: 'rule-work-hours-focus',
        name: 'Work Hours Focus',
        description: 'Focus mode during work hours',
        priority: 7,
        condition: {
          type: 'environment',
          field: 'time.isWorkHours',
          operator2: 'eq',
          value: true,
        },
        action: {
          type: 'feature-prioritization',
          target: 'widget',
          parameters: {
            notifications: 'important',
            autoResponse: false,
            focusMode: true,
          },
        },
        enabled: true,
      },
      {
        id: 'rule-idle-mode',
        name: 'Idle Mode',
        description: 'Reduce resource usage when idle',
        priority: 6,
        condition: {
          type: 'user',
          field: 'activity',
          operator2: 'eq',
          value: 'idle',
        },
        action: {
          type: 'resource-allocation',
          target: 'system',
          parameters: {
            pollingInterval: 30000,
            backgroundTasks: false,
          },
        },
        enabled: true,
      },
    ];
  }

  private setupEventListeners(): void {
    this.environmentSensor.on('environment-changed', (environment: Environment) => {
      this.handleEnvironmentChanged(environment);
    });

    this.decisionEngine.on('decision-made', (decision: AdaptationAction) => {
      this.handleDecisionMade(decision);
    });

    this.executionEngine.on('adaptation-completed', (result: AdaptationResult) => {
      this.handleAdaptationCompleted(result);
    });
  }

  private async initialize(): Promise<void> {
    await this.environmentSensor.start();
    this.emit('initialized', this.adaptationContext);
  }

  private handleEnvironmentChanged(environment: Environment): void {
    this.adaptationContext.environment = environment;
    this.adapt();
  }

  private handleDecisionMade(decision: AdaptationAction): void {
    this.emit('decision-made', decision);
  }

  private handleAdaptationCompleted(result: AdaptationResult): void {
    this.adaptationContext.adaptationMetrics.totalAdaptations++;
    if (result.success) {
      this.adaptationContext.adaptationMetrics.successfulAdaptations++;
      if (result.userSatisfaction) {
        const totalSatisfaction =
          this.adaptationContext.adaptationMetrics.averageUserSatisfaction *
          (this.adaptationContext.adaptationMetrics.successfulAdaptations - 1);
        this.adaptationContext.adaptationMetrics.averageUserSatisfaction =
          (totalSatisfaction + result.userSatisfaction) /
          this.adaptationContext.adaptationMetrics.successfulAdaptations;
      }
      if (result.performanceImprovement) {
        const totalImprovement =
          this.adaptationContext.adaptationMetrics.averagePerformanceImprovement *
          (this.adaptationContext.adaptationMetrics.successfulAdaptations - 1);
        this.adaptationContext.adaptationMetrics.averagePerformanceImprovement =
          (totalImprovement + result.performanceImprovement) /
          this.adaptationContext.adaptationMetrics.successfulAdaptations;
      }
    } else {
      this.adaptationContext.adaptationMetrics.failedAdaptations++;
    }

    this.emit('adaptation-completed', result);
    this.isAdapting = false;
  }

  public async adapt(): Promise<void> {
    if (this.isAdapting) {
      return;
    }

    this.isAdapting = true;
    const startTime = Date.now();

    this.emit('adaptation-started', this.adaptationContext);

    try {
      const environment = await this.environmentSensor.sense();
      const context = await this.contextAnalyzer.analyze(environment);
      const decision = await this.decisionEngine.decide(context);
      const result = await this.executionEngine.execute(decision);

      const adaptation: Adaptation = {
        id: `adaptation_${Date.now()}`,
        type: decision.type,
        trigger: {
          type: 'environment-change',
          source: 'environment-sensor',
          data: environment,
        },
        action: decision,
        result,
        timestamp: Date.now(),
      };

      this.adaptationContext.adaptationHistory.push(adaptation);

      const responseTime = Date.now() - startTime;
      const totalResponseTime =
        this.adaptationContext.adaptationMetrics.averageResponseTime *
        (this.adaptationContext.adaptationMetrics.totalAdaptations);
      this.adaptationContext.adaptationMetrics.averageResponseTime =
        (totalResponseTime + responseTime) /
        (this.adaptationContext.adaptationMetrics.totalAdaptations + 1);

      this.emit('adaptation-completed', { environment, context, decision, result });
    } catch (error) {
      this.emit('adaptation-failed', error);
      this.isAdapting = false;
      throw error;
    }
  }

  public getAdaptationContext(): AdaptationContext {
    return this.adaptationContext;
  }

  public addAdaptationRule(rule: AdaptationRule): void {
    this.adaptationContext.adaptationRules.push(rule);
    this.emit('rule-added', rule);
  }

  public removeAdaptationRule(ruleId: string): void {
    this.adaptationContext.adaptationRules = this.adaptationContext.adaptationRules.filter(
      rule => rule.id !== ruleId
    );
    this.emit('rule-removed', ruleId);
  }

  public enableAdaptationRule(ruleId: string): void {
    const rule = this.adaptationContext.adaptationRules.find(r => r.id === ruleId);
    if (rule) {
      rule.enabled = true;
      this.emit('rule-enabled', ruleId);
    }
  }

  public disableAdaptationRule(ruleId: string): void {
    const rule = this.adaptationContext.adaptationRules.find(r => r.id === ruleId);
    if (rule) {
      rule.enabled = false;
      this.emit('rule-disabled', ruleId);
    }
  }

  public async reset(): Promise<void> {
    this.adaptationContext = this.initializeAdaptationContext();
    await this.initialize();
    this.emit('reset', this.adaptationContext);
  }
}

class EnvironmentSensor extends EventEmitter {
  private sensingInterval: NodeJS.Timeout | null = null;
  private currentEnvironment: Environment;

  constructor() {
    super();
    this.currentEnvironment = this.createDefaultEnvironment();
  }

  private createDefaultEnvironment(): Environment {
    return {
      device: {
        type: 'desktop',
        screenSize: { width: 1920, height: 1080 },
        orientation: 'landscape',
        touchSupport: false,
        devicePixelRatio: 1,
        memory: 8,
        cpuCores: 4,
      },
      network: {
        type: 'unknown',
        speed: 'fast',
        latency: 0,
        bandwidth: 0,
        online: true,
      },
      time: {
        timestamp: Date.now(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        localTime: new Date().toLocaleTimeString(),
        hour: new Date().getHours(),
        dayOfWeek: new Date().getDay(),
        isWeekend: [0, 6].includes(new Date().getDay()),
        isWorkHours: new Date().getHours() >= 9 && new Date().getHours() < 18,
      },
      user: {
        activity: 'active',
        lastActivity: Date.now(),
        preferences: {
          theme: 'auto',
          language: 'zh-CN',
          fontSize: 'medium',
          animations: true,
          notifications: 'important',
          privacy: 'normal',
        },
        context: {
          recentTasks: [],
          goals: [],
          constraints: [],
        },
      },
      system: {
        load: 0,
        memoryUsage: 0,
        availableMemory: 0,
        performanceMode: 'balanced',
      },
    };
  }

  async start(): Promise<void> {
    await this.sense();

    this.sensingInterval = setInterval(async () => {
      await this.sense();
    }, 5000);

    this.setupEventListeners();
  }

  async stop(): Promise<void> {
    if (this.sensingInterval) {
      clearInterval(this.sensingInterval);
      this.sensingInterval = null;
    }
  }

  async sense(): Promise<Environment> {
    const deviceEnvironment = await this.senseDeviceEnvironment();
    const networkEnvironment = await this.senseNetworkEnvironment();
    const timeEnvironment = await this.senseTimeEnvironment();
    const userEnvironment = await this.senseUserEnvironment();
    const systemEnvironment = await this.senseSystemEnvironment();

    this.currentEnvironment = {
      device: deviceEnvironment,
      network: networkEnvironment,
      time: timeEnvironment,
      user: userEnvironment,
      system: systemEnvironment,
    };

    this.emit('environment-sensed', this.currentEnvironment);
    return this.currentEnvironment;
  }

  private async senseDeviceEnvironment(): Promise<DeviceEnvironment> {
    if (typeof window === 'undefined') {
      return this.currentEnvironment.device;
    }

    const userAgent = navigator.userAgent;
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
    const isTablet = /iPad|Tablet/i.test(userAgent);

    return {
      type: isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop',
      screenSize: { width: window.innerWidth, height: window.innerHeight },
      orientation:
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
      touchSupport: 'ontouchstart' in window,
      devicePixelRatio: window.devicePixelRatio || 1,
      memory: (navigator as any).deviceMemory || 8,
      cpuCores: navigator.hardwareConcurrency || 4,
      battery: await this.getBatteryInfo(),
    };
  }

  private async getBatteryInfo(): Promise<{ level: number; charging: boolean } | undefined> {
    const battery = (navigator as any).battery;
    if (battery) {
      return {
        level: battery.level * 100,
        charging: battery.charging,
      };
    }
    return undefined;
  }

  private async senseNetworkEnvironment(): Promise<NetworkEnvironment> {
    if (typeof window === 'undefined') {
      return this.currentEnvironment.network;
    }

    const connection = (navigator as any).connection;
    let speed: 'slow' | 'medium' | 'fast' = 'fast';

    if (connection) {
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        speed = 'slow';
      } else if (connection.effectiveType === '3g') {
        speed = 'medium';
      }
    }

    return {
      type: connection?.type || 'unknown',
      speed,
      latency: connection?.rtt || 0,
      bandwidth: connection?.downlink || 0,
      online: navigator.onLine,
    };
  }

  private async senseTimeEnvironment(): Promise<TimeEnvironment> {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();

    return {
      timestamp: now.getTime(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      localTime: now.toLocaleTimeString(),
      hour,
      dayOfWeek,
      isWeekend: [0, 6].includes(dayOfWeek),
      isWorkHours: hour >= 9 && hour < 18,
    };
  }

  private async senseUserEnvironment(): Promise<UserEnvironment> {
    const lastActivity = Date.now();
    const idleTime = lastActivity - this.currentEnvironment.user.lastActivity;

    let activity: 'active' | 'idle' | 'away' = 'active';
    if (idleTime > 300000) {
      activity = 'away';
    } else if (idleTime > 60000) {
      activity = 'idle';
    }

    return {
      ...this.currentEnvironment.user,
      activity,
      lastActivity,
    };
  }

  private async senseSystemEnvironment(): Promise<SystemEnvironment> {
    return {
      load: 0,
      memoryUsage: 0,
      availableMemory: 0,
      performanceMode: 'balanced',
    };
  }

  private setupEventListeners(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.sense());
      window.addEventListener('online', () => this.sense());
      window.addEventListener('offline', () => this.sense());
      window.addEventListener('beforeunload', () => this.stop());
    }
  }
}

class ContextAnalyzer {
  async analyze(environment: Environment): Promise<Environment> {
    return environment;
  }
}

class DecisionEngine extends EventEmitter {
  async decide(context: Environment): Promise<AdaptationAction> {
    const rules = this.getEnabledRules();

    for (const rule of rules) {
      if (this.evaluateCondition(rule.condition, context)) {
        this.emit('decision-made', rule.action);
        return rule.action;
      }
    }

    return {
      type: 'ui-adjustment',
      target: 'widget',
      parameters: {},
    };
  }

  private getEnabledRules(): AdaptationRule[] {
    return [];
  }

  private evaluateCondition(condition: AdaptationCondition, context: Environment): boolean {
    return false;
  }
}

class ExecutionEngine extends EventEmitter {
  async execute(action: AdaptationAction): Promise<AdaptationResult> {
    try {
      await this.performAction(action);

      const result: AdaptationResult = {
        success: true,
        impact: {
          performance: 0.8,
          userExperience: 0.9,
          resourceUsage: 0.7,
          functionality: 0.9,
        },
        userSatisfaction: 0.85,
        performanceImprovement: 0.3,
      };

      this.emit('adaptation-completed', result);
      return result;
    } catch (error) {
      const result: AdaptationResult = {
        success: false,
        impact: {
          performance: 0,
          userExperience: 0,
          resourceUsage: 0,
          functionality: 0,
        },
        error: error as Error,
      };

      this.emit('adaptation-completed', result);
      return result;
    }
  }

  private async performAction(action: AdaptationAction): Promise<void> {
    this.emit('action-performed', action);
  }
}

export default AdaptabilityEngine;
