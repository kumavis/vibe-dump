// Default import resolver so arbitrary modules can be loaded:
//   * a minimal WASI preview1 (wasi_snapshot_preview1 / wasi_unstable)
//   * common `env` helpers (abort, exit, __assert_fail, putchar, puts, print*/log*,
//     emscripten_notify_memory_growth, emscripten_memcpy_big, seed)
//   * the `spectest` module used by the official test suite
//   * any other function import becomes a recording stub returning zeros, and
//     imported memories / tables / globals are created from their declared
//     limits / defaults.

import { Memory, Table, Global, Trap, ProcExit, hostFunction } from './machine.js'
import { defaultValue } from './values.js'

export const WASI_ERRNO = { SUCCESS: 0, BADF: 8, INVAL: 28, NOSYS: 52, SPIPE: 70, NOTCAPABLE: 76 }

const sig = (t) => t.params.join(',') + '>' + t.results.join(',')

/**
 * Build an imports object for `module`.
 *
 * opts:
 *   imports      user imports, consulted first: { mod: { name: value } }
 *   stdout(text, bytes)   called for every fd_write/putchar/puts to fd 1 (default: collect)
 *   stderr(text, bytes)   same for fd 2 (default: collect)
 *   stdin        Uint8Array|string served to fd_read on fd 0 (default empty)
 *   args         string[] (argv, default ['program'])
 *   env          { KEY: 'value' } (default {})
 *   now()        -> BigInt nanoseconds (default Date-based)
 *   random(n)    -> Uint8Array of n bytes (default crypto.getRandomValues / Math.random)
 *   onUnresolved({module, name, args, results})  called when a stub runs
 *
 * Returns { imports, unresolved, calls, output, wasi } where
 *   unresolved: [{module, name, kind}] imports satisfied by stubs / defaults
 *   calls:      log of stub invocations [{module, name, args, results}]
 *   output:     { stdout: string, stderr: string } accumulated text
 */
export function createImports(module, opts = {}) {
  const user = opts.imports || {}
  const imports = {}
  const unresolved = []
  const calls = []
  const output = { stdout: '', stderr: '' }
  const decoders = { 1: new TextDecoder(), 2: new TextDecoder() }
  const emit = (fd, bytes) => {
    const text = decoders[fd].decode(bytes, { stream: true })
    if (fd === 1) {
      output.stdout += text
      if (opts.stdout) opts.stdout(text, bytes)
    } else {
      output.stderr += text
      if (opts.stderr) opts.stderr(text, bytes)
    }
  }
  const args = opts.args || ['program']
  const env = opts.env || {}
  let stdin = typeof opts.stdin === 'string' ? new TextEncoder().encode(opts.stdin) : opts.stdin || new Uint8Array(0)
  let stdinPos = 0
  const now = opts.now || (() => BigInt(Math.round((typeof performance !== 'undefined' ? performance.timeOrigin + performance.now() : Date.now()) * 1e6)))
  const random = opts.random || ((n) => {
    const b = new Uint8Array(n)
    if (globalThis.crypto && globalThis.crypto.getRandomValues) for (let i = 0; i < n; i += 65536) globalThis.crypto.getRandomValues(b.subarray(i, Math.min(n, i + 65536)))
    else for (let i = 0; i < n; i++) b[i] = (Math.random() * 256) | 0
    return b
  })
  const wasiState = { exitCode: null }
  const enc = new TextEncoder()
  const strBlocks = (list) => list.map((s) => enc.encode(s + '\0'))

  const stub = (modName, name, type, kind = 'stub', ret) =>
    hostFunction(
      (caller, ...a) => {
        const results = ret !== undefined ? [ret] : type.results.map(defaultValue)
        const call = { module: modName, name, args: a, results }
        calls.push(call)
        if (opts.onUnresolved) opts.onUnresolved(call)
        return type.results.length === 0 ? undefined : type.results.length === 1 ? results[0] : results
      },
      { unresolved: true, stubKind: kind },
    )

  // --- WASI preview1 -------------------------------------------------------
  const iovs = (c, ptr, n) => {
    const out = []
    for (let i = 0; i < n; i++) out.push([c.u32(ptr + i * 8), c.u32(ptr + i * 8 + 4)])
    return out
  }
  const WASI = {
    'fd_write:i32,i32,i32,i32>i32': (c, fd, iov, n, nwritten) => {
      if (fd !== 1 && fd !== 2) return WASI_ERRNO.BADF
      let total = 0
      for (const [p, len] of iovs(c, iov, n)) {
        if (len) emit(fd, c.read(p, len))
        total += len
      }
      c.setU32(nwritten, total)
      return 0
    },
    'fd_read:i32,i32,i32,i32>i32': (c, fd, iov, n, nread) => {
      if (fd !== 0) return WASI_ERRNO.BADF
      let total = 0
      for (const [p, len] of iovs(c, iov, n)) {
        const k = Math.min(len, stdin.length - stdinPos)
        if (k > 0) c.write(p, stdin.subarray(stdinPos, stdinPos + k))
        stdinPos += k
        total += k
        if (k < len) break
      }
      c.setU32(nread, total)
      return 0
    },
    'proc_exit:i32>': (c, code) => {
      wasiState.exitCode = code
      throw new ProcExit(code)
    },
    'args_sizes_get:i32,i32>i32': (c, argcPtr, sizePtr) => {
      const b = strBlocks(args)
      c.setU32(argcPtr, b.length)
      c.setU32(sizePtr, b.reduce((s, x) => s + x.length, 0))
      return 0
    },
    'args_get:i32,i32>i32': (c, argv, buf) => {
      let p = buf
      strBlocks(args).forEach((s, i) => {
        c.setU32(argv + i * 4, p)
        c.write(p, s)
        p += s.length
      })
      return 0
    },
    'environ_sizes_get:i32,i32>i32': (c, countPtr, sizePtr) => {
      const b = strBlocks(Object.entries(env).map(([k, v]) => `${k}=${v}`))
      c.setU32(countPtr, b.length)
      c.setU32(sizePtr, b.reduce((s, x) => s + x.length, 0))
      return 0
    },
    'environ_get:i32,i32>i32': (c, envp, buf) => {
      let p = buf
      strBlocks(Object.entries(env).map(([k, v]) => `${k}=${v}`)).forEach((s, i) => {
        c.setU32(envp + i * 4, p)
        c.write(p, s)
        p += s.length
      })
      return 0
    },
    'clock_time_get:i32,i64,i32>i32': (c, id, precision, ptr) => {
      if (id < 0 || id > 3) return WASI_ERRNO.INVAL
      c.setU64(ptr, now())
      return 0
    },
    'clock_res_get:i32,i32>i32': (c, id, ptr) => {
      c.setU64(ptr, 1000n)
      return 0
    },
    'random_get:i32,i32>i32': (c, buf, len) => {
      c.write(buf, random(len >>> 0))
      return 0
    },
    'fd_close:i32>i32': (c, fd) => (fd >= 0 && fd <= 2 ? 0 : WASI_ERRNO.BADF),
    'fd_seek:i32,i64,i32,i32>i32': (c, fd) => (fd >= 0 && fd <= 2 ? WASI_ERRNO.SPIPE : WASI_ERRNO.BADF),
    'fd_fdstat_get:i32,i32>i32': (c, fd, ptr) => {
      if (fd < 0 || fd > 2) return WASI_ERRNO.BADF
      const b = new Uint8Array(24)
      b[0] = 2 // character device
      const dv = new DataView(b.buffer)
      dv.setBigUint64(8, 0x1fffffffn, true) // rights_base: everything
      c.write(ptr, b)
      return 0
    },
    'fd_fdstat_set_flags:i32,i32>i32': (c, fd) => (fd >= 0 && fd <= 2 ? 0 : WASI_ERRNO.BADF),
    'fd_prestat_get:i32,i32>i32': () => WASI_ERRNO.BADF,
    'fd_prestat_dir_name:i32,i32,i32>i32': () => WASI_ERRNO.BADF,
    'sched_yield:>i32': () => 0,
  }

  // --- env -----------------------------------------------------------------
  const asString = (c, ptr) => {
    // AssemblyScript string: UTF-16LE, byte length stored at ptr - 4
    try {
      if (!ptr) return ''
      const len = c.u32(ptr - 4)
      const b = c.read(ptr, Math.min(len, 4096))
      let s = ''
      for (let i = 0; i + 1 < b.length; i += 2) s += String.fromCharCode(b[i] | (b[i + 1] << 8))
      return s
    } catch {
      return `<string at ${ptr}>`
    }
  }
  const ENV = {
    'abort:i32,i32,i32,i32>': (c, msg, file, line, col) => {
      throw new Trap('host-abort', `abort(): ${asString(c, msg)} at ${asString(c, file)}:${line}:${col}`)
    },
    'abort:>': () => {
      throw new Trap('host-abort', 'abort() called')
    },
    'abort:i32>': (c, code) => {
      throw new Trap('host-abort', `abort(${code}) called`)
    },
    'exit:i32>': (c, code) => {
      throw new ProcExit(code)
    },
    '__assert_fail:i32,i32,i32,i32>': (c, expr, file, line, fn) => {
      throw new Trap('host-abort', `assertion failed: ${c.cstring(expr)} (${c.cstring(file)}:${line} in ${c.cstring(fn)})`)
    },
    'emscripten_notify_memory_growth:i32>': () => {},
    'emscripten_memcpy_big:i32,i32,i32>i32': (c, d, s, n) => {
      c.write(d, c.read(s, n))
      return d
    },
    'putchar:i32>i32': (c, ch) => {
      emit(1, new Uint8Array([ch & 0xff]))
      return ch
    },
    'puts:i32>i32': (c, p) => {
      emit(1, enc.encode(c.cstring(p) + '\n'))
      return 0
    },
    'seed:>f64': () => Date.now() * Math.random(),
  }
  const isLogger = (name, t) => /^(print|log|console_?log|debug|trace|output)/i.test(name) && t.results.length === 0 && t.params.every((p) => p !== 'funcref' && p !== 'externref')

  // --- spectest --------------------------------------------------------------
  const spectestPrint = (name) => (c, ...a) => emit(1, enc.encode(`${name}(${a.map(String).join(', ')})\n`))
  const SPECTEST_VALUES = {
    global_i32: () => new Global({ type: 'i32', mut: false }, 666),
    global_i64: () => new Global({ type: 'i64', mut: false }, 666n),
    global_f32: () => new Global({ type: 'f32', mut: false }, Math.fround(666.6)),
    global_f64: () => new Global({ type: 'f64', mut: false }, 666.6),
    table: () => new Table({ elemType: 'funcref', min: 10, max: 20 }),
    memory: () => new Memory({ min: 1, max: 2 }),
  }

  for (const imp of module.imports) {
    const um = user[imp.module]
    if (um && um[imp.name] !== undefined) {
      ;(imports[imp.module] ||= {})[imp.name] = um[imp.name]
      continue
    }
    const target = (imports[imp.module] ||= {})
    if (target[imp.name] !== undefined) continue
    if (imp.kind === 'func') {
      const t = module.types[imp.typeIndex]
      const key = `${imp.name}:${sig(t)}`
      const isWasi = imp.module === 'wasi_snapshot_preview1' || imp.module === 'wasi_unstable'
      if (isWasi && WASI[key]) target[imp.name] = hostFunction(WASI[key], { wasi: true })
      else if (isWasi) {
        target[imp.name] = stub(imp.module, imp.name, t, 'wasi-nosys', t.results.length === 1 && t.results[0] === 'i32' ? WASI_ERRNO.NOSYS : undefined)
        unresolved.push({ module: imp.module, name: imp.name, kind: 'func' })
      } else if (imp.module === 'env' && ENV[key]) target[imp.name] = hostFunction(ENV[key])
      else if (imp.module === 'spectest' && imp.name.startsWith('print')) target[imp.name] = hostFunction(spectestPrint(imp.name))
      else if (isLogger(imp.name, t)) target[imp.name] = hostFunction((c, ...a) => emit(1, enc.encode(a.map(String).join(' ') + '\n')), { logger: true })
      else {
        target[imp.name] = stub(imp.module, imp.name, t)
        unresolved.push({ module: imp.module, name: imp.name, kind: 'func' })
      }
    } else if (imp.module === 'spectest' && SPECTEST_VALUES[imp.name]) {
      target[imp.name] = SPECTEST_VALUES[imp.name]()
    } else if (imp.kind === 'memory') {
      target[imp.name] = new Memory({ min: imp.desc.min, max: imp.desc.max })
      unresolved.push({ module: imp.module, name: imp.name, kind: 'memory' })
    } else if (imp.kind === 'table') {
      target[imp.name] = new Table({ elemType: imp.desc.elemType, min: imp.desc.min, max: imp.desc.max })
      unresolved.push({ module: imp.module, name: imp.name, kind: 'table' })
    } else if (imp.kind === 'global') {
      target[imp.name] = new Global({ type: imp.desc.type, mut: imp.desc.mut })
      unresolved.push({ module: imp.module, name: imp.name, kind: 'global' })
    }
  }
  return {
    imports,
    unresolved,
    calls,
    output,
    wasi: wasiState,
    /** Replace the stdin buffer served to fd_read. */
    setStdin(s) {
      stdin = typeof s === 'string' ? new TextEncoder().encode(s) : s
      stdinPos = 0
    },
  }
}
