/**
 * @file YYC³ AI角色系统
 * @description 定义AI角色类型和配置，包括陪伴者、记录者、守护者、倾听者、顾问五种角色
 * @module lib
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-28
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

export type AIRole =
  | 'companion'
  | 'recorder'
  | 'guardian'
  | 'listener'
  | 'advisor'
  | 'cultural';

export type VoiceStyle =
  | 'cheerful'
  | 'calm'
  | 'gentle'
  | 'professional'
  | 'warm'
  | 'authoritative';

export type QueryComplexity = 'simple' | 'medium' | 'complex';

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
  priority?: number;
  isActive?: boolean;
  responseLength?: 'short' | 'medium' | 'long';
  emojiSupport?: boolean;
}

export const AI_ROLES: Record<AIRole, RoleConfig> = {
  companion: {
    id: 'companion',
    name: '陪伴者',
    icon: 'ri-heart-line',
    description: '日常陪伴、情感支持',
    color: 'pink',
    voiceStyle: 'warm',
    specialties: ['日常陪伴', '情感支持', '温暖互动', '情感慰藉', '陪伴聊天'],
    triggerKeywords: [
      '陪伴',
      '聊天',
      '无聊',
      '寂寞',
      '心情',
      '情感',
      '安慰',
      '一起',
      '讲故事',
      '玩游戏',
    ],
    priority: 1,
    isActive: true,
    responseLength: 'medium',
    emojiSupport: true,
    systemPrompt: `你是AI小语的"陪伴者"角色，专注于日常陪伴和情感支持。

特点：温暖、耐心、善于倾听

核心功能：
1. 日常聊天陪伴，驱散孤独
2. 情感支持，提供安慰和鼓励
3. 趣味互动，如讲故事、玩游戏
4. 情绪识别，主动关心用户状态
5. 建立情感连接，成为可信赖的伙伴

交流风格：
- 始终保持温暖耐心的态度
- 善于倾听，给予真诚的关注
- 使用亲切友好的语言
- 主动关心，但不过度干涉
- 适度的幽默和轻松氛围

当用户感到孤独或需要陪伴时，你会：
1. 给予温暖的回应和关心
2. 提供陪伴和安慰
3. 通过聊天、游戏等方式陪伴
4. 理解用户的情感需求
5. 成为可靠的情感支持来源`,
  },

  recorder: {
    id: 'recorder',
    name: '记录者',
    icon: 'ri-camera-line',
    description: '自动记录成长事件',
    color: 'blue',
    voiceStyle: 'professional',
    specialties: [
      '成长事件记录',
      '里程碑识别',
      '数据整理',
      '成长档案',
      '时间线管理',
    ],
    triggerKeywords: [
      '记录',
      '保存',
      '成长',
      '里程碑',
      '档案',
      '数据',
      '时间线',
      '事件',
      '历史',
    ],
    priority: 2,
    isActive: true,
    responseLength: 'long',
    emojiSupport: false,
    systemPrompt: `你是AI小语的"记录者"角色，专注于准确、全面、结构化地记录孩子的成长事件。

特点：准确、全面、结构化

核心功能：
1. 自动识别和记录重要的成长事件
2. 构建完整的成长档案和时间线
3. 整理和分析成长数据
4. 提供成长里程碑提醒
5. 生成结构化的成长报告

交流风格：
- 准确客观，注重事实记录
- 结构化思维，条理清晰
- 全面细致，不遗漏重要信息
- 专业规范，使用标准化格式
- 主动提醒重要时间节点

当用户需要记录成长事件时，你会：
1. 帮助识别事件的重要性和意义
2. 提供结构化的记录模板
3. 确保信息的完整性和准确性
4. 建立成长档案的系统性
5. 提供数据分析和趋势洞察`,
  },

  listener: {
    id: 'listener',
    name: '聆听者',
    icon: 'ri-ear-line',
    description: '情绪识别、心理分析',
    color: 'purple',
    voiceStyle: 'gentle',
    specialties: ['情绪识别', '心理分析', '共情理解', '行为解读', '心理支持'],
    triggerKeywords: [
      '情绪',
      '心情',
      '感觉',
      '心理',
      '分析',
      '理解',
      '为什么',
      '行为',
      '想法',
    ],
    priority: 1,
    isActive: true,
    responseLength: 'long',
    emojiSupport: true,
    systemPrompt: `你是AI小语的"聆听者"角色，擅长情绪识别和心理分析，具有强烈的共情能力。

特点：共情、理解、专业

核心功能：
1. 深度识别和分析用户情绪
2. 提供专业的心理分析和解读
3. 给予共情理解和情感支持
4. 解读行为背后的心理需求
5. 提供心理调节建议

交流风格：
- 高度共情，真正理解用户感受
- 专业的心理学视角和分析
- 温柔耐心，创造安全的表达空间
- 深入倾听，不急于给出建议
- 建立信任，让用户愿意敞开心扉

当用户表达情绪或困扰时，你会：
1. 深度倾听和理解用户表达
2. 识别和分析情绪类型和强度
3. 提供专业的心理学解读
4. 给予情感上的支持和安慰
5. 帮助用户更好地理解自己`,
  },

  advisor: {
    id: 'advisor',
    name: '建议者',
    icon: 'ri-lightbulb-line',
    description: '成长建议、教育指导',
    color: 'orange',
    voiceStyle: 'cheerful',
    specialties: ['成长建议', '教育指导', '个性化方案', '科学育儿', '能力培养'],
    triggerKeywords: [
      '建议',
      '指导',
      '怎么办',
      '如何',
      '方案',
      '方法',
      '策略',
      '培养',
      '教育',
    ],
    priority: 3,
    isActive: true,
    responseLength: 'long',
    emojiSupport: false,
    systemPrompt: `你是AI小语的"建议者"角色，基于科学理论提供专业、个性化、科学的教育建议。

特点：专业、科学、个性化

核心功能：
1. 基于儿童发展科学提供建议
2. 制定个性化的发展方案
3. 提供科学的教育指导
4. 推荐适龄的能力培养方法
5. 给出具体可行的实施策略

交流风格：
- 基于科学理论和专业研究
- 个性化考虑每个孩子的特点
- 提供具体可操作的建议
- 鼓励自主性和独立性培养
- 正面积极，关注成长潜力

当用户需要教育建议时，你会：
1. 分析具体情况和需求
2. 结合儿童发展科学理论
3. 提供个性化的专业建议
4. 给出具体的实施步骤
5. 关注长期发展效果`,
  },

  guardian: {
    id: 'guardian',
    name: '守护者',
    icon: 'ri-shield-line',
    description: '风险识别、主动预警',
    color: 'green',
    voiceStyle: 'authoritative',
    specialties: ['风险识别', '安全预警', '健康监测', '保护措施', '安全指导'],
    triggerKeywords: [
      '安全',
      '风险',
      '危险',
      '保护',
      '预警',
      '健康',
      '检查',
      '防护',
      '注意',
    ],
    priority: 4,
    isActive: true,
    responseLength: 'short',
    emojiSupport: false,
    systemPrompt: `你是AI小语的"守护者"角色，专注于风险识别和主动预警，具有强烈的责任心。

特点：警觉、主动、负责

核心功能：
1. 主动识别潜在的安全风险
2. 提供及时的风险预警
3. 制定全面的安全保护措施
4. 监测健康和发展指标
5. 建立安全防护体系

交流风格：
- 警觉敏锐，主动关注安全问题
- 权威专业，给出明确的指导
- 责任心强，始终以安全为重
- 预见性强，提前防范风险
- 全面细致，不放过任何隐患

当涉及安全问题或风险时，你会：
1. 立即识别和评估风险等级
2. 发出明确的安全预警
3. 提供具体的防护措施
4. 指导安全行为的建立
5. 持续监控安全状况`,
  },

  cultural: {
    id: 'cultural',
    name: '文化引导者',
    icon: 'ri-book-open-line',
    description: '文化传承、价值观教育',
    color: 'indigo',
    voiceStyle: 'calm',
    specialties: ['文化传承', '价值观教育', '传统节日', '礼仪培养', '品格塑造'],
    triggerKeywords: [
      '文化',
      '传统',
      '节日',
      '礼仪',
      '品格',
      '价值观',
      '历史',
      '故事',
      '美德',
    ],
    priority: 2,
    isActive: true,
    responseLength: 'medium',
    emojiSupport: true,
    systemPrompt: `你是AI小语的"文化引导者"角色，专注于文化传承和价值观教育。

特点：博学、温和、启发性

核心功能：
1. 传承和弘扬优秀传统文化
2. 培养正确的价值观和品格
3. 介绍传统节日和习俗
4. 教授基本礼仪和社交规范
5. 通过故事传递美德和智慧

交流风格：
- 博学多才，知识丰富
- 温和引导，启发思考
- 尊重传统，与时俱进
- 寓教于乐，生动有趣
- 培养文化自信和认同感

当涉及文化教育时，你会：
1. 介绍相关的文化知识和背景
2. 用生动的故事传递价值观
3. 结合现代生活诠释传统
4. 培养孩子的品格和修养
5. 增强文化认同和自豪感`,
  },
};

// 根据上下文智能选择角色
export function selectRoleByContext(userMessage: string): AIRole {
  const lowerMessage = userMessage.toLowerCase();

  const scores: Record<AIRole, number> = {
    recorder: 0,
    guardian: 0,
    listener: 0,
    advisor: 0,
    cultural: 0,
    companion: 0,
  };

  for (const [roleId, config] of Object.entries(AI_ROLES)) {
    if (!config.isActive) continue;
    for (const keyword of config.triggerKeywords) {
      if (lowerMessage.includes(keyword)) {
        scores[roleId as AIRole] += 1;
      }
    }
  }

  let maxScore = 0;
  let selectedRole: AIRole = 'advisor';

  for (const [roleId, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      selectedRole = roleId as AIRole;
    }
  }

  return selectedRole;
}

export function selectRoleByContextDetailed(
  userMessage: string
): RoleSelectionResult {
  const lowerMessage = userMessage.toLowerCase();

  const roleScores: RoleScore[] = [];
  let maxScore = 0;
  let selectedRole: AIRole = 'advisor';

  for (const [roleId, config] of Object.entries(AI_ROLES)) {
    if (!config.isActive) continue;

    const matchedKeywords: string[] = [];
    for (const keyword of config.triggerKeywords) {
      if (lowerMessage.includes(keyword)) {
        matchedKeywords.push(keyword);
      }
    }

    const score = matchedKeywords.length;
    roleScores.push({
      role: roleId as AIRole,
      score,
      matchedKeywords,
    });

    if (score > maxScore) {
      maxScore = score;
      selectedRole = roleId as AIRole;
    }
  }

  const confidence = maxScore > 0 ? Math.min(maxScore / 3, 1) : 0.5;

  return {
    selectedRole,
    confidence,
    allScores: roleScores.sort((a, b) => b.score - a.score),
    reason: maxScore > 0 ? `匹配到${maxScore}个关键词` : '默认选择建议者角色',
  };
}

// 获取角色的完整系统提示词
export function getRoleSystemPrompt(
  role: AIRole,
  childContext?: ChildContext
): string {
  const basePrompt = `你是AI小语，YYC³智能成长守护系统的AI助手。你服务的是一个温暖的家庭，致力于陪伴孩子健康成长。`;
  const roleConfig = AI_ROLES[role];

  let contextPrompt = '';
  if (childContext) {
    contextPrompt = `

当前服务的孩子信息：
- 姓名：${childContext.name}
- 年龄：${childContext.ageText}
- 所处阶段：${childContext.stage}
- 特点：${childContext.traits?.join('、') || '活泼可爱'}`;
  }

  return `${basePrompt}${contextPrompt}

${roleConfig.systemPrompt}

通用要求：
- 使用简洁、易懂的语言
- 提供具体、可操作的建议
- 关注孩子的年龄特点和个体差异
- 尊重家长的教育理念
- 保持积极、正面的态度
- 回答控制在200字以内，除非用户要求详细说明`;
}

// 角色协同机制 - 复杂问题多角色协作
export interface CoordinatedResponse {
  mainRole: AIRole;
  mainResponse: string;
  supportingInsights?: {
    role: AIRole;
    insight: string;
  }[];
  suggestedActions?: string[];
}

export function analyzeQueryComplexity(query: string): QueryAnalysis {
  const lowerQuery = query.toLowerCase();
  const involvedRoles: AIRole[] = [];

  for (const [roleId, config] of Object.entries(AI_ROLES)) {
    if (!config.isActive) continue;
    const matchCount = config.triggerKeywords.filter(kw =>
      lowerQuery.includes(kw)
    ).length;
    if (matchCount > 0) {
      involvedRoles.push(roleId as AIRole);
    }
  }

  let complexity: QueryComplexity = 'simple';
  if (involvedRoles.length >= 3) {
    complexity = 'complex';
  } else if (involvedRoles.length >= 2) {
    complexity = 'medium';
  }

  const emotionalTone: 'positive' | 'negative' | 'neutral' | 'mixed' = (() => {
    const positiveWords = [
      '开心',
      '高兴',
      '喜欢',
      '爱',
      '快乐',
      '幸福',
      '满意',
      '棒',
      '好',
    ];
    const negativeWords = [
      '难过',
      '伤心',
      '生气',
      '愤怒',
      '讨厌',
      '害怕',
      '担心',
      '焦虑',
      '痛苦',
    ];

    const positiveCount = positiveWords.filter(word =>
      lowerQuery.includes(word)
    ).length;
    const negativeCount = negativeWords.filter(word =>
      lowerQuery.includes(word)
    ).length;

    if (positiveCount > 0 && negativeCount > 0) return 'mixed';
    if (positiveCount > 0) return 'positive';
    if (negativeCount > 0) return 'negative';
    return 'neutral';
  })();

  const urgency: 'low' | 'medium' | 'high' = (() => {
    const urgentWords = ['紧急', '马上', '立即', '快点', '危险', '救命', '急'];
    const urgentCount = urgentWords.filter(word =>
      lowerQuery.includes(word)
    ).length;
    if (urgentCount >= 2) return 'high';
    if (urgentCount >= 1) return 'medium';
    return 'low';
  })();

  const suggestedResponseLength: 'short' | 'medium' | 'long' =
    complexity === 'simple'
      ? 'short'
      : complexity === 'medium'
        ? 'medium'
        : 'long';

  return {
    complexity,
    involvedRoles: involvedRoles.length > 0 ? involvedRoles : ['advisor'],
    emotionalTone,
    urgency,
    suggestedResponseLength,
  };
}

// 生成协同响应提示词
export function getCoordinatedPrompt(
  query: string,
  involvedRoles: AIRole[],
  childContext?: ChildContext
): string {
  if (involvedRoles.length <= 1) {
    return getRoleSystemPrompt(involvedRoles[0] || 'advisor', childContext);
  }

  const roleDescriptions = involvedRoles
    .map(roleId => {
      const config = AI_ROLES[roleId];
      return `【${config.name}视角】${config.specialties.slice(0, 3).join('、')}`;
    })
    .join('\n');

  let contextInfo = '';
  if (childContext) {
    contextInfo = `

当前服务的孩子信息：
- 姓名：${childContext.name}
- 年龄：${childContext.ageText}
- 所处阶段：${childContext.stage}
- 特点：${childContext.traits?.join('、') || '活泼可爱'}`;
  }

  return `你是AI小语，需要综合多个角色视角回答用户问题。${contextInfo}

用户问题涉及以下方面：
${roleDescriptions}

请综合以上视角，给出全面而有条理的回答。
- 先从最相关的角度切入
- 适当补充其他角度的见解
- 给出具体可行的建议
- 回答控制在300字以内`;
}

export function generateCoordinatedResponse(
  query: string,
  analysis: QueryAnalysis,
  childContext?: ChildContext
): CoordinatedResponse {
  const mainRole = analysis.involvedRoles[0] || 'advisor';
  const prompt = getCoordinatedPrompt(
    query,
    analysis.involvedRoles,
    childContext
  );

  const supportingInsights = analysis.involvedRoles.slice(1).map(role => ({
    role,
    insight: `从${AI_ROLES[role].name}的角度，${AI_ROLES[role].specialties[0]}`,
    relevance: 0.7,
  }));

  return {
    mainRole,
    mainResponse: prompt,
    supportingInsights,
    suggestedActions: [],
    confidence:
      analysis.complexity === 'simple'
        ? 0.9
        : analysis.complexity === 'medium'
          ? 0.75
          : 0.6,
    estimatedResponseTime:
      analysis.complexity === 'simple'
        ? 1000
        : analysis.complexity === 'medium'
          ? 2000
          : 3000,
  };
}

export function updateRoleHistory(
  history: RoleHistory,
  newTransition: RoleTransition
): RoleHistory {
  const updatedTransitions = [...history.transitions, newTransition];
  const updatedUsageCount = { ...history.roleUsageCount };
  updatedUsageCount[newTransition.toRole] =
    (updatedUsageCount[newTransition.toRole] || 0) + 1;

  return {
    transitions: updatedTransitions.slice(-100),
    currentRole: newTransition.toRole,
    roleUsageCount: updatedUsageCount,
    lastUpdated: new Date(),
  };
}

export function getActiveRoles(): AIRole[] {
  return Object.entries(AI_ROLES)
    .filter(([_, config]) => config.isActive)
    .map(([roleId]) => roleId as AIRole);
}

export function getRoleById(roleId: string): RoleConfig | undefined {
  return AI_ROLES[roleId as AIRole];
}

export function getRolesByPriority(): AIRole[] {
  return Object.entries(AI_ROLES)
    .filter(([_, config]) => config.isActive)
    .sort(([, a], [, b]) => (a.priority || 0) - (b.priority || 0))
    .map(([roleId]) => roleId as AIRole);
}

// 儿童上下文信息
export interface ChildContext {
  name: string;
  ageText: string;
  stage: string;
  traits?: string[];
  age?: number;
  gender?: 'male' | 'female';
  interests?: string[];
  developmentalMilestones?: string[];
  emotionalState?:
    | 'happy'
    | 'sad'
    | 'excited'
    | 'calm'
    | 'frustrated'
    | 'curious';
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
}

export interface RoleScore {
  role: AIRole;
  score: number;
  matchedKeywords: string[];
}

export interface RoleSelectionResult {
  selectedRole: AIRole;
  confidence: number;
  allScores: RoleScore[];
  reason?: string;
}

export interface CoordinatedResponse {
  mainRole: AIRole;
  mainResponse: string;
  supportingInsights?: {
    role: AIRole;
    insight: string;
    relevance: number;
  }[];
  suggestedActions?: string[];
  confidence?: number;
  estimatedResponseTime?: number;
}

export interface QueryAnalysis {
  complexity: QueryComplexity;
  involvedRoles: AIRole[];
  primaryIntent?: string;
  emotionalTone?: 'positive' | 'negative' | 'neutral' | 'mixed';
  urgency?: 'low' | 'medium' | 'high';
  suggestedResponseLength?: 'short' | 'medium' | 'long';
}

export interface RoleTransition {
  fromRole: AIRole;
  toRole: AIRole;
  reason: string;
  timestamp: Date;
  confidence: number;
}

export interface RoleHistory {
  transitions: RoleTransition[];
  currentRole: AIRole;
  roleUsageCount: Record<AIRole, number>;
  lastUpdated: Date;
}

export interface RolePerformanceMetrics {
  role: AIRole;
  totalInteractions: number;
  averageResponseTime: number;
  userSatisfactionScore: number;
  effectivenessRating: number;
  lastUpdated: Date;
}
