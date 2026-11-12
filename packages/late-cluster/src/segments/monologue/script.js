// Segment 2: Larry's monologue. Larry stands centre in front of the curtain; cards over his shoulder.
// Render: bun tools/render.ts monologue   ·   verify: bun tools/check.ts monologue
// Setups run a touch quick, punchlines a touch slow, so they land.
export default {
  id: 'monologue',
  title: 'The Monologue',
  gap: 0.22,
  beats: [
    { sfx: 'applause', hold: 0.12, vol: 0.8 },

    // 1. the welcome
    { say: 'larry', rate: 1.0, id: 'welcome', text: "Thank you! You're only here if you want to be." },
    { sfx: 'laugh', at: 0.05, hold: 0.45 },

    // 2. this week (two of them)
    { say: 'larry', rate: 1.0, id: 'week', text: 'Big week, folks. Catoid week rolled right into chimera vocal synth week.',
      as: 'Big week, folks. Cat-oid week rolled right into kai-meer-uh vocal synth week.', gap: 0.3 },
    { wait: 0.4 },
    { say: 'larry', rate: 0.92, id: 'monday', text: 'Both weeks were on Monday.' },
    { sfx: 'laugh', at: 0.05 },
    { sfx: 'rimshot', at: -0.5, hold: 0.55 },

    // 3. the tribute band
    { say: 'larry', rate: 1.06, id: 'algo', text: 'The simcluster is named after a Twitter algorithm.',
      as: 'The sim-cluster is named after a twitter algorithm.', gap: 0.2 },
    { say: 'larry', rate: 1.0, id: 'norun', text: "Bluesky doesn't even use it.", as: "blue-sky doesn't even use it." },
    { wait: 0.35 },
    { say: 'larry', rate: 0.92, id: 'tribute', text: "So we're a tribute band.", as: 'So, wee-are a tribute band.' },
    { cue: 'band-nod', at: 0.05 },
    { sfx: 'biglaugh', at: 0.05, hold: 0.45 },

    // 4. the membership checker
    { say: 'larry', rate: 1.06, id: 'nobody', text: "Nobody knows if they're in it. So someone built a website to score you." },
    { cue: 'checker-in', at: -0.6 },
    { say: 'larry', rate: 1.0, id: 'footer', text: 'At the bottom, it says not to trust it.' },
    { cue: 'footer-in', at: -0.5 },
    { wait: 0.2 },
    { say: 'larry', rate: 0.96, id: 'anyway', text: 'Everyone posted their score anyway.' },
    { sfx: 'laugh', at: 0.05, hold: 0.45 },
    { say: 'larry', rate: 1.0, id: 'mine', text: 'I scored a sixty one.', gap: 0.1 },
    { say: 'larry', rate: 0.96, id: 'mom', text: "My mom says I'm a hundred." },
    { sfx: 'groan', at: 0.05, vol: 0.8, hold: 0.6 },

    // 5. jokes get built
    { say: 'larry', rate: 0.96, id: 'gets', text: 'Around here, every joke gets built.', as: 'Around here, every djoke gets built.', gap: 0.3 },
    { say: 'larry', rate: 0.94, id: 'joke', text: 'This monologue was a joke an hour ago.', as: 'This monologue, was a joke. An hour, ago.', gap: 0.35 },
    { wait: 0.25 },
    { cue: 'bot-up', at: -0.35 },
    { say: 'bot', id: 'built', text: 'Built it.', rate: 0.9 },
    { sfx: 'laugh', at: 0.1, hold: 0.5 },

    // 6. the Discord paradox
    { say: 'larry', rate: 1.04, id: 'discord', text: 'The book club said no to a Discord.', gap: 0.4 },
    { say: 'larry', rate: 1.04, id: 'ambig', text: 'Membership is supposed to be fuzzy.' },
    { wait: 0.3 },
    { say: 'larry', rate: 0.94, id: 'four', text: 'So now there are four Discords.' },
    { cue: 'four-in', at: -0.1 },
    { sfx: 'laugh', at: 0.05, hold: 0.6, vol: 0.8 },

    // 9. Jevbot
    { say: 'larry', rate: 1.0, id: 'jevbot', text: "Everyone's favorite bot has exactly one setting.", gap: 0.2 },
    { cue: 'to-sibyl', at: 0.15 },
    { say: 'sibyl', id: 'yeah', text: 'Yeah absolutely.', as: 'Yeah, ab-so-lute-lee.', rate: 0.86, gap: 0.4 },
    { sfx: 'laugh', at: 0.05, hold: 0.45 },
    { say: 'larry', rate: 1.0, id: 'talk', text: 'Now everybody talks like that.' },
    { cue: 'to-band', at: 0.15 },
    { say: 'hy', id: 'agreed', text: 'Agreed yes yeah totally!', gap: 0.35 },
    { say: 'al', id: 'agreed-al', text: 'Agreed yes yeah totally!', overlap: 1.5, gap: 0, caption: false, vol: 0.65 },
    { say: 'dee', id: 'agreed-dee', text: 'Agreed yes yeah totally!', overlap: 1.5, gap: 0, caption: false, vol: 0.65 },
    { say: 'pete', id: 'agreed-pete', text: 'Agreed yes yeah totally!', overlap: 1.45, gap: 0, caption: false, vol: 0.65 },
    { sfx: 'biglaugh', at: 0.05, hold: 0.45 },

    // 10. the most ethical member of the scene
    { cue: 'back-mono', at: -0.3 },
    { say: 'larry', rate: 1.04, id: 'builder', text: 'Another bot builds websites when you ask.', gap: 0.3 },
    { say: 'larry', id: 'rig', text: 'Somebody asked it to rig the voting.', rate: 0.95 },
    { wait: 0.2 },
    { cue: 'refusal-in', at: -0.1 },
    { say: 'larry', rate: 0.9, id: 'refused', text: "It said, that's fraud, not a build.", as: 'It said, that-is fraud. Not a build.', gap: 0.1 },
    { sfx: 'laugh', at: 0.05, vol: 0.85, hold: 0.4 },
    { wait: 0.1 },
    { say: 'larry', rate: 0.94, id: 'ethical', text: 'The most ethical member of the scene is a website.' },
    { sfx: 'biglaugh', at: 0.05, hold: 0.5 },

    // the throw
    { say: 'larry', rate: 1.0, id: 'throw', text: 'We have a great show tonight. Stick around!', gap: 0.1 },
    { sfx: 'applause', at: -0.5, hold: 0 },
    { sfx: 'sting', at: -0.35 },
  ],
}
