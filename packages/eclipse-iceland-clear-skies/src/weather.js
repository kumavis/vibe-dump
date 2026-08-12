// Multi-model cloud forecasts from Open-Meteo, sampled at each grid point's own
// mid-eclipse instant. Free API, no key, CORS-enabled — refetched periodically
// so the estimate tracks new model runs as they land.

export const MODELS = [
  { id: 'icon_seamless', label: 'ICON' },
  { id: 'gfs_seamless', label: 'GFS' },
  { id: 'ecmwf_ifs025', label: 'ECMWF' },
  { id: 'best_match', label: 'Best-match' },
]

const HOURLY_VARS = [
  'cloud_cover',
  'cloud_cover_low',
  'cloud_cover_mid',
  'cloud_cover_high',
  'precipitation',
]

const CHUNK = 50

function buildUrl(points, useHourWindow) {
  const lat = points.map((p) => p.lat.toFixed(2)).join(',')
  const lon = points.map((p) => p.lon.toFixed(2)).join(',')
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    hourly: HOURLY_VARS.join(','),
    models: MODELS.map((m) => m.id).join(','),
    timezone: 'UTC',
  })
  if (useHourWindow) {
    params.set('start_hour', '2026-08-12T11:00')
    params.set('end_hour', '2026-08-12T23:00')
  } else {
    params.set('start_date', '2026-08-12')
    params.set('end_date', '2026-08-12')
  }
  return 'https://api.open-meteo.com/v1/forecast?' + params.toString()
}

async function fetchChunkOnce(points) {
  let res = await fetch(buildUrl(points, true))
  let data = await res.json().catch(() => null)
  if (!res.ok || !data || data.error) {
    // Older API deployments may not know start_hour/end_hour — fall back.
    res = await fetch(buildUrl(points, false))
    data = await res.json()
    if (!res.ok || data.error) throw new Error(data?.reason || 'forecast fetch failed')
  }
  return Array.isArray(data) ? data : [data]
}

// A transient failure on one chunk shouldn't blank the whole map: retry with
// backoff, then surrender just that chunk (null-filled) and keep the rest.
async function fetchChunk(points) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fetchChunkOnce(points)
    } catch (err) {
      if (attempt >= 2) {
        console.error('forecast chunk failed', err)
        return points.map(() => null)
      }
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)))
    }
  }
}

function hourlySeries(hourly, variable, modelId) {
  // With multiple models requested, keys are suffixed with the model id.
  return hourly[`${variable}_${modelId}`] ?? hourly[variable] ?? null
}

function interp(timesMs, values, tMs) {
  if (!values) return null
  for (let i = 0; i < timesMs.length - 1; i++) {
    if (tMs >= timesMs[i] && tMs <= timesMs[i + 1]) {
      const a = values[i]
      const b = values[i + 1]
      if (a == null || b == null) return a ?? b ?? null
      const f = (tMs - timesMs[i]) / (timesMs[i + 1] - timesMs[i])
      return a + (b - a) * f
    }
  }
  return null
}

// Cirrus lets a lot of the show through; low stratus kills it. Weighted
// obscuration, then an extra penalty when a model has rain falling.
export function skyScore(cc) {
  if (!cc) return null
  const obscured = Math.min(
    100,
    (cc.low ?? cc.total ?? 100) + 0.7 * (cc.mid ?? 0) + 0.35 * (cc.high ?? 0),
  )
  let score = 100 - obscured
  if ((cc.precip ?? 0) >= 0.1) score -= 20
  return Math.max(0, Math.min(100, score))
}

/**
 * Fetch forecasts for grid points [{lat, lon, tMs}] where tMs is that point's
 * mid-eclipse instant (UTC ms). Resolves to an array (same order) of:
 *   { perModel: {modelId: {low, mid, high, total, precip}}, score, spread }
 * Entries can be null if every model failed for that point.
 */
export async function fetchCloudGrid(points) {
  const chunks = []
  for (let i = 0; i < points.length; i += CHUNK) chunks.push(points.slice(i, i + CHUNK))
  const responses = await Promise.all(chunks.map(fetchChunk))
  const flat = responses.flat()

  return points.map((p, i) => {
    const loc = flat[i]
    if (!loc || !loc.hourly) return null
    const timesMs = loc.hourly.time.map((t) => Date.parse(t + (t.endsWith('Z') ? '' : 'Z')))
    const perModel = {}
    const scores = []
    const totals = []
    for (const m of MODELS) {
      const at = (v) => interp(timesMs, hourlySeries(loc.hourly, v, m.id), p.tMs)
      const cc = {
        total: at('cloud_cover'),
        low: at('cloud_cover_low'),
        mid: at('cloud_cover_mid'),
        high: at('cloud_cover_high'),
        precip: at('precipitation'),
      }
      if (cc.total == null && cc.low == null) continue
      perModel[m.id] = cc
      const s = skyScore(cc)
      if (s != null) scores.push(s)
      if (cc.total != null) totals.push(cc.total)
    }
    if (!scores.length) return null
    return {
      perModel,
      score: scores.reduce((a, b) => a + b, 0) / scores.length,
      spread: totals.length > 1 ? Math.max(...totals) - Math.min(...totals) : 0,
    }
  })
}

/** Latest RainViewer frame catalog: live doppler radar + IR satellite. */
export async function fetchRainviewer() {
  const res = await fetch('https://api.rainviewer.com/public/weather-maps.json')
  if (!res.ok) throw new Error('rainviewer fetch failed')
  const data = await res.json()
  const radar = data.radar?.past?.at(-1) ?? null
  const sat = data.satellite?.infrared?.at(-1) ?? null
  return {
    host: data.host,
    radar,
    sat,
    // Color scheme 1 ("Original", green→yellow→red) keeps precipitation off
    // the blues so it never impersonates the clear-sky ramp.
    radarUrl: radar ? `${data.host}${radar.path}/256/{z}/{x}/{y}/1/1_1.png` : null,
    satUrl: sat ? `${data.host}${sat.path}/256/{z}/{x}/{y}/0/0_0.png` : null,
  }
}
