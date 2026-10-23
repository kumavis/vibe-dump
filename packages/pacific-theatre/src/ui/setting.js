// The setting (ROUND-2.md §1.2, §2): Assisted or Pilot, the only thing the
// browser keeps, as localStorage `pt.assist`. App reads it at boot and
// writes it through app.setAssist (src/app.js); the dev page ui.html uses
// the same two functions. A browser that keeps nothing (a private window,
// storage blocked or throwing) flies Assisted.

/** The setting's values (tools/check/ids.json vocab.assist) and where the browser keeps it. */
export const ASSIST_VALUES = ['assisted', 'pilot']
export const ASSIST_KEY = 'pt.assist'

/** The kept setting, or 'assisted' (none kept, or storage that throws). */
export function loadAssist(storage = globalThis.localStorage) {
  try {
    const v = storage?.getItem(ASSIST_KEY)
    return ASSIST_VALUES.includes(v) ? v : 'assisted'
  } catch {
    return 'assisted'
  }
}

/** Keep the setting; false where the browser keeps nothing. */
export function saveAssist(v, storage = globalThis.localStorage) {
  if (!ASSIST_VALUES.includes(v)) return false
  try {
    storage?.setItem(ASSIST_KEY, v)
    return true
  } catch {
    return false
  }
}
