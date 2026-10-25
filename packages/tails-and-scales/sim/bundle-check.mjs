// The single-player page holds no Automerge (DESIGN §2.7's lazy loading,
// N2): online play's code and its wasm are fetched only for Play online or
// a `#m=` link. On a build (fresh, or --dist), this checks
//
//   - the entry chunk (index.html's module script) names no Automerge
//     module and holds none of its code;
//   - index.html preloads nothing but the entry (no modulepreload of the
//     online chunks, which would fetch them for every page);
//   - the online chunks and the wasm (Automerge's, served as a file of its
//     own) are in the build, reached from the entry by import() alone;
//
// and reports the sizes (gzipped): the entry's, the online chunks', the
// wasm's.
//
//   node sim/bundle-check.mjs [--dist <dir>]
import { parseArgs } from 'node:util'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { readFileSync, readdirSync, rmSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { fileURLToPath } from 'node:url'
import { buildApp } from './lib.mjs'

const PKG = fileURLToPath(new URL('..', import.meta.url))
const { values: a } = parseArgs({ options: { dist: { type: 'string' } } })
const work = join(tmpdir(), `tails-and-scales-bundle-${process.pid}`)
let failed = 0
const check = (ok, what) => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`)
  if (!ok) failed++
}
const kb = (n) => `${(n / 1024).toFixed(1)} kB`
try {
  const dist = a.dist ?? (await buildApp(PKG, join(work, 'dist')))
  const html = readFileSync(join(dist, 'index.html'), 'utf8')
  const entryName = /<script type="module"[^>]*src="\.\/(assets\/[^"]+\.js)"/.exec(html)?.[1]
  check(!!entryName, `index.html loads one entry chunk (${entryName})`)
  const entry = readFileSync(join(dist, entryName), 'utf8')
  const assets = readdirSync(join(dist, 'assets'))
  const wasm = assets.filter((f) => f.endsWith('.wasm'))
  const chunks = assets.filter((f) => f.endsWith('.js') && `assets/${f}` !== entryName)
  check(!/automerge/i.test(entry), 'the entry chunk names no Automerge module and holds none of its code')
  check(!/modulepreload/.test(html) && !/rel="preload"/.test(html), 'index.html preloads nothing (no online chunk fetched for a game played alone)')
  check(wasm.length === 1 && /^automerge-/.test(wasm[0]), `Automerge's wasm is a file of its own (${wasm.join(', ')})`)
  const online = chunks.find((f) => /^online-/.test(f))
  check(!!online && entry.includes(online), `the online chunk is in the build, reached from the entry by import() alone (${online})`)
  const gz = (f) => gzipSync(readFileSync(join(dist, 'assets', f))).length
  const lazy = chunks.reduce((n, f) => n + gz(f), 0)
  console.log(`\n  entry ${kb(gz(entryName.slice(7)))} gz; online chunks ${kb(lazy)} gz (${chunks.length} files); wasm ${wasm.map((f) => `${kb(readFileSync(join(dist, 'assets', f)).length)} (${kb(gz(f))} gz)`).join(', ')}`)
} finally {
  rmSync(work, { recursive: true, force: true })
}
console.log(failed ? `\nbundle-check: ${failed} check(s) failed` : '\nbundle-check passed: a game played alone loads no Automerge; online play fetches it on demand')
process.exit(failed ? 1 : 0)
