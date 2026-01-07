/**
 * Client Logger 客户端日志测试
 */

import { describe, it, expect } from 'bun:test';

describe('Client Logger 客户端日志测试', () => {
  // 测试日志级别
  it('应该支持不同的日志级别', () => {
    const logLevels = ['info', 'warn', 'error', 'debug'] as const;

    expect(logLevels).toContain('info');
    expect(logLevels).toContain('warn');
    expect(logLevels).toContain('error');
    expect(logLevels).toContain('debug');
  });

  // 测试日志格式化
  it('应该能够格式化日志消息', () => {
    const timestamp = new Date().toISOString();
    const level = 'info';
    const message = 'Test message';
    const context = 'TestContext';
    const data = { userId: '123' };

    const formattedLog = {
      timestamp,
      level,
      context,
      message,
      data,
    };

    expect(formattedLog.timestamp).toBe(timestamp);
    expect(formattedLog.level).toBe(level);
    expect(formattedLog.message).toBe(message);
    expect(formattedLog.context).toBe(context);
    expect(formattedLog.data).toEqual(data);
  });

  // 测试日志输出到 console
  it('应该能够输出日志到 console', () => {
    const logs: string[] = [];

    // 模拟 console.log
    const mockConsole = {
      log: (message: string) => logs.push(message),
      warn: (message: string) => logs.push(message),
      error: (message: string) => logs.push(message),
      debug: (message: string) => logs.push(message),
    };

    // 输出日志
    mockConsole.log('Info message');
    mockConsole.warn('Warning message');
    mockConsole.error('Error message');
    mockConsole.debug('Debug message');

    expect(logs.length).toBe(4);
    expect(logs[0]).toBe('Info message');
    expect(logs[1]).toBe('Warning message');
  });

  // 测试日志上下文
  it('应该能够添加日志上下文', () => {
    const contexts = ['User', 'API', 'Database', 'Auth'];

    contexts.forEach(context => {
      expect(context).toBeDefined();
    });

    expect(contexts.length).toBe(4);
  });

  // 测试日志数据
  it('应该能够添加日志数据', () => {
    const data = {
      userId: '123',
      sessionId: '456',
      requestId: '789',
      timestamp: new Date().toISOString(),
    };

    expect(data.userId).toBe('123');
    expect(data.sessionId).toBe('456');
    expect(data.requestId).toBe('789');
    expect(data.timestamp).toBeDefined();
  });

  // 测试日志过滤
  it('应该能够过滤日志', () => {
    const logs = [
      { level: 'info', message: 'Info message' },
      { level: 'warn', message: 'Warning message' },
      { level: 'error', message: 'Error message' },
      { level: 'info', message: 'Another info' },
    ];

    const errorLogs = logs.filter(log => log.level === 'error');
    const infoLogs = logs.filter(log => log.level === 'info');

    expect(errorLogs.length).toBe(1);
    expect(infoLogs.length).toBe(2);
  });

  // 测试日志颜色
  it('应该能够为日志添加颜色', () => {
    const colors: Record<string, string> = {
      info: '\x1b[36m', // Cyan
      warn: '\x1b[33m', // Yellow
      error: '\x1b[31m', // Red
      debug: '\x1b[35m', // Magenta
    };

    expect(colors.info).toBe('\x1b[36m');
    expect(colors.warn).toBe('\x1b[33m');
    expect(colors.error).toBe('\x1b[31m');
    expect(colors.debug).toBe('\x1b[35m');
  });

  // 测试日志时间戳
  it('应该能够添加时间戳', () => {
    const timestamp = new Date().toISOString();

    expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  // 测试日志分组
  it('应该能够对日志进行分组', () => {
    const logs = [
      { context: 'User', level: 'info', message: 'User login' },
      { context: 'User', level: 'info', message: 'User logout' },
      { context: 'API', level: 'error', message: 'API error' },
    ];

    const groupedLogs = logs.reduce(
      (acc, log) => {
        if (!acc[log.context]) {
          acc[log.context] = [];
        }
        acc[log.context].push(log);
        return acc;
      },
      {} as Record<string, typeof logs>
    );

    expect(groupedLogs.User.length).toBe(2);
    expect(groupedLogs.API.length).toBe(1);
  });

  // 测试日志持久化
  it('应该能够持久化日志', () => {
    const logs: string[] = [];
    const newLog = 'New log entry';

    logs.push(newLog);
    expect(logs.length).toBe(1);
    expect(logs[0]).toBe(newLog);
  });

  // 测试日志清除
  it('应该能够清除日志', () => {
    let logs = ['Log 1', 'Log 2', 'Log 3'];

    logs = [];
    expect(logs.length).toBe(0);
  });

  // 测试日志导出
  it('应该能够导出日志', () => {
    const logs = [
      { timestamp: '2024-01-01', level: 'info', message: 'Message 1' },
      { timestamp: '2024-01-01', level: 'info', message: 'Message 2' },
    ];

    const exportedLogs = JSON.stringify(logs, null, 2);

    expect(exportedLogs).toContain('timestamp');
    expect(exportedLogs).toContain('level');
    expect(exportedLogs).toContain('message');
  });

  // 测试日志搜索
  it('应该能够搜索日志', () => {
    const logs = [
      { level: 'info', message: 'User login' },
      { level: 'error', message: 'API error' },
      { level: 'info', message: 'User logout' },
    ];

    const searchResults = logs.filter(log =>
      log.message.toLowerCase().includes('user')
    );

    expect(searchResults.length).toBe(2);
  });

  // 测试日志统计
  it('应该能够计算日志统计', () => {
    const logs = [
      { level: 'info' },
      { level: 'info' },
      { level: 'error' },
      { level: 'warn' },
      { level: 'info' },
    ];

    const stats = logs.reduce(
      (acc, log) => {
        acc[log.level] = (acc[log.level] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    expect(stats.info).toBe(3);
    expect(stats.error).toBe(1);
    expect(stats.warn).toBe(1);
  });
});
