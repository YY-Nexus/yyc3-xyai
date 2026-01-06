import type { UUID } from './database'

export type JsonValue = string | number | boolean | null | Record<string, JsonValue> | JsonValue[]

export type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary'

export type AggregationType = 'sum' | 'avg' | 'min' | 'max' | 'count' | 'distinct'

export type TimeGranularity = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'

export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'heatmap' | 'treemap' | 'funnel' | 'gauge'

export type TrendDirection = 'up' | 'down' | 'stable'

export type ComparisonType = 'previous_period' | 'same_period_last_year' | 'target' | 'baseline'

export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical'

export type ReportFormat = 'pdf' | 'excel' | 'csv' | 'json' | 'html'

export type ExportFrequency = 'once' | 'daily' | 'weekly' | 'monthly'

export type DataSource = 'database' | 'api' | 'file' | 'stream' | 'cache'

export interface Metric {
  id: UUID
  name: string
  description: string
  type: MetricType
  unit: string
  tags: Record<string, string>
  created_at: Date
  updated_at: Date
}

export interface MetricValue {
  metric_id: UUID
  value: number
  timestamp: Date
  labels?: Record<string, string>
}

export interface MetricSeries {
  metric: Metric
  values: MetricValue[]
  aggregation?: AggregationType
}

export interface Dimension {
  id: UUID
  name: string
  type: 'categorical' | 'numerical' | 'temporal'
  values?: string[]
}

export interface Filter {
  dimension: string
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'not_in' | 'contains' | 'starts_with' | 'ends_with'
  value: string | number | boolean | string[] | number[]
}

export interface QueryOptions {
  metrics: string[]
  dimensions?: string[]
  filters?: Filter[]
  granularity?: TimeGranularity
  startDate: Date
  endDate: Date
  aggregation?: AggregationType
  limit?: number
  offset?: number
}

export interface QueryResult {
  data: Record<string, JsonValue>[]
  metadata: {
    total: number
    queryTime: number
    cached: boolean
  }
}

export interface ChartConfig {
  type: ChartType
  title: string
  xAxis?: {
    field: string
    label: string
    type: 'category' | 'time' | 'value'
  }
  yAxis?: {
    field: string
    label: string
    type: 'value'
  }
  series?: Array<{
    field: string
    label: string
    color?: string
  }>
  options?: {
    stacked?: boolean
    normalized?: boolean
    showLegend?: boolean
    showGrid?: boolean
    showTooltip?: boolean
  }
}

export interface Dashboard {
  id: UUID
  name: string
  description: string
  layout: DashboardLayout
  widgets: Widget[]
  filters?: Filter[]
  refreshInterval?: number
  created_at: Date
  updated_at: Date
}

export interface DashboardLayout {
  type: 'grid' | 'flex' | 'absolute'
  columns: number
  rows?: number
  gap?: number
}

export interface Widget {
  id: UUID
  type: 'metric' | 'chart' | 'table' | 'text' | 'custom'
  title: string
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  config: ChartConfig | MetricConfig | TableConfig | TextConfig
  dataSource: DataSource
  query?: QueryOptions
  refreshInterval?: number
}

export interface MetricConfig {
  metricId: UUID
  showTrend?: boolean
  showComparison?: boolean
  comparisonType?: ComparisonType
  format?: 'number' | 'percentage' | 'currency' | 'duration'
}

export interface TableConfig {
  columns: Array<{
    field: string
    label: string
    sortable?: boolean
    filterable?: boolean
    format?: string
  }>
  sortable?: boolean
  filterable?: boolean
  pagination?: boolean
  pageSize?: number
}

export interface TextConfig {
  content: string
  format: 'plain' | 'markdown' | 'html'
}

export interface Report {
  id: UUID
  name: string
  description: string
  type: 'dashboard' | 'custom' | 'scheduled'
  format: ReportFormat
  template?: UUID
  parameters?: Record<string, JsonValue>
  schedule?: Schedule
  recipients: string[]
  created_at: Date
  updated_at: Date
}

export interface Schedule {
  frequency: ExportFrequency
  timezone: string
  time?: string
  dayOfWeek?: number
  dayOfMonth?: number
  startDate: Date
  endDate?: Date
}

export interface Alert {
  id: UUID
  name: string
  description: string
  metricId: UUID
  condition: AlertCondition
  severity: AlertSeverity
  enabled: boolean
  channels: NotificationChannel[]
  cooldown?: number
  lastTriggered?: Date
  created_at: Date
  updated_at: Date
}

export interface AlertCondition {
  operator: 'gt' | 'lt' | 'eq' | 'ne' | 'gte' | 'lte'
  threshold: number
  duration?: number
  aggregation?: AggregationType
}

export interface NotificationChannel {
  type: 'email' | 'webhook' | 'slack' | 'sms'
  config: Record<string, JsonValue>
}

export interface AlertTrigger {
  id: UUID
  alertId: UUID
  metricValue: number
  threshold: number
  message: string
  triggeredAt: Date
  acknowledgedAt?: Date
  acknowledgedBy?: UUID
}

export interface TrendAnalysis {
  metric: string
  currentValue: number
  previousValue: number
  change: number
  changePercent: number
  direction: TrendDirection
  significance: 'significant' | 'moderate' | 'insignificant'
  confidence: number
}

export interface AnomalyDetection {
  metric: string
  timestamp: Date
  value: number
  expected: number
  deviation: number
  severity: 'low' | 'medium' | 'high'
  type: 'spike' | 'drop' | 'pattern_break'
}

export interface Forecast {
  metric: string
  horizon: number
  method: 'linear' | 'exponential' | 'arima' | 'prophet' | 'lstm'
  predictions: Array<{
    timestamp: Date
    value: number
    confidenceInterval: {
      lower: number
      upper: number
    }
  }>
  accuracy: {
    mae: number
    mse: number
    rmse: number
    mape: number
  }
}

export interface CohortAnalysis {
  cohort: string
  size: number
  metrics: Array<{
    period: number
    value: number
    retentionRate: number
  }>
}

export interface FunnelAnalysis {
  name: string
  steps: Array<{
    name: string
    count: number
    conversionRate: number
    dropOffRate: number
  }>
  overallConversionRate: number
  averageTimeBetweenSteps: number
}

export interface Segment {
  id: UUID
  name: string
  description: string
  criteria: Filter[]
  size: number
  percentage: number
  characteristics: Record<string, JsonValue>
  created_at: Date
  updated_at: Date
}

export interface HeatmapData {
  x: string
  y: string
  value: number
  metadata?: Record<string, JsonValue>
}

export interface SankeyData {
  nodes: Array<{
    id: string
    label: string
    value?: number
  }>
  links: Array<{
    source: string
    target: string
    value: number
  }>
}

export interface TreemapData {
  name: string
  value: number
  children?: TreemapData[]
  color?: string
}

export interface HistogramData {
  bin: string
  count: number
  density: number
}

export interface ScatterData {
  x: number
  y: number
  size?: number
  color?: string
  metadata?: Record<string, JsonValue>
}

export interface PerformanceMetrics {
  responseTime: {
    p50: number
    p95: number
    p99: number
    avg: number
  }
  throughput: number
  errorRate: number
  availability: number
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  networkUsage: number
}

export interface UserBehaviorMetrics {
  activeUsers: number
  newUsers: number
  returningUsers: number
  sessionDuration: {
    avg: number
    median: number
  }
  pageViews: number
  bounceRate: number
  conversionRate: number
  retentionRate: number
  churnRate: number
}

export interface BusinessMetrics {
  revenue: number
  revenueGrowth: number
  averageOrderValue: number
  customerLifetimeValue: number
  customerAcquisitionCost: number
  monthlyRecurringRevenue: number
  annualRecurringRevenue: number
}

export interface GrowthMetrics {
  totalRecords: number
  recordsByCategory: Record<string, number>
  recordsByMonth: Array<{
    month: string
    count: number
  }>
  averageRecordsPerChild: number
  activeChildren: number
  totalConversations: number
  conversationsByRole: Record<string, number>
  averageConversationLength: number
}

export interface AssessmentMetrics {
  dimensionScores: Record<string, {
    score: number
    level: string
    percentile: number
    description: string
  }>
  overallLevel: string
  overallScore: number
  strengths: string[]
  areasForImprovement: string[]
  recommendations: string[]
  nextSteps: string[]
}

export interface AnalyticsEvent {
  id: UUID
  userId?: UUID
  sessionId?: string
  eventType: string
  eventName: string
  properties: Record<string, JsonValue>
  timestamp: Date
  platform: 'web' | 'mobile' | 'api'
  device?: {
    type: string
    os: string
    browser?: string
  }
  location?: {
    country: string
    city: string
    timezone: string
  }
}

export interface EventAggregation {
  eventType: string
  eventName: string
  count: number
  uniqueUsers: number
  avgValue?: number
  sumValue?: number
  firstOccurrence: Date
  lastOccurrence: Date
}

export interface RealtimeMetric {
  name: string
  value: number
  timestamp: Date
  trend?: TrendDirection
  change?: number
  changePercent?: number
}

export interface RealtimeDashboard {
  metrics: RealtimeMetric[]
  alerts: AlertTrigger[]
  activeUsers: number
  throughput: number
  errorRate: number
}

export interface DataQualityReport {
  completeness: number
  accuracy: number
  consistency: number
  timeliness: number
  validity: number
  uniqueness: number
  issues: Array<{
    type: string
    severity: 'low' | 'medium' | 'high'
    description: string
    count: number
    affectedRecords: number
  }>
}

export interface AnalyticsExport {
  id: UUID
  reportId: UUID
  format: ReportFormat
  status: 'pending' | 'processing' | 'completed' | 'failed'
  url?: string
  expiresAt?: Date
  createdAt: Date
  completedAt?: Date
  error?: string
}

export interface AnalyticsConfig {
  dataRetention: {
    raw: number
    aggregated: number
  }
  aggregationGranularity: TimeGranularity
  defaultTimezone: string
  alertDefaults: {
    severity: AlertSeverity
    cooldown: number
  }
  performance: {
    cacheEnabled: boolean
    cacheTTL: number
    queryTimeout: number
  }
  privacy: {
    anonymizeIP: boolean
    maskPII: boolean
    dataMinimization: boolean
  }
}

export interface ComparisonResult {
  current: number
  previous: number
  change: number
  changePercent: number
  direction: TrendDirection
  isSignificant: boolean
  confidence: number
}

export interface Insight {
  id: UUID
  type: 'trend' | 'anomaly' | 'correlation' | 'opportunity' | 'risk'
  title: string
  description: string
  metrics: string[]
  confidence: number
  impact: 'low' | 'medium' | 'high'
  actionable: boolean
  recommendations?: string[]
  createdAt: Date
  expiresAt?: Date
}

export interface AnalyticsQuery {
  id: UUID
  name: string
  description: string
  query: QueryOptions
  createdBy: UUID
  createdAt: Date
  updatedAt: Date
  lastExecuted?: Date
  executionCount: number
  avgExecutionTime: number
}
