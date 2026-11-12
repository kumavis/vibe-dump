# 12. Narrative and worldbuilding

A roguelike kills its protagonist, rebuilds its world and starts again, often dozens or hundreds of times. Story has to work inside that loop. This chapter covers where roguelike stories come from and how players assemble them; how to leave room for imagination; story shapes that survive permadeath; what death and restarting mean in the fiction; how mechanics, numbers, tone, setting and words build a world; how to structure authored story for replay; how to make generated characters, histories and plots read as stories; and how to borrow real symbols and cultures responsibly.

The talks approach narrative from unusually varied directions: working roguelike developers, interactive-fiction authors, academic researchers in story generation, a former playwright, tabletop designers, reality-television analysts and the fans who chronicled Blaseball. Their through-line is that the story a roguelike player remembers is mostly one they put together themselves, so the designer's job is less to tell a story than to build a world that generates, implies and acknowledges stories, and to make sure the fiction and the mechanics say the same thing. Authored narrative still has a place, but only when it is shaped for repetition and death, and when the systems, symbols and tone underneath it are chosen on purpose.

## In brief

- Players remember and retell what the systems did to them, not the scripted beats, and Emilia Lazer-Walker argues that roguelikes are better than any other genre at producing those emergent stories {{MNEG1sLSRcM#0}} {{4-7TtPX5uhg#5}} {{BDcZSWHu8RQ#0}} {{_Si626-Y_q0#0}} {{C2CzHLtt1Fw#3}}.
- Emergent stories need systems that interlock, behave consistently and can be investigated, plus enough sparseness that players have room to invent the rest {{4-7TtPX5uhg#1}} {{dJbUmDsyJRw#1}} {{IaB7iQhts_c#6}}.
- Show less than you know: thin, fragmentary and unexplained material is completed by players' pattern-seeking imagination, and explaining it can take that away {{dCWWId16VAo#4}} {{isB82kORimk#1}} {{NklQJfhZT3k#3}} {{RYZSdPuvta8#2}} {{nLqLOzrjkYU#12}}.
- Treat the game as the player's storytelling partner: start them with a generated situation, keep introducing disruptions, limit undo and options, and remember and call back their small choices {{BDcZSWHu8RQ#1}} {{BDcZSWHu8RQ#2}} {{BDcZSWHu8RQ#3}} {{BDcZSWHu8RQ#4}} {{BDcZSWHu8RQ#5}} {{x0Xh4oCX9t0#4}}.
- Make the player live the story through decisions and play rather than read about it, and where a rule feels arbitrary, a thin layer of matching fiction can make players accept it {{G5rq5ei2Lec#1}} {{oV5PjvcVky8#0}} {{jd7K0EmkvPk#5}} {{tWFIQaeSs6M#14}} {{NlxGPKV0PrY#13}}.
- Your numbers, categories and generators are worldbuilding, because players read them as facts about the world whether or not you meant them to {{SdQxLThAbs8#7}} {{SdQxLThAbs8#1}} {{ZtXGg6ECwQ8#0}} {{ujKlmvfpNMo#6}}.
- Authored story has to be built for repetition: keep anything that replays every run short, and prefer linear strands or storylets released by conditions across runs over branching trees {{G5rq5ei2Lec#2}} {{kn2QkH5lByw#5}} {{sOZH6RPuNJ8#0}} {{sOZH6RPuNJ8#2}} {{sOZH6RPuNJ8#5}} {{UGPkEWqwSAY#11}} {{MyVigc1nDig#1}}.
- Generated characters feel authored when generation leads into handwritten material and the game visibly acknowledges what has happened to them, including what happened by chance {{vtU3Xa0ShKw#0}} {{vtU3Xa0ShKw#14}} {{vtU3Xa0ShKw#12}} {{C2CzHLtt1Fw#7}}.
- A simulation's output is not yet a story: log what happens, sift it for dramatic patterns, and surface the best moments to the player {{BDcZSWHu8RQ#7}} {{aJC3ioashbs#1}} {{WeRCGy3-uPY#0}} {{WeRCGy3-uPY#1}} {{oaDI0lWkedg#2}} {{XFFyN10o87I#2}}.
- Death and restarting are narrative material: decide whether the restart needs an in-world reason, carry story rather than power across deaths, and let failed runs leave traces in the world {{AwOuZTCeOrU#10}} {{ujKlmvfpNMo#12}} {{G5rq5ei2Lec#3}} {{FZn4NeQOcFE#8}} {{AwOuZTCeOrU#2}}.

## Where roguelike stories come from

Every game carries two stories. Emilia Lazer-Walker, borrowing Marc Laidlaw's framing, calls them the *embedded* story, the authored content a designer studs into the game, and the *emergent* story, the one that comes out of the player's own choices. Roguelikes can have both, but she argues they are better than any other genre at the second kind, at making space for players to come up with stories of their own {{MNEG1sLSRcM#0}}. The value of player-made stories recurs across the talks from speakers working on very different games, and it is the foundation for everything else in this chapter: in a roguelike, the story the player remembers is mostly one they put together themselves.

### The convergence: players tell stories about what the systems did

Several speakers arrived at the same observation independently. Max Kreminski points to retellings like Boatmurdered (Dwarf Fortress), Alice and Kev (The Sims) and Pro Vercelli (Football Manager) as evidence that some players seek out simulation games primarily as storytelling partners, and relays an academic view that a game succeeds if it drives players to create stories about their experiences {{BDcZSWHu8RQ#0}}. What he loves about roguelikes, he says, is that a player fumbling around in Dwarf Fortress and dying produces a compelling story even though neither the player nor the game was trying to make one {{oaDI0lWkedg#0}}. Brian Walker describes the story of a Brogue run as the player's path through dense, intense, interlocking zones, chosen by an improvised build: high-intensity zone effects make it exciting, qualitatively varied zones make it novel, and dense interlocking makes the choice of path interesting, so the story is co-authored by the player's choices and the dungeon {{lfb6uehmrWo#16}}. Jim Shepard reports that Dungeonmans has almost no authored plot, only a minimal legend of past heroes and a villain, yet when he asks players what the story is they describe what they did. A well-established tone gave them a trellis for their own narratives to grow on {{_Si626-Y_q0#0}}.

The scripted parts, by contrast, are what players do not retell. Tarn Adams notes that people's Skyrim stories are about putting buckets on people's heads, never about the dragon; he has never heard anyone recount a boss battle. Fixed plot events are the same for everybody, so the retellable thread is what the player actually did, and in strategy games it is how the opposition behaved on a randomised map {{4-7TtPX5uhg#5}}. Jamie Brittain's best Shiren the Wanderer run ended at the final dragon because his hand was stuck in a pot and he could not fight: an ending no blockbuster would script, produced by chaos flowing through systems {{C2CzHLtt1Fw#3}}. Nick Cummings makes the same argument about baseball, which looked rigid on the surface but turned out to be a story-generation engine that only works because of its quirks, frictions and imperfections, conjuring nicknames, odd outcomes and stories at every level of play; he calls the joy in edge cases where rules bump into each other the essential roguelike experience {{R8DSq8qSJ44@2704#5}}.

Aaron A. Reed gives this a history. The Hobbit text adventure had simulationist ideas that produced un-Tolkien emergent stories, and the genre that followed treated those as bugs; the ideas were not adopted by text adventures, but they had been living in roguelikes all along {{CE7o3GGif30#11}}. The reason, he says, is that a designer with a specific story to tell finds emergent behaviour breaks it: if the story is about the nobility of elves, picking one up and carrying him around ruins it. He calls The Hobbit a bifurcation point where text adventures could have become more like roguelikes {{CE7o3GGif30#12}}. The choice between control and simulation is old, and roguelikes sit on the simulation side of it.

Xalavier Nelson Jr. puts the consequence for procedural generation bluntly: its value is creating an endless supply of context into which players inject their own meaning {{SjttI9N9KSM#5}}. Shepard draws the matching conclusion for authored content: however elaborate it is, storytelling is only at its best when the player contributes to the output, so developers should provide seeds and listen {{FZn4NeQOcFE#13}}.

> It is about creating context, endless amount of context for people to find their own meaning in. {{SjttI9N9KSM#5}}

### Retelling is the evidence

If emergent stories are the goal, how do you know you have them? Florence Smith Nicholls proposes *retellings* as the test: if players are motivated to retell their play experience, the generated experience was interesting or memorable. Some systems even host retellings directly, as Love Island does with its spin-off show and weekly panels, and as Blaseball did with official round-ups that organised its history into eras {{MQw3pe-z6JM#3}}. Shawn Main reports that Riot took exactly this as an early signal that its Lab of Legends roguelike mode was working: players came back saying, in effect, "I had this power and this card, let me tell you about this", and Main attributes those personal stories to combinatorial choices producing sharp power growth in a short time {{WLBJJTc6LWI#3}}. Watch for players telling you stories: both talks treat it as a signal that the narrative is working.

### The raw ingredients

The talks name a handful of sources from which these stories are made.

**Chaos.** Joel Clark argues narrative is how people rise above and explain things that otherwise make no sense, so allowing more chaos into a design can make the stories told or generated from it better {{zO05p-e57AQ#11}}.

**Dice that redirect.** Shawn Main, answering a dungeon master, says what makes critical failures and successes matter is that a single roll can take the story in its own direction; slight over- and under-performance across two hours of rolls does not engage him. The result of one roll becomes the setup for the next story beat {{UZ7XqQYDM7o#16}}.

**Correlations that beg explanation.** Alex Byaly's causal-graph generator produces patterns such as accountants evading more tax or goats never eating mice. Either relationship could have gone the other way and either could be explained, and if he does not supply the explanation, players will: he calls these correlations storytelling fuel {{otEv5dh2f4E#10}}.

**Player mistakes.** Brittain recounts entering a Heat Signature capture mission with only lethal gear and improvising by putting a subverter on a teleport pad to send the target into space for pickup; designer Tom Francis replied that this was the kind of high jinks he hoped for. Brittain describes Heat Signature as a game that relies on the fallibility of how players engage its systems, and sets it against story structures that encourage compliance {{C2CzHLtt1Fw#4}}.

**Other players.** Tyriq Plummer argues multiplayer roguelikes produce richer stories than solo deaths: a companion stealing a vital potion and leaving you, hunting them down for revenge, or both ending up cornered. A real human supplies betrayal more cheaply than a simulated relationship would {{neuJCYmbAG8#1}}.

**Loss and attachment.** Stella Vermilion describes how Nuzlocke losses build emotional attachment to nicknamed party members: in her Brilliant Diamond run one was lost to a critical hit at the grass gym and another deliberately sacrificed so the run could continue, and victory can come only after many sacrifices or across several runs {{R8DSq8qSJ44@31561#7}}.

**Happy accidents.** Generators with many outputs produce coincidences that players read as intended. Elliot Trinidad seeded themed name parts into Blaseball's name generator, hoping, for instance, that "beef" would land on the Dallas Steaks. Then Beef Knight died and was replaced by Flan Prince, a similarly themed name, by one-in-a-million chance, instantly creating backstory and fan speculation. When a generator outputs a hundred things, players connect the dots {{9yFferxbrBU#10}}. Plain names have their own value: Blaseball's narrative team wanted more "nobody" characters who could rise purely through generated events, and Mike Townsend went from hated, meme-worthy pitcher to central hero while some main-character names got benched and did nothing {{9yFferxbrBU#6}}.

Younès Rabii's Pokemon Glitch, a randomised, glitched Pokémon Gold, is the extreme case. In Sprout Tower, which an NPC says was once a hundred-foot Bellsprout, a monk who should have a level-3 Bellsprout had one at level 131, an illegal level, and fighting it felt like fighting the tower itself {{Ove6z8zDsjE#5}}. Cyndaquil evolved through five stages into a plant type, and Rabii made up head canon to explain it: a sequoia that grows from the ashes of forest fires {{Ove6z8zDsjE#8}}. The silent final boss Red became "Rocket Red", asked in glitch text for a Pokémon and an attack, took Rabii's ghost Pokémon and its Curse, said the curse was erased and disappeared, closing a story about a hostile, cursed world {{Ove6z8zDsjE#9}}. Rabii's conclusion is that these mechanics and this story had no author, not Nintendo, not him, not his program; randomness mixing existing material supplied the right ingredients for a story to form in the player's mind {{Ove6z8zDsjE#11}}.

The same mechanism works at the tabletop. Atty Vohra invents a backstory to justify a generated monster's stats, such as a ghost princess tormented by a patriarchal sultanate, and that backstory can seed a quest line to avenge her, weaving random encounters into the campaign's larger narrative {{0ydWz1EvMJs#5}}.

### What you have to provide

Emergence is not free. Tarn Adams summarises what produces it: interlocking mechanics that resonate with the outside world, are internally consistent, and let the player investigate. Those produce stories players retell to each other, and he says designers already understand this intuitively from playing such games {{4-7TtPX5uhg#1}}. The other half is room. Chris McCormick calls the original Rogue "minimalist perfection": enough going on that it is not boring, but sparse enough to leave the player space to invent their own narrative {{dJbUmDsyJRw#1}}.

**In practice:**

- Build systems that interact with each other, behave consistently, and can be probed; these are where retellable events come from {{4-7TtPX5uhg#1}} {{lfb6uehmrWo#16}}.
- Allow outcomes that swing hard, from crits, mistakes and other players, rather than smoothing every result toward the mean {{UZ7XqQYDM7o#16}} {{C2CzHLtt1Fw#4}}.
- Let generators produce patterns and coincidences without explaining all of them {{otEv5dh2f4E#10}} {{9yFferxbrBU#10}}.
- Treat players retelling their runs as the measure of success, and consider giving them a place to do it {{MQw3pe-z6JM#3}}.

## Let the player's imagination do the work

The first roguelike learned this lesson by accident. Glenn Wichman, Michael Toy and Ken Arnold planned for Rogue's monsters to have their own ways of living, perhaps building their own dungeons. Once rooms, letters and stats were in place, the game was effectively done: players were already imagining all of that, and the designers just had to get out of their way {{IaB7iQhts_c#6}}.

### Thin stimuli, rich stories

A cluster of speakers explain why this works: the player's mind fills gaps and finds patterns. The pattern-finding side is *apophenia*, the human tendency to perceive meaningful patterns in unrelated data, which Cezar Capacle describes directly below. Joseph Hewitt says the mind keeps a mental simulation that fills gaps, so sparse information, as in Bloodborne, can produce elaborate imagined worlds; the player's imagination does much of the world-building {{dCWWId16VAo#4}}. Kate Compton's Hip Chef patron generator produces customers like "a nervous nun with haunted eyes" who orders chardonnay and leaves; she says this sketching of text that makes your mind tell stories is, for her, one of the core ingredients of roguelikeness {{isB82kORimk#1}}. Cezar Capacle explains why random encounters and oracle results in solo tabletop play do not dissolve into incoherent chaos: pattern-seeking and confirmation bias, harmful in real life, help when creating a story as you go, and players weave the results into a cohesive narrative that sometimes surprises them {{NklQJfhZT3k#3}}. Dustin Freeman, citing Grotowski-era "poor theatre", reads out a Spirit of the Ages message log in which a bear eats a frog, gains HP, stops being angry and feels social toward you because of a strange mood. Adding explicit story or explanation, he argues, would take away the player's own interpretation, which is where the interesting things happen {{RYZSdPuvta8#2}}.

> It is the player's imagination that is doing a lot of the heavy lifting to build this game world. {{dCWWId16VAo#4}}

Presentation carries the weight. Shepard argues that a great story shown badly falls apart while a merely okay story presented in a fun way grows on players; information should be shown so players can and choose to retain it, and since roguelike players already do mental lifting with ASCII symbols, you can spell out a lot but not everything {{jd7K0EmkvPk#0}}. Santiago Zapata, offering his own reading rather than the developer's, says ADOM handled the fact that computers are not good at storytelling by building a detailed original setting with foundations for several paths, which players might or might not follow, letting their imagination complete a more complex world than earlier games had {{ZMdxP7fO6wE#13}}. For modular procedural text, Bruno Dias says the writing style itself must change: brief, evocative, not overly detailed, giving small morsels that lead players on so they build their own arcs. That is what lets him generate Voyageur's planets one at a time without fitting them into an overarching narrative {{UGPkEWqwSAY#13}}.

### Give story in fragments and gaps

The practical consequence is that you do not need to tell the whole story, or tell it in order. Paul Dean, writing for Pacific Drive, describes lore that players get the gist of from partial fragments, like archaeology or a jigsaw, citing Horizon Zero Dawn's side quests and lore found in any order; he kept his own lore short, relevant, varied and worth finding {{nLqLOzrjkYU#12}}. He grounds this in the genre's structure: roguelikes are built on repetition, mirroring and parallels punctuated by novel discoveries that join a bigger picture, so players will meet story elements in any order and linear narrative need not be treated as necessary {{nLqLOzrjkYU#10}}. A loose narrative with holes, like Stardew Valley's short conversations and parallel threads, invites players to build interpretations from what characters do not say; that fanbase has extrapolated from such gaps for a decade {{nLqLOzrjkYU#3}}. And you can introduce an idea without explaining it and pay it off later, which creates suspense: stories are not programs that must load every reference up front {{nLqLOzrjkYU#0}}.

Several devices exploit gaps directly:

- **Cropped descriptions.** Mike Cook compares a good street photograph to FromSoftware-style item descriptions: a partial description of an item, place or person with trails coming off it that suggest a whole society, just as things exist beyond the edge of a photo {{nOGNdrjm8ek#4}}.
- **Coined vocabulary.** Younès Rabii notes that the novel La Horde du Contrevent constantly coins words without explaining them, evoking a rich world through vibes and interpretation, as Caves of Qud's names suggest a whole creature in a single word {{6ik6jB2YhZg#6}}.
- **False rumours.** Leonard Richardson points out that NetHack's fortune-cookie rumours include false ones like "Ever tried enchanting a rope?" when the game has no ropes. One line of text suggests a mechanic that would be expensive to build, expanding the imagined game at almost no cost; he now loves the false rumours more than the true ones {{ntVjLNl2_ro#4}}.

### Order changes meaning

Tim Keenan tested this in Duskers. For the gray goo storyline, one log has a scientist worried about a half-gelatinous dead rat near a replicator, another has operators mocking scientists who panic over replicators. In a web survey that showed the logs in random order, reading the worried scientist first made the rat seem more concerning, though Keenan admits results got noisier with more respondents {{G5rq5ei2Lec#5}}. He had planned to dole out a linear backbone story in order, but shuffled the pages and gave them to different people, who formed completely different interpretations. He embraced it: competing theories debated on forums became part of the fun {{G5rq5ei2Lec#9}}. If your fragments will arrive in random order anyway, write them so that every order produces a reading, and treat divergent readings as a feature.

Chelsea Thompto sees a related quality in procedural art: it asks audiences to spend longer with a work, which then blossoms in the mind over repeated experience rather than being immediately clear, something she connects to what she loves about roguelikes {{-xrcmY7LNPI#6}}.

### Immersion, frame and cooperation

How fully does the player believe? The talks offer three related positions. Jason Grinblat, drawing on Kristine Jørgensen's *Gameworld Interfaces*, argues players never fully lose themselves: they always know they are a person at a computer who has chosen to inhabit a fictional world, adopting an "illusory attitude" that accepts arbitrary rules as if real. Threshold messages like Diablo II's "I am overburdened" are naturalised conventions for talking across the two worlds, not fourth-wall breaks as they would be in a novel {{kvCky6BbTuE#4}}. He uses Erving Goffman's frame analysis to read bugs the same way: *keying* transposes meaning between frames, so reading something serious as a joke is up-keying and failing to read a joke as a joke is down-keying, and something that is a leak in one frame may be aesthetically meaningful in another {{kvCky6BbTuE#6}}. Matt Carney, citing the same book, prefers to think of a game as a resonant object, a tuned bell to which the player brings their own subjectivity, rather than pursuing immersion, which he finds stifling {{SU-VcmsOvZo#10}}. Hewitt's view sits alongside both: players know the game is a lie but cooperate with the illusion because they want to be entertained {{dCWWId16VAo#4}}.

These views agree more than they differ. None asks you to seal the player inside the fiction; all treat the player as an active, knowing participant who completes the world. The practical difference is emphasis: Grinblat's frame gives you licence to use conventions that cross between game and fiction, Carney's asks you to tune the object and trust the player to resonate with it, and Hewitt's asks you to plant points that stimulate imagination {{kvCky6BbTuE#4}} {{SU-VcmsOvZo#10}} {{dCWWId16VAo#4}}.

### Write for a world you do not control

Emilia Lazer-Walker gives the craft rule for authored content in an unpredictable world. Janet Cardiff's audio walk mentions a zoo polar bear that may no longer be there: if the bear is present, it seems Cardiff knows where you are; if it is absent, that fits the piece's theme of the passage of time. The text is fixed but equally meaningful whether or not the world matches it {{MNEG1sLSRcM#5}}.

**In practice:**

- Show less than you know. Present events without explanation and let players supply motives {{RYZSdPuvta8#2}} {{IaB7iQhts_c#6}}.
- Write brief, evocative fragments that can be met in any order and leave hooks unexplained {{UGPkEWqwSAY#13}} {{nLqLOzrjkYU#12}} {{nLqLOzrjkYU#0}}.
- Use cheap suggestion devices: cropped descriptions, coined words, rumours of things that may not exist {{nOGNdrjm8ek#4}} {{6ik6jB2YhZg#6}} {{ntVjLNl2_ro#4}}.
- Write authored lines so they stay meaningful whatever the generated world turns out to be {{MNEG1sLSRcM#5}}.

## Players as co-authors

If players make the stories, the designer's job shifts from writing a story to helping players write theirs. Max Kreminski gives this its clearest frame: games act as storytelling partners by giving players *creativity support*, helping them past four common barriers: fear of the blank canvas, fear of judgment, writer's block and perfectionism {{BDcZSWHu8RQ#1}}. Each barrier has a design answer.

### Four levers against creative barriers

**Generativity** counters the blank canvas. A generated cast or map shrinks a huge possibility space down to small things the player wants to fix or change. It also eases fear of judgment, because players can disclaim the parts they dislike ("the game did that, not me") while claiming the parts they like {{BDcZSWHu8RQ#2}}.

**Incrementality** counters writer's block. Kreminski cites Raymond Chandler's adage about having a man come through the door with a gun: keep introducing disruptive new elements so the story moves even when the player does not know what happens next. Recurring elf raiding parties in Dwarf Fortress and each year's draft of newly generated players in Football Manager do this {{BDcZSWHu8RQ#3}}.

**Boundedness** counters perfectionism. Restricting rerolls and undo forces players to live with mistakes and justify them narratively, which often makes better stories. In the Pro Vercelli Football Manager story, the player fat-fingered a UI decision and traded away a star player at a crucial moment, something the character would never do, and had to explain it in the story {{BDcZSWHu8RQ#4}}. By the same logic, permadeath works as a boundedness lever.

**Limited options** counter paralysis. Counter-intuitively for a creative tool, restricting what the player can do at any moment helps when they are enjoying the process rather than aiming at a specific result. Giving the system more agency moves creative burden onto it, so players can focus on the parts they care about while the system smooths over the rest {{BDcZSWHu8RQ#5}}.

Kreminski's Cozy Mystery Construction Kit shows the last two in an actual tool. It turns the open question "what should happen next?" into a choice among about five to seven generated actions: things a character might plausibly want, actions that advance an author-level goal, or revenge for an earlier action; five to seven alternatives worked well in testing {{BDcZSWHu8RQ#12}}. Every action is auto-described into a transcript that players can edit collaboratively, Google Docs style, or leave alone, so they get a written story without extra tracking and can exert as little creative agency as they like {{BDcZSWHu8RQ#11}}.

### Ownership through remembered choices

Players own a story when the game remembers what they did. Aaron A. Reed's Hollywood Visionary has the player make a movie, choosing genre, actors, colour or black and white, soundtrack and editing tightness, and these choices return later, from throwaway background descriptions to the villain citing your editing as subversive. Players email Reed about the movie they made: if enough small choices accumulate and the game calls them back in surprising ways, the result feels unique {{x0Xh4oCX9t0#4}}. Lazer-Walker found the same with Computational Flaneur: a generated moment driven by the player's own input, even if all they did was stand at some GPS coordinates, feels like theirs in a way a funny bot tweet does not {{MNEG1sLSRcM#11}}.

> If enough choices build up over time and the game remembers they can adhere to something that feels unique. {{x0Xh4oCX9t0#4}}

### Places to reflect and write

Several speakers argue that meaning forms after play, and that the designer can make room for it. Cole Wehrle says games need places of reflection after play to generate meaning. His board game Oath has no written narrative, character advancement or named protagonists, and like a roguelike, how a player won matters more than who won; it generates its meaning in the post-game report {{HgnvMBVKP0M#1}}. Oath deliberately offers no in-game view of the past and instead ships a journal, because Wehrle wanted players to do the work of history-writing outside play rather than gamify it. Players drew comics, kept per-player records, wrote as a jilted historian, made a cookbook from the food cards and wrote fold-out poetry {{HgnvMBVKP0M#16}}.

A video game version of this came up at the 2018 lightning talks. A speaker who runs lethal old-school tabletop games proposed that when a roguelike says you have died, it could ask "would you like to describe your death?" and store a short player-written blurb in the high score list or morgue file. Frequent death has to be made special, and a terse "killed by an orc" becomes meaningful once described; letting the player write it also relieves the game of generating zany descriptions, as it eases the GM's job at the table {{60MTG-__dt4#9}}.

### Repair, assembly and reading

Some games are built so players repair a story from pieces. Grinblat cites Kreminski's term *extrapolative narrativization* and a paper by Kreminski, narrative designer Kate Manning and himself extending it to *reparative play*: games that provide only pre-narrative parts in disrepair, which players repair into an emergent narrative, ornamenting their run with details the game never represents {{kvCky6BbTuE#9}}. Reed's 18 Cadence makes assembly the whole game: players move through a house that exists from 1800 to 2000 and drag fragments onto a workbench to compose and share stories, from a disgruntled housewife oppressed by the house to an ashtray smoking the last cigarette. Reed counts it a success because players made stories he had never thought of, and sums it up as telling stories with players, not at them {{x0Xh4oCX9t0#6}}. Jamie Brittain holds up Kruggsmash's Dwarf Fortress videos as proof that extracting stories from Legends mode is a genuine creative act, collaborative creation that honours both the world's chaos and the creator's input {{C2CzHLtt1Fw#10}}.

Jasmine Otto models her Druid Game on tarot, where the player is both querent and reader, stacking a deck of story elements to steer their own reading. The surprises come from cards that have many features, of which only a few get latched onto; such cards contain no AI and so cannot have bugs, yet still produce funny surprises {{NjIDVIIg1lY#1}}. She separates *verbs*, which change world state, from *storylets*, prose with no game consequences that exist only in the reader's mind, where the sense of interaction is ultimately created; finding the boundary between them is a core design question for her {{NjIDVIIg1lY#7}}.

Other co-creative tools hand players authorial power more directly. Courtney Liessen's Reality Break experiments with letting players rewrite what NPCs say, with the change rippling into reality, like a conversation tree where you choose the other person's line. A generic rewrite system made a first version easy, but she says fully realising it could be its own game, and it raises questions about rewriting what someone said just to get a better item {{BRJEK20iM7o#11}}. Martin Pichlmair traces map-drawing games like The Quiet Year, where making the map together is the main gameplay, to an old tradition of rhetorical maps, from fantasy utopias to maps of Dante's hell, that show what places mean rather than where they are {{EMb6B2cIJps#8}}. Whose story is it then? Grinblat, generating text from a corpus he largely wrote himself, adopts Emily Short's description of writing with a generator as a collaboration between author and generator {{zDTQM0Ipiz4#8}}.

### The theatre model

Nic Junius, a former playwright, offers theatre as an analogue. He calls theatre a human-powered story generator: the script supplies constraints, and each production generates an always-different finished work, which is why Shakespeare and Greek tragedy are still retold {{cDxL6JoxYQc#0}}. There is never a single universal version of a script; the production is what finishes it, and productions differ even in the same year with the same people {{cDxL6JoxYQc#1}}. Two productions of Macbeth with identical words can make Macbeth either manipulated by the witches and Lady Macbeth or the one driving events, depending on small choices such as whether the witches touch him and whether he notices {{cDxL6JoxYQc#3}}. So even a linear scene with few choices can contain play, as players find new things in fixed game levels {{cDxL6JoxYQc#2}}. Players return to roguelikes and to plays for the same reason: to find something new in the familiar and explore as much of the story's volume as they can {{cDxL6JoxYQc#5}}. Junius has read Hades' run progression as a theatrical production, from a bad cold read through rehearsal-like practice to an "opening night" when the credits roll, and says playwriting taught him to bound a story's possibility space and let the production fill the gaps rather than branch {{sOZH6RPuNJ8#14}}. In this model the player's run is the production, and your authored content is the script it finishes.

**In practice:** levers a designer can pull to make players better storytellers:

- Start them with a generated situation to react to, not a blank page {{BDcZSWHu8RQ#2}}.
- Keep introducing disruptions so the story never stalls {{BDcZSWHu8RQ#3}}.
- Limit undo and rerolls so mistakes become plot {{BDcZSWHu8RQ#4}}.
- Offer a small menu of plausible next events rather than open-ended freedom {{BDcZSWHu8RQ#5}} {{BDcZSWHu8RQ#12}}.
- Remember small choices and call them back {{x0Xh4oCX9t0#4}}.
- Give a place to write it down: an editable transcript, a journal, a player-written death note {{BDcZSWHu8RQ#11}} {{HgnvMBVKP0M#16}} {{60MTG-__dt4#9}}.
- Ship parts that need repairing and fragments that need assembling, rather than finished arcs {{kvCky6BbTuE#9}} {{x0Xh4oCX9t0#6}}.

## Story shapes that fit a roguelike

Not every narrative form survives permadeath and repetition. The talks point to a set of shapes that fit the genre's grain, and to some that work against it.

### Short stories, picaresques and rogues

Michael Brough traces the roguelike to fantasy fiction and argues short adventure stories suit it better than epic trilogies. The early twentieth-century pulp magazines were an accessible market for short stories, much like the later Flash games market, and short stories tell brief, self-contained arcs of discovery, adventure, success and failure; novels and epic trilogies have epic heroes, short stories have rogues {{JpX2wWwhKdE#2}}. The same shape carried into tabletop play: each D&D session needs its own satisfying self-contained arc, even within a longer campaign, or people will not keep coming back weekly, and pulp short stories modelled that structure {{JpX2wWwhKdE#3}}. Brough calls the *picaresque*, a form dating to the sixteenth century about a down-on-their-luck character surviving by wits whose successes are temporary and often lost, essentially the roguelike novel. Jack Vance's Cugel stories are highly episodic: occasionally Cugel carries money or items into the next chapter, but often he meets disaster and enters it with nothing {{zDKheM-E45I#6}}. Cugel gains a powerful magic item, such as boot polish that makes kicked things fly, and loses it through his own over-ambition, yet earns grudging admiration by getting up after each knockback {{zDKheM-E45I#7}}.

The protagonist's motive matters. Darren Grey contrasts the hero (noble cause, defender of the establishment, destined) with the rogue (self-interest, rebel, accidentally involved), and argues destiny clashes with the genre: you cannot be the one true chosen one when you are the 1048th player killed this month {{C2sm-z7Ag4U#5}}. He links this to presentation: if artwork and names emphasise a heroic warrior, players approach permadeath like a standard RPG and do not behave as the game needs, and he traces much of reviewers' frustration with permadeath to that framing. A theme that emphasises threat, danger and trickiness tells players they are playing a rogue {{C2sm-z7Ag4U#7}}. During a NetHack speedrun, a commentator relayed the description of the typical roguelike character as a "murder hobo" who kills, steals and wears random clothes, behaviour the game normalises {{rIB0y_kwFuY#21}}.

### Stories about systems, not chosen ones

Sherveen Uduwana argues roguelikes suit a kind of story games often struggle with: stories about systemic change, societies and moments in time rather than single individuals, because the genre's own elements do much of the heavy lifting {{_w4yJsRzXBk#0}}. Repetition helps. Borrowing from music theory, he notes that a "wrong" jazz note repeated several times starts to sound intentional; the cyclical repetition of roguelikes legitimises narrative risks that would read as mistakes in other genres {{_w4yJsRzXBk#2}}. He lists what the run structure makes possible:

- **Failure without dissonance.** Linear games often have you play a sequence well and then show a cutscene of the character failing. Because roguelike players expect failure, characters can fail in the story without that dissonance, allowing more complex narratives with failure in them {{_w4yJsRzXBk#4}}.
- **Rotating protagonists.** The genre does not need a single protagonist. A roguelike set in revolutionary France could vary characters across runs so that social class shapes events, exploring the ideas of Les Misérables rather than being an action game in period costume {{_w4yJsRzXBk#3}}.
- **Vignettes.** Less reliance on one linear run lets a game tell a story through disparate vignettes on unrelated ideas, as the film Andrei Rublev does, while keeping an overall context; he points to Cultist Simulator, Outer Wilds and Rain World as games whose experience varies greatly with how you engage their systems {{_w4yJsRzXBk#6}}.
- **Unreliable narrators.** Repeated runs could let players experience a Rashomon-like story and gradually distil what is objective. The Stanley Parable and Her Story explore similar ideas, but Uduwana has found no roguelike that clearly does this and does not see why the genre is not full of them {{_w4yJsRzXBk#7}}. This is an open opportunity.

### Against prescriptive structure, for the power fantasy

Jamie Brittain argues that story-structure manuals like the hero's journey and Save the Cat are fine as descriptive tools, and most writers use them, but become harmful when executives and commissioners turn them into prescriptions; the result is a "narrative predictability crisis" in which audiences can tell when it is safe to leave a film for the toilet {{C2CzHLtt1Fw#0}}. He links this to Brian Walker's 2016 warning that the biggest risk to a game's longevity is challenge becoming rote and systematised: screenwriting manuals kill the friction of film and TV the same way {{C2CzHLtt1Fw#1}}. Story structures also favour happy endings, the hero returning with the elixir, while some of the best narrative experiences lack them. A roguelike's indifference to whether you live or die, even on NetHack's first level, is a narrative strength {{C2CzHLtt1Fw#6}}. Andrew Cedotal adds a thematic objection: the hero's journey dramatises resisting off-ramps on a single path, which made sense when people accepted common virtues and worked hard at them. Today's core anxiety, he argues, is an overwhelming number of superficially viable options, and work that speaks to modern people should evoke and relieve that anxiety {{Gxn_MA3-Vgo#6}}.

Yet Brittain does not throw out the hero. His first lesson is that structure is a tool, not a prescription, and that the power fantasy is worth keeping: an overpowered Binding of Isaac run feels like nothing else. A winning NetHack run is an exquisite hero's journey by design (descend, retrieve, ascend), even though most players in actual play feel anything but heroic {{C2CzHLtt1Fw#2}}. That tension between designed arc and lived experience is something to use, not resolve.

### How much overarching structure?

The talks split on whether a roguelike needs a shaped arc above the run. Tarn Adams found Dwarf Fortress's adventure mode flat: an open world of towns, monsters and bandits with no overarching structure, where players often just die or amuse themselves being bards. Traditional roguelikes, by contrast, get a quest-like structure from going deeper through generated levels {{4-7TtPX5uhg#0}}. His fix was villains whose schemes map naturally onto plot and act structure: a villain who interlocks with a townsperson who talks to someone else to start a ball rolling has the same structure as the stories players already tell about items, terrain and a monster pushing them into it {{4-7TtPX5uhg#4}}. He describes different opposition models for emergent narrative: Shadow of Mordor has the player fight through a generated organisational hierarchy within RPG-like plot arcs, while Pirates!-style games make the player a small cog in a strategy game that runs without them; he wants all of these at once {{4-7TtPX5uhg#6}}. Matt Carney names the simplest structure a roguelike has: its *pulse*, a clear, linear sense of motion and purpose such as descending a dungeon or climbing a tower, around which any weird generated content can cohere. Even a set map like Caves of Qud's yields different linear paths each time {{SU-VcmsOvZo#9}}.

Others gave up on shaped endings. Emilia Lazer-Walker tried emulating the culminating structures of Sleep No More, roguelike deaths and Dear Esther for Computational Flaneur, using music to shape emotion and detecting waning attention to wrap up, but these proved more trouble than they were worth. The design instead followed a Twitter-bot model that works whether you walk for five minutes or five hours {{MNEG1sLSRcM#7}}. Cole Wehrle describes two approaches in his own work: Arcs is built as a three-act story, while Oath cannot have a beginning, middle and end and relies on remembering, forgetting and assembling stories afterwards {{HgnvMBVKP0M#18}}.

Tim Keenan's experience is a caution against going too far. Duskers deliberately closed each storyline without bringing them all to one final resolution, because he felt that would end the game and work against the roguelike structure. He stands by the choice, but players strongly wanted a definitive ending, and he would consider adding one next time {{G5rq5ei2Lec#7}}.

The choice depends on length and on what holds the run together. A run with a strong pulse already has a spine {{SU-VcmsOvZo#9}}; an open world without one, like Adams' adventure mode, feels flat {{4-7TtPX5uhg#0}}; an experience of unpredictable length may be better without a climax at all {{MNEG1sLSRcM#7}}; and players who have invested in several storylines may still want an ending {{G5rq5ei2Lec#7}}.

**In practice:** choosing a shape:

- If runs are short and death is frequent, think in short stories and picaresque episodes: self-contained arcs, gains that are temporary {{JpX2wWwhKdE#2}} {{zDKheM-E45I#6}}.
- Frame the protagonist as a rogue acting from self-interest, and let theme and art signal danger rather than destiny {{C2sm-z7Ag4U#5}} {{C2sm-z7Ag4U#7}}.
- Consider telling the story of a society or system across rotating protagonists, vignettes or unreliable accounts {{_w4yJsRzXBk#0}} {{_w4yJsRzXBk#3}} {{_w4yJsRzXBk#7}}.
- Make sure the run has a pulse; if it does not, give the world agents with schemes that supply plot {{SU-VcmsOvZo#9}} {{4-7TtPX5uhg#4}}.
- Decide deliberately whether there is an ending, and expect invested players to want one {{G5rq5ei2Lec#7}}.

## Death, restarts and the loop as narrative

Every narrative roguelike must decide what death and restarting mean in its fiction. For a long time the answer was nothing. Marc Dolgin notes that early roguelikes gave no in-world reason for restarting because that was simply how the mechanics worked; increasingly, especially in response to Hades, games like Hades and Cobalt Core build the restart into their lore, which raises the importance of lore and immersion in roguelites {{ujKlmvfpNMo#9}}.

### Whether to justify the restart

Harry Solomons calls the restart a mechanic that started as a technical limitation but is an immensely powerful narrative tool. Hades frames the same character returning with the same memories, which mirrors the player's own experience; leaving restarts unexplained, on the other hand, invites players to draw their own conclusions {{AwOuZTCeOrU#10}}. Dolgin ties the choice to tone: in comedic roguelikes players do not worry about lore, but once a game becomes more serious, players want to be immersed and start asking why they are starting over {{ujKlmvfpNMo#12}}. Tim Keenan found that showing the intro once and pretending the character remembers did not go far enough for Duskers {{G5rq5ei2Lec#2}}; instead, he framed the protagonist as the actual player at the keyboard, using sci-fi multiverse framing, so discovered logs persist across deaths while the gameplay challenge stays the same every run {{G5rq5ei2Lec#3}}.

So the decision runs roughly like this: a light or comic tone can skip justification; a serious tone creates an expectation of one; an unexplained restart is itself a legitimate choice that hands interpretation to the player.

### The costs of story under repetition

Authored story strains under the loop. Keenan names repetition as the first problem curated narrative has in roguelikes: a long intro cutscene you sit through every run would obviously be a burden {{G5rq5ei2Lec#2}}. Andrew Aversa makes the same point: a permadeath game cannot front-load an intrusive, JRPG-style cinematic opening, because replaying the early game makes even the best opening stale very quickly {{kn2QkH5lByw#5}}.

Rich Wilson treats the deeper problem as unsolved. Reconciling a replayable system with a dramatic story is still an open question; Prey: Mooncrash handled it with a frame narrative in which the player is a hacker on an isolated satellite running a simulation of a moon base, so the static story was told outside while the loops ran safely inside {{wtlLa7BGZcs#12}}. The related problem of drama versus agency, keeping the player from breaking a carefully planned narrative, is also unsolved; Mooncrash sidestepped it by keeping its handcrafted beats as character threads that wove orthogonally through play and could not be failed {{wtlLa7BGZcs#13}}.

Attachment cuts both ways. Lisa Brown became so attached to her character in Road Not Taken, an emotional story about its creator's decision not to have children, that her first permadeath was traumatising and she never played again. She notes that for her low-immersion profile, narrative is mostly a wrapper, and players who want high immersion might love such a game {{BjqZdMW8U9Q#10}}. Stella Vermilion's Nuzlocke runs, described among the raw ingredients of emergent story, show the other side: there loss is what builds the attachment to nicknamed party members {{R8DSq8qSJ44@31561#7}}. The difference seems to be whether loss is part of the expected shape of play or a blow against a story the player was invested in.

### Hauntology: the ghosts of failed runs

Solomons gives the most developed account of death as theme. He borrows *hauntology*: media with a paradoxical relationship to time, an eeriness of things wrongly present or absent, and places stained by traces of past events. Through Mark Fisher, eeriness is either a failure of absence (something present that should not be) or a failure of presence (something missing that should be there) {{AwOuZTCeOrU#1}}. His thesis is that roguelikes are inherently hauntological, because permadeath forces players to retread and trample over the ghosts of their own failed runs {{AwOuZTCeOrU#2}}.

Two games make this explicit. When Inscryption defeats you, it invites you to compose a *death card* from attributes of your failed deck, write your name on it, and have your photo taken; you later draw that card, pull yourself out of the deck and sacrifice yourself {{AwOuZTCeOrU#0}}. In Returnal, Selene knows she is looping, finds her own corpses carrying notes she does not remember, and those corpses can reanimate and kill her. Each corpse is a version of you that failed, a lost successful future that stains the space you must cross {{AwOuZTCeOrU#3}}.

> Each corpse represents a version of you that failed. A potential successful future that never came to pass. {{AwOuZTCeOrU#3}}

Solomons asks designers to engage with what death means in their worlds: the genre lets you write death over and over on top of itself, so places can become stained by repeated failure and the loop becomes something to confront {{AwOuZTCeOrU#5}}. Time-loop stories offer a power fantasy that enough retries and information can prevent tragedy, and he ties their popularity to doomscrolling and anxiety; games that take that fantasy away can powerfully reframe the present {{AwOuZTCeOrU#6}}. His closing request is to consider how failure loops imprint on the places players move through, and what is gained by withholding the power fantasy, as Inscryption and especially Returnal do {{AwOuZTCeOrU#7}}. Even winning has to be handled: restarting after a victory can undercut the theme unless it is deliberate, as when Inscryption's perfect win drags you back into the same chair {{AwOuZTCeOrU#9}}. In Q&A he agreed with an audience suggestion that reloading a save can feel like possessing a past self; the host, Alexei, added the eeriness of decision-heavy games where you remember a timeline in which you got someone killed {{AwOuZTCeOrU#8}}.

The loop can also carry a gentler theme. Dolgin describes The Void Rains Upon Her Heart, whose story is built around having to start over whether you win or lose, as reflecting real-life struggles with anxiety and depression: starting over is framed as part of life, the way people move on and get better {{ujKlmvfpNMo#10}}.

### The persistence toolkit

Between "nothing persists" and full metaprogression lies a range of tools that carry story, not power, across deaths. Jim Shepard calls this *meta presence*: world elements that respond to the player's past runs without changing gameplay difficulty. It suits purists who do not want power carryover, and it tells a repeatedly dying player that the things she does matter {{FZn4NeQOcFE#8}}. His example is Caves of Qud's Joppa: after one character solves the water-well quest, the next hears the same quest from scratch. A meta-presence version would have the mayor acknowledge what past characters discovered, the same place and the same monsters, as a nod to the player; that makes the world less static, which is a design choice, but does not change the gameplay {{FZn4NeQOcFE#9}}. Other ideas include tavern drinks named after past heroes, town tributes, a barkeep who remembers a hero who saved his son, or an NPC related to a previous character whose gameplay job stays the same; he cautions that player-chosen names can break a world's theme {{FZn4NeQOcFE#10}}. Dungeonmans goes further: when a hero dies, a dungeon appears with the killer as its boss. Shepard admits it is "kind of broken", since a scrappy level-2 monster that landed the last hit becomes king over stronger ones, but it makes the game feel like a campaign that rises and falls with its heroes {{FZn4NeQOcFE#11}}. Thomas Biskup said ADOM's team was considering a similar idea, with a monster that killed your ADOM character resurfacing in Ultimate ADOM as a named nemesis, citing Shadow of Mordor as a model {{iZUXjbcAfYs#28}}.

Shepard's broader claim is that metaprogression is really a set of storytelling tools: players do not recount every dull death, they tie their runs into highlight-reel stories that they tell each other, a meta story across many runs {{FZn4NeQOcFE#12}}.

Lineage is another option. Darkest Dungeon treats successive characters as recruits, and a host on the Rise of the Roguelite panel suggested framing permadead characters as generations, so players think in lineages and see many perspectives rather than playing an anonymous @ to be forgotten {{ujKlmvfpNMo#14}}. Uduwana cites The Swindle, where a failed heist costs you your character and gives you a new one, Rogue Legacy's descendants with unique quirks, and Wildermyth, where a character's personality colours how similar events play out {{_w4yJsRzXBk#5}}.

### Death screens, messages and chronologies

The moment of death is itself a storytelling surface. Zach and Tarn Adams describe Dwarf Fortress's Legends mode as a high score list, a shared memory of exploits descended from the one-line death sentence with a killer's name and date in Hack and NetHack; that sentence was the seed of their whole narrative approach {{Zh6dnx9FM1g#11}}. At the 2018 lightning talks Kawa pointed out that the death screen immediately tells the player what kind of game they played: Dungeons of Dredmor's ornate "congratulations, you have died" is jokey and trope-mocking, while Caves of Qud reports who killed you, their faction and their beliefs, conveying that you were one mutant among many in a living world {{60MTG-__dt4#5}}. Specificity is what makes a death message tell a story: a barbarian who "choked on his own vomit while paralyzed" can be visualised without further explanation, unlike "killed by an orc" {{60MTG-__dt4#10}}. Qud's death screen also includes a chronology that retells the character's life as a list of story events, from quests and discoveries to recruited followers and the killer {{kDKQM27U-Nc#21}}. The player-written death blurb described under "Players as co-authors" is the participatory version of the same idea {{60MTG-__dt4#9}}.

**In practice:** options for making death meaningful in the fiction:

- Decide whether the restart needs an in-world reason; match the decision to your tone {{ujKlmvfpNMo#12}} {{AwOuZTCeOrU#10}}.
- Keep anything that replays every run short, and move story out of the opening {{G5rq5ei2Lec#2}} {{kn2QkH5lByw#5}}.
- Persist knowledge and lore across deaths even if power does not persist {{G5rq5ei2Lec#3}}.
- Let failed runs leave traces in the world: corpses, cards, nemeses, NPCs who remember {{AwOuZTCeOrU#0}} {{AwOuZTCeOrU#3}} {{FZn4NeQOcFE#11}} {{FZn4NeQOcFE#9}}.
- Frame successive characters as a lineage or rotating cast {{ujKlmvfpNMo#14}} {{_w4yJsRzXBk#5}}.
- Make the death screen specific: who, why, and a chronology of the life {{60MTG-__dt4#5}} {{60MTG-__dt4#10}} {{kDKQM27U-Nc#21}}.
- Decide what the loop means thematically, including what happens after a win {{AwOuZTCeOrU#5}} {{AwOuZTCeOrU#9}}.

## When fiction and mechanics pull together

The sections so far are about the stories players make. The next five turn to the world the designer builds for them to make stories in: its rules, its numbers, its tone, its setting and its words. The first requirement is that the fiction and the rules agree. Tim Keenan argues that curated story in roguelikes is disliked mainly not because it exists but because it sits beside the game instead of inside it. Reflecting on Duskers, he puts the problem in one image: fish escaping a net only get out if they all swim the same way. A curated story that pulls in its own direction does nothing for the game or actively works against it, and he admits Duskers did not fully manage this {{G5rq5ei2Lec#1}}. The term the talks use for the failure is *ludonarrative dissonance*: what the story says and what the rules make you do disagree.

### Make the player live the story, not hear about it

Two talks arrive at the same remedy from different directions. Jongwoo Kim calls Kitfox's approach in The Shrouded Isle *subjective simulation*: model a community's psychological reality and values rather than its objective material conditions, so the narrative is told through the decisions the player makes. Kim finds this more impactful than scripted content or walls of text because the player takes part in each decision and is personally responsible for what follows {{oV5PjvcVky8#0}}. Jim Shepard makes the same argument at the level of a single scene. A fight in a burning village beats a text box from a survivor describing the fire, and it costs nothing extra:

> Don't make a puppy cave, make a town on fire. {{jd7K0EmkvPk#5}}

The monsters are just as easy and the tutorial steps the same, but theme and story arrive for free {{jd7K0EmkvPk#5}}. Sherveen Uduwana adds why this works especially well in games: players are forced to build a conscious mental model of the system in order to experience the narrative, and that modelling is itself material a designer can tell stories with {{_w4yJsRzXBk#1}}.

The Shrouded Isle shows how deep the alignment can go. The cult's values are the game's resources, so even a player who dislikes promoting ignorance has to keep the town ignorant to succeed. Because those resources are dissociated from the villagers' wellbeing, the player's interests split from the villagers' interests, and players willingly make Machiavellian choices {{oV5PjvcVky8#3}}. The fiction is not explaining the mechanic; the mechanic is the fiction. The same structure turns resource accounting into drama. Kim appointed an advisor, Chesa, expecting her to raise ignorance; she lowered it, and her vice drained obedience. Because he had chosen and instructed her, he felt betrayed rather than self-blaming; with a pure process, he says, he would only have blamed himself {{oV5PjvcVky8#7}}.

Shepard also points out that a procedurally generated roguelike still has acts and phases, its dungeon levels, and you can use those progression markers to change the hero. His example is a corruption meter: once it crosses a threshold, the hero answers the same shopkeeper differently, so the player experiences the arc while playing. Keep important information on the critical path and let fluff support it {{jd7K0EmkvPk#15}}.

### A thin layer of fiction can sell a mechanic

The cheapest version of integration is a fiction that makes an existing rule feel right. Several developers describe the same surprise at how little it takes:

- **Against the Storm.** The early Queen's Impatience was a bare 30-60 minute timer that the developers call one of the worst mechanics in their demo. Dressing it as a visible, impatient queen made players accept it and react to it emotionally; a streamer screamed "please" at her. The developer was stunned how much a thin layer of fiction that matches expectations achieved {{tWFIQaeSs6M#14}}.
- **Party House (UFO 50).** Jon Perry concedes the temporary ban after a bust is mechanically a bit clunky (a permanent ban would be too strong), but the story of kicking out the guilty guest sells it and gives frustrated players a character to blame instead of the developer {{NlxGPKV0PrY#13}}.
- **Pacific Drive.** Paul Dean explained the game's ubiquitous gasoline by making portable fuel essential in a world whose infrastructure keeps breaking down. He compares the job to writing for a collaborative tabletop sourcebook: describe existing elements in supporting ways, then fill in ordinary lives around them {{nLqLOzrjkYU#5}}.
- **Planet Zoldath (UFO 50).** Perry designed it role-playing as a fictional developer who had just discovered procgen, so wild, unbalanced seeds fit the game's place in UFO 50's meta-story, as long as every seed stayed solvable {{NlxGPKV0PrY#18}}.
- **Test Tube Titans.** Gabriel Koenig handles the uncomfortable feel of monster breeding through narrative: each titan decomposes after use, and the story is critical of the lab's monster-making. Asked about it, he notes that setting strongly shapes how such a mechanic feels {{xju91VGh2Ps#15}}.

### Mechanics that generate the story

The arrow can point the other way, with a mechanical decision producing the fiction. Eric Billingsley cut stairs from Into Ruins early, and the cut cascaded: the game now opens with the player drawn down into a chasm, and the goal item, the Wings of Yendor, is the only way back up. With stairs, he says, it would have been a completely different game {{3S6uRMCdvNs#18}}. In Caves of Qud, Ivy Melinda relays Caelyn Sandel's account of how the mopango grew from a character build into a settled culture: their subterranean nature fit a settlement in a cramped tomb, and Quaker-like traits gave them their pseudospeech, a small narrative leap from build to concept {{db6S2lgTWmI#9}}.

Michael Brough traces how a constraint creates a story shape. Vancian memorised magic exists so that the adventurer packs a few items and then solves each challenge by applying one of them, sometimes creatively, the structure of fairy tales and James Bond gadget setups. Without some limit on a wizard's power, stories about wizards are hard to tell; Gandalf being conveniently absent is another fix for the same problem {{zDKheM-E45I#4}}.

Emotion can be the starting point too. The Banished Vault was designed around three target emotions, size, hostility and unpredictability, which the player should feel imposed on them and then overcome; Nic Tringali calls overcoming them the positive feeling the designers wanted {{nSJA2yVsTFM#2}}. Its exploration is modelled on real space exploration, an unknown journey toward a relatively known goal, like knowing an oasis exists without knowing the way there {{nSJA2yVsTFM#7}}.

Nic Junius argues that tying story progress to non-narrative systems such as combat makes everything feel like it matters to the narrative, even systems that rarely talk to each other, and steers players toward the story rather than pure optimisation {{sOZH6RPuNJ8#13}}. Spencer Egart's procedural rituals do the same for reading: ritual instructions are scattered through in-game books and dialogue, so players read world text because it has mechanical value, which he cheerfully calls tricking people into reading {{q4Tf0vf2kiI#9}}. Keenan's Duskers ties story objectives to procedurally placed elements, so the same written story plays differently: in one run you find the research station first and hunt for an old ship, in another you find the ship first and must cruise around in a poorly suited vessel looking for a station {{G5rq5ei2Lec#4}}.

### Where it goes wrong

Mechanics that speak loudly can also say things players never hear. Jeff Lait's experiments with long-term consequences are the clearest cautionary set. In Vicious Orcs, free-mana spellcasting made the game trivially easy (teleport back, heal, repeat) while freezing fields and sickening villagers, and the good ending required avoiding it. Lait hoped the sudden drop in difficulty would read as a warning, but he believes no player found that ending on their own {{LQPGmxytTws#11}}. A later 7DRL made the consequence overt: casting spells progressively strips item descriptions to bare utility, so an elegant sword becomes a source of wood, and the ending depends on how decayed your world view is; finishing without spells gives the best ending {{LQPGmxytTws#12}}. In Sword in Hand, where the player is a sword choosing war or peace missions, the ending is scored by how long the world takes to repopulate, and Lait deliberately leaves open whose good ending counts: the sword's, the people's, the king's or the player's {{LQPGmxytTws#13}}. The lesson from the first case is that a signal hidden in the difficulty curve may simply go unread; the later games put the consequence where players look.

Nathan Savant warns about the most intimate mechanical lever. Changing moment-to-moment input to express a character's inner struggle, as The Last of Us does when Ellie doesn't respond, or making a character unable to focus or to tell friend from foe in anger, is powerful but "very touchy": most of the time, altering movement speed or input response is about the worst thing you can do to a player {{WTLPXhLjwLU#7}}.

Simulation can also contradict the prose without anyone choosing it. Ivy Melinda points out that Caves of Qud's 1,200-turn day implies either 72-second turns or two-hour days; simulated and handwritten narratives collide, sometimes hilariously, and the player has to suspend disbelief {{db6S2lgTWmI#4}}.

### Optional, but load-bearing

If integration is the goal, how central should authored story be? Keenan defends curated narrative on the same grounds as in any game: it supplies mid- and long-term goals, mystery and a compelling question, such as Duskers' "why is everybody dead?", which some players only start asking 10 or 20 hours in {{G5rq5ei2Lec#0}}. Yet he also made it optional: players can ignore the logs, while those who read about a military conspiracy might beeline for the next military ship, letting story discoveries shape strategy {{G5rq5ei2Lec#10}}. To avoid a single story goal that players fixate on, Duskers offers several optional branching storylines, essentially achievements built into the story, each needing particular upgrades or conditions; depending on what a run contains, a different storyline becomes the lucky opportunity {{G5rq5ei2Lec#6}}. Tabea Iseli's team on Grimoire Groves feared that the dialogue needed to explain its non-violent mechanics would turn players off; instead players asked for more story, and the team leaned in partly because narrative helps newcomers understand how roguelikes work {{-MX1imoSxTg#4}}.

**In practice**, check each mechanic against its fiction:

- Does the rule make the player *do* what the story is about, or only *watch* it? If a survivor could describe it, consider making it a fight or a decision {{jd7K0EmkvPk#5}}.
- If a rule feels arbitrary, is there a character or in-world cause that could own it, and give players someone other than you to blame {{tWFIQaeSs6M#14}} {{NlxGPKV0PrY#13}}?
- Do your resources encode the values of the people in your fiction, so that succeeding means adopting their view {{oV5PjvcVky8#3}}?
- If a consequence matters to the ending, will players actually notice the signal, or will they miss it {{LQPGmxytTws#11}}?
- Can a player ignore the story and still play, and does a player who follows it get goals and strategy out of it {{G5rq5ei2Lec#10}}?

## What your systems say about your world

Writers tend to think the world lives in the text. Xalavier Nelson Jr. came away from Space Warlord Organ Trading Simulator convinced of the opposite:

> The generation systems, the statistics, the base numbers that build up this reality said more about our fictional world than the writing and marketing ever might. {{SdQxLThAbs8#7}}

Players experience the little integers far more often than they read your prose, and they read those integers as facts about the world.

### Every number is a claim

Nelson's examples show how quickly a technical choice becomes a worldview. Nelson spent 48 hours deciding what counts as an organ: nerves, teeth, eardrums. Skin is an organ, which raises whether selling it is acceptable and opens the possibility of valuing skin tones differently, a choice Nelson calls deeply messed up and a glimpse of real cultural biases. An arbitrary decision on the developers' part would be read by players as objective truth about the game's reality {{SdQxLThAbs8#1}}. When programmer Sam Chet asked whether the soul is a sellable organ, the question spiralled into who has souls, how their quality varies, where they are harvested and whether aliens have them; the team decided aliens do and that souls are inherently human. Nelson treats this as emblematic: one simple systemic decision brings a spiralling series of implications {{SdQxLThAbs8#3}}.

The effect reaches outside the game. Nelson cites Simon Parkin's Eurogamer investigation into arms manufacturers and studios to argue that game design decisions can be and are advertising: Modern Warfare 2's Barrett .50 cal sold rifles, and Doom made the double-barrelled shotgun the standard power weapon decades on, so departing from that standard is itself a statement {{SdQxLThAbs8#9}}. Your own perspective leaks in too. In Airport for Aliens Currently Run by Dogs, Nelson, having just aged out of his healthcare, made the clinic NPC's punchline "I'm a doctor, not a monster", because in a utopia charging for care would be absurd {{SdQxLThAbs8#11}}. James Cartlidge generalises the point as *procedural rhetoric*: games convey ideas through their mechanics, including ideas nobody intended, so mechanics can be read for meaning the way films are {{ujKlmvfpNMo#6}}.

### Systems as a storytelling channel

If systems will speak anyway, you can make them speak on purpose. Robin Mendoza proposes prices as a storytelling device. Following Hayek, he treats prices as quantitative indices that compress and transmit complex information, like a hash where any change in world conditions changes the numbers, though without revealing whether supply or demand moved. A merchant outside a dungeon charging double for an amulet could mean superstition, a subsidy, deforestation the player caused, or a real threat {{ZtXGg6ECwQ8#0}}. He lists what prices can encode in a roguelike: resource distribution that varies between games, community beliefs and prejudices (markups by the player's class or race), politics and subsidies, cornered markets, and repercussions of the player's own actions {{ZtXGg6ECwQ8#1}}. Pathologic is his worked example: after the first day prices skyrocket, which tells the player that news of the plague has spread, and pushes them into bartering with groups that want different things, with per-district reputation shaping their daily route {{ZtXGg6ECwQ8#4}}. The approach commits you to worldbuilding, though. In Q&A, the host notes that pricing a dungeon starts with asking why a shopkeeper exists on level six and how its supply chain works; Mendoza agrees it is hard to know where that thread stops, and adds that prices suggest a more social world of interacting agents {{ZtXGg6ECwQ8#11}}.

Generated structures imply worlds as well. Dustin Freeman's interest in Civilization VI's shuffle mode, which randomises the tech tree's topology while keeping eras, is in what the dependencies imply: astrology depending on animal husbandry, or a "bronze world" where all high technology is built from bronze {{8HDmpu7Kp-A#8}}. Mike Cook makes the complementary point for generated mechanics: doors work because everyone knows what a door is, but a generated rule leaves you unsure what to tell the player the thing is, so you often need a theme, such as potions, spells, ancient languages or experimental technology, that explains why an object's effect is unknown. He concedes, via his "rubber Santa" experiment, that sometimes ignoring theme is fine {{3daNITP9vBc#11}}. John Harris, back in 2016, predicted roguelikes would move toward behind-the-scenes, algorithmically generated stories that explain the dungeon and that a canny player can exploit, an approach he saw in Dwarf Fortress {{KY-TmRw5sR8#9}}.

### Abstraction and space as meaning

The presentation layer is a system too. Ray reads Caves of Qud's abstractions, its grid, ASCII or tile visuals and tabletop-style mechanics, as narrative devices that suggest a mythologised, bardically unreliable telling rather than literal events, so the sharper edges of the simulation become tall-tale hyperbole instead of limitations {{rPhXTcVVJmo#0}}. In the same reading, the player character has their own history reinterpreted at the Tomb of the Eaters, a mechanical parallel that loops back into the game's themes of a distorted deep past {{rPhXTcVVJmo#6}}. Linas Gabrielaitis reads dungeon depth through geology, where digging deeper means finding older things: descent through layers is a spatialisation of time {{jvZb9WoIHxo#1}}.

**In practice**, audit your numbers the way you would proofread your prose:

- List what your stats, categories and generators treat as countable, sellable or valuable, and ask what a player would conclude about your world from that list alone {{SdQxLThAbs8#1}} {{SdQxLThAbs8#7}}.
- Follow each odd question ("is the soul an organ?") to its implications before players do {{SdQxLThAbs8#3}}.
- Pick a system, such as prices or tech dependencies, to carry news about the world deliberately, and decide how much of the supporting world you are willing to build {{ZtXGg6ECwQ8#0}} {{ZtXGg6ECwQ8#11}}.
- Give generated mechanics a theme that explains why they are unknown {{3daNITP9vBc#11}}.

## Setting a tone and holding it

Tone is what makes a thousand scattered lines of item text, death messages and dialogue feel like one game. It also does narrative work of its own: as the first section noted, Jim Shepard credits Dungeonmans' tone, not its almost nonexistent plot, with giving players a trellis for their own stories {{_Si626-Y_q0#0}}. The fullest method in the talks is Shepard's account of how he set and enforced that tone.

### Pick a target on a map of other works

Shepard plotted existing fiction on axes: comedy from serious to zany, how much heroism is valued, and how important lore and setting are. Game of Thrones and Warhammer sit at the serious end, Dungeons of Dredmor and Monty Python at the zany end, and at both extremes heroism carries little weight. On lore, Pac-Man needs none, Myst needs it to win, and Skyrim has a huge amount that players can ignore. He aimed at funny but not zany, with heroism mattering and lore less necessary than Skyrim's {{_Si626-Y_q0#1}}. The result, "lighthearted heroic adventure", then served as a razor for every line, with some of Robert E. Howard's pulpy, sometimes dark feel kept where it fit and text that was too serious cut. Not all text can be funny, so the question is not whether a line is funny:

> Does this work in the game, not necessarily is it funny, but does it work in the game. {{_Si626-Y_q0#2}}

### Deliver it in the background

Shepard ranks delivery methods. The worst is shoving humour in the player's face, which only works if you are very good at fully zany comedy; better is placing it along the critical path; best is making it a comfortable background, like a fire keeping you warm while you attend to your cup of "gameplay tea" {{_Si626-Y_q0#4}}. Paul Dean frames the same restraint as drumming: what you leave out and when matters as much as what you play, and the amount of writing should suit the game's tone and pace. Nuclear Throne's one-liners need no thunderous rock drummer, and in Pacific Drive the writing had to complement the rest of the team's work rather than ruin it {{nLqLOzrjkYU#7}}.

Once set, a tone is easy to break. Shepard warns against abruptly moving a funny game into dark drama to make the player "feel it", citing Borderlands 2's sudden character deaths: unless your audience wants that, it backfires and wastes the power of the target you set {{_Si626-Y_q0#15}}.

### Humour rules

Shepard's humour advice is conservative, by design:

- **References must be invisible to those who miss them.** "How many Bothans had to die" fails for players who haven't seen Star Wars, but "many scrollbulls died to bring this information" works because scrollbulls exist in Dungeonmans. A reference should read as an ordinary in-world fact and never be the main punchline {{_Si626-Y_q0#11}}.
- **Play to your strengths.** Take creative risks elsewhere but play it safe with humour. Shepard knew he could write funny dialogue, descriptions and objects, but not long-form humour or slapstick cutscenes, so he left those out {{_Si626-Y_q0#13}}.
- **Avoid edgy humour.** It alienates players and ages badly; he cites problematic material in Grand Theft Auto V, Predator and Robert E. Howard, and notes the audience is moving toward inclusiveness {{_Si626-Y_q0#14}}.
- **Study, target, playtest.** Watch, play and read funny things to learn what works for you, pick a target, and test jokes on friends, cutting what doesn't land; you QA humour like anything else {{_Si626-Y_q0#16}}.
- **Borrow a rhythm.** Dungeonmans' Psychomancer powers take the structure of karate tall tales, a thing happens, a thing happens, then a twist, chosen because the source's tone matched the target {{_Si626-Y_q0#12}}.

Generated text can be funny by construction. Zack Johnson explains that Kingdom of Loathing's guard names juxtapose an ordinary part with a silly one, a silly first name with a normal surname or the reverse, as in "Paul Blart"; the team's rule is that any person-name generator must be able to produce "Bob Goldwater", funny precisely because it is so ordinary {{jNUMRG_tvrY#10}}. Topical humour is the risky kind. Jeff Olson's Alphaman built castles around pop-culture parodies with special mechanics, Grandpa Munster turning you into a bat and scattering your items, Gilligan breaking an item every turn, but he notes much of that topical humour has not survived the test of time {{Gk5uWXBANkA#10}}, which is Shepard's ageing warning seen from the other side.

### Tone that grows, and tone that widens

Shepard's method fixes the tone up front. Blaseball shows a different path: Joel Clark says it did not start as a horror game, but players were intrigued by the forbidden book and the incinerations, so the team leaned into the weird and horror elements, while saying they would back off if the community's reaction became "this is too much" {{zO05p-e57AQ#14}}. The choice depends on whether your game is a finished artefact or a live conversation with its players. And a tone target need not be narrow. Julian Day deliberately added limited poetic touches, such as Shadow of the Wyrm's wildflower descriptions, so the world would be about poetry and art as well as monsters and dungeons {{aBbaUSWFQPM#7}}.

**In practice:** place three to six works you know on Shepard's axes, mark your target, and write a one-line tone statement {{_Si626-Y_q0#1}}. Run every line through it as a razor {{_Si626-Y_q0#2}}, put most of the tone in the background {{_Si626-Y_q0#4}}, write only the kinds of humour you are good at {{_Si626-Y_q0#13}}, and playtest jokes {{_Si626-Y_q0#16}}. If you change tone later, do it because your audience is asking for it {{zO05p-e57AQ#14}} {{_Si626-Y_q0#15}}.

## Choosing a setting and theme

Setting is often chosen last and treated as a skin. The talks treat it as a design lever: a theme supplies mechanics, holds generated content together, decides how much explaining you have to do, and can carry meaning through structure.

### Theme as a source of mechanics and coherence

Josh Ge argues that a unique non-fantasy theme is an underused hook: it makes the whole experience distinctive and gives you a source from which to draw new mechanics. Historical and mythological themes offer large bodies of material, sci-fi is in demand, and he cites MakaiRL (Japanese mythology), Skies of Bloody April (dogfighting) and Lone Spelunker, noting pirates and superheroes are often requested but rarely made {{jviNpRGuCIU#15}}. Matt Carney explains why a shared setting matters for generation. Terry Riley's In C coheres because all its patterns share a key; generated content coheres when it shares a setting, theme or genre, a layer he calls "key and notes". In Rogue everything is "of the dungeon", a coherence of proximity, though Carney finds the Yetis slightly dissonant, and slight dissonance can be welcome {{SU-VcmsOvZo#5}}.

Familiar settings bring free understanding. Tyler Coleman observes that medieval fantasy easily gets you 80% familiarity from known tropes, even for magic, while a sci-fi item name means something different in every game. For Space Merchant he used "narrative greebles": keep a familiar base noun and attach a novel modifier, as in "tachyon disruptor rifle" {{C6jR41fZjqM#5}}. Borrowing an entire existing world is the extreme case. Santiago Zapata describes Moria as the first XRL, a roguelike adapting an existing setting (here The Lord of the Rings); where Hack built its own world, Moria pioneered using Rogue's conventions as a shared language for adventures in many settings, and XRLs are now many players' entry point to the genre {{y6WCq0jYbHo#3}}.

### Believable, coherent worlds

Thomas Biskup started ADOM partly because NetHack's tourists and samurai clashed with his wish for a believable, story-coherent world, a matter of personal taste rather than a flaw in NetHack {{a3ZYDA2JVSM#0}}. David Craddock reports that Biskup missed taking part in a story, since NetHack felt like a puzzle about optimising your way to the Amulet, and so balanced static authored elements with procedural ones: each adventure is new, but players feel part of a larger story {{Gs9Nb5ZYRY0#8}}. Ultimate ADOM extends that story rather than discarding it. One of ADOM's ultra endings, a champion's fight with the chaos lord, shatters Ancardia into a multiverse of similar but varied worlds that share rules, engine and monsters, which gives a story reason for multiple games and platform variants {{iZUXjbcAfYs#7}}. It adds seven factions with their own agendas in the law-versus-chaos conflict, each with minor benefits and hindrances, plus an unaligned option for players who just want to explore {{PTIsUSbQ0TA#4}}. Biskup also admits ADOM never explained its backstory at the start in its first 25 years, so Ultimate ADOM opens with a trailer that establishes the lord of chaos, the cataclysm and the player as someone buried alive {{PTIsUSbQ0TA#3}}.

Caves of Qud reaches coherence differently. Jason Grinblat describes its post-apocalyptic setting as drawing on Gamma World, but with the pre-fall past obscured by time and cultural mashups, so players cannot readily identify with it as they can in Fallout {{kDKQM27U-Nc#0}}. Its handcrafted RPG narrative is woven around simulation: physical systems where you can dig anywhere and every wall has a melting point, social systems of factions and reputation, and a history generated at the start of every game that seeds world generation {{ClGAApZYIvI#0}}. Phillip Daigle offers the writer's test: lore should give rise to interesting gameplay scenarios and come from your own genuine interest, because lore written to please an imagined audience shows its insincerity; he favours lightweight lore that players fill in themselves {{2C3w7-SU5ek#13}}.

### Bounded and strange spaces

Roguelikes have always liked enclosed places, and Everest Pipkin explains why. Islands and other bordered settings give the designer a controllable space where the rules can differ: you build the edge of the world first, then a garden inside it {{O78uYtUZKYs#0}}. Pipkin's own The Barnacle Goose Experiment seals a researcher in a hermetic dome whose only raw material is their own body, so the enclosure drives both fiction and mechanics {{O78uYtUZKYs#1}}. Descent works the same way vertically:

> Through diving into the earth, the world is turned on its head. The rules that existed above no longer apply here. {{VwZS0MQSpaU#12}}

Pipkin cites Undertale's fall into a world of monsters and Kentucky Route Zero's underground highway {{VwZS0MQSpaU#12}}. In an unfinished prototype, Pipkin's angel digs caverns for a demanding god until they become a warren the player must learn and live in, and the question "is this about labour or love?" resolves into both, repetition and devotion {{VwZS0MQSpaU#14}}. Alexandra Leonhart reads the fantasy dungeon as a Foucauldian *heterotopia*, a deviant space that juxtaposes objects and times, like a cemetery inside a city or a museum, and notes that Rogue's hero does not live there but comes from elsewhere to delve {{R8DSq8qSJ44@28748#3}}.

### Theme carried by structure

A theme can live in how the rules behave rather than in what things are called. Joel Clark says Blaseball's pile-up of broken, layered rules is partly a deliberate experiment in replicating how broken real-world systems, especially American politics, come to exist: rules keep being added because gutting the system is nearly impossible, until the whole is incomprehensible {{zO05p-e57AQ#9}}. Ada Null's Kiss Garden uses social-media-feed pacing, layering and rapid change, to create chaos and overwhelm while going nowhere, which reinforces its theme of stagnation instead of undercutting it {{VzoruhRyvqQ#4}}.

### When the setting is the player's screen

G blekkenhorst's interface games push setting to its limit. *Metalepsis* is movement between levels of reality; games usually achieve "convergent metalepsis" by anchoring to a real location, but an interface game incorporates the player's hardware and body, so its geography is wherever it is played, much as found-footage films and epistolary novels make the reader a character by claiming to be evidence {{uZdEXqRkBZA#1}}. They work because real life is already mediated by screens we trust, so something magical or dangerous behind an interface feels as real as a message from your boss or grandmother {{uZdEXqRkBZA#3}}. Everyday frustration with technology becomes fiction: in The Archive, entering a player-made forgery crashes the database because the artefact is too powerful to be contained {{uZdEXqRkBZA#4}}. Most such games use a lean pretext of fictional employment, which is relatable and can valorise mundane screen work {{uZdEXqRkBZA#5}}.

**In practice**, ask of a candidate setting:

- What new mechanics does this theme suggest that a generic fantasy dungeon would not {{jviNpRGuCIU#15}}?
- What shared "key" will make generated content feel like it belongs together {{SU-VcmsOvZo#5}}?
- How much familiarity does it give for free, and where will you need greebles to bridge the gap {{C6jR41fZjqM#5}}?
- Where is the edge of the world, and what rules change inside it {{O78uYtUZKYs#0}}?
- Could the structure of your rules, not just their names, carry the theme {{zO05p-e57AQ#9}} {{VzoruhRyvqQ#4}}?
- Do you genuinely care about this lore, and does it generate play {{2C3w7-SU5ek#13}}?

## Writing the words: items, logs, dialogue and voice

Julian Day's starting point is that every presentation decision builds the world: graphics or ASCII, monster memory, item lookup. How you impart information goes further: if lore arrives in prose, your world has prose; if it arrives in poetry, your world has poetry {{aBbaUSWFQPM#1}}. The words are part of the setting, and in a roguelike most of them appear in small, repeated places.

### Use the channels players already read

Jim Shepard's case against walls of text uses a late-game screen from Castle of the Winds, a game he loves: it is dense and rigid, the developer dictates how information arrives, the player can't make it their own, and three paragraphs make even engaged players want to skip {{jd7K0EmkvPk#1}}. His alternative is the combat log. A wolf "deals four damage with sharp canines" and "howls mournfully and dies"; an unfamiliar monster attacks with "molten slashers" and defends with "deflected phasic chitin". The player learns about the creature because the information happens to them in a fight they must have anyway, and names like "dire" or "apex" sell fierceness {{jd7K0EmkvPk#4}}.

Item text is the other high-traffic channel. Shepard calls item names, descriptions and flavour the easiest way to convey tone, because players look at loot constantly. Dungeonmans' starting weapon, a thick plank with a bent nail, is funny but still plausible, unlike a wet noodle you couldn't hurt anyone with, and it sets up a rags-to-riches arc as higher-tier items get more serious {{_Si626-Y_q0#5}}. Tangledeep goes further and characterises its heroine Mirai entirely through flavour text written as her thoughts about each item: she expects better swords, is baffled by strange magic, and the Wild Child job's claws prompt her to wonder whether she is a cold-blooded killer {{jd7K0EmkvPk#8}}. The waste case is flavour text that restates the item ("a long sword is a weapon"): it costs reading time, writing time and, since translators charge per word, localisation money {{jd7K0EmkvPk#6}}.

### Optional and brief

Lore that players can skip should be safe to skip. Paul Dean assumed Pacific Drive's players would not read lore, or would read it at random, so he kept it bite-sized and non-essential, a reward for the curious and never an obstacle for others {{nLqLOzrjkYU#6}}. Shepard likes optional books in the Elder Scrolls style, but warns that books meander from the core story and that mandatory plot information placed in them may never be read {{jd7K0EmkvPk#2}}. Day's long poem in a modernised Spenserian stanza in Shadow of the Wyrm is optional by design: it tells early-world lore for players who like lore {{aBbaUSWFQPM#3}}.

On length, Dean and Francesco Cottone both argue for short. Dean's formative example is Captain Blood, where releasing a young alien on a planet without atmosphere produced two or three lines of him suffocating and missing his parents before he died; taken elsewhere, the alien was excited instead {{nLqLOzrjkYU#1}}. Dean still remembers it 35 years later:

> Good narrative doesn't have to be wordy, complex or elaborate. {{nLqLOzrjkYU#1}}

He points to Nuclear Throne's single-line interstitials, lines you could miss if you look away, that hint at the world and the character's feelings without compromising tone or pacing {{nLqLOzrjkYU#2}}. Francesco Cottone notes that Rogue itself tells the player what happened in short sentences, and that short sentences can carry complex stories while fitting the tight space of Chronicles of Stampadia's printed lookup tables {{IPMXeSAvtDs#5}}.

### Craft tools

The talks give a set of concrete techniques, most of them from Shepard's experience writing Tangledeep:

- **Pick a narrative perspective and keep it.** Item text can be third person (neutral description), second person (a narrator addressing the player like a dungeon master) or first person (the character's voice). Shepard admits mixing third and second by accident and recommends consistency. First person is the most powerful: the same ornate plate can reveal a complaining, pompous or loot-hungry character, while stats, sprite and slot carry the critical facts {{jd7K0EmkvPk#10}}.
- **Borrow a voice.** As a rookie technique, take a fictional character you know well and apply their voice wholesale: a young blacksmith with Deckard Cain's love of history, patience and riddles. For Tangledeep's antagonist Shara he blended an idealistic early Jaina Proudmoore with Final Fantasy XII's Vayne Solidor {{jd7K0EmkvPk#12}}.
- **Information first, flavour second.** A shop must read as a shop before the jokes; you don't serve a brick of salt with chicken sprinkled on top. Be concise unless the character is meant to ramble, and keep each voice consistent {{jd7K0EmkvPk#11}}.
- **Work around what you can't write.** Shepard got stuck rhyming every scroll (nothing rhymes with "toxic"), so scroll text became the heroine's imperfect translations of runes, "dirt fold", "fat wet splash", which also made her more interesting {{jd7K0EmkvPk#9}}.
- **Foreshadow with proper nouns.** Early items have little to say mechanically, so let one mention a named steel that great weapons are forged from; when the name reappears on plate mail or a golem, the player knows it is special {{jd7K0EmkvPk#7}}.
- **Build twists from small facts.** A twist only matters if the player knows what is being twisted, so establish just the pertinent facts in small bites from characters and found objects, as BioShock does {{jd7K0EmkvPk#14}}.
- **Audio logs, if you can afford them.** They deliver story without interrupting play, but voice acting is usually beyond indie roguelike budgets {{jd7K0EmkvPk#3}}.
- **Keep a fallback for plot exposition.** Tarn Adams describes using traditional RPG devices at a dungeon such as a bandit hideout, incriminating notes, payments, or a captured villain confessing, so the game can pass information to the next link of a generated plot even when investigation is weak {{4-7TtPX5uhg#18}}.
- **Generic systems, specific messages.** Alexei Pepers was inspired by how NetHack seems to know what you are doing whatever you have become, telling a floating eye it got cream pie in its eye, and that this comes from one readable body-part function rather than countless special cases. That combination makes the game feel like an all-knowing dungeon master {{5y_IAdOwaYs#5}}.

### Poetry and evocative prose

A handful of roguelikes take the opposite of the plain-and-short route and earn it by placing the richness carefully. Day credits ADOM's minstrel, whose poems deliver information about places, people and lore, as a new and still rare use of poetry in roguelikes; you don't need him for a regular win, but he is central in several ways {{aBbaUSWFQPM#0}}. In Shadow of the Wyrm, Day wrote prose poems, paragraph poems rather than blocks of verse, into the descriptions shown by the item lookup command, and players told him how nice it was to stumble on them inside an otherwise violent game {{aBbaUSWFQPM#6}}. For his stanzas he uses modern diction and imperfect rhymes such as "dread" and "stretch" to widen the rhyme set {{aBbaUSWFQPM#4}}, and he breaks lines mid-sentence, leaves the middle lines unrhymed and closes with an alexandrine for a more natural rhythm than his Spenserian model {{aBbaUSWFQPM#5}}.

Younès Rabii finds the same habit in La Horde du Contrevent and Caves of Qud: poetic description of trivial things, such as a pile of bones that makes you think about time and life, evokes the world's beauty, danger and wonder {{6ik6jB2YhZg#7}}. Ivy Melinda calls Qud's prose the purplest she has seen and argues that it, together with a lovingly depicted, diverse cast in safe hub locations, makes the world feel real and alive beyond its mechanics {{db6S2lgTWmI#2}}. Ray notes that Qud attaches handwritten "recall stories" to storied artefacts with no attributed teller, so they read like a storyteller digressing about provenance {{rPhXTcVVJmo#3}}.

**In practice**, for a first pass over your game's words:

- Decide the delivery form on purpose, prose, poetry, log lines, first-person thoughts, because the form is part of the world {{aBbaUSWFQPM#1}}.
- Move story out of text screens and into the combat log, monster names and item text {{jd7K0EmkvPk#1}} {{jd7K0EmkvPk#4}}.
- Delete any flavour text that only restates the item {{jd7K0EmkvPk#6}}.
- Choose one perspective and one voice per character, and put the necessary information first {{jd7K0EmkvPk#10}} {{jd7K0EmkvPk#11}}.
- Keep optional lore short and never put required information only there {{nLqLOzrjkYU#6}} {{jd7K0EmkvPk#2}}.
- Where you want richness, tuck it where curious players will find it, in lookup text or a minstrel's verse, rather than in their path {{aBbaUSWFQPM#6}} {{aBbaUSWFQPM#0}}.

## Authored story inside a replayable structure

The previous section dealt with words one line at a time. The remaining sections deal with structure: how authored story is arranged so that it survives replay, and how generated characters, histories and plots are made to read as stories.

A roguelike is played many times, in many orders, by a player who keeps dying. Any handwritten story you put inside it has to survive that. The obvious move, a story that branches on what the player does, is the one two talks warn scales worst {{sOZH6RPuNJ8#0}} {{aJC3ioashbs#0}}.

### Why branching breaks down

Nic Junius, whose theatre analogy appears under "Players as co-authors", puts the problem bluntly: a narrative that reacts to player actions breeds fractally branching trees of alternate realities, and the authoring burden quickly becomes untenable. Tools help, but it is hard to know when systemic authoring actually becomes cheaper than writing by hand, and combinatorial systems often call for more content than anyone can reasonably write {{sOZH6RPuNJ8#0}}. His starting principle is that however dynamic the system, someone still has to put pen to paper for every piece, so you choose a story structure with authoring cost in mind {{sOZH6RPuNJ8#1}}.

Brianna McHorse and Chris Foster agree that handwritten branching narrative is the gold standard for emotional impact, and that it scales poorly: mapping cascading consequences over dozens of choices is bounded by labour and budget. Their example is Hades, which feels handwritten and responsive because it is, built on an enormous list of conditions and over 20,000 unique voice lines. Hades generates its levels but not its story {{aJC3ioashbs#0}}. Nathan Savant makes the same observation from the other side: Hades gets its reactivity almost entirely through dialogue, with relatively simple triggers but huge scripts of conditional lines, rather than by moving characters around the world {{rmddpcmIJ2I#10}}. The lesson in both readings is that Hades' reactivity comes from simple triggers over a very large volume of handwritten lines, which is what makes it so costly.

### Braided narrative

Junius' answer is the *braided narrative*: a structure of individual linear storylines whose progression is controlled by both independent and shared state conditions {{sOZH6RPuNJ8#2}}. Each strand is linear, so writing it grows roughly linearly. The variety comes from *when* a player meets each piece, not from branching on everything the player does. Ideally the strands share a cast and complementary themes, so they read as one story twisted together rather than parallel ones {{sOZH6RPuNJ8#2}}.

The two kinds of condition do different jobs. Independent conditions keep the strands distinct. Shared conditions make them move together, sharing momentum and timeliness, and they invite players to connect strands whether or not you spell the connection out. If every strand advanced only on its own conditions, you would drift back toward the combinatorial tree {{sOZH6RPuNJ8#3}}. Junius reserves shared states mostly for major beats of the central plot. A side story that reaches such a beat simply pauses until the player gets there, so you never write content for a player arriving out of order, side stories can refer to plot events without extra branches, and a player who exhausts the side content is pushed to advance the main plot {{sOZH6RPuNJ8#4}}.

Hades is his main case study:

- **The spine runs through runs.** The credits roll after the player reaches the surface and beats their father ten times. Because the game is hard, players rarely see much of the central story in their first ten runs, so the side stories carry the pacing and give non-mechanical reasons to keep playing past the credits {{sOZH6RPuNJ8#6}}.
- **Varied gates.** Character storylines are gated on a relationship meter filled by gifts, on how many times you have spoken to someone, on run-count breakpoints, and even on the difficulty-customisation system, all independent of main-story progress. One player finishes the main story with little side progress; another finishes most side stories before the credits {{sOZH6RPuNJ8#7}}.
- **A subset of the cast per run.** Only some characters are reachable on a given escape attempt, and even then you may lack the resources to progress them. Junius calls this the trick of the whole braid: players cannot advance any strand at will, and keep discovering more after dozens of hours {{sOZH6RPuNJ8#8}}.
- **A pacing cap.** Pure if-statements are not enough, because without a cap the player gets every available story unit at once and must pace it themselves. Hades tends to release at most about three new story events per run. Tying progression to other systems also rewards engaging with them {{sOZH6RPuNJ8#5}}.

Fire Emblem: Three Houses shows the same idea on a relationship graph. Its large cast would explode combinatorially, so support conversations are mutual (each pair has one linear set of scenes, with no direction to the relationship) and are unlocked almost entirely by the two characters fighting side by side. Only a few final conversations are gated on main-plot beats {{sOZH6RPuNJ8#10}}.

Junius is candid about the limit. Both games contain an obscene amount of writing, and the burden still grows with scope. What changes is the curve: a braid scales like writing linear stories, not like a branching tree or exhaustive coverage of a dynamic system {{sOZH6RPuNJ8#12}}.

### Storylets and salience

A *storylet* is a self-contained chunk of authored content with a condition on it; *salience* is how the engine decides which eligible storylet fits best right now {{R8DSq8qSJ44@22364#9}}. Several independent projects converge on storylets as the practical unit for story in a replayable game.

- **Voyageur.** Bruno Dias built his space game on Fallen London-style storylets gated by planet and player traits. Outcomes change traits, which act as stats, meters and spendable resources: spacing a stowaway raises ruthlessness and lowers kindness, taking them in does the reverse, and that shifts crew loyalty and later options {{UGPkEWqwSAY#11}}.
- **Hintline 93.** Paris Buttfield-Addison describes a museum exhibit about 1993 game support lines in which each call plays like a roguelike run, drawn from a shuffle bag of about 52 calls. In Yarn Spinner every call node shares a title, forming a node group; since every condition passes, the engine picks a random, least-recently-seen call, so visitors queueing behind each other rarely hear the same one. One call per file let five people write at once {{R8DSq8qSJ44@22364#9}}.
- **Sunshine Shuffle.** Stav Hinenzon's poker game treats each conversation as a storylet with preconditions and post-conditions. The story is a linear sequence of main conversations plus optional ones unlocked along the way; whenever the table needs talk, one is picked by weighted randomness from the next main conversation and any unlocked optional ones {{MyVigc1nDig#1}}. Poker and story run simultaneously and independently, so characters bet, speak and pass in one flowing scene {{MyVigc1nDig#0}}, and keeping dialogue, cards and menus in the same boat cabin makes the characters seem alive, like actors doing secondary business while delivering lines {{MyVigc1nDig#6}}.

The same idea works on paper. Francesco Cottone describes how Fallout: The Board Game delivers non-linear story with encounter cards: a decision on one card may tell you to shuffle a numbered card into a deck, so the consequence surfaces later somewhere else, and several storylines can interleave in one adventure {{IPMXeSAvtDs#4}}. In a digital game, Alexander Birke's Sea of Rifts writes choice-based scenes in the open-source Ink language and adds an in-house editor alongside each Ink file that connects choices to game state, so a choice can change the state, be disabled when you lack the right crew, or be resolved randomly or by skill check {{0jFzBf0mCRY#13}}. That bridge between authored text and simulation state is what turns a story chunk into a storylet.

### Giving fragments a shape

Storylets alone give you a shuffle. Three techniques give the shuffle a shape. Paul Dean recommends gating: a universal introduction that teaches mechanics and key characters, then wide freedom in the middle. With fixed points at each end there are a hundred ways between them, and how much hand-holding you add is a choice about how punishing or helpful you want to be {{nLqLOzrjkYU#13}}. Bruno Dias borrows perpetual forward motion from 80 Days: the player can never revisit a place, so they pick up threads, play with them briefly and move on, and no single generated planet has to carry much narrative weight {{UGPkEWqwSAY#9}}. And Herbert Wolverson shows how a level generator can order beats spatially. If you know the room order along the *hot path* (the route the player must take), you can place story beats such as a destiny speech near room one, and place a lock-and-key puzzle validly: a flood fill confirms there is no way past room five, so the key must spawn in rooms one to four {{TlLIOgWYVpI#17}}.

### Fixed text, varied encounter

You can also keep every word authored and vary only the order or the view. Chelsea Thompto's A Walk in the Dark fixes six authored six-line poems; when one ends, the next is chosen at random and the spaces they appear in are shuffled and reordered {{-xrcmY7LNPI#5}}. The Neutrinowatch podcast pushes this further. In one episode music swells over a monologue in waves that shift daily, so each listen reveals only parts of the story and the whole emerges only across several days {{1sZlIfCcz_c#6}}. In another, an AI character keeps rewriting a letter, and its text drifts from plain to abstract and weird over the month {{1sZlIfCcz_c#5}}.

Varying the *size* of authored pieces is another lever. Alexei Pepers points to Yakuza 0's substories: most use two verbs, but one unexpectedly contains a unique zombie-defence mode with nothing signalling it in advance. That unevenness creates content suspense, because the player never knows how big or strange the next piece will be, and Pepers notes small games can do it too {{H5EU9_Gdu94#19}}. Hidden alternatives work similarly. Isaac Io Schankler's Orb Pondering Simulator hides two endings behind the same small verb set, so which one a crowd reaches depends on which command it tries first {{M6t5W5PPVW0#2}}.

### When the script meets the simulation

If authored scenes use systemic objects, the script must bend to the simulation. Rich Wilson describes a Dishonored poisoning scene where the wine bottle and glasses were real, breakable objects. He scripted listeners for breakage and a branch in which, if the glasses are broken, the poisoner lures the victim to the basement and stabs him instead; having done the work, he added "spill the glasses" to the context menu so more players would find it {{wtlLa7BGZcs#3}}. Budget for this: every systemic prop in a scripted scene is a branch you may have to write.

Aaron A. Reed offers a different way out of the immersion assumption altogether, a fourth position beside the frame, resonance and cooperation views discussed under "Let the player's imagination do the work". Procedural stories do not have to be immersive. In Ice-Bound players manipulate symbols and watch the consequences ripple through the whole story, and Reed argues that a god's-eye view of the narrative machine can make multilinear structure more meaningful than immersion would {{x0Xh4oCX9t0#11}}.

> Procedural stories don't have to be immersive. {{x0Xh4oCX9t0#11}}

### Choosing a structure

The talks do not give a formula, but they line up into a rough guide:

- **Small team, short runs, lots of replays:** a shuffle bag or storylet pool with simple conditions and least-recently-seen selection, as in Hintline 93, where one-file-per-storylet also lets several writers work in parallel {{R8DSq8qSJ44@22364#9}}. Add forward motion so no single piece has to carry much weight {{UGPkEWqwSAY#9}}.
- **A story that should develop across many runs:** a braid of linear strands with independent gates, a few shared gates on main beats, a subset of characters per run and a cap on new events per run {{sOZH6RPuNJ8#4}} {{sOZH6RPuNJ8#5}} {{sOZH6RPuNJ8#8}}. Expect the writing load to grow with scope, roughly linearly {{sOZH6RPuNJ8#12}}.
- **Story that must react to game state:** storylets whose conditions and outcomes read and write that state, as in Voyageur and Sea of Rifts {{UGPkEWqwSAY#11}} {{0jFzBf0mCRY#13}}, with scripted scenes listening for what the simulation can do to their props {{wtlLa7BGZcs#3}}.
- **Avoid** full branching unless you have Hades-scale writing resources {{aJC3ioashbs#0}}.

## Procedural characters and a world that notices

A generated character starts as a bundle of numbers and tags. The work of this section is turning that bundle into someone the player remembers. The talks converge on two moves: let generation lead into handwritten material, and make the game visibly notice what has happened to each character {{vtU3Xa0ShKw#0}} {{vtU3Xa0ShKw#14}} {{aJC3ioashbs#2}}.

### Wildermyth: generation that leads into handwriting

Wildermyth is the case several speakers reach for independently. Patrick Belanger and Jackson Wagner state its core goal as character and story moments that feel unique to each playthrough yet genuine and memorable, achieved by having random generation guide or lead into handcrafted content across three pillars: heroes, myths (events) and combat {{vtU3Xa0ShKw#0}}. Jamie Brittain describes the result as heavily authored stories whose people are procedurally generated, ageing, mutating, retiring and returning, so the game gets intimate moments and a sense of time passing against an epic backdrop {{C2CzHLtt1Fw#7}}. McHorse and Foster note that Wildermyth interleaves requirement-based procedural events with handwritten arcs whose villains have real motivation, falling back to more generic procedural arcs when the custom ones run out. That mix widens the stories a budget can tell, but it still bounds them: players always want to do or romance something you did not plan for {{aJC3ioashbs#2}}.

The developers' practical rules are the most transferable part:

- **Acknowledge what happened by chance, not only what was chosen.** One-line "tidings" between battles reference transformations and their follow-ups, such as a hero carving art with a hook hand. The player did not choose the lost hand, so they discover the hero's story while guiding it, and Belanger and Wagner find that just as impactful as reacting to choices {{vtU3Xa0ShKw#14}}.
- **Add variation wherever its absence would feel weird.** An estranged father should comment on his child's new animal head, even in a single panel; one acknowledging panel is enough to satisfy players {{vtU3Xa0ShKw#12}}.
- **Let traits change the scene, not just the text.** Panel splits, where a hero's trait changes how a scene plays out (a wolf hero sniffing out a cave, a fire-touched hero trivialising a skill check in an ice cave), convince players events are not templates. Ask which trait you would expect to dramatically alter this encounter {{vtU3Xa0ShKw#11}}.
- **Write every voice.** Wildermyth writes text splits for all eleven personalities; letting a few personalities share lines proved inadequate, because consistent voices are essential to a game about memorable heroes {{vtU3Xa0ShKw#9}}.
- **No caricatures.** When any hero can fill any role, personalities cannot be extreme and relationships must stay broadly friendly. A hero who only speaks in poetry, or two heroes who hate each other, cannot be kept consistent across every event, so even rivals in Wildermyth still work together {{vtU3Xa0ShKw#10}}.
- **Exclude rather than vary when that is cheaper.** A fall-into-a-hole event simply does not trigger for winged heroes {{vtU3Xa0ShKw#13}}.

Brittain draws a broader claim from games like this: a procedurally generated cast inside a hero story breaks down the hierarchies that narrative structures tend to reinforce, much as a diverse writers' room keeps stories from "rounding themselves down", and with permadeath giving events consequence it makes roguelikes engines for character development {{C2CzHLtt1Fw#8}}. Aaron A. Reed reports something compatible from Blue Lacuna: players sensed and valued a dynamic relationship with a character far more than the simulation of objects, so he chose to put his effort into immersing people in a character rather than an environment {{x0Xh4oCX9t0#3}}.

### Character arcs from hidden state

Max Kreminski's work on Star Freighter gives a generator-level account of how arcs can emerge. His first point is about pacing: relationships take time, and generators tend to dump a full trait list up front. He acknowledges Tanya Short's argument that visible traits help players notice characters have inner lives at all, but prefers revealing traits gradually through actions over many interactions, as real life and other stories do {{66O6WDcT8KY#2}}.

Hidden state then makes foreshadowing possible. Foreshadowing normally needs knowledge of the future, but if a character has a *latent* trait (a dark secret, an untapped potential), storylets can drop hints about it before it develops. In Star Freighter a storylet fires only for a character with latent fighting potential: after a near-fatal fight they decide to learn self-defence, and a later storylet brings aboard a martial-arts passenger to teach them {{66O6WDcT8KY#3}}. Hintline 93 uses the same principle in miniature: it picks the next event first, then shows flavour text leaning toward it, so the phone "already knows things" before the know-it-all caller rings. Buttfield-Addison says roguelikes do this as well {{R8DSq8qSJ44@22364#7}}.

Kreminski adds three further ideas; he flags the first and third as speculative or not yet implemented, while the second is a Star Freighter example:

- **Best and worst endings.** Adapting Emily Short's advice, generate a good and a bad outcome for every significant character in advance and offer storylets that let the player bring either about, for instance by making characters' goals incompatible {{66O6WDcT8KY#8}}.
- **Storylet chains.** A fugitive passenger acts nervous about a heavily policed destination (foreshadowing from a hidden trait); the game raises the chance of a random search because contraband is aboard, since searches that find nothing are dull; the player then chooses to hide the fugitive or turn them in, a manual version of offering that character's best or worst outcome {{66O6WDcT8KY#9}}.
- **Focus episodes.** Like a TV episode centred on one character, a drama manager tracks which characters are in focus and up-weights storylets involving them, revealing backstory and deepening the connection, which also makes a later death sadder {{66O6WDcT8KY#7}}.

Kreminski also names a choice every such system faces. You can retroactively give a character a secret because the plot needs drama now, which he accepts as valid in other contexts, or you can set state first and let events fall out of it. He prefers the simulationist route and calls backfilling "cheating" for his own system {{66O6WDcT8KY#11}}.

### Speech that comes from somewhere

Generated characters sound authored when what they say is anchored to something. Mark R Johnson's Ultima Ratio Regum ends culture generation by building a database of culture-specific reference points for each domain (war, family, love, death, religion) that NPCs draw on in speech. NPCs from one culture might all fixate on the same ancient battle they won, which teaches the player the world and makes it feel lived in {{qh9vyoMviJI#7}}.

Robin Sloan makes the same argument about generated text in general: pin it to a systematic framework such as a map, a dramatis personae, a family tree, a spell list or a bestiary. The framework acts as a rhythm section that keeps the beat while the language riffs, and text, which already offloads work to the reader's imagination, does so more strongly when anchored {{cIpErjWBqm0#9}}. In his own project he fed the generated place names from each reader's map into the text generator, so the story could say "on the road towards Ningbag" and the reader could trace the route; he calls the names the glue between map and story {{cIpErjWBqm0#2}}. For conversations that need memory, Kate Compton keeps the logic in plain JavaScript and rewrites Tracery grammar rules at runtime, pushing a value onto a symbol when characters start discussing something and pulling it off later, treating the grammar as a whiteboard {{isB82kORimk#17}}.

**In practice:**

- Let generation choose *who*, and handwriting decide *what it means* {{vtU3Xa0ShKw#0}}.
- Reference random misfortunes, and add a line wherever silence would feel odd {{vtU3Xa0ShKw#14}} {{vtU3Xa0ShKw#12}}.
- Keep personalities within a range every event can support {{vtU3Xa0ShKw#10}}.
- Hold some traits hidden and hint at them before they surface {{66O6WDcT8KY#3}}.
- Anchor speech to generated culture, places and names {{qh9vyoMviJI#7}} {{cIpErjWBqm0#2}}.

## Generated history and environmental storytelling

Several roguelikes generate a past for their world. The convergent technique is not to show that past as a chronicle but to scatter it into the world as objects the player stumbles on {{owmGknfj6H4#8}} {{MHEkE7nPuZc#9}}. The harder question, which the talks raise more than they answer, is why a player would care {{D8A9dpITLAU#4}}.

### History as artefacts

Caves of Qud is the canonical example. It generates the life histories of ancient sultans each game, inscribes them in a historical record, and then surfaces scenes from that record on shrines, artefacts and snippets throughout the world; a shrine might depict a battle or a tavern visit {{owmGknfj6H4#8}}. Players meet that history at real in-game locations through shrines, engravings and paintings, such as one about a sultan adopted as a baby by gamblers {{kDKQM27U-Nc#13}}. Village histories get the same treatment: slime-filled amphoras that have a cooking use are also painted with scenes from the village's past, so ordinary props become monuments to events in the village's history {{owmGknfj6H4#7}}.

Dwarf Fortress does this with engravings and artefact descriptions. Isaac Karth notes that although the player never sees the world-generation history simulation directly, they experience its effects indirectly through that surface content {{MHEkE7nPuZc#9}}. Ivy Melinda describes what makes this work in Qud: the sultan histories are assembled like jigsaw pieces pulled blindly from a bag and crammed together in the hope of coherence, and that roughness leaves room for players to interpret and build their own stories, as Dwarf Fortress's histories do. One statue recounts a sultan saved by a band of worms after driving a carriage off the road, and forever indebted to them {{db6S2lgTWmI#1}}.

### Forgetting on purpose

Cole Wehrle's board game Oath, whose post-game reports and journal appear under "Players as co-authors", argues for something most generators do not do: forget. Oath has a deliberately selective memory, fully remembering some things, partially remembering others and not recording the rest; Wehrle pairs this with a decision framework that sharpens regret, and calls a faulty memory plus regret the essence of good history-telling {{HgnvMBVKP0M#9}}. He goes further: the gaps in the record are what make it feel real, and forgetting is probably the most central part of history {{HgnvMBVKP0M#17}}.

> The gaps in the record are the thing that makes the record feel so real. {{HgnvMBVKP0M#17}}

This sits against the full-record approaches later in this section, where every event is kept and browsable. The two are not exclusive. Qud and Dwarf Fortress keep a full record internally but surface only fragments, which produces gaps at the level the player sees {{owmGknfj6H4#8}} {{MHEkE7nPuZc#9}}. Wehrle's position is stronger: the record itself should be incomplete.

### Ruins and interpretation

Florence Smith Nicholls treats environmental storytelling as archaeology, because it means interpreting the material remains of an imagined past {{9kqvF2TqxLo#3}}. Her example is Mike Cook's Nothing Beside Remains, an ASCII-style game with a generated ruined desert village and no win state; its implicit goal is to work out what happened {{9kqvF2TqxLo#3}}. The objects present and their replacement-grammar descriptions depend on which of three causes ended the village: wildlife, environmental factors, or overpopulation leading to starvation {{IanNZxUaVQs#2}}. That is a compact design: one hidden cause, many objects whose presence and wording follow from it, and a player left to infer.

She proposes making the descriptions themselves subjective by giving the protagonist one of several roles, such as archaeologist, tourist or poet, each seeing objects differently. She was wary that the archaeologist would read as the "good" or authoritative view, so the roles overlap and none is privileged; the aim is partly to satirise the lone-traveller-discovers-ruins trope rooted in colonial ideas of archaeology {{IanNZxUaVQs#3}}. She points to Disco Elysium, where objects speak to you with their own opinions, and Heaven's Vault, where earlier translations shape how you read new artefact fragments, as models for objects with a point of view and for interpretation that accumulates {{IanNZxUaVQs#4}}. Younès Rabii finds the same role-gating in the novel La Horde du Contrevent and in Dwarf Fortress: each character understands the world deeply in one domain only, so which stories you can access depends on characters' jobs and skills {{6ik6jB2YhZg#8}}.

### Why would anyone care?

Making history available is not the same as making it matter. Jonathan Lessard states the problem directly: accessible simulation history does not explain why players would care about thousands of fictional people and their minor details. He does not claim to have solved it, but his team found that playing a single character made it unlikely that one life would be interesting, whereas a game role that gave reasons to look at many characters made interesting stories more likely to surface {{D8A9dpITLAU#4}}. His interface supplies leads: per-character pages with family tabs, hyperlinked year-by-year timelines and graphs of values such as influence. A woman with a husband and two ex-husbands, children with different surnames, or a sudden drop in influence in some year each raise a question to dig into {{D8A9dpITLAU#3}}. Intervention adds a personal stake. Lessard used a miracle to move Jessica near Valerie, whom she was courting with poetry; she joined a clan there, died in a battle, and almost no one came to her funeral. That consequence is visible only by examining the chronicles, which gives the player a reason to look {{D8A9dpITLAU#6}}. Bad News does something similar after its play session ends, simulating the town forward thirty years to produce an epilogue of what became of the characters the player met {{XFFyN10o87I#13}}.

Dustin Freeman is more critical of world-history generation as it usually ships. In Dwarf Fortress, Minecraft or SimEarth, it is passive scenery, like an opening cutscene; players engage with it only by stopping out of curiosity to pull on a thread such as an item's lore {{RYZSdPuvta8#4}}. His Spirit of the Ages makes history-making the play: the player uplifts a crocodile into dwarves, or sand into anxious sand golems, by choosing likes, dislikes and a destiny, and these become persistent concerns that carry on outside their original context so he does not have to anticipate everything {{RYZSdPuvta8#6}}. Jasmine Otto reached a related conclusion from a family-tree module with long-lived vampires: a hands-off multi-generational simulation produces interesting artefacts to tab through afterwards, but it is not fun to sit and watch {{NjIDVIIg1lY#3}}.

Aaron A. Reed adds the cost side. Procedural story projects should simulate only what the story needs, because players rarely notice environmental detail that does not serve it {{x0Xh4oCX9t0#0}}. Blue Lacuna had room descriptions that varied by time of day, a moon whose phases drove the tides, and weather-triggered ambient messages; players did not realise or care that a description had 18 variants, and what they noticed was not what they remembered {{x0Xh4oCX9t0#1}}.

### Scoping history to what players meet

Taken together, the talks suggest working backwards from the player's encounter:

- Decide where history will surface (shrines, props, engravings, character pages) before deciding how much to simulate {{owmGknfj6H4#7}} {{x0Xh4oCX9t0#0}}.
- Surface fragments, and consider genuinely forgetting some of the record {{db6S2lgTWmI#1}} {{HgnvMBVKP0M#17}}.
- Give the player a role or a lead that makes the past worth investigating {{D8A9dpITLAU#4}} {{D8A9dpITLAU#3}}.
- Where you can, let the player's actions become part of the history, so it is played rather than watched {{RYZSdPuvta8#6}} {{D8A9dpITLAU#6}}.

## Finding and staging the drama

A simulation that produces events has not yet produced a story. This is one of the clearest convergences in the chapter: researchers, live performers, a fan-data group and game developers all say that the step from output to story is a separate job, and someone has to do it {{BDcZSWHu8RQ#7}} {{XFFyN10o87I#2}} {{WeRCGy3-uPY#1}} {{aJC3ioashbs#1}}.

### Output is not story

Max Kreminski summarises James Ryan's model from his dissertation *Curating Simulated Storyworlds*. A simulation runs freely; its events are *chronicled*; the chronicle is *story-sifted* for the most narratively useful material; and a *narrativizer*, either a player's head or an AI, turns that material into a story. Nothing that comes straight out of the simulation is the emergent narrative {{BDcZSWHu8RQ#7}}. McHorse and Foster make the same point from experience: Dwarf Fortress generates interesting events, but a friend who tried to turn them into narrative, even after sifting for good bits such as a spy who had the tables turned on him, found them hard to convey. Connected information rendered fluently is still not a compelling narrative {{aJC3ioashbs#1}}.

Kreminski also names who suffers when the step is skipped. In dense roguelike simulations so much is happening in the interface and background that the compelling bits are buried, and that kind of storytelling is effectively closed to novices {{oaDI0lWkedg#1}}. Allie Signet and Joe Maliksi, speaking about the Blaseball fan data group SIBR, add the precondition: procedural systems constantly tell surprising stories that are impenetrable without detailed records, so emergent narrative depends on logging, as in a roguelike where you review the log to learn why something happened {{WeRCGy3-uPY#0}}. Once data is cheap, the storytelling problem becomes filtering signal from noise {{WeRCGy3-uPY#1}}.

### Sifting as a technique

*Story sifting* means letting the simulation produce an overwhelming chronicle, then searching it for compelling sequences to surface as micro-stories. Kreminski's example: character A starts a project and gives up, B comes along and talks about it, and A resumes work. The ideal is a large library of diverse sifting patterns, so many different micro-stories can be pulled from the same events {{oaDI0lWkedg#2}}. His group is using sifters to drive an artificial commentator that narrates the simulation as it runs {{oaDI0lWkedg#8}}.

Bad News, a live performance piece, shows the human version. A hidden "wizard" live-codes queries into a simulated town to find love triangles, rival businesses and founding families, and passes the material to an actor, who starts with about three to five dramatic high points to build into an arc {{XFFyN10o87I#1}}. The narrator's framing is that this material is latent: it is not coded as story, but a human recognises it as interesting, and it only needs bringing to the surface. In the run shown, the chosen storyline was that the deceased had been in love with his brother's wife, and both worked at the family brewery {{XFFyN10o87I#2}}. Bad News also allows what its team calls arbitrary simulation fidelity: when the simulation cannot handle what the player does, the wizard types in what is happening, as when a night janitor was made to emerge to let a locked-out player into a building {{XFFyN10o87I#9}}. A digital game cannot have a wizard, but it can have the equivalent: queries for dramatic patterns, and authored fallbacks where the simulation runs out.

Statistics are a cheap form of sifting. The SIBR speakers argue that aggregates, averages and leaderboards tell stories at a glance: a graph of a player's stats over time can show an underdog arc, and knowing averages lets a fan spot which opposing slugger to fear, or a lone star on a struggling team, without watching a game {{WeRCGy3-uPY#6}}.

### What to sift for: lessons from reality TV

Reality television is a genre built on sifting a constructed situation for drama, and three speakers use it as a model.

Dennis Greger gives a content hierarchy. At the top are rare moments of raw, unfiltered, relatable emotion; two of those make a strong episode. Below them come broken taboos (mostly social norms, such as lying to someone's face or who pays the bill), then characterisation, then "juice" (fast edits, music, colour, noise), and only then traditional story, which matters little because the show's format carries it {{50u5_hXZkv4#1}}. He notes that genuine emotion is why audiences return, and that the conversation about centring emotion is barely happening in games {{50u5_hXZkv4#8}}. For a story sifter, that is a ranking of what to look for.

> You really want to find raw emotion. You want to have these moments that are really few and far between. {{50u5_hXZkv4#1}}

Greger also explains the conditions that produce such moments. A *magic circle*, a bubble where normal rules do not apply, is why unusual things happen on a set; creators sustain it by holding tone, building trust and treating the game as seriously as the people inside it {{50u5_hXZkv4#3}}. And the narrative works like a party of rooms with heightened moods: you need not explain everything, and should not try, but you must make clear who we are looking at and give a clue to what they are doing {{50u5_hXZkv4#5}}. That last rule transfers directly to surfacing sifted events: name the actor, hint at the situation, and trust the player with the rest.

Leigh Alexander calls these shows *constructed realities*: contained spaces with rules designed to make social narrative emerge, which makes the celebrity mansion a natural roguelike dungeon {{NjYS8XmeaiY#0}}. Prototyping her game McMansion, her team found simulated celebrity behaviour so unhinged that they shifted from having the player solve murders toward having the player commit them {{NjYS8XmeaiY#3}}. Florence Smith Nicholls, reading Love Island as a roguelike, notes that the confessional, where the viewer learns what other characters do not know, is hard to translate to digital games but might suit live or hybrid design like Bad News {{MQw3pe-z6JM#6}}. She also finds in reality TV an "honesty of fakeness": contestants accused of playing the game are all, in fact, playing a game, which exposes how constructed our ideas about relationships are, and she offers this as a lens on how roguelikes approach simulation {{MQw3pe-z6JM#8}}.

**In practice:**

- Log everything the simulation does, in a form you can query {{WeRCGy3-uPY#0}}.
- Write sifting patterns for the micro-stories you want, and build many of them {{oaDI0lWkedg#2}}.
- Rank what you surface: raw emotion and broken social norms above plot {{50u5_hXZkv4#1}}.
- When you present a moment, say who it is about and give a clue to what is going on, and stop there {{50u5_hXZkv4#5}}.
- Use aggregate statistics and leaderboards as at-a-glance story {{WeRCGy3-uPY#6}}.
- Do not assume fluent text makes the material compelling {{aJC3ioashbs#1}}.

## Generating plot: planners, quests and complications

The previous sections find stories in what happened. This one is about making things happen so that a story results. The talks offer three broad families: simulation of agents, planning, and grammars borrowed from tabletop play and older media.

### The real problem is rewriting

Stephen G. Ware frames the field. Getting a computer to write a story is an old problem, dating back to Tale-Spin in 1974, and not the one games need; plenty of people want to write stories. The interesting problem is getting a computer to *rewrite* a story on the fly when a player does things the author cannot control, as a D&D game master does {{Rs_-yMsJDq8#0}}. His main lesson is that storytelling is non-Markovian: whether an event makes sense depends on the whole sequence of past and future events and on the alternatives, so a story's quality can only be judged relative to the other stories that could have been told. That is why planning stories is expensive: all the alternatives have to be generated and checked {{Rs_-yMsJDq8#13}}.

### Emergence versus planning

Ware sets out the basic trade-off. Emergent stories from many lightweight agents, as in Dwarf Fortress or The Sims, are unpredictable, so if you have beats you must hit, you can only hope they happen; you are herding virtual cats. Planned stories look ahead to guarantee requirements can be met. Handwritten scripts sit at the other end, limited to what can be imagined in advance {{Rs_-yMsJDq8#1}}.

Jasmine Otto's experience shows the emergent failure in practice. She built a faction simulation with murders and accusations, wanting an event where someone is dramatically accused of murder to fire. With so many characters retaliating tit-for-tat, steering toward that event was painful; the system was interesting but did not give her leverage, which is what motivated her cyclic plot generation {{NjIDVIIg1lY#5}}. Max Kreminski names what is missing: generated stories need character-level goals ("perform my experiment", "get revenge on Fred") to make scenes compelling, and author-level goals ("raise the tension between these characters", "illustrate a conflict between two values") to keep the story moving instead of becoming a soup of characters acting aimlessly {{BDcZSWHu8RQ#13}}.

Ware describes how story planners supply that structure:

- **Intention.** A classical planner happily produces nonsense, such as a merchant walking to your house and giving you medicine. The first story planners required every action to contribute to some character's goal, propagating intentions backward, so the player walking to market and buying medicine for their grandmother is explained by the goal, and so is the merchant's reason for selling {{Rs_-yMsJDq8#4}}.
- **Failure.** Stories run on conflict, so plans must be able to fail. A planner can explain an action in a failed plan, like walking to a crossroads and being robbed, by drawing on the many unused stories its search generated: an action makes sense if there exists some story in which it does. The discarded stories become a database of what could have happened {{Rs_-yMsJDq8#5}}.
- **Intervention or replanning.** When the player is about to make the planned story impossible, a drama manager can intervene and stop the action, or, ideally, accommodate it by replanning around it. Fast planning is what makes replanning possible {{Rs_-yMsJDq8#9}}.

### Tabletop methods: surprise, coherence and failing forward

Cezar Capacle brings techniques from solo and GM-less tabletop play. The sweet spot for a generated result balances surprise against confirmed expectations, so that a revelation feels as if it had been foreshadowed; when it works, players say "of course that's the answer" and feel clever for connecting earlier random events, and the story can surprise more than anything written in advance {{NklQJfhZT3k#4}}. His second tool is *fail forward*: a failed test should create complications and new avenues rather than a dead end. A failed lock-pick roll under old binary resolution just stalled the story, and without a GM you need tools that push it onward {{NklQJfhZT3k#5}}. He is also clear about the cost. With about a third of results landing in partial success, players must constantly invent complications in long sessions, which either turns repetitive ("you get hurt") or piles up threats until the original mission is unrecognisable {{NklQJfhZT3k#7}}. If you generate complications automatically, you need variety in them and a limit on how many accumulate.

### Quest grammars

Nathan Savant offers a grammar for programmer-developers who are not writers. Quests are stories, so they decompose into a beginning, a middle and an end, each with its own component types that a system can combine {{WTLPXhLjwLU#0}}. He builds the parts from The Lord of the Rings:

- **Acceptance.** A quest can be accepted, rejected, rejected and later accepted, or rejected and forced on the protagonist anyway. Frodo accepts; a player might walk away, come back out of guilt, or be dragged back by Gandalf. Each response changes how the rest of the quest reads without extra writing {{WTLPXhLjwLU#1}}.
- **Triggers.** A quest can start by conscious choice, by implied choice (entering a spider's nest, making noise), or with no choice at all, like the One Ring's quest {{WTLPXhLjwLU#2}}. The concrete mechanisms are talking to a character, interacting with an object such as a job board or treasure map, gaining an item, gaining knowledge, entering an area, or using a verb, such as casting an outlawed spell that puts you on the run {{WTLPXhLjwLU#3}}.
- **Middle struggles.** Scripted events, changed or new environments, and mechanical stresses like status effects that change how the player must play. Wearing the Ring flags Frodo for the ringwraiths, so he cannot follow roads or light fires {{WTLPXhLjwLU#4}}.
- **The end.** Usually a return to normal. Because gameplay and interface alterations are exhausting, reserve the significant ones for the main quest and pace them; in the books only the main quest heavily alters "gameplay" {{WTLPXhLjwLU#8}}.

### Pacing, momentum and skeletons

Generated plot also needs rhythm. Otto paces her output by walking the social graph edge by edge instead of picking edges at random: walking an edge brings both characters into the scene, the next edge may add a third or start a new scene, and those cuts make output read like chapters of prose rather than a raw event trace {{NjIDVIIg1lY#8}}. Ada Null keeps the deliberately bland generated text of Kiss Garden engaging with two event-level techniques, layering and rapid change: two narratives run at once and alternate every stanza, the dating narrator sees two or three people at a time, relationships last only a few dates, and the garden narrator shifts between wandering, pondering and obsessing over a plant {{VzoruhRyvqQ#3}}.

McHorse and Foster's Hidden Door combines handwriting and generation differently: short, generic, handwritten trope structures form the skeleton, and LLMs give each a unique contextual expression. They chose tropes because meeting or subverting trope expectations satisfies players {{aJC3ioashbs#8}}.

Nat Alison names what generated content tends to lack. Alison, defending hand-made sudoku, says human-designed puzzles have a story: a core "break-in" deduction that flows through developing logic to a resolution, whereas computer-generated puzzles have no set path {{rcIVCrddozQ#4}}. The same gap applies to plot: a generator can produce a valid sequence without a through-line. Setup and payoff are one way to supply it. In Dustin Freeman's live roguelike performance, a dragon rescued earlier becomes the escape route from a featureless final room, and a performer calls it out as Chekhov's gun {{mXRKvbRi9qc#2}}; Capacle's surprise-with-coherence is the same effect produced by a system {{NklQJfhZT3k#4}}.

### Choosing an approach

- **Simulation** gives surprise and player ownership, but beats are only hoped for {{Rs_-yMsJDq8#1}}. Pair it with sifting (previous section) and with author-level goals if you need direction {{BDcZSWHu8RQ#13}}.
- **Planning** guarantees required beats and can explain and repair stories, at the cost of searching alternatives {{Rs_-yMsJDq8#13}} {{Rs_-yMsJDq8#9}}. It suits games with specific beats that must land.
- **Grammars and tropes** (quest parts, fail-forward complications, trope skeletons) are cheap to build and easy to author, but they repeat and need pacing rules {{WTLPXhLjwLU#0}} {{NklQJfhZT3k#7}} {{aJC3ioashbs#8}}.

## Borrowing responsibly: real symbols, cultures and the past

Roguelikes borrow freely: occult sigils for a spooky altar, a retro aesthetic, the conventions of old fantasy. Fiction built from real material carries real meaning, and the talks that address this ask you to know what you are borrowing.

### Real magic, real people

Stanley W. Baxton opens with a hypothetical: a horror developer researches "real magic", finds a scary-looking symbol, ships it, and has unknowingly shipped something antisemitic. Searching online mostly surfaces Western esoteric resources, which syncretise practices taken from specific cultures {{HCbiYSzHtrI#0}}. That tradition, the main source of "real" occult imagery in games, was built substantially through appropriation; Baxton names Aleister Crowley as continuing a habit of taking from many sources and Helena Blavatsky as inventing supposed Tibetan teachings, and people then put these symbols into games, comics and novels without knowing where they come from {{HCbiYSzHtrI#1}}.

He gives a set of tests while insisting there is no paint-by-numbers solution:

- **Ask why.** Does the symbol just look cool? Is what it represents in your game what it actually means, or what someone else decided it means? Talk to people from minority religions about how they want their practices depicted, if at all, and respect a refusal {{HCbiYSzHtrI#4}}.
- **Open or closed.** Find out whether a tradition is open (anyone may practise it) or closed (by invitation, often an ethno-religion). Closed traditions are often so tied to a culture that divorcing them strips their meaning; representing them almost always needs permission, which is often refused, frequently because of past disrespect from colonisers. Even open traditions need thought about context {{HCbiYSzHtrI#2}}.
- **Avoid symbols with Hebrew letters.** As a rule of thumb, Baxton says this sidesteps roughly 80% of appropriation. In his Baphomet example the central figure draws on an open Greco-Egyptian tradition, but the Hebrew letters come from Judaism's sacred language, and Jewish magic is not for outsiders {{HCbiYSzHtrI#3}}.

As a positive example he names Fallen London, which gets away with occult ideas partly by being set before Crowley's time and by using transformed or "if you know, you know" nods rather than full references. For diasporic practices such as Santería, the answer is to talk to living practitioners {{HCbiYSzHtrI#5}}.

### Owning your perspective

Xalavier Nelson Jr. widens the frame. Games have no special duty to be respectful, but they are not exempt from conveying a perspective, through how they are made and what they become. Decide what fun is, own the implications, and do not fixate to the point of paralysis. Asked about "realistic" sexism and racism in historical settings, he called it a decision like any other: if you want players to be uncomfortable, make sure you say it well {{SdQxLThAbs8#12}}.

> They're not exempt from conveying a perspective through their creative process and through the final product. {{SdQxLThAbs8#12}}

### Nostalgia and dated sources

Retro aesthetics are a kind of borrowing too. Cara Esten Hurtle locates nostalgia's creative power in friction, the gap that opens when an aesthetic does not match the content people expect from it. Her HyperCard stack of nudes with text about her trans body, made in response to retrocomputing groups' no-NSFW rules, works that gap {{ua2Brr6KCJM#2}}. She also warns that reimagining the past through a retro aesthetic can wash over the real harms of the era; she cites critiques of Stranger Things making tolerance easy to imagine while the AIDS pandemic killed people in the background, and calls this reactionary even when it looks inclusive {{ua2Brr6KCJM#3}}.

Michael Brough takes a complementary line on old fantasy, the genre's source material. Engage with it despite its dated norms, because tracing how depictions changed gives a picture of progress and hope. He sets The Night Land, around 1912, with its completely helpless female character, against stories from the 1940s to 1960s where women throw daggers and hold their own {{JpX2wWwhKdE#5}}. Read together, Hurtle and Brough point in compatible directions: the past is useful material as long as you do not pretend its problems away.

### Resisting a single reading

Two talks address who gets to make meaning from generated work. Chelsea Thompto, a trans artist, builds systems populated with the texts, forms and feelings she wants viewers to confront, creating "spaces of contemplation" with legible themes that resist a single linear reading. That lets minoritised creators speak without their work being objectified or reduced to one message, and without producing "trauma porn" {{-xrcmY7LNPI#1}}. Alexandra Leonhart argues that a queer reading of games goes beyond representation, such as gay characters or pronoun options, to playing games queerly (speedrunning past designers' boundaries, friends inventing their own success metric in a racing game) and to queering the design process itself {{R8DSq8qSJ44@28748#0}}. For a roguelike designer, both point to the generator as a place where a perspective lives, not only the characters on screen.

### A due-diligence routine

- For every real symbol, ritual or tradition you use, ask why, and whether your use matches what it means {{HCbiYSzHtrI#4}}.
- Find out whether the tradition is open or closed; for closed traditions, seek permission or leave it out {{HCbiYSzHtrI#2}}.
- Avoid occult symbols containing Hebrew letters {{HCbiYSzHtrI#3}}.
- Prefer transformed ideas and light nods over full references, and talk to living practitioners {{HCbiYSzHtrI#5}}.
- When you evoke a past era, decide what you are leaving out and whether that erases real harms {{ua2Brr6KCJM#3}}.
- Accept that the game conveys a perspective, and make it the one you intend {{SdQxLThAbs8#12}}.

## Tensions and open questions

### Shaped arcs against open structure

Tarn Adams found Dwarf Fortress's adventure mode flat without an overarching structure and wants villains' schemes to supply plot {{4-7TtPX5uhg#0}} {{4-7TtPX5uhg#4}}, and Matt Carney gives every run a spine in its pulse of descent {{SU-VcmsOvZo#9}}. Emilia Lazer-Walker abandoned culminating structures as more trouble than they were worth {{MNEG1sLSRcM#7}}, and Cole Wehrle's Oath has no beginning, middle or end by design {{HgnvMBVKP0M#18}}. Tim Keenan stands by leaving Duskers without a final resolution, but his players wanted one {{G5rq5ei2Lec#7}}. The choice depends on whether the run already has a spine, on how predictable session length is, and on how much players have invested in the storylines you open.

### Emergence against required beats

The chapter's opening sections make the case for stories players assemble from what systems did {{MNEG1sLSRcM#0}} {{4-7TtPX5uhg#5}}. Stephen G. Ware's reply is that emergent agent stories can only hope to hit the beats a designer needs {{Rs_-yMsJDq8#1}}, and Jasmine Otto found her tit-for-tat faction simulation interesting but impossible to steer {{NjIDVIIg1lY#5}}. Within the camp that does manage drama, three positions sit on one axis. Max Kreminski prefers to set state first and let events follow, calling a backfilled secret "cheating" for his own system {{66O6WDcT8KY#11}}; Ware's planners reason over possible futures and replan around the player {{Rs_-yMsJDq8#9}}; Bad News has a human wizard who adds material whenever the simulation runs out {{XFFyN10o87I#9}}. The choice depends on whether your game has beats that must land, and on how much you are willing to intervene behind the player's back.

### The full record against the gap

Wehrle argues that a faulty, selective memory, together with regret, is the essence of good history-telling and that gaps make a record feel real {{HgnvMBVKP0M#9}} {{HgnvMBVKP0M#17}}. Jonathan Lessard keeps every event and makes it browsable, and his leads come from what the full record reveals {{D8A9dpITLAU#3}}. Caves of Qud and Dwarf Fortress keep a full record internally but show the player only fragments {{owmGknfj6H4#8}} {{MHEkE7nPuZc#9}}. The choice depends on whether investigating the past is the game, as it is for Lessard, or its backdrop.

### The power fantasy: keep it or take it away?

Jamie Brittain argues against prescriptive story structure and its bias toward happy endings, yet wants to keep the power fantasy that an overpowered run delivers {{C2CzHLtt1Fw#0}} {{C2CzHLtt1Fw#6}} {{C2CzHLtt1Fw#2}}. Harry Solomons asks instead what is gained by withholding the time-loop's power fantasy, as Inscryption and Returnal do {{AwOuZTCeOrU#6}} {{AwOuZTCeOrU#7}}. Andrew Cedotal adds that the anxiety a modern story should speak to is too many viable options, not resisting off-ramps on one path {{Gxn_MA3-Vgo#6}}. These positions follow from what the game is about: a power fantasy suits a game about getting stronger, and withholding it suits a game about loss.

### Justifying the restart

Marc Dolgin ties the need for an in-world reason to tone: comedy can skip it and serious games create the expectation {{ujKlmvfpNMo#12}}. Solomons treats leaving the restart unexplained as a legitimate choice that invites players' own conclusions {{AwOuZTCeOrU#10}}, and Keenan's Duskers sidesteps the question by making the player at the keyboard the protagonist {{G5rq5ei2Lec#3}}. No speaker says that one answer is always right.

### Attachment and permadeath

Lisa Brown grew so attached to her Road Not Taken character that her first permadeath ended her play {{BjqZdMW8U9Q#10}}, while Stella Vermilion's Nuzlocke runs build attachment through loss {{R8DSq8qSJ44@31561#7}}. The difference seems to lie in whether loss is part of the expected shape of play. How much emotional investment a permadeath game can safely ask for is not settled.

### Fixed tone against grown tone

Jim Shepard sets tone up front and warns that abrupt shifts into dark drama backfire {{_Si626-Y_q0#2}} {{_Si626-Y_q0#15}}; Blaseball let its horror tone grow out of what the community responded to {{zO05p-e57AQ#14}}. The choice depends on whether the game is a finished artefact or a live conversation with its players.

### Plain words against rich ones

Paul Dean, Francesco Cottone and Shepard argue for short, plain text and against walls of prose {{nLqLOzrjkYU#1}} {{IPMXeSAvtDs#5}} {{jd7K0EmkvPk#1}}. Julian Day writes deliberate poetry, and Ivy Melinda credits Qud's purple prose with making its world feel alive {{aBbaUSWFQPM#6}} {{db6S2lgTWmI#2}}. The practice the talks share is to keep text on the critical path brief and to put richness where curious players will find it, but how much richness a game can carry before it becomes a wall is a judgement each game makes.

### Optional story that still carries weight

Keenan wants curated story to supply goals and mystery yet stay optional {{G5rq5ei2Lec#0}} {{G5rq5ei2Lec#10}}. Shepard warns that mandatory information placed in optional books may never be read {{jd7K0EmkvPk#2}}, and Jeff Lait believes no player found Vicious Orcs' hidden good ending on their own {{LQPGmxytTws#11}}. Optional story is safe only when nothing the player needs depends on it.

### Unsolved problems

- **Drama against replay and agency.** Rich Wilson calls reconciling a replayable system with a dramatic story, and keeping a player from breaking planned drama, open problems that Prey: Mooncrash sidestepped rather than solved {{wtlLa7BGZcs#12}} {{wtlLa7BGZcs#13}}.
- **Why would anyone care?** Lessard says accessible simulated history does not explain why players would care about thousands of fictional people, and does not claim to have solved it {{D8A9dpITLAU#4}}.
- **Stories buried in the interface.** Kreminski notes that in dense simulations the compelling moments are buried and effectively closed to novices {{oaDI0lWkedg#1}}.
- **Unreliable narrators.** Sherveen Uduwana has found no roguelike that clearly uses repeated runs to give a Rashomon-like story whose objective truth players gradually work out {{_w4yJsRzXBk#7}}.
- **Centring emotion.** Dennis Greger says the conversation about building around genuine emotion is barely happening in games {{50u5_hXZkv4#8}}, and Florence Smith Nicholls finds reality TV's confessional hard to translate into digital play {{MQw3pe-z6JM#6}}.
- **Persistent legends.** Thomas Biskup's idea of a killer resurfacing as a named nemesis in a later game was still on ADOM's to-do list {{iZUXjbcAfYs#28}}.
- **Rewriting what others say.** Courtney Liessen's rewritable NPC lines could be a game of their own and raise questions about rewriting someone's words for a better item {{BRJEK20iM7o#11}}.
- **How far worldbuilding goes.** Robin Mendoza agrees that asking why a dungeon has a shopkeeper unravels into worldbuilding with no obvious place to stop {{ZtXGg6ECwQ8#11}}.

## Checklist

1. What stories do players tell you about their runs, and which of your systems produced them?
2. Do your systems interlock, behave consistently and reward investigation, and is there room left for players to imagine?
3. What could you remove or leave unexplained so the player fills it in?
4. Does your game start players with a situation, keep disrupting it, and remember and call back what they chose?
5. Is there a place, such as a death screen, chronicle or journal, where a run becomes a story the player can keep or retell?
6. What story shape fits your run length, and does the run have a spine?
7. What does death mean in your fiction, does the restart need a reason, and what carries over between runs?
8. Does each mechanic make the player do what the story is about, and does its fiction match it?
9. What would a player conclude about your world from your numbers, categories and generators alone?
10. Can you state your tone in one line, and does every piece of text pass it?
11. Does your setting suggest mechanics and give generated content a shared key?
12. Is your text short where it must be read and rich only where curious players will find it?
13. Is authored story structured so it can be met across runs without branching beyond what you can write?
14. Does the game acknowledge what has happened to each character, including by chance?
15. Do you log, sift and surface the dramatic moments your simulation produces, and have you checked every real symbol, culture or era you borrow?

## See also

- [05. Systems and emergence](05-systems-and-emergence.md): the interlocking systems that emergent stories come from.
- [03. Death, difficulty and progression](03-death-difficulty-and-progression.md): permadeath and metaprogression, the mechanics behind restarts and persistence.
- [08. Monsters, NPCs and AI](08-monsters-npcs-and-ai.md): the agents whose behaviour drives simulated drama.
- [10. Content generation](10-content-generation.md): generating names, text, items and histories.
- [11. Generative methods](11-generative-methods.md): grammars, planners and other techniques behind generated plot.
- [13. Interface and accessibility](13-interface-and-accessibility.md): messages, logs and chronicles that make a simulation's stories legible.
