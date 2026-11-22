// Persisted per-viewer preferences (animations, theme, number base, speed).
// localStorage can be missing or throw (private windows, previews): every
// access is guarded and the in-memory value is authoritative.

const KEY = 'wasm-machine:prefs'
const listeners = new Set()

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const reducedMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
const prefersLight = typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: light)').matches

const stored = read()
export const prefs = {
  anim: stored.anim ?? !reducedMotion,
  theme: stored.theme ?? (prefersLight ? 'light' : 'dark'),
  hex: stored.hex ?? false,
  speed: stored.speed ?? 4, // index into SPEEDS
}

/** Run speeds in instructions per second; Infinity = engine run() in rAF slices. */
export const SPEEDS = [1, 2, 4, 8, 15, 30, 60, 250, 1000, 10000, Infinity]
export const speedLabel = (v) => (v === Infinity ? 'max' : v >= 1000 ? v / 1000 + 'k/s' : v + '/s')

let transient = false
/** Stop persisting preferences (presentation / capture mode). */
export function setTransient() {
  transient = true
}

export function setPref(k, v) {
  prefs[k] = v
  if (!transient) try {
    localStorage.setItem(KEY, JSON.stringify(prefs))
  } catch {
    /* storage unavailable: keep in memory */
  }
  for (const fn of listeners) fn(k, v)
}

export function onPref(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** Base duration (ms) for one step's motion, or 0 when motion is off. */
export function motionMs(rate = 0) {
  if (!prefs.anim) return 0
  const base = 280
  if (!rate) return base
  const interval = 1000 / rate
  const d = Math.min(base, interval * 0.75)
  return d < 90 ? 0 : d
}
