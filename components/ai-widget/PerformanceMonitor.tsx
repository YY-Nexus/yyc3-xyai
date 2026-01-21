/**
 * @file PerformanceMonitor.tsx
 * @description YYC³ AI小语智能成长守护系统 - AI服务性能监控组件，显示AI服务的健康状态和性能指标
 * @module components/ai-widget
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-19
 * @updated 2026-01-19
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Activity, Cpu, HardDrive, Clock, Zap, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { HealthStatus, ServiceMetrics, AIServiceAdapter } from '@/services/ai/AIServiceAdapter';

interface PerformanceMonitorProps {
  aiService: AIServiceAdapter;
  autoRefresh?: boolean;
  refreshInterval?: number;
  onRefresh?: () => void;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  aiService,
  autoRefresh = true,
  refreshInterval = 5000,
  onRefresh,
}) => {
  const [metrics, setMetrics] = useState<ServiceMetrics | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      const [metricsData, healthData] = await Promise.all([
        aiService.getMetrics(),
        aiService.healthCheck(),
      ]);
      setMetrics(metricsData);
      setHealth(healthData);
      setLastUpdate(new Date());
      onRefresh?.();
    } catch (error) {
      console.error('加载性能指标失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();

    let intervalId: NodeJS.Timeout | null = null;

    if (autoRefresh) {
      intervalId = setInterval(loadMetrics, refreshInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [aiService, autoRefresh, refreshInterval]);

  const getHealthColor = (status: HealthStatus['status']): string => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'unhealthy':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getHealthText = (status: HealthStatus['status']): string => {
    switch (status) {
      case 'healthy':
        return '健康';
      case 'degraded':
        return '降级';
      case 'unhealthy':
        return '异常';
      default:
        return '未知';
    }
  };

  const formatResponseTime = (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatUptime = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}秒`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}分钟`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)}小时`;
    return `${Math.round(seconds / 86400)}天`;
  };

  if (!metrics || !health) {
    return (
      <Card className="performance-monitor">
        <CardContent className="flex items-center justify-center py-6">
          <div className="text-center">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">加载中...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const successRate =
    metrics.total_requests > 0
      ? ((metrics.successful_requests / metrics.total_requests) * 100).toFixed(1)
      : '0.0';

  return (
    <Card className="performance-monitor">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">性能监控</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadMetrics}
            disabled={isLoading}
            className="h-7 w-7 p-0"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 健康状态 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">服务状态:</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`${getHealthColor(health.status)} text-white`}
            >
              {getHealthText(health.status)}
            </Badge>
            {lastUpdate && (
              <span className="text-xs text-gray-400">
                {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* 响应时间 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">平均响应时间:</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {formatResponseTime(health.response_time.avg)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-gray-500">P95:</span>
              <span className="font-medium text-gray-700">
                {formatResponseTime(health.response_time.p95)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500">P99:</span>
              <span className="font-medium text-gray-700">
                {formatResponseTime(health.response_time.p99)}
              </span>
            </div>
          </div>
        </div>

        {/* GPU利用率 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">GPU利用率:</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {metrics.gpu_utilization}%
            </span>
          </div>
          <Progress
            value={metrics.gpu_utilization}
            className="h-2"
          />
        </div>

        {/* 内存使用 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">内存使用:</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {metrics.memory_usage}%
            </span>
          </div>
          <Progress
            value={metrics.memory_usage}
            className="h-2"
          />
        </div>

        {/* 请求统计 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">请求统计:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-gray-500">总请求数:</span>
              <span className="font-medium text-gray-700">
                {metrics.total_requests}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500">成功请求:</span>
              <span className="font-medium text-gray-700">
                {metrics.successful_requests}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500">失败请求:</span>
              <span className="font-medium text-gray-700">
                {metrics.failed_requests}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500">成功率:</span>
              <span className="font-medium text-gray-700">
                {successRate}%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500">QPS:</span>
              <span className="font-medium text-gray-700">
                {metrics.requests_per_minute}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500">模型加载:</span>
              <span className="font-medium text-gray-700">
                {formatResponseTime(metrics.model_load_time)}
              </span>
            </div>
          </div>
        </div>

        {/* 已加载模型 */}
        {health.models_loaded.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-700">已加载模型:</span>
              <Badge variant="secondary" className="text-xs">
                {health.models_loaded.length}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1">
              {health.models_loaded.slice(0, 3).map(model => (
                <Badge key={model} variant="outline" className="text-xs">
                  {model.split(':')[0]}
                </Badge>
              ))}
              {health.models_loaded.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{health.models_loaded.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* GPU可用性 */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">GPU可用:</span>
          <Badge
            variant={health.gpu_available ? 'default' : 'secondary'}
            className="text-xs"
          >
            {health.gpu_available ? '是' : '否'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMonitor;
