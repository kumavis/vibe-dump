import * as THREE from 'three'

/** A renderer + scene + camera bound to a container, with HTML labels. */
export function createStage(el, { fov = 40, minAspect = 1.3, bg = 0x0b0e14 } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(bg)
  el.appendChild(renderer.domElement)
  const layer = document.createElement('div')
  layer.className = 'labels'
  el.appendChild(layer)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100)
  const labels = []
  let w = 0, h = 0

  function resize() {
    w = el.clientWidth; h = el.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    const aspect = w / h
    camera.aspect = aspect
    // Keep the horizontal field of view once the frame gets narrower than
    // minAspect, so portrait phones still see the whole subject.
    camera.fov = aspect >= minAspect ? fov
      : THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(fov) / 2) * minAspect / aspect))
    camera.updateProjectionMatrix()
  }
  new ResizeObserver(resize).observe(el)
  resize()

  const v = new THREE.Vector3()
  function render() {
    if (!w || !h) return
    renderer.render(scene, camera)
    for (const l of labels) {
      v.copy(l.pos)
      if (l.parent) v.applyMatrix4(l.parent.matrixWorld) // label rides on a moving object
      v.project(camera)
      const show = l.opacity > 0.02 && v.z < 1
      l.el.style.opacity = show ? l.opacity : 0
      if (show) {
        // keep the whole label inside the frame
        const half = l.el.offsetWidth / 2 + 4
        const x = Math.min(Math.max((v.x * 0.5 + 0.5) * w, half), Math.max(half, w - half))
        l.el.style.transform = `translate(${x}px, ${(-v.y * 0.5 + 0.5) * h}px) translate(-50%, -50%)`
      }
    }
  }

  function addLabel(text, pos, cls = '', parent = null) {
    const d = document.createElement('div')
    d.className = 'label ' + cls
    d.textContent = text
    layer.appendChild(d)
    const l = { el: d, pos: pos.clone(), opacity: 1, parent }
    labels.push(l)
    return l
  }

  return { el, renderer, scene, camera, render, addLabel }
}

/** Beads of blood travelling along a curve; `advance(dt * speed)` moves them. */
export function flowDots(curve, count, { size = 0.1, color = 0xff5a4d } = {}) {
  const pos = new Float32Array(count * 3)
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const mat = new THREE.PointsMaterial({ size, color, sizeAttenuation: true, transparent: true, depthWrite: false })
  const points = new THREE.Points(geo, mat)
  points.frustumCulled = false
  let phase = Math.random()
  const p = new THREE.Vector3()
  const live = new THREE.Color(color), stalled = new THREE.Color(0x4a1a22)
  return {
    points,
    advance(d, health = 1) {
      phase = (phase + d) % 1
      for (let i = 0; i < count; i++) {
        curve.getPointAt((i / count + phase) % 1, p)
        pos[i * 3] = p.x; pos[i * 3 + 1] = p.y; pos[i * 3 + 2] = p.z
      }
      geo.attributes.position.needsUpdate = true
      mat.color.copy(stalled).lerp(live, health)
    },
  }
}

export const lerp = (a, b, k) => a + (b - a) * k
export const smooth = (a, b, x) => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return k * k * (3 - 2 * k)
}
