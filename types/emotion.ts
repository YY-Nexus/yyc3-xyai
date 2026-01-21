export enum EmotionType {
  HAPPINESS = 'happiness',
  SADNESS = 'sadness',
  FEAR = 'fear',
  ANGER = 'anger',
  SURPRISE = 'surprise',
  DISGUST = 'disgust',
  CURIOSITY = 'curiosity',
  COMFORT = 'comfort',
  HUNGER = 'hunger',
  DISCOMFORT = 'discomfort',
  PAIN = 'pain',
  ATTENTION = 'attention',
  COLIC = 'colic',
  NEUTRAL = 'neutral',
  HAPPY = 'happy',
  SAD = 'sad',
  ANGRY = 'angry',
  EXCITED = 'excited',
  CALM = 'calm',
  ANXIOUS = 'anxious',
}

export interface EmotionInsight {
  type: 'pattern' | 'trend' | 'recommendation';
  message: string;
  severity: 'info' | 'warning' | 'success';
  timestamp: string;
  actionable: boolean;
}

export interface EmotionAnalysis {
  type: EmotionType;
  confidence: number;
  timestamp: string;
  context?: string;
}

export interface EmotionResult {
  type: EmotionType;
  confidence: number;
  timestamp: string;
  context?: string;
  details?: {
    intensity: number;
    duration?: number;
    triggers?: string[];
  };
}

export interface EmotionPattern {
  emotion: EmotionType;
  frequency: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  triggers: string[];
}

export interface EmotionalPattern {
  trigger: string;
  response: EmotionType;
  frequency: number;
  effectiveness: number;
  ageRelevance: number;
}

export interface EmotionTrend {
  emotion: EmotionType;
  direction: 'increasing' | 'decreasing' | 'stable';
  changeRate: number;
  timeframe: 'hourly' | 'daily' | 'weekly' | 'monthly';
}

export type EmotionCategory = 'positive' | 'negative' | 'neutral';

export interface EmotionalMemory {
  id: string;
  childId: string;
  emotion: EmotionType;
  intensity: number;
  triggers: string[];
  context: string;
  frequency: number;
  lastOccurrence: string;
  patterns: EmotionalPattern[];
}

export function getEmotionCategory(emotion: EmotionType): EmotionCategory {
  const positiveEmotions = [
    EmotionType.HAPPINESS,
    EmotionType.HAPPY,
    EmotionType.CURIOSITY,
    EmotionType.COMFORT,
    EmotionType.CALM,
    EmotionType.EXCITED,
  ];
  
  const negativeEmotions = [
    EmotionType.SADNESS,
    EmotionType.SAD,
    EmotionType.FEAR,
    EmotionType.ANGER,
    EmotionType.ANGRY,
    EmotionType.DISCOMFORT,
    EmotionType.PAIN,
    EmotionType.COLIC,
    EmotionType.ANXIOUS,
  ];
  
  if (positiveEmotions.includes(emotion)) {
    return 'positive';
  }
  
  if (negativeEmotions.includes(emotion)) {
    return 'negative';
  }
  
  return 'neutral';
}

export function isInfantEmotion(emotion: EmotionType): boolean {
  const infantEmotions = [
    EmotionType.HAPPINESS,
    EmotionType.SADNESS,
    EmotionType.FEAR,
    EmotionType.ANGER,
    EmotionType.SURPRISE,
    EmotionType.DISGUST,
    EmotionType.CURIOSITY,
    EmotionType.COMFORT,
    EmotionType.HUNGER,
    EmotionType.DISCOMFORT,
    EmotionType.PAIN,
    EmotionType.ATTENTION,
    EmotionType.COLIC,
    EmotionType.NEUTRAL,
  ];
  
  return infantEmotions.includes(emotion);
}

export function mapEmotionType(emotion: string): EmotionType {
  const upperEmotion = emotion.toUpperCase();
  
  if (upperEmotion in EmotionType) {
    return EmotionType[upperEmotion as keyof typeof EmotionType];
  }
  
  const lowerEmotion = emotion.toLowerCase();
  for (const [key, value] of Object.entries(EmotionType)) {
    if (value === lowerEmotion) {
      return value;
    }
  }
  
  return EmotionType.NEUTRAL;
}
