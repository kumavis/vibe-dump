#!/usr/bin/env node
// District packs for Holo i ke Au (DESIGN.md §3.3, §3.4, §8; DATA.md
// "District packs"): one valley or moku baked finer than its island, from
// lidar, with the patches that put the shoreline back where it was.
//
//   node packages/holo-i-ke-au/tools/bake-district.mjs --all            download, bake, check, delete the downloads
//   node packages/holo-i-ke-au/tools/bake-district.mjs --download       fetch every source (nuuanu ~1.5 GB, koolaupoko ~3.6 GB)
//   node packages/holo-i-ke-au/tools/bake-district.mjs --bake           write public/data/districts/ from the downloads
//   node packages/holo-i-ke-au/tools/bake-district.mjs --check          read public/data/districts/ back and check it
//   node packages/holo-i-ke-au/tools/bake-district.mjs --preview DIR    shaded relief, lines, streams, breaches, patches
//   node packages/holo-i-ke-au/tools/bake-district.mjs --find-breaches  list the pits left on the stream trunks
//   node packages/holo-i-ke-au/tools/bake-district.mjs --clean          delete the downloads directory
//
// Options:
//   --district id     the district to download, bake or find breaches for: nuuanu (the default)
//                     or koolaupoko (lib/district-sources.mjs); --check and --preview take every district
//   --downloads DIR   where raw downloads go (default: $HOLO_DISTRICT_DOWNLOADS, else
//                     <os tmpdir>/holo-i-ke-au-bake/district-downloads). Keep it outside the repo.
//   --breach LIST     carve these instead of the district's own breaches: polylines
//                     "lon,lat lon,lat;lon,lat lon,lat" (semicolons between breaches),
//                     each cut from its first point to its last (lib/district-water.mjs);
//                     --breach "" carves none
//   --find-breaches   after the bake, list the pits still left on the streams' trunks
//                     as breaches, in the form the district's `breaches` list takes
//
// The bake writes only public/data/districts/manifest.json and the district's
// images and supporting files; features.json beside them is hand-written and
// never touched. The check also reads the island pack the district sits in
// (public/data/manifest.json), the preview the boundary lines. The lidar's
// accumulation is cached in the downloads directory, so a re-bake from the
// same downloads takes seconds, and gives the same bytes. Like `npm run
// thumbnails`, a by-hand step whose output is committed; nothing here runs
// at app runtime.
import { existsSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Ledger } from './lib/fetch.mjs'
import { DISTRICTS, districtPaths, downloadDistrict } from './lib/district-sources.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG = resolve(HERE, '..')
const DATA = join(PKG, 'public', 'data')

const log = (...m) => console.log(...m)

function parseArgs(argv) {
  const a = { flags: new Set(), downloads: null, preview: null, district: 'nuuanu', breach: null }
  for (let i = 0; i < argv.length; i++) {
    const v = argv[i]
    if (v === '--downloads') a.downloads = argv[++i]
    else if (v === '--district') a.district = argv[++i]
    else if (v === '--breach') a.breach = argv[++i]
    else if (v === '--preview') {
      a.flags.add('preview')
      a.preview = argv[++i]
      if (!a.preview) throw new Error('--preview needs a directory')
    } else if (v.startsWith('--')) a.flags.add(v.slice(2))
    else throw new Error(`unexpected argument ${v}`)
  }
  a.downloads = resolve(a.downloads || process.env.HOLO_DISTRICT_DOWNLOADS || join(tmpdir(), 'holo-i-ke-au-bake', 'district-downloads'))
  return a
}

/** "lon,lat lon,lat;lon,lat" into [{ points: [[lon, lat], ...] }] */
function parseBreaches(s) {
  return s
    .split(';')
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b, k) => {
      const points = b.split(/\s+/).map((p) => p.split(',').map(Number))
      if (!points.length || points.some((p) => p.length !== 2 || !p.every(Number.isFinite))) throw new Error(`--breach: cannot read "${b}"`)
      return { name: `breach ${k + 1} (from --breach)`, points }
    })
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const f = args.flags
  if (!['download', 'bake', 'check', 'preview', 'clean', 'all', 'find-breaches'].some((k) => f.has(k))) {
    console.error('usage: bake-district.mjs --download | --bake | --check | --preview DIR | --find-breaches | --clean | --all  [--district id] [--downloads DIR] [--breach LIST]')
    process.exit(2)
  }
  const d = DISTRICTS[args.district]
  if (!d) throw new Error(`no district ${args.district}; known: ${Object.keys(DISTRICTS).join(', ')}`)
  const breaches = args.breach !== null ? parseBreaches(args.breach) : null
  if (f.has('download') || f.has('all')) {
    log(`downloads: ${args.downloads}`)
    await downloadDistrict(new Ledger(args.downloads), args.downloads, d, log)
  }
  if (f.has('bake') || f.has('all')) {
    if (!existsSync(districtPaths(args.downloads, d.id).lidarTiles)) throw new Error(`nothing downloaded in ${args.downloads}; run --download first`)
    const { bakeDistrict } = await import('./lib/district-bake.mjs')
    await bakeDistrict({ dir: args.downloads, data: DATA, d, breaches, log })
  }
  if (f.has('find-breaches')) {
    const { findBreaches } = await import('./lib/district-check.mjs')
    findBreaches({ data: DATA, d, dir: args.downloads, log })
  }
  if (f.has('check') || f.has('all')) {
    const { checkDistricts } = await import('./lib/district-check.mjs')
    if (!checkDistricts({ data: DATA, log })) process.exit(1)
  }
  if (f.has('preview')) {
    const { previewDistricts } = await import('./lib/district-check.mjs')
    previewDistricts({ data: DATA, out: resolve(args.preview), log })
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
