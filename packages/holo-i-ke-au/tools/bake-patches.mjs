#!/usr/bin/env node
// Patches for Holo i ke Au (DATA.md, "Patches, on any pack"): the masks that
// return dredged water to reef flat and filled land to water for the years
// before each harbour work, on the oahu island pack and the districts on it.
//
//   node packages/holo-i-ke-au/tools/bake-patches.mjs --all            download, bake, check, delete the downloads
//   node packages/holo-i-ke-au/tools/bake-patches.mjs --download       fetch every source (~170 MB, under a minute)
//   node packages/holo-i-ke-au/tools/bake-patches.mjs --bake           write public/data/patches/ (and the district's patch files)
//   node packages/holo-i-ke-au/tools/bake-patches.mjs --check          read the patches back and check them
//   node packages/holo-i-ke-au/tools/bake-patches.mjs --preview DIR    today and the patched years side by side, per harbour and pack
//   node packages/holo-i-ke-au/tools/bake-patches.mjs --sheets DIR     the 1881 and 1938 maps with the traced shapes over them
//   node packages/holo-i-ke-au/tools/bake-patches.mjs --clean          delete the downloads directory
//
// Options:
//   --downloads DIR   where raw downloads go (default: $HOLO_PATCHES_DOWNLOADS, else
//                     <os tmpdir>/holo-i-ke-au-bake/patches-downloads). Keep it outside the repo.
//
// The works themselves (what was cut or filled, where, when, on whose word)
// are hand-written in lib/patch-works.mjs; the bake turns them into masks
// with the CUDEM, the packs' own heights, the State's fill unit and the
// traced old shores. It reads public/data/manifest.json and
// districts/manifest.json and writes only public/data/patches/ and the
// districts' patch-<work>.png files; it never touches the packs, the
// district manifest or features.json. Like `npm run thumbnails`, a by-hand
// step whose output is committed; nothing here runs at app runtime.
import { rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Ledger } from './lib/fetch.mjs'
import { downloadPatches } from './lib/patch-sources.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG = resolve(HERE, '..')
const DATA = join(PKG, 'public', 'data')

const log = (...m) => console.log(...m)

function parseArgs(argv) {
  const a = { flags: new Set(), downloads: null, preview: null, sheets: null }
  for (let i = 0; i < argv.length; i++) {
    const v = argv[i]
    if (v === '--downloads') a.downloads = argv[++i]
    else if (v === '--preview' || v === '--sheets') {
      a.flags.add(v.slice(2))
      a[v.slice(2)] = argv[++i]
      if (!a[v.slice(2)]) throw new Error(`${v} needs a directory`)
    } else if (v.startsWith('--')) a.flags.add(v.slice(2))
    else throw new Error(`unexpected argument ${v}`)
  }
  a.downloads = resolve(a.downloads || process.env.HOLO_PATCHES_DOWNLOADS || join(tmpdir(), 'holo-i-ke-au-bake', 'patches-downloads'))
  return a
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const f = args.flags
  if (!['download', 'bake', 'check', 'preview', 'sheets', 'clean', 'all'].some((k) => f.has(k))) {
    console.error('usage: bake-patches.mjs --download | --bake | --check | --preview DIR | --sheets DIR | --clean | --all  [--downloads DIR]')
    process.exit(2)
  }
  if (f.has('download') || f.has('all')) {
    log(`downloads: ${args.downloads}`)
    downloadPatches(new Ledger(args.downloads), args.downloads, log)
  }
  if (f.has('bake') || f.has('all')) {
    const { bakePatches } = await import('./lib/patch-bake.mjs')
    await bakePatches({ dir: args.downloads, data: DATA, log })
  }
  if (f.has('check') || f.has('all')) {
    const { checkPatches } = await import('./lib/patch-check.mjs')
    if (!checkPatches({ data: DATA, log })) process.exit(1)
  }
  if (f.has('preview')) {
    const { previewPatches } = await import('./lib/patch-check.mjs')
    previewPatches({ data: DATA, out: resolve(args.preview), log })
  }
  if (f.has('sheets')) {
    const { sheetsPatches } = await import('./lib/patch-check.mjs')
    await sheetsPatches({ data: DATA, dir: args.downloads, out: resolve(args.sheets), log })
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
