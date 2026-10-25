// Minimal SVG charting: scales, nice ticks, axes. Every chart on the page is
// drawn with these, so ticks, gridlines and labels look the same everywhere.

import { svg } from './util.js'

export function linear([d0, d1], [r0, r1]) {
  const k = (r1 - r0) / (d1 - d0 || 1)
  const f = (x) => r0 + (x - d0) * k
  f.invert = (y) => d0 + (y - r0) / k
  f.domain = [d0, d1]
  f.range = [r0, r1]
  return f
}

// Round tick values covering [a, b], about `count` of them.
export function niceTicks(a, b, count = 5) {
  const span = b - a
  if (!(span > 0)) return [a]
  const raw = span / count
  const mag = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((s) => s * mag).find((s) => span / s <= count) ?? 10 * mag
  const out = []
  for (let v = Math.ceil(a / step) * step; v <= b + step * 1e-9; v += step) out.push(Math.round(v / step) * step)
  return out
}

// A responsive SVG with a fixed coordinate system; CSS scales it to the width.
export function frame(container, width, height) {
  container.querySelector('svg')?.remove()
  const root = svg('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img' })
  container.prepend(root)
  return root
}

export function gridY(g, ys, x0, x1, fmtTick, opts = {}) {
  const grid = svg('g', { class: 'grid' })
  const ticks = svg('g', { class: 'tick' })
  for (const [val, y] of ys) {
    grid.append(svg('line', { x1: x0, x2: x1, y1: y, y2: y, 'stroke-width': 1 }))
    ticks.append(svg('text', { x: x0 - 8, y: y + 4, 'text-anchor': 'end', text: fmtTick(val) }))
  }
  if (opts.under) g.prepend(grid)
  else g.append(grid)
  g.append(ticks)
}

export function axisX(g, xs, y, fmtTick, x0, x1) {
  const ax = svg('g', { class: 'axis' })
  ax.append(svg('line', { x1: x0, x2: x1, y1: y, y2: y, 'stroke-width': 1 }))
  const ticks = svg('g', { class: 'tick' })
  for (const [val, x] of xs) {
    ax.append(svg('line', { x1: x, x2: x, y1: y, y2: y + 4, 'stroke-width': 1 }))
    ticks.append(svg('text', { x, y: y + 18, 'text-anchor': 'middle', text: fmtTick(val) }))
  }
  g.append(ax, ticks)
}

// SVG text with a little mathematics: `^{…}` and `_{…}` (or a single
// character after ^ / _) become raised or lowered tspans, and a letter
// standing alone, like the n in n², is set in math italic. Longer runs of
// letters, like log, stay upright.
export function mtext(attrs, s) {
  const t = svg('text', attrs)
  const put = (str, shift, small) => {
    let i = 0
    let pending = shift
    const emit = (text, italic) => {
      if (!text) return
      const a = { text }
      if (pending) {
        a.dy = pending
        pending = 0
      }
      if (small) a['font-size'] = '0.72em'
      if (italic) {
        a['font-style'] = 'italic'
        a['font-family'] = 'var(--mathit)'
      }
      t.append(svg('tspan', a))
    }
    while (i < str.length) {
      const ch = str[i]
      if ((ch === '^' || ch === '_') && i + 1 < str.length) {
        let inner
        if (str[i + 1] === '{') {
          let depth = 0
          let j = i + 1
          for (; j < str.length; j++) {
            if (str[j] === '{') depth++
            else if (str[j] === '}' && --depth === 0) break
          }
          inner = str.slice(i + 2, j)
          i = j + 1
        } else {
          inner = str[i + 1]
          i += 2
        }
        const d = ch === '^' ? -6 : 4
        put(inner, d, true)
        // return to the baseline
        t.append(svg('tspan', { dy: -d, text: ' ' }))
        continue
      }
      if (/[A-Za-z]/.test(ch)) {
        let j = i
        while (j < str.length && /[A-Za-z]/.test(str[j])) j++
        const word = str.slice(i, j)
        emit(word, word.length === 1)
        i = j
        continue
      }
      let j = i
      while (j < str.length && !/[A-Za-z^_]/.test(str[j])) j++
      emit(str.slice(i, j), false)
      i = j
    }
  }
  put(s, 0, false)
  return t
}

// Horizontal bar with a 4px rounded data end and a square base.
export function barPath(x0, x1, y, h, r = 4) {
  const w = x1 - x0
  if (w <= 0) return ''
  const rr = Math.min(r, w, h / 2)
  return `M${x0},${y} H${x1 - rr} Q${x1},${y} ${x1},${y + rr} V${y + h - rr} Q${x1},${y + h} ${x1 - rr},${y + h} H${x0} Z`
}

// Vertical column growing up from a baseline.
export function colPath(x, w, y0, y1, r = 4) {
  const h = y0 - y1
  if (h <= 0) return ''
  const rr = Math.min(r, h, w / 2)
  return `M${x},${y0} V${y1 + rr} Q${x},${y1} ${x + rr},${y1} H${x + w - rr} Q${x + w},${y1} ${x + w},${y1 + rr} V${y0} Z`
}
