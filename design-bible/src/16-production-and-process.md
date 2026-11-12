# 16. Production and process

This chapter is about how roguelikes actually get made: choosing a first project, finding the seed a game grows from, prototyping, generating and cutting ideas, estimating, paying for procedural content, playtesting, working with a live audience, organising small teams and their tools, keeping yourself going, and looking after a game that outlives its first developer. Most roguelikes are made by one person or a handful, often part-time and often over many years, so these are not side issues. Whether a design ever reaches players depends on them.

The talks approach production as practitioners rather than theorists. They are postmortems, confessions of projects that died, and working methods shared by people who shipped. Read together, they converge on a short list of habits: finish something small, test the core before building around it, cut what does not serve it, assume the schedule is wrong, and put other people's play at the centre of development rather than at the end. Where they disagree, on how much to plan, how long code should live, how to watch a playtest or when to stop building a game, the disagreement usually turns on the size and purpose of the project, and the chapter tries to say which.

## In brief

- Finish a small, complete game before the dream project: only a finished game earns feedback and teaches the whole development process, and a project allowed to die still passes its lessons to the next {{TMxzVy7-VYQ#1}} {{jviNpRGuCIU#2}} {{LQPGmxytTws#1}} {{R8DSq8qSJ44@32392#1}}.
- Build outward from a seed you can test within weeks, whether a core mechanic you can state in one sentence or a feeling you want the player to have, and prototype that before anything around it {{jviNpRGuCIU#4}} {{rNi5nO5yqLs#7}} {{nSJA2yVsTFM#18}}.
- Prototype in the cheapest medium that answers the question (a spreadsheet, paper, a day of code), and decide explicitly when the prototype ends, because otherwise its code becomes the product {{hdhKErNIYgE#0}} {{Kh9m-ixeqec#0}} {{OwFrTY3IoQQ#4}} {{qO3CIpP62Q0#2}} {{jhcHlg7YhPg#1}}.
- Hold every system to the core of the game, including genre staples you assume you need, and in a roguelike ask whether it makes runs differ from each other {{KKwgKTbiEY0#3}} {{3S6uRMCdvNs#4}} {{3S6uRMCdvNs#5}} {{tWFIQaeSs6M#4}}.
- Assume every estimate is far too low, since the cases run over at every scale; one designer's rule is to multiply by four, then by four again {{C6jR41fZjqM#2}} {{5CQP8ndTjEY#27}} {{a3ZYDA2JVSM#3}} {{9se2M27LuOs#6}} {{Gk5uWXBANkA#14}}.
- Procedural generation is not a shortcut to cheap content: budget for honing output to quality, writing in components, validating what the generator can produce and localising generated text {{vtU3Xa0ShKw#21}} {{NjYS8XmeaiY#7}} {{FV_0rmqxbxw#13}} {{R8DSq8qSJ44@5367#12}}.
- You cannot judge your own game's fun or clarity, so make playtesting the centre of development: small rounds of three to five testers, watched live, with at least one change after each {{Kh9m-ixeqec#2}} {{Kh9m-ixeqec#8}} {{Kh9m-ixeqec#9}} {{TMxzVy7-VYQ#10}} {{hnoF_bL-HjI#12}}.
- Player feedback pays only when someone triages it consistently and the team, not the crowd, decides, treating requests as descriptions of problems rather than specifications of fixes {{qO3CIpP62Q0#10}} {{1Np1DSdpoR0#7}} {{Gluz5nIplcA#12}}.
- Make adding one more piece of content trivial and make sure nobody waits on a tool or a decision, because iteration speed is what tools and team structure are for {{FC9GAL2piJI#0}} {{f1t4yPjfZyM#6}} {{p48ArjJweSo#14}} {{fGLJC5UY2o4#3}}.
- Sustain a long project with steady, visible progress (something new every working day, a regular slice of time rather than bursts), and keep talking to players even when you slow down {{KKwgKTbiEY0#5}} {{2C3w7-SU5ek#6}} {{iZUXjbcAfYs#12}} {{a3ZYDA2JVSM#13}}.

## Start small and finish: why a shipped game comes first

The most repeated piece of production advice in these talks is to finish something. Not a demo, not an engine, not a world model: a playable game, however small, that someone else can pick up. The reasoning is consistent across speakers. A finished game is the only thing that earns you feedback, and finishing is the only way to learn the whole development process, which changes character from beginning to end {{TMxzVy7-VYQ#1}} {{jviNpRGuCIU#2}}.

Santiago Zapata tells the story from the inside. Zapata entered the Seven Day Roguelike challenge (7DRL, the annual jam where entrants build a roguelike in a week) for the first time thinking it a waste of time after two unproductive years, and came out with Castlevania Roguelike: not very fun, not complete, but a finished game. Without shipping, they say, you keep working on demos and technical work and never get feedback. That first game had no procedural generation at all; the lesson was that a game could be built around a single fun feature {{TMxzVy7-VYQ#1}}. Josh Ge gives the same advice as a rule for beginners: build a small, complete roguelike before your dream project, because you only learn by going through the entire process once or twice, and because aiming big right away makes failure more likely. A small finished game also becomes a stable foundation to expand later {{jviNpRGuCIU#2}}. Jasper Cole's top advice from Backpack Hero is the commercial version of the same point: release something. The free itch.io version made in January 2022, followed by a Kickstarter in May, is what turned the game into the team's main focus {{COeJTtSDd78#14}}.

Finishing is also a permission you have to give yourself. Jeff Lait contrasts their own 7DRLs, which were actually finished, with Powder, which is not; tying the bow and walking away is hard because a creator always sees more to add, but declaring a small game complete lets you move on and try more of the design space {{LQPGmxytTws#1}}.

### The failure the advice grew out of

The advice is a reaction to a specific history. When Zapata started out, by their own account, they and many others on the Usenet roguelike development group were building world simulators inspired by ADOM and JADE. Zapata's own was a complete medieval fantasy world simulator that took about two years and produced no game; the group was building sandboxes in which "the game will rise" rather than designing a game {{TMxzVy7-VYQ#0}}. In a historical overview, Zapata describes the broader movement, inspired by GenRogue, to make roguelikes the ultimate detailed simulation of a fantasy world, with combat modelling a hundred body parts down to the fingernails; it largely failed because the projects were too complex for their developers to finish {{ZMdxP7fO6wE#14}}.

Tarn and Zach Adams lived the same trap. Their early project Armok tracked every tissue, procedurally generated animations from stance points and showed muscles under stripped skin, down to the curliness of arm hair. Tarn grants there is something to starting from basic structures, but their idea was so large that all they built was data structures, and Armok never became a game; Tarn counts hundreds of dead projects {{Zh6dnx9FM1g#6}}.

Ge offers a picture of what this feels like from inside. Development is a dungeon. Wander toward every system you think you need and you may reach the goal at great cost, or develop yourself into a corner, get demoralised and quit. Instead, make a beeline to a fun playable game with a basic plan, then expand outward {{jviNpRGuCIU#0}}.

### The 7DRL as the community's answer

The 7DRL is the community's institutional response. Lait recounts that it began when Joseph Hewitt, author of GearHead, made a roguelike in a week, and that it broke a design stasis: roguelikes were assumed to be ADOM- or NetHack-sized, and in a game that size design is baked in, so changing something like hit point recovery means changing the whole game. Realising a roguelike could be built in seven days gave new mechanics somewhere to be tried {{LQPGmxytTws#0}}. Zapata places it in a wider shift of the 2000s, when coffee-break roguelikes and the 7DRL moved the community's mindset toward smaller, focused games; the challenge went from fewer than twenty roguelikes in the whole of the 1980s to hundreds every year, pulling in ideas from other genres, although projects aiming at great worlds such as Ultima Ratio Regum continue {{ZMdxP7fO6wE#15}}. David Craddock, who checked in daily with participants for their book One Week Dungeons, found a wide spectrum of designs, from an overworld crawl where the arrangement of three character archetypes decided who dealt and took damage to Darren Grey's music-oriented Mosaic {{Gs9Nb5ZYRY0#11}}.

The jam is not automatically the right first step. Ge calls the 7DRL a good way to prototype and prove a core mechanic, with over a hundred entries a year and a guaranteed audience for anyone who finishes, but does not recommend it as a first game: you don't need that pressure so early, and the deadline helps most once you know the technical side {{jviNpRGuCIU#5}}. Scope still bites inside a week. Zapata's Expedition, a Seven Cities of Gold-style colonisation roguelike, was impossible in seven days and shipped without its procedural generation, with only a fixed map; the lesson Zapata drew was to watch scope, especially when starting out {{TMxzVy7-VYQ#9}}.

Two practitioners give concrete ways to make a week work. Zapata keeps the last day for playtesting and tweaks, gives at least two days to data such as monsters, items and quests, and spends the rest on code; first entries usually aren't good, they say, but the compressed cycle builds the skill of finishing quickly {{TMxzVy7-VYQ#18}}. Ge went further for Cogmind, judging the design far too ambitious for a week and planning on paper for over a month beforehand, without which the 7DRL version would have been impossible. Ge adds that entrants need not match that intensity {{9se2M27LuOs#2}}.

### Good first projects

The talks suggest several first projects that keep design questions small so you can concentrate on finishing:

- **A roguelike of a game you already know.** Ge's first roguelike was an X-COM roguelike, written after Andrew Doull's 2008 call for one. Knowing the mechanics let Ge focus on technical and usability problems such as showing a 3D multi-level world in a roguelike interface; many first roguelikes, they note, turn a favourite thing into a roguelike {{9se2M27LuOs#0}}.
- **An "xRL" of an existing IP.** Most design questions are already answered, so you adapt the IP to roguelike formulas and get instant fans. Ge's examples are DoomRL, AliensRL, DiabloRL and Ge's own XCOMRL, with the warning that litigious IP holders are a real risk: DoomRL was renamed DRL after a cease and desist, and they advise against an explicitly Pokémon roguelike {{jviNpRGuCIU#17}}.
- **A Chase clone.** Dan Norder recommends the old BASIC game Chase as an entry-level project: addictive, simple, easy to make non-violent, re-themeable (PopCap's pirate-themed Seven Seas is one variant), and everything you learn carries over to a full roguelike {{ohH6LBM2EiU#9}}.
- **robotfindskitten.** Leonard Richardson explains that it spread to so many platforms because it is a simple program that does something non-trivial and fun, which makes it a good first program on any new language or platform; Mel Chua learned to program by modifying its source to add in-jokes {{ntVjLNl2_ro#6}}.
- **The next small game, built on the last one.** Zapata's sequence of 7DRLs reused code each time: DrashRL took Castlevania Roguelike's code and added procedural generation, Metroid Roguelike invested in world generation, and Zelda Roguelike added an overworld generator and a more complex dungeon generator {{TMxzVy7-VYQ#2}}.

### The counter-position: a personal project needs no rules

Not everyone accepts the rule. Phillip Daigle deliberately ignored "start small" on Rogue's Gate. Daigle's argument is that a game made purely for yourself removes commercial pressure, and when there is no pressure development stops being a chore and becomes creative expression and a way to learn your own preferences; for the same reason they would not impose arbitrary deadlines on such a project {{2C3w7-SU5ek#16}}. The disagreement is narrower than it looks. Ge and Zapata are advising people who want a finished, played game; Daigle is describing a project whose purpose is the making. Decide which you are doing before you decide how big to go.

### A career of small games

slashie, mapping two decades of their own projects as a network of influences, found that they had not been making separate games but running one long design experiment, each game a fragment of an answer to a few recurring design questions {{R8DSq8qSJ44@32392#0}}. slashie frames development itself as a roguelike: hard design questions cannot be solved in one pass, so each project should be allowed to die rather than be prolonged until it finds the answer, with its postmortem and its players' feedback carried into the next attempt as a mutation of what worked. 7DRLs and game jams helped slashie finish; most projects on the map took under a year, some only days {{R8DSq8qSJ44@32392#1}}.

> You got to give yourself a chance of the project dying instead of prolonging it indefinitely until you hit a solution. {{R8DSq8qSJ44@32392#1}}

Keeping a record is what makes the lineage usable. slashie's map is built from a JSON file of every project (years, collaborators, genre, links) and from slashie's blog, records kept mainly to pick up old work {{R8DSq8qSJ44@32392#0}}. Pippin Barr and Jonathan Lessard go further, documenting every step of making Chogue and publishing its emails, design journal and code history on GitHub, because the knowledge about design lies in the path of decisions, not only in the end result {{l1YEJBKehAY#1}}.

**In practice.** Choose a first project whose design questions are mostly answered: a game you know, a Chase clone, a single fun feature. Bound it so you can finish it in weeks, not years, and leave procedural generation out if the core works without it. If you enter a 7DRL, do it after a first project, reserve the last day for playtesting, and do your heavy design on paper before the week starts. Declare it finished, write down what you learned, and carry the code and the lessons into the next one {{TMxzVy7-VYQ#18}} {{TMxzVy7-VYQ#2}} {{R8DSq8qSJ44@32392#1}}.

## Finding the core: design goals, the one-sentence mechanic and how much to plan

If you are going to make a beeline for a playable game, you need to know what you are aiming at. The talks agree that a roguelike should grow outward from something small and testable. They differ on what that seed should be.

### Two seeds: a mechanic or a feeling

Josh Ge's seed is a core mechanic. Ask what the game's unique take is, and whether it would be fun if it had only that. The mechanic should be explainable in a single sentence, and it is what you prototype first, with only as many surrounding systems as you need to bring it out. If the repeated minute-to-minute play isn't fun, nothing built on top of it will matter {{jviNpRGuCIU#4}}.

Subset Games starts one level higher, from an emotional state. Justin Ma and Matthew Davis describe choosing a feeling and then building whatever game best serves it, assembling their way into a genre rather than picking one first. FTL's feeling was captaining a starship like Adama or Picard; Into the Breach answered superhero films in which cities are destroyed and nobody cares, so collateral damage had to matter and you should be willing to sacrifice yourself to save the city {{rNi5nO5yqLs#7}}.

The two are less opposed than they sound: a feeling still has to be turned into something that can be prototyped. Phillip Daigle shows one route from the feeling end. Daigle sketches a desired scenario as a pixel-art mock-up from their own assets, asks what mood and pressure they want the player to feel, and once something looks worth playing asks how a player would arrive there and what systems they need, much like an agile user story {{2C3w7-SU5ek#15}}. Nic Tringali's The Banished Vault shows the mechanic end. Within weeks the team had a prototype of the delta-v map and movement maths, and asked one question of it: is getting from one place to another on as little fuel as possible an interesting puzzle? Survival goals came after, and the gothic monastery theme later still {{nSJA2yVsTFM#18}}.

Tringali also warns about a quieter way to skip this step. Designers tend to assemble games from components whose feel they assume (dice feel like this, cards like that), which glosses over fine detail; Tringali admits to being prone to designing by intuition and iterating on that intuition, which can feel like building on shaky foundations, and does not believe a game can be designed without iteration and testing {{R8DSq8qSJ44@17074#5}}. Test the seed itself, not your belief about how it will feel.

### How much to plan

On planning, the talks split along a clear line. One side keeps the written design tiny and lets the game reveal itself. Casey Yano says Slay the Spire's design document was about two pages (deckbuilding, classes, monsters); pacing, the map, potions, relics and map node types were all discovered during development {{KYlq0Msu6hc#5}}. Daigle goes further on a personal project: start with only a vague design and build features you will later discard, because each discarded feature teaches you why something does or doesn't work. Rogue's Gate ended up dramatically different from its original plan. Daigle is explicit that in commercial development this waste of time and resources would be a horrible idea {{2C3w7-SU5ek#14}}.

The other side names decisions that are expensive to change later. Dylan White argues that a game's spellcasting resource mechanics (mana bars, cooldowns, cards, regeneration and draw rates) should be settled carefully up front, because spells, items and skills get designed around them and changing them retroactively throws away a lot of work {{kvgKKRLil_8#1}}. Santiago Zapata set explicit design guidelines at the start of DrashRL, no experience grinding and no commands or menus, so as to have a plan instead of improvising. The same project shows the guidelines are not a design: the original ant-colony simulator idea produced no fun mechanic in research, and Zapata switched to a survival arena that worked much better {{TMxzVy7-VYQ#3}}.

Ge's description of how roguelikes are built sits between the two. A roguelike is a conglomeration of systems that can be tacked on one at a time when they support the game, then expanded and iterated with player feedback; all you need is a plan and perseverance {{jviNpRGuCIU#3}}. That structure is what lets a small design document work: the core is decided, everything else can be added later. White's warning marks the exception, systems so foundational that everything else gets designed around them.

### Games that found themselves late

Several well-known games show how far the final shape can drift from the start. Arvi Teikari recounts that Noita spent 2012 to 2016 cycling through an arena platformer, a Terraria-like survival game, a god game, a space RTS, a sci-fi explorer and a post-apocalyptic open world, starting from Petri Purho's blood-swimming puzzle platformer, before drifting into a roguelite as each concept ran into design problems {{huMHQGr8PgM#2}}. Dwarf Fortress began as a planned two-month side project; the Adams brothers switched to real time to fix a mining colony's problems and to dwarves because dwarves mine, and because ideas got implemented so quickly in ASCII rather than 3D, it absorbed the persistent-world goals of Armok {{Zh6dnx9FM1g#8}}. David Brevik held out for turn-based Diablo against Blizzard's repeated requests until a vote of about fifteen to seventeen staff in the kitchen went against Brevik, with only about four wanting to stay turn-based; after trying real time, Brevik knew it was right {{OwFrTY3IoQQ#3}}. The lesson is to keep a vision but not be rigid: listen to trusted feedback and expect the final game to differ from what you imagined {{OwFrTY3IoQQ#12}}.

### Fun is not the only criterion

Xalavier Nelson Jr. challenges the assumption that finding the fun settles every question. Followed uncritically, it becomes following a chain of beliefs and implications rather than deciding on them; if the most fun option creates something you could not justify or do not want to bring into existence, a suboptimal design decision is not just valid but important {{SdQxLThAbs8#4}}. Nelson's team's practice is an audit: go through every category, number and value in the game and draw out its social, moral, cultural and physical implications, checking whether you can stand by each. They caution that it can be bad faith to do this to other developers who may have had little agency, but for their own team it became both a necessity and a chance to say intentional things {{SdQxLThAbs8#8}}.

Some checks are best run mid-development rather than at the start. Ezra Szanton uses synergy networks as a checkpoint on whether drafting feels the way Szanton wants, adding or weakening synergies when it fails, and notes that building natural multiplicative mechanics in early, as Mr. Magpie's multiplier-and-money mechanic does, is an easy way to seed synergies players understand {{JfNeYtH7xI4#13}}.

**In practice.** Decide early: the core verb or mechanic in one sentence, or the feeling you want and one scenario that delivers it; any resource system that spells, items and skills will be built around; and the few guidelines (and values) you will not trade away. Leave to discovery: pacing, the map, secondary item types, and theme if the mechanic does not depend on it. Prototype the seed before anything else, and be ready for the game to become something else {{jviNpRGuCIU#4}} {{kvgKKRLil_8#1}} {{KYlq0Msu6hc#5}} {{OwFrTY3IoQQ#12}}.

## Prototyping cheaply and throwing work away

Once you know what to test, test it as cheaply as possible. The talks give a toolbox of cheap media and, more importantly, an attitude: the prototype exists to answer a question and then be thrown away. They also give the strongest objection to that attitude, from someone who saw the prototype survive {{OwFrTY3IoQQ#4}} {{qO3CIpP62Q0#2}}.

### Cheap media

The cheapest prototype often never touches a game engine. Tyler Robertson calls spreadsheets a poor engine for shipping games but a fun, fast way to find out whether an idea is fun before moving to Unity or Unreal {{hdhKErNIYgE#0}}. Once Robertson had worked out reusable building blocks, all the games in the talk took about a week to build, though discovering the advanced button technique had taken a year {{hdhKErNIYgE#7}}. Brian Cronin laid out the card ideas for their dice roguelike in a spreadsheet and built a Tabletop Simulator version before firing up Unity; friends' feedback was not glowing, but getting it that early shaped the game {{Kh9m-ixeqec#0}}. David Dunham prototyped card-based resolution systems on paper, using plastic sleeves stiffened with bulk Magic cards so that any piece of paper could be slipped in {{oipNr8RE5bA#3}}.

When the question needs code, keep the code small. Brevik built the real-time Diablo prototype in a Friday afternoon, six to eight hours, after sending everyone home; had it failed, it would not have been a big waste. Brevik still prototypes constantly and shelves what doesn't work {{OwFrTY3IoQQ#4}}. Max Hawkins, choosing which parts of their life to randomise, picked whatever was easy to build so as to get experience fast, using "can I do that in a day" as the constraint {{anwk8b7c_s0#12}}.

### The disposable attitude

The talks converge on treating prototype work as something to delete without regret. Yano wrote Slay the Spire as decoupled code there was no fear of deleting: nothing relied on anything else, and anything that did was removed, so systems came and went within a week. Yano fixed code quality only when content work exposed problems, and admits this does not suit teams larger than two. They also advise naming functions after real game concepts (an elite room) rather than vague ones (a strong monster) {{KYlq0Msu6hc#6}}. The design side matched: Mega Crit would try a new feature, such as an enemy that eats your cards, for a single run and axe it on gut feeling if it didn't seem to work, with the two founders acting as harsh editors of each other's ideas, something Yano credits to years of friendship and critiquing games together {{KYlq0Msu6hc#8}}. Cutting is normal even for features that sound great: an early Caves of Qud echolocation mutation, with sonar bouncing off walls and a sonar attack, was one of the first mutations cut because it did not work well {{kDKQM27U-Nc#4}}.

Test the roughest version you can. Shawn Main's advice for a strong core mechanic with many possible secondary loops is to playtest early in the roughest possible shape and watch what testers find fun, which also teaches you how to layer systems {{WLBJJTc6LWI#16}}.

Cheap prototyping also keeps improbable ideas alive. Josh Grams encourages prototyping ideas that have been brewing for a while: the worst case is learning they have no legs, the best is something really cool {{TsaRxD3g_os#8}}. Stray Fawn makes it routine. Every Monday and Friday afternoon is a "do what you want" prototyping session; Philomena Schwab's co-founder built the claw-machine prototype for Dungeon Clawler alone in one, the team moved on and left it in the freezer, and a later trip revived it {{MTam5RT8Kn0#1}}.

### When the prototype refuses to die

Cronin's warning cuts against all of this: the prototype will become the product. Monster Train's prototype was real-time, with three lanes, energy ticking up and combat at fixed rates. The team moved to turn-based play but kept building on much of the prototype code, which caused many problems {{qO3CIpP62Q0#2}}. Years later Cronin draws the boundary explicitly. Throwaway prototypes and game jams don't need careful gameplay architecture, but even smallish roguelikes on multi-month schedules benefit from planning it {{jhcHlg7YhPg#1}}.

> A lot of the code that drives this prototype exists in the final version, so we just kept building on top of what we created. {{qO3CIpP62Q0#2}}

Yano and Cronin are not really in conflict; they describe different moments. Yano's code was disposable while the design was still moving, in a team of two. Cronin's problem began when disposable code was carried into production. The risk is not prototyping in code but forgetting to decide when the prototype has ended {{KYlq0Msu6hc#6}} {{jhcHlg7YhPg#1}}.

There is also a motivation cost in what you prototype. Thomas Robertson describes how the drudgery of building UI during rapid prototyping eats time, forces you to budget more for it whether you like it or not, and saps creativity and motivation, which led Robertson to experiment with variables that draw themselves {{H6fPIhLoA1Y#1}}. Prototype media that skip UI (spreadsheets, paper, Tabletop Simulator) avoid that cost entirely.

**In practice.** Prototype in the cheapest medium that answers the question: a spreadsheet for numbers and card pools, paper or Tabletop Simulator for card and dice resolution, a day of code for feel and timing. Give an idea one run, an afternoon or a day; if it doesn't show promise, shelve it rather than delete the record of it. Keep prototype code decoupled while the design moves. When the game's direction is settled and the schedule runs to months, stop, decide which prototype code survives, and plan the architecture deliberately {{hdhKErNIYgE#0}} {{OwFrTY3IoQQ#4}} {{MTam5RT8Kn0#1}} {{jhcHlg7YhPg#1}}.

## Where ideas come from: ideation, borrowing and lenses

Prototypes need ideas to test, and the talks treat producing them as a craft with techniques rather than as waiting for inspiration.

### Ideation is a skill

Marlowe Dobbe makes the case directly. Ideas are not magical things that appear from thin air; generating them is a skill you can practise. Sitting down to design fifty monsters from scratch would be nearly impossible for most people, so professionals rely on repeatable techniques; Dobbe's three are the list of ten, referencing the game's mechanics, and visual reference {{Wi-OHFmW4Ew#1}}. The techniques can be mixed (they often combine a list of ten with mechanics or reference material), and the generation phase should stay playful and loose rather than chase the perfect idea each time {{Wi-OHFmW4Ew#9}}. The output is a swarm, not a finished piece: concept sketches should be quick and rough enough to convey the vibe for a yes or no from the team, with little time per idea, from which you pick finalists or mash two together {{Wi-OHFmW4Ew#8}}.

The same generate-wide-then-filter pattern appears in other forms:

- **Boon storms.** Alice Lai describes how Supergiant brainstormed Hades' boons in a spreadsheet, listing every association with a god for each ability slot (for Dionysus, everything from bacchanals to satyrs to wine), then filtered down to a strong core identity plus flourishes. Poseidon's core is knockback, but a narrative joke about him giving you things found in his couch became a side branch that grants random items {{pXib0WTfLbI#17}}. Ideas were rated on both coolness and fit with Hades' fast play; a self-freezing invulnerability block was shelved because it would stun the player, and a repeatedly attempted active parry kept failing. Shelved ideas are revisited later {{pXib0WTfLbI#16}}.
- **Theory grids.** Alexandra Leonhart lays out a grid of theorists and concepts against roguelike conventions, looks for "bright sparks" where they resonate, and filters the results through a genre or setting; Leonhart's first test prototype is a cyberpunk roguelike drawing on Frankenstein, Patchwork Girl, Haraway's cyborg manifesto and Mark Fisher {{R8DSq8qSJ44@28748#8}}. They argue that any lens that excites you, not only the queer theory they use, can seed a design philosophy, and closes by asking designers "how are you queering your designs?", meaning which intersections they draw from {{R8DSq8qSJ44@28748#11}}.
- **Ideation decks.** Tyler Coleman proposes a deck of ideation cards for roguelikes that pairs external data sources with game outputs, to push past obvious combinations. Coleman usually starts from the output and looks for a data set, and deliberately pushes towards weirder inputs (Van Gogh's face as a planet rather than rough rock) to test whether the algorithm and the source hold up {{R8DSq8qSJ44@18888#12}}.
- **Community jams.** Botnik produces pieces through writing jams in which around three hundred writers generate lines with a shared keyboard and vote on them, and an editor arranges the best into a script; the roguelike titles and tips in their show were made this way {{IujSOW1OMWk#2}}.
- **An LLM as improv partner.** Brianna McHorse and Chris Foster of Hidden Door compare working with an LLM to improv: impose too little and it becomes incoherent, but it needs room to roam, so "yes, and" its ideas and tie them to written trope threads {{aJC3ioashbs#10}}. Over a year their game moved from almost entirely order to almost entirely chaos and then to a mixed blend; their summary is composable blocks of chaos within order, simple solutions, fast iteration, and handling ethics at the start {{aJC3ioashbs#12}}.

### Borrowing is the genre's method

The second source of ideas is other games, and the talks are unembarrassed about it. Colin Liotta argues that it is fine to take something someone else built and improve it or take it somewhere new, and that this iterative borrowing is the premise of roguelikes {{5VsM8bOywIY#2}}. Tabea Iseli made it a ratio for Grimoire Groves: roughly 70% proven mechanics from roguelike crawlers and farming sims (home base, procedural levels, returning home on failure), 20% adaptations of familiar elements such as a non-violent take on combat, and 10% experiment, because players like games familiar to what they love and building on others' work is easier {{ZJAgY73c8bA#1}}. Coleman extends the idea to a series. In The Sims the previous game becomes the familiar base: the plumbob stays while the neighbourhood changes, and a breakout element like the Goth family, itself built on an Addams Family trope, becomes part of the familiar {{C6jR41fZjqM#6}}.

Borrowing is a choice and can fail. Tyriq Plummer found Spelunky's single attack too straightforward and drew Catacomb Kids' combat from Smash Bros. instead; Plummer also tried a hunger mechanic that didn't work, and sees no problem with that, because failure becomes obvious and your preferences steer you towards something enjoyable {{OVSi3NzA0KM#18}}.

The usual fear is that influence kills originality. Michael Brough argues the opposite: go back to the sources of the works you love, because you can only see what a creator added if you know what they drew from, and the deeper you go into the roots the more original your own transformations become. Brough points to Vance, Leiber, Lovecraft and Zelazny from Gygax's Appendix N list {{zDKheM-E45I#10}}. Paul Dean adds that studying how other works are made (films, novels, music, games) matters as much as studying the results, because creative problem-solving mirrors across media; they treated Vonnegut's drafts of Slaughterhouse-Five as being as valuable as the book {{nLqLOzrjkYU#9}}.

### Ideas from what is at hand

Many ideas in the talks grew from something already in front of the designer. Nick Bush's Word Processor began from the image of redacted documents and came together with the realisation that document navigation is an established set of movement mechanics people use every day {{R8DSq8qSJ44@1660#8}}. Bjarke Alexander Larsen needed something for players to do while the train in Telegrams from the Quiet Train spends real days travelling; a database of people and addresses already built for the shipping system became a logic puzzle {{gxXZRofE5dI#1}}. Younès Rabii saw masks in Tea Garden's generated flowers and added an interaction to wear them, a loop in which interpretations inspire interactions that inspire new interpretations {{s6Kxh_Zyiqs#5}}. Nat Alison constructs hand-made sudoku by asking what happens if two constraint types combine, then turning the resulting break-in into themed deductions; sometimes something breaks and that logic is itself worth showing {{rcIVCrddozQ#6}}.

Two process points help ideas come. Jon Perry found making UFO 50 as a fifty-game collection freeing because no single game had to carry the whole thing, so each could be experimental; Perry is unsure how to keep that freedom in a single project {{NlxGPKV0PrY#19}}. And you need not start at the start: Dean wrote item descriptions for Pacific Drive in a random place and redrafted them as mechanics changed, and argues that insisting on beginning at the beginning is where people get stuck {{nLqLOzrjkYU#4}}.

**In practice.** To generate: write a list of ten; list every association with a theme per slot; cross a set of ideas you care about against the genre's conventions; pair an unexpected data source with an output; look at what your game already has (its data, its generated artefacts, an everyday interface) for a mechanic in waiting. To filter: rate each idea on coolness and on fit with the core play, keep a rough sketch rather than a finished piece, shelve rather than delete, and keep most of the game familiar so the new part stands out {{Wi-OHFmW4Ew#1}} {{pXib0WTfLbI#16}} {{R8DSq8qSJ44@28748#8}} {{ZJAgY73c8bA#1}}.

## Deciding what to build: scope, cuts and productive constraints

Ideas are cheap; implementing them is not. The talks on scope converge on one rule and a handful of questions to enforce it.

### Hold to the core

Matt Ritchie, who calls scope their nemesis, states the rule: in a large project, always adhere to the core of the game and cut anything that doesn't add to it {{KKwgKTbiEY0#3}}. Eric Billingsley, who built a roguelike on the tiny Pico-8 platform, turns it into questions to ask of every system:

- **Do you really need it?** Ask especially if it is a genre staple, since designers assume staples are required without examining them {{3S6uRMCdvNs#4}}.
- **Is it worth the development time?** You have limited time and may not want to spend two years on a roguelike {{3S6uRMCdvNs#4}}.
- **Does it take attention away from the core?** Even a system that adds something can distract {{3S6uRMCdvNs#5}}.
- **Would leaving it out make the game more distinctive?** Think through which decisions its absence would force; some are compromises, some open possibilities you wouldn't otherwise find {{3S6uRMCdvNs#5}}.
- **Can one system do the job of another?** A merged system may be easier to build and easier to understand, since players transfer what they know from one context to another; if two systems don't quite merge, consider adjusting your goals or one system so it mostly covers the other {{3S6uRMCdvNs#9}}.

Against the Storm adds a roguelike-specific filter. Aron Pietroń and Michał Ogłoziński say they measured almost every feature by whether it made runs differ from each other, and in most cases declined features that didn't, even fantastic ones {{tWFIQaeSs6M#4}}.

### Scope as a design decision

Choosing what kind of game to make is the biggest scoping decision. Teikari explains that Noita chose a roguelite over an open world partly because the roguelite had a far more manageable scope, after years without a clear idea of how big the game was; the term "open world" itself implied size {{huMHQGr8PgM#3}}. The choice removed whole problem areas: only one character's movement needed solving, and player-controlled AI agents, base building and pixel-precise digging went away {{huMHQGr8PgM#13}}. Thomas Biskup scoped Ultimate ADOM's first release to a single dungeon crawl with four strongly differentiated races, because replicating all of ADOM plus a surface world would mean shipping in 2036 and starting with fifteen races and twenty classes could not be finished in time {{PTIsUSbQ0TA#0}}.

Presentation is a scope choice too. Todd Furmanski presents their games as clicked still images rather than real-time animation so as to skip character animation and 60 FPS performance tuning: Furmanski did not want to spend three weeks teaching a character to lean over and pick up an object when text can say so. They point out that Myst was made by two people {{ST6s_8ekeOg#0}}. Stray Fawn chose deliberately basic art for Dungeon Clawler so a team of two or three, with an artist working one day a week, could iterate and add content fast; the demo took three to four months, against four years and thirteen people for The Wandering Village {{MTam5RT8Kn0#3}}.

### What expansion costs

Systemic games get more expensive to extend as they grow. Lai relays Supergiant programming lead Gavin's house-of-cards analogy from Hades: build the base wide early, because everything added later builds towards the fragile top, and entropy always wins. New effects that should work in a vacuum keep breaking existing systems; an ability that cleared a debuff for bonus damage forced a rework of a debuff system that had never anticipated conditional clearing {{pXib0WTfLbI#13}}. Teikari says open-world ambitions on top of Noita's emergent simulation made the workload grow exponentially. The abandoned sword-casting blacksmith, where you dig a sword-shaped hole and pour molten metal into it, foundered because even digging one-pixel holes in a fully simulated world without it being annoying was a huge hassle {{huMHQGr8PgM#9}}. Nathan Savant, who worked on the Nemesis system, says NPC reactivity can be stacked endlessly up to something that elaborate; the hard part is holding back and building only what you need {{rmddpcmIJ2I#9}}.

### Keeping ambition cheaply

Cutting is not the only option. The talks offer ways to keep an ambitious feature while capping its cost.

**Build in an escape hatch.** Tarn Adams designs Dwarf Fortress's clue-based villain investigation so that if it fails it can collapse to someone saying "the bandits did it" and the rest of the arc still works. Think about the whole experience you want, and focus on the parts you feel you can do well {{4-7TtPX5uhg#14}}.

**Price what a cut costs the player.** Alexei Pepers notes that closing off an edge case saves development time but turns a fuzzy boundary into a hard one and kills player suspense; on Blaseball, the vocabulary of system suspense helped explain that trade-off to engineers whose instinct was to cut fringe cases such as idolising dead players {{H5EU9_Gdu94#11}}. The cheaper alternative is to limit how often players can test a hypothesis. The Blaseball team mapped edge cases into an outcome tree and allowed an idol choice to trigger only twice; players who never see the exhaustive list cannot spot functionally identical outcomes behind different text, so unique work can be spent only on the branches players are likely to reach {{H5EU9_Gdu94#13}}.

**Judge content against its purpose.** Kristen Yu evaluates each piece of quest content against its stated purpose and tweaks it, cuts it or moves it to another bucket if it isn't serving it. The definitions can encode production limits such as "no cutscenes", which stop designers getting carried away {{WutTZ4FCHA8#11}}. At Improbable, where anyone could pitch quests, a proposed multiplayer quest was reclassified as single-player because it matched that purpose better {{WutTZ4FCHA8#12}}.

### The counter-position: the city, not the resort

Not everyone wants a tight game. George Moromisato's advice from NetHack is to "build a city instead of a resort": AAA games are resorts where you know what will happen, while NetHack accretes mismatched content over decades, a quantum mechanic fighting a vampire, into something living. Moromisato notes it takes decades, and plans to work on Transcendence for the rest of their life {{QBZkvtGucBU#13}}. Even the city has zoning: a NetHack developer coded a Jedi class with a battery-powered lightsaber, and the others cut it because it didn't fit, though Moromisato is unsure that was right {{QBZkvtGucBU#12}}. Julian Day runs Shadow of the Worm as a test bed and zen garden in the ADOM and NetHack style, adding features like alcohol poisoning with little gameplay outcome; Day admits this is to the game's detriment and that it is explicitly not a tight Crawl-style design {{tmrYfnMrifw#5}}.

The choice depends on time horizon and purpose. Ritchie, Billingsley and Against the Storm are trying to ship a coherent game on a budget; Moromisato and Day are describing lifelong projects whose value is in their accumulation. If you are not prepared to work on the game for decades, the city is not an option {{QBZkvtGucBU#13}} {{tmrYfnMrifw#5}}.

### Constraints as a scope tool

Hard limits do the cutting for you. Furmanski calls roguelikes very susceptible to feature creep and found the Atari 2600's ROM, RAM and cycle limits an elegant cure, because running out forces you to stop and decide {{l9eE4mT8xqI#2}}. Furmanski now uses a minimal 2600 roguelike as a personal "hello world" for new platforms, porting it to the Atari 7800, Game Boy and Apple IIe, developing mostly in emulators with a BASIC-like language and testing on hardware through an SD cartridge {{l9eE4mT8xqI#12}}. On Pico-8, Billingsley found the code-size limit the hardest constraint, because unlike a sprite budget (a quarter of the sheet at 8x8 with four frames gives sixteen enemies) you cannot easily estimate how many lines pathing will take; halfway through, every new feature meant reworking existing code to fit, which Billingsley found frustrating but satisfying {{3S6uRMCdvNs#0}}. Lee Tusman points to Rogue 280, a roguelike in 280 characters with an @, HP, level, stairs and invisible monsters, as proof that extreme constraints let you build something quickly that still delights and plays with procedural generation {{-e4gF_SKWPk#5}}.

Small platforms can also be a deliberate long-term choice. Eiríkr Åsheim describes Uxn, a permacomputing platform meant to keep old devices useful, conserve energy and minimise complexity, which runs on 20–30-year-old hardware and in modern browsers {{qogCwa12jEg#1}}, and asks developers to consider whether a smaller, simpler, cozier environment is adequate for their roguelike, since it is easier to understand and reimplement than a big language or console {{qogCwa12jEg#3}}. An old engine can free attention for content: Cara Esten Hurtle relays John Romero's account that building the Sigil Doom maps in an old engine let Romero think about the world rather than technical implementation {{ua2Brr6KCJM#1}}. And reach can come cheaply: Chris McCormick wraps browser roguelikes in a web view, Apache Cordova for Android and Electron for desktop, so debug and shipping code are identical; the Android build of Asteroid took about a day {{dJbUmDsyJRw#13}}.

**In practice.** Ask of every planned system: do I need it even though the genre expects it; is it worth the time; does it pull attention from the core; would its absence make the game more distinctive; can another system do its job; does it make runs differ? For an ambitious feature, design a simple fallback it can collapse to, and decide which edge cases you will close and what suspense that costs. Choose the game's form (roguelite over open world, still images over animation, basic art) to remove whole problem areas. If you can, pick a platform or a rule whose limits will stop you for you {{3S6uRMCdvNs#4}} {{tWFIQaeSs6M#4}} {{4-7TtPX5uhg#14}} {{H5EU9_Gdu94#11}} {{l9eE4mT8xqI#2}}.

## Estimating time and money, and why it is always more

The production stories in these talks share a shape: the work took longer, and sometimes cost more, than planned. The useful question is not whether your estimate is wrong but how to correct for it.

### Think in curves

Tyler Coleman's diagnosis is that developers think linearly, one turn or one level at a time, but games and reality are distributed along curves with non-uniform contributions. Coleman offers the 80/20 rule as a loose heuristic, not numerology (90/10 works as well); the point is that outcomes are rarely linear {{C6jR41fZjqM#1}}. Applied to schedules, the rule recurses: 80% of the work takes 20% of the time, and that repeats at each stage of done, really done, integrated and polished. A one-week prototype takes four more weeks to finish, twenty more to be really done, and integration into a cohesive whole stretches it to about 125 weeks, and it is still not finished. Coleman's rule: multiply any estimate by four, then do it again {{C6jR41fZjqM#2}}.

> Just always assume it'll take longer than you think; take that number, multiply it by four, then do it again. {{C6jR41fZjqM#2}}

Coleman learned it on their own Merchant sequel. Adding "just multiplayer" to an existing game turned a one-year project announced for 2021 into a 2024 release, as the team realised how much more was needed to make it good; the takeaway is never to put a release year on a trailer {{C6jR41fZjqM#0}}.

### The cases converge

Money follows time. Biskup says ADOM's revival consumed more than three times the $90,000 raised by crowdfunding, over a quarter of a million dollars; the crowdfunding money ran out in early 2015, Biskup funded the project privately until the Steam release saved it, and even then the team could not pay everyone full-time though most worked full-time. Biskup urges careful, realistic estimates {{5CQP8ndTjEY#27}}.

The other cases tell the same story at every scale:

- **ADOM.** In summer 1995, at 15,000 lines of C, Biskup told friends a couple more months would finish it; by 2016 it had over 230,000 lines and by their account it will never be finished {{a3ZYDA2JVSM#3}}. Version 0.9.9, when Biskup thought it almost done, came more than four years and about seventeen releases before 1.0 in August 2001; version numbers, they note, come to feel more meaningful than they are {{a3ZYDA2JVSM#12}}.
- **Cogmind.** Josh Ge expected turning their 7DRL into a small commercial game to take a year; three and a half years later the count was approaching 6,000 hours. Players liked early versions, Ge saw potential for more, and wanted an impressive first commercial game because failure would mean giving up full-time development {{9se2M27LuOs#6}}.
- **Axu.** Ritchie's world map is a 200 by 200 grid of tiles, each of which opens into a 45 by 30 local map; Ritchie cites that scale as why the part-time project had taken four years and was about sixty percent done {{KKwgKTbiEY0#0}}.
- **Alphaman.** Jeff Olson's advice includes expecting the last 10% to take as long as the first 90%; finishing a complex game is like completing a PhD thesis, full of loose ends {{Gk5uWXBANkA#14}}.
- **Liotta's puzzle.** Liotta expanded their Mystery Hunt puzzle into a standalone app with about 120 levels, six dungeons and new mechanics such as ice, trailing lava and burning ice, and concluded that roguelikes are never finished {{5VsM8bOywIY#12}}.

Some of this growth comes from success: the game was going well, so it grew. Ge's players liked early Cogmind and Ge saw potential for more; Liotta expanded a single puzzle into a standalone app {{9se2M27LuOs#6}} {{5VsM8bOywIY#12}}. Growth is not always a failure of planning, but it should be a decision, not a drift.

### What a tight schedule costs

Overruns also shape the game. Cronin says Monster Train had many small refactors, but the schedule eventually ruled out big ones, and the architecture probably limited which cards the team could make, a trade-off Cronin considers unavoidable {{qO3CIpP62Q0#15}}. Some problems simply take years: Iseli says that after two years, making a satisfying non-action loop was still one of Grimoire Groves' biggest challenges, in a project the team always knew was a big experiment {{ZJAgY73c8bA#11}}. If the core of your game is experimental, budget for it staying unsolved for a long time.

Olson frames the long tail in a way that makes it bearable: if you make games for your own enjoyment your time is never wasted, so try something nobody has done, use as many playtesters as you can and embrace their criticism {{Gk5uWXBANkA#14}}.

**In practice.** Estimate, then multiply by four, then again, and treat the result as the more likely figure. Budget money for the multiplied schedule, not the first one, and know where funding comes from if it runs out. Treat "just" (just multiplayer, just one more system, just the last 10%) as a warning word. Do not announce a release year until the game is nearly done, and do not let version numbers stand in for progress. Decide early which architecture changes you will be able to afford late, because near the end of the schedule you may not {{C6jR41fZjqM#2}} {{C6jR41fZjqM#0}} {{5CQP8ndTjEY#27}} {{a3ZYDA2JVSM#12}} {{qO3CIpP62Q0#15}}.

## What procedural content really costs to produce

One line item deserves the multiplied estimate more than most. A common reason to reach for procedural generation (content made by algorithm rather than by hand, often shortened to procgen) is that it looks like the cheap way to get a lot of game. The talks that have actually shipped generated content say otherwise: generation moves the cost around, and often adds to it {{vtU3Xa0ShKw#21}} {{NjYS8XmeaiY#7}}.

### Generation is not a shortcut

Several independent talks converge on this. Patrick Belanger and Jackson Wagner, summing up how Wildermyth makes its generated heroes feel authored, list what it took: many traits per hero, traits shown visually, consistent voices, and handcrafted stories selected by trait with added acknowledgement of who the hero is. Belanger calls it a lot of work, and warns that the time it takes to hone a generator into something of high quality has to be weighed when you decide to use one at all {{vtU3Xa0ShKw#21}}. Leigh Alexander makes the same point about writing: working in a generative mode is not labour-saving, and breaking text into components that recombine well can be harder and more complex than writing linear prose. Alexander's reason for doing it anyway is that it is fun, not that it is cheap {{NjYS8XmeaiY#7}}.

The cost compounds downstream. Brian Bucklew and Corey Frang, describing the localisation of Caves of Qud, conclude that a procedural game does not just need a strong translator for each language; it needs a strong technical team for each language, because every language needs its own custom text processors and most of that work does not carry over to the next. Authorship itself becomes technical, with translators and English writers spending much of their time in raw text editors, and making procedural templates easy to author is still an open problem for them. New DLC strings arriving while a language is only 70% done is, for a part-time team of six to a dozen, a large production problem in itself {{R8DSq8qSJ44@5367#12}}. Kingdom of Loathing shows the simpler version of the same trap: Zack Johnson says it is effectively unlocalisable, partly because its text is embedded in old PHP files and partly because so much of its humour is wordplay {{jNUMRG_tvrY#16}}.

> Procedural systems in general not only need a very complex and powerful translation. They need a very complex and powerful technical team. {{R8DSq8qSJ44@5367#12}}

None of this means procgen is a bad bet for a small team. Gabriel Koenig, who usually works alone without a budget, turned to it precisely to make games bigger than they could build by hand {{xju91VGh2Ps#0}}. The two positions are compatible: generation buys scale that a solo developer could not otherwise have, but the scale is not free, and the work of making it good, and of carrying it into other languages and other team members' hands, has to be in the budget from the start.

### Validating content that is chosen at runtime

Jurie Horneman gives the most usable framework for that budget. Horneman separates *dynamic content selection* (picking barks, storylets or rooms from a pool at runtime) from seeded generation, and argues it must be validated differently from static content. The questions are the same two you ask of any content, whether it can break the game and whether it is good, but you answer them differently: with a pool, quality is easier to ship unevenly and harder to define {{FV_0rmqxbxw#0}}. The talk's single closing takeaway is to explicitly budget time to work out how you will answer both questions, because that is real, skilled work {{FV_0rmqxbxw#13}}.

Two production details from Horneman matter for scheduling. First, the analysis sometimes cannot start until the content data is nearly complete: on one location-based project the team knew about a problem but could not choose a fix until the world, locations and quests were set up, and in the end they eyeballed quality rather than automating the check, which Horneman counts as a risk {{FV_0rmqxbxw#12}}. Plan for some validation to land late, and do not assume a known risk can be closed early. Second, dynamic selection has a real production benefit: tag-based room selection decouples level creation from room creation, so different people can build levels and rooms in parallel without waiting on each other. Horneman notes that the same decoupling raises integration risk, which is exactly why the validation work matters {{FV_0rmqxbxw#2}}.

### Deciding what to generate

The talks offer several rules for spending procgen effort where it pays.

- **Weigh complexity against player impact.** Sébastien Benard, working solo after Dead Cells, decides what to proceduralise by comparing a feature's implementation complexity with its effect on the player. Benard's contrast: a random platform generator is very complex and has little impact, while well-dispatched randomised loot is easy to build and has a large one {{QbTnKvRrNYY#0}}.
- **Prefer a simple generator with good content.** Alexander Birke's summary from Sea Of Rifts is that a simple solution with good design and good content beats a clever algorithm, and that using existing tools helps a commercial game ship. The team's narrative designer already knew Tracery and Ink, and, as the session host added, nobody can be hired who already knows your custom system {{0jFzBf0mCRY#17}}.
- **Start with the dumbest version.** Darius Kazemi relays Brian Reynolds' account of AI in Rise of Nations, which started with a strategy picked at random and only grew more complex if playtests showed it was needed; Kazemi makes their own bots as stupid as possible until they amuse enough people {{CLi4PWxDmAI#10}}.
- **Curate at development time.** Mike Cook points out that the designer can choose which generated output ships. Elite shipped only a few of the galaxies its generator could produce, and Cook suggests that generated rule systems could likewise be picked by hand, one per monthly patch, because a system is impactful enough to justify that {{3daNITP9vBc#9}}.
- **Design where the content lives.** For location-based work, Emilia Lazer-Walker built a geofencing tool to walk the physical space, draw regions and tag them with seed words for the generator. Being on site was essential, and playtesting and walking the space took the bulk of the time; the edit-walk-test loop was slower than Lazer-Walker wanted {{MNEG1sLSRcM#9}}. The general lesson is that the iteration loop of a generator includes wherever its output is experienced, and that loop has a cost.

### Two ways a generator eats a project

Pepers names the failure modes. The first is personal: watching a generator spin out content is so absorbing, like spinning straw into gold, that developers can lose days or years tinkering with it and forget the game they meant to make {{mYMdMAvTHpo#1}}. The second is organisational: planning and marketing need someone in the room who understands what procgen can and cannot do, or a team ends up promising thousands of unique NPCs to talk to while refusing to hire writers because an algorithm will handle it {{mYMdMAvTHpo#10}}.

**In practice**, budget for these costs before committing to a generator:

- the time to hone output to the quality bar, not just to get it running {{vtU3Xa0ShKw#21}};
- content written in components, which may take longer than linear content {{NjYS8XmeaiY#7}};
- per-language technical work if you will localise generated text {{R8DSq8qSJ44@5367#12}};
- time to decide how you will check both "can it break?" and "is it good?", some of which can only happen once content is nearly complete {{FV_0rmqxbxw#13}} {{FV_0rmqxbxw#12}};
- a check of each generated feature's player impact against its build cost {{QbTnKvRrNYY#0}};
- someone who can tell planning and marketing what the generator will really deliver {{mYMdMAvTHpo#10}}.

## Playtesting as the centre of development

Everything so far assumes you can tell whether the game is working. The talks are clear that, on your own, you cannot.

### Why you cannot be your own tester

Cronin's argument is blunt: developers are bad at knowing whether their game is fun and bad at knowing whether it is understandable. Something Cronin thought was clear often confuses five testers in a row. So Cronin rejects the traditional pipeline (idea, design document, prototype, production, QA, release) in favour of tight iteration loops built around playtests, and treats developers who skipped playtesting and succeeded as likely survivorship bias {{Kh9m-ixeqec#2}}.

> Devs are bad at knowing if their game is fun. Devs are bad at knowing if their game is understandable. {{Kh9m-ixeqec#2}}

Yano adds a complementary point from Slay the Spire: developers should also play their own game a lot. Mega Crit played two or three runs a week, and the effect was that the team's conversation moved from talking about mechanics to talking about the possibility space, which they could then make real. Yano worries that the loop is harder to close in larger productions where designer, implementer and tester are separate roles {{KYlq0Msu6hc#12}}. The two views fit together: playing your own game shows you what the game *could* be, and other people's play shows you what it actually is to someone who did not build it.

The cautionary cases agree. Zapata's Civilization-inspired Ruler had extensive infrastructure, with cities, roads and trade, but was not playtested until the very end and turned out broken: players could reach the space age very quickly. Zapata's lesson is to invest in playtesting and find friends or online contacts to help, because a developer needs someone else to test {{TMxzVy7-VYQ#10}}. Sersa Victory's Rogue remake let players smash petrified out-of-depth monsters for experience at the risk of attracting a medusa; on paper it was a good risk-reward choice, but Discord players said they rarely did it because the reward did not justify the risk, so Victory retuned it {{TeURjrAYFEU#16}}. Nick McConnell, from maintaining Angband, says a developer needs a vision but should get it in front of players early, because grand plans often prove unpopular on release {{LaOcggk7U88#4}}.

The genre's history points the same way. Glenn Wichman says Rogue's creators had a constant community of testers in the college computer lab who played each new feature as soon as it went in; Wichman did not realise at the time how valuable that was, especially for a genre that is hard to test because circumstances rarely repeat {{IaB7iQhts_c#3}}. Jeff Olson's Alphaman relied on two dedicated playtesters: Greg Krol, who tried every weird edge case (using a mental mutation on their own backpack) and probably crashed DOS several times, and Peter Jessop, who contributed many ideas {{Gk5uWXBANkA#13}}. The two roles, breaker and idea-giver, are still worth recruiting for.

Cronin also puts a number on what this costs. As a part-time solo developer they ran about 88 one-on-one, hour-long sessions over the project, 50 of them in the first year, all over Discord or Google Meet {{Kh9m-ixeqec#1}}. Cronin argues that small teams under-use this live form, often relying only on asynchronous testing where people play and send back notes; asynchronous testing has its place, but one-on-one synchronous sessions are the critical tool {{Kh9m-ixeqec#3}}.

### Silent observation or active listening

The talks agree that you must watch people play. They disagree about whether to talk while you do.

Biskup's experience with ADOM is the strongest case for watching without explaining. After Steam feedback on the user interface, the team began putting people who had never played ADOM in front of a notebook and observing them; the first 60-minute session produced about 150 notes, and Biskup calls user testing their most important mechanism {{PTIsUSbQ0TA#18}}. Testing with diverse small groups (non-gamers, casual players, RPG players and roguelike players) with no explanation taught the team more in an hour than 20 years of ADOM had, and Biskup calls waiting that long a huge mistake: even finding the start button can be a challenge {{hnoF_bL-HjI#12}}. Biskup adds two cautions. Designing for novices risks overcorrecting, so ideas are tested early and failures dropped (the UI had been reworked at least three times), and small test groups are themselves a bubble, so a larger test base is needed {{hnoF_bL-HjI#20}}. And the late game can only be balanced with feedback from core power players, the only ones who reach it, but their influence must be kept away from the early stages, where they would push premature optimisation because everything feels too easy to them {{hnoF_bL-HjI#21}}.

Dan DiIorio's rule from Luck be a Landlord is close to Biskup's: do not steer testers toward the right way to play. An early tester kept taking Coal, a symbol worth nothing that has a 2% chance per spin to become a five-coin diamond, and kept losing. Asked afterwards, the tester said that if it transformed they would be fine, a piece of player reasoning DiIorio says stepping in would have kept hidden for good {{fSmaqjbU2xg#7}}.

Cronin explicitly rejects total silence, talking as an active listener and deciding case by case: if a question bears on what is being tested, Cronin asks "what does your intuition say?"; otherwise the question gets an answer and the session moves on. Testers stuck on bugs get unblocked, notes are taken audibly so testers know their time is valued, and Cronin tries not to be so chatty as to bias them {{Kh9m-ixeqec#14}}. The disagreement is narrower than it looks. Everyone agrees not to explain the game or correct the player's choices; the choice is whether to keep the session flowing with neutral questions. Silent observation suits interface and onboarding tests, where the question is what a stranger does alone; active listening suits remote sessions and design questions, where you need the player's reasoning, which DiIorio also had to ask for afterwards.

### Cronin's method

Cronin's talk is the most complete playtest procedure in the talks, and it is built for teams of one or two.

**The loop.** Form a hypothesis, run a round with one to five testers, synthesise the feedback into prioritised action items, act on them, and repeat. Focus each round on one hypothesis without ignoring the rest of the experience; it is not strict science. Cronin's example of the kind of result to expect is Resident Evil painting interactable objects yellow, plausibly after tests showed players missing them {{Kh9m-ixeqec#7}}.

**What early tests validate.** Four things: whether the second-to-second play is fun, whether the minute-to-minute loop is fun, whether players understand what is happening, and whether the art and theme are compelling. In a deckbuilder, drawing and playing cards is the core nugget; adding cards, shopping and moving between battles is the outer loop. Prototypes can be paper or a mod of another game, and music and artwork can be tested too {{Kh9m-ixeqec#6}}.

**How many testers.** Three to five per round is usually enough, because patterns repeat. Cronin takes the five-user figure from the book *Sprint*, and says a strong gut feeling usually comes by three, sometimes one. You do not need twenty people for every change {{Kh9m-ixeqec#8}}.

**Finding and tracking testers.** Ask: friends and family, Discord servers, playtesting subreddits, social media, paid services, and above all referrals from testers. One Facebook post produced six or seven sessions. Do not over-rely on other game developers, who view games in a particular way, though trusted genre experts are useful {{Kh9m-ixeqec#11}}. Track every session and every interested person in one place, with name, date, build, notes, status and how to reach them; this builds a bank of future testers and a history of the game you can look back on {{Kh9m-ixeqec#10}}.

Subset Games makes the opposite choice for a specific reason. Justin Ma and Matthew Davis build the most hardcore version of a game first and make it approachable later, so their early testers are other developers and people who know their work, who can imagine the finished presentation and are not thrown by strange mechanics {{rNi5nO5yqLs#3}}. The choice of tester follows from what the build is: an unpolished, deliberately hard prototype needs testers who can see past it; a build meant to test comprehension needs people who cannot.

**Running the session.** Open by thanking the tester and asking warm-up questions about what they play, which gets them talking and reveals their perspective: one tester who had never played a turn-based game called Cronin's game "chill". Then ask explicitly for what they find fun, frustrating and confusing, and tell them they will not hurt your feelings {{Kh9m-ixeqec#12}}. When players of a crunchy game go quiet, prompt with "What are you feeling now?", "What decision are you making?", "Do you know what to click next?" or "I sense you're a bit frustrated, I'm curious why"; Cronin keeps the webcam on and encourages testers to do the same, so as to read their faces {{Kh9m-ixeqec#15}}.

**Not getting defensive.** If a tester is confused by a burning skeleton and you point at the status icon they missed, they will retreat to "the game was good, thanks". Use "I" language that owns the mistake ("I can see where I made a mistake") and write it down {{Kh9m-ixeqec#13}}.

**Acting on it.** Do not try to act on everything. Mark action items in each session's notes, gather them with attribution into a prioritised list with hypothesis items first, and accept that unfixed issues will resurface or vanish with later changes. But do at least one thing per playtest; an hour of someone's time that changes nothing is wasted {{Kh9m-ixeqec#9}}. Finally, interpret rather than obey. Cronin says there are no bad playtesters: a harsh tester outside the target audience can be partly right, while friendly one-on-one testers bias positive, which is why anonymous feedback from a public demo is also worth having {{Kh9m-ixeqec#17}}.

### A compact playtest protocol

1. Write down the hypothesis for this round {{Kh9m-ixeqec#7}}.
2. Recruit three to five testers who fit the question; log them {{Kh9m-ixeqec#8}} {{Kh9m-ixeqec#10}}.
3. Warm up, then ask for fun, frustrating and confusing {{Kh9m-ixeqec#12}}.
4. Do not explain the game or correct the player's choices; ask neutral questions when they go silent {{fSmaqjbU2xg#7}} {{Kh9m-ixeqec#15}}.
5. Own confusion as your mistake, out loud {{Kh9m-ixeqec#13}}.
6. Turn notes into a prioritised list and ship at least one change before the next round {{Kh9m-ixeqec#9}}.
7. Periodically test with people unlike your regulars, and keep power-player feedback out of early-game tuning {{hnoF_bL-HjI#20}} {{hnoF_bL-HjI#21}}.

## Developing in public: community feedback, early access and update cadence

Once a game is in players' hands, through a public demo, early access or ongoing updates, feedback stops being something you schedule and becomes something that arrives constantly. The talks agree on two principles for handling it, and both are about the developer's discipline rather than the players': someone must triage it consistently {{qO3CIpP62Q0#10}}, and the team, not the crowd, decides {{1Np1DSdpoR0#7}}.

### Feedback pays only if someone triages it

Cronin credits one tool, more than anything else, for Monster Train's success: consistently acting on feedback. The producer reviewed reports daily, filing them into Jira and tagging them in Slack with emoji reactions for "already filed" or "not a bug". It was a lot of work, and Cronin says it made the game what it is {{qO3CIpP62Q0#10}}. The front end was just as deliberate. Pressing F8 in game sent a report straight to Slack with the log file, save file and a screenshot, with no username, password or alt-tabbing to a website. Even though battles were not resumable mid-fight, the save restored the start of the battle, and the logs revealed problems such as out-of-memory errors. The system is still in the Steam build {{qO3CIpP62Q0#9}}.

> I think this tool more than anything was the reason for our success. {{qO3CIpP62Q0#10}}

### Feedback is not a democracy

Chris King's framing is that the community is not voting. Every suggestion goes through the team's own taste, scope and sense of fit, and the team stays the final arbiter; popularity alone is not a reason to implement something. When the team declines a popular request it says so publicly, so the community knows it is being heard, and King notes that valuable ideas often come from one-off suggesters who are never heard from again {{1Np1DSdpoR0#7}}. King still values player input highly, splitting the feature pipeline into recognition (what needs changing), ideation (proposed changes), decision and implementation, and says choosing from a wide pool of player ideas reaches implementation faster than inventing everything alone {{1Np1DSdpoR0#1}}.

Andrew Aversa gives the sharper version for difficulty in Tangledeep: listen to the problem players describe, not necessarily the fix they ask for. Veterans asked for more hotbars; Tangledeep instead limited hotbars, and nobody complained {{Gluz5nIplcA#12}}. NetHack's DevTeam shows the same filter running over decades. Jesse Collet says the saying "the DevTeam thinks of everything" largely reflects the team absorbing what players tried and suggested, and credits it to those players; the team's process was to ask first whether an idea made sense, and then how to make it work {{9V_CkJ66uJQ#13}}.

### What players can see that you cannot

The case for developing in public is that players see things the developer has become blind to. King says that after two years of development you have no idea what your new-player experience is like, nor which flavour decisions clash with part of your audience {{1Np1DSdpoR0#2}}. But King also names the limit of a long early access: the committed community stops representing first-time players, and familiarity with regulars (one civil member who is always doom-laden, for instance) makes it hard to know what a newcomer would experience. Newcomer feedback has to come from elsewhere, such as convention demos; they call this a tough, open question {{1Np1DSdpoR0#8}}.

Players are also the best stress-testers of a large possibility space. Lai says Hades relied heavily on its early access and speedrunning communities to find design holes where things became too powerful too quickly, such as a Dionysus and Athena pairing that cancelled any projectile {{pXib0WTfLbI#14}}. Dylan Gedig lurks on Twitch while working on Peglin: streams show whether balance works, since players rarely take the path the designer thinks optimal, and with around 100 relics and 30 orbs a clip of a bug shows the whole loadout needed to reproduce it, which a text report often cannot {{ke0cLTVg2_M#3}}. Liotta, reflecting on the roguelike puzzle they built for the 2017 MIT Mystery Hunt, recommends releasing early and studying metrics from real players: early levels were hosted publicly, a few thousand people played, and seeing which levels they enjoyed, hated and got stuck on was a quick lesson in what made a good puzzle {{5VsM8bOywIY#6}}.

The warning cases are about developers who did not listen. Nicholas Feinberg recounts a Crawl player who reported that summoned ice beasts no longer did damage and was told that stuff happens; in fact a bug meant the elemental damage was printed but never applied, and the developers took a full year longer to notice than that player did {{GMkBT4UbvAs#4}}. A probability complaint is not always just bad luck.

Some teams bring players in even earlier. Iseli describes Grimoire Groves' participatory design: going to players as early as possible, within an indie budget, to ask what they wanted. Players chose the art direction and named the game, and their feedback moved the pitch from "Wizard of Legend meets Adventure Time" to "Hades or Cult of the Lamb meets Animal Crossing", serving a cozy audience the team felt was underserved {{-MX1imoSxTg#6}}.

### Data and experiments

Analytics help, but the Against the Storm team warns how they mislead in a roguelite. Pick rates reward the dull: a plain +50% woodcutting perk tops the charts, while the most interesting and best-loved perks are often situational and therefore rarely picked. The team, coming from mobile games, reviews anonymous gameplay data every two weeks but does not follow it blindly, and reads feedback on every channel alongside it {{tWFIQaeSs6M#8}}. For controversial changes they open an experimental beta branch to their most dedicated players and ask pointed questions, above all whether the change makes play more repetitive or more interesting. Ideas pass through the designer, then a team decision, then players, and many features went through three or four iterations before both developers and players were happy {{tWFIQaeSs6M#7}}. Data tells you what players do; a targeted beta question tells you whether it is any good.

### Update cadence

How often you ship shapes what you can design. Evan Debenham ships a Shattered Pixel Dungeon update every two to three months, each with one primary focus. Major updates used to take six months or more; now even big overarching work is split into two-to-three-month deliverables, which limits feature creep and keeps returning players finding something new, and Debenham credits it for players who have stayed since 2014 {{NMWQIdfCgQg#3}}. The shorter cycle also makes experiments cheap: if an update does not work, the worst case is about two months lost, and the next update can revisit it, which frequently happens {{NMWQIdfCgQg#4}}. Every update gets an open public beta of at least a week, during which Debenham fixes critical issues (usually stable after a day), finishes content, makes feedback-driven tweaks and gives community translators time to work. They acknowledge the complaint that players should not be your QA, but argue it applies to big studios: for a small independent developer who is honest about it, early content in exchange for testing is a fair, symbiotic deal {{NMWQIdfCgQg#10}}.

Blaseball is the extreme case. Joel Clark says the promise of weekly updates and continual change forced an improvisational design process with little filtering, because any heavier filter would leave no time to ship changes; the team works from the subconscious and accepts that the design is raw {{zO05p-e57AQ#5}}. It also prioritises new over better: a steady stream of new systems keeps the game unpredictable and gives the community more to interpret, and partly the team simply cannot afford to tear down and rebuild a broken system when adding a simple new one is easier {{zO05p-e57AQ#8}}. That is a choice for a live game built around surprise, not a general rule.

A roguelike's structure rewards growing in public. Peglin was scoped as a six-month project covering one area and only became a three-act game once it found traction; Gedig points out that new content in a roguelike enriches areas players replay constantly, and a basic feature such as viewing the full map was only prioritised because players asked {{ke0cLTVg2_M#7}}.

The counterweight is Dan DiIorio's warning: fix a design problem as soon as you see it, because changing beloved content gets harder the longer it ships. Luck be a Landlord's Cultist symbol, useless alone and stronger in numbers, pushes players into dull all-or-nothing builds; DiIorio noticed early but kept it because players liked it, and years after early access a change would provoke far more backlash {{fSmaqjbU2xg#4}}. Early access is when a change is cheapest; it is not a reason to defer one.

### When the bug is the feature

Jason Grinblat questions the assumption under all of this. Bug methodologies treat every bug as an interruption of an intended experience to be triaged and fixed; for games built as scaffolds for explorable worlds, where bugs come from systems colliding, Grinblat asks whether designers can make explicit room for bugs that enchant rather than only admiring them after the fact {{kvCky6BbTuE#2}}. The constraint is labour. Turning a bug into a polished feature takes work, so a team can only do it for some bugs; for the rest it must either accept what is on screen or remove it if it is truly bad {{kvCky6BbTuE#17}}. Add a third category to your triage, "keep and develop", and budget for it like any other feature.

**In practice:**

- Put a one-key report button in the game that attaches logs, save and screenshot, and route reports somewhere the team already looks {{qO3CIpP62Q0#9}}.
- Assign one person to read and triage every report, daily if you can {{qO3CIpP62Q0#10}}.
- Filter suggestions by your own taste and scope; when you say no to something popular, say so publicly {{1Np1DSdpoR0#7}}. Treat requests as descriptions of problems {{Gluz5nIplcA#12}}.
- Read analytics alongside written feedback, and test contentious changes on an opt-in beta branch with specific questions {{tWFIQaeSs6M#8}} {{tWFIQaeSs6M#7}}.
- Get newcomer feedback from outside your core community {{1Np1DSdpoR0#8}}.
- Pick a cadence you can keep with one focus per update and a public beta before each release {{NMWQIdfCgQg#3}} {{NMWQIdfCgQg#10}}.
- Fix design problems while the audience is still small {{fSmaqjbU2xg#4}}.

## Teams, tools and pipelines

For a small team, a central production question is how quickly a piece of content can go from someone's head into the running game. The talks treat iteration speed as the goal that tools and team structure serve {{FC9GAL2piJI#0}}, and then count the cost of the tools {{YfLYPIXGF7E#7}}.

### Iteration speed as the goal

Birke states it as policy on Sea Of Rifts. Birke's aim as tech lead was never to be an implementation or a decision bottleneck: tech must not block content, the decision maker must not block decisions, and anyone on the team should be able to push content into the game without checking first. Iteration speed is paramount, because without it you are in for a world of pain; Birke cites the book *Turn the Ship Around* as inspiration for letting people do their jobs {{FC9GAL2piJI#0}}. The game is kept always playable with automated tests and frequent playtests, and artists and programmers share responsibility for both aesthetics and performance rather than splitting into those who care about looks and those who care about frame rate {{FC9GAL2piJI#1}}. Opening tools to the whole team pays off in surprises: procedural tools handed to others got used in ways Birke did not anticipate, as when an artist ignored the coding rules of a sub-tiling shader and used offsets to make two stained-glass window types from one tile {{FC9GAL2piJI#13}}.

Several developers converge on the same lesson from the code side: make adding content easy, and more content follows. Thomas Robertson says the most important thing they did on their procedural super attacks was set themselves up for success; once new effect atoms were easy to add, Robertson immediately made more. If adding a fire effect is hard you will not get around to it, and if it is easy you will add ice too {{f1t4yPjfZyM#6}}. Danny Day built Desktop Dungeons' event-listener system so balance changes would not mean searching a growing codebase; it delivered, letting Day build two whole new classes for an update in a week, against months of slog updating the interface for mobile {{p48ArjJweSo#14}}. Biskup reports the same effect from Ultimate ADOM's data-driven entity component system: the pentagram that let a character possess other bodies took about a day, but the soul-exchange spell that reused it took about eight minutes because of external configuration, and every new component suggests around twenty more items, spells or monsters that could reuse it {{fGLJC5UY2o4#3}}.

### What tools cost

The same architecture can be expensive. Biskup warns that a full entity component system (ECS, an architecture that builds game objects from data components rather than class hierarchies) is not trivial: Ultimate ADOM's took nine months with 10–15% still to do, and getting it to run at reasonable speed is part of the cost. Biskup still recommends it for games that push the boundaries of interaction {{fGLJC5UY2o4#19}}.

Tools can also be built at the wrong grain. Stav Hinenzon describes Sunshine Shuffle's dialogue tool, designed to be fully atomic: every node created and linked by hand. In practice the work consolidated into lines of dialogue and turns of poker, so the atomic graph only added time-consuming authoring work {{MyVigc1nDig#3}}. Hinenzon's takeaways are to design tooling by talking with the people who will use it, and that flawed tools can still ship a game you are proud of {{MyVigc1nDig#8}}.

The decision rule comes from Spencer Egart: weigh time saved against time invested, and generally do not build tools during a game jam such as the 7DRL. Egart's demo generator sits in a project named for the 2021 7DRL, for which no game shipped. When a tool is meant to widen expressive range rather than save time, the value is harder to measure and becomes a judgment call {{YfLYPIXGF7E#7}}. Patrick Kemp at Spry Fox shows how to keep the investment small. Tooling that pays off later in production is hard to justify against feature work, but an HTML page that parses the game's JSON was quick to build and new dashboard views take a day or two {{rWPJ5fW1UH8#15}}. One view, not in the original spec and trivial to add, counts how often each dialogue animation tag is used, so writers can spot over- and under-used animations and animators can see what to make next {{rWPJ5fW1UH8#10}}.

Birke's tools on Sea Of Rifts are about preventing errors and collisions. Custom Unity editors make data entry less error-prone than raw formats such as XML, because the tool shows the structure and enforces field types {{0jFzBf0mCRY#14}}. To avoid merge conflicts in a game built in a single Unity scene, the lead alone owns the canonical scene; everyone else works on a copy named after themselves, refreshed at intervals, with a console warning when it is out of date, and assets are split by discipline so the narrative designer's content lives in separate files and never touches prefabs {{0jFzBf0mCRY#15}}. Sofie Kjær Schmidt adds the same instinct for non-code tools: avoid juggling too many. Schmidt keeps overall art direction on a Miro board but moved per-environment style guides to Google Slides because they are easy to modify, share and print without account setup, and drops any tool that causes friction {{FC9GAL2piJI#3}}.

Sergio Garces gives the asset-side version for 3D on a budget: buy cheap store assets early so you prototype with something better than boxes, then shop for specific needs while bookmarking interesting finds, and expect to modify every asset, which needs at least some technical-art skill. If you cannot find what you need, you may have to change plans or build it {{6U8c6hbVJLY#13}}.

### People between disciplines

Tools only go so far if people cannot understand each other. Gillian Smith distinguishes additive interdisciplinarity (A plus B), multiplicative (expertise at the intersection) and integrative, which trains people to be translators between disciplines, a role they say interdisciplinary game teams badly need. Smith's example: a game-design and robotics team building a robot escape room spent about six months not realising that the y-axis points out of the screen in robotics software but up in 3D modelling software {{R8DSq8qSJ44@3555#10}}. Pepers makes the procgen version: larger teams need procgen translators and advocates to bridge deep specialists and everyone else, while small teams can afford to be all specialists {{mYMdMAvTHpo#11}}.

Shared vocabulary is the practical form of translation. Yu describes how agreeing on quest terminology at Improbable let designers hand programmers a complete list of every objective type they wanted, long shots included, so the quest system was built to support them all up front rather than broken by later requests {{WutTZ4FCHA8#4}}.

Writing is the discipline most often missing. Julian Day observes that most roguelike teams are teams of one and most roguelike developers are not writers, so text gets treated as a chore before getting back to mechanics {{aBbaUSWFQPM#2}}. Leigh Alexander's remedy is pairing: Alexander asked Brian Bucklew to teach them spreadsheets as a generative back end, and suggests generative coders find a writer obsessed with some story domain they know nothing about {{NjYS8XmeaiY#9}}. Zapata gives the general rule for small teams: split work so each person does what they add most value to. On Fusion Abyss a partner wrote the 3D display code while Zapata wrote an Ultima Underworld-style level generator; they struggled with graphics, and Zapata's advice is to get an artist on board {{TMxzVy7-VYQ#15}}.

**In practice:**

- Build a tool when the time it saves clearly exceeds the time it costs; skip tools in a jam {{YfLYPIXGF7E#7}}.
- Design the tool with the person who will use it, at the grain they actually work in {{MyVigc1nDig#8}} {{MyVigc1nDig#3}}.
- Start with the cheapest version, such as a web page over your existing data files {{rWPJ5fW1UH8#15}}.
- Make adding one more piece of content trivial {{f1t4yPjfZyM#6}}.
- Let anyone push content without waiting on you, keep the build playable, and give each file one owner {{FC9GAL2piJI#0}} {{FC9GAL2piJI#1}} {{0jFzBf0mCRY#15}}.
- Agree on vocabulary before building systems that several disciplines feed {{WutTZ4FCHA8#4}}.

## Keeping going: motivation, pace and the solo developer

Most roguelikes are made by one person or a few, often part-time, so the real constraint is rarely skill. It is sustaining effort for years.

### Know why, and add something every day

Ritchie starts with motive. Know why you are making the game (creativity, money, challenge, learning) and who it is for, and know why you abandoned past projects: Ritchie lists lack of time, lack of motivation, failed ideas and scope creep. The personal drivers are creativity, challenge and learning, since donations earned about $400 in two years {{KKwgKTbiEY0#2}}. Ritchie's own failures are instructive: projects that repeatedly changed genre (a survival game becoming a Binding of Isaac-like) and that depended on collaborating artists who never delivered {{KKwgKTbiEY0#1}}.

The working rule is to add something new every day you work on the game, however small; endless tweaking and premature optimisation produce no progress, and tweaked code will be replaced anyway. An hour a day, about the time spent watching television, makes a difference {{KKwgKTbiEY0#5}}. To keep that hour fresh, they rotate between art, system code and new content such as enemies {{KKwgKTbiEY0#8}}.

Daigle, writing for beginners, arrives at the same two ideas. What kept Daigle going after repeatedly bouncing off programming was small, highly visible progress; abstract problems are the hardest to stick with, and GameMaker helped by providing ready functions so the time went to the fun parts {{2C3w7-SU5ek#6}}. And some features, pathfinding for instance, are infinite problems that will always yield a little more progress, so learn when good enough is good enough and keep two or three features to rotate between, switching when one turns into a grind {{2C3w7-SU5ek#7}}. McConnell says the same from maintaining Angband: avoid rabbit holes, and sometimes you just need to do it and ship {{LaOcggk7U88#5}}.

> You want to add something new every day that you're working on it, even if it's small. {{KKwgKTbiEY0#5}}

### Habits for learning while building

Daigle's other advice is aimed at people learning to program through their game. It is fine to change a variable, recompile and see what happens; experienced programmers call that bad practice, but for a beginner it is how you learn what functions do, and work that gets thrown away is fine because the point is understanding {{2C3w7-SU5ek#8}}. When stuck, explain the problem in full to a rubber duck or a non-technical friend, including every variable and every failed fix; organising it for someone else often surfaces the answer {{2C3w7-SU5ek#17}}. And track the licence and credit of every third-party asset from the first day, even while just goofing around, or months later you will not know where anything came from; OpenGameArt and Wikimedia Commons let you filter by licence {{2C3w7-SU5ek#10}}.

Many roguelikes start as learning projects. ADOM began in 1992 when Biskup wanted a project to learn C; they looked at the NetHack sources to modify them, found them too advanced, and took what they ironically call the easier route of writing their own game {{a3ZYDA2JVSM#1}}. Ian Bettencourt, at a 2016 lightning talk, described starting a roguelike in C before a college class with nothing but a compiler, a debugger and ncurses, writing a custom engine, finding linked lists and arrays more useful than the trees the classes stressed, and learning to decouple code by showing it to a roommate {{SDojcmObQzw#11}}. Kate Compton gives the attitude: aim for the 95% of the fun you can reach with 5% of the knowledge, taking what you need from computer science and getting back to your life {{E5-3Ui7oO8U#4}}.

### Pace and burnout

Biskup's history with ADOM shows both ends of the pace problem. In 2010, close to burnout from juggling five or six projects alongside a PhD, Biskup cut everything else and returned to ADOM because its players were still there after ten years {{a3ZYDA2JVSM#15}}. Later, when an investor allowed the team to work on it full-time for the first time in 25 years, releases went from about one a quarter or a year to nine in six weeks {{iZUXjbcAfYs#2}}. The conclusion is that steadiness matters more than volume: even 20% of a full-time team's effort gives ADOM more steady development than years of hobby time worked only "when time allows and nobody is sick", enough for perhaps monthly releases {{iZUXjbcAfYs#12}}.

### Distance, backups and lowered stakes

Joel Ryan, who spent about five years on the Sil-Q tileset, describes two hazards of long creative work. Up close, you resist throwing away work you laboured over; stepping away for days or months erodes that resistance, and redesigned tiles almost always came back better. Ryan had to discard all the early werewolf work, and likens it to dying in a roguelike: you are making yourself into the person who can make the thing {{UIsNv3UOzvA#15}}. The opposite hazard is "noodling", too many small changes that slowly push the work in the wrong direction, like over-working clay on a wheel. Keep backups, compare against older versions, and sometimes pull the best part of an old version, a colour scheme or a good left leg, into the new one {{UIsNv3UOzvA#16}}.

Jeremy Rose found that lowering the stakes cured perfectionism. Rose had torpedoed most earlier projects by deciding they would never be good enough; the Cataclysm guide was built in 15-minute gaps during a newborn daughter's naps, and caring for the baby made imperfect fonts and layouts obviously unimportant {{ziN33iMQVPo#9}}.

**In practice:**

- Write down why you are making this game and why your last one stopped {{KKwgKTbiEY0#2}}.
- Add one new thing every working day; do not count tweaks {{KKwgKTbiEY0#5}}.
- Keep two or three tasks in different disciplines to rotate between {{KKwgKTbiEY0#8}} {{2C3w7-SU5ek#7}}.
- Prefer a small, regular slice of time to occasional bursts {{iZUXjbcAfYs#12}}.
- Step away before deciding whether to throw work out, and keep old versions to compare against {{UIsNv3UOzvA#15}} {{UIsNv3UOzvA#16}}.
- Keep a credits file from day one {{2C3w7-SU5ek#10}}.

## Long-lived roguelikes: maintainers, legacy code, rewrites and variants

Some roguelikes live for decades. ADOM has been developed by its creator since 1992 {{a3ZYDA2JVSM#1}}, while Angband passed to non-creators almost at once {{eeSk665OXkM#1}} and NetHack's DevTeam was built from contributors {{9V_CkJ66uJQ#0}}. That creates production problems most games never face: what to do with an engine that has outgrown itself, who gets to change a game players have loved for twenty years, and how to keep volunteers coming.

### Content is the real asset

Biskup's central lesson from ADOM is that writing the content, not the engine, is the real work. Building a modern Java successor, JADE, Biskup found ADOM had so much content that could not be ported that moving it would take five years or more, so it was easier to bring JADE's good ideas back into ADOM {{a3ZYDA2JVSM#23}}. The same reasoning drives the later plans: use ADOM as an engine for other games, reusing its body of content with very different gameplay, as in an unreleased mobile prototype called ADOM the Arena {{a3ZYDA2JVSM#24}}. Ultimate ADOM extends it further, using its story as a reason to build variants for different platforms and play styles on one unified engine, so players learn the rules once and carry that knowledge between games {{iZUXjbcAfYs#9}}.

### Rewrite, restart or glue

Whether to rewrite is where the talks pull apart, and Biskup's own history is the case study. Disliking ADOM's architecture, Biskup spent what little programming time there was on JADE, which further stalled ADOM {{a3ZYDA2JVSM#14}}. Yet by 2017, after 25 years of code, many ideas for ADOM were technically almost impossible or not worth the effort, and players' suggestions kept hitting the engine's limits; the team chose to build a new game, Ultimate ADOM, which Biskup insists is not ADOM 2 but something different {{iZUXjbcAfYs#5}}. Biskup also tells would-be modders that if you have your own vision, writing a new roguelike is often easier than modifying ADOM's sources, which the ADOM team itself finds really hard {{a3ZYDA2JVSM#26}}.

Ritchie argues the other side for projects still in development: do not throw a project away to start over just because you have learned enough to do it better; keep the existing code malleable and work with it {{KKwgKTbiEY0#6}}. Tarn Adams gives a third option from Dwarf Fortress, which Adams describes as having a geological history of layers piled on each other. Look for features you can build by gluing together systems you already have; the villains feature reuses existing monsters, necromancer apprentices, spying agents and relationships, and cutting corners this way saves years. They say the approach would work in a more pared-down game with comparable pieces too {{4-7TtPX5uhg#3}}.

The positions fit together once you separate engine from content. Biskup's rewrite stalled the game when it meant moving content to a new engine {{a3ZYDA2JVSM#14}} {{a3ZYDA2JVSM#23}}; the new start Biskup did commit to was a different game, built for ideas the old engine could not hold {{iZUXjbcAfYs#5}}. Ritchie's warning is about restarting the same game because you could now write it better {{KKwgKTbiEY0#6}}. Adams' approach is what to do when you stay: treat the accumulated layers as building material {{4-7TtPX5uhg#3}}.

### Who may change a game players love

Erik Osheim and Robert Au describe the maintainer's position on Angband. Angband was maintained by non-creators very early: its creators graduated in 1990, and the first public release in 1993 came from other students. Maintainers get less leeway for drastic changes than original creators, because veteran players are attached to old versions (on IRC people still argue that the last good version was 1997, or 2005) and ask whether the original author would approve {{eeSk665OXkM#1}}. Yet volunteers on an unpaid game need room to make their own mark; most will not volunteer just to fix bugs. Outside pressures force change anyway, such as Angband running on small Android screens {{eeSk665OXkM#2}}.

> Most people don't want to just volunteer to go fix bugs all the time; they want to do things, they want to make their own mark on the game. {{eeSk665OXkM#2}}

Nick McConnell, a later Angband maintainer, offers the escape valve: fork the game into a new variant. That frees a developer from the original's baggage, and players who are hard on changes to the original tend to welcome variants warmly, even buggy ones {{LaOcggk7U88#3}}. Maintenance also means subtracting. The Angband team removed little-used options and old ports it could not test, since features nobody uses produce no bug reports and cannot be maintained; that was somewhat controversial with the few people who still used them {{eeSk665OXkM#10}}.

### Governance

Long-lived roguelikes have settled on very different structures. Angband shows how a single-maintainer model breaks. When Robert Rühlmann burned out after about five years of unpaid work, a dead zone of roughly a year and a half followed; the announced successor released nothing, and Andi Sidwell, who had been releasing unofficial versions, became maintainer when Nick McConnell declared it and nobody objected {{eeSk665OXkM#4}}. Sidwell, from the open-source world, then moved Angband from a benevolent dictator to a collaborative team with a public issue tracker, public version control and a relicence to GPLv2 that meant contacting more than 100 contributors, though what vanilla Angband should be, museum piece or living game, stayed open {{eeSk665OXkM#5}}.

NetHack's DevTeam grew from contributors. Players posted bug-fix diffs on Usenet, then tested feature patches, and strong contributors were invited in; Jesse Collet joined in 1988 after posting suggestions with tested code {{9V_CkJ66uJQ#0}}. The team had no real leader and no code ownership, ideas arrived as "here is what I coded", and Collet realised in hindsight that they never said "no" or "but", only "yes, and", improving on what had been done {{9V_CkJ66uJQ#1}}. Cataclysm: Dark Days Ahead took openness furthest: Jeremy Rose says it began as Zachary Jenkins' solo project and has had over 1,700 contributors, which Rose compares to Python's roughly 2,000, making it "nobody's game", an amalgam of many people's ideas {{ziN33iMQVPo#0}}. bhauth sees the design result of that kind of history in Dungeon Crawl Stone Soup: built and tested by many people over a long time, its design philosophy is the overlap of several perspectives rather than one framework, such as removing or automating no-brainer choices where one option is strictly better but more annoying. bhauth's advice is not to be ideological, because a blend of heuristics usually beats one {{tg-CjNodlmY#11}}.

### When the developer goes quiet

ADOM's long gap shows the failure mode. Around 2001 Biskup co-founded an IT company and worked 60–80-hour weeks while the code had outgrown itself; exhausted, the first thing they stopped was communicating with players, and a PhD and marriage cut Biskup's time further. There were two releases in almost a decade, the last at the end of 2002 {{a3ZYDA2JVSM#13}}. What brought it back was, in part, that the players were still there {{a3ZYDA2JVSM#15}}.

**In practice, for maintainers and successors:**

- Treat the content as the asset; prefer moving ideas into the existing game over moving content to a new engine {{a3ZYDA2JVSM#23}}.
- Before a rewrite, ask whether you are rebuilding the same game or making a new one the old engine cannot hold {{iZUXjbcAfYs#5}} {{KKwgKTbiEY0#6}}.
- Build new features from systems you already have where you can {{4-7TtPX5uhg#3}}.
- Expect less leeway than the creator had; put radical ideas into a variant {{eeSk665OXkM#1}} {{LaOcggk7U88#3}}.
- Give volunteers room to make their mark, and make the path from patch to team visible {{eeSk665OXkM#2}} {{9V_CkJ66uJQ#0}}.
- Plan succession before burnout, with public tracking and version control so others can carry on {{eeSk665OXkM#4}} {{eeSk665OXkM#5}}.
- Remove what you cannot test {{eeSk665OXkM#10}}.
- If you must slow down, keep talking to players {{a3ZYDA2JVSM#13}}.

## Tensions and open questions

**Start small, or make what you want?** Zapata, Ge and Lait argue for a small finished game first, because finishing is how you learn and how you get feedback {{TMxzVy7-VYQ#1}} {{jviNpRGuCIU#2}} {{LQPGmxytTws#1}}. Daigle deliberately ignored that advice on Rogue's Gate, arguing that a game made purely for yourself has no pressure to relieve and is better treated as creative expression {{2C3w7-SU5ek#16}}. The choice depends on whether the goal is a game other people play or the act of making it.

**How much to decide before you start.** Yano's two-page design document and Daigle's discard-heavy exploration leave most of the game to discovery {{KYlq0Msu6hc#5}} {{2C3w7-SU5ek#14}}; White wants resource mechanics settled up front because everything gets designed around them, and Zapata set explicit guidelines at the start {{kvgKKRLil_8#1}} {{TMxzVy7-VYQ#3}}. Even Daigle says the approach would be a horrible idea commercially {{2C3w7-SU5ek#14}}. The useful question is which of your systems are foundational enough that changing them later throws away work.

**How long code should live.** Yano kept Slay the Spire's code decoupled and deleted freely {{KYlq0Msu6hc#6}}; Cronin watched Monster Train's real-time prototype code carry into a turn-based game and cause problems, and later argued that even small multi-month roguelikes deserve planned architecture {{qO3CIpP62Q0#2}} {{jhcHlg7YhPg#1}}. Yet Ritchie warns against throwing a project away to start over because you could now write it better {{KKwgKTbiEY0#6}}. Disposable code, planned code and kept code each have a defender, and none of these talks says how to recognise the moment a prototype becomes production.

**Rewrite, restart or glue.** Biskup's JADE rewrite stalled ADOM, yet Biskup later started Ultimate ADOM as a new game because the old engine could not hold the ideas players wanted {{a3ZYDA2JVSM#14}} {{iZUXjbcAfYs#5}}; Tarn Adams prefers gluing together layers that already exist {{4-7TtPX5uhg#3}}. Separating engine from content reconciles some of this, but whether a twenty-five-year codebase should be extended or replaced remains a judgment each long-lived project makes alone.

**A tight core or a city.** Ritchie, Billingsley and the Against the Storm team cut whatever does not serve the core or make runs differ {{KKwgKTbiEY0#3}} {{3S6uRMCdvNs#4}} {{tWFIQaeSs6M#4}}. Moromisato's "build a city instead of a resort" and Day's kitchen-sink Shadow of the Worm value accumulated, mismatched content {{QBZkvtGucBU#13}} {{tmrYfnMrifw#5}}, though even NetHack's city cut a Jedi class, and Moromisato is unsure that was right {{QBZkvtGucBU#12}}. The choice depends on time horizon: the city takes decades.

**Is fun the final test?** Ge's rule is that if the core minute-to-minute play is not fun, nothing else matters {{jviNpRGuCIU#4}}. Nelson argues that following the fun uncritically means following implications rather than deciding on them, and that a less fun design you can stand behind is sometimes the right one {{SdQxLThAbs8#4}}. The two can coexist, fun as a requirement and not a sufficient justification, but the talks do not say where the line falls.

**Silent observation or active listening.** Biskup and DiIorio watch without explaining or steering {{hnoF_bL-HjI#12}} {{fSmaqjbU2xg#7}}; Cronin rejects total silence and talks as an active listener {{Kh9m-ixeqec#14}}. Silence suits tests of onboarding and interface, where the question is what a stranger does alone; active listening suits tests of the player's reasoning.

**Who should test.** Subset uses other developers and people who know its work for its hardcore-first builds {{rNi5nO5yqLs#3}}; Cronin warns against over-relying on game developers {{Kh9m-ixeqec#11}}; Biskup keeps power players away from early-game tuning while needing them for the late game {{hnoF_bL-HjI#21}}. The right tester depends on what the build is testing.

**Developing in public, and its limits.** Players see what developers cannot, and a game shaped by them can be better for it {{1Np1DSdpoR0#2}} {{pXib0WTfLbI#14}}. But King points out that a long early access community stops representing first-time players, and calls finding newcomer feedback a tough, open question {{1Np1DSdpoR0#8}}.

**What data can tell you.** Liotta learned quickly from public play metrics on which levels players enjoyed and where they got stuck {{5VsM8bOywIY#6}}; the Against the Storm team warns that pick rates reward dull perks and bury interesting situational ones, and pairs data with targeted beta questions {{tWFIQaeSs6M#8}} {{tWFIQaeSs6M#7}}. In these two cases, metrics served well for which levels players enjoyed and where they got stuck, and misled when pick rates were read as a measure of what is interesting.

**New systems or fixing old ones.** Blaseball puts new systems ahead of repairing broken ones, partly to stay unpredictable and partly because rebuilding costs more {{zO05p-e57AQ#8}}. DiIorio warns that design problems left in place become harder to change as players grow attached {{fSmaqjbU2xg#4}}. Debenham's short update cycle softens the dilemma by making any single experiment cheap to revisit {{NMWQIdfCgQg#4}}.

**Should every bug be fixed?** Monster Train's success is credited to consistent triage {{qO3CIpP62Q0#10}}. Grinblat asks whether games built from colliding systems should make explicit room for bugs that enchant, while admitting that turning a bug into a feature is labour only some bugs can get {{kvCky6BbTuE#2}} {{kvCky6BbTuE#17}}. How to decide which ones is left open here.

**Unsolved production problems.** Making procedural text templates easy to author and localise is still open for the Caves of Qud team {{R8DSq8qSJ44@5367#12}}. Perry does not know how to keep the experimental freedom of a fifty-game collection inside a single game {{NlxGPKV0PrY#19}}. And Angband's maintainers left open whether a decades-old vanilla game should be a museum piece or a living game {{eeSk665OXkM#5}}.

## Checklist

- Is this the game you can finish, or the dream project? If it is the dream, have you shipped something small first {{jviNpRGuCIU#2}}?
- Can you state the core mechanic in one sentence, or name the feeling the game is for, and have you prototyped that alone {{jviNpRGuCIU#4}} {{rNi5nO5yqLs#7}}?
- Which of your systems (a spell resource, say) will everything else be designed around, and have you settled them early {{kvgKKRLil_8#1}}?
- Are there values or implications in your numbers and categories that you would not stand behind, however fun they make the game {{SdQxLThAbs8#8}}?
- What is the cheapest medium that answers your current question, and have you decided when this prototype's code stops being disposable {{hdhKErNIYgE#0}} {{jhcHlg7YhPg#1}}?
- For every planned system: do you need it even though the genre expects it, is it worth the time, does it distract from the core, could another system do its job, and does it make runs differ {{3S6uRMCdvNs#4}} {{3S6uRMCdvNs#9}} {{tWFIQaeSs6M#4}}?
- Does each ambitious feature have an escape hatch, a simple version it can collapse to if it fails {{4-7TtPX5uhg#14}}?
- Have you multiplied your estimate by four, twice, and kept the release year off the trailer {{C6jR41fZjqM#2}} {{C6jR41fZjqM#0}}?
- If you are generating content, have you budgeted for quality, validation and localisation, and compared each generator's cost with its effect on the player {{FV_0rmqxbxw#13}} {{QbTnKvRrNYY#0}}?
- When did someone who did not build the game last play it while you watched, and what changed as a result {{Kh9m-ixeqec#2}} {{Kh9m-ixeqec#9}}?
- Can a player report a bug with one key, with logs and save attached, and does someone read every report {{qO3CIpP62Q0#9}} {{qO3CIpP62Q0#10}}?
- When players ask for a fix, have you identified the problem behind it, and said publicly when the answer is no {{Gluz5nIplcA#12}} {{1Np1DSdpoR0#7}}?
- How long does it take to add one more item, spell or monster, and who is waiting on whom {{f1t4yPjfZyM#6}} {{FC9GAL2piJI#0}}?
- Did you add something new on your last working day, and do you know why your previous projects stopped {{KKwgKTbiEY0#5}} {{KKwgKTbiEY0#2}}?
- If you stepped away tomorrow, could someone else carry the game on, and would your players hear from you {{eeSk665OXkM#5}} {{a3ZYDA2JVSM#13}}?

## See also

- [10. Content generation](10-content-generation.md) — what procedural content is for, the other side of what it costs to make.
- [15. Architecture and tools](15-architecture-and-tools.md) — entity component systems, data-driven design and editors in technical depth.
- [17. Community and business](17-community-and-business.md) — early access, crowdfunding, communities and selling the game.
- [13. Interface and accessibility](13-interface-and-accessibility.md) — the onboarding and interface problems that playtesting with strangers uncovers.
- [05. Systems and emergence](05-systems-and-emergence.md) — why systemic games get more expensive to extend, and where enchanting bugs come from.
- [02. History and lineage](02-history-and-lineage.md) — the 7DRL, the variant tradition and the long-lived games whose maintenance this chapter discusses.
