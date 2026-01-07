/**
 * @file 分析类型定义
 * @description 定义分析相关的类型接口
 * @module types/analytics
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-29
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { JsonValue, JsonObject, JsonArray } from './common';

export type { JsonValue, JsonObject, JsonArray } from './common';

export type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary';

/**
 * 聚合类型
 */
export type AggregationType =
  | 'sum'
  | 'avg'
  | 'min'
  | 'max'
  | 'count'
  | 'median'
  | 'percentile';

/**
 * 时间粒度
 */
export type TimeGranularity =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year';

/**
 * 图表类型
 */
export type ChartType =
  | 'line'
  | 'bar'
  | 'pie'
  | 'area'
  | 'scatter'
  | 'heatmap'
  | 'table'
  | 'gauge'
  | 'funnel'
  | 'sankey'
  | 'treemap';

/**
 * 趋势方向
 */
export type TrendDirection = 'up' | 'down' | 'stable';

/**
 * 比较类型
 */
export type ComparisonType = 'yoy' | 'mom' | 'wow' | 'dod';

/**
 * 告警严重程度
 */
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * 报告格式
 */
export type ReportFormat = 'pdf' | 'excel' | 'csv' | 'json' | 'html';

/**
 * 导出频率
 */
export type ExportFrequency =
  | 'once'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly';

/**
 * 数据源
 */
export type DataSource = 'database' | 'api' | 'file' | 'stream' | 'cache';

/**
 * 指标
 */
export interface Metric {
  id: string;
  name: string;
  type: MetricType;
  aggregation: AggregationType;
  unit?: string;
  description?: string;
  tags?: Record<string, string>;
}

/**
 * 指标值
 */
export interface MetricValue {
  metricId: string;
  value: number;
  timestamp: Date;
  tags?: Record<string, string>;
}

/**
 * 指标序列
 */
export interface MetricSeries {
  metricId: string;
  values: MetricValue[];
  metadata?: Record<string, unknown>;
}

/**
 * 维度
 */
export interface Dimension {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  values?: string[] | number[];
}

/**
 * 过滤器
 */
export interface Filter {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin';
  value: unknown;
}

/**
 * 查询选项
 */
export interface QueryOptions {
  metricIds: string[];
  dimensions?: string[];
  filters?: Filter[];
  granularity?: TimeGranularity;
  startTime: Date;
  endTime: Date;
  limit?: number;
  offset?: number;
}

/**
 * 查询结果
 */
export interface QueryResult {
  data: MetricSeries[];
  metadata: {
    total: number;
    limit: number;
    offset: number;
    startTime: Date;
    endTime: Date;
  };
}

/**
 * 图表配置
 */
export interface ChartConfig {
  id: string;
  type: ChartType;
  title: string;
  metricIds: string[];
  dimensions?: string[];
  filters?: Filter[];
  options?: Record<string, unknown>;
}

/**
 * 仪表板
 */
export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  layout: DashboardLayout;
  widgets: Widget[];
  metadata?: Record<string, unknown>;
}

/**
 * 仪表板布局
 */
export interface DashboardLayout {
  columns: number;
  rows: number;
  items: Array<{
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
  }>;
}

/**
 * 小组件
 */
export interface Widget {
  id: string;
  type: ChartType | 'text' | 'table' | 'metric';
  title: string;
  config: ChartConfig | MetricConfig | TableConfig | TextConfig;
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * 指标配置
 */
export interface MetricConfig {
  metricId: string;
  aggregation: AggregationType;
  format?: string;
  threshold?: {
    warning: number;
    critical: number;
  };
}

/**
 * 表格配置
 */
export interface TableConfig {
  columns: Array<{
    field: string;
    label: string;
    format?: string;
  }>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 文本配置
 */
export interface TextConfig {
  content: string;
  format?: string;
}

/**
 * 报告
 */
export interface Report {
  id: string;
  name: string;
  type: 'dashboard' | 'custom';
  format: ReportFormat;
  config: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 定时任务
 */
export interface Schedule {
  id: string;
  name: string;
  type: 'report' | 'alert' | 'export';
  frequency: ExportFrequency;
  timezone?: string;
  enabled: boolean;
  nextRun: Date;
  lastRun?: Date;
}

/**
 * 告警
 */
export interface Alert {
  id: string;
  name: string;
  description?: string;
  severity: AlertSeverity;
  condition: AlertCondition;
  notification: NotificationChannel;
  enabled: boolean;
  triggeredAt?: Date;
}

/**
 * 告警条件
 */
export interface AlertCondition {
  metricId: string;
  operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq';
  threshold: number;
  duration?: number;
}

/**
 * 通知渠道
 */
export interface NotificationChannel {
  type: 'email' | 'sms' | 'webhook' | 'slack' | 'telegram';
  config: Record<string, unknown>;
}

/**
 * 告警触发
 */
export interface AlertTrigger {
  alertId: string;
  triggeredAt: Date;
  value: number;
  threshold: number;
  status: 'active' | 'resolved';
}

/**
 * 趋势分析
 */
export interface TrendAnalysis {
  metricId: string;
  direction: TrendDirection;
  change: number;
  changePercent: number;
  confidence: number;
  period: ComparisonType;
}

/**
 * 异常检测
 */
export interface AnomalyDetection {
  metricId: string;
  detectedAt: Date;
  value: number;
  expectedValue: number;
  deviation: number;
  severity: AlertSeverity;
}

/**
 * 预测
 */
export interface Forecast {
  metricId: string;
  modelId: string;
  predictions: Array<{
    timestamp: Date;
    value: number;
    confidence: number;
  }>;
  horizon: TimeGranularity;
  createdAt: Date;
}

/**
 * 队列分析
 */
export interface CohortAnalysis {
  cohortId: string;
  cohortSize: number;
  metrics: Array<{
    period: string;
    retention: number;
    churn: number;
  }>;
  createdAt: Date;
}

/**
 * 漏斗分析
 */
export interface FunnelAnalysis {
  funnelId: string;
  steps: Array<{
    name: string;
    count: number;
    conversionRate: number;
    dropOffRate: number;
  }>;
  overallConversionRate: number;
  createdAt: Date;
}

/**
 * 分段
 */
export interface Segment {
  segmentId: string;
  name: string;
  criteria: Filter[];
  size: number;
  characteristics: Record<string, unknown>;
  createdAt: Date;
}

/**
 * 热力图数据
 */
export interface HeatmapData {
  x: string[];
  y: string[];
  values: number[][];
}

/**
 * 桑基图数据
 */
export interface SankeyData {
  nodes: Array<{
    id: string;
    name: string;
    color?: string;
  }>;
  links: Array<{
    source: string;
    target: string;
    value: number;
    color?: string;
  }>;
}

/**
 * 树状图数据
 */
export interface TreemapData {
  name: string;
  value: number;
  children?: TreemapData[];
  color?: string;
}

/**
 * 直方图数据
 */
export interface HistogramData {
  bins: Array<{
    min: number;
    max: number;
    count: number;
  }>;
  mean: number;
  std: number;
}

/**
 * 散点图数据
 */
export interface ScatterData {
  points: Array<{
    x: number;
    y: number;
    size?: number;
    color?: string;
  }>;
}

/**
 * 性能指标
 */
export interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  availability: number;
  cpuUsage?: number;
  memoryUsage?: number;
}

/**
 * 用户行为指标
 */
export interface UserBehaviorMetrics {
  activeUsers: number;
  userRetentionRate: number;
  averageResponseTime?: number;
  userSatisfaction?: number;
  averageSessionDuration?: number;
  pageViewsPerSession?: number;
}

/**
 * 业务指标
 */
export interface BusinessMetrics {
  revenue: number;
  profit: number;
  margin: number;
  growth: number;
  churn: number;
}

/**
 * 成长指标
 */
export interface GrowthMetrics {
  totalGrowthRecords: number;
  averageScore: number;
  completionRate: number;
  improvementRate: number;
  engagement: number;
}

/**
 * 评估指标
 */
export interface AssessmentMetrics {
  totalAssessments: number;
  averageScore: number;
  passRate: number;
  averageCompletionTime: number;
  improvementRate: number;
}

/**
 * 分析事件
 */
export interface AnalyticsEvent {
  eventType: string;
  userId?: string;
  sessionId?: string;
  timestamp: Date;
  properties: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

/**
 * 事件聚合
 */
export interface EventAggregation {
  eventType: string;
  count: number;
  uniqueUsers: number;
  avgValue?: number;
  minValue?: number;
  maxValue?: number;
  sumValue?: number;
  period: {
    start: Date;
    end: Date;
  };
}

/**
 * 实时指标
 */
export interface RealtimeMetric {
  metricId: string;
  value: number;
  timestamp: Date;
  trend?: TrendDirection;
  alert?: {
    severity: AlertSeverity;
    message: string;
  };
  activeUsers?: number;
  newUsers?: number;
  aiConversations?: number;
  averageSatisfaction?: number;
  systemHealth?: number;
  responseTime?: number;
  errorRate?: number;
  totalUsers?: number;
  lastUpdated?: Date;
}

/**
 * 实时仪表板
 */
export interface RealtimeDashboard {
  dashboardId: string;
  metrics: RealtimeMetric[];
  lastUpdated: Date;
}

/**
 * 实时活动
 */
export interface RealtimeActivity {
  id: string;
  activityId: string;
  type: 'user_action' | 'system_event' | 'ai_interaction' | 'business_event';
  description: string;
  timestamp: Date | string;
  userId?: string;
  impact?: 'low' | 'medium' | 'high';
  details?: {
    duration?: number;
    success?: boolean;
    userId?: string;
    sessionId?: string;
  };
  metadata?: {
    ip?: string;
    userAgent?: string;
    location?: string;
    device?: string;
    [key: string]: unknown;
  };
}

/**
 * 数据质量报告
 */
export interface DataQualityReport {
  reportId: string;
  metrics: {
    completeness: number;
    accuracy: number;
    consistency: number;
    timeliness: number;
    uniqueness: number;
  };
  issues: Array<{
    field: string;
    issue: string;
    count: number;
    severity: AlertSeverity;
  }>;
  createdAt: Date;
}

/**
 * 分析导出
 */
export interface AnalyticsExport {
  exportId: string;
  type: 'metrics' | 'events' | 'reports';
  format: ReportFormat;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  url?: string;
  createdAt: Date;
  completedAt?: Date;
}

/**
 * 分析配置
 */
export interface AnalyticsConfig {
  retentionPeriod: number;
  samplingRate?: number;
  aggregationGranularity: TimeGranularity;
  alertRules: Alert[];
}

/**
 * 比较结果
 */
export interface ComparisonResult {
  metricId: string;
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  period: ComparisonType;
  significance: 'significant' | 'not-significant';
}

/**
 * 洞察
 */
export interface Insight {
  insightId: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'risk';
  title: string;
  description: string;
  metricId: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  actions?: string[];
  createdAt: Date;
}

/**
 * 分析查询
 */
export interface AnalyticsQuery {
  queryId: string;
  name: string;
  sql?: string;
  config: QueryOptions;
  createdAt: Date;
  updatedAt: Date;
}
