// pixelfont.js — a 5×7 bitmap font and 7-segment digits, drawn as rectangles
// so LCDs and the cracktro scroller need no web font and no network.

const SRC = `
A .###. #...# #...# ##### #...# #...# #...#
B ####. #...# #...# ####. #...# #...# ####.
C .###. #...# #.... #.... #.... #...# .###.
D ####. #...# #...# #...# #...# #...# ####.
E ##### #.... #.... ####. #.... #.... #####
F ##### #.... #.... ####. #.... #.... #....
G .###. #...# #.... #.### #...# #...# .####
H #...# #...# #...# ##### #...# #...# #...#
I .###. ..#.. ..#.. ..#.. ..#.. ..#.. .###.
J ..### ...#. ...#. ...#. ...#. #..#. .##..
K #...# #..#. #.#.. ##... #.#.. #..#. #...#
L #.... #.... #.... #.... #.... #.... #####
M #...# ##.## #.#.# #.#.# #...# #...# #...#
N #...# #...# ##..# #.#.# #..## #...# #...#
O .###. #...# #...# #...# #...# #...# .###.
P ####. #...# #...# ####. #.... #.... #....
Q .###. #...# #...# #...# #.#.# #..#. .##.#
R ####. #...# #...# ####. #.#.. #..#. #...#
S .#### #.... #.... .###. ....# ....# ####.
T ##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..
U #...# #...# #...# #...# #...# #...# .###.
V #...# #...# #...# #...# #...# .#.#. ..#..
W #...# #...# #...# #.#.# #.#.# #.#.# .#.#.
X #...# #...# .#.#. ..#.. .#.#. #...# #...#
Y #...# #...# .#.#. ..#.. ..#.. ..#.. ..#..
Z ##### ....# ...#. ..#.. .#... #.... #####
0 .###. #...# #..## #.#.# ##..# #...# .###.
1 ..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.
2 .###. #...# ....# ...#. ..#.. .#... #####
3 ##### ...#. ..#.. ...#. ....# #...# .###.
4 ...#. ..##. .#.#. #..#. ##### ...#. ...#.
5 ##### #.... ####. ....# ....# #...# .###.
6 ..##. .#... #.... ####. #...# #...# .###.
7 ##### ....# ...#. ..#.. .#... .#... .#...
8 .###. #...# #...# .###. #...# #...# .###.
9 .###. #...# #...# .#### ....# ...#. .##..
. ..... ..... ..... ..... ..... .##.. .##..
, ..... ..... ..... ..... .##.. ..#.. .#...
: ..... .##.. .##.. ..... .##.. .##.. .....
! ..#.. ..#.. ..#.. ..#.. ..#.. ..... ..#..
? .###. #...# ....# ...#. ..#.. ..... ..#..
- ..... ..... ..... ##### ..... ..... .....
+ ..... ..#.. ..#.. ##### ..#.. ..#.. .....
/ ....# ....# ...#. ..#.. .#... #.... #....
' ..#.. ..#.. .#... ..... ..... ..... .....
" .#.#. .#.#. ..... ..... ..... ..... .....
( ...#. ..#.. .#... .#... .#... ..#.. ...#.
) .#... ..#.. ...#. ...#. ...#. ..#.. .#...
* ..... #.#.# .###. ##### .###. #.#.# .....
# .#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.
= ..... ..... ##### ..... ##### ..... .....
_ ..... ..... ..... ..... ..... ..... #####
< ...#. ..#.. .#... #.... .#... ..#.. ...#.
> .#... ..#.. ...#. ....# ...#. ..#.. .#...
[ .###. .#... .#... .#... .#... .#... .###.
] .###. ...#. ...#. ...#. ...#. ...#. .###.
& .##.. #..#. #.#.. .#... #.#.# #..#. .##.#
% ##... ##..# ...#. ..#.. .#... #..## ...##
~ ..... ..... .#... #.#.# ...#. ..... .....
| ..#.. ..#.. ..#.. ..#.. ..#.. ..#.. ..#..
@ .###. #...# #.### #.#.# #.##. #.... .###.
♥ ..... .#.#. ##### ##### .###. ..#.. .....
♪ ..##. ..#.# ..#.. ..#.. .##.. ###.. .#...
★ ..#.. ..#.. ##### .###. .#.#. #...# .....
▶ #.... ##... ###.. ####. ###.. ##... #....
◀ ....# ...## ..### .#### ..### ...## ....#
■ ..... ##### ##### ##### ##### ##### .....
↻ .###. #...# #.... #...# ##..# #...# .###.
`

export const GLYPHS = new Map()
for (const line of SRC.trim().split('\n')) {
  const [ch, ...rows] = line.split(' ')
  GLYPHS.set(ch, rows.map((r) => [...r].map((c) => c === '#')))
}
GLYPHS.set(' ', Array.from({ length: 7 }, () => Array(5).fill(false)))

export const textWidth = (str, px) => (str.length * 6 - 1) * px

// Draw text with each lit pixel as a px×px square (lcd shrinks the dots so
// the grid shows, like a backlit dot-matrix). glow adds a soft halo pass.
export function drawText(ctx, str, x, y, { px = 2, color = '#fff', glow = null, lcd = 0, perChar = null } = {}) {
  str = str.toUpperCase()
  const s = px - lcd
  const pass = (pad, fill) => {
    for (let c = 0; c < str.length; c++) {
      const g = GLYPHS.get(str[c]) || GLYPHS.get('?')
      let ox = x + c * 6 * px, oy = y
      if (perChar) {
        const o = perChar(c, str[c])
        ox += o.x ?? 0
        oy += o.y ?? 0
        if (o.color && !pad) ctx.fillStyle = o.color
      } else if (!pad) ctx.fillStyle = fill
      for (let r = 0; r < 7; r++) {
        const row = g[r]
        for (let k = 0; k < 5; k++) {
          if (row[k]) ctx.fillRect(ox + k * px - pad, oy + r * px - pad, s + pad * 2, s + pad * 2)
        }
      }
    }
  }
  if (glow) {
    ctx.save()
    ctx.globalAlpha *= 0.22
    ctx.fillStyle = glow
    pass(px * 0.6, glow)
    ctx.restore()
  }
  ctx.fillStyle = color
  pass(0, color)
}

// ---- 7-segment digits ------------------------------------------------------

//   a
// f   b
//   g
// e   c
//   d
const SEG = {
  0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd',
  6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg', '-': 'g', ' ': '',
}

function segPath(ctx, k, x, y, w, h, t) {
  const hh = h / 2
  const H = (sx, sy, len) => { // horizontal hexagon
    ctx.moveTo(sx, sy)
    ctx.lineTo(sx + t / 2, sy - t / 2)
    ctx.lineTo(sx + len - t / 2, sy - t / 2)
    ctx.lineTo(sx + len, sy)
    ctx.lineTo(sx + len - t / 2, sy + t / 2)
    ctx.lineTo(sx + t / 2, sy + t / 2)
    ctx.closePath()
  }
  const V = (sx, sy, len) => {
    ctx.moveTo(sx, sy)
    ctx.lineTo(sx + t / 2, sy + t / 2)
    ctx.lineTo(sx + t / 2, sy + len - t / 2)
    ctx.lineTo(sx, sy + len)
    ctx.lineTo(sx - t / 2, sy + len - t / 2)
    ctx.lineTo(sx - t / 2, sy + t / 2)
    ctx.closePath()
  }
  const g = 1 // gap
  switch (k) {
    case 'a': H(x + g, y, w - 2 * g); break
    case 'g': H(x + g, y + hh, w - 2 * g); break
    case 'd': H(x + g, y + h, w - 2 * g); break
    case 'f': V(x, y + g, hh - 2 * g); break
    case 'b': V(x + w, y + g, hh - 2 * g); break
    case 'e': V(x, y + hh + g, hh - 2 * g); break
    case 'c': V(x + w, y + hh + g, hh - 2 * g); break
  }
}

// Glowing readouts are cached per string: shadow blur is far too costly to
// redo every frame for text that changes once a second.
const segCache = new Map()

export function drawSeg(ctx, str, x, y, opts = {}) {
  if (!opts.glow) return drawSegRaw(ctx, String(str), x, y, opts)
  const sc = ctx.getTransform().a || 1
  const key = `${str}|${sc}|${opts.w}|${opts.h}|${opts.t}|${opts.gap}|${opts.on}|${opts.off}|${opts.glow}`
  const pad = 8
  let c = segCache.get(key)
  if (!c) {
    const { w = 11, h = 20, t = 3, gap = 6 } = opts
    let width = 0
    for (const ch of String(str)) width += ch === ':' ? t + gap : w + gap
    c = document.createElement('canvas')
    c.width = Math.ceil((width + pad * 2) * sc)
    c.height = Math.ceil((h + pad * 2) * sc)
    const cc = c.getContext('2d')
    cc.setTransform(sc, 0, 0, sc, pad * sc, pad * sc)
    drawSegRaw(cc, String(str), 0, 0, opts)
    if (segCache.size > 48) segCache.delete(segCache.keys().next().value)
    segCache.set(key, c)
  }
  ctx.drawImage(c, x - pad, y - pad, c.width / sc, c.height / sc)
}

function drawSegRaw(ctx, str, x, y, { w = 11, h = 20, t = 3, gap = 6, on = '#7dffb0', off = 'rgba(125,255,176,0.08)', glow = null } = {}) {
  let cx = x
  for (const ch of String(str)) {
    if (ch === ':') {
      ctx.fillStyle = on
      ctx.fillRect(cx + 1, y + h * 0.28, t, t)
      ctx.fillRect(cx + 1, y + h * 0.68, t, t)
      cx += t + gap
      continue
    }
    const lit = SEG[ch] ?? ''
    for (const k of 'abcdefg') {
      ctx.beginPath()
      segPath(ctx, k, cx, y, w, h, t)
      const isOn = lit.includes(k)
      if (isOn && glow) {
        ctx.save()
        ctx.shadowColor = glow
        ctx.shadowBlur = 6
        ctx.fillStyle = on
        ctx.fill()
        ctx.restore()
      } else {
        ctx.fillStyle = isOn ? on : off
        ctx.fill()
      }
    }
    cx += w + gap
  }
}
