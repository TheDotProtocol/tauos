import { NextRequest, NextResponse } from 'next/server';

// In-memory metrics store (in production, use Redis or similar)
const metrics = {
  requests: new Map<string, number>(),
  errors: new Map<string, number>(),
  responseTimes: new Map<string, number[]>(),
  lastUpdate: Date.now()
};

export function trackMetrics(app: string, endpoint: string, responseTime: number, statusCode: number) {
  const key = `${app}-${endpoint}`;
  
  // Track requests
  const currentRequests = metrics.requests.get(app) || 0;
  metrics.requests.set(app, currentRequests + 1);
  
  // Track errors
  if (statusCode >= 400) {
    const currentErrors = metrics.errors.get(app) || 0;
    metrics.errors.set(app, currentErrors + 1);
  }
  
  // Track response times
  const currentTimes = metrics.responseTimes.get(app) || [];
  currentTimes.push(responseTime);
  // Keep only last 100 response times
  if (currentTimes.length > 100) {
    currentTimes.shift();
  }
  metrics.responseTimes.set(app, currentTimes);
  
  metrics.lastUpdate = Date.now();
}

export function getMetrics() {
  return metrics;
}

export function calculateAverageResponseTime(app: string): number {
  const times = metrics.responseTimes.get(app) || [];
  if (times.length === 0) return 0;
  return times.reduce((a, b) => a + b, 0) / times.length;
}
