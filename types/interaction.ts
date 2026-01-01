import type { UUID, Timestamp } from './common'

export type InteractionType =
  | 'play'
  | 'study'
  | 'outdoor'
  | 'reading'
  | 'art'
  | 'music'
  | 'sports'
  | 'conversation'
  | 'other'

export type InteractionMood = 'excellent' | 'good' | 'fair' | 'poor'

export type MoodType = InteractionMood

export const INTERACTION_TYPE_CONFIG: Record<InteractionType, { icon: string; label: string; color: string }> = {
  play: { icon: '🎮', label: '游戏', color: 'bg-pink-500' },
  study: { icon: '📚', label: '学习', color: 'bg-blue-500' },
  outdoor: { icon: '🌳', label: '户外', color: 'bg-green-500' },
  reading: { icon: '📖', label: '阅读', color: 'bg-purple-500' },
  art: { icon: '🎨', label: '艺术', color: 'bg-orange-500' },
  music: { icon: '🎵', label: '音乐', color: 'bg-indigo-500' },
  sports: { icon: '⚽', label: '运动', color: 'bg-red-500' },
  conversation: { icon: '💬', label: '对话', color: 'bg-cyan-500' },
  other: { icon: '📌', label: '其他', color: 'bg-gray-500' }
}

export const MOOD_CONFIG: Record<InteractionMood, { icon: string; label: string; color: string }> = {
  excellent: { icon: '😄', label: '优秀', color: 'text-green-500' },
  good: { icon: '😊', label: '良好', color: 'text-blue-500' },
  fair: { icon: '😐', label: '一般', color: 'text-yellow-500' },
  poor: { icon: '😔', label: '较差', color: 'text-red-500' }
}

export function getInteractionConfig(type: InteractionType) {
  return INTERACTION_TYPE_CONFIG[type] || INTERACTION_TYPE_CONFIG.other
}

export function getMoodConfig(mood: InteractionMood) {
  return MOOD_CONFIG[mood] || MOOD_CONFIG.fair
}

export function calculateQualityLevel(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (score >= 90) return 'excellent'
  if (score >= 75) return 'good'
  if (score >= 60) return 'fair'
  return 'poor'
}

export type InteractionSentiment = 'positive' | 'neutral' | 'negative'

export interface InteractionRecord {
  id: UUID
  childId: UUID
  parentId: UUID
  type: InteractionType
  title: string
  content: string
  mediaUrls: string[]
  duration: number
  participants: string[]
  location: string | null
  mood: InteractionMood
  aiAnalysis: InteractionAnalysis | null
  tags: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface InteractionAnalysis {
  keywords: string[]
  sentiment: InteractionSentiment
  themes: string[]
  qualityScore: number
  suggestions: string[]
  milestoneDetected: string | null
}

export interface InteractionStats {
  totalRecords: number
  totalDuration: number
  averageQuality: number
  typeDistribution: Record<InteractionType, number>
  thisWeekRecords: number
  thisMonthRecords: number
  moodDistribution: Record<InteractionMood, number>
}

export interface InteractionFilter {
  type?: InteractionType | InteractionType[]
  mood?: InteractionMood | InteractionMood[]
  startDate?: Date
  endDate?: Date
  childId?: UUID
  parentId?: UUID
  tags?: string[]
  minDuration?: number
  maxDuration?: number
}

export interface InteractionCreateInput {
  childId: UUID
  parentId: UUID
  type: InteractionType
  title: string
  content: string
  mediaUrls?: string[]
  duration: number
  participants: string[]
  location?: string
  mood: InteractionMood
  tags?: string[]
}

export interface InteractionUpdateInput {
  title?: string
  content?: string
  mediaUrls?: string[]
  duration?: number
  participants?: string[]
  location?: string
  mood?: InteractionMood
  tags?: string[]
}

export type AIRole = 'recorder' | 'guardian' | 'listener' | 'advisor' | 'cultural_mentor'

export interface AIRoleConfig {
  id: UUID
  name: string
  description: string
  personality: string
  capabilities: string[]
  promptTemplate: string
  isActive: boolean
  color: string
  icon: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface ConversationMessage {
  id: UUID
  sessionId: string
  childId: UUID
  userMessage: string
  aiResponse: string
  aiRole: AIRole
  aiRoleName: string
  emotion: string
  context: Record<string, unknown> | null
  createdAt: Timestamp
}

export interface ConversationSession {
  sessionId: string
  childId: UUID
  aiRole: AIRole
  lastMessageAt: Timestamp
  messageCount: number
  lastMessage: string
  createdAt: Timestamp
}

export interface ConversationStats {
  totalSessions: number
  totalMessages: number
  averageMessagesPerSession: number
  roleDistribution: Record<AIRole, number>
  thisWeekSessions: number
  thisMonthSessions: number
  mostActiveRole: AIRole | null
}

export interface ConversationFilter {
  childId?: UUID
  aiRole?: AIRole | AIRole[]
  startDate?: Date
  endDate?: Date
  emotion?: string | string[]
  minMessageCount?: number
}

export interface ConversationCreateInput {
  childId: UUID
  message: string
  aiRole: AIRole
  sessionId?: string
}

export interface ConversationHistoryInput {
  childId: UUID
  page?: number
  limit?: number
  sessionId?: string
}

export type EmotionType =
  | 'happy'
  | 'sad'
  | 'angry'
  | 'fear'
  | 'surprise'
  | 'disgust'
  | 'neutral'
  | 'excited'
  | 'calm'
  | 'anxious'

export interface EmotionAnalysis {
  primaryEmotion: EmotionType
  confidence: number
  emotionScores: Record<EmotionType, number>
  keywords: string[]
  suggestions: string[]
}

export interface EmotionTrend {
  date: Timestamp
  emotion: EmotionType
  intensity: number
  context: string | null
}

export interface EmotionStats {
  averageEmotion: EmotionType
  emotionDistribution: Record<EmotionType, number>
  averageIntensity: number
  trend: 'improving' | 'declining' | 'stable'
  significantChanges: EmotionTrend[]
}

export type CommentType = 'growth_record' | 'conversation' | 'recommendation' | 'milestone'

export interface Comment {
  id: UUID
  userId: UUID
  targetType: CommentType
  targetId: UUID
  content: string
  parentId: UUID | null
  isEdited: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface CommentWithUser extends Comment {
  user: {
    id: UUID
    name: string
    avatar: string | null
  }
}

export interface CommentCreateInput {
  userId: UUID
  targetType: CommentType
  targetId: UUID
  content: string
  parentId?: UUID
}

export interface CommentUpdateInput {
  content: string
}

export type FeedbackType = 'suggestion' | 'bug_report' | 'feature_request' | 'complaint' | 'compliment'

export interface Feedback {
  id: UUID
  userId: UUID
  type: FeedbackType
  category: string
  title: string
  content: string
  rating: number | null
  attachments: string[]
  status: 'pending' | 'reviewed' | 'resolved' | 'closed'
  adminResponse: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface FeedbackCreateInput {
  userId: UUID
  type: FeedbackType
  category: string
  title: string
  content: string
  rating?: number
  attachments?: string[]
}

export interface FeedbackStats {
  totalFeedback: number
  byType: Record<FeedbackType, number>
  byStatus: Record<string, number>
  averageRating: number
  responseRate: number
}

export type NotificationType = 'milestone' | 'reminder' | 'system' | 'ai_insight' | 'weekly_report' | 'comment' | 'feedback'

export interface Notification {
  id: UUID
  userId: UUID
  type: NotificationType
  title: string
  message: string
  data: Record<string, unknown> | null
  isRead: boolean
  readAt: Timestamp | null
  createdAt: Timestamp
}

export interface NotificationCreateInput {
  userId: UUID
  type: NotificationType
  title: string
  message: string
  data?: Record<string, unknown>
}

export interface NotificationStats {
  totalNotifications: number
  unreadCount: number
  byType: Record<NotificationType, number>
  thisWeekCount: number
}

export type RatingTargetType = 'growth_record' | 'conversation' | 'recommendation' | 'ai_response'

export interface Rating {
  id: UUID
  userId: UUID
  targetType: RatingTargetType
  targetId: UUID
  rating: number
  comment: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface RatingCreateInput {
  userId: UUID
  targetType: RatingTargetType
  targetId: UUID
  rating: number
  comment?: string
}

export interface RatingStats {
  averageRating: number
  totalRatings: number
  ratingDistribution: Record<number, number>
  byTargetType: Record<RatingTargetType, { average: number; count: number }>
}

export type ReactionType = 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry'

export interface Reaction {
  id: UUID
  userId: UUID
  targetType: CommentType | RatingTargetType
  targetId: UUID
  type: ReactionType
  createdAt: Timestamp
}

export interface ReactionStats {
  totalReactions: number
  byType: Record<ReactionType, number>
  uniqueUsers: number
}

export interface InteractionInsight {
  id: UUID
  childId: UUID
  type: 'pattern' | 'trend' | 'recommendation' | 'alert'
  title: string
  description: string
  data: Record<string, unknown>
  priority: 'low' | 'medium' | 'high'
  isRead: boolean
  isActioned: boolean
  createdAt: Timestamp
}

export interface InteractionDashboard {
  childId: UUID
  period: 'day' | 'week' | 'month' | 'year'
  stats: InteractionStats
  conversationStats: ConversationStats
  emotionStats: EmotionStats
  topInteractions: InteractionRecord[]
  recentConversations: ConversationMessage[]
  insights: InteractionInsight[]
  trends: {
    interactionTrend: Array<{ date: string; count: number }>
    moodTrend: Array<{ date: string; mood: InteractionMood }>
    emotionTrend: Array<{ date: string; emotion: EmotionType }>
  }
}

export interface InteractionSearchQuery {
  childId?: UUID
  keyword?: string
  type?: InteractionType | InteractionType[]
  mood?: InteractionMood | InteractionMood[]
  startDate?: Date
  endDate?: Date
  tags?: string[]
  minQualityScore?: number
  maxQualityScore?: number
  limit?: number
  offset?: number
  sortBy?: 'createdAt' | 'updatedAt' | 'duration' | 'qualityScore'
  sortOrder?: 'asc' | 'desc'
}

export interface InteractionSearchResult {
  interactions: InteractionRecord[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
