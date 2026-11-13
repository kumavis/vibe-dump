#!/usr/bin/env node
// Render artifact × view × mode to PNGs you can actually look at, and put
// renders next to their reference photos.
//
//   npm run build --workspace @vibe-dump/taotie-bronze
//   node tools/shoot.mjs [--a id] [--view name] [--mode beauty,clay] [--patina preset]
//                        [--q 1] [--out dir] [--atlas] [--ui] [--phone]
//
// Output: tools/shots/<id>/<view>-<mode>[-<patina>].png
//         tools/shots/<id>/compare-<view>.jpg   (views with a `ref`, if reference/<id>/<ref> exists)
//         tools/shots/atlas/<motif>-<preset>.png   (--atlas)
//         tools/shots/ui/*.png                     (--ui: full chrome at 1400×1050, and 390×844 with --phone)
import { mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { args, session, PKG, HERE } from './lib.mjs'

const opt = args()
const OUT = opt.out || join(HERE, 'shots')
const modes = String(opt.mode || 'beauty,clay').split(',')
const q = String(opt.q || 1)
const s = await session()
let errorsSeen = 0

async function shootArtifacts() {
  const { page, errors } = await s.open({ ui: '0', q, ...(opt.a ? { a: opt.a } : {}) })
  await s.waitReady(page)
  const ids = opt.a ? [opt.a] : await page.evaluate(() => window.__taotie.artifacts)
  const presets = opt.patina ? String(opt.patina).split(',') : [null]
  for (const id of ids) {
    await page.evaluate((id) => window.__taotie.show(id), id)
    const art = await page.evaluate((id) => {
      const t = window.__taotie
      return { views: t.views(id), metrics: t.metrics() }
    }, id)
    const views = opt.view ? String(opt.view).split(',') : art.views
    const dir = join(OUT, id)
    mkdirSync(dir, { recursive: true })
    console.log(`${id}: build ${art.metrics.buildMs} ms, ${art.metrics.overall.w}×${art.metrics.overall.h}×${art.metrics.overall.d} mm`)
    for (const preset of presets) {
      if (preset) await page.evaluate((p) => window.__taotie.setPatina(p), preset)
      for (const view of views) {
        await page.evaluate((v) => window.__taotie.setView(v), view)
        for (const mode of modes) {
          await page.evaluate((m) => window.__taotie.setMode(m), mode)
          const file = join(dir, `${view}-${mode}${preset ? '-' + preset : ''}.png`)
          await page.screenshot({ path: file })
          console.log('  ✓ ' + file.slice(PKG.length + 1))
        }
        await page.evaluate(() => window.__taotie.setMode('beauty'))
        compare(id, view, dir)
      }
    }
  }
  errorsSeen += errors.length
  for (const e of errors) console.error('  console: ' + e)
  await page.close()
}

/** compare-<view>.jpg: reference photo | render, equal height, labelled. */
function compare(id, view, dir) {
  const refDir = join(PKG, 'reference', id)
  const artRefs = refsFor(id)
  const ref = artRefs?.[view]
  if (!ref) return
  const refPath = join(refDir, ref)
  const render = join(dir, `${view}-beauty.png`)
  if (!existsSync(refPath) || !existsSync(render)) return
  const out = join(dir, `compare-${view}.jpg`)
  const H = 900
  const label = (file, text) => ['(', file, '-resize', `x${H}`, '-gravity', 'NorthWest', '-fill', '#e9e2d4', '-undercolor', '#0f0e0cc0', '-pointsize', '22', '-annotate', '+12+10', text, ')']
  execFileSync('convert', [...label(refPath, `reference · ${ref}`), ...label(render, `render · ${view}`), '-background', '#0f0e0c', '+append', '-quality', '88', out])
  console.log('  ✓ ' + out.slice(PKG.length + 1))
}

// each view's `ref` (reference photo file name), read from the artifact registry
const refCache = {}
function refsFor(id) {
  return refCache[id]
}

async function loadRefs() {
  const { page } = await s.open({ ui: '0', q: '0.25' })
  await page.waitForFunction(() => window.__taotie)
  const all = await page.evaluate(async () => {
    const out = {}
    for (const id of window.__taotie.artifacts) out[id] = window.__taotie.viewRefs(id)
    return out
  })
  Object.assign(refCache, all)
  await page.close()
}

async function shootAtlas() {
  const dir = join(OUT, 'atlas')
  mkdirSync(dir, { recursive: true })
  const { page, errors } = await s.open({ ui: '0', q, tab: 'atlas' })
  await s.waitReady(page)
  const motifs = await page.evaluate(() => window.__taotie.motifs)
  for (const m of motifs) {
    const presets = await page.evaluate((n) => window.__taotie.motifPresets(n), m)
    for (const p of presets.length ? presets : [null]) {
      await page.evaluate(([n, p]) => window.__taotie.showMotif(n, p), [m, p])
      for (const mode of modes) {
        await page.evaluate((x) => window.__taotie.setMode(x), mode)
        const file = join(dir, `${m}-${p || 'default'}-${mode}.png`)
        await page.screenshot({ path: file })
        console.log('  ✓ ' + file.slice(PKG.length + 1))
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
  const sizes = [['desktop', { width: 1400, height: 1050 }]]
  if (opt.phone) sizes.push(['phone', { width: 390, height: 844, dpr: 2 }])
  for (const [name, vp] of sizes) {
    for (const tab of ['vessels', 'atlas']) {
      const { page, errors } = await s.open({ q, tab, ...(opt.a ? { a: opt.a } : {}) }, vp)
      await s.waitReady(page)
      await page.evaluate(() => {
        window.__taotie.stage.setAutoRotate(false)
        return window.__taotie.frame()
      })
      await page.screenshot({ path: join(dir, `${name}-${tab}.png`) })
      console.log(`  ✓ ui/${name}-${tab}.png`)
      if (name === 'phone' && tab === 'vessels') {
        await page.click('#drawer-toggle')
        await page.waitForTimeout(500)
        await page.evaluate(() => window.__taotie.frame())
        await page.screenshot({ path: join(dir, `${name}-${tab}-sheet.png`) })
        console.log(`  ✓ ui/${name}-${tab}-sheet.png`)
      }
      errorsSeen += errors.length
      for (const e of errors) console.error('  console: ' + e)
      await page.close()
    }
  }
}

try {
  if (!opt.atlas || opt.a) {
    await loadRefs()
    await shootArtifacts()
  }
  if (opt.atlas) await shootAtlas()
  if (opt.ui) await shootUI()
} finally {
  await s.close()
}
process.exit(errorsSeen ? 1 : 0)
