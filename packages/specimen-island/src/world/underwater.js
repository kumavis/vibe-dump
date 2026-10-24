import * as THREE from 'three'
import { clamp, lerp, smoothstep } from '../core/mathx.js'
import { softDot } from './textures.js'
import { SEA_TIERS, UNDERWATER } from '../data/sea.js'

// Below the surface. Whenever the camera dips under the sea the world is seen
// through water: a dense fog that thickens and darkens with depth, sunlight
// fading away, the surface overhead seen from beneath (a bright window of sky
// ringed by the mirror of the water outside it), caustics and sand ripples on
// the bed, shafts of light and drifting marine snow. Above the surface none of
// it draws and the only cost is one height test a frame.

const U = UNDERWATER

// The sea's waves, exactly as the water shader moves its vertices (water.js).
export const waveAt = (x, z, t) => Math.sin(x * 0.08 + t * 1.1) * 0.06 + Math.cos(z * 0.11 + t * 0.9) * 0.05

// What the water looks like `depth` m down at a given daylight (sky.light,
// 0.15 night .. 1 day): the fog density, how far the colour has gone from the
// shallow tone to the deep one, how bright it is, and the share of sunlight
// left. Pure, so the look can be tested without a renderer.
export function underwaterLook(depth, daylight, out = {}) {
  const d = Math.max(0, depth)
  const k = smoothstep(0, U.fog.at, d)
  out.density = lerp(U.fog.near, U.fog.deep, k)
  out.deep = k
  out.bright = lerp(U.night, 1, clamp((daylight - 0.15) / 0.85, 0, 1))
  out.light = Math.max(U.light.floor, Math.exp(-d / U.light.falloff))
  return out
}

const SHALLOW = new THREE.Color(U.shallow)
const DEEP = new THREE.Color(U.deep)
const BLACK = new THREE.Color(0x000000)
const _look = {}
const _v2 = new THREE.Vector2()
const _m = new THREE.Matrix4()
const _q = new THREE.Quaternion()
const _s = new THREE.Vector3()
const _p = new THREE.Vector3()

export class Underwater {
  // `terrain` is the terrain group (caustics go into its material), `water`
  // the water's uniforms (its clock drives the waves).
  constructor(G, { terrain, water }) {
    this.G = G
    this.waterClock = water.uniforms.uTime
    this.active = false
    this.depth = 0
    this.color = new THREE.Color()
    this.tier = SEA_TIERS.medium
    this.uniforms = {
      uTime: { value: 0 },
      uUnder: { value: 0 },
      uSea: { value: G.island.sea },
      uCaustics: { value: U.caustics.strength },
      uCam: { value: new THREE.Vector3() },
      uWater: { value: new THREE.Color() },
      uLight: { value: 1 },
    }
    this.group = new THREE.Group()
    this.group.name = 'underwater'
    this.group.visible = false
    G.scene.add(this.group)
    this.backdrop = this.buildBackdrop()
    this.surface = this.buildSurface()
    this.snow = this.buildSnow()
    this.rays = this.buildRays()
    const mat = terrain.children[0]?.material
    if (mat) this.addCaustics(mat)
    // its shaders, and the sea life's, compile ahead in the background the
    // first time someone boards the submersible, not on the first dive
    this.warmed = false
    G.events.on('vehicle:enter', ({ vehicle }) => {
      if (vehicle.kind === 'sub') this.warm()
    })
  }

  warm() {
    const G = this.G
    if (this.warmed || !G.renderer?.compileAsync) return
    this.warmed = true
    const show = [this.group, G.sealife?.group, G.sealife?.leviathan].filter(Boolean)
    const was = show.map((o) => o.visible)
    for (const o of show) o.visible = true
    G.renderer.compileAsync(G.scene, G.camera).catch(() => {})
    show.forEach((o, i) => (o.visible = was[i]))
  }

  setTier(tier) {
    this.tier = SEA_TIERS[tier] || SEA_TIERS.medium
    this.snow.geometry.setDrawRange(0, this.tier.snow)
    this.rays.count = this.tier.rays
    this.uniforms.uCaustics.value = this.tier.caustics ? U.caustics.strength : 0
  }

  // ------------------------------------------------------------ building

  // The underside of the sea: a sheet that follows the camera, facing down.
  // Looking up through it inside Snell's window you see the sky, bent and
  // rippling, with the sun in it; outside the window the surface is a mirror
  // of the water. It is fogged like everything else, so far off it is water.
  buildSurface() {
    const n = 48
    this.surfaceCell = U.surface.size / n
    const geo = new THREE.PlaneGeometry(U.surface.size, U.surface.size, n, n).rotateX(Math.PI / 2)
    const sky = this.G.sky.uniforms
    const mat = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog]),
      fog: true,
      vertexShader: `
        uniform float uTime;
        varying vec3 vWorld;
        #include <fog_pars_vertex>
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          wp.y += sin(wp.x * 0.08 + uTime * 1.1) * 0.06 + cos(wp.z * 0.11 + uTime * 0.9) * 0.05;
          vWorld = wp.xyz;
          vec4 mvPosition = viewMatrix * wp;
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uTop; uniform vec3 uHor; uniform vec3 uSunDir; uniform vec3 uSunCol;
        uniform vec3 uWater; uniform float uLight; uniform float uRipple; uniform float uMirror;
        varying vec3 vWorld;
        #include <fog_pars_fragment>
        float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float n2(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
          return mix(mix(h2(i), h2(i + vec2(1, 0)), f.x), mix(h2(i + vec2(0, 1)), h2(i + vec2(1, 1)), f.x), f.y); }
        void main() {
          vec3 V = normalize(vWorld - cameraPosition);
          vec2 p = vWorld.xz;
          float t = uTime;
          // ripples tilt the surface: the window's edge shivers, the sky in it
          // swims. They calm with distance, where they would only alias.
          vec2 g = (vec2(n2(p * 0.4 + t * 0.3), n2(p * 0.4 - t * 0.25 + 17.0)) - 0.5) * uRipple * 0.5
                 + (vec2(n2(p * 1.7 + t * 0.9), n2(p * 1.7 - t * 0.8 + 5.0)) - 0.5) * uRipple * 0.5;
          g /= 1.0 + length(vWorld - cameraPosition) * 0.04;
          vec3 N = normalize(vec3(g.x, -1.0, g.y));
          // Snell's window: inside the critical angle (cos 0.66 off the
          // vertical) the sky comes through, bent; outside it, total internal
          // reflection mirrors the water. A soft band, not a hard flip.
          float cosI = dot(V, -N);
          float win = smoothstep(0.63, 0.7, cosI);
          vec3 R = refract(V, N, 1.333);
          vec3 sky = uHor;
          if (dot(R, R) > 1e-4) {
            float y = clamp(R.y, 0.0, 1.0);
            sky = mix(uHor, uTop, pow(y, 0.55));
            float sd = max(dot(R, normalize(uSunDir)), 0.0);
            sky += uSunCol * (pow(sd, 400.0) * 6.0 + pow(sd, 18.0) * 0.5);
          }
          // the rim, where the light comes in at a grazing angle, burns bright
          vec3 col = mix(uWater * uMirror, sky * uLight, win) + win * (1.0 - smoothstep(0.66, 0.78, cosI)) * sky * uLight * 0.5;
          gl_FragColor = vec4(col, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }`,
    })
    Object.assign(mat.uniforms, {
      uTime: this.waterClock,
      uTop: sky.uTop,
      uHor: sky.uHor,
      uSunDir: sky.uSunDir,
      uSunCol: sky.uSunCol,
      uWater: this.uniforms.uWater,
      uLight: this.uniforms.uLight,
      uRipple: { value: U.surface.ripple },
      uMirror: { value: U.surface.mirror },
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.name = 'sea underside'
    mesh.frustumCulled = false
    this.group.add(mesh)
    return mesh
  }

  // What lies past the fog in every direction: the water's colour at the
  // horizon (exactly the fog's, so things fade into it), lighter towards the
  // surface and falling away to near-black below. It stands in for the sky.
  buildBackdrop() {
    const mat = new THREE.ShaderMaterial({
      uniforms: { uWater: this.uniforms.uWater },
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: false,
      fog: false,
      toneMapped: false,
      vertexShader: `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        uniform vec3 uWater;
        varying vec3 vDir;
        void main() {
          float y = normalize(vDir).y;
          vec3 col = uWater * (y < 0.0 ? mix(1.0, 0.3, smoothstep(0.0, 0.8, -y)) : mix(1.0, 1.45, smoothstep(0.0, 0.7, y)));
          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
        }`,
    })
    const dome = new THREE.Mesh(new THREE.SphereGeometry(500, 24, 12), mat)
    dome.renderOrder = -10
    dome.frustumCulled = false
    this.group.add(dome)
    return dome
  }

  // Marine snow: motes in a box that wraps round the camera, so there are
  // always some drifting past however far you go.
  buildSnow() {
    const n = SEA_TIERS.high.snow
    const L = U.snow.box
    const pos = new Float32Array(n * 3)
    for (let i = 0; i < n * 3; i++) pos[i] = Math.random() * L
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uCam: this.uniforms.uCam,
        uTime: this.uniforms.uTime,
        uMap: { value: softDot() },
        uScale: { value: 400 },
        uLight: this.uniforms.uLight,
        uWater: this.uniforms.uWater,
      },
      vertexShader: `
        uniform vec3 uCam; uniform float uTime; uniform float uScale;
        varying float vA;
        void main() {
          float L = ${L.toFixed(1)};
          vec3 drift = vec3(sin(uTime * 0.1 + position.y) * 0.4, -uTime * 0.12, cos(uTime * 0.08 + position.x) * 0.4);
          vec3 p = mod(position + drift - uCam + L * 0.5, L) - L * 0.5 + uCam;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          float d = length(p - uCam);
          vA = smoothstep(0.6, 2.0, d) * (1.0 - smoothstep(L * 0.3, L * 0.5, d));
          gl_PointSize = ${U.snow.size.toFixed(3)} * uScale / max(0.1, -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform sampler2D uMap; uniform float uLight; uniform vec3 uWater;
        varying float vA;
        void main() {
          float a = texture2D(uMap, gl_PointCoord).a * vA * 0.7;
          if (a < 0.01) discard;
          gl_FragColor = vec4(mix(uWater * 2.2, vec3(0.85, 0.9, 0.8), 0.5) * (0.35 + 0.65 * uLight), a);
        }`,
      transparent: true,
      depthWrite: false,
    })
    const pts = new THREE.Points(geo, mat)
    pts.frustumCulled = false
    pts.renderOrder = 4
    this.group.add(pts)
    return pts
  }

  // Shafts of sunlight hanging from the surface: tall soft quads round the
  // camera, turned to face it, added on top of the water. Each drifts with
  // the swell and is moved on once it falls behind or out of range.
  buildRays() {
    const R = U.rays
    const n = SEA_TIERS.high.rays
    const geo = new THREE.PlaneGeometry(1, 1).translate(0, -0.5, 0)
    const phase = new Float32Array(n)
    for (let i = 0; i < n; i++) phase[i] = Math.random()
    geo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phase, 1))
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: this.uniforms.uTime, uCam: this.uniforms.uCam, uStrength: { value: 0 }, uWater: this.uniforms.uWater },
      vertexShader: `
        attribute float aPhase;
        uniform vec3 uCam;
        varying vec2 vUv; varying float vPhase; varying float vDist;
        void main() {
          vUv = uv; vPhase = aPhase;
          vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0);
          vDist = length(wp.xyz - uCam);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }`,
      fragmentShader: `
        uniform float uTime; uniform float uStrength; uniform vec3 uWater;
        varying vec2 vUv; varying float vPhase; varying float vDist;
        void main() {
          float across = 1.0 - abs(vUv.x * 2.0 - 1.0);
          float a = across * across * smoothstep(0.0, 0.7, vUv.y) * (1.0 - smoothstep(0.96, 1.0, vUv.y));
          a *= 0.55 + 0.45 * sin(uTime * 0.6 + vPhase * 31.0 + vUv.x * 4.0);
          a *= smoothstep(4.0, 10.0, vDist) * (1.0 - smoothstep(22.0, 36.0, vDist));
          gl_FragColor = vec4(mix(uWater * 3.0, vec3(0.9, 1.0, 0.95), 0.6) * a * uStrength, 1.0);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })
    const mesh = new THREE.InstancedMesh(geo, mat, n)
    mesh.count = 0
    mesh.frustumCulled = false
    mesh.renderOrder = 6
    this.group.add(mesh)
    this.rayAt = Array.from({ length: n }, () => ({ x: 0, z: 0, w: 1, live: false }))
    return mesh
  }

  // Caustics and sand ripples on the seabed, in the terrain's own shader,
  // only while the camera is under water (uUnder).
  addCaustics(material) {
    const u = this.uniforms
    const prev = material.onBeforeCompile
    material.onBeforeCompile = (shader, renderer) => {
      prev?.call(material, shader, renderer)
      shader.uniforms.uUnder = u.uUnder
      shader.uniforms.uSeaTime = u.uTime
      shader.uniforms.uSea = u.uSea
      shader.uniforms.uCaustics = u.uCaustics
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>
          varying vec3 vSeaPos;`)
        .replace('#include <project_vertex>', `#include <project_vertex>
          vSeaPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`)
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>
          varying vec3 vSeaPos;
          uniform float uUnder; uniform float uSeaTime; uniform float uSea; uniform float uCaustics;
          // the classic tiling water-turbulence pattern: bright webs that crawl
          float caustic(vec2 p, float t) {
            vec2 i = p;
            float c = 1.0;
            for (int n = 0; n < 3; n++) {
              float tt = t * (1.0 - 3.5 / float(n + 1));
              i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
              c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / 0.005), p.y / (cos(i.y + tt) / 0.005)));
            }
            c /= 3.0;
            c = 1.17 - pow(c, 1.4);
            return pow(abs(c), 8.0);
          }`)
        .replace('#include <map_fragment>', `#include <map_fragment>
          float seaDepth = uSea - vSeaPos.y;
          if (uUnder > 0.5 && seaDepth > 0.5) {
            // ripples in the sand, crossing at a slant and wandering
            float rip = sin(dot(vSeaPos.xz, vec2(2.6, 1.3)) + sin(vSeaPos.x * 0.37 + vSeaPos.z * 0.21) * 3.0);
            diffuseColor.rgb *= 1.0 - ${U.caustics.ripples.toFixed(3)} * (rip * 0.5 + 0.5) * (1.0 - smoothstep(18.0, 30.0, seaDepth));
          }`)
        .replace('#include <opaque_fragment>', `
          if (uUnder > 0.5 && uCaustics > 0.0 && seaDepth > 0.3) {
            float ck = uCaustics * (1.0 - smoothstep(2.0, ${U.caustics.fade.toFixed(1)}, seaDepth)) * smoothstep(0.3, 1.5, seaDepth);
            vec2 cp = vSeaPos.xz * 0.16;
            float c = min(caustic(mod(cp, 6.2831853 * 4.0), uSeaTime * 0.45 + 23.0), 1.2);
            outgoingLight += diffuseColor.rgb * c * ck;
          }
          #include <opaque_fragment>`)
    }
  }

  // ------------------------------------------------------------ per frame

  // After the sky has set the day's fog and light, and before anything that
  // asks whether the camera is under water (vegetation, sea life, audio).
  update(dt, cam) {
    const G = this.G
    const sea = G.island.sea
    const surf = sea + waveAt(cam.x, cam.z, this.waterClock.value)
    // only the sea: a camera under the river or lake surface is not diving
    const under = cam.y < surf - 0.02 && G.island.waterAt(cam.x, cam.z) <= sea + 0.01
    this.uniforms.uTime.value += dt
    if (under !== this.active) {
      this.active = under
      this.group.visible = under
      this.uniforms.uUnder.value = under ? 1 : 0
      G.sky.dome.visible = !under
      G.veg?.setUnderwater(under)
      if (!under) G.renderer.setClearColor(BLACK, 1)
    }
    this.depth = under ? surf - cam.y : 0
    if (!under) return

    const look = underwaterLook(this.depth, G.sky.light, _look)
    const sky = G.sky
    // the water's colour: shallow to deep, dimmed by the night and the depth,
    // warmed a little by a low sun
    this.color.copy(SHALLOW).lerp(DEEP, look.deep).multiplyScalar(look.bright * lerp(0.55, 1, look.light))
    this.color.lerp(sky.sun.color, 0.06 * look.light * look.bright)
    G.scene.fog.color.copy(this.color)
    G.scene.fog.density = look.density
    G.renderer.setClearColor(this.color, 1)
    this.uniforms.uWater.value.copy(this.color)
    this.uniforms.uLight.value = look.light * look.bright
    // sunlight fades with depth; what is left is scattered blue-green
    sky.sun.intensity *= look.light
    sky.moon.intensity *= look.light
    sky.hemi.intensity *= lerp(0.6, 1, look.light)
    sky.hemi.color.lerp(this.color, 0.5)
    sky.hemi.groundColor.copy(this.color).multiplyScalar(0.6)

    // the sheet keeps up with the camera a whole cell at a time: centred on
    // it, one vertex would sit straight overhead, on the eye's own plane
    // whenever the view is level, and the cells round it would smear a hard
    // pale quad across the top of the view
    const cell = this.surfaceCell
    this.surface.position.set(Math.round(cam.x / cell) * cell, sea, Math.round(cam.z / cell) * cell)
    this.backdrop.position.copy(cam)
    this.uniforms.uCam.value.copy(cam)
    const h = G.renderer.getDrawingBufferSize(_v2).y
    this.snow.material.uniforms.uScale.value = h / (2 * Math.tan(THREE.MathUtils.degToRad(G.camera.fov / 2)))
    this.updateRays(dt, cam, look)
  }

  updateRays(dt, cam, look) {
    const R = U.rays
    const n = this.rays.count
    if (!n) return
    const sea = this.G.island.sea
    const yaw = this.G.camera.rotation.y
    const fx = -Math.sin(yaw)
    const fz = -Math.cos(yaw)
    this.rays.material.uniforms.uStrength.value = R.strength * look.light * look.bright * smoothstep(0.35, 0.6, this.G.sky.light)
    for (let i = 0; i < n; i++) {
      const r = this.rayAt[i]
      const dx = r.x - cam.x
      const dz = r.z - cam.z
      const d = Math.hypot(dx, dz)
      // fallen behind or out of range: hang it again somewhere ahead
      if (!r.live || d > R.range[1] + 6 || (d > 6 && (dx * fx + dz * fz) / d < -0.3)) {
        const a = Math.atan2(fz, fx) + (Math.random() - 0.5) * 2.2
        const rd = lerp(R.range[0], R.range[1], Math.random())
        r.x = cam.x + Math.cos(a) * rd
        r.z = cam.z + Math.sin(a) * rd
        r.w = lerp(R.width[0], R.width[1], Math.random())
        r.live = true
      }
      r.x += Math.sin(this.uniforms.uTime.value * 0.2 + i) * dt * 0.3
      _q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, Math.atan2(cam.x - r.x, cam.z - r.z))
      _m.compose(_p.set(r.x, sea, r.z), _q, _s.set(r.w, R.length, 1))
      this.rays.setMatrixAt(i, _m)
    }
    this.rays.instanceMatrix.needsUpdate = true
  }
}
