// The group input in Chromium (DESIGN §4.2.6, F10a): a fresh build with
// ?debug&lowfi, a hotseat battle started from the title, driven by the
// mouse and the keys as a player drives it and read through ?debug's
// `group` hooks and the session's count. Once the camera is at rest:
//   deployment  a Shift-drag box picks up exactly the seat's units whose
//               centre on screen lies inside it; the group bar shows, with
//               Place; Shift-click drops one member and picks it back up; a
//               click on the ground pins a formation and sends nothing; Esc
//               drops the pin and keeps the group; Enter sends it (only
//               members move); a click on the pinned flag sends it too; Tab
//               visits each of the seat's units once and comes round again;
//               a touch a little off a far figure picks it where a mouse
//               there finds nothing; in ▭ Select, a finger's box picks
//               exactly the units inside it with the camera still, and two
//               fingers pan the camera, the group kept (real touches,
//               through CDP); a long press takes a unit out of the group
//               and puts it back; a right click drops a pin; an Alt-drag
//               pins the group along a line and Enter sends each member to
//               its ghost; a box over the enemy counts it and picks none of
//               it; a double click picks a unit's type on screen (the card
//               saying so); Ready N picks every unit
//   movement    the bar says Move; Tab visits each unit still to act once;
//               a group whose lead moved keeps the rest picked once the
//               table has caught up;
//               one unit's click on the ground moves it at once (nothing
//               pinned); a group's click pins, a second on its flag sends it
//               and only members move; with +D6 each member advances, then
//               moves; the chips grey with the units that have acted; Space
//               takes the camera to the group; Esc with a group and no pin
//               lets go
//   shooting    the bar says Fire; a group fires at an enemy only some of
//               it can reach, and the rest stay picked once the table has
//               caught up
// and no page error throughout.
//
//   node sim/input-check.mjs [--dist <dir>] [--shots <dir>]
//
// 1280×800, seed 4242, dice 1. --shots writes a screenshot at each step.
// Exit 0 when every step holds. Set CHROMIUM_PATH to the pre-installed
// Chromium if Playwright's own isn't installed.
import { parseArgs } from 'node:util'
import { mkdtempSync, rmSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { chromium } from 'playwright'
import { startStaticServer } from '../../../scripts/static-server.mjs'
import { buildApp } from './lib.mjs'
import { PKG } from './oracle/pin.mjs'
import { IDLE_MS } from './chromium.mjs'

const { values: a } = parseArgs({ options: { dist: { type: 'string' }, shots: { type: 'string' } } })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const same = (xs, ys) => JSON.stringify([...xs].sort((p, q) => p - q)) === JSON.stringify([...ys].sort((p, q) => p - q))

async function check(page, say) {
  let shot = 0
  const snap = async (name) => a.shots && page.screenshot({ path: join(a.shots, `${String(++shot).padStart(2, '0')}-${name}.png`) })
  const ev = (fn, arg) => page.evaluate(fn, arg)
  const ids = () => ev(() => window.__ts.group.ids())
  const count = () => ev(() => window.__ts.session.count)
  const pinned = () => ev(() => window.__ts.group.pinned())
  const bar = () => ev(() => window.__ts.group.bar())
  const seatNow = () => ev(() => window.__ts.session.decisionFor())
  // each standing unit's centre on screen: { id, side, x, y, on, px (its
  // base's radius in px), pos }
  const units = () => ev(async () => {
    // (two frames drawn first: the screen map is the last frame's)
    for (let k = 0; k < 2; k++) await new Promise((r) => requestAnimationFrame(r))
    const ts = window.__ts, c = ts.camera
    c.updateMatrixWorld()
    const V = c.matrixWorldInverse.elements, P = c.projectionMatrix.elements
    const mul = (m, [x, y, z, w]) => [0, 1, 2, 3].map((i) => m[i] * x + m[4 + i] * y + m[8 + i] * z + m[12 + i] * w)
    const proj = (x, z) => {
      const e = mul(P, mul(V, [x, 0.4, z, 1]))
      return { x: (e[0] / e[3] * 0.5 + 0.5) * innerWidth, y: (-e[1] / e[3] * 0.5 + 0.5) * innerHeight }
    }
    return ts.G.units.filter((u) => u.alive > 0).map((u) => {
      const s = ts.group.screen(u.id) ?? { on: false, x: -1, y: -1 }
      const e = proj(u.pos.x + u.r, u.pos.z)
      return { id: u.id, side: u.side, x: s.x, y: s.y, on: s.on, px: Math.hypot(e.x - s.x, e.y - s.y), pos: { x: u.pos.x, z: u.pos.z }, moved: !!u.flags.moved, range: u.t.ranged?.range ?? 0 }
    })
  })
  // a point on the table (x, z) on screen, at the ground
  const toScreen = (x, z) => ev(({ x, z }) => {
    const c = window.__ts.camera
    c.updateMatrixWorld()
    const V = c.matrixWorldInverse.elements, P = c.projectionMatrix.elements
    const mul = (m, [p, q, r, w]) => [0, 1, 2, 3].map((i) => m[i] * p + m[4 + i] * q + m[8 + i] * r + m[12 + i] * w)
    const e = mul(P, mul(V, [x, 0, z, 1]))
    return { x: (e[0] / e[3] * 0.5 + 0.5) * innerWidth, y: (-e[1] / e[3] * 0.5 + 0.5) * innerHeight }
  }, { x, z })
  // on the table, clear of the HUD's panels and buttons, and of every
  // figure by `gap` px
  const clear = async (q, gap = 34) => {
    const free = await ev(({ x, y }) => window.__ts.group.pick(x, y).ground && x > 40 && x < innerWidth - 40 && y > 110 && y < innerHeight - 60 && ['#hud', '#hint', '#log', '#card', '#tray', '#actions', '#tools', '#groupbar', '#netbadge'].every((s) => {
      const el = document.querySelector(s)
      if (!el || getComputedStyle(el).display === 'none' || el.classList.contains('hidden')) return true
      const r = el.getBoundingClientRect()
      return x < r.left - 10 || x > r.right + 10 || y < r.top - 10 || y > r.bottom + 10
    }), q)
    return free && (await units()).every((u) => !u.on || Math.hypot(u.x - q.x, u.y - q.y) > gap)
  }
  // the camera at rest: every figure's place on screen the same twice running
  const rest = async () => {
    let was = ''
    for (let k = 0; k < 120; k++) {
      const now = JSON.stringify((await units()).map((u) => [Math.round(u.x), Math.round(u.y)]))
      if (now === was) return
      was = now
      await sleep(500)
    }
    throw new Error('the camera never came to rest')
  }
  // the group's commands sent and folded and the table caught up: not busy,
  // the player idle, the count still for 1 s
  const settled = async () => {
    let was = -1
    for (let k = 0; k < 60; k++) {
      const n = await count()
      if (n === was && (await ev(() => !window.__ts.group.busy() && window.__ts.player.idle))) return n
      was = n
      await sleep(1000)
    }
    throw new Error('the group never finished sending')
  }
  const moved = (before, after) => after.filter((u) => {
    const b = before.find((x) => x.id === u.id)
    return b && (b.pos.x !== u.pos.x || b.pos.z !== u.pos.z)
  }).map((u) => u.id)
  // a ground point about `d` inches from (x, z), clear on screen
  const groundNear = async (x, z, dirs) => {
    for (const [dx, dz] of dirs) {
      const q = await toScreen(x + dx, z + dz)
      if (await clear(q)) return q
    }
    return null
  }
  const shiftClick = async (q) => {
    await page.keyboard.down('Shift')
    await page.mouse.click(q.x, q.y)
    await page.keyboard.up('Shift')
    await sleep(250)
  }
  const fail = (m) => {
    throw new Error(m)
  }

  // ── The deployment ───────────────────────────────────────────────────────
  await page.waitForFunction(() => window.__ts?.session?.G?.pending?.k === 'deploy' && window.__ts.player.idle, null, { timeout: IDLE_MS })
  await rest()
  const s = await seatNow()
  if (s < 0) fail('no seat deploys here')
  let all = await units()
  const mine = all.filter((u) => u.side === s && u.on).sort((p, q) => p.x - q.x)
  if (mine.length < 4) fail(`only ${mine.length} of seat ${s}'s units on screen`)
  // a box round the left half of them; the expected group is every unit of
  // the seat whose centre lies in it (read before the drag, the camera still)
  const half = mine.slice(0, Math.ceil(mine.length / 2))
  const box = [Math.min(...half.map((u) => u.x)) - 6, Math.min(...half.map((u) => u.y)) - 6, Math.max(...half.map((u) => u.x)) + 6, Math.max(...half.map((u) => u.y)) + 6]
  const inBox = mine.filter((u) => u.x >= box[0] && u.x <= box[2] && u.y >= box[1] && u.y <= box[3]).map((u) => u.id)
  await page.keyboard.down('Shift')
  await page.mouse.move(box[0], box[1])
  await page.mouse.down()
  await page.mouse.move((box[0] + box[2]) / 2, (box[1] + box[3]) / 2, { steps: 4 })
  await page.mouse.move(box[2], box[3], { steps: 4 })
  await page.mouse.up()
  await page.keyboard.up('Shift')
  await sleep(300)
  let got = await ids()
  if (!same(got, inBox)) fail(`the box picked ${JSON.stringify(got)}, the units inside it are ${JSON.stringify(inBox)} (box ${box.map(Math.round)}; before ${JSON.stringify(mine.map((u) => [u.id, Math.round(u.x), Math.round(u.y)]))}; now ${JSON.stringify((await units()).filter((u) => u.side === s).map((u) => [u.id, Math.round(u.x), Math.round(u.y), u.on]))})`)
  let b = await bar()
  if (!b.show || b.count !== inBox.length || b.verbs[0]?.k !== 'place') fail(`the bar after the box: ${JSON.stringify(b)}`)
  if (await ev(() => document.querySelector('#groupbar').classList.contains('hidden'))) fail('the group bar is hidden with a group picked')
  say(`box: picked exactly the ${inBox.length} of seat ${s}'s units inside it; the bar shows them, with Place`)
  await snap('box')

  // Shift-click one member out and back in: the one furthest from any other
  // figure on screen, so the click can only mean it
  const lone = inBox.map((id) => all.find((u) => u.id === id)).map((u) => ({ u, d: Math.min(...all.filter((o) => o.on && o.id !== u.id).map((o) => Math.hypot(o.x - u.x, o.y - u.y))) })).sort((p, q) => q.d - p.d)[0].u
  await shiftClick(lone)
  got = await ids()
  if (got.includes(lone.id) || got.length !== inBox.length - 1) fail(`Shift-click on ${lone.id} left the group ${JSON.stringify(got)}`)
  await shiftClick(lone)
  got = await ids()
  if (!same(got, inBox)) fail(`a second Shift-click on ${lone.id} left the group ${JSON.stringify(got)}`)
  say(`Shift-click dropped unit ${lone.id} and picked it back up`)

  // a click on the ground pins and sends nothing; Esc drops the pin, keeps
  // the group; Enter sends it, and only members move
  const c0 = all.find((u) => u.id === inBox[0])
  const g1 = await groundNear(c0.pos.x, c0.pos.z, [[0, 3], [0, -3], [0, 5], [0, -5], [0, 7], [0, -7]])
  if (!g1) fail('no clear ground near the group to click')
  let n0 = await count()
  await page.mouse.click(g1.x, g1.y)
  await sleep(400)
  if (!(await pinned()) || (await count()) !== n0) fail(`a ground click: pinned ${await pinned()}, ${(await count()) - n0} sent`)
  await snap('pinned')
  await page.keyboard.press('Escape')
  await sleep(250)
  if ((await pinned()) || !same(await ids(), inBox)) fail(`Esc: pinned ${await pinned()}, the group ${JSON.stringify(await ids())}`)
  await page.mouse.click(g1.x, g1.y)
  await sleep(400)
  if (!(await pinned())) fail('a ground click after Esc pinned nothing')
  let before = await units()
  await page.keyboard.press('Enter')
  let n1 = await settled()
  let after = await units()
  let went = moved(before, after)
  if (n1 === n0 || (await pinned())) fail(`Enter: ${n1 - n0} sent, pinned ${await pinned()}`)
  if (went.some((id) => !inBox.includes(id))) fail(`Enter moved units outside the group: ${JSON.stringify(went.filter((id) => !inBox.includes(id)))}`)
  say(`a ground click pinned and sent nothing; Esc dropped the pin and kept the group; Enter sent ${n1 - n0} placements, ${went.length} members moved, nothing else`)
  await snap('placed')

  // the flag: pin elsewhere, click the flag
  await rest()
  all = await units()
  const c1 = all.find((u) => u.id === inBox[0])
  const g2 = await groundNear(c1.pos.x, c1.pos.z, [[0, -4], [0, 4], [0, -6], [0, 6], [0, -8], [0, 8]])
  if (!g2) fail('no clear ground for the flag')
  if (!same(await ids(), inBox)) fail(`the group after placing: ${JSON.stringify(await ids())}`)
  n0 = await count()
  await page.mouse.click(g2.x, g2.y)
  await sleep(600)
  if (!(await pinned())) fail('the second ground click pinned nothing')
  before = await units()
  await page.mouse.click(g2.x, g2.y)
  n1 = await settled()
  after = await units()
  went = moved(before, after)
  if (n1 === n0 || (await pinned())) fail(`a click on the flag: ${n1 - n0} sent, pinned ${await pinned()}`)
  if (went.some((id) => !inBox.includes(id))) fail('the flag moved units outside the group')
  say(`a click on the pinned flag sent ${n1 - n0} placements`)

  // a right click drops the pin, the group kept
  await rest()
  n0 = await count()
  await page.mouse.click(g1.x, g1.y)
  await sleep(500)
  if (!(await pinned())) fail('a ground click (for the right click) pinned nothing')
  await page.mouse.click(g1.x, g1.y, { button: 'right' })
  await sleep(300)
  if ((await pinned()) || (await count()) !== n0 || !same(await ids(), inBox)) fail(`a right click: pinned ${await pinned()}, ${(await count()) - n0} sent, the group ${JSON.stringify(await ids())}`)
  say('a right click dropped the pin and kept the group, nothing sent')

  // an Alt-drag pins the group spread along a line, Enter sends it there
  all = await units()
  const lead = all.find((u) => u.id === inBox[0])
  let la = null, lb = null
  for (const [z0, z1] of [[-6, 6], [-4, 8], [-8, 4], [-3, 3], [0, 10], [-10, 0], [2, 9], [-9, -2]]) {
    const p0 = await toScreen(lead.pos.x, lead.pos.z + z0), p1 = await toScreen(lead.pos.x, lead.pos.z + z1)
    if ((await clear(p0)) && (await clear(p1, 0))) {
      la = { p: p0, z: lead.pos.z + z0 }
      lb = { p: p1, z: lead.pos.z + z1 }
      break
    }
  }
  if (!la) fail('no clear ground to drag a line on')
  n0 = await count()
  await page.keyboard.down('Alt')
  await page.mouse.move(la.p.x, la.p.y)
  await page.mouse.down()
  await page.mouse.move((la.p.x + lb.p.x) / 2, (la.p.y + lb.p.y) / 2, { steps: 4 })
  await page.mouse.move(lb.p.x, lb.p.y, { steps: 4 })
  await page.mouse.up()
  await page.keyboard.up('Alt')
  await sleep(400)
  const pin = await ev(() => window.__ts.group.pin())
  if (!pin?.line || (await count()) !== n0) fail(`an Alt-drag: pinned ${JSON.stringify(pin)}, ${(await count()) - n0} sent`)
  // each member's cell near the line (a 6"-12" line holds the group in one rank)
  const off = pin.members.filter((m) => m.at).map((m) => {
    const { a, b } = pin.line, len = Math.hypot(b.x - a.x, b.z - a.z), t = Math.max(0, Math.min(len, ((m.at.x - a.x) * (b.x - a.x) + (m.at.z - a.z) * (b.z - a.z)) / len))
    return Math.hypot(m.at.x - (a.x + ((b.x - a.x) * t) / len), m.at.z - (a.z + ((b.z - a.z) * t) / len))
  })
  if (!off.length || Math.max(...off) > 2.5) fail(`the line's formation: members ${off.map((d) => d.toFixed(1))}" off the line`)
  await snap('line-pinned')
  await page.keyboard.press('Enter')
  await settled()
  after = await units()
  const astray = pin.members.filter((m) => m.at && after.find((u) => u.id === m.id)?.pos.x !== m.at.x)
  if (astray.length) fail(`sent along the line, ${astray.length} members stand elsewhere than their ghosts`)
  say(`an Alt-drag pinned the group along a line (every member within ${Math.max(...off).toFixed(1)}" of it), nothing sent; Enter put each where its ghost stood`)

  // a box over the enemy says what it holds, and picks none of it
  await rest()
  all = await units()
  const foes = all.filter((u) => u.side !== s && u.on)
  const fb = [Math.min(...foes.map((u) => u.x)) - 6, Math.min(...foes.map((u) => u.y)) - 6, Math.max(...foes.map((u) => u.x)) + 6, Math.max(...foes.map((u) => u.y)) + 6]
  const under = all.filter((u) => u.side !== s && u.on && u.x >= fb[0] && u.x <= fb[2] && u.y >= fb[1] && u.y <= fb[3])
  const mineUnder = all.filter((u) => u.side === s && u.on && u.x >= fb[0] && u.x <= fb[2] && u.y >= fb[1] && u.y <= fb[3]).map((u) => u.id)
  const models = await ev((xs) => xs.reduce((n, id) => n + window.__ts.G.units.find((u) => u.id === id).alive, 0), under.map((u) => u.id))
  await page.keyboard.down('Shift')
  await page.mouse.move(fb[0], fb[1])
  await page.mouse.down()
  await page.mouse.move(fb[2], fb[3], { steps: 6 })
  const said = await ev(() => document.querySelector('#selbox').textContent)
  await page.mouse.up()
  await page.keyboard.up('Shift')
  await sleep(300)
  const want2 = `${under.length} enemy unit${under.length > 1 ? 's' : ''} · ${models} models`
  if (said !== want2) fail(`a box over the enemy said "${said}", not "${want2}"`)
  if (!same(await ids(), mineUnder.length >= 2 ? mineUnder : (await ids()).filter((id) => mineUnder.includes(id)))) fail(`a box over the enemy picked ${JSON.stringify(await ids())}`)
  if ((await ids()).some((id) => all.find((u) => u.id === id)?.side !== s)) fail('a box picked an enemy')
  say(`a box over the enemy said "${said}" and picked none of it`)

  // a double click on a unit: every one of its type on screen
  await rest()
  all = await units()
  const types = await ev((s) => {
    const by = {}
    for (const u of window.__ts.G.units) if (u.side === s && u.alive > 0) (by[u.t.short] ??= []).push(u.id)
    return Object.values(by).filter((xs) => xs.length >= 2)
  }, s)
  let dbl = null
  for (const kin of types) {
    const on = kin.filter((id) => all.find((u) => u.id === id)?.on)
    if (on.length < 2) continue
    const u = all.find((x) => x.id === on[0])
    if (all.some((o) => o.on && o.id !== u.id && Math.hypot(o.x - u.x, o.y - u.y) < 24)) continue
    await ev(() => window.__ts.group.select([]))
    await page.mouse.dblclick(u.x, u.y)
    await sleep(400)
    if (!same(await ids(), on)) fail(`a double click on unit ${u.id} picked ${JSON.stringify(await ids())}, its type on screen is ${JSON.stringify(on)}`)
    dbl = on
    break
  }
  if (!dbl) say('(no type with two units on screen, one clear to click: the double click untried)')
  else say(`a double click on a unit picked the ${dbl.length} of its type on screen`)
  const cardLine = await ev(() => document.querySelector('#card .card-group')?.textContent ?? '')
  if (dbl && !/selected/.test(cardLine)) fail(`the card shows no group line with ${dbl.length} picked ("${cardLine}")`)

  // Ready N: every unit still to place
  const rb = await ev(() => ({ text: document.querySelector('#readyN').textContent, shown: !document.querySelector('#readyN').classList.contains('hidden') }))
  const seatAll = (await units()).filter((u) => u.side === s).map((u) => u.id)
  if (!rb.shown || rb.text !== `Ready ${seatAll.length}`) fail(`Ready N: ${JSON.stringify(rb)}, the seat has ${seatAll.length}`)
  await page.click('#readyN')
  await sleep(300)
  if (!same(await ids(), seatAll)) fail(`Ready ${seatAll.length} picked ${JSON.stringify(await ids())}`)
  say(`"${rb.text}" picked every unit of the seat`)

  // Tab: each of the seat's units once, then round again
  const seatIds = all.filter((u) => u.side === s).map((u) => u.id)
  const seen = []
  for (let k = 0; k <= seatIds.length; k++) {
    await page.keyboard.press('Tab')
    await sleep(120)
    const g = await ids()
    if (g.length !== 1) fail(`Tab left ${g.length} picked`)
    seen.push(g[0])
  }
  if (!same(seen.slice(0, -1), seatIds) || seen.at(-1) !== seen[0]) fail(`Tab visited ${JSON.stringify(seen)}; the seat's units are ${JSON.stringify(seatIds)}`)
  if (!(await ev(() => document.querySelector('#groupbar').classList.contains('hidden')))) fail('the group bar is up with one unit picked')
  say(`Tab visited each of seat ${s}'s ${seatIds.length} units once and came round again`)

  // the picker: a touch a little off a far figure finds it where the mouse
  // there finds nothing
  await rest()
  all = await units()
  let fell = null
  const far = all.filter((u) => u.on).sort((p, q) => p.px - q.px)
  for (const u of far.slice(0, 8)) {
    for (const [dx, dy] of [[0, 1], [1, 0], [-1, 0], [0, -1], [0.7, 0.7], [-0.7, 0.7]]) {
      const d = 19
      const q = { x: u.x + dx * d, y: u.y + dy * d }
      if (all.some((o) => o.on && o.id !== u.id && Math.hypot(o.x - q.x, o.y - q.y) < 40)) continue
      const m = await ev(({ x, y }) => window.__ts.group.pick(x, y, 'mouse'), q)
      const t = await ev(({ x, y }) => window.__ts.group.pick(x, y, 'touch'), q)
      if (m.unit === null && t.unit === u.id) {
        fell = { u: u.id, px: Math.round(u.px) }
        break
      }
      if (t.unit !== null && t.unit !== u.id) fail(`a touch 19 px off unit ${u.id} picked unit ${t.unit}`)
    }
    if (fell) break
  }
  if (!fell) fail('no far figure where a touch 19 px off picks it and a mouse picks nothing')
  say(`picker: a touch 19 px off unit ${fell.u} (its base ${fell.px} px across the radius) picks it; the mouse there picks nothing`)

  // ▭ Select on touch (real touches, through CDP): one finger draws a box,
  // the camera still; two fingers pan the camera and pick nothing
  await rest()
  all = await units()
  const cdp = await page.context().newCDPSession(page)
  const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map(([x, y], id) => ({ x, y, id })) })
  const camAt = () => ev(() => window.__ts.camera.position.toArray().map((v) => Math.round(v * 1000)).join())
  await ev(() => document.querySelector('#selectMode').click())
  if (!(await ev(() => document.querySelector('#selectMode').classList.contains('on')))) fail('▭ Select did not come on')
  const top = all.filter((u) => u.side === s && u.on).sort((p, q) => p.y - q.y)
  const upper = top.slice(0, Math.max(2, Math.ceil(top.length / 2)))
  const tb = [Math.min(...upper.map((u) => u.x)) - 6, Math.min(...upper.map((u) => u.y)) - 6, Math.max(...upper.map((u) => u.x)) + 6, Math.max(...upper.map((u) => u.y)) + 6]
  const want = top.filter((u) => u.x >= tb[0] && u.x <= tb[2] && u.y >= tb[1] && u.y <= tb[3]).map((u) => u.id)
  let cam0 = await camAt()
  await touch('touchStart', [[tb[0], tb[1]]])
  for (let k = 1; k <= 6; k++) await touch('touchMove', [[tb[0] + ((tb[2] - tb[0]) * k) / 6, tb[1] + ((tb[3] - tb[1]) * k) / 6]])
  await touch('touchEnd', [])
  await sleep(400)
  got = await ids()
  if (!same(got, want)) fail(`a finger's box in Select mode picked ${JSON.stringify(got)}, the units inside it are ${JSON.stringify(want)}`)
  if ((await camAt()) !== cam0) fail("a finger's box in Select mode moved the camera")
  const fx = 640, fy = 420
  cam0 = await camAt()
  await touch('touchStart', [[fx - 70, fy]])
  await touch('touchStart', [[fx - 70, fy], [fx + 70, fy]])
  for (let k = 1; k <= 10; k++) await touch('touchMove', [[fx - 70, fy - 9 * k], [fx + 70, fy - 9 * k]])
  await touch('touchEnd', [])
  await sleep(600)
  if ((await camAt()) === cam0) fail('two fingers in Select mode left the camera where it was')
  if (!same(await ids(), want) || !(await ev(() => document.querySelector('#selbox').classList.contains('hidden')))) fail(`two fingers in Select mode changed the group (${JSON.stringify(await ids())}) or left a box up`)
  await ev(() => document.querySelector('#selectMode').click())
  say(`▭ Select: a finger's box picked exactly the ${want.length} units inside it, the camera still; two fingers moved the camera, the group kept`)

  // a long press on one of the seat's units takes it out of the group (and
  // back in), and its lift is no click
  await rest()
  all = await units()
  const held = want.map((id) => all.find((u) => u.id === id)).find((u) => u.on && all.every((o) => o.id === u.id || !o.on || Math.hypot(o.x - u.x, o.y - u.y) > 30))
  if (!held) fail('no member clear enough on screen for a long press')
  const before2 = await ids()
  for (const [k, inGroup] of [[1, false], [2, true]]) {
    await touch('touchStart', [[held.x, held.y]])
    await sleep(700)
    await touch('touchEnd', [])
    await sleep(300)
    const g = await ids()
    if (g.includes(held.id) !== inGroup || g.length !== before2.length - (inGroup ? 0 : 1)) fail(`long press ${k} on unit ${held.id} left the group ${JSON.stringify(g)}`)
  }
  say(`a long press took unit ${held.id} out of the group, a second put it back`)

  // Begin battle for each seat deploying here
  for (let k = 0; k < 2; k++) {
    await page.waitForFunction(() => {
      const el = document.querySelector('#endPhase')
      return getComputedStyle(el).display !== 'none' && !el.disabled
    }, null, { timeout: IDLE_MS })
    if ((await ev(() => window.__ts.session.G.pending?.k)) !== 'deploy') break
    await page.click('#endPhase')
    await sleep(800)
  }

  // ── The movement phase ───────────────────────────────────────────────────
  await page.waitForFunction(() => {
    const G = window.__ts.session.G
    return G.pending?.k === 'phase' && G.pending.phase === 'move' && window.__ts.session.decisionFor() >= 0 && window.__ts.player.idle
  }, null, { timeout: IDLE_MS })
  await rest()
  const t = await seatNow()
  all = await units()
  const ours = all.filter((u) => u.side === t)
  await ev((xs) => window.__ts.group.select(xs), ours.slice(0, 2).map((u) => u.id))
  b = await bar()
  if (!b.show || b.verbs[0]?.k !== 'move') fail(`the bar in the movement phase: ${JSON.stringify(b)}`)
  say(`movement: the bar says ${b.verbs[0].label}`)

  // Tab: each unit still to act once
  const tabbed = []
  for (let k = 0; k <= ours.length; k++) {
    await page.keyboard.press('Tab')
    await sleep(120)
    tabbed.push((await ids())[0])
  }
  if (!same(tabbed.slice(0, -1), ours.map((u) => u.id)) || tabbed.at(-1) !== tabbed[0]) fail(`Tab in the movement phase visited ${JSON.stringify(tabbed)}`)
  say(`Tab visited each of seat ${t}'s ${ours.length} units still to act once`)
  await rest()

  // (the seat's longest gun stays put through the movement phase, so the
  // shooting phase has someone to play: the engine skips a phase where
  // nothing can act)
  const gun = [...ours].sort((p, q) => q.range - p.range)[0].id
  const movers = ours.filter((u) => u.id !== gun)

  // a group of three, one of them moved (its lead, by the match's own
  // command): once the table has caught up the other two are still picked
  const trio = movers.slice(0, 3).map((u) => u.id)
  await ev((xs) => window.__ts.group.select(xs), trio)
  const lead3 = trio[2]
  const cell = await ev((id) => window.__ts.session.preview((G, q) => {
    const u = G.units.find((x) => x.id === id), plan = q.movePlan(G, u, 0)
    for (let i = 0; i < G.nav.N; i++) if (plan.res.dist[i] > 1 && Number.isFinite(plan.res.dist[i]) && q.validEnd(G, plan, i)) return i
    return -1
  }), lead3)
  if (cell < 0) fail(`no cell for unit ${lead3} to move to`)
  await ev(([id, c]) => window.__ts.doMove(window.__ts.session.G.units.find((u) => u.id === id), c), [lead3, cell])
  await settled()
  got = await ids()
  if (!same(got, trio.slice(0, 2)) || !(await bar()).show) fail(`a group of ${JSON.stringify(trio)} whose lead ${lead3} moved: ${JSON.stringify(got)} picked once the table caught up (the other two should be, the bar up)`)
  say(`a group of 3 whose lead moved kept the other 2 picked, the bar up, once the table caught up`)

  // one unit: a ground click moves it at once
  all = await units()
  const toward = (u) => (u.pos.x < 0 ? 1 : -1)
  let solo = null
  for (const u of all.filter((x) => x.side === t && x.on && !x.moved && x.id !== gun)) {
    await ev((id) => window.__ts.group.select([id]), u.id)
    await sleep(150)
    const q = await groundNear(u.pos.x, u.pos.z, [[toward(u) * 2, 0], [toward(u) * 2, 1], [toward(u) * 2, -1], [toward(u) * 3, 0]])
    if (!q) continue
    n0 = await count()
    before = await units()
    await page.mouse.click(q.x, q.y)
    n1 = await settled()
    if (await pinned()) fail('one unit\'s ground click pinned a formation')
    went = moved(before, await units())
    if (n1 === n0 + 1 && same(went, [u.id])) {
      solo = u.id
      break
    }
    if (n1 !== n0) fail(`one unit's ground click sent ${n1 - n0} and moved ${JSON.stringify(went)}`)
  }
  if (solo === null) fail('no unit moved by its own ground click')
  say(`one unit's ground click moved unit ${solo} at once, nothing pinned`)
  await snap('solo')

  // a group: a click pins, a second on the flag sends it
  await rest()
  all = await units()
  const free = all.filter((u) => u.side === t && u.id !== solo && u.on && !u.moved && u.id !== gun).slice(0, 2)
  if (free.length < 2) fail('fewer than two units left to move as a group')
  await ev((xs) => window.__ts.group.select(xs), free.map((u) => u.id))
  const cx = free.reduce((n, u) => n + u.pos.x, 0) / free.length, cz = free.reduce((n, u) => n + u.pos.z, 0) / free.length
  const g3 = await groundNear(cx, cz, [[toward(free[0]) * 3, 0], [toward(free[0]) * 3, 2], [toward(free[0]) * 3, -2], [toward(free[0]) * 4, 0], [toward(free[0]) * 2, 0]])
  if (!g3) fail('no clear ground ahead of the group')
  n0 = await count()
  await page.mouse.click(g3.x, g3.y)
  await sleep(600)
  if (!(await pinned()) || (await count()) !== n0) fail(`a group's ground click: pinned ${await pinned()}, ${(await count()) - n0} sent (picked ${JSON.stringify(await ids())}, at ${Math.round(g3.x)},${Math.round(g3.y)} the picker finds ${JSON.stringify(await ev(({ x, y }) => window.__ts.group.pick(x, y), g3))}; bar ${JSON.stringify(await bar())})`)
  b = await bar()
  if (!b.pinned) fail('the bar shows no ✓ Send with a formation pinned')
  await snap('group-pinned')
  before = await units()
  await page.mouse.click(g3.x, g3.y)
  n1 = await settled()
  went = moved(before, await units())
  if (n1 === n0 || (await pinned())) fail(`the group's flag: ${n1 - n0} sent, pinned ${await pinned()}`)
  if (went.some((id) => !free.some((u) => u.id === id))) fail(`the group's move moved units outside it: ${JSON.stringify(went)}`)
  say(`a group of ${free.length}: a ground click pinned, the flag sent ${n1 - n0} moves, ${went.length} members moved, nothing else`)
  await snap('group-moved')

  // +D6: two more members advance, then move
  await rest()
  all = await units()
  const left2 = all.filter((u) => u.side === t && !u.moved && u.on && u.id !== gun).slice(0, 2)
  if (left2.length === 2) {
    await ev((xs) => window.__ts.group.select(xs), left2.map((u) => u.id))
    await page.click('#groupbar .gadv')
    await sleep(200)
    if (!(await bar()).advance) fail('+D6 did not come on')
    const ax = left2.reduce((n, u) => n + u.pos.x, 0) / 2, az = left2.reduce((n, u) => n + u.pos.z, 0) / 2
    const g4 = await groundNear(ax, az, [[toward(left2[0]) * 5, 0], [toward(left2[0]) * 5, 2], [toward(left2[0]) * 4, -2], [toward(left2[0]) * 3, 0]])
    if (!g4) fail('no clear ground ahead of the +D6 group')
    n0 = await count()
    await page.mouse.click(g4.x, g4.y)
    await sleep(600)
    if (!/\+D6 each/.test((await bar()).summary)) fail(`the +D6 pin's summary: "${(await bar()).summary}"`)
    await page.keyboard.press('Enter')
    n1 = await settled()
    const sent = await ev((n) => window.__ts.session.store.entries().slice(n).map((e) => e.t), n0)
    if (sent.filter((k) => k === 'advance').length !== 2 || sent.filter((k) => k === 'move').length < 1) fail(`+D6 sent ${JSON.stringify(sent)}`)
    await page.click('#groupbar .gadv').catch(() => {})
    say(`+D6: the group's 2 members advanced, then ${sent.filter((k) => k === 'move').length} moved`)
  } else say('(fewer than two units left to move: +D6 untried)')

  // the chips grey with how many of a type can't act now
  await ev((xs) => window.__ts.group.select(xs), ours.map((u) => u.id))
  b = await bar()
  if (!b.chips.some((c) => /can't act now/.test(c.why))) fail(`no chip greyed with units that have moved: ${JSON.stringify(b.chips)}`)
  say(`chips: ${b.chips.filter((c) => c.why).map((c) => `${c.name} (${c.why})`).join(', ')}`)

  // Space: the camera to the group
  await ev((xs) => window.__ts.group.select(xs), ours.slice(-2).map((u) => u.id))
  const t0 = await ev(() => window.__ts.controls.target.toArray())
  await page.keyboard.press(' ')
  const mid = await ev((xs) => {
    const us = xs.map((id) => window.__ts.G.units.find((u) => u.id === id))
    return [us.reduce((n, u) => n + u.pos.x, 0) / us.length, us.reduce((n, u) => n + u.pos.z, 0) / us.length]
  }, ours.slice(-2).map((u) => u.id))
  // (the glide's 0.6 s of game time runs several seconds under SwiftShader)
  let t1
  for (let k = 0; k < 40; k++) {
    t1 = await ev(() => window.__ts.controls.target.toArray())
    if (Math.hypot(t1[0] - mid[0], t1[2] - mid[1]) <= 0.5) break
    await sleep(500)
  }
  if (Math.hypot(t1[0] - mid[0], t1[2] - mid[1]) > 0.5) fail(`Space: the camera looks at ${t1.map((v) => v.toFixed(1))}, the group stands at ${mid.map((v) => v.toFixed(1))} (it looked at ${t0.map((v) => v.toFixed(1))})`)
  say('Space glided the camera to the group')

  // Esc with a group and no pin lets go
  await ev((xs) => window.__ts.group.select(xs), ours.map((u) => u.id))
  if ((await ids()).length < 2) fail('no group to let go of')
  await page.keyboard.press('Escape')
  await sleep(250)
  if ((await ids()).length) fail(`Esc with no pin left ${JSON.stringify(await ids())} picked`)
  say('Esc with a group and no pin let it go')

  // ── The shooting phase ───────────────────────────────────────────────────
  await page.click('#endPhase')
  await page.waitForFunction(() => window.__ts.session.G.pending?.phase === 'shoot' && window.__ts.player.idle, null, { timeout: IDLE_MS })
  await ev((xs) => window.__ts.group.select(xs), ours.filter((u) => u.id !== solo).slice(0, 2).map((u) => u.id))
  b = await bar()
  if (!b.show || b.verbs[0]?.k !== 'shoot') fail(`the bar in the shooting phase: ${JSON.stringify(b)}`)
  say(`shooting: the bar says ${b.verbs[0].label}`)

  // a group fires at an enemy some of it can reach: once the table has
  // caught up, the members still able to act are still picked
  await rest()
  const shooters = await ev((t) => window.__ts.session.preview((G, q) => {
    const ours = G.units.filter((u) => u.side === t && u.alive > 0 && q.canAct(G, u)).map((u) => u.id)
    const foes = G.units.filter((u) => u.side !== t && u.alive > 0).map((tg) => ({ tg: tg.id, n: ours.filter((id) => q.shootTargets(G, G.units.find((u) => u.id === id)).some((x) => x.id === tg.id)).length }))
    return { ours, foe: foes.filter((f) => f.n > 0 && f.n < ours.length).sort((p, q) => q.n - p.n)[0] ?? null }
  }), t)
  if (!shooters.foe || shooters.ours.length < 2) say('(no enemy only some of the group can shoot: the leftovers untried)')
  else {
    all = await units()
    const tg = all.find((u) => u.id === shooters.foe.tg)
    await ev((xs) => window.__ts.group.select(xs), shooters.ours)
    n0 = await count()
    if (!tg?.on || (await ev(({ x, y }) => window.__ts.group.pick(x, y).unit, tg)) !== tg.id) say(`(the target, unit ${tg?.id}, isn't clear to click: the leftovers untried)`)
    else {
      await page.mouse.click(tg.x, tg.y)
      n1 = await settled()
      const left = await ids()
      const still = await ev((xs) => window.__ts.session.preview((G, q) => xs.filter((id) => q.canAct(G, G.units.find((u) => u.id === id)))), shooters.ours)
      if (n1 === n0) fail(`a group's Fire at unit ${tg.id} sent nothing`)
      if (!same(left, still) || !left.length) fail(`after the group fired ${n1 - n0} shots, ${JSON.stringify(left)} are picked; the members still able to act are ${JSON.stringify(still)}`)
      say(`a group of ${shooters.ours.length} fired ${n1 - n0} shots at unit ${tg.id}; once the table caught up the ${left.length} that hadn't stayed picked ("${(await bar()).note}")`)
    }
  }


  // ── The other seat's movement phase ─────────────────────────────────────
  // End through the rest of the turn (a phase nobody can act in is skipped)
  const t2 = 1 - t
  for (let k = 0; k < 4; k++) {
    const P = await ev(() => ({ phase: window.__ts.session.G.pending?.phase, seats: window.__ts.session.G.pending?.seats }))
    if (P.phase === 'move' && P.seats?.includes(t2)) break
    const was = JSON.stringify(P)
    await page.click('#endPhase')
    await page.waitForFunction((was) => window.__ts.player.idle && JSON.stringify({ phase: window.__ts.session.G.pending?.phase, seats: window.__ts.session.G.pending?.seats }) !== was, was, { timeout: IDLE_MS })
  }
  await page.waitForFunction((t2) => window.__ts.session.G.pending?.phase === 'move' && window.__ts.session.G.pending.seats.includes(t2) && window.__ts.player.idle, t2, { timeout: IDLE_MS })

  // (F10b) 🤖 Auto these: one pilot for the group, its mask the group's,
  // the phase still the seat's, and nobody outside the group moved
  await rest()
  const able = await ev((t) => window.__ts.session.preview((G, q) => G.units.filter((u) => u.side === t && u.alive > 0 && q.canAct(G, u)).map((u) => u.id)), t2)
  if (able.length < 2) fail(`seat ${t2}'s movement phase opens with ${able.length} units able to move`)
  else {
    const crew = able.slice(0, 2)
    await ev((xs) => window.__ts.group.select(xs), crew)
    b = await bar()
    if (!b.pilot?.n) fail(`the bar offers no Auto these for a group that can move: ${JSON.stringify(b.pilot)}`)
    const look = (t) => window.__ts.G.units.filter((u) => u.side === t).map((u) => [u.id, `${u.pos.x},${u.pos.z},${!!u.flags.moved}`])
    const before = await ev(look, t2)
    n0 = await count()
    await page.click('#groupbar .gpilot')
    n1 = await settled()
    const sent = await ev((n) => window.__ts.session.store.entries().slice(n).map(({ t, m }) => ({ t, m })), n0)
    const want = await ev(({ t, crew }) => window.__ts.session.preview((G, q) => q.maskOf(G, t, crew)), { t: t2, crew })
    if (sent.length !== 1 || sent[0].t !== 'pilot' || sent[0].m !== want) fail(`Auto these sent ${JSON.stringify(sent)}, not one pilot with mask ${want}`)
    const P = await ev(() => ({ phase: window.__ts.session.G.pending?.phase, seats: window.__ts.session.G.pending?.seats }))
    if (P.phase !== 'move' || !P.seats?.includes(t2)) fail(`after Auto these the match waits on ${JSON.stringify(P)}, not seat ${t2}'s movement phase`)
    const after = await ev(look, t2)
    const strays = after.filter(([id, x], i) => !crew.includes(id) && x !== before[i][1]).map(([id]) => id)
    if (strays.length) fail(`Auto these moved units outside the group: ${JSON.stringify(strays)}`)
    const went = after.filter(([id, x], i) => crew.includes(id) && x !== before[i][1]).length
    say(`Auto these: one pilot (mask ${want}) for ${crew.length} units, ${went} of them moved, nobody else; the movement phase still the seat's`)
  }
}

const work = mkdtempSync(join(tmpdir(), 'input-check-'))
if (a.shots) mkdirSync(a.shots, { recursive: true })
let ok = false
try {
  const dist = a.dist ?? (await buildApp(PKG, join(work, 'dist')))
  const { url, close } = await startStaticServer(dist)
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
  try {
    const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true })).newPage()
    page.setDefaultTimeout(IDLE_MS)
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`))
    console.log('input-check (F10a): the group input in Chromium, by mouse and keys\n')
    await page.goto(`${url}/?debug&lowfi&seed=4242&dice=1`)
    await page.waitForSelector('#title:not(.hidden)')
    await page.click('[data-mode="hotseat"]')
    await page.click('#setupStart')
    try {
      await check(page, (l) => console.log(`  ok   ${l}`))
      ok = !errors.length
    } catch (e) {
      console.log(`  FAIL ${e.message}`)
    }
    if (errors.length) console.log(`  FAIL page errors:\n         ${errors.slice(0, 5).join('\n         ')}`)
  } finally {
    await browser.close()
    close()
  }
} finally {
  rmSync(work, { recursive: true, force: true })
}
console.log(ok ? '\ninput-check passed: box, Shift-click, pin and send, Esc, Tab, the touch fallback, Select mode and the bar, by mouse, keys and fingers' : '\ninput-check FAILED')
process.exit(ok ? 0 : 1)
