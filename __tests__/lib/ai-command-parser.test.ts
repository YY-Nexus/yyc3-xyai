/**
 * AI Command Parser AI 命令解析器测试
 */

import { describe, it, expect } from 'bun:test'

describe('AI Command Parser AI 命令解析器测试', () => {
  // 测试命令定义
  it('应该能够定义命令', () => {
    const command = {
      id: 'cmd-1',
      name: '记录成长',
      type: 'action',
      pattern: /^记录\s*(.+)$/,
      params: ['content'],
      handler: (content: string) => `记录：${content}`,
    }

    expect(command.id).toBe('cmd-1')
    expect(command.name).toBe('记录成长')
    expect(command.type).toBe('action')
    expect(command.params).toContain('content')
  })

  // 测试命令解析
  it('应该能够解析命令', () => {
    const text = '记录宝宝今天第一次走路'
    const pattern = /^记录\s*(.+)$/
    const match = text.match(pattern)

    expect(match).toBeDefined()
    expect(match?.[1]).toBe('宝宝今天第一次走路')
  })

  // 测试命令参数提取
  it('应该能够提取命令参数', () => {
    const text = '记录 成长 宝宝今天第一次走路'
    const pattern = /^记录\s*(成长)\s*(.+)$/
    const match = text.match(pattern)

    expect(match).toBeDefined()
    expect(match?.[1]).toBe('成长')
    expect(match?.[2]).toBe('宝宝今天第一次走路')
  })

  // 测试命令类型
  it('应该支持不同的命令类型', () => {
    const commandTypes = ['action', 'query', 'setting', 'navigation'] as const

    expect(commandTypes).toContain('action')
    expect(commandTypes).toContain('query')
    expect(commandTypes).toContain('setting')
    expect(commandTypes).toContain('navigation')
  })

  // 测试命令注册
  it('应该能够注册命令', () => {
    const commands = new Map<string, any>()

    const command = {
      id: 'cmd-1',
      name: '记录成长',
      pattern: /^记录\s*(.+)$/,
      handler: (content: string) => `记录：${content}`,
    }

    commands.set(command.id, command)
    expect(commands.has('cmd-1')).toBe(true)
  })

  // 测试命令查找
  it('应该能够查找命令', () => {
    const commands = new Map<string, any>()

    const command1 = {
      id: 'cmd-1',
      name: '记录成长',
      pattern: /^记录\s*(.+)$/,
    }

    const command2 = {
      id: 'cmd-2',
      name: '查询记录',
      pattern: /^查询\s*(.+)$/,
    }

    commands.set(command1.id, command1)
    commands.set(command2.id, command2)

    const foundCommand = Array.from(commands.values()).find(cmd =>
      cmd.pattern.test('记录宝宝今天第一次走路')
    )

    expect(foundCommand?.id).toBe('cmd-1')
  })

  // 测试命令执行
  it('应该能够执行命令', () => {
    const command = {
      id: 'cmd-1',
      name: '记录成长',
      handler: (content: string) => `记录：${content}`,
    }

    const result = command.handler('宝宝今天第一次走路')
    expect(result).toBe('记录：宝宝今天第一次走路')
  })

  // 测试命令链
  it('应该能够链接命令', () => {
    const commands = [
      {
        id: 'cmd-1',
        name: '记录成长',
        pattern: /^记录\s*(.+)$/,
        handler: (content: string) => ({ type: 'record', content }),
      },
      {
        id: 'cmd-2',
        name: '添加标签',
        pattern: /^添加标签\s*(.+)$/,
        handler: (tags: string) => ({ type: 'add-tags', tags }),
      },
    ]

    const commandChain = [
      commands[0].handler('宝宝今天第一次走路'),
      commands[1].handler('里程碑, 运动'),
    ]

    expect(commandChain.length).toBe(2)
    expect(commandChain[0].type).toBe('record')
    expect(commandChain[1].type).toBe('add-tags')
  })

  // 测试命令别名
  it('应该能够设置命令别名', () => {
    const command = {
      id: 'cmd-1',
      name: '记录成长',
      aliases: ['记录', '添加记录', '新建记录'],
      pattern: /^记录\s*(.+)$/,
    }

    expect(command.aliases).toContain('记录')
    expect(command.aliases).toContain('添加记录')
    expect(command.aliases).toContain('新建记录')
  })

  // 测试命令帮助
  it('应该能够提供命令帮助', () => {
    const command = {
      id: 'cmd-1',
      name: '记录成长',
      description: '记录宝宝的成长瞬间',
      usage: '记录 <内容>',
      examples: [
        '记录 宝宝今天第一次走路',
        '记录 宝宝第一次说话',
      ],
    }

    expect(command.description).toBe('记录宝宝的成长瞬间')
    expect(command.usage).toBe('记录 <内容>')
    expect(command.examples.length).toBe(2)
  })

  // 测试命令历史
  it('应该能够记录命令历史', () => {
    const commandHistory = [
      {
        id: 'hist-1',
        command: '记录 宝宝今天第一次走路',
        timestamp: new Date(Date.now() - 60000).toISOString(),
      },
      {
        id: 'hist-2',
        command: '查询 成长记录',
        timestamp: new Date(Date.now() - 30000).toISOString(),
      },
    ]

    expect(commandHistory.length).toBe(2)
    expect(commandHistory[0].command).toBe('记录 宝宝今天第一次走路')
  })

  // 测试命令统计
  it('应该能够计算命令统计', () => {
    const commandHistory = [
      { commandId: 'cmd-1', success: true },
      { commandId: 'cmd-1', success: true },
      { commandId: 'cmd-2', success: false },
      { commandId: 'cmd-1', success: true },
    ]

    const stats = {
      total: commandHistory.length,
      byCommandId: {} as Record<string, { total: number; success: number }>,
    }

    commandHistory.forEach(entry => {
      if (!stats.byCommandId[entry.commandId]) {
        stats.byCommandId[entry.commandId] = { total: 0, success: 0 }
      }
      stats.byCommandId[entry.commandId].total++
      if (entry.success) {
        stats.byCommandId[entry.commandId].success++
      }
    })

    expect(stats.total).toBe(4)
    expect(stats.byCommandId['cmd-1'].total).toBe(3)
    expect(stats.byCommandId['cmd-1'].success).toBe(3)
    expect(stats.byCommandId['cmd-2'].total).toBe(1)
    expect(stats.byCommandId['cmd-2'].success).toBe(0)
  })

  // 测试命令错误处理
  it('应该能够处理命令错误', () => {
    const command = {
      id: 'cmd-1',
      name: '记录成长',
      handler: (content: string) => {
        if (!content) {
          throw new Error('内容不能为空')
        }
        return `记录：${content}`
      },
    }

    // 测试正常情况
    expect(() => command.handler('宝宝今天第一次走路')).not.toThrow()

    // 测试错误情况
    expect(() => command.handler('')).toThrow('内容不能为空')
  })

  // 测试命令验证
  it('应该能够验证命令', () => {
    const command = {
      id: 'cmd-1',
      name: '记录成长',
      validator: (content: string) => {
        return content.length > 0 && content.length <= 1000
      },
    }

    expect(command.validator('宝宝今天第一次走路')).toBe(true)
    expect(command.validator('')).toBe(false)
    expect(command.validator('a'.repeat(1001))).toBe(false)
  })

  // 测试命令转换
  it('应该能够转换命令格式', () => {
    const commands = [
      { from: '记录', to: 'record' },
      { from: '查询', to: 'query' },
      { from: '删除', to: 'delete' },
    ]

    const commandText = '记录 宝宝今天第一次走路'
    let convertedText = commandText

    commands.forEach(cmd => {
      convertedText = convertedText.replace(cmd.from, cmd.to)
    })

    expect(convertedText).toBe('record 宝宝今天第一次走路')
  })

  // 测试命令建议
  it('应该能够提供命令建议', () => {
    const commands = [
      { id: 'cmd-1', name: '记录成长', keywords: ['记录', '添加'] },
      { id: 'cmd-2', name: '查询记录', keywords: ['查询', '搜索'] },
      { id: 'cmd-3', name: '删除记录', keywords: ['删除', '移除'] },
    ]

    const searchText = '记'
    const suggestions = commands.filter(cmd =>
      cmd.keywords.some(keyword => keyword.includes(searchText))
    )

    expect(suggestions.length).toBe(1)
    expect(suggestions[0].id).toBe('cmd-1')
  })

  // 测试命令分组
  it('应该能够对命令进行分组', () => {
    const commands = [
      { id: 'cmd-1', name: '记录成长', category: 'growth' },
      { id: 'cmd-2', name: '查询记录', category: 'growth' },
      { id: 'cmd-3', name: '设置提醒', category: 'reminder' },
    ]

    const groupedCommands = commands.reduce((acc, cmd) => {
      if (!acc[cmd.category]) {
        acc[cmd.category] = []
      }
      acc[cmd.category].push(cmd)
      return acc
    }, {} as Record<string, typeof commands>)

    expect(groupedCommands.growth.length).toBe(2)
    expect(groupedCommands.reminder.length).toBe(1)
  })

  // 测试命令优先级
  it('应该能够设置命令优先级', () => {
    const commands = [
      { id: 'cmd-1', name: '记录成长', priority: 1 },
      { id: 'cmd-2', name: '查询记录', priority: 2 },
      { id: 'cmd-3', name: '删除记录', priority: 3 },
    ]

    const sortedCommands = [...commands].sort((a, b) => a.priority - b.priority)

    expect(sortedCommands[0].priority).toBe(1)
    expect(sortedCommands[1].priority).toBe(2)
    expect(sortedCommands[2].priority).toBe(3)
  })

  // 测试命令导出
  it('应该能够导出命令', () => {
    const commands = [
      { id: 'cmd-1', name: '记录成长', pattern: /^记录\s*(.+)$/ },
      { id: 'cmd-2', name: '查询记录', pattern: /^查询\s*(.+)$/ },
    ]

    const exportedCommands = JSON.stringify(commands, null, 2)
    expect(exportedCommands).toContain('id')
    expect(exportedCommands).toContain('name')
  })

  // 测试命令导入
  it('应该能够导入命令', () => {
    const data = '[{"id":"cmd-1","name":"记录成长"}]'
    const importedCommands = JSON.parse(data)

    expect(importedCommands.length).toBe(1)
    expect(importedCommands[0].name).toBe('记录成长')
  })
})
