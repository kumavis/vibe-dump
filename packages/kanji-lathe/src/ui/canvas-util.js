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

// Two ways to hand the viewer a file. On the open web an anchor is enough; in an
// embedded viewer the frame is sandboxed and an anchor silently does nothing, so
// the host mediates the save instead and the viewer confirms it. Resolve which
// one is available once, and let callers report the outcome either way.
let downloadsNs
async function hostDownloads() {
  if (downloadsNs !== undefined) return downloadsNs
  try {
    downloadsNs = (await globalThis.claude?.use?.('downloads')) ?? null
  } catch {
    downloadsNs = null
  }
  return downloadsNs
}

/** Offer `name` to the viewer. Resolves { saved } and never throws. */
export async function download(name, blobOrString, mime = 'text/plain') {
  const host = await hostDownloads()
  if (host) {
    try {
      await host.save({ filename: name, data: blobOrString })
      return { saved: true }
    } catch (err) {
      return { saved: false, code: err?.code || 'unavailable', message: err?.message || String(err) }
    }
  }
  const blob = blobOrString instanceof Blob ? blobOrString : new Blob([blobOrString], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
  return { saved: true }
}

/** What to tell someone when a save did not happen. */
export function saveFailureMessage(res, what) {
  switch (res.code) {
    case 'declined':
      return null // they said no; nothing to report back to them
    case 'extension_not_enabled':
      return `This viewer will not accept ${what} files — try the PNG export, or open the full app.`
    case 'too_large':
      return `That ${what} is over the 16 MiB the viewer accepts. Export fewer glyphs.`
    case 'rate_limited':
      return 'A save prompt is already open — finish that one first.'
    default:
      return `Could not save the ${what}: ${res.message}`
  }
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
