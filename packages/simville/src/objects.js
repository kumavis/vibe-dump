// Things you can pick up, and the things you can do with them.
//
// The point of this table isn't the actions themselves — it's that a tool has
// exactly one location in the world at a time, and the only way a resident can
// find one is to remember seeing it, or to ask somebody who did. That turns the
// memory stream from flavour into the mechanism the town actually runs on: Milo
// leaves the rod on the square, Oma goes looking for it at the dock where she
// last saw it, doesn't find it, gets annoyed, and asks the next person she
// meets. Nothing about that is scripted; it falls out of who saw what.
//
// Each tool starts at its `home`, which is also where the tidy residents put it
// back. The untidy ones drop it wherever they finished.

export const TOOLS = [
  { id: 'rod', name: 'fishing rod', home: 'dock' },
  { id: 'axe', name: 'axe', home: 'woods' },
  { id: 'broom', name: 'broom', home: 'square' },
  { id: 'can', name: 'watering can', home: 'square' },
  { id: 'teapot', name: 'copper kettle', home: 'kettle' },
  { id: 'spanner', name: 'spanner', home: 'workshop' },
  { id: 'brushes', name: 'paint brushes', home: 'studio' },
  { id: 'ledger', name: 'ledger', home: 'library' },
  { id: 'pin', name: 'rolling pin', home: 'kettle' },
  { id: 'scales', name: 'brass scales', home: 'market' },
  { id: 'ladder', name: 'step ladder', home: 'watch' },
  { id: 'bucket', name: 'bucket', home: 'well' },
]

// `who` is who's inclined to it — the schedule still decides where a body is
// most of the day, so an errand is something people take up in their own time.
export const ACTIONS = [
  {
    id: 'fish',
    tool: 'rod',
    at: 'dock',
    doing: 'fishing off the dock',
    done: 'sat an hour at the dock and caught nothing',
    minutes: 50,
    who: ['milo', 'oma', 'bo', 'ray'],
  },
  {
    id: 'chop',
    tool: 'axe',
    at: 'woods',
    doing: 'splitting logs at the woodpile',
    done: 'got the week’s firewood in',
    minutes: 45,
    who: ['bo', 'yusef', 'ray', 'rosa'],
  },
  {
    id: 'sweep',
    tool: 'broom',
    at: 'square',
    doing: 'sweeping the square',
    done: 'swept the square, which nobody will notice',
    minutes: 30,
    who: ['ray', 'rosa', 'nadia'],
  },
  {
    id: 'water',
    tool: 'can',
    at: 'square',
    doing: 'watering the planters',
    done: 'watered the planters',
    minutes: 25,
    who: ['oma', 'pia', 'nadia'],
  },
  {
    id: 'brew',
    tool: 'teapot',
    at: 'kettle',
    doing: 'putting the kettle on',
    done: 'made a pot for whoever turns up',
    minutes: 20,
    who: ['rosa', 'oma', 'nadia'],
  },
  {
    id: 'mend',
    tool: 'spanner',
    at: 'workshop',
    doing: 'mending something at the bench',
    done: 'fixed it, mostly',
    minutes: 55,
    who: ['bo', 'ray'],
  },
  {
    id: 'paint',
    tool: 'brushes',
    at: 'studio',
    doing: 'painting while the light holds',
    done: 'painted something and scraped most of it off',
    minutes: 60,
    who: ['pia', 'milo'],
  },
  {
    id: 'catalogue',
    tool: 'ledger',
    at: 'library',
    doing: 'writing up the catalogue',
    done: 'got the shelves back in order',
    minutes: 40,
    who: ['nadia', 'ray'],
  },
  {
    id: 'bake',
    tool: 'pin',
    at: 'kettle',
    doing: 'rolling out dough',
    done: 'put a tray of something warm out',
    minutes: 45,
    who: ['rosa', 'milo'],
  },
  {
    id: 'weigh',
    tool: 'scales',
    at: 'market',
    doing: 'weighing out the stock',
    done: 'weighed and priced the lot',
    minutes: 35,
    who: ['yusef', 'rosa'],
  },
  {
    id: 'lamp',
    tool: 'ladder',
    at: 'lane',
    doing: 'seeing to the lamp on the lane',
    done: 'got the lane lamp working again',
    minutes: 30,
    who: ['ray', 'bo'],
  },
  {
    id: 'draw',
    tool: 'bucket',
    at: 'well',
    doing: 'drawing water at the well',
    done: 'drew two full buckets',
    minutes: 20,
    who: ['oma', 'milo', 'yusef'],
  },
]

// Whether a tool goes back where it belongs. This single number is what makes
// the whole system go: a town of tidy people would never lose anything and
// nobody would ever have to ask.
export const TIDY = {
  rosa: 0.6,
  bo: 0.15,
  nadia: 0.95,
  milo: 0.05,
  oma: 0.5,
  yusef: 0.35,
  pia: 0.25,
  ray: 0.9,
}

export const TOOL_BY_ID = new Map(TOOLS.map((t) => [t.id, t]))
export const ACTION_BY_ID = new Map(ACTIONS.map((a) => [a.id, a]))

export function actionsFor(agentId) {
  return ACTIONS.filter((a) => a.who.includes(agentId))
}

export function toolName(id) {
  return TOOL_BY_ID.get(id)?.name ?? id
}
