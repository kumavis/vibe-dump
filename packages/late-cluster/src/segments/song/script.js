// Segment 7 — "Someday (Built It)": the stomp-clap-hey number. One joke told as a song: an earnest
// someday-we'll-build-a-place anthem in a scene that can't say anything hypothetically.
// All mouths: Larry lead, Al stomps (kick), Pete claps/hats, Hy + Dee whoa-oh hook, harmonies, shouts.
// The song is split into music blocks at the stop bars so the spoken lines (bot "Built it.") can sit
// in the silences; the block gaps are tuned so each stop lasts about a bar. The breakdown's mid-stop
// is just a breath: c2 comes back in exactly two beats after c1 ends, on the grid.
// Render: bun tools/render.ts song --whisper

const BPM = 112

// ---- beat-pattern builders (16 sixteenths per bar, space-separated tokens)
const bar = (s) => s.trim().split(/\s+/)
const join = (bars) => bars.map((b) => b.join(' ')).join(' | ')
// Al's four-on-the-floor stomp for n beats, silent on the beats he shouts on
const stomp = (n, skip = []) => join(Array.from({ length: n }, (_, i) => (skip.includes(i) ? bar('. . . .') : bar('B . . .'))))
const CLAP = '. . t . ! . t . . . t . ! . t .'
const CRASH = 'kch . t . ! . t . . . t . ! . t .'
const FILL = '. . t . ! . t . ! . ! . ! ! ! !'
const claps = (rows) => join(rows.map(bar))

// ---- melody (D major, from the songwriter's engine-checked sheet)
const HOOK_HY = [[57, 1], [62, 1.5], [62, 0.5], [64, 1], [66, 1], [64, 0.5], [62, 1.5], [0, 1]]
const HOOK_DEE = [[62, 1], [66, 1.5], [66, 0.5], [69, 1], [69, 1], [67, 0.5], [66, 1.5], [0, 1]]
const SOMEDAY_1 = [[57, 1], [54, 2], [0, 1]]
const SOMEDAY_2 = [[59, 1], [57, 2], [0, 1]]
const BELONG = [[54, 0.5], [57, 1], [57, 0.5], [59, 0.5], [57, 0.5], [54, 1], [52, 0.5], [54, 0.5], [52, 0.5], [50, 0.5], [52, 0.5], [50, 1.5]]
// harmonies: Hy a diatonic sixth above (computed by the songwriter's checker), Dee an octave up
const HY = {
  s1: [[66, 1], [62, 2], [0, 1]],
  s2: [[67, 1], [66, 2], [0, 1]],
  belong: [[62, 0.5], [66, 1], [66, 0.5], [67, 0.5], [66, 0.5], [62, 1], [61, 0.5], [62, 0.5], [61, 0.5], [59, 0.5], [61, 0.5], [59, 1.5]],
  in1: [[66, 0.5], [66, 0.5], [62, 2], [0, 1]],
  in2: [[67, 0.5], [67, 0.5], [66, 2], [0, 1]],
}
const up12 = (ns) => ns.map(([m, d]) => [m > 0 ? m + 12 : m, d])

const LEAD = 1.0       // lead vol
const HARM = 0.42      // harmony vol (under the lead)
const KICK = 0.62
const HAND = 0.5
const SHOUT = 0.7

const chorus = (start, idp, lyric) => [
  { who: 'larry', id: `${idp}-a`, caption: true, start, lyrics: lyric[0], notes: lyric[0] === 'Someday!' ? SOMEDAY_1 : [[57, 0.5], [57, 0.5], [54, 2], [0, 1]] },
  { who: 'larry', id: `${idp}-b`, caption: true, start: start + 4, lyrics: lyric[1], notes: lyric[1] === 'Someday!' ? SOMEDAY_2 : [[59, 0.5], [59, 0.5], [57, 2], [0, 1]] },
  { who: 'larry', id: `${idp}-c`, caption: true, start: start + 8, lyrics: lyric[2], notes: BELONG },
]

export default {
  id: 'song',
  title: 'Someday (Built It)',
  gap: 0.28,
  beats: [
    // ---- Larry's intro at the desk
    { say: 'larry', id: 'intro-1', vol: 1.25, text: 'Folks, in the simcluster, a dream lasts about six minutes.',
      as: 'Folks, in the sim-cluster, a dream lasts about six minutes.' },
    { say: 'larry', id: 'intro-2', vol: 1.25, text: 'Then somebody ships it.', gap: 0.35 },
    { sfx: 'laugh', at: 0.05 },
    { say: 'larry', id: 'intro-4', vol: 1.25, text: 'Better sing it fast.', gap: 0.3 },
    { sfx: 'chuckle', at: 0.0, hold: 0.25 },
    { cue: 'band-in', at: 0.05 },

    // ---- block A: intro hook, verse 1, chorus 1 (bars 1–10, 40 beats)
    { music: { id: 'a', bpm: BPM, gap: 0.35, tracks: [
      { who: 'al', id: 'a-stomp', beat: stomp(40, [7, 27, 31]), vol: KICK },
      { who: 'pete', id: 'a-clap', beat: claps([CLAP, CLAP, CLAP, CLAP, CLAP, FILL, CRASH, CLAP, CLAP, CLAP]), vol: HAND },
      { who: 'hy', id: 'hook-hy', lyrics: 'whoa oh oh oh, whoa oh oh', notes: HOOK_HY, vol: 0.8 },
      { who: 'dee', id: 'hook-dee', lyrics: 'whoa oh oh oh, whoa oh oh', notes: HOOK_DEE, vol: 0.7 },
      { who: 'larry', id: 'v1-a', caption: true, start: 8, lyrics: 'Someday a weather report for the posts',
        notes: [[0, 0.5], [50, 0.5], [52, 0.5], [54, 0.5], [57, 1], [54, 0.5], [52, 0.5], [54, 1], [52, 0.5], [50, 0.5], [50, 1.5], [0, 0.5]] },
      { who: 'larry', id: 'v1-b', caption: true, start: 16, lyrics: 'with a high and a low and a warning for claims',
        notes: [[50, 0.5], [50, 0.5], [57, 1], [54, 0.5], [54, 0.5], [52, 1], [50, 0.5], [50, 0.5], [54, 0.5], [52, 0.5], [50, 0.5], [47, 1.5]] },
      ...chorus(24, 'c1', ['Someday!', 'Someday!', "we'll build a simcluster where all of us belong"]),
      { who: 'hy', start: 24, lyrics: 'Someday!', notes: HY.s1, vol: HARM },
      { who: 'hy', start: 28, lyrics: 'Someday!', notes: HY.s2, vol: HARM },
      { who: 'hy', start: 32, lyrics: "we'll build a simcluster where all of us belong", notes: HY.belong, vol: HARM },
      { who: 'dee', start: 24, lyrics: 'Someday!', notes: up12(SOMEDAY_1), vol: HARM * 0.8 },
      { who: 'dee', start: 28, lyrics: 'Someday!', notes: up12(SOMEDAY_2), vol: HARM * 0.8 },
      { who: 'dee', start: 32, lyrics: "we'll build a simcluster where all of us belong", notes: up12(BELONG), vol: HARM * 0.8 },
      { who: ['hy', 'dee', 'al'], shout: 'HEY!', as: 'hey', beats: [7, 27, 31], vol: SHOUT },
    ] } },

    // ---- stop bar: the first dream already exists
    { say: 'bot', id: 'built-1', vol: 1.25, text: 'Built it.', gap: 0.12, rate: 0.9 },
    { cue: 'built-1-end' },

    // ---- block B: verse 2, chorus 2 (bars 12–19); the gang has doubts: ARE WE?
    { music: { id: 'b', bpm: BPM, gap: 0.9, tracks: [
      { who: 'al', id: 'b-stomp', beat: stomp(32, [19, 23]), vol: KICK },
      { who: 'pete', id: 'b-clap', beat: claps([CLAP, CLAP, CLAP, FILL, CRASH, CLAP, CLAP, CLAP]), vol: HAND },
      { who: 'larry', id: 'v2-a', caption: true, lyrics: 'Someday a museum for all of the art',
        notes: [[0, 0.5], [50, 0.5], [52, 0.5], [54, 0.5], [57, 0.5], [59, 0.5], [57, 0.5], [54, 0.5], [54, 1], [52, 0.5], [50, 0.5], [50, 1.5], [0, 0.5]] },
      { who: 'larry', id: 'v2-b', caption: true, start: 8, lyrics: 'and the podcast with no name that we all know by heart',
        notes: [[50, 0.5], [50, 0.5], [57, 1], [54, 0.5], [54, 0.5], [52, 0.5], [52, 0.5], [50, 0.5], [50, 0.5], [54, 0.5], [52, 0.5], [50, 0.5], [47, 1.5]] },
      ...chorus(16, 'c2', ['Someday!', 'Someday!', "we'll build a simcluster where all of us belong"]),
      { who: 'hy', start: 16, lyrics: 'Someday!', notes: HY.s1, vol: HARM },
      { who: 'hy', start: 20, lyrics: 'Someday!', notes: HY.s2, vol: HARM },
      { who: 'hy', start: 24, lyrics: "we'll build a simcluster where all of us belong", notes: HY.belong, vol: HARM },
      { who: 'dee', start: 16, lyrics: 'Someday!', notes: up12(SOMEDAY_1), vol: HARM * 0.8 },
      { who: 'dee', start: 20, lyrics: 'Someday!', notes: up12(SOMEDAY_2), vol: HARM * 0.8 },
      { who: 'dee', start: 24, lyrics: "we'll build a simcluster where all of us belong", notes: up12(BELONG), vol: HARM * 0.8 },
      { who: ['hy', 'dee', 'al'], shout: 'ARE WE?', as: 'are we', beats: [19, 23], vol: SHOUT },
    ] } },

    // ---- stop bar: both of them
    { say: 'bot', id: 'built-2', vol: 1.25, text: 'Built it.', gap: 0.12, rate: 0.9 },
    { say: 'hy', id: 'both', vol: 1.25, text: 'Both of them?', gap: 0.2 },
    { cue: 'breakdown', at: 0.2 },

    // ---- block C1: the tender half-time breakdown, lights down (bars 21–22)
    { music: { id: 'c1', bpm: BPM, gap: 0.55, tracks: [
      { who: 'al', beat: 'B . . . | . . . . | . . . . | . . . . | . . . . | . . . . | . . . . | . . . .', vol: KICK * 0.8 },
      { who: 'pete', beat: '. . . . | . . . . | . . . . | . . . . | ! . . . | . . . . | . . . . | . . . .', vol: HAND * 0.8 },
      { who: 'hy', id: 'pad-hy-1', lyrics: 'oh', notes: [[62, 8]], vol: 0.35 },
      { who: 'dee', id: 'pad-dee-1', lyrics: 'oh', notes: [[66, 8]], vol: 0.3 },
      { who: 'larry', id: 'bd-a', caption: true, lyrics: 'Someday, maybe, someone will write us a song',
        notes: [[57, 1], [54, 1], [52, 0.5], [50, 1], [0, 0.5], [50, 0.5], [52, 0.5], [54, 0.5], [57, 0.5], [54, 0.5], [52, 0.5], [54, 1]] },
    ] } },

    // ---- block C2: after a two-beat breath, Larry finishes the thought (bars 23–24)
    { music: { id: 'c2', bpm: BPM, gap: 2 * 60 / BPM, tracks: [
      { who: 'al', beat: 'B . . . | . . . . | . . . . | . . . . | . . . . | . . . . | . . . . | . . . .', vol: KICK * 0.8 },
      { who: 'pete', beat: '. . . . | . . . . | . . . . | . . . . | ! . . . | . . . . | . . . . | . . . .', vol: HAND * 0.8 },
      { who: 'hy', id: 'pad-hy-2', lyrics: 'oh', notes: [[59, 8]], vol: 0.35 },
      { who: 'dee', id: 'pad-dee-2', lyrics: 'oh', notes: [[67, 8]], vol: 0.3 },
      { who: 'larry', id: 'bd-b', caption: true, lyrics: 'made out of mouths, and we all sing along',
        notes: [[57, 1], [57, 0.5], [54, 0.5], [59, 2], [54, 0.5], [54, 0.5], [52, 0.5], [54, 0.5], [52, 0.5], [50, 1.5]] },
    ] } },

    // ---- stop bars: the reveal
    { say: 'bot', id: 'built-3', vol: 1.25, text: 'Built it.', gap: 0.15, rate: 0.9 },
    { say: 'larry', id: 'when', vol: 1.25, text: 'When?', gap: 0.35 },
    { say: 'bot', id: 'in-it', vol: 1.25, text: 'You are in it.', as: 'You are. In it.', gap: 0.35, rate: 0.85 },
    { cue: 'reveal' },

    // ---- block D: clap-roll pickup + HEY, then the final chorus, everyone (bars 26–30 + the last HEY)
    { music: { id: 'd', bpm: BPM, gap: 0.3, tracks: [
      { who: 'pete', id: 'd-clap', beat: claps(['! . ! . ! ! ! !', CRASH, CLAP, CLAP, CLAP]) + ' | kch . . . . . . . . . . . . . . .', vol: HAND },
      { who: 'al', id: 'd-stomp', beat: stomp(19, [0, 1, 5, 9, 18]), vol: KICK },
      ...chorus(2, 'c3', ["We're in it!", "We're in it!", 'we built a simcluster where all of us belong']),
      { who: 'hy', start: 2, lyrics: "We're in it!", notes: HY.in1, vol: HARM },
      { who: 'hy', start: 6, lyrics: "We're in it!", notes: HY.in2, vol: HARM },
      { who: 'hy', start: 10, lyrics: 'we built a simcluster where all of us belong', notes: HY.belong, vol: HARM },
      { who: 'dee', start: 2, lyrics: "We're in it!", notes: up12([[57, 0.5], [57, 0.5], [54, 2], [0, 1]]), vol: HARM * 0.8 },
      { who: 'dee', start: 6, lyrics: "We're in it!", notes: up12([[59, 0.5], [59, 0.5], [57, 2], [0, 1]]), vol: HARM * 0.8 },
      { who: 'dee', start: 10, lyrics: 'we built a simcluster where all of us belong', notes: up12(BELONG), vol: HARM * 0.8 },
      { who: ['hy', 'dee', 'al'], shout: 'HEY!', as: 'hey', beats: [1, 5, 9, 18], vol: SHOUT },
      { who: 'larry', shout: 'HEY!', as: 'hey', beats: [5, 9, 18], vol: SHOUT * 0.8 },
    ] } },

    // ---- the tag: band out, Larry alone
    { cue: 'tag-in', at: 0.4 },
    { sing: 'larry', id: 'tag', bpm: 96, gap: 0.7, lyrics: "Someday we'll say something just as a joke",
      notes: [[57, 1], [54, 0.5], [54, 0.5], [57, 1], [54, 0.5], [52, 0.5], [52, 0.5], [50, 0.5], [50, 0.5], [50, 2.5]] },
    { wait: 0.6 },
    { say: 'bot', id: 'built-4', vol: 1.25, text: 'Built it.', gap: 0, rate: 0.9 },
    { sfx: 'biglaugh', at: 0.2, hold: 0.35 },
    { sfx: 'applause-long', at: -0.6, hold: 0.05 },

    // ---- button: Larry names the band; Hy notes what the song never got around to, and the
    // studio's safety counter resets (DAYS SINCE A P(DOOM) SONG TRENDED: 3 → 0)
    { say: 'larry', id: 'btn-1', vol: 1.25, text: 'Hy Oid and the Formants, everybody!', as: 'High Oid and the Formants, everybody!' },
    { say: 'hy', id: 'pdoom', vol: 1.25, text: "And we didn't even play upping my p(doom).",
      as: "And we didn't even play upping my pee-ee-doom.", gap: 0.25, rate: 0.92 },
    { cue: 'flip', at: 0.3 },
    { sfx: 'tick', at: 0.3, hold: 0 },
    { sfx: 'tick', at: 0.28, hold: 0 },
    { sfx: 'groan', at: 0.15, hold: 0.5 },
    // ---- the play-off: the room comes round, sting under a fresh wave of applause, the band bows
    { sfx: 'laugh', at: -0.25, hold: 0.18 },
    { cue: 'bow' },
    { sfx: 'sting', at: 0.05, hold: 0 },
    { sfx: 'applause', at: -0.6, hold: 1 },
  ],
}
