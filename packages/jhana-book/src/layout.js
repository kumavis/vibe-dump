// layout.js — where every solid piece of the book sits, as pure 2D math.
//
// The book is a prism along z (the spine axis), so every piece is described by
// its cross-section in the table's xy plane: four points A, B, C, D.
//
//   A → B   "face 0"  (a cover's inside, a stack's underside, a moving block's back)
//   B → C   the outer edge (fore-edge)
//   C → D   "face 1"  (a cover's outside, a stack's top page, a moving block's front)
//   D → A   the spine edge
//
// A and D are on the spine side, B and C on the outer side.
//
// ---------------------------------------------------------------------------
// The model
// ---------------------------------------------------------------------------
// Units: 0 = front cover, 1…9 = paper leaves, 10 = leaf 10 glued to the back
// cover. "Rest n" means n units are turned to the left: n = 0 is the closed
// front, n = k + 1 shows spread k, n = 11 is closed with the back cover up.
//
// Open book. Both covers lie flat on the table; the paper of each side sits on
// its cover as a block whose outer edge is as tall as its leaf count says. For
// a pop-up the two visible pages must be coplanar and hinged on one line, so
// both stack tops are rays from one spine point S = (0, YS), YS = T/2. Because
// the left and right counts differ, that shared plane is tilted by a small angle
// tilt(n) (≤ 3.5°) — exactly what a real book does when opened near its front or
// back. The stacks are therefore slight wedges: thick at the spine, the leaf
// count at the outer edge. Since hL + hR = T for every n, S never moves while
// the book is open.
//
// A turn between open spreads rotates a fan wedge of leaves about S: its front
// face is the ray at tilt(nA) + ψ and its back face the ray at tilt(nB) + ψ.
// Then, exactly:
//   closing spread (nA−1): left page π + tilt(nA), right page tilt(nA) + ψ → θ = π − ψ
//   opening spread (nB−1): left page tilt(nB) + ψ, right page tilt(nB)      → θ = ψ
//
// Closed book. A plain box (covers, paper block, spine strip). Turns that open
// or close a cover morph between the box and the fan with a "closedness" κ; the
// hinge of the spread that is mounted during such a turn slides between the
// box's top and S, and the page that matters stays an exact ray from it, so the
// θ = ψ / θ = π − ψ contract still holds exactly.

import { W, LEAF, COVER, OVERHANG, T } from './dims.js'

const PI = Math.PI
export const YS = T / 2 // spine height of the open book
export const SPW = 0.012 // spine cloth thickness of the closed book
const WO = W + OVERHANG // cover width
export const CLOSED_CENTRE = (WO - SPW) / 2 // x of the closed book's centre

const hLeft = (n) => COVER + (n - 1) * LEAF // outer height of the left stack at rest n
const hRight = (n) => COVER + (11 - n) * LEAF // outer height of the right stack at rest n
// Tilt of the open spread's page plane at rest n (1…10): the right stack's top
// ray from S must reach height hRight(n) after one page width.
export const tilt = (n) => Math.asin((hRight(n) - YS) / W)
const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v)
const smooth = (x) => x * x * (3 - 2 * x)

export function createLayout() {
  const solid = () => ({ visible: false, poly: new Float64Array(8), layers: 0 })
  const page = () => ({ visible: false, x: 0, y: 0, angle: 0, spread: -1 })
  const mount = () => ({ spread: -1, x: 0, y: 0, aL: 0, aR: 0 })
  return {
    offX: 0, // the whole book slides so a closed book sits centred
    closed: 0, // κ: 0 = open book, 1 = closed box
    frontCover: solid(),
    backCover: solid(),
    leftPaper: solid(),
    rightPaper: solid(),
    movingPaper: solid(),
    spine: solid(),
    // page planes: a ray (x, y, angle) from the spine; the page spans W along it
    pageL: page(), // top of the left stack (a left page)
    pageR: page(), // top of the right stack (a right page)
    pageMF: page(), // front of the moving block (the closing spread's right page)
    pageMB: page(), // back of the moving block (the opening spread's left page)
    // spreads mounted this frame: hinge point + the world angles of their pages
    mounts: [mount(), mount()],
    mountCount: 0,
  }
}

// ---- small writers ----------------------------------------------------------

function setPoly(s, ax, ay, bx, by, cx, cy, dx, dy, layers) {
  const p = s.poly
  p[0] = ax; p[1] = ay; p[2] = bx; p[3] = by
  p[4] = cx; p[5] = cy; p[6] = dx; p[7] = dy
  s.layers = layers
  s.visible = true
}

// A paper stack resting on a flat cover: underside at y = COVER, top face is
// the ray from (px, py) at `ang`, one page width long.
function stack(s, px, py, ang, layers) {
  const cx = px + W * Math.cos(ang)
  const cy = py + W * Math.sin(ang)
  setPoly(s, 0, COVER, cx, COVER, cx, cy, px, py, layers)
}

// A cover lying flat on the table, inside face up. side: +1 right, −1 left.
function flatCover(s, side) {
  setPoly(s, 0, COVER, side * WO, COVER, side * WO, 0, 0, 0, 0)
}

function setPage(pg, x, y, angle, spread) {
  pg.visible = spread >= 0
  pg.x = x
  pg.y = y
  pg.angle = angle
  pg.spread = spread
}

function addMount(L, spread, x, y, aL, aR) {
  if (spread < 0 || spread > 9) return
  const m = L.mounts[L.mountCount++]
  m.spread = spread
  m.x = x
  m.y = y
  m.aL = aL
  m.aR = aR
}

function reset(L) {
  L.frontCover.visible = L.backCover.visible = false
  L.leftPaper.visible = L.rightPaper.visible = L.movingPaper.visible = false
  L.spine.visible = false
  L.pageL.visible = L.pageR.visible = L.pageMF.visible = L.pageMB.visible = false
  L.mountCount = 0
  L.offX = 0
  L.closed = 0
}

// ---- block-local frames -----------------------------------------------------
// A moving block is described relative to the face it hinges on: origin at the
// hinge point, local x along that face, local y into the block's body. σ says
// on which side of the face the body lies (+1: the side the face's left-hand
// normal points to, −1 the other side).

function toLocal(out, i, qx, qy, px, py, a, sigma) {
  const vx = qx - px
  const vy = qy - py
  const c = Math.cos(a)
  const s = Math.sin(a)
  out[i] = vx * c + vy * s
  out[i + 1] = sigma * (-vx * s + vy * c)
}

function polyToWorld(dst, src, px, py, a, sigma) {
  const c = Math.cos(a)
  const s = Math.sin(a)
  for (let i = 0; i < 8; i += 2) {
    const lx = src[i]
    const ly = sigma * src[i + 1]
    dst[i] = px + lx * c - ly * s
    dst[i + 1] = py + lx * s + ly * c
  }
}

function lerpPoly(dst, a, b, t) {
  for (let i = 0; i < 8; i++) dst[i] = a[i] + (b[i] - a[i]) * t
}

function rect(dst, x0, y0, x1, y1) {
  dst[0] = x0; dst[1] = y0; dst[2] = x1; dst[3] = y0
  dst[4] = x1; dst[5] = y1; dst[6] = x0; dst[7] = y1
}

const scratch = {
  openPaper: new Float64Array(8),
  openCover: new Float64Array(8),
  boxPaper: new Float64Array(8),
  boxCover: new Float64Array(8),
  mixPaper: new Float64Array(8),
  mixCover: new Float64Array(8),
  mixCover2: new Float64Array(8),
  spineOpen: new Float64Array([-SPW / 2, 0, SPW / 2, 0, SPW / 2, COVER, -SPW / 2, COVER]),
  spineFront: new Float64Array([-SPW, 0, 0, 0, 0, T, -SPW, T]),
  spineBack: new Float64Array([0, 0, SPW, 0, SPW, T, 0, T]),
  spineMix: new Float64Array(8),
}

function spine(L, closedPoly, k) {
  if (k < 0.01) return
  lerpPoly(scratch.spineMix, scratch.spineOpen, closedPoly, k)
  L.spine.poly.set(scratch.spineMix)
  L.spine.layers = 0
  L.spine.visible = true
}

// ---- states -------------------------------------------------------------------

// Rest at n (0…11).
export function layoutRest(L, n) {
  if (n <= 0) return layoutTurn(L, 0, 11, 0)
  if (n >= 11) return layoutTurn(L, 0, 11, PI)
  reset(L)
  const d = tilt(n)
  stack(L.leftPaper, 0, YS, PI + d, n - 1)
  stack(L.rightPaper, 0, YS, d, 11 - n)
  flatCover(L.frontCover, -1)
  flatCover(L.backCover, +1)
  setPage(L.pageL, 0, YS, PI + d, n - 1)
  setPage(L.pageR, 0, YS, d, n - 1)
  addMount(L, n - 1, 0, YS, PI + d, d)
}

// A turn moving units nA…nB−1 (nA < nB). ψ = 0 is rest nA, ψ = π is rest nB;
// a backward turn simply runs ψ from π to 0.
export function layoutTurn(L, nA, nB, psi) {
  reset(L)
  if (nA === 0 && nB === 11) return turnWholeBook(L, psi)
  if (nA === 0) return turnFrontCover(L, nB, psi)
  if (nB === 11) return turnBackCover(L, nA, psi)

  // Both ends open: a fan wedge of nB − nA leaves swings about S.
  const dA = tilt(nA)
  const dB = tilt(nB)
  stack(L.leftPaper, 0, YS, PI + dA, nA - 1)
  stack(L.rightPaper, 0, YS, dB, 11 - nB)
  flatCover(L.frontCover, -1)
  flatCover(L.backCover, +1)
  const back = dB + psi
  const front = dA + psi
  setPoly(
    L.movingPaper,
    0, YS,
    W * Math.cos(back), YS + W * Math.sin(back),
    W * Math.cos(front), YS + W * Math.sin(front),
    0, YS,
    nB - nA,
  )
  setPage(L.pageL, 0, YS, PI + dA, nA - 1)
  setPage(L.pageMF, 0, YS, front, nA - 1)
  setPage(L.pageMB, 0, YS, back, nB - 1)
  setPage(L.pageR, 0, YS, dB, nB - 1)
  addMount(L, nA - 1, 0, YS, PI + dA, front) // θ = π − ψ
  addMount(L, nB - 1, 0, YS, back, dB) // θ = ψ
}

// Closed front → rest nB: the front cover (plus leaves 1…nB−1 when jumping)
// lifts off the box and lands on the table to the left.
function turnFrontCover(L, nB, psi) {
  const k = 1 - smooth(psi / PI) // closedness
  const hr = hRight(nB)
  // The right stack's top hinge slides from the box top (k = 1) down to S.
  const py = YS + (hr - YS) * k
  const aR = Math.asin(clamp((hr - py) / W, -1, 1))
  stack(L.rightPaper, 0, py, aR, 11 - nB)
  flatCover(L.backCover, +1)

  // The moving block hinges on its back face (the opening spread's left page),
  // body on the +normal side. Shape at k = 1: leaves + cover stacked flat.
  const tp = (nB - 1) * LEAF
  rect(scratch.boxPaper, 0, 0, W, tp)
  rect(scratch.boxCover, 0, tp, WO, tp + COVER)
  // Shape at k = 0: the left side of rest nB, seen from its top-page ray.
  const aLand = PI + tilt(nB)
  const bx = W * Math.cos(aLand)
  const by = YS + W * Math.sin(aLand)
  const op = scratch.openPaper
  toLocal(op, 0, 0, YS, 0, YS, aLand, 1)
  toLocal(op, 2, bx, by, 0, YS, aLand, 1)
  toLocal(op, 4, bx, COVER, 0, YS, aLand, 1)
  toLocal(op, 6, 0, COVER, 0, YS, aLand, 1)
  const oc = scratch.openCover
  toLocal(oc, 0, 0, COVER, 0, YS, aLand, 1)
  toLocal(oc, 2, -WO, COVER, 0, YS, aLand, 1)
  toLocal(oc, 4, -WO, 0, 0, YS, aLand, 1)
  toLocal(oc, 6, 0, 0, 0, YS, aLand, 1)
  lerpPoly(scratch.mixPaper, op, scratch.boxPaper, k)
  lerpPoly(scratch.mixCover, oc, scratch.boxCover, k)
  const aBack = aR + psi
  polyToWorld(L.movingPaper.poly, scratch.mixPaper, 0, py, aBack, 1)
  L.movingPaper.layers = nB - 1
  L.movingPaper.visible = true
  polyToWorld(L.frontCover.poly, scratch.mixCover, 0, py, aBack, 1)
  L.frontCover.layers = 0
  L.frontCover.visible = true
  spine(L, scratch.spineFront, k)

  setPage(L.pageMB, 0, py, aBack, nB - 1)
  setPage(L.pageR, 0, py, aR, nB - 1)
  addMount(L, nB - 1, 0, py, aBack, aR) // θ = ψ
  L.offX = -CLOSED_CENTRE * k
  L.closed = k
}

// Rest nA → closed back: units nA…10 (ending with the back cover) close over
// the left stack. The mirror image of turnFrontCover.
function turnBackCover(L, nA, psi) {
  const k = smooth(psi / PI) // closedness
  const hl = hLeft(nA)
  const py = YS + (hl - YS) * k
  const aL = PI - Math.asin(clamp((hl - py) / W, -1, 1))
  stack(L.leftPaper, 0, py, aL, nA - 1)
  flatCover(L.frontCover, -1)

  // The block hinges on its front face (the closing spread's right page), body
  // on the −normal side.
  const tp = (11 - nA) * LEAF
  rect(scratch.boxPaper, 0, 0, W, tp)
  rect(scratch.boxCover, 0, tp, WO, tp + COVER)
  const aOpen = tilt(nA)
  const bx = W * Math.cos(aOpen)
  const by = YS + W * Math.sin(aOpen)
  const op = scratch.openPaper
  toLocal(op, 0, 0, YS, 0, YS, aOpen, -1)
  toLocal(op, 2, bx, by, 0, YS, aOpen, -1)
  toLocal(op, 4, bx, COVER, 0, YS, aOpen, -1)
  toLocal(op, 6, 0, COVER, 0, YS, aOpen, -1)
  const oc = scratch.openCover
  toLocal(oc, 0, 0, COVER, 0, YS, aOpen, -1)
  toLocal(oc, 2, WO, COVER, 0, YS, aOpen, -1)
  toLocal(oc, 4, WO, 0, 0, YS, aOpen, -1)
  toLocal(oc, 6, 0, 0, 0, YS, aOpen, -1)
  lerpPoly(scratch.mixPaper, op, scratch.boxPaper, k)
  lerpPoly(scratch.mixCover, oc, scratch.boxCover, k)
  const aFront = aL - PI + psi
  polyToWorld(scratch.mixCover2, scratch.mixPaper, 0, py, aFront, -1)
  // Re-order so face 0 is the block's back and face 1 its front, as everywhere
  // else (the block was built hinged on its front face).
  const mp = L.movingPaper.poly
  const w = scratch.mixCover2
  mp[0] = w[6]; mp[1] = w[7]; mp[2] = w[4]; mp[3] = w[5]
  mp[4] = w[2]; mp[5] = w[3]; mp[6] = w[0]; mp[7] = w[1]
  L.movingPaper.layers = 11 - nA
  L.movingPaper.visible = true
  polyToWorld(L.backCover.poly, scratch.mixCover, 0, py, aFront, -1)
  L.backCover.layers = 0
  L.backCover.visible = true
  spine(L, scratch.spineBack, k)

  setPage(L.pageL, 0, py, aL, nA - 1)
  setPage(L.pageMF, 0, py, aFront, nA - 1)
  addMount(L, nA - 1, 0, py, aL, aFront) // θ = π − ψ
  L.offX = CLOSED_CENTRE * k
  L.closed = k
}

// The closed box flipped over its spine (closed back → "begin again" → front).
const BOX = {
  back: new Float64Array([0, COVER, WO, COVER, WO, 0, 0, 0]),
  paper: new Float64Array([0, COVER, W, COVER, W, T - COVER, 0, T - COVER]),
  front: new Float64Array([0, T - COVER, WO, T - COVER, WO, T, 0, T]),
}

function rotateAboutSpine(dst, src, psi) {
  // Rotate about the line x = 0, y = YS (mid-thickness of the closed spine):
  // a box of thickness T turned by π about it lands exactly on the other side.
  // The spine strip sits just left of that line and would dip SPW·ψ into the
  // table as the flip starts, so the box is lifted by that much mid-flip.
  const c = Math.cos(psi)
  const s = Math.sin(psi)
  const lift = SPW * s
  for (let i = 0; i < 8; i += 2) {
    const x = src[i]
    const y = src[i + 1] - YS
    dst[i] = x * c - y * s
    dst[i + 1] = YS + lift + x * s + y * c
  }
}

function turnWholeBook(L, psi) {
  rotateAboutSpine(L.backCover.poly, BOX.back, psi)
  rotateAboutSpine(L.rightPaper.poly, BOX.paper, psi)
  rotateAboutSpine(L.frontCover.poly, BOX.front, psi)
  rotateAboutSpine(L.spine.poly, scratch.spineFront, psi)
  L.backCover.visible = L.frontCover.visible = L.rightPaper.visible = L.spine.visible = true
  L.backCover.layers = L.frontCover.layers = L.spine.layers = 0
  L.rightPaper.layers = 10
  L.offX = -CLOSED_CENTRE * Math.cos(psi)
  L.closed = 1
}
