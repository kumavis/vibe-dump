// Semantic state -> clip layers for a rig (design §17.1 layer 3). The sim writes
// live.anim (idle/walk/run/attack/die/sit); the model's controller maps a state
// to one or more clips that play together, e.g. walk: ['walk', 'breathe'].
//
// Resolution per state (the chain of animation.js: run -> walk -> idle,
// attack -> idle, sit -> idle, unknown -> idle, die -> nothing):
//   the entity's `animation.clips` mapping, then controller.states[state], then a
//   clip named like the state; after the chain, the first looping clip (a tree
//   with one 'sway' clip and no controller just sways). A `die` that finds no
//   clip HALTS: the look freezes where it is instead of snapping to rest.
//
// A state change crossfades over controller.blend seconds: the incoming set rises
// 0 -> 1 while every outgoing set falls from the weight it had, so the weights of
// the sets always sum to 1. A looping clip that is in both sets (breathe) keeps
// its clock and is reported once, with the summed weight. A `once` clip plays
// from the state's entry and clamps at its duration (both time and st).
import { FALLBACK } from '../animation.js'

const fin = (v) => typeof v === 'number' && Number.isFinite(v)
const isObj = (v) => v != null && typeof v === 'object' && !Array.isArray(v)
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x)

// -> { set(state, now, { mapping, since }) -> changed, layers(now) -> [{ clip, weight, time, st }], state, halted, as, blend }
export function makeRigController (resolved, opts = {}) {
  const anims = isObj(resolved?.animations) ? resolved.animations : {}
  const ctl = isObj(resolved?.controller) ? resolved.controller : {}
  const states = isObj(ctl.states) ? ctl.states : {}
  const blend = fin(opts.blend) && opts.blend >= 0 ? opts.blend : fin(ctl.blend) && ctl.blend >= 0 ? ctl.blend : 0.15
  const names = Object.keys(anims).filter((n) => isObj(anims[n])).sort()
  const meta = (n) => {
    const c = anims[n]
    const once = c.once === true
    let duration = fin(c.duration) && c.duration > 0 ? c.duration : 0
    if (!duration) for (const v of Object.values(isObj(c.tracks) ? c.tracks : {})) if (Array.isArray(v) && v.length) duration = Math.max(duration, +v[v.length - 1]?.[0] || 0)
    return { once, loop: once ? false : c.loop !== false, duration }
  }
  const META = new Map(names.map((n) => [n, meta(n)]))
  const firstLoop = names.find((n) => META.get(n).loop) ?? names[0] ?? null

  // state -> { list: clip names, as } | null (halt)
  function pick (s0, mapping) {
    const chain = [s0, ...(FALLBACK[s0] ?? ['idle'])]
    for (const s of chain) {
      const m = mapping?.[s]
      if (m != null && m !== '' && META.has(String(m))) return { list: [String(m)], as: s }
      const v = states[s]
      if (v != null) {
        const list = (Array.isArray(v) ? v : [v]).map(String).filter((n) => META.has(n))
        if (list.length) return { list: [...new Set(list)], as: s }
      }
      if (META.has(s)) return { list: [s], as: s }
    }
    if (s0 === 'die') return null
    return { list: firstLoop ? [firstLoop] : [], as: 'idle' }
  }

  let state = null
  let as = null
  let mappingRef
  let sets = [] // [{ clips: [{ name, start, once, duration }], t0 (state entry), w0 }]; the last is the current set
  let fadeT0 = 0
  let fading = false
  let halted = false
  let haltAt = 0
  let first = true
  const out = []

  const kAt = (now) => (!fading ? 1 : blend > 0 ? clamp01((now - fadeT0) / blend) : 1)
  function weightOf (i, k) { return i === sets.length - 1 ? (fading ? k : 1) : sets[i].w0 * (1 - k) }

  const C = {
    get state () { return state },
    get as () { return as },
    get halted () { return halted },
    get blend () { return blend },
    clips: names,
    // cheap when nothing changed (called every frame); -> true when it changed something
    set (next = 'idle', now = 0, { mapping = null, since = null } = {}) {
      const s = String(next ?? 'idle')
      if (s === state && mapping === mappingRef) return false
      state = s; mappingRef = mapping
      const p = pick(s, mapping)
      // a look rebuilt mid-state (a model edit) picks the state up where it was
      const entered = first && fin(since) && since > 0 ? now - since : now
      if (!p) {
        if (!halted) { halted = true; haltAt = now }
        if (first) { sets = []; first = false }
        as = 'die'
        return true
      }
      as = p.as
      const prevStart = new Map()
      for (const set of sets) for (const c of set.clips) if (!c.once && !prevStart.has(c.name)) prevStart.set(c.name, c.start)
      const incoming = { t0: entered, w0: 0, clips: p.list.map((name) => { const m = META.get(name); return { name, once: m.once, duration: m.duration, start: m.once ? entered : (prevStart.get(name) ?? entered) } }) }
      if (first || halted || blend <= 0 || !sets.length) {
        incoming.w0 = 1; sets = [incoming]; fading = false
      } else {
        const k = kAt(now)
        const outgoing = []
        sets.forEach((set, i) => { const w = weightOf(i, k); if (w > 1e-6) outgoing.push({ ...set, w0: w }) })
        // renormalise against drift so the outgoing weights sum to exactly 1
        const sum = outgoing.reduce((a, x) => a + x.w0, 0)
        for (const o of outgoing) o.w0 = sum > 0 ? o.w0 / sum : 0
        sets = [...outgoing, incoming]; fadeT0 = now; fading = outgoing.length > 0
      }
      halted = false; first = false
      return true
    },
    // the active layers at `now` (frozen at the halt time while halted). The
    // returned array and its entries are reused: copy them to keep them.
    layers (now = 0) {
      const t = halted ? haltAt : now
      let k = kAt(t)
      if (fading && k >= 1 && !halted) { sets = [sets[sets.length - 1]]; sets[0].w0 = 1; fading = false; k = 1 }
      let n = 0
      const seen = new Map()
      for (let i = 0; i < sets.length; i++) {
        const set = sets[i]
        const w = weightOf(i, k)
        if (!(w > 0)) continue
        for (const c of set.clips) {
          let st = t - set.t0
          let time = c.once ? st : t - c.start
          if (c.once && c.duration > 0) { st = Math.min(Math.max(st, 0), c.duration); time = st }
          const dup = !c.once ? seen.get(c.name) : undefined
          if (dup !== undefined) { const L = out[dup]; L.weight += w; L.time = time; L.st = st; continue }
          let L = out[n]
          if (!L) out[n] = L = { clip: '', weight: 0, time: 0, st: 0 }
          L.clip = c.name; L.weight = w; L.time = time; L.st = st
          if (!c.once) seen.set(c.name, n)
          n++
        }
      }
      out.length = n
      return out
    },
  }
  return C
}
