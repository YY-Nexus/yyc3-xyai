/**
 * Bun 测试配置（包含覆盖率报告）
 *
 * 本文件配置 Bun 测试环境，包括：
 * - 测试文件匹配模式
 * - 排除文件和目录
 * - 测试设置文件
 * - 覆盖率配置
 */

export default {
  // 测试文件匹配模式
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
    'test/**/*.test.ts',
    'test/**/*.test.tsx',
    '*.test.ts',
    '*.test.tsx',
  ],

  // 排除的文件和目录
  exclude: [
    'node_modules',
    '.next',
    'dist',
    'build',
    'out',
    'logs',
    'from-xy-*', // 排除整合的来源文件
    '**/from-xy-*', // 排除整合的来源文件（子目录）
    '*.example.ts',
    '*.example.tsx',
    '*.bak', // 排除备份文件
    '**/*.bak', // 排除备份文件（子目录）
    '**/__tests__.backup', // 排除备份测试目录
    '**/__tests__.backup.disabled', // 排除禁用的备份测试目录
  ],

  // 测试设置文件
  preload: './bun.test.setup.ts',

  // 覆盖率配置
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // 覆盖率报告配置
  coverage: {
    reports: [
      ['text'],
      ['text-summary'],
      ['html', { directory: 'coverage/html' }],
      ['lcov', { file: 'coverage/lcov.info' }],
    ],
  },
};
