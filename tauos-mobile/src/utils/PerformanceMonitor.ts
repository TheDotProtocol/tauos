// Simple Performance Monitor for React Native
// Note: React Native doesn't have PerformanceObserver, so we use a simpler approach

export class TauPerformanceMonitor {
  private static instance: TauPerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private timers: Map<string, number> = new Map();

  static getInstance(): TauPerformanceMonitor {
    if (!TauPerformanceMonitor.instance) {
      TauPerformanceMonitor.instance = new TauPerformanceMonitor();
    }
    return TauPerformanceMonitor.instance;
  }

  startTimer(label: string): () => void {
    const startTime = Date.now();
    this.timers.set(label, startTime);
    
    return () => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      this.recordMetric(label, duration);
    };
  }

  recordMetric(label: string, value: number) {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)!.push(value);
  }

  getAverageMetric(label: string): number {
    const values = this.metrics.get(label);
    if (!values || values.length === 0) {
      return 0;
    }
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  getMetrics(): Map<string, number[]> {
    return new Map(this.metrics);
  }

  clearMetrics() {
    this.metrics.clear();
    this.timers.clear();
  }

  // Performance monitoring methods
  measureFunction<T>(label: string, fn: () => T): T {
    const stopTimer = this.startTimer(label);
    try {
      const result = fn();
      return result;
    } finally {
      stopTimer();
    }
  }

  async measureAsyncFunction<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const stopTimer = this.startTimer(label);
    try {
      const result = await fn();
      return result;
    } finally {
      stopTimer();
    }
  }

  // Memory usage estimation (simplified)
  getMemoryUsage(): { used: number; total: number } {
    // This is a simplified estimation
    // In a real app, you'd use platform-specific APIs
    return {
      used: Math.random() * 100, // MB
      total: 1024, // MB
    };
  }

  // Performance report
  generateReport(): string {
    const report = ['Performance Report:', ''];
    
    for (const [label, values] of this.metrics) {
      const avg = this.getAverageMetric(label);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const count = values.length;
      
      report.push(`${label}:`);
      report.push(`  Average: ${avg.toFixed(2)}ms`);
      report.push(`  Min: ${min.toFixed(2)}ms`);
      report.push(`  Max: ${max.toFixed(2)}ms`);
      report.push(`  Count: ${count}`);
      report.push('');
    }
    
    return report.join('\n');
  }
}

export default TauPerformanceMonitor;
