import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Cast gold.
//
// A stock MeshStandardMaterial with metalness 1 and a punchy environment gets
// most of the way there, but the large flat faces of the triangle still render
// as one unbroken tone. The fix is a procedural roughness breakup: a couple of
// octaves of value noise over the object's own coordinates, nudging the
// roughness a few points either way.
//
// Roughness is the cheap knob to turn — it costs three hashes per fragment and
// no extra varyings beyond the local position, but because roughness selects
// the PMREM mip, a small wobble in it pulls visibly different parts of the
// environment into neighbouring pixels. That is exactly the mottling a sand-cast
// surface has, and it is what stops the gold reading as orange plastic.
// ---------------------------------------------------------------------------

const NOISE = /* glsl */ `
float mHash( vec3 p ) {
  p = fract( p * 0.3183099 + vec3( 0.1, 0.2, 0.3 ) );
  p *= 17.0;
  return fract( p.x * p.y * p.z * ( p.x + p.y + p.z ) );
}
float mNoise( vec3 x ) {
  vec3 i = floor( x );
  vec3 f = fract( x );
  f = f * f * ( 3.0 - 2.0 * f );
  return mix(
    mix( mix( mHash( i + vec3(0,0,0) ), mHash( i + vec3(1,0,0) ), f.x ),
         mix( mHash( i + vec3(0,1,0) ), mHash( i + vec3(1,1,0) ), f.x ), f.y ),
    mix( mix( mHash( i + vec3(0,0,1) ), mHash( i + vec3(1,0,1) ), f.x ),
         mix( mHash( i + vec3(0,1,1) ), mHash( i + vec3(1,1,1) ), f.x ), f.y ), f.z );
}
`

export function castMetal(params, { grain = 0.16, grainScale = 5.5, rings = 0, ringFreq = 55 } = {}) {
  const material = new THREE.MeshStandardMaterial({ metalness: 1.0, ...params })

  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vCastPos;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvCastPos = position;')
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vCastPos;\n${NOISE}`)
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
        float castG = mNoise( vCastPos * ${grainScale.toFixed(2)} ) * 0.65
                    + mNoise( vCastPos * ${(grainScale * 3.7).toFixed(2)} ) * 0.35;
        roughnessFactor = clamp( roughnessFactor + ( castG - 0.5 ) * ${grain.toFixed(3)}, 0.02, 1.0 );
        ${
          rings
            ? `// Concentric machining marks about the piece's own axis, so the
        // specular smears AROUND the bezel the way a turned face does.
        roughnessFactor = clamp( roughnessFactor + sin( length( vCastPos.xy ) * ${ringFreq.toFixed(1)} ) * ${rings.toFixed(3)}, 0.02, 1.0 );`
            : ''
        }`
      )
  }

  return material
}
