// Build a self-contained single-file version of the app with a freshly
// fetched forecast snapshot baked in, for hosts where live fetches are
// blocked (e.g. the claude.ai artifact viewer's CSP). Run after `vite build`:
//
//   node tools/standalone.mjs            → dist/artifact.html
//
// The emitted file is a page *fragment* (title/style/markup/script, no
// <html>/<body> wrapper) as the artifact pipeline expects; the app itself
// still tries live fetches first and only falls back to the snapshot.
import { readFile, writeFile, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { gridPoints } from '../src/grid.js'
import { PLACES } from '../src/places.js'
import { localCircumstances } from '../src/eclipse.js'
import { fetchCloudGrid } from '../src/weather.js'
import { DISTS_KM, rayPoints, fetchElevations, profileAngle, horizonVerdict } from '../src/terrain.js'

const pkgDir = dirname(dirname(fileURLToPath(import.meta.url)))
const distDir = join(pkgDir, 'dist')
const hzKey = (lat, lon) => lat.toFixed(3) + ',' + lon.toFixed(3)

console.log('Fetching forecast snapshot for', gridPoints.length, 'grid points…')
const cloud = await fetchCloudGrid(gridPoints)
if (!cloud.some(Boolean)) throw new Error('forecast snapshot came back empty')

console.log('Fetching terrain horizons for', PLACES.length, 'places…')
const horizons = {}
{
  const targets = PLACES.map(([name, lat, lon]) => ({ lat, lon, circ: localCircumstances(lat, lon) }))
    .filter((p) => p.circ)
  const coords = []
  for (const p of targets) coords.push([p.lat, p.lon], ...rayPoints(p.lat, p.lon, p.circ.sunAzDeg))
  const elevs = await fetchElevations(coords)
  const per = 1 + DISTS_KM.length
  targets.forEach((p, k) => {
    const base = k * per
    const ridgeDeg = profileAngle(elevs[base] ?? 0, elevs.slice(base + 1, base + per))
    horizons[hzKey(p.lat, p.lon)] = { ridgeDeg, verdict: horizonVerdict(ridgeDeg, p.circ.sunAltDeg) }
  })
}

const snapshot = { fetchedAtMs: Date.now(), cloud, horizons }

const html = await readFile(join(distDir, 'index.html'), 'utf8')
const assets = await readdir(join(distDir, 'assets'))
const jsFile = assets.find((f) => f.endsWith('.js'))
const cssFile = assets.find((f) => f.endsWith('.css'))
const js = await readFile(join(distDir, 'assets', jsFile), 'utf8')
const css = await readFile(join(distDir, 'assets', cssFile), 'utf8')

const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/)
const bodyInner = html
  .replace(/[\s\S]*<body[^>]*>/, '')
  .replace(/<\/body>[\s\S]*/, '')
  .replace(/<script[^>]*src=[^>]*><\/script>\s*/g, '')

// `</script` inside inlined code or JSON would end the tag early; the escaped
// form is byte-identical inside JS strings.
const guard = (s) => s.replaceAll('</script', '<\\/script')

const out = `<title>${titleMatch ? titleMatch[1] : 'Eclipse Clear Skies'}</title>
<style>
${css}
</style>
${bodyInner}
<script>window.__ECLIPSE_SNAPSHOT__ = ${guard(JSON.stringify(snapshot))}</script>
<script type="module">
${guard(js)}
</script>
`
await writeFile(join(distDir, 'artifact.html'), out)
console.log('Wrote dist/artifact.html —', (out.length / 1024).toFixed(0), 'KB, snapshot', new Date(snapshot.fetchedAtMs).toISOString())
