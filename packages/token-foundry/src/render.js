// render.js — canvas drawing. Reads game + view state, never mutates the sim.
import { TILE, GRID_W, GRID_H, DX, DY, ITEMS, BUILDINGS } from './data.js'
import { footprint, outputCell, canPlace, center } from './sim.js'

export function makeView() {
  return { x: GRID_W * TILE * 0.5, y: GRID_H * TILE * 0.42, zoom: 1, powerOverlay: false }
}

export function screenToTile(view, canvas, sx, sy) {
  const wx = (sx - canvas.clientWidth / 2) / view.zoom + view.x
  const wy = (sy - canvas.clientHeight / 2) / view.zoom + view.y
  return [Math.floor(wx / TILE), Math.floor(wy / TILE)]
}

export function draw(g, view, canvas, ctx, ui) {
  const dpr = window.devicePixelRatio || 1
  const W = canvas.clientWidth, H = canvas.clientHeight
  if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
    canvas.width = W * dpr
    canvas.height = H * dpr
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.fillStyle = '#0b0e13'
  ctx.fillRect(0, 0, W, H)
  ctx.save()
  ctx.translate(W / 2, H / 2)
  ctx.scale(view.zoom, view.zoom)
  ctx.translate(-view.x, -view.y)

  const t = performance.now() / 1000

  // world bounds + grid
  ctx.fillStyle = '#10141c'
  ctx.fillRect(0, 0, GRID_W * TILE, GRID_H * TILE)
  ctx.strokeStyle = 'rgba(255,255,255,0.03)'
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let x = 0; x <= GRID_W; x++) { ctx.moveTo(x * TILE, 0); ctx.lineTo(x * TILE, GRID_H * TILE) }
  for (let y = 0; y <= GRID_H; y++) { ctx.moveTo(0, y * TILE); ctx.lineTo(GRID_W * TILE, y * TILE) }
  ctx.stroke()
  ctx.strokeStyle = 'rgba(120,160,255,0.25)'
  ctx.strokeRect(0, 0, GRID_W * TILE, GRID_H * TILE)

  // power / cooling coverage overlay
  const showPower = view.powerOverlay || (ui.tool && (BUILDINGS[ui.tool]?.r || BUILDINGS[ui.tool]?.coolR))
  if (showPower) {
    for (const b of g.buildings.values()) {
      const def = BUILDINGS[b.type]
      const [cx, cy] = center(b)
      if (def.r) {
        ctx.fillStyle = 'rgba(255,220,80,0.06)'
        ctx.strokeStyle = 'rgba(255,220,80,0.25)'
        ctx.beginPath()
        ctx.arc(cx * TILE, cy * TILE, def.r * TILE, 0, Math.PI * 2)
        ctx.fill(); ctx.stroke()
      }
      if (def.coolR) {
        ctx.fillStyle = 'rgba(80,200,255,0.05)'
        ctx.strokeStyle = 'rgba(80,200,255,0.25)'
        ctx.beginPath()
        ctx.arc(cx * TILE, cy * TILE, def.coolR * TILE, 0, Math.PI * 2)
        ctx.fill(); ctx.stroke()
      }
    }
  }

  // belts
  const chev = (t * 3.3) % 1
  for (const [i, cell] of g.belts) {
    const x = (i % GRID_W) * TILE, y = ((i / GRID_W) | 0) * TILE
    ctx.fillStyle = '#232a33'
    ctx.fillRect(x + 2, y + 2, TILE - 4, TILE - 4)
    // animated chevrons
    ctx.save()
    ctx.translate(x + TILE / 2, y + TILE / 2)
    ctx.rotate(cell.d * Math.PI / 2)
    ctx.strokeStyle = 'rgba(140,160,180,0.5)'
    ctx.lineWidth = 2
    for (let k = 0; k < 2; k++) {
      const off = ((chev + k * 0.5) % 1) * TILE - TILE / 2
      ctx.beginPath()
      ctx.moveTo(off - 4, -6)
      ctx.lineTo(off + 2, 0)
      ctx.lineTo(off - 4, 6)
      ctx.stroke()
    }
    ctx.restore()
    if (cell.item) drawItem(ctx, cell.item, x + TILE / 2, y + TILE / 2)
  }

  // buildings
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (const b of g.buildings.values()) {
    drawBuilding(ctx, g, b, ui.selected === b.id)
  }

  // ghost
  if (ui.tool && ui.hover) {
    const [hx, hy] = ui.hover
    const ok = canPlace(g, ui.tool, hx, hy)
    const def = BUILDINGS[ui.tool]
    const [w, h] = footprint(ui.tool)
    ctx.globalAlpha = 0.5
    ctx.fillStyle = ok ? (def.color || '#3a4149') : '#7a2e2e'
    ctx.fillRect(hx * TILE + 2, hy * TILE + 2, w * TILE - 4, h * TILE - 4)
    if (ui.tool === 'belt') {
      ctx.save()
      ctx.translate(hx * TILE + TILE / 2, hy * TILE + TILE / 2)
      ctx.rotate(ui.dir * Math.PI / 2)
      ctx.strokeStyle = '#dfe7ef'
      ctx.lineWidth = 3
      ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(8, 0); ctx.lineTo(3, -5)
      ctx.moveTo(8, 0); ctx.lineTo(3, 5); ctx.stroke()
      ctx.restore()
    } else if (def.glyph) {
      ctx.font = `${Math.min(w, h) * TILE * 0.5}px serif`
      ctx.fillStyle = '#fff'
      ctx.fillText(def.glyph, hx * TILE + w * TILE / 2, hy * TILE + h * TILE / 2)
      // output arrow
      const fake = { type: ui.tool, x: hx, y: hy, dir: ui.dir }
      drawPortArrow(ctx, fake, '#dfe7ef')
    }
    if ((def.r || def.coolR) && ok) {
      const r = (def.r || def.coolR) * TILE
      ctx.strokeStyle = def.coolR ? 'rgba(80,200,255,0.6)' : 'rgba(255,220,80,0.6)'
      ctx.beginPath()
      ctx.arc(hx * TILE + w * TILE / 2, hy * TILE + h * TILE / 2, r, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  }

  ctx.restore()
}

function drawItem(ctx, item, cx, cy) {
  const def = ITEMS[item.t]
  ctx.fillStyle = def ? def.color : '#fff'
  ctx.strokeStyle = 'rgba(0,0,0,0.6)'
  ctx.lineWidth = 1.5
  const s = 6.5
  ctx.beginPath()
  ctx.moveTo(cx, cy - s); ctx.lineTo(cx + s, cy); ctx.lineTo(cx, cy + s); ctx.lineTo(cx - s, cy)
  ctx.closePath()
  ctx.fill(); ctx.stroke()
  if (item.depth) {
    ctx.fillStyle = '#ff8a65'
    for (let i = 0; i < item.depth; i++) {
      ctx.fillRect(cx - 5 + i * 4, cy - s - 4, 3, 3)
    }
  }
}

function drawPortArrow(ctx, b, color) {
  const [ox, oy] = outputCell(b)
  const [w, h] = footprint(b.type)
  const fx = b.x * TILE + w * TILE / 2, fy = b.y * TILE + h * TILE / 2
  const tx = ox * TILE + TILE / 2, ty = oy * TILE + TILE / 2
  const mx = fx + (tx - fx) * 0.78, my = fy + (ty - fy) * 0.78
  const ang = Math.atan2(ty - fy, tx - fx)
  ctx.save()
  ctx.translate(mx, my)
  ctx.rotate(ang)
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(6, 0); ctx.lineTo(-4, -6); ctx.lineTo(-4, 6)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawBuilding(ctx, g, b, selected) {
  const def = BUILDINGS[b.type]
  const [w, h] = footprint(b.type)
  const x = b.x * TILE, y = b.y * TILE
  ctx.fillStyle = def.color
  roundRect(ctx, x + 2, y + 2, w * TILE - 4, h * TILE - 4, 5)
  ctx.fill()
  ctx.strokeStyle = selected ? '#ffd54f' : 'rgba(255,255,255,0.15)'
  ctx.lineWidth = selected ? 2.5 : 1
  roundRect(ctx, x + 2, y + 2, w * TILE - 4, h * TILE - 4, 5)
  ctx.stroke()
  if (def.glyph) {
    ctx.font = `${Math.min(w, h) * TILE * 0.48}px serif`
    ctx.fillText(def.glyph, x + w * TILE / 2, y + h * TILE / 2 - (def.gpu || w > 1 ? 3 : 0))
  }
  // output port arrow for producers
  if (!['egress', 'trainer', 'gas', 'nuke', 'pylon', 'cool'].includes(b.type)) {
    drawPortArrow(ctx, b, 'rgba(255,255,255,0.75)')
  }
  // status: unpowered / hot
  const draw = def.gpu || def.power > 0
  if (draw && (!b.powered || b.sat < 0.999)) {
    ctx.font = '11px sans-serif'
    ctx.fillStyle = '#ff5252'
    ctx.fillText(b.powered ? '⚠︎⚡' : '✕⚡', x + w * TILE - 10, y + 9)
  }
  if (def.gpu && !b.cooled) {
    ctx.font = '11px sans-serif'
    ctx.fillText('🔥', x + 10, y + 9)
  }
  // utilization bar for GPU pods + decode batch pips
  if (def.gpu && w > 1) {
    ctx.fillStyle = 'rgba(0,0,0,0.45)'
    ctx.fillRect(x + 5, y + h * TILE - 9, w * TILE - 10, 5)
    ctx.fillStyle = b.util > 0.85 ? '#69f0ae' : b.util > 0.3 ? '#ffd54f' : '#607080'
    ctx.fillRect(x + 5, y + h * TILE - 9, (w * TILE - 10) * Math.min(1, b.util), 5)
  }
  if (b.type === 'decode' && b.seqs) {
    ctx.fillStyle = '#b388ff'
    const n = Math.min(b.seqs.length, 12)
    for (let i = 0; i < n; i++) {
      ctx.fillRect(x + 6 + (i % 6) * 6, y + h * TILE - 17 + Math.floor(i / 6) * -6, 4, 4)
    }
  }
  if (b.type === 'trainer') {
    // research progress ring is in the panel; show a pulsing glow while training
    if (b.util > 0) {
      ctx.strokeStyle = `rgba(129,199,132,${0.4 + 0.3 * Math.sin(performance.now() / 300)})`
      ctx.lineWidth = 2
      roundRect(ctx, x + 4, y + 4, w * TILE - 8, h * TILE - 8, 5)
      ctx.stroke()
    }
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}
