// Rig clips -> per-node offsets (design §17.1, §17.4). A resolved model's clips
// are compiled ONCE (expressions through doc/expr.js's closure compiler, never
// eval; keyframes into typed arrays) and the evaluator is shared by every
// instance of that model: evaluate() keeps no per-instance state, so 300 horses
// hold one evaluator through the template resource.
//
// Offsets are additive to the rest pose, so clips layer:
//   rx ry rz  degrees added to the node's rest r
//   px py pz  metres added to the node's rest p
//   sx sy sz  factors multiplying the node's rest s (a weight w blends the factor
//             from 1: s = rest * (1 + Σ w (v - 1)))
// A node that some clip targets is written every frame, even when no active
// layer touches it, so a clip that stops hands its nodes back to the rest pose.
import { compileExpr } from '../../doc/expr.js'

export const CHANNEL_INDEX = Object.freeze({ rx: 0, ry: 1, rz: 2, px: 3, py: 4, pz: 5, sx: 6, sy: 7, sz: 8 })
const TRACK_RE = /^([A-Za-z_][A-Za-z0-9_-]{0,63})\.(rx|ry|rz|px|py|pz|sx|sy|sz)$/
const DEG = Math.PI / 180
const fin = (v) => typeof v === 'number' && Number.isFinite(v)
const isObj = (v) => v != null && typeof v === 'object' && !Array.isArray(v)

// Linear keyframe sampling. times ascending; `loop` wraps time into [0, duration)
// and interpolates across the seam (last key -> first key one duration later);
// otherwise time clamps to the first/last key. duration <= 0 means the last key.
export function sampleKeys (times, values, time, loop = false, duration = 0) {
  const n = times.length
  if (!n) return 0
  if (n === 1) return values[0]
  const last = times[n - 1]
  const D = duration > 0 ? duration : last
  let x = fin(time) ? time : 0
  if (loop && D > 0) {
    x = x % D; if (x < 0) x += D
    if (x < times[0] || x >= last) {
      // the seam: from the last key (at last, or last - D) to the first (at times[0] + D)
      const t0 = x >= last ? last : last - D
      const span = times[0] + D - last
      if (!(span > 0)) return x >= last ? values[n - 1] : values[0]
      const k = (x - t0) / span
      return values[n - 1] + (values[0] - values[n - 1]) * k
    }
  } else {
    if (x <= times[0]) return values[0]
    if (x >= last) return values[n - 1]
  }
  let i = 0
  while (i < n - 2 && x >= times[i + 1]) i++
  const a = times[i]; const b = times[i + 1]
  const k = b > a ? (x - a) / (b - a) : 0
  return values[i] + (values[i + 1] - values[i]) * k
}

// convenience for [[t, v], ...]
export function sampleKeyframes (keys, time, loop = false, duration = 0) {
  const k = Array.isArray(keys) ? keys.filter((p) => Array.isArray(p) && fin(+p[0]) && fin(+p[1])) : []
  return sampleKeys(k.map((p) => +p[0]), k.map((p) => +p[1]), time, loop, duration)
}

// resolved: { animations: { [clip]: { loop, once, duration?, tracks } } } (resolveRepresentation's shape)
// -> { clips: names[], nodes: names[] (every targeted node), info(clip), errors: string[],
//      evaluate(layers [{ clip, weight, time, st }], vars, out?) -> Map<node, Float64Array(9)>, dispose() }
export function makeRigEvaluator (resolved) {
  const anims = isObj(resolved?.animations) ? resolved.animations : {}
  const nodeIndex = new Map()
  const nodes = []
  const clips = new Map()
  const errors = []
  for (const name of Object.keys(anims).sort()) {
    const c = anims[name]
    if (!isObj(c)) continue
    const tracks = []
    let lastKey = 0
    const tr = isObj(c.tracks) ? c.tracks : {}
    for (const key of Object.keys(tr).sort()) {
      const m = TRACK_RE.exec(key)
      const v = tr[key]
      if (!m || v == null) continue
      let fn = null; let times = null; let values = null
      if (Array.isArray(v)) {
        const ks = v.filter((p) => Array.isArray(p) && fin(+p[0]) && fin(+p[1])).map((p) => [+p[0], +p[1]]).sort((a, b) => a[0] - b[0])
        if (!ks.length) continue
        times = Float64Array.from(ks, (p) => p[0]); values = Float64Array.from(ks, (p) => p[1])
        lastKey = Math.max(lastKey, times[times.length - 1])
      } else {
        try { fn = compileExpr(String(v)) } catch (e) { errors.push(`${name}.${key}: ${e?.message ?? e}`); continue }
      }
      let ni = nodeIndex.get(m[1])
      if (ni === undefined) { ni = nodes.length; nodeIndex.set(m[1], ni); nodes.push(m[1]) }
      tracks.push({ ni, ch: CHANNEL_INDEX[m[2]], fn, times, values })
    }
    const once = c.once === true
    clips.set(name, {
      name,
      once,
      loop: once ? false : c.loop !== false,
      duration: fin(c.duration) && c.duration > 0 ? c.duration : lastKey,
      tracks,
    })
  }
  const scratch = {}
  const bufsOf = new WeakMap() // out map -> its buffers in node order (no per-frame allocation)
  let disposed = false

  function reset (out) {
    for (const n of nodes) {
      let b = out.get(n)
      if (!b) { b = new Float64Array(9); out.set(n, b) }
      b[0] = b[1] = b[2] = b[3] = b[4] = b[5] = 0; b[6] = b[7] = b[8] = 1
    }
  }

  return {
    clips: [...clips.keys()],
    nodes,
    errors,
    has: (clip) => clips.has(String(clip)),
    info (clip) { const c = clips.get(String(clip)); return c ? { loop: c.loop, once: c.once, duration: c.duration, tracks: c.tracks.length } : null },
    evaluate (layers, vars, out = new Map()) {
      reset(out)
      if (disposed || !layers?.length) return out
      Object.assign(scratch, vars)
      let bufs = bufsOf.get(out)
      if (!bufs || bufs.length !== nodes.length || (nodes.length && out.get(nodes[0]) !== bufs[0])) { bufs = nodes.map((n) => out.get(n)); bufsOf.set(out, bufs) }
      for (const L of layers) {
        const w = +L.weight
        if (!(w > 0)) continue
        const c = clips.get(L.clip)
        if (!c) continue
        scratch.st = fin(L.st) ? L.st : (vars?.st ?? 0)
        const time = fin(L.time) ? L.time : 0
        for (const t of c.tracks) {
          const v = t.fn ? t.fn(scratch) : sampleKeys(t.times, t.values, time, c.loop, c.duration)
          const b = bufs[t.ni]
          if (t.ch < 6) b[t.ch] += w * v
          else b[t.ch] += w * (v - 1)
        }
      }
      return out
    },
    dispose () { disposed = true },
  }
}

const MAX_P = 1e4 // metres
const MAX_R = 1e6 // degrees
const MAX_S = 1e3 // scale factor
const lim = (v, m) => (v > m ? m : v < -m ? -m : v === v ? v : 0) // NaN -> 0

// Rest pose + offsets into the node groups of a rig root (built by kinds/nodes.js:
// root.userData.bones = Map<name, Group>, each group's userData.rest = { p, r (rad), s }).
// r/p add; s multiplies the node's mesh scale (a pivot with no mesh scales its group).
export function applyOffsets (rootGroup, offsets) {
  const bones = rootGroup?.userData?.bones
  if (!bones || !offsets) return
  for (const [name, o] of offsets) {
    const g = bones.get(name)
    if (!g) continue
    const r = g.userData.rest
    if (!r) continue
    // unchanged since the last write (a node no active clip moves): skip the
    // Euler -> quaternion and matrix work. patchNode re-poses to rest and clears it.
    const last = g.userData.applied
    if (last && last[0] === o[0] && last[1] === o[1] && last[2] === o[2] && last[3] === o[3] && last[4] === o[4] && last[5] === o[5] && last[6] === o[6] && last[7] === o[7] && last[8] === o[8]) continue
    if (last) last.set(o); else g.userData.applied = Float64Array.from(o)
    // each track value is finite, but a sum of layers (or a big finite value) may
    // not be: clamp, so a NaN/Infinity never reaches matrixWorld, the children and
    // the anchors a rider's camera hangs on (doc data is shared)
    g.position.set(r.p[0] + lim(o[3], MAX_P), r.p[1] + lim(o[4], MAX_P), r.p[2] + lim(o[5], MAX_P))
    g.rotation.set(r.r[0] + lim(o[0], MAX_R) * DEG, r.r[1] + lim(o[1], MAX_R) * DEG, r.r[2] + lim(o[2], MAX_R) * DEG)
    const target = g.userData.mesh ?? g
    target.scale.set(lim(r.s[0] * o[6], MAX_S), lim(r.s[1] * o[7], MAX_S), lim(r.s[2] * o[8], MAX_S))
  }
}
