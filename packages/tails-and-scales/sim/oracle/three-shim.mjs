// three.js with a renderer that draws nothing, for running main.js in Node.
// Everything else (maths, geometry, scene graph) is the real library.
export * from 'three'
export class WebGLRenderer {
  constructor() {
    this.domElement = globalThis.document.createElement('canvas')
    this.shadowMap = {}
    this.capabilities = { getMaxAnisotropy: () => 1 }
    this.info = { render: {} }
  }
  setPixelRatio() {}
  setSize() {}
  render() {}
}
