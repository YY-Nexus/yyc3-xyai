/**
 * @fileoverview YYC³ AI小语智能成长守护系统 - 客户端日志系统
 * @description 提供统一的客户端日志记录接口，支持多级别日志输出、环境配置和localStorage存储
 * @author YYC³
 * @version 2.0.0
 * @created 2025-01-30
 * @modified 2025-01-30
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { LogLevel, LogEntry, LoggerConfig } from '@/types/logger';

class ClientLogger {
  private config: LoggerConfig;
  private storage: LogEntry[] = [];

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      level:
        config?.level ||
        (typeof window !== 'undefined' &&
        window.location?.hostname === 'localhost'
          ? LogLevel.DEBUG
          : LogLevel.INFO),
      enableConsole: config?.enableConsole ?? true,
      enableStorage: config?.enableStorage ?? false,
      storageKey: config?.storageKey || 'yyc3-logs',
      maxStorageEntries: config?.maxStorageEntries || 1000,
    };

    this.loadFromStorage();
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [
      LogLevel.ERROR,
      LogLevel.WARN,
      LogLevel.INFO,
      LogLevel.DEBUG,
      LogLevel.TRACE,
    ];
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
      localStorage.setItem(
        this.config.storageKey,
        JSON.stringify(this.storage)
      );
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

  // Public API
  error(message: string, context?: string, data?: unknown): void {
    this.log({
      level: LogLevel.ERROR,
      message,
      timestamp: new Date().toISOString(),
      context,
      data,
    });
  }

  warn(message: string, context?: string, data?: unknown): void {
    this.log({
      level: LogLevel.WARN,
      message,
      timestamp: new Date().toISOString(),
      context,
      data,
    });
  }

  info(message: string, context?: string, data?: unknown): void {
    this.log({
      level: LogLevel.INFO,
      message,
      timestamp: new Date().toISOString(),
      context,
      data,
    });
  }

  debug(message: string, context?: string, data?: unknown): void {
    this.log({
      level: LogLevel.DEBUG,
      message,
      timestamp: new Date().toISOString(),
      context,
      data,
    });
  }

  trace(message: string, context?: string, data?: unknown): void {
    this.log({
      level: LogLevel.TRACE,
      message,
      timestamp: new Date().toISOString(),
      context,
      data,
    });
  }

  // Storage Management
  getLogs(): LogEntry[] {
    return [...this.storage];
  }

  clearLogs(): void {
    this.storage = [];
    try {
      localStorage.removeItem(this.config.storageKey);
    } catch (error) {
      console.error('Failed to clear logs from storage:', error);
    }
  }

  downloadLogs(): void {
    const logString = JSON.stringify(this.storage, null, 2);
    const blob = new Blob([logString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yyc3-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Configuration
  getConfig(): LoggerConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
    this.clearLogs(); // Clear old logs when config changes
    this.loadFromStorage(); // Reload with new config
  }
}

// Create singleton instance
export const clientLogger = new ClientLogger();

// Export convenience functions
export const error = (message: string, context?: string, data?: unknown) =>
  clientLogger.error(message, context, data);

export const warn = (message: string, context?: string, data?: unknown) =>
  clientLogger.warn(message, context, data);

export const info = (message: string, context?: string, data?: unknown) =>
  clientLogger.info(message, context, data);

export const debug = (message: string, context?: string, data?: unknown) =>
  clientLogger.debug(message, context, data);

export const trace = (message: string, context?: string, data?: unknown) =>
  clientLogger.trace(message, context, data);

export default clientLogger;
