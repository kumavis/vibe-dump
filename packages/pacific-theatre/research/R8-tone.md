# R8: tone, framing, names and the rules the app practises

Research for **Pacific Theatre** (`pacific-theatre`), written 2026-10-22 by
researcher R8 for the designer. It reads the Hawaiian app's tone rules
(`hawaiian-docs/DESIGN.md` §7.3–7.4, §8, §9, §12) and the current draft
(`design/DESIGN.md` §3.5, §7.3–7.4, §11, §12) against how the war's museums,
memorials and governments word it on both sides; then proposes the terms, the
rules for the hard cases the owner's decisions create, the licence position
and the name's assessment.

"Opened" means R8 fetched the page and read the passage quoted. Anything not
opened is marked *verify*. Tertiary sources (Wikipedia) are named as such and
are finding aids, not the record. Every quotation is exact unless marked as a
paraphrase. Downloads (text extracts only) are in
`research/downloads/R8/`; the one helper script is in `research/r8-scripts/`.

---

## 0. Headline findings

1. **Every institution words its own dead and leaves the other side's dead
   out, except four.** The Okinawa Cornerstone of Peace names everyone who
   died "regardless of their nationality or military or civilian status"
   (242,225 names in June 2024: 14,010 Americans, 82 British, 381 South
   Korean, 82 North Korean, 34 Taiwanese); Guam's memorial wall names US
   servicemen and the people of Guam together; Abe's 2016 Pearl Harbor
   speech and Obama's 2016 Hiroshima speech each mourn the other country's
   dead. These four are the app's register. Pearl Harbor's NPS pages name no
   Japanese dead; Yasukuni enshrines 2,466,000 "柱" of Japan's dead,
   including those executed as war criminals, and no one else's.
2. **The register the app can use on both sides is "lost their lives" and
   「命を落とした」.** It is the National Park Service's phrase for Arizona's
   1,177 and Oklahoma's 429, Abe's phrase at Pearl Harbor, and it carries no
   glory. Avoid 英霊, 散華, "the fallen heroes", "gave their lives",
   "sacrifice" in the app's voice: those are Yasukuni's and the Fredericksburg
   museum's registers. The verb follows the cause: crews "lost their lives";
   civilians killed on purpose "were killed"; prisoners on marches and ships
   "died"; aircraft "did not return" (未帰還, the Japanese records' own
   term).
3. **The Japanese government has no official name for the war.** It decided
   on 大東亜戦争 on 12 December 1941 (JACAR), the occupation banned the term
   in official documents on 15 December 1945, the government says 「太平洋戦争」
   is "not a term the government defines" (2007), and Prime Minister Ishiba
   said on 10 October 2025 that 太平洋戦争 is an American-given name and
   大東亜戦争 carries a value judgement, so he says 先の大戦. The Okinawa
   museum's founding statement says アジア・太平洋戦争. For a Japanese reader
   **太平洋戦争** is the plain, most-used choice (38.5 % in a 2020 Mainichi
   poll, behind 第二次世界大戦; *verify*, cited at second hand); 大東亜戦争
   belongs only in the prologue card, as the name the government gave it.
4. **Use "tokkō (special attack)" in the app's voice and gloss "kamikaze"
   once.** Chiran's own English says "Tokkō"; the Japanese navy's units were
   神風特別攻撃隊, read *shinpū* by the man who named them and *kamikaze* by
   others (ja.wikipedia, *verify*). Chiran's founding statement calls the
   tactic one that "ignored the value and dignity of life"
   (命の尊さ・尊厳を無視した戦法): the app can let that museum speak for the
   pilots' side without glory.
5. **Two terms in the draft should change.** "Internment of Japanese
   Americans" → **the incarceration of Japanese Americans** (JACL's 2013
   handbook: "internment" is the legal term for the Justice Department's
   camps for enemy aliens; Congress in 1988 found the removal "motivated
   largely by racial prejudice, wartime hysteria, and a failure of
   political leadership", 50 U.S.C. §4202). "Japanese personal names in
   Japanese order with the Western order on first mention" → **family name
   first, family name in capitals on first mention** (YAMAMOTO Isoroku
   山本五十六), the device the Japanese government's 2019 rule itself uses.
6. **Macrons are the norm again.** Cabinet Notice No. 4 of 22 December 2025
   (the first revision of official romanisation in about seventy years)
   adopts Hepburn-style spellings and keeps the macron as the usual way of
   marking long vowels (Ōno, Yūki), allowing doubled vowels (Oono) as an
   alternative and asking that people's own spellings be respected.
7. **The Pearl Harbor attacker's seat has seventeen years of precedent and no
   recorded veterans' campaign.** Koei's 提督の決断 / *P.T.O.* (1989),
   *Attack on Pearl Harbor* (2007) and *Battlestations: Pacific* (2009) all
   let the player take the attacking side, the last two in the cockpit; the press called the last "a controversial
   look" that "relives the bombing of Pearl Harbor from the eyes of the
   aggressors". The backlashes that did happen came from four other things,
   each of which the rules below avoid: an enemy of a current war made
   playable (*Medal of Honor*, 2010, renamed "Opposing Force" after families
   of the fallen objected); the atomic bombing framed with Japan as victim
   (the Smithsonian's *Enola Gay* exhibit, cancelled 30 January 1995 after
   the American Legion and the Air Force Association called for it); the
   Rising Sun ensign on ships (*World of Warships*, removed 2013 after Korean
   players objected); and tokkō drawn as heroism (*The Eternal Zero*, 2013).
8. **The hard cases need four rules the draft does not yet have.** (a)
   Arizona, Oklahoma and Utah keep the record's fates in every run, from
   either seat, and no player unit is ever their cause; (b) the after-card's
   "your battle" speaks only in ships and aircraft, "the record" carries the
   people, and the two are never set in one row or subtracted; (c) a ship past
   its fatal threshold leaves the target list, and hospital ships are never
   targets; (d) the Samar box's clock closes before the Shikishima unit's
   tokkō attack on St. Lo (about 10:50), which becomes the closing card.
9. **The GLO-30 notice in DESIGN.md §13 is the wrong one.** The Copernicus
   licence (opened) requires, for adapted data, "produced using Copernicus
   WorldDEM-30 © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH
   2014-2018 provided under COPERNICUS by the European Union and ESA; all
   rights reserved", plus a liability sentence ("The organisations in charge
   of the Copernicus programme by law or by delegation do not incur any
   liability for any use of the Copernicus WorldDEM-30") in "a licence or any
   legal warning or notice". DATA.md already has the right first half. Both
   belong in a user-visible Sources and credits panel, the box briefing's
   footer and a `NOTICE.md` in the package.
10. **The repository has no licence** (no LICENSE file, no `license` field;
    GitHub reports `license: null`), so the app is all rights reserved, and
    CC BY-SA tracings would be infringing, not just untidy: ShareAlike
    requires the adaptation to be shared under BY-SA. Facts from
    combinedfleet.com are free to use (*Feist*, 1991); its sentences and its
    tables' arrangement are not.
11. **"Pacific Theatre" is clear to use but not unique.** A live US service
    mark PACIFIC THEATRES (Reg. 2368501, movie theatre services, class 41,
    "THEATRE" disclaimed, owner DT Participant LLC) belongs to a defunct Los
    Angeles cinema chain; a Vancouver theatre company trades as Pacific
    Theatre; Koei's 1989 game is *P.T.O.: Pacific Theater of Operations*.
    To a Japanese reader the military sense is 戦域 (太平洋戦域); a katakana
    パシフィック・シアター would read as a cinema. Keep the name; give the
    Japanese line as 太平洋戦争, and drop the "a theatre is also a place where
    a thing is played" pun from anything a user sees.
12. **Living memory is nearly gone but not gone.** Twelve Pearl Harbor
    veterans were known to be living at the 84th anniversary, all over 100,
    and for the first time none attended (Stars and Stripes, 7 December
    2025). The last known member of the Japanese attack force, Yoshioka
    Masamitsu, a B5N2 navigator-bombardier from Sōryū, died in August 2024
    at 106; his words ("I think of the people who died because of me") are
    the right model for an attacker's after-card. Chamorro and Okinawan
    survivors who were children in 1944–45 are alive. Every card touches
    descendants on both sides.

---

## 1. Method

- Read the Hawaiian app's DESIGN.md §7.3–7.4, §8, §9, §12 and its
  RESEARCH.md §11 ("Copy: the rule is practised, not announced", and what its
  check enforces); the current DESIGN.md §3.5, §7.3–7.4, §11–13, DATA.md's
  source and licence fields; R2's licence table and casualty tables (not
  repeated here).
- Opened each museum's or memorial's own pages where they answered (curl
  through the proxy, or WebFetch), and the Japanese pages in Japanese.
- Opened the governments' own texts where reachable (Kantei, Agency for
  Cultural Affairs, the MHLW notice quoting the 2019 name-order agreement,
  the Obama White House archive, 50 U.S.C. §4202, 17 U.S.C. §105).
- Used en/ja.wikipedia only through `action=raw`, for ranges and to find
  primary references; marked as tertiary.
- Opened the licences themselves (Copernicus DEM licence PDF, GMRT terms,
  CC BY-SA 4.0 legal code, GitHub Terms §D.5, *Feist*), and USPTO TSDR for
  the trademark.
- Searched for the game precedents and the veteran counts; opened what
  answered.

---

## 2. Framing: how each side draws the war

### 2.1 What each institution shows, leaves out, and calls the dead

| institution | what it chooses to show | what it does not show (or what critics say it leaves out) | its exact wording for the dead | opened |
| --- | --- | --- | --- | --- |
| **Pearl Harbor National Memorial / USS Arizona Memorial** (NPS) | the attack as "a pivotal moment in global history" that "marked the United States' entry into World War II"; Arizona, Utah, Oklahoma as places of the dead; the visitor centre's galleries "Road to War" and "Attack" (2010) added the Japanese side's road to war (oil, 1930s Japan) | no Japanese dead on the park's pages; no total of Japanese losses; the park's people page counts only Americans | Arizona: "the final resting place for over 900 of the ship's 1,177 crewmen who tragically lost their lives on December 7, 1941"; the Shrine Room: "a sacred space where the names of those who perished aboard the Arizona are engraved on a marble wall"; Utah: 58 crewmen left aboard, "considering them buried at sea"; Oklahoma: "429 officers, sailors, and Marines lost their lives"; the attack: "2,390 Americans, including both service members and civilians, lost their lives" (2,341 service members, 49 civilians); civilians "who lost their lives during the attack on O‘ahu", some by US anti-aircraft shells that "exploded when they hit civilian areas" | NPS pages [perl/uss-arizona], [valr/uss-arizona], [perl/index], [perl/uss-oklahoma], [perl/people], [perl/civilian-casualties]: yes. 2010 galleries: press coverage only (*verify*) |
| **The National WWII Museum** (New Orleans) | "Road to Tokyo: Pacific Theater Galleries" (2015): China-Burma-India, "Guadalcanal: Green Hell", "New Naval Warfare", and an atomic-bomb gallery, "Downfall: Endgame Against Japan" (press, *verify*); a piece of Arizona opens the Pacific galleries | its press frames the war as "how the war was won by the American-led Allied forces" (press, *verify*); the Japanese side appears as the opponent | fact sheet: "The attack killed 2,403 U.S. personnel, including 68 civilians"; Arizona "serves as a memorial to all Americans who died in the attack"; "129 Japanese soldiers were killed"; the attack was "a sneak attack!" | exhibits page, Pearl Harbor fact sheet PDF: yes; gallery panels: no |
| **National Museum of the Pacific War** (Fredericksburg) | "the nation's most comprehensive account of World War II in the Asiatic-Pacific theater"; Nimitz's promise "that it would honor not just him, but all who served and supported the war effort"; the Japanese Garden of Peace, "a gift from the people of Japan to the people of the United States" (May 1976), with a replica of Admiral Tōgō's study | the Japanese war dead as people (not found on the pages opened) | "their courage, sacrifice, and leadership" (of those who served) | about page: yes; garden: museum page via search summary (*verify*) |
| **War in the Pacific National Historical Park** (Guam, NPS) | established "to commemorate the bravery and sacrifice of those participating in the campaigns of the Pacific Theater of World War II"; the Chamorro people's occupation and the 1944 battle | — | "Honoring the Chamorro citizens and US service personnel killed during World War II"; the Asan Bay Overlook wall names "the 1,880 U.S. servicemen who died in the 1941 seizure of Guam" and the 1944 retaking, "the 1,170 people of Guam who died during the war" and "the 14,721 who suffered atrocities during the occupation and battles"; at its dedication Robert Underwood said "one liberated the island from without while the other liberated the island from within" | yes |
| **Hiroshima Peace Memorial Museum** | "Belongings left by the victims", "A-bombed artifacts", "Testimonies of A-bomb survivors"; the message "No More Hiroshimas"; since 2019 more weight on belongings and less written explanation; a permanent exhibit on non-Japanese victims (Koreans, students from Southeast Asia) | the war's context: the 1995 revision added it after Korean and Chinese visitors objected around the Hiroshima Asian Games (1994; the source summary says 1993, *verify*); a 2019 review says Nanjing now gets "a very brief mention on one text panel" (secondary, *verify*) | "a single atomic bomb ... indiscriminately killed tens of thousands of people"; "victims", "survivors". The city: "The exact number of deaths from the atomic bombing is still unknown. Estimates place the number of dead by the end of December 1945 ... at roughly 140,000"; the cenotaph: 「安らかに眠って下さい 過ちは繰返しませぬから」, whose subject the city says is "all humanity" (Pal's objection, 1952) | museum home, city FAQ: yes; cenotaph wording: Hiroshima Peace Media summaries (host 503), *verify* |
| **Nagasaki Atomic Bomb Museum** | the city before 11:02; the damage; radiation; "The Road to the Atomic Bombing" and "The War between China and Japan and the Pacific War" (tertiary) | in 1996, photographs of Nanjing, Unit 731 and the comfort women were planned and partly removed after conservative pressure (APJJF via search); in 2026 the museum's council proposed changing "Nanjing Massacre" to "Nanjing Incident", to align with official terms and textbooks, and critics objected (SCMP 403; People's Daily; *verify* the final text) | "by the end of December 1945, 73,884 of its people had been killed, and 74,909 had been injured by the A-bomb" (a July 1950 report of the Committee for the Preservation of Atomic Bomb Artifacts) | Nagasaki Peace site: yes; museum content: tertiary; 2026 dispute: search only |
| **Yasukuni Jinja and the Yūshūkan** | 2,466,000 "柱" enshrined: Japan's war dead from the Boshin war to 大東亜戦争（第二次世界大戦）, including nurses, students mobilised in factories, Taiwanese and Koreans who fought and died as Japanese at the time (その当時、日本人として戦い亡くなった台湾及び朝鮮半島出身者), and those executed at the end of the Greater East Asia War as so-called war criminals (いわゆる戦争犯罪人として処刑された方々; R8's translations); the Yūshūkan's 22 rooms and a Zero | no non-Japanese dead; critics (2005–2014) say the exhibits present the war as self-defence and liberation of Asia and that the word "aggression" does not appear (JCP 2005, CS Monitor 2005; secondary, *verify* current panels) | 「国家防衛のために…尊い生命を捧げられた方々」; 「祖国に殉じられた尊い神霊」; 英霊; English site: "the noble souls who gave up their lives for the country they loved"; Yūshūkan: "those who sacrificed their precious lives for their country" | Japanese history pages and English about/Yūshūkan pages: yes |
| **Chiran Peace Museum** (知覧特攻平和会館) | the army's tokkō pilots: their letters, artefacts, photographs; its own aim, in its founding statement: never again a tactic that "ignored the value and dignity of life", never again the war that produced such tragedy; 1,036 army tokkō dead in the Okinawa campaign, 439 from Chiran | the targets' side: the ships and men struck are not the subject; some reviewers call the tone "somewhat apologist" (travel press, *verify*); China objected to its UNESCO bid (2015) | 「特攻戦死された隊員」, 「全特攻戦死者1,036名」; English: "‘Artefacts of the Fallen’ Exhibit Room", "Army Tokkō squadron database"; the Minamikyūshū mayor (2025, AP): "They were victims of war" | yes (founding statement, background, summary, English menu) |
| **Okinawa Prefectural Peace Memorial Museum** | its founding statement (1975, revised 2000): ninety days of "the typhoon of steel" took more than 200,000 lives; Okinawa was "the only ground battle in Japan that mobilised the whole population" and "the largest battle of the アジア・太平洋戦争"; more civilians died than soldiers, "more than 100,000"; some "were driven to take their own lives", some were "sacrificed by their own retreating army" (R8's translations of 自ら命を断たされ, 敗走する自国軍隊の犠牲にされる) | — (the museum states what Tokyo's textbooks contested in 2007: the army's role in the mass suicides) | 「20数万の尊い人命を奪い去りました」; 「一般住民の戦死者」; 「戦争の犠牲になった多くの霊を弔い」 | founding statement via the prefecture's PDF: yes; museum site: connection reset / 503 |
| **Cornerstone of Peace** (平和の礎, Mabuni) | every name, every side: "all the names of the people who have died during the Battle of Okinawa", grouped by origin; for Okinawans, the dead of "the 15 years conflict" from 1931 | — | "regardless of their nationality or military or civilian status"; 「国籍や軍人、民間人の区別なく、沖縄戦などで亡くなられた全ての人々」; "more than 200 thousand people who lost their lives in the Battle of Okinawa and other battles" | yes |
| **Australian War Memorial** | "The war in the Pacific took place between Japan and the Allies from 1941 to 1945"; Australians' theatres; prisoners: "approximately 22,000 Australians became prisoners of the Japanese" | its encyclopedia still says Papuans became "affectionately known by Australians as 'Fuzzy Wuzzy Angels'", a phrase now disputed as racist (UNSW / Western Sydney 2025) though the same entry says many carriers "were forcibly recruited" | Roll of Honour: those "who died during or as a result of service with Australian military forces" | schools page, POW guide: yes; galleries: no |
| **Vilu War Museum** (Guadalcanal) | an open-air family museum (founded 1975 by Fred Kona) of Japanese and American wrecks; "monuments for fallen Japanese, American, New Zealand, Australian, and Fijian soldiers"; plaques for the RNZAF and HMAS Canberra | Solomon Islanders' own part in the war is not shown (Devpolicy, 2015) | "fallen" | Devpolicy 2015, tertiary: yes; no site of its own |
| **Yamato Museum** (Kure Maritime Museum) | Kure's history as "the first naval port in the East", the shipbuilding and steel technology that built Yamato and later the world's largest tankers; the 1/10 Yamato; its aims: pass on Kure's history, use its science, and "pass on the importance of peace to the future" | the dead are not on its purpose page; the data page gives Yamato's complement (2,500 designed, 3,332 at the end) | (none on the pages opened) | yes |

### 2.2 The governments' own words (models for the cards)

| who | when | words | opened |
| --- | --- | --- | --- |
| Abe Shinzō, at Pearl Harbor | 27 Dec 2016 | "I offer my sincere and everlasting condolences to the souls of those who lost their lives here, as well as to the spirits of all the brave men and women whose lives were taken by a war that commenced in this very place, and also to the souls of the countless innocent people who became victims of the war." He told of Lt Iida Fusata's marker at Kāneʻohe: "It was not Japanese who erected a marker at the site that Iida's fighter plane crashed. It was U.S. servicemen who had been on the receiving end of his attack." | yes (japan.kantei.go.jp) |
| Barack Obama, at Hiroshima | 27 May 2016 | "death fell from the sky and the world was changed"; "We come to mourn the dead, including over 100,000 in Japanese men, women and children [sic, the archive's transcript]; thousands of Koreans; a dozen Americans held prisoner." | yes (Obama White House archive) |
| Murayama Tomiichi | 15 Aug 1995 | Japan, "following a mistaken national policy, advanced along the road to war ... and, through its colonial rule and aggression, caused tremendous damage and suffering to the people of many countries, particularly to those of Asian nations" | tertiary quotation; MOFA 403 (*verify*) |
| Japan and the ROK (agreement) | 28 Dec 2015 | "The issue of comfort women, with an involvement of the Japanese military authorities at that time, was a grave affront to the honor and dignity of large numbers of women, and the Government of Japan is painfully aware of responsibilities." (Japanese: 「当時の軍の関与の下に、多数の女性の名誉と尊厳を深く傷つけた問題」, *verify*) | tertiary quotation; MOFA 403 |
| Japan, Ministry of Foreign Affairs | 2019 | the expression "sex slaves" "contradicts the facts and should not be used" (Diplomatic Bluebook) | tertiary; MOFA 403 (*verify*) |
| Ishiba Shigeru, press conference | 10 Oct 2025 | 「太平洋戦争という言い方は、戦後、連合国、特にアメリカによってつけられたネーミングでございます。大東亜戦争という言葉は、かなり、一種の価値観を持って受け止められる危険性というか可能性がございますので、先の大戦という言い方をいたします」; and: the government has never said it was not aggression | yes (kantei.go.jp) |
| US Congress, Civil Liberties Act | 1988 | the removal and detention were "motivated largely by racial prejudice, wartime hysteria, and a failure of political leadership"; "the Congress apologizes on behalf of the Nation" (50 U.S.C. §4202) | yes (LII) |

### 2.3 What the app takes from this

- **Count both sides in one form.** The Cornerstone and Guam's wall are the
  only memorials here that list more than one side; Abe and Obama are the
  only speakers who mourn the other side. The app's cards do what they do:
  each side's losses in the same sentence shape, the same units, the same
  place on the card, with sources and scope.
- **The museums' strongest words describe the dead, not the cause.** NPS
  says "lost their lives", "perished", "final resting place"; Hiroshima says
  "victims" and "indiscriminately killed"; Okinawa says lives were "taken"
  (奪い去りました). None of them uses glory words for its own dead except
  Yasukuni and Fredericksburg. The app borrows the plain ones.
- **Every museum is also a party.** The Nagasaki museum's wording was being
  argued over in 2026; Hiroshima's context was added in 1995 under pressure
  and thinned in 2019; Yasukuni's narrative is contested in Japan and abroad;
  the National WWII Museum is a US victory story. A museum's wording is a
  model, never a neutral source: quote it as that museum's.
- **Two US–Japanese gestures model the "both sides" stance best.** The Kāneʻohe
  marker for Iida Fusata, put up by the Americans he attacked (Abe, 2016), and
  the Battleship Missouri Memorial's partnership with the Chiran museum (AP,
  2025), which shows the letters of tokkō pilots a few steps from where one of
  them hit Missouri and was buried at sea with honours on Captain Callaghan's
  order (12 April 1945). Neither glorifies; both name the enemy dead.

---

## 3. Terms

### 3.1 The rule in one table

| term | in the app's own voice | when quoting or naming the record | why (source) |
| --- | --- | --- | --- |
| the war | **the Pacific War** (EN); **太平洋戦争** (JA). Table chapters name the theatre, not the war | 大東亜戦争 only in the prologue card, as "the name Japan's government gave the war on 12 December 1941, counting the war in China from 1937"; アジア・太平洋戦争 named on the same card as historians' term | JACAR topic page (opened); 1941 cabinet decision; the occupation's 15 Dec 1945 directive; 2007 government answer; Ishiba 2025 (opened); Okinawa museum statement (opened); Shōji Jun'ichirō (NIDS) via ja.wp: 太平洋戦争 is "relatively neutral" (*verify*) |
| tokkō / kamikaze | **tokkō (special attack)**, 特攻; first mention on a card: "the tokkō (special attack) units, which the Allies called kamikaze" | the unit name as the record gives it: 神風特別攻撃隊 敷島隊 (Shinpū Tokubetsu Kōgekitai, Shikishima unit); US reports' "kamikaze" quoted as is | Chiran's English "Tokkō" (opened); ja.wp on the 神風 reading (*verify*); Missouri Memorial's exhibit uses "Kamikaze" (AP, 2025) |
| gyokusai / banzai charge | "a final massed attack"; 玉砕 named as the Japanese communiqués' word (first official use: Attu, 1943) | "banzai charge" in US quotations | ja.wp 玉砕 (tertiary); not needed in the v1 naval boxes |
| "the Japanese" | name the force: **the Imperial Japanese Navy / Army** (日本海軍 / 日本陸軍) on first mention, then "the Japanese fleet", "Nagumo's carriers", "the Kidō Butai" | quotations as written | the forces included Koreans and Taiwanese (Yasukuni's own page, opened; the Cornerstone's lists); and symmetry with "the US Navy", "TF 16", never "the Americans" for a fleet |
| "the Allies" | name the nations in each card: US, Australian, New Zealand, British, Dutch, Indian, Chinese, Filipino, Fijian, Solomon Islander, Papuan and New Guinean; "the Allies" only for the coalition | — | AWM names only Australians (opened); Vilu's monuments include Fijians (opened); v1 boxes are US against Japan, but Guadalcanal's card carries the coastwatchers and Solomon Islander scouts |
| slurs | **never** | only when the quotation is the point, exactly, attributed and dated, in a `quote` field (§3.4) | AP's principle via its own blog (search summary): only in direct quotations with a compelling reason, after trying to convey it without the word (*verify*); NHHC's own caption of 80-G-259446 quotes the Tulagi sign and Morison in full (opened) |
| Japanese names | **family name first**; on a card's first mention the family name in capitals with kanji: YAMAMOTO Isoroku 山本五十六; afterwards "Yamamoto" | as the source prints them | the 25 Oct 2019 inter-ministry agreement: 「原則として「姓―名」の順」, and where needed 「姓を全て大文字とし（YAMADA Haruo）」 (MHLW notice quoting it, opened); 2000 National Language Council report |
| macrons | **yes**, modified Hepburn: Sōryū, Kidō Butai, Shō-ichi-gō; except four place names fully naturalised in English: Tokyo, Kyoto, Osaka, Kobe | sources' own spellings kept in citations | Cabinet Notice No. 4 of 22 Dec 2025: macrons are usual (Ōno, Yūki), doubled vowels allowed (Oono), people's own spellings respected (Agency for Cultural Affairs Q&A, opened) |
| kanji beside romaji | first mention per card for ships, operations, units and people: Kaga 加賀; MI Sakusen ＭＩ作戦 | — | R2 §13's table; DESIGN §7.3 |
| hull numbers | US ships: name and hull number on first mention per card, **Yorktown (CV-5)**; USS only in titles and quotations | Japanese ships had none: "the carrier Kaga 加賀"; no "IJN" or "HIJMS" prefix (an Anglo-American convention) | symmetry |
| ranks | rank at the date, in English, with the Japanese rank on first mention for Japanese officers: Lieutenant Commander (少佐), Commander (中佐), Captain (大佐), Rear Admiral (少将), Vice Admiral (中将), Admiral (大将); Lieutenant (大尉) | posthumous promotions named as such | *verify* each against the record (R4, R5) |
| incarceration | **the incarceration of Japanese Americans**, **forced removal**; "internment" only for the Justice Department and Army camps for enemy aliens | "relocation centers", "evacuation" only in quotation marks, as the government's words | JACL *Power of Words* (2013, rev. 2020; opened): "Internment" → "Incarceration", "Relocation Center" → "Incarceration camp"; NPS Tule Lake hosts the same handbook (opened) |
| comfort women | **"comfort women"** in quotation marks on first use; ianjo 慰安所 ("comfort stations"), the military's term; lead with the Japanese government's 2015 wording | "military sexual slavery" (UN, 1996) named as the UN's term, beside Japan's 2019 objection to "sex slaves" | §2.2; tertiary for the UN and MOFA texts (*verify*) |
| Papuan carriers | **Papuan and New Guinean carriers** | "Fuzzy Wuzzy Angels" only in quotation marks, as the soldiers' name | AWM encyclopedia; UNSW / Western Sydney 2025 (search summaries, *verify*) |
| liberation (Guam, the Philippines) | "the American return" / "the 1944 battle for Guam"; Liberation Day (21 July) named as Guam's holiday | Underwood's "liberated ... from without ... from within" quoted | NPS WAPA's own pages avoid "liberation" in their prose (opened) |

### 3.2 The war's name, at length

- **12 December 1941.** The Tōjō cabinet decides: 「今次ノ対米英戦争及今後情勢ノ
  推移ニ伴ヒ生起スルコトアルヘキ戦争ハ支那事変ヲモ含メ大東亜戦争ト呼称ス」
  (JACAR A06050925000, quoted on JACAR's topic page, opened). The Greater East
  Asia War includes the China war from 1937.
- **15 December 1945.** The occupation's Shinto Directive bans 「大東亜戦争」
  and 「八紘一宇」 in official documents (ja.wp, citing SCAPIN-448 and Shōji
  2011; *verify*).
- **Since then** the government says 先の大戦, 今次戦争 or 第二次世界大戦; in
  2007 it answered the Diet that 「「太平洋戦争」という用語は、政府として定義
  して用いている用語ではない」 (ja.wp citing 内閣衆質一六六第六号; *verify*).
- **Historians** use 十五年戦争 (Tsurumi Shunsuke, 1956), アジア・太平洋戦争
  (increasingly since the 1980s) or 太平洋戦争 (Ienaga's 1968 book used it as
  the common word while arguing for the fifteen-year frame). Shōji (NIDS,
  2011) finds that those who justify the war say 大東亜戦争, those who see it
  as aggression say 十五年戦争 or アジア・太平洋戦争, and 太平洋戦争 is the
  relatively neutral one (ja.wp; *verify*).
- **The app's frame** is the Pacific (the table runs from Burma to Hawaiʻi;
  China and the Soviet entry are edge cards), so 太平洋戦争 is accurate as well
  as plain. The prologue card should name the other names and say whose they
  are, once.

### 3.3 Tokkō, at length

- In Japanese the attacks are 特攻 (tokkō, from 特別攻撃, special attack); the
  navy's air units were the 神風特別攻撃隊. ja.wikipedia says the name was
  Inoguchi Rikihei's idea, after the 神風 (*shinpū*) school of swordsmanship
  in his home town, while the 201st Air Group's air officer Nakajima Tadashi
  said it was read *kamikaze* (*verify*; both cited there to print sources).
  The English "kamikaze" came through the Allies.
- Chiran, the main museum of the army's tokkō, uses "Tokkō" in English and
  特攻戦死 for its dead (opened). Its founding statement is the most useful
  sentence any museum offers this app: it shows the pilots' letters
  「再び戦闘機に爆弾を装着し敵の艦船に体当たりをするという命の尊さ・尊厳を
  無視した戦法は絶対とってはならない」 (never again a tactic that loads a
  fighter with a bomb to ram an enemy ship, ignoring the value and dignity of
  life).
- Ten-Gō's force was itself named 海上特攻隊 (Surface Special Attack Force;
  R2 §13, JACAR C08030103100). When Ten-Gō is built (after v1), Yamato's AA
  and helm under air attack are defensive moments, but no moment should make
  reaching Okinawa the objective (§5.2 f).

### 3.4 The slur rule

- The app's own voice never uses a slur: not in titles, labels, pins, HUD,
  summaries, stop text, the after-card or the Japanese strings.
- A slur appears only inside a quotation whose point is the slur or that
  cannot be told without it: the sign over the Tulagi fleet landing in July
  1943 ("KILL JAPS, KILL JAPS, KILL MORE JAPS!", NHHC caption of 80-G-259446,
  opened) is one; a routine action report that says "Japs" for the enemy is
  not, and is paraphrased.
- When quoted, it is quoted exactly (no asterisks), attributed with speaker,
  date and source, in a `quote` field the check knows.
- The rule is the same both ways: 鬼畜米英 ("devilish beasts, America and
  Britain", a wartime Japanese slogan, *verify* the source when used) falls
  under it as "Japs" does.
- A Japanese string never reproduces an English slur, and an English string
  never transliterates a Japanese one; the translation gives the meaning and
  says it is a slur (「日本人に対する蔑称」).
- Source titles in `sources.json` stay as printed (a citation is not copy).

### 3.5 "Theatre" and "theater", and how the name reads

- "Theatre" is British, Australian and Canadian spelling; "theater" is
  American for both the playhouse and the military area. US institutions say
  "Pacific Theater" (NPS's Guam park, the National WWII Museum's galleries,
  Fredericksburg's "Asiatic-Pacific theater"; all opened). American English
  does use "Theatre" in proper names (the Pacific Theatres cinema chain itself).
  An American reader sees "Theatre" as formal or British, not as a mistake.
- The draft's own prose is British ("colour", "metres"), so "Theatre" is
  consistent. Keep it throughout the copy; quote US names in their spelling.
- The Australian War Memorial's own pages say "War in the Pacific" and use
  "theatre" for battle honours (search summary). British usage pairs "the Far
  East" with the Pacific and treats Burma as its own "forgotten" theatre
  (National Army Museum, 2025–26, search summary). "Pacific" is a US- and
  Australian-centred frame; the table's west edge (Burma, the Bay of Bengal)
  should carry the British, Indian and Chinese war in its cards.
- **Japanese readers.** The military term is 戦域 (sen'iki); ja.wikipedia's
  article on the war glosses "Pacific Theater" as 太平洋戦域 (opened). Read
  cold, "Theatre" is 劇場, a playhouse, and a katakana パシフィック・シアター
  would read as a cinema's name. On the boot screen the English title should
  stand with a Japanese line that does not translate it: 太平洋戦争 and the
  dates (§7.4).
- The pun in DESIGN §12 ("a theatre is also a place where a thing is played,
  which is what the sorties make it") is the kind of line a critic quotes.
  Keep it out of every string a user sees.

### 3.6 Words for the dead, both languages

| situation | English (app's voice) | Japanese (app's voice) | avoid |
| --- | --- | --- | --- |
| crews of ships and aircraft, either side | "lost their lives" (NPS, Abe); "died" | 「命を落とした」; 「亡くなった」 | "gave their lives", "made the ultimate sacrifice", "the fallen heroes", "martyrs"; 英霊, 散華, 殉じた, 玉砕 (except quoted) |
| an aircraft that did not come back | "did not return" | 「未帰還」 | "shot down" when the record does not know |
| a ship lost | "sank", "was lost", "capsized", "was scuttled" | 「沈没した」, 「転覆した」, 「自沈した」/「処分された」 | "destroyed", "killed" (of a ship) |
| civilians killed deliberately (Manila, Nanjing, the Doolittle reprisals) | "were killed", "were massacred" where the record says so | 「殺害された」, 「虐殺された」 | the passive without an agent when the agent is known |
| civilians killed by bombing | "were killed" | 「亡くなった」 (Hiroshima city: 「亡くなった方」) | "collateral damage" |
| prisoners on marches, in camps, in ships' holds | "died" (of what, where known) | 「死亡した」, 「亡くなった」 | — |
| survivors | "survived"; "were rescued" | 「生存者」, 「救助された」 | — |
| the remains aboard a wreck | "remain aboard her, where she lies" (NPS: "final resting place") | 「いまも艦内に眠る」 (Abe: "where those sailors and marines sleep") | "entombed" (NPS does not use it on these pages) |

---

## 4. People

### 4.1 The named individuals of the v1 cards

Dates from en.wikipedia (`action=raw`, tertiary) unless marked; ranks at the
battle's date are from memory and marked *verify*; facts about the battles
are R4's and R5's to fix.

| person | role in the v1 boxes | rank at the date (*verify*) | dates | publicly known, and what is contested | living memory / descendants |
| --- | --- | --- | --- | --- | --- |
| Yamamoto Isoroku 山本五十六 | C-in-C Combined Fleet: Pearl Harbor's author; Midway's | Admiral 大将 | 1884 – 18 Apr 1943 (shot down near Bougainville) | conceived the attack; Genda planned it (National WWII Museum fact sheet, opened) | descendants live (*verify*) |
| Nagumo Chūichi 南雲忠一 | Kidō Butai at Pearl Harbor and Midway | Vice Admiral 中将 | 1887 – 6 Jul 1944 (suicide on Saipan) | his Midway report (ONI translation, 1947) is a primary source (R2) | — |
| Yamaguchi Tamon 山口多聞 | CarDiv 2, Hiryū's counter-strikes at Midway | Rear Admiral 少将 | 1892 – 5 Jun 1942 (went down with Hiryū) | — | — |
| Kurita Takeo 栗田健男 | First Striking Force at Samar | Vice Admiral 中将 | 1889 – 19 Dec 1977 | the turn away at Samar; told the journalist Itō Masanori in 1954 that he had made a mistake (tertiary) | daughter's family (tertiary) |
| Ozawa Jisaburō 小沢治三郎 | the Northern (decoy) Force; Samar's card only | Vice Admiral 中将 | 1886 – 9 Nov 1966 | — | — |
| Nishimura Shōji 西村祥治 | Force C at Surigao (later box) | Vice Admiral 中将 | 1889 – 25 Oct 1944 (killed in Yamashiro) | — | — |
| Itō Seiichi 伊藤整一 | Second Fleet, Ten-Gō (later box) | Vice Admiral 中将 (posthumously Admiral) | 1890 – 7 Apr 1945 (in Yamato) | "Ten days after his death, his only son died taking part in a kamikaze attack near Okinawa" (tertiary) | the card must say this, if at all, exactly as the record does |
| Fuchida Mitsuo 淵田美津雄 | led the Pearl Harbor air attack; sent "Tora, Tora, Tora" | Commander 中佐 | 1902 – 30 May 1976 | his accounts are disputed: Willmott called one episode "blatant and shameless self-advertisement"; Parshall and Tully (2005) dispute his "five minutes" at Midway (tertiary citations) | — |
| Genda Minoru 源田実 | planned the air attack | Commander 中佐 | 1904 – 15 Aug 1989 | later JASDF chief and a member of the House of Councillors; awarded the US Legion of Merit in 1962 (tertiary) | — |
| Tomonaga Jōichi 友永丈市 | Hiryū's air group leader: the Midway strike (04:30) and the torpedo strike on Yorktown (13:31) | Lieutenant 大尉 | d. 4 Jun 1942 (did not return) | R4 §§ on Hiryū's strikes | no en.wikipedia article (404) |
| Kobayashi Michio 小林道雄 | led Hiryū's D3As on Yorktown, 10:54–12:15 | Lieutenant 大尉 | d. 4 Jun 1942 (did not return) | "Thirteen bombers and three fighters did not return" (R4) | no article reached (429/404) |
| Nimitz, Chester W. | CINCPAC | Admiral | 1885 – 1966 | the Fredericksburg museum bears his name | — |
| Spruance, Raymond A. | TF 16 at Midway | Rear Admiral | 1886 – 1969 | — | — |
| Fletcher, Frank Jack | TF 17, in tactical command at Midway | Rear Admiral | 1885 – 1973 | — | — |
| Halsey, William F. Jr. | Third Fleet's run north before Samar (card) | Admiral | 1882 – 1959 | his slogan painted at Tulagi (NHHC caption, opened): the slur rule's test case | — |
| Lee, Willis A. | TF 64 in Washington, 14–15 Nov 1942 | Rear Admiral | 1888 – 25 Aug 1945 | his own report not found on a reachable host (R2 D3) | — |
| Sprague, Clifton A. F. | Taffy 3 (TU 77.4.3) at Samar | Rear Admiral | 1896 – 1955 | — | — |
| Evans, Ernest E. | Johnston (DD-557) at Samar | Commander | 1908 – 25 Oct 1944 | Medal of Honor (posthumous); of Cherokee/Creek ancestry (tertiary) | — |
| McClusky, C. Wade | Enterprise air group: the dive on Kaga and Akagi | Lieutenant Commander | 1902 – 1976 | — | — |
| Best, Richard H. | VB-6: hit Akagi, then Hiryū | Lieutenant | 1910 – 2001 | — | — |
| Leslie, Maxwell F. | VB-3: the dive on Sōryū | Lieutenant Commander | 1902 – 1985 | — | — |
| Thach, John S. | VF-3: escort of VT-3; the "Thach weave" | Lieutenant Commander | 1905 – 1981 | — | — |
| Waldron, John C. | VT-8: the torpedo attack that a stop carries, not a moment (R4 D3) | Lieutenant Commander | 1900 – 4 Jun 1942 | of Oglala Lakota ancestry on his mother's side (tertiary) | — |
| Gay, George H. Jr. | VT-8's only survivor of the attack | Ensign | 1917 – 1994 | watched the carriers burn from the water; the card says so, the box draws no one in the water | — |
| Welch, George / Taylor, Kenneth M. | P-40s from Haleʻiwa at Pearl Harbor | Second Lieutenants, USAAF | 1918 – 1954 / 1919 – 2006 | — | — |
| Iida Fusata 飯田房太 | Sōryū's fighter leader; crashed at Kāneʻohe; a marker put up by US servicemen (Abe 2016, opened) | Lieutenant 大尉 (Abe says "Commander"; posthumous promotion *verify*) | d. 7 Dec 1941 | Marine Corps accounts call his dive "believed to have been a kamikaze attack on a hangar" (search summary); keep "tokkō" out of 1941 | — |
| Yoshioka Masamitsu 吉岡政光 (kanji *verify*) | B5N2 navigator-bombardier, Sōryū; says his torpedo struck Utah by mistake | — | d. Aug 2024, aged 106 | "Now I think of the men who were on board those ships we torpedoed." "I think of the people who died because of me." "I am so sorry about it." (Stars and Stripes, 27 Sep 2024, opened) | recent; his words are on record |
| Harada Kaname 原田要 | Zero pilot at Pearl Harbor and Midway (tertiary) | — | 1916 – 3 May 2016 | later spoke against war (*verify*) | — |
| Vouza, Jacob C. | Solomon Islander scout for the Marines on Guadalcanal (Guadalcanal card) | Sergeant Major (Armed Constabulary) | 1892 – 15 Mar 1984 | captured and tortured, survived (tertiary) | — |
| Clemens, Martin | coastwatcher, Guadalcanal | British District Officer | 1915 – 2009 | — | — |
| Callaghan, William M. | Missouri's captain; ordered the burial at sea of a tokkō pilot, 12 Apr 1945 | Captain | — | his grandson Carey: empathy and dignity (AP, 2025) | outside v1; a model |

### 4.2 The living, in 2026

| who | count or last known | source | status |
| --- | --- | --- | --- |
| US veterans of the Pearl Harbor attack | "Only 12 veterans of the attack are known to be living", all "more than 100 years old"; none attended the 84th anniversary, the first time in 84 years; the count, kept by Kathleen Farley of the Sons and Daughters of Pearl Harbor Survivors, "is not exhaustive"; Ira Schab, 105, cancelled for health; Ken Stevens died in March 2025 at 102 | Stars and Stripes, 7 Dec 2025 (opened) | some will be alive in late 2026 (*verify* at build time) |
| members of the Japanese attack force | Yoshioka Masamitsu, "the last known survivor among about 770 crew members" of the airborne force, died in August 2024 at 106; Harada Kaname, called the last combat pilot of the attack, died in 2016 | Stars and Stripes 2024 (opened); NYT via Deccan Herald (403) | none known living (*verify*) |
| US veterans of Midway | John F. Miniclier, called "the last surviving veteran" of Midway, died 24 May 2025 at 103 | Twitchy (single, weak source; search summary) | possibly none (*verify*) |
| Taffy 3 / Samar | Adred Lenoir, the last Samuel B. Roberts survivor, alive in 2020–21; a later article says the last survivor died "in March" (year unclear) | de413.org, PBS (search summaries) | unknown (*verify*) |
| Japanese veterans of Midway, Guadalcanal, Samar | not found | — | unknown |
| civilians | children of 1944–45 on Guam, Okinawa, in the Philippines and in Japan's cities are in their eighties and nineties | general | living |
| families | DPAA has identified "over 300" of Oklahoma's dead and returned them to their families (NPS, opened); Arizona's and Utah's dead remain aboard | NPS | living |

### 4.3 Rules for named people

- A card names a person only where the record names them, and says only
  what a cited source says. No thoughts, motives, feelings or dialogue are
  invented, for anyone; no voices, no portraits, no likenesses.
- Contested accounts are tellings with their sources (Fuchida's "five
  minutes"; Kurita's turn; who dropped the bomb that destroyed Arizona).
- A living person, or one who died in the last ten years, is named only for
  what they did in the battle and what they said on the record (Yoshioka's
  interview is on record).
- Japanese and American individuals get the same form: rank at the date,
  name, unit, what they did, how they died or when, with the same verbs.

---

## 5. The rules the app practises

The Hawaiian app's form: the rule is practised, not announced. "No card,
note, legend or panel says what the app does not show, place or draw." The
list below lives in DESIGN.md §7.4 and here; none of it reaches the copy.
What changes from the Hawaiian app is that a player now holds a weapon, on
either side, and can change what happens inside a box. So the list covers
what the sim offers as well as what the renderer draws.

### 5.1 What the app never draws or offers

1. **No human figures anywhere.** Not on decks, not in the water, not on
   rafts or nets, not under parachutes, not on a capsized hull. Aircrew are a
   tinted canopy at most.
2. **No parachutes.** An aircraft that is hit falls as a trail and is gone.
   Who bailed out, and who was picked up, is on the card (George Gay, Iida).
3. **Nothing that is a person can be targeted.** No lifeboats, rafts or
   floating debris are drawn; rounds into the sea do nothing; there is no
   target in the water to strafe. Buildings (barracks, hangars with people,
   houses, hospitals, towns) are terrain: bombs and rounds on them register
   nothing and score nothing. A D3A over Hickam and Ford Island has aircraft
   on the ramps, hangars as structures and AA positions as its targets.
4. **A sinking ship is not a target.** A ship past its kit's fatal threshold
   leaves the target list: hits on it neither draw damage nor register, the
   HUD drops its marker, and the AI stops firing on it. The same for a ship
   whose crew is abandoning her in the record.
5. **Hospital ships are never targets.** Solace (AH-5) lay in Pearl Harbor
   on 7 December (*verify* her berth with R5); hits on her register nothing.
6. **No mushroom cloud, no burning city, no bomber stream onto a city.** A
   raid on a city is a pin and a card. Hiroshima, Nagasaki and Tokyo are pins
   with cards. The B-29 lanes from the Marianas may be drawn as routes that
   end at the coast; no route is drawn for the two atomic missions.
7. **No tokkō role.** No tokkō aircraft, Ōka, Kaiten or Shin'yō is ever the
   player's unit, and no moment's objective is a one-way attack. A tokkō
   attack inside a box's clock is drawn as an aircraft on its track and a hit
   in the same visual language as any bomb hit. No moment exists whose purpose
   is to shoot down tokkō aircraft.
8. **No score in people.** No counter of men, crews or lives, on any screen,
   for either side. The after-card never computes people from the sim: the
   record's figures are the record's, sourced ranges, and nothing is added to
   or subtracted from them.
9. **No celebration.** No medals, ranks, ace titles, kill tallies painted on
   a fuselage, victory fanfares, or "Victory" and "Defeat" banners. A sinking
   of either navy sounds the same and reads the same on the HUD: the ship's
   name and what happened ("Kaga: fire on the hangar deck"), never "Kill",
   "Destroyed", "Mission accomplished".
10. **No flags but the record's markings.** No naval ensigns or war flags on
    ships (at model scale they would be specks, and the Rising Sun ensign is
    what *World of Warships* removed in 2013 after Korean players objected).
    National markings on aircraft and on carriers' decks as the record has
    them at the date (R6 sets the US star's red centre before and after May
    1942, the hinomaru on the flight decks).
11. **No portraits, likenesses or voices.** No invented words, thoughts or
    motives for anyone. Radio phrases from the record ("Tora, Tora, Tora")
    are card text, not audio.
12. **No slur in the app's own voice** (§3.4).
13. **The player is never a named person.** The player flies "an SBD of
    Bombing Six" or "a B5N2 of Hiryū's second strike", never McClusky's,
    Best's, Tomonaga's or Kobayashi's aircraft; named leaders' aircraft are
    always AI and always follow the record. "You are one of many" (the brief).
14. **No capture, execution or atrocity is drawn**; prisoners are on cards.

### 5.2 The hard cases

#### a. The first-wave torpedo run on Battleship Row, from the attacker's seat

- **The units.** The first wave's torpedo B5N2s of Akagi and Kaga attacked
  Battleship Row; Sōryū's and Hiryū's attacked the north-west side of Ford
  Island (Utah, Raleigh) (*verify* with R4/R5). Yoshioka Masamitsu's Sōryū
  aircraft was one of the latter, by his account.
- **The moment.** Start in position, low over the approach, a kilometre or
  two from the drop, at the record's minute (07:55 in DESIGN §3.4); one Type
  91 torpedo; the B5N2's only gun faces aft (*verify*, R6), so this seat
  cannot strafe. Checkpoint shortly after the climb-out. Score: "torpedo on
  target" and whether you came back.
- **Fixed fates (decision D1).** Arizona's magazine explosion, Oklahoma's
  capsizing and Utah's capsizing are record beats marked `fixed`. They play
  at their times in every run, from every seat. Their cause is never a
  player unit: a player torpedo that strikes Oklahoma registers as "torpedo
  on target" and nothing more, and she rolls over at 08:08 as she did. No
  defender (a ship's AA, Welch's or Taylor's P-40) can prevent them. The sim
  resolves everything else (the other battleships' damage, the aircraft, the
  airfields, Nevada's sortie). Why: two of the three are war graves today;
  a "saved Arizona" invites the arithmetic the rules forbid ("you saved
  1,177"); and the NPS treats all three as the places of the dead.
- **No moment for the cause of Arizona's explosion.** The first wave's
  high-level B5Ns over Battleship Row carried the 800 kg armour-piercing
  bombs; one of them destroyed Arizona (which carrier's crew is disputed:
  Hiryū's unit was officially credited; Prange named a Sōryū bombardier,
  Kanai Noboru, whose own diary points elsewhere; search summaries, *verify*).
  No moment is offered in that formation.
- **How the explosion is drawn**, in the model style, at the record's time
  (about 08:06–08:10; tellings differ, *verify*): a flash under the forward
  turrets; a column of black smoke rising and leaning with the wind; the
  forward hull settling and the tripod foremast tilting forward; burning oil
  spreading on the water around her as flat flame on the sea; she settles on
  the bottom at her berth with her upper works above water and goes on
  burning to the end of the box's clock (the photographs show her burning
  for days, *verify*). No figures, no debris that reads as people. The sound
  reaches the camera after the light, delayed by distance (about 3 s per
  km), and is the same report as any other explosion. The camera does not
  cut to it, nothing slows, nothing replays, the HUD says nothing.
- **The stop card at 08:10** (present tense, as the Hawaiian stops):
  - EN: "About 08:10. A bomb dropped from high level strikes near Arizona's
    No. 2 turret, and her forward magazine explodes. 1,177 of her crew lose
    their lives, about half of all the Americans who died that morning. More
    than 900 of them remain aboard her, where she lies."
  - JA: 「午前8時10分ごろ　高高度から投下された爆弾がアリゾナの2番砲塔付近に
    命中し、前部弾薬庫が爆発する。乗組員1,177人が命を落とす。この朝亡く
    なった米国人のおよそ半数にあたる。そのうち900人以上が、いまも艦とともに
    眠っている。」
  - Sources: NPS (1,177; "over 900"); National WWII Museum fact sheet
    ("Half of the dead at Pearl Harbor were on the Arizona"); the time and
    turret from NPS's older study (Lenihan 1989, *verify*; unreachable).
- **The attacker's after-card**, the record section (the rest follows d):
  - EN: "The record: Oklahoma capsized at 08:08; 429 of her crew lost their
    lives. At about 08:10 Arizona's forward magazine exploded; 1,177 of her
    crew lost their lives. In all, 2,390 Americans lost their lives that
    morning by the National Park Service's count, 49 of them civilians
    (2,403, 68 of them civilians, by the count the National WWII Museum
    gives). Japan lost 29 aircraft and five midget submarines; 64 men lost
    their lives (55 airmen and 9 submariners; *verify*), 129 by the National
    WWII Museum's count; one submariner was taken prisoner."
  - JA: 「記録では　オクラホマは午前8時8分に転覆し、乗組員429人が命を落とした。
    午前8時10分ごろアリゾナの前部弾薬庫が爆発し、乗組員1,177人が命を落とした。
    この朝命を落とした米国人は、国立公園局の集計で2,390人（うち民間人49人）、
    米国立第二次世界大戦博物館の示す集計で2,403人（うち民間人68人）。日本側は
    航空機29機と特殊潜航艇5隻を失い、64人（搭乗員55人、艇員9人。要確認）、
    同博物館の集計では129人が命を落とした。艇員1人が捕虜となった。」
  - Model for the tone: Yoshioka's own words, on the record (Stars and
    Stripes 2024): "Now I think of the men who were on board those ships we
    torpedoed." The card does not quote him unless the stop concerns Utah.
- **Kāneʻohe.** Iida Fusata's crash at Kāneʻohe (in the second wave,
  *verify*) is a record beat; its card can carry the marker the Americans put up (Abe 2016),
  which is the most honest "both sides" sentence the Pearl Harbor box has.

#### b. Oklahoma's capsizing

- Drawn: after the torpedo hits, the hull lists to port and rolls over until
  her masts rest on the bottom and her keel shows; nothing on the hull.
- EN: "08:08. Struck by several torpedoes, Oklahoma rolls over within twelve
  minutes. 429 of her crew lose their lives. Over the next two days,
  rescuers cut 32 men out through her hull." (NPS: "Within 12 minutes, at
  8:08 a.m., the battleship capsized"; "429 officers, sailors, and Marines
  lost their lives"; "over the next two days, 32 men were saved from the
  wreckage"; Stars and Stripes: "several hits".)
- JA: 「午前8時8分　数本の魚雷を受けたオクラホマは、12分のうちに転覆する。
  乗組員429人が命を落とす。その後の2日間で、船体を切り開いて32人が救い
  出された。」
- A second line where the stop allows: "More than 300 of her dead have since
  been identified and returned to their families" (NPS; DPAA's own count,
  *verify*).

#### c. A Japanese-side sortie at Midway against Yorktown

- Moments: a D3A of Kobayashi's Hiryū strike (12:05), a B5N2 of Tomonaga's
  (14:40). The same rules as any sortie: the CAP and AA engage the player;
  Yorktown's damage is the sim's, from the player's hits plus the scripted
  others scaled by survivors (DESIGN §5.7).
- The player is never Kobayashi or Tomonaga (§5.1, 13).
- The after-card gives the Japanese losses in the same form as the US ones,
  with 未帰還 / "did not return": "Thirteen of the eighteen bombers and three
  of the fighters did not return; Lieutenant Kobayashi was among them" (R4).
  JA: 「艦爆18機のうち13機、戦闘機3機が未帰還。小林大尉もその一人だった。」
- If Yorktown sinks in the player's battle: "Your battle: Yorktown sank at
  12:41." "The record: hit by three bombs at 12:05–12:15 and two torpedoes at
  14:44–14:46, Yorktown was abandoned; the submarine I-168 sank her on 7
  June" (R4 times; *verify* the abandonment time).

#### d. A ship the player sank that survived, or saved that sank: the after-card

The after-card has three parts, always in this order, always with these
labels, and the parts never share a row or a sum.

| part | EN label | JA label | what it may say | what it may not say |
| --- | --- | --- | --- | --- |
| your sortie | **Your sortie** | **あなたの出撃** | hits, torpedoes on target, aircraft downed, whether you came back, the time | people |
| your battle | **Your battle** | **あなたの戦い** | which ships sank, burned or survived, and when; which strikes launched; aircraft lost on each side | people; "you saved", "you killed", "lives"; any comparison with the record in the same line |
| the record | **The record** | **記録** | the record's outcome: ships, aircraft, and the people as sourced ranges with scope | anything computed from the player's run |
| what came next | **What came next** | **その後** | one or two sentences of the record's next chapter; a surviving ship's later fate and date | any reference to the player; "your battle did not change this" (the rule is practised) |

- Tense: "Your battle" in the past tense, short lines: "Kaga: afloat at
  18:00; her 16:30 strike launched." The record in the past tense with its
  clock: "Kaga sank at 19:25 (Midway time)."
- Never the words "what if", "alternate history", "you changed history",
  "victory", "defeat", "saved", "avenged".
- Example, a ship that survived, sunk by the player (Kirishima's bridge at
  Guadalcanal): "Your battle: Washington sank at 00:41." / "The record:
  Washington was not hit. Kirishima, struck by nine to twenty 16-inch shells
  by different counts, was scuttled at 03:25 north-west of Savo; 212 of her
  crew lost their lives." / "What came next: Washington served to the end of
  the war." (Hits: USSBS 9, Lundgren about 20, both via the Kirishima TROM;
  212: TROM; R2 §12.2.)
- Example, a ship saved: "Your battle: Kaga afloat at 18:00." / "The record:
  Kaga sank at 19:25; 811 to 814 of her crew lost their lives" (R2 §12.1: the
  TROM's 814; *verify* 811). No line joins the two.
- Japanese uses 記録 rather than 史実 for "the record": 史実 ("historical
  fact") is the usual word in Japanese war games, but the app's record is
  tellings and ranges, and 記録 says that.

#### e. Samar and the first tokkō attack

- The Shikishima unit (敷島隊) of the Shinpū Special Attack Corps struck Taffy
  3 after the surface action, and St. Lo sank (about 10:50, *verify* with R5).
  If the Samar box's clock runs past it, a player who keeps flying or steering
  after a checkpoint (DESIGN §5.7: "the sortie then runs until ... the battle
  clock ends") meets it.
- **Recommendation (D3): close the Samar box's clock with the surface action**
  (Kurita's order to break off, about 09:11–09:20, *verify*), and carry the
  tokkō attack as the box's closing card:
  - EN: "About 10:50. Aircraft of the Shikishima unit, the first of the
    navy's tokkō (special attack) units, which the Allies called kamikaze,
    attack the escort carriers. St. Lo is hit and sinks."
  - JA: 「午前10時50分ごろ　海軍最初の特攻隊、神風特別攻撃隊敷島隊の機が護衛
    空母群を攻撃する。セント・ローが命中を受けて沈没する。」
  - Name Seki Yukio 関行男 only as the record does; St. Lo's losses as a
    telling with its source.
- This keeps the first tokkō attack in the record, inside the battle, and out
  of the sim entirely.

#### f. Later boxes, flagged now

- **Ten-Gō**: the force was the 海上特攻隊. Yamato's AA and helm under the
  first wave are defensive moments; no objective is to reach Okinawa; the
  moment ends with the ship's fate as the record has it or the sim gives it.
- **Okinawa's picket line**: a destroyer's AA against tokkō aircraft is a
  military engagement, but its whole subject is men on one-way missions.
  Decide it with a historian when it comes; not v1.
- **Surigao**: Nishimura's force was destroyed almost to a ship; a
  US-destroyer torpedo moment is fine; Yamashiro's bridge is a moment that
  ends in her sinking in nearly every run, so treat it as R4's D3 treats
  Torpedo Eight (a stop with a card).

### 5.3 Cards only: the attacks on civilians and prisoners

Each is a pin and a card, never a box, a moment or a picture. Numbers are
ranges with their scope and source; the museums' and governments' own words
are the models. Titles carry the Japanese name and reading as battles do.
"Opened" refers to the figure's source.

| card | EN title / JA title | when | figures (scope; source; opened?) | wording model | draft first sentence |
| --- | --- | --- | --- | --- | --- |
| Hiroshima | Hiroshima / 広島への原爆投下 | 6 Aug 1945, 08:15 | about 140,000 dead by the end of December 1945, "the exact number ... still unknown" (City of Hiroshima; yes); 70,000–80,000 "killed, or missing and presumed dead" (USSBS 1946; yes); Koreans among them 5,000–8,000 (tertiary, *verify*); "a dozen Americans held prisoner" (Obama 2016; yes) | the city's "the exact number of deaths ... is still unknown"; the museum's "indiscriminately killed tens of thousands of people"; Obama's list of the dead | "At 08:15 a single atomic bomb, dropped by a US B-29, exploded over Hiroshima. By the end of the year roughly 140,000 people had died, by the city's estimate; among them were people from Korea, then a Japanese colony, and a dozen American prisoners." |
| Nagasaki | Nagasaki / 長崎への原爆投下 | 9 Aug 1945, 11:02 | 73,884 killed and 74,909 injured by the end of December 1945 (a July 1950 report of the Committee for the Preservation of Atomic Bomb Artifacts; yes); 35,000–40,000 killed (USSBS 1946; yes) | the city's "73,884 of its people had been killed" | "At 11:02 a second atomic bomb exploded over Nagasaki's Urakami valley. By the end of December, 73,884 people had been killed by the city's count." (Urakami: *verify* wording) |
| Tokyo | The firebombing of Tokyo / 東京大空襲 | night of 9–10 Mar 1945 | "more than 90,000 and possibly over 100,000" killed, mostly civilians; a million homeless (tertiary, citing Frank 1999; *verify* the Japanese official figures) | the Hiroshima form: the number is uncertain, say so | "In the night of 9–10 March, B-29s dropped incendiaries on the crowded east of Tokyo. More than 90,000 people were killed, most of them civilians, and a million were left homeless." |
| Bataan | The Bataan Death March / バターン死の行進 | from 9 Apr 1942 | 72,000–78,000 Filipino and American prisoners marched about 100 km to Camp O'Donnell; deaths on the march 5,500 to 18,650 by different estimates (tertiary); Morton (US Army, 1953; opened) describes the march and defers to Falk (1962, *verify*) | Morton: "Denied food and water, ... clubbed, beaten, and bayoneted" | "After the surrender on Bataan on 9 April 1942, the Imperial Japanese Army marched some 72,000 to 78,000 Filipino and American prisoners to Camp O'Donnell. Thousands died on the way; estimates run from about 5,500 to more than 18,000, and many more died in the camp." |
| Manila | The destruction of Manila / マニラの戦い（マニラ大虐殺） | Feb–Mar 1945 | "at least 100,000 civilians were killed in total during the battle from all causes, including the massacre by Japanese troops" (tertiary; *verify* Connaughton et al.) | the scope sentence itself: "from all causes" | "In February 1945, as US and Filipino forces fought to retake Manila, Japanese naval and army troops in the city massacred its people. At least 100,000 civilians died in the month of the battle, from all causes." |
| hell ships | The prisoner transports / 捕虜輸送船（地獄船） | 1942–45 | "More than 20,000 Allied POWs died at sea when the transport ships carrying them were attacked by Allied submarines and aircraft"; others died of suffocation, thirst and disease in the holds (tertiary; *verify*) | both sides' part, in one sentence | "Japan moved Allied prisoners and Asian labourers in the holds of cargo ships, in heat and thirst. More than 20,000 prisoners died at sea, most of them when the unmarked ships were sunk by Allied submarines and aircraft." ("unmarked": *verify*) |
| comfort stations | The "comfort women" / 慰安婦 | 1932–45 (*verify*) | 20,000 to 200,000 women, "most historians" (tertiary); Chinese scholars up to 360,000–410,000 (tertiary) | Japan's 2015 words: "with an involvement of the Japanese military authorities at that time, was a grave affront to the honor and dignity of large numbers of women" | "Across the occupied territories the Japanese military set up or used 'comfort stations', to which women and girls from Korea, China, the Philippines, the Dutch East Indies and elsewhere were brought, many by force or deception. Japan's government has said it was 'a grave affront to the honor and dignity of large numbers of women'." (origins list: *verify*) |
| incarceration | The incarceration of Japanese Americans / 日系アメリカ人の強制収容 | from 19 Feb 1942 | about 120,000 people (tertiary); "some 110,000 ... (of which nearly 70% were American citizens)" (JACL; yes) | 50 U.S.C. §4202 (opened) | "Under Executive Order 9066, some 110,000 to 120,000 people of Japanese ancestry, most of them American citizens, were removed from the West Coast and held in camps. In 1988 Congress found it 'motivated largely by racial prejudice, wartime hysteria, and a failure of political leadership' and apologised." |
| Doolittle reprisals | The Zhejiang–Jiangxi campaign / 浙贛作戦 (name *verify*) | May–Sep 1942 | Chinese dead "anywhere from over 20,000 to as many as 250,000", most of them civilians; Chennault reported 250,000; Chinese records 20,000–66,526+ in Zhejiang (tertiary) | the scope of each figure | "After the Doolittle raid of 18 April 1942, Japanese forces swept the Chinese provinces where some of the raiders had come down and struck at the people who had sheltered them. Estimates of the Chinese dead run from over 20,000 to 250,000, most of them civilians." |
| Okinawa's civilians | Okinawa's people / 沖縄戦の住民 | Mar–Jun 1945 | civilian deaths 「10数万」 (more than 100,000), more than soldiers (prefecture's museum statement; yes); 242,225 names of all the dead on the Cornerstone, June 2024 (yes) | the museum's statement: some "driven to take their own lives", some "sacrificed by their own retreating army" | "More civilians died on Okinawa than soldiers: more than 100,000 by the prefecture's count. Some were killed by shellfire, some died of hunger and malaria, some were driven to take their own lives, and some were sacrificed by their own retreating army." |
| Guam | The occupation of Guam / グアムの占領 | Dec 1941 – Aug 1944 | 1,170 people of Guam died; 14,721 suffered atrocities (NPS memorial wall; yes) | NPS; Underwood | "For two and a half years Guam was occupied. 1,170 of its people died in the war, and 14,721 suffered atrocities during the occupation and the battles, by the count on the island's memorial wall." |
| prisoners | Prisoners of the Japanese / 日本軍の捕虜 | 1941–45 | "approximately 22,000 Australians became prisoners of the Japanese" (AWM; yes); deaths in captivity (*verify*) | AWM | "Some 22,000 Australians became prisoners of the Japanese, among many thousands of British, Dutch, American and Indian prisoners." (others' numbers: *verify*) |

Drawing for all of them: a pin at the place (Hiroshima, Nagasaki, Tokyo's
east, Mariveles–San Fernando–Capas as a pin per end, Manila, Zhejiang, the
camps' sites as the cards need), and nothing animated onto it.

### 5.4 Where the decisions stand in the precedents

| precedent | year | what the player could do | response found | opened |
| --- | --- | --- | --- | --- |
| Koei, 提督の決断 / *P.T.O.: Pacific Theater of Operations* | 1989 (PC-9801) | admiral of either side, the whole campaign from before Pearl Harbor | none found; a Japanese-made series played in Japan | en.wikipedia summary via search (*verify*) |
| *Medal of Honor: Rising Sun* | 2003 | opens with the Pearl Harbor attack from the American side | — | not opened (*verify*) |
| *Battlestations: Midway* | 2007 | first mission "Stationed at Pearl": an American defender, a P-40 against the raid | — | StrategyWiki via search |
| *Attack on Pearl Harbor* (Legendo) | 2007 | US or Japanese pilot; the Japanese campaigns "begin during the attack itself"; Metacritic 64 | no controversy recorded | en.wikipedia (yes) |
| *Battlestations: Pacific* (Eidos) | 2009 | a Japanese campaign that "relives the bombing of Pearl Harbor from the eyes of the aggressors" and goes on to alternate history; Ōka and other tokkō units playable | Game Informer's headline: "A Controversial Look Into World War II That Ends Up Being A Bore"; "a peculiar direction ... I'm not sure many Americans are keen to experience" | yes |
| *Medal of Honor* (EA) | 2010 | Taliban playable in multiplayer | renamed "Opposing Force" after "feedback from friends and families of fallen soldiers"; UK defence secretary "disgusted and angry"; no sales on US bases | press via search (*verify* the blog post) |
| Smithsonian, *The Last Act* (Enola Gay) | 1994–95 | an exhibit script with the bombing's Japanese victims | American Legion (18 Jan 1995) and Air Force Association (20 Jan) called for cancellation; 81 members of Congress called for the director's resignation; cancelled 30 Jan 1995; an internal review had found "depictions of Japanese as victims"; 24 members of Congress: Japan shown "more as an innocent victim than a ruthless aggressor" | AFA chronology (yes) |
| *World of Warships* (Wargaming) | 2013, 2015 | IJN ships with the Rising Sun ensign | removed after Korean players' petition (2013); 2015 guideline: hinomaru in game, the ensign only in mods and discussion; a Japanese counter-petition passed 10,000 | Engadget, GameBusiness.jp (yes) |
| *The Eternal Zero* (film) | 2013 | tokkō pilot as protagonist | in Japan, charges of glorification (attributed to Miyazaki and others; *verify*) against a box-office hit admired by Abe | search summaries |
| Battleship Missouri Memorial and Chiran | 2015–present | tokkō pilots' letters shown at Pearl Harbor, in partnership with Chiran | AP (2025): the two museums "work together and support each other's exhibits" | yes |

**Reading.** Playing both sides, and flying the Pearl Harbor attack, have
long precedent and no recorded campaign against them; what drew fire was a
current war's enemy, the atomic bombing's framing, a flag, and tokkō as
heroism. The owner's decisions sit with the precedents that drew none; the
rules of §5.1 keep the app clear of the four that did. No US veterans'
organisation's statement about a game's Japanese side was found.

### 5.5 What `check-data` can enforce

- Copy fields (titles, summaries, stop text, labels, HUD strings, after-card
  templates, both languages) fail on: the Hawaiian list ("this app", "not
  drawn", "is not shown" and kin); a slur list (EN and JA) outside `quote`
  fields; glory words in the app's voice (英霊, 散華, "gave their lives",
  "ultimate sacrifice", "heroes"); "internment" outside quotes and the
  Justice Department camps; "kamikaze" without "tokkō" on the same card.
- An after-card's `yourBattle` lines fail on any number next to men, crew,
  lives, dead, killed, died, people (EN) or 人, 名, 命 (JA).
- A score field fails unless it is one of hits, torpedoes, aircraft, returned,
  time.
- A moment fails if its role's unit is flagged `tokko`, if its group is the
  first wave's high-level bombers at Pearl Harbor, or if its role names a
  person (`pilot`, `name`).
- An event flagged `fixed` fails if its cause can be a player role.
- The Samar box fails if its clock runs past the St. Lo beat's time.
- A unit flagged `hospital` must carry `target: false`.
- Every box's manifest must carry the GLO-30 notice and the liability
  sentence verbatim where it uses GLO-30, and the GMRT credit where it uses
  GMRT (§6.6–6.7).

---

## 6. Licensing

Not legal advice; what the texts say, opened on 2026-10-22.

### 6.1 The repository has no licence

- `/home/user/vibe-dump` has no LICENSE, COPYING or NOTICE file; the root
  `package.json` has no `license` field; no package's `package.json` has one;
  GitHub's API reports `"license": null` for `kumavis/vibe-dump` (public).
- So the code, the cards' text and the baked data are all rights reserved by
  default. choosealicense.com: "the work is under exclusive copyright by
  default"; publishing on GitHub means "you allow others to view and fork your
  repository" and nothing more. GitHub's Terms §D.5 grant other users "a
  nonexclusive, worldwide license to use, display, perform and reproduce (by
  forking) Your Content through the Service"; anything beyond that needs a
  licence.
- What it means here: the owner keeps every right in what the app says; no
  third-party term that demands the app be relicensed may be let in.

### 6.2 Data traced from CC BY-SA maps (forbidden by the design; rightly)

- CC BY-SA 4.0 §3(b): when you share Adapted Material, "Your Adapter's
  License" must be "a Creative Commons license with the same License
  Elements" (or a BY-SA-compatible one), and you may not "impose any
  additional or different terms". A front or a track traced from
  `File:Japanese_Empire2.png` (CC BY-SA 3.0; R2) would be Adapted Material if
  the tracing copies protected expression (the map's selection and drawing),
  which a close tracing does.
- An all-rights-reserved app cannot carry BY-SA material: it would either
  have to be relicensed BY-SA or be infringing. Keep the ban (DESIGN §5.1,
  R2 D6) and keep tracing to the public-domain US charts.

### 6.3 combinedfleet.com: facts, not text

- *Feist v. Rural* (US Supreme Court, 1991; opened): "Facts, whether alone or
  as part of a compilation, are not original and therefore may not be
  copyrighted"; a compilation's copyright "is limited to the particular
  selection or arrangement"; "In no event may copyright extend to the facts
  themselves."
- So a TROM's dates, times, positions, losses and names may be taken, cited
  as a telling (`trom-<ship>`, licence `copyright-cite-only`) and checked
  against the primaries. Its sentences, its authors' notes, its translations
  and its tables' layout may not be copied; no paragraph, no table mirrored
  wholesale. Each TROM carries its authors' copyright (R2 §8.5). The same for
  Lundgren and the print syntheses.
- The site is US-hosted; the EU's database right is not engaged (*verify* if
  it ever matters).

### 6.4 Photographs

- None are planned. The rule if that changes:
  - only US federal photographs, with their archive number (NARA 80-G,
    111-SC, 342-FH; NHHC's 80-G copies) and a caption naming them "Official
    U.S. Navy Photograph" or the like. NHHC's NH series mixes official
    photographs with donated and captured Japanese ones whose status varies:
    check each;
  - no Japanese wartime photographs (their US status turns on publication
    dates and the 1996 restoration of foreign copyrights; *verify* case by
    case) and nothing from NIDS or JACAR without NIDS's permission (R2 D5);
  - never the dead, the wounded or people in the water; never a portrait of
    a named person (the card names; the picture does not).

### 6.5 US government works

- 17 U.S.C. §105(a) (opened): "Copyright protection under this title is not
  available for any work of the United States Government." The action
  reports, ONI narratives and manuals, the NWC analyses, USSBS, the Green
  Books and their maps, the NPS pages may be quoted, redrawn and traced.
- Limits: works by contractors and private donors in government collections;
  a translation of a Japanese work (the ONI Nagumo report) is a US work, the
  Japanese original's facts are free regardless; the Japanese Monographs were
  written by Japanese officers for GHQ (R2: maps *verify*).
- Transcriptions on association sites (the Johnston–Hoel pages) add no
  originality to a faithful copy; cite the report, not the site's layout.

### 6.6 The Copernicus GLO-30 notice: the exact words and where they go

From the Copernicus DEM licence PDF (opened), "Licence for the use of the
Copernicus WorldDEM-30", Article 6:

- (a) unmodified data: "© DLR e.V. 2010-2014 and © Airbus Defence and Space
  GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all
  rights reserved."
- (b) **adapted or modified data (this app: resampled, half-land rule,
  clamped):** "produced using Copernicus WorldDEM-30 © DLR e.V. 2010-2014
  and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by
  the European Union and ESA; all rights reserved".
- (c) **the liability sentence**, "in a licence or any legal warning or
  notice covering their distribution": "The organisations in charge of the
  Copernicus programme by law or by delegation do not incur any liability
  for any use of the Copernicus WorldDEM-30".
- (d) no impression of official endorsement (so no Copernicus or ESA logo).
- (e) anyone granted onward distribution rights must be bound by the same.

DESIGN.md §13 quotes (a); DATA.md (a box pack's `sources`) already has (b);
neither has (c). **Where in the app** (recommendation, D13):

1. a **Sources and credits** panel, opened from a small "sources" control on
   the table, in every box, and from the boot screen's footer, listing every
   data source with its licence: GLO-30 with (b) and (c) verbatim; GMRT with
   its citation, the CC BY 4.0 link and "resampled and clamped"; ETOPO 2022
   (NOAA, public domain, its DOI); Natural Earth (public domain, credited as a
   courtesy); the Hawaiian app's Oʻahu pack's own sources (USGS 3DEP, public
   domain; GMRT); the fonts (SIL OFL 1.1, as FONTS.md);
2. the **box briefing card's footer**, one line per box: "Terrain produced
   using Copernicus WorldDEM-30 © DLR e.V. 2010-2014 and © Airbus Defence and
   Space GmbH 2014-2018 provided under COPERNICUS by the European Union and
   ESA; all rights reserved. Sea floor: GMRT (Ryan et al. 2009), CC BY 4.0,
   resampled." (Pearl Harbor's box: USGS 3DEP and GMRT instead);
3. a **`NOTICE.md` in the package** and the same strings in each box's
   `manifest.json`, so the notice travels with a fork or a download of the
   data (clause e).

### 6.7 GMRT (CC BY 4.0)

- GMRT's terms (opened): the site and products "are licensed under a
  Creative Commons Attribution 4.0 International (CC BY 4.0) License";
  "Appropriate acknowledgment with a byline/credit/link must be given to the
  Global Multi-Resolution Topography Synthesis (GMRT)"; "Data should not be
  used for navigation purposes"; the citation: Ryan, W. B. F., S. M.
  Carbotte, J. Coplan, S. O'Hara, A. Melkonian, R. Arko, R. A. Weissel, V.
  Ferrini, A. Goodwillie, F. Nitsche, J. Bonczkowski, and R. Zemsky (2009),
  Global Multi-Resolution Topography (GMRT) synthesis data set, *Geochem.
  Geophys. Geosyst.*, 10, Q03014 (the DOI was cut off on the page;
  doi:10.1029/2008GC002332, *verify*).
- CC BY 4.0's attribution condition (§3(a), shared with BY-SA 4.0's legal
  code, opened) asks for the creator, a copyright notice if supplied, a link
  to the licence, and an indication **if you modified the material**: hence
  "resampled" in the credit. BY carries no ShareAlike: compatible with an
  all-rights-reserved app.

### 6.8 The other inputs

| input | licence | what the app owes |
| --- | --- | --- |
| ETOPO 2022 (NOAA) | public domain (US government) | a citation with its DOI 10.25921/fd45-gt74, as courtesy |
| Natural Earth 10 m | public domain | nothing required; a credit as courtesy |
| USGS 3DEP (via the Oʻahu pack) | public domain | courtesy credit |
| Noto Sans JP subset (DESIGN §4) | SIL OFL 1.1 (*verify* that Noto declares no Reserved Font Name) | ship the copyright notice and the licence with the font (FONTS.md and the font's name table); a subset is a Modified Version under the OFL |
| Fraunces, Inter | SIL OFL 1.1 | as FONTS.md already says |
| NIDS-held images, Senshi Sōsho charts | permission only (R2 D5) | none ship |
| Morison, the print syntheses | in copyright | facts with citation only |
| Wikipedia text, Commons maps | CC BY-SA | finding aids; nothing copied or traced |

---

## 7. The name

### 7.1 Prior art and marks

| what | where | status | bearing |
| --- | --- | --- | --- |
| PACIFIC THEATRES (design mark), US Reg. 2368501, serial 75761158 | USPTO TSDR (opened): filed 23 Jul 1999, registered 18 Jul 2000, renewed 18 Sep 2019, "LIVE/REGISTRATION/Issued and Active"; class 041 "movie theatre services"; disclaimer "THEATRE"; owner DT Participant, LLC, Los Angeles | live | the Decurion cinema chain closed in 2021 (Chapter 7, en.wikipedia); class 41 also covers entertainment services, but a free, non-commercial web vibe about a war, in the singular, is a different thing; low risk (not legal advice) |
| Pacific Theatre | Vancouver theatre company (First Pacific Theatre Society, 1984) | trades | no mark found |
| *P.T.O.: Pacific Theater of Operations* (提督の決断) | Koei, 1989; sequels | historical | the nearest game title; different words |
| "Pacific Theater" / "Pacific Theatre" | en.wikipedia disambiguation lists the theatres of war, the cinema chain and *P.T.O.* | generic | descriptive of the subject |
| games named after the war | *Pacific War* (Grigsby, 1992), *War in the Pacific* (2004), *Pacific Fire*, *Victory at Sea Pacific* | — | none named "Pacific Theatre" found |

### 7.2 How it reads

- **American reader:** "Pacific Theater" is the war's stage as their
  grandparents' generation named it (the Asiatic-Pacific Theater; the NPS's
  Guam park); "Theatre" reads formal or British, not wrong.
- **Australian or British reader:** correct spelling; "the Pacific" is the
  Australian frame ("War in the Pacific", AWM); a British reader thinks also
  of the Far East and Burma.
- **Japanese reader:** the English word does not carry the military sense on
  its own; 戦域 does. Do not transliterate the title. Give 太平洋戦争 beside
  it, the war's plain Japanese name.
- **The pun.** "A theatre is also a place where a thing is played" works in
  English and is the one thing in DESIGN §12 a critic would quote. Keep the
  thought; never print it.

### 7.3 The gallery card, in the Hawaiian card's voice

The Hawaiian card: "The Hawaiian Islands as they were, from the first canoes
to 1898. Zoom out to watch the chiefdoms and the cultivated land change
across the centuries; zoom in to stand in a real valley in a chosen year."
Two sentences: the thing and its span; then what you can do, as two halves
joined by a semicolon. 37 words.

Draft (43 words):

```json
"gallery": {
  "title": "Pacific Theatre",
  "description": "The Pacific War as a sand table, from Pearl Harbor to Tokyo Bay. Follow the front and the fleets day by day; drop into a battle to watch it as the record tells it, or take one aircraft or one ship, on either side.",
  "tags": ["game", "simulation", "tutorial"],
  "status": "wip"
}
```

Variant, if the owner wants the agency said (47 words): "... or take one
aircraft or one ship, on either side, and see whether you can turn the
battle." The draft in DESIGN §12 (57 words, "a war-room table ... turn their
tide") reads longer than any card in the gallery's register; "turn their
tide" leans toward the "what if" the after-card avoids.

### 7.4 The boot screen's two lines

English:

> **Pacific Theatre**
> The Pacific War, 7 December 1941 – 2 September 1945
> A sand table of the record

Japanese:

> **Pacific Theatre**
> 太平洋戦争　1941年12月8日 – 1945年9月2日
> 記録でたどる砂盤（ジオラマ）

- The dates are each true in their own zone: the attack fell on 7 December
  in Hawaiʻi and on 8 December in Japan, which is the app's own clock rule
  (every instant with its zone) in its first line.
- 砂盤 (sandbox, sand table) is the military term; ジオラマ in brackets for a
  general reader. A native reader should choose between 「記録でたどる砂盤」,
  「記録でたどるジオラマ」 and 「記録にもとづく砂盤」.
- Neither line says what the app does or does not do.

---

## 8. Decisions for the designer

| # | decision | recommendation | why |
| --- | --- | --- | --- |
| D1 | Do Arizona, Oklahoma and Utah keep their record fates in every run? | **Yes**: `fixed` beats, never caused by a player unit, never preventable; the sim resolves everything else at Pearl Harbor | war graves today; avoids "you saved 1,177"; the NPS's own practice |
| D2 | The after-card's structure | **Your sortie / Your battle / The record / What came next**, people only in the record, no shared rows, no sums (§5.2 d) | keeps "no score in people" true when the player changes outcomes |
| D3 | Samar's clock and the first tokkō attack | **Close the box with the surface action; St. Lo's sinking by the Shikishima unit is the closing card** | keeps tokkō out of the sim entirely without dropping it from the record |
| D4 | Moments at Pearl Harbor | **B5N torpedo run, D3A over the airfields (buildings not targets), P-40s, a ship's AA, Nevada; no high-level bomber moment** | no seat is the cause of Arizona's explosion |
| D5 | Targeting rules | **Ships past their fatal threshold and hospital ships are never targets; nothing in the water is** | the strafing-of-survivors rule made mechanical |
| D6 | Figures, parachutes, voices, flags | **None; national markings on aircraft and decks only; no ensigns** | the model style holds; avoids the *World of Warships* flag fight |
| D7 | The player and named people | **The player is never a named person**; leaders' aircraft are AI on the record's track | descendants; "you are one of many" |
| D8 | The war's name | **EN "the Pacific War"; JA 太平洋戦争; 大東亜戦争 and アジア・太平洋戦争 named once in the prologue, with whose names they are** | the most neutral common term in both languages (§3.2) |
| D9 | Tokkō | **"tokkō (special attack)" in the app's voice, "kamikaze" glossed once per card; unit names as the record gives them** | Chiran's own usage; both readers understand it |
| D10 | Japanese names | **Family name first; family name in capitals with kanji on first mention per card (YAMAMOTO Isoroku 山本五十六)**, replacing DESIGN §7.3's "Western order on first mention" | the 2019 government rule and its own device; less clutter than two orders |
| D11 | Macrons | **Modified Hepburn with macrons everywhere except Tokyo, Kyoto, Osaka, Kobe** | Cabinet Notice No. 4 (2025); the established English forms of four cities |
| D12 | Wording for the incarceration and the comfort women | **"the incarceration of Japanese Americans"; "comfort women" in quotation marks, led by Japan's own 2015 words** | JACL; Congress 1988; both governments' published words |
| D13 | Slurs | **Never in the app's voice; quoted only when the quotation is the point, exactly, attributed, in `quote` fields; symmetric for Japanese slurs** | §3.4 |
| D14 | Where the GLO-30 and GMRT credits go | **A Sources and credits panel, the box briefing footer, `NOTICE.md` and box manifests; fix DESIGN §13 to the "produced using" wording and add the liability sentence** | the licence's Article 6 (b), (c), (e) |
| D15 | The repository licence | **Owner's call.** Without one, the app stays all rights reserved; nothing ShareAlike may enter. If the owner wants the code reusable, an MIT licence for code with a separate data notice is the usual shape | §6.1 |
| D16 | Photographs | **None in v1; the §6.4 rule if ever** | no planned use; status traps |
| D17 | The name's Japanese line and the pun | **Keep "Pacific Theatre"; Japanese line 太平洋戦争 and the dates; no katakana title; the pun never printed** | §7.2 |
| D18 | Words for the dead | **"lost their lives" / 「命を落とした」 for crews; "were killed" for civilians killed deliberately; "died" in captivity; "did not return" / 未帰還** | §3.6 |
| D19 | The Japanese label for "the record" | **記録**, not 史実 | the app's record is tellings and ranges |
| D20 | Later: Ten-Gō and Okinawa's picket line | **Ten-Gō defensive moments only; the picket line decided with a historian, not v1** | the 海上特攻 name; one-way missions as the subject |

---

## 9. Risks

1. **"Play the Pearl Harbor attack."** The attacker's seat over moored
   battleships on a Sunday morning is the line a headline will use. The fixed
   fates (D1), the absence of figures and celebration, and an after-card in
   the NPS's and Yoshioka's register are the defence; the risk remains.
2. **Arithmetic in people.** A saved carrier or a sunk one tempts a "lives"
   line in the after-card or the HUD; one careless template undoes the rule.
   The check (§5.5) must hold it.
3. **Tokkō inside a box.** Samar's clock, and later Ten-Gō and Okinawa, put
   one-way missions near the sim. D3 and D20.
4. **The Rising Sun ensign.** Any ship flag or a decorative 旭日 in the UI will
   be seen in Korea and China as the flag of aggression (*World of Warships*).
5. **Register drift.** English drifts to "heroes" and "sacrifice", Japanese
   to 英霊 and 散華; either reads as one side's memorial.
6. **Unchecked Japanese copy.** Every JA string here is a draft by a non-native
   writer. A wrong honorific or a stiff phrase reads as carelessness, a wrong
   term (大東亜戦争 in the app's voice) as a position.
7. **Numbers.** Every casualty figure is contested and scoped (the battle,
   the night, the ship, by the end of the year). A figure without its scope is
   wrong even when it is right.
8. **Museums as sources.** The Nagasaki museum's wording was in dispute in
   2026; Hiroshima's context changed in 1995 and 2019; Yasukuni's narrative
   is contested. Quote a museum as that museum's, never as neutral.
9. **Living memory.** Twelve Pearl Harbor veterans (December 2025); families
   receiving identified remains from Oklahoma; Chamorro and Okinawan
   survivors; Japanese families of the attack's airmen and of the tokkō dead.
10. **Licences.** The wrong GLO-30 notice in DESIGN §13; no liability
    sentence anywhere yet; GMRT's "modified" indication; the Noto subset's
    OFL notice. All cheap to fix now, awkward after `dist/` is committed.
11. **The name.** A live PACIFIC THEATRES cinema mark (low risk); the pun.
12. **The draft's terms.** "Internment" (DESIGN §3.5) and the name-order
    rule (§7.3) as written; "Fuzzy Wuzzy Angels" if Kokoda ever enters;
    "banzai charge" and "the Japanese" as a collective noun.
13. **Western and Chinese, Korean, Filipino readers.** The table's Pacific
    frame thins the war in China, Burma and the occupied territories; the
    cards-only events are where those readers will judge the app.

---

## 10. What could not be reached

| host or work | what was asked | status | consequence |
| --- | --- | --- | --- |
| peace-museum.okinawa.jp (Okinawa Prefectural Peace Memorial Museum) | its site, the founding statement, the exhibit texts, a PDF | curl: connection reset (35); WebFetch: 503 | founding statement read from the prefecture's own PDF instead; exhibit panels unread |
| history.navy.mil (NHHC) | Pearl Harbor fact sheets, Arizona, H-grams | TLS failure through the proxy (000), as in the brief | NWWII Museum and NPS used; NHHC figures *verify* |
| nps.gov/parkhistory/online_books/usar/scrs (Lenihan, *Submerged Cultural Resources Study*, 1989) | Arizona's time of loss and the bomb | redirects to the Park History landing page; npshistory.com mirror 404 | Arizona's minute and the bombardier stay *verify* |
| mofa.go.jp | Kōno statement (1993), Murayama statement (1995), 2019 Diplomatic Bluebook | 403 | quoted through en.wikipedia (tertiary), *verify* |
| kantei.go.jp/jp/singi/seimei_romaji/pdf/moshiawase.pdf | the 2019 name-order agreement | 404 (moved) | read in the MHLW notice that reproduces it (ajha.or.jp) |
| scmp.com | the 2026 Nagasaki "Nanjing Incident" article | 403 | only search summaries and Chinese state media; *verify* |
| hiroshimapeacemedia.jp | the cenotaph inscription and the city's statement | 503 | inscription and "all humanity" from search summaries; *verify* |
| apjjf.org (article 16121 and PDF 1186) | Chiran and Pearl Harbor commemoration | 403 | AP 2025 used instead |
| siarchives.si.edu | the Smithsonian's own account of the Enola Gay exhibit | 403, then "service ... not responding" | the Air Force Association's chronology used (a party to the dispute) |
| densho.org/terminology | Densho's terminology guide | 403 | JACL handbook used |
| deccanherald.com (NYT syndication) | Yoshioka's obituary | 403 | Stars and Stripes 2024 used |
| ussmissouri.org press release | the 2015 exhibit's opening | 404 | AP 2025 used |
| salon.mainichi-kotoba.jp | the 2020 Mainichi poll on the war's name | 403 | figure via ja.wikipedia, *verify* |
| trademark.justia.com | PACIFIC THEATRES record | 403 | USPTO TSDR answered directly |
| en.wikipedia | Tomonaga Jōichi, Kobayashi Michio, Iida Fusata | 404 (no article) or 429 | R4 used for both strike leaders |
| *Medal of Honor: Rising Sun* | its Pearl Harbor level | not opened | *verify* |
| National WWII Museum gallery panels; Yūshūkan panels; Hiroshima's background section; the Okinawa museum's exhibits | the exact panel wordings | no online text found | each museum's framing rests on its own pages and on critics; panels need a visit or a catalogue |
| a US veterans' organisation's statement about a game's Japanese side | — | none found | stated as a gap, not as an absence |

---

## 11. Still needs a person

- **A native Japanese reader** for every Japanese string in this file and in
  the app (cards, the boot lines, the after-card labels, the dead-words
  table), and for romaji, macrons and readings (Yoshioka's kanji; 浙贛作戦).
- **A historian of the war on each side** (a US naval historian; a historian
  of Japan who reads 戦闘詳報) for every card that touches the dead or the
  living, and for the hard cases of §5.2. The Hawaiian app's standard: a
  reviewer for "every card that touches the sacred, the dead or the living".
- **Readers from the places the cards-only events happened**: Okinawan,
  Chamorro, Filipino, Korean and Chinese readers for the Okinawa, Guam,
  Bataan and Manila, comfort-women and Zhejiang–Jiangxi cards.
- **The museum panels**: a visit or catalogue for the National WWII Museum's
  "Downfall" gallery, the Pearl Harbor visitor centre's galleries, the
  Yūshūkan, the Okinawa museum, the Hiroshima museum's history section, if
  the cards are to quote panel wording.
- **The NHHC pages and the NPS Lenihan study** from a machine that can reach
  them: Arizona's minute, the bomb, the bombardier; Pearl Harbor's totals;
  the Japanese dead (55 + 9).
- **The living-veteran counts at build time** (the Sons and Daughters of
  Pearl Harbor Survivors; the Midway and Taffy 3 associations), so no card
  says "the last" wrongly.
- **The owner** for D15 (a repository licence) and, if wanted, a lawyer's
  look at the PACIFIC THEATRES mark and the Copernicus terms.
- **Exact government texts**: the Kōno statement (1993), the 2015 agreement's
  Japanese text, the 2019 Bluebook line, from MOFA.

---

## 12. URLs requested (status)

Opened and read (200 unless noted):

- NPS, USS Arizona (PERL): <https://www.nps.gov/perl/learn/historyculture/uss-arizona.htm>
- NPS, USS Arizona (VALR): <https://www.nps.gov/valr/learn/historyculture/uss-arizona.htm>
- NPS, Pearl Harbor National Memorial: <https://www.nps.gov/perl/index.htm>
- NPS, USS Oklahoma: <https://www.nps.gov/perl/learn/historyculture/uss-oklahoma.htm>
- NPS, People: <https://www.nps.gov/perl/learn/historyculture/people.htm>
- NPS, Civilian Casualties: <https://home.nps.gov/perl/learn/historyculture/civilian-casualties.htm>
- NPS, War in the Pacific NHP: <https://www.nps.gov/wapa/index.htm>
- NPS, Memorial Wall of Names, Guam: <https://www.nps.gov/places/memorial-wall-of-names-guam.htm>
- The National WWII Museum, exhibits: <https://www.nationalww2museum.org/visit/exhibits>
- The National WWII Museum, Pearl Harbor fact sheet: <https://www.nationalww2museum.org/sites/default/files/2017-07/pearl-harbor.pdf>
- National Museum of the Pacific War, about: <https://www.pacificwarmuseum.org/about>; home: <https://www.pacificwarmuseum.org/>
- Okinawa Prefecture, Cornerstone of Peace: <https://www.pref.okinawa.jp/heiwakichi/jinken/1008269/1008287/1008296/index.html>, purpose <https://www.pref.okinawa.jp/heiwakichi/jinken/1008269/1008287/1008296/1008297.html>, names <https://www.pref.okinawa.jp/heiwakichi/jinken/1008269/1008287/1008296/1008298.html>, numbers <https://www.pref.okinawa.jp/heiwakichi/jinken/1008269/1008287/1008296/1008299.html>
- Okinawa Prefecture, peace administration (museum founding statement): <https://www.pref.okinawa.lg.jp/_res/projects/default_project/_page_/001/032/988/05_sankoushiryo1.pdf>
- Hiroshima Peace Memorial Museum: <https://hpmmuseum.jp/?lang=eng>
- City of Hiroshima, deaths: <https://www.city.hiroshima.lg.jp/english/peace/1029875/1010074.html>
- Nagasaki, damage: <https://nagasakipeace.jp/en/reference/materials/kids/higai.html>
- Yasukuni: <https://www.yasukuni.or.jp/history/detail.html>, <https://www.yasukuni.or.jp/history/index.html>, <https://www.yasukuni.or.jp/english/about/>, <https://www.yasukuni.or.jp/english/yushukan/> (<https://www.yasukuni.or.jp/yushukan/> 404)
- Chiran Peace Museum: <https://www.chiran-tokkou.jp/>, <https://www.chiran-tokkou.jp/heiwakaikan.html>, <https://www.chiran-tokkou.jp/background.html>, <https://www.chiran-tokkou.jp/summary.html>, <https://www.chiran-tokkou.jp/pilots.html>, <https://www.chiran-tokkou.jp/en>
- Yamato Museum: <https://yamato-museum.com/>, its 趣旨・基本方針・方向性 page and <https://yamato-museum.com/yamato-data/>
- AWM: <https://www.awm.gov.au/learn/schools/sww/pacific>, <https://www.awm.gov.au/research/guide/pow-ww2-japan>
- Vilu: <https://en.wikipedia.org/wiki/Vilu_Military_Museum>, <https://devpolicy.org/vilu-war-museum-tourism-in-solomon-islands-20150312/>
- JACAR, 太平洋戦争／大東亜戦争: <https://www.jacar.go.jp/topicsfromjacar/01_warissues/index01_001.html>
- Kantei, Ishiba press conference, 10 Oct 2025: <https://www.kantei.go.jp/jp/103/statement/2025/1010kaiken.html>
- Kantei, Abe at Pearl Harbor, 27 Dec 2016: <https://japan.kantei.go.jp/97_abe/statement/201612/1220678_11021.html>
- Obama and Abe at Hiroshima, 27 May 2016: <https://obamawhitehouse.archives.gov/the-press-office/2016/05/27/remarks-president-obama-and-prime-minister-abe-japan-hiroshima-peace>
- Agency for Cultural Affairs, Q&A on Cabinet Notice No. 4 (2025): <https://www.bunka.go.jp/seisaku/kokugo_nihongo/kokugo_shisaku/pdf/94336801_01.pdf>, <https://www.bunka.go.jp/seisaku/kokugo_nihongo/kokugo_shisaku/pdf/94340701_01.pdf>
- MHLW notice reproducing the 2019 name-order agreement: <https://www.ajha.or.jp/topics/admininfo/pdf/2020/200129_1.pdf>
- JACL, *Power of Words* handbook: <https://jacl.org/s/POW-Handbook-Rev2020-V4.pdf>; NPS Tule Lake copy: <https://www.nps.gov/tule/learn/education/upload/Power_of_Words.pdf>
- NHHC caption of 80-G-259446 (HyperWar): <https://ibiblio.org/hyperwar/OnlineLibrary/photos/images/g250000/g259446d.htm>
- USSBS, *The Effects of Atomic Bombs on Hiroshima and Nagasaki* (HyperWar): <https://www.ibiblio.org/hyperwar/AAF/USSBS/AtomicEffects/index.html>, <https://www.ibiblio.org/hyperwar/AAF/USSBS/AtomicEffects/AtomicEffects-2.html>, <https://www.ibiblio.org/hyperwar/AAF/USSBS/AtomicEffects/AtomicEffects-3.html>
- Morton, *The Fall of the Philippines*, ch. XXVI (HyperWar): <https://www.ibiblio.org/hyperwar/USA/USA-P-PI/USA-P-PI-26.html>
- Stars and Stripes, no survivors attend (7 Dec 2025): <https://www.stripes.com/theaters/asia_pacific/2025-12-07/no-survivors-attend-pearl-harbor-ceremony-20017523.html>
- Stars and Stripes, Yoshioka obituary (27 Sep 2024): <https://stripes.com/theaters/asia_pacific/2024-09-27/masamitsu-yoshioka-japan-obituary-15328988.html>
- AP via KSAT, Missouri's burial of a tokkō pilot (10 Apr 2025): <https://www.ksat.com/news/world/2025/04/11/a-us-navy-captain-ordered-a-military-funeral-for-a-kamikaze-pilot-during-wwii-heres-why/>
- Game Informer, *Battlestations: Pacific* review: <https://www.gameinformer.com/games/battlestations_pacific/b/xbox360/archive/2009/09/22/review.aspx>
- *Attack on Pearl Harbor* (video game): <https://en.wikipedia.org/wiki/Attack_on_Pearl_Harbor_(video_game)>
- GameBusiness.jp, *World of Warships* guideline (2015): <https://www.gamebusiness.jp/article/2015/07/13/11140.html>
- Engadget, *World of Warships* flag (2013): <https://www.engadget.com/2013-07-07-korean-players-protest-a-flag-in-world-of-warships.html>
- Air Force Association, Enola Gay chronology: <https://secure.afa.org/media/enolagay/chrono.asp>
- USPTO TSDR, serial 75761158: <https://tsdr.uspto.gov/statusview/sn75761158>
- AWS Registry, Copernicus DEM: <https://registry.opendata.aws/copernicus-dem/>; Copernicus Data Space, COP-DEM: <https://dataspace.copernicus.eu/explore-data/data-collections/copernicus-contributing-missions/collections-description/COP-DEM>; licence PDF: <https://dataspace.copernicus.eu/sites/default/files/media/files/2025-06/copernicus_contributing_mission_data_access_v2_cop_dem_licenses.pdf>; bucket listing <https://copernicus-dem-30m.s3.amazonaws.com/>
- GMRT terms of use: <https://www.gmrt.org/about/terms_of_use.php>; about: <https://www.gmrt.org/about/>
- choosealicense, no licence: <https://choosealicense.com/no-permission/>
- GitHub Terms of Service: <https://docs.github.com/en/site-policy/github-terms/github-terms-of-service>
- *Feist v. Rural*, 499 U.S. 340: <https://www.law.cornell.edu/supremecourt/text/499/340>
- 17 U.S.C. §105: <https://www.law.cornell.edu/uscode/text/17/105>
- 50 U.S.C. §4202: <https://www.law.cornell.edu/uscode/text/50/4202>
- CC BY-SA 4.0 legal code: <https://creativecommons.org/licenses/by-sa/4.0/legalcode.en>
- GitHub API, repository metadata (`gh api repos/kumavis/vibe-dump`): license null, visibility public
- ja.wikipedia (`action=raw`, tertiary): 太平洋戦争, 大東亜戦争, アジア太平洋戦争 (redirect to アジア・太平洋戦争), 特別攻撃隊, 玉砕, 戦域
- en.wikipedia (`action=raw`, tertiary): Mitsuo Fuchida, Minoru Genda, Tamon Yamaguchi, Chūichi Nagumo, Takeo Kurita, Jisaburō Ozawa, Shōji Nishimura, Seiichi Itō, Isoroku Yamamoto, Chester W. Nimitz, Raymond A. Spruance, Frank Jack Fletcher, William Halsey Jr., Willis Augustus Lee, Clifton Sprague, Ernest E. Evans, C. Wade McClusky, Richard Halsey Best, Max Leslie, John Thach, John C. Waldron, George H. Gay Jr., George Welch (pilot), Kenneth M. Taylor, Jacob C. Vouza, Martin Clemens, Kaname Harada; Pacific Theatre (disambiguation), Pacific Theatres, Theater (warfare), Pacific War (disambiguation); Bataan Death March, Manila massacre, Hell ship, Comfort women, Bombing of Tokyo (10 March 1945), Zhejiang-Jiangxi campaign, Atomic bombings of Hiroshima and Nagasaki, Internment of Japanese Americans, Japanese occupation of Guam, Murayama Statement

Search results only (not opened; each *verify*): the 2010 Pearl Harbor
visitor centre galleries (Honolulu Star-Advertiser, Fox News); the National
WWII Museum's "Downfall" gallery (press); Yūshūkan critiques (JCP 2005, CS
Monitor 2005, Korea Times 2013, China Daily 2014); the Hiroshima 2019
renewal (APJJF/Kingston, dark-tourism.com); the Nagasaki 1996 and 2026
disputes (IPS, APJJF, People's Daily, SCMP); the cenotaph debate (Hiroshima
Peace Media); the National Army Museum's *Beyond Burma* (2025–26); the "Fuzzy
Wuzzy Angels" debate (UNSW, Western Sydney, AWM encyclopedia); *Medal of
Honor* 2010 (Engadget, Shacknews, MCV); *The Eternal Zero* (Film Comment and
others); Koei *P.T.O.*; Miniclier and Lenoir; the Japanese Garden of Peace
(museum page via search); the Iida marker (Marines.mil); the Arizona bomb and
bombardier (worldwar2database, NPS park history via search); the 2025
romanisation timeline (en.wikipedia, JREF).
