/**
 * @fileoverview Winston日志系统测试脚本
 * @description 验证Winston日志系统的实际运行效果
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-19
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import winstonLogger, { error, warn, info, debug, setContext, clearContext } from '../lib/winston-logger.js';

console.log('🚀 开始测试Winston日志系统...\n');

async function testWinstonLogger() {
  console.log('📋 测试1: 基础日志级别');
  error('这是一条错误日志', { code: 'TEST_ERROR_001', details: '测试错误处理' });
  warn('这是一条警告日志', { warningCode: 'TEST_WARN_001' });
  info('这是一条信息日志', { userId: 'test-user-123', action: 'test_action' });
  debug('这是一条调试日志', { debugInfo: '调试信息' });

  console.log('\n📋 测试2: 带上下文的日志');
  setContext({ module: 'TestModule', function: 'testFunction' });
  info('使用上下文记录日志', { testData: 'context test' });
  error('带上下文的错误日志', { errorId: 'CTX_ERROR_001' });
  clearContext();

  console.log('\n📋 测试3: 不同模块的日志');
  setContext({ module: 'UserService', function: 'getUserById' });
  info('获取用户信息', { userId: '123' });
  error('用户未找到', { userId: '123' });
  clearContext();

  setContext({ module: 'APIGateway', function: 'handleRequest' });
  info('处理请求', { method: 'GET', path: '/api/users/123' });
  warn('请求响应时间过长', { duration: 5000, threshold: 3000 });
  clearContext();

  console.log('\n📋 测试4: 复杂数据结构的日志');
  const complexData = {
    user: {
      id: '123',
      name: '测试用户',
      preferences: {
        theme: 'dark',
        language: 'zh-CN'
      }
    },
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: 'req-123456',
      sessionId: 'sess-789012'
    }
  };
  info('复杂数据结构日志', complexData);

  console.log('\n📋 测试5: 错误堆栈跟踪');
  try {
    throw new Error('测试错误');
  } catch (err) {
    error('捕获到异常', err, { module: 'ErrorTest' });
  }

  console.log('\n📋 测试6: 性能日志');
  const startTime = Date.now();
  await new Promise(resolve => setTimeout(resolve, 100));
  const duration = Date.now() - startTime;
  info('操作完成', { operation: 'test_operation', duration, unit: 'ms' });

  console.log('\n📋 测试7: 批量日志');
  for (let i = 0; i < 5; i++) {
    info(`批量日志 ${i + 1}`, { batchId: 'batch-001', index: i });
  }

  console.log('\n📋 测试8: 日志级别过滤');
  debug('这条调试日志应该显示');
  info('这条信息日志应该显示');
  warn('这条警告日志应该显示');
  error('这条错误日志应该显示');

  console.log('\n✅ Winston日志系统测试完成！');
  console.log('📁 请检查 logs/ 目录下的日志文件');
  console.log('   - error-YYYY-MM-DD.log (错误日志)');
  console.log('   - combined-YYYY-MM-DD.log (综合日志)');
}

testWinstonLogger().catch(err => {
  console.error('❌ 测试失败:', err);
  process.exit(1);
});
