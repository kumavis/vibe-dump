import { WEAPONS, ZONES } from '../data/weapons.js'
import { absorb } from '../actors/vitals.js'

// Dart arithmetic for the target readout and the journal, said in whole darts
// still to come — no '~' or '≈' that reads as a minus at HUD size, never a
// negative, and no knockout count once enough sedative is already on board.
//
// Every verdict runs the animal's own sedation model forward (absorb() in
// actors/vitals.js). Sedative keeps clearing while a dart is still soaking in,
// so darts that add up to the knockout line on paper peak below it: "wait" and
// "fatal" are only said of a dose whose projected peak crosses the line, and
// the knockout counts fire darts at a steady pace until it does.
//
// Counts assume body hits (leg hits on an animal whose body is armoured). The
// zone under the crosshair adds a warning when one dart there would overdose.
//
// With a melee syringe in hand (data/weapons.js kind 'melee') the same
// verdicts are said in jabs: the same simulation, its whole-cartridge dose and
// its own cadence.

const STEP = 1 / 60 // integration step: one frame, as the game runs it
const MAX = 99 // darts before a count gives up
// The game integrates at its frame rate, which moves a peak by up to ~0.07% of
// the line between 20 and 240 fps: knockouts are promised a hair above the
// line and overdoses warned of a hair below it.
const TOL = 0.001
const koLine = (sed) => sed.ko * (1 + TOL)
const odLine = (sed) => sed.lethal * (1 - TOL)

// A steady rate of fire: each dart's share of emptying a magazine and
// reloading it (player/weapons.js starts the reload 0.35 s after the last).
// A syringe seats a fresh cartridge after every jab that lands, and the next
// one lands `thrust` into its swing.
const pace = (w) => (w.kind === 'melee' ? w.thrust + Math.max(w.recover, 0.35 + w.reload) : (w.rof * (w.mag - 1) + 0.35 + w.reload) / w.mag)

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

// Highest absorbed sedative the dose on board reaches if nothing else lands.
export function projectedPeak(sed, sedative, pending) {
  const r = { sedative, pending }
  let peak = sedative
  for (let i = 0; r.pending > 0 && i < 6000; i++) {
    absorb(sed, r, STEP)
    if (r.sedative > peak) peak = r.sedative
  }
  return peak
}

// Darts of `dose`, one now and then one every `gap` seconds, until the
// projected peak reaches `line`: { n, peak }. n is Infinity when the animal
// clears sedative faster than the darts bring it.
function paced(sed, sedative, pending, dose, gap, line) {
  const r = { sedative, pending }
  for (let n = 1; n <= MAX; n++) {
    r.pending += dose
    // nothing peaks above what is on board, so only project once it could
    if (r.sedative + r.pending >= line) {
      const peak = projectedPeak(sed, r.sedative, r.pending)
      if (peak >= line) return { n, peak }
    }
    for (let t = 0; t < gap; t += STEP) absorb(sed, r, STEP)
  }
  return { n: Infinity, peak: 0 }
}

// Darts of `dose` landing together that take the projected peak to `line`:
// the fewest that could do it, which is what an overdose warning wants.
function atOnce(sed, sedative, pending, dose, line) {
  let n = Math.max(1, Math.ceil((line - sedative - pending) / dose - 1e-6))
  while (n < MAX && projectedPeak(sed, sedative, pending + n * dose) < line) n++
  return n
}

// The zone the counts assume, and how the readout names zones.
const refZone = (sp) => (sp.armor?.includes('torso') ? 'limb' : 'torso')
const ZONE_WORD = { head: 'head', neck: 'neck', torso: 'body', limb: 'legs', tail: 'tail' }
const where = (sp) => (refZone(sp) === 'torso' ? '' : ` in the ${ZONE_WORD.limb}`)
// "neck or legs", "neck, legs or body"
const openZones = (sp) => {
  const w = ['neck', 'limb', 'torso'].filter((z) => !sp.armor?.includes(z)).map((z) => ZONE_WORD[z])
  return w.length > 1 ? `${w.slice(0, -1).join(', ')} or ${w[w.length - 1]}` : w[0]
}

// What one jab carries: the whole cartridge wherever it goes in (zones:
// false), else what it would in the zone the counts assume.
const jabDose = (sp, w) => w.dose * (w.zones === false ? 1 : ZONES[refZone(sp)].dose)

// Target readout lines for a living animal: [{ text, warn }]. `zone` is the
// hit zone under the crosshair ('neck', 'armor', ...), if any; `held` the
// weapon in hand, if it changes how the dose is said (a melee syringe).
export function doseReadout(sp, state, sedative, pending, zone, held) {
  const sed = sp.sedation
  const peak = projectedPeak(sed, sedative, pending)
  if (peak >= odLine(sed)) return [{ text: 'Fatal overdose absorbing — it will die', warn: true }]
  if (held?.kind === 'melee') return jabReadout(sp, state, sedative, pending, zone, held, peak)
  const k = ZONES[refZone(sp)].dose
  const rifle = WEAPONS.rifle.dose
  const pistol = WEAPONS.pistol.dose
  const odRifle = atOnce(sed, sedative, pending, rifle * k, odLine(sed))
  const odPistol = atOnce(sed, sedative, pending, pistol * k, odLine(sed))
  // a neck or head dart carries more than the counts assume
  const zm = ZONES[zone]?.dose ?? 0
  let zoneOd = null
  if (zm > k) {
    if (odPistol > 1 && projectedPeak(sed, sedative, pending + pistol * zm) >= odLine(sed)) zoneOd = 'any'
    else if (odRifle > 1 && projectedPeak(sed, sedative, pending + rifle * zm) >= odLine(sed)) zoneOd = 'rifle'
  }
  const zoneWord = ZONE_WORD[zone]
  const lines = []
  let toldRifle = false
  if (state === 'unconscious') lines.push({ text: 'Out cold — no more darts needed' })
  else if (peak >= koLine(sed)) lines.push({ text: 'Enough sedative absorbing — wait' })
  else if (zone === 'armor') lines.push({ text: `Armour — darts won't take. Aim for the ${openZones(sp)}`, warn: true })
  else {
    lines.push(knockout(sp, sedative, pending, true, zoneOd === 'rifle' ? zoneWord : null))
    toldRifle = zoneOd === 'rifle'
  }
  lines.push({ text: `Overdose: ${plural(odRifle, 'more rifle dart')}${where(sp)} (or ${odPistol} pistol)`, warn: odRifle <= 1 })
  if (zoneOd === 'any') lines.push({ text: `Any dart in the ${zoneWord} would overdose`, warn: true })
  else if (zoneOd === 'rifle' && !toldRifle) lines.push({ text: `A rifle dart in the ${zoneWord} would overdose`, warn: true })
  return lines
}

// "Knockout: 2 more rifle darts (or 5 pistol)", or the pistol alone when a
// rifle dart that knocks it out would also kill it (a compy, say) — or would
// in the zone being aimed at (`risky` names it).
function knockout(sp, sedative, pending, more, risky = null) {
  const sed = sp.sedation
  const k = ZONES[refZone(sp)].dose
  const m = more ? 'more ' : ''
  const R = paced(sed, sedative, pending, WEAPONS.rifle.dose * k, pace(WEAPONS.rifle), koLine(sed))
  const P = paced(sed, sedative, pending, WEAPONS.pistol.dose * k, pace(WEAPONS.pistol), koLine(sed))
  // a course of darts is safe when the one that tips it over doesn't overshoot
  const rifleSafe = R.n < Infinity && R.peak < odLine(sed) && !risky
  const pistolSafe = P.n < Infinity && P.peak < odLine(sed)
  const pistolAlt = P.n < Infinity ? `${P.n} pistol` : "pistol darts can't keep up"
  if (rifleSafe && pistolSafe && P.n === 1) return { text: `Knockout: ${plural(1, m + 'pistol dart')}${where(sp)} (or ${R.n} rifle)` }
  if (rifleSafe) return { text: `Knockout: ${plural(R.n, m + 'rifle dart')}${where(sp)} (or ${pistolAlt})` }
  if (pistolSafe) {
    const why = risky ? `a rifle dart in the ${risky} would overdose` : 'a rifle dart overdoses'
    return { text: `Knockout: ${plural(P.n, m + 'pistol dart')}${where(sp)}${more ? `; ${why}` : ` (${why})`}`, warn: !!risky }
  }
  if (R.n === Infinity && P.n === Infinity) return { text: "Darts can't outpace its metabolism", warn: true }
  return { text: 'Too close to an overdose to dart safely', warn: true }
}

// The readout with a syringe in hand: the jabs that knock it out at the
// syringe's own pace, or why not, then how many at once would overdose. A
// single jab that kills is the whole verdict.
function jabReadout(sp, state, sedative, pending, zone, w, peak) {
  const sed = sp.sedation
  const dose = jabDose(sp, w)
  const od = atOnce(sed, sedative, pending, dose, odLine(sed))
  const odText = { text: `Overdose: ${plural(od, 'more jab')}`, warn: od <= 1 }
  if (state === 'unconscious') return [{ text: 'Out cold — no more jabs needed' }, odText]
  if (peak >= koLine(sed)) return [{ text: 'Enough sedative absorbing — wait' }, odText]
  if (zone === 'armor') return [{ text: `Armour — the needle won't go in. Jab the ${openZones(sp)}`, warn: true }, odText]
  const J = paced(sed, sedative, pending, dose, pace(w), koLine(sed))
  if (J.n === Infinity) return [{ text: "Jabs can't outpace its metabolism", warn: true }, odText]
  if (J.peak >= odLine(sed)) return od <= 1 ? [{ text: 'One jab is a fatal overdose — dart it instead', warn: true }] : [{ text: 'Too close to an overdose to jab safely', warn: true }, odText]
  return [{ text: `Knockout: ${plural(J.n, 'more jab')}` }, odText]
}

// Journal card: knockout and overdose for an animal with no sedative in it,
// and with `melee` (the syringe, once carried) its jabs.
export function doseCard(sp, melee = null) {
  const sed = sp.sedation
  const k = ZONES[refZone(sp)].dose
  const ko = knockout(sp, 0, 0, false).text.replace('Knockout: ', '')
  const odRifle = atOnce(sed, 0, 0, WEAPONS.rifle.dose * k, odLine(sed))
  const odPistol = atOnce(sed, 0, 0, WEAPONS.pistol.dose * k, odLine(sed))
  const card = { ko: `${ko} · ${sed.ko}u`, od: `${plural(odRifle, 'rifle dart')}${where(sp)} (or ${odPistol} pistol) · ${sed.lethal}u` }
  if (melee) {
    const dose = jabDose(sp, melee)
    const J = paced(sed, 0, 0, dose, pace(melee), koLine(sed))
    const od = atOnce(sed, 0, 0, dose, odLine(sed))
    if (J.peak >= odLine(sed)) card.jab = 'One jab is a fatal overdose'
    else if (J.n === Infinity) card.jab = "Jabs can't outpace its metabolism"
    else card.jab = `${plural(J.n, 'jab')} to knock out · ${plural(od, 'jab')} overdose`
  }
  return card
}
