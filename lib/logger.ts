/**
 * YYC³ 智能预测系统 - 日志记录器
 */

const isDevelopment = process.env.NODE_ENV === 'development';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: unknown;
}

class Logger {
  private logs: LogMessage[] = [];

  /**
   * 记录错误日志
   */
  error(message: string, context?: string, data?: unknown): void {
    this.log('error', message, context, data);
  }

  /**
   * 记录警告日志
   */
  warn(message: string, context?: string, data?: unknown): void {
    this.log('warn', message, context, data);
  }

  /**
   * 记录信息日志
   */
  info(message: string, context?: string, data?: unknown): void {
    this.log('info', message, context, data);
  }

  /**
   * 记录调试日志
   */
  debug(message: string, context?: string, data?: unknown): void {
    this.log('debug', message, context, data);
  }

  /**
   * 内部日志方法
   */
  private log(level: LogLevel, message: string, context?: string, data?: unknown): void {
    const logMessage: LogMessage = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      data,
    };

    // 存储日志
    this.logs.push(logMessage);

    // 开发环境下输出到控制台
    if (isDevelopment) {
      const consoleMethod = level === 'error' ? 'error' : 
                          level === 'warn' ? 'warn' : 
                          level === 'info' ? 'info' : 'debug';
      console[consoleMethod](`[${level.toUpperCase()}]`, message, context, data);
    }
  }

  /**
   * 获取所有日志
   */
  getLogs(): LogMessage[] {
    return [...this.logs];
  }

  /**
   * 清空日志
   */
  clearLogs(): void {
    this.logs = [];
  }
}

// 创建单例实例
const logger = new Logger();

// 导出函数
export const error = (message: string, context?: string, data?: unknown) => 
  logger.error(message, context, data);

export const warn = (message: string, context?: string, data?: unknown) => 
  logger.warn(message, context, data);

export const info = (message: string, context?: string, data?: unknown) => 
  logger.info(message, context, data);

export const debug = (message: string, context?: string, data?: unknown) => 
  logger.debug(message, context, data);

// 导出默认实例
export default logger;
