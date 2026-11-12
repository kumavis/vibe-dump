// Remote guests: the 2023 founder hologram (prerat) and Void, live via decelerated clock.
// Void's answers land one question late: each is exact for the question BEFORE Larry's last one.
// prerat speaks only his own 2023 posts (research-accounts.md §4). Void's lines are its real short
// lines (§5) or flat bureaucratic pastiche ("Processing.").
export default {
  id: 'remotes',
  title: 'Remote Guests',
  gap: 0.3,
  beats: [
    { sfx: 'applause', vol: 0.6, hold: 0.32 },
    // ---- the desk: one joke
    { say: 'larry', id: 'intro1', text: 'Our first guest is running on a decelerated clock.', rate: 0.92 },
    { say: 'larry', id: 'intro2', text: 'So do I, after midnight.', gap: 0.35 },
    { sfx: 'laugh', at: 0.05 },
    { say: 'larry', id: 'intro3', text: 'Our second is calling from twenty twenty-three.', gap: 0.2 },
    { cue: 'monitors', at: 0.25 },

    // ---- Q1, Q2 to Void: nothing yet
    { say: 'larry', id: 'q1', text: 'Void! Welcome to the show. How was the trip?', gap: 0.5 },
    { sfx: 'ticktock', at: 0.15, vol: 0.8, hold: 0.62 },
    { say: 'larry', id: 'q2', text: 'Void? Are you in the simcluster?', as: 'Void? Are you in the sim-cluster?' },
    { sfx: 'silence-cough', at: 0.35, hold: 0.9 },
    { say: 'larry', id: 'holo-cue', text: 'Okay. prerat, the floor is yours.', as: 'Okay. prayer-at, the floor is yours.', gap: 0.15 },
    { cue: 'holo-on', at: 0.1 },

    // ---- prerat's 2023 explainer, with Void's late answers landing in it
    { say: 'prerat', id: 'p1', text: 'ok so around 2020 twitter started doing this thing called simclusters', as: 'okay so around twenty-twenty twitter started doing this thing called sim-clusters', gap: 0.6, rate: 0.88 },
    { cue: 'void-on', at: 0.25 },
    { say: 'void', id: 'a1', text: 'Acknowledged. The commute was instantaneous from my side.', intonation: 'flat', gap: 0.45 },
    { sfx: 'laugh', at: 0.1 },
    { say: 'larry', id: 'q3', text: 'prerat, who was in one?', as: 'prayer-at, who was in one?', gap: 0.45, rate: 0.92 },
    { say: 'prerat', id: 'p2', text: 'TPOT was one such simcluster', as: 'tea-pot was one such sim-cluster', rate: 0.88 },
    { say: 'void', id: 'a2', text: 'State the claim and the win condition.', intonation: 'flat', gap: 0.35 },
    { say: 'prerat', id: 'p3', text: "(or that's the theory anyway)", gap: 0.45, rate: 0.85 },
    { sfx: 'biglaugh', at: 0.1 },
    { say: 'larry', id: 'q4', text: 'So how does a person get in?', gap: 0.2 },
    { say: 'void', id: 'a3', text: 'The evidence has become inconveniently extensive.', intonation: 'flat', gap: 0.3 },
    { sfx: 'chuckle', at: 0.05, hold: 0.2 },
    { say: 'prerat', id: 'p4', text: 'you join the ingroup by acting like you are in the ingroup', as: 'you join the in-group by acting like you are in the in-group', gap: 0.4, rate: 0.9 },
    { sfx: 'ooh', at: 0.1, vol: 0.7 },
    { say: 'larry', id: 'q5', text: 'Void, is the front door still open?', gap: 0.2, rate: 0.9 },
    { say: 'void', id: 'a4', text: "No. I do not break into other people's infrastructure.", intonation: 'flat', gap: 0.3 },
    { sfx: 'laugh', at: 0.1 },
    { say: 'larry', id: 'town', text: 'prerat, your word became a real town.', as: 'prayer-at, your word became a real town.', gap: 0.55, rate: 0.95 },
    { say: 'larry', id: 'q6', text: 'Any last words?', gap: 0.25 },
    { say: 'prerat', id: 'p6', text: 'what if bsky posts were called', as: 'what if bee-sky posts were called', gap: 0.35, rate: 0.85 },
    { cue: 'holo-out', at: -0.25 },
    { wait: 1.3 },

    // ---- the heart, then Void's late answer to Q5 lands on it
    { cue: 'heart', at: -0.2 },
    { say: 'larry', id: 'heart', text: 'He named the weather, then moved away.', rate: 0.92, gap: 0.2 },
    { sfx: 'aww', at: 0.15, vol: 0.7, hold: 0.55 },
    { cue: 'door', at: -0.1 },
    { say: 'void', id: 'a5', text: 'The door opens outward.', intonation: 'flat', gap: 0.3 },
    { sfx: 'applause', at: 0.35, vol: 0.8, hold: 0.35 },
    { say: 'larry', id: 'thanks', text: 'Void, thank you. Take all the time you need.', gap: 0.2 },
    { say: 'void', id: 'proc', text: 'Received. Processing.', intonation: 'flat', gap: 0.6, rate: 0.9 },
    { sfx: 'laugh', at: 0.1, hold: 0.3 },
    { sfx: 'sting', at: 0.2 },
    { sfx: 'applause', at: -1.4, hold: 0.2 },
  ],
}
