#!/usr/bin/env node
// The towns' streets, dated (DATA.md, "Streets, dated"): today's street
// centrelines of each town, each dated by the oldest of the georeferenced
// sheets the State GIS serves on which it is drawn, so the settlements can
// lay their lots along the streets of the year (features/settlements.js,
// features/towns.js) and the streets be drawn from their dates
// (features/streets.js).
//
//   node packages/holo-i-ke-au/tools/bake-streets.mjs --all            download, bake, check, delete the downloads
//   node packages/holo-i-ke-au/tools/bake-streets.mjs --download       the centrelines and the sheets over every town (~250 MB, ten minutes or so)
//   node packages/holo-i-ke-au/tools/bake-streets.mjs --bake           register the sheets, look for each street on each, write public/data/streets/
//   node packages/holo-i-ke-au/tools/bake-streets.mjs --check          read streets/ back and check it (and run tools/check-data.mjs)
//   node packages/holo-i-ke-au/tools/bake-streets.mjs --sheets DIR     bake, drawing each town's streets over each sheet: found green, not found red
//   node packages/holo-i-ke-au/tools/bake-streets.mjs --clean          delete the downloads directory
//
// Options:
//   --town ID         only this town (repeatable; the others keep what they have)
//   --downloads DIR   where raw downloads go (default: $HOLO_STREETS_DOWNLOADS, else
//                     <os tmpdir>/holo-i-ke-au-bake/streets-downloads). Keep it outside the repo.
//
// It writes only public/data/streets/. Like `npm run thumbnails`, a by-hand
// step whose output is committed; nothing here runs at app runtime.
import { rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { Ledger } from './lib/fetch.mjs'
import { TOWNS, downloadCentrelines, downloadSheets } from './lib/streets-sources.mjs'
import { bakeStreets } from './lib/streets-bake.mjs'
import { checkStreets } from './lib/streets-check.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG = resolve(HERE, '..')
const OUT = join(PKG, 'public', 'data', 'streets')
const log = (...m) => console.log(...m)

function parseArgs(argv) {
  const a = { flags: new Set(), downloads: null, sheets: null, towns: [] }
  for (let i = 0; i < argv.length; i++) {
    const v = argv[i]
    if (v === '--downloads') a.downloads = argv[++i]
    else if (v === '--town') a.towns.push(argv[++i])
    else if (v === '--sheets') {
      a.flags.add('sheets')
      a.sheets = argv[++i]
      if (!a.sheets) throw new Error('--sheets needs a directory')
    } else if (v.startsWith('--')) a.flags.add(v.slice(2))
    else throw new Error(`unexpected argument ${v}`)
  }
  a.downloads = resolve(a.downloads || process.env.HOLO_STREETS_DOWNLOADS || join(tmpdir(), 'holo-i-ke-au-bake', 'streets-downloads'))
  for (const t of a.towns) if (!TOWNS.some((q) => q.id === t)) throw new Error(`no town ${t}`)
  return a
}

async function main() {
  const a = parseArgs(process.argv.slice(2))
  const all = a.flags.has('all')
  const towns = a.towns.length ? TOWNS.filter((t) => a.towns.includes(t.id)) : TOWNS
  if (!a.flags.size) throw new Error('nothing to do: --all, --download, --bake, --check, --sheets DIR or --clean')
  if (all || a.flags.has('download')) {
    const ledger = new Ledger(a.downloads)
    log(`downloads: ${a.downloads}`)
    for (const t of towns) {
      downloadCentrelines(ledger, a.downloads, t, log)
      downloadSheets(ledger, a.downloads, t, log)
    }
  }
  // (--sheets DIR bakes too, drawing each sheet as it is read)
  if (all || a.flags.has('bake') || a.flags.has('sheets')) await bakeStreets({ dir: a.downloads, out: OUT, towns, ledger: new Ledger(a.downloads), log, draw: a.sheets ? resolve(a.sheets) : null })
  if (all || a.flags.has('check')) {
    const ok = checkStreets(OUT, log)
    const r = spawnSync(process.execPath, [join(HERE, 'check-data.mjs')], { stdio: 'inherit' })
    if (!ok || r.status !== 0) process.exit(1)
  }
  if (all || a.flags.has('clean')) {
    rmSync(a.downloads, { recursive: true, force: true })
    log(`deleted ${a.downloads}`)
  }
}

main().catch((err) => {
  console.error(err.stack || err.message)
  process.exit(1)
})
