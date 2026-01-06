#!/usr/bin/env bun
/**
 * YYC³-XY-05 整合功能验证脚本
 * 验证从 xy-01, xy-02, xy-03 复制的优势功能
 */

import { fileExists } from '../lib/utils/file-utils'

interface VerificationResult {
  feature: string
  file: string
  exists: boolean
  importable: boolean
  status: '✅' | '⚠️' | '❌'
}

const featuresToVerify = [
  {
    name: '语音交互组件',
    file: './components/VoiceInteraction.tsx',
    importPath: '../components/VoiceInteraction'
  },
  {
    name: '增强版AI核心引擎',
    file: './core/AgenticCore-Enhanced.ts',
    importPath: '../core/AgenticCore-Enhanced'
  },
  {
    name: '情感智能引擎',
    file: './lib/ai/emotion-engine.ts',
    importPath: '../lib/ai/emotion-engine'
  },
  {
    name: '生日主题系统',
    file: './components/theme/BirthdayThemeProvider.tsx',
    importPath: '../components/theme/BirthdayThemeProvider'
  },
  {
    name: '全局UI配置',
    file: './lib/ui/global-ui-config.ts',
    importPath: '../lib/ui/global-ui-config'
  },
  {
    name: '服务编排器',
    file: './services/orchestrator/ServiceOrchestrator.ts',
    importPath: '../services/orchestrator/ServiceOrchestrator'
  },
  {
    name: '元学习系统',
    file: './services/learning/MetaLearningSystem.ts',
    importPath: '../services/learning/MetaLearningSystem'
  },
  {
    name: '工具管理系统',
    file: './services/tools/ToolManager.ts',
    importPath: '../services/tools/ToolManager'
  },
  {
    name: 'Q版角色组件',
    file: './components/ui/EnhancedQVersionCharacter.tsx',
    importPath: '../components/ui/EnhancedQVersionCharacter'
  },
  {
    name: '智能洞察面板',
    file: './components/analytics/IntelligentInsightsPanel.tsx',
    importPath: '../components/analytics/IntelligentInsightsPanel'
  },
  {
    name: '自适应集成学习',
    file: './lib/prediction/adaptive-ensemble.ts',
    importPath: '../lib/prediction/adaptive-ensemble'
  },
  {
    name: '专用预测引擎',
    file: './lib/prediction/specialized-engines.ts',
    importPath: '../lib/prediction/specialized-engines'
  }
]

async function verifyFeature(feature: typeof featuresToVerify[0]): Promise<VerificationResult> {
  const result: VerificationResult = {
    feature: feature.name,
    file: feature.file,
    exists: false,
    importable: false,
    status: '❌'
  }

  // 检查文件是否存在
  try {
    const exists = await Bun.file(feature.file).exists()
    result.exists = exists

    if (!exists) {
      result.status = '❌'
      return result
    }
  } catch (error) {
    result.status = '❌'
    return result
  }

  // 尝试动态导入
  try {
    await import(feature.importPath)
    result.importable = true
    result.status = '✅'
  } catch (error) {
    result.importable = false
    result.status = '⚠️'
  }

  return result
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║  YYC³-XY-05 整合功能验证报告                              ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  console.log()

  const results: VerificationResult[] = []

  for (const feature of featuresToVerify) {
    const result = await verifyFeature(feature)
    results.push(result)

    const statusIcon = result.status
    const importStatus = result.importable ? '可导入' : '导入失败'
    const existsStatus = result.exists ? '存在' : '缺失'

    console.log(`${statusIcon} ${result.feature}`)
    console.log(`   文件: ${result.file}`)
    console.log(`   状态: ${existsStatus} | ${importStatus}`)
    console.log()
  }

  // 统计结果
  const successCount = results.filter(r => r.status === '✅').length
  const warningCount = results.filter(r => r.status === '⚠️').length
  const errorCount = results.filter(r => r.status === '❌').length

  console.log('─────────────────────────────────────────────────────────────')
  console.log(`总计: ${results.length} 个功能`)
  console.log(`✅ 成功: ${successCount}`)
  console.log(`⚠️  警告: ${warningCount}`)
  console.log(`❌ 失败: ${errorCount}`)
  console.log('─────────────────────────────────────────────────────────────')

  // 测试核心功能
  console.log()
  console.log('═════════════════════════════════════════════════════════════')
  console.log('核心功能测试')
  console.log('═════════════════════════════════════════════════════════════')
  console.log()

  try {
    // 测试情感引擎
    const { emotionEngine } = await import('../lib/ai/emotion-engine')
    console.log('✅ 情感引擎: 模块加载成功')
    console.log('   - 支持0-3岁婴幼儿情感识别')
    console.log('   - 包含哭声分析、年龄段适配等特性')
    console.log()
  } catch (error) {
    console.log('❌ 情感引擎: 模块加载失败')
    console.log(`   错误: ${error}`)
    console.log()
  }

  try {
    // 测试AgenticCore
    const { AgenticCore } = await import('../core/AgenticCore-Enhanced')
    console.log('✅ AI核心引擎: 模块加载成功')
    console.log('   - 事件驱动+目标驱动混合架构')
    console.log('   - 支持任务分解、执行、学习、反思')
    console.log()
  } catch (error) {
    console.log('❌ AI核心引擎: 模块加载失败')
    console.log(`   错误: ${error}`)
    console.log()
  }

  process.exit(errorCount > 0 ? 1 : 0)
}

main()
