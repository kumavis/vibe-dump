// Boot: chapter rail, the drifting diagrams behind the hero, and each panel
// started as it comes into view.

import { initExplorer, initZigzag, initDuality } from './panels-basics.js'
import { initTrace, initCoherence, initGrading, initRibbon, initCover } from './panels-pivot.js'
import { initGalois, initDeps, renderLedger } from './panels-status.js'
import { INK, bezier } from './viz.js'

const $ = (s, r = document) => r.querySelector(s)
const $$ = (s, r = document) => [...r.querySelectorAll(s)]

/* ───────────────────────────────────────────────────── chapter rail */

function buildRail() {
  const ol = $('#rail ol')
  const chapters = $$('.chapter')
  const items = chapters.map((ch) => {
    const li = document.createElement('li')
    const a = document.createElement('a')
    a.href = `#${ch.id}`
    a.textContent = ch.dataset.chapter || ch.id
    li.appendChild(a)
    ol.appendChild(li)
    return { ch, a }
  })
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        items.forEach((it) => it.a.classList.toggle('on', it.ch === e.target))
      }
    },
    { rootMargin: '-45% 0px -45% 0px' },
  )
  chapters.forEach((ch) => io.observe(ch))
}

/* ───────────────────────────────────────────────────── hero field */

/**
 * Marginalia: closed loops, zig-zags and trivalent trees drifting across the
 * paper, the way a notebook page on this subject actually looks. Each doodle
 * breathes on its own slow cycle so nothing on screen ever quite repeats.
 */
function heroField() {
  const cv = $('#hero-field')
  if (!cv) return
  const ctx = cv.getContext('2d')
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let w = 0
  let h = 0

  const N = 16
  const kinds = ['loop', 'zigzag', 'tree', 'theta']
  const seeds = Array.from({ length: N }, (_, i) => ({
    kind: kinds[i % kinds.length],
    x: ((i * 37) % 100) / 100,
    y: ((i * 61) % 100) / 100,
    scale: 0.5 + ((i * 13) % 7) / 8,
    speed: 0.05 + ((i * 7) % 5) * 0.012,
    phase: (i / N) * Math.PI * 2,
    tilt: (((i * 29) % 21) - 10) / 40,
  }))

  function resize() {
    const r = cv.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = Math.max(1, r.width)
    h = Math.max(1, r.height)
    cv.width = Math.round(w * dpr)
    cv.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function pen(pts, alpha, color) {
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.strokeStyle = color
    ctx.lineWidth = 1.6
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(pts[0][0], pts[0][1])
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
    ctx.stroke()
    ctx.restore()
  }

  function doodle(s, t) {
    const breathe = 0.82 + 0.18 * Math.sin(t * s.speed * 2 + s.phase)
    const k = Math.min(w, h) * 0.085 * s.scale * breathe
    const cx = w * s.x + Math.sin(t * s.speed * 0.6 + s.phase) * 26
    const cy = h * s.y + Math.cos(t * s.speed * 0.45 + s.phase) * 18
    const alpha = 0.1 + 0.07 * Math.sin(t * s.speed + s.phase)
    const color = s.kind === 'zigzag' ? INK.verm : s.kind === 'theta' ? INK.teal : INK.indigo
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(s.tilt)
    if (s.kind === 'loop') {
      const pts = []
      for (let a = 0; a <= 64; a++) {
        const ang = (a / 64) * Math.PI * 2
        pts.push([Math.cos(ang) * k, Math.sin(ang) * k * 1.25])
      }
      pen(pts, alpha, color)
    } else if (s.kind === 'zigzag') {
      const d = k * 0.8
      pen(
        [
          [d, k * 1.6],
          [d, k * 0.4],
          ...bezier([d, k * 0.4], [d, -k * 0.5], [0, -k * 0.5], [0, k * 0.4], 20),
          [0, k * 0.1],
          ...bezier([0, k * 0.1], [0, k], [-d, k], [-d, k * 0.1], 20),
          [-d, -k * 1.6],
        ],
        alpha,
        color,
      )
    } else if (s.kind === 'tree') {
      pen([[0, k * 1.5], [0, 0]], alpha, color)
      pen([[0, 0], [-k * 0.9, -k * 1.4]], alpha, color)
      pen([[0, 0], [k * 0.9, -k * 1.4]], alpha, color)
      ctx.save()
      ctx.globalAlpha = alpha * 1.4
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(0, 0, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    } else {
      pen(bezier([0, -k * 1.3], [k * 1.5, -k * 0.6], [k * 1.5, k * 0.6], [0, k * 1.3], 32), alpha, color)
      pen(bezier([0, -k * 1.3], [-k * 1.5, -k * 0.6], [-k * 1.5, k * 0.6], [0, k * 1.3], 32), alpha, color)
      pen([[0, -k * 1.3], [0, k * 1.3]], alpha, color)
    }
    ctx.restore()
  }

  let raf = 0
  function frame(now) {
    ctx.clearRect(0, 0, w, h)
    const t = reduced ? 9 : now / 1000
    for (const s of seeds) doodle(s, t)
    if (!reduced) raf = requestAnimationFrame(frame)
  }

  new ResizeObserver(() => { resize(); if (reduced) frame(0) }).observe(cv)
  resize()
  raf = requestAnimationFrame(frame)

  // Stop drawing once the hero has scrolled away.
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { if (!raf && !reduced) raf = requestAnimationFrame(frame) }
      else if (raf) { cancelAnimationFrame(raf); raf = 0 }
    }
  })
  io.observe(cv)
}

/* ───────────────────────────────────────────────────────── boot */

function boot() {
  buildRail()
  heroField()
  renderLedger()

  const lazy = [
    ['#panel-explorer', initExplorer],
    ['#panel-zigzag', initZigzag],
    ['#panel-duality', initDuality],
    ['#panel-trace', initTrace],
    ['#panel-coherence', initCoherence],
    ['#panel-grading', initGrading],
    ['#panel-ribbon', initRibbon],
    ['#panel-cover', initCover],
    ['#panel-galois', initGalois],
    ['#panel-deps', initDeps],
  ]
  const started = new Set()
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        const hit = lazy.find(([sel]) => e.target.matches(sel))
        if (hit && !started.has(hit[0])) {
          started.add(hit[0])
          try {
            hit[1]()
          } catch (err) {
            console.error(`panel ${hit[0]} failed`, err)
          }
        }
        io.unobserve(e.target)
      }
    },
    { rootMargin: '300px 0px' },
  )
  for (const [sel] of lazy) {
    const el = $(sel)
    if (el) io.observe(el)
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
else boot()
