// node:timers — the platform timers wrapped in Node-style Timeout objects
// (`.unref()`, `.ref()`, `.refresh()`, `.hasRef()`, numeric coercion), which
// report B §6b found missing. boot may install these as the global timers.
import { setImmediate, clearImmediate, Immediate } from './internal/tick.js';
import * as promises from './timers/promises.js';

const g = globalThis;
const nativeSetTimeout = g.setTimeout.bind(g);
const nativeClearTimeout = g.clearTimeout.bind(g);
const nativeSetInterval = g.setInterval.bind(g);
const nativeClearInterval = g.clearInterval.bind(g);

export class Timeout {
  constructor(fn, ms, args, repeat) {
    this._onTimeout = fn;
    this._idleTimeout = ms;
    this._args = args;
    this._repeat = repeat;
    this._ref = true;
    this._start();
  }
  _start() {
    const run = () => this._onTimeout(...this._args);
    this._id = this._repeat ? nativeSetInterval(run, this._idleTimeout) : nativeSetTimeout(run, this._idleTimeout);
    // Under Node (tests) forward ref/unref to the real handle.
    if (!this._ref && this._id && typeof this._id.unref === 'function') this._id.unref();
  }
  ref() { this._ref = true; if (this._id?.ref) this._id.ref(); return this; }
  unref() { this._ref = false; if (this._id?.unref) this._id.unref(); return this; }
  hasRef() { return this._ref; }
  refresh() { this._clear(); this._start(); return this; }
  close() { this._clear(); return this; }
  _clear() { (this._repeat ? nativeClearInterval : nativeClearTimeout)(this._id); }
  [Symbol.toPrimitive]() { return typeof this._id === 'number' ? this._id : Number(this._id?.[Symbol.toPrimitive]?.() ?? 0); }
  [Symbol.dispose ?? Symbol.for('Symbol.dispose')]() { this.close(); }
}

const live = new Map(); // numeric id -> Timeout, so clearTimeout(Number(t)) works

export function setTimeout(fn, ms = 0, ...args) {
  const t = new Timeout(fn, ms, args, false);
  live.set(+t, t);
  const orig = t._onTimeout;
  t._onTimeout = (...a) => { live.delete(+t); return orig(...a); };
  return t;
}

export function setInterval(fn, ms = 0, ...args) {
  const t = new Timeout(fn, ms, args, true);
  live.set(+t, t);
  return t;
}

function clear(t) {
  if (t == null) return;
  if (t instanceof Timeout) { live.delete(+t); t.close(); return; }
  const found = live.get(Number(t));
  if (found) { live.delete(Number(t)); found.close(); return; }
  nativeClearTimeout(t);
}
export const clearTimeout = clear;
export const clearInterval = clear;
export { setImmediate, clearImmediate, Immediate };

export function active(t) { t?.refresh?.(); }
export function unenroll(t) { clear(t); }
export function enroll() {}

export { promises };

const timers = {
  setTimeout, setInterval, setImmediate, clearTimeout, clearInterval, clearImmediate,
  Timeout, Immediate, active, unenroll, enroll, promises,
};
export default timers;
