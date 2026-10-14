# Pōhaku Tumble: Hawaiian term verification

Checked 2026-10-04. One entry per term in the design: verdict, exact spelling, a one-line meaning and the sources behind it. The same data is in `terms.json`.

Local citations like `kaikki-haw.jsonl:1619` or `andrews-parker1922.txt:4599` are line numbers in the copies `roots/fetch_sources.sh` downloads. The Wiktionary dump changes over time, so its line numbers are as of that date.

**Verdicts:** confirmed: 50, spelling correction: 1, meaning correction: 1 (total 52 entries).

## Changes to make

1. **Nā Lani → Nālani.** The star-compass house is one word in every PVS source, including the canonical diagram.
2. **Kula is not above the forest.** Kula is open plain or dry open country between the shore and the forest (zone order: wao akua, wao kanaka, kula, kahakai). Do not draw it as "upland" above the wao.
3. **Mirror the house order; do not rotate it.** In every quadrant Lā is next to the E/W point and Haka next to the N/S point. Going clockwise the order runs Haka→Lā in NE and SW, and Lā→Haka in SE and NW. See the table below.
4. **Lā is a house, not the E-W line.** Due east is the house Hikina and due west is Komohana. The four Lā houses sit 11.25° either side of them.

## Doubts and variants

- **Nā Leo vs Nāleo.** The canonical diagram, the archive, the 1992 release and the 2021 UH dissertation write *Nā Leo*. Current hokulea.com prose writes *Nāleo*. Recommendation: **Nā Leo**. Nālani (one word) and Nā Leo (two words) really are spaced differently.
- **The house names are modern**, devised by Nainoa Thompson according to the PVS archive. Credit the compass to PVS / Nainoa Thompson and do not call the house names ancient.
- **Malanai and Hoʻolua** are wind names. The 1922 dictionary calls Malanai a gentle NE trade wind and Hoʻolua a north wind. The SE and NW quadrant assignments are PVS conventions. That is fine for the design, but do not caption them as "the SE wind" or "the NW wind".
- **ahupuaʻa etymology.** The pig-on-the-ahu story is the traditional explanation, and sources give two versions (a pig image, or a pig as tribute). Present it as tradition.
- **The Wiktionary extract has slips:** *kuapa* has no kahakō (correct: **kuapā**), and *noio* is glossed as the lesser noddy (Hawaiʻi's noio is the black noddy, *Anous minutus*).
- **Homographs to watch:** *ulu* (growth) vs *ʻulu* (breadfruit); *mākāhā* (sluice gate) vs *Mākaha* (place); *kanaka* (person) vs *kānaka* (people, plural).
- **Not in the Wiktionary extract** (confirmed from other sources): Koʻolau, Malanai, Hoʻolua, mākāhā, kauhale (as a headword), wao akua, ʻalaea, loʻi kalo and hālau waʻa (as compounds).

## Encoding

- ʻokina = **U+02BB**. Never use U+2018 (‘) or U+0027 ('). Several cited pages (NPS, UH SeaLearning, Kumukahi, hokulea.com/polynesian-wayfinding) type U+2018.
- kahakō = precomposed vowels (ā U+0101, Ā U+0100, ō U+014D …), NFC. The brief's "ʻĀina vs ʻĀina" most likely differ only in encoding. Use `U+02BB U+0100 i n a`.
- `terms.json` gives the non-ASCII code points of every spelling.

## Star compass: all 32 houses

Clockwise from north. Each house spans ±5.625° around its azimuth. Full name = house + quadrant (e.g. *Manu Malanai* = SE). Checked against the PVS archive table and diagram.

| az° | house | quadrant | point |
|---:|---|---|---|
| 0 | ʻĀkau | (cardinal) | N |
| 11.25 | Haka | Koʻolau | N by E |
| 22.5 | Nā Leo | Koʻolau | NNE |
| 33.75 | Nālani | Koʻolau | NE by N |
| 45 | Manu | Koʻolau | NE |
| 56.25 | Noio | Koʻolau | NE by E |
| 67.5 | ʻĀina | Koʻolau | ENE |
| 78.75 | Lā | Koʻolau | E by N |
| 90 | Hikina | (cardinal) | E |
| 101.25 | Lā | Malanai | E by S |
| 112.5 | ʻĀina | Malanai | ESE |
| 123.75 | Noio | Malanai | SE by E |
| 135 | Manu | Malanai | SE |
| 146.25 | Nālani | Malanai | SE by S |
| 157.5 | Nā Leo | Malanai | SSE |
| 168.75 | Haka | Malanai | S by E |
| 180 | Hema | (cardinal) | S |
| 191.25 | Haka | Kona | S by W |
| 202.5 | Nā Leo | Kona | SSW |
| 213.75 | Nālani | Kona | SW by S |
| 225 | Manu | Kona | SW |
| 236.25 | Noio | Kona | SW by W |
| 247.5 | ʻĀina | Kona | WSW |
| 258.75 | Lā | Kona | W by S |
| 270 | Komohana | (cardinal) | W |
| 281.25 | Lā | Hoʻolua | W by N |
| 292.5 | ʻĀina | Hoʻolua | WNW |
| 303.75 | Noio | Hoʻolua | NW by W |
| 315 | Manu | Hoʻolua | NW |
| 326.25 | Nālani | Hoʻolua | NW by N |
| 337.5 | Nā Leo | Hoʻolua | NNW |
| 348.75 | Haka | Hoʻolua | N by W |

Rising and setting: a star rising in house X of Koʻolau sets in house X of Hoʻolua, and one rising in X of Malanai sets in X of Kona. Stars stay on their own side of the E-W line. Swells and wind instead cross to the same house in the diagonally opposite quadrant (180° away).

## 1. Star compass

| design term | verdict | use exactly | meaning |
|---|---|---|---|
| 32 houses of 11.25° | **confirmed** | — | 32 houses, each 11.25° wide; 4 of them are the cardinal points, 7 named houses fill each quadrant (4 × 7 + 4 = 32). |
| ʻĀkau | **confirmed** | ʻĀkau | North (literally "right": facing west with your back to the east, your right hand points north). |
| Hikina | **confirmed** | Hikina | East: where the sun and stars "arrive" (hiki). |
| Hema | **confirmed** | Hema | South (literally "left"). |
| Komohana | **confirmed** | Komohana | West: where the sun and stars "enter" (komo) the sea. |
| Lā | **confirmed** | Lā | Sun; the house on either side of Hikina and of Komohana. |
| ʻĀina | **confirmed** | ʻĀina | Land. |
| Noio | **confirmed** | Noio | Noddy tern (Hawaiian black noddy, Anous minutus), a seabird that fishes by day and returns to land at night. |
| Manu | **confirmed** | Manu | Bird; the four Manu houses are the intercardinal points (NE, SE, SW, NW). |
| Nā Lani | **spelling correction** | Nālani | The heavens (nā "the", plural + lani "sky"). |
| Nā Leo | **confirmed** | Nā Leo | The voices (the voices of the stars speaking to the navigator). |
| Haka | **confirmed** | Haka | Empty (the relatively empty sky around the celestial poles). |
| order Lā, ʻĀina, Noio, Manu, Nā Lani, Nā Leo, Haka (east toward north), repeated in each quadrant | **confirmed** | Lā, ʻĀina, Noio, Manu, Nālani, Nā Leo, Haka | Lā is next to Hikina/Komohana and Haka is next to ʻĀkau/Hema in every quadrant. |
| Koʻolau | **confirmed** | Koʻolau | Windward; the NE quadrant, named for the side of the islands facing the NE trade winds. |
| Malanai | **confirmed** | Malanai | SE quadrant, named for a gentle breeze. |
| Kona | **confirmed** | Kona | Leeward; the SW quadrant (winds from the south or southwest). |
| Hoʻolua | **confirmed** | Hoʻolua | NW quadrant, named for a strong north wind. |
| a star rising in a house in the east sets in the house of the same name in the west | **confirmed** | — | A star that rises in house X in Koʻolau (NE) sets in house X in Hoʻolua (NW). A star that rises in X in Malanai (SE) sets in X in Kona (SW). |

### 32 houses of 11.25°

- Design: *32 houses of 11.25°*, glossed "compass layout". Verdict: **confirmed**.
- Note: Each name marks the centre of its house, so a house spans ±5.625° around its point. The house names are modern: the PVS archive says they "were devised by Nainoa Thompson" (it credits Will Kyselka, An Ocean in Mind, pp. 96-97). The cardinal and quadrant (wind) names are older Hawaiian words. Present the houses as the PVS / Nainoa Thompson star compass, not as ancient names.
- Sources:
  - [PVS / Hōkūleʻa, "The Star Compass" (text and diagram © Nainoa Thompson)](https://worldwidevoyage.hokulea.com/education-at-sea/polynesian-navigation/the-star-compass/): says 32 houses, "4 of which are the cardinal points", 11.25° apart
  - [PVS archive, "Hawaiian Star Compass" (Nainoa Thompson; names after Kyselka, An Ocean in Mind 96-97)](https://archive.hokulea.com/navigate/stars.html): each named point is "the midpoint of a house of the same name", each house 11.25° wide
  - [PVS star compass diagram, compass_with_stars.gif (© Nainoa Thompson)](https://worldwidevoyage.hokulea.com/wp-content/uploads/2014/04/compass_with_stars.gif): diagram draws Hikina, ʻĀkau, Komohana, Hema as their own (shaded) houses

### ʻĀkau

- Design: *ʻĀkau*, glossed "N". Verdict: **confirmed**.
- Non-ASCII code points: U+02BB U+0100
- Sources:
  - [PVS / Hōkūleʻa, "The Star Compass" (text and diagram © Nainoa Thompson)](https://worldwidevoyage.hokulea.com/education-at-sea/polynesian-navigation/the-star-compass/): ʻĀkau, "Right or North"
  - kaikki-haw.jsonl:1619: ʻākau: right (not left); north
  - andrews-parker1922.txt:4599: Akau: north, one of the four cardinal points
  - [PVS star compass diagram, compass_with_stars.gif (© Nainoa Thompson)](https://worldwidevoyage.hokulea.com/wp-content/uploads/2014/04/compass_with_stars.gif): label ʻĀKAU (North)

### Hikina

- Design: *Hikina*, glossed "E". Verdict: **confirmed**.
- Sources:
  - [PVS / Hōkūleʻa, "The Star Compass" (text and diagram © Nainoa Thompson)](https://worldwidevoyage.hokulea.com/education-at-sea/polynesian-navigation/the-star-compass/): the arriving horizon is called Hikina
  - kaikki-haw.jsonl:1620: hikina: east; hiki "to come" + -na
  - andrews-parker1922.txt:17692: Hikina: the east, the place of the sun's rising

### Hema

- Design: *Hema*, glossed "S". Verdict: **confirmed**.
- Sources:
  - [PVS / Hōkūleʻa, "The Star Compass" (text and diagram © Nainoa Thompson)](https://worldwidevoyage.hokulea.com/education-at-sea/polynesian-navigation/the-star-compass/): Hema, "Left or South"
  - kaikki-haw.jsonl:1176: hema: left; south
  - andrews-parker1922.txt:17013: Hema: left; welau hema = south pole

### Komohana

- Design: *Komohana*, glossed "W". Verdict: **confirmed**.
- Sources:
  - [PVS / Hōkūleʻa, "The Star Compass" (text and diagram © Nainoa Thompson)](https://worldwidevoyage.hokulea.com/education-at-sea/polynesian-navigation/the-star-compass/): the entering horizon is called Komohana
  - kaikki-haw.jsonl:1621: komohana: west; komo "to enter"
  - andrews-parker1922.txt:47648: Komohana: the west, where the sun enters the sea

### Lā

- Design: *Lā*, glossed "house next to E/W". Verdict: **confirmed**.
- Non-ASCII code points: U+0101
- Note: Lā is a house, not the east-west line. The east and west points are the houses Hikina and Komohana. There are four Lā houses, centred 11.25° north and south of due east and due west.
- Sources:
  - [PVS / Hōkūleʻa, "The Star Compass" (text and diagram © Nainoa Thompson)](https://worldwidevoyage.hokulea.com/education-at-sea/polynesian-navigation/the-star-compass/): first house Lā (Sun) "positioned on either side of Hikina (East) and Komohana (West)"
  - [PVS archive, "Hawaiian Star Compass" (Nainoa Thompson; names after Kyselka, An Ocean in Mind 96-97)](https://archive.hokulea.com/navigate/stars.html): La Koʻolau = E by N, La Malanai = E by S, La Hoʻolua = W by N, La Kona = W by S
  - [PVS archive, "Hawaiian Star Lines" (declination / house tables)](https://archive.hokulea.com/ike/hookele/hawaiian_star_lines.html): a star at declination 0° (Mintaka) is listed under Hikina-Komohana, not Lā; Rigel at -8° is in Lā
  - kaikki-haw.jsonl:603: lā: sun
  - andrews-parker1922.txt:53622: La: the sun

### ʻĀina

- Design: *ʻĀina*, glossed "house 2". Verdict: **confirmed**.
- Non-ASCII code points: U+02BB U+0100
- Note: The two spellings in the brief look the same. Use U+02BB (ʻokina) + U+0100 (Ā), NFC-normalised, not U+2018/U+0027 or A + combining macron. hokulea.com/polynesian-wayfinding uses U+2018 as its ʻokina, which is a font workaround.
- Sources:
  - [PVS / Hōkūleʻa, "The Star Compass" (text and diagram © Nainoa Thompson)](https://worldwidevoyage.hokulea.com/education-at-sea/polynesian-navigation/the-star-compass/): ʻĀina (Land), written with U+02BB and precomposed Ā (U+0100)
  - [PVS star compass diagram, compass_with_stars.gif (© Nainoa Thompson)](https://worldwidevoyage.hokulea.com/wp-content/uploads/2014/04/compass_with_stars.gif): label ʻĀINA
  - kaikki-haw.jsonl:1689: ʻāina: land
  - andrews-parker1922.txt:3973: Aina: land

### Noio

- Design: *Noio*, glossed "house 3". Verdict: **confirmed**.
- Sources:
  - [PVS / Hōkūleʻa, "The Star Compass" (text and diagram © Nainoa Thompson)](https://worldwidevoyage.hokulea.com/education-at-sea/polynesian-navigation/the-star-compass/): Noio (Tern)
  - [PVS archive, "Hawaiian Star Compass" (Nainoa Thompson; names after Kyselka, An Ocean in Mind 96-97)](https://archive.hokulea.com/navigate/stars.html): named for the Hawaiian tern, range about 40 miles
  - kaikki-haw.jsonl:2109: noio: "lesser noddy (Anous tenuirostris)", probably a Wiktionary error; see the Hawaiʻi Birding Trails entry
  - [State of Hawaiʻi, Hawaiʻi Birding Trails, "black noddy | noio"](https://hawaiibirdingtrails.hawaii.gov/bird/black-noddy): Anous minutus | black noddy | noio

### Manu

- Design: *Manu*, glossed "house 4". Verdict: **confirmed**.
- Sources:
  - [PVS / Hōkūleʻa, "The Star Compass" (text and diagram © Nainoa Thompson)](https://worldwidevoyage.hokulea.com/education-at-sea/polynesian-navigation/the-star-compass/): Manu (Bird)
  - [PVS archive, "Hawaiian Star Compass" (Nainoa Thompson; names after Kyselka, An Ocean in Mind 96-97)](https://archive.hokulea.com/navigate/stars.html): Manu Koʻolau = NE, etc.
  - kaikki-haw.jsonl:100: manu: bird
  - andrews-parker1922.txt:65080: Manu: bird

### Nālani

- Design: *Nā Lani*, glossed "house 5". Verdict: **spelling correction**.
- Non-ASCII code points: U+0101
- Note: Use Nālani, as one word. "Nā Lani" turns up only in a 2019 UH computer-science thesis. Every PVS source writes it as one word.
- Sources:
  - [PVS star compass diagram, compass_with_stars.gif (© Nainoa Thompson)](https://worldwidevoyage.hokulea.com/wp-content/uploads/2014/04/compass_with_stars.gif): canonical PVS diagram labels it NĀLANI, one word
  - [PVS / Hōkūleʻa, "The Star Compass" (text and diagram © Nainoa Thompson)](https://worldwidevoyage.hokulea.com/education-at-sea/polynesian-navigation/the-star-compass/): Nālani (Heavens)
  - [PVS archive, "Hawaiian Star Compass" (Nainoa Thompson; names after Kyselka, An Ocean in Mind 96-97)](https://archive.hokulea.com/navigate/stars.html): Nalani (no diacritics; one word), named for Canopus
  - [PVS Archives on Ulukau, News and Magazine Articles 1992, p. 19 (PVSA-008_0096.1.19)](https://www.ulukau.org/pagespvs/cgi-bin/pagespvs?a=d&d=PVSA-008_0096.1.19): 1992 PVS release: "Nalani (The Heavens)", one word
  - [Iaukea, L. K. (2021), PhD diss., UH Mānoa, ScholarSpace 10125/81614, pp. 185-186](https://hdl.handle.net/10125/81614): Nālani, one word
  - [Karjala, P. A. (2019), MS thesis "Kilo Hōkū", UH Mānoa, ScholarSpace 10125/66205, Table 2](https://hdl.handle.net/10125/66205): minority variant "nā lani", two words
  - kaikki-haw.jsonl:910: Nālani is also a given name, "the heavens, the chiefs"

### Nā Leo

- Design: *Nā Leo*, glossed "house 6". Verdict: **confirmed**.
- Non-ASCII code points: U+0101
- Note: The PVS spacing is inconsistent: Nālani is always one word, but Nā Leo is two words in the diagram, the archive, the 1992 release and the UH dissertation, and one word ("Nāleo") in the current hokulea.com text. Nā Leo (two words) matches the canonical diagram. Do not "fix" it to match Nālani.
- Sources:
  - [PVS star compass diagram, compass_with_stars.gif (© Nainoa Thompson)](https://worldwidevoyage.hokulea.com/wp-content/uploads/2014/04/compass_with_stars.gif): canonical diagram labels it NĀ LEO, two words
  - [PVS archive, "Hawaiian Star Compass" (Nainoa Thompson; names after Kyselka, An Ocean in Mind 96-97)](https://archive.hokulea.com/navigate/stars.html): "Na Leo: The Voices"; also once "NaLeo" in the star-lines tables
  - [PVS Archives on Ulukau, News and Magazine Articles 1992, p. 19 (PVSA-008_0096.1.19)](https://www.ulukau.org/pagespvs/cgi-bin/pagespvs?a=d&d=PVSA-008_0096.1.19): 1992: "Na Leo (The Voices)"
  - [Iaukea, L. K. (2021), PhD diss., UH Mānoa, ScholarSpace 10125/81614, pp. 185-186](https://hdl.handle.net/10125/81614): Nā Leo
  - [PVS / Hōkūleʻa, "The Star Compass" (text and diagram © Nainoa Thompson)](https://worldwidevoyage.hokulea.com/education-at-sea/polynesian-navigation/the-star-compass/): current hokulea.com prose writes "Nāleo", one word, as a variant
  - kaikki-haw.jsonl:84: leo: voice; sound

### Haka

- Design: *Haka*, glossed "house 7 (next to N/S)". Verdict: **confirmed**.
- Sources:
  - [PVS / Hōkūleʻa, "The Star Compass" (text and diagram © Nainoa Thompson)](https://worldwidevoyage.hokulea.com/education-at-sea/polynesian-navigation/the-star-compass/): Haka (Empty)
  - [PVS archive, "Hawaiian Star Compass" (Nainoa Thompson; names after Kyselka, An Ocean in Mind 96-97)](https://archive.hokulea.com/navigate/stars.html): Haka Koʻolau = N by E; "relatively empty skies around the north and south celestial poles"
  - kaikki-haw.jsonl:262: haka: empty, vacant
  - andrews-parker1922.txt:12713: Haka: a hole; a breach

### Lā, ʻĀina, Noio, Manu, Nālani, Nā Leo, Haka

- Design: *order Lā, ʻĀina, Noio, Manu, Nā Lani, Nā Leo, Haka (east toward north), repeated in each quadrant*, glossed "house order". Verdict: **confirmed**.
- Non-ASCII code points: U+0101 U+02BB U+0100 U+0101 U+0101
- Note: The order is mirrored, not rotated. It always runs from the E or W point toward the N or S point. Going clockwise from north you get Haka, Nā Leo, Nālani, Manu, Noio, ʻĀina, Lā (NE), then Hikina, then Lā, ʻĀina, Noio, Manu, Nālani, Nā Leo, Haka (SE), and so on. Code that rotates one 7-name list by 90° per quadrant puts SE and NW in the wrong order. See the 32-house table.
- Sources:
  - [PVS / Hōkūleʻa, "The Star Compass" (text and diagram © Nainoa Thompson)](https://worldwidevoyage.hokulea.com/education-at-sea/polynesian-navigation/the-star-compass/): "Starting in the east and moving northwards and southwards": Lā ... Haka
  - [PVS archive, "Hawaiian Star Compass" (Nainoa Thompson; names after Kyselka, An Ocean in Mind 96-97)](https://archive.hokulea.com/navigate/stars.html): full 28-point table, e.g. Haka Koʻolau = N by E, Lā Koʻolau = E by N
  - [PVS archive compass diagram (compass.gif, linked from navigate/compass.html)](https://archive.hokulea.com/pics/compass.gif): diagram with bearings 0°, 11.25° ... 180°
  - [PVS star compass diagram, compass_with_stars.gif (© Nainoa Thompson)](https://worldwidevoyage.hokulea.com/wp-content/uploads/2014/04/compass_with_stars.gif): diagram

### Koʻolau

- Design: *Koʻolau*, glossed "NE quadrant". Verdict: **confirmed**.
- Non-ASCII code points: U+02BB
- Note: Kaikki has no Koʻolau entry. Spelling from PVS/UH.
- Sources:
  - [PVS / Hōkūleʻa, "The Star Compass" (text and diagram © Nainoa Thompson)](https://worldwidevoyage.hokulea.com/education-at-sea/polynesian-navigation/the-star-compass/): Koʻolau "is theNortheast quadrant and is named for the trade winds"
  - [PVS archive, "Hawaiian Star Compass" (Nainoa Thompson; names after Kyselka, An Ocean in Mind 96-97)](https://archive.hokulea.com/navigate/stars.html): Ko'olau is the NE quadrant
  - [U.S. National Library of Medicine, "A Voyage to Health" exhibit: Hawaiian Star Compass (credit: C. Nainoa Thompson)](https://www.nlm.nih.gov/exhibition/avoyagetohealth/education/online-star-horizons.html): Koʻolau: windward sides of the islands
  - andrews-parker1922.txt:48030: Koolau: 1. North. 2. general name of lands on the north side
  - [PVS star compass diagram, compass_with_stars.gif (© Nainoa Thompson)](https://worldwidevoyage.hokulea.com/wp-content/uploads/2014/04/compass_with_stars.gif): label KOʻOLAU (NE Horizon)

### Malanai

- Design: *Malanai*, glossed "SE quadrant". Verdict: **confirmed**.
- Note: The quadrant name is right. But Malanai as a wind is not a "south-east wind" in the dictionaries: Andrews calls it a name of the NE trade wind. PVS assigned the name to the SE quadrant.
- Sources:
  - [PVS / Hōkūleʻa, "The Star Compass" (text and diagram © Nainoa Thompson)](https://worldwidevoyage.hokulea.com/education-at-sea/polynesian-navigation/the-star-compass/): Malanai is the Southeast quadrant
  - [PVS archive, "Hawaiian Star Compass" (Nainoa Thompson; names after Kyselka, An Ocean in Mind 96-97)](https://archive.hokulea.com/navigate/stars.html): citing Pukui-Elbert: "a gentle breeze" associated with Kailua, Oʻahu
  - [U.S. National Library of Medicine, "A Voyage to Health" exhibit: Hawaiian Star Compass (credit: C. Nainoa Thompson)](https://www.nlm.nih.gov/exhibition/avoyagetohealth/education/online-star-horizons.html): gentle breeze associated with Kailua, Kōloa and Hāna
  - andrews-parker1922.txt:63612: Malanai: the gentle blowing of the northeast wind; one of the names of the trade wind

### Kona

- Design: *Kona*, glossed "SW quadrant". Verdict: **confirmed**.
- Sources:
  - [PVS / Hōkūleʻa, "The Star Compass" (text and diagram © Nainoa Thompson)](https://worldwidevoyage.hokulea.com/education-at-sea/polynesian-navigation/the-star-compass/): Kona "is the Southwest quadrant"
  - kaikki-haw.jsonl:344: kona: leeward side of an island
  - andrews-parker1922.txt:47692: Kona: 1. South. 2. The southwest wind ... 4. south or southwest sides of the islands

### Hoʻolua

- Design: *Hoʻolua*, glossed "NW quadrant". Verdict: **confirmed**.
- Non-ASCII code points: U+02BB
- Note: Kaikki has no entry. The wind blows from the north. PVS assigns it to the NW quadrant.
- Sources:
  - [PVS / Hōkūleʻa, "The Star Compass" (text and diagram © Nainoa Thompson)](https://worldwidevoyage.hokulea.com/education-at-sea/polynesian-navigation/the-star-compass/): Hoʻolua the Northwest
  - [PVS archive, "Hawaiian Star Compass" (Nainoa Thompson; names after Kyselka, An Ocean in Mind 96-97)](https://archive.hokulea.com/navigate/stars.html): named for a strong north wind; notes Pukui-Elbert gives Kiu for the NW wind
  - andrews-parker1922.txt:25741: Hoolua: the strong north wind
  - [PVS star compass diagram, compass_with_stars.gif (© Nainoa Thompson)](https://worldwidevoyage.hokulea.com/wp-content/uploads/2014/04/compass_with_stars.gif): label HOʻOLUA (NW Horizon)

### a star rising in a house in the east sets in the house of the same name in the west

- Design: *a star rising in a house in the east sets in the house of the same name in the west*, glossed "rising/setting rule". Verdict: **confirmed**.
- Note: The rule holds. The quadrant mirrors north-south (NE→NW, SE→SW) and a star never crosses from the north half to the south half. Do not confuse it with swells and wind: those cross the compass to the same house name in the diagonally opposite quadrant (Manu Koʻolau → Manu Kona), 180° away.
- Sources:
  - [PVS / Hōkūleʻa, "The Star Compass" (text and diagram © Nainoa Thompson)](https://worldwidevoyage.hokulea.com/education-at-sea/polynesian-navigation/the-star-compass/): rises in ʻĀina in Koʻolau → sets in ʻĀina in Hoʻolua; Nālani Malanai → Nālani Kona
  - [PVS archive, "Hawaiian Star Compass" (Nainoa Thompson; names after Kyselka, An Ocean in Mind 96-97)](https://archive.hokulea.com/navigate/stars.html): "sets in a house of the same name on the NW horizon"
  - [PVS archive, "Hawaiian Star Lines" (declination / house tables)](https://archive.hokulea.com/ike/hookele/hawaiian_star_lines.html): e.g. Na Hiku rises at Na Leo Koʻolau (NNE) and sets at Na Leo Hoʻolua (NNW)

## 2. Map terms

| design term | verdict | use exactly | meaning |
|---|---|---|---|
| ahupuaʻa | **confirmed** | ahupuaʻa | Traditional land division, usually running from the uplands to the sea. |
| moku | **confirmed** | moku | District; a major division of an island, made up of ahupuaʻa (also "island", "ship" in other senses). |
| ala loa | **confirmed** | ala loa | The long trail or main road around an island, the old round-island route. |
| ahu | **confirmed** | ahu | Heap or pile of stones; cairn; altar or shrine. |
| ahupuaʻa named for the ahu with a pig image or offering | **confirmed** | ahupuaʻa = ahu + puaʻa | This is the traditional explanation. Sources give two versions: a pig image on the boundary ahu, or a pig (or other tribute) offered there as tax. |
| loko iʻa | **confirmed** | loko iʻa | Fishpond. |
| kuapā | **confirmed** | kuapā | The (sea)wall of a fishpond; a loko kuapā is a walled shoreline pond. |
| mākāhā | **confirmed** | mākāhā | Sluice gate of a fishpond (a fixed grate that lets small fish in and keeps big fish from leaving). |
| ʻauwai | **confirmed** | ʻauwai | Ditch or watercourse, especially for irrigating loʻi; also a fishpond channel. |
| loʻi kalo | **confirmed** | loʻi kalo | Irrigated taro pondfield or terrace. |
| kauhale | **confirmed** | kauhale | Homestead: the cluster of houses of one household, each with its own job; also a village. |
| hale | **confirmed** | hale | House, building. |
| hālau waʻa | **confirmed** | hālau waʻa | Canoe house: a long open-ended shed for canoes. |
| wao akua | **confirmed** | wao akua | Inland forest zone believed to be inhabited by gods and spirits, rarely entered. |
| kula | **meaning correction** | kula | Plain, open country, field or pasture: the open, often dry land back from the shore, below the forest. |
| mauka | **confirmed** | mauka | Inland, toward the mountains (ma- + uka). |
| makai | **confirmed** | makai | Seaward, toward the sea (ma- + kai). |
| Koʻolau | **confirmed** | Koʻolau | Windward; the name of the windward moku on several islands. |
| Kona | **confirmed** | Kona | Leeward; the name of the leeward moku on several islands (Hawaiʻi, Kauaʻi, Oʻahu, Molokaʻi). |
| pāhoehoe | **confirmed** | pāhoehoe | Smooth, billowy or ropy lava. |
| ʻaʻā | **confirmed** | ʻaʻā | Rough, broken, clinkery lava. |

### ahupuaʻa

- Design: *ahupuaʻa*, glossed "land division". Verdict: **confirmed**.
- Non-ASCII code points: U+02BB
- Sources:
  - kaikki-haw.jsonl:824: a wedge-shaped land subdivision ... from the mountains to the sea; ahu + puaʻa
  - andrews-parker1922.txt:3212: Ahupuaa: one of the smaller divisions of a district ... a hog was the tax of that district
  - [NPS, Hawaiʻi Volcanoes NP, "The Ahupuaʻa"](https://home.nps.gov/havo/learn/historyculture/ahupuaa.htm): ahu (a pile of stones) + puaʻa (pig)
  - [Kamehameha Schools, Kumukahi, "Loko Iʻa" lesson](https://kumukahi.org/units/ka-honua/onaepuni/loko-ia): a land division stretching from the mountains out into the sea

### moku

- Design: *moku*, glossed "district". Verdict: **confirmed**.
- Sources:
  - kaikki-haw.jsonl:170: moku: an island, district, forest, section
  - andrews-parker1922.txt:67875: Moku: a district; a division of an island, as Kona on Hawaii
  - [UH Mānoa, Kahoʻiwai place-name portal, "Koʻolau (Kauaʻi)" (cites Wichman)](https://www.hawaii.edu/kawaihapai/?p=748): "Hiʻona ʻāina: Moku" used for districts

### ala loa

- Design: *ala loa*, glossed "trail around the island". Verdict: **confirmed**.
- Note: The dictionaries write it as one word (alaloa, "highway"). NPS and trail literature write "ala loa" for the round-island trail. Either is defensible; "ala loa" matches the NPS sources for this meaning.
- Sources:
  - [NPS, Ala Kahakai NHT brochure (2018), mirrored at npshistory.com](https://www.npshistory.com/publications/alka/brochures/2018.pdf): "Ala loa is an ancient name for the long trail, highway, and/or main road around the island"
  - [NPS, Ala Kahakai NHT, History & Culture](https://www.nps.gov/alka/learn/historyculture/index.htm): major prehistoric trails, or ala loa
  - [Ala Kahakai Trail Association, "The Hawaiʻi Island Trails"](https://alakahakaitrail.org/the-trail): Ala Loa, "lit. The long trail"
  - kaikki-haw.jsonl:3554: alaloa: highway, beltway; ala + loa "long road"
  - andrews-parker1922.txt:5681: Alaloa: a highway; a main road
  - andrews-parker1922.txt:97857: place-name list: Alaloa, long road, ancient roadway, Kona, Hawaii

### ahu

- Design: *ahu*, glossed "cairn/altar marking ahupuaʻa boundaries". Verdict: **confirmed**.
- Sources:
  - kaikki-haw.jsonl:1412: ahu: heap, pile, mound; cairn, altar, shrine
  - andrews-parker1922.txt:3018: Ahu: a heap of stones as a way mark or memorial
  - [NPS, Hawaiʻi Volcanoes NP, "The Ahupuaʻa"](https://home.nps.gov/havo/learn/historyculture/ahupuaa.htm): boundaries "often marked with a mound of rocks topped by an image of a pig"

### ahupuaʻa = ahu + puaʻa

- Design: *ahupuaʻa named for the ahu with a pig image or offering*, glossed "etymology claim". Verdict: **confirmed**.
- Non-ASCII code points: U+02BB U+02BB
- Note: Fine to use, framed as the traditional account. Say "pig image or pig offering" rather than one definite story. NPS adds that some boundaries were natural features (ridges, outcrops) with no ahu.
- Sources:
  - [NPS, Hawaiʻi Volcanoes NP, "The Ahupuaʻa"](https://home.nps.gov/havo/learn/historyculture/ahupuaa.htm): mound of rocks topped by an image of a pig, "perhaps in the form of a wood carving"
  - [Kapiʻolani CC Library (UH), Ahupuaʻa research guide](https://guides.library.kapiolani.hawaii.edu/apdl/ahupuaa): ahu (altar of stones) with an image of the head of a puaʻa
  - andrews-parker1922.txt:3212: Ahu + puaa; "a hog was the tax of that district to the king"

### loko iʻa

- Design: *loko iʻa*, glossed "fishpond". Verdict: **confirmed**.
- Non-ASCII code points: U+02BB
- Sources:
  - kaikki-haw.jsonl:263: loko: pond, lake; derived "loko iʻa" = fishpond
  - kaikki-haw.jsonl:760: iʻa: fish
  - [Kamehameha Schools, Kumukahi, "Loko Iʻa" lesson](https://kumukahi.org/units/ka-honua/onaepuni/loko-ia): loko iʻa = fishpond
  - andrews-parker1922.txt:58463: Loko: a pond; a lake

### kuapā

- Design: *kuapā*, glossed "fishpond wall". Verdict: **confirmed**.
- Non-ASCII code points: U+0101
- Note: The design is right. The Wiktionary extract leaves the kahakō off. Do not copy "kuapa" from it.
- Sources:
  - [NPS, Kaloko-Honokōhau NHP, "Kaloko Fishpond"](https://www.nps.gov/places/kaloko-fishpond.htm): loko kuapā type fishpond ... a kuapā (or seawall)
  - [Kamehameha Schools, Kumukahi, "Loko Iʻa" lesson](https://kumukahi.org/units/ka-honua/onaepuni/loko-ia): loko kuapā
  - andrews-parker1922.txt:49122: Kuapa (ku'-a-pa'): wall of a fish-pond; final stress mark consistent with long ā
  - kaikki-haw.jsonl:2348: entry spelled "kuapa" (no kahakō): The rock wall of a fishpond

### mākāhā

- Design: *mākāhā*, glossed "sluice gate". Verdict: **confirmed**.
- Non-ASCII code points: U+0101 U+0101 U+0101
- Note: Not in the Wiktionary extract. All three vowels are long. Do not confuse it with the place name Mākaha (Waiʻanae, Oʻahu), which has only the first kahakō.
- Sources:
  - [NPS, Kaloko-Honokōhau NHP, "Kaloko Fishpond"](https://www.nps.gov/places/kaloko-fishpond.htm): placed a mākāhā (or sluice gate) in the channel
  - [Kamehameha Schools, Kumukahi, "Loko Iʻa" lesson](https://kumukahi.org/units/ka-honua/onaepuni/loko-ia): mākāhā: sluice gate
  - andrews-parker1922.txt:62084: Makaha (ma'-ka'-ha'): gate at the outlet of a fish-pond

### ʻauwai

- Design: *ʻauwai*, glossed "irrigation ditch". Verdict: **confirmed**.
- Non-ASCII code points: U+02BB
- Sources:
  - kaikki-haw.jsonl:3476: ʻauwai: ditch
  - andrews-parker1922.txt:9617: Auwai: the general name for streams used in artificial irrigation
  - [Kamehameha Schools, Kumukahi, "Loko Iʻa" lesson](https://kumukahi.org/units/ka-honua/onaepuni/loko-ia): ‘auwai (ditch)
  - [NPS, Kaloko-Honokōhau NHP, "Kaloko Fishpond"](https://www.nps.gov/places/kaloko-fishpond.htm): ‘auwai (channel)

### loʻi kalo

- Design: *loʻi kalo*, glossed "taro terrace/patch". Verdict: **confirmed**.
- Non-ASCII code points: U+02BB
- Sources:
  - kaikki-haw.jsonl:3238: loʻi: irrigated pond for agriculture; taro pond
  - kaikki-haw.jsonl:459: kalo: taro
  - andrews-parker1922.txt:58319: Loi: a water taro patch
  - [Kamehameha Schools, Kumukahi, "Loko Iʻa" lesson](https://kumukahi.org/units/ka-honua/onaepuni/loko-ia): uses "lo‘i kalo"

### kauhale

- Design: *kauhale*, glossed "group of houses". Verdict: **confirmed**.
- Note: Not a headword in the Wiktionary extract. It has no ʻokina or kahakō.
- Sources:
  - andrews-parker1922.txt:41151: Kauhale: a small cluster of houses; a village
  - [Bishop Museum, Hawaiʻi Alive, "Hale Pili"](https://www.hawaiialive.org/resource/hale-pili): the kauhale, or homestead
  - kaikki-haw.jsonl:2132: kūlanakauhale (town) built from kau + hale, confirms the unmarked spelling

### hale

- Design: *hale*, glossed "house". Verdict: **confirmed**.
- Sources:
  - kaikki-haw.jsonl:218: hale: house, building
  - andrews-parker1922.txt:13501: Hale: a house; a habitation

### hālau waʻa

- Design: *hālau waʻa*, glossed "canoe house". Verdict: **confirmed**.
- Non-ASCII code points: U+0101 U+02BB
- Note: Bishop Museum uses the near-synonym hale waʻa for a household canoe shed.
- Sources:
  - [Kamehameha Schools Holomoana, "Hālau Waʻa"](https://blogs.ksbe.edu/holomoana/?p=7858): Hālau Waʻa; the traditional hālau wa'a was a longhouse "dedicated to all matters related to canoes"
  - [NPS, Puʻuhonua o Hōnaunau NHP, walking tour stop 16 "Hālau"](https://www.nps.gov/places/walking-tour-stop-16-halau.htm): hālau: long house used for meetings, storing canoes, or learning
  - kaikki-haw.jsonl:2935: hālau: longhouse
  - kaikki-haw.jsonl:2532: waʻa: canoe
  - andrews-parker1922.txt:13470: Halau: a long house with openings on both ends used mostly for canoes

### wao akua

- Design: *wao akua*, glossed "upland realm left to the gods". Verdict: **confirmed**.
- Note: The gloss is fine. On the map it is a forest belt above wao kanaka (the forest people use) and below wao maʻukele and the summit zones. It is not the bare summit. Not in the Wiktionary extract.
- Sources:
  - [NPS, Hawaiʻi Volcanoes NP, Kīpukapuaulu Trail Guide (PDF)](https://www.nps.gov/havo/planyourvisit/upload/Kipukapuaulu_Trail_Guide.pdf): "Wao Akua, the realm of the gods"; one of seven zones: Kuahiwi, Kualono, Wao maʻukele, Wao Akua, Wao kanaka, Kula, Kahakai
  - [Office of Hawaiian Affairs, Wao Kele o Puna information sheet (PDF)](https://www.oha.org/wp-content/uploads/Waokeleopuna-Information-Sheet.pdf): a forest zone inhabited by the gods, "not often entered"
  - [Hawaiʻi Association of Watershed Partnerships, cultural significance of forests](https://hawp.org/?p=673): the upland forest was wao akua
  - andrews-parker1922.txt:96741: Waoakua: region on the side of a mountain below the waomaukele ... a region of the gods
  - kaikki-haw.jsonl:474: akua: god

### kula

- Design: *kula*, glossed "dry upland plain". Verdict: **meaning correction**.
- Note: Minor. "Plain" and "dry" are right, but in the mountain-to-sea order kula sits between the shore and wao kanaka, not above the forest. Gloss it "open plain / dry open country" and draw it low on the slope. "Upland" works only in some local cases, such as Kula, Maui.
- Sources:
  - kaikki-haw.jsonl:181: kula: field, pasture; plain, open country
  - andrews-parker1922.txt:51096: Kula: the open country back from the sea ... where people may live
  - [NPS, Hawaiʻi Volcanoes NP, Kīpukapuaulu Trail Guide (PDF)](https://www.nps.gov/havo/planyourvisit/upload/Kipukapuaulu_Trail_Guide.pdf): zone order ... Wao kanaka, Kula, Kahakai, so kula lies below the forest
  - andrews-parker1922.txt:102889: place-name list glosses the land section Kula (Puna) as "dry upland"

### mauka

- Design: *mauka*, glossed "toward the mountain". Verdict: **confirmed**.
- Sources:
  - kaikki-haw.jsonl:906: mauka: inland; upland; towards the mountains
  - andrews-parker1922.txt:65656: Mauka: inland ... opposite to makai

### makai

- Design: *makai*, glossed "toward the sea". Verdict: **confirmed**.
- Sources:
  - kaikki-haw.jsonl:907: makai: seaward
  - andrews-parker1922.txt:62224: Makai: at or toward the sea, in distinction from mauka

### Koʻolau

- Design: *Koʻolau*, glossed "windward district name, several islands". Verdict: **confirmed**.
- Non-ASCII code points: U+02BB
- Note: Oʻahu splits it into Koʻolauloa and Koʻolaupoko. Koʻolau is also the name of Oʻahu's mountain range.
- Sources:
  - [UH Mānoa, Kahoʻiwai place-name portal, "Koʻolau (Kauaʻi)" (cites Wichman)](https://www.hawaii.edu/kawaihapai/?p=748): koʻolau "windward" names the side facing the trades; separate Koʻolau districts on Molokaʻi, Maui, Oʻahu (and Kauaʻi)
  - andrews-parker1922.txt:102614: place-name list: Koolau, windward side, "applied to windward districts in the Hawaiian islands"
  - andrews-parker1922.txt:48030: Koolau: general name of lands or districts on the north side of the islands

### Kona

- Design: *Kona*, glossed "leeward district name, several islands". Verdict: **confirmed**.
- Sources:
  - andrews-parker1922.txt:102592: place-name list: Kona, leeward, "applied to the leeward districts in the Hawaiian islands"
  - kaikki-haw.jsonl:344: kona: leeward side of an island
  - [UH Mānoa, Kahoʻiwai place-name portal, "Kauaʻi" (lists its moku)](https://www.hawaii.edu/kawaihapai/ka-pae-%ca%bbaina-o-hawai%ca%bbi-na-kai-%ca%bbewalu/kaua%ca%bbi/): lists Kona (Kauaʻi) and Koʻolau (Kauaʻi) among Kauaʻi's moku
  - andrews-parker1922.txt:47692: Kona: 4. the south or southwest sides of the Hawaiian islands

### pāhoehoe

- Design: *pāhoehoe*, glossed "smooth lava". Verdict: **confirmed**.
- Non-ASCII code points: U+0101
- Sources:
  - kaikki-haw.jsonl:256: pāhoehoe: a kind of lava
  - [USGS Hawaiian Volcano Observatory, Volcano Watch, "Appreciating contributions of ʻŌlelo Hawaiʻi to volcanology" (2024)](https://www.usgs.gov/observatories/hvo/news/volcano-watch-appreciating-contributions-olelo-hawaii-volcanology): smooth, sometimes ropy texture
  - [NPS, "Lava Flow Forms"](https://www.nps.gov/articles/000/lava-flow-forms.htm): smooth, billowy, or ropy surfaces
  - andrews-parker1922.txt:79460: Pahoehoe: smooth shining lava

### ʻaʻā

- Design: *ʻaʻā*, glossed "rough lava". Verdict: **confirmed**.
- Non-ASCII code points: U+02BB U+02BB U+0101
- Note: Two ʻokina. NPS pages often type ‘ (U+2018); use U+02BB.
- Sources:
  - kaikki-haw.jsonl:149: ʻaʻā: aa, a type of lava
  - [USGS Hawaiian Volcano Observatory, Volcano Watch, "Appreciating contributions of ʻŌlelo Hawaiʻi to volcanology" (2024)](https://www.usgs.gov/observatories/hvo/news/volcano-watch-appreciating-contributions-olelo-hawaii-volcanology): "rough and broken"; spelled ʻaʻā (U+02BB ×2, ā)
  - andrews-parker1922.txt:1502: Aa: stony; ground rough with broken lava

## 3. Semantic field labels

| design term | verdict | use exactly | meaning |
|---|---|---|---|
| lani | **confirmed** | lani | Sky, heavens (also "chief, royal"). |
| kai | **confirmed** | kai | Sea, seawater, coast (the open deep ocean is moana). |
| ʻāina | **confirmed** | ʻāina | Land, earth. |
| ulu | **confirmed** | ulu | Growth; to grow, increase. |
| kanaka | **confirmed** | kanaka | Person, human being; humankind. The plural "people" is kānaka. |
| hana | **confirmed** | hana | Work, labour, deed; to do, make, create. |
| naʻau | **confirmed** | naʻau | Intestines, gut; mind, heart, the seat of thought and feeling. |
| hele | **confirmed** | hele | To go, come, walk, move; a going or journey. |

### lani

- Design: *lani*, glossed "sky". Verdict: **confirmed**.
- Sources:
  - kaikki-haw.jsonl:480: lani: sky, heavens, firmament
  - andrews-parker1922.txt:54808: Lani: the upper air; the sky

### kai

- Design: *kai*, glossed "sea". Verdict: **confirmed**.
- Sources:
  - kaikki-haw.jsonl:163: kai: sea; seawater; seaside
  - andrews-parker1922.txt:36594: Kai: the sea

### ʻāina

- Design: *ʻāina*, glossed "land". Verdict: **confirmed**.
- Non-ASCII code points: U+02BB U+0101
- Sources:
  - kaikki-haw.jsonl:1689: ʻāina: land
  - andrews-parker1922.txt:3973: Aina: land

### ulu

- Design: *ulu*, glossed "growth". Verdict: **confirmed**.
- Note: Keep it ulu, with no ʻokina. ʻulu means breadfruit. Andrews (1922) writes both as "ulu", so do not take the spelling from it.
- Sources:
  - kaikki-haw.jsonl:241: ulu (noun): growth, grove
  - kaikki-haw.jsonl:242: ulu (verb): to grow
  - andrews-parker1922.txt:93821: Ulu: to grow, as a plant
  - kaikki-haw.jsonl:1466: contrast ʻulu (with ʻokina) = breadfruit

### kanaka

- Design: *kanaka*, glossed "people". Verdict: **confirmed**.
- Note: Fine as a field label for "humans". If the label is meant to read as plural "people", write kānaka.
- Sources:
  - kaikki-haw.jsonl:238: kanaka: man, human, human being
  - kaikki-haw.jsonl:1547: kānaka: plural of kanaka
  - andrews-parker1922.txt:39437: Kanaka: a man ... general name of men, women and children
  - andrews-parker1922.txt:39445: plural form (stress ka'-na-ka): people in general

### hana

- Design: *hana*, glossed "craft/work". Verdict: **confirmed**.
- Note: Hana is the general word for work and making. "Craft" is a fair loose gloss. A narrower "skilled craft" compound was not verified here.
- Sources:
  - kaikki-haw.jsonl:516: hana (noun): work, labor ... activity
  - kaikki-haw.jsonl:517: hana (verb): to work, do, make, manufacture, create
  - andrews-parker1922.txt:14465: Hana: work; labor

### naʻau

- Design: *naʻau*, glossed "mind/gut, seat of thought and feeling". Verdict: **confirmed**.
- Non-ASCII code points: U+02BB
- Sources:
  - kaikki-haw.jsonl:1589: naʻau: guts, intestines; mind, heart
  - andrews-parker1922.txt:69397: Naau: the small intestines ... supposed to be the seat of thought, of intellect and the affections

### hele

- Design: *hele*, glossed "motion". Verdict: **confirmed**.
- Sources:
  - kaikki-haw.jsonl:530: hele: to walk, move
  - andrews-parker1922.txt:16838: Hele: to walk, to go, to move
  - andrews-parker1922.txt:16835: Hele (n.): a going; a journey

## 4. Title words

| design term | verdict | use exactly | meaning |
|---|---|---|---|
| pōhaku | **confirmed** | pōhaku | Stone, rock. |
| huaʻōlelo | **confirmed** | huaʻōlelo | Word (hua "seed, fruit" + ʻōlelo "language"). |
| kiʻi pōhaku | **confirmed** | kiʻi pōhaku | Petroglyph; image carved in stone (also a stone image). |
| ʻalaea | **confirmed** | ʻalaea | Red earth / ochre clay (iron oxide), used to colour salt, as dye, in medicine and ritual. |
| kukui | **confirmed** | kukui | Candlenut tree and nut (Aleurites moluccanus); also torch or lamp. Soot from burnt nuts made a black pigment. |

### pōhaku

- Design: *pōhaku*, glossed "stone". Verdict: **confirmed**.
- Non-ASCII code points: U+014D
- Sources:
  - kaikki-haw.jsonl:1735: pōhaku: stone, rock, mineral
  - andrews-parker1922.txt:86430: Pohaku: the general name of stones, rocks

### huaʻōlelo

- Design: *huaʻōlelo*, glossed "word". Verdict: **confirmed**.
- Non-ASCII code points: U+02BB U+014D
- Sources:
  - kaikki-haw.jsonl:2127: huaʻōlelo: word
  - andrews-parker1922.txt:31136: Huaolelo: a single word
  - [USGS Hawaiian Volcano Observatory, Volcano Watch, "Appreciating contributions of ʻŌlelo Hawaiʻi to volcanology" (2024)](https://www.usgs.gov/observatories/hvo/news/volcano-watch-appreciating-contributions-olelo-hawaii-volcanology): used in the Hawaiian-language text as "huaʻōlelo"

### kiʻi pōhaku

- Design: *kiʻi pōhaku*, glossed "petroglyph". Verdict: **confirmed**.
- Non-ASCII code points: U+02BB U+014D
- Sources:
  - kaikki-haw.jsonl:4134: kiʻi pōhaku: a petroglyph; a stone statue
  - [NPS, Hawaiʻi Volcanoes NP, "Puʻuloa Petroglyphs" day hike](https://www.nps.gov/havo/planyourvisit/hike_day_puuloa.htm): kiʻi pōhaku (images carved in stone)
  - andrews-parker1922.txt:43902: Kii: an image ... kii pohaku, an image of stone

### ʻalaea

- Design: *ʻalaea*, glossed "red ochre earth". Verdict: **confirmed**.
- Non-ASCII code points: U+02BB
- Note: Not in the Wiktionary extract. Initial ʻokina, no kahakō. UH SeaLearning types the ʻokina as ‘ (U+2018); use U+02BB.
- Sources:
  - [UH SOEST SeaLearning, "Traditional Ways of Knowing: Salt Harvesting"](https://sealearning.soest.hawaii.edu/sealearning/grade-5/physical-science/matter-sea/traditional-ways-knowing-salt-harvesting): red ‘alaea clay ... the red color comes from iron oxide
  - andrews-parker1922.txt:5477: Alaea: red dirt ... any red coloring matter; a dye for tapa; red ochre
  - [Hawaiʻi State Legislature, HCR 181 (2010), Hanapēpē salt ponds](https://data.capitol.hawaii.gov/sessions/session2010/Bills/HCR181_.pdf): alaea, "a form of red dirt"

### kukui

- Design: *kukui*, glossed "candlenut; soot used for ink/dye". Verdict: **confirmed**.
- Note: "Ink" means tattoo pigment and paint for kapa and canoes, not writing ink. There was no writing before contact.
- Sources:
  - kaikki-haw.jsonl:1320: kukui: candlenut tree and fruit; torch, light
  - andrews-parker1922.txt:50868: Kukui: candlenut tree; nut burned for lights; root bark with charcoal for coloring canoes black
  - [Canoe Plants of Ancient Hawaiʻi, "Kukui"](https://canoeplants.com/kukui.html): soot (pau) of burned nuts gave a black dye for tattooing and for painting canoes and tapa
  - [BYU-Hawaiʻi Herbarium digital exhibit, "Kukui"](https://digitalcollections.byuh.edu/exhibit/herbarium/kukui/): kukui used for dye in kākau (tattooing), kapa and waʻa

## Alternative versions

- **Nālani spelling.** PVS diagram, archive, 1992 release, hokulea.com and the 2021 UH dissertation all write it as one word (Nālani / Nalani). Karjala (2019 UH thesis) writes "nā lani". (https://worldwidevoyage.hokulea.com/wp-content/uploads/2014/04/compass_with_stars.gif, https://archive.hokulea.com/navigate/stars.html, https://www.ulukau.org/pagespvs/cgi-bin/pagespvs?a=d&d=PVSA-008_0096.1.19, https://hdl.handle.net/10125/81614, https://hdl.handle.net/10125/66205)
- **Nā Leo spelling.** Two words in the PVS diagram, the archive, the 1992 release and the UH dissertation. "Nāleo" (one word) in current hokulea.com prose. "NaLeo" once in the archive star-line tables. (https://worldwidevoyage.hokulea.com/wp-content/uploads/2014/04/compass_with_stars.gif, https://archive.hokulea.com/navigate/stars.html, https://worldwidevoyage.hokulea.com/education-at-sea/polynesian-navigation/the-star-compass/, https://archive.hokulea.com/ike/hookele/hawaiian_star_lines.html)
- **Origin of the house names.** Devised by Nainoa Thompson (PVS archive, citing Kyselka, An Ocean in Mind, pp. 96-97). The cardinal and quadrant names are older Hawaiian words; the quadrant assignment is a PVS convention. (https://archive.hokulea.com/navigate/stars.html)
- **Mau Piailug's Satawalese star compass.** The Micronesian compass Thompson's system is based on. Its 32 points are named for the stars that rise and set there (rising = Tan, setting = Tupul). It is a different system, not a variant spelling. (https://archive.hokulea.com/navigate/mauscompass.gif)
- **Wind meanings behind the quadrant names.** Andrews calls Malanai a name of the gentle NE trade wind and Hoʻolua the strong north wind. Pukui-Elbert (cited by PVS) gives Kiu as the NW wind. The quadrant names are PVS labels, not literal wind bearings. (https://archive.hokulea.com/navigate/stars.html)
- **Typos in PVS archive tables.** Sharatan and Hamal are listed as "'Aina-Koʻolau and La-Hoʻolua", which contradicts the same-house rule. These are transcription slips; the rule is stated plainly on the same site. (https://archive.hokulea.com/ike/hookele/hawaiian_star_lines.html)

## Method and limits

- Local: Wiktionary/Kaikki extract `roots/.cache/kaikki-haw.jsonl` (line = JSONL line number). Andrews-Parker 1922 OCR `roots/.cache/andrews-parker1922.txt` (line = text line). Andrews has no ʻokina or kahakō, so it supports words and meanings, not modern spelling. Its stress marks (e.g. *ku'-a-pa'*, *ma'-ka'-ha'*) are consistent with the long vowels.
- Web: PVS (hokulea.com, archive.hokulea.com, the PVS archive on Ulukau), UH ScholarSpace, NPS, USGS, NLM, Bishop Museum, Kamehameha Schools, OHA, State of Hawaiʻi, UH Mānoa. Fetched politely with the requested User-Agent.
- Deliberately not accessed: wehewehe.org and its mirrors (including the wehe.*.hawaii.edu hosts that came up in search results), puke.ulukau.org, trussel2.com, the en.wiktionary API. Pukui & Elbert was therefore not read directly. Where it is mentioned, it is as quoted by PVS or by Wiktionary, which draws on it.
- Quotations from copyrighted sources are kept to short phrases. NPS, USGS and NLM text is U.S. government work. Andrews 1922 is public domain.
