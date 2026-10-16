// Hero: the exponents tick down, and a recursion tree shows how little of it a
// sparse set of wanted entries needs.

import { $, $$, color, fitCanvas, onResize, onTheme, reducedMotion } from '../util.js'
import { TERMS, leavesOf, undigits } from '../algo.js'

function odometers() {
  const odos = $$('.odo')
  if (reducedMotion()) return
  for (const node of odos) {
    const from = Number(node.dataset.from)
    const to = Number(node.dataset.to)
    const steps = Math.round((from - to) * 10000)
    const start = performance.now() + 180
    const dur = 160 + steps * 85
    node.textContent = from.toFixed(4)
    const tick = (now) => {
      const t = Math.min(1, Math.max(0, (now - start) / dur))
      const e = 1 - (1 - t) ** 2
      const k = Math.round(e * steps)
      node.textContent = (from - k / 10000).toFixed(4)
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }
}

// Three levels, one inner level per wanted output: z0 at one level, z_ij at
// the other two. Each needs 10 leaves; the first three share two of them
// (P13 P12 P31 and P13 P21 P31), so the four reach 38 of the 1,000.
const L = 3
const WANTED = [
  [9, 1, 6], // z0  z12 z31
  [2, 9, 6], // z13 z0  z31
  [2, 3, 9], // z13 z21 z0
  [4, 8, 9], // z22 z33 z0
].map((d) => undigits(d, 10))

function tree() {
  const cv = $('#hero-tree')
  if (!cv) return
  const leaves = new Set()
  for (const w of WANTED) for (const t of leavesOf(w, L)) leaves.add(t)
  const visited = [new Set([0]), new Set(), new Set(), leaves]
  for (const t of leaves) {
    visited[1].add(Math.floor(t / 100))
    visited[2].add(Math.floor(t / 10))
  }

  let progress = reducedMotion() ? 1 : 0
  let started = 0

  const draw = () => {
    const { ctx, w, h } = fitCanvas(cv)
    ctx.clearRect(0, 0, w, h)
    const ink = color('ink')
    const faint = color('rule-2')
    const accent = color('accent')
    const sans = getComputedStyle(document.body).getPropertyValue('--mono') || 'monospace'

    const padX = Math.max(6, w * 0.02)
    const top = 14
    const bottom = h - 26
    const ys = [top, top + (bottom - top) * 0.3, top + (bottom - top) * 0.68, bottom]
    const span = w - 2 * padX
    const xLeaf = (t) => padX + ((t + 0.5) / 1000) * span
    const xAt = (depth, idx) => {
      // a vertex sits over the middle of its leaves
      const width = 10 ** (L - depth)
      return padX + ((idx * width + width / 2) / 1000) * span
    }

    // the whole tree, faint
    ctx.lineCap = 'round'
    ctx.strokeStyle = faint
    for (let depth = 2; depth >= 0; depth--) {
      const n = 10 ** depth
      ctx.lineWidth = depth === 2 ? 0.45 : depth === 1 ? 0.7 : 0.9
      ctx.globalAlpha = depth === 2 ? 0.55 : 0.85
      ctx.beginPath()
      for (let i = 0; i < n; i++) {
        const px = xAt(depth, i)
        for (let c = 0; c < 10; c++) {
          const ci = i * 10 + c
          ctx.moveTo(px, ys[depth])
          ctx.lineTo(depth === 2 ? xLeaf(ci) : xAt(depth + 1, ci), ys[depth + 1])
        }
      }
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    // the pruned recursion, drawn level by level as `progress` runs 0 → 1
    const seg = (d) => Math.max(0, Math.min(1, progress * 3 - d))
    ctx.strokeStyle = ink
    for (let depth = 0; depth < 3; depth++) {
      const f = seg(depth)
      if (f <= 0) break
      ctx.lineWidth = 1.3
      ctx.beginPath()
      for (const child of visited[depth + 1]) {
        const parent = Math.floor(child / 10)
        const px = xAt(depth, parent)
        const cx = depth === 2 ? xLeaf(child) : xAt(depth + 1, child)
        ctx.moveTo(px, ys[depth])
        ctx.lineTo(px + (cx - px) * f, ys[depth] + (ys[depth + 1] - ys[depth]) * f)
      }
      ctx.stroke()
    }
    // vertices on the pruned paths
    ctx.fillStyle = ink
    for (let depth = 0; depth < 3; depth++) {
      if (seg(depth) <= 0) break
      for (const i of visited[depth]) {
        ctx.beginPath()
        ctx.arc(xAt(depth, i), ys[depth], depth === 0 ? 3.5 : 2.4, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    if (seg(2) >= 1) {
      ctx.fillStyle = accent
      for (const t of leaves) {
        ctx.beginPath()
        ctx.arc(xLeaf(t), ys[3], 2.6, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // the ten products under the root
    ctx.fillStyle = color('ink-3')
    ctx.font = `${w < 420 ? 9 : 11}px ${sans}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = color('paper')
    ctx.lineWidth = 4
    for (let i = 0; i < 10; i++) {
      if (w < 360 && i % 2) continue
      ctx.strokeText(TERMS[i], xAt(1, i), ys[1] + 7)
      ctx.fillText(TERMS[i], xAt(1, i), ys[1] + 7)
    }
    ctx.textBaseline = 'alphabetic'
    ctx.textAlign = 'right'
    ctx.font = `12px ${getComputedStyle(document.body).getPropertyValue('--sans')}`
    ctx.fillText(`${leaves.size} of 1,000 leaves`, w - padX, h - 6)
    ctx.textAlign = 'left'
    ctx.fillText('10 · 100 · 1,000 calls', padX, h - 6)
  }

  const animate = (now) => {
    if (!started) started = now
    progress = Math.min(1, (now - started) / 900)
    draw()
    if (progress < 1) requestAnimationFrame(animate)
  }

  onResize(cv, draw)
  onTheme(draw)
  if (progress < 1) setTimeout(() => requestAnimationFrame(animate), 120)
  else draw()
}

export function initHero() {
  odometers()
  tree()
}
