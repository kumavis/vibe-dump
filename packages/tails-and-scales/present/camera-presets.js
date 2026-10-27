// Where the camera looks (DESIGN §2.11): the presets and which one a battle
// opens on, as plain numbers. Pure: no three.js, no DOM, nothing but the
// board's size; view/camera.js (the CameraRig) moves the camera to them,
// and sim/camera-check.mjs tests them in Node.
//
// R7 kept the R0 code's views exactly: the title's slow orbit from behind
// seat 0's lines, and a battle seen across the table on a landscape screen
// or down its length from behind seat 0 on a portrait one (main.js's
// defaultView and fitFov before R7; sim/camera-check.mjs holds the camera
// made at load, the field of view and the orbit to the R0 code's still).
// (F1, F2) A battle now opens `behind` the one seat played here, its own
// army in front whichever edge it holds (the serpents' too), and
// `broadside` for everyone else (a watched battle, hotseat's two seats):
// one army left, one right. Both are fitted to the screen and to the board
// by fitPose, and the view button cycles through them and an overview.
import { BOARD } from '../core/rules.js'

// The board as a rectangle on the table, its centre and size: (F8a) a
// match's own, from the board its mission chose (G.board), or classic's
// (the ruleset's BOARD, which the classic mission's board is: the title's,
// and every preset's when no other is passed).
export const boardRect = ({ W, H }) => Object.freeze({ cx: 0, cz: 0, w: W, h: H })
export const BOARD_RECT = boardRect(BOARD)

// (F8a) How far a board's views reach beyond classic's: its diagonal over
// classic's, never under 1 (so a classic board's presets, dolly, fog and
// far plane are exactly classic's). A preset's `max` is classic's, scaled
// by it, so each preset can still take in the whole of a larger board.
export const reachOf = (rect = BOARD_RECT) => Math.max(1, Math.hypot(rect.w, rect.h) / Math.hypot(BOARD.W, BOARD.H))

// (F8b) the distances the behind view of a larger board is held to.
// DESIGN §4.2.7 planned 45-60"; measured in Chromium (a Grand battle's
// opening at 1280×800), the Bushtails' figures in their zone stand a median
// 14.3 px tall at 60" and 17.5 px at 48", so the far end is 46" (Field's
// half fits from 45.5" on a 16:9 screen)
const HALF = Object.freeze([45, 46])

export const PRESETS = Object.freeze({
  // the title screen: a slow drift around (centre) from behind seat 0's
  // lines (the west edge), across toward seat 1's; `angle` where it starts,
  // `speed` radians per game second
  title: Object.freeze({ orbit: Object.freeze({ centre: Object.freeze([-5, 0, 0]), radius: 25, y: 13, speed: 0.035, angle: -1.02 }) }),
  // a battle on a landscape screen: across the table
  landscape: Object.freeze({ pos: Object.freeze([0, 30, 31]), target: Object.freeze([0, 0, 1.5]), fov: 40 }),
  // a battle on a portrait screen: down the table's length from behind
  // seat 0's lines, so the 28" width is what has to fit
  portrait: Object.freeze({ pos: Object.freeze([-36, 46, 0]), target: Object.freeze([-1, 0, 0]), fov: 56 }),
  // (F2) one army left, one right: seat 0 (west) on the left. Its max lets
  // a portrait phone take in the whole board (about 104" at 412×915)
  broadside: Object.freeze({ azimuth: 0, elevation: 0.77, max: 105 }),
  // (F1) from behind the seat played here, its own army in front. (F8b) On
  // a board larger than classic's (Field, Grand) it fits the seat's own
  // half, its zone to the centre line, at a distance held to `half` (45-46",
  // where the army's figures stand 18-22 px tall on a 1280×800 screen: the
  // half of a Grand board, 61-77" away on a laptop, would leave them 14 px;
  // held there, it looks from the seat's own edge on, toEdge): the whole
  // board is the broadside's and the overview's (fitPose)
  behind: (edge) => Object.freeze({ azimuth: edge < 0 ? -Math.PI / 2 : Math.PI / 2, elevation: 0.9, max: 80, half: HALF }),
  // the whole board from nearly overhead (the view button's last, and the
  // Home key)
  overview: Object.freeze({ azimuth: 0, elevation: 1.45, max: 100 }),
})

// Whether a screen of this aspect is landscape: as wide as it is tall, or
// wider. (Today's `innerWidth >= innerHeight`, which a 0×0 screen, whose
// aspect is NaN, passes too.)
const wide = (aspect) => !(aspect < 1)

// The view a battle opens on, for the seats played on this screen and each
// seat's edge (-1 west, 1 east): (F1) behind the one seat played here,
// (F2) else broadside. The screen's shape no longer decides it: fitPose
// fits either to the screen.
export const battleView = ({ localSeats = [], edges = [] }) => (localSeats.length === 1 ? PRESETS.behind(edges[localSeats[0]]) : PRESETS.broadside)

// The views the view button (and V) steps through, the battle's own first:
// behind the seat played here, broadside, behind the other army, overview;
// for a watched or hotseat battle, broadside, behind the west army, behind
// the east, overview.
export function viewsFor({ localSeats = [], edges = [] }) {
  if (localSeats.length === 1) {
    const own = edges[localSeats[0]]
    return [PRESETS.behind(own), PRESETS.broadside, PRESETS.behind(-own), PRESETS.overview]
  }
  return [PRESETS.broadside, PRESETS.behind(-1), PRESETS.behind(1), PRESETS.overview]
}

// The camera's vertical field of view for a screen's aspect: wider on a
// portrait screen (the title's too).
export const fovFor = (aspect) => (wide(aspect) ? PRESETS.landscape.fov : PRESETS.portrait.fov)

// Where an orbit puts the camera at game time `time`, having started at
// `angle`: { pos, target }.
export function orbitPose(orbit, time, angle = orbit.angle) {
  const a = angle + time * orbit.speed
  const c = orbit.centre
  return { pos: [c[0] + Math.sin(a) * orbit.radius, orbit.y, c[2] + Math.cos(a) * orbit.radius], target: [c[0], c[1], c[2]] }
}

// Whether the camera follows the action to (a `focus` event): only when the
// player asked it to (the HUD's 🎥), in battle, and never during the turn of
// the one seat played here (hotseat's two seats and a spectator's none
// follow every turn).
export const follows = ({ follow, stage, active, localSeats }) => !!follow && stage === 'battle' && !(localSeats.length === 1 && localSeats.includes(active))

// A pose for a preset given by azimuth and elevation, fitted to the screen
// and the board (`rect`, classic's by default): the camera looking at the
// board's centre from the nearest distance at which the whole board shows
// (all four corners, whichever way it lies across the screen), with room
// for the HUD (12% each way), never farther than the preset's `max` (F8a:
// scaled by the board's reachOf). A pose preset (pos and target) is
// returned as it is. (The CameraRig's fit and
// goTo go through it. Each fitted preset's max takes in the whole classic
// board on every screen down to a 412×915 portrait phone; sim/camera-check
// says so.)
// (F8b) A preset with a `half` ([near, far]: behind) on a board larger than
// classic's fits the half on its own side of the centre line instead (the
// seat's zone to the centre line, its army in front), no nearer than near
// and no farther than far; classic's (reach 1) is fitted as ever.
export function fitPose(preset, aspect, rect = BOARD_RECT) {
  if (preset.pos) return preset
  if (preset.half && reachOf(rect) > 1) {
    const edge = Math.sin(preset.azimuth) < 0 ? -1 : 1
    const half = { cx: rect.cx + (edge * rect.w) / 4, cz: rect.cz, w: rect.w / 2, h: rect.h }
    const [near, far] = preset.half
    const pose = fitIn(preset, aspect, half, far, near)
    const d = Math.hypot(pose.pos[0] - pose.target[0], pose.pos[1], pose.pos[2] - pose.target[2])
    return d < far - 1e-9 ? pose : toEdge(preset, pose, rect.cx + (edge * rect.w) / 2, far)
  }
  return fitIn(preset, aspect, rect, preset.max * reachOf(rect), 1)
}

// (F8b) A half held at its far distance shows only part of it: the target
// slides from the half's middle toward the seat's own edge (`ex`, its x)
// until that edge sits at the foot of the view (the HUD's 12% left below
// it), so the army in its zone shows whole, and the view runs on from it as
// far toward the centre line as the distance lets it.
function toEdge(preset, pose, ex, d) {
  const tv = Math.tan((pose.fov * Math.PI) / 360)
  const { azimuth: az, elevation: el } = preset
  const dir = [Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)]
  const fwd = dir.map((x) => -x)
  const up = cross(norm([-fwd[2], 0, fwd[0]]), fwd)
  const cz = pose.target[2]
  // where on the screen the edge's middle lands, the target at x = tx (-1:
  // the foot of the view, 1 its top)
  const yOf = (tx) => {
    const v = [ex - tx - dir[0] * d, -dir[1] * d, -dir[2] * d]
    return dot(v, up) / (dot(v, fwd) * tv)
  }
  const foot = -1 / 1.12
  if (yOf(pose.target[0]) >= foot) return pose
  let a = pose.target[0], b = ex
  for (let i = 0; i < 60; i++) {
    const mid = (a + b) / 2
    if (yOf(mid) >= foot) b = mid
    else a = mid
  }
  return { pos: [b + dir[0] * d, dir[1] * d, cz + dir[2] * d], target: [b, 0, cz], fov: pose.fov }
}

// the nearest distance from which the rectangle shows whole, from `min` to
// `max` (classic's every view: from 1 to the preset's max)
function fitIn(preset, aspect, rect, max, min) {
  const fov = fovFor(aspect)
  const tv = Math.tan((fov * Math.PI) / 360), th = tv * aspect
  const { azimuth: az, elevation: el } = preset
  // the camera's direction from the centre, and its right and up
  const dir = [Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)]
  const fwd = dir.map((x) => -x)
  const right = norm([-fwd[2], 0, fwd[0]])
  const up = cross(right, fwd)
  const { cx, cz, w, h } = rect
  // the corners, from the board's centre
  const corners = [[-w / 2, -h / 2], [w / 2, -h / 2], [-w / 2, h / 2], [w / 2, h / 2]].map(([x, z]) => [x, 0, z])
  // whether the board fits from distance d
  const fits = (d) => corners.every((p) => {
    const v = [p[0] - dir[0] * d, p[1] - dir[1] * d, p[2] - dir[2] * d]
    const depth = dot(v, fwd)
    return depth > 0 && Math.abs(dot(v, right)) * 1.12 <= depth * th && Math.abs(dot(v, up)) * 1.12 <= depth * tv
  })
  let lo = 1, hi = max
  if (fits(lo)) hi = lo
  else if (fits(hi)) for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    if (fits(mid)) hi = mid
    else lo = mid
  }
  if (hi < min) hi = min
  return { pos: [cx + dir[0] * hi, dir[1] * hi, cz + dir[2] * hi], target: [cx, 0, cz], fov }
}

// ── (F8b) Navigation at scale (DESIGN §4.2.7) ─────────────────────────────
// The keys' pan speed, in inches a second, for a camera `d` inches from
// what it looks at: classic's 18 up close, faster as it pulls back (80" of
// Grand board crossed in about 4 s from the overview, not 5).
export const panSpeed = (d) => 18 * Math.max(1, d / 50)

// The circle round a batch's members, where they stand and where they go
// (`points`, [{ x, z }]): the centre of their box, and a radius reaching
// the farthest and `pad` beyond (a unit's base and a little ground).
export function circleOf(points, pad = 3) {
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity
  for (const p of points) {
    x0 = Math.min(x0, p.x)
    x1 = Math.max(x1, p.x)
    z0 = Math.min(z0, p.z)
    z1 = Math.max(z1, p.z)
  }
  const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2
  let r = 0
  for (const p of points) r = Math.max(r, Math.hypot(p.x - cx, p.z - cz))
  return { cx, cz, r: r + pad }
}

// A pose that frames a circle on the table (`c`: { cx, cz, r }) looking the
// way the camera looks now (`from`: its pos and target), as near as takes
// it in whole with room for the HUD (the circle as a ball of its radius,
// 12% each way, the narrower of the view's two angles) and from `min` to
// `max` inches away (the dolly's own limits).
export function framePose(c, from, aspect, { min = 12, max = Infinity } = {}) {
  const fov = fovFor(aspect)
  const tv = Math.tan((fov * Math.PI) / 360), th = tv * aspect
  const half = Math.atan(Math.min(tv, th))
  const d = Math.min(max, Math.max(min, (c.r * 1.12) / Math.sin(half)))
  const v = [from.pos[0] - from.target[0], from.pos[1] - from.target[1], from.pos[2] - from.target[2]]
  const l = Math.hypot(v[0], v[1], v[2]) || 1
  return { pos: [c.cx + (v[0] / l) * d, (v[1] / l) * d, c.cz + (v[2] / l) * d], target: [c.cx, 0, c.cz], fov }
}

// Whether the camera frames a batch as it opens (DESIGN §4.2.7's batch
// framing): with 🎥 on, in battle, when the camera follows that turn
// (follows: never during the turn of the one seat played here) or the batch
// is that seat's own orders, played after it pressed End (`ended`: the seat
// whose End the camera keeps a bookmark for, view/camera.js's).
export const frames = ({ follow, stage, active, localSeats, ended = -1 }) => !!follow && stage === 'battle' && (follows({ follow, stage, active, localSeats }) || (ended >= 0 && ended === active))

// ── (F14) The camera follows an action played on its own ─────────────────
// A batch is framed as it opens (frames, above), but only the AI's own
// actions and the fights carry a `focus` (core/ai/policy.js,
// core/actions/fight.js), and a lone walk is no batch: a human seat's move,
// shot or charge played alone, an online opponent's every one, moved the
// camera not at all. So the view reads where the camera should go off the
// action's own events, as frame reads a batch's: each action played on its
// own is cued once, as it opens (cueAt), and the CameraRig makes one move
// for it (view/camera.js's cue): it frames the actors if any is off
// screen, as a batch's members are framed, else glides toward the action
// as a focus does. Pure, as the rest of this module: which events make an
// action, which places they name, and whose actions are followed.

// Where a run of events' actors stand and go, the table as it shows them
// before any of it is played (`posOf(id)`: a unit's place, the mirror's):
// each unit an event names (`u`, `tg`: a walker, a shooter and its target,
// a charger, the units struck), each place one goes to (`to`: a walk's end,
// a template scattered or thrown), and the places a template is aimed at
// or lands on, or thorns erupt at, (F19a) or a powder keg goes off at.
// (view/player.js's frame gathers a batch's members with it, and cueAt an
// action's.)
const PLACED = new Set(['blast.aim', 'blast.land', 'keg.fuse', 'spell.thorns'])
export function pointsOf(events, posOf) {
  const points = []
  const add = (p) => p && Number.isFinite(p.x) && Number.isFinite(p.z) && points.push({ x: p.x, z: p.z })
  for (const e of events) {
    if (e.u !== undefined) add(posOf(e.u))
    if (e.tg !== undefined) add(posOf(e.tg))
    if (e.to) add(e.to)
    if (PLACED.has(e.t)) add(e)
  }
  return points
}

// What opens an action (the AI's focus on it, the turn to face, its tray),
// what an action does that the camera follows (a walk, a volley, a template
// aimed or thrown, a spell, a charge's verdict, a blow struck), and what
// ends one where it stands (a phase begun, a round scored, a stage, the end)
const OPENS = new Set(['focus', 'unit.face', 'tray.open'])
const DEEDS = new Set(['unit.move', 'volley', 'blast.aim', 'blast.fire', 'spell.cast', 'spell.fizzle', 'spell.thorns', 'spell.gaze', 'charge.result', 'melee'])
const ENDS = new Set(['phase.start', 'round.scored', 'stage', 'game.over'])

// The action that opens at event k, if one does: from its opening or its
// first deed through its end (its `act`, or the match stopping for a
// decision, `pending`: a charge that reached waits for its spot, and its
// walk is the next entry's action), or up to the next action's opening, or
// to what ends one. Null when nothing opens at k, or what does holds no
// deed (an advance's roll, a morale test, a deployment's placement: nothing
// the camera follows). Else { to: the index after its last event, points:
// its actors (pointsOf, the table as it stands at k), x, z: where the
// camera glides when they are all on screen, own: whether it carries a
// focus of its own }: its first focus (the AI's, a fight's: the glide the
// follow policy has always made), else its first walk's end (a human
// seat's move, or a charge's walk to its spot), else the middle of its
// actors (a shot, a charge: the shooter and the target or the landing, as
// the AI's own focus on a shot or a charge is their middle).
export function cueAt(events, k, posOf) {
  if (!events[k] || !(OPENS.has(events[k].t) || DEEDS.has(events[k].t))) return null
  let to = k, deed = false, own = null, walk = null
  for (let j = k; j < events.length; j++) {
    const e = events[j]
    if (ENDS.has(e.t) || (deed && OPENS.has(e.t))) break
    to = j + 1
    if (DEEDS.has(e.t)) deed = true
    if (e.t === 'focus') own ??= e
    if (e.t === 'unit.move') walk ??= e
    if (e.t === 'act' || e.t === 'pending') break
  }
  if (!deed) return null
  const points = pointsOf(events.slice(k, to), posOf)
  if (!points.length) return null
  const at = own ?? (walk && Number.isFinite(walk.to?.x) ? walk.to : null)
  const c = circleOf(points, 0)
  return { to, points, x: at ? at.x : c.cx, z: at ? at.z : c.cz, own: !!own }
}

// Whether the camera follows an action that carries no focus of its own: a
// seat's command (a human seat's move, shot or charge, or its standing
// orders), cueAt's `own` false. As a batch is framed (frames), but never an
// action of a seat played here, which its player is making (hotseat's two
// seats too, where the follow policy follows every turn: the camera would
// chase each player's own clicks), unless it is that seat's orders played
// after its End (`ended`, the bookmark's seat). An action with a focus of
// its own (the AI's, a fight's) is followed as frames says, as ever.
export const cues = (ctx) => frames(ctx) && (!ctx.localSeats.includes(ctx.active) || ctx.ended === ctx.active)
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const norm = (a) => {
  const l = Math.hypot(a[0], a[1], a[2])
  return a.map((x) => x / l)
}
