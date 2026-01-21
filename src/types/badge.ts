export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  series: BadgeSeries;
  level: BadgeLevel;
  category: BadgeCategory;
  rarity: BadgeRarity;
  unlockConditions: UnlockCondition[];
  earnedDate?: string;
  progress?: number;
  isHidden?: boolean;
  hiddenDescription?: string;
  unlockAnimation?: string;
  soundEffect?: string;
  shareContent?: ShareContent;
  metadata: BadgeMetadata;
  nextBadge?: string;
  prerequisiteBadge?: string;
  seriesProgress?: SeriesProgress;
}

export type BadgeSeries =
  | 'growth'
  | 'creative'
  | 'hidden'
  | 'dynasty'
  | 'celebrities'
  | 'technology'
  | 'dream'
  | 'culture'
  | 'learning'
  | 'social';

export type BadgeLevel =
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'diamond'
  | 'legend';

export type BadgeCategory =
  | 'learning'
  | 'culture'
  | 'social'
  | 'creative'
  | 'physical'
  | 'cognitive'
  | 'emotional';

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythical';

export interface UnlockCondition {
  type: ConditionType;
  value: number;
  description: string;
  progress?: number;
  current?: number;
  target?: number;
}

export type ConditionType =
  | 'total_hours'
  | 'consecutive_days'
  | 'completed_courses'
  | 'cultural_sites_visited'
  | 'interactions'
  | 'creations'
  | 'score'
  | 'perfect_score'
  | 'streak'
  | 'custom';

export interface ShareContent {
  title: string;
  description: string;
  image: string;
  hashtags: string[];
}

export interface BadgeMetadata {
  points: number;
  version: string;
  createdAt: string;
  updatedAt: string;
  unlockCount?: number;
  specialEffect?: boolean;
  animatedIcon?: string;
  glowColor?: string;
  sparkleEffect?: boolean;
  tags?: string[];
}

export interface SeriesProgress {
  seriesId: string;
  totalBadges: number;
  earnedBadges: number;
  currentLevel: BadgeLevel;
  nextLevel?: BadgeLevel;
  progressPercentage: number;
  completionReward?: BadgeReward;
  milestones: SeriesMilestone[];
}

export interface SeriesMilestone {
  level: BadgeLevel;
  requiredBadges: number;
  reward: BadgeReward;
  unlocked: boolean;
}

export interface BadgeReward {
  type: 'points' | 'badge' | 'title' | 'avatar' | 'privilege';
  value: any;
  description: string;
}

export interface BadgeGroup {
  id: string;
  name: string;
  description: string;
  icon: string;
  badgeCount: number;
  earnedCount: number;
  progress: number;
  badges: string[];
  completionBadge?: string;
  category: BadgeCategory;
  isLocked?: boolean;
  unlockRequirement?: string;
}

export interface BadgeStats {
  total: number;
  earned: number;
  bySeries: Record<BadgeSeries, number>;
  byCategory: Record<BadgeCategory, number>;
  byRarity: Record<BadgeRarity, number>;
  byLevel: Record<BadgeLevel, number>;
  totalPoints: number;
  ranking?: number;
  recentBadges: Badge[];
}

export interface BadgeFilter {
  series?: BadgeSeries;
  category?: BadgeCategory;
  rarity?: BadgeRarity;
  level?: BadgeLevel;
  status?: 'all' | 'earned' | 'unearned';
  search?: string;
  tags?: string[];
  minPoints?: number;
  maxPoints?: number;
  earnedDateStart?: Date;
  earnedDateEnd?: Date;
}

export interface BadgeUnlockEvent {
  badgeId: string;
  userId: string;
  timestamp: number;
  conditionsMet: UnlockCondition[];
}

export interface BadgeUserProgress {
  userId: string;
  earnedBadges: string[];
  badgeProgress: Record<string, number>;
  totalPoints: number;
  lastUpdated: string;
}
