import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './style.css'
import coastRings from './coast.js'
import { localCircumstances, totalityDurationS } from './eclipse.js'
import { PLACES } from './places.js'
import { MODELS, fetchCloudGrid, fetchRainviewer, skyScore } from './weather.js'
import { DISTS_KM, rayPoints, fetchElevations, profileAngle, horizonVerdict } from './terrain.js'

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
map.createPane('radar').style.zIndex = 340
map.createPane('path').style.zIndex = 420

// ---------------------------------------------------------------------------
// Totality path (limits + centerline) from the Besselian-element engine
// ---------------------------------------------------------------------------
function computePath() {
  const lat0 = 62.9, lat1 = 67.3, dLat = 0.05
  const lon0 = -26.8, lon1 = -17.5, dLon = 0.1
  const nLat = Math.round((lat1 - lat0) / dLat) + 1
  const nLon = Math.round((lon1 - lon0) / dLon) + 1
  const dur = []
  for (let i = 0; i < nLat; i++) {
    const row = []
    for (let j = 0; j < nLon; j++) row.push(totalityDurationS(lat0 + i * dLat, lon0 + j * dLon))
    dur.push(row)
  }
  // Marching-squares segments of the duration==0 contour → totality limits.
  const segs = []
  const cross = (a, b) => (a > 0) !== (b > 0)
  const frac = (a, b) => a / (a - b)
  for (let i = 0; i < nLat - 1; i++) {
    for (let j = 0; j < nLon - 1; j++) {
      const v00 = dur[i][j] - 0.5, v10 = dur[i][j + 1] - 0.5
      const v01 = dur[i + 1][j] - 0.5, v11 = dur[i + 1][j + 1] - 0.5
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
// Forecast grid
// ---------------------------------------------------------------------------
const GRID = { lat0: 63.4, lat1: 66.6, dLat: 0.2, lon0: -25.4, lon1: -18.2, dLon: 0.4 }
const gridPoints = []
{
  const nLat = Math.round((GRID.lat1 - GRID.lat0) / GRID.dLat) + 1
  const nLon = Math.round((GRID.lon1 - GRID.lon0) / GRID.dLon) + 1
  GRID.nLat = nLat
  GRID.nLon = nLon
  for (let i = 0; i < nLat; i++) {
    for (let j = 0; j < nLon; j++) {
      const lat = GRID.lat0 + i * GRID.dLat
      const lon = GRID.lon0 + j * GRID.dLon
      const circ = localCircumstances(lat, lon)
      gridPoints.push({ lat, lon, i, j, tMs: circ ? circ.maxUtcMs : Date.UTC(2026, 7, 12, 17, 46) })
    }
  }
}

const state = {
  cloud: null, // array parallel to gridPoints
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
  if (!state.cloud) return
  const cv = document.createElement('canvas')
  cv.width = GRID.nLon
  cv.height = GRID.nLat
  const ctx = cv.getContext('2d')
  const img = ctx.createImageData(GRID.nLon, GRID.nLat)
  for (const p of gridPoints) {
    const c = state.cloud[p.i * GRID.nLon + p.j]
    const px = ((GRID.nLat - 1 - p.i) * GRID.nLon + p.j) * 4
    if (!c) { img.data[px + 3] = 0; continue }
    const [r, g, b] = rampColor(c.score)
    img.data[px] = r
    img.data[px + 1] = g
    img.data[px + 2] = b
    img.data[px + 3] = 168
  }
  ctx.putImageData(img, 0, 0)
  // Upscale with smoothing so cells blend into a field rather than blocks.
  const cv2 = document.createElement('canvas')
  cv2.width = GRID.nLon * 16
  cv2.height = GRID.nLat * 16
  const ctx2 = cv2.getContext('2d')
  ctx2.imageSmoothingEnabled = true
  ctx2.imageSmoothingQuality = 'high'
  ctx2.drawImage(cv, 0, 0, cv2.width, cv2.height)
  const bounds = [
    [GRID.lat0 - GRID.dLat / 2, GRID.lon0 - GRID.dLon / 2],
    [GRID.lat1 + GRID.dLat / 2, GRID.lon1 + GRID.dLon / 2],
  ]
  const url = cv2.toDataURL()
  if (cloudOverlay) cloudOverlay.setUrl(url)
  else cloudOverlay = L.imageOverlay(url, bounds, { pane: 'clouds', opacity: 0.66, interactive: false, className: 'cloud-img' }).addTo(map)
}

function cloudAt(lat, lon) {
  if (!state.cloud) return null
  const i = Math.round((lat - GRID.lat0) / GRID.dLat)
  const j = Math.round((lon - GRID.lon0) / GRID.dLon)
  if (i < 0 || j < 0 || i >= GRID.nLat || j >= GRID.nLon) return null
  return state.cloud[i * GRID.nLon + j]
}

// ---------------------------------------------------------------------------
// Radar / satellite overlays
// ---------------------------------------------------------------------------
let radarLayer = null
let satLayer = null
function applyRainLayers() {
  const r = state.rain
  if (!r) return
  if (radarLayer) { map.removeLayer(radarLayer); radarLayer = null }
  if (satLayer) { map.removeLayer(satLayer); satLayer = null }
  if (r.radarUrl && $('toggle-radar').checked) {
    radarLayer = L.tileLayer(r.radarUrl, { pane: 'radar', opacity: 0.8, maxZoom: 13 }).addTo(map)
  }
  if (r.satUrl && $('toggle-sat').checked) {
    satLayer = L.tileLayer(r.satUrl, { pane: 'radar', opacity: 0.4, maxZoom: 13 }).addTo(map)
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
  return h
}

async function computePlaceHorizons() {
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
  }
}
const fmtDur = (s) => (s >= 60 ? `${Math.floor(s / 60)}m ${String(Math.round(s % 60)).padStart(2, '0')}s` : `${Math.round(s)}s`)

let selMarker = null
function select(name, lat, lon, pan = false) {
  state.selected = { name, lat, lon, circ: localCircumstances(lat, lon) }
  if (selMarker) map.removeLayer(selMarker)
  selMarker = L.circleMarker([lat, lon], {
    pane: 'path', radius: 7, color: '#ffffff', weight: 2, fillColor: '#eda100', fillOpacity: 0.9,
  }).addTo(map)
  if (pan) map.panTo([lat, lon])
  renderDetails()
  renderCountdown()
  if (state.selected.circ && !horizonCache.has(hzKey(lat, lon))) {
    const key = hzKey(lat, lon)
    horizonFor(lat, lon, state.selected.circ)
      .then(() => { if (state.selected && hzKey(state.selected.lat, state.selected.lon) === key) renderDetails() })
      .catch(() => {})
  }
}

function renderDetails() {
  const s = state.selected
  if (!s) return
  $('sel-name').textContent = s.name
  $('sel-coords').textContent = `${s.lat.toFixed(3)}°N ${(-s.lon).toFixed(3)}°W`
  const c = s.circ
  if (!c) {
    $('sel-circ').innerHTML = '<p class="muted">No eclipse visible here.</p>'
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
      hz.verdict === 'blocked'
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

  const cl = cloudAt(s.lat, s.lon)
  if (!cl) {
    $('sel-clouds').innerHTML = '<p class="muted">Forecast loading…</p>'
    return
  }
  const head = `<div class="score-line"><span class="chip" style="background:${rampCss(cl.score)}"></span>
    <b>${Math.round(cl.score)}</b>/100 clear-sky score at this spot's mid-eclipse
    <span class="muted">(model spread ±${Math.round(cl.spread / 2)}%)</span></div>`
  const table = ['<table class="models"><tr><th>model</th><th>low</th><th>mid</th><th>high</th><th>total</th><th>score</th></tr>']
  for (const m of MODELS) {
    const cc = cl.perModel[m.id]
    if (!cc) continue
    const pc = (v) => (v == null ? '—' : Math.round(v) + '%')
    table.push(`<tr><td>${m.label}</td><td>${pc(cc.low)}</td><td>${pc(cc.mid)}</td><td>${pc(cc.high)}</td><td>${pc(cc.total)}</td><td><b>${Math.round(skyScore(cc))}</b></td></tr>`)
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
    html = `Totality done here — partial ends in <b class="big">${left(c.c4UtcMs)}</b>`
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
    .map((p) => ({ ...p, cloud: cloudAt(p.lat, p.lon) }))
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

async function refreshForecast() {
  $('status').textContent = 'Fetching cloud forecast…'
  try {
    state.cloud = await fetchCloudGrid(gridPoints)
    state.cloudFetchedAt = Date.now()
    renderCloudOverlay()
    renderRanking()
    renderDetails()
  } catch (err) {
    console.error(err)
    $('status').textContent = 'Forecast fetch failed — retrying at next cycle.'
  }
  state.nextRefreshMs = Date.now() + FORECAST_EVERY
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
  if (!state.cloudFetchedAt) return
  const age = Math.round((Date.now() - state.cloudFetchedAt) / 1000)
  const next = state.nextRefreshMs ? Math.max(0, Math.round((state.nextRefreshMs - Date.now()) / 1000)) : 0
  $('status').textContent =
    `Forecast updated ${new Date(state.cloudFetchedAt).toISOString().slice(11, 16)} UTC ` +
    `(${Math.floor(age / 60)}m ago) · auto-refresh in ${Math.floor(next / 60)}:${String(next % 60).padStart(2, '0')}`
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
refreshForecast()
refreshRadar()
computePlaceHorizons()
setInterval(refreshForecast, FORECAST_EVERY)
setInterval(refreshRadar, RADAR_EVERY)
setInterval(() => { renderCountdown(); renderStatus() }, 1000)
