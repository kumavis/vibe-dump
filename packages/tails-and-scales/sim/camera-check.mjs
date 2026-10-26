// The camera presets' unit test (DESIGN §2.11, R7): present/camera-presets.js
// is pure, and in R7 it must give exactly the views a player saw before it.
// The reference is the R0 code's main.js (sim/lib.mjs's LEGACY_REF, a fixed
// commit; the code before R7 had the same lines), whose camera code is read
// as text and run here: the camera made at load (fov, place, target), the
// battle's view as it starts (defaultView, by the screen's shape), the field
// of view for a screen (fitFov), the title's orbit (the angle it starts at
// and its pose at a game time) and the follow rule (focus: never during the
// turn of the one seat played against the AI). For a range of screens, game
// times and modes, the presets must give the same numbers (=== on every
// coordinate): the landscape and portrait presets are still the R0 code's
// battle views by the screen's shape. (F1, F2) But a battle no longer opens
// on them: battleView opens behind the one seat played here, whichever
// edge it holds, and broadside for no seat or two, on every screen; and
// viewsFor lists the view button's views, the battle's own first, then
// broadside, behind the other army and the overview. Then what the module
// promises of its own: everything frozen, fitPose fitting the whole board
// into the view for the presets it fits, no farther than their `max`, which
// takes in the whole classic board on every screen down to a 412×915
// portrait phone; and fitPose of another board (F8's rectangle) centred on
// it and taking it in whole. Then the glue: view/camera.js's CameraRig,
// made in Node over a stand-in canvas, swung by goTo onto every preset
// (landscape, portrait, broadside, behind either edge, overview) on screens
// of several shapes, its tween run to the end and its controls updated,
// must come to rest where fitPose puts it (a pose preset exactly where it
// says), not pulled in by the controls' dolly limit; stepped through a
// battle's views by nextView and toOverview; and back on the title, the
// limit is today's again and there are no views to step through.
// (F8b) Navigation at scale: on a Field or Grand board the behind view fits
// the seat's own half (its zone to the centre line), 45-46" away, its target
// the half's middle (held at 46", slid toward its edge, which then sits at
// the foot of the view), while the broadside and the overview still take in the
// whole board (classic's every pose as it was); the keys pan at
// dt · 18 · max(1, d/50); a batch with a member off screen is framed whole
// (the circle round its members' starts and ends inside the view, looking
// the way the camera looked), but not with 🎥 off, not with everyone on
// screen, never during the turn of the one seat played here, and yes for
// that seat's own orders after its End (the bookmark's seat); the bookmark
// takes the camera back to where End was pressed at that seat's next phase,
// once; and a cluster's zoom frames its circle. (F8b's review) The semantic
// zoom on classic's board: Close on every view of every mode, on a laptop
// and portrait phones, though some of those poses are under 12 px per inch.
//
//   node sim/camera-check.mjs
//
// Exit 0 when every check holds, 1 otherwise.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import * as THREE from 'three'
import { legacyDir, LEGACY_REF } from './lib.mjs'
import { PKG } from './oracle/pin.mjs'

const imp = (f) => import(pathToFileURL(join(PKG, f)).href)
const { PRESETS, battleView, viewsFor, fovFor, orbitPose, follows, fitPose, BOARD_RECT, boardRect, reachOf } = await imp('present/camera-presets.js')
const { BOARD } = await imp('core/rules.js')
const legacy = readFileSync(join(legacyDir(), 'main.js'), 'utf8')

let bad = 0, checks = 0
const check = (ok, what, why = '') => {
  checks++
  if (!ok) {
    bad++
    console.log(`  FAIL ${what}${why ? `: ${why}` : ''}`)
  }
}
// a piece of the R0 code's main.js, found by a pattern (its first group)
const grab = (re, what) => {
  const m = re.exec(legacy)
  if (!m) throw new Error(`camera-check: the R0 code's main.js has no ${what} (${re})`)
  return m[1]
}
const xyz = (v) => [v.x, v.y, v.z]
const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i])

// ── The R0 code's camera, run as it was written ─────────────────────────────
// `function defaultView() {…}` and fitFov's fov, with the screen's size
const viewSrc = grab(/(function defaultView\(\) \{[\s\S]*?\n\})/, 'defaultView')
const legacyView = (w, h) => new Function('THREE', 'innerWidth', 'innerHeight', `${viewSrc}\nreturn defaultView()`)(THREE, w, h)
const fovSrc = grab(/camera\.fov = ([^\n]+)/, "fitFov's fov")
const legacyFov = (w, h) => new Function('innerWidth', 'innerHeight', `return ${fovSrc}`)(w, h)
// the camera as made at load
const made = grab(/(const camera = new THREE\.PerspectiveCamera\([^\n]*\)\ncamera\.position\.set\([^\n]*\))/, 'the camera')
const legacyCamera = new Function('THREE', 'innerWidth', 'innerHeight', `${made}\nreturn camera`)(THREE, 1280, 800)
const legacyTarget = grab(/controls\.target\.set\(([^)]*)\)/, "the controls' target").split(',').map(Number)
// the title's orbit: where it starts, its pose at game time t
const angle0 = Number(grab(/S\.titleAngle = (-?[\d.]+)/, "the title's starting angle"))
const spinSrc = grab(/if \(S\.titleSpin\) \{\n([\s\S]*?)\n {2}\}/, "the title's spin")
const legacySpin = (titleAngle, time) => {
  const camera = { position: new THREE.Vector3() }, controls = { target: new THREE.Vector3() }
  new Function('S', 'clock', 'camera', 'controls', spinSrc)({ titleAngle }, { time }, camera, controls)
  return { pos: xyz(camera.position), target: xyz(controls.target) }
}
// the follow rule, by mode: R0's focus() returned early when the seat to act
// is human and the two seats' controllers differ (vs. the AI)
const followSrc = grab(/function focus\(x, z\) \{\n([^\n]*\n[^\n]*\n)/, "focus's rule")
const legacyFollows = ({ follow, stage, active, control }) => {
  const S = { follow, stage, active, control }
  const human = (s) => control[s] === 'human'
  // (a bare return is a no)
  return new Function('S', 'human', `${followSrc}\nreturn true`)(S, human) === true
}

console.log(`camera-check: present/camera-presets.js against the R0 code's camera (${LEGACY_REF.slice(0, 9)})`)

// the camera as made, and the title's start
check(PRESETS.landscape.fov === legacyCamera.fov && same([...PRESETS.landscape.pos], xyz(legacyCamera.position)) && same([...PRESETS.landscape.target], legacyTarget), 'the camera as made at load is the landscape preset', `${legacyCamera.fov} ${xyz(legacyCamera.position)} ${legacyTarget}`)
check(PRESETS.title.orbit.angle === angle0, `the title's orbit starts at ${angle0}`, String(PRESETS.title.orbit.angle))

// the screens: landscape, square, portrait, and the edge of each
const SCREENS = [[1280, 800], [1920, 1080], [800, 800], [801, 800], [800, 801], [390, 844], [768, 1024], [2560, 1080], [360, 640], [1024, 768], [0, 0], [0, 800], [800, 0]]
const SEATS = [[], [0], [1], [0, 1]]
for (const [w, h] of SCREENS) {
  const want = legacyView(w, h), kept = w / h < 1 ? PRESETS.portrait : PRESETS.landscape
  check(same([...kept.pos], xyz(want.pos)) && same([...kept.target], xyz(want.target)), `the ${w / h < 1 ? 'portrait' : 'landscape'} preset is the view the R0 code opened a battle on, on ${w}×${h}`, `${JSON.stringify(kept)} | ${xyz(want.pos)} → ${xyz(want.target)}`)
  // (F1, F2) a battle opens behind the one seat played here, else broadside,
  // whatever the screen's shape, and whichever edge each seat holds
  for (const edges of [[-1, 1], [1, -1]]) for (const localSeats of SEATS) {
    const got = battleView({ localSeats, edges, aspect: w / h })
    const wantView = localSeats.length === 1 ? PRESETS.behind(edges[localSeats[0]]) : PRESETS.broadside
    check(JSON.stringify(got) === JSON.stringify(wantView), `battleView on ${w}×${h} for the seats ${JSON.stringify(localSeats)} (edges ${edges}) is ${localSeats.length === 1 ? `behind seat ${localSeats[0]}'s edge` : 'broadside'}`, JSON.stringify(got))
  }
  check(fovFor(w / h) === legacyFov(w, h), `the field of view on ${w}×${h} is fitFov's (${legacyFov(w, h)})`, String(fovFor(w / h)))
}
// the orbit at game times through a few turns, from the start and from an
// angle Back to the war room set
for (const titleAngle of [angle0, angle0 - 12.3 * 0.035, 2.5]) {
  for (const t of [0, 0.016, 1.2, 7.5, 33.3, 180, 1234.5678]) {
    const want = legacySpin(titleAngle, t), got = orbitPose(PRESETS.title.orbit, t, titleAngle)
    check(same(got.pos, want.pos) && same(got.target, want.target), `the title's orbit at angle ${titleAngle.toFixed(3)}, game time ${t}`, `${got.pos} | ${want.pos}`)
  }
}
// the follow rule in every mode, every seat to act, follow on and off, at
// every stage
const MODES = { bushtail: ['human', 'ai'], serpent: ['ai', 'human'], hotseat: ['human', 'human'], watch: ['ai', 'ai'] }
for (const [mode, control] of Object.entries(MODES)) {
  const localSeats = control.flatMap((c, s) => (c === 'human' ? [s] : []))
  for (const stage of ['title', 'deploy', 'battle', 'over']) for (const follow of [true, false]) for (const active of [0, 1]) {
    const want = legacyFollows({ follow, stage, active, control }), got = follows({ follow, stage, active, localSeats })
    check(got === want, `the camera follows (${want}) in ${mode} at the ${stage}, seat ${active} to act, follow ${follow ? 'on' : 'off'}`, String(got))
  }
}

// ── The module's own promises ───────────────────────────────────────────────
const frozen = (o, path) => {
  if (!o || typeof o !== 'object') return
  check(Object.isFrozen(o), `${path} is frozen`)
  for (const [k, v] of Object.entries(o)) frozen(v, `${path}.${k}`)
}
frozen(PRESETS, 'PRESETS')
frozen(PRESETS.behind(-1), 'PRESETS.behind(-1)')
check(PRESETS.behind(-1).azimuth === -Math.PI / 2 && PRESETS.behind(1).azimuth === Math.PI / 2, "behind(edge) looks from behind the seat's own edge")
// (F1, F2) the view button's views: the battle's own first, then the rest,
// the overview last, each seat's back and the broadside among them
const key = (v) => JSON.stringify(v)
for (const edges of [[-1, 1], [1, -1]]) for (const localSeats of SEATS) {
  const views = viewsFor({ localSeats, edges }).map(key)
  const want = (localSeats.length === 1 ? [PRESETS.behind(edges[localSeats[0]]), PRESETS.broadside, PRESETS.behind(-edges[localSeats[0]])] : [PRESETS.broadside, PRESETS.behind(-1), PRESETS.behind(1)]).concat(PRESETS.overview).map(key)
  check(views.join('|') === want.join('|') && views[0] === key(battleView({ localSeats, edges })), `viewsFor the seats ${JSON.stringify(localSeats)} (edges ${edges}): the battle's own view first, then the others, the overview last`, views.join(' | '))
}
// fitPose: the board's four corners inside the view, at the preset's
// elevation, no farther than its max (which, down to a 412×915 portrait
// phone, never stops it short); a pose preset comes back as it is
check(fitPose(PRESETS.landscape, 1.6) === PRESETS.landscape, 'fitPose leaves a pose preset as it is')
const { W, H } = BOARD
const PHONE = 412 / 915
for (const [name, preset] of [['broadside', PRESETS.broadside], ['behind(-1)', PRESETS.behind(-1)], ['behind(1)', PRESETS.behind(1)], ['overview', PRESETS.overview]]) {
  for (const aspect of [21 / 9, 16 / 9, 1.6, 4 / 3, 1, 0.75, 9 / 16, 9 / 19.5, PHONE, 0.4]) {
    const p = fitPose(preset, aspect)
    const cam = new THREE.PerspectiveCamera(p.fov, aspect, 0.1, 400)
    cam.position.set(...p.pos)
    cam.lookAt(new THREE.Vector3(...p.target))
    cam.updateMatrixWorld()
    const d = Math.hypot(...p.pos)
    const corners = [[-W / 2, -H / 2], [W / 2, -H / 2], [-W / 2, H / 2], [W / 2, H / 2]].map(([x, z]) => new THREE.Vector3(x, 0, z).project(cam))
    const inside = corners.every((v) => Math.abs(v.x) <= 1 && Math.abs(v.y) <= 1 && v.z < 1)
    const el = Math.atan2(p.pos[1], Math.hypot(p.pos[0], p.pos[2]))
    check((inside || (aspect < PHONE && d >= preset.max - 1e-9)) && d <= preset.max + 1e-9 && Math.abs(el - preset.elevation) < 1e-9, `fitPose(${name}) on aspect ${aspect.toFixed(2)} sees the whole board${aspect < PHONE ? ` (or stops at its max ${preset.max})` : ''}, at its elevation`, `distance ${d.toFixed(1)}, corners ${corners.map((v) => `${v.x.toFixed(2)},${v.y.toFixed(2)}`).join(' ')}`)
    // classic's rectangle by default
    check(key(fitPose(preset, aspect, BOARD_RECT)) === key(p), `fitPose(${name}) on aspect ${aspect.toFixed(2)}: classic's board is the default rectangle`)
  }
  // (F8's) another board, off centre: looked at from its own centre, whole
  const rect = { cx: 5, cz: -3, w: 60, h: 40 }
  // ((F8b) the whole rectangle: behind's half rule left out)
  const p = fitPose({ ...preset, max: 500, half: undefined }, 1.6, rect)
  const cam = new THREE.PerspectiveCamera(p.fov, 1.6, 0.1, 800)
  cam.position.set(...p.pos)
  cam.lookAt(new THREE.Vector3(...p.target))
  cam.updateMatrixWorld()
  const inside = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz]) => new THREE.Vector3(rect.cx + (sx * rect.w) / 2, 0, rect.cz + (sz * rect.h) / 2).project(cam)).every((v) => Math.abs(v.x) <= 1 && Math.abs(v.y) <= 1 && v.z < 1)
  check(inside && p.target[0] === 5 && p.target[1] === 0 && p.target[2] === -3, `fitPose(${name}) of a 60×40 board centred at (5, -3) looks at its centre and sees it whole`, `${p.pos} → ${p.target}`)
  // (F8a) a mission's board: the preset's max, scaled by the board's reach,
  // takes it in whole down to a 412×915 portrait phone, as classic's does
  // ((F8b) the broadside and the overview: behind fits the seat's half, below)
  for (const [bw, bh] of preset.half ? [] : [[60, 40], [80, 56]]) {
    const r = boardRect({ W: bw, H: bh })
    for (const aspect of [16 / 9, 4 / 3, 1, 9 / 16, PHONE]) {
      const q = fitPose(preset, aspect, r)
      const c = new THREE.PerspectiveCamera(q.fov, aspect, 0.1, 1000)
      c.position.set(...q.pos)
      c.lookAt(new THREE.Vector3(...q.target))
      c.updateMatrixWorld()
      const d = Math.hypot(...q.pos)
      const whole = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz]) => new THREE.Vector3((sx * bw) / 2, 0, (sz * bh) / 2).project(c)).every((v) => Math.abs(v.x) <= 1 && Math.abs(v.y) <= 1 && v.z < 1)
      check(whole && d <= preset.max * reachOf(r) + 1e-9, `(F8a) fitPose(${name}) of a ${bw}×${bh} board on aspect ${aspect.toFixed(2)} sees it whole, within its max scaled by the board's reach (${(preset.max * reachOf(r)).toFixed(1)})`, `distance ${d.toFixed(1)}`)
    }
  }
}
check(reachOf(BOARD_RECT) === 1 && reachOf(boardRect(BOARD)) === 1 && key(boardRect(BOARD)) === key(BOARD_RECT), "(F8a) classic's board reaches 1: its presets, dolly and far plane are exactly classic's")
// ── The rig: goTo(preset) through fit ───────────────────────────────────────
// a page's globals, enough for the CameraRig and its OrbitControls to be
// made and moved (no input reaches them)
const listen = { addEventListener() {}, removeEventListener() {} }
Object.assign(globalThis, { addEventListener() {}, removeEventListener() {}, document: listen })
const canvas = { ...listen, style: {}, ownerDocument: listen, getRootNode: () => listen, clientHeight: 800, getBoundingClientRect: () => ({ left: 0, top: 0, width: 1280, height: 800 }) }
const { CameraRig } = await imp('view/camera.js')
const { stepTweens } = await imp('view/clock.js')
const close = (a, b) => a.every((x, i) => Math.abs(x - b[i]) <= 1e-9)
const RIG_PRESETS = [['landscape', PRESETS.landscape], ['portrait', PRESETS.portrait], ['broadside', PRESETS.broadside], ['behind(-1)', PRESETS.behind(-1)], ['behind(1)', PRESETS.behind(1)], ['overview', PRESETS.overview]]
let fartherThanToday = 0
for (const [w, h] of [[1280, 720], [800, 800], [800, 1280], [390, 845]]) {
  globalThis.innerWidth = w
  globalThis.innerHeight = h
  for (const [name, preset] of RIG_PRESETS) {
    const where = `CameraRig.goTo(${name}) on ${w}×${h}`
    const rig = new CameraRig({ domElement: canvas })
    const want = fitPose(preset, w / h)
    check(rig.fit(preset) === want || same(rig.fit(preset).pos, want.pos), `${where}: fit is fitPose for the screen`)
    try {
      rig.goTo(preset)
    } catch (e) {
      check(false, where, `threw ${e.message}`)
      continue
    }
    for (let i = 0; i < 30; i++) stepTweens(0.1)
    for (let i = 0; i < 5; i++) rig.update(0)
    const pos = xyz(rig.camera.position), target = xyz(rig.controls.target)
    const d = Math.hypot(pos[0] - target[0], pos[1] - target[1], pos[2] - target[2])
    const dWant = Math.hypot(want.pos[0] - want.target[0], want.pos[1] - want.target[1], want.pos[2] - want.target[2])
    if (dWant > 75) fartherThanToday++
    check(pos.every(Number.isFinite) && target.every(Number.isFinite), `${where}: the camera rests at finite numbers`, `${pos} → ${target}`)
    check(close(pos, want.pos) && close(target, want.target) && Math.abs(d - dWant) <= 1e-9, `${where}: the camera rests where fitPose puts it${preset.pos ? " (the preset's own pose)" : ''}`, `at ${pos.map((x) => x.toFixed(3))} → ${target.map((x) => x.toFixed(3))}, distance ${d.toFixed(3)}; wanted ${want.pos.map((x) => x.toFixed(3))} → ${want.target}, ${dWant.toFixed(3)}`)
    rig.toTitle()
    check(rig.controls.maxDistance === 75, `${where}, then back on the title: the dolly's limit is today's 75`, String(rig.controls.maxDistance))
  }
}
// (F8a) the rig on a mission's board: the dolly reaches the overview's fit
// and a tenth more, the far plane three times a preset's farthest; back on
// classic's, exactly 75 and 400
{
  globalThis.innerWidth = 1280
  globalThis.innerHeight = 720
  const rig = new CameraRig({ domElement: canvas })
  rig.setBoard({ W: 80, H: 56 })
  const o = fitPose(PRESETS.overview, 1280 / 720, boardRect({ W: 80, H: 56 }))
  const d = Math.hypot(o.pos[0] - o.target[0], o.pos[1] - o.target[1], o.pos[2] - o.target[2])
  check(Math.abs(rig.dolly - Math.max(75, d * 1.1)) < 1e-9 && rig.camera.far === Math.max(400, 3 * PRESETS.overview.max * reachOf(boardRect({ W: 80, H: 56 }))), `(F8a) CameraRig.setBoard(80×56): the dolly ${rig.dolly.toFixed(1)} (the overview's ${d.toFixed(1)} and a tenth), the far plane ${rig.camera.far}`)
  rig.goTo(PRESETS.overview)
  check(rig.controls.maxDistance >= rig.dolly, '(F8a) goTo on an 80×56 board: the dolly reaches the overview', String(rig.controls.maxDistance))
  rig.setBoard({ W: 40, H: 28 })
  check(rig.dolly === 75 && rig.camera.far === 400, "(F8a) CameraRig.setBoard back to 40×28: classic's 75 and 400", `${rig.dolly}, ${rig.camera.far}`)
}
// (the dolly's limit is held only if some fitted preset goes past it)
check(fartherThanToday > 0, 'some preset the rig was swung onto rests beyond the dolly limit of 75 (so the limit is tested)', String(fartherThanToday))
// (F1, F2) a battle's views stepped through: setViews swings onto the
// first, nextView onto each next and round again, toOverview onto the last;
// on the title there are none, and neither moves the camera
{
  globalThis.innerWidth = 1280
  globalThis.innerHeight = 800
  const rig = new CameraRig({ domElement: canvas })
  const settle = () => {
    for (let i = 0; i < 30; i++) stepTweens(0.1)
    for (let i = 0; i < 5; i++) rig.update(0)
    return xyz(rig.camera.position)
  }
  const views = viewsFor({ localSeats: [1], edges: [-1, 1] })
  const at = (v) => fitPose(v, 1280 / 800).pos
  rig.setViews(views)
  const seen = [settle()]
  for (let i = 0; i < views.length; i++) {
    rig.nextView()
    seen.push(settle())
  }
  const want = [0, 1, 2, 3, 0].map((i) => at(views[i]))
  check(seen.every((p, i) => close(p, want[i])), 'setViews swings onto the battle\'s own view, and nextView onto each next one and round again', seen.map((p) => p.map((x) => x.toFixed(1))).join(' | '))
  rig.nextView()
  settle()
  rig.toOverview()
  check(close(settle(), at(PRESETS.overview)), 'toOverview swings onto the overview')
  rig.toTitle()
  const still = xyz(rig.camera.position)
  rig.nextView()
  rig.toOverview()
  for (let i = 0; i < 30; i++) stepTweens(0.1)
  check(!rig.views.length && close(xyz(rig.camera.position), still), 'on the title there are no views: nextView and toOverview do nothing')
}

// ── (F8b) Navigation at scale ──────────────────────────────────────────────
const { panSpeed, circleOf, framePose, frames } = await imp('present/camera-presets.js')
const dist = (p) => Math.hypot(p.pos[0] - p.target[0], p.pos[1] - p.target[1], p.pos[2] - p.target[2])
// a camera made at a pose: whether ground points show inside its middle
// `k` of the screen
const seen = (p, aspect, pts, k = 1) => {
  const c = new THREE.PerspectiveCamera(p.fov ?? fovFor(aspect), aspect, 0.1, 2000)
  c.position.set(...p.pos)
  c.lookAt(new THREE.Vector3(...p.target))
  c.updateMatrixWorld()
  return pts.every(([x, z]) => {
    const v = new THREE.Vector3(x, 0, z).project(c)
    return Math.abs(v.x) <= k && Math.abs(v.y) <= k && v.z < 1
  })
}
// the behind view on Field and Grand: the seat's own half, 45-46" away (its
// `half`; DESIGN planned 45-60, the figures measured 14 px at 60), and held
// there, from its own edge on
for (const [bw, bh] of [[60, 40], [80, 56]]) {
  const r = boardRect({ W: bw, H: bh })
  for (const edge of [-1, 1]) for (const aspect of [21 / 9, 16 / 9, 1.6, 4 / 3, 1, 9 / 16, PHONE]) {
    const p = fitPose(PRESETS.behind(edge), aspect, r), d = dist(p)
    const half = [[(edge * bw) / 2, -bh / 2], [(edge * bw) / 2, bh / 2], [0, -bh / 2], [0, bh / 2]]
    const el = Math.atan2(p.pos[1] - p.target[1], Math.hypot(p.pos[0] - p.target[0], p.pos[2] - p.target[2]))
    const back = Math.sign(p.pos[0] - p.target[0]) === edge
    // (its target the half's middle; or, held at its far distance, slid
    // toward its own edge until the edge's middle sits at the view's foot,
    // 1/1.12 of the way down)
    const c = new THREE.PerspectiveCamera(p.fov, aspect, 0.1, 2000)
    c.position.set(...p.pos)
    c.lookAt(new THREE.Vector3(...p.target))
    c.updateMatrixWorld()
    const foot = new THREE.Vector3((edge * bw) / 2, 0, 0).project(c).y
    const middle = p.target[0] === (edge * bw) / 4
    const slid = !middle && Math.abs(foot + 1 / 1.12) < 1e-6 && Math.abs(p.target[0]) > bw / 4 && Math.abs(p.target[0]) < bw / 2
    check((middle ? foot >= -1 / 1.12 - 1e-9 : slid) && p.target[1] === 0 && p.target[2] === 0 && back && Math.abs(el - 0.9) < 1e-9, `(F8b) behind(${edge}) on a ${bw}×${bh} board, aspect ${aspect.toFixed(2)}: it looks ${middle ? "at its own half's middle" : 'from its own edge on, the edge at the foot of the view'} (${p.target[0].toFixed(2)}, 0) from behind its edge, at its elevation`, `${p.pos.map((x) => x.toFixed(1))} → ${p.target}; the edge at y ${foot.toFixed(3)}`)
    const [near, far] = PRESETS.behind(edge).half
    check(near === 45 && far === 46 && d >= near - 1e-9 && d <= far + 1e-9 && (d >= far - 1e-9 || (middle && seen(p, aspect, half, 1 + 1e-9))), `(F8b) behind(${edge}) on a ${bw}×${bh} board, aspect ${aspect.toFixed(2)}: ${d.toFixed(1)}" away, in 45-46, its half (zone to centre line) whole unless held at 46`, `distance ${d.toFixed(2)}`)
  }
  // the broadside and the overview: the whole board, as F8a fitted them
  for (const [name, preset] of [['broadside', PRESETS.broadside], ['overview', PRESETS.overview]]) for (const aspect of [16 / 9, 1, PHONE]) {
    const p = fitPose(preset, aspect, r)
    check(seen(p, aspect, [[-bw / 2, -bh / 2], [bw / 2, -bh / 2], [-bw / 2, bh / 2], [bw / 2, bh / 2]], 1 + 1e-9) && p.target.every((x) => x === 0), `(F8b) ${name} on a ${bw}×${bh} board, aspect ${aspect.toFixed(2)}: the whole board`)
  }
}
// classic's behind is classic's fit: half or not, the same numbers
for (const aspect of [16 / 9, 1, PHONE]) for (const edge of [-1, 1]) {
  const { half, ...plain } = PRESETS.behind(edge)
  check(key(fitPose(PRESETS.behind(edge), aspect)) === key(fitPose(plain, aspect)) && Array.isArray(half), `(F8b) behind(${edge}) on classic's board, aspect ${aspect.toFixed(2)}: the pose it had before F8b (its half rule reaches only a larger board)`)
}
// the keys' pan speed
check(panSpeed(0) === 18 && panSpeed(30) === 18 && panSpeed(50) === 18 && panSpeed(100) === 36 && panSpeed(75) === 27, '(F8b) the keys pan 18"/s up to 50" away, then 18 · d/50', [0, 30, 50, 75, 100].map(panSpeed).join(', '))
// the batch's circle and the pose that frames it
{
  const pts = [{ x: -30, z: -20 }, { x: -10, z: 4 }, { x: 22, z: 18 }, { x: 5, z: -2 }]
  const c = circleOf(pts)
  check(pts.every((p) => Math.hypot(p.x - c.cx, p.z - c.cz) <= c.r - 3 + 1e-9) && c.cx === -4 && c.cz === -1, "(F8b) circleOf: its box's centre, every point inside it and 3\" to spare", JSON.stringify(c))
  for (const aspect of [16 / 9, 1, PHONE]) {
    const from = fitPose(PRESETS.broadside, aspect, boardRect({ W: 80, H: 56 }))
    const p = framePose(c, from, aspect)
    const dir = (q) => q.pos.map((x, i) => (x - q.target[i]) / dist(q))
    check(seen(p, aspect, pts.map((q) => [q.x, q.z])) && close(dir(p), dir(from)) && p.target[0] === c.cx && p.target[2] === c.cz, `(F8b) framePose on aspect ${aspect.toFixed(2)}: every member inside the view, the camera looking the way it looked, at the circle's centre`, `${p.pos.map((x) => x.toFixed(1))} → ${p.target}`)
    const capped = framePose(c, from, aspect, { max: 20 })
    check(Math.abs(dist(capped) - 20) < 1e-9, `(F8b) framePose on aspect ${aspect.toFixed(2)}: no farther than the dolly's limit`, dist(capped).toFixed(2))
  }
}
// the framing policy: 🎥 on, in battle, a turn the camera follows, or the
// seat's own orders after its End
for (const [ctx, want, what] of [
  [{ follow: true, stage: 'battle', active: 1, localSeats: [0] }, true, "the AI's turn, 🎥 on"],
  [{ follow: false, stage: 'battle', active: 1, localSeats: [0] }, false, "the AI's turn, 🎥 off"],
  [{ follow: true, stage: 'battle', active: 0, localSeats: [0] }, false, 'the turn of the one seat played here (its own decision)'],
  [{ follow: true, stage: 'battle', active: 0, localSeats: [0], ended: 0 }, true, "that seat's orders after its End"],
  [{ follow: true, stage: 'battle', active: 0, localSeats: [0], ended: 1 }, false, "that seat's turn, another seat's End kept"],
  [{ follow: true, stage: 'deploy', active: 1, localSeats: [0] }, false, 'the deployment'],
  [{ follow: true, stage: 'battle', active: 0, localSeats: [] }, true, 'a watched battle'],
  [{ follow: true, stage: 'battle', active: 1, localSeats: [0, 1] }, true, 'hotseat'],
]) check(frames(ctx) === want, `(F8b) a batch is ${want ? '' : 'not '}framed in ${what}`)
// the rig: frame, the bookmark, frameOn, the keys
{
  globalThis.innerWidth = 1280
  globalThis.innerHeight = 800
  const rig = new CameraRig({ domElement: canvas })
  const settle = () => {
    for (let i = 0; i < 30; i++) stepTweens(0.1)
    for (let i = 0; i < 5; i++) rig.update(0)
    return rig.pose()
  }
  rig.setBoard({ W: 80, H: 56 })
  rig.setViews(viewsFor({ localSeats: [0], edges: [-1, 1] }))
  const start = settle()
  check(Math.abs(dist(start) - dist(fitPose(PRESETS.behind(-1), 1280 / 800, boardRect({ W: 80, H: 56 })))) < 1e-6 && dist(start) >= 45 && dist(start) <= 46, `(F8b) a Grand battle opens behind the seat played here, ${dist(start).toFixed(1)}" away`)
  const AI = { stage: 'battle', active: 1, localSeats: [0] }, MINE = { stage: 'battle', active: 0, localSeats: [0] }
  const near = [{ x: start.target[0], z: start.target[2] }, { x: start.target[0] + 2, z: start.target[2] - 2 }]
  const far = [{ x: 30, z: 20 }, { x: 34, z: 24 }, { x: 26, z: 18 }]
  check(rig.frame(near, AI) === false && close(settle().pos, start.pos), '(F8b) frame: every member on screen, the camera stays')
  check(rig.frame(far, MINE) === false && close(settle().pos, start.pos), '(F8b) frame: never during the turn of the one seat played here')
  rig.follow = false
  check(rig.frame(far, AI) === false && close(settle().pos, start.pos), '(F8b) frame: not with 🎥 off')
  rig.follow = true
  const want = framePose(circleOf(far), start, 1280 / 800, { min: rig.controls.minDistance * 2, max: rig.controls.maxDistance })
  check(rig.frame(far, AI) === true, "(F8b) frame: members off screen on the AI's turn are framed")
  const got = settle()
  check(close(got.pos, want.pos) && close(got.target, want.target) && seen({ ...got, fov: fovFor(1280 / 800) }, 1280 / 800, far.map((p) => [p.x, p.z])), '(F8b) frame: the camera rests where framePose puts it, the members in view', `${got.pos.map((x) => x.toFixed(1))} → ${got.target.map((x) => x.toFixed(1))}`)
  // the bookmark: End pressed at a pose, the camera moved away, back at the
  // seat's next phase, once
  // (the camera where the last framing left it, over the far cluster)
  const marked = settle()
  rig.bookmark(0)
  check(rig.frame([{ x: -30, z: -24 }, { x: -36, z: -20 }], MINE) === true, "(F8b) frame: the seat's own orders after its End are framed")
  settle()
  rig.nextView()
  settle()
  check(rig.resume(1) === false, "(F8b) resume: another seat's phase takes the camera nowhere")
  check(rig.resume(0) === true && close(settle().pos, marked.pos) && close(rig.pose().target, marked.target), "(F8b) resume: the seat's next phase glides back to where it pressed End")
  rig.nextView()
  const elsewhere = settle()
  check(rig.resume(0) === false && close(settle().pos, elsewhere.pos), '(F8b) resume: the bookmark is spent once')
  // ((F8b's review) hotseat: each seat's End keeps its own bookmark; the
  // other seat's phases and End leave it, and each seat's next phase
  // glides back to its own)
  rig.nextView()
  const at0 = settle()
  rig.bookmark(0)
  rig.nextView()
  check(rig.resume(1) === false, "(F8b's review) resume: seat 1's phase with only seat 0's bookmark takes the camera nowhere, the bookmark kept")
  const at1 = settle()
  rig.bookmark(1)
  rig.nextView()
  settle()
  check(rig.resume(0) === true && close(settle().pos, at0.pos), "(F8b's review) hotseat: seat 0's next phase glides back to its own End's pose though seat 1 pressed End since")
  rig.nextView()
  settle()
  check(rig.resume(1) === true && close(settle().pos, at1.pos), "(F8b's review) hotseat: and seat 1's to its own")
  check(rig.marks.size === 0, "(F8b's review) both bookmarks spent")
  rig.bookmark(0)
  rig.bookmark(1)
  rig.toTitle()
  check(rig.marks.size === 0, '(F8b) the title lets the bookmarks go')
  // a cluster's zoom
  rig.setViews(viewsFor({ localSeats: [0], edges: [-1, 1] }))
  settle()
  const before = rig.pose()
  rig.frameOn(12, -8, 5)
  const z = settle()
  check(close(z.target, [12, 0, -8]) && Math.abs(dist(z) - dist(framePose({ cx: 12, cz: -8, r: 5 }, before, 1280 / 800, { min: rig.controls.minDistance * 2, max: rig.controls.maxDistance }))) < 1e-6, "(F8b) frameOn: a cluster's circle framed", `${z.pos.map((x) => x.toFixed(1))} → ${z.target}`)
  // the keys: 0.5 s of W moves the camera and its target dt · panSpeed(d)
  // (from the overview, well past 50")
  rig.toOverview()
  const p0 = settle(), d0 = dist(p0)
  rig.keys.add('w')
  rig.panKeys(0.5)
  rig.keys.clear()
  const p1 = rig.pose(), moved = Math.hypot(p1.target[0] - p0.target[0], p1.target[2] - p0.target[2])
  check(Math.abs(moved - 0.5 * panSpeed(d0)) < 1e-6 && Math.abs(p1.target[1] - p0.target[1]) < 1e-12 && d0 > 50, `(F8b) 0.5 s of W pans ${moved.toFixed(2)}" at ${d0.toFixed(1)}" away (dt · 18 · max(1, d/50))`)
}

// ── (F8b's review) The semantic zoom's tier on classic's board ─────────────
// view/units.js's zoom (the view's own method, run over a stand-in of the
// views: no figures, a labels container's dataset) for the camera at rest
// on every view a classic battle offers (vs. the AI from either seat,
// watched, hotseat; each seat's views and the overview) on a laptop and on
// portrait phones: Close, and the labels' data-tier unset, on every one, so
// classic's labels are as they always were. The rule must bite: some of
// those poses are under Close's 12 px per inch (a portrait phone's), where
// a larger board's tiers would read Tactical; and on the grand board a
// phone's overview still reads Strategic.
{
  const { UnitViews } = await imp('view/units.js')
  const { tierOf } = await imp('present/zoom.js')
  const tierAt = (camera, lod) => {
    const v = { lod, tier: 'close', ppi: Infinity, labels: { dataset: {} }, views: new Map() }
    UnitViews.prototype.zoom.call(v, camera)
    return v
  }
  const cases = [['vs. the AI, seat 0', [0]], ['vs. the AI, seat 1', [1]], ['watched', []], ['hotseat', [0, 1]]]
  let poses = 0, under = 0, wrong = []
  for (const [w, h] of [[1280, 800], [412, 915], [390, 845]]) {
    globalThis.innerWidth = w
    globalThis.innerHeight = h
    for (const [mode, localSeats] of cases) {
      const rig = new CameraRig({ domElement: canvas })
      const views = [...viewsFor({ localSeats, edges: [-1, 1] }), PRESETS.overview]
      for (const [k, view] of views.entries()) {
        rig.goTo(view)
        for (let i = 0; i < 30; i++) stepTweens(0.1)
        for (let i = 0; i < 5; i++) rig.update(0)
        rig.camera.updateMatrixWorld()
        const z = tierAt(rig.camera, false)
        poses++
        if (tierOf(z.ppi) !== 'close') under++
        if (z.tier !== 'close' || 'tier' in z.labels.dataset) wrong.push(`${mode}, view ${k} on ${w}×${h}: ${z.ppi.toFixed(1)} px per inch, tier ${z.tier}, data-tier ${z.labels.dataset.tier}`)
      }
    }
  }
  check(!wrong.length, `(F8b's review) every classic battle's view at rest, on 1280×800, 412×915 and 390×845 (${poses} poses), keeps the labels Close, data-tier unset`, wrong.slice(0, 3).join('; '))
  check(under > 0, `(F8b's review) the tier row bites: ${under} of those ${poses} classic poses are under 12 px per inch, where a larger board's labels would go Tactical`)
  globalThis.innerWidth = 412
  globalThis.innerHeight = 915
  const rig = new CameraRig({ domElement: canvas })
  rig.setBoard({ W: 80, H: 56 })
  rig.goTo(PRESETS.overview)
  for (let i = 0; i < 30; i++) stepTweens(0.1)
  for (let i = 0; i < 5; i++) rig.update(0)
  rig.camera.updateMatrixWorld()
  const g = tierAt(rig.camera, true)
  check(g.tier === 'strategic' && g.labels.dataset.tier === 'strategic', `(F8b's review) the grand board's overview on a 412×915 phone reads Strategic (${g.ppi.toFixed(1)} px per inch, data-tier ${g.labels.dataset.tier}): the tiers still work where they are keyed on`)
}

// pure: nothing but the board's size from core/
const src = readFileSync(join(PKG, 'present', 'camera-presets.js'), 'utf8')
const imports = [...src.matchAll(/^import .* from '([^']+)'/gm)].map((m) => m[1])
check(imports.join() === '../core/rules.js', 'present/camera-presets.js imports only core/rules.js (pure: no three.js, no DOM)', imports.join(', '))

console.log(bad ? `\ncamera-check FAILED: ${bad} of ${checks} checks` : `\ncamera-check passed: ${checks} checks, the camera at load, the field of view, the title's orbit and the follow rule are the R0 code's, a battle opens behind the seat played here or broadside, and the presets keep their own promises; (F8b) a larger board opens on the seat's half, the keys pan with the distance, batches are framed as the policy says, and the bookmark takes the camera back`)
process.exit(bad ? 1 : 0)
