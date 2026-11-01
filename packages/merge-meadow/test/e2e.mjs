#!/usr/bin/env node
// End-to-end check of the BUILT app (design §12 with the §16.15 assertions).
//   npm run build -w @vibe-dump/merge-meadow   (first: this serves dist/)
//   node test/e2e.mjs [--keep] [--only=safe]  (CHROMIUM_PATH=… to pick a browser; MM_E2E_OUT=dir)
//
// Everything is local: an in-process @automerge/automerge-repo-sync-server on a
// free port (every link carries &sync=ws://127.0.0.1:<port>), dist/ served at a
// Pages-like sub-path, headless Chromium (≤3 pages at once, §16.15), and the
// Node agent (MCP over stdio, connect()) against the same server. It never
// touches wss://sync.automerge.org.
//
// Phases, in order (each prints `ok - …` / `NOT OK - …`; exit 1 on any failure):
//   boot       a doc-less link shows the launcher and creates nothing; New world -> Animal
//              meadow creates it in place (hash rewritten, seeded, rigs, boot order, scene,
//              editor); a second tab (on #sync=none) lists it under Your worlds and Forget
//              removes it; #new=blank&sync=…&safe makes a blank world with one lamp on the
//              hash's server, safe flag kept; Back / Forward plant no second world; Paste a
//              link opens in place (pushState, Back to the launcher); Open a file imports
//   join       a second browser context joins through the sync server; presence; host = A
//   spawns     each page sees the other's spawn
//   chase      A's T-rex chases a sheep spawned in B; B's displayed pose vs A's 160 ms earlier
//   hits       the kill's hits are in the doc exactly once
//   system     a doc system defined in A runs in B (and hot-swaps)
//   ride       B (not the host) rides a horse: both pages agree the rider's peer owns it
//   hidden     A's tab goes to the background (no frames, timers still run): B hosts
//              and keeps hosting; A comes back as a newcomer, then hosts again
//   upgrade    billboard -> primitive -> tree -> tree + animations -> rig (horse) -> glTF -> billboard:
//              the same root, the tree's meshes kept, no resources left
//   keys       wrong key cannot attach; a view link attenuates (live and local)
//   handoff    A closes gracefully -> B hosts within 250 ms and simulates the T-rex
//   mcp        the MCP server (stdio) through B: spawn, set, replace to a rig, models, define_model
//              (a scratch 'mage'; a syntax error is refused), define_system, capture returns an image
//   local      no page open: MCP falls back to local mode; define_model; the doc history check
//   rigs       a fresh world (#new=meadow): 300 rigs of two library models animating (CPU
//              ms/frame), the inspector's preview state with the sim idle, the dead group
//              tinting a rig, every zoo preset spawned from the palette, the palette search
//   thumb      the gallery thumbnail's clicks on a bare URL (New world -> Animal meadow,
//              both panel toggles) end on the rendered meadow with no panels
//   safe       an infinite-loop system hangs a tab; the next load of that doc is in safe mode
import 'ses/assert-shim.js'
import '@endo/eventual-send/shim.js'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import http from 'node:http'
import net from 'node:net'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { E } from '@endo/far'
import * as Automerge from '@automerge/automerge'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { connect } from '../agent/lib/connect.mjs'
import { connectCapTP, aesKey } from '../src/agent/transport.js'
import { parseLink, buildLink, newKey } from '../src/net/link.js'
import { templateEntities } from '../src/doc/templates.js'
import { MODEL_LIBRARY } from '../src/doc/models.js'
import { ZOO_PRESETS } from '../src/doc/presets-zoo.js'

const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const PKG = fileURLToPath(new URL('..', import.meta.url))
const DIST = path.join(PKG, 'dist')
const OUT = process.env.MM_E2E_OUT || path.join(os.tmpdir(), 'merge-meadow-e2e')
const PREFIX = '/vibe-dump/merge-meadow/'
const KEEP = process.argv.includes('--keep')
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) ?? '').slice(7) // --only=safe | --only=rigs | --only=thumb (debugging)
const SAFE_PEER = process.env.MM_E2E_SAFE_PEER ?? 'p_cccccccc03' // 'random' = a fresh id per tab
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const T_START = Date.now()

// ---------------------------------------------------------------- reporting
const results = []
let failed = 0
function ok (cond, msg, detail) {
  results.push({ ok: !!cond, msg, detail })
  if (!cond) failed++
  console.log(`${cond ? 'ok' : 'NOT OK'} - ${msg}${detail !== undefined ? '  ' + (typeof detail === 'string' ? detail : JSON.stringify(detail)) : ''}`)
  return !!cond
}
const phase = (name) => console.log(`\n# ${name}  (+${((Date.now() - T_START) / 1000).toFixed(1)} s)`)
const stat = (xs) => {
  if (!xs.length) return null
  const s = [...xs].sort((a, b) => a - b)
  return { n: s.length, mean: +(s.reduce((a, b) => a + b, 0) / s.length).toFixed(3), p95: +s[Math.floor(s.length * 0.95)].toFixed(3), max: +s[s.length - 1].toFixed(3) }
}

// ---------------------------------------------------------------- infrastructure
const freePort = () => new Promise((resolve, reject) => {
  const s = net.createServer(); s.unref(); s.on('error', reject)
  s.listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => resolve(port)) })
})

// dist/ mounted at a sub-path, like Pages' /vibe-dump/<slug>/ (base './' must hold)
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.wasm': 'application/wasm', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon' }
function serveDist (root, port) {
  return new Promise((resolve) => {
    const s = http.createServer((q, r) => {
      let p = decodeURIComponent(q.url.split('?')[0].split('#')[0])
      // Chromium fetches /favicon.ico for any page without an icon, sometimes; a 404 there
      // would count as a console error, so the stub declares one and the server answers 204.
      if (p === '/favicon.ico') { r.writeHead(204); return r.end() }
      if (p === '/probe') { r.writeHead(200, { 'content-type': 'text/html' }); return r.end('<!doctype html><title>probe</title><link rel="icon" href="data:,">') }
      if (!p.startsWith(PREFIX)) { r.writeHead(404); return r.end('outside the sub-path') }
      if (p === PREFIX + '__e2e/tri.gltf') {
        const delay = Number(new URL(q.url, 'http://x').searchParams.get('delay') ?? 0)
        return setTimeout(() => { r.writeHead(200, { 'content-type': 'model/gltf+json' }); r.end(TRI_GLTF) }, delay)
      }
      p = p.slice(PREFIX.length); if (p === '' || p.endsWith('/')) p += 'index.html'
      const f = path.join(root, p)
      if (!f.startsWith(root)) { r.writeHead(403); return r.end() }
      fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); r.end() } else { r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); r.end(b) } })
    }).listen(port, '127.0.0.1', () => resolve(s))
  })
}

// a one-triangle glTF 2.0 (the buffer inline), for the async `model` kind
const TRI_GLTF = JSON.stringify({
  asset: { version: '2.0' }, scene: 0, scenes: [{ nodes: [0] }], nodes: [{ mesh: 0, name: 'Tri' }],
  meshes: [{ primitives: [{ attributes: { POSITION: 0 } }] }],
  buffers: [{ byteLength: 36, uri: 'data:application/octet-stream;base64,' + Buffer.from(new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]).buffer).toString('base64') }],
  bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: 36, target: 34962 }],
  accessors: [{ bufferView: 0, componentType: 5126, count: 3, type: 'VEC3', min: [0, 0, 0], max: [1, 1, 0] }],
})
// the real sync server, in process, with its own data dir
async function startSyncServer (port) {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mm-sync-'))
  process.env.PORT = String(port); process.env.DATA_DIR = dataDir
  const { Server } = await import('@automerge/automerge-repo-sync-server/src/server.js')
  const log = console.log; console.log = () => {} // it prints "Listening on port …" and its storage id
  const server = new Server()
  await server.ready()
  setTimeout(() => { console.log = log }, 200)
  return { server, dataDir, close: () => { try { server.close() } catch {} } }
}

async function launch () {
  const args = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']
  const opts = { args }
  if (process.env.CHROMIUM_PATH) return { browser: await chromium.launch({ ...opts, executablePath: process.env.CHROMIUM_PATH }), exe: process.env.CHROMIUM_PATH }
  try { return { browser: await chromium.launch(opts), exe: chromium.executablePath() } } catch (e) {
    const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers'
    const dirs = fs.existsSync(base) ? fs.readdirSync(base).sort().reverse() : []
    const cands = [
      ...dirs.filter((d) => /^chromium_headless_shell-\d+$/.test(d)).map((d) => path.join(base, d, 'chrome-headless-shell-linux64/chrome-headless-shell')),
      ...dirs.filter((d) => /^chromium-\d+$/.test(d)).flatMap((d) => [path.join(base, d, 'chrome-linux64/chrome'), path.join(base, d, 'chrome-linux/chrome')]),
    ]
    for (const exe of cands) if (fs.existsSync(exe)) return { browser: await chromium.launch({ ...opts, executablePath: exe }), exe }
    throw e
  }
}

// console 'error' messages and page errors, per page (SES warns on every load: warnings are fine, §16.15)
const consoleErrors = []
function watchPage (page, tag) {
  page.on('pageerror', (e) => consoleErrors.push(`${tag} pageerror: ${e.message}`))
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(`${tag}: ${m.text().slice(0, 300)}`) })
}
const openPages = new Set()
// skip (on=false) or restore the WebGL draw call of the main loop, nothing else
const setDrawing = (pages, on) => Promise.all(pages.map((p) => p.evaluate((on) => {
  const st = window.__mm.stage
  if (!on && !window.__draw) { window.__draw = st.render; st.render = () => {} } else if (on && window.__draw) { st.render = window.__draw; window.__draw = null }
}, on)))
// SwiftShader renders 1280×800 at ~15 fps on one browser and far less with two
// contending, which would starve the frame-sampled checks; the pages run at 640×400
// (≥25 fps) except for the boot screenshot.
const SMALL = { width: 640, height: 400 }
async function newTab (ctx, tag, { viewport = SMALL, peer } = {}) {
  if (openPages.size >= 3) throw new Error(`refusing a 4th page (${tag}): ≤3 headless pages per box (§16.15)`)
  const page = await ctx.newPage({ viewport })
  openPages.add(page); page.on('close', () => openPages.delete(page))
  watchPage(page, tag)
  // a second tab of a context with a fixed peer id needs its own: the sync server
  // and the BroadcastChannel would take two tabs with one id for one peer
  if (peer) await page.addInitScript((id) => { try { sessionStorage.setItem('mm:peer', id) } catch {} }, peer)
  return page
}
// a world link (doc or #new=<template>): wait until the world runs
async function openPage (ctx, url, tag, { timeout = 30000, viewport = SMALL, peer } = {}) {
  const page = await newTab(ctx, tag, { viewport, peer })
  await page.goto(url)
  await page.waitForFunction(() => window.__mm?.ready || window.__mm?.error, null, { timeout })
  const err = await page.evaluate(() => window.__mm.error ?? null)
  if (err) throw new Error(`${tag} failed to boot: ${err}`)
  return page
}
// a doc-less link (design §18.1): wait for the launcher, nothing else
async function openLauncher (ctx, url, tag, { timeout = 30000, viewport = SMALL, peer } = {}) {
  const page = await newTab(ctx, tag, { viewport, peer })
  await page.goto(url)
  await page.waitForFunction(() => window.__mm?.phase === 'launcher' && !!document.querySelector('#launcher:not([hidden])') || window.__mm?.error, null, { timeout })
  const err = await page.evaluate(() => window.__mm.error ?? null)
  if (err) throw new Error(`${tag} failed to show the launcher: ${err}`)
  return page
}
const recentOf = (page) => page.evaluate(() => { try { return JSON.parse(localStorage.getItem('mm:worlds') ?? 'null') } catch (e) { return String(e) } })
const waitIn = (page, fn, arg, timeout = 10000) => page.waitForFunction(fn, arg, { timeout, polling: 50 })
const until = async (fn, { timeout = 10000, every = 50 } = {}) => {
  const t0 = Date.now()
  for (;;) { const v = await fn(); if (v) return v; if (Date.now() - t0 > timeout) return v; await sleep(every) }
}
// a context whose tabs get a fixed peer id (sessionStorage 'mm:peer'), so the
// host election (lowest live peer id) is known in advance
async function contextWithPeer (browser, peerId) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  await ctx.addInitScript((id) => { try { sessionStorage.setItem('mm:peer', id) } catch {} }, peerId)
  return ctx
}

// the person of the user's question: a biped with a hat, a robe colour and a staff
const WIZARD = {
  extends: 'biped',
  nodes: [
    { name: 'head', children: [{ name: 'hat', shape: 'cone', p: [0, 0.5, 0], s: [0.34, 0.5, 0.34], color: '#3b2a7a' }] },
    { name: 'chest', color: '#3b2a7a' },
    { name: 'arm_r', children: [{ name: 'staff', shape: 'cylinder', p: [0, -0.3, 0.1], s: [0.04, 1.6, 0.04], color: '#6b4a2e' }] },
  ],
  animations: { attack: { tracks: { 'staff.rz': [[0, 0], [0.3, 40], [0.7, 0]] } } },
}

// ---------------------------------------------------------------- MCP client
async function mcpClient (env = {}) {
  const transport = new StdioClientTransport({ command: process.execPath, args: [path.join(PKG, 'agent/mcp.mjs')], env: { ...process.env, ...env }, stderr: 'pipe' })
  const client = new Client({ name: 'merge-meadow-e2e', version: '0' })
  await client.connect(transport)
  const call = async (name, args = {}) => {
    const t = performance.now()
    const r = await client.callTool({ name, arguments: args })
    const ms = +(performance.now() - t).toFixed(1)
    const texts = r.content.filter((c) => c.type === 'text').map((c) => { try { return JSON.parse(c.text) } catch { return c.text } })
    return { ms, isError: !!r.isError, json: texts[0], image: r.content.find((c) => c.type === 'image') ?? null }
  }
  const tools = (await client.listTools()).tools.map((t) => t.name)
  return { client, call, tools, close: () => client.close().catch(() => {}) }
}

// ---------------------------------------------------------------- the run
const PEER_A = 'p_aaaaaaaa01'
const PEER_B = 'p_bbbbbbbb02'
let syncSrv, distSrv, browser, browserB
const S = {} // shared state between phases

async function main () {
  fs.mkdirSync(OUT, { recursive: true })
  if (!fs.existsSync(path.join(DIST, 'index.html'))) throw new Error(`no ${DIST}/index.html: run \`npm run build -w @vibe-dump/merge-meadow\` first`)
  const [syncPort, httpPort] = [await freePort(), await freePort()]
  syncSrv = await startSyncServer(syncPort)
  distSrv = await serveDist(DIST, httpPort)
  const SYNC = `ws://127.0.0.1:${syncPort}`
  const BASE = `http://127.0.0.1:${httpPort}${PREFIX}`
  S.SYNC = SYNC; S.BASE = BASE; S.origin = `http://127.0.0.1:${httpPort}`
  // A and B get separate browser processes, as on two machines: pages of one headless
  // browser share a GPU process, and tearing down one page's WebGL context there stalls
  // the other's frames for ~800 ms (measured), which is not what a second peer sees
  const launched = await launch(); browser = launched.browser; S.exe = launched.exe
  browserB = (await launch()).browser
  console.log(`# sync server ${SYNC}, app ${BASE}, browser ${launched.exe}, out ${OUT}`)

  if (ONLY === 'safe') { await safePhase(); return }
  if (ONLY === 'rigs') { await rigsPhase(); return }
  if (ONLY === 'thumb') { await thumbPhase(); return }

  // ============================================================== boot
  phase('boot')
  const ctxA = await contextWithPeer(browser, PEER_A)
  const SYNC_HASH = `#sync=${encodeURIComponent(SYNC)}`
  // a link with no doc shows the launcher (design §18.1); only &sync= is given (never the public server)
  const tL = Date.now()
  const A = await openLauncher(ctxA, `${BASE}${SYNC_HASH}`, 'A', { viewport: { width: 1280, height: 800 } })
  const launcherMs = Date.now() - tL
  await sleep(300) // nothing may be created behind the launcher's back
  const l0 = await A.evaluate(() => ({
    phase: window.__mm.phase, handle: !!window.__mm.handle, ready: !!window.__mm.ready, hash: location.hash,
    stored: localStorage.getItem('mm:worlds'), editor: !!document.querySelector('#app')?.children.length,
    cards: [...document.querySelectorAll('[id^="launch-template-"]')].map((b) => b.id),
    ids: ['launch-new', 'launch-recent', 'launch-open-file', 'launch-link'].filter((id) => document.getElementById(id)),
  }))
  ok(l0.phase === 'launcher' && !l0.handle && !l0.ready && !l0.editor && l0.stored == null, `a doc-less link shows the launcher (${launcherMs} ms) and creates no document`, l0)
  ok(l0.hash === SYNC_HASH, 'the launcher leaves the hash alone (no doc, no key written)', l0.hash)
  ok(['launch-template-meadow', 'launch-template-blank'].every((id) => l0.cards.includes(id)) && l0.ids.length === 4, 'the launcher has its stable ids: New world, a card per template, Your worlds, Open a file, Paste a link', l0)
  await A.evaluate(() => { window.__launcherMark = 1 }) // gone if the create reloads the page
  const t0 = Date.now()
  await A.click('#launch-new')
  await A.click('#launch-template-meadow')
  await A.waitForFunction(() => window.__mm?.ready || window.__mm?.error, null, { timeout: 30000 })
  const bootMs = Date.now() - t0
  const bootErr = await A.evaluate(() => window.__mm.error ?? null)
  if (bootErr) throw new Error(`A failed to create a world: ${bootErr}`)
  const MEADOW = templateEntities('meadow')
  // a rig is built when its look is: give the reconciler a moment past the first frames
  await waitIn(A, (ids) => ids.every((id) => { const v = window.__mm.reconciler.visualFor(id); return v && !v.userData.missing }), MEADOW.map((e) => e.id), 10000).catch(() => {})
  const a0 = await A.evaluate((ids) => {
    const mm = window.__mm
    return {
      order: window.__order, hash: location.hash, path: location.pathname, peerId: mm.peerId, lockedDown: mm.lockedDown,
      frozen: Object.isFrozen(Array.prototype), docEntities: Object.keys(mm.handle.doc().entities ?? {}).sort(),
      presets: Object.keys(mm.handle.doc().presets ?? {}).sort(), title: String(mm.handle.doc().meta?.title ?? ''),
      worldEntities: mm.world.entities.size, rendered: mm.reconciler.stats(), systemsOn: mm.systemHost.enabled,
      kinds: Object.fromEntries(ids.map((id) => { const v = mm.reconciler.visualFor(id); return [id, v ? `${v.userData.kind}${v.userData.missing ? '!missing' : ''}` : null] })),
      roots: ids.filter((id) => mm.reconciler.objectFor(id)?.parent === mm.stage.scene).length,
      editor: !!document.querySelector('#app')?.children.length && getComputedStyle(document.querySelector('#app')).display !== 'none',
      topbar: !!document.querySelector('#app .topbar, #app [class*="topbar"]'),
      bootHidden: document.getElementById('boot').hidden || document.getElementById('boot').classList.contains('done'),
      launcherGone: !document.querySelector('#launcher:not([hidden])'), phase: mm.phase, reloaded: !window.__launcherMark,
      canvas: [document.getElementById('scene').width, document.getElementById('scene').height],
      recent: (() => { try { return JSON.parse(localStorage.getItem('mm:worlds') ?? '[]') } catch { return null } })(),
    }
  }, MEADOW.map((e) => e.id))
  S.linkA = BASE + a0.hash
  const L = parseLink(a0.hash)
  ok(true, `New world -> Animal meadow created A's world in ${bootMs} ms (the launcher came up in ${launcherMs} ms)`)
  ok(a0.order?.[0]?.what === 'three-evaluated' && a0.order[0].arrayProtoFrozen === true, 'boot order: three evaluated after lockdown froze the intrinsics (inline __THREE__ probe)', a0.order)
  ok(a0.order?.some((o) => o.what === 'main-body' && o.arrayProtoFrozen) && a0.frozen && a0.lockedDown, 'main.js body ran under lockdown')
  ok(L.docUrl && L.key && L.sync === SYNC && a0.phase === 'ready' && a0.launcherGone && !a0.reloaded, 'the world is created in place: hash rewritten to doc + key, keeping &sync; the launcher is gone', a0.hash.slice(0, 90))
  const meadowIds = MEADOW.map((e) => e.id).sort()
  ok(JSON.stringify(a0.docEntities) === JSON.stringify(meadowIds) && a0.title === 'Animal meadow' && ['horse', 'lamp', 'rock', 'sheep', 'tree', 'trex', 'wizard', ...Object.keys(ZOO_PRESETS)].every((p) => a0.presets.includes(p)),
    `the doc is the Animal meadow template (${a0.docEntities.length} entities: the starter, the wizard, ${MEADOW.filter((e) => /^(rabbit|goat|pig|dog|rooster|rat|ox|tiger|dragon|snake|monkey)-/.test(e.id)).length} zodiac animals; ${a0.presets.length} presets)`, { title: a0.title, entities: a0.docEntities.join(',') })
  ok(a0.roots === MEADOW.length && a0.rendered.entities >= MEADOW.length && a0.rendered.placeholders === 0, `the seed scene renders: ${a0.roots} roots for the ${MEADOW.length} template entities (${a0.rendered.entities} with the players), no placeholders`, a0.rendered)
  const rigIds = MEADOW.filter((e) => ['trex', 'sheep', 'horse', 'wizard', ...Object.keys(ZOO_PRESETS)].includes(e.preset)).map((e) => e.id)
  ok(rigIds.length >= 11 && rigIds.every((id) => a0.kinds[id] === 'rig') && ['trex-1', 'sheep-1', 'horse-1', 'wizard-1'].every((id) => rigIds.includes(id)), `the T-rex, the sheep, the horse, the wizard and the zodiac animals are rigs (${rigIds.length})`, Object.fromEntries(rigIds.map((id) => [id, a0.kinds[id]])))
  const entry = Array.isArray(a0.recent) ? a0.recent.find((e) => e.docUrl === L.docUrl) : null
  ok(entry && entry.key === L.key && entry.title === 'Animal meadow' && entry.sync === SYNC && a0.recent.length === 1, 'the create wrote the recent entry (doc, key, sync, title)', a0.recent)
  ok(a0.editor && a0.topbar && a0.bootHidden, 'the editor is shown and the boot overlay is gone')
  ok(a0.systemsOn, 'doc systems are enabled (lockdown on, not safe mode)')
  await sleep(1200)
  await A.screenshot({ path: path.join(OUT, 'boot.png') })
  const px = await A.evaluate(() => {
    // the scene is drawn: sample the WebGL canvas for more than one colour
    const c = document.getElementById('scene'); const g = c.getContext('webgl2') || c.getContext('webgl')
    window.__mm.stage.render()
    const w = c.width; const h = c.height; const buf = new Uint8Array(4)
    const seen = new Set()
    for (let i = 1; i < 12; i++) for (let j = 1; j < 8; j++) { g.readPixels(Math.floor(w * i / 12), Math.floor(h * j / 8), 1, 1, g.RGBA, g.UNSIGNED_BYTE, buf); seen.add(buf.join(',')) }
    return seen.size
  })
  ok(px >= 4, `the canvas shows a rendered scene (${px} distinct colours in a 11×7 probe)`)
  const credit = await A.evaluate(() => { window.__mm.editor.showTab('world'); const t = document.querySelector('#app .world')?.textContent ?? ''; window.__mm.editor.showTab('inspector'); return /Twemoji/.test(t) && /CC-BY 4\.0/.test(t) })
  ok(credit, 'the World tab credits the bundled Twemoji glyphs (CC-BY 4.0)')
  await A.setViewportSize(SMALL)

  // ---- Your worlds: a second tab of the same browser profile, on a bare URL whose sync
  // differs from the #new= hash it follows below (offline: never the public server)
  const Q = await openLauncher(ctxA, `${BASE}#sync=none`, 'Q', { peer: 'p_dddddddd04' })
  const listed = await waitIn(Q, () => document.querySelectorAll('#launch-recent li[data-doc]').length > 0, undefined, 5000).then(() => true, () => false)
  const rows = await Q.evaluate(() => [...document.querySelectorAll('#launch-recent li[data-doc]')].map((li) => ({
    doc: li.dataset.doc, text: li.textContent, open: !!li.querySelector('.launch-open'), copy: !!li.querySelector('.launch-copy'), forget: !!li.querySelector('.launch-forget'),
  })))
  ok(listed && rows.length === 1 && rows[0].doc === L.docUrl && /Animal meadow/.test(rows[0].text) && rows[0].open && rows[0].copy && rows[0].forget && !(await Q.evaluate(() => !!window.__mm.handle)),
    'a second tab on the bare URL lists the world under Your worlds (Open, Copy link, Forget) and opens nothing', rows)
  await Q.click(`#launch-recent li[data-doc="${L.docUrl}"] .launch-forget`)
  const forgot = await Q.evaluate(() => ({ lis: document.querySelectorAll('#launch-recent li[data-doc]').length, store: (() => { try { return JSON.parse(localStorage.getItem('mm:worlds') ?? '[]') } catch { return null } })() }))
  const stillThere = await A.evaluate((u) => window.__mm.handle.url === u && Object.keys(window.__mm.handle.doc().entities).length > 0, L.docUrl)
  ok(forgot.lis === 0 && Array.isArray(forgot.store) && !forgot.store.some((e) => e.docUrl === L.docUrl) && stillThere, 'Forget removes the entry (list and localStorage); the world itself is untouched', forgot)
  // ---- #new=blank: the launcher also follows a hash that names a template (no reload),
  // on the sync server and with the safe flag the hash names, not the bare page's
  await Q.evaluate((h) => { location.hash = h }, `new=blank&sync=${encodeURIComponent(SYNC)}&safe`)
  await waitIn(Q, () => window.__mm?.ready || window.__mm?.error, undefined, 30000).catch(() => {})
  const q0 = await Q.evaluate(() => ({
    err: window.__mm.error ?? null, hash: location.hash, ents: Object.keys(window.__mm.handle?.doc().entities ?? {}),
    lamp: window.__mm.reconciler?.visualFor('lamp-1')?.userData.kind ?? null, title: String(window.__mm.handle?.doc().meta?.title ?? ''),
    presets: Object.keys(window.__mm.handle?.doc().presets ?? {}).length, models: Object.keys(window.__mm.handle?.doc().models ?? {}).length,
    sync: window.__mm.link?.sync, forced: !!window.__mm.safe?.forced, hlen: history.length,
    recent: (() => { try { return JSON.parse(localStorage.getItem('mm:worlds') ?? '[]') } catch { return null } })(),
  }))
  const QL = parseLink(q0.hash)
  ok(!q0.err && JSON.stringify(q0.ents) === '["lamp-1"]' && q0.lamp && q0.title === 'Blank meadow' && QL.docUrl && QL.docUrl !== L.docUrl && QL.key && QL.sync === SYNC && q0.presets === a0.presets.length && q0.models === Object.keys(MODEL_LIBRARY).length,
    `#new=blank creates a blank world: one lamp, the same library (${q0.presets} presets, ${q0.models} models), hash rewritten to its own doc + key`, q0)
  const qEntry = Array.isArray(q0.recent) ? q0.recent.find((e) => e.docUrl === QL.docUrl) : null
  ok(q0.sync === SYNC && qEntry?.sync === SYNC && QL.safe && q0.forced,
    "a #new= hash followed from a bare page on another sync server (#sync=none) creates on the hash's server and keeps its &safe in the address", { sync: q0.sync, entry: qEntry?.sync, safe: QL.safe, forced: q0.forced, hash: q0.hash.slice(0, 120) })
  // the history: Back after #new= returns to the bare page (the #new= entry was replaced),
  // Forward reopens the same world; neither plants a second one
  const evalSafe = (page, fn, arg) => page.evaluate(fn, arg).catch(() => null)
  const atLauncher = (page) => until(() => evalSafe(page, () => window.__mm?.phase === 'launcher' && !!document.querySelector('#launcher:not([hidden])')), { timeout: 30000 })
  const atReady = (page) => until(() => evalSafe(page, () => !!(window.__mm?.ready || window.__mm?.error)), { timeout: 30000 })
  const worldsIn = (page) => evalSafe(page, () => { try { return JSON.parse(localStorage.getItem('mm:worlds') ?? '[]').map((e) => e.docUrl) } catch { return null } })
  const before = await worldsIn(Q)
  await Q.goBack()
  const backOk = await atLauncher(Q)
  const qb = await evalSafe(Q, () => ({ hash: location.hash, handle: !!window.__mm.handle }))
  ok(backOk && qb?.hash === '#sync=none' && !qb.handle && JSON.stringify(await worldsIn(Q)) === JSON.stringify(before), 'Back after #new= returns to the launcher on the bare page and plants no second world', { qb, before })
  await Q.goForward()
  await atReady(Q)
  const qf = await evalSafe(Q, () => ({ url: window.__mm.handle?.url, err: window.__mm.error ?? null }))
  ok(qf?.url === QL.docUrl && !qf.err && JSON.stringify(await worldsIn(Q)) === JSON.stringify(before), 'Forward reopens the same #new= world (it was replaced by its doc link), no new world', qf)
  const fileBytes = await Q.evaluate(async () => Array.from(await window.__mm.repo.export(window.__mm.handle.documentId)))
  await Q.goBack()
  await atLauncher(Q)
  // Paste a link: the world opens in place and its address is pushed (Back returns here)
  await Q.evaluate(() => { window.__pasteMark = 1 })
  await Q.fill('#launch-link', BASE + q0.hash)
  await Q.click('#launch-link-go')
  await atReady(Q)
  const qp = await evalSafe(Q, () => ({ url: window.__mm.handle?.url, err: window.__mm.error ?? null, mark: !!window.__pasteMark, hash: location.hash, sync: window.__mm.link?.sync }))
  // (history.length cannot show the push: it replaces the Forward entry left above; Back below does)
  ok(qp?.url === QL.docUrl && !qp.err && qp.mark && parseLink(qp.hash).docUrl === QL.docUrl && qp.sync === SYNC, "Paste a link opens the world in place (no reload) on the link's sync server and writes its address", qp)
  await Q.goBack()
  const pasteBack = await atLauncher(Q)
  ok(pasteBack && (await evalSafe(Q, () => location.hash)) === '#sync=none', 'Back from a launcher-opened world returns to the launcher')
  // Open a file: a Download of the blank world opens as a new copy on the page's sync (none)
  await Q.setInputFiles('#launcher input[type=file]', { name: 'blank.automerge', mimeType: 'application/octet-stream', buffer: Buffer.from(fileBytes) })
  await atReady(Q)
  const qi = await evalSafe(Q, () => ({ url: window.__mm.handle?.url, err: window.__mm.error ?? null, hash: location.hash, ents: Object.keys(window.__mm.handle?.doc().entities ?? {}), sync: window.__mm.link?.sync }))
  const QI = parseLink(qi?.hash ?? '')
  ok(qi && !qi.err && qi.url && qi.url !== QL.docUrl && QI.docUrl === qi.url && QI.key && QI.key !== QL.key && JSON.stringify(qi.ents) === '["lamp-1"]' && qi.sync === 'none' && QI.sync === 'none',
    "Open a file imports the .automerge as a new copy under a fresh key, on the bare page's sync server", qi)
  await Q.close()

  // ============================================================== join
  phase('join')
  // the doc must have reached the server before a fresh context can find it
  await until(() => A.evaluate(() => !document.querySelector('[data-share-ready="false"], .share[disabled]')), { timeout: 8000 })
  const ctxB = await contextWithPeer(browserB, PEER_B)
  const B = await openPage(ctxB, S.linkA, 'B', { timeout: 45000 })
  const b0 = await B.evaluate(() => ({ docUrl: window.__mm.handle.url, n: Object.keys(window.__mm.handle.doc().entities).length, peerId: window.__mm.peerId }))
  ok(b0.docUrl === L.docUrl && b0.n === a0.docEntities.length, `B (fresh context: no shared IndexedDB or BroadcastChannel) opened the same world through the sync server (${b0.n} entities)`)
  const seen = await until(async () => {
    const [pa, pb] = await Promise.all([A.evaluate(() => [...window.__mm.presence.peers().keys()]), B.evaluate(() => [...window.__mm.presence.peers().keys()])])
    return pa.includes(PEER_B) && pb.includes(PEER_A) ? { pa, pb } : null
  }, { timeout: 8000 })
  ok(!!seen, 'A and B see each other in presence', seen)
  // the election settles after the 3 s incumbency window; A has the lower id
  const hosts = await until(async () => {
    const h = await Promise.all([A, B].map((p) => p.evaluate(() => window.__mm.presence.host())))
    return h[0] === PEER_A && h[1] === PEER_A ? h : null
  }, { timeout: 6000 })
  ok(!!hosts, 'both pages elect A (lowest live peer id) as host', hosts)
  // record long gaps between B's sim steps (presence.selfCheck runs in stream.tick)
  await B.evaluate(() => {
    const s = window.__mm.stream; const tick = s.tick; let last = null; window.__gaps = []
    s.tick = function (now) { if (last != null && now - last > 1000) window.__gaps.push([now, now - last]); last = now; return tick.call(this, now) }
  })
  S.A = A; S.B = B; S.ctxA = ctxA; S.ctxB = ctxB; S.L = L

  // ============================================================== spawns
  phase('spawns')
  const spawnIn = (page, preset, at) => page.evaluate(({ preset, at }) => window.__mm.editor.spawnAt(preset, at)?.results?.[0], { preset, at })
  const rockA = await spawnIn(A, 'rock', [-12, 0, 6])
  const rockB = await spawnIn(B, 'rock', [12, 0, 6])
  ok(typeof rockA === 'string' && typeof rockB === 'string', 'each page spawned through the editor', [rockA, rockB])
  const t1 = Date.now()
  const seesA = await waitIn(B, (id) => !!window.__mm.reconciler.objectFor(id), rockA).then(() => Date.now() - t1, () => null)
  const seesB = await waitIn(A, (id) => !!window.__mm.reconciler.objectFor(id), rockB).then(() => Date.now() - t1, () => null)
  ok(seesA != null && seesB != null, `each page renders the other's spawn (B saw A's after ${seesA} ms, A saw B's after ${seesB} ms)`)

  await chase()
  await systemPhase()
  await ridePhase()
  await hiddenPhase()
  await upgradePhase()
  await keysPhase()
  await handoffPhase()
  await mcpPhase()
  await localPhase()
  await rigsPhase()
  await thumbPhase()
  await safePhase()
}

// ============================================================== chase + hits
// A (the host) simulates the T-rex; B spawns a sheep beside it. Both pages record
// the poses their sim sees: A right after each world.tick (the truth it streams),
// B right after each stream.apply (what it displays). Error is judged against the
// owner's pose 160 ms earlier (§16.15: 120 ms interpolation delay + latency).
async function chase () {
  phase('chase')
  const { A, B } = S
  const trex = await A.evaluate(() => [...window.__mm.world.entities.values()].find((e) => String(e.preset) === 'trex' && !e.groups.has('dead'))?.id)
  // put the sheep 2.5 m from the T-rex, on the way to whatever it hunts now, so it is the obvious prey
  const { tp, aim } = await A.evaluate((id) => {
    const w = window.__mm.world; const e = w.get(id); const tg = e.live.intent?.target && w.get(e.live.intent.target)
    const yaw = e.live.yaw ?? 0
    return { tp: e.live.p, aim: tg?.live.p ? [tg.live.p[0] - e.live.p[0], tg.live.p[2] - e.live.p[2]] : [Math.sin(yaw), Math.cos(yaw)] }
  }, trex)
  const n = Math.hypot(aim[0], aim[1]) || 1
  const at = [tp[0] + aim[0] / n * 2.5, 0, tp[2] + aim[1] / n * 2.5].map((v) => Math.max(-35, Math.min(35, v)))
  // Only the WebGL draw is skipped while measuring: on a 4-core box two SwiftShader
  // browsers render at ~6 fps, bunching the 30 Hz ticks into a few frames. The
  // measured path — sim tick, pose stream, interpolation, reconciler tween — runs
  // every frame as usual; the boot phase already checked the scene renders.
  const drawing = (on) => setDrawing([A, B], on)
  await drawing(false)
  await A.evaluate(() => {
    const mm = window.__mm; const w = mm.world; const tick = w.tick
    window.__rec = []; window.__recIds = []; window.__intents = []
    w.tick = function (dt) {
      const r = tick.call(this, dt); const t = Date.now()
      for (let i = 0; i < window.__recIds.length; i++) { const e = w.get(window.__recIds[i]); if (e?.live.p) window.__rec.push([t, i, e.live.p[0], e.live.p[2], mm.ownership.owns(e.id) ? 1 : 0]) }
      const tr = w.get(window.__recIds[0]); if (tr?.live.intent) window.__intents.push([t, String(tr.live.intent.act), String(tr.live.intent.target ?? '')])
      return r
    }
  })
  // B: what the viewer SEES — the rendered root after each reconciler.frame (the
  // stream's interpolated live pose, tweened one sim tick behind), stamped at that frame
  await B.evaluate(() => {
    const mm = window.__mm; const rc = mm.reconciler; const frame = rc.frame
    window.__rec = []; window.__recIds = []
    rc.frame = function (dt, alpha) {
      const r = frame.call(this, dt, alpha); const t = Date.now()
      for (let i = 0; i < window.__recIds.length; i++) {
        const id = window.__recIds[i]; const e = mm.world.get(id); const o = rc.objectFor(id)
        if (o && e?.live.streamAge != null) window.__rec.push([t, i, o.position.x, o.position.z, mm.ownership.owns(id) ? 1 : 0])
      }
      return r
    }
  })
  // an old, slow sheep (4 m/s): a seed sheep (6.5 m/s) outruns the T-rex (6 m/s) when it sees it coming
  const sheep = await B.evaluate((at) => window.__mm.caps.world.spawn({ preset: 'sheep', at, components: { body: { speed: 4 } } }).id(), at)
  const tSpawn = Date.now()
  ok(typeof sheep === 'string', `B spawned sheep ${sheep} 2.5 m from A's T-rex ${trex}`)
  await waitIn(A, (id) => !!window.__mm.world.get(id), sheep)
  await Promise.all([A, B].map((p) => p.evaluate((ids) => { window.__recIds = ids }, [trex, sheep])))
  const owners = await Promise.all([A, B].map((p) => p.evaluate(([a, b]) => [window.__mm.ownership.owner(a), window.__mm.ownership.owner(b)], [trex, sheep])))
  ok(owners.every((o) => o[0] === PEER_A && o[1] === PEER_A), 'both pages agree A owns the T-rex and B\'s sheep (the host simulates NPCs)', owners)
  // chase until the sheep is dead in the doc (2 hits), sampling all the while
  const dead = await until(() => B.evaluate((id) => !!window.__mm.handle.doc().entities?.[id]?.groups?.dead, sheep), { timeout: 25000, every: 100 })
  const tDead = Date.now()
  // keep sampling the T-rex (it hunts on) so the error statistic has a few seconds behind it
  const tEnd = Math.max(tDead, tSpawn + 5000)
  await sleep(Math.max(300, tEnd - Date.now() + 200))
  const [ra, rb, intents] = await Promise.all([A.evaluate(() => window.__rec), B.evaluate(() => window.__rec), A.evaluate(() => window.__intents)])
  await Promise.all([A, B].map((p) => p.evaluate(() => { window.__recIds = [] })))
  await drawing(true)
  const chased = intents.filter(([, act, target]) => act === 'pursue' && target === sheep)
  const fpsOf = (rows) => { const ts = [...new Set(rows.map((r) => r[0]))]; return ts.length > 1 ? +((ts.length - 1) / ((ts[ts.length - 1] - ts[0]) / 1000)).toFixed(1) : 0 }
  S.rates = { aTicksPerS: fpsOf(ra), bFramesPerS: fpsOf(rb) }
  console.log('# rates', JSON.stringify(S.rates))
  ok(chased.length > 5, `A's T-rex pursued B's sheep (${chased.length} of ${intents.length} ticks)`)
  ok(dead, `the sheep died ${((tDead - tSpawn) / 1000).toFixed(1)} s after B spawned it`)
  // pose error: B's displayed pose at t vs A's simulated pose at t - lag
  const series = [[], []]; for (const r of ra) if (r[4]) series[r[1]].push(r)
  const interp = (arr, t) => {
    if (!arr.length || t < arr[0][0] || t > arr[arr.length - 1][0]) return null
    let lo = 0; let hi = arr.length - 1
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (arr[m][0] <= t) lo = m; else hi = m }
    const a = arr[lo]; const b = arr[hi]; if (b[0] - a[0] > 120) return null
    const u = b[0] === a[0] ? 0 : (t - a[0]) / (b[0] - a[0]); return [a[2] + (b[2] - a[2]) * u, a[3] + (b[3] - a[3]) * u]
  }
  const errAt = (lag) => {
    const xs = []
    for (const [t, i, x, z, own] of rb) {
      if (own || t < tSpawn + 800 || t > tEnd || (i === 1 && t > tDead)) continue
      const truth = interp(series[i], t - lag); if (truth) xs.push(Math.hypot(x - truth[0], z - truth[1]))
    }
    return stat(xs)
  }
  const lags = Object.fromEntries([0, 120, 140, 160, 180, 200].map((L) => [L, errAt(L)]))
  // diagnostics for the max: the worst samples at 160 ms, with the sampling gaps around them
  const worst = []
  for (let k = 0; k < rb.length; k++) {
    const [t, i, x, z, own] = rb[k]
    if (own || t < tSpawn + 800 || t > tEnd || (i === 1 && t > tDead)) continue
    const tr = interp(series[i], t - 160); if (!tr) continue
    const prevB = rb.slice(0, k).reverse().find((r) => r[1] === i)
    const aPrev = series[i].filter((r) => r[0] <= t - 160).pop(); const aNext = series[i].find((r) => r[0] > t - 160)
    worst.push({ err: +Math.hypot(x - tr[0], z - tr[1]).toFixed(3), ent: i ? 'sheep' : 'trex', tMs: t - tSpawn, bFrameGap: prevB ? t - prevB[0] : null, aTickGap: aPrev && aNext ? aNext[0] - aPrev[0] : null })
  }
  worst.sort((a, b) => b.err - a.err)
  S.poseWorst = worst.slice(0, 6)
  const speed = (() => { const s = series[0].filter((r) => r[0] > tSpawn + 800 && r[0] < tDead); const v = []; for (let k = 3; k < s.length; k += 3) if (s[k][0] - s[k - 3][0] > 20) v.push(Math.hypot(s[k][2] - s[k - 3][2], s[k][3] - s[k - 3][3]) / ((s[k][0] - s[k - 3][0]) / 1000)); return stat(v) })()
  // §16.15's 160 ms is the 120 ms interpolation delay + ~40 ms one-way latency of the
  // PUBLIC server. Against a local server the latency is ~0, so the display is ~20 ms
  // fresher than that and a fixed 160 ms lag reads it as 0.1 m of error at 5 m/s. The
  // check: the best lag in 120–160 ms meets ≤0.1 m mean / ≤0.3 m max, and at exactly
  // 160 ms the max still holds.
  const e160 = lags[160]
  const window120to160 = Object.entries(lags).filter(([L, v]) => +L >= 120 && +L <= 160 && v).sort((a, b) => a[1].mean - b[1].mean)
  const [bestLag, best] = window120to160.find(([, v]) => v.mean <= 0.1 && v.max <= 0.3) ?? window120to160[0] ?? []
  S.poseError = { lags, bestLag, trexSpeed: speed }
  const table = Object.fromEntries(Object.entries(lags).map(([k, v]) => [k, v && [v.mean, v.max]]))
  ok(best && best.n > 100 && best.mean <= 0.1 && best.max <= 0.3, `B's displayed pose vs A's pose ${bestLag} ms earlier (a lag in 120–160 ms): mean ${best?.mean} m, max ${best?.max} m over ${best?.n} samples (T-rex at ~${speed?.mean} m/s)`, table)
  ok(e160 && e160.max <= 0.3, `judged at exactly 160 ms earlier: max ${e160?.max} m ≤ 0.3 m (mean ${e160?.mean} m)`, e160?.max > 0.3 || best?.max > 0.3 ? { worst: S.poseWorst } : undefined)

  // ============================================================== hits
  phase('hits')
  const ledger = await B.evaluate((id) => {
    const e = window.__mm.handle.doc().entities[id]; const h = e.components.health ?? {}
    const eff = window.__mm.world.get(id)?.c?.health
    return { hits: Object.fromEntries(Object.entries(h.hits ?? {}).map(([k, v]) => [k, Number(v)])), max: Number(eff?.max ?? h.max), armor: Number(eff?.armor ?? h.armor ?? 0) }
  }, sheep)
  const dmg = await A.evaluate((id) => Number(window.__mm.world.get(id).c.attack.damage), trex)
  const need = Math.ceil(ledger.max / Math.max(1, dmg - ledger.armor))
  const ids = Object.keys(ledger.hits)
  ok(ids.length === need && ids.every((h) => h.startsWith(PEER_A + ':')), `the sheep's ledger holds exactly ${need} hit(s), all written by A (the T-rex's owner)`, ledger.hits)
  S.sheep = sheep; S.trex = trex
}

// ============================================================== doc system: defined in A, runs in B
async function systemPhase () {
  phase('system')
  const { A, B } = S
  const src = (v) => `export default {
  init (world, hot) { hot.data.gen = (hot.prev.gen ?? 0) + 1; world.log('e2e-mark v${v} gen ' + hot.data.gen) },
  update (world, dt) { for (const e of world.query('tags')) if (e.owned && e.c.tags.player) e.live.e2eMark = ${v} },
}`
  const t0 = Date.now()
  await A.evaluate((s) => window.__mm.caps.world.defineSystem('e2e-mark', { source: s }), src(1))
  const selfB = 'player:' + PEER_B
  const ran = await waitIn(B, (id) => window.__mm.world.get(id)?.live.e2eMark === 1, selfB).then(() => Date.now() - t0, () => null)
  ok(ran != null, `a system defined in A runs in B (B's own player marked after ${ran} ms)`)
  await A.evaluate((s) => window.__mm.caps.world.defineSystem('e2e-mark', { source: s }), src(2))
  const swapped = await waitIn(B, (id) => window.__mm.world.get(id)?.live.e2eMark === 2, selfB).then(() => true, () => false)
  const st = await B.evaluate(() => window.__mm.systemHost.status().find((s) => s.name === 'e2e-mark'))
  const logs = await B.evaluate(() => window.__mm.log.list(200).map((l) => (l.msg ?? l.text ?? JSON.stringify(l))).filter((m) => /e2e-mark/.test(m)))
  ok(swapped && st?.ok && !st.suspended, 'the system hot-swaps in B and reports ok', st)
  ok(logs.some((m) => /v2 gen 2/.test(m)), 'hot data survived the swap (init saw gen 2)', logs.slice(-2))
  await A.evaluate(() => window.__mm.caps.world.removeSystem('e2e-mark'))
}

// ============================================================== ride: a non-host rider owns its mount
async function ridePhase () {
  phase('ride')
  const { A, B } = S
  const horse = await B.evaluate(() => window.__mm.caps.world.spawn({ preset: 'horse', name: 'e2e horse', at: [0, 0, 18] }).id())
  await waitIn(A, (id) => !!window.__mm.world.get(id), horse)
  await waitIn(B, (id) => !!window.__mm.reconciler.objectFor(id), horse)
  const ownerIn = () => Promise.all([A, B].map((p) => p.evaluate((id) => ({ owner: window.__mm.ownership.owner(id), owns: window.__mm.ownership.owns(id) }), horse)))
  const before = await until(async () => { const o = await ownerIn(); return o.every((x) => x.owner === PEER_A) ? o : null }, { timeout: 3000 })
  ok(before, 'before: both pages say the host (A) owns the new horse', before ?? await ownerIn())
  const mounted = await B.evaluate((id) => window.__mm.interaction.mount(id), horse)
  ok(mounted, 'B (not the host) mounts the horse')
  const t0 = Date.now()
  const agree = await until(async () => { const [a, b] = await ownerIn(); return a.owner === PEER_B && b.owner === PEER_B && !a.owns && b.owns ? [a, b] : null }, { timeout: 5000, every: 25 })
  ok(agree, `both pages agree the ridden horse belongs to its rider B (${Date.now() - t0} ms), and A stops simulating it`, agree ?? await ownerIn())
  await B.evaluate(() => window.__mm.interaction.dismount())
  const back = await until(async () => { const o = await ownerIn(); return o.every((x) => x.owner === PEER_A) ? o : null }, { timeout: 5000, every: 25 })
  ok(back, 'after B dismounts, the host owns the horse again on both pages', back ?? await ownerIn())
  await B.evaluate((id) => window.__mm.caps.world.get(id).destroy(), horse)
}

// ============================================================== hidden: a backgrounded host
// A hidden tab stops its animation frames (no sim, no pose stream) while its timers
// keep running. Emulated in A: requestAnimationFrame holds its callbacks and
// document.visibilityState reads 'hidden' (+ the visibilitychange event).
async function hiddenPhase () {
  phase('hidden')
  const { A, B, trex } = S
  const pre = await B.evaluate(() => window.__mm.presence.host())
  ok(pre === PEER_A, 'before: A hosts', pre)
  const setHidden = (page, hidden) => page.evaluate((hidden) => {
    if (hidden) { window.__raf = window.requestAnimationFrame; window.__heldFrames = []; window.requestAnimationFrame = (cb) => { window.__heldFrames.push(cb); return 0 } }
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => (hidden ? 'hidden' : 'visible') })
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden })
    document.dispatchEvent(new Event('visibilitychange'))
    if (!hidden) { window.requestAnimationFrame = window.__raf; for (const cb of window.__heldFrames.splice(0)) window.__raf.call(window, cb) }
  }, hidden)
  const t0 = Date.now()
  await setHidden(A, true)
  const took = await until(() => B.evaluate((id) => window.__mm.presence.host() === window.__mm.peerId && window.__mm.ownership.owns(id), trex), { timeout: 4000, every: 25 })
  ok(took, `A hidden -> B hosts and owns the T-rex after ${Date.now() - t0} ms`)
  const views = []
  for (let i = 0; i < 16; i++) { await sleep(500); views.push(await B.evaluate(() => window.__mm.presence.host())) }
  ok(views.every((h) => h === PEER_B), 'B keeps hosting for 8 s while A stays hidden (A\'s timers still run)', views.join(' '))
  const ticksB0 = await B.evaluate((id) => window.__mm.world.get(id).live.p, trex)
  await sleep(500)
  const ticksB1 = await B.evaluate((id) => ({ p: window.__mm.world.get(id).live.p, intent: window.__mm.world.get(id).live.intent ?? null }), trex)
  ok(ticksB1.intent != null && Math.hypot(ticksB1.p[0] - ticksB0[0], ticksB1.p[2] - ticksB0[2]) > 0.2, 'and B really simulates the T-rex meanwhile', ticksB1)
  await setHidden(A, false)
  await sleep(300)
  const right = await Promise.all([A, B].map((p) => p.evaluate(() => window.__mm.presence.host())))
  ok(right.every((h) => h === PEER_B), 'right after A returns it is a newcomer: B still hosts on both pages', right)
  const back = await until(async () => { const h = await Promise.all([A, B].map((p) => p.evaluate(() => window.__mm.presence.host()))); return h.every((x) => x === PEER_A) ? h : null }, { timeout: 8000, every: 100 })
  ok(back, 'A hosts again once it counts as an incumbent (lowest id)', back)
  await until(() => A.evaluate((id) => window.__mm.ownership.owns(id), trex), { timeout: 3000 })
}

// ============================================================== representation upgrade
// billboard -> primitive -> tree -> tree + animations -> rig (library model) -> model
// (glTF) -> billboard on one entity: same root Object3D, same live object, one
// visual, and none of the looks' resources left. Adding animations to a tree is a
// field edit of the same component (design §17.1): same visual, same meshes.
async function upgradePhase () {
  phase('upgrade')
  const { B } = S
  const id = await B.evaluate(() => window.__mm.caps.world.spawn({ name: 'probe', components: { transform: { p: [-6, 0, 14], r: [0, 0, 0], s: [1, 1, 1] }, representation: { kind: 'billboard', image: 'emoji:🧪', size: 1.2 } } }).id())
  await waitIn(B, (id) => window.__mm.reconciler.visualFor(id)?.userData.kind === 'billboard', id)
  await B.evaluate((id) => { window.__probe = { root: window.__mm.reconciler.objectFor(id), live: window.__mm.world.get(id).live, keys0: window.__mm.resources.keys() }; window.__probe.live.marker = 42 }, id)
  const TREE = { kind: 'tree', nodes: [{ name: 'trunk', shape: 'box', p: [0, 0.5, 0], s: [1, 1, 1], color: '#2468ac', children: [{ name: 'crown', shape: 'sphere', p: [0, 0.8, 0], s: [0.8, 0.8, 0.8], color: '#2468ad' }] }] }
  const SWAY = { sway: { loop: true, tracks: { 'trunk.rz': 'sin(t*tau)*12', 'crown.sy': '1 + sin(t*tau*2)*0.1' } } }
  const looks = [
    { kind: 'primitive', shape: 'cone', size: [1, 1.6, 1], color: '#13579b', roughness: 0.5, metalness: 0.1 },
    TREE,
    { set: { animations: SWAY }, kind: 'tree' }, // a field edit, not a replace
    { kind: 'rig', model: 'horse', color: '#97531f' },
    // the async kind: a one-triangle glTF served by this harness
    { kind: 'model', url: `${S.origin}${PREFIX}__e2e/tri.gltf`, scale: 1 },
    { kind: 'billboard', image: 'emoji:🧪', size: 1.2 },
  ]
  await B.evaluate(() => {
    window.__meshesOf = (id) => {
      const v = window.__mm.reconciler.visualFor(id); const ms = []
      v?.traverse((o) => { if (o.isMesh) ms.push(o) })
      return { visual: v, meshes: ms }
    }
  })
  const steps = []
  let treeAnim = null
  for (const look of looks) {
    if (look.set) {
      await B.evaluate((id) => { window.__probe.tree = window.__meshesOf(id) }, id)
      await B.evaluate(([id, patch]) => window.__mm.caps.world.get(id).set('representation', patch), [id, look.set])
      await waitIn(B, (id) => !!window.__mm.reconciler.visualFor(id)?.userData.tpl?.evaluator.clips.length, id)
      // it animates: the trunk bone sweeps, and every mesh is still the one built for the tree
      treeAnim = await B.evaluate(async (id) => {
        const after = window.__meshesOf(id); const before = window.__probe.tree
        const trunk = after.visual.userData.bones.get('trunk'); const rz = []
        for (let i = 0; i < 12; i++) { rz.push(trunk.rotation.z); await new Promise((r) => setTimeout(r, 60)) }
        return {
          sameVisual: after.visual === before.visual, meshes: after.meshes.length,
          sameMeshes: after.meshes.length === before.meshes.length && after.meshes.every((m, i) => m === before.meshes[i]),
          swingDeg: +((Math.max(...rz) - Math.min(...rz)) * 180 / Math.PI).toFixed(1),
        }
      }, id)
    } else {
      await B.evaluate(([id, look]) => window.__mm.caps.world.get(id).replace('representation', look), [id, look])
      await waitIn(B, ([id, k]) => window.__mm.reconciler.visualFor(id)?.userData.kind === k, [id, look.kind])
      if (look.kind === 'model') await waitIn(B, () => window.__mm.reconciler.stats().placeholders === 0, undefined, 15000).catch(() => {})
    }
    await sleep(120)
    steps.push(await B.evaluate((id) => {
      const mm = window.__mm; const root = mm.reconciler.objectFor(id); let roots = 0
      mm.stage.scene.traverse((o) => { if (o.userData?.entity === id && o === mm.reconciler.objectFor(id)) roots++ })
      const v = mm.reconciler.visualFor(id)
      return { kind: v?.userData.kind, key: v?.userData.key, sameRoot: root === window.__probe.root, sameLive: mm.world.get(id).live === window.__probe.live && mm.world.get(id).live.marker === 42, visuals: root.children.filter((c) => !c.userData?.entity).length, roots, placeholders: mm.reconciler.stats().placeholders, missing: !!v?.userData.missing }
    }, id))
  }
  ok(treeAnim?.sameVisual && treeAnim.sameMeshes && treeAnim.meshes === 2 && treeAnim.swingDeg > 5, 'tree -> tree + animations: same visual and the same mesh objects, and the trunk now sways', treeAnim)
  const rigStep = steps.find((s) => s.kind === 'rig')
  ok(rigStep && /^model:horse:\d+(\.\d+)*:[0-9a-f]{14}$/.test(rigStep.key ?? '') && !rigStep.missing, `the rig step renders the library horse (template ${rigStep?.key})`, rigStep)
  // a look replaced while its model is still loading: the late load must not land or leak
  const slow = `${S.origin}${PREFIX}__e2e/tri.gltf?delay=900`
  await B.evaluate(([id, url]) => window.__mm.caps.world.get(id).replace('representation', { kind: 'model', url, scale: 1 }), [id, slow])
  await waitIn(B, (id) => window.__mm.reconciler.visualFor(id)?.userData.kind === 'model', id)
  await B.evaluate((id) => window.__mm.caps.world.get(id).replace('representation', { kind: 'billboard', image: 'emoji:🧪', size: 1.2 }), id)
  await sleep(1500) // past the delayed response
  const midLoad = await B.evaluate((id) => { const mm = window.__mm; const root = mm.reconciler.objectFor(id); return { kind: mm.reconciler.visualFor(id)?.userData.kind, visuals: root.children.filter((c) => !c.userData?.entity).length, sameRoot: root === window.__probe.root } }, id)
  ok(midLoad.kind === 'billboard' && midLoad.visuals === 1 && midLoad.sameRoot, 'a look replaced mid-load stays replaced: the late model never lands', midLoad)
  const end = await B.evaluate(() => { const k = window.__mm.resources.keys(); return { left: k.filter((x) => /13579b|2468ac|2468ad|97531f|model:|inline:|gltf:|placeholder/i.test(x) && !window.__probe.keys0.includes(x)), added: k.filter((x) => !window.__probe.keys0.includes(x)) } })
  // the probe started as this same billboard, so nothing it holds now is new; other
  // entities may meanwhile have acquired a dead tint: billboard sprites, or (the
  // meadow's creatures are rigs) node materials greyed to ≤ #565656 per channel
  const deadTint = (k) => { const m = /^mat:std:#([0-9a-f]{6}):/.exec(k); return !!m && [0, 2, 4].every((i) => parseInt(m[1].slice(i, i + 2), 16) <= 0x56) }
  ok(end.added.every((k) => /^(tex|spritemat):/.test(k) || deadTint(k)), 'the final look holds only billboard keys: nothing of the model or the other looks was added (other entities\' dead tints aside)', end.added.filter((k) => !/^(tex|spritemat):/.test(k) && !deadTint(k)))
  ok(steps.some((s) => s.kind === 'model'), 'the model kind (async glTF load) was one of the steps', steps.map((s) => s.kind))
  ok(steps.every((s) => s.sameRoot && s.sameLive && s.roots === 1), 'every swap kept the same root Object3D and the same live state', steps.map((s) => `${s.kind}:${s.sameRoot && s.sameLive}`).join(' '))
  ok(steps.every((s) => s.visuals === 1) && steps.every((s) => s.placeholders === 0), 'exactly one visual child per step, no placeholders', steps.map((s) => s.visuals))
  ok(end.left.length === 0, 'no resource of the intermediate looks is still held (primitive, tree, inline rig, model template, glTF)', end)
  await B.evaluate((id) => window.__mm.caps.world.get(id).destroy(), id)
}

// ============================================================== keys: wrong key, view link
async function keysPhase () {
  phase('keys')
  const { A, B, L } = S
  const sessions = () => Promise.all([A, B].map((p) => p.evaluate(() => window.__mm.agentHost.sessions().length)))
  const before = await sessions()
  const wrong = buildLink({ docUrl: L.docUrl, key: newKey(), sync: L.sync }, S.BASE)
  const cw = await connect(wrong, { hostTimeoutMs: 1500 })
  const after = await sessions()
  let wrongCapture = null; try { await E(cw.world).capture({}) } catch (e) { wrongCapture = e.message }
  ok(cw.mode === 'local' && /time|answer/i.test(cw.fallbackReason ?? '') && JSON.stringify(before) === JSON.stringify(after), `a wrong key gets no host session (fell back: "${cw.fallbackReason}"; host sessions ${before} -> ${after})`)
  ok(/live host page/.test(wrongCapture ?? ''), 'with a wrong key, capture is refused', wrongCapture)
  // the raw transport: the hosts never answer a SYN sealed with the wrong key
  let raw = null; const t0 = Date.now()
  try { await connectCapTP(cw.handle, await aesKey(newKey(), cw.handle.documentId), { timeoutMs: 1200 }); raw = 'CONNECTED' } catch (e) { raw = `${e.message} after ${Date.now() - t0} ms` }
  ok(raw !== 'CONNECTED', 'a SYN sealed with a wrong key is never answered', raw)
  await cw.close()

  const viewKey = await B.evaluate(() => window.__mm.agentHost.viewKey)
  const VIEW = buildLink({ docUrl: L.docUrl, view: viewKey, sync: L.sync }, S.BASE)
  S.VIEW = VIEW
  const cv = await connect(VIEW)
  const d = await E(cv.world).describe()
  const verdict = {}
  const tries = {
    spawn: () => E(cv.world).spawn({ name: 'nope' }), batch: () => E(cv.world).batch([]), defineSystem: () => E(cv.world).defineSystem('x', { source: 'export default {}' }),
    eval: () => E(cv.world).eval('return 1'), capture: () => E(cv.world).capture({}), entitySet: () => E(E(cv.world).get(S.trex)).set('body', { speed: 1 }),
  }
  for (const [k, f] of Object.entries(tries)) { try { await f(); verdict[k] = 'ALLOWED' } catch (e) { verdict[k] = 'refused' } }
  const readOk = !!(await E(E(cv.world).get(S.trex)).get('transform'))
  ok(cv.mode === 'live' && cv.role === 'viewer' && d?.entities > 0 && readOk, `a view link attaches live as a viewer and can read (${d?.entities} entities)`)
  ok(Object.values(verdict).every((v) => v === 'refused'), 'a view link cannot write, eval or capture', verdict)
  await cv.close()
  const cvl = await connect(VIEW, { local: true })
  let localSpawn = 'ALLOWED'; try { await E(cvl.world).spawn({ name: 'nope' }) } catch { localSpawn = 'refused' }
  ok(cvl.mode === 'local' && localSpawn === 'refused', 'a view link attenuates in local mode too (spawn refused without a host)')
  await cvl.close()

  // the same-origin page tool: public/agent.js imported by URL into another page of
  // B's browser, talking to B over a BroadcastChannel (no sync server hop)
  const T = await S.ctxB.newPage({ viewport: SMALL }); openPages.add(T); T.on('close', () => openPages.delete(T)); watchPage(T, 'tool')
  await T.goto(`${new URL(S.BASE).origin}/probe`)
  const tool = await T.evaluate(async ({ url, link }) => {
    const mm = await import(url)
    const t0 = performance.now(); const c = await mm.connect(link); const connectMs = performance.now() - t0
    const t1 = performance.now(); const d = await c.E(c.world).describe(); const describeMs = performance.now() - t1
    const id = await c.E(c.E(c.world).spawn({ preset: 'tree', name: 'tool tree', at: [-14, 0, -6] })).id()
    await c.close()
    return { connectMs: Math.round(connectMs), describeMs: Math.round(describeMs), entities: d.entities, id, role: c.role }
  }, { url: S.BASE + 'agent.js', link: S.linkA })
  const landed = await waitIn(B, (id) => !!window.__mm.reconciler.objectFor(id), tool.id).then(() => true, () => false)
  ok(landed && tool.role === 'editor', `a same-origin page tool (agent.js over BroadcastChannel) connected in ${tool.connectMs} ms and spawned into B`, tool)
  // T stays open until B closes: closing a page stalls the other pages of a headless
  // browser for up to ~2.8 s (measured), past the 2.5 s stream TTL, after which B
  // rightly rejoins as a newcomer (§4.1) and the handoff below would measure the rig
  S.T = T
  const tFin = Date.now()
  await waitIn(B, () => window.__mm.agentHost.sessions().length === 0, undefined, 15000).catch(() => {})
  const left = await B.evaluate(() => window.__mm.agentHost.sessions())
  ok(left.length === 0, `the page tool's session ended with its fin (${Date.now() - tFin} ms)`, left.length ? left : undefined)
}

// ============================================================== handoff
async function handoffPhase () {
  phase('handoff')
  const { A, B, trex } = S
  await B.evaluate((trex) => {
    const mm = window.__mm; window.__ho = { host: null, owns: null, ticks: [] }
    window.__hoTimer = setInterval(() => {
      const t = Date.now()
      const tc = mm.world.tickCount; const last = window.__ho.ticks[window.__ho.ticks.length - 1]
      if (!last || last[1] !== tc) window.__ho.ticks.push([t, tc])
      if (window.__ho.host == null && mm.presence.host() === mm.peerId) window.__ho.host = t
      if (window.__ho.owns == null && mm.ownership.owns(trex)) window.__ho.owns = t
    }, 2)
  }, trex)
  const pre = await B.evaluate((trex) => [window.__mm.presence.host(), window.__mm.ownership.owns(trex)], trex)
  ok(pre[0] === PEER_A && pre[1] === false, 'before: A hosts and B does not own the T-rex', pre)
  const p0 = await B.evaluate((id) => window.__mm.world.get(id).live.p, trex)
  // B's draw is skipped for the handoff window: ownership is recomputed in the sim step,
  // and a SwiftShader frame (~150 ms here) would otherwise set the resolution (see chase)
  await setDrawing([B], false)
  const tClose = Date.now()
  await A.close() // graceful: pagehide -> final checkpoint, bye
  const ho = await until(() => B.evaluate(() => (window.__ho.host && window.__ho.owns ? window.__ho : null)), { timeout: 8000, every: 20 })
  const hostMs = ho ? ho.host - tClose : null; const ownMs = ho ? ho.owns - tClose : null
  const bGaps = await B.evaluate(() => window.__gaps)
  ok(ho && hostMs <= 250, `A closed gracefully -> B is host after ${hostMs} ms (≤250 ms)`, bGaps.length ? { bStepGapsMs: bGaps.map(([t, g]) => [t - tClose, g]) } : undefined)
  const gaps = ho ? ho.ticks.filter(([t]) => t > tClose - 300 && t < tClose + 1500).map(([t, n], i, a) => (i ? [t - tClose, t - a[i - 1][0], n] : null)).filter((g) => g && g[1] > 60) : []
  ok(ho && ownMs <= 250, `B owns the T-rex ${ownMs} ms after A closed (≤250 ms)`, gaps.length ? { tickGapsMs: gaps } : undefined)
  await sleep(1500)
  // a wandering T-rex (its prey dead) can cover < 0.5 m in 1.5 s: give it up to 3 s more
  const sample = () => B.evaluate((id) => ({ p: window.__mm.world.get(id).live.p, intent: window.__mm.world.get(id).live.intent ?? null, owns: window.__mm.ownership.owns(id) }), trex)
  const p1 = await until(async () => { const s = await sample(); return Math.hypot(s.p[0] - p0[0], s.p[2] - p0[2]) > 0.5 ? s : null }, { timeout: 3000, every: 100 }) ?? await sample()
  // B never owned the T-rex before: live.intent is written only by its owner's decide
  // system, so an intent at all (and motion) means B really runs its sim now
  const moved = Math.hypot(p1.p[0] - p0[0], p1.p[2] - p0[2])
  ok(p1.owns && p1.intent != null && moved > 0.5, `B simulates the T-rex now (owns ${p1.owns}, moved ${moved.toFixed(2)} m, intent ${p1.intent?.act})`)
  await B.evaluate(() => clearInterval(window.__hoTimer))
  await setDrawing([B], true)
  await S.ctxA.close()
}

// ============================================================== MCP through the live page B
async function mcpPhase () {
  phase('mcp')
  const { B } = S
  const m = await mcpClient()
  S.mcpTools = m.tools
  try {
    ok(['connect', 'describe', 'list', 'get', 'spawn', 'set', 'replace', 'remove', 'despawn', 'batch', 'define_preset', 'define_component', 'define_system', 'systems', 'explain', 'events', 'capture', 'eval'].every((t) => m.tools.includes(t)), `the MCP server lists its tools (${m.tools.length})`)
    const con = await m.call('connect', { link: S.linkA })
    ok(!con.isError && con.json.mode === 'live', `MCP connects live through B (${con.ms} ms)`, con.json)
    const sp = await m.call('spawn', { preset: 'sheep', name: 'Agent Sheep', at: [2, 0, 12] })
    const id = sp.json?.result?.id
    const seen = id && await waitIn(B, (id) => !!window.__mm.reconciler.objectFor(id), id).then(() => true, () => false)
    ok(!sp.isError && seen && sp.json.mode === 'live', `MCP spawn -> B renders ${id} (${sp.ms} ms)`)
    const st = await m.call('set', { id, component: 'body', patch: { speed: 2.5 } })
    const speed = await until(() => B.evaluate((id) => Number(window.__mm.world.get(id)?.c.body?.speed) === 2.5, id), { timeout: 3000 })
    ok(!st.isError && speed, 'MCP set merges a field (body.speed = 2.5 in B\'s world)')
    // a sheep is simulated by B (the host): the move must reach it as an inbox move, not only a doc transform
    const mv = await m.call('set', { id, component: 'transform', patch: { p: [-8, 0, -8] } })
    const moved = await until(() => B.evaluate((id) => { const p = window.__mm.world.get(id)?.live.p; return p && Math.hypot(p[0] + 8, p[2] + 8) < 1.5 }, id), { timeout: 3000 })
    ok(!mv.isError && moved, 'MCP set transform moves a simulated entity on the live page (inbox move drained by its owner)')
    const rp = await m.call('replace', { id, component: 'representation', data: { kind: 'rig', model: 'sheep' } })
    const rig = await waitIn(B, (id) => { const v = window.__mm.reconciler.visualFor(id); return v?.userData.kind === 'rig' && !v.userData.missing }, id).then(() => true, () => false)
    ok(!rp.isError && rig, 'MCP replace swaps the representation to a rig (library sheep) on the live page')
    // the person question (design §17): a wizard is a biped with a hat and a staff
    const lib = await m.call('models')
    const libNames = lib.json?.result?.map?.((r) => r.name) ?? []
    ok(!lib.isError && ['quadruped', 'biped', 'serpent', 'bird', 'horse', 'sheep', 'trex'].every((n) => libNames.includes(n)), `models lists the library (${libNames.join(', ')})`, lib.isError ? lib.json : undefined)
    const dm = await m.call('define_model', { name: 'mage', model: WIZARD })
    const wz = await m.call('spawn', { name: 'Wizard', at: [4, 0, 12], components: { transform: { p: [4, 0, 12], r: [0, 0, 0], s: [1, 1, 1] }, representation: { kind: 'rig', model: 'mage' } } })
    const wid = wz.json?.result?.id
    const bones = wid && await waitIn(B, (id) => { const v = window.__mm.reconciler.visualFor(id); return v?.userData.kind === 'rig' && !v.userData.missing && v.userData.bones?.has('hat') && v.userData.bones.has('staff') && v.userData.bones.has('thigh_l') ? v.userData.key : null }, wid).then((h) => h.jsonValue(), () => null)
    ok(!dm.isError && !wz.isError && bones, `define_model mage (a scratch wizard: extends biped) + a rig look: B renders it with the biped's bones plus hat and staff (template ${bones})`, dm.isError ? dm.json : wz.isError ? wz.json : undefined)
    const ls = await m.call('models')
    const wrow = ls.json?.result?.find?.((r) => r.name === 'mage')
    ok(wrow && String(wrow.extends) === 'biped' && wrow.nodes.includes('hat') && wrow.nodes.includes('head') && wrow.clips.includes('walk'), 'models() reports the mage: extends biped, node names after extends, the inherited clips', wrow)
    const badM = await m.call('define_model', { name: 'mage', model: { ...WIZARD, animations: { idle: { tracks: { 'hat.rz': 'sin(t*' } } } } })
    await sleep(300)
    const rev = await B.evaluate(() => { const w = window.__mm.handle.doc().models?.mage; return { rev: Number(w?.rev?.value ?? w?.rev ?? 0), idle: !!w?.animations?.idle } })
    ok(badM.isError && /column/.test(badM.json?.error ?? '') && rev.rev === 1 && !rev.idle, 'define_model with an expression syntax error is refused before the doc changes (the mage stays at rev 1)', { error: String(badM.json?.error ?? '').slice(0, 120), ...rev })
    S.wizard = wid
    // redefining a model that is IN USE rebuilds its instances on the live page (§17.4).
    // First remove + redefine in one batch with other content: the revs start again at
    // 1.1, so only the content part of the key tells B's look that it is stale
    const keyOf = (id) => B.evaluate((id) => window.__mm.reconciler.visualFor(id)?.userData.key ?? null, id)
    const k1 = await keyOf(wid)
    const CROWNED = { ...WIZARD, nodes: [{ name: 'head', children: [{ name: 'crown', shape: 'cylinder', p: [0, 0.3, 0], s: [0.26, 0.1, 0.26], color: '#e8c020' }] }, ...WIZARD.nodes.slice(1)] }
    const rr = await m.call('batch', { ops: [{ op: 'removeModel', name: 'mage' }, { op: 'defineModel', name: 'mage', model: CROWNED }] })
    const crowned = await waitIn(B, ([id, k1]) => { const v = window.__mm.reconciler.visualFor(id); return v && !v.userData.missing && v.userData.key !== k1 && v.userData.bones?.has('crown') && !v.userData.bones.has('hat') ? v.userData.key : null }, [wid, k1]).then((h) => h.jsonValue(), () => null)
    ok(!rr.isError && crowned && /^model:mage:1\.1:/.test(k1) && /^model:mage:1\.1:/.test(crowned), `remove_model + define_model with other content (same revs 1.1) rebuilds the mage on B (${k1} -> ${crowned})`, rr.isError ? rr.json : { k1, crowned })
    // then a plain redefinition: a new hat colour and a new node
    const V2 = { ...WIZARD, nodes: [{ name: 'head', children: [{ ...WIZARD.nodes[0].children[0], color: '#7a2a3b' }, { name: 'beard', shape: 'cone', p: [0, 0.02, 0.16], r: [180, 0, 0], s: [0.16, 0.22, 0.08], color: '#e8e8e8' }] }, ...WIZARD.nodes.slice(1)] }
    const v2 = await m.call('define_model', { name: 'mage', model: V2 })
    const rebuilt = await waitIn(B, (id) => { const v = window.__mm.reconciler.visualFor(id); return v && /^model:mage:2\.1:/.test(v.userData.key) && v.userData.bones?.has('beard') && v.userData.bones.has('hat') && !v.userData.bones.has('crown') ? v.userData.key : null }, wid).then((h) => h.jsonValue(), () => null)
    const wkeys = await B.evaluate(() => window.__mm.resources.keys().filter((k) => /^model:mage:/.test(k)))
    const hatColor = await B.evaluate((id) => '#' + window.__mm.reconciler.visualFor(id)?.userData.bones.get('hat')?.userData.mesh?.material.color.getHexString(), wid)
    ok(!v2.isError && rebuilt && wkeys.length === 1 && wkeys[0] === rebuilt && hatColor === '#7a2a3b', `define_model of an in-use model rebuilds it on B: key ${rebuilt}, the new beard bone, the new hat colour (${hatColor}), one mage template in resources`, { rebuilt, wkeys, hatColor, err: v2.isError ? v2.json : undefined })
    // a misspelt stub is refused with the base's name, not added at the feet
    const typo = await m.call('define_model', { name: 'mage', model: { ...WIZARD, nodes: [...WIZARD.nodes, { name: 'right_arm', children: [{ name: 'wand', shape: 'cylinder', s: [0.02, 0.3, 0.02] }] }] } })
    ok(typo.isError && /did you mean "arm_r"/.test(typo.json?.error ?? ''), 'define_model refuses a stub that names no biped bone and suggests the right one', String(typo.json?.error ?? '').slice(0, 200))
    // B is the host and keeps writing checkpoints, so heads move anyway here: the strict
    // heads-unchanged check runs in the local phase, where nothing else writes
    const bad = await m.call('define_system', { name: 'broken', source: 'export default { update (world) { for (const e of world.query("tags") ' })
    await sleep(300)
    const landed = await B.evaluate(() => !!window.__mm.handle.doc().systems?.broken)
    const after = await m.call('describe')
    ok(bad.isError && !landed && /SyntaxError/.test(bad.json?.error ?? '') && !after.isError && after.json.mode === 'live', 'define_system with a syntax error is refused before the doc changes, and the live connection survives the refusal', String(bad.json?.error ?? '').split('\n').pop().trim().slice(0, 80))
    const good = await m.call('define_system', { name: 'agent-noop', source: 'export default { update () {} }' })
    const sys = await m.call('systems')
    ok(!good.isError && sys.json.result?.some((s) => s.name === 'agent-noop' && s.ok), 'a valid define_system compiles on the page and reports ok', good.isError ? good.json : sys.json?.result?.map?.((s) => [s.name, s.ok]) ?? sys.json)
    const ex = await m.call('explain', { id: S.trex })
    ok(!ex.isError && ex.json.result?.owner === PEER_B, `explain through the live page (owner ${ex.json.result?.owner}, intent ${ex.json.result?.intent?.act})`, ex.isError ? ex.json : undefined)
    const cap = await m.call('capture', {})
    const buf = cap.image ? Buffer.from(cap.image.data, 'base64') : Buffer.alloc(0)
    if (buf.length) fs.writeFileSync(path.join(OUT, 'capture.jpg'), buf)
    ok(!cap.isError && cap.image?.mimeType === 'image/jpeg' && buf[0] === 0xff && buf[1] === 0xd8 && buf.length > 5000, `capture returns a JPEG of the live view (${buf.length} bytes)`, cap.isError ? cap.json : undefined)
    const ev = await m.call('events', { types: ['entity-added'] })
    ok(!ev.isError && ev.json.events?.some((e) => e.id === id), 'events reports the spawn', ev.isError ? ev.json : ev.json.events?.length)
    S.agentSheep = id
  } finally { await m.close() }
}

// ============================================================== local fallback (no page open) + doc history
async function localPhase () {
  phase('local')
  await S.T?.close(); await S.B.close(); await S.ctxB.close()
  ok(openPages.size === 0, 'no page is open')
  const m = await mcpClient({ MERGE_MEADOW_HOST_TIMEOUT: '1200' })
  try {
    const con = await m.call('connect', { link: S.linkA })
    ok(!con.isError && con.json.mode === 'local' && !!con.json.fallbackReason, `with no page open, MCP falls back to local mode ("${con.json?.fallbackReason}")`)
    const sp = await m.call('spawn', { preset: 'trex', name: 'Offline Rex', at: [0, 0, -10] })
    ok(!sp.isError && sp.json.mode === 'local' && typeof sp.json.syncedMs === 'number', `local spawn is acknowledged by the sync server (${sp.json?.syncedMs} ms)`, sp.json)
    S.offlineRex = sp.json?.result?.id
    const cap = await m.call('capture', {})
    ok(cap.isError && /live host page/.test(cap.json?.error ?? ''), 'capture needs a live host page', cap.json?.error)
    const sys = await m.call('systems')
    ok(!sys.isError && sys.json.result.every((s) => s.status === 'unknown'), 'systems reports status unknown without a page')
    const h0 = await m.call('heads')
    const bad = await m.call('define_system', { name: 'oops', source: 'export default { update( ' })
    const h1 = await m.call('heads')
    ok(bad.isError && !h0.isError && JSON.stringify(h0.json.result) === JSON.stringify(h1.json.result), 'local define_system with a syntax error leaves the doc heads unchanged', String(bad.json?.error ?? '').split('\n').pop().trim().slice(0, 80))
    ok(typeof h0.json.versionLink === 'string' && /heads=/.test(h0.json.versionLink), 'heads also returns a read-only version link')
    // define_model in local mode: valid writes, a syntax error leaves the heads unchanged
    const okM = await m.call('define_model', { name: 'apprentice', model: { extends: 'mage', nodes: [{ name: 'hat', color: '#2a6a3a' }] } })
    const hm0 = await m.call('heads')
    const badM = await m.call('define_model', { name: 'apprentice', model: { extends: 'mage', animations: { idle: { tracks: { 'hat.ry': 'sin(t * 2' } } } } })
    const hm1 = await m.call('heads')
    ok(!okM.isError && badM.isError && JSON.stringify(hm0.json.result) === JSON.stringify(hm1.json.result), 'local define_model: a valid model writes, one with a syntax error leaves the doc heads unchanged', String(badM.json?.error ?? '').slice(0, 100))
    const one = await m.call('model', { name: 'apprentice' })
    const names = []; const walk = (ns) => { for (const n of ns ?? []) { names.push(n.name); walk(n.children) } }; walk(one.json?.result?.nodes)
    const ls2 = await m.call('models')
    ok(!one.isError && names.includes('hat') && names.includes('staff') && names.includes('thigh_r') && ls2.json?.result?.some((r) => r.name === 'apprentice' && String(r.extends) === 'mage'), `model() resolves a two-level extends chain (apprentice -> mage -> biped: ${names.length} nodes) and models() lists it`)
    const ls = await m.call('list', { tags: ['predator'] })
    ok(!ls.isError && ls.json.result.some((r) => r.id === S.offlineRex), 'list filters on preset-resolved tags')
  } finally { await m.close() }
  // the one-shot CLI, local mode
  // async: the sync server runs in this process, so a blocking exec would deadlock it
  const { stdout: out } = await promisify(execFile)(process.execPath, [path.join(PKG, 'agent/cli.mjs'), S.linkA, 'get', S.offlineRex, 'health', '--local'], { encoding: 'utf8' })
  ok(JSON.parse(out)?.max > 0, 'the CLI reads the offline T-rex', out.trim().slice(0, 80))
  const { stdout: mOut } = await promisify(execFile)(process.execPath, [path.join(PKG, 'agent/cli.mjs'), S.linkA, 'models', '--local'], { encoding: 'utf8' })
  let cliModels = null; try { cliModels = JSON.parse(mOut) } catch {}
  ok(Array.isArray(cliModels) && cliModels.some((r) => r.name === 'mage') && cliModels.some((r) => r.name === 'wizard') && cliModels.some((r) => r.name === 'horse'), 'the CLI lists the models (library, its wizard, and the scratch mage)', mOut.trim().slice(0, 80))

  // ---- exactly-once, from the doc's own history (S2's verify-doc, for the ledger)
  const c = await connect(S.linkA, { local: true })
  try {
    const doc = c.handle.doc()
    const puts = new Map() // hitId -> [{actor, seq, value}]
    const changes = Automerge.getAllChanges(doc)
    for (const bin of changes) {
      const ch = Automerge.decodeChange(bin)
      for (const op of ch.ops) {
        if (op.action !== 'set' && op.action !== 'makeText' && op.action !== 'put') continue
        if (typeof op.key !== 'string' || !/^p_[A-Za-z0-9_-]+:[a-z0-9]+\.\d+$/.test(op.key)) continue
        if (!puts.has(op.key)) puts.set(op.key, [])
        puts.get(op.key).push({ actor: ch.actor.slice(0, 8), seq: ch.seq, value: op.value, hash: ch.hash })
      }
    }
    const twice = [...puts].filter(([, w]) => w.length > 1)
    const byPeer = {}; for (const k of puts.keys()) { const p = k.split(':')[0]; byPeer[p] = (byPeer[p] ?? 0) + 1 }
    ok(puts.size > 0 && twice.length === 0, `doc history: ${puts.size} hit ids over ${changes.length} changes, each put exactly once`, { byPeer, twice: twice.slice(0, 3) })
    // with one simulator per entity, one attacker's hits are at least a cooldown apart
    // (a split brain would double them); the doc holds what each victim took
    const final = Object.entries(doc.entities ?? {}).map(([id, e]) => [id, Object.keys(e.components?.health?.hits ?? {}).length]).filter(([, n]) => n)
    // a hit whose victim was later despawned (the ride phase's horse, say: the meadow
    // is full of prey now) left with it; find its victim in the doc as of that change
    const inLedger = new Set(Object.values(doc.entities ?? {}).flatMap((e) => Object.keys(e.components?.health?.hits ?? {})))
    const gone = [...puts].filter(([k]) => !inLedger.has(k)).map(([k, w]) => {
      const then = Automerge.view(doc, [w[0].hash])
      const victim = Object.entries(then.entities ?? {}).find(([, e]) => Object.hasOwn(e.components?.health?.hits ?? {}, k))?.[0] ?? null
      return { hit: k, victim, despawned: !!victim && !doc.entities?.[victim] }
    })
    ok(final.reduce((s, [, n]) => s + n, 0) + gone.length === puts.size && gone.every((g) => g.despawned), `every put hit is still in its victim's ledger, or its victim was despawned (${gone.length}; no lost or duplicated keys)`, { ledgers: Object.fromEntries(final), gone })
    ok(!!doc.entities?.[S.offlineRex] && !!doc.entities?.[S.agentSheep], 'the doc on the server holds the local and the live agent spawns')
  } finally { await c.close() }
}

// ============================================================== rigs: 300 animating, dead tint, preview state
// A fresh world in its own tab (nothing else open, so the timings above are not
// disturbed): R is host and sim of its own world.
async function rigsPhase () {
  phase('rigs')
  ok(openPages.size === 0, 'no other page is open')
  const ctx = await browser.newContext({ viewport: SMALL })
  const R = await openPage(ctx, `${S.BASE}#new=meadow&sync=${encodeURIComponent(S.SYNC)}`, 'R', { timeout: 45000 })
  try {
    const lib = await R.evaluate(() => Object.keys(window.__mm.handle.doc().models ?? {}).sort())
    ok(JSON.stringify(lib) === JSON.stringify(Object.keys(MODEL_LIBRARY).sort()), `a new world carries the ${Object.keys(MODEL_LIBRARY).length} library models (${lib.join(', ')})`)

    // ---- 300 rigs of two library models, walking and running (preview state: no sim needed)
    const N = 300
    const keys0 = await R.evaluate(() => window.__mm.resources.keys())
    // the meadow's own rigs (T-rex, sheep, horse, wizard, zodiac animals) already hold model templates
    const refs0 = await R.evaluate(() => Object.fromEntries(window.__mm.resources.keys().filter((k) => /^model:/.test(k)).map((k) => [k, window.__mm.resources.refs(k)])))
    const tSpawn = Date.now()
    const ids = await R.evaluate((N) => {
      const ops = []
      for (let i = 0; i < N; i++) {
        const x = -18 + (i % 20) * 1.9; const z = -12 + Math.floor(i / 20) * 1.9
        ops.push({ op: 'spawn', name: `rig ${i}`, components: { transform: { p: [x, 0, z], r: [0, (i * 37) % 360, 0], s: [1, 1, 1] }, representation: { kind: 'rig', model: i % 2 ? 'sheep' : 'horse', scale: 0.6 } } })
      }
      return window.__mm.caps.world.batch(ops).map((r) => (typeof r === 'string' ? r : r?.id))
    }, N)
    const spawnMs = Date.now() - tSpawn
    const built = await waitIn(R, (ids) => ids.every((id) => { const v = window.__mm.reconciler.visualFor(id); return v?.userData.kind === 'rig' && !v.userData.missing }), ids, 60000).then(() => true, () => false)
    ok(ids.length === N && built, `${N} rigs (horse + sheep) spawned in one batch and built (${spawnMs} ms to write)`)
    // what the 300 hold beyond the meadow's own looks (the meadow's creatures keep living,
    // and a kill there adds a dead-tint material that is not theirs)
    const held = await R.evaluate((keys0) => window.__mm.resources.keys().filter((k) => !keys0.includes(k)), keys0)
    await R.evaluate((ids) => ids.forEach((id, i) => window.__mm.reconciler.preview(id, { anim: i % 4 === 3 ? 'run' : 'walk' })), ids)
    const shared = await R.evaluate((refs0) => window.__mm.resources.keys().filter((k) => /^model:/.test(k)).map((k) => [k, window.__mm.resources.refs(k) - (refs0[k] ?? 0)]).filter(([, n]) => n !== 0), refs0)
    ok(shared.length === 2 && shared.every(([k, n]) => n === 150 && /^model:(horse|sheep):/.test(k)), 'all instances share one template per model (150 more refs on the meadow\'s horse and sheep templates, nothing new)', shared)
    // time the loop: the reconciler (CPU: vars, controller, tracks, node writes) and a
    // frame's render, closed by a 1 px readback so the GPU work is inside the frame
    const perf = await R.evaluate(async ([id0, frames]) => {
      const mm = window.__mm; const rec = mm.reconciler; const st = mm.stage
      const gl = mm.renderer.getContext(); const px = new Uint8Array(4)
      const fr = rec.frame; const rd = st.render; const recMs = []; const drawMs = []; const gaps = []
      let last = 0
      rec.frame = function (...a) { const t = performance.now(); if (last) gaps.push(t - last); last = t; const r = fr.apply(this, a); recMs.push(performance.now() - t); return r }
      st.render = function (...a) { const t = performance.now(); const r = rd.apply(this, a); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); drawMs.push(performance.now() - t); return r }
      // a leg of one horse, to show the clips really move the bones
      const leg = [...mm.reconciler.visualFor(id0).userData.bones.entries()].find(([n]) => /^(leg|thigh|upper_leg|hip)/.test(n))?.[1]
      const rx = []
      while (recMs.length < frames) { await new Promise((r) => requestAnimationFrame(r)); if (leg) rx.push(leg.rotation.x) }
      rec.frame = fr; st.render = rd
      const stat = (xs) => { const s = [...xs].sort((a, b) => a - b); return { mean: +(s.reduce((a, b) => a + b, 0) / s.length).toFixed(2), p95: +s[Math.floor(s.length * 0.95)].toFixed(2), max: +s[s.length - 1].toFixed(2) } }
      return { frames: recMs.length, reconcilerMs: stat(recMs), renderReadbackMs: stat(drawMs), frameGapMs: stat(gaps), fps: +(1000 / stat(gaps).mean).toFixed(1), legSwingDeg: rx.length ? +((Math.max(...rx) - Math.min(...rx)) * 180 / Math.PI).toFixed(1) : null, drawCalls: mm.renderer.info.render.calls }
    }, [ids[0], 40])
    S.rigPerf = perf
    console.log(`#   300 rigs: reconciler ${perf.reconcilerMs.mean} ms/frame (p95 ${perf.reconcilerMs.p95}), render + 1 px readback ${perf.renderReadbackMs.mean} ms, ${perf.fps} fps, ${perf.drawCalls} draw calls`)
    ok(perf.frames >= 40 && perf.legSwingDeg > 10, `the 300 rigs animate (a horse's leg swings ${perf.legSwingDeg}° over ${perf.frames} frames)`, perf)
    ok(perf.reconcilerMs.mean < 10, `reconciler CPU for 300 animating rigs: ${perf.reconcilerMs.mean} ms/frame mean (p95 ${perf.reconcilerMs.p95}; bound 10 ms)`)
    // the same rigs with their state flipping walk <-> idle every frame (a creature at a
    // speed threshold): every frame starts a crossfade, which must stay bounded
    const flick = await R.evaluate(async ([ids, frames]) => {
      const rec = window.__mm.reconciler; const fr = rec.frame; const ms = []
      rec.frame = function (...a) { const t = performance.now(); const r = fr.apply(this, a); ms.push(performance.now() - t); return r }
      let i = 0
      while (ms.length < frames) { const st = i++ % 2 ? 'idle' : 'walk'; for (const id of ids) rec.preview(id, { anim: st }); await new Promise((r) => requestAnimationFrame(r)) }
      rec.frame = fr
      const sets = Math.max(...ids.map((id) => rec.visualFor(id)?.userData.ctl?.sets ?? 0))
      const s = [...ms].sort((a, b) => a - b)
      return { mean: +(s.reduce((a, b) => a + b, 0) / s.length).toFixed(2), p95: +s[Math.floor(s.length * 0.95)].toFixed(2), sets }
    }, [ids, 40])
    const flickBound = +(perf.reconcilerMs.mean * 2 + 1).toFixed(2)
    console.log(`#   300 rigs flickering walk/idle every frame: reconciler ${flick.mean} ms/frame (p95 ${flick.p95}), at most ${flick.sets} crossfade sets per rig`)
    ok(flick.mean < flickBound && flick.sets <= 3, `reconciler CPU for 300 rigs switching state every frame: ${flick.mean} ms/frame mean (bound 2 x steady + 1 = ${flickBound} ms), crossfade sets per rig ${flick.sets} (<= 3)`, flick)
    await R.evaluate((ids) => { for (const id of ids) window.__mm.reconciler.preview(id, { anim: null }); return window.__mm.caps.world.batch(ids.map((id) => ({ op: 'despawn', id }))).length }, ids)
    await waitIn(R, (ids) => ids.every((id) => !window.__mm.reconciler.objectFor(id)), ids, 30000).catch(() => {})
    const left = await R.evaluate(([held, refs0]) => ({
      keys: window.__mm.resources.keys().filter((k) => held.includes(k)),
      refs: Object.entries(refs0).filter(([k, n]) => window.__mm.resources.refs(k) > n).map(([k, n]) => [k, n, window.__mm.resources.refs(k)]),
    }), [held, refs0])
    ok(left.keys.length === 0 && left.refs.length === 0, `after despawning the 300 rigs no resource they held is left (${held.length} keys of their own; the shared templates are back to the meadow's refs)`, left)

    // ---- preview state drives a clip with the sim idle (the editor's selector)
    const pid = await R.evaluate(() => window.__mm.caps.world.spawn({ name: 'preview horse', components: { transform: { p: [0, 0, 16], r: [0, 0, 0], s: [1, 1, 1] }, representation: { kind: 'rig', model: 'horse' } } }).id())
    await waitIn(R, (id) => window.__mm.reconciler.visualFor(id)?.userData.kind === 'rig', pid)
    const swing = (id, ms) => R.evaluate(async ([id, ms]) => {
      const bones = [...window.__mm.reconciler.visualFor(id).userData.bones.values()]; const lo = bones.map(() => Infinity); const hi = bones.map(() => -Infinity)
      const t0 = performance.now()
      while (performance.now() - t0 < ms) { bones.forEach((b, i) => { lo[i] = Math.min(lo[i], b.rotation.x); hi[i] = Math.max(hi[i], b.rotation.x) }); await new Promise((r) => requestAnimationFrame(r)) }
      return +(Math.max(...bones.map((b, i) => hi[i] - lo[i])) * 180 / Math.PI).toFixed(1)
    }, [id, ms])
    const idleSwing = await swing(pid, 800)
    await R.evaluate((id) => { window.__mm.interaction.select(id); window.__mm.editor.showTab('inspector') }, pid)
    const sel = await waitIn(R, () => !!document.querySelector('#app select.rig-preview'), undefined, 5000).then(() => true, () => false)
    await R.evaluate(() => { const s = document.querySelector('#app select.rig-preview'); if (s) { s.value = 'walk'; s.dispatchEvent(new Event('change', { bubbles: true })) } })
    const forced = await R.evaluate((id) => ({ state: window.__mm.reconciler.previewState(id), anim: window.__mm.world.get(id).live.anim ?? null, owns: window.__mm.world.owns(id), v: window.__mm.world.get(id).live.v ?? null }), pid)
    await sleep(200)
    const walkSwing = await swing(pid, 1000)
    await R.evaluate(() => window.__mm.interaction.select(null))
    await sleep(100)
    const cleared = await R.evaluate((id) => window.__mm.reconciler.previewState(id), pid)
    ok(sel && forced.state === 'walk' && (forced.anim == null || forced.anim === 'idle') && walkSwing > idleSwing + 10 && cleared === null,
      `the inspector's preview selector plays walk on an entity the sim leaves idle (bone swing ${idleSwing}° idle -> ${walkSwing}° walk), and deselecting clears it`, { sel, forced, cleared })

    // ---- the dead group tints a rig (a preset creature with a rig look)
    const sid = await R.evaluate(() => {
      const e = window.__mm.caps.world.spawn({ preset: 'sheep', name: 'rig sheep', at: [3, 0, 16] })
      e.replace('representation', { kind: 'rig', model: 'sheep', image: null, size: null })
      return e.id()
    })
    await waitIn(R, (id) => window.__mm.reconciler.visualFor(id)?.userData.kind === 'rig', sid)
    const colours = (id) => R.evaluate((id) => {
      const v = window.__mm.reconciler.visualFor(id); const c = []
      v.traverse((o) => { if (o.isMesh && !o.userData.notNode) c.push(o.material.color.getHexString()) })
      return { visual: v.uuid, c }
    }, id)
    const before = await colours(sid)
    await R.evaluate((id) => window.__mm.caps.world.get(id).addGroup('dead'), sid)
    const tinted = await until(async () => { const a = await colours(sid); return a.c.length && a.c.every((h) => [0, 2, 4].every((i) => parseInt(h.slice(i, i + 2), 16) <= 0x56)) ? a : null }, { timeout: 5000 })
    const after = tinted ?? await colours(sid)
    ok(tinted && after.c.length === before.c.length && before.c.some((h) => [0, 2, 4].some((i) => parseInt(h.slice(i, i + 2), 16) > 0x56)), `the dead group tints every node of a rig sheep (${before.c.slice(0, 3).join(',')} -> ${after.c.slice(0, 3).join(',')})`, { before: before.c.length, after: after.c.length, sameVisual: before.visual === after.visual })
    await R.evaluate(([a, b]) => { window.__mm.caps.world.get(a).destroy(); window.__mm.caps.world.get(b).destroy() }, [pid, sid])

    // ---- every zoo preset (design §18.2) spawns from the palette as a rig, with no placeholder
    await R.evaluate(() => { document.body.classList.add('left-open'); window.__mm.interaction.select(null) })
    const zoo = Object.keys(ZOO_PRESETS).sort()
    const tZoo = Date.now()
    const spawned = {}
    for (const name of zoo) {
      const before = await R.evaluate(() => [...window.__mm.world.entities.keys()])
      await R.click(`.palette button.preset[data-preset="${name}"]`)
      const id = await waitIn(R, ([name, before]) => [...window.__mm.world.entities.values()].find((e) => String(e.preset) === name && !before.includes(e.id))?.id ?? null, [name, before], 5000).then((h) => h.jsonValue(), () => null)
      spawned[name] = id
    }
    const ids2 = Object.values(spawned).filter(Boolean)
    await waitIn(R, (ids) => ids.every((id) => { const v = window.__mm.reconciler.visualFor(id); return v?.userData.kind === 'rig' && !v.userData.missing }), ids2, 15000).catch(() => {})
    const zooLooks = await R.evaluate((spawned) => Object.fromEntries(Object.entries(spawned).map(([name, id]) => {
      const v = id && window.__mm.reconciler.visualFor(id)
      return [name, v ? { kind: v.userData.kind, key: String(v.userData.key ?? ''), missing: !!v.userData.missing, bones: v.userData.bones?.size ?? 0, placeholder: v.userData.kind === 'placeholder' } : null]
    })), spawned)
    const placeholders = await R.evaluate(() => window.__mm.reconciler.stats().placeholders)
    const icons = await R.evaluate((zoo) => Object.fromEntries(zoo.map((n) => [n, document.querySelector(`.palette button.preset[data-preset="${n}"] .icon`)?.textContent ?? null])), zoo)
    ok(zoo.length === 12 && zoo.every((n) => zooLooks[n]?.kind === 'rig' && !zooLooks[n].missing && zooLooks[n].key.startsWith(`model:${n}:`) && zooLooks[n].bones > 3) && placeholders === 0,
      `every zoo preset (${zoo.length}) spawns from the palette as its library rig, no placeholder (${Date.now() - tZoo} ms for all)`, zooLooks)
    ok(zoo.every((n) => icons[n] && icons[n] === ZOO_PRESETS[n].icon), 'each palette card shows the preset\'s own icon', icons)
    // the search box filters the grid
    await R.fill('.palette-search', 'ra')
    const found = await R.evaluate(() => ({ names: [...document.querySelectorAll('.palette button.preset')].map((b) => b.dataset.preset), count: document.querySelector('.palette-section .count')?.textContent ?? '' }))
    await R.fill('.palette-search', 'zzz')
    const none = await R.evaluate(() => ({ n: document.querySelectorAll('.palette button.preset').length, msg: !!document.querySelector('.palette-none') }))
    await R.fill('.palette-search', '')
    const all = await R.evaluate(() => document.querySelectorAll('.palette button.preset').length)
    ok(found.names.length >= 3 && found.names.every((n) => n.includes('ra')) && ['dragon', 'rabbit', 'rat'].every((n) => found.names.includes(n)) && new RegExp(`^${found.names.length} of ${all}$`).test(found.count) && none.n === 0 && none.msg && all >= 18,
      `the palette search filters: "ra" -> ${found.names.join(', ')} (${found.count}); no match says so; clearing shows all ${all}`, { found, none, all })
    await R.evaluate((ids) => window.__mm.caps.world.batch(ids.map((id) => ({ op: 'despawn', id }))), ids2)
  } finally {
    await R.close().catch(() => {})
    await ctx.close().catch(() => {})
  }
}

// ============================================================== the gallery thumbnail's path
// scripts/thumbnails.mjs loads the bare URL and presses package.json's
// gallery.thumbnail.click selectors in order, each with Playwright's default
// actionability waits (design §18.2). Here at 1280×800 (DPR 1, not the script's
// DPR 2) against the local sync server: it must end on the rendered meadow with
// both panels closed.
async function thumbPhase () {
  phase('thumb')
  const hint = JSON.parse(fs.readFileSync(path.join(PKG, 'package.json'), 'utf8')).gallery?.thumbnail ?? {}
  const clicks = [hint.click ?? []].flat()
  const SHOT = { width: 1280, height: 800 }
  const ctx = await browser.newContext({ viewport: SHOT })
  try {
    const P = await newTab(ctx, 'thumb', { viewport: SHOT })
    const t0 = Date.now()
    await P.goto(`${S.BASE}#sync=${encodeURIComponent(S.SYNC)}`)
    await P.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
    const steps = []
    for (const sel of clicks) { const t = Date.now(); await P.click(sel, { timeout: 60000 }); steps.push(`${sel} ${Date.now() - t} ms`) }
    const tClicked = Date.now() - t0
    await P.waitForTimeout(hint.settle ?? 1200)
    await P.screenshot({ path: path.join(OUT, 'thumb.png') })
    const total = Date.now() - t0
    const st = await P.evaluate(() => {
      const mm = window.__mm; const W = innerWidth
      const panel = (sel) => { const r = document.querySelector(sel)?.getBoundingClientRect(); return r ? Math.max(0, Math.min(r.right, W) - Math.max(r.left, 0)) : 0 }
      const c = document.getElementById('scene'); const g = c.getContext('webgl2') || c.getContext('webgl')
      mm.stage.render()
      const buf = new Uint8Array(4); const seen = new Set()
      for (let i = 1; i < 12; i++) for (let j = 1; j < 8; j++) { g.readPixels(Math.floor(c.width * i / 12), Math.floor(c.height * j / 8), 1, 1, g.RGBA, g.UNSIGNED_BYTE, buf); seen.add(buf.join(',')) }
      return {
        ready: !!mm.ready, title: String(mm.handle?.doc().meta?.title ?? ''), entities: Object.keys(mm.handle?.doc().entities ?? {}).length,
        rendered: mm.reconciler?.stats(), launcher: !!document.querySelector('#launcher:not([hidden])'),
        open: ['left-open', 'right-open'].filter((k) => document.body.classList.contains(k)),
        visiblePx: { left: panel('.panel.left'), right: panel('.panel.right') }, colours: seen.size,
      }
    })
    console.log(`#   thumbnail path: ${steps.join(', ')}; clicks done ${tClicked} ms after goto, shot at ${total} ms`)
    ok(clicks.length === 4 && clicks[0] === '#launch-new' && clicks[1] === '#launch-template-meadow', `package.json's thumbnail hint goes through the launcher (${clicks.join(' -> ')}, settle ${hint.settle})`)
    ok(st.ready && !st.launcher && st.title === 'Animal meadow' && st.entities === templateEntities('meadow').length && st.rendered?.placeholders === 0 && st.colours >= 4,
      `the thumbnail clicks end on the rendered Animal meadow (${st.entities} entities, ${st.colours} colours) in ${total} ms`, st)
    ok(st.open.length === 0 && st.visiblePx.left === 0 && st.visiblePx.right === 0, 'and both panels are closed (none of either is on screen)', { open: st.open, visiblePx: st.visiblePx })
    await P.close()
  } finally {
    await ctx.close().catch(() => {})
  }
}

// ============================================================== safe mode after an infinite loop
// A persistent profile (real localStorage) on a NEW world, so nothing else ever loads the hanging system.
async function safePhase () {
  phase('safe')
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mm-safe-'))
  let ctx = await chromium.launchPersistentContext(dir, { executablePath: S.exe, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'], viewport: SMALL })
  if (SAFE_PEER !== 'random') await ctx.addInitScript((id) => { try { sessionStorage.setItem('mm:peer', id) } catch {} }, SAFE_PEER)
  // every evaluate here is bounded: a hung tab never answers
  const evalT = (page, fn, arg, ms = 4000) => Promise.race([page.evaluate(fn, arg), sleep(ms).then(() => { throw new Error('page did not answer') })])
  try {
    const P = await openPage(ctx, `${S.BASE}#new=meadow&sync=${encodeURIComponent(S.SYNC)}`, 'safe-1')
    const link = await P.evaluate(() => location.href)
    await P.evaluate(() => window.__mm.caps.world.defineSystem('spin', { source: 'export default { update () {} }' }))
    await sleep(500)
    // the hang arrives as a remote edit (an agent, through the sync server): its first update never returns
    const agent = await connect(link, { local: true })
    await E(agent.world).defineSystem('hang', { source: 'export default { update () { for (;;) {} } }' })
    await agent.synced(5000)
    await agent.close()
    const hung = await until(async () => !(await evalT(P, () => 1, undefined, 1500).then(() => true, () => false)), { timeout: 8000, every: 200 })
    ok(hung, 'the infinite-loop system hung the tab')
    // the browser goes away with the hung tab in it (the real-world case: the user
    // kills it); the same profile is launched again
    const tc = Date.now()
    openPages.delete(P)
    await Promise.race([ctx.close().catch(() => {}), sleep(15000)])
    ctx = await chromium.launchPersistentContext(dir, { executablePath: S.exe, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'], viewport: SMALL })
    if (SAFE_PEER !== 'random') await ctx.addInitScript((id) => { try { sessionStorage.setItem('mm:peer', id) } catch {} }, SAFE_PEER)
    const probe = await ctx.newPage(); await probe.goto(`${new URL(S.BASE).origin}/probe`)
    const marker = await probe.evaluate(() => { try { return Object.fromEntries(Object.keys(localStorage).filter((k) => k.startsWith('mm:')).map((k) => [k, localStorage.getItem(k)])) } catch (e) { return String(e) } })
    await probe.close()
    ok(Object.keys(marker).some((k) => /running/.test(k)), `the crash marker survived the hung tab and a browser restart (${Date.now() - tc} ms)`, Object.keys(marker))
    // the next load of the same world, same profile: safe at boot, or as soon as the hung systems sync in
    const Q = await ctx.newPage({ viewport: SMALL }); openPages.add(Q); Q.on('close', () => openPages.delete(Q)); watchPage(Q, 'safe-2')
    await Q.goto(link)
    // a slow answer on a loaded box is "not yet"; only never answering counts as hung
    let answered = false
    const st = await until(() => evalT(Q, () => {
      const mm = window.__mm; if (!mm?.ready) return null
      const b = document.querySelector('#banners [data-id="safe"]')
      return b && mm.handle.doc().systems?.hang ? { enabled: mm.systemHost.enabled, banner: b.textContent, tick: mm.world.tickCount } : null
    }).then((v) => { answered = true; return v }, () => null), { timeout: 20000, every: 200 }) ?? (answered ? null : { hung: true })
    await sleep(500)
    const tick2 = await evalT(Q, () => window.__mm.world.tickCount).catch(() => null)
    ok(st && !st.hung && !st.enabled && /safe mode/i.test(st.banner ?? '') && tick2 > st.tick, 'the next load of that world is in safe mode: systems off, banner shown, the page still ticks', st)
    await Q.close() // in safe mode Q never armed: the marker still names the crashed systems
    ok(!openPages.has(Q), 'the safe-mode tab closed')

    // The hung systems ARRIVE AFTER BOOT (a boot from a stale local copy): an agent
    // removes 'hang', Q2 boots normally and re-arms the marker with its own systems,
    // then the identical 'hang' comes back by sync. Q2 must go safe, not hang.
    const HANG = 'export default { update () { for (;;) {} } }'
    const ag = await connect(link, { local: true })
    await E(ag.world).removeSystem('hang'); const syncedRm = await ag.synced(5000).catch((e) => e.message)
    const Q2 = await openPage(ctx, link, 'safe-3')
    const tRm = Date.now()
    const rmArrived = await until(() => evalT(Q2, () => !window.__mm.handle.doc().systems?.hang).catch(() => false), { timeout: 15000 })
    const on = await evalT(Q2, () => ({ enabled: window.__mm.systemHost.enabled, banner: document.querySelector('#banners [data-id="safe"]')?.textContent ?? null, systems: Object.keys(window.__mm.handle.doc().systems ?? {}), heads: [...window.__mm.handle.heads()] }))
    on.agentHeads = [...ag.handle.heads()]; on.syncedRm = syncedRm; on.agentHasHang = !!ag.handle.doc().systems?.hang; on.removalArrivedMs = rmArrived ? Date.now() - tRm : null
    ok(on.enabled && !on.banner, `without the crashed systems the world runs its systems normally (the agent's removal reached the reloaded tab in ${on.removalArrivedMs} ms)`, on.enabled && !on.banner ? undefined : on)
    await E(ag.world).defineSystem('hang', { source: HANG }); await ag.synced(5000)
    let answered2 = false
    const st2 = await until(() => evalT(Q2, () => {
      const mm = window.__mm; const b = document.querySelector('#banners [data-id="safe"]')
      return mm.handle.doc().systems?.hang && b ? { enabled: mm.systemHost.enabled, banner: b.textContent, tick: mm.world.tickCount } : null
    }).then((v) => { answered2 = true; return v }, () => null), { timeout: 10000, every: 200 }) ?? (answered2 ? null : { hung: true })
    await sleep(400)
    const tick3 = await evalT(Q2, () => window.__mm.world.tickCount).catch(() => null)
    ok(st2 && !st2.hung && !st2.enabled && tick3 > st2.tick, 'when the systems that hung arrive after boot, the tab goes safe instead of running them', st2)
    // editing the system that hung (its hash changes) runs systems again, no reload
    await evalT(Q2, () => window.__mm.caps.world.defineSystem('hang', { source: 'export default { update () {} }' }))
    const back = await until(() => evalT(Q2, () => window.__mm.systemHost.enabled && !document.querySelector('#banners [data-id="safe"]')).catch(() => false), { timeout: 4000 })
    const alive = await evalT(Q2, () => window.__mm.world.tickCount, undefined, 2000).then(() => true, () => false)
    ok(back && alive, 'fixing the system re-enables doc systems without a reload')
    await ag.close()
    await Q2.close()
  } finally {
    await ctx.close().catch(() => {})
    fs.rmSync(dir, { recursive: true, force: true })
  }
}

let exitCode = 0
try {
  await main()
} catch (e) {
  ok(false, 'the run threw', String(e?.stack ?? e).split('\n').slice(0, 6).join(' | '))
} finally {
  const errs = consoleErrors.filter((e) => !/GPU stall|favicon/i.test(e))
  ok(errs.length === 0, `no console messages of type 'error' on any page (${errs.length})`, errs.slice(0, 8))
  const total = ((Date.now() - T_START) / 1000).toFixed(1)
  console.log(`\n# ${results.length - failed}/${results.length} passed in ${total} s`)
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify({ total, results, consoleErrors, poseError: S.poseError, rates: S.rates, rigPerf: S.rigPerf }, null, 1))
  exitCode = failed ? 1 : 0
  if (!KEEP) { await browser?.close().catch(() => {}); await browserB?.close().catch(() => {}); distSrv?.close(); syncSrv?.close() }
  process.exit(exitCode)
}
