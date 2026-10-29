// The built-in simulation (design §3.2): fixed system order with gaps for doc
// systems. Every peer runs every system; systems only WRITE entities this peer
// owns (world.owns). Nothing here knows a species: every animal is a preset over
// the general vocabulary (a unit test greps this directory to keep it that way).
import { owned, initLive, hpOf, DEG } from './util.js'
import { installLifecycle, teleport } from './lifecycle.js'
import { installPerceive } from './perceive.js'
import { installDecide } from './decide.js'
import { installControl } from './control.js'
import { installSteer } from './steer.js'
import { installIntegrate } from './integrate.js'
import { installMount } from './mount.js'
import { installAttack } from './attack.js'
import { installHealth } from './health.js'
import { installEvents } from './events.js'
import { installAnimate } from './animate.js'
import { hash32 } from '../core/world.js'

export const ORDER = Object.freeze({ lifecycle: 0, perceive: 100, decide: 200, control: 300, steer: 400, integrate: 500, mount: 600, attack: 700, health: 800, events: 900, scripts: 950, animate: 1000, net: 1100 })
export const BUILTIN_SYSTEMS = Object.freeze(['lifecycle', 'perceive', 'decide', 'control', 'steer', 'integrate', 'mount', 'attack', 'health', 'events', 'animate'])

// inputs: () => Map<entityId, { move: [x, z] }>   ground: (x, z) => y
// anchor?: (id, name) => [x, y, z] | null (a render anchor's world position, e.g. a seat)
// hitBase?: string (tests pin it; default is per session)
export function installSim (world, { inputs, ground, events, peerId, anchor, hitBase } = {}) {
  const ev = events ?? world.events
  const pid = peerId ?? world.peerId
  // live pose from the rest pose. The owner of a simulated entity (one with a
  // body) ignores later doc transforms: they are its own checkpoints, or edits
  // that reach it as an inbox `move` (design §4.4). Static entities and
  // entities simulated elsewhere follow the doc (the stream overrides the latter).
  const off = world.registerComponent('transform', {
    order: -1000,
    add: (e, t) => { if (!e.live.p) initLive(e, t) },
    change: (e, t) => {
      if (world.owns(e.id) && e.c.body) return
      if (Array.isArray(t.p)) e.live.p = [Number(t.p[0]) || 0, Number(t.p[1]) || 0, Number(t.p[2]) || 0]
      if (Array.isArray(t.r)) e.live.yaw = (Number(t.r[1]) || 0) * DEG
    },
  })
  const o = { events: ev }
  installLifecycle(world, { ...o, order: ORDER.lifecycle })
  installPerceive(world, { ...o, order: ORDER.perceive })
  installDecide(world, { ...o, order: ORDER.decide })
  installControl(world, { ...o, order: ORDER.control, inputs })
  installSteer(world, { ...o, order: ORDER.steer })
  installIntegrate(world, { ...o, order: ORDER.integrate, ground })
  installMount(world, { ...o, order: ORDER.mount, anchor })
  installAttack(world, { ...o, order: ORDER.attack, peerId: pid, hitBase })
  installHealth(world, { ...o, order: ORDER.health })
  installEvents(world, { ...o, order: ORDER.events })
  installAnimate(world, { ...o, order: ORDER.animate })
  return {
    teleport: (id, p, yawDeg) => teleport(world, id, p, yawDeg),
    uninstall () { off(); for (const n of BUILTIN_SYSTEMS) world.removeSystem(n) },
  }
}

export { teleport }

const r4 = (x) => (Number.isFinite(x) ? x.toFixed(4) : 'x')
// deterministic hash of owned entities' live pose and intent (tests, divergence checks)
export function simHash (world) {
  const parts = []
  for (const e of owned(world, new Set(world.entities.values()))) {
    const l = e.live
    if (!l.p) continue
    parts.push(`${e.id}:${l.p.map(r4).join(',')}:${r4(l.yaw)}:${l.intent?.act ?? '-'}>${l.intent?.target ?? ''}`)
  }
  return hash32(parts.join('|')).toString(16).padStart(8, '0')
}

const copy = (v) => (v == null ? v : JSON.parse(JSON.stringify(v)))
// why is it doing that? plain data only (it crosses CapTP)
export function explain (world, id) {
  const e = world.get(id)
  if (!e) return null
  const l = e.live
  return {
    id,
    owner: world.owner(id) ?? null,
    owned: world.owns(id),
    local: !!e.local,
    intent: l.intent ? copy({ act: l.intent.act, target: l.intent.target ?? null, from: l.intent.from ?? [], drive: l.intent.drive ?? null, speedMul: l.intent.speedMul ?? 1, score: l.intent.score ?? 0, by: l.intent.by ?? null }) : null,
    drives: copy(l.scores ?? []),
    sensed: l.sensed?.length ?? 0,
    hp: hpOf(e),
    anim: l.anim ?? null,
    p: l.p ? [...l.p] : null,
    speed: l.v ? Math.hypot(l.v[0], l.v[2]) : 0,
    groups: [...e.groups],
  }
}
