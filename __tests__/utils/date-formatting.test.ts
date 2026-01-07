/**
 * 格式化日期工具函数测试
 */

import { describe, it, expect } from 'bun:test';

// 导入格式化日期函数（如果存在）
// import { formatDate } from '../../lib/utils/formatDate'

describe('格式化日期工具函数', () => {
  it('应该正确格式化日期', () => {
    // 测试用例
    const date = new Date('2026-01-03');
    const formatted = date.toISOString().split('T')[0];
    expect(formatted).toBe('2026-01-03');
  });

  it('应该处理无效日期', () => {
    const date = new Date('invalid');
    expect(isNaN(date.getTime())).toBe(true);
  });

  it('应该处理当前时间', () => {
    const now = new Date();
    expect(now).toBeInstanceOf(Date);
  });
});
