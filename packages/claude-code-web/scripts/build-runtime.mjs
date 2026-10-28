#!/usr/bin/env node
// Assemble dist/runtime/ after `vite build` (package.json "build" runs both):
//
//   dist/runtime/node/**     src/runtime/node/** copied as-is (plain ESM, no bundler)
//   dist/runtime/bun/**      src/runtime/bun/**, when present (track C)
//   dist/runtime/jspm/**     the @jspm/core/nodelibs/browser files the shims actually
//                            import (static import closure; --all-jspm copies all
//                            73 files, including 3.6 MB of crypto-browserify)
//   dist/runtime/vendor.js   src/runtime/vendor-entry.js bundled by Vite lib mode
//                            (vite.vendor.config.js): one ESM file, built-ins
//                            rewritten to ./node/<name>.js
//   dist/runtime/boot.js     src/runtime/boot.js and src/runtime/boot/** (the Worker bootstrap)
//
// Usage: node scripts/build-runtime.mjs [--out <dir>] [--no-vendor] [--all-jspm]
// Also importable: `buildRuntime({ outDir, vendor })` (the unit tests use it).
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export const pkgDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const srcRuntime = join(pkgDir, 'src', 'runtime')

// npm workspaces hoist dependencies to the repo root; walk up to find them.
export function findJspmNodelibs(from = pkgDir) {
  for (let d = from; ; d = dirname(d)) {
    const candidate = join(d, 'node_modules', '@jspm', 'core', 'nodelibs', 'browser')
    if (existsSync(candidate)) return candidate
    if (dirname(d) === d) throw new Error('@jspm/core not found: run `npm install` at the repo root')
  }
}

async function copyDir(from, to) {
  await mkdir(dirname(to), { recursive: true })
  await cp(from, to, { recursive: true })
}

// Relative `.js` module specifiers a file imports: static import/export
// statements at the start of a line (which skips JSDoc `import('./x')` types),
// and literal dynamic import('./x.js').
function relativeImports(src) {
  const out = []
  const re = /^\s*(?:import|export)\b[^'";]*?['"](\.{1,2}\/[^'"]+\.js)['"]|\bimport\(\s*['"](\.{1,2}\/[^'"]+\.js)['"]\s*\)/gm
  for (const m of src.matchAll(re)) out.push(m[1] || m[2])
  return out
}

// The jspm files reachable from the runtime's own modules.
async function jspmClosure(outDir, jspmSrc) {
  const needed = new Set()
  const queue = []
  const visitFile = async (file) => {
    const src = await readFile(file, 'utf8')
    for (const spec of relativeImports(src)) {
      const target = resolve(dirname(file), spec)
      const fromJspm = relative(join(outDir, 'jspm'), target)
      if (fromJspm.startsWith('..') || needed.has(fromJspm)) continue
      needed.add(fromJspm)
      queue.push(join(jspmSrc, fromJspm))
    }
  }
  const roots = []
  const collect = async (dir) => {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const p = join(dir, e.name)
      if (e.isDirectory()) await collect(p)
      else if (e.name.endsWith('.js')) roots.push(p)
    }
  }
  for (const d of ['node', 'bun', 'boot']) if (existsSync(join(outDir, d))) await collect(join(outDir, d))
  if (existsSync(join(outDir, 'boot.js'))) roots.push(join(outDir, 'boot.js'))
  for (const f of roots) await visitFile(f)
  // jspm files import their siblings; resolve those against the jspm source tree
  // but record them relative to the output jspm/ directory.
  while (queue.length) {
    const file = queue.shift()
    const src = await readFile(file, 'utf8')
    for (const spec of relativeImports(src)) {
      const rel = relative(jspmSrc, resolve(dirname(file), spec))
      if (rel.startsWith('..') || needed.has(rel)) continue
      needed.add(rel)
      queue.push(join(jspmSrc, rel))
    }
  }
  return [...needed].sort()
}

async function copyJspm(outDir, all) {
  const jspmSrc = findJspmNodelibs()
  const dest = join(outDir, 'jspm')
  await mkdir(dest, { recursive: true })
  await cp(join(jspmSrc, '..', '..', 'LICENSE'), join(dest, 'LICENSE')).catch(() => {})
  if (all) { await copyDir(jspmSrc, dest); return countFiles(dest) }
  const files = await jspmClosure(outDir, jspmSrc)
  for (const rel of files) {
    if (!existsSync(join(jspmSrc, rel))) throw new Error(`runtime imports jspm/${rel}, which @jspm/core does not have`)
    await mkdir(dirname(join(dest, rel)), { recursive: true })
    await cp(join(jspmSrc, rel), join(dest, rel))
  }
  return files.length
}

async function countFiles(dir) {
  let n = 0
  for (const e of await readdir(dir, { withFileTypes: true })) {
    n += e.isDirectory() ? await countFiles(join(dir, e.name)) : 1
  }
  return n
}

// The npm packages Rollup pulled into vendor.js, from its module ids.
function bundledPackages(output) {
  const pkgs = new Map()
  for (const chunk of [].concat(output).flatMap((o) => o.output || [])) {
    for (const id of Object.keys(chunk.modules || {})) {
      const m = /^(.*[\\/]node_modules[\\/])((?:@[^\\/]+[\\/])?[^\\/]+)/.exec(id.replace(/^\0/, '').replace(/\?.*$/, ''))
      if (m) pkgs.set(m[2].replace(/\\/g, '/'), m[1] + m[2])
    }
  }
  return [...pkgs].sort(([a], [b]) => (a < b ? -1 : 1))
}

// vendor.js redistributes third-party code: ship each package's licence text.
async function writeLicenses(file, packages, header) {
  const parts = [header]
  for (const [name, dir] of packages) {
    let meta = {}
    try { meta = JSON.parse(await readFile(join(dir, 'package.json'), 'utf8')) } catch { /* keep going */ }
    const licenseFile = (await readdir(dir).catch(() => [])).find((f) => /^(licen[cs]e|copying)(\.|$)/i.test(f))
    const text = licenseFile ? (await readFile(join(dir, licenseFile), 'utf8')).trim() : `(no licence file shipped; package.json says: ${meta.license || 'unknown'})`
    parts.push(`${'='.repeat(78)}\n${name}@${meta.version || '?'} — ${meta.license || 'unknown'}\n${'='.repeat(78)}\n${text}\n`)
  }
  await writeFile(file, parts.join('\n'))
}

export async function buildVendor(outDir) {
  const { build, transformWithEsbuild } = await import('vite')
  const output = await build({
    configFile: join(pkgDir, 'vite.vendor.config.js'),
    build: { outDir },
  })
  const file = join(outDir, 'vendor.js')
  // Lib mode never strips whitespace from ES output; vendor.js is third-party
  // code that ships in the committed dist/, so minify it fully (esbuild keeps
  // export names). Licences go to vendor.licenses.txt next to it.
  const minified = await transformWithEsbuild(await readFile(file, 'utf8'), 'vendor.js', { minify: true, format: 'esm', target: 'es2022', legalComments: 'inline' })
  await writeFile(file, `/* Bundled npm packages; licences: ./vendor.licenses.txt */\n${minified.code}`)
  await writeLicenses(join(outDir, 'vendor.licenses.txt'), bundledPackages(output), 'Third-party packages bundled into vendor.js by scripts/build-runtime.mjs.\n')
  const src = minified.code
  // Every import left in vendor.js must be one of our node shims.
  const missing = []
  for (const m of src.matchAll(/(?:^|[;\n])\s*(?:import|export)\b[^"';]*?from\s*["']([^"']+)["']|import\s*["']([^"']+)["']/g)) {
    const spec = m[1] || m[2]
    if (!spec.startsWith('./node/')) { missing.push(spec); continue }
    if (!existsSync(join(outDir, spec))) missing.push(spec)
  }
  if (missing.length) throw new Error(`vendor.js imports unresolved modules: ${[...new Set(missing)].join(', ')}`)
  return { file, bytes: Buffer.byteLength(src) }
}

export async function buildRuntime({ outDir = join(pkgDir, 'dist', 'runtime'), vendor = true, allJspm = false, log = console.log } = {}) {
  await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })

  await copyDir(join(srcRuntime, 'node'), join(outDir, 'node'))
  const parts = [`node/ (${await countFiles(join(outDir, 'node'))} files)`]

  if (existsSync(join(srcRuntime, 'bun'))) {
    await copyDir(join(srcRuntime, 'bun'), join(outDir, 'bun'))
    parts.push(`bun/ (${await countFiles(join(outDir, 'bun'))} files)`)
  }

  if (existsSync(join(srcRuntime, 'boot.js'))) {
    await cp(join(srcRuntime, 'boot.js'), join(outDir, 'boot.js'))
    parts.push('boot.js')
  }
  if (existsSync(join(srcRuntime, 'boot'))) {
    await copyDir(join(srcRuntime, 'boot'), join(outDir, 'boot'))
    parts.push(`boot/ (${await countFiles(join(outDir, 'boot'))} files)`)
  }

  // After node/, bun/ and boot.js are in place: their imports decide what of jspm ships.
  parts.push(`jspm/ (${await copyJspm(outDir, allJspm)} files)`)

  if (vendor) {
    const { bytes } = await buildVendor(outDir)
    parts.push(`vendor.js (${(bytes / 1024).toFixed(0)} KiB)`)
  }

  log(`build-runtime: ${relative(process.cwd(), outDir) || '.'}: ${parts.join(', ')}`)
  return outDir
}

function parseArgs(argv) {
  const opts = {}
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--out') opts.outDir = resolve(argv[++i])
    else if (argv[i] === '--no-vendor') opts.vendor = false
    else if (argv[i] === '--all-jspm') opts.allJspm = true
    else throw new Error(`unknown argument: ${argv[i]}`)
  }
  return opts
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const opts = parseArgs(process.argv.slice(2))
  if (!opts.outDir && !(await stat(join(pkgDir, 'dist')).catch(() => null))) {
    console.warn('build-runtime: dist/ does not exist yet (run `vite build` first); creating dist/runtime anyway')
  }
  buildRuntime(opts).catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
