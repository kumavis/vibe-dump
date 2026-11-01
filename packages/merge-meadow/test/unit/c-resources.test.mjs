import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
  texKey, spriteMatKey, geoKey, stdMatKey, gltfKey, normColor, tintColor, resolveUrl, codepoints, TWEMOJI,
  makeResources, hasColorEmoji, EMOJI_FONT, SHAPES,
} from '../../src/render/resources.js'
import { modelKey, lookKey } from '../../src/render/kinds/rig.js'

test('resource keys follow the design §8 format', () => {
  assert.equal(texKey('emoji:🦖'), 'tex:emoji:🦖')
  assert.equal(spriteMatKey('emoji:🦖', '#FFF'), 'spritemat:emoji:🦖:#ffffff')
  assert.equal(spriteMatKey('emoji:🐑', undefined), 'spritemat:emoji:🐑:#ffffff')
  assert.equal(geoKey('sphere'), 'geo:sphere')
  assert.equal(geoKey('dodecahedron'), 'geo:box', 'unknown shapes fall back to the unit box')
  for (const s of SHAPES) assert.equal(geoKey(s), 'geo:' + s)
  assert.equal(stdMatKey({}), 'mat:std:#cccccc:0.8:0:0:0')
  assert.equal(stdMatKey({ color: '#ABC', roughness: 0.2, metalness: 1, flat: true, vc: true }), 'mat:std:#aabbcc:0.2:1:1:1')
  assert.equal(stdMatKey({ color: 'red', roughness: 'x' }), 'mat:std:#cccccc:0.8:0:0:0', 'garbage normalises, never NaN')
  assert.equal(gltfKey('https://x/a.glb'), 'gltf:https://x/a.glb')
})

test('rig keys: a model keys on its extends chain revs (own first), an inline look on its content', () => {
  const doc = { models: { quadruped: { extends: '', rev: 3 }, horse: { extends: 'quadruped', rev: 5 } } }
  assert.equal(modelKey(doc, 'horse'), 'model:horse:5.3')
  assert.equal(modelKey(doc, 'quadruped'), 'model:quadruped:3')
  assert.equal(modelKey(doc, 'nope'), 'missing:nope')
  assert.equal(modelKey({ models: { a: { extends: 'b', rev: 1 } } }, 'a'), 'broken:a', 'a missing base')
  assert.equal(modelKey({ models: { a: { extends: 'b' }, b: { extends: 'a' } } }, 'a'), 'broken:a', 'a cycle')
  // memoised per doc snapshot: a new snapshot (a new object) re-reads
  const next = { models: { ...doc.models, horse: { extends: 'quadruped', rev: 6 } } }
  assert.equal(modelKey(next, 'horse'), 'model:horse:6.3')
  // inline: content-addressed, independent of key order and of colour/scale/tint
  const a = lookKey(null, { kind: 'tree', nodes: [{ shape: 'box', p: [0, 1, 0] }], color: '#ff0000' }, true)
  assert.match(a, /^inline:[0-9a-f]{8}$/)
  assert.equal(a, lookKey(null, { kind: 'rig', nodes: [{ p: [0, 1, 0], shape: 'box' }], scale: 2, tint: '#555555' }))
  assert.notEqual(a, lookKey(null, { kind: 'tree', nodes: [{ shape: 'box', p: [0, 2, 0] }] }, true))
  assert.equal(lookKey(null, { kind: 'tree', model: 'horse', nodes: [{ shape: 'box', p: [0, 1, 0] }] }, true), a, 'the tree alias ignores model')
})

test('colours normalise and tint multiplies', () => {
  assert.equal(normColor('#AbC'), '#aabbcc')
  assert.equal(normColor('#11223344'), '#112233')
  assert.equal(normColor('nope', '#010203'), '#010203')
  assert.equal(tintColor('#ff8040', '#ffffff'), '#ff8040')
  assert.equal(tintColor('#ffffff', '#555555'), '#555555')
  assert.equal(tintColor('#ff0000', '#808080'), '#800000')
  assert.equal(tintColor('#ff0000', undefined), '#ff0000')
})

test('resolveUrl allows asset:/https/same-origin and refuses blob:, data:, javascript:', () => {
  const assets = { rex: { kind: 'model', url: 'https://cdn.example/rex.glb' }, loop: { url: 'asset:rex' }, bad: { url: 'blob:https://x/1' } }
  assert.equal(resolveUrl('asset:rex', assets), 'https://cdn.example/rex.glb')
  assert.equal(resolveUrl('asset:missing', assets), null)
  assert.equal(resolveUrl('asset:loop', assets), null, 'no indirection chains')
  assert.equal(resolveUrl('asset:bad', assets), null)
  assert.equal(resolveUrl('https://a.b/c.glb'), 'https://a.b/c.glb')
  assert.equal(resolveUrl('http://evil.example/c.glb'), null)
  assert.equal(resolveUrl('http://127.0.0.1:5173/c.glb'), 'http://127.0.0.1:5173/c.glb')
  assert.equal(resolveUrl('./models/c.glb'), './models/c.glb')
  assert.equal(resolveUrl('/c.glb'), '/c.glb')
  assert.equal(resolveUrl('//evil.example/c.glb'), null, 'protocol-relative is another origin')
  for (const u of ['blob:https://x/1', 'data:model/gltf-binary;base64,AAAA', 'javascript:alert(1)', '', null]) assert.equal(resolveUrl(u), null, String(u))
})

test('the eight seed glyphs are bundled as Twemoji SVGs', () => {
  assert.deepEqual(Object.keys(TWEMOJI).sort(), ['🦖', '🐑', '🐎', '🌳', '🪨', '💡', '🐺', '🧑'].sort())
  assert.equal(codepoints('🦖'), '1f996')
  assert.equal(codepoints('🪨'), '1faa8')
  assert.equal(codepoints('❤️'), '2764', 'variation selector dropped')
  for (const [g, url] of Object.entries(TWEMOJI)) {
    assert.ok(url.endsWith(codepoints(g) + '.svg'), g)
    assert.ok(existsSync(fileURLToPath(url)), url)
  }
  assert.ok(existsSync(fileURLToPath(new URL('../../src/render/emoji/LICENSE.md', import.meta.url))))
  assert.match(EMOJI_FONT, /Apple Color Emoji.*Segoe UI Emoji.*Noto Color Emoji.*Twemoji Mozilla/)
  assert.equal(hasColorEmoji(null), true, 'no DOM: nothing to fall back from')
})

test('acquire/release ref-counts and disposes exactly once', () => {
  const res = makeResources({ document: null })
  let made = 0; let disposed = 0
  const make = () => { made++; return { dispose () { disposed++ } } }
  const a = res.acquire('geo:box', make); const b = res.acquire('geo:box', make)
  assert.equal(a, b); assert.equal(made, 1); assert.equal(res.refs('geo:box'), 2)
  res.release('geo:box'); assert.equal(disposed, 0)
  res.release('geo:box'); assert.equal(disposed, 1); assert.equal(res.has('geo:box'), false)
  assert.throws(() => res.release('geo:box'), /unknown resource/)
})

test('use/swap/releaseAll keep obj.userData.res exact', () => {
  const res = makeResources({ document: null })
  const obj = { userData: {} }
  const mk = () => ({ dispose () {} })
  res.use(obj, 'mat:a', mk); res.use(obj, 'geo:box', mk)
  res.swap(obj, 'mat:a', 'mat:b', mk)
  assert.deepEqual(obj.userData.res, ['mat:b', 'geo:box'])
  assert.equal(res.has('mat:a'), false)
  assert.equal(res.swap(obj, 'mat:b', 'mat:b', mk), res.swap(obj, 'mat:b', 'mat:b', mk), 'same key: no churn')
  assert.equal(res.refs('mat:b'), 1)
  res.releaseAll(obj)
  assert.deepEqual(res.stats(), { keys: 0, refs: 0, byPrefix: {} })
})

test('async values dispose after they land, even when released first', async () => {
  const res = makeResources({ document: null })
  const disposed = []
  let resolve; const p = new Promise((r) => { resolve = r })
  res.acquire('gltf:x', () => p, (v) => disposed.push(v))
  res.release('gltf:x')
  assert.deepEqual(disposed, [])
  resolve('model'); await p; await Promise.resolve()
  assert.deepEqual(disposed, ['model'])
  // landed, then released: disposed synchronously
  const q = Promise.resolve('m2'); res.acquire('gltf:y', () => q, (v) => disposed.push(v)); await q; await Promise.resolve()
  res.release('gltf:y'); assert.deepEqual(disposed, ['model', 'm2'])
})
