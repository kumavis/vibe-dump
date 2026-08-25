// Boot: chapter rail, hero animation, and every interactive panel.

import { initShape, initGroup, initRational, initTorsion, initLattice, renderMazur } from './panels-geometry.js'
import { initModP, initBSD } from './panels-arithmetic.js'
import {
  initTimeline, initBoard, initVerifier,
  renderRecordEquation, renderHeroEquation, renderSandwich, renderBoardCount,
} from './panels-records.js'

const $ = (s, r = document) => r.querySelector(s)
const $$ = (s, r = document) => [...r.querySelectorAll(s)]

// ───────────────────────────────────────────────────────── chapter rail

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

// ───────────────────────────────────────────────────────── hero field

/**
 * A drifting field of elliptic curves: each row walks (A, B) around a loop, so
 * curves split into two components and merge back as they cross Δ = 0.
 */
function heroField() {
  const cv = $('#hero-field')
  if (!cv) return
  const ctx = cv.getContext('2d')
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let w = 0
  let h = 0
  let dpr = 1

  const N = 26
  const seeds = Array.from({ length: N }, (_, i) => ({
    phase: (i / N) * Math.PI * 2,
    speed: 0.06 + (i % 5) * 0.012,
    radius: 2.4 + (i % 7) * 0.55,
    yOff: (i + 0.5) / N,
  }))

  function resize() {
    const r = cv.getBoundingClientRect()
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = Math.max(1, r.width)
    h = Math.max(1, r.height)
    cv.width = Math.round(w * dpr)
    cv.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function frame(t) {
    ctx.clearRect(0, 0, w, h)
    const time = reduced ? 8 : t / 1000
    const scale = Math.min(w, h) / 9.5
    for (let i = 0; i < N; i++) {
      const s = seeds[i]
      const a = s.phase + time * s.speed
      const A = Math.cos(a) * s.radius - 1.2
      const B = Math.sin(a * 1.31) * s.radius
      const cx = w * (0.5 + 0.42 * Math.cos(a * 0.37 + s.phase))
      const cy = h * s.yOff
      const depth = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(a * 0.6))
      ctx.save()
      ctx.translate(cx, cy)
      ctx.globalAlpha = 0.055 + 0.1 * depth
      ctx.lineWidth = 0.9 + depth * 0.7
      ctx.strokeStyle = i % 3 === 0 ? '#ffc766' : '#5ee7ff'
      // Trace y = ±sqrt(x^3 + Ax + B) either side of the axis.
      for (const sign of [1, -1]) {
        ctx.beginPath()
        let started = false
        for (let k = 0; k <= 260; k++) {
          const x = -3 + (k / 260) * 6.2
          const v = x * x * x + A * x + B
          if (v < 0) { started = false; continue }
          const y = sign * Math.sqrt(v)
          const px = x * scale
          const py = -y * scale
          if (Math.abs(py) > h) { started = false; continue }
          if (!started) { ctx.moveTo(px, py); started = true } else ctx.lineTo(px, py)
        }
        ctx.stroke()
      }
      ctx.restore()
    }
    if (!reduced) raf = requestAnimationFrame(frame)
  }

  let raf = 0
  new ResizeObserver(() => { resize(); if (reduced) frame(0) }).observe(cv)
  resize()
  raf = requestAnimationFrame(frame)

  // Stop burning frames when the hero scrolls out of view.
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        if (!raf && !reduced) raf = requestAnimationFrame(frame)
      } else if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }
  })
  io.observe(cv)
}

// ───────────────────────────────────────────────────────── boot

function boot() {
  buildRail()
  heroField()
  renderHeroEquation()
  renderMazur()
  renderRecordEquation()
  renderSandwich()
  renderBoardCount()

  // Heavy panels wait until their section is close to the viewport.
  const lazy = [
    ['#panel-shape', initShape],
    ['#panel-group', initGroup],
    ['#panel-rational', initRational],
    ['#panel-torsion', initTorsion],
    ['#panel-lattice', initLattice],
    ['#panel-modp', initModP],
    ['#panel-bsd', initBSD],
    ['#panel-timeline', initTimeline],
    ['#panel-board', initBoard],
    ['#panel-verify', initVerifier],
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
