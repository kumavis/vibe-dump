// Shared setup for the track B tests (not itself a test file).
//
// The shims are plain ESM that import ../jspm/*.js and ../vendor.js, i.e. they
// only resolve inside an assembled runtime directory. getRuntime() assembles one
// in a temp dir with scripts/build-runtime.mjs. The Vite build of vendor.js is
// cached in the OS temp dir, keyed by everything that goes into it, so only the
// first test process pays for it.
import { createHash } from 'node:crypto'
import { copyFileSync, existsSync, mkdtempSync, readFileSync, renameSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { buildRuntime, buildVendor, pkgDir } from '../../scripts/build-runtime.mjs'
import { RESEARCH_DIR } from '../research.mjs'

// Research artifacts (read-only inputs). Tests that need them skip when absent.
export const SCRATCH_RESEARCH = RESEARCH_DIR // CC_RESEARCH_DIR, see ../research.mjs
export const EXTRACTED_TREE = join(SCRATCH_RESEARCH, 'spike-E', 'extract-unhare', 'root')
// Pre-installed Chromium builds (the ARCHITECTURE.md path, then what this
// sandbox actually has); the first that exists wins.
export const CHROMIUM = [
  '/opt/pw-browsers/chromium-1243/chrome-linux/chrome',
  '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome',
  '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
].find((p) => existsSync(p))

function vendorKey() {
  const h = createHash('sha256')
  for (const f of ['src/runtime/vendor-entry.js', 'vite.vendor.config.js', 'src/runtime/node/BUILTINS.js', 'scripts/build-runtime.mjs']) {
    h.update(readFileSync(join(pkgDir, f)))
  }
  for (const dep of ['memfs', '@noble/hashes', 'fflate', 'fzstd', 'yaml', 'semver', 'string-width', 'wrap-ansi', 'slice-ansi', 'strip-ansi', '@jsonjoy.com/fs-core']) {
    for (let d = pkgDir; ; d = resolve(d, '..')) {
      const p = join(d, 'node_modules', dep, 'package.json')
      if (existsSync(p)) { h.update(`${dep}@${JSON.parse(readFileSync(p, 'utf8')).version}`); break }
      if (resolve(d, '..') === d) break
    }
  }
  return h.digest('hex').slice(0, 16)
}

let runtimeDir = null

export async function getRuntime() {
  if (runtimeDir) return runtimeDir
  const dir = mkdtempSync(join(tmpdir(), 'ccw-runtime-'))
  process.on('exit', () => rmSync(dir, { recursive: true, force: true }))
  await buildRuntime({ outDir: dir, vendor: false, log: () => {} })
  const files = ['vendor.js', 'vendor.licenses.txt']
  const cached = join(tmpdir(), `ccw-vendor-${vendorKey()}`)
  if (existsSync(join(cached, 'vendor.js'))) {
    for (const f of files) copyFileSync(join(cached, f), join(dir, f))
  } else {
    await buildVendor(dir)
    const tmp = mkdtempSync(`${cached}.tmp-`)
    for (const f of files) copyFileSync(join(dir, f), join(tmp, f))
    try { renameSync(tmp, cached) } catch { rmSync(tmp, { recursive: true, force: true }) } // another test process won the race
  }
  runtimeDir = dir
  return dir
}

// import a shim by its runtime path, e.g. load('node/fs.js')
export async function load(rel) {
  const dir = await getRuntime()
  return import(pathToFileURL(join(dir, rel)).href)
}

export const here = fileURLToPath(new URL('.', import.meta.url))
