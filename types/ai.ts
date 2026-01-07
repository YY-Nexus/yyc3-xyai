import type { UUID, Timestamp } from './common';

export type AIRole =
  | 'companion'
  | 'recorder'
  | 'guardian'
  | 'listener'
  | 'advisor';

export type VoiceStyle =
  | 'cheerful'
  | 'calm'
  | 'gentle'
  | 'professional'
  | 'warm'
  | 'authoritative';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type QueryComplexity = 'simple' | 'medium' | 'complex';

export type RelevanceLevel = 'high' | 'medium' | 'low';

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface RoleConfig {
  id: AIRole;
  name: string;
  icon: string;
  description: string;
  systemPrompt: string;
  color: string;
  voiceStyle: VoiceStyle;
  specialties: string[];
  triggerKeywords: string[];
}

export interface KnowledgeDocument {
  id: string;
  content: string;
  metadata: KnowledgeMetadata;
}

export interface KnowledgeMetadata {
  title: string;
  category: string;
  tags: string[];
  age_group: string[];
  difficulty_level: DifficultyLevel;
  source: string;
  author?: string;
  created_at: string;
  updated_at: string;
  language: string;
  word_count: number;
}

export interface RetrievalResult {
  id: string;
  content: string;
  metadata: KnowledgeMetadata;
  score: number;
  relevance: RelevanceLevel;
  highlights: string[];
}

export interface SearchQuery {
  text: string;
  filters?: SearchFilters;
  top_k?: number;
  similarity_threshold?: number;
}

export interface SearchFilters {
  category?: string;
  age_group?: string[];
  difficulty_level?: DifficultyLevel;
  tags?: string[];
}

export interface RAGContext {
  query: string;
  retrieved_knowledge: RetrievalResult[];
  conversation_history: ChatMessage[];
  user_context?: UserContext;
}

export interface UserContext {
  child_age?: number;
  interests?: string[];
  learning_level?: string;
  recent_topics?: string[];
}

export interface RAGResponse {
  answer: string;
  sources: RetrievalResult[];
  confidence: number;
  reasoning: string;
  related_questions: string[];
  follow_up_suggestions: string[];
}

export interface EmbeddingResult {
  id: string;
  embedding: number[];
  dimension: number;
}

export interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp?: number;
}

export interface ChatOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
}

export interface ChatResponse {
  message: ChatMessage;
  usage: TokenUsage;
  model: string;
  created_at: string;
  done: boolean;
  thinking_time?: number;
}

export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface ModelInfo {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details: ModelDetails;
}

export interface ModelDetails {
  parent_model: string;
  format: string;
  family: string;
  families: string[];
  parameter_size: string;
  quantization_level: string;
}

export interface AIHealthStatus {
  status: HealthStatus;
  models_loaded: string[];
  gpu_available: boolean;
  memory_usage: MemoryUsage;
  response_time: ResponseTimeMetrics;
}

export interface MemoryUsage {
  used: number;
  total: number;
  percentage: number;
}

export interface ResponseTimeMetrics {
  avg: number;
  p95: number;
  p99: number;
}

export interface PerformanceMetrics {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  avg_response_time: number;
  requests_per_minute: number;
  gpu_utilization: number;
  memory_usage: number;
  model_load_time: number;
}

export interface CoordinatedResponse {
  mainRole: AIRole;
  mainResponse: string;
  supportingInsights?: SupportingInsight[];
  suggestedActions?: string[];
  involvedRoles?: RoleInfo[];
}

export interface SupportingInsight {
  role: AIRole;
  roleName: string;
  roleIcon: string;
  insight: string;
}

export interface RoleInfo {
  id: AIRole;
  name: string;
  icon: string;
}

export interface QueryAnalysis {
  complexity: QueryComplexity;
  involvedRoles: AIRole[];
}

export interface ChildContext {
  name: string;
  ageText: string;
  stage: string;
  traits?: string[];
}

export interface KnowledgeStats {
  total_documents: number;
  categories: Record<string, number>;
  age_groups: Record<string, number>;
  difficulty_levels: Record<DifficultyLevel, number>;
}

export interface AIRequest {
  id: UUID;
  sessionId: string;
  userId: UUID;
  childId: UUID;
  role: AIRole;
  userMessage: string;
  aiResponse: string;
  complexity: QueryComplexity;
  involvedRoles: AIRole[];
  tokenUsage: TokenUsage;
  responseTime: number;
  confidence: number;
  sources: RetrievalResult[];
  createdAt: Timestamp;
}

export interface AISession {
  id: string;
  userId: UUID;
  childId: UUID;
  role: AIRole;
  messages: ChatMessage[];
  context: UserContext;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AIModelConfig {
  name: string;
  type: 'local' | 'cloud';
  endpoint: string;
  apiKey?: string;
  maxTokens: number;
  temperature: number;
  topP: number;
}

export interface RAGEngineConfig {
  chromaURL: string;
  collectionName: string;
  embeddingModel: string;
  maxContextLength: number;
  topK: number;
  similarityThreshold: number;
}

export interface AISystemConfig {
  rag: RAGEngineConfig;
  ollama: OllamaConfig;
  openai?: OpenAIConfig;
  roles: Record<AIRole, RoleConfig>;
}

export interface OllamaConfig {
  baseUrl: string;
  defaultModel: string;
  timeout: number;
}

export interface OpenAIConfig {
  apiKey: string;
  baseURL?: string;
  model: string;
}

export interface AIError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Timestamp;
}

export interface AIAnalytics {
  totalSessions: number;
  totalRequests: number;
  avgResponseTime: number;
  avgConfidence: number;
  roleUsage: Record<AIRole, number>;
  complexityDistribution: Record<QueryComplexity, number>;
  errorRate: number;
  knowledgeUsage: {
    totalRetrievals: number;
    avgRelevanceScore: number;
    topCategories: Array<{ category: string; count: number }>;
  };
}

export interface AIInsight {
  id: UUID;
  sessionId: string;
  type: 'emotion' | 'behavior' | 'development' | 'safety';
  content: string;
  confidence: number;
  relatedRole: AIRole;
  actionable: boolean;
  actionSuggestion?: string;
  createdAt: Timestamp;
}

export interface AIFeedback {
  id: UUID;
  requestId: UUID;
  userId: UUID;
  rating: number;
  helpful: boolean;
  comment?: string;
  category?: string;
  createdAt: Timestamp;
}

export interface AIRecommendation {
  id: UUID;
  childId: UUID;
  type: 'activity' | 'reading' | 'game' | 'learning' | 'routine';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  basedOn: string[];
  estimatedDuration?: number;
  materials?: string[];
  createdAt: Timestamp;
  expiresAt?: Timestamp;
  completedAt?: Timestamp;
}

export interface AIPromptTemplate {
  id: UUID;
  name: string;
  role: AIRole;
  template: string;
  variables: string[];
  description: string;
  version: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AIConversationTurn {
  id: UUID;
  sessionId: string;
  turnNumber: number;
  userMessage: string;
  aiResponse: string;
  role: AIRole;
  complexity: QueryComplexity;
  tokenUsage: TokenUsage;
  responseTime: number;
  confidence: number;
  sources: RetrievalResult[];
  createdAt: Timestamp;
}

export interface AIConversationSummary {
  sessionId: string;
  userId: UUID;
  childId: UUID;
  totalTurns: number;
  duration: number;
  avgResponseTime: number;
  totalTokens: number;
  primaryRole: AIRole;
  topics: string[];
  insights: AIInsight[];
  createdAt: Timestamp;
}

export interface AITrainingData {
  id: UUID;
  type: 'conversation' | 'feedback' | 'correction';
  content: string;
  metadata: Record<string, unknown>;
  quality: number;
  used: boolean;
  createdAt: Timestamp;
}

export interface AIModelMetrics {
  modelName: string;
  version: string;
  accuracy: number;
  latency: number;
  throughput: number;
  errorRate: number;
  lastTrained: Timestamp;
  lastEvaluated: Timestamp;
}

export interface AIAuditLog {
  id: UUID;
  action: string;
  userId: UUID;
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Timestamp;
}
