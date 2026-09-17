export function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length) % arr.length]
}

export function shuffle(rng, arr) {
  const out = arr.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v
}

export function lerp(a, b, t) {
  return a + (b - a) * t
}

// Mixes two "#rrggbb" strings. Used for the day/night tint and for shading
// tiles without keeping a second palette around.
export function mixHex(a, b, t) {
  const pa = parseInt(a.slice(1), 16)
  const pb = parseInt(b.slice(1), 16)
  const r = Math.round(lerp((pa >> 16) & 255, (pb >> 16) & 255, t))
  const g = Math.round(lerp((pa >> 8) & 255, (pb >> 8) & 255, t))
  const bl = Math.round(lerp(pa & 255, pb & 255, t))
  return `rgb(${r},${g},${bl})`
}

// 07:30-style clock from minutes-since-midnight.
export function clockOf(minutes) {
  const m = ((minutes % 1440) + 1440) % 1440
  const h = Math.floor(m / 60)
  const mm = Math.floor(m % 60)
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

export function timeOfDay(minutes) {
  const h = Math.floor((((minutes % 1440) + 1440) % 1440) / 60)
  if (h < 5) return 'the small hours'
  if (h < 8) return 'early morning'
  if (h < 11) return 'mid-morning'
  if (h < 14) return 'midday'
  if (h < 17) return 'the afternoon'
  if (h < 20) return 'the evening'
  if (h < 23) return 'late evening'
  return 'night'
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
}
