// ---------------------------------------------------------------------------
// The line set's generator: the March Wall (Breakthrough, DESIGN's "The line
// set").
//
// A role mission's battlefield is not scattered: it is a defended line built
// to a plan. A set naming `plan: 'wall'` (sets.js `march`) reaches wallPlan
// here instead of recipes.js scatter (core/terrain/terrain.js generate), so
// no other set's draws move. The board is a stone border wall across the
// table where the road crosses into the March: two gate towers with the
// gate between them, at the back of a V the two arms make as they sweep
// forward (west) from it; one arm a curtain walk with siege ladders against
// its outer face and a stair down its inner one, the other the breach (an
// old fall patched with stone and timber courses) ending at a crag, past
// which the Hollow Wood runs to the table's edge. A ditch along the foot,
// cover on the approach, and behind it a hedgebank and a timber watch
// platform: the second line. Four ways through: the gate (once broken), the ladders
// (climbers), the breach (wreckers as it stands, everyone once it is down)
// and the wood (walkers, slowly; never a round hull of r 1.5 that does not
// plough).
//
// One frame. Everything is built for the attacker at the west edge and the
// wood to the north (the canonical frame) and turned as it is added (`at`,
// below): mirrored in z when the board's first draw says the wood stands
// south, and turned half round the centre (the exact point mirror: every
// place negated, every yaw plus π) when the role says the attacker is seat
// 1, at the east edge (`role.flip`). The objectives and the role arrive in
// the attacker-west frame's terms but already mirrored on the table, as
// the mission places them; they are read back into the canonical frame.
// The point mirror is exact by construction: the canonical build is the
// same whatever the flip, and each number the table gets is that build's
// negated or not, so the board built for seat 1 attacking is the board
// built for seat 0, negated, bit for bit (sim/terrain-check.mjs's March
// Wall rows hold it on every seed). The z mirror is exact too (a z negated,
// a yaw turned to −yaw, or to π − yaw for a piece whose look names its own
// −z face, a ladder's or a parapet's, so that face still faces out).
//
// The stream. One mulberry32(seed), its draws in a fixed order: the wood's
// side, the gate's z and its face's x, the arms' sweeps, the wood's gap and
// the crag, then a sub-seed for each recipe (the gatehouse, the arms, the
// wood, the glacis, the second line), as recipes.js's buildFort draws a
// fortification's own. Every look is drawn inside its recipe and recorded
// in `look`, as everywhere.
//
// What the seed never varies (terrain-check's rows): one gate, `gate.w`
// wide, hard while it stands; a breach of at least 6 tails that a wrecker
// ploughs and, broken, a round hull of r 1.5 crosses; two ladders or more,
// each top clear of a walk's end and a tower; the wood's picket (below),
// which a squad of r 1.18 crosses and a non-wrecking hull of r 1.5 never
// does; no piece in the attacker's zone; every optional piece clear of each
// objective by objectiveGap.
//
// The wood's picket. Its trunks stand on the nav grid's cell centres
// (PICKET_CELL, core/match.js's NAV_CELL: data-check holds them equal), in
// one column, `flank.picket` (3) apart, from the crag's top hard cell to
// the table's edge. A trunk's footprint then covers its own cell and no
// other, so between two of them a cell's clearance is exactly 1.5 − 0.25 =
// 1.25 tails: a squad of r 1.18 stands there, a hull of r 1.5 nowhere in
// that column, which every crossing must step on. The track runs straight
// through the gap by the crag; the other trees keep `flank.track` off it and
// a picket from each other; a forest floor lies over every gap.
//
// Returns the footprints placed (T.features, as scatter's) and the plan
// (T.plan): the plain record of the wall the rules, the AI and the view read
// (its shape, and the readers, at the foot of this file). This is consensus
// code: no clock, no Math.random, dmath's trigonometry.
// ---------------------------------------------------------------------------
import { mulberry32, pick, rr, deepFreeze } from '../util.js'
import { hypot, sin, cos, atan2 } from '../dmath.js'
import { column, tree, crate, boulder, floor as forestFloor, hedge, build, buildFort, deck, stair, ladder, parapetRun, WOOD, LADDER_OUT, GATE_OUT, STAIR_SLOPE, PARAPET_LADDER_GAP, PARAPET_END_GAP, PARAPET_T, FOOTPRINT } from './recipes.js'

// the nav grid's cell, on whose centres the wood's picket stands
export const PICKET_CELL = 0.5
// the pad the nav rasters a hard piece with (core/nav.js rebuild's 0.1)
const PICKET_PAD = 0.1
// how far each piece stands in from its arm's ends, the crag's and the
// tower's (the column rows run this far into each), and past the table's
// edge the south arm's walk runs on
const INTO = 0.5, RUN_ON = 3
// the breach's two rows, each this far either side of the arm's line; and
// how far the wood's trees keep from its line
const ROW = 0.7, BREACH_ROOM = 6
// a tower's arm starts this far inside the tower's west face
const ARM_IN = 1
// the stone and timber, drawn from the board's sub-streams
const WALL_STONE = Object.freeze(['#8f8b82', '#9c978d', '#878378', '#a19c91'])
const CRAG = Object.freeze(['#7d7a74', '#8c8880', '#6e6b66', '#77736c'])
const GATE_WOOD = Object.freeze(['#7a2e22', '#6b2a1f', '#842f24'])
const DITCH = Object.freeze(['#4a3b2a', '#43362a', '#523f2c'])
const FLOOR = Object.freeze(['#355a2a', '#2f5226', '#3a6030'])

// ── The frame ───────────────────────────────────────────────────────────────
// A frame at (x, z) turned yaw, as recipes.js's: its own (lx, lz) on the
// canonical table, and its own turn ly as a yaw there.
function frameAt(x, z, yaw) {
  const c = cos(yaw), s = sin(yaw)
  return { p: (lx, lz) => ({ x: x + c * lx + s * lz, z: z - s * lx + c * lz }), yaw: (ly = 0) => yaw + ly }
}
// A straight piece of an arm, from a to b (north to south: its own −z side,
// (uz, −ux), faces out of the wall, toward the attacker): its length, its
// direction, its outward normal, the frame at its middle with its own x
// along it, and the point t along it from a and o out from its line
// (o < 0: in, toward the defender).
function along(a, b) {
  const dx = b.x - a.x, dz = b.z - a.z, L = hypot(dx, dz), ux = dx / L, uz = dz / L
  const F = frameAt((a.x + b.x) / 2, (a.z + b.z) / 2, atan2(-uz, ux))
  return { a, b, L, ux, uz, nx: uz, nz: -ux, F, at: (t, o = 0) => ({ x: a.x + ux * t + uz * o, z: a.z + uz * t - ux * o }) }
}
// the canonical identity frame (a module's (lx, lz) is the table's)
const F0 = Object.freeze({ p: (lx, lz) => ({ x: lx, z: lz }), yaw: (ly = 0) => ly })

// ── The plan ────────────────────────────────────────────────────────────────
export function wallPlan(T, S, seed, objectives, role, opts = {}) {
  if (!role || !role.zones?.attack || typeof role.line !== 'number') throw new Error('the March Wall is built for a role mission: generate needs its role ({ flip, zones: { attack, defend }, line })')
  const rng = mulberry32(seed)
  const { W, H } = T
  // 1. the wood's side (north, unless the draw says south; sim/'s rows may
  // force it, `opts.south`, the draw made all the same)
  let zm = rng() < 0.5
  if (opts.south !== undefined) zm = !!opts.south
  const flip = !!role.flip
  const at = turned(T, zm, flip)
  const back = (o) => ({ x: at.x(o.x), z: at.z(o.z) })
  const objs = objectives.map(back)
  const og = S.objectiveGap
  const clearOfObjectives = (x, z, r) => objs.every((o) => hypot(o.x - x, o.z - z) >= r + og)
  // the attacker zone's front edge (the canonical frame's: west)
  const front = role.zones.attack.x[1]
  // 2. the gate: its middle's z, its outer face's x
  const G = S.gate, w = G.w, half = w / 2
  const GZ = rr(rng, G.z[0], G.z[1])
  const FX = role.line + rr(rng, G.face[0], G.face[1])
  // 3. the arms' sweeps, the wood's gap and the crag
  const sweepN = rr(rng, S.arms.sweep[0], S.arms.sweep[1]), sweepS = rr(rng, S.arms.sweep[0], S.arms.sweep[1])
  const gap = rr(rng, S.flank.gap[0], S.flank.gap[1]), cragR = rr(rng, S.flank.crag[0], S.flank.crag[1])
  // 4.-8. each recipe's own stream
  const sub = () => (rng() * 1e9) | 0
  const seeds = { gatehouse: sub(), arms: sub(), wood: sub(), glacis: sub(), second: sub() }

  const ts = S.tower.s, th = S.tower.h, d = S.walk.d, wh = S.walk.h
  const placed = []
  const plan = { towers: [], walks: [], stairs: [], ladders: [], breach: null, posts: [] }

  // ── the gatehouse ──
  // two towers ts × ts, th high, their west faces the gate's face, the
  // passage w wide between them; the gate across it at the face; each
  // tower's ladder up its inner (east) face, and parapets all round
  {
    const r = mulberry32(seeds.gatehouse)
    const stone = pick(WALL_STONE, r), timber = pick(GATE_WOOD, r), wood = pick(WOOD, r)
    for (const k of [1, -1]) {
      const cz = GZ + k * (half + ts / 2), cx = FX + ts / 2
      // (its own −z faces east, toward the yard: the ladder's face)
      const F = frameAt(cx, cz, -Math.PI / 2)
      const dk = deck(at, F, { lx: 0, lz: 0, w: ts, d: ts, h: th, material: 'stone', color: stone, recipe: 'march' })
      const lad = ladder(at, F, { lx: 0, lz: -ts / 2, ly: 0, h: th, color: wood, recipe: 'march', foot: [0, -ts / 2 - LADDER_OUT], top: [0, 0], on: dk.id })
      parapetRun(at, F, dk, { face: '-z', at: -ts / 2, a: -ts / 2, b: -PARAPET_LADDER_GAP, k: 1, recipe: 'march' })
      parapetRun(at, F, dk, { face: '-z', at: -ts / 2, a: PARAPET_LADDER_GAP, b: ts / 2, k: 1, recipe: 'march' })
      parapetRun(at, F, dk, { face: '+z', at: ts / 2, a: -ts / 2, b: ts / 2, k: 2, recipe: 'march' })
      for (const [face, side] of [['-x', -ts / 2], ['+x', ts / 2]]) parapetRun(at, F, dk, { face, at: side, a: -ts / 2 + PARAPET_T, b: ts / 2 - PARAPET_T, k: 2, recipe: 'march' })
      plan.towers.push({ id: dk.id, x: cx, z: cz, s: ts, h: th, ladder: lad.id })
      plan.posts.push({ x: cx, z: cz, y: th, r: ts / 2, on: 'tower' })
      plan.posts.push({ x: cx + ts / 2 + LADDER_OUT, z: cz, y: 0, r: 1.5, on: 'yard' })
    }
    const gate = at.add({
      kind: 'gate', hp: G.hp, ram: G.ram,
      shape: { x: FX + 0.3, y: 1.4, z: GZ, hx: 0.3, hy: 1.4, hz: half, yaw: 0 },
      navKind: 'hard', los: 'block', cover: true,
      look: { piece: 'gate', recipe: 'march', w: 0.6, d: w, h: 2.8, color: timber, chip: timber },
    })
    plan.gate = { id: gate.id, x: FX + 0.3, z: GZ, w, passage: { x0: FX, x1: FX + ts, z0: GZ - half, z1: GZ + half } }
    plan.posts.push({ x: FX + ts + 3, z: GZ, y: 0, r: 3, on: 'yard' })
    placed.push({ x: FX + ts / 2, z: GZ, r: hypot(ts / 2 + LADDER_OUT, half + ts), piece: 'gatehouse' })
  }

  // ── the arms ──
  // The crag at the wood's arm's end, `gap` from the table's north edge;
  // the north arm, the breach, from the crag's east face to inside the
  // north tower; the south arm, the walk, from inside the south tower to
  // RUN_ON past the table's south edge (its line meeting the edge sweepS
  // forward of the face, give or take its depth).
  // (its top edge, with the nav's raster pad, PICKET_PAD, set on a line
  // between two rows of cell centres, so the crag's top hard cell is the
  // same on the board and its mirrors, whatever an ulp of a turned yaw does)
  const C = { x: FX - sweepN - cragR, z: -H / 2 + Math.floor((H - gap + PICKET_PAD) / PICKET_CELL) * PICKET_CELL - cragR - PICKET_PAD }
  const AN = { x: FX + ARM_IN, z: GZ + half + ts - 0.3 }, AS = { x: FX + ARM_IN, z: GZ - half - ts + 0.3 }
  const north = along({ x: C.x + cragR, z: C.z }, AN)
  const edgeAt = { x: FX - sweepS + d / 2, z: -H / 2 }
  const south0 = along(AS, edgeAt)
  const south = along(AS, south0.at(south0.L + RUN_ON))
  // where an arm's line leaves its tower's box (t from a), and where the
  // south arm's leaves the table
  const tower = (k) => ({ x0: FX, x1: FX + ts, z0: k > 0 ? GZ + half : GZ - half - ts, z1: k > 0 ? GZ + half + ts : GZ - half })
  const inBox = (p, b, pad = 0) => p.x >= b.x0 - pad && p.x <= b.x1 + pad && p.z >= b.z0 - pad && p.z <= b.z1 + pad
  const leaves = (s, b, from, step) => {
    let t = from
    while (t >= 0 && t <= s.L && inBox(s.at(t), b)) t += step
    return t
  }
  const tN = leaves(north, tower(1), north.L, -0.05)
  const tS = leaves(south, tower(-1), 0, 0.05)
  let tEdge = south.L
  while (tEdge > 0 && south.at(tEdge).z < -H / 2) tEdge -= 0.05
  // where the walk's outer face leaves its tower (the parapets' start)
  let tFaceS = 0
  while (tFaceS <= south.L && inBox(south.at(tFaceS, d / 2), tower(-1), 0.25)) tFaceS += 0.05
  // The walk: its deck from t0 to t1 along its arm; `use`, the part a stair
  // may join and parapets stand on (clear of its tower, and on the table);
  // `lad`, where a ladder's top may stand (ladderGap or more from the
  // tower's box, within the share of `use` ladderSpan names; the table's
  // edge bounds it by the tops' and feet's own test, below); `far`,
  // its end away from the gatehouse, where its stair goes (so a climber's
  // way runs up a ladder, along the walk and down, about as long as the
  // other routes').
  const gapL = S.walk.ladderGap, apart = S.walk.ladderApart
  const holds = (span) => (span[1] >= span[0] ? Math.floor((span[1] - span[0]) / apart) + 1 : 0)
  const onTable = (p, m) => Math.abs(p.x) <= W / 2 - m && Math.abs(p.z) <= H / 2 - m
  // the last t along arm s, from t1 back, where a ladder's top keeps 2
  // tails and its foot 1.5 inside the table
  const tableEnd = (s, t1) => {
    let t = t1
    while (t > 0 && !(onTable(s.at(t), 2) && onTable(s.at(t, d / 2 + LADDER_OUT), 1.5))) t -= 0.05
    return t
  }
  // the walk arm's ladders stand on the share of it `ladderSpan` names, the
  // stair at its far end: a climber's way runs up a ladder, along the walk
  // and down, about as long as the other routes'
  // (and always room for two, ladderApart apart, where the table allows)
  const share = (u0, u1) => {
    let lo = Math.max(u0, u0 + (u1 - u0) * S.walk.ladderSpan[0])
    // (ladderGap from the tower's box, the top's own distance to it)
    while (lo < u1 && boxGap(south.at(lo), tower(-1)) < gapL) lo += 0.05
    return [lo, Math.min(tableEnd(south, u1), Math.max(lo + apart, u0 + (u1 - u0) * S.walk.ladderSpan[1]))]
  }
  // a walk's stairs (one per stairEvery of `use`, from its far end in, by
  // half tails: each at the first place whose foot keeps 1.5 inside the
  // table and whose low corners keep `room`, whose box is clear of the
  // towers and whose footprint is clear of the objectives)
  const len = wh / STAIR_SLOPE, sw = 4.5
  const stairsOf = (s, use, far, room) => {
    const a = use[0] + sw / 2 + 0.5, b = use[1] - sw / 2 - 0.5
    const want = Math.max(1, Math.floor((b - a + sw) / S.walk.stairEvery))
    const out = []
    for (let j = 0; j <= Math.floor((b - a) / 0.5) && out.length < want; j++) {
      const t = far === 'hi' ? b - j * 0.5 : a + j * 0.5
      if (out.some((u) => Math.abs(u - t) < S.walk.stairEvery)) continue
      const foot = s.at(t, -(d / 2 + len + GATE_OUT)), centre = s.at(t, -(d / 2 + len / 2))
      const corner = (k, o) => s.at(t + (k * sw) / 2, -(d / 2 + o))
      if (!onTable(foot, 1.5) || ![-1, 1].every((k) => onTable(corner(k, len), room))) continue
      // (the stair's own box, len × sw at its centre along the arm, kept
      // objectiveGap from each objective)
      if (objs.some((o) => boxDist(centre, len / 2, sw / 2, s, o) < og)) continue
      if ([-1, 1].some((k) => [0, len].some((o) => inBox(corner(k, o), tower(1), 0.25) || inBox(corner(k, o), tower(-1), 0.25))) || inBox(foot, tower(1), 1.5) || inBox(foot, tower(-1), 1.5)) continue
      out.push(t)
    }
    return out.sort((x, y) => x - y)
  }
  const walks = []
  const r = mulberry32(seeds.arms)
  const stone = pick(WALL_STONE, r), ladderWood = pick(WOOD, r)
  const cragLook = { color: pick(CRAG, r), sy: rr(r, 0.45, 0.6), rot: [r() * 0.2, r() * 6, r() * 0.2], moss: r() < 0.6 }
  // the crag: hard, unbreakable, blocking sight, a box 2·cragR a side
  {
    const size = cragR / 0.85, h = size * cragLook.sy, top = h * 1.5
    const c = at.add({
      kind: 'rock', hp: Infinity,
      shape: { x: C.x, y: top / 2, z: C.z, hx: cragR, hy: top / 2, hz: cragR, yaw: 0 },
      navKind: 'hard', los: 'block', cover: true,
      look: { piece: 'boulder', size, color: cragLook.color, scale: [1, cragLook.sy, 1], rot: cragLook.rot, y: h * 0.55, moss: cragLook.moss },
    })
    plan.crag = c.id
    placed.push({ x: C.x, z: C.z, r: cragR * 1.42, piece: 'crag' })
  }
  // a breach along arm s from t0 to t1: the outer row stone, the inner
  // timber, a column every tail
  const breachIds = []
  const breach = (s, t0, t1) => {
    for (let t = t0 + 0.5; t <= t1 - 0.5 + 1e-9; t += 1) {
      const lx = t - s.L / 2
      column(at, s.F, r, lx, -ROW, 0, S.breach.stone[0] + Math.floor(r() * (S.breach.stone[1] - S.breach.stone[0] + 1)), 'stone').blocks.forEach((b) => breachIds.push(b.id))
      column(at, s.F, r, lx, ROW, 0, S.breach.timber[0] + Math.floor(r() * (S.breach.timber[1] - S.breach.timber[0] + 1)), 'log').blocks.forEach((b) => breachIds.push(b.id))
    }
    plan.breach = { ids: breachIds, a: s.at(t0), b: s.at(t1), len: t1 - t0 }
  }
  const walk = (s, t0, t1, use, lad, far, face, room) => {
    const L = t1 - t0, m = s.at((t0 + t1) / 2)
    const F = frameAt(m.x, m.z, atan2(-s.uz, s.ux))
    const dk = deck(at, F, { lx: 0, lz: 0, w: L, d, h: wh, material: 'stone', color: stone, recipe: 'march' })
    plan.walks.push({ id: dk.id, a: s.at(t0), b: s.at(t1), d, h: wh })
    walks.push({ s, F, dk, t0, t1, use, lad, far, face, room, ladders: [] })
  }
  breach(north, -INTO, tN + INTO)
  walk(south, 0, south.L, [tS, tEdge], share(tS, tEdge), 'hi', tFaceS, 0.25)
  // the ladders: how many (no more than the walks hold, ladderApart apart),
  // then for each a walk, drawn by the length its span offers (a walk
  // that holds no more is passed over), then each walk's places: its count
  // of draws in [0, slack], sorted, the k-th ladder that draw plus k ×
  // ladderApart along its span (so any two stand ladderApart apart or more)
  const room = walks.map((wk) => holds(wk.lad))
  const want = Math.min(room.reduce((n, k) => n + k, 0), S.walk.ladders[0] + Math.floor(r() * (S.walk.ladders[1] - S.walk.ladders[0] + 1)))
  const count = walks.map(() => 0)
  for (let k = 0; k < want; k++) {
    const open = walks.map((wk, i) => (count[i] < room[i] ? wk.lad[1] - wk.lad[0] + 1e-9 : 0))
    let pickW = r() * open.reduce((n, v) => n + v, 0), i = open.findIndex((v) => v > 0)
    for (let j = 0; j < walks.length; j++) if (open[j] > 0 && (pickW -= open[j]) <= 0) { i = j; break }
    count[i]++
  }
  walks.forEach((wk, i) => {
    const slack = wk.lad[1] - wk.lad[0] - apart * (count[i] - 1)
    const offs = []
    for (let k = 0; k < count[i]; k++) offs.push(r() * slack)
    offs.sort((a, b) => a - b).forEach((o, k) => wk.ladders.push(wk.lad[0] + o + k * apart))
  })
  // each walk's ladders, its stairs (stairsOf) and its parapets, in that
  // order
  const ladderOf = []
  for (const wk of walks) {
    const { s, F, dk, t0 } = wk
    const lx = (t) => t - (t0 + wk.t1) / 2
    wk.ladders.sort((a, b) => a - b)
    for (const t of wk.ladders) {
      const l = ladder(at, F, { lx: lx(t), lz: -d / 2, ly: 0, h: wh, color: ladderWood, recipe: 'march', foot: [lx(t), -d / 2 - LADDER_OUT], top: [lx(t), 0], on: dk.id })
      ladderOf.push({ id: l.id, foot: s.at(t, d / 2 + LADDER_OUT), top: s.at(t), h: wh })
      plan.posts.push({ ...s.at(t), y: wh, r: 1.5, on: 'walk' })
    }
    const stairs = stairsOf(s, wk.use, wk.far, wk.room)
    for (const t of stairs) {
      const st = stair(at, F, { lx: lx(t), lz: d / 2 + len / 2, ly: Math.PI / 2, len, w: sw, h: wh, material: 'stone', color: stone, recipe: 'march' })
      const lo = s.at(t, -(d / 2 + len + GATE_OUT))
      plan.stairs.push({ id: st.id, lo, hi: s.at(t, -d / 2) })
      plan.posts.push({ ...lo, y: 0, r: 2, on: 'yard' })
    }
    // the parapets along the outer face, on the table, broken at each
    // ladder, from where the face leaves its tower (or its crag, or the
    // breach) to where it leaves the table
    const from = (wk.far === 'hi' ? wk.face : wk.use[0]) + PARAPET_END_GAP
    const to = (wk.far === 'hi' ? wk.use[1] : wk.face) - PARAPET_END_GAP
    const cuts = [from, ...wk.ladders.flatMap((t) => [t - PARAPET_LADDER_GAP, t + PARAPET_LADDER_GAP]), to]
    for (let i = 0; i + 1 < cuts.length; i += 2) {
      const ca = cuts[i], cb = cuts[i + 1]
      if (cb - ca < 1) continue
      parapetRun(at, F, dk, { face: '-z', at: -d / 2, a: lx(ca), b: lx(cb), k: Math.max(1, Math.round((cb - ca) / 2.5)), recipe: 'march' })
    }
    // posts along the walk, one per 4.5 tails clear of the ladders' heads
    for (let t = wk.use[0] + d / 2; t <= wk.use[1] - d / 2 + 1e-9; t += 4.5) {
      if (wk.ladders.some((u) => Math.abs(u - t) < d / 2)) continue
      plan.posts.push({ ...s.at(t), y: wh, r: d / 2, on: 'walk' })
    }
  }
  plan.ladders = ladderOf

  // ── the ditch ──
  // `out` from the outer face, `w` wide, along each walk (on the table, out
  // of the attacker's zone) and the towers' faces, broken at the gate
  {
    const dr = mulberry32(seeds.arms + 1)
    const color = pick(DITCH, dr), out = S.ditch.out, dw = S.ditch.w
    const strip = (cx, cz, L, yaw) => {
      if (L < 1) return
      const c = cos(yaw), s = sin(yaw)
      const cornersX = [-1, 1].flatMap((i) => [-1, 1].map((j) => cx + c * (i * L / 2) + s * (j * dw / 2)))
      if (Math.min(...cornersX) < front + 0.25) return
      at.add({
        kind: 'ditch', hp: Infinity,
        shape: { x: cx, y: 0.01, z: cz, hx: L / 2, hy: 0.01, hz: dw / 2, yaw },
        navKind: 'diff', los: null, cover: false,
        look: { piece: 'ditch', recipe: 'march', w: L, d: dw, color },
      })
    }
    // an arm's from ta to tb, its outer face `face` out from its line,
    // shortened at its far end while it would reach the attacker's zone or
    // past the table's edge
    const armDitch = (s, ta, tb, face) => {
      const o = face + out + dw / 2
      let b = tb
      const ok = (t) => s.at(t, o).x - dw / 2 - 0.25 >= front && Math.abs(s.at(t, o).z) <= H / 2
      while (b > ta + 1 && !(ok(b) && ok(ta))) b -= 0.25
      if (!(ok(b) && ok(ta))) return
      const m = s.at((ta + b) / 2, o)
      strip(m.x, m.z, b - ta, atan2(-s.uz, s.ux))
    }
    // (none before the breach: the fall filled it)
    armDitch(south, tS + 0.5, tEdge, d / 2)
    for (const k of [1, -1]) {
      const z0 = GZ + k * (half + 1), z1 = GZ + k * (half + ts)
      strip(FX - out - dw / 2, (z0 + z1) / 2, Math.abs(z1 - z0), Math.PI / 2)
    }
  }

  // ── the Hollow Wood ──
  // the picket (the header), the track through one of its gaps, the other
  // trees off the track, and the forest floors over its gaps
  const wood = {}
  {
    const r = mulberry32(seeds.wood)
    const cell = PICKET_CELL
    const centre = (v, size) => -size / 2 + (Math.floor((v + size / 2) / cell) + 0.5) * cell
    const xP = centre(C.x - cragR + 0.3, W)
    // the crag's top hard cell in the picket's column: the highest cell
    // centre the nav's raster (pad 0.1) marks
    let zTop = centre(C.z + cragR + PICKET_PAD, H)
    while (Math.abs(zTop - C.z) > cragR + PICKET_PAD) zTop -= cell
    const pickets = []
    for (let z = zTop + S.flank.picket; z < H / 2; z += S.flank.picket) {
      pickets.push(z)
      if (H / 2 - z <= S.flank.picket) break
    }
    // the gaps a squad passes (between the crag and a picket, or two
    // pickets), and the track through the first, by the crag (the other
    // trees keep off it, so the wood's way is about as long on every board:
    // a tree on a squad's straight way through added up to six tails)
    const bounds = [zTop, ...pickets]
    const zMid = (bounds[0] + bounds[1]) / 2
    const trunks = []
    const ids = []
    for (const z of pickets) {
      ids.push(tree(at, F0, r, xP, z, 'pine').id)
      trunks.push({ x: xP, z })
    }
    // the other trees: on cell centres, in the wood (north of the crag),
    // `track` off the track, `picket` from every trunk (so a squad passes
    // between any two, and the trees slow the wood, never wall it), out of
    // the attacker's
    // zone, clear of the objectives, and BREACH_ROOM off the breach's line
    // (the way out of it, once it is down, is not the wood's)
    const want = S.flank.trees[0] + Math.floor(r() * (S.flank.trees[1] - S.flank.trees[0] + 1))
    for (let tries = 0; tries < 40 && trunks.length < want; tries++) {
      const x = centre(rr(r, xP - 7, xP + 7), W), z = centre(rr(r, C.z + cragR + 0.6, H / 2 - 0.75), H)
      const oak = r() < 0.3
      if (Math.abs(z - zMid) < S.flank.track || x - 0.8 < front) continue
      if (trunks.some((t) => hypot(t.x - x, t.z - z) < S.flank.picket)) continue
      if (!clearOfObjectives(x, z, 0.8) || segDist(north.a, north.b, x, z) < BREACH_ROOM) continue
      ids.push(tree(at, F0, r, x, z, oak ? 'oak' : 'pine').id)
      trunks.push({ x, z })
    }
    // the forest floors: over each gap of the picket (the crag's, the
    // pickets', and the last picket's to the table's edge), `floors` of them
    // (drawn), at the picket, then a picket west, east, and so on, so the
    // wood is as slow whichever gap a squad takes (a floor or two along the
    // track alone made a squad's way through another gap up to 15% longer
    // or shorter than the other routes')
    const gaps = [...bounds, H / 2]
    const nf = S.flank.floors[0] + Math.floor(r() * (S.flank.floors[1] - S.flank.floors[0] + 1))
    for (let g = 0; g + 1 < gaps.length; g++) {
      for (let k = 0; k < nf; k++) {
        const fr = rr(r, S.flank.floorR[0], S.flank.floorR[1])
        // (east of the attacker's zone, whole)
        const off = (k % 2 ? -1 : 1) * S.flank.picket * Math.ceil(k / 2)
        const fx = Math.max(front + fr * 0.75 + 0.25, xP + off), fz = Math.min((gaps[g] + gaps[g + 1]) / 2, H / 2 - fr * 0.75)
        forestFloor(at, frameAt(fx, fz, 0), r, fr, pick(FLOOR, r))
      }
    }
    wood.mouths = [{ x: xP - 6, z: zMid }, { x: xP + 6, z: zMid }]
    wood.trees = ids
    wood.picket = { x: xP, z: [zTop, ...pickets] }
    placed.push({ x: xP, z: (zTop + H / 2) / 2, r: (H / 2 - zTop) / 2 + 1, piece: 'wood' })
  }

  // ── the face, and the defender's side ──
  // The stone line: the crag's west face run on north past the table, down
  // the north arm, the north tower, the gate, the south tower and the south
  // arm, past the south edge; closed round the east. The glacis is laid out
  // from it (below), the cover standing off the stone itself.
  // (Breakthrough) The plan's face is the line of deployment, and the wood
  // is no-man's-land: from beyond the table's edge it runs down the
  // picket's column to the crag's top, along the top and down its east
  // face to where the breach's outer face leaves the crag, then on as the
  // stone line. The wood west of the picket and the crag itself are in
  // front of it, so a defender starts at the wood's east mouth, never in
  // the attacker's slow way round (on the stone line it might start inside
  // it, 1.065 tails from the attacker's zone).
  const stoneLine = [{ x: C.x - cragR, z: H / 2 + 2 }, { x: C.x - cragR, z: C.z + cragR }, { x: C.x - cragR, z: C.z - cragR }]
  const face = [{ x: wood.picket.x, z: H / 2 + 2 }, { x: wood.picket.x, z: C.z + cragR }, { x: C.x + cragR, z: C.z + cragR }]
  const off = (s, t, o) => s.at(t, o)
  const meetX = (s, o, lo, hi) => {
    // where arm s's face (o out from its line) crosses x = FX, by halving
    let a = lo, b = hi
    for (let i = 0; i < 40; i++) {
      const m = (a + b) / 2
      if ((off(s, a, o).x - FX) * (off(s, m, o).x - FX) <= 0) b = m
      else a = m
    }
    return off(s, (a + b) / 2, o)
  }
  const faceOf = { breach: ROW + 0.31, walk: d / 2 }
  const nFace = faceOf.breach
  // (Breakthrough) where the breach's outer face, run from the crag's east
  // face's middle, leaves the crag's box: through its east face, or first
  // through its south face (then round the south-east corner to it), or
  // already east of it at the arm's start
  const q0 = off(north, 0, nFace), cE = C.x + cragR, cS = C.z - cragR
  if (q0.x >= cE) face.push(q0)
  else {
    const tE = (cE - q0.x) / north.ux
    if (q0.z + north.uz * tE >= cS) face.push(off(north, tE, nFace))
    else face.push({ x: cE, z: cS }, off(north, (cS - q0.z) / north.uz, nFace))
  }
  const rest = [meetX(north, nFace, 0, north.L), { x: FX, z: GZ + half }, { x: FX, z: GZ - half }, meetX(south, faceOf.walk, 0, south.L), off(south, south.L, faceOf.walk)]
  stoneLine.push(q0, ...rest)
  face.push(...rest)
  const closed = (pl) => [...pl, { x: W / 2 + 2, z: pl[pl.length - 1].z }, { x: W / 2 + 2, z: pl[0].z }]
  const stoneIn = closed(stoneLine), region = closed(face)

  // ── the glacis ──
  // cover on the approach: mantlets (two crates side by side), a shelled
  // orchard (two or three oaks) or a few rocks, each drawn by weight and
  // placed by tries from `from` to `to` in front of the stone line, clear of
  // each route's mouth, of the wood, of the attacker's zone and of each other
  {
    const r = mulberry32(seeds.glacis)
    const GL = S.glacis
    const mouths = [{ x: FX - 3, z: GZ }, ...ladderOf.map((l) => l.foot), wood.mouths[0]]
    if (plan.breach) {
      const m = north.at(tN / 2, ROW + 2)
      mouths.push(m)
    }
    const n = GL.pieces[0] + Math.floor(r() * (GL.pieces[1] - GL.pieces[0] + 1))
    const total = GL.kinds.reduce((t, k) => t + k[1], 0)
    const R = { mantlet: 1.2, orchard: 2, rocks: 1.2 }
    const here = []
    for (let k = 0; k < n; k++) {
      let wgt = r() * total, kind = GL.kinds[0][0]
      for (const [name, wt] of GL.kinds) if ((wgt -= wt) <= 0) { kind = name; break }
      const rad = R[kind]
      for (let tries = 0; tries < 12; tries++) {
        const x = rr(r, FX - GL.to, FX - GL.from), z = rr(r, -H / 2 + 1.5, H / 2 - 1.5)
        const fd = polyDist(stoneLine, x, z)
        if (inside(stoneIn, x, z) || fd < GL.from + rad || fd > GL.to) continue
        if (x - rad < front + 0.5 || z + rad > C.z - cragR) continue
        if (mouths.some((m) => hypot(m.x - x, m.z - z) < GL.mouthGap + rad)) continue
        if (here.some((p) => hypot(p.x - x, p.z - z) < p.r + rad + 1) || !clearOfObjectives(x, z, rad)) continue
        const yaw = r() * Math.PI * 2, F = frameAt(x, z, yaw)
        if (kind === 'mantlet') {
          crate(at, F, r, -0.4, 0)
          crate(at, F, r, 0.4, 0)
        } else if (kind === 'orchard') {
          const m = 2 + Math.floor(r() * 2)
          for (let i = 0; i < m; i++) tree(at, F, r, rr(r, -1.2, 1.2), rr(r, -1.2, 1.2), 'oak')
        } else {
          const m = 1 + Math.floor(r() * 2)
          for (let i = 0; i < m; i++) boulder(at, F, r, rr(r, -0.6, 0.6), rr(r, -0.6, 0.6), rr(r, 0.35, 0.6))
        }
        here.push({ x, z, r: rad })
        placed.push({ x, z, r: rad, piece: kind })
        break
      }
    }
  }

  // ── the second line ──
  // the inner barricade on the road behind the gate, the hedgebank (gaps at
  // the road, the breach's line and a drawn one), the watch platform and a
  // ruin
  {
    const r = mulberry32(seeds.second)
    const SL = S.second
    const bx = FX + ts + 5.5
    for (const dz of [-3.5, -2.7, 2.7, 3.5]) if (clearOfObjectives(bx, GZ + dz, 0.5)) crate(at, F0, r, bx, GZ + dz)
    const x2 = rr(r, SL.x[0], SL.x[1])
    const zb = plan.breach ? (plan.breach.a.z + plan.breach.b.z) / 2 : GZ
    const zg = rr(r, -H / 2 + 4, H / 2 - 4)
    for (let z = -H / 2 + 1.6; z <= H / 2 - 1.6 + 1e-9; z += 1.2) {
      if (Math.abs(z - GZ) < half + 0.5 || Math.abs(z - zb) < 2 || Math.abs(z - zg) < 1.5) continue
      if (!clearOfObjectives(x2, z, 0.7)) continue
      hedge(at, F0, r, x2, z, Math.PI / 2)
    }
    for (let z = -H / 2 + 4; z <= H / 2 - 4 + 1e-9; z += 6) if (Math.abs(z - GZ) >= half + 0.5) plan.posts.push({ x: x2 + 1.5, z, y: 0, r: 2.5, on: 'second' })
    const side = r() < 0.5 ? 1 : -1
    if (r() < SL.platform) {
      const x = rr(r, x2 + FOOTPRINT.platform + 1.5, x2 + FOOTPRINT.platform + 4), z = side * rr(r, 7, 13), seed = (r() * 1e9) | 0
      if (clearOfObjectives(x, z, FOOTPRINT.platform)) {
        // its ladder's face toward the line (its own −z west)
        buildFort(at, 'platform', { x, z, yaw: Math.PI / 2 }, seed)
        // (its deck's middle, 1.125 behind its frame's origin: recipes.js platform)
        plan.posts.push({ x: x + 1.125, z, y: 2, r: 2.25, on: 'second' })
        placed.push({ x, z, r: FOOTPRINT.platform, piece: 'platform' })
      }
    }
    if (r() < SL.ruin) {
      const x = rr(r, W / 2 - 8, W / 2 - 4), z = -side * rr(r, 5, 14), yaw = r() * Math.PI * 2, seed = (r() * 1e9) | 0
      if (clearOfObjectives(x, z, 3.2)) {
        build(at, 'ruin', { x, z, yaw }, seed)
        placed.push({ x, z, r: 3.2, piece: 'ruin' })
      }
    }
  }

  plan.face = face
  plan.region = region
  plan.wood = wood
  return { features: placed.map((p) => ({ ...p, ...at.pt(p) })), plan: deepFreeze(at.plan(plan, { south: zm, flip })) }
}

// ── The turn ────────────────────────────────────────────────────────────────
// T's add, as the canonical build calls it, with every def turned onto the
// table: (x, z) mirrored in z when `south`, then negated when `flip`; a yaw
// to −yaw (or π − yaw, for a piece whose look names its own −z face: a
// ladder's or a parapet's) when south, then plus π when flip. A wall
// column's record (its place, for its rubble) is turned once, with its
// first block. Every turn is an involution on places, so the objectives are
// read back into the canonical frame by the same `x` and `z`.
function turned(T, south, flip) {
  const x = flip ? (v) => 0 - v : (v) => v
  const z = south !== flip ? (v) => 0 - v : (v) => v
  const yaw = (v, face) => (south ? (face ? Math.PI - v : 0 - v) : v) + (flip ? Math.PI : 0)
  const box = (s, face) => ({ ...s, x: x(s.x), z: z(s.z), yaw: yaw(s.yaw, face) })
  const pt = (p) => ({ x: x(p.x), z: z(p.z) })
  const cols = new Set()
  const add = (def) => {
    const face = def.look?.face === '-z'
    const out = { ...def, shape: box(def.shape, face) }
    if (def.nav) out.nav = box(def.nav, face)
    if (def.coverShape) out.coverShape = box(def.coverShape, face)
    if (def.link) out.link = { foot: pt(def.link.foot), top: pt(def.link.top), h: def.link.h }
    if (typeof def.look?.yaw === 'number') out.look = { ...def.look, yaw: yaw(def.look.yaw, face) }
    if (def.col && !cols.has(def.col)) {
      cols.add(def.col)
      def.col.x = x(def.col.x)
      def.col.z = z(def.col.z)
      def.col.yaw = yaw(def.col.yaw, false)
    }
    return T.add(out)
  }
  // the plan's record turned: every { x, z } point, and the passage's box
  const plan = (P, flags) => {
    const ptOf = (p) => ({ ...p, ...pt(p) })
    const box2 = (b) => {
      const xs = [x(b.x0), x(b.x1)], zs = [z(b.z0), z(b.z1)]
      return { x0: Math.min(...xs), x1: Math.max(...xs), z0: Math.min(...zs), z1: Math.max(...zs) }
    }
    return {
      plan: 'wall', south: flags.south, flip: flags.flip,
      face: P.face.map(ptOf), region: P.region.map(ptOf),
      gate: { ...ptOf(P.gate), passage: box2(P.gate.passage) },
      towers: P.towers.map(ptOf),
      walks: P.walks.map((wk) => ({ ...wk, a: ptOf(wk.a), b: ptOf(wk.b) })),
      stairs: P.stairs.map((s) => ({ ...s, lo: ptOf(s.lo), hi: ptOf(s.hi) })),
      breach: P.breach && { ...P.breach, a: ptOf(P.breach.a), b: ptOf(P.breach.b) },
      ladders: P.ladders.map((l) => ({ ...l, foot: ptOf(l.foot), top: ptOf(l.top) })),
      crag: P.crag,
      wood: { mouths: P.wood.mouths.map(ptOf), trees: P.wood.trees, picket: { x: x(P.wood.picket.x), z: P.wood.picket.z.map(z) } },
      posts: P.posts.map(ptOf),
    }
  }
  return { W: T.W, H: T.H, add, x, z, pt, plan }
}

// ── Geometry ────────────────────────────────────────────────────────────────
// the distance from (x, z) to the segment a-b
function segDist(a, b, x, z) {
  const dx = b.x - a.x, dz = b.z - a.z, L2 = dx * dx + dz * dz
  let t = L2 > 0 ? ((x - a.x) * dx + (z - a.z) * dz) / L2 : 0
  t = t < 0 ? 0 : t > 1 ? 1 : t
  return hypot(a.x + dx * t - x, a.z + dz * t - z)
}
// the distance from point o to a box centred on c, `across` half-deep
// across arm s and `alongH` half-long along it (a stair's footprint)
function boxDist(c, across, alongH, s, o) {
  const dx = o.x - c.x, dz = o.z - c.z
  const u = Math.abs(dx * s.ux + dz * s.uz) - alongH, v = Math.abs(dx * s.nx + dz * s.nz) - across
  return hypot(Math.max(0, u), Math.max(0, v))
}
// how far point p stands from box b ({ x0, x1, z0, z1 }; 0 inside it)
const boxGap = (p, b) => hypot(Math.max(0, b.x0 - p.x, p.x - b.x1), Math.max(0, b.z0 - p.z, p.z - b.z1))
// the distance from (x, z) to the polyline `pts`
function polyDist(pts, x, z) {
  let best = Infinity
  for (let i = 0; i + 1 < pts.length; i++) best = Math.min(best, segDist(pts[i], pts[i + 1], x, z))
  return best
}
// whether (x, z) is inside the closed polygon `pts` (an even-odd ray cast)
function inside(pts, x, z) {
  let c = false
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[i], b = pts[j]
    if (a.z > z !== b.z > z && x < ((b.x - a.x) * (z - a.z)) / (b.z - a.z) + a.x) c = !c
  }
  return c
}

// ── The plan's readers ──────────────────────────────────────────────────────
// T.plan (Terrain.plan: null on every board scattered) is a frozen plain
// record, in the table's own places (after the flip and the z mirror), of
// numbers, ids and flags only:
//
//   plan     'wall'
//   south    the wood stands south (the board's z mirror); flip: the
//            attacker is at the east edge (the role's flip)
//   face     [{ x, z }]: the wall's outer face, from beyond the table's
//            edge at the wood's end, down the picket's column, round the
//            crag's top and east face (Breakthrough: the wood west of the
//            picket, and the crag, in front of it), the wood's arm, its
//            tower, the gate, the other tower and the walk's arm, to beyond
//            the other edge
//   region   [{ x, z }]: the defender's side, the face closed round the
//            defender's edge (behindLine's polygon)
//   gate     { id, x, z, w, passage: { x0, x1, z0, z1 } }: the gate's chunk
//            and middle, its width, and the passage's box between the
//            towers (gateCells, its nav cells)
//   towers   [{ id, x, z, s, h, ladder }]: each tower's deck, its middle,
//            size and height, and its inner ladder's chunk
//   walks    [{ id, a, b, d, h }]: each curtain walk's deck, its line's
//            ends, depth and height
//   stairs   [{ id, lo, hi }]: each stair down a walk's inner face, its low
//            end's gate (where a unit about to climb it stands) and its top
//   breach   { ids, a, b, len }: the breach's block chunks, its line's ends
//            and its length (it is the wood's arm, crag to tower)
//   ladders  [{ id, foot, top, h }]: each siege ladder, against the walk's
//            outer face
//   crag     the crag's chunk id
//   wood     { mouths: [west, east], trees, picket: { x, z: [...] } }: the
//            track's two mouths (the attacker's first), the wood's tree
//            chunks, and the picket's column and its cells' z (the crag's
//            top hard cell first)
//   posts    [{ x, z, y, r, on }]: the defender's standing places, each a
//            disc r across at floor y, `on` one of 'tower' (each tower's
//            top), 'walk' (each ladder's head, then along each walk),
//            'yard' (each tower's ladder foot, behind the gate, each
//            stair's foot) and 'second' (behind the hedgebank, the watch
//            platform's top)
//
// A snap or a late join rebuilds it as it rebuilds the table: the match is
// folded from its setup (match/fold.js, core/match.js newState's generate),
// so the plan is regenerated from the same seed and role, the same record.

// whether (x, z) is on the defender's side of the wall's outer face
export const behindLine = (plan, x, z) => inside(plan.region, x, z)
// how far (x, z) stands from the outer face, behind it (> 0) or in front
export const faceDist = (plan, x, z) => (inside(plan.region, x, z) ? 1 : -1) * polyDist(plan.face, x, z)
// the nav cells of the gate's passage (whose centres lie in its box)
export function gateCells(plan, nav) {
  const b = plan.gate.passage, out = []
  for (let i = 0; i < nav.N; i++) {
    const x = nav.x(i), z = nav.z(i)
    if (x >= b.x0 && x <= b.x1 && z >= b.z0 && z <= b.z1) out.push(i)
  }
  return out
}
// the defender's posts, those `on` one kind (all of them when null)
export const postsOf = (plan, on = null) => plan.posts.filter((p) => on === null || p.on === on)
