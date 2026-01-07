/**
 * @file 知识引擎类型定义
 * @description 定义知识引擎相关的类型接口
 * @module types/knowledge
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

/**
 * 知识节点
 */
export interface KnowledgeNode {
  id: string;
  type: 'concept' | 'activity' | 'ability' | 'skill' | 'topic';
  name: string;
  description?: string;
  properties: {
    id: string;
    [key: string]: any;
  };
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 活动节点
 */
export interface ActivityNode {
  id: string;
  type: 'activity';
  name: string;
  description?: string;
  properties: {
    id: string;
    difficulty_level?: number;
    age_range?: [number, number];
    duration?: number;
    category?: string;
    [key: string]: any;
  };
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 推荐结果
 */
export interface RecommendationResult {
  item_id: string;
  item_type: 'knowledge' | 'activity' | 'ability';
  item_name: string;
  item_description?: string;
  recommendation_score: number;
  confidence: number;
  metadata: {
    difficulty_level?: number;
    category?: string;
    age_range?: [number, number];
    algorithm: string;
    mixed_algorithms?: string[];
    [key: string]: any;
  };
  timestamp: Date;
}

/**
 * 推荐上下文
 */
export interface RecommendationContext {
  userId?: string;
  childId?: string;
  sessionId?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  currentMood?: 'happy' | 'sad' | 'excited' | 'calm' | 'frustrated';
  learningGoals?: string[];
  completedActivities?: string[];
  preferences?: Record<string, any>;
}

/**
 * 推荐请求
 */
export interface RecommendationRequest {
  context: RecommendationContext;
  count?: number;
  type?: 'knowledge' | 'activity' | 'ability' | 'all';
  filters?: {
    minDifficulty?: number;
    maxDifficulty?: number;
    ageRange?: [number, number];
    categories?: string[];
  };
}

/**
 * 推荐配置
 */
export interface RecommendationConfig {
  maxTypeCount: number;
  weight: {
    collaborative: number;
    contentBased: number;
    semantic: number;
    timeBased: number;
  };
  filters: {
    maxDifficulty: number;
    minDifficulty: number;
    nightDifficultyThreshold: number;
  };
}

/**
 * Neo4j 服务接口
 */
export interface Neo4jService {
  /**
   * 执行查询
   */
  query<T = any>(query: string, params?: Record<string, any>): Promise<T[]>;
  
  /**
   * 获取子节点
   */
  getChildById(childId: string): Promise<KnowledgeNode | null>;
  
  /**
   * 获取相关节点
   */
  getRelatedNodes(nodeId: string, relationshipType?: string): Promise<KnowledgeNode[]>;
  
  /**
   * 创建节点
   */
  createNode(node: Partial<KnowledgeNode>): Promise<KnowledgeNode>;
  
  /**
   * 更新节点
   */
  updateNode(nodeId: string, updates: Partial<KnowledgeNode>): Promise<KnowledgeNode>;
  
  /**
   * 删除节点
   */
  deleteNode(nodeId: string): Promise<boolean>;
  
  /**
   * 创建关系
   */
  createRelationship(
    sourceId: string,
    targetId: string,
    relationshipType: string,
    properties?: Record<string, any>
  ): Promise<boolean>;
}

/**
 * 知识图谱统计
 */
export interface KnowledgeGraphStats {
  totalNodes: number;
  totalRelationships: number;
  nodeTypes: Record<string, number>;
  relationshipTypes: Record<string, number>;
  lastUpdated: Date;
}
