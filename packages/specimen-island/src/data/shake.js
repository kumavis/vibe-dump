// Camera shake: one value for whichever camera is live — the eye on foot,
// the seat or the chase camera in a vehicle. Hits add to it, it bleeds off on
// its own, and each view turns it into a jitter of its own size.
export const SHAKE = {
  max: 1.4,
  decay: 1.75, // per second
  perHp: {
    player: 1 / 30, // per hit point the player loses
    vehicle: 1 / 20, // per hull point the vehicle you are in loses
  },
  bump: 0.2, // the jeep clipping a small animal
  // jitter at full shake: metres of camera movement, radians of turn and roll
  views: {
    eye: { move: 0.12, turn: 0, roll: 0 },
    seat: { move: 0.1, turn: 0.05, roll: 0.07 },
    chase: { move: 0.45, turn: 0.05, roll: 0.07 },
  },
}
