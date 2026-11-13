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
  tail: E(['up', 'down'], 'up', 'Tail'),
  crest: E(['t', 'bottle', 'hook', 'none'], 't', 'Crest'),
  eye: E(['round', 'square', 'chen'], 'round', 'Eye'),
  pupil: E(['dot', 'slit', 'none'], 'dot', 'Pupil'),
  eyeSize: R(0.6, 1.5, 0.05, 1, 'Eye size'),
  quills: R(0, 4, 1, 2, 'Dorsal quills'),
  leg: { type: 'bool', default: true, label: 'Leg & claw' },
  bandWidth: R(0.12, 0.32, 0.01, 0.2, 'Band width (× H)'),
  square: R(0, 1, 0.05, 0.7, 'Squareness'),
  marks: E(['none', 'c-marks'], 'none', 'Body marks'),
  centreGap: R(0, 20, 0.5, 1.5, 'Gap at centre line', 'mm'),
  ...reliefSchema({ motif: 1.4, boss: 2.8, groove: 0.4, lineWeight: 0.5, echoInset: 1.0 }),
}

export const presets = {
  'k1-tail-up': {},
  'k2-tail-down': { tail: 'down', crest: 'hook' },
  'k3-trunked': { head: 'trunked', crest: 'none', quills: 1 },
  'k4-beaked': { head: 'beaked', crest: 'hook', eye: 'round' },
  'turned-back': { turned: true, crest: 'none', quills: 1 },
  single: { arrangement: 'single' },
  'vertical-head-up': { arrangement: 'single', orient: 'up', quills: 1, crest: 'hook' },
  flush: { style: 'flush', lineWeight: 0.55, relief: { motif: 0.4, boss: 1.5, groove: 0.4 } },
  // Met fangyi 1974.268.2 / NMAA F1915.136 neck & foot bands: one kui per
  // half-face, squared bands, rounded-square boss eye with a slit, low relief
  'fangyi-band': {
    eye: 'square', pupil: 'slit', eyeSize: 1.15, crest: 't', quills: 1, square: 0.9, bandWidth: 0.21,
    lineWeight: 0.5, echoInset: 0.95, relief: { motif: 1.3, boss: 2.6, groove: 0.38 },
  },
  // Houmuwu ding wall frame: long squared kui at monumental scale (frieze ~80 mm)
  houmuwu: {
    eye: 'round', pupil: 'dot', crest: 't', quills: 2, square: 0.92, bandWidth: 0.2, marks: 'c-marks',
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
  const eyeR = 0.12 * p.eyeSize
  // ---- head: placed by a head transform (scale k, snout at (sx, sy), facing ±1)
  const k = turned ? 0.62 : 1
  const hs = trunk ? 0.16 : 0 // trunk room in front of the head
  const hx = turned ? X(0.06) : X(hs) // snout x
  const hy = turned ? 0.36 : 0 // head y offset
  const hf = turned ? -1 : 1
  const H = ([s, y]) => [hx - hf * s * k, hy + y * k] // head-local (s back from snout, y) → creature
  const Hp = (pts) => pts.map(H)
  const hpen = (s, y, heading) => new Pen(s, y, heading, 0.01) // head-local pen; headings in head space (0 = toward the snout)
  // head-space heading 0 points toward the snout (−s); a pen in head space works in (−s, y) coords:
  // we author with x = −s so "forward" is +x, then map with Hx.
  const Hx = (pts) => Hp(pts.map(([x, y]) => [-x, y]))

  const headW = 0.52, headH = 0.34, eyeS = 0.6, eyeY = 0.6
  // head block
  S.rrect(H([eyeS, eyeY]), headW * k, headH * k, fr(1.1) * k + 0.02)
  // jaws / beak / trunk
  const jw = bw * 0.85 * k
  if (p.head === 'beaked') {
    const b = hpen(-0.4, 0.5, 0).fd(0.24).arc(-60, 0.1).arc(-70, 0.06)
    S.taper(Hx(b.pts), bw * 1.05 * k, bw * 0.18 * k, 0.35)
    const lj = hpen(-0.5, 0.36, 0).fd(0.1).arc(-80, 0.05)
    S.taper(Hx(lj.pts), bw * 0.6 * k, bw * 0.25 * k, 0.3)
  } else {
    // upper jaw: forward, then curling up and back toward the eye
    const uy = 0.4
    const u = hpen(-0.45, uy, 0).fd(0.36 - (trunk ? -0.04 : 0))
    if (trunk) {
      u.arc(90, 0.08).fd(0.22).arc(90, 0.08).fd(0.02).arc(90, 0.05)
      S.taper(Hx(u.pts), jw, jw * 0.6, 0.6)
    } else {
      u.arc(90, 0.07).fd(0.05).arc(90, 0.05).fd(0.02)
      S.taper(Hx(u.pts), jw, jw * 0.65, 0.7)
    }
    // lower jaw: drops from the head, runs forward, curls down and back
    const ly = 0.15
    const l = hpen(-0.74, 0.46, -90).fd(0.46 - ly - fr()).arc(90, fr()).fd(0.36 - (trunk ? 0.06 : 0)).arc(-90, 0.05).fd(0.02).arc(-80, 0.035)
    S.taper(Hx(l.pts), jw * 0.9, jw * 0.55, 0.75)
  }
  // crest
  const cw = bw * 0.7 * k
  const top = eyeY + headH / 2
  if (p.crest === 't') {
    const st = hpen(-0.64, top - 0.02, 90).fd(0.1)
    S.band(Hx(st.pts), cw, 'flat')
    const yb = st.y
    const bar = hpen(-0.84, yb - 0.06, 90).fd(0.04).arc(-90, 0.04).fd(0.32).arc(-90, 0.04).fd(0.04)
    S.band(Hx(bar.pts), cw)
  } else if (p.crest === 'bottle') {
    const st = hpen(-0.64, top - 0.02, 90).fd(0.1)
    S.band(Hx(st.pts), cw, 'flat')
    S.rrect(H([0.64, st.y + 0.07]), 0.2 * k, 0.13 * k, 0.05 * k)
  } else if (p.crest === 'hook') {
    const h = hpen(-0.7, top - 0.02, 90).fd(0.06).arc(-90, 0.07).fd(0.12).arc(-90, 0.04).fd(0.02)
    S.taper(Hx(h.pts), cw, cw * 0.6, 0.6)
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

  // ---- body
  const yb = turned ? 0.42 : 0.6
  const tailR = p.tail === 'up' ? 0.3 : 0.26
  const xEnd = tailR + bw * 0.5 + 0.04 // where the body turns into the tail
  const bodyStart = turned ? X(0.12) : X(eyeS + 0.12)
  const body = new Pen(bodyStart, yb, 180, 0.01)
  if (turned) {
    // the neck: up from the body's front into the back of the turned head
    const nk = new Pen(X(0.18), yb, 90, 0.01).fd(0.22)
    S.band(nk.pts, bw * 0.9)
  }
  body.fd(Math.max(0.05, bodyStart - xEnd))
  const tr = fr(1.2)
  if (p.tail === 'up') {
    body.arc(-90, tr).spiral({ a: Math.min(0.96 - yb - bw * 0.5, 0.3), b: Math.min(0.42, tailR + 0.15), d: bw * 1.75, dir: -1, turns: 1.1, r: 0.9 - 0.6 * sq })
  } else {
    body.arc(90, tr).spiral({ a: Math.max(0.12, yb - bw * 0.5 - 0.08), b: Math.min(0.42, tailR + 0.15), d: bw * 1.75, dir: 1, turns: 1.1, r: 0.9 - 0.6 * sq })
  }
  S.taper(body.pts, bw, bw * 0.72, 0.55)
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
  const qx0 = turned ? X(0.55) : X(eyeS + 0.42)
  const qSpan = Math.max(0.2, qx0 - xEnd - 0.35)
  for (let i = 0; i < nq; i++) {
    const x = qx0 - (nq === 1 ? qSpan * 0.4 : (qSpan * i) / Math.max(1, nq - 1))
    const q = new Pen(x, yb + bw * 0.3, 112, 0.008).fd(0.1 + bw * 0.25).arc(80, 0.045)
    S.taper(q.pts, bw * 0.55, bw * 0.2, 0.2)
  }
  // leg + claw, hanging near the head, toes forward
  if (p.leg) {
    const lx = turned ? X(0.7) : X(eyeS + 0.55)
    const lg = new Pen(lx, yb, -84, 0.01).fd(Math.max(0.1, yb - bw * 0.5 - 0.17)).arc(84, fr(0.9)).fd(0.1).arc(-100, 0.04)
    S.taper(lg.pts, bw * 0.8, bw * 0.38, 0.6)
    const toe = new Pen(lx + 0.02, 0.13, 30, 0.008).fd(0.05).arc(-110, 0.03)
    S.taper(toe.pts, bw * 0.4, bw * 0.18, 0.3)
    const spur = new Pen(lx - 0.02, 0.17, 205, 0.008).fd(0.06).arc(70, 0.03)
    S.taper(spur.pts, bw * 0.42, bw * 0.15, 0.3)
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
  let flip = !pair && p.facing === 'left'
  if (rot === -90) flip = !flip
  const f = makeFrame(r, { rot, flip })
  const rng = motifRng('kui', rect, p)
  const S = new Sheet(f, { rng, wobble: 0.004 * p.irregularity })
  buildKui(S, f.A, p)
  renderSheet(panel, S, p, { clip: rectClip(pair ? { ...rect, w: rect.w / 2 } : rect) })
  return S
}

/** Ground pitch scaled to the frieze (§1.3: 0.8–3 mm). */
export function groundOptions(p, rect) {
  const H = p.orient === 'horizontal' || !p.orient ? rect.h : rect.w
  return { pitch: Math.max(0.9, Math.min(2.6, H * 0.05)) }
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
