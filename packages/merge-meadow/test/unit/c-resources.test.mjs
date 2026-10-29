import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
  texKey, spriteMatKey, geoKey, stdMatKey, gltfKey, normColor, tintColor, resolveUrl, codepoints, TWEMOJI,
  makeResources, hasColorEmoji, EMOJI_FONT, SHAPES,
} from '../../src/render/resources.js'
import { critterKey, rigParams } from '../../src/render/kinds/critter.js'

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

test('critter keys quantise proportions so near-identical critters share a template', () => {
  assert.equal(critterKey(rigParams({ rig: 'biped', length: 4, height: 2.6, head: 1.3, tail: 1.3 })), 'critter:biped:4:2.6:1.3:1.3')
  assert.equal(critterKey(rigParams({ length: 1.21 })), critterKey(rigParams({ length: 1.19 })))
  assert.notEqual(critterKey(rigParams({ length: 1.2 })), critterKey(rigParams({ length: 1.3 })))
  assert.equal(rigParams({ rig: 'octopus' }).rig, 'quadruped')
  assert.equal(rigParams({ length: 999 }).L, 12)
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
