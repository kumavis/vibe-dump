// node:module — createRequire() returns a synchronous require that serves Node
// built-ins from the shim registry (process.getBuiltinModule, wired by
// ./index.js) and everything else through boot.js's globalThis.__bunRequire
// (the pre-imported chunk registry). Unknown ids throw MODULE_NOT_FOUND.
import { BUILTINS } from './BUILTINS.js';
import { fileURLToPath } from './url.js';
import { posix as path } from './path.js';

const NODE_BUILTINS = [
  '_http_agent', '_http_client', '_http_common', '_http_incoming', '_http_outgoing', '_http_server',
  '_stream_duplex', '_stream_passthrough', '_stream_readable', '_stream_transform', '_stream_wrap',
  '_stream_writable', '_tls_common', '_tls_wrap', 'assert', 'assert/strict', 'async_hooks', 'buffer',
  'child_process', 'cluster', 'console', 'constants', 'crypto', 'dgram', 'diagnostics_channel', 'dns',
  'dns/promises', 'domain', 'events', 'fs', 'fs/promises', 'http', 'http2', 'https', 'inspector',
  'inspector/promises', 'module', 'net', 'os', 'path', 'path/posix', 'path/win32', 'perf_hooks',
  'process', 'punycode', 'querystring', 'readline', 'readline/promises', 'repl', 'stream',
  'stream/consumers', 'stream/promises', 'stream/web', 'string_decoder', 'sys', 'timers',
  'timers/promises', 'tls', 'trace_events', 'tty', 'url', 'util', 'util/types', 'v8', 'vm', 'wasi',
  'worker_threads', 'zlib',
];
export const builtinModules = [...NODE_BUILTINS];

const shimmed = new Set(BUILTINS);
export function isBuiltin(id) {
  const s = String(id);
  return s.startsWith('node:') ? NODE_BUILTINS.includes(s.slice(5)) || s.slice(5).startsWith('test') || s === 'node:sqlite' : NODE_BUILTINS.includes(s);
}

function notFound(id, from) {
  const err = new Error(`Cannot find module '${id}'${from ? `\nRequire stack:\n- ${from}` : ''}`);
  err.code = 'MODULE_NOT_FOUND';
  err.requireStack = from ? [from] : [];
  return err;
}

export function createRequire(from) {
  const fromPath = typeof from === 'string' && from.startsWith('file:') ? fileURLToPath(from) : String(from?.href ?? from ?? '/');
  const base = path.dirname(fromPath);
  const resolve = (id) => {
    const s = String(id);
    if (isBuiltin(s)) return s;
    if (s.startsWith('./') || s.startsWith('../')) return path.join(base, s);
    return s;
  };
  function require(id) {
    const s = String(id);
    const bare = s.replace(/^node:/, '');
    if (isBuiltin(s)) {
      const mod = shimmed.has(bare) ? globalThis.process?.getBuiltinModule?.(bare) : undefined;
      if (mod !== undefined) return mod;
      throw notFound(s, fromPath);
    }
    const target = resolve(s);
    if (typeof globalThis.__bunRequire === 'function') return globalThis.__bunRequire(target);
    throw notFound(s, fromPath);
  }
  require.resolve = (id) => resolve(id);
  require.resolve.paths = () => null;
  require.cache = Object.create(null);
  require.main = undefined;
  require.extensions = Object.create(null);
  return require;
}

export class Module {
  constructor(id = '', parent) { this.id = id; this.parent = parent; this.exports = {}; this.filename = null; this.loaded = false; this.children = []; this.paths = []; }
  static createRequire = createRequire;
  static builtinModules = builtinModules;
  static isBuiltin = isBuiltin;
  static _extensions = Object.create(null);
  static _cache = Object.create(null);
  static _resolveFilename(request) { return request; }
  static _load(request) { return createRequire('/')(request); }
  static wrap(script) { return `(function (exports, require, module, __filename, __dirname) { ${script}\n});`; }
  static syncBuiltinESMExports() {}
  static findSourceMap() { return undefined; }
  static register() {}
  static enableCompileCache() { return { status: 3 }; }
  static getCompileCacheDir() { return undefined; }
  static flushCompileCache() {}
}

export const syncBuiltinESMExports = Module.syncBuiltinESMExports;
export const findSourceMap = Module.findSourceMap;
export const register = Module.register;
export const enableCompileCache = Module.enableCompileCache;
export const getCompileCacheDir = Module.getCompileCacheDir;
export const flushCompileCache = Module.flushCompileCache;
export const constants = { compileCacheStatus: { FAILED: 0, ENABLED: 1, ALREADY_ENABLED: 2, DISABLED: 3 } };
export function findPackageJSON() { return undefined; }
export function stripTypeScriptTypes() { throw new Error('module.stripTypeScriptTypes is not available in the browser runtime'); }

Object.assign(Module, { Module, constants, findPackageJSON, stripTypeScriptTypes });
export default Module;
