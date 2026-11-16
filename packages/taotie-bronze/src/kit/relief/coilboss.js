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
 *   rot (deg: turns the whole boss), hand (+1 the body winds clockwise inward, −1 anticlockwise), base (mm | 'field')
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
  const st = o.striate === false ? null : { pitch: 0.75, depth: 0.22, slant: 0.9, from: 0.55, ...(o.striate || {}) }
  const hd = o.head === false ? null : { at: [-0.04, -0.14], w: 0.56, h: 0.46, height: 0.2, ...(o.head || {}) }
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
  const x0 = Math.max(0, Math.floor((c[0] - R) * ppmm) - pad), x1 = Math.min(cols - 1, Math.ceil((c[0] + R) * ppmm) + pad)
  const y0 = Math.max(0, Math.floor((c[1] - R) * ppmm) - pad), y1 = Math.min(rows - 1, Math.ceil((c[1] + R) * ppmm) + pad)
  const SS = [-0.25, 0.25]
  const bump = (dx, dy, rx, ry) => { const q = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry); return q >= 1 ? 0 : Math.sqrt(1 - q) }
  const sample = (X, Y) => {
    // boss frame, unit radius
    const lx = (X - c[0]) / R, ly = (Y - c[1]) / R
    const u = lx * cs - ly * sn, v = lx * sn + ly * cs
    const rho = Math.hypot(u, v)
    if (rho >= 1) return -Infinity
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
        const step = ridge * (0.7 + 0.6 * (bpsi / psiMax))
        h += step * Math.pow(1 - t * t, 0.6)
        // hatching: close oblique ribs across the body
        if (st && bpsi > st.from * TAU) {
          const arc = bpsi * (rho0 - b * bpsi) * R
          const ph = (arc + st.slant * best * R) / st.pitch
          const f = ph - Math.floor(ph)
          const g = Math.abs(f - 0.5) * 2 // 1 at the rib centre, 0 at the groove
          h -= st.depth * smooth((0.42 - g) / 0.2) * smooth((1 - t) / 0.25)
        }
      } else {
        // the sunk gap between two turns
        h -= ridge * 0.35 * smooth((t - 1) / (gapF * 2.5))
      }
    }
    if (hd) {
      const dx = u - hx, dy = v - hy
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
