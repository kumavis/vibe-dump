import * as THREE from 'three'
import { buildSkeleton, BONE_NAMES, boneSegments, restPositions } from './rig.js'
import { buildBodyParts } from './body.js'
import { buildGearParts } from './gear.js'
import { buildSkinnedGeometry, validateSkin } from './skinning.js'
import { createMaterials, disposeMaterials } from './materials.js'
import { buildClips } from './anim.js'
import { buildChains } from './springbone.js'
import { CapsuleCollider, Strand, ClothPatch, StrandMesh, ClothMesh, DynamicsWorld } from './dynamics.js'
import { buildCleaver, buildPistol, buildBuckler } from './weapons.js'
import { frame, mate, handGripSocket, forearmStrapSocket, socketError, formatSocketError } from './attach.js'
import { LEFT, RIGHT, BACKWARD } from './convention.js'
import { mergeAll, xform } from './geometry.js'

// ---------------------------------------------------------------------------
// The goblin
//
// Assembles everything: solves the skin, binds the skeleton, hangs the kit off
// the verlet solver, straps the weapons to the right bones, and drives the
// whole thing from one `update(dt)`.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Where the kit hangs
//
// This was three hand-searched euler triples. They were searched against a
// proxy — "where does the tip end up over the run cycle" — rather than against
// the constraint that actually matters, which is that the handle passes through
// the fist, and measured after the fact the cleaver's grip axis was 104.7° and
// 17.8 mm away from the hand's. The goblin was gripping air.
//
// Now every weapon publishes a plug frame next to the geometry that defines it
// (`weapons.js`), every bone publishes a socket derived from the rig
// (`attach.js`), and `mate()` solves for the transform. What is left is a
// `{ roll, slide, lift }` trim: one dial each, all of them in units a human can
// picture. If a fourth dial starts looking necessary, the socket or the plug is
// wrong — fix that instead of adding it here.
// ---------------------------------------------------------------------------

/**
 * The same grip, taken the other way up: a hammer grip whose business end
 * leaves the little-finger side of the fist instead of the thumb side.
 *
 * This is a *different frame*, not a roll — no rotation about the grip axis
 * turns a blade end for end — so it is said with a frame rather than smuggled
 * in as a 180°. It is also the only way the run reads. With his arm hanging,
 * the thumb side of the fist points forward and up, so a blade seated that way
 * rides across his own chest: measured over the whole run clip, blade direction
 * against "trailing back and slightly up",
 *
 *   little-finger side   +0.533   nearest torso capsule 0.232 m
 *   thumb side           -0.533   nearest torso capsule 0.110 m
 *
 * i.e. the other way up it fails the 0.12 m clearance on its own.
 */
const flipped = (f) => frame(f.origin, f.axis.clone().negate(), f.normal, `${f.label}-flipped`)

/**
 * Where a holstered sidearm rides, in the thigh bone's local space. Not a grip
 * socket: nothing closes on it, so it is stated as a frame the same way and can
 * be checked the same way, but the thing being seated is the gun's body.
 *
 *   `axis`   runs down the thigh, hip -> knee. The gun's bore mates to it, so
 *            the muzzle points at the ground and the butt sits up by the hip.
 *   `normal` is BACKWARD — the way the gun's front faces once it is holstered.
 *            That leaves the slab receiver lying on its cheek against the leg,
 *            the drum outboard where it can be seen, and — because the
 *            Sputterhawk's grip is raked 19.9° back off its own bore — the butt
 *            kicking forward off the thigh. The cant is the weapon's geometry
 *            showing through, not a number anybody chose.
 *
 * `around` is the third thing a holster has and a hand cannot: which way round
 * the leg it is strapped. It rotates the whole socket about the bone, so the
 * gun stays *on* the leg instead of drifting off it, and it is what keeps the
 * gun out of the swinging cleaver.
 *
 * @param {'L'|'R'} side
 * @param {object} [o]
 * @param {number} [o.along=0.58]      fraction of the thigh, hip -> knee
 * @param {number} [o.clearance=0.077] metres from the bone axis to the receiver's
 *                                     centreline. The thigh mesh only reaches
 *                                     44 mm out there and the gun's inboard face
 *                                     (the charging handle, not the receiver) is
 *                                     32 mm off its centreline, so 77 mm is the
 *                                     first value at which nothing is buried.
 * @param {number} [o.around=1.05]     radians round the leg from straight out,
 *                                     positive rearward. Straight out is where
 *                                     the cleaver hand swings: with the gun
 *                                     there the two solids touch (1 mm) on every
 *                                     stride. Rolling it 60° onto the back of
 *                                     the thigh opens that to 17 mm and still
 *                                     leaves the gun sitting on the leg (6 mm
 *                                     off the flesh, against 5 mm at 0).
 */
export function thighHolsterSocket(
  side,
  { along = 0.58, clearance = 0.077, around = 1.05, rest = restPositions() } = {},
) {
  const hip = rest[`thigh${side}`]
  const knee = rest[`shin${side}`]
  const bone = new THREE.Vector3().subVectors(knee, hip)
  const length = bone.length()
  bone.normalize()
  const lateral = side === 'L' ? LEFT : RIGHT
  const c = Math.cos(around)
  const s = Math.sin(around)
  const outward = new THREE.Vector3().addScaledVector(lateral, c).addScaledVector(BACKWARD, s)
  const tangent = new THREE.Vector3().addScaledVector(BACKWARD, c).addScaledVector(lateral, -s)
  const origin = new THREE.Vector3()
    .addScaledVector(bone, length * along)
    .addScaledVector(outward, clearance)
  return { ...frame(origin, bone, tangent, `holster${side}`), length }
}

/**
 * socket + plug + trim per weapon; `gear` is what `weapons.js` just built.
 *
 * Exported because everything in it is pure maths: `createGoblin` needs a WebGL
 * context, but the mounts can be walked in plain `node` and measured against
 * the baked clips, which is how the trims below were arrived at.
 */
export const MOUNTS = {
  cleaver: (gear) => ({
    bone: 'handR',
    socket: handGripSocket('R', { gripRadius: gear.gripRadius }),
    plug: flipped(gear.plugs.grip),
    trim: {
      // Solved, not guessed. OBJECTIVE, over the whole run clip: maximise the
      // blade's flat running parallel to the direction of travel — the mean of
      // 1 - |flat normal · FORWARD| — with the 180° tie broken by requiring the
      // edge to face away from his own leg, mean(edge · outboard) >= 0.
      //
      //   roll     0°   -60°   -88°   +92°
      //   flat   0.606  0.640  0.725  0.725
      //   edge  -0.474  0.351  0.662 -0.662
      //
      // Both peaks stand the flat up edge-on to the airstream; only one of them
      // has the sharp side pointing away from his thigh, which is exactly what
      // the tie-break is for. The tip constraints barely move over the sweep
      // (0.182-0.217 m from the torso capsules, 0.399-0.434 m off the ground)
      // because the tip sits 20 mm off the roll axis — those are the wrist's
      // job, not roll's. Re-solve this if the run's wrist keys change: the
      // wrist rolls the blade too, and it moved this optimum by 24°.
      roll: -1.54,
      // The cross-guard eats the top of the leather, so the band a fist can
      // actually close on is 10 mm lower than the leather's centre.
      slide: -0.01,
    },
  }),
  buckler: (gear) => ({
    bone: 'forearmL',
    socket: forearmStrapSocket('L', {
      // Far down the forearm, because the hand strap is bolted 36 mm past the
      // arm loop and this is what lands it on the fist: measured, the hand
      // strap's apex ends up 21 mm from the wrist bone at 0.82, 33 mm at 0.72
      // and 48 mm at 0.62.
      along: 0.82,
      // The arm loop's centreline hangs 21 mm behind the plate's back face, so
      // the plate has to stand off the bone by that much plus the forearm's
      // radius or the loop is swallowed by the arm. Sampled against the arm
      // mesh, 58 mm clears the flesh by 2.0 mm at the worst point; 55 mm gets
      // it down to 1.4 mm and 45 mm buries the strap 14 mm deep.
      clearance: 0.058,
    }),
    plug: gear.plugs.strap,
    trim: {},
  }),
  pistol: (gear) => ({
    bone: 'thighR',
    socket: thighHolsterSocket('R'),
    plug: gear.plugs.holster,
    trim: {},
  }),
}

/** The socket a trim actually asks for — `mate` is exact about it, so the check
 *  has to be too, or every `slide` reads as a millimetre of error. */
function trimmed(socket, { slide = 0, lift = 0 } = {}) {
  const origin = socket.origin
    .clone()
    .addScaledVector(socket.axis, slide)
    .addScaledVector(socket.normal, lift)
  return frame(origin, socket.axis, socket.normal, socket.label)
}

// Capsules the cape and straps collide against. Local-space segments on each
// bone; the solver refreshes them from the bone matrices every frame.
const COLLIDERS = [
  ['hips', [0, -0.03, 0], [0, 0.1, 0.01], 0.125],
  ['spine02', [0, -0.02, 0], [0, 0.12, 0], 0.125],
  ['chest', [0, 0, 0], [0, 0.08, -0.01], 0.115],
  ['head', [0, 0, 0.01], [0, 0.1, 0], 0.1],
  ['thighL', [0, -0.02, 0], [0, -0.23, 0], 0.072],
  ['thighR', [0, -0.02, 0], [0, -0.23, 0], 0.072],
  ['shinL', [0, 0, 0], [0, -0.22, 0], 0.055],
  ['shinR', [0, 0, 0], [0, -0.22, 0], 0.055],
  ['upperarmL', [0.02, 0, 0], [0.21, 0, 0], 0.055],
  ['upperarmR', [-0.02, 0, 0], [-0.21, 0, 0], 0.055],
]

// Ear and tail chains: skeleton bones, so they run on the spring-bone solver
// rather than the verlet one.
const SPRING_CHAINS = [
  {
    names: ['earL0', 'earL1', 'earL2', 'earL3'],
    stub: [0.03, -0.01, -0.04],
    opts: { stiffness: 0.2, stiffnessTip: 0.055, drag: 0.2, dragTip: 0.08, gravity: 1.1, gravityTip: 2.6 },
  },
  {
    names: ['earR0', 'earR1', 'earR2', 'earR3'],
    stub: [-0.03, -0.01, -0.04],
    opts: { stiffness: 0.19, stiffnessTip: 0.05, drag: 0.2, dragTip: 0.08, gravity: 1.2, gravityTip: 2.8 },
  },
  {
    names: ['tail0', 'tail1', 'tail2', 'tail3', 'tail4'],
    stub: [0, -0.02, -0.06],
    opts: { stiffness: 0.26, stiffnessTip: 0.08, drag: 0.26, dragTip: 0.12, gravity: 1.6, gravityTip: 3.4 },
  },
]

// ---- small hanging trinkets ----------------------------------------------

function tipGeometry(kind) {
  switch (kind) {
    case 'tooth': {
      const g = new THREE.ConeGeometry(0.011, 0.042, 6)
      return xform(g, { pos: [0, -0.021, 0], rot: [Math.PI, 0, 0] })
    }
    case 'tin': {
      const g = new THREE.CylinderGeometry(0.017, 0.017, 0.026, 12)
      return xform(g, { pos: [0, -0.013, 0] })
    }
    case 'ring': {
      // A hoop hangs in a VERTICAL plane, facing sideways off the ear — you see
      // the circle, not its edge. TorusGeometry is born in the XY plane with its
      // hole along +Z; rotating about X (which is what this did) lays the hoop
      // flat into the XZ plane, so the rings read as little horizontal discs
      // stuck to the side of his head. Rotating about Y instead swings the hole
      // onto X and leaves the hoop standing up.
      const g = new THREE.TorusGeometry(0.014, 0.0035, 6, 14)
      return xform(g, { pos: [0, -0.014, 0], rot: [0, Math.PI / 2, 0] })
    }
    case 'bead':
    default:
      return new THREE.SphereGeometry(0.012, 10, 8)
  }
}

/** A trinket that rides the free end of a strand. */
class Trinket {
  constructor(strand, kind, material) {
    this.strand = strand
    this.mesh = new THREE.Mesh(tipGeometry(kind), material)
    this.mesh.castShadow = true
    this.mesh.frustumCulled = false
    this._up = new THREE.Vector3(0, 1, 0)
    this._dir = new THREE.Vector3()
  }

  sync() {
    const pts = this.strand.points
    const tip = pts[pts.length - 1]
    const prev = pts[pts.length - 2]
    this.mesh.position.copy(tip)
    // Hang along the last segment so a swinging charm tilts with the strap.
    this._dir.subVectors(tip, prev)
    if (this._dir.lengthSq() > 1e-10) {
      this._dir.normalize()
      this.mesh.quaternion.setFromUnitVectors(this._up, this._dir.negate())
    }
  }
}

/** Beads threaded along a strand — the tooth necklace. */
class BeadRow {
  constructor(strand, count, material) {
    const geo = mergeAll([
      new THREE.SphereGeometry(0.009, 8, 6),
      xform(new THREE.ConeGeometry(0.006, 0.026, 5), { pos: [0, -0.014, 0], rot: [Math.PI, 0, 0] }),
    ])
    this.mesh = new THREE.InstancedMesh(geo, material, count)
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.mesh.castShadow = true
    this.mesh.frustumCulled = false
    this.strand = strand
    this.count = count
    this._m = new THREE.Matrix4()
    this._p = new THREE.Vector3()
    this._q = new THREE.Quaternion()
    this._s = new THREE.Vector3(1, 1, 1)
    this._dir = new THREE.Vector3()
    this._up = new THREE.Vector3(0, 1, 0)
  }

  sync() {
    const pts = this.strand.points
    const n = pts.length
    for (let i = 0; i < this.count; i++) {
      // Spread the beads across the interior of the strand, skipping the pins.
      const t = (i + 1) / (this.count + 1)
      const f = t * (n - 1)
      const i0 = Math.min(n - 2, Math.floor(f))
      const a = pts[i0]
      const b = pts[i0 + 1]
      this._p.lerpVectors(a, b, f - i0)
      this._dir.subVectors(b, a)
      if (this._dir.lengthSq() > 1e-10) {
        this._dir.normalize()
        // Beads hang down off the cord, not along it.
        this._q.setFromUnitVectors(this._up, this._dir)
        this._q.multiply(_BEAD_TILT)
      }
      const scale = 0.75 + 0.5 * Math.sin(i * 2.4)
      this._s.set(scale, scale, scale)
      this._m.compose(this._p, this._q, this._s)
      this.mesh.setMatrixAt(i, this._m)
    }
    this.mesh.instanceMatrix.needsUpdate = true
  }
}

const _BEAD_TILT = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2)

// ---------------------------------------------------------------------------

/**
 * @param {object} o
 * @param {THREE.WebGLRenderer} [o.renderer]
 * @param {number} [o.quality=1]
 */
export function createGoblin({ renderer, quality = 1 } = {}) {
  const t0 = performance.now()
  const group = new THREE.Group()
  group.name = 'goblin'

  // ---- skeleton + skin ----
  const { root, bones, byName, skeleton } = buildSkeleton()
  const bodyParts = buildBodyParts()
  const { parts: gearParts, accessories } = buildGearParts()
  const { geometry, materials: materialKeys } = buildSkinnedGeometry([...bodyParts, ...gearParts], {
    boneNames: BONE_NAMES,
    segments: boneSegments(),
  })

  const materials = createMaterials({ renderer, quality })
  const meshMaterials = materialKeys.map((key) => {
    if (!materials[key]) console.warn(`space-goblin: no material for key "${key}"`)
    return materials[key] || materials.metalDark
  })

  const mesh = new THREE.SkinnedMesh(geometry, meshMaterials)
  mesh.castShadow = true
  mesh.receiveShadow = true
  // The bind pose has the arms out sideways; once posed, three's culling sphere
  // is wrong for a frame or two and the goblin blinks. Not worth the cost.
  mesh.frustumCulled = false
  mesh.add(root)
  mesh.bind(skeleton)
  group.add(mesh)

  // ---- weapons ----
  const weapons = {}
  const attachGear = (name, gear) => {
    const mount = MOUNTS[name](gear)
    const placed = mate(mount.socket, mount.plug, mount.trim)
    // The whole point of solving the mate is that it can be checked, so check
    // it. A warning rather than a throw: a weapon in the wrong place is a bug
    // worth shouting about, not a reason to show a blank screen.
    const err = socketError(trimmed(mount.socket, mount.trim), mount.plug, placed)
    if (err.axisDeg > 1 || err.offset > 0.001) {
      console.warn(`space-goblin: ${name} misses its socket — ${formatSocketError(name, err)}`)
    }
    const holder = new THREE.Group()
    holder.name = name
    holder.position.copy(placed.position)
    holder.quaternion.copy(placed.quaternion)
    // One mesh per material key, sharing the library.
    const byMat = new Map()
    for (const part of gear.parts) {
      if (!byMat.has(part.material)) byMat.set(part.material, [])
      byMat.get(part.material).push(part.geometry)
    }
    for (const [key, geos] of byMat) {
      const merged = mergeAll(geos)
      if (!merged) continue
      const m = new THREE.Mesh(merged, materials[key] || materials.metalDark)
      m.castShadow = true
      m.receiveShadow = true
      holder.add(m)
    }
    byName[mount.bone].add(holder)
    weapons[name] = { gear, holder, mount, error: err }
    return holder
  }
  attachGear('cleaver', buildCleaver())
  attachGear('buckler', buildBuckler())
  attachGear('pistol', buildPistol())

  // ---- animation ----
  const clips = buildClips()
  const mixer = new THREE.AnimationMixer(mesh)
  const actions = {}
  for (const [name, clip] of Object.entries(clips)) {
    const action = mixer.clipAction(clip)
    if (name === 'combo' || name === 'skid') {
      action.setLoop(THREE.LoopOnce, 1)
      action.clampWhenFinished = true
    }
    actions[name] = action
  }
  actions.run.play()
  let current = actions.run

  // ---- secondary motion ----
  const chains = buildChains(byName, SPRING_CHAINS)
  const dynamics = new DynamicsWorld({ gravity: -9.8, substeps: 2, wind: 0.35 })

  for (const [bone, a, b, r] of COLLIDERS) {
    if (!byName[bone]) continue
    dynamics.addCollider(
      new CapsuleCollider(byName[bone], new THREE.Vector3(...a), new THREE.Vector3(...b), r),
    )
  }

  const trinkets = []
  const strandsByName = {}
  for (const spec of accessories) {
    if (spec.type === 'strand') {
      const strand = new Strand({
        anchor: byName[spec.bone],
        offset: spec.offset,
        dir: spec.dir,
        length: spec.length,
        segments: spec.segments,
        stiffness: spec.stiffness ?? 0.9,
        damping: spec.damping ?? 0.06,
        gravity: spec.gravity ?? -9.8,
        drag: spec.drag ?? 0.04,
        wind: spec.wind ?? 0.3,
        pinTip: !!spec.pinTip,
        pinTipTo: spec.pinTipTo,
      })
      dynamics.addStrand(strand)
      strandsByName[spec.name] = strand
      const material = materials[spec.material] || materials.leather
      const strandMesh = new StrandMesh(strand, {
        radius: spec.radius ?? 0.008,
        radialSegments: spec.radius > 0.008 ? 7 : 5,
        taper: spec.taper ?? 1,
        material,
      })
      strandMesh.castShadow = true
      strandMesh.frustumCulled = false
      group.add(strandMesh)
      dynamics.addMesh(strandMesh)

      if (spec.tip) {
        const trinket = new Trinket(strand, spec.tip.kind, materials[spec.tip.material] || materials.brass)
        group.add(trinket.mesh)
        trinkets.push(trinket)
      }
      if (spec.beads) {
        const beads = new BeadRow(strand, spec.beads, materials.bone)
        group.add(beads.mesh)
        trinkets.push(beads)
      }
    } else if (spec.type === 'cloth') {
      const cloth = new ClothPatch({
        width: spec.width,
        height: spec.height,
        cols: spec.cols,
        rows: spec.rows,
        pins: spec.pins.map((p) => ({ bone: byName[p.bone], local: p.local, col: p.col })),
        stiffness: spec.stiffness ?? 0.9,
        damping: spec.damping ?? 0.04,
        gravity: spec.gravity ?? -9.8,
        wind: spec.wind ?? 0.5,
        drag: spec.drag ?? 0.03,
        slit: spec.slit,
      })
      dynamics.addCloth(cloth)
      const clothMesh = new ClothMesh(cloth, { material: materials[spec.material] || materials.cloth })
      clothMesh.castShadow = true
      clothMesh.receiveShadow = true
      clothMesh.frustumCulled = false
      group.add(clothMesh)
      dynamics.addMesh(clothMesh)
    }
  }

  // ---- state ----
  const velocity = new THREE.Vector3()
  const gust = new THREE.Vector3()
  let speed = 0
  let elapsed = 0
  let settled = false

  function crossFade(name, duration = 0.22) {
    const next = actions[name]
    if (!next || next === current) return next
    next.reset()
    next.setEffectiveWeight(1)
    next.enabled = true
    next.play()
    current.crossFadeTo(next, duration, false)
    current = next
    return next
  }

  const api = {
    group,
    mesh,
    skeleton,
    bones,
    byName,
    mixer,
    actions,
    dynamics,
    materials,
    weapons,
    strands: strandsByName,
    stats: {
      vertices: geometry.attributes.position.count,
      triangles: geometry.index.count / 3,
      bones: bones.length,
      materials: materialKeys.length,
      accessories: accessories.length,
      buildMs: 0,
      skin: validateSkin(geometry),
    },

    playRun: () => crossFade('run', 0.25),
    playIdle: () => crossFade('idle', 0.35),
    /** Fire the melee combo, then hand control back to the run. */
    playCombo() {
      const combo = crossFade('combo', 0.18)
      if (!combo) return
      combo.reset()
      combo.setLoop(THREE.LoopOnce, 1)
      combo.clampWhenFinished = true
      combo.play()
      const onFinish = (e) => {
        if (e.action !== combo) return
        mixer.removeEventListener('finished', onFinish)
        crossFade('run', 0.3)
      }
      mixer.addEventListener('finished', onFinish)
    },
    get action() {
      return current.getClip().name
    },

    /**
     * @param {number} dt seconds
     * @param {object} [o]
     * @param {number} [o.speed]  forward m/s, drives apparent wind on the kit
     */
    update(dt, { speed: s = 0 } = {}) {
      elapsed += dt
      speed = s
      mixer.update(dt)
      root.updateMatrixWorld(true)

      // The kit does not know the goblin is running in place, so feed it the
      // motion it *would* have: a headwind plus a bit of turbulence.
      velocity.set(0, 0, speed)
      gust.set(
        Math.sin(elapsed * 2.3) * 0.35 + Math.sin(elapsed * 5.7) * 0.12,
        Math.sin(elapsed * 3.1) * 0.2,
        Math.sin(elapsed * 1.7) * 0.25,
      )
      velocity.add(gust)
      dynamics.setCharacterVelocity(velocity)

      // Ears and tail read the same wind, scaled — they are attached to the
      // creature, so most of their motion already comes from the skeleton.
      gust.multiplyScalar(2.2).addScaledVector(velocity, -1.6)
      for (const chain of chains) chain.step(dt, gust)

      dynamics.step(dt)
      for (const t of trinkets) t.sync()

      if (!settled) {
        settled = true
        // The first frame starts every strand at its rest pose mid-stride;
        // let it fall for a moment so nothing pops on screen.
        for (let i = 0; i < 30; i++) dynamics.step(1 / 60)
        for (const t of trinkets) t.sync()
      }
    },

    reset() {
      for (const chain of chains) chain.reset()
      dynamics.reset()
      settled = false
    },

    dispose() {
      geometry.dispose()
      disposeMaterials(materials)
      dynamics.dispose()
      mixer.stopAllAction()
    },
  }

  api.stats.buildMs = performance.now() - t0
  return api
}
