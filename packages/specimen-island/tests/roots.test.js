import test from 'node:test'
import assert from 'node:assert/strict'
import { ROOT_SLOPE, FOOT, BUTTRESS, flare, buttress } from '../src/world/roots.js'

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

test('no root floats where the ground falls away as steeply as ROOT_SLOPE', () => {
  // whichever way a slope falls, the ground at (x, z) from the trunk is at
  // least -ROOT_SLOPE * hypot(x, z): every underside corner lies below that
  for (const f of fins) {
    for (const s of buttress(f, 4)) {
      for (const side of [-1, 1]) {
        const out = Math.hypot(s.r, s.lat + side * s.w)
        assert.ok(s.keel <= -ROOT_SLOPE * out, `underside ${s.keel} at ${out} m out`)
      }
    }
  }
  // and the bottom ring of every flared foot, its toes splayed, too
  for (const [name, foot] of Object.entries(FOOT)) {
    for (const rings of foot.rings) {
      if (!rings.length) continue
      const u = rings[0]
      const out = foot.r * flare(foot.flare, u) * (1 + foot.toes)
      assert.ok(u <= -ROOT_SLOPE * out, `${name}: foot ${u} deep, ${out.toFixed(2)} m out`)
    }
  }
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
