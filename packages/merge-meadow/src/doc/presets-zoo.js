// Zoo presets (design §18.2, §18.3): a creature preset per library model of the
// wizard and the Chinese zodiac (the horse already has a seed preset). Plain data
// like PRESETS: each extends `creature`, carries a palette `icon`, and looks like
// its rig model ({ kind: 'rig', model }). Behaviour is drives over tags:
//   predators (tiger, dragon) hunt `prey`; the snake hunts `rodent` and flees
//   predators; prey flee predators (the rat flees snakes too); the monkey and the
//   dog wander and react to nothing; the wizard is a `person` that flees predators.
// Speeds are NOT all fair the way the seed's sheep (6.5) vs T-rex (6) is: the
// rabbit (7) outruns the T-rex, but the goat (5.5), pig (4) and rooster (5) do not,
// so in the Animal meadow those three are usually caught within minutes. That is
// the chase on show; a world that wants them to live can raise body.speed.
const drive = (act, match, extra = {}) => ({ act, match, ...extra })
const alive = (m) => ({ ...m, notTags: ['dead'] })
const flee = (weight = 3, range = 12, match = { tags: ['predator'] }) => ({ flee: drive('flee', alive(match), { weight, range }) })
const hunt = (tags, weight = 2, range = 15) => ({ hunt: drive('pursue', alive({ tags }), { weight, range }) })
const rig = (model) => ({ kind: 'rig', model })

function zoo (icon, model, components) {
  return { extends: 'creature', icon, components: { ...components, representation: rig(model) } }
}

function deepFreeze (o) {
  if (o && typeof o === 'object' && !Object.isFrozen(o)) { Object.freeze(o); for (const k of Object.keys(o)) deepFreeze(o[k]) }
  return o
}

export const ZOO_PRESETS = deepFreeze({
  wizard: zoo('🧙', 'wizard', {
    tags: { person: true, wizard: true },
    body: { speed: 3, accel: 10, radius: 0.4 },
    perception: { radius: 15 },
    brain: { drives: flee(3, 12) },
    health: { max: 60, armor: 0 },
  }),
  rat: zoo('🐀', 'rat', {
    tags: { prey: true, rodent: true },
    body: { speed: 4.5, accel: 20, radius: 0.2 },
    perception: { radius: 10 },
    brain: { drives: flee(3, 8, { anyTags: ['predator', 'snake'] }) },
    health: { max: 15, armor: 0 },
  }),
  ox: zoo('🐂', 'ox', {
    tags: { prey: true, ox: true },
    body: { speed: 4.5, accel: 6, radius: 1 },
    perception: { radius: 15 },
    brain: { drives: flee(1.5, 10) },
    health: { max: 150, armor: 3 },
  }),
  tiger: zoo('🐅', 'tiger', {
    tags: { predator: true, tiger: true },
    body: { speed: 6.5, accel: 10, radius: 0.8 },
    perception: { radius: 25 },
    brain: { drives: hunt(['prey'], 2, 16) },
    attack: { damage: 20, reach: 1.2, cooldown: 1 },
    health: { max: 150, armor: 1 },
  }),
  rabbit: zoo('🐇', 'rabbit', {
    tags: { prey: true, rabbit: true },
    body: { speed: 7, accel: 20, radius: 0.25 },
    perception: { radius: 14 },
    brain: { drives: flee(3, 12) },
    health: { max: 20, armor: 0 },
  }),
  dragon: zoo('🐉', 'dragon', {
    tags: { predator: true, dragon: true },
    body: { speed: 5, accel: 6, radius: 1.6 },
    perception: { radius: 30 },
    brain: { drives: hunt(['prey'], 2, 20) },
    attack: { damage: 40, reach: 1.8, cooldown: 1.6 },
    health: { max: 400, armor: 4 },
  }),
  snake: zoo('🐍', 'snake', {
    tags: { snake: true },
    body: { speed: 4, accel: 10, radius: 0.35 },
    perception: { radius: 12 },
    // fleeing outweighs hunting: a snake near a tiger gives up the rat
    brain: { drives: { ...hunt(['rodent'], 2, 10), ...flee(3, 10) } },
    attack: { damage: 8, reach: 0.6, cooldown: 1 },
    health: { max: 40, armor: 0 },
  }),
  goat: zoo('🐐', 'goat', {
    tags: { prey: true, goat: true },
    body: { speed: 5.5, accel: 14, radius: 0.5 },
    perception: { radius: 14 },
    brain: { drives: flee(2.5, 12) },
    health: { max: 45, armor: 1 },
  }),
  monkey: zoo('🐒', 'monkey', {
    tags: { monkey: true, person: true },
    body: { speed: 4, accel: 14, radius: 0.3 },
    perception: { radius: 12 },
    health: { max: 35, armor: 0 },
  }),
  rooster: zoo('🐓', 'rooster', {
    tags: { prey: true, rooster: true },
    body: { speed: 5, accel: 18, radius: 0.3 },
    perception: { radius: 10 },
    brain: { drives: flee(3, 10) },
    health: { max: 15, armor: 0 },
  }),
  dog: zoo('🐕', 'dog', {
    tags: { dog: true },
    body: { speed: 6, accel: 16, radius: 0.4 },
    perception: { radius: 15 },
    health: { max: 50, armor: 0 },
  }),
  pig: zoo('🐖', 'pig', {
    tags: { prey: true, pig: true },
    body: { speed: 4, accel: 10, radius: 0.6 },
    perception: { radius: 12 },
    brain: { drives: flee(2, 10) },
    health: { max: 60, armor: 1 },
  }),
})
