// Chapters 1–3: the fusion-rule explorer, the zig-zag, and the duality map.

import { CATALOG, byId, decompose } from './catalog.js'
import { Sheet, INK, bezier, onResize, animate, $, buttonRow, num } from './viz.js'

/* ───────────────────────────────────────────── 1. the fusion explorer */

export function initExplorer() {
  const table = $('#ex-table')
  const ro = $('#ro-explorer')
  const sheet = new Sheet($('#cv-explorer'))
  let cat = byId('reps3')
  let generator = cat.labels.length - 1
  let hover = null

  buttonRow($('#ex-picks'), CATALOG.map((c) => ({ label: c.name, title: c.blurb, id: c.id })), (item) => {
    cat = byId(item.id)
    generator = cat.labels.length - 1
    hover = null
    render()
  }, CATALOG.findIndex((c) => c.id === 'reps3'))

    function renderTable() {
        const head = ['<tr><th>⊗</th>' + cat.labels.map((l, j) => `<th><button type="button" data-col="${j}">${l}</button></th>`).join('') + '</tr>']
    const rows = cat.labels.map((l, i) => {
      const cells = cat.labels.map((_, j) => {
        const cls = i === j ? 'diag' : i === generator || j === generator ? 'hl' : ''
        return `<td class="${cls}">${decompose(cat, i, j)}</td>`
      })
            return `<tr><th><button type="button" data-col="${i}">${l}</button></th>${cells.join('')}</tr>`
    })
        table.innerHTML = `<thead>${head.join('')}</thead><tbody>${rows.join('')}</tbody>`
        table.querySelectorAll('[data-col]').forEach((el) => {
      el.title = `multiply by ${cat.labels[+el.dataset.col]}`
      el.setAttribute('aria-pressed', String(+el.dataset.col === generator))
      el.addEventListener('click', () => { generator = +el.dataset.col; render() })
    })
  }

  function layout() {
    const n = cat.labels.length
    const cx = sheet.w / 2
    const cy = sheet.h / 2 + 4
    const R = Math.min(sheet.w, sheet.h) * 0.33
    return cat.labels.map((label, i) => {
      const a = -Math.PI / 2 + (i / n) * Math.PI * 2
      return {
        i,
        label,
        x: n === 1 ? cx : cx + Math.cos(a) * R,
        y: n === 1 ? cy : cy + Math.sin(a) * R,
        r: 7 + 11 * Math.sqrt(cat.dims[i] / Math.max(...cat.dims)),
      }
    })
  }

  function draw() {
    sheet.clear()
    const nodes = layout()
    const g = generator
    // An arc j → k for every simple X_k inside X_g ⊗ X_j.
    for (const from of nodes) {
      for (const to of nodes) {
        const m = cat.N[g][from.i][to.i]
        if (!m) continue
        const dim = hover != null && hover !== from.i && hover !== to.i
        if (from.i === to.i) {
          // A loop hanging off the node, pointing away from the centre.
          const ang = Math.atan2(from.y - sheet.h / 2, from.x - sheet.w / 2)
          const ux = Math.cos(ang)
          const uy = Math.sin(ang)
          const px = -uy
          const py = ux
          const a0 = [from.x + ux * from.r + px * 4, from.y + uy * from.r + py * 4]
          const a1 = [from.x + ux * from.r - px * 4, from.y + uy * from.r - py * 4]
          const reach = 30
          sheet.stroke(
            bezier(a0, [a0[0] + ux * reach + px * 22, a0[1] + uy * reach + py * 22],
                   [a1[0] + ux * reach - px * 22, a1[1] + uy * reach - py * 22], a1, 44),
            { color: INK.ochre, width: 1.2 + m * 0.7, alpha: dim ? 0.18 : 0.75 },
          )
          continue
        }
        const mx = (from.x + to.x) / 2
        const my = (from.y + to.y) / 2
        const bend = 0.22
        const px = mx + (from.y - to.y) * bend
        const py = my - (from.x - to.x) * bend
        const pts = bezier([from.x, from.y], [px, py], [px, py], [to.x, to.y], 36)
        sheet.stroke(pts, { color: INK.indigo, width: 1.1 + m * 0.8, alpha: dim ? 0.15 : 0.55 })
        const t = pts[Math.round(pts.length * 0.62)]
        const u = pts[Math.round(pts.length * 0.62) + 1] || t
        if (!dim) sheet.arrow(t[0], t[1], u[0] - t[0], u[1] - t[1], { color: INK.indigo, size: 5.5 })
      }
    }
    for (const nd of nodes) {
      const isGen = nd.i === g
      sheet.disc(nd.x, nd.y, nd.r, {
        fill: isGen ? INK.verm : INK.panel,
        stroke: isGen ? INK.verm : INK.ink,
        width: 1.8,
      })
      sheet.text(nd.x, nd.y - nd.r - 13, nd.label, {
        align: 'center',
        baseline: 'bottom',
        color: isGen ? INK.verm : INK.ink,
        font: '12px ui-monospace, monospace',
        halo: INK.panel,
      })
    }
    sheet.text(10, 14, `multiplying by ${cat.labels[g]}`, { color: INK.faint, font: '10px ui-monospace, monospace' })
  }

  sheet.canvas.addEventListener('mousemove', (e) => {
    const r = sheet.canvas.getBoundingClientRect()
    const mx = e.clientX - r.left
    const my = e.clientY - r.top
    const nodes = layout()
    const hit = nodes.find((nd) => Math.hypot(nd.x - mx, nd.y - my) < nd.r + 6)
    const next = hit ? hit.i : null
    if (next !== hover) { hover = next; draw() }
  })
  sheet.canvas.addEventListener('mouseleave', () => { hover = null; draw() })
  sheet.canvas.addEventListener('click', (e) => {
    const r = sheet.canvas.getBoundingClientRect()
    const nodes = layout()
    const hit = nodes.find((nd) => Math.hypot(nd.x - (e.clientX - r.left), nd.y - (e.clientY - r.top)) < nd.r + 6)
    if (hit) { generator = hit.i; render() }
  })

  function render() {
    renderTable()
    draw()
    const dims = cat.labels
      .map((l, i) => `<b>${l}</b> <span class="k">=</span> ${cat.fpNotes?.[l] ? `${cat.fpNotes[l]} ≈ ` : ''}${num(cat.dims[i], 5)}`)
      .join(' <span class="k">·</span> ')
    ro.innerHTML = `
      <div>${cat.blurb}</div>
      <div style="margin-top:8px">FPdim <span class="k">of each simple object:</span> ${dims}</div>
      <div style="margin-top:6px">FPdim(C) <span class="k">=</span> <b>${num(cat.fpdimC, 6)}</b>
        <span class="${cat.integral ? 'good' : 'bad'}">${cat.integral ? '· an integer' : '· not an integer'}</span>
        <span class="k">·</span> rank <b>${cat.labels.length}</b></div>
      <div class="k" style="margin-top:6px">${cat.globalNote}</div>`
  }

  onResize(sheet, render)
}

/* ───────────────────────────────────────────────────── 2. the zig-zag */

export function initZigzag() {
  const sheet = new Sheet($('#cv-zigzag'))
  const slider = $('#sl-slack')
  const out = $('#out-slack')
  const ro = $('#ro-zigzag')
  let side = 'left'
  let cancel = null

  const slack = () => +slider.value

  function draw() {
    sheet.clear()
        const s = slack()
    const flip = side === 'right' ? -1 : 1
    // Below this width the claim cannot sit beside the picture, so it goes
    // underneath and the picture gives up the bottom quarter of the canvas.
    const narrow = sheet.w < 420
    const cx = narrow ? sheet.w / 2 : sheet.w * 0.42
    const top = sheet.h * 0.07
    const bot = sheet.h * (narrow ? 0.66 : 0.9)
    const cy = (top + bot) / 2
    const spread = Math.min(sheet.w * (narrow ? 0.2 : 0.17), 92)
    const height = Math.min((bot - top) * 0.21, 74)

    const x0 = cx - flip * spread * s
    const x1 = cx
    const x2 = cx + flip * spread * s
    const y1 = cy + height * s
    const y2 = cy - height * s

    // One continuous wire: up the right leg, over the cap, down the middle,
    // under the cup, up the left leg.
    const wire = [
      [x2, bot],
      [x2, y2 + 24 * s],
      ...bezier([x2, y2 + 22 * s], [x2, y2 - 26 * s], [x1, y2 - 26 * s], [x1, y2 + 22 * s], 30),
      [x1, y1 - 22 * s],
      ...bezier([x1, y1 - 22 * s], [x1, y1 + 26 * s], [x0, y1 + 26 * s], [x0, y1 - 22 * s], 30),
      [x0, top],
    ]
    sheet.stroke(wire, { color: INK.ink, width: 2.6, smooth: false })

    // Orientation. The middle strand runs against the other two — that is the
    // dual object, and the reversal is the only thing a dual really is.
    const upArrow = (x, y) => sheet.arrow(x, y, 0, -1, { color: INK.teal, size: 7 })
    upArrow(x2, bot - (bot - y2) * 0.45)
    upArrow(x0, top + (y1 - top) * 0.55)
    if (s > 0.06) sheet.arrow(x1, (y1 + y2) / 2, 0, 1, { color: INK.verm, size: 7 })

    const lbl = (x, y, t, color, align = 'left') =>
      sheet.text(x, y, t, { color, align, font: '12px ui-monospace, monospace', halo: INK.panel })

    lbl(x2 + flip * 10, bot - 22, 'V', INK.teal, flip > 0 ? 'left' : 'right')
    lbl(x0 - flip * 10, top + 22, 'V', INK.teal, flip > 0 ? 'right' : 'left')
    if (s > 0.12) {
      lbl(x1 + flip * 11, (y1 + y2) / 2, side === 'left' ? 'V*' : '*V', INK.verm, flip > 0 ? 'left' : 'right')
      lbl((x1 + x2) / 2, y2 - 34 * s - 6, 'ev', INK.ink, 'center')
      lbl((x0 + x1) / 2, y1 + 34 * s + 8, 'coev', INK.ink, 'center')
    }

            // The claim, beside the picture, or beneath it on a narrow canvas.
    const ex = narrow ? sheet.w / 2 : sheet.w * 0.76
    const ey = narrow ? sheet.h - 78 : cy
    const half = Math.min(88, sheet.w / 2 - 12)
        sheet.text(ex, ey - 26, side === 'left' ? '(1 ⊗ ev) ∘ (coev ⊗ 1)' : '(ev ⊗ 1) ∘ (1 ⊗ coev)', {
      align: 'center', color: INK.soft, font: `${narrow ? 10.5 : 12}px ui-monospace, monospace`, halo: INK.panel,
    })
    sheet.text(ex, ey, '=', { align: 'center', color: INK.faint, font: '13px ui-monospace, monospace', halo: INK.panel })
            sheet.text(ex, ey + 22, 'id  on V', {
      align: 'center', color: INK.indigo, font: '13px ui-monospace, monospace',
    })
        sheet.stroke([[ex - half, ey + 42], [ex + half, ey + 42]], { color: INK.rule, width: 1, smooth: false })
    sheet.text(ex, ey + 58, s < 0.02 ? 'taut' : `slack ${(s * 100).toFixed(0)}%`, {
      align: 'center', color: s < 0.02 ? INK.teal : INK.soft, font: '11px ui-monospace, monospace', halo: INK.panel,
    })
  }

  function render() {
    out.textContent = slack().toFixed(2)
    draw()
    const s = slack()
    ro.innerHTML = s < 0.02
      ? `<span class="good">Taut.</span> <span class="k">The two bends cancelled: what is left is the bare identity wire on V. Whatever the cup and cap are, they satisfy this — that is the definition of a dual.</span>`
            : `<span class="k">Read it bottom to top, which is the order things happen in. First the cup, low down — that is coev, making a ${side === 'left' ? 'V and a V*' : 'V and a *V'} out of nothing. Then the cap above it — that is ev, eating the middle strand against the one that came in. Three strands in the picture, one wire in fact: follow it and you never lift the pen. Pull it taut and nothing is left but V.</span>`
  }

  slider.addEventListener('input', () => { if (cancel) cancel(); render() })
  $('#zz-pull').addEventListener('click', () => {
    if (cancel) cancel()
    const from = slack()
    cancel = animate(900, (t) => { slider.value = String(from * (1 - t)); render() })
  })
  $('#zz-reset').addEventListener('click', () => {
    if (cancel) cancel()
    const from = slack()
    cancel = animate(700, (t) => { slider.value = String(from + (1 - from) * t); render() })
  })
    buttonRow($('#zz-side'), [
    { label: 'right dual V*', v: 'left' },
    { label: 'left dual *V', v: 'right' },
  ], (item) => { side = item.v; render() })

  onResize(sheet, render)
}

/* ───────────────────────────────────────────────── 3. the duality map */

export function initDuality() {
  const sheet = new Sheet($('#cv-duality'))
  const ro = $('#ro-duality')
  let cat = byId('tyz3')

  buttonRow($('#du-picks'), CATALOG.map((c) => ({ label: c.name, id: c.id })), (item) => {
    cat = byId(item.id)
    render()
  }, CATALOG.findIndex((c) => c.id === 'tyz3'))

  function draw() {
    sheet.clear()
    const n = cat.labels.length
    const y = sheet.h * 0.66
    const m = Math.min(70, (sheet.w - 60) / Math.max(1, n))
    const x0 = sheet.w / 2 - ((n - 1) * m) / 2
    const pos = cat.labels.map((_, i) => x0 + i * m)

    cat.dual.forEach((d, i) => {
      if (d <= i) return
      const a = pos[i]
      const b = pos[d]
      const lift = 26 + Math.abs(d - i) * 16
      sheet.stroke(bezier([a, y - 14], [a, y - 14 - lift], [b, y - 14 - lift], [b, y - 14], 40), {
        color: INK.verm, width: 2,
      })
      sheet.text((a + b) / 2, y - 22 - lift, '*', { align: 'center', color: INK.verm, font: '15px ui-monospace, monospace' })
    })

    cat.labels.forEach((label, i) => {
      const selfDual = cat.dual[i] === i
      sheet.disc(pos[i], y, 11, { fill: selfDual ? 'rgba(24,104,92,0.13)' : INK.panel, stroke: selfDual ? INK.teal : INK.verm, width: 2 })
      sheet.text(pos[i], y, label, { align: 'center', color: INK.ink, font: '11px ui-monospace, monospace' })
      if (selfDual) {
        sheet.stroke(bezier([pos[i] - 8, y + 12], [pos[i] - 16, y + 34], [pos[i] + 16, y + 34], [pos[i] + 8, y + 12], 30), {
          color: INK.teal, width: 1.6,
        })
        sheet.text(pos[i], y + 40, 'X* = X', { align: 'center', color: INK.teal, font: '9.5px ui-monospace, monospace' })
      }
    })
    sheet.text(12, 16, 'arcs pair an object with its dual · ringed green means self-dual', {
      color: INK.faint, font: '10px ui-monospace, monospace',
    })
  }

  function render() {
    draw()
    const pairs = cat.labels
      .map((l, i) => (cat.dual[i] === i ? null : cat.dual[i] > i ? `${l}* = ${cat.labels[cat.dual[i]]}` : null))
      .filter(Boolean)
    const self = cat.labels.filter((_, i) => cat.dual[i] === i)
    ro.innerHTML = `
      <div><span class="k">self-dual:</span> <b>${self.join(', ') || 'none'}</b>
        ${pairs.length ? `<span class="k"> · swapped pairs:</span> <span class="bad">${pairs.join(', ')}</span>` : ''}</div>
      <div class="k" style="margin-top:6px">Applying * twice returns every object to itself — always, in every fusion category.
        That is Proposition 2.1, and it is the reason the conjecture is about coherence rather than about objects.</div>`
  }

  onResize(sheet, render)
}
