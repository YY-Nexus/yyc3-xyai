/**
 * 情感类型适配器
 * 统一不同模块的情感类型定义
 */

import type { EmotionType as InteractionEmotion } from '@/types/interaction';
import { InfantEmotionType } from './emotion-engine';

/**
 * 将交互情感类型转换为婴幼儿情感类型
 */
export function toInfantEmotion(
  interactionEmotion: InteractionEmotion
): InfantEmotionType {
  const mapping: Record<InteractionEmotion, InfantEmotionType> = {
    happy: InfantEmotionType.HAPPINESS,
    sad: InfantEmotionType.SADNESS,
    angry: InfantEmotionType.ANGER,
    fear: InfantEmotionType.FEAR,
    surprise: InfantEmotionType.SURPRISE,
    disgust: InfantEmotionType.DISCOMFORT,
    neutral: InfantEmotionType.NEUTRAL,
    excited: InfantEmotionType.COMFORT,
    calm: InfantEmotionType.COMFORT,
    anxious: InfantEmotionType.DISCOMFORT,
  };

  return mapping[interactionEmotion] || InfantEmotionType.NEUTRAL;
}

/**
 * 将婴幼儿情感类型转换为交互情感类型
 */
export function toInteractionEmotion(
  infantEmotion: InfantEmotionType
): InteractionEmotion {
  // 反向映射
  if (infantEmotion === InfantEmotionType.HAPPINESS) return 'happy';
  if (infantEmotion === InfantEmotionType.SADNESS) return 'sad';
  if (infantEmotion === InfantEmotionType.ANGER) return 'angry';
  if (infantEmotion === InfantEmotionType.FEAR) return 'fear';
  if (infantEmotion === InfantEmotionType.SURPRISE) return 'surprise';
  if (infantEmotion === InfantEmotionType.NEUTRAL) return 'neutral';

  // 特殊情感映射到通用情感
  if (infantEmotion === InfantEmotionType.COMFORT) return 'calm';
  if (infantEmotion === InfantEmotionType.DISCOMFORT) return 'anxious';

  return 'neutral';
}

/**
 * 获取情感的中文名称
 */
export function getEmotionLabel(
  emotion: InfantEmotionType | InteractionEmotion
): string {
  const labels: Record<string, string> = {
    [InfantEmotionType.HAPPINESS]: '快乐',
    [InfantEmotionType.SADNESS]: '悲伤',
    [InfantEmotionType.FEAR]: '恐惧',
    [InfantEmotionType.ANGER]: '愤怒',
    [InfantEmotionType.SURPRISE]: '惊讶',
    [InfantEmotionType.DISGUST]: '厌恶',
    [InfantEmotionType.CURIOSITY]: '好奇',
    [InfantEmotionType.COMFORT]: '舒适',
    [InfantEmotionType.HUNGER]: '饥饿',
    [InfantEmotionType.DISCOMFORT]: '不适',
    [InfantEmotionType.PAIN]: '疼痛',
    [InfantEmotionType.ATTENTION]: '需要关注',
    [InfantEmotionType.NEUTRAL]: '中性',
    happy: '开心',
    sad: '难过',
    angry: '生气',
    fear: '害怕',
    surprise: '惊讶',
    disgust: '厌恶',
    neutral: '平静',
    excited: '兴奋',
    calm: '平静',
    anxious: '焦虑',
  };

  return labels[emotion] || '未知';
}
