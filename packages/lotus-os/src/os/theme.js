// theme.js — the settings store.
//
// One flat object of preferences, persisted where possible, with a subscribe()
// so the app bar, the wallpaper and (once it exists) the 3D room can all react
// to the same switch. Dark is the default and the point; light is the same
// building at noon.

const KEY = 'lotus-os.prefs.v1'

export const ACCENTS = {
  amethyst: { label: 'Amethyst', hue: 276, note: 'House purple. Gold on black lacquer.' },
  orchid: { label: 'Orchid', hue: 310, note: 'Hotter. Pushes toward the neon in the room.' },
  indigo: { label: 'Indigo', hue: 248, note: 'Cooler and quieter; more night, less shrine.' },
  jade: { label: 'Jade', hue: 158, note: 'Roof-tile green. Gold still holds it together.' },
}

const DEFAULTS = {
  theme: 'dark', // 'dark' | 'light'
  accent: 'amethyst',
  ornament: true, // wallpaper lattice + window corner marks
  scanlines: true, // only ever visible once the screen is inside the monitor
  sound: false, // off until asked for; nobody wants a surprise beep
  motion: 'full', // 'full' | 'reduced'
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...DEFAULTS }
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULTS }
  }
}

function save(prefs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs))
  } catch {
    /* private window, blocked storage — the OS still runs, it just forgets */
  }
}

export function createPrefs(rootEl) {
  let state = load()
  const listeners = new Set()

  function apply() {
    rootEl.dataset.theme = state.theme
    rootEl.dataset.accent = state.accent
    rootEl.classList.toggle('no-ornament', !state.ornament)
    rootEl.classList.toggle('no-scanlines', !state.scanlines)
    rootEl.classList.toggle('reduced-motion', state.motion === 'reduced')
    rootEl.style.setProperty('--accent-hue', String(ACCENTS[state.accent]?.hue ?? ACCENTS.amethyst.hue))
  }

  function emit(changed) {
    for (const fn of listeners) {
      try {
        fn(state, changed)
      } catch (err) {
        console.warn('prefs listener failed', err)
      }
    }
  }

  apply()

  return {
    get value() {
      return state
    },
    get(key) {
      return state[key]
    },
    set(key, val) {
      if (state[key] === val) return
      state = { ...state, [key]: val }
      save(state)
      apply()
      emit(key)
    },
    toggle(key) {
      this.set(key, !state[key])
    },
    toggleTheme() {
      this.set('theme', state.theme === 'dark' ? 'light' : 'dark')
    },
    reset() {
      state = { ...DEFAULTS }
      save(state)
      apply()
      emit('*')
    },
    subscribe(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
  }
}
