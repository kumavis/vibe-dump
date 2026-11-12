// "What this eye sees" — the visibility simulation shared by several views.
// Fog takes the lower half of the picture as the upper fibres fail.

/** A small landscape, then fog over the lower half as the upper fibres fail. */
function paintView(g, W, H, s) {
  const sky = g.createLinearGradient(0, 0, 0, H * 0.6)
  sky.addColorStop(0, '#6fb1e6'); sky.addColorStop(1, '#d9ecf7')
  g.fillStyle = sky; g.fillRect(0, 0, W, H)
  g.fillStyle = '#fff4c2'; g.beginPath(); g.arc(W * 0.78, H * 0.2, H * 0.07, 0, 7); g.fill()
  g.fillStyle = '#7fa66b'; g.beginPath(); g.moveTo(0, H * 0.55)
  g.quadraticCurveTo(W * 0.3, H * 0.36, W * 0.6, H * 0.52); g.quadraticCurveTo(W * 0.85, H * 0.42, W, H * 0.5)
  g.lineTo(W, H); g.lineTo(0, H); g.fill()
  g.fillStyle = '#5c8f4e'; g.fillRect(0, H * 0.6, W, H * 0.4)
  g.fillStyle = '#d9c7a0'; g.beginPath(); g.moveTo(W * 0.46, H * 0.6); g.lineTo(W * 0.54, H * 0.6)
  g.lineTo(W * 0.72, H); g.lineTo(W * 0.3, H); g.fill()
  g.fillStyle = '#f3ede2'; g.fillRect(W * 0.16, H * 0.44, W * 0.2, H * 0.2)
  g.fillStyle = '#a5483a'; g.beginPath(); g.moveTo(W * 0.13, H * 0.45); g.lineTo(W * 0.26, H * 0.3); g.lineTo(W * 0.39, H * 0.45); g.fill()
  g.fillStyle = '#4b3a2c'; g.fillRect(W * 0.24, H * 0.54, W * 0.04, H * 0.1)
  g.fillStyle = '#3f6f3a'; g.beginPath(); g.arc(W * 0.8, H * 0.52, H * 0.13, 0, 7); g.fill()
  g.fillStyle = '#5a4030'; g.fillRect(W * 0.79, H * 0.6, W * 0.02, H * 0.12)
  if (s.damage > 0.01) {
    const fog = g.createLinearGradient(0, H * 0.42, 0, H * 0.58)
    fog.addColorStop(0, 'rgba(72,74,84,0)'); fog.addColorStop(1, `rgba(72,74,84,${0.93 * s.damage})`)
    g.fillStyle = fog; g.fillRect(0, H * 0.42, W, H * 0.58)
  }
}

/** Add the inset to a stage container; call update(state) when the story moves. */
export function createVisionInset(el, caption = 'What this eye sees') {
  const inset = document.createElement('figure')
  inset.className = 'inset'
  inset.innerHTML = `<canvas width="320" height="200"></canvas><figcaption>${caption}</figcaption>`
  el.appendChild(inset)
  const g = inset.querySelector('canvas').getContext('2d')
  let painted = null
  return {
    update(s) {
      const key = s.damage.toFixed(3)
      if (key === painted) return
      painted = key
      paintView(g, 320, 200, s)
    },
  }
}
