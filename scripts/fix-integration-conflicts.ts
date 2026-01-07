#!/usr/bin/env bun
/**
 * YYC³-XY-05 整合冲突快速修复脚本
 * 自动修复类型冲突、导入路径等问题
 */

import { readFileSync, writeFileSync, existsSync, renameSync } from 'fs';
import { join } from 'path';

const PROJECT_ROOT = process.cwd();

interface FixResult {
  file: string;
  action: string;
  status: 'success' | 'failed' | 'skipped';
  message: string;
}

const results: FixResult[] = [];

// 修复 1: 解决 EmotionType 类型冲突
function fixEmotionTypeConflict(): FixResult {
  const filePath = join(PROJECT_ROOT, 'lib/ai/emotion-engine.ts');

  try {
    if (!existsSync(filePath)) {
      return {
        file: filePath,
        action: '重命名 EmotionType',
        status: 'skipped',
        message: '文件不存在',
      };
    }

    let content = readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // 重命名 enum
    content = content.replace(
      /export enum EmotionType /g,
      'export enum InfantEmotionType '
    );
    content = content.replace(/: EmotionType/g, ': InfantEmotionType');
    content = content.replace(/< EmotionType>/g, '< InfantEmotionType>');
    content = content.replace(/EmotionType\./g, 'InfantEmotionType.');

    if (content !== originalContent) {
      writeFileSync(filePath, content, 'utf-8');
      return {
        file: filePath,
        action: '重命名 EmotionType → InfantEmotionType',
        status: 'success',
        message: '已重命名类型定义',
      };
    }

    return {
      file: filePath,
      action: '重命名 EmotionType',
      status: 'skipped',
      message: '未找到需要替换的内容',
    };
  } catch (error) {
    return {
      file: filePath,
      action: '重命名 EmotionType',
      status: 'failed',
      message: `错误: ${error}`,
    };
  }
}

// 修复 2: 更新 IntelligentInsightsPanel 导入
function fixIntelligentInsightsPanelImports(): FixResult {
  const filePath = join(
    PROJECT_ROOT,
    'components/analytics/IntelligentInsightsPanel.tsx'
  );

  try {
    if (!existsSync(filePath)) {
      return {
        file: filePath,
        action: '更新导入路径',
        status: 'skipped',
        message: '文件不存在',
      };
    }

    let content = readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // 更新导入路径
    content = content.replace(
      /from '@\/types\/analytics'/g,
      "from '@/types/analytics-enhanced'"
    );

    if (content !== originalContent) {
      writeFileSync(filePath, content, 'utf-8');
      return {
        file: filePath,
        action: '更新导入路径',
        status: 'success',
        message: '已更新为 analytics-enhanced',
      };
    }

    return {
      file: filePath,
      action: '更新导入路径',
      status: 'skipped',
      message: '无需更新',
    };
  } catch (error) {
    return {
      file: filePath,
      action: '更新导入路径',
      status: 'failed',
      message: `错误: ${error}`,
    };
  }
}

// 修复 3: 创建情感类型适配器
function createEmotionAdapter(): FixResult {
  const adapterPath = join(PROJECT_ROOT, 'lib/ai/emotion-adapter.ts');

  try {
    if (existsSync(adapterPath)) {
      return {
        file: adapterPath,
        action: '创建情感适配器',
        status: 'skipped',
        message: '文件已存在',
      };
    }

    const content = `/**
 * 情感类型适配器
 * 统一不同模块的情感类型定义
 */

import type { EmotionType as InteractionEmotion } from '@/types/interaction'
import { InfantEmotionType } from './emotion-engine'

/**
 * 将交互情感类型转换为婴幼儿情感类型
 */
export function toInfantEmotion(interactionEmotion: InteractionEmotion): InfantEmotionType {
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
    anxious: InfantEmotionType.DISCOMFORT
  }

  return mapping[interactionEmotion] || InfantEmotionType.NEUTRAL
}

/**
 * 将婴幼儿情感类型转换为交互情感类型
 */
export function toInteractionEmotion(infantEmotion: InfantEmotionType): InteractionEmotion {
  // 反向映射
  if (infantEmotion === InfantEmotionType.HAPPINESS) return 'happy'
  if (infantEmotion === InfantEmotionType.SADNESS) return 'sad'
  if (infantEmotion === InfantEmotionType.ANGER) return 'angry'
  if (infantEmotion === InfantEmotionType.FEAR) return 'fear'
  if (infantEmotion === InfantEmotionType.SURPRISE) return 'surprise'
  if (infantEmotion === InfantEmotionType.NEUTRAL) return 'neutral'

  // 特殊情感映射到通用情感
  if (infantEmotion === InfantEmotionType.COMFORT) return 'calm'
  if (infantEmotion === InfantEmotionType.DISCOMFORT) return 'anxious'

  return 'neutral'
}

/**
 * 获取情感的中文名称
 */
export function getEmotionLabel(emotion: InfantEmotionType | InteractionEmotion): string {
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
    anxious: '焦虑'
  }

  return labels[emotion] || '未知'
}
`;

    writeFileSync(adapterPath, content, 'utf-8');

    return {
      file: adapterPath,
      action: '创建情感适配器',
      status: 'success',
      message: '已创建适配器文件',
    };
  } catch (error) {
    return {
      file: adapterPath,
      action: '创建情感适配器',
      status: 'failed',
      message: `错误: ${error}`,
    };
  }
}

// 主执行函数
async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log(
    '║        YYC³-XY-05 整合冲突快速修复                              ║'
  );
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log();

  console.log('开始执行修复...');
  console.log();

  // 执行修复
  results.push(fixEmotionTypeConflict());
  results.push(fixIntelligentInsightsPanelImports());
  results.push(createEmotionAdapter());

  // 输出结果
  console.log('修复结果:');
  console.log('─────────');

  let successCount = 0;
  let failedCount = 0;
  let skippedCount = 0;

  results.forEach((result, index) => {
    const icon =
      result.status === 'success'
        ? '✅'
        : result.status === 'failed'
          ? '❌'
          : '⏭️ ';
    console.log(`${icon} [${index + 1}] ${result.action}`);
    console.log(`   文件: ${result.file}`);
    console.log(`   状态: ${result.message}`);
    console.log();

    if (result.status === 'success') successCount++;
    else if (result.status === 'failed') failedCount++;
    else skippedCount++;
  });

  console.log('─────────');
  console.log(`总计: ${results.length} 项修复`);
  console.log(`✅ 成功: ${successCount}`);
  console.log(`⏭️  跳过: ${skippedCount}`);
  console.log(`❌ 失败: ${failedCount}`);
  console.log('─────────');
  console.log();

  if (failedCount === 0) {
    console.log('✅ 所有修复完成！项目现在可以正常运行。');
    process.exit(0);
  } else {
    console.log('⚠️  部分修复失败，请手动检查。');
    process.exit(1);
  }
}

main();
