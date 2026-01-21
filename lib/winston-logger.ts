/**
 * @fileoverview YYC³ AI小语智能成长守护系统 - Winston 日志系统
 * @description 提供统一的服务端日志记录接口，基于Winston实现分级日志、文件轮转和格式化输出
 * @author YYC³
 * @version 2.0.0
 * @created 2026-01-19
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogContext {
  module?: string;
  function?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  [key: string]: unknown;
}

interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  data?: unknown;
}

const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';
const isServer = typeof window === 'undefined';
const isBrowser = typeof window !== 'undefined';

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
  level: isDevelopment ? 'debug' : 'info',
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

const transports: winston.transport[] = [consoleTransport];

if (isServer && !isTest) {
  transports.push(errorFileTransport, combinedFileTransport);
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  format: customFormat,
  transports,
  exitOnError: false,
});

class WinstonLogger {
  private context: LogContext = {};

  setContext(context: Partial<LogContext>): void {
    this.context = { ...this.context, ...context };
  }

  clearContext(): void {
    this.context = {};
  }

  private log(level: LogLevel, message: string, data?: unknown, context?: LogContext): void {
    const logData: LogMessage = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: { ...this.context, ...context },
      data,
    };

    logger.log({
      level,
      message,
      ...logData.context,
      ...logData.data,
    });
  }

  error(message: string, data?: unknown, context?: LogContext): void {
    this.log('error', message, data, context);
  }

  warn(message: string, data?: unknown, context?: LogContext): void {
    this.log('warn', message, data, context);
  }

  info(message: string, data?: unknown, context?: LogContext): void {
    this.log('info', message, data, context);
  }

  debug(message: string, data?: unknown, context?: LogContext): void {
    this.log('debug', message, data, context);
  }
}

const winstonLogger = new WinstonLogger();

export const error = (message: string, data?: unknown, context?: LogContext) =>
  winstonLogger.error(message, data, context);

export const warn = (message: string, data?: unknown, context?: LogContext) =>
  winstonLogger.warn(message, data, context);

export const info = (message: string, data?: unknown, context?: LogContext) =>
  winstonLogger.info(message, data, context);

export const debug = (message: string, data?: unknown, context?: LogContext) =>
  winstonLogger.debug(message, data, context);

export const setContext = (context: Partial<LogContext>) =>
  winstonLogger.setContext(context);

export const clearContext = () => winstonLogger.clearContext();

export default winstonLogger;
