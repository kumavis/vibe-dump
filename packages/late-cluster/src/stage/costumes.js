// Costumes: 2D vector bodies under the 3D heads, drawn in two layers around each head —
// `back` (shoulders, jacket, hood: behind the head) and `front` (collar, shirt front, lapels, tie:
// over the bottom of the neck, so the neck disappears into the collar).
//
// A costume draws in centimetres about the neck base (x right, y down), scaled by the head's own
// px-per-cm, so it always fits the head it hangs from. The anchor `a` passed in:
//   { x, y, u (stage px per cm), turn (−1..1, + = body turned to face screen-right), sway (rad),
//     breathe (0..1), t, bottom (cm below the neck to stop drawing), floor (cm to the floor, or null:
//     seated / behind furniture), speaking (0..1), look }
//
// Add a kind: COSTUMES.myKind = { back(ctx, a, c) {}, front(ctx, a, c) {} } where c is the look's
// costume spec ({ kind, color, trim, … }). Use the helpers below (stroke/fill paths written as SVG
// path strings in cm).
import { beam, occlude, label, P, mix, core } from '../kit/draw.js'

// ---------------------------------------------------------------- helpers (all in cm space)

const PATHS = new Map()
/** an SVG path string → Path2D (cached) */
function path(d) {
  let p = PATHS.get(d)
  if (!p) {
    p = new Path2D(d)
    if (PATHS.size > 4000) PATHS.clear()
    PATHS.set(d, p)
  }
  return p
}
const f = (n) => (Math.round(n * 10) / 10).toString()
/** stroke a path in cm space with a width in stage px */
function line(ctx, a, d, color, px = 1.5, o = {}) {
  beam(ctx, typeof d === 'string' ? path(d) : d, color, (0.85 * px) / a.u, { ...o, alpha: (o.alpha ?? 1) * 0.92 })
}
let NOFILL = false
function fill(ctx, d, color = '#000', alpha = 1) {
  if (NOFILL) return
  occlude(ctx, typeof d === 'string' ? path(d) : d, color, alpha)
}
/** fill black then stroke */
function solid(ctx, a, d, color, px = 1.5, o = {}) {
  fill(ctx, d, o.fill ?? '#000')
  line(ctx, a, d, color, px, o)
}
function circle(cx, cy, r) {
  return `M${f(cx + r)} ${f(cy)} A${f(r)} ${f(r)} 0 1 0 ${f(cx - r)} ${f(cy)} A${f(r)} ${f(r)} 0 1 0 ${f(cx + r)} ${f(cy)}`
}

/** enter the costume's frame: neck base at origin, cm units, body turn as a horizontal squash */
function enter(ctx, a) {
  ctx.save()
  ctx.translate(a.x + Math.sin(a.sway) * 2.5 * a.u, a.y)
  ctx.rotate(a.sway * 0.3)
  const sq = 1 - 0.18 * Math.abs(a.turn)
  ctx.scale(a.u * sq, a.u * (1 + 0.006 * a.breathe))
}

/** the generic jacket/torso outline: shoulders S (half-width), neck N, hem at y = H */
function torso(S, N, H, slope = 6) {
  // neck → down the trapezius → round the shoulder cap → straight down the sleeve to the hem
  const sl = slope + 2.5
  const P = (x, y) => `${f(x)} ${f(y)}`
  return [
    `M${P(-N, -1)}`,
    `C${P(-N - 3.5, 0.6)} ${P(-S + 6, sl - 4.2)} ${P(-S + 1.5, sl - 1.2)}`,
    `C${P(-S - 1.6, sl + 0.2)} ${P(-S - 2.6, sl + 4)} ${P(-S - 2.5, sl + 9)}`,
    // a little waist, then out to the hem
    H > 40 ? `C${P(-S - 2.5, 24)} ${P(-S - 0.5, 30)} ${P(-S - 0.6, 36)} L${P(-S - 1.4, H)} L${P(S + 1.4, H)} L${P(S + 0.6, 36)} C${P(S + 0.5, 30)} ${P(S + 2.5, 24)} ${P(S + 2.5, sl + 9)}` : `L${P(-S - 2, H)} L${P(S + 2, H)} L${P(S + 2.5, sl + 9)}`,
    `C${P(S + 2.6, sl + 4)} ${P(S + 1.6, sl + 0.2)} ${P(S - 1.5, sl - 1.2)}`,
    `C${P(S - 6, sl - 4.2)} ${P(N + 3.5, 0.6)} ${P(N, -1)} Z`,
  ].join(' ')
}
/** sleeve seams down the arms */
function arms(S, H, slope = 6) {
  return `M${f(-S + 3.5)} ${f(slope + 3)} C${f(-S + 2.6)} ${f(slope + 14)} ${f(-S + 3)} ${f(H - 10)} ${f(-S + 3.8)} ${f(H)} M${f(S - 3.5)} ${f(slope + 3)} C${f(S - 2.6)} ${f(slope + 14)} ${f(S - 3)} ${f(H - 10)} ${f(S - 3.8)} ${f(H)}`
}
/** legs to the floor (standing puppets) */
function legs(ctx, a, top, color, stripe) {
  if (a.floor == null || a.floor <= top + 4) return
  const F = a.floor
  const d = `M-15 ${f(top)} L-12.5 ${f(F - 3)} L-2.5 ${f(F - 3)} L-1 ${f(top + 9)} L1 ${f(top + 9)} L2.5 ${f(F - 3)} L12.5 ${f(F - 3)} L15 ${f(top)} Z`
  solid(ctx, a, d, color, 1.4, { alpha: 0.85 })
  if (stripe) line(ctx, a, `M-13.9 ${f(top + 2)} L-12 ${f(F - 4)} M13.9 ${f(top + 2)} L12 ${f(F - 4)}`, stripe, 1, { alpha: 0.6 })
  // shoes
  const shoe = (sx) => `M${f(sx * 2)} ${f(F - 3)} L${f(sx * 13.5)} ${f(F - 3)} C${f(sx * 16)} ${f(F - 2.5)} ${f(sx * 17)} ${f(F)} ${f(sx * 15)} ${f(F)} L${f(sx * 2)} ${f(F)} Z`
  for (const sx of [-1, 1]) solid(ctx, a, shoe(sx), P.white, 1.3, { alpha: 0.75 })
}

/** where the jacket ends: a waist-length hem (standing) or the bottom of the view */
const hemOf = (a, len = 46) => (a.floor != null ? Math.min(a.bottom, len) : a.bottom)

/** the shirt's V between lapels down to y = v, centre line shifted by c */
const shirtV = (c, v, w = 6) => `M${f(-w)} -1.5 L${f(c)} ${f(v)} L${f(w)} -1.5 Z`

function bowTie(ctx, a, c, y, color) {
  const d = `M${f(c)} ${f(y)} L${f(c - 4.6)} ${f(y - 2.2)} L${f(c - 4.3)} ${f(y + 2.4)} Z M${f(c)} ${f(y)} L${f(c + 4.6)} ${f(y - 2.2)} L${f(c + 4.3)} ${f(y + 2.4)} Z`
  solid(ctx, a, d, color, 1.5, { hot: true })
  solid(ctx, a, `M${f(c - 0.9)} ${f(y - 1.2)} L${f(c + 0.9)} ${f(y - 1.2)} L${f(c + 0.9)} ${f(y + 1.2)} L${f(c - 0.9)} ${f(y + 1.2)} Z`, color, 1.2, { hot: true })
}

function shirtCollar(ctx, a, c, color) {
  const d = `M-5.4 -2 L${f(c - 2.2)} 3 L-6.6 2.6 Z M5.4 -2 L${f(c + 2.2)} 3 L6.6 2.6 Z`
  solid(ctx, a, d, color, 1.3)
}

/** lapels: peaked (tux), notch (suit) or shawl (band); each side from the collar to the button at y=v */
function lapels(ctx, a, c, v, kind, color, facing) {
  const side = (s) => {
    let d
    if (kind === 'peak') d = `M${f(s * 6.2)} -1.5 L${f(c)} ${f(v)} L${f(s * 11.8)} 15 L${f(s * 15.6)} 8.2 L${f(s * 10.6)} 10.4 L${f(s * 8.4)} 4.5 Z`
    else if (kind === 'notch') d = `M${f(s * 6.2)} -1.5 L${f(c)} ${f(v)} L${f(s * 11.6)} 14.5 L${f(s * 13.2)} 8.6 L${f(s * 10.4)} 9.6 L${f(s * 9.6)} 7.4 L${f(s * 8.2)} 2.5 Z`
    else d = `M${f(s * 6.2)} -1.5 C${f(s * 12)} 3 ${f(s * 12.5)} ${f(v * 0.55)} ${f(c)} ${f(v)} C${f(c + s * 2)} ${f(v * 0.6)} ${f(s * 7.5)} 6 ${f(s * 6.2)} -1.5 Z`
    solid(ctx, a, d, color, 1.5)
    // the silk facing's sheen
    if (facing) line(ctx, a, kind === 'shawl' ? `M${f(s * 8.5)} 2 C${f(s * 10.5)} 6 ${f(s * 9)} ${f(v * 0.6)} ${f(c + s * 1.5)} ${f(v - 2)}` : `M${f(s * 8)} 3 L${f(c + s * 1.6)} ${f(v - 3)}`, facing, 0.9, { alpha: 0.5 })
  }
  side(-1)
  side(1)
}

function pocketSquare(ctx, a, x, y, color, trim) {
  line(ctx, a, `M${f(x - 4)} ${f(y)} L${f(x + 4)} ${f(y - 0.4)}`, trim, 1.3)
  solid(ctx, a, `M${f(x - 3.2)} ${f(y - 0.2)} L${f(x - 2)} ${f(y - 3.2)} L${f(x - 0.6)} ${f(y - 1)} L${f(x + 0.8)} ${f(y - 3.8)} L${f(x + 2.2)} ${f(y - 1.2)} L${f(x + 3.2)} ${f(y - 2.9)} L${f(x + 3.4)} ${f(y - 0.4)} Z`, color, 1.2, { hot: true })
}

// ---------------------------------------------------------------- the costumes

export const COSTUMES = {
  /** Larry's tuxedo: peaked satin lapels, bow tie, studs, pocket square */
  tux: {
    back(ctx, a, c) {
      const H = hemOf(a)
      legs(ctx, a, H - 2, c.color, c.color)
      solid(ctx, a, torso(18, 6.2, H), c.color, 1.8, { hot: false })
      line(ctx, a, arms(18, H), c.color, 1, { alpha: 0.55 })
    },
    front(ctx, a, c) {
      const cx = a.turn * 4.5
      const v = 30
      solid(ctx, a, shirtV(cx, v + 2, 6.4), c.shirt ?? P.white, 1.2, { alpha: 0.8 })
      // pleats
      line(ctx, a, `M${f(cx - 2.2)} 6 L${f(cx - 1.3)} ${f(v - 3)} M${f(cx + 2.2)} 6 L${f(cx + 1.3)} ${f(v - 3)}`, c.shirt ?? P.white, 0.8, { alpha: 0.35 })
      lapels(ctx, a, cx, v + 2, 'peak', c.color, c.facing ?? mix(c.color, '#ffffff', 0.4))
      shirtCollar(ctx, a, cx * 0.4, c.shirt ?? P.white)
      bowTie(ctx, a, cx * 0.4, 2.6, c.tie ?? P.amber)
      for (const y of [9, 15.5, 22]) {
        const x = cx * (0.4 + (0.6 * y) / v)
        occlude(ctx, path(circle(x, y, 0.75)))
        line(ctx, a, circle(x, y, 0.7), c.tie ?? P.amber, 1.1, { hot: true })
      }
      // the one button, and the pocket square on the wearer's left breast
      line(ctx, a, circle(cx, v + 4.5, 0.9), c.color, 1.2)
      pocketSquare(ctx, a, 12.5 + cx * 0.5, 17, c.square ?? P.pink, c.color)
    },
  },

  /** The Formants: matching bandstand jackets, shawl collars, piping, a monogram on the pocket */
  band: {
    back(ctx, a, c) {
      const H = hemOf(a)
      legs(ctx, a, H - 2, mix(c.color, '#000', 0.4))
      solid(ctx, a, torso(17.5, 6, H), c.color, 1.7)
      line(ctx, a, arms(17.5, H), c.trim ?? P.gold, 1, { alpha: 0.6 })
      // piping along the shoulders
      line(ctx, a, `M-9 1.2 C-12 2.6 -14 4.5 -16.5 7.5 M9 1.2 C12 2.6 14 4.5 16.5 7.5`, c.trim ?? P.gold, 0.9, { alpha: 0.55 })
    },
    front(ctx, a, c) {
      const cx = a.turn * 4.5
      const v = 28
      solid(ctx, a, shirtV(cx, v + 2, 6.2), P.blueDim, 1, { alpha: 0.8 })
      lapels(ctx, a, cx, v + 2, 'shawl', c.trim ?? P.gold, c.color)
      bowTie(ctx, a, cx * 0.4, 2.4, c.trim ?? P.gold)
      for (const y of [v + 4, v + 9]) line(ctx, a, circle(cx, y, 0.8), c.trim ?? P.gold, 1.1)
      // breast pocket with the band's monogram
      const px = 12 + cx * 0.5
      line(ctx, a, `M${f(px - 4)} 15 L${f(px + 4)} 14.6`, c.trim ?? P.gold, 1.2)
      ctx.save()
      label(ctx, c.monogram ?? 'F', px, 12.8, { size: 5, align: 'center', color: c.trim ?? P.gold, weight: 'm', ls: 0 })
      ctx.restore()
    },
  },

  /** the announcer: dark blazer, notch lapels, a long tie, a lapel mic */
  announcer: {
    back(ctx, a, c) {
      const H = hemOf(a)
      legs(ctx, a, H - 2, c.color)
      solid(ctx, a, torso(17, 6, H), c.color, 1.6)
      line(ctx, a, arms(17, H), c.color, 1, { alpha: 0.5 })
    },
    front(ctx, a, c) {
      const cx = a.turn * 4.5
      const v = 26
      solid(ctx, a, shirtV(cx, v + 2, 6.2), c.trim ?? P.white, 1.1, { alpha: 0.75 })
      solid(ctx, a, `M${f(cx * 0.4 - 1.4)} 1.5 L${f(cx * 0.4 + 1.4)} 1.5 L${f(cx * 0.4 + 0.9)} 4 L${f(cx * 0.7 + 2)} ${f(v - 2)} L${f(cx * 0.7)} ${f(v + 1)} L${f(cx * 0.7 - 2)} ${f(v - 2)} L${f(cx * 0.4 - 0.9)} 4 Z`, P.violet, 1.3, { hot: true })
      lapels(ctx, a, cx, v + 2, 'notch', c.color)
      shirtCollar(ctx, a, cx * 0.4, c.trim ?? P.white)
      // lapel mic + cable
      const mx = -10.5 + cx * 0.4
      solid(ctx, a, `M${f(mx - 0.8)} 9 L${f(mx + 0.8)} 9 L${f(mx + 0.8)} 11.6 L${f(mx - 0.8)} 11.6 Z`, P.white, 1)
      line(ctx, a, `M${f(mx)} 11.6 C${f(mx + 2)} 16 ${f(mx - 3)} 20 ${f(mx - 2)} 30`, P.blueMid, 0.7, { alpha: 0.5 })
    },
  },

  /** a business suit with a long tie */
  suit: {
    back(ctx, a, c) {
      const H = hemOf(a)
      legs(ctx, a, H - 2, c.color)
      solid(ctx, a, torso(17.5, 6, H), c.color, 1.6)
      line(ctx, a, arms(17.5, H), c.color, 1, { alpha: 0.5 })
    },
    front(ctx, a, c) {
      const cx = a.turn * 4.5
      const v = 25
      solid(ctx, a, shirtV(cx, v + 2, 6.2), c.shirt ?? P.white, 1.1, { alpha: 0.75 })
      const tie = c.tie ?? P.coral
      solid(ctx, a, `M${f(cx * 0.4 - 1.4)} 1.5 L${f(cx * 0.4 + 1.4)} 1.5 L${f(cx * 0.4 + 0.9)} 4 L${f(cx * 0.7 + 2.2)} ${f(v + 4)} L${f(cx * 0.7)} ${f(v + 7)} L${f(cx * 0.7 - 2.2)} ${f(v + 4)} L${f(cx * 0.4 - 0.9)} 4 Z`, tie, 1.3, { hot: true })
      lapels(ctx, a, cx, v + 2, 'notch', c.color)
      shirtCollar(ctx, a, cx * 0.4, c.shirt ?? P.white)
      line(ctx, a, circle(cx, v + 6, 0.9), c.color, 1.1)
    },
  },

  /** a hoodie: the hood bunched behind the neck, drawstrings, a kangaroo pocket */
  hoodie: {
    back(ctx, a, c) {
      const H = hemOf(a, 50)
      legs(ctx, a, H - 3, P.blueDim)
      // the hood behind the neck
      solid(ctx, a, `M-10 1 C-14 -6 -10 -11 0 -11.5 C10 -11 14 -6 10 1 Z`, c.color, 1.5)
      line(ctx, a, `M-7.5 -1 C-9 -6 -6 -8.5 0 -8.8 C6 -8.5 9 -6 7.5 -1`, c.color, 0.9, { alpha: 0.5 })
      solid(ctx, a, torso(18, 7, H, 7.5), c.color, 1.7)
      line(ctx, a, arms(18, H, 7.5), c.color, 1, { alpha: 0.55 })
      // ribbed hem
      if (a.floor != null) line(ctx, a, `M-21 ${f(H - 4)} L21 ${f(H - 4)}`, c.color, 1, { alpha: 0.5 })
    },
    front(ctx, a, c) {
      const cx = a.turn * 4.5
      // neckline + drawstrings with aglets
      solid(ctx, a, `M-7.2 -1.5 C-6 4 6 4 7.2 -1.5 C9 3 6 6.5 0 6.5 C-6 6.5 -9 3 -7.2 -1.5 Z`, c.color, 1.5)
      const sway = Math.sin(a.t * 1.7) * 0.6
      for (const s of [-1, 1]) {
        const x0 = cx * 0.5 + s * 2.6
        line(ctx, a, `M${f(x0)} 5 C${f(x0 + sway)} 10 ${f(x0 - sway)} 15 ${f(x0 + s * 0.5)} 19`, c.trim ?? P.white, 1, { alpha: 0.85 })
        line(ctx, a, `M${f(x0 + s * 0.5)} 19 L${f(x0 + s * 0.5)} 21`, c.trim ?? P.white, 2)
      }
      // kangaroo pocket
      if (a.bottom > 32) line(ctx, a, `M${f(cx - 11)} 44 L${f(cx - 8)} 32 L${f(cx + 8)} 32 L${f(cx + 11)} 44`, c.color, 1.2, { alpha: 0.7 })
      if (c.logo !== false) {
        // a tiny butterfly on the chest
        const bx = cx + 8, by = 14
        line(ctx, a, `M${f(bx)} ${f(by)} C${f(bx - 1)} ${f(by - 2)} ${f(bx - 3)} ${f(by - 3)} ${f(bx - 3)} ${f(by - 1.5)} C${f(bx - 3)} ${f(by)} ${f(bx - 1.5)} ${f(by + 0.5)} ${f(bx)} ${f(by)} C${f(bx + 1)} ${f(by - 2)} ${f(bx + 3)} ${f(by - 3)} ${f(bx + 3)} ${f(by - 1.5)} C${f(bx + 3)} ${f(by)} ${f(bx + 1.5)} ${f(by + 0.5)} ${f(bx)} ${f(by)}`, c.trim ?? P.bsky, 1, { hot: true })
      }
    },
  },

  /** a cardigan over a collared shirt: V neck, buttons, ribbing */
  cardigan: {
    back(ctx, a, c) {
      const H = hemOf(a, 48)
      legs(ctx, a, H - 2, P.blueDim)
      solid(ctx, a, torso(17, 6, H, 7), c.color, 1.6)
      line(ctx, a, arms(17, H, 7), c.color, 1, { alpha: 0.5 })
      for (let x = -16; x <= 16; x += 4) line(ctx, a, `M${x} ${f(H - 5)} L${x} ${f(H)}`, c.color, 0.7, { alpha: 0.3 })
    },
    front(ctx, a, c) {
      const cx = a.turn * 4.5
      const B = hemOf(a, 48)
      const v = 24
      solid(ctx, a, shirtV(cx, v, 6.4), c.shirt ?? P.sky, 1, { alpha: 0.7 })
      solid(ctx, a, `M-6.4 -1.5 L${f(cx - 1.6)} ${f(v)} L${f(cx - 1.6)} ${f(B)} L-14 ${f(B)} L-12 4 Z M6.4 -1.5 L${f(cx + 1.6)} ${f(v)} L${f(cx + 1.6)} ${f(B)} L14 ${f(B)} L12 4 Z`, c.color, 1.4)
      shirtCollar(ctx, a, cx * 0.4, c.shirt ?? P.sky)
      for (let y = v + 3; y < Math.min(B, 60); y += 7) line(ctx, a, circle(cx, y, 0.8), c.trim ?? P.white, 1.1)
    },
  },

  /** a lab coat: long, white, wide notch lapels, pens in the pocket, a badge */
  labcoat: {
    back(ctx, a, c) {
      const H = a.floor != null ? Math.min(a.bottom, 70) : a.bottom
      legs(ctx, a, 60, P.blueDim)
      solid(ctx, a, torso(18, 6.2, H), c.color ?? P.white, 1.6)
      line(ctx, a, arms(18, H), c.color ?? P.white, 1, { alpha: 0.5 })
    },
    front(ctx, a, c) {
      const cx = a.turn * 4.5
      const v = 30
      solid(ctx, a, shirtV(cx, v, 6.2), c.shirt ?? P.sky, 1, { alpha: 0.6 })
      line(ctx, a, `M${f(cx * 0.4)} 3 L${f(cx * 0.7)} ${f(v - 2)}`, c.tie ?? P.green, 2.2)
      lapels(ctx, a, cx, v + 2, 'notch', c.color ?? P.white)
      line(ctx, a, `M${f(cx)} ${f(v + 2)} L${f(cx)} ${f(a.floor != null ? Math.min(a.bottom, 70) : a.bottom)}`, c.color ?? P.white, 1.2)
      const px = 12 + cx * 0.5
      line(ctx, a, `M${f(px - 4)} 18 L${f(px + 4)} 18`, c.color ?? P.white, 1.2)
      ;[P.coral, P.bsky, P.green].forEach((pc, i) => line(ctx, a, `M${f(px - 2.5 + i * 2)} 18 L${f(px - 2.5 + i * 2)} ${f(14.5 + (i % 2))}`, pc, 1.4, { hot: true }))
      // badge
      const bx = -12 + cx * 0.5
      solid(ctx, a, `M${f(bx - 3.5)} 16 L${f(bx + 3.5)} 16 L${f(bx + 3.5)} 20.5 L${f(bx - 3.5)} 20.5 Z`, c.trim ?? P.cyan, 1)
      line(ctx, a, `M${f(bx - 2.3)} 17.6 L${f(bx + 2.3)} 17.6 M${f(bx - 2.3)} 19 L${f(bx + 1)} 19`, c.trim ?? P.cyan, 0.7, { alpha: 0.7 })
    },
  },

  /** a turtleneck: the roll collar rides up the neck */
  turtleneck: {
    back(ctx, a, c) {
      const H = hemOf(a, 48)
      legs(ctx, a, H - 2, P.blueDim)
      solid(ctx, a, torso(16.5, 7, H, 7.5), c.color, 1.6)
      line(ctx, a, arms(16.5, H, 7.5), c.color, 1, { alpha: 0.45 })
    },
    front(ctx, a, c) {
      solid(ctx, a, `M-6.8 -7 C-3 -6 3 -6 6.8 -7 L7.6 3 C3 4.5 -3 4.5 -7.6 3 Z`, c.color, 1.5)
      for (const y of [-4.5, -2, 0.5]) line(ctx, a, `M-7 ${y} C-3 ${f(y + 1.2)} 3 ${f(y + 1.2)} 7 ${y}`, c.color, 0.9, { alpha: 0.55 })
      if (c.pendant) {
        line(ctx, a, `M-4 4 C-2 14 2 14 4 4`, c.trim ?? P.gold, 0.8, { alpha: 0.7 })
        line(ctx, a, circle(0, 13.6, 1.1), c.trim ?? P.gold, 1.2, { hot: true })
      }
    },
  },

  /** a T-shirt with a chest print (`print`: 'butterfly' (default), or a short text) */
  tee: {
    back(ctx, a, c) {
      const H = hemOf(a, 46)
      legs(ctx, a, H - 2, P.blueDim)
      solid(ctx, a, torso(17, 7, H, 7.5), c.color, 1.6)
      line(ctx, a, `M-19 22 L-15 21 M19 22 L15 21`, c.color, 1, { alpha: 0.6 })
    },
    front(ctx, a, c) {
      line(ctx, a, `M-7.2 -1.2 C-5 4 5 4 7.2 -1.2`, c.color, 1.5)
      const cx = a.turn * 4
      if (!c.print || c.print === 'butterfly') {
        const bx = cx, by = 16
        line(ctx, a, `M${bx} ${by} C${bx - 2} ${by - 4} ${bx - 6} ${by - 6} ${bx - 6} ${by - 3} C${bx - 6} ${by} ${bx - 3} ${by + 1} ${bx} ${by} C${bx + 2} ${by - 4} ${bx + 6} ${by - 6} ${bx + 6} ${by - 3} C${bx + 6} ${by} ${bx + 3} ${by + 1} ${bx} ${by} M${bx} ${by} C${bx - 3} ${by + 2} ${bx - 4} ${by + 5} ${bx - 1.5} ${by + 4.5} M${bx} ${by} C${bx + 3} ${by + 2} ${bx + 4} ${by + 5} ${bx + 1.5} ${by + 4.5}`, c.trim ?? P.bsky, 1.4, { hot: true })
      } else label(ctx, String(c.print).toUpperCase(), cx, 18, { size: 4.2, align: 'center', color: c.trim ?? P.white, weight: 'm' })
    },
  },

  /**
   * terminal: an AI agent's boxy bot body — a CRT chassis with a scrolling prompt on its chest,
   * status LEDs, and a ribbed cable for a neck. `text`: lines the screen cycles through.
   */
  terminal: {
    back(ctx, a, c) {
      const H = Math.min(a.bottom, 52)
      const color = c.color ?? P.green
      solid(ctx, a, `M-22 4 L22 4 L24 8 L24 ${f(H)} L-24 ${f(H)} L-24 8 Z`, color, 1.8)
      line(ctx, a, `M-20 7 L20 7`, color, 0.8, { alpha: 0.4 })
      // vents
      for (let y = 10; y < 16; y += 2) line(ctx, a, `M-21 ${y} L-15 ${y} M15 ${y} L21 ${y}`, color, 0.7, { alpha: 0.45 })
      if (a.floor != null && a.floor > H + 4) {
        // a pedestal and wheels
        solid(ctx, a, `M-6 ${f(H)} L6 ${f(H)} L5 ${f(a.floor - 6)} L-5 ${f(a.floor - 6)} Z`, color, 1.2)
        solid(ctx, a, `M-16 ${f(a.floor - 6)} L16 ${f(a.floor - 6)} L16 ${f(a.floor - 3)} L-16 ${f(a.floor - 3)} Z`, color, 1.2)
        for (const x of [-12, 0, 12]) line(ctx, a, circle(x, a.floor - 1.6, 1.6), color, 1)
      }
    },
    front(ctx, a, c) {
      const color = c.color ?? P.green
      // ribbed cable neck
      solid(ctx, a, `M-4.2 -6 L4.2 -6 L4.6 4 L-4.6 4 Z`, color, 1.2)
      for (let y = -4.5; y < 4; y += 1.6) line(ctx, a, `M-4.4 ${f(y)} L4.4 ${f(y)}`, color, 0.8, { alpha: 0.6 })
      // the chest screen
      const sx = -15 + a.turn * 3, sy = 12, sw = 30, sh = 20
      solid(ctx, a, `M${sx} ${sy} L${sx + sw} ${sy} L${sx + sw} ${sy + sh} L${sx} ${sy + sh} Z`, color, 1.4, { hot: true })
      const lines = c.text ?? ['> ingest firehose', '> rank: simcluster', '> reply: "great point"', '> ok']
      const t = a.t
      const step = Math.floor(t * 1.4)
      ctx.save()
      ctx.beginPath()
      ctx.rect(sx + 0.5, sy + 0.5, sw - 1, sh - 1)
      ctx.clip()
      for (let i = 0; i < 4; i++) {
        const ln = lines[(step + i) % lines.length]
        label(ctx, ln.toUpperCase(), sx + 1.6, sy + 4.6 + i * 4.4, { size: 2.9, color, ls: 0.04, alpha: i === 3 ? 1 : 0.6 })
      }
      if (Math.floor(t * 3) % 2 === 0) line(ctx, a, `M${sx + 2} ${sy + sh - 1.6} L${sx + 4} ${sy + sh - 1.6}`, color, 1.8)
      ctx.restore()
      // LEDs: one blinks while it speaks
      const leds = [P.green, P.amber, P.red]
      leds.forEach((lc, i) => {
        const on = i === 0 ? 0.4 + 0.6 * (a.speaking ?? 0) : i === 1 ? (Math.floor(t * 2 + i) % 3 === 0 ? 1 : 0.25) : 0.3
        line(ctx, a, circle(15 + i * 3, 36, 0.8), lc, 1.4, { alpha: on, hot: on > 0.6 })
      })
      label(ctx, (c.model ?? 'AGENT-7').toUpperCase(), -20, 37.2, { size: 2.8, color, alpha: 0.7, ls: 0.15 })
    },
  },
}

// ---------------------------------------------------------------- more kinds

/** a bright presenter blazer, open collar, no tie */
COSTUMES.blazer = {
  back(ctx, a, c) {
    const H = hemOf(a)
    legs(ctx, a, H - 2, mix(c.color, '#000', 0.5))
    solid(ctx, a, torso(17, 6, H), c.color, 1.6)
    line(ctx, a, arms(17, H), c.color, 1, { alpha: 0.5 })
  },
  front(ctx, a, c) {
    const cx = a.turn * 4.5
    const v = 24
    solid(ctx, a, shirtV(cx, v + 2, 6.2), c.shirt ?? P.white, 1.1, { alpha: 0.75 })
    lapels(ctx, a, cx, v + 2, 'notch', c.color, c.trim)
    // open collar points
    solid(ctx, a, `M-5.6 -2 L${f(cx - 1.4)} 6 L-8 3.6 Z M5.6 -2 L${f(cx + 1.4)} 6 L8 3.6 Z`, c.shirt ?? P.white, 1.2)
    for (const y of [v + 4, v + 10]) line(ctx, a, circle(cx, y, 0.8), c.trim ?? c.color, 1.1)
    if (c.crest) {
      const px = -12 + cx * 0.5
      line(ctx, a, `M${f(px - 3)} 13 L${f(px + 3)} 13 L${f(px + 3)} 17 L${f(px)} 19.5 L${f(px - 3)} 17 Z`, c.trim ?? P.gold, 1.2, { hot: true })
    }
  },
}

/** a dark long coat with a ruff of feathers at the collar (norvid) */
COSTUMES.featherCoat = {
  back(ctx, a, c) {
    const H = a.floor != null ? Math.min(a.bottom, 62) : a.bottom
    legs(ctx, a, 56, P.blueDim)
    solid(ctx, a, torso(17.5, 6.5, H), c.color, 1.6)
    line(ctx, a, arms(17.5, H), c.color, 1, { alpha: 0.5 })
  },
  front(ctx, a, c) {
    const cx = a.turn * 4.5
    line(ctx, a, `M${f(cx)} 6 L${f(cx)} ${f(a.floor != null ? Math.min(a.bottom, 62) : a.bottom)}`, c.color, 1.2)
    for (const y of [12, 20, 28]) line(ctx, a, circle(cx - 2.5, y, 0.8), c.trim ?? P.violet, 1.1)
    // feathers: overlapping blades round the collar
    let d = ''
    for (let i = -6; i <= 6; i++) {
      const x0 = i * 1.9, y0 = 1.2 - Math.abs(i) * 0.25
      const tipX = x0 * 1.45 + (i < 0 ? -1 : 1) * 0.8, tipY = y0 + 6.2 - Math.abs(i) * 0.15
      d += `M${f(x0 - 1.1)} ${f(y0)} Q${f(x0 * 1.25 - 1)} ${f(y0 + 3.5)} ${f(tipX)} ${f(tipY)} Q${f(x0 * 1.25 + 1)} ${f(y0 + 3)} ${f(x0 + 1.1)} ${f(y0)} Z `
    }
    solid(ctx, a, d, c.trim ?? P.violet, 1.1)
  },
}

/** things held or worn on top of any costume: c.holds = 'clipboard' | 'clicker' | 'popper' | 'headset' */
function accessory(ctx, a, c) {
  const h = c.holds
  if (!h) return
  for (const what of [].concat(h)) {
    if (what === 'clipboard') {
      const x = -6, y = 26
      solid(ctx, a, `M${x - 7} ${y} L${x + 7} ${y} L${x + 7} ${y + 18} L${x - 7} ${y + 18} Z`, P.amber, 1.3)
      solid(ctx, a, `M${x - 2.5} ${y - 1.2} L${x + 2.5} ${y - 1.2} L${x + 2.5} ${y + 1.2} L${x - 2.5} ${y + 1.2} Z`, P.white, 1)
      label(ctx, (c.clipText ?? 'LIST OF').toUpperCase(), x, y + 5.2, { size: 2.2, align: 'center', color: P.white, weight: 'm', ls: 0.05 })
      for (let k = 0; k < 4; k++) line(ctx, a, `M${x - 5} ${y + 8 + k * 2.4} L${x + (k % 2 ? 3 : 5)} ${y + 8 + k * 2.4}`, P.white, 0.7, { alpha: 0.55 })
      // a hand
      line(ctx, a, circle(x + 7.5, y + 12, 1.6), c.skin ?? P.white, 1)
    } else if (what === 'clicker') {
      const x = 15, y = 32
      solid(ctx, a, `M${x - 1.6} ${y} L${x + 1.6} ${y} L${x + 1.6} ${y + 7} L${x - 1.6} ${y + 7} Z`, P.white, 1.2)
      line(ctx, a, circle(x, y + 1.8, 0.6), P.red, 1.3, { hot: Math.floor(a.t * 2) % 3 === 0 })
      line(ctx, a, circle(x, y + 4, 2.2), c.skin ?? P.white, 1, { alpha: 0.7 })
    } else if (what === 'popper') {
      const x = 14, y = 26
      solid(ctx, a, `M${x - 2} ${y + 10} L${x + 2} ${y + 10} L${x + 5} ${y - 2} L${x - 5} ${y - 2} Z`, P.magenta, 1.3, { hot: true })
      line(ctx, a, `M${x - 5} ${y - 2} L${x + 5} ${y - 2} M${x - 3} ${y + 3} L${x + 3.8} ${y + 3}`, P.gold, 1)
      line(ctx, a, `M${x} ${y + 10} L${x} ${y + 13}`, P.white, 1)
    } else if (what === 'headset') {
      const sx = a.turn >= 0 ? 1 : -1
      line(ctx, a, `M${f(sx * 7)} -9 C${f(sx * 8)} -5 ${f(sx * 6)} -3 ${f(sx * 2.5)} -4.5`, P.white, 1.1)
      line(ctx, a, circle(sx * 2.3, -4.6, 0.9), P.white, 1.3, { hot: true })
    }
  }
}

/** draw a costume layer ('back' | 'front') */
export function drawCostume(ctx, layer, a, costume) {
  const kind = COSTUMES[costume?.kind] ?? COSTUMES.hoodie
  const fn = kind[layer]
  if (!fn) return
  enter(ctx, a)
  NOFILL = !!a.noFill
  try {
    fn(ctx, a, costume ?? {})
    if (layer === 'front') accessory(ctx, a, costume ?? {})
  } finally {
    NOFILL = false
    ctx.restore()
  }
}

export { core }
