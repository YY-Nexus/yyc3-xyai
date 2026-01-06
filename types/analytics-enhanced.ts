/**
 * 分析类型增强定义
 */

export interface BusinessInsights {
  keyFindings: KeyFinding[];
  predictions: Prediction[];
  recommendations: Recommendation[];
  confidence: number;
  generatedAt: Date;
}

export interface KeyFinding {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'stable';
  metrics: Record<string, number>;
}

export interface Prediction {
  id: string;
  type: string;
  timeframe: string;
  confidence: number;
  predictedValue: number;
  currentValue: number;
  change: number;
  rationale: string;
}

export interface Recommendation {
  id: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  expectedImpact: string;
  effort: 'low' | 'medium' | 'high';
  category: string;
}
