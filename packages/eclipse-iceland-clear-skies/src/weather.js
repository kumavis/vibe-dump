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
  let res = await fetch(buildUrl(points, true), { signal: AbortSignal.timeout(15000) })
  let data = await res.json().catch(() => null)
  if (!res.ok || !data || data.error) {
    // Fall back to the date-window URL only when the API rejected the
    // start_hour params themselves — retrying other failures (429s, 5xx)
    // with a second full request would just deepen a rate limit.
    const reason = data?.reason ?? ''
    if (!/start_hour|end_hour/i.test(reason)) {
      throw new Error(reason || `forecast fetch failed (${res.status})`)
    }
    res = await fetch(buildUrl(points, false), { signal: AbortSignal.timeout(15000) })
    data = await res.json()
    if (!res.ok || data.error) throw new Error(data?.reason || 'forecast fetch failed')
  }
  return Array.isArray(data) ? data : [data]
}

/** Quick reachability probe so hosts that block external fetches (offline,
 * sandboxed viewers) can fall back to baked data fast instead of riding out
 * the retry ladder. */
export async function apiReachable() {
  try {
    const res = await fetch('https://api.open-meteo.com/v1/elevation?latitude=64&longitude=-22', {
      signal: AbortSignal.timeout(4000),
    })
    return res.ok
  } catch {
    return false
  }
}

// A transient failure on one chunk shouldn't blank the whole map: retry with
// backoff — a full minute (plus jitter) for rate-limit errors, since the API
// quota is per-minute — then surrender just that chunk (null-filled).
async function fetchChunk(points) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fetchChunkOnce(points)
    } catch (err) {
      if (attempt >= 2) {
        console.error('forecast chunk failed', err)
        return points.map(() => null)
      }
      const rateLimited = /limit/i.test(err?.message ?? '')
      const delay = rateLimited ? 61000 + Math.random() * 10000 : 1500 * (attempt + 1)
      await new Promise((r) => setTimeout(r, delay))
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

// Hourly precipitation labeled t is the accumulation over (t-1h, t]; the value
// covering an instant is the next label at-or-after it, not a blend.
function coveringValue(timesMs, values, tMs) {
  if (!values) return null
  for (let i = 0; i < timesMs.length; i++) {
    if (timesMs[i] >= tMs) return values[i]
  }
  return null
}

// Cirrus lets a lot of the show through; low stratus kills it. Weighted
// obscuration, then an extra penalty when a model has rain falling.
// Returns null when the model gave us nothing usable — never guess a sky.
export function skyScore(cc) {
  if (!cc) return null
  let obscured
  if (cc.low != null) {
    obscured = Math.min(100, cc.low + 0.7 * (cc.mid ?? 0) + 0.35 * (cc.high ?? 0))
  } else if (cc.total != null) {
    // No layer breakdown: total already includes mid/high, so use it alone
    // (conservatively weighted as fully blocking) rather than double-count.
    obscured = cc.total
  } else {
    return null
  }
  let score = 100 - obscured
  if ((cc.precip ?? 0) >= 0.1) score -= 20
  return Math.max(0, Math.min(100, score))
}

/**
 * Fetch forecasts for grid points [{lat, lon, tMs}] where tMs is that point's
 * mid-eclipse instant (UTC ms). Resolves to an array (same order) of
 * { perModel: {modelId: {low, mid, high, total, precip}} } — scoring happens
 * downstream where the slant-path geometry lives. Entries are null when every
 * model failed for that point.
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
    for (const m of MODELS) {
      const at = (v) => interp(timesMs, hourlySeries(loc.hourly, v, m.id), p.tMs)
      const cc = {
        total: at('cloud_cover'),
        low: at('cloud_cover_low'),
        mid: at('cloud_cover_mid'),
        high: at('cloud_cover_high'),
        precip: coveringValue(timesMs, hourlySeries(loc.hourly, 'precipitation', m.id), p.tMs),
      }
      if (cc.total == null && cc.low == null) continue
      perModel[m.id] = cc
    }
    return Object.keys(perModel).length ? { perModel } : null
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
