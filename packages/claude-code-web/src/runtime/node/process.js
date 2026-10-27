// node:process — a factory for a Node-like `process` object, plus a module
// default that forwards to whatever `globalThis.process` is at access time.
//
// boot.js (integration) is expected to do:
//   import { createProcess, installProcess } from './node/process.js'
//   installProcess(createProcess({ argv, env, cwd, onStdout, onStderr, onExit, getBuiltinModule }))
// `onStdout/onStderr(chunk)` receive strings or Uint8Arrays as written;
// push stream-json input with `process.stdin.push(line)` / `.push(null)`.
//
// process.exit() calls onExit(code) and then throws a `ProcessExit` error so the
// caller's code stops running, as it would under Node. boot should swallow
// ProcessExit in its error/unhandledrejection handlers (./globals.js does).
// chdir() validates against the VFS once ./index.js (the registry) is loaded,
// or against `opts.isDirectory(path)` when given.
import EventEmitter from './events.js';
import { Readable, Writable } from './stream.js';
import { posix } from './path.js';
import { systemError } from './internal/errors.js';

export const NODE_VERSION = '24.3.0';

export class ProcessExit extends Error {
  constructor(code) {
    super(`process.exit(${code})`);
    this.name = 'ProcessExit';
    this.exitCode = code;
  }
}

let builtinResolver = null;
// index.js registers the shim registry here so getBuiltinModule works without
// process.js importing every other shim.
export function setBuiltinResolver(fn) { builtinResolver = fn; }

const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

function hrtimeImpl(prev) {
  const t = now();
  let sec = Math.floor(t / 1000);
  let ns = Math.floor((t % 1000) * 1e6);
  if (prev) {
    sec -= prev[0];
    ns -= prev[1];
    if (ns < 0) { sec -= 1; ns += 1e9; }
  }
  return [sec, ns];
}
hrtimeImpl.bigint = () => BigInt(Math.floor(now() * 1e6));

function makeStdout(fd, sink, opts) {
  const w = new Writable({
    decodeStrings: false,
    write(chunk, encoding, cb) {
      try { sink?.(chunk); cb(); } catch (err) { cb(err); }
    },
  });
  Object.assign(w, {
    fd,
    isTTY: !!opts.isTTY,
    columns: opts.columns,
    rows: opts.rows,
    _type: 'pipe',
    _isStdio: true,
    getColorDepth: () => (opts.isTTY ? 8 : 1),
    hasColors: (n = 16) => (opts.isTTY ? n <= 256 : false),
    getWindowSize: () => [opts.columns || 80, opts.rows || 24],
    cursorTo(x, y, cb) { if (typeof cb === 'function') cb(); return true; },
    moveCursor(dx, dy, cb) { if (typeof cb === 'function') cb(); return true; },
    clearLine(dir, cb) { if (typeof cb === 'function') cb(); return true; },
    clearScreenDown(cb) { if (typeof cb === 'function') cb(); return true; },
    ref() { return this; },
    unref() { return this; },
  });
  // Node's stdout.destroy()/end() never closes the underlying fd.
  w.destroySoon = w.end;
  return w;
}

function makeStdin(opts) {
  const r = opts.stdin || new Readable({ read() {} });
  Object.assign(r, {
    fd: 0,
    isTTY: false,
    isRaw: false,
    setRawMode(mode) { this.isRaw = !!mode; return this; },
    ref() { return this; },
    unref() { return this; },
  });
  return r;
}

export function createProcess(opts = {}) {
  const p = new EventEmitter();
  const env = opts.env ? { ...opts.env } : {};
  let cwd = opts.cwd || env.PWD || '/';
  const stdout = makeStdout(1, opts.onStdout, opts);
  const stderr = makeStdout(2, opts.onStderr, { ...opts, isTTY: false });
  const stdin = makeStdin(opts);
  let exiting = false;
  const memory = () => {
    const m = typeof performance !== 'undefined' && performance.memory;
    const heapUsed = m ? m.usedJSHeapSize : 64e6;
    const heapTotal = m ? m.totalJSHeapSize : 128e6;
    return { rss: heapTotal + 32e6, heapTotal, heapUsed, external: 0, arrayBuffers: 0 };
  };

  Object.assign(p, {
    title: 'node',
    version: `v${NODE_VERSION}`,
    versions: { node: NODE_VERSION, v8: '13.6.233', uv: '1.51.0', zlib: '1.3.1', modules: '137', napi: '10', unicode: '16.0' },
    release: { name: 'node' },
    arch: 'x64',
    platform: 'linux',
    argv: opts.argv ? [...opts.argv] : ['/usr/local/bin/node', '/app/cli'],
    argv0: 'node',
    execArgv: [],
    execPath: opts.execPath || '/usr/local/bin/node',
    env,
    pid: opts.pid ?? 42,
    ppid: 1,
    debugPort: 9229,
    exitCode: undefined,
    features: { inspector: false, ipv6: true, tls: false, tls_alpn: false, tls_ocsp: false, tls_sni: false, typescript: false, cached_builtins: true, require_module: true },
    config: { variables: {} },
    allowedNodeEnvironmentFlags: new Set(),
    stdout, stderr, stdin,
    connected: false,
    report: {
      getReport: () => ({ header: { glibcVersionRuntime: undefined, osName: 'Linux', osRelease: '6.0.0-browser', arch: 'x64', platform: 'linux' }, sharedObjects: [] }),
      writeReport: () => '',
    },
    cwd: () => cwd,
    chdir(dir) {
      const next = posix.normalize(String(dir).startsWith('/') ? String(dir) : `${cwd}/${dir}`);
      // Node refuses to chdir into a missing directory; check the VFS when we can.
      const fs = (opts.getBuiltinModule || builtinResolver)?.('fs');
      const isDirectory = opts.isDirectory || (fs ? (d) => !!fs.statSync(d, { throwIfNoEntry: false })?.isDirectory() : null);
      if (isDirectory && !isDirectory(next)) {
        throw systemError('ENOENT', 'chdir', { message: `ENOENT: no such file or directory, chdir ${cwd} -> '${dir}'`, path: cwd, dest: String(dir) });
      }
      cwd = next;
      env.PWD = cwd;
    },
    umask: () => 0o22,
    getuid: () => 1000, geteuid: () => 1000, getgid: () => 1000, getegid: () => 1000, getgroups: () => [1000],
    setuid() {}, setgid() {}, seteuid() {}, setegid() {}, setgroups() {}, initgroups() {},
    hrtime: hrtimeImpl,
    uptime: () => now() / 1000,
    memoryUsage: Object.assign(memory, { rss: () => memory().rss }),
    cpuUsage: (prev) => ({ user: Math.floor(now() * 1000) - (prev?.user || 0), system: 0 }),
    resourceUsage: () => ({ userCPUTime: Math.floor(now() * 1000), systemCPUTime: 0, maxRSS: memory().rss / 1024, fsRead: 0, fsWrite: 0 }),
    constrainedMemory: () => 0,
    availableMemory: () => 4 * 1024 ** 3,
    nextTick: (fn, ...args) => queueMicrotask(() => fn(...args)),
    emitWarning(warning, type, code) {
      let w = warning;
      if (typeof w === 'string') {
        w = new Error(warning);
        w.name = (typeof type === 'object' ? type?.type : type) || 'Warning';
        if (code) w.code = code;
      }
      if (p.listenerCount('warning') > 0) p.emit('warning', w);
      else stderr.write(`(node:${p.pid}) ${w.name}: ${w.message}\n`);
    },
    exit(code) {
      if (code !== undefined && code !== null) p.exitCode = Number(code) | 0;
      const c = p.exitCode ?? 0;
      if (!exiting) {
        exiting = true;
        try { p.emit('exit', c); } catch { /* exit listeners must not block exit */ }
        try { opts.onExit?.(c); } catch { /* ignore */ }
      }
      throw new ProcessExit(c);
    },
    reallyExit(code) { p.exit(code); },
    abort() { p.exit(134); },
    kill(pid, signal = 'SIGTERM') {
      if (pid === p.pid || pid === 0) {
        if (signal !== 0 && p.listenerCount(signal) > 0) queueMicrotask(() => p.emit(signal, signal));
        return true;
      }
      throw systemError('ESRCH', 'kill', { message: 'kill ESRCH' });
    },
    binding(name) { throw new Error(`No such module: ${name}`); },
    _linkedBinding(name) { throw new Error(`No such binding: ${name}`); },
    dlopen() { throw new Error('process.dlopen is not available in the browser runtime'); },
    getBuiltinModule: (id) => (opts.getBuiltinModule || builtinResolver)?.(id),
    setUncaughtExceptionCaptureCallback() {},
    hasUncaughtExceptionCaptureCallback: () => false,
    setSourceMapsEnabled() {},
    getActiveResourcesInfo: () => [],
    loadEnvFile() {},
  });
  return p;
}

// --- module default: forward to the live global process ------------------
let fallback = null;
const current = () => globalThis.process || (fallback ||= createProcess());

const forward = new Proxy({}, {
  get: (_, k) => { const t = current(); return Reflect.get(t, k, t); },
  set: (_, k, v) => Reflect.set(current(), k, v),
  has: (_, k) => k in current(),
  deleteProperty: (_, k) => Reflect.deleteProperty(current(), k),
  ownKeys: () => Reflect.ownKeys(current()),
  getOwnPropertyDescriptor: (_, k) => {
    const d = Reflect.getOwnPropertyDescriptor(current(), k);
    return d && { ...d, configurable: true };
  },
  defineProperty: (_, k, d) => Reflect.defineProperty(current(), k, d),
  getPrototypeOf: () => Reflect.getPrototypeOf(current()),
});

// Value-type named exports are refreshed by installProcess(); function exports
// always call through to the live object.
export let argv, env, platform, arch, version, versions, pid, ppid, execPath, execArgv,
  stdout, stderr, stdin, title, release, features, config, argv0;
function refresh() {
  const t = current();
  ({ argv, env, platform, arch, version, versions, pid, ppid, execPath, execArgv, stdout, stderr, stdin, title, release, features, config, argv0 } = t);
}
refresh();

export function installProcess(proc = createProcess(), target = globalThis) {
  target.process = proc;
  refresh();
  return proc;
}

const call = (name) => (...args) => current()[name](...args);
export const cwd = call('cwd');
export const chdir = call('chdir');
export const exit = call('exit');
export const nextTick = call('nextTick');
export const emitWarning = call('emitWarning');
export const memoryUsage = call('memoryUsage');
export const cpuUsage = call('cpuUsage');
export const resourceUsage = call('resourceUsage');
export const uptime = call('uptime');
export const umask = call('umask');
export const kill = call('kill');
export const abort = call('abort');
export const getuid = call('getuid');
export const getgid = call('getgid');
export const geteuid = call('geteuid');
export const getegid = call('getegid');
export const on = call('on');
export const once = call('once');
export const off = call('off');
export const emit = call('emit');
export const addListener = call('addListener');
export const removeListener = call('removeListener');
export const removeAllListeners = call('removeAllListeners');
export const listeners = call('listeners');
export const getBuiltinModule = call('getBuiltinModule');
export const hrtime = Object.assign((prev) => current().hrtime(prev), { bigint: () => current().hrtime.bigint() });

export default forward;
