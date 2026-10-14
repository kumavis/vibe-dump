// PLACEHOLDER content pack — replaced by the race work. See ../README.md.
import { drawSaucer } from '../../art.js'

export default {
  levels: {
    race: {
      update(g) {
        if (g.phase === 'main' && g.phaseT > 3) g.levelDone()
      },
      progress: (g) => Math.min(1, g.phaseT / 3),
    },
  },

  enemies: {},
}
