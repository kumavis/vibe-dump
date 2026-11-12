# 17. Community and business

Roguelikes are mostly played alone, but they are understood together. A run becomes a story when someone else hears it; a strange death becomes knowledge when someone else learns from it; a balance change becomes an argument. This chapter covers everything that happens around the game rather than inside it: the tools that let players share runs, play online, mod and follow development, the work of reading feedback and tending a community, and the business questions of who the game is for, how it gets found, how it pays and who owns what a community builds.

It matters to someone making a roguelike because the talks treat these as design decisions, not afterthoughts. Whether your game writes a log, accepts a seed or keeps its content in data files decides what your community can do with it, and the same community that retells runs is also the one that streams, crowdfunds, buys and argues about the game. The first half of the chapter is about building and keeping that community; the second half is about the business that rests on it. Much of the material comes from people who ran servers, wikis, Discords and campaigns, so it is unusually concrete, and where it rests on a single case the text says so.

## In brief

- Procedural variety earns its keep when players can compare, retell and argue about their runs, so the community is part of the design, not an audience for it {{SDojcmObQzw#0}} {{db6S2lgTWmI#5}} {{zO05p-e57AQ#12}} {{aBbaUSWFQPM#9}} {{60MTG-__dt4#7}}.
- Build the means of sharing into the game from the start: logs and scrollback that are easy to read and pass on, seeds, morgue files and safe public data, inspected at the cropped scale players actually share {{WeRCGy3-uPY#7}} {{WeRCGy3-uPY#5}} {{WeRCGy3-uPY#9}} {{QV57CYrIZow#3}} {{nOGNdrjm8ek#10}}.
- Putting a single-player roguelike online need not change its rules, yet spectating, shared servers and scoreboards bring reach, data and social space and can cut the learning curve from years to weeks {{QV57CYrIZow#0}} {{J4RK-3zW8vY#3}}.
- Keeping content in data files, ideally alongside scripting, lets players mod the game, makes mods more robust to updates, and helps the community build itself {{n6mKigS_71Y#5}} {{mES03vaZo3U#7}} {{9se2M27LuOs#1}} {{ke0cLTVg2_M#4}}.
- Roguelikes suit open development because the same players replay every change, so release early and often, put feedback one click away and visibly credit what you act on {{1Np1DSdpoR0#0}} {{jviNpRGuCIU#18}} {{1Np1DSdpoR0#3}} {{1Np1DSdpoR0#4}} {{Kh9m-ixeqec#16}}.
- Treat every complaint as valid information about a player's experience but not as an instruction: find the desire behind it, diagnose it, and weigh the quiet players who are not complaining before you change course {{NMWQIdfCgQg#9}} {{rNi5nO5yqLs#4}} {{tWFIQaeSs6M#11}} {{eeSk665OXkM#18}} {{fSmaqjbU2xg#1}}.
- A community left to form by itself ends up run by its loudest, meanest voices, so cultivate it deliberately and budget the time it costs {{NANqgqeqh2k#9}} {{db6S2lgTWmI#0}} {{1Np1DSdpoR0#6}}.
- In the cases the talks describe, streamers, festivals and an existing community sold the games far more than social media did, so plan updates and demos around the creators who will show them {{ke0cLTVg2_M#0}} {{ke0cLTVg2_M#2}} {{MTam5RT8Kn0#6}} {{ke0cLTVg2_M#8}} {{NMWQIdfCgQg#1}}.
- Keep monetisation away from the challenge and expect to earn the right to charge, since ads intrude and pay-for-advantage cheapens a hard game {{NMWQIdfCgQg#15}} {{NMWQIdfCgQg#17}} {{MTam5RT8Kn0#7}}.
- Crowdfunding cannot build a community, only draw on one, and in ADOM's campaign the developer's own outreach, not the platform, was the biggest source of donations {{5CQP8ndTjEY#9}} {{5CQP8ndTjEY#2}}.

## Why a single-player genre lives in its community

Most roguelikes are played by one person at a keyboard, yet the talks keep returning to the claim that the meaning of a run is made afterwards, among other people. This section sets out why that matters for design.

### Procedural variety needs someone to compare it with

Several speakers, working on very different games, reach the same conclusion: procedural generation earns its keep when players can compare what happened to them. Tariq, the developer of Catacomb Kids, reasoned from a thought experiment about removing procedural variation from life itself: different choices only matter if you can talk to someone else about how yours went, so procedural generation without a community to discuss the differences loses much of its point {{SDojcmObQzw#0}}. Ivy Melinda, community manager of Caves of Qud, describes the same mechanism from the other side. Because systems, procgen and emergent narrative give every player a different take on the story, the places where interpretations do not overlap are the most fertile ground for fan art, mods and fiction, and those works feed back into the game in what Melinda calls a social ecology {{db6S2lgTWmI#5}}. Joel Clark makes the strongest version of the claim for Blaseball, a game of forces deliberately out of the players' control: alone it would be insufferable, together players wade through it and work things out faster {{zO05p-e57AQ#12}}.

> I think the number one path through chaos is community. {{zO05p-e57AQ#12}}

The common thread is that randomness produces differences, and differences only become interesting once someone else can see them. A run that nobody else hears about is a private event; a run compared, argued over and retold becomes part of a shared body of knowledge.

### Mythmaking is the genre's culture

Julian Day argues that mythmaking is central to roguelikes, and that it happens less in the games than in the community, which retells the stories of memorable characters and deaths on forums, Twitter and, earlier, newsgroups. Day's example is Dwarf Fortress succession games, where one save file was passed between players and the resulting tales became shared experience for participants and readers alike {{aBbaUSWFQPM#9}}. Kawa makes the same point about death specifically: Yet Another Silly Death posts, looted screenshots and Boatmurdered are what players do when they are not playing, and Kawa calls storytelling the third function of a morgue file (the text record a game writes when a character dies), something games should actively support {{60MTG-__dt4#7}}. The storytelling extends into fiction: Kyla read a 2015 NetHack fan story written as the Oracle's diary, built from the game's fortune-cookie rumours and its dungeon inhabitants, in which the Oracle's statues are smashed by an adventurer and she responds by ordering statue traps {{H6fPIhLoA1Y#4}}.

The designer's side of this is a kind of letting go. Dan DiIorio observes that players of Luck be a Landlord do not feel it is a game made by its developer but one they played; once released, their experiences belong to them, especially in a roguelike with endless possibilities, and DiIorio has had to accept that others will build on what has been let go {{fSmaqjbU2xg#11}}.

### Communities that generate play and give people something

Some communities go further and produce the play itself. Stella Mazeika notes that every randomizer (a tool that reshuffles a classic game's items or layout into a new run) has grown a community that organises races, teaches newcomers, hosts events and gets races into larger events; for Mazeika, the lesson is that software is made out of people and inclusive communities around it are essential {{C7laugXEc9s#8}}. Nat Alison offers a human alternative to procgen altogether. The hand-crafted variant sudoku community grew rapidly from 2020 through a feedback loop in which Cracking the Cryptic videos inspired viewers to build puzzles, which were featured and inspired more constructors {{rcIVCrddozQ#1}}; a large community building on each other's work supplies hundreds of hours of fresh play, the role procedural generation usually plays elsewhere {{rcIVCrddozQ#5}}. Nick McConnell describes the same co-evolution in Angband: players discuss, developers listen and fix, and in the 1990s the game was so extensively modded that many variants appeared and maintainers absorbed pieces back into the main game {{LaOcggk7U88#1}}.

What communities give people can outweigh the game. Melinda came to ADOM's IRC channel looking for help with its difficulty and stayed for the people and the annual meetups, one of them in Amsterdam where Melinda met ADOM's creator; rarely completing a run, Melinda traces a direct line from dying to jackals in ADOM to a salaried job on Qud {{db6S2lgTWmI#6}}. Thomas Biskup, ADOM's creator, recalls a postcard sent around 1996 from war-torn ex-Yugoslavia giving thanks for a game that ran on old computers and gave its player a few hours to think of something other than the war; it taught Biskup the responsibility game makers have to the people they interact with {{a3ZYDA2JVSM#11}}. And small communities can carry outsized influence. bhauth argues that traditional roguelikes have few players but disproportionate influence, and that Dungeon Crawl Stone Soup (DCSS) has taken over from NetHack and Angband as the most influential, popular with professional players, streamers and designers; bhauth names Hearthstone's lead designer Mike Donais as holding an octopode win streak {{tg-CjNodlmY#3}}.

**In practice:** treat the community as part of the design. It is where runs become stories, where difficulty gets worked through, and where your game's reputation among other designers is made. The sections that follow are about building for that deliberately.

## Designing for the stories players share: seeds, replays, logs and open data

If stories are what players take away, the game has to make them findable and shareable. The talks give unusually concrete advice here, much of it from fans who had to build the tools themselves.

### Save the data, then make it usable

The most systematic account comes from Allie Signet and Joe Maliksi of SIBR, the fan group that built data tools for Blaseball. Their lessons run in a sequence. First, document where you start: fans documented Blaseball's public API endpoints on GitHub, the developers never asked them to stop, and later tools did not begin from zero. That documentation paid off in the story itself, when fans digging through the API found the ID of the first incinerated player during a vote to bring a player back, kick-starting a major plot event {{WeRCGy3-uPY#4}}. Second, saving data is not enough; it has to be accessible, because a towering stack of raw JSON is no fun to search, and both the people who love JSON and those it terrifies need to find the one needle-in-a-haystack event that makes a story {{WeRCGy3-uPY#3}}. Third, keep raw access even when you offer aggregate statistics, because the questions players ask change over time and unknown unknowns only surface from raw data. SIBR built Datablase to turn raw JSON into indexed game objects queryable by SQL and spreadsheets, then a web API, which supported a hackathon with 58 entries; you do not need a perfect API at the start {{WeRCGy3-uPY#5}}.

Fourth, and the point they weight most heavily: make scrollback easy to view and share. Telling a story requires knowing what happened, not just the result. Blaseball tools posted notable events to Discord, and Reblase made old games searchable as chronological event logs, so fans could pass sequences around and build a shared mythology {{WeRCGy3-uPY#7}}.

> Make viewing scroll back easy, shareable, etc. It is another way to build community by sharing the common seeds of inspiration. {{WeRCGy3-uPY#7}}

Finally, decide what is safe to expose (never personal or login data; SIBR draws a hard line there, and Blaseball's game feed needs no login) and give that to your community, which will do cursed and often blessed things with it {{WeRCGy3-uPY#9}}. The payoff can come back to the developers: with full data, fans simulated a proposed "double jump" rule against the past season before it went to a vote and published a white paper; the developers later said it had uncovered edge cases they had not anticipated {{WeRCGy3-uPY#10}}.

For a roguelike, the same speakers point to smaller versions of the idea: Noita's GIF export for sharing funny deaths, and the wish that strategy games kept a full, filterable game log that could be read as a story {{WeRCGy3-uPY#8}}.

### Design at the scale players share

Mike Cook supplies the reason those small tools matter. At what Cook calls the "lens" scale, players share one cropped thing: a screenshot, a short clip, a single object. A Minecraft seed describes a world larger than Earth, but people pass it on for one specific thing near spawn; Dwarf Fortress stories are complex but usually start from one cropped detail such as a dwarf's description. So examine your generator's output at that scale too, not only as whole maps or whole runs {{nOGNdrjm8ek#10}}.

The genre already has tools built for this scale. DCSS saves a morgue file, a text snapshot of the character and key events, for every online game, and players can generate one mid-game; Alan Malloy explains that a community norm of attaching a morgue to any help request makes those requests answerable, because the morgue usually reveals a string of basic mistakes rather than the single problem the player suspected {{QV57CYrIZow#3}}. Caves of Qud lets players type in a world seed, so stream viewers can play largely the same generated world as the developers on screen; the developers say it "sort of works", since most of the world matches, and that entering the same seed is itself a shared experience {{owmGknfj6H4#4}}. Melinda describes Qud's Discord "build club", which ran for a few months after the procedurally generated villages update: anyone could post a character code, seed and starting village, different players took characters from the same start in different directions, and the club produced fan art and exposed world-seeding bugs {{db6S2lgTWmI#10}}.

The gap shows when the tools are missing. Gabriel Koenig's Test Tube Titans let players breed unique procedural creatures, some of which Koenig had never seen, but they could share them only by exporting files or taking screenshots, with no in-game way to show them off {{xju91VGh2Ps#14}}.

### Shared mystery and live response

Shared data supports a second kind of collective play: speculation. Alexei Pepers describes how Blaseball, where all players shared one simulation, let fans vote on mysterious rule-changing decrees of which only one passed. In season 10 "black hole" passed and was revealed; "countdown self-destruct" never passed and remains unknown, a permanent object of debate {{H5EU9_Gdu94#9}}. Clark adds that the developers reacted alongside players: when randomness shook out in surprising ways, or the community rallied around something such as a team with no pitchers, they changed course and ran with it, making each season a dialogue between developers and community {{zO05p-e57AQ#6}}. That openness extended to keeping known flaws. Asked whether the blessing vote let large fan blocs gain outsized power, Clark agreed: it was designed as a raffle, it is a broken system they are leaving in, and they patch around it with new systems such as a differently balanced "enhanced party time" {{zO05p-e57AQ#19}}. Florence Smith Nicholls cites Necrocracy, a live game with a bespoke conspiracy-board tool where players mapped their theories, which then informed each week's live design {{MQw3pe-z6JM#5}}.

The desire for shared discovery can even outweigh procedural generation. Slashie's newest project, an exploration-only forest game, sets aside some of its procedural generation for a large, non-procedural world precisely so players can share their findings socially, and keeps its discoveries strange and unexplained so players form their own hypotheses {{R8DSq8qSJ44@32392#7}}. That is a real trade-off: a unique world per player makes every story personal, a common world makes every discovery comparable.

### Show the generator itself

The generator can be something to share as well. bleeptrack hands out generative stickers like business cards; telling people that every sticker on the table is unique makes them spend minutes choosing the one that suits them {{FWQwtn-46rs#1}}. bleeptrack also brings pen plotters to events, where live drawing draws people in and starts conversations, and people value the result more because they can see the machine's effort {{FWQwtn-46rs#5}}. Darius Kazemi urges developers to publish interactive deconstructions of their own level generators, which is easier than writing an essay or giving a talk and, especially for browser games, more useful to others; several roguelike authors told Kazemi they based their level generation entirely on Kazemi's Spelunky toy {{CLi4PWxDmAI#3}}.

**In practice:** build export, logs, seeds and a safe public data feed in from the start, rather than leaving fans to reverse-engineer them. Make the smallest shareable unit (a death GIF, a morgue, a seed, a single creature) one action away.

## Playing together online: servers, spectating, scores and competition

Putting a single-player roguelike online need not change a single rule, yet it changes how the game is learned and played. Two talks about the genre's public servers make this case independently.

### What a server gives a single-player game

Alan Malloy argues that DCSS's online play, offered alongside the downloadable game, brings benefits many other roguelikes could have: it reaches more players, collects game data for analysis without spyware-like agents, and creates a social space, events and better feedback, all of which ultimately make the game better for players {{QV57CYrIZow#0}}. Drew Streib, who ran the public NetHack server NAO (nethack.alt.org), makes the narrower and striking claim that live game watching does not change NetHack but accelerates the learning curve so much that players who once took years to ascend (win) now often do it within weeks. Players at first objected that their secrets were being given away, so NAO shows a banner saying all games are watched; Streib calls ttyrec (terminal recording) watching a "prehistoric Twitch" {{J4RK-3zW8vY#3}}.

> It doesn't change the game, it just accelerates the learning curve. {{J4RK-3zW8vY#3}}

The mechanisms behind that acceleration are specific:

- **Live mentoring.** An event organiser in Streib's audience described ascending on NAO while IRC helpers watched the game and said exactly what to do, and a friend sent advice by in-game mail; Streib calls it a more advanced spoiler and is fine with it {{J4RK-3zW8vY#13}}.
- **Weightless mail.** NAO's in-game mail is delivered by a mail daemon, and the letters weigh nothing and evaporate after reading so they cannot become extra items; NAO also records ttyrec replays of every game {{rIB0y_kwFuY#24}}.
- **Cross-mode spectating and scorekeeping.** In DCSS anyone can spectate any online game in console or tiles regardless of how it is being played, so a console-only helper can read a tiles player's problem, and scorekeeping pages show per-player combos, streaks, win rates and high scores without queries, giving players ways to brag and get help {{QV57CYrIZow#9}}.
- **Shared bones.** NetHack's bones files (a dead character's level, left for a later player to find) only become a real part of the game on a shared server; Streib says stumbling on someone else's bones was their only realistic chance to ascend, and felt less like cheating than inserting a level themselves {{J4RK-3zW8vY#1}}.
- **Comparable challenges.** Biskup launched ADOM's Rogue League server with global high scores because challenge modes only make sense when players can compare results, not just discuss them on a forum {{iZUXjbcAfYs#0}}.
- **Group events.** Russ described a university NetHack server built for 12-24 hour group binges: a live "binge board" projected on the wall, player stats written to a database that granted cross-game achievements, and a Twitter bot announcing deaths {{SDojcmObQzw#8}}.

### What scores have to mean

Once results are shared, fairness becomes a design concern. The Rogue panel recalls that a shared high-score file changed Rogue's priorities: cheating for your own fun is fine, but competing against others made fairness and save-file security matter, and Ken Thompson reportedly cheated by copying save files and replaying {{IaB7iQhts_c#13}}. Streib ran a server mainly to prove personal achievements, and NAO takes a hard line against restoring games so that a score on it means something. Yet Streib also warns that fewer people care about your bragging rights than you think {{J4RK-3zW8vY#2}}. Both are true: verification matters to the competitive minority, and you should not build the whole service around it.

Patches complicate scores. Jim Shepard calls wiping leaderboards on big patches, as Diablo's seasonal ladder does, the "nuclear option", and fair: if a patch accidentally made something too strong, that is the developer's mistake, so give the previous champion a special powerless hat and start over {{FZn4NeQOcFE#17}}.

Tournaments can also push players toward variety. Malloy describes DCSS's automated release tournaments: for about two weeks after each release every online game counts; popular easy combos such as Minotaur Berserker of Trog award fewer points as they are won, and a rotating rarely played combo pays big bonuses to its first eight winners. Malloy's own feeling is that the scoring rewards playing a lot more than playing well {{QV57CYrIZow#11}}. Kawa singles out that randomised combo challenge as a personal favourite conduct-like goal, combinations "no sane person" would pick {{KLHJsJuJfYg#13}}. Angband has run an ongoing competition judged by turn count for a long time, which is why McConnell says speedrunners did not change the game much {{LaOcggk7U88#8}}.

### Speedruns and play out of bounds

Speedrunning is the extreme of public play. Adeon's NetHack real-time record of about one hour three minutes took roughly a month and around 1,000 attempts, so a live run has to balance risk against a realistic chance to win; Adeon put the odds at about 30 percent in a two-hour slot and finished in about 1:50, against commentators' first wins of 20 to 36 hours {{rIB0y_kwFuY#0}}. Everest Pipkin describes how speedrunners stop seeing a level as platforms and walls and start seeing pockets of inside and outside, turning clipping into memorised routes {{O78uYtUZKYs#5}}, and how the same out-of-bounds play becomes social space: teenage parties held beneath World of Warcraft's maps, reached by known routes, with rules like "there will not be fighting here" layered on top by the players {{O78uYtUZKYs#3}}.

### Convenience against togetherness, and an edge case

Online structure involves trade-offs. Gavin Verhey explains that Magic Online's pod drafts could take 50 minutes to three hours, with forced idling if your match ended early, so Magic Arena paired players from a large pool to allow drafting at 2 a.m., trading the shared-pod feel for convenience, a trade Verhey considers well worth it {{lGm8cZC8Lfk#13}}. And "online" stretches further than you might expect: Leif Bloomquist builds multiplayer roguelikes for the Commodore 64, which suits the project because it is exhaustively documented after decades of reverse engineering, has an active community and huge library (around 25,000 games, many of them roguelikes), and now has network adapters that put it on the internet {{ASGn5J9PHbs#0}} {{bpSnPNr6ETc#0}}.

**In practice:** treat online infrastructure first as a learning and social tool: spectating, replays, shared bones, scoreboards. Decide early what a score must prove and what a balance patch does to existing records.

## Modding and fan reinterpretation

Opening a roguelike's data turns some players into co-authors, and the talks agree that this grows the community around the game.

### Reinterpretation and why it builds community

Ray, from the Caves of Qud wiki team, gives the framing: modular data files give players a strong capacity for reinterpretation, which Ray defines as the ability to parse, reuse and transform a game's data, whether for a wiki or for a mod {{n6mKigS_71Y#2}}. Several developers converge on the community payoff. Josh Ge says you need a community to have a successful roguelike, and that giving players tools to build their own content for Ge's X-COM roguelike helped build one {{9se2M27LuOs#1}}. Benjamin Berman points to Pokemon Showdown, which sustains around 15,000 concurrent players on community-authored content with around 17,000 commits; Berman's advice is simply to do what players ask for {{DT9_7sW5knY#12}}. Dylan Gedig found that streamers' audiences supplied Peglin with modders, translators and a wiki even though the game was not built to be modded, and the mods produced more content for streamers than two developers could {{ke0cLTVg2_M#4}}.

### How to make a game moddable

The technical advice is consistent: keep content in data.

- **Offer more than one way in.** George Moromisato argues that pairing data files with scripting widens the modding community beyond programmers to people contributing flavour text and graphics; Dwarf Fortress, Caves of Qud and Moromisato's own Transcendence all offer several routes {{mES03vaZo3U#7}}.
- **Prefer data files where you can.** Ray finds data-file mods significantly more robust to game and interface changes than pure scripting; a favourite mod changes one property of an item in three or four lines of XML, and modders can recombine existing parts {{n6mKigS_71Y#5}}.
- **Get modding as a side effect of architecture.** Biskup explains that because Ultimate ADOM's engine interprets configuration, modding comes almost free; Biskup offers opening it, first internally and then to the community, as a compromise in the debate over open-sourcing ADOM (the reasons for keeping the source closed are in the chapter's last section), and imagines a Rogue League area where mods are listed, rated and discussed {{iZUXjbcAfYs#15}}. The same setup allows optional content modules, such as a time-travel extension, that do not clutter the main game but are there for players who want them {{iZUXjbcAfYs#24}}.
- **Keep logic in accessible files.** Kate Compton recalls that The Sims stored much of its UI and AI in external files, so players hacked and re-uploaded tiny programs at a time when editing a program on the fly was hard {{E5-3Ui7oO8U#2}}.
- **Make swappable functions modular too.** Brian Bucklew and Corey Frang describe Qud's language packages as mods that replace "replacer" functions one for one: number-to-word conversion has to be procedural, and Turkish writes "May 5" rather than "May 5th", so the Turkish package simply supplies its own replacer {{R8DSq8qSJ44@5367#9}}. That work covers over 20,000 strings and about 150,000 words, and community translations into other languages already appear as Workshop mods on a public experimental branch {{R8DSq8qSJ44@5367#11}}.

### Leave room and treat modders as colleagues

Moromisato's craft advice is to leave deliberate "whitespace". Transcendence implements only the central areas of its map, leaving other regions to modders, perhaps with a hint like "the pirate realm", and skips some item tiers (a Mark IV or VI) so players imagine and build them {{mES03vaZo3U#10}}. Moromisato also urges treating modders as equal co-developers and sharing as much as possible, including setting and character background, so their content fits; Bucklew told Moromisato Caves of Qud hired one of its modders {{mES03vaZo3U#11}}.

### When fan work becomes the game

That is not an isolated case. Qud's hindren began as Caelyn Sandel's fan creation; the writing captured the game's voice so well that Sandel was hired and added them to the game, which Melinda calls the community leapfrogging from fan work to canon {{db6S2lgTWmI#8}}. Crypt of the NecroDancer's Synchrony DLC began when Adrian Zeyfang read the developers saying online multiplayer was impossible, took it as a challenge, and built a fan prototype with friends over months and years until the studio adopted it {{zwhNSbFVKQM#11}}. Berman credits Slay the Spire with embracing mods, so players could edit the Java game to add cards and show what they wanted without asking permission {{DT9_7sW5knY#4}}. Mods can also extend a game toward what its community values: a fan homesteading mod for Qud adds diegetic building, which Melinda feels makes the game more honest by letting players build a home where community gathers {{db6S2lgTWmI#11}}. And player-made challenges are a lighter form of the same thing: Philomena Schwab says Niche's custom difficulty settings let players design and share challenges and custom characters for role-play, which kept the game alive for years without updates {{wLLDPz8PnQg#3}}.

### Wikis, companions and source code

Reinterpretation also means reference tools. The Qud wiki parses the game's data files and uploads object blueprints automatically into MediaWiki cargo tables, with a blueprint explorer flagging pages that need updates, so content stays current and items can be searched and filtered like a database {{n6mKigS_71Y#3}}. Ray's warning is that a game's ontology is not a wiki's: three doors needing three keys are separate objects in Qud, but should each have its own page? The wiki team keeps a sheet of overrides and writes prose that cannot be generated {{n6mKigS_71Y#4}}. Jeremy Rose built a Cataclysm companion guide as a static web app that downloads a version's data once (about 3.5 MB of gzipped JSON) and then works offline, with crowdsourced translations in the same 10 languages as the game {{ziN33iMQVPo#6}}. Open source opens the deepest layer: Alexei Pepers urges developers to read the source of their favourite open-source roguelikes, since NetHack is on git and its wiki's footnotes link straight into source files, and the comments alone teach technique and design reasoning {{5y_IAdOwaYs#11}}.

### How close to stand

Developers disagree about how close to get. Subset Games, surprised by how much players modded FTL, made Into the Breach easier to mod through scripting and tries not to break mods with updates, though they lack time to build full tools; Matthew Davis calls fans continuing to play with your ideas nothing but a compliment {{rNi5nO5yqLs#11}}. Jon Perry, by contrast, keeps UFO 50 mods at arm's length and does not look closely at them, so they cannot influence Perry on any return to those systems; the host adds that creators engaging too closely can turn a fan scene into a contest for approval {{NlxGPKV0PrY#15}}. Qud sits at the other end, hiring modders and fan writers. The choice depends on whether you want fan work to shape your own design or to run in parallel with it.

**In practice:** keep content in data files, document the formats, leave visible gaps worth filling, avoid breaking mods casually, and decide deliberately how much of what modders make you will look at.

## Developing in the open: releasing early and showing you listen

Roguelikes are unusually well suited to open development, because the same players replay the game after every change and can tell you what each one did.

### The case and the history

Chris King, who spent nine or ten years on 20XX and 30XX, makes this argument directly: roguelike players naturally replay, so when you develop in the open the same audience responds to each change and keeps giving feedback as the design evolves. Community input was a critical part of King's iteration, and both games stayed in Steam Early Access much longer than planned {{1Np1DSdpoR0#0}}.

> We have a natural audience that wants to play and replay our games. {{1Np1DSdpoR0#0}}

The genre's history bears this out, including its uncomfortable start. ADOM's first public release, posted to Usenet in early 1996 after two years of work, got no reaction at all; Biskup kept going only out of personal enjoyment of the game, and a month later 0.7.1 brought the first few dozen emails {{a3ZYDA2JVSM#5}}. After that, monthly releases built a fast-growing loop: by 0.8.0 hundreds of emails had arrived from players in places like the US and Finland, a feedback loop Biskup describes as being like a drug that pushed development {{a3ZYDA2JVSM#6}}. Decades later Slay the Spire's two years of early access with constant feedback honed the card-roguelike interface, Berman says {{DT9_7sW5knY#4}}.

### Release early and often

The practical advice converges. Josh Ge calls "release early and often" the roguelike developer's mantra: get the game minimally playable quickly, post in weekly threads such as r/roguelikedev's Sharing Saturday (useful for accountability and community even in a week with little progress), and keep a public dev blog that concentrates information in one place {{jviNpRGuCIU#18}}. Santiago Zapata treats player feedback as the most important metric for judging what worked, and the 7DRL (Seven Day Roguelike Challenge), with its 200-plus entries and attention, as a good source of it {{TMxzVy7-VYQ#19}}. Zapata also found that setting small learning games in established universes such as Zelda, Metroid or Castlevania drew players in and brought the feedback a learning developer needs {{TMxzVy7-VYQ#7}}. Evan Debenham publishes about a dozen blog posts a year on Shattered Pixel Dungeon's plans, which excites players, forces ideas to be made concrete and gathers feedback on content before it ships {{NMWQIdfCgQg#14}}. Nick McConnell says discussion and playtesting on Angband's forums have massively improved many design ideas, McConnell's own and others' {{LaOcggk7U88#6}}. Andrea Roberts's team took Roundguard to public indie show-and-tell events in Seattle from the first months, watching strangers, including children, play over their shoulders {{WtdCY6NxX6I#14}}.

Ge also warns from experience against the opposite. Years spent avoiding social media and community discussion were, by Ge's own account, a mistake that slowed things down: the varied opinions about roguelikes are more than you can think of yourself {{9se2M27LuOs#5}}. And others can steer you round your particular pitfalls only if you ask; Ge points newcomers to r/roguelikedev, its tutorials and summer code-along, FAQ Fridays, the Discord, RogueBasin and Roguelike Radio {{jviNpRGuCIU#12}}.

### Lower the friction, close the loop

Two techniques make open development pay. The first is making feedback effortless. King puts buttons linking to forums and Discord in the game, and points to Rogue Legacy 2's F10 key, which opens a report form that attaches diagnostic information; asking players to DM or email you wastes your time and theirs {{1Np1DSdpoR0#3}}.

The second is showing that you listened. Players give more feedback when they see it acted on, so King posts in public, chats in Discord and writes verbose patch notes that credit community-suggested changes; being civil and professional without being uptight sets a tone others follow {{1Np1DSdpoR0#4}}. Brian Cronin, a solo part-time developer, finds that playtesting doubles as community building: the Discord for Cronin's game is almost entirely past playtesters {{Kh9m-ixeqec#5}}. Cronin attributes each action item to the tester who raised it and sends a follow-up note once it is acted on, which thanks them, builds trust and makes them keen to test again {{Kh9m-ixeqec#16}}.

**In practice:** ship small and often, put the feedback channel one click or one key away, and visibly credit what you act on.

## Reading feedback: desires, complaints and the silent majority

Collecting feedback is the easy part. The talks spend more time on how to interpret it.

### Valid information, not instructions

Several developers converge on the same stance: everything players say is real information about their experience, and none of it is a specification. Debenham says the main value of feedback is perspective, keeping a solo developer from becoming an echo chamber building only what they like, though dedicated players can be the most biased; biased feedback is not worthless, but you must recognise and account for the bias {{NMWQIdfCgQg#8}}. Debenham's method is to look for the desire behind a suggestion. Players have repeatedly and seriously asked for Sans from Undertale as a Shattered Pixel Dungeon boss; the request is absurd, but the desire for more interesting boss fights is real and can be met {{NMWQIdfCgQg#9}}.

Subset Games' Justin Ma and Matthew Davis treat every complaint as valid, then diagnose it: is it a design issue, a presentation issue, or players wanting a different game? Then find a middle ground or explain your reasoning, as they did after repeated criticism of Into the Breach's weapon costs and shop, sticking to what their testing supported {{rNi5nO5yqLs#4}}. The Against the Storm developers, Aron Pietroń and Michał Ogłoziński, put the burden squarely on the designer: players have every right to give emotional or wrong feedback, and unpacking it is the designer's job {{tWFIQaeSs6M#11}}. One common misreading they warn against: requests to buff something often mean it is someone's favourite playstyle, not that it is weak, and player-proposed fixes often miss the real problem; a "weak perk" on their upvote board may really be a playstyle that is not yet well defined {{tWFIQaeSs6M#10}}. Cole Wehrle grounds the same stance in reader-response theory: a player sees only a slice of the game, the designer is not every player, so even a very negative experience is valid information, and Wehrle reads every comment that can be found {{HgnvMBVKP0M#2}}.

> Every experience of playing a game, even a really negative one, is a kind of valid experience. {{HgnvMBVKP0M#2}}

### The people who are not talking

The loudest feedback comes from the unhappy. Erik Osheim and Robert Au, maintaining Angband, heard most from veterans who disliked changes, some of whom forked variants or said the game had got too easy; without polling data, vocal critics dominate, yet a silent majority enjoyed the changes and some critics came round. They did act where the complaint held up, running simulations that showed item distribution had risen, and adjusting it {{eeSk665OXkM#18}}. DiIorio states the rule: if you change the game to appeal to vocal critics, take the quiet, content players into account, or the two groups simply swap places and you end up playing feedback whack-a-mole {{fSmaqjbU2xg#1}}. Tyler Coleman offers a way to read silence: about 20% of a game's content drives 80% of the conversation, and the familiar foundation (controls, camera, key mapping) should be quiet, because when people talk about it, it is rarely good {{C6jR41fZjqM#7}}.

Timing helps separate a bad change from an unfamiliar one. Against the Storm's developers wait about two weeks before reacting to backlash, because players often adapt and find a niche for the change; by then they can tell a productive disruption from universally hated design, and team members with different temperaments plus a player-focused community manager balance the urge to react {{tWFIQaeSs6M#12}}. Debenham adds a test: when veterans object, check whether they give actionable reasons for disliking the new thing or simply want it changed back. Some reflexive resistance, as when Debenham remade Shattered's decade-old music, is unavoidable and has to be accepted {{NMWQIdfCgQg#18}}.

### Sources beyond the comment box

Comments are not the only channel. Sandel watched people stream Caves of Qud on Twitch to find where new players got confused and frustrated, which Sandel found very useful for outreach {{NANqgqeqh2k#4}}. Schwab's team surveyed 6,000 beta testers of The Wandering Village and found that nearly everyone rating it 7 or below found it too hard, a split no single balance could fix, which led them to difficulty settings {{wLLDPz8PnQg#4}}. Debenham gathers from email, community channels and app store reviews {{NMWQIdfCgQg#8}}.

### Special cases

Some feedback shifts as a community matures. Shawn Main observes that the longer a community spends with a game, the better it identifies where overt randomness decides wins and losses, and the more it demands reward for skill {{UZ7XqQYDM7o#9}}. Hybrid games face two audiences at once: Jonathan Lessard reports that chess players gave Chogue harsh feedback for leaving out castling and en passant, rules the designers had dropped through laziness or never thought of, and Pippin Barr insisted on a resign option because chess players expect one {{l1YEJBKehAY#15}}.

**In practice:** collect widely, including streams and surveys; diagnose each complaint before acting; wait before reversing a change; and weigh the players who are not talking.

## Tending the space: care, moderation, volunteers and limits

A healthy community does not form by itself, and keeping it healthy costs real time.

### Cultivate it or someone else will

Ivy Melinda, who watched the Caves of Qud Discord grow from half a dozen people to over 3,000, says "management" oversells the role, which is care and cultivation, and that there is no one-size-fits-all recipe {{db6S2lgTWmI#0}}. Caelyn Sandel gives the reason it cannot be left alone: if a community forms itself, the loudest and meanest voices end up running it, and hostile elements take over unless shown the door. Qud's team instead built a space for people pushed out of other gaming spaces, consistent with the game's values of bodily autonomy and anti-authoritarianism {{NANqgqeqh2k#9}}. Sandel closes with questions every developer should ask: what is it like to be a new player here, who feels welcome or alienated, and who is guiding your game's online presence if you are not {{NANqgqeqh2k#11}}.

> If you are not guiding your games online presence, who is? Because someone will. {{NANqgqeqh2k#11}}

### Structures that spread the work

As Qud's community grew, it added an official wiki with a volunteer crew, volunteer moderators called "mayors", a Patreon and a subreddit; Melinda, too, started as a moderator of a handful of people and later received a stipend {{db6S2lgTWmI#7}}. Asked about relying on volunteers in a commercial project, Melinda says it is opt-in, many people want to give back but do not know how, and offering them ways to do so benefits them, the community and the developer {{db6S2lgTWmI#12}}. Players can build institutions on their own: Nicholas Feinberg describes DCSS's learndb, a player-curated knowledge base of over 10,000 entries that includes drama, vanity entries and a curated list of thousands of rejected player suggestions, such as scurvy for not eating fruit {{GMkBT4UbvAs#0}}. Chris King's force multiplier is to answer questions in public, persistent places, so veterans absorb the answers and give them to newcomers for you {{1Np1DSdpoR0#5}}.

### Costs and limits

The work is real. King spent about 8 hours a week, 15-16% of working time, on community interaction for 20XX, and learned only after not planning for it the first time that encouraging feedback without a sustainable process leads to burnout: plan the time, be present at patches and releases, and batch the work into quiet periods {{1Np1DSdpoR0#6}}. Inviting players into the content adds more. Elliot Trinidad reports that Blaseball's user-submitted names, a Patreon perk, built buy-in but required heavy moderation of unsavoury, borderline and copyright-infringing names, and drifted the world's tone toward bombastic names {{9yFferxbrBU#3}}.

Growth brings expectations. Biskup calls ADOM's community in its "boomtown" years awesome and full of ideas, but a larger audience brought expectations, and the self-imposed deadlines that went unmet became a defining lesson of that period {{a3ZYDA2JVSM#7}}. Absence costs trust: reviving ADOM after years of little contact meant slowly rekindling both Biskup's own passion and players' belief that something would really happen; releasing JADE in 2011 helped by showing something tangible {{a3ZYDA2JVSM#16}}.

There is also a personal limit for the people doing the tending. Melinda avoids heavy mod use so that personal play stays close to an entry-level experience, since heavily modded Qud can become unrecognisable and guiding new players requires knowing what they face {{db6S2lgTWmI#13}}.

**In practice:** budget community time as part of development, set the tone early and enforce it, answer in public, and give invested players defined, optional ways to help.

## Who the game is for: niche depth, wider audiences and newcomers

The sections so far assume the players are already there. The rest of the chapter turns to the business that depends on them: who the game is for, how it gets found, how it pays, and who owns what a community makes.

Every commercial roguelike faces the same fork early: build for the people who already love the genre and want to think hard, or reach for players who have never heard the word "roguelike". The talks do not agree on which road is right.

### The case for staying a niche

The creators of Rogue were relaxed about the niche. On the 2016 Rogue panel, Glenn Wichman described roguelikes as games for people who want something hard rather than twitchy, and another panelist noted that Rogue was sold in boxes and never reached a mass market: that ship has sailed, and that is fine {{IaB7iQhts_c#11}}.

> You can make something that has quality that's inherent, that's beautiful, that doesn't appeal to everybody. {{IaB7iQhts_c#11}}

David Brevik adds that the conditions for a niche have improved since 1994: streaming, YouTube and Discord give developers direct access to a huge gaming audience, so a niche game can succeed even when its audience is nowhere near AAA size {{OwFrTY3IoQQ#11}}. Scott Burger's Steam data suggests the niche is a loyal one. Comparing playtime recorded at review, the median for all rogue-style games is about 20 hours against 31 for games tagged traditional roguelike, about 40% longer; at the 90th percentile the gap is about 137 hours against 300 {{IliQZm5Itng#9}}. Players who choose the traditional form stay with it.

### The case for reaching wider

Thomas Biskup argues the other side most forcefully. In Biskup's view the "ugly truth" is that traditional roguelikes are not successful in the mainstream, even though RogueBasin and Steam list more of them than ever; mainstream hits combine great design, a great user interface and a large community, and of the three, design is the cheapest {{hnoF_bL-HjI#0}}. The team believes there is still room in the mainstream for highly detailed roguelikes, and notes that mainstream games keep adopting roguelike patterns without accepting roguelikes themselves {{iZUXjbcAfYs#1}}. Ultimate ADOM was the result: an attempt to reach a wider, more casual audience without sacrificing complexity, partly because a commercial game needs more players to earn money, which is also why it dropped ASCII-only graphics {{PTIsUSbQ0TA#1}}.

Biskup frames the decision as binary. A game aimed at the roguelike community can keep 30-year-old conventions; a game aimed wider has to forget the genre's assumptions, rethink everything, and only then work out how to accommodate the existing community, which takes bravery and may mean doing things that community initially dislikes {{hnoF_bL-HjI#13}}.

Josh Ge names a narrower lever. Ge argues roguelikes reach wider audiences mainly through polish, which most traditional roguelikes lack and polished roguelites have; Cogmind was built by perfecting each feature before moving on, which is why, Ge says, it took so long {{9se2M27LuOs#7}}. Ge reports a payoff, with several players saying Cogmind was the first non-roguelite roguelike they played after many roguelites, and hopes other developers adopt the same features so players can keep going into the genre {{9se2M27LuOs#19}}. A polished traditional game can be a bridge rather than a compromise.

What the choice depends on is mostly money and intent. The panel's and Brevik's position suits a developer who can live on a small, loyal audience; Biskup's suits a team that has to pay salaries. Ge's suggests the two are less opposed than they look, since a polished traditional game can carry new players into the genre rather than away from it {{IaB7iQhts_c#11}} {{OwFrTY3IoQQ#11}} {{PTIsUSbQ0TA#1}} {{9se2M27LuOs#19}}.

### Designing for specific new audiences

Several talks pick a particular audience outside the core and ask what it needs.

- **Time-poor adults.** Andrea Roberts found, as a new parent, that a roguelike offered real strategic depth in 35-45 minute sessions that could be picked up a week later without resuming an epic storyline or sorting an inventory mess; the clean fresh start is the feature {{WtdCY6NxX6I#15}}. Roberts also heard from parents that their children enjoyed the repetition, practice and learning, and connects that to values the genre spreads: exploration, comfort in failure, grit {{WtdCY6NxX6I#15}}.
- **Children.** Michael Langford argues roguelikes suit young children because they offer a lot of replayable content at a single skill level, unlike "one and done" games such as Mario, and that small accessibility changes open up parents' large spending on children, especially on non-PC platforms {{wPN5bPxWXm8#0}}. Langford's tool is the "shame test": imagine playing within earshot of a child you barely know (in the example given, a friend's husband's boss's child), screenshot every moment you would feel embarrassed, and put those gross sounds, graphic art or deceptive content behind toggles so parents can let children play; the art should still express the full range of emotions {{wPN5bPxWXm8#9}}.
- **Players who judge by the art.** Philomena Schwab warns that a cute, colourful style signals an easy, casual game. Darkest Dungeon and Dark Souls pre-select teenage and older players through dark settings and complex UI, while Niche, just as complex as Darkest Dungeon, drew many young girls who wanted to play with animals alongside adults who wanted depth, and catering to both was hard {{wLLDPz8PnQg#0}}. Your art chooses an audience whether you mean it to or not.
- **Players who come for a brand.** John Harris notes that Pokemon Mystery Dungeon's Explorers games sold about 6 million, far beyond Shiren 5 and 6 at around 200,000, and that many people who have never heard of roguelikes enjoyed it through the power of the brand {{0MdNwIHwXy0#17}}.

### Newcomers and the core are not enemies

Wider reach provokes resistance from the existing community. Caelyn Sandel argues that the needs of core and new players are not actually at odds, even though core communities often see accessibility options as pandering: new players need a welcoming introduction, core players need to stay interested, and the developer's job is to balance both and to convince the core that this is possible {{NANqgqeqh2k#7}}. Drew Streib reached the same conclusion from running a NetHack server. Streib admits to having once rolled their eyes at the Reddit NetHack crowd, but now argues a community stays alive only by broadening access, through browser and phone play for example, because a big audience fills the pipeline of new players {{J4RK-3zW8vY#12}}.

Some games have no obvious audience at all. At the 2018 lightning talks a developer showed a contemplative procedural game about observing and photographing generated alien whale pods, comparing flukes and dorsal fins, and admitted to having no idea who it was for or where to find them {{60MTG-__dt4#14}}. Nobody in the talks offers a general answer.

**In practice:** decide who your main audience is before you commit to art, interface and onboarding. If it is the existing roguelike community, you can lean on its conventions. If it is wider, budget for polish, check what your art promises, run something like Langford's shame test if children or families are in view, and plan how you will bring the core along {{hnoF_bL-HjI#13}} {{wLLDPz8PnQg#0}} {{NANqgqeqh2k#7}}.

## Standing out in a crowded market: genre signals, tags and niches

A roguelike released today competes with thousands. Scott Burger's Steam dataset counts about 7,870 rogue-style games across six tags: roughly 6,000 tagged roguelike, 4,000-5,000 roguelite and 3,700 action roguelike, then a drop to about 400 roguelike deckbuilders, 326 traditional roguelikes and 475 roguevanias, with many games carrying several tags {{IliQZm5Itng#1}}. David Dunham found 2,554 games under Steam's roguelike deckbuilder tag in 2026, up about 700 in the months between proposing the talk and giving it {{oipNr8RE5bA#6}}. In a field that size, the first problem is being read correctly, and the second is being found at all.

### What your screenshots promise

Players read genre from a glance. Dunham's publisher, Kitfox, warned that a game whose screenshots show cards will be read as a roguelike deckbuilder or card battler, which disappoints deckbuilder fans when it does not meet their expectations and puts off players already fatigued by the subgenre's abundance {{oipNr8RE5bA#6}}. The conclusion is not that cards are always wrong. Avoiding them helps a game stand out, but cards are familiar, they signal a specific subgenre when that is what you want (Cultist Simulator is the example cited), and they are easy to make look good without strong art skills; the right choice depends on your goals, and Dunham was glad the question was raised because it made the game easier to market {{oipNr8RE5bA#9}}.

The roguelike label itself is a signal. Zeno Rogue observes that experimental games with low production values are easier to market if they are roguelikes, which helps them find players {{wOlSws-OI2o#11}}. The label can also be abused: a 2016 lightning talk complained that many iOS games call themselves roguelikes while mainly trying to take players' money and waste their time {{SDojcmObQzw#10}}.

### Finding an underserved niche

Two studios describe picking a niche by looking at the market first. Tabea Iseli is frank that Grimoire Groves became a non-violent, cozy roguelite for money: roguelikes tend to be dark and gritty, cozy-game players were entering dungeon crawlers through games like Hades and Don't Starve, and Steam research (estimating sales of adjacent titles over time) found nothing very close to the idea; farming sims and roguelikes already share sandbox play, resource management and simple repeating gameplay {{ZJAgY73c8bA#0}}. Philomena Schwab's Stray Fawn revived Dungeon Clawler after a team trip to Japan showed arcades with five floors of claw machines; with China having the most Steam users, a game built on a mechanic popular in East Asia looked promising, and two team members built it in three months {{MTam5RT8Kn0#2}}. In both cases the niche was a familiar thing (cozy farming, claw machines) attached to a roguelike structure, aimed at an audience the genre was not yet serving.

### How players find games: tags, data and curation

On Steam, tags are the main map. Burger notes that a game's tags (up to about 20) are ordered by user vote count, which is visible in the page source, and uses that to compute a "rogueness" score: the share of a game's tag votes on rogue-related tags. Non-traditional rogue games range from 0.1% to over 40%; traditional roguelikes cluster more narrowly and somewhat higher, with a few above 60% {{IliQZm5Itng#4}}. Comparing whole tag-vote distributions gives a similarity score that can recommend games (Rogue's nearest match on Steam scored 79%), though Burger stresses this is a sterile mathematical metric, not a measure of quality {{IliQZm5Itng#6}}.

From this Burger draws two proposals. Steam needs a nuanced search where players set desired tag proportions with sliders, such as some roguelike, some hacking and lots of robots, to surface games they do not already know {{IliQZm5Itng#7}}. And because commercially successful games drown out searches, players should actively vote roguelike tags on games so the community can find them {{IliQZm5Itng#10}}. The analysis was only possible on Steam: itch.io has about 10,000 roguelike-tagged results but no good API, and Google Play is more locked down still and does not tag games as roguelike at all {{IliQZm5Itng#0}} {{IliQZm5Itng#10}}.

Others look past tags. Santiago Zapata, who wants the word "roguelike" left loosely defined so the genre can evolve, suggests curated catalogs and communities focused on classic-style roguelikes so that people who like that kind of game can keep finding it {{wwc7pZqs9UA#12}}. Lisa Brown would like games tagged by player motivation, without expecting the general audience to adopt it; meanwhile a player can ask targeted questions of a game like Hades (how long the time horizons are, how fast the failure loop, how long between decisions, how much exploration and unknown) to predict whether it will click {{BjqZdMW8U9Q#14}}.

**In practice:** decide what your screenshots and capsule art promise and whether that matches what the game delivers. Pick a niche you can describe in Steam tags, check how crowded those tags are, and ask your players to vote the tags that fit.

## Getting found: streamers, festivals and word of mouth

The strongest convergence in the business talks is about marketing: for the roguelikes these talks describe, streamers and events sold games, and social media mostly did not.

### The streamer flywheel

Dylan Gedig and Philomena Schwab reached this conclusion independently. Gedig reports that Peglin launched with 75,000 Steam wishlists and sold twice that many copies within three weeks, far above the 10% of wishlists Gedig expected, largely because of streamers and the Steam algorithm; the community that formed came mostly from roguelike streamers' audiences, and ongoing sales still come heavily from YouTube videos that drive visits for months, with spikes from Twitch {{ke0cLTVg2_M#0}}. Twitter mostly reached other developers and Reddit barely moved the needle; digital events and streamers were what worked {{ke0cLTVg2_M#2}}. Schwab saw the same with Dungeon Clawler: with no paid campaigns, a dedicated base of roguelike YouTubers and streamers who look for new and weird roguelikes kept the game alive, while social media did little apart from one Reddit post {{MTam5RT8Kn0#6}}.

Gedig describes the mechanism as a flywheel. Development updates create content and moments for streams; streams bring feedback, word of mouth and sales; sales fund full-time development, which makes the game better and feeds more streaming {{ke0cLTVg2_M#6}}.

> A flywheel that just builds and builds. {{ke0cLTVg2_M#6}}

### Why roguelikes suit streaming

Gedig argues roguelikes fit streamers because they are endlessly replayable, update often, and are easy to hop between, so variety streamers can rotate three or four of them and layer external challenges on top: spinning a wheel to pick a game, or a "pyramid" challenge deck with constraints like winning Peglin while taking only a basic relic {{ke0cLTVg2_M#5}}. Peglin ships small updates every one to two weeks, first to an experimental branch, and when several roguelikes update on that cadence it gives a streamer a steady supply of video material {{ke0cLTVg2_M#5}}. The fit is old. At the 2016 lightning talks Casey, host of the "NetHack Nights" Twitch stream, said NetHack streams well because surprising events arise in any run, chat viewers who know the game react and advise (shouting at mistakes on a 20-second delay), and all you need is streaming software and a terminal {{SDojcmObQzw#4}}.

### The playbook

The concrete advice from these talks is specific enough to follow:

- **Enter festivals with a demo.** Gedig tells small developers to enter every online festival they can, most of which charge no fee, and Steam Next Fest with a demo, because streamers watch festivals looking for the next roguelike; festivals also double as early playtesting, and you can only enter the Next Fest closest to release {{ke0cLTVg2_M#8}}. Passing about 8,000 Steam wishlists gets a game into Steam's popular upcoming list, and Peglin won an award at the Taipei Game Show's digital event {{ke0cLTVg2_M#2}}.
- **Launch the demo where people are looking.** Dungeon Clawler launched its store page and demo together during Steam's Deckbuilders Fest, after 3-4 months of work, with outreach to creators who had played Stray Fawn's earlier games; wishlists tracked demo player numbers closely, though Schwab notes Steam's rules on demos and wishlists have since changed {{MTam5RT8Kn0#4}}. For Next Fest the studio contacted a few thousand creators, and the game became the 11th most played of that fest {{MTam5RT8Kn0#6}}.
- **Make the first email complete.** Put a Steam key and a GIF in your first email to a streamer and skip strict embargoes. Gedig heard back from few streamers, yet every major streamer on the list played or posted on launch day to catch the release surge; some will not stream a game until it seems ready, and all of this cost nothing {{ke0cLTVg2_M#9}}.
- **Go regional where the story is.** Stray Fawn ran its PR with a Japan focus and got about ten times more coverage from Japan than from the rest of the world combined, drawn by the story of Western developers inspired by Japanese arcades; Schwab adds that this kind of game is hard to sell to press before it is already a success {{MTam5RT8Kn0#5}}. The studio does most PR itself but always uses external partners for China and Japan {{MTam5RT8Kn0#9}}.

### Other routes to an audience

An existing community can launch you. Evan Debenham posted the first release of Shattered Pixel Dungeon only to the Pixel Dungeon subreddit; the response was strong enough that the game shipped to Google Play early, and that community's attention made the game rank well there, so version 0.2.0 got over 100,000 downloads in a month {{NMWQIdfCgQg#1}}. Debenham is careful about the cause: the community itself was the smaller early growth, and the big spike came from the store ranking its attention produced {{NMWQIdfCgQg#1}}.

Some audiences will never download anything. Joe Sondow argues that building game-like things on social media, such as Twitter bots, reaches people who lack the patience to download an executable, trust it and run it, because things retweeted into a timeline are discovered and played in place {{4byHHDeVKoA#6}}.

Caves of Qud made its own channel. Caelyn Sandel moved Qud's official streams to a VTuber snapjaw avatar after being mocked on face-cam as a trans woman; the weekly teaching and free-play streams are backed by the founders as a marketing expense, and the bombastic persona promotes the game while shielding Sandel from harassment {{NANqgqeqh2k#5}}. Sandel also gives keys to people who say they wish they could play Qud but are broke, targeting people likely to share the game's values, and argues that varied new materials beyond the same trailers give people who bounced off quietly a reason to look again {{NANqgqeqh2k#10}}. Ivy Melinda warns that you cannot measure what such giveaways achieve: you can count keys given and copies activated, but the connections they form are invisible in the statistics {{db6S2lgTWmI#14}}.

### Streams as a design surface

If streams are where your game is seen, it is tempting to design for them directly. The two attempts in the talks show it is harder than it looks. Tyriq Plummer calls Clean Sweep's Twitch integration, which let chat control monsters, probably the game's biggest failure: drop-in viewers who don't know roguelike conventions need very readable visuals, chat needs its own view to plan surprises rather than acting in the player's sight, and chat monsters need many systems and stakes beyond chasing the player and lowering their HP, so "minimal viable fun" is not minimal {{neuJCYmbAG8#14}}. Isaac Schankler found the same lesson about complexity from the other side: the Public Modular, a synth played through Twitch chat commands, was fun but its intricate commands meant only a handful of people could take part, so Orb Pondering Simulator stripped commands down to a small set like !spawn and !kill {{M6t5W5PPVW0#0}}.

**In practice:** plan your updates, demos and festival entries around the creators who will show them. Ship small updates on a steady cadence, put a demo in every festival you can, send keys without embargoes, and spend your outreach time on streamers before social media.

## Paying for it: business models from postcardware to premium

Roguelikes have been given away, traded for postcards, sold as shareware, supported by patrons and sold at full price. The talks show what each model costs the game and how little most of them earned.

### Keep monetisation away from the challenge

Evan Debenham makes the clearest argument about what a challenging roguelike cannot sell. Ads take screen space and raise privacy concerns, and pay-for-advantage microtransactions cheapen the gameplay, which is especially damaging when the game is meant to be hard {{NMWQIdfCgQg#15}}. For Shattered Pixel Dungeon there was a second constraint: Pixel Dungeon had set a precedent of a fully offline game with only a tiny donate button, and because Shattered is open source, its community could take the code and compete if Debenham sold out, so any monetisation had to be non-disruptive {{NMWQIdfCgQg#15}}.

The solution was a ladder. In 2015 supporter purchases were added, limited to cosmetic and mild-convenience extras (custom gravestone epitaphs, renaming heroes and items, extra rankings screens, UI recolours) designed neither to cheapen the game nor to make non-buyers feel they miss out; in 2019 came a Patreon with weekly mini-blogs, content polls and an exclusive Discord, which needs constant upkeep but gives dedicated players a community {{NMWQIdfCgQg#16}}. Each step depended on the previous one: cosmetics earned well only while updates kept quality up, Patreon needed enough members, and selling the game outright, which looks most sustainable, became possible only once the game was worth buying {{NMWQIdfCgQg#17}}. Shattered launched on iOS for $5 in 2021 with seven years of content behind it, where Pixel Dungeon already cost $3 and Apple users buy up front more readily; Debenham says selling it could not have started seven years earlier {{NMWQIdfCgQg#17}}.

> The game has to be worth buying in the first place. I could definitely not have started selling the game seven years ago. {{NMWQIdfCgQg#17}}

On mobile, the developers Philomena Schwab consulted pointed the same way. When Stray Fawn planned a simultaneous mobile and PC early-access release of Dungeon Clawler, most of the roguelike developers asked, including those behind Peglin and Luck be a Landlord, recommended launching premium rather than free-to-play {{MTam5RT8Kn0#7}}. Schwab also found the risk on the other side: after Next Fest, three free-to-play mobile clones copied Dungeon Clawler's itemization, character designs and balancing, which hurts a premium game before it launches. The talk separates this from legitimate inspiration; another claw-machine roguelike was completely different and Schwab would happily bundle with it {{MTam5RT8Kn0#8}}. A simple, novel design is easy to clone, and in Schwab's case the clones were free.

### A history of modest returns

The genre's founders earned nothing from its first hit. Rogue spread because a binary reached Bell Labs, where it was renamed, and then shipped with the 4.2 Berkeley Unix distribution, so it was played across campuses without earning its authors money; Glenn Wichman's advice is that if you can get your game shipped with an operating system, take it {{IaB7iQhts_c#12}}.

Thomas Biskup made ADOM postcardware because there was no way to earn money from it then and Biskup enjoyed meeting people worldwide: players who liked the game paid by mailing a postcard from wherever they lived, and thousands arrived, eventually from every continent including Antarctica {{a3ZYDA2JVSM#10}}. Jeff Olson, who released Alphaman as shareware about four years into development, received about 30 paid registrations and jokes the hourly wage was below Victorian child labour; Olson wishes they had asked for postcards like ADOM, since meeting people mattered more to them than the money {{Gk5uWXBANkA#12}}.

Selling a traditional roguelike commercially has been possible but tight. Josh Ge reports Cogmind earned about $62,000 in its first year before reaching Steam, later about $75,000, after more than three years of work: just enough for one full-time developer, or as a friend put it, going from unpaid to poorly paid {{9se2M27LuOs#18}}. ADOM's 2015 Steam release mattered because it generated income to pay team members working on it full-time, while Biskup personally works on it for fun {{a3ZYDA2JVSM#20}}.

### Edge cases

Two talks show business models bending around unusual goals. Jim Shepard's Stop the Hunger Clock drive gives donated Steam keys to players who buy hunger-relief food locally and mail in a receipt, deliberately avoiding a push-button online donation so people act in their own communities; one player who couldn't find food bags volunteered four hours at a church food drive instead {{H6fPIhLoA1Y#2}}. Aaron Reed found that selling Subcutanean, a novel generated uniquely for each buyer, broke the distribution system: most print-on-demand services require human review of any manuscript change, which every order triggers, and Amazon requires a new ISBN whenever the text changes {{x0Xh4oCX9t0#14}}. If your product is procedural, check that the channel can carry it.

**In practice:** keep anything you sell away from the challenge, prefer premium where the genre's players expect it, and expect to earn the right to charge by building something worth buying first.

## Crowdfunding: lessons from ADOM's campaign

Almost everything the talks say about crowdfunding comes from one source: Thomas Biskup's 2017 post-mortem of ADOM's 2012 Indiegogo campaign, supported by Biskup's 2016 history of ADOM. Read it as one well-documented case with rules that transfer, not as the consensus of many developers.

The campaign had an unusual purpose. After about ten dormant years, the team used it to judge whether enough people still cared to justify restarting development. They used Indiegogo because Kickstarter was not open to Germans at the time, ran the maximum 60 days, asked for $48,000 and raised more than $90,000, which Biskup counts as a big success {{5CQP8ndTjEY#0}}. Work restarted in September 2012 {{a3ZYDA2JVSM#17}}.

### The core lessons

**Build the community first.** Biskup's main warning is that communities are not built during a campaign; without one, a campaign is likely to be nothing but a valley of desperation, and if you don't know whether you have a community, you probably shouldn't crowdfund {{5CQP8ndTjEY#9}}. ADOM was lucky to keep its community through ten years of hibernation, and viral million-dollar campaigns are lottery-like exceptions {{5CQP8ndTjEY#9}}. It is the crowdfunding form of Josh Ge's general rule that you need a community to have a successful roguelike {{9se2M27LuOs#1}}.

**You are your own biggest source of backers.** Analysing referral sources afterwards, Biskup found the top source of donations was the developer's own outreach, then other individuals, with Indiegogo and its front-page feature near the bottom {{5CQP8ndTjEY#2}}. The platform accounted for only about 1.5-2% of donations, and its front-page feature showed as a tiny one-day bump in the chart {{5CQP8ndTjEY#22}}.

> If you don't manage to acquire donors through your own visibility and your activities, you probably won't get them. {{5CQP8ndTjEY#2}}

**Set a minimal goal and add stretch goals.** The $48,000 goal tried to fund all ten planned features at once. Biskup thinks a minimum goal for one or two of the most interesting features, "barely enough to succeed", followed by interesting stretch goals would likely have funded on day five or ten instead of near the end, so that about 50 of the 60 days were not lost {{5CQP8ndTjEY#14}}. The evidence is what happened after funding: once backers knew the game would happen and stretch levels opened, every following day beat the valley days, and Biskup calls not anticipating this a big mistake {{5CQP8ndTjEY#6}}.

**Promise virtual rewards, not physical ones.** Physical rewards added in desperation, above all a pen-and-paper ADOM RPG that had to be written, checked, packaged and shipped, kept the team from programming for weeks and months; for a computer game, promise rewards inside the game {{5CQP8ndTjEY#21}}. In the 2016 talk Biskup adds that the RPG was delayed again and again because Biskup loves programming but hates writing, and the conclusion for any future campaign was no physical rewards at all {{a3ZYDA2JVSM#21}}.

### The shape of a campaign

ADOM's daily donations followed a curve Biskup describes as emotionally very hard. More than $7,000 came in the first 24 hours and 25% of the goal within three days, then donations fell to around a hundred dollars a day for weeks: the "valley of desperation" {{5CQP8ndTjEY#3}}. The team tried to climb out. "Power pledge drives" promised predefined extra content if a target was reached within a few days, such as +1 corruption content for every $300 donated within five days; three drives each produced a tiny, brief spike and were not worth the effort {{5CQP8ndTjEY#4}}. Limited, never-again-available physical rewards, first expensive boxes and then a cheaper RPG book, also gave one small spike before donations trickled back to nothing {{5CQP8ndTjEY#5}}.

Funding arrived only seven or eight days before the end, followed by a day almost as big as the first {{5CQP8ndTjEY#6}}. The last 24 hours brought in about $22,000-23,000, more than any other seven-day period, helped by a backer who pledged $5,000 if the community passed $70,000 within an hour (it took about 30 minutes) and another who matched that pledge {{5CQP8ndTjEY#7}}. Since the action came at the start, at funding and at the end, Biskup doubts long campaigns help: most of the time nothing happens, which is bad for morale, and shorter campaigns can work very well {{5CQP8ndTjEY#8}}.

The goal also drew anger. Many people thought it outrageous to ask for $48,000 {{a3ZYDA2JVSM#17}}, and ADOM was called greedy while cheaper campaigns promised more. Biskup believes those cheaper campaigns did not deliver, and warns against over-optimism: serious work needs money, the goal deserves long thought, and you can fail one crowdfunding campaign but not a second {{5CQP8ndTjEY#15}}.

### Presentation and platform

- **Video first.** The video matters more than anything else. Keep it to about 90 seconds, since nobody watches ten-minute videos, and if you cannot make an excellent one yourself, pay a videographer a thousand or two dollars or find enthusiastic community members to help {{5CQP8ndTjEY#10}}.
- **Visuals, even for ASCII.** After the video, backers judge by images how professional the project looks; video plus visuals is about two-thirds of a win. Biskup admits this is hard for ASCII games but cites Josh Ge's Cogmind as proof ASCII can look amazing {{5CQP8ndTjEY#12}}.
- **Professional text.** ADOM's community tore apart Biskup's own campaign text and rewrote it completely, which Biskup calls the best thing that could have happened; campaigns with a grammar mistake per sentence do not win people's trust with money {{5CQP8ndTjEY#13}}.
- **The biggest platform.** Biskup recommends Kickstarter over Indiegogo purely for visibility: if only a tiny fraction of visitors care, you want the platform with the most visitors {{5CQP8ndTjEY#11}}.
- **Simple pledge levels.** One exclusive $40 level that did not include the other rewards had to be explained hundreds of times, despite warnings in capital letters; make every level straightforward, with no special ideas in it {{5CQP8ndTjEY#24}}.

The platform's limits cost ADOM its best publicity. A joke $50,000 tier, the source code printed in leather-bound books and hand-delivered with a weekend of explanation, mocking those who had sent death threats demanding the source (a story the last section returns to), was claimed by Notch within minutes of launch {{a3ZYDA2JVSM#18}} {{5CQP8ndTjEY#25}}. Indiegogo let campaigns create levels of any size, but its PayPal account could not accept more than $10,000; after days with support, Notch was asked to verify identity at a bank with a passport and declined {{5CQP8ndTjEY#25}}. Biskup regrets the lost publicity more than the money, judging it probably worth millions, and gives it as the reason for never using Indiegogo again {{a3ZYDA2JVSM#18}} {{5CQP8ndTjEY#25}} {{5CQP8ndTjEY#11}}.

### Running it and finishing it

The campaign took three to five hours of communication a day, across social channels, blogs, forums and mailing lists, for 60 days on top of a full-time job; Biskup prepared well and still totally underestimated it, and it became draining after the 30th or 40th day {{5CQP8ndTjEY#18}}. Repetition is unavoidable: Indiegogo told the team people usually need seven contacts before donating, which Biskup found about right, and even after 50 daily posts some people who checked Biskup's Facebook every day had never seen the campaign {{5CQP8ndTjEY#19}}. Plan every activity before launch by studying successful campaigns, because mid-campaign you will have neither the time nor the energy to invent new ones, and desperation in the valley is when things get out of hand {{5CQP8ndTjEY#20}}.

Expect hate for asking for money at all, and learn to ignore haters, but separate them from blunt critics. Some of ADOM's initially nasty commenters were seriously trying to improve the campaign, and engaging them produced feedback Biskup thinks the campaign might have failed without, even when it arrived as "all your texts are shit" {{5CQP8ndTjEY#26}}.

The money is smaller than it looks. Budget every cost in advance: a 5-10% platform share, printing, shipping and legal fees, with German lawyers typically charging about 1,800-2,400 euros a day and contracts rarely taking one day {{5CQP8ndTjEY#17}}. Crowdfunding income is taxed, possibly at 40-50% in some countries; ADOM's campaign ended near year-end, leaving no time to accrue costs against it, and a large tax demand arrived before any work was done, recovered only later after a tense argument {{5CQP8ndTjEY#16}}. Fulfilment was its own burden: in 2012 there were no automated delivery portals, so the team wrote their own, learned about UTF-8, exported addresses to label-printing programs and sometimes hand-wrote Korean addresses {{5CQP8ndTjEY#23}}.

One open question concerns who pays. ADOM is English-only, and almost a third of donations came from the US, with English-speaking countries first, then a strong Eastern European fanbase in Poland, Ukraine and Russia; the second-largest group was the 42 other donating countries combined. Biskup wonders whether more languages would have changed that, though the team judged translation impossible with reasonable effort {{5CQP8ndTjEY#1}}.

### Pre-launch checklist

Drawn from ADOM's case:

- Do you already have a community you can reach directly? If you cannot tell, don't launch yet {{5CQP8ndTjEY#9}}.
- Is your goal the minimum that makes the project viable, with stretch goals ready for after funding {{5CQP8ndTjEY#14}} {{5CQP8ndTjEY#6}}?
- Are your rewards virtual and your pledge levels simple enough to need no explanation {{5CQP8ndTjEY#21}} {{5CQP8ndTjEY#24}}?
- Do you have a 90-second video, strong visuals and professionally written text {{5CQP8ndTjEY#10}} {{5CQP8ndTjEY#12}} {{5CQP8ndTjEY#13}}?
- Have you planned every update and post for the whole campaign, and budgeted three to five hours a day to run it {{5CQP8ndTjEY#20}} {{5CQP8ndTjEY#18}}?
- Have you checked that the platform can actually accept your largest pledge level {{5CQP8ndTjEY#25}}?
- Have you budgeted platform fees, taxes, lawyers and fulfilment, and considered when the money will land in your tax year {{5CQP8ndTjEY#17}} {{5CQP8ndTjEY#16}}?

## Who owns community work: authorship, openness and culture

Much of this chapter argues that roguelikes are made collectively. That collective work sits uneasily with law, commerce and the authority of a single creator, and the talks here are less about technique than about choices a developer has to make deliberately.

### What the law sees

Kaysa Konopljak's account of DotA is the sharpest warning. In this telling, the legal system's preference for easy-to-understand singular authorship let Valve and Blizzard reframe a community mod made by many people as the work of a few hired "masterminds" {{s0XCPTZDgUg#2}}. The strategy had three prongs: declare mastermindship with an unbroken chronological line of authorship, discredit the community as unserious people with usernames, and demand that anyone else prove their claim; courts, Konopljak says, find collective works too messy to adjudicate {{s0XCPTZDgUg#2}}. The earlier contributors whose work laid the groundwork for DotA Allstars were mentioned only in passing, because they never encrypted their work or claimed it and were not in the room with the lawyers; if copyright only protects those able to enact and police ownership, they argue, the claim that it protects artists does not hold {{s0XCPTZDgUg#3}}. The incentive this creates is corrosive: guides tell creators to keep proof-of-work timelines and hold ideas secret until they can afford lawyers, which pushes people towards anti-social, competitive behaviour and away from the collective authorship that made DotA possible {{s0XCPTZDgUg#5}}.

Konopljak ends on roguelike developers specifically. Their transparency, open-source code, open development and habit of openly declaring inspirations are among the best defences against authorship being appropriated; Konopljak adds that ownership of player-driven emergent narratives in procedural media is weird at best {{s0XCPTZDgUg#6}}. NetHack shows that ethos in practice. When MoMA added NetHack to its collection, the DevTeam insisted it be credited solely to "the NetHack DevTeam", not out of secrecy but because NetHack was not built by a select few {{9V_CkJ66uJQ#3}}.

### The case for keeping it closed

Thomas Biskup pulls the other way, and the reasons are worth taking seriously. Biskup originally planned to open-source ADOM at version 1.0, then declined: it is a story-driven game expressing a personal story, tens of thousands of hours had gone into it, things like Jedi knights in ADOM were unwanted, and the expectation was that variant players would bring their requests to the originator, turning joyful storytelling into a management task {{a3ZYDA2JVSM#25}}. The experience that shaped this was ugly. After a hint that the source might be released, some players sent persistent death threats insisting there was no right to keep it private; Biskup says the community is overwhelmingly great and such people no longer matter, but the experience changed Biskup's view on open-sourcing considerably {{a3ZYDA2JVSM#9}}.

The two positions are not simply right and wrong. Konopljak's case is about a community's work being taken from it; Biskup's is about one author's work being demanded by a community. What you choose depends on whose work the game mostly is, and whether you want to be the steward of everything others build on it {{s0XCPTZDgUg#6}} {{a3ZYDA2JVSM#25}}.

### Community as culture

Some talks widen the frame from the game's community to culture itself. Tanya X. Short suggests thinking of society as a very old live-ops simulation in which you are a thread rather than a player: each person has local variables like tastes and can expose global ones others see, some bugs are hard-coded legacy, but behaviour-based bugs like racism and sexism should be fixable, even though the servers can never be taken down {{c6FQeo5n0Bc#0}}. Short contrasts two ways change happens. Centralised authority such as law is clear and consistent but slow, costly and inaccessible; decentralised, peer-to-peer change is faster and stronger but prone to error and sabotage, and people tend to elevate credible sources until they become a central authority again {{c6FQeo5n0Bc#1}}. Pixelles, the group the talk describes, uses a "ripple effect": put tools in the hands of women and other marginalised genders and let them inspire and educate their own communities through overlapping networks, something Short says Roguelike Celebration also does {{c6FQeo5n0Bc#2}}. The caution is about pace: culture change has enormous inertia, you influence only "one little file" such as your neighbourhood or family, and it is not a game jam but years of patient work in which minds change through real conversation {{c6FQeo5n0Bc#3}}.

> You can't approach it like a game jam. This is a game that takes your whole lifetime to build. {{c6FQeo5n0Bc#3}}

Others make the same point about the tools and forums a community runs on. JP LeBreton calls building a tool for creative work a social and political act that opens doors for new creators; LeBreton cites Playscii's use in Nauticrawl, album covers and music videos, says they would rather spend their career on tools than games, and urges others to build tools that echo their values {{MJZvWgcxV0M#14}}. Andrew Doull deliberately introduces Roguelike Radio guests without the credentials that might convey authority: the only qualification is having played the game and having something interesting to say, a democratising choice; the host, Alexei Pepers, added that Roguelike Celebration shares it when it looks for speakers {{NaqP13nkpfU#1}}. For anyone starting such a channel, Doull's practical advice is to spend money on client-side recording software and a room with soft furnishings, since microphones are rarely the problem {{NaqP13nkpfU#2}}.

Two talks look outward from the genre entirely. Michael Brough argues that treating games as a wholly new medium devalues them, because it neglects how they connect to work going back centuries, from the picaresque to Shakespeare, the same blindness behind old "are games art" debates {{zDKheM-E45I#11}}. Max Hawkins urges roguelike developers, as experts in building realities that differ every time, to apply procedural generation to randomising real life and escaping preference loops {{anwk8b7c_s0#3}}.

**In practice:** decide openly what you share and how you credit the people who contribute, before a dispute forces the question. Declare your inspirations, keep the record of who built what, and treat your community as a culture you help shape rather than an audience you own {{s0XCPTZDgUg#5}} {{9V_CkJ66uJQ#3}}.

## Tensions and open questions

**Niche depth or a wider audience?** The Rogue panel and David Brevik hold that a game can have inherent quality without appealing to everyone and that niches can now succeed, and Scott Burger's data shows traditional roguelikes hold their players longer {{IaB7iQhts_c#11}} {{OwFrTY3IoQQ#11}} {{IliQZm5Itng#9}}. Thomas Biskup argues that traditional roguelikes are not mainstream successes and that reaching wider means rethinking the genre's conventions from scratch {{hnoF_bL-HjI#0}} {{hnoF_bL-HjI#13}}. Josh Ge stands between them, treating polish as the bridge that carries roguelite players into traditional games {{9se2M27LuOs#7}} {{9se2M27LuOs#19}}. The choice depends on whether a small, loyal audience can pay for the game, and on how much of the existing community you are prepared to unsettle.

**How close to stand to modders.** Subset Games made Into the Breach easier to mod and tries not to break mods, though it lacks time to build full tools {{rNi5nO5yqLs#11}}; Jon Perry keeps UFO 50 mods at arm's length so they do not steer Perry's own design {{NlxGPKV0PrY#15}}; Caves of Qud hires its modders and fan writers {{mES03vaZo3U#11}} {{db6S2lgTWmI#8}}. It depends on whether you want fan work to shape the game or to run alongside it, and on how much attention you can spare.

**Open or closed authorship.** Kaysa Konopljak argues that the roguelike community's openness, open source and declared inspirations are the best defence against a collective work being appropriated {{s0XCPTZDgUg#6}}. Biskup refused to open-source ADOM because it tells a personal story and Biskup did not want to field variant players' requests {{a3ZYDA2JVSM#25}}, a view hardened by death threats demanding the code {{a3ZYDA2JVSM#9}}, and offers modding instead as a compromise {{iZUXjbcAfYs#15}}. Openness also constrains business: Evan Debenham could not monetise Shattered Pixel Dungeon aggressively because its community could fork it {{NMWQIdfCgQg#15}}. It depends on whose work the game mostly is.

**Must scores be verified?** Drew Streib takes a hard line on restored games so that a NAO score means something, but warns that fewer people care about bragging rights than you think {{J4RK-3zW8vY#2}}. Jim Shepard would rather wipe leaderboards after a big patch and give the old champion a cosmetic hat {{FZn4NeQOcFE#17}}, and Alan Malloy suspects DCSS's tournament scoring rewards quantity over skill {{QV57CYrIZow#11}}. How much rigour you need depends on how large your competitive minority is.

**A unique world per player, or a common one?** Tariq and Ivy Melinda locate the value of procedural generation in the differences players compare {{SDojcmObQzw#0}} {{db6S2lgTWmI#5}}, while slashie set procgen aside for a non-procedural world so that discoveries could be shared {{R8DSq8qSJ44@32392#7}}. Shared seeds are a partial middle path, which Qud's developers admit only "sort of works" {{owmGknfj6H4#4}} {{db6S2lgTWmI#10}}. It depends on whether you want players to compare stories or compare findings.

**How to answer a backlash.** Subset explains its reasoning and holds to what testing supported {{rNi5nO5yqLs#4}}; Against the Storm waits two weeks before reacting {{tWFIQaeSs6M#12}}; Angband's maintainers ran simulations and adjusted where the complaint held up {{eeSk665OXkM#18}}; Blaseball openly kept a broken voting system and patched around it {{zO05p-e57AQ#19}}. The common ground is diagnosis before action; what follows depends on whether the evidence supports the complaint and whether the flaw is part of the game's fun.

**Streams as a design surface.** Dylan Gedig and the host of a NetHack Twitch stream agree that roguelikes stream well {{ke0cLTVg2_M#5}} {{SDojcmObQzw#4}}, but both attempts to let chat play directly ran into trouble, Tyriq Plummer's by its designer's own account the game's biggest failure {{neuJCYmbAG8#14}} {{M6t5W5PPVW0#0}}. How to design for a stream audience, rather than simply be streamable, is unsolved.

**Problems nobody has solved.** How to find an audience for a game that fits no existing one {{60MTG-__dt4#14}}; how to measure what a key giveaway achieves {{db6S2lgTWmI#14}}; whether translation would have widened ADOM's backers {{5CQP8ndTjEY#1}}; how players can show off unique procedural creations inside the game {{xju91VGh2Ps#14}}; and who owns player-driven emergent narratives at all {{s0XCPTZDgUg#6}}.

## Checklist

1. Can a player share a run, a death or a single generated thing in one action, and have you looked at your output at that cropped scale?
2. Does the game write a log, morgue or scrollback that someone else can read as a story, and can players enter a seed?
3. What game data could you expose publicly without touching personal or login information?
4. If the game went online, what would spectating, shared bones or scoreboards add, and what must a score prove?
5. What does a balance patch do to existing records?
6. Is your content in data files that a modder can change in a few lines, and will those mods survive your updates?
7. Have you left deliberate gaps for modders, and decided how closely you will look at what they make?
8. How often do you release, and how many clicks does it take a player to send you feedback?
9. When you act on feedback, does the player who gave it find out?
10. For each complaint, do you know the desire behind it, and whether it is a design problem, a presentation problem or a request for a different game?
11. Who is not talking, and how will you weigh them before reversing a change?
12. How many hours a week does community work take, who sets the tone, and what can volunteers do?
13. Who is your main audience, and do your art, screenshots and tags promise what the game delivers?
14. Which streamers and festivals will see your next update or demo?
15. Does anything you sell touch the challenge, and if you crowdfund, do you already have a community you can reach directly?

## See also

- [02. History and lineage](02-history-and-lineage.md): the servers, variants, postcardware and communities that carried the genre.
- [04. Learning and discovery](04-learning-and-discovery.md): how spoilers, spectating and shared knowledge shape what players learn.
- [10. Content generation](10-content-generation.md): the generated things players compare and share.
- [13. Interface and accessibility](13-interface-and-accessibility.md): onboarding and access for the wider audiences discussed here.
- [15. Architecture and tools](15-architecture-and-tools.md): data-driven design that makes modding and wikis possible.
- [16. Production and process](16-production-and-process.md): scope, playtesting and sustaining a long development alongside a community.
