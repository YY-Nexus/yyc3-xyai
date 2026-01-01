/**
 * YYC³ AI小语智能成长守护系统 - 日期格式化测试
 * 第六阶段：高级特性与生产准备
 */

import { formatDate } from '@/lib/utils'

describe('formatDate', () => {
  it('formats date correctly with default format', () => {
    const date = new Date('2024-01-01T12:30:45')
    const formatted = formatDate(date)
    expect(formatted).toBe('2024-01-01 12:30:45')
  })

  it('formats date correctly with custom format', () => {
    const date = new Date('2024-01-01T12:30:45')
    const formatted = formatDate(date, 'YYYY-MM-DD')
    expect(formatted).toBe('2024-01-01')
  })

  it('handles invalid dates', () => {
    const date = new Date('invalid')
    const formatted = formatDate(date)
    expect(formatted).toContain('NaN')
  })

  it('handles number timestamps', () => {
    const timestamp = Date.UTC(2024, 0, 1, 12, 30, 45)
    const formatted = formatDate(timestamp)
    expect(formatted).toContain('2024-01-01')
  })

  it('handles string dates', () => {
    const dateStr = '2024-01-01T12:30:45'
    const formatted = formatDate(dateStr)
    expect(formatted).toBe('2024-01-01 12:30:45')
  })
})

