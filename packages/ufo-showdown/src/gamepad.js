// Xbox controllers (and any other pad the browser maps to the "standard"
// layout) through the Gamepad API.
//
// In flight a controller steers a ship: the left stick is analog, so a gentle
// push drifts and a full push races, and the D-pad works too. Everywhere else
// its buttons stand in for the keys the home screen, map, store and pause menu
// already understand, so none of them needs input code of its own.
//
// Controllers take players in the order the browser numbers them: the first
// flies Player 1, the second Player 2. The keyboard keeps working alongside.

// Button numbers in the standard layout.
const BUTTONS = { A: 0, B: 1, X: 2, Y: 3, LB: 4, RB: 5, VIEW: 8, START: 9 }
const DPAD = { UP: 12, DOWN: 13, LEFT: 14, RIGHT: 15 }

const DEAD = 0.25 // stick travel ignored around the centre (worn sticks drift)
const FLICK = 0.6 // how far the stick has to go to count as a menu press
const REPEAT_AFTER = 0.4 // a held direction repeats after this long…
const REPEAT_EVERY = 0.12 // …this often, like a held arrow key

const held = new Map() // controller index -> { name: seconds held } from the last poll

export function connectedPads() {
  let list = []
  try {
    list = navigator.getGamepads?.() ?? []
  } catch {
    // a frame that isn't allowed controllers throws instead of returning none
  }
  return [...list].filter((p) => p && p.connected)
}

const down = (pad, i) => !!pad.buttons[i]?.pressed

// Where controller `pad` is steering, as dx, dy in -1..1. The stick is scaled
// so the dead zone's edge reads as zero rather than a sudden jump.
export function padVector(pad) {
  let dx = 0
  let dy = 0
  const ax = pad.axes[0] ?? 0
  const ay = pad.axes[1] ?? 0
  const mag = Math.hypot(ax, ay)
  if (mag > DEAD) {
    const k = Math.min(1, (mag - DEAD) / (1 - DEAD)) / mag
    dx = ax * k
    dy = ay * k
  }
  if (down(pad, DPAD.LEFT)) dx = -1
  if (down(pad, DPAD.RIGHT)) dx = 1
  if (down(pad, DPAD.UP)) dy = -1
  if (down(pad, DPAD.DOWN)) dy = 1
  return { dx, dy }
}

// What each controller is holding right now, by name: the face and shoulder
// buttons, and the four directions from either the D-pad or a firm stick push.
function namesHeld(pad) {
  const out = []
  for (const name in BUTTONS) if (down(pad, BUTTONS[name])) out.push(name)
  const ax = pad.axes[0] ?? 0
  const ay = pad.axes[1] ?? 0
  if (down(pad, DPAD.UP) || ay < -FLICK) out.push('UP')
  if (down(pad, DPAD.DOWN) || ay > FLICK) out.push('DOWN')
  if (down(pad, DPAD.LEFT) || ax < -FLICK) out.push('LEFT')
  if (down(pad, DPAD.RIGHT) || ax > FLICK) out.push('RIGHT')
  return out
}

const DIRECTIONS = new Set(['UP', 'DOWN', 'LEFT', 'RIGHT'])

// Call once a frame. `onPress(name, padIndex, repeat)` runs for each button
// that went down since the last poll, and again on a timer for a held
// direction, so scrolling through a menu feels like holding an arrow key.
export function pollPads(dt, onPress) {
  const seen = new Set()
  for (const pad of connectedPads()) {
    seen.add(pad.index)
    const before = held.get(pad.index) ?? {}
    const now = {}
    for (const name of namesHeld(pad)) {
      const t = before[name]
      if (t === undefined) {
        now[name] = 0
        onPress(name, pad.index, false)
      } else {
        now[name] = t + dt
        if (DIRECTIONS.has(name) && t >= REPEAT_AFTER) {
          const was = Math.floor((t - REPEAT_AFTER) / REPEAT_EVERY)
          const is = Math.floor((now[name] - REPEAT_AFTER) / REPEAT_EVERY)
          if (is > was) onPress(name, pad.index, true)
        }
      }
    }
    held.set(pad.index, now)
  }
  for (const i of held.keys()) if (!seen.has(i)) held.delete(i)
}

// A short buzz on controllers that can (Xbox pads in Chromium-based browsers
// and Firefox). Strength 0..1, duration in ms. Silently does nothing elsewhere.
export function rumble(pads, strength, ms) {
  for (const pad of pads) {
    try {
      pad?.vibrationActuator?.playEffect?.('dual-rumble', {
        duration: ms,
        strongMagnitude: Math.min(1, strength),
        weakMagnitude: Math.min(1, strength * 0.6),
      })?.catch?.(() => {})
    } catch {
      // older vibration API, or none at all: no buzz
    }
  }
}
