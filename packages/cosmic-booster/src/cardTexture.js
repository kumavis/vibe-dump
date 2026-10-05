import * as THREE from 'three'
import { RARITY, SET_NAME, SET_SERIES, SET_SIZE } from './cards.js'

// Card faces are typeset on a canvas in "design units" (1000 x 1400, a 63x88mm
// card) and uploaded as two textures: the printed frame (transparent where the
// live art shows through) and a mask the card shader reads as
//   R = metal border, G = foil-stamped type, B = holographic area.

export const CARD_W = 1000
export const CARD_H = 1400
const TEX = 1.024 // design unit -> texel
const MASK = 0.5 // the mask is smooth; half resolution is plenty

export const ART_FRAMED = { x: 44, y: 136, w: 912, h: 730 }
export const ART_FULL = { x: 0, y: 0, w: CARD_W, h: CARD_H }

const SANS = 'Jost, "Futura", "Century Gothic", "Avenir Next", sans-serif'
const SERIF = '"Cormorant Garamond", Garamond, "Times New Roman", serif'

const METALS = {
  silver: ['#80869a', '#eef1f8', '#979eb1', '#ffffff', '#737a8d'],
  gold: ['#94702f', '#fbe3a2', '#b38c3b', '#fff4cf', '#7f6026'],
  chrome: ['#1d1b2a', '#8c88b0', '#2c2940', '#cdc7f0', '#18161f'],
}

export function rarityMetal(rarity) {
  return rarity === 'rare' ? 'gold' : rarity === 'holo' ? 'chrome' : 'silver'
}

function makeCanvas(scale) {
  const c = document.createElement('canvas')
  c.width = Math.round(CARD_W * scale)
  c.height = Math.round(CARD_H * scale)
  const ctx = c.getContext('2d')
  ctx.scale(scale, scale)
  return { c, ctx }
}

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function hexRgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
function mixHex(a, b, t) {
  const A = hexRgb(a)
  const B = hexRgb(b)
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`
}
function rgba(hex, a) {
  return `rgba(${hexRgb(hex).join(',')},${a})`
}

function metalGradient(ctx, metal, x0, y0, x1, y1) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1)
  const stops = METALS[metal]
  stops.forEach((c, i) => g.addColorStop(i / (stops.length - 1), c))
  return g
}

// Letter-spaced text, drawn glyph by glyph so tracking works in every browser.
function tracked(ctx, text, x, y, tracking, align = 'left') {
  const chars = [...text]
  const widths = chars.map((ch) => ctx.measureText(ch).width)
  const total = widths.reduce((a, b) => a + b, 0) + tracking * (chars.length - 1)
  let cx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x
  const keep = ctx.textAlign
  ctx.textAlign = 'left'
  chars.forEach((ch, i) => {
    ctx.fillText(ch, cx, y)
    cx += widths[i] + tracking
  })
  ctx.textAlign = keep
  return total
}

function trackedWidth(ctx, text, tracking) {
  const chars = [...text]
  return chars.reduce((a, ch) => a + ctx.measureText(ch).width, 0) + tracking * (chars.length - 1)
}

// "1.5 r_s" -> r with a subscript s.
function valueText(ctx, text, x, y, size, align = 'right') {
  const parts = text.split(/_(\w)/)
  const fonts = parts.map((_, i) => (i % 2 ? `500 ${size * 0.62}px ${SANS}` : `500 ${size}px ${SANS}`))
  const widths = parts.map((p, i) => {
    ctx.font = fonts[i]
    return ctx.measureText(p).width
  })
  const total = widths.reduce((a, b) => a + b, 0)
  let cx = align === 'right' ? x - total : align === 'center' ? x - total / 2 : x
  const keep = ctx.textAlign
  ctx.textAlign = 'left'
  parts.forEach((p, i) => {
    ctx.font = fonts[i]
    ctx.fillText(p, cx, y + (i % 2 ? size * 0.22 : 0))
    cx += widths[i]
  })
  ctx.textAlign = keep
  return total
}

// Greedy wrap, then narrowed as far as it can go without adding a line, so
// the lines come out even instead of leaving a word dangling on the last.
function wrap(ctx, text, maxW) {
  const lines = greedy(ctx, text, maxW)
  if (lines.length < 2) return lines
  let lo = maxW / 2
  let hi = maxW
  while (hi - lo > 4) {
    const mid = (lo + hi) / 2
    if (greedy(ctx, text, mid).length > lines.length) lo = mid
    else hi = mid
  }
  return greedy(ctx, text, hi)
}

function greedy(ctx, text, maxW) {
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const w of words) {
    const next = line ? `${line} ${w}` : w
    if (ctx.measureText(next).width > maxW && line) {
      lines.push(line)
      line = w
    } else line = next
  }
  if (line) lines.push(line)
  return lines
}

function rng(seed) {
  let s = Math.floor(seed * 2 ** 31) || 1
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return ((s >>> 0) % 100000) / 100000
  }
}

// Fine engraved rosette, banknote style.
function guilloche(ctx, cx, cy, r0, r1, rings, lobes, color, alpha, width = 1) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.globalAlpha = alpha
  ctx.lineWidth = width
  for (let i = 0; i < rings; i++) {
    const R = r0 + ((r1 - r0) * i) / Math.max(rings - 1, 1)
    const amp = 5 + 5 * Math.sin(i * 0.7)
    ctx.beginPath()
    for (let k = 0; k <= 360; k++) {
      const th = (k / 360) * Math.PI * 2
      const r = R + amp * Math.sin(lobes * th + i * 0.42)
      const x = cx + Math.cos(th) * r
      const y = cy + Math.sin(th) * r
      k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
    }
    ctx.stroke()
  }
  ctx.restore()
}

function dust(ctx, rand, n, x, y, w, h, alpha) {
  ctx.save()
  for (let i = 0; i < n; i++) {
    const a = alpha * (0.25 + rand() * 0.75)
    ctx.fillStyle = `rgba(235,235,255,${a})`
    ctx.beginPath()
    ctx.arc(x + rand() * w, y + rand() * h, 0.5 + rand() * rand() * 1.8, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

function border(f, m, metal) {
  const { ctx } = f
  rr(ctx, 0, 0, CARD_W, CARD_H, 46)
  ctx.fillStyle = metalGradient(ctx, metal, 0, 0, CARD_W, CARD_H)
  ctx.fill()
  // a bevel: light top-left edge, dark bottom-right
  rr(ctx, 3, 3, CARD_W - 6, CARD_H - 6, 43)
  ctx.lineWidth = 2
  ctx.strokeStyle = 'rgba(255,255,255,.55)'
  ctx.stroke()
  rr(ctx, 18, 18, CARD_W - 36, CARD_H - 36, 30)
  ctx.lineWidth = 3
  ctx.strokeStyle = 'rgba(0,0,0,.5)'
  ctx.stroke()

  // metal only in the border band: the outer shape minus the inner panel
  m.ctx.save()
  rr(m.ctx, 0, 0, CARD_W, CARD_H, 46)
  m.ctx.fillStyle = '#f00'
  m.ctx.fill()
  rr(m.ctx, 20, 20, CARD_W - 40, CARD_H - 40, 30)
  m.ctx.fillStyle = '#000'
  m.ctx.fill()
  m.ctx.restore()
}

function footer(ctx, def, pull, metal, y = 1340) {
  const r = RARITY[def.rarity]
  ctx.font = `500 21px ${SANS}`
  ctx.fillStyle = metal === 'gold' ? '#f3d896' : metal === 'chrome' ? '#e9e4ff' : '#d9dce6'
  let label = `${r.glyph}  ${r.label.toUpperCase()}`
  if (pull.foil && def.rarity !== 'holo') label += '  ·  STARLIGHT'
  tracked(ctx, label, 66, y, 3.5)
  // a foil card's longer rarity label takes the set name's place
  if (!(pull.foil && def.rarity !== 'holo')) {
    ctx.font = `500 18px ${SANS}`
    ctx.fillStyle = '#8f8baa'
    tracked(ctx, `${SET_NAME.toUpperCase()}  ·  ${SET_SERIES.toUpperCase()}`, CARD_W / 2, y, 6, 'center')
  }
  ctx.font = `500 21px ${SANS}`
  ctx.fillStyle = '#bdb9d6'
  tracked(ctx, `${String(def.no).padStart(2, '0')} / ${SET_SIZE}`, CARD_W - 66, y, 2.5, 'right')
}

function title(f, m, def, metal, { x, y, size, maxW, tracking }) {
  const text = def.name.toUpperCase()
  let s = size
  f.ctx.font = `600 ${s}px ${SANS}`
  while (trackedWidth(f.ctx, text, tracking) > maxW && s > 20) {
    s -= 2
    f.ctx.font = `600 ${s}px ${SANS}`
  }
  f.ctx.fillStyle = metal === 'gold' ? '#f6dd9e' : metal === 'chrome' ? '#f3f0ff' : '#f2f3f8'
  f.ctx.save()
  f.ctx.shadowColor = 'rgba(0,0,0,.6)'
  f.ctx.shadowBlur = 8
  f.ctx.shadowOffsetY = 2
  tracked(f.ctx, text, x, y, tracking)
  f.ctx.restore()
  m.ctx.font = `600 ${s}px ${SANS}`
  m.ctx.fillStyle = '#0f0'
  tracked(m.ctx, text, x, y, tracking)
}

function framed(f, m, def, pull) {
  const { ctx } = f
  const metal = rarityMetal(def.rarity)
  const rand = rng(pull.seed + def.no * 0.0137)
  border(f, m, metal)

  // inner panel
  ctx.save()
  rr(ctx, 20, 20, CARD_W - 40, CARD_H - 40, 30)
  ctx.clip()
  const g = ctx.createLinearGradient(0, 20, 0, CARD_H)
  g.addColorStop(0, mixHex(def.accent, '#0c0b1a', 0.8))
  g.addColorStop(0.45, mixHex(def.accent, '#0a0916', 0.9))
  g.addColorStop(1, '#06050d')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, CARD_W, CARD_H)
  guilloche(ctx, CARD_W / 2, 1160, 90, 520, 34, 9, def.accent, 0.07)
  guilloche(ctx, CARD_W / 2, 60, 40, 300, 16, 12, def.accent, 0.05)
  dust(ctx, rand, 420, 20, 20, CARD_W - 40, CARD_H - 40, 0.35)
  ctx.restore()

  // title row
  title(f, m, def, metal, { x: 60, y: 108, size: 50, maxW: 740, tracking: 5 })
  ctx.font = `500 25px ${SANS}`
  ctx.fillStyle = rgba(def.accent, 0.95)
  tracked(ctx, `Nº ${String(def.no).padStart(2, '0')}`, CARD_W - 60, 104, 3, 'right')

  // the art window: punched out, with a metal keyline and an inner shadow
  const A = ART_FRAMED
  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'
  rr(ctx, A.x, A.y, A.w, A.h, 16)
  ctx.fill()
  ctx.restore()
  ctx.save()
  rr(ctx, A.x, A.y, A.w, A.h, 16)
  ctx.clip()
  ctx.shadowColor = 'rgba(0,0,0,.85)'
  ctx.shadowBlur = 26
  rr(ctx, A.x - 40, A.y - 40, A.w + 80, A.h + 80, 30)
  rr(ctx, A.x - 1, A.y - 1, A.w + 2, A.h + 2, 16)
  ctx.lineWidth = 40
  ctx.strokeStyle = 'rgba(0,0,0,.6)'
  ctx.stroke()
  ctx.restore()
  rr(ctx, A.x - 2, A.y - 2, A.w + 4, A.h + 4, 18)
  ctx.lineWidth = 3
  ctx.strokeStyle = metalGradient(ctx, metal, A.x, A.y, A.x + A.w, A.y + A.h)
  ctx.stroke()
  rr(m.ctx, A.x - 3, A.y - 3, A.w + 6, A.h + 6, 18)
  m.ctx.lineWidth = 5
  m.ctx.strokeStyle = '#0f0'
  m.ctx.stroke()
  if (pull.foil) {
    rr(m.ctx, A.x, A.y, A.w, A.h, 16)
    m.ctx.fillStyle = '#00f'
    m.ctx.fill()
  }

  // type line
  ctx.font = `500 23px ${SANS}`
  ctx.fillStyle = mixHex(def.accent, '#ffffff', 0.35)
  tracked(ctx, def.type.toUpperCase(), 60, 912, 5)
  ctx.font = `italic 500 30px ${SERIF}`
  ctx.fillStyle = '#b9b5d2'
  ctx.textAlign = 'right'
  ctx.fillText(def.cf, CARD_W - 60, 912)
  ctx.textAlign = 'left'

  const rule = (y) => {
    const lg = ctx.createLinearGradient(60, 0, CARD_W - 60, 0)
    lg.addColorStop(0, rgba(def.accent, 0))
    lg.addColorStop(0.5, rgba(def.accent, 0.7))
    lg.addColorStop(1, rgba(def.accent, 0))
    ctx.fillStyle = lg
    ctx.fillRect(60, y, CARD_W - 120, 1.5)
  }
  rule(940)

  // stats with dotted leaders
  def.stats.forEach(([label, value], i) => {
    const y = 1000 + i * 60
    ctx.save()
    ctx.translate(68, y - 9)
    ctx.rotate(Math.PI / 4)
    ctx.fillStyle = def.accent
    ctx.fillRect(-5, -5, 10, 10)
    ctx.restore()
    ctx.font = `400 23px ${SANS}`
    ctx.fillStyle = '#a19dbc'
    const lw = tracked(ctx, label.toUpperCase(), 90, y, 3)
    ctx.fillStyle = '#f6f4ff'
    const vw = valueText(ctx, value, CARD_W - 64, y + 1, 32)
    ctx.fillStyle = 'rgba(200,196,230,.32)'
    for (let x = 90 + lw + 18; x < CARD_W - 64 - vw - 18; x += 10) {
      ctx.beginPath()
      ctx.arc(x, y - 7, 1.4, 0, Math.PI * 2)
      ctx.fill()
    }
  })
  rule(1165)

  // flavour
  ctx.font = `italic 500 33px ${SERIF}`
  ctx.fillStyle = '#d4cfee'
  ctx.textAlign = 'center'
  wrap(ctx, def.flavor, 800).forEach((line, i) => ctx.fillText(line, CARD_W / 2, 1222 + i * 42))
  ctx.textAlign = 'left'

  footer(ctx, def, pull, metal)
}

function fullArt(f, m, def, pull) {
  const { ctx } = f
  const metal = rarityMetal(def.rarity)
  border(f, m, metal)
  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'
  rr(ctx, 20, 20, CARD_W - 40, CARD_H - 40, 30)
  ctx.fill()
  ctx.restore()

  ctx.save()
  rr(ctx, 20, 20, CARD_W - 40, CARD_H - 40, 30)
  ctx.clip()
  let g = ctx.createLinearGradient(0, 20, 0, 260)
  g.addColorStop(0, 'rgba(3,2,9,.72)')
  g.addColorStop(1, 'rgba(3,2,9,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, CARD_W, 260)
  g = ctx.createLinearGradient(0, 880, 0, CARD_H)
  g.addColorStop(0, 'rgba(3,2,9,0)')
  g.addColorStop(0.32, 'rgba(3,2,9,.8)')
  g.addColorStop(1, 'rgba(3,2,9,.92)')
  ctx.fillStyle = g
  ctx.fillRect(0, 880, CARD_W, CARD_H - 880)
  ctx.restore()

  // a fine engraved keyline just inside the border
  rr(ctx, 34, 34, CARD_W - 68, CARD_H - 68, 22)
  ctx.lineWidth = 1.5
  ctx.strokeStyle = 'rgba(255,226,170,.5)'
  ctx.stroke()
  rr(m.ctx, 34, 34, CARD_W - 68, CARD_H - 68, 22)
  m.ctx.lineWidth = 3
  m.ctx.strokeStyle = '#0f0'
  m.ctx.stroke()

  title(f, m, def, metal, { x: 66, y: 118, size: 66, maxW: 700, tracking: 11 })
  ctx.font = `500 22px ${SANS}`
  ctx.fillStyle = def.accent
  tracked(ctx, def.type.toUpperCase(), 68, 160, 9)
  m.ctx.font = `500 22px ${SANS}`
  m.ctx.fillStyle = '#0f0'
  tracked(m.ctx, def.type.toUpperCase(), 68, 160, 9)
  ctx.font = `500 25px ${SANS}`
  ctx.fillStyle = rgba(def.accent, 0.95)
  tracked(ctx, `Nº ${String(def.no).padStart(2, '0')}`, CARD_W - 66, 112, 3, 'right')

  // stats in three columns
  const cols = [CARD_W / 6, CARD_W / 2, (CARD_W * 5) / 6]
  def.stats.forEach(([label, value], i) => {
    ctx.font = `400 19px ${SANS}`
    ctx.fillStyle = '#aaa6c6'
    tracked(ctx, label.toUpperCase(), cols[i], 1086, 2.5, 'center')
    ctx.fillStyle = '#fbf8ff'
    valueText(ctx, value, cols[i], 1130, 31, 'center')
    if (i) {
      ctx.fillStyle = 'rgba(255,220,160,.35)'
      ctx.fillRect((cols[i - 1] + cols[i]) / 2, 1060, 1.5, 84)
    }
  })
  const lg = ctx.createLinearGradient(60, 0, CARD_W - 60, 0)
  lg.addColorStop(0, rgba(def.accent, 0))
  lg.addColorStop(0.5, rgba(def.accent, 0.75))
  lg.addColorStop(1, rgba(def.accent, 0))
  ctx.fillStyle = lg
  ctx.fillRect(60, 1170, CARD_W - 120, 1.5)

  ctx.font = `italic 500 32px ${SERIF}`
  ctx.fillStyle = '#e1dcf6'
  ctx.textAlign = 'center'
  wrap(ctx, def.flavor, 780).forEach((line, i) => ctx.fillText(line, CARD_W / 2, 1222 + i * 40))
  ctx.textAlign = 'left'
  footer(ctx, def, pull, metal)

  // holo everywhere, eased off under the text so it stays legible
  m.ctx.save()
  m.ctx.globalCompositeOperation = 'lighter'
  rr(m.ctx, 0, 0, CARD_W, CARD_H, 46)
  const mg = m.ctx.createLinearGradient(0, 900, 0, 1100)
  mg.addColorStop(0, 'rgb(0,0,255)')
  mg.addColorStop(1, 'rgb(0,0,110)')
  m.ctx.fillStyle = mg
  m.ctx.fill()
  m.ctx.restore()
}

function toTexture(canvas, renderer) {
  const t = new THREE.CanvasTexture(canvas)
  t.anisotropy = renderer.capabilities.getMaxAnisotropy()
  t.minFilter = THREE.LinearMipmapLinearFilter
  t.generateMipmaps = true
  return t
}

export function makeFace(pull, renderer) {
  const f = makeCanvas(TEX)
  const m = makeCanvas(MASK)
  m.ctx.fillStyle = '#000'
  m.ctx.fillRect(0, 0, CARD_W, CARD_H)
  if (pull.def.fullArt) fullArt(f, m, pull.def, pull)
  else framed(f, m, pull.def, pull)
  const A = pull.def.fullArt ? ART_FULL : ART_FRAMED
  // uv rect of the art window (uv origin bottom-left)
  const artRect = new THREE.Vector4(A.x / CARD_W, 1 - (A.y + A.h) / CARD_H, (A.x + A.w) / CARD_W, 1 - A.y / CARD_H)
  return { frame: toTexture(f.c, renderer), mask: toTexture(m.c, renderer), artRect, canvas: f.c }
}

let back = null
export function cardBack(renderer) {
  if (back) return back
  const f = makeCanvas(TEX)
  const m = makeCanvas(MASK)
  const { ctx } = f
  m.ctx.fillStyle = '#000'
  m.ctx.fillRect(0, 0, CARD_W, CARD_H)
  border(f, m, 'gold')

  ctx.save()
  rr(ctx, 20, 20, CARD_W - 40, CARD_H - 40, 30)
  ctx.clip()
  const g = ctx.createRadialGradient(CARD_W / 2, CARD_H / 2, 40, CARD_W / 2, CARD_H / 2, 820)
  g.addColorStop(0, '#2a1d63')
  g.addColorStop(0.45, '#130f33')
  g.addColorStop(1, '#05040c')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, CARD_W, CARD_H)
  dust(ctx, rng(0.31), 900, 20, 20, CARD_W - 40, CARD_H - 40, 0.55)
  ctx.restore()

  const cx = CARD_W / 2
  const cy = 640
  const both = (fn) => {
    fn(ctx, '#f1d38f')
    fn(m.ctx, '#0f0')
  }
  both((c, col) => guilloche(c, cx, cy, 210, 430, 26, 11, col, c === ctx ? 0.32 : 0.8, 1.2))
  both((c, col) => guilloche(c, cx, cy, 440, 470, 3, 22, col, c === ctx ? 0.5 : 1, 1.4))

  // emblem: a black hole with its disk, in gold line
  ctx.save()
  const halo = ctx.createRadialGradient(cx, cy, 90, cx, cy, 230)
  halo.addColorStop(0, 'rgba(255,190,110,.55)')
  halo.addColorStop(0.35, 'rgba(255,140,80,.18)')
  halo.addColorStop(1, 'rgba(255,140,80,0)')
  ctx.fillStyle = halo
  ctx.fillRect(cx - 240, cy - 240, 480, 480)
  ctx.restore()
  // the lensed far side of the disk wraps the shadow in a ring of light
  ctx.save()
  ctx.shadowColor = 'rgba(255,170,90,.95)'
  ctx.shadowBlur = 34
  ctx.strokeStyle = '#f6d28c'
  ctx.lineWidth = 16
  ctx.beginPath()
  ctx.arc(cx, cy, 116, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
  both((c, col) => {
    c.save()
    c.strokeStyle = col
    c.lineWidth = 2
    c.beginPath()
    c.arc(cx, cy, 134, Math.PI * 1.05, Math.PI * 1.95)
    c.stroke()
    // the disk behind
    c.lineWidth = 6
    c.beginPath()
    c.ellipse(cx, cy, 260, 30, -0.1, Math.PI + 0.05, Math.PI * 2 - 0.05)
    c.stroke()
    c.restore()
  })
  ctx.beginPath()
  ctx.arc(cx, cy, 100, 0, Math.PI * 2)
  ctx.fillStyle = '#020104'
  ctx.fill()
  both((c, col) => {
    c.save()
    c.strokeStyle = col
    c.lineWidth = 2.5
    c.beginPath()
    c.arc(cx, cy, 101, 0, Math.PI * 2)
    c.stroke()
    // the near side of the disk, crossing in front of the shadow
    c.lineWidth = 9
    c.shadowColor = c === ctx ? 'rgba(255,170,90,.9)' : 'transparent'
    c.shadowBlur = c === ctx ? 20 : 0
    c.beginPath()
    c.ellipse(cx, cy, 260, 30, -0.1, 0.05, Math.PI - 0.05)
    c.stroke()
    c.restore()
  })

  both((c, col) => {
    c.fillStyle = col
    c.font = `600 86px ${SANS}`
    tracked(c, SET_NAME.toUpperCase(), cx + 12, 1140, 30, 'center')
    c.font = `500 22px ${SANS}`
    tracked(c, 'CELESTIAL  TRADING  CARDS', cx, 1196, 9, 'center')
    c.font = `500 30px ${SANS}`
    tracked(c, '✦', cx, 210, 0, 'center')
  })
  ctx.font = `italic 500 30px ${SERIF}`
  ctx.fillStyle = '#cdbf9c'
  ctx.textAlign = 'center'
  ctx.fillText(SET_SERIES, cx, 1250)
  ctx.textAlign = 'left'
  both((c, col) => {
    c.save()
    c.strokeStyle = col
    c.lineWidth = 2
    rr(c, 44, 44, CARD_W - 88, CARD_H - 88, 20)
    c.stroke()
    c.lineWidth = 1
    rr(c, 56, 56, CARD_W - 112, CARD_H - 112, 14)
    c.stroke()
    c.restore()
  })

  back = { frame: toTexture(f.c, renderer), mask: toTexture(m.c, renderer) }
  return back
}
