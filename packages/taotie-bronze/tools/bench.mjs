#!/usr/bin/env node
// Relief-pipeline benchmark in the real browser: a 4096×2048 panel, ~20
// raise/sink calls (a taotie per half, bosses, borders, leiwen), then bake.
//   node tools/bench.mjs
import { session } from './lib.mjs'
const s = await session()
const { page, errors } = await s.open({ ui: '0', q: '0.25' })
await s.waitReady(page)
const r = await page.evaluate(() => {
  const kit = window.__taotie.kit
  const t0 = performance.now()
  const p = new kit.ReliefPanel({ width: 512, height: 256, ppmm: 8, seed: 3 })
  kit.drawMotif(p, 'taotie', { x: 16, y: 16, w: 480, h: 224 })
  kit.borderLine(p, { x: 6, y: 6, w: 500, h: 244 }, { sides: 'tblr' })
  for (let i = 0; i < 12; i++) kit.bossRow(p, [10 + i * 40, 4], [40 + i * 40, 4], { count: 2, radius: 2, height: 1.5 })
  const t1 = performance.now()
  const map = p.bake()
  map.channels()
  map.normalTexture
  map.dataTexture
  map.macro(1)
  const t2 = performance.now()
  return { px: `${p.cols}×${p.rows}`, ops: p.stats.ops, opsMs: Math.round(p.stats.ms), drawMs: Math.round(t1 - t0), bakeMs: Math.round(t2 - t1) }
})
console.log(r)
for (const e of errors) console.error('console: ' + e)
await s.close()
