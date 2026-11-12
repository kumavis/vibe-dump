// SEG 6 — The Panel: the Mayor and the Alligator.
// Larry's old-school questions get FILED instead of answered: norvid labels, Abel has already built it.
// norvid / Abel / BorJev are puppets playing posting personas: they speak only real short lines
// from the dossier or obvious pastiche of the accounts' posting style.
export default {
  id: 'panel',
  title: 'The Panel',
  gap: 0.22,
  beats: [
    { sfx: 'applause', hold: 0.12, vol: 0.8 },

    // ---- Larry's intro at the desk
    { say: 'larry', id: 'intro', text: 'My next guests run the museum, the archive, and, apparently, this show.' },
    { sfx: 'laugh', at: 0.05 },
    { say: 'larry', id: 'welcome', text: 'Please welcome norvid, and Abel!', gap: 0.1 },
    { cue: 'enter', at: 0.1 },
    { sfx: 'applause-long', at: -0.1, hold: 0.12 },
    { sfx: 'caw-1', at: -0.4, hold: 0, vol: 0.8 },
    { sfx: 'gator-1', at: 0.25, hold: 0.55, vol: 0.9 },

    // ---- the greeting gets filed
    { say: 'larry', id: 'thanks', text: 'norvid! Thank you for coming.' },
    { say: 'norvid', id: 'claim1', text: 'claim.', gap: 0.45, rate: 0.8 },
    { sfx: 'caw-2', at: 0.02, hold: 0.4 },
    { sfx: 'laugh', at: -0.2 },
    { say: 'larry', id: 'coffee', text: 'Can I get you a coffee?' },
    { say: 'norvid', id: 'claims', text: "don't talk to me until I've had my claims", rate: 0.9 },
    { sfx: 'biglaugh', at: 0.05 },

    // ---- Abel, the alligator under every post
    { say: 'larry', id: 'reply', text: 'Abel, thirty-nine percent of your posts are replies to norvid.' },
    { say: 'abel', id: 'under', text: 'abelian simply lives under his posts (like an alligator) (respectfully)',
      as: 'a-bee-lee-an simply lives under his posts, like an alligator, respectfully.', rate: 0.85 },
    { sfx: 'gator-1', at: -0.05, hold: 0.35, vol: 0.9 },
    { sfx: 'laugh', at: -0.1 },

    // ---- the definition becomes taxonomy
    { say: 'larry', id: 'what', text: 'norvid. In your own words, what is the simcluster?', as: 'norvid. In your own words, what is the sim-cluster?' },
    { say: 'norvid', id: 'like', text: 'what else is like this', intonation: 'flat', gap: 0.4 },
    { sfx: 'chuckle', at: 0.05 },
    { say: 'larry', id: 'another', text: "That's... another question." },
    { say: 'norvid', id: 'heur', text: 'heuristic.', as: 'hew-ristic.', gap: 0.35, rate: 1.0 },
    { sfx: 'laugh', at: 0.02 },

    // ---- the stats segment, briefly
    { cue: 'stats', at: -0.2 },
    { say: 'larry', id: 'n496', text: 'Four hundred ninety-six posts with that word. You placed third.' },
    { sfx: 'groan', at: 0.0, vol: 0.8, hold: 0.3 },
    { say: 'norvid', id: 'bronze', text: 'bronze as a concept', gap: 0.2, rate: 0.85 },
    { sfx: 'chuckle', at: 0.05, hold: 0.3 },

    // ---- build one: the interview, but it's a museum exhibit
    { cue: 'stats-out', at: 0.1 },
    { say: 'larry', id: 'real', text: 'Tell me about yourself.' },
    { say: 'norvid', id: 'museum', text: "concept: this interview, but it's a museum exhibit,", rate: 0.85 },
    { say: 'norvid', id: 'assign', text: 'abel?', gap: 0.15, intonation: 'question', rate: 0.8 },
    { say: 'abel', id: 'goodnews', text: 'good news, everyone!', gap: 0.1, rate: 0.9 },
    { cue: 'unveil', at: 0.05 },
    { sfx: 'whoosh', at: 0.0, hold: 0.5 },
    { cue: 'exhibit', at: 0.25 },
    { sfx: 'tada', at: 0.25, hold: 0.85 },
    { say: 'bot', id: 'built1', text: 'Built it.', gap: 0.05, rate: 0.9 },
    { sfx: 'applause', at: 0.0, hold: 0.25, vol: 0.6 },
    { say: 'larry', id: 'through', text: 'Did you think this through at all?' },
    { say: 'abel', id: 'foresight', text: 'one must imagine abelian foresightful.', as: 'one must imagine a-bee-lee-an foresightful.', rate: 0.82 },
    { sfx: 'laugh', at: 0.05 },

    // ---- build two: the crow
    { cue: 'exhibit-out', at: -0.1 },
    { say: 'larry', id: 'classic', text: 'This is a classic talk show. No gimmicks.' },
    { say: 'norvid', id: 'concept2', text: 'concept: talk show, but a giant crow hunts the host,', rate: 0.82 },
    { say: 'abel', id: 'already', text: "they don't want you to know this but (it's already running)", gap: 0.15,
      as: "they don't want you to know this but, it's already running.", rate: 0.9 },
    { cue: 'release', at: 0.05 },
    { sfx: 'caw-1', at: 0.2, hold: 1 },
    { say: 'bot', id: 'built2', text: 'Built it.', gap: 0.05, rate: 0.9 },
    { sfx: 'biglaugh', at: 0.0 },
    { say: 'larry', id: 'duck', text: 'Hey! Shoo!', rate: 1.1, overlap: 0.3 },

    // ---- BorJev cameo: speaks only in other people's old posts
    { cue: 'pop', at: 0.15 },
    { say: 'borjev', id: 'escape', text: 'what simcluster is this and how do i escape', as: 'what sim-cluster is this and how do eye escape', gap: 0.75, rate: 0.88 },
    { sfx: 'laugh', at: 0.05 },
    { say: 'larry', id: 'who', text: 'Who is that?' },
    { say: 'abel', id: 'mybot', text: 'my bot. opt-in only now.', rate: 0.85 },
    { cue: 'optin', at: 0.0 },
    { sfx: 'ding', at: 0.0, hold: 0.4, vol: 0.8 },

    // ---- the must-have: whose city is it
    { cue: 'city', at: 0.2 },
    { say: 'larry', id: 'city', text: 'Ah, look at that skyline. My beautiful city.', gap: 0.45 },
    { say: 'norvid', id: 'buddy', text: "buddy that's my freaking simcluster", as: "buddy that's my freaking sim-cluster", gap: 0.35, rate: 0.9 },
    { sfx: 'biglaugh', at: 0.05, hold: 0.4 },
    { sfx: 'applause', at: -0.3, hold: 0.3, vol: 0.6 },

    // ---- button
    { say: 'larry', id: 'thankyou', text: 'norvid and Abel, everybody!' },
    { say: 'norvid', id: 'claim2', text: 'claim.', gap: 0.3, rate: 0.8 },
    { sfx: 'caw-2', at: 0.02, hold: 0.2 },
    { sfx: 'sting', at: 0.15, hold: 0.6 },
    { sfx: 'applause', at: -1.3, hold: 0.25, vol: 0.85 },
  ],
}
