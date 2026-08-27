// embeds.js — the neighbours.
//
// Lotus OS is one app in a gallery of them, and the machines standing next to
// it in that gallery are, from here, just pages. A page fits in a window. The
// `frame` program is the one that puts it there and this is the table of what
// it is allowed to show — one entry per neighbour, keyed by the id the
// filesystem refers to it with.
//
// A neighbour has two addresses and a window takes the first that applies:
//
//   override  an absolute URL parked on `window.__LOTUS_EMBEDS__` before the OS
//             boots. Only the single-file build writes one (tools/standalone.mjs),
//             because that build is one page with no directory around it — the
//             sibling path below has nothing to resolve against.
//   sibling   the neighbour's own directory, relative to this page. In the
//             built gallery that is a sibling of /vibe-dump/lotus-os/; in dev
//             the config serves the same path out of the sibling's dist. This
//             is the better address wherever it exists: same origin, no second
//             host to be up, and the copy you just built rather than the copy
//             that happens to be deployed.
//
// Nothing here imports the neighbour. The packages in this monorepo stay
// independent of each other; `pkg` is a directory name and `home` is a URL, and
// the only things that ever act on them are a dev-server middleware and a
// by-hand build tool.

export const EMBEDS = {
  'automata-graph': {
    title: 'Automata Graph',
    // The four-petal diaper tile: the one motif in the set that wants to be
    // repeated forever. It has been waiting for a cellular automaton.
    mark: 'prajamYam',
    pkg: 'rule-explorer',
    home: 'https://kumavis.github.io/vibe-dump/rule-explorer/',
    caption: 'All 256 elementary rules, and the state-transition graph of each.',
    // Wide, because the neighbour keeps a detail rail down one side and the
    // graph needs what is left to still be a graph.
    width: 1120,
    height: 740,
    minWidth: 520,
    minHeight: 360,
  },
}

/** The sibling directory, relative to this page. Same shape in dev and built. */
export const siblingUrl = (embed) => `../${embed.pkg}/`

/**
 * Where this build should send the frame, and whether that is next door or
 * across the internet — which the window says out loud, because the two fail in
 * completely different ways and the toolbar is where you look to tell them apart.
 */
export function sourceFor(id, embed) {
  const override = globalThis.__LOTUS_EMBEDS__?.[id]
  if (typeof override === 'string' && override) return { url: override, sameSite: false }
  return { url: siblingUrl(embed), sameSite: true }
}
