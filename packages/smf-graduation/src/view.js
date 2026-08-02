/* =====================================================================
   SMF 00 — GRADUATION · view layer
   Canvas 2D only. Reads the sim each frame, owns zero game state.
   Tokens are derived from the sim clock, never simulated.
   Two-color law: amber = matter, cyan = signal/echo,
   green = valid/success, red = fault.
   ===================================================================== */

import {
  GW, GH, T_GROUND, T_ROCK, T_ORE, T_DEPOT,
  ORE_RESERVE, COSTS, STAMP_COST,
} from './sim.js'

const C = {
  bg: '#0b0e11', board: '#0d1216', grid: '#151d23', frame: '#1e2a32',
  rock: '#131a20', rockEdge: '#202c35',
  ore: '224,151,58',          // rgb triplet, alpha applied per reserve
  ext: '#c8781e', extCore: '#7c4a13',
  fur: '#b05537', furCore: '#6e3520',
  ingot: '#e6c15a',
  cyan: '#55d6f0', green: '#9fd65a', red: '#d96b6b',
  dim: '#566068', link: 'rgba(224,151,58,0.45)', linkDead: 'rgba(86,96,104,0.35)',
}

export function createView(canvas) {
  const ctx = canvas.getContext('2d')
  const V = {
    hover: null,          // {gx,gz} | null — set by the shell
    panelW: 332,
    cell: 24, ox: 0, oz: 0, dpr: 1,
    resize, draw, cellAt, cellRect,
  }

  function resize() {
    V.dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.max(1, Math.floor(canvas.clientWidth * V.dpr))
    canvas.height = Math.max(1, Math.floor(canvas.clientHeight * V.dpr))
    layout()
  }
  function layout() {
    const w = canvas.clientWidth - V.panelW, h = canvas.clientHeight
    V.cell = Math.max(8, Math.floor(Math.min((w - 28) / GW, (h - 28) / GH)))
    V.ox = Math.floor((w - V.cell * GW) / 2)
    V.oz = Math.floor((h - V.cell * GH) / 2)
  }
  function cellAt(px, py) {
    const gx = Math.floor((px - V.ox) / V.cell)
    const gz = Math.floor((py - V.oz) / V.cell)
    return gx >= 0 && gx < GW && gz >= 0 && gz < GH ? { gx, gz } : null
  }
  function cellRect(gx, gz) {
    return { x: V.ox + gx * V.cell, y: V.oz + gz * V.cell, w: V.cell, h: V.cell }
  }
  const cx = (gx) => V.ox + gx * V.cell + V.cell / 2
  const cz = (gz) => V.oz + gz * V.cell + V.cell / 2

  function drawExtractor(x, y, k, ghost) {
    const p = k * 0.16, s = k - 2 * p
    if (ghost) {
      ctx.strokeRect(x + p, y + p, s, s)
      ctx.beginPath(); ctx.arc(x + k / 2, y + k / 2, s * 0.26, 0, Math.PI * 2); ctx.stroke()
      return
    }
    ctx.fillStyle = C.ext
    ctx.fillRect(x + p, y + p, s, s)
    ctx.fillStyle = C.extCore
    ctx.beginPath(); ctx.arc(x + k / 2, y + k / 2, s * 0.26, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = C.ingot
    ctx.fillRect(x + k / 2 - 1, y + k / 2 - 1, 2, 2)
  }
  function drawFurnace(x, y, k, ghost, hot) {
    const p = k * 0.16, s = k - 2 * p
    if (ghost) {
      ctx.strokeRect(x + p, y + p, s, s)
      ctx.beginPath()
      ctx.moveTo(x + k / 2 - s * 0.22, y + p + s * 0.7)
      ctx.lineTo(x + k / 2, y + p + s * 0.28)
      ctx.lineTo(x + k / 2 + s * 0.22, y + p + s * 0.7)
      ctx.stroke()
      return
    }
    ctx.fillStyle = C.fur
    ctx.fillRect(x + p, y + p, s, s)
    ctx.fillStyle = C.furCore
    ctx.beginPath()
    ctx.moveTo(x + k / 2 - s * 0.24, y + p + s * 0.72)
    ctx.lineTo(x + k / 2, y + p + s * 0.24)
    ctx.lineTo(x + k / 2 + s * 0.24, y + p + s * 0.72)
    ctx.closePath(); ctx.fill()
    if (hot) {
      ctx.fillStyle = C.ingot
      ctx.globalAlpha *= 0.85
      ctx.fillRect(x + k / 2 - 1.5, y + p - 2, 3, 3)
      ctx.globalAlpha /= 0.85
    }
  }

  function draw(sim) {
    const s = sim.state
    const k = V.cell
    ctx.setTransform(V.dpr, 0, 0, V.dpr, 0, 0)
    ctx.fillStyle = C.bg
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)

    // board underlay + frame
    ctx.fillStyle = C.board
    ctx.fillRect(V.ox, V.oz, k * GW, k * GH)

    // terrain
    let depotMin = null, depotMax = null
    for (let gz = 0; gz < GH; gz++) {
      for (let gx = 0; gx < GW; gx++) {
        const ix = gx + gz * GW, t = s.terrain[ix]
        if (t === T_GROUND) continue
        const x = V.ox + gx * k, y = V.oz + gz * k
        if (t === T_ROCK) {
          ctx.fillStyle = C.rock
          ctx.fillRect(x, y, k, k)
          ctx.strokeStyle = C.rockEdge
          ctx.lineWidth = 1
          ctx.strokeRect(x + 1.5, y + 1.5, k - 3, k - 3)
          ctx.globalAlpha = 0.3
          ctx.beginPath(); ctx.moveTo(x + 2, y + k - 2); ctx.lineTo(x + k - 2, y + 2); ctx.stroke()
          ctx.globalAlpha = 1
        } else if (t === T_ORE) {
          const fr = s.reserve[ix] / ORE_RESERVE
          ctx.fillStyle = `rgba(${C.ore},${(0.10 + 0.38 * fr).toFixed(3)})`
          ctx.fillRect(x, y, k, k)
          const p = k * 0.28
          ctx.fillStyle = `rgba(${C.ore},${(0.16 + 0.42 * fr).toFixed(3)})`
          ctx.fillRect(x + p, y + p, k - 2 * p, k - 2 * p)
          if (fr <= 0) {
            ctx.strokeStyle = C.dim
            ctx.globalAlpha = 0.5
            ctx.beginPath(); ctx.moveTo(x + 3, y + 3); ctx.lineTo(x + k - 3, y + k - 3); ctx.stroke()
            ctx.globalAlpha = 1
          }
        } else if (t === T_DEPOT) {
          if (!depotMin) { depotMin = [gx, gz]; depotMax = [gx, gz] }
          depotMin = [Math.min(depotMin[0], gx), Math.min(depotMin[1], gz)]
          depotMax = [Math.max(depotMax[0], gx), Math.max(depotMax[1], gz)]
        }
      }
    }

    // grid hairlines
    ctx.strokeStyle = C.grid
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.6
    ctx.beginPath()
    for (let gx = 0; gx <= GW; gx++) {
      ctx.moveTo(V.ox + gx * k + 0.5, V.oz)
      ctx.lineTo(V.ox + gx * k + 0.5, V.oz + GH * k)
    }
    for (let gz = 0; gz <= GH; gz++) {
      ctx.moveTo(V.ox, V.oz + gz * k + 0.5)
      ctx.lineTo(V.ox + GW * k, V.oz + gz * k + 0.5)
    }
    ctx.stroke()
    ctx.globalAlpha = 1
    ctx.strokeStyle = C.frame
    ctx.strokeRect(V.ox + 0.5, V.oz + 0.5, k * GW, k * GH)

    // depot
    let dpx = V.ox + GW * k, dpy = V.oz + GH * k / 2
    if (depotMin) {
      const x = V.ox + depotMin[0] * k, y = V.oz + depotMin[1] * k
      const w = (depotMax[0] - depotMin[0] + 1) * k, h = (depotMax[1] - depotMin[1] + 1) * k
      dpx = x + w / 2; dpy = y + h / 2
      ctx.fillStyle = '#191410'
      ctx.fillRect(x, y, w, h)
      ctx.strokeStyle = `rgba(${C.ore},0.9)`
      ctx.lineWidth = 1.5
      ctx.strokeRect(x + 1, y + 1, w - 2, h - 2)
      ctx.save()
      ctx.translate(x + w / 2, y + h / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.fillStyle = `rgba(${C.ore},0.9)`
      ctx.font = `700 ${Math.max(8, k * 0.3)}px ui-monospace, Menlo, monospace`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText('DEPOT', 0, 0)
      ctx.restore()
    }

    // line links
    ctx.lineWidth = 2
    for (const L of s.lines) {
      ctx.strokeStyle = L.dead ? C.linkDead : C.link
      ctx.beginPath()
      ctx.moveTo(cx(L.gx), cz(L.gz))
      ctx.lineTo(cx(L.fgx), cz(L.fgz))
      ctx.stroke()
    }

    // ingot tokens: furnace -> depot, positions pure functions of sim time
    const perLine = s.lines.length > 18 ? 2 : 3
    const spd = 3.2 * k // px per sim-second
    ctx.fillStyle = C.ingot
    let tok = 0
    for (const L of s.lines) {
      if (L.dead || tok > 60) continue
      const x0 = cx(L.fgx), y0 = cz(L.fgz)
      const dx = dpx - x0, dy = dpy - y0
      const len = Math.hypot(dx, dy) || 1
      const per = len / spd
      for (let i = 0; i < perLine; i++) {
        const f = ((s.t / per) + i / perLine + L.id * 0.618) % 1
        ctx.globalAlpha = 0.75 * Math.min(1, 6 * Math.min(f, 1 - f) + 0.25)
        ctx.fillRect(x0 + dx * f - 1.5, y0 + dy * f - 1.5, 3, 3)
        tok++
      }
    }
    ctx.globalAlpha = 1

    // buildings
    const activeIds = new Set()
    for (const L of s.lines) if (!L.dead) { activeIds.add(L.ext); activeIds.add(L.fur) }
    for (const b of s.buildings) {
      const x = V.ox + b.gx * k, y = V.oz + b.gz * k
      const idle = !b.pair
      ctx.globalAlpha = idle ? 0.55 : 1
      if (b.kind === 'extractor') drawExtractor(x, y, k, false)
      else drawFurnace(x, y, k, false, activeIds.has(b.id))
      ctx.globalAlpha = 1
      if (b.stamped) { // echo provenance tick — cyan = signal layer
        ctx.fillStyle = C.cyan
        ctx.fillRect(x + 2, y + 2, 3, 3)
      }
    }

    // fx — transient, keyed to sim time so pause freezes them
    const fx = s.fx
    if (fx.line) {
      const a = (s.t - fx.line.t) / 0.7
      if (a < 1) {
        ctx.strokeStyle = C.green
        ctx.globalAlpha = (1 - a) * 0.8
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(cx(fx.line.gx), cz(fx.line.gz))
        ctx.lineTo(cx(fx.line.fgx), cz(fx.line.fgz))
        ctx.stroke()
        ctx.globalAlpha = 1
      }
    }
    if (fx.stamp) {
      const a = (s.t - fx.stamp.t) / 0.8
      if (a < 1) {
        ctx.strokeStyle = C.cyan
        ctx.globalAlpha = (1 - a) * 0.7
        ctx.lineWidth = 2
        const mx = (cx(fx.stamp.gx) + cx(fx.stamp.fgx)) / 2
        const my = (cz(fx.stamp.gz) + cz(fx.stamp.fgz)) / 2
        ctx.beginPath(); ctx.arc(mx, my, k * (0.5 + a * 2.0), 0, Math.PI * 2); ctx.stroke()
        ctx.globalAlpha = 1
      }
    }
    if (fx.reject) {
      const a = (s.t - fx.reject.t) / 0.6
      if (a < 1) {
        for (const c of fx.reject.cells) {
          const x = V.ox + c.gx * k, y = V.oz + c.gz * k
          ctx.globalAlpha = (1 - a) * (c.bad ? 0.45 : 0.2)
          ctx.fillStyle = c.bad ? C.red : C.dim
          ctx.fillRect(x, y, k, k)
          ctx.globalAlpha = 1
        }
      }
    }

    // ghost preview under the cursor
    if (V.hover) drawGhost(sim, s, k)
  }

  // cell tint: red = terrain fault, green = valid, amber = valid but unaffordable
  const GHOST = {
    ok: { fill: 'rgba(159,214,90,0.18)', stroke: C.green },
    bad: { fill: 'rgba(217,107,107,0.28)', stroke: C.red },
    poor: { fill: 'rgba(224,151,58,0.16)', stroke: '#e0973a' },
  }
  const ghostStyle = (err, afford) => (err ? GHOST.bad : afford ? GHOST.ok : GHOST.poor)

  function drawGhost(sim, s, k) {
    const { gx, gz } = V.hover
    ctx.lineWidth = 1.5
    if (s.tool === 'echo' && s.echo.unlocked) {
      const sc = sim.stampCells(gx, gz)
      const afford = s.matter >= STAMP_COST
      const cells = [
        { c: sc.ext, kind: 'extractor', st: ghostStyle(sc.ext.err, afford) },
        { c: sc.fur, kind: 'furnace', st: ghostStyle(sc.fur.err, afford) },
      ]
      // blueprint frame — cyan dashed bbox around the whole pattern
      const x0 = Math.min(sc.ext.gx, sc.fur.gx) * k + V.ox
      const y0 = Math.min(sc.ext.gz, sc.fur.gz) * k + V.oz
      const x1 = (Math.max(sc.ext.gx, sc.fur.gx) + 1) * k + V.ox
      const y1 = (Math.max(sc.ext.gz, sc.fur.gz) + 1) * k + V.oz
      ctx.setLineDash([4, 3])
      ctx.strokeStyle = C.cyan
      ctx.globalAlpha = 0.8
      ctx.strokeRect(x0 - 2.5, y0 - 2.5, x1 - x0 + 5, y1 - y0 + 5)
      ctx.setLineDash([])
      for (const { c, kind, st } of cells) {
        const x = V.ox + c.gx * k, y = V.oz + c.gz * k
        ctx.fillStyle = st.fill
        ctx.fillRect(x, y, k, k)
        ctx.strokeStyle = st.stroke
        ctx.strokeRect(x + 1, y + 1, k - 2, k - 2)
        ctx.globalAlpha = 0.75
        if (kind === 'extractor') drawExtractor(x, y, k, true)
        else drawFurnace(x, y, k, true)
        ctx.globalAlpha = 1
      }
      ctx.globalAlpha = 1
    } else if (s.tool === 'extractor' || s.tool === 'furnace') {
      const st = ghostStyle(sim.canPlace(s.tool, gx, gz), s.matter >= COSTS[s.tool])
      const x = V.ox + gx * k, y = V.oz + gz * k
      ctx.fillStyle = st.fill
      ctx.fillRect(x, y, k, k)
      ctx.strokeStyle = st.stroke
      ctx.strokeRect(x + 1, y + 1, k - 2, k - 2)
      ctx.globalAlpha = 0.7
      if (s.tool === 'extractor') drawExtractor(x, y, k, true)
      else drawFurnace(x, y, k, true)
      ctx.globalAlpha = 1
    }
  }

  return V
}
