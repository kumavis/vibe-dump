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
const { PRESETS, battleView, viewsFor, fovFor, orbitPose, follows, fitPose, BOARD_RECT } = await imp('present/camera-presets.js')
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
  const p = fitPose({ ...preset, max: 500 }, 1.6, rect)
  const cam = new THREE.PerspectiveCamera(p.fov, 1.6, 0.1, 800)
  cam.position.set(...p.pos)
  cam.lookAt(new THREE.Vector3(...p.target))
  cam.updateMatrixWorld()
  const inside = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz]) => new THREE.Vector3(rect.cx + (sx * rect.w) / 2, 0, rect.cz + (sz * rect.h) / 2).project(cam)).every((v) => Math.abs(v.x) <= 1 && Math.abs(v.y) <= 1 && v.z < 1)
  check(inside && p.target[0] === 5 && p.target[1] === 0 && p.target[2] === -3, `fitPose(${name}) of a 60×40 board centred at (5, -3) looks at its centre and sees it whole`, `${p.pos} → ${p.target}`)
}
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

// pure: nothing but the board's size from core/
const src = readFileSync(join(PKG, 'present', 'camera-presets.js'), 'utf8')
const imports = [...src.matchAll(/^import .* from '([^']+)'/gm)].map((m) => m[1])
check(imports.join() === '../core/rules.js', 'present/camera-presets.js imports only core/rules.js (pure: no three.js, no DOM)', imports.join(', '))

console.log(bad ? `\ncamera-check FAILED: ${bad} of ${checks} checks` : `\ncamera-check passed: ${checks} checks, the camera at load, the field of view, the title's orbit and the follow rule are the R0 code's, a battle opens behind the seat played here or broadside, and the presets keep their own promises`)
process.exit(bad ? 1 : 0)
