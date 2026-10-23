#!/usr/bin/env node
// Works for Holo i ke Au (DATA.md, "Works, dated"): military land and its
// installations, airports, highways, rail and harbours, each at the year it
// was built, taken, opened, closed or returned, per island pack.
//
//   node packages/holo-i-ke-au/tools/bake-works.mjs --all            download, bake, check, delete the downloads
//   node packages/holo-i-ke-au/tools/bake-works.mjs --download       fetch every layer, the OSM buildings and the sheets over the bases (about 120 MB, a few minutes)
//   node packages/holo-i-ke-au/tools/bake-works.mjs --bake           write public/data/works/
//   node packages/holo-i-ke-au/tools/bake-works.mjs --check          read the works back and check them
//   node packages/holo-i-ke-au/tools/bake-works.mjs --sheets DIR     the historic sheets with the traced lines and carving zones over them
//   node packages/holo-i-ke-au/tools/bake-works.mjs --clean          delete the downloads directory
//
// Options:
//   --downloads DIR   where raw downloads go (default: $HOLO_WORKS_DOWNLOADS, else
//                     <os tmpdir>/holo-i-ke-au-bake/works-downloads). Keep it outside the repo.
//
// The dates, owners, names and sources are hand-written in
// lib/works-dates.mjs and joined to the layers by their own names and ids;
// the lines no open layer gives (the railways, the old Kona runway) and the zones
// that carve one base out of another are traced by hand from the State's
// georeferenced historic sheets in lib/works-traced.mjs. The bake reads
// public/data/manifest.json for the packs' bounds and writes only
// public/data/works/. Like `npm run thumbnails`, a by-hand step whose output
// is committed; nothing here runs at app runtime.
import { rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Ledger } from './lib/fetch.mjs'
import { downloadWorks } from './lib/works-sources.mjs'
import { downloadBlocks } from './lib/works-osm.mjs'
import { BLOCK_BASES } from './lib/works-dates.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG = resolve(HERE, '..')
const DATA = join(PKG, 'public', 'data')

const log = (...m) => console.log(...m)

function parseArgs(argv) {
  const a = { flags: new Set(), downloads: null, sheets: null }
  for (let i = 0; i < argv.length; i++) {
    const v = argv[i]
    if (v === '--downloads') a.downloads = argv[++i]
    else if (v === '--sheets') {
      a.flags.add('sheets')
      a.sheets = argv[++i]
      if (!a.sheets) throw new Error('--sheets needs a directory')
    } else if (v.startsWith('--')) a.flags.add(v.slice(2))
    else throw new Error(`unexpected argument ${v}`)
  }
  a.downloads = resolve(a.downloads || process.env.HOLO_WORKS_DOWNLOADS || join(tmpdir(), 'holo-i-ke-au-bake', 'works-downloads'))
  return a
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const f = args.flags
  if (!['download', 'bake', 'check', 'sheets', 'clean', 'all'].some((k) => f.has(k))) {
    console.error('usage: bake-works.mjs --download | --bake | --check | --sheets DIR | --clean | --all  [--downloads DIR]')
    process.exit(2)
  }
  if (f.has('download') || f.has('all')) {
    log(`downloads: ${args.downloads}`)
    const ledger = new Ledger(args.downloads)
    downloadWorks(ledger, args.downloads, log)
    downloadBlocks(ledger, args.downloads, Object.entries(BLOCK_BASES).map(([base, b]) => ({ base, ...b })), log)
  }
  if (f.has('bake') || f.has('all')) {
    const { bakeWorks } = await import('./lib/works-bake.mjs')
    log('works:')
    bakeWorks({ dir: args.downloads, data: DATA, log })
  }
  if (f.has('check') || f.has('all')) {
    const { checkWorks } = await import('./lib/works-check.mjs')
    if (!checkWorks({ data: DATA, log })) process.exit(1)
  }
  if (f.has('sheets')) {
    const { sheetsWorks } = await import('./lib/works-check.mjs')
    await sheetsWorks({ data: DATA, out: resolve(args.sheets), log })
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
