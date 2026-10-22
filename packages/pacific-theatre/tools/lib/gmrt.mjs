// GMRT, the Global Multi-Resolution Topography synthesis, for a box's sea
// floor (DATA.md §7): its GridServer's `topo` layer as ESRI ASCII at about
// the box's texel, never its land (GMRT's land is wrong by hundreds of
// metres; R1 §3.1).
//
// Taken from holo-i-ke-au's tools/lib/sources.mjs (b480c27, on
// origin/claude/funny-cannon-vy1pyf): gmrtUrl, the grid's metadata request
// for its version, ESRI ASCII rather than GeoTIFF (whose output "sometimes
// answers with an empty body"), and requests spaced out and retried, since
// GMRT builds each grid on request and under load answers 200 with nothing.
// New here: a box past 180° is two requests, either side of the meridian,
// the eastern one's longitudes shifted by +360 when read back.
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fetchTo, sleep } from './fetch.mjs'
import { readAsciiGrid } from './raster.mjs'

export const GMRT = {
  id: 'gmrt',
  title: 'Global Multi-Resolution Topography synthesis (Ryan et al. 2009)',
  service: 'https://www.gmrt.org/services/GridServer',
  url: 'https://www.gmrt.org/',
  terms: 'https://www.gmrt.org/about/terms_of_use.php',
  licence: 'cc-by-4.0',
  citation: 'Ryan, W. B. F., S. M. Carbotte, J. O. Coplan, S. O’Hara, A. Melkonian, R. Arko, R. A. Weissel, V. Ferrini, A. Goodwillie, F. Nitsche, J. Bonczkowski and R. Zemsky (2009), Global Multi-Resolution Topography synthesis, Geochem. Geophys. Geosyst. 10, Q03014, doi:10.1029/2008GC002332',
  // DATA.md §7, verbatim
  credit: 'GMRT, CC BY 4.0, resampled and clamped',
}

const f5 = (v) => v.toFixed(5)

export function gmrtUrl([w, s, e, n], mres) {
  return `${GMRT.service}?minlongitude=${f5(w)}&maxlongitude=${f5(e)}&minlatitude=${f5(s)}&maxlatitude=${f5(n)}&layer=topo&format=esriascii&mresolution=${mres}`
}
function metaUrl([w, s, e, n], mres) {
  // (no `layer` here: layer=topo would make the metadata endpoint send the grid)
  return `${GMRT.service}/metadata?minlongitude=${f5(w)}&maxlongitude=${f5(e)}&minlatitude=${f5(s)}&maxlatitude=${f5(n)}&format=esriascii&mresolution=${mres}&mformat=json`
}

/**
 * The requests for a box: its bounds (continuous longitudes) padded by
 * `pad` texels, split at 180° into pieces in GMRT's own −180..180, each with
 * the shift (0 or 360) that puts it back on the box's longitudes.
 */
export function gmrtRequests(id, grid, { pad = 3, mres } = {}) {
  const { bounds, dLon, dLat, metresPerTexel } = grid
  const b = [bounds[0] - pad * dLon, bounds[1] - pad * dLat, bounds[2] + pad * dLon, bounds[3] + pad * dLat]
  const m = mres ?? Math.max(50, Math.round(metresPerTexel[1]))
  const pieces = []
  // the box's span cut at every 180° it crosses
  for (let k = Math.floor((b[0] + 180) / 360); k <= Math.floor((b[2] + 180) / 360 - 1e-12); k++) {
    const lo = Math.max(b[0], -180 + 360 * k)
    const hi = Math.min(b[2], 180 + 360 * k)
    if (hi - lo < 1e-9) continue
    const off = 360 * k
    pieces.push({ bounds: [lo - off, b[1], hi - off, b[3]], off })
  }
  return pieces.map((p, i) => ({
    ...p,
    mres: m,
    url: gmrtUrl(p.bounds, m),
    meta: metaUrl(p.bounds, m),
    file: `gmrt/${id}${pieces.length > 1 ? `-${i}` : ''}.asc`,
    metaFile: `gmrt/${id}${pieces.length > 1 ? `-${i}` : ''}.json`,
  }))
}

/**
 * Fetch a box's GMRT pieces, spaced and retried. Returns { ok, reason }:
 * ok false when any piece failed, and the box falls back to ETOPO 15″.
 */
export function downloadGmrt(ledger, dir, id, grid, log = () => {}) {
  let fetched = false
  for (const r of gmrtRequests(id, grid)) {
    const file = join(dir, r.file)
    const known = ledger.get(file)
    if (fetched && !(known && known.url === r.url && known.bytes > 0)) sleep(5000)
    // a grid cut short (the server stops mid-stream under load) does not parse: fetched again, spaced
    let res
    for (let k = 1; k <= 3; k++) {
      try {
        res = fetchTo(ledger, r.url, file, { maxTime: 600, emptyRetries: 10, force: k > 1 })
        if (res.ok) readAsciiGrid(file, { min: -11000, max: 9000 })
        break
      } catch (e) {
        res = { ok: false, status: String(e.message).slice(0, 200) }
        if (k < 3) sleep(10000 * k)
      }
    }
    if (!res.cached) fetched = true
    if (!res.ok) {
      log(`  gmrt ${r.file}: failed (${res.status})`)
      return { ok: false, reason: `GMRT answered ${res.status}` }
    }
    try {
      fetchTo(ledger, r.meta, join(dir, r.metaFile), { maxTime: 120 })
    } catch (e) {
      log(`  gmrt ${r.metaFile}: metadata unavailable (${String(e.message).slice(0, 120)})`)
    }
    log(`  gmrt ${r.file}: ${res.cached ? 'cached' : 'fetched'} at ~${r.mres} m (${(statSync(file).size / 1e6).toFixed(1)} MB)`)
  }
  return { ok: true }
}

/** A box's GMRT pieces read back as grids on the box's longitudes (null when any is missing), with the version from the metadata. */
export function readGmrt(dir, id, grid) {
  const out = []
  let version = null
  let metres = null
  for (const r of gmrtRequests(id, grid)) {
    const file = join(dir, r.file)
    if (!existsSync(file) || statSync(file).size === 0) return null
    const g = readAsciiGrid(file, { min: -11000, max: 9000 })
    g.west += r.off
    out.push(g)
    const mf = join(dir, r.metaFile)
    if (existsSync(mf)) {
      try {
        const meta = JSON.parse(readFileSync(mf, 'utf8'))
        version ??= meta.gmrt_version ?? null
        metres ??= meta.meters_per_node ?? null
      } catch {
        // a metadata file that is not JSON (an error page) only loses the version
      }
    }
  }
  return { grids: out, version, metres, files: gmrtRequests(id, grid).map((r) => r.file), urls: gmrtRequests(id, grid).map((r) => r.url) }
}
