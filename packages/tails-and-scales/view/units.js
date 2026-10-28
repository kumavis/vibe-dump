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
// (F8b, DESIGN §4.2.7's "Drawing at scale" 3 and 4) Drawing at scale:
// - Semantic zoom. Each frame (never under ?fast) the tier is chosen from
//   pixels per inch where the camera looks (present/zoom.js): Close shows
//   the labels and rings as ever; Tactical the short labels (the role's
//   glyph, the count, the order badge: the labels' container carries the
//   tier, data-tier, and the style does the rest, so a label's HTML stays
//   the match's); Strategic hides the labels and the rings (each ring's
//   material, so its place, size and colour stay what the snap check
//   reads) and hands each unit's place on screen to the chips (`chips`,
//   ui/chips.js, wired by the app), whose borders carry the rings' state.
//   ((F8b's review) Keyed on a board larger than classic's, as LOD and the
//   tiles are: on classic's the tier stays Close and data-tier unset, so
//   classic's labels are as ever on every screen; a portrait phone's view
//   of classic's board is 8-11 px per inch, which would read Tactical.)
// - A label (and the screen place a box selects by) is written only when
//   its projected place moved half a pixel or more, or it turned visible or
//   hidden, or picked: a still camera writes none.
// - Figure LOD (`lod`, set for a board larger than classic's by
//   view/index.js's setBoard): a unit more than LOD_FAR from the camera is
//   drawn by its figures' far stand-ins (view/models/cache.js's lodOf: one
//   mesh each, (V2) a splat-fur figure's its fur beside it), without their
//   idle animation; a figure dying, fleeing or flinching keeps its own.
//
// (F16) The courtesy fog (present/fog.js, app/flow.js): `veil(ids)` names
// the units the seat played here can't see now. A unit veiled has no
// figure drawn, no ring, no label, no hit cylinder (the picker finds
// nothing), no place on screen (a box and the picker's fallback skip it)
// and no chip; its events still play, unseen (a walk, a fall: the view
// stays the mirror's), but what they would say over the table (a wound's
// number, a death's cry and debris, "flees!", "destroyed", a charge's
// shout, a stomp, a smash's shake) says nothing. Without the fog nothing
// is veiled, and every figure is drawn as ever.
//
// (V3a) The conditions (present/conditions.js): a label's icons are its
// unit's labelConds, each a span marked with its condition (data-cond:
// the tooltip's, ui/tooltip.js, which finds it by its box, the labels
// letting the pointer through to the table), read from the mirror and,
// for what the unit did in its own seat's turn (fell back, advanced, a
// charge failed), from the facts the card reads (`facts()`, the flow's
// record: app/flow.js draws every label again as it changes, and the
// ?debug snap check's fresh snap reads the same record, so a label left
// stale by it differs). Each label carries its unit's id (data-unit) for
// the tooltip's context, and the chips each unit's icons.
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
//
// (F9a, DESIGN §4.2.5 "View, input, UI") Riders. A unit the mirror shows
// aboard a hull (its `aboard`, the hull's id) has no ring, no hit cylinder,
// no label and no place on screen (a box, the picker's fallback and the
// chips pass it by): its figures stand on the hull's deck, parented to the
// hull's figure (a `deck` group at its model's deck height) at
// present/deck.js's slots, at RIDER_SCALE (0.8), facing the hull's front,
// so they ride with it wherever it walks, turns or piles in, and need no
// tween of their own. The slots are handed out to the hull's riders in id
// order (the mirror's, G.units's), each squad's standing models in turn
// (layDeck), so a table built event by event and a snap seat them alike.
// Boarding (unit.embark) the figures hop on from where their walk ended;
// stepping off (unit.disembark, a placement in the deployment) they hop
// down from the deck and walk to their slots; a hull destroyed throws its
// riders off before it bursts (its wreck is the terrain's: view/terrain.js),
// and a bail-out (`forced`) is the same hop, "bail out!" over the squad,
// the dice row after it. A transport's ring carries capacity pips (an arc
// lit per 2 models aboard, of capacity / 2), its label the riders aboard
// ("▣ 11/12", then each squad as a chip that picks it up:
// ⟨Nutkin 6 · Grenadiers 5⟩) and, while the unit picked up may board it, a
// ⤒ on its count (boardable(): a class, so the label's HTML stays the
// mirror's for the snap check); its chip a dot per rider squad.
import * as THREE from 'three'
import { RACES } from '../data/schema.js'
import { hypot } from '../core/dmath.js'
import { LADDER_OUT } from '../core/terrain/recipes.js'
import { PACE } from '../present/pace.js'
import { buildModel, disposeFigure, lodOf } from './models/cache.js'
import { deckSlots, RIDER_SCALE } from '../present/deck.js'
import { pxPerInch, tierOf, glyphOf } from '../present/zoom.js'
import { CONDITIONS, labelConds, ctxOf, unitTip } from '../present/conditions.js'
import { tween, wait, easeOut, easeInOut, wrapAngle, lerp } from './clock.js'
import { sfx } from './sfx.js'

// every unit's ring and hit cylinder have these shapes (scaled to its disc;
// made at the first unit's view, never as the module loads: three.js draws
// Math.random for every object's uuid, and the table is painted from
// Math.random as the page loads)
let shapes = null
const ringShapes = () => (shapes ??= { ring: new THREE.RingGeometry(0.88, 1, 48).rotateX(-Math.PI / 2), hit: new THREE.CylinderGeometry(1, 1, 1, 12) })
const tmpV = new THREE.Vector3()
// (F9a) a transport's capacity pips: an arc per two models of its capacity,
// just outside its ring (the ring's children: its place, scale and
// visibility theirs), each lit while two models (or the odd one) ride;
// shapes by count, the two materials shared, all made at the first
// transport's view and kept (a classic table makes none)
const PIP_LIT = '#ffe28a', PIP_DIM = '#2a221a'
let pipKit = null
const pipShapes = (n) => {
  pipKit ??= { shapes: new Map(), lit: new THREE.MeshBasicMaterial({ color: PIP_LIT, transparent: true, opacity: 0.9, depthWrite: false, toneMapped: false }), dim: new THREE.MeshBasicMaterial({ color: PIP_DIM, transparent: true, opacity: 0.5, depthWrite: false, toneMapped: false }) }
  if (!pipKit.shapes.has(n)) {
    const gap = Math.min(0.12, Math.PI / n / 3), arc = (Math.PI * 2) / n
    pipKit.shapes.set(n, Array.from({ length: n }, (_, k) => new THREE.RingGeometry(1.025, 1.075, 8, 1, Math.PI / 2 - (k + 1) * arc + gap / 2, arc - gap).rotateX(-Math.PI / 2)))
  }
  return pipKit
}
// how long a figure's hop onto or off a deck takes (s), and how high it goes
const HOP = 0.4, HOP_H = 0.55
// (F8b) past how far from the camera a unit's figures are its far
// stand-ins, and how near it must come again to be drawn in full (so a
// unit on the line doesn't flicker)
const LOD_FAR = 60
const LOD_NEAR = 57

// (F7a, DESIGN §4.2.4) Units on decks. A unit stands at the height the
// mirror gives it (`y`: its floor, 0 on the ground; a unit.move's path
// points and its end carry theirs, a unit.place its own), so its figures,
// ring, hit cylinder and label stand there, a figure walking a stair rising
// with it. Read defensively (`?? 0`): a mirror without heights (a classic
// match, or code from before F7a) stands everyone on the table, as ever.
// A unit standing over RAISED (the nav's STEP, 0.4") is raised: a thin drop
// line runs from its ring to the ground, and its label says how high
// ("▲2""). The drop lines share one shape and material, made the first time
// a unit is raised (a classic table makes neither, nor their ids' draws).
const RAISED = 0.4
let dropKit = null
const dropShapes = () => (dropKit ??= {
  geo: new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0)]),
  mat: new THREE.LineBasicMaterial({ color: '#f4ecd8', transparent: true, opacity: 0.55, depthTest: false, depthWrite: false, toneMapped: false }),
})
const yOf = (mu) => mu?.y ?? 0
// what a label says of a unit's height: its inches up to a tenth, or ''
// on the ground
const heightOf = (mu) => (mu.alive > 0 && yOf(mu) > RAISED ? `${+yOf(mu).toFixed(1)}` : '')
// A ladder climbed (a unit.move's segment marked `climb`, the nav's link
// from its foot to its top, or back down): its figures go in file, each GAP
// behind the last, along the ground to the face, up (or down) it a little
// out from the face, and on to the segment's end. climbOf lays a segment
// out (from a to b, l along the ground, n figures in file: its `len` the
// walk spends on it); climbAt(c, s) is where a figure s inches into it is.
const GAP = 0.9, OFF = 0.35
function climbOf(a, b, l, n) {
  const ya = a.y ?? 0, yb = b.y ?? 0, dh = Math.abs(yb - ya)
  const ux = l > 0 ? (b.x - a.x) / l : 0, uz = l > 0 ? (b.z - a.z) / l : 0
  // (the face stands LADDER_OUT from the foot, toward the top: recipes.js;
  // the column a figure climbs stands OFF out from it)
  const up = yb >= ya
  const toCol = up ? Math.max(0, Math.min(l, LADDER_OUT - OFF)) : Math.max(0, Math.min(l, l - LADDER_OUT + OFF))
  const col = { x: a.x + ux * toCol, z: a.z + uz * toCol }
  const run = l + dh
  return { a, b, ya, yb, ux, uz, up, toCol, col, dh, run, len: run + Math.max(0, n - 1) * GAP }
}
function climbAt(c, s) {
  s = Math.max(0, Math.min(c.run, s))
  if (s <= c.toCol) return { x: c.a.x + c.ux * s, y: c.ya, z: c.a.z + c.uz * s }
  if (s <= c.toCol + c.dh) return { x: c.col.x, y: c.ya + (c.yb - c.ya) * ((s - c.toCol) / (c.dh || 1)), z: c.col.z }
  const k = s - c.toCol - c.dh
  return { x: c.col.x + c.ux * k, y: c.yb, z: c.col.z + c.uz * k }
}

export class UnitViews {
  // `mirror()`: the mirror the table shows (the player's); `colorOf(seat)`
  // a seat's colour, `rimOf(seat)` (F6) how broad its bases' rims are (a
  // mirror match's east army: broader); `labels` the element the floating
  // labels go in; `W` the board's width (a fleeing figure runs off it);
  // (F7a's review) `floorAt(x, z)` the height of the table's walkable top
  // there (view/terrain.js), which a walk's figures stand on as they go;
  // (V3a) `facts()` the card's record of what each unit did this turn, by
  // id (present/hud-model.js's facts: null for none)
  constructor({ scene, labels, fx, mirror, colorOf, rimOf = () => 1, W, floorAt = () => 0, facts = () => null }) {
    this.scene = scene
    this.W = W
    this.floorAt = floorAt
    this.facts = facts
    this.labels = labels
    this.effects = fx
    this.mirror = mirror
    this.colorOf = colorOf
    this.rimOf = rimOf
    this.views = new Map()
    // (F10a) each standing unit's centre on screen, as last drawn: { x, y, on }
    this.screen = new Map()
    // bumped by every sync: a playback still running from before it (a walk,
    // a death) touches nothing of the views it left
    this.gen = 0
    // (F8b) the semantic zoom's tier shown, pixels per inch where the
    // camera looks, figure LOD on (setBoard's: a larger board), the chips
    // (ui/chips.js, the app's: null until wired) and how many label and
    // chip style writes the last frame made (render-bench's)
    this.tier = 'close'
    this.ppi = Infinity
    this.lod = false
    this.chips = null
    this.writes = 0
    // (F16) the units veiled by the fog, by id (null: none, the fog off)
    this.veiled = null
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
    const mu = this.shown(id), p = mu.pos
    return { x: p.x, y: yOf(mu) + (this.unit(id).t.big ? 2.6 : 1.6), z: p.z }
  }
  // (F16) whether the fog veils unit `id` now
  hid(id) {
    return !!this.veiled?.has(id)
  }
  // (F16) The units the fog veils now (a Set of ids, or null for none):
  // each view drawn or hidden by it at once.
  veil(ids) {
    const was = this.veiled
    this.veiled = ids && ids.size ? ids : null
    // (none veiled before or now: nothing to draw again)
    if (!was && !this.veiled) return
    for (const v of this.views.values()) this.cloak(v)
  }
  // a view drawn as the fog has it: its figures, ring, hit cylinder, drop
  // line and label shown or hidden, its place on screen forgotten (a
  // figure falling or fleeing goes on as it was: one seen to fall falls in
  // sight to the end, one veiled as it fell stays unseen)
  cloak(v) {
    const hid = this.hid(v.id)
    // ((F9a) a rider's figures on an enclosed hull's deck stay hidden, and a
    // rider has no ring or cylinder while it rides)
    for (const f of v.models) if (f.mesh && !f.dying) f.mesh.visible = !hid && !(f.deck && this.views.get(f.deck)?.u.t.transport?.enclosed)
    this.stands(v, this.shown(v.id).alive > 0 && !this.shown(v.id).aboard)
    this.disc(v.id)
    this.label(v.id)
    if (hid) this.screen.delete(v.id)
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
        v.models.push({ mesh: null, x: 0, y: 0, z: 0, yaw: facing, lunge: 0, lungeDir: 0, lift: 0 })
        continue
      }
      const mesh = buildModel(kit, u.key, u.t, color, this.rimOf(u.side))
      this.scene.add(mesh)
      v.models.push({ mesh, x: 0, y: 0, z: 0, yaw: facing, lunge: 0, lungeDir: 0, lift: 0 })
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
    // ((F8b) its role's glyph, which a Tactical label shows for its name)
    v.label.dataset.glyph = glyphOf(u.t)
    // ((V3a) its unit, whose conditions its icons' tips tell)
    v.label.dataset.unit = u.id
    v.ring.material.visible = this.tier !== 'strategic'
    // ((F9a) a transport's capacity pips, on its ring)
    if (u.t.transport) {
      const kit = pipShapes(Math.ceil(u.t.transport.capacity / 2))
      v.pips = kit.shapes.get(Math.ceil(u.t.transport.capacity / 2)).map((g) => {
        const m = new THREE.Mesh(g, kit.dim)
        m.renderOrder = 2
        m.visible = this.tier !== 'strategic'
        v.ring.add(m)
        return m
      })
    }
    this.labels.appendChild(v.label)
    this.views.set(u.id, v)
    this.disc(u.id)
    this.stands(v, mu.alive > 0 && !mu.aboard)
    // the figures stand in their slots from the start ((F9a) a rider's on
    // its hull's deck, once the hull's view is made: layDeck, sync's)
    this.place(v)
    // ((F16) veiled by the fog: drawn hidden)
    if (this.veiled) this.cloak(v)
    return v
  }

  // The ring and the hit cylinder of a unit standing, or (a unit destroyed,
  // as its unit.destroyed left them) neither.
  // ((F16) and neither for a unit the fog veils)
  stands(v, standing) {
    const on = standing && !this.hid(v.id)
    v.ring.visible = on
    v.hit.visible = on
    if (on && !v.hit.parent) this.scene.add(v.hit)
    if (!on) this.scene.remove(v.hit)
  }

  // Each figure standing exactly in its model's slot as shown, turned the
  // unit's way, nothing of a lunge, a lift or a flinch left on it. ((F9a) A
  // rider's stand on its hull's deck instead: layDeck's; one off a deck is
  // back on the table, full size.)
  place(v) {
    const mu = this.shown(v.id), y = yOf(mu)
    if (mu.aboard) return
    mu.models.forEach((m, k) => {
      const f = v.models[k]
      if (!f.mesh) return
      this.offDeck(f)
      f.x = mu.pos.x + m.ox
      f.z = mu.pos.z + m.oz
      f.y = y
      f.mesh.position.set(f.x, y, f.z)
      f.mesh.rotation.y = f.yaw
    })
  }

  // A figure off the table for good: what only it used is freed. ((F9a)
  // From whatever holds it: the scene, or a hull's deck.)
  unfigure(f) {
    if (!f.mesh) return
    f.mesh.parent?.remove(f.mesh)
    f.deck = null
    disposeFigure(f.mesh)
  }

  drop(v) {
    // ((F9a) a hull's riders off its deck first: their own views keep them)
    if (v.deck) this.dismount(v.id, false)
    for (const f of v.models) this.unfigure(f)
    if (v.dropLine) this.scene.remove(v.dropLine)
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
      v.climb = null
      v.moving = false
      v.facing = -edge * Math.PI / 2
      v.models.forEach((f, k) => {
        if (!mu.models[k].alive) {
          this.unfigure(f)
          v.models[k] = { mesh: null, x: f.x, y: f.y ?? 0, z: f.z, yaw: v.facing, lunge: 0, lungeDir: 0, lift: 0 }
          return
        }
        // (a figure that fell or fled, or is falling: a new one)
        if (!f.mesh || f.dying || f.fleeing || !f.mesh.parent) {
          this.unfigure(f)
          const mesh = buildModel(kit, u.key, u.t, color, this.rimOf(u.side))
          this.scene.add(mesh)
          f = v.models[k] = { mesh, x: 0, y: 0, z: 0, yaw: v.facing, lunge: 0, lungeDir: 0, lift: 0 }
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
      this.stands(v, mu.alive > 0 && !mu.aboard)
      this.place(v)
      if (this.veiled) this.cloak(v)
    }
    // ((F9a) then each hull's riders onto its deck, every hull's view made)
    this.layDecks(false)
    this.labelAll()
  }

  // ── (F9a) Riders on deck ──────────────────────────────────────────────────
  // The deck a hull's riders stand on: a group in the hull's figure, at its
  // model's deck height (made again if the figure was), or null while the
  // hull has no standing figure.
  deckOf(hv) {
    const f = hv?.models[0]
    if (!f?.mesh || f.dying || !hv.u.t.transport) return null
    if (hv.deck?.parent !== f.mesh) {
      hv.deck = new THREE.Group()
      hv.deck.userData.deck = hv.id
      const fig = f.mesh.userData.fig
      hv.deck.position.y = (fig?.userData.y0 ?? 0) + (f.mesh.userData.anim?.deck ?? 0.6)
      f.mesh.add(hv.deck)
    }
    return hv.deck
  }
  // Seat hull `hullId`'s riders (the mirror's, in id order: each squad's
  // standing models in turn) on its deck's slots (present/deck.js). A figure
  // not on this deck yet hops on from where it stands (`hop`; a snap seats
  // it at once). An enclosed hull (F5b) shows none of them: its pips and
  // label say who rides.
  layDeck(hullId, hop = true) {
    const M = this.mirror(), hv = this.views.get(hullId), deck = this.deckOf(hv)
    if (!deck) return
    const riders = [...this.views.values()].filter((r) => M.units[r.id]?.aboard === hullId && M.units[r.id].alive > 0).sort((a, b) => a.id - b.id)
    const n = riders.reduce((k, r) => k + M.units[r.id].models.filter((m) => m.alive).length, 0)
    const slots = deckSlots(hv.u.t, n), hidden = !!hv.u.t.transport.enclosed
    let k = 0
    for (const r of riders) {
      const mu = M.units[r.id]
      r.models.forEach((f, i) => {
        if (!f.mesh || !mu.models[i].alive) return
        // (more riders than slots never happens within capacity: the last
        // slot then holds the rest, as data-check holds every deck to its
        // capacity)
        const s = slots[Math.min(k++, slots.length - 1)] ?? { x: 0, z: 0 }
        if (f.mesh.parent !== deck) {
          if (hop && f.mesh.parent) {
            f.mesh.updateWorldMatrix(true, false)
            tmpV.setFromMatrixPosition(f.mesh.matrixWorld)
            deck.updateWorldMatrix(true, false)
            deck.worldToLocal(tmpV)
            f.hopFrom = { x: tmpV.x, y: tmpV.y, z: tmpV.z }
            f.hop = 1
          } else f.hop = 0
          deck.add(f.mesh)
        }
        f.deck = hullId
        f.slot = s
        f.mesh.userData.rider = r.id
        if (f.lo) this.lo(f, false)
        f.mesh.visible = !hidden && !this.hid(r.id)
        // (standing on the deck itself: its base hidden)
        if (f.mesh.userData.base) f.mesh.userData.base.visible = false
        if (!(f.hop > 0)) f.mesh.position.set(s.x, 0, s.z)
        f.mesh.rotation.y = 0
        f.mesh.scale.setScalar(RIDER_SCALE)
        Object.assign(f, { lunge: 0, lift: 0, flash: 0, look: undefined })
      })
    }
  }
  // every hull's riders seated (a sync's second pass, `hop` false)
  layDecks(hop) {
    for (const v of this.views.values()) if (v.u.t.transport) this.layDeck(v.id, hop)
  }
  // A figure on the table again (not on a deck), full size: `keep` where it
  // stands in the world now (a hop down from a deck), else wherever its
  // caller puts it.
  offDeck(f, keep = false) {
    if (!f.mesh) return
    if (f.mesh.parent !== this.scene) {
      if (keep && f.mesh.parent) {
        f.mesh.updateWorldMatrix(true, false)
        tmpV.setFromMatrixPosition(f.mesh.matrixWorld)
        f.x = tmpV.x
        f.y = tmpV.y
        f.z = tmpV.z
        // (turned as the hull it rode: its own yaw plus the hull's)
        const hv = this.views.get(f.deck)
        f.yaw = hv?.models[0]?.yaw ?? f.yaw
        f.hop = 1
        f.hopFrom = null
      }
      this.scene.add(f.mesh)
      if (keep) {
        f.mesh.position.set(f.x, f.y, f.z)
        f.mesh.rotation.y = f.yaw
      }
    }
    f.deck = null
    f.slot = null
    // ((F16) one the fog veils stays veiled off the deck)
    f.mesh.visible = !(f.mesh.userData.rider !== undefined && this.hid(f.mesh.userData.rider))
    if (f.mesh.userData.base) f.mesh.userData.base.visible = true
    delete f.mesh.userData.rider
    if (!keep) {
      f.hop = 0
      f.mesh.scale.setScalar(1)
    }
  }
  // The riders of hull `hullId` (or, `only`, the one rider) off its deck,
  // each figure where it stands in the world (`keep`: a hop down follows),
  // or simply back in the scene.
  dismount(hullId, keep = true, only = null) {
    for (const r of this.views.values()) {
      if (only !== null && r.id !== only) continue
      for (const f of r.models) if (f.mesh && f.deck === hullId) this.offDeck(f, keep)
    }
  }
  // the riders the mirror shows aboard hull `id`: [{ id, short, alive }] in
  // id order (the label's chips, the card's: ui/card.js)
  ridersOf(id) {
    const M = this.mirror(), out = []
    for (const v of this.views.values()) {
      const mu = M.units[v.id]
      if (mu?.aboard === id && mu.alive > 0) out.push({ id: v.id, short: v.u.t.short, alive: mu.alive })
    }
    return out.sort((a, b) => a.id - b.id)
  }
  // the figures standing on decks (input/picking.js casts at them: a rider
  // is picked up by its figure, never by a cylinder), each root carrying
  // its rider's id (userData.rider)
  deckFigures() {
    const out = []
    for (const v of this.views.values()) for (const f of v.models) if (f.mesh && f.deck && f.mesh.visible && !f.dying) out.push(f.mesh)
    return out
  }
  // (F9a's embark tool) the transports the unit picked up may board now,
  // their ids: each one's label shows ⤒ (a class: the label's HTML stays
  // the mirror's)
  boardable(ids) {
    for (const v of this.views.values()) {
      const on = ids.has(v.id)
      if (v.label.classList.contains('board') !== on) v.label.classList.toggle('board', on)
    }
  }

  // A unit boards a hull (unit.embark): off the table, onto its deck.
  embarked(e) {
    const v = this.views.get(e.u)
    this.stands(v, false)
    this.layDeck(e.v)
    // ((F16) unheard where the fog veils it)
    if (!this.hid(e.u)) sfx.click()
    this.labelAll()
  }
  // A unit steps off its hull, or (`forced`) bails out of its wreck
  // (unit.disembark): each figure hops down from the deck and walks to its
  // slot at `to` (the mirror's place by now), its ring and cylinder back
  // with it; the riders left closing up on the deck. A bail-out's hop is
  // waited on, then its dice row (the core's dice event, next) shows.
  disembarked(e) {
    const v = this.views.get(e.u)
    this.dismount(e.v, true, e.u)
    this.disc(e.u)
    this.stands(v, this.shown(e.u).alive > 0)
    this.layDeck(e.v)
    this.labelAll()
    // ((F16) a bail-out the fog veils says nothing)
    if (e.forced && !this.hid(e.u)) {
      this.effects.text(this.top(e.u), 'bail out!', '#ffb36a', { size: 16 })
      sfx.thwack()
    }
    return wait(e.forced ? HOP + 0.2 : 0.2)
  }
  // A unit placed (unit.place): a rider placed steps off its hull (the
  // deployment's re-arranging), the hull's deck closing up; a hull placed
  // takes its riders along (they stand on its deck).
  placed(e) {
    const v = this.views.get(e.u)
    const from = v.models.find((f) => f.deck)?.deck
    if (from) {
      this.dismount(from, true, e.u)
      this.layDeck(from)
      this.stands(v, this.shown(e.u).alive > 0)
      this.labelAll()
    }
    this.disc(e.u)
  }

  // ── The disc and the label ────────────────────────────────────────────────
  // The ring and hit cylinder follow the unit's disc as shown: its place (or,
  // while it walks a unit.move, where the walk has got to: v.at) and radius.
  // (F7a) At its height: the walk's where it has got to, else the mirror's;
  // a raised unit's drop line from its ring to the ground, and its label's
  // height told again once it stands (the label is the mirror's: a snap
  // draws the same).
  disc(id) {
    const v = this.views.get(id), u = v.u, mu = this.shown(id), p = v.at ?? mu.pos
    const y = v.at ? (v.at.y ?? 0) : yOf(mu)
    v.ring.scale.setScalar(mu.r + 0.18)
    const tall = u.t.big ? 2.4 : u.t.fly ? 1.8 : 1.3
    v.hit.scale.set(mu.r, tall, mu.r)
    v.ring.position.x = v.hit.position.x = p.x
    v.ring.position.z = v.hit.position.z = p.z
    v.ring.position.y = 0.04 + y
    v.hit.position.y = y + v.hit.scale.y / 2
    const raised = y > RAISED && mu.alive > 0 && !this.hid(id)
    if (raised && !v.dropLine) {
      const { geo, mat } = dropShapes()
      v.dropLine = new THREE.Line(geo, mat)
      v.dropLine.renderOrder = 3
    }
    if (v.dropLine) {
      if (raised && !v.dropLine.parent) this.scene.add(v.dropLine)
      if (!raised && v.dropLine.parent) this.scene.remove(v.dropLine)
      v.dropLine.position.set(p.x, 0, p.z)
      v.dropLine.scale.y = Math.max(0.001, y)
    }
    if (!v.at && v.labelY !== undefined && v.labelY !== heightOf(mu)) this.label(id)
  }
  // The label: the unit as shown (models standing or wounds left), and
  // (V3a) its conditions' icons (present/conditions.js's labelConds:
  // mesmerized, in combat, in its own seat's turn what keeps it from
  // shooting or charging, its height), each marked for its tip; written only
  // when it changed.
  label(id) {
    const v = this.views.get(id), u = v.u, mu = this.shown(id)
    const w = mu.models.filter((m) => m.alive)
    let html = `<span class="nm">${u.t.short}</span>`
    if (u.t.models > 1) html += `<span class="ct">${mu.alive}/${u.t.models}</span>`
    else html += `<span class="ct">${w[0] ? w[0].w : 0}/${u.t.W}♥</span>`
    // (F7a) a raised unit's height ("▲2"": on a deck 2" up; at the Tactical
    // tier the ▲ alone)
    v.labelY = heightOf(mu)
    for (const k of this.conds(id)) html += k === 'high' ? `<span class="st hi" data-cond="high">${CONDITIONS.high.icon}<i>${v.labelY}"</i></span>` : `<span class="st" data-cond="${k}">${CONDITIONS[k].icon}</span>`
    // ((F9a) a transport: the models aboard of its capacity, and each squad
    // riding it as a chip that picks it up; its ring's pips lit to match)
    if (u.t.transport) html += this.cargo(v, u.t.transport)
    if (v.html !== html) v.label.innerHTML = v.html = html
    // ((F9a) a rider's label hides while it rides: its hull's says it;
    // (F16) and one the fog veils hides)
    v.label.style.display = mu.alive > 0 && !mu.aboard && !this.hid(id) ? '' : 'none'
  }
  // (F9a) a transport's cargo for its label, its pips lit to match
  cargo(v, tr) {
    const rs = this.ridersOf(v.id), n = rs.reduce((k, r) => k + r.alive, 0)
    const lit = Math.ceil(n / 2)
    v.pips?.forEach((m, k) => (m.material = k < lit ? pipKit.lit : pipKit.dim))
    let html = `<span class="cg" title="Riders aboard: ${n} of ${tr.capacity} models">▣ ${n}/${tr.capacity}</span>`
    if (rs.length) html += `<span class="rd">⟨${rs.map((r) => `<i data-rider="${r.id}" title="Pick up the ${r.short}">${r.short} ${r.alive}</i>`).join(' · ')}⟩</span>`
    return html
  }
  // (V3a) the conditions unit `id` shows on its label now, the context
  // their tips read, and its own tip (its line, its conditions told: a
  // hover over its figure, input/human.js, and its chip's) (present/conditions.js)
  conds(id) {
    const v = this.views.get(id)
    return labelConds(v.u.t, v.u.side, this.shown(id), this.facts()?.[id], this.mirror())
  }
  ctx(id) {
    return ctxOf(this.views.get(id).u.side, this.shown(id), this.facts()?.[id], this.mirror())
  }
  // (V3a) a unit's tip: its line and its conditions told; ((F9a) a
  // transport's riders aboard, a rider's hull, on its line)
  tip(id) {
    const v = this.views.get(id), mu = this.shown(id), tr = v.u.t.transport
    let extra = ''
    if (tr) extra += ` · ${this.ridersOf(id).reduce((k, r) => k + r.alive, 0)}/${tr.capacity} aboard`
    if (mu.aboard) extra += ` · aboard the ${this.unit(mu.aboard).t.short}`
    return unitTip(v.u.t, mu, this.conds(id), this.ctx(id), extra)
  }
  labelAll() {
    for (const id of this.views.keys()) this.label(id)
  }
  // (F10c) each unit's standing order on its label, a glyph by unit id (a
  // Map; units it leaves out hold none): an attribute the label's style
  // shows, so its HTML stays the match's (the ?debug snap check compares it)
  badges(glyphs) {
    for (const v of this.views.values()) {
      const g = glyphs.get(v.id) ?? ''
      if ((v.label.dataset.ord ?? '') !== g) v.label.dataset.ord = g
    }
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
      // ((F8b) what a chip's border shows when the rings are hidden)
      v.look = op > 0.15 ? col : null
    }
  }

  // the hit cylinders of the units the table shows standing (while the
  // player is behind, the match may have slain some of them already)
  // ((F9a) a rider's none: its deck figures are picked instead, deckFigures;
  // (F16) and the fog doesn't veil)
  pickables() {
    return [...this.views.values()].filter((v) => this.shown(v.id).alive > 0 && !this.shown(v.id).aboard && !this.hid(v.id)).map((v) => v.hit)
  }

  // ── Each frame ────────────────────────────────────────────────────────────
  // Each figure walks toward its model's slot as shown (the mirror's place
  // for it), turns, lunges and idles; dying and fleeing figures play out
  // their own tweens. Then each standing unit's label floats over it (not
  // under ?fast, which draws nothing; hidden on the title), the one picked
  // up (`sel`, an id) marked.
  animate(dt, time, { fast, camera, sel }) {
    const M = this.mirror()
    if (!fast) this.zoom(camera)
    this.writes = 0
    const lodOn = this.lod && !fast
    for (const v of this.views.values()) {
      // (a unit walking a unit.move is drawn where its walk has got to)
      const u = v.u, mu = M.units[u.id], p = v.at ?? mu.pos
      // (F7a) the height the figures stand at: the walk's, else the mirror's
      const py = v.at ? (v.at.y ?? 0) : yOf(mu)
      let file = 0
      // ((F8b) far: its figures drawn by their stand-ins)
      if (lodOn) {
        const d = Math.hypot(camera.position.x - p.x, camera.position.y, camera.position.z - p.z)
        v.far = d > (v.far ? LOD_NEAR : LOD_FAR)
      } else v.far = false
      for (const [i, model] of mu.models.entries()) {
        const m = v.models[i]
        if (!model.alive && !m.dying) continue
        // ((F9a) on a hull's deck: it rides, standing at its slot (after its
        // hop on), turned the hull's way; the hull's LOD hides the deck)
        if (m.deck && model.alive) {
          this.ride(m, dt, M)
          // ((V2) its breath about its height as built, cache.js's sy, as a
          // figure's on the table)
          if (m.mesh.userData.anim?.kind === 'squirrel' && !m.lo) {
            const fig = m.mesh.userData.fig
            fig.position.y = fig.userData.y0
            fig.scale.y = fig.userData.sy * (1 + Math.sin((time + m.mesh.userData.phase) * 2.4) * 0.018)
            fig.rotation.x = 0
          }
          continue
        }
        if (m.lo || v.far) this.lo(m, v.far && !m.dying && !(m.flash > 0))
        const a = m.mesh.userData.anim
        // ((F9a) a figure off a deck grows back to its size, and hops down)
        if (m.mesh.scale.x !== 1) m.mesh.scale.setScalar(Math.abs(m.mesh.scale.x - 1) < 0.005 ? 1 : m.mesh.scale.x + (1 - m.mesh.scale.x) * (1 - Math.exp(-dt * 10)))
        if (m.hop > 0) {
          m.hop = Math.max(0, m.hop - dt / HOP)
          m.lift = Math.sin((1 - m.hop) * Math.PI) * HOP_H
        }
        if (model.alive && v.climb) {
          // (F7a) up or down a ladder, in file: each figure GAP behind the
          // one before it, facing the face
          // (one still waiting its turn queues behind the ladder's near end,
          // in file; one off it goes to its own slot at the far end)
          const c = v.climb.c, at = v.climb.s - file++ * GAP
          const q = at < 0 ? { x: c.a.x + c.ux * at, y: c.ya, z: c.a.z + c.uz * at }
            : at > c.run ? { x: c.b.x + model.ox, y: c.yb, z: c.b.z + model.oz } : climbAt(c, at)
          const px = m.x, pz = m.z, py0 = m.y ?? 0, k = at >= 0 && at <= c.run ? 1 : 1 - Math.exp(-dt * 10)
          m.x += (q.x - m.x) * k
          m.z += (q.z - m.z) * k
          m.y = py0 + (q.y - py0) * k
          m.moving = Math.hypot(m.x - px, m.z - pz, m.y - py0) > 1e-4
          // (on the ladder facing the face, the higher side; else the way
          // the file goes)
          const onLadder = at > c.toCol && at < c.toCol + c.dh
          const want = onLadder ? Math.atan2(c.up ? c.ux : -c.ux, c.up ? c.uz : -c.uz) : Math.atan2(c.ux, c.uz)
          m.yaw += wrapAngle(want - m.yaw) * (1 - Math.exp(-dt * 12))
        } else if (model.alive) {
          const tx = p.x + model.ox, tz = p.z + model.oz
          const k = 1 - Math.exp(-dt * (v.moving ? 16 : 7))
          const px = m.x, pz = m.z
          m.x += (tx - m.x) * k
          m.z += (tz - m.z) * k
          m.y = (m.y ?? 0) + (py - (m.y ?? 0)) * k
          const sp = Math.hypot(m.x - px, m.z - pz) / Math.max(dt, 1e-4)
          const want = sp > 0.6 ? Math.atan2(m.x - px, m.z - pz) : m.look ?? v.facing
          m.yaw += wrapAngle(want - m.yaw) * (1 - Math.exp(-dt * 8))
          m.moving = sp > 0.6
        }
        if (model.alive) {
          let lx = 0, lz = 0
          if (m.lunge > 0) {
            m.lunge = Math.max(0, m.lunge - dt * 2.5)
            const s = Math.sin((1 - m.lunge) * Math.PI) * 0.35
            lx = Math.sin(m.lungeDir) * s
            lz = Math.cos(m.lungeDir) * s
          }
          m.mesh.position.set(m.x + lx, (m.y ?? 0) + (m.lift || 0), m.z + lz)
          m.mesh.rotation.y = m.yaw
          // ((F9a) a hop down from a deck ends on the table)
          if (m.hop === 0 && m.lift && !v.models.some((x) => x.flying)) m.lift = 0
        }
        if (!a || !model.alive || m.lo) continue
        const t = time + m.mesh.userData.phase
        const fig = m.mesh.userData.fig
        // ((V2) the breath scales the figure's height about its own scale,
        // cache.js's sy: before V2 it set the scale itself, which drew a
        // brute, a hierophant and an elder at 1 high, squashed)
        if (a.kind === 'squirrel') {
          const hop = m.moving ? Math.abs(Math.sin(t * 13)) * 0.16 : 0
          fig.position.y = fig.userData.y0 + hop
          fig.scale.y = fig.userData.sy * (1 + (m.moving ? 0 : Math.sin(t * 2.4) * 0.018))
          fig.rotation.x = m.moving ? 0.12 : 0
        } else if (a.kind === 'naga') {
          fig.rotation.z = Math.sin(t * (m.moving ? 9 : 1.4)) * (m.moving ? 0.12 : 0.035)
          fig.scale.y = fig.userData.sy * (1 + Math.sin(t * 1.4) * 0.015)
        } else if (a.kind === 'machine') {
          if (m.moving) for (const w of a.wheels) w.rotation.x += dt * 6
        }
        if (a.gem) a.gem.rotation.y = t * 2
        if (m.flash > 0) {
          m.flash -= dt
          fig.position.x = Math.sin(time * 60) * 0.04 * (m.flash > 0 ? 1 : 0)
        }
      }
      // the floating label; (F10a) and the unit's centre on screen, which a
      // box selects by and the picker falls back on (input/): a unit fallen,
      // or nothing drawn, has none
      // ((F9a) a rider has none: its hull stands for it; (F16) a unit the
      // fog veils has neither)
      const hid = this.hid(u.id) || !!mu.aboard
      if (!(mu.alive > 0) || fast || hid) this.screen.delete(u.id)
      if (mu.alive > 0 && !fast && !hid) {
        tmpV.set(p.x, py + 0.4, p.z).project(camera)
        const sx = (tmpV.x * 0.5 + 0.5) * innerWidth, sy = (-tmpV.y * 0.5 + 0.5) * innerHeight
        const onScreen = tmpV.z < 1 && Math.abs(tmpV.x) <= 1 && Math.abs(tmpV.y) <= 1
        const at = this.screen.get(u.id)
        // ((F8b) kept while it moved under half a pixel: the same record)
        if (!at || at.on !== onScreen || Math.abs(at.x - sx) >= 0.5 || Math.abs(at.y - sy) >= 0.5) this.screen.set(u.id, { x: sx, y: sy, on: onScreen })
        tmpV.set(p.x, py + (u.t.big ? 2.7 : u.t.fly ? 2.3 : 1.7), p.z).project(camera)
        const on = tmpV.z < 1
        const lx = (tmpV.x * 0.5 + 0.5) * innerWidth, ly = (-tmpV.y * 0.5 + 0.5) * innerHeight
        // ((F8b) each write only when it changes: the place when it moved
        // half a pixel or more)
        if (!(Math.abs(lx - v.lx) < 0.5 && Math.abs(ly - v.ly) < 0.5)) {
          v.label.style.transform = `translate(${lx}px, ${ly}px) translate(-50%, -100%)`
          v.lx = lx
          v.ly = ly
          this.writes++
        }
        const vis = on && M.stage !== 'title' ? 'visible' : 'hidden'
        if (v.lvis !== vis) {
          v.label.style.visibility = v.lvis = vis
          this.writes++
        }
        const picked = u.id === sel
        if (v.lsel !== picked) {
          v.label.classList.toggle('sel', (v.lsel = picked))
          this.writes++
        }
      }
    }
    if (this.chips && !fast) this.writes += this.chips.draw(this.tier === 'strategic' && M.stage !== 'title' ? this.chipsOf(M, sel) : null)
  }

  // (F9a) A rider's figure on its hull's deck, this frame: at its slot, or
  // on its hop there from where it boarded (an arc up and over the rim),
  // facing the hull's front, at RIDER_SCALE; its world place (what a text
  // over it reads) the hull's.
  ride(m, dt, M) {
    const s = m.slot ?? { x: 0, z: 0 }
    if (m.hop > 0 && m.hopFrom) {
      m.hop = Math.max(0, m.hop - dt / HOP)
      const k = easeOut(1 - m.hop), a = m.hopFrom
      m.mesh.position.set(lerp(a.x, s.x, k), lerp(a.y, 0, k) + Math.sin(k * Math.PI) * HOP_H, lerp(a.z, s.z, k))
    } else {
      m.hop = 0
      m.mesh.position.set(s.x, 0, s.z)
    }
    m.mesh.rotation.y = 0
    if (m.mesh.scale.x !== RIDER_SCALE) m.mesh.scale.setScalar(RIDER_SCALE)
    const hv = this.views.get(m.deck), h = hv?.models[0]
    if (h) {
      m.x = h.x
      m.y = (h.y ?? 0) + (hv.deck?.position.y ?? 0)
      m.z = h.z
      m.yaw = h.yaw
    }
  }

  // ── (F8b) Drawing at scale ───────────────────────────────────────────────
  // The semantic zoom's tier for the camera as it stands (present/zoom.js:
  // pixels per inch where its line of sight meets the table, or at its
  // distance from the table's centre should it look above the horizon),
  // shown on the labels' container (data-tier: the style's) and on the
  // rings (hidden at Strategic) when it changes.
  zoom(camera) {
    camera.getWorldDirection(tmpV)
    const d = tmpV.y < -1e-3 ? camera.position.y / -tmpV.y : camera.position.length()
    this.ppi = pxPerInch(innerHeight, d, camera.fov)
    // ((F8b's review) on classic's board, Close whatever the screen: the
    // tiers are a larger board's, `lod` its key; the label container's
    // data-tier unset there, so classic's labels draw as they always did)
    const tier = this.lod ? tierOf(this.ppi, this.tier) : 'close'
    const key = this.lod ? tier : ''
    if ((this.labels.dataset.tier ?? '') !== key) {
      if (key) this.labels.dataset.tier = key
      else delete this.labels.dataset.tier
    }
    if (tier === this.tier) return
    this.tier = tier
    for (const v of this.views.values()) {
      v.ring.material.visible = tier !== 'strategic'
      // ((F9a) a transport's pips go with its ring)
      for (const p of v.pips ?? []) p.visible = tier !== 'strategic'
    }
  }

  // What the chips show (ui/chips.js's draw): each standing unit on screen,
  // in G.units order (the views', a sync's), with its place on the table
  // and on screen, its seat's colour, its role's glyph, its models standing
  // (a single model's wounds left), its order badge and its state (picked
  // up, in combat, the ring's colour as the input painted it); (V3a) and
  // its label's condition icons (`conds`, its height's left to the label).
  chipsOf(M, sel) {
    const out = []
    for (const v of this.views.values()) {
      const mu = M.units[v.id], at = this.screen.get(v.id)
      if (!(mu.alive > 0) || !at?.on || this.hid(v.id)) continue
      const p = v.at ?? mu.pos
      out.push({
        id: v.id, x: at.x, y: at.y, wx: p.x, wz: p.z, side: v.u.side, color: v.color, glyph: v.label.dataset.glyph,
        n: v.u.t.models > 1 ? mu.alive : mu.models.find((m) => m.alive)?.w ?? 0, ord: v.label.dataset.ord ?? '',
        sel: v.id === sel, engaged: !!mu.engaged, look: v.look ?? null,
        conds: this.conds(v.id).filter((k) => k !== 'high').map((k) => CONDITIONS[k].icon).join(''),
        // ((F9a) a transport's rider squads: a dot each on its chip)
        riders: v.u.t.transport ? this.ridersOf(v.id).length : 0,
      })
    }
    return out
  }

  // A figure drawn by its far stand-in (lo) or in full.
  lo(m, lo) {
    if (!!m.lo === lo) return
    m.lo = lo
    const root = m.mesh, stand = lodOf(root)
    for (const c of root.children) c.visible = lo ? c === stand : c !== stand
  }

  // ── Playing the figures' events ───────────────────────────────────────────
  // A wound that leaves the model standing: the number, and a flinch.
  wounded(e) {
    const v = this.views.get(e.u), u = v.u, f = v.models[e.m]
    if (this.hid(e.u)) return
    this.effects.text({ x: f.x, y: (f.y ?? 0) + (u.t.big ? 2.3 : 1.3), z: f.z }, `-${e.dmg}`, '#ff5a4a', { size: u.t.big ? 24 : 18 })
    f.flash = 0.4
  }

  // A model slain: the number, its race's voice (a squeak or a hiss), fur
  // or scales flying, and the figure keels over away from whoever did it,
  // then sinks out of sight and leaves the table.
  slain(e, M) {
    const v = this.views.get(e.u), u = v.u, f = v.models[e.m], fy = f.y ?? 0
    // ((F16) one the fog veils falls unseen and unheard)
    const hid = this.hid(e.u)
    if (!hid) this.effects.text({ x: f.x, y: fy + (u.t.big ? 2.3 : 1.3), z: f.z }, `-${e.dmg}`, '#ff5a4a', { size: u.t.big ? 24 : 18 })
    // ((F9a) a vehicle bursts: its riders thrown off the deck first, where
    // they stood, and its wreck (the terrain's, next) takes its place; (F16)
    // unseen, it goes without the fire and the noise)
    if (u.t.vehicle) return this.burst(v, f, hid)
    // ((F9a) a figure still on a deck, a rider lost with its hull: off it)
    if (f.deck) this.offDeck(f, true)
    f.dying = true
    // the race's own voice and gore
    const look = RACES[u.race].look
    if (!hid) sfx.voice(look.voice)
    const fig = f.mesh.userData.fig
    const by = e.by === null ? null : M.units[e.by]
    const dir = by ? Math.atan2(f.x - by.pos.x, f.z - by.pos.z) - f.yaw : 0
    const side = Math.sin(dir) >= 0 ? 1 : -1
    if (!hid) this.effects.debris(f.x, fy + 0.5, f.z, look.gore, 6, { power: 2, size: 0.07 })
    tween(0.6, (k) => {
      fig.rotation.z = side * k * 1.45
      fig.position.y = (u.t.big ? 0.09 : 0.06) + Math.sin(k * Math.PI) * 0.15
    }, easeOut)
      .then(() => wait(1.4))
      .then(() => tween(0.8, (k) => (f.mesh.position.y = fy - k * 1.4)))
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
    const x0 = f.x, z0 = f.z, y0 = f.y ?? 0
    f.fleeing = true
    if (!this.hid(e.u)) this.effects.text({ x: f.x, y: y0 + 1.4, z: f.z }, 'flees!', '#e0e0e0', { size: 14 })
    f.yaw = edge * Math.PI / 2
    tween(2.2, (k) => {
      f.x = lerp(x0, ex, k)
      f.z = z0
      // ((F7a) off a deck it jumps down first)
      f.mesh.position.set(f.x, y0 * Math.max(0, 1 - k * 6) + Math.abs(Math.sin(k * 30)) * 0.2, f.z)
      f.mesh.rotation.y = f.yaw
    }).then(() => {
      this.unfigure(f)
      f.dying = false
    })
  }

  // (F9a) A vehicle destroyed: its riders off the deck (each figure where it
  // stood: its bail-out's hop, or its fall, plays from there), a burst of
  // fire, smoke and splinters, and the figure gone at once: the burning
  // wreck the terrain adds next stands where it stood. ((F16) One the fog
  // veils (`hid`) goes unseen and unheard: its riders, veiled with it, fall
  // or bail out unseen too.)
  burst(v, f, hid = false) {
    const fy = f.y ?? 0
    if (v.deck) this.dismount(v.id, true)
    if (!hid) {
      const fx = this.effects
      fx.explode?.(f.x, f.z, Math.max(1.2, v.u.t.base), 'fire', fy)
      fx.debris(f.x, fy + 0.8, f.z, ['#86552c', '#5a3820', '#c49a62', '#3a2a1e'], 18, { power: 6, size: 0.16 })
      fx.smoke({ x: f.x, y: fy + 1, z: f.z, size: 0.9, color: '#3a3430', life: 2.4 })
      fx.shake = Math.max(fx.shake ?? 0, 0.12)
      sfx.boom?.(0.8)
    }
    this.unfigure(f)
    v.deck = null
  }

  // A unit gone: its label, ring and hit cylinder go, and the table says so
  // in the colours of whoever did it.
  destroyed(e, M) {
    const v = this.views.get(e.u), u = v.u, p = M.units[e.u].pos
    v.label.style.display = 'none'
    v.ring.visible = false
    v.hit.visible = false
    this.scene.remove(v.hit)
    if (v.dropLine?.parent) this.scene.remove(v.dropLine)
    if (this.hid(e.u)) return
    this.effects.text({ x: p.x, y: yOf(M.units[e.u]) + 2.2, z: p.z }, `${u.t.short} destroyed`, this.colorOf(e.by !== null ? this.unit(e.by).side : 1 - u.side), { size: 20, life: 2 })
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
    if (this.hid(e.u)) return
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
    // ((F16) a fight with a unit the fog veils, both unseen: nothing heard)
    if (this.hid(e.u) && this.hid(e.tg)) return
    sfx.thwack()
    if (!e.hits) return
    wait(PACE.dice(e.n)).then(() => {
      // (nothing of a table since replaced; (F16) no sparks over a unit
      // the fog veils)
      if (this.gone(e.tg, tv, gen) || this.hid(e.tg)) return
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
  //
  // (F7a) The path's points carry their heights (`y`, the floor there: a
  // stair's rises along it), and a segment whose end is marked `climb` is a
  // ladder (the nav's link: the polyline keeps its foot and top as vertices):
  // the walk spends its length and its height on it, and the figures go up
  // or down it in file (climbOf), their file's length added, so the last of
  // them is off the ladder before the walk goes on. A path with no climb is
  // walked exactly as before. (F7a's review) Off the ladders a walker's
  // figures stand on the table's own top under them (floorAt), not on the
  // line between the vertices' heights: string-pulling lets one segment run
  // off a deck and down its stair, where that line sank them into the deck
  // or floated them over the ground (up to 0.95"). A flier's goes from one
  // height to the other, as it flies over what lies between; a path
  // without heights (no height layer) as ever.
  async walk(e, M, smash) {
    const v = this.views.get(e.u), gen = this.gen
    const { path: pts, L, speed, fly, smashes } = e
    // ((F16) a walker the fog veils stomps and smashes unheard)
    const hid = this.hid(e.u)
    if (e.stomp && !hid) sfx.boom(0.4)
    v.moving = true
    if (fly) for (const f of v.models) f.flying = true
    const seg = []
    let acc = 0
    // (the figures that go in file up a ladder: those standing)
    const n = this.shown(e.u).models.filter((m) => m.alive).length
    for (let i = 1; i < pts.length; i++) {
      const l = hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z)
      const c = pts[i].climb && !fly ? climbOf(pts[i - 1], pts[i], l, n) : null
      seg.push({ a: pts[i - 1], b: pts[i], s: acc, l: c ? c.len : l, c })
      acc += c ? c.len : l
    }
    // (the length walked: the event's, or with a climb, the segments' own)
    const len = seg.some((q) => q.c) ? acc : L
    // (a walker's path on a table with height: its points carry their floors)
    const tops = !fly && pts.length > 0 && 'y' in pts[0]
    let next = 0
    const play = ({ ev }) => {
      smash(ev)
      if (!hid) this.effects.shake = Math.max(this.effects.shake, 0.08)
    }
    // (nothing of a table since replaced: its unit ids count from 1 again)
    const gone = () => this.gone(e.u, v, gen)
    await tween(len / speed + 0.15, (k) => {
      if (gone()) return
      const d = Math.min(len, k * (len + speed * 0.15))
      const s = seg.find((q) => d <= q.s + q.l) || seg[seg.length - 1]
      const f = s.l > 0 ? (d - s.s) / s.l : 1
      if (s.c) {
        // a ladder: the disc goes with the first figure up it
        v.climb = { c: s.c, s: d - s.s }
        const q = climbAt(s.c, d - s.s)
        v.facing = Math.atan2(s.b.x - s.a.x, s.b.z - s.a.z)
        v.at = q
      } else {
        v.climb = null
        v.facing = Math.atan2(s.b.x - s.a.x, s.b.z - s.a.z)
        const x = lerp(s.a.x, s.b.x, f), z = lerp(s.a.z, s.b.z, f)
        v.at = { x, y: tops ? this.floorAt(x, z) : lerp(s.a.y ?? 0, s.b.y ?? 0, f), z }
      }
      this.disc(e.u)
      if (fly) for (const f of v.models) f.lift = Math.sin(Math.min(1, d / L) * Math.PI) * Math.min(3, L * 0.3)
      // (a smash sample's `s` is along the walk's ground length, L: a path
      // with a climb holds no smashes, the wreckers being big)
      while (next < smashes.length && smashes[next].s <= d) play(smashes[next++])
    }, easeInOut)
    if (gone()) return
    while (next < smashes.length) play(smashes[next++])
    // there: drawn where the mirror has it from now on
    v.at = null
    v.climb = null
    this.disc(e.u)
    v.moving = false
    if (fly) for (const f of v.models) (f.flying = false), (f.lift = 0)
    await wait(0.15)
  }
}
