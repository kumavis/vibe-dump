// Chapters 9–10: the Galois orbit of the Verlinde categories, the map of what
// depends on a pivotal structure, and the status ledger.

import { Sheet, INK, onResize, $, buttonRow, num } from './viz.js'

/* ───────────────────────────── 9. Galois conjugates of SU(2)_k */

const gcd = (a, b) => (b ? gcd(b, a % b) : a)

/**
 * The Verlinde category of SU(2) at level k has k+1 simple objects whose
 * dimensions are quantum integers [m] = sin(mπ/(k+2)) / sin(π/(k+2)). Replacing
 * the primitive root of unity by another one — index j, coprime to k+2 — is a
 * field automorphism applied to the whole category, and gives another fusion
 * category with the same fusion rules and different dimensions.
 *
 * j and (k+2)−j give dimensions differing only by signs, hence the same global
 * dimension, so only the first half of the range is listed.
 */
function conjugates(k) {
  const h = k + 2
  const out = []
  for (let j = 1; j * 2 <= h; j++) {
    if (gcd(j, h) !== 1) continue
    const dims = []
    for (let m = 1; m <= k + 1; m++) dims.push(Math.sin((m * j * Math.PI) / h) / Math.sin((j * Math.PI) / h))
    out.push({ j, dims, dim: dims.reduce((s, d) => s + d * d, 0) })
  }
  return out
}

export function initGalois() {
  const sheet = new Sheet($('#cv-galois'))
  const slider = $('#sl-level')
  const out = $('#out-level')
  const ro = $('#ro-galois')
  let picked = 0
  let bars = []

  function draw() {
    sheet.clear()
    const k = +slider.value
    const list = conjugates(k)
    if (picked >= list.length) picked = 0
    const fp = list[0].dim
    const padL = 54
    const padR = 20
    const padT = 34
    const padB = 46
    const bw = (sheet.w - padL - padR) / Math.max(1, list.length)
    const plotH = sheet.h - padT - padB
    const scale = (v) => padT + plotH - (v / (fp * 1.08)) * plotH

    // The FPdim line: the ceiling nothing can exceed (Proposition 8.21).
    const fy = scale(fp)
    sheet.stroke([[padL - 10, fy], [sheet.w - padR, fy]], { color: INK.verm, width: 1.4, dash: [6, 4], smooth: false })
    sheet.text(sheet.w - padR, fy - 10, `FPdim(C) = ${num(fp, 4)}`, {
      align: 'right', color: INK.verm, font: '10.5px ui-monospace, monospace', halo: INK.panel,
    })

    sheet.stroke([[padL - 10, padT], [padL - 10, padT + plotH]], { color: INK.rule, width: 1, smooth: false })
    sheet.stroke([[padL - 10, padT + plotH], [sheet.w - padR, padT + plotH]], { color: INK.rule, width: 1, smooth: false })
    sheet.text(padL - 16, padT + plotH, '0', { align: 'right', color: INK.faint, font: '9.5px ui-monospace, monospace' })

    bars = list.map((c, i) => {
      const x = padL + i * bw
      const w = Math.min(bw - 12, 66)
      const y = scale(c.dim)
      const isFP = i === 0
      const on = i === picked
      sheet.ctx.save()
      sheet.ctx.globalAlpha = on ? 0.9 : 0.55
      sheet.ctx.fillStyle = isFP ? INK.verm : INK.indigo
      sheet.ctx.fillRect(x, y, w, padT + plotH - y)
      sheet.ctx.restore()
      if (on) {
        sheet.ctx.save()
        sheet.ctx.strokeStyle = INK.ink
        sheet.ctx.lineWidth = 1.6
        sheet.ctx.strokeRect(x - 0.5, y - 0.5, w + 1, padT + plotH - y + 1)
        sheet.ctx.restore()
      }
      sheet.text(x + w / 2, y - 11, num(c.dim, 3), {
        align: 'center', color: isFP ? INK.verm : INK.indigo, font: '10.5px ui-monospace, monospace', halo: INK.panel,
      })
      sheet.text(x + w / 2, padT + plotH + 15, `q^${c.j}`, {
        align: 'center', color: INK.soft, font: '11px ui-monospace, monospace',
      })
      if (isFP) {
        sheet.text(x + w / 2, padT + plotH + 30, 'pseudo-unitary', {
          align: 'center', color: INK.verm, font: '9px ui-monospace, monospace',
        })
      }
      return { x, w, i }
    })

    sheet.text(14, 18, `SU(2) level ${k} · ${k + 1} simple objects · ${list.length} conjugate${list.length === 1 ? '' : 's'}`, {
      color: INK.faint, font: '10px ui-monospace, monospace',
    })
    sheet.text(14, padT - 6, 'dim(C)', { color: INK.indigo, font: '10px ui-monospace, monospace' })
  }

  function render() {
    out.textContent = slider.value
    draw()
    const k = +slider.value
    const list = conjugates(k)
    const c = list[Math.min(picked, list.length - 1)]
    const fp = list[0].dim
    const dims = c.dims.map((d, m) => `<span class="${d < 0 ? 'bad' : ''}">X${'₀₁₂₃₄₅₆₇₈₉'[m] || m}=${num(d, 4)}</span>`).join(' <span class="k">·</span> ')
    const pu = Math.abs(c.dim - fp) < 1e-9
    ro.innerHTML = `
      <div><b>q ↦ q<sup>${c.j}</sup></b> <span class="k">·</span> dim(C) <span class="k">=</span> <b>${num(c.dim, 6)}</b>
        <span class="k">vs FPdim(C) =</span> ${num(fp, 6)}
        <span class="${pu ? 'good' : 'bad'}">${pu ? '· pseudo-unitary — Proposition 8.23 applies' : `· ratio ${num(c.dim / fp, 4)} < 1 — Proposition 8.23 does not apply`}</span></div>
      <div style="margin-top:6px">${dims}</div>
      ${c.dims.some((d) => d < 0)
        ? '<div class="k" style="margin-top:6px">Some dimensions are negative. That is allowed: a pivotal structure assigns numbers, and nothing makes them positive unless the category is pseudo-unitary.</div>'
        : ''}
      <div class="k" style="margin-top:6px">Each listed conjugate is paired with a mirror one (q ↦ q<sup>${k + 2}−${c.j}</sup>)
        whose dimensions differ by signs and whose dim(C) is identical, so only half the orbit is drawn.
        Every one of these categories is modular, hence pivotal — the theorem simply does not see them.</div>`
  }

  slider.addEventListener('input', () => { picked = 0; render() })
  sheet.canvas.addEventListener('click', (e) => {
    const r = sheet.canvas.getBoundingClientRect()
    const mx = e.clientX - r.left
    const hit = bars.find((b) => mx >= b.x - 6 && mx <= b.x + b.w + 6)
    if (hit) { picked = hit.i; render() }
  })
  onResize(sheet, render)
}

/* ──────────────────────────────── 10. what depends on the bead */

const NODES = [
  { id: 'c', x: 0.5, y: 0.08, label: 'a fusion category C', kind: 'free' },
  { id: 'norm', x: 0.17, y: 0.33, label: '|X|², dim(C)', kind: 'free', note: 'squared norms need no choice — Theorem 2.3' },
  { id: 'fp', x: 0.17, y: 0.55, label: 'FPdim, rigidity results', kind: 'free', note: 'Perron–Frobenius, Ocneanu rigidity' },
  { id: 'piv', x: 0.63, y: 0.3, label: 'pivotal structure', kind: 'gate', note: 'Conjecture 2.8 — open' },
  { id: 'dim', x: 0.47, y: 0.52, label: 'dim(X), quantum trace', kind: 'needs' },
  { id: 'fs', x: 0.83, y: 0.5, label: 'Frobenius–Schur indicators', kind: 'needs' },
  { id: 'sph', x: 0.63, y: 0.68, label: 'spherical structure', kind: 'needs' },
  { id: 'tv', x: 0.3, y: 0.9, label: 'Turaev–Viro invariants', kind: 'needs' },
  { id: 'sn', x: 0.62, y: 0.9, label: 'string-net models', kind: 'needs' },
  { id: 'mod', x: 0.87, y: 0.74, label: 'modular data of Z(C)', kind: 'needs' },
]
const EDGES = [
  ['c', 'norm'], ['c', 'fp'], ['c', 'piv'],
  ['piv', 'dim'], ['piv', 'fs'], ['piv', 'sph'],
  ['sph', 'tv'], ['sph', 'sn'], ['sph', 'mod'],
]

export function initDeps() {
  const sheet = new Sheet($('#cv-deps'))
  const ro = $('#ro-deps')
  let assume = true
  let hover = null

  buttonRow($('#dp-toggle'), [
    { label: 'assume pivotal', v: true },
    { label: 'withhold it', v: false },
  ], (item) => { assume = item.v; render() })

  const place = () => {
    const padX = 56
    const padY = 26
    return Object.fromEntries(
      NODES.map((n) => [n.id, { ...n, px: padX + n.x * (sheet.w - padX * 2), py: padY + n.y * (sheet.h - padY * 2) }]),
    )
  }

  function draw() {
    sheet.clear()
    const P = place()
    for (const [a, b] of EDGES) {
      const live = assume || (NODES.find((n) => n.id === b).kind === 'free')
      sheet.stroke([[P[a].px, P[a].py + 11], [P[b].px, P[b].py - 11]], {
        color: live ? INK.soft : INK.faint,
        width: 1.3,
        alpha: live ? 0.75 : 0.22,
        dash: live ? null : [4, 4],
        smooth: false,
      })
    }
    for (const n of Object.values(P)) {
      const free = n.kind === 'free'
      const gate = n.kind === 'gate'
      const live = assume || free
      const color = gate ? INK.verm : free ? INK.teal : INK.indigo
      const w = sheet.measure(n.label, '11px ui-monospace, monospace') + 20
      sheet.ctx.save()
      sheet.ctx.globalAlpha = live ? 1 : 0.28
      sheet.ctx.fillStyle = INK.panel
      sheet.ctx.strokeStyle = color
      sheet.ctx.lineWidth = gate ? 2.2 : 1.5
      sheet.ctx.beginPath()
      sheet.ctx.rect(n.px - w / 2, n.py - 11, w, 22)
      sheet.ctx.fill()
      if (gate && !assume) sheet.ctx.setLineDash([5, 4])
      sheet.ctx.stroke()
      sheet.ctx.restore()
      sheet.text(n.px, n.py, n.label, {
        align: 'center',
        color,
        font: '11px ui-monospace, monospace',
      })
      if (hover === n.id && n.note) {
        sheet.text(n.px, n.py + 22, n.note, { align: 'center', color: INK.faint, font: '9.5px ui-monospace, monospace', halo: INK.panel })
      }
    }
  }

  function render() {
    draw()
    ro.innerHTML = assume
      ? `<span class="k">With a pivotal structure in hand, every box lights up: objects have dimensions, closed diagrams have values, and the state-sum constructions that build 3-manifold invariants and lattice models out of a fusion category go through.</span>`
      : `<span class="bad">Without it,</span> <span class="k">the green boxes survive — squared norms, the global dimension, Frobenius–Perron theory, Ocneanu rigidity — and everything else is conditional. This is why the conjecture is usually stated as a hypothesis rather than fought over: in practice people assume it, or work in the spherical double cover of chapter eight.</span>`
  }

  sheet.canvas.addEventListener('mousemove', (e) => {
    const r = sheet.canvas.getBoundingClientRect()
    const mx = e.clientX - r.left
    const my = e.clientY - r.top
    const P = place()
    const hit = Object.values(P).find((n) => Math.abs(n.px - mx) < 80 && Math.abs(n.py - my) < 14)
    const next = hit ? hit.id : null
    if (next !== hover) { hover = next; draw() }
  })
  sheet.canvas.addEventListener('mouseleave', () => { hover = null; draw() })

  onResize(sheet, render)
}

/* ─────────────────────────────────────────────────── the ledger */

const LEDGER = [
  {
    t: 'Pseudo-unitary categories — dim(C) = FPdim(C)',
    d: 'Proposition 8.23: a unique spherical structure, with all dimensions positive and equal to the Frobenius–Perron ones.',
    badge: 'proved', kind: 'yes',
  },
  {
    t: 'Weakly integral categories — FPdim(C) ∈ ℤ',
    d: 'Proposition 8.24 makes these pseudo-unitary, so the previous line applies. Covers all pointed categories, all Rep(G), Tambara–Yamagami, and everything with integer dimensions.',
    badge: 'proved', kind: 'yes',
  },
  {
    t: 'Rep(H) for H a semisimple Hopf algebra',
    d: 'By Larson–Radford the squared antipode is the identity, so the double dual functor is the identity outright and there is nothing to choose.',
    badge: 'proved', kind: 'yes',
  },
  {
    t: 'Rep(H) for H a semisimple quasi-Hopf algebra',
    d: 'Established in §8 of the same paper, via integrality.',
    badge: 'proved', kind: 'yes',
  },
  {
    t: 'Unitary categories from operator algebras',
    d: 'Unitarity forces dim(C) = FPdim(C), which is the pseudo-unitary case again. Fibonacci, the Verlinde categories and the Haagerup category all land here.',
    badge: 'proved', kind: 'yes',
  },
  {
    t: 'Braided fusion categories',
    d: 'Pivotal structures on a braided category correspond exactly to twists, via the Drinfeld isomorphism. Restating the question does not answer it.',
    badge: 'open', kind: 'open',
  },
  {
    t: 'Fusion categories in general, over ℂ',
    d: 'No proof, no counterexample. Every category that has ever been constructed explicitly turns out to be pivotal, which is evidence of a kind and not of a very strong kind.',
    badge: 'open', kind: 'open',
  },
  {
    t: 'What is always available instead',
    d: 'The pivotalisation C̃ of chapter eight: a spherical fusion category of twice the dimension, mapping onto C. Most applications can be run there.',
    badge: 'workaround', kind: 'note',
  },
]

export function renderLedger() {
  const host = $('#ledger')
  if (!host) return
  host.innerHTML = LEDGER.map(
    (r) => `<div class="lrow lrow--${r.kind}"><div><span class="t">${r.t}</span><span class="d">${r.d}</span></div><span class="badge">${r.badge}</span></div>`,
  ).join('')
}
