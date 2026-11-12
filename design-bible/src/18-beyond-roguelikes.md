# 18. Beyond roguelikes

This chapter follows the roguelike out of its home genre. It covers three movements: reading other forms (a novel, reality television, card drafts, a university) as if they were roguelikes; grafting roguelike structure onto other genres and onto new subjects, from city builders to gardening; and carrying the roguelike's machinery off the screen, onto paper and tables, into rooms and crowds, onto 3D printers, and into poems and podcasts.

It matters to someone making a roguelike because each move isolates one part of the form and shows what that part does on its own: the *run* (a self-contained attempt that starts fresh), permanent loss, and a fixed container filled with content that changes each time. The talks approach the subject mostly through case studies, from designers, artists, scholars and performers working at the form's edges. Their shared lesson is the chapter's advice: name the structural element you are borrowing or exporting, and adapt it to the new medium's constraints instead of copying its surface.

## In brief

- Roguelike structure (runs, permanent loss, a fixed container of variable content) is recognisable well outside videogames, in a novel, in reality television, in Magic drafts and in player-made Pokémon challenge runs, and reading those forms as roguelikes shows which element carries the experience {{6ik6jB2YhZg#0}} {{MQw3pe-z6JM#0}} {{50u5_hXZkv4#0}} {{lGm8cZC8Lfk#1}} {{R8DSq8qSJ44@31561#0}}.
- Borrow the structural element, not the surface: a university can keep the runs and deliberately drop permanent failure so students take risks, while points-and-badges gamification copies the surface and gets "chocolate-covered broccoli" {{R8DSq8qSJ44@3555#0}} {{R8DSq8qSJ44@3555#1}}.
- To hybridise a roguelike with another genre, decide which part of the other genre the run carries: Against the Storm distilled a city builder's opening hours into a run {{tWFIQaeSs6M#0}}, Legends of Runeterra used runs to restore the power progression its card collection had lost {{WLBJJTc6LWI#2}}, and card roguelikes recast an RPG's content as cards {{DT9_7sW5knY#0}}.
- Which mechanics a hybrid borrows, and how they are applied, matters more than the proportion of each parent, and restricting yourself to the two parents' features turns an unbounded design space into a mappable one {{OVSi3NzA0KM#7}} {{l1YEJBKehAY#2}}.
- A source genre's tempo and incentives come along with it unless you change them: talks show a genre being made turn-based, its map randomised, and its make-work or planning time cut {{TsaRxD3g_os#0}} {{UGPkEWqwSAY#8}} {{b8uoQHedFV0#1}} {{nSJA2yVsTFM#17}}.
- Changing a roguelike's subject means remapping every verb, and the places where the mapping breaks need redesign, as the boss did in a non-violent plant-growing roguelite {{-MX1imoSxTg#1}} {{ZJAgY73c8bA#2}}.
- The roguelike's machinery runs on paper (dice tables for generation, checkboxes for hidden state, a single sheet as the container), and in return the table offers players who invent content and human referees who bend rules gracefully {{IPMXeSAvtDs#0}} {{IPMXeSAvtDs#2}} {{IPMXeSAvtDs#7}} {{HgnvMBVKP0M#7}} {{kvCky6BbTuE#7}}.
- When many people play, griefing is a design input whose meaning depends on who is targeted, and audience scale changes the balance, so test countermeasures at the real player count {{ASGn5J9PHbs#8}} {{4jNMv79Xb6A#7}} {{4jNMv79Xb6A#8}}.
- A fixed work can feel personal when the world supplies the variation, and where you put the information decides whether people use a physical space or only the screen {{MNEG1sLSRcM#3}} {{MNEG1sLSRcM#4}} {{uZdEXqRkBZA#7}} {{R8DSq8qSJ44@22364#12}}.
- Outside games a generator may only have to change what a person does, which sets a low bar {{OzCGTXakbjE#5}} {{anwk8b7c_s0#1}}, and a single drop of randomness can be powerful {{-xrcmY7LNPI#0}}; but where variety has to come from new rules, as in variant sudoku, human invention has so far beaten generation {{rcIVCrddozQ#2}}.

## The roguelike lens: runs and permadeath in other forms

### The structure is recognisable far from the computer

Strip a roguelike down to its skeleton and three parts remain: the *run* (a self-contained attempt that starts fresh), permanent loss (what dies stays dead), and a fixed container filled with content that changes each time. Several talks found that skeleton in places nobody built as games {{6ik6jB2YhZg#9}} {{MQw3pe-z6JM#0}} {{50u5_hXZkv4#0}}, and the readings are useful because they show which part is carrying the experience.

Younès Rabii argues that the French novel *La Horde du Contrevent* can be read as a roguelike on three counts: its mechanics, its interface and its narration {{6ik6jB2YhZg#0}}. Its world is swept by a constant, violent and unpredictable wind; each generation sends a horde upstream to find the wind's source, and most of its members die on the way {{6ik6jB2YhZg#0}}. Generations as runs, and death as the normal outcome of an attempt, are the parts that make the comparison work. Rabii's wider point is that the roguelike experience can be built in other media with whatever tools you have, down to the typographic arrangement of a page, without being a game developer; Rabii points to *Made in Abyss* and the Boatmurdered story as further places where roguelike-as-game and roguelike-as-story intertwine {{6ik6jB2YhZg#9}}.

Florence Smith Nicholls does the same for reality television. In *Love Island*, each week's recoupling reshuffles the dating landscape like a new run, and an islander left single is dumped: permadeath, the end of their game {{MQw3pe-z6JM#0}}. Modelling the islanders as abstract symbols, Smith Nicholls shows the rules underneath: a newcomer can break up a couple, and the order in which people choose at the recoupling matters {{MQw3pe-z6JM#0}}.

> That's permadeath in Love Island. That's the end of the game. {{MQw3pe-z6JM#0}}

### Containers and drafts

Dennis Greger reads a format like *Survivor* as a *procedural container*: a rigid structure of fixed beats (hanging around and scheming, competitions for benefits, voting) that sets goals and stakes and leaves the space between them open for participants to fill with whatever they do. Greger calls that openness the format's strength, because it lets producers go searching for emotion {{50u5_hXZkv4#0}}. That is the roguelike's own bargain between authored frame and variable content, described from the other side. Greger also describes how the content is harvested. Traditional "fly-on-the-wall" production casts, films everything and spends a long time editing, which is expensive and low-yield. Greger's "fly in the soup" method alternates between sifting reality for content and enabling participants, then feeds what happens back into further sifting. According to the talk, it produced better content more cheaply and is closer to systems design: a defined, replicable procedure {{50u5_hXZkv4#2}}.

Card drafting makes the run explicit. Gavin Verhey describes *Magic: The Gathering* draft as a multiplayer roguelike run: you open a pack, pick one card, pass the rest, and repeat through three packs to reach 42 cards, then build a deck and see how far it goes. The card stream differs every time and is shaped by what the seven other drafters take; players call their drafts "runs" and race for the fastest 3-0 {{lGm8cZC8Lfk#1}}. Verhey then widens the frame to all of *Magic* as one roguelike with branching paths: kitchen-table play as the tutorial, game stores and tournaments as later levels, each loss prompting a deck rebuild. Formats are different end states; Commander optimises for social fun and wild swings, so unlike limited it embraces variance, down to whole coin-flip decks {{lGm8cZC8Lfk#22}}.

Other forms supply the generator rather than the run. Britta describes fan fiction as a procedural generator: the tags at the top of every story (characters, relationship types, tropes such as hurt/comfort or mirror universe, structures like "five times X and the one time Y") act as inputs that produce self-contained variations on familiar starting points. Britta has read hundreds of stories with the same setup and enjoys each because it is a little different, much like restarting NetHack {{H6fPIhLoA1Y#5}}. Joel Clark makes the same case for sports: simple rules produce endless unexpected outcomes, fans tune in to revel in that chaos, and that is why Blaseball took baseball as its base {{zO05p-e57AQ#4}}. Everest Pipkin reads the battle royale as a garden-like enclosure: an island whose closing wall of death forces players into ever smaller space, a border Pipkin links to real border violence {{O78uYtUZKYs#2}}.

### Player-imposed permadeath: the Nuzlocke

Players also add permanent loss to games that lack it. Stella Vermilion traces the Nuzlocke to a webcomic, "Pokémon Hard Mode", with two rules: release a Pokémon if it faints, and catch only the first Pokémon you find in each area. The standard rules today are the same plus a loss condition: the run ends when you run out of Pokémon. Players add nicknames for attachment and extra rules such as no over-levelling before bosses or no duplicate evolution lines, and ROM hacks exist for Nuzlockers because the base games are easy {{R8DSq8qSJ44@31561#0}}. Vermilion argues that, looked at mechanically and in how they play out, Nuzlockes contain ideas more roguelikes could learn from or steal {{R8DSq8qSJ44@31561#1}}.

Permanence can carry meaning as well as challenge. Julian Day describes Matthew Henderson's poetry collection *Roguelike*, which uses runs, cheat codes, glitching and above all the permanence of death to work through grief for the poet's mother and her addiction, with Caves of Qud as the backdrop for searching for her {{aBbaUSWFQPM#8}}.

### The applied end: learning, training and low commitment

The lens also runs toward institutions. Gillian Smith describes their university, WPI, as a multiplayer roguelike: more than 90 classes, encouraged multiclassing, unique boss battles and decades of legacy content. Students keep most of what each run (a class or project) gives them, juggle several runs at once, and may fail without permanent penalty: there are no failing grades, and a poor result becomes an "NR" (no record) that disappears from the transcript, because the institution's core aesthetic is that people learn by taking risks {{R8DSq8qSJ44@3555#0}}. Here the run structure is kept and permanent loss is deliberately removed, which tells you which element suits learning.

Smith also draws a line for anyone tempted to bolt game structure onto an activity. Gamification in education, they say, usually turns the quantitative assessment parts of teaching into points and badges, which is "chocolate-covered broccoli". The alternative, a metaphor from one of Smith's students, is "caramelized cauliflower": enhance what is already good about the activity without rating it numerically {{R8DSq8qSJ44@3555#1}}. Games by Smith's students about AI work in that spirit: in Abraham Goodman's *AI Runner* you can hold A and the game plays itself, and in Bashar Alcasar's *Bots That Explode Most of the Time* you program a robot or press an AI button, so players feel what is lost when play is handed over {{R8DSq8qSJ44@3555#8}}. Nat Alison, designing an educational sandbox for young players, aims to teach maths as reasoning, deduction and the joy of discovery rather than memorisation, which is the same pleasure of finding your own path that the roguelike sells {{5_UET-rUtGU#11}}.

Training is a case where randomness is removed instead. Stephen Ware's VR police de-escalation trainer uses a fully deterministic planned story so a trainee can replay it, deliberately change one action and see why it leads to a better or worse ending; Ware jokes that it is meant to be repeated and has permadeath, so perhaps it is a roguelike {{Rs_-yMsJDq8#12}}. Keep the run and the repetition; drop the variation when the point is to isolate cause and effect.

And sometimes the borrowed element is simply the short, restartable session. Hannah Blair Salzman values *Dynasty Warriors* because battles take under 30 minutes, death is quick to recover from, and tired players can switch characters, battles or sides: low commitment, high variety {{6GSXaM1PTMg#3}}.

### Borrowing in both directions

Santiago Zapata notes that the traffic now runs both ways. 7DRL (the Seven Day Roguelike challenge) first brought ideas from other genres into roguelikes and exposed roguelikes to wider development circles; then roguelike elements spread out into other genres and mainstream games {{ZMdxP7fO6wE#16}}. Other cultures of play have things to give back. Jason Grinblat points to speedrunning, which treats bugs as first-class gameplay, and to developers who cooperate with it: Terry Cavanagh re-enabled glitches needed for popular *VVVVVV* speedrun strategies by isolating them behind an if statement. Grinblat notes this still keeps bugs on a parallel track, and would rather see them understood as part of the intended experience {{kvCky6BbTuE#3}}. Nic Junius suggests theatre has techniques games have not adopted, such as directing (shaping a scene's tone and themes at a high level); in the same exchange the host, Alexei, added encouraging players to interpret a work in different ways {{cDxL6JoxYQc#11}}.

**In practice.** When you borrow from, or lend to, another form, name the structural element you are moving: the run, the container, the permanent loss, the tagged generator, the short restartable session. *Love Island* keeps the run and the loss {{MQw3pe-z6JM#0}}, Nuzlockes add loss to a game without it {{R8DSq8qSJ44@31561#0}}, and WPI keeps the runs while removing the loss {{R8DSq8qSJ44@3555#0}}: the drop is as much a design decision as the keep. Copying a surface (points, badges) without the element underneath is how you get chocolate-covered broccoli {{R8DSq8qSJ44@3555#1}}.

## Grafting the roguelike onto other genres, formats and platforms

### Method: constrain the sources, choose what you borrow

Combining a roguelike with another genre opens a huge design space. Jonathan Lessard and Pippin Barr closed it for *Chogue* with one rule: every design aspect had to come from either chess or Rogue and nothing else. Every decision became a choice between two models, or a point between them, which turned an almost infinite space into a small mappable one. Because the game was small, every element mattered, and removing one showed how the dynamics collapsed and recombined, which forced them to understand both parents better {{l1YEJBKehAY#2}}.

Tyriq Plummer argues that roguelikes and platformers combine productively because their defining aspects barely overlap. A beat-'em-up plus a Zelda-style game maps basic interactions onto each other, and an arena shooter plus a roguelike share perspective and movement; a roguelike and a platformer are different enough to force invention {{OVSi3NzA0KM#0}}. Plummer frames a hybrid as a recipe with proportions, but a comparison in the same talk undercuts proportion as the key variable. *Vagante* and *Catacomb Kids* borrow almost the same roguelike features (classes, evasive combat, random equipment, fog of war, unidentified potions and spellbooks) and feel completely different. Vagante's classes are classic Diablo-style roles while Catacomb Kids' classes define the rules for generating characters, and Vagante's combat is evasive because of enemy behaviour while Catacomb Kids' is evasive because of Smash Bros.-style directional attacks and dodges {{OVSi3NzA0KM#7}}. Which mechanics you take, and how you apply them, matters more than how many.

### Distil the target genre's best loop into a run

One pattern is to take a defined part of the other genre's play and compress it into a run. Aron Pietroń describes *Against the Storm* as distilling the first one to two hours of a city builder's loop into a settlement run of about two hours, with a pseudo-random hand of perks and building blueprints dealt on top that the player must find a way to use; after each settlement comes the world map and a new one {{tWFIQaeSs6M#0}}. Shawn Main explains why *Legends of Runeterra* added a roguelike mode: its generous card distribution let players collect nearly everything, which removed the collectible card game's feeling of climbing toward a better deck. The Lab of Legends mode restores power progression inside a run with card-boosting items, deck-upgrade choices, persistent powers and AI opponents with distinct personalities and themed decks {{WLBJJTc6LWI#2}}.

Card roguelikes show the same move in the other direction: they take the RPG and compress it into cards. Benjamin Berman defines the subgenre by its metaphor. Cards stand for spells, equipment and encounters, building the deck abstracts away experience points, equipment and levelling, and shuffling is the randomiser; Berman urges designers to stick to those metaphors {{DT9_7sW5knY#0}}. The metaphor carries a default with it. Alexander King observes that nearly every roguelike deckbuilder is about adding and removing single cards, usually as a pick-one-of-three choice, and that this structure pushes a design in particular directions that a game can embrace or push against {{uwiFwic03EE#0}}. King pitches set-based card acquisition as the untried alternative, under-explored only because no knockout hit has used it yet {{uwiFwic03EE#10}}. At the shallow end, Verhey praises *Meteorfall*'s "Tinder method", where each drawn card is a swipe-left or swipe-right decision to play it or not: shallower than Slay the Spire, but robust and good for a phone on a plane {{lGm8cZC8Lfk#24}}.

Influence also flows into strategy games. Cole Wehrle says their board game *Oath* was shaped more by roguelikes and CRPGs than by Paradox or Civilization games; the team was playing early Caves of Qud and Spelunky and asking how to adapt them to a strategic space {{HgnvMBVKP0M#0}}.

### Translation that changes the source genre's feel

The opposite approach keeps a genre's fantasy but changes its tempo, because the source genre's feel is what keeps people out. Josh Grams likes inertial, Asteroids-style space flight but finds it drops players into action with little chance to experiment. Changing the physics, for example making the ship drive like a car, tends to backfire because people simply drive fast and stop engaging, so for 7DRL Grams made the flight turn-based instead {{TsaRxD3g_os#0}}. Brian Walker's roguelike platformer does something similar in real time: time is frozen when you stand still on the ground without using items, passes normally in the air or when using an item, and passes in proportion to ground speed, with a slow-motion toggle for complicated manoeuvres, so play stays cerebral {{Uo9-IcHhq_w#12}}.

Two talks warn that the source genre's incentives come along unless you change them. Bruno Dias says traditional space sims undercut their own serendipity by rewarding players for settling on a profitable trade route; *Voyageur* randomises its map, following Sunless Sea, so players lack a clear idea of where things are and are pushed toward the unknown {{UGPkEWqwSAY#8}}. Nicholas Feinberg's example is *Civilization II*, where overflow production was wasted when a bar filled, so optimal players reassigned every city's workers every turn for hundreds of turns: make-work that distracted from the strategic decisions the game was about, reduced in later games by carrying excess over {{b8uoQHedFV0#1}}. Nic Tringali hit the time problem when drawing on board games such as *High Frontier* for *The Banished Vault*: a trip to Saturn might take an hour of real planning at the table, but a digital player should hop between planets in a couple of minutes {{nSJA2yVsTFM#17}}.

Older disciplines are also worth revisiting. Todd Furmanski looks at forms defined by technical limits, such as Myst's CD-ROM still images, and asks what they become now that those limits are gone and real-time simulation is available {{ST6s_8ekeOg#1}}.

### New formats and platforms

Puzzle hunts show how far the format can be bent. Colin Liotta describes "Walk Across Some Dungeons", a 2014 MIT Mystery Hunt puzzle whose initials spelled WASD to tell solvers it was a roguelike: discrete hand-built levels, four-direction movement, and a goal of reaching the stairs without dying while manipulating objects and avoiding enemies that attack in different ways {{5VsM8bOywIY#0}}. Liotta's own sequel puzzle gave the player two characters moved by the same keypresses, sometimes in parallel mazes you must watch at once, sometimes together so you exploit their interactions to bring both to the stairs at the same time, a mechanic that suits roguelike grid movement well by its designer's account {{5VsM8bOywIY#8}}. Because a hunt puzzle needs a word answer, the only safe route through the final level passes over letters spelling it out {{5VsM8bOywIY#11}}.

New platforms need variants, not ports. Thomas Biskup says ADOM's team learned there is no single way to play such a game: players who ask for mobile do not want ADOM's full complexity there, so mobile versions should be distinct variants {{iZUXjbcAfYs#8}}. Santiago Zapata's smartwatch roguelike is a very simplified formula, climbing a tower as far as you can, sized for a wait at a bus stop {{TMxzVy7-VYQ#17}}. Steve Mason's VR roguelike turns the abstract text form into tabletop-miniature-style 3D tiles while keeping turn-based play, procedural dungeons and drops, and a coffee-break session length {{SDojcmObQzw#5}}.

Reducing dimensions is another way to upend conventions. Lee Tusman collects one-dimensional games: Corey Johnson's *URL Hunter*, a hunting game played in the browser's address bar {{-e4gF_SKWPk#3}}; *Line Wobbler*, a hand-made dungeon crawler on an LED strip controlled by a spring, which Tusman hopes will inspire hardware roguelikes {{-e4gF_SKWPk#4}}; their own Hunt the Wumpus variant on a BBC micro:bit, a one-dimensional looping dungeon {{-e4gF_SKWPk#10}}; and one-dimensional chess variants, including one by Martin Gardner, which explore emergent play from minimal rules rather than generation {{-e4gF_SKWPk#11}}. Zeno Rogue starts from the opposite end: Rogue's levels are built from rectangles, and rectangles exist only if Euclid's parallel postulate holds. On spheres and hyperbolic planes the first four postulates are all true but there are no rectangles, so changing the geometry changes the genre's most basic building block {{wOlSws-OI2o#0}}.

**In practice.**

- Write down what each parent contributes, and consider restricting yourself to those sources, as Chogue did {{l1YEJBKehAY#2}}.
- Consider parents whose defining features barely overlap, as Plummer argues for roguelikes and platformers, and choose specific mechanics deliberately rather than aiming for a ratio {{OVSi3NzA0KM#0}} {{OVSi3NzA0KM#7}}.
- Decide which stretch of the target genre's play the run will contain, as Against the Storm did with a city builder's opening hours {{tWFIQaeSs6M#0}}.
- Check what the source genre rewards; if it rewards routine, add randomness or remove the make-work {{UGPkEWqwSAY#8}} {{b8uoQHedFV0#1}}.
- On a new platform, plan a simplified variant rather than a port {{iZUXjbcAfYs#8}} {{TMxzVy7-VYQ#17}}.

## New verbs and new subjects: non-violent, cozy and everyday roguelikes

### Mapping the loop to a new theme

Almost every roguelike verb is violent: kill, loot, survive. If you change the subject, you have to decide what replaces each one. Tabea Iseli's *Grimoire Groves* is the most worked-through example. It keeps a traditional roguelite dungeon-crawler structure (a procedurally generated map, boons that hopefully synergise, a boss at the end of a run) but replaces enemies with plant creatures that the player's witch casts spells on to make them grow {{-MX1imoSxTg#1}}. Iseli lists the mapping element by element: a colourful forest for the dungeon, growing plants for killing, gathering fruit for looting, crafting for buying, energy instead of health. The loop was mechanically near-identical to a traditional crawler, with the differences mostly narrative {{ZJAgY73c8bA#2}}.

The useful part is where the mapping broke. Bosses did not translate: a big plant that is hard to grow has no reason to block your way to the next level {{ZJAgY73c8bA#2}}. Iseli also explains why farming was the right theme to borrow. Farming games and roguelites both revolve around collecting resources, both let players choose their own approaches and priorities, and both work toward goals across several runs or game days; farming was also popular with the target audience and made the non-violent mechanics easy to read, since players understood watering plants with magic {{-MX1imoSxTg#2}}.

### Gardening as a mode of play

Max Kreminski names a mode of play that suits a non-violent roguelike. *Gardening* rests on two pleasures: nurturing, watching a system grow while you guide but do not control its direction, and customisation, fussing over aesthetic choices to leave the world better than you found it. Kreminski sees it in idle games, A Dark Room and Animal Crossing, and with more control in SimCity and Dwarf Fortress, but notes it is usually peripheral rather than the reason people play {{TvlZinAvpwg#4}}. Their game *Epitaph* puts it at the centre: an idle game that strips Civilization down to its tech tree, in which you occasionally intervene to teach procedurally generated alien civilisations technologies that might help them reach the stars. Success comes partly from your guidance and partly from the civilisation's own development, and most players do not win {{TvlZinAvpwg#0}}.

Kreminski leaves one boundary open. *RollerCoaster Tycoon*, *Stellaris*, *Slime Rancher* and *FarmVille* feel like gardening but ask the player to extract value, which suggests a separate "farming" category whose line with gardening Kreminski cannot yet draw, pointing to Animal Crossing drifting toward control and to Pocket Camp selling real-money tickets to skip orchard timers, the opposite of a game willing to make you wait {{TvlZinAvpwg#15}}. That puts Iseli's design choice in a sharper light: Iseli borrowed from farming games because they share the roguelite's resource loop {{-MX1imoSxTg#2}}, while Kreminski's concern is that value extraction is what separates farming from gardening. Which one your cozy roguelike is depends on whether its world exists for its own sake or for your yield.

Hannah Blair Salzman adds a different cozy virtue. In Animal Crossing you can pick up and drop any task without consequence and are never strong-armed into uncomfortable time commitments, a quality Salzman sees in roguelikes' appeal too {{6GSXaM1PTMg#2}}.

### Where to find new verbs

The talks suggest three places to look.

- **Ordinary activities.** Ludipe proposes gardening, sports team management, trip planning, laundry, cooking and hosting a dinner as untapped themes, and describes a hiking game whose challenge is what to pack and where to sleep {{pYtlU9wGopo#6}}.
- **Familiar physical mechanics.** Philomena Schwab says Peglin showed roguelike deckbuilders could split into physics-based sub-genres. Feeling the deckbuilder space was crowded, Stray Fawn brainstormed easily understood real-world mechanics and landed on a claw machine: *Dungeon Clawler* {{MTam5RT8Kn0#0}}.
- **Tools you already use.** Nick Bush reads the Vi and Emacs command sets as a ready-made list of roguelike mechanics: display-relative movement, hopping across blank space, marks as teleport points, insert mode as an arsenal, with text selection another untapped source {{R8DSq8qSJ44@1660#7}}.

Two other examples show subjects fused rather than replaced. Christine Tomlinson describes *Boyfriend Dungeon*, where the people you date are also your weapons, so combat raises relationships and relationships improve combat, though it can feel like playing two games at once {{ujKlmvfpNMo#2}}. James Cartlidge cites a history-strategy game framed as two students writing a book report, where you play history through empathy and winning hearts and minds rather than conquest {{ujKlmvfpNMo#7}}.

**In practice.** Write the mapping out as a table: every element of the loop (space, opponent, action, reward, currency, health, boss) against its equivalent in the new theme, as Iseli did {{ZJAgY73c8bA#2}}. Mark where the equivalent has no reason to exist in the fiction, as the plant boss in *Grimoire Groves* did not; those rows need redesign, not a reskin. Then look for verbs in everyday activities {{pYtlU9wGopo#6}}, real-world mechanics people already understand {{MTam5RT8Kn0#0}}, and the tools you use every day {{R8DSq8qSJ44@1660#7}}.

## Roguelikes on paper and at the table

### The roguelike's machinery on a single sheet

A roguelike's machinery (lookup tables, dice, hidden state, generated content) does not need a computer. Francesco Cottone's *Chronicles of Stampadia* publishes a new one-page roguelike adventure every day, played with two dice, a pencil, an eraser and a small token {{IPMXeSAvtDs#0}}. It is framed as a game for what Cottone calls the "beach umbrella gaming system": pre-printed single-sheet puzzles such as crosswords, where pencil and eraser are the input devices and numbers, grids, lookup tables and basic maths are the interface. That platform held mostly single-player puzzles and lacked a minimal roguelike {{IPMXeSAvtDs#1}}.

Cottone's sources show how each roguelike component gets a paper equivalent:

- **Generation by table.** *Four Against Darkness*, a roughly 100-page solo dungeon crawler from 2016, generates treasure, monsters and even the dungeon layout from dice rolls on lookup tables, and the player draws the map while exploring; Cottone had to adapt its ideas to a single sheet {{IPMXeSAvtDs#2}}.
- **Hidden state by checkbox.** The *Fabled Lands* gamebook *The War-Torn Kingdom* asks players to tick checkboxes without saying why, then redirects them to other paragraphs when conditions are met, tracking time, gold, past decisions and cleared quests across an open world of interconnected areas {{IPMXeSAvtDs#7}}.
- **Random dungeons and enemies on the table.** Cottone tells roguelike designers to start from exploration board games, citing SUPERHOT's card game with random levels, City of Kings drawing enemies from a bag, Magic Maze's real-time co-op exploration, and Mini Rogue, playable with nine cards, two of them used as the interface {{IPMXeSAvtDs#9}}.

Cottone also gives the reason the two forms meet. Stories at the table must be short, so in story-driven board games random generation is almost mandatory: it is how they create longer play, as roguelikes use it for longevity {{IPMXeSAvtDs#10}}.

### Players as the generator

The table offers something a computer does not: people who invent. Cole Wehrle argues that players are the best generator of bespoke, intentional content. They constantly make up stories and explanations, scribble notes and build fan variants, and most of it is lost; *Oath* is Wehrle's attempt to capture that play and pipe it back into future games, in a board game rather than only a role-playing game {{HgnvMBVKP0M#7}}.

> Is there a way we can capture the ephemeral play? {{HgnvMBVKP0M#7}}

Cezar Capacle goes further and removes the designer's world entirely. Their GM-less (no game master) "anti-canon" tabletop RPGs have no predefined lore; lore is created collaboratively during play through in-game tools, and nothing relies on someone bringing outside knowledge to fill gaps. Capacle contrasts this with both railroad and sandbox adventures, which assume pre-existing lore and a GM who prepares it all {{NklQJfhZT3k#0}}. Both approaches set human invention against designer-authored content: the game supplies structure and prompts, the players supply the world.

### Human referee versus computer referee

What a human referee does better is fail gracefully. Jason Grinblat, drawing on Gary Alan Fine's study *Shared Fantasy*, describes tabletop players slipping rapidly between three frames: the real world, the rules and the story world. At the table people turn dice rolls into fiction and fiction into rules, and change the rules when someone is not having fun; because humans negotiate these shifts, failures are graceful. A video game has no such negotiation, so when its framing fails, it simply fails {{kvCky6BbTuE#7}}.

The physical medium's limits cut both ways. Jon Perry finds tabletop design more restrictive than videogames, because players must learn and execute the rules and the pieces are physical, but finds those limits creatively freeing; choosing a medium, for Perry, is choosing how much limitation you want {{NlxGPKV0PrY#14}}. Benjamin Berman draws the line at effects that need constant random handling: Hearthstone's "discover" or Dicey Dungeons' dice juggling are far better done by a computer than by tedious physical shuffling, yet you can still prototype them physically, cheating as needed, before you program them {{DT9_7sW5knY#17}}.

Physical play also teaches what a component *means*. Nic Tringali's racing card game *Wheel to Wheel* failed for a long time as a modified Blackjack, because a deck of cards implies events that have already happened, which did not suit a fast duel. It worked once it borrowed *Skull*'s hidden stacks: players build stacks toward a shared bust value, each sees only their own draws, and they react to what the other driver is doing {{R8DSq8qSJ44@17074#9}}. Tringali's naval game *Tall Ships* gets slow, unpredictable action from one rule: players assign action cards to ships before a random activation order is revealed, which creates a fresh baseline each round and makes actions feel delayed {{R8DSq8qSJ44@17074#10}}. Robin Mendoza recommends tabletop games generally as a source of economic ideas; market games, from M.U.L.E. and Offworld Trading Company on screen to 18xx train games and Food Chain Magnate on the table, tell their stories through prices, stocks and the choice to reinvest or pocket profits {{ZtXGg6ECwQ8#5}}.

### Generators and simulation for tabletop

Roguelike tools also serve people running tabletop games. Atty Vohra's Python script takes only party level and difficulty and outputs a full abstract D&D 5e stat block (hit points, armour class, DCs, stats, actions, special actions, desperation actions); it saved a session when Vohra had only 30 minutes to prepare, needing five to ten minutes of polish {{0ydWz1EvMJs#0}}. Vohra's advice is to decide which parts of game-mastering you care about and automate the ones you find tedious: if you care more about roleplay than perfect combat, automate combat {{0ydWz1EvMJs#6}}. Vohra floats NPC dialogue, faction wars, villain plots, dungeons, skill challenges and even simulating the campaign world between sessions as further targets, while not recommending a full world simulation {{0ydWz1EvMJs#9}}.

Simulation can also balance a physical game. Phenry Ewing coded a basic model of *Werewolf* (round sequence, day/night cycle, end conditions, crude player behaviour such as the seer checking a random player), ran it thousands of times across weighted variables, and turned the sliced results into an interactive rules document: choose player count and roles, and it recommends a werewolf count and reports win odds {{Nnx33ctSmRA#3}}.

**In practice.** To move a roguelike off the computer, give each component a physical carrier: dice and lookup tables for generation and a map drawn as you explore {{IPMXeSAvtDs#2}}, checkboxes or hidden stacks for secret state {{IPMXeSAvtDs#7}} {{R8DSq8qSJ44@17074#9}}, and a single fixed sheet for the container {{IPMXeSAvtDs#1}}. Keep constant random handling, which is a chore at the table, for the computer, but prototype it on paper first {{DT9_7sW5knY#17}}. Going the other way, use the computer for the bookkeeping a referee finds tedious {{0ydWz1EvMJs#6}} and for simulations that check balance {{Nnx33ctSmRA#3}}, and leave invention and graceful rule-bending to the people at the table {{HgnvMBVKP0M#7}} {{kvCky6BbTuE#7}}.

## Many players, crowds and audiences

The table puts several people around one game; the next step is to put many people inside it. The roguelike is usually a solitary form: one character, one dungeon, one player who owns every decision and every death. Several talks ask what happens when you let other people in, from a streamer's whole audience to a party in a shared dungeon to a public Twitter timeline {{4jNMv79Xb6A#0}} {{bpSnPNr6ETc#1}} {{4byHHDeVKoA#8}}, and they arrive at the same small set of problems from very different starting points.

### Two visions: the crowd and the party

The first vision is the crowd. The Delve Bros built Stream Heist around what they call "infinite multiplayer": a streamer plays the thief, and any number of viewers open a link to a web command line and join as the hacking tech team, listing the devices the thief has attached a dongle to and then hacking, unlocking or controlling doors, cameras and robots {{4jNMv79Xb6A#0}}. The question they started from was what it would look like for a streamer to have everybody in the audience actually playing with them.

The second vision is the party. Leif Bloomquist's Dungeon of the Rogue Daemon, a multiplayer roguelike for the Commodore 64 and modern platforms, starts from a simple substitution: what if the other characters you meet in the dungeon were other players, so you could quest, fight, solve puzzles and share tools and clues together {{bpSnPNr6ETc#1}}? Bloomquist describes the same core in an earlier talk: players team up against monsters, solve puzzles together, and leave each other tools, clues and equipment {{ASGn5J9PHbs#1}}. The motive was to recapture the same-room multiplayer games Bloomquist grew up with, with an online element for spread-out C64 fans {{bpSnPNr6ETc#1}}.

The two visions differ in scale, but they run into the same three problems: griefing, scale, and making each person matter.

### Griefing is a design input, not a bug report

Shared objects get abused. Bloomquist's shared key-and-door puzzles had to stop one player running off with the key or locking others out, so the key teleports back to its origin after use and the door re-closes after ten seconds {{ASGn5J9PHbs#8}}. The fix carried its own cost: in a live demo with about 40 players the door became a bottleneck, which Bloomquist says seemed to be their undoing {{ASGn5J9PHbs#8}}. An anti-griefing rule can itself become the bottleneck when many players arrive.

The Delve Bros take the opposite stance. They argue an audience-participation game has to balance letting viewers cooperate with the streamer against letting them troll the streamer, because trolling is perhaps the most fun part {{4jNMv79Xb6A#7}}. In their own liveplay, viewers repeatedly sent hacked robots at the thief, and that was part of the entertainment {{4jNMv79Xb6A#7}}. The difference is who is being griefed. In Bloomquist's dungeon every player is a peer whose progress can be blocked; in Stream Heist the target is a streamer whose suffering is the show.

### Scale changes the game

The Delve Bros are candid that a streamer with a hundred viewers and eight friends playing together are two very different scales needing different balancing {{4jNMv79Xb6A#8}}. Zack Delventhal notes the streamer relationship is asymmetric (the streamer is on a pedestal, and trolling must be controlled for) and that competitive play might suit friends but not a streamer {{4jNMv79Xb6A#8}}. They would like to support both, and leave it as an open question.

Scale also breaks the individual puzzle. Stream Heist's hack is a Mastermind-style guessing game, and with only four to eight hackable devices and hundreds of viewers, the team compared it to brute-force Bitcoin mining: you can scale the puzzle like a hash so that a crowd solves it in predictable time, but then each of a hundred hackers has roughly a one-in-a-hundred chance of being the one who solves it, and individual success becomes mostly chance {{4jNMv79Xb6A#9}}. Some viewers felt bad at Mastermind and were frustrated when others in a big group solved it faster {{4jNMv79Xb6A#10}}. Their planned fixes are a useful list for anyone building crowd play {{4jNMv79Xb6A#10}}:

- **Varied mini-games**, so not everyone is competing at the same hack.
- **Collaborative hacks** that show progress and credit each person's contribution, so the crowd is hacking together rather than racing.
- **Multi-part devices**, where each part has its own mini-game, so effort splits and people can specialise.

Joe Sondow arrives at the same goal from Twitter bots. For Sondow the point of an interactive bot is inclusion: participants should feel they affect what happens next even as one of a hundred voters, which is what separates it from a bot that is just generative art output {{4byHHDeVKoA#10}}.

### Constraints of the channel shape the game

Sondow's Twitter games show how the channel dictates the interface. A Twitter poll allows at most four options, so a community-played roguelike becomes a choose-your-own-adventure in which the program must decide which four actions are most interesting: by default the four compass moves, until an object or wall offers something better {{4byHHDeVKoA#8}}. Tetris fits naturally (left, right, rotate, down). The warning is concrete: avoid loops, for example by making sure players can always move away from a chest {{4byHHDeVKoA#8}}. For reply-driven games like Minesweeper, Sondow first imagined per-player threads branching on commands like "dig at a4", which looked like a nightmare of game states; letting whoever replies first make the next move avoids the explosion and keeps it a shared community effort {{4byHHDeVKoA#9}}. Direct-message games would work technically, but would defeat the public, group-shared point of the platform {{4byHHDeVKoA#9}}.

### Shared play without a shared screen

Not all multiplayer roguelike structure needs a server built for it. Stella Mazeika describes game randomisers: external programs that take a ROM, a set of flags selecting which elements to shuffle or tune (key items, treasure chest contents, experience scaling in Final Fantasy 1), and a seed, and output a transformed playable game {{C7laugXEc9s#0}}. The seed fixes every random choice, so friends can play the exact same randomised version. Combo randomisers shuffle items between two games, such as Super Metroid and Link to the Past; multiworld randomisers shuffle items across several players' copies of a game over networked emulators {{C7laugXEc9s#9}}. In a multiworld, one player may find another's hookshot and so hand it to them, which is what makes the cooperative experience interesting {{C7laugXEc9s#9}}. Item sharing turns separate runs into a party without anyone seeing each other's screen.

Bloomquist found that cooperative structure can emerge from a single tight constraint. In playtests of Bloomquist's two-item-inventory roguelike, where everyone plays the same generic character, players spontaneously fell into classic party roles like fighter and healer {{ASGn5J9PHbs#4}}. No class system was involved: the roles emerged from the item limit, and they were the ones you would see in a D&D-style fantasy setting.

Live formats show another answer to scale: put the crowd on stage one at a time. Randy Lubin and Raph D'Amico's Dungeon Court adapts Bully Pulpit Games' Ghost Court, a Judge Judy-style comedic court game, into a live LARP where audience members argue ridiculous cases between monsters and heroes across a dungeon, a city and a temple {{ftSC3Sn8O_s#0}}. The structure is tight: the plaintiff gets one minute, the defendant one minute, and the judge about three minutes to question, rule and sentence, while the next volunteers are set up offstage so cases run back to back {{ftSC3Sn8O_s#1}}. Short fixed slots are how the format gives many people a turn.

### Why single-player still matters

Gavin Verhey, whose reading of Magic draft as a roguelike run opened this chapter, wants more co-op and multiplayer roguelikes, but names the tension: the genre's appeal is playing over and over, so a single-player mode is critical {{lGm8cZC8Lfk#25}}. You cannot always assemble a party for the fiftieth run. Multiplayer is an addition to the replay loop, not a replacement for it.

**In practice:**

- Design for griefing from the first prototype. Decide whether abuse of shared objects is the content (a streamer as target) or a threat (peers who need to progress), and test your counter-measure at your real player count, because Bloomquist's fix became a bottleneck in a demo with about forty players {{ASGn5J9PHbs#8}}.
- Make each participant's contribution visible. If success is a lottery among a hundred guessers, show shared progress or split the work into parts {{4jNMv79Xb6A#10}}.
- Choose your audience scale. A streamer and their viewers and a party of friends need different balancing, and competitive play might suit one but not the other {{4jNMv79Xb6A#8}}.
- Let the channel set the interface: four poll options, first reply wins, one seed for everyone {{4byHHDeVKoA#8}} {{4byHHDeVKoA#9}} {{C7laugXEc9s#0}}.

## Play in rooms, bodies and real software

Roguelikes usually generate their variety: each run lays out a new dungeon, so each player's experience is their own. Several talks show that physical space and the player's own body can do the same job without a generator {{MNEG1sLSRcM#3}} {{MNEG1sLSRcM#4}}, and they also show what the room demands in return {{uZdEXqRkBZA#7}} {{uZdEXqRkBZA#9}}.

### Clockwork that feels personal

Emilia Lazer-Walker asks whether the immersive theatre production Sleep No More is a roguelike. It is entirely scripted, "clockwork", yet its possibility space is so large that each audience member, roaming a multi-storey building freely, finds personal moments of synchrony; the result is emergent stories without any simulation {{MNEG1sLSRcM#3}}. The embedded Macbeth plot is nearly illegible, and the real story is what you saw and compared with friends afterwards. Lazer-Walker found an abandoned, cobwebbed replica of the opening bar that was later full of people, a moment that felt like theirs alone {{MNEG1sLSRcM#3}}.

> This is so deterministic, but the possibility space is so large that any individual player wandering through the space is going to find interesting moments of synchrony. {{MNEG1sLSRcM#3}}

Lazer-Walker's second example removes even the space. Janet Cardiff's audio walk is a fixed 25-minute Central Park recording that has not changed in 15 years, but it feels personal because it plays off reliable real-world events: a binaural police siren on 59th Street that listeners cannot tell apart from a real one, since as long as there are cars in Manhattan there will be sirens there {{MNEG1sLSRcM#4}}. The illusion is fragile (turning your head would break it, and the piece uses psychological tricks to stop you), but it shows that a moment everyone receives can still feel like your own if the world supplies the variation {{MNEG1sLSRcM#4}}.

The third example does generate, but in service of the space. Computational Flaneur feeds phone sensor input into a neural net trained on mid-20th-century poetry and reads the result aloud two lines at a time while the next snippet generates {{MNEG1sLSRcM#6}}. The design target is deliberately modest: poems interesting enough to pull you out of your thoughts as you walk through the park, but not so interesting that they grab your attention. It is a machine for awareness of the space around you rather than a world of its own {{MNEG1sLSRcM#6}}.

The lesson across all three: the personal moment comes from the intersection of a fixed work and a varied world, not from the work varying itself.

### The player in front of real software

G blekkenhorst describes "interface games", where the player sits directly in front of software the characters could have used, instead of steering a virtual avatar; this brings the game world into the room and makes the experience intensely first-person {{uZdEXqRkBZA#0}}. Many interface games still give the player a subtle virtual body, which blekkenhorst says is not a failure; "metaleptic interface games" such as Her Story, Immortality and A Normal Lost Phone go further and always keep up the fiction that you, the physical player, are using real software {{uZdEXqRkBZA#2}}. Metaleptic here means a work that crosses the boundary between the fiction and the real world of the person engaging with it.

Add physical space and you get tangible metaleptic interface games: software in a real room that narrates the world around it, attaches history to objects players can touch, and tells them what to do with those objects {{uZdEXqRkBZA#6}}. Found-letter games and ARGs with physical components can fall here too.

blekkenhorst's own installation shows the hazard. The Archive was a 10x10 foot room with a physical archive and digital archive software; players volunteered for up to hour-long shifts migrating entries that told the stories of earlier users who became obsessed with entities {{uZdEXqRkBZA#7}}. Players were immersed and built varied mythologies, but once they were on the computer it was very hard to get them to engage with the physical space, and exit surveys showed they did not reflect on their own bodies or histories {{uZdEXqRkBZA#7}}. The screen wins attention unless you design against it.

### Putting the information in the room

Paris Buttfield-Addison's Hintline 93, a museum exhibit at ACMI about 1993 game support lines, designs against it. Players take calls from frustrated gamers, and the answers live in a physical binder on a real desk, so solving a caller's problem means looking things up in a printed compendium, as in Keep Talking and Nobody Explodes {{R8DSq8qSJ44@22364#0}}. The exhibit was a full cubicle with a beige PC, CRT, phone, 1993 calendar, Newton's cradle and a deliberately dead plant that staff kept trying to save {{R8DSq8qSJ44@22364#0}}.

The paper compendium cost more than an on-screen one would have, but it made players flip pages while a caller yelled at them, which the team felt was close to the real job {{R8DSq8qSJ44@22364#12}}. The 200-plus-page binder, made by hand in four identical copies, holds misprinted manuals, photocopied magazine pages, hand-fixed maps, bug memos, Usenet posts, sticky notes in different handwriting, decoder wheels and red-cellophane anaglyph decoders, some of it there only to build the fictional company. It was allowed to wear out as real binders did; visitors scribbled in it and even stole pages {{R8DSq8qSJ44@22364#12}}.

Set against The Archive, the contrast is clear. If the information the player needs is on the screen, the room becomes scenery. If it is in the room, the player has to use the room.

### Live forms: performers as the engine

Live performance is another way to put a game in a room. Bad News, played live at the 2016 Celebration, is a game about death notification: the player, as the county mortician's assistant, must identify a dead townsperson from only a physical description, find the closest living relative in town, and tell them, and loses if they inform anyone other than that next of kin, so they need a cover story {{XFFyN10o87I#0}}.

Dustin Freeman goes further and replaces the computer with people. Freeman's live-action roguelike stages a roguelike as improvised theatre: chat chooses actions, a DM narrates outcomes, and props are rebuilt between levels as "real-time procedural generation" {{mXRKvbRi9qc#0}}. Level transitions are covered by inventory reviews while the set is rearranged, and Freeman jokes that some areas are where the engine forgot to generate and is doing it live {{mXRKvbRi9qc#0}}. The roguelike's level break becomes a stage-management problem, and the inventory screen becomes the scene change.

### The cost of asking for the body

Physical commitment cuts both ways. You Are a Strange Sensor forces players to kneel below a monitor to reach the keyboard, which reinforces an entity mocking them for letting it put them in an uncomfortable position {{uZdEXqRkBZA#9}}. The large upfront investment meant everyone who took the position played to the end, but it excluded some people; blekkenhorst was injured at one point and could not play it themselves {{uZdEXqRkBZA#9}}. A posture is a filter: it buys commitment from those who pass it and turns away those who cannot.

**In practice:**

- Let the world supply the variation. A fixed work can feel personal if it is large enough to explore or leans on reliable real events {{MNEG1sLSRcM#3}} {{MNEG1sLSRcM#4}}.
- Decide where the information lives. Put what players need in the room if you want them to use the room; expect a screen to swallow their attention otherwise {{uZdEXqRkBZA#7}} {{R8DSq8qSJ44@22364#0}}.
- If you generate for a physical setting, aim for output that points back at the space rather than competing with it {{MNEG1sLSRcM#6}}.
- Treat a physical demand as an access decision, and weigh the commitment it buys against who it shuts out {{uZdEXqRkBZA#9}}.

## Generating things you can hold: fabrication and keepsakes

When a generator's output is a physical object, the questions change. Hidden information gets harder {{cGvig1f68Tg#1}}, manufacturing pushes against variety {{FWQwtn-46rs#0}}, and the way someone meets the object becomes part of what it means {{VzoruhRyvqQ#6}}.

### A roguelike you print and break

Adrian Herbez set a high bar for a physical roguelike. Printed tabletop dungeon tiles and 3D-printed board games such as Pocket Tactics, where players construct the level from hex tiles, are in Herbez's view only thematically related to roguelikes {{cGvig1f68Tg#0}}. The project's goals were single-player play, procedural generation, hidden information, and 3D printing being integral rather than a stand-in for mass manufacturing: the artifact should genuinely need a 3D printer, not injection moulding {{cGvig1f68Tg#1}}. Hidden information, which digital games take for granted, was the hard one {{cGvig1f68Tg#1}}.

The answer, Plarl, prints a whole dungeon level as one object in three layers: a red base that encodes exits as a maze, a green icon layer with one to six pips of damage or healing per room, and a blue door layer; both the icon and door layers physically pop off, so you reveal each room by breaking it open {{cGvig1f68Tg#2}}. Rooms are one centimetre, which forced the icons to be simple {{cGvig1f68Tg#2}}. The sparseness leaves a theatre-of-the-mind element: when Herbez kicks down a door and takes four damage, the player imagines the monster that dealt it {{cGvig1f68Tg#3}}. Herbez admits the damage and health icons are hard to tell apart {{cGvig1f68Tg#3}}.

Making doors pop off satisfyingly meant designing for failure. On FDM (fused deposition) printers, resolution is set by nozzle width (typically 0.4 mm) and layer height, and you cannot print in midair except by short bridging spans; that is why rooms are one centimetre {{cGvig1f68Tg#7}}. Plarl prints support tabs exactly two nozzle-widths wide and uses short bridges tuned to the printer, so the door has something to print on but stays fragile in exactly the right place {{cGvig1f68Tg#7}}. The weak point is the mechanic.

### Manufacturing works against variety

bleeptrack names the central conflict: generators are optimised for variety, but manufacturers expect identical runs, so a printer will not make 10,000 different stickers {{FWQwtn-46rs#0}}. bleeptrack's answer for stickers is to print on vinyl themselves, laminate with protective foil and cut by hand, which they find soothing and which lets them look at each piece and sign it {{FWQwtn-46rs#0}}. For procedurally designed circuit-board keyboards, where hand production is not an option, bleeptrack found a middle path: order 10 boards per design and keep the functional traces identical, using translucent fibreglass and decorative copper areas as the visual material that varies {{FWQwtn-46rs#10}}. Vary what is cheap to vary, and fix what the process charges for.

The fabrication method also dictates the output format. Stickers and fabric need only a pixel image, but a pen plotter must know where to move the pen, so the generator has to emit path or vector geometry {{FWQwtn-46rs#4}}. bleeptrack recommends used 1980s architectural plotters for features like electrostatic beds and automatic pen changes {{FWQwtn-46rs#4}}.

Access is a choice too. bleeptrack's "Wish Upon a Star" lantern generator outputs a parameterised 2D cut pattern (spike count and size) that can be printed on a home inkjet and assembled by hand from regular paper, not just laser-cut; assembly takes over half an hour per star {{FWQwtn-46rs#7}}. And they went one step further, bringing the generative process itself into the room: sets of three triangular rubber stamps with matching edges (one connecting on one side, one on two, one on all sides) that people tile by hand into patterns {{FWQwtn-46rs#8}}. bleeptrack made 35 sets, deliberately non-interchangeable because their connectors differ, as an interactive way to show how procedural generation works {{FWQwtn-46rs#8}}. The person becomes the generator.

Herbez offers a browser-based version of putting generation in the user's hands. The greeble modeler lets you drag rectangles and fill them with semi-procedural parametric detail (positive or negative extrusions, arrays of buttons, equipment-style handles, indicator dials with needles at random positions) and exports an STL file that prints as toy accessories; it is built with three.js and its orbit-controls and STL-export add-ons {{SMQuoI_M-kk#0}}.

### How the viewer meets the object

Ada Null argues that how viewers physically encounter generated output is an under-considered part of procedural generation {{VzoruhRyvqQ#6}}. Kiss Garden's output is an endless, disposable receipt. Its length communicates endlessness at a glance, its small text draws viewers close and exaggerates the scale, and viewers can rip it or tread on it because there will always be more, which signals that the content itself is unimportant {{VzoruhRyvqQ#6}}. The material carries meaning the text does not.

> How does the viewer encounter your generated artifacts? {{VzoruhRyvqQ#6}}

### Keepsake games

Florence Smith Nicholls, who read *Love Island* as a roguelike earlier in this chapter, turns the question around: instead of fabricating a generator's output, make play itself produce the object. Keepsake games, a term Smith Nicholls credits to Shing Yin Khor, produce a beautiful, memorable artifact through play, as a collaboration between designer and player: embroidery on a map in A Mending, a scarf knitted according to choices in a Twine game in Luminary {{9kqvF2TqxLo#0}}. Procedural systems such as dice, cards and generators fit them naturally {{9kqvF2TqxLo#0}}.

The examples use existing generators as prompts rather than finished content. Ascending, made at a Dagstuhl seminar session on PCG keepsake games, has players generate a city with Watabou's medieval fantasy city generator and write a postcard about an imagined visit, working out what a 2D schematic map would be like to be inside {{9kqvF2TqxLo#2}}. The generator was chosen partly because it is free and runs in a browser {{9kqvF2TqxLo#2}}. A digital keepsake game made with Mike Cook for the Internet Archive jam deals players random tarot-like cards as interpretation aids for obscure '90s-era archive artifacts, three artifacts and three cards a round, and collects their free-text interpretations into a zine PDF {{9kqvF2TqxLo#1}}. In both, the generator's output is incomplete on purpose: the player finishes it, and the finished thing is what they keep.

**In practice:**

- Make the physical form do work the screen cannot. Herbez's test is whether the object genuinely needs its fabrication method {{cGvig1f68Tg#1}}.
- Learn the machine's tolerances and design the failure points deliberately {{cGvig1f68Tg#7}}.
- Match the generator's output to the process: pixels for print, vectors for plotters, flat cut patterns for home assembly {{FWQwtn-46rs#4}} {{FWQwtn-46rs#7}}.
- Budget for variety. Hand-finish when runs are small; when they are not, vary the cheap layer and hold the expensive one constant {{FWQwtn-46rs#0}} {{FWQwtn-46rs#10}}.
- Decide how people will meet the object, because its material and scale say something {{VzoruhRyvqQ#6}}.

## The generator as partner, prompt and living work

Inside a roguelike a generator has to produce finished, playable content every time. Outside games, many talks describe a different job: the generator exists to change what a person does {{OzCGTXakbjE#5}} {{anwk8b7c_s0#1}}. The keepsake games above already pointed this way. That lowers the bar dramatically {{OzCGTXakbjE#5}}, and one artist argues that a single drop of randomness can be extremely powerful {{-xrcmY7LNPI#0}}.

### A partner only has to make you do it differently

Clarissa Littler built a poetry generator because of being stuck writing in similar voices and line shapes. It produces not words but the shape of a poem (form, layout, line structure, meter, with the syllable as the base unit), and Littler writes into that generated constraint {{OzCGTXakbjE#0}}.

> So the goal isn't to generate poetry. The goal is to generate shapes of poetry. {{OzCGTXakbjE#0}}

The key claim is that a creative partner has a low bar for usefulness: it only needs to make the human create differently, not mimic great work {{OzCGTXakbjE#5}}. You can do a lot starting from very little, and as the generator gets weirder it pushes the writer to be weirder too, an iterative loop Littler calls the partnership {{OzCGTXakbjE#5}}.

Max Hawkins reaches the same place from life rather than art. Hawkins argues that choices and identity carve out a narrow subspace of possible actions that acts like an attractor: once you decide you are "a guitar person", other actions get harder to reach, and recommender systems deepen the rut by predicting your preferences so well you no longer choose {{anwk8b7c_s0#0}}. The paradoxical remedy is to submit fully to a random, unbiased system whose suggestions are not conditioned on your past choices; a comprehensive list includes things you would never think of, and sampling from it is a ladder out {{anwk8b7c_s0#1}}. Hawkins lived this for about two years, randomising restaurants, diet, clothing and where to live; a database of flight fares within budget picked the next city, sending them to places like Slovenia and Dubai {{anwk8b7c_s0#2}}. Taking the generator seriously had a further effect: a randomly drawn action Hawkins wanted to discard forced a confrontation with a contradiction in their own views on eating meat, because they were not the one choosing {{anwk8b7c_s0#10}}. They frame randomisation as a step before curation: it widens the set of possibilities, and then you decide what to keep {{anwk8b7c_s0#11}}.

Chelsea Thompto argues for minimal, targeted randomness. Crediting Vera Molnar and Sol LeWitt, they say a single drop of randomisation can be extremely powerful in a work; you do not need heavy generation {{-xrcmY7LNPI#0}}. Thompto's video piece Productive Bodies guarantees which kinds of material a viewer sees (footage of the Mississippi River, river maps, renderings of gender-affirming surgical techniques, drawn from over 50 sources) but randomises how they combine, so the artist designs relationships rather than a specific narrative {{-xrcmY7LNPI#2}}. That is a precise recipe: fix the categories, randomise the juxtaposition. Mark Gritter points to LeWitt's wall drawings as generative art in the same lineage: they are specified as instructions to carry out rather than images to copy, which lets them be installed in varied spaces, and they often enumerate every variation of a theme, such as lines in all orthogonal and diagonal directions {{mtSjgxS-QS4#0}}.

Nick Montfort treats generated text as material rather than content, and judges a generator by goals like expanding what writing can do, not by how well it imitates a nice haiku {{blXH5pO8GA4#10}}. Botnik's predictive writer works the same way at the level of the word: it offers next-word suggestions drawn from a specific source text, such as TED talks, rather than common texting language, and a human picks word by word, so the output takes on the source's voice {{IujSOW1OMWk#0}}. The machine narrows the choice; the person makes it.

### Where hand-crafting wins

Nat Alison makes the opposing case for puzzles. Computer-generated sudoku that can all be solved by the same fixed set of algorithmic steps quickly becomes boring {{rcIVCrddozQ#0}}. Variant sudoku gets its variety from layering rule types (anti-knight, killer cages, thermometers, whisper lines, irregular regions, chaos construction, even fog of war that reveals clues as correct digits are placed), and while a generator can produce sextillions of classic grids, only human ingenuity has invented genuinely new rule combinations {{rcIVCrddozQ#2}}. Killer cages in newspapers stayed basic for years {{rcIVCrddozQ#2}}.

The two positions are less opposed than they look. Littler and Hawkins want the generator to perturb a person; Alison objects to a generator that replaces the person and produces work all solved the same way. In both cases the novelty that matters comes from human invention. droqen pushes sudoku further toward expression: they encode a message in a puzzle's givens, noting that solving a sudoku "destroys" it into a meaningless block of numbers, and care more about doing something with the format than about how it will be solved {{KfYWVLV5UxQ#0}}.

### Works that keep generating

Some works use the generator not to provoke a maker but to stay alive. Neutrinowatch is a procedural podcast: Jeff Emtman explains that a podcast is just a human-readable RSS text file linking to a public MP3, and nothing in the RSS spec stops you swapping that MP3 out, so they regenerate each episode's audio daily from code {{1sZlIfCcz_c#0}}. Martin Austwick's design analogy is a touring band's set list: each episode is recognisably the same work every day, while the performance changes {{1sZlIfCcz_c#2}}. When episodes draw on live data, the result offers a qualitative experience charts cannot: after analysing 60,000 headlines and finding blast-like language mostly in right-wing outlets, Emtman says listening to the Daily Blast for a week is very different from looking at the pie charts {{1sZlIfCcz_c#9}}. Self-similarity is the roguelike's fixed container; the daily swap is its new run.

Small ongoing generators can matter simply by being undemanding. Joe Sondow, whose Twitter games appear above, cites Katie Rose Pipkin's Tiny Star Fields, a bot posting random arrangements of dots, which gained a hundred thousand followers because it offers a calm moment of procedurally generated sky instead of the news {{4byHHDeVKoA#0}}.

Others become partners you talk to or live with. Kate Compton's Chancery models chatbots as finite state machines, like an old board game with instructions written on its spaces, combined with an internal blackboard and Tracery text generation; Compton's kitten simulator moves between idle, hungry and angry states on timers and counts how many pets it tolerates before biting {{60MTG-__dt4#12}}. Diarytown, led by Melanie Dickinson and described by Max Kreminski (whose "gardening" mode of play appears earlier), has players compose diary entries about their real lives from Lego-like action blocks, then runs sifting patterns to renarrativize their life in a magical-realist tone; Kreminski calls it a step toward malleable simulation, where players shape their computational story partner through play {{BDcZSWHu8RQ#14}}.

At the far edge, the generator is alive. Julian Day describes Christian Bök's Xenotext, which uses bacteria as a procedural generator: a poem encoded into a gene is expressed by the organism to produce a second poem, aiming for a poem that outlasts humanity {{aBbaUSWFQPM#12}}. It worked in E. coli, but the extremophile host quickly undid the gene, raising an open question about stopping evolution from changing a generative artwork; Bök has worked on it since 2002 and spent over $100,000 {{aBbaUSWFQPM#14}}. Cassie Stuurman's slime molds are another biological algorithm: they solve mazes by filling the space and shrinking to the shortest path between food sources, and avoid places marked by their own residue, a spatial memory that lets them escape a U-shaped trap used to test robot navigation {{LoPxtQq0ut4#2}}.

### Generative thinking beyond art

Two talks apply the roguelike's combinatorial lens to life and mathematics. Andrew Cedotal argues that as the space of self-improvement options grows, more success stories will come from acquiring apparently unrelated skills that only later combine, so that life feels more about searching than struggling, and finding out whether they combine takes years of high-risk commitment {{Gxn_MA3-Vgo#4}}. Cedotal frames Luca Galante's creation of Vampire Survivors as one such career combo: a taste for Ultima Online's chaotic low-res real-time 2D, digging through obscure mobile games, and experience making slot machines {{Gxn_MA3-Vgo#3}}. Nat Alison, in the same talk that describes teaching maths as discovery, shows the generative experiment in its simplest form: plotting successive pairs of Fibonacci numbers modulo various bases produced unexpected crosses and fractal shapes, and Alison later found the cross appears whenever the modulus is itself a Fibonacci number {{5_UET-rUtGU#10}}.

**In practice:**

- Decide whether your generator is meant to finish the work or to provoke a person. A provocation can be crude; it only needs to move the human off their habits {{OzCGTXakbjE#5}} {{anwk8b7c_s0#1}}.
- Start with a single drop of randomness. Fix the categories of material and randomise their relationships before reaching for more {{-xrcmY7LNPI#0}} {{-xrcmY7LNPI#2}}.
- Expect a curation step after the random one, by the maker or the audience {{anwk8b7c_s0#11}} {{IujSOW1OMWk#0}}.
- If the output is meant to be a finished puzzle, watch for sameness of solution: varied grids solved the same way are not variety {{rcIVCrddozQ#0}}.
- For a work that keeps generating, keep it recognisably the same work and let the contents change {{1sZlIfCcz_c#2}}.

## Tensions and open questions

### Which roguelike element does a purpose need?

The cases in this chapter keep different parts of the skeleton. *Love Island* keeps both the run and permanent loss {{MQw3pe-z6JM#0}}. Gillian Smith's WPI keeps the runs but removes permanent failure, because its aim is to get people to take risks {{R8DSq8qSJ44@3555#0}}. Stephen Ware's police trainer keeps repetition and permadeath but removes randomness, so a trainee can change one action and see its effect {{Rs_-yMsJDq8#12}}. Nuzlocke players go the other way and add permanent loss to games that lack it {{R8DSq8qSJ44@31561#0}}. None of these is the correct roguelike; the choice depends on what the activity is for: learning through risk wants runs without lasting loss, isolating cause and effect wants repetition without variation, and challenge and attachment want loss. Vermilion leaves open exactly which Nuzlocke ideas roguelikes should take {{R8DSq8qSJ44@31561#1}}.

### Distil the source genre or change its feel?

*Against the Storm* keeps the opening hours of a city builder's loop and compresses them into a run {{tWFIQaeSs6M#0}}. Josh Grams and Brian Walker instead change the source genre's tempo, making flight turn-based so players can experiment, or freezing a platformer's time so play stays cerebral {{TsaRxD3g_os#0}} {{Uo9-IcHhq_w#12}}. The choice depends on whether the source genre's feel is the attraction or the barrier. Tyriq Plummer's recipe metaphor and the same talk's Vagante and Catacomb Kids comparison also pull apart: a hybrid can be described by proportions, yet two games with nearly the same borrowed features feel completely different {{OVSi3NzA0KM#0}} {{OVSi3NzA0KM#7}}. And Alexander King's set-based card acquisition remains untested, because no hit has used it yet {{uwiFwic03EE#10}}.

### Farming or gardening?

Tabea Iseli borrowed from farming games because they share the roguelite's loop of resources, priorities and goals across runs {{-MX1imoSxTg#2}}. Max Kreminski worries that value extraction is what makes a game "farming" rather than "gardening", and says they cannot yet draw the line between them {{TvlZinAvpwg#15}}. Hannah Blair Salzman's Animal Crossing, where any task can be dropped without penalty, points toward the gardening side {{6GSXaM1PTMg#2}}. A cozy roguelike that borrows the roguelite's resource loop sits close to this boundary; whether it feels like nurturing or like extraction depends on whether its world exists for its own sake or for the player's yield, and the talks do not settle where the line falls.

### Griefing: threat or content?

Leif Bloomquist treats abuse of shared objects as a threat to peers who need to progress, and Bloomquist's countermeasure became a bottleneck at about 40 players {{ASGn5J9PHbs#8}}. The Delve Bros treat viewers trolling the streamer as perhaps the most fun part of their game {{4jNMv79Xb6A#7}}. Which view holds depends on whether the target is a peer or a performer. The Delve Bros leave open how one game can serve both a streamer's crowd and a party of friends {{4jNMv79Xb6A#8}}, and how to keep individual success meaningful when a crowd solves a puzzle by brute force {{4jNMv79Xb6A#9}}. Gavin Verhey adds a further pull: they want more co-op roguelikes, but endless replay makes a single-player mode critical {{lGm8cZC8Lfk#25}}.

### Human referee or computer referee?

Jason Grinblat argues that tabletop play fails gracefully because people negotiate the rules, while a video game's framing simply fails {{kvCky6BbTuE#7}}. Benjamin Berman points the other way for constant random handling, which a computer does far better than physical shuffling {{DT9_7sW5knY#17}}, and Jon Perry finds the table's limits restrictive but freeing {{NlxGPKV0PrY#14}}. Atty Vohra's rule resolves part of it: automate the parts of refereeing you find tedious and keep the parts you care about {{0ydWz1EvMJs#6}}. How far automation should go is open; Vohra stops short of recommending a full world simulation {{0ydWz1EvMJs#9}}.

### Generator as provocation, or hand-crafting?

Clarissa Littler and Max Hawkins treat a generator's job as moving a person off their habits, and Littler says the bar for that is low {{OzCGTXakbjE#5}} {{anwk8b7c_s0#1}}; Chelsea Thompto adds that a single drop of randomness can be extremely powerful {{-xrcmY7LNPI#0}}. Nat Alison argues that generated sudoku grids bore because they are all solved the same way, and that only people have invented genuinely new rule combinations {{rcIVCrddozQ#0}} {{rcIVCrddozQ#2}}. The positions agree that the novelty that matters comes from people, but they differ on what a generator's output is for. When the output is a stimulus for a maker, crude is fine; when it is the finished thing an audience consumes, variety of surface without variety of reasoning is not variety. Whether a generator could ever invent rules rather than arrange content, the thing Alison credits only to humans, the talks leave open.

### The price of the physical

Physical form buys things a screen cannot, and it charges for them. Hintline 93's paper binder cost more than an on-screen version, but having players flip pages under pressure felt close to the real job {{R8DSq8qSJ44@22364#12}}. A kneeling posture bought commitment from everyone who took it and excluded others, including the designer when injured {{uZdEXqRkBZA#9}}. Manufacturers expect identical runs, which works against a generator's variety {{FWQwtn-46rs#0}}. Each case trades reach for depth, and the talks give no general rule for where the line falls.

### Unsolved

- How do you stop evolution changing a living generative artwork? The Xenotext's host organism undid its gene {{aBbaUSWFQPM#14}}.
- Which theatre techniques, such as directing a scene's tone at a high level, could games adopt {{cDxL6JoxYQc#11}}?
- Can bugs be understood as part of the intended experience rather than kept on a parallel track for speedrunners {{kvCky6BbTuE#3}}?
- Which everyday activities, text-editor commands and other untapped verbs make good roguelikes {{pYtlU9wGopo#6}} {{R8DSq8qSJ44@1660#7}}?

## Checklist

1. Which structural element are you borrowing or exporting (the run, permanent loss, the container, a tagged generator, a short restartable session), and which are you deliberately dropping?
2. If you are adding game structure to an activity, are you enhancing what is already good about it, or turning it into points and badges?
3. For a hybrid, can you write down what each parent genre contributes, and would restricting yourself to those sources sharpen the design?
4. Are you choosing specific mechanics for what they do, rather than aiming for a ratio of roguelike to something else?
5. Which stretch of the source genre's play does your run contain, and why that one?
6. Does the source genre's feel keep players from experimenting, and does it reward routine or make-work you should remove?
7. On a new platform, have you planned a simplified variant rather than a port?
8. If you changed the subject, have you mapped every loop element to the new theme, and redesigned the rows where the equivalent has no reason to exist?
9. If the game moves to paper or a table, what carries generation, hidden state and the container, and which bookkeeping should stay on a computer?
10. Where can players' own invention feed back into the game?
11. With more than one player, is griefing a threat or the content, and have you tested your countermeasure at the real player count?
12. Can every participant see their contribution, or is success a lottery among the crowd?
13. In a physical space, does the information players need live in the room or on the screen, and who does a physical demand exclude?
14. If the output is an object, does it genuinely need its fabrication method, and does the generator emit the format the process needs?
15. Is your generator meant to finish the work or to provoke a person, and is it sized for that job?

## See also

- [What is a roguelike?](01-what-is-a-roguelike.md): the definitions this chapter takes apart, element by element.
- [Death, difficulty and progression](03-death-difficulty-and-progression.md): permanent loss and runs inside the genre, before they travel.
- [Content generation](10-content-generation.md): generators that must finish the job, the counterpart to generators that provoke.
- [Narrative and worldbuilding](12-narrative-and-worldbuilding.md): story sifting, player-made story and other narrative approaches that sit near reality-TV formats and Diarytown.
- [Interface and accessibility](13-interface-and-accessibility.md): who a physical or platform demand shuts out.
- [Community and business](17-community-and-business.md): streaming, audiences and the people who play together.
