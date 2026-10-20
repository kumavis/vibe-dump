// moku.geojson and ahupuaa.geojson (DATA.md §3) from the State GIS layers.
//
// What the layers turned out to hold, and what this does about it:
// - The ahupuaʻa layer (layer 1) spells every name with the ʻokina and kahakō,
//   per the SHPD corrections. Its `mokupuni` is per polygon and right.
// - The moku layer (layer 3) was dissolved from it, but three moku lost their
//   diacritics on the way (Halele'a, Ko'olaupoko, Kipahulu, with an ASCII
//   apostrophe or none), every `mokupuni` uses an ASCII apostrophe (Hawai'i),
//   and the Honuaʻula feature, which holds Honuaʻula on Maui plus Kahoʻolawe
//   and Molokini, carries mokupuni "Molokini".
// So a moku's `name` is the spelling its own ahupuaʻa carry in layer 1, which
// is what makes the two files join, and its island is the island where most
// of its ahupuaʻa lie (Maui for Honuaʻula: 13 of its 15). The layer's own
// fields stay beside these verbatim, so nothing is lost.
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { ISLANDS, fold, islandId } from './geo.mjs'
import { simplifyLayers } from './simplify.mjs'
import { BOUNDARY_LAYERS, BOUNDARY_LICENCE, BOUNDARY_SERVICE, readBoundaryLayer } from './sources.mjs'

export const TOLERANCE_METRES = 50

const islandName = (id) => ISLANDS.find((i) => i.id === id)?.name

function sourceEntry(key, layerJson, ledgerEntry) {
  const L = BOUNDARY_LAYERS[key]
  const desc = String(layerJson.description || '').replace(/\s+/g, ' ').trim()
  return {
    id: L.id,
    title: L.title,
    url: `${BOUNDARY_SERVICE}/${L.layer}`,
    fetched: ledgerEntry?.fetched,
    licence: BOUNDARY_LICENCE,
    credit: layerJson.copyrightText || undefined,
    metadata: L.metadata,
    description: desc,
  }
}

/**
 * Build both boundary files. Returns { moku, ahupuaa, stats } with the
 * FeatureCollections as written.
 */
export function bakeBoundaries({ dir, ledger, outDir, log }) {
  const ahu = readBoundaryLayer(dir, 'ahupuaa')
  const mok = readBoundaryLayer(dir, 'moku')

  // Spellings and areas from the ahupuaʻa layer.
  //   islandSpelling[id] = mokupuni as layer 1 writes it ("Hawaiʻi")
  //   mokuSpelling["id|folded moku"] = moku as layer 1 writes it
  //   mokuArea["folded moku"][id] = ahupuaʻa area of that moku on that island
  const islandSpelling = {}
  const mokuSpelling = {}
  const mokuArea = {}
  const tally = (obj, k, v) => ((obj[k] ||= {})[v] = ((obj[k] ||= {})[v] || 0) + 1)
  const spellCount = {}
  for (const f of ahu.features) {
    const p = f.properties
    const id = islandId(p.mokupuni)
    if (id) tally(spellCount, `island|${id}`, p.mokupuni)
    const fm = fold(p.moku)
    const owner = id || null
    if (owner) tally(spellCount, `moku|${owner}|${fm}`, p.moku)
    // count ahupuaʻa, area only breaks ties (Kahoʻolawe alone is nearly as big as Honuaʻula's part of Maui)
    const w = 1 + (Number(p['st_area(shape)']) || 0) / 1e12
    if (owner) ((mokuArea[fm] ||= {})[owner] = (mokuArea[fm][owner] || 0) + w)
  }
  const top = (o) => Object.entries(o).sort((a, b) => b[1] - a[1])[0][0]
  for (const [k, v] of Object.entries(spellCount)) {
    const parts = k.split('|')
    if (parts[0] === 'island') islandSpelling[parts[1]] = top(v)
    else mokuSpelling[`${parts[1]}|${parts[2]}`] = top(v)
  }

  // Moku features: island, then the layer-1 spelling.
  const notes = []
  const mokuFeatures = mok.features.map((f) => {
    const p = f.properties
    const fm = fold(p.moku)
    let id = islandId(p.mokupuni)
    if (!id || !mokuSpelling[`${id}|${fm}`]) {
      const areas = mokuArea[fm]
      if (!areas) throw new Error(`moku "${p.moku}" has no ahupuaʻa in layer 1`)
      const was = p.mokupuni
      id = top(areas)
      notes.push(`moku layer objectid ${p.objectid} "${p.moku}" has mokupuni "${was}"; its ahupuaʻa lie mostly on ${islandName(id)}, so island is ${islandSpelling[id]}`)
    }
    const name = mokuSpelling[`${id}|${fm}`]
    if (name !== p.moku) notes.push(`moku layer spells "${p.moku}" (${p.mokupuni}); layer 1 spells "${name}", used as name`)
    return {
      type: 'Feature',
      id: f.id ?? p.objectid,
      properties: {
        name,
        island: islandSpelling[id],
        islandId: id,
        mokuKey: `${id}:${name}`,
        gisId: p.objectid,
        ...p,
      },
      geometry: f.geometry,
    }
  })
  const mokuByKey = new Map(mokuFeatures.map((f) => [`${f.properties.islandId}|${fold(f.properties.name)}`, f]))
  const mokuByFold = {}
  for (const f of mokuFeatures) (mokuByFold[fold(f.properties.name)] ||= []).push(f)
  for (const i of ISLANDS) {
    if (!mokuFeatures.some((f) => f.properties.islandId === i.id)) {
      notes.push(`no moku feature has island ${i.name}; its land is inside another island's moku (see the ahupuaʻa layer)`)
    }
  }

  // Ahupuaʻa features: own island; moku joined by island and name.
  const ahuFeatures = ahu.features.map((f) => {
    const p = f.properties
    const fm = fold(p.moku)
    let id = islandId(p.mokupuni)
    let moku = id && mokuByKey.get(`${id}|${fm}`)
    if (!moku) {
      const cands = mokuByFold[fm] || []
      if (cands.length !== 1) throw new Error(`ahupuaʻa objectid ${p.objectid}: cannot find moku "${p.moku}" on "${p.mokupuni}"`)
      moku = cands[0]
      notes.push(`ahupuaʻa objectid ${p.objectid} "${p.ahupuaa}" on ${p.mokupuni} belongs to moku ${moku.properties.mokuKey}`)
    }
    if (!id) id = moku.properties.islandId // an islet such as Molokini goes with its moku's island pack
    const name = p.ahupuaa && p.ahupuaa !== 'N/A' ? p.ahupuaa : null
    return {
      type: 'Feature',
      id: f.id ?? p.objectid,
      properties: {
        name,
        island: p.mokupuni,
        islandId: id,
        mokuKey: moku.properties.mokuKey,
        gisId: p.objectid,
        ...p,
      },
      geometry: f.geometry,
    }
  })

  // Simplify both layers together so their shared lines stay identical.
  const t0 = Date.now()
  const s = simplifyLayers([mokuFeatures, ahuFeatures], TOLERANCE_METRES)
  const [mokuOut, ahuOut] = s.layers
  log(`  simplified ${s.stats.verticesIn} -> ${s.stats.verticesOut} vertices in ${s.stats.arcs} shared arcs (${((Date.now() - t0) / 1000).toFixed(1)} s), ` +
    `${s.stats.arcsRepaired} arcs re-simplified finer to keep rings valid, tolerance histogram ${JSON.stringify(s.stats.arcsByTolerance)}`)
  if (s.stats.invalidInSource.length) log(`  WARNING rings invalid in the source itself: ${JSON.stringify(s.stats.invalidInSource)}`)

  mkdirSync(outDir, { recursive: true })
  const write = (key, feats) => {
    const src = [sourceEntry(key, key === 'moku' ? mok.layer : ahu.layer, ledger.get(join(dir, 'boundaries', `${key}-layer.json`)))]
    const header = {
      type: 'FeatureCollection',
      name: key,
      sources: src,
      processing:
        `Fetched from the ArcGIS REST service as GeoJSON in WGS84 (outSR=4326). Coordinates snapped to 1e-6 degrees, then ` +
        `simplified together with the other boundary file (shared arcs, Douglas–Peucker, ${TOLERANCE_METRES} m tolerance in the ` +
        `projection of manifest.json, finer where needed to keep rings valid). Winding per RFC 7946. ` +
        `Added properties: name, island, islandId, mokuKey, gisId; every other property is the layer's own, verbatim.`,
    }
    const head = JSON.stringify(header).slice(0, -1)
    const body = feats.map((f) => JSON.stringify(f)).join(',\n')
    const text = `${head},"features":[\n${body}\n]}\n`
    const file = join(outDir, `${key}.geojson`)
    writeFileSync(file, text)
    return { type: 'FeatureCollection', ...header, features: feats }
  }
  const mokuFc = write('moku', mokuOut)
  const ahuFc = write('ahupuaa', ahuOut)
  for (const n of notes) log(`  note: ${n}`)
  return { moku: mokuFc, ahupuaa: ahuFc, stats: s.stats, notes }
}
