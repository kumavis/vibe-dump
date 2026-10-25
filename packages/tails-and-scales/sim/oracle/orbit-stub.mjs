// OrbitControls without a pointer: the camera just looks at its target.
import { Vector3 } from 'three'
export class OrbitControls {
  constructor(camera) { this.object = camera; this.target = new Vector3() }
  update() { this.object.lookAt(this.target) }
}
