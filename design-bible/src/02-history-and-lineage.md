# 02. History and lineage: where the conventions came from

Permadeath, random levels, letters on a grid and a lone thief who uses magic items he does not understand all feel like the defining parts of a roguelike. This chapter traces where each came from: tabletop wargames and pulp fantasy, the memory limits and terminals of 1970s and 1980s computers, a source code that was never released, and the open-source communities that later forked the games for decades. It then follows the genre into commercial games and asks what it takes to keep the old ones playable.

This matters to a designer because conventions you inherit are hard to question when you don't know why they exist. The talks approach history in three ways: as genealogy (who played what and then built what), as archaeology (recovering lost source and lost authors) and as argument (whether a constraint from 1980 is still a good idea). The chapter keeps all three, and its recurring question is practical: for each habit of the genre, was it chosen or forced, and does it still do something for your game?

## In brief

- The genre multiplied partly because Rogue's source code was withheld: two independent talks say people had to write their own versions, sometimes from memory, which is how Hack and the first wave of roguelikes began {{R8DSq8qSJ44@24276#1}} {{ZMdxP7fO6wE#9}} {{Gs9Nb5ZYRY0#4}}.
- The design motive at the root of the genre is surprise: Michael Toy made Rogue because an authored adventure cannot surprise its own author, and a generated one can {{IaB7iQhts_c#0}}.
- Procedural generation and permadeath began largely as answers to technical limits, not as doctrine, so a designer can choose whether to keep them rather than inheriting them {{CE7o3GGif30#0}} {{ujKlmvfpNMo#11}} {{qogCwa12jEg#2}}.
- The roguelike's hero and quest come from older sources: D&D's wargame and fantasy-fiction roots, Leiber's device-using thief and, probably, Le Guin's amulet quest {{zDKheM-E45I#0}} {{JpX2wWwhKdE#0}} {{JpX2wWwhKdE#1}} {{IVDN5GDTIvY#0}}.
- Several people reached roguelike ideas before or alongside Rogue, and distribution and luck, not priority, decided that Rogue named the genre {{Gs9Nb5ZYRY0#6}} {{CE7o3GGif30#5}} {{xgBGrgucH2s#0}}.
- Much of the genre grew by the "Rogue but more" pattern, and its expansions split into two recurring directions: deeper world interaction (Hack, NetHack) or more content and setting (Moria, Angband) {{eeSk665OXkM#0}} {{ZMdxP7fO6wE#10}}.
- A licence that allows modification can produce either a curated core held by a small team or a family of player-run variants, and variants can keep a game alive for years after its last official update {{Gs9Nb5ZYRY0#7}} {{NMWQIdfCgQg#2}} {{PvMJY8qtmc8#0}}.
- The character grid is a hardware artefact of cursor-addressable terminals and the typewriter, which some designers now keep on purpose to focus on what they think makes roguelikes great {{blXH5pO8GA4#2}} {{6ohPU0sECFE#0}} {{blXH5pO8GA4#1}} {{Zh6dnx9FM1g#0}}.
- Roguelike ideas reached the mainstream by being moved into new forms, from Diablo's "NetHack with graphics and sound" to card games that brought back permadeath {{9V_CkJ66uJQ#4}} {{OwFrTY3IoQQ#0}} {{DT9_7sW5knY#3}} {{NaqP13nkpfU#4}}.
- A game is only truly lost when nobody plays it, and generative games resist documentation, so preservation means keeping them playable and recording how they were made {{b45orGdFwi0#11}} {{jNUMRG_tvrY#15}} {{PvMJY8qtmc8#4}}.

## Before the computer: wargames, pulp fantasy and generative toys

The roguelike did not start with Rogue. Its rules, its hero and even its random dungeons were assembled from older material, and you will understand your inherited conventions better if you know where they were taken from.

### Two roots: the wargame and the fantasy story

Michael Brough describes Rogue and the early roguelikes as digital implementations of Dungeons & Dragons and similar tabletop games, and D&D as having two lines of ancestry {{zDKheM-E45I#0}}. One runs through Chainmail, a fantasy miniatures wargame, back to historical wargames that were used to plan real battles by moving pieces, so the games we play have roots in actual violence {{JpX2wWwhKdE#1}}. The other, less often discussed, is early-to-mid 20th-century fantasy fiction: D&D was an attempt to use wargame rules to play out situations from fantasy novels, and Gary Gygax's reading list in the Dungeon Master's Guide names the authors {{zDKheM-E45I#0}} {{JpX2wWwhKdE#1}}.

> Dungeons and Dragons has two main branches of ancestry. {{JpX2wWwhKdE#1}}

Brough's most concrete example is the roguelike's central figure: a thief who picks up magic devices and works out how to use them. He traces it to Leiber's Gray Mouser, a thief with failed magician training who reads a scroll that destroys sorcerers of lesser rank. D&D's designers wanted scenes like that to be possible at the table, so the rogue class, not the fighter or the barbarian, got the ability to use wands and scrolls; Rogue then built its hero around exactly that behaviour {{JpX2wWwhKdE#0}}.

Fiction shaped the quest as well as the hero. Noah Swartz emailed the Rogue developers to ask about Le Guin's The Tombs of Atuan, and Michael Toy replied that he had read it several times and that it probably influenced, subconsciously, what went into Rogue: the quest for the amulet, and also the emotional rollercoaster and real consequences {{IVDN5GDTIvY#0}}.

Brough also argues that format shaped the stories, and the stories shaped play. Pulp short-story magazines were an accessible market that favoured episodic rogue protagonists over epic heroes, since a few-page adventure has no room for epic scale; a weekly tabletop group needs every session to be worthwhile in itself, which the self-contained pulp adventure fits {{zDKheM-E45I#2}}. Read that way, the roguelike run, one self-contained adventure that matters on its own, may inherit a structure that began in magazine fiction.

The people who first put this on computers were players before they were designers. David Craddock describes Michael Toy, Glenn Wichman, Ken Arnold and Don Worth as sharing an all-consuming passion for D&D and rare early access to computers, and wanting a computerised D&D that offloaded the dice rolling and calculation; most were college students whose GPAs soon suffered {{Gs9Nb5ZYRY0#0}}.

Even the genre's name is contested evidence. Glenn Wichman has said Rogue was called that because the word is short and quick to type in a Unix terminal. Darren Grey does not think that is the whole story: calling it "Hero" would have meant something different, and a message relayed from Wichman during Grey's Q&A added that being a rogue also meant being alone rather than part of a team {{C2sm-z7Ag4U#1}}. Whatever the motive, the word's connotations travelled with the game.

### Generators and borrowing before software

Random content generation is older than the computer too. The earliest random dungeon generator John Harris found is Gygax's dice-table article in the first issue of TSR's The Strategic Review, later expanded into an appendix of the first-edition Dungeon Master's Guide. Harris finds it laughably complete, rolling for corridor lengths and branches, yet it produces a layout of rooms that means nothing, and he says some roguelikes feel the same {{KY-TmRw5sR8#4}}. That is a warning still worth heeding: a procedure that covers every case can still produce nothing worth exploring.

Martin Pichlmair pushes further back. The Fünffacher Denckring of the German language, a stack of rotating paper disks for composing words, was a pre-digital text grammar, and it was meant as a playful social game in which you invented a meaning for each word it produced, not as a research tool {{EMb6B2cIJps#3}}. The generator's value was in what people did with its output. Pichlmair also traces Mahjong's lineage from a 1600s Chinese ancestor through the Philippines and Mexico into Rummy, Canasta, American Mahjong, Rummikub and the unrelated digital Mahjong solitaire of 1981, to argue that games have always referenced and versioned each other, more widely across the world than we tend to think {{EMb6B2cIJps#1}}.

Two other talks show generative ideas emerging from play and from tradition. Phenry Ewing tells how the Monte Carlo method began with the mathematician Ulam, bedridden after brain surgery, trying to work out the odds of a winning solitaire deal; when the analysis was too complex, he proposed dealing repeatedly and dividing wins by attempts, and von Neumann's ENIAC ran the simulation {{Nnx33ctSmRA#1}}. Paul Hembree describes how Godfried Toussaint noticed that Bjorklund's algorithm shares the recursive shape of Euclid's GCD algorithm and that its outputs match traditional musical rhythms, finding 98 examples; traditional musicians were not using any algorithm, they had found the same patterns {{DJqBTJioVqM#2}}.

### Reading the ancestors

Brough ends with a problem he does not solve. Older fantasy sources often carry sexist and racist attitudes that make them uncomfortable to read; he contrasts The Night Land (1912), whose sole female character is helpless, with later works. His only answer is to read widely across time, which shows progress in social attitudes, while insisting that art itself has not progressed and older work should not be dismissed {{zDKheM-E45I#12}}.

**In practice:** read and play your genre's ancestors. The thief with the scroll {{JpX2wWwhKdE#0}}, the amulet quest {{IVDN5GDTIvY#0}}, the self-contained session {{zDKheM-E45I#2}} and the room-and-corridor table {{KY-TmRw5sR8#4}} each came from a specific source with specific reasons. When you know the reason, you can tell whether it applies to your game.

## Proto-roguelikes: the games Rogue did not name

Rogue was not the first game with roguelike ideas. Several people reached similar designs around the same time, and which one named the genre came down to circumstance: how a game was distributed, whether it survived, and whether the institution it ran on tolerated games at all {{Gs9Nb5ZYRY0#6}} {{ohH6LBM2EiU#2}}.

### Distribution decided the name

David Craddock opened his book with Beneath Apple Manor because many people had the same ideas at once. Rogue, not that Apple II game, gave the genre its name largely because Rogue spread over networks while Beneath Apple Manor was rarely taken online; Glenn Wichman himself remarked that it was lucky the genre came to be called roguelike {{Gs9Nb5ZYRY0#6}}.

### Randomness against the equation

Aaron Reed sets early games in two camps. Early computer wargames, business simulations, Hammurabi and Lunar Lander were fully deterministic equation-solvers: the player supplied variables to a fixed formula, and Lunar Lander is a game about doing calculus with no randomness. These games were fun as novelties but feel stale now, and people trying to capture something more human kept returning to randomness {{CE7o3GGif30#2}}. In the other camp is Mike Mayfield's 1971 Star Trek, written by a high school senior, with a randomly generated galaxy of Klingons each play. Reed argues it has a lot in common with the genre Rogue would later name, down to the chance of starting next to a Klingon and getting screwed by the random number generator {{CE7o3GGif30#5}}.

### Chase: a proto-roguelike assembled by many hands

Dan Norder's history of Chase shows a game's rules accumulating across variants, which is how the roguelike itself would later grow. Chase was probably created in Dartmouth BASIC. BASIC was made at Dartmouth in 1964 to be usable beyond science and maths students, and up to 85% of Dartmouth students used it from teletype terminals, sharing and adapting programs. John Kemeny encouraged games there because he thought they would popularise the language, unlike institutions that deleted games found on their machines {{ohH6LBM2EiU#2}}.

> If they saw you were using up the university resources to have a game they would delete it. They lost a lot of really good games that way. {{ohH6LBM2EiU#2}}

No original copy survives {{ohH6LBM2EiU#2}}. Chase first appears in Creative Computing's first 1976 issue, where you could only move in eight directions and could not even wait in place. An assembly port added the first teleport ("P" for panic), a 1978 version added a "last stand", and a later Creative Computing version combined teleport, wait and last stand into the Chase people know; teleports were random and could land you on an obstacle or a robot {{ohH6LBM2EiU#3}}. Other variants tried rules that did not stick: colliding attackers that both teleported randomly (Escape, which also limited you to two teleports and was probably the first non-robot theme), a tank that destroyed everything, enemies that mirrored your moves (H-Volt), and robots that could move diagonally when you could not (Robot Minefield). Norder finds the collide-and-teleport rule frustrating and the diagonal rule unfair {{ohH6LBM2EiU#5}}. Its author is unknown: it was attributed to Mac Oglesby, who denied writing it, and Norder's candidate, a David Sweet who wrote a Dartmouth BASIC game and later the Chase-like Hobbit, is speculation {{ohH6LBM2EiU#4}}.

Chase's descendants went in two directions. Williams' arcade game Robotron: 2084 (1982) was directly inspired by it, starting with only grunts and electrodes before adding humans to rescue, more enemies and twin-stick shooting; Norder likes it because it added so much that it does not seem like Chase, yet is {{ohH6LBM2EiU#6}}. Allan Black's Robots for UNIX (1984) became most people's idea of Chase by starting with no obstacles and creating junk heaps only when robots crash; Daleks for the Mac followed, and later versions mostly adapt those two {{ohH6LBM2EiU#8}}.

### Wilderness: a roguelike before the word

Duke Dougal played Wilderness, a 1979 BASIC game for the Exidy Sorcerer, at an Australian high school on a computer the science teacher bought with his own money. It already had spells and scrolls, treasure, wandering, random monster encounters, levelling and hit points: everything you would recognise as a roguelike {{xgBGrgucH2s#0}}. You play by typed commands: advance to redraw a small map of trees, identify a monster (an F that turns out to be bats), attack, and consult experience tables or a monster list; a U marks the way into the underworld, and Dougal picks beginner mode because the game is brutally hard {{xgBGrgucH2s#2}}. That underworld plays like Hunt the Wumpus, moving between numbered rooms, checking each for monsters and reading scrolls to deal with groups {{xgBGrgucH2s#3}}.

### Before the boxes closed

Reed says computer game genres calcified around 1985–87, mostly for business and marketing reasons: publishers learned people would pay for certain kinds of games and demanded more of them, ending a period of weird experiments that do not fit today's genre labels {{CE7o3GGif30#13}}.

**In practice:** the pre-genre experiments are a cheap source of rules nobody kept. Reed recommends playing them in emulators {{CE7o3GGif30#13}}; Chase's variants alone offer a shelf of tested and abandoned ideas, with notes on which ones felt unfair {{ohH6LBM2EiU#5}}.

## Why Rogue: surprise, scarcity and conventions that began as constraints

Of all those early games, Rogue is the one the genre is named after {{wwc7pZqs9UA#3}}, so its choices became the genre's defaults. Much of what the genre now treats as essential began as a workaround. Knowing which conventions were chosen and which were forced is the most practical thing this history gives you.

### The motive: a game that can surprise its author

Michael Toy loved playing Colossal Cave Adventure but found writing an adventure boring, because an authored puzzle cannot surprise its author: once you write it, you know the troll won't attack if you have the poison. He made Rogue to keep the sense of wonder while also being the game's author {{IaB7iQhts_c#0}}. That motive, not a technical limit, is the design reason Toy gives for Rogue, and it is one any procedurally generated game can share.

### Constraint became canon

Much of the rest was necessity. Aaron Reed points out that in the earliest computer games procedural generation was not a replayability feature: a hand-made world large enough to be interesting simply did not fit in memory, so you had to generate one to have a game at all {{CE7o3GGif30#0}}. Alexei Pepers, moderating the Rise of the Roguelite panel, makes the same case for permadeath and level randomness, recalling what the first roguelike developers said at the first Roguelike Celebration: they did not intend permadeath to become the defining trait, and level randomness came from being unable to store levels. Yet, Pepers observes, modern designers now feel obliged to explain both in-world, with fictions like a mad mage rearranging the dungeon or a restructuring mist {{ujKlmvfpNMo#11}}.

Eiríkr Åsheim reads the same facts the other way. Measured by permacomputing values, Rogue is a model: it used procedural generation to minimise assets, it could be played over a phone line, a handful of people made it, and it was simple enough to be ported and remixed for 40 years. Against Dennis Ritchie's quip that Rogue was the biggest waste of CPU cycles in history, Åsheim says it targeted existing hardware rather than demanding new hardware, and its precision made it influential {{qogCwa12jEg#2}}.

> It used procedural generation to minimize assets and could be played over a phone line in the early '80s. {{qogCwa12jEg#2}}

These views do not cancel out. A constraint can be both an accident of its time {{ujKlmvfpNMo#11}} and a virtue now {{qogCwa12jEg#2}}. The question is whether you keep it for what it does (small assets, portability, a game that runs anywhere) or only because the genre has always had it.

### Artefacts of the original

Small details of Rogue show how much of its design was local and specific:

- **The number 26.** John Harris notes that Rogue organises much around 26: 26 monster types, 26 levels, and the Amulet of Yendor appearing from around level 26 {{b45orGdFwi0#2}}.
- **Monster counts by alphabet.** George Moromisato traces the growth: Rogue had one monster per letter, Hack doubled it with lowercase, and NetHack used colours to reach hundreds, evidence that each generation felt more variety was needed {{QBZkvtGucBU#11}}.
- **Generation order.** Mark Gritter, enumerating Rogue's possible maps, found that its monsters and items are generated inside the same loop over rooms, while corridors come afterwards; for his enumeration he used a variant, "Rogue Star", that places monsters and items after the rooms {{mtSjgxS-QS4#9}}.
- **The scare monster scroll.** In the original Rogue it was the only random magic item you could identify without picking it up, because monsters would not walk on it {{HaBp4ETtDKI#0}}.
- **The slime mold.** Drinking a potion of see invisible in Rogue tells you it tastes like slime mold juice, and slime molds recur in NetHack and Angband as food, foes or something you play as {{LoPxtQq0ut4#0}}. Cassie Stuurman relays Wichman's account that it began as a running joke about a slime mold on a drainpipe at UC Santa Cruz; NetHack's customisable fruit defaults to "slime mold" in the hope that players will find it gross and rename it {{LoPxtQq0ut4#1}}. A private joke became a lineage-wide convention.

Two conventions from outside roguelikes show an inherited convention doing more than its origin suggests. Jim Shepard points out that arcade high-score tables, persisting between game overs since Space Invaders, were already metaprogression, and that players near a rival's score played tense and "for blood", a tension the players created rather than the developers {{FZn4NeQOcFE#14}}. John Bond notes that door transitions, like Resident Evil's door animation, existed to hide loading, but still earn their place for pacing because players, unlike machines, need a breath {{bpGRyzWCWwk#1}}.

**In practice:** for each convention you inherit, ask what it was originally for, and whether it does something in your game now. Permadeath, random levels and door transitions all began as answers to a limit {{ujKlmvfpNMo#11}} {{bpGRyzWCWwk#1}}. If you keep one, keep it for what it does for the player, not only because the genre has always had it.

## The terminal and the character grid

The most visible inherited convention is the display itself. The roguelike's look, letters on a grid in a terminal, is a hardware artefact with a long pedigree. Designers now choose it; they should know what it gives them.

### Curses and the cursor-addressable screen

Rogue could not exist without a particular kind of terminal. Nick Montfort points out that on a printing teletype like the ASR-33 you could play Adventure, and people did, but not Rogue; cursor addressing was an exciting novelty because many users were still on printing terminals through the 1970s {{blXH5pO8GA4#2}}.

> You can play Adventure like this and people did, but you can't play Rogue. {{blXH5pO8GA4#2}}

Tabitha Sable tells the software side. The many glass terminals of the late 1970s were mutually incompatible, so Berkeley's ex/vi introduced termcap, a database of terminal descriptions that let full-screen "visual mode" work on any device; when termcap later had performance problems, Mary Ann Horton's 1982 "new curses and terminfo" answered with compiled descriptions {{6ohPU0sECFE#1}}. Curses itself came from Ken Arnold lifting vi's screen-redraw code into a library that computes the minimum cursor movements needed to update a character-cell display; it shipped with 4BSD around 1980, and although Rogue was not the first curses program, it was the library's killer app {{6ohPU0sECFE#0}}. The 2020 conference preview summarises the same co-evolution: printing telegraphs, paper teletypes, then video terminals like the ADM-3A and VT100, with software first adapting to drive new terminal capabilities and then exploiting them; Sable found Rogue in BSD's /usr/share/games beside Hunt the Wumpus and Colossal Cave Adventure {{tmrYfnMrifw#10}}. The teletype is still in Unix's vocabulary: device names like /dev/tty, the "not a typewriter" error and the term baud rate are its leftovers {{6ohPU0sECFE#4}}. Later, Pavel Curtis made a clean-room clone of Bell Labs' improved curses so people outside Bell Labs could use it; that pcurses languished after 1986 and was picked up in 1993 as ncurses {{6ohPU0sECFE#5}}.

### Where the grid came from

The monospace grid is not a given of text. Montfort notes that early print type was proportional, even in Gutenberg's 42-line Bible; equal-width figures were cast around 1800 for tables, but it was the typewriter, which mechanically needed every key to advance the same amount, that brought a regular monospace grid into everyday use {{blXH5pO8GA4#1}}. The 80-column width goes back to IBM's 1928 80-column punch card, made the size of Hollerith's 1890 card so existing machines could use it, a size close to an old US dollar bill {{blXH5pO8GA4#0}}. Home computers often had 40-column displays because TVs could not show 80 columns legibly {{blXH5pO8GA4#2}}. Movement on a grid is far older: Martin Pichlmair points to Senet, an Egyptian race game at least 5,000 years old whose tokens fit a grid on the board, though its rules are largely lost {{EMb6B2cIJps#6}}.

### What came after

Text mode outlived the terminal for practical reasons. JP LeBreton traces text-mode art from pictographic writing and typewriter art to the semigraphic glyphs of early microcomputers; when home computers were networked, sending raster images over modems was so much slower that BBS-era art went back to text {{MJZvWgcxV0M#0}}. He calls ZZT, an ASCII game with a built-in level editor, an early seed for game mods and flexible engines {{MJZvWgcxV0M#1}}. The terminal produced more than roguelikes: Patrick Devine notes that Tetris was a terminal game, written in 1984 by Alexey Pajitnov for the Electronika 60, a Soviet PDP-11 clone {{ckDp6p4HbqA#1}}.

For some designers the limit is now a stance. Dwarf Fortress's feature list half-jokingly restricts itself to 16 colours and the ASCII set; Zach Adams says he and Tarn like to imagine what developers would have had to deal with if the industry had never advanced past that point, and believe it would be exactly the things that make roguelikes great {{Zh6dnx9FM1g#0}}.

**In practice:** if you choose ASCII or a grid, choose it for what it buys. The history shows the character cell and text mode as answers to slow terminals and modems {{6ohPU0sECFE#0}} {{MJZvWgcxV0M#0}}, and the Adams brothers as using the limit to keep attention on what they think makes roguelikes great {{Zh6dnx9FM1g#0}}. Nostalgia alone is a weaker reason.

## Closed source, many children: the Hack, Moria and Rogue lines

Rogue's screen travelled with it wherever Unix went; its source code did not. Two independent talks argue that this is part of why the genre multiplied.

### Recreated from memory

Dan Stormont and Michael Howk say part of why there are so many roguelikes is that Toy and Wichman never released Rogue's source, so anyone who wanted to remix or extend it had to write their own. The executable was widely distributed with Unix, but the authors held back the code for a commercial release, which came through Epyx in 1985 and sold poorly; the source came out only later. They connect this to a wider 1980s culture of recreating games you couldn't get, such as a type-in Rogue for the Atari 800 {{R8DSq8qSJ44@24276#1}}. Santiago Zapata makes the same point independently: because Rogue was closed, the first roguelikes of the 1980s were ports and reverse-engineered recreations, sometimes made from memory after a short look at Rogue during a university visit, and these gradually began doing more than Rogue did {{ZMdxP7fO6wE#9}}.

Hack is the clearest case. David Craddock describes Jay Fenlason, a student of Brian Harvey, who gave Lincoln-Sudbury High School students free run of the computer lab, playing Rogue on a field trip and writing Hack afterwards, adding monsters and behaviours {{Gs9Nb5ZYRY0#4}}.

> He didn't have the code with him so he wrote Hack as a way of being able to play Rogue without having access to Rogue. {{Gs9Nb5ZYRY0#4}}

Stormont and Howk give the details: in 1982, as a high-school junior, Fenlason played Rogue a few times at a Logo workshop in California, prototyped in Logo there, then wrote Hack in K&R C for a PDP-11 within one semester, with no copy of Rogue to compare against {{R8DSq8qSJ44@24276#2}}. Craddock adds that Rogue also taught Wichman C as he watched Toy write it {{Gs9Nb5ZYRY0#4}}.

### The Hack line

Hack spread worldwide on a Usenix tape. Fenlason's version had many bugs, including a save function that did not work, and university programmers who got the source fixed and extended it: Andries Brouwer released Hack 1.0 in 1984 and his last update, 1.0.3, in 1985, ports followed, and Mike Stephenson's NetHack (1987) took a name that showed many community developers were contributing, a continuous line of development from 1982 to today {{R8DSq8qSJ44@24276#4}}. Fenlason's original plays much closer to Rogue than Brouwer's does: the goal is the Amulet of Frobozz rather than Yendor, and your pet is a displacer beast rather than a dog, though many of his monsters and their stats carried over {{R8DSq8qSJ44@24276#7}}.

### The Moria line

Moria, released around the same time as Hack, was one of the first games built directly on Rogue, inheriting its character display, procedural generation and fantasy theme, and became the ancestor of Angband and its hundreds of variants {{y6WCq0jYbHo#0}}. Like Rogue and Hack it ran on university minicomputers with tightly limited access, and was shared between universities by mailing magnetic tapes; Zapata says it arose because talented engineers addicted to Rogue wanted more to play {{y6WCq0jYbHo#1}}. Its developers once built a working real-time version, abandoning turn-based play, but players disliked it and it was dropped {{y6WCq0jYbHo#8}}. Moria's reach was wide: Jason Grinblat of Caves of Qud played it as a child, and Michael Toy felt it was what he had wanted Rogue to be, with jobs and with monsters that behaved differently; Zapata relays John Harris's view that Moria, more than Rogue, founded what the genre became {{y6WCq0jYbHo#9}}.

Angband (1990, University of Warwick) took Moria's 50 levels to 100 non-persistent ones. Erik Osheim and Robert Au sum up the line as Rogue, then Moria as "Rogue but more", then Angband as "Moria but more"; non-persistent levels mean potentially endless monsters and items, and a grindy, tactical game in which characters improve mostly through equipment and play centres on individual battles more than long-term strategy {{eeSk665OXkM#0}}.

### Two directions

Zapata gives the clearest frame for these lines. Hack expanded Rogue toward world interaction, mimicking a Dungeon Master who resolves whatever you try: drink something or pull a lever and hear the result. Moria expanded it with more content, more monsters (letters standing for whole races) and a Lord of the Rings setting. NetHack and Angband then pushed each direction further {{ZMdxP7fO6wE#10}} {{y6WCq0jYbHo#0}}.

### The forgotten Rogue line

There was a third family. John Harris points out that Rogue spawned its own mainframe variants (Advanced Rogue, Super Rogue, UltraRogue, XRogue), played in college computer labs on timeshare systems, which petered out with XRogue in 1991 and are now rarely discussed {{b45orGdFwi0#0}}.

### Naming the family

The word "roguelike" arrived late and reluctantly. Zapata traces its first broad use to a 1993 Usenet request for discussion to reorganise the overflowing rec.games.rogue group; the proposer grouped the games by being character-based and easy to port, first suggested a rec.games.dungeon hierarchy, then "roguelike" because Rogue was the granddaddy {{wwc7pZqs9UA#3}}. Many participants hated it. Some saw no relation between Moria, Angband and Rogue, since they played very differently, and character display was not seen as unifying because nearly every game used it. Alternatives included "Moria-like", "ASCII dungeon games" and "TTY games"; "roguelike" won as the least unpopular {{wwc7pZqs9UA#4}}.

### Side branches

- **Larn and Omega.** Zapata credits Larn with the first town level and with more varied room types than rooms and corridors, and Omega with a countryside and a pantheon of gods that later appeared in games like ADOM {{ZMdxP7fO6wE#12}}. Harris describes Larn's town (a trading post, an expensive shop selling one-shot lamps of death, a college to buy skills) and spells cast by typing three-letter codes; some credit Larn, or Moria, with the first town, and Larn has been remade over a dozen times {{b45orGdFwi0#16}}.
- **ADOM.** Thomas Biskup says it began as "Advanced Dungeons of Mystery", one 100-level dungeon that later became the 50-level Caves of Chaos {{a3ZYDA2JVSM#4}}. Around 1998 it was voted the number one downloadable game on worldcharts.com, ahead of Doom and Quake, with more than 15,000 downloads a day {{a3ZYDA2JVSM#8}}.
- **Alphaman.** Jeff Olson's science-fiction roguelike, begun in the late 1980s and released in 1995, drew on Rogue and the tabletop games Metamorphosis Alpha and Gamma World. On a genealogy chart it was influenced by no other computer game and influenced none, which Olson puts down to its sci-fi setting and a different interface built without time to play the others {{Gk5uWXBANkA#0}}.

### Features the lineage invented

Several ideas later credited to big commercial games appeared first in this lineage and on its servers. Hack's bones files saved the level where you died, with your body, items and any creature you had named; Zach Adams says you could name the creature about to kill you, find it in the bones level and take revenge, and that this directly inspired Dwarf Fortress's Legends mode, with nothing comparable until Shadow of Mordor's nemesis orcs about 30 years later {{Zh6dnx9FM1g#2}}. NetHack 3.3.0 added in-game conduct tracking in December 1999, at least three years before Xbox Live achievements; Kawa could not find why those ten conducts were chosen {{KLHJsJuJfYg#5}}. Drew Streib recalls that shared bones files and in-game mail came from university shell servers, and that early public NetHack servers were mostly in Finland and northern Europe, which is why he started NAO in 2001 {{J4RK-3zW8vY#0}}. MAngband and a game derived from it went real-time online multiplayer while keeping old-school depth, offsetting the speed with input macros {{neuJCYmbAG8#4}}.

**In practice:** most of the genre grew by the "Rogue but more" pattern {{eeSk665OXkM#0}}, and its expansions split into two recurring directions, deeper world interaction or more content and setting {{ZMdxP7fO6wE#10}}. When you extend a game you love, know which one you are doing.

## Forks, variants and stewardship of open games

Closed code forced people to recreate Rogue. Open code did something different: it let a game keep changing for decades, under whatever governance its licence and community allowed.

### Two outcomes from open code

David Craddock contrasts the two big lines. Fenlason's copyright notice allowed modification as long as the notice stayed intact; that led to NetHack's DevTeam, which collaborates worldwide but keeps the game "under lock and key". Angband's code instead spread into many flavours maintained by players, so that some Angband players have never played vanilla Angband {{Gs9Nb5ZYRY0#7}}. Even NetHack's curated core sits inside a sprawl: Kes describes NetHack variants routinely incorporating patches and code from one another, producing version-history flowcharts that are terrifying and still incomplete, leaving out variants such as NetHack-- {{PvMJY8qtmc8#0}}.

Evan Debenham shows what a permissive release does for a small game. Oleg Dolya (Watabou) made Pixel Dungeon, an approachable, Brogue-inspired coffee-break roguelike with a tap interface and over five million Google Play downloads, and open-sourced it after an AMA on its subreddit; Shattered Pixel Dungeon began as a balance mod and over seven years overhauled almost all the original content {{NMWQIdfCgQg#0}}. Hundreds of variants, from tiny tweaks to full overhauls (Remixed, Yet Another, Skillful, Sprouted, Moonshine, Soft), have kept the game and its community alive for years after its last update in 2015 {{NMWQIdfCgQg#2}}. Variants need not add; some rebalance. Joel Ryan describes Sil-Q as a variant of Sil, a Tolkien roguelike about reaching the bottom of Angband, that focuses on making every item and ability useful, making the player harder to kill and rebalancing the game {{UIsNv3UOzvA#0}}.

### Stewards, not bosses

Long-lived open games need someone to hold the canonical copy. On the NetHack DevTeam, Keni and Jesse Collet describe Izchak Miller, a philosophy professor and non-programmer, as the "librarian": he held the source tree at the University of Pennsylvania and mailed tarballs, sparing contributors from applying everyone's patches themselves, and was the team's stabilising core rather than its boss {{9V_CkJ66uJQ#2}}.

A long history also splits the audience. Nick McConnell says Angband, derived from UMoria by UK students, has been in development since 1990 and released on the early internet in 1993, so players hold very different versions in mind as "the" game; when someone asks why something changed, he cannot tell whether they mean 2.6, 2.8 or 3.0 {{LaOcggk7U88#0}}.

> A game that has existed over such a long span has a very eclectic range of viewpoints that people have of it. {{LaOcggk7U88#0}}

The code accumulates the history too. Alexei Pepers finds NetHack's source preserving a commented-out date function that assumed years began with 19, and code that stops players spoofing slime mold fruit names to fake interesting deaths in the devnull tournament, a community event built into the game {{5y_IAdOwaYs#10}}. Nicholas Feinberg notes that a game as old as Crawl inevitably implements some ideas that sounded like bad suggestions, such as a cat race with nine lives or a class that began as an April Fools' joke {{GMkBT4UbvAs#1}}.

Open games can also become folk games. Leonard Richardson's robotfindskitten, written in about three days in 1997 for a contest by a beginner, now has over 50 ports and has become a folk game like Snake or Conway's Life {{ntVjLNl2_ro#0}}. Stella Mazeika counted at least 300 randomizers for existing games by 2019, including Dwarf Fortress and The Witness, more often than not open source and with welcoming communities {{C7laugXEc9s#1}}.

### The counter-case: when community work gets owned

Community authorship can be erased. Kaysa Konopljak traces DotA through many hands: Eul's original Warcraft III mod, Guinsoo's DotA Allstars collecting the best community branches, an open-source release, a community forum, then IceFrog's stewardship, after which Blizzard's lawyers named four "masterminds" as the game's authors {{s0XCPTZDgUg#1}}. When the DotA-Allstars forums were deleted (put under "maintenance" and replaced with an ad for three years), the records of community design went with them, and Valve and Blizzard then argued that no message board showed the reported hero concepts {{s0XCPTZDgUg#4}}. Her other example runs the same way in reverse: Ms. Pac-Man's creators went from receiving an Atari cease-and-desist over their enhancement kits to being hired by Atari, then patented an anti-copying device to keep people like their former selves out, pulling up the ladder behind them {{s0XCPTZDgUg#0}}.

The roguelike examples show open code keeping games alive {{NMWQIdfCgQg#2}} {{Gs9Nb5ZYRY0#7}}; Konopljak's show that openness does not by itself protect who gets credit, and that the record of community work can vanish with a forum {{s0XCPTZDgUg#4}}.

**In practice:** if you maintain an open game, choose the licence and governance model on purpose. A notice that permits modification can produce either a curated core held by a small team or a family of player-run variants {{Gs9Nb5ZYRY0#7}}. Decide which you want, appoint someone to hold the canonical tree {{9V_CkJ66uJQ#2}}, and keep the community's design discussion somewhere you control, so credit can be traced later {{s0XCPTZDgUg#4}}.

## Into the mainstream: Diablo, Mystery Dungeon, card roguelikes and the renaissance

The genre's ideas reached commercial games in waves, each time by being lifted into a new form rather than copied whole.

### Diablo

Three sources converge on Diablo's roguelike ancestry. Jesse Collet of the NetHack DevTeam recalls that NetHack became widely known only in the mid-to-late 1990s, and that Blizzard North told the team they had pitched Diablo to management as NetHack with graphics and sound {{9V_CkJ66uJQ#4}}.

> When they pitched Diablo to their management they said we want to do NetHack with graphics and sounds. {{9V_CkJ66uJQ#4}}

David Brevik says Diablo began as a party-based RPG he designed in high school, and turned toward a roguelike after he spent college playing Rogue, Moria and Angband hour after hour, with Angband a huge influence; the term "roguelike" did not exist in marketing at launch, so people did not know whether it was an RPG or an action game {{OwFrTY3IoQQ#0}}. The conference trivia's answer key credits Moria as Diablo's inspiration {{HaBp4ETtDKI#1}}.

### Mystery Dungeon

Japan has had a long-running commercial classical line. John Harris describes Chunsoft's Mystery Dungeon series, begun in 1993 with a Dragon Quest crossover on the Super Famicom, as about 31 games that have kept their Rogue and Hack inspiration throughout, crossing over with Dragon Quest, Final Fantasy, Gundam and Pokemon, and still among the most classical roguelikes commercially developed; a few titles are lost with no surviving copies {{0MdNwIHwXy0#0}}. Chunsoft also had a hand in creating Dragon Quest {{HaBp4ETtDKI#2}}.

### Card roguelikes: a separate lineage

Benjamin Berman argues card roguelikes have their own ancestry. Magic: The Gathering's 1995 booster draft tournaments already had core ingredients, including permadeath: once you are out, you are out, a finality many designers fear {{DT9_7sW5knY#1}}. He lays out a "nothing is original" tech tree: Heroes of Might and Magic's left-versus-right battle layout, Munchkin's randomly ordered encounter deck, Mega Man Battle Chip Challenge's opponents choosing randomly from small visible option sets (which prefigures modern enemies that pick from a small set of random options), and Pokemon Defense (2011) already drafting and auto-battling {{DT9_7sW5knY#2}}. Card games always had an endless activity generator, so procedural generation mattered less than permadeath, which was hard to bring back: Card Hunter made positional grid combat and dice-to-card activation meaningful, and Dream Quest's key contribution was restoring permadeath; its creator Peter Whalen later worked at Blizzard {{DT9_7sW5knY#3}}. Gavin Verhey points to the 1997 MicroProse Magic game, Shandalar, as an early card roguelike: start with a bad deck, roam a map and win cards from fights until you are ready for the final boss {{lGm8cZC8Lfk#0}}.

### The renaissance

Andrew Doull frames the period since 2011 in stages: lone developers' "fantasy heartbreakers" (a tabletop RPG term for individuals each building their own game), then a renaissance started by the Seven Day Roguelike competition (7DRL, a challenge to make a roguelike in a week), then mainstream success from Spelunky to Slay the Spire, then far greater numbers of roguelikes on Steam {{NaqP13nkpfU#0}}. His summary is that the long-time community was right that roguelikes were special, and they have now taken over mainstream games {{NaqP13nkpfU#4}}. Scott Burger's Steam data supports the growth: rogue-tagged releases began appearing around 2010 and have grown at an "electric pace" since 2019, with traditional roguelikes also rising after a 2017 bump {{IliQZm5Itng#2}}. Among widely reviewed games, FTL and The Binding of Isaac led early and Don't Starve Together tops reviews; traditional roguelikes had early leaders (Dungeons of Dredmor, ToME, Caves of Qud), and since then, Burger says, the story is less a lack of leaders than a lot of new development, such as Cogmind, Jupiter Hell and Desktop Dungeons {{IliQZm5Itng#3}}. The mainstream took the ideas; the traditional form spread out rather than consolidating.

### How modern games found the genre

The origin stories of recent games show genre ideas arriving from elsewhere and being recombined:

- **Slay the Spire** combined Anthony Giovannetti's board and card game background with Casey Yano's interest in action games and spontaneously generated content, which Yano had explored as early as a 2009 shoot-'em-up with randomised spawn points and boss patterns; he cites Spelunky's Derek Yu as an inspiration {{KYlq0Msu6hc#0}}.
- **Caves of Qud** grew from three friends' tabletop play, especially Gamma World, and their Dwarf Fortress play around 2006–07; for years its only players were its creators {{owmGknfj6H4#0}}.
- **HyperRogue** began when Zeno Rogue, who had wanted to make a hyperbolic game since 1998, found that a hyperbolic tiling suited a roguelike; a simple prototype with one-hit monsters grew from 2012 into a game with over 60 lands, and its community formed on the Steam forums {{wOlSws-OI2o#1}}.
- **Noita** (2019), Scott Anderson says, popularised the use in games of falling-sand cellular automata, which the 2005 Falling Sand Game had popularised as sandbox toys, and it is now spawning "Noita-likes" {{R8DSq8qSJ44@15170#0}}.
- **Brogue** dropped experience points and levels, and much of what replaced them centres on one versatile item, the scroll of enchantment, which can upgrade many other items {{HaBp4ETtDKI#5}}.

**In practice:** the ideas that travelled furthest were lifted into a new form. Diablo was pitched as NetHack with graphics and sound and landed somewhere between RPG and action game {{9V_CkJ66uJQ#4}} {{OwFrTY3IoQQ#0}}, card games brought back permadeath on top of their own generator {{DT9_7sW5knY#3}}, and Noita married the run to a physics toy {{R8DSq8qSJ44@15170#0}}.

## Keeping games alive: recovery, restoration and provenance

Roguelike history is fragile. The tapes degrade, the emails bounce, the authors forget. Preservation in these talks means two things: keeping games playable, and keeping the human stories of how they were made.

### Why preserve, and what

The talks give different reasons. John Harris says a game is only truly lost when nobody plays it, so preservation means getting people to play old roguelikes again; that is why he compiles binaries for others to download {{b45orGdFwi0#11}}.

> Games are kind of dead if people aren't playing them. In the process of playing a game you animate it, you inhabit it. {{b45orGdFwi0#11}}

Kes argues that small human stories from development history are worth keeping because games have an unstable relationship with their past, and such stories will fade as the internet fills with commercial and generated content; a story's apparent pointlessness is part of what makes it human, evidence that many passionate people made these games {{PvMJY8qtmc8#4}}. Zack Johnson adds a reason specific to this genre: random generation is a barrier to archiving, because a document can only list examples, so generative games especially need preserving in playable form. He points to the Kingdom of Loathing wiki's lists of possibilities and Darius Kazemi's write-up of Spelunky's level generation as companion documents {{jNUMRG_tvrY#15}}.

### Recovery stories

The recoveries share a pattern: source survives by luck, in one person's keeping, and someone has to go looking.

- **Hack.** The original Hack source was believed lost because the Usenix tapes of the late 1970s and early 1980s degraded, which bred confusion in print and online: claims that Hack came out in 1984 (that was Brouwer's version) or was written in Logo for an Atari. Dan Stormont also doubts that Hack 1.21, often called closest to the original, really is {{R8DSq8qSJ44@24276#3}}. The 1982 source came back when Brian Harvey, who had run Fenlason's high-school computer club, heard Stormont lament its loss in a Snap! conference talk and said he still had the original distribution. Stormont put it on GitHub as received, minus object files, after Fenlason chose a CC BY-NC-SA 4.0 licence as closest to his intent {{R8DSq8qSJ44@24276#5}}.
- **Wilderness.** Duke Dougal spent about 15 years collecting vintage computers before an original Sorcerer with disks turned up; its 40-year-old capacitors failed on power-up, so he repaired it and wrote a file-transfer program before finding wilder.dos {{xgBGrgucH2s#1}}. A 1984 Commodore 64 version by the Dougal brothers survived only because it was printed in a magazine and Dougal kept a copy, which he retyped and debugged; the 1979 original's author is still unknown {{xgBGrgucH2s#4}}.
- **Alphaman.** Jeff Olson's game resurfaced through a YouTube playthrough and a fan, Jaime Bainbridge, who tracked Olson down through his work email after the CompuServe address in the game had lapsed, then recompiled and released the source on GitHub with his blessing {{Gk5uWXBANkA#15}}.
- **Diablo.** David Brevik says its source was reverse-engineered after the PlayStation port shipped with its symbol table on the disc {{OwFrTY3IoQQ#6}}.
- **Rogue.** A post-5.3 Rogue source recovered from a UC San Francisco backup sits on SourceForge but does not run, because it was taken mid-development; the Rogue panel invited anyone to debug it {{IaB7iQhts_c#17}}.
- **The Rogue variants.** John Harris describes the Roguelike Restoration Project, begun in 2000, which rescued Rogue variants and Rog-O-Matic, and a fork maintained since around 2012 that keeps them buildable. Its maintainer supplies only source, so Harris compiled binaries and fixed crash bugs in Advanced Rogue 7 to make them playable {{b45orGdFwi0#3}}.

### How to restore old code

Michael Howk's restorations of early Hack, RestoHack (Brouwer's Hack 1.0.3) and ProtoHack (Fenlason's Hack, converted from K&R C to C99), give a usable method {{R8DSq8qSJ44@24276#6}}:

- **Comment out, don't delete.** Keep the original code in place so people can see how things were done {{R8DSq8qSJ44@24276#6}}.
- **Note every modern change** you make {{R8DSq8qSJ44@24276#6}}.
- **Hunt the platform assumptions.** Much of the work is finding assumptions written in for the PDP-11 that do not hold on modern machines. Aim for playable rather than byte-for-byte, and for portability across Apple and Unix systems {{R8DSq8qSJ44@24276#9}}.
- **Keep the people in.** The original source contains its authors' banter, such as a level-generation comment blaming co-creator Kenny Woodland, and Howk kept such details; Stormont notes the high-schooler's "foo" names and impolite error messages also made intent hard to read {{R8DSq8qSJ44@24276#11}}.
- **Ship it playable.** Both restorations have packaged releases and build instructions, and RestoHack can be played on the hardfought server {{R8DSq8qSJ44@24276#6}}.

### Provenance and memory

Kes's hunt for the asphynx shows how fast provenance decays. The Slash'EM encyclopedia entry for the monster cites a fictional book and wizard, and community members found about a dozen monsters with fictional attributions, migrating between variants as they pull from one another {{PvMJY8qtmc8#2}}. Finding 1990s developers was very hard: all but one of the emails bounced, the original Slash developer confirmed the literary source but did not remember writing the entry, and the trail went cold {{PvMJY8qtmc8#3}}. Kes's conclusion is that version control and project history are not just backups but stories, and roguelike communities should value them {{PvMJY8qtmc8#5}}.

Community knowledge bases do part of this work. Nicholas Feinberg describes Crawl's learndb recording how monsters and items used to work, such as the wraith draining experience seven years earlier, with players discussing old versions like Roman artefacts {{GMkBT4UbvAs#2}}. Santiago Zapata recounts how, as Usenet died, roguelike knowledge moved to game forums, the roguelike database, Roguelike Temple and RogueBasin, which he had the idea for and many others filled, and which became the biggest roguelike catalogue and algorithm resource {{ZMdxP7fO6wE#17}}. Knowledge can also migrate without being kept: Paris Buttfield-Addison describes commercial hint lines dying once free walkthroughs appeared online, their knowledge scattered to spoiler files, wikis, forums, Reddit and Discord, and Hintline 93 rebuilding the job from interviews with former Sega Australia operators {{R8DSq8qSJ44@22364#13}}. Museums help: Alex Handy says the Museum of Art and Digital Entertainment in Oakland opened with an exhibit of procedurally generated games, later added Dwarf Fortress and NetHack, and offers free space for roguelike events {{SDojcmObQzw#15}}.

What gets preserved is also a choice. Cara Esten Hurtle points to Caper in the Castro, one of the first explicitly queer games, a HyperCard stack with an NSFW warning, as evidence that queer and adult content was always part of retrocomputing; she calls no-NSFW rules in retro communities ahistorical {{ua2Brr6KCJM#4}}.

**In practice:** treat your own game as future history.

- Keep the source public and licensed, so a fan can recover it without tracking you down {{Gk5uWXBANkA#15}} {{R8DSq8qSJ44@24276#5}}.
- Keep the version history and the commit messages; they are the story Kes had to reconstruct by email {{PvMJY8qtmc8#5}} {{PvMJY8qtmc8#3}}.
- Document your generators, not just examples of their output, so the game can be understood when it cannot be run {{jNUMRG_tvrY#15}}.
- Record where content came from, including in-jokes and borrowed text, before the people who know forget {{PvMJY8qtmc8#2}}.

## Tensions and open questions

### Accident of the past, or virtue to keep?

Alexei Pepers, moderating the Rise of the Roguelite panel, treats permadeath and level randomness as leftovers of technical limits that modern games now feel obliged to excuse with fiction {{ujKlmvfpNMo#11}}. Eiríkr Åsheim reads the same frugality as a model worth following: few assets, runs over a phone line, made by a handful of people, portable for 40 years {{qogCwa12jEg#2}}. Neither talk says the convention must go or must stay. What decides it is whether the constraint still does something you want, such as small assets, portability or a game that cannot be reloaded. Keeping it only because the genre always had it is the weak case.

### Rogue's genre or Moria's?

The usual story puts Rogue at the root, and the genre's name says so {{wwc7pZqs9UA#3}}. But Santiago Zapata relays John Harris's view that Moria, more than Rogue, founded what the genre became {{y6WCq0jYbHo#9}}, and in the 1993 naming debate some participants saw no relation between Rogue and Moria or Angband at all; "roguelike" won only as the least unpopular option {{wwc7pZqs9UA#4}}. Diablo's ancestry shows the same blur: the NetHack DevTeam heard it pitched as NetHack with graphics and sound {{9V_CkJ66uJQ#4}}, David Brevik names Rogue, Moria and Angband, with Angband a huge influence {{OwFrTY3IoQQ#0}}, and the conference trivia credits Moria {{HaBp4ETtDKI#1}}. Which ancestor you name depends on which direction you trace: world interaction runs through Hack and NetHack, content and setting through Moria and Angband {{ZMdxP7fO6wE#10}}. Craddock credits the name largely to which game was distributed best {{Gs9Nb5ZYRY0#6}}, not to which one later games drew on most.

### Does open code preserve a game, or just its code?

The roguelike cases make openness look like preservation: hundreds of Pixel Dungeon variants kept the game alive after its last update {{NMWQIdfCgQg#2}}, and Angband's code spread into player-maintained flavours, so that some players have never played vanilla Angband {{Gs9Nb5ZYRY0#7}}. Kaysa Konopljak's cases show the limit. DotA's code passed through many open hands, yet lawyers later named four "masterminds" {{s0XCPTZDgUg#1}}, and deleting a forum erased the record of who designed what {{s0XCPTZDgUg#4}}. Openness also splits the audience: Nick McConnell cannot tell which Angband a player means when they ask why something changed {{LaOcggk7U88#0}}, and NetHack's variant tree is too tangled to chart completely {{PvMJY8qtmc8#0}}. Open code keeps the game runnable. It does not by itself keep the credit, the design discussion or a shared idea of what "the" game is. Those need stewardship and records, and the talks do not settle who should provide them.

### Mainstream success, scattered tradition

Andrew Doull concludes that roguelikes have taken over mainstream games {{NaqP13nkpfU#4}}. Scott Burger's Steam data agrees on growth and shows recent traditional roguelikes spread across a lot of new development rather than one story {{IliQZm5Itng#2}} {{IliQZm5Itng#3}}. Whether that spread is health (many niches served) or dilution (no flagship for the classical form) is left open.

### How faithful should a restoration be?

Michael Howk aims for playable rather than byte-for-byte, fixing PDP-11 assumptions while commenting out rather than deleting the original {{R8DSq8qSJ44@24276#9}} {{R8DSq8qSJ44@24276#6}}. John Harris also fixed crash bugs to make old Rogue variants playable {{b45orGdFwi0#3}}. Each fix trades some fidelity for playability; commenting out keeps the original visible, but the talks do not say where the line belongs. The authenticity question is sharper still where the record itself is doubtful: Dan Stormont questions whether Hack 1.21, often called closest to the original, really is {{R8DSq8qSJ44@24276#3}}.

### Unanswered questions

- **Lost authors.** Nobody knows who wrote Chase {{ohH6LBM2EiU#4}} or the 1979 Wilderness {{xgBGrgucH2s#4}}, and the trail behind the asphynx's fictional citation went cold when the emails bounced {{PvMJY8qtmc8#3}}.
- **Lost reasons.** Kawa could not find out why NetHack's ten conducts were the ones chosen {{KLHJsJuJfYg#5}}.
- **Uncomfortable ancestors.** Michael Brough asks how to read older fantasy sources whose attitudes are sexist or racist; his only answer is to read widely across time without dismissing older work {{zDKheM-E45I#12}}. What retro communities leave out is part of the same question: Cara Esten Hurtle calls no-NSFW rules ahistorical, given early queer and adult games {{ua2Brr6KCJM#4}}.

## Checklist

1. For each genre convention in your game (permadeath, random levels, the grid, door transitions, a high-score table), do you know what it was originally for, and what it does for your player now?
2. If you keep a convention that began as a constraint, is it there for what it does, or only because the genre always had it?
3. Does your generator surprise you, its author, the way Toy wanted Rogue to surprise him?
4. Does your generator produce layouts that mean something, or does it cover every case and still produce rooms that mean nothing, as Gygax's dice tables did?
5. Have you played the ancestors of your design, including pre-genre experiments like Chase, Star Trek and Wilderness, for rules nobody kept?
6. If you use ASCII or a strict grid, can you say what it buys you (low bandwidth, terminal portability, focus on what makes roguelikes great) beyond nostalgia?
7. When you extend a game you love, are you deepening world interaction or adding content and setting, and is that the direction you meant?
8. Have you chosen your licence on purpose, knowing it decides whether your game becomes a curated core or a family of variants?
9. Who holds the canonical version of your game, and could someone else take over if you stopped?
10. Where does your community's design discussion live, and would credit survive if that forum disappeared?
11. Is your source public and licensed so that a fan could recover and rebuild the game without tracking you down?
12. Do you keep version history and commit messages that tell the story of how the game was made?
13. Have you documented how your generators work, not just shown examples of what they produce?
14. Have you recorded where your content came from, including in-jokes and borrowed text, while the people who know still remember?

## See also

- [01. What is a roguelike?](01-what-is-a-roguelike.md): the definitions debate that the 1993 naming and the Rogue-or-Moria question feed into.
- [03. Death, difficulty and progression](03-death-difficulty-and-progression.md): permadeath, high scores and meta-progression as design choices today, not inheritances.
- [05. Systems and emergence](05-systems-and-emergence.md): the Hack and NetHack "world interaction" direction, bones files and conducts in depth.
- [09. Level generation](09-level-generation.md): what came after Gygax's tables and Rogue's room-by-room loop.
- [13. Interface and accessibility](13-interface-and-accessibility.md): the character grid and terminal display as present-day interface choices.
- [17. Community and business](17-community-and-business.md): variants, servers, stewardship and the commercial roguelike market.
