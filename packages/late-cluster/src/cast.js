// The cast of THE LATE CLUSTER. Every voice is a CHIMERA body: `body` blends the engine's
// male / female / child anatomy (which also shapes the 3D head), `f0` is the speaking pitch (Hz),
// `rate` the speaking-rate multiplier, `accent` the pitch excursion on stressed syllables, and
// `source` a patch on the engine's voice source (breathiness, tension, fry, roughness,
// vibratoDepth, vibratoRate, drift, brightness, pressure). `pan` (-1..1) places the voice in the mix.
//
// Read by the offline renderer (tools/render.ts) and by the page. Looks live in src/looks.js.

export const CAST = {
  // ---- the house
  larry: {
    name: 'Larry Nx',
    title: 'Your host',
    body: { female: 0, child: 0 },
    f0: 104, rate: 1.0, accent: 0.16,
    source: { breathiness: 0.12, tension: 0.5 },
    pan: 0.12,
  },
  sibyl: {
    name: 'Sibyl Ant',
    title: 'Announcer',
    body: { female: 1, child: 0 },
    f0: 196, rate: 1.04, accent: 0.2,
    source: { breathiness: 0.2 },
    pan: -0.3,
  },

  // ---- the house band: Hy Oid & The Formants
  hy: {
    name: 'Hy Oid',
    title: 'Bandleader, The Formants',
    body: { female: 0.35, child: 0 },
    f0: 135, rate: 0.95, accent: 0.2,
    source: { breathiness: 0.3, tension: 0.42, brightness: 0.12 },
    pan: -0.5,
  },
  al: {
    name: 'Al Veolar',
    title: 'Bass, The Formants',
    body: { female: 0, child: 0 },
    f0: 84, rate: 0.95, accent: 0.14,
    source: { tension: 0.45, fry: 0.2 },
    pan: -0.7,
  },
  dee: {
    name: 'Dee Phthong',
    title: 'Alto, The Formants',
    body: { female: 0.9, child: 0.1 },
    f0: 155, rate: 1.0, accent: 0.18,
    source: { breathiness: 0.18, tension: 0.45, brightness: 0.25 },
    pan: -0.4,
  },
  pete: {
    name: 'Plosive Pete',
    title: 'Percussion, The Formants',
    body: { female: 0.65, child: 0.4 },
    f0: 115, rate: 1.05, accent: 0.18,
    source: { tension: 0.55, brightness: 0.4 },
    pan: -0.6,
  },

  // ---- correspondents and studio voices (original characters)
  eppy: {
    name: 'Eppy Glottis',
    title: 'Sports desk',
    body: { female: 0.15, child: 0.2 },
    f0: 165, rate: 1.16, accent: 0.36,
    source: { tension: 0.68, brightness: 0.55 },
    pan: 0.25,
  },
  bot: {
    name: 'A website bot',
    title: 'Builds it',
    body: { female: 0.5, child: 0.4 },
    f0: 275, rate: 1.0, accent: 0.06,
    source: { tension: 0.7, brightness: 0.6, breathiness: 0.02 },
    pan: 0.45,
  },

  // ---- guests: puppets playing the posting personas of real Bluesky accounts.
  // Parody, not impersonation: they speak the accounts' own catchphrases or obvious pastiche.
  norvid: {
    name: 'norvid_studies',
    handle: '@norvid-studies.bsky.social',
    title: 'Crow of claims',
    guest: true,
    body: { female: 0.25, child: 0.15 },
    f0: 160, rate: 1.2, accent: 0.1,
    source: { tension: 0.66, roughness: 0.5, fry: 0.2, brightness: 0.5 },
    pan: -0.25,
  },
  abel: {
    name: 'Abel',
    handle: '@abeliansoup.bsky.social',
    title: 'Abeliancorp',
    guest: true,
    body: { female: 0, child: 0 },
    f0: 92, rate: 1.26, accent: 0.24,
    source: { breathiness: 0.55, tension: 0.35, brightness: 0.1 },
    pan: -0.5,
  },
  samantha: {
    name: 'Samantha',
    handle: '@samantha.wiki',
    title: 'The Simcluster Channel',
    guest: true,
    body: { female: 1, child: 0.15 },
    f0: 228, rate: 1.08, accent: 0.32,
    source: { breathiness: 0.08, brightness: 0.5 },
    pan: -0.2,
  },
  borjev: {
    name: 'BorJev',
    handle: '@borjev.bsky.social',
    title: "Abel's bot · opt-in only",
    guest: true,
    body: { female: 0.1, child: 0.4 },
    f0: 178, rate: 0.95, accent: 0.05,
    source: { tension: 0.62, roughness: 0.6, brightness: 0.3, drift: 40 },
    pan: -0.6,
  },
}
