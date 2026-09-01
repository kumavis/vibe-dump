import soundSystem from './sound-system.js'
import foodStand from './food-stand.js'
import shrine from './shrine.js'
import cabin from './cabin.js'

// The four modules, in the order the picker offers them. Each exports an id, a
// title, a tagline, and a build(ctx) that populates a Rig and returns the
// numbers the HUD reads back.
export const STATIONS = [soundSystem, foodStand, shrine, cabin]
