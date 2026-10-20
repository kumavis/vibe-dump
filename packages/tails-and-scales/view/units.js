// The units' figures (DESIGN §1.1, §2.4): UnitViews keeps each unit's view,
// by unit id: its figures (one per model, view/models/cache.js), its
// selection ring, its hit cylinder (for picking) and floating label, which
// way it faces, whether it is walking; and per model (models[k] draws the
// unit's models[k]) where its figure stands this frame, which way it turns
// and how it lunges, lifts, flinches, dies or flees. The rules never read
// any of it. It follows the unit as shown (the mirror's record of it,
// present/mirror.js: its place, its slots, who still stands), and of the
// unit itself keeps only what never changes in a match (`v.u`: its type,
// its seat, its race), so a view made from one match's unit serves the
// same unit of another match on the same table (the title's backdrop and
// the battle started on it, §2.9).
//
// It plays the figures' events (unit.wound, unit.slain, unit.flee,
// unit.destroyed, unit.face, unit.move, melee, charge.result) as the
// EventPlayer hands them over (view/player.js), and is made afresh, or
// brought into line, from a match as it stands by sync() (the player's
// snap: a new table, a battle's start).
//
// R7 moved it out of main.js (makeView, syncView, updateLabel, clearUnits,
// animateUnits and the figures' handlers) unchanged, but that a figure now
// comes from the template cache and what only it used is freed as it leaves
// the table, and that a view keeps the unit's id and static look rather
// than being rebound to each match's unit object (main.js's bindViews).
import * as THREE from 'three'
import { RACES } from '../data/schema.js'
import { hypot } from '../core/dmath.js'
import { PACE } from '../present/pace.js'
import { buildModel, disposeFigure } from './models/cache.js'
import { tween, wait, easeOut, easeInOut, wrapAngle, lerp } from './clock.js'
import { sfx } from './sfx.js'

// every unit's ring and hit cylinder have these shapes (scaled to its disc;
// made at the first unit's view, never as the module loads: three.js draws
// Math.random for every object's uuid, and the table is painted from
// Math.random as the page loads)
let shapes = null
const ringShapes = () => (shapes ??= { ring: new THREE.RingGeometry(0.88, 1, 48).rotateX(-Math.PI / 2), hit: new THREE.CylinderGeometry(1, 1, 1, 12) })
const tmpV = new THREE.Vector3()

export class UnitViews {
  // `mirror()`: the mirror the table shows (the player's); `colorOf(seat)`
  // a seat's colour; `labels` the element the floating labels go in; `W`
  // the board's width (a fleeing figure runs off it)
  constructor({ scene, labels, fx, mirror, colorOf, W }) {
    this.scene = scene
    this.W = W
    this.labels = labels
    this.effects = fx
    this.mirror = mirror
    this.colorOf = colorOf
    this.views = new Map()
    // bumped by every sync: a playback still running from before it (a walk,
    // a death) touches nothing of the views it left
    this.gen = 0
  }

  // the view of unit `id`, and the unit it shows (its static look)
  get(id) {
    return this.views.get(id)
  }
  unit(id) {
    return this.views.get(id).u
  }
  // the unit as shown
  shown(id) {
    return this.mirror().units[id]
  }
  // the figures of a unit's models still standing
  standing(id) {
    const mu = this.shown(id)
    return this.views.get(id).models.filter((_, k) => mu.models[k].alive)
  }
  // over a unit's head, as shown
  top(id) {
    const p = this.shown(id).pos
    return { x: p.x, y: this.unit(id).t.big ? 2.6 : 1.6, z: p.z }
  }
  // whether a playback begun on view `v` is left over from a table (or a
  // snap) since: it then touches nothing
  gone(id, v, gen) {
    return this.views.get(id) !== v || this.gen !== gen
  }

  // ── Making and unmaking ───────────────────────────────────────────────────
  // A unit's view: its figures (in its seat's colour, facing across the
  // table, away from the seat's own edge: kept, so a fleeing figure runs off
  // over it), its ring, its hit cylinder, its label; the figures standing in
  // their slots as shown (only the models standing get one).
  make(u, edge, color) {
    const facing = -edge * Math.PI / 2
    const mu = this.shown(u.id)
    // (at: where a walk has got to while a unit.move plays; null otherwise)
    const v = { id: u.id, u, edge, color, facing, moving: false, at: null, models: [] }
    const kit = RACES[u.race].look.models
    for (let i = 0; i < u.t.models; i++) {
      if (!mu.models[i].alive) {
        v.models.push({ mesh: null, x: 0, z: 0, yaw: facing, lunge: 0, lungeDir: 0, lift: 0 })
        continue
      }
      const mesh = buildModel(kit, u.key, u.t, color)
      this.scene.add(mesh)
      v.models.push({ mesh, x: 0, z: 0, yaw: facing, lunge: 0, lungeDir: 0, lift: 0 })
    }
    // selection / status ring
    const { ring, hit } = ringShapes()
    v.ring = new THREE.Mesh(ring, new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false, toneMapped: false }))
    v.ring.position.y = 0.04
    v.ring.renderOrder = 2
    this.scene.add(v.ring)
    v.hit = new THREE.Mesh(hit, new THREE.MeshBasicMaterial({ visible: false }))
    v.hit.userData.id = u.id
    this.scene.add(v.hit)
    v.label = document.createElement('div')
    v.label.className = `ulabel s${u.side}`
    this.labels.appendChild(v.label)
    this.views.set(u.id, v)
    this.disc(u.id)
    this.stands(v, mu.alive > 0)
    // the figures stand in their slots from the start
    this.place(v)
    return v
  }

  // The ring and the hit cylinder of a unit standing, or (a unit destroyed,
  // as its unit.destroyed left them) neither.
  stands(v, standing) {
    v.ring.visible = standing
    v.hit.visible = standing
    if (standing && !v.hit.parent) this.scene.add(v.hit)
    if (!standing) this.scene.remove(v.hit)
  }

  // Each figure standing exactly in its model's slot as shown, turned the
  // unit's way, nothing of a lunge, a lift or a flinch left on it.
  place(v) {
    const mu = this.shown(v.id)
    mu.models.forEach((m, k) => {
      const f = v.models[k]
      if (!f.mesh) return
      f.x = mu.pos.x + m.ox
      f.z = mu.pos.z + m.oz
      f.mesh.position.set(f.x, 0, f.z)
      f.mesh.rotation.y = f.yaw
    })
  }

  // A figure off the table for good: what only it used is freed.
  unfigure(f) {
    if (!f.mesh) return
    this.scene.remove(f.mesh)
    disposeFigure(f.mesh)
  }

  drop(v) {
    for (const f of v.models) this.unfigure(f)
    this.scene.remove(v.ring, v.hit)
    v.ring.material.dispose()
    v.hit.material.dispose()
    v.label.remove()
    this.views.delete(v.id)
  }

  // every figure off the table and freed (a new table; §1.3's dispose, as
  // TerrainView's)
  dispose() {
    for (const v of [...this.views.values()]) this.drop(v)
    this.gen++
  }

  // Bring the views into line with `units` as the mirror shows them (the
  // player's snap, view/player.js; `edgeOf(seat)` a seat's edge): a unit's
  // view is kept while it shows the same unit (its type, seat and race, in
  // the same colour, the ids being the match's), its figures kept where
  // their models still stand and put exactly in their slots, a standing
  // model without a figure given one, a fallen one's taken away; any other
  // unit gets a new view, and a view no unit has goes. What a view keeps
  // outside the mirror is reset: no walk under way, every figure turned the
  // unit's way, a war machine's arm at rest and its globe on it. (A new
  // table clears the views first, so all are new.)
  sync(units, edgeOf) {
    this.gen++
    const M = this.mirror()
    const ids = new Set(units.map((u) => u.id))
    for (const v of [...this.views.values()]) if (!ids.has(v.id)) this.drop(v)
    for (const u of units) {
      const edge = edgeOf(u.side), color = this.colorOf(u.side)
      let v = this.views.get(u.id)
      // (the type is the race's unit: the same type, the same race and key)
      if (v && (v.u.t !== u.t || v.u.side !== u.side || v.edge !== edge || v.color !== color)) {
        this.drop(v)
        v = null
      }
      if (!v) {
        this.make(u, edge, color)
        continue
      }
      const mu = M.units[u.id]
      const kit = RACES[u.race].look.models
      v.at = null
      v.moving = false
      v.facing = -edge * Math.PI / 2
      v.models.forEach((f, k) => {
        if (!mu.models[k].alive) {
          this.unfigure(f)
          v.models[k] = { mesh: null, x: f.x, z: f.z, yaw: v.facing, lunge: 0, lungeDir: 0, lift: 0 }
          return
        }
        // (a figure that fell or fled, or is falling: a new one)
        if (!f.mesh || f.dying || f.fleeing || !f.mesh.parent) {
          this.unfigure(f)
          const mesh = buildModel(kit, u.key, u.t, color)
          this.scene.add(mesh)
          f = v.models[k] = { mesh, x: 0, z: 0, yaw: v.facing, lunge: 0, lungeDir: 0, lift: 0 }
        }
        Object.assign(f, { yaw: v.facing, look: undefined, lunge: 0, lift: 0, flash: 0, flying: false, moving: false })
        f.mesh.position.y = 0
        f.mesh.userData.fig.position.x = 0
        // (a war machine's arm at rest, the acid engine's globe back on it:
        // a throw cut off by the snap gives back neither)
        const a = f.mesh.userData.anim
        if (a?.throwArm) a.throwArm.rotation.x = a.rest
        if (a?.globe) a.globe.visible = true
      })
      this.disc(u.id)
      this.stands(v, mu.alive > 0)
      this.place(v)
    }
    this.labelAll()
  }

  // ── The disc and the label ────────────────────────────────────────────────
  // The ring and hit cylinder follow the unit's disc as shown: its place (or,
  // while it walks a unit.move, where the walk has got to: v.at) and radius.
  disc(id) {
    const v = this.views.get(id), u = v.u, mu = this.shown(id), p = v.at ?? mu.pos
    v.ring.scale.setScalar(mu.r + 0.18)
    const tall = u.t.big ? 2.4 : u.t.fly ? 1.8 : 1.3
    v.hit.scale.set(mu.r, tall, mu.r)
    v.ring.position.x = v.hit.position.x = p.x
    v.ring.position.z = v.hit.position.z = p.z
    v.hit.position.y = v.hit.scale.y / 2
  }
  // The label: the unit as shown (models standing or wounds left, mesmerized,
  // in combat).
  label(id) {
    const v = this.views.get(id), u = v.u, mu = this.shown(id)
    const w = mu.models.filter((m) => m.alive)
    let html = `<span class="nm">${u.t.short}</span>`
    if (u.t.models > 1) html += `<span class="ct">${mu.alive}/${u.t.models}</span>`
    else html += `<span class="ct">${w[0] ? w[0].w : 0}/${u.t.W}♥</span>`
    if (mu.mesmerized) html += `<span class="st" title="Mesmerized">🌀</span>`
    if (mu.alive > 0 && mu.engaged) html += `<span class="st" title="In combat">⚔</span>`
    v.label.innerHTML = html
    v.label.style.display = mu.alive > 0 ? '' : 'none'
  }
  labelAll() {
    for (const id of this.views.keys()) this.label(id)
  }

  // Each standing unit's ring in the colour and strength `look(v)` gives
  // ([colour, opacity]: picked up, a target, can act, under the pointer).
  paintRings(look) {
    for (const v of this.views.values()) {
      // (the units the table shows standing)
      if (!(this.shown(v.id).alive > 0)) continue
      const [col, op] = look(v)
      v.ring.material.opacity = op
      v.ring.material.color.set(col)
    }
  }

  // the hit cylinders of the units the table shows standing (while the
  // player is behind, the match may have slain some of them already)
  pickables() {
    return [...this.views.values()].filter((v) => this.shown(v.id).alive > 0).map((v) => v.hit)
  }

  // ── Each frame ────────────────────────────────────────────────────────────
  // Each figure walks toward its model's slot as shown (the mirror's place
  // for it), turns, lunges and idles; dying and fleeing figures play out
  // their own tweens. Then each standing unit's label floats over it (not
  // under ?fast, which draws nothing; hidden on the title), the one picked
  // up (`sel`, an id) marked.
  animate(dt, time, { fast, camera, sel }) {
    const M = this.mirror()
    for (const v of this.views.values()) {
      // (a unit walking a unit.move is drawn where its walk has got to)
      const u = v.u, mu = M.units[u.id], p = v.at ?? mu.pos
      for (const [i, model] of mu.models.entries()) {
        const m = v.models[i]
        if (!model.alive && !m.dying) continue
        const a = m.mesh.userData.anim
        if (model.alive) {
          const tx = p.x + model.ox, tz = p.z + model.oz
          const k = 1 - Math.exp(-dt * (v.moving ? 16 : 7))
          const px = m.x, pz = m.z
          m.x += (tx - m.x) * k
          m.z += (tz - m.z) * k
          const sp = Math.hypot(m.x - px, m.z - pz) / Math.max(dt, 1e-4)
          const want = sp > 0.6 ? Math.atan2(m.x - px, m.z - pz) : m.look ?? v.facing
          m.yaw += wrapAngle(want - m.yaw) * (1 - Math.exp(-dt * 8))
          m.moving = sp > 0.6
          let lx = 0, lz = 0
          if (m.lunge > 0) {
            m.lunge = Math.max(0, m.lunge - dt * 2.5)
            const s = Math.sin((1 - m.lunge) * Math.PI) * 0.35
            lx = Math.sin(m.lungeDir) * s
            lz = Math.cos(m.lungeDir) * s
          }
          m.mesh.position.set(m.x + lx, m.lift || 0, m.z + lz)
          m.mesh.rotation.y = m.yaw
        }
        if (!a || !model.alive) continue
        const t = time + m.mesh.userData.phase
        const fig = m.mesh.userData.fig
        if (a.kind === 'squirrel') {
          const hop = m.moving ? Math.abs(Math.sin(t * 13)) * 0.16 : 0
          fig.position.y = fig.userData.y0 + hop
          fig.scale.y = 1 + (m.moving ? 0 : Math.sin(t * 2.4) * 0.018)
          fig.rotation.x = m.moving ? 0.12 : 0
        } else if (a.kind === 'naga') {
          fig.rotation.z = Math.sin(t * (m.moving ? 9 : 1.4)) * (m.moving ? 0.12 : 0.035)
          fig.scale.y = 1 + Math.sin(t * 1.4) * 0.015
        } else if (a.kind === 'machine') {
          if (m.moving) for (const w of a.wheels) w.rotation.x += dt * 6
        }
        if (a.gem) a.gem.rotation.y = t * 2
        if (m.flash > 0) {
          m.flash -= dt
          fig.position.x = Math.sin(time * 60) * 0.04 * (m.flash > 0 ? 1 : 0)
        }
      }
      // the floating label
      if (mu.alive > 0 && !fast) {
        tmpV.set(p.x, (u.t.big ? 2.7 : u.t.fly ? 2.3 : 1.7), p.z).project(camera)
        const on = tmpV.z < 1
        v.label.style.transform = `translate(${(tmpV.x * 0.5 + 0.5) * innerWidth}px, ${(-tmpV.y * 0.5 + 0.5) * innerHeight}px) translate(-50%, -100%)`
        v.label.style.visibility = on && M.stage !== 'title' ? 'visible' : 'hidden'
        v.label.classList.toggle('sel', u.id === sel)
      }
    }
  }

  // ── Playing the figures' events ───────────────────────────────────────────
  // A wound that leaves the model standing: the number, and a flinch.
  wounded(e) {
    const v = this.views.get(e.u), u = v.u, f = v.models[e.m]
    this.effects.text({ x: f.x, y: (u.t.big ? 2.3 : 1.3), z: f.z }, `-${e.dmg}`, '#ff5a4a', { size: u.t.big ? 24 : 18 })
    f.flash = 0.4
  }

  // A model slain: the number, its race's voice (a squeak or a hiss), fur
  // or scales flying, and the figure keels over away from whoever did it,
  // then sinks out of sight and leaves the table.
  slain(e, M) {
    const v = this.views.get(e.u), u = v.u, f = v.models[e.m]
    this.effects.text({ x: f.x, y: (u.t.big ? 2.3 : 1.3), z: f.z }, `-${e.dmg}`, '#ff5a4a', { size: u.t.big ? 24 : 18 })
    f.dying = true
    // the race's own voice and gore
    const look = RACES[u.race].look
    sfx.voice(look.voice)
    const fig = f.mesh.userData.fig
    const by = e.by === null ? null : M.units[e.by]
    const dir = by ? Math.atan2(f.x - by.pos.x, f.z - by.pos.z) - f.yaw : 0
    const side = Math.sin(dir) >= 0 ? 1 : -1
    this.effects.debris(f.x, 0.5, f.z, look.gore, 6, { power: 2, size: 0.07 })
    tween(0.6, (k) => {
      fig.rotation.z = side * k * 1.45
      fig.position.y = (u.t.big ? 0.09 : 0.06) + Math.sin(k * Math.PI) * 0.15
    }, easeOut)
      .then(() => wait(1.4))
      .then(() => tween(0.8, (k) => (f.mesh.position.y = -k * 1.4)))
      .then(() => {
        this.unfigure(f)
        f.dying = false
      })
  }

  // A model flees: off the table over its unit's own edge.
  fled(e) {
    const v = this.views.get(e.u), f = v.models[e.m]
    f.dying = true
    const edge = v.edge
    const ex = edge * (this.W / 2 + 3)
    const x0 = f.x, z0 = f.z
    f.fleeing = true
    this.effects.text({ x: f.x, y: 1.4, z: f.z }, 'flees!', '#e0e0e0', { size: 14 })
    f.yaw = edge * Math.PI / 2
    tween(2.2, (k) => {
      f.x = lerp(x0, ex, k)
      f.z = z0
      f.mesh.position.set(f.x, Math.abs(Math.sin(k * 30)) * 0.2, f.z)
      f.mesh.rotation.y = f.yaw
    }).then(() => {
      this.unfigure(f)
      f.dying = false
    })
  }

  // A unit gone: its label, ring and hit cylinder go, and the table says so
  // in the colours of whoever did it.
  destroyed(e, M) {
    const v = this.views.get(e.u), u = v.u, p = M.units[e.u].pos
    v.label.style.display = 'none'
    v.ring.visible = false
    v.hit.visible = false
    this.scene.remove(v.hit)
    this.effects.text({ x: p.x, y: 2.2, z: p.z }, `${u.t.short} destroyed`, this.colorOf(e.by !== null ? this.unit(e.by).side : 1 - u.side), { size: 20, life: 2 })
  }

  // `e.u` turns to face `e.tg`, as both are shown (a unit.face event's).
  face(e) {
    const v = this.views.get(e.u), at = this.shown(e.tg).pos, from = this.shown(e.u).pos
    v.facing = Math.atan2(at.x - from.x, at.z - from.z)
    for (const f of v.models) f.look = Math.atan2(at.x - f.x, at.z - f.z)
  }

  // A charge roll's verdict, over the charger's head.
  shout(e) {
    const u = this.unit(e.u)
    if (e.ok) this.effects.text(this.top(e.u), 'CHARGE!', this.colorOf(u.side), { size: 22 })
    else this.effects.text(this.top(e.u), 'Charge failed', '#d0d0d0')
  }

  // A melee: the attackers lunge at their target (a thwack), and as the hit
  // row settles (the next event: the core emits the dice straight after
  // this, and the old code threw the sparks once that row had waited) sparks
  // fly over the models it hit.
  lunge(e) {
    const tv = this.views.get(e.tg), gen = this.gen
    const at = this.shown(e.tg).pos
    for (const f of this.standing(e.u)) {
      f.lunge = 1
      f.lungeDir = Math.atan2(at.x - f.x, at.z - f.z)
    }
    sfx.thwack()
    if (!e.hits) return
    wait(PACE.dice(e.n)).then(() => {
      // (nothing of a table since replaced)
      if (this.gone(e.tg, tv, gen)) return
      for (let i = 0; i < Math.min(e.hits, 8); i++) {
        const v = this.standing(e.tg)[i % Math.max(1, this.shown(e.tg).alive)]
        if (v) for (let k = 0; k < 4; k++) this.effects.mote({ x: v.x, y: 0.6, z: v.z, vx: (Math.random() - 0.5) * 5, vy: Math.random() * 4, vz: (Math.random() - 0.5) * 5, size: 0.05, color: '#fff2b0', life: 0.3, g: 12 })
      }
    })
  }

  // A unit walks its path (unit.move, from core/actions/move.js's
  // resolveWalk: a move, an advance's move, a fall back, a charge): a
  // wrecker setting off on a move stomps (`stomp`), then its disc goes along
  // the path in game time, the figures following, as the old walk moved the
  // unit itself, and what a wrecker smashed breaks as the walker passes each
  // sample (`smash(ev)` plays the terrain events the sample made); then a
  // breath. The mirror already holds where the walk ends, so until it gets
  // there the view draws the disc at v.at, where the walk has got to.
  async walk(e, M, smash) {
    const v = this.views.get(e.u), gen = this.gen
    const { path: pts, L, speed, fly, smashes } = e
    if (e.stomp) sfx.boom(0.4)
    v.moving = true
    if (fly) for (const f of v.models) f.flying = true
    const seg = []
    let acc = 0
    for (let i = 1; i < pts.length; i++) {
      const l = hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z)
      seg.push({ a: pts[i - 1], b: pts[i], s: acc, l })
      acc += l
    }
    let next = 0
    const play = ({ ev }) => {
      smash(ev)
      this.effects.shake = Math.max(this.effects.shake, 0.08)
    }
    // (nothing of a table since replaced: its unit ids count from 1 again)
    const gone = () => this.gone(e.u, v, gen)
    await tween(L / speed + 0.15, (k) => {
      if (gone()) return
      const d = Math.min(L, k * (L + speed * 0.15))
      const s = seg.find((q) => d <= q.s + q.l) || seg[seg.length - 1]
      const f = s.l > 0 ? (d - s.s) / s.l : 1
      v.facing = Math.atan2(s.b.x - s.a.x, s.b.z - s.a.z)
      v.at = { x: lerp(s.a.x, s.b.x, f), z: lerp(s.a.z, s.b.z, f) }
      this.disc(e.u)
      if (fly) for (const f of v.models) f.lift = Math.sin(Math.min(1, d / L) * Math.PI) * Math.min(3, L * 0.3)
      while (next < smashes.length && smashes[next].s <= d) play(smashes[next++])
    }, easeInOut)
    if (gone()) return
    while (next < smashes.length) play(smashes[next++])
    // there: drawn where the mirror has it from now on
    v.at = null
    this.disc(e.u)
    v.moving = false
    if (fly) for (const f of v.models) (f.flying = false), (f.lift = 0)
    await wait(0.15)
  }
}
