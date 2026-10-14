import { WEAPONS } from '../data/weapons.js'

// Dart arithmetic for the target readout and the journal, said in whole darts
// still to come — no '~' or '≈' that reads as a minus at HUD size, never a
// negative, and no knockout count once enough sedative is already on board.
// Counts assume body hits; head and neck carry more, legs and tail less.

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

// Darts of `dose` it takes to bring `have` units up to `line` (at least one).
export function dartsTo(line, have, dose) {
  return Math.max(1, Math.ceil((line - have) / dose - 1e-6))
}

// Target readout lines for a living animal: [{ text, warn }].
export function doseReadout(sed, state, sedative, pending) {
  const rifle = WEAPONS.rifle.dose
  const pistol = WEAPONS.pistol.dose
  const have = sedative + pending
  if (have >= sed.lethal) return [{ text: 'Lethal dose absorbing — it will not wake', warn: true }]
  const lines = []
  if (state === 'unconscious') lines.push({ text: 'Out cold — no more darts needed' })
  else if (have >= sed.ko) lines.push({ text: 'Enough sedative absorbing — wait' })
  else lines.push(knockout(sed, have, true))
  const odRifle = dartsTo(sed.lethal, have, rifle)
  const odPistol = dartsTo(sed.lethal, have, pistol)
  lines.push({
    text: `Overdose: ${plural(odRifle, 'more rifle dart')} (or ${odPistol} pistol)`,
    warn: odRifle <= 1,
  })
  return lines
}

// "Knockout: 2 more rifle darts (or 5 pistol)", or the pistol alone when a
// rifle dart that knocks it out would also kill it (a compy, say).
function knockout(sed, have, more) {
  const rifle = WEAPONS.rifle.dose
  const pistol = WEAPONS.pistol.dose
  const m = more ? 'more ' : ''
  const koRifle = dartsTo(sed.ko, have, rifle)
  const koPistol = dartsTo(sed.ko, have, pistol)
  const rifleSafe = koRifle < dartsTo(sed.lethal, have, rifle)
  const pistolSafe = koPistol < dartsTo(sed.lethal, have, pistol)
  if (rifleSafe) return { text: `Knockout: ${plural(koRifle, m + 'rifle dart')} (or ${koPistol} pistol)` }
  if (pistolSafe) return { text: `Knockout: ${plural(koPistol, m + 'pistol dart')}${more ? '; a rifle dart would overdose' : ' (a rifle dart overdoses)'}` }
  return { text: 'Too close to an overdose to dart safely', warn: true }
}

// Journal card: knockout and overdose for an animal with no sedative in it.
export function doseCard(sed) {
  const ko = knockout(sed, 0, false).text.replace('Knockout: ', '')
  const od = `${plural(dartsTo(sed.lethal, 0, WEAPONS.rifle.dose), 'rifle dart')} (or ${dartsTo(sed.lethal, 0, WEAPONS.pistol.dose)} pistol)`
  return { ko: `${ko} · ${sed.ko}u`, od: `${od} · ${sed.lethal}u` }
}
