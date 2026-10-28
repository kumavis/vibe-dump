// SharedArrayBuffer / Atomics.wait when the page is not cross-origin isolated
// (GitHub Pages cannot send COOP/COEP headers, so browsers hide
// SharedArrayBuffer). Claude Code allocates one at module top level for a
// synchronous retry sleep (`Atomics.wait(new Int32Array(new
// SharedArrayBuffer(4)), 0, 0, ms)`), so without a stand-in a whole chunk fails
// to evaluate.
//
// The stand-in is an ArrayBuffer subclass. No other thread can ever see such
// memory, so Atomics.wait on it can only time out: a finite wait busy-waits
// (capped), an unbounded one returns 'timed-out' at once instead of hanging
// the Worker forever. Installed only when SharedArrayBuffer is missing; a
// cross-origin-isolated page keeps the real thing.

const MAX_SPIN_MS = 2000

export function installSharedMemoryFallback (target = globalThis) {
  if (typeof target.SharedArrayBuffer === 'function') return false
  class SharedArrayBuffer extends ArrayBuffer {
    get [Symbol.toStringTag] () { return 'SharedArrayBuffer' }
    get growable () { return false }
  }
  Object.defineProperty(target, 'SharedArrayBuffer', { value: SharedArrayBuffer, writable: true, configurable: true })

  // Without a real SharedArrayBuffer there is no shared memory at all, so
  // every wait below is on memory only this thread can see.
  const atomics = target.Atomics
  const same = (ta, index, value) => atomics.load(ta, index) === (typeof value === 'bigint' ? value : Number(value) | 0)
  atomics.wait = function wait (ta, index, value, timeout) {
    if (!same(ta, index, value)) return 'not-equal'
    const ms = timeout === undefined ? Infinity : Number(timeout)
    if (Number.isFinite(ms) && ms > 0) {
      const end = performance.now() + Math.min(ms, MAX_SPIN_MS)
      while (performance.now() < end) { /* spin: nothing else can wake us */ }
    }
    return 'timed-out'
  }
  if (atomics.waitAsync) {
    atomics.waitAsync = function waitAsync (ta, index, value, timeout) {
      if (!same(ta, index, value)) return { async: false, value: 'not-equal' }
      const ms = timeout === undefined ? Infinity : Number(timeout)
      if (!Number.isFinite(ms)) return { async: false, value: 'timed-out' }
      return { async: true, value: new Promise((resolve) => setTimeout(() => resolve('timed-out'), ms)) }
    }
  }
  return true
}
