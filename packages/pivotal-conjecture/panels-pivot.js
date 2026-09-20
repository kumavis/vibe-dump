// Chapters 4–8: the trace, the coherence game, the grading, the fourth dual,
// and the pivotalisation.

import { CATALOG, byId } from './catalog.js'
import { Sheet, INK, bezier, onResize, animate, $, buttonRow, num, lerp } from './viz.js'

const GRADE_COLORS = [INK.indigo, INK.verm, INK.teal, INK.plum, INK.ochre]

/* ───────────────────────────────────────── 4. closing the loop */

// Dimensions here are the ones the canonical spherical structure assigns, which
// for these (pseudo-unitary) categories is the Frobenius–Perron dimension. The
// point of the panel is not the value but how it moves under rescaling.
const TRACE_OBJECTS = [
  { label: 'σ', home: 'Ising', d: Math.SQRT2, exact: '√2' },
  { label: 'ψ', home: 'Ising', d: 1, exact: '1' },
  { label: 'τ', home: 'Fibonacci', d: (1 + Math.sqrt(5)) / 2, exact: 'φ' },
  { label: 'V', home: 'Rep(S₃)', d: 2, exact: '2' },
  { label: 'm', home: 'TY(Z/3)', d: Math.sqrt(3), exact: '√3' },
]

export function initTrace() {
  const sheet = new Sheet($('#cv-trace'))
  const ro = $('#ro-trace')
  const slider = $('#sl-lambda')
  const out = $('#out-lambda')
  let mode = 'open'
  let obj = TRACE_OBJECTS[0]

  buttonRow($('#tr-mode'), [
    { label: 'no bead', v: 'open' },
    { label: 'insert a : X → X**', v: 'closed' },
  ], (item) => { mode = item.v; render() })

  buttonRow($('#tr-obj'), TRACE_OBJECTS.map((o) => ({ label: `${o.label} ∈ ${o.home}`, o })), (item) => {
    obj = item.o
    render()
  })

  const lam = () => {
    const v = +slider.value
    return Math.abs(v) < 0.08 ? (v < 0 ? -0.08 : 0.08) : v
  }

  function draw() {
    sheet.clear()
    const cx = sheet.w * 0.42
    const halfW = Math.min(sheet.w * 0.15, 86)
    const top = sheet.h * 0.2
    const bot = sheet.h * 0.8
    const xL = cx - halfW
    const xR = cx + halfW
    const closed = mode === 'closed'

    // The cup at the bottom: coev_X produces X on the left, X* on the right.
    sheet.stroke(bezier([xL, bot - 34], [xL, bot + 26], [xR, bot + 26], [xR, bot - 34], 44), {
      color: INK.ink, width: 2.6,
    })
    // Right leg, X*, running downward against the arrows.
    sheet.stroke([[xR, bot - 34], [xR, top + 34]], { color: INK.ink, width: 2.6, smooth: false })
    // Left leg, X, running upward.
    sheet.stroke([[xL, bot - 34], [xL, top + 34]], { color: INK.ink, width: 2.6, smooth: false })

    sheet.arrow(xL, (top + bot) / 2 + 28, 0, -1, { color: INK.teal, size: 7 })
    sheet.arrow(xR, (top + bot) / 2 - 28, 0, 1, { color: INK.verm, size: 7 })

    if (closed) {
      // The cap: ev_{X*} eats X** ⊗ X*, and the bead is what supplies the X**.
      sheet.stroke(bezier([xL, top + 34], [xL, top - 26], [xR, top - 26], [xR, top + 34], 44), {
        color: INK.ink, width: 2.6,
      })
      const by = lerp(bot - 34, top + 34, 0.52)
      sheet.box(xL, by, 30, 24, 'a', { color: INK.plum })
      sheet.text(xL - 20, by, `×${num(lam(), 2)}`, { align: 'right', color: INK.plum, font: '11px ui-monospace, monospace', halo: INK.panel })
      sheet.text(xL + 10, top + 52, 'X**', { color: INK.plum, font: '11.5px ui-monospace, monospace', halo: INK.panel })
      sheet.text(cx, top - 36, 'ev', { align: 'center', color: INK.ink, font: '12px ui-monospace, monospace' })
      sheet.text(cx, top - 54, 'the loop closes', { align: 'center', color: INK.teal, font: '11px ui-monospace, monospace' })
    } else {
      // Leave the cap broken, with the socket it cannot reach drawn dashed.
      sheet.stroke(bezier([xR, top + 34], [xR, top - 26], [cx + 16, top - 26], [cx + 12, top - 18], 30), {
        color: INK.ink, width: 2.6,
      })
      sheet.stroke(bezier([cx - 12, top - 18], [cx - 16, top - 26], [xL, top - 26], [xL, top + 34], 30), {
        color: INK.verm, width: 2, dash: [5, 5],
      })
      sheet.disc(cx, top - 18, 5.5, { fill: INK.verm, stroke: INK.panel, width: 2 })
      sheet.text(cx, top - 40, 'X ≠ X**', { align: 'center', color: INK.verm, font: '12px ui-monospace, monospace' })
      sheet.text(cx, top - 58, 'no evaluation accepts this leg', { align: 'center', color: INK.faint, font: '10px ui-monospace, monospace' })
    }

    sheet.text(xL - 12, bot - 60, 'X', { align: 'right', color: INK.teal, font: '12px ui-monospace, monospace', halo: INK.panel })
    sheet.text(xR + 12, bot - 60, 'X*', { color: INK.verm, font: '12px ui-monospace, monospace', halo: INK.panel })
    sheet.text(cx, bot + 40, 'coev', { align: 'center', color: INK.ink, font: '12px ui-monospace, monospace' })

    // Ledger at the right-hand edge.
    const lx = sheet.w * 0.78
    const d = obj.d
    const l = lam()
    const rows = closed
      ? [
          ['Tr(a)', `${num(l * d, 5)}`, INK.plum],
          ['Tr((a⁻¹)*)', `${num(d / l, 5)}`, INK.plum],
          ['|X|²', `${num(d * d, 5)}`, INK.teal],
        ]
      : [['Tr(a)', 'undefined', INK.verm], ['|X|²', `${num(d * d, 5)}`, INK.teal]]
    sheet.text(lx, top - 30, `X = ${obj.label}`, { align: 'center', color: INK.ink, font: '13px ui-monospace, monospace' })
    rows.forEach(([k, v, c], i) => {
      const y = top + 6 + i * 34
      sheet.text(lx - 6, y, k, { align: 'right', color: INK.faint, font: '10.5px ui-monospace, monospace' })
      sheet.text(lx + 6, y, v, { color: c, font: '13px ui-monospace, monospace' })
    })
    if (closed) {
      sheet.stroke([[lx - 74, top + 6 + 2 * 34 - 17], [lx + 82, top + 6 + 2 * 34 - 17]], { color: INK.rule, width: 1, smooth: false })
      sheet.text(lx + 6, top + 6 + 2 * 34 + 22, 'invariant', { color: INK.teal, font: '10px ui-monospace, monospace' })
    }
  }

  function render() {
    out.textContent = (+slider.value).toFixed(2)
    draw()
    const d = obj.d
    const l = lam()
    ro.innerHTML = mode === 'open'
      ? `<span class="bad">The loop is open.</span> <span class="k">The cup handed you an X on the left, and the only evaluation the object X* has expects an X** there. Nothing has gone wrong — there is simply no canonical way to join the ends.</span>`
      : `<span class="k">dim(X) := Tr(a) =</span> <b class="pl">${num(l * d, 6)}</b>
         <span class="k">· but a was only defined up to scale, so this number is a property of the choice, not of X.</span>
         <span class="k">The product</span> <b class="good">|X|² = ${num(d * d, 6)}</b>
         <span class="k">is fixed for every λ: the two factors scale by λ and 1/λ. At λ = 1 this is the canonical spherical choice, where dim(${obj.label}) = FPdim(${obj.label}) = ${obj.exact}.</span>`
  }

  slider.addEventListener('input', render)
  onResize(sheet, render)
}

/* ────────────────────────────────────── 5. the coherence game */

export function initCoherence() {
  const dialsHost = $('#co-dials')
  const consHost = $('#co-constraints')
  const ro = $('#ro-coherence')
  let cat = byId('ising')
  let theta = []
  let charIndex = 0

  buttonRow($('#co-picks'), CATALOG.map((c) => ({ label: c.name, id: c.id })), (item) => {
    cat = byId(item.id)
    reset()
  }, CATALOG.findIndex((c) => c.id === 'ising'))

  /** The distinct equations λ_i λ_j = λ_k coming from the fusion rules. */
  function constraints() {
    const out = []
    const seen = new Set()
    const n = cat.labels.length
    for (let i = 1; i < n; i++) {
      for (let j = i; j < n; j++) {
        for (let k = 0; k < n; k++) {
          if (!cat.N[i][j][k]) continue
          const key = `${i}.${j}.${k}`
          if (seen.has(key)) continue
          seen.add(key)
          out.push([i, j, k])
        }
      }
    }
    return out
  }

  const wrap = (v) => ((v % 1) + 1.5) % 1 - 0.5
  const ok = (i, j, k) => Math.abs(wrap(theta[i] + theta[j] - theta[k])) < 0.004

  function reset() {
    theta = cat.labels.map(() => 0)
    charIndex = 0
    build()
  }

  function build() {
    dialsHost.innerHTML = ''
    cat.labels.forEach((label, i) => {
      const wrapEl = document.createElement('label')
      wrapEl.className = 'dial' + (i === 0 ? ' locked' : '')
      wrapEl.innerHTML = `<span class="nm">λ(${label})</span>`
      const input = document.createElement('input')
      input.type = 'range'
      input.min = '0'
      input.max = '1'
      input.step = '0.005'
      input.value = String(theta[i])
      input.disabled = i === 0
      const val = document.createElement('span')
      val.className = 'val'
      input.addEventListener('input', () => { theta[i] = +input.value; render() })
      wrapEl.append(input, val)
      wrapEl._input = input
      wrapEl._val = val
      dialsHost.appendChild(wrapEl)
    })
    render()
  }

  function render() {
    ;[...dialsHost.children].forEach((el, i) => {
      el._input.value = String(theta[i])
      const t = theta[i]
      el._val.textContent = t < 0.002 || t > 0.998 ? '1' : `e^(2πi·${t.toFixed(3)})`
    })
    const cs = constraints()
    const good = cs.filter(([i, j, k]) => ok(i, j, k))
    consHost.innerHTML = cs
      .map(([i, j, k]) => {
        const pass = ok(i, j, k)
        return `<div class="crow ${pass ? 'ok' : 'no'}"><span>λ(${cat.labels[i]}) · λ(${cat.labels[j]}) = λ(${cat.labels[k]})</span><span class="mk">${pass ? '✓' : '✗'}</span></div>`
      })
      .join('')
    const solutions = cat.chars.length
    ro.innerHTML = `
      <div><b>${good.length}</b> <span class="k">of</span> <b>${cs.length}</b>
        <span class="k">equations hold</span>
        ${good.length === cs.length ? '<span class="good">· this is a tensor automorphism of the identity</span>' : '<span class="bad">· not coherent</span>'}</div>
      <div class="k" style="margin-top:6px">This category has <b>${solutions}</b> solution${solutions === 1 ? '' : 's'} in total,
        so it has exactly ${solutions} pivotal structure${solutions === 1 ? '' : 's'} — <i>if</i> it has one.
        ${solutions === 1 ? 'Here the only coherent rescaling is the trivial one, so a pivotal structure, once it exists, is unique.' : ''}</div>`
  }

  $('#co-solve').addEventListener('click', () => {
    // Snap to whichever character of U(C) the dials are currently nearest.
    let best = 0
    let bestD = Infinity
    cat.chars.forEach((chi, idx) => {
      const d = cat.labels.reduce((s, _, i) => s + Math.abs(wrap(theta[i] - chi[cat.grading.grade[i]])), 0)
      if (d < bestD) { bestD = d; best = idx }
    })
    charIndex = best
    apply(cat.chars[best])
  })
  $('#co-next').addEventListener('click', () => {
    charIndex = (charIndex + 1) % cat.chars.length
    apply(cat.chars[charIndex])
  })
  $('#co-scramble').addEventListener('click', () => {
    const target = cat.labels.map((_, i) => (i === 0 ? 0 : Math.round(Math.random() * 200) / 200))
    apply(target)
  })

  function apply(target) {
    const from = theta.slice()
    animate(450, (t) => {
      theta = from.map((v, i) => {
        const to = typeof target[i] === 'number' ? target[i] : target[cat.grading.grade[i]]
        return (v + wrap(to - v) * t + 1) % 1
      })
      render()
    })
  }

  reset()
}

/* ─────────────────────────────────────────── 6. universal grading */

export function initGrading() {
  const sheet = new Sheet($('#cv-grading'))
  const ro = $('#ro-grading')
  let cat = byId('ising')

  buttonRow($('#gr-picks'), CATALOG.map((c) => ({ label: c.name, id: c.id })), (item) => {
    cat = byId(item.id)
    render()
  }, CATALOG.findIndex((c) => c.id === 'ising'))

  function draw() {
    sheet.clear()
    const U = cat.grading
    const cols = U.size
    const colW = Math.min(150, (sheet.w - 150) / cols)
    const x0 = 28
    const topY = 46

    U.members.forEach((members, g) => {
      const cx = x0 + colW * g + colW / 2
      const color = GRADE_COLORS[g % GRADE_COLORS.length]
      sheet.stroke([[cx - colW / 2 + 8, topY - 22], [cx + colW / 2 - 8, topY - 22]], { color, width: 2, smooth: false })
      sheet.text(cx, topY - 34, g === 0 ? 'C_ad (identity)' : `component ${g}`, {
        align: 'center', color, font: '10px ui-monospace, monospace',
      })
      members.forEach((i, r) => {
        const y = topY + 6 + r * 30
        sheet.disc(cx - 34, y, 9, { fill: 'rgba(0,0,0,0)', stroke: color, width: 2 })
        sheet.text(cx - 34, y, String(r + 1), { align: 'center', color, font: '9px ui-monospace, monospace' })
        sheet.text(cx - 18, y, `${cat.labels[i]}`, { color: INK.ink, font: '12px ui-monospace, monospace' })
        sheet.text(cx - 18 + 26, y, `d=${num(cat.dims[i], 3)}`, { color: INK.faint, font: '9.5px ui-monospace, monospace' })
      })
    })

    // The group's multiplication table, drawn small at the right.
    const tx = x0 + colW * cols + 34
    if (tx + cols * 26 < sheet.w) {
      sheet.text(tx, topY - 34, `U(C) = ${cat.gradingName}`, { color: INK.ink, font: '11px ui-monospace, monospace' })
      for (let a = 0; a < cols; a++) {
        for (let b = 0; b < cols; b++) {
          const x = tx + b * 26
          const y = topY + a * 24
          sheet.ctx.save()
          sheet.ctx.strokeStyle = INK.rule
          sheet.ctx.lineWidth = 1
          sheet.ctx.strokeRect(x, y - 11, 25, 23)
          sheet.ctx.restore()
          const v = U.table[a][b]
          sheet.text(x + 12.5, y, String(v), {
            align: 'center',
            color: GRADE_COLORS[v % GRADE_COLORS.length],
            font: '11px ui-monospace, monospace',
          })
        }
      }
    }
  }

  function render() {
    draw()
    const n = cat.chars.length
    ro.innerHTML = `
      <div><span class="k">universal grading group</span> <b>U(C) = ${cat.gradingName}</b>
        <span class="k">· characters</span> <b>${n}</b></div>
      <div class="k" style="margin-top:6px">The adjoint subcategory C_ad — everything occurring in some X ⊗ X* —
        is the identity component, and the rest of the simple objects fall into ${cat.grading.size === 1 ? 'no further blocks' : `${cat.grading.size - 1} further block${cat.grading.size === 2 ? '' : 's'}`}.
        Any coherent rescaling λ must be constant on a block and multiply the way the blocks do, so
        <b>${n}</b> is exactly the number of pivotal structures this category has, conditional on having any.</div>`
  }

  onResize(sheet, render)
}

/* ──────────────────────────────────────── 7. the fourth dual */

export function initRibbon() {
  const sheet = new Sheet($('#cv-ribbon'))
  const slider = $('#sl-twist')
  const out = $('#out-twist')
  const ro = $('#ro-ribbon')
  let loop = 0 // how far through the belt trick, 0…1
  let cancel = null
  let shake = 0

  const turns = () => +slider.value

  function draw() {
    sheet.clear()
    const cx = sheet.w * 0.5 + shake
    const top = sheet.h * 0.12
    const bot = sheet.h * 0.88
    const halfW = 21
    const T = turns()
    const steps = 150

    const pts = []
    for (let s = 0; s <= steps; s++) {
      const t = s / steps
      const y = lerp(bot, top, t)
      // During the release the twist migrates into a loop that swings out and back.
      const bulge = loop > 0 ? Math.sin(Math.PI * loop) * Math.sin(Math.PI * t) * 96 : 0
      const th = T * (1 - loop) * Math.PI * 2 * t
      const w = halfW * Math.cos(th)
      pts.push({ x: cx + bulge, y, w, face: Math.cos(th) >= 0 })
    }
    for (let s = 0; s < steps; s++) {
      const a = pts[s]
      const b = pts[s + 1]
      sheet.fillPath(
        [[a.x - a.w, a.y], [a.x + a.w, a.y], [b.x + b.w, b.y], [b.x - b.w, b.y]],
        { color: a.face ? INK.indigo : INK.ochre, alpha: 0.55 },
      )
    }
    sheet.stroke(pts.map((p) => [p.x - p.w, p.y]), { color: INK.ink, width: 1.4, smooth: false })
    sheet.stroke(pts.map((p) => [p.x + p.w, p.y]), { color: INK.ink, width: 1.4, smooth: false })

    const eff = T * (1 - loop)
    const marks = [
      [0, 'Id', INK.teal],
      [1, '** — one full turn', INK.verm],
      [2, '**** — Theorem 2.6', INK.teal],
    ]
    marks.forEach(([v, label, color]) => {
      const on = Math.abs(eff - v) < 0.02
      sheet.text(sheet.w - 16, sheet.h * 0.2 + v * 34, `${v === 0 ? '0' : v === 1 ? '2π' : '4π'}  ${label}`, {
        align: 'right', color: on ? color : INK.faint, font: `${on ? 11.5 : 10.5}px ui-monospace, monospace`,
      })
    })
    sheet.text(16, sheet.h * 0.2, 'front', { color: INK.indigo, font: '10px ui-monospace, monospace' })
    sheet.text(16, sheet.h * 0.2 + 16, 'back', { color: INK.ochre, font: '10px ui-monospace, monospace' })
    sheet.text(cx, bot + 22, `${(eff * 2).toFixed(2)}π of twist`, {
      align: 'center', color: INK.soft, font: '11px ui-monospace, monospace',
    })
  }

  function render() {
    const T = turns()
    out.textContent = T === 0 ? '0' : `${(T * 2).toFixed(2)}π`
    draw()
    const eff = T * (1 - loop)
    ro.innerHTML = eff < 0.02
      ? `<span class="good">Flat.</span> <span class="k">A band with no twist is the identity functor. Where a full turn cannot be undone, two full turns can — which is the shape of Theorem 2.6, and the shape of the conjecture's difficulty: you want the square root of a trivialisation you already have.</span>`
      : Math.abs(eff - 1) < 0.03
        ? `<span class="bad">One full turn.</span> <span class="k">This is the double dual. You cannot untwist it by sliding the band around — and correspondingly, nobody can produce a coherent isomorphism Id → ** in general.</span>`
        : Math.abs(eff - 2) < 0.03
          ? `<span class="hot">Two full turns.</span> <span class="k">Now press release. The twist comes out, because 4π is trivial — the Dirac belt trick, and the picture behind Radford's fourth-power formula.</span>`
          : `<span class="k">${(eff * 2).toFixed(2)}π of twist in the band.</span>`
  }

  slider.addEventListener('input', () => { loop = 0; if (cancel) cancel(); render() })
  $('#rb-release').addEventListener('click', () => {
    if (Math.abs(turns() - 2) > 0.03) {
      // Not at 4π: refuse, visibly.
      if (cancel) cancel()
      cancel = animate(420, (t) => { shake = Math.sin(t * Math.PI * 6) * 7 * (1 - t); render() })
      ro.innerHTML = `<span class="bad">Stuck.</span> <span class="k">Only an even number of full turns comes out. Set the twist to 4π and try again.</span>`
      return
    }
    if (cancel) cancel()
    cancel = animate(2200, (t) => { loop = t; if (t >= 1) { slider.value = '0'; loop = 0 } render() })
  })
  $('#rb-reset').addEventListener('click', () => { if (cancel) cancel(); loop = 0; shake = 0; slider.value = '0'; render() })

  onResize(sheet, render)
}

/* ─────────────────────────────────── 8. the pivotalisation cover */

export function initCover() {
  const sheet = new Sheet($('#cv-cover'))
  const ro = $('#ro-cover')
  let cat = byId('fib')
  let chosen = []

  buttonRow($('#cv-picks'), CATALOG.map((c) => ({ label: c.name, id: c.id })), (item) => {
    cat = byId(item.id)
    chosen = cat.labels.map(() => 0)
    render()
  }, CATALOG.findIndex((c) => c.id === 'fib'))

  function layout() {
    const n = cat.labels.length
    const m = Math.min(92, (sheet.w - 70) / Math.max(1, n))
    const x0 = sheet.w / 2 - ((n - 1) * m) / 2
    return { xs: cat.labels.map((_, i) => x0 + i * m), yBot: sheet.h * 0.8, yTop: sheet.h * 0.26, gap: 24 }
  }

  function draw() {
    sheet.clear()
    const { xs, yBot, yTop, gap } = layout()
    sheet.text(12, yTop - 44, 'C̃  — every object carries its own bead', { color: INK.plum, font: '10.5px ui-monospace, monospace' })
    sheet.text(12, yBot + 34, 'C  — the category you started with', { color: INK.soft, font: '10.5px ui-monospace, monospace' })

    xs.forEach((x, i) => {
      for (const sgn of [0, 1]) {
        const y = yTop + sgn * gap * 2
        const picked = chosen[i] === sgn
        sheet.stroke([[x, y], [x, yBot - 12]], { color: INK.rule, width: 1, dash: [3, 4], smooth: false })
        sheet.disc(x, y, 9, {
          fill: picked ? INK.plum : INK.panel,
          stroke: picked ? INK.plum : INK.faint,
          width: 1.8,
        })
        sheet.text(x + 14, y, sgn === 0 ? `(${cat.labels[i]}, f)` : `(${cat.labels[i]}, −f)`, {
          color: picked ? INK.plum : INK.faint, font: '10px ui-monospace, monospace', halo: INK.panel,
        })
      }
      sheet.disc(x, yBot, 10, { fill: INK.panel, stroke: INK.ink, width: 2 })
      sheet.text(x, yBot + 20, cat.labels[i], { align: 'center', color: INK.ink, font: '11.5px ui-monospace, monospace' })
    })

    sheet.text(sheet.w - 14, yBot - 6, 'forget f', { align: 'right', color: INK.faint, font: '10px ui-monospace, monospace' })
  }

  function render() {
    if (chosen.length !== cat.labels.length) chosen = cat.labels.map(() => 0)
    draw()
    ro.innerHTML = `
      <div><span class="k">rank</span> ${cat.labels.length} <span class="k">→</span> <b>${cat.labels.length * 2}</b>
        <span class="k">· FPdim</span> ${num(cat.fpdimC, 5)} <span class="k">→</span> <b>${num(cat.fpdimC * 2, 5)}</b>
        <span class="k">· C̃ is spherical, always</span></div>
      <div class="k" style="margin-top:6px">Two lifts per simple object, differing by a sign, and the whole
        two-sheeted category is pivotal by construction. Choosing one lift per object is easy; choosing them so
        that the choice for X ⊗ Y is the product of the choices for X and Y is precisely the conjecture.</div>`
  }

  sheet.canvas.addEventListener('click', (e) => {
    const r = sheet.canvas.getBoundingClientRect()
    const mx = e.clientX - r.left
    const { xs } = layout()
    let best = -1
    let bd = 34
    xs.forEach((x, i) => { const d = Math.abs(x - mx); if (d < bd) { bd = d; best = i } })
    if (best >= 0) { chosen[best] = 1 - chosen[best]; render() }
  })

  onResize(sheet, render)
}
