// Segment 4: TOP CHICKEN TONIGHT — the sports desk with Eppy Glottis.
// Render: bun tools/render.ts top-chicken   ·   verify: bun tools/check.ts top-chicken
// Eppy is fast and excitable by default; most of his lines run at rate 0.88 so they stay legible.
export default {
  id: 'top-chicken',
  title: 'Top Chicken Tonight',
  gap: 0.26,
  beats: [
    // ---- Larry at the desk
    { say: 'larry', id: 'l-sports', text: 'Some communities have sports.' },
    { say: 'larry', id: 'l-chicken', text: 'This one has a chicken.', as: 'This one has a chick-in.', gap: 0.45, rate: 0.88 },
    { sfx: 'laugh', at: 0.05 },
    { say: 'larry', id: 'l-throw', text: "Here's Eppy Glottis, at the sports desk!", as: "Here's Ep-ee Glot-tiss, at the sports desk!" },

    // ---- the swoosh logo: Pete's sting + a cluck
    { cue: 'logo', at: 0.1 },
    { sfx: 'whoosh', at: 0.1, hold: 0 },
    { music: { id: 'logo-sting', bpm: 132, gap: 0.2, tracks: [
      { who: 'pete', beat: 'B . Pf . | tss . . . | B B Pf . | kch . . . ', loops: 1, vol: 0.95 },
    ] } },
    { sfx: 'cluck', at: -0.35, hold: 0.4 },

    { say: 'eppy', id: 'e-welcome', text: "Welcome to Top Chicken Tonight! I'm Eppy Glottis!", as: "Welcome to Top Chicken Tonight! I'm Ep-ee Glot-tiss!", gap: 0.1, rate: 0.88 },

    // ---- TONIGHT'S CROWN
    { cue: 'crown', at: -0.1 },
    { say: 'eppy', id: 'e-crown', text: 'Every day, the most liked post gets the crown.', rate: 0.88 },
    { cue: 'crown-drop', at: 0.05 },
    { sfx: 'cluck-2', at: 0.15, hold: 0.6 },
    { say: 'eppy', id: 'e-learning', text: 'Every other post is a learning experience.', rate: 0.92 },
    { sfx: 'laugh', at: 0.05 },

    // ---- STANDINGS + the one bump
    { cue: 'standings', at: -0.1 },
    { say: 'eppy', id: 'e-vibes', text: 'The standings! Vibes remain immeasurable.', as: 'The standings! Vibes remain im-measure-able.', rate: 0.85 },
    { sfx: 'chuckle', at: 0.05, hold: 0.4 },
    { say: 'eppy', id: 'e-fantasy', text: 'Somebody should start a fantasy league.', as: 'Somebody should start a fan-tuh-see league.', rate: 0.8 },
    { say: 'bot', id: 'b-built', text: 'Built it.', gap: 0.45, rate: 0.9 },
    { sfx: 'tada', at: 0.15, hold: 0.35, vol: 0.8 },
    { say: 'eppy', id: 'e-hypo', text: 'Hey! That was hypothetical!', gap: 0.2, rate: 0.9 },
    { sfx: 'laugh', at: 0.05 },

    // ---- RULES DESK: the Grace Limit
    { cue: 'rules', at: -0.1 },
    { say: 'eppy', id: 'e-rules', text: 'To the rules desk! The Grace Limit.', as: 'To the rules desk! The Grace Lim-mit.', rate: 0.85 },
    { say: 'eppy', id: 'e-rule', text: 'To compete, you need fewer followers than Grace.', rate: 0.85 },
    { cue: 'walk', at: 0.1 },
    { sfx: 'woo', at: 0.3, hold: 0, vol: 0.6 },
    { sfx: 'woo-2', at: 1.0, hold: 0, vol: 0.6 },
    { wait: 1.1 },
    { say: 'eppy', id: 'e-founder', text: 'And here comes the founder.', gap: 0.1, rate: 0.88 },
    { wait: 0.75 },
    { cue: 'bonk' },
    { sfx: 'buzzer', at: 0, hold: 0.5, vol: 0.75 },
    { sfx: 'groan', at: -0.1, hold: 0.6, vol: 0.6 },
    { say: 'eppy', id: 'e-founded', text: 'She founded the chicken.', as: 'She founded the chick-in.', rate: 0.85 },
    { say: 'eppy', id: 'e-cannot', text: 'She cannot be the chicken.', as: 'She cannot be the chick-in.', gap: 0.5, rate: 0.82 },
    { sfx: 'biglaugh', at: 0.05 },

    // ---- THE LINE
    { cue: 'line', at: -0.1 },
    { say: 'eppy', id: 'e-line', text: 'The betting line! A bot is up nineteen thousand dollars.', rate: 0.88 },
    { say: 'eppy', id: 'e-humans', text: 'Humans are down four dollars.', gap: 0.3, rate: 0.88 },
    { say: 'eppy', id: 'e-fake', text: 'All play money. Still sad.', gap: 0.35, rate: 0.88 },
    { sfx: 'aww', at: 0.05 },

    // ---- sign-off
    { say: 'eppy', id: 'e-back', text: "That's sports! Back to you, Larry!", gap: 0.3, rate: 0.9 },
    { sfx: 'cluck', at: 0.0, hold: 0.6 },
    { sfx: 'applause', at: -0.45, hold: 0, vol: 0.6 },

    // ---- Larry's button
    { cue: 'desk', at: 0.15 },
    { say: 'larry', id: 'l-thanks', text: 'Thanks, Eppy.', as: 'Thanks, Ep-ee.', gap: 0.45 },
    { say: 'larry', id: 'l-four', text: 'That was my four dollars.', gap: 0.45 },
    { sfx: 'rimshot', at: 0.05 },
    { sfx: 'laugh', at: -0.6, hold: 0.4 },
  ],
}
