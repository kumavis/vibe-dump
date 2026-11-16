// STATUS: first pass — the coiled-serpent boss 盘蛇枚 of Eastern Zhou bells (Nezu bo 90120, reference/nezu-bo).
//
// On a Spring and Autumn bo / zhong the 枚 (the bosses in rows of three beside the central panel) are not plain
// nipples: each is a serpent coiled on itself into a low dome. Read off the owner's photographs (photo-18 / 19,
// detail-boss.jpg): the body winds ≈ 2 turns from the foot of the dome to its crown, every turn a ROUNDED ridge
// stepped up on the one outside it with a narrow sunk gap between them, the inner turns hatched by close oblique
// ribs (the scales), the outer turn plain or finely ringed; a small beast head with two bulging eyes, brows, ears
// and a broad snout lies on the crown just below the centre, looking out. The foot meets the wall steeply.
//
//   coilBoss(panel, { c, r, height, turns, gap, striate, head, rot, hand, base })   writes the field (max), its bbox only
//   coilBossProfile(rho, height)   the bare dome (mm) at a fraction of the radius — for placing other parts on it
//
// All mm, panel frame, y up. Cost: 4 samples per pixel of the bbox (a 40 mm boss at 10 px/mm ≈ 0.6 M samples).

const TAU = Math.PI * 2
const D2R = Math.PI / 180
const clamp = (x, a, b) => (x < a ? a : x > b ? b : x)
const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t) }

/** the bare dome: steep at the foot, rounded crown (fraction of `height`) */
export function coilBossProfile(rho, height = 1) {
  if (rho >= 1) return 0
  return height * Math.pow(1 - Math.pow(rho, 2.4), 0.62)
}

/**
 * @param {import('./panel.js').ReliefPanel} panel
 * @param {object} o
 *   c [x, y] mm · r radius (mm) · height (mm, crown above the base) · turns (2.1) · gap (0.16: the sunk gap between
 *   turns, fraction of the pitch) · ridge (0.13: each turn's rounded swell, fraction of height) · striate: { pitch mm
 *   (0.75), depth mm (0.22), slant (0.9), from (0.55: turns from the outside before the hatching starts) } | false ·
 *   head: { at: [dx, dy] (fraction of r, default [-0.04, -0.14]), w (0.56 r), h (0.46 r), height (0.2 × height) } | false ·
 *   rot (deg: turns the whole boss), hand (+1 the body winds clockwise inward, −1 anticlockwise), base (mm | 'field') ·
 *   optional (defaults keep the round boss): apron: { depth (1.5 × r below the centre), end (0.72 × r), drop (0.45) } — the
 *   drop-shaped boss whose dome runs down into a smooth tongue; foot: 'plain' (no sunk step outside the outer turn);
 *   head.style: 'tiger' (a larger frontal tiger mask centred on the crown); mirror: true (reflect in x)
 * @returns {{ c, r, height }}
 */
export function coilBoss(panel, o = {}) {
  const c = o.c ?? [0, 0]
  const R = o.r ?? 18
  const Hb = o.height ?? R * 0.7
  const turns = o.turns ?? 2.1
  const gapF = o.gap ?? 0.16
  const ridge = (o.ridge ?? 0.13) * Hb
  const hand = o.hand ?? 1
  const rot = (o.rot ?? 0) * D2R
  const flipX = o.mirror ? -1 : 1
  const st = o.striate === false ? null : { pitch: 0.75, depth: 0.22, slant: 0.9, from: 0.55, ...(o.striate || {}) }
  const tiger = o.head && o.head.style === 'tiger'
  const hd = o.head === false ? null : tiger
    ? { at: [0, 0.02], w: 0.8, h: 0.66, height: 0.32, ...o.head }
    : { at: [-0.04, -0.14], w: 0.56, h: 0.46, height: 0.2, ...(o.head || {}) }
  // optional apron (the drop-shaped boss of the Nezu bo): the dome runs on downward (panel −y, never rotated) into a
  // smooth tongue ending `depth` × r below the centre in a round end of radius `end` × r, `drop` of the height lost
  const ap = o.apron ? { depth: 1.5, end: 0.72, drop: 0.45, ...o.apron } : null
  const plainFoot = o.foot === 'plain'
  const base = o.base === 'field' ? panel.heightAt(c[0], c[1]) : o.base ?? 0
  const { cols, rows, ppmm, field } = panel
  // the spiral: centre line rho(psi) = rho0 - b psi, psi from 0 (outer start, at angle phi0) to psiMax
  const rhoEnd = 0.3
  const pitch = (1 - rhoEnd) / turns
  const rho0 = 1 - pitch * 0.5
  const b = pitch / TAU
  const psiMax = TAU * turns
  const phi0 = (o.start ?? 200) * D2R
  const cs = Math.cos(-rot), sn = Math.sin(-rot)
  // head frame (fractions of R, rotated with the boss)
  const hx = hd ? hd.at[0] : 0, hy = hd ? hd.at[1] : 0
  const hw = hd ? hd.w / 2 : 0, hh = hd ? hd.h / 2 : 0
  const headH = hd ? hd.height * Hb : 0
  const pad = 2
  const yLow = ap ? c[1] - R * ap.depth : c[1] - R
  const x0 = Math.max(0, Math.floor((c[0] - R) * ppmm) - pad), x1 = Math.min(cols - 1, Math.ceil((c[0] + R) * ppmm) + pad)
  const y0 = Math.max(0, Math.floor(yLow * ppmm) - pad), y1 = Math.min(rows - 1, Math.ceil((c[1] + R) * ppmm) + pad)
  const SS = [-0.25, 0.25]
  const bump = (dx, dy, rx, ry) => { const q = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry); return q >= 1 ? 0 : Math.sqrt(1 - q) }
  // the apron: max over centres sliding down the axis, radius and height shrinking toward the round end
  const apronAt = (lx, ly) => {
    if (!ap) return -Infinity
    const Dc = ap.depth - ap.end
    let best = -Infinity
    for (let k = 0; k <= 16; k++) {
      const t = k / 16
      const rr = 1 + (ap.end - 1) * t
      const d = Math.hypot(lx, ly + t * Dc) / rr
      if (d >= 1) continue
      const hgt = coilBossProfile(d, Hb * (1 - ap.drop * t)) // t = 0 is the bare dome itself: no crease where they meet
      if (hgt > best) best = hgt
    }
    return best
  }
  const tigerHead = (dx, dy) => {
    // a tiger's head looking out of the coil, high relief: a rounded skull, round ears standing at the top corners,
    // bulging round eyes under a heavy brow, a broad muzzle PROJECTING below them (the highest point), a wide sunk
    // mouth at its foot
    const sq = Math.pow(Math.abs(dx) / hw, 2.2) + Math.pow(Math.abs(dy) / hh, 2.2)
    const m = sq >= 1 ? 0 : Math.pow(1 - sq, 0.5)
    const ax = Math.abs(dx)
    const ear = bump(ax - hw * 0.66, dy - hh * 0.8, hw * 0.2, hh * 0.26) * (1 - 0.5 * smooth((ax - hw * 0.66) / (hw * 0.2)))
    if (m <= 0 && ear <= 0) return 0
    let h = headH * (0.62 * m + 0.22 * ear)
    if (m > 0) {
      h += headH * 0.3 * bump(ax - hw * 0.36, dy - hh * 0.42, hw * 0.4, hh * 0.16) // brow
      h += headH * 0.4 * bump(ax - hw * 0.38, dy - hh * 0.1 + (ax - hw * 0.38) * 0.35, hw * 0.24, hh * 0.13) // eyes: almond, slanting up and out
      h -= headH * 0.16 * bump(ax - hw * 0.38, dy - hh * 0.12, hw * 0.07, hh * 0.07)
      h += headH * 0.62 * bump(dx, dy + hh * 0.36, hw * 0.48, hh * 0.4) // muzzle
      h += headH * 0.22 * bump(ax - hw * 0.18, dy + hh * 0.42, hw * 0.2, hh * 0.18) // whisker pads
      const my = dy + hh * (0.8 - 0.14 * Math.pow(ax / hw, 2))
      h -= headH * 0.5 * bump(dx, my, hw * 0.55, hh * 0.08) // mouth
    }
    return h
  }
  const sample = (X, Y) => {
    // boss frame, unit radius
    const lx = (flipX * (X - c[0])) / R, ly = (Y - c[1]) / R
    const u = lx * cs - ly * sn, v = lx * sn + ly * cs
    const rho = Math.hypot(u, v)
    const hA = apronAt(lx, ly)
    if (rho >= 1) return hA
    let h = coilBossProfile(rho, Hb)
    // the coil: nearest turn by radius
    const phi = Math.atan2(v, u)
    let a0 = (hand > 0 ? phi0 - phi : phi - phi0) % TAU
    if (a0 < 0) a0 += TAU
    let best = 1e9, bpsi = 0
    for (let k = 0; k <= turns + 1; k++) {
      const psi = a0 + k * TAU
      if (psi > psiMax) break
      const d = rho - (rho0 - b * psi)
      if (Math.abs(d) < Math.abs(best)) { best = d; bpsi = psi }
    }
    if (rho < rhoEnd - pitch * 0.2) {
      // the crown inside the last turn: a little knob (under the head on most bosses)
      h += ridge * 0.6 * smooth(1 - rho / rhoEnd)
    } else {
      const half = pitch * (1 - gapF) * 0.5
      const t = Math.abs(best) / half
      if (t < 1) {
        // a rounded turn, swelling more toward the crown (each turn steps up on the last)
        // (plain foot: the tail swells in from nothing over its first ≈ quarter turn, no step where the coil starts)
        const step = ridge * (0.7 + 0.6 * (bpsi / psiMax)) * (plainFoot ? smooth(bpsi / 1.6) : 1)
        h += step * Math.pow(1 - t * t, 0.6)
        // hatching: close oblique ribs across the body
        if (st && bpsi > st.from * TAU) {
          const arc = bpsi * (rho0 - b * bpsi) * R
          const ph = (arc + st.slant * best * R) / st.pitch
          const f = ph - Math.floor(ph)
          const g = Math.abs(f - 0.5) * 2 // 1 at the rib centre, 0 at the groove
          h -= st.depth * smooth((0.42 - g) / 0.2) * smooth((1 - t) / 0.25)
        }
      } else if (!(plainFoot && best > 0 && rho > rho0)) {
        // the sunk gap between two turns (with a plain foot: not outside the outermost turn)
        h -= ridge * 0.35 * smooth((t - 1) / (gapF * 2.5))
      }
    }
    const bare = coilBossProfile(rho, Hb)
    if (plainFoot) {
      // the outer turn spreads into the foot: no step down at the rim, fade the coil's modulation into the bare dome
      const f = smooth((rho - 0.86) / 0.14)
      h = h * (1 - f) + bare * f
    }
    if (hA > bare) {
      // the apron fills under the lower turns: add its excess over the bare dome, and let the coil's modulation fade
      // as the tongue takes over (no crease where the two meet)
      const ex = hA - bare
      const f = smooth(ex / (0.3 * Hb))
      h = bare + (h - bare) * (1 - f) + ex
    }
    if (hd) {
      const dx = u - hx, dy = v - hy
      if (tiger) {
        const th = tigerHead(dx, dy)
        if (th > 0) h = Math.max(h, coilBossProfile(Math.min(0.99, Math.hypot(hx, hy)), Hb) + ridge * 0.4 + th)
      } else {
        const m = bump(dx, dy, hw, hh)
        if (m > 0) {
          // the head: a domed mass with two bulging eyes, brow ridges, ears, a broad snout and a sunk mouth line
          let hh2 = headH * Math.pow(m, 0.55)
          hh2 += headH * 0.55 * bump(dx + hw * 0.42, dy - hh * 0.12, hw * 0.24, hh * 0.24) // eyes
          hh2 += headH * 0.55 * bump(dx - hw * 0.42, dy - hh * 0.12, hw * 0.24, hh * 0.24)
          hh2 += headH * 0.35 * bump(dx + hw * 0.45, dy - hh * 0.45, hw * 0.3, hh * 0.12) // brows
          hh2 += headH * 0.35 * bump(dx - hw * 0.45, dy - hh * 0.45, hw * 0.3, hh * 0.12)
          hh2 += headH * 0.4 * bump(dx, dy + hh * 0.42, hw * 0.42, hh * 0.3) // snout
          hh2 -= headH * 0.3 * bump(dx, dy + hh * 0.7, hw * 0.4, hh * 0.06) // mouth
          hh2 -= headH * 0.25 * bump(dx + hw * 0.42, dy - hh * 0.12, hw * 0.07, hh * 0.07) // pupils
          hh2 -= headH * 0.25 * bump(dx - hw * 0.42, dy - hh * 0.12, hw * 0.07, hh * 0.07)
          h = Math.max(h, coilBossProfile(Math.hypot(hx, hy), Hb) + ridge * 0.6 + hh2 * smooth(m * 4))
        }
        // ears: two small bumps on the crown above the head
        const e = Math.max(bump(u - hx + hw * 0.78, v - hy - hh * 0.8, hw * 0.22, hh * 0.24), bump(u - hx - hw * 0.78, v - hy - hh * 0.8, hw * 0.22, hh * 0.24))
        if (e > 0) h = Math.max(h, coilBossProfile(rho, Hb) + ridge + headH * 0.6 * e)
      }
    }
    return h
  }
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      let acc = 0, n = 0
      for (const sy of SS) for (const sx of SS) {
        const h = sample((x + 0.5 + sx) / ppmm, (y + 0.5 + sy) / ppmm)
        if (h === -Infinity) continue
        acc += h; n++
      }
      if (!n) continue
      const val = base + (acc / 4) // partial coverage at the foot fades to the base
      const i = y * cols + x
      if (val > field[i]) field[i] = val
    }
  }
  return { c, r: R, height: Hb }
}
