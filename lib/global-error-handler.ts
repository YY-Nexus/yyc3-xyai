/**
 * 全局错误处理器
 * @description 提供统一的错误处理和报告机制
 * @author YYC³
 * @version 2.0.0
 * @created 2026-01-19
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { error } from './logger';

export function reportError(
  error: Error,
  context?: Record<string, unknown>
): void {
  error(error.message, 'GlobalErrorHandler', context);
}

export class ErrorHandler {
  static handle(error: Error, context?: Record<string, unknown>): void {
    reportError(error, context);
  }
}
