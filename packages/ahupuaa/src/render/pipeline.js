// Frame structure: the scene renders linear HDR into a multisampled target that
// keeps its depth; the atmosphere pass (clouds, rain, rainbows) reads that depth
// at reduced resolution; the composite lays both together, adds aerial
// perspective, tone-maps, and writes sRGB to the screen.

import * as THREE from 'three'

const fullscreenVertex = /* glsl */ `
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

export function fullscreenTriangle() {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3))
  return g
}

const compositeFragment = /* glsl */ `
uniform sampler2D uScene;
uniform sampler2D uDepth;
uniform sampler2D uClouds;
uniform float uHasClouds;
uniform vec2 uCloudTexel;
uniform mat4 uInvProj;
uniform mat4 uCamWorld;
uniform vec3 uCamPos;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform vec3 uFogColor;
uniform float uFogDensity;
uniform float uFogFalloff;
uniform float uExposure;
uniform float uSaturation;
uniform float uNight;
uniform sampler2D uSkyMap;
in vec2 vUv;

vec3 skyMap(vec3 d) {
  float y = clamp(d.y, -1.0, 1.0);
  return texture(uSkyMap, vec2(atan(d.z, d.x) / 6.2831853 + 0.5, sign(y) * sqrt(abs(y)) * 0.5 + 0.5)).rgb;
}

vec3 aces(vec3 x) {
  // Narkowicz fit — punchy, keeps sunset colour
  const float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}
vec3 toSRGB(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

void main() {
  vec3 col = texture(uScene, vUv).rgb;
  float depth = texture(uDepth, vUv).r;
  vec4 ndc = vec4(vUv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
  vec4 view = uInvProj * ndc;
  view /= view.w;
  vec3 world = (uCamWorld * vec4(view.xyz, 1.0)).xyz;
  vec3 ray = world - uCamPos;
  float dist = length(ray);
  vec3 rd = ray / max(dist, 1e-4);
  if (depth < 1.0) {
    // exponential height fog, integrated along the view ray
    float b = uFogFalloff;
    float k = rd.y * b;
    float base = uFogDensity * exp(-max(uCamPos.y, 0.0) * b);
    float fog = abs(k) > 1e-5 ? base * (1.0 - exp(-dist * k)) / k : base * dist;
    fog = 1.0 - exp(-max(fog, 0.0));
    // the haze takes the colour of the sky just above the horizon behind it
    vec3 fogCol = skyMap(normalize(vec3(rd.x, 0.04 + max(rd.y, 0.0) * 0.5, rd.z)));
    col = mix(col, fogCol, fog);
  }
  if (uHasClouds > 0.5) {
    // a small tent blur hides the ray-march dither when upsampling
    vec2 e = uCloudTexel;
    vec4 c = texture(uClouds, vUv) * 0.36;
    c += texture(uClouds, vUv + vec2(e.x, e.y) * 0.9) * 0.16;
    c += texture(uClouds, vUv + vec2(-e.x, e.y) * 0.9) * 0.16;
    c += texture(uClouds, vUv + vec2(e.x, -e.y) * 0.9) * 0.16;
    c += texture(uClouds, vUv + vec2(-e.x, -e.y) * 0.9) * 0.16;
    col = col * c.a + c.rgb;
  }
  // by moonlight colour drains away and what's left goes blue
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(col, lum * vec3(0.6, 0.78, 1.18), uNight * 0.75);
  col *= uExposure;
  col = aces(col);
  float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(l), col, uSaturation);
  gl_FragColor = vec4(toSRGB(col), 1.0);
}
`

export class Pipeline {
  constructor(renderer) {
    this.renderer = renderer
    this.size = new THREE.Vector2()
    const hdr = renderer.extensions.has('EXT_color_buffer_float') || renderer.extensions.has('EXT_color_buffer_half_float')
    this.type = hdr ? THREE.HalfFloatType : THREE.UnsignedByteType
    this.sceneRT = new THREE.WebGLRenderTarget(1, 1, {
      type: this.type,
      samples: 4,
      depthBuffer: true,
    })
    this.sceneRT.depthTexture = new THREE.DepthTexture(1, 1, THREE.UnsignedIntType)
    this.quad = new THREE.Mesh(
      fullscreenTriangle(),
      new THREE.ShaderMaterial({
        vertexShader: fullscreenVertex,
        fragmentShader: compositeFragment,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uScene: { value: this.sceneRT.texture },
          uDepth: { value: this.sceneRT.depthTexture },
          uClouds: { value: null },
          uHasClouds: { value: 0 },
          uCloudTexel: { value: new THREE.Vector2() },
          uInvProj: { value: new THREE.Matrix4() },
          uCamWorld: { value: new THREE.Matrix4() },
          uCamPos: { value: new THREE.Vector3() },
          uSunDir: { value: new THREE.Vector3(0, 1, 0) },
          uSunColor: { value: new THREE.Color() },
          uFogColor: { value: new THREE.Color(0.6, 0.7, 0.8) },
          uFogDensity: { value: 0.0016 },
          uFogFalloff: { value: 0.045 },
          uExposure: { value: 0.55 },
          uSaturation: { value: 1.0 },
          uNight: { value: 0 },
          uSkyMap: { value: null },
        },
      }),
    )
    this.quad.frustumCulled = false
    this.quadScene = new THREE.Scene()
    this.quadScene.add(this.quad)
    this.quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this.atmosphere = null
  }

  get uniforms() {
    return this.quad.material.uniforms
  }

  setSize(w, h, dpr) {
    this.size.set(Math.floor(w * dpr), Math.floor(h * dpr))
    this.sceneRT.setSize(this.size.x, this.size.y)
    this.atmosphere?.setSize(this.size.x, this.size.y)
  }

  render(scene, camera) {
    const r = this.renderer
    r.setRenderTarget(this.sceneRT)
    r.render(scene, camera)
    const u = this.uniforms
    u.uInvProj.value.copy(camera.projectionMatrixInverse)
    u.uCamWorld.value.copy(camera.matrixWorld)
    u.uCamPos.value.copy(camera.position)
    if (this.atmosphere) {
      this.atmosphere.render(r, camera, this.sceneRT.depthTexture)
      u.uClouds.value = this.atmosphere.texture
      u.uCloudTexel.value.set(1 / this.atmosphere.rt.width, 1 / this.atmosphere.rt.height)
      u.uHasClouds.value = 1
    } else {
      u.uHasClouds.value = 0
    }
    r.setRenderTarget(null)
    r.render(this.quadScene, this.quadCam)
  }
}
