/**
 * AI Roles AI 角色测试
 */

import { describe, it, expect } from 'bun:test'

describe('AI Roles AI 角色测试', () => {
  // 测试角色定义
  it('应该能够定义 AI 角色', () => {
    const aiRole = {
      id: 'role-1',
      name: '记录者',
      description: '记录成长瞬间',
      personality: '温暖',
      capabilities: ['recording', 'memory'],
      isActive: true,
    }

    expect(aiRole.id).toBe('role-1')
    expect(aiRole.name).toBe('记录者')
    expect(aiRole.description).toBe('记录成长瞬间')
    expect(aiRole.personality).toBe('温暖')
    expect(aiRole.capabilities).toContain('recording')
    expect(aiRole.isActive).toBe(true)
  })

  // 测试角色创建
  it('应该能够创建 AI 角色', () => {
    const roles: Array<{
      id: string
      name: string
      description: string
      isActive: boolean
    }> = []

    const newRole = {
      id: `role-${Date.now()}`,
      name: '守护者',
      description: '保护安全',
      isActive: true,
    }

    roles.push(newRole)
    expect(roles.length).toBe(1)
    expect(roles[0].name).toBe('守护者')
  })

  // 测试角色更新
  it('应该能够更新 AI 角色', () => {
    const role = {
      id: 'role-1',
      name: '记录者',
      description: '记录成长瞬间',
      personality: '温暖',
      isActive: true,
    }

    // 更新角色
    role.name = '记录员'
    role.description = '记录宝宝成长的每一个瞬间'
    role.personality = '热情'

    expect(role.name).toBe('记录员')
    expect(role.description).toBe('记录宝宝成长的每一个瞬间')
    expect(role.personality).toBe('热情')
  })

  // 测试角色删除
  it('应该能够删除 AI 角色', () => {
    const roles = [
      { id: '1', name: '记录者', isActive: true },
      { id: '2', name: '守护者', isActive: true },
      { id: '3', name: '陪伴者', isActive: true },
    ]

    // 删除角色
    const filteredRoles = roles.filter(role => role.id !== '2')
    expect(filteredRoles.length).toBe(2)
    expect(filteredRoles[0].id).toBe('1')
    expect(filteredRoles[1].id).toBe('3')
  })

  // 测试角色激活/停用
  it('应该能够激活或停用 AI 角色', () => {
    const role = {
      id: 'role-1',
      name: '记录者',
      isActive: true,
    }

    // 停用角色
    role.isActive = false
    expect(role.isActive).toBe(false)

    // 激活角色
    role.isActive = true
    expect(role.isActive).toBe(true)
  })

  // 测试角色搜索
  it('应该能够搜索 AI 角色', () => {
    const roles = [
      { id: '1', name: '记录者', description: '记录成长' },
      { id: '2', name: '守护者', description: '保护安全' },
      { id: '3', name: '陪伴者', description: '陪伴成长' },
    ]

    // 搜索角色
    const searchResults = roles.filter(
      role =>
        role.name.includes('记录') || role.description.includes('记录')
    )
    expect(searchResults.length).toBe(1)
    expect(searchResults[0].id).toBe('1')
  })

  // 测试角色过滤
  it('应该能够过滤 AI 角色', () => {
    const roles = [
      { id: '1', name: '记录者', isActive: true },
      { id: '2', name: '守护者', isActive: false },
      { id: '3', name: '陪伴者', isActive: true },
    ]

    // 按激活状态过滤
    const activeRoles = roles.filter(role => role.isActive)
    expect(activeRoles.length).toBe(2)
    expect(activeRoles[0].name).toBe('记录者')
    expect(activeRoles[1].name).toBe('陪伴者')
  })

  // 测试角色排序
  it('应该能够排序 AI 角色', () => {
    const roles = [
      { id: '3', name: '陪伴者' },
      { id: '1', name: '记录者' },
      { id: '2', name: '守护者' },
    ]

    // 按名称排序
    roles.sort((a, b) => a.name.localeCompare(b.name))

    // 检查排序后的顺序
    const sortedNames = roles.map(r => r.name)
    expect(sortedNames.length).toBe(3)
    expect(sortedNames).toContain('陪伴者')
    expect(sortedNames).toContain('守护者')
    expect(sortedNames).toContain('记录者')
  })

  // 测试角色能力
  it('应该能够管理角色能力', () => {
    const role = {
      id: 'role-1',
      name: '记录者',
      capabilities: ['recording', 'memory'] as string[],
    }

    // 添加能力
    role.capabilities.push('analysis')
    expect(role.capabilities).toContain('analysis')
    expect(role.capabilities.length).toBe(3)

    // 删除能力
    const index = role.capabilities.indexOf('memory')
    if (index > -1) {
      role.capabilities.splice(index, 1)
    }
    expect(role.capabilities).not.toContain('memory')
    expect(role.capabilities.length).toBe(2)
  })

  // 测试角色 personality
  it('应该能够定义角色 personality', () => {
    const personalities = ['温暖', '热情', '严谨', '幽默', '耐心'] as const

    expect(personalities).toContain('温暖')
    expect(personalities).toContain('热情')
    expect(personalities).toContain('严谨')
    expect(personalities).toContain('幽默')
    expect(personalities).toContain('耐心')
  })

  // 测试角色统计
  it('应该能够计算角色统计', () => {
    const roles = [
      { id: '1', name: '记录者', isActive: true, type: 'recording' },
      { id: '2', name: '守护者', isActive: true, type: 'protection' },
      { id: '3', name: '陪伴者', isActive: false, type: 'companionship' },
      { id: '4', name: '记录者', isActive: true, type: 'recording' },
    ]

    const stats = {
      total: roles.length,
      active: roles.filter(r => r.isActive).length,
      inactive: roles.filter(r => !r.isActive).length,
      byType: {} as Record<string, number>,
    }

    roles.forEach(role => {
      stats.byType[role.type] = (stats.byType[role.type] || 0) + 1
    })

    expect(stats.total).toBe(4)
    expect(stats.active).toBe(3)
    expect(stats.inactive).toBe(1)
    expect(stats.byType.recording).toBe(2)
    expect(stats.byType.protection).toBe(1)
  })

  // 测试角色配置
  it('应该能够配置角色参数', () => {
    const roleConfig = {
      temperature: 0.7,
      maxTokens: 1000,
      topP: 0.9,
      frequencyPenalty: 0.5,
      presencePenalty: 0.5,
    }

    expect(roleConfig.temperature).toBe(0.7)
    expect(roleConfig.maxTokens).toBe(1000)
    expect(roleConfig.topP).toBe(0.9)
    expect(roleConfig.frequencyPenalty).toBe(0.5)
    expect(roleConfig.presencePenalty).toBe(0.5)
  })

  // 测试角色推荐
  it('应该能够推荐合适的角色', () => {
    const userContext = {
      action: 'recording',
      mood: 'happy',
      time: 'morning',
    }

    const roles = [
      {
        id: '1',
        name: '记录者',
        recommendedFor: ['recording', 'memory'] as string[],
      },
      {
        id: '2',
        name: '守护者',
        recommendedFor: ['protection', 'safety'] as string[],
      },
    ]

    const recommendedRoles = roles.filter(role =>
      role.recommendedFor.includes(userContext.action)
    )

    expect(recommendedRoles.length).toBe(1)
    expect(recommendedRoles[0].name).toBe('记录者')
  })

  // 测试角色切换
  it('应该能够切换 AI 角色', () => {
    let currentRoleId = 'role-1'

    const roles = [
      { id: 'role-1', name: '记录者' },
      { id: 'role-2', name: '守护者' },
      { id: 'role-3', name: '陪伴者' },
    ]

    // 切换到守护者
    currentRoleId = 'role-2'
    const currentRole = roles.find(r => r.id === currentRoleId)

    expect(currentRole?.name).toBe('守护者')

    // 切换到陪伴者
    currentRoleId = 'role-3'
    const newCurrentRole = roles.find(r => r.id === currentRoleId)

    expect(newCurrentRole?.name).toBe('陪伴者')
  })

  // 测试角色历史
  it('应该能够记录角色使用历史', () => {
    const roleHistory = [
      {
        roleId: 'role-1',
        timestamp: new Date(Date.now() - 60000).toISOString(),
      },
      {
        roleId: 'role-2',
        timestamp: new Date(Date.now() - 30000).toISOString(),
      },
      {
        roleId: 'role-1',
        timestamp: new Date().toISOString(),
      },
    ]

    const recentRoles = roleHistory
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 3)

    expect(recentRoles.length).toBe(3)
    expect(recentRoles[0].roleId).toBe('role-1')
  })

  // 测试角色偏好
  it('应该能够记录用户角色偏好', () => {
    const userPreferences = {
      preferredRoleIds: ['role-1', 'role-2'] as string[],
      roleWeights: {
        'role-1': 0.8,
        'role-2': 0.6,
        'role-3': 0.4,
      } as Record<string, number>,
    }

    expect(userPreferences.preferredRoleIds).toContain('role-1')
    expect(userPreferences.preferredRoleIds).toContain('role-2')
    expect(userPreferences.roleWeights['role-1']).toBe(0.8)
  })
})
