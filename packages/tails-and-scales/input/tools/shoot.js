// The shooting tool (DESIGN §2.5): a unit picked up in its seat's shooting
// phase, the pointer over an enemy shows the shot's odds (or why it can't
// shoot it), and a click on it is { t: 'shoot', u, tg } (the match judges
// it: in range, in sight). (V3c) A caster casts the spell its player has
// picked (`sp`, input/human.js's spell: the AI's pick until another is
// picked), at an enemy, or for a spell cast on a friend at a friend or
// itself: { t: 'shoot', u, tg, sp }.
import { oddsText } from '../../ui/tooltip.js'

// Inside the caller's preview: what unit `sel` shooting (or casting spell
// `sp` on) `target` would do.
export function preview(G, q, sel, target, sp) {
  const info = q.shotInfo(G, sel, target, sp)
  return info.ok ? oddsText(sel, target, info, sp) : `✖ ${info.why}`
}

// the command
export const shootAt = (u, tg, sp) => (sp === undefined ? { t: 'shoot', u: u.id, tg: tg.id } : { t: 'shoot', u: u.id, tg: tg.id, sp })
