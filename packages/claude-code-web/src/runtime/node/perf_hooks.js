// node:perf_hooks — the platform `performance`, plus the Node-only helpers.
const g = globalThis;

class Histogram {
  constructor() { this.reset(); }
  reset() { this.min = 9223372036854776000; this.max = 0; this.mean = NaN; this.stddev = NaN; this.count = 0; this.exceeds = 0; this.percentiles = new Map(); this._values = []; }
  percentile(p) {
    if (!this._values.length) return 0;
    const s = [...this._values].sort((a, b) => a - b);
    return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))];
  }
  record(v) {
    const n = Number(v);
    this._values.push(n);
    this.count++;
    this.min = Math.min(this.min, n);
    this.max = Math.max(this.max, n);
    this.mean = this._values.reduce((a, b) => a + b, 0) / this.count;
  }
  recordDelta() {}
  add(other) { for (const v of other._values || []) this.record(v); }
  get minBigInt() { return BigInt(Math.floor(this.min)); }
  get maxBigInt() { return BigInt(Math.floor(this.max)); }
  get countBigInt() { return BigInt(this.count); }
}
class IntervalHistogram extends Histogram {
  enable() { return true; }
  disable() { return true; }
}

export const monitorEventLoopDelay = () => new IntervalHistogram();
export const createHistogram = () => new Histogram();

const base = g.performance;
export const performance = base;
if (base && !base.eventLoopUtilization) {
  try {
    Object.defineProperty(base, 'eventLoopUtilization', { value: () => ({ idle: 0, active: 0, utilization: 0 }), configurable: true });
    Object.defineProperty(base, 'timerify', { value: (fn) => fn, configurable: true });
  } catch { /* frozen performance object */ }
}

export const PerformanceObserver = g.PerformanceObserver || class PerformanceObserver {
  constructor(cb) { this._cb = cb; }
  observe() {}
  disconnect() {}
  takeRecords() { return []; }
  static get supportedEntryTypes() { return []; }
};
export const PerformanceEntry = g.PerformanceEntry || class {};
export const PerformanceMark = g.PerformanceMark || class {};
export const PerformanceMeasure = g.PerformanceMeasure || class {};
export const PerformanceObserverEntryList = g.PerformanceObserverEntryList || class {};
export const PerformanceResourceTiming = g.PerformanceResourceTiming || class {};
export const constants = { NODE_PERFORMANCE_GC_MAJOR: 4, NODE_PERFORMANCE_GC_MINOR: 1, NODE_PERFORMANCE_GC_INCREMENTAL: 8, NODE_PERFORMANCE_GC_WEAKCB: 16, NODE_PERFORMANCE_GC_FLAGS_NO: 0, NODE_PERFORMANCE_GC_FLAGS_FORCED: 4 };

export default {
  performance, monitorEventLoopDelay, createHistogram, PerformanceObserver, PerformanceEntry,
  PerformanceMark, PerformanceMeasure, PerformanceObserverEntryList, PerformanceResourceTiming, constants,
};
