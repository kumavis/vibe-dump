#!/usr/bin/env node
// Headless smoke test: every artifact and every Motif Atlas motif (and each
// motif preset) must build and reach data-ready without a console error.
//
//   npm run check --workspace @vibe-dump/taotie-bronze     (build + this)
//   node tools/smoke.mjs [--q 0.5]
import { args, session } from './lib.mjs'
import { generate } from './refs.mjs'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PKG } from './lib.mjs'

const opt = args()
const q = opt.q || '0.5'
const s = await session()
let failures = 0
const fail = (m) => {
  failures++
  console.error('  ✗ ' + m)
}

// the bundled reference photos must match the views' `ref` fields
if (readFileSync(join(PKG, 'src', 'app', 'refs.js'), 'utf8') !== generate()) fail('src/app/refs.js is stale — run `node tools/refs.mjs` and rebuild')

const { page, errors } = await s.open({ ui: '0', q })
try {
  await s.waitReady(page)
} catch (e) {
  fail('boot: ' + e.message)
}
const { artifacts, motifs } = await page.evaluate(() => ({ artifacts: window.__taotie.artifacts, motifs: window.__taotie.motifs }))
console.log(`${artifacts.length} artifact(s) · ${motifs.length} motif(s)`)

for (const id of artifacts) {
  const t0 = Date.now()
  try {
    await page.evaluate((id) => window.__taotie.show(id), id)
    const m = await page.evaluate(() => window.__taotie.metrics())
    if (!m || !(m.overall.h > 0)) fail(`${id}: empty bounding box`)
    for (const [k, b] of Object.entries(m?.parts || {})) if (!(b.w > 0 && b.h > 0 && b.d > 0)) fail(`${id}: part "${k}" has an empty bounding box`)
    for (const v of await page.evaluate((id) => window.__taotie.views(id), id)) await page.evaluate((v) => window.__taotie.setView(v), v)
    for (const mode of ['clay', 'height', 'silhouette', 'mask', 'beauty']) await page.evaluate((m) => window.__taotie.setMode(m), mode)
    console.log(`  ✓ ${id}  ${Date.now() - t0} ms  (build ${m?.buildMs} ms, h ${m?.overall.h} mm, parts: ${Object.keys(m?.parts || {}).join(', ')})`)
  } catch (e) {
    fail(`${id}: ${e.message}`)
  }
}

for (const name of motifs) {
  const presets = await page.evaluate((n) => window.__taotie.motifPresets(n), name)
  for (const preset of [null, ...presets]) {
    const t0 = Date.now()
    try {
      await page.evaluate(([n, p]) => window.__taotie.showMotif(n, p), [name, preset])
      const stats = await page.evaluate(() => window.__taotie.atlasStats())
      console.log(`  ✓ motif ${name}${preset ? ' / ' + preset : ''}  ${Date.now() - t0} ms  (${stats})`)
    } catch (e) {
      fail(`motif ${name}/${preset}: ${e.message}`)
    }
  }
}

// a fresh load straight into the atlas tab must also reach ready
const atlasLoad = await s.open({ ui: '0', q, tab: 'atlas' })
try {
  await s.waitReady(atlasLoad.page)
  console.log('  ✓ tab=atlas boot')
} catch (e) {
  fail('tab=atlas boot: ' + e.message)
}

// the plain-#fragment routes a query-stripping host passes through
const hashAtlas = await s.open({ ui: '0', q }, { hash: 'atlas' })
try {
  await s.waitReady(hashAtlas.page)
  const t = await hashAtlas.page.evaluate(() => document.body.dataset.tab)
  if (t !== 'atlas') fail('#atlas did not open the Motif Atlas')
  else console.log('  ✓ #atlas boot')
} catch (e) {
  fail('#atlas boot: ' + e.message)
}
const last = artifacts[artifacts.length - 1]
const hashVessel = await s.open({ ui: '0', q }, { hash: last })
try {
  await s.waitReady(hashVessel.page)
  const id = await hashVessel.page.evaluate(() => window.__taotie.metrics()?.id)
  if (id !== last) fail(`#${last} opened ${id}`)
  else console.log(`  ✓ #${last} boot`)
} catch (e) {
  fail(`#${last} boot: ` + e.message)
}

for (const e of [...errors, ...atlasLoad.errors, ...hashAtlas.errors, ...hashVessel.errors]) fail('console: ' + e)
await s.close()
console.log(failures ? `\n${failures} failure(s)` : '\nsmoke ok')
process.exit(failures ? 1 : 0)
