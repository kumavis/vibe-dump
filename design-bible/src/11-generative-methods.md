# 11. Generative methods

Chapters 9 and 10 ask what a roguelike should generate: levels, items, monsters, text. This chapter is about how. It covers the machinery under every generator, from weighted lists, seeds and noise through wave function collapse, constraint solvers, grammars and Markov chains to optimisers, simulated players and language models, and the work around that machinery: deciding whether to generate at all, making the output perceptibly varied, proving it playable, seeing what the generator actually makes, and keeping a person in the loop. It matters because the generator is where a roguelike's runs come from, and so where samey runs, unwinnable seeds and text that falls apart come from too.

The talks approach the subject from many directions: developers explaining shipped systems, researchers presenting formal tools, and artists, musicians and poets borrowing structure from outside games. Their common thread is that a generator is encoded design knowledge, not free content. What makes one good is how its output is shaped, checked and selected, not how much it can produce.

## In brief

- Decide what a generator should do for the player before you pick a technique, and choose generative systems like materials, by the experience you want rather than by what the technology offers {{MHEkE7nPuZc#0}} {{R8DSq8qSJ44@3555#7}} {{mYMdMAvTHpo#0}} {{UGPkEWqwSAY#14}}.
- Do not generate to save work: tuning a generator is a different skill, not an easier one, and its real cost is the design knowledge you have to encode in it {{Uo9-IcHhq_w#1}} {{tmrYfnMrifw#12}} {{BJ_84d7v3K4#3}} {{BJ_84d7v3K4#0}}.
- Unique is not the same as interesting: many talks independently warn that a generator can produce endless outputs players cannot tell apart, so aim for differences players perceive in play {{MHEkE7nPuZc#6}} {{oVhq8V93gHM#6}} {{CLi4PWxDmAI#0}} {{HgnvMBVKP0M#11}} {{BJ_84d7v3K4#5}} {{MHEkE7nPuZc#14}}.
- Treat randomness as an input to an algorithm that carries your intent, and shape it with weights, curves, overdue-event boosts and causal links instead of flat rolls {{TlLIOgWYVpI#1}} {{C6jR41fZjqM#12}} {{WbgdXalXPus#2}} {{otEv5dh2f4E#7}}.
- Derive random values from a hash of the situation and a master seed, with one sub-generator per aspect of the world, so any place can be generated in any order and any player's bug can be reproduced {{e4b--cyXEsM#0}} {{e4b--cyXEsM#1}} {{0jFzBf0mCRY#0}} {{0jFzBf0mCRY#1}} {{0jFzBf0mCRY#2}}.
- Example-based methods such as wave function collapse produce texture cheaply from a tiny drawn sample, but they only know local similarity, so wrap them in higher-level structure or a play-derived skeleton when the level needs global properties {{fnFj3dOKcIQ#1}} {{fnFj3dOKcIQ#6}} {{owmGknfj6H4#18}} {{KWBpQz1mHcA#2}} {{KWBpQz1mHcA#11}}.
- Guide your randomness and then check the result: guarantee anything that blocks progress, such as reachable stairs or a key outside its own door, and let optional content fail occasionally {{TlLIOgWYVpI#18}} {{Uo9-IcHhq_w#17}} {{C7laugXEc9s#3}}.
- Look at a generator in bulk before judging it: expressive range analysis (score many outputs on game-specific metrics and plot them) is the closest thing the talks have to standard practice, and its outliers and clusters tell you which outputs to inspect by hand {{_s-Tn0biyEk#0}} {{60MTG-__dt4#0}} {{Ls9wksddN5c#3}} {{Ls9wksddN5c#6}} {{_s-Tn0biyEk#2}}.
- A solver or simple player model can teach you a lot about generated content: its path through a puzzle or level helps you assess difficulty, consistency and interest {{5PF9RB0_ifM#14}} {{5PF9RB0_ifM#9}} {{5PF9RB0_ifM#13}} {{KfYWVLV5UxQ#7}}.
- Most memorable generated content had a human selecting it, so keep a designer, curator or player between the generator and the audience, and never pipe a language model's raw output to players {{Z6lHExfem6U#18}} {{EMb6B2cIJps#4}} {{xju91VGh2Ps#10}} {{rcIVCrddozQ#11}} {{cIpErjWBqm0#6}} {{VhUh9rksfaE#6}}.

## Deciding to generate: what procgen is for

### Start with the effect, not the technique

Before choosing an algorithm, ask the question at the centre of Isaac Karth's vocabulary for procedural generation: why do you want to generate this particular thing, and what do you hope it does to the player? Karth calls the study of generators by the effect they create in the player "procedural generation poetics", and proposes a set of critical lenses, each a theory that raises its own questions about a generator without claiming to be the only view {{MHEkE7nPuZc#0}}. Gillian Smith reaches the same place from teaching: treat generative systems as materials, like paints, each with affordances, constraints and embedded ethics, and choose among them by the experience you want rather than letting the technology lead {{R8DSq8qSJ44@3555#7}}.

The reason to ask first is that generation is not a neutral default. Alexei Pepers compares procedural generation to fantasy magic: people talk about its power and rarely about its downsides. You would not ask a wizard to fix your fence, because it might become sentient or turn blue, and a generator can likewise do unexpected and very bad things, especially in a newcomer's hands {{mYMdMAvTHpo#0}}.

> Just because Proc Gen is very powerful does not mean it should be used to solve every problem. {{mYMdMAvTHpo#0}}

### Generation has to be part of the design

Two talks argue that generated content only works inside a design built for it. Bruno Dias, writing procedural text for Voyageur, concludes that you cannot swap authored content for procedural content and expect it to work: both the systems and the writing style must be shaped around generation, and procgen must be demystified, taken "out of the grimoire and into the toolbox" {{UGPkEWqwSAY#14}}. Darius Kazemi makes the complementary point from the other side: a game's rules are the context that makes its generated content mean anything. Spelunky's level generator is lifeless on its own and becomes interesting only when you run and jump through its levels; give the game floaty controls or a different jump height and the same levels stop working as levels {{CLi4PWxDmAI#8}}. A good level generator cannot rescue bad movement.

### The visibility problem

A generator that the player never perceives adds little. Gabriel Koenig learned this after releasing Jettomero. Many players play once and stop, and for them a procedurally generated game is indistinguishable from a handmade one; every element could have been built by hand and most players would have had a nearly identical experience {{xju91VGh2Ps#2}}. Jettomero used physics and raycasts to place objects, generated colour palettes, procedural ragdoll animation and monsters assembled from parts. Those systems made development exciting for Koenig, but because they ran entirely behind the scenes the play experience gained almost nothing from them, and Koenig estimates the game would have taken about the same time to make manually. The feature that best showed the generation off was the photo mode, which sat outside the gameplay {{tmrYfnMrifw#12}}. If you generate something, decide where the player will see the difference, and whether they will play enough times to see it.

### Lower the barrier: procgen can be small

None of this means generation has to be grand. Xalavier Nelson Jr. long assumed procgen was for people simulating universes until splitting the word into "procedure" (according to rules) and "generation" (making stuff); by that definition, picking items from lists is as legitimate a route to lots of weird content as deep simulation {{SjttI9N9KSM#0}}. Nelson also reframes the work as making modular pieces that combine into a whole, the windows, doors and garage of a house rather than the house in a day, which is how even Dwarf Fortress's intimidating scope was built up {{SjttI9N9KSM#1}}. Martin Pichlmair draws the same lesson from history: dice and turning wheels forced pre-digital procedural systems to stay lightweight, whereas computers make it easy to build generators that are too complicated, and we have lost the habit of straightforward design {{EMb6B2cIJps#11}}.

The motive for generating has also shifted. Todd Furmanski recalls that procedural generation began as a way to save memory, as in an early Atari game that used a random number generator in about 128 bytes to produce 256 screens; today the motive is that worlds such as simulated cities and galaxies are too large to author by hand {{l9eE4mT8xqI#0}}.

Whatever the motive, do not expect it to save you work. Brian Walker describes procedural level design as a different skill, not an easier one: instead of laying out elements like an artist on a canvas, you build systems, generate, judge which output feels better, and tweak hyperparameters, in Brogue's case for years. Walker says it is not a time-saver, and that most of Brogue's development time went into tuning level generation {{Uo9-IcHhq_w#1}}.

## What a generator is: possibility space, cost and encoded knowledge

### Possibility space and generative space

The rest of this chapter needs two terms that are easy to blur. Oliver Withington distinguishes the **possibility space**, everything representable in a generator's encoding, from the **generative space**, what the generator actually produces. Minecraft's possibility space is anything expressible in its voxels, including player builds its terrain generator never makes; its generative space is what that generator outputs; anything needing a block that does not exist lies outside both. Tuning a generator means moving the generative space so it sits over the good levels, narratives or weapons you want {{Ls9wksddN5c#0}}. Younès Rabii gives the formal version: a generator is a deterministic function from a seed to an artifact, both fixed-size binary strings, characterised by its possibility space (of scale N) and its probability distribution over it. A 1d6 generator has six equally likely outputs; 2d6 has eleven outputs with unequal odds, since many combinations make 7 and only one makes 2 {{BJ_84d7v3K4#1}}.

Gillian Smith frames what the designer is doing with that space: procedural generation means designing an acceptable space of potential experiences rather than one perfectly crafted experience, and that space must feel unified even though no two players take the same path. Thinking in spaces lets players discover the space's odd corners themselves, and even help extend and curate it {{R8DSq8qSJ44@3555#4}}. Everest Pipkin describes the work of building such a space as curation, like assembling an art show, a playlist or a book of poems: learn the ethos of the space, know what is right, then encode that as rules that find the bounded edges of an interesting possibility space and reliably produce that kind of result {{IYNKs8vfocc#9}}.

> To work with generative systems is to be a curator. {{IYNKs8vfocc#9}}

### Rabii's thermodynamics of generators

Rabii's formalism gives the chapter a way to talk about structure, noise and cost with some precision.

- **Complexity of an artifact.** Kolmogorov complexity is the minimum description needed to reproduce an artifact. Rabii compares three 6x6 pixel images coded in PICO-8 Lua: a checkerboard takes about 30 bytes, a flower about 60, and a noisy image has to list every pixel. Low complexity means repetitive, easy-to-spot patterns; high means noise; the in-between is often the most interesting. Exact values are almost impossible to compute but can be estimated {{BJ_84d7v3K4#2}}.
- **Temperature.** A generator's temperature is the average complexity of its outputs: low means structured, high means noisy. A library that returns one of N stored artifacts at random is itself a generator of size N × T bits, which yields an analogue of the ideal gas law, pressure × volume = scale × temperature, and lets the bounds between these variables be plotted {{BJ_84d7v3K4#4}}.
- **States of matter.** On that plot, solid generators are rigid, reliable, repetitive and cheap, and suit hand-made content; gaseous ones lean on random functions and are cheap and unpredictable, always looking different but perhaps not feeling different; liquid generators contain a lot of knowledge and can take distinctly different shapes through tunable parameters, as water takes its container's shape {{BJ_84d7v3K4#6}}.

### A generator's real cost is the knowledge it encodes

Rabii's central claim follows from this. Code can always be padded with long names or dead code, but compress it to the limit and what remains is the crucial information, which Rabii calls the generator's minimum information volume and reads as the designer's knowledge encoded in the algorithm. That knowledge is what the generator really costs, in research, specification, testing and debugging {{BJ_84d7v3K4#3}}. So generators are not free content: practitioners have long known that breadth trades off against depth and quality, which is missing from industry claims that procedural generation and generative AI make content cheaply {{BJ_84d7v3K4#0}}.

Rabii's image for this is Maxwell's demon, the thought-experiment creature whose sorting of molecules has a hidden memory cost. A generator's separation of desirable from undesirable artifacts likewise depends on hidden human knowledge work. Generation only looks cheap if that work is ignored or taken, as when scraped datasets or underpaid labelling are treated as free. Rabii casts roguelike makers as the demons, gardeners and sculptors who know the work is not cheap {{BJ_84d7v3K4#9}}.

### Spaces players imagine, and spaces too big to learn

The space players experience is not exactly the generator's. Cole Wehrle, discussing Oath, adds two regions to it: unseen possibilities, which the game could produce but did not, and imagined impossibilities, which players believe might happen but never can. Wehrle's children invented Minecraft biomes they had heard about on the playground; both regions are part of the game {{HgnvMBVKP0M#3}}.

Size matters too. Paul Hembree's rhythm generator shows how a space can be small enough to learn and love, or explode past human knowledge with one small change. With sixteenth notes in 4/4 there are 431 rotations starting on notes (862 counting rests), which a dedicated person could learn in days; at thirty-second notes there are about 7,000, too many to know without statistical methods {{DJqBTJioVqM#6}}.

The practical consequence: budget for the knowledge you will have to encode, since that, not the code, is the cost. And be clear which space you are adjusting when you tune, the possibility space your representation allows or the generative space your rules actually reach {{Ls9wksddN5c#0}}.

## The oatmeal problem: variety players can actually perceive

### Unique is not the same as interesting

The most consistent warning in these talks is that a generator can produce endless distinct outputs that nobody can tell apart. Kate Compton's name for it, the "10,000 bowls of oatmeal" problem, is relayed by several speakers: Isaac Karth describes generators whose numbers differ but whose outputs blur into mush {{MHEkE7nPuZc#6}}; Pierre Vigier finds their constraint-based room generator yields rooms that are technically different but look alike from the same input {{oVhq8V93gHM#6}}; Todd Furmanski designs Forska's variety specifically against it {{ST6s_8ekeOg#6}}. Darius Kazemi makes the point without the metaphor: trivial code can generate more unique content than anyone could consume, and Markov text or Perlin-noise landscapes look good at a glance but bore within about ten seconds {{CLi4PWxDmAI#0}}.

The same finding turns up in other media. Cole Wehrle notes that every well-shuffled deck is a unique arrangement, yet one random deck feels like another, like one frame of static compared with another; this is why Oath's expansion keeps unused sites in order instead of reshuffling them {{HgnvMBVKP0M#11}}. Sonat Uzun found that random combinations of motifs and context produced many Tea Garden songs that sounded alike, so Uzun had to engineer variation deliberately, adding mechanisms such as a shift motif {{SBjsVcffOHg#6}}. Rabii's formalism explains the convergence: raise a generator's scale or output complexity without adding designer knowledge and it drifts toward a white-noise generator, which is oatmeal {{BJ_84d7v3K4#5}}.

> One random deck feels like another random deck. {{HgnvMBVKP0M#11}}

### Levels of difference

Ada Null, drawing on Compton, gives a scale for how different outputs feel. **Oatmeal** is unique but perceived as identical, like a topiary garden of identically clipped trees. **Perceptual differentiation** is clearly different but not memorable, like a forest of one wild species. **Perceptual uniqueness** is characterfully distinct, like Bosch's Garden of Earthly Delights, and is what most generators aim for: the output players discuss as a one-in-a-million run {{VzoruhRyvqQ#0}}. The scale is a design choice, not a ladder you must climb. Kiss Garden deliberately aims for differentiation while falling short of uniqueness: walking through differentiated trees you know you are not going in circles, yet it is all the same, and that produces the ennui the game is about {{VzoruhRyvqQ#1}}.

### What makes output interesting

Nat Alison proposes three criteria for compelling procedurality: complexity from simple rules, a balance of order and chaos, and surprise and joy {{5_UET-rUtGU#0}}. On the second, complete symmetry is boring and complete randomness intractable; between a uniform grid and white noise sits Perlin noise, which feels naturalistic, and the near-patterns of the primes keep people searching for structure {{5_UET-rUtGU#4}}. On the third, procgen succeeds best when it produces surprisingly poignant, beautiful or funny results, like the Slay the Spire moment when a synergy makes it feel as though the stars are aligning and you are somehow cheating {{5_UET-rUtGU#8}}.

Tyler Coleman adds who does the noticing. Players talk about a generator's artifacts, not the generator, and specifically about the outliers: among 10,000 bowls of alphabet soup, the one that spells something is the one people discuss. Build systems where the right combination of random rolls can produce rare weird results {{C6jR41fZjqM#9}}. Kazemi's preference points the same way: better a Perlin landscape with a big flat rectangle dropped into it than another pleasant, plausible one {{CLi4PWxDmAI#0}}.

### Techniques for perceptible variety

- **Layer many small decisions.** Kazemi describes Spelunky's input as layers of probabilistic tiles: no single decision is complex, but the combinations explode {{CLi4PWxDmAI#7}}.
- **Multiply independent categories.** Furmanski gets more variety per unit of work in Forska by crossing independent axes, such as four geology types times four island shapes {{ST6s_8ekeOg#6}}.
- **Vary the context and the inputs.** Vigier's fixes for samey rooms: vary room shape, wall textures and object skins; do not overuse one template, especially for neighbouring rooms; offer many alternative and optional objects; and let a higher-level generator produce inputs that carry meaning {{oVhq8V93gHM#6}}.
- **Engineer variation where combination is not enough.** Uzun's shift motif exists because random combination alone produced similar songs {{SBjsVcffOHg#6}}.

### Karth's diagnostic lenses

Karth's lenses help you find out why a generator feels flat.

- **Invariants.** What a generator never varies is often its most characteristic trait. A default NetHack level has one up and one down staircase, so when that breaks, players know something is going on {{MHEkE7nPuZc#5}}.
- **Repetition.** Do elements repeat exactly, or resemble each other while staying unique? Not everything must stand out: Emily Short's "mushroom" content, ordinary room layouts or Markov text that matters little individually, forms a useful background carpet of generativity {{MHEkE7nPuZc#13}}.
- **Style.** How well does each artifact fit the context it was generated for? Is the generator smart enough to put a water monster on the swamp level {{MHEkE7nPuZc#16}}?
- **Framing.** How a generator is presented in context and described to the player shapes what players perceive it to have made {{MHEkE7nPuZc#7}}.
- **Multiplicity players can see.** Elite Dangerous generated widely varied space station shapes, but docking required identical docking ports, so players always saw nearly the same thing. Variety the player does not perceive in play does not count {{MHEkE7nPuZc#14}}.

### The trouble with infinity

Linas Gabrielaitis turns the problem on the promise of infinite worlds. Starbound's planets are constrained (ocean on the left, lava at the bottom), and No Man's Sky would by one calculation take 600,000 years to explore; like the Library of Babel, an infinity without meaning leaves the visitor lost {{jvZb9WoIHxo#3}}. The practical aim, then, is not more outputs but memorable differences: decide which level on Null's scale you want, give the player axes of variation they will notice during play, keep some invariants so breaks in them mean something, and make sure the rare outlier is possible.

## Shaping randomness: distributions, weights and causal structure

### Randomness is an input, not the design

Herbert Wolverson draws a principle from Rogue and Dwarf Fortress: in good procedural games the randomness does not define the game. It feeds an algorithm that produces something approximating what the designer wants, different every time {{TlLIOgWYVpI#1}}. Most of the craft is in that algorithm, and much of it is about replacing flat, uniform rolls with distributions that carry intent.

### Making randomness non-uniform

Tyler Coleman's rule is "never roll alone": combine several random values, or take a uniform 0-to-1 random and pass it through an easing curve, so you get a weighted distribution instead of a flat one. Coleman uses curved randoms in many of their games, and suggests weighting barks so a special NPC line appears only a limited number of times {{C6jR41fZjqM#12}}.

Nifflas, generating music, found uniform computer randomness sounds like evenly spread white noise {{WbgdXalXPus#6}}. Three of Nifflas's devices show other ways to shape it:

- **Desire bars.** Each possible note has a desire bar that grows over time, so events that have not happened for a while become more likely. Nifflas can also control when desires are active and building, producing alternating dense and sparse phases {{WbgdXalXPus#2}}.
- **Human-made sequences.** One instrument was driven by number sequences people invented "randomly" in their heads. Their biases, such as repeated 7s, one huge number and a single negative, gave each person's sequence a distinctive melody {{WbgdXalXPus#6}}.
- **Crowd-voted weights.** For a drum instrument, followers voted in polls on each step of a loop, and the averaged results became the probability arrays the device samples from {{WbgdXalXPus#5}}.

When a choice depends on several considerations at once, score it. Jurie Horneman describes dynamic location picking that rates each candidate on several metrics (suitability, recency, distance), combines them with weights into one total, and takes the top scorer or a random pick from the top few. Recency and proximity only exist at runtime, so static data analysis cannot check them, but because the per-candidate values exist they are cheap to print to a log or debug window to see why a choice was made {{FV_0rmqxbxw#9}}.

Weights can also ramp over a game. Todd Furmanski's Dragon's Descent for the Atari 2600 keeps noise tables in ROM, like a pre-baked noise texture, that index ten room types; raising the index range produces more ornate and dangerous rooms with lethal walls, giving Furmanski control over room complexity across levels {{l9eE4mT8xqI#8}}.

### Causal graphs

Alex Byaly's causal graphs make correlated attributes easy to generate. Think of each attribute as a raffle. Roll the cause first, then add or remove raffle tickets for the effect according to the result: roll a character's city, then adjust the weights of crimes in that city. In Byaly's demo, drawing Cliffside adds tickets for slander and tax evasion, Megalopolis for copyright infringement, Agraria for slander. Each city ends up with a distinct crime profile, and the reverse relationship, which city a given crime tends to come from, emerges for free {{otEv5dh2f4E#7}}.

Byaly points out why this is forgiving. Scientists struggle to build models from data because many different causal graphs fit the same data; going from graph to data, that ambiguity frees you to draw arrows in whichever direction is convenient and still get similar-looking results {{otEv5dh2f4E#6}}.

Two cautions. First, the raffles must be run in an order that never goes backwards along an arrow. Byaly orders species, city, food, job, crime; a loop such as species to city to food back to species cannot be honoured in a single pass, and while multiple passes might allow backward arrows, Byaly did not try it {{otEv5dh2f4E#8}}. Second, chained adjustments can compound into extreme quirks: after several arrows were added, Agraria ended up almost unpopulated. You correct this by raising the base tickets or adjusting the tables {{otEv5dh2f4E#9}}.

### Fixed structure, free variation, a designed ending

Two talks from music offer a model for combining authored structure with chance. Matt Carney holds up Terry Riley's In C: 53 fixed melodic patterns played in order, with each performer free to choose how many times to repeat each pattern before moving on {{SU-VcmsOvZo#0}}. One simple proximity rule bounds the space: performers stay within two or three patterns of each other, keeping the piece open without letting it drift apart {{SU-VcmsOvZo#1}}. And the ending is designed: everyone waits on the last pattern until the whole ensemble arrives, the group swells and fades a few times, and players drop out at will. Carney presents this as knowing where to put your thumb on the scale to get a desired outcome while keeping agency even at the end {{SU-VcmsOvZo#2}}.

Sonat Uzun reached the same arrangement in Tea Garden. Its song structures, brief descriptions of which part enters when, are hand-written rather than random, because if enough other elements are random (each song follows a random chord progression) every song still feels different {{SBjsVcffOHg#9}}. You do not have to randomise everything.

### Two kinds of randomness

Not all randomness does the same job. In Q&A at Shawn Main's talk, an audience member observed that removing either kind from a roguelike tends to turn it into a puzzle game: a fixed setup with random results, or a random setup with deterministic results such as a static five damage to a monster. Main said that was a new way of thinking about it {{UZ7XqQYDM7o#15}}. Before you shape a distribution, know whether it governs what the player is handed or what happens when they act.

## Seeds, hashes and timing: when content comes into being

Two linked decisions sit under every generator: where its randomness comes from, and at what moment content is created. The first decides whether you can reproduce a world; the second decides what the world can know about itself.

### Don't generate, hash

Andrew Clifton traces a familiar progression: from one global `rand()`, to separate random number generator (RNG) instances for monster AI, dungeon generation and combat, and finally, taken to the extreme, a fresh RNG seeded per decision and drawn once. That last step is just a poor hash function. Instead, hash the information that uniquely identifies the situation and use the hash as the random value. A hash is a pure function whose outputs look uniformly random, so it can replace RNG calls and makes testing and debugging easier {{e4b--cyXEsM#0}}.

What goes into the hash matters. It must uniquely identify the situation without being over-specific. For a gold pile, hashing only the coordinates would put or omit gold at the same spot on every level; add the dungeon level to fix that, and the game seed so that not every game is identical. Leave the seed out only when you want something identical across all games. Then compare the result to a threshold, say a 10% chance of a pile {{e4b--cyXEsM#1}}.

When one situation needs several values (whether an object exists, its type, its attributes), Clifton combines hashing with SplitMix64. SplitMix64's state update is just adding a stream constant, gamma, which acts as a stream id (good values must be chosen carefully); all the randomness comes from a mixing finaliser. So jumping i steps is state + i × gamma, which works for negative i too and lets you run the generator backwards {{e4b--cyXEsM#3}}. Hash to a seed, then pull values at different indexes: given seed, stream id and index, you get the value at that position, with no state at all {{e4b--cyXEsM#4}}. Clifton is relaxed about small statistical flaws such as the low-end bias from reducing a value with modulo: having never noticed an in-game effect, they do not worry about it for games {{e4b--cyXEsM#2}}.

Alexander Birke reaches a similar design in Sea of Rifts. The game uses stateless hash and noise functions instead of traditional RNGs because the same input always yields the same value, which makes them thread-safe, easy to port to the GPU and easy to extend to more dimensions; Birke says they see no use case left for traditional RNGs {{0jFzBf0mCRY#0}}. Birke insists on determinism for a commercial reason: when you generate a whole world, narrative and cast, bugs will happen, and if you cannot recreate the player's game state you cannot find what went wrong {{0jFzBf0mCRY#1}}. To keep that determinism maintainable, generation is "layer-caked" into one generator per aspect, all seeded from a master world seed held by the world generator. Each has a clear responsibility, like composition in object-oriented code, so a generator can be tweaked or added, whether a cell generator or an abstract one such as names, without changing the others' output {{0jFzBf0mCRY#2}}.

A seed can come from anywhere. bleeptrack's NFC sticker project uses each tag's unique ID as the colour and shape seed for a generative series and its scan counter to shuffle shapes, so every tap adds a new piece to the series {{FWQwtn-46rs#2}}.

### When does content come into being?

At the 2016 lightning talks, Tariq of Catacomb Kids set out the range of answers as an open question. At one end, Dwarf Fortress simulates an entire world history up front; at the other, you generate the next room when the player enters it, or treat an NPC as not existing until the player talks to them {{SDojcmObQzw#1}}.

**Generate on entry.** Sea of Rifts keeps initial world generation short and generates most data when the player enters a cell, which eases iteration. Birke wants to jump to any point in the world for debugging and play, and that rules out solvers like wave function collapse, which grow outward from an initial state {{0jFzBf0mCRY#3}}. Stateless hashing is what makes per-cell, arbitrary-order generation possible.

**Generate lazily, but describe ahead.** Generating late creates a problem if the game wants to refer to things that do not exist yet. Mark Johnson's Ultima Ratio Regum generates its huge world only as needed, for performance and memory, but keeps detailed abstract descriptions of every future feature: the game already knows that a cathedral with certain properties will exist in a certain district. Clues can then reference that abstract description, and when the player arrives the generated cathedral matches, as if it had always been there {{RDWt6RGN9wM#4}}.

**Generate just in time, like a game master.** Sersa Victory and Joris Dormans go further and treat generation as live orchestration, the way a tabletop game master improvises: reseed dangers, enemies and clues according to what the player actually does. Dormans's simple example is Zelda raising the chance of hearts from broken pots when health is low, or arrows when arrows are low {{NjIduRLJL7U#13}}. Content whose source is a creature or an off-screen event suits this. Bane's light-attracted flutter moths, which start fires, can plausibly appear even in a room already visited, so the game can add them whenever it judges there has not been enough action; falling rocks that disturb spores can be dropped off camera via a level-specific encounter table {{NjIduRLJL7U#17}}.

**Generate across time instead of space.** Max Kreminski contrasts two modes. Mining games such as Minecraft distribute generated content across space and generate on demand, so players hunt through many chunks for rare far-flung dungeons. Gardening games such as Animal Crossing distribute it across time and generate on a clock tied to the real calendar, which stops players churning through content as fast as they can click {{TvlZinAvpwg#13}}. Gardening games also use many small, largely independent processes acting on one shared artifact (weeds appearing, which bugs and fish show up on which days, villagers moving in and out) rather than one large visible generator producing disposable artifacts {{TvlZinAvpwg#12}}.

### Choosing a scheme

- If you need to reproduce player bugs or visit any location in any order, derive every random value from a hash of the situation plus a master seed, and give each aspect of the world its own sub-generator {{e4b--cyXEsM#1}} {{0jFzBf0mCRY#1}} {{0jFzBf0mCRY#2}}.
- If generated text or clues must refer to places that do not exist yet, keep an abstract description of them from the start {{RDWt6RGN9wM#4}}.
- If you want the game to respond to how the player is doing, leave room for just-in-time content whose appearance is plausible in the fiction {{NjIduRLJL7U#13}} {{NjIduRLJL7U#17}}.
- If you want content to pace itself, consider distributing it across time rather than space {{TvlZinAvpwg#13}}.

## Building blocks for terrain and space: noise, cells, distance and geometry

### Noise

Perlin and Simplex noise give smooth, continuous values that are deterministic for a given seed, so the same seed always gives the same map. Herbert Wolverson's recipe for an overworld: tune octaves, gain, lacunarity and frequency (the recommendation is to experiment in a noise tool), treat the value as altitude, and threshold it into water, land and mountains. Because noise is continuous under zoom, the same tool serves for clouds, particles and wood grain {{TlLIOgWYVpI#9}}.

A single layer looks dull up close. Wolverson's fix is a second, bumpier noise layer whose share of the blend grows as the player zooms in, adding bays, peaks and valleys while the continent stays coherent. Asked how to avoid samey Perlin overworlds, Wolverson adds mixing in height values from more mountainous maps for mountain regions, and running an erosion simulation, especially with rocks of varying hardness {{TlLIOgWYVpI#10}}.

### Voronoi and Dijkstra maps

A Voronoi diagram assigns each tile to its nearest seed point. The distance metric sets the feel: Euclidean distance gives smooth edges, Manhattan (taxicab) distance gives sharp, man-made shapes, and Chebyshev sits between. Seeds can be random or placed deliberately; even spacing gives a beehive. Wolverson brute-forces the assignment rather than using Delaunay triangulation {{TlLIOgWYVpI#7}}.

A Dijkstra map floods outward from one or more start points, numbering each walkable tile with its step distance and leaving unreachable tiles at a sentinel value. Wolverson treats it as the basis of many map-checking tasks and recommends RogueBasin's article "The Incredible Power of Dijkstra Maps" {{TlLIOgWYVpI#13}}.

### Cellular automata

Ian Holmes defines cellular automata broadly: any lattice of tiles with local neighbourhood rules, updated synchronously or not. That covers Conway-style counting rules, reaction-diffusion, lookup-table reactions and entity-component cells that respond to messages, possibly updating at different speeds. The core is very localised interaction between a cell and its neighbourhood {{b2VkgcC1xRc#1}}.

The neighbourhood is a real choice. Scott Anderson lists von Neumann (the four cardinal neighbours, rarely used for falling sand), Moore (all eight surrounding cells, very common) and Margolus, the one falling-sand games favour. Margolus is a block cellular automaton: it updates each small block in isolation, then offsets the block grid by one on the next update so changes propagate to neighbours, touching a smaller area and fewer cells. Anderson also mentions multi-neighbourhood CA (MNCA) for organic-looking results {{R8DSq8qSJ44@15170#2}}.

Two speed techniques come from Greg L's bit-twiddling talk:

- **Bit-packed Life.** Store cells as packed bits, compute neighbour sums with a convolution, then apply the birth and survival rules (sum is 2 or 3; cell alive or sum odd) with seven bitwise operations that handle eight cells at once, masking away garbage bits. It runs at 180 frames per second on a Game Boy-class fantasy console {{oj3xA28N60I#7}}.
- **Row-at-a-time flood fill.** A per-pixel recursive flood fill over 16,000 tiles is too slow on PICO-8. Treat a row of packed bits as a word, find a run of empty cells with tricks such as subtracting one (which borrows down to the first set bit) and XORing to isolate the changed bits, fill the whole span at once, then recurse to neighbouring rows. Surround the screen with solid so the fill stays bounded {{oj3xA28N60I#5}}.

Local rules also build mazes. Josh Galecki's wheat maze in Moondrop grows by repeatedly opening a candidate tile that has exactly one open neighbour and turning candidates with more than one into walls. The result is a loop-free branching maze that usually spans the grid; all its tiles look alike, so players struggle to tell where they are {{6vMxH6OtI54#4}}.

### Case study: Loren Schmidt's inverse terrain solver

Forward methods have known weak spots. Loren Schmidt found noise-based terrain bad at transitions between terrain types, which makes it hard to vary naturally between kinds of geology {{FaLUhh_Vfmk#5}}. Physical simulation has the opposite problem: control lives in physical processes and material parameters such as a volcano's magma rate, and if you want islands of a particular width and spacing there is no lever for it {{FaLUhh_Vfmk#4}}. bleeptrack hit the same wall outside games: the leaf-vein growth simulation they CNC-milled into a chair's seat and backrest could not be used for the legs, because there was no way to control how the pattern would come out and the legs had to be sturdy {{FWQwtn-46rs#9}}.

Schmidt's answer is to work backwards. Decide the land/water bitmap first, then compute heights by starting at the shoreline (sea level) and walking uphill inward, adding a height step each time. The heights always agree with the map; a square island becomes a pyramid {{FaLUhh_Vfmk#6}}. From there the method is a stack of small, implementable steps:

1. **Noisy steps.** With uniform steps every slope has the same cross-section. Use a random step from a range instead and the slopes turn organic {{FaLUhh_Vfmk#9}}.
2. **Lakes.** Find inland lakes by flood-filling and labelling each connected body of water; any body under a size threshold is a lake rather than ocean {{FaLUhh_Vfmk#7}}.
3. **Colliding fronts.** Run the uphill solver from sea level and lake shores at the same time. The wave fronts meet and form crescents and peaks, and lakes can never sit above the terrain around them {{FaLUhh_Vfmk#8}}.
4. **Continents by voting.** Seed land and ocean and run a voting rule to get cohesive landmasses, then add the features voting would erase, such as inland lakes and island chains. Detect terrain types and populate regions within each to give local geographic flavour {{FaLUhh_Vfmk#12}}.
5. **Regional CA rules.** Seed regions by growing random points until they fill space, then run a different eight-neighbour totalistic CA rule in each patch in parallel, drawn from about 201 curated rules, with patch edges interacting as they develop. This governs regional variation such as island clustering and gaps. Schmidt suggests three-state totalistic rules and rules that distinguish diagonal from orthogonal neighbours for finer shaping {{FaLUhh_Vfmk#11}}.
6. **Per-terrain fronts.** Give each terrain type its own wave-front speed and noisiness. Clean linear fronts produce fluting for hill-and-gully systems; noisy fronts produce fine hills or small ranges. One mountain type is deliberately overpiled above its angle of repose and then settled to the angle its terrain type specifies {{FaLUhh_Vfmk#13}}.

Because the solver separates the land/water map from height generation, the map can come from anywhere: conventional techniques, hand-made patches, or a mix. Schmidt suggests hand-making large features, such as a village on a peninsula, so players learn them, while procedural detail surprises them on each playthrough {{FaLUhh_Vfmk#10}}.

> You can make the whole map or patches of it by hand and then shake out details procedurally. {{FaLUhh_Vfmk#10}}

### Geometry: procedural meshes

Adrian Herbez's 3D-printable generators show the geometric end of the toolkit. In three.js you build a mesh by pushing vertex positions into a list, then defining triangle faces as triples of vertex indices; faces hold no positional data. For a cube, number the eight vertices in a sensible order (around the bottom, then the top) and add two triangles per square face {{SMQuoI_M-kk#1}}. The first step toward a procedural shape is replacing hard-coded coordinates with parameters, such as width, height and depth read from HTML inputs, halved and substituted for the unit coordinates {{SMQuoI_M-kk#3}}. For printing, wind every face counter-clockwise as seen from outside: faces exist from one side only, defined by the normal, and slicing software relies on outward-facing normals {{SMQuoI_M-kk#2}}.

## Generating from examples: wave function collapse and its relatives

### One routine, many maps

Brian Bucklew says that for twenty years they would have written a bespoke algorithm for each kind of map. In Caves of Qud, walled compounds, aqueducts, salt towers and villages, maps of very different character, come from one wave function collapse (WFC) routine fed different tiny training images. WFC was released by Maxim Gumin in 2016, and Qud was its first commercial use {{fnFj3dOKcIQ#0}}. The appeal is the workflow: a designer draws a tiny input in a paint program and gets arbitrarily large outputs that are locally similar to it. Rooms-and-halls, squiggly caverns and a line-and-dots pattern that would traditionally need a recursive builder, cellular automata and a custom line drawer all come from the same code {{fnFj3dOKcIQ#1}}. A five-minute MS Paint sketch of a temple or garden gave layouts that Bucklew says would take a week to approximate with BSP trees and noise maps {{fnFj3dOKcIQ#4}}.

> All of these maps are produced by the exact same technique, literally the same block of code with some tiny different little training inputs. {{fnFj3dOKcIQ#0}}

### How it works

Bucklew's intuition is a pile of cards. Cut the input into every overlapping N×N patch (3×3 in Qud), multiplied by rotations and reflections: a 10×10 image yields 100 cards, up to 800 with symmetry. Put the full set of cards on every output pixel. Then repeatedly find the shortest stack left, pick a random card from it, and remove incompatible overlapping cards from nearby stacks, recursing until the image resolves. Bucklew likens it to Markov chaining words, in two dimensions {{fnFj3dOKcIQ#2}}.

Adam Newgas gives the solver's view. Every tile starts possible in every output cell; the algorithm picks a cell, assigns one of its still-possible tiles, and propagates the rules learned from the sample to rule out tiles in neighbouring cells, using the AC3 arc-consistency algorithm from constraint solvers. Because each pick is made only among tiles already consistent with the rules, the output grows into an image locally similar to the sample but larger, with potentially different global structure {{CS5MUwiVTYE#2}}. In the common **overlapped** variant, every 3×3 patch of the output must match some 3×3 patch of the input, possibly rotated or reflected {{CS5MUwiVTYE#3}}. Its ancestor, **model synthesis**, learns only which tiles may be adjacent, so a bridge learned next to river tiles stays next to rivers, but a forest that was not adjacent to the bridge is free to move, producing global structure the sample did not contain {{CS5MUwiVTYE#4}}. Sergio Garces offers a lighter explanation: it is like playing Carcassonne where you may place any tile as long as edges match. Garces used it in Mekanical Armada to lay out roads, which could not just be random tiles and still make sense {{6U8c6hbVJLY#9}}.

Getting started is cheap. The reference implementation takes about three lines of code and a few parameters: input image, output size, whether to tile at the edges, and a symmetry value from 0 to 8. Bucklew advises setting symmetry to the maximum at first for non-oriented results, then lowering it when you want specific orientations {{fnFj3dOKcIQ#5}}.

### Controls

Newgas notes that Caves of Qud, Bad North, Townscaper and Infinite WaveFunctionCollapse all use WFC, and none uses it exactly as first described; part of the algorithm's appeal is how easily it can be varied {{CS5MUwiVTYE#1}}. The talks describe these levers:

- **Encode meaning as colour.** A plain black square as input gave shapes with no clear inside or outside. When the inside of the square was marked in red, every turn kept red on the same side and the output became enclosed buildings, which Bucklew calls "extremely controllable" {{fnFj3dOKcIQ#3}}.
- **Hero pieces.** Split a large hand-made piece into multi-cell tiles with rules that allow only one possible neighbour for each part. Once one tile is placed, the whole piece is inserted verbatim but still joins the surrounding generation {{CS5MUwiVTYE#5}}.
- **Painted edges instead of a sample.** Annotate tiles with edge types (green connects to green, brown to brown). Covering every combination with a sample makes the sample grow exponentially; edge rules scale better to big tile sets {{CS5MUwiVTYE#6}}.
- **Inpainting.** Fix some tiles in advance, by hand, by another algorithm or by the player, and let WFC fill around them, guaranteeing the generated tiles connect consistently {{CS5MUwiVTYE#7}}. Bucklew notes advanced variants can fill in around hand-placed seeds such as cities dropped into an overworld {{fnFj3dOKcIQ#12}}.
- **Region-driven weights.** The choice of which cell and which tile to pick can be any heuristic and the result stays valid. Qud uses its own region decisions to tell WFC which tiles and weights to use in each area, so one algorithm makes ruins here and forest there; Newgas also shows a temple complex filtered by an overall yin-yang image {{CS5MUwiVTYE#8}}.
- **No randomness at all.** Townscaper always picks the highest-priority tile that fits, and the player paints what they want while WFC chooses tiles and keeps them consistent {{CS5MUwiVTYE#7}}. The solver's inference then produces consequences the designer did not plan: add a house that closes off an area and grass, a high-priority tile, becomes possible where a low-priority patch had to go before {{CS5MUwiVTYE#9}}.

### Limits

The talks that use WFC converge on its weaknesses, and the main ones trace back to the fact that it only knows local similarity.

- **Homogeneous output.** It repeats on the scale of its input, and a huge locally similar map is not necessarily one you want to play {{fnFj3dOKcIQ#6}}. Qud's developers say WFC interiors look the same in every direction {{owmGknfj6H4#18}}.
- **Overfitting.** With a very detailed input of many colours there is only one way tiles can overlap, so the input is just repeated. Bucklew's attempts to encode doors and furniture in the input narrowed the output's variety {{fnFj3dOKcIQ#7}}; a star-shaped input gave less variety for the same reason {{fnFj3dOKcIQ#4}}.
- **Cost.** It is quick on small inputs and very slow on large inputs and outputs {{fnFj3dOKcIQ#6}}. Large ordered structures, such as Greco-Roman temples with big columns, need a large window, which drives memory too high for mobile, so Qud uses WFC mostly where the window can be small, such as ruins and small villages {{fnFj3dOKcIQ#11}}.
- **Contradictions.** WFC is not a complete solver and occasionally contradicts itself; Qud simply retries, since in practice failures are rare and maps usually generate in a fraction of a millisecond {{fnFj3dOKcIQ#12}}.
- **Order of generation.** It grows outward from an initial state, so it does not suit worlds generated cell by cell in arbitrary order {{0jFzBf0mCRY#3}}.

Qud's fix for homogeneity is structural: generate one of several kinds of higher-level structure, such as a circular tower, and fill its interior with WFC {{owmGknfj6H4#18}}. Let WFC supply texture inside a frame something else decides.

### Global constraints and Halina's TRP

Emily Halina presses the local-only limit further. In a key-and-door dungeon (GVG-AI's Zelda, where the player must get a key and then reach a door), WFC produced levels with keys but no door and spiders sealed in their own chambers; it only respects constraints visible locally in the example, and Markov chains share the problem {{KWBpQz1mHcA#2}}. The usual alternative, constructive generation, where designers author "Lego pieces" that an authored generator assembles as in Enter the Gungeon, Hades, Isaac and Slay the Spire, is expressive but expensive: someone must author every piece, the generator, and often constraint metadata such as a room that only fits in a corner {{KWBpQz1mHcA#0}}.

Halina's tree-based reconstructive partitioning (TRP) learns from a single example without asking the designer to write constraints. A Monte Carlo tree search (MCTS) agent plays a human-made source level; the search tree becomes the skeleton of a new level; details are filled in by copying matched segments of the original; threats are placed probabilistically. The designer only tweaks a few parameters {{KWBpQz1mHcA#3}}. In steps:

1. **Binary reconstruction.** Every tile the simulated player visited becomes empty and everything else solid, giving a cavernous outline of a traversable path. MCTS also records where the player died or the level became uncompletable; the designer specifies which tiles count as empty and full {{KWBpQz1mHcA#4}}. More playthroughs give a less restricted level, because the stochastic search takes different routes each time, which suits games with branching paths {{KWBpQz1mHcA#7}}.
2. **Partitioning.** Split the sketch into randomly sized segments, and for each one scan the original level for the section whose solid/empty layout is closest by edit distance, choosing randomly among ties, and paste it in. A path where Mario jumped from one pipe to another gets matched with a two-pipe structure {{KWBpQz1mHcA#5}}.

Segment size is the main dial, trading plagiarism against chaos. Larger segments copy more of the original, which is not always bad: a Mario level without its final staircase would feel wrong. Small segments give chaotic but sometimes useful output, such as floating structures for games with more vertical movement {{KWBpQz1mHcA#8}}. On Zelda, the TRP level resembled the original with moved walls and enemies but stayed completable, while WFC and Markov outputs were mostly unplayable. Deriving the skeleton from a successful playthrough is what carries the global "get the key, then the door" constraint {{KWBpQz1mHcA#11}}. TRP can also use human playthroughs or A* instead of MCTS, though one human path captures fewer alternative routes than a search tree, and it can blend several source levels, such as Mario 1-1 and 1-2 {{KWBpQz1mHcA#15}}. Halina expects it to struggle on logic-heavy puzzles like Sokoban, because partitioning only reasons about local sections and ignores global solvability {{KWBpQz1mHcA#12}}.

### When to reach for example-based generation

Example-based methods pay off when the character you want is easier to draw than to describe: a designer can paint a small sample in minutes and get texture that would take a week of bespoke code {{fnFj3dOKcIQ#1}} {{fnFj3dOKcIQ#4}}. They are weak where the level must satisfy global properties, such as progression, solvability or large-scale order, that no local window can see {{KWBpQz1mHcA#2}} {{fnFj3dOKcIQ#11}}. For those, either wrap the example-based generator inside constructive structure, as Qud does {{owmGknfj6H4#18}}, or take the global skeleton from something that understands play, as TRP does {{KWBpQz1mHcA#11}}, and accept that fully constructive generation buys control at the price of authoring every piece {{KWBpQz1mHcA#0}}.

## Describe the result, not the steps: constraint solving and search

Most generators are recipes: carve a room, then a corridor, then place a door. Constraint-based generation inverts that. You state what a finished output must be like, and a solver searches for one. Adam Newgas frames the move as taking an ordinary solving technique and injecting randomness so that it becomes a generator; the appeal is that you never have to write construction rules directly, yet the output is still varied {{CS5MUwiVTYE#0}}. Wave function collapse, covered earlier in this chapter, is one instance of this family, and Newgas presents it that way {{CS5MUwiVTYE#0}}.

Two benefits come with the inversion. Pierre Vigier argues constraints are intuitive to write (if you want the shower in the corner, you add a constraint saying so) and that they give strong guarantees: any solution the solver returns satisfies every constraint by definition {{oVhq8V93gHM#1}}. Isaac Karth makes a related point about Spelunky, calling it *cohesive*: because its generator can only place elements that fit together, you can throw any settings at it and still get a usable level. Karth adds the limit: cohesion does not help if the generator is assembling the wrong things {{MHEkE7nPuZc#15}}.

### Don't write your own solver by accident

Kate Compton's 2016 warning is about what happens without a solver. Hand-written generators tend either to generate and throw away much of their output or to get neutered into trivial results, such as a straight line because that is the only layout that reliably reaches the exit. Some teams discovered they were really writing a constraint solver and spent years on it, when mature solvers representing around a hundred PhD-years of tuning already existed {{isB82kORimk#11}}. Compton recommends off-the-shelf tools such as answer set programming (ASP, a logic-programming approach where you declare facts and rules and a solver finds models that satisfy them). The talk points to Adam Smith's map-generation speedrun with ASP, which builds a heavily constrained ASCII map generator that requires the player to pass the key before reaching the exit, the kind of rule that is hard to hand-code. Compton concedes that the Clingo solver their group uses is hard to learn {{isB82kORimk#10}}.

> They're hard to learn, but writing your own can be worse. {{isB82kORimk#11}}

### Implementing a constraint satisfaction problem

Vigier's room-furnishing talk is specific enough to build from. Frame the room as a constraint satisfaction problem (CSP): one variable per object to place, each with a domain of all its possible positions, plus constraints such as "the room stays connected" or "this object goes against a wall" or "in a corner". A solution is an assignment of a position to every variable such that all constraints hold. Vigier applies the same frame to monsters, furniture and decorations in dungeons or buildings, and to outdoor structures like swamps or marketplaces {{oVhq8V93gHM#0}}.

The solver is backtracking search, under ten lines: assign variables one at a time, check constraints after each assignment, and back up when a variable's domain runs out. It finds a solution if one exists. On its own it is deterministic, because it tries values in the same order every time; to turn it into a generator, shuffle each domain before you start. Variable order need not be random, and taking the variable with the smallest remaining domain first (the minimum-remaining-values heuristic) speeds it up significantly {{oVhq8V93gHM#2}}.

Speed then comes from making each constraint check cheap {{oVhq8V93gHM#5}}:

- **Unary constraints** (about one object alone) are applied once, up front, by pruning the domain: "against a wall" keeps only the positions in the first row; "in a corner" keeps the four corners.
- **No overlap** is tracked with an occupancy grid updated incrementally as objects are placed and removed.
- **Connectivity** needs a depth-first search over free tiles, which is expensive to run after every assignment. Skip it whenever the free tiles are certainly still one connected piece; Vigier reports roughly an order-of-magnitude speedup from that check alone.

The same pattern extends to propagation-based solvers. Newgas shows that any rule able to say "placing this tile here would cause a problem", such as keeping a path connected end to end, can be bolted onto wave function collapse by running it at every step of the propagation loop. Several such rules run in sequence, each with a veto, to enforce properties the example image never taught the algorithm {{CS5MUwiVTYE#10}}.

### Search by brute force, and how to make it tractable

Not every search needs a formal solver. Jack Schlesinger describes Knotwords' first generator, loosely inspired by binary space partitioning dungeons: fill the grid randomly with fitting words until space runs out, then step backward through earlier decisions trying alternatives, for example swapping "yak" for another word to close remaining gaps. Schlesinger is clear that this only fills the space; it does nothing to make the puzzle good or appropriately difficult {{5PF9RB0_ifM#4}}.

Dead Cells shows how far plain brute force can go in a shipped game. Sébastien "deepnight" Benard explains that the game turns its abstract node tree into a level by randomly picking rooms of the needed type, fitting them by matching exits, and backtracking on overlap. A single level often takes 5,000 to 10,000 tries, more for complex layouts. The prototype's fitter was never replaced; it is what the loading screens are doing. Evil Empire later sped it up by discarding obviously failing cases early, but it is still brute force and players don't care {{QbTnKvRrNYY#9}}.

When the space is too big even for that, the ordering of choices matters. droqen's Sudoku-poem tool places words so that the givens of a Sudoku spell a phrase. Trying every permutation of word positions and running a Sudoku solver on each was far too slow. Noticing that "kill" only works where its double L straddles a row seam, droqen generalised the observation into a function that picks the word with the fewest immediately viable placements, places it first, and branches over the remaining words from there. Cheap tests, such as a repeated letter in one row, reject a placement before the full solver ever runs {{KfYWVLV5UxQ#4}}. Starting from a long word helps for the same reason: it cuts the search space hardest {{KfYWVLV5UxQ#5}}. This is the same instinct as Vigier's smallest-domain-first heuristic: commit early to the most constrained choice, and fail fast.

### What constraints cost

The first cost is contradiction. Newgas warns that the more rules you add to a wave function collapse generator, the more likely it hits contradictions that make it run forever or return nothing, and calls contradictions one of the key hang-ups of this kind of generation {{CS5MUwiVTYE#11}}.

The second is that content constraints take away the designer's usual fixes. droqen's project replaces Sudoku digits with a nine-letter alphabet; the phrase must use every letter so the alphabet is fully defined, or the puzzle will have multiple solutions {{KfYWVLV5UxQ#3}}. A real Sudoku needs exactly one solution. When an ordinary puzzle designer sees an ambiguity between two fives, they add another five as a clue; droqen could not, because there is no extra five in pi, so most of the hand-encoded messages yielded unsolvable or non-unique puzzles {{KfYWVLV5UxQ#2}}. Once the search tool was built, droqen found that phrases yielding a valid Sudoku are rare: the Magpie poem produced ten valid variants, but most phrases tried produced nothing at all {{KfYWVLV5UxQ#6}}. Stack enough constraints and valid outputs become needles. Even then, droqen found the constraints did not settle everything: where the digits went, whether to stack them vertically or let them run diagonally, remained aesthetic decisions, and different encodings of the same message gave visibly different shapes {{KfYWVLV5UxQ#1}}.

The third cost is that some properties resist local rules. Ian Holmes, asked about architectural-looking levels, calls symmetry a global property that rule systems working locally struggle to produce. Holmes suggests combining grammars with Markov chain Monte Carlo (MCMC) methods that stochastically optimise a global cost function, citing procedural alibi generation, which searches NPC backstories until they fit everything the player has seen {{b2VkgcC1xRc#10}}.

### Beyond space: optimisation at runtime

Constraint solving and search are not only for maps. Mark Gritter's Emoji Economy has to allocate each good among competing uses (eat the apples, make juice, make apple butter), and the shares must sum to 100%. Because the utility objective is nonlinear, linear programming is ruled out, so the game uses gradient descent: move in the direction that improves utility, take smaller steps after a step that made things worse, and project any choice that exceeds 100% back to the nearest valid point using a simple published projection algorithm {{Q_MFTUYnaf0#7}}. If your generator produces systems rather than places, the "describe the result" approach still applies; the solver just changes.

## Guaranteeing the output works: solvability, validation and failure

Constraint solvers guarantee what they are told to; most generators guarantee nothing until you check. Chapter 9 covers guaranteeing a playable level in level-generation terms; this section is about the general strategies. A generator that is right most of the time is not finished. Benard sets the bar for a shipped game: you can write a dungeon generator in five minutes, but one that produces good, interesting results every time takes months, and one that is half trash is not acceptable. The work also forced the team to define what a good result was, which they did not know when they began {{QbTnKvRrNYY#4}}.

Herbert Wolverson states the principle several talks share, and makes it the point of the whole talk: guide your randomness, then use algorithms to check that the result matches what you want. Wolverson's example is a lock-and-key generator that, left unchecked, could put the key behind its own door {{TlLIOgWYVpI#18}}. Jack Schlesinger explains why checking cannot be left to intuition. Computers do exactly what they are told, even when it is a mistake, and they are bad at judging whether a step is easy or hard for a human; there are too many generated puzzles to review by hand, so the generator needs ways of culling and scoring its output {{5PF9RB0_ifM#1}}. Yet the same machine is what makes generation worthwhile for puzzles: computers are far better than people at checking solvability and uniqueness, a human usually has to solve a puzzle to know it has a solution, and a hand-authored game caps its puzzles at the level of a designer whom good players should eventually outgrow {{5PF9RB0_ifM#0}}.

### Which failures you can afford

Not every flaw needs a guarantee. Brian Walker draws the line in Brogue terms: a generator can tolerate an occasional edge-case failure, such as an inaccessible reward room, but never one that blocks progress, such as an unreachable down staircase. Always check that the downstairs are reachable from the upstairs, and never let passability depend on destructible terrain. In Walker's platformer, explosives arrive late, alongside mobility items, teleporters and extra lives that act as safety valves, and players who deliberately break a level accept the result. Walker's own test of ambition: if it works in 100% of cases, you aren't being ambitious enough {{Uo9-IcHhq_w#17}}.

Use this as your triage. Spend your guarantees on the critical path, and let decorative or optional content fail now and then.

### Strategies for guaranteeing solvability

**Generate and test.** The simplest strategy is to generate, check, and discard failures. Stella Mazeika says this is how most randomizers ensure shuffled key items stay beatable: place the items, check that each is reachable, and if not, throw the whole placement away and try again. Naive shuffling otherwise creates deadlocks such as needing the flippers to reach the gloves and the gloves to reach the flippers. The cost is generation time, which grows with the number of dependencies and locations; a few newer randomizers use logic or constraint systems instead, and Mazeika wrote the one constraint-based randomizer they know of {{C7laugXEc9s#3}}. Ben Berman puts the strategy in formal terms: every heuristic roguelike level generator is a special case of Markov chain Monte Carlo design, which keeps generating until output fits designer-specified measures such as symmetry or good room layout. The difference is that in a heuristic generator the designer chooses the criteria by hand rather than the computer working them out {{Z6lHExfem6U#1}}. The same family of methods can guide detail as well as accept or reject it; Berman shows Daniel Ritchie's work refining a blocked-out spaceship into a detailed one and arranging furniture in a room over time, which Berman suggests could help 3D roguelikes without tiles, where decorating rooms is hard {{Z6lHExfem6U#4}}.

**Analytic: prove every output is solvable.** Josh Galecki, drawing on training in maths and computer science, distinguishes two ways to guarantee solvable puzzles. The *analytic* way proves that every configuration in the space can be solved; the *constructive* way builds each puzzle around a known solution {{6vMxH6OtI54#1}}. Moondrop's 2x4 Lights Out lantern puzzle is Galecki's analytic example. Toggling a switch twice cancels out regardless of moves in between; sequences exist that toggle the top-left and top-middle switches alone; board symmetry extends those to all eight. Together these prove every state is solvable, so the game can start from any random configuration, the designer never needs to know the solution, and a minimal solution takes at most eight moves {{6vMxH6OtI54#2}}. When you can find such a proof, generation is free: any random state will do.

**Constructive: build the solution in.** Galecki's river-grid puzzle in Moondrop is a 4x4 directed graph where water flows down and right and each vertex's level is the sum of its incoming edges. Locked dams are placed first, then the toggleable dams that must be closed and must be open; the target water levels at four vertices are recorded, and only then are the toggles randomised before the player arrives. A solution exists because that is how the puzzle was built; extra solutions are fine {{6vMxH6OtI54#3}}. Galecki's advice is that it is easiest to start from a solution and add red herrings and traps, and possible but riskier to build up toward one {{6vMxH6OtI54#6}}. Good Sudoku follows the same pattern: Schlesinger's team starts from a filled valid grid, which is easy to make, and removes digits in pairs mirrored across the centre, re-running a solver after each removal to confirm the puzzle is still valid {{5PF9RB0_ifM#3}}.

**Build a solver, and reuse it.** That validating solver earns its cost twice. Schlesinger's team drew on the Sudoku community's catalogued techniques and "deadly patterns", which made ambiguity easy to detect; when the solver hit an ambiguity, the generator knew to go back. As a side effect, the solver powers a verbose hint system {{5PF9RB0_ifM#6}}.

**Refine instead of restarting.** You need not throw away a whole output to fix part of it. Schlesinger compares Knotwords to cellular-automaton cave smoothing, which removes isolated wall pillars while keeping clustered walls. In Knotwords the team keeps regions it likes, such as a good top-left corner, removes the region it doesn't, and steps through better English words to refill it, ending with a cleaner puzzle with less common words and more vowel variety {{5PF9RB0_ifM#10}}.

### How guarantees fail

Search-based generators can fail silently. Galecki's Moondrop maze could, if the algorithm picked the wrong one of two final candidate tiles, wall off its last tile and become unsolvable. The fix: when no open neighbour is found, carve a path toward the start until one is. That guarantees solvability but gives up the maze's no-loops property. The general lesson Galecki draws is that if your algorithm searches for the solution, you must hunt for the counterexample {{6vMxH6OtI54#5}}.

> If your algorithm is searching for the solution you have to be aware of the bugs, and in math speak you have to look for the counter example. {{6vMxH6OtI54#5}}

Patching a failure in place can be worse than regenerating. Aaron A. Reed traces this through Star Trek (1971). Mayfield's original, at line 775, simply restarted generation if the galaxy had no starbase or no Klingon. A later cleanup replaced the restart with a single line that forced one quadrant to a fixed code. That clever-looking fix introduced three bugs: it no longer handled zero Klingons, it changed the counts after they had been shown to the player, and it failed to update the global counters the game used to track the win state, so the game could fail to end {{CE7o3GGif30#7}}. Regenerating is crude, but it keeps every invariant the generator already maintains; overwriting part of an output means re-establishing all of them yourself.

### Counterweight: not every output needs checking

All this can push you toward constraining everything. Two talks push back. Alexei Pepers reports that the Caves of Qud team keeps generators unconstrained by default and adds only minimal constraints once a specific negative impact is proven. Pepers found this surprising, since constraining generators is common advice. For creature placement, a difficulty constraint stops lethal late-game creatures appearing in starting areas, and a biome constraint keeps a sense of place, such as fungi in fungal forests {{H5EU9_Gdu94#16}}. Bjarke Alexander Larsen, building a repeatable logic puzzle in a Discord bot, concludes that you can sometimes get away with unchecked randomness if players have a good way of dealing with the bad outcomes {{gxXZRofE5dI#10}}.

These positions are not in conflict with Wolverson's or Walker's so much as they locate the line differently. The deciding question is who pays when an output is bad. If a bad output blocks progress, check it {{Uo9-IcHhq_w#17}}. If the player has a way to deal with it {{gxXZRofE5dI#10}}, Qud's practice suggests leaving the generator free until you can name the harm {{H5EU9_Gdu94#16}}.

## Grammars and corpora: generating text and structure from rules

The techniques for generating text divide roughly into grammars, which expand symbols into text according to rules you write, and corpus methods, which recombine text you collect. In practice the strongest systems mix them.

### Grammars: assembling human-written chunks

Kate Compton's Tracery is the reference point for many speakers. It is a reusable templating grammar: you write a small JSON file of symbols and rules, and it recursively expands phrases whose symbols refer to other phrases. Compton built it so that nobody would have to build their own templating text system again, comparing it to the one Kingdom of Loathing built. It has been ported to Python, Ruby, Unity, Twine and more, and through the Cheap Bots Done Quick host it runs hundreds of Twitter bots {{isB82kORimk#0}}. Martin Pichlmair used it for a recipe bot and notes that games such as Caves of Qud use it too; producing grammatical sentences is a known difficulty, which Pichlmair says Qud somehow handles {{EMb6B2cIJps#2}}. At the far end of the novelty spectrum, a 2017 lightning talk described a joke compiler from Tracery grammars to Ethereum smart contracts, which its maker billed as the world's most expensive way to generate a bit of text {{H6fPIhLoA1Y#3}}.

Bruno Dias's Voyageur shows how to make grammar text read well. Its descriptions are built mostly from large, human-written chunks, usually whole sentences, through a Tracery-like recursive grammar that picks a paragraph structure, then sentences, then words; little of the text varies down to the individual word {{UGPkEWqwSAY#2}}. The key move is filtering. Following Emily Short's Annals of the Parrigues, where the generator commits to statements as it goes and builds an increasingly detailed internal model, Voyageur first picks baseline facts about a planet (some inherited from region templates, some random), then chooses phrases by priority rules that favour aspects not yet mentioned or a randomly chosen focal aspect {{UGPkEWqwSAY#3}}. The grammar supplies variety; the model keeps the description consistent and moving forward.

Kingdom of Loathing reached similar machinery on its own, and Zack Johnson's account is a practical checklist:

- **Word buckets.** Text fields in the database from which a function pulls a random line, optionally filtered, for example by starting letter or index. Even structured content such as hobo names (first name, last name) adds only a little structure on top {{jNUMRG_tvrY#3}}.
- **Grammar handling.** The team wanted generated writing to be grammatically correct, so its "mad lib" template function handles automatic *a*/*an*, proper-noun capitalisation (to build place names such as a random "colorville"), singular and plural, and gendered forms {{jNUMRG_tvrY#7}}.
- **State within a generation.** A "unique" option asks a bucket for distinct values, so a lizard is never blue with blue stripes; a "reuse" option repeats an earlier pick so the same random thing can be referred to again {{jNUMRG_tvrY#8}}.
- **Rare absurdity by design.** The adjective bucket can call itself, so lucky rolls produce "big big big big big ugly Dan". Johnson's point is to build such recursion in so that it happens only once in a while, which is what makes it remarkable and funny {{jNUMRG_tvrY#9}}.

### Grammars formally, and why they are hard to author

Abdelrahman Madkour gives the formal definition. A generative grammar is a string-rewriting system: start from a sentence, find a non-terminal symbol, and replace it using a rule whose left-hand side matches, until only terminals remain. Each rule's left side is a non-terminal; its right side mixes terminals and non-terminals. Grammars came from linguistics and now underlie city and building generation {{_s-Tn0biyEk#8}}. Madkour's warning is that they are hard to author because rules do not map intuitively to outputs. That is why grammar tools such as CityEngine (a shape grammar for buildings) and SpeedTree (L-systems for trees) are specialised to one domain, and why you cannot reuse them to generate, say, guns {{_s-Tn0biyEk#9}}. Expect to iterate by running the grammar and looking, not by reasoning from the rules.

### Graph grammars: rewriting structure, keeping invariants

The same idea works on graphs. A graph grammar finds a subgraph matching a rule's left-hand side and replaces it with the right-hand side; nodes might be rooms and edges doors or paths. Madkour presents it as the representation behind Joris Dormans-style mission generation {{_s-Tn0biyEk#11}}. Mark Gritter uses graph grammars for economies in Emoji Economy, where production rules match labelled nodes and edges and alter them: one rule inserts a new plant between a source and the sink; a more complex one adds an alternative process producing the same good plus an unconnected byproduct that later rules can use or turn into negative-utility garbage {{Q_MFTUYnaf0#4}}.

Gritter names the strength: graph grammars make it easy to preserve structural invariants. Dormans' Unexplored never puts a key behind the door it opens, and Emoji Economy keeps every good's inputs and outputs hooked up so no consumable is left unused {{Q_MFTUYnaf0#5}}. If your rules each preserve the invariant, every output does, with no separate validation pass. That is a guarantee of the constructive kind described in the previous section.

### Corpora: the source is the design

Markov chains are the classic corpus method. Jason Grinblat's construction: map each n-word prefix in the corpus to the list of words that follow it, then generate by repeatedly choosing a random follower for the current prefix. In "the cat isn't sleeping but the cat is definitely not listening", the order-2 prefix "the cat" maps to both "isn't" and "is". Punctuation is kept. The order *n* controls predictability: a high enough order just reproduces the corpus, and Caves of Qud uses order two {{zDTQM0Ipiz4#1}}. Everest Pipkin gives the same mechanism from "it was the best of times", where "it was" can be followed by "the best", "the age" or "the epoch", and explains why the output feels semi-grammatical yet falls apart in obvious ways {{IYNKs8vfocc#1}}.

Grinblat's central claim is that what makes Markov text interesting is the clever choice and arrangement of the corpus, not the generation rules, which are simple. Grinblat's examples mixed Puppet documentation with H. P. Lovecraft, and LinkedIn recruiter emails with drug-use anecdotes {{zDTQM0Ipiz4#2}}. Pipkin, who curates poetic corpora, converges from the other side: large corpora produce interesting work when artists hand-define rules and constraints that sit on top of the corpus rather than relying on its raw content. Pipkin's examples include Allison Parrish's work with a three-million-line Gutenberg poetry corpus, a bot that collects tweets in iambic pentameter into an endless sonnet, and Jonathan Basile's Library of Babel {{IYNKs8vfocc#8}}. Read together: the corpus is your raw material and your style, and the rules are your editorial hand.

> The clever arrangement of the corpus, the clever choice of a corpus, rather than the rules of actually generating the text. {{zDTQM0Ipiz4#2}}

Grinblat also shows how to tune a Markov generator precisely. A prefix appears in generated text at roughly the frequency it appears in the corpus, as frequency analysis of Qud's chain showed. That makes common prefixes such as "in the" and "to the" usable as hooks for inserting hand-written content {{zDTQM0Ipiz4#9}}. Caves of Qud embeds secrets in its generated books this way, and the rate is set by a formula: secrets to add equals desired secrets per book, times the average number of suffixes per hook, divided by hooks per book. "In the" has around a hundred suffixes. Grinblat aimed for about one secret every four books {{zDTQM0Ipiz4#12}}.

### Names from sound systems

Sraëka-Lillian builds name generators from phonology, the study of a language's sound system and the patterns that shape it. The procedure has three components: a phonemic inventory (which sounds the language has), rules for combining sounds into syllables, and techniques for smoothing where syllables, roots and suffixes join {{XQKNwaCwD-I#3}}. Because names come from a consistent sound system, a culture's names sound related to each other rather than randomly assembled.

### Form as a generated constraint

Clarissa Littler's poetry project generates form rather than words, for a human poet to fill. Because poetry spans many forms, Littler built a family of generators rather than one, starting from the simplest: stanzas of lines whose lengths vary randomly around a mean, shown as dashes per syllable. That produced something like modern free verse, but only a sliver of what poetry can be {{OzCGTXakbjE#1}}. The later generators are worth borrowing for any rhythmic or layout content:

- **Summed waves.** Line length as a function of line and stanza number, built by adding randomly chosen pre-made wave pieces. The result is smooth and varied without feeling either too regular or janky {{OzCGTXakbjE#2}}.
- **Signal functions.** A wave varying across a line: wherever its value is at or above zero, place a syllable; below zero, a space. This interleaves text and white space into broken, deconstructed lines, which generating indentation separately had failed to do {{OzCGTXakbjE#3}}.
- **Grab-bag rhymes.** Pick a number of rhyme endings proportional to poem length, at most about half the line count, and assign them randomly to lines. It produces natural-looking schemes and occasional oddities, such as every line on one sound, which Littler embraced and softened with slant rhymes {{OzCGTXakbjE#4}}.

Littler's warning applies to constraint-based generation generally. There is a sweet spot between freedom and constraint; combining generated stress patterns with rhyme felt over-constrained, more like solving a puzzle than writing poetry {{OzCGTXakbjE#6}}. droqen met the same wall from the other side in the Sudoku poems, described under constraint solving above.

## Generating rules, histories and stories

Levels and text are the comfortable targets. This section covers generators that make the stranger things: the rules of the game itself, the past of its world, and the stories that unfold in it.

### Generating mechanics

Mike Cook argues that roguelikes tend to use procedural generation only for things designers are comfortable generating. Even Brogue's generated levels are full of familiar things like doors, and Cook wants players to meet genuinely new ways to interact with the world: a match-three where swiping subtracts numbers, or Breakout where each brick hit triggers a new rule. These would be hand-built generators, not large language models {{3daNITP9vBc#0}}. Cook then lays out a ladder of approaches, from safest to most expressive.

1. **Rearrange modular content.** Toggle and combine options that already exist to vary a run or campaign, as Invisible, Inc. does with campaign settings and Slay the Spire does with daily-challenge modifiers. Modifiers compound: allowing green cards plus starting with five copies of a random card can give five green cards {{3daNITP9vBc#3}}.
2. **Design languages.** Noita's wand programming, Baba Is You's rule sentences and Caves of Qud's mod data are constrained but expressive languages for describing mechanics, and a generator can write in them too. Designers already build such languages for modders; scoping one to a domain such as spells or potions trades expressivity for focus. Cook used this approach in ANGELINA and Puck {{3daNITP9vBc#5}}. The catch is that a generator has no common sense. Modders learn a tool's limits through play; a generator doesn't, so the language itself must make illegal or absurd statements, such as negative hit points, hard to write, or they will cause glitches and crashes. Cook also notes the "PuzzleScript effect": tools are remembered for their most limit-pushing uses, while AI tends to use the central, intended features {{3daNITP9vBc#6}}.
3. **Generate code directly.** Code is just text, and we know how to generate text. Unity's C# can compile text into an assembly at runtime, which is more expressive than any domain-specific language and stays linked to the codebase as it changes. Cook's tool Pixy is shown the parts of the codebase it may use, with attributes marking data it may or may not touch, and fills an empty code block; it produced a Breakout mechanic where the ball grows. Cook stresses that it knows only your codebase {{3daNITP9vBc#7}}. On constraining it: restrict numbers to sensible ranges, but otherwise give it freedom, because most of the interesting results came from things Cook forgot to forbid {{3daNITP9vBc#12}}.

How do you filter generated mechanics when you cannot write down what "good" means? Cook's answer is to construct a test scenario. In Pixy, put the player in an unwinnable situation where they die next turn, generate an item, have them use it on themselves, and repeat hundreds of times. Any item that saves them is interesting, whatever it does. This works whenever you can recognise a good result even if you cannot specify one {{3daNITP9vBc#10}}.

### Generating histories

A world's past can be generated without simulating it. Jason Grinblat explains that Caves of Qud's sultan histories pick each event at random, then rationalise a cause by querying the sultan's earlier events. A sultan saved by dogs later randomly besieged a city; the description generator found her relationship with dogs and wrote that she fought to liberate them. In Q&A Grinblat adds that a Tracery-like grammar is driven by internal state, so being liked by a faction enables a rule such as "liberate faction" {{ClGAApZYIvI#10}}. The causality is apparent rather than real, and it costs a fraction of a simulation.

> There's no actual inherent cause and effect to the system; we're just picking events randomly. {{ClGAApZYIvI#10}}

Bjarke Alexander Larsen's corrupted-database puzzle goes the other way, because the puzzle needs a ground truth. Larsen simulates 50 to 100 years of people moving house: each person gets an initial address and a history of moves, the newest being current. Then several wrong copies are made by naive random corruption: adding, replacing, removing and shuffling addresses, so each database is wrong in a different way {{gxXZRofE5dI#2}}. The choice between the two follows from use. Qud's histories are read, so they only need to seem caused; Larsen's are deduced from, so they must be consistent underneath.

### Planning stories

Stephen G. Ware summarises 25 years of story planning. A planner treats events, each roughly one sentence (subject, verb, object), as actions with preconditions and effects that change the world, and searches forward from the initial state through all applicable events until it reaches an ending state. Searching over every event sequence is the most flexible approach and the most expensive; reactive planning looks only one or a few events ahead, and storylets are similar to events but scene-sized {{Rs_-yMsJDq8#2}}. World knowledge is stored as variables with values (a character's location, whether they are alive), but Ware says the interesting reasoning lives in metadata about past events and possible futures {{Rs_-yMsJDq8#14}}.

Ware distinguishes two kinds of planner. A *classical* planner needs story context hand-written into preconditions (only rogues steal); in the talk's analogy it puts Lego bricks together any way they fit, so it is up to you that they always look good. A *story* planner lets authors write basic events and infers who acts and why, combining bricks only in ways that make sense, but that requires a formal and complicated model of what makes sense {{Rs_-yMsJDq8#3}}. Ware adds that authoring a set of actions with a target story in mind usually yields something totally different and hilariously terrible {{Rs_-yMsJDq8#14}}.

The practical limits are real. Planning can require searching billions of sequences, and story planners currently manage about 5 to 10 events at runtime. Ware's group speeds them up with heuristics that sketch the rest of the story, by building only plans whose events enable later events, and by restricting events to the people, places and goals salient in the player's working memory {{Rs_-yMsJDq8#10}}. The deeper problem is definitional: formal definitions of story swing between too broad and too narrow, each expansion admitting stories that shouldn't exist and each restriction losing ones that should {{Rs_-yMsJDq8#15}}. Large language models do not dissolve this. Ware finds them good at open-ended storytelling but, surprisingly, no better than older heuristic methods at long-term story planning, and hard to make follow a formal story definition, though thinking models and outline-first approaches are improving {{Rs_-yMsJDq8#11}}.

### Sifting stories from simulation

Planning makes a story happen; *story sifting* finds stories that have already happened in a simulation. Max Kreminski's Felt expresses sifting patterns as Datalog-style logic queries over event sequences, with clauses that constrain event attributes, shared actors and character traits. One example pattern looks for two betrayals perpetrated by the same character, who has the trait *impulsive*, with a not-join clause excluding certain intervening events {{oaDI0lWkedg#3}}. Patterns are groups of interrelated events that make good narrative building blocks, such as love triangles or revenge cycles, so authors should be able to write many of them quickly for diversity; Felt is built in JavaScript on the DataScript library {{BDcZSWHu8RQ#8}}.

Writing them quickly turns out to be the hard part. Authors must learn query semantics that behave more like SQL than Python or JavaScript, learn each simulation's own event types and traits, and remember constraints that seem obvious to a human but that the computer cannot infer {{oaDI0lWkedg#4}}. Kreminski's answer is to synthesise patterns from examples. General program synthesis searches a huge, unbounded space and makes the desired behaviour hard to specify; inductive logic programming instead finds a logic program, a Felt pattern, that separates event sequences you want to match from similar ones you don't {{oaDI0lWkedg#5}}. Kreminski's tool Synthesifter extracts yes/no properties from each positive example (does event three have the tag swing-and-miss? do two events share a batter?) and keeps only the properties shared by all positives, which translate directly into a pattern. Designers first define domain rules, such as what counts as a weak hitter or a pivotal moment in the baseball example {{oaDI0lWkedg#6}}. Earlier, Kreminski had described generating patterns, or replacing them with generic "sifting heuristics" of the kind James Ryan proposed, as unexplored in their lab, and also noted that intern-written patterns made characters see events too similarly {{BDcZSWHu8RQ#16}}.

### Checking a story generator by asking it again

Story generators are hard to evaluate from one output. Jasmine Otto's method is to ask for repeated retellings of the same events, or for new stories, and "converse with the deck": the variations tell you whether it is making principled decisions or starting to contradict itself. Otto notes this works less well in generic story worlds {{NjIDVIIg1lY#2}}. Cook's test scenario for mechanics and Otto's retelling are the same move: when you cannot define quality, build a situation where you will recognise it.

## Seeing what your generator makes: sampling, metrics and expressive range

You cannot tune what you cannot see, and a generator is hard to see. Abdelrahman Madkour says plainly that evaluating whether a generator is any good remains an open research problem; even humans struggle to explain why outputs work {{_s-Tn0biyEk#1}}. Oliver Withington names three reasons: it is trivial to build a generator with quintillions of unique artifacts, each artifact can be slow to evaluate, and quality is subjective (Withington's own two-person team often disagreed about whether a level was good). There is no universal measure, but trying to understand the space is still worth it {{Ls9wksddN5c#1}}.

### Sampling, and why it misleads

The universal first step is content sampling: generate some artifacts and look at them. One good artifact proves good content exists; one broken one proves broken content exists. Withington's caution is that for a large generative space, even many samples can give a myopic view. Sampling may be enough for tightly constrained generators, such as grammars or cellular automata whose trillions of maps tend to look perceptually similar {{Ls9wksddN5c#2}}. Kate Compton describes the alternative state of affairs: it is really hard to understand the space of what you are generating until you have hit refresh a thousand times {{isB82kORimk#13}}.

### Expressive range analysis

The answer the field converges on is expressive range analysis (ERA): generate many outputs, score each on a few metrics, and plot the distribution to see which regions of the design space the generator covers. Madkour credits the idea to Smith and Whitehead, who generated many Mario-style levels, scored each with 0-to-1 metrics such as linearity and leniency, and plotted a heatmap in which darker cells show where more levels fall {{_s-Tn0biyEk#0}}. A 2018 lightning talk relays the same method from Gillian Smith's essay in *Procedural Generation in Game Design*: define metrics such as density or AI-measured difficulty, generate a thousand levels, and see, for instance, that the generator clusters at mid leniency with either very low or very high linearity {{60MTG-__dt4#0}}. Withington describes it identically for Minecraft-like maps (tree coverage, average mountain height), notes it is common in research and used in industry under other names, and says it is most useful when you know what diversity you want, though even without targets it shows what the system can and cannot make {{Ls9wksddN5c#3}}. Three talks across six years describe the same routine, which makes ERA the closest thing to standard practice the talks offer.

> Every piece of content created by the system can be measured and plotted on this n-dimensional generative space. {{60MTG-__dt4#0}}

ERA becomes a steering tool when you repeat it across parameter settings. Change parameters such as maximum level size or number of platforms, re-plot, compare, and choose the setting whose output shape best matches what you want {{60MTG-__dt4#1}}. Compton credits Gillian Smith and Michael Cook with tools that map output across tuning parameters, for example plotting platformer difficulty against tuning values A and B, so you can watch clusters move and slice off bad regions instead of hitting refresh {{isB82kORimk#13}}. Cook's Danesh, a Unity plugin, packages this: visualise the expressive range, click a point to see the level behind it, move sliders to watch the range shift, and run local search to optimise parameters toward a metric {{_s-Tn0biyEk#4}}.

### Choosing metrics

Metrics are proxies, not quality. Madkour is emphatic that they are heavily game-dependent and that you will not get a function that tells you a level is good; pick measurements that matter for your game, such as the number of paths to completion in a dungeon {{_s-Tn0biyEk#2}}. Linearity and leniency are only the canonical example. Number of rooms, number of enemies or how many arms an enemy has are equally valid, and the session's host, Alexei, described building similar visualisations of resource distribution across the map of a AAA survival crafting game {{_s-Tn0biyEk#3}}. Madkour also admits the limit: current metrics are relatively crude and not nuanced enough to capture the design qualities designers care about, and designing better ones is an open question {{_s-Tn0biyEk#14}}.

When you cannot name a good metric, Withington suggests dimensionality reduction. Generated content is effectively a list of values, so, as with correlated variables in a healthcare dataset, you can compress it to two abstract components that explain much of the variance and plot those. The axes are not interpretable, but the plot shows at a glance whether one tuning is more diverse than another, or produces content another generator never would. It works best on small content representations, because these algorithms scale poorly to thousands of variables {{Ls9wksddN5c#5}}.

### Using the plot to choose what to look at

ERA does not replace looking; it tells you where to look. Withington recommends using the visualisation to pick artifacts for hand inspection: the extreme outliers and representatives of each cluster, rather than random samples. Seeing what the generator does when it rolls the equivalent of many sixes in a row tells you whether the extremes are broken or interesting enough to push toward {{Ls9wksddN5c#6}}. The plot also works as pseudo bug-finding. In Withington's toy example, a cluster of maps with 100% water coverage and lots of trees would reveal broken output that even heavy sampling would miss {{Ls9wksddN5c#4}}.

If you are comparing generators, compare fairly. Emily Halina chose comparison levels at random from 100 generated by each approach, so as not to cherry-pick, and turned off Sturgeon's playability constraint because Halina's own method, TRP, has no playability guarantee {{KWBpQz1mHcA#10}}.

### Enumerating the whole space

Sometimes you do not need to sample at all. Mark Gritter points out that because Rogue uses a 32-bit seed, it can produce only about 4 billion layouts per dungeon level, out of an abstract space of around 10^30; virtually every room configuration you could write down is unreachable {{mtSjgxS-QS4#4}}. Enumerating every one turned out to be cheap: Gritter expected to need parallelisation or a GPU, but simply compiling Rogue's generator code ran through all 4 billion seeds in about 11 minutes of CPU time {{mtSjgxS-QS4#5}}. The conclusion is that generators with 32-bit seeds can be fully explored, so a developer could check that nothing bad ever happens across every possible seed {{mtSjgxS-QS4#8}}.

With the whole space in hand, Gritter post-selected on fixed features, such as the smallest possible upper-left room, and plotted room-occupancy heatmaps and the extremes of total room area. Fixing one room's size showed no gross anomalies. Fixing two exact 4x4 rooms left only 209 seeds, which means a seed can be reconstructed from as few as three room configurations {{mtSjgxS-QS4#6}}. Gritter also found that actual Rogue produces fewer very small levels than abstract probability predicts, and is unsure whether that is an artifact of its linear congruential random number generator or just chance; the bet is on chance, and dimensionality reduction has not settled it {{mtSjgxS-QS4#7}}.

### Small, fast checks against targets

Not every generator needs plots. Elliot Trinidad tuned Blaseball's name pool by repeatedly generating ten names, reading them aloud, and checking them against target ratios per ten: one or two absurd or comedic, five to ten that sound explicitly non-white, nine or ten fun to say, perhaps one tongue twister. When too many were hard to pronounce, entries were removed, changed or rebalanced. Trinidad preferred this quick trial and error to writing a tagging program {{9yFferxbrBU#11}}. What makes it work is the explicit target. Reading ten aloud is sampling, but sampling against stated ratios is a cheap form of measurement.

### Looking at output in context

Statistics show the generator in isolation. Mike Cook argues that is not where its meaning lies. Sample grids, statistics and expressive range histograms are useful, and Cook uses them every day, but the way people talk about procgen has barely changed since the early 1980s, and the talk asks what these methods leave out {{nOGNdrjm8ek#0}}. Cook's thesis, drawn from street photography, is that a generator is best understood not through what it generates but through how its output collides with everything else in the game. Analysing generated content alone is like posing it in a portrait studio; games are tangled webs of systems {{nOGNdrjm8ek#1}}. A good street photograph needs at least two reasons to be taken: an inflatable location pin over London's South Bank is one reason, two tourists reading a map beneath it a second. Interesting moments come from independent systems colliding {{nOGNdrjm8ek#2}}.

Isaac Karth's two lenses frame the same choice. You can judge a generator by its individual artifacts, the single snowflake, asking what effect one output has on the player and which differences between outputs matter; or by the impression of its whole generative space, the blizzard, asking what the space feels like overall, whether outputs always or never have some property, and whether connections between them matter {{MHEkE7nPuZc#1}}. Expressive range analysis is a blizzard tool. Cook's method adds tools at three scales:

- **The city.** Ask how each generator contributes to the overall dream of the game. A whole game is as hard to describe as a whole city; Cook notes that Dwarf Fortress's own store page says it is hard to explain how good its generation is {{nOGNdrjm8ek#5}}.
- **The street.** Sample your whole game at one location, like a school field quadrant survey. Stand somewhere, such as Joppa in Caves of Qud, and record every system and source of generated content visible from there and which systems are talking to each other. You are sampling the game, not a generator {{nOGNdrjm8ek#7}}.
- **The lens.** Crop a single object or screenshot and ask what evidence of all your generative systems it shows and what stories it leads the player to. Cook's example is a Dwarf Fortress dwarf description, where you cannot see the fortress or the year but can intuit how generators shaped the dwarf, with credit to Florence Smith Nicholls's work on archaeological game design {{nOGNdrjm8ek#11}}.

Two of Cook's examples double as working habits. Liam Wong's photo *Night City* was made like sampling a generator: Wong shot one Tokyo intersection repeatedly while systems changed at different speeds (rain and advertising boards in seconds, crowds more slowly, the city over decades), then curated one frame and even re-cropped it afterwards {{nOGNdrjm8ek#3}}. And when examining your own game, ration yourself: go in with a "roll of 30 photos" and no more, and you will choose more deliberately what is worth capturing {{nOGNdrjm8ek#13}}.

### A layered routine

The talks do not prescribe a single procedure, but their methods stack naturally into one:

1. **Sample** a handful of outputs to see that good and bad content both exist, and check small samples against explicit targets where you have them, as Trinidad did.
2. **Plot** a large batch on metrics chosen for your game, or on reduced dimensions if you cannot name metrics; re-plot across parameter settings.
3. **Inspect the extremes and the clusters** the plot reveals, treating impossible clusters as bugs. If your seed space is small enough, enumerate it and check every case.
4. **Look in context**: survey one place in the game, crop one screenshot, and ask what the generator's output collides with.

The first three steps tell you what the generator can make. Only the fourth tells you what it means to a player.

## Steering a generator: parameters, optimisation and learning from examples

Seeing a generator's output tells you where it lands. Moving it somewhere else is a separate problem, and the talks offer three answers: expose the right knobs, let an optimiser turn them for you, or show the system examples of what you want and let it learn the weights {{_s-Tn0biyEk#5}} {{TsDIUuEneo4#5}} {{_s-Tn0biyEk#7}}.

### Expose the knobs first

Abdelrahman Madkour's starting principle is to parameterise the generator. Instead of rewriting a hand-built algorithm every time it misses the region of output you want, pull out iteration counts, limits and rule weights so that its expressive range, as plotted in the previous section, becomes something you steer by turning knobs; for a grammar, that means controlling which rules apply or weighting them {{_s-Tn0biyEk#5}}.

Aaron Santos describes what happens when you do not. Generators accumulate magic numbers, values picked until the output looked right, which then interact unpredictably and break when the code or the game's balance changes. Santos opened the source of NetHack, Crawl, Angband and Pixel Dungeon and found undocumented magic numbers within a minute in each, with the designer's intent hard to recover {{TsDIUuEneo4#0}}.

Santos's refactoring makes the generator a pure function of two things: its parameters and its random input. Pull every magic number out as an explicit parameter, and instead of calling `rand` inside the generator, pass the random values in {{TsDIUuEneo4#1}}. That separation is what makes the next two techniques possible: once output depends only on (parameters, random input), you can score it and search over parameters.

### Route one: optimise against a loss function

Santos borrows the loss function from machine learning. Compute metrics on the generator's output, such as density, connectedness, emptiness or jaggedness, compare each to a target value (squared difference works) and sum; Santos found these simple metrics worked well for dungeon generation {{TsDIUuEneo4#2}}. Then tune the parameters by mini-batch gradient descent. Santos used jax, a drop-in replacement for numpy that can differentiate suitably structured programs, to get the slope of the loss with respect to each magic number. Start the parameters at tiny random values, evaluate a batch of 32 random inputs, and nudge the parameters along the slope until they converge {{TsDIUuEneo4#5}}. The batch size is a compromise: one example per step gives a wandering descent path, while huge batches are slow to compute {{TsDIUuEneo4#6}}.

The payoff Santos stresses is not the tuned numbers themselves but what the loss function does for the team. Once it finds good values automatically, you can change the generator or its goals without fear and simply re-optimise, and the metrics inside the loss become lasting documentation of what the generator is meant to do {{TsDIUuEneo4#7}}.

> The loss functions with those metrics inside of them are really good ways to document the goals we are embedding. {{TsDIUuEneo4#7}}

The method has a cost. Differentiable programming needs continuous floating-point parameters, and not all code can be made differentiable. Asked how it compares with a genetic algorithm and a fitness function, Santos's tentative impression was that gradient descent is very efficient while genetic algorithms cope better with discontinuity but may optimise more slowly {{TsDIUuEneo4#8}}.

### Route two: learn from examples the designer picks

Madkour argues against handing control to an optimiser. Brute force, hill climbing or genetic algorithms do work, and a small space can simply be brute-forced, but they hide control inside the search method rather than giving the designer a direct handle on the generative space; you end up dependent on designing the optimisation, which is the same difficulty you started with {{_s-Tn0biyEk#6}}. The two positions are less opposed than they look: Santos's loss function is itself a statement of intent, written as metrics; Madkour's objection is to intent that lives only inside the search.

Madkour's alternative is learning from examples. Plot the expressive range, select the outputs in the region you want, mark those parameterisations as good, and let the system shift the generator toward producing more like them {{_s-Tn0biyEk#7}}. Madkour's implementation controls a graph grammar by recording each output's generation chain: which applicable rule was picked, and which right-hand side of that rule was used. Probabilities live at both levels, so tracking the choices made for the selected outputs lets the system compute new weights. In the demo you select a region, train on it and see the result {{_s-Tn0biyEk#12}}.

The limit is built in. Reweighting changes how often each output appears, not what the grammar can produce. Madkour calls this double-edged: if the grammar is well formed, levels stay playable, but the adjusted generator can never be more diverse than its base grammar, and it does not escape the oatmeal problem described earlier in this chapter, because that comes from the grammar and the metrics {{_s-Tn0biyEk#13}}. Use reweighting to move within a space you already like; use structural changes to enlarge it.

### Lighter levers

Not every generator needs an optimiser. Emily Halina points out that when generation is near-instant, as in TRP, tuning becomes guess-and-check: try values, generate hundreds of levels, look. Halina found segment size somewhat sensitive per domain (smaller for Zelda, column-sized for Mario) but quick to tune with something like a binary search {{KWBpQz1mHcA#9}}. And for a pool-based generator the content is the parameter: Sonat Uzun steers Tea Garden's music by editing the small pools from which motifs are drawn, so different pool contents give different motifs and different songs {{SBjsVcffOHg#3}}.

## Simulated players: solvers, Monte Carlo and tree search as evaluators

Metrics on a map tell you about the map. What a designer usually wants to know is what a player will experience: how hard it is, whether it is consistent, whether it is interesting. A model of the player that actually plays the output can help you assess all three {{5PF9RB0_ifM#14}}. The talks describe three kinds: rule-based solvers, Monte Carlo simulation, and Monte Carlo Tree Search.

### Your puzzle is a secret dungeon

Jack Schlesinger, writing generators for puzzle games including Knotwords, offers a framing that maps cleanly back onto roguelikes: treat a puzzle as a dungeon, where the techniques needed to solve it are the monsters and the order of solving steps is the path through the dungeon. It applies especially to unique-solution, no-guessing puzzles, and Schlesinger's team took many cues from roguelike dungeon generation {{5PF9RB0_ifM#2}}.

Building the solver comes first, and its rules come from people. Play a lot, name the intuitive steps you take, confirm them with statistics over the content, and watch playtesters. In Knotwords an intuition that "EY" almost always appears in that order became a solver technique once frequency analysis over common-word lists showed which letter pairs are ordered one way 90 to 95 per cent of the time; watching where playtesters start, and asking what they think, yields more rules {{5PF9RB0_ifM#7}}.

With a solver in hand, Schlesinger reads three properties off its path:

- **Difficulty.** Score each technique, count them along the solver's path, and run more than one solver. A beginner solver that knows only easy techniques takes a roundabout path; an expert solver shortcuts. Together they tell you how hard the puzzle is for each kind of player. Where no technique catalogue existed, as in Knotwords, they used features instead: letter sets with only one possible ordering are less interesting than those with several valid vowel and consonant positions {{5PF9RB0_ifM#9}}.
- **Interestingness.** Look at how often the same technique repeats ("hidden single, hidden single, hidden single"), whether one dominates, how many different techniques appear, and how different the alternative paths are. For puzzles with guessing, look for spots that are consistently easy or hard versus inconsistent ones {{5PF9RB0_ifM#12}}.
- **Consistency.** Run the solver many times with different seeds and take the population variance of difficulty. High variance means the puzzle is arbitrarily hard or easy depending on the order the player approaches it; Schlesinger wants plenty of difficulty, but not swingy difficulty {{5PF9RB0_ifM#13}}.

droqen converges from the Sudoku side, using an off-the-shelf solver both to validate generated puzzles and to grade them by the strategies they require, a list that came free with the solver library, and keeping only puzzles that can be solved without brute force {{KfYWVLV5UxQ#7}}.

Schlesinger's closing argument turns the framing back on roguelikes: treat a dungeon like a puzzle, and a solver or simple player model can teach you about its difficulty, consistency and interestingness {{5PF9RB0_ifM#14}}.

### Monte Carlo simulation for balance

Phenry Ewing defines Monte Carlo simulation as modelling a complex game system and sampling it thousands of times with RNG and weighted random variables, to predict outcomes too complex to calculate analytically {{Nnx33ctSmRA#0}}. Ewing defends it against the more elegant alternative: analytical models of complex games tend to simplify away the hardest parts. When an MIT professor proposed an analytical treatment of Werewolf, Ewing asked how the professor had modelled the seer, the hardest part, and the answer was that the seer had been ignored {{Nnx33ctSmRA#5}}.

Ewing's warnings are about whether the simulated players resemble real ones. The simulation predicts reality only if the model is fairly accurate, the sample is large enough, and the sampling represents how real players behave: in Ewing's pachinko analogy, you drop balls where real players would, not only down the middle or perfectly evenly {{Nnx33ctSmRA#2}}. Treating every free variable as equally likely is unrealistic; feed the model measured player data where you have it, as was done for Cat Burglar, and informed weighted guesses where you do not, as was necessary for Werewolf {{Nnx33ctSmRA#13}}. In Q&A Ewing agreed it works best for games with limited player actions, and said that without running thousands of real people through a game, player psychology is guesswork {{Nnx33ctSmRA#14}}.

### Monte Carlo Tree Search

Where Ewing's simulated players follow weighted rules, a tree search lets the simulated player look ahead and choose. Lachlan Kingsford wanted their board game to play itself repeatedly and produce statistics before human testers saw it. Kingsford chose Monte Carlo Tree Search (MCTS) over machine learning because MCTS is understandable and can be worked through by hand on a whiteboard, where a neural network is a black box of dot products {{9iTJ9Z8p0ao#0}}.

The heart of MCTS is the upper confidence bound (UCB). Kingsford explains it with four unidentified swords: because hits are random, a great sword may start badly and a bad one may crit, so you try each and favour the better as confidence grows. UCB balances how good an option looks, how sure you are, and how much it has been explored, and at the end you pick the most-visited option {{9iTJ9Z8p0ao#1}}. The algorithm itself is a four-step loop:

1. **Select:** from the root, recursively take the child with the highest UCB (the lowest on an opponent's turn, since opponents minimise your reward).
2. **Expand** the selected node.
3. **Evaluate** it by simulation.
4. **Propagate** the reward back to the root.

Each node stores N, its visit count, and Q, its average reward. More iterations make it stronger, it performs fairly well even at low counts, and the final move is the child with the highest N {{9iTJ9Z8p0ao#3}}.

Two adaptations matter for roguelikes. First, randomness: MCTS works best on deterministic games, but chance can be modelled with "game" nodes whose children are sampled by probability weight, such as the distribution of two dice, rather than chosen by UCB. Kingsford adds such nodes for the game's random setup, and notes that while MCTS can show a game is winnable, quantifying how winnable is hard {{9iTJ9Z8p0ao#14}}. Second, length: chess lasts about 45 moves and Go about 250, but NetHack about 80,000 turns, so random playouts to the end with win/loss rewards teach nothing. Simulate around a thousand turns, score by metrics like health, add intermediate rewards such as approaching the staircase, and cull moves that lose instantly. MCTS optimises exactly what you reward, so reward design is trial and error {{9iTJ9Z8p0ao#4}}.

Emily Halina, whose TRP generator is driven by an MCTS agent, names the adoption cost from the generator side. You need a hand-designed reward function, which takes expert knowledge and trial and error, and a forward model that can simulate the game's future, which is hard if the game was not built to be simulated; you must also encode what counts as an enemy or a goal state, and running and optimising the search takes time {{KWBpQz1mHcA#13}}. If you intend to use simulated players, design the game so it can be simulated from the start.

### Real players as the simulation

The last option skips the model. Ezra Szanton proposes building a deckbuilder's synergy network from analytics, measuring win percentage when players hold particular card pairs, to diagnose whether the game behaves as intended. Szanton has not done it yet, and plans to try it in Mr. Magpie's Harmless Card Game, and flags synergies among three or more cards as unexplored {{JfNeYtH7xI4#11}}.

## Generators a team can work with: languages, pipelines and debugging

A generator is used by people: the engineer who wrote it, designers who feed it content, sometimes players or other artists. Whether it is any good in practice depends as much on the environment around the algorithm as on the algorithm.

### Tools that expose the procedure

Spencer Egart argues that generators can be exposed through content-creation tools that give a non-code interface to the generation procedure, usable by non-engineers, by a team, and by the developer. Egart is careful about "non-code": visual scripting and domain-specific languages are in a way still code; what is meant is not writing code in an IDE {{YfLYPIXGF7E#0}}. Egart's node-based pipelines can branch: a "region has room" node sends BSP regions (rectangles from binary space partitioning) that hold a prefab room out one output and empty ones out another, the empty regions get a padded rectangle carved, and everything feeds back into an A* hallway carver {{YfLYPIXGF7E#3}}.

### A language is its whole environment

Kate Compton, whose Tracery appeared in the grammar section, argues that a generative language is not its syntax but its environment: the IDE, the error messages, the community, the tools and libraries. Processing understood that bundling an IDE, debugger and compiler mattered more than its Java-variant language {{tmrYfnMrifw#20}}. Compton's tongue-in-cheek test is "Compton completeness": can a first-time user make something expressively significant in an hour, on the device they have, connected to a platform that gives it meaning? Tracery alone is not complete; with editors such as artbot.club or the spiral editor, and with Twitter and Cheap Bots Done Quick, the ecosystem is {{E5-3Ui7oO8U#7}}.

Compton adds three properties of good generative languages {{tmrYfnMrifw#21}}:

- **Scaffolded:** they guide the user toward writing correct programs.
- **Unfoldable:** users start simple and add complexity gradually, as HTML runs from plain text to tags to JavaScript.
- **Little:** they fit politely inside other systems, as regular expressions socket into many languages.

Data format matters too. Compton made Tracery for stories, but because it works on plain text, users bent it to ASCII art, SVG, HTML, emoji and JSON; Compton took it further with generators that generate generators, such as an art colony of bots with their own SVG styles that critique each other {{isB82kORimk#16}}. If you design your data to be flexible, users will find uses you did not plan.

Architecture can simplify in the same spirit. Liza Knipscher started Bioloom with separate methods for plants and animals, then realised the creature generator could make trees. Animals, trees, fungi and each tile of grass now come from one generator; grass is the same kind of organism rendered differently, with its own lifespan and metabolism. The result was simpler code and plant-animal hybrids such as a giraffe with trees and an eyed mushroom on its neck {{jBhcHdV5HHo#4}}.

### Debugging what you cannot see

The danger of data-driven generation is that errors multiply silently. Patrick Kemp, describing design tooling at Spry Fox, warns that procedural config patterns are borderline code-like, complicated and unpredictable: a designer who misunderstands one source config can generate lots of bad content without realising it, and tags can connect things that should not be connected {{rWPJ5fW1UH8#7}}. The remedy Kemp wants is a dashboard view that generates many terrains and reports which content is over- or under-used and how often terrain meets the specs gameplay requires {{rWPJ5fW1UH8#13}}. Compton shows a related tool, built by two colleagues for a procedural storytelling game, that maps where combinations of game state have high or low ratios of problems so authors can see whether what they wrote actually covers what can arise; Compton credits this to standardising game logic as data {{isB82kORimk#12}}.

At the low-tech end, Mark Johnson debugs Ultima Ratio Regum's riddle generator by running it in isolation thousands of times and manually checking an illustrative subset. Johnson admits it is done with tremendous difficulty and is not perfect {{RDWt6RGN9wM#10}}.

### Start from the output

Ada Null built Kiss Garden by first writing out by hand what a desired output should look like, then building simple event generators to reach it; with a target in hand, getting there was not hard {{VzoruhRyvqQ#7}}. A hand-written target output gives the team a shared specification before any code exists, and later a reference to compare samples against.

## Humans in the loop: curation, collaboration and responsibility

The generated content people remember usually had a person choosing it. Several independent talks reach this point from different directions, and it changes how you should think about where the human sits in your pipeline.

### Selection is where quality comes from

Ben Berman says influential computer-generated content usually relies on human curation: impressive examples hide that most of the output may not feel human-made, and reaching a high hit rate without curation is the hard open problem. Berman concedes that players do accept randomly placed obstacles in popular games and roguelikes {{Z6lHExfem6U#18}}. Emilia Lazer-Walker compares comedy Twitter bots to Skinner boxes: most output is oatmeal, and the occasional good result keeps people watching. A bot's author can curate, but a real-time generator like Lazer-Walker's Computational Flaneur, which responds to live input, cannot; it can only try to choose poems it thinks will interest you {{MNEG1sLSRcM#10}}.

Martin Pichlmair turns this into a recipe. Discussing the cut-up technique, Pichlmair describes the delightful generative formula as a few rules, plus controlled randomness, plus a human who performs an activity and selects the result. Generators that just hand you results are boring; Pichlmair finds neural language models boring partly for that reason {{EMb6B2cIJps#4}}.
Botnik built a tool on exactly that principle: text generation as an instrument, with a human author intervening after every word, rather than a neural net producing a page of output to laugh at {{IujSOW1OMWk#1}}.

The clearest evidence comes from a game that removed the human. Gabriel Koenig's Test Tube Titans lets players evaluate and select mutations; a late-added auto-mutation used the same process but took one path without player evaluation, and the titans almost always turned out terrible. Koenig likens the player's role to machine learning, random products assessed by trial and error toward a goal {{xju91VGh2Ps#10}}.

### Players as collaborators

If selection drives quality, the player can be the selector. Koenig contrasts their two games. Jettomero created the illusion of a predetermined world; Test Tube Titans was meant to be the opposite, a chance to go hands-on with the procedural systems and take ownership of a mutation system, which changed Koenig's view of generation from a tool to a way of collaborating with players {{tmrYfnMrifw#13}}. Test Tube Titans kept pulling players back because they had an important role in the creative process, and Koenig urges developers to treat procedural generation as a feature that lets players experiment, not only as a content tool {{xju91VGh2Ps#12}}. Even in Jettomero, the photo mode mentioned at the start of this chapter let some players spend more time creatively exploring the procedural world than playing the two-to-three-hour game; Koenig concludes exploration of procedural systems mattered most when it offered creative engagement {{xju91VGh2Ps#3}}.

### The designer's relationship to the generator

For the developer, too, the generator can be a collaborator. Koenig compulsively screenshotted Jettomero's generated spaces and was always excited to see what it would make next {{xju91VGh2Ps#1}}. Alexei Pepers maps the range of attitudes with a set of character classes. The arcane mindset treats generation as a system of rules to master; the divine mindset treats the generator as an external entity that can surprise you, like Darren Grey's "half-wild horse" that Grey steers but which often goes somewhere unexpected {{mYMdMAvTHpo#2}}. The druid tends a generator like a bonsai, observing output and pruning unwanted results while it grows; Pepers says this fits evolutionary algorithms best but feels it even with transparent tools like Tracery {{mYMdMAvTHpo#7}}. The warlock bargains, changing inputs and process until the generator meets them halfway, and the cleric keeps rituals like running a rule twice because it works better; Pepers suspects developers behave like clerics more than they admit {{mYMdMAvTHpo#6}}. The bard embraces procgen's weirdness instead of hiding it to blend with handcrafted content {{mYMdMAvTHpo#4}}, and the sorcerer uses a generator as a mirror for their own ideas, biases and assumptions {{mYMdMAvTHpo#3}}.

Others describe the same partnership in practice. Atty Vohra uses a generator as a "yes, and" improv partner for the lonely work of D&D session prep: a monster that spawns minions when desperate becomes minions that are specters of the characters' loved ones {{0ydWz1EvMJs#7}}. When an output cannot be justified, the curator drops that element and builds on the rest; the generator is a teammate you can say no to {{0ydWz1EvMJs#8}}. Sonat Uzun was often surprised by Tea Garden's music generator, and a glitch that produced an unintended but excellent song led to the idea of making every aspect, including instruments, a motif {{SBjsVcffOHg#4}}.

### The hand-crafted counterweight

Nat Alison's defence of hand-crafted Sudoku complicates the generator-first view from the other end. A solver can produce a puzzle that is technically hand-made yet feels procedural: Alison drew an "@"-shaped whisper-line Sudoku in two minutes, let the tool resolve it, and showed that its small X clues added nothing to the logic and existed only for uniqueness, with no intended solve path {{rcIVCrddozQ#8}}. Used well, solvers shortcut bad paths and test combinations while the constructor works out the human logic, steering toward a unique, meaningful path; in one puzzle a solver revealed an odd parity pattern, and Alison worked out why and built the puzzle around it {{rcIVCrddozQ#9}}. Conversely, the Miracle Sudoku and some puzzles by setter Clypeal are essentially computer-generated yet feel hand-crafted, because the value lies in a human discovering that such a constrained puzzle can exist and curating the most beautiful solve path; Clypeal generated combinations with a program and picked the best of four {{rcIVCrddozQ#10}}. Construction often feels like discovery rather than creation, setting rules and traversing the space of possible worlds like finding a good Minecraft seed {{rcIVCrddozQ#7}}.

Alison's conclusion is that hand-crafted versus procedural is a spectrum, not a binary; what matters is human intent and curation communicating something to other humans {{rcIVCrddozQ#11}}. That fits the curation argument above: the question is not whether a machine was involved but whether a person chose what reaches the player, and why.

### Algorithms do not absolve you

Pepers ends on responsibility. Procgen is not the same as randomness, and algorithms are not neutral: generators carry their makers' biases, biased input leads to biased output, and using an algorithm as an intermediary does not absolve a creator of ethical obligations {{mYMdMAvTHpo#9}}.

## Machine learning and large language models

Machine learning entered these talks in two waves: models trained on game levels, and generators trained on the internet. The lessons differ, but both end at the same place as the previous section: keep a human between the model and the player.

### Learning levels from data

Ben Berman frames machine-learning content generation as a trade-off. Methods like character-level recurrent neural networks (char-RNNs) need a lot of data and give only a broad intuition of what matters; methods like NLP grammars work on tiny corpora because a person has specified the rules. Methods that discover what matters from little data do not exist yet {{Z6lHExfem6U#0}}. Berman's showcase is Adam Summerville's UCSC research: a char-RNN trained on text representations of Super Mario levels produced plausible, playable levels while knowing nothing about jumping or difficulty, assuming only that later parts of a level relate to earlier ones; Berman notes the shown output was probably curated {{Z6lHExfem6U#2}}.

Most of Berman's advice is about encoding:

- **Make it one-dimensional.** Treat a level as a sequence, like a platformer where time moves you forward, and almost every ML tool applies. For 2D games like The Binding of Isaac, express a level as several 1D levels plus a small heuristic tweak {{Z6lHExfem6U#10}}.
- **Read in a snake.** Reading tiles in a snaking order instead of the uneven chunks of off-the-shelf code greatly improved the Mario results; Berman speculates it helps the network count runs, such as six sky tiles, before placing something {{Z6lHExfem6U#13}}.
- **Encode semantics.** Re-encode tiles as categories such as passable, interactable and reward, and record where categories change. Rare features like coins become learnable, and the same encoding lets you train across games {{Z6lHExfem6U#14}}.
- **Denoise as an image.** Noise is the biggest problem: stray blocks break the rules of architecture. Push stray bricks against walls and turn them into bookcases, or tweak one half to mirror the other, removing noise and adding symmetry {{Z6lHExfem6U#15}}.
- **Rip your data.** Modding-community tools can extract training data from existing games; Berman succeeded with all five or six attempted, and a model trained on raw hexadecimal Geometry Dash levels produced levels that could be pasted into the game and played {{Z6lHExfem6U#11}}.

Berman also warns that many public char-RNN implementations are subtly broken, such as a Python bug that duplicated array references instead of copies and sat in widely used code for months, so a failed experiment may be the code's fault, not the method's {{Z6lHExfem6U#12}}.

Against this, Emily Halina explains why procedural generation via machine learning stays rare: games have very little training data. An autoencoder trained on two Mario levels outputs mostly sky above and ground below, the most common chunk it has seen. Halina notes the small models in question use consensual data, a level or two from a designer, and no scraping {{KWBpQz1mHcA#1}}. Two failure modes recur. Todd Furmanski finds ML output can look right but not function, a perfect-looking marble car that cannot drive, which makes post-hoc work with it tricky {{ST6s_8ekeOg#11}}. And uncleaned training data leaks: Lazer-Walker's poetry network kept reading out snippets of poetry-book title pages, so walkers heard lists of years, and Lazer-Walker says a simple Markov chain would have served as well {{MNEG1sLSRcM#13}}. Pepers offers a consolation for opaque models: even when internals are hard to know, you can still look at the outputs and get a sense of the possibility space {{mYMdMAvTHpo#12}}.

### Internet-trained generators: the Baltimore Orioles effect

Janelle Shane names the central hazard of models trained on most of the internet. They confuse terms used in more than one context: a generated "cooking blog" mixed black-eyed peas the food with the band, and an article flip-flopped between the Baltimore Orioles baseball team and the bird {{VhUh9rksfaE#0}}. In DALL-E 2, the Orioles become birds surrounded by oranges, because orioles eat orange slices at feeders; adding "baseball team" to the prompt still leaves them in bird land, and Shane got the team perhaps one time in ten {{VhUh9rksfaE#1}}. Both DALL-E and GPT-3 turn the fossil clam genus Megalodon into a shark-like predator, because the more widely discussed meaning overrides the rarer one; training data reflects human editorialising {{VhUh9rksfaE#2}}.

The same mechanism produces bias. Any generator built on internet data can learn distorted versions of names, ethnicities or groups from wherever they appear online, with results from funny to distressing; Shane cites Robyn Speer's sentiment system, which rated Mexican restaurants negatively despite positive reviews {{VhUh9rksfaE#3}}. This leakage is sneaky and hard to auto-filter, as when a Snickers logo produced sneakers {{VhUh9rksfaE#4}}. Because most leading image generators judge output with the same CLIP model, they share the same failures, and patches like invisibly inserting diversity terms into prompts are opaque, partial fixes {{VhUh9rksfaE#8}}. Opening the model to players adds prompt injection: blocking malicious input with clever prompting is a fool's errand, because your application is only as trustworthy as the model's inclination to follow your prompt over the user's {{VhUh9rksfaE#7}}.

Shane's practical advice comes in two parts. Decide whether to use internet-trained AI before starting a project, and decline to build what would harm even a few people, rather than discovering it at the demo stage when someone types in their own name {{VhUh9rksfaE#5}}. And if you use it, generate and hand-pick ahead of time, for brainstorming, injected randomness or background fill, instead of exposing the generator to player input. The host, Alexei, tied this to the procgen tradition of curation between generator and creator, and Shane agreed AI experimenters could learn from it {{VhUh9rksfaE#6}}.

### Writing with a language model

Robin Sloan's GPT-2 work is a detailed practice for doing exactly that. Sloan's rule matches Shane's: it is never responsible to pipe raw output straight to players or readers, since it can produce anything from mildly gross to horrifying; the mailed quests come from Sloan's system but are heavily filtered {{cIpErjWBqm0#6}}. The techniques:

- **Fine-tune.** The internet-pretrained GPT-2 was fine-tuned on a small corpus of high fantasy novels for about a week, overwriting its sensibility while keeping its grasp of English {{cIpErjWBqm0#5}}.
- **Ask for a sentence count.** Each prompt mixes Sloan's authored text with reader inputs and ends with the number of sentences wanted, a key expressive control for guiding the model at every turn instead of receiving pages {{cIpErjWBqm0#3}}.
- **Accumulate context.** Prompts are chained without clearing context, so earlier generated sentences build a world state; a "land of the dead" introduced early recurred paragraphs later {{cIpErjWBqm0#4}}.
- **Make sharp turns.** Short authored fragments like "a city known for" or "the Dark Lord truly" inject motion or drama and channel the output; Sloan calls them the most fully authored part of the project {{cIpErjWBqm0#10}}.
- **Hide prompts.** Guidance such as "the world was quiet" is fed to the model but not shown, whispering what kind of scene comes next; Sloan thinks this transfers to other neural nets and probably Markov chains {{cIpErjWBqm0#12}}.
- **Veto and regenerate.** Any block that trips a filter is thrown away and regenerated, which Sloan found easier and cleaner than editing or stitching {{cIpErjWBqm0#7}}.

Sloan also asks the prior question. A generator must earn its place by producing beautiful, surprising, guidable language; interest in a technical trick is not enough, and roguelikes show that an old technology can fire the imagination better than a new one {{cIpErjWBqm0#13}}.

### Containing the chaos

Brianna McHorse and Chris Foster describe Hidden Door's architecture as containing generative AI's chaos within order: rules, procedural generation and design provide control, while the language model supplies surprise in bounded places. Ordered systems produce emergent results you can trace to causes; generative AI's outputs are unexplainable and grow less coherent the longer it runs {{aJC3ioashbs#6}}. Wherever possible they reduce a generative decision to a ranking problem, because picking among options is easier than deciding in a vacuum and allows priorities to change later, and they use precomputed word embeddings, such as a genre-ness score, instead of live generation; this is faster, cheaper and easier to debug {{aJC3ioashbs#9}}.

### Who should lead the conversation

Gillian Smith argues that the procedural generation community should lead the public conversation about AI. It can explain generative systems as models, abstractions of reality made by flawed humans, and as media that carry messages and amplify human biases. Roguelike generators are usually treated as a medium, not a replacement for human labour, and this community knows how to design meaningful experiences with generative systems {{R8DSq8qSJ44@3555#6}}.

## Found structures: real-world data, mathematics and the other arts

Most generators are built from designer-authored rules and content. A smaller set of talks takes structure from elsewhere: real-world data, existing games, mathematical objects, and practices from music and art. Coleman presents borrowing data as one possible answer to the oatmeal problem {{R8DSq8qSJ44@18888#10}}.

### Data bending

Tyler Coleman borrows "data bending" from glitch art, where you might open an image in Audacity and band-pass filter it: feed real-world data into game systems it was not made for and see what comes out. Coleman urges designers to be creative and weird with their data sources {{R8DSq8qSJ44@18888#1}}. The method for data-driven generation starts with shape: understand the shape of your input and your output (songs and stock charts are both values over time but fluctuate differently), then what the player needs from it, how to keep the source's flavour, and the worst and best cases. Coleman chose "Mountain King" for a dungeon because its three-act shape with climax and calm suits one, and admits the song dungeons start to look alike because what distinguishes songs is hard to carry over {{R8DSq8qSJ44@18888#10}}.

Coleman is candid about cherry-picking. The Moby Dick world map, with TF-IDF to pick distinctive words for place names, Markov chains for region descriptions and region sizes from chapter lengths, looks perfect because an ocean book suits an ocean map. Run Alice in Wonderland through the same pipeline and you get the same coast and islands with different names, which shows how much comes from the base algorithm {{R8DSq8qSJ44@18888#9}}. Test a data-driven generator on inputs that do not flatter it.

Coleman also notes that who chooses the data matters as much as what it says. A designer-chosen source can be sculpted, edited and used to sneak in the designer's taste; player-supplied input shifts creative labour to the player, so that play becomes exploring the algorithm, and designers can plant goal patterns that reward particular combinations {{R8DSq8qSJ44@18888#11}}.

### Other real-world inputs

Others converge on real-world sources. Max Hawkins's framework for randomising their own life is: make a comprehensive map of the space, sample from it, preferably uniformly at random, commit to the result, and observe what changes {{anwk8b7c_s0#4}}. One app picked random Facebook events from a full city listing and chained them into a schedule with a travelling-salesperson optimisation with time windows, taking Hawkins in Berlin from a children's puppet show to a taxi school to a government energy conference {{anwk8b7c_s0#7}}. But a raw corpus can be mostly noise: the list of extracted actions is full of vague or non-actionable items like "meet a certain goal", and Hawkins has not found the filter that makes it useful {{anwk8b7c_s0#9}}. Jeff Emtman and Martin Austwick's self-generating podcast Neutrinowatch combines pure randomisation, procedural change where each day's output feeds the next, and real-world inputs such as news headlines and planetary movements, as in an astronomy show for a different city each night {{1sZlIfCcz_c#1}}.

Younès Rabii took the most direct route: treat a game's code as DNA and flip random bits in the Pokemon Gold ROM to get a new game. It was chosen because a ROM is easy to mutate, its construction makes a mutant likely to stay playable, and Rabii knows it well enough to spot every change {{Ove6z8zDsjE#0}}. Naive mutation mostly failed: early attempts did not boot or crashed, and only after tuning where and how much to mutate, over about 200 tries, did the result become a game you could play past the first room {{Ove6z8zDsjE#1}}.

### Mathematics as found object

Paul Hembree borrows composer Tom Johnson's idea of the "found mathematical object", by analogy with Duchamp's Fountain: Pascal's triangle, the Narayana series, cellular automata or Euclidean rhythms used as structures that provoke further systems built on top. Hembree notes that Narayana lattice paths look like melodic ornaments such as trills, and that Loren Schmidt's Good Night Traffic City used cellular automata for world generation as a provocation for other systems like growing plants {{DJqBTJioVqM#3}}. The worked example is Bjorklund's algorithm, devised in 2004 for particle-accelerator power supplies, which distributes n pulses over m slots as evenly as possible. For 5 pulses in 12 slots, pair each pulse with a following silence, leaving two silences over; then repeatedly group the longer sequences with the leftover shorter ones until no short sequences remain. Results are most interesting when n and m are co-prime {{DJqBTJioVqM#1}}.

Nat Alison asks generator makers to take the mathematician's view as well as the toolmaker's. Developers use fractals or noise because they make a cool picture or a fun world; mathematicians want to know why the model behaves as it does. Alison suggests prodding your tools: why does a cellular automaton produce interesting results, and what strategy does a deckbuilder run converge on {{5_UET-rUtGU#1}}? A 2018 lightning talk drew the mirror image: procgen designers build generators and try to understand their output, while chaos theorists visualise observed systems, as in Robert May's bifurcation diagram, to find the generator behind them {{60MTG-__dt4#2}}.

### Lessons from the other arts

Mark Gritter connects procgen to serial art, which starts from a rule or set of axioms and produces every artifact satisfying it, presented together; the work is finished only when no possibilities remain, as in Sol LeWitt's 122 incomplete open cubes {{mtSjgxS-QS4#1}}. LeWitt's maxim that "the idea becomes a machine that makes the art" does not mean the artist gives up control, but that they commit to all the consequences of an algorithm {{mtSjgxS-QS4#2}}. For a designer that is a useful discipline: if you keep a generator, accept what it implies, rather than patching every output you dislike.

Matt Carney borrows Robert Carl's distinction, from a book on Terry Riley's In C, between endogenous analysis of a score's materials and exogenous analysis of a live performance. For roguelikes it separates the generator, its grammar and what it can produce, from the player's subjective encounter with one production {{SU-VcmsOvZo#3}}. Much of this chapter's evaluation work is endogenous; the curation and player-model sections are attempts to reach the exogenous.

Finally, Linas Gabrielaitis offers geological folding, where strata move in place by turning over on themselves, as a possible model for a "deep time" procedurality of layered levels. Gabrielaitis presents it as a provocation with a question mark, not a worked mechanic; the host, Alexei, suggested in Q&A that NetHack's bones levels, which fold previous games into future ones, are a kind of proto-folding {{jvZb9WoIHxo#4}}.

## Tensions and open questions

**How much variety to aim for.** Tyler Coleman wants systems where the right rolls produce rare, weird outliers, because those are what players talk about {{C6jR41fZjqM#9}}, and Nat Alison counts surprise and joy among the criteria for compelling procedurality {{5_UET-rUtGU#8}}. Ada Null's Kiss Garden deliberately stops at perceptual differentiation, short of uniqueness, because sameness that is visibly not repetition produces the ennui the game is about {{VzoruhRyvqQ#1}}. The level of difference is a design choice that follows from the feeling you want, not a ladder every generator should climb.

**Constrain or leave free.** Herbert Wolverson's rule is to check every result {{TlLIOgWYVpI#18}}, Sébastien "deepnight" Benard holds that a shipped generator must be good every time {{QbTnKvRrNYY#4}}, and Brian Walker never lets a generator block progress {{Uo9-IcHhq_w#17}}. Alexei Pepers reports that Caves of Qud keeps generators unconstrained until a specific harm is proven {{H5EU9_Gdu94#16}}, and Bjarke Alexander Larsen finds unchecked randomness acceptable when players can deal with bad outcomes {{gxXZRofE5dI#10}}. The choice depends on who pays for a bad output: the player who cannot finish, or a player who can route around it.

**Who controls the terrain.** Noise gives direct, tunable maps but handles transitions between terrain types badly {{FaLUhh_Vfmk#5}}; physical simulation gives natural shapes but no lever for the shape you want {{FaLUhh_Vfmk#4}} {{FWQwtn-46rs#9}}. One of Wolverson's fixes for samey noise is to add simulation in the form of erosion {{TlLIOgWYVpI#10}}; Loren Schmidt's answer is to invert the problem, fixing the shape first and solving for heights {{FaLUhh_Vfmk#6}}. Which you pick depends on whether the shape or the process is the thing you need to author.

**When content should exist.** Dwarf Fortress-style histories up front and generating a room or an NPC only when the player meets it remain the two ends of an open question {{SDojcmObQzw#1}}. Alexander Birke generates each cell on entry, which also rules out wave function collapse for Sea of Rifts {{0jFzBf0mCRY#3}}; Mark Johnson generates lazily but writes abstract descriptions in advance so clues stay true {{RDWt6RGN9wM#4}}; Sersa Victory and Joris Dormans adapt content just in time to how the player is doing {{NjIduRLJL7U#13}}. The deciding factors are whether the game must refer to things before they exist, and whether it should react to the player.

**Uniform randomness is not the goal, but how far to stray?** Andrew Clifton tolerates small statistical flaws such as modulo bias, having never seen them matter in play {{e4b--cyXEsM#2}}; Nifflas deliberately feeds the music human-invented sequences for their biases {{WbgdXalXPus#6}}. Both treat statistical purity as beside the point; they differ on whether bias is merely tolerated or sought out.

**Write your own solver or use one?** Kate Compton warns that teams hand-rolling generate-and-discard systems end up writing a worse constraint solver, and recommends off-the-shelf tools such as answer set programming {{isB82kORimk#11}} {{isB82kORimk#10}}. Dead Cells shipped with its prototype's brute-force room fitter, which takes thousands of tries per level, and players don't care {{QbTnKvRrNYY#9}}. A homemade search is fine when it is fast enough and the constraints are few; the solver pays off as constraints pile up.

**Optimise, or learn from examples?** Aaron Santos tunes generator parameters by gradient descent against a loss function and values the loss as documentation of intent {{TsDIUuEneo4#5}} {{TsDIUuEneo4#7}}. Abdelrahman Madkour argues that optimisers hide control inside the search, and prefers reweighting a grammar toward outputs the designer selects {{_s-Tn0biyEk#6}} {{_s-Tn0biyEk#12}}, while conceding that reweighting can never add diversity {{_s-Tn0biyEk#13}}. Both want the designer's intent explicit; they differ on whether it is better written as metrics or shown as examples.

**Simulate a history, or rationalise one?** Jason Grinblat picks Qud's historical events at random and invents causes afterwards {{ClGAApZYIvI#10}}; Larsen simulates a ground truth because players must deduce from it {{gxXZRofE5dI#2}}. The answer depends on whether the history is read or reasoned about.

**Statistics or context?** Expressive range analysis judges a generator by its distribution of outputs {{_s-Tn0biyEk#0}} {{Ls9wksddN5c#3}}; Mike Cook argues that a generator's meaning lies in how its output collides with the game's other systems, which statistics in isolation cannot show {{nOGNdrjm8ek#1}}. They answer different questions: what the generator can make, and what it means to a player.

**Curation where curation is impossible.** Ben Berman, Martin Pichlmair and Nat Alison place quality in human selection {{Z6lHExfem6U#18}} {{EMb6B2cIJps#4}} {{rcIVCrddozQ#11}}, but Emilia Lazer-Walker points out that a real-time generator cannot curate {{MNEG1sLSRcM#10}}, which is the position of any generator running during play. Berman concedes that players do accept randomly placed obstacles, and calls reaching a high hit rate without curation the hard open problem {{Z6lHExfem6U#18}}.

**What language models are good for.** Stephen G. Ware finds them good at open-ended storytelling but no better than older heuristic methods at long-term story planning {{Rs_-yMsJDq8#11}}. Janelle Shane would generate and hand-pick output ahead of time rather than expose a generator to player input {{VhUh9rksfaE#6}}, and Robin Sloan says never to pipe raw output to players {{cIpErjWBqm0#6}}; Hidden Door does run a model live, but contains it within rules and turns its decisions into rankings wherever possible {{aJC3ioashbs#6}} {{aJC3ioashbs#9}}. The question is less whether to use one than where the boundary around it sits.

**Unsolved problems.** Evaluating generators is an open research problem, and current metrics are too crude to capture what designers care about {{_s-Tn0biyEk#1}} {{_s-Tn0biyEk#14}}. Global properties such as symmetry resist local rules {{b2VkgcC1xRc#10}}, and TRP is expected to struggle on logic-heavy puzzles like Sokoban {{KWBpQz1mHcA#12}}. Formal definitions of story are always too broad or too narrow {{Rs_-yMsJDq8#15}}, and generic sifting heuristics remain unexplored {{BDcZSWHu8RQ#16}}. Learning levels from little data is not yet possible {{Z6lHExfem6U#0}}. Analytics-built synergy networks of three or more cards {{JfNeYtH7xI4#11}}, a filter that turns a noisy real-world corpus into usable actions {{anwk8b7c_s0#9}} and geological folding as a model for layered levels {{jvZb9WoIHxo#4}} are all proposed but untried.

## Checklist

- What should this generator do to the player, and would a hand-made version give a once-through player the same experience?
- Where in play will the player perceive the difference between two outputs, and which level of difference are you aiming for?
- What design knowledge does the generator need, and have you budgeted the time to encode and tune it?
- Are your random rolls shaped by weights, curves or causal links, or are they flat?
- Can you regenerate any location, in any order, from a seed, and reproduce a player's bug exactly?
- When is each piece of content generated, and can the game refer to things that do not exist yet?
- Which global properties (progression, solvability, large-scale order) does your method not see, and what supplies them?
- Which failures block progress, and does an algorithm check for each of them on every output?
- If you patch a failed output in place, are you sure every invariant still holds, or would regenerating be safer?
- Are you writing a constraint solver by accident, and would an off-the-shelf one do the job?
- Have you plotted a large batch of outputs on metrics that matter for your game, and looked at the outliers and clusters by hand?
- Have you looked at the output in context: one place in the game, one screenshot, what it collides with?
- Can a solver or simulated player measure the difficulty and consistency of what you generate?
- Are the generator's magic numbers explicit parameters with documented targets?
- Who selects what reaches the player: you, a curator, the player, or nobody? If nobody, what keeps raw output in bounds?

## See also

- [09. Level generation](09-level-generation.md): what these methods are used to build, including guaranteeing a playable level.
- [10. Content generation](10-content-generation.md): generated items, monsters, names and text that sit on top of these techniques.
- [12. Narrative and worldbuilding](12-narrative-and-worldbuilding.md): generated histories, story planning and sifting in a narrative context.
- [05. Systems and emergence](05-systems-and-emergence.md): the interacting systems that give generated content its meaning.
- [15. Architecture and tools](15-architecture-and-tools.md): seeds, determinism, data formats and the tools that expose a generator to a team.
- [08. Monsters, NPCs and AI](08-monsters-npcs-and-ai.md): Monte Carlo tree search and other search methods used to drive monsters rather than evaluate levels.
