// ---------------------------------------------------------------------------
// Image work, done in the browser
//
// There is no `sharp` in this monorepo and adding a native image dependency to
// a repo of static toy apps to lay out a debug PNG is a bad trade. Chromium is
// already a hard requirement here — the tool cannot take a screenshot without
// it — so the compositing and the diffing both run on a 2D canvas in a blank
// page of the same browser instance.
//
// Everything below keeps its state in `window.__sheet` on one page and is
// driven one call at a time, so a 24-tile sheet never has 24 megabyte-sized
// base64 strings alive at once.
// ---------------------------------------------------------------------------

/** A blank page whose only job is to hold a canvas. */
export async function openCanvasPage(browser) {
  const page = await browser.newPage({ viewport: { width: 200, height: 200 } })
  await page.setContent('<!doctype html><meta charset="utf-8"><body style="margin:0"></body>')
  return page
}

export async function beginSheet(page, { width, height, background }) {
  await page.evaluate(
    ({ width, height, background }) => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const g = canvas.getContext('2d')
      g.fillStyle = background
      g.fillRect(0, 0, width, height)
      window.__sheet = { canvas, g }
    },
    { width, height, background },
  )
}

/**
 * Blit one PNG into the sheet, scaled to fit the cell.
 *
 * The tile arrives as base64 rather than as a file:// URL because the page has
 * no filesystem access, and rather than all at once because the peak string
 * size is what decides whether this survives a 60-tile sheet.
 */
export async function drawTile(page, { base64, x, y, width, height }) {
  await page.evaluate(
    async ({ base64, x, y, width, height }) => {
      const bitmap = await createImageBitmap(
        await (await fetch(`data:image/png;base64,${base64}`)).blob(),
      )
      window.__sheet.g.drawImage(bitmap, x, y, width, height)
      bitmap.close()
    },
    { base64, x, y, width, height },
  )
}

/**
 * Filled rectangles and text, batched — these are small enough to send in one
 * go, and the sheet's captions have to be drawn after the tiles they caption.
 */
export async function drawOverlay(page, ops) {
  await page.evaluate((ops) => {
    const g = window.__sheet.g
    for (const op of ops) {
      if (op.kind === 'rect') {
        g.fillStyle = op.fill
        g.fillRect(op.x, op.y, op.width, op.height)
        continue
      }
      if (op.kind === 'line') {
        g.strokeStyle = op.stroke
        g.lineWidth = op.width ?? 1
        g.beginPath()
        g.moveTo(op.x0, op.y0)
        g.lineTo(op.x1, op.y1)
        g.stroke()
        continue
      }
      g.font = op.font
      if ('letterSpacing' in g) g.letterSpacing = op.letterSpacing ?? '0px'
      g.fillStyle = op.fill
      g.textAlign = op.align ?? 'left'
      g.textBaseline = op.baseline ?? 'middle'
      g.fillText(op.text, op.x, op.y)
    }
    if ('letterSpacing' in g) g.letterSpacing = '0px'
  }, ops)
}

/** The finished sheet as a PNG buffer. */
export async function endSheet(page) {
  const dataUrl = await page.evaluate(() => window.__sheet.canvas.toDataURL('image/png'))
  return Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64')
}

/**
 * Per-pixel comparison of two PNGs.
 *
 * Reports three numbers because they answer three different questions. `mean`
 * is "did the whole frame shift" (a lighting or exposure change). `pctChanged`
 * is "how much of the frame moved at all" (a pose or camera change). `max` is
 * "did anything move a lot" (a single overlay appearing). A run that only
 * differs by solver jitter shows a small mean, a small percentage, and a large
 * max — the max alone is a bad regression signal.
 *
 * `diff` is an amplified heatmap, returned only when asked for, because
 * encoding one costs more than the comparison does.
 */
export async function comparePng(page, aBase64, bBase64, { threshold = 8, heatmap = false } = {}) {
  return page.evaluate(
    async ({ aBase64, bBase64, threshold, heatmap }) => {
      const load = async (b64) =>
        createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob())
      const [a, b] = await Promise.all([load(aBase64), load(bBase64)])
      if (a.width !== b.width || a.height !== b.height) {
        return {
          sizeMismatch: true,
          a: [a.width, a.height],
          b: [b.width, b.height],
          mean: NaN,
          max: NaN,
          pctChanged: NaN,
        }
      }
      const { width, height } = a
      const read = (bitmap) => {
        const c = new OffscreenCanvas(width, height)
        const g = c.getContext('2d', { willReadFrequently: true })
        g.drawImage(bitmap, 0, 0)
        return g.getImageData(0, 0, width, height).data
      }
      const pa = read(a)
      const pb = read(b)
      a.close()
      b.close()

      let sum = 0
      let max = 0
      let changed = 0
      const out = heatmap ? new Uint8ClampedArray(width * height * 4) : null
      for (let i = 0; i < pa.length; i += 4) {
        const dr = Math.abs(pa[i] - pb[i])
        const dg = Math.abs(pa[i + 1] - pb[i + 1])
        const db = Math.abs(pa[i + 2] - pb[i + 2])
        const d = Math.max(dr, dg, db)
        sum += (dr + dg + db) / 3
        if (d > max) max = d
        if (d > threshold) changed++
        if (out) {
          // Amplified 8x so a 3-level solver wobble is still visible; the base
          // frame stays as a dim grey so you can see *where* on the figure.
          const v = Math.min(255, d * 8)
          out[i] = v
          out[i + 1] = v > 0 ? Math.min(255, v * 0.35) : 0
          out[i + 2] = v > 0 ? 0 : 0
          if (v === 0) {
            const grey = (pa[i] + pa[i + 1] + pa[i + 2]) / 3
            out[i] = out[i + 1] = out[i + 2] = grey * 0.22
          }
          out[i + 3] = 255
        }
      }
      const px = width * height
      const result = {
        sizeMismatch: false,
        width,
        height,
        mean: sum / px,
        max,
        pctChanged: (100 * changed) / px,
      }
      if (out) {
        const c = new OffscreenCanvas(width, height)
        c.getContext('2d').putImageData(new ImageData(out, width, height), 0, 0)
        const blob = await c.convertToBlob({ type: 'image/png' })
        const buf = new Uint8Array(await blob.arrayBuffer())
        let s = ''
        for (let i = 0; i < buf.length; i += 0x8000) {
          s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000))
        }
        result.heatmap = btoa(s)
      }
      return result
    },
    { aBase64, bBase64, threshold, heatmap },
  )
}
