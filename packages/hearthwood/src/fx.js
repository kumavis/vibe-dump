// Cosmetic effect ring + gameplay event ring. ARCHITECT-OWNED, fully implemented.
//
// FxRing: the sim (combat, buildings, units) emits short-lived visual effects;
// the renderer draws every entry whose age (ctx.tick - tick[i]) < FX_LIFE[kind].
// Effects never affect simulation state. Overwrites the oldest entry when full.
//
// EventRing: gameplay notifications for the HUD (toasts, wave warnings).
// Writers call emit(); each reader keeps its own cursor (a write count) and
// calls read(cursor, cb-free loop) — see EventRing.since().

import { FX_CAPACITY, EV_CAPACITY } from './constants.js'

export class FxRing {
  constructor(capacity = FX_CAPACITY) {
    if (capacity & (capacity - 1)) throw new Error('FxRing capacity must be a power of two')
    this.capacity = capacity
    this.mask = capacity - 1
    this.kind = new Uint8Array(capacity)
    this.tick = new Int32Array(capacity)
    this.x0 = new Float32Array(capacity)
    this.y0 = new Float32Array(capacity)
    this.x1 = new Float32Array(capacity)
    this.y1 = new Float32Array(capacity)
    /** total entries ever written; slot of entry n is n & mask */
    this.written = 0
  }
  /** Coordinates in tile units (world coords). */
  emit(kind, x0, y0, x1, y1, tick) {
    const i = this.written & this.mask
    this.kind[i] = kind
    this.tick[i] = tick
    this.x0[i] = x0; this.y0[i] = y0; this.x1[i] = x1; this.y1[i] = y1
    this.written++
  }
  /** Oldest still-stored write index (iterate n from first() to written-1, slot = n & mask). */
  first() { return this.written > this.capacity ? this.written - this.capacity : 0 }
  clear() { this.written = 0 }
}

export class EventRing {
  constructor(capacity = EV_CAPACITY) {
    if (capacity & (capacity - 1)) throw new Error('EventRing capacity must be a power of two')
    this.capacity = capacity
    this.mask = capacity - 1
    this.type = new Uint8Array(capacity)
    this.a = new Int32Array(capacity)
    this.b = new Int32Array(capacity)
    this.tick = new Int32Array(capacity)
    this.written = 0
  }
  emit(type, a, b, tick) {
    const i = this.written & this.mask
    this.type[i] = type; this.a[i] = a | 0; this.b[i] = b | 0; this.tick[i] = tick | 0
    this.written++
  }
  /**
   * First readable write index for a reader whose cursor is `cursor`.
   * Usage: for (let n = ring.since(cur); n < ring.written; n++) { const s = n & ring.mask; ... } cur = ring.written
   */
  since(cursor) { const lo = this.written - this.capacity; return cursor < lo ? lo : cursor }
}
