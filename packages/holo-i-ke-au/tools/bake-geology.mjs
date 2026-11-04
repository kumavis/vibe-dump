#!/usr/bin/env node
// The geology bake for Holo i ke Au (DESIGN.md §13; DATA.md "Geology: the
// making of the islands", "How to bake the geology"): the seafloor pack over
// a box wide enough for the debris fields, the reconstructed islands at each
// stage on its grid, and the hotspot's drift, all under public/data/geology/.
//
//   node packages/holo-i-ke-au/tools/bake-geology.mjs --all            download, bake, check, delete the downloads
//   node packages/holo-i-ke-au/tools/bake-geology.mjs --download       fetch the sources (~200 MB)
//   node packages/holo-i-ke-au/tools/bake-geology.mjs --bake           write the seafloor pack, the stages and manifest.json
//   node packages/holo-i-ke-au/tools/bake-geology.mjs --stages         re-model the stages from the committed seafloor pack (no downloads)
//   node packages/holo-i-ke-au/tools/bake-geology.mjs --check          read public/data/geology/ back and check it
//   node packages/holo-i-ke-au/tools/bake-geology.mjs --preview DIR    each stage as shaded relief beside today's
//   node packages/holo-i-ke-au/tools/bake-geology.mjs --clean          delete the downloads directory
//
// Options:
//   --subsidence fit  the subsidence curve fitted to the measured rates per volcano (the default)
//   --subsidence rule volcanoes.json's subsidenceRule as it stands (it lifts every young shield 2.6 km)
//   --downloads DIR   where raw downloads go (default: $HOLO_GEOLOGY_DOWNLOADS, else
//                     <os tmpdir>/holo-i-ke-au-bake/geology-downloads). Keep it outside the repo.
//
// The bake writes only geology/manifest.json's `seafloor`, `stages`,
// `subsidence` and `hotspot` (any other key in it is kept), and the images
// under geology/seafloor/ and geology/stages/. volcanoes.json,
// landslides.geojson and chapters.json beside them are the research's and
// are only read: the stages take their volcanoes, ages and slides from them
// where they exist, and from the table in lib/geology-model.mjs where they do
// not. Like `npm run thumbnails`, a by-hand step whose output is committed;
// nothing here runs at app runtime.
import { existsSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Ledger } from './lib/fetch.mjs'
import { downloadGeology, geologyPaths } from './lib/geology-sources.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG = resolve(HERE, '..')
const DATA = join(PKG, 'public', 'data')

const log = (...m) => console.log(...m)

function parseArgs(argv) {
  const a = { flags: new Set(), downloads: null, preview: null, subsidence: 'fit' }
  for (let i = 0; i < argv.length; i++) {
    const v = argv[i]
    if (v === '--downloads') a.downloads = argv[++i]
    else if (v === '--subsidence') a.subsidence = argv[++i]
    else if (v === '--preview') {
      a.flags.add('preview')
      a.preview = argv[++i]
      if (!a.preview) throw new Error('--preview needs a directory')
    } else if (v.startsWith('--')) a.flags.add(v.slice(2))
    else throw new Error(`unexpected argument ${v}`)
  }
  a.downloads = resolve(a.downloads || process.env.HOLO_GEOLOGY_DOWNLOADS || join(tmpdir(), 'holo-i-ke-au-bake', 'geology-downloads'))
  return a
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const f = args.flags
  if (!['download', 'bake', 'stages', 'check', 'preview', 'clean', 'all'].some((k) => f.has(k))) {
    console.error('usage: bake-geology.mjs --download | --bake | --stages | --check | --preview DIR | --clean | --all  [--downloads DIR] [--subsidence fit|rule]')
    process.exit(2)
  }
  if (f.has('download') || f.has('all')) {
    log(`downloads: ${args.downloads}`)
    downloadGeology(new Ledger(args.downloads), args.downloads, log)
  }
  if (f.has('bake') || f.has('all')) {
    if (!existsSync(geologyPaths(args.downloads).gmrt)) throw new Error(`nothing downloaded in ${args.downloads}; run --download first`)
    const { bakeSeafloor } = await import('./lib/geology-bake.mjs')
    await bakeSeafloor({ dir: args.downloads, data: DATA, log })
  }
  if (f.has('bake') || f.has('stages') || f.has('all')) {
    const { bakeStages } = await import('./lib/geology-bake.mjs')
    if (!['fit', 'rule'].includes(args.subsidence)) throw new Error('--subsidence takes fit or rule')
    bakeStages({ data: DATA, log, subsidenceMode: args.subsidence })
  }
  if (f.has('check') || f.has('all')) {
    const { checkGeology } = await import('./lib/geology-check.mjs')
    if (!checkGeology({ data: DATA, log })) process.exit(1)
  }
  if (f.has('preview')) {
    const { previewGeology } = await import('./lib/geology-check.mjs')
    previewGeology({ data: DATA, out: resolve(args.preview), log })
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
