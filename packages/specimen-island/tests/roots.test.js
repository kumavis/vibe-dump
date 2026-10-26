import test from 'node:test'
import assert from 'node:assert/strict'
import { ROOT_SLOPE, FOOT, BUTTRESS, flare, buttress } from '../src/world/roots.js'
import { TYPES, TUCK } from '../src/world/vegetation.js'
import { Rng } from '../src/core/rng.js'

// every corner of the buttress ranges
const B = BUTTRESS
const fins = []
for (const reach of B.reach)
  for (const rise of B.rise)
    for (const bow of B.bow)
      for (const swing of [-B.swing, B.swing]) for (const thick of B.thick) fins.push({ reach, rise, bow, swing, thick })

test('a buttress leaves the trunk tall, sweeps down and out, and runs to a point under the ground', () => {
  for (const f of fins) {
    for (const segs of [2, 4]) {
      const st = buttress(f, segs)
      assert.equal(st.length, segs + 2)
      assert.equal(st[0].r, B.inner)
      assert.equal(st[0].top, f.rise)
      for (let i = 1; i < st.length; i++) {
        assert.ok(st[i].r > st[i - 1].r, 'runs outward')
        assert.ok(st[i].top < st[i - 1].top, 'its top edge falls all the way')
        assert.ok(st[i].w <= st[i - 1].w, 'and thins')
      }
      // on level ground it meets the ground within its reach, and ends in a buried point
      assert.ok(st[segs].top < 0, `top ${st[segs].top} at the end of its curve`)
      const tip = st[st.length - 1]
      assert.equal(tip.w, 0)
      assert.equal(tip.top, tip.keel)
      for (const s of st.slice(0, -1)) assert.ok(s.top > s.keel)
      // the curve is hollow: halfway out it has fallen more than halfway
      const mid = buttress(f, 2)[1]
      assert.ok(mid.top < f.rise / 2, `hollow curve: ${mid.top} of ${f.rise}`)
      // it leaves the trunk inside the bark (a 7-sided trunk's flat sides)
      const inner = Math.hypot(st[0].r, st[0].lat + st[0].w)
      assert.ok(inner < FOOT.canopy.r * flare(FOOT.canopy.flare, 0) * Math.cos(Math.PI / 7), `inner end ${inner} m out`)
    }
  }
})

test('no root, as built, floats where the ground falls away as steeply as ROOT_SLOPE', () => {
  // whichever way a slope falls, the ground at (x, z) from the trunk is at
  // least ROOT_SLOPE * hypot(x, z) below where it meets the trunk (`sink` up
  // from the plant's origin). Every corner a builder sinks into the ground -
  // the bottom ring of a foot, toes splayed, and a fin's underside - lies
  // below that in the geometry as drawn, bowed and tapered, for any tree.
  // (A palm's leaning trunk dips the rim of its base a few cm below its
  // origin, but inside its collar, so only what is half a metre down counts.)
  for (const name of Object.keys(FOOT)) {
    const t = TYPES[name]
    for (let seed = 1; seed <= 12; seed++) {
      for (let v = 0; v < t.variants; v++) {
        for (const lod of [0, 1]) {
          const p = t.builder(new Rng(seed * 7919), lod, v, t).geo.attributes.position
          let buried = 0
          let worst = -Infinity
          for (let i = 0; i < p.count; i++) {
            if (p.getY(i) > t.sink - 0.5) continue
            buried++
            worst = Math.max(worst, p.getY(i) - t.sink + ROOT_SLOPE * Math.hypot(p.getX(i), p.getZ(i)))
          }
          assert.ok(buried > 0, `${name} LOD${lod} has a buried foot`)
          assert.ok(worst <= 1e-4, `${name} seed ${seed} v${v} LOD${lod}: a corner ${worst.toFixed(3)} above the slope`)
        }
      }
    }
  }
})

test('a felled tree draws its buried foot in, and a leaning rock never does', () => {
  // the shader draws in what lies below a plant's origin as its uprightness
  // falls from TUCK[0] to TUCK[1]; fell() lays a tree over to 1.45 rad
  // (updateFalling), and a rock leans at most `tilt` about each level axis,
  // which leaves it at least cos(2 tilt) upright
  assert.ok(Math.cos(1.45) < TUCK[1])
  assert.ok(TUCK[0] > TUCK[1])
  const leaning = Object.values(TYPES).filter((t) => t.tilt)
  assert.ok(leaning.length)
  for (const t of leaning) assert.ok(Math.cos(2 * t.tilt) > TUCK[0], `tilt ${t.tilt}`)
})

test('the near and far feet meet the ground at the same width, so the LOD swap does not pop', () => {
  // the width at the ground of the polyline through an LOD's rings
  const atGround = (foot, us) => {
    for (let i = 1; i < us.length; i++) {
      if (us[i] >= 0) {
        const [u0, u1] = [us[i - 1], us[i]]
        const [k0, k1] = [flare(foot.flare, u0), flare(foot.flare, u1)]
        return k0 + ((k1 - k0) * (0 - u0)) / (u1 - u0)
      }
    }
  }
  for (const [name, foot] of Object.entries(FOOT)) {
    const near = atGround(foot, foot.rings[0])
    const far = atGround(foot, foot.rings[1])
    assert.ok(near > 1.3, `${name} flares out at the ground (${near})`)
    assert.ok(Math.abs(far - near) / near < 0.05, `${name}: ${near} near, ${far} far`)
  }
  assert.equal(flare([[0, 2], [1, 1]], -5), 2)
  assert.equal(flare([[0, 2], [1, 1]], 0.5), 1.5)
  assert.equal(flare([[0, 2], [1, 1]], 9), 1)
})
