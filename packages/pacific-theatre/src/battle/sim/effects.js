// What the scene learns (ENGINEERING.md §5): the effects ring, capacity
// 2048 with the oldest dropped, drained once a frame after advance, and the
// beats the HUD shows as subtitles. Every entry carries the step's t. The
// beats' words are the register of R8 §5.1: the ship's name and what
// happened, never "Kill", "Destroyed" or "Mission accomplished"; a sinking
// of either navy reads the same.

export const EFFECT_KINDS = ['flash', 'splash', 'hit', 'fire', 'smoke', 'explode', 'sink', 'fall', 'gone', 'wake', 'starshell', 'searchlight', 'tracer', 'launch', 'spawn', 'despawn']
export const FX = Object.fromEntries(EFFECT_KINDS.map((k, i) => [k, i]))

// splash colours by day: the dyes the record gives (R7 §4.5); white at night
export const DYES = ['white', 'red', 'black', 'blue', 'yellow', 'green', 'orange']
export const dyeCode = (name) => Math.max(0, DYES.indexOf(String(name || 'white').toLowerCase()))

export class EffectsRing {
  constructor(cap) {
    this.capacity = cap
    this.kindArr = new Uint8Array(cap)
    this.t = new Float64Array(cap)
    this.unit = new Int16Array(cap)
    this.p = new Float64Array(3 * cap)
    this.d = new Float32Array(3 * cap)
    this.size = new Float32Array(cap)
    this.data = new Float32Array(cap)
    this.head = 0 // next write
    this.count = 0
    this.total = 0
    this.dropped = 0
    this.e = { kind: '', k: 0, t: 0, unit: -1, x: 0, y: 0, z: 0, dx: 0, dy: 0, dz: 0, size: 0, data: 0 }
  }

  push(kind, t, x, y, z, { unit = -1, dx = 0, dy = 0, dz = 0, size = 0, data = 0 } = {}) {
    const i = this.head
    if (this.count === this.capacity) this.dropped++
    else this.count++
    this.kindArr[i] = typeof kind === 'number' ? kind : FX[kind]
    this.t[i] = t
    this.unit[i] = unit
    this.p[3 * i] = x
    this.p[3 * i + 1] = y
    this.p[3 * i + 2] = z
    this.d[3 * i] = dx
    this.d[3 * i + 1] = dy
    this.d[3 * i + 2] = dz
    this.size[i] = size
    this.data[i] = data
    this.head = (i + 1) % this.capacity
    this.total++
  }

  /** Hand every queued effect to fn (oldest first) and empty the ring. The object passed is reused. */
  drain(fn) {
    const n = this.count
    let i = (this.head - n + this.capacity) % this.capacity
    const e = this.e
    for (let c = 0; c < n; c++) {
      e.k = this.kindArr[i]
      e.kind = EFFECT_KINDS[e.k]
      e.t = this.t[i]
      e.unit = this.unit[i]
      e.x = this.p[3 * i]
      e.y = this.p[3 * i + 1]
      e.z = this.p[3 * i + 2]
      e.dx = this.d[3 * i]
      e.dy = this.d[3 * i + 1]
      e.dz = this.d[3 * i + 2]
      e.size = this.size[i]
      e.data = this.data[i]
      fn(e)
      i = (i + 1) % this.capacity
    }
    this.count = 0
  }

  clear() {
    this.count = 0
  }
}

const WORDS = {
  hit: 'hit',
  'torpedo-hit': 'torpedo hit',
  'near-miss': 'near miss',
  fire: 'on fire',
  flood: 'flooding',
  list: 'listing',
  'dead-in-water': 'dead in the water',
  explodes: 'explosion',
  sinks: 'sinks',
  scuttled: 'scuttled',
  abandoned: 'abandon ship',
  launches: 'launching',
  recovers: 'recovering aircraft',
  turns: 'turns',
  'opens-fire': 'opens fire',
  'ceases-fire': 'ceases fire',
  'torpedoes-fired': 'torpedoes in the water',
  'smoke-screen': 'making smoke',
  searchlight: 'searchlight on',
  illuminated: 'illuminated',
  starshell: 'star shell',
  'steering-jammed': 'steering jammed',
  'power-failure': 'power lost',
  'radar-lost': 'radar out',
  collision: 'collision',
  signal: 'signal',
  sighted: 'sighted',
  withdraws: 'withdraws',
  aground: 'aground',
}

/** A beat's line for a record event on a unit: "Kaga: hit amidships". */
export function eventLine(name, ev, extra = '') {
  if (ev.text) return ev.text
  let w = WORDS[ev.kind] || ev.kind
  if ((ev.kind === 'hit' || ev.kind === 'torpedo-hit' || ev.kind === 'near-miss') && ev.where) w = `${w} ${ev.where}`
  if (extra) w = `${w}${extra}`
  return `${name}: ${w}`
}
