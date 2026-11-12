// A puppet: one cast member on stage — their look, their CHIMERA head, and where they are.
import { Head, REST_ARTIC, articFromArray } from '../engine/heads.js'
import { lookFor } from '../looks.js'
import { CAST } from '../cast.js'
import { ARTIC_KEYS } from '../../chimera/wasm/engine.ts'

const REST_ARR = Float32Array.from(ARTIC_KEYS.map((k) => REST_ARTIC[k]))

export class Puppet {
  constructor(id) {
    this.id = id
    this.cast = CAST[id] ?? { name: id.replace(/(^|[-_])(\w)/g, (_, s, c) => (s ? ' ' : '') + c.toUpperCase()), title: '', body: { female: 0.5, child: 0 } }
    this._look = null
    this.body = this.cast.body ?? { female: 0.5, child: 0 }
    this.head = null
    // smoothed state
    this.az = NaN
    this.visible = false
    this.place = null
    this.screen = null
    this.tele = null
    this.artic = REST_ARTIC
    this.speaking = 0
    this.msgs = new Map()
    this.spans = []
    this.skip = 0
    this.tmpA = new Float32Array(ARTIC_KEYS.length)
    this.tmpB = new Float32Array(ARTIC_KEYS.length)
  }

  /** the look: LOOKS[id] (so defineLook() in setup applies), unless dress() replaced it */
  get look() {
    return this._look ?? lookFor(this.id)
  }

  get name() {
    return this.look.displayName ?? this.cast.name
  }

  get color() {
    return this.look.color
  }

  ensureHead() {
    const pal = this.look.head
    if (this.head && this.head.palette !== pal) {
      this.head.dispose()
      this.head = null
    }
    if (!this.head) this.head = new Head(this.body, pal)
    return this.head
  }

  /** replace the look (costume/colours); the head is rebuilt in its new palette */
  dress(look) {
    this._look = { ...this.look, ...look }
  }

  /** a TelemetryMessage buffer for a block layout */
  msgFor(block) {
    const key = `${block.nPh}/${block.nOr}/${block.nArtic}/${block.scope}`
    let m = this.msgs.get(key)
    if (!m) this.msgs.set(key, (m = block.makeMessage()))
    return m
  }

  /**
   * This puppet's telemetry at segment time t: the active line's frame, or null with the mouth
   * easing out of the last line / into the next one.
   */
  sample(t, beatStep) {
    const spans = this.spans
    let cur = null, prev = null, next = null
    for (const s of spans) {
      if (t >= s.start && t <= s.end) cur = s
      else if (s.end < t && (!prev || s.end > prev.end)) prev = s
      else if (s.start > t && (!next || s.start < next.start)) next = s
    }
    if (cur) {
      const msg = this.msgFor(cur.block)
      cur.block.fill(msg, cur.block.frameAt(t - cur.start), t)
      msg.beatStep = beatStep
      this.tele = msg
      this.artic = articFromArray(msg.t.artic)
      this.speaking = cur.line.kind === 'beat' ? 0.6 : 1
      return
    }
    this.tele = null
    this.speaking = 0
    const OUT = 0.35, IN = 0.14
    let a = null
    if (prev && t - prev.end < OUT) {
      const u = (t - prev.end) / OUT
      prev.block.articAt(prev.block.frames - 1, this.tmpA)
      a = blend(this.tmpA, REST_ARR, u * u * (3 - 2 * u))
    }
    if (next && next.start - t < IN) {
      const u = 1 - (next.start - t) / IN
      next.block.articAt(0, this.tmpB)
      a = blend(a ?? REST_ARR, this.tmpB, u * u * (3 - 2 * u))
    }
    this.artic = a ? articFromArray(a) : REST_ARTIC
  }
}

function blend(a, b, u) {
  const out = new Float32Array(a.length)
  for (let i = 0; i < a.length; i++) out[i] = a[i] + (b[i] - a[i]) * u
  return out
}
