import path from 'node:path'
import { fileURLToPath } from 'node:url'

// ---------------------------------------------------------------------------
// Driving the turntable page from Playwright
//
// Against a `vite build` + `vite preview` snapshot, never the dev server: HMR
// reloading the page halfway through a capture run has already cost one
// debugging session, and a contact sheet whose tiles came from two different
// builds is worse than no contact sheet.
//
// Nothing here reaches into the turntable's internals. It clicks the same
// buttons a person would and reads back the handles `window.spaceGoblin`
// already publishes, so the tool cannot drift into testing a private path that
// the shipped UI does not use.
// ---------------------------------------------------------------------------

export const PKG_DIR = path.resolve(fileURLToPath(new URL('../..', import.meta.url)))

export const CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

/** The presets `turntable/index.html` offers, in the order the nav lists them. */
export const ALL_VIEWS = ['q34', 'front', 'left', 'back', 'head', 'hands']
export const ALL_CLIPS = ['run', 'idle', 'combo']

/**
 * The one console error every run produces and nobody can fix from here.
 *
 * Neither page declares a favicon, so Chromium asks for `/favicon.ico` on its
 * own and `vite preview` 404s it. That fetch is made by the browser rather than
 * by the page, so it never appears as a Playwright request or response and
 * cannot be matched by URL or served by a route — text is the only handle. It
 * is filtered rather than tolerated because a tool that always prints one
 * harmless error is a tool whose error line people learn to skip.
 */
const BENIGN = /Failed to load resource.*status of 404/

/**
 * A frame counter injected before the page's own script runs.
 *
 * Settling has to be counted in rendered frames, not in milliseconds: the
 * verlet solver advances once per `requestAnimationFrame`, so under a software
 * rasteriser (which is what headless Chromium is here) a wall-clock wait buys a
 * tenth of the simulation a wall-clock wait on a GPU would.
 */
export const FRAME_COUNTER = () => {
  window.__frames = 0
  const tick = () => {
    window.__frames++
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

/** Wait for `n` rendered frames, or give up loudly rather than hanging. */
export async function settle(page, n, { timeoutMs = 30000 } = {}) {
  if (n <= 0) return
  const got = await page.evaluate(
    ({ n, timeoutMs }) =>
      new Promise((resolve) => {
        const start = window.__frames
        const deadline = performance.now() + timeoutMs
        const check = () => {
          if (window.__frames - start >= n || performance.now() > deadline) {
            resolve(window.__frames - start)
            return
          }
          requestAnimationFrame(check)
        }
        requestAnimationFrame(check)
      }),
    { n, timeoutMs },
  )
  if (got < n) throw new Error(`only ${got}/${n} frames rendered in ${timeoutMs} ms — page stalled?`)
}

/**
 * Open the turntable, wait for the goblin to finish building, and put the page
 * into the one state every capture starts from: turntable spin OFF (a spinning
 * camera makes every tile a different angle from the one its caption claims),
 * compass ON, overlays off.
 */
export async function openTurntable(browser, url, { width, height }) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
  const consoleErrors = []
  // Console errors alone say "404" and nothing else, which is useless. Record
  // what actually failed alongside them.
  page.on('response', (r) => {
    if (r.status() >= 400) consoleErrors.push(`HTTP ${r.status()} ${r.url()}`)
  })
  page.on('requestfailed', (r) => consoleErrors.push(`request failed ${r.url()}`))
  page.on('console', (m) => m.type() === 'error' && !BENIGN.test(m.text()) && consoleErrors.push(m.text()))
  page.on('pageerror', (e) => consoleErrors.push(String(e)))
  await page.addInitScript(FRAME_COUNTER)
  await page.goto(url, { waitUntil: 'load', timeout: 60000 })
  await page.waitForFunction(() => window.spaceGoblin?.goblin, null, { timeout: 120000 })
  // The boot card fades over 700 ms and then removes itself. Screenshotting
  // through it would put a progress bar in the middle of every tile.
  await page.waitForSelector('#boot', { state: 'detached', timeout: 30000 })
  await page.evaluate(STATE_READER)
  await page.evaluate(() => {
    const spin = document.getElementById('btn-spin')
    if (spin.classList.contains('on')) spin.click()
    window.spaceGoblin.debug.compass(true)
    window.spaceGoblin.debug.sockets(false)
    window.spaceGoblin.debug.trails(false)
  })
  await settle(page, 10)
  page.__consoleErrors = consoleErrors
  return page
}

export async function setClip(page, clip) {
  await page.evaluate((clip) => {
    document.querySelector(`#clips button[data-clip="${clip}"]`).click()
  }, clip)
}

/**
 * Park the clip at `fraction` of its duration.
 *
 * Driven through the scrub slider rather than by poking `clipTime`, because the
 * slider's handler is also what pauses playback and clears the trails — a pose
 * set any other way would be a pose the UI can never actually show you.
 */
export async function setPhase(page, fraction) {
  await page.evaluate((fraction) => {
    const scrub = document.getElementById('scrub')
    scrub.value = String(Math.round(fraction * 1000))
    scrub.dispatchEvent(new Event('input', { bubbles: true }))
  }, fraction)
}

/**
 * Does scrubbing actually move the pose?
 *
 * It does not, on the build this was written against, and the whole point of a
 * contact sheet is that it samples phases — so this is checked rather than
 * assumed. `AnimationMixer.setTime(t)` zeroes every action's time and then
 * calls `update(t)`, and `update` opens with `deltaTime *= this.timeScale`.
 * `frameLoop` sets `mixer.timeScale = 0` while paused, so from the second
 * paused frame onward `setTime` is "rewind to 0, then advance by 0" and the
 * figure is pinned to frame 0 of the clip no matter where the slider is.
 *
 * Returns { works, times } with the action time observed at three scrub
 * positions, so the caller can report a measurement rather than a claim.
 */
export async function probeScrub(page) {
  const times = []
  for (const f of [0.2, 0.55, 0.85]) {
    await setPhase(page, f)
    await settle(page, 3)
    times.push(await page.evaluate(() => window.spaceGoblin.goblin.actions[
      document.querySelector('#clips button.on').dataset.clip
    ].time))
  }
  const spread = Math.max(...times) - Math.min(...times)
  return { works: spread > 1e-4, times, spread }
}

/**
 * Force `setTime` to work regardless of `timeScale`.
 *
 * This is a shim over an app bug, so it announces itself: the caller stamps
 * PHASE SHIM into every sheet it produces. A debug tool that silently repairs
 * the thing it is meant to be inspecting is how you end up with a green sheet
 * and a broken slider.
 */
export async function installPhaseShim(page) {
  await page.evaluate(() => {
    const mixer = window.spaceGoblin.goblin.mixer
    if (mixer.__phaseShim) return
    const original = Object.getPrototypeOf(mixer).setTime
    mixer.setTime = function (t) {
      const held = this.timeScale
      this.timeScale = 1
      try {
        return original.call(this, t)
      } finally {
        this.timeScale = held
      }
    }
    mixer.__phaseShim = true
  })
}

export async function setView(page, view) {
  await page.evaluate((view) => {
    document.querySelector(`#views button[data-view="${view}"]`).click()
  }, view)
}

export async function setPlaying(page, want) {
  await page.evaluate((want) => {
    const btn = document.getElementById('btn-play')
    const playing = btn.textContent !== '▶'
    if (playing !== want) btn.click()
  }, want)
}

export async function setOverlays(page, { sockets = false, trails = false } = {}) {
  await page.evaluate(
    ({ sockets, trails }) => {
      window.spaceGoblin.debug.sockets(sockets)
      window.spaceGoblin.debug.trails(trails)
    },
    { sockets, trails },
  )
}

/**
 * Point the camera at `view`, let one frame render, and bring back the pixels
 * and the caption in a single round trip.
 *
 * The three obvious calls — click the button, grab the canvas, read the state —
 * used to be three `page.evaluate`s, and each one blocks until the frame that
 * is already running finishes its JS. At 310 ms a frame that is most of a
 * second of pure waiting per tile, on a tool whose whole budget is two minutes.
 * One round trip costs one frame.
 *
 * The grab happens inside a `requestAnimationFrame` callback, which is what
 * makes it legal at all: the app re-registers its own loop at the *top* of its
 * callback, so a callback registered now runs after this frame's render, while
 * the drawing buffer is still intact — no `preserveDrawingBuffer` needed. The
 * compass is a second canvas and is composited in at the position and size it
 * occupies on screen, so the tile looks like the page it came from.
 */
export async function captureTile(page, view) {
  return page.evaluate(async (view) => {
    if (view) document.querySelector(`#views button[data-view="${view}"]`).click()
    const base64 = await new Promise((resolve) => {
      requestAnimationFrame(() => {
        const gl = document.querySelector('#app canvas')
        const compass = document.getElementById('compass')
        const c = document.createElement('canvas')
        c.width = gl.width
        c.height = gl.height
        const g = c.getContext('2d')
        g.drawImage(gl, 0, 0)
        const cw = compass.clientWidth || 208
        const ch = compass.clientHeight || 220
        g.drawImage(compass, c.width - cw - 20, c.height - ch - 20, cw, ch)
        const url = c.toDataURL('image/png')
        resolve(url.slice(url.indexOf(',') + 1))
      })
    })
    return { base64, state: window.__readTurntableState() }
  }, view ?? null)
}

/** Everything the caption strip needs, read out of the live page. */
export async function readState(page) {
  return page.evaluate(() => window.__readTurntableState())
}

/**
 * Installed once, so `captureTile` can read the caption in the same round trip
 * as the pixels instead of paying another frame for it.
 */
export const STATE_READER = () => {
  window.__readTurntableState = () => {
    const scrub = document.getElementById('scrub')
    const clip = document.querySelector('#clips button.on')?.dataset.clip ?? '?'
    const duration = window.spaceGoblin.goblin.actions[clip].getClip().duration
    const fraction = Number(scrub.value) / 1000
    const floor = window.spaceGoblin.debug.floorMin
    return {
      clip,
      view: document.querySelector('#views button.on')?.dataset.view ?? '?',
      viewLabel: document.querySelector('#views button.on')?.textContent ?? '?',
      duration,
      fraction,
      time: fraction * duration,
      sockets: window.spaceGoblin.debug.socketErrors(),
      floor: {
        L: Number.isFinite(floor.L) ? floor.L : null,
        R: Number.isFinite(floor.R) ? floor.R : null,
      },
    }
  }
}
