# Pōhaku Tumble: project-level decisions from the word review

Collated 2026-10-04 from the first-read notes of 46 batches (`reviewer_notes.md`), the 905 first-read records (`review/`), the blind second reading of 136 words (`second/`) and the 11 adjudicated rulings (`adjudicated/`). Nothing here has been checked against Pukui & Elbert, and nothing in this file changes DESIGN.md; each item is a question to be decided once, not word by word.

**Counts.** Word counts are over the 905 core candidate rows, with the adjudicated rulings applied. "Live" means a current verdict of keep or keep-pending (506 words: 166 keep, 340 keep-pending; also 211 doubtful and 188 drop). A few words exist only in the second reading because they are screened-out or non-core rows; they are marked `2nd`. Verdict tags after each word: K keep, KP keep-pending, D doubtful, X drop. The lists are rebuilt by `decisions-collator/lists.py`.

**Who decides.** *designer*: structure, data rules and the board. *kumu*: how a fluent reader hears a word or sense; these cannot be settled by sources. *either*: the designer can set a working rule now, and the kumu confirms it.

## At a glance

| id | decision | who | words (live) | recommendation in one line |
| --- | --- | --- | --- | --- |
| A1 | Does "any sense excludes" reach the root stones? | either | 171 (63) | Etymon plus a fluent reader's ear; Andrews-only senses are P&E gates; never print a sensitive sense. |
| A2 | HUA: fruit/egg (with "testicles") and word/letter | kumu | 20 (7) | Split hua 'fruit' from hua 'word' (*sua); keep both unless the kumu hears 'testicles' on HUA. |
| A3 | LĀʻAU: "male erection" inside the wood/stick entry | kumu | 15 (1) | Keep LĀʻAU; drop compounds whose reading invites the sense (lāʻau kū, lāʻau piʻi). |
| A4 | PIʻI: Wiktionary's vulgar sense | kumu | 5 (1) | Keep PIʻI unless P&E carries the vulgar sense; restore alapiʻi, kai piʻi. |
| A5 | KEʻA (and the unmarked KEA of Andrews) | kumu | 10 (2) | Drop KEʻA compounds (kumu may restore keʻa pua); KEA 'white' is clear. |
| A6 | KIKI / KIKĪ: Andrews' sexual verb sense | kumu | 4 (0) | P&E gate; if the sense is under kiki, restore paʻakikī. |
| A7 | LEPO: "dung; excrements" in Andrews | kumu | 6 (0) | P&E gate; keep LEPO 'dirt' if P&E has no excretory sense. |
| A8 | KAʻA: "to take effect as a cathartic" in Andrews | kumu | 17 (10) | Keep KAʻA: 'take effect (as medicine)' is not excretory. |
| A9 | LUA "pit": "toilet" in Wiktionary and in everyday Hawaiʻi English | kumu | 8 (2) | Keep pit, crater and grave words; no latrine words; change the §4.5 example. |
| A10 | HUNA: "private parts; kahi huna" under huna "hide" | kumu | 6 (4) | Clear huna 'crumb, spray' words (different etymon). |
| A11 | LUAʻI "vomit": excretory? | kumu | 3 (0) | Exclude luaʻi; nothing live lost. |
| A12 | PALA: excreta and syphilis | kumu | 6 (0) | Exclude PALA; keep the PALAPALA stone. |
| A13 | KAPA: "labia" | kumu | 4 (3) | Clear KAPA ('labia' is a separate etymon); never print it. |
| A14 | LEʻA: "orgasm" in Wiktionary | kumu | 4 (0) | Exclude LEʻA; nothing live lost. |
| A15 | MOE: a possible "sleep with" sense | kumu | 12 (8) | Keep MOE; check P&E's entry. |
| A16 | HEʻE "slide/flow" ("the menses") and NALU ("birth fluids") | kumu | 6 (3) | Keep heʻe and nalu; menses sense is a P&E gate. |
| A17 | Smaller single-source or euphemistic senses (one line each) | kumu | 55 (22) | Exclude kole, kapuahi, kiʻo; gate haʻi, puhi, kahe, amo; keep the rest; restore kamaʻāina. |
| B1 | Particles as stones (wale, -ana/-na, pū, mai, e, loa, kau, articles) | designer | 51 (4) | No particle is a stone. |
| B2 | The negator ʻole | either | 9 (0) | ʻOLE a stone ('without') in P&E headwords only, if the kumu agrees. |
| B3 | Formatives beyond hoʻo- (hā-, kō-/kī-, papa-, ʻō-, hō-, pō-, kā-) | designer | 25 (0) | Add hā-, kō-/kī-, papa-, ʻō-, hō-, pō-, kā- to the prefix list. |
| B4 | KŪ: "stand" or a stative/abrupt kū- formative | designer | 47 (24) | KŪ only where 'stand' is sourced; else unresolved, and drop if P&E has a kū- prefix. |
| B5 | KAU: five unrelated morphemes on one spelling | designer | 15 (8) | Separate KAU stones by etymon; plural particle is no stone. |
| B6 | A compound or derived word as one stone | designer | 42 (12) | One form per word: a stone may be a word only if it is not also a two-stone word and is opaque. |
| B7 | Reduplications | designer | 62 (24) | Whole-word reduplications out (change WAI·WAI); reduplicated stems may be one stone. |
| B8 | Homograph ids that merge unrelated roots, or miss a root | designer | 180 (104) | Stone identity by etymon (POLLEX/P&E), not Wiktionary grouping; add missing roots. |
| B9 | One etymon, divergent senses: link or not? | designer | 63 (42) | Link; give each word its own root gloss for the parts row. |
| B10 | Spelling versus sense: ʻALA in makaʻala, PŪNĀ in pūnāwai, PŌULI | designer | 11 (4) | P&E's spelling inside the compound is the stone; link on spelling and sense. |
| B11 | Stones too long for a 1.5-wide slab | designer | 47 (18) | Cap stones at 8 characters, condensed above 6. |
| B12 | Numerals with ʻa- and the weekday names | designer | 6 (2) | Admit ʻakahi … ʻaono as stones and all six weekday names. |
| C1 | Two-word compounds and the caption break | designer | 233 (132) | Admit two-word P&E entries; caption exactly as P&E. |
| C2 | Free phrases versus lexical items | either | 124 (49) | P&E headword or sub-entry required. |
| C3 | Opaque compounds and folk etymologies | designer | 72 (6) | Drop opaque words and folk-etymology splits. |
| C4 | 19th-century coinages for introduced things, and Bible-translation words | either | 133 (78) | Allow, unmarked, secular sense first; no scriptural names or doctrine words. |
| C5 | Modern coinages | either | 20 (16) | Allow established coinages; anilā only if the kumu approves. |
| C6 | Andrews-only words with no modern trace | designer | 199 (199) | Admit on P&E confirmation; prefer living words for the opening deal. |
| C7 | Near-synonyms | designer | 16 (16) | Keep; don't deal near-synonyms side by side. |
| D1 | Words that are also names of real people or places | kumu | 38 (18) | Out if mainly a name or if it names a person of rank; else common-noun caption only. |
| D2 | Star names (DESIGN §10 q3) | either | 8 (8) | Allow star names, nothing else. |
| D3 | Stones that spell a deity's name | kumu | 77 (47) | Keep as common nouns; never print the deity sense. |
| E1 | Death, burial, disease and disability words | kumu | 45 (38) | Keep with literal glosses; drop grim-only words; none as opening words. |
| E2 | Sacred, genealogical and religious words | kumu | 45 (40) | Keep with plain glosses; the kumu removes what doesn't belong in a game. |
| E3 | Insults about people, and war and violence | kumu | 35 (31) | Drop epithets for persons; keep paired character words and war words. |
| E4 | Political and land-history words | kumu | 20 (20) | Keep with neutral glosses chosen by the kumu. |
| F1 | Whose English: card glosses, banned words, and which sense leads | either | 304 (304) | Ship only P&E-based glosses; banned-word check in the build; living sense leads. |
| F2 | The "Lit." line: P&E only, or Andrews' brackets too? | designer | 356 (355) | Print a Lit. only from P&E. |
| F3 | Evidence policy for second-hand and borderline sources | designer | 55 (49) | P&E reproductions and Kaniʻāina count; decide bible.com; re-run web checks. |
| F4 | DESIGN's own examples that the review overturns | designer | 14 (13) | Revise §2 chains, §4.5 example; title plate waits on A2. |
| F5 | Field assignment and balance | designer | 75 (75) | Set field rules; let the deal weight fields. |

## A. What §4.3 excludes

### A1. Does "any sense excludes" reach the root stones?

**Question.** DESIGN §4.3 drops a word if any of its senses is sexual, genital, excretory or a slur. The review was briefed to apply that to every sense of either root as well. Should it? And if so, by spelling (every homograph that shares the letters), by etymon (only senses of the same root as the one used), or only where a fluent reader would actually hear it?

**Why it matters.** This one ruling moves more words than any other. 171 core rows (63 now keep or keep-pending) sit on a root with a recorded sensitive sense, and the batches applied the rule three different ways: some flagged at root level and held the word at doubtful (alapiʻi, halelāʻau), some dropped outright (lepohānai, paʻakikī), some left a note only (huamoa, kaʻapuni). Read strictly by spelling, it removes basic vocabulary (hua, lāʻau, lua 'pit', lepo, kaʻa) and the title-plate word huaʻōlelo. Read loosely, a reader who knows the other sense may wince, which is the reason §4.3 exists.

POLLEX (Pukui & Elbert-sourced) settles which senses share an etymon for most families: *fua 'fruit' and 'testicles' are sub-sets of one set (FUA.3A/3B), and hua 'word, letter' is a separate etymon (*sua); lāʻau's 'male erection' is in the same gloss as wood and stick (RAQA-KAU.B); pala 'ripe' and 'dab of excreta' share a set (PALA.1A/1C); keʻa 'dart' and 'virile male' share a set (TEKA.2A/2B), keʻa 'cross-piece' does not (TEKA.3); kapa 'labia' (TAPA.2) is separate from bark-cloth and edge (TAPA.1A/1C); nalu 'wave' (*galu) is separate from nalu 'amnion' (*ranu); huna 'crumb, particle' (*fuga) is separate from huna 'hidden' (*funa); wale 'only' (WALE.3) is separate from wale 'slime' (WALE.1); kahe 'flow' (*tafe) is separate from kahe 'circumcise' (*tefe).

**Options.**

1. Strict by spelling: any sense of any homograph with the same letters excludes every compound on that stone.
2. Strict by etymon: any sense under the same root (same POLLEX set, sub-senses A/B/C included) excludes; unrelated homographs (different etymon or different spelling) do not.
3. Etymon plus ear: exclude a root family when a sensitive sense belongs to the same etymon AND a fluent reader would readily hear it on the stone; separately exclude any compound whose literal reading invites the sense; never print a sensitive sense on any root card.
4. Compound only: apply §4.3 to the compound's own senses and leave roots alone.

**Recommendation.** Option 3, set now by the designer as the working rule, then confirmed family by family by the kumu (A2 to A17). Two supporting rules: a sense found only in Andrews–Parker (no Pukui & Elbert via POLLEX, no Wiktionary) is a gate for the P&E check, not an exclusion by itself; and the root glossary prints only the sense each compound uses, so no card ever shows the sensitive sense.

**Who decides.** either.

**Affected words (171; 63 live).** Full list in the appendix under A1.

### A2. HUA: fruit/egg (with "testicles") and word/letter

**Question.** Andrews–Parker lists 'testicle' inside its hua entry, and POLLEX gives Pukui & Elbert's hua 'testicles' as a sub-set of *fua 'fruit, egg'. Does that exclude the HUA (fruit/egg) stone? And is hua 'word, letter' (POLLEX: PPN *sua, a separate etymon) its own stone?

**Why it matters.** Batches 006/011/026/029/036 flagged hua at root level, batch-007 did not, and the second reader dropped huaʻōlelo and huahelu outright. The adjudicator ruled that no HUA compound can be 'keep' until one ruling is made. huaʻōlelo is the planned title-plate word.

Live today: hoʻokolohua (KP), hualiʻi (KP), huamele (KP), huamoa (K), huaʻai (KP), huaʻale (KP), huaʻōlelo (KP). Doubtful or dropped for other reasons as well: hualele (hernia), huahāʻule (illegitimate child), manawahua (diarrhoea), kaihua and paʻihua (wrong hua sense), huakaʻi (split unsupported).

**Options.**

1. Exempt hua entirely (the sense is secondary and no compound invites it).
2. Split hua¹ fruit/egg (*fua) from hua² word/letter (*sua); exempt hua², kumu rules on hua¹.
3. Drop every hua compound.

**Recommendation.** Option 2. The split is sourced (POLLEX) and the cards print each root's ancestor, so it is needed anyway. My reading, for the kumu to confirm: keep hua¹ too, since fruit/egg is its everyday sense and no listed compound invites the other reading. If the kumu rules hua¹ out, hua² still carries huaʻōlelo, huamele, huahelu.

**Who decides.** kumu / fluent reader.

**Affected words (20; 7 live).** hoʻokolohua (KP), huahāʻule (X), huakaʻi (D), hualele (X), hualili (D), hualiʻi (KP), hualole (D), huamele (KP), huamoa (K), huanoni (D), huaʻai (KP), huaʻale (KP), huaʻole (D), huaʻōlelo (KP), kaihua (D), luluhua (D), manawahua (X), paʻihua (X), pilihua (D), huahelu (2nd:X)

### A3. LĀʻAU: "male erection" inside the wood/stick entry

**Question.** POLLEX's Pukui & Elbert gloss for lāʻau (RAQA-KAU.B) runs 'wood, timber; stick … strength, rigidness, hardness, male erection'. Does the LĀʻAU stone go?

**Why it matters.** Every lāʻau compound (15) is flagged and 12 are held at doubtful only or mainly by this: halelāʻau, kumulāʻau and ululāʻau would otherwise be keeps. The automated screen missed it because it read only Wiktionary.

**Options.**

1. Keep the root; drop only compounds whose literal reading invites the sense.
2. Drop the whole family.
3. Keep all.

**Recommendation.** Option 1: lāʻau (tree, wood, medicine) is basic vocabulary and the sense is one item in a long gloss. Drop lāʻau piʻi (already dropped) and lāʻau kū 'standing wood'; ask the kumu to hear the other posture/motion pairs (lāʻau moe, lāʻau keʻa, papa lāʻau). The rest go back to keep/keep-pending on their own evidence.

**Who decides.** kumu / fluent reader.

**Affected words (15; 1 live).** halelāʻau (D), kualāʻau (D), kumulāʻau (D), kālāʻau (D), lālālāʻau (X), lāʻauala (D), lāʻaukeʻa (D), lāʻaukia (D), lāʻaukū (D), lāʻauluaʻi (D), lāʻaumoe (D), lāʻaupiʻi (X), papalāʻau (D), pālāʻau (D), ululāʻau (KP)

### A4. PIʻI: Wiktionary's vulgar sense

**Question.** Wiktionary's piʻi#0 lists 'to mount, to breed, to fuck' beside 'to climb, rise'. POLLEX's Pukui & Elbert form gives only 'climb, ascend'. Does the PIʻI stone go?

**Why it matters.** alapiʻi (two sources, attested, degree 10) and kai piʻi (P&E via POLLEX < PCE *tai-pii) are keeps on the language evidence and are held only by this.

**Options.**

1. Keep the root (sense is Wiktionary-only and colloquial).
2. Drop the family.
3. Hold until the P&E check shows whether P&E carries it.

**Recommendation.** Option 3, defaulting to keep: restore alapiʻi and kai piʻi if P&E's piʻi has no such sense. lāʻau piʻi stays dropped (both roots). piʻiana is a pipeline phantom (Andrews' Piina = piʻina, root + suffix) regardless.

**Who decides.** kumu / fluent reader.

**Affected words (5; 1 live).** alapiʻi (D), kaipiʻi (KP), lāʻaupiʻi (X), piʻiana (X), waipiʻi (D)

### A5. KEʻA (and the unmarked KEA of Andrews)

**Question.** Pukui & Elbert (via POLLEX) gives keʻa 'male animal reserved for breeding, virile male' < PEP *teka 'penis'; the 'dart' sense shares that set (TEKA.2A/2B) and the cross-piece sense does not (TEKA.3). Does KEʻA go? And does Andrews' unmarked kea 'male animal reserved for propagating' taint kea 'white' (PPN *tea)?

**Why it matters.** Batches disagreed: keʻapua and keʻahakahaka were dropped, olokeʻa and hōʻakakeʻa held doubtful, while koʻakea/kōkea/papakea were noted but not flagged.

**Options.**

1. Drop keʻa compounds; clear kea 'white' (different spelling and etymon).
2. Drop keʻa 'dart' words only; keep keʻa 'cross' words.
3. Keep all.

**Recommendation.** Option 1. The breeding sense is P&E's, and the dart game keʻa pua sits in the same etymon set. The kumu may restore keʻa pua (the Makahiki dart game) if they judge the other sense unheard. kea 'white' is a different stone (§4.4) and its Andrews homograph is P&E's keʻa, so kōkea and papakea are clear.

**Who decides.** kumu / fluent reader.

**Affected words (10; 2 live).** hōʻakakeʻa (D), keahakahaka (X), keʻapua (X), lāʻaukeʻa (D), olokeʻa (D), koʻakea (D), kōkea (KP), palakea (D), palapalakea (D), papakea (KP)

### A6. KIKI / KIKĪ: Andrews' sexual verb sense

**Question.** Andrews' verb kiki, sense 3, is sexual. P&E (via POLLEX) has kiki 'plug' (*titi) and kikī 'spurt' (*tii) as separate words. Does the sense reach kikī?

**Why it matters.** paʻakikī 'stubborn' is a common, well-used word (ʻŌlelo Online writes paʻakikī) and was dropped on this rule alone; the root's P&E spelling is kikī, not Wiktionary's kīkī.

**Options.**

1. Hold for P&E: if the sexual sense sits under kiki (short i), clear kikī.
2. Drop both spellings.

**Recommendation.** Option 1. If cleared, paʻakikī returns as keep-pending (spelling paʻakikī). olokiki, kikialo and paukikī stay dropped for other reasons (split unsupported, folk etymology).

**Who decides.** kumu / fluent reader.

**Affected words (4; 0 live).** kikialo (X), olokiki (X), paukikī (X), paʻakīkī (X)

### A7. LEPO: "dung; excrements" in Andrews

**Question.** Andrews' lepo sense 2 is 'dung; excrements'. POLLEX's Pukui & Elbert gloss is 'dirt, earth, ground; dirty, soiled'. Does LEPO go?

**Why it matters.** Batches split: halelepo, hunalepo, pālepo held doubtful; lepohānai, pōhakulepo, kiʻolepo dropped. hunalepo has two sources and modern use.

**Options.**

1. Gate on P&E: keep the root if P&E's lepo has no excretory sense.
2. Drop the family.

**Recommendation.** Option 1. If cleared, halelepo and hunalepo return to keep-pending on their own evidence; kiʻolepo stays dropped (kiʻo, below) and pōhakulepo stays dropped for being an introduced-object phrase.

**Who decides.** kumu / fluent reader.

**Affected words (6; 0 live).** halelepo (D), hunalepo (D), kiolepo (X), lepohānai (X), pālepo (D), pōhakulepo (X)

### A8. KAʻA: "to take effect as a cathartic" in Andrews

**Question.** Andrews kaa v. sense 5 is 'to take effect as a cathartic'; Wiktionary renders it neutrally as 'to take effect'. Is that excretory under §4.3?

**Why it matters.** 17 kaʻa words, 10 live (kaʻapuni, kaʻahele, kaʻawale, lolokaʻa, olokaʻa …). holokaʻa was excluded on it, kaʻapuni and olokaʻa only noted.

**Options.**

1. Keep: the sense is about a medicine taking effect, not excretion itself.
2. Drop the family.

**Recommendation.** Option 1. Re-judge holokaʻa on its other problem (probably a free phrase).

**Who decides.** kumu / fluent reader.

**Affected words (17; 10 live).** halekaʻa (KP), holokaʻa (X), hūkaʻa (D), kaʻahai (X), kaʻahale (KP), kaʻahele (K), kaʻakaua (KP), kaʻalalo (KP), kaʻalewa (D), kaʻaluna (KP), kaʻamaloʻo (D), kaʻaoki (D), kaʻapuni (K), kaʻawale (KP), lolokaʻa (KP), olokaʻa (KP), pōhakukaʻa (D)

### A9. LUA "pit": "toilet" in Wiktionary and in everyday Hawaiʻi English

**Question.** Wiktionary's lua#1 'pit, hole' also lists 'toilet', and 'lua' is the everyday word for a restroom in Hawaiʻi English. Does the LUA (pit) stone go? (lua#0 'two' is a separate etymon, PPN *rua, and is unaffected.)

**Why it matters.** Here a reader certainly may know the other sense, which is §4.3's own reason. The pit stone carries crater and grave words, including DESIGN §4.5's own example luapō and the core luapele.

**Options.**

1. Keep pit/crater/grave words; never admit a lua compound meaning a latrine.
2. Drop the pit family.
3. Keep, but don't use luapō as the design example.

**Recommendation.** Options 1 and 3: the pit sense is primary in Hawaiian (NPS and UH use lua and lua pele for crater/volcano), and halelua is already dropped. Swap DESIGN §4.5's example to a lua-free pair, since luapō also reads as death.

**Who decides.** kumu / fluent reader.

**Affected words (8; 2 live).** halelua (X), kōlua (D), luaahi (X), luahūnā (X), luapaʻahao (D), luapele (K), luapuhi (D), luapō (KP)

### A10. HUNA: "private parts; kahi huna" under huna "hide"

**Question.** Andrews lists 'the private parts; genitals; kahi huna' under huna 'to hide' (*funa). huna 'particle, crumb, spray' (*fuga, the dossier's huna#0) is a separate etymon. Which stones are affected?

**Why it matters.** The batches flagged hunakaua, hunawai and hunalepo though they use huna#0, but did not flag hunakai and lelehuna, which use the same huna#0. The sense also reads as a euphemism belonging to the phrase kahi huna.

**Options.**

1. Clear huna#0 words; judge the 'hide' stone separately.
2. Drop every HUNA stone.

**Recommendation.** Option 1: clear hunakaua, hunawai (and hunalepo, pending LEPO); luahūnā stays dropped. Separately note for the kumu that 'Huna' is also a New Age brand, which may make a HUNA stone read oddly.

**Who decides.** kumu / fluent reader.

**Affected words (6; 4 live).** hunakai (K), hunakaua (KP), hunalepo (D), hunawai (KP), lelehuna (K), luahūnā (X)

### A11. LUAʻI "vomit": excretory?

**Question.** luaʻi's main sense is 'vomit' (PNP *lua-ki). Does vomiting count as excretory under §4.3?

**Why it matters.** The batches treated it as excretory (lualuaʻi, luaʻikoko dropped; lāʻau luaʻi doubtful). It would also bar luaʻi pele 'eruption', a good ʻāina word not yet a candidate.

**Options.**

1. Exclude (bodily expulsion, and it is the root's main sense).
2. Allow; judge compounds on their own senses.

**Recommendation.** Option 1; nothing live is lost. The kumu may admit luaʻi pele if they hear it only as eruption.

**Who decides.** kumu / fluent reader.

**Affected words (3; 0 live).** lualuaʻi (X), luaʻikoko (X), lāʻauluaʻi (D)

### A12. PALA: excreta and syphilis

**Question.** Pukui & Elbert (via POLLEX) gives pala 'dab of excreta' in the same set as 'ripe, soft' (PALA.1A/1C), and 'form of syphilis' (PALA.3); Andrews has 'the syphilis'. Does the PALA stone go?

**Why it matters.** Five or six compounds use pala 'ripe, soft' (palakea at degree 9). The screen missed it because Wiktionary's pala sense list is only 'to smear'.

**Options.**

1. Drop the family.
2. Keep pala 'ripe' words.

**Recommendation.** Option 1 (nothing live is lost). The reduplicated stem palapala 'writing' is a different stone by spelling and stays (kiʻipalapala, pahupalapala, papapalapala).

**Who decides.** kumu / fluent reader.

**Affected words (6; 0 live).** palaholo (D), palakea (D), palalalo (X), palalauhala (D), palaloli (D), palaʻai (X)

### A13. KAPA: "labia"

**Question.** POLLEX gives Pukui & Elbert's kapa 'Labia' (PPN *tapa, TAPA.2) beside kapa 'bark-cloth' (TAPA.1A) and kapa 'edge' (TAPA.1C). Andrews has 'the labium of a female'. Do kapa compounds go?

**Why it matters.** kapakahi would be a plain keep but for this (batch-011); kapa komo and ʻukukapa are held the same way.

**Options.**

1. Clear (labia is a separate etymon); never print it on a card.
2. Drop the family.

**Recommendation.** Option 1, kumu to confirm. Correction to batch-011's note: POLLEX does not separate kapa 'edge' from kapa 'bark-cloth' (both are TAPA.1), so they need no separate stones on POLLEX grounds.

**Who decides.** kumu / fluent reader.

**Affected words (4; 3 live).** kapakahi (KP), kapakomo (KP), kapakuʻina (D), ʻukukapa (KP)

### A14. LEʻA: "orgasm" in Wiktionary

**Question.** Wiktionary's leʻa#0 includes 'orgasm' and Andrews 'sexual gratification'. leʻa 'thoroughly' (PCE *reka) is a different etymon. Does the LEʻA stone go?

**Why it matters.** The automated screen missed it in lauleʻa, moʻaleʻa and maʻaleʻa.

**Options.**

1. Drop the family.
2. Keep leʻa 'thoroughly' words.

**Recommendation.** Option 1: nothing live is lost; maʻaleʻa is in any case modern maʻalea (no leʻa).

**Who decides.** kumu / fluent reader.

**Affected words (4; 0 live).** lauleʻa (X), maʻaleʻa (D), moʻaleʻa (X), neneleʻa (X)

### A15. MOE: a possible "sleep with" sense

**Question.** No source in hand gives moe itself a sexual sense; Andrews' moe compounds do (moekolohe, moeipo), and reviewers suspect, without a source, that P&E's moe has one. Does MOE need a flag?

**Why it matters.** 12 moe words, 8 live (moeʻuhane, moehewa, aumoe …). Every batch repeated the note; none flagged.

**Options.**

1. Keep, with a P&E check of moe's entry.
2. Flag the family until checked.

**Recommendation.** Option 1. 'To die' and 'to marry' are not §4.3 senses. moekolohe itself is rightly screened out as a compound.

**Who decides.** kumu / fluent reader.

**Affected words (12; 8 live).** aumoe (KP), halemoe (KP), hikimoe (KP), hinamoe (X), kahimoe (D), kikomoe (KP), lāʻaumoe (D), mahamoe (D), moehewa (K), moeone (KP), moeʻino (KP), moeʻuhane (K)

### A16. HEʻE "slide/flow" ("the menses") and NALU ("birth fluids")

**Question.** Andrews lists 'the menses' under hee (heʻe#1 slide/flow); POLLEX's PEC *seke 'flow out: discharge from body' is the same set as 'slip, slide; surf'. nalu 'amnion' (*ranu) is a separate etymon from nalu 'wave' (*galu). Do heʻe#1 and nalu go?

**Why it matters.** heʻe nalu (surfing) and wahaheʻe are keeps; batch-040 asked for a policy, not a silent drop.

**Options.**

1. Keep both; gate heʻe#1 on P&E.
2. Drop heʻe#1 words.
3. Drop both families.

**Recommendation.** Option 1. nalu is cleared by etymon; the menses sense is Andrews-only, so it is a P&E gate, not an exclusion. heʻe#0 'octopus' is a separate stone.

**Who decides.** kumu / fluent reader.

**Affected words (6; 3 live).** heʻenalu (K), heʻewale (X), hukiheʻe (D), paluheʻe (D), wahaheʻe (K), heiheinalu (KP)

### A17. Smaller single-source or euphemistic senses (one line each)

**Question.** A set of roots each with one sensitive sense from a single source, a euphemism, or an unrelated homograph. Rule on each once.

**Why it matters.** Individually small, together they touch 55 words (22 live), and the batches handled them inconsistently.

| root | recommendation | why | words |
| --- | --- | --- | --- |
| kole | exclude | P&E gloss 'raw, red, inflamed', but the etymon is PPN *tole 'female genitals' and every cognate is genital (ʻōkole is the same etymon). | makakole (X), mūkole (X) |
| kiʻo | exclude unless P&E separates "pool" | POLLEX gives Pukui & Elbert's kiʻo only as 'excrete, evacuate' (< *tiko 'defecate'); Andrews' single kio entry has both 'pool' and 'excrement'. Decides kiʻowai (degree 23). | kioahi (X), kiolepo (X), kiowai (D) |
| loa | keep | Andrews-only 'a receptacle of filth' (loa n. 2); P&E via POLLEX: 'distant, long, tall'. | aholoa (KP), akeloa (KP), alaloa (K), anawaenaloa (X), hōkūloa (KP), kāmaʻaloa (KP), lololoa (X), noaloa (X), ʻoleloa (X) |
| noa | moot | Andrews 'a prostitute'; the only noa row (noaloa) is dropped anyway. | noaloa (X) |
| hai/haʻi | P&E gate | Andrews lists 'to act lasciviously' under unmarked hai (via hoohai); probably haʻi. Holds haipule. | haiao (D), haipule (KP), haipō (D), haiʻai (D), haʻiinoa (D), haʻiʻole (X), kaʻahai (X), punihai (D) |
| puhi | P&E gate | Andrews 'an uncut foreskin' under puhi; eel and blow are other homographs. | kuapuhi (X), luapuhi (D) |
| ʻike | keep | Andrews 'to have carnal knowledge of' is the biblical euphemism. | ʻikepili (K) |
| ʻōpū | keep | 'womb', 'bladder' are anatomy, not genital or excretory senses. | ʻōpūao (KP), ʻōpūhao (KP), ʻōpūhue (KP), ʻōpūnui (D), ʻōpūʻōhaʻi (X) |
| aʻa | keep | Wiktionary 'womb, offspring' is reproductive, not genital. | aʻahui (D), aʻakoko (KP), aʻalele (KP), aʻalolo (KP), paʻiaʻa (KP) |
| kapuahi | exclude | Andrews kapuahi n. 5 'the vagina' in the same entry; one low-value word. | kapuahihao (D) |
| hio/hiō | clear | The flatulence sense is hio (short vowels, Andrews hi'-o), a different spelling and stone from hiō 'lean'. | hanahiō (X), makahiō (D) |
| uli / mū / wili | keep, never print the sense | Uli as sorcerers' gods; mū as procurer of sacrificial victims; Andrews' phrase 'mai wili' (a venereal disease) belongs to the phrase, not to wili. | aouli (K), hoeuli (K), kaiuli (K), lauwili (KP), lelemū (X), mūakua (X), mūkole (X), nānāuli (KP), papamū (K), wilikī (X), wilipuaʻa (X), wiliʻau (KP) |
| māhu/māhū | keep-pending; prefer mokuahi | MĀHU and MĀHŪ are different stones, but mokumāhu sits close to a modern identity term; Andrews notes mokuahi as the commoner word. | mokumāhu (KP) |
| kahe, amo (second reader) | P&E gate | waikahe (kahe 'flow' with a menstruation sense; 'circumcise' is a separate etymon *tefe) and ʻauamo (Andrews amo 'anus; vagina'; P&E via POLLEX gives only 'carry on the shoulders') are strong words dropped on the strict rule. | waikahe (2nd:X), ʻauamo (2nd:X) |
| kulu, ipo (second reader) | moot | kūkulu is a reduplication by POLLEX and Wiktionary (not kū + kulu, whose Andrews senses include gonorrhoea); kuʻuipo is a possessive phrase or given name (ipo carries a sexual sense). Both stay out on other grounds. | kūkulu (2nd:X), kuʻuipo (2nd:X) |
| kama (second reader) | restore | kamaʻāina was screened out on a gloss-matching false positive ('kama: sex'); two sources, attested. | kamaʻāina (2nd:K) |

**Options.**

1. Apply the recommendation per root in the table.
2. Treat every listed sense as excluding.

**Recommendation.** Per the root table (A17 in DECISIONS.md): exclude kole, kapuahi and (unless P&E separates 'pool') kiʻo; gate haʻi, puhi, kahe, amo on P&E; keep loa, ʻike, ʻōpū, aʻa, uli, mū, wili; clear hio/hiō; restore kamaʻāina.

**Who decides.** kumu / fluent reader.

**Affected words (55; 22 live).** aholoa (KP), akeloa (KP), alaloa (K), anawaenaloa (X), aouli (K), aʻahui (D), aʻakoko (KP), aʻalele (KP), aʻalolo (KP), haiao (D), haipule (KP), haipō (D), haiʻai (D), hanahiō (X), haʻiinoa (D), haʻiʻole (X), hoeuli (K), hōkūloa (KP), kaiuli (K), kamaʻāina (2nd:K), kapuahihao (D), kaʻahai (X), kioahi (X), kiolepo (X), kiowai (D), kuapuhi (X), kuʻuipo (2nd:X), kāmaʻaloa (KP), kūkulu (2nd:X), lauwili (KP), lelemū (X), lololoa (X), luapuhi (D), makahiō (D), makakole (X), mokumāhu (KP), mūakua (X), mūkole (X), noaloa (X), nānāuli (KP), papamū (K), paʻiaʻa (KP), punihai (D), waikahe (2nd:X), wilikī (X), wilipuaʻa (X), wiliʻau (KP), ʻauamo (2nd:X), ʻikepili (K), ʻoleloa (X), ʻōpūao (KP), ʻōpūhao (KP), ʻōpūhue (KP), ʻōpūnui (D), ʻōpūʻōhaʻi (X)

## B. What a stone can be

### B1. Particles as stones (wale, -ana/-na, pū, mai, e, loa, kau, articles)

**Question.** Can a grammatical particle be a stone: postposed wale 'only, without cause', the nominaliser -ana/-na, pū 'together', directional mai and e, intensive loa, plural kau, articles and possessives ke/ko/he/kā-na?

**Why it matters.** These rows came in only because the matcher mapped a particle onto a content homograph (wale onto 'mucus', ana onto 'cave'/'measure', mai onto 'don't'), which also inflated their degrees (helewale 13–15, hikiana, ʻokiana 13, pahuana 12). A WALE stone would print 'mucus' on the card.

**Options.**

1. No particle is a stone; drop words whose only analysis has one.
2. Admit wale as a stone glossed 'only, freely' (with its own glossary line).

**Recommendation.** Option 1, consistent with dropping hoʻo-. Live words affected: kaʻawale and paʻapū (re-judge: if the particle reading is right they drop), hōkūloa (its Lit. may use intensive loa, which would unlink it from LOA 'long'), kauhale (if kau is the plural particle).

**Who decides.** designer.

**Affected words (51; 4 live).** hanawale (X), haowale (X), helewale (X), heʻewale (X), hikiana (X), hikiwale (X), holoholoana (X), hoʻoleiwale (X), huiana (X), hāʻawiana (X), hēʻahā (X), hōkūloa (KP), hūʻē (X), kahuana (X), kauamai (X), kauhale (KP), kaumokuʻāina (X), kauʻē (X), kaʻahai (X), kaʻawale (KP), kiʻekiʻeana (X), komowale (X), kuiana (X), kuliana (X), kuʻuʻē (D), kānā (X), kēhū (X), kēmau (X), kēʻō (X), kōiʻa (X), kōloko (X), lapuwale (D), lawewale (X), leleʻio (X), lololoa (X), mailuna (X), makewale (X), makeʻana (X), paepū (X), pahuana (X), palemai (X), paupū (X), paʻapū (KP), piʻiana (X), pāpaʻiwale (X), pūʻalu (X), uluwale (X), ūana (X), ʻohiana (X), ʻokiana (X), ʻoleloa (X)

### B2. The negator ʻole

**Question.** ʻole 'not, without, lacking' forms X-ʻole words (luaʻole 'unsurpassed', kahuaʻole 'baseless'). Is ʻOLE a stone, like 無 in Japanese jukugo, or grammatical?

**Why it matters.** Batches 004/007/009/010/026 all flagged ʻole as grammatical, pending a ruling. The family is small (9 rows, none live), so it would not become a hub the way hoʻo- did.

**Options.**

1. Grammatical: drop all X-ʻole words.
2. A stone glossed 'without, lacking', admitted only where P&E lists the X-ʻole word as a headword.

**Recommendation.** Option 2 if the kumu hears ʻole as a word rather than grammar (it behaves as a stative verb); luaʻole is the best card in the family. makaʻole stays dropped (its ʻole is Andrews' 'eye tooth'), and ʻoleloa is a free phrase.

**Who decides.** either.

**Affected words (9; 0 live).** hauʻole (D), haʻiʻole (X), huaʻole (D), hūʻole (D), kahuaʻole (X), luaʻole (D), makaʻole (X), ʻoleloa (X), ʻouʻole (D)

### B3. Formatives beyond hoʻo- (hā-, kō-/kī-, papa-, ʻō-, hō-, pō-, kā-)

**Question.** ROOTS.md step 5 treats pā-, kā-, pō-, haʻa-, hoʻo- as prefixes. Should hā-, kō-/kī- (PCE *too-/*tii-), distributive papa-, simulative ʻō-, hō- and qualitative pō- be added?

**Why it matters.** Rows built on them link by spelling to unrelated roots (hā 'four', kō 'sugar cane', kī 'ti', papa 'board', pō 'night'), and their parts rows would teach false etymologies (kōkala, hālana).

**Options.**

1. Add them all to the prefix list.
2. Judge each word.

**Recommendation.** Option 1. All are already doubtful or dropped; the point is that the builder stops generating them.

**Who decides.** designer.

**Affected words (25; 0 live).** hākui (X), hālana (X), hāneʻe (X), hāpale (D), hōʻoiaʻio (X), hōʻolemana (D), hōʻolepule (D), kāhea (2nd:X), kāmakamaka (2nd:X), kāwele (2nd:X), kīkipa (X), kīlua (X), kīʻōnaha (X), kōhanahana (X), kōkala (D), kōkolo (X), kōleʻaleʻa (X), kōwelo (X), papahā (X), papalua (D), papaone (X), papaʻakahi (D), pōloli (2nd:X), pōʻaha (2nd:X), ʻōhewa (D)

### B4. KŪ: "stand" or a stative/abrupt kū- formative

**Question.** Andrews glosses kū word by word as 'stand', 'to be', 'to be hit', 'pertaining to', 'reaching', or not at all; POLLEX has a separate kū 'abruptly, rudely' < *tuqu 'cut', and Pukui & Elbert may list a stative kū- (an English Wikipedia claim citing Ulukau, not counted). Which kū words get a KŪ stone?

**Why it matters.** 47 rows (24 live) with degrees of 39–46: a KŪ stone would tie much of the board together, and where the meaning is not 'stand' this repeats the hoʻo- problem. KŪ also spells the god Kū (see D3).

**Options.**

1. Admit KŪ only where 'stand, rise, stop' is sourced for the word; others 'unresolved' (no link) and, if P&E confirms a kū- prefix, dropped as prefix-built.
2. Admit all kū words on one stone.

**Recommendation.** Option 1. Live words now unresolved on kū: kūhewa, kūloko, kūlolo, kūmaka, kūʻau, kūʻauhau.

**Who decides.** designer.

**Affected words (47; 24 live).** helekū (KP), huhukū (D), iwikū (KP), kiʻikū (D), kūea (X), kūemi (KP), kūhao (D), kūhea (D), kūhepa (X), kūheu (X), kūhewa (KP), kūhihi (X), kūihu (X), kūkaha (KP), kūkahiki (X), kūkala (K), kūkapakahi (D), kūkapu (X), kūkaʻawale (D), kūkia (KP), kūkuli (D), kūlana (X), kūlehu (KP), kūlele (D), kūloko (KP), kūlolo (KP), kūlālā (KP), kūmaka (KP), kūnae (D), kūnihi (KP), kūnānā (KP), kūola (KP), kūpaʻa (K), kūpoepoe (D), kūpono (K), kūpua (X), kūpuni (KP), kūākea (D), kūʻai (KP), kūʻau (KP), kūʻauhau (KP), kūʻehu (D), kūʻē (K), kūʻēʻē (KP), lāʻaukū (D), momikū (X), pākū (K)

### B5. KAU: five unrelated morphemes on one spelling

**Question.** kau is 'place, hang' (PPN *tau.2), 'season' (*taqu.1), the plural particle (*taqu.2A), the number-group formative *tau- of kaulua/kaukahi/kaukolu, and 'cover an oven' (PN *tau). How many KAU stones, and does the group formative link?

**Why it matters.** 12 of batch-012's 20 rows start with kau; kaulua (double canoe) and kaukahi are high-value words held only by this.

**Options.**

1. Separate stones for place, season and group-of; the plural particle is not a stone; 'cover an oven' its own line.
2. One KAU stone.
3. Group-of words show no parts link.

**Recommendation.** Option 1, with the group-of stone only if P&E glosses it; otherwise option 3 for kaukahi/kaulua.

**Who decides.** designer.

**Affected words (15; 8 live).** hakakau (KP), kanikau (K), kauhale (KP), kaukahi (KP), kaukoko (D), kaukānāwai (K), kaulike (K), kauliʻiliʻi (D), kaulua (KP), kaumokuʻāina (X), kaumoʻo (D), kaupale (KP), kaupoʻohiwi (D), kaupākū (X), kauʻē (X)

### B6. A compound or derived word as one stone

**Question.** May a stone be a word that is itself two morphemes: an inherited compound (waiū, helekū, kūʻauhau, kūʻai, alakaʻi, heʻenalu, kapakahi, kaʻawale, paʻakai, lauhala, mokuʻāina, ahupuaʻa, makuahine), a prefixed word (kāhili, pāpale, pāʻele, kūkulu) or a hoʻo- verb (hoʻoluʻu, hoʻokolo, hoʻohala, hoʻolei, hoʻomana, hoʻomaha)?

**Why it matters.** Some of these words are also on the board as two-stone words, so one word would appear both as a single stone and as a pair. Three-part items (kai heʻe nalu, ahi ʻai honua, lau hala lana) cannot be two stones at all.

**Options.**

1. Never: one morpheme per stone; three-part items drop.
2. One form per word: a word may be a single stone only if it is not also dealt as a two-stone word and its parts are not transparent to a modern reader (moʻokūʻauhau's kūʻauhau, pāpale, kāhili, kūkulu); hoʻo- verbs allowed when P&E lists them with their own sense, linking only to identical stones.
3. Freely.

**Recommendation.** Option 2. Under it waiūpaʻa, kumukūʻai, kumualakaʻi and manuhelekū drop (waiū, kūʻai, alakaʻi, helekū are two-stone words themselves); moʻokūʻauhau, pāpale aliʻi and paʻa kāhili can stay; waihoʻoluʻu and hoʻokolohua depend on P&E's hoʻoluʻu and hoʻokolo entries.

**Who decides.** designer.

**Affected words (42; 12 live).** kumualakaʻi (KP), manuhelekū (KP), kūkuluhema (KP), kūkulupapa (KP), kūkulupāpaʻi (X), kumukūʻai (K), moʻokūʻauhau (K), lāhuikaua (KP), lāhuiʻāina (D), paʻakāhili (K), pāpalealiʻi (KP), pāpalelaʻa (D), waiūpaʻa (K), waiūhakuhaku (D), puʻuwaiū (D), keikiwaiū (X), kaiheʻenalu (X), kūlanaheʻenalu (D), kūlanahale (D), kūkapakahi (D), kūkaʻawale (D), anawaenaloa (X), kuamoʻoʻōlelo (D), kaumokuʻāina (X), luapaʻahao (D), moanapaʻakai (D), lauhalalana (D), palalauhala (D), ʻaiahupuaʻa (D), kaupākū (X), ʻoihanaaliʻi (X), pōʻaihapalua (X), kapuahihao (D), hoʻokolohua (KP), waihoʻoluʻu (K), hoʻoluʻuʻili (D), hoʻohalalā (D), hoʻoleiwale (X), hoʻomanakiʻi (X), puʻuhoʻomaha (D), kumuhoʻōla (D), ʻōlelomakuahine (2nd:D)

### B7. Reduplications

**Question.** (a) Is a word that is only a reduplication (waiwai, wehewehe, ʻehaʻeha, kōkolo, kūkuli, lololoa, lualuaʻi) a two-root word? (b) May a reduplicated stem be one stone (manamana, palapala, poepoe, ʻeleʻele, kiʻekiʻe, hakahaka, liʻiliʻi, ʻōpeʻapeʻa)?

**Why it matters.** DESIGN §2's own example WAI·WAI 'rich' is a reduplication of wai 'deposit' (PPN *qai), not water + water, and as two WAI stones it would link falsely to every water word. Reduplicated stems are lexical words in Wiktionary but never link to their base under §4.4.

**Options.**

1. (a) out; (b) allowed when the reduplicated form is a dictionary word, never linked to its base.
2. (a) out; (b) out.
3. Both allowed.

**Recommendation.** Option 1. Replace the WAI·WAI example in DESIGN §2. kūʻēʻē (keep-pending) needs P&E to say whether it is kū + ʻēʻē or a reduplicated kūʻē.

**Who decides.** designer.

**Affected words (62; 24 live).** waiwai (2nd:X), wehewehe (2nd:X), ʻehaʻeha (2nd:X), pupule (2nd:X), ʻākoakoa (2nd:X), kōkolo (X), kīkipa (X), kūkuli (D), lololoa (X), lualuaʻi (X), kūʻēkuene (X), wāwai (D), kūʻēʻē (KP), palapalakea (D), huʻahuʻanana (X), neneleʻa (X), ahuwaiwai (D), haomanamana (KP), heiheinalu (KP), holoholoana (X), hulipoepoe (K), kauliʻiliʻi (D), keahakahaka (X), kiʻekiʻeana (X), kiʻipalapala (KP), kiʻiʻoniʻoni (K), koʻokoʻohao (D), kuiʻēʻē (D), kōhanahana (X), kōleʻaleʻa (X), kūpoepoe (D), laukonakona (D), laumanamana (D), leleʻōpeʻapeʻa (KP), limaikaika (D), lunakiʻekiʻe (KP), makaaniani (K), makahakahaka (KP), manamanalima (K), manamananui (K), manamanawāwae (K), paepaepuka (KP), pahupalapala (KP), papamanamana (KP), papapalapala (KP), paʻapoepoe (KP), puniwaiwai (KP), puʻuʻulaʻula (X), pāleoleo (K), pūkonakona (KP), waikeʻokeʻo (X), wailenalena (X), waiwaipio (D), waiūhakuhaku (D), waiʻaleʻale (X), waiʻauʻau (KP), waiʻeleʻele (KP), ʻakahenehene (KP), ʻokipoepoe (X)

### B8. Homograph ids that merge unrelated roots, or miss a root

**Question.** Stone identity comes from Wiktionary's etymology grouping. Should it come from the etymon instead (POLLEX/P&E; sub-senses A/B/C of one set count as one root)?

**Why it matters.** Wiktionary lumps roots that POLLEX keeps apart and lacks others the compounds use, so stones would link across meanings and cards would print the wrong ancestor: lima 'five' (LIMA.A) vs 'hand' (LIMA.B); koa tree (*toa) vs brave (*toqa); hua fruit vs word (*sua); au current vs ʻau swim/handle/group (ʻau#0 merges *kau.4 handle with *kau.2 group); ao day vs cloud vs young pandanus leaf; kaha place vs cut vs soar; hou new vs pierce vs sweat; kua back vs chop vs anvil; moʻo lizard vs succession; laʻa sacred vs season; lau leaf vs breadth; kumu price/herd/handle; kahu keeper vs oven-tender; kuʻi pound vs join vs kui pin; kala gable; hū's merged entry; mahina vs mahi.

**Options.**

1. Etymon (POLLEX/P&E) defines a root; add missing roots to roots.tsv.
2. Keep Wiktionary's ids.

**Recommendation.** Option 1, with the P&E checker confirming each split. Until then, sense ids stay 'unresolved' wherever the sources disagree (the adjudicator's rule), so no false link is drawn. Do not split kapa edge/bark-cloth (one POLLEX set).

**Who decides.** designer.

**Affected words (180; 104 live).** Full list in the appendix under B8.

### B9. One etymon, divergent senses: link or not?

**Question.** moku (cut / island / ship: one *motu), make (die / want / faint: one *mate), ake (liver / desire: one *qate), lole (reverse / cloth), loko (pond / disposition), maka (eye / point; raw is a separate set MATA.2), kipa (visit / turn aside). Do these link?

**Why it matters.** Linking is correct under §2 (same root), but the parts row then needs a different gloss per word (MOKU 'ship' in mokukaua, 'island' in mokupuni), which the one-gloss-per-root glossary cannot hold.

**Options.**

1. Link; the word list carries the per-word root gloss for the parts row.
2. Split into separate stones by sense.

**Recommendation.** Option 1: it keeps the voyaging story (one root, many uses) honest. maka 'raw' (moʻamaka) is a different etymon and gets its own stone.

**Who decides.** designer.

**Affected words (63; 42 live).** akeakamai (K), akeloa (KP), akemāmā (K), halelole (KP), hoakipa (KP), holomoku (K), hualole (D), kahumoku (D), kinomake (D), komolole (D), kānemake (KP), kīkipa (X), kōloko (X), kūloko (KP), kūmaka (KP), kūʻēmaka (X), laulole (D), laumake (KP), laʻamake (KP), lokoliu (D), lokomaikaʻi (K), lokowai (K), lokoʻino (K), lolehana (KP), lolelau (D), lolelua (KP), makaala (K), makaaniani (K), makahakahaka (KP), makahema (D), makahiamoe (KP), makahiō (D), makakoa (K), makakole (X), makaluku (KP), makamomi (KP), makamua (K), makanahele (KP), makapaʻa (KP), makapouli (K), makapō (K), makawai (KP), makaʻole (X), makaʻākau (D), makehewa (KP), makewai (K), makewale (X), makeʻana (X), malumake (D), mokuhonua (K), mokukaua (K), mokulele (K), mokuluʻu (KP), mokumāhu (KP), mokupuni (K), mokuwāhi (D), mokuʻāina (K), moʻamaka (KP), moʻomake (D), palaimaka (KP), palemaka (KP), waimaka (K), ʻahamaka (D)

### B10. Spelling versus sense: ʻALA in makaʻala, PŪNĀ in pūnāwai, PŌULI

**Question.** §4.4 says differently spelled units never link; §2 says stones link by root in sense. When Pukui & Elbert spell a root differently inside a compound (makaʻala from *mata-qara has ʻala 'awake', not ala; pūnāwai has pūnā, not puna; makapōuli implies pōuli where roots.tsv has pouli), which wins?

**Why it matters.** makaʻala's degree of 17 was counted on ALA; pūnāwai (degree 21 as punawai) would link to nothing; the glossary spellings of pouli, mahele (māhele in modern use) and kīkī (P&E kikī) are wrong.

**Options.**

1. Spelling as P&E writes it is the stone; link only when spelling and sense both match; respell glossary lines to P&E.
2. Link by sense across spellings.

**Recommendation.** Option 1. It follows §4.4, and the card can still say 'ʻala = ala, awake'. Correct roots.tsv: pōuli, māhele, kikī; add ʻala 'fragrant' (lāʻau ʻala) and au 'current' (wiliau).

**Who decides.** designer.

**Affected words (11; 4 live).** makaala (K), makapouli (K), punawai (D), mahelelua (D), lāʻauala (D), wiliʻau (KP), paʻakīkī (X), auwaʻa (KP), auwaha (D), kālāʻau (D), pūnāwai (2nd:KP)

### B11. Stones too long for a 1.5-wide slab

**Question.** The slab is sized for a 4–5 letter root and longer roots are condensed. Where is the cut-off?

**Why it matters.** 33 stones have 8+ characters (47 rows, 18 live), mostly reduplications, hoʻo- verbs and compounds: ʻōpeʻapeʻa (10), mokuʻāina (9), manamana, palapala, kūʻauhau, hoʻoluʻu, hakahaka, kiʻekiʻe, ʻeleʻele. 49 stones have 7+ (67 rows, 26 live), including kānāwai (luna kānāwai, kumukānāwai).

**Options.**

1. Cap at 8 characters (ʻokina counted), condense above 6; ʻōpeʻapeʻa and mokuʻāina go as stones.
2. Cap at 7.
3. No cap; condense everything.

**Recommendation.** Option 1, checked by eye on a carved render of MANAMANA and KŪʻAUHAU first.

**Who decides.** designer.

**Affected words (47; 18 live).** anawaenaloa (X), haomanamana (KP), holoholoana (X), hoʻohalalā (D), hoʻokolohua (KP), hoʻoluʻuʻili (D), hoʻomanakiʻi (X), huʻahuʻanana (X), kahapoʻohiwi (D), kaiheʻenalu (X), kauliʻiliʻi (D), kaumokuʻāina (X), kaupoʻohiwi (D), keahakahaka (X), kiʻekiʻeana (X), kiʻipalapala (KP), kiʻiʻoniʻoni (K), koʻokoʻohao (D), kōhanahana (X), kōleʻaleʻa (X), kūkapakahi (D), kūkaʻawale (D), kūlanaheʻenalu (D), laukonakona (D), laumanamana (D), leleʻōpeʻapeʻa (KP), lunakiʻekiʻe (KP), makahakahaka (KP), manamanalima (K), manamananui (K), manamanawāwae (K), moʻokūʻauhau (K), pahupalapala (KP), palapalakea (D), papamanamana (KP), papapalapala (KP), puʻuhoʻomaha (D), puʻuʻulaʻula (X), pūkonakona (KP), waihoʻoluʻu (K), waikeʻokeʻo (X), wailenalena (X), waiūhakuhaku (D), waiʻaleʻale (X), waiʻeleʻele (KP), ʻaiahupuaʻa (D), ʻakahenehene (KP)

### B12. Numerals with ʻa- and the weekday names

**Question.** pōʻaono is a keep as pō·ʻaono, but its siblings came in as phantoms (pōkahi, pōkolu, pōlima for Andrews' Poakahi, Poakolu, Poalima = Pōʻakahi …). Are ʻakahi … ʻaono single stones, and do the six day names (an introduced week) count?

**Why it matters.** Consistency: ʻaono is admitted as a root although it is ʻa- + ono; the day names are 19th-century coinages, capitalised in Wiktionary, but not names of persons or places.

**Options.**

1. Admit ʻakahi … ʻaono as numeral stones and all six day names.
2. Drop the day names (and pōʻaono) as calendar names.
3. Admit only pōʻaono.

**Recommendation.** Option 1: the family links cleanly on PŌ and gives the numbers a second home (ʻahālike, papaʻakahi). Captions lowercase per §4.4 unless the kumu prefers the capital.

**Who decides.** designer.

**Affected words (6; 2 live).** pōʻaono (K), pōkahi (X), pōkolu (X), pōlima (X), papaʻakahi (D), ʻahālike (KP)

## C. Which words count

### C1. Two-word compounds and the caption break

**Question.** Admit compounds Pukui & Elbert writes as two words, and how to caption words the sources write both ways?

**Why it matters.** 233 rows carry a two-word form (132 live). Among live words the break is '1' for 173, '2' for 99, 'either' for 38 and 'unknown' for 196. Andrews joined many words modern spelling splits (wai puna, maka mua, pale kai, lau hala, lehu ahi, pōhaku paʻa).

**Options.**

1. Admit; caption exactly as P&E's headword; an unchecked or 'either' word is not dealt until P&E sets it.
2. Single words only.

**Recommendation.** Option 1 (ROOTS.md already recommends admitting them). 'either' live words: alaloa, alawai, aliʻiwahine, hakamoa, hakuone, hakuwahine, halemākaʻi, holoʻai, huaʻai, huaʻōlelo, hueʻili, hōkūlele, hōkūʻaeʻa, kahaone, kahuahale, kahuʻāina, kiaahi, kiaao, kinowailua, kiʻiʻoniʻoni, kuhihewa, kuʻihao, kuʻiʻai, kōʻula, lauhala, lolouila, luapele, lunakoa, mahiʻai, makuakāne, moamahi, panapua, papaʻaina, paʻiʻai, puakala, ululāʻau, waikai, waiʻeleʻele.

**Who decides.** designer.

**Affected words (233; 132 live).** Full list in the appendix under C1.

### C2. Free phrases versus lexical items

**Question.** Which noun + modifier, verb + object and productive patterns count as words: hua + plant (hua noni), lau + plant (lau kī, lau kō), wai + fruit/colour, mea + verb, noho + state, puni + noun, puka + noun, papa + numeral, hoe waʻa / holo lio / kuʻi ʻai / kālai pōhaku, and Bible translators' phrases (moʻo nui, moʻo make, manu huhū, malu make)?

**Why it matters.** Andrews fused many phrases into headwords. Admitting one admits a whole productive class (and a MEA or NOHO stone would over-link like hoʻo-).

**Options.**

1. A P&E headword or sub-entry (or a Māmaka Kaiao entry) is required; otherwise out.
2. Admit transparent phrases with modern use.

**Recommendation.** Option 1. Excluding mea + X and noho + state as classes saves P&E time.

**Who decides.** either.

**Affected words (124; 49 live).** Full list in the appendix under C2.

### C3. Opaque compounds and folk etymologies

**Question.** What happens to words whose split is real but whose parts don't add up (kūlolo, kahahānai with kaha 'knot' + hānai 'calabash strings'), and to words whose two-root split is a folk etymology (lāhui < *lafu, moʻopuna < *makupuna, luahine < *nuafine, ʻiliahi with ahi 'sandalwood', uahi, kūlana with suffix -lana)?

**Why it matters.** The tumble's meaning comes from the parts row. An opaque parts row reads as nonsense; a folk-etymology parts row teaches something false on a card that prints the ancestor.

**Options.**

1. Drop opaque words; folk-etymology words are not compounds (their true single root may become a stone).
2. Show opaque words without a parts row.
3. Keep with the folk parts.

**Recommendation.** Option 1. 'Partial' transparency (114 live) is acceptable only with a P&E Lit. reading.

**Who decides.** designer.

**Affected words (72; 6 live).** auwā (X), hakakē (D), hakuone (KP), haupia (KP), haʻiʻole (X), huiana (X), hāpale (D), hōʻoiaʻio (X), hūhonua (D), hūpē (2nd:X), hūʻalu (D), hūʻē (X), kahahānai (KP), kahuana (X), kalaau (X), kaupākū (X), kauʻē (X), kaʻahai (X), keahakahaka (X), kikialo (X), koawā (X), kualono (D), kuiana (X), kuʻikē (X), kānā (X), kēhū (X), kēmau (X), kēʻō (X), kīlua (X), kōiʻa (X), kōʻieʻie (X), kūhepa (X), kūkuli (D), kūlana (X), kūlolo (KP), kūʻai (KP), kūʻēkuene (X), laulele (D), lololoa (X), lonohiʻi (X), luahine (2nd:X), lualuaʻi (X), luawahine (X), lāhui (X), mahamoe (D), makahiki (2nd:D), makaʻole (X), makaʻāinana (2nd:D), makeʻana (X), malihini (2nd:X), manuheu (X), maʻaʻula (X), mikiʻaiā (X), moawī (D), moʻopuna (D), olokiki (X), palapalakea (D), papahā (X), paukē (X), pokeʻina (D), pāpaʻiwale (X), pōloli (2nd:X), uahi (2nd:X), waihā (D), wilipuaʻa (X), wāwai (D), ūahi (X), ūʻaiā (X), ʻahamaka (D), ʻiliahi (D), ʻukulele (K), ʻumeke (2nd:X)

### C4. 19th-century coinages for introduced things, and Bible-translation words

**Question.** Are coinages such as alahao (railway), mokukaua (warship), kōpaʻa (sugar), ʻukulele, oneʻā (gunpowder), and Bible-translation words such as halelana (the ark), lunaʻōlelo (apostle), moʻolele (flying serpent), kia ahi / kia ao allowed, and marked?

**Why it matters.** 113 rows are rated 19th-century coinages (65 live); 39 rows are described as Bible-translation words or phrases (19 live). ROOTS.md notes they sit differently on cards whose quiet subject is words that crossed the Pacific.

**Options.**

1. Allow, unmarked; lead with the secular sense; exclude scriptural names and doctrine words; translators' phrases need P&E (C2).
2. Allow but mark the register on the card.
3. Exclude.

**Recommendation.** Option 1: they are Hawaiian as Hawaiians wrote it. Already out: kahikolu (Trinity), kumuhou (Holy Spirit), ʻoihanaaliʻi (Chronicles), ʻokipoepoe (circumcision coinage).

**Who decides.** either.

**Affected words (133; 78 live).** Full list in the appendix under C4.

### C5. Modern coinages

**Question.** Are 20th-century coinages allowed (kinoea, kinowai, kinopaʻa, mokulele, lolouila, ʻikepili, kiʻiʻoniʻoni, hōkūnaʻi, pāleoleo), and what about contested ones (anilā)?

**Why it matters.** DESIGN §10 q7 leaves it open. One coinage, anilā, is publicly opposed by a kumu (Ka ʻAlalā) as made to fit English thinking.

**Options.**

1. Allow those in established use, unmarked; drop contested ones unless the kumu approves.
2. Mark as modern.
3. Exclude.

**Recommendation.** Option 1; anilā out unless the kumu approves it.

**Who decides.** either.

**Affected words (20; 16 live).** ahimakani (D), anamanaʻo (K), anilā (KP), hoʻokolohua (KP), hōkūnaʻi (K), kahuapaʻa (D), kaumokuʻāina (X), kinoea (K), kinopaʻa (K), kinowai (K), kiʻiʻoniʻoni (K), lolouila (K), manuhelekū (KP), mokuhonua (K), mokulele (K), mokuluʻu (KP), monakō (KP), pāleoleo (K), waiūhakuhaku (D), ʻikepili (K)

### C6. Andrews-only words with no modern trace

**Question.** Should a word attested only in Andrews–Parker (A*) be admitted once P&E confirms it, even with no modern use found? And should archaic words be dealt as opening words?

**Why it matters.** 403 live words are A*; 193 have no Hawaiian Wikipedia use and no web source (web search was exhausted for most batches); 31 live words are rated archaic/obscure. ROOTS.md's board needs ~600 confirmed words, so excluding them would sink option B.

**Options.**

1. Admit on P&E confirmation; prefer living words for the opening deal.
2. Require modern use as well.

**Recommendation.** Option 1.

**Who decides.** designer.

**Affected words (199; 199 live).** Full list in the appendix under C6.

### C7. Near-synonyms

**Question.** Several families hold near-duplicates (hoakaua / hoakoa / hoapaio; hoahānau / hoahanauna; halelewa / halelole; three bridle words; four papa furniture words). Keep all?

**Why it matters.** Turns between near-synonyms can feel samey, though each still teaches its roots.

**Options.**

1. Keep all; the deal avoids placing near-synonyms side by side.
2. Keep one per sense.

**Recommendation.** Option 1. Low priority.

**Who decides.** designer.

**Affected words (16; 16 live).** hoakaua (KP), hoakoa (KP), hoapaio (K), hoahānau (K), hoahanauna (KP), halelewa (KP), halelole (KP), haowaha (KP), kaulawaha (KP), paʻawaha (KP), papaʻaina (KP), papapāʻina (KP), papapalapala (KP), papapōhaku (KP), lunakaua (KP), lunakoa (KP)

## D. Names

### D1. Words that are also names of real people or places

**Question.** §4.3 drops words that are mainly proper names. What about common words whose dominant modern referent is a person or place (Pauahi; the Ala Wai; Waipahu; Kalaupapa behind laupapa; hiʻilani as a given name)?

**Why it matters.** A gloss printed under a person's name reads as glossing that person: 'destruction by fire' under Pauahi, the name of Ke Aliʻi Bernice Pauahi Bishop, is the clearest case.

**Options.**

1. Mainly a name: out. A word whose main modern referent is a person of rank or a named ancestor: out even if a common sense exists. Common noun primary: keep, captioned as the common noun only.
2. Out whenever a name exists.

**Recommendation.** Option 1. The kumu should judge alawai, hiʻilani and laupapa; already out: pauahi, waipahu, waiʻaleʻale, wailenalena, puʻuʻulaʻula, luaahi, noaloa, kahikolu, kumuhou, kumulipo, ʻalohilani, ʻoihanaaliʻi, hinamoe, waiau, kanakaole, moanaliha, kūwili, hoapili, kuʻuipo.

**Who decides.** kumu / fluent reader.

**Affected words (38; 18 live).** alawai (KP), alaʻula (KP), halealiʻi (K), hinamoe (X), hiʻilani (KP), hoapili (2nd:KP), kahikolu (X), kahuʻāina (KP), kanakaole (2nd:X), kaulua (KP), kumuhou (X), kumulipo (X), kuʻuipo (2nd:X), kāala (D), kōʻula (KP), kūwili (2nd:X), laupapa (KP), leialiʻi (KP), luaahi (X), makawai (KP), moanaliha (2nd:X), mokuhonua (K), noaloa (X), pauahi (X), paʻahana (K), paʻaluhi (KP), pipiwai (KP), puʻukoko (KP), puʻuone (K), puʻuʻulaʻula (X), uluwehi (K), waiau (D), wailele (K), wailenalena (X), waipahu (X), waiʻaleʻale (X), ʻalohilani (X), ʻoihanaaliʻi (X)

### D2. Star names (DESIGN §10 q3)

**Question.** Allow star and planet names as the one class of proper noun?

**Why it matters.** hōkūloa and hōkūao are flagged only on this; hōkūhele, hōkūlele, hōkūnaʻi, hōkū ʻaeʻa are common nouns; kaulua is also a star and month name.

**Options.**

1. Allow star names, nothing else (DESIGN's proposal).
2. No proper nouns.

**Recommendation.** Option 1. Settle hōkūloa's Lit. ('great star' or 'long-staying star') before linking its LOA.

**Who decides.** either.

**Affected words (8; 8 live).** hōkūloa (KP), hōkūao (KP), hōkūhele (K), hōkūlele (KP), hōkūnaʻi (K), hōkūʻaeʻa (K), kaulua (KP), pōʻailani (K)

### D3. Stones that spell a deity's name

**Question.** KŪ, KĀNE, HINA, PELE, PAPA and ULI are common nouns that also spell deities' names (Kū, Kāne, Hina, Pele, Papa, Uli). Are they fine as common nouns?

**Why it matters.** §4.3 allows a common noun that shares a deity's name. But the root glossary for these stones has the deity sense in its sources, and a few compounds read toward the deity (kiʻi kū 'image of Kū'; alaʻula as 'ke alaula a Kāne'; luapele tied to Pele).

**Options.**

1. Keep as common nouns; the glossary never prints the deity sense; the kumu hears compounds that lean toward the deity.
2. Avoid those stones.

**Recommendation.** Option 1.

**Who decides.** kumu / fluent reader.

**Affected words (77; 47 live).** aouli (K), helekū (KP), hinamoe (X), hoeuli (K), huhukū (D), iwikū (KP), kaiuli (K), keikikāne (K), keikipapa (KP), kiʻikū (D), kuapapa (KP), kānemake (KP), kūea (X), kūemi (KP), kūhao (D), kūhea (D), kūhepa (X), kūheu (X), kūhewa (KP), kūhihi (X), kūihu (X), kūkaha (KP), kūkahiki (X), kūkala (K), kūkapakahi (D), kūkapu (X), kūkaʻawale (D), kūkia (KP), kūkuli (D), kūkulupapa (KP), kūlana (X), kūlehu (KP), kūlele (D), kūloko (KP), kūlolo (KP), kūlālā (KP), kūmaka (KP), kūnae (D), kūnihi (KP), kūnānā (KP), kūola (KP), kūpaʻa (K), kūpoepoe (D), kūpono (K), kūpua (X), kūpuni (KP), kūākea (D), kūʻai (KP), kūʻau (KP), kūʻauhau (KP), kūʻehu (D), kūʻē (K), kūʻēʻē (KP), laupapa (KP), luapele (K), lāʻaukū (D), makuakāne (K), momikū (X), nānāuli (KP), papahola (KP), papahā (X), papakea (KP), papakoa (D), papalalo (KP), papalua (D), papalāʻau (D), papamanamana (KP), papamū (K), papaone (X), papapalapala (KP), papapāʻina (KP), papapōhaku (KP), papawaena (KP), papaʻaina (KP), papaʻakahi (D), poʻohina (KP), pākū (K)

## E. Tone: sensitive but not excluded

### E1. Death, burial, disease and disability words

**Question.** Words about death and the dead (luapō, kanikau, kinowailua, iwipona), illness (laupapa / Kalaupapa, wailana 'to banish' in its living sense, ʻōpūhao, puʻu- swellings) and disability (makapō, makapaʻa, leopaʻa, kuapuʻu) are not §4.3 exclusions. Keep them, and how?

**Why it matters.** The piece is warm but stoic: these are part of the language, but Andrews' figurative senses equate blindness with ignorance, and some words have only grim senses (lelepali, suicide).

**Options.**

1. Keep with literal, plain glosses; never figurative senses about disability; words with only a grim sense out; none as opening words.
2. Drop the categories.
3. Keep all unmarked.

**Recommendation.** Option 1, word by word with the kumu.

**Who decides.** kumu / fluent reader.

**Affected words (45; 38 live).** luapō (KP), kānemake (KP), laumake (KP), laʻamake (KP), kinowailua (KP), kinomake (D), kinoakalau (D), kanikau (K), iwipona (KP), iwikū (KP), poʻokepa (KP), leihala (K), paʻakāhili (K), kaieʻe (K), lelepono (KP), lelepali (D), pōʻele (K), kulihiamoe (KP), makahiamoe (KP), pauaho (K), moeʻuhane (K), holowaʻa (KP), malumake (D), moʻomake (D), laweola (KP), laupapa (KP), wailana (KP), ʻōpūhao (KP), hanupaʻa (KP), lolokaʻa (KP), makamomi (KP), puʻukoko (KP), puʻulele (D), puʻupau (D), kūhewa (KP), ʻohākulaʻi (KP), hāipu (KP), makapō (K), makapaʻa (KP), leopaʻa (KP), kuapuʻu (K), hāliʻikuli (KP), aʻalolo (KP), kūlolo (KP), lolouila (K)

### E2. Sacred, genealogical and religious words

**Question.** ʻaumakua, moʻokūʻauhau, kiʻi words, heiau rites (waiea, waihā, pīkai, komohale), kapu words and Christian vocabulary (lunakahiko, lunaʻōlelo, kalahala). Which belong in a played piece?

**Why it matters.** DESIGN §8 already leaves out sacred chant text and deity imagery; Andrews frames many of these in missionary English ('idol', 'holy water').

**Options.**

1. Keep with plain glosses; the kumu removes any they would not see in a game; never Andrews' framing.
2. Drop the sacred class.

**Recommendation.** Option 1, with the kumu likely to remove waiea, waihā, pīkai and kahuakua.

**Who decides.** kumu / fluent reader.

**Affected words (45; 40 live).** ʻaumakua (K), moʻokūʻauhau (K), moʻoaliʻi (KP), moʻokupuna (KP), moʻokanaka (KP), kūʻauhau (KP), moʻoakua (D), kiʻikālai (KP), kiʻipōhaku (K), kiʻipalapala (KP), kiʻikū (D), komohale (KP), waiea (KP), waihā (D), pīkai (KP), kahuakua (KP), haipule (KP), halepule (K), halepahu (D), halehau (D), hanamana (K), huikala (K), kēʻai (KP), pahukapu (KP), papahola (KP), ʻaikapu (K), ʻahuʻula (K), kumupaʻa (K), aumiki (K), kalahala (KP), lawehala (K), lokomaikaʻi (K), manaʻoʻiʻo (K), manaʻolana (K), lunakahiko (K), lunaʻōlelo (K), lunakiaʻi (KP), makualiʻi (KP), kuapapa (KP), poʻoʻōlelo (KP), kiaahi (KP), kiaao (KP), moʻolele (KP), kuamauna (KP), luapele (K)

### E3. Insults about people, and war and violence

**Question.** Words whose card sense is a put-down of a person (punikoko, wahapaʻa, kualana, kuanui, puniwaiwai, ʻakahenehene, naʻaupō as 'ignoramus') and words of war (makaluku 'slaughter', lāhui kaua, mokukaua).

**Why it matters.** Pairs like lokoʻino / lokomaikaʻi and naʻaupō / naʻauao teach well; an epithet aimed at a person sits against the tone.

**Options.**

1. Drop epithets for persons; keep character words that pair as opposites with plain glosses; keep war words but not as opening words.
2. Keep all.
3. Drop all.

**Recommendation.** Option 1.

**Who decides.** kumu / fluent reader.

**Affected words (35; 31 live).** punikoko (KP), wahapaʻa (KP), wahahewa (KP), wahaheʻe (K), wahapuʻu (D), kualana (KP), kuanui (KP), kuaʻāina (K), naʻaupō (K), manawaʻino (KP), puniwaiwai (KP), punihai (D), ʻakahenehene (KP), hakuʻōlelo (KP), palaimaka (KP), panipuka (KP), ʻaialo (KP), hualiʻi (KP), kanakamakua (KP), mokumāhu (KP), huaʻole (D), ʻōpūnui (D), makaluku (KP), lāhuikaua (KP), hoakaua (KP), hunakaua (KP), kaʻakaua (KP), mokukaua (K), palekaua (KP), puʻukaua (KP), halekaua (KP), lunakaua (KP), lunakoa (KP), oneʻā (KP), panipū (KP)

### E4. Political and land-history words

**Question.** mokuʻāina (now 'US state'), kiaʻāina (the governor), kūʻē (the 1897 petitions), kūpaʻa, hoaʻāina and anaʻāina (the Māhele), aliʻi regalia and the throne (tied to 1893), the Ala Wai, the plantation luna.

**Why it matters.** These carry real weight for Hawaiian readers. None is excluded, but a careless gloss takes a side.

**Options.**

1. Keep with neutral glosses chosen by the kumu (mokuʻāina leads with 'island; district').
2. Avoid the class.

**Recommendation.** Option 1.

**Who decides.** kumu / fluent reader.

**Affected words (20; 20 live).** mokuʻāina (K), kiaʻāina (K), kūʻē (K), kūpaʻa (K), hoaʻāina (K), anaʻāina (KP), komoʻāina (KP), kālaiʻāina (K), kuʻikahi (K), nohoaliʻi (K), halealiʻi (K), pāpalealiʻi (KP), aliʻiwahine (KP), alawai (KP), alahao (K), lunahana (K), hakuʻāina (KP), hakuone (KP), kinoea (K), kuapaʻa (KP)

## F. Cards, sources and the design text

### F1. Whose English: card glosses, banned words, and which sense leads

**Question.** 304 live words have a gloss that rests on Andrews–Parker alone. May a card ship an Andrews gloss? And when the living sense differs from the literal or older one (wailana 'calm water' vs 'banish'; hoakaua 'fellow soldier' vs 'adversary'; kuapapa 'plank' vs 'peace'; mokuʻāina; lunakahiko), which leads?

**Why it matters.** Andrews' 1922 English includes words that must never reach a card: 'idol', 'heathen', 'holy water', 'astrologer', 'mistress' (for hakuwahine), 'dumb', 'a negro', 'a black-skinned person', 'darkness' for ignorance, 'hell' for Kīlauea.

**Options.**

1. Glosses paraphrase P&E once checked; Andrews glosses are placeholders, never shipped; a banned-word list is checked by the build; the living sense leads, and where the living sense is sensitive the kumu decides.
2. Ship Andrews glosses reworded.

**Recommendation.** Option 1. Sense conflicts to settle: wailana, hoakaua, kuapapa, kuamauna, lelehuna, lauhoe, mokuʻāina, lunakahiko, lunaʻōlelo, hakuwahine, kūʻauhau, makapō, naʻaupō, hōkūloa, aumoe.

**Who decides.** either.

**Affected words (304; 304 live).** Full list in the appendix under F1.

### F2. The "Lit." line: P&E only, or Andrews' brackets too?

**Question.** 347 live words have a literal reading from Andrews' bracket alone; 8 have one composed from the root glosses; 28 cite a P&E-derived source. Which can be printed?

**Why it matters.** Some Andrews brackets are 19th-century guesses ('Po, intensive', 'au, furrow', 'haka, open'). A composed Lit. is the reviewer's English, not a source.

**Options.**

1. Print a Lit. only from P&E (or POLLEX citing P&E); otherwise the parts row (two root glosses) stands alone.
2. Allow Andrews' brackets where P&E is silent.

**Recommendation.** Option 1.

**Who decides.** designer.

**Affected words (356; 355 live).** Full list in the appendix under F2.

### F3. Evidence policy for second-hand and borderline sources

**Question.** Do UH-hosted reproductions of Pukui & Elbert entries (Kaliko High's SOEST weather list, the HIGP stone-word list, the KSBE 1980 KA-UA list) count as P&E for 'attested'? Is bible.com's Ka Baibala Hemolele (the same 2018 text as baibala.org, which is off limits) usable? Is Kaniʻāina (ulukau.org/kaniaina, an audio-transcript archive, not a dictionary or e-book collection) allowed?

**Why it matters.** These decide spelling confidence for 49 live words. Also: the 200-search session budget, shared by parallel reviewers, ran out, so 20 of 46 batches ran no web search at all and two more ran out partway; 309 live words have no web corroboration; and Hawaiian Wikipedia counts include machine-generated text and substring matches.

**Options.**

1. P&E reproductions count as P&E-derived ('attested', still confirmed in the P&E pass); bible.com KBH is a usage source with a Bible bias, not a mirror; Kaniʻāina allowed; Hawaiian Wikipedia counts only after reading the sentences.
2. Treat bible.com as a baibala.org mirror and drop those citations (spellings fall back to 'corroborated').
3. Count none of them.

**Recommendation.** Option 1 for the P&E lists and Kaniʻāina. On bible.com the designer should decide in the spirit of the baibala.org rule; if in doubt, take option 2 for it. Re-run web corroboration for the 309 live words once the search budget allows.

**Who decides.** designer.

**Affected words (55; 49 live).** ahihonua (X), alaʻula (KP), anilā (KP), aouli (K), aumiki (K), hunawai (KP), kaiau (K), kaiea (K), kaieʻe (K), kaihulu (KP), kaimalolo (K), kaipiʻi (KP), kaiʻau (K), lehuahi (K), lelehuna (K), lewalani (K), lokowai (K), lunakahiko (K), lunakaua (KP), lunakiaʻi (KP), lunakānāwai (K), lunamanaʻo (K), lunaʻauhau (K), lunaʻōlelo (K), makuakāne (K), makualiʻi (KP), malumake (D), manamanalima (K), manamananui (K), manamanawāwae (K), manaʻolana (K), manaʻoʻiʻo (K), manuhuhū (D), manuū (X), moʻolele (KP), moʻomake (D), moʻonui (D), naʻauao (K), naʻaulua (KP), naʻaupono (KP), naʻaupō (K), nohoaliʻi (K), nohopaʻa (KP), nukuwai (KP), nānāao (KP), nānāuli (KP), olokaʻa (KP), paʻakāhili (K), paʻanaʻau (K), paʻapū (KP), puʻuone (K), pōhakupaʻa (K), pōʻailani (K), pōʻele (K), ʻauwai (KP)

### F4. DESIGN's own examples that the review overturns

**Question.** Which examples in DESIGN §2, §4.5 and the title plate need changing?

**Why it matters.** waiwai is a reduplication of wai 'deposit' (B7); kahakai → kahawai → kahaone holds only if P&E reads kahawai's kaha as 'place' (Andrews says 'cut'); huaʻōlelo waits on A2; luapō carries lua 'toilet' and death (A9); kinoea/kinowai/kinopaʻa are modern coinages (C5); mokuʻāina's main modern sense is 'US state' (E4).

**Options.**

1. Revise: waimaka → waiū and kahakai ↔ kahaone as §2 chains; a lua-free pair in §4.5; huaʻōlelo stays pending A2.
2. Keep and annotate.

**Recommendation.** Option 1.

**Who decides.** designer.

**Affected words (14; 13 live).** waiwai (2nd:X), kahakai (K), kahawai (K), kahaone (KP), huaʻōlelo (KP), luapō (KP), kinoea (K), kinowai (K), kinopaʻa (K), mokuʻāina (K), naʻauao (K), naʻaupō (K), waiū (K), waimaka (K)

### F5. Field assignment and balance

**Question.** Live words fall hana 115, kanaka 101, naʻau 97, hele 56, ulu 41, ʻāina 39, kai 31, lani 26. Set rules, and balance?

**Why it matters.** Every hale word went to hana, ships to hana, and water words split between ʻāina and kai by reviewer habit; kauhale went to kanaka because DESIGN draws that field as a kauhale.

**Options.**

1. Rules: buildings, tools, craft → hana; people, kin, body → kanaka; fresh water and land forms → ʻāina; sea, tide, fish → kai; time and number → hele; then accept the skew.
2. Rebalance by moving borderline words.
3. Let the deal weight fields.

**Recommendation.** Options 1 and 3.

**Who decides.** designer.

**Affected words (75; 75 live).** alawai (KP), hakuhale (KP), halealiʻi (K), halekaua (KP), halekaʻa (KP), halekia (KP), halelana (KP), halelewa (KP), halelole (KP), halemalu (KP), halemoe (KP), halemākaʻi (K), halepiʻo (KP), halepule (K), holokai (K), holomoku (K), huewai (K), hukiwai (KP), hunakai (K), hunawai (KP), hūkai (KP), kahakai (K), kahawai (K), kahuahale (KP), kahuwai (KP), kaiau (K), kaiea (K), kaieʻe (K), kaihulu (KP), kaimalolo (K), kaipiʻi (KP), kaiuli (K), kaiʻau (K), kalahale (KP), kauhale (KP), kaʻahale (KP), kinowai (K), komohale (KP), kuenehale (KP), kumuwai (KP), lokowai (K), makawai (KP), makewai (K), moanakai (KP), moanawai (KP), mokuhonua (K), mokukaua (K), mokulele (K), mokuluʻu (KP), mokumāhu (KP), mokupuni (K), mokuʻāina (K), nukuwai (KP), palekai (K), paʻakai (K), pipiwai (KP), poʻowai (K), pukahale (KP), puʻuwai (K), pīkai (KP), waiea (KP), waihoʻoluʻu (K), waikai (KP), wailana (KP), wailele (K), waimaka (K), waipaʻa (KP), waipuna (K), waiua (KP), waiū (K), waiʻauʻau (KP), waiʻele (KP), waiʻeleʻele (KP), ʻauwai (KP), ʻilikai (K)

## Pipeline fixes

These are faults in `research/roots/` that produced wrong candidates, wrong roots or wrong evidence. Fixing them before the Pukui & Elbert check saves lookups.

### P1. OCR-repair phantoms: the 'nonconcat' repair rewrote an Andrews headword to fit its bracket, dropping a syllable, an article (ka, o) or a middle root (ʻai, lawe), and invented words Andrews never printed.

**Fix.** Re-audit all 341 repaired rows against the raw OCR line before any P&E time is spent; treat a repaired headword shorter than its OCR headword as suspect; never take a spelling from the bracket.

**Affected.** ahihonua (Ahiaihonua), kaʻalewa (Kaalelewa), kaʻihuakaʻi (Kaiahuakai), keikiwaiū (Keikiaiwaiu), kuliana (Kulina), kuʻuluhi (Kuukaluhi), kāwai (Kanawai), lauhiʻu (Laukahiu), kūea (Kukaea), kūheu (Kukaheu), kūhihi (Kunahihi), kūihu (Kukaihu), kūkahiki (Kuakahiki), maʻaʻula (Maulaula), mikiʻaiā (Mikiala), pōkahi (Poakahi), pōkolu (Poakolu), pōlima (Poalima), pōhakuwai (Pohakuwaiki), puʻuʻulaʻula (Puulaula), ʻulakoko (Ulaokoko), hoalawe (Hoalawepu), noaloa (noaauloa), akuamakua (akua + ʻaumakua), kahuana (Kahuna)

### P2. Bracket trusted over headword, including bracket misprints and OCR l/i confusions that created false roots (ʻaiā 'ungodly', one 'sand').

**Fix.** Spell from the headword; flag any candidate whose spelling differs from its headword; re-enter the real words where they are compounds (alaniho, mikiʻala, ʻuala is a single root).

**Affected.** papaone (Papaono), hualele (= hualole), ūʻaiā (Uala), ʻaiāniho (Alaniho), mikiʻaiā (Mikiala), huaʻale (ale, not ʻale), kaʻalewa

### P3. -ana / -na nominalisations rebuilt as X·ana and mapped to ana 'cave' or 'measure', inflating degrees.

**Fix.** Drop any bracket whose second part is unglossed 'ana' or glossed 'participle/participial termination/being'; check each X·ana row against its OCR headword (Hikina, Huina, Kahuna, Kuina, Okina, Haawina, Makena, Pahuna, Ohina, Kiekiena, Holoholona, Piina).

**Affected.** hikiana (X), holoholoana (X), huiana (X), hāʻawiana (X), kahuana (X), kiʻekiʻeana (X), kuiana (X), kuliana (X), pahuana (X), piʻiana (X), ūana (X), ʻohiana (X), ʻokiana (X)

### P4. 106 A/A* dossiers have an empty 'andrews' array (often because the OCR misread the headword: Lehuahl, Walkai, Makawal, Kohlal, Laauiuai, Mahiill, Mahinaal); 32 of these words are live.

**Fix.** Fuzzy-match headwords (l/i/I/1, rn/m) when building dossiers; flag empty arrays so reviewers read the OCR directly and record the real headword.

**Affected.** ahihonua (X), akuamakua (X), aliʻiwahine (KP), hakuwahine (KP), halealiʻi (K), halelana (KP), hikiana (X), hoalawe (X), holoholoana (X), hoʻoluʻuʻili (D), hualole (D), huiana (X), hāliʻikuli (KP), hānaukahi (KP), hāʻawiana (X), iwipona (KP), kahuana (X), kaiheʻenalu (X), kaihulu (KP), kaiuli (K), kaʻahai (X), kaʻalewa (D), kaʻihuakaʻi (X), keikiwaiū (X), kiʻekiʻeana (X), kiʻikālai (KP), koawā (X), komoʻāina (KP), kuiana (X), kukuiʻōlelo (D), kumupipi (X), kuʻikahi (K), kuʻiʻai (KP), kuʻuluhi (X), kōhiʻai (KP), kōkolo (X), kūheu (X), kūhihi (X), kūihu (X), kūkahiki (X), kūlālā (KP), laekoi (X), lauhiʻu (X), laʻaulu (KP), lehuahi (K), lelehuna (K), lelehāuli (D), lelemū (X), lelepali (D), lelepono (KP), leleʻio (X), leleʻōpeʻapeʻa (KP), lonohiʻi (X), luaahi (X), luawahine (X), luaʻikoko (X), luluhua (D), lāʻauluaʻi (D), mahinaʻai (D), mahiʻili (D), makawai (KP), makeʻana (X), makuawahine (D), manahālō (X), maʻaʻula (X), meakiaʻi (X), mikiʻaiā (X), moʻoaliʻi (KP), noaloa (X), nīnauʻuhane (X), olokiki (X), pahuana (X), palaloli (D), palemai (X), paleuhi (KP), papaone (X), pauahi (X), piʻiana (X), poʻoʻōlelo (KP), puʻuʻulaʻula (X), pāpalealiʻi (KP), pōhakuwai (X), pōkahi (X), pōkolu (X), pōlima (X), pōʻailōʻihi (KP), waikai (KP), waipahu (X), waipiʻi (D), waipuna (K), waiwaipio (D), waiʻaleʻale (X), waiʻeleʻele (KP), ūana (X), ūʻaiā (X), ʻaiāniho (X), ʻanolani (D), ʻaulima (K), ʻohiana (X), ʻokiana (X), ʻualakahiki (K), ʻulakoko (D), ʻōpūhao (KP), ʻōpūnui (D), ʻōpūʻōhaʻi (X), ʻūpāahi (X)

### P5. Dossiers looked Wiktionary up only under the one-word spelling, so two-word headwords were missed and the rows were coded A* (understating evidence); capitalised headwords (weekday names) were missed too.

**Fix.** Look up spaced and capitalised variants; recode evidence.

**Affected.** limahema (lima hema), limaʻākau (lima ʻākau), keikikāne (keiki kāne), lunaʻauhau (luna ʻauhau), kaukānāwai (ʻaha kau kānāwai), hōkūʻaeʻa (hōkū ʻaeʻa), poʻolua (poʻo lua), huaʻōlelo (hua ʻōlelo), kahuapaʻa (kahua paʻa), ʻualakahiki (ʻuala kahiki), pukahale (puka aniani), pōʻaono (Pōʻaono), pōkahi (Pōʻakahi), pōkolu (Pōʻakolu), pōlima (Pōʻalima)

### P6. Roots' derived and related terms in kaikki-haw.jsonl were not carried into the dossiers, though they settle word breaks (Andrews joined what modern spelling splits).

**Fix.** Add each root's derived/related terms to its dossier and check them before writing 'unknown' for a break.

**Affected.** kikokahi (kiko kahi), kikomoe (kiko moe), kikonīnau (kiko nīnau), kinomake (kino make), kahuakua (kahu akua), kahumoku (kahu moku), kahuwai (kahu wai), kahuʻāina (kahu ʻāina), aʻalele (cf. aʻa koni, aʻa lewalewa), aʻakoko, pōʻaihapalua (pōʻai hapalua), pōʻailōʻihi (pōʻai lōʻihi), pōʻaipuni (pōʻai puni), punawai (pūnāwai ʻauʻau)

### P7. Homograph lists omit particle entries (the lexical() filter), so particles were matched to content roots and counted as links.

**Fix.** Keep particle homographs in the dossiers, marked grammatical; screen out any compound whose part matches only a particle sense; recompute degrees.

**Affected.** hanawale (X), haowale (X), helewale (X), heʻewale (X), hikiana (X), hikiwale (X), holoholoana (X), hoʻoleiwale (X), huiana (X), hāʻawiana (X), hēʻahā (X), hōkūloa (KP), hūʻē (X), kahuana (X), kauamai (X), kauhale (KP), kaumokuʻāina (X), kauʻē (X), kaʻahai (X), kaʻawale (KP), kiʻekiʻeana (X), komowale (X), kuiana (X), kuliana (X), kuʻuʻē (D), kānā (X), kēhū (X), kēmau (X), kēʻō (X), kōiʻa (X), kōloko (X), lapuwale (D), lawewale (X), leleʻio (X), lololoa (X), mailuna (X), makewale (X), makeʻana (X), paepū (X), pahuana (X), palemai (X), paupū (X), paʻapū (KP), piʻiana (X), pāpaʻiwale (X), pūʻalu (X), uluwale (X), ūana (X), ʻohiana (X), ʻokiana (X), ʻoleloa (X)

### P8. Homograph lists omit senses found only in Andrews or POLLEX, so the needed root is missing and the matcher picked a wrong one.

**Fix.** Add the missing roots to roots.tsv with their P&E spellings: moʻo 'succession', kua 'anvil', kāula 'prophet', kōkō 'carrying net', kala 'gable', kau 'cover an oven' and *tau- 'group of', lawa 'bind', lūlū 'sow', puhi 'blow', pī 'sprinkle', pā 'disk', pane 'back of head', palai 'turn the face', olo 'resound', ʻala 'fragrant', au 'current', wana 'appear', hiwi 'ridge', laʻa 'season', lau 'breadth', kumu 'price/herd/handle', ʻoi 'best', oha 'stick', poi 'cover', haʻi 'tell', ama 'tattling', ʻū 'cry', halo 'fin motion', manu 'canoe end-piece', kōlea (kin term), ʻea 'turtle', kukui 'join', kuʻe 'brow', papai 'shelter', pahū 'burst', ʻiʻo 'true', ʻawa 'bitter', ʻono 'sweet', huʻi 'ache', hoaka 'crescent', alu 'together', momi 'swallow', kiʻo 'pool', koʻi 'adze', ʻōhai, uku, mauli.

**Affected.** moʻoaliʻi (KP), moʻokanaka (KP), moʻokupuna (KP), moʻokūʻauhau (K), moʻoʻōlelo (KP), kuahao (KP), kaulawahine (X), kaukoko (D), kalahale (KP), kaupale (KP), kaukahi (KP), kaulua (KP), lawakua (KP), lulualiʻi (D), luluhua (D), luapuhi (D), pīkai (KP), pāleoleo (K), olokē (D), lāʻauala (D), wiliʻau (KP), wanaao (D), kuahiwi (2nd:K), laʻamake (KP), laʻaulu (KP), laupapa (KP), kumukūʻai (K), ʻoihana (K), ʻohākulaʻi (KP), hiʻipoi (KP), haʻiinoa (D), wahaama (D), manuū (X), manuihu (KP), makuakōlea (D), kumuea (D), kukuiʻōlelo (D), kūʻēmaka (X), kūkulupāpaʻi (X), waipahu (X), leleʻio (X), nihoawa (X), pauono (D), nihohui (D), hōʻakakeʻa (D), pūʻalu (X), momikū (X), kiowai (D), koikahi (KP), koilipi (KP), ʻōpūʻōhaʻi (X), ukuhana (2nd:KP), mauliʻola (2nd:KP)

### P9. A* spellings pieced from the wrong homograph or with a wrong ʻokina/kahakō (the failure A* was warned for).

**Fix.** Re-key each root from its P&E spelling (POLLEX) before spelling a compound; prefer POLLEX compound forms where they exist.

**Affected.** makaala (makaʻala), makapouli (makapōuli), ūahi (uahi), kūpua (kupua), keahakahaka (keʻahakahaka), maʻaleʻa (maʻalea), auwaʻa (ʻauwaʻa), auwaha (ʻauwaha), punawai (pūnāwai), paʻakīkī (paʻakikī), kōʻieʻie (Koʻieʻie), kēʻō (keʻo), kūʻēmaka (kuʻemaka), ōkomo (ʻōkomo), wiliʻau (wiliau), hōʻakakeʻa (hoaka), koawā (kōwā), pipiwai (pīpīwai), hōʻoiaʻio (hōʻoiaʻiʻo), ʻahāaina, ʻahāinu, ʻahāʻaina (ʻaha), kiowai (kiʻowai), koikahi (koʻi), lauʻōlelo, kaulawahine (kāula?), kūhao (kūhaʻo?)

### P10. The exclusion screen read only Wiktionary senses, so Pukui & Elbert senses in POLLEX and Andrews-only senses were never screened; and it produced at least one false positive.

**Fix.** Run the SENSITIVE patterns over POLLEX haw_gloss (and the proto gloss of the same set) and over Andrews root entries; hand-check the 112 screened-out rows for false positives.

**Affected.** lāʻau family, keʻa family, kapa family, pala family, makakole, mūkole, kēʻō (keʻo clitoris), neneleʻa, hua family, manawahua, lepo family, kiki family, kaʻa family, huna family, heʻe#1 family, haʻi family, loa family, noaloa, luapuhi, kuapuhi, kiowai, paupāʻele, paukikī, kapuahihao, papakū, ʻauamo, waikahe, kamaʻāina (false positive)

### P11. Prefix list incomplete: hā-, kō-/kī-, distributive papa-, simulative ʻō-, hō-, qualitative pō-, kā-, and hoʻo- inside a stem were not caught.

**Fix.** Extend ROOTS.md step 5's list; screen hoʻo- anywhere in a part.

**Affected.** hākui (X), hālana (X), hāneʻe (X), hāpale (D), hōʻoiaʻio (X), hōʻolemana (D), hōʻolepule (D), kāhea (2nd:X), kāmakamaka (2nd:X), kāwele (2nd:X), kīkipa (X), kīlua (X), kīʻōnaha (X), kōhanahana (X), kōkala (D), kōkolo (X), kōleʻaleʻa (X), kōwelo (X), papahā (X), papalua (D), papaone (X), papaʻakahi (D), pōloli (2nd:X), pōʻaha (2nd:X), ʻōhewa (D), hoʻokolohua (KP), hoʻoluʻuʻili (D), hoʻohalalā (D), hoʻoleiwale (X), hoʻomanakiʻi (X), puʻuhoʻomaha (D), kumuhoʻōla (D), waihoʻoluʻu (K)

### P12. pe_via_pollex ignores spaces but not hyphens, so hyphenated POLLEX forms (about 54) were missed; POLLEX compound protoforms are an unused second source.

**Fix.** Strip hyphens and slashes in the comparison; record POLLEX compound protoforms (*mata-qara, *wai-puna, *kau-matua) as evidence.

**Affected.** ʻaumoana (ʔAu-moana), ʻaulima, ʻaumakua, ʻilikai, alahaka, kaulua, kaukahi, makaʻala, waipuna, limakuhi

### P13. Hawaiian Wikipedia counts mislead: substring matches, machine-generated filler, unrelated phrases, no ʻokina variants searched.

**Fix.** Count whole tokens with ʻokina variants normalised; store the sentences; down-weight bot pages.

**Affected.** lauala (D), kūkuluhema (KP), maʻalahi (KP), makuakāne (K), hoaʻōlelo (KP), holokaʻa (X), kauamai (X), kaupale (KP), pōʻele (K), pōhakupaʻa (K), kapakomo (KP), kualāʻau (D), kuhihewa (KP), hanamana (K), kaiʻau (K), mokuhonua (K), luaʻole (D)

### P14. Wrong worksheet flags and fields: 'Wiktionary writes it as two words' on one-word entries; 'homograph unresolved' flags that POLLEX settles; andrews_definition run-ons and wrong senses.

**Fix.** Recompute the flags; read the compound's own POLLEX entry; trim definitions at the next headword.

**Affected.** huaʻōlelo, huaʻai, alahaka, aumiki, aʻalolo, hoa family, luna family, halepiʻo, lāʻauluaʻi, ʻukupoʻo, ʻōpūhue, wahaama, mahamoe, huaʻale

### P15. Degrees were computed on spelling-level stones including false particle and wrong-homograph links, so the P&E priority order is distorted.

**Fix.** Recompute degrees after the sense splits (B8), the particle screen (B1) and the phantom purge, then re-sort compounds.tsv.

**Affected.** kūlana (45), makaʻole (24), kiowai (23), pipiwai (21), holoʻai (18), helewale, heʻewale, hikiwale, hikiana, huiana (14), kaihua (14), ʻokiana (13), kakaʻōlelo, kalahale, kauhale, hāʻawiana (12), pahuana (12), ʻohiana (12), ūana (14), ūahi (11), makaʻala (17)

### P16. Folk etymologies enter as compounds from Wiktionary 'W' analyses and Andrews brackets.

**Fix.** Cross-check every W and A row against POLLEX: a single-morpheme protoform (or a suffix) overrules the split.

**Affected.** ʻiliahi (D), luawahine (X), kūlana (X), kaupākū (X), lāhui (X), moʻopuna (D), ūahi (X), huakaʻi (D), kūʻai (KP), manaʻolana (K), kūkuli (D), aumoe (KP)

### P17. Review process: the 200-search session budget, shared by parallel reviewers, ran out, so 20 of 46 batches ran no web search and two more stopped partway (309 live words have no web source); search summaries kept quoting forbidden dictionary mirrors; parallel agents overwrote each other's helper scripts.

**Fix.** Raise or budget searches per batch; pass blocked_domains (wehe.hilo.hawaii.edu, wehe.colo.hawaii.edu, ulukau.org/chd, heaniani.com, vdoc.pub, dokumen.pub; hilo.hawaii.edu/wehe cannot be blocked by path, so discard its snippets); give each agent its own folder.

**Affected.** 309 words; full list in the appendix under P17

### P18. Reviewers assigned a sense id on one source when sources named different homographs, which would draw false links; lexical reasons were put into exclusion_reasons; the word_break enum cannot say 'three words'.

**Fix.** Rule: a sense id only when the sources agree or a P&E-sourced etymology settles it, else 'unresolved'; keep exclusion_reasons for §4.3 only; add 'n/a (three parts)' to word_break.

**Affected.** aumoe (KP), kahawai (K), ʻauwai (KP), huaʻōlelo (KP), hanahiō (X), kaiheʻenalu (X), ahihonua (X)

### P19. Reviewers surfaced real words missing from the candidate list.

**Fix.** Add as candidates (A* or W as appropriate): alaniho, mikiʻala, make ʻai (POLLEX/P&E *mate-kai), huna kai, huna wailele, ʻauwaʻa, Pōʻakahi / Pōʻakolu / Pōʻalima, kuahiwi (with hiwi), mauli ola, uku hana, luaʻi pele (if A11 allows), ʻumeke poi.

**Affected.** alaniho, mikiʻala, make ʻai, huna kai, huna wailele, ʻauwaʻa, Pōʻakahi, Pōʻakolu, Pōʻalima, kuahiwi, mauli ola, uku hana, luaʻi pele, ʻumeke poi

## Appendix: full word lists

### A1 (171)

aholoa (KP), akeloa (KP), alaloa (K), alapiʻi (D), anawaenaloa (X), aouli (K), aumoe (KP), aʻahui (D), aʻakoko (KP), aʻalele (KP), aʻalolo (KP), haiao (D), haipule (KP), haipō (D), haiʻai (D), halekaʻa (KP), halelepo (D), halelua (X), halelāʻau (D), halemoe (KP), hanahiō (X), haʻiinoa (D), haʻiʻole (X), heiheinalu (KP), heʻenalu (K), heʻewale (X), hikimoe (KP), hinamoe (X), hoeuli (K), holokaʻa (X), hoʻokolohua (KP), huahelu (2nd:X), huahāʻule (X), huakaʻi (D), hualele (X), hualili (D), hualiʻi (KP), hualole (D), huamele (KP), huamoa (K), huanoni (D), huaʻai (KP), huaʻale (KP), huaʻole (D), huaʻōlelo (KP), hukiheʻe (D), hunakai (K), hunakaua (KP), hunalepo (D), hunawai (KP), hōkūloa (KP), hōʻakakeʻa (D), hūkaʻa (D), kahimoe (D), kaihua (D), kaipiʻi (KP), kaiuli (K), kamaʻāina (2nd:K), kapakahi (KP), kapakomo (KP), kapakuʻina (D), kapuahihao (D), kaʻahai (X), kaʻahale (KP), kaʻahele (K), kaʻakaua (KP), kaʻalalo (KP), kaʻalewa (D), kaʻaluna (KP), kaʻamaloʻo (D), kaʻaoki (D), kaʻapuni (K), kaʻawale (KP), keahakahaka (X), keʻapua (X), kikialo (X), kikomoe (KP), kioahi (X), kiolepo (X), kiowai (D), koʻakea (D), kualāʻau (D), kuapuhi (X), kumulāʻau (D), kuʻuipo (2nd:X), kālāʻau (D), kāmaʻaloa (KP), kōkea (KP), kōlua (D), kūkulu (2nd:X), lauleʻa (X), lauwili (KP), lelehuna (K), lelemū (X), lepohānai (X), lolokaʻa (KP), lololoa (X), luaahi (X), luahūnā (X), lualuaʻi (X), luapaʻahao (D), luapele (K), luapuhi (D), luapō (KP), luaʻikoko (X), luluhua (D), lālālāʻau (X), lāʻauala (D), lāʻaukeʻa (D), lāʻaukia (D), lāʻaukū (D), lāʻauluaʻi (D), lāʻaumoe (D), lāʻaupiʻi (X), mahamoe (D), makahiō (D), makakole (X), manawahua (X), maʻaleʻa (D), moehewa (K), moeone (KP), moeʻino (KP), moeʻuhane (K), mokumāhu (KP), moʻaleʻa (X), mūakua (X), mūkole (X), neneleʻa (X), noaloa (X), nānāuli (KP), olokaʻa (KP), olokeʻa (D), olokiki (X), palaholo (D), palakea (D), palalalo (X), palalauhala (D), palaloli (D), palapalakea (D), palaʻai (X), paluheʻe (D), papakea (KP), papalāʻau (D), papamū (K), paukikī (X), paʻakīkī (X), paʻiaʻa (KP), paʻihua (X), pilihua (D), piʻiana (X), punihai (D), pālepo (D), pālāʻau (D), pōhakukaʻa (D), pōhakulepo (X), ululāʻau (KP), wahaheʻe (K), waikahe (2nd:X), waipiʻi (D), wilikī (X), wilipuaʻa (X), wiliʻau (KP), ʻauamo (2nd:X), ʻikepili (K), ʻoleloa (X), ʻukukapa (KP), ʻōpūao (KP), ʻōpūhao (KP), ʻōpūhue (KP), ʻōpūnui (D), ʻōpūʻōhaʻi (X)

### B8 (180)

aouli (K), aumihi (D), aumiki (K), aumoe (KP), auwaha (D), auwaʻa (KP), auwā (X), haiao (D), hiʻumālolo (X), hoakoa (KP), hoʻihou (D), hoʻokolohua (KP), huahāʻule (X), huakaʻi (D), hualele (X), hualili (D), hualiʻi (KP), hualole (D), huamele (KP), huamoa (K), huanoni (D), huaʻai (KP), huaʻale (KP), huaʻole (D), huaʻōlelo (KP), huikala (K), hākui (X), hōkūao (KP), hūhonua (D), hūkai (KP), hūkaʻa (D), hūlani (KP), hūpuna (KP), hūʻalu (D), hūʻole (D), hūʻē (X), kahahānai (KP), kahakai (K), kahaone (KP), kahapili (KP), kahapoʻohiwi (D), kahapōʻai (KP), kahawai (K), kahuahi (KP), kahuakua (KP), kahuana (X), kahumoku (D), kahupuaʻa (KP), kahuwai (KP), kahuʻai (D), kahuʻāina (KP), kaiau (K), kaihua (D), kaimalolo (K), kaiʻau (K), kakahou (X), kalaau (X), kalahala (KP), kalahale (KP), kaumoʻo (D), kiaao (KP), kipikua (KP), koawā (X), kuahao (KP), kualana (KP), kualono (D), kualāʻau (D), kuamauna (KP), kuamoʻo (K), kuanui (KP), kuapapa (KP), kuapaʻa (KP), kuapuhi (X), kuapuʻu (K), kuawehi (X), kuaʻāina (K), kuiana (X), kuilua (KP), kuiʻēʻē (D), kumualakaʻi (KP), kumuea (D), kumuhou (X), kumuhoʻōla (D), kumukānāwai (K), kumukūʻai (K), kumulau (KP), kumulipo (X), kumulāʻau (D), kumupaʻa (K), kumupipi (X), kumupuaʻa (D), kumuwai (KP), kuʻihao (K), kuʻihewa (D), kuʻikahi (K), kuʻikē (X), kuʻipalu (D), kuʻiʻai (KP), kēhū (X), kōkala (D), kūkaha (KP), kūkala (K), kūkāmoʻo (D), kūʻau (KP), lanaau (KP), lauala (D), lauhala (K), lauhiʻu (X), lauhoe (K), laukanaka (KP), laukoa (KP), laukonakona (D), laukī (KP), laukō (KP), laulama (KP), laulele (D), lauleʻa (X), laulima (K), laulole (D), laumake (KP), laumanamana (D), laupapa (KP), lauwili (KP), lauʻulu (KP), lawakua (KP), laʻamake (KP), laʻaua (D), laʻaulu (KP), limahana (K), limahema (K), limaikaika (D), limakuhi (K), limaʻākau (K), lolelau (D), luluhua (D), lunakoa (KP), lālāhū (D), mahinaʻai (D), makakoa (K), manamanalima (K), manawahua (X), moʻoakua (D), moʻoaliʻi (KP), moʻokanaka (KP), moʻokupuna (KP), moʻokūʻauhau (K), moʻolele (KP), moʻomake (D), moʻonui (D), moʻopuna (D), moʻoʻōlelo (KP), naʻauao (K), nānāao (KP), olokaʻa (KP), olokeʻa (D), olokiki (X), olokē (D), olomua (X), papakoa (D), paʻiaʻa (KP), paʻihua (X), paʻikiʻi (K), paʻiʻai (KP), pihalima (KP), pilihua (D), puakala (KP), puʻulima (KP), pāpalelaʻa (D), pōlima (X), waiau (D), wanaao (D), wiliʻau (KP), ʻahuao (KP), ʻaulike (KP), ʻaulima (K), ʻaumakua (K), ʻaumoana (KP), ʻauwai (KP), ʻōpūao (KP), ʻōʻōhou (KP)

### C1 (233)

ahihonua (X), akualele (X), akuamakua (X), anaʻāina (KP), aʻakoko (KP), aʻalele (KP), hakumele (K), hakuwahine (KP), hakuʻāina (KP), hakuʻōlelo (KP), halealiʻi (K), halekaʻa (KP), halekula (X), halelāʻau (D), halemoe (KP), halemākaʻi (K), halepahu (D), halepiʻo (KP), halepule (K), hanamana (K), hanawale (X), helewale (X), heʻenalu (K), hikiana (X), hikiwale (X), hiʻumālolo (X), hoahana (K), hoahele (KP), hoakaua (KP), hoapaio (K), hoeuli (K), hoewaʻa (K), holokaʻa (X), hololio (K), holoʻai (KP), hopepoʻo (K), hoʻihope (KP), hoʻihou (D), hoʻohalalā (D), hoʻoleiwale (X), hoʻoluʻuʻili (D), hoʻomanakiʻi (X), huahāʻule (X), huamele (KP), huamoa (K), huanoni (D), hueʻili (KP), hunawai (KP), hānaumua (KP), hēʻahā (X), hōkūhele (K), hōkūʻaeʻa (K), hūʻole (D), kahimoe (D), kahuahale (KP), kahuahi (KP), kahuakua (KP), kahuaʻole (X), kahumoku (D), kahupuaʻa (KP), kahuwai (KP), kahuʻai (D), kahuʻāina (KP), kaiau (K), kaiea (K), kaieʻe (K), kaiheʻenalu (X), kaihua (D), kaihulu (KP), kaimalolo (K), kaipiʻi (KP), kaiuli (K), kaiʻau (K), kalahale (KP), kanakamakua (KP), kapakomo (KP), kapakuʻina (D), kapuahihao (D), kauamai (X), kaukānāwai (K), kaulalei (KP), keikikāne (K), keʻapua (X), kiaahi (KP), kiaao (KP), kikokahi (KP), kikomoe (KP), kikonīnau (K), kinomake (D), kinowailua (KP), kiʻekiʻeana (X), kiʻikālai (KP), kiʻikū (D), kiʻipōhaku (K), kohomua (D), komolole (D), komowale (X), koʻokoʻohao (D), kuamoʻoʻōlelo (D), kumualakaʻi (KP), kumupuaʻa (D), kupunawahine (KP), kuʻiʻai (KP), kuʻuluhi (X), kālaipōhaku (KP), kānemake (KP), kōiʻa (X), kōloko (X), kōʻeli (D), kūkaʻawale (D), kūkuluhema (KP), lauhala (K), lauhalalana (D), laukī (KP), laukō (KP), lauʻulu (KP), lawaiʻamanu (KP), lawewale (X), lehuahi (K), leialiʻi (KP), leihala (K), leowahine (KP), lewalani (K), limahema (K), limaikaika (D), limakuhi (K), limaʻākau (K), lokowai (K), lolehana (KP), luaahi (X), luahūnā (X), luapaʻahao (D), luapele (K), luaʻole (D), lunahana (K), lunakiaʻi (KP), lunakiʻekiʻe (KP), lunakoa (KP), lunakānāwai (K), lunaʻauhau (K), lāhana (KP), lāhuikaua (KP), lāhuiʻāina (D), lālālāʻau (X), lāʻauala (D), lāʻaukeʻa (D), lāʻaukia (D), lāʻaukū (D), lāʻauluaʻi (D), lāʻaumoe (D), lāʻaupiʻi (X), mahelelua (D), mahinaʻai (D), mailuna (X), makahema (D), makakoa (K), makamua (K), makaʻākau (D), makewai (K), makewale (X), makeʻana (X), makuakāne (K), makuakōlea (D), malumake (D), manamanalima (K), manamananui (K), manamanawāwae (K), manaʻopaʻa (KP), manuhuhū (D), manuihu (KP), manuū (X), meakiaʻi (X), meaʻē (D), moamahi (KP), mokukaua (K), moʻaleʻa (X), moʻolele (KP), moʻomake (D), moʻonui (D), nihohui (D), nohoaliʻi (K), nohoaloha (D), nohopaʻa (KP), nohopio (D), nānāuli (KP), onehānau (K), paepaepuka (KP), pahuana (X), pahukani (KP), palekai (K), palekeiki (KP), papakoa (D), papalāʻau (D), papaʻaina (KP), paʻakāhili (K), paʻikiʻi (K), paʻiʻai (KP), poʻolua (X), pukamakani (KP), puʻuʻōpala (D), pāpalealiʻi (KP), pāpalelaʻa (D), pōhakulepo (X), pōhakupaʻa (K), pōʻaihapalua (X), pōʻaihele (D), pōʻailōʻihi (KP), pōʻaipuni (KP), uhipaʻa (D), uluwale (X), waipuna (K), waiua (KP), waiwaipio (D), waiʻauʻau (KP), waiʻeleʻele (KP), waiʻōhiʻa (D), wāheʻe (D), ūana (X), ʻahamele (K), ʻahuʻula (K), ʻaiahupuaʻa (D), ʻaikapu (K), ʻaiʻāina (D), ʻanolani (D), ʻoleloa (X), ʻualakahiki (K), ʻukukapa (KP), ʻukupoʻo (KP), ʻulakoko (D), ʻulukahiki (KP), ʻōleloaʻo (KP), ʻōlelopaʻa (KP), ʻōpūnui (D)

### C2 (124)

ahuwaiwai (D), alanui (K), aliʻiwahine (KP), anaʻāina (KP), aʻakoko (KP), hakuhale (KP), hakuwahine (KP), halelāʻau (D), hanahiō (X), hanawale (X), hauʻole (D), helewale (X), hikiana (X), hoewaʻa (K), holoholoana (X), holokaʻa (X), hopepoʻo (K), hoʻihope (KP), hoʻohalalā (D), hoʻoluʻuʻili (D), hualiʻi (KP), huamele (KP), huanoni (D), huaʻole (D), hukiwai (KP), huluʻiʻiwi (KP), hānaukahi (KP), hōʻolemana (D), hūʻole (D), kahaone (KP), kahimoe (D), kahuaʻole (X), kahupuaʻa (KP), kahuʻai (D), kanakamakua (KP), kapakomo (KP), kapuahihao (D), kaulawahine (X), kauliʻiliʻi (D), kaupoʻohiwi (D), kiaahi (KP), kinomake (D), kohomua (D), komolole (D), komowale (X), koʻakea (D), koʻokoʻohao (D), kuanui (KP), kumualakaʻi (KP), kumupuaʻa (D), kuʻihewa (D), kuʻiʻai (KP), kālaipōhaku (KP), kāwauke (D), kōʻeli (D), kūkapakahi (D), kūkaʻawale (D), kūlanaheʻenalu (D), kūola (KP), kūpuni (KP), laukoa (KP), lelepali (D), leowahine (KP), lolehana (KP), luapaʻahao (D), luluhua (D), lunakiʻekiʻe (KP), lāhana (KP), lāhuikaua (KP), lāhuiʻāina (D), lālālāʻau (X), lāʻaukeʻa (D), mahelelua (D), makahema (D), makakoa (K), makaʻukiʻi (D), makaʻākau (D), makewale (X), malumake (D), manamanalima (K), manamananui (K), manamanawāwae (K), manaʻopaʻa (KP), manuhuhū (D), meakiaʻi (X), meaʻē (D), moʻaleʻa (X), moʻonui (D), naʻaupono (KP), nihohui (D), nohoaloha (D), nohopio (D), papakoa (D), papalalo (KP), papalāʻau (D), papapalapala (KP), papawaena (KP), papaʻakahi (D), paupū (X), paʻihua (X), poiawa (X), puahau (D), pukahale (KP), pukamakani (KP), puʻuʻōpala (D), pāpalealiʻi (KP), pāpalelaʻa (D), pōhakukaʻa (D), pōhakupaʻa (K), pōʻaihele (D), uhipaʻa (D), waiua (KP), waiwaipio (D), waiʻauʻau (KP), waiʻōhiʻa (D), wāheʻe (D), ʻahakanaka (KP), ʻaiahupuaʻa (D), ʻaiʻāina (D), ʻanolani (D), ʻōkoholā (D), ʻōlelopaʻa (KP), ʻōpūnui (D), ʻōʻōhao (KP)

### C4 (133)

akeakamai (K), alahao (K), anapuni (K), anawaena (K), anawaenaloa (X), halekaua (KP), halekaʻa (KP), halekula (X), halelana (KP), halelole (KP), halelāʻau (D), halepāpaʻa (D), haomanamana (KP), haowaha (KP), haʻiinoa (D), heluhōʻike (D), holokaʻa (X), hololio (K), holowā (X), hoʻomanakiʻi (X), huamele (KP), hueʻili (KP), hulipoepoe (K), huluʻānai (D), hōʻolemana (D), hōʻolepule (D), hūʻole (D), kahahānai (KP), kahapili (KP), kahapōʻai (KP), kahikolu (X), kahumoku (D), kahupuaʻa (KP), kapuahihao (D), kaulahao (K), kaulawaha (KP), kaulawahine (X), kaupoʻohiwi (D), kaʻahale (KP), keikikao (X), keikipipi (X), kiaahi (KP), kiaao (KP), kiakolu (KP), kialua (KP), kiaʻipuka (KP), kiaʻipō (KP), kikokahi (KP), kikomoe (KP), kikonīnau (K), kioahi (X), kipikua (KP), kiʻikālai (KP), kiʻipalapala (KP), koikahi (KP), koʻokoʻohao (D), kualāʻau (D), kuapapa (KP), kumuhou (X), kumuhoʻōla (D), kumukānāwai (K), kumupipi (X), kuʻihao (K), kālaiʻāina (K), kāwai (X), kōpaʻa (K), laulole (D), leowaena (KP), lolehana (KP), luaahi (X), luapaʻahao (D), lunakahiko (K), lunakānāwai (K), lunamanaʻo (K), lunaʻōlelo (K), lāhuiʻāina (D), lāʻaukeʻa (D), makamua (K), makewale (X), malumake (D), manuhuhū (D), manuū (X), moanakai (KP), mokukaua (K), mokumāhu (KP), moʻolele (KP), moʻomake (D), moʻonui (D), nohoaloha (D), nīnauhōʻike (D), omokoko (KP), omoliu (KP), oneʻā (KP), pahukani (KP), pahukapu (KP), palekaua (KP), palemai (X), palemaka (KP), panipū (KP), papamanamana (KP), papapalapala (KP), paʻahao (K), paʻapoepoe (KP), paʻawaha (KP), paʻaʻili (KP), poʻoʻōlelo (KP), pānini (KP), pāpalealiʻi (KP), pāpalelaʻa (D), pōhakukaʻa (D), pōhakulepo (X), pōkahi (X), pōkolu (X), pōlima (X), pōʻaihapalua (X), pōʻailōʻihi (KP), pōʻaono (K), waipahu (X), waiwaipio (D), waiūpaʻa (K), waiʻeleʻele (KP), waʻapā (KP), wilikī (X), wilipuaʻa (X), ʻaʻapua (KP), ʻoihanaaliʻi (X), ʻokipoepoe (X), ʻualakahiki (K), ʻukulele (K), ʻulukahiki (KP), ʻōkoholā (D), ʻōʻōhao (KP), ʻōʻōhou (KP)

### C6 (199)

akeloa (KP), aʻalele (KP), aʻalolo (KP), hakakau (KP), hakuhale (KP), halekaua (KP), halekia (KP), halelewa (KP), halelole (KP), halemalu (KP), hamoʻula (KP), haomanamana (KP), haowaha (KP), hauʻeli (KP), heiheinalu (KP), hikimoe (KP), hiʻilani (KP), hoahanauna (KP), hoakoa (KP), hoalawaiʻa (KP), hoaʻai (KP), holowaʻa (KP), holoʻai (KP), hualiʻi (KP), huaʻale (KP), hueʻili (KP), hukiwai (KP), hulilua (KP), huluʻiʻiwi (KP), hunakaua (KP), hāipu (KP), hākō (KP), hāliʻikuli (KP), hānaukahi (KP), hāniu (KP), hūkai (KP), hūlani (KP), hūpuna (KP), iwikū (KP), iwipona (KP), kahapōʻai (KP), kahuahi (KP), kahupuaʻa (KP), kahuwai (KP), kaniwāwae (KP), kaulawaha (KP), kaupale (KP), kaʻahale (KP), kaʻakaua (KP), kaʻalalo (KP), kaʻaluna (KP), keikipapa (KP), kiaahi (KP), kiaao (KP), kiaʻipuka (KP), kiaʻipō (KP), kikolā (KP), kiloheʻe (KP), komoʻāina (KP), kualana (KP), kuanui (KP), kuenehale (KP), kuilua (KP), kulihiamoe (KP), kumulau (KP), kuʻiʻai (KP), kāmaʻaloa (KP), kāwilimanu (KP), kēʻai (KP), kōhiʻai (KP), kōʻula (KP), kūemi (KP), kūkaha (KP), kūkia (KP), kūkulupapa (KP), kūlehu (KP), kūloupoʻo (KP), kūlālā (KP), kūnihi (KP), kūnānā (KP), kūola (KP), kūpuni (KP), kūʻau (KP), laelua (KP), lanaau (KP), laukanaka (KP), laukoa (KP), laukō (KP), laulama (KP), laumake (KP), lauwili (KP), lauʻulu (KP), lawaiʻamanu (KP), laweola (KP), laʻamake (KP), laʻaulu (KP), lelepono (KP), leleʻōpeʻapeʻa (KP), leopaʻa (KP), leowaena (KP), leowahine (KP), limakuhi (K), lolehana (KP), lolokaʻa (KP), luapō (KP), lunakaua (KP), lunaʻohana (KP), lāhuikaua (KP), makahakahaka (KP), makahiamoe (KP), makakoa (K), makamomi (KP), makapaʻa (KP), makapouli (K), makawai (KP), makehewa (KP), makewai (K), manawaʻino (KP), manuihu (KP), maʻaweʻula (KP), moamahi (KP), moanakai (KP), moanawai (KP), moeone (KP), moeʻino (KP), mokumāhu (KP), moʻamaka (KP), moʻoaliʻi (KP), moʻokanaka (KP), moʻokupuna (KP), mulihope (KP), nānāao (KP), nānāuli (KP), omokoko (KP), omoliu (KP), oneʻā (KP), pahukapu (KP), pahupalapala (KP), palaimaka (KP), palekaua (KP), palemaka (KP), paleuhi (KP), panapoʻo (KP), panepoʻo (KP), panipuka (KP), panipū (KP), panipūpū (KP), papahola (KP), papakea (KP), papalalo (KP), papamanamana (KP), papapalapala (KP), papapāʻina (KP), paʻiaʻa (KP), pihalima (KP), poʻohina (KP), poʻokepa (KP), puapoʻo (KP), pukahale (KP), pukaihu (KP), punikoko (KP), puniwaiwai (KP), puʻukaua (KP), puʻulima (KP), pōhakuhele (KP), pōʻailōʻihi (KP), pōʻaipuni (KP), uhikino (KP), wahahewa (KP), wahapaʻa (KP), waiea (KP), waipaʻa (KP), waipuna (K), waiʻele (KP), waiʻeleʻele (KP), waʻapā (KP), wiliʻau (KP), ʻahakanaka (KP), ʻahuao (KP), ʻahāinu (KP), ʻahālike (KP), ʻahāʻaina (K), ʻaialo (KP), ʻakahenehene (KP), ʻaulike (KP), ʻaʻaniu (KP), ʻaʻapua (KP), ʻililua (KP), ʻohākulaʻi (KP), ʻualakahiki (K), ʻukukapa (KP), ʻukupoʻo (KP), ʻulukahiki (KP), ʻōpūao (KP), ʻōpūhao (KP), ʻōpūhue (KP), ʻōʻōahi (KP), ʻōʻōhao (KP), ʻōʻōhou (KP)

### F1 (304)

aholoa (KP), akeloa (KP), aliʻiwahine (KP), anaʻāina (KP), aʻakoko (KP), aʻalele (KP), aʻalolo (KP), haipule (KP), hakakau (KP), hakuhale (KP), hakuwahine (KP), hakuʻāina (KP), hakuʻōlelo (KP), halealiʻi (K), halekaua (KP), halekaʻa (KP), halekia (KP), halelewa (KP), halelole (KP), halemalu (KP), halemoe (KP), halepiʻo (KP), hamoʻula (KP), hanamana (K), hanupaʻa (KP), haomanamana (KP), haowaha (KP), hauʻeli (KP), heiheinalu (KP), hikimoe (KP), hiʻilani (KP), hoahana (K), hoahanauna (KP), hoahele (KP), hoakoa (KP), hoalawaiʻa (KP), hoaʻai (KP), hoaʻōlelo (KP), hoewaʻa (K), holokai (K), holomoku (K), holowaʻa (KP), hoʻihope (KP), hualiʻi (KP), huamele (KP), huamoa (K), huaʻale (KP), hueʻili (KP), hukiwai (KP), hulilua (KP), huluʻiʻiwi (KP), hunakaua (KP), hāipu (KP), hākō (KP), hāliʻikuli (KP), hānaukahi (KP), hānaumua (KP), hāniu (KP), hōkūao (KP), hōkūhele (K), hōkūlele (KP), hūkai (KP), hūlani (KP), hūpuna (KP), iwikū (KP), iwipona (KP), kahapili (KP), kahapōʻai (KP), kahuahi (KP), kahuakua (KP), kahupuaʻa (KP), kahuwai (KP), kaihulu (KP), kakaʻōlelo (KP), kalahala (KP), kanakamakua (KP), kaniwāwae (KP), kapakomo (KP), kauhale (KP), kaukānāwai (K), kaulahao (K), kaulalei (KP), kaulawaha (KP), kaulike (K), kaʻahale (KP), kaʻahele (K), kaʻakaua (KP), kaʻalalo (KP), kaʻaluna (KP), keikipapa (KP), kiaahi (KP), kiaao (KP), kiakahi (KP), kiakolu (KP), kialua (KP), kiaʻipoʻo (KP), kiaʻipuka (KP), kiaʻipō (KP), kiaʻāina (K), kikolā (KP), kikowaena (K), kiʻikālai (KP), kiʻipalapala (KP), koikahi (KP), koilipi (KP), komohale (KP), komoʻāina (KP), kualana (KP), kuanui (KP), kuapaʻa (KP), kuenehale (KP), kuhihewa (KP), kuilua (KP), kulihiamoe (KP), kumualakaʻi (KP), kumukūʻai (K), kumulau (KP), kumuwai (KP), kupunawahine (KP), kuʻikahi (K), kuʻiʻai (KP), kālaipōhaku (KP), kālaiʻāina (K), kāmaʻaloa (KP), kānemake (KP), kāwilimanu (KP), kēʻai (KP), kōhiʻai (KP), kōkea (KP), kōʻula (KP), kūemi (KP), kūhewa (KP), kūkaha (KP), kūkia (KP), kūkulupapa (KP), kūlehu (KP), kūloupoʻo (KP), kūlālā (KP), kūmaka (KP), kūnihi (KP), kūnānā (KP), kūola (KP), kūpuni (KP), kūʻēʻē (KP), laelua (KP), lanaau (KP), laukanaka (KP), laukoa (KP), laukī (KP), laukō (KP), laulama (KP), laulima (K), laumake (KP), lauwili (KP), lauʻulu (KP), lawaiʻamanu (KP), lawakua (KP), lawehana (KP), laweola (KP), laʻamake (KP), laʻaulu (KP), leialiʻi (KP), lelepono (KP), leleʻōpeʻapeʻa (KP), leopaʻa (KP), leowaena (KP), leowahine (KP), lolehana (KP), lolelua (KP), lolokaʻa (KP), luapō (KP), lunahana (K), lunakaua (KP), lunakiaʻi (KP), lunakiʻekiʻe (KP), lunakoa (KP), lunakānāwai (K), lunaʻohana (KP), lāhana (KP), lāhuikaua (KP), makahakahaka (KP), makahiamoe (KP), makaluku (KP), makamomi (KP), makapaʻa (KP), makawai (KP), makehewa (KP), manawaʻino (KP), manaʻopaʻa (KP), manuihu (KP), maʻaweʻula (KP), moamahi (KP), moanakai (KP), moanawai (KP), moeone (KP), moeʻino (KP), moeʻuhane (K), mokukaua (K), mokumāhu (KP), moʻamaka (KP), moʻoaliʻi (KP), moʻokanaka (KP), moʻokupuna (KP), moʻokūʻauhau (K), moʻolele (KP), moʻoʻōlelo (KP), mulihope (KP), naʻaulua (KP), naʻaupono (KP), nohoaliʻi (K), nohopaʻa (KP), nukuwai (KP), nānāao (KP), nānāuli (KP), olokaʻa (KP), omokoko (KP), omoliu (KP), onehānau (K), oneʻā (KP), paepaepuka (KP), pahukani (KP), pahukapu (KP), pahupalapala (KP), palaimaka (KP), palekaua (KP), palekeiki (KP), palemaka (KP), paleuhi (KP), panapoʻo (KP), panapua (KP), panepoʻo (KP), panipuka (KP), panipū (KP), panipūpū (KP), papahola (KP), papakea (KP), papalalo (KP), papamanamana (KP), papapalapala (KP), papapāʻina (KP), papapōhaku (KP), papawaena (KP), papaʻaina (KP), paʻaluhi (KP), paʻapoepoe (KP), paʻawaha (KP), paʻaʻili (KP), pihalima (KP), poʻohina (KP), poʻokepa (KP), poʻoʻōlelo (KP), puapoʻo (KP), pukahale (KP), pukaihu (KP), pukamakani (KP), punikoko (KP), puniwaiwai (KP), puʻukaua (KP), puʻukoko (KP), puʻulima (KP), pāpalealiʻi (KP), pīkai (KP), pōhakuhele (KP), pōʻailōʻihi (KP), pōʻaipuni (KP), uhikino (KP), wahahewa (KP), wahapaʻa (KP), waiea (KP), waikai (KP), wailana (KP), wailele (K), waipaʻa (KP), waiua (KP), waiʻauʻau (KP), waiʻele (KP), waiʻeleʻele (KP), waʻapā (KP), wiliʻau (KP), ʻahakanaka (KP), ʻahuao (KP), ʻahuʻula (K), ʻahāinu (KP), ʻahālike (KP), ʻahāʻaina (K), ʻaialo (KP), ʻaikapu (K), ʻakahenehene (KP), ʻaulike (KP), ʻaʻaniu (KP), ʻaʻapua (KP), ʻililua (KP), ʻohākulaʻi (KP), ʻukukapa (KP), ʻukupoʻo (KP), ʻulukahiki (KP), ʻōleloaʻo (KP), ʻōlelopaʻa (KP), ʻōpūao (KP), ʻōpūhao (KP), ʻōpūhue (KP), ʻōʻōahi (KP), ʻōʻōhao (KP), ʻōʻōhou (KP)

### F2 (356)

aholoa (KP), ahonui (K), akeloa (KP), aliʻiwahine (KP), anaʻāina (KP), auwaʻa (KP), aʻakoko (KP), aʻalele (KP), haipule (KP), hakakau (KP), hakamoa (KP), hakuhale (KP), hakumele (K), hakuwahine (KP), hakuʻāina (KP), hakuʻōlelo (KP), halealiʻi (K), halekaua (KP), halekaʻa (KP), halekia (KP), halelana (KP), halelewa (KP), halelole (KP), halemalu (KP), halemoe (KP), halepiʻo (KP), halepule (K), hamoʻula (KP), hanamana (K), hanupaʻa (KP), haomanamana (KP), haowaha (KP), hauʻeli (KP), hikilele (KP), hiʻilani (KP), hiʻipoi (KP), hoaaloha (K), hoahana (K), hoahanauna (KP), hoahele (KP), hoahānau (K), hoakaua (KP), hoakoa (KP), hoalawaiʻa (KP), hoaʻai (KP), hoaʻōlelo (KP), hoeuli (K), hoewaʻa (K), holokai (K), hololio (K), holomoku (K), holoʻai (KP), hoʻihope (KP), hualiʻi (KP), huamele (KP), huamoa (K), huaʻai (KP), huaʻale (KP), hueʻili (KP), huikala (K), hukiwai (KP), hulilua (KP), huluʻiʻiwi (KP), hunakai (K), hunakaua (KP), hunawai (KP), hāipu (KP), hākō (KP), hāliʻikuli (KP), hānaukahi (KP), hānaumua (KP), hāniu (KP), hōkūao (KP), hōkūlele (KP), hūkai (KP), hūlani (KP), hūpuna (KP), iwikū (KP), iwipona (KP), kahapili (KP), kahuahale (KP), kahuahi (KP), kahuakua (KP), kahuwai (KP), kaiau (K), kaihulu (KP), kaimalolo (K), kaipiʻi (KP), kaiuli (K), kaiʻau (K), kalahala (KP), kalahale (KP), kanakamakua (KP), kaniwāwae (KP), kapakomo (KP), kaukānāwai (K), kaulahao (K), kaulalei (KP), kaulawaha (KP), kaulike (K), kaupale (KP), kaʻahale (KP), kaʻakaua (KP), kaʻalalo (KP), keikikāne (K), keikipapa (KP), kiaahi (KP), kiaao (KP), kiakahi (KP), kiakolu (KP), kialua (KP), kiaʻipoʻo (KP), kiaʻipuka (KP), kiaʻipō (KP), kiaʻāina (K), kikokahi (KP), kikolā (KP), kikomoe (KP), kikonīnau (K), kikowaena (K), kinowailua (KP), kipikua (KP), kiʻikālai (KP), kiʻipalapala (KP), koikahi (KP), koilipi (KP), komohale (KP), komoʻāina (KP), kualana (KP), kuamauna (KP), kuanui (KP), kuapapa (KP), kuapaʻa (KP), kuenehale (KP), kuhihewa (KP), kuilua (KP), kulihiamoe (KP), kumualakaʻi (KP), kumukūʻai (K), kumulau (KP), kumuwai (KP), kupunawahine (KP), kuʻikahi (K), kuʻiʻai (KP), kālaipōhaku (KP), kālaiʻāina (K), kāmaʻaloa (KP), kānemake (KP), kōhiʻai (KP), kōkea (KP), kōʻula (KP), kūemi (KP), kūhewa (KP), kūkaha (KP), kūkia (KP), kūkuluhema (KP), kūkulupapa (KP), kūlehu (KP), kūloko (KP), kūloupoʻo (KP), kūlālā (KP), kūmaka (KP), kūnānā (KP), kūola (KP), kūpaʻa (K), kūpuni (KP), kūʻē (K), kūʻēʻē (KP), laelua (KP), lanaau (KP), laukanaka (KP), laukoa (KP), laukī (KP), laukō (KP), laulama (KP), laulima (K), laumake (KP), lauwili (KP), lauʻulu (KP), lawaiʻamanu (KP), lawakua (KP), lawehala (K), lawehana (KP), laweola (KP), leialiʻi (KP), leihala (K), lelehuna (K), lelepono (KP), leleʻōpeʻapeʻa (KP), leopaʻa (KP), leowaena (KP), leowahine (KP), lewalani (K), lokowai (K), lolehana (KP), lolelua (KP), lolokaʻa (KP), luapō (KP), lunahana (K), lunakahiko (K), lunakaua (KP), lunakiaʻi (KP), lunakiʻekiʻe (KP), lunakoa (KP), lunakānāwai (K), lunamanaʻo (K), lunaʻohana (KP), lunaʻōlelo (K), lāhana (KP), lāhuikaua (KP), makaala (K), makahakahaka (KP), makahiamoe (KP), makakoa (K), makaluku (KP), makamomi (KP), makapaʻa (KP), makapouli (K), makapō (K), makawai (KP), makehewa (KP), makewai (K), makuakāne (K), makualiʻi (KP), manamanalima (K), manamananui (K), manamanawāwae (K), manawaʻino (KP), manaʻolana (K), manaʻopaʻa (KP), manaʻoʻiʻo (K), manuihu (KP), maʻaweʻula (KP), moamahi (KP), moanakai (KP), moanawai (KP), moeone (KP), moeʻino (KP), moeʻuhane (K), mokukaua (K), mokumāhu (KP), moʻamaka (KP), moʻoaliʻi (KP), moʻokanaka (KP), moʻokupuna (KP), moʻokūʻauhau (K), moʻolele (KP), moʻoʻōlelo (KP), mulihope (KP), naʻaulua (KP), naʻaupono (KP), nohoaliʻi (K), nohopaʻa (KP), nukuwai (KP), nānāao (KP), nānāuli (KP), omokoko (KP), omoliu (KP), onehānau (K), oneʻā (KP), paepaepuka (KP), pahukani (KP), pahukapu (KP), pahupalapala (KP), palaimaka (KP), palekai (K), palekaua (KP), palekeiki (KP), palemaka (KP), paleuhi (KP), panapoʻo (KP), panapua (KP), panipuka (KP), panipū (KP), papahola (KP), papakea (KP), papalalo (KP), papamanamana (KP), papapalapala (KP), papapāʻina (KP), papapōhaku (KP), papawaena (KP), papaʻaina (KP), paʻahana (K), paʻahao (K), paʻapoepoe (KP), paʻawaha (KP), paʻaʻili (KP), pihalima (KP), pipiwai (KP), poʻohina (KP), poʻokepa (KP), poʻopaʻa (K), poʻoʻōlelo (KP), puapoʻo (KP), pukahale (KP), pukaihu (KP), pukamakani (KP), punikoko (KP), puniwaiwai (KP), puʻukaua (KP), puʻuone (K), puʻuwai (K), pāpalealiʻi (KP), pīkai (KP), pōhakuhele (KP), pōʻailōʻihi (KP), pōʻaipuni (KP), pōʻaono (K), pōʻele (K), uhikino (KP), wahahewa (KP), waiea (KP), waikai (KP), wailana (KP), waipaʻa (KP), waipuna (K), waiua (KP), waiʻauʻau (KP), waiʻele (KP), waiʻeleʻele (KP), waʻapā (KP), ʻahakanaka (KP), ʻahuao (KP), ʻahuʻula (K), ʻahāinu (KP), ʻahālike (KP), ʻahāʻaina (K), ʻaialo (KP), ʻaikapu (K), ʻakahenehene (KP), ʻaulike (KP), ʻaʻaniu (KP), ʻaʻapua (KP), ʻililua (KP), ʻohākulaʻi (KP), ʻukukapa (KP), ʻukupoʻo (KP), ʻulukahiki (KP), ʻōleloaʻo (KP), ʻōlelopaʻa (KP), ʻōpūao (KP), ʻōpūhao (KP), ʻōpūhue (KP), ʻōʻōahi (KP), ʻōʻōhao (KP), ʻōʻōhou (KP), alahaka (K), kuahao (KP), kuamoʻo (K), laʻamake (KP), laʻaua (D), laʻaulu (KP), puʻukani (K), wiliʻau (KP), ʻikepili (K)

### P17 (309)

akeloa (KP), akemāmā (K), alakaʻi (K), anapuni (K), anawaena (K), anaʻāina (KP), aʻakoko (KP), aʻalele (KP), aʻalolo (KP), haipule (KP), hakakau (KP), hakuhale (KP), hakuwahine (KP), hakuʻōlelo (KP), halealiʻi (K), halekaua (KP), halekaʻa (KP), halekia (KP), halelewa (KP), halelole (KP), halemalu (KP), hamoʻula (KP), hanamana (K), haomanamana (KP), haowaha (KP), haupia (KP), hauʻoli (KP), heiheinalu (KP), helekū (KP), hiʻilani (KP), hoahana (K), hoahanauna (KP), hoahele (KP), hoakipa (KP), hoakoa (KP), hoalawaiʻa (KP), hoapaio (K), hoaʻai (KP), hoaʻōlelo (KP), hoewaʻa (K), holowaʻa (KP), holoʻai (KP), hualiʻi (KP), huamele (KP), huamoa (K), huaʻale (KP), hueʻili (KP), hukiwai (KP), hulilua (KP), huluʻiʻiwi (KP), hunakaua (KP), hāipu (KP), hākō (KP), hāliʻikuli (KP), hānaukahi (KP), hāniu (KP), hūkai (KP), hūlani (KP), hūpuna (KP), iwikū (KP), iwipona (KP), kahaone (KP), kahapōʻai (KP), kahuahale (KP), kahuahi (KP), kahupuaʻa (KP), kahuwai (KP), kanakamakua (KP), kanikau (K), kaniwāwae (KP), kaukahi (KP), kaukānāwai (K), kaulahao (K), kaulalei (KP), kaulawaha (KP), kaulike (K), kaulua (KP), kaupale (KP), kaʻahale (KP), kaʻakaua (KP), kaʻalalo (KP), kaʻaluna (KP), kaʻapuni (K), kaʻawale (KP), keikipapa (KP), kiaahi (KP), kiaao (KP), kiaʻipuka (KP), kiaʻipō (KP), kikolā (KP), kikomoe (KP), kiloheʻe (KP), kiʻikālai (KP), kiʻipalapala (KP), komoʻāina (KP), kuahao (KP), kualana (KP), kuanui (KP), kuapuʻu (K), kuenehale (KP), kuilua (KP), kulihiamoe (KP), kumualakaʻi (KP), kumukānāwai (K), kumukūʻai (K), kumulau (KP), kumupaʻa (K), kumuwai (KP), kupunawahine (KP), kuʻihao (K), kuʻikahi (K), kuʻiʻai (KP), kālaipōhaku (KP), kālaiʻāina (K), kāmaʻaloa (KP), kānemake (KP), kāwilimanu (KP), kēʻai (KP), kōhiʻai (KP), kōʻula (KP), kūemi (KP), kūhewa (KP), kūkaha (KP), kūkala (K), kūkia (KP), kūkuluhema (KP), kūkulupapa (KP), kūlehu (KP), kūloupoʻo (KP), kūlālā (KP), kūmaka (KP), kūnihi (KP), kūnānā (KP), kūola (KP), kūpono (K), kūpuni (KP), kūʻai (KP), kūʻau (KP), kūʻēʻē (KP), laelua (KP), lanaau (KP), lauhala (K), lauhoe (K), laukanaka (KP), laukoa (KP), laukī (KP), laukō (KP), laulama (KP), laumake (KP), lauwili (KP), lauʻulu (KP), lawaiʻamanu (KP), lawehala (K), laweola (KP), laʻaulu (KP), leialiʻi (KP), lelepono (KP), leleʻōpeʻapeʻa (KP), leopaʻa (KP), leowaena (KP), leowahine (KP), limahema (K), limakuhi (K), limaʻākau (K), lolehana (KP), lolokaʻa (KP), luapō (KP), lunakiʻekiʻe (KP), lunakoa (KP), lunaʻohana (KP), lāhuikaua (KP), makahakahaka (KP), makahiamoe (KP), makakoa (K), makaluku (KP), makamomi (KP), makamua (K), makanahele (KP), makapaʻa (KP), makapouli (K), makapō (K), makawai (KP), makehewa (KP), makewai (K), manawaʻino (KP), manaʻopaʻa (KP), manuhelekū (KP), manuihu (KP), maʻalahi (KP), maʻaweʻula (KP), moamahi (KP), moanakai (KP), moanawai (KP), moehewa (K), moeone (KP), moeʻino (KP), mokukaua (K), mokulele (K), mokuluʻu (KP), mokumāhu (KP), mokupuni (K), mokuʻāina (K), monakō (KP), moʻamaka (KP), moʻoaliʻi (KP), moʻokanaka (KP), moʻokupuna (KP), moʻoʻōlelo (KP), mulihope (KP), omokoko (KP), omoliu (KP), oneʻā (KP), paepaepuka (KP), pahukani (KP), pahukapu (KP), pahupalapala (KP), palaimaka (KP), palekai (K), palekaua (KP), palekeiki (KP), palemaka (KP), paleuhi (KP), panapoʻo (KP), panapua (KP), panepoʻo (KP), panipuka (KP), panipū (KP), panipūpū (KP), papahola (KP), papakea (KP), papalalo (KP), papamanamana (KP), papapalapala (KP), papapāʻina (KP), papawaena (KP), pauaho (K), paʻakai (K), paʻiaʻa (KP), pihalima (KP), poʻohina (KP), poʻokepa (KP), poʻoʻōlelo (KP), puapoʻo (KP), pukahale (KP), pukaihu (KP), pukamakani (KP), punikoko (KP), puniwaiwai (KP), puʻukani (K), puʻukaua (KP), puʻulima (KP), pākū (K), pāleo (KP), pāpalealiʻi (KP), pōhakuhele (KP), pōhakupaʻa (K), pōʻailōʻihi (KP), pōʻaipuni (KP), pūkonakona (KP), uhikino (KP), uluwehi (K), wahahewa (KP), wahaheʻe (K), wahapaʻa (KP), waiea (KP), waihoʻoluʻu (K), wailana (KP), waimaka (K), waipaʻa (KP), waipuna (K), waiua (KP), waiū (K), waiūpaʻa (K), waiʻauʻau (KP), waiʻele (KP), waiʻeleʻele (KP), waʻapā (KP), wiliʻau (KP), ʻahakanaka (KP), ʻahamele (K), ʻahaʻōlelo (K), ʻahuao (KP), ʻahāinu (KP), ʻahālike (KP), ʻahāʻaina (K), ʻaialo (KP), ʻakahenehene (KP), ʻauinalā (K), ʻauinapō (KP), ʻaulike (KP), ʻauwai (KP), ʻaʻaniu (KP), ʻaʻapua (KP), ʻikepili (K), ʻililua (KP), ʻohākulaʻi (KP), ʻoihana (K), ʻualakahiki (K), ʻukukapa (KP), ʻukulele (K), ʻukupoʻo (KP), ʻulukahiki (KP), ʻōleloaʻo (KP), ʻōpūao (KP), ʻōpūhao (KP), ʻōpūhue (KP), ʻōʻōahi (KP), ʻōʻōhao (KP), ʻōʻōhou (KP)
