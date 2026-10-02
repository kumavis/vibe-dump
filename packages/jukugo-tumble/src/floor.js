import { BOUNDS } from './field.js'
import { FIELDS, romaji } from './lexicon.js'
import { pointAt, visibleSpan } from './links.js'
import { clamp01, smooth, outCubic } from './ease.js'

const C = {
  paper: '#ecebe7',
  card: '#fbfbf9',
  ink: '#141414',
  ink2: '#55544f',
  ink3: '#8f8e88',
  diagram: '#a6a59f',
  hair: '#bebdb8',
  mark: '#cfcec9',
  water: '#d8d7d2',
}
const MONO = "'JT Mono', ui-monospace, monospace"
const SERIF = "'JT Serif', serif"
const TAU = Math.PI * 2

// Everything printed on the floor: grid marks, the eight field diagrams, the
// words' captions and the lines between them. This canvas sits *under* the
// WebGL one, so the blocks cover whatever runs beneath them and their shadows
// fall across the lines — the only way a 2D line drawing can share a floor
// with 3D objects without a depth buffer.
//
// The trick that keeps hairlines hairline: paths are built under the floor's
// affine transform (so circles come out as the right ellipses), then stroked
// under the plain screen transform, so the pen stays round and 1px wide.
export class FloorPainter {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.dpr = 1
  }

  resize(w, h, dpr) {
    this.w = w
    this.h = h
    this.dpr = dpr
    this.canvas.width = Math.round(w * dpr)
    this.canvas.height = Math.round(h * dpr)
  }

  floor(scale = 1) {
    const [a, b, c, d, e, f] = this.A
    const k = this.dpr
    this.ctx.setTransform(a * k * scale, b * k * scale, c * k * scale, d * k * scale, e * k, f * k)
  }

  screen() {
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
  }

  toScreen(x, z) {
    const [a, b, c, d, e, f] = this.A
    return [a * x + c * z + e, b * x + d * z + f]
  }

  // The floor rectangle the screen can see (with a margin), for culling.
  visibleRect(margin = 3) {
    const [a, b, c, d, e, f] = this.A
    const det = a * d - b * c
    const inv = (sx, sy) => {
      const px = sx - e
      const py = sy - f
      return [(d * px - c * py) / det, (-b * px + a * py) / det]
    }
    const pts = [inv(0, 0), inv(this.w, 0), inv(0, this.h), inv(this.w, this.h)]
    const xs = pts.map((p) => p[0])
    const zs = pts.map((p) => p[1])
    return {
      x0: Math.min(...xs) - margin,
      x1: Math.max(...xs) + margin,
      z0: Math.min(...zs) - margin,
      z1: Math.max(...zs) + margin,
    }
  }

  stroke(width, color, dash) {
    const ctx = this.ctx
    this.screen()
    ctx.lineWidth = width
    ctx.strokeStyle = color
    ctx.setLineDash(dash ?? [])
    ctx.stroke()
  }

  draw(s) {
    const ctx = this.ctx
    this.A = s.A
    this.now = s.now
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const view = this.visibleRect()
    const intro = s.intro

    ctx.globalAlpha = smooth(clamp01(intro / 0.8))
    this.marks(view)
    this.border()
    ctx.globalAlpha = 1

    const linkedTo = new Map()
    for (const l of s.links.links.values()) {
      if (l.kind === 'field' && l.to === 1) linkedTo.set(l.feature, (linkedTo.get(l.feature) ?? 0) + 1)
    }
    s.board.features.forEach((f, i) => {
      if (!near(view, f.x, f.z, f.r + 3)) return
      const rev = outCubic(clamp01((intro - 0.1 - i * 0.07) / 1.3))
      if (rev > 0) this.feature(f, rev, linkedTo.get(f) ?? 0)
    })

    const cap = smooth(clamp01((intro - 1.2) / 0.8))
    for (const p of s.board.pairs) {
      if (!near(view, p.x, p.z, 2.5)) continue
      this.pairMarks(p, s.noted.has(p), cap)
    }

    for (const l of s.links.links.values()) if (l.kind === 'field') this.fieldLink(l)
    for (const l of s.links.links.values()) if (l.kind === 'pair') this.pairLink(l)
    for (const l of s.links.links.values()) if (l.kind === 'pair') this.pairLabel(l)

    for (const r of s.ripples) this.ripple(r)
  }

  // ── background ──────────────────────────────────────────────────────────

  marks(view) {
    const ctx = this.ctx
    this.floor()
    ctx.beginPath()
    const arm = 0.08
    for (let x = Math.ceil(Math.max(view.x0, BOUNDS.x0) / 2) * 2; x <= Math.min(view.x1, BOUNDS.x1); x += 2) {
      for (let z = Math.ceil(Math.max(view.z0, BOUNDS.z0) / 2) * 2; z <= Math.min(view.z1, BOUNDS.z1); z += 2) {
        ctx.moveTo(x - arm, z)
        ctx.lineTo(x + arm, z)
        ctx.moveTo(x, z - arm)
        ctx.lineTo(x, z + arm)
      }
    }
    this.stroke(1, C.mark)
  }

  // A drafting border round the whole floor, with a ruler along two sides.
  border() {
    const ctx = this.ctx
    const m = 1.4
    const x0 = BOUNDS.x0 - m
    const x1 = BOUNDS.x1 + m
    const z0 = BOUNDS.z0 - m
    const z1 = BOUNDS.z1 + m
    this.floor()
    ctx.beginPath()
    ctx.rect(x0, z0, x1 - x0, z1 - z0)
    this.stroke(1, C.hair)
    this.floor()
    ctx.beginPath()
    for (let x = Math.ceil(x0); x <= x1; x++) {
      const len = x % 5 === 0 ? 0.36 : 0.16
      ctx.moveTo(x, z0)
      ctx.lineTo(x, z0 + len)
      ctx.moveTo(x, z1)
      ctx.lineTo(x, z1 - len)
    }
    for (let z = Math.ceil(z0); z <= z1; z++) {
      const len = z % 5 === 0 ? 0.36 : 0.16
      ctx.moveTo(x0, z)
      ctx.lineTo(x0 + len, z)
      ctx.moveTo(x1, z)
      ctx.lineTo(x1 - len, z)
    }
    this.stroke(1, C.hair)
    this.floor(0.01)
    ctx.fillStyle = C.ink3
    ctx.font = `400 17px ${MONO}`
    ctx.textAlign = 'center'
    for (let x = Math.ceil(x0 / 5) * 5; x <= x1; x += 5) ctx.fillText(fmt(x), x * 100, (z0 + 0.62) * 100)
    ctx.textAlign = 'left'
    for (let z = Math.ceil(z0 / 5) * 5; z <= z1; z += 5) ctx.fillText(fmt(z), (x0 + 0.48) * 100, z * 100 + 6)
  }

  // ── field diagrams ──────────────────────────────────────────────────────

  feature(f, rev, linked) {
    const ctx = this.ctx
    const t = this.now
    const info = FIELDS[f.field]
    const hw = f.hw ?? f.r
    const hh = f.hh ?? f.r

    // The field's name, set big and pale on the floor beside its diagram.
    this.floor(0.01)
    ctx.globalAlpha = rev
    ctx.fillStyle = C.water
    ctx.font = `600 150px ${SERIF}`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    const lx = f.x - hw
    const lz = f.z - hh - 0.5
    ctx.fillText(info.label, lx * 100, lz * 100)
    ctx.fillStyle = C.ink3
    ctx.font = `500 19px ${MONO}`
    const ro = romaji(info.kana)
    ctx.fillText(
      `${ro.toUpperCase()} · ${info.en.toUpperCase()} — ${String(linked).padStart(2, '0')} LINKED`,
      lx * 100 + 6,
      (lz + 0.36) * 100,
    )
    ctx.globalAlpha = 1

    this.floor()
    ctx.beginPath()
    const { x, z, r } = f
    switch (f.kind) {
      case 'ripples': {
        // Raked gravel round a stone, with one ring always travelling out.
        for (let i = 1; i <= 7; i++) arc(ctx, x, z, (r * i) / 7, rev)
        arc(ctx, x, z, r * 0.07, rev)
        this.stroke(1, C.diagram)
        const u = ((t + f.phase) % 5) / 5
        this.floor()
        ctx.beginPath()
        arc(ctx, x, z, r * (0.1 + 0.9 * u), rev)
        ctx.globalAlpha = (1 - u) * 0.9
        this.stroke(1, C.ink3)
        ctx.globalAlpha = 1
        break
      }
      case 'dial': {
        arc(ctx, x, z, r, rev)
        arc(ctx, x, z, r * 0.84, rev)
        const n = Math.floor(60 * rev)
        for (let i = 0; i < n; i++) {
          const a = (i / 60) * TAU - Math.PI / 2
          const r0 = i % 5 === 0 ? r * 0.84 : r * 0.92
          ctx.moveTo(x + Math.cos(a) * r0, z + Math.sin(a) * r0)
          ctx.lineTo(x + Math.cos(a) * r, z + Math.sin(a) * r)
        }
        this.stroke(1, C.diagram)
        // The hand keeps real time: one sweep a minute.
        const a = (((t + f.phase * 10) % 60) / 60) * TAU - Math.PI / 2
        this.floor()
        ctx.beginPath()
        ctx.moveTo(x - Math.cos(a) * r * 0.12, z - Math.sin(a) * r * 0.12)
        ctx.lineTo(x + Math.cos(a) * r * 0.78 * rev, z + Math.sin(a) * r * 0.78 * rev)
        arc(ctx, x, z, r * 0.035, rev)
        this.stroke(1, C.ink3)
        this.floor(0.01)
        ctx.fillStyle = C.ink3
        ctx.font = `400 22px ${MONO}`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.globalAlpha = rev
        for (const [k, label] of [
          [0, '12'],
          [15, '3'],
          [30, '6'],
          [45, '9'],
        ]) {
          const b = (k / 60) * TAU - Math.PI / 2
          ctx.fillText(label, (x + Math.cos(b) * r * 0.7) * 100, (z + Math.sin(b) * r * 0.7) * 100)
        }
        ctx.globalAlpha = 1
        ctx.textBaseline = 'alphabetic'
        break
      }
      case 'grid': {
        // A surveyor's sheet: lettered columns, numbered rows, a crosshair.
        const w = f.hw
        const h = f.hh
        ctx.rect(x - w, z - h, 2 * w * rev, 2 * h)
        const nx = 6
        const nz = 5
        for (let i = 1; i < nx; i++) {
          const gx = x - w + (2 * w * i) / nx
          ctx.moveTo(gx, z - h)
          ctx.lineTo(gx, z - h + 2 * h * rev)
        }
        for (let j = 1; j < nz; j++) {
          const gz = z - h + (2 * h * j) / nz
          ctx.moveTo(x - w, gz)
          ctx.lineTo(x - w + 2 * w * rev, gz)
        }
        this.stroke(1, C.diagram)
        this.floor()
        ctx.beginPath()
        arc(ctx, x, z, 0.5, rev)
        ctx.moveTo(x - 0.9, z)
        ctx.lineTo(x + 0.9, z)
        ctx.moveTo(x, z - 0.9)
        ctx.lineTo(x, z + 0.9)
        this.stroke(1, C.ink3)
        this.floor(0.01)
        ctx.fillStyle = C.ink3
        ctx.font = `400 18px ${MONO}`
        ctx.textAlign = 'center'
        ctx.globalAlpha = rev
        for (let i = 0; i < nx; i++) {
          const cx = x - w + (2 * w * (i + 0.5)) / nx
          ctx.fillText('ABCDEFGH'[i], cx * 100, (z + h + 0.32) * 100)
        }
        ctx.textAlign = 'right'
        for (let j = 0; j < nz; j++) {
          const cz = z - h + (2 * h * (j + 0.5)) / nz
          ctx.fillText(String(j + 1), (x - w - 0.14) * 100, cz * 100 + 6)
        }
        ctx.globalAlpha = 1
        break
      }
      case 'spiral': {
        const turns = 3.5
        const spin = f.spin * ((t / 90) * TAU) + f.phase
        const steps = Math.floor(220 * rev)
        for (let i = 0; i <= steps; i++) {
          const u = i / 220
          const a = u * turns * TAU + spin
          const rr = r * (0.06 + 0.94 * u)
          const px = x + Math.cos(a) * rr
          const pz = z + Math.sin(a) * rr
          if (i === 0) ctx.moveTo(px, pz)
          else ctx.lineTo(px, pz)
        }
        this.stroke(1, C.diagram)
        // Chevrons riding the spiral outward.
        this.floor()
        ctx.beginPath()
        for (let k = 0; k < 7; k++) {
          const u = (((t * 0.04 + k / 7) % 1) * rev) % 1
          const a = u * turns * TAU + spin
          const rr = r * (0.06 + 0.94 * u)
          const px = x + Math.cos(a) * rr
          const pz = z + Math.sin(a) * rr
          const ta = a + f.spin * 0 + Math.PI / 2
          const s = 0.16
          const back = ta + Math.PI
          ctx.moveTo(px + Math.cos(back + 0.6) * s, pz + Math.sin(back + 0.6) * s)
          ctx.lineTo(px, pz)
          ctx.lineTo(px + Math.cos(back - 0.6) * s, pz + Math.sin(back - 0.6) * s)
        }
        this.stroke(1, C.ink3)
        this.floor()
        ctx.beginPath()
        arc(ctx, x, z, r, rev)
        this.stroke(1, C.diagram, [2, 5])
        break
      }
      case 'venn': {
        const d = r * 0.36
        const rr = r * 0.62
        const sway = Math.sin(t * 0.25 + f.phase) * 0.12
        arc(ctx, x - d - sway, z, rr, rev)
        arc(ctx, x + d + sway, z, rr, rev)
        this.stroke(1, C.diagram)
        this.floor()
        ctx.beginPath()
        arc(ctx, x, z, r, rev)
        this.stroke(1, C.diagram, [1, 4])
        this.floor()
        ctx.beginPath()
        arc(ctx, x, z, 0.12, rev)
        this.stroke(1, C.ink3)
        break
      }
      case 'genko': {
        // 原稿用紙: manuscript paper, written in columns right to left, with a
        // blank fold column down the middle marked by the 魚尾 "fish tail".
        const w = f.hw
        const h = f.hh
        const cell = f.cell
        const mid = (f.cols - 1) / 2
        ctx.rect(x - w - 0.12, z - h - 0.12, (2 * w + 0.24) * rev, 2 * h + 0.24)
        for (let i = 0; i < f.cols; i++) {
          if (i === mid) continue
          const cx = x - w + i * cell
          for (let j = 0; j < f.rows; j++) {
            if ((i * f.rows + j) / (f.cols * f.rows) > rev) continue
            ctx.rect(cx + 0.03, z - h + j * cell + 0.03, cell - 0.06, cell - 0.06)
          }
        }
        this.stroke(1, C.diagram)
        this.floor()
        ctx.beginPath()
        const fx = x - w + mid * cell + cell / 2
        for (const fz of [z - h * 0.45, z + h * 0.45]) {
          const s = cell * 0.32
          const dir = fz < z ? 1 : -1
          ctx.moveTo(fx - s, fz)
          ctx.lineTo(fx + s, fz)
          ctx.lineTo(fx, fz + dir * s * 0.9)
          ctx.closePath()
        }
        this.stroke(1, C.ink3)
        break
      }
      case 'crowd': {
        // People: rings of dots, one ring rotating against the next.
        arc(ctx, x, z, r, rev)
        this.stroke(1, C.diagram)
        this.floor()
        ctx.beginPath()
        const rings = [
          [0.3, 6],
          [0.55, 12],
          [0.8, 18],
        ]
        rings.forEach(([k, n], ri) => {
          const rot = (ri % 2 ? -1 : 1) * t * 0.05 + f.phase
          for (let i = 0; i < n * rev; i++) {
            const a = (i / n) * TAU + rot
            const px = x + Math.cos(a) * r * k
            const pz = z + Math.sin(a) * r * k
            ctx.moveTo(px + 0.09, pz)
            ctx.arc(px, pz, 0.09, 0, TAU)
          }
        })
        ctx.moveTo(x + 0.14, z)
        ctx.arc(x, z, 0.14, 0, TAU)
        this.stroke(1, C.ink3)
        break
      }
      case 'blueprint': {
        // A part drawing: a square with its diagonals and inscribed circle,
        // dimensioned along the bottom.
        const w = f.hw
        ctx.rect(x - w, z - w, 2 * w * rev, 2 * w * rev)
        ctx.moveTo(x - w, z - w)
        ctx.lineTo(x - w + 2 * w * rev, z - w + 2 * w * rev)
        ctx.moveTo(x + w, z - w)
        ctx.lineTo(x + w - 2 * w * rev, z - w + 2 * w * rev)
        arc(ctx, x, z, w, rev)
        arc(ctx, x, z, w * 0.5, rev)
        this.stroke(1, C.diagram)
        this.floor()
        ctx.beginPath()
        const dz = z + w + 0.5
        ctx.moveTo(x - w, z + w + 0.15)
        ctx.lineTo(x - w, dz + 0.15)
        ctx.moveTo(x + w, z + w + 0.15)
        ctx.lineTo(x + w, dz + 0.15)
        ctx.moveTo(x - w, dz)
        ctx.lineTo(x + w, dz)
        for (const [ex, s] of [
          [x - w, 1],
          [x + w, -1],
        ]) {
          ctx.moveTo(ex + s * 0.22, dz - 0.08)
          ctx.lineTo(ex, dz)
          ctx.lineTo(ex + s * 0.22, dz + 0.08)
        }
        this.stroke(1, C.ink3)
        this.floor(0.01)
        ctx.fillStyle = C.ink3
        ctx.font = `400 19px ${MONO}`
        ctx.textAlign = 'center'
        ctx.globalAlpha = rev
        ctx.fillText((2 * w).toFixed(3), x * 100, (dz - 0.1) * 100)
        ctx.globalAlpha = 1
        break
      }
    }
  }

  // ── words ───────────────────────────────────────────────────────────────

  pairMarks(p, noted, alpha) {
    const ctx = this.ctx
    const [hx, hz] = p.dir === 'h' ? [1.06 + 0.2, 0.5 + 0.2] : [0.5 + 0.2, 1.12 + 0.2]
    const x0 = p.x - hx
    const x1 = p.x + hx
    const z0 = p.z - hz
    const z1 = p.z + hz
    const arm = noted ? 0.34 : 0.22
    this.floor()
    ctx.beginPath()
    for (const [cx, cz, sx, sz] of [
      [x0, z0, 1, 1],
      [x1, z0, -1, 1],
      [x0, z1, 1, -1],
      [x1, z1, -1, -1],
    ]) {
      ctx.moveTo(cx + sx * arm, cz)
      ctx.lineTo(cx, cz)
      ctx.lineTo(cx, cz + sz * arm)
    }
    this.stroke(noted ? 1.4 : 1, noted ? C.ink : C.diagram)

    if (alpha <= 0) return
    ctx.globalAlpha = alpha
    this.floor(0.01)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = C.ink3
    ctx.font = `400 15px ${MONO}`
    ctx.fillText(String(p.id + 1).padStart(3, '0'), x0 * 100, (z0 - 0.1) * 100)

    const cap = p.caption
    const [tx, ty1] = p.dir === 'h' ? [x0, z1 + 0.34] : [x1 + 0.16, p.z - 0.12]
    const ty2 = ty1 + 0.27
    const now = this.now
    let l1 = cap.prev1
    let l2 = cap.prev2
    let cursor = null
    if (now >= cap.t0) {
      const n = Math.floor((now - cap.t0) / 0.026)
      l1 = cap.text1.slice(0, n)
      l2 = cap.text2.slice(0, Math.max(0, n - cap.text1.length * 0.4))
      if (n < cap.text1.length) cursor = [1, l1]
      else if (l2.length < cap.text2.length) cursor = [2, l2]
    } else if (now >= cap.t0 - 0.3) {
      // Erase back to nothing just before the new word types in.
      const k = clamp01((cap.t0 - now) / 0.3)
      l1 = cap.prev1.slice(0, Math.ceil(cap.prev1.length * k))
      l2 = cap.prev2.slice(0, Math.ceil(cap.prev2.length * k))
    }
    ctx.fillStyle = noted ? C.ink : C.ink2
    ctx.font = `500 19px ${MONO}`
    ctx.fillText(l1, tx * 100, ty1 * 100)
    ctx.fillStyle = C.ink3
    ctx.font = `400 17px ${MONO}`
    ctx.fillText(l2, tx * 100, ty2 * 100)
    if (cursor) {
      const [line, text] = cursor
      ctx.font = line === 1 ? `500 19px ${MONO}` : `400 17px ${MONO}`
      const cx = tx * 100 + ctx.measureText(text).width + 2
      ctx.fillStyle = C.ink
      ctx.fillRect(cx, (line === 1 ? ty1 : ty2) * 100 - 15, 10, 18)
    }
    ctx.globalAlpha = 1
  }

  // ── links ───────────────────────────────────────────────────────────────

  span(l) {
    const [s0, s1] = visibleSpan(l)
    if (s1 - s0 < 0.005) return null
    const ctx = this.ctx
    this.floor()
    ctx.beginPath()
    const first = pointAt(l, s0)
    ctx.moveTo(first[0], first[1])
    for (let i = 1; i < l.pts.length; i++) {
      if (l.cum[i] <= s0) continue
      if (l.cum[i] >= s1) break
      ctx.lineTo(l.pts[i][0], l.pts[i][1])
    }
    const last = pointAt(l, s1)
    ctx.lineTo(last[0], last[1])
    return [s0, s1]
  }

  dot(x, z, r, fill, stroke) {
    const ctx = this.ctx
    const [sx, sy] = this.toScreen(x, z)
    this.screen()
    ctx.beginPath()
    ctx.arc(sx, sy, r, 0, TAU)
    if (fill) {
      ctx.fillStyle = fill
      ctx.fill()
    }
    if (stroke) {
      ctx.setLineDash([])
      ctx.lineWidth = 1
      ctx.strokeStyle = stroke
      ctx.stroke()
    }
  }

  pairLink(l) {
    const span = this.span(l)
    if (!span) return
    const [s0, s1] = span
    this.stroke(1.3, C.ink)
    for (const s of [l.portA, l.portB]) {
      if (s >= s0 - 1e-3 && s <= s1 + 1e-3) {
        const [x, z] = pointAt(l, s)
        this.dot(x, z, 2.6, C.paper, C.ink)
      }
    }
    if (l.moving) {
      const [x, z] = pointAt(l, l.anchor === 'start' ? s1 : s0)
      this.dot(x, z, 2.4, C.ink)
    }
  }

  // The shared character, ringed, at the middle of its line.
  pairLabel(l) {
    const [s0, s1] = visibleSpan(l)
    const mid = l.len / 2
    if (mid < s0 || mid > s1) return
    const reach = l.anchor === 'start' ? s1 - mid : mid - s0
    const a = smooth(clamp01(reach / 0.8))
    if (a <= 0) return
    const ctx = this.ctx
    const [x, z] = pointAt(l, mid)
    const [sx, sy] = this.toScreen(x, z)
    this.screen()
    ctx.globalAlpha = a
    ctx.beginPath()
    ctx.arc(sx, sy, 9.5 * (0.6 + 0.4 * a), 0, TAU)
    ctx.fillStyle = C.card
    ctx.fill()
    ctx.setLineDash([])
    ctx.lineWidth = 1
    ctx.strokeStyle = C.ink
    ctx.stroke()
    ctx.fillStyle = C.ink
    ctx.font = `600 11.5px ${SERIF}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(l.char, sx, sy + 0.5)
    ctx.textBaseline = 'alphabetic'
    ctx.globalAlpha = 1
    this.pulse(sx, sy, l, 9.5)
  }

  // A ring that spreads once from a line's mark when the line connects.
  pulse(sx, sy, l, r0) {
    const u = (this.now - l.doneAt) / 0.9
    if (!(u >= 0 && u < 1)) return
    const ctx = this.ctx
    this.screen()
    ctx.beginPath()
    ctx.arc(sx, sy, r0 + 16 * outCubic(u), 0, TAU)
    ctx.globalAlpha = (1 - u) * 0.8
    ctx.setLineDash([])
    ctx.lineWidth = 1
    ctx.strokeStyle = C.ink
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  fieldLink(l) {
    const span = this.span(l)
    if (!span) return
    const [s0, s1] = span
    this.stroke(1, C.ink2, [3, 3.5])
    if (l.portA >= s0 && l.portA <= s1) {
      const [x, z] = pointAt(l, l.portA)
      this.dot(x, z, 2.2, C.paper, C.ink2)
    }
    if (s1 < l.len - 1e-3) return
    const ctx = this.ctx
    const [ex, ez] = l.pts.at(-1)
    const [sx, sy] = this.toScreen(ex, ez)
    const [px, py] = this.toScreen(...l.pts[0])
    const ang = Math.atan2(sy - py, sx - px)
    this.screen()
    ctx.setLineDash([])
    ctx.strokeStyle = C.ink2
    ctx.fillStyle = C.ink2
    ctx.lineWidth = 1
    ctx.beginPath()
    if (l.stub) {
      // Off-page connector: an arrowhead and the name of where it's going.
      ctx.moveTo(sx + Math.cos(ang + 2.6) * 6, sy + Math.sin(ang + 2.6) * 6)
      ctx.lineTo(sx, sy)
      ctx.lineTo(sx + Math.cos(ang - 2.6) * 6, sy + Math.sin(ang - 2.6) * 6)
      ctx.stroke()
      const info = FIELDS[l.feature.field]
      ctx.font = `600 11px ${SERIF}`
      ctx.textAlign = Math.cos(ang) >= 0 ? 'left' : 'right'
      ctx.textBaseline = 'middle'
      const ox = sx + Math.cos(ang) * 9
      const oy = sy + Math.sin(ang) * 9
      ctx.fillText(info.label, ox, oy)
      ctx.textBaseline = 'alphabetic'
    } else {
      ctx.moveTo(sx + 3.2, sy)
      ctx.lineTo(sx, sy + 3.2)
      ctx.lineTo(sx - 3.2, sy)
      ctx.lineTo(sx, sy - 3.2)
      ctx.closePath()
      ctx.fill()
      this.pulse(sx, sy, l, 3)
    }
  }

  // A square outline spreading from a block as it lands.
  ripple(r) {
    const t = clamp01((this.now - r.t0) / r.dur)
    if (t <= 0 || t >= 1) return
    const e = outCubic(t)
    const h = 0.56 + 0.75 * e
    const ctx = this.ctx
    this.floor()
    ctx.beginPath()
    ctx.rect(r.x - h, r.z - h, 2 * h, 2 * h)
    ctx.globalAlpha = (1 - t) * 0.7
    this.stroke(1, C.ink)
    ctx.globalAlpha = 1
  }
}

function arc(ctx, x, z, r, rev = 1) {
  ctx.moveTo(x + r, z)
  ctx.arc(x, z, r, 0, TAU * rev)
}

function near(v, x, z, r) {
  return x + r > v.x0 && x - r < v.x1 && z + r > v.z0 && z - r < v.z1
}

function fmt(n) {
  return (n < 0 ? '−' : '+') + String(Math.abs(n)).padStart(2, '0')
}
