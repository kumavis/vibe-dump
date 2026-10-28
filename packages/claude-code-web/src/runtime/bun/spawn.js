// Bun.spawn / Bun.spawnSync / Bun.which over the track-B child_process shim
// (deps.childProcess), whose command table is the only "PATH" a browser has.
//
// Bun differences that matter to the bundle and are kept:
//   * a missing executable throws ENOENT synchronously from spawn() (Node
//     reports it later as an 'error' event); several call sites catch it;
//   * stdout / stderr are web ReadableStreams with .text() etc.;
//   * `exited` is a Promise of the exit code;
//   * default stdio is ['ignore', 'pipe', 'inherit'] (spawnSync: pipe, pipe).
// Not supported: `terminal` (Bun.Terminal throws first), IPC, and redirecting
// output to a BunFile or fd (mapped to 'ignore').
import { toWebStream } from './streams.js'
import { asBuffer, toBytes, toBytesAsync } from './bytes.js'

// POSIX signal numbers, for the 128 + n exit status of a signalled child.
const SIGNALS = { SIGHUP: 1, SIGINT: 2, SIGQUIT: 3, SIGKILL: 9, SIGUSR1: 10, SIGSEGV: 11, SIGUSR2: 12, SIGPIPE: 13, SIGALRM: 14, SIGTERM: 15 }

function enoent(file) {
  const err = new Error(`Executable not found in $PATH: "${file}"`)
  err.code = 'ENOENT'
  err.errno = -2
  err.syscall = 'posix_spawn'
  err.path = file
  return err
}

function parseArgs(name, first, second) {
  let cmd
  let opts
  if (Array.isArray(first)) { cmd = first; opts = second ?? {} }
  else if (first && typeof first === 'object') { opts = first; cmd = first.cmd }
  else { cmd = first === undefined ? [] : [first]; opts = second ?? {} }
  if (!Array.isArray(cmd) || cmd.length === 0) throw new TypeError(`Bun.${name}: expected a non-empty cmd array`)
  const [file, ...args] = cmd.map(String)
  return { file, args, opts }
}

// a BunFile (ours has writer(); a DOM File/Blob does not, and is valid stdin data)
const isBunFileLike = (v) => v && typeof v === 'object' && typeof v.writer === 'function' && typeof v.text === 'function'

// Bun stdio value -> Node stdio value for an output
function outMode(v, fallback) {
  if (v === undefined) return fallback
  if (v === null || v === 'ignore') return 'ignore'
  if (v === 'pipe' || v === 'inherit') return v
  if (v === 1 || v === 2) return 'inherit'
  return 'ignore' // other fds, BunFile, Response sinks: no redirection in the browser
}

function stdioOf(opts, defaults) {
  const s = Array.isArray(opts.stdio) ? opts.stdio : []
  return [
    opts.stdin !== undefined ? opts.stdin : s[0] !== undefined ? s[0] : defaults[0],
    opts.stdout !== undefined ? opts.stdout : s[1] !== undefined ? s[1] : defaults[1],
    opts.stderr !== undefined ? opts.stderr : s[2] !== undefined ? s[2] : defaults[2],
  ]
}

// stdin: 'pipe' gives a FileSink; data (string, bytes, Blob, Response,
// ReadableStream) is written then closed; everything else is ignored.
function inMode(v) {
  if (v === 'pipe') return { node: 'pipe', sink: true }
  if (v === 'inherit' || v === 0) return { node: 'inherit' }
  if (v === undefined || v === null || v === 'ignore' || typeof v === 'number' || isBunFileLike(v)) return { node: 'ignore' }
  return { node: 'pipe', feed: v }
}

/** Bun's FileSink over a Node Writable. */
function fileSink(writable) {
  return {
    write(chunk) {
      const u8 = toBytes(chunk)
      writable.write(u8)
      return u8.length
    },
    flush() { return 0 },
    end(error) {
      if (error) writable.destroy?.(error)
      else writable.end()
      return 0
    },
    ref() {},
    unref() {},
    start() {},
  }
}

async function feed(writable, data) {
  try {
    if (data && typeof data.getReader === 'function') {
      const reader = data.getReader()
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        writable.write(toBytes(value))
      }
    } else {
      writable.write(await toBytesAsync(data))
    }
  } catch (err) {
    writable.destroy?.(err)
    return
  }
  writable.end()
}

export function makeSpawn(deps) {
  const cp = () => {
    if (!deps.childProcess) throw new Error('Bun.spawn is unavailable: installBun() was not given deps.childProcess')
    return deps.childProcess
  }
  const env = (opts) => opts.env ?? deps.process?.env
  const cwd = (opts) => opts.cwd ?? deps.process?.cwd?.()

  // Bun resolves the executable before spawning; with a command table that
  // means "is there a handler for this name".
  function assertKnown(c, file) {
    if (typeof c.getCommand === 'function' && !c.getCommand(file)) throw enoent(file)
  }

  class Subprocess {
    #child
    #exitCode = null
    #signalCode = null
    #killed = false

    constructor(child, { stdin, stdout, stderr, onExit, timeout, killSignal, signal }) {
      this.#child = child
      this.pid = child.pid
      this.stdin = stdin
      this.stdout = stdout
      this.stderr = stderr

      let settled = false
      let timer
      this.exited = new Promise((resolve) => {
        const settle = (code, sig, error) => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          this.#exitCode = code ?? null
          this.#signalCode = sig ?? null
          const status = code ?? (sig ? 128 + (SIGNALS[sig] ?? 15) : error ? 1 : 0)
          try { onExit?.(this, this.#exitCode, this.#signalCode, error) } catch {}
          resolve(status)
        }
        child.once('exit', (code, sig) => settle(code, sig))
        child.once('close', (code, sig) => settle(code, sig))
        child.once('error', (err) => settle(err?.code === 'ENOENT' ? 127 : null, null, err))
      })
      if (timeout > 0) timer = setTimeout(() => this.kill(killSignal ?? 'SIGTERM'), timeout)
      if (signal) {
        if (signal.aborted) this.kill(killSignal ?? 'SIGTERM')
        else signal.addEventListener('abort', () => this.kill(killSignal ?? 'SIGTERM'), { once: true })
      }
    }

    get exitCode() { return this.#exitCode }
    get signalCode() { return this.#signalCode }
    get killed() { return this.#killed }

    kill(sig) {
      this.#killed = true
      try { this.#child.kill?.(sig) } catch {}
    }

    ref() { this.#child.ref?.() }
    unref() { this.#child.unref?.() }
    resourceUsage() { return undefined }
  }

  function spawn(first, second) {
    const { file, args, opts } = parseArgs('spawn', first, second)
    const c = cp()
    assertKnown(c, file)
    const [inV, outV, errV] = stdioOf(opts, ['ignore', 'pipe', 'inherit'])
    const input = inMode(inV)
    const stdio = [input.node, outMode(outV, 'pipe'), outMode(errV, 'inherit')]
    const child = c.spawn(file, args, {
      cwd: cwd(opts),
      env: env(opts),
      stdio,
      argv0: opts.argv0,
      detached: opts.detached,
      windowsHide: opts.windowsHide,
    })
    if (input.feed !== undefined && child.stdin) feed(child.stdin, input.feed)
    return new Subprocess(child, {
      stdin: input.sink && child.stdin ? fileSink(child.stdin) : undefined,
      stdout: stdio[1] === 'pipe' ? toWebStream(child.stdout) : undefined,
      stderr: stdio[2] === 'pipe' ? toWebStream(child.stderr) : undefined,
      onExit: opts.onExit,
      timeout: opts.timeout,
      killSignal: opts.killSignal,
      signal: opts.signal,
    })
  }

  function spawnSync(first, second) {
    const { file, args, opts } = parseArgs('spawnSync', first, second)
    const c = cp()
    const [inV, outV, errV] = stdioOf(opts, ['ignore', 'pipe', 'pipe'])
    let input
    if (inV !== undefined && inV !== null && typeof inV !== 'string' && typeof inV !== 'number' && !isBunFileLike(inV)) {
      try { input = toBytes(inV) } catch { input = undefined } // Blob / stream input cannot be read synchronously
    }
    const stdio = [input ? 'pipe' : inMode(inV).node === 'inherit' ? 'inherit' : 'ignore', outMode(outV, 'pipe'), outMode(errV, 'pipe')]
    const r = c.spawnSync(file, args, {
      cwd: cwd(opts),
      env: env(opts),
      stdio,
      input,
      timeout: opts.timeout,
      killSignal: opts.killSignal,
      maxBuffer: opts.maxBuffer,
      argv0: opts.argv0,
    })
    if (r.error?.code === 'ENOENT') throw r.error
    const buf = (v) => (v == null ? undefined : asBuffer(toBytes(v), deps.Buffer ?? globalThis.Buffer))
    return {
      pid: r.pid,
      exitCode: r.status ?? null,
      signalCode: r.signal ?? null,
      success: r.status === 0,
      stdout: stdio[1] === 'pipe' ? buf(r.stdout) : undefined,
      stderr: stdio[2] === 'pipe' ? buf(r.stderr) : undefined,
      exitedDueToTimeout: r.error?.code === 'ETIMEDOUT' ? true : undefined,
      resourceUsage: undefined,
    }
  }

  // Bun.which(cmd, { PATH, cwd }): a path is checked on the VFS; a bare name
  // asks the command table's own `which`, so the two never disagree.
  function which(command, options = {}) {
    const name = String(command)
    if (!name) return null
    if (name.includes('/')) {
      const fs = deps.fs
      if (!fs) return null
      const p = name.startsWith('/') || !deps.path ? name : deps.path.resolve(options.cwd ?? cwd({}) ?? '/', name)
      try { return fs.statSync(p).isFile() ? p : null } catch { return null }
    }
    const c = deps.childProcess
    if (!c?.spawnSync) return null
    const baseEnv = env({}) ?? {}
    const r = c.spawnSync('which', [name], {
      env: options.PATH === undefined ? baseEnv : { ...baseEnv, PATH: options.PATH },
      cwd: options.cwd ?? cwd({}),
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf8',
    })
    if (r?.status !== 0 || r.stdout == null) return null
    const out = typeof r.stdout === 'string' ? r.stdout : new TextDecoder().decode(toBytes(r.stdout))
    return out.split('\n')[0].trim() || null
  }

  return { spawn, spawnSync, which, Subprocess }
}
