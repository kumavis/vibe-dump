// Track L: the launcher's pure helpers (design §18.1). The DOM flow is checked
// in a headless browser (the track's scratch harness and test/e2e.mjs).
import test from 'node:test'
import assert from 'node:assert/strict'
import { newTemplateOf, relativeTime, entryLink, entryMeta, titleOf, parseWorldInput, templateCards } from '../../src/editor/launcher.js'
import { TEMPLATES, TEMPLATE_ORDER } from '../../src/doc/templates.js'
import { DEFAULT_SYNC, parseLink } from '../../src/net/link.js'

const DOC = 'automerge:4NMNnkMhL8jXrdJ9jamS58PAVdXu'
const base = new URL('https://example.org/vibe-dump/merge-meadow/')

test('launcher: #new=<template> parsing', () => {
  assert.equal(newTemplateOf('#new=meadow'), 'meadow')
  assert.equal(newTemplateOf('#new=blank&sync=ws%3A%2F%2Fx'), 'blank')
  assert.equal(newTemplateOf('https://a/b#safe&new=meadow'), 'meadow')
  assert.equal(newTemplateOf(''), ''); assert.equal(newTemplateOf('#doc=x'), '')
})

test('launcher: relative times are short and never throw', () => {
  const now = 10_000_000_000
  assert.equal(relativeTime(now - 5_000, now), 'just now')
  assert.equal(relativeTime(now - 5 * 60_000, now), '5 min ago')
  assert.equal(relativeTime(now - 3 * 3600_000, now), '3 h ago')
  assert.equal(relativeTime(now - 26 * 3600_000, now), 'yesterday')
  assert.equal(relativeTime(now - 5 * 86400_000, now), '5 days ago')
  assert.match(relativeTime(now - 90 * 86400_000, now), /^on \d{4}-\d\d-\d\d$/)
  assert.equal(relativeTime(0, now), 'some time ago'); assert.equal(relativeTime('x', now), 'some time ago')
  assert.equal(relativeTime(now + 60_000, now), 'just now', 'a clock skew reads as now')
})

test('launcher: an entry links back to its world with its key (or view key) and sync', () => {
  const e = { docUrl: DOC, key: 'K', view: 'V', sync: 'ws://127.0.0.1:9', title: 'Mine', at: 1 }
  const l = parseLink(entryLink(e, base))
  assert.equal(l.docUrl, DOC); assert.equal(l.key, 'K'); assert.equal(l.view, ''); assert.equal(l.sync, 'ws://127.0.0.1:9')
  assert.ok(entryLink(e, base).startsWith('https://example.org/vibe-dump/merge-meadow/#doc='))
  const v = parseLink(entryLink({ ...e, key: '', sync: DEFAULT_SYNC }, base))
  assert.equal(v.view, 'V'); assert.equal(v.key, '')
  assert.ok(!entryLink({ ...e, sync: DEFAULT_SYNC }, base).includes('sync='))
  assert.match(entryMeta({ ...e, at: Date.now() }), /^just now · via 127\.0\.0\.1:9$/)
  assert.match(entryMeta({ ...e, key: '', sync: DEFAULT_SYNC, at: Date.now() }), /view link/)
  assert.equal(titleOf({ title: '  ' }), 'Untitled world'); assert.equal(titleOf({ title: '<b>x</b>' }), '<b>x</b>')
})

test('launcher: a pasted link opens in place, creates, navigates elsewhere, or says why not', () => {
  const opts = { base, templates: Object.keys(TEMPLATES) }
  const here = `${base.href}#doc=${DOC}&key=abc`
  let r = parseWorldInput(here, opts)
  assert.equal(r.kind, 'open'); assert.equal(r.link.docUrl, DOC); assert.equal(r.link.key, 'abc')
  r = parseWorldInput(`  #doc=${DOC}&view=vv  `, opts)
  assert.equal(r.kind, 'open'); assert.equal(r.link.view, 'vv')
  r = parseWorldInput(DOC, opts); assert.equal(r.kind, 'open'); assert.equal(r.link.docUrl, DOC); assert.equal(r.link.key, '')
  r = parseWorldInput(DOC.slice(10), opts); assert.equal(r.kind, 'open')
  r = parseWorldInput(`${base.href}#new=blank`, opts); assert.deepEqual(r, { kind: 'create', template: 'blank', sync: DEFAULT_SYNC, safe: false })
  // a #new= link keeps the sync server and safe flag it names (design §18.1)
  r = parseWorldInput('#new=blank&sync=none', opts); assert.deepEqual(r, { kind: 'create', template: 'blank', sync: 'none', safe: false })
  r = parseWorldInput(`${base.href}#new=meadow&sync=${encodeURIComponent('wss://my.host')}&safe`, opts); assert.deepEqual(r, { kind: 'create', template: 'meadow', sync: 'wss://my.host', safe: true })
  r = parseWorldInput('#new=volcano', opts); assert.equal(r.kind, 'invalid'); assert.match(r.reason, /volcano/)
  r = parseWorldInput(`https://other.example/mm/#doc=${DOC}&key=x`, opts); assert.deepEqual(r, { kind: 'navigate', href: `https://other.example/mm/#doc=${DOC}&key=x` })
  for (const bad of ['', '   ', 'hello world', 'javascript:alert(1)#doc=x', `ftp://x/#doc=${DOC}`, 'https://example.org/vibe-dump/merge-meadow/#key=1', 'x'.repeat(5000)]) {
    assert.equal(parseWorldInput(bad, opts).kind, 'invalid', bad.slice(0, 40))
  }
})

test('launcher: template cards follow the given order, then any other template by name', () => {
  const cards = templateCards(TEMPLATES, [...TEMPLATE_ORDER])
  assert.deepEqual(cards.map((c) => c.name), [...TEMPLATE_ORDER])
  assert.deepEqual(cards[0], { name: 'meadow', title: 'Animal meadow', description: TEMPLATES.meadow.description, icon: '🦖' })
  assert.deepEqual(templateCards({ z: { title: 'Z' }, a: {}, m: {} }, ['m', 'missing']).map((c) => c.name), ['m', 'a', 'z'])
  assert.equal(templateCards({ a: {} })[0].icon, '🌱')
})
