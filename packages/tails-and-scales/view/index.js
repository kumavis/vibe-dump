// The view (DESIGN §1.1, §2.4): the table's three.js side, made in its
// order, the handlers that play the match's events on it, and the table
// made at once to show a match as it stands (rebuild, the player's snap).
//
// What the view makes as the page loads, and in which order, decides every
// cosmetic Math.random draw the title shows (the mat's paint, the wood, the
// tufts, the flowers: three.js draws some for every object it makes, its
// uuid), so it is made in the order main.js always made it, in two parts:
// the table (the renderer and scene, the camera and its controls, the
// lights, the effects, the mat and the board, the objectives, the
// battlefield's meshes), then, once app/boot.js has drawn the title's board
// seed, the figures, the shooting's effects and the overlay (figures()).
// sim/terrain-shots.mjs and sim/title-shot.mjs hold the title, drawn from a
// seeded Math.random, to the code before, pixel for pixel (but for the
// figures' flocks and idle phases, which the template cache draws from
// another point of the stream: view/models/cache.js).
import { edgeOf } from '../core/match.js'
import { PACE } from '../present/pace.js'
import { Stage } from './stage.js'
import { CameraRig } from './camera.js'
import { Table } from './table.js'
import { ObjectivesView } from './objectives.js'
import { TerrainView } from './terrain.js'
import { UnitViews } from './units.js'
import { Overlay } from './overlay.js'
import { FX } from './effects/fx.js'
import { Shots } from './effects/shots.js'
import { Diorama } from './diorama.js'
import { Ghosts } from './fog.js'
import { wait } from './clock.js'

// (F8a) what of a board the table is made for: its size, its zones' depth
// and where its objectives stand
const boardKey = ({ W, H, deploy }, objectives) => JSON.stringify([W, H, deploy, objectives.map((o) => [o.x, o.z])])

export class View {
  // The table: `W`, `H` the board's size, `deploy` the deployment's depth
  // and `edges` the seats' edges (the zones), `objectives` their places and
  // `range` their reach, `colorOf(seat)` a seat's colour (each flag in its
  // holder's: the seats' look, ui/theme.js); (V2) `quality` the stage's
  // (view/stage.js's QUALITY).
  constructor({ lowfi = false, fast = false, quality = 'high', W, H, deploy, edges, objectives, range, colorOf }) {
    this.fast = fast
    // (F8a) the board shown (setBoard): classic's, the title's, as made
    this.boardKey = boardKey({ W, H, deploy }, objectives)
    // (how often a match's board made the table over: ?debug's)
    this.boardBuilds = 0
    this.stage = new Stage({ lowfi, fast, quality })
    const { renderer, scene } = this.stage
    this.renderer = renderer
    this.scene = scene
    this.rig = new CameraRig(renderer)
    this.camera = this.rig.camera
    this.controls = this.rig.controls
    this.stage.light()
    this.effects = new FX(scene, this.camera, this.stage.overlay)
    this.table = new Table(scene, renderer, { W, H, deploy, edges })
    this.objectives = new ObjectivesView(scene, objectives, range, colorOf)
    // The battlefield's meshes. The battlefield itself is the match's
    // (G.terrain): each terrain call reports what it built or broke into
    // G.out, among the events of the entry the Session folds, and the player
    // plays each report (the terrain.* handlers) when it reaches it in those
    // events, in order (a wrecker's smashes as its walk passes them).
    this.terrain = new TerrainView(scene, this.effects)
  }

  // The figures (view/units.js: each unit's view by unit id, following the
  // unit as shown, `mirror()`, the player's), how the shooting looks
  // (view/effects/shots.js) and what a seat's tools draw on the table
  // (view/overlay.js: one texel per nav cell, `grid` every match's grid
  // size).
  figures({ mirror, colorOf, rimOf, W, H, grid }) {
    // ((F7a's review) a walk's figures on the tops they cross: floorAt)
    this.units = new UnitViews({ scene: this.scene, labels: this.stage.overlay, fx: this.effects, mirror, colorOf, rimOf, W, floorAt: (x, z) => this.terrain.floorAt(x, z) })
    // ((F7a) a template marked, landing and scorching on the top it falls on)
    this.shots = new Shots({ scene: this.scene, fx: this.effects, units: this.units, floorAt: (x, z) => this.terrain.floorAt(x, z) })
    // ((F7a) the overlay shades the battlefield's deck tops too)
    this.overlay = new Overlay(this.scene, { W, H, grid, terrain: this.terrain })
    // ((F16) the courtesy fog's ghosts: where an unseen enemy was last seen)
    this.ghosts = new Ghosts({ scene: this.scene, labels: this.stage.overlay, units: this.units })
  }

  // The view's handlers for the player (view/player.js): each kind of event
  // with the old code's visuals, called with the event and the mirror just
  // after it is folded in (app/flow.js merges in the UI's and the flow's).
  // `localSeats()`: the seats played here (the camera never follows during
  // their turn). (F16) What a unit the courtesy fog veils does shows
  // nothing over the table (view/units.js's hid: its volley, its spell, its
  // shout); a template's aim, throw and landing, and the scenery's events,
  // carry the fog's own say (`veil`, app/flow.js's: those hidden never
  // reach these handlers; a walk's smashes hidden are left out here).
  handlers({ localSeats }) {
    const { rig, units, shots, terrain } = this
    return {
      // the beats between
      pause: (e) => wait(PACE.pause(e.s)),
      // the camera, when it follows the action (the stage and the seat to act
      // as shown: a focus event plays while the match has run ahead, a whole
      // AI turn or more; never during the turn of the one seat played here)
      focus: (e, M) => rig.focus(e.x, e.z, { stage: M.stage, active: M.active, localSeats: localSeats() }),
      // ((F14) an action played on its own, as it opens (view/player.js's
      // cue: where its actors stand and go, where to glide, whether it
      // carries a focus of its own, which is then left out): one move of
      // the camera for it, framed or glided to, as the follow policy says;
      // never an action of a seat played here, unless its orders after End)
      cue: (e, M) => rig.cue(e, { stage: M.stage, active: M.active, localSeats: localSeats() }),
      // the figures ((F9a) a placed rider steps off its hull; a placed hull
      // carries its riders, on its deck)
      'unit.place': (e) => units.placed(e),
      'unit.formation': (e) => {
        units.disc(e.u)
        units.label(e.u)
      },
      'unit.wound': (e) => units.wounded(e),
      'unit.slain': (e, M) => units.slain(e, M),
      'unit.flee': (e) => units.fled(e),
      'unit.destroyed': (e, M) => units.destroyed(e, M),
      'unit.face': (e) => units.face(e),
      // ((F9a) riders board a hull and step off it, or bail out of its
      // wreck: view/units.js's deck)
      'unit.embark': (e) => units.embarked(e),
      'unit.disembark': (e) => units.disembarked(e),
      // (what a wrecker smashed breaks as the walker passes it)
      'unit.move': (e, M) => units.walk(e, M, (ev) => {
        for (const x of ev) if (x.veil !== 'hide') terrain.apply(x, M)
      }),
      melee: (e) => units.lunge(e),
      'charge.result': (e) => units.shout(e),
      // the shooting
      volley: (e) => (units.hid(e.u) ? undefined : shots.volley(e)),
      'blast.aim': (e) => shots.aimed(e),
      'blast.scatter': (e) => shots.scattered(e),
      'blast.fire': (e) => shots.fired(e),
      'blast.land': (e) => shots.landed(e),
      // ((F19a) a powder keg set off: its fuse, a beat before its blast)
      'keg.fuse': (e) => shots.fused(e),
      'spell.cast': (e) => (units.hid(e.u) ? undefined : shots.cast()),
      'spell.fizzle': (e) => (units.hid(e.u) ? undefined : shots.fizzled(e)),
      'spell.thorns': (e) => shots.thorns(e, { quiet: units.hid(e.u) }),
      'spell.fade': (e) => shots.faded(e),
      'spell.gaze': (e) => (units.hid(e.u) ? undefined : shots.gaze(e)),
      'spell.mesmerized': (e) => (units.hid(e.tg) ? undefined : shots.mesmerized(e)),
      // what the labels and flags show: read off the mirror, which these
      // have just updated (the flags repaint each frame, view/objectives.js)
      status: () => units.labelAll(),
      objectives: () => {},
      // the battlefield
      'terrain.clear': (e, M) => terrain.apply(e, M),
      'terrain.add': (e, M) => terrain.apply(e, M),
      'terrain.hurt': (e, M) => terrain.apply(e, M),
      'terrain.destroy': (e, M) => terrain.apply(e, M),
      'terrain.collapse': (e, M) => terrain.apply(e, M),
      'terrain.rubble': (e, M) => terrain.apply(e, M),
    }
  }

  // The table made to show a match as it stands (the player's snap): the
  // battlefield from its chunks, the figures from its units, and what the
  // view holds outside the mirror taken away: the shooting's (a template's
  // marker, an eruption's thorns) and fx's scorch and acid marks (a snap
  // back to an earlier point, or onto another match, would keep them from a
  // timeline it left). `M` is the player's contract (view/player.js's
  // view.rebuild(G, M)); the views read the mirror themselves (their
  // mirror(), the player's, which it has set to M by now). Into the page's
  // views, unless `to` names others: the ?debug snap check makes its fresh
  // snap with this same function, into views off the table (and at a
  // checkpoint, `chunks` G's as they stood).
  rebuild(g, M, to = {}) {
    const { chunks = g.terrain.chunks, terrain = this.terrain, units: uv = this.units, shots: sh = this.shots, effects: marks = this.effects } = to
    // (a snap of the page's own table lets go of a batch's flags; one into
    // views off the table, ?debug's snapDiff, leaves them be)
    if (!to.units) this.owners = null
    // (F8a) the table for the match's board, should its mission have chosen
    // another than the one shown (the presenter's: M.board; the zones'
    // depth and the objectives from the match)
    if (!to.units) this.setBoard({ ...g.board, ...M.board }, g.objectives, g.nav)
    terrain.sync(chunks)
    // ((F7a) each objective's marker on the top it stands on: the keep's
    // centre objective is held from its top)
    if (!to.units) this.objectives.raise(g.objectives.map((o) => terrain.floorAt(o.x, o.z)))
    uv.sync(g.units, (s) => edgeOf(g, s))
    sh.clear()
    marks.clearDecals()
  }

  // (F8a) The table for a board W×H whose zones run `deploy` deep, with
  // `objectives` ([{ x, z }]) and a nav grid `grid` ({ nx, nz }): the mat,
  // frame and zones (Table.resize), the objectives (place), the overlay's
  // texture (resize), the edge a fleeing figure runs off, the camera's
  // reach and far plane (the rig's setBoard), the fog and shadows (the
  // stage's fit); (F8b) and on a larger board the terrain's tiles and the
  // figures' far stand-ins. Only when it differs from the board shown: between two
  // classic matches nothing is made or drawn again (the title's frame, its
  // Math.random draws, stay as they were). True when it rebuilt.
  setBoard({ W, H, deploy }, objectives, grid) {
    const key = boardKey({ W, H, deploy }, objectives)
    if (key === this.boardKey) return false
    this.boardKey = key
    this.boardBuilds++
    this.table.resize({ W, H, deploy })
    this.objectives.place(objectives)
    this.overlay?.resize({ W, H, grid: { nx: grid.nx, nz: grid.nz } })
    if (this.units) this.units.W = W
    this.rig.setBoard({ W, H })
    this.stage.fit({ W, H })
    // (F8b) drawing at scale, on a board larger than classic's: the
    // terrain in tiles, the far figures' stand-ins (classic's table drawn
    // exactly as ever: DESIGN §4.2.7)
    const big = W * H > 40 * 28
    this.terrain.tiling(big)
    if (this.units) this.units.lod = big
    return true
  }

  // text floating at `pos` (the player's fallback: an event with no
  // handler of its own says what it is)
  text(pos, str, color) {
    this.effects.text(pos, str, color)
  }

  // (V1) The flags' owners held while a batch of walks plays (the player's:
  // each walk's objectives shown once it has arrived), null for the
  // mirror's as ever.
  holdOwners(owners) {
    this.owners = owners
  }

  // Run the table (view/stage.js): each frame the effects, the figures and
  // the flags as shown (`mirror()`, the player's, or the owners a batch
  // holds; `sel()`, the id of the unit picked up), then the camera.
  run({ mirror, sel }) {
    const { effects, units, objectives, camera } = this
    this.stage.run({
      parts: (dt, time) => {
        effects.update(dt)
        // ((F9a) a wreck's smoke and embers)
        if (!this.fast) this.terrain.animate(dt, time)
        units.animate(dt, time, { fast: this.fast, camera, sel: sel() })
        // ((F16) the fog's ghosts' labels)
        if (this.ghosts.standing.size) this.ghosts.animate(camera, this.fast, mirror().stage === 'title')
        objectives.animate(dt, time, this.owners ?? mirror().owners)
      },
      rig: this.rig,
      shake: () => effects.shake,
      // (F6) a race's figures in a window of the page, after the table
      after: (wall) => this.made?.draw(wall),
    })
  }

  // (F6) The race showcase (view/diorama.js): made the first time a window
  // asks for it, never as the page loads (the title's draws are the
  // table's).
  get diorama() {
    return (this.made ??= new Diorama(this.renderer))
  }
}
