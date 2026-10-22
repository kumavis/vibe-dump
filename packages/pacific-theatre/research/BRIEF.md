# Pacific War diorama: the designer's brief for the research pass

Written 2026-10-22 by the designer and project manager of this vibe, before any
code. This is the working thesis the research must test, sharpen or overturn.
Treat every fact in it as *verify* until a source carries it.

## 0. Where this comes from

`vibe-dump` is an npm-workspaces monorepo of small static web apps (see the
repo's `CLAUDE.md`). The nearest relative of this project is **Holo i ke Au**,
the Hawaiian history diorama on branch `origin/claude/funny-cannon-vy1pyf`
(`packages/holo-i-ke-au/`). Its documents are copied beside this brief in
`hawaiian-docs/`:

- `DESIGN.md`: the thesis (two continuous axes, zoom and time), the scope
  decision, the data-first phasing, the tone rule for battles (§8), the
  sensitive-site rule (§7.4), the open decisions and the name.
- `DATA.md`: the data contract: a shared local projection, raster "packs" as
  8-bit RGB PNGs carrying 16-bit heights, GeoJSON boundaries, and the gazetteer
  schema (`eras.json`, `places.json`, `events.json`, `sources.json`, routes).
- `RESEARCH.md`: the standard for research in this repo: what was read, what
  could not be reached and why, where tellings diverge, what still needs a
  person. Numbers live only in tellings, as ranges, with sources. Every card
  cites. No source, no pin.
- `ACCESS.md`: the walls: hosts that refused the build container, scans behind
  lending, print only.
- `FILES.txt`: every file in that package, for the reuse audit.

The owner's direction for this project, in their words: *"similar to the
hawaiian history diorama branch, make a world war 2 pacific theatre diorama.
Map and timeline, viewable battles that you can jump into and control planes
and battleships."*

## 1. What it is (working thesis)

**One table of the Pacific theatre of the Second World War**, from the attack
on Pearl Harbor (7/8 December 1941) to the surrender (2 September 1945), with a
prologue of cards from 1931 (Manchuria) or 1937 (Marco Polo Bridge) to November
1941. A diorama you move through in space and in time:

- **The table (far).** The whole theatre as a relief map on a table: bathymetry
  and coastlines, labels, the front (who holds what) by keyframe, the routes
  (fleet tracks, convoy lanes, the island-hopping path, the bomber routes) and
  pins for events, each with a sourced card. A timeline of phases drives it,
  and a Next button walks it chapter by chapter as the Hawaiian app does.
- **The battle box (near).** One battle at a time, a few hundred kilometres
  across, with its islands from real terrain, the sea, the sky of that hour,
  and the ships and aircraft as toy models placed and moved as the record tells
  it. Jumping in from a pin flies the camera down into the box.
- **The sortie (playable).** *You are one of many.* Inside a battle, at a
  **moment** (a tour stop with a clock), you take the controls of one aircraft
  or one ship for two to five minutes. What you do is scored in sortie terms
  (hits, torpedoes on target, aircraft downed, whether you came back). The
  record carries the arc of the battle: ships sink when and where they did,
  the strike arrives when it did. At the end a card says what happened in the
  record and sets your sortie beside it. (A "what if" mode in which your
  actions change the outcome is an open decision, not v1.)

### What it is not

- Not a wargame or a campaign. No fleet command, no supply, no strategy layer.
- Not a full flight or naval simulator. Arcade control, short sorties.
- Not a site of glory. Both navies are drawn with the same care; the dead are
  counted on cards, in ranges, with sources; nothing is drawn as spectacle.
- Not a replacement for the Hawaiian app. It copies what it wants (no
  cross-package imports in this repo) and diverges.

## 2. Tone (inherits the Hawaiian rule; to be tested by R8)

- No gore, no bodies. A ship sinks as a silhouette going down; an aircraft
  falls as a trail; no figures in the water.
- Casualty numbers live only in tellings, as ranges, sourced. The game's score
  speaks in sortie terms (hits, aircraft downed), never in people.
- Both sides named in their own language: Japanese ships and operations with
  macrons and kanji (Sōryū 蒼龍, Kidō Butai 機動部隊), American and Allied
  ships with hull numbers.
- The atomic bombings, the firebombing of Japanese cities, Bataan, Manila,
  Okinawa's civilians, the comfort stations, internment, the POW camps and
  hell ships are **cards, never playable**, never rendered as spectacle (no
  mushroom cloud on the table).
- Kamikaze (tokkō) attacks are never a playable role; they appear in the
  record as what the sources say.
- Playable sides: both navies, in fleet-against-fleet and air-against-fleet
  engagements between combatants. Pearl Harbor: the defence only (the P-40s
  from Haleʻiwa, the ships' AA), an open decision.
- The rule is practised, not announced: no card says what the app does not
  draw.

## 3. Candidate playable battles

v1 = the first three, one of each kind (dive-bomber, battleship, destroyer):

1. **Midway, 4 June 1942, about 10:20–10:30.** The dive on Kaga, Akagi and
   Sōryū. SBD Dauntless. Later moments: Hiryū's strike on Yorktown (D3A); the
   CAP (A6M / F4F).
2. **Second Naval Battle of Guadalcanal, night of 14–15 November 1942.**
   Washington against Kirishima: battleship gunnery by radar at night. Both
   bridges.
3. **Samar, 25 October 1944.** Johnston's torpedo run; Yamato's main battery
   on Taffy 3's escort carriers. Destroyer and battleship, both sides.

Later: Pearl Harbor (defence), Ten-Gō (Yamato under air attack: her AA and
helm, or a TBM Avenger), Philippine Sea (F6F against the raids), Santa Cruz,
Surigao Strait, Savo Island, Coral Sea.

## 4. Engineering frame (to be tested by R1 and R9)

- Three.js (the Hawaiian app pins `three@^0.160.0`), Vite, no runtime network,
  `dist/` committed, `public/data/` under about 40 MB, offline bake tools (curl
  with a ledger) whose output is committed.
- **The table**: a flat map. The Hawaiian app's local equirectangular projection
  distorts badly over 100° of longitude; candidates are an azimuthal equidistant
  or Lambert azimuthal equal-area projection centred near 10°N 160°E, or a plain
  equirectangular with a diorama's forgiveness. Heights from ETOPO 2022 (60 or
  30 arc-second) or ETOPO1 via ERDDAP; coastlines from Natural Earth 10 m with
  minor islands; labels from Natural Earth and the gazetteer.
- **Battle boxes**: each in its own local tangent plane (the Hawaiian app's
  projection, which is right at this size), islands from Copernicus GLO-30
  (and the Hawaiian app's Oʻahu pack for Pearl Harbor), sea depth from ETOPO,
  baked into the same PNG pack format (Hawaiian `DATA.md` §2).
- **Units**: ships and aircraft as procedural low-poly kits built in code from
  a few numbers each (length, beam, turret layout, island side, pagoda mast
  height), recognisable by silhouette; no external model files.
- **Reuse by copying**: ocean, sky, post pipeline, camera rig, PNG pack
  decoder, timeline, pins and clusters, cards, tour, routes, lines, fonts,
  `tools/lib` (fetch, png, raster), the `check-data.mjs` audit pattern, the
  smoke and shoot tools.
- **Scale inside a battle**: open. True sizes and true distances make a strike
  a long flight and a ship a dot; games compress distance and time. The sortie
  design (enter at a moment, already in position) is meant to avoid most of
  the problem; R7 should say what compression, if any, is still wanted.

## 5. Reachability from this container (tested 2026-10-22)

Outbound HTTPS goes through a proxy; `curl` honours it, Node's `fetch` does
not (use curl via Bash, or WebFetch/WebSearch where available). Wikipedia's
API answered 429 to a bare request; try with a `User-Agent` header. A plain
GET of an article page answered 200.

| host | status | notes |
| --- | --- | --- |
| coastwatch.pfeg.noaa.gov/erddap (ETOPO1 `etopo180`/`etopo360`) | 200 | griddap subsets with stride; `.json`, `.geotif`, `.nc` |
| ngdc.noaa.gov/thredds (ETOPO 2022 OPeNDAP) | 200 | 60s surface `.nc.html` reachable |
| download.gebco.net | 206 | reachable |
| copernicus-dem-30m.s3.amazonaws.com (GLO-30 COGs) | 206 | range requests work |
| naciscdn.org/naturalearth 10m land, minor islands | 206 | |
| elevation-tiles-prod.s3.amazonaws.com (AWS terrain tiles, terrarium/geotiff) | 206 | |
| gibs.earthdata.nasa.gov (Blue Marble WMTS) | 200 | |
| archive.org (advancedsearch, full texts) | 200 | |
| ibiblio.org/hyperwar | 206 | USN/USMC/Army official histories, action reports, ONI narratives |
| history.navy.mil (NHHC) | **000** | blocked or timed out |
| combinedfleet.com | 206 | TROMs |
| awm.gov.au | 206 | Australian official histories |
| jacar.go.jp, dl.ndl.go.jp | 206 | Japanese archives |
| babel.hathitrust.org | **403** | |
| usmcu.edu (Marine Corps History Division) | **403** | |
| navsource.org | **timeout** | |
| pacificwrecks.com | 404 for the guessed URL; host answers | |
| catalog.archives.gov API, loc.gov | 200 | |
| registry.npmjs.org | 206 | npm install works |

## 6. Standards for every research file

- Cite URLs. Say what you actually opened and read versus what you believe
  from memory; mark the latter *verify*.
- Say what could not be reached, with the status, so `ACCESS.md` can list it.
- Numbers with their source, and where sources disagree, each telling.
- No invented facts. "Unknown" and "verify" are good answers.
- Downloads go under `research/downloads/<your-id>/` in this scratchpad
  directory, never into the repository, and stay small: use subsets, strides
  and range requests to prove a source, not to mirror it.
- Write in plain English, short sentences, present tense for summaries.
