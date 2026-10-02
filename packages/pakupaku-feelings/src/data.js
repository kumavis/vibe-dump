// The words on the paper.
//
// Three layers, read from the middle outward:
//
//   core feeling  →  a closer word for it  →  the needs it may be pointing at
//
// The core words are deliberately plain — the kind a six-year-old already has.
// They sit around the fortune teller on a mood-meter circle: pleasant on the
// right, painful on the left, high energy at the top, low at the bottom, so
// neighbours are related (Calm sits next to Tired, Excited next to Angry).
//
// The needs come from Nonviolent Communication (Marshall Rosenberg; the Center
// for Nonviolent Communication's Needs Inventory). Two ideas carry the whole
// thing:
//
//   * Feelings are messengers. Pleasant ones say a need is being met; painful
//     ones say a need is asking for care.
//   * Needs are universal and are never about a particular person or action.
//     "I need you to call me" is a strategy; the need under it might be
//     reassurance, or closeness. Naming the need opens up more ways to meet it.
//
// So every closer word lists a handful of needs, and every need says what it
// is, one small thing you could try for yourself, and one request you could
// make of someone else (the fourth step of NVC: observation, feeling, need,
// request).

// The seven families from the CNVC Needs Inventory. Colour is the petal colour
// when a need unfolds on the wheel.
export const FAMILIES = {
  connection: { name: 'Connection', color: '#f07fa2' },
  wellbeing: { name: 'Well-being', color: '#7dc46c' },
  honesty: { name: 'Honesty', color: '#62a0e3' },
  play: { name: 'Play', color: '#f8c64a' },
  peace: { name: 'Peace', color: '#4dbfae' },
  autonomy: { name: 'Autonomy', color: '#f59a54' },
  meaning: { name: 'Meaning', color: '#a57ed8' },
}

// `means` finishes "… is about ___". `try` is something to do for yourself.
// `ask` finishes "Would you be willing to ___?" — an NVC request: specific,
// doable, about now, and said as what you'd like rather than what to stop.
// `said`, where present, is how the need reads after "because I need ___"
// when its bare name would sound odd there.
export const NEEDS = {
  // connection
  acceptance: {
    family: 'connection',
    means: 'being welcome just as you are',
    try: 'Say one kind thing to yourself that you would say to a friend.',
    ask: 'tell me one thing you like about me',
  },
  affection: {
    family: 'connection',
    means: 'giving and getting love',
    try: 'Hug someone you love, a pet, or a big pillow.',
    ask: 'give me a hug',
  },
  appreciation: {
    family: 'connection',
    means: 'having what you do noticed and valued',
    try: 'Write down one thing you did today that helped.',
    ask: 'tell me one thing I did that made a difference to you',
  },
  belonging: {
    family: 'connection',
    means: 'being part of a “we”',
    try: 'Spend a little time with your people: family, friends, a team, a club.',
    ask: 'save me a seat next time',
  },
  care: {
    family: 'connection',
    means: 'being looked after',
    try: 'Do one gentle thing for your body: water, a snack, a blanket.',
    ask: 'check in on me later today',
  },
  closeness: {
    family: 'connection',
    means: 'feeling near to someone',
    try: 'Look at a photo of someone you love, then send them a message.',
    ask: 'spend some time with just me',
  },
  companionship: {
    family: 'connection',
    means: 'having someone to be with',
    try: 'Call or text someone just to say hi.',
    ask: 'do something with me, even something small',
  },
  compassion: {
    family: 'connection',
    means: 'kindness for when things are hard',
    try: 'Put a hand on your heart and say: “This is hard, and I am doing my best.”',
    ask: 'be gentle with me today',
  },
  consideration: {
    family: 'connection',
    means: 'others keeping your needs in mind',
    try: 'Say out loud what matters to you here.',
    ask: 'check with me before deciding',
  },
  cooperation: {
    family: 'connection',
    means: 'working together instead of against',
    try: 'Find one thing you and the other person both want.',
    ask: 'figure this out together with me',
  },
  empathy: {
    family: 'connection',
    means: 'someone feeling it with you',
    try: 'Tell the feeling to someone who will just listen.',
    ask: 'listen for a few minutes, without fixing anything',
  },
  inclusion: {
    family: 'connection',
    means: 'being invited in',
    try: 'Invite someone else in. It often opens the door both ways.',
    ask: 'include me next time you make plans',
  },
  mutuality: {
    family: 'connection',
    means: 'give and take that feels even',
    try: 'Notice what you give and what you get back.',
    ask: 'take turns with me on this',
  },
  reassurance: {
    family: 'connection',
    means: 'hearing that things will be okay',
    try: 'Name three things that are okay right now.',
    ask: 'tell me that we are okay',
  },
  respect: {
    family: 'connection',
    means: 'being treated as someone who matters',
    try: 'Stand tall and say what you want, kindly and clearly.',
    ask: 'use a calmer voice with me',
  },
  stability: {
    family: 'connection',
    means: 'things being steady and easy to predict',
    try: 'Keep one small routine today, like the same song before bed.',
    ask: 'tell me what is going to happen next',
  },
  support: {
    family: 'connection',
    means: 'help carrying what is heavy',
    try: 'Write a list, and circle one thing someone else could help with.',
    ask: 'help me with one part of this',
  },
  'to be seen': {
    family: 'connection',
    means: 'being noticed for who you really are',
    try: 'Share one true thing about your day with someone.',
    ask: 'listen while I tell you about my day',
  },
  trust: {
    family: 'connection',
    means: 'being able to count on someone, or on yourself',
    try: 'Remember a time you got through something hard.',
    ask: 'tell me your plan, so I know what to expect',
  },
  understanding: {
    family: 'connection',
    means: 'being heard, and making sense of each other',
    try: 'Write down what you would want them to know.',
    ask: 'tell me back what you heard me say',
  },
  warmth: {
    family: 'connection',
    means: 'kindness you can feel',
    try: 'Wrap up in something soft and have a warm drink.',
    ask: 'sit close with me for a bit',
  },

  // physical well-being
  air: {
    family: 'wellbeing',
    means: 'fresh air and room to breathe',
    try: 'Open a window or step outside for one minute.',
    ask: 'step outside with me for a minute',
  },
  comfort: {
    family: 'wellbeing',
    means: 'ease in your body',
    try: 'Change into something soft and find a cosy spot.',
    ask: 'let me get comfy before we talk',
  },
  food: {
    family: 'wellbeing',
    means: 'fuel when you are hungry',
    try: 'Eat a snack. Hunger often hides inside other feelings.',
    ask: 'share a snack with me',
  },
  movement: {
    family: 'wellbeing',
    means: 'letting your body move',
    try: 'Shake out your arms, stretch, or walk around the block.',
    ask: 'go for a walk with me',
  },
  rest: {
    family: 'wellbeing',
    means: 'time to stop and recharge',
    try: 'Lie down for ten minutes with your eyes closed.',
    ask: 'give me some quiet time to recharge',
  },
  safety: {
    family: 'wellbeing',
    means: 'knowing you are protected',
    try: 'Go somewhere that feels safe and take three slow breaths.',
    ask: 'stay with me until I feel steady',
  },
  water: {
    family: 'wellbeing',
    means: 'a drink when you are thirsty',
    try: 'Drink a glass of water, slowly.',
    ask: 'bring me a glass of water',
  },

  // honesty
  authenticity: {
    family: 'honesty',
    means: 'being the real you',
    try: 'Do one small thing today that feels like you.',
    ask: 'let me do it my way this time',
  },
  integrity: {
    family: 'honesty',
    means: 'acting the way you believe is right',
    try: 'Ask yourself: what would the person I want to be do next?',
    ask: 'help me make this right',
  },
  presence: {
    family: 'honesty',
    said: 'to be present',
    means: 'being here, right now',
    try: 'Notice five things you can see and four you can hear.',
    ask: 'put the screens away with me for a while',
  },

  // play
  fun: {
    family: 'play',
    means: 'doing something just because it is fun',
    try: 'Play for ten minutes: a game, a doodle, a ball.',
    ask: 'play a game with me',
  },
  humor: {
    family: 'play',
    means: 'laughter and lightness',
    try: 'Watch or read something that makes you laugh.',
    ask: 'tell me the silliest thing that happened to you this week',
  },
  joy: {
    family: 'play',
    means: 'gladness for its own sake',
    try: 'Put on a song you love.',
    ask: 'dance with me to one song',
  },

  // peace
  beauty: {
    family: 'peace',
    means: 'loveliness that fills you up',
    try: 'Look at the sky for one whole minute.',
    ask: 'show me something beautiful you found',
  },
  ease: {
    family: 'peace',
    means: 'things flowing without a struggle',
    try: 'Pick the easiest next step and do only that.',
    ask: 'help me make this simpler',
  },
  fairness: {
    family: 'peace',
    means: 'everyone getting a fair share and a fair turn',
    try: 'Say what would feel fair to you, out loud or on paper.',
    ask: 'work out a fair plan with me',
  },
  harmony: {
    family: 'peace',
    means: 'getting along, inside and out',
    try: 'Find one small thing you can agree on.',
    ask: 'take a break with me and try again later',
  },
  inspiration: {
    family: 'peace',
    means: 'something that lifts you up',
    try: 'Read or watch something by someone you admire.',
    ask: 'tell me about something that excites you',
  },
  order: {
    family: 'peace',
    means: 'things making sense and being in their place',
    try: 'Tidy one small corner, or write a short list.',
    ask: 'help me sort this out, one step at a time',
  },

  // autonomy
  choice: {
    family: 'autonomy',
    means: 'having a say',
    try: 'Find one thing here that you can choose.',
    ask: 'give me two options to choose from',
  },
  space: {
    family: 'autonomy',
    means: 'room to be on your own',
    try: 'Take ten minutes alone somewhere quiet.',
    ask: 'give me a little space, and I will come back',
  },
  spontaneity: {
    family: 'autonomy',
    means: 'doing what you feel like, when you feel like it',
    try: 'Do one unplanned thing, like taking a new way home.',
    ask: 'do something unplanned with me',
  },

  // meaning
  celebration: {
    family: 'meaning',
    said: 'to celebrate',
    means: 'marking what is good',
    try: 'Tell someone your good news.',
    ask: 'celebrate this with me',
  },
  challenge: {
    family: 'meaning',
    means: 'a stretch that is just hard enough',
    try: 'Set yourself a small challenge with a timer.',
    ask: 'give me something harder to try',
  },
  clarity: {
    family: 'meaning',
    means: 'knowing what is going on',
    try: 'Write down what you know and what you do not know yet.',
    ask: 'tell me exactly what you mean',
  },
  competence: {
    family: 'meaning',
    means: 'being able to do things well',
    try: 'Practise one small piece of the skill.',
    ask: 'show me how you would do it',
  },
  contribution: {
    family: 'meaning',
    said: 'to contribute',
    means: 'making life better for others',
    try: 'Help someone with something small today.',
    ask: 'let me help you with something',
  },
  creativity: {
    family: 'meaning',
    means: 'making something new',
    try: 'Draw, build or write something, with no rules.',
    ask: 'make something with me',
  },
  discovery: {
    family: 'meaning',
    means: 'finding something new',
    try: 'Look up one thing you have always wondered about.',
    ask: 'explore somewhere new with me',
  },
  effectiveness: {
    family: 'meaning',
    means: 'your effort making things happen',
    try: 'Break it into one tiny step you can finish now.',
    ask: 'help me find what is getting in the way',
  },
  growth: {
    family: 'meaning',
    means: 'getting better over time',
    try: 'Notice one thing you can do now that you could not do before.',
    ask: 'tell me what you see me getting better at',
  },
  hope: {
    family: 'meaning',
    means: 'believing good things can still happen',
    try: 'Write down one thing you are looking forward to.',
    ask: 'tell me about a time things got better',
  },
  learning: {
    family: 'meaning',
    means: 'understanding more',
    try: 'Ask a question. Any question.',
    ask: 'explain it to me once more, slowly',
  },
  mourning: {
    family: 'meaning',
    said: 'time to be sad about it',
    means: 'giving a loss the sadness it deserves',
    try: 'Let yourself feel it. Tears are okay.',
    ask: 'just be with me while I am sad',
  },
  participation: {
    family: 'meaning',
    said: 'to take part',
    means: 'getting to take part',
    try: 'Join in with one thing, even for a little while.',
    ask: 'let me have a turn',
  },
  purpose: {
    family: 'meaning',
    means: 'a reason that matters to you',
    try: 'Remind yourself why this matters to you.',
    ask: 'remind me what we are doing this for',
  },
  'self-expression': {
    family: 'meaning',
    said: 'to express myself',
    means: 'showing what is inside you',
    try: 'Draw or write how you feel.',
    ask: 'let me finish what I am saying',
  },
  stimulation: {
    family: 'meaning',
    means: 'something interesting to sink into',
    try: 'Try something new for five minutes.',
    ask: 'teach me something you know',
  },
  'to matter': {
    family: 'meaning',
    means: 'knowing you make a difference',
    try: 'Do something kind for someone and notice how it lands.',
    ask: 'tell me what I mean to you',
  },
}

// `angle` is where the feeling's triangle points, in degrees clockwise from
// "east" (screen coordinates). The eight triangles of a flattened fortune
// teller are centred on the odd multiples of 22.5°.
export const CORES = [
  {
    id: 'excited',
    word: 'Excited',
    angle: -67.5,
    met: true,
    color: '#f5953a',
    gist: 'Buzzing and lit up. Something has caught your attention.',
    closer: [
      { id: 'curious', word: 'Curious', gist: 'wanting to know more', needs: ['discovery', 'learning', 'stimulation', 'growth'] },
      { id: 'eager', word: 'Eager', gist: 'cannot wait to start', needs: ['participation', 'challenge', 'stimulation', 'purpose'] },
      { id: 'hopeful', word: 'Hopeful', gist: 'looking forward to something good', needs: ['hope', 'growth', 'trust', 'clarity'] },
      { id: 'inspired', word: 'Inspired', gist: 'full of ideas, wanting to make something', needs: ['inspiration', 'creativity', 'self-expression', 'purpose'] },
      { id: 'amazed', word: 'Amazed', gist: 'wide-eyed at something wonderful', needs: ['beauty', 'discovery', 'inspiration', 'presence'] },
      { id: 'confident', word: 'Confident', gist: 'sure you can handle this', needs: ['competence', 'trust', 'growth', 'challenge'] },
    ],
  },
  {
    id: 'happy',
    word: 'Happy',
    angle: -22.5,
    met: true,
    color: '#f7c641',
    gist: 'Light and bright inside. Something is going well.',
    closer: [
      { id: 'joyful', word: 'Joyful', gist: 'full of bright, bubbly gladness', needs: ['joy', 'celebration', 'presence', 'beauty'] },
      { id: 'cheerful', word: 'Cheerful', gist: 'light and sunny, ready to smile', needs: ['joy', 'humor', 'ease', 'companionship'] },
      { id: 'playful', word: 'Playful', gist: 'silly, bouncy, up for a game', needs: ['fun', 'spontaneity', 'humor', 'companionship'] },
      { id: 'proud', word: 'Proud', gist: 'glad about something you did', needs: ['competence', 'growth', 'to matter', 'celebration'] },
      { id: 'amused', word: 'Amused', gist: 'tickled by something funny', needs: ['humor', 'fun', 'ease', 'spontaneity'] },
      { id: 'delighted', word: 'Delighted', gist: 'lit up by a lovely surprise', needs: ['beauty', 'joy', 'discovery', 'celebration'] },
    ],
  },
  {
    id: 'loving',
    word: 'Loving',
    angle: 22.5,
    met: true,
    color: '#ee7aa0',
    gist: 'Warm toward someone. Your heart feels open.',
    closer: [
      { id: 'thankful', word: 'Thankful', gist: 'glad for what someone gave or did', needs: ['appreciation', 'support', 'contribution', 'celebration'] },
      { id: 'warm', word: 'Warm', gist: 'soft and open toward someone', needs: ['affection', 'warmth', 'belonging', 'acceptance'] },
      { id: 'tender', word: 'Tender', gist: 'gentle, wanting to look after someone', needs: ['care', 'closeness', 'compassion', 'affection'] },
      { id: 'close', word: 'Close', gist: 'near someone, heart to heart', needs: ['closeness', 'trust', 'to be seen', 'companionship'] },
      { id: 'friendly', word: 'Friendly', gist: 'open, wanting to share and join in', needs: ['companionship', 'cooperation', 'belonging', 'fun'] },
      { id: 'touched', word: 'Touched', gist: 'moved by something kind or beautiful', needs: ['to matter', 'appreciation', 'beauty', 'inspiration'] },
    ],
  },
  {
    id: 'calm',
    word: 'Calm',
    angle: 67.5,
    met: true,
    color: '#5cbb78',
    gist: 'Settled and easy. Things feel okay right now.',
    closer: [
      { id: 'relaxed', word: 'Relaxed', gist: 'loose and unhurried', needs: ['rest', 'ease', 'space', 'comfort'] },
      { id: 'peaceful', word: 'Peaceful', gist: 'quiet inside, nothing pulling at you', needs: ['harmony', 'ease', 'beauty', 'presence'] },
      { id: 'content', word: 'Content', gist: 'this is enough, just as it is', needs: ['ease', 'stability', 'acceptance', 'order'] },
      { id: 'relieved', word: 'Relieved', gist: 'a weight just lifted', needs: ['safety', 'reassurance', 'ease', 'rest'] },
      { id: 'comfortable', word: 'Comfortable', gist: 'cosy and at ease in your body', needs: ['comfort', 'warmth', 'safety', 'ease'] },
      { id: 'satisfied', word: 'Satisfied', gist: 'something got done, and done well', needs: ['competence', 'effectiveness', 'purpose', 'contribution'] },
    ],
  },
  {
    id: 'tired',
    word: 'Tired',
    angle: 112.5,
    met: false,
    color: '#45a7b3',
    gist: 'Low on fuel. Your body or mind is asking for a break.',
    closer: [
      { id: 'sleepy', word: 'Sleepy', gist: 'eyes heavy, body asking for bed', needs: ['rest', 'comfort', 'ease', 'space'] },
      { id: 'worn-out', word: 'Worn out', gist: 'used up after a long stretch', needs: ['rest', 'support', 'ease', 'care'] },
      { id: 'drained', word: 'Drained', gist: 'nothing left in the tank', needs: ['rest', 'food', 'water', 'space'] },
      { id: 'bored', word: 'Bored', gist: 'nothing here grabs you', needs: ['stimulation', 'fun', 'challenge', 'creativity'] },
      { id: 'burned-out', word: 'Burned out', gist: 'tired all the way down, for a long time', needs: ['rest', 'support', 'purpose', 'choice'] },
      { id: 'sluggish', word: 'Sluggish', gist: 'moving through syrup', needs: ['movement', 'air', 'water', 'food'] },
      { id: 'foggy', word: 'Foggy', gist: 'thoughts blurry and slow', needs: ['clarity', 'rest', 'order', 'air'] },
    ],
  },
  {
    id: 'sad',
    word: 'Sad',
    angle: 157.5,
    met: false,
    color: '#4e89d6',
    gist: 'Heavy and slow. Something that matters feels missing.',
    closer: [
      { id: 'lonely', word: 'Lonely', gist: 'wishing someone were with you', needs: ['companionship', 'belonging', 'closeness', 'to be seen'] },
      { id: 'disappointed', word: 'Disappointed', gist: 'it did not turn out how you hoped', needs: ['mourning', 'hope', 'trust', 'consideration'] },
      { id: 'hurt', word: 'Hurt', gist: 'something someone said or did stings', needs: ['care', 'respect', 'empathy', 'understanding'] },
      { id: 'gloomy', word: 'Gloomy', gist: 'grey inside, like a rainy day', needs: ['hope', 'joy', 'warmth', 'movement'] },
      { id: 'discouraged', word: 'Discouraged', gist: 'wondering if it is worth trying again', needs: ['support', 'hope', 'competence', 'growth'] },
      { id: 'homesick', word: 'Homesick', gist: 'missing a place, or the people there', needs: ['belonging', 'stability', 'warmth', 'closeness'] },
      { id: 'heartbroken', word: 'Heartbroken', gist: 'missing someone or something very dear', needs: ['mourning', 'care', 'empathy', 'affection'] },
      { id: 'regretful', word: 'Regretful', gist: 'wishing you had done it differently', needs: ['mourning', 'learning', 'integrity', 'acceptance'] },
    ],
  },
  {
    id: 'scared',
    word: 'Scared',
    angle: -157.5,
    met: false,
    color: '#9a6dcb',
    gist: 'On alert. Part of you is bracing for trouble.',
    closer: [
      { id: 'worried', word: 'Worried', gist: 'thinking about what might go wrong', needs: ['reassurance', 'safety', 'clarity', 'stability'] },
      { id: 'nervous', word: 'Nervous', gist: 'jittery before something new', needs: ['reassurance', 'support', 'acceptance', 'competence'] },
      { id: 'shy', word: 'Shy', gist: 'wanting to hide a little', needs: ['acceptance', 'safety', 'belonging', 'authenticity'] },
      { id: 'overwhelmed', word: 'Overwhelmed', gist: 'too much, all at once', needs: ['rest', 'space', 'order', 'support'] },
      { id: 'confused', word: 'Confused', gist: 'not sure what is happening', needs: ['clarity', 'understanding', 'learning', 'order'] },
      { id: 'uneasy', word: 'Uneasy', gist: 'something feels a bit off', needs: ['safety', 'trust', 'clarity', 'harmony'] },
      { id: 'embarrassed', word: 'Embarrassed', gist: 'wishing nobody had seen that', needs: ['acceptance', 'respect', 'compassion', 'belonging'] },
      { id: 'panicky', word: 'Panicky', gist: 'everything speeding up at once', needs: ['safety', 'support', 'presence', 'ease'] },
    ],
  },
  {
    id: 'angry',
    word: 'Angry',
    angle: -112.5,
    met: false,
    color: '#e4574b',
    gist: 'Hot and tight. Something feels wrong or unfair.',
    closer: [
      { id: 'annoyed', word: 'Annoyed', gist: 'a small itch of “please stop”', needs: ['consideration', 'ease', 'space', 'respect'] },
      { id: 'frustrated', word: 'Frustrated', gist: 'trying hard and it will not work', needs: ['effectiveness', 'competence', 'understanding', 'cooperation'] },
      { id: 'grumpy', word: 'Grumpy', gist: 'cross and prickly, for reasons or none', needs: ['rest', 'food', 'space', 'ease'] },
      { id: 'impatient', word: 'Impatient', gist: 'waiting feels far too long', needs: ['clarity', 'effectiveness', 'choice', 'stimulation'] },
      { id: 'jealous', word: 'Jealous', gist: 'wishing you had what someone else has', needs: ['to matter', 'appreciation', 'inclusion', 'fairness'] },
      { id: 'fed-up', word: 'Fed up', gist: 'had enough of the same thing again', needs: ['support', 'fairness', 'choice', 'rest'] },
      { id: 'furious', word: 'Furious', gist: 'hot, big, and hard to hold', needs: ['respect', 'fairness', 'understanding', 'safety'] },
      { id: 'resentful', word: 'Resentful', gist: 'still stung by something that felt unfair', needs: ['fairness', 'appreciation', 'consideration', 'mutuality'] },
    ],
  },
]

// Words that sound like feelings but are really a guess about what someone
// else did. NVC suggests looking underneath them for the feeling and the need.
// Each points at a place on the wheel to open.
export const THOUGHT_WORDS = [
  { word: 'ignored', feeling: ['sad', 'lonely'], needs: ['to matter', 'to be seen'] },
  { word: 'left out', feeling: ['sad', 'lonely'], needs: ['belonging', 'inclusion'] },
  { word: 'misunderstood', feeling: ['angry', 'frustrated'], needs: ['understanding'] },
  { word: 'pressured', feeling: ['scared', 'overwhelmed'], needs: ['choice', 'space'] },
  { word: 'unappreciated', feeling: ['sad', 'disappointed'], needs: ['appreciation'] },
  { word: 'interrupted', feeling: ['angry', 'annoyed'], needs: ['consideration', 'self-expression'] },
]

// Fail loudly during development if a feeling names a need that isn't written.
for (const core of CORES) {
  for (const c of core.closer) {
    for (const n of c.needs) {
      if (!NEEDS[n]) console.warn(`[pakupaku] "${c.word}" lists unknown need "${n}"`)
    }
  }
}
