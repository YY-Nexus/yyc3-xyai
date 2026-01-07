/**
 * @file YYC³ AI助手状态管理
 * @description 专注0-3岁婴幼儿AI助手交互和情感状态管理，使用Redux Toolkit实现
 * @module lib/store/slices
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-28
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { InfantEmotionType as EmotionType } from '@/lib/ai/emotion-engine';

type ExtendedEmotionType = EmotionType | 'confusion' | 'excitement';

interface EmotionTransition {
  from: ExtendedEmotionType;
  to: ExtendedEmotionType;
  timestamp: Date;
  reason: string;
}

interface ConversationContext {
  childId?: string;
  childAge?: number;
  topic?: string;
  mood?: ExtendedEmotionType;
  previousTopics: string[];
}

interface AIResponseMetadata {
  confidence: number;
  processingTime: number;
  modelVersion: string;
  emotion: ExtendedEmotionType;
  suggestedActions: string[];
}

interface SessionMetrics {
  startTime: Date;
  endTime?: Date;
  messageCount: number;
  emotionChanges: EmotionTransition[];
  topicsDiscussed: string[];
  satisfactionScore?: number;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  emotion?: ExtendedEmotionType;
  attachments?: MessageAttachment[];
  metadata?: AIResponseMetadata;
  context?: ConversationContext;
  isRead?: boolean;
  reactions?: MessageReaction[];
  parentId?: string;
  threadId?: string;
}

export interface MessageAttachment {
  type: 'image' | 'audio' | 'video' | 'document';
  url: string;
  caption?: string;
  size?: number;
  mimeType?: string;
  thumbnail?: string;
}

export interface MessageReaction {
  emoji: string;
  userId?: string;
  timestamp: Date;
}

export interface AIAssistantState {
  // 基础状态
  isVisible: boolean;
  position: { x: number; y: number };
  isMinimized: boolean;
  isLocked: boolean;
  isActive: boolean;

  // 情感状态
  currentEmotion: ExtendedEmotionType;
  emotionIntensity: number;
  emotionHistory: EmotionTransition[];
  emotionTrend: 'improving' | 'declining' | 'stable';

  // 对话状态
  isTyping: boolean;
  currentMessage: string;
  messages: AIMessage[];
  conversationId: string;
  conversationContext: ConversationContext;

  // 交互状态
  lastInteraction: string;
  interactionCount: number;
  sessionDuration: number;
  sessionMetrics: SessionMetrics;

  // 响应状态
  isProcessing: boolean;
  pendingRequests: Map<string, Date>;

  // 个性化设置
  personality: 'gentle' | 'energetic' | 'educational' | 'playful';
  responseStyle: 'simple' | 'detailed' | 'interactive';
  emotionalResponsiveness: number;

  // 高级功能
  voiceEnabled: boolean;
  voiceLanguage: 'zh-CN' | 'en-US';
  autoResponseEnabled: boolean;
  proactiveSuggestionsEnabled: boolean;
}

const initialState: AIAssistantState = {
  // 基础状态
  isVisible: true,
  position: { x: 100, y: 100 },
  isMinimized: false,
  isLocked: false,
  isActive: false,

  // 情感状态
  currentEmotion: EmotionType.HAPPINESS,
  emotionIntensity: 0.7,
  emotionHistory: [],
  emotionTrend: 'stable',

  // 对话状态
  isTyping: false,
  currentMessage: '',
  messages: [],
  conversationId: '',
  conversationContext: { previousTopics: [] },

  // 交互状态
  lastInteraction: new Date().toISOString(),
  interactionCount: 0,
  sessionDuration: 0,
  sessionMetrics: {
    startTime: new Date(),
    messageCount: 0,
    emotionChanges: [],
    topicsDiscussed: [],
  },

  // 响应状态
  isProcessing: false,
  pendingRequests: new Map(),

  // 个性化设置
  personality: 'gentle',
  responseStyle: 'interactive',
  emotionalResponsiveness: 0.8,

  // 高级功能
  voiceEnabled: false,
  voiceLanguage: 'zh-CN',
  autoResponseEnabled: false,
  proactiveSuggestionsEnabled: true,
};

export const sendAIMessage = createAsyncThunk(
  'aiAssistant/sendMessage',
  async (payload: {
    message: string;
    childId?: string;
    context?: ConversationContext;
  }): Promise<AIMessage> => {
    await new Promise(resolve =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    const startTime = Date.now();
    const emotion = detectResponseEmotion(payload.message);
    const processingTime = Date.now() - startTime;

    const mockResponse: AIMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: generateAIResponse(payload.message),
      timestamp: new Date(),
      emotion,
      context: payload.context,
      metadata: {
        confidence: 0.85 + Math.random() * 0.1,
        processingTime,
        modelVersion: '1.0.0',
        emotion,
        suggestedActions: generateSuggestedActions(payload.message, emotion),
      },
    };

    return mockResponse;
  }
);

export const analyzeAndUpdateEmotion = createAsyncThunk(
  'aiAssistant/analyzeEmotion',
  async (payload: {
    text: string;
    childId: string;
    context?: ConversationContext;
  }) => {
    const analyzedEmotion = analyzeTextEmotion(payload.text);

    return {
      emotion: analyzedEmotion.emotion,
      intensity: analyzedEmotion.intensity,
      timestamp: new Date().toISOString(),
    };
  }
);

// AI助手Slice
const aiAssistantSlice = createSlice({
  name: 'aiAssistant',
  initialState,
  reducers: {
    // 显示控制
    showAIAssistant: state => {
      state.isVisible = true;
      state.isActive = true;
      state.lastInteraction = new Date().toISOString();
    },

    hideAIAssistant: state => {
      state.isVisible = false;
      state.isActive = false;
    },

    toggleAIAssistant: state => {
      state.isVisible = !state.isVisible;
      state.isActive = state.isVisible;
      state.lastInteraction = new Date().toISOString();
    },

    // 位置控制
    setAIAssistantPosition: (
      state,
      action: PayloadAction<{ x: number; y: number }>
    ) => {
      state.position = action.payload;
    },

    // 最小化控制
    minimizeAIAssistant: state => {
      state.isMinimized = true;
    },

    restoreAIAssistant: state => {
      state.isMinimized = false;
    },

    toggleMinimizeAIAssistant: state => {
      state.isMinimized = !state.isMinimized;
    },

    // 锁定控制
    lockAIAssistant: state => {
      state.isLocked = true;
    },

    unlockAIAssistant: state => {
      state.isLocked = false;
    },

    toggleLockAIAssistant: state => {
      state.isLocked = !state.isLocked;
    },

    // 情感状态
    setAIEmotion: (state, action: PayloadAction<ExtendedEmotionType>) => {
      state.currentEmotion = action.payload;
      state.lastInteraction = new Date().toISOString();
    },

    setAIEmotionIntensity: (state, action: PayloadAction<number>) => {
      state.emotionIntensity = Math.max(0, Math.min(1, action.payload));
    },

    updateEmotionalState: (
      state,
      action: PayloadAction<{ emotion: ExtendedEmotionType; intensity: number }>
    ) => {
      state.currentEmotion = action.payload.emotion;
      state.emotionIntensity = Math.max(
        0,
        Math.min(1, action.payload.intensity)
      );
      state.lastInteraction = new Date().toISOString();
    },

    // 对话管理
    addUserMessage: (
      state,
      action: PayloadAction<{
        content: string;
        attachments?: AIMessage['attachments'];
      }>
    ) => {
      const message: AIMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: action.payload.content,
        timestamp: new Date(),
        attachments: action.payload.attachments,
      };
      state.messages.push(message);
      state.interactionCount += 1;
      state.lastInteraction = new Date().toISOString();
    },

    addAIMessage: (state, action: PayloadAction<AIMessage>) => {
      state.messages.push(action.payload);
      state.lastInteraction = new Date().toISOString();
    },

    setAIMessages: (state, action: PayloadAction<AIMessage[]>) => {
      state.messages = action.payload;
    },

    clearMessages: state => {
      state.messages = [];
      state.conversationId = Date.now().toString();
    },

    deleteMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(msg => msg.id !== action.payload);
    },

    // 输入状态
    setCurrentMessage: (state, action: PayloadAction<string>) => {
      state.currentMessage = action.payload;
    },

    clearCurrentMessage: state => {
      state.currentMessage = '';
    },

    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },

    // 处理状态
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },

    addPendingRequest: (state, action: PayloadAction<string>) => {
      if (!state.pendingRequests.includes(action.payload)) {
        state.pendingRequests.push(action.payload);
      }
    },

    removePendingRequest: (state, action: PayloadAction<string>) => {
      state.pendingRequests = state.pendingRequests.filter(
        req => req !== action.payload
      );
    },

    clearPendingRequests: state => {
      state.pendingRequests = [];
    },

    // 会话管理
    startNewSession: state => {
      state.conversationId = Date.now().toString();
      state.sessionDuration = 0;
      state.interactionCount = 0;
      state.lastInteraction = new Date().toISOString();
    },

    setSessionDuration: (state, action: PayloadAction<number>) => {
      state.sessionDuration = action.payload;
    },

    incrementSessionDuration: (state, action: PayloadAction<number>) => {
      state.sessionDuration += action.payload;
    },

    // 个性化设置
    setPersonality: (
      state,
      action: PayloadAction<'gentle' | 'energetic' | 'educational' | 'playful'>
    ) => {
      state.personality = action.payload;
    },

    setResponseStyle: (
      state,
      action: PayloadAction<'simple' | 'detailed' | 'interactive'>
    ) => {
      state.responseStyle = action.payload;
    },

    setEmotionalResponsiveness: (state, action: PayloadAction<number>) => {
      state.emotionalResponsiveness = Math.max(0, Math.min(1, action.payload));
    },

    // 重置状态
    resetAIAssistant: state => {
      Object.assign(state, initialState);
    },

    // 快速情感响应
    expressHappiness: state => {
      state.currentEmotion = EmotionType.HAPPINESS;
      state.emotionIntensity = 0.9;
      state.lastInteraction = new Date().toISOString();
    },

    expressCuriosity: state => {
      state.currentEmotion = EmotionType.CURIOSITY;
      state.emotionIntensity = 0.8;
      state.lastInteraction = new Date().toISOString();
    },

    expressComfort: state => {
      state.currentEmotion = EmotionType.COMFORT;
      state.emotionIntensity = 0.8;
      state.lastInteraction = new Date().toISOString();
    },

    expressAttention: state => {
      state.currentEmotion = EmotionType.ATTENTION;
      state.emotionIntensity = 0.7;
      state.lastInteraction = new Date().toISOString();
    },
  },
  extraReducers: builder => {
    builder
      // 发送消息
      .addCase(sendAIMessage.pending, (state, action) => {
        state.isProcessing = true;
        state.addPendingRequest(action.meta.requestId);
      })
      .addCase(sendAIMessage.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.removePendingRequest(action.meta.requestId);
        state.addAIMessage(action.payload);
        state.currentEmotion = action.payload.emotion || EmotionType.HAPPINESS;
      })
      .addCase(sendAIMessage.rejected, (state, action) => {
        state.isProcessing = false;
        state.removePendingRequest(action.meta.requestId);
        // 添加错误消息
        state.addAIMessage({
          id: Date.now().toString(),
          role: 'assistant',
          content: '抱歉，我现在有点困惑，能再试一次吗？',
          timestamp: new Date(),
          emotion: EmotionTypeExtended.CONFUSION,
        });
      })

      // 情感分析
      .addCase(analyzeAndUpdateEmotion.fulfilled, (state, action) => {
        state.currentEmotion = action.payload.emotion;
        state.emotionIntensity = action.payload.intensity;
        state.lastInteraction = action.payload.timestamp;
      });
  },
});

function generateAIResponse(userMessage: string): string {
  const responses = [
    '这是一个很好的问题！让我们一起探索答案吧。',
    '我理解你的想法，让我来帮助你。',
    '哇，这个想法真有趣！我们继续聊聊吧。',
    '我在这里陪着你，一起面对这个问题。',
    '你真是个爱思考的好奇宝宝！',
  ];

  if (userMessage.includes('帮助') || userMessage.includes('帮')) {
    return '我很乐意帮助你！告诉我具体需要什么帮助。';
  }

  if (userMessage.includes('为什么')) {
    return '这是个很棒的"为什么"问题！让我来解释一下吧。';
  }

  if (userMessage.includes('学习') || userMessage.includes('教')) {
    return '学习新知识真 exciting！我来做你的学习伙伴。';
  }

  return responses[Math.floor(Math.random() * responses.length)];
}

function generateSuggestedActions(
  userMessage: string,
  emotion: ExtendedEmotionType
): string[] {
  const actions: Record<ExtendedEmotionType, string[]> = {
    [EmotionType.HAPPINESS]: ['记录这个快乐时刻', '分享给家人', '拍照留念'],
    [EmotionType.SADNESS]: ['给予安慰和拥抱', '播放舒缓音乐', '进行情感安抚'],
    [EmotionType.FEAR]: ['提供安全感', '解释情况', '陪伴在身边'],
    [EmotionType.ANGER]: ['冷静下来', '倾听感受', '寻找解决方案'],
    [EmotionType.SURPRISE]: ['探索新事物', '记录惊喜时刻', '分享发现'],
    [EmotionType.CURIOSITY]: ['提供更多知识', '引导探索', '回答问题'],
    [EmotionType.COMFORT]: ['保持舒适环境', '提供安抚物品', '温柔陪伴'],
    [EmotionType.HUNGER]: ['准备食物', '记录饮食时间', '观察进食情况'],
    [EmotionType.DISCOMFORT]: ['检查身体状态', '调整环境', '寻求医疗建议'],
    [EmotionType.ATTENTION]: ['给予关注', '互动游戏', '倾听需求'],
    [EmotionType.NEUTRAL]: ['继续对话', '观察状态', '主动引导'],
    confusion: ['简化表达', '提供更多上下文', '耐心解释'],
    excitement: ['一起庆祝', '记录精彩瞬间', '分享喜悦'],
  };

  return actions[emotion] || [];
}

function detectResponseEmotion(userMessage: string): ExtendedEmotionType {
  if (
    userMessage.includes('开心') ||
    userMessage.includes('高兴') ||
    userMessage.includes('棒')
  ) {
    return EmotionType.HAPPINESS;
  }

  if (userMessage.includes('为什么') || userMessage.includes('好奇')) {
    return EmotionType.CURIOSITY;
  }

  if (userMessage.includes('帮') || userMessage.includes('陪')) {
    return EmotionType.ATTENTION;
  }

  if (userMessage.includes('害怕') || userMessage.includes('担心')) {
    return EmotionType.COMFORT;
  }

  return EmotionType.HAPPINESS;
}

function analyzeTextEmotion(text: string): {
  emotion: ExtendedEmotionType;
  intensity: number;
} {
  const emotionKeywords: Record<ExtendedEmotionType, string[]> = {
    [EmotionType.HAPPINESS]: ['开心', '高兴', '快乐', '喜欢', '爱'],
    [EmotionType.SADNESS]: ['难过', '伤心', '哭', '不开心'],
    [EmotionType.ANGER]: ['生气', '讨厌', '烦', '气'],
    [EmotionType.FEAR]: ['害怕', '担心', '紧张'],
    [EmotionType.CURIOSITY]: ['好奇', '为什么', '想知道'],
    [EmotionType.ATTENTION]: ['注意', '看', '听'],
    [EmotionType.COMFORT]: ['舒服', '安心', '温暖'],
    confusion: ['困惑', '不懂', '迷茫'],
    excitement: ['兴奋', '激动', '太棒了'],
  };

  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return {
        emotion: emotion as ExtendedEmotionType,
        intensity: 0.7 + Math.random() * 0.3,
      };
    }
  }

  return {
    emotion: EmotionType.NEUTRAL,
    intensity: 0.5,
  };
}

// 导出Actions
export const {
  showAIAssistant,
  hideAIAssistant,
  toggleAIAssistant,
  setAIAssistantPosition,
  minimizeAIAssistant,
  restoreAIAssistant,
  toggleMinimizeAIAssistant,
  lockAIAssistant,
  unlockAIAssistant,
  toggleLockAIAssistant,
  setAIEmotion,
  setAIEmotionIntensity,
  updateEmotionalState,
  addUserMessage,
  addAIMessage,
  setAIMessages,
  clearMessages,
  deleteMessage,
  setCurrentMessage,
  clearCurrentMessage,
  setTyping,
  setProcessing,
  addPendingRequest,
  removePendingRequest,
  clearPendingRequests,
  startNewSession,
  setSessionDuration,
  incrementSessionDuration,
  setPersonality,
  setResponseStyle,
  setEmotionalResponsiveness,
  resetAIAssistant,
  expressHappiness,
  expressCuriosity,
  expressComfort,
  expressAttention,
} = aiAssistantSlice.actions;

// 为了向后兼容，添加setAIMessage别名
export const setAIMessage = addAIMessage;

// 导出Reducer
export default aiAssistantSlice.reducer;

// 选择器
export const selectAIAssistantState = (state: {
  aiAssistant: AIAssistantState;
}) => state.aiAssistant;
export const selectAIAssistantVisible = (state: {
  aiAssistant: AIAssistantState;
}) => state.aiAssistant.isVisible;
export const selectAIAssistantEmotion = (state: {
  aiAssistant: AIAssistantState;
}) => state.aiAssistant.currentEmotion;
export const selectAIAssistantMessages = (state: {
  aiAssistant: AIAssistantState;
}) => state.aiAssistant.messages;
export const selectAIAssistantProcessing = (state: {
  aiAssistant: AIAssistantState;
}) => state.aiAssistant.isProcessing;
export const selectAIAssistantTyping = (state: {
  aiAssistant: AIAssistantState;
}) => state.aiAssistant.isTyping;
export const selectAIAssistantPosition = (state: {
  aiAssistant: AIAssistantState;
}) => state.aiAssistant.position;
export const selectAIAssistantMinimized = (state: {
  aiAssistant: AIAssistantState;
}) => state.aiAssistant.isMinimized;
