// Explosions, as data: anything that goes bang (a tank shell, a missile, a
// fuel drum) names one of these and game/blast.js does the rest. Damage falls
// off linearly from `damage` at the centre to nothing at `radius`; animals and
// the player take it as hit points, vehicles as hull (times `vehicle`).
//
//   radius   m, the edge of the damage
//   damage   hit points at the centre
//   vehicle  hull damage per hit point, for anything with a hull
//   knock    m/s the player is thrown at the centre
//   noise    m, how far away animals hear it (a rifle shot is ~120)
//   shake    camera shake at the centre (SHAKE.max is the ceiling); falls off
//            over `shakeRadius`
//   size     scale of the fireball, smoke and debris

export const BLASTS = {
  shell: { radius: 9, damage: 420, vehicle: 0.35, knock: 9, noise: 420, shake: 1.2, shakeRadius: 70, size: 1.3 },
  missile: { radius: 7, damage: 360, vehicle: 0.4, knock: 8, noise: 380, shake: 1.0, shakeRadius: 60, size: 1.1 },
  grenade: { radius: 5, damage: 160, vehicle: 0.25, knock: 6, noise: 260, shake: 0.7, shakeRadius: 35, size: 0.7 },
}
