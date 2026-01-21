'use client';

export interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  cls?: number;
  fid?: number;
  ttfb?: number;
  customMetrics?: Map<string, number>;
}

export interface PerformanceEntry {
  name: string;
  value: number;
  timestamp: number;
  type: 'web-vital' | 'custom' | 'resource' | 'navigation';
}

export interface PerformanceThresholds {
  fcp?: { good: number; needsImprovement: number; poor: number };
  lcp?: { good: number; needsImprovement: number; poor: number };
  cls?: { good: number; needsImprovement: number; poor: number };
  fid?: { good: number; needsImprovement: number; poor: number };
  ttfb?: { good: number; needsImprovement: number; poor: number };
}

export interface PerformanceReport {
  metrics: PerformanceMetrics;
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  timestamp: number;
  url: string;
}

export type PerformanceAlertLevel = 'info' | 'warning' | 'error';

export interface PerformanceAlert {
  metric: string;
  value: number;
  threshold: number;
  level: PerformanceAlertLevel;
  timestamp: number;
  message: string;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics = {};
  private entries: PerformanceEntry[] = [];
  private alerts: PerformanceAlert[] = [];
  private isMonitoring = false;
  private thresholds: PerformanceThresholds = {
    fcp: { good: 1800, needsImprovement: 3000, poor: 4000 },
    lcp: { good: 2500, needsImprovement: 4000, poor: 6000 },
    cls: { good: 0.1, needsImprovement: 0.25, poor: 0.5 },
    fid: { good: 100, needsImprovement: 300, poor: 500 },
    ttfb: { good: 800, needsImprovement: 1800, poor: 3000 },
  };
  private alertCallbacks: Map<string, (alert: PerformanceAlert) => void> = new Map();
  private reportCallbacks: Map<string, (report: PerformanceReport) => void> = new Map();
  private customMetrics: Map<string, number> = new Map();
  private reportInterval?: NodeJS.Timeout;
  private batchReports: PerformanceReport[] = [];
  private batchMode = false;
  private batchSize = 10;
  private batchTimeout = 30000;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.setupWebVitalsObserver();
    }
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private setupWebVitalsObserver(): void {
    if (typeof window === 'undefined' || !window.PerformanceObserver) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.handlePerformanceEntry(entry);
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'paint', 'navigation'] });
    } catch (error) {
      console.warn('PerformanceObserver setup failed:', error);
    }
  }

  private handlePerformanceEntry(entry: any): void {
    const timestamp = Date.now();

    switch (entry.entryType) {
      case 'largest-contentful-paint':
        this.metrics.lcp = entry.startTime;
        this.addEntry({
          name: 'LCP',
          value: entry.startTime,
          timestamp,
          type: 'web-vital',
        });
        this.checkThreshold('lcp', entry.startTime);
        break;

      case 'first-input':
        this.metrics.fid = entry.processingStart - entry.startTime;
        this.addEntry({
          name: 'FID',
          value: this.metrics.fid,
          timestamp,
          type: 'web-vital',
        });
        this.checkThreshold('fid', this.metrics.fid);
        break;

      case 'layout-shift':
        if (!entry.hadRecentInput) {
          const currentCls = this.metrics.cls || 0;
          this.metrics.cls = currentCls + entry.value;
          this.addEntry({
            name: 'CLS',
            value: this.metrics.cls || 0,
            timestamp,
            type: 'web-vital',
          });
          this.checkThreshold('cls', this.metrics.cls || 0);
        }
        break;

      case 'paint':
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
          this.addEntry({
            name: 'FCP',
            value: entry.startTime,
            timestamp,
            type: 'web-vital',
          });
          this.checkThreshold('fcp', entry.startTime);
        }
        break;

      case 'navigation':
        this.metrics.ttfb = entry.responseStart - entry.requestStart;
        this.addEntry({
          name: 'TTFB',
          value: this.metrics.ttfb,
          timestamp,
          type: 'navigation',
        });
        this.checkThreshold('ttfb', this.metrics.ttfb);
        break;
    }
  }

  private addEntry(entry: PerformanceEntry): void {
    this.entries.push(entry);
    if (this.entries.length > 1000) {
      this.entries = this.entries.slice(-500);
    }
  }

  private checkThreshold(metric: keyof PerformanceThresholds, value: number): void {
    const threshold = this.thresholds[metric];
    if (!threshold) return;

    let level: PerformanceAlertLevel = 'info';
    let message = '';

    if (value <= threshold.good) {
      level = 'info';
      message = `${metric.toUpperCase()} is good (${value.toFixed(2)}ms)`;
    } else if (value <= threshold.needsImprovement) {
      level = 'warning';
      message = `${metric.toUpperCase()} needs improvement (${value.toFixed(2)}ms)`;
    } else {
      level = 'error';
      message = `${metric.toUpperCase()} is poor (${value.toFixed(2)}ms)`;
    }

    const alert: PerformanceAlert = {
      metric,
      value,
      threshold: threshold.needsImprovement,
      level,
      timestamp: Date.now(),
      message,
    };

    this.alerts.push(alert);
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-50);
    }

    this.alertCallbacks.forEach((callback) => callback(alert));
  }

  public startMonitoring(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    console.log('Performance monitoring started');
  }

  public stopMonitoring(): void {
    if (!this.isMonitoring) return;
    this.isMonitoring = false;
    console.log('Performance monitoring stopped');
  }

  public recordCustomMetric(name: string, value: number): void {
    this.customMetrics.set(name, value);
    this.addEntry({
      name,
      value,
      timestamp: Date.now(),
      type: 'custom',
    });
  }

  public getCustomMetric(name: string): number | undefined {
    return this.customMetrics.get(name);
  }

  public getMetrics(): PerformanceMetrics {
    return {
      ...this.metrics,
      customMetrics: new Map(this.customMetrics),
    };
  }

  public getEntries(): PerformanceEntry[] {
    return [...this.entries];
  }

  public getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  public getAlertsByLevel(level: PerformanceAlertLevel): PerformanceAlert[] {
    return this.alerts.filter((alert) => alert.level === level);
  }

  public setThresholds(thresholds: PerformanceThresholds): void {
    this.thresholds = { ...this.thresholds, ...thresholds };
  }

  public getThresholds(): PerformanceThresholds {
    return { ...this.thresholds };
  }

  public onAlert(callback: (alert: PerformanceAlert) => void): () => void {
    const id = Math.random().toString(36).substr(2, 9);
    this.alertCallbacks.set(id, callback);
    return () => this.alertCallbacks.delete(id);
  }

  public onReport(callback: (report: PerformanceReport) => void): () => void {
    const id = Math.random().toString(36).substr(2, 9);
    this.reportCallbacks.set(id, callback);
    return () => this.reportCallbacks.delete(id);
  }

  public generateReport(): PerformanceReport {
    const metrics = this.getMetrics();
    const score = this.calculateScore(metrics);
    const grade = this.calculateGrade(score);

    const report: PerformanceReport = {
      metrics,
      score,
      grade,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    return report;
  }

  private calculateScore(metrics: PerformanceMetrics): number {
    let totalScore = 0;
    let count = 0;

    const scores: { [key: string]: number } = {};

    if (metrics.fcp !== undefined) {
      scores.fcp = this.calculateMetricScore('fcp', metrics.fcp);
      totalScore += scores.fcp;
      count++;
    }

    if (metrics.lcp !== undefined) {
      scores.lcp = this.calculateMetricScore('lcp', metrics.lcp);
      totalScore += scores.lcp;
      count++;
    }

    if (metrics.cls !== undefined) {
      scores.cls = this.calculateMetricScore('cls', metrics.cls);
      totalScore += scores.cls;
      count++;
    }

    if (metrics.fid !== undefined) {
      scores.fid = this.calculateMetricScore('fid', metrics.fid);
      totalScore += scores.fid;
      count++;
    }

    if (metrics.ttfb !== undefined) {
      scores.ttfb = this.calculateMetricScore('ttfb', metrics.ttfb);
      totalScore += scores.ttfb;
      count++;
    }

    return count > 0 ? Math.round(totalScore / count) : 0;
  }

  private calculateMetricScore(metric: keyof PerformanceThresholds, value: number): number {
    const threshold = this.thresholds[metric];
    if (!threshold) return 100;

    if (value <= threshold.good) return 100;
    if (value <= threshold.needsImprovement) {
      const ratio = (value - threshold.good) / (threshold.needsImprovement - threshold.good);
      return Math.round(100 - ratio * 30);
    }
    if (value <= threshold.poor) {
      const ratio = (value - threshold.needsImprovement) / (threshold.poor - threshold.needsImprovement);
      return Math.round(70 - ratio * 50);
    }
    return 0;
  }

  private calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  public enableBatchReporting(batchSize: number = 10, batchTimeout: number = 30000): void {
    this.batchMode = true;
    this.batchSize = batchSize;
    this.batchTimeout = batchTimeout;

    if (this.reportInterval) {
      clearInterval(this.reportInterval);
    }

    this.reportInterval = setInterval(() => {
      this.flushBatchReports();
    }, batchTimeout);
  }

  public disableBatchReporting(): void {
    this.batchMode = false;
    if (this.reportInterval) {
      clearInterval(this.reportInterval);
      this.reportInterval = undefined;
    }
    this.flushBatchReports();
  }

  private flushBatchReports(): void {
    if (this.batchReports.length === 0) return;

    const reports = [...this.batchReports];
    this.batchReports = [];

    reports.forEach((report) => {
      this.reportCallbacks.forEach((callback) => callback(report));
    });
  }

  public sendReport(report?: PerformanceReport): void {
    const finalReport = report || this.generateReport();

    if (this.batchMode) {
      this.batchReports.push(finalReport);
      if (this.batchReports.length >= this.batchSize) {
        this.flushBatchReports();
      }
    } else {
      this.reportCallbacks.forEach((callback) => callback(finalReport));
    }
  }

  public clearMetrics(): void {
    this.metrics = {};
    this.entries = [];
    this.alerts = [];
    this.customMetrics.clear();
  }

  public destroy(): void {
    this.stopMonitoring();
    this.disableBatchReporting();
    this.alertCallbacks.clear();
    this.reportCallbacks.clear();
    this.clearMetrics();
  }
}

export default PerformanceMonitor;
