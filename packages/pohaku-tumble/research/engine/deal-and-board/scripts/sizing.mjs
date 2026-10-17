// Size the board from the word list (what Board would do before layoutPairs).
//
//   target pairs = clamp(round(occ * words in play), minPairs, maxPairs)
//   cells        = target / 0.92            (layoutPairs drops ~8% of cells as holes)
//   rows, cols   = keep Jukugo's 9:8 cell grid aspect (the floor stays 42:29-shaped)
//
// "words in play" is LEXICON after pruning (the 2-core when SIM.prune = 2).
// The floor is then scaled so a cell stays Jukugo's 4.67 x 3.625 (sim.mjs: floor 'scaled').
export function sizeFor(LEXICON, degree, { occ = 0.1, minPairs = 10, maxPairs = 65 } = {}) {
  const target = Math.max(minPairs, Math.min(maxPairs, Math.round(occ * LEXICON.length)))
  const cells = target / 0.92
  const rows = Math.max(2, Math.round(Math.sqrt(cells / 1.125)))
  const cols = Math.max(2, Math.round(cells / rows))
  return { cols, rows, targetPairs: target }
}
