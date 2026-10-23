// Reading the baked works back (bake-works.mjs --check) and drawing the traced
// shapes over the sheets they were read from (--sheets DIR).
//
// The rules themselves live in tools/check-data.mjs, in its works block, so
// that one command holds the whole package to its contract; --check runs it and
// adds the summary a bake wants: features per island and kind, the size, every
// feature dated only `by` a sheet or record, and which layer each kind rests on.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readPNG, writePNG } from './png.mjs'
import { TRACED, ZONES } from './works-traced.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const CHECK = join(HERE, '..', 'check-data.mjs')
const KINDS = ['military', 'airport', 'highway', 'rail', 'harbour']

/** Summarise works/ and run check-data over the package. Returns true when clean. */
export function checkWorks({ data, log }) {
  const dir = join(data, 'works')
  if (!existsSync(join(dir, 'manifest.json'))) {
    log('no works/manifest.json: run --bake first')
    return false
  }
  const man = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'))
  const bytes = readdirSync(dir).reduce((n, f) => n + statSync(join(dir, f)).size, 0)
  const rows = []
  const by = []
  const rests = {}
  for (const file of man.files) {
    const fc = JSON.parse(readFileSync(join(dir, file), 'utf8'))
    const t = {}
    for (const f of fc.features) {
      const p = f.properties
      t[p.kind] = (t[p.kind] || 0) + 1
      if (p.datePrecision === 'by') by.push(`${p.id} (${p.from}, ${p.by})`)
      const src = p.layer?.source === 'traced' ? `traced from ${p.layer.sheet}` : p.layer?.source
      ;(rests[p.kind] ||= new Set()).add(src)
    }
    rows.push(`  ${fc.island.padEnd(10)} ${KINDS.map((k) => `${k} ${t[k] || 0}`).join(', ')}`)
  }
  log('works, read back:')
  for (const r of rows) log(r)
  log(`  ${(bytes / 1024).toFixed(0)} KB in ${man.files.length} files and the manifest`)
  for (const k of KINDS) if (rests[k]) log(`  ${k} geometry: ${[...rests[k]].sort().join('; ')}`)
  log(`  dated only by a sheet or record (${by.length}): ${by.join(', ')}`)
  try {
    const out = execFileSync(process.execPath, [CHECK, data], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
    const lines = out.split('\n')
    const at = lines.findIndex((l) => /^\s+works\s/.test(l))
    const works = at < 0 ? [] : lines.slice(at, at + 2)
    log('check-data: clean')
    for (const l of works) log(l)
    return true
  } catch (e) {
    log(String(e.stdout || ''))
    log(String(e.stderr || e.message))
    return false
  }
}

/** The image services of the sheets the traced shapes cite, by their id in sources.json. */
const SHEETS = {
  'usgs-topo-1927-oahu': 'https://geodata.hawaii.gov/arcgis/rest/services/SoH_Maps/oahu_topo_1927/ImageServer',
  'state-gis-oahu-1938': 'https://geodata.hawaii.gov/arcgis/rest/services/Historic_Maps/Oahu_1938/ImageServer',
  'state-gis-oahu-1943': 'https://geodata.hawaii.gov/arcgis/rest/services/SoH_Maps/Oahu_1943/ImageServer',
  'usgs-topo-2000-oahu': 'https://geodata.hawaii.gov/arcgis/rest/services/SoH_Maps/USGS_topos_2000/ImageServer',
  'usgs-topo-2000-islands': 'https://geodata.hawaii.gov/arcgis/rest/services/SoH_Maps/USGS_topos_2000/ImageServer',
  'usgs-topo-1924-maui': 'https://geodata.hawaii.gov/arcgis/rest/services/SoH_Maps/maui_topo_1924/ImageServer',
}

/**
 * Export, for every traced shape and carving zone, the sheet it was read from
 * over the shape's box, with the shape drawn back over it in red, as
 * DIR/<name>.png, at most 2000 pixels on a side and no finer than about
 * 3 m a pixel; a service in an old datum answers only fine exports, so a long
 * shape on one of them may come back blank.
 */
export async function sheetsWorks({ out, log }) {
  mkdirSync(out, { recursive: true })
  const shapes = [
    ...Object.entries(TRACED).map(([k, t]) => [k, t.sheet, t.type === 'Polygon' ? [[...t.coordinates, t.coordinates[0]]] : [t.coordinates]]),
    ...Object.entries(ZONES).map(([k, z]) => [`zone-${k}`, z.sheet, [[...z.coordinates, z.coordinates[0]]]]),
  ]
  for (const [name, sheet, lines] of shapes) {
    const svc = SHEETS[sheet]
    if (!svc) {
      log(`  ${name}: no image service for ${sheet}`)
      continue
    }
    const pts = lines.flat()
    const pad = 0.002
    const w = Math.min(...pts.map((p) => p[0])) - pad
    const e = Math.max(...pts.map((p) => p[0])) + pad
    const s = Math.min(...pts.map((p) => p[1])) - pad
    const n = Math.max(...pts.map((p) => p[1])) + pad
    const deg = Math.max(0.00003, Math.max(e - w, n - s) / 2000)
    const W = Math.round((e - w) / deg)
    const H = Math.round((n - s) / deg)
    const url = `${svc}/exportImage?bbox=${w},${s},${e},${n}&bboxSR=4326&imageSR=4326&size=${W},${H}&format=png&f=image`
    const raw = join(out, `${name}.raw.png`)
    try {
      execFileSync('curl', ['-sS', '--fail', '--max-time', '300', '-o', raw, url])
    } catch {
      log(`  ${name}: the export failed`)
      continue
    }
    const im = readPNG(raw)
    rmSync(raw)
    const rgb = new Uint8Array(W * H * 3).fill(255)
    for (let y = 0; y < Math.min(H, im.height); y++) {
      for (let x = 0; x < Math.min(W, im.width); x++) {
        const c = im.channels
        const i = (y * im.width + x) * c
        const a = c === 4 ? im.data[i + 3] / 255 : c === 2 ? im.data[i + 1] / 255 : 1
        for (let q = 0; q < 3; q++) rgb[(y * W + x) * 3 + q] = Math.round((c >= 3 ? im.data[i + q] : im.data[i]) * a + 255 * (1 - a))
      }
    }
    const put = (x, y) => {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const X = Math.round(x) + dx
          const Y = Math.round(y) + dy
          if (X < 0 || Y < 0 || X >= W || Y >= H) continue
          const k = (Y * W + X) * 3
          rgb[k] = 230
          rgb[k + 1] = 0
          rgb[k + 2] = 0
        }
      }
    }
    for (const l of lines) {
      for (let i = 1; i < l.length; i++) {
        const [x0, y0] = [(l[i - 1][0] - w) / deg, (n - l[i - 1][1]) / deg]
        const [x1, y1] = [(l[i][0] - w) / deg, (n - l[i][1]) / deg]
        const L = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0)))
        for (let t = 0; t <= L; t++) put(x0 + ((x1 - x0) * t) / L, y0 + ((y1 - y0) * t) / L)
      }
    }
    writePNG(join(out, `${name}.png`), W, H, rgb)
    log(`  ${name}.png: ${sheet}, ${W}×${H}`)
  }
}
