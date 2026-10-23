// The bindings (ENGINEERING.md §8; R7 §4.12), and the lines the HUD shows on
// the briefing card and for the first three seconds of a moment. Never Ctrl
// (Ctrl+W closes the tab and a page cannot prevent it); Esc is the
// browser's own key for leaving pointer lock and full screen.

export const AIRCRAFT_KEYS = {
  pitchUp: ['KeyS', 'ArrowDown'],
  pitchDown: ['KeyW', 'ArrowUp'],
  rollLeft: ['KeyA', 'ArrowLeft'],
  rollRight: ['KeyD', 'ArrowRight'],
  yawLeft: ['KeyQ'],
  yawRight: ['KeyE'],
  throttleUp: ['KeyR', 'PageUp'],
  throttleDown: ['KeyF', 'PageDown'],
  guns: ['Space'],
  bomb: ['KeyB'],
  torpedo: ['KeyT'],
  camera: ['KeyC'],
  sight: ['KeyV'],
  time: ['KeyZ'],
  direct: ['KeyM'],
  units: ['KeyU'],
  release: ['Backspace'],
  station: ['Tab'],
}

export const SHIP_KEYS = {
  helmPort: ['KeyA', 'ArrowLeft'],
  helmStarboard: ['KeyD', 'ArrowRight'],
  telegraphUp: ['KeyW', 'ArrowUp'],
  telegraphDown: ['KeyS', 'ArrowDown'],
  torpedo: ['KeyT'],
  spread: ['KeyG'],
  aa: ['Space'],
  starshell: ['KeyL'],
  battery: ['KeyX'],
  camera: ['KeyC'],
  zoom: ['KeyZ'],
  faster: ['Equal', 'NumpadAdd'],
  slower: ['Minus', 'NumpadSubtract'],
  units: ['KeyU'],
  release: ['Backspace'],
  station: ['Tab'],
}

// ROUND-2 §4: the gun stations (the AA director, the gunner) aim with the mouse (relative in pointer lock, the
// pointer's offset from the centre as a rate without it) or a drag, and fire with the left button or Space held
export const GUN_KEYS = {
  fire: ['Space'],
  camera: ['KeyC'],
  zoom: ['KeyZ'],
  faster: ['Equal', 'NumpadAdd'],
  slower: ['Minus', 'NumpadSubtract'],
  units: ['KeyU'],
  release: ['Backspace'],
  station: ['Tab'],
}
// the bombardier: A/D or ←/→ steer the run-in (the pilot's director), B or Space releases the stick
export const BOMBARDIER_KEYS = {
  steerLeft: ['KeyA', 'ArrowLeft'],
  steerRight: ['KeyD', 'ArrowRight'],
  release: ['Backspace'],
  bomb: ['KeyB', 'Space'],
  camera: ['KeyC'],
  zoom: ['KeyZ'],
  faster: ['Equal', 'NumpadAdd'],
  slower: ['Minus', 'NumpadSubtract'],
  units: ['KeyU'],
  station: ['Tab'],
}

export const AIRCRAFT_HELP = `Mouse: the nose follows the pointer (M or right button: direct control)
W/S pitch · A/D roll · Q/E rudder · R/F throttle
Space or left button: guns · B bomb · T torpedo
C camera · V sight · Z time · U units · Backspace: release the controls`

export const SHIP_HELP = `A/D helm (it stays until countered) · W/S telegraph
Mouse lays the main battery; wheel ±100 m (Shift ±400 m); click: salvo, hold: fire when ready
T torpedoes · G narrow/wide spread · Space: the AA at the pointer's aircraft · L star shell
X battery · C camera · Z zoom · +/− time · U units · Backspace: release the controls`

export const TOUCH_HELP = 'Left: the stick (or the helm and telegraph) · right: fire and ordnance · the buttons: camera and time · release, twice: the controls back'

export const GUN_HELP = `Mouse aims the guns (with the pointer locked; else the pointer's offset turns them)
Left button or Space: fire · the pip leads the aimed aircraft
Tab: the next station · Backspace: release the controls`

export const BOMBARDIER_HELP = `A/D steer the run-in · B or Space: release the stick when the impact meets the target
Tab: the next station · Backspace: release the controls`

/** The first take's four lines (ROUND-2 §1.2: stick, throttle, fire or release, Backspace), once a kind (HUD.firstHints). */
export const HINTS = {
  aircraft: ['Stick: the mouse (the nose follows it) or W/S and A/D; let go and the wings level', 'Throttle: R and F', 'Fire: Space or the left button · release: B a bomb, T a torpedo, when the cue says so', 'Backspace twice gives the controls back'],
  ship: ['Helm: A and D (it stays until countered) · telegraph: W and S', 'Aim: the mouse lays the guns on the sea', 'Fire: a click · torpedoes: T · Tab: the next station', 'Backspace twice gives the controls back'],
  touch: ['Stick: the left pad (let go and the wings level), or the helm and telegraph sliders', 'Throttle: the slider beside it', 'Fire and release: the buttons on the right', 'Release, tapped twice, gives the controls back'],
}

export const HELM_STEPS = [-1, -0.5, 0, 0.5, 1]
// the telegraph's steps as levels (−1 full astern … 1 flank): back full, stop, one third, two thirds, standard, full, flank
export const TELEGRAPH_LEVELS = [-1, 0, 1 / 3 / 1.05, 2 / 3 / 1.05, 0.85 / 1.05, 1 / 1.05, 1]

export const matches = (map, action, code) => (map[action] || []).includes(code)
