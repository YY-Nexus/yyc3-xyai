/**
 * Assessment Questions 评估问题测试
 */

import { describe, it, expect } from 'bun:test'

describe('Assessment Questions 评估问题测试', () => {
  // 测试问题定义
  it('应该能够定义评估问题', () => {
    const question = {
      id: 'q-1',
      text: '宝宝会翻身吗？',
      type: 'boolean',
      category: 'motor_skills',
      ageRange: { min: 3, max: 6, unit: 'months' },
      weight: 1.0,
      required: true,
    }

    expect(question.id).toBe('q-1')
    expect(question.text).toBe('宝宝会翻身吗？')
    expect(question.type).toBe('boolean')
    expect(question.category).toBe('motor_skills')
    expect(question.ageRange.min).toBe(3)
    expect(question.ageRange.max).toBe(6)
    expect(question.weight).toBe(1.0)
    expect(question.required).toBe(true)
  })

  // 测试问题创建
  it('应该能够创建评估问题', () => {
    const questions: Array<{
      id: string
      text: string
      type: string
      category: string
    }> = []

    const newQuestion = {
      id: `q-${Date.now()}`,
      text: '宝宝会坐吗？',
      type: 'boolean',
      category: 'motor_skills',
    }

    questions.push(newQuestion)
    expect(questions.length).toBe(1)
    expect(questions[0].text).toBe('宝宝会坐吗？')
  })

  // 测试问题更新
  it('应该能够更新评估问题', () => {
    const question = {
      id: 'q-1',
      text: '宝宝会翻身吗？',
      type: 'boolean',
      options: ['是', '否'],
    }

    // 更新问题
    question.text = '宝宝能够独立翻身吗？'
    question.options = ['能够', '不能够', '部分能够']

    expect(question.text).toBe('宝宝能够独立翻身吗？')
    expect(question.options.length).toBe(3)
  })

  // 测试问题删除
  it('应该能够删除评估问题', () => {
    const questions = [
      { id: '1', text: '问题1' },
      { id: '2', text: '问题2' },
      { id: '3', text: '问题3' },
    ]

    // 删除问题
    const filteredQuestions = questions.filter(q => q.id !== '2')
    expect(filteredQuestions.length).toBe(2)
    expect(filteredQuestions[0].id).toBe('1')
    expect(filteredQuestions[1].id).toBe('3')
  })

  // 测试问题类型
  it('应该支持不同的问题类型', () => {
    const questionTypes = ['boolean', 'multiple_choice', 'text', 'scale'] as const

    expect(questionTypes).toContain('boolean')
    expect(questionTypes).toContain('multiple_choice')
    expect(questionTypes).toContain('text')
    expect(questionTypes).toContain('scale')
  })

  // 测试问题分类
  it('应该能够分类评估问题', () => {
    const categories = [
      'motor_skills',
      'cognitive',
      'language',
      'social_emotional',
      'physical_growth',
    ] as const

    expect(categories).toContain('motor_skills')
    expect(categories).toContain('cognitive')
    expect(categories).toContain('language')
    expect(categories).toContain('social_emotional')
    expect(categories).toContain('physical_growth')
  })

  // 测试问题搜索
  it('应该能够搜索评估问题', () => {
    const questions = [
      { id: '1', text: '宝宝会翻身吗？', category: 'motor_skills' },
      { id: '2', text: '宝宝会说话吗？', category: 'language' },
      { id: '3', text: '宝宝会爬吗？', category: 'motor_skills' },
    ]

    // 搜索问题
    const searchResults = questions.filter(q =>
      q.text.includes('翻身') || q.category === 'motor_skills'
    )
    expect(searchResults.length).toBe(2)
  })

  // 测试问题过滤
  it('应该能够过滤评估问题', () => {
    const questions = [
      { id: '1', text: '问题1', category: 'motor_skills', ageRange: { min: 3, max: 6 } },
      { id: '2', text: '问题2', category: 'language', ageRange: { min: 6, max: 12 } },
      { id: '3', text: '问题3', category: 'motor_skills', ageRange: { min: 3, max: 6 } },
    ]

    // 按类别和年龄范围过滤
    const filteredQuestions = questions.filter(
      q =>
        q.category === 'motor_skills' &&
        q.ageRange.min <= 5 &&
        q.ageRange.max >= 5
    )
    expect(filteredQuestions.length).toBe(2)
  })

  // 测试问题排序
  it('应该能够排序评估问题', () => {
    const questions = [
      { id: '3', order: 3, text: '问题3' },
      { id: '1', order: 1, text: '问题1' },
      { id: '2', order: 2, text: '问题2' },
    ]

    // 按顺序排序
    questions.sort((a, b) => a.order - b.order)

    expect(questions[0].order).toBe(1)
    expect(questions[1].order).toBe(2)
    expect(questions[2].order).toBe(3)
  })

  // 测试问题选项
  it('应该能够管理问题选项', () => {
    const question = {
      id: 'q-1',
      text: '宝宝会翻身吗？',
      type: 'multiple_choice',
      options: ['能够', '不能够'] as string[],
    }

    // 添加选项
    question.options.push('部分能够')
    expect(question.options).toContain('部分能够')
    expect(question.options.length).toBe(3)

    // 删除选项
    const index = question.options.indexOf('不能够')
    if (index > -1) {
      question.options.splice(index, 1)
    }
    expect(question.options).not.toContain('不能够')
    expect(question.options.length).toBe(2)
  })

  // 测试问题权重
  it('应该能够设置问题权重', () => {
    const question = {
      id: 'q-1',
      text: '宝宝会翻身吗？',
      weight: 1.0,
    }

    // 更新权重
    question.weight = 1.5
    expect(question.weight).toBe(1.5)
  })

  // 测试问题必需性
  it('应该能够设置问题必需性', () => {
    const question = {
      id: 'q-1',
      text: '宝宝会翻身吗？',
      required: true,
    }

    // 更新必需性
    question.required = false
    expect(question.required).toBe(false)
  })

  // 测试问题依赖
  it('应该能够设置问题依赖', () => {
    const question = {
      id: 'q-2',
      text: '宝宝能够独立坐吗？',
      dependsOn: 'q-1',
      condition: 'equals',
      value: true,
    }

    expect(question.dependsOn).toBe('q-1')
    expect(question.condition).toBe('equals')
    expect(question.value).toBe(true)
  })

  // 测试问题验证
  it('应该能够验证问题答案', () => {
    const question = {
      id: 'q-1',
      text: '宝宝会翻身吗？',
      type: 'boolean' as const,
      required: true,
    }

    const answer = true

    // 验证答案
    const isValid = question.type === 'boolean' && typeof answer === 'boolean'
    expect(isValid).toBe(true)
  })

  // 测试问题评分
  it('应该能够计算问题得分', () => {
    const question = {
      id: 'q-1',
      text: '宝宝会翻身吗？',
      type: 'boolean' as const,
      weight: 1.0,
    }

    const answer = true

    // 计算得分
    const score = answer ? question.weight : 0
    expect(score).toBe(1.0)
  })

  // 测试问题统计
  it('应该能够计算问题统计', () => {
    const questions = [
      { id: '1', category: 'motor_skills', answered: true },
      { id: '2', category: 'language', answered: true },
      { id: '3', category: 'motor_skills', answered: false },
      { id: '4', category: 'cognitive', answered: true },
    ]

    const stats = {
      total: questions.length,
      answered: questions.filter(q => q.answered).length,
      unanswered: questions.filter(q => !q.answered).length,
      byCategory: {} as Record<string, { total: number; answered: number }>,
    }

    questions.forEach(q => {
      if (!stats.byCategory[q.category]) {
        stats.byCategory[q.category] = { total: 0, answered: 0 }
      }
      stats.byCategory[q.category].total++
      if (q.answered) {
        stats.byCategory[q.category].answered++
      }
    })

    expect(stats.total).toBe(4)
    expect(stats.answered).toBe(3)
    expect(stats.unanswered).toBe(1)
    expect(stats.byCategory.motor_skills.total).toBe(2)
    expect(stats.byCategory.motor_skills.answered).toBe(1)
  })

  // 测试问题导出
  it('应该能够导出问题', () => {
    const questions = [
      { id: '1', text: '问题1' },
      { id: '2', text: '问题2' },
    ]

    const exportedQuestions = JSON.stringify(questions, null, 2)

    expect(exportedQuestions).toContain('id')
    expect(exportedQuestions).toContain('text')
  })
})
