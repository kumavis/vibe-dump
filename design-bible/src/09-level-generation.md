# 09. Level generation

This chapter is about the spaces a roguelike generates: the rooms, caves, mazes and worlds the player moves through, how they are built, how they are checked, how they are furnished and how they join into a run. A generator that only produces variety is not enough; the talks keep returning to what a layout is for, what it has to fit, and what keeps one level from tasting like the next.

The talks approach the subject from both ends. Some are close to engineering, with algorithms, data structures and the parameters that made them work. Others are about design: why a level should exist, how much of it a human should author, and when a confusing or boring space is the right call. Their common thread is structure before detail: decide what a level must do, give the generator a plan and authored pieces where judgement matters, validate the result, and vary it along a few large axes.

## In brief

- Random levels move the skill curve from memorising routes to mastering the game's systems and adapting to what you are given, a case two talks make independently {{Uo9-IcHhq_w#0}} {{TlLIOgWYVpI#0}}.
- A layout matters only if it creates decisions: if its contents do not challenge the player, the shape is meaningless, so design space as overlapping zones of different advantages, readable terrain and layered choices {{KY-TmRw5sR8#5}} {{lfb6uehmrWo#10}} {{FaLUhh_Vfmk#0}} {{TeURjrAYFEU#13}}.
- Several teams and practitioners favour hand-authored pieces assembled procedurally over space generated from scratch, especially for platformers, where gravity makes generated jumps hard to get right {{QbTnKvRrNYY#3}} {{QbTnKvRrNYY#5}} {{CLi4PWxDmAI#6}} {{6U8c6hbVJLY#7}} {{rIB0y_kwFuY#3}} {{mYMdMAvTHpo#8}}.
- Size and shape levels from the game's movement rules, systems and player count, not from what the generator can produce: check corridor widths against your largest or oddest mover, and prefer small, dense spaces where traversal itself is the play or players must stay together {{l1YEJBKehAY#3}} {{vtU3Xa0ShKw#15}} {{3S6uRMCdvNs#6}} {{OVSi3NzA0KM#16}} {{UNBAoc0TJSs#3}} {{R8DSq8qSJ44@32392#5}}.
- You rarely need just one layout algorithm; combining families, with a pre-pass that decides which goes where, gives large-scale structure and can make a map tell a story {{TlLIOgWYVpI#11}} {{R8DSq8qSJ44@18888#0}} {{fnFj3dOKcIQ#8}}.
- Give the generator a plan above the tile level, usually a graph of locks, keys, branches and set pieces, but plan space rather than the sequence of events, because fully pre-planned levels collapse when the player deviates {{NjIduRLJL7U#9}} {{b2VkgcC1xRc#7}} {{_s-Tn0biyEk#10}} {{QbTnKvRrNYY#8}} {{NjIduRLJL7U#12}}.
- Trees of rooms and perfect mazes force backtracking and a single route; adding loops where path distance is long turns a level into a space of choices {{Uo9-IcHhq_w#3}} {{b45orGdFwi0#14}}.
- Validate every level with flood fills and pathfinding that use the real movement rules, and either cull, connect or reject what fails {{5PF9RB0_ifM#5}} {{TlLIOgWYVpI#14}} {{fnFj3dOKcIQ#9}} {{Uo9-IcHhq_w#4}} {{Uo9-IcHhq_w#14}}.
- Item gates need their own checks: circular dependencies make a game unbeatable, and giving each gate more than one solution is insurance {{C7laugXEc9s#4}} {{NlxGPKV0PrY#17}} {{NlxGPKV0PrY#16}}.
- Endless small variation tastes like oatmeal; make variation chunkier, so each level commits to a dominant hazard, biome or landmark a player could name it by {{wtlLa7BGZcs#9}} {{FC9GAL2piJI#16}} {{MHEkE7nPuZc#12}} {{MHEkE7nPuZc#4}} {{vtU3Xa0ShKw#17}}.

## What a generated level is for

### Why generate levels at all

The oldest argument for random levels is about what the player gets good at. Brian Walker and Herbert Wolverson make the same case independently: when the map changes every run, the skill curve stops being about memorising routes and becomes about mastering the game's systems and adapting to what you are given {{Uo9-IcHhq_w#0}} {{TlLIOgWYVpI#0}}. Wolverson traces this to Rogue, whose up to nine randomly connected rooms were reportedly a way to keep the game small, but which meant that instead of learning "up, up, right" you learned how to deal with monsters and rooms, giving effectively infinite replay {{TlLIOgWYVpI#0}}. Walker adds a second benefit: with a 32-bit seed, probably nobody has seen your level before, so each one feels like a real place discovered for the first time, and even the developer gets to approach their own game with some novelty {{Uo9-IcHhq_w#0}}.

The variety can also come from the player's own path through a space. Xalavier Nelson Jr. chose airports for An Airport for Aliens Currently Run by Dogs because they mix standardised and unique parts and because a traveller bound for gate B6 never cares about terminals A or C, so a randomised presentation tied to each player's route makes each trip different {{SjttI9N9KSM#2}}.

### A layout only matters if it creates decisions

That argument has a condition attached, and John Harris states it bluntly. If what is in a random dungeon does not challenge the player, its layout is meaningless: there is no reason to take one corridor rather than another, and you may as well not randomise it {{KY-TmRw5sR8#5}}. His example is a grid of rooms with weak monsters, where exploration collapses into grinding numbers for the next dungeon.

Several talks then describe what a meaningful space looks like, and they converge on one idea: a level is a field of choices, and the generator's job is to lay those choices out.

- **Overlapping zones.** Walker says it took him a while to see that interesting dungeon space comes from combinatorially overlapping zones with qualitatively different advantages and disadvantages, layered so that every permutation shows up. He treats this as the spatial counterpart to designing character abilities {{lfb6uehmrWo#10}}.
- **Terrain that can be read.** Loren Schmidt borrows "reading" from Go: a player looking at an environment mentally branches out the possible futures its structure allows, the way even an empty Go board is saturated with possibilities under known rules. In grid games, lines of sight, pillars and corridors speak to the player; a pillared room near the player in an Angband-like reads as a place to hide or fall back to. So terrain should be designed for the possibilities and ambiguities it suggests {{FaLUhh_Vfmk#0}}.
- **Layered choices in one encounter.** Sersa Victory wants generators tuned to stack several kinds of choice into a single moment. In her Rogue remake she fell through a pit trap into a room with out-of-depth monsters, a teleport scroll, an unknown wand, a fountain and a once-per-game prayer all in play at once; weighing them together is, she says, the moment developers should strive for {{TeURjrAYFEU#13}}.

> Pay special attention to how your generation algorithm layers multiple choices. {{TeURjrAYFEU#13}}

The layout can also carry information. Harris's experiment Casino Dungeon replaces independent die rolls with a deck of playing cards dealt into a 7x7 grid that decides both the encounters and the dungeon's shape, so the layout itself hints where the treasure and the danger are. Because the player has those hints, Harris makes some spaces deadly unless you come prepared, which rewards building intuition {{KY-TmRw5sR8#15}}. Casey Yano finds a similar lesson outside games: indoor climbing route setters work like level designers, using colour-coded holds as interface and judging whether a route is satisfying or just a luck-based jump or a slog {{KYlq0Msu6hc#14}}.

### The counter-position: simple can be right

Not every game needs intricate space, and the strongest evidence comes from a designer who tried intricate and backed away. Tom Francis argues that a generated space has to feel like a level, not just a place, and that what makes it a level is progress toward an objective in chunks: getting closer without arriving at once and without being stuck. Heat Signature implements this as gates and keys {{3vSCncV5hkI#0}}. His early ships tessellated their security zones in intricate shapes so each ship would differ, and the result was worse than boring. Working out how to reach zone 8 when zone 4 was not where you expected was a chore, and oddly shaped zones forced the camera so far out that players could not see enemies {{3vSCncV5hkI#1}}. The fix was to make every zone a self-contained rectangle that fits on screen at a readable zoom, holding only a key, guards and a locked door. Francis calls it miserable and boring, and says it solved all his structural problems {{3vSCncV5hkI#2}}. It also leaves him with an open question: how do you keep a game fresh when the differences between levels are trivial {{3vSCncV5hkI#3}}?

Darius Kazemi points to Hoplite as an answer from the other direction. As far as he can tell its generator draws an arena, adds blobs of lava and drops enemies at random from a distribution, with one rule guaranteeing your first move does not kill you, and he has played it daily for four years because the core design is tense enough to carry it {{CLi4PWxDmAI#9}}.

Oliver Withington draws the general conclusion. Only the designer knows what diversity a generator needs: Heat Signature rightly targeted simple levels because its other systems supplied enough variety, while Dwarf Fortress players delight in a map that implodes on load and kills every dwarf. No technique can decide where your game sits on that scale {{Ls9wksddN5c#7}}.

### The first question to ask

Before writing a generator, Alexander Birke's advice is to understand the pattern of what you are generating: how it should play, how it should look, and where you can cheat rather than simulate reality. You do not need to generate a real world, only the key part of the experience or the visuals. He calls this the takeaway he wants listeners to have from his Sea of Rifts talk, and recommends Christopher Alexander's *The Timeless Way of Building*, which he says underlies Jesse Schell's lenses book and software patterns {{0jFzBf0mCRY#7}}. Put together with the talks above, the question is concrete: which decisions should this level create, and how much variety does the rest of the game already supply?

## Fitting space to the game's rules and scale

Level geometry is not neutral. Every corridor width, door and room size interacts with how the game moves, what it lets the player see and how many people are playing. The talks show this from both directions: games that changed their spaces to fit their rules {{l1YEJBKehAY#3}} {{3S6uRMCdvNs#6}}, and generated spaces that broke another system {{vtU3Xa0ShKw#15}} {{e8Itfp3MHQ4#12}}.

### Movement, grids and the systems that touch space

Start with the grid. Walker defends the square grid with one-step diagonals against the push toward hexes: because diagonals take you farther for the same cost, there are many equal-length paths between two points, and choosing among them under soft constraints is strategically interesting. Roundness still emerges underneath; Brogue's gas averages each tile with its eight neighbours every turn and spreads into round shapes {{lfb6uehmrWo#11}}.

Then movement rules. Chogue, Pippin Barr and Jonathan Lessard's chess-meets-Rogue game, widened Rogue's corridors to two tiles because bishops cannot pass through one-wide corridors; leaving half the pieces stuck in the first room was funny but not interesting. When only a bishop remains in later levels, the player really does zigzag through {{l1YEJBKehAY#3}}. Wildermyth hit the same problem from the monster side: on its procedural combat maps, large monsters could not fit through narrow passages, so heroes stood still rather than exploring and discovering new pockets of enemies {{vtU3Xa0ShKw#15}}.

Some features touch so many systems that removing them is the right call. Eric Billingsley left doors out of Into Ruins because they affect field of view, enemy AI, pathing and item interactions (what happens when you throw something at a door?). Without them enemies spot you from other rooms, fights spill between rooms, small levels feel less claustrophobic and each floor plays as one big arena, which also suits the crumbling-ruin setting {{3S6uRMCdvNs#6}}.

Space also has to survive the interface. Alexei Pepers describes how NetHack's corridors defeated a blind-accessible version: they dead-end, overlap, change when dwarves dig, and hold monsters and gold so they cannot be skipped. The team gave up on automatic room-to-room travel and on descriptions like "the hallway branches left and right", and fell back on listing every tile in each direction, the most frustrating part of the result {{e8Itfp3MHQ4#12}}.

### How big should a level be

Several designers converge on small and dense. Tyriq Plummer notes that in a platformer the traversal is the fun and cannot be auto-travelled as in a roguelike, so roguelike platformers use compact levels packed with interactions {{OVSi3NzA0KM#16}}. For his co-op game Scrubbin' Trubble he reaches the same answer for a different reason: on sprawling maps players wander off alone and the game feels like one where you might merely meet other players, so small stages with explicit goals keep people together {{UNBAoc0TJSs#3}}. Slashie, after years of trying, found that a huge procedural world is very hard to make interesting to explore, and had more success scaling down to a smaller region packed with things worth discovering, a direction that ran from NovaMundi into Emerald Woods {{R8DSq8qSJ44@32392#5}}. Scale also has a content cost. In Mini and Max, each additional level of shrinking multiplied the content needed, so Jon Perry capped the game at three scales and kept the top level as small as possible {{NlxGPKV0PrY#1}}. The Bad News team made a social version of the same choice: a town of roughly 150 to 300 people is small enough that everyone knows each other, which is what produces narrative connections {{XFFyN10o87I#6}}.

The pull toward vast space is real, though. Plummer, even while using small levels, argues that getting lost in a vast unknown space is part of what roguelikes offer and is not necessarily something to avoid {{OVSi3NzA0KM#16}}. Santiago Zapata counts Moria's scrolling, larger-than-screen levels among its innovations over Rogue's single-screen nine rooms, while noting they started out rather empty and needed handcrafted premade rooms to give them interesting content {{y6WCq0jYbHo#5}}.

### Distance, speed and the shape of travel

Size only means something together with speed. Dan Recht relays how Sunless Sea's creators refused to speed up the ship on its large, procedurally shuffled map despite complaints, because a faster boat would reduce the tension, the sense of distance and the menace of the dark {{FnJxkId-1eE#7}}. Todd Furmanski takes the opposite route: real-time walking forces the town and the castle to be ten feet apart, whereas travel measured between points of interest can represent literary distances such as walking for a month to distant sands. He uses A* not for agent pathfinding but to carve paths between points of interest such as ruins on generated islands {{tmrYfnMrifw#8}}. At the far end, HyperRogue's hyperbolic space grows the number of cells within a given distance exponentially, so its world is effectively infinite and procedural generation is not optional but crucial {{wOlSws-OI2o#3}}.

Enclosure does some of this work for you. Everest Pipkin observes that underground space, being bounded, makes progress directional even when it is fiddly and involves backtracking, and naturally divides into discrete connected rooms. Inside caves you explore, unlock doors, make shortcuts and map the space; buildings can do the same, but caves, wells and burrows do much of it for free {{VwZS0MQSpaU#10}}.

**In practice.** Size and shape your levels from the game's rules, not from what the generator can produce. Check corridor width against your largest mover and your oddest movement rule {{l1YEJBKehAY#3}} {{vtU3Xa0ShKw#15}}, list every system a feature such as a door touches before you generate it {{3S6uRMCdvNs#6}}, and size levels from traversal, content cost and player count {{OVSi3NzA0KM#16}} {{NlxGPKV0PrY#1}} {{UNBAoc0TJSs#3}}. If your space must be large, decide whether slowness is the point, as in Sunless Sea {{FnJxkId-1eE#7}}, or whether travel should be abstracted between points of interest, as Furmanski does {{tmrYfnMrifw#8}}.

## Handcrafted and procedural: where to draw the line

This is the chapter's central decision, and it is one of the strongest convergences in the material: several teams and practitioners favour authored pieces assembled procedurally over space generated from scratch.

### Authored pieces, procedural assembly

Sébastien Benard's account of Dead Cells is the clearest case. The team first spent weeks on fully random platform placement with rules, and the results were uninteresting. Platformer space is much harder to generate than a top-down dungeon because gravity makes moving up, down and sideways asymmetric {{QbTnKvRrNYY#3}}. So they drew the rooms by hand. A room is only platforms, one-way platforms, walls, ladders and exits, with optional walls marked to be randomly added or removed; drawing one takes two to five minutes, so about 1,000 rooms cost around two weeks, and the rooms felt designed with purpose. Benard challenges anyone to write a decent platformer generator in those two weeks {{QbTnKvRrNYY#5}}.

Kazemi's analysis of Spelunky shows the same structure from the inside. A level is a grid of rooms whose numeric types guarantee exits (0 opens right, 1 left and right, 2 is a T, 3 an upside-down T, 8 and 9 are snake pits), so a path snakes from top to bottom {{CLi4PWxDmAI#1}}. Within each template, fixed tiles mix with swappable obstacle blocks and probabilistic tiles, such as a 50% chance of a rock {{CLi4PWxDmAI#2}}. Roughly 60 to 70% of a room is fixed, counting empty space, and Kazemi argues the sameness is a feature: experienced players entering a room they have never seen still know that a running jump off that ledge will land on a platform, because they have learned the templates' rhythm {{CLi4PWxDmAI#6}}. Plummer's Catacomb Kids borrows the approach: generate a grid of rooms, shift them off the grid, join them with tunnels, then fill some with Spelunky-style text-file templates with probabilistic tiles, mixed with fully random rooms {{OVSi3NzA0KM#17}}.

Sergio Garces goes further. Instead of random maps he built a small level editor, authored about a hundred gameplay layouts in minutes each, and picks one at random, then dresses it procedurally with 3D art. Tiles are only blocked, slow or fast; the layout decides the gameplay and the visuals do not touch it, so the game would be playable with icons {{6U8c6hbVJLY#7}}.

NetHack shows the pattern's long history. It started fully procedural, and Jesse Collet began its special levels, starting with the castle at the bottom of the main dungeon, because the team drew on literature and wanted to tell stories, while still wanting enough randomness that each place differed {{9V_CkJ66uJQ#7}}. As the commentators on Adeon's live NetHack speedrun explain, the game now mixes generated levels with fixed branches and guaranteed special levels: the Gnomish Mines and Minetown with a guaranteed luckstone, the castle's guaranteed wand of wishing, and the Oracle, Medusa and Sokoban levels every game {{rIB0y_kwFuY#3}}. Its build uses custom level compilers: one description language draws fixed levels as a literal picture, another describes constraints for randomised levels, such as how many doors and monsters they need {{rIB0y_kwFuY#13}}. Zapata's account of Moria adding handcrafted premade rooms to fill its large empty levels is the same move {{y6WCq0jYbHo#5}}.

The advice from experienced practitioners matches. Pepers describes the "ranger" on a procgen team, the person who knows which paths lead to ruin, steering colleagues away from generating a whole map pixel by pixel from the terrain up and toward snapping together predefined chunks {{mYMdMAvTHpo#8}}. Wolverson recommends injecting hand-designed prefabs, such as a treasure chest ringed by traps, into generated maps: scan the room list for one big enough, or on roomless maps test random locations where it fits, and use only some prefabs each game so the next one differs {{TlLIOgWYVpI#12}}.

### Making generated levels feel hand-made

Ben Berman sets the goal explicitly: the most productive aim for machine-learned level generation, and the one that has worked for him commercially, is levels that look made by hand rather than by a computer {{Z6lHExfem6U#5}}. He offers two levers. First, symmetry: random, organic-looking placement signals generation, while things people make tend to have symmetry, pacing and regular features, so roguelike developers should use their tile grid to their advantage {{Z6lHExfem6U#7}}. The Binding of Isaac takes the left half of a room and mirrors it, which convinces players the rooms were handcrafted; asymmetric rocks would not {{Z6lHExfem6U#8}}. Second, reject difficulty as the main parameter. Cloudberry Kingdom generated platformer levels by difficulty and they obviously look computer-made; Berman notes that roguelikes are hard enough already and points to fun-to-watch, zero-difficulty human-made Mario levels as the aspiration {{Z6lHExfem6U#6}}.

### Hide the seam or show it?

Here the talks disagree. Perry spent part of Mini and Max constraining its handcrafted areas to what procedural generation could match, and concluded that this made the handcrafted areas worse. He stopped hiding the seam, allowed bespoke backgrounds, and kept procedural content at the microscopic scale, where abstraction is acceptable because germs and viruses are unfamiliar {{NlxGPKV0PrY#5}}.

Wildermyth's team frames it as a cost trade-off. Procedural combat maps were cheap to multiply but made fights feel less special {{vtU3Xa0ShKw#15}}. Handcrafted maps allowed deliberate spawn regions, pacing with large engagement areas and breather corridors, goals beyond "kill all enemies" (destroying scenery, escaping a region) and places that look like what they are, such as a forge that looks like a forge; they are critical for story moments and boss fights, but take long to design, iterate and playtest {{vtU3Xa0ShKw#16}}. Garces states the underlying claim plainly: you will always get better results hand-placing than generating unless you invest heavily in the algorithm {{6U8c6hbVJLY#6}}. What the choice depends on is where in the game the authored quality matters most (story beats and bosses for Wildermyth, the familiar human-scale world in Mini and Max) and whether the procedural parts can be given a context where looking procedural is acceptable.

### Practical patterns

The talks describe a small set of reusable patterns for mixing the two.

- **Probabilistic tiles inside templates.** Fixed geometry with tiles that appear by chance, as in Spelunky and Catacomb Kids {{CLi4PWxDmAI#2}} {{OVSi3NzA0KM#17}}, or Dead Cells' plus/minus walls {{QbTnKvRrNYY#5}}.
- **Tagged room pools.** Jurie Horneman describes a low-budget game whose levels were grids of tags such as "medieval corridor" plus exit directions; the game picked any authored room matching each tag. Level creation became fast, and he frames it as rendering a declarative description rather than procedural generation {{FV_0rmqxbxw#1}}.
- **Layout separate from dressing.** Because a Dead Cells room is only geometry, it can be painted with the sewer or the clock tower algorithm and reused across biomes, and with about 1,000 rooms most players never noticed repetition {{QbTnKvRrNYY#7}}. David Brevik's Diablo generated layouts like an ASCII roguelike and converted cells into graphics with a separate handmade algorithm per tileset, which he calls a total nightmare {{OwFrTY3IoQQ#7}}. Garces's layouts are playable as icons before any art goes on {{6U8c6hbVJLY#7}}, and his Mekanical Armada drops a small 7x9 tactical arena into hand-dressed static background corridors that do not affect play {{6U8c6hbVJLY#6}}. Max Bottega's studio arranges a library of over 100 hand-dressed hex tiles procedurally to build a five-biome world, which forced fast, effective art tricks per tile {{27gUUW20fn8#1}}.
- **Toggled layers on authored levels.** Prey: Mooncrash could not do full procedural generation, so Rich Wilson describes a deterministic, serialised chain of random numbers choosing values like a level's "fire index", with the level setting itself up to match. Each variant carried high art cost, such as melted banisters and burst pipes {{wtlLa7BGZcs#8}}.
- **Generate, then tweak by hand.** Leif Bloomquist's Commodore 64 multiplayer roguelike generates its test levels and then edits them manually {{Y0K-e83wYnQ#10}}.

Authored units impose their own constraints. In Stream Heist every room segment is 4x4, and the planned entry through a bathroom stall could not fit, so it became a roof entry {{4jNMv79Xb6A#5}}. Isaac Karth suggests lenses for any new room template, using a class-themed vault for Dungeon Crawl Stone Soup as the example: its individual effect, how it differs from other rooms, how often it appears, whether its shape is recognisable (and whether such rooms should share a shape so players know what is coming), and whether it fits the level's difficulty {{MHEkE7nPuZc#18}}.

### Choosing the ratio

One rule of thumb comes up in a Q&A: the host of Tyler Coleman's talk relays that a game the host worked on used the maxim "80% generated, 20% handcrafted", and that Assassin's Creed Odyssey's generated cutscenes were 20% usable as-is, the rest needing varying amounts of hand work {{C6jR41fZjqM#14}}. Treat the number as a starting point, not a law. From the cases above, push toward authored pieces where the movement model is asymmetric or demanding (platformers), where a space must carry story or set-piece meaning, and where players benefit from learning a rhythm; push toward generation where the space is unfamiliar or abstract, where you need many cheap variants, and where your other systems already carry the variety.

## Layout algorithms and how to combine them

This section is a tour of the layout families the talks describe, with the parameters the speakers gave, followed by the argument that matters most: you rarely use just one.

### Where it started: Rogue's grid

Rogue's generator is a tic-tac-toe board with one randomly placed room per square. Michael Toy says he chose it because he did not yet know how to place random rooms and guarantee a connected graph, and is embarrassed by it {{IaB7iQhts_c#10}}. Mark Gritter gives the specifics: the screen is divided into a 3x3 grid, up to three cells are left empty, and each remaining cell gets a room of random width, height and position that fits inside it. He counts about 253 width/x options and six or ten height/y options per room, roughly 2^100 configurations before corridors, gold or monsters {{mtSjgxS-QS4#3}}. Despite that, Harris notes the structure is predictable enough that experienced players can guess the layout and where secret rooms sit, and that Rogue's variants (except Larn) reused the generator so that knowledge carried over {{b45orGdFwi0#1}}. A fixed macro-grid buys connectivity and legibility at the cost of surprise.

### Rooms and corridors

- **Random room placement.** Start with a solid map, place random rectangles, discard any that overlap an existing room, and stop when you have enough; join them with dog-leg corridors that randomly go horizontal or vertical first. Wolverson notes this is essentially the beginner's algorithm from the Python roguelike tutorial the roguelikedev subreddit recommends {{TlLIOgWYVpI#2}}.
- **Binary space partitioning (BSP).** Recursively split the map in half in random directions until the pieces are room-sized, then put a room in each. It gives results like random placement but better spaced and with no rejections; leave a one-tile gutter so rooms do not merge. Wolverson says NetHack is among the games that use it {{TlLIOgWYVpI#3}}. Spencer Egart's four-step basic dungeon is a good template: empty area, BSP split, fill regions with prefab rooms (his example used only two shapes), connect with A* hallways, which make it easy for corridors to skirt the edges of other rooms {{YfLYPIXGF7E#1}}.
- **Rewrite rules.** Seth Cooper's Trogue generates dungeons purely with tile rewrites: stamp rooms with a centre marker, grow a field of arrows outward from one room (each arrow pointing toward the centre or an existing arrow) until it reaches another room's centre, then follow the arrows to carve a corridor, a pathfinding flood expressed as rules {{K5FXzxDIQdQ#3}}. Scott Kovach builds even the grid itself from recursive rules and computes adjacency once, so later code queries a graph instead of doing index arithmetic {{s9Wyn9BJJI4#7}}.

### Organic carving

- **Cellular automata (CA).** Fill a grid roughly half with random walls, then repeatedly apply neighbour-count rules. Wolverson's rule: 0 neighbours becomes wall, 1 to 4 becomes floor, 5 or more becomes wall; tweak to suit your game. It is simple, fast and deterministic per seed {{TlLIOgWYVpI#4}}. Walker's version starts from about 50% wall and flips cells surrounded by a majority of the opposite type, with thresholds controlling density and smoothness {{Uo9-IcHhq_w#2}}. Paul Hembree's Rite of Tephra extends it to 3D: weighted random fill of a 3D grid, a 3D CA pass, prune small isolated caves, mesh with marching cubes and one smoothing step, and he reports the process is surprisingly efficient {{S5Ukp6AOdQY#4}}. Scott Anderson shows CA can do more than caves, citing a method that produces traditional-looking roguelike maps from CA alone and describing his own Game of Life variant that records where cells lived to grow islands {{R8DSq8qSJ44@15170#4}}.
- **Drunkard's walk.** Start solid and release random walkers, each with a maximum travel distance, respawning new ones inside open space until a target fraction (Wolverson suggests one third) is open. The map is guaranteed contiguous and looks carved by water, which suits limestone caverns {{TlLIOgWYVpI#5}}. Stream Heist breaks the usual rule on purpose: its first walk never reconnects to an earlier room, giving a single line with the start and the Mona Lisa maximally far apart {{4jNMv79Xb6A#2}}. It then adds off-path rooms that may interconnect, and fills the rest with templates from largest (3x3) to smallest (1x1), "big rocks before pebbles and sand" {{4jNMv79Xb6A#3}}.
- **Random-walk room stamper.** Josh Grams stamps a room, moves to a random exit, repeats, and occasionally spawns another walker. It guarantees connected floors, gives organic shapes, and lets you change the space's character just by changing the rooms and exits you feed it {{TsaRxD3g_os#3}}.
- **Diffusion-limited aggregation (DLA).** Fire particles from random points until they hit open space, then carve the last solid tile they passed. The result is winding and contiguous; aiming particles at the centre leaves an open central area, for instance for a dragon's lair, and applying vertical symmetry produces creature-like shapes that Wolverson recommends using sparingly to make any algorithm look less random {{TlLIOgWYVpI#6}}.
- **Meandering paths by obstruction.** To get one organic winding path between two points, Walker fills the area with obstructing terrain one cell at a time in random order, skipping any cell that would break connectivity, until only a single path remains. Brogue uses it for bridges, tunnels through granite and paths between traps {{Uo9-IcHhq_w#9}}.

### Room accretion

Brogue's skeleton is built by accretion. Generate a room (overlapping rectangles, a CA blob or a circle, optionally with a hallway attached), pick door candidates on each side, then scan level locations in random order until the room fits snugly against an existing room through a door without overlapping. Repeat until the level is full {{Uo9-IcHhq_w#2}}. The result is a tree, which the next section's loop pass fixes.

### Combining techniques

The key point in this section has two independent sources. Wolverson says you rarely need to use just one technique, and that combining them can make a map tell a story: a BSP dwarven fortress that breaks into a CA underworld, with prefab fortifications between them, suggests dwarves dug into the underworld and had to defend themselves; firing DLA particles at an existing map erodes it organically while keeping its structure {{TlLIOgWYVpI#11}}. Coleman calls this kit-bashing: in his endless city of dungeons, each BSP room runs a different method, a maze may do a third of its work with depth-first search and then switch to hunt-and-kill, and he recurses, using BSP to find the gaps a CA leaves and filling them with a maze. He found wave function collapse needs more "flavours" of content than on/off, so he uses it for items and objects instead {{R8DSq8qSJ44@18888#0}}.

> With two very simple techniques, you've produced a map that actually tells a story, rather than just being a bunch of random rooms. {{TlLIOgWYVpI#11}}

Two talks give architectures for doing the combining.

- **Pre-pass, fill, post-pass.** Brian Bucklew's Caves of Qud uses wave function collapse (WFC, an algorithm that fills a grid with tiles whose local patterns match a sample). WFC alone gave homogeneous output, so a pre-pass lays down a few large circles or rectangles to set large-scale structure, each filled by a different WFC output, and a post-pass adds doors, furniture and other details WFC overfits on. A village was two stacked rectangles each filled by a building WFC {{fnFj3dOKcIQ#8}}.
- **Recipes and swappable handlers.** Danny Day's Desktop Dungeons gives each dungeon a recipe of events (terrain amounts, enemy spawns by level) sent into a queue, and swappable handlers respond: terrain handlers might be maze or interlocked-room generators, spawn handlers might cluster enemies or put low-level ones near a player who has been dying a lot. Each location has three or four handlers per system, and items from the kingdom or an angry god can change which handlers are listening, so dungeons vary but stay regionally consistent {{p48ArjJweSo#10}}.

### Generate and test

Some shapes are easiest to get by overproducing and filtering. Joe Sondow's Emoji Meadow generates many candidate grass paths through flowers and discards most until one is long enough to fill the space, which was the fastest way to get a big winding path; he also forbade a path from touching a corner of an earlier part of itself, to remove ambiguous diagonal shortcuts {{4byHHDeVKoA#4}}.

### Which family for which space

- Built interiors with distinct rooms: BSP or random placement, plus prefabs and A* or dog-leg corridors {{TlLIOgWYVpI#3}} {{YfLYPIXGF7E#1}}.
- Natural caves: CA, in 2D or 3D {{TlLIOgWYVpI#4}} {{S5Ukp6AOdQY#4}}.
- Water-worn or winding contiguous space: drunkard's walk or DLA {{TlLIOgWYVpI#5}} {{TlLIOgWYVpI#6}}.
- A long route with a goal at the end: a non-reconnecting walk as a spine {{4jNMv79Xb6A#2}}.
- Dense, varied, connected rooms: accretion {{Uo9-IcHhq_w#2}} or a random-walk stamper {{TsaRxD3g_os#3}}.
- Anything with a story or several characters of space: combine families, with a pre-pass deciding which goes where {{TlLIOgWYVpI#11}} {{fnFj3dOKcIQ#8}}.

## Giving the generator a plan: graphs, loops and set pieces

Tile-level algorithms make shapes. Good levels also need structure above the tiles: where the key is relative to its lock, which route the player takes, where tension builds and breaks. Joris Dormans puts it simply: interesting features and interactions need more than a random assortment; the generator needs a plan. He gets one with an early graph-based step, because graphs capture relationships across space and time, such as where a lock's key is, and in Unexplored they lay out abstract features and obstacles before any detail exists {{NjIduRLJL7U#9}}.

> The generator basically needs a plan. {{NjIduRLJL7U#9}}

### Graph-first generation

Graph-based approaches recur across talks, which makes this one of the better-supported techniques here. Abdelrahman Madkour relays Dormans's split of Zelda-style dungeon generation into mission generation (the tasks needed to finish the level) and space generation (where they happen), which can run in either order {{_s-Tn0biyEk#10}}. Ian Holmes explains the graph grammar behind it: start from a coarse graph of the map and repeatedly apply rewrite rules that extend paths, add detours, insert lock-and-key puzzles and shortcuts. He credits it with Unexplored's cohesive, human-designed feel and uses it, via an open-source library he released, for Nematode {{b2VkgcC1xRc#7}}. A grammar can guarantee things local methods cannot: Holmes's rule that there is always a shortcut back from a side path's key to its locked door yields cyclic levels whose overall structure brings you back toward the start, something string grammars lack {{b2VkgcC1xRc#8}}.

Dormans works in multiple passes: high-level graphs first, focused on structure, theme and room count, then rooms fleshed out with floors, detail and population according to what the graph says each needs {{NjIduRLJL7U#11}}. The plan can span a whole run. Unexplored lines up all its levels and populates backward from the final dragon: the dragon's type themes the levels before it, the plan may seed a slaying weapon held by a Lich King on level six, add undead themes and an anti-undead tool earlier, and mention the Lich King or dragon on levels one or two as foreshadowing {{NjIduRLJL7U#10}}.

The same idea appears without a formal grammar. Benard says a Dead Cells level is just a simple tree of nodes (entrance, exits, shop, cursed treasure, a secondary exit on a branch), and combat rooms fill the gaps without changing the logic; he took the idea from GMTK's Zelda "Boss Keys" videos and Spelunky's generation write-ups {{QbTnKvRrNYY#8}}. Wolverson's "hot path" recovers a plan after the fact. It uses a Dijkstra map, a grid where each cell holds its walking distance from a starting cell or set of cells: take the start-to-exit path plus every tile within a small Dijkstra distance of it (say, under ten). You can then cull purposeless branches, or mark off-path rooms for bonus items and harder optional content and put breadcrumbs on the hot path to guide the player {{TlLIOgWYVpI#16}}.

### Structural fixes on a skeleton

Walker's Brogue shows how to impose structure on an accreted layout rather than generate it from a graph. Accretion yields a perfect tree, with exactly one non-backtracking route between any two points, which is easy to get cornered in and forces backtracking. Brogue scans wall tiles in random order and turns one into a door whenever the floors on its two opposite sides are far apart by path distance, giving a densely connected level {{Uo9-IcHhq_w#3}}. Walker's platformer applies the same thinking at a single-map scale: one huge CA cave, disconnected regions joined by doors designed for gravity, distance from the start standing in for depth when spawning monsters, and hidden one-way shortcut doors that open only from the far side, Super Metroid-style, so exploration funnels down one path that later loops back {{Uo9-IcHhq_w#16}}.

Set pieces need a place to go. Brogue analyses the level for choke points that dominate a set number of cells, computed by retracting the level cell by cell from the farthest point while counting the cells absorbed. Room machines take a single dominating point, sometimes widened with CA; vestibule machines take the area just outside a door (glyph-triggered statues, guarded walkways, flammable barricades); area machines need no enclosure. A choke point dominating a large area can even be regenerated, for example rerunning accretion with narrower rooms to make a claustrophobic goblin warren {{Uo9-IcHhq_w#10}}.

### Machines: set pieces as relationships

A "machine" in Brogue is a set piece, and the key design choice is how it is specified. Walker defines machines with the minimum qualitative relationships needed to make them work (a room full of grass, an altar distant from the door, a torch near it, line of sight, minimum counts) rather than as fixed stamps. That lets them fit existing layouts, and because they are not predefined, players cannot see the first tile and know the whole room, and different machines look alike at the outset {{Uo9-IcHhq_w#8}}. His examples are spatial puzzles: taking a key from an altar drops a torch that ignites the dry grass near the exit, so the player must teleport, blink, use fire immunity or find burned ground; monsters burst from statues when a key is lifted; a lava field is crossed with fire immunity, levitation or a hidden lever, and evaporates once the key is taken. Each plays differently with different monsters and health {{Uo9-IcHhq_w#5}}. Across a level the machines interlock: a key on a walkway hidden by chasm traps and a key stolen by a monkey open two reward rooms, while a vampire lair's key opens a vault with a magic weapon. Walker describes this as physical rather than narrative coherence, a level where elements from every part tie into the others as concrete goals {{Uo9-IcHhq_w#6}}.

### The shape of the plan

A plan also needs a dramatic shape. Jack Schlesinger, coming from theatre writing, wants dungeons and puzzles to follow an arc of tension and release: accessible at first, growing tougher until the key is unlocked, then a short release to the conclusion, rather than one big room with all the monsters, though he allows it depends on the game {{5PF9RB0_ifM#11}}. Francis's chunked progress toward an objective is the same instinct expressed as gates {{3vSCncV5hkI#0}}.

### Do not plan everything

The counterweight comes from Dormans himself. Unexplored 2 pushed sophistication further and found that generating complex levels entirely in advance turns them into fragile machines that collapse when the player deviates from the planned path or misses a clue. Patterns in space can be pre-generated; patterns of time and consequence are much harder to fix in advance {{NjIduRLJL7U#12}}. So plan the space, its locks, keys, loops and set-piece slots, as fully as you like, but leave the sequence of events room to respond to what the player actually does.

## Guaranteeing a playable level

A plan says what a level should contain; the next question is whether the player can actually get through what the generator built. A generator that makes a beautiful level the player cannot finish has failed. Schlesinger, who designs puzzles for Knotwords, gives the working definition: a dungeon or puzzle is solvable when it has no inaccessible rooms and no unintentional dead ends {{5PF9RB0_ifM#5}}. Both halves matter. An inaccessible room is a connectivity bug; an unintentional dead end is a state the player can walk into and never leave. Everything in this section is a technique for catching one or the other before the player does.

### Connectivity: flood fills and pathfinding

The talks converge on one family of tools: run a flood fill or a pathfinder from a known point and see what it fails to reach. Schlesinger checks Knotwords grids with a flood fill, because a grid that is not fully attached is really several adjacent puzzles {{5PF9RB0_ifM#5}}. Wolverson does the same for dungeon maps with a Dijkstra map (introduced with his hot path above): start it from an open central tile, and every open tile still holding the sentinel "unreached" value cannot be reached. Delete those regions, or keep them as tunnel-only rewards. Wolverson stresses the order of operations: cull first, then place the player start by choosing a rough area and searching for a nearby open, unculled tile. Cellular automata are especially prone to leaving unreachable pockets, and he admits to having shipped the embarrassing map with only two walkable tiles {{TlLIOgWYVpI#14}}.

Deleting the unreachable is one answer; connecting it is the other. Bucklew explains that wave function collapse (WFC, described among the layout algorithms above) cannot itself be forced to make connections, so Caves of Qud repairs its output afterwards. For villages, it runs A* from the map centre to each disconnected region and places a door wherever the path punches through a wall. The weight given to wall cells is the design lever: a low weight makes paths smash through many walls, a high weight makes them wind around until they have no choice, producing the few doors a naturalistic village would have {{fnFj3dOKcIQ#9}}. For caves, Qud drops a scatter of seeds and lets a noise-guided pathfinder wind between them, widening the passage in noise-controlled areas so it blends into the cave; Bucklew calls this extra work, but far less than handcrafting every output's connections {{fnFj3dOKcIQ#10}}.

A third approach is to test each feature before you commit it. Walker describes how Brogue adds lakes and chasms as cellular-automata blobs, brute-forcing each candidate placement and keeping it only if it would not make any pair of walkable tiles inaccessible to one another {{Uo9-IcHhq_w#4}}. Walker carried the same idea into his procedural platformer, the one with the one-way shortcut doors described above, where gravity creates "wells of doom": pits you can fall into and never jump out of. His fix is to pathfind from the entrance, add a platform wherever a reachable cell sits above a cell from which the start cannot be reached, and repeat until everything is passable, which guarantees, to the accuracy of the jump pathfinder, that the player cannot get stuck {{Uo9-IcHhq_w#14}}.

You can also build connectivity into the construction rules so it never needs repairing. Karth contrasts two ways games do this: Spelunky guarantees a path from entrance to exit through rules about which rooms may connect to which, implicit in the tiles it places, while Unexplored keeps a separate mission-structure graph that sits apart from the dungeon layout {{MHEkE7nPuZc#11}}, the mission-and-space split covered in the previous section. A graph grammar can also build a guarantee in directly, as Holmes's rule of a shortcut from every side-path key back to its door does {{b2VkgcC1xRc#8}}.

### Lock-and-key and item gating

Connectivity gets harder once some passages need an item. Stella Mazeika, who works on randomizers, names the failure: place the flippers behind a boulder that needs the gloves and the gloves behind water that needs the flippers, and the game is no longer beatable. She calls circular dependency the danger zone where most randomizer effort goes {{C7laugXEc9s#4}}.

> I need the flippers to get the gloves but I need the gloves to get the flippers and the game is no longer beatable. {{C7laugXEc9s#4}}

Perry's Planet Zoldath, from UFO 50, shows a layered defence. First, a fixed high-level structure: one of three map pieces always sits in a dungeon that has at least two internal gates and is itself behind another gate, and the keys are placed outside it, because "you don't want to lock the keys in the car" {{NlxGPKV0PrY#17}}. Second, a stable core of eight items around which seeds are built. Third, redundancy: almost every gate has a primary solution (the nail gun breaks crystals) and a stranger two-item one (the metamorpher changes the crystals, then a bomb detonates them). The secondary paths make the game feel less constrained and act as insurance for solvability {{NlxGPKV0PrY#16}}.

Solvable is not the same as findable. In Perry's Mini and Max, also in UFO 50, he cannot know where the player is or in what order they explore, so hidden "funnels" make sure players are eventually steered toward key content, for example an NPC who tips them off to where a town is {{NlxGPKV0PrY#4}}. Metroidvania-style backtracking (find a power-up in one area, use it in another) can also be generated: Zapata's Metroid Roguelike generated its base's backtracking structure randomly, with per-cell heights in an overhead view so the player could jump between parts of the world {{TMxzVy7-VYQ#4}}.

### Cascades and recovery

Some dead ends are not in the map but in the sequence of moves. Schlesinger warns about locally correct moves that make the rest of a level unsolvable, such as locking a door that blocks the exit. In Knotwords a correct-looking solution on one side could cascade and break the other, especially where two parts joined in only one place; the team added per-zone rules and kept asking which dead ends would feel really bad {{5PF9RB0_ifM#8}}.

When you cannot rule out getting stuck, you can detect it in play. Dormans recalls Unexplored's "pray for help" button: the game looked at the level graph, at where the player was, what was accessible and where the tools were, to judge whether the player was genuinely stuck behind a door. If so, it opened doors or spawned tools {{NjIduRLJL7U#14}}. That works because Unexplored kept the graph around at runtime. If your generator throws away its structure once the tiles are placed, you lose the ability to reason about stuckness later.

**In practice.** A validation pipeline drawn from these talks:

- After carving, flood-fill or Dijkstra from a central open tile; delete or reward-tag what is unreached, then place the start on a reached tile {{TlLIOgWYVpI#14}}.
- Join disconnected regions with a pathfinder that pays a high cost for walls, so it makes few openings {{fnFj3dOKcIQ#9}}.
- Test each large feature (lake, chasm) before placing it, and reject any placement that splits the walkable area {{Uo9-IcHhq_w#4}}.
- If movement is asymmetric (gravity, one-way drops), pathfind with the real movement rules and patch cells that cannot return to the start {{Uo9-IcHhq_w#14}}.
- Check item gates for circular dependencies and never place a key behind its own gate {{C7laugXEc9s#4}} {{NlxGPKV0PrY#17}}; give gates more than one solution {{NlxGPKV0PrY#16}}.
- Keep the level's graph available at runtime so you can detect and relieve a stuck player {{NjIduRLJL7U#14}}.

## Furnishing and populating the layout

Once the shape exists, the generator has to decide where things go: monsters, treasure, furniture, traps, exits. Random scatter over the floor tiles is the obvious default, and Shattered Pixel Dungeon found that pure chance can produce unfair clumps {{kaojiu9syPE#7}}. The techniques in the talks fall into three groups: measuring the space so placement can respond to it, placing threats with rules about fairness, and furnishing rooms so they stay usable.

### Measuring the space

Placement needs a number that describes each tile. In rooms-and-corridors maps it is obvious which spaces are open (big rooms get more enemies), but in organic caves openness changes gradually. Albert Ford's answer is to run field of view (FOV, the set of tiles visible from a point) from every tile and count how many tiles each can see. The result is a smooth openness measure a generator can use to decide where content goes {{y1zkrTcNJbc#6}}.

Distance is the other basic measure. Wolverson runs a Dijkstra map from the start and finds the least accessible point on the map. That is a poor place for the exit if the start is central, he says, but a great place to hide a bonus item, because it forces a treasure hunt; for exits he usually picks the rough area he wants and places on a nearby open tile {{TlLIOgWYVpI#15}}. He also uses Voronoi diagrams (a partition of the map into cells, each the region closest to one seed point) to group or separate monsters: spawn the orc king and his retinue inside one cell, keep rival groups in different cells. The same cells serve city layout, with roads along cell edges and one district type per cell, as in his PROCJAM game Apocalypse Taxi {{TlLIOgWYVpI#8}}.

### Placing threats fairly

Evan Debenham describes how Shattered Pixel Dungeon used to let a player meet three sewer crabs at once and lose immediately. Switching to a per-floor enemy deck means players almost always meet one crab at a time, even though the probability of any given enemy being a crab is unchanged {{kaojiu9syPE#7}}. A deck (drawing without replacement from a fixed list) keeps the overall mix while removing streaks.

Emily Halina's Tree-based Reconstructive Partitioning (TRP) generator places threats by measured impact. It simulates play with Monte Carlo tree search, counts how many simulated deaths each threat caused, and adds the most impactful threat first, continuing until a designer-set threshold is reached. If one Goomba caused 75% of deaths and another 25%, the first is more likely to be placed and placed first. Halina ties this to the design idea of using as few threats as possible while placing the ones that matter, and she defines a threat broadly as anything that can end a playthrough, such as a box pushed into an unrecoverable spot in Sokoban {{KWBpQz1mHcA#6}}.

Some threats are places rather than monsters. Dylan White notes that Rift Wizard's lairs keep spawning enemies that eventually come to you, so where the lairs are shapes both which level he picks and where he deploys {{VVRomN99Ygw#7}}. Jeff Olson's Alphaman used lairs differently: each held a single creature type guarding good loot, so a player strong against that type could clear it and collect everything {{Gk5uWXBANkA#9}}. Both make a lair a readable point of risk and reward rather than background population.

### Furnishing rooms

Furniture has to fit without blocking. Pierre Vigier treats room furnishing as constraint satisfaction (CSP, a search that assigns values to variables subject to rules). The room is a 2D or 3D grid whose cells are empty, free, margin (free and must stay free, such as doorways, so connections to other rooms stay reachable) or full. Each object is a box plus a margin box that must stay clear so the player can reach it; a 3D grid lets objects sit above others, and a table with its chairs can be one object to keep the problem small {{oVhq8V93gHM#3}}. Vigier then splits objects into two classes: required objects placed with full backtracking, and optional decorations placed afterwards with a single attempt per value and no backtracking. Missing decorations do not invalidate a room, so this keeps the search small while letting optional objects carry their own appearance probabilities, random counts and alternative models {{oVhq8V93gHM#4}}.

The Delve Bros take a hand-authored route in Stream Heist: every room type has manually built placement locations in several layers, and heat maps choose among them so objects spread evenly and avoid bad spots, such as something sticking through a wall next to a door {{4jNMv79Xb6A#4}}. The two approaches share the key rule: some cells must stay clear, and the placer has to know which.

### Placed stories and placed hazards

Placement can tell a story and change the map. Pepers points to NetHack's dead adventurers, killed by traps on early levels and carrying useful items, and to the long source comment explaining which items they may carry and which traps were included or excluded, for both balance and narrative reasons {{5y_IAdOwaYs#3}}. Reed Lockwood lists traps that manipulate the dungeon itself: adding fire or acid puddles, flooding (which brings knock-on effects such as aquatic monsters), darkness and fog, or opening and closing parts of the map {{ymgmhtkRLyY#9}}. Nic Tringali's The Banished Vault places resources on planet grids so that some are mutually exclusive: titanium and iron may share a spot where only one building fits, and since buildings cannot be moved, the visible set of resources may resolve into only a subset on arrival {{nSJA2yVsTFM#11}}. Placement there creates the decision.

Across these talks the common point is that populating a level needs its own rules, separate from carving it: rules about spacing (decks, Voronoi groups), access (margin cells, clear doorways), and fairness (impact-weighted threats), each driven by a measurement of the space.

## Making levels distinct and memorable

A generator can produce endless variation and still produce sameness. Kate Compton's "10,000 bowls of oatmeal" problem names this: every bowl is technically different and they all taste the same. Applied to levels, the risk is that each level gets a little of everything and so tastes like every other {{wtlLa7BGZcs#9}}.

### Chunkier variation

Wilson calls this the "chopped salad effect". In Prey: Mooncrash, if every level had a little flooding, a little radiation and a little fire, each tasted the same, so the team made variation chunkier: this level is mostly fire, that one mostly radiation, with three or four variants, giving a larger experiential difference between levels {{wtlLa7BGZcs#9}}.

> We ended up making it chunkier so you know this level's mostly fire, this level is mostly radiation. {{wtlLa7BGZcs#9}}

Birke hit the same problem in Sea of Rifts, where islands all looked alike. His fix works at the level of props: each prop has weights and ranges, and each harbor picks a different weight range to sample from, so islands differ despite sharing one prop pool {{FC9GAL2piJI#16}}. Angband's veterans describe the cost of not solving it: with 100 dungeon levels, uniform generation becomes very boring by the 60s and 70s, and attempts to vary the levels had mixed results {{eeSk665OXkM#17}}. Wilson's and Birke's fixes are the same move at two scales: let each level or region commit to a narrow slice of the possibility space instead of averaging over all of it.

### Standout levels and landmarks

Karth suggests a test for any generator: look at an individual level and ask what makes it stand out. Is this the level with the fountain, or the one with stairs to the Gnomish Mines? Then add or change features to make standouts more likely {{MHEkE7nPuZc#3}}. He names two structural tools: contrast in a parameter between levels (this one has many small rooms, that one many big ones) and unique landmark levels dropped into the normal sequence, like an Oracle level or a big room {{MHEkE7nPuZc#12}}. He also points to No Man's Sky giving each planet a single biome, so players grasp its gestalt at once: the blue-grass planet, the canal planet {{MHEkE7nPuZc#4}}.

Shape is often not the axis that matters. Jackson Wagner says small variations in Wildermyth's map shapes did not make maps feel different, but scenery chosen by biome, site and enemy type did: tentacles when fighting gorgons, mossy stone in the hills {{vtU3Xa0ShKw#17}}. Sea of Rifts likewise layers underwater wrecks and creatures beneath its open ocean, where players spend around 80% of their time, to spark curiosity and carry environmental storytelling {{FC9GAL2piJI#6}}.

The dressing layer needs its own rules for variety. Garces dresses layouts with a few simple rules on top of random prefab choice: use 2x1 or 2x2 prefabs where several blocked tiles are adjacent to break the grid, cap how many of the same model appear on one screen (no screen full of school buses), and draw only from prefab pools matching the surrounding environment {{6U8c6hbVJLY#8}}. Birke places Sea of Rifts scenery with jittered-grid blue noise, a grid with a random offset per cell, but says the look comes from layering: each biome's settings file lists scenery rules applied in sequence, each with its own spawn algorithm {{0jFzBf0mCRY#10}}.

### Meaning and context

Harris argues that what hand-made tabletop dungeons have and random ones lack is backstory: a reason everything is where it is. In The Temple of Elemental Evil, the town's merchants are secretly evil and a sand pit hides a hoard 60 feet down. In his goblin-lair example, there is a trash dump and a nursery; freeing the goblins' prisoners might win allies, and the trash may hold gold the goblins threw away. Backstory makes the dungeon feel like a real place and gives players something to exploit, so it is not just window dressing {{KY-TmRw5sR8#8}}.

Mike Cook adds that a generator's character depends on what it is fed. Spelunky's generator on world 1-1 is very different from 4-1, even from 1-3, because new enemies and room templates change what it combines; he says his own earlier talks treated it too abstractly {{nOGNdrjm8ek#8}}. The same algorithm can yield distinct levels if the content it places changes.

**In practice.** Vary along a few large axes rather than many small ones {{wtlLa7BGZcs#9}}. Give each level something a player could name it by: a dominant hazard, a biome, a landmark {{MHEkE7nPuZc#12}} {{MHEkE7nPuZc#4}}. Change the content the generator draws on as the run goes deeper, so context does work the layout cannot {{nOGNdrjm8ek#8}} {{vtU3Xa0ShKw#17}}. And where you can, place things for a reason the player can discover and use {{KY-TmRw5sR8#8}}.

## Mazes, orientation and getting lost

Most of this chapter is about making sure players can find their way. Mazes are the case where getting lost is the point, and Andrew Plotkin's talk is the fullest treatment.

### What a maze is

Plotkin argues that a maze is defined by the experience of navigating it, not by its shape. Zork's maze maps as a tangled "hairball" graph, and any puzzle, such as a sliding-block puzzle, has a state diagram you could draw like one, but most people would not call that a maze {{7h3T5NaFpcI#2}}. What separates a maze from a merely confusing level is intent: a maze deliberately tries to get you lost. A confusing doctor's office would read in a game as an awkward level, and the cave that inspired Colossal Cave was shaped by water, not intent {{7h3T5NaFpcI#3}}.

His more important point is that intent to confuse is not enough. An empty void disorients but gives you nothing to work with. A good maze removes your orientation and then gives you the means to rebuild it through effort, the way Larry Evans's maze drawings invite you to wonder whether you have crossed that bridge before {{7h3T5NaFpcI#5}}.

> What the maze is really trying to do is allow you to find yourself. It's not just getting rid of your orientation. {{7h3T5NaFpcI#5}}

Mapping is part of that effort. Players of Wizardry and Ultima drew maps on graph paper that came out looking like classical mazes; automapping games draw the map as you go, and an incomplete automap still gives the experience of the maze drawing itself {{7h3T5NaFpcI#1}}. Martin Pichlmair makes the related point that a map can only show what its maker knows, like fog of war; the 1490 Behaim globe filled undiscovered regions out of proportion {{EMb6B2cIJps#7}}.

### Mazes in roguelikes

In the talks, roguelike mazes appear as connectivity-safe filler and as obstacles. Plotkin notes that simple grid maze algorithms guarantee a path from any point to any other, which is why they are popular in roguelikes such as NetHack's Gnomish Mines {{7h3T5NaFpcI#0}}. Noah Swartz reads the genre's twisting maze levels as there to slow and befuddle the player, the same job as the labyrinth beneath the temple in The Tombs of Atuan {{IVDN5GDTIvY#4}}.

The type of maze changes the play. Harris distinguishes perfect mazes, with exactly one route between any two points, from imperfect ones with several. Hack, NetHack and Super Rogue use perfect mazes that force the same path every time; Larn's imperfect mazes let the player decide which way is best {{b45orGdFwi0#14}}. If your maze is meant to be a space of choices rather than a tax on time, add loops.

### Construction details

Furmanski's Dragon's Descent, an Atari 2600 roguelike, builds mazes on a room grid: each important room (entrance, exit, treasure) goes in a different quadrant so the entrance is never next to the exit, a dummy room is added, and specific rooms are connected through it (start to dummy to exit), so levels are always navigable but have loops and dead ends. He calls choosing which rooms connect the arbitrary "art" part; levels are big enough to get lost in but finishable in a minute or two {{l9eE4mT8xqI#9}}. He also kept a bug that made the grid effectively 7x8, because level 1 came out as a great tutorial where you reach the treasure first, and he ported the seed generator to later platforms to preserve those levels {{l9eE4mT8xqI#11}}.

Adrian Herbez, generating mazes for 3D printing in Plarl, encodes each cell's exits as bit flags (1 north, 2 east, 4 south, 8 west, giving 0 to 15 per cell, after the book Mazes for Programmers) and fills the whole rectangle so the printed object's silhouette gives nothing away {{cGvig1f68Tg#4}}.

A maze that the player can solve by keeping one hand on the wall is no maze. Plotkin lists ways to defeat the left-hand rule: Wizardry's spinners that silently turn you 90 degrees, bridges as in corn mazes, a goal in the centre surrounded by a loop or island so wall-following circles forever, and locks and keys {{7h3T5NaFpcI#12}}.

### Mazes for their own sake

Plotkin's last point cuts against the roguelike habit of treating mazes as difficulty. A waist-high hedge maze in Ferrara, where you can always see where you are, is still fun to walk, and nobody forces visitors onto a cathedral's pavement maze; people engage because the maze experience is enjoyable {{7h3T5NaFpcI#7}}. If you include a maze, decide whether it is there to slow the player or to be enjoyed, and in the second case give the player landmarks, loops and a map so that finding their way is the reward.

## Between levels: doors, branches and the run's route

A run is a sequence of spaces, and how those spaces join is a design decision as large as how any one of them is built.

### From the dive to the route choice

The classic roguelike is a dive: one staircase down at a time. Zapata credits Moria with the first big structural break, the town level, which turned a pure dungeon into a journey of delving, returning to spend gold, and descending again, "many runs within your run", a structure that inspired Diablo and many RPGs {{y6WCq0jYbHo#4}}. Linas Gabrielaitis reads the 1994 Diablo pitch as the archetype of that shape: a town for upgrades, a dungeon whose deeper levels hold progressively harder creatures, and permanent deletion on death {{jvZb9WoIHxo#0}}.

Rosalind Miles Chapman argues that modern roguelikes have replaced the hunger clock with mutually exclusive path choices. Hunger used to impose an invisible push-your-luck decision about how thoroughly to explore against dwindling food; a branching route makes that decision explicit, because taking one path forecloses another, and the player asks which challenge and reward their run needs now and later {{j9ykOdQRUQk#2}}. Victory gives concrete structures for such choices: branching stairs to a lower-danger, lower-treasure level or a higher-danger, richer one, or several locked chambers with only one key (which need not be literal) {{TeURjrAYFEU#14}}. Rift Wizard lets the player preview each portal's level, judge its difficulty and loot, back out, and then pick where on the map to deploy; White uses that preview to find the best tactical position {{VVRomN99Ygw#3}}.

### Choosing a door system

John Bond offers the most complete frame. A "door" is any object or crossing (door, staircase, rope, portal) that clearly signals a move from one whole random area to the next. Internal seams between generated chunks are not doors: to the player a map built from many tiles is one big area, and the door's symbolism is what separates the feel of one area from the next and sets the pacing {{bpGRyzWCWwk#0}}. Choosing a door system, he says, depends on four variables: run length (from about 20 minutes to 20 hours), pacing (including dialogue and avoiding speed whiplash), the number of major mechanics such as mini-games and side activities, and polish {{bpGRyzWCWwk#5}}. His taxonomy:

- **Linear doors**, as in Rogue-style games and Balatro's "go forward" button, suit shorter runs with fewer major mechanics; an all-menu game already satisfies what a good door needs {{bpGRyzWCWwk#7}}.
- **Dungeon doors**, as in Cult of the Lamb's roguelike section, lead to areas that play like the last one; they suit games of constant pressure with some exploration {{bpGRyzWCWwk#8}}.
- **Chosen doors**, as in Hades and Dead Cells, let the player pick between rooms that play differently. They suit many major mechanics and longer runs, but because doors separate play styles they demand careful pacing, and because there are dozens of them they need more animation and iconography {{bpGRyzWCWwk#9}}.
- **Branching maps**, as in Slay the Spire and Into the Breach, make the map's icons the doors. They convey information for mechanic-heavy games without menus and funnel players forward so they cannot get lost, but they involve less exploration and so often suit action games poorly unless the space between doors is small {{bpGRyzWCWwk#10}}.
- **Open worlds**, with dead ends, ways to get lost and sometimes no fixed goal, suit slower and longer runs but can overwhelm; doors still exist, for example between biomes {{bpGRyzWCWwk#11}}.

Yano's account of Slay the Spire shows why the choice depends on how the game moves. The game first offered three ornamented doors signalling the next room type, much like Hades, but switched to a map because a mostly static game needs another way to convey the feeling of traversal; Hades can do without one because the character physically moves around {{KYlq0Msu6hc#4}}.

### When levels stop being independent

Most classic generators treat each level as independent: generate it, put the player on its stairs. Breaking that assumption is expensive. Collet designed NetHack's Vlad's Tower to span three levels entered from the bottom, which meant blocking digging and teleport shortcuts and hacking in ladders, because inside and outside stairs broke the old model {{9V_CkJ66uJQ#9}}. That ladder hack triggered a redesign letting stairs connect specific levels, which later grew into NetHack's dungeon branch system {{9V_CkJ66uJQ#10}}.

Transitions themselves can carry design. Billingsley's Into Ruins replaced stairs with holes on every floor and generates the next depth differently depending on which hole you jumped down, so the dungeon feels cohesive; cutting stairs also changed how levels are generated and look, since players are always hunting for holes {{3S6uRMCdvNs#17}}. Lessard found that adopting Rogue's stairs in Chogue raised a slew of party problems, such as bishops that can never reach stairs on the wrong colour, so a single unit on the stairs advances the whole party {{l1YEJBKehAY#10}}. Harris notes that Advanced Rogue, unusually for its time, let players climb back up before finding the goal and leave level one into a wilderness, though its purpose is unclear {{b45orGdFwi0#10}}.

Persistence between levels shapes play too. Erik Osheim and Robert Au argue that Angband's non-persistent levels, perhaps originally a hack, became core to its identity; one 20-year player credited forced descent with making them finally fight the last battle instead of agonising {{eeSk665OXkM#19}}. Arvi Teikari describes the opposite clash in Noita: its seamless, continually generated, destructible world, inherited from open-world prototypes, worked badly with Spelunky-style static transition rooms between freshly populated areas {{huMHQGr8PgM#6}}. Whether you have discrete levels at all constrains which door systems are available.

Branches need tuning like anything else. Alan Malloy reports that Dungeon Crawl Stone Soup's canned queries always show the Shoals as the deadliest of the four Lair sub-branches, of which each game gets two, so the developers avoid making it harder {{QV57CYrIZow#14}}. If you offer parallel branches, measure whether they are comparable.

**In practice.** Choose a door system from the run's shape, not from habit. Short, mechanic-light runs can be linear; runs with many distinct activities want chosen doors or a map, with the polish that implies; slow, long runs can open up toward a world {{bpGRyzWCWwk#5}}. If the player does not physically move, a map may be what carries the sense of travel {{KYlq0Msu6hc#4}}. And if you want the route to be a decision, make the options mutually exclusive and previewable {{j9ykOdQRUQk#2}} {{VVRomN99Ygw#3}}.

## Worlds, overworlds and persistence

At the scale of a world the problems change. A world is too big to generate in detail at once, it has to hang together across distances the player will travel, and you have to decide what stays the same between visits, runs or players.

### Layered generation: framework first, detail on demand

Caves of Qud is the most detailed case in the talks. At world creation it generates a high-level framework: a procedural history, which roads connect, which villages exist and what their histories are, lairs, hidden monasteries, canyon connectivity. Those decisions then constrain the zones built later; the legendary fish's lair is fixed at world generation even though its map is made on entry {{owmGknfj6H4#14}}. Each zone is fabricated only when the player steps into it, from constraints generated during travel, because generating everything up front would mean "you would just never start the game". Arriving from a different direction or after changing the environment can produce somewhat different outcomes while keeping the same physical structures {{owmGknfj6H4#13}}. The world map itself is static, and each of its tiles expands into a 3x3 grid of zones whose builders depend on the terrain type {{kDKQM27U-Nc#10}}. History feeds geography directly: Jason Grinblat explains that any location mentioned in Qud's generated histories is a real place, and finding an artifact that names it adds it to the journal and creates a quest. The location's builder uses its history; Tuwan Palace, where the rich lived, gets garden alcoves and a "becoming nook" where aristocrats installed cybernetics, still holding an implant to find {{ClGAApZYIvI#4}}.

Dwarf Fortress is the classic precedent: Tarn Adams describes building the world from elevation, temperature, rainfall and drainage layers combined into a biome map, then running a history over it, and frames world generation as the analogue of roguelike level generation, with the world as a bones level {{Zh6dnx9FM1g#10}}. Smaller-scale versions of the same idea appear elsewhere: Zapata's Zelda Roguelike generated an overworld of forests, lakes and mountains based on the dungeon you were about to enter {{TMxzVy7-VYQ#6}}.

### Noise is not a design

Layered noise is the obvious way to make terrain and the talks warn against relying on it. Birke's first Sea of Rifts world used layered Perlin noise and produced recognisable artefacts, lakes that stranded players and ended runs almost as they began, and no way to balance anything, because noise has no concept of what makes a level good to play {{0jFzBf0mCRY#6}}. His replacement starts from gameplay. The world is concentric zones around a central goal: green zones may hold harbor islands, blue may hold rifts, red rings always hold one, so reaching the centre forces the player through rift zones and difficulty follows distance. Every map parameter, such as harbor distance and rift-zone length, is tied to gameplay {{0jFzBf0mCRY#8}}. Islands grow outward from harbors, the key gameplay objects: a random direction from each harbor cell is reserved as a no-land entrance corridor so the harbor is always reachable, land grows by harbor size, and spline-based signed distance fields shape the coastlines {{0jFzBf0mCRY#9}}. Harbor cities are just jittered grid points, because from the game's camera players only need to read a city and see that each differs. Birke offers this as an example of knowing where you can cheat, the question this chapter opened with {{0jFzBf0mCRY#11}}.

Schmidt makes the same complaint from the other side. Dungeon generation has achieved fine-grained control through piecewise techniques (number of turns, corridor length, dead-end frequency, width, choice of algorithm), giving designers great bandwidth over how players read space, while landscape generation generally lacks it {{FaLUhh_Vfmk#1}}. Terrain must work in positive and negative: land is the barrier when you travel by water and water is the barrier when you travel by land, so island spacing and inland water shapes are function, not just aesthetics {{FaLUhh_Vfmk#3}}. In Schmidt's flick-screen roguelike each screen is one world-map pixel; roads and open areas are guaranteed traversable while forests and boulders may not be, so the route you take depends on where you are going and what experience you want {{FaLUhh_Vfmk#2}}.

Other overworlds make terrain a strategic layer. Wildermyth's overland tiles follow rough proportions, and mountains slow raiding monsters while the resource sites available constrain what gear you can buy {{vtU3Xa0ShKw#20}}. Andrea Interguglielmi builds Nauticrawl's world from Voronoi cells into islands he can scale up or down as the game needs {{wxmio1S3iN0#3}}. Furmanski leads players to points of interest in Forska with pathfound trails, which produce switchbacks up mountainsides for free; added noise stops them being too straight, and their contrast helps them read even in a painterly snowscape {{ST6s_8ekeOg#7}}.

### What persists: generate once, regenerate, or keep

Persistence is a separate decision from generation, and the talks show a full range.

- **Generate once.** Max Kreminski describes Animal Crossing running its terrain generator exactly once, when you move in. Towns have five or six basic features and look alike side by side, yet players grow attached to theirs, because they cannot throw it away and so build a relationship through time and effort {{TvlZinAvpwg#11}}. Bloomquist plans for his shared-instance multiplayer roguelike to generate its dungeon once when the server starts, with everyone entering the same one {{bpSnPNr6ETc#6}}.
- **Lock the seed.** Perry's Mini and Max uses procedural generation with a single fixed seed so every player gets the same world and friends can talk about it, such as the item you find by shrinking on a particular corner of the bookshelf; the aim is the illusion that the world is real and persists {{NlxGPKV0PrY#0}}.
- **Regenerate from a derived seed.** Olson's Alphaman could not store local maps in memory, so it regenerated each from a seed derived from its position on the world map, producing the same map every return {{Gk5uWXBANkA#6}}. Furmanski's Dragon's Descent stores a whole level in 12 bytes of the Atari 2600's 128: an 8-byte bitmap of which rooms exist on an 8x8 grid plus 4 bytes for the entrance, exit, start and treasure rooms, all from a two-byte seed {{l9eE4mT8xqI#6}}.
- **Pre-generate and reveal.** Francesco Cottone's Chronicles of Stampadia, a paper game, generates a full consistent dungeon in code but prints only the starting room and numbered doors. Entering a door, the player adds the exit number to the cell's coordinates to get an id and looks up the next room's position, size and description, much as a crossword is pre-generated and partly printed {{IPMXeSAvtDs#3}}.
- **Carry the world forward.** Cole Wehrle's board game Oath keeps the winner's territory as the next game's starting map and fills the rest from a frontier deck; its expansion keeps unused sites in an atlas stack because reshuffling them destroyed the geography players had built, so each copy grows its own mountain range or islands {{HgnvMBVKP0M#10}}. Dustin Freeman's Spirit of the Ages plays successive ages on the same world, growing denser each age, with a summary screen that turns events into changed traits {{RYZSdPuvta8#5}}.

Gabriel Koenig raises an open question about who picks the good worlds: instead of developers curating seeds, games could let players evaluate which generated levels to play, or seed sub-elements such as monster distribution separately {{xju91VGh2Ps#13}}.

**In practice.** Generate up front what everything else depends on: history, connectivity, the location of key sites {{owmGknfj6H4#14}}. Generate lazily what is expensive and local, constrained by that framework {{owmGknfj6H4#13}}. Derive seeds from position when you need a place to come back the same without storing it {{Gk5uWXBANkA#6}}. Generate once, or lock the seed, when attachment or shared conversation is the point {{TvlZinAvpwg#11}} {{NlxGPKV0PrY#0}}. And build world-scale terrain from the gameplay objects outward rather than hoping noise produces good play {{0jFzBf0mCRY#6}} {{0jFzBf0mCRY#9}}.

## Unusual spaces and new inputs

The edges of practice are worth a look, because they expose assumptions that conventional generators make without noticing.

### Spaces players reshape

Pipkin observes that digging as the main way to move is as old as video games, because tile-based play affords it: fill a screen with destructible tiles and let the character destroy what they touch. The line runs from Dig Dug through Mr. Driller to Shovel Knight and Downwell, and in Schmidt's Dig you hold one block at a time, so excavated earth becomes walls elsewhere {{VwZS0MQSpaU#8}}. In such games the player, not the generator, makes the final layout, and that turns the playability guarantees earlier in this chapter upside down. Pipkin cites SteamWorld Dig's developers making the constant risk of digging yourself into a spot you cannot climb out of the game's main source of tension, so digging becomes route planning {{VwZS0MQSpaU#9}}. Getting stuck, a bug to eliminate in most generators, is the design there. Pipkin also notes that wells in games rarely hold water; they mark thresholds into another world, serving as portals, hideouts, treasure boxes, enemy lairs and shortcuts, as with Tears of the Kingdom's 58 wells or a whole casino down a well in Dragon Quest VII {{VwZS0MQSpaU#13}}.

Younès Rabii's Pokemon Glitch shows what happens when reshaping is random rather than chosen. Randomly moving tiles created new walls and shortcuts but sometimes made essential areas unreachable, and Rabii's only fix was to allow himself cheat codes in exactly those cases {{Ove6z8zDsjE#4}}. Unvalidated change to a level, at generation time or during play, breaks connectivity.

### Generators fed by other data

Coleman builds generators around unusual inputs. A song can generate a dungeon: room size follows the music's energy and enemy count follows detected kicks, hats and snares, so the level has a build-up, boss rooms at the climaxes and a quieter stretch before the exit. In his demo each column of rooms covers about six seconds, detection uses the Minim audio library in Processing, every level has at least one boss room, and values are normalised across the song, so a uniformly loud track works worse than one with highs and lows {{R8DSq8qSJ44@18888#3}}. Blob detection on an image can lay out a floor, with hue choosing enemy types (red regions spawn red enemies, green ones slimes and poison), stairs placed as far apart as possible and the boss in the largest region; fed a live webcam, Coleman reshaped the boss's space with his hand {{R8DSq8qSJ44@18888#6}}. Single-channel texture maps (height, ambient occlusion, roughness) make good planet heightmaps and temperature maps, applying micro-scale surface detail at macro scale {{R8DSq8qSJ44@18888#5}}. The song generator is notable because it borrows a dramatic arc from its input: the structure comes free with the data.

Liza Knipscher's Bioloom uses a different spatial representation altogether: every vertex of its moon mesh stores a list of nearby vertices, so water, grass and fire can spread across a curved surface, with conditions stored as vertex colours {{jBhcHdV5HHo#8}}. Any adjacency structure can carry the spreading rules that grids usually do.

### Optimisers satisfy only what you measure

Aaron Santos tuned generator parameters with mini-batch gradient descent and got exactly what he asked for. A cave generator (sum neighbour values, subtract a threshold, squash through a sigmoid, repeated three or four times) optimised only for 50% density came out half filled but not always connected, because connectivity was never in the loss {{TsDIUuEneo4#3}}. A generator with 36 learned neighbour weights, optimised for minimal corridor density plus maximal connectivity, produced tree-like corridors with many dead ends, because dead ends were not penalised; Santos notes the fix would be another loss term, not a new generator {{TsDIUuEneo4#4}}. The lesson extends to any automated tuning: write down every property of a good level, including the playability checks earlier in this chapter, or the optimiser will trade them away.

### Where generators fail, and what they mean

Pipkin points to Minecraft's Far Lands, where a procedural world's rules falter and glitch at its extremes, and to players who treat reaching them as a goal, one of whom has walked for 12 years and is 58% of the way there {{O78uYtUZKYs#4}}. The boundary of a generator's competence can itself become a destination. Alexandra Leonhart offers a reading of the whole practice: procedural generation's run-to-run deconstruction and reconstruction of spaces resonates with Jack Halberstam's ideas of unmaking, unbuilding and "unworlding" {{R8DSq8qSJ44@28748#1}}.

For conventional generators these experiments suggest three things. Treat any structured data, a song, an image, a texture, as a possible source of shape and pacing {{R8DSq8qSJ44@18888#3}}. Decide deliberately whether getting stuck is a bug or the game, since SteamWorld Dig and Pokemon Glitch sit at opposite ends {{VwZS0MQSpaU#9}} {{Ove6z8zDsjE#4}}. And when you automate tuning, make the playability guarantees part of what is measured {{TsDIUuEneo4#3}}.

## Tensions and open questions

**Intricate or boring layouts.** One line of talks treats space as a field of choices to be made richer: Walker's combinatorially overlapping zones {{lfb6uehmrWo#10}} and Victory's layered choices in a single encounter {{TeURjrAYFEU#13}}. Against it, Tom Francis found intricate zone layouts made Heat Signature a chore and fixed his problems with deliberately boring rectangles {{3vSCncV5hkI#1}} {{3vSCncV5hkI#2}}, and Hoplite carries a near-trivial generator on the strength of its core design {{CLi4PWxDmAI#9}}. Withington's point settles the frame but not the answer: only you know how much variety your other systems already supply {{Ls9wksddN5c#7}}. Francis leaves the remaining question open: how do you keep a game fresh when the differences between levels are trivial {{3vSCncV5hkI#3}}?

**Hide the seam or show it.** Ben Berman wants generated levels to pass as hand-made {{Z6lHExfem6U#5}}, while Perry stopped forcing Mini and Max's handcrafted areas to match its procedural ones because it made them worse {{NlxGPKV0PrY#5}}. Wildermyth treats the line as a cost trade-off {{vtU3Xa0ShKw#15}} {{vtU3Xa0ShKw#16}}, and Garces argues hand-placing wins unless you invest heavily in the algorithm {{6U8c6hbVJLY#6}}. The choice depends on where authored quality matters most (story beats, bosses, the familiar world) and whether the generated parts sit somewhere looking generated is acceptable.

**Small and dense, or vast.** Plummer, for platformers and for co-op play, and Slashie, for open worlds, converge on small, packed spaces {{OVSi3NzA0KM#16}} {{UNBAoc0TJSs#3}} {{R8DSq8qSJ44@32392#5}}, yet Plummer himself defends getting lost in vast space as part of what roguelikes offer {{OVSi3NzA0KM#16}}. On travel, Sunless Sea kept its ship slow because speed would have killed the tension {{FnJxkId-1eE#7}}, while Furmanski abstracts travel between points of interest so distances can be literary rather than walked {{tmrYfnMrifw#8}}. The deciding factors are whether traversal is itself the play, how many players must stay together, and whether distance is meant to be felt.

**How much to plan.** Dormans argues the generator needs a plan {{NjIduRLJL7U#9}}, and Unexplored plans a whole run backwards from its final dragon {{NjIduRLJL7U#10}}; Dormans also found that levels generated entirely in advance become fragile machines that break when the player deviates {{NjIduRLJL7U#12}}. Where exactly to stop planning, and how to make patterns of time and consequence responsive, is unsolved in the talks.

**Getting stuck: bug or design.** Most of the chapter treats a level you cannot finish as a defect: Schlesinger's rule against unintentional dead ends {{5PF9RB0_ifM#5}} and Walker's wells-of-doom fix {{Uo9-IcHhq_w#14}}. SteamWorld Dig makes the risk of digging yourself in its main source of tension {{VwZS0MQSpaU#9}}, and Pokemon Glitch shows the unvalidated middle, where random change sometimes stranded its player {{Ove6z8zDsjE#4}}. The difference is whether the player caused the trap and could have foreseen it.

**Mazes as difficulty or as pleasure.** Swartz reads the genre's twisting mazes as there to slow and befuddle {{IVDN5GDTIvY#4}}; Plotkin argues people walk mazes because the experience is enjoyable {{7h3T5NaFpcI#7}}. Harris's perfect and imperfect mazes are the lever between the two: one forced route, or several to choose from {{b45orGdFwi0#14}}.

**What should persist.** Animal Crossing's generate-once towns build attachment {{TvlZinAvpwg#11}} and Mini and Max's locked seed builds shared conversation {{NlxGPKV0PrY#0}}, while Angband's non-persistent levels, perhaps originally a hack, became core to its identity and its distinctive play style {{eeSk665OXkM#19}}. Who should choose the good worlds, developers or players, and whether parts of a level could be seeded separately, is still an open question {{xju91VGh2Ps#13}}.

**Discrete levels or seamless worlds.** John Bond treats the door between areas as an essential symbol for pacing {{bpGRyzWCWwk#0}}; Noita found static transition rooms clashed with its seamless, destructible world {{huMHQGr8PgM#6}}. Whether your game has discrete levels at all decides which door systems are open to you.

**Variety at depth.** Angband's veterans say uniform generation becomes very boring in its deepest levels, and that attempts to vary them had mixed results {{eeSk665OXkM#17}}. Chunkier variation and landmark levels are the talks' best answers {{wtlLa7BGZcs#9}} {{MHEkE7nPuZc#12}}, but nobody reports having solved sameness over a hundred levels.

## Checklist

- What decisions should a level in your game create, and does its content challenge the player enough for the layout to matter?
- How much variety do your other systems already supply, and so how simple can your layouts afford to be?
- Do your corridor widths, doors and room sizes suit your largest monster, your oddest movement rule and the interface you present space through?
- Is each level sized from traversal, content cost and player count, or from what the generator happens to produce?
- Which parts of your levels should be authored, which assembled, and which generated, and why?
- Can a player learn the rhythm of your authored pieces, and do they look as if someone placed them on purpose?
- Are you combining layout techniques where one alone gives homogeneous output, with a pre-pass that decides large-scale structure?
- Does your generator have a plan (a graph of locks, keys, branches and set pieces), and does it plan space rather than a fixed sequence of events?
- Does your layout have loops where path distance is long, or does it force the player down one route and back?
- Does every level pass connectivity checks that use the game's real movement rules, including gravity and one-way drops?
- Can any item gate depend on itself, and does each gate have more than one solution?
- Do you place monsters, treasure and furniture with rules about spacing, fairness and access, rather than scattering them?
- Could a player name each level by a dominant hazard, biome or landmark?
- Is the join between levels (linear, chosen doors, a map, an open world) chosen for your run's length, pacing and number of major mechanics?
- What persists between visits, runs and players, and is that decision driven by the attachment or shared conversation you want?

## See also

- [11. Generative methods](11-generative-methods.md): the algorithms behind this chapter's layouts, including wave function collapse, grammars and noise, in more depth.
- [10. Content generation](10-content-generation.md): generating the items, monsters and text that furnish a level.
- [06. Combat and tactics](06-combat-and-tactics.md): how terrain, choke points and readable space shape fights.
- [03. Death, difficulty and progression](03-death-difficulty-and-progression.md): pacing a run, branch difficulty and what it means to be stuck.
- [12. Narrative and worldbuilding](12-narrative-and-worldbuilding.md): backstory, generated histories and places that mean something.
- [15. Architecture and tools](15-architecture-and-tools.md): seeds, persistence and building generators you can debug.
