// Canvas plumbing shared by every view: keep the backing store in step with the
// element's CSS size and the device pixel ratio, without thrashing on resize.

export function fitCanvas(canvas, cssW, cssH, maxDpr = 2) {
  const dpr = Math.min(maxDpr, window.devicePixelRatio || 1)
  const w = Math.max(1, Math.round(cssW * dpr))
  const h = Math.max(1, Math.round(cssH * dpr))
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
  }
  canvas.style.width = cssW + 'px'
  canvas.style.height = cssH + 'px'
  return { dpr, w, h }
}

/** Largest centred square box of `size` inside a rect, as renderGlyph wants it. */
export function squareBox(w, h, pad = 0) {
  const s = Math.max(1, Math.min(w, h) - pad * 2)
  return { x: (w - s) / 2, y: (h - s) / 2, w: s, h: s }
}

export function download(name, blobOrString, mime = 'text/plain') {
  const blob = blobOrString instanceof Blob ? blobOrString : new Blob([blobOrString], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}

export function toast(message, isError = false) {
  const prev = document.querySelector('.toast')
  if (prev) prev.remove()
  const t = document.createElement('div')
  t.className = 'toast' + (isError ? ' is-error' : '')
  t.textContent = message
  document.body.appendChild(t)
  setTimeout(() => t.remove(), isError ? 5200 : 2600)
}
