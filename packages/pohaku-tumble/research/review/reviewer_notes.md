# First-read reviewer notes, by batch

## batch-000

Batch 000 result: 8 keep (ahonui, ahupuaʻa, akeakamai, akemāmā, alahao, alakaʻi, alaloa, alanui), 5 keep-pending (aholoa, akeloa, alahaka, alawai, alaʻula), 4 doubtful (ahihonua, ahimakani, ahuwaiwai, alapiʻi) and 3 drop (all three akua·X words). Full records are in the written file. About 19 web searches.

Decisions that affect every batch, for the orchestrator to settle:
1. The root piʻi. Its sense list in the dossier (piʻi#0) includes 'to mount, to breed' and a vulgar gloss. Under the either-root rule I flagged alapiʻi for exclusion. On its own merits it is a keep: Andrews plus Hawaiʻi Public Radio, attested spelling, degree 10. So I set it to doubtful, not drop. This needs one policy decision for every piʻi compound: does P&E carry that sense, and does a slang extension of 'climb' taint the root? If strict, it becomes drop; if not, keep.
2. The root loa. Andrews gives loa n. 2 as 'a receptacle of filth; he nenelu inoino' (a foul mire). It is not clearly excretory, so I did not flag it, but every loa record (aholoa, akeloa, alaloa) carries a sensitivity note and a check for whoever reads P&E. Other batches should treat it the same way.
3. The id 'ake' lumps 'liver' and 'desire' into one homograph, which follows Wiktionary and the single PPN *qate. So the AKE stone in akeakamai (desire) would link to the one in akemāmā and akeloa (organ), and the cards would print different glosses for the same stone. This is a curation choice: split the id or accept it.
4. alaʻula is probably alaula. A UH Mānoa-hosted weather-term list compiled from P&E (Kaliko High, 2022) prints 'Alaula' with no ʻokina, though the same list writes Akaʻula and Haka ʻula with it. If P&E agrees, the second stone is ULA, not ʻULA 'red', and the split needs rework. Other pieced-together ʻula compounds may hide the same problem.
5. The akua·X family. All three here are drops: akuahānai is sorcery (a poison god); akualele is sorcery, with a Star-Advertiser source for the kahuna-sent fireball, and is the costliest loss at degree 13; akuamakua is really akua + ʻaumakua, three parts. Expect the same pattern elsewhere.
6. Andrews three-part brackets squeezed into two stones turn up in ahihonua (ahi + ʻai + honua; Kona Historical Society writes 'ahi ʻai honua') and in akuamakua.

Smaller judgement calls:
- The highest-degree word, alawai (degree 28), stays keep-pending. Its only definitional source is Wiktionary, and the strong association is the Ala Wai Canal, a proper name. P&E must show it as a common noun.
- alaloa is a keep, but the caption's word break should match the map label, which uses 'ala loa' after NPS.
- ahimakani is doubtful: Wiktionary only, with no use found in Andrews, on Hawaiian Wikipedia or on the web.
- Anything from memory is in reviewer_knowledge, labelled unverified, and was not used as evidence.

Search problems:
- Search results kept surfacing off-limits dictionary copies: wehe.colo.hawaii.edu, wehe.hilo.hawaii.edu, hilo.hawaii.edu/wehe, ulukau.org/chd (the Combined Hawaiian Dictionary), a pirated P&E PDF on vdoc.pub and a pirated Māmaka Kaiao on dokumen.pub. I opened none of them and counted no summary text that drew on them. These domains should go into blocked_domains for the other batches.
- Fetches that failed: scihi.hawaii.edu (DNS), pacificworlds.com (503), core.ac.uk (403), hoakaleifoundation.org (530).
- Two web sources are cited from search results without opening them: the HRS §5-7.5 text and the Hawaii News Now page; the records say so.
- Some web_sources are reused from research/TERMS.md (the NPS and Kapiʻolani CC ahupuaʻa pages, the Ala Kahakai ala loa pages) and were not fetched again; the records say so.

Shared scratchpad: a parallel agent overwrote my first helper script, show.py, mid-run, and one call returned another batch's dossiers. I moved my helpers into a private subfolder (scratchpad/b000_reviewer/) and wrote only the requested review file. Other batch agents should use unique file names.

## batch-001

Batch 001: 20 words. 6 keep (anamanaʻo, anapuni, anawaena, aouli, aumiki, aumoe), 8 keep-pending, 4 doubtful, 2 drop. 22 web searches; none of the forbidden sites were opened.

1. Root error on au, needs action upstream. Andrews writes no ʻokina, and two of the au· candidates turn out to start with ʻau:
   - auwaʻa is ʻauwaʻa. Source: ʻŌlelo Noʻeau 1125 (Pukui 1983), as quoted by the Polynesian Voyaging Society.
   - auwaha is ʻauwaha. Source: UH Mānoa IHLRT's modern-orthography text of Ka Nupepa Kuokoa, 1877.
   - So the first stone is ʻau, not au (era/current). Andrews' auwai [au, furrow] is ʻauwai (DESIGN §3.5 writes it that way).
   - These words must not link to AU stones. The 'au' row in roots.tsv probably mixes au and ʻau across the whole core, not just this batch.
   - aumihi and auwā have the same unchecked first element.
   - ʻauwaʻa ('fleet of canoes', traditional) is worth re-entering as ʻau·waʻa once P&E glosses ʻau.

2. Andrews-only aʻa· family:
   - aʻalele 'artery' (degree 14, top P&E priority), aʻalolo 'nerve' and aʻa koko 'blood vessel' are transparent.
   - No reputable web source corroborates them. The only snippets found quoted the Wehewehe mirror and were not counted.
   - aʻa koko is written as two words in its one modern hawwiki use.

3. Other points for review:
   - aumoe: Andrews and Johnson (2008, 'time of sleep') read au as 'time'. Wiktionary derives it from PPN *aqu-mohe instead. This affects linking, not inclusion.
   - haiao: Andrews' 'sermon' haiao is modern haʻi aʻo, a different word.
   - hai: Andrews lists 'to act lasciviously' under the unmarked spelling hai (via hoohai). It is probably haʻi, but P&E must confirm, because if it is hai, §4.3 would exclude every hai· word. Only this holds haipule at keep-pending.
   - anilā: a contested modern coinage. A kumu (Ka ʻAlalā blog) asks people to stop using it, so it may make a fluent reader wince.

4. Source caveats:
   - The UH SOEST weather-term list (Kaliko High 2022) is a UH page that compiles Pukui & Elbert entries. I used it for aumiki ('outgoing current') and for aouli under ao 'cloud', but it is secondhand P&E, so the P&E check should still confirm both.
   - WebSearch results routinely pull from wehe.hilo.hawaii.edu, wehe.colo.hawaii.edu and hilo.hawaii.edu/wehe. The search summaries blend those into their answers, so every snippet needs its source checked. Later batches should block those hosts in WebSearch.
   - KHON2 returned 403. The KSBE and SOEST PDFs only read via pdftotext on the saved file.

5. Dossier gaps:
   - The flag 'homograph root: sense unresolved' was resolvable for aumiki (miki#0) and aʻalolo (aʻa#0 includes nerve).
   - Andrews' separate hui 'ache' (for aʻahui) is missing from the dossier's hui homographs.
   - hawwiki counts are only for the candidate's own spelling. I searched the local dump for the ʻokina variants: none found.

## batch-002

I reviewed all 20 candidates in batch-002, and every one is A* (Andrews–Parker only). Verdicts: 2 keep, 11 keep-pending, 6 doubtful, 1 drop. The keeps are haku mele and hale aliʻi. The full records are in the JSON file. I used about 24 web searches plus a few fetches. I checked the PDFs locally with pdftotext.

Patterns:
(1) The hai· words (haipō, haiʻai) carry the same open question as batch-001's haiao and haipule. Andrews lists 'to act lasciviously' under the unmarked spelling 'hai'. If Pukui & Elbert puts that sense under hai rather than haʻi, the either-root rule would remove every hai· word.
(2) Two haka· words (hakamoa, hakaʻōlelo) rest on Andrews' 'haka, to quarrel'. That sense is not among the dossier's homographs; it may be clipped from hakakā. So sense_a is unresolved for both. For hakamoa, Andrews' own haka n. 3 ('a hen-roost' for moa) gives a second possible parse. hakamoa is still well attested in current use: KSBE writes 'haka moa', a one-leg Makahiki wrestling game, and the UH Ka Waihona page lists 'Hakamoa'.
(3) For hakuone, Andrews' bracket says haku 'lump', but the meaning (a plot farmed for the konohiki or chief) points to haku 'lord'. No source states which, so sense_a is unresolved. Two UH Mānoa works confirm the word: Steele 2015 writes 'haku one', Farrant 2020 writes 'hakuone'. Steele also attests 'haku ʻāina' (land stewards) and quotes Kepelino's 'hakuaina'.
(4) Most hale· words have no modern attestation: halekaua, halekia, halelepo, hakuhale-like phrases. Their letters are low-risk, but the word break is unknown. Modern writing tends to split them, as hawwiki does with hale aliʻi (51 two-word hits), hale kula and haku mele (126 two-word hits).
(5) halekula is dropped because kula#2 'school' is an English loan.
(6) halelepo is flagged because Andrews gives lepo the sense 'dung; excrements'. I held it at doubtful, matching the precedent of alapiʻi in batch-000. Whether LEPO stays as a stone at all is a project decision.
(7) halelana is attested as one word in the Hawaiian Bible (Gen. 6:14, 7:1, 7:7, 8:6), so it is a Bible coinage; see DESIGN §10 q7.
(8) halehau splits across two different hau roots (the tree and ice). It is also sacred and close to a deity's proper name, so I left it doubtful.
(9) Andrews glosses hakuwahine as 'mistress' (meaning a female master in 1922). That English word must never reach a card.

Sources I disregarded:
- Search summaries for hakuone, hakamoa and hale lepo drew on wehe mirrors (hilo.hawaii.edu/wehe, wehe.hilo.hawaii.edu, wehe.colo.hawaii.edu). I ignored them and did not count them, including a 'chicken roost' reading of hakamoa that one of them carried.
- Translation sites (translate.how, languagedrops) calling 'hale kaʻa' the word for garage were not counted.
- A DLNR PDF said to contain the title 'Haku ʻĀina' could not be text-extracted, so I did not cite it.
- The Bible text came from a blogspot transcription that doesn't say which edition it uses, not from baibala.org.
- I did not use Wikipedia's 'Hale Aliʻi ʻIolani' as evidence; hale aliʻi rests on Andrews plus the hawwiki usage.

## batch-003

I reviewed all 20 words in batch-003. Result: 3 keep, 9 keep-pending, 4 doubtful, 4 drop. Full records are in the written file.

Patterns in this batch:
- Eleven of the 20 are hale + X, and every one has degree 18 or more. A HALE stone will be a big hub. All the hale words are buildings, so I put them all in the hana field. That puts 14 of 20 words in hana, so the board's field spread will lean hard on hana.
- Most hale words are joined in Andrews but written as two words in modern use (hale pule, hale lāʻau, hale mākaʻi, hale moe, hale piʻo, hale pahu). This supports ROOTS.md's point that two-word compounds belong in from the start.
- Two words, hanawale and haowale, pair a verb with the particle wale ('only, without cause'). That is grammatical, not root + root. The dossier's only wale homograph is 'bodily secretion / mucus', so any WALE stone would carry that sense on its card. I suggest screening out every *wale compound in other batches the same way.

Three exclusion questions that reach beyond single words, for the team to decide:
1. lāʻau: POLLEX's Hawaiian gloss list for *raqa-kau includes 'male erection'. Applied strictly, the either-root rule removes lāʻau (tree, wood, medicine) everywhere. I held halelāʻau at doubtful, following the batch-000 piʻi precedent; on its own merits it is a keep.
2. lua#1 'pit': Wiktionary lists 'toilet' among its senses, and in Hawaiʻi English and Pidgin 'lua' means restroom. That flags every lua 'pit' word, including DESIGN §4.5's own example luapō. I dropped halelua; its burial senses would sink it anyway.
3. moe: P&E may include a sexual 'sleep with' sense. I did not flag it, but it is in pe_check because it would reach every moe word (aumoe was a keep in batch-001).

Specific doubts:
- halepahu: Andrews says 'house of refuge in war'; NPS says 'drum house in the courtyard of a luakini'. The two disagree, and the luakini sense needs care.
- halepāpaʻa: the 'secure' root matches neither Wiktionary homograph of pāpaʻa, and it may itself be pā- + paʻa.
- hanahiō: Andrews itself marks it '(Not idiomatic.)'. Andrews' hio (hi'-o) also has a 'wind from the bowels' sense; it may be a different word from hiō, but that should be confirmed before HIŌ is used elsewhere.

Searches: about 24, mostly on the degree-18+ hale words. Nothing on the forbidden list was opened. Several results came from wehe.hilo.hawaii.edu and wehe.colo.hawaii.edu (the snippets claimed 'hale papaa' = storehouse, 'hale malumalu' = shed, and lua = toilet/outhouse). I disregarded them. hawaiian-words.com also came up repeatedly and looks as if it may be copied from P&E, so I neither opened nor counted it. I mention its claim of a red fish-bait sense for hamoʻula in that word's pe_check only as something to look at, not as evidence.

What I did use from the web: Hawaiʻi Public Radio (hale pule), the NPS Puʻukoholā glossary (hale pahu, hale noa), the Bishop Museum's Hawaiʻi Alive page (its hale list has no hale moe), the Historic Hawaiʻi Foundation (Ka Hale Lāʻau), Kauaʻi Now and Hawaiʻi Police Department (hale mākaʻi), Leong Leong / Kanaka Maoli builders (Hale Piʻo, 'arched house'), and UH ScholarSpace (asthma is hānō, not hanupaʻa). No citable modern use turned up for halelewa, halelole, halemalu, haowaha or haomanamana.

Two problems with the dossiers:
- Several of the hana mana sentences in the Hawaiian Wikipedia set are garbled machine text, and I discounted them.
- The Andrews entry quoted for halepiʻo runs on into the next headword (Halepohaku).

## batch-004

Batch 004: 1 keep, 10 keep-pending, 3 doubtful, 6 drop. Full records are in the JSON file. Every sense id in them was checked against the dossier homographs.

1. False wale and ana links make degree numbers look higher than they are. In helewale, heʻewale and hikiwale, wale is the postposed particle 'only, merely' (POLLEX PPN *wale 'of no account; only, just'). The dossier only lists the wale root meaning 'bodily secretion, mucus'. In hikiana, the ana is the participial ending, and Andrews says so in the bracket. These words carry the batch's highest degrees (13–15), but only because the matcher counted those false links. I recommend the lexicon builder drop any Andrews bracket whose second part is glossed 'only', 'merely' or 'participial termination'. Separately, the wale 'mucus' root itself is borderline under the excretory rule.

2. The negator ʻole needs a project decision. hauʻole and haʻiʻole are X + ʻole 'without X'. ʻole works like a grammatical word, and the ʻole family inflates degrees. I flagged both as possible grammatical exclusions.

3. Some root senses only show up in Andrews and could trip the §4.3 screen. Each one affects every compound built on that root:
- haʻi: 'to act lasciviously' (sense 6 of Andrews' hai v.).
- heʻe: 'the menses' (Andrews n. 2).
- nalu: a separate homograph for birth fluids (POLLEX *ranu 'amnion, meconium').
- mālolo: 'fickle person who leaps from mate to mate' (Wiktionary).
- moe: may have a 'sleep with' sense, which needs the Pukui & Elbert check.
I set the exclusion flag only where a word already had other problems (haʻiinoa, haʻiʻole, hiʻumālolo). I left heʻe nalu as a keep, with a sensitivity note. Whether a homograph's sense counts against a shared spelling is a policy question for the kumu read.

4. Missing homographs leave some stones unidentified. Pukui & Elbert, or an added glossary line, has to fill these in:
- hauʻoli: Wiktionary analyses the hau as 'temperament (in compounds)', a sense attested nowhere else. Andrews analyses the word as hau + oli 'to sing', which the modern ʻokina spelling contradicts.
- hiʻipoi: Andrews' poi here is 'to cover, protect', not poi the food.
- haʻiinoa: the haʻi here is 'to tell', but only haʻi 'to break' is listed.
- hikilele: Andrews leaves hiki unglossed.
hauʻoli and hikilele are strong words held back only by this.

5. Spelling and word break:
- heʻe nalu: Hawaiian Wikipedia writes it as two words 18 times and as one word twice. Kumukahi (Kamehameha Publishing) and UH Kawaihāpai write heʻe nalu.
- hikilele: spelled without ʻokina or kahakō in a Kamehameha Schools mele text that marks both elsewhere.
- hiʻipoi: attested by UH News and a UH ScholarSpace essay.
- haʻiinoa: its one modern use (Hawaiian Wikipedia, two words) seems to mean 'pronoun', not 'noun'.

6. Searches: about 20 searches and 6 page fetches. Nothing useful turned up for hikimoe (only a Waipahu street name), helekū, hinamoe, hiʻilani (only baby-name sites, not counted), or the hau in haupia (recipe sites disagree, not counted). One hikilele search summary quoted a gloss from hilo.hawaii.edu/wehe, a wehewehe mirror. I disregarded it and did not open it. The hawaiian-grammar.org fetch came back empty. Nothing from wehewehe, ulukau, baibala, trussel2 or the Wiktionary API was opened.

## batch-005

Batch 005 has 20 candidates: 9 keep, 8 keep-pending, 3 drop. Sixteen of them are hoa- words ("companion" + X), with one hoe- and three holo- words. Full records are in the written file.

Problems found in the dossiers and source data:
1. hoalawe is not a real word. The candidate came from a cropped Andrews entry: the actual headword is Hoalawepu [hoa + lawe + pū], which has three parts. The same OCR region also has Hoalawehana (hoa + lawe + hana, also three parts). The extractor may produce more mis-crops like this elsewhere.
2. hoauna is mapped to una "turtle shell", which is wrong. Andrews' bracket reads "una, to send", but that sense exists only inside hoʻouna. Andrews also has a second, unrelated Hoauna (ho- + auna "flock"). Dropped.
3. The koa sense is mis-split in Wiktionary. Its koa#0 puts "warrior" together with the koa tree (from *toa). POLLEX, whose Hawaiian data comes from Pukui & Elbert, puts "brave" under PPN *toqa "courageous, warrior" and the tree under *toa. So the soldier/warrior sense belongs with koa#1, and I assigned hoakoa to koa#1. The root glossary should move "warrior" from koa#0 to koa#1, or warrior words will link to tree words.
4. kipa#0 "visit" and kipa#1 "turn aside" are probably one root. Wiktionary's own etymology calls #0 "possibly an extension" of #1, and Andrews treats them as a single verb. Worth deciding before stones are linked.
5. The root kaʻa needs a project-level exclusion decision. Andrews gives kaʻa v. sense 5 "to take effect as a cathartic", which is excretory. Under the strict "any sense" rule in DESIGN §4.3, this removes every kaʻa word, not just holo kaʻa. I flagged holokaʻa (which is also probably a free phrase) and asked the Pukui & Elbert checker to confirm the sense.
6. The root uli has a sorcery sense. Andrews lists Uli as "a class of gods worshiped by sorcerers". hoe uli uses uli#1 "to steer", so it stays, but the root glossary must never show the deity sense.
7. Andrews gives hoakaua opposite senses: "fellow soldier" and "antagonist". Pukui & Elbert has to settle which one the card shows. From reviewer knowledge (unverified), I believe P&E glosses it as enemy.
8. Some Hawaiian Wikipedia hits are not the compound. The only two-word hit for hoaʻōlelo is "hoa ʻŌlelo Hawaiʻi" (hoa + the language name), and the one for holokaʻa is "holo kaʻa uila" (holo + kaʻa uila). Raw counts overstate support for both. Some Hawaiian Wikipedia prose also reads as machine-generated, so I treated it as weak evidence of use.
9. The "homograph root: sense unresolved" flag on hoa resolves to hoa#0 "companion" in every case here. For hoaʻāina this rests on Andrews' general hoa entry, so a Pukui & Elbert Lit. reading would confirm it.

Patterns:
- How hoa- words are written today varies word by word: hoaaloha, hoahānau and hoaʻāina are one word; hoa hana and hoa paio are two. The word break can't be predicted, so Pukui & Elbert decides it for each Andrews-only hoa- word.
- Several hoa- words mean nearly the same thing: hoakaua, hoakoa and hoa paio; hoahānau and hoahanauna. On the board this could make turns feel samey even though HOA lines mean something real.
- Two verb + object words, hoe waʻa and holo lio, are kept on Andrews plus modern use (Hawaiian Wikipedia for hoe waʻa; Ka Wai Ola, the mele and the State Senate for holo lio). Their pe_check asks whether Pukui & Elbert lists them as sub-entries.

Searches: about 22 web searches and fetches. Corroborating sources used were Polynesian Voyaging Society pages (hoe uli, holokai), the Polynesian Cultural Center (holokai), Kamehameha Schools Kaʻiwakīloumoku (hoaaloha), Ka Wai Ola / OHA (hoahānau, holo lio), Hawaii News Now (hoahānau) and Kumu Pono Associates (hoaʻāina). Results kept returning the wehe.hilo.hawaii.edu and hilo.hawaii.edu/wehe dictionary mirrors. I did not open them and did not count their snippets. I counted no machine-translation or commercial sites as evidence, apart from noting the "Hoa Kaua" game title as weak support for writing it as two words. hoakipa (Wiktionary only), hoaʻai, hoaʻōlelo, hoakoa and hoahanauna had no independent web support.

## batch-006

Batch 006 has 20 words. Verdicts: 2 keep (holomoku, hope poʻo), 5 keep-pending, 7 doubtful, 6 drop.

1. The hua family needs one design decision. Andrews–Parker hua n. 5 and POLLEX both give hua the sense "testicle". The brief excludes a word when either root has a genital sense, so I flagged all 7 hua words (exclusion_flag true), with each reason marked ROOT-LEVEL. The project's automated screen let hua through only because Wiktionary's hua entry lists just fruit, egg, seed and result. Applied literally, the rule also removes huaʻōlelo, one of the design's own examples. Decide once for the whole family: exempt hua, or drop it.
   - hoʻokolohua and hualiʻi are otherwise sound. Their keep-pending verdicts reflect the word evidence; only the hua question holds them back.
   - hualele and huahāʻule are dropped for reasons of their own: hualele has a "hernia" sense, and huahāʻule means "bastard; illegitimate child".

2. Stones built on hoʻo-. hoʻokolo, hoʻohala, hoʻolei, hoʻoluʻu and hoʻomana are causative derivatives (hoʻo- + a root), not single roots. The prefix screen in ROOTS.md step 5 only catches a bare prefix in first position, so these got through. Using them as stones runs into the same problem DESIGN §2 raises about hoʻo-. This needs a design call.

3. Some dossier analyses are wrong:
   - huakaʻi: its evidence code A rests on an Andrews–Parker bracket for a different word, huakai "sea foam" (hua foam + kai sea). No source gives an etymology for huakaʻi "journey". Kamehameha Schools reads it as hua + kaʻi, but explicitly as an interpretation. The word is well attested; the split is not.
   - holoholoana and hoʻoleiwale: the second part is grammatical (the -ana particle; wale "only"). The candidate list mapped them to ana "cave" and wale "mucus".
   - Andrews–Parker uses root senses the glossary lacks: holo "bundle" (POLLEX supports it; holoʻai's degree of 18 is overstated once holo is split by sense), hono "nape", lili from malili "withered", and hua "trimming". I marked each of these unresolved.
   - Three Andrews–Parker entries are missing or mis-headed in the OCR. The entry headed "Hualele" with [Hua and lole, cloth] is really hualole; hoʻoluʻuʻili and holoholoana have only the bracket record.

4. Free phrases. hoʻi hou shows up 39 times in Hawaiian Wikipedia, always as two words in ordinary syntax. hoʻi hope and hoʻohala lā may be the same kind of thing.

5. Web corroboration (14 searches):
   - The PVS / Bishop Museum voyaging glossary gives "holomoku: sail on a ship; sailor".
   - Kamehameha Schools uses "hope poʻo kula" for associate head of school.
   - An OHA-facilitated term list for E/V Nautilus has "keʻena hoʻokolohua" (wet lab).
   - UH News and Hawaiʻi Public Radio confirm the meaning of huakaʻi.

6. Blocked sources. Many searches returned results from Wehewehe mirrors (wehe.hilo.hawaii.edu and hilo.hawaii.edu/wehe), and the search tool's summaries drew on them, for holowaʻa, holomoku, hope poʻo, hua hāʻule, hualele and holo ʻai. I did not open those pages and did not count any of that as evidence. Later searches excluded those hosts.

7. A shared-scratchpad clash. Parallel reviewers share the scratchpad, and another agent overwrote my helper script scratchpad/show.py partway through. I moved my scratch work to a subfolder of my own and deleted it at the end. Only review/batch-006.json was written as output; the leftover show.py now belongs to the other agent.

## batch-007

Batch 007 has 20 words: 6 keep (huamoa, huaʻōlelo, huewai, huikala, hulipoepoe, hunakai), 7 keep-pending, 6 doubtful, 1 drop (huiana).

Project-level issues found in this batch:

1. The HUA stone has two problems.
   - (a) A §4.3 question. Andrews–Parker lists 'Testicle' (n. 5) inside the same Hua entry as fruit and egg, and POLLEX has a Hawaiian hua 'testicles' (PEC *fua). I did not set exclusion_flag on any hua compound, because none uses that sense and no reader would read them so. That matches how batch-004 handled heʻe 'menses'. But if §4.3 is applied to root stones, every hua word goes, including the title-plate word huaʻōlelo. Decide this once for the root.
   - (b) Sense identity. POLLEX puts Hawaiian hua 'word, letter, figure, watchword' under a separate etymon, PPN *sua, not *fua 'fruit'. The dossier lists only one hua homograph. So hua mele (Andrews: 'hua, letter') and possibly huaʻōlelo may not be the same root as hua moa and huaʻai, and linking them could contradict the cards' Proto-Polynesian line. I set huamele's sense_a to 'unresolved'. I kept huaʻōlelo on 'hua' because Wiktionary explicitly says 'seed, fruit'. Both pe_checks ask P&E to settle it.

2. ʻOLE as a stone (degree 19). It is the negator, by Andrews and by POLLEX ('Negative'). Every X-ʻole word would link by 'both negated', the same reason ROOTS.md dropped hoʻo-. I flagged huaʻole on these grounds. The whole ʻole family needs one ruling.

3. Pipeline artifacts.
   - 'huiana' is Andrews' Huina, whose headword the OCR repair rewrote to match the bracket; its 'ana' is the nominalising suffix. Its degree (14) comes from linking to the unrelated ANA stones, cave and measure. Other '-ana' rows in other batches likely have the same problem.
   - Huaale's 'Incorrect form of' in the dossier is OCR column debris from the Hua v. entry; I checked this in andrews-parker1922.txt.
   - huaʻale's second root is Andrews' ale 'to swallow', which the pipeline mapped to ʻale 'wave'. That gives the stone the wrong identity and a possibly wrong ʻokina.
   - huhukū: Andrews' own bracket says the second part is a contraction of kuku, not kū.

4. 'hua + plant name' (hua noni, and 'hua waina' in State Department of Health text) behaves like a free genitive phrase. Admitting huanoni would admit a whole productive class, so I marked it doubtful pending a P&E sub-entry.

5. Dossier flags.
   - huaʻōlelo carries 'Wiktionary writes it as two words', yet its Wiktionary entry is one word.
   - huaʻai carries the same flag, while OHA's Ka Wai Ola and the State Department of Health write huaʻai as one word.

Web use: about 23 searches and fetches. Corroboration came from:
- Kamehameha Publishing (huewai)
- Kamehameha Schools (huikala)
- DLNR and Hawaiʻi Public Radio (hunakai)
- Ka Wai Ola / OHA and the State Department of Health PDF (huaʻai)
- UH News (huaʻōlelo)
- Palapala on UH ScholarSpace (hulipoepoe)
- Bishop Museum Ethnobotany Database (hua noni, two words)

Blocked or avoided:
- Search results repeatedly surfaced dictionary mirrors (wehe.hilo.hawaii.edu, hilo.hawaii.edu/wehe, wehe.colo.hawaii.edu, ulukau.org/chd). I opened none of them, ignored their snippets, and added them to blocked_domains.
- ResearchGate returned 403. The 1841 'Ka Hulipoepoe' date rests on a search snippet only and is labelled unverified.
- I did not search hueʻili, because the obvious corpus (the Hawaiian Bible) is on a forbidden host.

## batch-008

Batch 008 result: 1 keep (hōkū hele), 11 keep-pending, 2 doubtful, 6 drop. Full records are in the written file.

How the candidates were mis-built:
- hā- as a prefix (hālana, hāneʻe, hākui). Andrews either glosses hā as 'participle' or leaves it unglossed, and the pipeline then mapped it to hā 'four'. These are prefix-built words that the ROOTS.md step-5 screen missed because hā- is not on its prefix list. Add hā- to that list. hālana is a real, attested word, but a HĀ stone in it would carry a sense no source gives.
- Grammatical words mapped to roots: hāʻawiana (the particle ana mapped to 'cave'; that mapping is where its degree of 12 comes from) and hēʻahā (he + aha 'what' mapped to 'caterpillar' + 'four').
- huʻahuʻanana: Andrews says nana stands for lana 'float', but the candidate mapped it to nana 'plait'.
- The hā#2 'leaf stalk' family (hāipu, hākō, hāniu) is analysed correctly but rests on Andrews alone. For hākō, Andrews' accents hint at a short ha (hakō).

Decisions only the project can make (made once per root, not per word):
- HUNA: Andrews has 'the private parts; genitals; kahi huna' under the huna 'hide' homograph. It reads as a euphemism and is weaker than the hua case. I flagged it on all three huna words, following the batch-006 handling of hua. Searches also turned up the New Age 'Huna' movement.
- LEPO: Andrews has 'Dung; excrements'. hunalepo is marked doubtful to match halelepo in batch-002.
- Star names: Hōkūao and Hōkūloa are both well attested. They are flagged only because DESIGN §4.3 leaves star names open.
- Hōkūloa's literal reading conflicts between sources: 'great star' (Andrews, Makemson 1939) versus 'long [staying] star' (Ke Ola Magazine). That decides which LOA sense the stone carries, possibly the intensive particle.

Family hint: the UH SOEST and Kamehameha Schools lists (both quoting Pukui & Elbert) also give huna kai 'sea spray, sea foam' and huna wailele, written as two words like huna wai. Those may be worth adding as candidates.

Sources and searches:
- About 20 searches and 12 fetches.
- Good sources: the UH SOEST weather-term list (Kaliko High 2022) and the Kamehameha Schools 'Ka Ua' list (1980). Both are printed excerpts of Pukui & Elbert, not the website, so I counted them as reputable while still asking for the Pukui & Elbert check. Also used: Makemson 1939 on the Polynesian Voyaging Society archive (text-extracted from the PDF), Ke Ola Magazine (Leilehua Yuen), Maunakea Observatories, Ecology & Society 2022, and a UH Mānoa Center for Biographical Research talk title for hunalepo.
- Not opened: wehe.hilo.hawaii.edu and wehe.colo.hawaii.edu appeared in results, and the ʻŌlelo Noʻeau concordance on ulukau.org appeared in a snippet ('huna lepo'). I did not count the snippet as evidence.
- Unreachable: mauna-a-wakea.info (proxy error page), the DLNR flood newsletter PDF (returned HTML), and the hawaii.edu calendar page (HTTP 500).
- Nothing found: hunakaua, hānaukahi, hāneʻe, hāniu, hākō, hāipu.
- hōkūlele: the only web support is a tourism site, so its spelling stays inferred.

Dossier gaps: hāliʻikuli and hānaukahi have empty compound 'andrews' arrays (OCR). Only the candidate row's bracket and definition are available for them.

## batch-009

Batch 009 has 20 candidates. Result: 3 keep, 8 keep-pending, 7 doubtful, 2 drop. The full records are in the written file.

Main patterns:
(1) The hū- family: hūhonua, hūkai, hūkaʻa, hūlani, hūpuna, hūʻalu, hūʻole, hūʻē. All are Andrews-only (A*), so the kahakō on hū is pieced together in every one. Wiktionary's hū#0 lumps together rise/leaven/overflow, 'stray off course', 'gum' and 'commoners'. P&E should settle the HŪ stone's identity once, for the whole family.
- hūʻē is a mis-split. Modern Hawaiian writes the verb huʻe (Civil Beat Hawaiian-language article: 'Huʻe pinepine ʻia nā iwi kupuna'). Andrews' second part is the directional 'e, from', so: drop.
- hūkai: Andrews also lists hukakai and hukahukai, and kai alone already means 'brackish'. So the hū + kai split is uncertain, although the word has degree 15.
(2) Wrong root mapping when the first part looks like it carries hō-:
- hōʻoiaʻio is really hōʻoiaʻiʻo: 5 Hawaiian Wikipedia hits, plus the Hawaiian Common Core math translation. Its second element is ʻiʻo 'true', not ʻio 'hawk'. Prefix-built: drop.
- hōʻakakeʻa: the dossier maps the first part to hōʻaka 'provoke laughter'. Andrews' word is Hoaka (lintel; crescent; 2nd night of the moon), which Hawaiian Wikipedia's moon-night list writes 'Hoaka'.
- hōʻolemana / hōʻolepule are verb–object phrases about the 1819 overthrow of the kapu system. Their first stone, hōʻole, is itself hō- + ʻole.
(3) KAHA splits into two stones: kaha#1 'place' (kahakai, kahaone) and kaha#0 'line' (kahapili; and probably kahahānai, though that one is unresolved).
- A Hawaiian translation of the Common Core 9–12 math standards (aokaiapuni.weebly.com) uses both kahahānai (radius) and kahapili (tangent). That makes kahapili a 'yes' and confirms the spelling of kahahānai.
- kahahānai's parts row would mislead: Andrews gives kaha 'a knot' + hānai 'strings of a hanging calabash', not 'foster child'.
(4) hōkū ʻaeʻa (planet) is corroborated by Wiktionary (two-word headword, from the project's Wiktionary cache), Rubellite K. Johnson's 'Astronomy in Hawai'i' (Springer 2008), and Ke Ola Magazine. The word break varies between sources.
(5) Exclusion flags:
- ʻole is grammatical (hūʻole), the same project-level ruling as batches 004 and 007.
- The directional particle in hūʻē is grammatical.
- I flagged keʻa as borderline: it has a homograph 'male animal reserved for breeding, virile male' (POLLEX, PEP *teka 'penis'; Andrews). That is a decision for the KEʻA stone as a whole, like hua in batch-007. Note that batch-007 put its root-level homograph in sensitivity_note rather than flagging it, so the two batches are not consistent on this.
- Sensitivity notes: iwi (iwipona sense 2 describes jumbled human bones), mana/pule (religious), punalua under puna, and modern huʻe used for disturbing iwi kūpuna.
(6) Dossier problem: iwipona's full 'andrews' entry list is empty, so I used only the candidate row.

Searches: about 21 searches and fetches. Many search results came from wehewehe mirrors (wehe.colo.hawaii.edu, wehe.hilo.hawaii.edu, hilo.hawaii.edu/wehe, ulukau.org/chd). I did not open or count any of them; their snippets about kahahānai, kahapili, hūlani and huʻe were ignored. Later searches blocked those domains, but hilo.hawaii.edu/wehe cannot be blocked by path. home.ifa.hawaii.edu returned 503. Nothing citable was found for hūkai, hūpuna, iwikū, kahaone or hūkaʻa. For hūkaʻa, the one hit was an artist's product title, not counted.

## batch-010

Batch 010 reviewed: 4 keep (kahawai, kai au, kai ea, kai eʻe), 7 keep-pending, 5 doubtful, 4 drop. Full records with basis, lit, gloss, pe_check and sources are in the file. 16 web searches and about 10 fetches.

Patterns and problems:
1. ARTIFACT ROW: kahuana is not a word. The pipeline built it from Andrews' headword KAHUNA (andrews.json says parse "nonconcat") and its guessed bracket [Kahu and ana, a cooking]. The row's definition is the kahuna entry. Other rows marked "nonconcat" may hide the same OCR-repair problem, so a sweep is worth doing.
2. BEST SOURCE FOUND: a UH SOEST PDF (Kaliko High 2022, "Hua ʻŌlelo Kālaianiau"), soest.hawaii.edu/met/NewPDFs/HawaiianWeatherTerms.pdf. It lists about 40 "Kai X" sea terms quoted from Pukui & Elbert, with their spellings and some Lit. readings: Kai au, Kai ʻau, Kai ea "Lit. rising sea", Kai eʻe, Kai heʻe, Kai piha, Kai make and others. It is a secondary compilation, not a dictionary mirror, so I used it with that label. Other batches with kai-, wai- or weather words should use it. It shows that P&E writes these kai compounds as two words, and that Andrews' two "kaiau" entries are two different P&E words: kai au (current) and kai ʻau (sea too deep to walk in).
3. KAHU FAMILY: Wiktionary's kahu entry has a derived-terms list (in the local kaikki dump). It gives two-word spellings for kahu akua, kahu moku, kahu wai and kahu ʻāina, with no glosses. That corroborates spelling but not meaning. It also lists kahu ʻanāʻanā (sorcery), and POLLEX glosses this kahu as PEP *tafu "perform ritual, sorcery", so kahu akua needs a kumu read. kahu#0 (keeper) and kahu#1 (to tend an oven fire) split the family: kahuʻai is clearly #1, while kahuahi could be either.
4. KAHA SENSE CONFLICT in kahawai (degree 26): Wiktionary says kaha "place", Andrews says "cut". This decides whether the KAHA stones in kahawai and kahakai link. The P&E Lit. should settle it before linking.
5. DESIGN-LEVEL ITEMS: ʻole as a root (kahuaʻole) has the same problem as hoʻo-, since a link would only mean "both negated". It is also grammatical; Wiktionary's verb/noun/num tags let it past the screen, so the screen should treat ʻole as grammatical. heʻenalu is itself heʻe + nalu (Kamehameha Publishing writes "kai he'e nalu" as three words). Compound-as-stone candidates like this should be dropped wherever they appear. moe may carry a mating sense in P&E (reviewer knowledge, unverified), which would affect every moe word under §4.3.
6. kahuapaʻa: Wiktionary has two conflicting coinages (kahuapaʻa "website" and kahua paʻa "terra firma; homescreen"), and Hawaiian Wikipedia uses it for computer hardware or a platform. It belongs to Māmaka Kaiao, not P&E.
7. The word_break enum can't express three words (kai heʻe nalu), so I used "unknown" there.

Blocked or discarded: the Springer Natural Hazards article needs a login. UH eVols (Emerson, "Lesser Hawaiian Gods") and sacred-texts (Beckwith) both returned 403, so those appear only as unverified snippets. The UH Strauch WebQuest page returned 503. Several search summaries quoted wehe.hilo.hawaii.edu / ulukau.org/chd mirrors (kahi moe, kahu wai, kahapōʻai) or made things up ("kahu ahi" in Wiktionary is false); none of that was counted, and I did not open those hosts. As instructed, I deleted my scratch helpers; only the review file remains.

## batch-011

Batch 011, 20 candidates: 4 keep (kai malolo, kai uli, kai ʻau, kanikau), 10 keep-pending, 4 doubtful, 2 drop (kakahou: a torture-killing sense; kalaau: folk etymology). Full records with sources and P&E checks are in the written file.

Patterns:
1. The kai· tide words hold up well. A 2022 UH Mānoa SOEST list (Kaliko High, compiled from Pukui & Elbert via Puke Wehewehe; I opened the UH PDF itself) confirms kai piʻi, kai malolo, kai ʻau and kai au, all as two words. POLLEX's P&E data adds 'kai piʻi' (< PCE *tai-pii). P&E writes these kai-terms as two words, so every kai· form here has a space. The same list has no kai hua and no kai hulu.
2. Several high degrees are artefacts of the wrong homograph:
   - kakaʻōlelo needs kākā 'to strike, fence', not kaka 'to rinse'. Its modern spelling kākāʻōlelo is attested (Perreira 2017 on ScholarSpace; Hawaiian Wikipedia).
   - kalahale needs a fourth kala, 'gable / end wall' (PPN *tara). POLLEX/P&E has 'kala hale', house gable.
   - kaihua needs a hua 'flowing / swelling' (or huʻa 'foam'), not hua 'fruit'.
   - kauhale may need kau as the plural particle: POLLEX/P&E lists kau 'Particle indicating plural', and an unsourced blog gives 'Lit., plural house'.
   - None of these root senses is in the glossary, so all four degrees (13, 10, 14, 11) are overstated.
3. Wiktionary lumps homographs that POLLEX separates, and the stones need splitting:
   - kapa 'edge, side' vs kapa 'bark-cloth': kapakahi should not link to kapa komo;
   - hou 'pierce' vs hou 'new';
   - malolo 'low, of tide' vs the 'rest' word.

Project-level root rulings: the earlier batches handled these inconsistently. I set exclusion_flag true with a ROOT-LEVEL reason, as batches 000, 003 and 006 did; batch 007 did not flag hua. I kept the verdict for the word on its own evidence.
- KAPA: 'Labia' is in POLLEX (source P&E 1986) and Andrews; affects kapakahi, kapakomo, kapakuʻina.
- PIʻI: Wiktionary's vulgar sense; affects kai piʻi.
- HUA: 'testicle'; affects kaihua.
- KAPUAHI: Andrews n. 5 only; affects kapuahi hao.
kapakahi and kai piʻi would be plain keeps but for these rulings.

Dossier problems:
- The kaihulu full-entry list was empty; only the compound row held the Andrews text.
- kaiʻau shows hawwiki_2w=1 with no sentence captured; it is a proper name (Kai ʻau Lapa).
- The kapa komo Hawaiian Wikipedia hit is a garbled, machine-like sentence.

Searches: I ran 8 web searches and some direct fetches. Then the session-wide WebSearch budget ran out (200/200), so no searches were possible for kanaka makua, kanikau, kapakahi, kaniwāwae or kapa komo. For those I used Andrews cross-references and the local Hawaiian Wikipedia dump instead.

Blocked or avoided:
- Results pointing to wehe.colo.hawaii.edu and wehe.hilo.hawaii.edu (forbidden) were not opened or used.
- Ing 2024 (Wiley) returned HTTP 403. Its P&E 'lit., to fence [with] words' for kākāʻōlelo is second-hand from a search summary and is marked so.
- pacificworlds.com returned 503.

## batch-012

Totals: 3 keep (kau kānāwai, kaulike, kaulahao), 7 keep-pending, 4 doubtful, 6 drop.

SEARCHES BLOCKED: the session's WebSearch budget (200/200) was already used up when this batch started, so I could run no web searches. WebFetch still worked, but the few reputable pages I tried (capitol.hawaii.gov returned 403; archive.hokulea.com canoe pages) did not have the words. Instead I checked the local POLLEX crawl (research/roots/.cache/pollex/hawaiian-reflexes.json and raw entry pages), whose Hawaiian forms are cited to Pukui & Elbert 1986. I also checked the local Wiktionary dump (kaikki) and the Hawaiian Wikipedia dump. web_sources is empty for every word.

WHAT POLLEX SETTLED (P&E forms):
- kaulua: P&E has 'Pair, yoke, two of a kind; put together' and 'Double canoe'.
- kaukahi: P&E has 'Standing alone, solitary … canoe with a single outrigger float'.
- kaupale: P&E has 'To cover an oven, especially with rocks on its edge'. That sense comes from PN *tau 'cover (an earth oven)', which is a kau sense not in the root glossary.
- kaupākū: P&E's word for ridgepole is kaupoku, from PN *taqo-patu. So Andrews' kau + pākū is a folk etymology, and the candidate is dropped.
- The local Wiktionary dump has the headword 'ʻaha kau kānāwai' (legislature). That attests the two-word spelling kau kānāwai.

KAU NEEDS A DESIGN CALL:
- 12 of the 20 candidates start with kau. POLLEX derives kaulua and kaukahi (and kaukolu, 'group of three') from PN *tau-, a prefix that turns a number into a group noun ('a group of N'). It does not derive them from kau 'to place'.
- The batch-011 review left kauhale pending on the same question.
- Kau now shows at least five unrelated senses: season, to place/hang, chant, the plural particle (in kaumokuʻāina, dropped as grammatical), the number-group prefix, and 'cover an oven'.
- Two ways to go: a separate 'kau- (group of)' stone, which would give the small family kaukahi/kaulua/kaukolu a real meaning to link on, or no link at all for those words.

ROOTS KEYED TO THE WRONG HOMOGRAPH: the candidate rows link these words to the wrong root.
- kaukoko uses koko 'carrying net', not 'blood'. Andrews marks its pronunciation ko'-ko', which hints it may be spelled kōkō.
- kaumoʻo uses moʻo 'strip of land / lengthwise pole', not 'lizard'.
- kaulawahine uses kaula 'prophet', not 'rope'. Reviewer knowledge, unverified: P&E spells the prophet word kāula.
- kauamai uses kaua 'invite to stay', not 'war'.
- kaulanaʻōlelo uses kaulana 'a putting', not 'famous'.

DOSSIER PROBLEMS:
- The automated root mapping picks Wiktionary's single homograph even when Andrews' bracket names a different sense. Wiktionary often lacks the needed sense: koko and moʻo each have only one entry there, and kaula 'prophet' is missing.
- The kaʻahai dossier's 'andrews' list is empty, though the candidate row carries the bracket.
- The Hawaiian Wikipedia counts for kauamai ('kahua kaua mai') and kaupale (kaupalena) match unrelated substrings or words.

Card values: kaulua (the double voyaging canoe) and kaukahi are high-value, high-degree words. They wait only on what the kau stone means, not on whether the words exist.

## batch-013

Batch 013 verdicts: 3 keep, 8 keep-pending, 3 doubtful, 6 drop. The full records are in the JSON file. Patterns that matter beyond this batch:

1. Three candidates were created by the pipeline's OCR repair; Andrews never printed them. andrews.json marks each source entry "nonconcat", and the repair deleted letters to force a two-part match:
- kaʻalewa: Andrews' headword is Kaalelewa (raw OCR lines 34913 and 34921).
- kaʻihuakaʻi: Andrews has Kaiahuakai (lines 36624 and 36628).
- keikiwaiū: Andrews has Keikiaiwaiu (line 42809).
Suggestion: re-audit every "nonconcat" row among the 341 repaired rows in compounds.tsv. A repaired headword shorter than its OCR headword should be treated as suspect. UH IHLRT confirms the real word is kaʻalelewa ("nā ao kaʻalelewa", swiftly floating clouds).

2. The exclusion screen misses senses that appear only in POLLEX. keʻa has a Pukui & Elbert sense via POLLEX: "Male animal reserved for breeding, virile male", from PEP *teka "penis". Andrews' kea n. 1 has the same sense. That drops keʻapua (a real Makahiki dart game, "keʻa pua") and keʻahakahaka. Fix: run the SENSITIVE regex over POLLEX haw_gloss too. Please also re-check every keʻa compound in other batches.

3. The dossier homograph lists leave out particle entries, because lexical() keeps only content words. In kaʻawale, the wale actually used is the particle "only, alone, freely": Wiktionary's particle entry, and P&E via POLLEX, "postposed particle". The grammatical-root screen let it through only because wale also has a noun entry (mucus, phlegm). I marked it keep-pending until there is a policy call on particle-sense stones.

4. The kaʻa family (9 words here, many more elsewhere) needs one decision. Andrews kaa v. 5 is "to take effect as a cathartic"; Wiktionary renders it neutrally as "to take effect". I treated it as a sensitivity note, not an exclusion. If the project counts it as excretory, the whole family goes.

5. Two-word Wiktionary headwords are not linked. "keiki kāne" is a Wiktionary headword, yet the row is coded A*, so its evidence is understated. Kamehameha Schools also writes it as two words.

6. Pattern of loans: keiki plus an introduced animal is an English borrowing. keikikao (kao "goat") and keikipipi (pipi "beef") are dropped; Andrews also has keikihipa, marked "Mod.", from "sheep".

7. Smaller points:
- kia ahi and kia ao are probably Bible-translation phrases. Andrews prints both as two words inside the kia entry.
- keahakahaka: P&E's spelling keʻahakahaka, and its etymon PPN *fatafata "chest", show the kea "white" split is wrong.
- kaʻaluna: Andrews' bracket uses luna "overseer", but the sailing sense implies luna "above". Sense left unresolved.

Searches: about 14 web searches and fetches.
- Results from the forbidden wehe hosts (hilo.hawaii.edu/wehe and wehe.hilo.hawaii.edu) showed up in result lists and search summaries. I did not use or count them, and blocked wehe.hilo.hawaii.edu after the first one. The search summary's claim about kaʻaluna has an unknown source and was not used either.
- I opened one KSBE teacher PDF ("Ka Makani mai ka puke wehewehe ʻōlelo") before realising it transcribes Pukui & Elbert 1971 entries. It held none of the batch words, I used nothing from it, and I deleted the local copy.
- Useful sources: UH Mānoa NHSS (kaʻahele), UH IHLRT (kaʻalelewa), KS Kaʻiwakīloumoku (keiki kāne), Wikipedia (keʻa pua; secondary).
- Nothing found for kaʻa kaua, keiki papa, kia ahi/kia ao, or keiki ʻai waiū. A Ka Wai Ola PDF had kiakahi only as a personal name.

## batch-014

Batch 014 has 20 candidates: 6 keep, 8 keep-pending, 5 doubtful, 1 drop. No compound in this batch has a POLLEX row (pe_via_pollex is empty for all 20), so there is no indirect Pukui & Elbert check here.

Patterns:
(1) The local kaikki Wiktionary dump (.cache/kaikki-haw.jsonl) has derived-term lists that the dossiers leave out. The kiko entry lists kiko kahi (period), kiko moe (hyphen), kiko nīnau (question mark), kiko hoʻomaha, kiko pūʻiwa; the kino entry lists 'kino make' (corpse). These were decisive for word break: modern spelling splits the kiko punctuation words that Andrews joined. Future dossiers should include the roots' derived/related terms.
(2) UH COE Kaiapuni standards write 'Kiko Pau / Kiko Nīnau / Kiko Pūʻiwa', so 'kiko kahi' for the period may be the older term.
(3) kiaʻāina is in official State of Hawaiʻi use ('GOVERNOR / KE KIAʻĀINA' letterhead). kikowaena is in wide one-word use in Kaiapuni math materials and Hawaiian Wikipedia.
(4) kinoea, kinowai and kinopaʻa are confirmed as one word on Ke Kula Kaiapuni ʻo Ānuenue's chemistry pages. That is a teacher's class site, not a dictionary. All three are marked modern coinage.
(5) kialua is independently attested as 'moku kialua' in Ka Hae Hawaii 1856, via UH Mānoa IHLRT. kiakolu rests on Andrews alone.
(6) kia-, kiaʻi- and kilo- words: none of the roots carries a risky ʻokina or kahakō, so only the word break is open. The Andrews-only ones are keep-pending.
(7) Sensitivity calls: kinomake (corpse), kinoakalau (death-omen spirit) and kilomakani (Andrews' only sense is divination) are marked doubtful on tone and source-fidelity grounds, not as strict §4.3 exclusions.
(8) Exclusion flags: kikialo is flagged under the either-root rule (Andrews' verb kiki sense 3 is sexual) and dropped. kinipōpō is flagged provisionally: no source supports Wiktionary's 'kini = game', and the closest kini sense is a probable English loan. It is degree 0 anyway.
(9) The moe design call from earlier batches carries over to kiko moe.

Blocked or limited: about 14 web searches. Several returned only wehe.*.hawaii.edu / hilo.hawaii.edu/wehe / ulukau.org dictionary mirrors; those results and their snippets were ignored. Aggregators (glosbe, translate.com) appear to repackage P&E and were not counted. A Papakilo newspaper page for kiakolu returned 403 to automated fetch; that was respected, so the lead is listed as unverified. A non-reputable travel-site page for 'Kiaʻi Poʻo' is listed but not counted.

A pre-existing scratchpad folder lang/b14 (Kaiapuni standards text from an earlier session) was used only as a lead. Every cited source was re-fetched from its real URL. My temporary downloads and helper script were deleted; only the output JSON was written.

## batch-015

Batch-015 result: 2 keep, 8 keep-pending, 5 doubtful, 5 drop. The keeps are kiʻi pōhaku and kiʻiʻoniʻoni.

Root-mapping errors in the A* pieced spellings (these affect other batches too):
(1) kio → kiʻo. For "pool", the University of Hawaiʻi's Kawaihāpai pages write kiʻowai twice (one word, with ʻokina). So the kio·* rows (kiowai, kioahi, kiolepo) are built on the wrong root, kio "chirp". Their degrees (23, 11, 6) were computed on that wrong root and need recomputing. kiʻo "pool" is missing from the root glossary.
(2) koi → koʻi. In koikahi and koilipi the first element is koʻi "adze, axe" (POLLEX, citing Pukui & Elbert: Koʔi < PPN *toki), not koi "to urge". The forms should be koʻi-. koʻi is missing from the glossary. POLLEX's koʻipele shows Pukui & Elbert writes at least one adze name as one word.
(3) koawa is Pukui & Elbert's kōwā (POLLEX: Koowaa < PCE *koo-waa "space between"). It is not koa + wā, so dropped.

Exclusion patterns:
- Andrews–Parker's single Kio entry gives "excrement; to evacuate the bowels" alongside "pool". Whether that sense belongs to kiʻo (pool) is the deciding Pukui & Elbert question for kiʻowai, a high-value word. For that reason kiʻowai is held at doubtful with the exclusion flag set provisionally.
- Andrews–Parker gives lepo "dung; excrements" as sense 2. Every lepo compound in other batches needs a §4.3 look.
- Two candidates have a particle as the second element, so they are grammatical: kiʻekiʻeana (aspect particle ana, "being") and komowale (post-posed particle wale). The only wale in the dossier's homographs is "mucus, phlegm", which also inflates the degree.
- Andrews often joins verb + free adverb/object phrases into headwords: kohohonua (honua "gratuitously" is used freely after many verbs), kohomua, komolole (the noun is lole komo), kiʻikū (Andrews' own kiʻi entry writes "kii ku"). All marked doubtful.
- Sensitivity notes (none excluded): sacred images (kiʻi kālai, kiʻi pōhaku), the possible reading "image of Kū" for KIʻI KŪ, spirits of the dead (kino wailua), house-dedication rites (komohale), land inheritance (komoʻāina). Avoid Andrews' "idol / graven image" framing on cards.

Web corroboration (19 searches, plus fetches):
- kiʻi pōhaku: NPS Puʻuloa page.
- kiʻiʻoniʻoni: one word at UH West Oʻahu and OHA's Ka Wai Ola. Hawaiian Wikipedia leans two-word.
- komohale: Fr. Maigret's 1843 journal, via the Hawaiʻi Catholic Herald.
- kipikua: a 2003 mele published by Kamehameha Schools, translated "pickaxe".
- kino wailua: the title of an 1886 Ko Hawaii Pae Aina article, via UH's IHLRT index.
- kiʻowai: the UH Kawaihāpai pages above.

Blocked or unusable:
- Many search-result summaries were built from wehe.hilo.hawaii.edu (forbidden). I did not open them or count them as evidence. Where they raised a question (kiʻo senses, koʻi kahi spacing, palapala kiʻi word order), it appears only in pe_check or reviewer_knowledge, labelled.
- The search results included ulukau.org/chd, a dictionary mirror. I blocked it.
- sacred-texts.com (Beckwith) returned 403.
- The Bishop Museum Pohaku page redirected (307). Its blog page did not mention koʻi.
- The KS page declined to quote the lyrics (copyright); it confirmed only the spelling and the translation.

Dossier gaps: the "andrews" compound field is empty for kiʻekiʻeana, kiʻikālai, koawā and komoʻāina; the row's andrews_1922 was used instead. kiʻipalapala shows hawwiki_2w=1 but the dossier carries no sentence.

## batch-016

Batch 016 result: 3 keep (kuamoʻo, kuapuʻu, kuaʻāina), 8 keep-pending, 5 doubtful, 4 drop. No compound in this batch has a POLLEX row (pe_via_pollex is empty for all 20), so none of them has an indirect Pukui & Elbert check.

The biggest pattern is the root kua:
- Its Wiktionary homographs are kua#0 (back) and kua#1, which oddly bundles 'windward' with 'to chop, hew'.
- Andrews–Parker has a third kua: 'the hewn block on which tapa is beaten; the anvil of a blacksmith; an ox yoke'. None of the dossier's ids covers it.
- kuahao (anvil) almost certainly uses this anvil kua, not 'back' as Wiktionary's etymology says, so its sense_a is unresolved.
- Andrews also files 'top of a ridge, high land' under kua 'back'. I used kua#0 for kualono, kuamauna and kuaʻāina on that basis.
- The person checking P&E should confirm whether anvil-kua is a separate entry. If it is, roots.tsv needs a new kua sense.

Other problems with the dossiers:
- The bracket sense of the second root is missing from the homographs in three words: puhi 'to burst' (kuapuhi), wehi 'dark colour' (kuawehi), and ana as the -ana suffix (kuiana). kuiana is a verb made into a noun with the suffix -ana, not root + root.
- koʻakā shares its unmarked spelling koaka with Andrews' 'lustful, licentious' and 'profligate' senses and with the loan for 'quarter'.
- Andrews' puhi includes 'an uncut foreskin', so kuapuhi is flagged.
- kualāʻau carries the same lāʻau 'male erection' (POLLEX/P&E) flag as batches 003 and 035. The team still needs to rule once on the whole lāʻau family.
- Andrews' kea 'male animal reserved for breeding' is keʻa in P&E per batch-013, so I did not flag koʻakea for it.
- Andrews notes that kuaʻāina's people sense was 'he inoa hooino' (an insulting name). The UH Press McGregor book documents how the word was reclaimed. I flagged that as a sensitivity note, not an exclusion.

Evidence quality:
- Hawaiian Wikipedia contains machine-generated garbage. All five 'kua lāʻau' two-word hits and the 'Kuhi hewa' caption are nonsense text, and I gave them no weight.
- Species epithets (Cyanea kuhihewa, Agrotis kuamauna) must be one word under naming rules, so they show the sense but say nothing about the word break.
- Several Andrews entries pair a bracket with a sense it does not explain. kuapapa's bracket 'hew + board' explains the plank sense, but the living sense is 'peace' (Kamehameha Schools 'Kuapapa Nui'). kuamauna: Andrews says 'hillock on a mountain side', modern sources say 'mountaintop zone'. P&E has to choose the card's sense for both.

Searches: about 21. A blocking problem for later batches: the WebSearch summaries repeatedly drew on a wehewehe mirror at hilo.hawaii.edu/wehe/ (for kualana, kuapaʻa, kualono and others). That mirror is not caught by blocking wehe.hilo.hawaii.edu, because it sits under a path on the main UH Hilo domain. Blocking all of hilo.hawaii.edu would also lose the UH Hilo stories and Word of the Week pages. I never opened the mirror, I gave those summaries no weight, and none of their content is used as evidence. Similarly, a kuahawaii.org snippet saying the Hawaiian Dictionary gives 'back land' for kuaʻāina was not counted; the page itself fetched empty.

Other blocks: the UH Hilo moth story page has an expired TLS certificate (curl failed, WebFetch returned 503), so I used the UH News and Wikipedia pages for kuamauna instead. A Kealopiko page about kuapuʻu returned 404.

## batch-017

WEB SEARCH BLOCKED: the session's WebSearch budget was already used up (200/200), so this batch made 0 searches and every web_sources array is empty. I did not try to get around the limit (for example by fetching a search engine through WebFetch). Corroboration came only from the dossiers, the local POLLEX cache (.cache/pollex/hawaiian-reflexes.json, P&E-sourced) and the full Andrews OCR text (.cache/andrews-parker1922.txt). No candidate in this batch has a pe_via_pollex value.

Tally: 3 keep (kumukānāwai, kumukūʻai, kumupaʻa), 6 keep-pending, 6 doubtful, 5 drop.

Pipeline problems found:
(1) kuliana is an artefact. The bracket [Kuli and ana, being deaf] belongs to Andrews' Kulina v. 'to hear partly'. OCR repair turned kulina into kuliana, and the row's andrews_definition is Kulina's text, while the dossier's andrews field holds the real Kuliana (bribe for silence), which has no bracket. Either way, 'ana' is the nominaliser -ana: Andrews analyses Kuina the same way, [Kui and ana, a uniting]. Other candidates built on 'X + ana, being/a ...' brackets probably have the same flaw.
(2) Wrong homographs mapped. kumuea uses ʻea 'hawksbill turtle, tortoiseshell' (POLLEX/P&E: ʻea < PPN *kea), not ea 'sovereignty, breath'. kukuiʻōlelo uses Andrews' verb kukui 'to piece out, join, publish', not kukui 'candlenut', the only kukui in the dossier. Neither root is in roots.tsv, so as built these stones would make false links.
(3) A kui/kuʻi spelling doubt affects the kui- family (kuilua, kuiʻēʻē). POLLEX/P&E keep kui 'thread' apart from kuʻi 'pound', and Andrews' 'to add, join' sense may belong to kuʻi.
(4) Andrews' own kumu entry lists the senses the brackets use (sense 6 'fountain head', 7 'price, article of exchange', 8 'herd', as in 'kumu puaa', 9 'handle'). The Wiktionary root glossary has only teacher/basis/source, so cards using price/herd/handle would show a parts row that doesn't match. kumupuaʻa appears in Andrews' kumu entry as an example phrase, which suggests a free phrase.
(5) POLICY QUESTION: POLLEX's Hawaiian row for lāʻau (RAQA-KAU.B, cited to Pukui & Elbert 1986) includes 'male erection' among its senses. I confirmed this in the cached POLLEX entry page; the Rennellese row is separate, so it is not a scraping mix-up. The automated screen missed it because it only read Wiktionary senses. Under §4.3 as the task applies it, this flags every lāʻau compound. I marked kumulāʻau exclusion_flag=true and verdict=doubtful, not drop, so a person can decide whether a figurative sub-sense of a basic root should trigger the rule.
Two labelled 'reviewer knowledge, unverified' notes: whoever checks the wai root should glance at P&E's wai entry for bodily-fluid senses. Also, kupuna wahine is almost certainly right and only waits on P&E for the two-word spelling.

Exclusions applied: kulanui (kula 'school' is an English loan), kumupipi (pipi 'beef' is a loan, and Andrews says 'Pua pipi is better'), kumuhou (only sense is the Holy Spirit, a divine name), kumulipo (name of the sacred cosmogonic chant), kuliana (grammatical suffix).

Priority for the P&E checker, by degree: kumuwai (33), kumupaʻa (29), kumulāʻau (19, plus the lāʻau policy question), kuilua (15), kumukānāwai (14), kumulau (13), kumualakaʻi (12), kumukūʻai (12).

## batch-018

Batch 018 results: 3 keep (kuʻihao, kuʻikahi, kālaiʻāina), 5 keep-pending, 8 doubtful, 4 drop.

No web evidence was used. Every WebSearch call came back refused: the session limit is 200 searches and it was already used up. I did not get round the limit by fetching search-engine pages. I corroborated against local sources instead: the full Hawaiian Wikipedia dump (variant spellings), the raw Andrews–Parker OCR (cross-references) and the POLLEX cache. web_sources is empty for every word, so the spelling calls that rest on memory (for example kālaʻau) are still open.

Two candidates were built on the wrong source entry:
- kuʻuluhi: Andrews' headword is actually Kuukaluhi [kuu + ka (the article) + luhi], from the saying 'Ua kuu ka luhi'. The article ka was dropped, so 'kuuluhi' exists nowhere. It is not a two-root word. Dropped.
- kāwai: the candidate's bracket and definition ('what belongs to the waters… laws') belong to Andrews' Kanawai (kānāwai, 'law'; OCR 'Kanawal'). It was parsed as ka + wai and mapped to 'kawai'. The real kāwai, which POLLEX/P&E match, is 'last liquor run off in distillation; weak watery liquor', from PCE *taa-wai 'add water'. Its kā is not any kā in the glossary. Dropped.
- Upstream, this probably means the 'nonconcat' parse in extract_andrews.py (it drops middle parts) is producing more false candidates in other batches.

Other source problems:
- Andrews mixes up homographs that modern spelling separates:
  - kuʻikē: two of the three 'kuike' entries are kūʻike, 'know by sight / pay on sight'.
  - kuʻihao: the 'iron spike, nail' entry rests on kui 'pin', not kuʻi 'pound'.
  - kāala: the sling stone is modern ʻalā, so the pieced form 'kāala' is almost certainly wrong, and the word also clashes with the mountain name Kaʻala.
  - kāhau: two incompatible analyses (hau 'hibiscus wood' or hau 'dew'), plus an unanalysed 'to abate'.
- kānā is the possessive pronoun kāna (POLLEX/P&E). Grammatical, so dropped.
- kuʻuʻē: the second part is Andrews' adverb e 'beforehand, away', a particle. Flagged as grammatical.

Policy flags, kept consistent with earlier batches:
- kālāʻau carries the LĀʻAU root flag: POLLEX's P&E gloss for lāʻau includes 'male erection'. Batches 003, 016, 017, 027, 035, 038 and 039 flag it the same way, and one project-level ruling would settle the whole family. If the flag is cleared, kālāʻau becomes keep-pending.
- kālāʻau also has a spelling question: kālāʻau or kālaʻau. If P&E writes kālaʻau, its second stone is not the LĀʻAU root's spelling.
- loa: Andrews' 'receptacle of filth' is recorded as a sensitivity note on kāmaʻaloa, not as an exclusion, as in batch-000.

Pattern: several high-degree words in this batch are verb + object or verb + adverb pairs:
- kuʻi ʻai, kālai pōhaku, kāne make, kuʻi hewa, kāwauke.
- Modern use writes most of them as two words.
- The P&E question for these is whether the pair is listed as a headword or sub-entry, not only how to spell it.
- kuʻiʻai (degree 16) is the most valuable lookup in the batch.

Stone identity:
- kuʻikahi uses kuʻi#1 'join'; kuʻihao and kuʻiʻai use kuʻi#0 'pound'. They must not link.
- kuʻihao: Wiktionary writes one word, but Hawaiian Wikipedia uses kuʻi hao twice (Hephaestus; the X-Men character Forge) and kuʻihao never.

## batch-019

Batch 019 result: 1 keep (kōpaʻa), 3 keep-pending (kēʻai, kōkea, kōʻula), 3 doubtful (kōkala, kōlua, kōʻeli) and 13 drop.

The kē-, kī- and kō- splits from Andrews' brackets mostly fail, in three ways:

1. **The first part is a grammatical word, not a root.** Andrews says "Ke, the" for kēhū, kēmau and kēʻō, and "Ko, of" for kōiʻa (ko + the pronoun ia) and kōloko. The pipeline then matched these to content roots: kē "protest", kō "sugar cane", iʻa "fish". The second part is sometimes wrong too: hū is really a contraction of ehu "spray", and mau a clipping of amaumau.

2. **Andrews gives no meaning for "Ko" or "Ki".** This affects kōhanahana, kōkolo, kōleʻaleʻa, kōwelo, kīkipa and kīʻōnaha. POLLEX shows a kī- formative from PCE *tii- in other verbs (kīkaha, kīpapa, kīʻalo). kōkala is PCE *too-tara, where *too- has no gloss. kōkolo and kīkipa look like reduplications of kolo and kipa. Per ROOTS step 5 these are prefix-built: a KŌ or KĪ stone would link them to sugar-cane or ti-plant words by spelling alone. kōkala is a real word with an attested spelling (Wiktionary, and P&E via POLLEX), but it is not two roots, so I marked it doubtful rather than keep.

3. **The pieced-together kahakō is wrong.** P&E (via POLLEX) spells keʻo, not kēʻō. The fishpond name is written Koʻieʻie, "rapid current", with a short o. kokolo is probably short as a reduplication.

Two exclusion finds:
- **keʻo** (the P&E spelling of kēʻō) has the sense "clitoris" in POLLEX, citing P&E 1986. This is another reason to drop it.
- **Root lua#1** ("pit") also means "toilet" in Wiktionary. Applying §4.3 strictly to roots would drop every lua#1 word, including the design's own example luapō. This needs a project-level ruling. I put it in kōlua's sensitivity note and did not set the flag.

Smaller flags:
- Andrews' "a giving up to natural gratifications" sense of kōleʻaleʻa reads as a probable euphemism; flagged.
- ʻōnaha "bowlegged" was used as abuse (Andrews); flagged under kīʻōnaha.
- Andrews lists a kea homograph meaning a stud animal; noted under kōkea, not flagged.

Searches: none. WebSearch was refused because the session-wide limit of 200 searches was already used up before this batch started. Instead I fetched specific pages with WebFetch and curl:
- **Bishop Museum Ethnobotany DB, kō page:** it quotes proverbs, probably from ʻŌlelo Noʻeau (unverified). "paʻa kokea ia Kohala" (white sugar stalk, written as one word) supports kōkea. "Ke kō ʻeli lima o Halaliʻi" (written as two words) suggests Andrews' kōʻeli was lifted from a phrase.
- **Ka Wai Ola (OHA):** two articles use one-word kōpaʻa.
- **English Wikipedia, Kalepolepo Fishpond:** gives the spelling Koʻieʻie, "rapid current". It is not on the reputable list, so it counts as usage evidence only.
- **NOAA sanctuary:** the URL I guessed returned 404.

Hawaiian Wikipedia has no use of any word in this batch beyond the counts already in the dossiers. Allowing for other ʻokina characters adds only one garbled "hoʻokēʻai".

The P&E lookups that matter most, by connectivity: kōpaʻa (degree 29, confirm only), kōlua (25), kōʻula (17), kōkea (16), kēʻai (15, is it bare kē ʻai or only hoʻokē ʻai?) and kōkala (14, does P&E analyse it?).

## batch-020

Of the 20 words: 1 keep (kūkala), 6 keep-pending, 6 doubtful, 7 drop.

1. EXTRACTION BUG, 5 of 20 words. kūea, kūheu, kūhihi, kūihu and kūkahiki are not headwords in Andrews–Parker. In each case the bracket belongs to a headword with an extra syllable that the bracket leaves out. The OCR-repair step rewrote that headword to fit the two bracketed parts. The real headwords are Kukaea (dust cloud), Kukaheu ('the fur stands up'), Kunahihi (Wiktionary: kūnāhihi), Kukaihu (Andrews splits it ku + ka + ihu) and Kuakahiki ('I kuakahiki ka pule'). OCR line numbers are in each record. A quick test that catches them: the dossier's compound-level "andrews" array is empty or lacks the bracketed entry (kōhiʻai also fails this test, but only because of OCR l/i confusion: 'Kohlal'). Recommend re-checking all 341 'repaired' rows in compounds.tsv against the OCR line before anyone spends Pukui & Elbert time on them. Watch for brackets that mention 'ka, the' or 'a, to'.

2. ANDREWS FOLK ETYMOLOGIES CONTRADICTED BY OTHER SOURCES. kūlana: POLLEX gives PPN *tuqu-raŋa (Māori tūranga, Samoan tulaga), cited to Pukui & Elbert, and Wiktionary gives kū + -lana (deverbal suffix). So the second part is a suffix, not lana 'float'. Dropped despite degree 45. kūkuli: the Wiktionary headword is kukuli (short u), a reduplication of kuli. Marked doubtful, leaning drop.

3. KŪ- AS A QUASI-FORMATIVE. Every kū- word here has degree 39–46, so a KŪ stone would tie much of the board together. In kūhea and kūhepa Andrews leaves Ku unglossed. In kūkapu he glosses it 'to be', in kūhewa 'to be hit', in kuakahiki 'reaching'. POLLEX also lists a separate Hawaiian kū 'abruptly, rudely' < PPN *tuqu 'to cut', which fits kūhewa. Recommend admitting kū- words only where kū plainly means 'stand/rise' (kūkala, kūemi, kūkia, kūkaha, possibly kūlehu). Otherwise this repeats the hoʻo- problem on a smaller scale. Also, the KŪ stone spells the name of the god Kū (Andrews kū n. 4). That is not grounds for exclusion, but worth a line for the kumu.

4. SECOND ELEMENTS THAT ARE THEMSELVES COMPOUNDS. kapakahi (kapa + kahi) and kaʻawale (kaʻa + wale) are not single roots. Both candidates read as phrases ('kū kapakahi'; hawwiki writes 'kū kaʻawale' 4 times and never as one word). Both are marked doubtful.

5. EXCLUSIONS. kūhepa is excluded because its root hepa means 'idiot, imbecile' / palsy, dementia (a disability insult). kūkapu is excluded because its main senses are about chastity, which I read as sexual under §4.3. That is a judgement call for the kumu read.

6. AUTO-MAPPED ROOT SENSES THAT WERE WRONG. kūkaha was mapped to kaha 'to cut'. It should be kaha#2 'pass by/swerve' or kaha#1 'side/place'; left unresolved. kūhao's 'hao, firm' matches no Wiktionary hao. From memory (unverified), Pukui & Elbert may write it kūhaʻo.

7. WEB SEARCH WAS BLOCKED. The session's 200-search budget was already used up when this batch started, so there was no web corroboration and every record has empty web_sources. Evidence comes only from the dossiers plus the local caches: Andrews OCR, kaikki Wiktionary dump, POLLEX hawaiian-reflexes.json and a hawwiki.xml grep. No forbidden site was accessed. A helper script was used in the review directory and then deleted, so batch-020.json is the only file left behind.

## batch-021

Result: 3 keep (kūpaʻa, kūpono, kūʻē), 11 keep-pending, 5 doubtful, 1 drop (kūpua). Every word in this batch starts with KŪ, so the main open question is which kū each word uses.

1. Which kū. The dossier has only one native kū (kū#0: stand, rise, stop, anchor, establish). Andrews glosses kū differently from word to word: 'pertaining to' (kūloko), 'to be hit' (kūmaka), 'to fit' (kūpoepoe), 'shortened from kuamoʻo' (kūʻauhau). In some words 'stand' plays no part in the meaning at all (kūlele, kūlolo, kūʻehu). English Wikipedia's Kulolo article says P&E lists a qualitative or stative kū- prefix. That claim cites Ulukau, so I did not count it as evidence, but I put the question into the pe_check of the affected words. If P&E confirms a kū- prefix, those words are prefix-built and go out like pā-/kā-. I set sense_a to 'unresolved' wherever the sources do not show 'stand', so that no false KŪ links get made.

2. Two homograph collisions that POLLEX/P&E exposes. kūpua: P&E's word at these letters is kupua 'supernatural being' (PPN *tupuqa), one morpheme, which Andrews glosses 'sorcerer'. Dropped, with the exclusion flag set. kūākea: P&E's kuakea 'foam' (PTA *tua-tea) is kua + kea. Marked doubtful.

3. Worksheet errors.
- kūʻau: compounds.tsv root_b is ʻau 'swim', taken from a garbled three-part Andrews bracket. The P&E-attested word (POLLEX kūʻau 'stem, stick, mallet', PPN *tuu-kau) uses ʻau#0 'handle'. sense_b corrected.
- kūʻauhau: ʻauhau here carries its ancestor's sense, *kaufau 'ordered recitation'. Its modern sense is 'tax', so a card glossing the ʻAUHAU stone 'tax' would mislead.
- kūlālā: the dossier's andrews list is empty. The only text is the worksheet row.
- kūʻai: POLLEX 'differs: kuai / kuaʻi' points at unrelated words. The kū + ʻai analysis rests on one uncited Wiktionary line, and Andrews gives no bracket.

4. Searches. WebSearch was refused on the first call: the session's search budget was already used up (200/200). So no searches were made for this batch. I used WebFetch on known reputable pages instead:
- Ka Wai Ola site search: confirms kūpaʻa and kūʻē as one word in modern Hawaiian text, the 1874 'Ke Kipi Kuloko' rendered as 'domestic', and moʻokūʻauhau.
- UH Mānoa Library's Kue petitions page.
- Wehi ʻŌlelo (wehiolelo.org): no entries for any of these words.
- A huapala chant page for kūnihi: 404, so the chant 'Kūnihi ka mauna' stays reviewer knowledge, unverified.

I opened no forbidden sites.

## batch-022

I reviewed all 20 candidates in batch-022. Verdicts: 2 keep (lau hala, lauhoe), 8 keep-pending, 5 doubtful, 5 drop.

WEB SEARCH WAS BLOCKED: the session's search limit (200 of 200) was already used up when this batch started, so I ran no web searches and cited no web sources (web_sources is empty for every word). Instead I checked the local Hawaiian Wikipedia dump (.cache/hawwiki.xml) and the local Wiktionary dump (.cache/kaikki-haw.jsonl). Those checks are cited in the records' basis fields; they are not web sources. Words that would have gained most from outside corroboration: kūʻēʻē (degree 39), laukoa (20), laelua (14), kūkulu hema.

PATTERNS IN THIS BATCH:
1. Wrong homograph from the root mapping, the most common fault.
   - kūʻēmaka is really kuʻemaka 'eyebrow' (POLLEX/P&E, from PNP *tuke-mata). Its first root is kuʻe 'brow', not kūʻē 'oppose'.
   - laekoi: the koi meant is 'sharp, projecting', not 'to urge'. Andrews marks its stress like koʻi 'adze', so it may need an ʻokina.
   - kūkulupāpaʻi: the second part is Andrews' papai 'temporary shelter', not pāpaʻi 'crab'.
   - kūkāmoʻo: the moʻo meant is 'succession, history', not 'lizard'.
   - lapuwale: the second root is the particle wale 'only'. The dossier lists only wale 'mucus', even though the Wiktionary dump has a separate particle entry for wale. Dossiers miss particle homographs.
2. An extraction artefact: lauhiʻu is attested nowhere. The 1922 headword is Laukahiu (lau + ka + hiʻu), and the parse dropped the article 'ka'. Other 'nonconcat' parses may hide the same problem.
3. Andrews' bracket misanalyses a reduplication: kuekuene looks like kuene reduplicated (same meaning), so kūʻē 'oppose' contributes nothing. kūʻēʻē has the same doubt (kū + ʻēʻē, or kūʻē reduplicated), but I kept it pending.
4. Hawaiian Wikipedia counts are inflated by machine-garbled bot pages. All 13 'lauala' matches are substrings of nonsense words, and both 'kūkulu hema' hits sit in garbled text. hawwiki_1w/2w should not be read as modern use without looking at the sentences.
5. lauhala: P&E (via POLLEX) writes 'lau hala' as two words, while Wiktionary and modern text write 'lauhala'. Following the project rule I set the form to 'lau hala' with word_break 'either'.
6. kūlanahale is real in 1922, but Andrews himself says 'more generally written kulanakauhale'. Hawaiian Wikipedia has kūlanakauhale about 948 times against 1 for kūlanahale. I marked it doubtful so a card doesn't look misspelled.
7. lapuwale is flagged for exclusion only because of the particle-root rule and the borderline 'mucus' homograph. It is a fine, well-attested word ('merely a ghost'). Whether a particle can be a stone is a design call; if allowed, it needs its own WALE 'only' stone.
8. lauhoe's verb sense ('to paddle together') uses lau 'many', per Wiktionary. Its card must show the noun sense 'paddle blade' (lau 'leaf').

## batch-023

Batch 023 is the lau- and lawe- families: 18 of 20 are A* (Andrews–Parker only) and no hawwiki use. Results: 2 keep (laulima, lawehala), 11 keep-pending, 6 doubtful, 1 drop (lauleʻa).

Web search could not be done. The session's WebSearch budget was already spent (200 of 200) when this batch started, so no searches ran. WebFetch still works, and I used it only on non-forbidden hosts:
- laulima.hawaii.edu: UH's 'Laulima' system name confirms the spelling but gives no definition.
- Three Wehi ʻŌlelo lookups (laulima, lauleʻa, lawehana): no entries. The dictionary is still small.
- An NPS Kalaupapa page: no gloss for the name.
No forbidden site was opened.

The local POLLEX cache (research/roots/.cache/pollex/hawaiian-reflexes.json, P&E-sourced) worked better than the web and is worth querying directly in other batches:
- laupapa: P&E 'Lau/papa' 'broad, flat (of coral, lava, reef)', a reflex of PPN *lau-papa. Its lau is filed under PPN *lau 'surface area, expanse, breadth' (with laulā), not 'leaf'. So Andrews' 'lau, leaf' bracket is probably a guess, and the glossary may need a third lau ('breadth') or laupapa needs no parts row.
- P&E writes 'lau hala' as two words. That makes lauhalalana a three-word, three-part item. It also suggests the lau + plant-name items (lau kī, lau kō, lau ʻulu, and maybe lau make) are two-word forms in P&E. The one hawwiki sentence for laukī also writes 'lau kī'.
- P&E has lawa 'bind', which the dossier's lawa homographs lack. lawakua needs it.

Patterns and problems:
1. Several Andrews brackets give lau no gloss ('Lau and konakona', 'Lau and lea'). These are half-analyses, so lau is unresolved there.
2. Andrews' 'lawe, to tie' in lawelua matches no attested sense of lawe. The cross-reference 'hawelelua' points to a different 'tie' word, so it is marked doubtful.
3. The automated exclusion screen missed lauleʻa. Root leʻa#0 has 'orgasm' (Wiktionary) and 'sexual gratification' (Andrews), so it is dropped under the rule; a kumu may want to revisit whether the rule should reach a root's other senses.
4. Andrews' entry for wili includes the phrase 'Mai wili, gonorrhea'. I did not flag it, because the sense belongs to the phrase maʻi wili, but it is noted for the reviewer.
5. Sensitivity notes on laumake (death, poison), laweola (manslaughter; the word break flips the meaning to 'take alive'), laupapa (Kalaupapa association) and lauhalalana (possibly a disparaging epithet).
6. Low-degree items: lawakua (degree 0) and lawaiʻamanu (degree 1) are low priority for the P&E check.

## batch-024

Batch 024 has 20 candidates. Verdicts: 5 keep (lehu ahi, lei hala, lelehuna, lewa lani, limahana), 8 keep-pending, 3 doubtful (laʻaua, lelehāuli, lelepali), 4 drop (lawewale, lelemū, leleʻio, lepohānai). All 19 A* rows had pe_via_pollex empty, so POLLEX gave no help with compound spelling here. All four keeps that came from A* turned out to be written as two words in modern use (lehu ahi, lei hala, lewa lani; lei aliʻi is two words too but stays pending). Andrews' one-word headwords are often modern two-word entries, as ROOTS.md warned.

How each keep was confirmed:
- lehu ahi and lewa lani: UH-hosted compilations that reproduce Pukui & Elbert entries (HIGP geology word list; Kaliko High's SOEST weather-terms PDF), plus Ka Wai Ola and Kamehameha Schools (KSBE) usage. These lists quote P&E secondhand. Neither is wehewehe or a mirror of it, but the P&E checker should still confirm.
- lelehuna: the SOEST list gives a different, weather sense ('fine windblown rain spray, mist') from Andrews' 'anything extremely small'. The card gloss follows the P&E-derived sense.

Problems with the dossiers:
1. Wrong or missing root senses:
   - leleʻio: Andrews' second element is 'io, really' (an intensifier; probably ʻiʻo, reviewer knowledge, unverified), not ʻio the hawk.
   - lelehāuli: Andrews' 'hauli, spirit, breath' is neither hāuli 'dark' nor 'bruise'.
   - lawewale: the second element is the particle wale, not wale 'mucus'.
   - laʻamake / laʻaulu / laʻaua: these mean seasons, which fits Andrews' separate 'laa n. time; season'. The dossier lists only laʻa 'sacred', so sense_a is unresolved and the spelling of that laʻa is unknown.
2. Two rules need a project-level decision:
   - lepo: Andrews–Parker's root entry lists 'Dung; excrements'. Under §4.3 as extended to roots this removes every lepo compound. I dropped lepohānai; decide once for the whole family.
   - huna: Andrews lists 'private parts; kahi huna' under the homograph huna 'to hide' (huna#1), not the 'particle' root huna#0 that lelehuna uses. I kept lelehuna, with a sensitivity note.
3. lima has a single Wiktionary id that merges 'five' and 'hand', while POLLEX gives two *lima rows. A LIMA stone could link across those senses.
4. ʻōpeʻapeʻa is 10 characters and 6 morae, and is a reduplicated derivative. It is too long for a 1.5-wide slab, whatever the language verdict on leleʻōpeʻapeʻa.
5. The dossier's compound-level 'andrews' list is empty for 9 rows (laʻaulu, lehuahi, lelehuna, lelehāuli, lelemū, lelepali, lelepono, leleʻio, leleʻōpeʻapeʻa). Their brackets survive only in compound.andrews_1922, so the full entries, with pronunciation marks, are missing.

Sensitivity:
- lelemū (seizing victims for human sacrifice): dropped.
- lelepali: its only sense is suicide.
- leleʻio and lelepono sense 2 involve death.
- lei hala carries ill-omen and passing beliefs (Ka Wai Ola, Bishop Museum).
- leopaʻa is a disability term. Andrews' English 'dumb' must not appear on a card.

Glosses and lit readings avoid ASCII apostrophes ('voice of a woman', not the possessive) so they pass the §4.4 orthography check. All Hawaiian is NFC with U+02BB.

Searches: about 20 web searches and 9 fetches. Blocked hosts (wehewehe, wehe.hilo.hawaii.edu, ulukau, trussel2) were excluded or not opened, and snippets that seemed to quote them were not counted (e.g. a 'lawe wale' gloss). I did not open ulukau.org's Greenstone library, in the spirit of the puke.ulukau.org rule. Searches with no useful result: laʻa ulu / laʻa make (3), leo paʻa (2), leo waena, lele pali. The only sources for 'leo wahine' as an old name for falsetto were blogs, so it was not used as evidence.

## batch-025

Batch 025: 8 keep, 3 keep-pending, 4 doubtful, 5 drop. Full records are in the written file.

Gaps in the dossiers:
- The dossier missed Wiktionary's two-word headwords. "lima hema" (left hand; left-handed) and "lima ʻākau" (right hand; right-hand man) are in the kaikki dump, each analysed as lima + hema/ʻākau. The dossier only looked up the one-word spelling. Those two words therefore have two sources and are keeps. Other batches likely have the same gap wherever the flag "Wiktionary writes it as two words" appears.
- The luahūnā dossier lists only hūnā "to hide". The plain spelling huna "hidden, secret" (PPN *funa) is in both POLLEX (Pukui & Elbert) and Wiktionary, and fits "hidden pit" better.
- The roots lolo and loa are mis-resolved. Andrews' "lolo, palsy" is lōlō "paralysed, numb, feeble-minded, crazy", a separate word, as Hawaiʻi Public Radio's Word of the Day shows. Andrews' "loa, very" is the intensive particle, not loa "long". So lololoa is no compound of these roots (the adjective is just a reduplication of loa).
- lualuaʻi is a partial reduplication of luaʻi (PNP *lua "vomit"), not two roots.
- limakuhi: POLLEX cites Pukui & Elbert's "Lima kuhi, manamana kuhi" "index finger" under PPN *tusu, used in expressions for "index finger" (Samoan lima-tusi). So the form is P&E's own and the expression is inherited.

Decisions the project needs to make:
1. lua#1 "pit" has the sense "toilet" in Wiktionary. I did not count that as excretory, and noted it on each lua#1 word. Read strictly at root level, §4.3 would remove every lua#1 compound, luapele included.
2. luaʻi's main sense is "vomit". I flagged it as excretory for lualuaʻi, which goes anyway on structural grounds. The same reading would also hit luaʻi pele "eruption" in other batches.
3. Andrews' huna (n. 3) has the sense "private parts; genitals; kahi huna", attached to the "hidden" meaning. I used this to drop luahūnā. Every other huna/hūnā compound needs the same check.
4. limaikaika: Andrews' verb sense, "to assault; to throw one down; to force one against his will", reads as a euphemism for sexual assault. The flag is a precaution, and the verdict is doubtful until Pukui & Elbert is checked.
5. lole has a single sense id covering both "reverse" and "cloth". loko has one covering both "pond" and "disposition". So LOLE stones will link lolelua with lole hana, and LOKO stones will link loko wai with lokomaikaʻi. Both id splits follow Wiktionary and POLLEX, where each is one etymon.

Sources and searches: 9 searches and about 8 fetches. Reputable sources used:
- Kumukahi (Kamehameha Schools) and UH Sea Grant: "loko wai", two words, an inland freshwater pond or fishpond.
- UH College of Education: volcano = "lua pele".
- Hawaiʻi Public Radio: "lolo uila" = computer, "an electric brain"; also the lolo / lōlō split.
- NPS: lua is the word for crater.
- Hawaii News Now: writes "luapele" as one word.
- An extra old source turned up: Henry P. Judd, The Hawaiian Language and Hawaiian-English Dictionary (1939), as a scanned PDF. It independently has "lolelua—fickle" with an example sentence, "luapele n. a volcano", lokoino and lokomaikai. Its "lokowai n. a fountain" looks copied from Andrews.
- The searches for lima ikaika, lolokaʻa and lolelua mostly returned snippets quoting the forbidden wehe hosts. I opened none of them and counted none. They are mentioned only to explain the reviewer_knowledge notes.
- luaahi: the raw Andrews text confirms the "hell" sense, with missionary example sentences. It is dropped as a reference to one place (Kīlauea) plus the hell sense.

Housekeeping: another subagent overwrote a shared scratchpad helper script (show.py) mid-run, and its output briefly showed another batch's words. I switched to uniquely named files (show_b025.py, build_b025.py) and checked that every record matches this batch's dossier order.

## batch-026

Batch 026 has 20 words: 6 keep, 7 keep-pending, 5 doubtful, 2 drop.

1. The luna family is the strong part of this batch. All 12 luna words use luna#1 'official' (POLLEX 'Foreman, boss', cited to P&E), not luna#0 'top'. That resolves the 'homograph unresolved' flag on every luna row. Six reach keep: luna hana, lunakahiko, luna kānāwai, lunamanaʻo, luna ʻauhau, lunaʻōlelo. The word break follows a consistent pattern in the 2018 modern-orthography Bible (Ka Baibala Hemolele): lunakahiko, lunaʻōlelo, lunamanaʻo and lunaʻikehala are written as one word; luna kānāwai, luna ʻauhau and Luna Kiaʻi as two. The State of Hawaiʻi Judiciary's Hawaiian page also writes 'luna kānāwai'. Only Andrews has lunakaua, lunalawe and lunaʻohana.

2. One source needs your call. I read the Bible text on bible.com (YouVersion, Partners in Development Foundation 2018). It is the same text Ulukau and baibala.org host. baibala.org is on the forbidden list; bible.com is not, and it did not block access. Decide whether that counts as a mirror; if it does, drop those citations. The spelling of lunakahiko, lunamanaʻo and luna kiaʻi then falls back to 'corroborated'.

3. Gaps in the dossiers:
- **Missing homographs.** Three candidate rows pick a root sense the dossier never lists:
  - lulualiʻi and luluhua use lulu 'shake/sow' (probably lūlū, reviewer knowledge), but the only lulu in the dossier is 'calm, shelter'.
  - luapuhi uses puhi 'to blow' (POLLEX puhi-a < *pusi), but the only puhi listed is 'eel'.

  As built, these stones would link to the wrong root. roots.tsv needs entries for lūlū 'sow' and puhi 'blow'.
- **Folk etymology.** luawahine is not lua + wahine: Wiktionary traces luahine to PNP *nuafine.
- **Lookup misses.** The dossier looked up Wiktionary only under the one-word spelling, so it missed the headword 'luna ʻauhau'. Andrews' compound list is empty for luawahine, luaʻikoko and luluhua, although the candidate row quotes their entries.
- **Missing sentences.** luaʻole shows 2 two-word uses on Hawaiian Wikipedia, but the dossier holds neither sentence.

4. Exclusion calls follow earlier batches:
- **ʻOLE stone.** luaʻole is flagged as grammatical, pending the project's ruling (as in batches 004/007/009/010). If ʻole is admitted, luaʻole is the best word in that family.
- **HUA root.** luluhua is flagged at root level for hua 'testicle' (as in batches 006/011/036).
- **Vomit.** luaʻikoko is dropped because the project treats vomit as excretory (batch-025, lualuaʻi).
- **puhi.** Andrews has a separate puhi entry, 'uncut foreskin', so luapuhi carries a conditional flag until P&E shows which homograph that sense belongs to.
- **lua 'toilet'.** Wiktionary lists this under lua#1. As in batch-025, it is noted but not treated as excretory.
- **For the kumu read.** luapō 'the grave' carries a sensitivity note (pō is also the realm of the dead); it is not excluded.

5. Searches: about 22 searches and fetches. Blocked or refused:
- hawaiian-grammar.org returned a captcha page, so I left it.
- The kuahawaii.org and lokoea.org pages refused automated fetches, so lā hana's modern use rests on search snippets.
- koloascenicbyway.org returned 503.

The KUA and Loko Ea links are recorded as 'snippet only'. I didn't use any wehewehe-mirror snippets: two search answers were plainly drawn from wehe.*.hawaii.edu results, and I ignored them.

## batch-027

Results for batch-027: 3 keep (mahiʻai, makaʻala, makaaniani), 1 keep-pending (lāhui kaua), 12 doubtful, 4 drop. Full records are in the file.

Problems that go beyond this batch:

1. lāʻau has a sexual sense in Pukui & Elbert. POLLEX (PPN *raqa-kau, cited to Pukui & Elbert) lists 'male erection' inside the sense list of lāʻau 'wood, stick'. It is the same root in sense, not a homograph. Under a strict reading of §4.3 every lāʻau compound goes, so all 8 here are flagged. The ones that would otherwise be keep-pending are marked 'doubtful' until the design and a kumu decide whether §4.3 applies to the roots' full sense lists. The decision covers every batch with lāʻau in it.
   - lāʻau kū ('standing wood', degree 12) is the reading most exposed to that sense.
   - lāʻau piʻi is dropped outright: Wiktionary's piʻi#0 also lists 'to mount, to breed, to fuck'.
   - The same question applies to piʻi everywhere, and to moe, if Pukui & Elbert has a 'sleep with' sense (reviewer knowledge, unverified).

2. The ʻokina from PPN *q produces a stone-spelling clash. In makaʻala (Pukui & Elbert via POLLEX, from PPN *mata-qara) the root ala 'awake' is spelled ʻala. Under §4.4, ʻALA and ALA are different stones that never link; under §2 they are the same root in sense. The design must decide whether they link. makaʻala's degree of 17 was counted on ALA. lāʻauala has the opposite problem: its second part is ʻala 'fragrant' (sandalwood is 'lāʻau ʻala', fragrant wood, in modern sources). That root is missing from the dossier's inventory, which only has ala 'way', 'awake' and 'swallow'.

3. Three candidates rest on wrong splits:
   - lāhui: POLLEX gives PPN *lafu (written Laahu/i) and PEP *raafui, so Andrews' 'day + unite' is a folk etymology. Dropped as a compound, though it stays usable as a single root.
   - mahina ʻai: Andrews' own bracket says the first part comes from mahi 'cultivate' ('mahi ana i ka ai'), not mahina 'moon'. It must never link to MAHINA 'moon'.
   - mai luna: a grammatical phrase ('from above'). The 'from' sense of mai is not among the dossier's homographs.

4. Spelling of the root mahele. Wiktionary writes mahele, but reputable modern use writes māhele: Kamehameha Publishing's Hūlili vol. 10 has 'The Māhele of 1848', and Hawaiian Wikipedia uses 'Māhele' as its category namespace. roots.tsv should be checked for this root.

5. Word breaks. Hawaiian Wikipedia writes lāʻau compounds as two words (lāʻau lapaʻau 29 times, never joined), so the pieced forms of all lāʻau candidates are given with a space but marked inferred and word break unknown. mahiʻai is written both ways in reputable sources: Kamehameha's Kumukahi uses 'mahi ʻai', while NPS and Wiktionary use 'mahiʻai'.

6. OCR and dossier gaps. The dossiers for lāʻauluaʻi, mahiʻili and mahinaʻai have empty Andrews lists because the OCR misread the headwords (Laauiuai, Mahiill, Mahinaal). I read those entries in andrews-parker1922.txt directly. Two andrews_definition fields in compounds.tsv are wrong:
   - lāʻauluaʻi's runs on into the next entry, Laaumakai.
   - mahamoe's is taken from the verb sense ('to appear fat, oily or shining') rather than the shellfish.

7. Searches. About 12 web searches and 8 fetches. Several results came from hilo.hawaii.edu/wehe and wehe.hilo.hawaii.edu (wehewehe mirrors); those were not opened or counted as evidence. No reputable source turned up for mahamoe, lāhui kaua or the lāʻau compounds other than lāʻau ʻala. For makaaniani the only modern use is low-authority: a song lyric and a Hawaiian-language class site.

## batch-028

Batch 028 result: 5 keep, 7 keep-pending, 4 doubtful, 4 drop. All five keeps rest on a Pukui & Elbert form via POLLEX (pe_via_pollex): maka koa, maka mua, makapōuli, makapō, make wai. Three of them are written as two words in P&E where Andrews joined them, and makapouli needs a kahakō (makapōuli).

Web search was unavailable: the session's search budget was already used up (200 of 200), so no search ran for this batch and no record has web sources. One permitted WebFetch of wehiolelo.org returned no entry even for makapō, so that dictionary is too small to help. Instead I searched the local Andrews–Parker OCR, the kaikki Wiktionary dump and the Hawaiian Wikipedia dump. That turned up evidence the dossiers lacked:
- Andrews' Make entry, sense 4 (barter), says 'Make hewa, a bad bargain; no profit; in vain'. That names the make used in makehewa.
- Andrews' makawai entry has a second noun sense, 'small outlets for water through the banks of taro patches'. The dossier's Andrews list for makawai was empty (OCR 'Makawal').
- Makawai is also a land-section name in Kona.
- Wiktionary has the phrase 'makewai au'.
- Hawaiian Wikipedia uses makapō in modern text (of Galileo: 'Makapo ʻo ia').

Project-level issues this batch surfaced:
1. The KOLE stone. Wiktionary's own etymology for kole cites 'Māori tore (vagina, vulva)'. POLLEX files kole under PPN *tole 'Female genitals', and every cognate it gives is genital; ʻōkole 'anus' is a reflex of the same etymon. Since the root card prints the protoform and cognates, every KOLE compound needs this flag. makakole was dropped on it.
2. hio/hiō. Wiktionary's hio (short o) means 'to fart silently', and Andrews puts 'passage of wind from the bowels' under Hio. The 'lean' root is safe only if P&E writes it hiō. makahiō is held as doubtful, matching batch-003's flag on hanahiō.
3. POULI/PŌULI. Wiktionary, roots.tsv and POLLEX's root row spell the root 'pouli', but P&E's compound makapōuli (from PCE *mata-poouri) implies pōuli. Under §4.4 those are two different stones, so the root glossary spelling must follow P&E.
4. The MAKE stone covers 'die' (Wiktionary), 'want, need' (make wai; POLLEX puts it under the same PPN *mate) and 'be exchanged, a bargain' (makehewa; source unknown). For makehewa the sense is left unresolved until P&E says whether the barter make is the same entry as 'die'.
5. The MAKA stone. In maka mua, maka means 'point, front, beginning' (PPN *mata 'point'), a sense missing from Wiktionary's maka#0. I chose maka#0 with a caveat.
6. Two more instances of known patterns. The wale-particle pattern recurs (makewale dropped, as in earlier batches). makaʻole is misanalysed: Andrews' second element is 'ole, the eye tooth', not the negator, and its degree comes from a false ʻOLE link.
7. Suggested addition: make ʻai 'hungry' (POLLEX/P&E, PCE *mate-kai) is a natural partner for make wai and is not among the candidates.

Degrees in this batch (17–38) are mostly driven by the very productive MAKA stone, so pending words like makawai (38) and makapaʻa (34) are the highest-value P&E lookups here.

## batch-029

Web searches were blocked. This session had already used its 200-search budget, so every WebSearch call failed. WebFetch still worked. Instead of searching, I checked spellings against Ka Baibala Hemolele (KBH) on bible.com, version 2709: the Partners in Development Foundation's 2018 edition of the Hawaiian Bible in modern spelling. I did not use baibala.org, which is forbidden. KBH shows the editors' modern spelling and word breaks, not independent usage. It also biases toward Bible vocabulary. Every quote went through WebFetch's summariser, so the person checking should re-read the verses. Nothing was taken from the forbidden sites.

Findings that matter beyond this batch:
1. POLLEX (Pukui & Elbert 1986) glosses manawahua as 'indigestion, with gas and often diarrhea'. That sense is excretory, so the word is dropped. The automated screen missed it because it only read Andrews' 'bad disposition' entry.
2. The root hua has a 'testicle' sense (Andrews hua n. 5; POLLEX PEC *fua 'Testicles', cited to P&E). The task's rule excludes a word if either root has such a sense, but DESIGN §4.3 states the rule for the word's own senses. Read literally, the task's version removes every hua compound, including the design's own example huaʻōlelo. Someone needs to decide which reading applies.
3. Some roots lack the sense their compounds actually use:
   - manu 'canoe end-piece' (Andrews manu n. 3), used in manuihu.
   - kōlea as a kin term, 'stepparent' or 'in-law' (Andrews), used in makuakōlea. It must not link to kōlea 'plover'.
   - ʻū 'plaintive cry'. KBH writes the bird 'manu ʻū', so the pieced-together 'manuū' with ū 'breast' is wrong.
   - halo 'fin motion', which is not hālō 'to peer'.
   - ʻana as a particle (makeʻana).
4. A* forms run together phrases that KBH writes as two words: manamana lima / nui / wāwae, malu make, manu huhū, makua kāne. The three manamana words are a good, well-attested family. Kept as two-stone words they connect strongly.
5. makuawahine: the living word is the contracted makuahine (196 hawwiki uses, against 1 for 'makua wahine'). makuahine does not spell makua + wahine, so it cannot sit on these two stones.
6. makualiʻi is attested in KBH (Heb. 7:4; plural mākualiʻi in Acts 7:8–9). It is still pending because the parts row relies on liʻi meaning 'chief', short for aliʻi. Readers may know liʻi as 'small'.
7. Wiktionary analyses manaʻolana as manaʻo + the deverbal suffix -lana. Andrews instead reads lana as 'float' ('buoyed up', the opposite of manaʻo poho, a sinking mind). Pukui & Elbert's 'Lit.' reading would settle it.
8. Hawwiki's one-word majority for makuakāne is inflated: many hits sit in machine-generated filler text. Wiktionary and KBH both write makua kāne.
9. KBH uses makuahōnōwai kāne for father-in-law, and POLLEX gives makuahūnōwai for parent-in-law. Andrews' gloss for makuakōlea, 'parent-in-law', is therefore suspect.
10. manuhelekū's second stone, HELEKŪ, is itself a compound of hele + kū, so the word has three parts. The design should decide whether a stone can be a compound.

Batch result: 6 keep (makuakāne, the three manamana words, manaʻolana, manaʻoʻiʻo), 5 keep-pending, 4 doubtful, 5 drop. Every word except manahālō (degree 0) has degree 3 or more. The highest is manaʻo paʻa at degree 19; it is keep-pending only because Pukui & Elbert may treat it as a free phrase.

## batch-030

Batch 030 result: 5 keep, 6 keep-pending, 6 doubtful, 3 drop.
- Keep: moehewa, moeʻuhane, mokuhonua, mokukaua, mokulele.
- Keep-pending: maʻalahi, maʻaweʻula, moamahi, moanakai, moanawai, moeone, moeʻino.
- Doubtful: maʻaleʻa, meaʻē, mikiʻoi, moawī, moanapaʻakai.
- Drop: maʻaʻula, meakiaʻi, mikiʻaiā.

Web search was blocked. The session-wide WebSearch budget was used up (200 of 200) before this batch started, so no searches ran. WebFetch still worked, and I used it three times:
- haw.wikipedia.org/wiki/Mokuhonua: weak support, because the article reads as partly machine-generated.
- wehiolelo.org (UH Hilo/Ulukau beta) for moeʻuhane and maʻalea: no entry for either; that dictionary is still small.

To make up for it, I relied on the local corpora in research/roots/.cache:
- the full Hawaiian Wikipedia dump (hawwiki.xml), grepped for every form, with the apostrophe variants normalised;
- the raw Andrews–Parker OCR and the parse field in andrews.json;
- the kaikki Wiktionary dump;
- POLLEX hawaiian-reflexes.json.

None of the 20 compounds is in POLLEX: pe_via_pollex is blank for all of them.

Patterns worth acting on in the pipeline:
1. Andrews parses marked "nonconcat" produce fake candidates. Two rows here are built from bracket parts that do not spell the headword, so the pipeline should filter or flag parse=="nonconcat" rows across all batches.
   - maʻaʻula comes from the headword "Maulaula", bracket [Maa and ula].
   - mikiʻaiā comes from the headword "Mikiala". Its bracket reads "aia, to rise up", which is OCR for "ala" (Andrews' own Ala v. 2 says "to rise up"). It was then mapped to ʻaiā "ungodly", so a card would have printed "ungodly" on a word meaning "alert". Modern text spells the real word mikiʻala (2 hits in the dump); a re-entry as miki·ʻala is possible.
2. A* ʻokina failure again (the same kind as makaʻala). The pieced-together maʻaleʻa appears 0 times in the dump, while maʻalea appears 8 times. P&E (via POLLEX) spells the adverb leʻa with an ʻokina, so the modern word does not contain leʻa, and Andrews' [maa + lea, very] looks like a 19th-century analysis. The LEʻA stone also has a sexual homograph (Wiktionary "orgasm", Andrews "sexual gratification"), flagged as conditional in the same way batch-008 did for huna.
3. mea + X rows are productive phrases, not compounds. mea + verb is the agentive construction (mea kiaʻi "one who guards"). mea ʻē occurs in modern text almost only inside the phrase "mea ʻē aʻe" ("other things"): 52 of 55 hits. A MEA stone would over-link the way hoʻo- does, so I recommend excluding mea-led phrases as a class.
4. The moe family needs a ruling from the design owner. Andrews has moe compounds with a sexual meaning (moeipo "fornicator", moekolohe "adulterous"). That supports the open question from batches 003/004/010/014/027 about whether P&E's moe has a sexual sense. I did not flag any moe word, to stay consistent with those batches, but every moe record repeats the note.
5. In mokukaua the MOKU stone means "ship" (a sense Andrews calls post-contact). In mokuhonua the same stone means "island, section", and Wiktionary treats both as one root. mokuhonua is also a Hilo land-section name in Andrews' place-name list, but in modern use it is the common noun "continent".
6. Fields and register:
   - Ships go in hana, to match batch-010/014.
   - Sleep behaviour goes in kanaka; dreams go in naʻau.
   - Three are modern or 19th-century coinages: mokulele and mokuhonua (modern), mokukaua (19th-century).
7. Dossier quality: the hawwiki snippets in the maʻalahi dossier are garbled machine-generated text. The 146 count confirms the spelling, not good usage.

The top P&E lookup in this batch is moanawai (degree 23): it is transparent, the Andrews bracket is clean, and there is no modern use. The next ones are moanakai (11) and moeone (7).

## batch-031

Batch 031: 20 words. Totals: keep 3 (mokupuni, mokuʻāina, moʻokūʻauhau), keep-pending 10, doubtful 5, drop 2 (momikū, moʻaleʻa).

1. The moʻo homograph is missing, and it matters most in this batch. The dossier lists one moʻo only, 'lizard, dragon, serpent'. Seven compounds use a different moʻo, 'line, succession; story' (Andrews moʻo n. 7–8): moʻoaliʻi, moʻokanaka, moʻokupuna, moʻokūʻauhau, moʻoʻōlelo, moʻopuna, and moʻoakua as Andrews reads it. I marked their sense_a 'unresolved' and gave the reason in compound_basis. roots.tsv needs a second moʻo line. Without it, a genealogy stone links to moʻolele, moʻonui and moʻomake (lizard), and a card would print 'lizard' as part of moʻokūʻauhau. The P&E checker should confirm that P&E keeps the two moʻo entries apart.

2. One word is excluded that the automated screen missed. moʻaleʻa uses leʻa#1 'thoroughly', but the same spelling has Wiktionary leʻa#0 'orgasm' and Andrews lea n.2 'sexual gratification'. Under §4.3 it goes. It is also probably a free phrase: Andrews' own moʻa and leʻa entries write 'moa lea'. The screen should be re-run for leʻa in other batches.

3. Bible words are phrases in the modern Bible. Ka Baibala Hemolele (modern-orthography edition on bible.com; that site is not on the forbidden list, and other batches cite it too) writes three of Andrews' one-word headwords as two words:
- 'moʻo lele' (Isa 14:29, 30:6)
- 'moʻo make' (Isa 11:8)
- 'moʻo nui' (Isa 27:1)
They sit beside obvious descriptive phrases (moʻo pepeiaohao, moʻo niho ʻawa, nahesa lele). Revelation uses the loan 'deragona' for dragon. So moʻo nui and moʻo make are marked doubtful as probable free phrases. moʻo lele stays keep-pending because it is used consistently for one creature. Andrews tends to fuse translators' phrases into headwords, and this pattern probably recurs in other batches.

4. moʻopuna is a folk etymology. The spelling is certain (POLLEX/P&E match). But POLLEX reconstructs PN *m(a,o)kopuna and notes it comes from earlier *makupuna, so the 'moʻo + puna' split is a folk etymology. I marked it doubtful as a compound. It could return under an opaque-word rule.

5. The one moku stone means three things. The dossier has one homograph for 'cut', 'island' and 'ship', and POLLEX gives a single etymon, so these words link as one root. But the parts row needs a different gloss per word: ship (mokuluʻu, mokumāhu), island/section (mokupuni, mokuʻāina), divided (mokuwāhi).

6. Sensitivity flags:
- mokumāhu: unmarked 'mahu' in Andrews also spells māhū, glossed there 'hermaphrodite; eunuch'. Not excluded, because MĀHU and MĀHŪ are different units, but mokuahi is the safer and, by Andrews' own note, the commoner word for steamship.
- mokuʻāina: its main modern sense is a US state, which is politically sensitive. Suggest leading the card with 'island; district'.
- Genealogy words (moʻoaliʻi, moʻokanaka, moʻokupuna, moʻokūʻauhau): handle as sacred family knowledge.
- moʻoakua: sacred, and ambiguous between 'legend of the gods' and 'lizard deity'.
- momikū: Kamehameha's expression of contempt for his enemies.

7. Searches. WebSearch was blocked for the whole batch: the session-wide limit of 200 searches was already used up, so no searches were run. Corroboration comes from WebFetch of specific pages instead:
- bible.com KBH chapters (the Bible-word findings above);
- the UH College of Education Kaiapuni standards PDF, which uses 'moʻokūʻauhau' as one word.

Hawaiian Wikipedia counts were re-checked locally for variant spellings: mokuahi 9, mokumāhu 0, muli loa 8, mulihope 0; the 4 two-word 'moku ʻāina' uses mean 'continent'. No forbidden site was opened. Dossier problems: the Andrews bracket for moʻokanaka reads 'Moo, live', almost certainly OCR for 'line'. momikū's root is momi 'to swallow' (= moni), which is not in the dossier homographs.

## batch-032

Result: 3 keep (naʻauao, naʻaupō, noho aliʻi), 7 keep-pending, 4 doubtful, 6 drop. The full records are in batch-032.json.

How I checked:
- WebSearch did not work at all. Every call came back saying the session had used its 200-search budget. So no general web search was done for this batch.
- Instead I fetched two reputable sources directly:
  - UH News "Hawaiian Word of the Week: Naʻauao", via the site's own search page.
  - Kaniʻāina (www.ulukau.org/kaniaina, native-speaker transcripts from UH Hilo / Ulukau). Its phrase search works with curl at ?a=q&txq="…". It ignores diacritics, so "nānā ao" also matched "nāna aʻo". A zero result is reliable; a hit has to be read before it counts.
- Wehi ʻŌlelo is reachable but had no useful entries. The SOEST weather-terms PDF had nothing for these words.
- No forbidden site was opened.
- None of the 20 rows has a pe_via_pollex value.

Patterns in this batch:
1. Many noho + X rows are probably free phrases. Andrews' own noho v. 2 describes a productive pattern, noho + a condition: "noho malie, noho pio, noho like". It cites "noho pio" there as an example, not as a word. Native speech in Kaniʻāina uses "Noho lōkahi ʻana. Noho aloha ʻana." the same way.
   - noho aliʻi: kept. It is clearly lexical ("throne; reign"), with 77 two-word uses on Hawaiian Wikipedia and native-speaker use.
   - noho paʻa: keep-pending. Attested as two words, but whether it is a word or a phrase is open.
   - nohopio, nohoaloha: doubtful.
2. Two rows have the wrong second root.
   - nihohui uses huʻi "ache", not hui "join". Andrews keeps the pain word under a separate entry, and next to it a cross-reference "Same as hu'i" marks the glottal stop. Andrews also writes "niho hui, tooth ache" as two words.
   - nihoawa uses Andrews' bitter/kava awa, not the channel or milkfish homographs. It is probably ʻawa, but that is from memory, not a source.
   - Kept as split, either row would put a false link on the board.
3. noaloa is an extraction error. Andrews' bracket has three parts (noa + au + loa), the cited form is noaauloa, and it is an epithet of Kauikeaouli.
4. Root-level exclusion questions, each affecting every compound on that stone:
   - NOA: Andrews noa n. 2 "A prostitute". This may remove every NOA compound under the any-sense rule; it needs P&E.
   - LOA: Andrews loa n. 2 "a receptacle of filth" should be checked once.
   - LUA: the spelling carries lua#1 "toilet" (Wiktionary). That is a different root, so it is a note only.
   - NENE: its PPN etymon is *nene "orgasm" (POLLEX, Wiktionary).
   - Applied the same way as earlier batches: KOLE (genital etymon, as makakole), LEʻA (sexual sense, as moʻaleʻa), mū as procurer of sacrificial victims (as lelemū).
   - KAʻA: the cathartic sense (Andrews kaa v. 5) is left as a note for olokaʻa, as in kaʻapuni. The batches disagree on this; holokaʻa excluded on it. It still needs one project decision.
5. Two meaning-based drops: nīnauʻuhane (consulting spirits, sorcery) and mūakua (human sacrifice).
6. Words worth putting first in the P&E check, because they connect a lot:
   - nukuwai (degree 21): Andrews only. No modern use as "stream mouth" found; the only modern string is a poetic, unclear line in a mele.
   - noho paʻa (degree 20).
   - naʻaulua (degree 16): transparent, letters secure, word break unknown.
   - olokaʻa (degree 9): living word in native speech. Andrews leaves olo unglossed, and one transcript writes ʻolokaʻa with an initial ʻokina.
   - olokaʻa's Andrews example, a stone rolled from top to bottom, fits the piece's theme exactly.
7. Wording to watch: the 19th-century "darkness" use of pō and naʻaupō (missionary framing), and Andrews calling cloud and sky watchers "astrologers". Neither should reach a card.

## batch-033

Batch 033: 20 candidates, all A*, none in POLLEX (pe_via_pollex empty for every row). Result: 1 keep, 8 keep-pending, 6 doubtful, 5 drop (one of the 5 keep-pending entries above is a typo-free count: omokoko, omoliu, oneʻā, paepaepuka, pahukani, pahukapu, pahupalapala = 7 keep-pending; 7 doubtful: olokeʻa, olokē, pakakahi, palaholo, palakea, palalauhala, palaloli; 5 drop: olokiki, olomua, paepū, pahuana, palalalo; 1 keep: one hānau).

WEB SEARCH WAS BLOCKED: the session-wide WebSearch budget (200 of 200) was already used up before this batch, so I ran no searches. I made one WebFetch, to English Wikipedia's 'Hawaii Aloha' page. It confirms the lyric 'E Hawaiʻi e kuʻu one hānau e' = 'O Hawaiʻi, O sands of my birth'. That is a secondary source, not one of the listed reputable ones. Everything else rests on the dossiers alone.

Patterns:
1. PALA root, five candidates (palaholo, palakea, palalalo, palalauhala, palaloli). The automated screen missed that the PALA spelling carries an excretory sense ('Dab of excreta', from POLLEX citing P&E; Wiktionary's only pala homograph comes from PNP *pala 'mud, filth, excrement') and a venereal one ('The syphilis' in Andrews; 'Form of syphilis' in POLLEX). The screen apparently checked only Wiktionary sense text. All five compounds use pala 'soft, ripe', which has no homograph id in the dossier, so sense_a is unresolved for all of them. palalalo is dropped because its own definition says 'diseased with the pala'. The other four are flagged at the root level and marked doubtful until the design rules whether homographs are judged by spelling. This matches how other batches handled lepo, hio and huna. That one ruling decides four words, palakea among them at degree 9.
2. Root-level flags, consistent with earlier batches:
   - keʻa: 'male animal reserved for breeding' (P&E via POLLEX, from PEP *teka 'penis'). olokeʻa is flagged and doubtful, as hōʻakakeʻa was in batch-009 and keʻapua in batch-013. olokeʻa's own senses also include a heap of bones and a gibbet.
   - kiki: Andrews gives 'to practice masturbation'. olokiki is dropped, as kikialo was in batch-014.
   - paka: Wiktionary's paka#2 is a loan meaning 'bugger'. pakakahi is flagged conditionally; it is probably obscure, and if loan homographs are ruled apart the word becomes keep-pending.
3. Grammatical second elements:
   - pahuana is pahu plus the nominalising particle ana, a verbal noun, not a two-root compound. Its degree of 12 is an artefact of ANA linking by spelling to 'cave' and 'measure' words. Dropping it removes false board connectivity.
   - paepū ends in the particle pū 'together'. Dropped, as pūʻalu was in batch-039.
4. OLO root: the dossier lists only olo 'rub, grate'. olokē uses olo 'resound', olomua uses olo 'fleshy skin', and olokeʻa leaves olo unglossed, so every olo sense_a is unresolved. olokē is probably a single stem: Andrews gives pioloke as its synonym. Its kahakō is copied from kē 'protest' and is likely wrong.
5. Hawaiian Wikipedia's two-word counts were decisive for one hānau: 7 two-word uses, 0 one-word, plus the Lyons hymn. That makes it the batch's only keep, though at degree 2. pahu kani has 7 two-word uses too, but they are concentrated in two machine-assisted-looking articles, and one means an audio jack, so I rated it corroborated, not attested.
6. Register: omokoko ('horse leech') looks like a Bible-translation word (reviewer knowledge, unverified: Proverbs 30:15). omoliu, oneʻā and pahu kani are 19th-century coinages for introduced things, per Andrews' own notes (pauma and pauda replaced the first two).
7. Dossier gaps: pahuana, olokiki and palaloli have an andrews_1922 bracket but an empty 'andrews' full-entry list. The paepū root entry for pae 'reverberating sound' is split across OCR lines.

## batch-034

Every candidate in this batch is A* (Andrews–Parker only); none has a Wiktionary entry. Result: 1 keep (pale kai), 13 keep-pending, 3 doubtful, 3 drop.

Searches blocked: WebSearch was refused because the session's 200-search budget was already used up. No web corroboration was gathered and web_sources is empty in every record. To make up for it, I grepped the local caches: the Hawaiian Wikipedia dump for one- and two-word variants, the Andrews OCR for cross-references, the Wiktionary dump, and POLLEX hawaiian-reflexes.json. If the budget is raised, the most useful searches are papakea, papahola, palekaua, panapoʻo and pale keiki.

Findings:
(1) palekai: POLLEX (P&E 1986) has 'pale kai: taffrail, railing of a vessel; breakwater' < PNP *pale-tai. That is an inherited compound, and Hawaiian Wikipedia uses 'pale kai' 3 times. The only clean keep. Since P&E splits this pale compound into two words, the other pale· compounds (palekaua, palemaka, paleuhi, palekeiki) may be two words in P&E too. palekeiki is written 'kahuna pale keiki' on Hawaiian Wikipedia.
(2) Root pala should be excluded under §4.3: P&E via POLLEX gives 'dab of excreta' and 'form of syphilis', Andrews gives 'the syphilis', and even Wiktionary's etymology cites 'excrement'. The automated screen missed it because Wiktionary's sense list for pala is only 'to smear'. This affects every pala· word in other batches.
(3) Wrong root mappings:
  - palemai: the second part is maʻi 'private parts' (Andrews: 'mai, private', stress ma'i), not mai 'don't'. Dropped as genital.
  - papahā: papa- is Andrews' 'reduplication of the distributive particle pa'. Dropped as prefix-built.
  - palapalakea: probably a reduplicated palakea (Andrews analyses palakea as pala + kea), not palapala 'writing' + kea.
  - paluheʻe: palu here looks like palupalu 'soft', not 'to lick'.
(4) Unresolved homographs that need new glossary lines:
  - pane 'back of head' (POLLEX/P&E PPN *pane), not pane 'answer';
  - palai 'to turn the face away (in shame)' (Andrews), not the fern and not palai 'fry' (an English loan);
  - pala 'ripe, soft', which is moot given (2).
  Degree counts for these rows were computed against the wrong homograph.
(5) Root kea: Andrews lists 'a male animal reserved for propagating; male of virile power'. A kumu should rule on whether that triggers §4.3 for all kea words. heʻe has Andrews 'the menses'. Both are recorded as sensitivity notes, not exclusions.
(6) papakoa has two Andrews analyses with different papa senses (board vs rank); sense 1 is a free phrase.

## batch-035

Batch 035 has 20 candidates: 12 built on papa, 7 on pau, plus paʻahana. None is in POLLEX (the pe_via_pollex column is empty for all of them), so Pukui & Elbert evidence came from nowhere. Results: 3 keep (papamū, pauaho, paʻahana), 7 keep-pending, 4 doubtful, 6 drop.

Patterns:
(1) papa + numeral or locative. papalua, papaʻakahi, papaone/papaono, papalalo and papawaena follow a productive papa + modifier pattern, so the risk is a free phrase rather than a word. Andrews also says papa is the reduplicated distributive particle ('e papa lua, to make two-fold'), so most of papalua's senses are built on a prefix.
(2) papaone is an artefact. Andrews' headword is Papaono, and its bracket misprints 'one' for ono 'six'. The pipeline took the bracket spelling and mapped it to one 'sand'. It may be worth grepping the whole sheet for other rows built from a bracket spelling instead of the headword.
(3) Wrong homographs. pauono maps ono to 'six/wahoo' when Andrews means 'sweet' (reviewer knowledge: modern ʻono). paukē maps kē 'complaint' when Andrews gives 'ke, to press against'. paupū's pū is the particle 'together', which has no glossary root.
(4) The automated exclusion screen missed three things. kikī has 'To practice masturbation' in Andrews' entry, which removes paukikī. pāʻele has 'A negro' in Andrews, which removes paupāʻele. POLLEX's P&E-sourced gloss for lāʻau includes 'male erection'; I flagged papalāʻau for it, but the team needs one ruling on this for the whole lāʻau family.
(5) pauahi was dropped. Every Hawaiian Wikipedia use is the name of Ke Aliʻi Bernice Pauahi Bishop, and Andrews' appendix also gives it as a land-section name, so 'destruction by fire' on a card would read as a gloss on her name.
(6) There are four near-duplicate furniture words (papa ʻaina, papapāʻina, papapalapala, papapōhaku) plus papamanamana. They are probably 19th-century names for introduced objects. papa ʻaina has real modern use, but its sources write it both as one word and as two.

Searches: 15 searches/fetches. Many results returned wehewehe mirrors (wehe.hilo / wehe.colo / hilo.hawaii.edu/wehe) quoting P&E for pauaho, papa lalo, papa pōhaku and pāpālua. I opened none of them and did not count those snippets as evidence. Reputable sources used: UH News Word of the Week (paʻahana), PIDF (paʻahana), NPS Puʻuhonua o Hōnaunau (papamū), and Ka Wai Ola (the poi board is papa kuʻi ʻai, not papapōhaku). HAWAIʻI Magazine and Honolulu Magazine only show popular one-word use of papaʻaina.

Shared scratchpad: other subagents' helper scripts sit at the scratchpad root, and one named show.py silently read batch-013 instead of my batch. My helpers are now in scratchpad/b035/. Other batch reviewers should use their own subfolders.

## batch-036

Batch 036, 20 words: 5 keep, 8 keep-pending, 2 doubtful, 5 drop. I used 20 web searches and about 11 page fetches.

Problems that reach beyond this batch:
(1) The hua root has a 'testicle' sense in Andrews (hua n. 5) and in POLLEX (PEC *fua, cited to P&E). Under DESIGN §4.3 as extended to roots, every hua compound would go, huaʻōlelo included. I flagged paʻihua (firm) and pilihua (conditional, since Andrews glosses that hua 'pain'). The kumu needs to rule on hua once for the whole family, not word by word.
(2) Root kiki/kikī: Andrews' verb kiki sense 3 is sexual, so paʻakikī was dropped by rule even though it is a common, useful word. POLLEX/P&E spell the root kikī, not Wiktionary's kīkī, and ʻŌlelo Online writes paʻakikī.
(3) Root piʻi#0 has a sexual sense in Wiktionary. That affects every piʻi compound in other batches.
(4) paʻi in paʻiʻai, paʻihua and paʻiaʻa is not paʻi 'slap/print'. Andrews glosses it 'bundle' or leaves it unglossed. Their degrees assume one shared PAʻI stone with paʻi kiʻi, so they are overstated.
(5) The candidate pipiwai is really pīpīwai (root pīpī 'sprinkle', per NPS citing Place Names of Hawaiʻi), not pipi 'oyster/beef', so its degree of 21 is wrong.
(6) Wrong-homograph and ʻokina mappings: in poiawa, Andrews' 'awa, sour' is not awa 'channel'. In piʻiana the second part is the participle ana, a grammatical suffix, not a root.
(7) In paʻapū, pū may be the postposed particle 'together/completely', which would make it a grammatical stone.

Sources: a Kamehameha Schools-hosted 1980 compilation reproducing Pukui & Elbert 1971 (blogs.ksbe.edu KA-UA.pdf) gave P&E text for paʻapū and 'Paʻa kāhili, kāhili bearer'. It is an allowed KS source, but it reproduces P&E's wording; worth knowing when weighing it.

Blocked or avoided: search results surfaced wehe.hilo.hawaii.edu, wehe.colo.hawaii.edu, heaniani.com (labelled a Combined Hawaiian Dictionary mirror), ulukau.org/chd and the Ulukau Andrews–Parker e-book (also a dictionary mirror). I opened none of them and ignored their snippets, including one summary that claimed to quote P&E on paʻakikī. I did use www.ulukau.org/kaniaina, a separate audio-transcript archive that is not on the forbidden list, for paʻanaʻau. tpl.org returned 403.

Spelling changes the P&E checker should confirm: paʻakāhili → paʻa kāhili, paʻikiʻi → paʻi kiʻi, paʻiʻai → paʻi ʻai (word break split in modern use), pipiwai → pīpīwai, paʻakīkī → paʻakikī.

## batch-037

Batch 037 has 20 candidates: 3 keep, 11 keep-pending, 5 doubtful, 1 drop. All but puʻukani are A* (Andrews only), and pe_via_pollex is empty for every row, so POLLEX gave no Pukui & Elbert check here. I used about 16 web searches and fetches.

Findings that change the worksheet:
1. punawai (degree 21) is spelled pūnāwai in modern use. Hawaiian Wikipedia has it 3 times as pūnāwai and never as punawai; the UH WRRC seminar abstract and the PI-CASC/USGS PIPES report also write pūnāwai, and Wiktionary lists the derived term 'pūnāwai ʻauʻau'. The first element is PŪNĀ, not PUNA, so under DESIGN §4.4 the puna·wai split fails. I marked it doubtful pending a ruling: either a PŪNĀ stone, which would link to nothing, or drop. Other Andrews puna- and pū- rows may be lengthened the same way.
2. poʻolua is a Wiktionary headword written as two words, 'poʻo lua' ('partible paternity, a child fathered by other than the husband'). Andrews adds 'bastard' and 'adulterous'. Dropped under §4.3 as sexual and a slur.
3. poʻopaʻa: Andrews itself cross-references 'Oopukai … a species of hard-head oopu (Cirrhitus marmoratus). Also called poopaa.' That agrees with FishBase (Po'opa'a, O'opu kai for Cirrhitus pinnulatus) and The Garden Island (2023: 'means hard head'). Kept.
4. poʻowai is attested one word by Kamehameha Schools ('water head or source') and State DLNR CWRM ('po'owai (diversion)'). Kept.
5. puakala: OHA Ka Wai Ola writes it as one word, the Waikōloa Dry Forest Initiative as two ('pua kala'). Word break 'either'; P&E must set the caption.
6. poʻoʻōlelo is used 3 times as one word in Hawaiian Wikipedia, but Wiktionary's poʻo entry links a derived term spelled 'pōʻōlelo'. P&E should settle the spelling.

Patterns:
- The puni + noun words (punikoko, puniwaiwai, punihai) and puka + noun words (pukahale, pukaihu, pukamakani) may be free phrases rather than headwords. The pe_check for each asks whether P&E lists them.
- Modern Hawaiian uses puka aniani for 'window' (Wiktionary headword, 3 times in Hawaiian Wikipedia), so pukahale and puka makani may be obsolete.
- punihai: Andrews glosses hai as 'to run', which matches none of the dossier's hai homographs. The automatic mapping to hai#0 'offering' is wrong.
- puʻuhoʻomaha has three morphemes (hoʻo- is not a root).
- pokeʻina has degree 0, so it could never turn on the board.
- Sensitivity notes were added for poʻokepa (a mourning custom), punikoko (murder, a strong pejorative), punihai (calls someone a coward) and poʻohina (hina is also the goddess's name).

Blocked or discounted: many searches returned wehewehe.org mirrors (wehe.hilo.hawaii.edu, wehe.colo.hawaii.edu) or summaries built from them, for puʻukani, poʻoʻōlelo, poʻohina, the puni- words, puka ihu and puapoʻo. None of these was opened or counted as evidence. hawaiian-words.com results were also ignored as an unclear source.

Gloss and lit sources: every gloss and lit paraphrases Andrews, Wiktionary or a cited web page, with one exception. puʻukani's lit 'sounding throat' is built from the dossier's root glosses, because no source gives a Lit. reading; this is flagged in its lit_source and pe_check.

## batch-038

Batch 038: 4 keep, 6 keep-pending, 7 doubtful, 3 drop. All 20 records are in the file.

Extractor faults found in this batch:
- pōkahi is an OCR-repair artifact. Andrews' headword is Poakahi, and the real word is Pōʻakahi 'Monday'. Wiktionary has it in the local kaikki dump as pō + ʻakahi, and Hawaiian Wikipedia uses it 8 times. ʻakahi carries the ʻa- prefix, so the row is dropped.
- puʻuʻulaʻula is also a repair artifact. Andrews' common noun is 'Puulaula' (single u, 'bank of red earth'). Puuulaula appears only in his gazetteer, as a Kaʻū mountain, and NPS writes Puʻuʻulaʻula for the Haleakalā summit. Dropped as mainly a proper name.
- pāpaʻiwale maps Andrews' papai 'to strike' to pāpaʻi 'crab'. Andrews leaves wale unglossed. The word means a sacrificial killing, so it is dropped.

Roots missing from the glossary:
- pīkai needs pī 'to sprinkle' (Andrews pi v. 1). The dossier's only pī is 'stingy; letter P', so sense_a is unresolved.
- The pāleo 'phonograph record' sense uses a pā 'disk/plate' that is not among the pā homographs.
- lima has one id, but POLLEX separates *lima 'five' from *lima 'hand'. puʻulima uses 'hand'.

Family-level exclusion flags: pālepo is flagged for lepo 'Dung; excrements' (Andrews). pālāʻau is flagged for lāʻau 'male erection' (POLLEX gloss cited to P&E). I set both to doubtful, the way earlier batches mostly did (halelepo, halelāʻau, papalāʻau, hunalepo), but batch-024's lepohānai was set to drop. One project decision per root family would settle these.

Other patterns:
- The puʻu- family is mostly A* body words from Andrews alone: hernia, throat cancer, blood clot, breast. They are high-degree but grim or medical. puʻuwai (heart) and puʻuone (sand berm, from loko puʻuone) are the two solid ones.
- Free phrases rather than lexical items: puʻuʻōpala (Andrews writes 'he puu opala' himself), pāpale laʻa, and possibly pāpale aliʻi.
- pākū: the 'burst out (as matter from a boil)' homograph is Wiktionary's separate pakū (short a), so it is not an exclusion concern.

Web: 19 searches, plus fetches of NPS (ʻAimakapā, Puʻuʻulaʻula), UH Sea Grant, HPR (puʻuwai, pāleoleo), Hūlili 8 (Kamehameha, pīkai), Punahou and Chaminade (pānini), Kaʻāina Momona, and DLNR (Pālāʻau). Search snippets quoting wehe.*.hawaii.edu and ulukau dictionary pages (P&E text on puʻuwai and pākū) came back in results. I did not count them or open them. hear.its.hawaii.edu would not resolve (DNS), and khon2.com returned 403.

## batch-039

1) The OCR repair truncated Andrews headwords, so three rows are not real words. pōkolu = Andrews Poakolu, pōlima = Poalima, pōhakuwai = Pohakuwaiki (three parts: pōhaku + wai + kī). Wiktionary has Pōʻakolu and Pōʻalima as pō + ʻakolu / ʻalima. Pōʻakolu and Pōʻalima are worth re-entering if ʻakolu and ʻalima are admitted as roots (as ʻaono is). Their current degrees (6, 9, 25) are spurious. Check the other batches for pō· rows like pōkahi (= Pōʻakahi), which probably have the same fault.

2) The builder missed capitalized Wiktionary headwords. Pōʻaono was coded A* although Wiktionary has the headword and the pō + ʻaono analysis. All six weekday names are Wiktionary headwords.

3) Wrong homographs where P&E's root has no ʻokina. Andrews' alu 'cooperate' is P&E alu (POLLEX < *qalu), not ʻalu 'slack'; his hoaka 'crescent' is P&E hoaka (POLLEX), not hōʻaka 'provoke laughter'. Also the pū in Andrews' pualu is the particle 'together'. roots.tsv already says 'differs: hoaka' for hōʻaka.

4) An untapped source: Wiktionary's derived-terms lists in the local kaikki dump give modern two-word forms: pōʻai hapalua, pōʻai lōʻihi, pōʻai puni, pōʻai haele (haele, not hele), pōʻailewa. Worth mining across all batches for word breaks.

5) Root-level exclusion questions that need one project-wide ruling:
- lāʻau: POLLEX's P&E gloss includes 'male erection'. Flagged on ululāʻau, which is otherwise keep-quality.
- lepo: Andrews 'Dung; excrements'. Flagged and dropped pōhakulepo.
- hapa (inside hapalua): Wiktionary 'Borrowed from English half'. Flagged and dropped pōʻaihapalua.
- kaʻa: Andrews 'to take effect as a cathartic'. Borderline, noted but not flagged.
The automated screen used Wiktionary senses only, so it misses senses that appear only in Andrews or POLLEX.

6) The Hawaiian Wikipedia counts can mislead. The raw 'pōʻele' hits are all pōʻeleʻele. Hawaiian Wikipedia's 'pōhaku paʻa' is a free phrase, not the adze-stone term.

7) Best web source: a UH SOEST PDF (Kaliko High 2022) compiled from P&E weather entries. It confirms Pōʻailani 'horizon', Pōʻailewa and Pōʻele, and is useful for other lani-field words.

8) Blocked or avoided: wehe.hilo.hawaii.edu and ulukau.org/chd (a mirror of the wehewehe dictionaries) came up in most searches. They were not opened and not counted. A snippet suggesting P&E lists 'pōhaku hele' as a variant of 'pōhaku hali' appears only as a lead in the pōhakuhele pe_check. KHON2 returned 403. About 17 searches and fetches used.

## batch-040

Batch 040, 20 words: 5 keep (uluwehi, wahaheʻe, waihoʻoluʻu, wailele, waimaka), 5 keep-pending (wahahewa, wahapaʻa, waiea, waikai, wailana), 5 doubtful, 5 drop. Only waimaka is in POLLEX (pe_via_pollex = match); no other word in the batch has a Pukui & Elbert check of any kind.

Searches: the web search budget ran out after 4 searches (this session hit its 200-search limit, likely shared with other batches). After that I used WebFetch only. Two web sources were used:
- Hawaiʻi Public Radio's Hawaiian Word of the Day gives wailele as "leaping water", waterfall.
- Hui Hoʻoleimaluō (a Maui fishpond stewardship group) uses "brackish or waikai ecosystem".
Two search summaries appeared to quote the UH Hilo Wehe² mirror (for uluwehi and wai kai). I did not open them or count them; the records say so.

The WAHA family (degree 7–24) is mostly 19th-century words for bad speech, attested only in Andrews and often insults. I dropped wahahaukaʻe and wahahaumia ("filthy mouth", "foul mouth; blackguard"). That was a judgement on sensitivity and teaching value, not a confirmed §4.3 hit, so a person can restore them. For haukaʻe I flagged a possible excretory sense: Andrews glosses a "kae" as "the anus" in one bracket, but kae vs kaʻe is unconfirmed.

Dossier problems to fix upstream:
- The homograph lists leave out grammatical and Andrews-only senses that compounds actually use:
  - uluwale needs the particle wale ("of itself"; Wiktionary has a particle entry, filtered out). The only listed wale is "mucus/phlegm".
  - wahaama needs Andrews' adjective ama "tattling"; only ama "outrigger float" is listed.
  - wahapaʻa's paʻa is unglossed in Andrews, and Andrews' own example links it to hoʻopaʻapaʻa ("to argue").
- waikai's dossier "andrews" list is empty because the OCR reads "Walkai". The Andrews entry exists (andrews.json headword_ocr = Walkai).
- The wahaama definition carries OCR column bleed ("To carry on the / or a person…").
- Andrews–Parker has a place-name appendix (about line 106280 in the OCR) that glosses several wai- words as places: Waiau "water to swim in", Waiea "turtle cove", Wailele "water fall". It helps spot proper-name and spelling problems; Waiea may be waiʻea if the element is the turtle word (reviewer knowledge, unverified).

Design questions raised:
- Andrews lists "the menses" among the senses of hee (heʻe#1, slide/flow). If Pukui & Elbert agrees, the strict "any sense" reading of §4.3 would reach every heʻe#1 compound, heʻenalu included, not just wahaheʻe. This needs a policy decision, not a silent drop.
- waihoʻoluʻu makes a stone of a hoʻo-prefixed lexical verb, hoʻoluʻu. I treated it as allowed, since it is a whole word and not the bare prefix the design rejects.
- wailana's living modern sense is "to banish", and the Hawaiian Wikipedia example is the exile of Hansen's disease patients to Kalaupapa. The "calm water" gloss has only Andrews behind it, so it needs a cultural read even if Pukui & Elbert confirms that sense.
- waiea (ceremonial water at a heiau) and waihā (priests breathing upon images) are sacred, and Andrews frames both in missionary-era terms ("holy water", "idols").

Exclusions: waikeʻokeʻo (genital discharge) and wailenalena (place name) under §4.3; waiau as mainly a place name; uluwale for the grammatical particle.

## batch-041

I reviewed all 20 words in batch-041 and found no web evidence, because no web searches ran. Every call returned "used its web search budget (200 of 200)". I didn't try to get around that limit. Wehi ʻŌlelo (wehiolelo.org, Ulukau-hosted but not on the forbidden list) answered with no bot challenge, but it had no entry for wanaʻao, waiūpaʻa or wiliau, so I stopped using it. Every web_sources array is empty. Instead I searched the local copies the dossiers come from: the Andrews–Parker OCR (with whitespace normalised), the kaikki Wiktionary dump, the Hawaiian Wikipedia dump and POLLEX's hawaiian-reflexes.json.

Results: 4 keep (waipuna, waiū, waiūpaʻa, plus none else), 7 keep-pending, 5 doubtful, 4 drop. Correction to that count: keep is 3 (waipuna, waiū, waiūpaʻa), keep-pending 7, doubtful 6, drop 4.

What the local search turned up:
- **wiliʻau should be wiliau, with no ʻokina.** Andrews' own Au entry reads "a current … a circular motion, such as caused by an eddy". POLLEX (Pukui & Elbert) has au "Current" < *qau, and Wiktionary has au "current (water); flow". Modern Hawaiian Wikipedia writes "wiliau hōkū" (galaxy). Andrews' bracket "au, to swim" is a guess. The second stone should be re-keyed from ʻau#1 to a root au "current", which is not among the dossier's homographs.
- **Andrews contradicts itself on wanaao.** Next to the [wana + ao] bracket it has a separate headword, "Waanaao [Wa, time, a, of, na, the, and ao, light] … contracted into wanaao". The root wana "to appear" is not among the dossier's homographs either.
- **waipuna is two words.** POLLEX gives Pukui & Elbert's "wai puna, Spring water" < PPN *wai-puna, and Andrews' Wai entry also writes "wai puna".
- **Andrews writes the ink word both ways.** It has "waieleele" and "wai ele-ele"; the Inika entry gives the literal reading "black water".
- **Waipahu.** Andrews' place-name gazetteer gives "Waipahu: gushing water. Village, Ewa". The root is pahū "burst" (Andrews stresses the last syllable; modern Hawaiian Wikipedia writes pōkā pahū), not pahu.

Exclusion flags: waipahu and waiʻaleʻale are proper names. wilikī has a root borrowed from English (kī "key"). wilipuaʻa's Wiktionary etymology is a euphemism for "hog penis". waipiʻi is flagged under the root-level rule: Wiktionary's piʻi lists "to mount, to breed, to fuck". That should be decided once for piʻi, a very common root, so I marked waipiʻi doubtful rather than drop.

Sensitivity notes worth a global decision:
- Andrews glosses ʻeleʻele as "a black-skinned person" in dated English. It is descriptive in the source, not marked as a slur.
- Andrews gives heʻe the sense "the menses", but that belongs to the "flow" homograph (heʻe#1), not the octopus stone.
- Andrews' wili entry has the phrase "mai wili" (a venereal disease). It's a phrase, not a sense of wili.

Patterns:
- **Free phrases.** Most of this batch is Andrews' wai + X headwords, and many look like free phrases rather than lexical items: wai + noun modifier, wai + fruit for juice, wā + noun for a season. Pukui & Elbert will probably list them, if at all, as two-word sub-entries under wai. I marked the weakest (waiʻōhiʻa, waiwaipio, wāheʻe) doubtful.
- **WAIŪ as a stone.** waiūpaʻa and waiūhakuhaku make WAIŪ a stone, while waiū itself is wai·ū. Deciding whether an inherited compound (PNP *wai-uu) can be one stone affects every waiū- word, including Wiktionary's waiūpaka and waiūtepe. Those two are hybrids with an English and a Māori part, so they'd be excluded anyway.

Highest-priority Pukui & Elbert checks:
- waipaʻa (degree 37): ice, one word or two?
- waiua, waiʻauʻau, waiʻele, waiʻeleʻele (degree 20–21): one word or two?
- waʻapā: which sense of pā does it use?

## batch-042

Batch 042 results: 5 keep, 5 keep-pending, 4 doubtful, 6 drop. The full records are in the file named in 'written'.

Searches were blocked. WebSearch refused every call: the session-wide budget (200/200) was used up before this batch started, so this batch ran no web searches. Two WebFetch calls to English Wikipedia were made instead. They are weak secondary sources and are recorded as such for ʻahu ʻula and ʻai kapu. To check modern spelling I grepped the local Hawaiian Wikipedia dump (.cache/hawwiki.xml) for each corrected form, beyond the counts in the dossier. That is how ʻahaʻaina (10 uses), uahi (3), ʻōkomo (1) and ʻuala (1) were found. I re-read the raw Andrews OCR (.cache/andrews-parker1922.txt) to confirm the misreadings below. Nothing came from wehewehe.org, Ulukau, baibala.org or trussel2.com.

Patterns that are probably systematic in the pipeline, not just in this batch:

1. ʻahā 'four' wrongly matched. Andrews' 'Aha, a company' was matched to ʻahā 'four' instead of ʻaha 'assembly' (ʻaha#0) in three rows: ʻahāaina, ʻahāinu, ʻahāʻaina. ʻahāaina also matched 'aina' to Wiktionary's aina 'coition' instead of ʻaina 'meal', so as mapped it would put a sexual stone on the board. hēʻahā, outside this batch, also uses this root. It is really he + aha 'what?' and is grammatical. Once these rows are fixed, ʻahālike is ʻahā's only real partner, so its degree drops. The ʻaha#0 family gains ʻahaʻaina and ʻahainu.

2. OCR misreading 'l' as 'i' creates false ʻaiā 'ungodly' rows:
 - ūʻaiā is Andrews' 'Uala [U and ala, sweet]', i.e. ʻuala, sweet potato.
 - ʻaiāniho is 'Alaniho [Ala, path, and niho, tooth]', strips of tattooing.
 - mikiʻaiā, outside this batch, is the third and last ʻaiā row and deserves the same suspicion.
 - alaniho (ala·niho) is missing from compounds.tsv and could be added as an A* candidate.

3. Andrews' ū rows are unreliable:
 - ūana is ū 'weep' plus the aspect particle ana. It is grammatical and excluded.
 - ūahi is uahi in Pukui & Elbert (via POLLEX), from PNP *qau-afi, so it has no ū. Andrews' 'U, ooze or milk' is a guess.
 - Their degrees (14 and 11) are spurious. manuū, outside this batch, also relies on ū 'mourn', which is not among the dossier's ū homographs.

4. ōkomo maps Andrews' 'O, to prick' to ō 'provisions'. The real root is ʻō 'pierce'; the one modern use is spelled ʻōkomo.

5. Several Andrews A* items are verb + object phrases rather than lexical compounds: ʻaiʻāina (degree 13) and ʻaiahupuaʻa (three morphemes). Both are marked doubtful, with a precise P&E question for each.

Other things the Pukui & Elbert checker should settle:
 - ʻahamaka: is it a loan from English 'hammock'? Andrews also lists 'killing by lua' and 'secret priests' prayer assembly' senses.
 - ʻahu ʻula: is the second root ʻula 'red' or ʻula 'sacred, regal'?
 - ʻahuao: its ao means 'young pandanus leaf', a homograph missing from the dossier.
 - wāwai (degree 21): Andrews alone gives a 'space + water' bracket that looks like a guess. It may be a reduplication of wai.

Two rows are kept only on a corrected split: ʻahāʻaina must become ʻaha·ʻaina (ʻaha#0 + ʻaina#0), and ʻahāinu must become ʻaha·inu (ʻaha#0 + inu), not as written. ʻaha#0 is the id given in this batch's ʻahakanaka and ʻahaʻōlelo dossiers. It is absent from these two rows' own dossiers, which list only ʻahā.

## batch-043

Batch 043 result: 6 keep, 9 keep-pending, 3 doubtful, 2 drop. Full records are in the written file.

Searches blocked: WebSearch could not be used at all. This session had already used its 200-search budget before this batch started, so nothing in this batch was checked by web search. Direct WebFetch and curl did work. I used them only for POLLEX entry pages (asi, kau-matua, kau-moana, kau-rima) and checked the notes in the raw HTML. I did not touch wehewehe, ulukau or the Wiktionary API. All other checks used the dossiers, the local Andrews OCR, the local POLLEX crawl and the local hawwiki dump. If the next batches need web corroboration, someone has to raise CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION.

Problems with the dossiers and data (worth fixing upstream):
1. ʻohiana is an OCR-repair artifact. The Andrews headword is "Ohina (o-hi'-na) [Ohi, to collect, and ana]". The extraction rewrote it to match the bracket. Its unglossed "ana" is the nominalizing suffix -na/ana, not ana "cave" or "measure". Its degree of 12 is spurious. Other "[X, …, and ana]" brackets with no gloss for ana are probably the same case and worth grepping for.
2. The pe_via_pollex check misses hyphenated POLLEX forms. POLLEX writes ʻaumoana as "ʔAu-moana" (Pukui & Elbert, "sailor"), but compounds.tsv leaves that row blank because the comparison ignores spaces and not hyphens. About 54 POLLEX Hawaiian forms contain hyphens.
3. Wiktionary's ʻau#0 merges two roots that POLLEX keeps apart: *kau.3 "wood, handle" (POc *kayu) and *kau.2 "group, company". ʻaulima uses the first, while ʻaumakua (*kau-matua) and, per POLLEX, ʻaumoana (*kau-moana) use the second. As one stone, ʻau#0 would link "fire stick" to "family god" on spelling alone. Recommend splitting it. ʻauwai's ʻau is also contested: Wiktionary says "swim", Andrews says "furrow".
4. Some dossier root glosses are missing the sense the compound uses. ʻoihana's ʻoi means "first, most excellent, best" (Andrews gives this in the same entry as "sharp"), but the dossier has only "sharp". ʻohākālai's oha "stick" is not listed for ʻohā at all.
5. ʻiliahi is a folk etymology as a compound with "fire". POLLEX files Pukui & Elbert's ʻiliahi under *asi "sandalwood" and marks the reflex ʔIli/ahi/, so its ahi is "sandalwood", not "fire". Watch for other Wiktionary "W" analyses that are folk etymologies.

Exclusion calls (for consistency across batches):
- ʻalohilani is dropped on sourced grounds. Andrews: "heavenly courts of the goddesses Uli and Kapo". Andrews defines uli as gods "worshiped by sorcerers" and Kapo as the sister of Kalaipahoa.
- ʻauwai is left unflagged, with a strong note. Andrews' Auwaihiki entry (a groin swelling "caused by impure habits") lists "he auwai" among names for the swelling. That is a passing mention, perhaps a different word, and P&E must clear it. Given its degree of 23, it is worth checking first.
- ʻike is left unflagged. Andrews gives it a sense "to have carnal knowledge of", the biblical euphemism. I treated it as not something a reader would wince at, and the project should make one ruling covering every ʻike compound.
I applied the same rule to all three: flag a word when a source gives it a §4.3 sense that a knowledgeable reader would recognise, and note obscure or euphemistic mentions without flagging. A stricter reading of §4.3 would flag ʻauwai and ʻikepili.

Patterns: ʻaulima, ʻaumakua, ʻaumoana and ʻilikai all have Proto-Polynesian compound ancestors in POLLEX. POLLEX compound protoforms are a strong second source that the "A*" rows do not use.

## batch-044

Batch 044: 20 candidates reviewed. 2 keep, 8 keep-pending, 6 doubtful, 4 drop. None has a pe_via_pollex value, and 18 of 20 are Andrews-only (A*).

Keeps:
- ʻukulele: Wiktionary and Andrews both give 'jumping flea'.
- ʻuala kahiki: a Wiktionary headword written as two words, so the candidate row's one-word spelling should be corrected.

Web search was unavailable: the session-wide WebSearch budget (200/200) was already used up before this batch ran. Not one search ran. I made two WebFetch lookups on Wehi ʻŌlelo (UH Hilo, not on the forbidden list, no bot challenge). Neither ʻōlelo paʻa nor ʻōhewa has an entry. Everything else rests on the dossier, the cached kaikki Wiktionary dump, the Andrews OCR text and the hawwiki dump in .cache. I opened no forbidden sites.

Pipeline problems found:
- ʻulakoko is an OCR-repair artifact. Andrews' headword is 'Ulaokoko' (u'-la-o-ko'-ko), i.e. ʻula o koko with a connective o, so as attested it is three parts.
- ʻokiana: Andrews' own Okana entry calls -ana 'a participial termination'. That makes it a grammatical suffix, not ana 'cave' or 'measure'. Its degree of 13 is spurious, and it would make false ANA links.
- ʻoleloa: loa is the intensive particle (Andrews says so; POLLEX has a separate *loa 'Intensive'), not loa 'long'. It is the free phrase ʻole loa.
- ʻōpūhao: root_b is mapped to hao 'Rauvolfia'. Andrews means hao 'any hard substance' (iron), i.e. hao#0.
- ʻouʻole: the first root is Andrews' ou 'to hide, flee', not the dossier's ʻou 'to reach out for'. Its spelling is unknown.
- ʻoiaʻiʻo: POLLEX derives ʻoia from *ko-ia, i.e. ʻo + ia (focus particle + pronoun), so the word is three morphemes with a grammatical first part.
- ʻōhewa: Wiktionary analyses it as the ʻō- simulative prefix + hewa, meaning 'drunk, incoherent'. Andrews reads ʻō 'pierce' + hewa, meaning 'stab and miss'. The sources conflict.
- OCR run-ins (the next headword's text glued onto the end of a definition) in ʻukupoʻo and ʻōpūhue.

Two ʻuku words and two kahiki words were given two-word forms by analogy with Wiktionary's ʻuku lio, ʻuku papa, ʻuku puaʻa and ʻuala kahiki, hala kahiki, niu kahiki. Those spellings are marked inferred.

Root-level flags (they affect other batches too):
1. KAPA: POLLEX (P&E-sourced) lists kapa 'Labia', and Andrews kapa n. 4 gives 'The labium of a female'. The automated screen missed it because Wiktionary omits it. I flagged ʻukukapa the same way batch-011 did (exclusion_flag true, keep-pending until the project rules on kapa).
2. LOA: Andrews Loa n. 2 'A receptacle of filth'. Worth one P&E look before alaloa and other loa words are finalised.
3. ʻŌPŪ: Wiktionary and POLLEX senses include 'womb' and 'bladder'. I treated these as anatomy, not genital or excretory, and noted it for a kumu to confirm.

Sensitivity notes:
- ʻōkoholā: whale-stabbing; koholā are held in regard.
- ʻōpūnui: body size, with a mocking example in Andrews.
- ʻōpūhao: a disease (dropsy).
- ʻōhewa: the headword's 'drunk' sense.

Highest-value P&E lookups: ʻōlelo paʻa (degree 18), ʻōpūao (9, pairs with naʻauao), ʻuku poʻo (8).

## batch-045

The batch holds 5 candidates, not about 20. All 5 are A*: none is in POLLEX, none is a Wiktionary headword, and none appears in Hawaiian Wikipedia under any spelling tried, including variants and two-word forms. So none can be 'keep'.

Web search could not be used. The session's WebSearch budget was already spent (200/200) before this batch started, so no web corroboration was gathered and web_sources is empty for every record. In its place I used the local caches: the Andrews–Parker OCR full text, kaikki Wiktionary, POLLEX hawaiian-reflexes.json and hawwiki.xml.

Findings that matter beyond this batch:
(1) Root mis-mapping in roots.tsv/compounds.tsv. Andrews' 'ohai, a kind of bush' was matched to Wiktionary ʻōhaʻi 'imperfectly healed'. The correct root is ʻōhai, the Sesbania tomentosa / monkeypod shrub: Andrews' Ohai entry gives that plant, and POLLEX (Pukui & Elbert 1986) spells it ʻōhai. roots.tsv already shows 'pe_via_pollex: differs: ʻōhai' for this root. Any other compound using the ʻōhaʻi root should be re-checked.
(2) The dossier's single 'hou' homograph merges two separate Proto-Polynesian roots, PPN *foqou 'new' and *fohu 'pierce/thrust', plus PCE *hou 'sweat'. The stone-identity rule needs hou¹/hou² split in the root glossary.
(3) Andrews' Oopalau (plow) entry says 'Called also oohao and oohou'. This corroborates both ʻōʻō plow words, but only within the same dictionary. Andrews gives ʻōʻō palau as the main plow word.
(4) ʻōʻōahi has competing etymologies inside Andrews: the noun is bracketed 'Oo, a spade', the verb 'O, to thrust'. The related headword 'Oahi … throwing fire' bears on the same question. Pukui & Elbert must settle whether the stone is ʻōʻō 'digging stick' at all.
(5) The dossier's 'andrews' field was empty for ʻūpāahi; the entry was read directly from the OCR text. Its second sense is sexual, so the word is dropped under DESIGN §4.3.
(6) ʻōpū's 'womb'/'bladder' senses are flagged in a sensitivity note only, not as an exclusion. They should be handled consistently across all ʻōpū compounds (ʻōpūnui, ʻōpūao, ʻōpūhue, ʻōpūhao).

