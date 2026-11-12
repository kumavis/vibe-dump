// Small 2-D figures shown beside the film: the visual-field simulation, the
// crowded-versus-roomy disc comparison, and the autoregulation sketch.
import { rng, smooth, lerp } from './util.js'

const INK = '#e8eaf0', DIM = '#98a0b3', LINE = '#3a4356', ACC = '#ffb86b', RED = '#ff6a5c'

function text(g, s, x, y, o = {}) {
  g.font = `${o.w || 400} ${o.size || 12}px system-ui, sans-serif`
  g.fillStyle = o.color || DIM; g.textAlign = o.align || 'left'; g.textBaseline = o.base || 'alphabetic'
  g.fillText(s, x, y)
}

/** What the right eye sees, and the same loss on a visual-field chart. */
function vision(g, W, H, s) {
  const d = s.damage
  // --- scene
  const sw = W * 0.56, sh = H - 26
  g.save(); g.beginPath(); g.roundRect(0, 0, sw, sh, 6); g.clip()
  const sky = g.createLinearGradient(0, 0, 0, sh * 0.6)
  sky.addColorStop(0, '#6fb1e6'); sky.addColorStop(1, '#d9ecf7'); g.fillStyle = sky; g.fillRect(0, 0, sw, sh)
  g.fillStyle = '#fff4c2'; g.beginPath(); g.arc(sw * 0.78, sh * 0.18, sh * 0.07, 0, 7); g.fill()
  g.fillStyle = '#7fa66b'; g.beginPath(); g.moveTo(0, sh * 0.52); g.quadraticCurveTo(sw * 0.3, sh * 0.34, sw * 0.6, sh * 0.5); g.quadraticCurveTo(sw * 0.85, sh * 0.4, sw, sh * 0.48); g.lineTo(sw, sh); g.lineTo(0, sh); g.fill()
  g.fillStyle = '#5c8f4e'; g.fillRect(0, sh * 0.58, sw, sh * 0.42)
  g.fillStyle = '#d9c7a0'; g.beginPath(); g.moveTo(sw * 0.46, sh * 0.58); g.lineTo(sw * 0.54, sh * 0.58); g.lineTo(sw * 0.74, sh); g.lineTo(sw * 0.28, sh); g.fill()
  g.fillStyle = '#f3ede2'; g.fillRect(sw * 0.15, sh * 0.42, sw * 0.2, sh * 0.2)
  g.fillStyle = '#a5483a'; g.beginPath(); g.moveTo(sw * 0.12, sh * 0.43); g.lineTo(sw * 0.25, sh * 0.27); g.lineTo(sw * 0.38, sh * 0.43); g.fill()
  g.fillStyle = '#4b3a2c'; g.fillRect(sw * 0.23, sh * 0.52, sw * 0.04, sh * 0.1)
  g.fillStyle = '#3f6f3a'; g.beginPath(); g.arc(sw * 0.8, sh * 0.5, sh * 0.13, 0, 7); g.fill()
  g.fillStyle = '#5a4030'; g.fillRect(sw * 0.79, sh * 0.58, sw * 0.02, sh * 0.13)
  if (d > 0.01) { // lower field goes; densest toward the nose (left, for a right eye)
    const fog = g.createLinearGradient(0, sh * 0.44, 0, sh * 0.6)
    fog.addColorStop(0, 'rgba(70,72,82,0)'); fog.addColorStop(1, `rgba(70,72,82,${0.86 * d})`)
    g.fillStyle = fog; g.fillRect(0, sh * 0.44, sw, sh * 0.56)
    const nasal = g.createRadialGradient(sw * 0.12, sh * 0.95, 0, sw * 0.12, sh * 0.95, sw * 0.6)
    nasal.addColorStop(0, `rgba(48,50,58,${0.85 * d})`); nasal.addColorStop(1, 'rgba(48,50,58,0)')
    g.save(); g.beginPath(); g.rect(0, sh * 0.5, sw, sh * 0.5); g.clip(); g.fillStyle = nasal; g.fillRect(0, 0, sw, sh); g.restore()
  }
  g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(sw / 2 - 5, sh / 2); g.lineTo(sw / 2 + 5, sh / 2); g.moveTo(sw / 2, sh / 2 - 5); g.lineTo(sw / 2, sh / 2 + 5); g.stroke()
  g.restore()
  text(g, 'Through the right eye', 2, H - 8)

  // --- visual-field chart: central 30 degrees
  const cx = W * 0.8, cy = sh / 2 + 6, R = Math.min(W * 0.19, sh / 2 - 8), deg = R / 30
  g.fillStyle = '#f2efe6'; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.fill()
  g.save(); g.beginPath(); g.arc(cx, cy, R, 0, 7); g.clip()
  if (d > 0.01) {
    g.fillStyle = `rgba(60,62,70,${0.55 * d})`; g.fillRect(cx - R, cy, 2 * R, R)
    g.fillStyle = `rgba(20,20,24,${0.8 * d})`; g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, R * 1.1, Math.PI * 0.5, Math.PI); g.closePath(); g.fill()
  }
  g.fillStyle = '#1b1b1f'; g.beginPath(); g.ellipse(cx + 13.5 * deg, cy + 1.5 * deg, 2.75 * deg, 3.75 * deg, 0, 0, 7); g.fill() // the natural blind spot
  g.restore()
  g.strokeStyle = '#8b8778'; g.lineWidth = 1
  for (const r of [10, 20, 30]) { g.beginPath(); g.arc(cx, cy, r * deg, 0, 7); g.stroke() }
  g.beginPath(); g.moveTo(cx - R, cy); g.lineTo(cx + R, cy); g.moveTo(cx, cy - R); g.lineTo(cx, cy + R); g.stroke()
  text(g, 'Field chart, central 30°', cx, H - 8, { align: 'center' })
  text(g, 'nose side', cx - R, 9, { size: 9.5 }); text(g, 'temple side', cx + R, 9, { size: 9.5, align: 'right' })
}

/** Two discs face-on, and the same fibres packed through each opening. */
function discs(g, W, H, s) {
  const rand = rng(3)
  const cols = [{ x: W * 0.26, title: 'Disc with a cup', cup: 0.42, ring: 44 }, { x: W * 0.74, title: 'Crowded disc', cup: 0.12, ring: 33 }]
  for (const c of cols) {
    text(g, c.title, c.x, 14, { align: 'center', color: INK, w: 600 })
    // face-on view
    const y0 = 56, R = 30
    g.fillStyle = '#b9491f'; g.fillRect(c.x - 62, 22, 124, 68)
    g.fillStyle = '#e58a55'; g.beginPath(); g.arc(c.x, y0, R * (c.ring / 44), 0, 7); g.fill()
    g.fillStyle = '#ffeccc'; g.beginPath(); g.arc(c.x, y0, R * (c.ring / 44) * c.cup, 0, 7); g.fill()
    g.strokeStyle = '#8a1a1a'; g.lineWidth = 2
    for (const a of [-2.2, -0.9, 0.9, 2.2]) { g.beginPath(); g.moveTo(c.x, y0); g.quadraticCurveTo(c.x + Math.cos(a) * 20, y0 + Math.sin(a) * 26, c.x + Math.cos(a) * 60, y0 + Math.sin(a) * 34); g.stroke() }
    text(g, `cup-to-disc ≈ ${c.cup < 0.2 ? '0.1' : '0.4'}`, c.x, 104, { align: 'center', size: 11 })
    // cross-section of the opening
    const yc = H - 62, Rr = c.ring, cup = Rr * c.cup, N = 70
    g.strokeStyle = '#d9d2c2'; g.lineWidth = 6; g.beginPath(); g.arc(c.x, yc, Rr + 5, 0, 7); g.stroke()
    const tight = c.cup < 0.2
    const sw = s.swelling * (tight ? 1 : 0.55)
    for (let i = 0; i < N; i++) {
      const r = Math.sqrt(cup * cup + (i + 0.5) / N * (Rr * Rr - cup * cup)), a = i * 2.39996
      const x = c.x + r * Math.cos(a), y = yc + r * Math.sin(a), top = y < yc
      const k = top ? sw : sw * 0.25
      g.fillStyle = tight && top ? `rgb(${Math.round(lerp(238, 150, s.damage))},${Math.round(lerp(220, 150, s.damage))},${Math.round(lerp(150, 158, s.damage))})` : '#eedc96'
      g.beginPath(); g.arc(x, y, 1.9 * (1 + 0.55 * k), 0, 7); g.fill()
    }
    for (let i = 0; i < 9; i++) { // capillaries among the bundles
      const a = i / 9 * 6.283 + 0.3, r = (cup + Rr) / 2 + (rand() - 0.5) * 8
      const top = Math.sin(a) < 0
      const shut = tight && top ? smooth(0.45, 0.95, s.swelling) : 0
      g.fillStyle = shut > 0.5 ? '#5a2026' : RED
      g.beginPath(); g.arc(c.x + r * Math.cos(a), yc + r * Math.sin(a), 2.4 * (1 - 0.5 * shut), 0, 7); g.fill()
    }
  }
  text(g, 'Above: face-on. Below: cut across at the opening.', W / 2, H - 6, { align: 'center', size: 10.5 })
}

/** Flow against perfusion pressure, with the eye's current position on the curve. */
function auto(g, W, H, s) {
  const x0 = 44, x1 = W - 16, y0 = H - 40, y1 = 26
  g.strokeStyle = LINE; g.lineWidth = 1; g.beginPath(); g.moveTo(x0, y1 - 8); g.lineTo(x0, y0); g.lineTo(x1, y0); g.stroke()
  text(g, 'Blood flow', x0 - 6, y1 - 12, { size: 11 })
  text(g, 'Perfusion pressure = mean blood pressure − eye pressure', (x0 + x1) / 2, H - 22, { align: 'center', size: 11 })
  text(g, 'Schematic. The source gives no numerical limits.', (x0 + x1) / 2, H - 7, { align: 'center', size: 10 })
  const f = p => (p < 0.38 ? 0.78 * (p / 0.38) ** 1.25 : p < 0.82 ? 0.78 + 0.03 * (p - 0.38) : 0.793 + 0.9 * (p - 0.82))
  const X = p => lerp(x0, x1, p), Y = v => lerp(y0, y1, v)
  g.fillStyle = 'rgba(127,209,168,0.1)'; g.fillRect(X(0.38), y1, X(0.82) - X(0.38), y0 - y1)
  text(g, 'autoregulation range', X(0.6), y1 + 12, { align: 'center', size: 10.5, color: '#7fd1a8' })
  g.strokeStyle = INK; g.lineWidth = 2; g.beginPath()
  for (let p = 0.02; p <= 1; p += 0.02) g.lineTo(X(p), Y(f(p)))
  g.stroke()
  const p = lerp(0.62, 0.2, smooth(1, 0.5, s.flowAll))
  g.fillStyle = s.flowAll < 0.8 ? RED : ACC; g.beginPath(); g.arc(X(p), Y(f(p)), 6, 0, 7); g.fill()
  text(g, s.night > 0.5 ? 'asleep: pressure dips' : 'awake', X(p) + 10, Y(f(p)) + 16, { size: 11, color: INK })
}

const FIGS = {
  vision: { draw: vision, w: 380, h: 150, title: 'Visibility simulation' },
  discs: { draw: discs, w: 380, h: 250, title: 'Why a small disc is at risk' },
  auto: { draw: auto, w: 380, h: 190, title: 'Autoregulation' },
}

export function makeFigure(el) {
  const canvas = el.querySelector('canvas'), cap = el.querySelector('figcaption'), g = canvas.getContext('2d')
  let current = null, key = ''
  return {
    update(name, s) {
      el.hidden = !name
      if (!name) { current = null; return }
      const F = FIGS[name]
      const k = name + [s.damage, s.swelling, s.flowAll, s.night > 0.5].map(v => (+v).toFixed(2)).join()
      if (k === key) return
      key = k
      if (current !== name) { current = name; canvas.width = F.w * 2; canvas.height = F.h * 2; canvas.style.aspectRatio = `${F.w} / ${F.h}`; cap.textContent = F.title }
      g.setTransform(2, 0, 0, 2, 0, 0); g.clearRect(0, 0, F.w, F.h)
      F.draw(g, F.w, F.h, s)
    },
  }
}
