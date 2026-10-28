// P-board (F8a, DESIGN §4.2.3 and §4.2.9's snap-check and rematch-memory
// rows): the table is made for the board its match's mission chose, and
// made over only when that board changes. It runs a build of the working
// tree's code, in one Chromium page (?debug, ?fast, ?lowfi), on the
// classic mission and on the grand one (80×56, zones 14" deep, nine
// objectives; since F8b the shipped mission, on its `open` set with its ×3
// presets: until F8b, when only classic shipped, a test mission of that
// board patched into a copy of data/mission.js, on the classic set and
// armies):
//
//   - the title is the classic table, whatever ?mission= says: the mat
//     40×28, five objectives, the overlay's grid 80×56 cells, the dolly 75,
//     the far plane 400, the fog 70 to 140, the shadow camera ±27 and ±22;
//   - a battle of the grand mission (hotseat, read as it starts: its table
//     snapped, nothing yet played on it) makes the table over for its board (the
//     mat 80×56, zones 14" deep, nine objectives where the mission puts
//     them, the overlay 160×112, the figures' edge 80, the tufts and
//     flowers four times as many, the dolly past 75, the far plane, the fog
//     and the shadows farther), and a classic battle after it makes the
//     classic table again, exactly as the title had it;
//   - two classic battles in a row make nothing over (setBoard's count
//     still), and neither do two grand ones;
//   - over five round trips (grand, then classic), what the table holds is
//     flat: on every classic battle the same renderer.info geometries and
//     textures, the same scene and labels, as on the first, and so on
//     every grand one (and as many shader programs: none linked anew);
//   - (V3d) a battle of the Powder Field (the grand board, its own seven
//     objectives) burns: its turf scorched into the mat and its fires lit;
//     a classic battle after it has neither, and over three round trips
//     (classic, then Powder Field) the table holds flat again: the fires'
//     two clouds (two geometries, one program, two objects in the scene)
//     made at the first burn and kept, and nothing else.
//
//   node sim/board-check.mjs                 P-board on the working tree
//   node sim/board-check.mjs --self-test     each of EDITS, made in the copy,
//                                            must fail it
//
// Exit 0 when it passes (the self-test: when every edit is caught), 1
// otherwise. Set CHROMIUM_PATH to the pre-installed Chromium if Playwright's
// own isn't installed.
import { parseArgs } from 'node:util'
import { mkdtempSync, rmSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { chromium } from 'playwright'
import { startStaticServer } from '../../../scripts/static-server.mjs'
import { buildApp, copyCode } from './lib.mjs'
import { PKG } from './oracle/pin.mjs'
import { IDLE_MS } from './chromium.mjs'

const { values: a } = parseArgs({ options: { 'self-test': { type: 'boolean' } } })

// the grand mission's board, which the checks below hold the table to (the
// shipped mission's, data/mission.js: refused at once if it is not this)
const GRAND = { W: 80, H: 56, deploy: 14, objectives: [[0, 0], [-14, 14], [14, -14], [-14, -14], [14, 14], [-24, 0], [24, 0], [0, -20], [0, 20]] }
// ((V3d) the Powder Field's: the grand board, its own seven objectives)
const POWDER = { W: 80, H: 56, deploy: 14, objectives: [[0, 0], [-12, 12], [12, -12], [-12, -12], [12, 12], [0, -20], [0, 20]] }
{
  const { MISSIONS } = await import(new URL('../data/mission.js', import.meta.url).href)
  for (const [name, want] of [['grand', GRAND], ['powder', POWDER]]) {
    const m = MISSIONS[name]
    const got = m && { W: m.board.W, H: m.board.H, deploy: m.deploy, objectives: m.objectives.map((o) => [o.x, o.z]) }
    if (JSON.stringify(got) !== JSON.stringify(want)) {
      console.error(`board-check: the ${name} mission is ${JSON.stringify(got)}, not the board this check holds the table to (${JSON.stringify(want)}): port the check`)
      process.exit(1)
    }
  }
}

// one exact substitution in file f of the copy, which must match once
function patch(dir, f, from, to) {
  const p = join(dir, f)
  const text = readFileSync(p, 'utf8')
  const n = text.split(from).length - 1
  if (n !== 1) throw new Error(`board-check can't patch ${f}: its anchor ${JSON.stringify(from.trim().slice(0, 70))} is there ${n} times, not once`)
  writeFileSync(p, text.replace(from, () => to))
}

// Each a broken copy P-board must catch.
const EDITS = {
  // the snap never makes the table over: a grand battle on the classic mat
  'no-rebuild': ['view/index.js', '    if (!to.units) this.setBoard({ ...g.board, ...M.board }, g.objectives, g.nav)\n', ''],
  // the overlay keeps the classic grid: a grand battle's reach shaded askew
  'overlay-unsized': ['view/index.js', '    this.overlay?.resize({ W, H, grid: { nx: grid.nx, nz: grid.nz } })\n', ''],
  // the old objectives left on the table: their markers pile up
  'objectives-kept': ['view/objectives.js', '      this.scene.remove(o.g)\n', ''],
  // the old tufts left on the table: a leak a round trip
  'tufts-kept': ['view/table.js', '      this.scene.remove(old)\n', ''],
  // every snap makes the table over, whatever the board: the classic one
  // drawn again (and its Math.random draws) at every battle
  'always-rebuild': ['view/index.js', '    if (key === this.boardKey) return false\n', ''],
  // ((V3d) the mat painted only when something burns, never cleaned: the
  // Powder Field's scorch kept, and painted again on the next classic mat
  'burns-kept': ['view/index.js', '      scorch: (marks) => {\n        this.table.scorch(marks)\n', '      scorch: (marks) => {\n        if (marks.length) this.table.scorch(marks)\n'],
}

// One run over a build: '' when P-board holds, else why not.
async function run(browser, url) {
  const page = await browser.newPage({ viewport: { width: 1000, height: 640 } })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  try {
    await page.goto(`${url}/?debug&fast&lowfi&seed=4242&dice=99&mission=grand`, { timeout: IDLE_MS })
    await page.waitForFunction(() => window.__ts?.view?.board, null, { timeout: 60000 })
    // what the table holds, read as it stands: drawn once first, so three.js
    // counts it (`mission`: a hotseat battle of that mission started first,
    // in the same call: its table snapped, nothing of it played yet, so no
    // shot or effect is ever on it when it is read)
    const look = (mission = null) => page.evaluate((m) => {
      const ts = window.__ts
      if (m) {
        ts.view.mission(m)
        ts.start('hotseat')
      }
      ts.renderer.render(ts.scenery.scene, ts.camera)
      const info = ts.renderer.info
      return { ...ts.view.board(), counts: ts.view.counts(), geometries: info.memory.geometries, textures: info.memory.textures, programs: info.programs?.length ?? 0 }
    }, mission)
    // ((V3d) and the burns the mat is painted with: painted a microtask
    // after the table is, so read once that has run)
    const battle = async (mission) => ({ ...(await look(mission)), burns: await page.evaluate(() => new Promise((r) => setTimeout(() => r(window.__ts.view.board().burns), 0))) })
    const bad = []
    const title = await look()
    const classic = { W: 40, H: 28, deploy: 8, mat: [40, 28], objectives: 5, grid: [80, 56], unitsW: 40, tufts: 700, flowers: 140, dolly: 75, far: 400, fog: [70, 140], shadow: [-27, 27, 22, -22, 90] }
    const grand = { W: 80, H: 56, deploy: 14, mat: [80, 56], objectives: 9, grid: [160, 112], unitsW: 80, tufts: 2800, flowers: 560 }
    const holds = (got, want, what) => {
      for (const [k, v] of Object.entries(want)) {
        const g = k === 'objectives' ? got.objectives.length : got[k]
        if (JSON.stringify(g) !== JSON.stringify(v)) bad.push(`${what}: ${k} ${JSON.stringify(g)}, not ${JSON.stringify(v)}`)
      }
    }
    holds(title, classic, 'the title')
    if (title.builds !== 0) bad.push(`the title made the table over ${title.builds} times`)
    const g1 = await battle('grand')
    holds(g1, grand, 'a grand battle')
    const want9 = GRAND.objectives
    if (JSON.stringify(g1.objectives) !== JSON.stringify(want9)) bad.push(`a grand battle's objectives stand at ${JSON.stringify(g1.objectives)}`)
    if (!(g1.dolly > 75) || !(g1.far > 400) || !(g1.fog[0] > 70) || !(g1.shadow[1] > 27)) bad.push(`a grand battle keeps the classic camera, fog or shadows: dolly ${g1.dolly}, far ${g1.far}, fog ${g1.fog}, shadow ${g1.shadow}`)
    const g2 = await battle('grand')
    if (g2.builds !== g1.builds) bad.push(`a second grand battle made the table over again (${g1.builds} → ${g2.builds})`)
    const c1 = await battle('classic')
    holds(c1, classic, 'a classic battle after a grand one')
    const c2 = await battle('classic')
    if (c2.builds !== c1.builds) bad.push(`a second classic battle made the table over again (${c1.builds} → ${c2.builds})`)
    // five round trips: flat on every classic battle and every grand one
    const flat = ['geometries', 'textures', 'programs']
    const tables = { grand: [], classic: [] }
    for (let i = 0; i < 5; i++) {
      tables.grand.push(await battle('grand'))
      tables.classic.push(await battle('classic'))
    }
    for (const [m, list] of Object.entries(tables)) {
      for (const [i, t] of list.entries()) {
        for (const k of flat) if (t[k] !== list[0][k]) bad.push(`${m} battle ${i + 1} of 5: renderer.info ${k} ${t[k]}, the first's ${list[0][k]}`)
        for (const k of ['scene', 'labels']) if (t.counts[k] !== list[0].counts[k]) bad.push(`${m} battle ${i + 1} of 5: the scene holds ${t.counts[k]} ${k === 'scene' ? 'objects' : 'labels'}, the first ${list[0].counts[k]}`)
      }
    }
    // ((V3d) the Powder Field: burning on the grand board, and gone again
    for (const [m, list] of Object.entries(tables)) for (const [i, t] of list.entries()) if (t.burns || t.fires) bad.push(`${m} battle ${i + 1} of 5 burns: ${t.burns} scorch marks, ${t.fires} vents lit`)
    const p1 = await battle('powder')
    holds(p1, { ...grand, objectives: POWDER.objectives.length }, 'a Powder Field battle')
    if (JSON.stringify(p1.objectives) !== JSON.stringify(POWDER.objectives)) bad.push(`a Powder Field battle's objectives stand at ${JSON.stringify(p1.objectives)}`)
    if (!(p1.burns > 0) || !(p1.fires > 0)) bad.push(`a Powder Field battle doesn't burn: ${p1.burns} scorch marks, ${p1.fires} vents lit`)
    const trips = { powder: [], classic: [] }
    for (let i = 0; i < 3; i++) {
      trips.classic.push(await battle('classic'))
      trips.powder.push(await battle('powder'))
    }
    const clouds = { geometries: 2, textures: 0, programs: 1, scene: 2, labels: 0 }
    for (const [i, t] of trips.classic.entries()) {
      if (t.burns || t.fires) bad.push(`classic battle ${i + 1} of 3 after a Powder Field one burns: ${t.burns} scorch marks, ${t.fires} vents lit`)
      for (const k of flat) if (t[k] !== tables.classic[0][k] + clouds[k]) bad.push(`classic battle ${i + 1} of 3 after a Powder Field one: renderer.info ${k} ${t[k]}, not the first classic battle's ${tables.classic[0][k]} and the fires' ${clouds[k]}`)
      for (const k of ['scene', 'labels']) if (t.counts[k] !== tables.classic[0].counts[k] + clouds[k]) bad.push(`classic battle ${i + 1} of 3 after a Powder Field one: the scene holds ${t.counts[k]} ${k === 'scene' ? 'objects' : 'labels'}, not the first classic battle's ${tables.classic[0].counts[k]} and the fires' ${clouds[k]}`)
    }
    for (const [i, t] of trips.powder.entries()) {
      if (t.burns !== p1.burns || t.fires !== p1.fires) bad.push(`Powder Field battle ${i + 2} burns otherwise: ${t.burns} scorch marks and ${t.fires} vents, the first's ${p1.burns} and ${p1.fires}`)
      for (const k of flat) if (t[k] !== trips.powder[0][k]) bad.push(`Powder Field battle ${i + 2}: renderer.info ${k} ${t[k]}, the second's ${trips.powder[0][k]}`)
      for (const k of ['scene', 'labels']) if (t.counts[k] !== trips.powder[0].counts[k]) bad.push(`Powder Field battle ${i + 2}: the scene holds ${t.counts[k]} ${k === 'scene' ? 'objects' : 'labels'}, the second's ${trips.powder[0].counts[k]}`)
    }
    if (errors.length) bad.push(`the page threw: ${errors[0]}`)
    const said = bad.length ? bad.slice(0, 6).join('; ') : ''
    return { said, title, g1, c1, p1, last: tables, trips }
  } finally {
    await page.close()
  }
}

const work = mkdtempSync(join(tmpdir(), 'tails-and-scales-board-'))
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
let failed = 0
try {
  const build = async (name, edit) => {
    const dir = copyCode(PKG, join(work, name))
    if (edit) patch(dir, ...edit)
    return startStaticServer(await buildApp(dir, join(work, `${name}-dist`)))
  }
  const once = async (name, edit) => {
    const served = await build(name, edit)
    try {
      return await run(browser, served.url)
    } finally {
      served.close()
    }
  }
  if (a['self-test']) {
    console.log(`board-check self-test: ${Object.keys(EDITS).length} edits, after the unedited code passes`)
    const base = await once('unedited')
    console.log(`  ${base.said ? 'FAIL' : 'ok  '} unedited  ${base.said || 'passes'}`)
    if (base.said) failed++
    for (const [name, edit] of Object.entries(EDITS)) {
      const r = await once(name, edit)
      console.log(`  ${r.said ? 'caught' : 'MISSED'} ${name.padEnd(16)} ${r.said.slice(0, 200)}`)
      if (!r.said) failed++
    }
    console.log(failed ? `\nboard-check self-test FAILED: ${failed}` : '\nboard-check self-test passed: the unedited code passes, and every edit is caught')
  } else {
    const r = await once('tree')
    const t = r.last.grand[0], c = r.last.classic[0]
    const p = r.trips.powder.at(-1)
    console.log(`board-check (P-board): the title the classic table (${r.title.W}×${r.title.H}, ${r.title.objectives.length} objectives, grid ${r.title.grid.join('×')}); a grand battle made it over (${r.g1.W}×${r.g1.H}, zones ${r.g1.deploy}", ${r.g1.objectives.length} objectives, grid ${r.g1.grid.join('×')}, ${r.g1.tufts} tufts, dolly ${r.g1.dolly.toFixed(1)}, far ${r.g1.far}, fog ${r.g1.fog.join('–')}), a classic one back; five round trips: grand ${t.geometries} geometries, ${t.textures} textures; classic ${c.geometries}, ${c.textures}; ${r.last.classic.at(-1).programs} programs; a Powder Field battle burning (${r.p1.burns} scorch marks, ${r.p1.fires} vents lit), the classic ones after it not, three round trips flat (Powder Field ${p.geometries} geometries, ${p.textures} textures)`)
    if (r.said) {
      failed++
      console.log(`  FAIL ${r.said}`)
    }
    console.log(failed ? '\nboard-check FAILED' : '\nboard-check passed: the table is made for its match\'s board, made over only when the board changes, and holds no more after five round trips across missions')
  }
} finally {
  await browser.close()
  rmSync(work, { recursive: true, force: true })
}
process.exit(failed ? 1 : 0)
