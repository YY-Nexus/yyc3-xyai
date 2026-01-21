/**
 * @fileoverview Winston日志系统测试脚本
 * @description 验证Winston日志系统的实际运行效果
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-19
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logDir = process.env.LOG_DIR || 'logs';

const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, module, function: func, ...metadata }) => {
    let msg = `${timestamp} [${level.toUpperCase()}]`;
    
    if (module) {
      msg += ` [${module}]`;
    }
    
    if (func) {
      msg += ` [${func}]`;
    }
    
    msg += ` ${message}`;
    
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    
    return msg;
  })
);

const consoleTransport = new winston.transports.Console({
  level: 'debug',
  format: winston.format.combine(
    winston.format.colorize(),
    customFormat
  ),
});

const errorFileTransport = new DailyRotateFile({
  filename: `${logDir}/error-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: '20m',
  maxFiles: '30d',
  format: customFormat,
});

const combinedFileTransport = new DailyRotateFile({
  filename: `${logDir}/combined-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: customFormat,
});

const logger = winston.createLogger({
  level: 'debug',
  format: customFormat,
  transports: [consoleTransport, errorFileTransport, combinedFileTransport],
  exitOnError: false,
});

console.log('🚀 开始测试Winston日志系统...\n');

function testWinstonLogger() {
  console.log('📋 测试1: 基础日志级别');
  logger.error('这是一条错误日志', { code: 'TEST_ERROR_001', details: '测试错误处理' });
  logger.warn('这是一条警告日志', { warningCode: 'TEST_WARN_001' });
  logger.info('这是一条信息日志', { userId: 'test-user-123', action: 'test_action' });
  logger.debug('这是一条调试日志', { debugInfo: '调试信息' });

  console.log('\n📋 测试2: 带上下文的日志');
  logger.info('使用上下文记录日志', { module: 'TestModule', function: 'testFunction', testData: 'context test' });
  logger.error('带上下文的错误日志', { module: 'TestModule', function: 'testFunction', errorId: 'CTX_ERROR_001' });

  console.log('\n📋 测试3: 不同模块的日志');
  logger.info('获取用户信息', { module: 'UserService', function: 'getUserById', userId: '123' });
  logger.error('用户未找到', { module: 'UserService', function: 'getUserById', userId: '123' });
  logger.info('处理请求', { module: 'APIGateway', function: 'handleRequest', method: 'GET', path: '/api/users/123' });
  logger.warn('请求响应时间过长', { module: 'APIGateway', function: 'handleRequest', duration: 5000, threshold: 3000 });

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
  logger.info('复杂数据结构日志', complexData);

  console.log('\n📋 测试5: 错误堆栈跟踪');
  try {
    throw new Error('测试错误');
  } catch (err) {
    logger.error('捕获到异常', { module: 'ErrorTest', error: err.message, stack: err.stack });
  }

  console.log('\n📋 测试6: 性能日志');
  const startTime = Date.now();
  setTimeout(() => {
    const duration = Date.now() - startTime;
    logger.info('操作完成', { operation: 'test_operation', duration, unit: 'ms' });

    console.log('\n📋 测试7: 批量日志');
    for (let i = 0; i < 5; i++) {
      logger.info(`批量日志 ${i + 1}`, { batchId: 'batch-001', index: i });
    }

    console.log('\n📋 测试8: 日志级别过滤');
    logger.debug('这条调试日志应该显示');
    logger.info('这条信息日志应该显示');
    logger.warn('这条警告日志应该显示');
    logger.error('这条错误日志应该显示');

    console.log('\n✅ Winston日志系统测试完成！');
    console.log('📁 请检查 logs/ 目录下的日志文件');
    console.log('   - error-YYYY-MM-DD.log (错误日志)');
    console.log('   - combined-YYYY-MM-DD.log (综合日志)');
  }, 100);
}

testWinstonLogger();
