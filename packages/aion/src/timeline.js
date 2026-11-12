// Turns the cue list into a clock: where each cue starts, what the model's
// state is at any instant, and where the camera is. Everything is a pure
// function of time, so scrubbing backward is as exact as playing forward.
import * as THREE from 'three'
import { CUES, DEFAULTS } from './script.js'
import { ease, lerp } from './util.js'

export function makeTimeline(toWorld) {
  let t0 = 0, chapter = null, chapterIndex = -1
  const cues = CUES.map((c, i) => {
    if (c.ch) { chapter = c.ch; chapterIndex++ }
    const plain = c.text.replace(/\[\[[\w-]+\]\]/g, '')
    const dur = Math.max(7, 2.6 + plain.length / 15.5)
    const P = p => (c.shot.f === 'o' ? toWorld(p) : new THREE.Vector3(...p))
    const at = P(c.shot.at), from = P(c.shot.from)
    const cue = { ...c, i, start: t0, dur, chapter, chapterIndex, first: !!c.ch, at, dir: from.clone().sub(at).normalize(), dist: from.distanceTo(at), move: Math.min(c.move ?? 3.6, dur * 0.7) }
    t0 += dur
    return cue
  })
  const total = t0

  // per-variable keyframes: [start, value, ramp]
  const keys = {}
  for (const k of Object.keys(DEFAULTS)) keys[k] = []
  for (const c of cues) for (const [k, v] of Object.entries(c.set || {})) {
    const [value, ramp] = Array.isArray(v) ? v : [v, 2.8]
    keys[k].push([c.start, value, Math.min(ramp, c.dur)])
  }

  const cueAt = t => { let i = cues.length - 1; while (i > 0 && cues[i].start > t) i--; return cues[i] }

  function state(t) {
    const s = {}
    for (const k of Object.keys(DEFAULTS)) {
      let v = DEFAULTS[k]
      for (const [start, value, ramp] of keys[k]) { if (t < start) break; v = lerp(v, value, ease((t - start) / ramp)) }
      s[k] = v
    }
    return s
  }

  const q0 = new THREE.Quaternion(), q1 = new THREE.Quaternion(), q = new THREE.Quaternion(), Zp = new THREE.Vector3(0, 0, 1)
  function camera(t, out) {
    const c = cueAt(t), p = cues[Math.max(0, c.i - 1)]
    const k = c.i === 0 ? 1 : ease((t - c.start) / c.move)
    // zoom in log-space; when zooming in, settle on the target early so it stays in frame
    const zoomIn = c.dist < p.dist
    const ratio = Math.abs(Math.log(c.dist / p.dist))
    const kt = ratio < 0.7 ? k : zoomIn ? 1 - (1 - k) ** (1 + ratio) : k ** (1 + ratio)
    out.at.lerpVectors(p.at, c.at, kt)
    out.dist = Math.exp(lerp(Math.log(p.dist), Math.log(c.dist), k))
    q0.setFromUnitVectors(Zp, p.dir); q1.setFromUnitVectors(Zp, c.dir); q.slerpQuaternions(q0, q1, k)
    out.dir.copy(Zp).applyQuaternion(q)
    return out
  }

  return { cues, total, cueAt, state, camera }
}
