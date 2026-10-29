// billboard: { image: 'emoji:🦖' | url, size, color } — the zero-asset look: an emoji
// drawn to a canvas texture on a camera-facing sprite (faces each XR eye too).
import * as THREE from 'three'
import { spriteMatKey, texKey, tintColor, normColor } from '../resources.js'
import { kindProp, defaultsOf, anchorPoint, clamp } from './common.js'

const schema = {
  type: 'object',
  properties: {
    kind: kindProp('billboard'),
    image: { type: 'string', title: 'image (emoji:… or url)', default: 'emoji:🐑', 'x-immutable': true },
    size: { type: 'number', title: 'size (m)', minimum: 0.1, maximum: 20, step: 0.1, default: 1.2 },
    color: { type: 'string', format: 'color', title: 'colour', default: '#ffffff' },
  },
}

const image = (d) => String(d.image ?? 'emoji:❓') || 'emoji:❓'
const colour = (d) => tintColor(normColor(d.color, '#ffffff'), d.tint)
const size = (d) => clamp(d.size, 1.2, 0.05, 50)

// the material holds a ref on its texture, so both go when the last sprite does
function material (res, d, assets) {
  const img = image(d); const tk = texKey(img)
  return () => {
    const m = new THREE.SpriteMaterial({ map: res.acquire(tk, () => res.imageTexture(img, assets)), color: colour(d), transparent: true, alphaTest: 0.05 })
    m.userData.texKey = tk
    return m
  }
}
const disposeMat = (res) => (m) => { m.dispose(); res.release(m.userData.texKey) }

function place (s, d) {
  const k = size(d)
  s.scale.set(k, k, 1)
  // anchors live in sprite space (scaled by size): a seat on the back, a head on top
  s.userData.seat.position.set(0, 0.62, 0)
  s.userData.head.position.set(0, 0.95, 0)
}

export default {
  schema,
  defaults: defaultsOf(schema),
  create (d, { res, assets }) {
    const s = new THREE.Sprite()
    s.material = res.use(s, spriteMatKey(image(d), colour(d)), material(res, d, assets?.()), disposeMat(res))
    s.center.set(0.5, 0)
    s.userData.seat = anchorPoint(s, 'seat'); s.userData.head = anchorPoint(s, 'head')
    s.userData.pick = 'box'
    place(s, d)
    return s
  },
  update (s, d, prev, { res, assets }) {
    s.material = res.swap(s, spriteMatKey(image(prev), colour(prev)), spriteMatKey(image(d), colour(d)), material(res, d, assets?.()), disposeMat(res))
    place(s, d)
  },
  // Sprite geometry is three's module-level singleton: never dispose it
  dispose () {},
  anchors: (s) => ({ seat: s.userData.seat, head: s.userData.head }),
}
