// Dev-only: load the built app (dist/) in headless Chromium and take
// screenshots from a list of views, without reloading between them. Run
// `npm run build -w @vibe-dump/holo-i-ke-au` first.
//
//   node tools/shoot.mjs <outdir> '<json array of shots>' [extra query]
//   shot = { name, cam: [x, z, distance, yaw, pitch], year, frames, wait, eval, until, keys, click, hover, mouse, settle, element, report }
//     eval: a function body run in the page with `app` (app.tour.goTo(6, 0), say)
//     until: an expression waited on before the settle (app.land.ready, say)
//     report: an expression logged after the shot (app.districts.stats(), say)
//     element: a selector to shoot alone instead of the page (.legend, say)
//     keys: keys to press, in order (["ArrowRight", "ArrowRight"])
//     click / hover: a selector to click, or to rest the pointer on (after the settle)
//     mouse: [x, y] to rest the pointer at on the scene (after the settle), as a hand would
//     settle: snap the camera's flight, the year and the island packs to where they're going (default true)
//   DATA=fake   load test-data/ (tools/fake-data.mjs; DATA=test is the same); the
//               default when public/data/manifest.json doesn't exist yet
//   VIEWPORT=390x844, PORT=5299, DPR=2
//
// The package directory is served as the root, so the app's ?data= can reach
// test-data/ beside dist/.
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, normalize, extname } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
// (tools/shots/ is gitignored at the root)
const outDir = process.argv[2] || join(root, 'tools/shots')
// ==== settlements: a named list of shots ================================== [settlements]
//   node tools/shoot.mjs <outdir> settlements
// The town by era (features/settlements.js), each shot once the district and
// its buildings are in: the harbour and Kou in 1795, Honolulu in 1853, 1896
// and 1930, downtown and Waikīkī now (the timeline's last year, drawn from
// the 2020 keyframe), and the valley in 1896; the harbour in 1896 from a
// raking angle (where the buildings once flickered); and every island's
// (features/towns.js), once its towns in reach are built: Lahaina in 1850
// and now, Kailua-Kona in 1820 and 1896, Hilo now, a Kohala hamlet in 1778.
// `place` is a gazetteer id or [lon, lat].
const nearShot = (name, place, year, [bearing, pitch, distance], first = false) => ({
  name,
  year,
  eval: `${first ? 'app.ui.card.close(); app.ui.onScrub(); ' : ''}const v = app.tour.cameraView(${typeof place === 'string' ? `app.tour.places.get('${place}')` : `{ geometry: { type: 'Point', coordinates: ${JSON.stringify(place)} } }`}, { bearing: ${bearing}, pitch: ${pitch}, distance: ${distance} }); app.rig.jump({ x: v.target.x, z: v.target.z, distance: v.distance, yaw: v.yaw, pitch: v.pitch })`,
  until: "(() => { app.settle(); const t = app.rig.state.target, D = app.districts, d = D.districtAt(t.x, t.z); return app.towns.idle && (!d || (D.cur?.d === d && D.cur.state === 'ready' && !!D.cur.features?.settlements.ready)) })()",
  report: "{ district: app.districts.cur?.features?.settlements.stats() ?? null, towns: app.towns.stats() }",
})
// ==== chain: the whole chain and the routes that follow the story ==============
//   node tools/shoot.mjs <outdir> chain          (and VIEWPORT=390x844 for a phone)
// The opening (chapter 1's card over the chain, its events' routes faint), the
// chain alone from the home button, the chain at contact in each far view
// with no card (no routes), the same with the routes toggle on (all of them),
// the Pāʻao step (its own route), the far steps of Moʻikeha and Kaʻieʻiewaho
// (the chain's turn kept), and Cook at Kealakekua.
const tourTo = (id) => `const at = app.tour.locate(app.data.events.find((e) => e.id === '${id}')); app.tour.goTo(at[0], at[1])`
const homeChain = "const v = app.tour.chainView(); app.rig.jump({ x: v.target.x, z: v.target.z, distance: v.distance, yaw: v.yaw, pitch: v.pitch })"
const chainReport = '[Math.round(app.rig.goal.distance), +app.rig.goal.yaw.toFixed(3), +app.rig.goal.pitch.toFixed(3), app.ui.freeBox()]'
// ==== end chain ===============================================================
const PRESETS = {
  chain: [
    { name: 'open', report: chainReport },
    { name: 'home', eval: `app.ui.card.close(); ${homeChain}`, report: chainReport },
    { name: 'chiefdoms-1778', year: 1778, eval: `app.ui.card.close(); app.ui.onScrub(); app.setView('chiefdoms'); ${homeChain}`, report: chainReport },
    { name: 'land-1778', year: 1778, eval: `app.setView('land'); ${homeChain}`, until: 'app.land.ready', frames: 4 },
    { name: 'routes-all-1778', year: 1778, eval: `app.setView('chiefdoms'); document.querySelector('.tools [data-tool="routes"]').click(); ${homeChain}` },
    { name: 'paao', eval: `document.querySelector('.tools [data-tool="routes"]').click(); ${tourTo('paao')}` },
    { name: 'moikeha-far', eval: tourTo('moikeha'), report: chainReport },
    { name: 'kaieiewaho-far', eval: tourTo('kaieiewaho-1796'), report: chainReport },
    { name: 'cook-kealakekua', eval: tourTo('cook-kealakekua-1779') },
  ],
  settlements: [
    nearShot('harbour-1795', 'kou', 1795, [45, 0.6, 40], true),
    nearShot('kou-1795', 'kou', 1795, [30, 0.45, 16]),
    nearShot('honolulu-1853', 'honolulu', 1853, [40, 0.5, 22]),
    nearShot('honolulu-1896', 'honolulu', 1896, [40, 0.5, 22]),
    nearShot('harbour-1896-raking', 'kou', 1896, [45, 0.1, 22]),
    nearShot('honolulu-1930', 'honolulu', 1930, [40, 0.5, 22]),
    nearShot('downtown-now', 'kou', 2020, [50, 0.45, 24]),
    nearShot('waikiki-now', 'waikiki', 2020, [20, 0.45, 26]),
    nearShot('valley-1896', 'nuuanu', 1896, [42, 0.35, 60]),
    nearShot('lahaina-1850', 'lahaina', 1850, [60, 0.3, 18]),
    nearShot('lahaina-now', 'lahaina', 2020, [60, 0.3, 18]),
    nearShot('kona-1820', 'kailua-kona', 1820, [80, 0.3, 16]),
    nearShot('kona-1896', 'kailua-kona', 1896, [80, 0.3, 16]),
    nearShot('hilo-now', 'hilo', 2020, [300, 0.3, 22]),
    nearShot('kohala-1778', [-155.815, 20.245], 1778, [30, 0.3, 12]),
  ],
  koolaupoko: [],
}
// ==== koolaupoko: a district at the years it is drawn at, and the coda's stops ====== [koolaupoko]
//   node tools/shoot.mjs <outdir> koolaupoko       (DATA=fake for the test district)
// The coda's second near stop's place framed as its camera has it, pulled
// back to show the shore, c. 1700, in 1850 and now (the timeline's end);
// then each of the coda's near stops as the tour flies to it, once its
// district is down.
{
  const nearStops = "(() => { const T = app.tour, ch = T.chapters.find((c) => c.era.id === 'coda'), out = []; if (ch) ch.events.forEach((ev, s) => (ev.stops || []).forEach((st, i) => { if (st.zoom === 'near') out.push([ch.index, s, i]) })); return out })()"
  const down = "(() => { const D = app.districts, t = app.rig.state.target, d = D.districtAt(t.x, t.z); return !!d && D.cur?.d === d && D.cur.state === 'ready' && !!D.cur.features?.settlements.ready })()"
  const report = '{ district: app.districts.stats(), year: app.timeline.year, label: document.querySelector(".tl-year").textContent, pin: document.querySelector(".pin.active.show")?.getBoundingClientRect() ?? null }'
  const shore = (year) => `app.ui.card.close(); app.ui.onScrub(); ${year === 'now' ? 'app.timeline.set(app.timeline.max)' : `app.timeline.setYear(${year})`}; const at = ${nearStops}[1] || ${nearStops}[0]; const st = app.tour.chapters[at[0]].events[at[1]].stops[at[2]]; const v = app.tour.cameraView(app.tour.places.get(st.place), { bearing: st.camera?.bearing ?? 225, pitch: 0.42, distance: 34 }); app.rig.jump({ x: v.target.x, z: v.target.z, distance: v.distance, yaw: v.yaw, pitch: v.pitch })`
  PRESETS.koolaupoko.push(
    ...['1700', '1850', 'now'].map((y) => ({ name: `shore-${y}`, eval: shore(y), until: down, frames: 4, report })),
    ...[0, 1, 2, 3].map((k) => ({ name: `coda-stop-${k + 1}`, eval: `const at = ${nearStops}[${k}]; if (at) { app.tour.goTo(at[0], at[1]); app.tour.goStop(at[2]) }`, until: down, frames: 4, report })),
  )
}
// ==== [koolaupoko] end ===============================================================
// ==== works: the works by their years (features/works.js) ========================== [works]
//   node tools/shoot.mjs <outdir> works      (DATA=fake for the test works; on the real data,
//                                            with '&works=../test-data/real/' for the real Oʻahu's)
// Oʻahu at the island zoom in 1930 and 1975, and 1975 in the Land view with its legend; then
// down to the first runway the works list and the middle of the first named road, in 1975.
{
  const isle = "app.ui.card.close(); app.ui.onScrub(); const v = app.tour.islandView('oahu', 0); app.rig.jump({ x: v.target.x, z: v.target.z, distance: v.distance, yaw: v.yaw, pitch: v.pitch })"
  const ready = "(() => { app.settle(); return !!app.works.islands.get('oahu')?.view })()"
  const down = "(() => { app.settle(); const D = app.districts, t = app.rig.state.target, d = D.districtAt(t.x, t.z); return !!app.works.islands.get('oahu')?.view && (!d || (D.cur?.d === d && D.cur.state === 'ready' && !!D.cur.features?.settlements.ready)) })()"
  const at = (test, distance, pitch) => `app.setView('chiefdoms'); const f = app.works.entries.get('oahu')?.out?.feats.find((q) => ${test}); if (f?.rep) app.rig.jump({ x: f.rep[0], z: f.rep[1], distance: ${distance}, yaw: 0.6, pitch: ${pitch} })`
  const report = 'app.works.stats().islands'
  PRESETS.works = [
    { name: 'works-oahu-1930', year: 1930, eval: isle, until: ready, frames: 4, report },
    { name: 'works-oahu-1975', year: 1975, eval: isle, until: ready, frames: 4, report },
    { name: 'works-oahu-1975-land', year: 1975, eval: "app.setView('land')", until: 'app.land.ready', frames: 6, report: "document.querySelector('.legend').textContent.replace(/\\s+/g, ' ')" },
    { name: 'works-runway-1975', year: 1975, eval: at("q.part === 'runway'", 30, 0.6), until: down, frames: 4, report },
    { name: 'works-road-1975', year: 1975, eval: at("q.part === 'road' && q.name", 40, 0.5), until: down, frames: 4, report },
  ]
}
// ==== [works] end =====================================================================
// ==== [settlements] end ===============================================================
const shots = PRESETS[process.argv[3]] || JSON.parse(process.argv[3] || '[{"name":"default"}]')
const extra = process.argv[4] || ''
const port = Number(process.env.PORT || 5299)
const useTest = process.env.DATA ? process.env.DATA === 'test' || process.env.DATA === 'fake' : !existsSync(join(root, 'public/data/manifest.json'))
mkdirSync(outDir, { recursive: true })

// ==== the battles' people (features/soldiers.js) ===================================== [soldiers]
// '[{"preset":"soldiers"}]' walks the battles: the Puʻiwa, Lāʻimi and pali stops at the stop camera
// and close in (where a figure is three device pixels to the sprite pixel), the pali close at a
// moment of the leap; a zoom at Puʻiwa across the change from two pixels to three, held at five
// moments of the crossfade; the march past Kou, the landing at Waikīkī, Kaheiki in 1783 and its
// columns; and last the sprite sheet itself: whole at 1x, each facing at 3x, the slinger at 3x and
// the run and the leap at 3x. A shot with `sheet: { n, rows, facing, frames }` lays the sheet (as
// the district's soldiers built it) over the page at n× on a ground-coloured backing, only the rows
// whose kind/side/dress contain one of `rows`, one facing (0 side, 1 front, 2 back; all when left
// out) and frames [a, b] of it, and shoots it alone.
{
  const tour = (ev, stop) => `const at = app.tour.locate(app.data.events.find((e) => e.id === '${ev}')); app.tour.goTo(at[0], at[1]); app.tour.goStop(${stop})`
  const ready = "app.districts.cur?.state === 'ready'"
  const people = 'app.districts.cur.features.forces.stats()'
  const S = 'app.districts.cur.features.forces.soldiers'
  const F = 'app.districts.cur.features.forces'
  // (let the figures go again after a held shot)
  const free = `if (app.districts.cur?.features) ${S}.hold = false;`
  // the camera over a place as a stop camera frames it, closer
  const near = (place, bearing, pitch, distance) => `${free} const v = app.tour.cameraView(app.tour.places.get('${place}'), { bearing: ${bearing}, pitch: ${pitch}, distance: ${distance} }); app.rig.jump({ x: v.target.x, z: v.target.z, distance: v.distance, yaw: v.yaw, pitch: v.pitch }); app.settle()`
  // on until a leaper is in the air past the brink, tumbling, then everyone held
  const leapMoment = `const Sx = ${S}, f = Sx.f; for (let k = 0; k < 400; k++) { ${F}.update(0.04, app.districts.k, app.rig.state.distance); let air = 0; for (let i = 0; i < Sx.count; i++) if (f.vis[i] > 0.9 && f.air[i] && f.fr[i] >= 15) air++; if (air) break } Sx.hold = true`
  // a zoom at Puʻiwa from 14 in to d, a third of a per cent a frame, then held where it got to
  const zoomTo = (d) =>
    `${free} const v = app.tour.cameraView(app.tour.places.get('puiwa'), { bearing: 42, pitch: 0.38, distance: 14 }); app.rig.jump({ x: v.target.x, z: v.target.z, distance: 14, yaw: v.yaw, pitch: v.pitch }); app.settle(); for (let d = 14; d > ${d}; d *= 0.9967) { app.rig.jump({ distance: Math.max(d, ${d}) }); ${F}.update(1 / 60, app.districts.k, Math.max(d, ${d})) } app.rig.jump({ distance: ${d} }); ${F}.update(1 / 60, app.districts.k, ${d}); ${S}.hold = true`
  const scale = `${S}.stats().scale`
  const facingRows = ['spear/oahu/kihei', 'club/oahu/bare', 'musket/hawaii/kihei', 'sling/maui/kihei', 'dagger/oahu/kihei', 'spear/hawaii/chief', 'club/oahu/chief', 'rammer', 'linstock', 'gun']
  const SOLDIERS = [
    { name: 'puiwa', eval: `${free} ${tour('nuuanu-1795', 5)}`, until: ready, frames: 4, report: people },
    { name: 'puiwa-close', eval: near('puiwa', 42, 0.38, 9), frames: 3, report: people },
    { name: 'laimi', eval: `${free} app.tour.goStop(6)`, until: ready, frames: 4, report: people },
    { name: 'laimi-close', eval: near('laimi', 42, 0.38, 9), frames: 3, report: people },
    { name: 'pali', eval: `${free} app.tour.goStop(7)`, until: ready, frames: 4, report: people },
    { name: 'pali-close', eval: `${near('nuuanu-pali', 57, 0.2, 10)}; ${leapMoment}`, frames: 3, report: people },
    { name: 'pali-leap-3x', eval: `${near('nuuanu-pali', 57, 0.25, 8)}; ${leapMoment}`, frames: 3, report: people },
    { name: 'zoom-start', eval: `${free} app.tour.goStop(5)`, until: ready, frames: 2 },
    ...[12.4, 12.0, 11.6, 11.2, 10.8].map((d, q) => ({ name: `zoom-${q + 1}-at-${d}`, eval: zoomTo(d), settle: false, frames: 3, report: scale })),
    { name: 'kou', eval: `${free} app.tour.goStop(4)`, until: ready, frames: 4, report: people },
    { name: 'waikiki', eval: `${free} app.tour.goStop(3)`, until: ready, frames: 4, report: people },
    { name: 'kaheiki', eval: `${free} ${tour('kaheiki-1783', 2)}`, until: ready, frames: 4, report: people },
    { name: 'kaheiki-columns', eval: `${free} app.tour.goStop(1)`, until: ready, frames: 4, report: people },
    { name: 'sheet', sheet: { n: 1 }, settle: false, frames: 1 },
    { name: 'facings-side-3x', sheet: { n: 3, rows: facingRows, facing: 0 }, settle: false, frames: 1 },
    { name: 'facings-front-3x', sheet: { n: 3, rows: facingRows, facing: 1 }, settle: false, frames: 1 },
    { name: 'facings-back-3x', sheet: { n: 3, rows: facingRows, facing: 2 }, settle: false, frames: 1 },
    { name: 'slinger-3x', sheet: { n: 3, rows: ['sling/hawaii/bare', 'sling/oahu/kihei', 'sling/maui/bare'], frames: [8, 13] }, settle: false, frames: 1 },
    { name: 'leap-3x', sheet: { n: 3, rows: ['spear/oahu/kihei', 'club/oahu/bare', 'dagger/oahu/bare', 'spear/oahu/chief'], frames: [4, 16] }, settle: false, frames: 1 },
  ]
  const showSheet = (app, o) => {
    const Sd = app.districts.cur?.features?.forces?.soldiers
    if (!Sd) throw new Error('no district down: no sprite sheet to show')
    const { width: w, data, rows, facingW } = Sd.sheet
    const n = o.n || 1
    const H = 16
    const picked = rows.map((r, i) => ({ ...r, i })).filter((r) => !o.rows || o.rows.some((k) => `${r.kind}/${r.side}/${r.dress}`.includes(k)))
    const f0 = o.facing ?? 0
    const nf = o.facing === undefined ? 3 : 1
    const [a, b] = o.frames || [0, facingW - 1]
    const cells = (b - a + 1) * nf
    const cw = Math.max(...picked.map((r) => r.w))
    const cv = document.getElementById('sheet-shot') || document.body.appendChild(document.createElement('canvas'))
    cv.id = 'sheet-shot'
    cv.width = cells * cw * n + 16
    cv.height = picked.length * H * n + 16
    Object.assign(cv.style, { position: 'fixed', left: '0', top: '0', zIndex: 1000, imageRendering: 'pixelated' })
    const cx = cv.getContext('2d')
    cx.fillStyle = '#76825a'
    cx.fillRect(0, 0, cv.width, cv.height)
    const img = cx.createImageData(cells * cw * n, picked.length * H * n)
    picked.forEach((r, ri) => {
      for (let fc = 0; fc < nf; fc++) {
        for (let fr = a; fr <= b; fr++) {
          const sx0 = ((f0 + fc) * facingW + fr) * r.w
          const dx0 = (fc * (b - a + 1) + (fr - a)) * cw + (cw - r.w) / 2
          for (let y = 0; y < H * n; y++) {
            for (let x = 0; x < r.w * n; x++) {
              const s = ((r.i * H + Math.floor(y / n)) * w + sx0 + Math.floor(x / n)) * 4
              const o2 = ((ri * H * n + y) * cells * cw * n + dx0 * n + x) * 4
              const on = data[s + 3] ? 1 : 0
              img.data[o2] = on ? data[s] : 0x76
              img.data[o2 + 1] = on ? data[s + 1] : 0x82
              img.data[o2 + 2] = on ? data[s + 2] : 0x5a
              img.data[o2 + 3] = 255
            }
          }
        }
      }
      // (the rest of a narrow row's wide cells: ground)
      for (let y = 0; y < H * n; y++) for (let x = 0; x < cells * cw * n; x++) {
        const o2 = ((ri * H * n + y) * cells * cw * n + x) * 4
        if (!img.data[o2 + 3]) img.data.set([0x76, 0x82, 0x5a, 255], o2)
      }
    })
    cx.putImageData(img, 8, 8)
  }
  for (let i = shots.length - 1; i >= 0; i--) if (shots[i].preset === 'soldiers') shots.splice(i, 1, ...SOLDIERS)
  for (const s of shots) if (s.sheet) Object.assign(s, { eval: `${s.eval || ''};(${showSheet})(app, ${JSON.stringify(typeof s.sheet === 'number' ? { n: s.sheet } : s.sheet)})`, element: '#sheet-shot' })
}
// ==== [soldiers] end ===============================================================================

// ==== [ui6] the sources read, the Māhele, the Kou stop, the shore, the phone's timeline ============
// '[{"preset":"ui6"}]' shoots a card's sources (only what was read), the Māhele over the chain and over
// Oʻahu with its legend (and the hover card on an ahupuaʻa), the tour's Māhele step, the Kou stop and
// its target, and the shore at Kawaihae (the cattle step and closer), Waikīkī and Lahaina. With
// VIEWPORT=390x844, '[{"preset":"ui6-phone"}]' shoots the phone's timeline, opening and at a step.
{
  const step = (id, extra = '') => `app.ui.card.close(); ${extra}const at = app.tour.locate(app.data.events.find((e) => e.id === '${id}')); app.tour.goTo(at[0], at[1])`
  const chain = "const v = app.tour.chainView(); app.rig.jump({ x: v.target.x, z: v.target.z, distance: v.distance, yaw: v.yaw, pitch: v.pitch })"
  const isle = (id) => `const v = app.tour.islandView('${id}', 0); app.rig.jump({ x: v.target.x, z: v.target.z, distance: v.distance, yaw: v.yaw, pitch: v.pitch })`
  const near = (place, d) => `app.ui.card.close(); const v = app.tour.pointView(app.tour.places.get('${place}'), ${d}); app.rig.jump({ x: v.target.x, z: v.target.z, distance: v.distance, yaw: v.yaw, pitch: v.pitch })`
  const toSources = "const c = document.querySelector('.card.show'); const h2 = [...c.querySelectorAll('.card-sec h2')].find((h) => h.textContent === 'Sources'); if (h2) c.scrollTop = h2.parentElement.offsetTop - 12"
  const mahele = "app.regionOn === 'mahele' && app.mahele.built"
  const UI6 = [
    { name: 'ui6-card-sources', eval: `${step('nuuanu-1795')}; ${toSources}`, element: '.card.show', report: "[...document.querySelectorAll('.card.show .sources li')].length" },
    { name: 'ui6-mahele-chain', year: 1853, eval: `app.ui.card.close(); app.ui.onScrub(); app.setView('mahele', { user: true }); ${chain}`, until: mahele, frames: 4, report: "document.querySelector('.legend').textContent.replace(/\\s+/g, ' ')" },
    { name: 'ui6-mahele-oahu', year: 1853, eval: isle('oahu'), until: mahele, frames: 4, report: "document.querySelector('.legend').textContent.replace(/\\s+/g, ' ')" },
    { name: 'ui6-mahele-step', eval: step('mahele-1848', 'app.viewChosen = false; '), until: mahele, frames: 4, report: '[app.view, app.farView]' },
    { name: 'ui6-kou', eval: `${step('nuuanu-1795')}; app.tour.goStop(4)`, until: "app.districts.cur?.state === 'ready'", frames: 4, report: '[app.tour.state, app.rig.goal.distance]' },
    { name: 'ui6-kawaihae', eval: step('cattle-1793', "app.setView('chiefdoms', { user: true }); "), frames: 4 },
    { name: 'ui6-kawaihae-300', eval: near('kawaihae', 300), frames: 4 },
    { name: 'ui6-kawaihae-100', eval: near('kawaihae', 100), frames: 4 },
    { name: 'ui6-waikiki', eval: step('mailikukahi'), frames: 4 },
    { name: 'ui6-waikiki-300', eval: near('waikiki', 300), frames: 4 },
    { name: 'ui6-lahaina', eval: step('whaling'), frames: 4 },
    { name: 'ui6-lahaina-300', eval: near('lahaina', 300), frames: 4 },
  ]
  const UI6_PHONE = [
    { name: 'ui6-phone-open', frames: 3 },
    { name: 'ui6-phone-timeline', frames: 1, element: '.timeline', report: "[...document.querySelectorAll('.tl-tick span')].filter((e) => !e.hidden).map((e) => e.textContent)" },
    { name: 'ui6-phone-step', eval: step('mahele-1848'), until: mahele, frames: 3 },
  ]
  for (let i = shots.length - 1; i >= 0; i--) {
    if (shots[i].preset === 'ui6') shots.splice(i, 1, ...UI6)
    else if (shots[i].preset === 'ui6-phone') shots.splice(i, 1, ...UI6_PHONE)
  }
}
// ==== [ui6] end ===================================================================================

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.geojson': 'application/geo+json', '.png': 'image/png', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' }
export function serve(dir, p) {
  const server = createServer(async (req, res) => {
    let f = normalize(join(dir, decodeURIComponent(req.url.split('?')[0])))
    if (!f.startsWith(dir)) return res.writeHead(403).end()
    const s = await stat(f).catch(() => null)
    if (s?.isDirectory()) f = join(f, 'index.html')
    const body = await readFile(f).catch(() => null)
    if (!body) return res.writeHead(404).end('not found')
    res.writeHead(200, { 'Content-Type': MIME[extname(f)] || 'application/octet-stream' }).end(body)
  })
  return new Promise((r) => server.listen(p, '127.0.0.1', () => r(server)))
}

const server = await serve(root, port)
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const [vw, vh] = (process.env.VIEWPORT || '1280x800').split('x').map(Number)
const page = await browser.newPage({ viewport: { width: vw, height: vh }, deviceScaleFactor: Number(process.env.DPR || 1), hasTouch: vw < 760 })
const errors = []
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`)
  console.log('[page]', m.type(), m.text())
})
page.on('pageerror', (e) => {
  errors.push(`pageerror: ${e.message}`)
  console.log('[pageerror]', e.message)
})
const t0 = Date.now()
const q = [useTest ? 'data=../test-data/' : '', extra].filter(Boolean).join('&')
await page.goto(`http://127.0.0.1:${port}/dist/index.html${q ? `?${q}` : ''}`)
await page.waitForSelector('#boot', { state: 'detached', timeout: 180000 })
console.log('booted after', Date.now() - t0, 'ms', useTest ? '(test data)' : '(real data)')
await page.waitForFunction(() => window.__app?.islandsLoaded, null, { timeout: 300000 })
console.log('islands loaded after', Date.now() - t0, 'ms')

for (const s of shots) {
  await page.evaluate((s) => {
    const app = window.__app
    if (s.year !== undefined) app.timeline.setYear(s.year)
    if (s.cam) {
      const [x, z, distance, yaw, pitch] = s.cam
      app.rig.jump({ x, z, distance, yaw, pitch })
    }
    if (s.eval) new Function('app', s.eval)(app)
  }, s)
  for (const k of s.keys || []) await page.keyboard.press(k)
  if (s.click) await page.click(s.click, { timeout: 30000 })
  // a frame to move the camera, then let the packs and the camera's target settle
  const f0 = await page.evaluate(() => window.__app.frames)
  await page.waitForFunction((f0) => window.__app.frames > f0 + 1, f0, { timeout: 300000 })
  if (s.until) await page.waitForFunction(new Function(`const app = window.__app; return ${s.until}`), null, { timeout: 300000 })
  if (s.settle !== false) await page.evaluate(() => window.__app.settle())
  const f1 = await page.evaluate(() => window.__app.frames)
  await page.waitForFunction(([f1, n]) => window.__app.frames > f1 + n, [f1, s.frames ?? 3], { timeout: 300000 })
  if (s.hover) {
    await page.hover(s.hover, { timeout: 30000 })
    const f2 = await page.evaluate(() => window.__app.frames)
    await page.waitForFunction((f2) => window.__app.frames > f2 + 2, f2, { timeout: 300000 })
  }
  if (s.mouse) {
    // (two moves, the hover card's own throttle apart)
    await page.mouse.move(s.mouse[0] - 6, s.mouse[1])
    await page.waitForTimeout(150)
    await page.mouse.move(s.mouse[0], s.mouse[1])
    const f2 = await page.evaluate(() => window.__app.frames)
    await page.waitForFunction((f2) => window.__app.frames > f2 + 2, f2, { timeout: 300000 })
  }
  if (s.wait) await page.waitForTimeout(s.wait)
  const t = Date.now()
  if (s.element) await page.locator(s.element).screenshot({ path: join(outDir, (s.name || 'shot') + '.png'), timeout: 180000 })
  else await page.screenshot({ path: join(outDir, (s.name || 'shot') + '.png'), timeout: 180000 })
  const info = await page.evaluate(() => {
    const a = window.__app
    const tour = a.tour?.state
    return { d: Math.round(a.rig.state.distance), view: a.view, land: a.land?.stats?.(), fill: a.islandFill ? +a.islandFill().toFixed(2) : undefined, routes: a.routes?.visibleRoutes().map((r) => r.id), exag: a.world.exag.toFixed(2), slots: a.world.slots.map((t) => (t ? `${t.pack.id}:${t.k.toFixed(2)}` : '-')).join(' '), year: Math.round(a.timeline.year), tour, clusters: a.ui?.pins.groups().map((g) => g.ids.join('+')), inspector: document.querySelector('.inspector.show') ? document.querySelector('.inspector').textContent.replace(/\s+/g, ' ').trim() : null, patches: a.patches?.stats().islands.map((r) => `${r.id}:${r.k}`), district: a.districts?.patchWeights?.().map((p) => `${p.id}:${p.k}`) }
  })
  if (s.report) console.log('report', s.name, JSON.stringify(await page.evaluate(new Function(`const app = window.__app; return ${s.report}`))))
  console.log('shot', s.name, 'in', Date.now() - t, 'ms', JSON.stringify(info))
}
const perf = await page.evaluate(() => window.__app.stats?.())
if (perf) console.log('stats', JSON.stringify(perf))
console.log(errors.length ? `${errors.length} console errors/warnings` : 'no console errors')
await browser.close()
server.close()
