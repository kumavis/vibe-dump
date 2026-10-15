// A tiny synchronous pub/sub bus. Systems talk through it instead of holding
// references to each other: weapons emit 'noise', creatures listen; science
// emits 'science:done', scoring and objectives listen. Adding a system that
// cares about something is one `on()` call — nothing else has to change.
//
// Event catalogue (payloads are plain objects):
//   noise              {x, y, z, radius, kind, source}   anything audible
//   weapon:fired       {weapon, origin, dir}
//   creature:hit       {creature, zone, dose, damage, weapon}
//   creature:ko        {creature}
//   creature:woke      {creature}
//   creature:died      {creature, cause}                 'weapon' | 'overdose' | 'predation'
//   creature:detected  {creature}                        first time it spots the player
//   science:done       {creature, procedure, points}
//   science:scan       {creature, first, points}
//   score              {delta, reason, category}
//   player:damaged     {amount, from}
//   player:died        {}
//   item:gained        {item, count}
//   flag               {flag, value}
//   poi:reached        {poi}
//   objective:done     {objective}
//   heli:enter / heli:exit / heli:landed {poi?}
//   jeep:enter / jeep:exit {}
//   vehicle:enter / vehicle:exit {vehicle}
//   vehicle:damaged    {vehicle, amount, hull, at}       camera shake and HUD listen
//   vehicle:destroyed  {vehicle}
//   vehicle:repaired   {vehicle, field}                  field repair or the pad pump
//   toast              {text, kind}

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
