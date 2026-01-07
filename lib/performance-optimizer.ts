/**
 * YYC³-XY-05 性能优化配置
 * 为新复制的功能模块提供性能优化策略
 */

// 动态导入配置 - 按需加载大型模块
export const dynamicImports = {
  // AI引擎相关 - 只在需要时加载
  emotionEngine: () => import('./ai/emotion-engine'),
  agenticCore: () => import('../core/AgenticCore'),

  // 预测引擎 - 按需加载
  predictionEngines: () => import('./prediction/adaptive-ensemble'),

  // 分析组件 - 路由级别加载
  intelligentInsights: () =>
    import('../components/analytics/IntelligentInsightsPanel'),
};

// Web Worker 配置 - 将CPU密集型任务移到Worker线程
export const workerConfig = {
  emotionAnalysis: '/workers/emotion-analysis.worker.ts',
  prediction: '/workers/prediction.worker.ts',
  dataProcessing: '/workers/data-processing.worker.ts',
};

// 缓存策略配置
export const cacheStrategy = {
  // 情感识别结果缓存 (TTL: 5分钟)
  emotionCache: {
    ttl: 5 * 60 * 1000,
    maxSize: 100,
  },

  // AI模型预测缓存 (TTL: 10分钟)
  predictionCache: {
    ttl: 10 * 60 * 1000,
    maxSize: 50,
  },

  // UI配置缓存 (TTL: 1小时)
  uiConfigCache: {
    ttl: 60 * 60 * 1000,
    maxSize: 10,
  },
};

// 代码分割点
export const codeSplitPoints = {
  // 页面级别分割
  pages: {
    analytics: () => import('../app/analytics/page'),
    aiChat: () => import('../app/ai-chat/page'),
    growth: () => import('../app/growth/page'),
  },

  // 功能模块分割
  features: {
    voiceInteraction: () => import('../components/VoiceInteraction'),
    qVersionCharacter: () =>
      import('../components/ui/EnhancedQVersionCharacter'),
  },
};

// 懒加载阈值
export const lazyLoadThresholds = {
  // 组件懒加载 - 距离视口超过500px时加载
  componentOffset: 500,

  // 图片懒加载 - 距离视口超过200px时加载
  imageOffset: 200,

  // 数据预加载 - 用户悬停200ms后加载
  hoverDelay: 200,
};

// 资源优先级配置
export const resourcePriority = {
  // 关键资源 - 立即加载
  critical: ['/core/AgenticCore.ts', '/lib/db/client.ts'],

  // 高优先级 - 页面加载后立即加载
  high: [
    '/lib/ai/emotion-engine.ts',
    '/components/theme/BirthdayThemeProvider.tsx',
  ],

  // 中优先级 - 用户交互后加载
  medium: [
    '/lib/prediction/adaptive-ensemble.ts',
    '/services/learning/MetaLearningSystem.ts',
  ],

  // 低优先级 - 空闲时加载
  low: [
    '/components/analytics/IntelligentInsightsPanel.tsx',
    '/services/tools/ToolManager.ts',
  ],
};

// 性能监控指标
export const performanceMetrics = {
  // 首次内容绘制 (FCP) - 目标 < 1.8s
  firstContentfulPaint: 1800,

  // 最大内容绘制 (LCP) - 目标 < 2.5s
  largestContentfulPaint: 2500,

  // 首次输入延迟 (FID) - 目标 < 100ms
  firstInputDelay: 100,

  // 累积布局偏移 (CLS) - 目标 < 0.1
  cumulativeLayoutShift: 0.1,

  // 首次字节时间 (TTFB) - 目标 < 600ms
  timeToFirstByte: 600,
};

// 内存优化配置
export const memoryOptimization = {
  // 限制缓存大小
  maxCacheSize: 50 * 1024 * 1024, // 50MB

  // 定期清理间隔
  cleanupInterval: 5 * 60 * 1000, // 5分钟

  // 内存压力阈值
  memoryPressureThreshold: 0.8, // 80%
};

// 预加载策略
export const preloadStrategy = {
  // DNS预解析
  dnsPrefetch: ['https://api.openai.com', 'https://cdn.jsdelivr.net'],

  // 预连接
  preconnect: ['https://api.openai.com'],

  // 预加载关键字体
  prefetchFonts: ['/fonts/Inter-Regular.woff2', '/fonts/Inter-Bold.woff2'],
};

export default {
  dynamicImports,
  workerConfig,
  cacheStrategy,
  codeSplitPoints,
  lazyLoadThresholds,
  resourcePriority,
  performanceMetrics,
  memoryOptimization,
  preloadStrategy,
};
