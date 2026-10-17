# Pōhaku Tumble word review — completeness and consistency critic

Scope: the 905 first-read records (`review/batch-000…045.json`), the second readings
(`second/chunk-0…7.json`), the 11 rulings (`adjudicated/chunk-0.json`) and
`reviewer_notes.md`, checked against the dossiers, `compounds.tsv`, the Andrews–Parker
OCR, the local Wiktionary extract, the local POLLEX crawl
(`.cache/pollex/hawaiian-reflexes.json`) and the UH HIGP list of Pukui & Elbert entries
(`adjudicator-0/pohaku_words.txt`). Helper scripts are in `scratchpad/lang/critic/`.
Nothing here was looked up on a forbidden site. My own knowledge of Hawaiian is not used
as evidence anywhere below.

## 1. Bottom line

The file is structurally complete and the orthography is clean. The *verdicts* are not
yet one consistent list:

- **Nobody has defined what "attested", and so "keep", means.** 52 of the 166
  first-read keeps have a spelling and word break attested only by modern usage
  (Hawaiian Wikipedia, news, Kamehameha Schools, OHA). The second reader is
  inconsistent on these too. Of the 12 usage-only or secondhand-P&E keeps it sampled, it
  downgraded 5 to keep-pending ("corroborated" or "inferred") and left 7 as
  keep/attested. Nobody ruled on it.
- **About 20 root-level §4.3 questions were settled differently in different batches**,
  sometimes against words that share a sense id. The same flag yields keep-pending in one
  batch, doubtful in a second and drop in a third, or is not raised at all.
- **Sense ids still draw false stone links** in at least 12 roots. Examples: *loko*
  (pond and disposition), *lole* (reverse and cloth), *make* (desire and death), *koa*,
  *kapa*, *manu*, *au*, and *maka* in *makamua*.
- **New pipeline inventions** turned up that the readers missed: kaihulu, ʻōpūhao and
  kiʻikālai. Readers also missed **Pukui & Elbert evidence** sitting in the local
  POLLEX crawl (akeloa, aumihi, haiʻai, hikilele) and in the HIGP list (oneʻā, hōkūlele,
  luapele, hōkūhele, makahakahaka, kualono).

Counting only keeps with no open caveat (a dictionary-attested spelling, no pending root
ruling, a sense id that does not lump two roots, and stones that spell the form), about
**80 of the 166** stand unconditionally. Most of the rest need one Pukui & Elbert lookup
or one project ruling, not more research.

Totals as filed: keep 166, keep-pending 340, doubtful 212, drop 187.

## 2. Programmatic checks

| check | result |
| --- | --- |
| every candidate present once | 905/905 dossier words present, no duplicates, none extra. `split` and batch agree with the dossier for every record. |
| every field present | all 24 required fields (plus `reviewer_knowledge`) in all 905 records. All enum fields take allowed values. `exclusion_flag` is boolean; `exclusion_reasons` and `web_sources` are lists. |
| ʻokina U+02BB only | no `'`, `‘`, `’`, `ʼ` or backtick in any `form`. Every ʻokina is followed by a vowel. Glosses and lits contain apostrophes only in English possessives (18 glosses, 11 lits, e.g. "chief's house"). "an ahupuaʻa's yield" (ʻaiahupuaʻa) is the only possessive attached to a Hawaiian word. |
| NFC kahakō | every form, gloss and lit is NFC. |
| lowercase forms (§4.4) | **7 capitalised forms**: Hōkūao, Hōkūloa, Pōʻakahi, Pōʻakolu, Pōʻalima, Pōʻaono (a keep), Waiʻaleʻale. |
| form vs word_break | consistent everywhere (a space iff break 2). |
| sense ids exist in dossier | 2 do not: ʻahāinu and ʻahāʻaina use `ʻaha#0`, but the split root is ʻahā "four" (see §7). |
| gloss/lit carry a source | every non-empty gloss and lit has a source. 148 lits are empty, 4 of them on keeps (hoaʻāina, makamua, pāleoleo, ʻaumakua). 4 glosses are empty, all on drops. waiʻaleʻale has no gloss_source. |
| gloss ≤ 6 words | all pass. |
| reviewer knowledge used as evidence | not found in any keep or keep-pending. |
| exclusion flag vs reasons | 3 records list reasons with flag false (haupia, helekū: "none"; ʻahamaka: conditional loan). 11 keep-pending records carry flag true (root-level, pending a ruling). |

## 3. Systematic leniency and strictness

### 3.1 Verdict mix by evidence code

| code | n | keep | keep-pending | doubtful | drop |
| --- | --- | --- | --- | --- | --- |
| W | 70 | 36 | 20 | 7 | 7 |
| W+A | 36 | 31 | 5 | 0 | 0 |
| A | 22 | 10 | 1 | 6 | 5 |
| A* | 777 | 89 (11%) | 314 (40%) | 199 (26%) | 175 (23%) |

**A\* outliers by batch** (the mean keep rate is 11%):

- **Lenient:**
  - batch-005: 47% keep (9 of 19), no doubtful at all;
  - batch-026: 30%;
  - batch-025: 29%;
  - batch-028: 26%;
  - batch-029: 24%.
- **Strict:**
  - batch-019: 72% drop, though mostly justified (kē-/kō-/kī- prefix and article splits);
  - batch-027: 71% doubtful, driven by the LĀʻAU root flag on 8 words;
  - batch-004: 47% drop, from the wale, ana and ʻole particles.

batch-005's keeps (hoa hana, hoe waʻa, holo lio, hoaaloha, hoahānau, hoaʻāina, holokai,
hoe uli, hoa paio) rest mostly on usage. hoe waʻa's own reason says "the only question is
whether P&E lists it … rather than leaving it a free phrase". That same doubt puts
ʻōpūnui, waiwaipio, ʻanolani and kiʻikālai at doubtful in other batches, and papalalo at
keep-pending.

### 3.2 "Attested" has two meanings (blocker)

- The first readers count reputable modern use as "attested".
- The second reader applied a stricter test only sometimes:
  - it downgraded hoahānau, kaulike, halemākaʻi and lewalani (to corroborated) and
    lehuahi (to inferred), all to keep-pending;
  - it left kikowaena, kūpaʻa, laulima, loko wai, moʻokūʻauhau, paʻahana and wailele as
    keep/attested on the same kind of evidence;
  - it moved makaala to keep-pending on a separate ground (see §8).
- None of this was adjudicated, except lehuahi, which the HIGP list rescued. The term
  needs a project definition before the keep count means anything.
- Classifying all 166 keeps by where their spelling comes from:
  - Wiktionary headword: 76;
  - P&E via POLLEX: 15;
  - both: 12;
  - Wiktionary derived term: 3;
  - secondhand P&E only: 8 (9 counting the adjudicated pōhaku paʻa);
  - **modern usage only: 52**.
- For hale mākaʻi and paʻi kiʻi, Wiktionary has a one-word headword. The two-word
  `form` the reader chose rests on usage.
- The 52 usage-only keeps:
  - ahonui, haku mele, hale aliʻi, hale mākaʻi, hana mana, hoaaloha, hoa hana, hoahānau,
    hoaʻāina, hoe uli, hoe waʻa, holokai, holo lio, hope poʻo, hua moa, huewai, huikala,
    hunakai, kai uli, kau kānāwai, kaulahao, kaulike, kaʻahele, kiaʻāina, kikowaena,
    kumukūʻai, kuʻikahi, kālaiʻāina, kūpaʻa, laulima, lei hala;
  - loko wai, lua pele, luna hana, lunakahiko, lunamanaʻo, lunaʻōlelo, manamana lima,
    manamana nui, manamana wāwae, moeʻuhane, moku kaua, moʻokūʻauhau, noho aliʻi, one
    hānau, paʻahana, paʻi kiʻi, poʻopaʻa, poʻowai, puʻuone, wailele, ʻahaʻaina.
- Several of these lean on Hawaiian Wikipedia alone. Readers themselves report
  machine-generated filler in it (makuakāne, kālaiʻāina, hana mana), and the counts can
  mislead (pōʻele's six hits are all pōʻeleʻele).
- **30 two-word keeps** have no dictionary evidence that they are lexemes rather than
  free phrases. Usage cannot tell the two apart; only a P&E sub-entry can:
  - haku mele, hale aliʻi, hale mākaʻi, hana mana, hoa hana, hoe uli, hoe waʻa, holo lio,
    hope poʻo, hua moa;
  - kai au, kai ea, kai malolo, kai uli, kai ʻau, kau kānāwai, lehu ahi, lei hala, lewa
    lani, loko wai;
  - lua pele, luna hana, manamana lima/nui/wāwae, moku kaua, noho aliʻi, one hānau, paʻa
    kāhili, paʻi kiʻi.

### 3.3 The web-search budget ran out for 20 batches

- WebSearch was refused (200/200) for batches 012, 017–023, 028–034 and 041–045. It was
  partly refused for 011 and 040.
- In those batches A\* keeps are 9% (13% elsewhere), and inferred spellings are 70%
  (62% elsewhere).
- Their keep-pending words have had less chance of promotion, and less screening, than
  the same kind of word in batches 000–010 or 024–027. This is a source of batch
  inconsistency that no reader could fix.

## 4. Root-level §4.3 questions: one ruling each, applied mechanically

Each row is one flag that was decided differently in different places. Until each is
ruled, no word on that root should be "keep".

| root (sense that raises it) | how the batches decided |
| --- | --- |
| HUA (testicle: Andrews n. 5; POLLEX P&E *fua) | 006, 011, 026, 029, 036 flag it. **007 does not**: huamoa and huaʻōlelo are keep; huaʻai, huaʻale, huamele and huanoni are unflagged. The adjudicators said none can be keep, but huamoa is still keep. |
| HUNA (genitals, Andrews huna n. 3 under "hide") | 008 flags hunakaua and hunawai (keep-pending + flag) and luahūnā. **hunakai (007) and lelehuna (024) are keep, unflagged.** |
| LUA#1 (toilet, Wiktionary) | halelua dropped citing it (003). **luapele keep and luapō keep-pending unflagged (025/026)**; luapaʻahao unflagged; kōlua gets a note only; luapuhi is flagged conditionally. |
| KAʻA#0 (cathartic, Andrews kaa v. 5) | holokaʻa **dropped** on it (005). kaʻapuni and kaʻahele keep, and 13 more kaʻa words, unflagged. |
| LEPO (dung) | halelepo, hunalepo and pālepo are **doubtful**. lepohānai and pōhakulepo are **drop** on the same single reason. |
| PIʻI#0 (vulgar sense, Wiktionary) | alapiʻi and waipiʻi doubtful; **kaipiʻi keep-pending** with the same flag. |
| LĀʻAU (male erection, POLLEX P&E) | 12 words doubtful (2 more dropped on other grounds); **ululāʻau keep-pending** with the same flag. |
| KAPA (labia, POLLEX P&E; Andrews n. 4) | kapakahi, kapa komo and ʻuku kapa keep-pending + flag; kapa kuʻina doubtful. |
| MŪ#2 (captor of war prisoners / procurer of sacrificial victims) | lelemū **dropped** as sacrifice vocabulary (024). **papamū keep with the same sense id mū#2** (035). |
| ʻOLE (the negator) | hauʻole, huaʻole, hūʻole and luaʻole are doubtful + flag; haʻiʻole, kahuaʻole, makaʻole and ʻoleloa are drop. **ʻouʻole doubtful, unflagged.** |
| WALE (particle "only") | 11 words dropped as grammatical. **kaʻawale keep-pending; lapuwale doubtful.** |
| ANA (nominaliser) | all drop, but kuiana and kahuana are unflagged. |
| AKUA (god; ghost; idol) | akuahānai, akualele and akuamakua dropped (000). **kahuakua keep-pending; ʻaumakua keep.** DESIGN §8 excludes deity imagery. |
| HEʻE#1 (menses, Andrews) | raised in batches 040/041. heʻe nalu and wahaheʻe are keep, unflagged. |
| ʻIKE (carnal knowledge, Andrews) | ʻikepili keep, unflagged (043 asks for a ruling). |
| MOE ("lie with"; moekolohe) | never flagged; aumoe, moehewa and moeʻuhane are keep. |
| LOA (receptacle of filth), NOA (prostitute), KEʻA (breeding male), PALA (excreta, syphilis), HAI/HAʻI (lascivious) | flagged or noted unevenly. |

POLLEX also shows P&E's **hai** is "offering, sacrifice" (no ʻokina; haiʻai "food
offering" < PPN *fai-kai). That bears on the hai/haʻi question that batches 001, 002
and 004 left open.

**Fix:** have the design owner and a kumu rule once per row. Then apply each ruling by
script, mapping:

- flag + exempt → verdict on the word's own evidence;
- flag + excluded → drop.

Record the ruling in the root glossary, not in 905 rows.

## 5. Sense ids

### 5.1 One id covering two roots, so stones link falsely

| id | words that would link wrongly |
| --- | --- |
| `loko` | lokowai "pond" (keep) with lokomaikaʻi and lokoʻino "disposition" (keep) and kūloko "inside". POLLEX has separate *loto entries for pool, inside and character. |
| `lole` | lolelua "turned twice; fickle" (Andrews lole v. 1 "reversed") with halelole and lolehana "cloth". |
| `make` | makewai, keep: lit "desire for water" (Andrews "Make, to desire"; POLLEX *mate "desire"). The `make` id is "death; to die", so it links to kānemake, laumake and laʻamake (dead). |
| `au` | aumoe "time" (adjudicated to unresolved) with aumiki, kaiau and lanaau "current". |
| `kapa` | kapakahi "side" with kapa komo and ʻuku kapa "tapa". POLLEX separates *tapa edge, *tapa bark-cloth and *tapa labia. |
| `manu` | manuihu "canoe end-piece" (Andrews manu n. 3) with the bird words manuhelekū, kāwilimanu and lawaiʻa manu. |
| `koa#0` | lunakoa "officer of soldiers" with laukoa "koa leaf". Meanwhile hoakoa "fellow soldier" is koa#1, so the same soldier meaning is split across two ids. Batch-005 flagged the Wiktionary mis-split; batch-026 used the other id. |
| `maka#0` | makamua (keep): the record says the maka is "point, front, beginning", "which Wiktionary's maka#0 does not list", yet it assigns maka#0 "eye", so it links to waimaka and makapō. |
| `hao#0` | paʻahao (keep): "the two disagree on which hao" (Wiktionary robber, Andrews iron), yet hao#0 "iron" is assigned. |
| `ʻau#0` | ʻaumakua (keep): the record says the sense is "group" (PN *kau.2) and "ʻau#0 should" be split, yet it links to ʻaulima and kūʻau "handle". |
| `hau#0` | haupia: the record says "ice/dew + arrowroot doesn't add up", yet hau#0 is assigned. |
| `ake` | akeakamai "desire" with akemāmā and akeloa "liver". One etymon (*qate), but the cards gloss the stone two ways. Batch-000 asked for a decision. |
| `ea` | kaiea "rising", kinoea "air" and waiea "life". One POLLEX etymon, so probably fine, but the glossary line must cover all three. |
| `lima` | five/hand lumped; harmless now because only pōlima (dropped) uses "five". |

### 5.2 Two ids for one root

- **lā:** ʻauinalā uses lā#1 "sun"; lāhana, kikolā and anilā use lā#2 "day". POLLEX
  *laqaa is one etymon ("sun; day"), and DESIGN pairs ʻauinalā with ʻauinapō "the night
  declining".
- **koa:** soldier on both #0 and #1 (above).

### 5.3 The adjudicators' rule applies beyond the four words they named

The rule is: assign a sense id only when the sources agree or P&E settles it. Besides
aumoe, kahawai, ʻauwai and huaʻōlelo, it applies to:

- makamua, paʻahao, ʻaumakua and haupia (above);
- hikilele (POLLEX PCE *fiti-rere: the HIKI here is *fiti "startle", not hiki "arrive").

## 6. Candidates invented by the OCR repair, newly found

Each A/A\* bracket was compared with the headword and pronunciation guide that Andrews
actually prints (`critic/ocr5.py`):

| word | first-read verdict | Andrews prints | consequence |
| --- | --- | --- | --- |
| kaihulu | keep-pending | **Kaiahulu** (ka'i-a-hu'-lu), n. and v., OCR l.36634/36638 | The record says "the OCR has no other kaihulu or kai hulu". The candidate is the pipeline's; the attested word has an *a*. Downgrade to doubtful or drop, as for ahihonua. |
| ʻōpūhao | keep-pending | the bracket [Opu, abdomen, and hao …] "dropsy" belongs to **Opuohao** (o-pu'-o-ha'o), l.78120 | Andrews' real Opuhao (l.77981) is "a pain in the stomach caused by prolonged fasting", with no bracket. The gloss "dropsy; hard, swollen belly" comes from the wrong headword. |
| kiʻikālai | keep-pending | **Kiikalaiia** (ki'i-ka'-lai'-i'a), l.43946 | That is kiʻi kālai ʻia, a passive phrase. Not a two-root headword. |
| kūʻau | keep-pending | the bracket [Ku, stand, a, and au, swim] belongs to **Kuaau** | The word itself is P&E-attested (POLLEX kūʻau < *tuu-kau), so it stands, but not on Andrews' bracket. |

Four more were recognised by the first reader but left at **doubtful** although they are
the same failure the adjudicators ruled **drop** for ahihonua:

- kaʻalewa (Kaalelewa);
- lelehāuli (Lelekahauli, with the article ka);
- makuawahine (the headword is Makuahine);
- ʻulakoko (Ulaokoko, with the connective o).

**Drop forms** mix two conventions. Some keep the invented spelling (piʻiana, kuiana,
ʻokiana, holoholoana); others record Andrews' word (huiana → huina, kahuana → kahuna,
ʻohiana → ʻohina). Pick one; the adjudicators prefer the real headword.

## 7. Pukui & Elbert evidence that is local and was not used

### 7.1 POLLEX

`hawaiian-reflexes.json` is cited to Pukui & Elbert 1986.

| word | first read | POLLEX (P&E) | should be |
| --- | --- | --- | --- |
| akeloa | keep-pending, inferred, break unknown ("ake loa?") | **Ake loa** "Spleen" < PPN *qate-loa | form `ake loa`, attested, break 2; with Andrews, keep |
| aumihi | doubtful, inferred, "ʻokina on au unconfirmed" | **Aumihi** "Grieve, regret, be sorry" < PCE *au-misi | spelling attested; an inherited compound; sense of au unresolved |
| haiʻai | doubtful, inferred | **Haiʔai** "Food offering; to offer vegetable food" < PPN *fai-kai | spelling attested; P&E's hai is "offering, sacrifice" (*faqi) |
| hikilele | keep-pending, corroborated | **Hikilele** "Jump or start from shock" < PCE *fiti-rere | attested; HIKI sense unresolved |

This is the adjudicators' alahaka error, generalised. Every row with `pe_via_pollex` set
should be re-read against its POLLEX row.

### 7.2 The HIGP list

The UH HIGP list (P&E entries, secondhand) has entries the readers did not use:

- **oneʻā:** "Black sand or gravel made of ʻaʻā lava; volcanic cinder". The record has
  only Andrews' "gunpowder" (hana field, 19th-century coinage, a "weapon word"). The P&E
  sense makes it a traditional ʻāina word and changes field, register and priority.
- **hōkūlele:** "hokulele: meteor", one word. The record has inferred, break "either".
- **lua pele:** "Volcano, crater. Lit., volcanic pit". The record has break "either";
  it should be 2.
- **hōkūhele:** "hokuhele: planet", printed joined. The keep record has `hōkū hele`,
  break 2, from Wiktionary. The break is not settled.
- **maka hakahaka:** two words. The record has `makahakahaka`, break unknown.
- **kualono:** "the space on the top of a mountain; a knoll" (doubtful as filed).

The list's typing drops macrons, so use it for word break and existence, not kahakō.

## 8. Records whose stones cannot spell the word

11 keep/keep-pending records have a corrected `form` but a `split` (and so root ids)
still keyed to the pipeline spelling:

| keep | keep-pending |
| --- | --- |
| makaala → makaʻala | alaʻula → alaula (so the second stone is not ʻula "red") |
| makapouli → makapōuli | auwaʻa → ʻauwaʻa |
| ʻahāʻaina → ʻahaʻaina (sense id ʻaha#0 is not a homograph of the split's root ʻahā "four") | kakaʻōlelo → kākāʻōlelo |
| | koikahi → koʻikahi |
| | koilipi → koʻilipi |
| | pipiwai → pīpīwai |
| | wiliʻau → wiliau |
| | ʻahāinu → ʻahainu |

**Fix:** add a corrected split and re-key the sense ids. makaʻala also needs the second
reader's question answered: is the stone ʻALA or ALA?

## 9. Keeps resting on secondhand Pukui & Elbert

These keeps rest on secondhand P&E alone, or with Andrews:

- **SOEST weather-term compilation** (Kaliko High 2022, "via Puke Wehewehe"): kai au,
  kai ea, kai malolo, kai ʻau, lelehuna.
- **UH HIGP list:** lehu ahi, and pōhaku paʻa (the adjudicators upgraded both to keep).
  The list has slips: "lehua ahi", and it drops macrons.
- **SOEST + KSBE:** lewa lani.
- **A 1980 Kamehameha Schools compilation of P&E 1971:** paʻa kāhili.

These are reasonable evidence, but they are one source (P&E) reached through a
transcriber, not an independent second source. Tag them `pe_secondhand` so the P&E
lookup confirms them first.

## 10. What a careful kumu would wince at (keep and keep-pending)

- **ʻaumakua (keep):**
  - It names family gods.
  - Its lit is empty.
  - Its sense id is knowingly wrong (§5).
  - It sits on the same AKUA/deity question as three dropped akua·X words.
  - Hold it for the fluent reader, not keep.
- **papamū (keep):** its MŪ stone is mū#2. In the dossier mū#2 includes "captor of war
  prisoners to be made into slaves", and Andrews' mū is the procurer of sacrificial
  victims, which is why lelemū was dropped.
- **kahuakua (keep-pending):** "keeper of a god". The dossier's POLLEX row for kahu is
  ritual/sorcery *tafu, and the only lead was Beckwith's "Sorcery Gods" chapter.
- **kuapapa (keep-pending):** gloss "peace" but lit "hew boards". A card would
  contradict itself; show one sense only.
- **pōʻaono (keep):**
  - Pōʻakahi, Pōʻakolu and Pōʻalima were dropped because ʻa- is the numeral prefix
    (ROOTS step 5).
  - pōʻaono keeps an ʻAONO stone built from that same prefix.
  - Its form is also capitalised.
  - Treat the weekdays as one family.
- **waiʻeleʻele (keep-pending):** Andrews glosses ʻeleʻele as "a black-skinned person …
  the blacks of Africa". The root glossary must not inherit it.
- **hakuwahine:** Andrews' "mistress" must never reach a card (noted by its reader).
- **hanamana (keep):** the gloss "miracle" is Andrews' "(Biblical.)" sense, but the
  register says "traditional".
- **Death and sacred words** (luapō, kinowailua, kanikau, waiea, pahukapu, papahola,
  ʻaikapu, moʻokūʻauhau): the notes are good. They need the kumu read before any of them
  tumbles playfully.

## 11. Second reading and adjudication

- **64 of the 136 second-reading records are not in the 905.** They have no dossier and
  no compounds.tsv row ("LOCATOR ERROR", "the task's batch pointer is wrong").
  - They include kamaʻāina marked **keep**, although compounds.tsv screened it out on a
    *kama* sex flag; kuahiwi marked keep; and 11 keep-pending.
  - The stated agreement figures cover only the 72 overlapping words.
  - Quarantine the 64 so none leaks into the list.
- **8 verdict disagreements were never adjudicated:** halemākaʻi, hoahānau, kaulike,
  lewalani and makaala (keep → keep-pending); haʻiinoa and hūʻole (doubtful → drop);
  pūpūhōʻaka (drop → doubtful). Field disagreements on alawai, hakuone and palekai were
  also left open.
- **The adjudication rule should be stated.** aumoe (sense unresolved) became
  keep-pending; kahawai (sense unresolved) stayed keep, because both candidate senses are
  KAHA roots in the dossier. That is defensible, but it should be written as a rule.

## 12. Source hygiene (minor)

- Judd 1939 is cited from a theswissbay.ch "Mega linguistics pack" mirror in 10 records
  (batches 025/026). It is a real dictionary, but the host is an unlicensed copy.
- Weak sites are used as evidence:
  - languagedrops (paʻaʻili, paʻapoepoe);
  - yelp (hikimoe);
  - hawaii-guide (paʻiʻai);
  - nameahawaii (hoakaua);
  - English Wikipedia (ʻahu ʻula, ʻai kapu).
- Batch-032 ran 18 ulukau.org Kaniʻāina searches (batch-036 one more). Kaniʻāina is a transcript corpus,
  not the forbidden dictionary or e-book collections, but it is on the forbidden host.
  Confirm that it is allowed.

## 13. Spot-check log

76 records were compared field by field with their dossiers, 44 of them keeps. A tick
means the gloss, lit, sources, sense ids and form are faithful to the dossier and cited
sources.

**Keeps.**

- **Fine (✓):** ahupuaʻa, akemāmā, alakaʻi, alanui, aouli, kahakai, kanikau, kuamoʻo,
  puʻuwai, paʻakai, pauaho, moehewa, hōkūnaʻi, kumupaʻa, ʻoihana, limakuhi, ʻaikapu,
  kiaʻāina, ʻukulele, uluwehi, hulipoepoe, moʻokūʻauhau (sense correctly unresolved),
  kālaiʻāina, mokuhonua, ʻilikai, makuakāne.
- **Caveat (~):**
  - akeakamai: ake lumping;
  - aumiki: the W+A code overstates, since Andrews' bracket is a different word;
  - hoaʻāina: usage-only spelling, no lit;
  - hoe uli, holokai: usage only;
  - kau kānāwai: usage only; phrase or lexeme?;
  - hōkūhele: break conflicts with HIGP;
  - paʻi kiʻi: two-word, usage only;
  - pāleoleo: one source plus usage, no lit;
  - lua pele: LUA#1 flag inconsistency; break 2;
  - lehu ahi, pōhaku paʻa: secondhand P&E.
- **Wrong (✗):**
  - aumoe: sense (adjudicated);
  - makamua, paʻahao, ʻaumakua: senses;
  - lokoʻino, lokowai, lokomaikaʻi: loko lumping;
  - makewai: make lumping;
  - papamū: mū#2;
  - ʻahāʻaina: split;
  - pōʻaono: prefix, capital;
  - huamoa: HUA ruling.

**Others.**

- **Fine (✓):** alawai, kumuwai, lolelua, luapō, hoakipa, kinowailua, lelemū (drop),
  hānaukahi, pāpale aliʻi, ʻanolani, waiwaipio, ʻōpūnui, mahinaʻai, kukuiʻōlelo.
- **Caveat (~):** kaʻawale (WALE inconsistency), kuapapa (gloss and lit clash),
  kahuakua (sorcery adjacency).
- **Wrong (✗):**
  - kaihulu, ʻōpūhao, kiʻikālai: invented headwords;
  - akeloa, aumihi, haiʻai, hikilele: POLLEX missed;
  - oneʻā, hōkūlele: HIGP missed;
  - ʻahāinu: split;
  - kūʻau: bracket from Kuaau;
  - kaʻalewa, lelehāuli, makuawahine, ʻulakoko: should be drop, not doubtful.

## 14. What to do, in order

1. **Define "attested"** as a printed dictionary headword (P&E via POLLEX or a
   reproduction, or a Wiktionary headword). Treat usage as "corroborated". Re-label the
   52 usage-only keeps as `keep (usage)` or keep-pending. Either way they are the
   cheapest P&E lookups.
2. **Get one ruling per root in §4** from the design owner and a kumu, then apply the
   rulings by script.
3. **Fix the sense ids in §5:**
   - split loko, lole, make, kapa, manu and koa;
   - merge lā#1/#2;
   - set makamua, paʻahao, ʻaumakua, haupia and hikilele to unresolved.
4. **Apply the drop rule for pipeline inventions:**
   - drop kaihulu and kiʻikālai;
   - re-gloss ʻōpūhao from Andrews' real Opuhao or drop it;
   - move kaʻalewa, lelehāuli, makuawahine and ʻulakoko to drop.
5. **Re-read every `pe_via_pollex` row against POLLEX, and every ʻāina/lani/kai row
   against the HIGP list.** That fixes at least akeloa, aumihi, haiʻai, hikilele, oneʻā,
   hōkūlele, lua pele, maka hakahaka and hōkūhele.
6. **Add a corrected `split` to the 11 records in §8.**
7. **Lower-case the 7 forms. Quarantine the 64 out-of-scope second readings.**
   Adjudicate the 8 open disagreements.
8. **Re-run web corroboration** for keep-pending words in the 20 search-blocked
   batches, highest degree first.
