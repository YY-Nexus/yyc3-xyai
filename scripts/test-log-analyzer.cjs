/**
 * @fileoverview 日志分析工具测试脚本
 * @description 测试日志分析工具和告警机制
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-19
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

const { readFileSync, readdirSync, statSync } = require('fs');
const { join } = require('path');

const logDir = 'logs';

function parseLogLine(line) {
  const logRegex = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}) \[(ERROR|WARN|INFO|DEBUG)\](?: \[([^\]]+)\])?(?: \[([^\]]+)\])? (.+)$/;
  const match = line.match(logRegex);

  if (!match) {
    return null;
  }

  const [, timestamp, level, module, func, message] = match;

  let data = undefined;
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

function readLogFile(filename) {
  const filepath = join(logDir, filename);
  const content = readFileSync(filepath, 'utf-8');
  const lines = content.split('\n').filter((line) => line.trim());

  return lines
    .map((line) => parseLogLine(line))
    .filter((entry) => entry !== null);
}

function getLogFiles() {
  try {
    const files = readdirSync(logDir);
    return files.filter((file) => file.endsWith('.log'));
  } catch {
    return [];
  }
}

function analyzeCombinedLog() {
  const logFiles = getLogFiles();
  const combinedLogFiles = logFiles.filter((file) => file.startsWith('combined-'));

  if (combinedLogFiles.length === 0) {
    return getEmptyStats();
  }

  const latestLogFile = combinedLogFiles
    .map((file) => ({
      file,
      mtime: statSync(join(logDir, file)).mtime.getTime(),
    }))
    .sort((a, b) => b.mtime - a.mtime)[0]?.file;

  if (!latestLogFile) {
    return getEmptyStats();
  }

  const entries = readLogFile(latestLogFile);
  return calculateStats(entries);
}

function calculateStats(entries) {
  if (entries.length === 0) {
    return getEmptyStats();
  }

  const errorCount = entries.filter((e) => e.level === 'ERROR').length;
  const warnCount = entries.filter((e) => e.level === 'WARN').length;
  const infoCount = entries.filter((e) => e.level === 'INFO').length;
  const debugCount = entries.filter((e) => e.level === 'DEBUG').length;

  const errorMessages = entries
    .filter((e) => e.level === 'ERROR')
    .map((e) => e.message);

  const errorCounts = new Map();
  errorMessages.forEach((msg) => {
    errorCounts.set(msg, (errorCounts.get(msg) || 0) + 1);
  });

  const topErrors = Array.from(errorCounts.entries())
    .map(([message, count]) => ({ message, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const modules = entries
    .filter((e) => e.module)
    .map((e) => e.module);

  const moduleCounts = new Map();
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

function getEmptyStats() {
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

function checkAlerts(stats) {
  const alerts = [];

  if (stats.errorRate > 0.1) {
    alerts.push({
      ruleName: '高错误率告警',
      severity: 'critical',
      message: `错误率过高: ${(stats.errorRate * 100).toFixed(2)}% (>10%)`,
      timestamp: new Date().toISOString(),
    });
  }

  if (stats.errorCount > 50) {
    alerts.push({
      ruleName: '错误数量告警',
      severity: 'high',
      message: `错误数量过多: ${stats.errorCount} (>50)`,
      timestamp: new Date().toISOString(),
    });
  }

  if (stats.warnCount > 100) {
    alerts.push({
      ruleName: '警告数量告警',
      severity: 'medium',
      message: `警告数量过多: ${stats.warnCount} (>100)`,
      timestamp: new Date().toISOString(),
    });
  }

  if (stats.topErrors[0]?.count > 10) {
    alerts.push({
      ruleName: '单错误重复告警',
      severity: 'high',
      message: `单个错误重复次数过多: "${stats.topErrors[0]?.message}" (${stats.topErrors[0]?.count}次)`,
      timestamp: new Date().toISOString(),
    });
  }

  return alerts.sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

function generateReport(stats, alerts) {
  const lines = [];

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

console.log('🚀 开始测试日志分析工具...\n');

const stats = analyzeCombinedLog();
const alerts = checkAlerts(stats);
const report = generateReport(stats, alerts);

console.log('\n📊 统计结果:');
console.log(`   总日志条目: ${stats.totalEntries}`);
console.log(`   错误数量: ${stats.errorCount}`);
console.log(`   警告数量: ${stats.warnCount}`);
console.log(`   信息数量: ${stats.infoCount}`);
console.log(`   调试数量: ${stats.debugCount}`);
console.log(`   错误率: ${(stats.errorRate * 100).toFixed(2)}%`);

console.log('\n🔥 高频错误:');
stats.topErrors.forEach((error, index) => {
  console.log(`   ${index + 1}. ${error.message} (${error.count}次)`);
});

console.log('\n📦 高频模块:');
stats.topModules.forEach((mod, index) => {
  console.log(`   ${index + 1}. ${mod.module} (${mod.count}次)`);
});

console.log('\n🚨 告警信息:');
if (alerts.length > 0) {
  alerts.forEach((alert, index) => {
    const severityIcon = {
      critical: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🟢',
    }[alert.severity];
    console.log(`   ${index + 1}. ${severityIcon} [${alert.severity.toUpperCase()}] ${alert.message}`);
  });
} else {
  console.log('   ✅ 无告警');
}

console.log('\n📄 完整报告:');
console.log(report);

console.log('\n✅ 日志分析工具测试完成！');
