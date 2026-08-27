// embeds.js — the neighbours.
//
// Lotus OS is one app in a gallery of them, and the machines standing next to
// it in that gallery are, from here, just pages. A page fits in a window. The
// `frame` program is the one that puts it there and this is the table of what
// it is allowed to show — one entry per neighbour, keyed by the id the
// filesystem refers to it with.
//
// There are two ways a neighbour arrives, and a window takes the first one it
// finds:
//
//   baked   a whole document parked on `window.__LOTUS_EMBEDS__` before the OS
//           boots. Only the single-file build does this (tools/standalone.mjs):
//           an artifact is one page with nothing beside it and no network, so
//           the neighbour has to be carried in the same file or not at all.
//   url     the neighbour's own directory, resolved against this page. In the
//           built gallery that is a sibling of /vibe-dump/lotus-os/; in dev the
//           config serves the same path out of the sibling's dist. This is the
//           better one when it exists — a separate document, cached on its own,
//           and not 500 kB of somebody else's program inside our bundle.
//
// Nothing here imports the neighbour. The packages in this monorepo stay
// independent of each other; `pkg` is a directory name, and the only two things
// that ever act on it are a dev-server middleware and a by-hand build tool.

export const EMBEDS = {
  'automata-graph': {
    title: 'Automata Graph',
    // The four-petal diaper tile: the one motif in the set that wants to be
    // repeated forever. It has been waiting for a cellular automaton.
    mark: 'prajamYam',
    pkg: 'rule-explorer',
    caption: 'All 256 elementary rules, and the state-transition graph of each.',
    // Wide, because the neighbour keeps a detail rail down one side and the
    // graph needs what is left to still be a graph.
    width: 1120,
    height: 740,
    minWidth: 520,
    minHeight: 360,
  },
}

/** Where a neighbour lives relative to this page. Same shape in dev and built. */
export const urlFor = (embed) => `../${embed.pkg}/`

/** The copy carried inside a single-file build, if this is one. */
export const bakedDoc = (id) => {
  const table = globalThis.__LOTUS_EMBEDS__
  return typeof table?.[id] === 'string' ? table[id] : null
}
