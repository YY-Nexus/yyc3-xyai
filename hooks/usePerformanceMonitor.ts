'use client';

import { useEffect, useState, useCallback } from 'react';
import PerformanceMonitor, {
  PerformanceMetrics,
  PerformanceReport,
  PerformanceAlert,
  PerformanceThresholds,
  PerformanceAlertLevel,
} from '@/lib/PerformanceMonitor';

export const usePerformanceMonitor = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [report, setReport] = useState<PerformanceReport | null>(null);

  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance();

    const unsubscribeAlert = monitor.onAlert((alert) => {
      setAlerts((prev) => [...prev.slice(-9), alert]);
    });

    const unsubscribeReport = monitor.onReport((newReport) => {
      setReport(newReport);
    });

    return () => {
      unsubscribeAlert();
      unsubscribeReport();
    };
  }, []);

  const startMonitoring = useCallback(() => {
    const monitor = PerformanceMonitor.getInstance();
    monitor.startMonitoring();
    setIsMonitoring(true);
  }, []);

  const stopMonitoring = useCallback(() => {
    const monitor = PerformanceMonitor.getInstance();
    monitor.stopMonitoring();
    setIsMonitoring(false);
  }, []);

  const recordCustomMetric = useCallback((name: string, value: number) => {
    const monitor = PerformanceMonitor.getInstance();
    monitor.recordCustomMetric(name, value);
    updateMetrics();
  }, []);

  const getCustomMetric = useCallback((name: string) => {
    const monitor = PerformanceMonitor.getInstance();
    return monitor.getCustomMetric(name);
  }, []);

  const updateMetrics = useCallback(() => {
    const monitor = PerformanceMonitor.getInstance();
    setMetrics(monitor.getMetrics());
  }, []);

  const generateReport = useCallback(() => {
    const monitor = PerformanceMonitor.getInstance();
    const newReport = monitor.generateReport();
    setReport(newReport);
    return newReport;
  }, []);

  const sendReport = useCallback(() => {
    const monitor = PerformanceMonitor.getInstance();
    monitor.sendReport();
  }, []);

  const setThresholds = useCallback((thresholds: PerformanceThresholds) => {
    const monitor = PerformanceMonitor.getInstance();
    monitor.setThresholds(thresholds);
  }, []);

  const getThresholds = useCallback(() => {
    const monitor = PerformanceMonitor.getInstance();
    return monitor.getThresholds();
  }, []);

  const getAlertsByLevel = useCallback((level: PerformanceAlertLevel) => {
    const monitor = PerformanceMonitor.getInstance();
    return monitor.getAlertsByLevel(level);
  }, []);

  const clearMetrics = useCallback(() => {
    const monitor = PerformanceMonitor.getInstance();
    monitor.clearMetrics();
    setMetrics({});
    setAlerts([]);
    setReport(null);
  }, []);

  const enableBatchReporting = useCallback((batchSize?: number, batchTimeout?: number) => {
    const monitor = PerformanceMonitor.getInstance();
    monitor.enableBatchReporting(batchSize, batchTimeout);
  }, []);

  const disableBatchReporting = useCallback(() => {
    const monitor = PerformanceMonitor.getInstance();
    monitor.disableBatchReporting();
  }, []);

  return {
    isMonitoring,
    metrics,
    alerts,
    report,
    startMonitoring,
    stopMonitoring,
    recordCustomMetric,
    getCustomMetric,
    updateMetrics,
    generateReport,
    sendReport,
    setThresholds,
    getThresholds,
    getAlertsByLevel,
    clearMetrics,
    enableBatchReporting,
    disableBatchReporting,
  };
};

export default usePerformanceMonitor;
