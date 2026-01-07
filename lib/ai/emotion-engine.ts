/**
 * YYC³ AI小语智能成长守护系统 - 情感智能引擎
 * 专注0-3岁婴幼儿情感识别与分析
 */

import * as tf from '@tensorflow/tfjs';
import { UniversalSentenceEncoder } from '@tensorflow-models/universal-sentence-encoder';

// 情感类型定义
export enum InfantEmotionType {
  HAPPINESS = 'happiness', // 快乐
  SADNESS = 'sadness', // 悲伤
  FEAR = 'fear', // 恐惧
  ANGER = 'anger', // 愤怒
  SURPRISE = 'surprise', // 惊讶
  DISGUST = 'disgust', // 厌恶
  CURIOSITY = 'curiosity', // 好奇
  COMFORT = 'comfort', // 舒适
  HUNGER = 'hunger', // 饥饿
  DISCOMFORT = 'discomfort', // 不适
  PAIN = 'pain', // 疼痛
  ATTENTION = 'attention', // 需要关注
  NEUTRAL = 'neutral', // 中性
}

// 年龄段定义
export enum AgeGroup {
  INFANT = 'infant', // 0-1岁
  TODDLER = 'toddler', // 1-2岁
  PRESCHOOLER = 'preschooler', // 2-3岁
}

// 情感分析结果
export interface EmotionResult {
  primary: InfantEmotionType;
  secondary?: InfantEmotionType;
  confidence: number; // 0-1
  intensity: number; // 0-1
  ageGroup: AgeGroup;
  timestamp: Date;
  context?: string;
}

// 文本情感分析结果
export interface TextEmotionResult {
  emotion: InfantEmotionType;
  confidence: number;
  keywords: string[];
  sentiment: number; // -1 到 1
  ageAppropriate: boolean;
}

// 语音情感分析结果
export interface VoiceEmotionResult {
  emotion: InfantEmotionType;
  confidence: number;
  cryType?: CryType;
  toneQuality: ToneQuality;
  volume: number;
  clarity: number;
  ageAppropriate: boolean;
}

// 哭声类型
export enum CryType {
  HUNGER = 'hunger',
  DISCOMFORT = 'discomfort',
  ATTENTION = 'attention',
  PAIN = 'pain',
  SLEEPY = 'sleepy',
  COLIC = 'colic',
}

// 音调质量
export interface ToneQuality {
  pitch: number;
  tempo: number;
  rhythm: string;
  intensity: number;
}

// 多模态输入数据
export interface MultiModalInput {
  text?: string;
  audio?: ArrayBuffer;
  video?: ArrayBuffer;
  context?: {
    age: number;
    timeOfDay: string;
    recentActivities: string[];
    environment: string;
  };
}

// 情感记忆数据
export interface EmotionalMemory {
  id: string;
  childId: string;
  emotion: InfantEmotionType;
  intensity: number;
  triggers: string[];
  context: string;
  frequency: number;
  lastOccurrence: Date;
  patterns: EmotionalPattern[];
}

// 情感模式
export interface EmotionalPattern {
  trigger: string;
  response: InfantEmotionType;
  frequency: number;
  effectiveness: number;
  ageRelevance: number;
}

// 年龄段情感特征
export interface AgeGroupCharacteristics {
  primaryEmotions: InfantEmotionType[];
  communication: 'cry-based' | 'word-based' | 'sentence-based' | 'mixed';
  complexity: 'low' | 'medium' | 'high';
  contextDependency: 'low' | 'medium' | 'high';
}

// 多模态情感分析结果
export interface MultiModalEmotionResult {
  type: 'text' | 'audio' | 'video';
  emotion: InfantEmotionType;
  confidence: number;
  sentiment?: number;
  keywords?: string[];
  cryType?: CryType;
  toneQuality?: ToneQuality;
  volume?: number;
  clarity?: number;
  ageAppropriate?: boolean;
}

// 音频特征
export interface AudioFeatures {
  volume: number;
  clarity: number;
  pitch: number;
  tempo: number;
  [key: string]: unknown;
}

// 加权情感结果
export interface WeightedEmotion {
  emotion: InfantEmotionType;
  weight: number;
  intensity: number;
  secondary?: InfantEmotionType;
}

// 主要情感结果
export interface PrimaryEmotionResult {
  emotion: InfantEmotionType;
  intensity: number;
  secondary?: InfantEmotionType;
}

// 嵌入向量
export interface EmbeddingVector {
  arraySync(): number[];
  shape: number[];
  [key: string]: unknown;
}

// 音频缓冲区
export interface DecodedAudioBuffer {
  duration: number;
  sampleRate: number;
  numberOfChannels: number;
  length: number;
  getChannelData(channel: number): Float32Array;
  [key: string]: unknown;
}

/**
 * 情感智能引擎主类
 */
export class EmotionalIntelligenceEngine {
  private useModel: UniversalSentenceEncoder | null = null;
  private isInitialized = false;
  private memoryStore: Map<string, EmotionalMemory[]> = new Map();

  // 0-3岁特化情感词典
  private readonly infantEmotionLexicon = new Map([
    // 快乐表达
    ['开心', InfantEmotionType.HAPPINESS],
    ['高兴', InfantEmotionType.HAPPINESS],
    ['哈哈', InfantEmotionType.HAPPINESS],
    ['笑', InfantEmotionType.HAPPINESS],

    // 不适表达
    ['不舒服', InfantEmotionType.DISCOMFORT],
    ['难受', InfantEmotionType.DISCOMFORT],
    ['疼', InfantEmotionType.PAIN],
    ['痛', InfantEmotionType.PAIN],

    // 需求表达
    ['要', InfantEmotionType.ATTENTION],
    ['抱', InfantEmotionType.ATTENTION],
    ['妈妈', InfantEmotionType.ATTENTION],
    ['爸爸', InfantEmotionType.ATTENTION],

    // 好奇表达
    ['这是什么', InfantEmotionType.CURIOSITY],
    ['为什么', InfantEmotionType.CURIOSITY],
    ['看看', InfantEmotionType.CURIOSITY],
    ['摸摸', InfantEmotionType.CURIOSITY],
  ]);

  // 年龄段情感特征
  private readonly ageEmotionCharacteristics = new Map([
    [
      AgeGroup.INFANT,
      {
        primaryEmotions: [
          InfantEmotionType.COMFORT,
          InfantEmotionType.DISCOMFORT,
          InfantEmotionType.HUNGER,
        ],
        communication: 'cry-based',
        complexity: 'low',
        contextDependency: 'high',
      },
    ],
    [
      AgeGroup.TODDLER,
      {
        primaryEmotions: [
          InfantEmotionType.HAPPINESS,
          InfantEmotionType.FEAR,
          InfantEmotionType.ANGER,
          InfantEmotionType.CURIOSITY,
        ],
        communication: 'word-based',
        complexity: 'medium',
        contextDependency: 'medium',
      },
    ],
    [
      AgeGroup.PRESCHOOLER,
      {
        primaryEmotions: [
          InfantEmotionType.HAPPINESS,
          InfantEmotionType.SADNESS,
          InfantEmotionType.ANGER,
          InfantEmotionType.SURPRISE,
        ],
        communication: 'sentence-based',
        complexity: 'high',
        contextDependency: 'low',
      },
    ],
  ]);

  /**
   * 初始化情感智能引擎
   */
  async initialize(): Promise<void> {
    try {
      // 加载Universal Sentence Encoder模型
      // @ts-ignore - UniversalSentenceEncoder.load() 类型定义缺失
      this.useModel = await UniversalSentenceEncoder.load();
      this.isInitialized = true;
      console.log('情感智能引擎初始化完成');
    } catch (error) {
      console.error('情感智能引擎初始化失败:', error);
      throw new Error('情感智能引擎初始化失败');
    }
  }

  /**
   * 多模态情感分析
   */
  async analyzeEmotion(input: MultiModalInput): Promise<EmotionResult> {
    if (!this.isInitialized) {
      throw new Error('情感智能引擎未初始化');
    }

    const ageGroup = this.getAgeGroup(input.context?.age || 24);
    const results: MultiModalEmotionResult[] = [];

    // 文本情感分析
    if (input.text) {
      const textResult = await this.analyzeTextEmotion(input.text, ageGroup);
      results.push({ type: 'text', ...textResult });
    }

    // 语音情感分析
    if (input.audio) {
      const audioResult = await this.analyzeVoiceEmotion(input.audio, ageGroup);
      results.push({ type: 'audio', ...audioResult });
    }

    // 融合多模态结果
    return this.fuseEmotionResults(results, ageGroup, input.context);
  }

  /**
   * 文本情感分析（0-3岁特化）
   */
  private async analyzeTextEmotion(
    text: string,
    ageGroup: AgeGroup
  ): Promise<TextEmotionResult> {
    // 基础情感分析
    const emotion = this.detectEmotionFromKeywords(text);

    // 使用深度学习模型进行细粒度分析
    if (this.useModel) {
      try {
        const embeddings = await this.useModel.embed([text]);
        // 这里可以添加更复杂的情感分类模型
        // @ts-ignore - TensorFlow Tensor2D 类型兼容性问题
        await this.classifyEmotionFromEmbedding(embeddings);
      } catch (error) {
        console.warn('模型预测失败，使用规则基础分析:', error);
      }
    }

    // 计算置信度
    const confidence = this.calculateTextEmotionConfidence(
      text,
      emotion,
      ageGroup
    );

    // 提取关键词
    const keywords = this.extractEmotionalKeywords(text);

    // 计算情感倾向
    const sentiment = this.calculateSentiment(text);

    return {
      emotion: emotion,
      confidence: confidence,
      keywords: keywords,
      sentiment: sentiment,
      ageAppropriate: this.isAgeAppropriateText(text, ageGroup),
    };
  }

  /**
   * 语音情感分析（0-3岁特化）
   */
  private async analyzeVoiceEmotion(
    audio: ArrayBuffer,
    ageGroup: AgeGroup
  ): Promise<VoiceEmotionResult> {
    // TODO: 实现音频处理和情感识别
    // 这里需要集成Web Audio API和音频特征提取

    // 基础音频分析
    const audioBuffer = await this.decodeAudio(audio);
    if (!audioBuffer) {
      throw new Error('Failed to decode audio');
    }
    const features = await this.extractAudioFeatures(audioBuffer);

    // 婴幼儿哭声分析
    const cryType = this.analyzeCryPattern(features, ageGroup);

    // 情感识别
    const emotion = this.detectEmotionFromAudio(features, cryType);

    // 音调质量分析
    const toneQuality = this.analyzeToneQuality(features);

    return {
      emotion: emotion,
      confidence: 0.8, // 临时值
      cryType: cryType,
      toneQuality: toneQuality,
      volume: features.volume,
      clarity: features.clarity,
      ageAppropriate: true,
    };
  }

  /**
   * 融合多模态情感结果
   */
  private fuseEmotionResults(
    results: MultiModalEmotionResult[],
    ageGroup: AgeGroup,
    context?: MultiModalInput['context']
  ): EmotionResult {
    if (results.length === 0) {
      return {
        primary: InfantInfantEmotionType.COMFORT,
        confidence: 0.5,
        intensity: 0.5,
        ageGroup: ageGroup,
        timestamp: new Date(),
      };
    }

    if (results.length === 1) {
      return {
        primary: results[0].emotion,
        confidence: results[0].confidence,
        intensity: results[0].confidence,
        ageGroup: ageGroup,
        timestamp: new Date(),
        context: context ? JSON.stringify(context) : undefined,
      };
    }

    // 多模态融合算法
    const weightedEmotions = this.calculateWeightedEmotions(results, ageGroup);
    const primaryEmotion = this.getPrimaryEmotion(weightedEmotions);
    const confidence = this.calculateFusionConfidence(weightedEmotions);

    return {
      primary: primaryEmotion.emotion,
      secondary: primaryEmotion.secondary,
      confidence: confidence,
      intensity: primaryEmotion.intensity,
      ageGroup: ageGroup,
      timestamp: new Date(),
      context: context ? JSON.stringify(context) : undefined,
    };
  }

  /**
   * 存储情感记忆
   */
  async storeEmotionalMemory(
    childId: string,
    emotionResult: EmotionResult
  ): Promise<void> {
    const existingMemories = this.memoryStore.get(childId) || [];

    const memory: EmotionalMemory = {
      id: this.generateId(),
      childId: childId,
      emotion: emotionResult.primary,
      intensity: emotionResult.intensity,
      triggers: this.extractTriggers(emotionResult.context),
      context: emotionResult.context || '',
      frequency: 1,
      lastOccurrence: emotionResult.timestamp,
      patterns: [],
    };

    // 更新现有模式或创建新模式
    this.updateEmotionalPatterns(memory, existingMemories);

    existingMemories.push(memory);
    this.memoryStore.set(childId, existingMemories);
  }

  /**
   * 获取情感记忆
   */
  getEmotionalMemories(
    childId: string,
    emotionType?: InfantEmotionType
  ): EmotionalMemory[] {
    const memories = this.memoryStore.get(childId) || [];

    if (emotionType) {
      return memories.filter(memory => memory.emotion === emotionType);
    }

    return memories;
  }

  /**
   * 获取年龄段
   */
  private getAgeGroup(ageInMonths: number): AgeGroup {
    if (ageInMonths <= 12) return AgeGroup.INFANT;
    if (ageInMonths <= 24) return AgeGroup.TODDLER;
    return AgeGroup.PRESCHOOLER;
  }

  /**
   * 从关键词检测情感
   */
  private detectEmotionFromKeywords(text: string): InfantEmotionType {
    const lowerText = text.toLowerCase();

    for (const [keyword, emotion] of Array.from(
      this.infantEmotionLexicon.entries()
    )) {
      if (lowerText.includes(keyword)) {
        return emotion;
      }
    }

    return InfantEmotionType.HAPPINESS; // 默认情感
  }

  /**
   * 计算文本情感置信度
   */
  private calculateTextEmotionConfidence(
    text: string,
    emotion: InfantEmotionType,
    ageGroup: AgeGroup
  ): number {
    let confidence = 0.5;

    // 关键词匹配度
    const keywordMatches = this.countKeywordMatches(text);
    confidence += Math.min(keywordMatches * 0.1, 0.3);

    // 年龄适配度
    const ageChars = this.getAgeGroupCharacteristics(ageGroup);
    if (ageChars.primaryEmotions.includes(emotion)) {
      confidence += 0.2;
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * 获取年龄段特征
   */
  private getAgeGroupCharacteristics(
    ageGroup: AgeGroup
  ): AgeGroupCharacteristics {
    const fallback: AgeGroupCharacteristics = {
      primaryEmotions: [InfantEmotionType.HAPPINESS],
      communication: 'mixed',
      complexity: 'medium',
      contextDependency: 'medium',
    };
    // @ts-ignore - TypeScript 无法正确推断字面量类型，但运行时类型正确
    return this.ageEmotionCharacteristics.get(ageGroup) ?? fallback;
  }

  // 辅助方法
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private extractEmotionalKeywords(text: string): string[] {
    // 简单的关键词提取
    return text.split(/\s+/).filter(word => word.length > 0);
  }

  private calculateSentiment(text: string): number {
    // 简单的情感倾向计算
    const positiveWords = ['开心', '高兴', '笑', '喜欢'];
    const negativeWords = ['哭', '痛', '害怕', '生气'];

    let score = 0;
    positiveWords.forEach(word => {
      if (text.includes(word)) score += 1;
    });
    negativeWords.forEach(word => {
      if (text.includes(word)) score -= 1;
    });

    return Math.max(-1, Math.min(1, score / 5));
  }

  private isAgeAppropriateText(text: string, ageGroup: AgeGroup): boolean {
    // 年龄适配性检查
    const textLength = text.length;
    const characteristics = this.getAgeGroupCharacteristics(ageGroup);

    switch (characteristics.complexity) {
      case 'low':
        return textLength <= 20;
      case 'medium':
        return textLength <= 50;
      case 'high':
        return textLength <= 100;
      default:
        return true;
    }
  }

  private countKeywordMatches(text: string): number {
    let matches = 0;
    const lowerText = text.toLowerCase();

    for (const [keyword] of Array.from(this.infantEmotionLexicon.entries())) {
      if (lowerText.includes(keyword)) {
        matches++;
      }
    }

    return matches;
  }

  private extractTriggers(context?: string): string[] {
    if (!context) return [];
    try {
      const parsed = JSON.parse(context);
      return [parsed.timeOfDay, parsed.environment].filter(Boolean);
    } catch {
      return [];
    }
  }

  private updateEmotionalPatterns(
    memory: EmotionalMemory,
    existingMemories: EmotionalMemory[]
  ): void {
    // 更新情感模式的逻辑
    existingMemories.forEach(existing => {
      if (existing.emotion === memory.emotion) {
        existing.frequency += 1;
        existing.lastOccurrence = memory.lastOccurrence;
      }
    });
  }

  // TODO: 实现以下方法
  private async classifyEmotionFromEmbedding(
    _embeddings: tf.Tensor2D
  ): Promise<EmotionType | null> {
    // 深度学习情感分类
    return null;
  }

  private async decodeAudio(
    _audio: ArrayBuffer
  ): Promise<DecodedAudioBuffer | null> {
    // 音频解码
    return null;
  }

  private async extractAudioFeatures(
    _audioBuffer: DecodedAudioBuffer
  ): Promise<AudioFeatures> {
    // 音频特征提取
    return {
      volume: 0.5,
      clarity: 0.8,
      pitch: 440,
      tempo: 120,
    };
  }

  private analyzeCryPattern(
    _features: AudioFeatures,
    _ageGroup: AgeGroup
  ): CryType | undefined {
    // 哭声模式分析
    return CryType.ATTENTION;
  }

  private detectEmotionFromAudio(
    _features: AudioFeatures,
    _cryType?: CryType
  ): InfantEmotionType {
    // 从音频特征检测情感
    return InfantEmotionType.ATTENTION;
  }

  private analyzeToneQuality(features: AudioFeatures): ToneQuality {
    // 音调质量分析
    return {
      pitch: features.pitch || 440,
      tempo: features.tempo || 120,
      rhythm: 'regular',
      intensity: 0.7,
    };
  }

  private calculateWeightedEmotions(
    _results: MultiModalEmotionResult[],
    _ageGroup: AgeGroup
  ): WeightedEmotion[] {
    // 加权情感计算
    return _results.map(result => ({
      emotion: result.emotion,
      weight: result.confidence,
      intensity: result.confidence,
    }));
  }

  private getPrimaryEmotion(
    _weightedEmotions: WeightedEmotion[]
  ): PrimaryEmotionResult {
    // 获取主要情感
    return {
      emotion: InfantInfantEmotionType.HAPPINESS,
      intensity: 0.8,
    };
  }

  private calculateFusionConfidence(
    _weightedEmotions: WeightedEmotion[]
  ): number {
    // 计算融合置信度
    return 0.8;
  }
}

// 导出单例实例
export const emotionEngine = new EmotionalIntelligenceEngine();
