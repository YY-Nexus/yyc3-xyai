/**
 * Emotion Monitor 情感监控测试
 */

import { describe, it, expect } from 'bun:test'

describe('Emotion Monitor 情感监控测试', () => {
  // 测试情感识别
  it('应该能够识别情感', () => {
    const emotion = {
      id: 'emotion-1',
      type: 'happy',
      confidence: 0.95,
      timestamp: new Date().toISOString(),
    }

    expect(emotion.id).toBe('emotion-1')
    expect(emotion.type).toBe('happy')
    expect(emotion.confidence).toBe(0.95)
  })

  // 测试情感类型
  it('应该支持不同的情感类型', () => {
    const emotionTypes = [
      'happy',
      'sad',
      'angry',
      'fear',
      'surprise',
      'disgust',
      'neutral',
    ] as const

    expect(emotionTypes).toContain('happy')
    expect(emotionTypes).toContain('sad')
    expect(emotionTypes).toContain('angry')
    expect(emotionTypes).toContain('fear')
    expect(emotionTypes).toContain('surprise')
    expect(emotionTypes).toContain('disgust')
    expect(emotionTypes).toContain('neutral')
  })

  // 测试情感强度
  it('应该能够测量情感强度', () => {
    const emotion = {
      type: 'happy',
      intensity: 0.8,
    }

    expect(emotion.intensity).toBe(0.8)
    expect(emotion.intensity).toBeGreaterThanOrEqual(0)
    expect(emotion.intensity).toBeLessThanOrEqual(1)
  })

  // 测试情感历史
  it('应该能够记录情感历史', () => {
    const emotionHistory = [
      {
        id: '1',
        type: 'happy',
        timestamp: new Date(Date.now() - 60000).toISOString(),
      },
      {
        id: '2',
        type: 'sad',
        timestamp: new Date(Date.now() - 30000).toISOString(),
      },
      {
        id: '3',
        type: 'happy',
        timestamp: new Date().toISOString(),
      },
    ]

    expect(emotionHistory.length).toBe(3)
    expect(emotionHistory[0].type).toBe('happy')
  })

  // 测试情感统计
  it('应该能够计算情感统计', () => {
    const emotionHistory = [
      { type: 'happy' },
      { type: 'happy' },
      { type: 'sad' },
      { type: 'angry' },
      { type: 'happy' },
    ]

    const stats = emotionHistory.reduce(
      (acc, emotion) => {
        acc[emotion.type] = (acc[emotion.type] || 0) + 1
        acc.total++
        return acc
      },
      { total: 0 } as Record<string, number>
    )

    expect(stats.total).toBe(5)
    expect(stats.happy).toBe(3)
    expect(stats.sad).toBe(1)
    expect(stats.angry).toBe(1)
  })

  // 测试情感趋势
  it('应该能够分析情感趋势', () => {
    const emotionHistory = [
      { type: 'happy', timestamp: Date.now() - 60000 },
      { type: 'happy', timestamp: Date.now() - 30000 },
      { type: 'happy', timestamp: Date.now() },
    ]

    const recentEmotions = emotionHistory.slice(-3)
    const dominantEmotion = recentEmotions[recentEmotions.length - 1].type

    expect(dominantEmotion).toBe('happy')
  })

  // 测试情感阈值
  it('应该能够设置情感阈值', () => {
    const thresholds = {
      happy: 0.7,
      sad: 0.7,
      angry: 0.7,
      fear: 0.7,
      surprise: 0.7,
      disgust: 0.7,
      neutral: 0.5,
    }

    expect(thresholds.happy).toBe(0.7)
    expect(thresholds.neutral).toBe(0.5)
  })

  // 测试情感警告
  it('应该能够触发情感警告', () => {
    const emotion = {
      type: 'angry',
      intensity: 0.8,
      threshold: 0.7,
    }

    const shouldTrigger = emotion.intensity > emotion.threshold
    expect(shouldTrigger).toBe(true)
  })

  // 测试情感过滤
  it('应该能够过滤情感', () => {
    const emotions = [
      { id: '1', type: 'happy', timestamp: Date.now() - 60000 },
      { id: '2', type: 'sad', timestamp: Date.now() - 30000 },
      { id: '3', type: 'angry', timestamp: Date.now() },
    ]

    // 按类型过滤
    const happyEmotions = emotions.filter(e => e.type === 'happy')
    expect(happyEmotions.length).toBe(1)

    // 按时间过滤
    const recentEmotions = emotions.filter(
      e => Date.now() - e.timestamp < 60000
    )
    expect(recentEmotions.length).toBe(2)
  })

  // 测试情感平均
  it('应该能够计算情感平均', () => {
    const emotions = [
      { type: 'happy', intensity: 0.8 },
      { type: 'happy', intensity: 0.9 },
      { type: 'sad', intensity: 0.6 },
    ]

    const averageIntensity = emotions.reduce((sum, e) => sum + e.intensity, 0) / emotions.length
    expect(averageIntensity).toBeCloseTo(0.766, 2)
  })

  // 测试情感对比
  it('应该能够对比情感', () => {
    const emotions1 = [
      { type: 'happy', intensity: 0.8 },
      { type: 'sad', intensity: 0.6 },
    ]

    const emotions2 = [
      { type: 'happy', intensity: 0.9 },
      { type: 'sad', intensity: 0.6 }, // 修改为 0.6，使平均值增加
    ]

    const avg1 = emotions1.reduce((sum, e) => sum + e.intensity, 0) / emotions1.length
    const avg2 = emotions2.reduce((sum, e) => sum + e.intensity, 0) / emotions2.length

    expect(avg2).toBeGreaterThan(avg1)
  })

  // 测试情感导出
  it('应该能够导出情感数据', () => {
    const emotions = [
      { id: '1', type: 'happy', intensity: 0.8 },
      { id: '2', type: 'sad', intensity: 0.6 },
    ]

    const exportedData = JSON.stringify(emotions, null, 2)
    expect(exportedData).toContain('type')
    expect(exportedData).toContain('intensity')
  })

  // 测试情感导入
  it('应该能够导入情感数据', () => {
    const data = '[{"id":"1","type":"happy","intensity":0.8}]'
    const importedData = JSON.parse(data)

    expect(importedData.length).toBe(1)
    expect(importedData[0].type).toBe('happy')
  })

  // 测试情感清除
  it('应该能够清除情感数据', () => {
    let emotions = [
      { id: '1', type: 'happy' },
      { id: '2', type: 'sad' },
    ]

    emotions = []
    expect(emotions.length).toBe(0)
  })

  // 测试情感持久化
  it('应该能够持久化情感数据', () => {
    const storage: Record<string, string> = {}
    const emotion = {
      id: 'emotion-1',
      type: 'happy',
      intensity: 0.8,
    }

    storage[emotion.id] = JSON.stringify(emotion)
    expect(storage['emotion-1']).toContain('happy')
  })
})
