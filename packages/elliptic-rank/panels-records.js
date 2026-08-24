// Panels 8-10: ninety years of record curves, the leaderboard's size/rank
// frontier, curve #302 itself, and the exact check of its 31 witness points.

import { Plot, mixHex, groupDigits, elide } from './viz.js'
import { curve, q, Q, onCurve, digits } from './curve.js'
import { BOARD_SCATTER, BOARD_COUNT, byRank } from './leaderboard.js'

const $ = (sel, root = document) => root.querySelector(sel)
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)]

function live(canvas, draw) {
  let raf = 0
  const go = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw) }
  new ResizeObserver(go).observe(canvas)
  go()
  return go
}

/**
 * The record chain for the largest known rank of an elliptic curve over Q,
 * following Andrej Dujella's rank-record tables. Each row is the first
 * published curve to reach that lower bound; the ranks skipped in between were
 * never records, because each jump cleared several at once.
 */
export const RECORDS = [
  { r: 3, year: 1938, who: 'Billing' },
  { r: 4, year: 1945, who: 'Wiman' },
  { r: 6, year: 1974, who: 'Penney – Pomerance' },
  { r: 7, year: 1975, who: 'Penney – Pomerance' },
  { r: 8, year: 1977, who: 'Grunewald – Zimmert' },
  { r: 9, year: 1977, who: 'Brumer – Kramer' },
  { r: 12, year: 1982, who: 'Mestre' },
  { r: 14, year: 1986, who: 'Mestre' },
  { r: 15, year: 1992, who: 'Mestre' },
  { r: 17, year: 1992, who: 'Nagao' },
  { r: 19, year: 1992, who: 'Fermigier' },
  { r: 20, year: 1993, who: 'Nagao' },
  { r: 21, year: 1994, who: 'Nagao – Kouya' },
  { r: 22, year: 1997, who: 'Fermigier' },
  { r: 23, year: 1998, who: 'Martin – McMillen' },
  { r: 24, year: 2000, who: 'Martin – McMillen' },
  { r: 28, year: 2006, who: 'Elkies' },
  { r: 29, year: 2024, who: 'Elkies – Klagsbrun' },
  { r: 30, year: 2026, who: 'Alpöge – Howell', note: 'submitted as “ranksunbounded”' },
  { r: 31, year: 2026, who: 'Alpöge – Howell', note: 'curve #302 — the current record' },
]

// ═════════════════════════════════════════════ 8a. the record timeline

export function initTimeline() {
  const cv = $('#cv-timeline')
  if (!cv) return
  const plot = new Plot(cv, { pad: { l: 40, r: 20, t: 20, b: 30 } })
  const ro = $('#ro-timeline')
  let hover = null

  function draw() {
    plot.resize().setView(1930, 2032, 0, 34)
    plot.clear()
    plot.grid({ xCount: 6, yCount: 6 })
    plot.axes({ xCount: 6, yCount: 6, xLabel: 'year', yLabel: 'rank', fmt: (v) => String(Math.round(v)) })
    plot.clip()

    // The Park–Poonen–Voight–Wood line: their heuristic predicts only finitely
    // many curves over Q of rank above 21.
    plot.segment(1930, 21, 2032, 21, { color: 'rgba(167,139,250,0.55)', width: 1.3, dash: [6, 4] })
    plot.text(1934, 21, 'Park–Poonen–Voight–Wood: only finitely many curves above rank 21', {
      color: 'rgba(167,139,250,0.9)', dy: -8, font: '10px ui-monospace, monospace',
    })

    // Staircase through the records.
    const stair = []
    for (let i = 0; i < RECORDS.length; i++) {
      const a = RECORDS[i]
      const next = RECORDS[i + 1]
      stair.push([a.year, a.r])
      stair.push([next ? next.year : 2032, a.r])
    }
    plot.path(stair, { color: 'rgba(94,231,255,0.5)', width: 1.6 })

    for (const rec of RECORDS) {
      const t = (rec.r - 3) / 28
      const col = rec.year >= 2026 ? '#ffc766' : mixHex('#5ee7ff', '#ff7ba8', t)
      plot.dot(rec.year, rec.r, {
        r: rec === hover ? 7 : rec.year >= 2026 ? 5.5 : 4,
        fill: col, stroke: '#06070f', width: 1.8,
      })
    }
    // Label the endpoints of the story.
    plot.text(2026, 31, '31', { color: '#ffc766', dx: -18, dy: -10, font: 'bold 12px ui-monospace, monospace' })
    plot.text(2006, 28, 'Elkies, 28 — stood 18 years  ', {
      color: 'rgba(233,237,255,0.75)', align: 'right', dy: -10,
      font: '10px ui-monospace, monospace',
    })
    plot.unclip()

    const rec = hover || RECORDS[RECORDS.length - 1]
    ro.innerHTML =
      `<div><span class="k">rank ≥</span> <b class="hot">${rec.r}</b>` +
      `<span class="k"> · </span><b>${rec.year}</b>` +
      `<span class="k"> · </span><b>${rec.who}</b>` +
      (rec.note ? `<span class="k"> · ${rec.note}</span>` : '') + `</div>` +
      `<div class="k" style="margin-top:6px">hover the staircase · ranks 5, 10, 11, 13, 16, 18, 25–27 never held the record — each jump cleared several at once</div>`
  }

  cv.addEventListener('pointermove', (ev) => {
    const rect = cv.getBoundingClientRect()
    const px = ev.clientX - rect.left
    const py = ev.clientY - rect.top
    let best = null
    let bd = 24 * 24
    for (const rec of RECORDS) {
      const d = (plot.sx(rec.year) - px) ** 2 + (plot.sy(rec.r) - py) ** 2
      if (d < bd) { bd = d; best = rec }
    }
    if (best !== hover) { hover = best; draw() }
  })
  cv.addEventListener('pointerleave', () => { hover = null; draw() })

  live(cv, draw)
}

// ═════════════════════════════════════════════ 8b. the leaderboard frontier

const METRICS = {
  nh: { idx: 1, label: 'naive height  log max(|c₄|³, |c₆|²)' },
  fh: { idx: 2, label: 'Faltings height' },
  cond: { idx: 3, label: 'log conductor' },
}

export function initBoard() {
  const cv = $('#cv-board')
  if (!cv) return
  const plot = new Plot(cv, { pad: { l: 46, r: 18, t: 18, b: 30 } })
  const ro = $('#ro-board')
  let metric = 'nh'
  let hover = null

  function draw() {
    const m = METRICS[metric]
    const rows = BOARD_SCATTER.filter((s) => s[m.idx] !== null && s[m.idx] !== undefined)
    const ys = rows.map((s) => s[m.idx])
    const y0 = Math.min(...ys)
    // Scale to the frontier, not to the handful of deliberately huge curves
    // sitting far above it; those still draw, clipped to the top edge.
    const frontierMax = Math.max(...[...bestPerRank(rows, m.idx).values()])
    const y1 = Math.min(Math.max(...ys), frontierMax * 1.25 + 8)
    const padY = (y1 - y0) * 0.08
    plot.resize().setView(-0.6, 32.4, y0 - padY, y1 + padY)
    plot.clear()
    plot.grid({ xCount: 8, yCount: 5 })
    plot.clip()

    const frontier = [...bestPerRank(rows, m.idx).entries()].sort((a, b) => a[0] - b[0])
    plot.path(frontier, { color: 'rgba(255,199,102,0.45)', width: 1.6 })

    for (const s of rows) {
      const t = s[0] / 31
      plot.dot(s[0] + (hash(s) - 0.5) * 0.5, s[m.idx], {
        r: 2.6, fill: mixHex('#5ee7ff', '#ff7ba8', t), width: 0, alpha: 0.55,
      })
    }
    for (const [r, v] of frontier) {
      plot.dot(r, v, {
        r: r >= 30 ? 6 : 3.6,
        fill: r >= 30 ? '#ffc766' : mixHex('#5ee7ff', '#ff7ba8', r / 31),
        stroke: '#06070f', width: 1.6,
      })
    }
    plot.unclip()
    plot.axes({ xCount: 8, yCount: 5, xLabel: 'rank', yLabel: m.label, fmt: (v) => String(+v.toFixed(1)) })

    const row = hover ? byRank(hover) : byRank(31)
    if (row) {
      const condLen = row.cond ? String(row.cond).length : null
      ro.innerHTML =
        `<div><span class="k">best curve at rank</span> <b class="hot">${row.r}</b>` +
        `<span class="k"> · leaderboard #</span><b>${row.id}</b>` +
        `<span class="k"> · naive height</span> <b>${row.nh}</b>` +
        `<span class="k"> · Faltings</span> <b>${row.fh}</b>` +
        (condLen ? `<span class="k"> · conductor</span> <b>${condLen <= 10 ? row.cond : `${condLen} digits`}</b>` : '') +
        `</div>` +
        `<div style="margin-top:6px" class="k">${row.submitter ? `submitted by <b>${escapeHtml(row.submitter)}</b> — ` : ''}${escapeHtml(row.commentary || '').slice(0, 260) || 'no commentary'}</div>`
    }
  }

  cv.addEventListener('pointermove', (ev) => {
    const rect = cv.getBoundingClientRect()
    const r = Math.round(plot.wx(ev.clientX - rect.left))
    const v = r >= 1 && r <= 31 ? r : null
    if (v !== hover) { hover = v; draw() }
  })
  cv.addEventListener('pointerleave', () => { hover = null; draw() })

  $$('#board-metric button').forEach((btn) =>
    btn.addEventListener('click', () => {
      $$('#board-metric button').forEach((b) => b.classList.remove('on'))
      btn.classList.add('on')
      metric = btn.dataset.m
      draw()
    }),
  )

  live(cv, draw)
}

/** The smallest curve at each rank, under the chosen size measure. */
function bestPerRank(rows, idx) {
  const best = new Map()
  for (const s of rows) {
    const cur = best.get(s[0])
    if (cur === undefined || s[idx] < cur) best.set(s[0], s[idx])
  }
  return best
}

// Deterministic jitter so the scatter columns spread without flickering.
function hash(s) {
  let h = 2166136261
  const str = s.join(',')
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 1000) / 1000
}

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

// ═════════════════════════════════════════════ 9. curve #302

export const RECORD = byRank(31)

const parsePt = (p) => {
  const rd = (s) => {
    const [a, b] = String(s).split('/')
    return q(BigInt(a), b ? BigInt(b) : 1n)
  }
  return { x: rd(p[0]), y: rd(p[1]) }
}

export function renderRecordEquation() {
  const box = $('#eq-302')
  const stat = $('#stat-302')
  if (!box || !RECORD) return
  const [, , , a4, a6] = RECORD.ainvs.map(String)
  const a4d = a4.replace('-', '').length
  const a6d = a6.replace('-', '').length

  box.innerHTML =
    `<span class="head">y² + xy + y = x³ + x² − A·x + B</span>` +
    `<div><span class="lbl">A =</span> <span class="n4">${groupDigits(a4.replace('-', ''))}</span> <span class="dg">· ${a4d} digits</span></div>` +
    `<div style="margin-top:10px"><span class="lbl">B =</span> <span class="n6">${groupDigits(a6)}</span> <span class="dg">· ${a6d} digits</span></div>`

  const condLen = String(RECORD.cond).length
  stat.innerHTML = [
    ['rank', '≥ 31'],
    ['witness points', String(RECORD.points.length)],
    ['torsion', 'trivial'],
    ['naive height', RECORD.nh.toFixed(2)],
    ['Faltings height', RECORD.fh.toFixed(2)],
    ['conductor', `${condLen} digits`],
    ['bad primes', String(RECORD.badCount ?? '—')],
    ['submitted', '23 Aug 2026'],
  ]
    .map(([lab, val]) => `<div><span class="lab">${lab}</span><span class="val">${val}</span></div>`)
    .join('')
}

export function renderHeroEquation() {
  const el = $('#hero-eq')
  if (!el || !RECORD) return
  const [, , , a4, a6] = RECORD.ainvs.map(String)
  el.innerHTML =
    `y² + xy + y = x³ + x² − <b>${elide(a4.replace('-', ''), 16, 10)}</b>·x + <b>${elide(a6, 16, 10)}</b>` +
    `<br /><span style="opacity:.6">coefficients of ${a4.replace('-', '').length} and ${a6.replace('-', '').length} digits · 31 independent rational points</span>`
}

export function initVerifier() {
  const listEl = $('#verify-list')
  const tally = $('#verify-tally')
  if (!listEl || !RECORD) return
  const E = curve(RECORD.ainvs)
  const a1 = q(E.a1)
  const a2 = q(E.a2)
  const a3 = q(E.a3)
  const a4 = q(E.a4)
  const a6 = q(E.a6)
  let timer = 0
  let shown = 0
  let passed = 0
  let results = null
  let arithmeticMs = 0

  /** Substitute one witness point into both sides and compare them exactly. */
  function check(i) {
    const [xs, ys] = RECORD.points[i]
    const P = parsePt(RECORD.points[i])
    const lhs = Q.add(Q.add(Q.mul(P.y, P.y), Q.mul(Q.mul(a1, P.x), P.y)), Q.mul(a3, P.y))
    const x2 = Q.mul(P.x, P.x)
    const rhs = Q.add(
      Q.add(Q.mul(x2, P.x), Q.mul(a2, x2)),
      Q.add(Q.mul(a4, P.x), a6),
    )
    const ok = Q.eq(lhs, rhs) && onCurve(E, P)
    return { ok, xs, ys, sideDigits: digits(lhs.n), whole: lhs.d === 1n }
  }

  /** Check all 31 at once and time only the arithmetic, not the animation. */
  function checkAll() {
    const start = performance.now()
    const out = RECORD.points.map((_, i) => check(i))
    arithmeticMs = performance.now() - start
    return out
  }

  function render() {
    const rows = []
    for (let i = 0; i < shown; i++) {
      const r = results[i]
      rows.push(
        `<div class="vrow ${r.ok ? 'pass' : 'fail'}">` +
        `<span class="idx">P${i + 1}</span>` +
        `<span class="body">x = <span class="x">${escapeHtml(elide(r.xs, 22, 12))}</span> · ` +
        `y = <span class="y">${escapeHtml(elide(r.ys, 22, 12))}</span>` +
        `<span class="sides">y² + xy + y = x³ + x² + A·x + B &nbsp;→&nbsp; both sides come out identical, ${r.sideDigits} digits ${r.whole ? 'long' : 'in the numerator'}</span>` +
        `</span>` +
        `<span class="mark">${r.ok ? '✓' : '✗'}</span>` +
        `</div>`,
      )
    }
    listEl.innerHTML = rows.join('') || '<div class="vrow"><span class="idx"></span><span class="body">press the button — 31 exact big-integer identities, checked in your browser</span><span class="mark"></span></div>'
    listEl.scrollTop = listEl.scrollHeight
    const done = shown >= RECORD.points.length
    tally.innerHTML = shown
      ? `<b>${passed}</b> / ${shown} verified exactly` +
        (done ? ` · all 31 identities took ${arithmeticMs.toFixed(1)} ms of exact arithmetic` : '')
      : '31 points · nothing verified yet'
  }

  $('#verify-run').addEventListener('click', () => {
    if (timer) return
    shown = 0
    passed = 0
    results = checkAll()
    timer = setInterval(() => {
      if (shown >= RECORD.points.length) {
        clearInterval(timer)
        timer = 0
        return
      }
      if (results[shown].ok) passed++
      shown++
      render()
    }, 90)
  })
  $('#verify-reset').addEventListener('click', () => {
    clearInterval(timer)
    timer = 0
    shown = 0
    passed = 0
    render()
  })

  render()
}

// ═════════════════════════════════════════════ 10. the certification sandwich

/** Fill in the "N curves on the board" figures in the prose. */
export function renderBoardCount() {
  $$('[data-board-count]').forEach((el) => { el.textContent = String(BOARD_COUNT) })
}

export function renderSandwich() {
  const el = $('#sandwich')
  if (!el) return
  el.innerHTML = `
    <div class="band band--upper">
      <span class="tag">conditional</span>
      <span class="t">rank ≤ 31</span>
      <span class="d">Bober's method bounds the <em>analytic</em> rank — the order of vanishing of L(E, s) at s = 1 — assuming the Generalised Riemann Hypothesis for that L-function. Then the Birch and Swinnerton-Dyer conjecture is needed to turn an analytic-rank bound into a bound on the actual rank. Neither GRH nor BSD is a theorem.</span>
    </div>
    <div class="band band--mid">
      <span class="t">rank = 31</span>
      <span class="d">true if — and only as far as — GRH and BSD hold</span>
    </div>
    <div class="band band--lower">
      <span class="tag">unconditional</span>
      <span class="t">rank ≥ 31</span>
      <span class="d">31 explicit rational points, proved independent by exact 2-descent: quadratic characters at good primes build a matrix over 𝔽₂ whose rank is a certified lower bound. No floating point, no hypotheses. You checked the first half of this yourself, above.</span>
    </div>`
}
