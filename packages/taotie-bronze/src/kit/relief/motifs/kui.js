// Kui dragon (夔纹 / 夔龙纹) — research/01 §4.1, §2.13, §5.
//
// A profile, one-legged dragon: the workhorse of narrow friezes. Built in a
// local frame whose height is 1 (the frieze height) and whose length is the
// rect's aspect A, authored FACING +x (head at the right end). The frame
// mirrors it for facing 'left' and turns it a quarter for vertical kui (K5:
// the side columns of a fangding wall, head up or down).
//
//   head   'gaping' (K1/K2: upper jaw curls up, lower jaw down) | 'beaked' (K4) | 'trunked' (K3)
//   tail   'up' (K1, most common: up and over the back) | 'down' (K2: down into a spiral)
//   turned head turned back over the body (回首夔)
//   arrangement 'single' (one creature, `facing`) | 'pair' (two meeting at the centre line,
//          mirrored — the default frieze section)
//   orient 'horizontal' | 'up' (vertical, head up) | 'down' (head down)
//
// Proportions (H = frieze height): length 3–5 H, head ≈ 0.3 of length, eye
// 0.25–0.3 H, body band 0.2–0.3 H with 1–3 backward quills, one leg near the
// head with forward claws. All bands have squared-round corners; every free
// end curls. Style V (plateau + contour echo + boss eye) or 'flush' (IV).

import { E, R, Pen, Sheet, makeFrame, renderSheet, reliefSchema, withRelief, motifRng, rectClip } from './_strokes.js'

export const schema = {
  arrangement: E(['pair', 'single'], 'pair', 'Arrangement'),
  facing: E(['right', 'left'], 'right', 'Facing (single)'),
  orient: E(['horizontal', 'up', 'down'], 'horizontal', 'Orientation'),
  head: E(['gaping', 'beaked', 'trunked'], 'gaping', 'Head'),
  turned: { type: 'bool', default: false, label: 'Head turned back' },
  tail: E(['up', 'down', 'forked'], 'up', 'Tail (forked = 歧尾)'),
  crest: E(['t', 'bottle', 'hook', 'none'], 't', 'Crest'),
  eye: E(['round', 'square', 'chen'], 'round', 'Eye'),
  pupil: E(['dot', 'slit', 'none'], 'dot', 'Pupil'),
  eyeSize: R(0.6, 1.5, 0.05, 1, 'Eye size'),
  quills: R(0, 4, 1, 2, 'Dorsal quills'),
  leg: { type: 'bool', default: true, label: 'Leg & claw' },
  bandWidth: R(0.12, 0.32, 0.01, 0.23, 'Band width (× H)'),
  square: R(0, 1, 0.05, 0.7, 'Squareness'),
  marks: E(['none', 'c-marks'], 'none', 'Body marks'),
  centreGap: R(0, 20, 0.5, 1.5, 'Gap at centre line', 'mm'),
  ...reliefSchema({ motif: 1.4, boss: 2.8, groove: 0.4, lineWeight: 0.5, echoInset: 1.0, carving: 'sparse' }),
}

export const presets = {
  'k1-tail-up': {},
  'k2-tail-down': { tail: 'down', crest: 'hook' },
  'k3-trunked': { head: 'trunked', crest: 'none', quills: 1 },
  'k4-beaked': { head: 'beaked', crest: 'hook', eye: 'round' },
  'carved-plateau': { carving: 'spirals', bandWidth: 0.27, square: 0.9 },
  'turned-back': { turned: true, crest: 'none', quills: 1 },
  single: { arrangement: 'single' },
  'vertical-head-up': { arrangement: 'single', orient: 'up', quills: 1, crest: 'hook' },
  flush: { style: 'flush', lineWeight: 0.55, relief: { motif: 0.4, boss: 1.5, groove: 0.4 } },
  // Met fangyi 1974.268.2 / NMAA F1915.136 neck & foot bands: one kui per
  // half-face, squared bands, rounded-square boss eye with a slit, low relief
  'fangyi-band': {
    eye: 'square', pupil: 'slit', eyeSize: 1.15, crest: 't', quills: 1, square: 0.9, bandWidth: 0.27, carving: 'spirals',
    lineWeight: 0.5, echoInset: 0.95, relief: { motif: 1.3, boss: 2.6, groove: 0.38 },
  },
  // Houmuwu ding wall frame: long squared kui at monumental scale (frieze ~80 mm)
  forked: { tail: 'forked', quills: 3 },
  houmuwu: {
    tail: 'forked', eye: 'round', pupil: 'dot', crest: 't', quills: 2, square: 0.92, bandWidth: 0.2, marks: 'c-marks',
    lineWeight: 1.0, echoInset: 2.0, centreGap: 6, relief: { motif: 3, boss: 6, groove: 0.8 },
  },
}

export const presetPlaques = {
  single: { w: 100, h: 24 },
  'vertical-head-up': { w: 26, h: 110 },
  houmuwu: { w: 330, h: 80 },
}

// ---------------------------------------------------------------- geometry

/** The creature's marks, authored facing +x in a frame of height 1, length A. */
export function buildKui(S, A, p) {
  const bw = p.bandWidth
  const sq = p.square
  const fr = (k = 1) => bw * k * (0.55 - 0.42 * sq) // squared-round corner radius
  const X = (s) => A - s // s = distance back from the snout
  const turned = !!p.turned
  const trunk = p.head === 'trunked'
  const eyeR = 0.14 * p.eyeSize
  // ---- head: placed by a head transform (scale k, snout at (sx, sy), facing ±1)
  const k = turned ? 0.62 : 1
  const hs = trunk ? 0.16 : 0 // trunk room in front of the head
  const hx = turned ? X(0.86) : X(hs) // snout x (a turned head looks back: its snout is the far end)
  const hy = turned ? 0.4 : 0 // head y offset
  const hf = turned ? -1 : 1
  const H = ([s, y]) => [hx - hf * s * k, hy + y * k] // head-local (s back from snout, y) → creature
  const Hp = (pts) => pts.map(H)
  const hpen = (s, y, heading) => new Pen(s, y, heading, 0.01) // head-local pen; headings in head space (0 = toward the snout)
  // head-space heading 0 points toward the snout (−s); a pen in head space works in (−s, y) coords:
  // we author with x = −s so "forward" is +x, then map with Hx.
  const Hx = (pts) => Hp(pts.map(([x, y]) => [-x, y]))

  const headW = 0.56, headH = 0.4, eyeS = 0.5, eyeY = 0.54
  // head block
  S.rrect(H([eyeS, eyeY]), headW * k, headH * k, fr(1.1) * k + 0.02)
  const hb = eyeY - headH / 2 // head bottom
  const hfront = eyeS - headW / 2 // head front (s)
  // jaws / beak / trunk
  const jw = bw * 0.8 * k
  if (p.head === 'beaked') {
    // a heavy hooked beak out of the head front, tip turned down and back
    const b = hpen(-hfront - 0.02, eyeY - 0.06, 0).fd(hfront - 0.06).arc(-70, 0.09).arc(-80, 0.05)
    S.taper(Hx(b.pts), bw * 1.25 * k, bw * 0.2 * k, 0.3)
  } else if (trunk) {
    // K3: the upper jaw runs forward and rises into an upturned, in-coiling trunk
    const u = hpen(-hfront - 0.04, hb + jw * 0.5, 0).fd(hfront + hs - 0.14).arc(90, 0.1).fd(0.3).arc(90, 0.08).fd(0.04).arc(90, 0.05)
    S.taper(Hx(u.pts), jw, jw * 0.6, 0.65)
  } else {
    // upper jaw: forward from the head, curling up and back in front of the eye
    const u = hpen(-hfront - 0.04, hb + jw * 0.5, 0).fd(hfront - 0.12).arc(90, 0.075).fd(0.1).arc(90, 0.055).fd(0.02)
    S.taper(Hx(u.pts), jw, jw * 0.6, 0.7)
  }
  if (p.head !== 'beaked') {
    // lower jaw: drops from under the head, runs forward, curls down and back
    const ly = 0.13
    const x0 = -(hfront + 0.16)
    const l = hpen(x0, hb + 0.02, -90).fd(Math.max(0.02, hb - ly - fr())).arc(90, fr()).fd(Math.max(0.05, -x0 - 0.2)).arc(-90, 0.04).fd(0.01).arc(-90, 0.03)
    S.taper(Hx(l.pts), jw * 0.85, jw * 0.5, 0.75)
  } else {
    const l = hpen(-(hfront + 0.08), hb + 0.02, -90).fd(0.08).arc(90, 0.04).fd(0.06).arc(-90, 0.03)
    S.taper(Hx(l.pts), jw * 0.7, jw * 0.35, 0.6)
  }
  // crest
  const cw = bw * 0.52 * k
  const top = eyeY + headH / 2
  const room = Math.max(0.08, (0.97 - hy) / k - top)
  if (p.crest === 't') {
    // T-crest (H5): a short stem and a bar whose ends turn down
    const yTop = top + room - cw / k * 0.5 - 0.01
    const st = hpen(-eyeS, top - 0.02, 90).fd(Math.max(0.02, yTop - top - 0.02))
    S.band(Hx(st.pts), cw, 'flat')
    const leg = Math.max(0, Math.min(0.03, yTop - 0.03 - cw / k - 0.04 - top))
    const bar = hpen(-eyeS - 0.15, yTop - leg - 0.03, 90).fd(leg).arc(-90, 0.03).fd(0.24).arc(-90, 0.03).fd(leg)
    S.band(Hx(bar.pts), cw)
  } else if (p.crest === 'bottle') {
    const st = hpen(-eyeS, top - 0.02, 90).fd(room * 0.35)
    S.band(Hx(st.pts), cw, 'flat')
    S.rrect(H([eyeS, top + room * 0.62]), 0.22, room * 0.62, 0.06)
  } else if (p.crest === 'hook') {
    const h = hpen(-eyeS - 0.06, top - 0.02, 90).fd(room * 0.3).arc(-90, room * 0.35).fd(0.12).arc(-90, 0.04).fd(0.01)
    S.taper(Hx(h.pts), cw, cw * 0.55, 0.6)
  }
  // eye (an L2 boss on the head plateau)
  const ek = p.eye === 'square' ? 'square' : p.eye === 'chen' ? 'oval' : 'round'
  S.boss(H([eyeS, eyeY]), eyeR * k, { kind: ek, pupil: p.pupil, base: 'plateau', aspect: 1.45 })
  if (p.eye === 'chen') {
    // 臣 canthus hooks: a short hooked line out of each corner of the almond
    const c = H([eyeS, eyeY])
    const ex = eyeR * 1.45 * k
    S.line([[c[0] + hf * ex * 0.9, c[1]], [c[0] + hf * ex * 1.35, c[1] - 0.04 * k], [c[0] + hf * ex * 1.35, c[1] - 0.09 * k]])
    S.line([[c[0] - hf * ex * 0.9, c[1]], [c[0] - hf * ex * 1.4, c[1] + 0.03 * k]])
  }

  // ---- body: a band from the back of the head, low enough to leave the
  // upper half for quills and the tail curl, ending in a tight coil
  const yb = turned ? 0.34 : 0.45
  const tailW = 0.42
  const xEnd = tailW * 0.5 + bw * 0.5 + 0.02 // where the body turns into the tail
  const bodyStart = turned ? X(0.2) : X(eyeS + 0.1)
  const body = new Pen(bodyStart, yb, 180, 0.01)
  if (turned) {
    // the neck: up from the body's front into the back of the turned head
    const nk = new Pen(X(0.2), yb, 90, 0.01).fd(0.3)
    S.band(nk.pts, bw * 0.9)
  }
  body.fd(Math.max(0.05, bodyStart - xEnd))
  const tr = fr(1.2)
  const d = bw * 0.82 + 0.07 // coil pitch: band + one groove-wide gap
  const sqTail = sq > 0.5
  if (p.tail !== 'down') {
    body.arc(-90, tr)
    if (sqTail) body.spiral({ a: 0.95 - yb - bw * 0.5 - tr, b: tailW, d, dir: -1, turns: 1.75, r: 1.6 - sq })
    else body.fd(0.12).curl(330, 0.19, 0.55, -1)
  } else {
    body.arc(90, tr)
    if (sqTail) body.spiral({ a: yb - 0.05 - bw * 0.5 - tr, b: tailW, d, dir: 1, turns: 1.75, r: 1.6 - sq })
    else body.fd(0.08).curl(330, 0.17, 0.55, 1)
  }
  S.taper(body.pts, bw, bw * 0.62, 0.5)
  if (p.tail === 'forked') {
    // the lower branch of a forked tail: a hook dropping from the body's underside, curling forward
    const fk = new Pen(xEnd + bw * 0.9, yb - bw * 0.3, 250, 0.008).fd(Math.max(0.05, yb - bw * 0.5 - 0.2)).arc(100, 0.06).fd(0.05).arc(110, 0.035)
    S.taper(fk.pts, bw * 0.8, bw * 0.35, 0.4)
  }
  // C-marks (scales) along the body, rows of ⊂ cuts (§3.3)
  if (p.marks === 'c-marks') {
    const n = Math.floor((bodyStart - xEnd - 0.3) / (bw * 1.3))
    for (let i = 0; i < n; i++) {
      const x = bodyStart - 0.3 - i * bw * 1.3
      const r = bw * 0.22
      const arc = []
      for (let a = 60; a <= 300; a += 20) arc.push([x + Math.cos((a * Math.PI) / 180) * r, yb + Math.sin((a * Math.PI) / 180) * r])
      S.line(arc)
    }
  }
  // quills: small backward hooks on the body's back
  const nq = p.quills | 0
  const qx0 = turned ? X(1.25) : X(eyeS + 0.4)
  const qSpan = Math.max(0.2, qx0 - xEnd - tailW * 0.5 - 0.2)
  for (let i = 0; i < nq; i++) {
    const x = qx0 - (nq === 1 ? qSpan * 0.4 : (qSpan * i) / Math.max(1, nq - 1))
    const q = new Pen(x, yb + bw * 0.3, 118, 0.008).fd(0.12 + bw * 0.3).arc(70, 0.05)
    S.taper(q.pts, bw * 0.55, bw * 0.2, 0.2)
  }
  // leg + claw, hanging near the head, toes forward
  if (p.leg) {
    const lx = turned ? X(0.72) : X(eyeS + 0.5)
    const fy = 0.17 // foot centre line
    const rr = fr(0.9)
    const lg = new Pen(lx, yb, -86, 0.01).fd(Math.max(0.05, yb - fy - rr)).arc(86, rr).fd(0.07).arc(-100, 0.04)
    S.taper(lg.pts, bw * 0.78, bw * 0.4, 0.6)
    // a second, shorter toe under the first, and a rear spur
    const toe = new Pen(lx + rr * 0.6, fy - bw * 0.25, -30, 0.008).fd(0.04).arc(-80, 0.025)
    S.taper(toe.pts, bw * 0.38, bw * 0.16, 0.3)
    const spur = new Pen(lx - bw * 0.2, fy + 0.02, 200, 0.008).fd(0.05).arc(80, 0.025)
    S.taper(spur.pts, bw * 0.4, bw * 0.15, 0.3)
  }
  return S
}

/** Draw one kui into rect (single), or the LEFT half of a facing pair (drawMotif mirrors). */
export function draw(panel, rect, params) {
  const p = withRelief(params)
  const pair = p.arrangement === 'pair'
  const gap = pair ? Math.min(p.centreGap, rect.w * 0.1) : 0
  const r = pair ? { x: rect.x, y: rect.y, w: rect.w / 2 - gap / 2, h: rect.h } : rect
  const rot = p.orient === 'up' ? 90 : p.orient === 'down' ? -90 : 0
  // authored facing +x: a pair's left kui faces the centre (+x); 'left' mirrors
  // vertical kui: the head end is set by orient; facing turns its back toward the
  // outer edge ('right' = a left-hand column, back to the left)
  const flip = rot === 0 && !pair && p.facing === 'left'
  const flipY = rot === 90 ? p.facing === 'left' : rot === -90 ? p.facing !== 'left' : false
  const f = makeFrame(r, { rot, flip, flipY })
  const rng = motifRng('kui', rect, p)
  const S = new Sheet(f, { rng, wobble: 0.004 * p.irregularity })
  buildKui(S, f.A, p)
  renderSheet(panel, S, p, { clip: rectClip(pair ? { ...rect, w: rect.w / 2 } : rect) })
  return S
}

/** Ground pitch scaled to the frieze (§1.3: 0.8–3 mm). */
export function groundOptions(p, rect) {
  const H = p.orient === 'horizontal' || !p.orient ? rect.h : rect.w
  return { pitch: Math.max(0.9, Math.min(2.6, H * 0.035)) }
}

export default {
  name: 'kui',
  label: 'Kui dragon',
  schema,
  presets,
  presetPlaques,
  draw,
  groundOptions,
  symmetric: (p) => p.arrangement !== 'single',
  facing: true, // honours params.facing / arrangement (compose.frieze relies on it)
  plaque: { w: 200, h: 44 },
}
