// A tiny synchronous pub/sub bus. Systems talk through it instead of holding
// references to each other: weapons emit 'noise', creatures listen; science
// emits 'science:done', scoring and objectives listen. Adding a system that
// cares about something is one `on()` call — nothing else has to change.
//
// Event catalogue (payloads are plain objects):
//   noise              {x, y, z, radius, kind, source}   anything audible; kind is
//                      step | shot | gunshot | shutter | distraction | impact | vehicle
//   weapon:fired       {weapon}
//   weapon:gained      {weapon}
//   dart:hit           {creature, zone, dose | damage}   a hit-marker label ('NECK', 'ARMOUR');
//                      darts, bullets and the syringe's jab alike
//   creature:hit       {creature, zone, dose, damage, weapon}
//   creature:ko        {creature}
//   creature:woke      {creature}
//   creature:died      {creature, cause}                 'weapon' | 'overdose' | 'predation'
//   creature:detected  {creature}                        first time it spots the player
//   science:done       {creature, procedure, points, ghost}
//   science:scan       {creature, first, points, unaware}
//   photo:taken        {creature, species, quality, stars, points, first}
//   score              {delta, reason, category}
//   player:damaged     {amount, from}
//   player:died        {}
//   item:gained        {item, count}
//   flag               {flag, value}
//   objective:done     {objective}
//   expedition:complete {}                              the expedition's final objective
//   mission:start      {mission}                        a MISSIONS entry (data/objectives.js)
//                                                       taken up: the debrief's Continue
//   mission:complete   {mission}                        its final objective done (the
//                                                       expedition's too); main.js shows its debrief
//   blast              {x, y, z, kind, radius, weapon, wet} game/blast.js, after the damage
//   vehicle:enter / vehicle:exit       {vehicle}         any vehicle (heli, jeep, motorbike, sub)
//   heli:enter / heli:exit / jeep:enter / jeep:exit {}   the same, per kind (also sub:enter / sub:exit)
//   vehicle:damaged    {vehicle, amount, hull, at}       camera shake and HUD listen
//   vehicle:destroyed  {vehicle}
//   vehicle:repaired   {vehicle, field}                  field repair, the pad pump or the moon pool winch
//   sonar              {x, y, z, range}                  the submersible's ping; the sea life scatters

export class EventBus {
  constructor() {
    this.handlers = new Map()
  }
  on(type, fn) {
    let list = this.handlers.get(type)
    if (!list) this.handlers.set(type, (list = []))
    list.push(fn)
    return () => this.off(type, fn)
  }
  off(type, fn) {
    const list = this.handlers.get(type)
    if (!list) return
    const i = list.indexOf(fn)
    if (i >= 0) list.splice(i, 1)
  }
  emit(type, payload = {}) {
    const list = this.handlers.get(type)
    if (list) for (const fn of list.slice()) fn(payload)
    const any = this.handlers.get('*')
    if (any) for (const fn of any.slice()) fn(type, payload)
  }
}
