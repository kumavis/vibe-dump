// The table workflow's check (ENGINEERING.md §§10–13): what the table's
// renderer and interface rely on in the data, beyond the vocabularies the
// content's checks hold (gazetteer, routes, fronts), so a dataset that would
// draw wrongly says so before the merge.
//
// - labels.json: every label has text, a [lon, lat] and a kind labels.js
//   styles and a rank 1–4; a `line` label lies on the equator or the 180th
//   meridian (the two lines the table draws and turns a label along), else it
//   is drawn level; no more than forty rank-1 labels (rank 1 is always shown,
//   and the theatre view holds about that many before they collide).
// - fronts: every land polygon's `state` has a colour on the table
//   (src/table/states.js), else it is drawn in the grey of "other".
// - places' `held`: each interval parses, ends after it starts, intervals
//   do not overlap, and a `cutOff` falls inside its interval (the islands'
//   marks are computed from these on every date).
// - the coast: strokes present (else the polygons' rings stand in, with a
//   false line along any split), polygons with a kind and an area.
// - boxes: each has a `credit` line (the Sources and credits panel and the
//   briefing's footer print it verbatim).
// - the Japanese face: every CJK character in the data is in the committed
//   Noto Sans JP subset (src/fonts/noto-sans-jp-subset.chars.txt, written by
//   tools/subset-font.mjs); a warning lists what is missing, which is the
//   integrator's cue to run the tool again.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseInstant } from '../../src/time.js'
import { STATES, LABEL_KINDS } from '../../src/table/states.js'

const pkg = join(dirname(fileURLToPath(import.meta.url)), '../..')
const CJK = /[　-ヿ㐀-䶿一-鿿豈-﫿＀-￯]/gu
const wrap = (lon) => ((((lon + 180) % 360) + 360) % 360) - 180

export default function check(ctx) {
  // --- labels ------------------------------------------------------------------
  const labels = ctx.list('table/labels.json', 'labels')
  let rank1 = 0
  labels.forEach((l, i) => {
    const at = `table/labels.json[${i}] ${l.text ?? ''}`
    if (!l.text) ctx.bad(at, 'no text')
    if (!Array.isArray(l.lonlat) || l.lonlat.length !== 2 || !l.lonlat.every(Number.isFinite)) ctx.bad(at, 'lonlat must be [lon, lat]')
    if (!LABEL_KINDS.includes(l.kind)) ctx.bad(at, `kind “${l.kind}” is not one labels.js styles (${LABEL_KINDS.join(', ')})`)
    if (![1, 2, 3, 4].includes(l.rank)) ctx.bad(at, `rank ${l.rank}: 1 to 4`)
    if (l.rank === 1) rank1++
    if (l.kind === 'line' && Array.isArray(l.lonlat)) {
      const [lon, lat] = l.lonlat
      if (Math.abs(lat) > 0.01 && Math.abs(Math.abs(wrap(lon)) - 180) > 0.01) ctx.warn(at, 'a line label off the equator and the 180th meridian is drawn level, not along its line')
    }
    if (l.ja !== undefined && l.ja !== null && typeof l.ja !== 'string') ctx.bad(at, 'ja must be a string')
  })
  if (rank1 > 40) ctx.warn('table/labels.json', `${rank1} rank-1 labels: rank 1 always shows, and the theatre view holds about forty before they collide`)
  ctx.count('table labels', labels.length)

  // --- the front's states --------------------------------------------------------
  const fm = ctx.load('fronts/manifest.json')
  for (const k of fm?.keyframes || []) {
    const fc = k.file ? ctx.load(k.file) : null
    for (const [i, f] of (fc?.features || []).entries()) {
      const p = f.properties || {}
      if (p.kind === 'perimeter') continue
      if (!STATES[p.state]) ctx.warn(`${k.file} feature ${i} ${p.name ?? ''}`, `state “${p.state}” has no colour on the table (src/table/states.js): drawn as “other”`)
    }
  }

  // --- the islands' holders --------------------------------------------------------
  let isles = 0
  for (const p of ctx.list('places.json', 'places')) {
    if (!Array.isArray(p.held) || !p.held.length) continue
    isles++
    const iv = []
    p.held.forEach((h, i) => {
      const at = `places.json ${p.id} held[${i}]`
      try {
        const a = parseInstant(h.from)
        const b = h.to ? parseInstant(h.to) : Infinity
        if (!(b > a)) ctx.bad(at, `ends (${h.to}) before it starts (${h.from})`)
        if (h.cutOff) {
          const c = parseInstant(h.cutOff)
          if (c < a || c > b) ctx.bad(at, `cutOff ${h.cutOff} outside ${h.from} – ${h.to ?? 'the end'}`)
        }
        iv.push([a, b, i])
      } catch (e) {
        ctx.bad(at, e.message)
      }
      if (!h.by) ctx.bad(at, 'no `by`')
    })
    iv.sort((x, y) => x[0] - y[0])
    for (let i = 1; i < iv.length; i++) if (iv[i][0] < iv[i - 1][1]) ctx.bad(`places.json ${p.id} held`, `intervals ${iv[i - 1][2]} and ${iv[i][2]} overlap`)
  }
  ctx.count('islands with holders', isles)

  // --- the coast ---------------------------------------------------------------------
  const coast = ctx.load('table/coast.json')
  if (coast) {
    if (!coast.strokes?.features?.length) ctx.warn('table/coast.json', 'no strokes: the polygons’ rings stand in, with a false line along any split at 180°')
    for (const [i, f] of (coast.features || []).entries()) {
      const p = f.properties || {}
      if (!['land', 'island', 'reef'].includes(p.kind)) ctx.bad(`table/coast.json feature ${i}`, `kind “${p.kind}”: land, island or reef`)
      if (!Number.isFinite(p.area)) ctx.warn(`table/coast.json feature ${i}`, 'no area: its strokes are sized by their span')
    }
  }

  // --- the boxes' credit lines ---------------------------------------------------------
  for (const b of ctx.list('boxes/manifest.json', 'boxes')) if (!b.credit) ctx.warn(`boxes/manifest.json ${b.id}`, 'no credit line: the credits panel and the briefing print it verbatim')

  // --- the Japanese face covers the data -------------------------------------------------
  const charsFile = join(pkg, 'src/fonts/noto-sans-jp-subset.chars.txt')
  if (existsSync(charsFile)) {
    const have = new Set(readFileSync(charsFile, 'utf8').match(CJK) || [])
    const need = new Set()
    const walk = (dir) => {
      for (const name of readdirSync(dir)) {
        const f = join(dir, name)
        if (statSync(f).isDirectory()) walk(f)
        else if (/\.(geo)?json$/.test(name)) for (const c of readFileSync(f, 'utf8').match(CJK) || []) need.add(c)
      }
    }
    walk(ctx.dir)
    const missing = [...need].filter((c) => !have.has(c))
    if (missing.length) ctx.warn('src/fonts/noto-sans-jp-subset.woff2', `${missing.length} CJK characters in the data are not in the subset (${missing.slice(0, 40).join('')}${missing.length > 40 ? '…' : ''}): run node tools/subset-font.mjs`)
    ctx.count('CJK characters in the data', need.size)
  } else ctx.warn('src/fonts/noto-sans-jp-subset.chars.txt', 'missing: run node tools/subset-font.mjs')
}
