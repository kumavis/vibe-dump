/* =====================================================================
   SMF 03 — PARTS BENCH · view layer
   Canvas 2D only. Reads the sim each frame, owns zero game state.
   Two-color law: cyan = signal (this whole bench), amber = matter
   (costs only), red = fault, green = success. The blue field is absent
   here on purpose — the bench is pure signal.
   ===================================================================== */
import {
  GW, GH, DIRS, SOURCES, SOCKET, PUZZLES, TRACE_CAP, TANK_CAP,
  SCOPE_N, PASS_HOLD,
} from './sim.js'

const C = {
  bg: '#0b0e11', grid: '#141c22', gridB: '#1b252c',
  text: '#c2ccd2', dim: '#566068', dim2: '#5b7482',
  cyan: '#55d6f0', cyanHi: '#8fe9ff', cyanDk: '#2a6a7c',
  body: '#0f2229', bodyLine: '#2a5563',
  amber: '#e0973a', red: '#d96b6b', green: '#9fd65a',
  panel: 'rgba(13,18,22,.92)', border: '#1e2a32',
}

const ixOf = (gx, gz) => gx + gz * GW
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const frac = (v) => v - Math.floor(v)

export function createView(canvas) {
  const ctx = canvas.getContext('2d')
  let W = 0, H = 0, dpr = 1
  // board layout (recomputed on resize / panel toggle)
  const L = { cs: 40, bx: 10, by: 62, sx: 10, sy: 0, sw: 100, sh: 118, panelW: 330 }

  function resize(panelW) {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    W = canvas.clientWidth
    H = canvas.clientHeight
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    L.panelW = panelW
    const topPad = 64, gap = 12, scopeH = 118, botPad = 26
    const availW = W - panelW - 26
    const availH = H - topPad - gap - scopeH - botPad
    L.cs = Math.max(24, Math.floor(Math.min(availW / GW, availH / GH)))
    L.bx = Math.round(12 + Math.max(0, (availW - L.cs * GW) / 2))
    L.by = Math.round(topPad + Math.max(0, (availH - L.cs * GH) / 2))
    L.sx = L.bx
    L.sy = L.by + GH * L.cs + gap
    L.sw = L.cs * GW
    L.sh = Math.min(scopeH, H - L.sy - botPad)
  }

  const cellCenter = (gx, gz) => ({ x: L.bx + (gx + 0.5) * L.cs, y: L.by + (gz + 0.5) * L.cs })
  function cellAt(px, py) {
    const gx = Math.floor((px - L.bx) / L.cs)
    const gz = Math.floor((py - L.by) / L.cs)
    return gx >= 0 && gx < GW && gz >= 0 && gz < GH ? { gx, gz } : null
  }

  /* which sides feed this cell (neighbors whose dir points into it) */
  function feeders(cells, gx, gz) {
    const out = []
    for (let d = 0; d < 4; d++) {
      const nx = gx - DIRS[d][0], nz = gz - DIRS[d][1]
      if (nx < 0 || nx >= GW || nz < 0 || nz >= GH) continue
      const q = cells[ixOf(nx, nz)]
      if (q && q.type !== 'socket' && q.dir === d) out.push({ d, q })
    }
    return out
  }

  function edgeMid(gx, gz, d) {
    const c = cellCenter(gx, gz)
    return { x: c.x + DIRS[d][0] * L.cs / 2, y: c.y + DIRS[d][1] * L.cs / 2 }
  }

  function line(a, b) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke() }

  function arrow(c, d, r, col) {
    const [dx, dz] = DIRS[d]
    const tip = { x: c.x + dx * r, y: c.y + dz * r }
    const px = -dz, py = dx
    ctx.fillStyle = col
    ctx.beginPath()
    ctx.moveTo(tip.x, tip.y)
    ctx.lineTo(tip.x - dx * 4 + px * 3, tip.y - dz * 4 + py * 3)
    ctx.lineTo(tip.x - dx * 4 - px * 3, tip.y - dz * 4 - py * 3)
    ctx.closePath()
    ctx.fill()
  }

  function label(txt, x, y, col, size = 9, align = 'center') {
    ctx.fillStyle = col
    ctx.font = `600 ${size}px ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace`
    ctx.textAlign = align
    ctx.textBaseline = 'middle'
    ctx.fillText(txt, x, y)
  }

  /* ------------------------------ parts ------------------------------ */
  function drawTrace(cells, gx, gz, p, time) {
    const c = cellCenter(gx, gz)
    const fs = feeders(cells, gx, gz)
    const entryD = fs.length === 1 ? (fs[0].d + 2) & 3 : (p.dir + 2) & 3
    const back = edgeMid(gx, gz, entryD)
    const front = edgeMid(gx, gz, p.dir)
    ctx.lineWidth = 3
    if (p.sat) { ctx.shadowColor = C.red; ctx.shadowBlur = 9; ctx.strokeStyle = C.red }
    else ctx.strokeStyle = p.out > 0.25 ? 'rgba(85,214,240,.75)' : 'rgba(85,214,240,.28)'
    line(back, c); line(c, front)
    for (const f of fs) if (((f.d + 2) & 3) !== entryD) line(edgeMid(gx, gz, (f.d + 2) & 3), c)
    ctx.shadowBlur = 0
    // tokens: discrete only in the view, derived from the clock
    if (p.out > 0.25) {
      const n = 1 + Math.min(2, Math.floor(p.out / 8))
      ctx.fillStyle = p.sat ? C.red : C.cyanHi
      for (let i = 0; i < n; i++) {
        const s = frac(time * 0.9 + i / n + (gx * 7 + gz * 13) * 0.077)
        const seg = s < 0.5 ? [back, c, s * 2] : [c, front, (s - 0.5) * 2]
        const x = seg[0].x + (seg[1].x - seg[0].x) * seg[2]
        const y = seg[0].y + (seg[1].y - seg[0].y) * seg[2]
        ctx.beginPath(); ctx.arc(x, y, 1.8, 0, 7); ctx.fill()
      }
    }
  }

  function bodyRect(c, w, h, stroke, fill = C.body) {
    ctx.fillStyle = fill
    ctx.strokeStyle = stroke
    ctx.lineWidth = 1
    ctx.fillRect(c.x - w / 2, c.y - h / 2, w, h)
    ctx.strokeRect(c.x - w / 2, c.y - h / 2, w, h)
  }

  function drawArms(cells, gx, gz, p, exclude = []) {
    const c = cellCenter(gx, gz)
    ctx.strokeStyle = 'rgba(85,214,240,.4)'
    ctx.lineWidth = 2
    for (const f of feeders(cells, gx, gz)) {
      if (exclude.includes(f.d)) continue
      line(edgeMid(gx, gz, (f.d + 2) & 3), c)
    }
    line(c, edgeMid(gx, gz, p.dir))
  }

  function drawValve(cells, gx, gz, p) {
    const c = cellCenter(gx, gz), r = L.cs * 0.22
    drawArms(cells, gx, gz, p)
    ctx.fillStyle = C.body
    ctx.strokeStyle = C.cyan
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(c.x - r, c.y - r); ctx.lineTo(c.x + r, c.y + r); ctx.lineTo(c.x + r, c.y - r)
    ctx.lineTo(c.x - r, c.y + r); ctx.closePath()
    ctx.fill(); ctx.stroke()
    arrow(c, p.dir, L.cs * 0.42, C.cyan)
    label(`k ${p.k.toFixed(2)}`, c.x, c.y + L.cs * 0.38, C.cyanHi, 8.5)
  }

  function drawMerge(cells, gx, gz, p) {
    const c = cellCenter(gx, gz), r = L.cs * 0.24
    drawArms(cells, gx, gz, p)
    ctx.fillStyle = C.body
    ctx.strokeStyle = p.sat ? C.red : C.cyan
    if (p.sat) { ctx.shadowColor = C.red; ctx.shadowBlur = 9 }
    ctx.lineWidth = 1.2
    ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, 7); ctx.fill(); ctx.stroke()
    ctx.shadowBlur = 0
    label('+', c.x, c.y + 0.5, p.sat ? C.red : C.cyanHi, 13)
    arrow(c, p.dir, L.cs * 0.44, p.sat ? C.red : C.cyan)
  }

  function drawRatio(cells, gx, gz, p) {
    const c = cellCenter(gx, gz), r = L.cs * 0.26
    const fs = feeders(cells, gx, gz)
    ctx.lineWidth = 2
    for (const f of fs) {
      const starve = f.q.out <= 0.05 && fs.some((o) => o.q.out > 0.05)
      ctx.strokeStyle = starve ? C.red : 'rgba(85,214,240,.4)'
      if (starve) { ctx.shadowColor = C.red; ctx.shadowBlur = 8 }
      line(edgeMid(gx, gz, (f.d + 2) & 3), c)
      ctx.shadowBlur = 0
    }
    ctx.strokeStyle = 'rgba(85,214,240,.4)'
    line(c, edgeMid(gx, gz, p.dir))
    ctx.fillStyle = C.body
    ctx.strokeStyle = C.cyan
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(c.x, c.y - r); ctx.lineTo(c.x + r, c.y); ctx.lineTo(c.x, c.y + r); ctx.lineTo(c.x - r, c.y)
    ctx.closePath(); ctx.fill(); ctx.stroke()
    label('MIN', c.x, c.y + 0.5, C.cyanHi, 7.5)
    arrow(c, p.dir, L.cs * 0.46, C.cyan)
  }

  function drawGate(cells, gx, gz, p, time) {
    const c = cellCenter(gx, gz), r = L.cs * 0.3
    const back = edgeMid(gx, gz, (p.dir + 2) & 3)
    const front = edgeMid(gx, gz, p.dir)
    // FLOW rail (broken when shut)
    ctx.lineWidth = 3
    ctx.strokeStyle = p.flow > 0.25 ? 'rgba(85,214,240,.75)' : 'rgba(85,214,240,.28)'
    line(back, { x: c.x - (c.x - back.x) * 0.55, y: c.y - (c.y - back.y) * 0.55 })
    ctx.strokeStyle = p.out > 0.25 ? 'rgba(85,214,240,.75)' : 'rgba(85,214,240,.28)'
    line({ x: c.x + (front.x - c.x) * 0.55, y: c.y + (front.y - c.y) * 0.55 }, front)
    // SENSE taps
    ctx.lineWidth = 1.5
    for (const f of feeders(cells, gx, gz)) {
      if (f.d === p.dir || f.d === ((p.dir + 2) & 3)) continue
      ctx.strokeStyle = 'rgba(85,214,240,.55)'
      const e = edgeMid(gx, gz, (f.d + 2) & 3)
      line(e, c)
      ctx.fillStyle = C.cyan
      ctx.beginPath(); ctx.arc((e.x + c.x) / 2, (e.y + c.y) / 2, 2, 0, 7); ctx.fill()
    }
    const flick = p.chatter && Math.sin(time * 42) > 0
    const col = p.chatter ? C.red : p.open ? C.cyanHi : C.cyanDk
    if (p.chatter) { ctx.shadowColor = C.red; ctx.shadowBlur = flick ? 12 : 3 }
    bodyRect(c, r * 2, r * 2, col)
    ctx.shadowBlur = 0
    // the blade: connected when open, broken diagonal when shut
    ctx.lineWidth = 2
    ctx.strokeStyle = flick ? C.red : p.open ? C.cyanHi : C.dim
    ctx.beginPath()
    if (p.open !== flick) {
      const [dx, dz] = DIRS[p.dir]
      ctx.moveTo(c.x - dx * r * 0.8, c.y - dz * r * 0.8)
      ctx.lineTo(c.x + dx * r * 0.8, c.y + dz * r * 0.8)
    } else {
      ctx.moveTo(c.x - r * 0.55, c.y + r * 0.55)
      ctx.lineTo(c.x + r * 0.55, c.y - r * 0.55)
    }
    ctx.stroke()
    label(`${p.mode} ${p.n.toFixed(1)}`, c.x, c.y + L.cs * 0.42, p.chatter ? C.red : C.cyanHi, 8.5)
    if (p.chatter && flick) label('CHATTER', c.x, c.y - L.cs * 0.42, C.red, 8)
  }

  function drawTank(cells, gx, gz, p, time) {
    const c = cellCenter(gx, gz)
    const w = L.cs * 0.56, h = L.cs * 0.7
    drawArms(cells, gx, gz, p)
    bodyRect(c, w, h, p.full ? C.red : C.cyan)
    const fh = (h - 4) * clamp(p.level / TANK_CAP, 0, 1)
    ctx.fillStyle = 'rgba(85,214,240,.55)'
    ctx.fillRect(c.x - w / 2 + 2, c.y + h / 2 - 2 - fh, w - 4, fh)
    if (p.full) {
      ctx.shadowColor = C.red; ctx.shadowBlur = Math.sin(time * 9) > 0 ? 10 : 4
      ctx.strokeStyle = C.red; ctx.lineWidth = 1.4
      ctx.strokeRect(c.x - w / 2, c.y - h / 2, w, h)
      ctx.shadowBlur = 0
      label('FULL', c.x, c.y - L.cs * 0.44, C.red, 8)
    } else if (p.level < 0.02 * TANK_CAP) {
      label('EMPTY', c.x, c.y - L.cs * 0.44, C.dim, 7.5)
    }
    arrow(c, p.dir, L.cs * 0.44, C.cyan)
    label(`⇣${p.drain.toFixed(1)}`, c.x, c.y + L.cs * 0.42, C.cyanHi, 8.5)
  }

  function drawDecay(cells, gx, gz, p) {
    const c = cellCenter(gx, gz)
    drawArms(cells, gx, gz, p)
    ctx.setLineDash([3, 3])
    ctx.strokeStyle = p.out > 0.2 ? 'rgba(85,214,240,.6)' : 'rgba(85,214,240,.25)'
    ctx.lineWidth = 3
    line(edgeMid(gx, gz, (p.dir + 2) & 3), edgeMid(gx, gz, p.dir))
    ctx.setLineDash([])
    label('×.85', c.x, c.y + L.cs * 0.4, C.dim2, 8)
    arrow(c, p.dir, L.cs * 0.46, C.cyanDk)
  }

  function drawSource(gx, gz, p, time) {
    const c = cellCenter(gx, gz)
    const s = SOURCES[p.src]
    const w = L.cs * 0.92, h = L.cs * 0.92
    bodyRect(c, w, h, C.cyanDk, C.panel)
    label(s.name, c.x, c.y - h * 0.3, C.cyan, 8)
    label(p.out.toFixed(1), c.x, c.y, C.cyanHi, 11)
    // mini output bar
    const bw = w * 0.72
    ctx.fillStyle = '#13202a'
    ctx.fillRect(c.x - bw / 2, c.y + h * 0.24, bw, 4)
    ctx.fillStyle = C.cyan
    ctx.fillRect(c.x - bw / 2, c.y + h * 0.24, bw * clamp(p.out / s.max, 0, 1), 4)
    // emitting shimmer toward the exit edge
    if (p.out > 0.2) {
      const k = frac(time * 1.2 + p.src * 0.31)
      ctx.fillStyle = C.cyanHi
      ctx.beginPath(); ctx.arc(c.x + w / 2 * (0.4 + 0.6 * k), c.y, 1.8, 0, 7); ctx.fill()
    }
  }

  function drawSocket(gx, gz, p, state) {
    const c = cellCenter(gx, gz)
    const pr = state.prog[state.puzzle]
    const pz = PUZZLES[state.puzzle]
    const w = L.cs * 0.94, h = L.cs * 0.94
    const col = pr.passed ? C.green : pr.ok ? C.green : Math.abs(pr.actual - pr.target) > pz.tol * 3 ? C.red : C.cyanDk
    bodyRect(c, w, h, col, C.panel)
    label(pz.key, c.x, c.y - h * 0.3, col === C.cyanDk ? C.cyan : col, 8)
    label(pr.actual.toFixed(1), c.x, c.y, C.cyanHi, 11)
    label(`→${pr.target.toFixed(1)}`, c.x, c.y + h * 0.28, C.dim2, 8)
  }

  /* ------------------------------ scope ------------------------------ */
  function drawScope(state) {
    const pz = PUZZLES[state.puzzle]
    const pr = state.prog[state.puzzle]
    ctx.fillStyle = C.panel
    ctx.strokeStyle = C.border
    ctx.lineWidth = 1
    ctx.fillRect(L.sx, L.sy, L.sw, L.sh)
    ctx.strokeRect(L.sx, L.sy, L.sw, L.sh)

    const infoW = Math.min(150, L.sw * 0.28)
    label(`CONTRACT ${state.puzzle + 1} · ${pz.key}`, L.sx + 10, L.sy + 14, C.text, 10, 'left')
    // wrap brief
    ctx.font = '600 8.5px ui-monospace, Menlo, monospace'
    const words = pz.brief.split(' ')
    let lineTxt = '', ly = L.sy + 28
    ctx.fillStyle = C.dim2
    ctx.textAlign = 'left'
    for (const wd of words) {
      const t2 = lineTxt ? lineTxt + ' ' + wd : wd
      if (ctx.measureText(t2).width > infoW - 16 && lineTxt) {
        ctx.fillText(lineTxt, L.sx + 10, ly); ly += 11; lineTxt = wd
      } else lineTxt = t2
    }
    ctx.fillText(lineTxt, L.sx + 10, ly)
    label(`OUT ${pr.actual.toFixed(2)}`, L.sx + 10, L.sy + L.sh - 34, C.cyanHi, 9.5, 'left')
    label(`TGT ${pr.target.toFixed(2)} ±${pz.tol}`, L.sx + 10, L.sy + L.sh - 21, C.dim2, 9, 'left')
    if (pr.passed) label('PASSED ✓', L.sx + 10, L.sy + L.sh - 8, C.green, 9.5, 'left')
    else label(`HOLD ${pr.hold.toFixed(1)}/${PASS_HOLD}s`, L.sx + 10, L.sy + L.sh - 8, pr.ok ? C.green : C.dim, 9, 'left')

    const px0 = L.sx + infoW, pw = L.sw - infoW - 8
    const py0 = L.sy + 6, ph = L.sh - 12 - 7
    const vmax = 13
    const Y = (v) => py0 + ph - clamp(v / vmax, 0, 1) * ph
    const n = pr.count
    if (n > 1) {
      const step = pw / (SCOPE_N - 1)
      const X = (k) => px0 + pw - (n - 1 - k) * step
      const at = (arr, k) => arr[(pr.si - n + k + SCOPE_N) % SCOPE_N]
      // tolerance band
      ctx.beginPath()
      for (let k = 0; k < n; k++) ctx.lineTo(X(k), Y(at(pr.sT, k) + pz.tol))
      for (let k = n - 1; k >= 0; k--) ctx.lineTo(X(k), Y(at(pr.sT, k) - pz.tol))
      ctx.closePath()
      ctx.fillStyle = 'rgba(85,214,240,.10)'
      ctx.fill()
      // target centerline
      ctx.beginPath()
      for (let k = 0; k < n; k++) ctx.lineTo(X(k), Y(at(pr.sT, k)))
      ctx.strokeStyle = 'rgba(85,214,240,.35)'
      ctx.lineWidth = 1
      ctx.stroke()
      // actual — cyan, with out-of-tolerance stretches struck red
      ctx.beginPath()
      for (let k = 0; k < n; k++) ctx.lineTo(X(k), Y(at(pr.sA, k)))
      ctx.strokeStyle = C.cyanHi
      ctx.lineWidth = 1.6
      ctx.stroke()
      ctx.beginPath()
      let pen = false
      for (let k = 0; k < n; k++) {
        const bad = Math.abs(at(pr.sA, k) - at(pr.sT, k)) > pz.tol
        if (bad) { if (!pen) ctx.moveTo(X(k), Y(at(pr.sA, k))); else ctx.lineTo(X(k), Y(at(pr.sA, k))); pen = true }
        else pen = false
      }
      ctx.strokeStyle = C.red
      ctx.lineWidth = 1.6
      ctx.stroke()
    }
    // pass-progress bar along the bottom of the plot
    const bw = pw
    ctx.fillStyle = '#141c22'
    ctx.fillRect(px0, L.sy + L.sh - 9, bw, 4)
    ctx.fillStyle = pr.passed ? C.green : 'rgba(159,214,90,.8)'
    ctx.fillRect(px0, L.sy + L.sh - 9, bw * (pr.passed ? 1 : pr.hold / PASS_HOLD), 4)
  }

  /* ------------------------------ draw ------------------------------ */
  function draw(state, time, ui) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = C.bg
    ctx.fillRect(0, 0, W, H)

    // grid
    ctx.lineWidth = 1
    for (let gx = 0; gx <= GW; gx++) {
      ctx.strokeStyle = C.grid
      ctx.beginPath()
      ctx.moveTo(L.bx + gx * L.cs + 0.5, L.by)
      ctx.lineTo(L.bx + gx * L.cs + 0.5, L.by + GH * L.cs)
      ctx.stroke()
    }
    for (let gz = 0; gz <= GH; gz++) {
      ctx.strokeStyle = C.grid
      ctx.beginPath()
      ctx.moveTo(L.bx, L.by + gz * L.cs + 0.5)
      ctx.lineTo(L.bx + GW * L.cs, L.by + gz * L.cs + 0.5)
      ctx.stroke()
    }
    ctx.strokeStyle = C.gridB
    ctx.strokeRect(L.bx + 0.5, L.by + 0.5, GW * L.cs, GH * L.cs)

    const board = state.boards[state.puzzle]
    const cells = board.cells

    // trace-run preview while dragging
    if (ui.dragPath) {
      ctx.fillStyle = 'rgba(85,214,240,.14)'
      for (const [gx, gz] of ui.dragPath) ctx.fillRect(L.bx + gx * L.cs + 1, L.by + gz * L.cs + 1, L.cs - 2, L.cs - 2)
    }
    // hover ghost for placement tools
    if (ui.hover && ui.tool !== 'select' && ui.tool !== 'erase' && !ui.dragPath) {
      const free = !cells[ixOf(ui.hover.gx, ui.hover.gz)]
      ctx.fillStyle = free ? 'rgba(85,214,240,.10)' : 'rgba(217,107,107,.12)'
      ctx.fillRect(L.bx + ui.hover.gx * L.cs + 1, L.by + ui.hover.gz * L.cs + 1, L.cs - 2, L.cs - 2)
      if (free && ui.tool !== 'trace') arrow(cellCenter(ui.hover.gx, ui.hover.gz), ui.toolDir, L.cs * 0.34, 'rgba(85,214,240,.5)')
    }

    // parts — traces beneath, bodies above
    for (let gz = 0; gz < GH; gz++) for (let gx = 0; gx < GW; gx++) {
      const p = cells[ixOf(gx, gz)]
      if (p && p.type === 'trace') drawTrace(cells, gx, gz, p, time)
    }
    for (let gz = 0; gz < GH; gz++) for (let gx = 0; gx < GW; gx++) {
      const p = cells[ixOf(gx, gz)]
      if (!p || p.type === 'trace') continue
      switch (p.type) {
        case 'source': drawSource(gx, gz, p, time); break
        case 'socket': drawSocket(gx, gz, p, state); break
        case 'valve': drawValve(cells, gx, gz, p); break
        case 'merge': drawMerge(cells, gx, gz, p); break
        case 'ratio': drawRatio(cells, gx, gz, p); break
        case 'gate': drawGate(cells, gx, gz, p, time); break
        case 'tank': drawTank(cells, gx, gz, p, time); break
        case 'decay': drawDecay(cells, gx, gz, p); break
      }
    }

    // CONFUSED overlay: cycles carry 0 and flash red — the failure IS the dialog
    for (let gz = 0; gz < GH; gz++) for (let gx = 0; gx < GW; gx++) {
      const p = cells[ixOf(gx, gz)]
      if (!p || !p.confused) continue
      const on = (time % 0.7) < 0.42
      ctx.strokeStyle = on ? C.red : 'rgba(217,107,107,.35)'
      ctx.lineWidth = 1.4
      ctx.strokeRect(L.bx + gx * L.cs + 2, L.by + gz * L.cs + 2, L.cs - 4, L.cs - 4)
      if (on) label('CONFUSED', L.bx + (gx + 0.5) * L.cs, L.by + gz * L.cs + 7, C.red, 6.5)
    }

    // selection
    if (ui.sel) {
      const { gx, gz } = ui.sel
      ctx.setLineDash([4, 3])
      ctx.strokeStyle = '#e6edf1'
      ctx.lineWidth = 1.2
      ctx.strokeRect(L.bx + gx * L.cs + 1.5, L.by + gz * L.cs + 1.5, L.cs - 3, L.cs - 3)
      ctx.setLineDash([])
      if (ui.tuneVal != null) {
        const c = cellCenter(gx, gz)
        ctx.fillStyle = C.panel
        ctx.strokeStyle = C.cyan
        ctx.fillRect(c.x - 26, c.y - L.cs * 0.5 - 22, 52, 16)
        ctx.strokeRect(c.x - 26, c.y - L.cs * 0.5 - 22, 52, 16)
        label(ui.tuneVal, c.x, c.y - L.cs * 0.5 - 14, C.cyanHi, 9.5)
      }
    }

    drawScope(state)
  }

  return { resize, draw, cellAt, cellCenter }
}
