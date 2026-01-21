/**
 * YYC³ 智能预测系统 - 日志记录器（客户端版本）
 * @description 提供统一的日志记录接口，支持多级别日志输出和上下文管理
 * @author YYC³
 * @version 2.0.0
 * @created 2026-01-19
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: unknown;
}

class ClientLogger {
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

    this.logs.push(logMessage);

    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';

    switch (level) {
      case 'error':
        console.error(`${timestamp} [ERROR]${contextStr} ${message}${dataStr}`);
        break;
      case 'warn':
        console.warn(`${timestamp} [WARN]${contextStr} ${message}${dataStr}`);
        break;
      case 'info':
        console.info(`${timestamp} [INFO]${contextStr} ${message}${dataStr}`);
        break;
      case 'debug':
        console.debug(`${timestamp} [DEBUG]${contextStr} ${message}${dataStr}`);
        break;
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

const logger = new ClientLogger();

export const error = (message: string, context?: string, data?: unknown) => 
  logger.error(message, context, data);

export const warn = (message: string, context?: string, data?: unknown) => 
  logger.warn(message, context, data);

export const info = (message: string, context?: string, data?: unknown) => 
  logger.info(message, context, data);

export const debug = (message: string, context?: string, data?: unknown) => 
  logger.debug(message, context, data);

export default logger;
