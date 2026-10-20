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
// coordinate), and battleView must still choose by the screen's shape alone
// (F1's `behind` and F2's `broadside` are in the module, chosen by no
// battle yet). Then what the module promises of its own: everything frozen,
// fitPose fitting the whole board into the view for the presets it fits,
// no farther than their `max`. Then the glue: view/camera.js's CameraRig,
// made in Node over a stand-in canvas, swung by goTo onto every preset
// (landscape, portrait, broadside, behind either edge) on screens of
// several shapes, its tween run to the end and its controls updated, must
// come to rest where fitPose puts it (a pose preset exactly where it says),
// not pulled in by the controls' dolly limit; and back on the title, the
// limit is today's again.
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
const { PRESETS, battleView, fovFor, orbitPose, follows, fitPose } = await imp('present/camera-presets.js')
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
  const want = legacyView(w, h)
  for (const localSeats of SEATS) {
    const got = battleView({ localSeats, edges: [-1, 1], aspect: w / h })
    check(same([...got.pos], xyz(want.pos)) && same([...got.target], xyz(want.target)), `battleView on ${w}×${h} for the seats ${JSON.stringify(localSeats)} is the view the R0 code opened a battle on`, `${JSON.stringify(got)} | ${xyz(want.pos)} → ${xyz(want.target)}`)
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
// fitPose: the board's four corners inside the view, at the preset's
// elevation, no farther than its max; a pose preset comes back as it is
check(fitPose(PRESETS.landscape, 1.6) === PRESETS.landscape, 'fitPose leaves a pose preset as it is')
const { W, H } = BOARD
for (const [name, preset] of [['broadside', PRESETS.broadside], ['behind(-1)', PRESETS.behind(-1)], ['behind(1)', PRESETS.behind(1)]]) {
  for (const aspect of [16 / 9, 1.6, 4 / 3, 1, 0.75, 9 / 19.5]) {
    const p = fitPose(preset, aspect)
    const cam = new THREE.PerspectiveCamera(p.fov, aspect, 0.1, 400)
    cam.position.set(...p.pos)
    cam.lookAt(new THREE.Vector3(...p.target))
    cam.updateMatrixWorld()
    const d = Math.hypot(...p.pos)
    const corners = [[-W / 2, -H / 2], [W / 2, -H / 2], [-W / 2, H / 2], [W / 2, H / 2]].map(([x, z]) => new THREE.Vector3(x, 0, z).project(cam))
    const inside = corners.every((v) => Math.abs(v.x) <= 1 && Math.abs(v.y) <= 1 && v.z < 1)
    const el = Math.atan2(p.pos[1], Math.hypot(p.pos[0], p.pos[2]))
    check((inside || d >= preset.max - 1e-9) && d <= preset.max + 1e-9 && Math.abs(el - preset.elevation) < 1e-9, `fitPose(${name}) on aspect ${aspect.toFixed(2)} sees the whole board (or stops at its max ${preset.max}), at its elevation`, `distance ${d.toFixed(1)}, corners ${corners.map((v) => `${v.x.toFixed(2)},${v.y.toFixed(2)}`).join(' ')}`)
  }
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
const RIG_PRESETS = [['landscape', PRESETS.landscape], ['portrait', PRESETS.portrait], ['broadside', PRESETS.broadside], ['behind(-1)', PRESETS.behind(-1)], ['behind(1)', PRESETS.behind(1)]]
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

// pure: nothing but the board's size from core/
const src = readFileSync(join(PKG, 'present', 'camera-presets.js'), 'utf8')
const imports = [...src.matchAll(/^import .* from '([^']+)'/gm)].map((m) => m[1])
check(imports.join() === '../core/rules.js', 'present/camera-presets.js imports only core/rules.js (pure: no three.js, no DOM)', imports.join(', '))

console.log(bad ? `\ncamera-check FAILED: ${bad} of ${checks} checks` : `\ncamera-check passed: ${checks} checks, the presets give the R0 code's camera exactly, and keep their own promises`)
process.exit(bad ? 1 : 0)
