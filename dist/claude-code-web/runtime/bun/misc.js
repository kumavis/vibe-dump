// Small Bun members: timing, promise peeking, GC knobs, and the stubs for
// what a browser cannot do (Terminal, Transpiler for TS, heap snapshots).

/**
 * Bun.sleepSync(ms): block the calling thread. A busy-wait on purpose:
 * Atomics.wait is forbidden on a page's main thread and needs a
 * SharedArrayBuffer, which needs cross-origin isolation we do not have. The
 * bundle only sleeps in 2 ms steps while draining a tty, so the spin is short.
 */
export function sleepSync(ms) {
  const t = Number(ms)
  if (!(t > 0)) return
  const end = performance.now() + t
  while (performance.now() < end) {
    // spin
  }
}

/** Bun.sleep(msOrDate): resolves after the delay (or at the Date). */
export function sleep(ms) {
  const t = ms instanceof Date ? ms.getTime() - Date.now() : Number(ms)
  return new Promise((resolve) => setTimeout(resolve, Math.max(0, t || 0)))
}

/** Bun.nanoseconds(): nanoseconds since this runtime (the Worker) started. */
export function nanoseconds() {
  return Math.round(performance.now() * 1e6)
}

// Bun.peek(promise) returns a settled promise's value (or rejection reason)
// synchronously, else the promise. JS cannot inspect a promise's state, so
// the first peek subscribes and later peeks (a microtask on) see the result.
const states = new WeakMap()

function track(p) {
  let s = states.get(p)
  if (!s) {
    s = { status: 'pending', value: undefined }
    states.set(p, s)
    p.then(
      (v) => { s.status = 'fulfilled'; s.value = v },
      (e) => { s.status = 'rejected'; s.value = e },
    )
  }
  return s
}

export function peek(value) {
  if (!(value instanceof Promise)) return value
  const s = track(value)
  return s.status === 'pending' ? value : s.value
}
peek.status = (value) => (value instanceof Promise ? track(value).status : 'fulfilled')

/** Bun.gc(force): runs a collection only where the engine exposes one. */
export function gc() {
  if (typeof globalThis.gc === 'function') globalThis.gc()
}

export function generateHeapSnapshot() {
  throw new Error('Bun.generateHeapSnapshot is unavailable in the browser runtime')
}

// The 2.1.311 bundle reports this exact phrase as the reason background
// PTY sessions cannot start; constructing a Terminal throws it.
export const TERMINAL_UNAVAILABLE = 'Bun.Terminal unavailable (running under Node?)'

export class Terminal {
  constructor() {
    const err = new Error(TERMINAL_UNAVAILABLE)
    err.code = 'ERR_BUN_TERMINAL_UNAVAILABLE'
    throw err
  }
}

/**
 * Bun.Transpiler stub. The bundle uses it only to strip TypeScript from
 * user-supplied hook / plugin files. Plain JS passes through; anything that
 * needs real transpiling throws a clear error (handing TS source back as if
 * it were JS would only fail later and more confusingly).
 */
export class Transpiler {
  #loader

  constructor(options = {}) {
    this.#loader = options.loader ?? 'js'
  }

  transformSync(code, loader = this.#loader) {
    if (loader === 'js') return String(code)
    throw new Error(`Bun.Transpiler cannot transpile "${loader}" in the browser runtime`)
  }

  async transform(code, loader) {
    return this.transformSync(code, loader)
  }

  // import specifiers found by a plain scan (good enough for dependency listing)
  scanImports(code) {
    const out = []
    const re = /\bimport\s*(?:[\w*{}\s,$]+\s*from\s*)?["']([^"']+)["']|\bexport\s*[\w*{}\s,$]*\s*from\s*["']([^"']+)["']|\bimport\s*\(\s*["']([^"']+)["']\s*\)|\brequire\s*\(\s*["']([^"']+)["']\s*\)/g
    for (const m of String(code).matchAll(re)) {
      const path = m[1] ?? m[2] ?? m[3] ?? m[4]
      const kind = m[1] !== undefined ? 'import-statement' : m[2] !== undefined ? 'import-statement' : m[3] !== undefined ? 'dynamic-import' : 'require-call'
      out.push({ path, kind })
    }
    return out
  }

  scan(code) {
    return { exports: [], imports: this.scanImports(code) }
  }
}

// Bun.unsafe: JavaScriptCore knobs. The bundle calls
// `Bun.unsafe.setJITPolicy?.(n)` (the ?. guards only the call, so the object
// must exist).
export const unsafe = {
  setJITPolicy() {},
  gcAggressionLevel() { return 0 },
}
