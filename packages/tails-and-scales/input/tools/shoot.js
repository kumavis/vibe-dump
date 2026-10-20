// The shooting tool (DESIGN §2.5): a unit picked up in its seat's shooting
// phase, the pointer over an enemy shows the shot's odds (or why it can't
// shoot it), and a click on it is { t: 'shoot', u, tg } (the match judges
// it: in range, in sight).
import { oddsText } from '../../ui/tooltip.js'

// Inside the caller's preview: what unit `sel` shooting `target` would do.
export function preview(G, q, sel, target) {
  const info = q.shotInfo(G, sel, target)
  return info.ok ? oddsText(sel, target, info) : `✖ ${info.why}`
}

// the command
export const shootAt = (u, tg) => ({ t: 'shoot', u: u.id, tg: tg.id })
