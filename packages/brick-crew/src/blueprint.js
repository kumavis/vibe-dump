// ---------------------------------------------------------------------------
// The drawing on the paper the site office hands out.
//
// Pure 2D canvas — no three.js here. It is a real drawing sheet: front
// elevation, floor plan, gable elevation, dimensions, title block and a
// progress stamp. The elevations are drawn course by course against the actual
// state of the build, so what is standing on site is inked in solid and what
// isn't is a dashed ghost.
// ---------------------------------------------------------------------------

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

const INK = '#e4f0f8'
const INK_SOFT = 'rgba(214,234,247,0.55)'
const GHOST = 'rgba(190,220,240,0.34)'
const PAPER = '#0d3f60'
const PAPER_2 = '#0a3350'
const STAMP = '#ffc861'

/** Fixed speckle so the paper grain never shimmers between frames. */
const SPECKLE = Array.from({ length: 260 }, (_, i) => {
  const s = Math.sin(i * 12.9898) * 43758.5453
  const t = Math.sin(i * 78.233) * 12345.6789
  return [s - Math.floor(s), t - Math.floor(t), ((s * 7) % 1 + 1) % 1]
})

export function blueprintSheetAspect() {
  return 1.42
}

export function formatDuration(seconds) {
  if (seconds == null || !isFinite(seconds) || seconds < 0) return '--'
  const s = Math.round(seconds)
  if (s < 3600) return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`
  return `${Math.floor(s / 3600)}h ${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}m`
}

const clock = (s) => {
  const v = Math.max(0, Math.round(s))
  return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, '0')}`
}

// --- primitives ------------------------------------------------------------

function line(c, x0, y0, x1, y1) {
  c.beginPath()
  c.moveTo(x0, y0)
  c.lineTo(x1, y1)
  c.stroke()
}

function panel(c, r, title) {
  c.save()
  c.strokeStyle = 'rgba(200,228,245,0.28)'
  c.lineWidth = 1
  c.setLineDash([5, 4])
  c.strokeRect(r.x, r.y, r.w, r.h)
  c.setLineDash([])
  c.fillStyle = INK_SOFT
  c.font = `600 ${Math.max(9, Math.min(14, r.w * 0.026))}px ${MONO}`
  c.textAlign = 'left'
  c.textBaseline = 'alphabetic'
  c.fillText(title, r.x + 8, r.y + 16)
  c.restore()
}

/** Dimension line with ticks and a centred callout. */
function dim(c, x0, y0, x1, y1, text, off = 0) {
  c.save()
  c.strokeStyle = INK_SOFT
  c.fillStyle = INK_SOFT
  c.lineWidth = 1
  const dx = x1 - x0
  const dy = y1 - y0
  const len = Math.hypot(dx, dy) || 1
  const nx = -dy / len
  const ny = dx / len
  const ax = x0 + nx * off
  const ay = y0 + ny * off
  const bx = x1 + nx * off
  const by = y1 + ny * off
  line(c, ax, ay, bx, by)
  for (const [px, py] of [[ax, ay], [bx, by]]) {
    line(c, px - nx * 4, py - ny * 4, px + nx * 4, py + ny * 4)
  }
  c.save()
  c.translate((ax + bx) / 2, (ay + by) / 2)
  if (Math.abs(dy) > Math.abs(dx)) c.rotate(-Math.PI / 2)
  c.font = `10px ${MONO}`
  c.textAlign = 'center'
  const tw = c.measureText(text).width + 8
  c.fillStyle = PAPER
  c.fillRect(-tw / 2, -6, tw, 12)
  c.fillStyle = INK_SOFT
  c.fillText(text, 0, 3)
  c.restore()
  c.restore()
}

/** Fill matching the sheet background, so an opening reads as a real void. */
let paperFill = PAPER

/**
 * A run of masonry drawn brick by brick. `done` is how many bricks of this
 * course are actually standing on site; the rest come out as ghost outlines.
 * `holes` are canvas-space [x0, x1] spans the course skips — the openings.
 */
function course(c, x, y, w, h, n, done, solidFill, holes) {
  const bw = w / n
  const skip = (i) => {
    const mid = x + i * bw + bw / 2
    return holes && holes.some(([h0, h1]) => mid > h0 - bw * 0.35 && mid < h1 + bw * 0.35)
  }
  // Bricks that are actually standing get drawn one at a time. What is still
  // to come is a single dashed outline per stretch — a course-by-course dash
  // pattern turns the sheet into scribble.
  c.strokeStyle = INK
  c.lineWidth = 1
  for (let i = 0; i < Math.min(n, done); i++) {
    if (skip(i)) continue
    const bx = x + i * bw
    if (solidFill) {
      c.fillStyle = solidFill
      c.fillRect(bx, y, bw, h)
    }
    c.strokeRect(bx + 0.5, y + 0.5, bw - 1, h - 1)
  }
  if (done >= n) return
  c.strokeStyle = GHOST
  c.lineWidth = 0.8
  c.setLineDash([3, 3])
  let runStart = -1
  for (let i = Math.max(0, done); i <= n; i++) {
    const open = i < n && !skip(i)
    if (open && runStart < 0) runStart = i
    if (!open && runStart >= 0) {
      c.strokeRect(x + runStart * bw + 0.5, y + 0.5, (i - runStart) * bw - 1, h - 1)
      runStart = -1
    }
  }
  c.setLineDash([])
}

// --- layout ----------------------------------------------------------------

function layout(w, h) {
  const m = Math.max(12, w * 0.024)
  const inner = { x: m, y: m, w: w - m * 2, h: h - m * 2 }
  const portrait = w / h < 1.05
  const row = (t, hh) => ({ x: inner.x, y: inner.y + inner.h * t, w: inner.w, h: inner.h * hh })
  if (portrait) {
    // Stacked: one elevation, the gable and plan side by side, then the
    // paperwork. The progress panel gets the lion's share of what's left.
    return {
      inner,
      portrait,
      elev: row(0, 0.26),
      gable: { x: inner.x, y: inner.y + inner.h * 0.27, w: inner.w * 0.48, h: inner.h * 0.19 },
      plan: { x: inner.x + inner.w * 0.52, y: inner.y + inner.h * 0.27, w: inner.w * 0.48, h: inner.h * 0.19 },
      rear: null,
      prog: row(0.47, 0.33),
      title: row(0.81, 0.19),
    }
  }
  const sideW = inner.w * 0.28
  const mainW = inner.w - sideW - 12
  return {
    inner,
    portrait,
    elev: { x: inner.x, y: inner.y + 4, w: mainW * 0.62, h: inner.h * 0.52 },
    gable: { x: inner.x + mainW * 0.64, y: inner.y + 4, w: mainW * 0.36, h: inner.h * 0.52 },
    plan: { x: inner.x, y: inner.y + inner.h * 0.56, w: mainW * 0.52, h: inner.h * 0.44 },
    rear: { x: inner.x + mainW * 0.55, y: inner.y + inner.h * 0.56, w: mainW * 0.45, h: inner.h * 0.44 },
    prog: { x: inner.x + mainW + 12, y: inner.y + 4, w: sideW, h: inner.h * 0.58 },
    title: { x: inner.x + mainW + 12, y: inner.y + inner.h * 0.62, w: sideW, h: inner.h * 0.38 },
  }
}

// --- drawings --------------------------------------------------------------

/** Openings on one wall, in metres from the wall centre. */
function wallOpenings(state, id) {
  return state.openings.filter((o) => o.wall === id)
}

/** Long-wall elevation, drawn course by course against real progress. */
function drawWallElevation(c, r, state, wallId, title) {
  panel(c, r, title)
  const H = state.house
  const totalH = H.ridgeY + 0.5
  const totalW = H.w + 1.6
  const s = Math.min((r.w - 30) / totalW, (r.h - 58) / totalH)
  const ox = r.x + r.w / 2
  const oy = r.y + r.h - 32
  const X = (wx) => ox + wx * s
  const Y = (wy) => oy - wy * s

  // ground line
  c.strokeStyle = INK
  c.lineWidth = 1.6
  line(c, r.x + 10, oy, r.x + r.w - 10, oy)
  c.strokeStyle = INK_SOFT
  c.lineWidth = 0.8
  for (let i = 0; i < 26; i++) {
    const gx = r.x + 12 + i * ((r.w - 24) / 26)
    line(c, gx, oy, gx - 5, oy + 6)
  }

  const opens = wallOpenings(state, wallId)
  const built = state.built[wallId] ?? 0
  const perCourse = 12
  const ch = H.courseH * s

  for (let k = 0; k < H.wallCourses; k++) {
    const y = Y((k + 1) * H.courseH)
    const done = k < Math.floor(built) ? perCourse : k === Math.floor(built) ? Math.round((built % 1) * perCourse) : 0
    const holes = opens.filter((o) => k >= o.c0 && k <= o.c1).map((o) => [X(o.u0), X(o.u1)])
    course(c, X(-H.w / 2), y, H.w * s, ch, perCourse, done, 'rgba(190,225,245,0.10)', holes)
  }
  // reveals and lintels
  for (const o of opens) {
    const x0 = X(o.u0)
    const x1 = X(o.u1)
    const yTop = Y((o.c1 + 1) * H.courseH)
    const yBot = Y(o.c0 * H.courseH)
    const lit = built > o.c1 + 1
    c.strokeStyle = lit ? INK : GHOST
    c.lineWidth = lit ? 1.4 : 0.8
    if (!lit) c.setLineDash([3, 3])
    c.strokeRect(x0, yTop, x1 - x0, yBot - yTop)
    c.strokeRect(x0 - 4, yTop - ch, x1 - x0 + 8, ch) // lintel
    c.setLineDash([])
    if (o.kind === 'window') {
      c.strokeStyle = lit ? INK_SOFT : GHOST
      c.lineWidth = 0.8
      line(c, (x0 + x1) / 2, yTop, (x0 + x1) / 2, yBot)
      line(c, x0, (yTop + yBot) / 2, x1, (yTop + yBot) / 2)
    } else {
      c.strokeStyle = lit ? INK_SOFT : GHOST
      c.lineWidth = 0.8
      line(c, x0 + 5, yTop + 6, x0 + 5, yBot)
      line(c, x1 - 5, yTop + 6, x1 - 5, yBot)
    }
  }

  // roof: eave line, verges and ridge, hatched once the tiles start
  const eaveY = Y(H.eaveY)
  const ridgeY = Y(H.ridgeY)
  const roofDone = state.roofDone ?? 0
  const tilesDone = state.tilesDone ?? 0
  c.strokeStyle = roofDone > 0.2 ? INK : GHOST
  c.lineWidth = roofDone > 0.2 ? 1.4 : 0.8
  if (roofDone <= 0.2) c.setLineDash([4, 4])
  c.beginPath()
  c.moveTo(X(-H.w / 2 - 0.1), eaveY)
  c.lineTo(X(H.w / 2 + 0.1), eaveY)
  c.lineTo(X(H.w / 2), ridgeY)
  c.lineTo(X(-H.w / 2), ridgeY)
  c.closePath()
  c.stroke()
  c.setLineDash([])
  if (tilesDone > 0.02) {
    c.save()
    c.beginPath()
    c.rect(X(-H.w / 2), ridgeY, H.w * s, eaveY - ridgeY)
    c.clip()
    c.strokeStyle = 'rgba(214,234,247,0.35)'
    c.lineWidth = 0.7
    const rows = 7
    for (let i = 1; i <= Math.round(rows * tilesDone); i++) {
      const yy = ridgeY + ((eaveY - ridgeY) * i) / rows
      line(c, X(-H.w / 2), yy, X(H.w / 2), yy)
    }
    for (let i = 0; i <= 10; i++) {
      const xx = X(-H.w / 2 + (H.w * i) / 10)
      line(c, xx, eaveY - (eaveY - ridgeY) * tilesDone, xx, eaveY)
    }
    c.restore()
  }

  dim(c, X(-H.w / 2), oy, X(H.w / 2), oy, `${H.w.toFixed(2)} m`, 18)
  dim(c, X(H.w / 2), oy, X(H.w / 2), Y(H.eaveY), `${H.eaveY.toFixed(2)}`, -20)
  dim(c, X(-H.w / 2), Y(H.eaveY), X(-H.w / 2), Y(H.ridgeY), `${(H.ridgeY - H.eaveY).toFixed(2)}`, 20)
}

function drawGableElevation(c, r, state) {
  panel(c, r, 'GABLE ELEVATION  (EAST)')
  const H = state.house
  const s = Math.min((r.w - 34) / (H.d + 2.2), (r.h - 58) / (H.ridgeY + 0.6))
  const ox = r.x + r.w / 2 + 6
  const oy = r.y + r.h - 30
  const X = (wz) => ox + wz * s
  const Y = (wy) => oy - wy * s

  c.strokeStyle = INK
  c.lineWidth = 1.6
  line(c, r.x + 10, oy, r.x + r.w - 10, oy)

  const built = state.built.E ?? 0
  const perCourse = 10
  const ch = H.courseH * s
  const win = wallOpenings(state, 'E')[0]
  for (let k = 0; k < H.wallCourses; k++) {
    const y = Y((k + 1) * H.courseH)
    const done = k < Math.floor(built) ? perCourse : k === Math.floor(built) ? Math.round((built % 1) * perCourse) : 0
    const holes = win && k >= win.c0 && k <= win.c1 ? [[X(win.u0), X(win.u1)]] : null
    course(c, X(-H.d / 2), y, H.d * s, ch, perCourse, done, 'rgba(190,225,245,0.10)', holes)
  }
  if (win) {
    const lit = built > win.c1 + 1
    c.strokeStyle = lit ? INK : GHOST
    c.lineWidth = lit ? 1.3 : 0.8
    if (!lit) c.setLineDash([3, 3])
    c.strokeRect(X(win.u0), Y((win.c1 + 1) * H.courseH), (win.u1 - win.u0) * s, (win.c1 + 1 - win.c0) * H.courseH * s)
    c.setLineDash([])
  }

  // gable triangle, course by course
  const gBuilt = state.built.gableE ?? 0
  const tanp = (H.ridgeY - H.eaveY) / (H.d / 2)
  for (let g = 0; g < H.gableCourses; g++) {
    const half = H.d / 2 - ((g + 0.5) * H.courseH) / tanp
    if (half < 0.14) continue
    const n = Math.max(1, Math.round((half * 2) / 0.42))
    const done = g < Math.floor(gBuilt) ? n : g === Math.floor(gBuilt) ? Math.round((gBuilt % 1) * n) : 0
    course(c, X(-half), Y(H.eaveY + (g + 1) * H.courseH), half * 2 * s, ch, n, done, 'rgba(190,225,245,0.10)')
  }
  // roof line over the gable
  const roofDone = state.roofDone ?? 0
  c.strokeStyle = roofDone > 0.2 ? INK : GHOST
  c.lineWidth = roofDone > 0.2 ? 1.5 : 0.9
  if (roofDone <= 0.2) c.setLineDash([4, 4])
  c.beginPath()
  c.moveTo(X(-H.d / 2 - 0.3), Y(H.eaveY - 0.18))
  c.lineTo(X(0), Y(H.ridgeY + 0.06))
  c.lineTo(X(H.d / 2 + 0.3), Y(H.eaveY - 0.18))
  c.stroke()
  c.setLineDash([])

  // chimney stack
  const ck = state.chimney
  const cBuilt = state.built.chim ?? 0
  const cx = X(ck.z)
  const cw = ck.runLen * s
  for (let k = 0; k < ck.courses; k++) {
    const done = k < Math.floor(cBuilt) ? 2 : k === Math.floor(cBuilt) ? Math.round((cBuilt % 1) * 2) : 0
    course(c, cx - cw / 2, Y((k + 1) * H.courseH), cw, ch, 2, done, 'rgba(190,225,245,0.10)')
  }
  c.strokeStyle = cBuilt >= ck.courses ? INK : GHOST
  c.lineWidth = 1
  c.strokeRect(cx - cw / 2 - 5, Y((ck.courses + 2) * H.courseH), cw + 10, ch * 2)

  dim(c, X(-H.d / 2), oy, X(H.d / 2), oy, `${H.d.toFixed(2)} m`, 16)
  c.fillStyle = INK_SOFT
  c.font = `9px ${MONO}`
  c.textAlign = 'center'
  c.fillText(`PITCH ${((Math.atan(tanp) * 180) / Math.PI).toFixed(0)}°`, X(H.d / 4), Y(H.eaveY + 0.55))
}

function drawPlan(c, r, state) {
  panel(c, r, 'GROUND FLOOR PLAN  1:50')
  const H = state.house
  const s = Math.min((r.w - 90) / (H.w + 2.4), (r.h - 60) / (H.d + 2.4))
  const ox = r.x + r.w / 2 - 10
  const oy = r.y + r.h / 2 + 8
  const X = (wx) => ox + wx * s
  // +Z runs down the sheet, so the front door lands at the bottom of the plan
  // and the north arrow points the way it should.
  const Z = (wz) => oy + wz * s
  const t = H.t * s

  // wall poche
  const x0 = X(-H.w / 2)
  const z0 = Z(-H.d / 2)
  c.save()
  c.beginPath()
  c.rect(x0, z0, H.w * s, H.d * s)
  c.rect(x0 + t, z0 + t, (H.w - 2 * H.t) * s, (H.d - 2 * H.t) * s)
  c.fillStyle = 'rgba(210,235,250,0.5)'
  c.fill('evenodd')
  c.restore()
  c.strokeStyle = INK
  c.lineWidth = 1.4
  c.strokeRect(x0, z0, H.w * s, H.d * s)
  c.strokeRect(x0 + t, z0 + t, (H.w - 2 * H.t) * s, (H.d - 2 * H.t) * s)

  // openings cut back to bare paper, with a door swing
  c.fillStyle = paperFill
  for (const o of state.openings) {
    if (o.wall === 'S') c.fillRect(X(o.u0), Z(H.d / 2 - H.t) - 1, (o.u1 - o.u0) * s, t + 2)
    else if (o.wall === 'N') c.fillRect(X(o.u0), Z(-H.d / 2) - 1, (o.u1 - o.u0) * s, t + 2)
    else if (o.wall === 'E') c.fillRect(X(H.w / 2 - H.t) - 1, Z(o.u0), t + 2, (o.u1 - o.u0) * s)
    else c.fillRect(X(-H.w / 2) - 1, Z(o.u0), t + 2, (o.u1 - o.u0) * s)
  }
  c.strokeStyle = INK_SOFT
  c.lineWidth = 1
  for (const o of state.openings) {
    const horiz = o.wall === 'S' || o.wall === 'N'
    const zz = o.wall === 'S' ? Z(H.d / 2) : Z(-H.d / 2)
    const xx = o.wall === 'E' ? X(H.w / 2) : X(-H.w / 2)
    const inward = o.wall === 'S' || o.wall === 'E' ? -t : t
    if (horiz) {
      line(c, X(o.u0), zz, X(o.u0), zz + inward)
      line(c, X(o.u1), zz, X(o.u1), zz + inward)
    } else {
      line(c, xx, Z(o.u0), xx + inward, Z(o.u0))
      line(c, xx, Z(o.u1), xx + inward, Z(o.u1))
    }
    if (o.kind === 'door') {
      // leaf hung on the left reveal, swinging into the room
      const w = (o.u1 - o.u0) * s
      const hx = X(o.u0)
      const hz = Z(H.d / 2 - H.t)
      c.beginPath()
      c.moveTo(hx, hz)
      c.lineTo(hx, hz - w)
      c.stroke()
      c.beginPath()
      c.arc(hx, hz, w, -Math.PI / 2, 0)
      c.stroke()
    }
  }

  // chimney breast
  const ck = state.chimney
  const cd = (ck.depth ?? 0.2) * s
  c.strokeStyle = INK
  c.lineWidth = 1.2
  c.strokeRect(X(ck.x) - cd / 2, Z(ck.z - ck.runLen / 2), cd, ck.runLen * s)
  c.beginPath()
  c.moveTo(X(ck.x) - cd / 2, Z(ck.z - ck.runLen / 2))
  c.lineTo(X(ck.x) + cd / 2, Z(ck.z + ck.runLen / 2))
  c.moveTo(X(ck.x) + cd / 2, Z(ck.z - ck.runLen / 2))
  c.lineTo(X(ck.x) - cd / 2, Z(ck.z + ck.runLen / 2))
  c.stroke()

  // room division, shown light — not part of the masonry contract
  c.strokeStyle = GHOST
  c.setLineDash([6, 4])
  c.lineWidth = 1
  line(c, X(0.6), Z(-H.d / 2 + H.t), X(0.6), Z(H.d / 2 - H.t))
  line(c, X(0.6), Z(-0.4), X(H.w / 2 - H.t), Z(-0.4))
  c.setLineDash([])
  if (r.w > 260 && r.h > 200) {
    c.fillStyle = INK_SOFT
    c.font = `10px ${MONO}`
    c.textAlign = 'center'
    c.fillText('LIVING', X(-1.1), Z(0.2))
    c.fillText('KITCHEN', X(1.6), Z(0.9))
    c.fillText('STORE', X(1.6), Z(-1.3))
  }

  dim(c, X(-H.w / 2), Z(H.d / 2), X(H.w / 2), Z(H.d / 2), `${H.w.toFixed(2)} m`, 30)
  dim(c, X(H.w / 2), Z(-H.d / 2), X(H.w / 2), Z(H.d / 2), `${H.d.toFixed(2)} m`, -30)

  // north arrow
  const nx = r.x + r.w - 34
  const ny = r.y + 46
  c.strokeStyle = INK
  c.fillStyle = INK
  c.lineWidth = 1.2
  c.beginPath()
  c.moveTo(nx, ny - 16)
  c.lineTo(nx + 6, ny + 10)
  c.lineTo(nx, ny + 4)
  c.lineTo(nx - 6, ny + 10)
  c.closePath()
  c.fill()
  c.font = `bold 11px ${MONO}`
  c.textAlign = 'center'
  c.fillText('N', nx, ny - 20)
}

function drawProgress(c, r, state) {
  panel(c, r, 'PROGRESS  /  SITE RECORD')
  const pad = 10
  const w = r.w - pad * 2
  const x = r.x + pad
  const bottom = r.y + r.h - 6
  // Everything below is sized off the space the panel actually got, so a
  // narrow portrait sheet doesn't spill the title block over the bars.
  const tight = r.h < 250
  const etaH = tight ? 46 : 62
  const rowH = tight ? 14 : 22
  let y = r.y + (tight ? 26 : 34)

  // headline: time to completion
  c.fillStyle = 'rgba(255,200,97,0.1)'
  c.fillRect(x, y, w, etaH)
  c.strokeStyle = STAMP
  c.lineWidth = 1.6
  c.strokeRect(x, y, w, etaH)
  c.fillStyle = STAMP
  c.font = `${tight ? 8 : 10}px ${MONO}`
  c.textAlign = 'left'
  c.fillText('EST. TIME TO COMPLETION', x + 8, y + (tight ? 14 : 18))
  c.font = `bold ${Math.min(tight ? 24 : 34, w * 0.17)}px ${MONO}`
  c.fillText(formatDuration(state.etaSeconds), x + 8, y + etaH - 12)
  c.font = `${tight ? 8 : 10}px ${MONO}`
  c.textAlign = 'right'
  c.fillText(`${(state.ratePerMin || 0).toFixed(1)}/min`, x + w - 8, y + etaH - 12)
  y += etaH + (tight ? 18 : 24)

  // overall bar
  const pct = state.total ? state.placed / state.total : 0
  c.fillStyle = INK
  c.font = `bold ${tight ? 11 : 13}px ${MONO}`
  c.textAlign = 'left'
  c.fillText(`${(pct * 100).toFixed(1)}% COMPLETE`, x, y)
  c.textAlign = 'right'
  c.fillStyle = INK_SOFT
  c.font = `${tight ? 9 : 11}px ${MONO}`
  c.fillText(`${state.placed} / ${state.total}`, x + w, y)
  y += 7
  c.fillStyle = 'rgba(255,255,255,0.12)'
  c.fillRect(x, y, w, 8)
  c.fillStyle = STAMP
  c.fillRect(x, y, w * pct, 8)
  c.strokeStyle = INK_SOFT
  c.lineWidth = 1
  c.strokeRect(x + 0.5, y + 0.5, w - 1, 7)
  y += tight ? 20 : 26

  // per-phase, as far down as there is room for
  const footerH = tight ? 34 : 52
  for (const p of state.phases) {
    if (y + rowH > bottom - footerH) break
    const f = p.total ? p.done / p.total : 0
    c.fillStyle = f >= 1 ? STAMP : INK_SOFT
    c.font = `${tight ? 8 : 10}px ${MONO}`
    c.textAlign = 'left'
    c.fillText(p.label, x, y)
    c.textAlign = 'right'
    c.fillText(`${p.done}/${p.total}`, x + w, y)
    y += 4
    c.fillStyle = 'rgba(255,255,255,0.1)'
    c.fillRect(x, y, w, 4)
    c.fillStyle = f >= 1 ? 'rgba(255,200,97,0.85)' : 'rgba(214,234,247,0.6)'
    c.fillRect(x, y, w * f, 4)
    y += rowH - 4
  }

  y = bottom - footerH + (tight ? 8 : 16)
  c.strokeStyle = INK_SOFT
  c.setLineDash([3, 3])
  line(c, x, y - 12, x + w, y - 12)
  c.setLineDash([])
  c.fillStyle = INK
  c.font = `${tight ? 9 : 11}px ${MONO}`
  c.textAlign = 'left'
  c.fillText(`SHIFT ${state.shift.index}  ·  ${state.shift.crewName.toUpperCase()}`, x, y)
  c.fillStyle = INK_SOFT
  c.font = `${tight ? 8 : 10}px ${MONO}`
  c.fillText(`NEXT SHIFT CHANGE IN ${clock(state.shift.secondsLeft)}`, x, y + (tight ? 13 : 16))
}

function drawTitleBlock(c, r, state) {
  c.strokeStyle = INK
  c.lineWidth = 1.4
  c.strokeRect(r.x, r.y, r.w, r.h)
  const rows = [
    ['PROJECT', state.title],
    ['CLIENT', 'BRICK CREW CONSTRUCTION CO.'],
    ['DRAWING', `BC-${String(100 + state.day)}-A / GA ELEVATIONS + PLAN`],
    ['SCALE', '1:50 @ A2      REV. C'],
    ['DAY', `${state.day}`],
    ['STATUS', state.placed >= state.total ? 'TOPPED OUT' : 'ISSUED FOR CONSTRUCTION'],
  ]
  const rh = r.h / rows.length
  // Below about 26px a row can't hold a label above its value, so the two go
  // side by side instead of on top of each other.
  const stacked = rh >= 26
  rows.forEach((row, i) => {
    const y = r.y + rh * i
    if (i) {
      c.strokeStyle = 'rgba(200,228,245,0.3)'
      c.lineWidth = 0.8
      line(c, r.x, y, r.x + r.w, y)
    }
    const base = y + rh - Math.max(4, rh * 0.28)
    c.fillStyle = INK_SOFT
    c.font = `${Math.max(7, Math.min(9, rh * 0.45))}px ${MONO}`
    c.textAlign = 'left'
    c.fillText(row[0], r.x + 6, stacked ? y + 14 : base)
    const labelW = stacked ? 0 : c.measureText(row[0]).width + 10
    c.fillStyle = INK
    c.font = `${Math.max(8, Math.min(12, r.w * 0.05))}px ${MONO}`
    const avail = r.w - 14 - labelW
    let t = row[1]
    const full = t
    while (c.measureText(t).width > avail && t.length > 4) t = t.slice(0, -2)
    c.textAlign = stacked ? 'left' : 'right'
    c.fillText(t === full ? t : `${t}…`, stacked ? r.x + 6 : r.x + r.w - 6, base)
  })
}

// --- sheet -----------------------------------------------------------------

export function drawBlueprint(ctx, w, h, state) {
  const c = ctx
  c.save()
  c.clearRect(0, 0, w, h)

  // paper
  const g = c.createLinearGradient(0, 0, w * 0.4, h)
  g.addColorStop(0, PAPER)
  g.addColorStop(1, PAPER_2)
  paperFill = g
  c.fillStyle = g
  c.fillRect(0, 0, w, h)
  // grain
  for (let i = 0; i < SPECKLE.length; i++) {
    const [a, b, t] = SPECKLE[i]
    c.fillStyle = t > 0.5 ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.05)'
    c.fillRect(a * w, b * h, 1 + t * 2, 1 + t * 2)
  }
  // faint setting-out grid
  c.strokeStyle = 'rgba(255,255,255,0.05)'
  c.lineWidth = 1
  const gs = Math.max(24, w / 34)
  for (let x = gs; x < w; x += gs) line(c, x, 0, x, h)
  for (let y = gs; y < h; y += gs) line(c, 0, y, w, y)

  const L = layout(w, h)

  // ink fades in with the paper as it unrolls
  c.globalAlpha = 0.25 + 0.75 * Math.min(1, (state.revealed ?? 1) * 1.35)

  // border rule
  c.strokeStyle = INK
  c.lineWidth = 2
  c.strokeRect(L.inner.x - 6, L.inner.y - 6, L.inner.w + 12, L.inner.h + 12)
  c.lineWidth = 1
  c.strokeRect(L.inner.x - 2, L.inner.y - 2, L.inner.w + 4, L.inner.h + 4)

  c.textBaseline = 'alphabetic'
  drawWallElevation(c, L.elev, state, 'S', 'FRONT ELEVATION  (SOUTH)  1:50')
  drawGableElevation(c, L.gable, state)
  drawPlan(c, L.plan, state)
  if (L.rear) drawWallElevation(c, L.rear, state, 'N', 'REAR ELEVATION  (NORTH)')
  drawProgress(c, L.prog, state)
  drawTitleBlock(c, L.title, state)

  // revision cloud over whichever phase is live — the drawing office keeps
  // scribbling on the thing while the crew builds it
  const live = state.phases.find((p) => p.done < p.total)
  if (live) {
    const target = live.key === 'walls' ? L.elev : L.gable
    c.strokeStyle = 'rgba(255,200,97,0.55)'
    c.lineWidth = 1.4
    const cx = target.x + target.w - 52
    const cy = target.y + 34
    c.beginPath()
    for (let i = 0; i <= 16; i++) {
      const a = (i / 16) * Math.PI * 2
      const rr = 22 + (i % 2 ? 5 : 0)
      c.arc(cx + Math.cos(a) * 26, cy + Math.sin(a) * 13, rr * 0.3, 0, Math.PI * 2)
    }
    c.stroke()
    c.fillStyle = STAMP
    c.font = `bold 10px ${MONO}`
    c.textAlign = 'center'
    c.fillText(live.label, cx, cy + 3)
  }

  // tape in the corners
  c.globalAlpha = 1
  for (const [px, py, rot] of [
    [L.inner.x - 10, L.inner.y - 10, -0.7],
    [w - L.inner.x + 10, L.inner.y - 10, 0.7],
  ]) {
    c.save()
    c.translate(px, py)
    c.rotate(rot)
    c.fillStyle = 'rgba(240,240,225,0.2)'
    c.fillRect(-34, -11, 68, 22)
    c.restore()
  }
  c.restore()
}
