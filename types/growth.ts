import type { UUID, Timestamp } from './common';

export type GrowthCategory =
  | 'milestone'
  | 'daily'
  | 'achievement'
  | 'health'
  | 'education'
  | 'social';

export type GrowthStageId =
  | '0-3'
  | '3-6'
  | '6-9'
  | '9-12'
  | '12-15'
  | '15-18'
  | '18-22';

export type DevelopmentDimensionId =
  | 'cognitive'
  | 'language'
  | 'motor'
  | 'social'
  | 'emotional'
  | 'selfcare'
  | 'sensory';

export interface GrowthRecord {
  id: UUID;
  childId: UUID;
  title: string;
  description: string | null;
  category: GrowthCategory;
  mediaUrls: string[];
  tags: string[];
  location: string | null;
  isPublic: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface GrowthRecordWithAnalysis extends GrowthRecord {
  aiAnalysis: GrowthRecordAnalysis | null;
  relatedMilestones: Milestone[];
  recommendations: Recommendation[];
}

export interface GrowthRecordAnalysis {
  keywords: string[];
  themes: string[];
  developmentDimensions: DevelopmentDimensionId[];
  qualityScore: number;
  significance: 'low' | 'medium' | 'high';
  suggestions: string[];
  milestoneDetected: boolean;
  milestoneType: string | null;
}

export interface GrowthRecordStats {
  totalRecords: number;
  byCategory: Record<GrowthCategory, number>;
  byMonth: Array<{ month: string; count: number }>;
  averageRecordsPerMonth: number;
  thisMonthRecords: number;
  thisYearRecords: number;
  mostActiveCategory: GrowthCategory | null;
}

export interface GrowthRecordFilter {
  childId?: UUID;
  category?: GrowthCategory | GrowthCategory[];
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
  isPublic?: boolean;
  minQualityScore?: number;
  maxQualityScore?: number;
  location?: string;
}

export interface GrowthRecordCreateInput {
  childId: UUID;
  title: string;
  description?: string;
  category: GrowthCategory;
  mediaUrls?: string[];
  tags?: string[];
  location?: string;
  isPublic?: boolean;
}

export interface GrowthRecordUpdateInput {
  title?: string;
  description?: string;
  category?: GrowthCategory;
  mediaUrls?: string[];
  tags?: string[];
  location?: string;
  isPublic?: boolean;
}

export interface DevelopmentDimension {
  id: DevelopmentDimensionId;
  name: string;
  icon: string;
  color: string;
  description: string;
  indicators: string[];
}

export interface AgeStageConfig {
  id: GrowthStageId;
  name: string;
  subtitle: string;
  ageRange: string;
  color: string;
  icon: string;
  description: string;
  focusAreas: string[];
  milestones: string[];
  developmentDimensions: DevelopmentDimension[];
}

export interface Age {
  years: number;
  months: number;
  days: number;
}

export interface Milestone {
  id: UUID;
  childId: UUID;
  stageId: GrowthStageId;
  dimensionId: DevelopmentDimensionId;
  title: string;
  description: string;
  targetAge: Age;
  achievedAt: Timestamp | null;
  isAchieved: boolean;
  evidence: string[];
  notes: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface MilestoneCreateInput {
  childId: UUID;
  stageId: GrowthStageId;
  dimensionId: DevelopmentDimensionId;
  title: string;
  description: string;
  targetAge: Age;
  evidence?: string[];
  notes?: string;
}

export interface MilestoneUpdateInput {
  isAchieved?: boolean;
  achievedAt?: Timestamp | null;
  evidence?: string[];
  notes?: string;
}

export interface MilestoneStats {
  totalMilestones: number;
  achievedMilestones: number;
  pendingMilestones: number;
  achievementRate: number;
  byDimension: Record<
    DevelopmentDimensionId,
    { total: number; achieved: number }
  >;
  byStage: Record<GrowthStageId, { total: number; achieved: number }>;
  averageAgeOfAchievement: Record<DevelopmentDimensionId, number>;
}

export interface Assessment {
  id: UUID;
  childId: UUID;
  stageId: GrowthStageId;
  assessmentDate: Timestamp;
  dimensionsScores: Record<DevelopmentDimensionId, DimensionScore>;
  overallScore: number;
  overallLevel: string;
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  nextSteps: string[];
  notes: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface DimensionScore {
  score: number;
  level: string;
  percentile: number;
  description: string;
  indicators: Record<
    string,
    { score: number; status: 'achieved' | 'in_progress' | 'not_started' }
  >;
}

export interface AssessmentCreateInput {
  childId: UUID;
  stageId: GrowthStageId;
  assessmentDate: Date;
  dimensionsScores: Record<DevelopmentDimensionId, DimensionScore>;
  notes?: string;
}

export interface AssessmentUpdateInput {
  dimensionsScores?: Record<DevelopmentDimensionId, DimensionScore>;
  notes?: string;
}

export interface AssessmentTrend {
  date: Timestamp;
  overallScore: number;
  dimensionScores: Record<DevelopmentDimensionId, number>;
}

export interface AssessmentStats {
  totalAssessments: number;
  averageScore: number;
  latestScore: number;
  scoreTrend: 'improving' | 'stable' | 'declining';
  dimensionTrends: Record<
    DevelopmentDimensionId,
    'improving' | 'stable' | 'declining'
  >;
  assessmentsByMonth: Array<{ month: string; count: number }>;
}

export type RecommendationType =
  | 'activity'
  | 'content'
  | 'milestone'
  | 'skill'
  | 'book'
  | 'game';

export interface Recommendation {
  id: UUID;
  childId: UUID;
  type: RecommendationType;
  title: string;
  description: string;
  contentUrl: string | null;
  ageRange: { min: number; max: number };
  categories: string[];
  confidenceScore: number;
  isDismissed: boolean;
  isCompleted: boolean;
  completedAt: Timestamp | null;
  createdAt: Timestamp;
}

export interface RecommendationCreateInput {
  childId: UUID;
  type: RecommendationType;
  title: string;
  description: string;
  contentUrl?: string;
  ageRange: { min: number; max: number };
  categories?: string[];
}

export interface RecommendationStats {
  totalRecommendations: number;
  dismissedCount: number;
  completedCount: number;
  completionRate: number;
  byType: Record<RecommendationType, number>;
  averageConfidence: number;
}

export interface GrowthTimeline {
  childId: UUID;
  period: 'month' | 'quarter' | 'year' | 'all';
  startDate: Timestamp;
  endDate: Timestamp;
  records: GrowthRecord[];
  milestones: Milestone[];
  assessments: Assessment[];
  insights: GrowthInsight[];
  summary: GrowthSummary;
}

export interface GrowthSummary {
  totalRecords: number;
  milestonesAchieved: number;
  assessmentScore: number;
  growthRate: number;
  topCategories: Array<{ category: GrowthCategory; count: number }>;
  topDimensions: Array<{ dimension: DevelopmentDimensionId; score: number }>;
}

export interface GrowthInsight {
  id: UUID;
  childId: UUID;
  type: 'pattern' | 'trend' | 'milestone' | 'recommendation' | 'alert';
  title: string;
  description: string;
  data: Record<string, unknown>;
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  isActioned: boolean;
  createdAt: Timestamp;
}

export interface GrowthDashboard {
  childId: UUID;
  currentStage: AgeStageConfig | null;
  age: Age;
  stageProgress: {
    stageId: GrowthStageId;
    progress: number;
    daysInStage: number;
    daysUntilNextStage: number;
  };
  recordsStats: GrowthRecordStats;
  milestoneStats: MilestoneStats;
  assessmentStats: AssessmentStats;
  recentRecords: GrowthRecord[];
  upcomingMilestones: Milestone[];
  latestAssessment: Assessment | null;
  recommendations: Recommendation[];
  insights: GrowthInsight[];
  trends: {
    recordsTrend: Array<{ date: string; count: number }>;
    scoreTrend: Array<{ date: string; score: number }>;
    milestoneTrend: Array<{ date: string; count: number }>;
  };
}

export interface GrowthReport {
  id: UUID;
  childId: UUID;
  reportType: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  period: {
    startDate: Timestamp;
    endDate: Timestamp;
  };
  summary: GrowthSummary;
  highlights: string[];
  achievements: string[];
  recommendations: string[];
  charts: GrowthReportChart[];
  createdAt: Timestamp;
}

export interface GrowthReportChart {
  type: 'line' | 'bar' | 'pie' | 'radar';
  title: string;
  data: Record<string, unknown>;
}

export interface GrowthGoal {
  id: UUID;
  childId: UUID;
  title: string;
  description: string;
  dimensionId: DevelopmentDimensionId;
  targetDate: Timestamp;
  targetValue: number;
  currentValue: number;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  milestones: string[];
  notes: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface GrowthGoalCreateInput {
  childId: UUID;
  title: string;
  description: string;
  dimensionId: DevelopmentDimensionId;
  targetDate: Date;
  targetValue: number;
  milestones?: string[];
  notes?: string;
}

export interface GrowthGoalUpdateInput {
  currentValue?: number;
  status?: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  notes?: string;
}

export interface GrowthGoalStats {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  overdueGoals: number;
  averageProgress: number;
  byDimension: Record<
    DevelopmentDimensionId,
    { total: number; completed: number }
  >;
}

export interface GrowthComparison {
  childId: UUID;
  comparisonType: 'stage' | 'age' | 'dimension';
  comparisonData: {
    child: Record<string, number>;
    average: Record<string, number>;
    percentile: Record<string, number>;
  };
  insights: string[];
  recommendations: string[];
}
