#!/usr/bin/env node
// The offline data bake for Holo i ke Au (DESIGN.md §5.1, DATA.md §2-3).
//
//   node packages/holo-i-ke-au/tools/bake.mjs --download   fetch every source into the downloads directory
//   node packages/holo-i-ke-au/tools/bake.mjs --bake       write public/data/ from the downloads
//   node packages/holo-i-ke-au/tools/bake.mjs --check      read public/data/ back and check it (bake-check.mjs)
//   node packages/holo-i-ke-au/tools/bake.mjs --clean      delete the downloads directory
//   node packages/holo-i-ke-au/tools/bake.mjs --all        download, bake, check, clean
//
// Options:
//   --downloads DIR   where raw downloads go (default: $HOLO_BAKE_DOWNLOADS, else
//                     <os tmpdir>/holo-i-ke-au-bake/downloads). Keep it outside the repo.
//   --only a,b        bake only these packs (ids), plus boundaries; the manifest
//                     keeps the other packs' existing entries
//   --flat-sea-ok     accept packs whose GMRT bathymetry could not be fetched
//                     (they get a flat -1 m sea); without it, download and bake stop
//
// If GMRT answers with empty grids (it does under load), --download stops and
// says so; run it again and only the missing files are fetched.
//
// Run locally, by hand, like `npm run thumbnails`; the output is committed.
// Nothing here runs at app runtime and the app fetches nothing from the network.
import { existsSync, mkdirSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { Ledger } from './lib/fetch.mjs'
import { bathyFile, downloadBathy, downloadBoundaryLayer, downloadDem, downloadRain, packGrids, paths, writeNotes, readNotes } from './lib/sources.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
export const PKG = resolve(HERE, '..')
export const OUT = join(PKG, 'public', 'data')

function parseArgs(argv) {
  const a = { flags: new Set(), downloads: null, only: null }
  for (let i = 0; i < argv.length; i++) {
    const v = argv[i]
    if (v === '--downloads') a.downloads = argv[++i]
    else if (v === '--only') a.only = argv[++i].split(',').map((s) => s.trim()).filter(Boolean)
    else if (v.startsWith('--')) a.flags.add(v.slice(2))
    else throw new Error(`unexpected argument ${v}`)
  }
  a.downloads = resolve(a.downloads || process.env.HOLO_BAKE_DOWNLOADS || join(tmpdir(), 'holo-i-ke-au-bake', 'downloads'))
  return a
}

const log = (...m) => console.log(...m)

const FLAT_SEA_HELP =
  'run --download again (finished files are kept, only the missing ones are fetched), ' +
  'or pass --flat-sea-ok to bake those packs with a flat -1 m sea'

function download(dir, flatSeaOk) {
  mkdirSync(dir, { recursive: true })
  const ledger = new Ledger(dir)
  log(`downloads: ${dir}`)
  log('boundaries (State of Hawaiʻi GIS):')
  downloadBoundaryLayer(ledger, dir, 'moku', log)
  downloadBoundaryLayer(ledger, dir, 'ahupuaa', log)
  const grids = packGrids(dir)
  log('DEM tiles (USGS 3DEP 1 arc-second):')
  const dem = downloadDem(ledger, dir, grids, log)
  log('bathymetry (GMRT):')
  const bathy = downloadBathy(ledger, dir, grids, log)
  log('rain (Rainfall Atlas of Hawaiʻi):')
  const rain = downloadRain(ledger, dir, log)
  writeNotes(dir, { ...readNotes(dir), demMissing: dem.missing, bathyPacks: Object.keys(bathy.files), rain: !!rain })
  if (bathy.failed.length && !flatSeaOk) {
    throw new Error(`GMRT bathymetry failed for ${bathy.failed.join(', ')}; ${FLAT_SEA_HELP}`)
  }
}

// A pack whose GMRT grid is missing would silently lose its sea floor; refuse
// unless asked, so a flaky server cannot quietly degrade the committed data.
function checkBathy(dir, only, flatSeaOk) {
  const missing = packGrids(dir)
    .filter((g) => !only || only.includes(g.id))
    .filter((g) => {
      const f = bathyFile(dir, g.id)
      return !existsSync(f) || statSync(f).size === 0
    })
    .map((g) => g.id)
  if (missing.length && !flatSeaOk) throw new Error(`no GMRT bathymetry downloaded for ${missing.join(', ')}; ${FLAT_SEA_HELP}`)
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const f = args.flags
  if (!['download', 'bake', 'check', 'clean', 'all'].some((k) => f.has(k))) {
    console.error('usage: bake.mjs --download | --bake | --check | --clean | --all  [--downloads DIR] [--only ids] [--flat-sea-ok]')
    process.exit(2)
  }
  const flatSeaOk = f.has('flat-sea-ok')
  if (f.has('download') || f.has('all')) download(args.downloads, flatSeaOk)
  if (f.has('bake') || f.has('all')) {
    if (!existsSync(paths(args.downloads).boundaries)) throw new Error(`nothing downloaded in ${args.downloads}; run --download first`)
    checkBathy(args.downloads, args.only, flatSeaOk)
    const { bake } = await import('./lib/bake-run.mjs')
    await bake({ dir: args.downloads, out: OUT, only: args.only, log })
  }
  if (f.has('check') || f.has('all')) {
    const r = spawnSync(process.execPath, [join(HERE, 'bake-check.mjs')], { stdio: 'inherit' })
    if (r.status !== 0) process.exit(r.status || 1)
  }
  if (f.has('clean') || f.has('all')) {
    rmSync(args.downloads, { recursive: true, force: true })
    log(`deleted ${args.downloads}`)
  }
}

main().catch((e) => {
  console.error(e.stack || String(e))
  process.exit(1)
})
