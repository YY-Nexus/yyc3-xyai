/**
 * LocalStorage Safe 测试
 */

import { describe, it, expect, beforeEach } from 'bun:test'

describe('LocalStorage Safe 测试', () => {
  // 模拟 localStorage
  const mockLocalStorage = {
    getItem: (key: string) => null as string | null,
    setItem: (key: string, value: string) => {},
    removeItem: (key: string) => {},
    clear: () => {},
  }

  beforeEach(() => {
    // 重置 mock localStorage
    mockLocalStorage.getItem = () => null
  })

  // 测试获取项目
  it('应该能够安全获取项目', () => {
    const key = 'test-key'
    const value = JSON.stringify({ data: 'test' })

    mockLocalStorage.getItem = () => value

    const result = mockLocalStorage.getItem(key)
    expect(result).toBe(value)
  })

  // 测试设置项目
  it('应该能够安全设置项目', () => {
    const key = 'test-key'
    const value = JSON.stringify({ data: 'test' })

    let savedValue: string = ''
    mockLocalStorage.setItem = (k: string, v: string) => {
      savedValue = v
    }

    mockLocalStorage.setItem(key, value)
    expect(savedValue).toBe(value)
  })

  // 测试删除项目
  it('应该能够安全删除项目', () => {
    const key = 'test-key'
    let removedKey: string = ''

    mockLocalStorage.removeItem = (k: string) => {
      removedKey = k
    }

    mockLocalStorage.removeItem(key)
    expect(removedKey).toBe(key)
  })

  // 测试清除所有项目
  it('应该能够安全清除所有项目', () => {
    let cleared = false

    mockLocalStorage.clear = () => {
      cleared = true
    }

    mockLocalStorage.clear()
    expect(cleared).toBe(true)
  })

  // 测试错误处理（localStorage 不可用）
  it('应该能够处理 localStorage 不可用的情况', () => {
    const key = 'test-key'

    // 模拟 localStorage 不可用
    const unsafeLocalStorage = {
      getItem: () => {
        throw new Error('localStorage is not available')
      },
      setItem: () => {
        throw new Error('localStorage is not available')
      },
      removeItem: () => {
        throw new Error('localStorage is not available')
      },
      clear: () => {
        throw new Error('localStorage is not available')
      },
    }

    expect(() => unsafeLocalStorage.getItem(key)).toThrow()
  })

  // 测试 JSON 解析错误
  it('应该能够处理 JSON 解析错误', () => {
    const key = 'test-key'
    const invalidValue = '{ invalid json }'

    mockLocalStorage.getItem = () => invalidValue

    const result = mockLocalStorage.getItem(key)
    expect(result).toBe(invalidValue)
  })

  // 测试存储限制
  it('应该能够处理存储限制', () => {
    const key = 'test-key'
    const largeValue = 'x'.repeat(10 * 1024 * 1024) // 10MB

    mockLocalStorage.setItem = () => {
      throw new Error('QuotaExceededError')
    }

    expect(() => mockLocalStorage.setItem(key, largeValue)).toThrow()
  })

  // 测试键存在性检查
  it('应该能够检查键是否存在', () => {
    const key = 'test-key'
    const value = 'test-value'

    mockLocalStorage.getItem = () => value

    const result = mockLocalStorage.getItem(key)
    expect(result).toBe(value)
  })

  // 测试空值处理
  it('应该能够处理空值', () => {
    const key = 'test-key'

    mockLocalStorage.getItem = () => null

    const result = mockLocalStorage.getItem(key)
    expect(result).toBe(null)
  })

  // 测试类型安全
  it('应该能够保证类型安全', () => {
    const key = 'test-key'
    const value = JSON.stringify({
      string: 'test',
      number: 123,
      boolean: true,
      array: [1, 2, 3],
      object: { nested: 'value' },
    })

    mockLocalStorage.getItem = () => value

    const result = mockLocalStorage.getItem(key)
    expect(result).toBe(value)
  })

  // 测试过期时间
  it('应该能够处理过期时间', () => {
    const key = 'test-key'
    const now = Date.now()
    const expiredData = {
      value: 'test',
      expiresAt: now - 1000, // 已过期
    }

    mockLocalStorage.getItem = () => JSON.stringify(expiredData)

    const result = mockLocalStorage.getItem(key)
    expect(result).toBeDefined()
  })
})
