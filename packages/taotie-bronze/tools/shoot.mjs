#!/usr/bin/env node
// Render artifact × view × mode to PNGs you can actually look at, and put
// renders next to their reference photos.
//
//   npm run build --workspace @vibe-dump/taotie-bronze
//   node tools/shoot.mjs [--a id] [--view name,…] [--mode beauty,clay] [--patina preset,…]
//                        [--q 1] [--out dir] [--compare-all]
//                        [--atlas [--motif a,b] [--preset p,q]] [--ui [--phone]]
//
// Output: <out>/<id>/<view>-<mode>[-<patina>].png
//         <out>/<id>/compare-<view>.jpg     views with a `ref`: reference photo | render (the first
//                                           of beauty, clay, silhouette, … that was shot; labelled)
//         <out>/<id>/compare-sheet.jpg      --compare-all (one --a): every ref view's pair on one sheet
//         <out>/atlas/<motif>-<preset>-<mode>.png   --atlas (--preset filters the motif presets)
//         <out>/ui/*.png                    --ui: full chrome at 1400×1050 and 1280×800; --phone adds
//                                           390×844, 430×932 and 844×390 (touch, DPR 2) with the
//                                           label, vessel list, patina sheet and compare states
// <out> defaults to tools/shots/.
import { mkdirSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { args, session, PKG, HERE } from './lib.mjs'

const opt = args()
const OUT = opt.out || join(HERE, 'shots')
const modes = String(opt.mode || 'beauty,clay').split(',')
const q = String(opt.q || 1)
const list = (v) => (v && v !== true ? String(v).split(',').filter(Boolean) : null)
const s = await session()
let errorsSeen = 0
const rel = (f) => (f.startsWith(PKG) ? f.slice(PKG.length + 1) : f)

if (opt['compare-all'] && !opt.a) {
  console.error('--compare-all needs one artifact: --a <id>')
  process.exit(2)
}

async function shootArtifacts() {
  const { page, errors } = await s.open({ ui: '0', q, ...(opt.a ? { a: opt.a } : {}) })
  await s.waitReady(page)
  const ids = opt.a ? String(opt.a).split(',') : await page.evaluate(() => window.__taotie.artifacts.slice())
  const presets = list(opt.patina) || [null]
  for (const id of ids) {
    await page.evaluate((id) => window.__taotie.show(id), id)
    const art = await page.evaluate(async (id) => {
      const t = window.__taotie
      return { views: await t.views(id), refs: await t.viewRefs(id), metrics: t.metrics() }
    }, id)
    let views = list(opt.view) || art.views
    if (opt['compare-all']) views = views.filter((v) => art.refs[v])
    const dir = join(OUT, id)
    mkdirSync(dir, { recursive: true })
    console.log(`${id}: build ${art.metrics.buildMs} ms, ${art.metrics.overall.w}×${art.metrics.overall.h}×${art.metrics.overall.d} mm`)
    const pairs = []
    for (const preset of presets) {
      if (preset) await page.evaluate((p) => window.__taotie.setPatina(p), preset)
      const suffix = preset ? '-' + preset : ''
      for (const view of views) {
        await page.evaluate((v) => window.__taotie.setView(v), view)
        for (const mode of modes) {
          await page.evaluate((m) => window.__taotie.setMode(m), mode)
          const file = join(dir, `${view}-${mode}${suffix}.png`)
          await page.screenshot({ path: file })
          console.log('  ✓ ' + rel(file))
        }
        await page.evaluate(() => window.__taotie.setMode('beauty'))
        const c = compare(id, view, art.refs[view], dir, suffix)
        if (c) pairs.push(c)
      }
    }
    if (opt['compare-all']) contactSheet(id, dir, pairs)
  }
  errorsSeen += errors.length
  for (const e of errors) console.error('  console: ' + e)
  await page.close()
}

const MODE_PREF = ['beauty', 'clay', 'silhouette', 'height', 'mask']

/** compare-<view>.jpg: reference photo | render (whichever mode was shot, labelled), equal height. */
function compare(id, view, ref, dir, suffix = '') {
  if (!ref) return null
  const refPath = join(PKG, 'reference', id, ref)
  const mode = [...MODE_PREF.filter((m) => modes.includes(m)), ...modes].find((m) => existsSync(join(dir, `${view}-${m}${suffix}.png`)))
  if (!mode || !existsSync(refPath)) return null
  const render = join(dir, `${view}-${mode}${suffix}.png`)
  const out = join(dir, `compare-${view}${suffix}.jpg`)
  const H = 900
  const label = (file, text) => ['(', file, '-resize', `x${H}`, '-gravity', 'NorthWest', '-fill', '#e9e2d4', '-undercolor', '#0f0e0cc0', '-pointsize', '22', '-annotate', '+12+10', text, ')']
  execFileSync('convert', [...label(refPath, `reference · ${ref}`), ...label(render, `render · ${view} · ${mode}${suffix ? ' · ' + suffix.slice(1) : ''}`), '-background', '#0f0e0c', '+append', '-quality', '88', out])
  console.log('  ✓ ' + rel(out))
  return out
}

/** compare-sheet.jpg: every pair on one sheet, two columns, ImageMagick montage. */
function contactSheet(id, dir, pairs) {
  if (!pairs.length) {
    console.log(`  (no views with a reference photo for ${id})`)
    return
  }
  const out = join(dir, 'compare-sheet.jpg')
  execFileSync('montage', [
    ...pairs,
    '-tile', pairs.length > 1 ? '2x' : '1x',
    '-geometry', 'x520+6+6',
    '-background', '#0f0e0c',
    '-fill', '#b9ae9c',
    '-title', `${id} · reference | render · ${pairs.length} view${pairs.length > 1 ? 's' : ''}`,
    '-pointsize', '20',
    '-quality', '86',
    out,
  ])
  console.log('  ✓ ' + rel(out))
}

async function shootAtlas() {
  const dir = join(OUT, 'atlas')
  mkdirSync(dir, { recursive: true })
  const { page, errors } = await s.open({ ui: '0', q, tab: 'atlas' })
  await s.waitReady(page)
  const only = list(opt.motif)
  const onlyPresets = list(opt.preset)
  const motifs = (await page.evaluate(() => window.__taotie.motifs)).filter((m) => !only || only.includes(m))
  for (const m of motifs) {
    let presets = await page.evaluate((n) => window.__taotie.motifPresets(n), m)
    if (onlyPresets) presets = presets.filter((p) => onlyPresets.includes(p))
    else if (!presets.length) presets = [null]
    for (const p of presets) {
      await page.evaluate(([n, p]) => window.__taotie.showMotif(n, p), [m, p])
      for (const mode of modes) {
        await page.evaluate((x) => window.__taotie.setMode(x), mode)
        const file = join(dir, `${m}-${p || 'default'}-${mode}.png`)
        await page.screenshot({ path: file })
        console.log('  ✓ ' + rel(file))
      }
      await page.evaluate(() => window.__taotie.setMode('beauty'))
    }
  }
  errorsSeen += errors.length
  for (const e of errors) console.error('  console: ' + e)
  await page.close()
}

async function shootUI() {
  const dir = join(OUT, 'ui')
  mkdirSync(dir, { recursive: true })
  const sizes = [
    ['desktop', { width: 1400, height: 1050 }],
    ['laptop', { width: 1280, height: 800 }],
  ]
  if (opt.phone)
    sizes.push(
      ['phone', { width: 390, height: 844, dpr: 2, mobile: true }],
      ['phone-max', { width: 430, height: 932, dpr: 2, mobile: true }],
      ['phone-land', { width: 844, height: 390, dpr: 2, mobile: true }],
    )
  const only = list(opt.size)
  for (const [name, vp] of sizes) {
    if (only && !only.includes(name)) continue
    // ?q is left to the device default (a phone builds lighter) unless asked for
    const { page, errors } = await s.open({ ...(opt.q ? { q } : {}), ...(opt.a ? { a: opt.a } : {}) }, vp)
    await s.waitReady(page)
    const shot = async (state) => {
      await page.evaluate(() => {
        window.__taotie.stage.setAutoRotate(false)
        return window.__taotie.frame()
      })
      await page.waitForTimeout(350) // sheet transitions
      await page.evaluate(() => window.__taotie.frame())
      const file = join(dir, `${name}-${state}.png`)
      await page.screenshot({ path: file })
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      console.log(`  ✓ ${rel(file)}${overflow > 0 ? `   ✗ horizontal overflow ${overflow}px` : ''}`)
      if (overflow > 0) errorsSeen++
    }
    const click = async (sel) => {
      if (await page.isVisible(sel)) await page.click(sel)
    }
    await shot('vessels')
    const compact = await page.evaluate(() => window.__taotie.layout() !== 'desk')
    if (compact) {
      await click('#label .label-head')
      await shot('vessels-label')
      await click('#label .label-head')
      await click('#nav-open')
      await shot('vessels-list')
      await click('#nav-close')
      await click('#drawer-toggle')
      await shot('vessels-sheet')
      await click('#drawer-toggle')
    }
    // compare against the first view that has a photograph
    const ref = await page.evaluate(async () => {
      const t = window.__taotie
      const id = t.metrics()?.id
      const refs = id ? await t.viewRefs(id) : {}
      return Object.keys(refs)[0] || null
    })
    if (ref) {
      await page.evaluate((v) => window.__taotie.setView(v), ref)
      await page.evaluate(() => window.__taotie.setCompare(true))
      await page.waitForFunction(() => {
        const img = document.querySelector('#compare img')
        return img && img.complete && img.naturalWidth > 0
      }, null, { timeout: 30000 }).catch(() => console.error('  ✗ the reference photograph did not load'))
      await shot('vessels-compare')
      await page.evaluate(() => window.__taotie.setCompare(false))
    }
    await click('.tabs button[data-tab="atlas"]')
    await s.waitReady(page)
    await shot('atlas')
    errorsSeen += errors.length
    for (const e of errors) console.error('  console: ' + e)
    await page.close()
  }
}

try {
  if (!opt.atlas || opt.a) {
    if (!opt.ui || opt.view) await shootArtifacts()
  }
  if (opt.atlas) await shootAtlas()
  if (opt.ui) await shootUI()
} finally {
  await s.close()
}
process.exit(errorsSeen ? 1 : 0)
