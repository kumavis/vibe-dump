// node:child_process — there are no processes. Every spawn is routed to a
// command table; unknown commands fail like a missing binary (ENOENT, async;
// status 127 plus `error` for the sync forms). There is no shell: exec() and
// {shell:true} go through ./internal/shell.js, which only sequences commands
// from the same table.
//
//   registerCommand(name, handler)   handler(ctx) -> {status, stdout, stderr} | Promise
//   ctx = { name, args, argv, cwd, env, input, stdin, signal, sync, fs }
//     input:  Uint8Array given up front (spawnSync/execSync `input`, or a pipe)
//     stdin:  for async spawns, the Readable the parent writes into (or null)
//     sync:   true when called from a *Sync API (returning a Promise then fails)
//
// Default commands: which (never finds anything), git (128, not a repo),
// rg (VFS ripgrep subset, ./internal/rg.js), ps and npm (empty success).
import EventEmitter from './events.js';
import { PassThrough } from './stream.js';
import { Buffer } from './buffer.js';
import fs from './fs.js';
import { posix as path } from './path.js';
import { systemError, abortError } from './internal/errors.js';
import { rg } from './internal/rg.js';
import { runLineSync, runLineAsync } from './internal/shell.js';

const commands = new Map();

// Optional observer of every spawn (boot.js wires it to its log when tracing).
let trace = null;
export function setSpawnTrace(fn) { trace = typeof fn === 'function' ? fn : null; }
const traced = (kind, command, args, found) => { try { trace?.({ kind, command: String(command), args, found }); } catch { /* never let tracing break a spawn */ } };

export function registerCommand(name, handler) {
  if (typeof handler !== 'function') throw new TypeError('registerCommand: handler must be a function');
  commands.set(name, handler);
  return () => { if (commands.get(name) === handler) commands.delete(name); };
}
export function unregisterCommand(name) { return commands.delete(name); }
export function getCommand(name) { return commands.get(path.basename(String(name))); }
export function listCommands() { return [...commands.keys()].sort(); }

registerCommand('which', () => ({ status: 1, stdout: '', stderr: '' }));
registerCommand('git', () => ({ status: 128, stdout: '', stderr: 'fatal: not a git repository (or any of the parent directories): .git\n' }));
registerCommand('rg', rg);
registerCommand('ps', () => ({ status: 0, stdout: '', stderr: '' }));
registerCommand('npm', () => ({ status: 0, stdout: '', stderr: '' }));

// --- helpers -------------------------------------------------------------------
let nextPid = 1000;
const enc = new TextEncoder();
const toBytes = (v) => (v == null ? new Uint8Array(0) : typeof v === 'string' ? enc.encode(v) : ArrayBuffer.isView(v) ? new Uint8Array(v.buffer, v.byteOffset, v.byteLength) : new Uint8Array(v));
const toBuf = (v) => { const b = toBytes(v); return Buffer.from(b.buffer, b.byteOffset, b.byteLength); };
const encode = (v, encoding) => (encoding && encoding !== 'buffer' ? toBuf(v).toString(encoding) : toBuf(v));

function normalizeArgs(args, options) {
  if (!Array.isArray(args)) return { args: [], options: args && typeof args === 'object' ? args : {} };
  return { args: args.map(String), options: options || {} };
}

function makeCtx(name, args, options, extra) {
  const procEnv = globalThis.process?.env || {};
  const cwd = options.cwd ? path.resolve(String(options.cwd)) : (globalThis.process?.cwd?.() || '/');
  return { name, args, argv: [name, ...args], cwd, env: options.env || procEnv, fs, ...extra };
}

function enoent(command, args, syscall) {
  return systemError('ENOENT', syscall, {
    message: `${syscall} ${command} ENOENT`, path: command, spawnargs: args,
  });
}

function runCommandSync(argv, { cwd, env, input }) {
  const [name, ...args] = argv;
  const handler = getCommand(name);
  if (!handler) return { status: 127, stdout: '', stderr: `sh: ${name}: command not found\n` };
  const bytes = toBytes(input);
  const res = handler({ name, args, argv, cwd, env, fs, input: bytes, stdin: null, readInput: () => Promise.resolve(bytes), signal: new AbortController().signal, sync: true });
  if (res && typeof res.then === 'function') {
    res.then(null, () => {}); // abandoned
    return { status: 1, stdout: '', stderr: `sh: ${name}: command only runs asynchronously\n` };
  }
  return res || { status: 0 };
}

async function runCommandAsync(argv, { cwd, env, input, signal }) {
  const [name, ...args] = argv;
  const handler = getCommand(name);
  if (!handler) return { status: 127, stdout: '', stderr: `sh: ${name}: command not found\n` };
  const bytes = toBytes(input);
  return (await handler({ name, args, argv, cwd, env, fs, input: bytes, stdin: null, readInput: () => Promise.resolve(bytes), signal, sync: false })) || { status: 0 };
}

// --- ChildProcess ------------------------------------------------------------------
export class ChildProcess extends EventEmitter {
  constructor() {
    super();
    this.pid = undefined;
    this.exitCode = null;
    this.signalCode = null;
    this.killed = false;
    this.connected = false;
    this.spawnfile = undefined;
    this.spawnargs = [];
    this.stdin = null;
    this.stdout = null;
    this.stderr = null;
    this.stdio = [null, null, null];
    this._abort = new AbortController();
    this._finished = false;
  }
  kill(signal = 'SIGTERM') {
    if (this._finished || this.pid === undefined) return false;
    this.killed = true;
    this._abort.abort(Object.assign(new Error(`killed by ${signal}`), { signal }));
    this._finish(null, typeof signal === 'number' ? 'SIGTERM' : signal);
    return true;
  }
  ref() { return this; }
  unref() { return this; }
  disconnect() {}
  _finish(code, signal, { stdout, stderr } = {}) {
    if (this._finished) return;
    this._finished = true;
    this.exitCode = code;
    this.signalCode = signal;
    for (const [stream, data] of [[this.stdout, stdout], [this.stderr, stderr]]) {
      if (!stream || stream.writableEnded) continue;
      if (data && data.length) stream.write(toBuf(data));
      stream.end();
    }
    if (this.stdin && !this.stdin.destroyed) this.stdin.destroy();
    queueMicrotask(() => {
      if (this.pid !== undefined) this.emit('exit', code, signal);
      Promise.all([drained(this.stdout), drained(this.stderr)]).then(() => this.emit('close', code, signal));
    });
  }
  [Symbol.dispose ?? Symbol.for('Symbol.dispose')]() { this.kill(); }
}

// Resolves once a consumer has read the stream to its end, or right away if
// nobody is reading it (a real pipe closes when the child exits either way).
function drained(stream) {
  if (!stream || stream.readableEnded) return Promise.resolve();
  return new Promise((resolve) => {
    stream.once('end', resolve);
    stream.once('close', resolve);
    stream.once('error', resolve);
    setTimeout(() => { if (stream.readableFlowing === null && stream.listenerCount('readable') === 0) resolve(); }, 0);
  });
}

function stdioOf(options) {
  const s = options.stdio ?? 'pipe';
  const arr = typeof s === 'string' ? [s, s, s] : [...s];
  while (arr.length < 3) arr.push('pipe');
  return arr.map((x) => (x === undefined || x === null ? 'pipe' : x));
}

export function spawn(command, argsIn, optionsIn) {
  const { args, options } = normalizeArgs(argsIn, optionsIn);
  const child = new ChildProcess();
  const shellLine = options.shell ? [command, ...args].join(' ') : null;
  child.spawnfile = shellLine ? '/bin/sh' : String(command);
  child.spawnargs = shellLine ? ['/bin/sh', '-c', shellLine] : [String(command), ...args];
  const [inMode, outMode, errMode] = stdioOf(options);
  if (inMode === 'pipe') child.stdin = new PassThrough();
  if (outMode === 'pipe') child.stdout = new PassThrough();
  if (errMode === 'pipe') child.stderr = new PassThrough();
  child.stdio = [child.stdin, child.stdout, child.stderr];

  const handler = shellLine ? null : getCommand(command);
  traced('spawn', command, args, !!(shellLine || handler));
  if (!shellLine && !handler) {
    queueMicrotask(() => {
      child.emit('error', enoent(String(command), args, 'spawn'));
      child._finish(-2, null);
    });
    return child;
  }
  child.pid = nextPid++;

  const signal = child._abort.signal;
  if (options.signal) {
    const onAbort = () => { if (child.kill(options.killSignal || 'SIGTERM')) child.emit('error', abortError(options.signal)); };
    if (options.signal.aborted) queueMicrotask(onAbort);
    else options.signal.addEventListener('abort', onAbort, { once: true });
  }
  if (options.timeout > 0) {
    const t = setTimeout(() => child.kill(options.killSignal || 'SIGTERM'), options.timeout);
    child.once('exit', () => clearTimeout(t));
  }

  // Async commands may read what the parent writes to child.stdin.
  let inputPromise = null;
  const readInput = () => (inputPromise ||= new Promise((resolve) => {
    if (!child.stdin) return resolve(new Uint8Array(0));
    const chunks = [];
    child.stdin.on('data', (c) => chunks.push(toBytes(c)));
    child.stdin.on('end', () => resolve(Buffer.concat(chunks.map((c) => Buffer.from(c)))));
    child.stdin.on('close', () => resolve(Buffer.concat(chunks.map((c) => Buffer.from(c)))));
  }));

  queueMicrotask(async () => {
    child.emit('spawn');
    let res;
    try {
      const ctx = makeCtx(path.basename(String(command)), args, options, { input: toBytes(options.input), stdin: child.stdin, readInput, signal, sync: false });
      res = shellLine
        ? await runLineAsync(shellLine, { cwd: ctx.cwd, env: ctx.env, fs, input: ctx.input, isCommand: (n) => !!getCommand(n) }, (req) => runCommandAsync(req.argv, { ...req, signal }))
        : await handler(ctx);
    } catch (err) {
      res = { status: 1, stdout: '', stderr: `${err?.stack || err}\n` };
    }
    res = res || {};
    child._finish(res.signal ? null : (res.status ?? 0), res.signal || null, { stdout: res.stdout, stderr: res.stderr });
  });
  return child;
}

export function fork(modulePath, args, options) {
  return spawn(globalThis.process?.execPath || 'node', [String(modulePath), ...(Array.isArray(args) ? args : [])], Array.isArray(args) ? options : args);
}

// --- execFile / exec -------------------------------------------------------------------
function collect(child, options, display, callback) {
  const encoding = options.encoding === undefined ? 'utf8' : options.encoding;
  const out = [];
  const err = [];
  child.stdout?.on('data', (c) => out.push(toBuf(c)));
  child.stderr?.on('data', (c) => err.push(toBuf(c)));
  let spawnError = null;
  child.on('error', (e) => { spawnError = e; });
  child.on('close', (code, signal) => {
    const stdout = encode(Buffer.concat(out), encoding);
    const stderr = encode(Buffer.concat(err), encoding);
    if (!callback) return;
    if (spawnError) {
      spawnError.cmd = display;
      return callback(spawnError, stdout, stderr);
    }
    if (code !== 0 || signal) {
      const e = new Error(`Command failed: ${display}\n${stderr}`);
      e.code = code;
      e.killed = child.killed;
      e.signal = signal;
      e.cmd = display;
      return callback(e, stdout, stderr);
    }
    callback(null, stdout, stderr);
  });
  return child;
}

function splitExecArgs(args) {
  let [a, b, c] = args;
  let fileArgs = [];
  let options = {};
  let callback;
  if (Array.isArray(a)) { fileArgs = a; a = b; b = c; }
  if (typeof a === 'function') callback = a;
  else { if (a) options = a; if (typeof b === 'function') callback = b; }
  return { fileArgs, options, callback };
}

export function execFile(file, ...rest) {
  const { fileArgs, options, callback } = splitExecArgs(rest);
  const child = spawn(file, fileArgs.map(String), { ...options, shell: options.shell || false });
  return collect(child, options, [file, ...fileArgs].join(' '), callback);
}

export function exec(command, options, callback) {
  const opts = typeof options === 'function' ? {} : options || {};
  const cb = typeof options === 'function' ? options : callback;
  const child = spawn(command, [], { ...opts, shell: true });
  return collect(child, opts, command, cb);
}

const kCustomPromisify = Symbol.for('nodejs.util.promisify.custom');
function promisified(fn) {
  return (...args) => {
    let child;
    const p = new Promise((resolve, reject) => {
      child = fn(...args, (err, stdout, stderr) => {
        if (err) { err.stdout = stdout; err.stderr = stderr; reject(err); } else resolve({ stdout, stderr });
      });
    });
    p.child = child;
    return p;
  };
}
Object.defineProperty(execFile, kCustomPromisify, { value: promisified(execFile), configurable: true });
Object.defineProperty(exec, kCustomPromisify, { value: promisified(exec), configurable: true });

// --- sync forms ----------------------------------------------------------------------------
export function spawnSync(command, argsIn, optionsIn) {
  const { args, options } = normalizeArgs(argsIn, optionsIn);
  const encoding = options.encoding;
  const shellLine = options.shell ? [command, ...args].join(' ') : null;
  const handler = shellLine ? null : getCommand(command);
  traced('spawnSync', command, args, !!(shellLine || handler));
  const empty = encode('', encoding);
  if (!shellLine && !handler) {
    return { pid: 0, output: [null, empty, empty], stdout: empty, stderr: empty, status: 127, signal: null, error: enoent(String(command), args, 'spawnSync') };
  }
  const input = toBytes(options.input);
  const ctx = makeCtx(path.basename(String(command)), args, options, { input, stdin: null, readInput: () => Promise.resolve(input), signal: new AbortController().signal, sync: true });
  let res;
  try {
    res = shellLine
      ? runLineSync(shellLine, { cwd: ctx.cwd, env: ctx.env, fs, input: ctx.input, isCommand: (n) => !!getCommand(n) }, (req) => runCommandSync(req.argv, req))
      : handler(ctx);
    if (res && typeof res.then === 'function') {
      res.then(null, () => {}); // abandoned: the caller already got ENOSYS
      const error = systemError('ENOSYS', 'spawnSync', { message: `spawnSync ${command} ENOSYS (command only runs asynchronously)`, path: String(command), spawnargs: args });
      return { pid: 0, output: [null, empty, empty], stdout: empty, stderr: empty, status: null, signal: null, error };
    }
  } catch (err) {
    res = { status: 1, stderr: `${err?.stack || err}\n` };
  }
  res = res || {};
  const stdout = encode(res.stdout, encoding);
  const stderr = encode(res.stderr, encoding);
  return { pid: nextPid++, output: [null, stdout, stderr], stdout, stderr, status: res.signal ? null : (res.status ?? 0), signal: res.signal || null };
}

function checkSync(r, display) {
  if (r.error) {
    Object.assign(r.error, { status: r.status, signal: r.signal, output: r.output, pid: r.pid, stdout: r.stdout, stderr: r.stderr });
    throw r.error;
  }
  if (r.status !== 0) {
    const err = new Error(`Command failed: ${display}${r.stderr && r.stderr.length ? `\n${r.stderr.toString()}` : ''}`);
    Object.assign(err, { status: r.status, signal: r.signal, output: r.output, pid: r.pid, stdout: r.stdout, stderr: r.stderr });
    throw err;
  }
  return r.stdout;
}

export function execFileSync(file, argsIn, optionsIn) {
  const { args, options } = normalizeArgs(argsIn, optionsIn);
  return checkSync(spawnSync(file, args, options), [file, ...args].join(' '));
}

export function execSync(command, options = {}) {
  return checkSync(spawnSync(command, [], { ...options, shell: true }), command);
}

export const _forkChild = () => {};

const child_process = {
  ChildProcess, spawn, spawnSync, exec, execSync, execFile, execFileSync, fork, _forkChild,
  registerCommand, unregisterCommand, getCommand, listCommands,
};
export default child_process;
