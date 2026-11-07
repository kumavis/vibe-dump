#!/usr/bin/env node
// The ground under the highways for Holo i ke Au (DATA.md, "Patches, on any
// pack", "Accepted extensions (restore)"): `restore` patches that lay each
// road's cuts and fills back to the ground round them for the years before
// the road, on the oahu island pack and the districts on it.
//
//   node packages/holo-i-ke-au/tools/bake-roads.mjs --bake      write public/data/patches/roads/ and the restore entries of patches/manifest.json
//   node packages/holo-i-ke-au/tools/bake-roads.mjs --check     read them back and check them
//   node packages/holo-i-ke-au/tools/bake-roads.mjs --all       both
//
// Nothing is downloaded: the bake reads the packs' own heights
// (public/data/manifest.json, districts/manifest.json) and the works
// (works/oahu.geojson: the highways and their dates), and writes only
// patches/roads/ and, at the end of patches/manifest.json, its own entries;
// every other entry stays as it was. Run it after the pack, district,
// patch and works bakes: the patches are made against the heights, and kept
// off the harbours' patches. Like the other bakes, a by-hand step whose
// output is committed; nothing here runs at app runtime.
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const DATA = join(resolve(HERE, '..'), 'public', 'data')
const log = (...m) => console.log(...m)

async function main() {
  const f = new Set(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => a.slice(2)))
  if (!['bake', 'check', 'all'].some((k) => f.has(k))) {
    console.error('usage: bake-roads.mjs --bake | --check | --all')
    process.exit(2)
  }
  if (f.has('bake') || f.has('all')) {
    const { bakeRoads } = await import('./lib/roads-bake.mjs')
    bakeRoads({ data: DATA, log })
  }
  if (f.has('check') || f.has('all')) {
    const { checkRoads } = await import('./lib/roads-check.mjs')
    if (!checkRoads({ data: DATA, log })) process.exit(1)
  }
}

main().catch((e) => {
  console.error(e.stack || String(e))
  process.exit(1)
})
