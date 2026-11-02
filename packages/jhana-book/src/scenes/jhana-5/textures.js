// textures.js — canvas art for jhana-5: the far backdrop (horizon + vanishing
// grid + painted arches receding forever), the vertical wash the frames share,
// and a soft glow sprite. Everything is drawn once at build time.

function canvas(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

// The backdrop is a V-fold card, so each of its two panels shows the same half
// image: the left edge of this canvas is the crease (the centre line of the
// view), the right edge the panel's outer edge. u = t / R, v = s / L.
//   horizonV — the horizon's height as a fraction of the card (v)
//   aspect   — R / L of the card, so painted circles stay round
export function drawBackdrop(rnd, { horizonV = 0.3, aspect = 0.7 } = {}) {
  const H = 512
  const Wd = Math.round(H * aspect)
  const c = canvas(Wd, H)
  const g = c.getContext('2d')
  const yh = H * (1 - horizonV)

  // sky: deep indigo overhead, warming to lavender at the horizon
  const sky = g.createLinearGradient(0, 0, 0, yh)
  sky.addColorStop(0, '#07061a')
  sky.addColorStop(0.45, '#1a1650')
  sky.addColorStop(0.8, '#4a3a9a')
  sky.addColorStop(0.96, '#a593ec')
  sky.addColorStop(1, '#efe8ff')
  g.fillStyle = sky
  g.fillRect(0, 0, Wd, yh)

  // floor: dark near us, lit toward the horizon
  const floor = g.createLinearGradient(0, yh, 0, H)
  floor.addColorStop(0, '#6a5ac0')
  floor.addColorStop(0.18, '#2c2468')
  floor.addColorStop(1, '#0c0a24')
  g.fillStyle = floor
  g.fillRect(0, yh, Wd, H - yh)

  // painted stars in the sky, denser and fainter toward the zenith
  for (let i = 0; i < 160; i++) {
    const x = rnd() * Wd
    const y = Math.pow(rnd(), 1.4) * (yh - 12)
    const r = 0.5 + rnd() * rnd() * 1.6
    g.fillStyle = `rgba(232,226,255,${0.25 + rnd() * 0.6})`
    g.beginPath()
    g.arc(x, y, r, 0, Math.PI * 2)
    g.fill()
  }

  // vanishing grid on the floor: rays from the vanishing point (on the crease,
  // at the horizon) and cross lines bunching toward the horizon
  g.save()
  g.beginPath()
  g.rect(0, yh, Wd, H - yh)
  g.clip()
  g.lineWidth = 1.2
  for (let k = 0; k <= 9; k++) {
    const x = (k * Wd) / 3.2
    const a = 0.5 - k * 0.035
    const grad = g.createLinearGradient(0, yh, 0, H)
    grad.addColorStop(0, 'rgba(210,198,255,0)')
    grad.addColorStop(0.25, `rgba(190,176,255,${a})`)
    grad.addColorStop(1, `rgba(150,130,240,${a * 0.6})`)
    g.strokeStyle = grad
    g.beginPath()
    g.moveTo(0, yh)
    g.lineTo(x, H)
    g.stroke()
  }
  for (let k = 1; k <= 14; k++) {
    const d = 1 / (k * 0.55) // perspective spacing
    const y = yh + (H - yh) * Math.min(1, d * 0.42)
    if (y >= H) continue
    g.strokeStyle = `rgba(190,176,255,${0.08 + 0.32 * Math.min(1, (y - yh) / (H - yh) + 0.1)})`
    g.beginPath()
    g.moveTo(0, y)
    g.lineTo(Wd, y)
    g.stroke()
  }
  g.restore()

  // the colonnade continued: painted arches receding to the vanishing point.
  // x and y share one scale (Wd/R = H/L), so a circle is a circle.
  for (let k = 0; k < 9; k++) {
    const d = Math.pow(0.68, k + 1)
    const base = yh + (H - yh) * 0.95 * d
    const half = Wd * 0.85 * d
    const spring = base - 1.45 * half + half
    g.strokeStyle = `rgba(222,214,255,${0.5 * (1 - k / 10)})`
    g.lineWidth = Math.max(0.6, 4 * d)
    g.beginPath()
    g.moveTo(half, base)
    g.lineTo(half, spring)
    g.arc(0, spring, half, 0, -Math.PI / 2, true)
    g.stroke()
  }

  // the far glow at the vanishing point
  const glow = g.createRadialGradient(0, yh, 0, 0, yh, H * 0.42)
  glow.addColorStop(0, 'rgba(255,250,255,0.95)')
  glow.addColorStop(0.12, 'rgba(214,200,255,0.55)')
  glow.addColorStop(0.45, 'rgba(140,110,240,0.18)')
  glow.addColorStop(1, 'rgba(90,70,200,0)')
  g.fillStyle = glow
  g.fillRect(0, 0, Wd, H)
  return c
}

// A vertical wash for the frames: darker at the foot, lighter toward the top,
// with a whisper of paper grain. Multiplied by each frame's colour.
export function drawWash(rnd) {
  const c = canvas(128, 256)
  const g = c.getContext('2d')
  const grad = g.createLinearGradient(0, 256, 0, 0)
  grad.addColorStop(0, '#7d7d7d')
  grad.addColorStop(0.55, '#d4d4d4')
  grad.addColorStop(1, '#ffffff')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 256)
  const img = g.getImageData(0, 0, 128, 256)
  const d = img.data
  for (let i = 0; i < d.length; i += 4) {
    const n = (rnd() - 0.5) * 16
    d[i] += n
    d[i + 1] += n
    d[i + 2] += n
  }
  g.putImageData(img, 0, 0)
  return c
}

export function drawGlow() {
  const c = canvas(128, 128)
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.15, 'rgba(255,255,255,0.55)')
  grad.addColorStop(0.45, 'rgba(255,255,255,0.14)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  return c
}

// The vanishing grid continued on the pages: a faint printed construction
// drawing, rays from the far card's foot and cross lines bunching toward it.
// u = distance from the spine / W, v = 0 at the far edge … 1 at the near edge
// (z from −H/2 to +H/2). Lines fade out before the printed text strip.
export function drawFloorGrid({ vpZ = -0.47, nearZ = 0.42, H = 1.4, W = 1 } = {}) {
  const S = 1024
  const c = canvas(512, S)
  const g = c.getContext('2d')
  const px = (d) => (d / W) * 512
  const pz = (z) => ((z + H / 2) / H) * S
  const fade = g.createLinearGradient(0, pz(vpZ), 0, pz(nearZ))
  fade.addColorStop(0, 'rgba(200,188,255,0)')
  fade.addColorStop(0.12, 'rgba(200,188,255,0.55)')
  fade.addColorStop(0.7, 'rgba(200,188,255,0.32)')
  fade.addColorStop(1, 'rgba(200,188,255,0)')
  g.strokeStyle = fade
  g.lineWidth = 1.6
  g.beginPath()
  for (const d of [0.12, 0.3, 0.52, 0.8, 1.15, 1.6]) {
    g.moveTo(px(0), pz(vpZ))
    g.lineTo(px(d), pz(nearZ))
  }
  for (let j = 0; j < 8; j++) {
    const z = vpZ + (nearZ - vpZ) * Math.pow(0.7, j)
    const half = 1.75 * (z - vpZ) // the fan's half-width at this z, clipped by the page
    g.moveTo(px(0), pz(z))
    g.lineTo(px(Math.min(W, half)), pz(z))
  }
  g.stroke()
  return c
}
