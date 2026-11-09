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
//
// (F9b, DESIGN §4.2.5 "View, input, UI") Long hulls. A footprint unit
// (t.fp) faces one of eight headings, rules state the mirror carries as its
// `f` (0-7, h = 0 facing +z, h = 2 +x): its figure's yaw is f·π/4 (three's
// rotation.y, the convention every figure here faces by and the wreck's
// raster turns by), set from the mirror wherever a view is made or synced
// and kept there, never the way it last walked nor the target a charge
// faced it toward (unit.face is a round unit's: a hull's yaw is its facing
// alone). Its ring is the outline of its discs (view/hull.js), not a
// circle of its bounding R, turned with it, its transport's pips along
// that outline; its hit volume its discs' cylinders, turned with it, so a
// pick finds the hull and not the table beside it. It walks its
// octilinear path (unit.move's points carry each run's f, a pivot a point
// repeated with its new f: core/actions/move.js's hullWalk) straight,
// backing without turning where a run goes against its facing, and turns
// on the spot at its pivots at PIVOT_RATE (180°/s), the yaw tweened
// there; its smashes play by their `s`, the path's inches plus 0.5" a
// pivot (PIVOT_S), as the core counts them; its head and tail slither as
// it goes (the figure's 'hull' anim, view/models/howdah.js). Its riders
// stand on its deck, turned with it.
//
// (F9c, DESIGN §4.2.5's "Deck fire") Firing decks. A rider that can shoot
// from its hull's deck has no ring to show it, so in the shooting phase its
// ring's look (paintRings, the same map: white while it can act, gold
// picked up) lights it on the deck instead: a halo about each of its
// figures there (deckGlow, in the deck's group, so the hull's LOD and the
// fog take it with them), and its chip on the hull's label (cargo's `lit`,
// the label drawn again as it changes, so a snap's label is the table's).
// An enclosed hull (F5b) shows no rider figures, so its chips alone light.
// A rider's figures stand at their slots in the world as well as on the
// deck: ride() writes each one's world place from the deck's matrix, so a
// volley or a throw from the deck leaves from the figure's slot
// (view/effects/shots.js; an enclosed hull's from its deck point, deckAt,
// its ports), at the deck's height. A rider that shoots turns on the deck to
// face its target (face(): a look yaw relative to the hull, `deckLook`),
// until its hull's next move turns its riders back to the hull's front
// (walk()) or it steps off.
import * as THREE from 'three'
import { RACES } from '../data/schema.js'
import { hypot } from '../core/dmath.js'
import { LADDER_OUT } from '../core/terrain/recipes.js'
import { PACE } from '../present/pace.js'
import { buildModel, disposeFigure, lodOf } from './models/cache.js'
import { hullShapes } from './hull.js'
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
// (F9c) a rider's deck glow: a soft halo about each of its figures on the
// deck (a sprite of a radial fall-off, its own texture's numbers: no
// canvas, so a page under the fake DOM makes it as well), additive, in its
// ring's colour (a material per colour, shared), its figure in front of
// its middle and the halo round its edges; made the first time a rider
// lights (a table with nobody aboard able to shoot, the title's and a
// watched battle's among them, makes none) and kept. (A ring under its
// feet, first tried, was hidden by the riders standing on it.)
const GLOW_OP = 0.6, GLOW_W = 1.5, GLOW_H = 1.7, GLOW_Y = 0.55
let glowKit = null
const glowShapes = () => {
  if (glowKit) return glowKit
  const n = 32, px = new Uint8Array(n * n * 4)
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const r = Math.hypot(((x + 0.5) / n) * 2 - 1, ((y + 0.5) / n) * 2 - 1), k = (y * n + x) * 4
    px[k] = px[k + 1] = px[k + 2] = 255
    px[k + 3] = Math.round(255 * Math.max(0, 1 - r) ** 1.5)
  }
  const tex = new THREE.DataTexture(px, n, n)
  tex.needsUpdate = true
  return (glowKit = { tex, mats: new Map() })
}
const glowMat = (col) => {
  const k = glowShapes()
  if (!k.mats.has(col)) k.mats.set(col, new THREE.SpriteMaterial({ map: k.tex, color: col, transparent: true, opacity: GLOW_OP, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }))
  return k.mats.get(col)
}
// how long a figure's hop onto or off a deck takes (s), and how high it goes
const HOP = 0.4, HOP_H = 0.55
// (F5a) a burrower's walk throws its dust every BURROW_DUST inches, in the
// turned earth's browns (walk(), dust())
const BURROW_DUST = 0.3
const DUST = ['#7a5a3a', '#9a7a52', '#5e4430', '#b8986a']
// (F5a) how tall a figure stands as drawn: its miniature's top over its
// base's foot (its own meshes, not its shadow caster), which a burrower's
// walk sinks it by a share of (walk()). Measured once a unit, its figures
// all of one type: a Delver's 0.74", a Deepguard's 0.95", where the type's
// eye (0.95) would sink a Delver all but its antennae.
function figureHeight(mesh) {
  const fig = mesh.userData.fig ?? mesh, box = new THREE.Box3()
  mesh.updateMatrixWorld(true)
  fig.traverse((o) => o.isMesh && !o.userData.caster && !o.userData.lod && box.expandByObject(o))
  return box.isEmpty() ? 0 : box.max.y - mesh.position.y
}
// (F7c) A fall with a timber platform (fell()): the figures ride the deck's
// sag (FALL_SAG s, view/terrain.js's DROP_SAG) and then drop as it does,
// faster as they go, in FALL_T(dy) s for a fall of dy" (2" in about a third
// of a second, the deck's own DROP_FALL), pitching forward as they go
const FALL_SAG = 0.15
const FALL_T = (dy) => Math.max(0.2, Math.sqrt(Math.max(0, dy) / 16))
// (F8b) past how far from the camera a unit's figures are its far
// stand-ins, and how near it must come again to be drawn in full (so a
// unit on the line doesn't flicker)
const LOD_FAR = 60
const LOD_NEAR = 57
// (F7b) how strongly a ring shows through what hides it (xray())
const XRAY = 0.4
// (F9b) a long hull's yaw as the mirror shows it (its heading f, 0-7), how
// fast it turns on the spot at a pivot (rad/s: 180°/s, DESIGN §4.2.5), and
// what a pivot counts in a walk's measure (core/actions/move.js PIVOT_S:
// its smashes' `s`)
const yawOf = (mu) => ((mu?.f ?? 0) * Math.PI) / 4
const PIVOT_RATE = Math.PI
const PIVOT_S = 0.5

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
    // (F7b) whether a seat is played here (input/human.js sets it: the
    // Session's local seats), whose units' rings show through what hides
    // them (xray())
    this.own = () => false
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
  // ((F9b) a long hull's facing is its own, the mirror's f: never the
  // table's)
  make(u, edge, color) {
    const mu = this.shown(u.id)
    const fp = u.t.fp ?? null
    const facing = fp ? yawOf(mu) : -edge * Math.PI / 2
    // (at: where a walk has got to while a unit.move plays; null otherwise)
    const v = { id: u.id, u, edge, color, facing, moving: false, at: null, models: [], fp }
    const kit = RACES[u.race].look.models
    for (let i = 0; i < u.t.models; i++) {
      if (!mu.models[i].alive) {
        v.models.push({ mesh: null, x: 0, y: 0, z: 0, yaw: facing, lunge: 0, lungeDir: 0, lift: 0 })
        continue
      }
      const mesh = buildModel(kit, u.key, u.t, color, this.rimOf(u.side))
      // ((F9b) a long hull's figure knows its unit: the snap check reads its
      // yaw, its facing)
      if (fp) mesh.userData.hull = u.id
      this.scene.add(mesh)
      v.models.push({ mesh, x: 0, y: 0, z: 0, yaw: facing, lunge: 0, lungeDir: 0, lift: 0 })
    }
    // selection / status ring ((F9b) a long hull's the outline of its
    // discs, and its hit volume their cylinders: view/hull.js)
    const { ring, hit } = fp ? hullShapes(fp) : ringShapes()
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
    // ((F9b) a long hull's along its outline)
    if (u.t.transport) {
      const n = Math.ceil(u.t.transport.capacity / 2), kit = pipShapes(n)
      v.pips = (fp ? hullShapes(fp).pips(n) : kit.shapes.get(n)).map((g) => {
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
    if (v.xray) v.xray.visible = on && v.xray.userData.lit
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
    if (v.xray) {
      this.scene.remove(v.xray)
      v.xray.material.dispose()
    }
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
      // ((F9b) a long hull's its own heading, as shown)
      v.facing = v.fp ? yawOf(mu) : -edge * Math.PI / 2
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
          if (v.fp) mesh.userData.hull = u.id
          this.scene.add(mesh)
          f = v.models[k] = { mesh, x: 0, y: 0, z: 0, yaw: v.facing, lunge: 0, lungeDir: 0, lift: 0 }
        }
        Object.assign(f, { yaw: v.facing, look: undefined, lunge: 0, lift: 0, sink: 0, flash: 0, flying: false, moving: false, fall: null })
        f.mesh.position.y = 0
        // ((F7c) a fall cut short ends upright)
        f.mesh.rotation.x = 0
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
  // label say who rides. ((F9c's review) A snap, `hop` false, seats every
  // rider facing its hull's front, as a fresh table does and as the snap
  // turns every table figure back to its unit's facing: a peer that
  // reloads draws the riders as the others' tables do after the snap.)
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
        // ((F9c) one seated again on the deck it stands on keeps the turn
        // it took there to its target; one new to it, or seated by a snap,
        // faces the hull's front)
        const seated = hop && f.mesh.parent === deck && f.deck === hullId
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
        if (!seated) Object.assign(f, { deckYaw: 0, deckLook: undefined })
        f.mesh.rotation.y = f.deckYaw ?? 0
        f.mesh.scale.setScalar(RIDER_SCALE)
        Object.assign(f, { lunge: 0, lift: 0, flash: 0, look: undefined })
        // ((F9c) its deck glow as its unit is lit now)
        this.deckGlow(f, r.deckLit ?? null)
      })
    }
  }
  // (F9c) Rider figure `f`'s glow on its deck in colour `col` (null: out),
  // about it at its place on the deck (ride() keeps it there), sized to a
  // rider at RIDER_SCALE.
  deckGlow(f, col) {
    if (!col && !f.glow) return
    const deck = f.mesh?.parent
    if (!col || !f.deck || deck?.userData.deck === undefined) {
      if (f.glow) f.glow.visible = false
      return
    }
    if (!f.glow) {
      f.glow = new THREE.Sprite(glowMat(col))
      f.glow.renderOrder = 2
      f.glow.userData.glow = true
      f.glow.userData.rider = f.mesh.userData.rider
      f.glow.scale.set(GLOW_W * RIDER_SCALE, GLOW_H * RIDER_SCALE, 1)
    }
    if (f.glow.parent !== deck) deck.add(f.glow)
    f.glow.material = glowMat(col)
    f.glow.position.set(f.mesh.position.x, GLOW_Y, f.mesh.position.z)
    f.glow.visible = f.mesh.visible
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
        // (turned as the hull it rode: its own yaw plus the hull's; (F9c)
        // its own the yaw it turned to on the deck)
        const hv = this.views.get(f.deck)
        f.yaw = (hv?.models[0]?.yaw ?? f.yaw) + (f.deckYaw ?? 0)
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
    // ((F9c) its glow and its look on the deck go with it; (F9c's review)
    // and any lunge, which a deck never plays)
    f.glow?.removeFromParent()
    f.glow = null
    f.deckLook = undefined
    f.deckYaw = 0
    f.lunge = 0
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
  // (F7c) A unit falls with the timber platform shot out from under it
  // (unit.fall, core/actions/settle.js): its standing figures ride the
  // deck's sag and drop with it to their slots at `to`, the mirror's place
  // by now (the ground where it landed: where it stood, or the nearest
  // clear ground it scrambled to), pitching as they go (the frame loop's
  // `fall`, animate()); its ring, hit cylinder and label there at once, its
  // drop line gone. "falls! D3" over it as it goes, a thud and dust where
  // it lands. The fall is waited on: the next event, its D3's dice row (or,
  // a unit crushed under the wreckage, its models slain), plays once it is
  // down, so a crushed unit's figures die where they landed, which is where
  // it stood. (F16) A fall the fog veils plays unseen and unheard; (F9a)
  // a hull's riders fall with it on its deck, carried. ((The review) A
  // model the blow that dropped the deck slew, keeling over on it as it
  // goes, drops straight down with it (sink()), where it lay; and a unit
  // destroyed on the deck before it fell, `dead`, has only those: no
  // words, no dust, nothing waited on.)
  fell(e) {
    const v = this.views.get(e.u), gen = this.gen, hid = this.hid(e.u)
    const mu = this.shown(e.u), T = FALL_T(e.dy)
    for (const f of v.models) if (f.mesh && f.dying && !f.fleeing && !f.deck) this.sink(f, e.to.y, T, gen)
    if (e.dead) return
    // ((the review) its D3 next, dealt it by itself: slain(), destroyed())
    v.fallen = true
    v.at = null
    v.climb = null
    v.moving = false
    for (const [k, f] of v.models.entries()) {
      if (!f.mesh || f.deck || f.dying || !mu.models[k].alive) continue
      f.fall = { t: 0, T, x0: f.x, y0: f.y ?? 0, z0: f.z, pitch: k % 2 ? 0.35 : -0.25 }
    }
    this.disc(e.u)
    this.label(e.u)
    if (!hid) {
      const top = this.top(e.u)
      // ((F7c) a unit with nowhere to land is crushed, and takes no D3)
      this.effects.text({ ...top, y: top.y + e.dy }, e.crushed ? 'crushed!' : 'falls! D3', e.crushed ? '#ff6a5a' : '#ffb36a', { size: 16 })
    }
    return wait(FALL_SAG + T).then(() => {
      if (this.gone(e.u, v, gen) || hid) return
      const p = this.shown(e.u).pos, y = this.shown(e.u).y ?? 0
      this.effects.debris(p.x, y + 0.2, p.z, ['#9a8a70', '#7a6a50'], 6, { power: 2, size: 0.07 })
      this.effects.smoke({ x: p.x, y: y + 0.2, z: p.z, size: Math.max(0.5, mu.r), color: '#9a8a70', life: 1.2 })
      sfx.thwack()
    }).then(() => wait(0.15))
  }
  // ((The review) A dying figure (slain()'s keel-and-sink, under way) on a
  // deck that falls: down to the ground under it, `y`, as the deck sags
  // and drops (FALL_SAG, then T s, faster as it goes), its sink sunk from
  // wherever it has got to (f.sunk). Stops if the table is snapped.
  sink(f, y, T, gen) {
    const y0 = f.y ?? 0
    wait(FALL_SAG).then(() => this.gen === gen && tween(T, (k) => {
      if (this.gen !== gen || !f.mesh) return
      f.y = y0 + (y - y0) * k * k
      f.mesh.position.y = f.y - (f.sunk ?? 0)
    }))
  }
  // A unit placed (unit.place): a rider placed steps off its hull (the
  // deployment's re-arranging), the hull's deck closing up; a hull placed
  // takes its riders along (they stand on its deck).
  // ((F9b) A long hull placed faces as placed, at once, as it stands
  // where placed.)
  placed(e) {
    const v = this.views.get(e.u)
    if (v.fp) v.facing = yawOf(this.shown(e.u))
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
  // ((F9b) A long hull's ring and hit volume are its discs' own shapes, at
  // their own size, turned as its figure is: its facing, or where a walk's
  // pivot has turned it to.)
  disc(id) {
    const v = this.views.get(id), u = v.u, mu = this.shown(id), p = v.at ?? mu.pos
    const y = v.at ? (v.at.y ?? 0) : yOf(mu)
    const tall = u.t.big ? 2.4 : u.t.fly ? 1.8 : 1.3
    if (v.fp) {
      v.ring.scale.setScalar(1)
      v.hit.scale.set(1, tall, 1)
      v.ring.rotation.y = v.hit.rotation.y = v.facing
    } else {
      v.ring.scale.setScalar(mu.r + 0.18)
      v.hit.scale.set(mu.r, tall, mu.r)
    }
    v.ring.position.x = v.hit.position.x = p.x
    v.ring.position.z = v.hit.position.z = p.z
    v.ring.position.y = 0.04 + y
    v.hit.position.y = y + v.hit.scale.y / 2
    if (v.xray) {
      v.xray.position.copy(v.ring.position)
      v.xray.scale.copy(v.ring.scale)
      v.xray.rotation.y = v.ring.rotation.y
    }
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
  // mesmerized, (V3c) the spells' marks, in combat, in its own seat's turn
  // what keeps it from shooting or charging, its height), each marked for
  // its tip; written only when it changed.
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
    // ((F9c) a rider lit by its ring's look in the shooting phase, its chip
    // lit: it can shoot from the deck, or is the one picked up)
    if (rs.length) html += `<span class="rd">⟨${rs.map((r) => (this.views.get(r.id)?.deckLit ? `<i data-rider="${r.id}" class="lit" title="Pick up the ${r.short}: it can shoot from the deck">` : `<i data-rider="${r.id}" title="Pick up the ${r.short}">`) + `${r.short} ${r.alive}</i>`).join(' · ')}⟩</span>`
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
  // ((F9c) A rider, ringless, is lit on its deck by the same look in the
  // shooting phase (`deckLit`: its figures' glow, its chip on its hull's
  // label, that label drawn again when it changes).)
  paintRings(look) {
    const shoot = this.mirror()?.phase === 'shoot'
    let hulls = null
    for (const v of this.views.values()) {
      // (the units the table shows standing)
      const mu = this.shown(v.id)
      if (!(mu.alive > 0)) {
        if (v.deckLit) v.deckLit = null
        continue
      }
      const [col, op] = look(v)
      v.ring.material.opacity = op
      v.ring.material.color.set(col)
      // ((F8b) what a chip's border shows when the rings are hidden)
      v.look = op > 0.15 ? col : null
      this.xray(v, op > 0.15 && this.own(v.u.side) ? col : null)
      const lit = mu.aboard && shoot && op > 0.15 ? col : null
      if ((v.deckLit ?? null) !== lit) {
        v.deckLit = lit
        for (const f of v.models) if (f.deck) this.deckGlow(f, lit)
        // (one stepped off: its hull's label is drawn again as it goes)
        if (mu.aboard) {
          hulls ??= new Set()
          hulls.add(mu.aboard)
        }
      }
    }
    if (hulls) for (const id of hulls) if (this.views.has(id)) this.label(id)
  }

  // (F7b, DESIGN §4.2.4's see-through) The rings of the seats played here
  // show through what hides them: a copy of a lit ring drawn at 40% where
  // something stands in front of it (its depth test turned round,
  // GreaterDepth: only where the depth buffer already holds something
  // nearer, so the ring shows through a wall and nowhere else, the
  // per-pixel "when occluded"; it writes no depth). `col` null puts it
  // out. Made the first time a ring of a seat played here is lit (a game
  // nobody plays here, the title's and a watched battle's, makes none, nor
  // their ids' draws). The chips (ui/chips.js) are the page's, over the
  // table: nothing on it hides them.
  xray(v, col) {
    if (!col && !v.xray) return
    if (!v.xray) {
      // ((F9b) a long hull's its outline, as its ring)
      v.xray = new THREE.Mesh(v.fp ? v.ring.geometry : ringShapes().ring, new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: XRAY, depthWrite: false, depthFunc: THREE.GreaterDepth, toneMapped: false }))
      v.xray.renderOrder = 3
      v.xray.position.copy(v.ring.position)
      v.xray.scale.copy(v.ring.scale)
      v.xray.rotation.y = v.ring.rotation.y
      v.xray.material.visible = this.tier !== 'strategic'
      this.scene.add(v.xray)
    }
    v.xray.userData.lit = !!col
    if (col) v.xray.material.color.set(col)
    v.xray.visible = !!col && v.ring.visible
  }

  // (F7b) Where unit `id` is drawn now, and what of it the see-through looks
  // for ({ x, y, z } points: its feet and head at its centre, and round its
  // disc at its middle), or null for a unit the table doesn't show standing
  // ((at the F7b merge) nor (F9a) a rider aboard, off the table, nor (F16)
  // one the fog veils: no wall fades round a unit the player can't see).
  spots(id) {
    const v = this.views.get(id), mu = v && this.shown(id)
    if (!mu || !(mu.alive > 0) || mu.aboard || this.hid(id)) return null
    const p = v.at ?? mu.pos, y = v.at ? (v.at.y ?? 0) : yOf(mu), r = mu.r * 0.8
    const tall = v.u.t.big ? 2.4 : v.u.t.fly ? 1.8 : 1.3
    return [{ x: p.x, y: y + 0.3, z: p.z }, { x: p.x, y: y + tall * 0.9, z: p.z }, ...[[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dz]) => ({ x: p.x + dx * r, y: y + tall * 0.5, z: p.z + dz * r }))]
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
          this.ride(m, dt, v)
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
        } else if (model.alive && m.fall) {
          // (F7c) falling with its platform (fell()): it rides the sag,
          // then drops to its slot at the landing, faster as it goes,
          // pitching forward and upright again as it lands
          const F = m.fall
          F.t += dt
          const k = Math.min(1, Math.max(0, F.t - FALL_SAG) / F.T)
          const tx = p.x + model.ox, tz = p.z + model.oz
          m.x = lerp(F.x0, tx, easeOut(k))
          m.z = lerp(F.z0, tz, easeOut(k))
          m.y = F.y0 + (py - F.y0) * k * k
          m.moving = false
          m.mesh.rotation.x = Math.sin(k * Math.PI) * F.pitch
          if (k >= 1) {
            m.fall = null
            m.mesh.rotation.x = 0
          }
        } else if (model.alive) {
          const tx = p.x + model.ox, tz = p.z + model.oz
          const k = 1 - Math.exp(-dt * (v.moving ? 16 : 7))
          const px = m.x, pz = m.z
          m.x += (tx - m.x) * k
          m.z += (tz - m.z) * k
          m.y = (m.y ?? 0) + (py - (m.y ?? 0)) * k
          const sp = Math.hypot(m.x - px, m.z - pz) / Math.max(dt, 1e-4)
          if (v.fp) {
            // ((F9b) a long hull faces its facing alone, never the way it
            // goes (it backs up facing ahead): its pivots tweened by
            // hullWalk(), a placement's new heading taken at once, as its
            // place is)
            m.yaw = v.facing
            m.moving = v.moving
          } else {
            const want = sp > 0.6 ? Math.atan2(m.x - px, m.z - pz) : m.look ?? v.facing
            m.yaw += wrapAngle(want - m.yaw) * (1 - Math.exp(-dt * 8))
            m.moving = sp > 0.6
          }
        }
        if (model.alive) {
          let lx = 0, lz = 0
          if (m.lunge > 0) {
            m.lunge = Math.max(0, m.lunge - dt * 2.5)
            const s = Math.sin((1 - m.lunge) * Math.PI) * 0.35
            lx = Math.sin(m.lungeDir) * s
            lz = Math.cos(m.lungeDir) * s
          }
          // ((F5a) a burrower mid-tunnel sunk into the table, walk()'s
          // `sink`: its base and figure with it, its ring and label not)
          m.mesh.position.set(m.x + lx, (m.y ?? 0) + (m.lift || 0) - (m.sink || 0), m.z + lz)
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
        } else if (a.kind === 'hull') {
          // ((F9b) a long hull's head and tail slither from side to side as
          // it goes, the tail a beat behind; at rest they sway a little)
          const k = m.moving ? 1 : 0.3, w = m.moving ? 5.5 : 0.9
          a.head.rotation.y = Math.sin(t * w) * 0.2 * k
          a.tail.rotation.y = -Math.sin(t * w + 1.1) * 0.34 * k
        } else if (a.kind === 'insect') {
          // ((F5a) the Hive's (view/models/insect.js): moving, the legs
          // scuttle in two alternating sets and the body bobs; at rest the
          // antennae twitch and the breath scales it, about its own height)
          const legs = a.legs ?? []
          if (m.moving) {
            legs.forEach((l, i) => (l.rotation.x = Math.sin(t * 16 + i * Math.PI) * 0.35))
            fig.position.y = fig.userData.y0 + Math.abs(Math.sin(t * 16)) * 0.04
            fig.scale.y = fig.userData.sy
          } else {
            for (const l of legs) l.rotation.x = 0
            fig.position.y = fig.userData.y0
            fig.scale.y = fig.userData.sy * (1 + Math.sin(t * 2.4) * 0.015)
          }
          if (a.antL) a.antL.rotation.x = m.moving ? -0.25 : Math.sin(t * 3.1) * 0.15
          if (a.antR) a.antR.rotation.x = m.moving ? -0.25 : Math.sin(t * 3.1 + 1.3) * 0.15
        } else if (a.kind === 'bird') {
          // ((F5a) the Aerie's (view/models/bird.js): flying, the wings
          // beat; a flier at rest hovers on its stand, its wings breathing
          // about their rest pose; a walker's head bobs as it walks)
          const beat = 0.4 + Math.sin(t * 18) * 0.6, breath = Math.sin(t * 1.6) * 0.05
          for (const w of [a.wingL, a.wingR]) if (w) w.rotation.z = m.flying ? w.userData.s * beat : w.userData.z0 + w.userData.s * breath
          fig.position.y = fig.userData.y0 + (a.lift && !m.flying ? Math.sin(t * 2.2) * 0.04 : 0)
          if (!a.lift && a.head?.userData.y0 !== undefined) a.head.position.y = a.head.userData.y0 + (m.moving ? Math.abs(Math.sin(t * 12)) * 0.03 : 0)
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
  // facing the hull's front, at RIDER_SCALE. ((F9c) Or turned to the target
  // it last shot (`deckLook`, relative to the hull: face()), the turn
  // eased; its glow about it (deckGlow); and its world place (where a
  // volley or a throw from the deck leaves, what a text over it reads)
  // its slot's, from the deck's matrix, at the deck's height; an enclosed
  // hull's riders, unseen, its deck point (deckAt), the ports' stand-in.)
  // (`rv`: the rider's view)
  ride(m, dt, rv) {
    const s = m.slot ?? { x: 0, z: 0 }
    if (m.hop > 0 && m.hopFrom) {
      m.hop = Math.max(0, m.hop - dt / HOP)
      const k = easeOut(1 - m.hop), a = m.hopFrom
      m.mesh.position.set(lerp(a.x, s.x, k), lerp(a.y, 0, k) + Math.sin(k * Math.PI) * HOP_H, lerp(a.z, s.z, k))
    } else {
      m.hop = 0
      m.mesh.position.set(s.x, 0, s.z)
    }
    const want = m.deckLook ?? 0
    m.deckYaw = (m.deckYaw ?? 0) + wrapAngle(want - (m.deckYaw ?? 0)) * Math.min(1, 1 - Math.exp(-dt * 10))
    if (Math.abs(wrapAngle(want - m.deckYaw)) < 1e-4) m.deckYaw = want
    m.mesh.rotation.y = m.deckYaw
    if (m.mesh.scale.x !== RIDER_SCALE) m.mesh.scale.setScalar(RIDER_SCALE)
    if (m.glow) {
      if (m.glow.parent !== m.mesh.parent) m.mesh.parent?.add(m.glow)
      m.glow.position.set(m.mesh.position.x, GLOW_Y + m.mesh.position.y, m.mesh.position.z)
      m.glow.visible = !!rv?.deckLit && m.mesh.visible
    }
    const hv = this.views.get(m.deck), h = hv?.models[0]
    if (h) {
      // (an enclosed hull's deck point: its deckAt in the deck's frame, the
      // hull's own, as deckSlots packs it)
      const tr = hv.u.t.transport, shut = !!tr?.enclosed, at = shut ? hv.deck : m.mesh
      if (at?.parent) {
        at.updateWorldMatrix(true, false)
        if (shut) tmpV.set(tr.deckAt?.[0] ?? 0, 0, tr.deckAt?.[1] ?? 0).applyMatrix4(at.matrixWorld)
        else tmpV.setFromMatrixPosition(at.matrixWorld)
        m.x = tmpV.x
        m.y = (h.y ?? 0) + (hv.deck?.position.y ?? 0)
        m.z = tmpV.z
      } else {
        m.x = h.x
        m.y = (h.y ?? 0) + (hv.deck?.position.y ?? 0)
        m.z = h.z
      }
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
      if (v.xray) v.xray.material.visible = tier !== 'strategic'
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
  // then sinks out of sight and leaves the table. ((F7c's review) It sinks
  // from where it is drawn (f.y, less f.sunk): a deck falling under it
  // takes it down meanwhile (sink()). A fall's D3 is dealt the fallen unit
  // by itself (core/actions/settle.js, the spec's damage(G, u, n, 1, u)),
  // `by` its own id: no foe did it, so a unit that has fallen keels as one
  // slain by nobody.)
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
    f.sunk = 0
    // the race's own voice and gore
    const look = RACES[u.race].look
    if (!hid) sfx.voice(look.voice)
    const fig = f.mesh.userData.fig
    const by = e.by === null || (e.by === e.u && v.fallen) ? null : M.units[e.by]
    const dir = by ? Math.atan2(f.x - by.pos.x, f.z - by.pos.z) - f.yaw : 0
    const side = Math.sin(dir) >= 0 ? 1 : -1
    if (!hid) this.effects.debris(f.x, fy + 0.5, f.z, look.gore, 6, { power: 2, size: 0.07 })
    tween(0.6, (k) => {
      fig.rotation.z = side * k * 1.45
      fig.position.y = (u.t.big ? 0.09 : 0.06) + Math.sin(k * Math.PI) * 0.15
    }, easeOut)
      .then(() => wait(1.4))
      .then(() => tween(0.8, (k) => {
        if (!f.mesh) return
        f.sunk = k * 1.4
        f.mesh.position.y = (f.y ?? 0) - f.sunk
      }))
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
  // in the colours of whoever did it ((F7c's review) a unit its own fall's
  // D3 destroyed, `by` itself, in its foe's, as one destroyed by nobody).
  destroyed(e, M) {
    const v = this.views.get(e.u), u = v.u, p = M.units[e.u].pos
    v.label.style.display = 'none'
    v.ring.visible = false
    if (v.xray) v.xray.visible = false
    v.hit.visible = false
    this.scene.remove(v.hit)
    if (v.dropLine?.parent) this.scene.remove(v.dropLine)
    if (this.hid(e.u)) return
    this.effects.text({ x: p.x, y: yOf(M.units[e.u]) + 2.2, z: p.z }, `${u.t.short} destroyed`, this.colorOf(e.by !== null && !(e.by === e.u && v.fallen) ? this.unit(e.by).side : 1 - u.side), { size: 20, life: 2 })
  }

  // `e.u` turns to face `e.tg`, as both are shown (a unit.face event's).
  // ((F9b) Not a long hull: its yaw is its facing, rules state, which its
  // charge's walk turns as it goes.)
  // ((F9c) A rider on its hull's deck: each of its figures turns there to
  // the target from its slot, a yaw relative to the hull (`deckLook`, eased
  // by ride()), held until its hull moves or it steps off.)
  face(e) {
    const v = this.views.get(e.u), at = this.shown(e.tg).pos, from = this.shown(e.u).pos
    if (v.fp) return
    v.facing = Math.atan2(at.x - from.x, at.z - from.z)
    for (const f of v.models) f.look = Math.atan2(at.x - f.x, at.z - f.z)
    const hv = this.shown(e.u).aboard ? this.views.get(this.shown(e.u).aboard) : null, hm = hv?.models[0]?.mesh
    if (!hm) return
    for (const f of v.models) {
      if (!f.deck || !f.mesh?.parent) continue
      f.mesh.updateWorldMatrix(true, false)
      tmpV.setFromMatrixPosition(f.mesh.matrixWorld)
      f.deckLook = wrapAngle(Math.atan2(at.x - tmpV.x, at.z - tmpV.z) - hm.rotation.y)
    }
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
    // ((F9c) a hull's riders turned to their targets face its front again
    // as it goes)
    if (v.u.t.transport) for (const r of this.views.values()) for (const f of r.models) if (f.deck === e.u) f.deckLook = undefined
    // ((F9b) a long hull's path: its runs and pivots, hullWalk())
    if (v.fp && e.path.length && e.path[0].f !== undefined) return this.hullWalk(e, smash)
    const { path: pts, L, speed, fly, smashes } = e
    // ((F16) a walker the fog veils stomps and smashes unheard)
    const hid = this.hid(e.u)
    // ((F5a, DESIGN §4.2.12: Q6) a burrower, by its type (no event field):
    // along its walk its figures sink by up to 60% of their height as drawn
    // (figureHeight), eased in and out by sin(π·s/L), throwing brown dust
    // from their bases every BURROW_DUST", and rise at the end; its ring and
    // label stay on the table and the figure is never wholly hidden (open
    // question 5))
    const burrow = v.u.t.move === 'burrow'
    if (burrow) v.figH ??= figureHeight((v.models.find((f) => f.mesh?.parent) ?? v.models[0]).mesh)
    const deep = burrow ? 0.6 * v.figH : 0
    let dug = 0
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
      if (burrow) {
        const sink = deep * Math.sin(Math.min(1, d / Math.max(len, 1e-6)) * Math.PI)
        for (const f of v.models) f.sink = sink
        for (; dug + BURROW_DUST <= d; dug += BURROW_DUST) if (!hid) this.dust(v)
      }
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
    if (burrow) for (const f of v.models) f.sink = 0
    await wait(0.15)
  }

  // (F5a) A burrower's dust: a few brown motes and a clod or two thrown up
  // from each standing figure's base as it tunnels (walk())
  dust(v) {
    const fx = this.effects
    for (const f of v.models) {
      if (!f.mesh?.parent || f.dying) continue
      const y = (f.y ?? 0) + 0.06
      for (let i = 0; i < 2; i++) {
        const a = Math.random() * Math.PI * 2, s = 0.6 + Math.random() * 1.2
        fx.mote({ x: f.x + Math.cos(a) * 0.12, y, z: f.z + Math.sin(a) * 0.12, vx: Math.cos(a) * s, vy: 0.8 + Math.random() * 1.4, vz: Math.sin(a) * s, size: 0.035 + Math.random() * 0.025, color: DUST[(Math.random() * DUST.length) | 0], life: 0.45 + Math.random() * 0.3, g: 5 })
      }
      if (Math.random() < 0.35) fx.cube({ x: f.x, y: y + 0.05, z: f.z, vx: (Math.random() - 0.5) * 2, vy: 1.5 + Math.random() * 1.5, vz: (Math.random() - 0.5) * 2, size: 0.05, color: DUST[0], life: 0.8, fadeAt: 0.5 })
    }
  }

  // (F9b) A long hull walks its path (unit.move's, core/actions/move.js's
  // hullWalk: { x, z, f } points from where it stood, each run a straight
  // drive at its points' f, forward or backing, each pivot a point
  // repeated with its new f): each run in game time at the walk's speed,
  // facing its f whichever way it goes (a run against DIRS[f] backs up),
  // and each pivot on the spot, the yaw tweened through its 45° at
  // PIVOT_RATE (a quarter second); the disc (the outline, the hit volume,
  // the figure following) where the walk has got to, as walk() does a
  // round unit's. Its smashes play as the walk passes their `s`, which
  // counts the path's inches and PIVOT_S a pivot (the event's L); a smash
  // on a pivot plays as the pivot turns past it. A wrecker setting off
  // stomps. The yaw, unwrapped as it turns, ends on the mirror's f.
  async hullWalk(e, smash) {
    const v = this.views.get(e.u), gen = this.gen
    const { path: pts, speed, smashes } = e
    const hid = this.hid(e.u)
    if (e.stomp && !hid) sfx.boom(0.4)
    v.moving = true
    // the pieces: a run { a, b, l } or a pivot { a, y0, y1 }, each with its
    // place in the walk's measure (s, ds) and in time (t, dt)
    const seg = []
    let s = 0, t = 0, yaw = (pts[0].f * Math.PI) / 4
    const tops = pts.length > 0 && 'y' in pts[0]
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i]
      if (a.x === b.x && a.z === b.z) {
        // (a pivot to the next heading round, right (h + 1, the yaw up an
        // eighth of a turn) or left)
        const y1 = yaw + (b.f === ((a.f + 1) & 7) ? Math.PI / 4 : -Math.PI / 4)
        seg.push({ pivot: true, a, y0: yaw, y1, s, ds: PIVOT_S, t, dt: Math.PI / 4 / PIVOT_RATE })
        yaw = y1
        s += PIVOT_S
        t += Math.PI / 4 / PIVOT_RATE
      } else {
        const l = hypot(b.x - a.x, b.z - a.z)
        seg.push({ pivot: false, a, b, yaw, s, ds: l, t, dt: l / speed })
        s += l
        t += l / speed
      }
    }
    let next = 0
    const play = ({ ev }) => {
      smash(ev)
      if (!hid) this.effects.shake = Math.max(this.effects.shake, 0.08)
    }
    const gone = () => this.gone(e.u, v, gen)
    const T = t
    if (seg.length) {
      await tween(T + 0.15, (k) => {
        if (gone()) return
        const now = Math.min(T, k * (T + 0.15))
        const q = seg.find((p) => now <= p.t + p.dt) ?? seg[seg.length - 1]
        const f = q.dt > 0 ? Math.min(1, (now - q.t) / q.dt) : 1
        if (q.pivot) {
          v.facing = lerp(q.y0, q.y1, easeInOut(f))
          v.at = { x: q.a.x, y: tops ? (q.a.y ?? 0) : 0, z: q.a.z }
        } else {
          v.facing = q.yaw
          const x = lerp(q.a.x, q.b.x, f), z = lerp(q.a.z, q.b.z, f)
          v.at = { x, y: tops ? this.floorAt(x, z) : 0, z }
        }
        this.disc(e.u)
        const d = q.s + q.ds * f
        while (next < smashes.length && smashes[next].s <= d + 1e-9) play(smashes[next++])
      })
    }
    if (gone()) return
    while (next < smashes.length) play(smashes[next++])
    // there: drawn where the mirror has it, facing as it does
    v.at = null
    v.facing = yawOf(this.shown(e.u))
    this.disc(e.u)
    v.moving = false
    await wait(0.15)
  }
}
