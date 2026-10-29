import test from 'node:test'
import assert from 'node:assert/strict'
import { parseLink, buildLink, newKey, peerIdFor, DEFAULT_SYNC, normalizeDocUrl, docIdOf } from '../../src/net/link.js'
import { DEFAULT_SYNC as REPO_DEFAULT } from '../../src/net/repo.js'

const DOC = 'automerge:2j9knpCseyhnK8izDmLpGP5WMdZQ'

test('parseLink reads every parameter from a full url', () => {
  const L = parseLink(`https://kumavis.github.io/vibe-dump/merge-meadow/#doc=${DOC}&key=abc_-1&sync=${encodeURIComponent('ws://127.0.0.1:3030')}&heads=aa,bb&safe`)
  assert.deepEqual(L, { docUrl: DOC, key: 'abc_-1', view: '', sync: 'ws://127.0.0.1:3030', heads: ['aa', 'bb'], safe: true })
})

test('parseLink defaults and garbage', () => {
  assert.deepEqual(parseLink(''), { docUrl: '', key: '', view: '', sync: DEFAULT_SYNC, heads: null, safe: false })
  assert.equal(parseLink('#doc=not a url!').docUrl, '')
  assert.equal(parseLink('#doc=2j9knpCseyhnK8izDmLpGP5WMdZQ').docUrl, DOC, 'a bare id is accepted')
  assert.equal(parseLink('#safe=0').safe, false)
  assert.equal(REPO_DEFAULT, DEFAULT_SYNC)
})

test('buildLink round-trips and keeps the role in the parameter name', () => {
  const base = 'https://x.test/merge-meadow/?q=1#old'
  const edit = buildLink({ docUrl: DOC, key: 'k1', sync: 'ws://h:1' }, base)
  assert.equal(edit, `https://x.test/merge-meadow/?q=1#doc=${DOC}&key=k1&sync=ws%3A%2F%2Fh%3A1`)
  assert.deepEqual(parseLink(edit), { docUrl: DOC, key: 'k1', view: '', sync: 'ws://h:1', heads: null, safe: false })
  const view = buildLink({ docUrl: DOC, view: 'v1', heads: ['h1', 'h2'] }, { origin: 'https://o.test', pathname: '/p/', search: '' })
  assert.equal(view, `https://o.test/p/#doc=${DOC}&view=v1&heads=h1,h2`)
  assert.equal(buildLink({ docUrl: DOC, key: 'k', view: 'v' }, '').includes('view='), false, 'an editor link never also carries view')
  assert.equal(buildLink({ docUrl: DOC, sync: DEFAULT_SYNC }, ''), `#doc=${DOC}`)
  assert.throws(() => buildLink({ docUrl: 'not-a-doc!' }, ''), TypeError)
})

test('newKey and peerIdFor', () => {
  const k = newKey()
  assert.match(k, /^[A-Za-z0-9_-]{22}$/)
  assert.notEqual(k, newKey())
  const store = new Map()
  const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) }
  const a = peerIdFor(storage)
  assert.match(a, /^p_[A-Za-z0-9_-]+$/)
  assert.equal(peerIdFor(storage), a, 'stable per tab')
  assert.notEqual(peerIdFor({ getItem () { throw new Error('blocked') }, setItem () { throw new Error('blocked') } }), a)
  assert.equal(normalizeDocUrl(' automerge:abc '), 'automerge:abc')
  assert.equal(docIdOf(DOC), DOC.slice(10))
})
