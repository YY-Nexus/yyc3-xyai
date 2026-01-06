/**
 * 全局错误处理器
 */

export function reportError(error: Error, context?: Record<string, unknown>): void {
  console.error('[Error]', error.message, context);
}

export class ErrorHandler {
  static handle(error: Error, context?: Record<string, unknown>): void {
    reportError(error, context);
  }
}
