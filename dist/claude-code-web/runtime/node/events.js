// node:events — @jspm/core's EventEmitter (events@3) plus the Node >= 15 statics
// it lacks (report B §6b: `setMaxListeners` was a link-time failure).
//
// jspm's own stream module imports the same ../jspm/events.js instance, so the
// statics attached here are visible to every emitter in the runtime.
import EE from '../jspm/events.js';
import { abortError } from './internal/errors.js';

export const EventEmitter = EE;

export const errorMonitor = Symbol('events.errorMonitor');
export const captureRejectionSymbol = Symbol.for('nodejs.rejection');
const kMaxListeners = Symbol('events.maxListeners');

function isEventTarget(t) {
  return t && typeof t.addEventListener === 'function' && typeof t.on !== 'function';
}

// setMaxListeners(n) changes the default; setMaxListeners(n, ...targets) sets
// it on specific emitters/EventTargets (AbortSignal is the common target).
export function setMaxListeners(n = EventEmitter.defaultMaxListeners, ...targets) {
  if (targets.length === 0) {
    EventEmitter.defaultMaxListeners = n;
    return;
  }
  for (const t of targets) {
    if (t && typeof t.setMaxListeners === 'function') t.setMaxListeners(n);
    else if (t) t[kMaxListeners] = n;
  }
}

export function getMaxListeners(target) {
  if (target && typeof target.getMaxListeners === 'function') return target.getMaxListeners();
  return target?.[kMaxListeners] ?? EventEmitter.defaultMaxListeners;
}

export function getEventListeners(target, name) {
  if (target && typeof target.listeners === 'function') return target.listeners(name);
  return []; // EventTarget listeners cannot be enumerated in a browser
}

export function listenerCount(emitter, name) {
  return typeof emitter.listenerCount === 'function' ? emitter.listenerCount(name) : 0;
}

function listen(target, name, fn, onceOnly) {
  if (isEventTarget(target)) {
    target.addEventListener(name, fn, { once: onceOnly });
    return () => target.removeEventListener(name, fn);
  }
  if (onceOnly) target.once(name, fn);
  else target.on(name, fn);
  return () => target.removeListener(name, fn);
}

// events.once(emitter, name, { signal }) -> Promise<args[]>
export function once(emitter, name, options = {}) {
  const { signal } = options;
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(abortError(signal));
    const cleanups = [];
    const done = () => cleanups.splice(0).forEach((f) => f());
    cleanups.push(listen(emitter, name, (...args) => { done(); resolve(args); }, true));
    if (name !== 'error' && !isEventTarget(emitter)) {
      cleanups.push(listen(emitter, 'error', (err) => { done(); reject(err); }, true));
    }
    if (signal) {
      const onAbort = () => { done(); reject(abortError(signal)); };
      signal.addEventListener('abort', onAbort, { once: true });
      cleanups.push(() => signal.removeEventListener('abort', onAbort));
    }
  });
}

// events.on(emitter, name, { signal, close }) -> AsyncIterator<args[]>
export function on(emitter, name, options = {}) {
  const { signal, close = [] } = options;
  const values = [];
  const waiters = [];
  let error = null;
  let finished = false;
  const cleanups = [];
  const finish = () => {
    if (finished) return;
    finished = true;
    cleanups.splice(0).forEach((f) => f());
    for (const w of waiters.splice(0)) w.resolve({ value: undefined, done: true });
  };
  const fail = (err) => {
    const w = waiters.shift();
    if (w) w.reject(err); else error = err;
    finish();
  };
  cleanups.push(listen(emitter, name, (...args) => {
    const w = waiters.shift();
    if (w) w.resolve({ value: args, done: false }); else values.push(args);
  }, false));
  if (name !== 'error' && !isEventTarget(emitter)) cleanups.push(listen(emitter, 'error', fail, false));
  for (const c of close) cleanups.push(listen(emitter, c, finish, false));
  if (signal) {
    if (signal.aborted) fail(abortError(signal));
    const onAbort = () => fail(abortError(signal));
    signal.addEventListener('abort', onAbort, { once: true });
    cleanups.push(() => signal.removeEventListener('abort', onAbort));
  }
  return {
    next() {
      if (values.length) return Promise.resolve({ value: values.shift(), done: false });
      if (error) { const e = error; error = null; return Promise.reject(e); }
      if (finished) return Promise.resolve({ value: undefined, done: true });
      return new Promise((resolve, reject) => waiters.push({ resolve, reject }));
    },
    return() { finish(); return Promise.resolve({ value: undefined, done: true }); },
    throw(err) { fail(err); return Promise.reject(err); },
    [Symbol.asyncIterator]() { return this; },
  };
}

export function addAbortListener(signal, listener) {
  if (signal.aborted) queueMicrotask(() => listener());
  else signal.addEventListener('abort', listener, { once: true });
  const dispose = () => signal.removeEventListener('abort', listener);
  return { [Symbol.dispose ?? Symbol.for('Symbol.dispose')]: dispose, dispose };
}

export class EventEmitterAsyncResource extends EventEmitter {
  get asyncResource() { return this; }
  get asyncId() { return 1; }
  get triggerAsyncId() { return 0; }
  emitDestroy() {}
}

export const usingDomains = false;
export const init = EventEmitter.init;
export let defaultMaxListeners = EventEmitter.defaultMaxListeners;

Object.assign(EventEmitter, {
  EventEmitter,
  once,
  on,
  setMaxListeners,
  getMaxListeners,
  getEventListeners,
  listenerCount,
  addAbortListener,
  errorMonitor,
  captureRejectionSymbol,
  captureRejections: false,
  EventEmitterAsyncResource,
  usingDomains,
});

export default EventEmitter;
