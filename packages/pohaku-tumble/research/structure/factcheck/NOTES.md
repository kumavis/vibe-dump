# Fact-check of STRUCTURE.md and the six level notes (working notes)

Research only; nothing here proposes a design change. Re-runs use independent code.

## Re-run measurements (scripts/ -> tables/)
- `corpus_checks.py` (cleaned corpus, 310,077 tokens): KEAO ka/ke fit 91.5% (claimed 91.3%), word-majority 95.6% (95.5%);
  *ke ʻano* 734 (734); long plural form after nā/mau 362, short 74 -> 83.0% written long (claimed 82.1%), long form in plural
  context 94% (93.1%); possessive and pronoun grid counts identical to grammatical-paradigms tables; kin a-share keiki 0.89,
  kaikamahine 0.94, wahine 0.96 (same); deixis kēia 1,109 / kēnā 1 (+ *kena* 2) / kēlā 240; ʻoi aku 85, ʻoi aʻe 19, emi mai 4,
  emi iho 2 (same); kūʻai mai 5 / aku 26 (same).
- `mark_pairs.py`: Wiktionary content forms 1,717 (1,721); ʻokina pairs 53 (53); length pairs 37 (36), 11 glossed "plural of"
  (11); POLLEX ʻokina pairs 89, 4 "related" by the same-proto-string rule (same 4 as historical study) — but ʻao/ʻaʻo is a
  false positive (ʻao "sprout"/"dried taro" vs ʻaʻo "shearwater", different POLLEX entries that share the string *kao);
  POLLEX length pairs 58, 8 related (same).
- `misc_checks.py`: 228/1,717 = 13.3% of content forms merge without marks (13%); hō- + ʻX 19 vs hoʻo- + ʻX 2 (19–20 of 21);
  Wiktionary labels 33 "Niʻihau form of", 8 "Lānaʻi form of" (n for l).
- `kin_frame.py`: GEN×SEX 8/8 cells, but moʻopuna kāne / moʻopuna wahine are 1 token each.

## Source checks (verbatim found)
Alexander 1920 §§1–4, 13, 15–17, 24, 29–36, 42, 43, 52, 55; Andrews 1854 numerals (ahia/ehia, "modern improvement" kana-);
Wilson 1980 (ex. 2.1–2.2, "difficult to find nouns…", Clark 1976 quote, k-a-ʻu < *t-aqa-ku); Baker 2012 abstract; Lyon 2018;
Kimura & Counceller 2009 guidelines 1, 5, 6; Hosoda 2019 (hale kuke…, E&P p.124 quote); Shionoya 2008 abstract; A&M 2015;
Brittain 1993; Medeiros 2020; WALS 87A; PVS lunar month page; Parker Jones 2018 (via Cambridge page); A–P entries Kou, Kena,
Kaikuaana, Kaikamahine, Kuekuewawae, Mao, Lilo, Unu.

## Problems found (details in the structured return)
1. Lyon 2018 misattributed: he (and E&P 1979 as he quotes them) treat **kēnā as the living, "more common"** form; only
   postposed nā, pēnā, demonstrative nā and ua…nā are obsolete/rare. "Functionally binary" rests on an encyclopedic corpus
   with no addressee and on 19th-c. Andrews/Alexander.
2. ʻao/ʻaʻo is not a variant pair (see above): 86/89 unrelated, 3 related.
3. 19th-c. spelling did sometimes write koʻu ≠ kou: Alexander §4 says the apostrophe was used "in a few common words, to
   distinguish their meaning, as ko'u, my, kou, thy"; Parker writes A'u, Ka'u, Na'u, No'u, O'u. A–P has two separate "Kou"
   pronoun entries, not one headword.
4. mao mai/aku is A–P "Mao, adv. There; over there … yonder" (= ma ʻō), not a verb: 9 glossed V + mai/aku pairs, not 10.
5. makai "seaward" ≠ mākaʻi "police officer" (Wiktionary) — homograph only in unmarked spelling.
6. Night 17: PVS spells Kulua but quotes Handy & Pukui "Kulu"; POLLEX *turu (PCE "a night after the full moon"; Tahitian turu
   "17th night") is the regular source of kulu; the POLLEX row "Kū lua" glosses both day 4 and day 17.
7. hapa < English "half" (Alexander §33; Wiktionary); kana- 50–90 missionary (Alexander §29; Andrews 1854); Pōʻa- weekdays
   post-contact. The digit frames are mostly 19th-c. coinages.
8. POLLEX has (w)au < *au (pronoun) — "au not in POLLEX" is wrong; hoʻokahi "one" prefix is POLLEX *soko-, not *faka-;
   lau 400 has two POLLEX rows (*lau and *rau).
9. Parker Jones: [k]/[t] non-contrastive, historically a T/K dialect split; [w]/[v] "vary freely". "free variants" for k~t
   is loose.
10. Tahitian "ties" at 9 classes only if partial *f>h (62%) counts as a merger; otherwise Tahitian 10, Māori 11.
