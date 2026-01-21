/**
 * @fileoverview 日志分析工具测试脚本
 * @description 测试日志分析工具和告警机制
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-19
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import LogAnalyzer from '../lib/log-analyzer.js';

console.log('🚀 开始测试日志分析工具...\n');

const analyzer = new LogAnalyzer('logs');

console.log('📋 测试1: 分析综合日志');
const { stats, alerts, report } = analyzer.analyzeAndReport();

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
