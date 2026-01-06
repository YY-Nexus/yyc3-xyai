/**
 * Bun 测试配置（性能优化）
 *
 * 本文件配置 Bun 测试环境，包括：
 * - 并行测试
 * - 测试超时
 * - 测试重试
 * - 性能优化
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
    'from-xy-*',
    '**/from-xy-*',
    '*.example.ts',
    '*.example.tsx',
    '*.bak',
    '**/*.bak',
    '**/__tests__.backup',
    '**/__tests__.backup.disabled',
  ],

  // 测试超时（毫秒）
  testTimeout: 10000,

  // 并行测试
  concurrency: 4,

  // 测试设置文件
  preload: './bun.test.setup.ts',

  // 测试重试
  retry: 1,

  // 性能监控
  performance: {
    enabled: true,
    threshold: 1000, // 毫秒
  },

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
}
