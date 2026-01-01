/**
 * @fileoverview YYC³ AI小语智能成长守护系统 - 前端日志系统
 * @description 提供统一的日志记录接口，支持多级别日志输出和环境配置
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-01-30
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { LogLevel, LogEntry, LoggerConfig } from '@/types/logger';

class Logger {
  private config: LoggerConfig;
  private storage: LogEntry[] = [];

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      level: config?.level || (process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG),
      enableConsole: config?.enableConsole ?? true,
      enableStorage: config?.enableStorage ?? false,
      storageKey: config?.storageKey || 'yyc3-logs',
      maxStorageEntries: config?.maxStorageEntries || 1000
    };

    this.loadFromStorage();
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG, LogLevel.TRACE];
    return levels.indexOf(level) <= levels.indexOf(this.config.level);
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp;
    const level = entry.level.toUpperCase().padEnd(5);
    const context = entry.context ? `[${entry.context}] ` : '';
    return `${timestamp} ${level} ${context}${entry.message}`;
  }

  private log(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) {
      return;
    }

    const formattedMessage = this.formatMessage(entry);

    if (this.config.enableConsole) {
      switch (entry.level) {
        case LogLevel.ERROR:
          console.error(formattedMessage, entry.data);
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage, entry.data);
          break;
        case LogLevel.INFO:
          console.info(formattedMessage, entry.data);
          break;
        case LogLevel.DEBUG:
          console.debug(formattedMessage, entry.data);
          break;
        case LogLevel.TRACE:
          console.trace(formattedMessage, entry.data);
          break;
      }
    }

    if (this.config.enableStorage) {
      this.addToStorage(entry);
    }
  }

  private addToStorage(entry: LogEntry): void {
    this.storage.push(entry);

    if (this.storage.length > this.config.maxStorageEntries) {
      this.storage.shift();
    }

    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(this.storage));
    } catch (error) {
      console.error('Failed to save logs to storage:', error);
    }
  }

  private loadFromStorage(): void {
    if (!this.config.enableStorage) {
      return;
    }

    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (stored) {
        this.storage = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load logs from storage:', error);
    }
  }

  public error(message: string, data?: any, context?: string): void {
    this.log({
      level: LogLevel.ERROR,
      message,
      timestamp: new Date().toISOString(),
      context,
      data
    });
  }

  public warn(message: string, data?: any, context?: string): void {
    this.log({
      level: LogLevel.WARN,
      message,
      timestamp: new Date().toISOString(),
      context,
      data
    });
  }

  public info(message: string, data?: any, context?: string): void {
    this.log({
      level: LogLevel.INFO,
      message,
      timestamp: new Date().toISOString(),
      context,
      data
    });
  }

  public debug(message: string, data?: any, context?: string): void {
    this.log({
      level: LogLevel.DEBUG,
      message,
      timestamp: new Date().toISOString(),
      context,
      data
    });
  }

  public trace(message: string, data?: any, context?: string): void {
    this.log({
      level: LogLevel.TRACE,
      message,
      timestamp: new Date().toISOString(),
      context,
      data
    });
  }

  public performance(operation: string, duration: number, data?: any, context?: string): void {
    this.log({
      level: LogLevel.INFO,
      message: `Performance: ${operation} completed in ${duration}ms`,
      timestamp: new Date().toISOString(),
      context,
      data: { ...data, duration }
    });
  }

  public security(event: string, data?: any, context?: string): void {
    this.log({
      level: LogLevel.WARN,
      message: `Security: ${event}`,
      timestamp: new Date().toISOString(),
      context,
      data
    });
  }

  public business(action: string, userId?: string, data?: any, context?: string): void {
    this.log({
      level: LogLevel.INFO,
      message: `Business: ${action}`,
      timestamp: new Date().toISOString(),
      context,
      data: { ...data, userId }
    });
  }

  public getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.storage.filter(entry => entry.level === level);
    }
    return [...this.storage];
  }

  public clearLogs(): void {
    this.storage = [];
    try {
      localStorage.removeItem(this.config.storageKey);
    } catch (error) {
      console.error('Failed to clear logs from storage:', error);
    }
  }

  public setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  public getConfig(): LoggerConfig {
    return { ...this.config };
  }
}

const logger = new Logger();

export default logger;
