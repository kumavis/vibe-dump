// Entry. The CHIMERA engine (wasm) must be up before anything imports chimera/wasm/engine.ts (it
// reads the engine's catalogue at import time), so the app is a dynamic import after initChimera().
import './style.css'
import { initChimera } from '../chimera/wasm/chimera.ts'
import { mulberry32 } from './kit/ease.js'

const q = new URLSearchParams(location.search)
const params = Object.fromEntries(q.entries())
params.freeze = q.get('freeze') === '1' || q.get('freeze') === 'true'
params.autostart = q.get('autostart') === '1'
params.mute = q.get('mute') === '1'

// frozen frames are reproducible: the vendored renderer's particles, blinks and glances use Math.random
if (params.freeze) Math.random = mulberry32(0x1a7e)

/** the Hershey vector font (and Archivo for anything it lacks), by URLs relative to the page */
async function loadFonts() {
  const at = (f) => `url(${new URL(`fonts/${f}`, document.baseURI).href})`
  const faces = [
    new FontFace('Hershey', at('AVHersheySimplexLight.otf'), { weight: '100 400' }),
    new FontFace('Hershey', at('AVHersheySimplexMedium.otf'), { weight: '401 900' }),
    new FontFace('Archivo', at('archivo-latin.woff2'), { weight: '100 900' }),
  ]
  await Promise.all(faces.map((f) => f.load().then((ff) => document.fonts.add(ff)).catch((e) => console.warn('font', e))))
}

async function boot() {
  const msg = document.getElementById('boot')
  try {
    await Promise.all([initChimera(), loadFonts()])
    const { startApp } = await import('./app.js')
    await startApp(params)
    msg.remove()
  } catch (err) {
    console.error(err)
    msg.textContent = `THE SHOW COULD NOT START: ${err instanceof Error ? err.message : String(err)}`
    msg.classList.add('error')
    const retry = document.createElement('button')
    retry.textContent = 'TRY AGAIN'
    retry.onclick = () => location.reload()
    msg.append(retry)
  }
}
boot()
