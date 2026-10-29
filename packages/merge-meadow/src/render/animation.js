// Semantic animation state (live.anim, written by the sim's animate system) ->
// a clip. Shared by the `model` and `critter` kinds. The sim never names a clip:
// it says "run", and this module finds the best thing the look can do about it
// (design §8): the entity's explicit mapping, then a clip with that name, then a
// clip whose name contains it ("CharacterArmature|Run"), then the fallback chain.
import * as THREE from 'three'

export const STATES = ['idle', 'walk', 'run', 'attack', 'die', 'sit']
export const FALLBACK = { idle: [], walk: ['idle'], run: ['walk', 'idle'], attack: ['idle'], sit: ['idle'], die: [] }
const ONCE = new Set(['die'])

// clips: [{ name }...]; mapping: animation.clips ({ walk: 'Walk_Cycle' }) or null.
// -> { clip, as } where `as` is the state actually played, or null (halt: a look
// with no die clip freezes where it is instead of snapping back to its bind pose)
export function pickClip (state, clips, mapping) {
  const list = clips ?? []
  if (!list.length) return null
  const byName = new Map(list.map((c) => [String(c.name), c]))
  const lower = new Map(list.map((c) => [String(c.name).toLowerCase(), c]))
  const s0 = String(state ?? 'idle')
  const chain = [s0, ...(FALLBACK[s0] ?? ['idle'])]
  for (const s of chain) {
    const named = mapping?.[s]
    if (named != null && named !== '') {
      const n = String(named)
      if (byName.has(n)) return { clip: byName.get(n), as: s }
      if (lower.has(n.toLowerCase())) return { clip: lower.get(n.toLowerCase()), as: s }
    }
    if (lower.has(s)) return { clip: lower.get(s), as: s }
    for (const [k, c] of lower) if (k.includes(s)) return { clip: c, as: s }
  }
  if (s0 === 'die') return null
  return { clip: list[0], as: 'idle' }
}

export const animStats = { live: 0, made: 0 }

// root: the object the clips' track names resolve under; clips: AnimationClip[]
export function makeAnimator (root, clips) {
  const mixer = new THREE.AnimationMixer(root)
  let key = null
  let action = null
  let state = null
  let disposed = false
  animStats.live++; animStats.made++
  const A = {
    mixer,
    clips,
    get state () { return state },
    get action () { return action },
    get clipName () { return action?.getClip().name ?? null },
    // cheap when nothing changed: called every frame with the current state
    set (next = 'idle', { fade = 0.2, mapping = null } = {}) {
      const k = next + '|' + (mapping ? JSON.stringify(mapping) : '')
      if (k === key || disposed) return
      key = k; state = next
      const pick = pickClip(next, clips, mapping)
      if (!pick) { if (action) action.halt(fade); return }
      const a = mixer.clipAction(pick.clip)
      if (a === action && a.isRunning()) return
      // reset() leaves timeScale alone, and halt() warped it to 0
      a.reset().setEffectiveTimeScale(1).setEffectiveWeight(1)
      if (ONCE.has(pick.as)) { a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true } else a.setLoop(THREE.LoopRepeat, Infinity)
      a.play()
      if (action && action !== a) action.crossFadeTo(a, fade, false)
      action = a
    },
    update (dt) {
      if (disposed) return
      mixer.update(dt)
    },
    dispose () {
      if (disposed) return
      disposed = true; animStats.live--
      mixer.stopAllAction()
      for (const c of clips) mixer.uncacheClip(c)
      mixer.uncacheRoot(root)
    },
  }
  return A
}
