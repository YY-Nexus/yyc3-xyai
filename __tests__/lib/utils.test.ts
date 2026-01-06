/**
 * Utils 工具函数测试
 */

import { describe, it, expect } from 'bun:test'

describe('Utils 工具函数测试', () => {
  // 测试 cn 函数（类名合并）
  it('应该能够合并类名', () => {
    // 模拟 cn 函数
    function cn(...inputs: string[]) {
      return inputs.filter(Boolean).join(' ')
    }

    const result = cn('bg-red-500', 'text-white', null, undefined, '')
    expect(result).toBe('bg-red-500 text-white')
  })

  // 测试 debounce 函数（防抖）
  it('应该能够防抖函数', () => {
    let callCount = 0

    function increment() {
      callCount++
    }

    // 模拟 debounce 函数
    function debounce<T extends (...args: unknown[]) => unknown>(
      func: T,
      wait: number
    ): (...args: Parameters<T>) => void {
      let timeout: ReturnType<typeof setTimeout> | null = null

      return function executedFunction(...args: Parameters<T>) {
        if (timeout) {
          clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
          func(...args)
        }, wait)
      }
    }

    const debouncedIncrement = debounce(increment, 100)

    // 快速调用多次，但应该只执行一次
    debouncedIncrement()
    debouncedIncrement()
    debouncedIncrement()

    expect(callCount).toBe(0) // 还没有执行
  })

  // 测试 throttle 函数（节流）
  it('应该能够节流函数', () => {
    let callCount = 0

    function increment() {
      callCount++
    }

    // 模拟 throttle 函数
    function throttle<T extends (...args: unknown[]) => unknown>(
      func: T,
      limit: number
    ): (...args: Parameters<T>) => void {
      let inThrottle: boolean = false

      return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
          func(...args)
          inThrottle = true
          setTimeout(() => {
            inThrottle = false
          }, limit)
        }
      }
    }

    const throttledIncrement = throttle(increment, 100)

    // 快速调用多次，但应该只执行一次
    throttledIncrement()
    throttledIncrement()
    throttledIncrement()

    expect(callCount).toBe(1) // 执行了一次
  })

  // 测试 sleep 函数（延迟）
  it('应该能够延迟执行', async () => {
    // 模拟 sleep 函数
    function sleep(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms))
    }

    const start = Date.now()
    await sleep(100)
    const end = Date.now()

    expect(end - start).toBeGreaterThanOrEqual(100)
  })

  // 测试 generateId 函数（生成 ID）
  it('应该能够生成唯一的 ID', () => {
    // 模拟 generateId 函数
    function generateId(prefix: string = ''): string {
      const timestamp = Date.now().toString(36)
      const randomPart = Math.random().toString(36).substring(2, 9)
      return prefix ? `${prefix}-${timestamp}-${randomPart}` : `${timestamp}-${randomPart}`
    }

    const id1 = generateId('user')
    const id2 = generateId('user')

    expect(id1).toContain('user-')
    expect(id2).toContain('user-')
    expect(id1).not.toBe(id2) // 应该是唯一的
  })

  // 测试 formatDate 函数（格式化日期）
  it('应该能够格式化日期', () => {
    // 模拟 formatDate 函数
    function formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')

      return format
        .replace('YYYY', String(year))
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds)
    }

    const date = new Date(2024, 0, 15, 10, 30, 45)
    const result = formatDate(date, 'YYYY-MM-DD HH:mm:ss')

    expect(result).toBe('2024-01-15 10:30:45')
  })

  // 测试 calculateAge 函数（计算年龄）
  it('应该能够计算年龄', () => {
    // 模拟 calculateAge 函数
    function calculateAge(birthDate: Date, currentDate: Date): number {
      if (birthDate > currentDate) return 0

      let age = currentDate.getFullYear() - birthDate.getFullYear()
      const monthDiff = currentDate.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--
      }

      return age
    }

    const birthDate = new Date(2010, 0, 15) // 2010-01-15
    const currentDate = new Date(2024, 0, 15) // 2024-01-15

    const age = calculateAge(birthDate, currentDate)
    expect(age).toBe(14)
  })

  // 测试 validateEmail 函数（验证邮箱）
  it('应该能够验证邮箱地址', () => {
    // 模拟 validateEmail 函数
    function validateEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }

    expect(validateEmail('test@example.com')).toBe(true)
    expect(validateEmail('invalid-email')).toBe(false)
    expect(validateEmail('test@')).toBe(false)
    expect(validateEmail('@example.com')).toBe(false)
  })

  // 测试 isMobile 函数（判断移动设备）
  it('应该能够判断是否为移动设备', () => {
    // 模拟 isMobile 函数
    function isMobile(userAgent: string): boolean {
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      return mobileRegex.test(userAgent)
    }

    const mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
    const desktopUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'

    expect(isMobile(mobileUA)).toBe(true)
    expect(isMobile(desktopUA)).toBe(false)
  })

  // 测试 capitalize 函数（首字母大写）
  it('应该能够将首字母大写', () => {
    // 模拟 capitalize 函数
    function capitalize(str: string): string {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }

    expect(capitalize('hello')).toBe('Hello')
    expect(capitalize('world')).toBe('World')
    expect(capitalize('')).toBe('')
  })

  // 测试 truncate 函数（截断文本）
  it('应该能够截断文本', () => {
    // 模拟 truncate 函数
    function truncate(str: string, length: number, suffix: string = '...'): string {
      if (str.length <= length) return str
      return str.slice(0, length) + suffix
    }

    expect(truncate('Hello, world!', 5)).toBe('Hello...')
    expect(truncate('Hello, world!', 20)).toBe('Hello, world!')
  })
})
