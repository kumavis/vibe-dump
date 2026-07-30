import * as THREE from 'three'
import { hashU32 } from './rng.js'

// ---------------------------------------------------------------------------
// Body construction: appearance params + rig rest positions → SkinParts.
//
// Style is deliberate blob-figure low poly: overlapping spheres and capsules
// transformed into bind-pose world space (three primitives wind outward — see
// FRAMES.md — so the signed-volume check holds by construction), painted with
// vertex colours. Every unique character is assembled from the same ~25 part
// recipes, steered by species params.
// ---------------------------------------------------------------------------

const _q = new THREE.Quaternion()
const _up = new THREE.Vector3(0, 1, 0)
const _dir = new THREE.Vector3()
const _c = new THREE.Color()

/** Fill vertex colours: sRGB hex → linear, with a little deterministic value jitter. */
function paint(g, hex, jitter = 0.05) {
  _c.setHex(hex).convertSRGBToLinear()
  const n = g.attributes.position.count
  const colors = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const j = 1 + ((hashU32(hex + i * 7) / 4294967296) * 2 - 1) * jitter
    colors[i * 3] = Math.min(1, _c.r * j)
    colors[i * 3 + 1] = Math.min(1, _c.g * j)
    colors[i * 3 + 2] = Math.min(1, _c.b * j)
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return g
}

/** Transform helper: scale → rotate → translate, in that order. */
function place(g, pos, { scale, rot, quat } = {}) {
  if (scale) g.scale(scale[0], scale[1], scale[2])
  if (rot) {
    if (rot[0]) g.rotateX(rot[0])
    if (rot[1]) g.rotateY(rot[1])
    if (rot[2]) g.rotateZ(rot[2])
  }
  if (quat) g.applyQuaternion(quat)
  if (pos) g.translate(pos.x ?? pos[0], pos.y ?? pos[1], pos.z ?? pos[2])
  return g
}

function sphereAt(pos, r, opts = {}) {
  const g = new THREE.SphereGeometry(r, opts.w ?? 10, opts.h ?? 8)
  return place(g, pos, opts)
}

/** Capsule from a to b with radius r (CapsuleGeometry's long axis is +Y). */
function capsuleBetween(a, b, r, opts = {}) {
  _dir.subVectors(b, a)
  const len = _dir.length()
  const g = new THREE.CapsuleGeometry(r, Math.max(len, 1e-3), 3, opts.w ?? 8)
  _q.setFromUnitVectors(_up, _dir.normalize())
  g.applyQuaternion(_q)
  g.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2)
  return g
}

/** Cone whose tip points along `dir` from base position `pos` (+Y default). */
function coneToward(pos, dir, r, h, opts = {}) {
  const g = new THREE.ConeGeometry(r, h, opts.w ?? 8)
  g.translate(0, h / 2, 0)
  if (opts.scale) g.scale(...opts.scale)
  _q.setFromUnitVectors(_up, _dir.copy(dir).normalize())
  g.applyQuaternion(_q)
  g.translate(pos.x, pos.y, pos.z)
  return g
}

const BOOT = 0x2a2018
const IVORY = 0xf0ead0
const CREAM = 0xefe0c0
const WOOD = 0x6a4a2a
const GOLD = 0xd4a017
const LEATHER = 0x5a3a22

const _c2 = new THREE.Color()

/**
 * Horizontal stripes by world-space y — echoes the stall awning silks.
 * `centerY` puts a band boundary-free stripe across the equator: on a
 * low-poly sphere, boundaries near the equator (where y barely changes
 * between rings) alias into zig-zag chevrons instead of clean bands.
 */
function paintStripes(g, hexA, hexB, period, centerY = 0) {
  _c.setHex(hexA).convertSRGBToLinear()
  _c2.setHex(hexB).convertSRGBToLinear()
  const p = g.attributes.position
  const n = p.count
  const colors = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const band = Math.floor((p.getY(i) - centerY) / period + 0.5)
    const c = band % 2 === 0 ? _c : _c2
    const j = 1 + ((hashU32(hexA + i * 7) / 4294967296) * 2 - 1) * 0.04
    colors[i * 3] = Math.min(1, c.r * j)
    colors[i * 3 + 1] = Math.min(1, c.g * j)
    colors[i * 3 + 2] = Math.min(1, c.b * j)
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return g
}

/**
 * Build all SkinParts for one character.
 * @param {object} a      appearance from species.js
 * @param {object} rest   restPositions(defs)
 * @param {object} groups boneGroups(defs)
 * @returns {import('./skinning.js').SkinPart[]}
 */
export function buildBodyParts(a, rest, groups) {
  const parts = []
  const add = (geometry, hex, bind, extra = {}) =>
    parts.push({ geometry: paint(geometry, hex, extra.jitter), material: extra.material || 'body', ...bind })

  const headR = a.headSize
  const headC = new THREE.Vector3(rest.head.x, rest.head.y + headR * 0.5, rest.head.z + headR * 0.05)
  const torsoR = a.hipW * 1.35 + a.shoulderW * 0.45
  const bellyC = new THREE.Vector3().lerpVectors(rest.hips, rest.chest, 0.42)
  bellyC.z += a.belly * 0.02

  // ---- torso: tunic-coloured belly + chest blobs -------------------------
  {
    const belly = sphereAt(bellyC, torsoR * (0.92 + a.belly * 0.3), {
      scale: [1, 1.18, 0.82 + a.belly * 0.22],
      w: 12,
      h: 9,
    })
    if (a.stripes) {
      parts.push({
        geometry: paintStripes(belly, a.cloth, 0xefe0c0, torsoR * 0.62, bellyC.y),
        material: 'body',
        bones: groups.torso,
      })
    } else {
      add(belly, a.cloth, { bones: groups.torso })
    }
  }
  add(
    sphereAt(rest.chest, a.shoulderW * 0.88, { scale: [1.06, 0.95, 0.72], w: 12, h: 9 }),
    a.cloth,
    { bones: groups.torso },
  )
  // shoulder sleeve caps
  for (const s of ['L', 'R']) {
    add(sphereAt(rest['upperarm' + s], a.limbThick * 1.45, { w: 8, h: 6 }), a.cloth, {
      bones: groups['arm' + s],
    })
  }
  // belt (torus is XY-plane, hole along +Z → rotate flat). Bound to the hips
  // ONLY — with thighs as candidates it slides down a leg mid-stride. Radius
  // is fitted to the belly sphere's actual girth at hip height, else the band
  // is swallowed by a big belly and only its bottom arc pokes out.
  {
    const bellyR = torsoR * (0.92 + a.belly * 0.3)
    const dy = (rest.hips.y + 0.015 - bellyC.y) / (bellyR * 1.18)
    const beltR = bellyR * Math.sqrt(Math.max(0.25, 1 - dy * dy)) + 0.012
    add(
      place(new THREE.TorusGeometry(beltR, 0.022, 6, 14), new THREE.Vector3(rest.hips.x, rest.hips.y + 0.015, rest.hips.z), {
        rot: [Math.PI / 2, 0, 0],
        scale: [1, 1, 0.85],
      }),
      a.accent,
      { bones: ['hips', 'spine01'] },
    )
  }
  // robe skirt or apron
  if (a.robe) {
    const knee = rest.shinL.y
    const skirt = new THREE.CylinderGeometry(torsoR * 0.85, torsoR * 1.25, rest.hips.y - knee, 10, 2, true)
    skirt.translate(0, (rest.hips.y + knee) / 2, 0)
    add(skirt, a.cloth, { bones: [...groups.torso, 'thighL', 'thighR'] })
  }
  if (a.role === 'vendor') {
    const apron = sphereAt(
      new THREE.Vector3(bellyC.x, bellyC.y - 0.02, bellyC.z + torsoR * (0.62 + a.belly * 0.2)),
      torsoR * 0.72,
      { scale: [0.95, 1.35, 0.28], w: 10, h: 8 },
    )
    add(apron, CREAM, { bones: ['hips', 'spine01', 'chest'] })
  }

  // ---- neck + head -------------------------------------------------------
  add(capsuleBetween(rest.neck, headC, headR * 0.32), a.skin, { bones: ['neck', 'chest', 'head'] })
  const headScale =
    a.species === 'alien'
      ? [1.12, 1.18, 0.95]
      : a.species === 'monster'
        ? [1.08, 0.92, 1.0]
        : [0.98, 1.04, 0.95]
  add(sphereAt(headC, headR, { scale: headScale, w: 14, h: 11 }), a.skin, {
    bones: groups.head,
    smooth: 0,
  })
  if (a.snout > 0.05) {
    const snoutC = new THREE.Vector3(headC.x, headC.y - headR * 0.28, headC.z + headR * 0.62)
    add(
      sphereAt(snoutC, headR * (0.42 + a.snout * 0.22), { scale: [0.95, 0.72, 1.1], w: 10, h: 8 }),
      a.skin,
      { bones: groups.head, smooth: 0 },
    )
  }
  // chin/jaw blob rides the jaw bone so talk chatter reads
  add(
    sphereAt(new THREE.Vector3(rest.jaw.x, rest.jaw.y, rest.jaw.z + headR * 0.05), headR * 0.34, {
      scale: [1.05, 0.7, 1.0],
      w: 8,
      h: 6,
    }),
    a.skin,
    { bones: ['jaw', 'head'], smooth: 0 },
  )
  // mouth: a dark dot riding the jaw, so chatter is visible from afar
  add(
    sphereAt(
      new THREE.Vector3(rest.jaw.x, rest.jaw.y - headR * 0.06, rest.jaw.z + headR * (0.3 + a.snout * 0.35)),
      headR * 0.13,
      { scale: [1.5, 0.75, 0.6], w: 6, h: 5 },
    ),
    0x33201e,
    { rigid: 'jaw', jitter: 0.02 },
  )
  if (a.fangs) {
    for (const s of [-1, 1]) {
      add(
        coneToward(
          new THREE.Vector3(rest.jaw.x + s * headR * 0.3, rest.jaw.y + headR * 0.02, rest.jaw.z + headR * 0.28),
          new THREE.Vector3(0, 1, 0.15),
          headR * 0.09,
          headR * 0.3,
          { w: 5 },
        ),
        IVORY,
        { rigid: 'jaw' },
      )
    }
  }
  if (a.beard > 0) {
    add(
      coneToward(
        new THREE.Vector3(rest.jaw.x, rest.jaw.y + headR * 0.05, rest.jaw.z + headR * 0.2),
        new THREE.Vector3(0, -1, 0.35),
        headR * 0.3,
        headR * (0.5 + a.beard * 0.7),
        { w: 7 },
      ),
      a.species === 'devil' ? 0x2a1a1a : 0x9a8a76,
      { rigid: 'jaw' },
    )
  }

  // ---- eyes --------------------------------------------------------------
  // Sit each eye ON the scaled head-sphere surface at its (x, y), then push it
  // out ~55% of its own radius so it bulges — buried eyes read as a blank face
  // from two metres away (measured the hard way on the first contact sheet).
  const eyeR = headR * 0.16 * a.eyeScale
  const eyeY = headC.y + headR * 0.1
  const surfaceZ = (ex, ey) => {
    const nx = ex / (headR * headScale[0])
    const ny = (ey - headC.y) / (headR * headScale[1])
    const nz = Math.sqrt(Math.max(0.05, 1 - nx * nx - ny * ny))
    return headC.z + headR * headScale[2] * nz
  }
  const positions =
    a.eyeCount === 1
      ? [[0, eyeY + headR * 0.06]]
      : a.eyeCount === 3
        ? [[-headR * 0.42, eyeY], [headR * 0.42, eyeY], [0, eyeY + headR * 0.45]]
        : [[-headR * 0.4, eyeY], [headR * 0.4, eyeY]]
  const eyePts = []
  for (const [ex, ey] of positions) {
    const p = new THREE.Vector3(headC.x + ex, ey, surfaceZ(ex, ey) + eyeR * 0.55 - eyeR)
    eyePts.push(p.clone())
    if (a.eyeGlow) {
      add(sphereAt(p, eyeR, { w: 8, h: 6 }), a.eye, { rigid: 'head', material: 'glow', jitter: 0.02 })
    } else if (a.species === 'alien') {
      add(sphereAt(p, eyeR, { scale: [1, 1.45, 0.55], rot: [0, 0, ex > 0 ? -0.25 : 0.25], w: 8, h: 6 }), 0x14142a, {
        rigid: 'head',
        jitter: 0.02,
      })
      add(sphereAt(new THREE.Vector3(p.x + eyeR * 0.2, p.y + eyeR * 0.45, p.z + eyeR * 0.32), eyeR * 0.16, { w: 5, h: 4 }), 0xffffff, {
        rigid: 'head',
        material: 'glow',
        jitter: 0,
      })
    } else {
      add(sphereAt(p, eyeR, { w: 8, h: 6 }), 0xf2ede2, { rigid: 'head', jitter: 0.02 })
      add(sphereAt(new THREE.Vector3(p.x, p.y, p.z + eyeR * 0.62), eyeR * 0.45, { w: 6, h: 5 }), a.eye, {
        rigid: 'head',
        jitter: 0.02,
      })
    }
  }

  // ---- ears --------------------------------------------------------------
  if (a.earStyle !== 'none') {
    for (const s of ['L', 'R']) {
      const sign = s === 'L' ? 1 : -1
      const earPos = rest['ear' + s]
      if (a.earStyle === 'round') {
        add(sphereAt(earPos, headR * 0.24, { scale: [0.55, 1, 0.8], w: 6, h: 5 }), a.skin, { rigid: 'ear' + s })
      } else if (a.earStyle === 'point') {
        add(
          coneToward(earPos, new THREE.Vector3(sign, 0.85, -0.2), headR * 0.18, headR * 0.62, { w: 6 }),
          a.skin,
          { rigid: 'ear' + s },
        )
      } else {
        add(
          coneToward(earPos, new THREE.Vector3(sign, 1.1, -0.35), headR * 0.3, headR * 0.9, { w: 6, scale: [1, 1, 0.35] }),
          a.skin,
          { rigid: 'ear' + s },
        )
      }
    }
  }

  // ---- horns -------------------------------------------------------------
  if (a.horns) {
    const size = a.horns.size
    for (const sign of [-1, 1]) {
      const base = new THREE.Vector3(headC.x + sign * headR * 0.5, headC.y + headR * 0.72, headC.z - headR * 0.1)
      if (a.horns.style === 'straight') {
        add(coneToward(base, new THREE.Vector3(sign * 0.45, 1, -0.1), headR * 0.16, headR * size, { w: 7 }), IVORY, {
          rigid: 'head',
        })
      } else if (a.horns.style === 'curved') {
        // three stacked cones, each tilting further back — a cheap sweep
        let p = base.clone()
        let dir = new THREE.Vector3(sign * 0.5, 1, 0)
        for (let i = 0; i < 3; i++) {
          const h = headR * size * (0.42 - i * 0.09)
          add(coneToward(p, dir, headR * (0.15 - i * 0.04), h * 1.35, { w: 6 }), IVORY, { rigid: 'head' })
          p = p.clone().addScaledVector(dir.clone().normalize(), h)
          dir = new THREE.Vector3(sign * (0.5 - i * 0.25), 1 - i * 0.45, -0.45 - i * 0.25)
        }
      } else {
        // ram: torus arc beside the head, vertical plane (torus is XY / hole +Z)
        const g = new THREE.TorusGeometry(headR * 0.42 * size, headR * 0.13, 6, 10, Math.PI * 1.35)
        place(g, new THREE.Vector3(headC.x + sign * headR * 0.72, headC.y + headR * 0.4, headC.z), {
          rot: [0, sign * (Math.PI / 2) * 0.92, Math.PI * 0.15],
        })
        add(g, IVORY, { rigid: 'head' })
      }
    }
  }

  // ---- antennae ----------------------------------------------------------
  if (a.antennae && rest.antL0) {
    for (const s of ['L', 'R']) {
      add(capsuleBetween(rest['ant' + s + '0'], rest['ant' + s + '1'], headR * 0.06), a.skin, {
        bones: ['ant' + s + '0', 'ant' + s + '1'],
      })
      add(sphereAt(rest['ant' + s + '1'], headR * 0.14, { w: 6, h: 5 }), 0xaef0e0, {
        rigid: 'ant' + s + '1',
        material: 'glow',
        jitter: 0.02,
      })
    }
  }

  // ---- hat ---------------------------------------------------------------
  const crown = new THREE.Vector3(headC.x, rest.headTop.y - headR * 0.15, headC.z - headR * 0.05)
  if (a.hat === 'cone') {
    add(coneToward(crown, new THREE.Vector3(0.12, 1, -0.08), headR * 0.92, headR * 1.7, { w: 9 }), a.cloth2, {
      rigid: 'head',
    })
  } else if (a.hat === 'brim') {
    const disc = new THREE.CylinderGeometry(headR * 1.4, headR * 1.5, headR * 0.08, 12)
    add(place(disc, crown), a.cloth2, { rigid: 'head' })
    const top = new THREE.CylinderGeometry(headR * 0.72, headR * 0.8, headR * 0.62, 10)
    add(place(top, new THREE.Vector3(crown.x, crown.y + headR * 0.32, crown.z)), a.cloth2, { rigid: 'head' })
  } else if (a.hat === 'fez') {
    const fez = new THREE.CylinderGeometry(headR * 0.55, headR * 0.68, headR * 0.6, 10)
    add(place(fez, new THREE.Vector3(crown.x, crown.y + headR * 0.22, crown.z), { rot: [0.08, 0, 0.1] }), 0xa02a2a, {
      rigid: 'head',
    })
  }

  // ---- arms + hands ------------------------------------------------------
  for (const s of ['L', 'R']) {
    add(capsuleBetween(rest['upperarm' + s], rest['forearm' + s], a.limbThick), a.skin, { bones: groups['arm' + s] })
    add(capsuleBetween(rest['forearm' + s], rest['hand' + s], a.limbThick * 0.85), a.skin, { bones: groups['arm' + s] })
    const hp = rest['hand' + s]
    add(
      sphereAt(new THREE.Vector3(hp.x, hp.y - 0.025, hp.z + 0.005), a.limbThick * 1.45, {
        scale: [1, 1.25, 1.15],
        w: 8,
        h: 6,
      }),
      a.skin,
      { bones: ['hand' + s, 'forearm' + s] },
    )
  }

  // ---- legs + feet -------------------------------------------------------
  const pantsColor = a.species === 'monster' && !a.robe ? a.skin : a.cloth2
  for (const s of ['L', 'R']) {
    add(capsuleBetween(rest['thigh' + s], rest['shin' + s], a.limbThick * 1.35), pantsColor, {
      bones: groups['leg' + s],
    })
    add(capsuleBetween(rest['shin' + s], rest['foot' + s], a.limbThick * 1.05), pantsColor, {
      bones: groups['leg' + s],
    })
    const fp = rest['foot' + s]
    const tp = rest['toe' + s]
    const footColor = a.species === 'monster' ? a.skin : BOOT
    add(capsuleBetween(new THREE.Vector3(fp.x, tp.y + 0.01, fp.z - 0.03), new THREE.Vector3(tp.x, tp.y, tp.z), a.limbThick * 1.2), footColor, {
      bones: ['foot' + s, 'toe' + s, 'shin' + s],
    })
    if (a.species === 'monster') {
      for (const o of [-1, 0, 1]) {
        add(
          coneToward(
            new THREE.Vector3(tp.x + o * a.limbThick * 0.7, tp.y, tp.z + 0.01),
            new THREE.Vector3(o * 0.2, -0.15, 1),
            a.limbThick * 0.32,
            a.limbThick * 1.1,
            { w: 5 },
          ),
          IVORY,
          { rigid: 'toe' + s },
        )
      }
    }
  }

  // ---- tail --------------------------------------------------------------
  if (a.tailSegs > 0 && rest.tail0) {
    for (let i = 0; i < a.tailSegs - 1; i++) {
      const r = a.hipW * 0.38 * (1 - i / a.tailSegs)
      add(capsuleBetween(rest[`tail${i}`], rest[`tail${i + 1}`], Math.max(r, 0.015)), a.skin, {
        bones: groups.tail,
      })
    }
    if (a.tailSpade) {
      const tip = rest[`tail${a.tailSegs - 1}`]
      const g = new THREE.OctahedronGeometry(0.055)
      place(g, new THREE.Vector3(tip.x, tip.y - 0.02, tip.z - 0.04), { scale: [0.5, 1.2, 1.2] })
      add(g, a.skin, { rigid: `tail${a.tailSegs - 1}` })
    }
  }

  // ---- hair ---------------------------------------------------------------
  if (a.hairStyle !== 'none') {
    const hc = a.hairColor
    const capC = new THREE.Vector3(headC.x, headC.y + headR * 0.24, headC.z - headR * 0.26)
    const cap = () =>
      add(sphereAt(capC, headR * 1.02, { scale: [1.02, 0.85, 0.98], w: 12, h: 9 }), hc, { rigid: 'head' })
    if (a.hairStyle === 'bob') {
      cap()
    } else if (a.hairStyle === 'bun') {
      cap()
      add(sphereAt(new THREE.Vector3(headC.x, headC.y + headR * 0.95, headC.z - headR * 0.5), headR * 0.34, { w: 8, h: 6 }), hc, { rigid: 'head' })
    } else if (a.hairStyle === 'topknot') {
      add(sphereAt(new THREE.Vector3(headC.x, headC.y + headR * 0.55, headC.z - headR * 0.15), headR * 0.72, { scale: [0.9, 0.55, 0.9], w: 10, h: 7 }), hc, { rigid: 'head' })
      add(sphereAt(new THREE.Vector3(headC.x, headC.y + headR * 1.18, headC.z - headR * 0.28), headR * 0.3, { scale: [1, 1.4, 1], w: 7, h: 6 }), hc, { rigid: 'head' })
    } else if (a.hairStyle === 'ponytail') {
      if (a.hat === 'none' && !a.headscarf) cap()
      add(
        capsuleBetween(
          new THREE.Vector3(headC.x, headC.y + headR * 0.5, headC.z - headR * 0.8),
          new THREE.Vector3(headC.x, headC.y - headR * 0.9, headC.z - headR * 1.2),
          headR * 0.2,
        ),
        hc,
        { rigid: 'head' },
      )
    } else if (a.hairStyle === 'braids') {
      if (a.hat === 'none' && !a.headscarf) cap()
      for (const s of [-1, 1]) {
        add(
          capsuleBetween(
            new THREE.Vector3(headC.x + s * headR * 0.78, headC.y - headR * 0.05, headC.z + headR * 0.1),
            new THREE.Vector3(headC.x + s * headR * 0.92, headC.y - headR * 1.45, headC.z + headR * 0.28),
            headR * 0.13,
          ),
          hc,
          { rigid: 'head' },
        )
        add(sphereAt(new THREE.Vector3(headC.x + s * headR * 0.94, headC.y - headR * 1.55, headC.z + headR * 0.3), headR * 0.14, { w: 6, h: 5 }), a.accent, { rigid: 'head' })
      }
    } else if (a.hairStyle === 'mane') {
      // spiky ridge running over the crown and down the back
      for (let i = 0; i < 4; i++) {
        const t = i / 3
        add(
          coneToward(
            new THREE.Vector3(headC.x, headC.y + headR * (0.85 - t * 0.9), headC.z - headR * (0.1 + t * 0.85)),
            new THREE.Vector3(0, 1 - t * 0.7, -0.35 - t * 0.5),
            headR * (0.3 - t * 0.05),
            headR * (0.75 - t * 0.12),
            { w: 6 },
          ),
          hc,
          { rigid: 'head' },
        )
      }
    } else if (a.hairStyle === 'crest') {
      add(
        coneToward(
          new THREE.Vector3(headC.x, headC.y + headR * 0.8, headC.z - headR * 0.05),
          new THREE.Vector3(0, 1, -0.3),
          headR * 0.55,
          headR * 1.0,
          { w: 7, scale: [0.28, 1, 1] },
        ),
        a.accent,
        { rigid: 'head' },
      )
    }
  }

  // ---- headscarf ----------------------------------------------------------
  if (a.headscarf) {
    add(
      sphereAt(new THREE.Vector3(headC.x, headC.y + headR * 0.42, headC.z - headR * 0.06), headR * 1.06, { scale: [1.03, 0.62, 1.05], w: 12, h: 8 }),
      a.accent,
      { rigid: 'head' },
    )
    add(sphereAt(new THREE.Vector3(headC.x, headC.y + headR * 0.32, headC.z - headR * 1.02), headR * 0.26, { w: 6, h: 5 }), a.accent, { rigid: 'head' })
  }

  // ---- face accessories ---------------------------------------------------
  if (a.earrings && a.earStyle !== 'none') {
    for (const s of ['L', 'R']) {
      const ep = rest['ear' + s]
      const ring = new THREE.TorusGeometry(headR * 0.14, headR * 0.035, 5, 10)
      // torus is XY-plane/hole +Z → rotate Y so the hoop hangs in the YZ plane
      place(ring, new THREE.Vector3(ep.x, ep.y - headR * 0.22, ep.z + headR * 0.02), { rot: [0, Math.PI / 2, 0] })
      add(ring, GOLD, { rigid: 'ear' + s, jitter: 0.02 })
    }
  }
  if (a.glasses && eyePts.length === 2) {
    for (const p of eyePts) {
      const rim = new THREE.TorusGeometry(eyeR * 1.2, eyeR * 0.14, 5, 12)
      place(rim, new THREE.Vector3(p.x, p.y, p.z + eyeR * 0.75))
      add(rim, GOLD, { rigid: 'head', jitter: 0.02 })
    }
    const bridge = new THREE.CylinderGeometry(eyeR * 0.1, eyeR * 0.1, Math.abs(eyePts[0].x - eyePts[1].x) - eyeR * 1.6, 5)
    place(bridge, new THREE.Vector3(headC.x, eyePts[0].y + eyeR * 0.3, eyePts[0].z + eyeR * 0.75), { rot: [0, 0, Math.PI / 2] })
    add(bridge, GOLD, { rigid: 'head', jitter: 0.02 })
  }
  if (a.eyepatch && eyePts.length >= 2) {
    const p = eyePts[0]
    add(sphereAt(new THREE.Vector3(p.x, p.y, p.z + eyeR * 0.45), eyeR * 1.25, { scale: [1, 1, 0.32], w: 8, h: 6 }), 0x1a1512, { rigid: 'head', jitter: 0.02 })
    const strap = new THREE.TorusGeometry(headR * 1.1, headR * 0.045, 4, 16)
    place(strap, new THREE.Vector3(headC.x, p.y + headR * 0.12, headC.z), { rot: [Math.PI / 2 - 0.18, 0, -0.22] })
    add(strap, 0x1a1512, { rigid: 'head', jitter: 0.02 })
  }

  // ---- neckwear -----------------------------------------------------------
  if (a.necklace !== 'none') {
    const ny = rest.neck.y - 0.015
    const nr = a.shoulderW * 0.55
    const cord = new THREE.TorusGeometry(nr, 0.011, 4, 16)
    place(cord, new THREE.Vector3(0, ny, 0.01), { rot: [Math.PI / 2 + 0.28, 0, 0] })
    add(cord, a.necklace === 'teeth' ? LEATHER : GOLD, { bones: ['neck', 'chest'], jitter: 0.02 })
    // hang the pendant ON the chest-blob surface (same trick as the eyes)
    const fy = ny - nr * 0.42
    const chestRy = a.shoulderW * 0.84
    const chestRz = a.shoulderW * 0.63
    const dy = (fy - rest.chest.y) / chestRy
    const fz = rest.chest.z + chestRz * Math.sqrt(Math.max(0.1, 1 - dy * dy)) + 0.02
    if (a.necklace === 'teeth') {
      for (const o of [-1, 0, 1]) {
        add(
          coneToward(new THREE.Vector3(o * nr * 0.42, fy + 0.012, fz - Math.abs(o) * 0.012), new THREE.Vector3(0, -1, 0.12), 0.014, 0.05, { w: 5 }),
          IVORY,
          { bones: ['neck', 'chest'] },
        )
      }
    } else {
      const gem = new THREE.OctahedronGeometry(0.028)
      place(gem, new THREE.Vector3(0, fy, fz), { scale: [1, 1.3, 0.7] })
      add(gem, a.species === 'devil' ? 0xc0392b : a.accent, { bones: ['neck', 'chest'], jitter: 0.02 })
    }
  } else if (a.collar) {
    const col = new THREE.TorusGeometry(a.shoulderW * 0.5, 0.02, 5, 14)
    place(col, new THREE.Vector3(0, rest.neck.y + 0.005, 0.005), { rot: [Math.PI / 2, 0, 0], scale: [1, 1, 0.9] })
    add(col, a.cloth2, { bones: ['neck', 'chest'] })
  }

  // ---- sash / satchel / pouches / cape ------------------------------------
  const bandR = torsoR * (1.04 + a.belly * 0.34) // clear of the belly sphere at its widest
  // gentle tilt: standoff from the body grows with tilt × radius, and on slim
  // torsos a steep band reads as a loose hoop rather than a worn sash
  if (a.sash) {
    const sash = new THREE.TorusGeometry(bandR * 0.96, 0.028, 5, 18)
    sash.rotateX(Math.PI / 2) // flat ring around the torso…
    sash.rotateZ(0.42) // …tilted shoulder→hip, bandolier-style
    sash.translate(bellyC.x, bellyC.y + torsoR * 0.3, bellyC.z)
    add(sash, a.accent, { bones: groups.torso })
  }
  if (a.satchel) {
    const strap = new THREE.TorusGeometry(bandR * 0.94, 0.016, 4, 18)
    strap.rotateX(Math.PI / 2)
    strap.rotateZ(-0.42)
    strap.translate(bellyC.x, bellyC.y + torsoR * 0.32, bellyC.z)
    add(strap, LEATHER, { bones: groups.torso })
    const bag = new THREE.BoxGeometry(0.17, 0.15, 0.08)
    place(bag, new THREE.Vector3(torsoR * 0.95, rest.hips.y + 0.03, -0.03), { rot: [0, 0.15, 0.08] })
    add(bag, LEATHER, { bones: ['hips', 'spine01'] })
    add(sphereAt(new THREE.Vector3(torsoR * 0.95, rest.hips.y + 0.1, -0.03), 0.045, { scale: [1.6, 0.5, 1.1], w: 6, h: 4 }), a.cloth2, { bones: ['hips', 'spine01'] })
  }
  if (a.beltPouches) {
    for (const o of [-0.55, 0.5]) {
      add(
        sphereAt(new THREE.Vector3(torsoR * o, rest.hips.y - 0.02, torsoR * (0.72 + a.belly * 0.2)), 0.042, { scale: [1, 1.25, 0.8], w: 6, h: 5 }),
        LEATHER,
        { bones: ['hips', 'spine01'] },
      )
    }
  }
  if (a.cape) {
    const capeLen = rest.chest.y - rest.hips.y + 0.16
    const cone = new THREE.ConeGeometry(torsoR * 1.35, capeLen, 9, 1, true, Math.PI / 2, Math.PI)
    cone.translate(0, -capeLen / 2, 0) // apex at origin, skirt hanging below
    place(cone, new THREE.Vector3(0, rest.neck.y + 0.02, -0.02), { rot: [-0.12, 0, 0] })
    add(cone, a.species === 'devil' ? 0x2a1020 : a.cloth2, { bones: ['chest', 'spine01', 'hips'] })
  }

  // ---- cuffs ---------------------------------------------------------------
  if (a.cuffs) {
    for (const s of ['L', 'R']) {
      const hp = rest['hand' + s]
      const cuff = new THREE.TorusGeometry(a.limbThick * 1.12, 0.013, 4, 10)
      place(cuff, new THREE.Vector3(hp.x, hp.y + 0.035, hp.z), { rot: [Math.PI / 2, 0, 0] })
      add(cuff, a.cloth2, { bones: ['hand' + s, 'forearm' + s] })
    }
  }

  // ---- busker instruments -----------------------------------------------
  if (a.instrument === 'drum') {
    const dp = new THREE.Vector3(bellyC.x, bellyC.y + 0.05, bellyC.z + torsoR * 1.15)
    const shell = new THREE.CylinderGeometry(0.15, 0.13, 0.17, 12)
    add(place(shell, dp, { rot: [0.15, 0, 0] }), WOOD, { rigid: 'chest' })
    const top = new THREE.CylinderGeometry(0.145, 0.145, 0.02, 12)
    add(place(top, new THREE.Vector3(dp.x, dp.y + 0.09, dp.z + 0.012), { rot: [0.15, 0, 0] }), CREAM, {
      rigid: 'chest',
    })
  } else if (a.instrument === 'flute') {
    // held diagonally: top end at the lips, foot swept down-right-forward
    const mouth = new THREE.Vector3(headC.x, headC.y - headR * 0.35, headC.z + headR * 0.9)
    const g = new THREE.CylinderGeometry(0.011, 0.015, 0.34, 6)
    place(g, new THREE.Vector3(mouth.x + 0.09, mouth.y - 0.09, mouth.z + 0.07), { rot: [0.5, 0, -0.7] })
    add(g, 0x3a2a18, { rigid: 'head' })
  }

  return parts
}
