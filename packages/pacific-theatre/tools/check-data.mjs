// The data check (DATA.md §10, ENGINEERING.md §12): a runner over the
// modules in tools/check/. It runs common.mjs's core() (every JSON file
// parses; every frozen id the files carry matches tools/check/ids.json, the
// boxes' footprints and placements recomputed), then imports every other
// tools/check/*.mjs present (packs, gazetteer, routes, fronts, kits, battle:
// one per owning workflow, each validating its own data before the merge) and
// calls its default export with the shared context. Exit 1 with the list of
// problems; the counts when clean.
//
//   node tools/check-data.mjs                 public/data/
//   node tools/check-data.mjs test-data       the fixtures (tools/fake-data.mjs)
//   node tools/check-data.mjs <dir> --only gazetteer,routes
//
// No dependencies beyond tools/lib/ and src/time.js. Replaces holo-i-ke-au's
// single 1,200-line tools/check-data.mjs (b480c27), whose helpers live on in
// tools/check/common.mjs.
import { existsSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createContext, core, report } from './check/common.mjs'

const pkg = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const onlyAt = args.indexOf('--only')
const only = onlyAt >= 0 ? new Set(args[onlyAt + 1].split(',')) : null
const dirArg = args.find((a, i) => !a.startsWith('--') && (onlyAt < 0 || i !== onlyAt + 1))
// (a directory given relative to where the command runs, or failing that to the package)
const dir = dirArg ? (existsSync(resolve(dirArg)) ? resolve(dirArg) : join(pkg, dirArg)) : join(pkg, 'public/data')

const ctx = createContext(dir)
core(ctx)
const checkDir = join(pkg, 'tools/check')
const modules = readdirSync(checkDir)
  .filter((f) => f.endsWith('.mjs') && f !== 'common.mjs')
  .sort()
for (const f of modules) {
  const name = f.replace(/\.mjs$/, '')
  if (only && !only.has(name)) continue
  ctx.module = name
  try {
    const mod = await import(pathToFileURL(join(checkDir, f)).href)
    const fn = mod.default || mod.check
    if (typeof fn !== 'function') {
      ctx.bad(`tools/check/${f}`, 'exports no check function (export default function check(ctx))')
      continue
    }
    await fn(ctx)
  } catch (e) {
    ctx.bad(`tools/check/${f}`, `threw: ${e.stack || e.message}`)
  }
}
ctx.module = 'core'
console.log(`check-data: core${modules.length ? ` + ${modules.map((f) => f.replace(/\.mjs$/, '')).join(', ')}` : ' (no modules in tools/check/ yet)'}`)
process.exitCode = report(ctx)
