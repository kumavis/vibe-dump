// node:console — the platform console, plus a Console class that writes to
// given streams (used for stderr-only loggers).
import { formatWithOptions } from './internal/inspect.js';

const g = globalThis.console;

export class Console {
  constructor(stdout, stderr, ignoreErrors) {
    const opts = stdout && typeof stdout.write !== 'function' ? stdout : { stdout, stderr, ignoreErrors };
    this._out = opts.stdout;
    this._err = opts.stderr || opts.stdout;
    this._counts = new Map();
    this._timers = new Map();
    this._indent = '';
    for (const k of Object.getOwnPropertyNames(Console.prototype)) if (k !== 'constructor') this[k] = this[k].bind(this);
  }
  _write(stream, args) { stream?.write?.(this._indent + formatWithOptions({}, ...args).replace(/\n/g, `\n${this._indent}`) + '\n'); }
  log(...a) { this._write(this._out, a); }
  info(...a) { this._write(this._out, a); }
  debug(...a) { this._write(this._out, a); }
  warn(...a) { this._write(this._err, a); }
  error(...a) { this._write(this._err, a); }
  trace(...a) { this._write(this._err, ['Trace:', ...a, '\n' + (new Error().stack || '').split('\n').slice(2).join('\n')]); }
  dir(obj, options) { this._out?.write?.(formatWithOptions(options || {}, '%O', obj) + '\n'); }
  dirxml(...a) { this.log(...a); }
  table(data) { this.log(data); }
  assert(cond, ...a) { if (!cond) this.warn('Assertion failed', ...a); }
  count(label = 'default') { const n = (this._counts.get(label) || 0) + 1; this._counts.set(label, n); this.log(`${label}: ${n}`); }
  countReset(label = 'default') { this._counts.delete(label); }
  group(...a) { if (a.length) this.log(...a); this._indent += '  '; }
  groupCollapsed(...a) { this.group(...a); }
  groupEnd() { this._indent = this._indent.slice(2); }
  time(label = 'default') { this._timers.set(label, performance.now()); }
  timeEnd(label = 'default') { this.timeLog(label); this._timers.delete(label); }
  timeLog(label = 'default', ...a) { const t = this._timers.get(label); if (t !== undefined) this.log(`${label}: ${(performance.now() - t).toFixed(3)}ms`, ...a); }
  clear() {}
  profile() {}
  profileEnd() {}
  timeStamp() {}
}

export const { log, info, debug, warn, error, trace, dir, dirxml, table, assert, count, countReset, group, groupCollapsed, groupEnd, time, timeEnd, timeLog, clear } =
  Object.fromEntries(['log', 'info', 'debug', 'warn', 'error', 'trace', 'dir', 'dirxml', 'table', 'assert', 'count', 'countReset', 'group', 'groupCollapsed', 'groupEnd', 'time', 'timeEnd', 'timeLog', 'clear']
    .map((k) => [k, (...a) => globalThis.console[k]?.(...a)]));

const consoleModule = Object.assign(Object.create(g), { Console });
export default consoleModule;
