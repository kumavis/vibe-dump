// How long the view takes over each event it plays (DESIGN §2.4): every
// fixed duration in one table, in game seconds (the speed button and ?fast
// scale them all through the clock). Animations keep their own tween
// lengths (a fall, a flight from the table); these are the beats the game
// waits on before it plays the next event.
//
// unit.wound and unit.slain take no time of their own: the 0.06 s after
// each wound allocated is a `pause` the rules emit where the old code waited
// (§4.1 rule 3), so a unit's last model falls and its "destroyed" text
// shows in the same moment, as before.
export const PACE = Object.freeze({
  // the turn banner: longer when the seat is played here, or outside battle
  phaseStart: (local, stage) => (local || stage !== 'battle' ? 0.9 : 0.6),
  // a row of dice in the tray
  dice: (n) => 0.38 + Math.min(n, 14) * 0.035,
  // a pure wait, as long as the rules asked
  pause: (s) => s,
  // an event the view has no handler for: its text, then this long
  beat: 0.3,
})
