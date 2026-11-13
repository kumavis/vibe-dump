// Segment 3: The Simcluster Channel, Local on the 8's. A credited tribute to @samantha.wiki's real
// "The Simcluster Channel" (weather.samantha.wiki, 2026-10-20), which forecasts the cluster's
// posts per hour with a small time-series model on a Raspberry Pi. Samantha is a puppet playing
// her posting persona: her lines are her own catchphrases / verbatim excerpts or obvious pastiche.
// Render: bun tools/render.ts weather --whisper
export default {
  id: 'weather',
  title: "The Simcluster Channel: Local on the 8's",
  gap: 0.3,
  beats: [
    // ---- Larry throws from the desk
    { say: 'larry', id: 'intro', text: 'The simcluster has a weather channel now.', as: 'The sim-cluster has a weather channel now.', rate: 0.95 },
    { say: 'larry', id: 'intro2', text: 'Naturally, it only forecasts itself.' },
    { sfx: 'chuckle', at: 0.05, hold: 0.25 },
    { say: 'larry', id: 'throw', text: 'Samantha, take it away!', gap: 0.2 },
    { cue: 'jingle', at: 0.1 },

    // ---- "Local on the 8's": a two-bar Formants smooth-jazz tag (Dee scat, Al walking bass,
    // Pete on brushes). Nothing is said over it: a bed under the forecast cost too many words.
    { music: { id: 'eights', bpm: 96, swing: 0.2, tracks: [
      { who: 'dee', id: 'tag', vol: 0.8,
        lyrics: 'doo bah doo bah dee, doo bah dee dah',
        notes: [[72, 1], [70, 0.5], [69, 0.5], [67, 1], [0, 1],
                [70, 1], [69, 0.5], [67, 0.5], [69, 0.5], [65, 1.5]] },
      { who: 'al', id: 'bass', vol: 0.45,
        lyrics: 'dum dum dum dum dum dum dum dum',
        notes: [[43, 1], [46, 1], [50, 1], [48, 1], [48, 1], [46, 1], [45, 1], [41, 1]] },
      { who: 'pete', id: 'brush', vol: 0.3, beat: 't . . t | t . t . ', loops: 4 },
    ] } },

    // ---- the forecast
    { say: 'samantha', id: 'channel', text: "You're watching The Simcluster Channel!", as: "You're watching the sim-cluster channel!", rate: 0.9, gap: 0.15 },
    { say: 'samantha', id: 'local', text: "And here's your Local on the 8's..", as: "And here's your local on the eights..", rate: 0.85 },
    { cue: 'map', at: 0.1 },
    { say: 'samantha', id: 'high', text: "Today's high: 177 posts per hour.", as: "Today's high: one-seventy-seven posts per hour.", rate: 0.9, gap: 0.45 },
    { say: 'samantha', id: 'low', text: 'The low is 29..', as: 'The low is twenty-nine..', rate: 0.9 },
    { cue: 'advisory', at: 0.2 },
    { say: 'samantha', id: 'claims', text: 'Please be advised of the Claims Advisory in Corvid Woods..', rate: 0.9, gap: 0.5 },
    { cue: 'stamp', at: 0.15 },
    { sfx: 'caw', at: 0.1, vol: 0.9 },
    { sfx: 'laugh', at: -0.3 },
    { cue: 'front', at: 0.6 },
    { say: 'samantha', id: 'piranesi', text: 'A Piranesi front moves in from the west..', as: 'A pier-ah-nay-see front moves in from the west..', rate: 0.9, gap: 0.6 },
    { say: 'samantha', id: 'reading', text: 'Expect two to three inches of assigned reading..', rate: 0.9 },
    { sfx: 'laugh', at: 0.05 },
    { cue: 'catoid', at: 0.2 },
    { say: 'samantha', id: 'catoid', text: 'Scattered catoids through the weekend..', as: 'Scattered cat-oids through the weekend..', rate: 0.9, gap: 0.3 },
    { say: 'samantha', id: 'synth', text: 'And tonight, a front of singing robot heads..', rate: 0.9 },
    { sfx: 'chuckle', at: 0.1, hold: 0.35 },
    { cue: 'outlook', at: 0.1 },
    { say: 'samantha', id: 'gm', text: 'Chance of gm: 100%.', as: 'Chance of good-morning: one-hundred-percent.', rate: 0.9, gap: 0.5 },
    { say: 'samantha', id: 'gn', text: 'Gn is still rare :(', as: 'Good-night is still rare, sadly.', rate: 0.9, gap: 0.35 },
    { sfx: 'aww', at: 0.05, hold: 0.45 },
    { say: 'larry', id: 'website', text: 'So, any chance of a website by morning?', rate: 0.95 },
    { say: 'samantha', id: 'hundred', text: 'Hundred percent.', rate: 0.9, gap: 0.25 },
    { say: 'samantha', id: 'shipped', text: 'It shipped during that sentence..', rate: 0.82, gap: 0.35 },
    { say: 'bot', id: 'builtit', text: 'Built it.', gap: 0.15, rate: 0.9 },
    { sfx: 'biglaugh', at: 0.15 },
    { cue: 'pi', at: 0.1 },
    { say: 'samantha', id: 'pi', text: 'This forecast runs on a Raspberry Pi..', rate: 0.85, gap: 0.1 },
    { say: 'samantha', id: 'back', text: 'Back to you, Larry..', rate: 0.9 },
    { cue: 'desk', at: 0.15 },
    { say: 'larry', id: 'button', text: 'Thank you, Samantha. Bring a book, everybody.', gap: 0.45, rate: 0.95 },
    { sfx: 'rimshot', at: 0.1 },
    { sfx: 'applause', at: -0.5, hold: 0.3 },
  ],
}
