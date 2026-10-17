// Origami flowers, seen from above: kite-shaped petals, each folded down its
// spine so one half catches the light and the other doesn't, with a smaller
// ring of petals tucked inside the first.

import { lighten, darken } from './wheel.js'

const DEG = Math.PI / 180
const pt = (r, a) => `${(r * Math.cos(a * DEG)).toFixed(2)},${(r * Math.sin(a * DEG)).toFixed(2)}`

/** One flower as SVG markup, centred on (0, 0) with radius `r`. */
export function flowerMarkup(color, { petals = 6, r = 40, turn = 0, inner = true } = {}) {
  const step = 360 / petals
  const ring = (radius, offset, light, dark, waist) => {
    let out = ''
    for (let i = 0; i < petals; i++) {
      const a = turn + offset + i * step
      const half = step * 0.5 * waist
      const tip = pt(radius, a)
      const l = pt(radius * 0.52, a - half)
      const rr = pt(radius * 0.52, a + half)
      out += `<polygon points="0,0 ${l} ${tip}" fill="${light}"/><polygon points="0,0 ${tip} ${rr}" fill="${dark}"/>`
      out += `<line x1="0" y1="0" x2="${tip.split(',')[0]}" y2="${tip.split(',')[1]}" class="fl-crease"/>`
    }
    return out
  }
  let svg = ring(r, 0, lighten(color, 0.18), darken(color, 0.04), 1.02)
  if (inner) svg += ring(r * 0.58, step / 2, lighten(color, 0.42), lighten(color, 0.12), 0.9)
  svg += `<circle r="${(r * 0.12).toFixed(2)}" fill="${darken(color, 0.2)}" opacity="0.55"/>`
  return svg
}

/** A leaf: a long diamond folded down the middle. */
function leafMarkup(color, len, turn) {
  const a = turn
  const tip = pt(len, a)
  const l = pt(len * 0.45, a - 16)
  const r = pt(len * 0.45, a + 16)
  return `<polygon points="0,0 ${l} ${tip}" fill="${lighten(color, 0.15)}"/><polygon points="0,0 ${tip} ${r}" fill="${darken(color, 0.05)}"/>`
}

// A small seeded random, so the garden is the same on every visit.
function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const GARDEN = ['#f07fa2', '#f8c64a', '#62a0e3', '#f59a54', '#a57ed8', '#5cbb78', '#4dbfae', '#e4574b']

/**
 * Scatter flowers around the rim of a page-sized SVG. Each sits in a nested
 * <svg> placed by percentage, so the flowers follow the page's shape without
 * being stretched by it.
 */
export function gardenMarkup() {
  const rand = rng(7)
  // Spots around the rim, in percent of the page; the middle stays clear for
  // the fortune teller.
  const spots = [
    [2, 24], [6, 50], [1, 76], [10, 95], [26, 98], [44, 99],
    [60, 97], [78, 99], [94, 92], [99, 72], [97, 46], [98, 20], [80, 2], [66, 1], [50, 2], [33, 4],
  ]
  let out = ''
  spots.forEach(([x, y], i) => {
    const color = GARDEN[i % GARDEN.length]
    const r = 26 + rand() * 30
    const petals = [5, 6, 8][Math.floor(rand() * 3)]
    const turn = rand() * 360
    const sway = (6 + rand() * 6).toFixed(1)
    const delay = (-rand() * 8).toFixed(1)
    const leaf = rand() < 0.6 ? leafMarkup('#6cae63', r * 1.25, turn + 140 + rand() * 60) : ''
    out +=
      `<g class="bloom"${y < 10 ? ' data-edge="top"' : ''}>` +
      `<svg x="${x}%" y="${y}%" overflow="visible"><g class="bloom-spin" style="animation-duration:${sway}s;animation-delay:${delay}s">` +
      leaf +
      flowerMarkup(color, { petals, r, turn }) +
      `</g></svg></g>`
  })
  return out
}
