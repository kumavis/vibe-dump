// The head, brain and visual pathway, in world millimetres: x toward the
// person's left, y up, z out of the face. Origin midway between the eyes.
// The affected eye is the right one (x < 0).
import * as THREE from 'three'
import { tube, curveOf, flow, smooth } from './util.js'

// height, half-width, front and back of the head at that height
const PROFILE = [[105, 0, -85, -85], [99, 36, -50, -126], [84, 59, -15, -160], [60, 72, 6, -180], [32, 75, 12, -186], [6, 73, 9, -182],
  [-22, 69, 11, -168], [-48, 63, 13, -142], [-72, 54, 11, -112], [-97, 38, 7, -72], [-111, 19, -6, -46], [-116, 0, -30, -30]]

function profileAt(s) {
  const n = PROFILE.length - 1, f = Math.min(n - 1e-6, s * n), i = Math.floor(f), t = f - i
  const P = k => PROFILE[Math.min(n, Math.max(0, k))]
  return [0, 1, 2, 3].map(c => {
    const p0 = P(i - 1)[c], p1 = P(i)[c], p2 = P(i + 1)[c], p3 = P(i + 2)[c]
    return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t)
  })
}

function headGeometry() {
  const ROWS = 80, SEG = 96, pos = [], idx = []
  const g2 = (a, b) => Math.exp(-(a * a + b * b))
  for (let r = 0; r <= ROWS; r++) {
    let [y, w, f, b] = profileAt(r / ROWS)
    w = Math.max(0, w)
    const zc = (f + b) / 2, hz = (f - b) / 2
    for (let k = 0; k <= SEG; k++) {
      const a = (k / SEG) * Math.PI * 2, sx = Math.sin(a), cz = Math.cos(a), e = 0.8
      const x = w * Math.sign(sx) * Math.abs(sx) ** e
      let z = zc + hz * Math.sign(cz) * Math.abs(cz) ** e
      if (cz > 0) {
        const fr = smooth(0, 0.5, cz)
        z += fr * (23 * g2(x / 10.5, (y + 21) / 18) + 7 * g2(x / 8, (y + 1) / 15)) //   nose and its bridge
        z -= fr * 4.5 * g2((Math.abs(x) - 32) / 15, (y - 1) / 11) //                    eye sockets
        z += fr * 4 * g2(x / 46, (y - 17) / 7) //                                       brow
        z += fr * (3.5 * g2(x / 19, (y + 60) / 5) + 5 * g2(x / 18, (y + 96) / 12)) //   lips, chin
      }
      pos.push(x, y, z)
      if (r < ROWS && k < SEG) { const q = r * (SEG + 1) + k; idx.push(q, q + SEG + 1, q + 1, q + 1, q + SEG + 1, q + SEG + 2) }
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals()
  return g
}

/** Solid when uGlass = 0; a rim-lit glass shell when uGlass = 1. */
function ghostMaterial(solid, rim) {
  return new THREE.ShaderMaterial({
    transparent: true,
    uniforms: { uGlass: { value: 0 }, uSolid: { value: new THREE.Color(solid) }, uRim: { value: new THREE.Color(rim) }, uAlpha: { value: 1 } },
    vertexShader: `varying vec3 vN; varying vec3 vV;
      void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalMatrix * normal; vV = -mv.xyz; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform float uGlass, uAlpha; uniform vec3 uSolid, uRim; varying vec3 vN; varying vec3 vV;
      void main(){
        vec3 n = normalize(vN); vec3 v = normalize(vV);
        float ndv = abs(dot(n, v));
        float fres = pow(1.0 - ndv, 2.2);
        float lit = 0.42 + 0.58 * max(dot(n, normalize(vec3(0.35, 0.6, 0.72))), 0.0);
        vec3 col = mix(uSolid * lit, uRim * (0.45 + 0.9 * fres), uGlass);
        float a = mix(1.0, 0.03 + 0.5 * fres, uGlass) * uAlpha;
        gl_FragColor = vec4(col, a);
        #include <colorspace_fragment>
      }`,
  })
}

export function buildHead(toWorld, trunks, nerveEnd) {
  const group = new THREE.Group()
  const V = (x, y, z) => new THREE.Vector3(x, y, z)

  // ---- skin: depth first, then colour, so glass shows one clean surface
  const skin = ghostMaterial(0xcbb7a4, 0xa9c0e8)
  const depth = new THREE.MeshBasicMaterial({ colorWrite: false, transparent: true })
  const addSkin = (geo, at) => {
    for (const [m, order] of [[depth, 20], [skin, 21]]) {
      const mesh = new THREE.Mesh(geo, m); mesh.renderOrder = order
      if (at) mesh.position.copy(at)
      group.add(mesh)
    }
  }
  addSkin(headGeometry())
  addSkin(new THREE.CylinderGeometry(52, 60, 110, 48), V(0, -150, -98))
  for (const side of [-1, 1]) { const ear = new THREE.SphereGeometry(1, 24, 18); ear.scale(7, 30, 17); addSkin(ear, V(side * 76, -6, -92)) }

  // ---- brain, as a faint volume for context
  const brainGeo = new THREE.SphereGeometry(1, 48, 36); brainGeo.scale(66, 52, 82)
  const brainMat = ghostMaterial(0xd8a0a8, 0xe7a9b6); brainMat.depthWrite = false; brainMat.uniforms.uGlass.value = 1
  const brain = new THREE.Mesh(brainGeo, brainMat); brain.position.set(0, 38, -88); brain.renderOrder = 10
  group.add(brain)

  // ---- the fellow eye (left), kept simple
  const fellow = new THREE.Group(); fellow.position.set(32, 0, 0)
  const white = new THREE.SphereGeometry(12, 48, 32, 0, Math.PI * 2, 0.513, Math.PI - 0.513); white.rotateX(Math.PI / 2)
  fellow.add(new THREE.Mesh(white, new THREE.MeshStandardMaterial({ color: 0xece6da, roughness: 0.45 })))
  const iris = new THREE.Mesh(new THREE.CircleGeometry(5.95, 40), new THREE.MeshStandardMaterial({ color: 0x4f7391 })); iris.position.z = 9.55
  const pupil = new THREE.Mesh(new THREE.CircleGeometry(1.75, 32), new THREE.MeshBasicMaterial({ color: 0x050506 })); pupil.position.z = 9.6
  const cornea = new THREE.Mesh(new THREE.SphereGeometry(7.8, 40, 16, 0, Math.PI * 2, 0, 0.857), new THREE.MeshPhysicalMaterial({ color: 0xcfe8f0, roughness: 0.05, transparent: true, opacity: 0.3, depthWrite: false }))
  cornea.rotation.x = Math.PI / 2; cornea.position.z = 5.35
  fellow.add(iris, pupil, cornea)
  group.add(fellow)

  // ---- visual pathway
  const NERVE = new THREE.Color(0xf0d488), FADED = new THREE.Color(0x8d8f98)
  const start = toWorld(nerveEnd), along = toWorld([nerveEnd[0] + 7, 0.6, 0])
  const nervePts = side => {
    const s0 = side < 0 ? start.clone() : V(-start.x, start.y, start.z)
    const s1 = side < 0 ? along.clone() : V(-along.x, along.y, along.z)
    return [s0, s1, V(side * 14, 3, -40), V(side * 9.5, 6.5, -49), V(side * 2.5, 10, -60)]
  }
  const tractPts = side => [V(side * 2.5, 10, -64), V(side * 12, 9, -72), V(side * 24, 8, -84), V(side * 27, 8.5, -89)]
  const radPts = side => [V(side * 27, 8.5, -89), V(side * 37, 14, -110), V(side * 31, 22, -150), V(side * 13, 20, -170)]
  const nerveMat = {}
  const way = o => new THREE.MeshStandardMaterial({ roughness: 0.5, ...o })
  for (const side of [-1, 1]) {
    nerveMat[side] = way({ color: side < 0 ? 0xbdb5a7 : NERVE })
    const pts = nervePts(side)
    if (side > 0) pts.unshift(V(32 - 4.1, 0, -11.3)) // the fellow nerve starts at its own globe
    group.add(new THREE.Mesh(tube(curveOf(pts), 48, 12, side < 0 ? 2.4 : 2.2), nerveMat[side]))
    group.add(new THREE.Mesh(tube(curveOf(tractPts(side)), 40, 10, 1.9), way({ color: 0xe6cb84 })))
    group.add(new THREE.Mesh(tube(curveOf(radPts(side)), 48, 8, t => 1.4 + 2.2 * Math.sin(t * Math.PI)), way({ color: 0xd9c08a, transparent: true, opacity: 0.85 })))
    const lgn = new THREE.Mesh(new THREE.SphereGeometry(4, 20, 16), way({ color: 0xc79a6e })); lgn.position.copy(V(side * 27, 8.5, -89)); group.add(lgn)
    const cortex = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 18), way({ color: 0xe58fa0, roughness: 0.7 })); cortex.scale.set(11, 15, 7); cortex.position.copy(V(side * 11, 20, -166)); group.add(cortex)
  }
  const chiasm = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), way({ color: NERVE })); chiasm.scale.set(7, 2.4, 4.5); chiasm.position.set(0, 10, -62); group.add(chiasm)

  // signals: each eye feeds both halves of the brain
  const signals = []
  for (const eye of [-1, 1]) for (const side of [-1, 1]) {
    const pts = [...nervePts(eye), V(0, 10, -62), ...tractPts(side).slice(1), ...radPts(side).slice(1)]
    if (eye > 0) pts.unshift(V(32 - 4.1, 0, -11.3))
    const f = flow(curveOf(pts), 10, 3.6, eye < 0 ? 0xffd27a : 0x9fe0ff, 0x3a3c46)
    f.points.renderOrder = 15; f.mat.depthTest = false
    group.add(f.points); signals.push({ f, affected: eye < 0 })
  }

  // ---- arteries: internal carotid -> ophthalmic artery -> ciliary and central retinal arteries
  const art = new THREE.MeshStandardMaterial({ color: 0xd8372c, roughness: 0.5 })
  const artFlow = []
  const artery = (pts, r, dots) => {
    const c = curveOf(pts); group.add(new THREE.Mesh(tube(c, 40, 8, r), art))
    if (dots) { const f = flow(c, dots, r * 1.6, 0xffc9bb); f.points.renderOrder = 15; f.mat.depthTest = false; group.add(f.points); artFlow.push(f) }
  }
  artery([V(-12, -70, -66), V(-11, -30, -62), V(-11, -6, -60), V(-9.5, 5, -57), V(-12, 13, -54), V(-15, 20, -58)], 2.3, 14)
  const oph = [V(-9.8, 5, -57), V(-11.5, 2.5, -49), V(-16, 0.5, -42), V(-21.5, 2, -35), V(-22.5, 6, -29), V(-18, 8.5, -24)]
  artery(oph, 0.6, 12)
  artery([V(-21.5, 2, -35), V(-24.5, 2, -30), toWorld(trunks.lat)], 0.24, 6)
  artery([V(-19.5, 8, -25.5), V(-20, 4, -24.5), toWorld(trunks.med)], 0.24, 6)
  artery([V(-17.5, 0.8, -40), V(-21, -2.5, -32), toWorld([12.4, -3.6, -0.036])], 0.2, 6)

  // ---- the four straight muscles that turn the eye, for a sense of the socket
  const muscleMat = new THREE.MeshStandardMaterial({ color: 0x9c4b40, roughness: 0.8, transparent: true })
  const muscles = []
  for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
    const c = V(-32, 0, 0)
    const pts = [c.clone().add(V(dx * 11.4, dy * 11.4, 4.6)), c.clone().add(V(dx * 12.9, dy * 12.9, -2)), c.clone().add(V(dx * 11.5, dy * 11.5, -11)), V(-18 + dx * 5, 3 + dy * 5, -30), V(-13.5 + dx * 1.5, 3.5 + dy * 1.5, -41)]
    const m = new THREE.Mesh(tube(curveOf(pts), 40, 10, t => 0.5 + 2.3 * Math.sin(Math.min(1, t * 1.15) * Math.PI) ** 0.7), muscleMat)
    group.add(m); muscles.push(m)
  }

  return {
    group,
    update(s, dt, span) {
      muscleMat.opacity = 0.8 * (1 - s.clip) * smooth(17, 30, span); for (const m of muscles) m.visible = muscleMat.opacity > 0.02
      // span = how many millimetres the frame covers; hide head-scale markers once we are inside the eye
      for (const sig of signals) sig.f.points.visible = span > 110
      for (const f of artFlow) f.points.visible = span > 26
      skin.uniforms.uGlass.value = s.glass
      skin.uniforms.uAlpha.value = 1 - s.hideHead
      skin.depthWrite = s.glass < 0.02
      brainMat.uniforms.uAlpha.value = 0.5 * s.glass * (1 - s.hideHead)
      nerveMat[-1].color.set(0xbdb5a7).lerp(FADED, 0.4 * s.damage)
      for (const sig of signals) sig.f.advance(dt * 0.14, sig.affected ? 1 - 0.7 * s.damage : 1)
      for (const f of artFlow) f.advance(dt * 0.12)
    },
  }
}
