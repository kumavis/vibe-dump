import { FIELDS, stoneText } from './lexicon.js'
import { pointAt, visibleSpan } from './links.js'
import { isolines } from './island.js'
import { SLAB, GAP, WORD } from './field.js'
import { clamp01, smooth, outCubic } from './ease.js'
import { PAPER, PAPER_2, INK, INK_2, INK_3, OCHRE, font } from './palette.js'

const TAU = Math.PI * 2
// Half the footprint of a word: two slabs side by side, one deep.
const HALF_W = SLAB + GAP.h / 2
const HALF_D = 0.5
// The big field words are set in an ink so pale it is nearly the paper.
const PALE = mix(PAPER, INK_3, 0.34)
// The coast's pen, in CSS pixels: the heaviest line of the map, a touch
// lighter than a shared-root line (1.3, in full ink).
const COAST = 1.2

// The map draws itself before the stones fall (DESIGN §3.3): the coast as a
// pen line, then the waterlines and contours, then the ahupuaʻa boundaries
// running down from the summit to the sea; the trail, streams and places
// last. Seconds from the start. `stones` is when main.js may start dropping
// them: once the boundaries are on their way down.
export const REVEAL = {
  frame: [0, 0.6],
  coast: [0.05, 0.95],
  relief: [0.45, 1.25],
  bounds: [0.9, 1.7],
  marks: [1.2, 1.95],
  labels: [1.45, 2.2],
  stones: 1.35,
}

// Everything printed on the floor: the island as a survey sheet, the eight
// places on it, the star compass at sea, the words' captions and the lines
// between them. This canvas sits *under* the WebGL one, so the stones cover
// whatever runs beneath them and their shadows fall across the lines.
//
// The trick that keeps hairlines hairline: the map is built once as world-
// space Path2Ds, and each frame they are re-projected through the floor's
// affine transform (so circles come out as the right ellipses) and stroked
// under the plain device transform, so the pen stays round and one pixel wide.
// Lines that change every frame are built the same way Jukugo built them:
// traced under the floor transform, stroked under the screen one.
export class FloorPainter {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.dpr = 1
    this.island = null
  }

  resize(w, h, dpr) {
    this.w = w
    this.h = h
    this.dpr = dpr
    this.canvas.width = Math.round(w * dpr)
    this.canvas.height = Math.round(h * dpr)
  }

  // ── transforms ──────────────────────────────────────────────────────────

  floor(scale = 1) {
    const [a, b, c, d, e, f] = this.A
    const k = this.dpr
    this.ctx.setTransform(a * k * scale, b * k * scale, c * k * scale, d * k * scale, e * k, f * k)
  }

  screen() {
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
  }

  device() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
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

  // A world-space path, re-projected into device pixels.
  project(world) {
    const p = new Path2D()
    p.addPath(world, this.M)
    return p
  }

  // Stroke a world-space path; widths and dashes in CSS pixels.
  ink(world, width, color, alpha = 1, dash = null, offset = 0) {
    if (alpha <= 0) return
    const ctx = this.ctx
    this.device()
    ctx.globalAlpha = alpha
    ctx.lineWidth = width * this.dpr
    ctx.strokeStyle = color
    ctx.setLineDash(dash ? dash.map((v) => v * this.dpr) : [])
    ctx.lineDashOffset = offset * this.dpr
    ctx.stroke(this.project(world))
    ctx.globalAlpha = 1
  }

  fillWorld(world, color, alpha = 1) {
    if (alpha <= 0) return
    const ctx = this.ctx
    this.device()
    ctx.globalAlpha = alpha
    ctx.fillStyle = color
    ctx.fill(this.project(world))
    ctx.globalAlpha = 1
  }

  // Stroke the current path (traced under the floor transform).
  stroke(width, color, dash) {
    const ctx = this.ctx
    this.screen()
    ctx.lineWidth = width
    ctx.strokeStyle = color
    ctx.setLineDash(dash ?? [])
    ctx.stroke()
  }

  // Clip away a world-space region: nothing drawn after this lands inside it.
  keepOut(world) {
    const p = new Path2D()
    p.rect(0, 0, this.canvas.width, this.canvas.height)
    p.addPath(world, this.M)
    this.device()
    this.ctx.clip(p, 'evenodd')
  }

  keepIn(world) {
    this.device()
    this.ctx.clip(this.project(world))
  }

  // ── frame ───────────────────────────────────────────────────────────────

  draw(s) {
    const ctx = this.ctx
    const island = s.board.island
    this.A = s.A
    this.now = s.now
    const [a, b, c, d, e, f] = s.A
    const k = this.dpr
    this.M = new DOMMatrix([a * k, b * k, c * k, d * k, e * k, f * k])
    if (this.island !== island) this.prepare(island, s.board.pairs)
    this.device()
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const t = s.intro
    const view = this.visibleRect()

    this.sheet(phase(t, REVEAL.frame))
    this.sea(t)
    this.relief(t)

    // The upland is left alone: from here on nothing reaches into it.
    ctx.save()
    this.keepOut(this.paths.upland)
    this.survey(t)

    const linkedTo = new Map()
    for (const l of s.links.links.values()) {
      if (l.kind === 'field' && l.to === 1) linkedTo.set(l.feature, (linkedTo.get(l.feature) ?? 0) + 1)
    }
    const marks = phase(t, REVEAL.marks)
    const labels = phase(t, REVEAL.labels)
    island.places.forEach((p, i) => {
      if (!near(view, p.x, p.z, p.r + 3)) return
      const rev = outCubic(clamp01(marks * 1.4 - i * 0.05))
      if (rev > 0) this.place(p, rev)
    })
    this.mokuLabels(labels)
    for (const p of island.places) this.fieldLabel(p, labels, linkedTo.get(p) ?? 0)

    // A pair's corner marks are where its stones will land, so they come in
    // with the stones, not with the map under them.
    const set = smooth(clamp01((t - REVEAL.stones) / 0.5))
    const cap = smooth(clamp01((t - REVEAL.stones - 0.6) / 0.8))
    const shown = s.board.pairs.filter((p) => near(view, p.x, p.z, 2.5))
    this.pairMarks(shown, s.noted, set, cap)

    for (const l of s.links.links.values()) if (l.kind === 'field') this.fieldLink(l, s.noted.has(l.pair))
    for (const l of s.links.links.values()) if (l.kind === 'pair') this.pairLink(l)
    for (const l of s.links.links.values()) if (l.kind === 'pair') this.pairLabel(l)

    for (const r of s.ripples) this.ripple(r)
    ctx.restore()
  }

  // ── building the map once ───────────────────────────────────────────────

  prepare(island, pairs) {
    this.island = island
    this.K = island.k
    const lines = (ls) => path(ls.map((l) => l.pts ?? l))
    const { sheet } = island
    const frame = new Path2D()
    frame.rect(sheet.x0, sheet.z0, sheet.x1 - sheet.x0, sheet.z1 - sheet.z0)
    const c = island.compass
    // The compass and its credit, kept clear of the sea's linework.
    const disc = new Path2D()
    disc.arc(c.x, c.z, c.r * 1.13, 0, TAU)
    this.paths = {
      frame,
      disc,
      coast: lines(island.coast),
      minor: minorContours(island),
      major: lines(island.contours.filter((l) => l.major).flatMap((l) => l.lines)),
      water: island.waterlines.map((w) => lines(w.lines)),
      ahupuaa: path(island.boundaries.filter((b) => !b.moku).map((b) => b.line)),
      moku: path(island.boundaries.filter((b) => b.moku).map((b) => b.line)),
      offshore: path(island.boundaries.map((b) => b.sea)),
      trail: path(island.trail.firm),
      trailFlow: path(island.trail.flow),
      windward: lines(island.streams.filter((s) => s.windward)),
      leeward: lines(island.streams.filter((s) => !s.windward)),
      reef: dots(island.reef.dots),
      upland: path([island.upland.ring], true),
      form: lines(island.upland.form),
      pond: path([island.places.find((p) => p.kind === 'fishpond').line], true),
      cloud: path([island.places.find((p) => p.kind === 'cloud').line], true),
    }
    this.placeArt = new Map(island.places.map((p) => [p, this.art(p)]))
    this.crests = null
    this.surfAt = null
    this.layoutLabels(island, pairs)
    this.compassType(c)
  }

  // The static linework of one place, as world paths.
  art(p) {
    const K = this.K
    switch (p.kind) {
      case 'compass': {
        const { x, z, r, horizon } = p
        const rings = new Path2D()
        rings.arc(x, z, r, 0, TAU)
        rings.moveTo(x + horizon, z)
        rings.arc(x, z, horizon, 0, TAU)
        const spokes = new Path2D()
        const cardinal = new Path2D()
        for (const h of p.houses) {
          // The line between this house and the one before it…
          const [bx, bz] = dirOf(h.bearing - TAU / 64)
          spokes.moveTo(x + bx * horizon, z + bz * horizon)
          spokes.lineTo(x + bx * r, z + bz * r)
          // …and a tick on the rim at the house's own point.
          const [dx, dz] = dirOf(h.bearing)
          spokes.moveTo(x + dx * r, z + dz * r)
          spokes.lineTo(x + dx * r * 1.04, z + dz * r * 1.04)
          if (!h.cardinal) continue
          // The four cardinal houses are shaded, as on the PVS diagram.
          const a0 = h.bearing - TAU / 64 - Math.PI / 2
          const a1 = h.bearing + TAU / 64 - Math.PI / 2
          cardinal.moveTo(x + Math.cos(a0) * horizon, z + Math.sin(a0) * horizon)
          cardinal.arc(x, z, r, a0, a1)
          cardinal.arc(x, z, horizon, a1, a0, true)
          cardinal.closePath()
        }
        const axes = new Path2D()
        for (const b of [0, Math.PI / 2]) {
          const [dx, dz] = dirOf(b)
          axes.moveTo(x - dx * horizon, z - dz * horizon)
          axes.lineTo(x + dx * horizon, z + dz * horizon)
        }
        const centre = new Path2D()
        centre.arc(x, z, r * 0.035, 0, TAU)
        return { rings, spokes, cardinal, axes, centre }
      }
      case 'fishpond': {
        // The kuapā: a stone wall drawn as two lines with the stones' joints
        // ticked between them, broken where the mākāhā let water through.
        const gaps = p.gates.map((g) => [g.x, g.z, g.w / 2])
        const wall = new Path2D()
        const joints = new Path2D()
        const w = 0.045 * K
        const frames = frameLine(densify(p.line, 0.02 * K))
        for (const side of [-1, 1]) {
          let pen = false
          for (const [x, z, nx, nz] of frames) {
            const open = gaps.some(([gx, gz, gr]) => Math.hypot(x - gx, z - gz) < gr)
            if (open) {
              pen = false
              continue
            }
            const px = x + nx * w * side
            const pz = z + nz * w * side
            if (pen) wall.lineTo(px, pz)
            else wall.moveTo(px, pz)
            pen = true
          }
        }
        frames.forEach(([x, z, nx, nz], i) => {
          if (i % 5 || gaps.some(([gx, gz, gr]) => Math.hypot(x - gx, z - gz) < gr)) return
          joints.moveTo(x - nx * w, z - nz * w)
          joints.lineTo(x + nx * w, z + nz * w)
        })
        const gates = new Path2D()
        for (const g of p.gates) {
          // The channel's two cheeks, and the grate across it.
          const nx = -g.dz
          const nz = g.dx
          for (const side of [-1, 1]) {
            const cx = g.x + g.dx * side * g.w * 0.5
            const cz = g.z + g.dz * side * g.w * 0.5
            gates.moveTo(cx - nx * w * 2, cz - nz * w * 2)
            gates.lineTo(cx + nx * w * 2, cz + nz * w * 2)
          }
          gates.moveTo(g.x - g.dx * g.w * 0.5, g.z - g.dz * g.w * 0.5)
          gates.lineTo(g.x + g.dx * g.w * 0.5, g.z + g.dz * g.w * 0.5)
          for (let i = -1.5; i <= 1.5; i++) {
            const sx = g.x + g.dx * g.w * 0.22 * i
            const sz = g.z + g.dz * g.w * 0.22 * i
            gates.moveTo(sx - nx * w * 0.8, sz - nz * w * 0.8)
            gates.lineTo(sx + nx * w * 0.8, sz + nz * w * 0.8)
          }
        }
        return { wall, joints, gates }
      }
      case 'lava':
        return {
          edge: path(p.edges),
          lobes: path(p.lobes),
          ropes: path(p.ropes),
          stipple: dots(p.stipple),
        }
      case 'loi':
        return { banks: path(p.terraces, true), auwai: path([p.auwai, p.drain]) }
      case 'kauhale': {
        const paepae = path(
          p.houses.map((h) => h.paepae),
          true,
        )
        const roofs = path(
          p.houses.filter((h) => h.roof).map((h) => h.roof),
          true,
        )
        const ridges = path(p.houses.filter((h) => h.roof).flatMap((h) => [h.ridge, ...h.hips]))
        // Thatch: strokes down each roof slope, square to the ridge.
        const thatch = new Path2D()
        for (const h of p.houses) {
          if (!h.roof) continue
          const [a, b, c, d] = h.roof
          for (let i = 1; i < 9; i++) {
            const f = i / 9
            const top = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]
            const bot = [d[0] + (c[0] - d[0]) * f, d[1] + (c[1] - d[1]) * f]
            for (const [from, toward] of [
              [top, bot],
              [bot, top],
            ]) {
              thatch.moveTo(...from)
              thatch.lineTo(from[0] + (toward[0] - from[0]) * 0.32, from[1] + (toward[1] - from[1]) * 0.32)
            }
          }
        }
        return { paepae, roofs, ridges, thatch }
      }
      case 'halau':
        return {
          shed: path([p.shed], true),
          ridge: path([p.ridge]),
          thatch: path(p.thatch),
          hulls: path(p.hulls, true),
          beams: path([...p.beams, p.deck]),
          sand: dots(p.sand),
        }
      case 'cloud':
        return {}
      case 'stream':
        return { line: path([p.line]) }
    }
    return {}
  }

  // ── labels ──────────────────────────────────────────────────────────────

  measure(text, px, opts, spacing = 0) {
    const ctx = this.ctx
    ctx.font = font(px, opts)
    ctx.letterSpacing = `${spacing}px`
    const w = ctx.measureText(text).width
    ctx.letterSpacing = '0px'
    return w / 100
  }

  // Each place gets its field's name set beside it, the Hawaiian word large
  // and pale in the italic with a small-caps line beneath; each moku its name
  // across its slopes. Positions are chosen once, from many candidates round
  // each place: near it, and clear of the words (which never move), of the
  // upland and the cloud round it, of the other places and names, of the
  // boundary lines where it can be, and inside the sheet.
  layoutLabels(island, pairs) {
    const K = this.K
    const word = Math.round(92 * K)
    const small = Math.round(17 * Math.max(0.9, K))
    this.labelSize = { word, small, gap: 0.36 * Math.max(0.9, K) }
    const taken = []
    const cloud = island.places.find((p) => p.kind === 'cloud')
    const lava = island.places.find((p) => p.kind === 'lava')
    const compass = island.compass
    const { sheet } = island
    // Compact places block by their circle; the long ones, and the
    // boundaries, by their lines, and the lava by its whole flow too; the
    // cloud by the whole summit it rings.
    const long = (p) => p.kind === 'stream' || p.kind === 'lava'
    const blockers = island.places
      .filter((p) => !long(p) && p !== cloud)
      .map((p) => ({ p, x: p.x, z: p.z, r: p === compass ? p.r * 1.28 : p.r }))
    // The long places and the boundaries as points a tenth of a unit apart,
    // each with what it costs a name to sit on it, filed by unit square.
    const lineCost = new Map()
    const lines = [
      ...island.places.filter(long).map((p) => ({ own: p, cost: 400, line: p.line })),
      ...island.boundaries.map((b) => ({ own: null, cost: b.moku ? 120 : 40, line: b.line })),
    ]
    for (const { own, cost, line } of lines) {
      for (const [x, z] of densify(line, 0.1)) {
        const key = Math.floor(x) * 4096 + Math.floor(z)
        if (!lineCost.has(key)) lineCost.set(key, [])
        lineCost.get(key).push({ x, z, own, cost })
      }
    }
    // What a word hides of the floor (field.js WORD.hides, the box the board
    // keeps its connector names out of too): its marks and the caption typed
    // in beneath it, and behind it the stones themselves, which stand a unit
    // high and cover the floor beyond them on screen. A long gloss runs on to
    // the right of the marks: that is a lesser cost.
    const h = WORD.hides
    const words = pairs.map((p) => ({ x0: p.x + h.x0, x1: p.x + h.x1, z0: p.z + h.z0, z1: p.z + h.z1 }))
    const glosses = pairs.map((p) => ({ x0: p.x + h.x1, x1: p.x + h.x1 + 1.6, z0: p.z + 0.85, z1: p.z + h.z1 }))

    // What it costs to set a name in `box`; `air` keeps it that far from the
    // names already set. Every term is a cost, so a candidate is dropped as
    // soon as it costs more than the best so far, `limit` — most are, at the
    // first word they cover.
    const NO_LINES = []
    const score = (box, own, air, limit) => {
      // Nearer the middle of the floor is in view more often.
      let s = Math.hypot((box.x0 + box.x1) / 2, (box.z0 + box.z1) / 2) * 3
      if (box.x0 < sheet.x0 + 0.3 || box.x1 > sheet.x1 - 0.3 || box.z0 < sheet.z0 + 0.3 || box.z1 > sheet.z1 - 0.3) {
        s += 1e7
      }
      for (const w of words) s += 1e6 * overlap(box, w)
      if (s >= limit) return s
      const roomy = air ? { x0: box.x0 - air, x1: box.x1 + air, z0: box.z0 - air, z1: box.z1 + air } : box
      for (const o of taken) s += 1e6 * overlap(roomy, o)
      if (s >= limit) return s
      if (own === cloud ? touchesRing(box, island.upland.ring) : boxCircle(box, cloud.x, cloud.z, cloud.r + 0.2)) {
        s += 1e7
      }
      for (const b of blockers) {
        if (b.p === own) continue
        const o = boxCircle(box, b.x, b.z, b.r + 0.15)
        if (o) s += b.p === compass ? 1e7 : 3e3 * o
      }
      if (own !== lava && touchesRing(box, lava.line)) s += 2e4
      for (const g of glosses) s += 2e4 * overlap(box, g)
      if (s >= limit) return s
      for (let ix = Math.floor(box.x0); ix <= Math.floor(box.x1); ix++) {
        for (let iz = Math.floor(box.z0); iz <= Math.floor(box.z1); iz++) {
          for (const q of lineCost.get(ix * 4096 + iz) ?? NO_LINES) {
            if (q.own !== own && q.x > box.x0 && q.x < box.x1 && q.z > box.z0 && q.z < box.z1) s += q.cost
          }
        }
      }
      if (own) {
        const g = island.height
        const wet = sampleGrid(g, g.h, (box.x0 + box.x1) / 2, (box.z0 + box.z1) / 2) <= 0
        const water = own.kind === 'fishpond' || own.kind === 'compass'
        if (wet !== water) s += water ? 600 : 250
      }
      return s
    }
    // The cheapest candidate; `extra` is its own cost on top of `score`.
    const best = (candidates, own, air, extra) => {
      let found = null
      let least = Infinity
      for (const box of candidates) {
        const add = extra(box)
        const sc = score(box, own, air, least - add) + add
        if (sc < least) {
          least = sc
          found = box
        }
      }
      return found
    }
    const boxAt = (cx, cz, w, h) => ({ x0: cx - w / 2, x1: cx + w / 2, z0: cz - h / 2, z1: cz + h / 2 })

    this.labels = new Map()
    for (const p of island.places) {
      const info = FIELDS[p.field]
      const w = Math.max(
        this.measure(info.label, word, { italic: true }),
        this.measure(`${info.label.toUpperCase()} · ${info.en.toUpperCase()} — 00`, small, { weight: 600 }, 1.5) + 0.06,
      )
      const top = (word / 100) * 0.74
      const h = top + this.labelSize.gap + 0.06
      const pad = 0.25 * K
      // Candidates at a few distances out from the place, each costing a
      // little more the further it strays.
      const candidates = []
      if (long(p)) {
        const pts = p.kind === 'stream' ? p.line : p.axis
        const reach = p.kind === 'lava' ? 1.0 * K : 0
        for (let f = 0.1; f <= 0.91; f += 0.05) {
          const i = Math.round(f * (pts.length - 1))
          const [x, z] = pts[i]
          const [x2, z2] = pts[Math.min(pts.length - 1, i + 1)]
          const l = Math.hypot(x2 - x, z2 - z) || 1
          const nx = -(z2 - z) / l
          const nz = (x2 - x) / l
          for (const side of [-1, 1]) {
            for (const gap of [0, 0.5, 1.1, 1.8]) {
              const ux = nx * side
              const uz = nz * side
              const d = pad + reach + gap * K
              candidates.push({ ...boxAt(x + ux * d + (ux * w) / 2, z + uz * d + (uz * h) / 2, w, h), gap })
            }
          }
        }
      } else {
        for (let i = 0; i < 24; i++) {
          const a = (i / 24) * TAU
          const ux = Math.cos(a)
          const uz = Math.sin(a)
          // The cloud is a ring round an irregular upland, not a circle: go
          // out to its edge in this direction.
          const r = p === cloud ? rayOut(p.line, p.x, p.z, ux, uz) : p.kind === 'compass' ? p.r * 1.3 : p.r
          for (const gap of [0, 0.5, 1.1, 1.8, 2.6]) {
            const d = r + pad + gap * K
            candidates.push({ ...boxAt(p.x + ux * d + (ux * w) / 2, p.z + uz * d + (uz * h) / 2, w, h), gap })
          }
        }
      }
      const box = best(candidates, p, 0, (b) => 500 * b.gap)
      taken.push(box)
      this.labels.set(p, { x: box.x0, z: box.z0 + top, box })
    }

    // The two moku, in spaced roman capitals across their own slopes, kept
    // well apart from the field names so neither reads as part of the other.
    const mokuPx = Math.round(34 * K)
    this.moku = island.moku.map((mk) => {
      const text = mk.name.toUpperCase()
      const spacing = mokuPx * 0.5
      const w = this.measure(text, mokuPx, {}, spacing)
      const h = (mokuPx / 100) * 0.9
      const candidates = []
      for (let db = -0.9; db <= 0.91; db += 0.15) {
        const b = mk.bearing + db
        const reach = coastReach(island, b)
        const [dx, dz] = dirOf(b)
        for (let f = 0.3; f <= 0.86; f += 0.06) {
          const cx = island.summit[0] + dx * reach * f
          const cz = island.summit[1] + dz * reach * f
          candidates.push({ ...boxAt(cx, cz, w, h), db })
        }
      }
      const box = best(candidates, null, 0.9, (b) => Math.abs(b.db) * 40)
      taken.push(box)
      return { text, px: mokuPx, spacing, x: box.x0, z: box.z1 - 0.1 * h, box }
    })

    // Contours, boundaries and the trail break around the names and the
    // drawn places, as they would on a sheet drawn by hand — each gap opening
    // as the thing it makes room for appears.
    const gaps = [...this.labels.values(), ...this.moku].map(({ box }) => {
      const g = new Path2D()
      const e = 0.08
      g.rect(box.x0 - e, box.z0 - e, box.x1 - box.x0 + 2 * e, box.z1 - box.z0 + 2 * e)
      return { path: g, when: REVEAL.labels }
    })
    for (const p of island.places) {
      if (p.kind === 'kauhale' || p.kind === 'halau') {
        const g = new Path2D()
        g.arc(p.x, p.z, p.r * 0.95, 0, TAU)
        gaps.push({ path: g, when: REVEAL.marks })
      } else if (p.kind === 'loi') {
        gaps.push({ path: path([p.line], true), when: REVEAL.marks })
      }
    }
    this.gaps = gaps
  }

  fieldLabel(p, a, linked) {
    if (a <= 0) return
    const L = this.labels.get(p)
    const info = FIELDS[p.field]
    const ctx = this.ctx
    this.floor(0.01)
    ctx.globalAlpha = a
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = PALE
    ctx.font = font(this.labelSize.word, { italic: true })
    ctx.fillText(info.label, L.x * 100, L.z * 100)
    ctx.fillStyle = INK_3
    ctx.font = font(this.labelSize.small, { weight: 600 })
    ctx.letterSpacing = '1.5px'
    ctx.fillText(
      `${info.label.toUpperCase()} · ${info.en.toUpperCase()} — ${String(linked).padStart(2, '0')}`,
      L.x * 100 + 4,
      (L.z + this.labelSize.gap) * 100,
    )
    ctx.letterSpacing = '0px'
    ctx.globalAlpha = 1
  }

  mokuLabels(a) {
    if (a <= 0) return
    const ctx = this.ctx
    this.floor(0.01)
    ctx.globalAlpha = a * 0.75
    ctx.fillStyle = INK_3
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    for (const m of this.moku) {
      ctx.font = font(m.px)
      ctx.letterSpacing = `${m.spacing}px`
      ctx.fillText(m.text, m.x * 100, m.z * 100)
    }
    ctx.letterSpacing = '0px'
    ctx.globalAlpha = 1
  }

  // ── the sheet, the sea and the land ─────────────────────────────────────

  // The neatline: a heavy and a fine rule round the sheet, with a graduated
  // border between them, alternate units filled.
  sheet(a) {
    if (a <= 0) return
    const { sheet } = this.island
    const m = 0.16 * this.K
    const inner = new Path2D()
    inner.rect(sheet.x0 + m, sheet.z0 + m, sheet.x1 - sheet.x0 - 2 * m, sheet.z1 - sheet.z0 - 2 * m)
    this.ink(this.paths.frame, 1.4, INK_2, a)
    this.ink(inner, 0.7, INK_3, a)
    const bars = new Path2D()
    const h = m * 0.5
    for (let x = Math.ceil(sheet.x0); x < sheet.x1 - 1; x += 2) {
      bars.rect(x, sheet.z0, 1, h)
      bars.rect(x, sheet.z1 - h, 1, h)
    }
    for (let z = Math.ceil(sheet.z0); z < sheet.z1 - 1; z += 2) {
      bars.rect(sheet.x0, z, h, 1)
      bars.rect(sheet.x1 - h, z, h, 1)
    }
    this.fillWorld(bars, INK_3, a * 0.55)
  }

  // Waterlines following the coast out to sea, wider and fainter outward; the
  // trade swell rolling in from the northeast; the reef and its surf. All of
  // it inside the neatline and clear of the compass.
  sea(t) {
    const ctx = this.ctx
    const relief = phase(t, REVEAL.relief)
    ctx.save()
    this.keepIn(this.paths.frame)
    this.keepOut(this.paths.disc)
    const n = this.paths.water.length
    ctx.save()
    this.keepOut(this.paths.pond)
    this.paths.water.forEach((p, i) => {
      const a = smooth(clamp01(relief * 1.6 - i * 0.08))
      this.ink(p, 0.75, INK_3, a * (0.06 + 0.6 * Math.pow(1 - i / n, 1.5)))
    })
    ctx.restore()
    const swell = smooth(phase(t, [REVEAL.marks[0], REVEAL.marks[1] + 1]))
    if (swell > 0) this.swell(swell)
    const marks = phase(t, REVEAL.marks)
    this.ink(this.paths.reef, 1.5, INK_2, marks * 0.7, [0.01, 1e4])
    this.surf(marks)
    ctx.restore()
  }

  // Crests are where the swell's arrival time is a whole number of wavelengths
  // behind the clock: the zero line of sin(2π(T/λ − phase)) where its cosine
  // is positive (the other half are troughs). They move a fraction of a pixel
  // a frame, so they're traced afresh only every few frames.
  swell(a) {
    const sw = this.island.swell
    const ph = (this.now / sw.period) % 1
    if (!this.crests || Math.abs(ph - this.crests.ph) * sw.lambda > 0.02) {
      const S = this.crests?.S ?? new Float32Array(sw.nx * sw.nz)
      for (let i = 0; i < S.length; i++) {
        S[i] = Number.isFinite(sw.T[i]) ? Math.sin(TAU * (sw.T[i] / sw.lambda - ph)) : -1
      }
      const buckets = [new Path2D(), new Path2D(), new Path2D()]
      for (const line of isolines({ ...sw, h: S }, 0)) {
        let run = null
        let runBucket = -1
        for (const [x, z] of line.pts) {
          const T = sampleGrid(sw, sw.T, x, z)
          const crest = Number.isFinite(T) && Math.cos(TAU * (T / sw.lambda - ph)) > 0
          const b = crest ? Math.min(3, Math.floor(sampleGrid(sw, sw.energy, x, z) * 4)) - 1 : -1
          if (b !== runBucket) {
            if (run && runBucket >= 0) run.lineTo(x, z)
            run = b >= 0 ? buckets[b] : null
            if (run) run.moveTo(x, z)
            runBucket = b
          } else if (run) run.lineTo(x, z)
        }
      }
      this.crests = { ph, buckets, S }
    }
    this.crests.buckets.forEach((p, i) => this.ink(p, 0.8, INK_3, a * [0.16, 0.28, 0.42][i], [6, 7]))
  }

  // Surf marks on the reef's outer edge brighten as each crest arrives. A
  // mark changes brightness a few times a swell period, so the marks are
  // sorted into their three shades only when the phase has moved on a little.
  surf(a) {
    if (a <= 0) return
    const sw = this.island.swell
    const at = Math.floor(((this.now / sw.period) % 1) * 240)
    if (this.surfAt?.at !== at) {
      const ph = at / 240
      const buckets = [new Path2D(), new Path2D(), new Path2D()]
      for (const m of this.island.reef.surf) {
        const T = sampleGrid(sw, sw.T, m.x, m.z)
        const u = Number.isFinite(T) ? (((T / sw.lambda - ph) % 1) + 1) % 1 : 0.5
        const p = buckets[Math.min(2, Math.floor(Math.pow(Math.cos(Math.PI * u), 8) * 3))]
        p.moveTo(m.pts[0][0], m.pts[0][1])
        for (let i = 1; i < m.pts.length; i++) p.lineTo(m.pts[i][0], m.pts[i][1])
      }
      this.surfAt = { at, buckets }
    }
    this.surfAt.buckets.forEach((p, i) => this.ink(p, 0.8, INK_2, a * [0.3, 0.5, 0.8][i]))
  }

  // Contours (fine, every fifth heavier), then the coast drawn on as one pen
  // line. Contours run through the upland — they're the only thing that does,
  // with the dashed half-interval ones that show its gentle rise.
  //
  // The coast is the strongest line of the map but in the map's brown, not
  // black: as in Jukugo, full ink is kept for the lines between words, so
  // where one crosses the shore it's clear which is which.
  relief(t) {
    const ctx = this.ctx
    const a = smooth(phase(t, REVEAL.relief))
    if (a > 0) {
      // The floor's smallest scale on screen, in CSS pixels per unit: how far
      // apart contours of a given spacing are drawn at the narrowest.
      const [p, q, r, u] = this.A
      const sum = p * p + q * q + r * r + u * u
      const det = p * u - q * r
      const px = Math.sqrt(Math.max(0, (sum - Math.sqrt(Math.max(0, sum * sum - 4 * det * det))) / 2))
      this.broken(t, (k) => {
        for (const { lo, path: run } of this.paths.minor) {
          this.ink(run, 0.7, INK_3, a * k * 0.32 * smooth(clamp01((lo * px - 3) / 2)))
        }
        this.ink(this.paths.major, 1.05, INK_3, a * k * 0.8)
      })
      ctx.save()
      this.keepIn(this.paths.upland)
      this.ink(this.paths.form, 0.7, INK_3, a * 0.4, [4, 3])
      ctx.restore()
    }
    const c = phase(t, REVEAL.coast)
    if (c >= 1) {
      this.ink(this.paths.coast, COAST, INK_2)
    } else if (c > 0) {
      const p = new Path2D()
      for (const ring of this.island.coast) {
        const n = Math.max(2, Math.ceil(ring.pts.length * outCubic(c)))
        p.moveTo(...ring.pts[0])
        for (let i = 1; i < n; i++) p.lineTo(...ring.pts[i])
      }
      this.ink(p, COAST, INK_2)
    }
  }

  // Draw linework that breaks round the gaps: in full outside them, and
  // inside each one fading out as its gap opens. `draw(k)` strokes at k × its
  // alpha.
  broken(t, draw) {
    const ctx = this.ctx
    // Each gap as a clip keeping what lies outside it, projected once a frame
    // for all the linework that breaks.
    if (this.gapsAt !== this.M) {
      this.gapsAt = this.M
      this.gapsOut = this.gaps.map((g) => {
        const p = new Path2D()
        p.rect(0, 0, this.canvas.width, this.canvas.height)
        p.addPath(g.path, this.M)
        return p
      })
    }
    ctx.save()
    this.device()
    for (const p of this.gapsOut) ctx.clip(p, 'evenodd')
    draw(1)
    ctx.restore()
    for (const g of this.gaps) {
      const k = 1 - phase(t, g.when)
      if (k <= 0) continue
      ctx.save()
      this.keepIn(g.path)
      draw(k)
      ctx.restore()
    }
  }

  // Boundaries in ʻalaea red from the upland's edge to the reef, the moku
  // line heavier and the ahupuaʻa lighter, so the one reads above the many
  // and the active field line (ʻalaea too) stands out from both; the ala loa
  // dotted round the island with an ahu wherever a boundary crosses it; one
  // stream to each ahupuaʻa.
  survey(t) {
    const island = this.island
    const ctx = this.ctx
    const bd = phase(t, REVEAL.bounds)
    // Under the cloud band the boundaries are faint: they come out of the
    // cloud rather than meeting at the summit like spokes. Like the contours,
    // they break round the names.
    const bounds = (land, moku) =>
      this.broken(t, (k) => {
        ctx.save()
        this.keepIn(this.paths.cloud)
        this.ink(land, 0.9, OCHRE, k * 0.12)
        this.ink(moku, 1.9, OCHRE, k * 0.25, [10, 3, 1.5, 3])
        ctx.restore()
        ctx.save()
        this.keepOut(this.paths.cloud)
        this.ink(land, 0.9, OCHRE, k * 0.45)
        this.ink(moku, 1.9, OCHRE, k * 0.85, [10, 3, 1.5, 3])
        ctx.restore()
      })
    if (bd >= 1) {
      bounds(this.paths.ahupuaa, this.paths.moku)
      this.ink(this.paths.offshore, 0.9, OCHRE, 0.35, [2.5, 3.5])
    } else if (bd > 0) {
      // Running down from the summit: each boundary a little after the last,
      // round the island.
      const land = new Path2D()
      const moku = new Path2D()
      island.boundaries.forEach((b, i) => {
        const f = clamp01(bd * 1.5 - (i / island.boundaries.length) * 0.5)
        const into = b.moku ? moku : land
        const n = Math.ceil(b.line.length * smooth(f))
        if (n < 2) return
        into.moveTo(...b.line[0])
        for (let j = 1; j < n; j++) into.lineTo(...b.line[j])
      })
      bounds(land, moku)
    }
    const m = phase(t, REVEAL.marks)
    if (m <= 0) return
    this.ink(this.paths.windward, 0.95, INK_2, m * 0.75)
    this.ink(this.paths.leeward, 0.85, INK_3, m * 0.85, [4, 2.5])
    this.broken(t, (k) => {
      this.ink(this.paths.trail, 1.35, INK_2, m * k * 0.8, [0.01, 3.4])
      this.ink(this.paths.trailFlow, 1.35, INK_2, m * k * 0.8, [0.01, 7])
    })
    // Ahu: a small cairn of stacked stones, unlabelled, drawn upright.
    this.screen()
    ctx.globalAlpha = m
    ctx.setLineDash([])
    ctx.lineWidth = 0.9
    ctx.strokeStyle = INK_2
    ctx.fillStyle = PAPER
    for (const [x, z] of island.ahu) {
      const [sx, sy] = this.toScreen(x, z)
      ctx.beginPath()
      for (const [ox, oy, r] of [
        [-2.1, 0, 1.75],
        [2.1, 0, 1.75],
        [0, -2.9, 1.6],
      ]) {
        ctx.moveTo(sx + ox + r, sy + oy)
        ctx.arc(sx + ox, sy + oy, r, 0, TAU)
      }
      ctx.fill()
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  }

  // ── the eight places ────────────────────────────────────────────────────

  place(p, rev) {
    const art = this.placeArt.get(p)
    const t = this.now
    const K = this.K
    const ctx = this.ctx
    switch (p.kind) {
      case 'compass':
        this.compass(p, art, rev)
        break
      case 'fishpond': {
        this.ink(art.wall, 0.9, INK_2, rev)
        this.ink(art.joints, 0.6, INK_3, rev * 0.8)
        this.ink(art.gates, 0.8, INK_2, rev)
        // Fish rising in the pond: a ring now and then, spreading and gone.
        this.floor()
        ctx.beginPath()
        for (const ring of p.rings) {
          const u = ((t + ring.phase) % ring.period) / 2.6
          if (u >= 1) continue
          const r = (0.04 + 0.3 * outCubic(u)) * K
          ctx.moveTo(ring.x + r, ring.z)
          ctx.arc(ring.x, ring.z, r, 0, TAU)
        }
        ctx.globalAlpha = rev * 0.55
        this.stroke(0.7, INK_3)
        ctx.globalAlpha = 1
        break
      }
      case 'lava':
        this.ink(art.edge, 1, INK_2, rev)
        this.ink(art.lobes, 0.8, INK_2, rev * 0.8)
        this.ink(art.ropes, 0.65, INK_3, rev * 0.85)
        this.ink(art.stipple, 1.1, INK_2, rev * 0.6, [0.01, 1e4])
        break
      case 'loi':
        // Standing water in each terrace, a shade darker than the paper.
        this.fillWorld(art.banks, PALE, rev * 0.6)
        this.ink(art.banks, 0.85, INK_2, rev)
        // Water moving down the ʻauwai and back to the stream.
        this.ink(art.auwai, 0.9, INK_2, rev * 0.85, [2.5, 2.5], -t * 5)
        break
      case 'kauhale':
        this.ink(art.paepae, 0.85, INK_2, rev)
        this.ink(art.thatch, 0.55, INK_3, rev * 0.9)
        this.ink(art.roofs, 0.8, INK_2, rev)
        this.ink(art.ridges, 0.7, INK_2, rev)
        break
      case 'halau':
        this.ink(art.sand, 1, INK_3, rev * 0.6, [0.01, 1e4])
        this.ink(art.thatch, 0.55, INK_3, rev * 0.9)
        this.ink(art.shed, 0.85, INK_2, rev)
        this.ink(art.ridge, 0.75, INK_2, rev)
        this.ink(art.hulls, 0.85, INK_2, rev)
        this.ink(art.beams, 0.75, INK_2, rev)
        break
      case 'cloud':
        this.cloud(p, rev)
        break
      case 'stream':
        // The largest stream, heavier than the others but not the coast, with
        // flow marks running downstream.
        this.ink(art.line, 1.2, INK_2, rev * 0.9)
        this.ink(art.line, 1.6, INK, rev * 0.7, [1.2, 11], -t * 7)
        break
    }
  }

  // The cloud cap: fine hatching in a band round the upland (its ragged inner
  // edge is island.js's), thinned by a slow pattern that drifts round the
  // summit.
  cloud(p, rev) {
    const t = this.now
    const ctx = this.ctx
    const seed = this.island.seed
    const pa = (seed * 0.37) % TAU
    const pb = (seed * 0.71) % TAU
    const buckets = [[], [], []]
    for (const s of p.strokes) {
      const d =
        0.55 +
        0.3 * Math.sin(3 * s.b - t * 0.021 + pa) +
        0.2 * Math.sin(5 * s.b + t * 0.013 + pb) +
        0.12 * Math.sin(11 * s.b - t * 0.034)
      const v = d * Math.pow(Math.sin(Math.PI * s.f), 0.5)
      if (v < 0.3) continue
      buckets[Math.min(2, Math.floor((v - 0.3) * 5))].push(s)
    }
    buckets.forEach((list, i) => {
      if (!list.length) return
      this.floor()
      ctx.beginPath()
      for (const s of list) {
        ctx.moveTo(s.x0, s.z0)
        ctx.lineTo(s.x1, s.z1)
      }
      ctx.globalAlpha = rev * [0.25, 0.42, 0.6][i]
      this.stroke(0.6, INK_3)
    })
    ctx.globalAlpha = 1
  }

  // The star compass (research/TERMS.md): thirty-two houses, the cardinal
  // points among them, names in the band between horizon and rim, the four
  // quadrants inside. One star at a time rises in a house on the east side
  // and sets, about a minute later, in the house of the same name on the west.
  compass(p, art, rev) {
    const ctx = this.ctx
    const { x, z, horizon } = p
    this.fillWorld(art.cardinal, PALE, rev * 0.8)
    this.ink(art.rings, 1, INK_2, rev)
    this.ink(art.spokes, 0.7, INK_3, rev)
    this.ink(art.axes, 0.6, INK_3, rev * 0.6, [2, 4])
    this.ink(art.centre, 0.8, INK_2, rev)

    // The star of the moment. Each one takes a minute to cross and is gone
    // for six seconds before the next rises.
    const cycle = 66
    const n = Math.floor(this.now / cycle)
    const star = p.stars[((n % p.stars.length) + p.stars.length) % p.stars.length]
    const u = (this.now - n * cycle) / 60
    const show = u <= 1 ? smooth(clamp01(u * 12)) * smooth(clamp01((1 - u) * 12)) : 0
    const at = (q) => [x + q[0] * horizon, z + q[1] * horizon]
    if (show > 0) {
      const pts = star.path
      const cut = u * (pts.length - 1)
      // The whole arc faint and dotted, the part travelled drawn in.
      this.floor()
      ctx.beginPath()
      pts.forEach((q, i) => (i ? ctx.lineTo(...at(q)) : ctx.moveTo(...at(q))))
      ctx.globalAlpha = rev * show * 0.6
      this.stroke(0.9, INK_3, [0.01, 3])
      this.floor()
      ctx.beginPath()
      ctx.moveTo(...at(pts[0]))
      for (let i = 1; i <= Math.floor(cut); i++) ctx.lineTo(...at(pts[i]))
      const i0 = Math.floor(cut)
      const f = cut - i0
      const q0 = pts[i0]
      const q1 = pts[Math.min(pts.length - 1, i0 + 1)]
      const head = at([q0[0] + (q1[0] - q0[0]) * f, q0[1] + (q1[1] - q0[1]) * f])
      ctx.lineTo(...head)
      ctx.globalAlpha = rev * show * 0.8
      this.stroke(0.9, INK_2)
      const [sx, sy] = this.toScreen(...head)
      this.screen()
      ctx.globalAlpha = rev * show
      ctx.fillStyle = INK
      ctx.beginPath()
      ctx.arc(sx, sy, 2.3, 0, TAU)
      ctx.fill()
      ctx.strokeStyle = INK
      ctx.lineWidth = 0.8
      ctx.beginPath()
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2
        ctx.moveTo(sx + Math.cos(a) * 3.8, sy + Math.sin(a) * 3.8)
        ctx.lineTo(sx + Math.cos(a) * 6.5, sy + Math.sin(a) * 6.5)
      }
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    // Names, set out once by compassType().
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    let styled = null
    for (const h of this.compassNames) {
      const lit = show > 0 && h.name === star.name && (h.quadrant === star.rises || h.quadrant === star.sets)
      const st = lit ? h.lit : h.style
      this.floor(0.01)
      ctx.translate(h.x * 100, h.z * 100)
      ctx.rotate(h.ang)
      if (st !== styled) {
        ctx.font = st.font
        ctx.letterSpacing = st.spacing
        styled = st
      }
      ctx.fillStyle = h.cardinal || lit ? INK : INK_2
      ctx.globalAlpha = rev * (h.cardinal || lit ? 1 : 0.85)
      ctx.fillText(h.text, 0, 0)
    }
    this.floor(0.01)
    ctx.globalAlpha = rev
    ctx.letterSpacing = '0px'
    ctx.font = this.compassQuadrantFont
    ctx.fillStyle = INK_3
    for (const q of p.quadrants) {
      const [dx, dz] = dirOf(q.bearing)
      ctx.fillText(q.name, (x + dx * horizon * 0.6) * 100, (z + dz * horizon * 0.6) * 100)
    }
    // The credit, small, round the outside of the rim under Hema.
    ctx.font = this.compassCredit.font
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.globalAlpha = rev * 0.9
    for (const ch of this.compassCredit.chars) {
      this.floor(0.01)
      ctx.translate(ch.x * 100, ch.z * 100)
      ctx.rotate(ch.ang)
      ctx.fillText(ch.text, 0, 0)
    }
    ctx.globalAlpha = 1
  }

  // The compass's lettering, measured and placed once. House names sit in the
  // band between horizon and rim, reading outward on the east side and inward
  // on the west, so none is upside down. The cardinal points are houses too,
  // set in their shaded houses a little heavier; a long name is set smaller to
  // fit the band; the two houses of the star now crossing are set heavier.
  // The credit runs round the outside of the rim at the bottom, its letters
  // hanging from it, all inside the clearance the board keeps round the ring.
  compassType(p) {
    const ctx = this.ctx
    const { x, z, r, horizon } = p
    const band = (horizon + r) / 2
    const room = (r - horizon) * 100 * 0.86
    const px = Math.round(r * 7.4)
    const style = (text, size, weight) => {
      ctx.font = font(size, { weight })
      ctx.letterSpacing = `${size * 0.06}px`
      const w = ctx.measureText(text).width
      if (w > room) size = Math.floor((size * room) / w)
      ctx.letterSpacing = '0px'
      // Read back what the canvas made of the font string, so the drawing can
      // tell when it has to set a new one.
      ctx.font = font(size, { weight })
      return { font: ctx.font, spacing: `${size * 0.06}px` }
    }
    this.compassNames = p.houses.map((h) => {
      const text = h.name.toUpperCase()
      const size = h.cardinal ? Math.round(px * 1.1) : px
      const [dx, dz] = dirOf(h.bearing)
      const bold = style(text, size, 600)
      return {
        name: h.name,
        quadrant: h.quadrant,
        cardinal: h.cardinal,
        text,
        x: x + dx * band,
        z: z + dz * band,
        ang: h.bearing - Math.PI / 2 + (h.bearing > Math.PI ? Math.PI : 0),
        style: h.cardinal ? bold : style(text, size, 400),
        lit: bold,
      }
    })
    ctx.font = font(Math.round(px * 1.05), { italic: true })
    this.compassQuadrantFont = ctx.font
    const size = Math.round(px * 0.9)
    ctx.font = font(size, { italic: true })
    const text = [...'after PVS / Nainoa Thompson']
    const widths = text.map((ch) => ctx.measureText(ch).width / 100)
    const total = widths.reduce((a, b) => a + b, 0)
    // Letter tops just clear of the rim ticks; baseline below them.
    const R = r * 1.05 + (size / 100) * 0.7
    let along = -total / 2
    this.compassCredit = {
      font: ctx.font,
      chars: text.map((ch, i) => {
        const b = Math.PI - (along + widths[i] / 2) / R
        along += widths[i]
        const [dx, dz] = dirOf(b)
        return { text: ch, x: x + dx * R, z: z + dz * R, ang: b - Math.PI }
      }),
    }
  }

  // ── words ───────────────────────────────────────────────────────────────

  // Each word's corner marks, its number, and its caption: the word in small
  // caps with its gloss beneath, typed in after each turn. Drawn a kind at a
  // time across all the words, so each font is set once a frame.
  pairMarks(pairs, noted, set, alpha) {
    if (set <= 0) return
    const ctx = this.ctx
    const hx = HALF_W + 0.2
    const hz = HALF_D + 0.2
    for (const on of [false, true]) {
      this.floor()
      ctx.beginPath()
      for (const p of pairs) {
        if (noted.has(p) !== on) continue
        const arm = on ? 0.34 : 0.22
        for (const [cx, cz, sx, sz] of [
          [p.x - hx, p.z - hz, 1, 1],
          [p.x + hx, p.z - hz, -1, 1],
          [p.x - hx, p.z + hz, 1, -1],
          [p.x + hx, p.z + hz, -1, -1],
        ]) {
          ctx.moveTo(cx + sx * arm, cz)
          ctx.lineTo(cx, cz)
          ctx.lineTo(cx, cz + sz * arm)
        }
      }
      ctx.globalAlpha = set
      this.stroke(on ? 1.4 : 1, on ? INK : INK_3)
    }
    ctx.globalAlpha = 1
    if (alpha <= 0) return

    const now = this.now
    const lines = pairs.map((p) => {
      const cap = p.caption
      let l1 = cap.prev1
      let l2 = cap.prev2
      let cursor = 0
      if (now >= cap.t0) {
        const n = Math.floor((now - cap.t0) / 0.026)
        l1 = cap.text1.slice(0, n)
        l2 = cap.text2.slice(0, Math.max(0, n - cap.text1.length * 0.4))
        if (n < cap.text1.length) cursor = 1
        else if (l2.length < cap.text2.length) cursor = 2
      } else if (now >= cap.t0 - 0.3) {
        // Erase back to nothing just before the new word types in.
        const k = clamp01((cap.t0 - now) / 0.3)
        l1 = cap.prev1.slice(0, Math.ceil(cap.prev1.length * k))
        l2 = cap.prev2.slice(0, Math.ceil(cap.prev2.length * k))
      }
      const x = (p.x - hx) * 100
      const y1 = (p.z + hz + 0.34) * 100
      return { p, x, y0: (p.z - hz - 0.1) * 100, y1, y2: y1 + 27, l1, l2, cursor, noted: noted.has(p) }
    })
    ctx.globalAlpha = alpha
    this.floor(0.01)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = INK_3
    ctx.font = font(14)
    for (const w of lines) ctx.fillText(String(w.p.id + 1).padStart(3, '0'), w.x, w.y0)
    // The word, then the gloss, each with the typing cursor where it is.
    for (const [key, at, style, spacing] of [
      ['l1', 'y1', font(17, { weight: 600 }), '1.6px'],
      ['l2', 'y2', font(17), '0px'],
    ]) {
      ctx.font = style
      ctx.letterSpacing = spacing
      const line = key === 'l1' ? 1 : 2
      for (const w of lines) {
        ctx.fillStyle = line === 2 ? INK_3 : w.noted ? INK : INK_2
        ctx.fillText(w[key], w.x, w[at])
        if (w.cursor !== line) continue
        ctx.fillStyle = INK
        ctx.fillRect(w.x + ctx.measureText(w[key]).width + 2, w[at] - 14, 9, 17)
      }
    }
    ctx.letterSpacing = '0px'
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
    this.stroke(1.3, INK)
    for (const s of [l.portA, l.portB]) {
      if (s >= s0 - 1e-3 && s <= s1 + 1e-3) {
        const [x, z] = pointAt(l, s)
        this.dot(x, z, 2.6, PAPER, INK)
      }
    }
    if (l.moving) {
      const [x, z] = pointAt(l, l.anchor === 'start' ? s1 : s0)
      this.dot(x, z, 2.4, INK)
    }
  }

  // The shared root at the middle of its line. A root is a word, not one
  // glyph, so Jukugo's ring becomes a small capsule.
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
    const text = stoneText(l.stone)
    const sc = 0.6 + 0.4 * a
    ctx.setTransform(this.dpr * sc, 0, 0, this.dpr * sc, sx * this.dpr, sy * this.dpr)
    ctx.font = font(10.5, { weight: 600 })
    ctx.letterSpacing = '0.8px'
    const w = ctx.measureText(text).width + 12
    const h = 15
    ctx.globalAlpha = a
    ctx.beginPath()
    ctx.roundRect(-w / 2, -h / 2, w, h, h / 2)
    ctx.fillStyle = PAPER_2
    ctx.fill()
    ctx.setLineDash([])
    ctx.lineWidth = 1
    ctx.strokeStyle = INK
    ctx.stroke()
    ctx.fillStyle = INK
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    // letterSpacing trails the last letter; shift back by half of it.
    ctx.fillText(text, -0.4, 0.8)
    ctx.textBaseline = 'alphabetic'
    ctx.letterSpacing = '0px'
    ctx.globalAlpha = 1
    this.pulse(sx, sy, l, w / 2, h / 2)
  }

  // An outline that spreads once from a line's mark when the line connects.
  pulse(sx, sy, l, hw, hh) {
    const u = (this.now - l.doneAt) / 0.9
    if (!(u >= 0 && u < 1)) return
    const ctx = this.ctx
    const g = 16 * outCubic(u)
    this.screen()
    ctx.beginPath()
    ctx.roundRect(sx - hw - g, sy - hh - g, 2 * (hw + g), 2 * (hh + g), hh + g)
    ctx.globalAlpha = (1 - u) * 0.8
    ctx.setLineDash([])
    ctx.lineWidth = 1
    ctx.strokeStyle = INK
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  // A word with no root to share runs a dashed line to its field's place; the
  // line of a word that has a card open is drawn in ʻalaea.
  fieldLink(l, active) {
    const span = this.span(l)
    if (!span) return
    const [s0, s1] = span
    const color = active ? OCHRE : INK_2
    this.stroke(active ? 1.2 : 1, color, [3, 3.5])
    if (l.portA >= s0 && l.portA <= s1) {
      const [x, z] = pointAt(l, l.portA)
      this.dot(x, z, 2.2, PAPER, color)
    }
    if (s1 < l.len - 1e-3) return
    const ctx = this.ctx
    const [ex, ez] = l.pts.at(-1)
    const [sx, sy] = this.toScreen(ex, ez)
    const [px, py] = this.toScreen(...l.pts[0])
    const ang = Math.atan2(sy - py, sx - px)
    this.screen()
    ctx.setLineDash([])
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = 1
    ctx.beginPath()
    if (l.stub) {
      // Off-page connector: an arrowhead and the name of where it's going.
      ctx.moveTo(sx + Math.cos(ang + 2.6) * 6, sy + Math.sin(ang + 2.6) * 6)
      ctx.lineTo(sx, sy)
      ctx.lineTo(sx + Math.cos(ang - 2.6) * 6, sy + Math.sin(ang - 2.6) * 6)
      ctx.stroke()
      ctx.font = font(12, { italic: true })
      ctx.textAlign = Math.cos(ang) >= 0 ? 'left' : 'right'
      ctx.textBaseline = 'middle'
      ctx.fillText(FIELDS[l.feature.field].label, sx + Math.cos(ang) * 9, sy + Math.sin(ang) * 9)
      ctx.textBaseline = 'alphabetic'
    } else {
      ctx.moveTo(sx + 3.2, sy)
      ctx.lineTo(sx, sy + 3.2)
      ctx.lineTo(sx - 3.2, sy)
      ctx.lineTo(sx, sy - 3.2)
      ctx.closePath()
      ctx.fill()
      this.pulse(sx, sy, l, 3, 3)
    }
  }

  // A rounded outline spreading from a stone as it lands, like a ring on
  // still water but the stone's own shape.
  ripple(r) {
    const t = clamp01((this.now - r.t0) / r.dur)
    if (t <= 0 || t >= 1) return
    const e = outCubic(t)
    const hx = SLAB / 2 + 0.06 + 0.7 * e
    const hz = 0.56 + 0.7 * e
    const ctx = this.ctx
    this.floor()
    ctx.beginPath()
    ctx.roundRect(r.x - hx, r.z - hz, 2 * hx, 2 * hz, 0.12 + 0.5 * e)
    ctx.globalAlpha = (1 - t) * 0.7
    this.stroke(1, INK)
    ctx.globalAlpha = 1
  }
}

// ── helpers ───────────────────────────────────────────────────────────────

function phase(t, [a, b]) {
  return clamp01((t - a) / (b - a))
}

function near(v, x, z, r) {
  return x + r > v.x0 && x - r < v.x1 && z + r > v.z0 && z - r < v.z1
}

function dirOf(b) {
  return [Math.sin(b), -Math.cos(b)]
}

// A world path from polylines, closing those asked to be closed.
function path(lines, closed = false) {
  const p = new Path2D()
  for (const pts of lines) {
    if (!pts || pts.length < 2) continue
    p.moveTo(pts[0][0], pts[0][1])
    for (let i = 1; i < pts.length; i++) p.lineTo(pts[i][0], pts[i][1])
    if (closed) p.closePath()
  }
  return p
}

// Points as zero-length strokes: stroked with round caps they become dots
// that stay round on screen, whatever the floor's foreshortening.
function dots(pts) {
  const p = new Path2D()
  for (const [x, z] of pts) {
    p.moveTo(x, z)
    p.lineTo(x + 1e-3, z)
  }
  return p
}

// The minor contours sorted by how close they run to their neighbours. On
// steep ground they bunch into folds too tight to read, and a sheet drawn by
// hand leaves them out there and keeps only every fifth. Each run of a line
// goes into a bucket by its spacing (world units, the level step over the
// slope); relief() fades out the buckets that come closer than a few pixels
// at the scale of the moment.
const SPACING = [0, 0.04, 0.06, 0.08, 0.1, 0.125, 0.15, 0.2]
function minorContours(island) {
  const g = island.height
  const levels = island.contours
  const dh = levels[1].level - levels[0].level
  const e = g.step
  const spacing = (x, z) => {
    const gx = sampleGrid(g, g.h, x + e, z) - sampleGrid(g, g.h, x - e, z)
    const gz = sampleGrid(g, g.h, x, z + e) - sampleGrid(g, g.h, x, z - e)
    return dh / (Math.hypot(gx, gz) / (2 * e) || 1e-9)
  }
  const bucketOf = (d) => {
    let b = 0
    while (b + 1 < SPACING.length && d >= SPACING[b + 1]) b++
    return b
  }
  const runs = SPACING.map(() => [])
  for (const c of levels) {
    if (c.major) continue
    for (const { pts } of c.lines) {
      let run = null
      let at = -1
      for (let i = 1; i < pts.length; i++) {
        const [ax, az] = pts[i - 1]
        const [bx, bz] = pts[i]
        const b = bucketOf(spacing((ax + bx) / 2, (az + bz) / 2))
        if (b !== at) {
          run = [pts[i - 1]]
          runs[b].push(run)
          at = b
        }
        run.push(pts[i])
      }
    }
  }
  return SPACING.map((lo, b) => ({ lo, path: path(runs[b]) }))
}

function densify(pts, step) {
  const out = [pts[0]]
  for (let i = 1; i < pts.length; i++) {
    const [ax, az] = pts[i - 1]
    const [bx, bz] = pts[i]
    const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / step))
    for (let j = 1; j <= n; j++) out.push([ax + ((bx - ax) * j) / n, az + ((bz - az) * j) / n])
  }
  return out
}

// Each point of a polyline with the unit normal to its left.
function frameLine(pts) {
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)]
    const b = pts[Math.min(pts.length - 1, i + 1)]
    const dx = b[0] - a[0]
    const dz = b[1] - a[1]
    const l = Math.hypot(dx, dz) || 1
    return [p[0], p[1], -dz / l, dx / l]
  })
}

function sampleGrid(g, field, x, z) {
  const fx = (x - g.x0) / g.step
  const fz = (z - g.z0) / g.step
  const i = Math.max(0, Math.min(g.nx - 2, Math.floor(fx)))
  const j = Math.max(0, Math.min(g.nz - 2, Math.floor(fz)))
  const tx = clamp01(fx - i)
  const tz = clamp01(fz - j)
  const c = j * g.nx + i
  return (
    (field[c] * (1 - tx) + field[c + 1] * tx) * (1 - tz) + (field[c + g.nx] * (1 - tx) + field[c + g.nx + 1] * tx) * tz
  )
}

// How far the land runs from the summit along a bearing, read off the height
// field.
function coastReach(island, b) {
  const [dx, dz] = dirOf(b)
  const g = island.height
  const [sx, sz] = island.summit
  let r = 0
  while (r < 60 && sampleGrid(g, g.h, sx + dx * r, sz + dz * r) > 0) r += 0.1
  return r
}

// How far from (x, z) along (ux, uz) a closed ring around that point lies.
function rayOut(ring, x, z, ux, uz) {
  let best = 0
  for (let i = 1; i < ring.length; i++) {
    const [ax, az] = ring[i - 1]
    const [bx, bz] = ring[i]
    const ex = bx - ax
    const ez = bz - az
    const den = ux * ez - uz * ex
    if (!den) continue
    const t = ((ax - x) * ez - (az - z) * ex) / den
    const v = ((ax - x) * uz - (az - z) * ux) / den
    if (t > 0 && v >= 0 && v <= 1) best = Math.max(best, t)
  }
  return best
}

// Whether a box reaches inside a closed ring (corners or centre in it, or a
// ring point in the box).
function touchesRing(box, ring) {
  const inRing = (x, z) => {
    let c = false
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, zi] = ring[i]
      const [xj, zj] = ring[j]
      if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c
    }
    return c
  }
  const corners = [
    [box.x0, box.z0],
    [box.x1, box.z0],
    [box.x0, box.z1],
    [box.x1, box.z1],
    [(box.x0 + box.x1) / 2, (box.z0 + box.z1) / 2],
  ]
  return corners.some(([x, z]) => inRing(x, z)) || ring.some(([x, z]) => x > box.x0 && x < box.x1 && z > box.z0 && z < box.z1)
}

function overlap(a, b) {
  const w = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)
  const h = Math.min(a.z1, b.z1) - Math.max(a.z0, b.z0)
  return w > 0 && h > 0 ? w * h : 0
}

// How deep a box reaches into a circle (0 if it doesn't).
function boxCircle(box, x, z, r) {
  const dx = Math.max(box.x0 - x, 0, x - box.x1)
  const dz = Math.max(box.z0 - z, 0, z - box.z1)
  const d = Math.hypot(dx, dz)
  return d < r ? r - d : 0
}

function mix(a, b, t) {
  const pa = parseInt(a.slice(1), 16)
  const pb = parseInt(b.slice(1), 16)
  const ch = (s) => Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t)
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`
}
