/**
 * @fileoverview YYC³ 日志分析工具
 * @description 提供日志文件分析、统计和告警功能
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-19
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface LogEntry {
  timestamp: string;
  level: string;
  module?: string;
  function?: string;
  message: string;
  data?: Record<string, unknown>;
}

interface LogStats {
  totalEntries: number;
  errorCount: number;
  warnCount: number;
  infoCount: number;
  debugCount: number;
  errorRate: number;
  topErrors: Array<{ message: string; count: number }>;
  topModules: Array<{ module: string; count: number }>;
  timeRange: { start: string; end: string };
}

interface AlertRule {
  name: string;
  condition: (stats: LogStats) => boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
}

interface Alert {
  ruleName: string;
  severity: string;
  message: string;
  timestamp: string;
}

export class LogAnalyzer {
  private logDir: string;
  private alertRules: AlertRule[] = [];

  constructor(logDir: string = 'logs') {
    this.logDir = logDir;
    this.setupDefaultAlertRules();
  }

  private setupDefaultAlertRules(): void {
    this.alertRules = [
      {
        name: '高错误率告警',
        condition: (stats) => stats.errorRate > 0.1,
        severity: 'critical',
        message: `错误率过高: ${(stats.errorRate * 100).toFixed(2)}% (>10%)`,
      },
      {
        name: '错误数量告警',
        condition: (stats) => stats.errorCount > 50,
        severity: 'high',
        message: `错误数量过多: ${stats.errorCount} (>50)`,
      },
      {
        name: '警告数量告警',
        condition: (stats) => stats.warnCount > 100,
        severity: 'medium',
        message: `警告数量过多: ${stats.warnCount} (>100)`,
      },
      {
        name: '单错误重复告警',
        condition: (stats) => stats.topErrors[0]?.count > 10,
        severity: 'high',
        message: `单个错误重复次数过多: "${stats.topErrors[0]?.message}" (${stats.topErrors[0]?.count}次)`,
      },
    ];
  }

  addAlertRule(rule: AlertRule): void {
    this.alertRules.push(rule);
  }

  removeAlertRule(ruleName: string): void {
    this.alertRules = this.alertRules.filter((rule) => rule.name !== ruleName);
  }

  getAlertRules(): AlertRule[] {
    return [...this.alertRules];
  }

  private parseLogLine(line: string): LogEntry | null {
    const logRegex = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}) \[(ERROR|WARN|INFO|DEBUG)\](?: \[([^\]]+)\])?(?: \[([^\]]+)\])? (.+)$/;
    const match = line.match(logRegex);

    if (!match) {
      return null;
    }

    const [, timestamp, level, module, func, message] = match;

    let data: Record<string, unknown> | undefined;
    const dataMatch = message.match(/^(.+) (\{.+\})$/);
    if (dataMatch) {
      try {
        data = JSON.parse(dataMatch[2]);
        message = dataMatch[1];
      } catch {
        // JSON解析失败，保持原样
      }
    }

    return {
      timestamp,
      level,
      module,
      function: func,
      message: message.trim(),
      data,
    };
  }

  private readLogFile(filename: string): LogEntry[] {
    const filepath = join(this.logDir, filename);
    const content = readFileSync(filepath, 'utf-8');
    const lines = content.split('\n').filter((line) => line.trim());

    return lines
      .map((line) => this.parseLogLine(line))
      .filter((entry): entry is LogEntry => entry !== null);
  }

  private getLogFiles(): string[] {
    try {
      const files = readdirSync(this.logDir);
      return files.filter((file) => file.endsWith('.log'));
    } catch {
      return [];
    }
  }

  analyzeCombinedLog(): LogStats {
    const logFiles = this.getLogFiles();
    const combinedLogFiles = logFiles.filter((file) => file.startsWith('combined-'));

    if (combinedLogFiles.length === 0) {
      return this.getEmptyStats();
    }

    const latestLogFile = combinedLogFiles
      .map((file) => ({
        file,
        mtime: statSync(join(this.logDir, file)).mtime.getTime(),
      }))
      .sort((a, b) => b.mtime - a.mtime)[0]?.file;

    if (!latestLogFile) {
      return this.getEmptyStats();
    }

    const entries = this.readLogFile(latestLogFile);
    return this.calculateStats(entries);
  }

  analyzeErrorLog(): LogStats {
    const logFiles = this.getLogFiles();
    const errorLogFiles = logFiles.filter((file) => file.startsWith('error-'));

    if (errorLogFiles.length === 0) {
      return this.getEmptyStats();
    }

    const latestLogFile = errorLogFiles
      .map((file) => ({
        file,
        mtime: statSync(join(this.logDir, file)).mtime.getTime(),
      }))
      .sort((a, b) => b.mtime - a.mtime)[0]?.file;

    if (!latestLogFile) {
      return this.getEmptyStats();
    }

    const entries = this.readLogFile(latestLogFile);
    return this.calculateStats(entries);
  }

  private calculateStats(entries: LogEntry[]): LogStats {
    if (entries.length === 0) {
      return this.getEmptyStats();
    }

    const errorCount = entries.filter((e) => e.level === 'ERROR').length;
    const warnCount = entries.filter((e) => e.level === 'WARN').length;
    const infoCount = entries.filter((e) => e.level === 'INFO').length;
    const debugCount = entries.filter((e) => e.level === 'DEBUG').length;

    const errorMessages = entries
      .filter((e) => e.level === 'ERROR')
      .map((e) => e.message);

    const errorCounts = new Map<string, number>();
    errorMessages.forEach((msg) => {
      errorCounts.set(msg, (errorCounts.get(msg) || 0) + 1);
    });

    const topErrors = Array.from(errorCounts.entries())
      .map(([message, count]) => ({ message, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const modules = entries
      .filter((e) => e.module)
      .map((e) => e.module!);

    const moduleCounts = new Map<string, number>();
    modules.forEach((mod) => {
      moduleCounts.set(mod, (moduleCounts.get(mod) || 0) + 1);
    });

    const topModules = Array.from(moduleCounts.entries())
      .map(([module, count]) => ({ module, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalEntries: entries.length,
      errorCount,
      warnCount,
      infoCount,
      debugCount,
      errorRate: errorCount / entries.length,
      topErrors,
      topModules,
      timeRange: {
        start: entries[0]?.timestamp || '',
        end: entries[entries.length - 1]?.timestamp || '',
      },
    };
  }

  private getEmptyStats(): LogStats {
    return {
      totalEntries: 0,
      errorCount: 0,
      warnCount: 0,
      infoCount: 0,
      debugCount: 0,
      errorRate: 0,
      topErrors: [],
      topModules: [],
      timeRange: { start: '', end: '' },
    };
  }

  checkAlerts(stats: LogStats): Alert[] {
    const alerts: Alert[] = [];

    for (const rule of this.alertRules) {
      if (rule.condition(stats)) {
        alerts.push({
          ruleName: rule.name,
          severity: rule.severity,
          message: rule.message,
          timestamp: new Date().toISOString(),
        });
      }
    }

    return alerts.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity as keyof typeof severityOrder] -
             severityOrder[b.severity as keyof typeof severityOrder];
    });
  }

  generateReport(stats: LogStats, alerts: Alert[]): string {
    const lines: string[] = [];

    lines.push('='.repeat(60));
    lines.push('📊 YYC³ 日志分析报告');
    lines.push('='.repeat(60));
    lines.push('');

    lines.push('📈 统计信息');
    lines.push('-'.repeat(40));
    lines.push(`总日志条目: ${stats.totalEntries}`);
    lines.push(`错误数量: ${stats.errorCount}`);
    lines.push(`警告数量: ${stats.warnCount}`);
    lines.push(`信息数量: ${stats.infoCount}`);
    lines.push(`调试数量: ${stats.debugCount}`);
    lines.push(`错误率: ${(stats.errorRate * 100).toFixed(2)}%`);
    lines.push('');

    lines.push('⏰ 时间范围');
    lines.push('-'.repeat(40));
    lines.push(`开始时间: ${stats.timeRange.start}`);
    lines.push(`结束时间: ${stats.timeRange.end}`);
    lines.push('');

    if (stats.topErrors.length > 0) {
      lines.push('🔥 高频错误 (Top 5)');
      lines.push('-'.repeat(40));
      stats.topErrors.forEach((error, index) => {
        lines.push(`${index + 1}. ${error.message} (${error.count}次)`);
      });
      lines.push('');
    }

    if (stats.topModules.length > 0) {
      lines.push('📦 高频模块 (Top 5)');
      lines.push('-'.repeat(40));
      stats.topModules.forEach((mod, index) => {
        lines.push(`${index + 1}. ${mod.module} (${mod.count}次)`);
      });
      lines.push('');
    }

    if (alerts.length > 0) {
      lines.push('🚨 告警信息');
      lines.push('-'.repeat(40));
      alerts.forEach((alert, index) => {
        const severityIcon = {
          critical: '🔴',
          high: '🟠',
          medium: '🟡',
          low: '🟢',
        }[alert.severity];
        lines.push(`${index + 1}. ${severityIcon} [${alert.severity.toUpperCase()}] ${alert.message}`);
        lines.push(`   规则: ${alert.ruleName}`);
        lines.push(`   时间: ${alert.timestamp}`);
      });
      lines.push('');
    } else {
      lines.push('✅ 无告警');
      lines.push('');
    }

    lines.push('='.repeat(60));
    lines.push(`报告生成时间: ${new Date().toISOString()}`);
    lines.push('='.repeat(60));

    return lines.join('\n');
  }

  analyzeAndReport(): { stats: LogStats; alerts: Alert[]; report: string } {
    const stats = this.analyzeCombinedLog();
    const alerts = this.checkAlerts(stats);
    const report = this.generateReport(stats, alerts);

    return { stats, alerts, report };
  }
}

export default LogAnalyzer;
