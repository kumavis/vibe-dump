// Cold open: "Built it." — then the titles, the announce and the theme.
// Render: bun tools/render.ts cold-open   ·   verify: bun tools/check.ts cold-open
export default {
  id: 'cold-open',
  title: 'Built It',
  gap: 0.3,
  beats: [
    // ---- 1. cold: a black screen, a post, a clock
    { cue: 'card', at: 0.2 },
    { sfx: 'tick-2', at: 0.5, hold: 0, vol: 0.5 },
    { wait: 2.6 },
    { cue: 'later' },
    { sfx: 'ticktock', hold: 1, vol: 0.9 },
    { say: 'bot', id: 'built', text: 'Built it.', gap: 0.15, rate: 0.9, intonation: 'flat' },
    { sfx: 'tada', at: 0.15, hold: 0, vol: 0.55 },
    { wait: 0.7 },

    // ---- 2. lights: Larry, surprised to exist
    { cue: 'lights' },
    { sfx: 'tick-3', at: -0.02, hold: 0, vol: 0.9 },
    { sfx: 'gasp', at: 0.15, hold: 0, vol: 0.5 },
    { wait: 0.45 },
    { say: 'larry', id: 'oh', text: 'Oh. Oh no. We’re on.', as: 'Oh. Oh no. We’re on.' },
    { say: 'larry', id: 'joke', text: 'Somebody asked for this show. As a joke.', gap: 0.5, rate: 0.94 },
    { wait: 0.3 },
    { say: 'larry', id: 'contract', text: 'In this town, a joke is a contract.', gap: 0.2, rate: 0.94 },
    { sfx: 'laugh', at: 0.05 },
    { say: 'larry', id: 'givme', text: 'Hy! We need a theme song!', as: 'High! We need a theme song!', gap: 0.1, rate: 0.9 },
    { say: 'hy', id: 'already', text: 'Already built it, Larry.', gap: 0.35 },

    // ---- 3. the titles: the theme, with the announce over the groove
    // bars 1–2: a quiet groove under Sibyl's opening (the line first, then rewind and lay the groove under it)
    { say: 'sibyl', id: 'subgraph', text: 'From a dense, walkable subgraph...', as: 'From a dense, walk-able sub-graph...', gap: 0.5, rate: 0.95, vol: 1.15 },
    { wait: -2.6 },
    { cue: 'theme', at: 0 },
    { music: { id: 'intro', bpm: 120, gap: 0, tracks: [
      { who: 'pete', id: 'intro-beat', beat: 'B . . . | ! . t . | B . . . | ! . t . ', loops: 2, vol: 0.2 },
      { who: 'al', id: 'intro-bass', beat: 'm:43 . . . | m:43 . . . | m:43 . . . | m:43 . . . ', loops: 2, vol: 0.2 },
    ] } },
    // bars 3–6: the hook, full band (Hy lead, Dee a third above, everybody HEY)
    { music: { id: 'hook', bpm: 120, gap: 0, tracks: [
      { who: 'pete', id: 'hook-beat', beat: 'B . t . | ! . t . | B . B . | ! . t . ', loops: 4, vol: 0.6 },
      { who: 'al', id: 'hook-bass', beat: 'm:43 . . . | m:43 . . . | m:43 . . . | m:43 . . . | m:48 . . . | m:48 . . . | m:48 . . . | m:48 . . . | m:50 . . . | m:50 . . . | m:50 . . . | m:50 . . . | m:43 . . . | m:43 . . . | m:43 . . . | m:43 . . . ', loops: 1, vol: 0.5 },
      { who: 'hy', id: 'hook', caption: true, vol: 1,
        lyrics: "it's the late cluster, the late cluster, you wished it out loud, so we built it tonight",
        notes: [[62, 0.5], [64, 0.5], [67, 1], [64, 0.5], [62, 1.5],
                [64, 0.5], [67, 1], [69, 0.5], [67, 1], [0, 1],
                [62, 0.5], [64, 0.5], [67, 0.5], [67, 0.5], [69, 1], [0, 1],
                [67, 0.5], [69, 0.5], [71, 0.5], [69, 0.5], [67, 0.5], [67, 1.5]] },
      { who: 'dee', id: 'hook-dee', vol: 0.5,
        lyrics: "it's the late cluster, the late cluster, you wished it out loud, so we built it tonight",
        notes: [[66, 0.5], [67, 0.5], [71, 1], [67, 0.5], [66, 1.5],
                [67, 0.5], [71, 1], [72, 0.5], [71, 1], [0, 1],
                [66, 0.5], [67, 0.5], [71, 0.5], [71, 0.5], [72, 1], [0, 1],
                [71, 0.5], [72, 0.5], [74, 0.5], [72, 0.5], [71, 0.5], [71, 1.5]] },
      { who: ['hy', 'al', 'dee'], shout: 'hey', beats: [7], vol: 0.8 },
    ] } },
    // bars 7–12: a quiet bed under the guest list
    { music: { id: 'bed', bpm: 120, gap: 0, tracks: [
      { who: 'pete', id: 'bed-beat', beat: 'B . . . | ! . t . | B . . . | ! . t . ', loops: 6, vol: 0.16 },
      { who: 'al', id: 'bed-bass', beat: 'm:43 . . . | m:43 . . . | m:43 . . . | m:43 . . . | m:48 . . . | m:48 . . . | m:48 . . . | m:48 . . . | m:50 . . . | m:50 . . . | m:50 . . . | m:50 . . . ', loops: 2, vol: 0.16 },
    ] } },
    { wait: -10 }, { wait: -2 },
    { say: 'sibyl', id: 'samantha', text: 'Tonight! Samantha, with the weather!', gap: 0.15, rate: 0.95, vol: 1.15 },
    { say: 'sibyl', id: 'panel', text: 'On the panel: norvid, and Abel!', rate: 0.95, vol: 1.15 },
    { say: 'sibyl', id: 'void', text: 'On a decelerated clock... Void.', rate: 0.88, vol: 1.15 },
    { wait: 0.6 },
    { cue: 'void-late' },
    { sfx: 'tick-1', hold: 0, vol: 0.7 },
    { say: 'sibyl', id: 'band', text: 'Music by Hy Oid, and The Formants!', as: 'Music by High Oyd, and the Formants!', gap: 0.5, rate: 0.95, vol: 1.15 },
    { sfx: 'woo', at: -0.2, hold: 0, vol: 0.45 },

    // the big finish
    { cue: 'roll', at: 0.2 },
    { sfx: 'drumroll', at: 0.2, hold: 0, vol: 0.7 },
    { say: 'sibyl', id: 'throat', text: 'And now... a man who is, technically, a throat...', gap: 0.5, rate: 0.95, vol: 1.15 },
    { say: 'sibyl', id: 'larry', text: 'Larry... Nx!', as: 'Larry... En-Ex!', gap: 0.35, vol: 1.2 },
    { cue: 'nx', at: -0.5 },
    { sfx: 'sting', at: 0.0, hold: 0, vol: 0.8 },
    { sfx: 'applause-long', at: -0.1, hold: 0.85 },
    { cue: 'end' },
  ],
}
