// node:async_hooks — browsers have no async context propagation (the TC39
// AsyncContext proposal has not shipped), so AsyncLocalStorage here is
// synchronous: run()/getStore() round-trip for the synchronous part of the
// callback, and the previous store is restored when run() returns. Code that
// reads the store after an `await` sees the outer store (usually undefined),
// which is how the bundle behaves with its own no-op fallback.
export class AsyncLocalStorage {
  constructor() { this._store = undefined; this._enabled = true; }
  static bind(fn) { return fn; }
  static snapshot() { return (fn, ...args) => fn(...args); }
  getStore() { return this._enabled ? this._store : undefined; }
  run(store, fn, ...args) {
    const prev = this._store;
    this._store = store;
    this._enabled = true;
    try { return fn(...args); } finally { this._store = prev; }
  }
  exit(fn, ...args) {
    const prev = this._store;
    this._store = undefined;
    try { return fn(...args); } finally { this._store = prev; }
  }
  enterWith(store) { this._store = store; this._enabled = true; }
  disable() { this._enabled = false; this._store = undefined; }
  get name() { return ''; }
}

export class AsyncResource {
  constructor(type = 'AsyncResource') { this.type = type; }
  static bind(fn, type, thisArg) { return thisArg === undefined ? fn : fn.bind(thisArg); }
  bind(fn, thisArg) { return thisArg === undefined ? fn : fn.bind(thisArg); }
  runInAsyncScope(fn, thisArg, ...args) { return fn.apply(thisArg, args); }
  emitDestroy() { return this; }
  asyncId() { return 1; }
  triggerAsyncId() { return 0; }
}

export const createHook = () => ({ enable() { return this; }, disable() { return this; } });
export const executionAsyncId = () => 1;
export const triggerAsyncId = () => 0;
export const executionAsyncResource = () => ({});
export const asyncWrapProviders = Object.freeze({ NONE: 0 });

export default {
  AsyncLocalStorage, AsyncResource, createHook, executionAsyncId, triggerAsyncId,
  executionAsyncResource, asyncWrapProviders,
};
