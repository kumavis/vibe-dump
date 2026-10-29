import test from 'node:test'
import assert from 'node:assert/strict'
import { makeShare, mcpSetupLine, cliLine, fileNameFor, editLink, viewLink, versionLinkFor } from '../../src/editor/share.js'
import { parseLink } from '../../src/net/link.js'
import { load, getHeads, view } from '@automerge/automerge'
import { seeded, repo } from './d-helpers.mjs'

const base = 'https://kumavis.github.io/vibe-dump/merge-meadow/'

test('share: the MCP line carries the link quoted for a POSIX shell', () => {
  const link = `${base}#doc=automerge:2Wzz&key=a'b`
  assert.equal(mcpSetupLine({ link, path: '/home/me/vibe-dump/packages/merge-meadow/' }),
    `claude mcp add merge-meadow -e MERGE_MEADOW_LINK='${base}#doc=automerge:2Wzz&key=a'\\''b' -- node /home/me/vibe-dump/packages/merge-meadow/agent/mcp.mjs`)
  assert.equal(mcpSetupLine({ path: '/x' }), 'claude mcp add merge-meadow -- node /x/agent/mcp.mjs')
  assert.match(cliLine({ link: 'L', path: '/x' }), /^node \/x\/agent\/cli\.mjs 'L' describe$/)
})

test('share: links keep doc, key / view, sync and heads in the fragment', () => {
  const L = { key: 'K1', sync: 'ws://localhost:3030' }
  const doc = 'automerge:2Wzz8K5sCmM2zXGW8Kr5Hx7tFJxH'
  const e = parseLink(editLink(L, doc, base))
  assert.equal(e.docUrl, doc); assert.equal(e.key, 'K1'); assert.equal(e.sync, 'ws://localhost:3030')
  const v = parseLink(viewLink(L, doc, 'V1', base))
  assert.equal(v.key, ''); assert.equal(v.view, 'V1')
  assert.deepEqual(parseLink(versionLinkFor(L, doc, ['h1', 'h2'], base)).heads, ['h1', 'h2'])
  assert.equal(parseLink(versionLinkFor(L, doc, ['h1'], base)).key, '', 'a version link is a read-only view: no editor key')
  assert.ok(!editLink({ key: 'K', sync: 'wss://sync.automerge.org' }, doc, base).includes('sync='), 'the default server is implicit')
})

test('share: fileNameFor is a stable slug + timestamp', () => {
  assert.equal(fileNameFor('My Meadow!', new Date('2026-10-29T12:34:56Z')), 'my-meadow-2026-10-29-12-34.automerge')
  assert.equal(fileNameFor('', new Date('2026-01-02T03:04:00Z')), 'world-2026-01-02-03-04.automerge')
})

test('share: copy, download, fork, open and version links against a real repo', async () => {
  const h = seeded()
  const copied = []; const saved = []
  const s = makeShare({ handle: h, link: { key: 'K' }, repo, base, clipboard: { writeText: async (t) => { copied.push(t) } }, saveFile: (name, bytes) => saved.push({ name, bytes }), title: () => 'Test Meadow' })
  const c = await s.copyLink()
  assert.equal(c.copied, true); assert.equal(copied[0], c.text); assert.equal(parseLink(c.text).docUrl, h.url)
  const d = s.download()
  assert.match(d.name, /^test-meadow-.*\.automerge$/)
  assert.equal(Object.keys(load(saved[0].bytes).entities).length, 14, 'the download is the whole doc')
  const f = await s.fork()
  assert.notEqual(f.url, h.url)
  const fl = parseLink(f.link)
  assert.equal(fl.docUrl, f.url); assert.ok(fl.key && fl.key !== 'K', 'a fork gets a fresh agent key')
  const o = await s.open({ arrayBuffer: async () => saved[0].bytes.buffer.slice(saved[0].bytes.byteOffset, saved[0].bytes.byteOffset + saved[0].bytes.byteLength) })
  const opened = await repo.find(o.url)
  assert.equal(Object.keys(opened.doc().entities).length, 14)
  assert.deepEqual(parseLink(s.versionLink()).heads, getHeads(h.doc()))
  assert.equal(parseLink(s.versionLink()).key, '', 'a version link never carries the editor key')
  assert.equal(Object.keys(view(h.doc(), parseLink(s.versionLink()).heads).entities).length, 14, 'the version link heads open with view()')
  assert.equal(s.viewLink(''), null)
  const failing = makeShare({ handle: h, link: {}, repo, base, clipboard: { writeText: async () => { throw new Error('denied') } } })
  assert.equal((await failing.copyLink()).copied, false)
})
