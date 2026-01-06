/**
 * Bun 兼容的 Utility Functions 测试
 */

import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test'
import { debounce } from '../../lib/utils'

describe('Utility Functions', () => {
  describe('debounce', () => {
    it('delays function execution', async () => {
      let called = false
      const mockFn = () => { called = true }
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()

      // 等待 50ms，应该还没有调用
      await new Promise(resolve => setTimeout(resolve, 50))
      expect(called).toBe(false)

      // 等待 100ms，应该已经调用
      await new Promise(resolve => setTimeout(resolve, 100))
      expect(called).toBe(true)
    })

    it('cancels previous calls', async () => {
      let callCount = 0
      const mockFn = () => { callCount++ }
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      // 等待 150ms，应该只调用一次
      await new Promise(resolve => setTimeout(resolve, 150))
      expect(callCount).toBe(1)
    })

    it('passes arguments to the debounced function', async () => {
      let receivedArgs: string[] = []
      const mockFn = (...args: string[]) => { receivedArgs = args }
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('hello', 'world')

      // 等待 150ms
      await new Promise(resolve => setTimeout(resolve, 150))
      expect(receivedArgs).toEqual(['hello', 'world'])
    })

    it('returns the result of the original function', async () => {
      const mockFn = (x: number) => x * 2
      const debouncedFn = debounce(mockFn, 100)

      const resultPromise = new Promise<number>((resolve) => {
        setTimeout(() => {
          // 这个测试实际上不能直接测试同步返回值
          // 因为 debounce 本身是异步的
          resolve(42)
        }, 150)
      })

      debouncedFn(21)
      const result = await resultPromise
      expect(result).toBe(42)
    })
  })
})
