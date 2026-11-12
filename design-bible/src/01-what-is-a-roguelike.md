# 01. What is a roguelike?

Every roguelike designer runs into the definition argument sooner or later, usually when choosing a store tag or defending a design choice against "that's not a real roguelike". This chapter argues that the argument is worth having only for what it gives you. The talks treat definitions as tools: for being found by the right players, for knowing what you are inheriting, and for deciding which parts of a tightly linked design you are keeping and which you are replacing.

The talks come at the question from several sides. Some trace how the word's meaning has drifted and why no one can fix it. Others reduce the genre to a small core of permadeath, procedural generation and turns, and show that those parts lean on each other. A third group defines the roguelike by the experience it produces: uncertainty, rediscovery, mastery, or a world that does not bend to you. The most recent talks treat it as a layer you can put on almost any genre, and go looking for roguelikes in places nobody built them: randomizer races, baseball, a podcast, a novel.

## In brief

- No one has authority over the word "roguelike", so every definition is personal and contested; several designers advise caring less about whether your game counts and more about whether it is internally consistent and fun {{wwc7pZqs9UA#1}} {{jviNpRGuCIU#16}} {{KKwgKTbiEY0#7}}.
- Strict feature lists such as the Berlin Interpretation risk encouraging copies of the same game, and "games like Rogue" collapses into arbitrariness because you must choose which of Rogue's features count {{wwc7pZqs9UA#7}} {{wwc7pZqs9UA#2}}.
- The practical reason a label still matters is discoverability, and because store tags tell buyers little, you should state plainly whether your game is turn-based and what carries over between runs {{wwc7pZqs9UA#0}} {{wwc7pZqs9UA#13}} {{IliQZm5Itng#5}}.
- Independent definitions converge on permadeath (permanent consequences) and turn-based play, most adding procedural generation or controlled randomness; Santiago Zapata traces his version of this core back to Dungeons & Dragons {{ZMdxP7fO6wE#0}} {{wwc7pZqs9UA#11}} {{EMb6B2cIJps#0}} {{dJbUmDsyJRw#0}}.
- The core features form a package: permadeath forces replaying the start, which needs procedural generation for variety, whose uneven difficulty needs consumables, which need turns to use, so if you remove one you must decide what does its job {{tg-CjNodlmY#6}}.
- Max Kreminski, following Kate Compton, defines a genre as a set of mutually supportive design patterns that shore up each other's weaknesses, so adopting a few of them tends to pull a design toward the rest {{TvlZinAvpwg#3}} {{BDcZSWHu8RQ#15}}.
- Describing a roguelike by its mechanics (hard, permadeath, procedural dungeons) can repel players who would love it; describe the experience instead, and remember that fit depends more on the player's motivation than on the game's quality {{BjqZdMW8U9Q#0}} {{BjqZdMW8U9Q#15}}.
- Roguelikes split between mastery of a challenge and immersion in a simulated world that exists for its own sake {{wOlSws-OI2o#5}} {{TvlZinAvpwg#1}} {{4-7TtPX5uhg#2}}, and George Moromisato suggests that the qualities he contrasts between NetHack and AAA games, mastery among them, are sliders a designer sets rather than a binary choice {{QBZkvtGucBU#0}} {{QBZkvtGucBU#14}}.
- Designers across genres now treat "roguelike" as a layer you can add to any game, and Shawn Main's test for it is mutually exclusive choices that grow your power, varied and escalating challenges, and a run that ends {{WLBJJTc6LWI#0}} {{WLBJJTc6LWI#1}} {{tWFIQaeSs6M#1}} {{ujKlmvfpNMo#0}}.
- The genre is far from exhausted: non-violent, cozy, party-based multiplayer and narrative-driven roguelikes are all named as under-explored ground {{pYtlU9wGopo#1}} {{-MX1imoSxTg#7}} {{neuJCYmbAG8#0}} {{_w4yJsRzXBk#8}}.

## No one owns the word: what definitions are for

Start from the fact that settles most arguments before they begin: nobody is in charge of the word. Santiago Zapata points out that "roguelike" is not like a technical standard such as HTTP 1.1; there is no governing authority that can rule on it, so every definition is personal, evolving and challenged the moment it is proposed {{wwc7pZqs9UA#1}}. If you want to know what a definition is good for, you have to ask what job you want it to do.

### The word has already changed meaning

The definitions people now treat as traditional are not the original ones. Zapata digs out a 1990s Usenet FAQ that described roguelikes as free, single-user fantasy role-playing games set in a dungeon with a character-graphic interface, and explicitly excluded commercial, multi-user, puzzle and text adventure games {{wwc7pZqs9UA#5}}. Those early definitions say nothing about turn-based play, permadeath or procedural generation. The emphasis was on presentation and distribution, and usage has since moved to game-design features, which leads Zapata to doubt the historical definition is much use today {{wwc7pZqs9UA#6}}.

Even the umbrella term was an accident of community logistics. In Zapata's account of Moria, Angband's popularity as an advanced Moria-like split discussion out of the Moria newsgroup and prompted an umbrella group for similar games, which is what triggered "roguelike" as a collective name {{y6WCq0jYbHo#7}}. And the loosening that purists lament coincided with growth: Zapata notes, with some irony, that the lack of a strict definition went along with a boom in procedural games and much wider awareness, where in the 2000s most roguelike players were also developers; competition raised production values and pushed developers away from unusable interfaces {{wwc7pZqs9UA#8}}.

### The case against strict definitions

Most talks that address definitions argue against treating them as rules. Zapata gives two reasons. A feature list such as the Berlin Interpretation (a 2008 list of genre factors derived from five canonical roguelikes) or Temple of the Roguelike's 13 features risks blocking innovation by encouraging copies of the same game, even though the Berlin Interpretation was meant for studying games rather than gatekeeping {{wwc7pZqs9UA#7}}. The literal alternative, "games like Rogue", collapses into arbitrariness: you have to choose which of Rogue's features count (must it run on Unix mainframes? must it have item identification?), and in the end every game is like Rogue in some way {{wwc7pZqs9UA#2}}.

Designers talking about their own practice land in the same place. Josh Ge tells developers not to worry about whether their game strictly counts, because what matters is that the design is internally consistent with your own plan {{jviNpRGuCIU#16}}. Matt Ritchie, echoing an earlier speaker, warns against making a roguelike just to make one: make a fun game with your own spin, inspired by roguelikes if you like {{KKwgKTbiEY0#7}}.

> There are as many definitions as there are players. {{jviNpRGuCIU#16}}

Some speakers go further and argue for breadth as a design tool. Nick Cummings says an expansive definition is the best one for him because it trains you to find surprising, imperfect systems in mundane activities that could become roguelikes; systems that look predictable reveal "wobbly, unpredictable" joy when you look closely {{R8DSq8qSJ44@2704#6}}. On the Rise of the Roguelite panel, host Alexei relayed the idea that roguelikes might be better thought of as a poetic form than a genre, since many genres are placed into a roguelike framing while keeping their own identity, and said the conference is not interested in a "Berlin Interpretation 2.0" but in non-gatekeeping discussion of what people like about roguelikes {{ujKlmvfpNMo#1}}.

### The one practical reason to keep a definition: being found

Against all this, Zapata gives one concrete reason a definition still matters, and it is a commercial one: discoverability. Players looking for turn-based games where they can take their time find Steam and app stores flooded with shooters and action games under the same label {{wwc7pZqs9UA#0}}. That is a labelling problem, and the marketplace has answered it with more labels.

Zapata prefers "action roguelike" to "roguelite", because "roguelite" implies a lesser, more casual game while "action roguelike" clearly signals real-time play. He finds "roguelike-like" circular, "procedural death labyrinth" too narrow, and "roguelike elements" or "procedural" accurate but broad {{wwc7pZqs9UA#10}}. Developers do not all agree on what the "lite" means. Arvi Teikari explains that Noita called itself a roguelite precisely to honour the traditional ASCII, turn-based, top-down roguelikes (NetHack, Dungeon Crawl, ADOM, Angband, IVAN) and set itself apart from them, alongside action games like Spelunky and The Binding of Isaac {{huMHQGr8PgM#16}}. Andrea Interguglielmi's team took the opposite route with Nauticrawl: it blended Brogue, X-Wing cockpit simulation, A Dark Room and The Room so thoroughly that they dropped the roguelike tag entirely and avoided "roguelite" too {{wxmio1S3iN0#0}}.

Scott Burger's Steam data shows why the tag on its own tells a buyer little. A Steam roguelike search returns games as far apart as real-time Don't Starve Together and turn-based Caves of Qud, which his tag-proportion similarity metric rates only 18.3% similar, against 96% for two survivor-likes (Boneraiser Minions and Vampire Survivors) and 80% for Tales of Maj'Eyal and Shattered Pixel Dungeon {{IliQZm5Itng#5}}. Over time the roguelike tag's dominance has fallen and converged with roguelite and action roguelike: for 2023 releases the average share of tag votes was about 4% roguelike, 3.9% action roguelike and 3.7% roguelite. Developers more often pair "roguelike" with "deckbuilder" than use the combined tag, and among traditional roguelikes the roguelike and traditional roguelike tags move together {{IliQZm5Itng#8}}.

One axis the labels miss entirely is what happens when you die. In Q&A an audience member told Zapata that meta-progression (permanent unlocks or upgrades carried between runs) bothered them more than real-time play, and that "action roguelike" says nothing about it. Zapata agreed it is hard to see from screenshots, unlike turn-based versus real-time, and suggested developers describe their model for handling non-permanent consequences when they label a game {{wwc7pZqs9UA#13}}.

**In practice.** Choose your label for the player you want to reach, not to win an argument. Whatever tag you use, tell players plainly whether the game is turn-based or real-time, what death costs, and what, if anything, carries over between runs; those three facts are what genre tags fail to convey {{wwc7pZqs9UA#0}} {{wwc7pZqs9UA#13}}.

If labels are negotiable, the next question is what sits underneath them: which features keep turning up when people try to say what a roguelike is.

## The core package: permadeath, procedural generation and turns

Feature lists vary, but they keep returning to a small core. The useful insight in the talks is not which features belong on the list but that the core features depend on each other: take one away and something else has to do its job.

### Converging on a small core

Zapata traces the four features of a traditional roguelike (permanent consequences, character-centric play, turn-based play and procedural content) back to Dungeons & Dragons, the shared interest of the early developers. A tabletop session cannot roll back what happened; D&D turned wargame squads into one character per player; turns came from wargames and the practical need to order players around a game master {{ZMdxP7fO6wE#0}}. For his own working definition of a classic-style roguelike he cuts his list of 13 features down to three: turn-based, permanent consequences, procedural content {{wwc7pZqs9UA#11}}.

Others arrive at overlapping sets. Martin Pichlmair lists the canonical traits as controlled randomness (it "has to be some random", not random all over), grid-based movement, turn-based play and permadeath. He adds that permadeath implies no meta-progression, since if death is permanent there is nowhere to keep progress, and so the game must be beatable in a single run {{EMb6B2cIJps#0}}. Chris McCormick's minimal roguelike keeps turn-based play, permadeath, entities with attributes, collecting things and fighting enemies, with interesting situations arising from the interaction of those attributes {{dJbUmDsyJRw#0}}.

### Why the features come as a package

The strongest argument here is bhauth's, from a talk on Dungeon Crawl Stone Soup. He defines a roguelike as permadeath, procedural generation, consumable resources, discrete actions and random results, and shows how they hold each other up. Permadeath means playing the start over and over, so procedural generation is needed to keep that from being repetitive. Procedural generation produces uneven difficulty, because less thought and testing go into any particular level, and because permadeath stops players smoothing difficulty by replaying hard parts, consumables do the smoothing instead. Turn-based play gives you time to use those consumables, and lets you slow down in hard parts {{tg-CjNodlmY#6}}.

> Permadeath means playing the start repeatedly and procedural generation is needed to keep that from being repetitive. {{tg-CjNodlmY#6}}

### What the package is for

Several speakers look past the features to what they produce. Nick Montfort, comparing roguelikes with concrete poetry and other spatial text art, says Rogue's unique contribution is boundless generation: endlessly generated landscapes that form an interactive, explorable architecture and make players think about underlying rules, where earlier work offered a single handmade panel {{blXH5pO8GA4#8}}. Zapata frames Rogue as a simple, rather boring automated Dungeon Master, one that does all the computation, is always available and needs no friends to run a session, and reads the genre's whole history (for single-player games at least) as an attempt to build a better private Dungeon Master {{ZMdxP7fO6wE#2}}.

Tyriq Plummer offers a way to measure this rather than tick boxes. He grades games along four dimensions: procedural space, emergent complex situations, the possibility of strategic and tactical forethought, and permanence of consequence. They are dimensions, not checkboxes, and permanence covers more than permadeath: micro-decisions that change a run's trajectory and one-chance opportunities count too {{OVSi3NzA0KM#1}}. Applied, it separates games that share a surface. Downwell has procedural levels but little emergence, and its upgrade choices happen in a safe zone away from any situational context, so Plummer calls it a platformer shooter with only a tinge of roguelike; Catacomb Kids, with more complex generation, emergent situations, rewards for planning ahead and long-lasting choices, sits much further along {{OVSi3NzA0KM#2}}.

Stripping the form down is another way to see the core. Lee Tusman builds one-dimensional dungeons because reducing a roguelike to a single dimension exposes the genre and its procedural generation at their innermost parts and makes the systems quick to grasp {{-e4gF_SKWPk#0}}.

### Where the package breaks

Boundary cases show what happens when parts are missing. McCormick's first game, written on an Apple IIe at age eight, had an X avoiding an O; it was turn-based, but he offers it as an example of going too minimal to call it a roguelike {{dJbUmDsyJRw#2}}. Dan Norder counts the BASIC game Chase as a proto-roguelike because it is top-down, turn-based, map-based, randomly placed and has permadeath, but it lacks inventory, stats, true procedural generation and conventional combat; its randomness is "too random", throwing objects wherever they land, and there are no multiple ways to do things {{ohH6LBM2EiU#0}}. In the Hack talk, Dan Stormont reports that Beneath Apple Manor, often named as a roguelike before Rogue, plays more like a text dungeon crawler such as Telengard: death takes many runs to happen and players can save-scum around it, so meaningful permadeath is missing, and in his view Rogue set the standard later games followed {{R8DSq8qSJ44@24276#0}}.

Each failure lines up with a missing link in bhauth's chain: no stakes from death, no structured variety, nothing to manage. Michael Brough, for his part, tells roguelike designers to play Rogue and read the fiction and tabletop games it came from. You can only judge what a work added, or whether it is merely derivative, if you know its sources, and it is odd to name a genre after Rogue while not knowing its details {{JpX2wWwhKdE#4}}.

**In practice.** Treat permadeath, procedural generation, consumables and turns as one system {{tg-CjNodlmY#6}}. If you drop one, name the job it was doing (variety on replay, smoothing uneven difficulty, time to think) and decide what in your design does that job now. Use Plummer's four dimensions to locate your game honestly, rather than asking whether it qualifies {{OVSi3NzA0KM#1}}.

Plummer's dimensions and Montfort's "think about underlying rules" already point past the machine to what it feels like to play, which is where the next group of talks starts.

## Defining by experience: uncertainty, mastery and worlds

Feature lists describe the machine. Players buy the experience, and several talks argue that the feature list is a bad way to sell, and even to design, a roguelike.

### Features repel the players you want

Lisa Brown wrote off roguelikes for years because they were described to her as very hard, full of constant failure, procedural dungeons and permadeath. They later became favourites. A Twitter poll showed players still describe the genre by features (run-based, randomness, permadeath, limited carryover, exploring the unknown), and Brown says that would not have reached her past self, because it says nothing about the experience {{BjqZdMW8U9Q#0}}. Her corollary matters for designers too: if a player dislikes an acclaimed roguelike such as FTL or Into the Breach, that does not mean it is badly designed. It serves a different player motivation, and fit depends more on the player than on the game {{BjqZdMW8U9Q#15}}.

> It is more about the player than the game. {{BjqZdMW8U9Q#15}}

### Uncertainty and rediscovery

When speakers define the genre by experience, several converge on uncertainty. Nick Cummings argues that structure alone cannot capture a roguelike; what makes one is systems that keep surprising players through procedurally arising situations. His examples are baseball's edge cases: a ball wedged in the outfield wall is scored a double, and a ball that leaves the park after bouncing off a fielder's head is a home run {{R8DSq8qSJ44@2704#2}}. Younès Rabii argues that the fan-made Pokemon Glitch is at least half a roguelike because it has so much uncertainty that even players who know the original rediscover the game, plus permadeath in unlikely places {{Ove6z8zDsjE#10}}.

Darren Grey reads the uncertainty into the genre's name. Rogue is not Hero Quest: you play a relatively weak character who can easily die and must rely on cunning, surrounded by unknowns and threats, and Grey asks how games can make the player feel like an actual rogue {{tmrYfnMrifw#0}}. He shows how Rogue does it: you start weak; item identification, line of sight and procedural generation surround you with unknowns; and the hunger clock means you are never safe and must keep moving, to the point that you can starve to death clutching a powerful item {{C2sm-z7Ag4U#2}}.

### The axis that divides the genre: mastery or world

Once you define by experience, the genre splits along a recognisable line. George Moromisato draws a related line between roguelikes and other games: he contrasts NetHack with AAA games of its era such as Ultima: interactive immersion versus graphical immersion, variety versus quality, mastery versus a one-time experience. He insists neither is better; roguelikes like NetHack and Dwarf Fortress care that objects behave as you expect when you manipulate them, not that the world looks real {{QBZkvtGucBU#0}}. Asked whether these qualities can be mixed, he said he thought they were sliders rather than binary choices, that interactive immersion reinforces mastery, and that you don't want low quality in large quantity either {{QBZkvtGucBU#14}}.

Within roguelikes themselves, Zeno Rogue names two approaches: mastery and challenge, or simulating an immersive complex world in the vein of Dwarf Fortress or Caves of Qud. He designs HyperRogue for mastery, with its complexity coming from mathematics rather than world simulation {{wOlSws-OI2o#5}}. Max Kreminski describes the other pole: what he finds distinctive about roguelikes is that procedural generation is necessary to their design, that they don't bend over backwards to serve the player, and that they try hard to be worlds that exist independently {{TvlZinAvpwg#1}}. He sorts games into contests or rituals (repeated actions), stories (an author telling a mostly linear story) and worlds (a window into a parallel world that keeps existing when you aren't looking), admits the framework was improvised and has awkward overlaps, and says world-games benefit most from deep procedural content and AI {{TvlZinAvpwg#2}}.

Tarn Adams ties the axis to the genre's favourite word. Replayability means different things to different roguelike players (mastering intricate interactions in the NetHack style, being surprised, inhabiting a single-player world), so your definition of replayability reveals your flavour of roguelike {{4-7TtPX5uhg#2}}.

### Goals decide whether mastery applies

Which side you choose changes what kind of analysis is useful. Nicholas Feinberg says optimal-play thinking applies to roguelikes built on tactical and strategic choices and to any part of a game with clear goals, but matters less for IVAN, which he calls essentially a cruel prank on the player, or Dwarf Fortress adventure mode, a story-generation tool with no way to win; even there, individual battles have tactical goals, so the lens still applies to those parts {{b8uoQHedFV0#5}}. Kawa makes the underlying point: a toy becomes a game when you add win and loss conditions that test a skill, and as players master the skill the rules get refined to stay challenging {{KLHJsJuJfYg#9}}.

For the mastery side, Tabea Iseli lists what keeps the formula compelling: anticipation of the next draw, hoping your build components click, living on the edge, and, for roguelites, progress even on failure. Her team kept exactly these while moving the genre out of the dark dungeon into a cozy setting for Grimoire Groves {{-MX1imoSxTg#0}}.

**In practice.** Decide which experience you are delivering: mastery of a challenge with clear goals, a world that does not bend to the player, or a deliberate mix; Moromisato treats such design contrasts as sliders rather than binary choices {{QBZkvtGucBU#14}}. Then describe the game in those terms, what it feels like to play, rather than as a list of mechanics that may scare off the players who would love it {{BjqZdMW8U9Q#0}}.

Iseli's move, keeping the experience while changing the setting and audience, is one instance of a broader pattern: carrying the roguelike into other genres altogether.

## A framework you can carry into any genre

Several talks from 2021 onward treat "roguelike" less as a genre than as a layer you can apply to another genre {{WLBJJTc6LWI#0}} {{tWFIQaeSs6M#1}} {{ujKlmvfpNMo#0}}. The most usable version of that framework comes with a test you can run on your own design, and the reasons it holds together explain why adopting part of it tends to pull in the rest.

### The framework definition

Shawn Main proposes treating a roguelike as a framework: a game whose core loop uses procedurality to increasingly challenge the player as they grow in power across a run. He admits reasonable people could dispute every word, but its value is that designers in other genres can apply it to add replayability {{WLBJJTc6LWI#0}}. He breaks it into three components:

- **Inconsistent, meaningful choices that grow the player's power.** The player should not get everything; decisions should be mutually exclusive, sword or shield, left or right.
- **Inconsistent, escalating challenges that test those choices.**
- **A finite run structure.** Runs end in success or failure, and a new run means a new series of choices.

"Inconsistent" is the key word in the first two, because that is where procedurality enters {{WLBJJTc6LWI#1}}.

Main's examples show how the test works. Super Mario Bros. is not a roguelike because its runs are consistent and its content can be exhausted. Spelunky applies the same platformer structure inconsistently: you cannot anticipate secrets or the jump you will need, and power-ups vary, so lots of bombs lets you skip sections in one run and a shotgun lets you fight aggressively in another. A collectible card game has inconsistent challenges, because the opponent is unpredictable, but lacks mutually exclusive choices, because you can freely adapt your deck; Dream Quest brought dungeon structure to deckbuilding, followed by Slay the Spire {{WLBJJTc6LWI#4}}.

### Independent convergence on "roguelike as a layer"

Developers working in quite different genres describe the same move. Michał Ogłoziński says Against the Storm's team treats "roguelite" the way games treat "RPG elements": once you identify what makes a game feel roguelike, you can transplant those elements into any genre, in their case a simple city-builder prototype {{tWFIQaeSs6M#1}}. Marc Dolgin, on the Rise of the Roguelite panel, calls the roguelike pretty much a sub-genre that developers can place any other genre on top of, producing pinball and Peggle-style roguelikes, which is why working out what makes a roguelike interesting matters {{ujKlmvfpNMo#0}}.

droqen comes at it from the other end. He removes procedural generation and permadeath, usually assumed to be the core, from the Berlin Interpretation and finds that the "low-value" factors left over still capture much of what is beautiful about roguelikes; he pairs those six factors into three concepts and calls his own game a "low-value roguelike" {{6Whz8bvjAKo#0}}. Read beside Main, this suggests the layer can be cut more than one way: Main keeps procedurality as essential, droqen shows that a roguelike feel survives without it. Which cut suits you is a design decision, not a matter of qualifying for the label.

### Why the layer pulls you in

Max Kreminski, crediting Kate Compton, defines a genre as a collection of mutually supportive design patterns that shore up each other's weaknesses. Adopting a few pulls you toward the rest, which makes genres attractors in design space {{TvlZinAvpwg#3}}. Adding one pattern makes it sensible to add the next until they reinforce one another {{BDcZSWHu8RQ#15}}. This is the general form of bhauth's package argument in the previous section: if you bring in permadeath, the other features follow because each fixes a problem the last one created.

The pull is something to manage, not just accept. Sébastien Benard describes how Dead Cells, pitched as "Castlevania you can play again and again", was deliberately built as a roguelite on three pillars (random levels, loot and random encounters) with everything subordinate to combat; they chose roguelite over roguelike because their free-to-play background was about getting players to play again {{QbTnKvRrNYY#2}}. Leonard Richardson points out that the layer can also carry the genre's least popular features to success: Derek Yu's Spelunky became a hit in 2009 by bringing two of the least popular roguelike features, permadeath and extreme randomness, into a then-unpopular genre {{ntVjLNl2_ro#8}}.

### How much to borrow

Tyler Coleman gives the practical rule. A game should be roughly 80% familiar foundation (controls, interface, camera, genre tropes and expectations) and 20% unique; the familiar part is the structural integrity that makes the game accessible, and the 20% you do differently from every other game in the genre is what makes it stand out {{C6jR41fZjqM#3}}. Go to either extreme and you fail differently: 100% familiar gives you a clone, fine for students learning but legally and ethically dicey for profit, while avoiding all familiarity gives you a "game maker's game" that is praised as ahead of its time but struggles to reach a broad audience, as Coleman thinks Façade did {{C6jR41fZjqM#4}}.

> First game is innovative, second is a clone, third is a genre. {{C6jR41fZjqM#4}}

**In practice.** If you are adding the roguelike layer to another genre, check your design against Main's three components: are choices mutually exclusive, do challenges vary and escalate, does the run end {{WLBJJTc6LWI#1}}? Expect each pattern you adopt to invite the next {{TvlZinAvpwg#3}}, decide like Dead Cells which pillar everything else serves {{QbTnKvRrNYY#2}}, and spend your novelty on the 20% that makes the game yours {{C6jR41fZjqM#3}}.

## Frontiers: beyond combat, beyond solo play, beyond games

If the core is portable, the genre is far from exhausted. Sherveen Uduwana rejects the idea that roguelikes are overdone: much new ground remains unbroken, especially in narrative. He suggests an exercise: when a story seems not to work as a game, ask whether it would work better as a roguelike {{_w4yJsRzXBk#8}}. The talks point to three directions that remain open, and to what non-game cases reveal about the core.

### Beyond combat

Ludipe defines a pacifist roguelike strictly: conflict is not resolved through violence of any kind, including cute or abstract bump combat. Games like Invisible, Inc. that allow non-violent runs, or games where you support an entity that fights, are grey areas; his personal bar is that combat be around 5% of the game or an isolated event, not merely an optional pacifist route {{pYtlU9wGopo#0}}. He argues the genre should explore non-violent designs more, both for variety, since pacifist roguelikes are a tiny fraction of a combat-heavy genre, and to draw more players in {{pYtlU9wGopo#1}}. Tabea Iseli reaches the same conclusion from the market side: the genre is versatile enough for non-violent and cozy reinventions, and the cozy crowd will embrace roguelikes made for it, citing a non-violent farming roguelike, a roguelike about dog shows and Dave the Diver {{-MX1imoSxTg#7}}.

### Beyond solo play

Tyriq Plummer calls party-based multiplayer an under-explored space for traditional roguelikes, even though Rogue's tabletop inspirations centre on teamwork. JRPGs and first-person dungeon crawlers kept the adventuring party as single-player games; roguelikes did not, and a lone delver hungry for godlike power is, he says, more like a supervillain than a hero {{neuJCYmbAG8#0}}. Leif Bloomquist's Commodore 64 multiplayer roguelike shows what happens to the core when you add other players in real time: networking makes it real-time rather than turn-based, it runs as one persistent shared instance where dropped items stay for weeks and monsters keep moving with no one connected, and he admits it may be closer to a MUD (multi-user dungeon) {{Y0K-e83wYnQ#0}}. Multiplayer puts pressure on turns and on per-run worlds, two parts of the package.

### Neglected features

The frontier also runs backwards. Leonard Richardson says robotfindskitten succeeded by building a game around parts of early roguelikes usually regarded as misfeatures, which "real designers" generally don't borrow {{ntVjLNl2_ro#1}}; Spelunky's revival of permadeath and extreme randomness, described in the previous section, is the same move in a hit game.

### Beyond games: the roguelike lens

Looking at non-games through the roguelike lens is a way to learn which features carry the experience. Several talks find the features outside the genre.

- **Procedurally generated routes.** Stella Mazeika argues randomizers qualify as roguelikes, dropping turn-based and tile-based criteria: shuffled key items create a procedurally generated route through a fixed map, so an early item may open an area normally visited sixth and force a new exploration order {{C7laugXEc9s#6}}. In randomizer racing, permadeath applies to the run rather than the character: a blind seed is played once, abandoning it ends it, and the next race rolls a new seed {{C7laugXEc9s#7}}.
- **Once-only permanence.** Jeff Emtman and Martin Austwick's podcast Neutrinowatch generates a new version each day that exists once and is then deleted forever. Austwick compares this to roguelike playthroughs: each listener's experience differs, but it is still the same work {{1sZlIfCcz_c#10}}.
- **Familiar structure, endless variation.** Nick Cummings checks baseball against the Berlin Interpretation and finds random environments (stadiums, weather) and a kind of permadeath (every game starts at nil-nil, every season at an even record, every player ages, retires and dies), while warning that rigid definitions lead to frustration {{R8DSq8qSJ44@2704#1}}. Nic Junius, drawing on Jason Grinblat's term, calls Caves of Qud and Macbeth both "story volumes": generative spaces you revisit to find something new in the familiar, where one production or one run cannot reveal all the possibilities {{cDxL6JoxYQc#4}}.
- **The meta-progression debate.** Younès Rabii finds the community's argument about pure permadeath versus progression shortcuts inside the novel La Horde du Contrevent: flying ships could carry the horde halfway, but the horde believes skipping the first half would leave them without the experience to survive the second, so they start from the bottom every time {{6ik6jB2YhZg#3}}.

> Your particular play through is different from other people's but you still played the same game. {{1sZlIfCcz_c#10}}

The cases that fail are as instructive. Jamie Brew parodies the Berlin Interpretation with a "Brooklyn interpretation" of karaoke (well-known songs, lyrics on screen, technology assistance, something you can practise and improve at) and concludes that his procedurally regenerated karaoke fails the practice test because it is different every time, making it a "roguelike karaoke style flavored beverage" {{685wpSUVw9s#1}}.

Taken together, the outside cases point to three things that make runs worth repeating: a familiar structure with varied routes through it {{C7laugXEc9s#6}} {{cDxL6JoxYQc#4}}, outcomes that are permanent for that run {{C7laugXEc9s#7}} {{1sZlIfCcz_c#10}}, and skill that carries across runs even when nothing else does {{685wpSUVw9s#1}}. Variety alone, as Brew's karaoke shows, is not enough.

**In practice.** Look for an under-served audience (non-violent, cozy, cooperative) or a feature the genre has neglected {{pYtlU9wGopo#1}} {{-MX1imoSxTg#7}} {{neuJCYmbAG8#0}} {{ntVjLNl2_ro#1}}. Then test the idea against what makes runs worth repeating: can players get better at it, does each run's outcome stick, and does the familiar structure keep producing new routes?

## Tensions and open questions

**What the "lite" in roguelite means.** Zapata avoids "roguelite" because it implies a lesser, more casual game, and prefers "action roguelike" because it says plainly that the game is real-time {{wwc7pZqs9UA#10}}. Noita's developers chose "roguelite" for the opposite reason, as a mark of respect that leaves the word "roguelike" to the ASCII, turn-based tradition {{huMHQGr8PgM#16}}. Nauticrawl dropped both {{wxmio1S3iN0#0}}, and Burger's data shows the three tags drawing almost equal shares of tag votes among 2023 releases {{IliQZm5Itng#8}}. Which word is right depends on which players you want to find you and what they will read into it; none of the talks settles it.

**Is procedural generation essential?** Shawn Main builds his framework on procedurality: "inconsistent" choices and challenges are where it enters {{WLBJJTc6LWI#0}} {{WLBJJTc6LWI#1}}. Kreminski likewise calls procedural generation necessary to roguelike design {{TvlZinAvpwg#1}}, and bhauth's package starts from permadeath and needs procgen to make it bearable {{tg-CjNodlmY#6}}. droqen strips out both procedural generation and permadeath and still finds a roguelike feel in what is left {{6Whz8bvjAKo#0}}; Mazeika, by contrast, drops turn-based and tile-based criteria to admit randomizers but keeps procedural generation, in the form of a shuffled route through a fixed map {{C7laugXEc9s#6}}. The choice depends on which job you think the feature does: if you keep permadeath, the package argument says you need something to vary the replay; if you drop permadeath, the case for procgen weakens.

**Permadeath or meta-progression.** Pichlmair's canonical reading says permadeath implies no meta-progression and a game beatable in one run {{EMb6B2cIJps#0}}. Iseli counts progress even on failure as part of what makes roguelites compelling {{-MX1imoSxTg#0}}, and Dead Cells chose roguelite deliberately because the team's background was in getting players to play again {{QbTnKvRrNYY#2}}. La Horde du Contrevent stages the same argument in fiction, with its characters choosing to start from the bottom because the early journey is what prepares them {{6ik6jB2YhZg#3}}. The one practical point on offer comes from a Q&A exchange with Zapata: players care, and cannot see your choice from a screenshot, so you should state it {{wwc7pZqs9UA#13}}.

**Mastery or world.** Moromisato's NetHack is about mastery and variety {{QBZkvtGucBU#0}}; Zeno Rogue designs HyperRogue for mastery {{wOlSws-OI2o#5}}; Kreminski values roguelikes as worlds that exist independently of the player {{TvlZinAvpwg#1}}; Feinberg notes that optimal-play analysis loses its grip in games without clear goals {{b8uoQHedFV0#5}}. Moromisato suspects his own contrasts (mastery versus one-time experience, variety versus quality) are sliders rather than a binary, but said in Q&A he did not know for sure {{QBZkvtGucBU#14}}. How to mix them without getting the worst of both is open; Adams's point that each flavour means something different by "replayability" suggests deciding which one your players came for {{4-7TtPX5uhg#2}}.

**Should there be a definition at all?** On the Rise of the Roguelite panel, host Alexei relayed the idea of treating the roguelike as a poetic form rather than a genre and said the conference was not interested in a "Berlin Interpretation 2.0" {{ujKlmvfpNMo#1}}; Cummings finds an expansive definition the most productive {{R8DSq8qSJ44@2704#6}}. Zapata, who agrees that no one owns the word, still holds that players need a definition to find the games they want {{wwc7pZqs9UA#0}}. The tension is between a definition for designing (where breadth helps) and one for shopping (where precision helps), and the talks leave it there.

**Multiplayer without breaking the package.** Plummer argues party play is under-explored and true to Rogue's tabletop roots {{neuJCYmbAG8#0}}, but Bloomquist's game shows networking pushing out turns and per-run worlds until the result resembles a MUD {{Y0K-e83wYnQ#0}}. How to keep turns, permanence and a fresh world per run with several players is unsolved in these talks.

## Checklist

- Who do you want to find your game, and does your store label reach them rather than win an argument?
- Have you told players plainly whether the game is turn-based or real-time, what death costs, and what carries over between runs?
- Which of permadeath, procedural generation, consumables and turns does your game keep, and for each one you dropped, what now does its job?
- If death is permanent, what makes replaying the start bearable, and what smooths the uneven difficulty your generator produces?
- Where does your game sit on Plummer's four dimensions: procedural space, emergent situations, room for forethought, and permanence of consequence?
- Have you played Rogue and the games you are drawing on closely enough to know what you are adding and what you are merely inheriting?
- Does your pitch describe what it feels like to play, or a list of mechanics that may scare off the players who would love it?
- Is your game mainly about mastering a challenge, about inhabiting a world that does not bend to the player, or a deliberate mix, and does every system serve that choice?
- Does the player face real uncertainty, and is there something that keeps them moving rather than waiting it out?
- Are your choices mutually exclusive, do your challenges vary and escalate, and does each run end?
- Which pillar does everything else in the design serve?
- Is roughly 80% of the game familiar, and is the remaining 20% where you spent your novelty?
- Is there an under-served audience or a neglected feature (non-violent, cozy, cooperative, narrative) your design could serve?
- Can players get better at your game across runs, or is it only different each time?

## See also

- [02. History and lineage](02-history-and-lineage.md): the D&D roots, Beneath Apple Manor, Chase and the Moria/Angband split in full.
- [03. Death, difficulty and progression](03-death-difficulty-and-progression.md): the permadeath versus meta-progression choice in depth.
- [04. Learning and discovery](04-learning-and-discovery.md): mastery across runs and the player motivations behind it.
- [05. Systems and emergence](05-systems-and-emergence.md): the surprising, interacting systems that experiential definitions point to.
- [12. Narrative and worldbuilding](12-narrative-and-worldbuilding.md): roguelikes as worlds and the unbroken narrative ground.
- [18. Beyond roguelikes](18-beyond-roguelikes.md): carrying the roguelike lens into other genres and non-games.
