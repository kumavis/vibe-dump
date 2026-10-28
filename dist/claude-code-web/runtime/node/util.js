// node:util — own implementation (inspect/format in ./internal/inspect.js);
// adds what jspm's browserify util lacks: isDeepStrictEqual, full `types`,
// stripVTControlCharacters, getSystemErrorName, styleText, aborted.
import types from './util/types.js';
import { inspect, format, formatWithOptions } from './internal/inspect.js';
import { ERRNO } from './internal/errors.js';

export { inspect, format, formatWithOptions, types };

const kCustomPromisify = Symbol.for('nodejs.util.promisify.custom');

export function promisify(original) {
  if (typeof original !== 'function') throw new TypeError('The "original" argument must be of type function');
  if (original[kCustomPromisify]) {
    const fn = original[kCustomPromisify];
    return Object.defineProperty(fn, kCustomPromisify, { value: fn, enumerable: false, configurable: true });
  }
  function fn(...args) {
    return new Promise((resolve, reject) => {
      original.call(this, ...args, (err, ...values) => {
        if (err) reject(err);
        else resolve(values.length > 1 ? values : values[0]);
      });
    });
  }
  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
  Object.defineProperty(fn, kCustomPromisify, { value: fn, enumerable: false, configurable: true });
  return Object.defineProperties(fn, Object.getOwnPropertyDescriptors(original));
}
promisify.custom = kCustomPromisify;

export function callbackify(original) {
  return function (...args) {
    const cb = args.pop();
    original.apply(this, args).then(
      (v) => queueMicrotask(() => cb(null, v)),
      (err) => queueMicrotask(() => cb(err || Object.assign(new Error('Promise was rejected with a falsy value'), { reason: err }))),
    );
  };
}

export function inherits(ctor, superCtor) {
  Object.defineProperty(ctor, 'super_', { value: superCtor, writable: true, configurable: true });
  Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
}

const warned = new Set();
export function deprecate(fn, msg, code) {
  return function (...args) {
    if (!warned.has(code || msg)) {
      warned.add(code || msg);
      globalThis.process?.emitWarning?.(msg, 'DeprecationWarning', code);
    }
    return new.target ? Reflect.construct(fn, args, new.target) : fn.apply(this, args);
  };
}

// debuglog('x') prints only when NODE_DEBUG lists x.
export function debuglog(section, cb) {
  let enabled;
  const logger = (...args) => {
    if (enabled === undefined) {
      const env = String(globalThis.process?.env?.NODE_DEBUG || '');
      enabled = env.split(/[\s,]+/).some((s) => s && new RegExp('^' + s.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$', 'i').test(section));
      if (cb) cb(logger);
    }
    if (enabled) console.error(`${section.toUpperCase()} ${format(...args)}`);
  };
  Object.defineProperty(logger, 'enabled', { get: () => (enabled ?? false) });
  return logger;
}
export const debug = debuglog;

// ECMA-48 CSI/OSC sequences, same pattern Node uses.
const ansiRe = /[\u001B\u009B][[\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\d/#&.:=?%@~_]+)*|[a-zA-Z\d]+(?:;[-a-zA-Z\d/#&.:=?%@~_]*)*)?\u0007)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-ntqry=><~]))/g;
export function stripVTControlCharacters(str) {
  return String(str).replace(ansiRe, '');
}

const errnoNames = new Map(Object.entries(ERRNO).map(([k, v]) => [v, k]));
export function getSystemErrorName(errno) {
  return errnoNames.get(errno) || `Unknown system error ${errno}`;
}
export function getSystemErrorMap() {
  return new Map([...errnoNames].map(([n, name]) => [n, [name, name.toLowerCase()]]));
}
export function getSystemErrorMessage(errno) {
  return getSystemErrorName(errno);
}

export function toUSVString(s) {
  return String(s).toWellFormed ? String(s).toWellFormed() : String(s).replace(/[\uD800-\uDFFF]/g, '�');
}

const STYLE_CODES = {
  reset: [0, 0], bold: [1, 22], dim: [2, 22], italic: [3, 23], underline: [4, 24], inverse: [7, 27],
  hidden: [8, 28], strikethrough: [9, 29], black: [30, 39], red: [31, 39], green: [32, 39],
  yellow: [33, 39], blue: [34, 39], magenta: [35, 39], cyan: [36, 39], white: [37, 39],
  gray: [90, 39], grey: [90, 39],
};
export function styleText(format, text) {
  const list = Array.isArray(format) ? format : [format];
  let out = String(text);
  for (const f of list) {
    const c = STYLE_CODES[f];
    if (c) out = `\x1b[${c[0]}m${out}\x1b[${c[1]}m`;
  }
  return out;
}

export function aborted(signal, resource) {
  return new Promise((resolve) => {
    if (signal.aborted) return resolve();
    signal.addEventListener('abort', () => resolve(), { once: true });
  });
}

export function transferableAbortSignal(signal) { return signal; }
export function transferableAbortController() { return new AbortController(); }

// --- deep equality (assert.deepStrictEqual semantics) ---------------------
function keysOf(o) {
  return [...Object.keys(o), ...Object.getOwnPropertySymbols(o).filter((s) => Object.prototype.propertyIsEnumerable.call(o, s))];
}

function deepEq(a, b, strict, memo) {
  if (Object.is(a, b)) return true;
  if (!strict && a == b && (typeof a !== 'object' || a === null) && (typeof b !== 'object' || b === null)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;
  const ta = Object.prototype.toString.call(a);
  if (ta !== Object.prototype.toString.call(b)) return false;
  if (memo.get(a) === b) return true;
  memo.set(a, b);

  if (a instanceof Date) { if (a.getTime() !== b.getTime()) return false; }
  else if (a instanceof RegExp) { if (String(a) !== String(b) || a.lastIndex !== b.lastIndex) return false; }
  else if (a instanceof Error) { if (a.name !== b.name || a.message !== b.message) return false; }
  else if (types.isBoxedPrimitive(a)) { if (!Object.is(a.valueOf(), b.valueOf())) return false; }
  else if (ArrayBuffer.isView(a) || a instanceof ArrayBuffer) {
    const ua = new Uint8Array(a.buffer ?? a, a.byteOffset ?? 0, a.byteLength);
    const ub = new Uint8Array(b.buffer ?? b, b.byteOffset ?? 0, b.byteLength);
    if (ua.length !== ub.length) return false;
    for (let i = 0; i < ua.length; i++) if (ua[i] !== ub[i]) return false;
    if (!ArrayBuffer.isView(a)) return true;
  } else if (a instanceof Map) {
    if (a.size !== b.size) return false;
    outer: for (const [k, v] of a) {
      if (b.has(k)) { if (!deepEq(v, b.get(k), strict, memo)) return false; continue; }
      if (typeof k !== 'object' || k === null) return false;
      for (const [k2, v2] of b) if (deepEq(k, k2, strict, memo) && deepEq(v, v2, strict, memo)) continue outer;
      return false;
    }
  } else if (a instanceof Set) {
    if (a.size !== b.size) return false;
    outer: for (const v of a) {
      if (b.has(v)) continue;
      if (typeof v !== 'object' || v === null) return false;
      for (const v2 of b) if (deepEq(v, v2, strict, memo)) continue outer;
      return false;
    }
  }
  if (Array.isArray(a) && a.length !== b.length) return false;
  const ka = keysOf(a);
  const kb = keysOf(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) {
    if (!Object.prototype.propertyIsEnumerable.call(b, k)) return false;
    if (!deepEq(a[k], b[k], strict, memo)) return false;
  }
  return true;
}

export function isDeepStrictEqual(a, b) {
  return deepEq(a, b, true, new Map());
}
export function isDeepEqual(a, b) {
  return deepEq(a, b, false, new Map());
}

// Legacy predicates (still exported by Node).
export const isArray = Array.isArray;
export const isBoolean = (v) => typeof v === 'boolean';
export const isBuffer = (v) => !!v && v._isBuffer === true;
export const isDate = (v) => types.isDate(v);
export const isError = (v) => types.isNativeError(v);
export const isFunction = (v) => typeof v === 'function';
export const isNull = (v) => v === null;
export const isNullOrUndefined = (v) => v == null;
export const isNumber = (v) => typeof v === 'number';
export const isObject = (v) => v !== null && typeof v === 'object';
export const isPrimitive = (v) => v === null || (typeof v !== 'object' && typeof v !== 'function');
export const isRegExp = (v) => types.isRegExp(v);
export const isString = (v) => typeof v === 'string';
export const isSymbol = (v) => typeof v === 'symbol';
export const isUndefined = (v) => v === undefined;
export const _extend = (target, source) => Object.assign(target, source);
export function log(...args) { console.log(`${new Date().toISOString()} - ${format(...args)}`); }

export const TextEncoder = globalThis.TextEncoder;
export const TextDecoder = globalThis.TextDecoder;

const util = {
  inspect, format, formatWithOptions, types, promisify, callbackify, inherits, deprecate,
  debuglog, debug, stripVTControlCharacters, getSystemErrorName, getSystemErrorMap,
  getSystemErrorMessage, toUSVString, styleText, aborted, transferableAbortSignal,
  transferableAbortController, isDeepStrictEqual, isArray, isBoolean, isBuffer, isDate, isError,
  isFunction, isNull, isNullOrUndefined, isNumber, isObject, isPrimitive, isRegExp, isString,
  isSymbol, isUndefined, _extend, log, TextEncoder, TextDecoder,
};
export default util;
