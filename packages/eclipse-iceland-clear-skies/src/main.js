import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './style.css'
import coastRings from './coast.js'
import { localCircumstances, totalityDurationS, umbralClearance } from './eclipse.js'
import { PLACES } from './places.js'
import { MODELS, fetchCloudGrid, fetchRainviewer, skyScore, apiReachable } from './weather.js'
import { DISTS_KM, rayPoints, fetchElevations, profileAngle, horizonVerdict } from './terrain.js'
import { GRID, gridPoints } from './grid.js'

const $ = (id) => document.getElementById(id)

// ---------------------------------------------------------------------------
// Map + base layers
// ---------------------------------------------------------------------------
const map = L.map('map', {
  center: [64.85, -22.5],
  zoom: 7,
  zoomSnap: 0.5,
  zoomControl: true,
  attributionControl: true,
})
map.attributionControl.setPrefix(false)

// Bundled coastline lives *under* the tile pane so the app still draws a map
// when tiles are unreachable (offline build screenshots, flaky venues).
map.createPane('coast').style.zIndex = 150
for (const ring of coastRings) {
  L.polygon(ring.map(([lon, lat]) => [lat, lon]), {
    pane: 'coast',
    color: '#5b6570',
    weight: 1,
    fillColor: '#232a31',
    fillOpacity: 1,
    interactive: false,
  }).addTo(map)
}

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  subdomains: 'abcd',
  maxZoom: 13,
  attribution: '&copy; OSM &copy; CARTO · forecast: Open-Meteo · radar: RainViewer · elements: NASA',
}).addTo(map)

map.createPane('clouds').style.zIndex = 320
{
  // Recolor RainViewer's blue-leaning palette to warm amber/red so rain can
  // never masquerade as the blue "clear sky" end of the forecast ramp.
  const radarPane = map.createPane('radar')
  radarPane.style.zIndex = 340
  radarPane.style.filter = 'grayscale(1) brightness(1.1) sepia(1) saturate(5) hue-rotate(-12deg)'
}
map.createPane('path').style.zIndex = 420


// ---------------------------------------------------------------------------
// Totality path (limits + centerline) from the Besselian-element engine
// ---------------------------------------------------------------------------
function computePath() {
  // Wide enough to close the western limit (over the Denmark Strait) as well
  // as the eastern one crossing Iceland.
  const lat0 = 62.5, lat1 = 67.8, dLat = 0.05
  const lon0 = -29.5, lon1 = -17.5, dLon = 0.1
  const nLat = Math.round((lat1 - lat0) / dLat) + 1
  const nLon = Math.round((lon1 - lon0) / dLon) + 1
  // Limits are contoured on the umbral *clearance* field, which is ~linear
  // across the limit; duration falls off as a square root there, so linear
  // edge interpolation on duration bows the drawn line up to ~4 km outward.
  const clr = []
  const dur = []
  for (let i = 0; i < nLat; i++) {
    const crow = []
    const drow = []
    for (let j = 0; j < nLon; j++) {
      const lat = lat0 + i * dLat, lon = lon0 + j * dLon
      const c = umbralClearance(lat, lon)
      crow.push(c)
      drow.push(c > 0 ? totalityDurationS(lat, lon) : 0)
    }
    clr.push(crow)
    dur.push(drow)
  }
  // Marching-squares segments of the clearance==0 contour → totality limits.
  const segs = []
  const cross = (a, b) => (a > 0) !== (b > 0)
  const frac = (a, b) => a / (a - b)
  for (let i = 0; i < nLat - 1; i++) {
    for (let j = 0; j < nLon - 1; j++) {
      const v00 = clr[i][j], v10 = clr[i][j + 1]
      const v01 = clr[i + 1][j], v11 = clr[i + 1][j + 1]
      const pts = []
      if (cross(v00, v10)) pts.push([lat0 + i * dLat, lon0 + (j + frac(v00, v10)) * dLon])
      if (cross(v01, v11)) pts.push([lat0 + (i + 1) * dLat, lon0 + (j + frac(v01, v11)) * dLon])
      if (cross(v00, v01)) pts.push([lat0 + (i + frac(v00, v01)) * dLat, lon0 + j * dLon])
      if (cross(v10, v11)) pts.push([lat0 + (i + frac(v10, v11)) * dLat, lon0 + (j + 1) * dLon])
      if (pts.length >= 2) segs.push([pts[0], pts[1]])
    }
  }
  // Centerline: per longitude column, latitude of maximum duration.
  const center = []
  for (let j = 0; j < nLon; j++) {
    let bi = -1, bv = 0
    for (let i = 0; i < nLat; i++) if (dur[i][j] > bv) { bv = dur[i][j]; bi = i }
    if (bi > 0 && bi < nLat - 1 && bv > 30) {
      const a = dur[bi - 1][j], b = dur[bi][j], c = dur[bi + 1][j]
      const off = (a - c) / (2 * (a - 2 * b + c) || 1)
      center.push([lat0 + (bi + off) * dLat, lon0 + j * dLon])
    }
  }
  return { segs, center }
}

const path = computePath()
L.polyline(path.segs, { pane: 'path', color: '#eda100', weight: 2, opacity: 0.9, interactive: false }).addTo(map)
L.polyline(path.center, { pane: 'path', color: '#eda100', weight: 1.5, dashArray: '6 6', opacity: 0.75, interactive: false }).addTo(map)

// ---------------------------------------------------------------------------
// Forecast grid (shared with the standalone snapshot builder)
// ---------------------------------------------------------------------------
// Optional baked-in data for environments where live fetches are blocked
// (e.g. the claude.ai artifact viewer's CSP): the app still tries live first.
const SNAP = typeof window !== 'undefined' ? window.__ECLIPSE_SNAPSHOT__ : null

const state = {
  cloud: null, // raw per-point model layers, parallel to gridPoints
  scores: null, // slant-path scores, parallel to gridPoints
  cloudFetchedAt: null,
  rain: null,
  selected: null, // {name, lat, lon}
  nextRefreshMs: null,
}

// Score color ramp: palette blue sequential, light = clear, receding to the
// dark surface for overcast. Stops are [score, r, g, b].
const RAMP = [
  [0, 26, 34, 47],
  [25, 13, 54, 107],
  [50, 28, 92, 171],
  [75, 57, 135, 229],
  [90, 134, 182, 239],
  [100, 205, 226, 251],
]
function rampColor(s) {
  for (let k = 0; k < RAMP.length - 1; k++) {
    const [s0, ...a] = RAMP[k]
    const [s1, ...b] = RAMP[k + 1]
    if (s <= s1 || k === RAMP.length - 2) {
      const f = Math.max(0, Math.min(1, (s - s0) / (s1 - s0)))
      return a.map((v, i) => Math.round(v + (b[i] - v) * f))
    }
  }
  return [0, 0, 0]
}
function rampCss(s) {
  const [r, g, b] = rampColor(s)
  return `rgb(${r},${g},${b})`
}

let cloudOverlay = null
function renderCloudOverlay() {
  if (!state.scores) return
  // Leaflet stretches an imageOverlay linearly in *Mercator* y, so a bitmap
  // whose rows are uniform in latitude lands ~6 km north at mid-grid. Render
  // per-pixel in Mercator space instead, bilinearly sampling the score field.
  const latTop = GRID.lat1 + GRID.dLat / 2
  const latBot = GRID.lat0 - GRID.dLat / 2
  const lonL = GRID.lon0 - GRID.dLon / 2
  const lonR = GRID.lon1 + GRID.dLon / 2
  const mercY = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * DEG) / 2))
  const yTop = mercY(latTop)
  const yBot = mercY(latBot)
  const W = GRID.nLon * 10
  const H = 480
  const cv = document.createElement('canvas')
  cv.width = W
  cv.height = H
  const ctx = cv.getContext('2d')
  const img = ctx.createImageData(W, H)
  const val = (i, j) => state.scores[i * GRID.nLon + j]?.score ?? null
  for (let y = 0; y < H; y++) {
    const my = yTop + (yBot - yTop) * ((y + 0.5) / H)
    const lat = (2 * Math.atan(Math.exp(my)) - Math.PI / 2) / DEG
    const fi = (lat - GRID.lat0) / GRID.dLat
    const i0 = Math.max(0, Math.min(GRID.nLat - 1, Math.floor(fi)))
    const i1 = Math.min(i0 + 1, GRID.nLat - 1)
    const wi = Math.max(0, Math.min(1, fi - i0))
    for (let x = 0; x < W; x++) {
      const lon = lonL + (lonR - lonL) * ((x + 0.5) / W)
      const fj = (lon - GRID.lon0) / GRID.dLon
      const j0 = Math.max(0, Math.min(GRID.nLon - 1, Math.floor(fj)))
      const j1 = Math.min(j0 + 1, GRID.nLon - 1)
      const wj = Math.max(0, Math.min(1, fj - j0))
      let sum = 0
      let wsum = 0
      for (const [i, j, w] of [
        [i0, j0, (1 - wi) * (1 - wj)],
        [i0, j1, (1 - wi) * wj],
        [i1, j0, wi * (1 - wj)],
        [i1, j1, wi * wj],
      ]) {
        const v = val(i, j)
        if (v == null) continue
        sum += v * w
        wsum += w
      }
      const px = (y * W + x) * 4
      if (wsum < 0.05) { img.data[px + 3] = 0; continue }
      const [r, g, b] = rampColor(sum / wsum)
      img.data[px] = r
      img.data[px + 1] = g
      img.data[px + 2] = b
      img.data[px + 3] = 168
    }
  }
  ctx.putImageData(img, 0, 0)
  const bounds = [[latBot, lonL], [latTop, lonR]]
  const url = cv.toDataURL()
  const opacity = $('toggle-clouds').checked ? 0.66 : 0
  if (cloudOverlay) {
    cloudOverlay.setUrl(url)
    cloudOverlay.setOpacity(opacity)
  } else {
    cloudOverlay = L.imageOverlay(url, bounds, { pane: 'clouds', opacity, interactive: false, className: 'cloud-img' }).addTo(map)
  }
}

function nearestCell(lat, lon) {
  if (!state.cloud) return null
  const i = Math.round((lat - GRID.lat0) / GRID.dLat)
  const j = Math.round((lon - GRID.lon0) / GRID.dLon)
  if (i < 0 || j < 0 || i >= GRID.nLat || j >= GRID.nLon) return null
  return state.cloud[i * GRID.nLon + j]
}

// Null-tolerant bilinear sample of one model's cloud layer across the grid.
function layerAt(lat, lon, modelId, layer) {
  if (!state.cloud) return null
  const fi = Math.min(GRID.nLat - 1, Math.max(0, (lat - GRID.lat0) / GRID.dLat))
  const fj = Math.min(GRID.nLon - 1, Math.max(0, (lon - GRID.lon0) / GRID.dLon))
  const i0 = Math.floor(fi), i1 = Math.min(i0 + 1, GRID.nLat - 1)
  const j0 = Math.floor(fj), j1 = Math.min(j0 + 1, GRID.nLon - 1)
  const wi = fi - i0, wj = fj - j0
  let sum = 0, wsum = 0
  for (const [i, j, w] of [
    [i0, j0, (1 - wi) * (1 - wj)],
    [i0, j1, (1 - wi) * wj],
    [i1, j0, wi * (1 - wj)],
    [i1, j1, wi * wj],
  ]) {
    const v = state.cloud[i * GRID.nLon + j]?.perModel?.[modelId]?.[layer]
    if (v == null) continue
    sum += v * w
    wsum += w
  }
  return wsum > 0 ? sum / wsum : null
}

// The sun is only ~25° up: each cloud layer is crossed at its own horizontal
// offset along the sun's azimuth, so a clear zenith with a cloud bank to the
// WSW still hides the eclipse. Typical layer heights: low ~1.2 km (crossed
// ~3 km away), mid ~4.5 km (~10 km), high ~8.5 km (~18 km).
const LAYER_KM = { low: 1.2, mid: 4.5, high: 8.5 }
const DEG = Math.PI / 180

const inGrid = (lat, lon) =>
  lat >= GRID.lat0 - GRID.dLat && lat <= GRID.lat1 + GRID.dLat &&
  lon >= GRID.lon0 - GRID.dLon && lon <= GRID.lon1 + GRID.dLon

function scoreToward(lat, lon, altDeg, azDeg) {
  if (!state.cloud) return null
  // Outside the grid the clamped bilinear would fabricate confident numbers
  // from the nearest edge, potentially hundreds of km away.
  if (!inGrid(lat, lon)) return null
  const tanA = Math.tan(Math.max(5, altDeg) * DEG)
  const azR = azDeg * DEG
  const offPt = (hKm) => {
    const d = hKm / tanA
    return [lat + (d * Math.cos(azR)) / 111.32, lon + (d * Math.sin(azR)) / (111.32 * Math.cos(lat * DEG))]
  }
  const near = nearestCell(lat, lon)
  const perModel = {}
  const scores = []
  for (const m of MODELS) {
    const [laL, loL] = offPt(LAYER_KM.low)
    const [laM, loM] = offPt(LAYER_KM.mid)
    const [laH, loH] = offPt(LAYER_KM.high)
    const cc = {
      low: layerAt(laL, loL, m.id, 'low'),
      mid: layerAt(laM, loM, m.id, 'mid'),
      high: layerAt(laH, loH, m.id, 'high'),
      precip: near?.perModel?.[m.id]?.precip ?? null,
      total: near?.perModel?.[m.id]?.total ?? null,
    }
    if (cc.low == null && cc.mid == null && cc.high == null) continue
    perModel[m.id] = cc
    scores.push(skyScore(cc))
  }
  if (!scores.length) return null
  return {
    perModel,
    score: scores.reduce((a, b) => a + b, 0) / scores.length,
    spread: scores.length > 1 ? Math.max(...scores) - Math.min(...scores) : 0,
  }
}

const scoreForCirc = (lat, lon, circ) =>
  scoreToward(lat, lon, circ?.sunAltDeg ?? 25, circ?.sunAzDeg ?? 251)

// ---------------------------------------------------------------------------
// Radar / satellite overlays
// ---------------------------------------------------------------------------
let radarLayer = null
let satLayer = null
let appliedRain = { radar: null, sat: null }
function applyRainLayers() {
  const r = state.rain
  if (!r) return
  // Rebuild a layer only when its URL or toggle actually changed — a rebuild
  // refetches every visible tile and blinks the layer.
  const wantRadar = r.radarUrl && $('toggle-radar').checked ? r.radarUrl : null
  const wantSat = r.satUrl && $('toggle-sat').checked ? r.satUrl : null
  if (wantRadar !== appliedRain.radar) {
    if (radarLayer) { map.removeLayer(radarLayer); radarLayer = null }
    if (wantRadar) radarLayer = L.tileLayer(wantRadar, { pane: 'radar', opacity: 0.8, maxZoom: 13 }).addTo(map)
    appliedRain.radar = wantRadar
  }
  if (wantSat !== appliedRain.sat) {
    if (satLayer) { map.removeLayer(satLayer); satLayer = null }
    if (wantSat) satLayer = L.tileLayer(wantSat, { pane: 'radar', opacity: 0.4, maxZoom: 13 }).addTo(map)
    appliedRain.sat = wantSat
  }
  const t = (f) => (f ? new Date(f.time * 1000).toISOString().slice(11, 16) + 'Z' : '—')
  $('radar-time').textContent = t(r.radar)
  $('sat-time').textContent = t(r.sat)
  // RainViewer has been shipping an empty satellite catalog — hide the toggle
  // rather than offer a dead layer (it reappears if the feed comes back).
  $('toggle-sat').closest('label').style.display = r.satUrl ? '' : 'none'
}

// ---------------------------------------------------------------------------
// Selection + details panel
// ---------------------------------------------------------------------------
const fmtT = (ms) => (ms == null ? '—' : new Date(ms).toISOString().slice(11, 19) + ' UTC')
const WINDS = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
const compass = (az) => WINDS[Math.round(az / 22.5) % 16]

// ---------------------------------------------------------------------------
// Terrain horizon toward the low Sun (~25° up): checked per spot via DEM.
// ---------------------------------------------------------------------------
const horizonCache = new Map()
const hzKey = (lat, lon) => lat.toFixed(3) + ',' + lon.toFixed(3)

async function horizonFor(lat, lon, circ) {
  if (!circ) return null
  const key = hzKey(lat, lon)
  if (horizonCache.has(key)) return horizonCache.get(key)
  const pts = [[lat, lon], ...rayPoints(lat, lon, circ.sunAzDeg)]
  const elevs = await fetchElevations(pts)
  const ridgeDeg = profileAngle(elevs[0] ?? 0, elevs.slice(1))
  const h = { ridgeDeg, verdict: horizonVerdict(ridgeDeg, circ.sunAltDeg) }
  horizonCache.set(key, h)
  // Keep the ranking's flags in step when the spot is one of the named places.
  const place = placeCirc.find((p) => hzKey(p.lat, p.lon) === key)
  if (place) {
    place.horizon = h
    renderRanking()
  }
  return h
}

function applySnapshotHorizons() {
  if (!SNAP?.horizons) return false
  for (const p of placeCirc) {
    const h = SNAP.horizons[hzKey(p.lat, p.lon)]
    if (h) {
      p.horizon = h
      horizonCache.set(hzKey(p.lat, p.lon), h)
    }
  }
  renderRanking()
  renderDetails()
  return true
}

let horizonsRunning = false
async function computePlaceHorizons() {
  if (horizonsRunning || placeCirc.some((p) => p.horizon)) return
  if (state.snapshotMode && applySnapshotHorizons()) return
  horizonsRunning = true
  try {
    const targets = placeCirc.filter((p) => p.circ)
    const coords = []
    for (const p of targets) coords.push([p.lat, p.lon], ...rayPoints(p.lat, p.lon, p.circ.sunAzDeg))
    const elevs = await fetchElevations(coords)
    const per = 1 + DISTS_KM.length
    targets.forEach((p, k) => {
      const base = k * per
      const ridgeDeg = profileAngle(elevs[base] ?? 0, elevs.slice(base + 1, base + per))
      p.horizon = { ridgeDeg, verdict: horizonVerdict(ridgeDeg, p.circ.sunAltDeg) }
      horizonCache.set(hzKey(p.lat, p.lon), p.horizon)
    })
    renderRanking()
    renderDetails()
  } catch (err) {
    console.error('horizon check failed', err)
    applySnapshotHorizons()
  } finally {
    horizonsRunning = false
  }
}
const fmtDur = (s) => (s >= 60 ? `${Math.floor(s / 60)}m ${String(Math.round(s % 60)).padStart(2, '0')}s` : `${Math.round(s)}s`)

let selMarker = null
function select(name, lat, lon, pan = false) {
  lon = ((lon + 180) % 360 + 360) % 360 - 180 // unwrap world-copy clicks
  state.selected = { name, lat, lon, circ: localCircumstances(lat, lon) }
  if (selMarker) map.removeLayer(selMarker)
  selMarker = L.circleMarker([lat, lon], {
    pane: 'path', radius: 7, color: '#ffffff', weight: 2, fillColor: '#eda100', fillOpacity: 0.9,
    interactive: false,
  }).addTo(map)
  if (pan) map.panTo([lat, lon])
  renderDetails()
  renderCountdown()
  const cachedHz = horizonCache.get(hzKey(lat, lon))
  if (state.selected.circ && (!cachedHz || (cachedHz.verdict === 'unknown' && !state.snapshotMode))) {
    const key = hzKey(lat, lon)
    horizonCache.delete(key) // let a transient failure be retried
    if (state.snapshotMode) {
      // No API here — don't pretend a check is coming for arbitrary spots.
      horizonCache.set(key, { ridgeDeg: null, verdict: 'unknown' })
      renderDetails()
    } else {
      horizonFor(lat, lon, state.selected.circ)
        .catch(() => horizonCache.set(key, { ridgeDeg: null, verdict: 'unknown' }))
        .then(() => { if (state.selected && hzKey(state.selected.lat, state.selected.lon) === key) renderDetails() })
    }
  }
}

function renderDetails() {
  const s = state.selected
  if (!s) return
  $('sel-name').textContent = s.name
  $('sel-coords').textContent = `${s.lat.toFixed(3)}°N ${(-s.lon).toFixed(3)}°W`
  const c = s.circ
  if (!c) {
    $('sel-circ').innerHTML = '<p class="muted">No eclipse visible here — the eclipsed sun is below the horizon or misses this spot entirely.</p>'
    $('sel-clouds').innerHTML = ''
    return
  }
  const rows = [
    ['Partial begins (C1)', fmtT(c.c1UtcMs)],
    ['Totality begins (C2)', c.total ? fmtT(c.c2UtcMs) : '— (partial only)'],
    ['Maximum', fmtT(c.maxUtcMs)],
    ['Totality ends (C3)', c.total ? fmtT(c.c3UtcMs) : '—'],
    ['Partial ends (C4)', fmtT(c.c4UtcMs)],
    ['Totality duration', c.total ? fmtDur(c.totalityS) : 'outside path'],
    ['Magnitude', c.magnitude.toFixed(3)],
    ['Sun position', `${c.sunAltDeg.toFixed(1)}° high · ${compass(c.sunAzDeg)} (${Math.round(c.sunAzDeg)}°)`],
  ]
  const hz = horizonCache.get(hzKey(s.lat, s.lon))
  if (hz) {
    const label =
      hz.verdict === 'unknown'
        ? 'terrain check unavailable here'
        : hz.verdict === 'blocked'
          ? `⛔ ridge ~${hz.ridgeDeg.toFixed(0)}° — likely hides the Sun`
          : hz.verdict === 'tight'
            ? `⚠ ridge ~${hz.ridgeDeg.toFixed(0)}° vs sun ${c.sunAltDeg.toFixed(0)}° — tight`
            : `open (ridge ≤ ${Math.max(0, hz.ridgeDeg).toFixed(1)}°)`
    rows.push([`Horizon toward ${compass(c.sunAzDeg)}`, label])
  } else {
    rows.push([`Horizon toward ${compass(c.sunAzDeg)}`, 'checking terrain…'])
  }
  $('sel-circ').innerHTML = rows
    .map(([k, v]) => `<div class="row"><span>${k}</span><b>${v}</b></div>`)
    .join('')

  const cl = scoreForCirc(s.lat, s.lon, c)
  if (!cl) {
    $('sel-clouds').innerHTML = state.cloud && !inGrid(s.lat, s.lon)
      ? '<p class="muted">Outside the cloud-forecast grid (western Iceland).</p>'
      : '<p class="muted">Forecast loading…</p>'
    return
  }
  const head = `<div class="score-line"><span class="chip" style="background:${rampCss(cl.score)}"></span>
    <b>${Math.round(cl.score)}</b>/100 sun-visibility score at mid-eclipse
    <span class="muted">(model spread ±${Math.round(cl.spread / 2)})</span></div>
    <p class="muted slant-note">Cloud sampled along the line of sight to the ${compass(c.sunAzDeg)} sun
    — each layer at its own slant offset, not overhead.</p>`
  const table = ['<table class="models"><tr><th>model</th><th>low</th><th>mid</th><th>high</th><th>score</th></tr>']
  for (const m of MODELS) {
    const cc = cl.perModel[m.id]
    if (!cc) continue
    const pc = (v) => (v == null ? '—' : Math.round(v) + '%')
    table.push(`<tr><td>${m.label}</td><td>${pc(cc.low)}</td><td>${pc(cc.mid)}</td><td>${pc(cc.high)}</td><td><b>${Math.round(skyScore(cc))}</b></td></tr>`)
  }
  table.push('</table>')
  const rain = Object.values(cl.perModel).some((cc) => (cc.precip ?? 0) >= 0.1)
  const warn = rain
    ? '<div class="warn">⚠ <b>Precipitation</b> forecast here at eclipse time by at least one model.</div>'
    : ''
  $('sel-clouds').innerHTML = head + table.join('') + warn
}

// ---------------------------------------------------------------------------
// Countdown
// ---------------------------------------------------------------------------
function renderCountdown() {
  const s = state.selected
  const el = $('countdown')
  if (!s || !s.circ) { el.textContent = ''; return }
  const c = s.circ
  const now = Date.now()
  const left = (ms) => {
    const d = Math.max(0, Math.round((ms - now) / 1000))
    const h = Math.floor(d / 3600), m = Math.floor((d % 3600) / 60), sec = d % 60
    return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }
  let html
  if (c.c1UtcMs && now < c.c1UtcMs) {
    html = `Partial begins at <b>${s.name}</b> in <b class="big">${left(c.c1UtcMs)}</b>`
    if (c.total) html += ` · totality in ${left(c.c2UtcMs)}`
  } else if (c.total && now < c.c2UtcMs) {
    html = `☀️ Partial underway — <b>TOTALITY</b> at <b>${s.name}</b> in <b class="big">${left(c.c2UtcMs)}</b>`
  } else if (c.total && now <= c.c3UtcMs) {
    html = `🌑 <b class="big now">TOTALITY NOW</b> at ${s.name} — ${left(c.c3UtcMs)} left`
  } else if (!c.total && c.maxUtcMs && now < c.maxUtcMs) {
    html = `Maximum (partial, mag ${c.magnitude.toFixed(2)}) at <b>${s.name}</b> in <b class="big">${left(c.maxUtcMs)}</b>`
  } else if (c.c4UtcMs && now < c.c4UtcMs) {
    html = c.total
      ? `Totality done here — partial ends in <b class="big">${left(c.c4UtcMs)}</b>`
      : `Maximum passed (partial only here) — eclipse ends in <b class="big">${left(c.c4UtcMs)}</b>`
  } else {
    html = `Eclipse over at ${s.name}. See you in 2027.`
  }
  el.innerHTML = html
}

// ---------------------------------------------------------------------------
// Best-spots ranking
// ---------------------------------------------------------------------------
const placeCirc = PLACES.map(([name, lat, lon]) => ({ name, lat, lon, circ: localCircumstances(lat, lon) }))

function renderRanking() {
  const rows = placeCirc
    .map((p) => ({ ...p, cloud: scoreForCirc(p.lat, p.lon, p.circ) }))
    .sort((a, b) => {
      const at = a.circ?.total ? 1 : 0, bt = b.circ?.total ? 1 : 0
      if (at !== bt) return bt - at
      // A terrain-blocked sun trumps clouds: you can't see through a mountain.
      const ah = a.horizon?.verdict === 'blocked' ? 0 : 1
      const bh = b.horizon?.verdict === 'blocked' ? 0 : 1
      if (ah !== bh) return bh - ah
      const as = a.cloud?.score ?? -1, bs = b.cloud?.score ?? -1
      if (Math.round(as) !== Math.round(bs)) return bs - as
      return (b.circ?.totalityS ?? 0) - (a.circ?.totalityS ?? 0)
    })
  $('ranking').innerHTML = rows
    .map((p) => {
      const dur = p.circ?.total ? fmtDur(p.circ.totalityS) : 'partial'
      const score = p.cloud ? Math.round(p.cloud.score) : '…'
      const chip = p.cloud ? `style="background:${rampCss(p.cloud.score)}"` : ''
      const hzMark =
        p.horizon && p.horizon.verdict !== 'clear'
          ? `<span title="Terrain toward the low sun: ridge ~${p.horizon.ridgeDeg.toFixed(0)}° (${p.horizon.verdict})">⛰</span> `
          : ''
      return `<button class="rank-row" data-lat="${p.lat}" data-lon="${p.lon}" data-name="${p.name}">
        <span class="chip" ${chip}></span>
        <span class="rank-name">${hzMark}${p.name}</span>
        <span class="rank-dur ${p.circ?.total ? '' : 'muted'}">${dur}</span>
        <span class="rank-score">${score}</span>
      </button>`
    })
    .join('')
  for (const btn of $('ranking').querySelectorAll('.rank-row')) {
    btn.addEventListener('click', () =>
      select(btn.dataset.name, +btn.dataset.lat, +btn.dataset.lon, true))
  }
}

// ---------------------------------------------------------------------------
// Refresh loop
// ---------------------------------------------------------------------------
const FORECAST_EVERY = 10 * 60 * 1000
const RADAR_EVERY = 5 * 60 * 1000

function useSnapshot() {
  state.cloud = SNAP.cloud
  state.scores = gridPoints.map((p) => scoreToward(p.lat, p.lon, p.alt, p.az))
  state.cloudFetchedAt = SNAP.fetchedAtMs
  state.snapshotMode = true
  renderCloudOverlay()
  renderRanking()
  renderDetails()
}

async function refreshForecast() {
  if (state.refreshing) return // rate-limit backoffs can outlive the interval
  state.refreshing = true
  $('status').textContent = 'Fetching cloud forecast…'
  try {
    // If fetches are blocked here (offline, sandboxed viewer) and we carry a
    // baked snapshot, show it immediately rather than riding the retry ladder.
    if (!state.cloud && SNAP?.cloud && !(await apiReachable())) {
      useSnapshot()
      state.nextRefreshMs = Date.now() + FORECAST_EVERY
      return
    }
    const cloud = await fetchCloudGrid(gridPoints)
    if (!cloud.some(Boolean)) throw new Error('no forecast data returned')
    state.cloud = cloud
    state.scores = gridPoints.map((p) => scoreToward(p.lat, p.lon, p.alt, p.az))
    state.cloudFetchedAt = Date.now()
    state.snapshotMode = false
    state.lastRefreshFailed = false
    renderCloudOverlay()
    renderRanking()
    renderDetails()
    // A failed startup horizon batch gets another chance each cycle.
    if (!placeCirc.some((p) => p.horizon)) computePlaceHorizons()
  } catch (err) {
    console.error(err)
    state.lastRefreshFailed = true
    if (!state.cloud && SNAP?.cloud) {
      useSnapshot()
    } else if (!state.cloud) {
      $('status').textContent = 'Forecast fetch failed — retrying at next cycle.'
    }
  } finally {
    state.refreshing = false
    state.nextRefreshMs = Date.now() + FORECAST_EVERY
  }
}

async function refreshRadar() {
  try {
    state.rain = await fetchRainviewer()
    applyRainLayers()
  } catch (err) {
    console.error(err)
  }
}

function renderStatus() {
  if (!state.cloudFetchedAt || state.refreshing) return
  const failNote = state.lastRefreshFailed && !state.snapshotMode ? ' · latest refresh failed, retrying' : ''
  const age = Math.round((Date.now() - state.cloudFetchedAt) / 1000)
  const stamp = new Date(state.cloudFetchedAt).toISOString().slice(11, 16)
  const next = state.nextRefreshMs ? Math.max(0, Math.round((state.nextRefreshMs - Date.now()) / 1000)) : 0
  $('status').textContent = state.snapshotMode
    ? `Live fetch unavailable here — showing forecast snapshot from ${stamp} UTC ` +
      `(${Math.floor(age / 60)}m old) · retrying live in ${Math.floor(next / 60)}:${String(next % 60).padStart(2, '0')}`
    : `Forecast updated ${stamp} UTC ` +
      `(${Math.floor(age / 60)}m ago) · auto-refresh in ${Math.floor(next / 60)}:${String(next % 60).padStart(2, '0')}` +
      failNote
}

$('toggle-radar').addEventListener('change', applyRainLayers)
$('toggle-sat').addEventListener('change', applyRainLayers)
$('toggle-clouds').addEventListener('change', (e) => {
  if (cloudOverlay) cloudOverlay.setOpacity(e.target.checked ? 0.66 : 0)
})
$('refresh-now').addEventListener('click', () => { refreshForecast(); refreshRadar() })

map.on('click', (e) => select('Custom spot', e.latlng.lat, e.latlng.lng))
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && state.nextRefreshMs && Date.now() > state.nextRefreshMs) {
    refreshForecast()
    refreshRadar()
  }
})

// Legend gradient
{
  const g = $('legend-bar')
  const stops = []
  for (let s = 0; s <= 100; s += 10) stops.push(`${rampCss(s)} ${s}%`)
  g.style.background = `linear-gradient(to right, ${stops.join(',')})`
}

select('Reykjavík', 64.1466, -21.9426)
// Horizons wait for the forecast so snapshot mode is known (and the API
// isn't hit with both bursts at once).
refreshForecast().then(computePlaceHorizons)
refreshRadar()
setInterval(refreshForecast, FORECAST_EVERY)
setInterval(refreshRadar, RADAR_EVERY)
setInterval(() => { renderCountdown(); renderStatus() }, 1000)
