// (Breakthrough, S4b; DESIGN §4.2.12's "Four ways through") The ways
// through the March Wall, marked on the table: a small label at each, "Gate"
// at its causeway, "Ladders" by the siege ladders' feet, "Breach" before its
// outer face and "Wood" at the Hollow Wood's track. Through the deployment
// they show by name, so a new player sees there are four; with one of the
// player's own units picked up (deploying it, or in the battle) each says
// whether that unit may take it, lit or dimmed: a Brute "rams it" and
// "ploughs it", a Nutkin "climbs", "once rammed", "once blasted down", a
// flier "flies over". Their words are the help's (present/roles.js
// rolesHelp), read off the unit's own flags through the core's queries
// (climbs) and its type's (fly, wrecker, a hull's breadth), never a rule of
// their own; the gate broken, its label says "open". DOM labels in the
// floating labels' layer, made the first time a board with a plan shows
// them (no three.js object, so no draw of the title's); nothing on any
// other board.
import * as THREE from 'three'
import { climbs } from '../core/queries.js'

const tmp = new THREE.Vector3()
const NAMES = { gate: 'Gate', ladders: 'Ladders', breach: 'Breach', wood: 'Wood' }

// where each way's label stands, from the plan (a plain record): the gate's
// causeway, the ladders' feet's middle, the breach's outer face, the wood's
// track's mouth on the attacker's side
export function waysOf(plan) {
  const sa = plan.flip ? 1 : -1, ps = plan.gate.passage
  const out = [{ k: 'gate', x: sa < 0 ? ps.x0 - 1.2 : ps.x1 + 1.2, z: plan.gate.z, y: 3.4 }]
  if (plan.ladders.length) {
    const n = plan.ladders.length
    out.push({ k: 'ladders', x: plan.ladders.reduce((s, l) => s + l.foot.x, 0) / n, z: plan.ladders.reduce((s, l) => s + l.foot.z, 0) / n, y: 3 })
  }
  if (plan.breach) out.push({ k: 'breach', x: (plan.breach.a.x + plan.breach.b.x) / 2 + sa * 1.6, z: (plan.breach.a.z + plan.breach.b.z) / 2, y: 2.4 })
  const m = plan.wood.mouths[0]
  out.push({ k: 'wood', x: m.x, z: m.z, y: 2.6 })
  return out
}

// whether unit `u` may take way `k`: { ok: true | false | 'later', say }
// (`open`: the gate is down)
export function mayTake(u, k, open = false) {
  const t = u.t
  if (t.fly) return { ok: true, say: 'flies over' }
  if (k === 'gate') return open ? { ok: true, say: 'open' } : t.wrecker ? { ok: true, say: 'rams it' } : { ok: 'later', say: 'once rammed' }
  if (k === 'ladders') return climbs(u) ? { ok: true, say: 'climbs' } : { ok: false, say: 'cannot climb' }
  if (k === 'breach') return t.wrecker ? { ok: true, say: 'ploughs it' } : { ok: 'later', say: 'once blasted down' }
  if (t.wrecker) return { ok: true, say: 'ploughs it' }
  return t.fp || u.r >= 1.5 ? { ok: false, say: 'too broad' } : { ok: true, say: 'slowly' }
}

export class Ways {
  // `labels`: the element the floating labels go in
  constructor(labels) {
    this.labels = labels
    this.shown = null
    this.items = []
    this.sig = ''
  }

  // What shows: null (nothing), or { plan, unit (the player's unit picked
  // up, or null), open (the gate down) }
  show(what) {
    const sig = what ? `${what.plan.gate.x},${what.plan.gate.z},${what.plan.flip}|${what.unit?.id ?? ''}|${what.open ? 1 : 0}` : ''
    if (sig === this.sig) return
    this.sig = sig
    if (!what) {
      for (const it of this.items) it.el.style.visibility = 'hidden'
      this.shown = null
      return
    }
    if (this.shown?.plan !== what.plan) {
      for (const it of this.items) it.el.remove()
      this.items = waysOf(what.plan).map((w) => {
        const el = document.createElement('div')
        el.className = 'wayl'
        el.dataset.way = w.k
        el.style.visibility = 'hidden'
        this.labels.appendChild(el)
        return { ...w, el, lx: NaN, ly: NaN }
      })
    }
    this.shown = what
    for (const it of this.items) {
      const m = what.unit ? mayTake(what.unit, it.k, what.open) : it.k === 'gate' && what.open ? { ok: true, say: 'open' } : null
      it.el.className = `wayl${m ? (m.ok === true ? ' ok' : m.ok === 'later' ? ' later' : ' no') : ''}`
      it.el.innerHTML = `<b>${NAMES[it.k]}</b>${m ? `<span>${m.say}</span>` : ''}`
      it.el.dataset.ok = m ? String(m.ok) : ''
    }
  }

  // Each frame (never under ?fast): each label over its way.
  animate(camera) {
    if (!this.shown) return
    for (const it of this.items) {
      tmp.set(it.x, it.y, it.z).project(camera)
      const lx = (tmp.x * 0.5 + 0.5) * innerWidth, ly = (-tmp.y * 0.5 + 0.5) * innerHeight
      if (!(Math.abs(lx - it.lx) < 0.5 && Math.abs(ly - it.ly) < 0.5)) {
        it.el.style.transform = `translate(${lx}px, ${ly}px) translate(-50%, -100%)`
        it.lx = lx
        it.ly = ly
      }
      const vis = tmp.z < 1 ? 'visible' : 'hidden'
      if (it.el.style.visibility !== vis) it.el.style.visibility = vis
    }
  }

  // (?debug, sim/hud-check.mjs) what the labels say: [{ k, ok, say, shown }]
  state() {
    return this.items.map((it) => ({ k: it.k, ok: it.el.dataset.ok, say: it.el.querySelector('span')?.textContent ?? '', shown: !!this.shown }))
  }
}
