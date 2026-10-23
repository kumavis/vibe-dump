# Build public/data/fronts/{keyframe}.geojson (DATA.md §6; research/content.md §3). Written for the content
# workflow, which traced the committed keyframes with it; it reads its downloads from FRONTS_DOWNLOADS
# (paths.py). Run lines.py after it for lines.geojson and manifest.json, and preview.py to look.
#
#   FRONTS_DOWNLOADS=/path/to/downloads python3 -I tools/fronts/build.py
#
# Land only, and only the large land: continents and every island of at least ISLE_KM2 (the smaller
# islands are drawn from places.json's held intervals). Each keyframe assigns a state to every cell of a
# 0.1-degree grid over that land, then gathers cells with the same state and name into polygons, smoothed,
# clipped to the land (grown a little so the coast's texels are covered: the table tints land only) and
# simplified below the table's own front texel (about 14 km).
#
# Where a keyframe has an Atlas of the World Battle Fronts page (1943-11-01 on), the page's colours say
# who held each cell (classify.py); the territory a cell lies in says which of Japan's states that is
# (held, garrisoned, allied with Japan; occupied China's points and lines) and what a cell off the page's
# map holds. The keyframes before the Atlas (1941-12-06, 1942-05-08, 1942-09-15) are schematic: the
# territories' holders by date, occupied China from the Atlas's first page (1 July 1943), and a few hand
# regions for the fronts of 1942 (Papua, Guadalcanal, Mindanao, Timor). Where the trace misreads the page
# and the record says otherwise, the record's state is laid over it (RECORD below). The prologue's six
# keyframes (1931-09-18 to 1941-07-31) are schematic too: the holders by date and hand regions with their own
# sources (PROLOGUE below; research/content-2.md). FRONTS_ONLY=<keyframe>,<keyframe> writes only those.
import sys, json, math
import os
import types
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from paths import OUT, VIEW, downloads
import numpy as np
import shapely
from shapely.geometry import shape, mapping, Polygon, MultiPolygon, LineString, MultiLineString, box
from shapely.ops import unary_union
from classify import classify_leaf
from perimeters import perimeters

DL = downloads()
ISLE_KM2 = 2500
D = 0.1  # grid step, degrees
W0, S0, E0, N0 = 60.0, -47.9, 215.0, 65.7  # inside the table's envelope (the bake's manifest: 49.47, -48.03, 233.53, 65.84)
GROW = 0.08  # the land grown into the sea, degrees
SIMPLIFY = 0.06


def wrap(lon):
    return ((lon - 141.5 + 180) % 360) - 180 + 141.5


def wrap_geom(g):
    """a geometry's longitudes moved to the table's side of 180 (each polygon whole, by its centroid)"""
    polys = list(g.geoms) if isinstance(g, MultiPolygon) else [g]
    out = []
    for p in polys:
        c = p.centroid.x
        dx = wrap(c) - c
        out.append(shapely.affinity.translate(p, xoff=dx) if abs(dx) > 1e-9 else p)
    return unary_union(out)


import shapely.affinity


def area_km2(p):
    lat = p.centroid.y
    return p.area * 111.32 * 110.57 * math.cos(math.radians(lat))


def load_land():
    fc = json.load(open(DL + 'ne/ne_50m_land.geojson'))
    env = box(W0, S0, E0, N0)
    big = []
    for f in fc['features']:
        g = shape(f['geometry'])
        for p in (g.geoms if isinstance(g, MultiPolygon) else [g]):
            p = wrap_geom(p)
            for q in (p.geoms if isinstance(p, MultiPolygon) else [p]):
                if not q.intersects(env):
                    continue
                q = q.intersection(env)
                for r in (q.geoms if hasattr(q, 'geoms') else [q]):
                    if isinstance(r, Polygon) and area_km2(r) >= ISLE_KM2:
                        big.append(r)
    land = unary_union(big)
    return land


def load_countries():
    fc = json.load(open(DL + 'ne/ne_50m_countries.geojson'))
    env = box(W0 - 5, S0, E0 + 5, N0)
    out = {}
    for f in fc['features']:
        name = f['properties']['ADMIN'].strip('\x00')
        g = wrap_geom(shape(f['geometry']).buffer(0))
        g = g.intersection(env)
        if not g.is_empty:
            out[name] = unary_union([out[name], g]) if name in out else g
    return out


P = lambda pts: Polygon(pts)
# Manchukuo (with Jehol and the Hsingan provinces): south of the Great Wall line and east of the Mongolian
# grasslands, as the Green Books' maps draw it; schematic
MANCHUKUO = P([(119.8, 39.9), (118.6, 40.15), (117.3, 40.55), (116.3, 41.0), (116.0, 42.0), (116.7, 43.0), (118.0, 44.0), (118.6, 45.0),
               (117.0, 46.3), (115.4, 47.3), (115.0, 50.5), (125.0, 54.5), (136.0, 49.5), (131.5, 42.0), (124.3, 39.7), (121.5, 38.6), (119.8, 39.9)])
# Tibet, outside China's control in these years; schematic
TIBET = P([(78.3, 35.5), (80.0, 36.0), (84.0, 36.2), (90.0, 36.0), (94.0, 35.6), (97.0, 34.2), (99.0, 32.6), (98.6, 29.0), (97.6, 28.2), (96.0, 29.0),
           (94.0, 28.8), (92.0, 27.8), (90.0, 27.9), (88.0, 27.9), (86.0, 28.0), (84.0, 28.5), (82.0, 30.0), (80.5, 30.3), (79.0, 31.0), (78.3, 32.5), (78.3, 35.5)])
KARAFUTO = box(140.5, 45.8, 145.5, 50.0)  # Sakhalin south of 50° N
KURILS = box(145.3, 43.2, 157.5, 51.2)
MALAYA_BOX = box(98.5, 0.8, 105.5, 7.5)
ANDAMANS = box(91.5, 6.0, 94.5, 14.5)  # the Andamans and Nicobars
BORNEO_BOX = box(108.5, -4.5, 120.0, 8.0)


def territories(countries):
    c = lambda *names: unary_union([countries[n] for n in names if n in countries])
    russia = c('Russia')
    china = c('China')
    t = {
        'japan': ('Japan', c('Japan')),
        'karafuto': ('Karafuto and the Kuril Islands', russia.intersection(KARAFUTO) | russia.intersection(KURILS)),
        'korea': ('Korea', c('North Korea', 'South Korea')),
        'taiwan': ('Taiwan (Formosa)', c('Taiwan')),
        'manchukuo': ('Manchukuo', china.intersection(MANCHUKUO)),
        'tibet': ('Tibet', china.intersection(TIBET)),
        'china': ('China', china.difference(MANCHUKUO).difference(TIBET) | c('Macao S.A.R')),
        'hongkong': ('Hong Kong', c('Hong Kong S.A.R.')),
        'mongolia': ('Mongolia', c('Mongolia')),
        'ussr': ('the Soviet Union', russia.difference(KARAFUTO).difference(KURILS) | c('Kazakhstan', 'Kyrgyzstan', 'Tajikistan', 'Uzbekistan', 'Turkmenistan')),
        'indochina': ('French Indochina', c('Vietnam', 'Laos', 'Cambodia')),
        'thailand': ('Thailand', c('Thailand')),
        'burma': ('Burma', c('Myanmar')),
        'malaya': ('Malaya and Singapore', c('Malaysia').intersection(MALAYA_BOX) | c('Singapore')),
        'borneo': ('British Borneo', c('Malaysia').intersection(BORNEO_BOX) | c('Brunei')),
        'nei': ('the Netherlands East Indies', c('Indonesia')),
        'ptimor': ('Portuguese Timor', c('East Timor')),
        'philippines': ('the Philippines', c('Philippines')),
        'papua': ('Papua and New Guinea', c('Papua New Guinea')),
        'solomons': ('the Solomon Islands', c('Solomon Islands')),
        'australia': ('Australia', c('Australia')),
        'nz': ('New Zealand', c('New Zealand')),
        'andamans': ('the Andaman Islands', c('India').intersection(ANDAMANS)),
        'india': ('India', c('India', 'Bangladesh', 'Pakistan', 'Siachen Glacier').difference(ANDAMANS)),
        'ceylon': ('Ceylon', c('Sri Lanka')),
        'himalaya': ('Nepal and Bhutan', c('Nepal', 'Bhutan')),
        'afghanistan': ('Afghanistan', c('Afghanistan')),
        'iran': ('Iran', c('Iran')),
        'usa': ('the United States', c('United States of America')),
        'canada': ('Canada', c('Canada')),
        'pacific-allied': ('the Allied islands of the South Pacific', c('New Caledonia', 'Fiji', 'Vanuatu')),
    }
    return t


# --- the keyframes -----------------------------------------------------------------------------------
# territories whose holder is a matter of record, not of the page (the page paints Mongolia with China, and
# its white and pink run over India's and Australia's edges)
FORCED = {'ussr', 'mongolia', 'tibet', 'himalaya', 'afghanistan', 'iran', 'india', 'ceylon', 'australia', 'nz', 'usa', 'canada', 'pacific-allied', 'japan', 'korea', 'manchukuo', 'karafuto'}
EVE = '1941-12-06'
# the prologue's keyframes (ROUND-2.md §1.3; research/content-2.md): schematic, by hand regions (PROLOGUE below)
PROLOGUE_KF = ['1931-09-18', '1932-03-01', '1937-12-31', '1938-12-31', '1940-09-30', '1941-07-31']
KF = PROLOGUE_KF + ['1941-12-06', '1942-05-08', '1942-09-15', '1943-11-01', '1944-08-15', '1945-01-15', '1945-07-01', '1945-09-02']
ATLAS = {'1943-11-01': 24, '1944-08-15': 62, '1945-01-15': 82, '1945-07-01': 102, '1945-09-02': 104}
CHINA_1942 = 8  # the Atlas's first page (to 1 July 1943), for occupied China before the Atlas begins


def default_state(tid, kf):
    """who holds a territory (or the part of it off the Atlas page) on a keyframe, by date"""
    early = kf < '1943-11-01'
    if tid == 'manchukuo' and kf < '1932-03-01':
        return 'allied'  # Manchuria is China's on the eve of Mukden (the leased territory and the railway zone are PROLOGUE's)
    if tid in ('japan', 'korea', 'taiwan', 'manchukuo', 'karafuto'):
        return 'held'
    if tid == 'andamans':
        return 'allied' if kf < '1942-03-23' else 'held'
    if tid == 'mongolia':
        return 'neutral' if kf < '1945-08-10' else 'allied'
    if tid in ('ussr',):
        return 'soviet'
    if tid in ('mongolia', 'tibet', 'himalaya', 'afghanistan'):
        return 'neutral'
    if tid == 'indochina':
        # French, and at war with no one, until Japan's troops come in: the north (Tonkin) from 22 September 1940
        # is a PROLOGUE region; the whole is garrisoned from the agreement of July 1941 to the coup of 9 March 1945
        if kf < '1941-07-31':
            return 'neutral'
        return 'garrisoned' if kf < '1945-03-09' else 'held'
    if tid == 'thailand':
        return 'neutral' if kf < '1941-12-21' else 'allied-with-japan'
    if tid == 'hongkong':
        return 'allied' if kf < '1941-12-25' else 'held'
    if tid in ('malaya', 'borneo', 'nei', 'burma', 'philippines'):
        # held from the first offensive; from 1943-11-01 the page says otherwise where it can
        return 'allied' if kf <= EVE else 'held'
    if tid == 'ptimor':
        if kf <= EVE:
            return 'neutral'
        return 'contested' if early else 'held'
    if tid == 'china':
        return 'allied'
    return 'allied'


# hand regions for the 1942 keyframes (schematic, from the Green Books' maps: Morton Maps I and 9,
# Milner's Papua, Miller's Guadalcanal)
HAND = {
    '1942-05-08': [
        ('contested', 'Mindanao and the Visayas', P([(121.8, 12.6), (126.8, 12.6), (126.8, 5.4), (121.8, 5.4)])),
        ('contested', 'Dutch New Guinea', P([(130.8, -0.2), (141.0, -0.2), (141.0, -9.2), (130.8, -9.2)])),
        ('held', 'Lae and Salamaua', P([(146.6, -6.3), (147.9, -6.3), (147.9, -7.4), (146.6, -7.4)])),
        ('held', 'New Britain and New Ireland', P([(147.8, -2.0), (153.5, -2.0), (153.5, -6.6), (147.8, -6.6)])),
        ('held', 'Bougainville', P([(154.4, -4.9), (156.0, -4.9), (156.0, -7.0), (154.4, -7.0)])),
    ],
    '1942-09-15': [
        ('contested', 'Dutch New Guinea', P([(130.8, -0.2), (141.0, -0.2), (141.0, -9.2), (130.8, -9.2)])),
        ('held', 'the Huon Gulf', P([(146.4, -5.9), (148.1, -5.9), (148.1, -7.5), (146.4, -7.5)])),
        ('contested', 'the Kokoda Track and Buna', P([(147.2, -8.1), (148.6, -8.1), (148.6, -8.8), (148.0, -8.95), (147.6, -9.45), (147.25, -9.45), (147.2, -8.8)])),
        ('held', 'New Britain and New Ireland', P([(147.8, -2.0), (153.5, -2.0), (153.5, -6.6), (147.8, -6.6)])),
        ('held', 'Bougainville', P([(154.4, -4.9), (156.0, -4.9), (156.0, -7.0), (154.4, -7.0)])),
        ('contested', 'Guadalcanal', P([(159.5, -9.0), (160.9, -9.0), (160.9, -10.0), (159.5, -10.0)])),
    ],
}

# --- where the record overrides the trace -----------------------------------------------------------
# A narrow island or a thin coast on the page fills few pixels of a cell's window, so the window's majority
# goes to the sea round it: the page's grey sea reads as neutral, and a neutral in Papua or the Solomons
# keeps the territory's default, Allied; or the pink of the Allied sea runs over it. The project's record
# (research/R3-timeline.md §5, K3 to K5, and the audit's finding D1) puts these places on the other side,
# and the page itself agrees where it is looked at closely (research/content.md §3). Each override takes
# the cells of one Natural Earth island (grown like the coast) or of a hand region, in the territories
# named, before General Order No. 1; its feature is schematic and carries its own sources.
TOROKINA = P([(154.92, -6.12), (155.12, -6.10), (155.22, -6.25), (155.12, -6.36), (154.98, -6.30)])  # the beachhead at Cape Torokina, schematic
WEWAK_COAST = P([(143.3, -3.35), (143.75, -3.45), (144.2, -3.6), (144.65, -3.8), (144.65, -4.05), (143.3, -3.85)])  # Wewak east to the Sepik's mouth (with the held land behind it)
XIANG_VALLEY = LineString([(112.95, 28.05), (113.1, 27.8), (112.9, 27.25), (112.57, 26.89), (112.5, 26.75)]).buffer(0.22, cap_style='flat')  # the railway south of Changsha to Hengyang
NEW_IRELAND = (151.5, -3.0)  # a point on each island, to pick its Natural Earth polygon
MALAITA = (161.0, -9.0)
BOUGAINVILLE = (155.4, -6.3)  # Buka, under ISLE_KM2, is left to the islands
CHOISEUL = (157.0, -7.05)
NEW_GUINEA = (131.5, -1.1)  # on the Vogelkop
EAST_OF_SORONG = box(131.95, -12.0, 152.0, 1.0)  # New Guinea less its western tip: Sansapor's beachhead and Manokwari keep the trace's reading


def _atlas(kf, what):
    return {'id': 'atlas-battle-fronts-1945', 'where': f'{ATLAS_WHERE[kf]}: {what}'}


# Sorong and the western Vogelkop (R3 §5 K5: the Vogelkop cut off; K4 has Sorong held, less Sansapor), from the
# first keyframe R3 names it cut off to the surrender: pages 78, 98 and 100 paint the Vogelkop white, but the pink of
# the Allied sea lane past Sansapor crosses its western tip
def _sorong(what):
    return dict(state='held', name='Sorong and the western Vogelkop', island=NEW_GUINEA, less=EAST_OF_SORONG, terr=('nei',),
                sources=lambda kf: [_atlas(kf, what)] + ([{'id': 'smith-1963', 'where': 'Map 1: the Vogelkop cut off'}] if kf == '1945-01-15' else []))


RECORD = {
    '1943-11-01': [
        dict(state='held', name='New Ireland', island=NEW_IRELAND, terr=('papua',),
             sources=lambda kf: [_atlas(kf, 'New Ireland inside the enemy-held white')]),
        # R3 §5 K3 runs the perimeter through Choiseul: the page's white covers it, but the island is narrow and its name is lettered across it
        dict(state='held', name='Choiseul', island=CHOISEUL, terr=('solomons',),
             sources=lambda kf: [_atlas(kf, 'Choiseul inside the enemy-held white, its name lettered across it')]),
        dict(state='allied', name='Malaita', island=MALAITA, terr=('solomons',),
             sources=lambda kf: [{'id': 'zimmerman-1949', 'where': 'p. 2: the Resident Commissioner removed to Malaita in May 1942'},
                                 _atlas(kf, 'the edge of the Allied sea across Malaita')]),
    ],
    '1944-08-15': [
        dict(state='held', name='New Ireland', island=NEW_IRELAND, terr=('papua',),
             sources=lambda kf: [_atlas(kf, 'New Ireland and the Gazelle Peninsula inside the enemy-held white')]),
        dict(state='held', name='the Wewak pocket', region=WEWAK_COAST, terr=('papua',), absorb=True,
             sources=lambda kf: [_atlas(kf, 'the coast at Wewak in the enemy-held white')]),
        dict(state='held', name='occupied China: Hengyang and the Xiang valley', region=XIANG_VALLEY, terr=('china',), pointsAndLines=True,
             sources=lambda kf: [_atlas(kf, 'the white corridor south from Changsha and the black of the period\'s gains at Hengyang')]),
    ],
    '1945-01-15': [
        dict(state='held', name='Bougainville', island=BOUGAINVILLE, less=TOROKINA, terr=('papua',),
             sources=lambda kf: [_atlas(kf, 'Bougainville in the enemy-held white'), {'id': 'smith-1963', 'where': 'Map 1: Bougainville cut off'}]),
        dict(state='allied', name='the Torokina perimeter', region=TOROKINA, terr=('papua',),
             sources=lambda kf: [{'id': 'atlas-battle-fronts-1945', 'where': 'p. 22, the period ending 15 November 1943: "our troops consolidated and enlarged their holdings on strategic Bougainville"'}]),
        _sorong('the Vogelkop in the enemy-held white, its western tip under the pink of the Allied sea lane past Sansapor'),
    ],
    '1945-07-01': [
        dict(state='held', name='New Ireland', island=NEW_IRELAND, terr=('papua',),
             sources=lambda kf: [_atlas(kf, 'New Ireland and the Gazelle Peninsula inside the enemy-held white')]),
        _sorong('the Vogelkop in the enemy-held white, its western tip under the pink of the Allied sea lane past Sansapor'),
    ],
    # held to the surrender, so General Order No. 1 gives them to the Australian forces
    '1945-09-02': [
        dict(state='held', name='New Ireland', island=NEW_IRELAND, terr=('papua',),
             sources=lambda kf: [_atlas(kf, 'New Ireland and the Gazelle Peninsula inside the enemy-held white')]),
        _sorong('the Vogelkop in the enemy-held white, its western tip under the pink of the Allied sea lane past Sansapor'),
    ],
}


def island_of(land, at):
    p = shapely.Point(*at)
    hit = [g for g in (land.geoms if hasattr(land, 'geoms') else [land]) if g.contains(p)]
    if len(hit) != 1:
        sys.exit(f'RECORD: no single island of {ISLE_KM2} km² or more at {at}')
    return hit[0]


def record_cells(r, land, LON, LAT, inside, tid, state):
    region = island_of(land, r['island']).buffer(GROW) if 'island' in r else r['region']
    if 'less' in r:
        region = region.difference(r['less'])
    terr = inside & np.isin(tid, list(r['terr']))
    m = terr & shapely.contains_xy(region, LON, LAT)
    if r.get('absorb'):
        # the trace's own cells of the same state that touch the region join it, so the place is one
        # feature and no seam of two smoothed outlines opens between them
        same = terr & (state == r['state'])
        while True:
            grown = m | (same & (np.roll(m, 1, 0) | np.roll(m, -1, 0) | np.roll(m, 1, 1) | np.roll(m, -1, 1)))
            if (grown == m).all():
                break
            m = grown
    return m


# --- the prologue: 1931 to the eve of the war ---------------------------------------------------------
# Six schematic keyframes (ROUND-2.md §1.3 and §7; research/content-2.md). Every territory takes its holder by
# date (default_state: the colonies, and Manchukuo from 1932-03-01, held; China and the others as the eve's
# keyframe has them, so the cross-fade into 1941-12-06 is quiet), and these hand regions lay over it, each
# with its own sources. Occupied China (Japan's cities and railways, points and lines) is drawn inside the
# extent the Atlas's first page (1 July 1943) gives it, the one the eve's keyframe draws: the 1937 and 1938
# regions are cut from it, so the hatch grows into the eve's and never draws past it.
#
# The Kwantung Leased Territory, the tip of the Liaodong Peninsula south of Pulandian and Pikou (JM-144 ch. I,
# "concessions and neutral zones in Kwantung Province"); schematic
KWANTUNG = P([(120.8, 39.6), (121.6, 39.55), (122.2, 39.58), (122.75, 39.62), (123.1, 39.45), (122.7, 38.5), (120.9, 38.5)])
# the South Manchuria Railway, Dairen to Changchun, with the Port Arthur, Yingkou and Fushun branches and the
# Antung–Mukden line (JM-144 ch. I: "South Manchurian railroad and adjacent railroad zones", "right to station
# troops in railroad zones"); a strip of a texel or two each side, since the zone's own width is under the grid
SMR = unary_union([LineString(c) for c in (
    [(121.26, 38.81), (121.6, 38.92), (121.71, 39.1), (122.0, 39.63), (122.35, 40.4), (122.5, 40.63), (122.75, 40.85), (122.99, 41.11), (123.17, 41.27),
     (123.43, 41.8), (123.84, 42.29), (124.04, 42.54), (124.37, 43.17), (124.82, 43.5), (125.32, 43.88)],
    [(122.5, 40.63), (122.23, 40.67)],
    [(123.43, 41.8), (123.95, 41.87)],
    [(123.43, 41.8), (123.77, 41.3), (124.07, 40.45), (124.39, 40.13)])]).buffer(0.12)
# Jehol, occupied from January to March 1933 (JM-144 ch. I; Peace and War, ch. II): Manchukuo's south-west, from
# the Great Wall north to the Hsingan provinces; schematic
JEHOL = P([(119.85, 39.95), (120.4, 40.55), (121.15, 41.35), (121.8, 42.2), (121.4, 43.3), (120.7, 44.4), (119.3, 45.2), (117.6, 44.6), (115.5, 43.5),
           (115.5, 40.4), (118.8, 39.9)])
# Occupied China at the end of 1937, from JM-70's General Reference Maps I and II (the operations' dates) and
# JM-144's chronology: the Hopeh plain to Anyang and Shantung north of the Yellow River to Tsinan; Chahar and
# Suiyuan to Paotow (the Mongolian Federal Autonomous Government of 28 October); the railways of northern
# Shansi to Taiyuan and Pingyao and the Shihchiachuang–Taiyuan line; the Shanghai–Nanking–Hangchow corridor
REGION_1937 = unary_union([
    P([(119.9, 40.1), (119.9, 38.6), (118.95, 37.9), (118.2, 37.3), (117.3, 36.75), (116.9, 36.45), (116.2, 36.6), (115.4, 36.2), (114.75, 35.95),
       (114.2, 36.05), (114.1, 36.6), (114.15, 37.4), (114.25, 38.0), (114.6, 38.7), (115.1, 39.45), (115.6, 39.8), (116.1, 40.1), (117.1, 40.35),
       (118.3, 40.15), (119.0, 40.0)]),
    P([(109.3, 40.45), (109.3, 47.0), (118.5, 47.0), (117.0, 41.6), (116.3, 40.5), (115.6, 40.2), (114.5, 39.75), (113.6, 39.6), (112.5, 39.7),
       (111.4, 40.05), (110.5, 40.35)]),
    LineString([(113.3, 40.08), (113.1, 39.82), (112.82, 39.52), (112.95, 39.07), (112.7, 38.73), (112.73, 38.42), (112.55, 37.87), (112.73, 37.68),
                (112.55, 37.42), (112.17, 37.2)]).buffer(0.25),
    LineString([(114.48, 38.04), (114.15, 38.03), (113.85, 37.95), (113.58, 37.86), (113.17, 37.89), (112.73, 37.68)]).buffer(0.25),
    LineString([(116.4, 39.9), (116.13, 40.25), (115.5, 40.38), (114.88, 40.82)]).buffer(0.25),  # Peiping–Kalgan, by Nankou (late August)
    P([(122.2, 31.35), (121.85, 31.7), (121.0, 31.85), (120.3, 31.95), (119.95, 32.2), (119.75, 32.55), (119.1, 32.6), (118.5, 32.45), (118.0, 32.5),
       (118.0, 32.0), (118.2, 31.35), (118.55, 30.8), (119.5, 30.75), (119.95, 30.1), (120.6, 30.2), (121.3, 30.65), (122.1, 30.85)]),
])
# Occupied China at the end of 1938: the front JM-144 (ch. III, p. 42) gives, "west of An-Pei, Sui-Yuan
# Province, ... southward roughly along the Yellow River, ... east at Tung-Kuan. From Kai-Feng ... southward
# along the Peiping-Hankow railway line, reaching Yo-Chou ... eastward, passing through Yung-Hsiu ... and
# reaching Hangchow", with the arc round Canton "to Samshui, ... north of Hua-Hsien and Tsung-Hua, ... to
# Ping-Hai Peninsula"; less northern Kiangsu east of the Tientsin–Pukow railway, where JM-70 (p. 47) has "no
# Japanese forces east of Tungshan to the coast" until February 1939
REGION_1938 = unary_union([
    REGION_1937,
    P([(108.3, 47.0), (108.3, 41.3), (108.4, 40.6), (109.5, 40.4), (111.1, 40.25), (111.25, 39.45), (111.0, 38.5), (110.75, 37.4), (110.5, 36.3),
       (110.55, 35.6), (110.25, 34.6), (111.2, 34.75), (112.4, 34.85), (113.5, 34.95), (114.1, 34.85), (114.35, 34.7), (114.6, 34.3), (115.2, 33.4),
       (116.0, 32.85), (115.5, 32.4), (114.9, 32.35), (114.0, 32.25), (113.75, 31.6), (113.45, 30.95), (113.5, 30.4), (113.0, 29.6), (112.95, 29.3),
       (113.6, 29.25), (114.5, 29.45), (115.1, 29.15), (115.75, 28.95), (116.3, 29.4), (116.9, 29.9), (117.6, 30.35), (118.3, 30.65), (119.5, 30.7),
       (120.0, 30.1), (121.0, 30.4), (123.5, 30.5), (123.5, 38.5), (121.5, 40.6), (118.5, 47.0)]),
    P([(112.7, 22.45), (112.75, 23.25), (113.15, 23.5), (113.6, 23.68), (114.4, 23.6), (114.8, 23.1), (115.1, 22.6), (114.6, 22.4), (113.9, 22.2),
       (113.3, 22.1)]),
]).difference(P([(117.65, 34.2), (118.4, 34.45), (119.4, 34.8), (120.6, 34.6), (121.6, 32.9), (119.8, 32.72), (118.6, 32.85), (117.7, 33.05)]))
# west of the Salween: the Atlas's page of 1943 holds ground in western Yunnan taken in May 1942, out of place
# before the war (the eve's keyframe keeps it, with the rest of that page's China)
WEST_YUNNAN = box(90.0, 20.0, 100.2, 30.0)
# south of the Ch'ien-t'ang and down the coast to Foochow: taken in April 1941 (JM-70, pp. 66–68 and Map 3:
# Chuchi, Ningpo, Yuyao, Linhai and Yungchia), so not yet held on 1940-09-30
SOUTH_OF_QIANTANG = P([(119.6, 30.25), (120.2, 30.22), (120.6, 30.32), (121.0, 30.38), (121.5, 30.3), (123.5, 30.3), (123.5, 24.6), (117.5, 24.6),
                       (117.5, 27.5), (119.6, 28.5)])
# the Chinhsien–Nanning area the 22d Army held from November 1939 until IGHQ ordered it back to Canton in
# November 1940 (JM-70, pp. 62–65), and the road on to the Indochina frontier its 5th Division crossed in
# September 1940 (inferred from the same pages); schematic
NANNING = LineString([(108.62, 21.95), (108.35, 22.4), (108.32, 22.82), (107.9, 22.63), (107.37, 22.4), (107.07, 22.13), (106.75, 22.0)]).buffer(0.22)
# Tonkin, the province of French Indochina Japan's troops entered under the agreement of 22 September 1940
# (Peace and War, p. 96; Morton, ch. II, "the right to occupy Tonkin Province"): Vietnam north of Annam
NORTH_OF_ANNAM = P([(101.0, 24.0), (110.0, 24.0), (110.0, 19.9), (106.6, 19.9), (106.05, 19.98), (105.6, 20.25), (105.1, 20.5), (104.3, 20.75), (101.0, 20.9)])


def tonkin(G):
    return G.countries['Vietnam'].buffer(GROW).difference(G.countries['Laos']).intersection(NORTH_OF_ANNAM)


def occupied(region=None, less=None):
    """occupied China's cells: the eve's extent (the Atlas's first page), within region and outside less"""
    def cells(G):
        m = G.occ1941.copy()
        if region is not None:
            m &= shapely.contains_xy(region, G.LON, G.LAT)
        if less is not None:
            m &= ~shapely.contains_xy(less, G.LON, G.LAT)
        return m
    return cells


S_ATLAS4 = {'id': 'atlas-battle-fronts-1945', 'where': 'p. 4, the period ending 1 July 1943: the extent of occupied China, within which the earlier extent is drawn'}
S_JM144_1 = {'id': 'jm-144', 'where': 'ch. I: the rights in Manchuria and the chronology of the Manchurian Incident'}
S_JM70_MAPS = {'id': 'jm-70', 'where': 'General Reference Maps I and II, the operations in north China, July 1937 – June 1938, and in central and south China, August 1937 – March 1939'}
S_MORTON_2 = {'id': 'morton-1962', 'where': 'ch. II, Japanese Policy and Strategy, 1931 – July 1941'}
S_PAW_2 = {'id': 'peace-and-war-1943', 'where': 'ch. II, Japanese Conquest of Manchuria, 1931–1932'}
KW = dict(state='held', name='the Kwantung Leased Territory', region=KWANTUNG, terr=('manchukuo',), sources=[S_JM144_1])
PROLOGUE = {
    '1931-09-18': [
        dict(state='held', name='the South Manchuria Railway zone', region=SMR, terr=('manchukuo',), pointsAndLines=True, sources=[S_JM144_1, S_MORTON_2]),
        KW,
    ],
    '1932-03-01': [
        dict(state='allied', name='Jehol', region=JEHOL, terr=('manchukuo',),
             sources=[{'id': 'jm-144', 'where': 'ch. I: Jehol Province occupied from 2 January to March 1933'}, {'id': 'peace-and-war-1943', 'where': 'ch. II: the occupation of Jehol, early in January 1933'}]),
        KW,
    ],
    '1937-12-31': [
        dict(state='held', name='occupied China', cells=occupied(REGION_1937), terr=('china',), pointsAndLines=True,
             sources=[S_JM70_MAPS, {'id': 'jm-144', 'where': 'ch. II: the chronology of 1937'}, S_ATLAS4]),
        KW,
    ],
    '1938-12-31': [
        dict(state='held', name='occupied China', cells=occupied(REGION_1938), terr=('china',), pointsAndLines=True,
             sources=[{'id': 'jm-144', 'where': 'ch. III, p. 42: the front at the end of 1938, and the chronology of 1938'}, S_JM70_MAPS,
                      {'id': 'jm-70', 'where': 'p. 47: no Japanese forces east of Hsuchow to the coast until February 1939'}, S_ATLAS4]),
        KW,
    ],
    '1940-09-30': [
        dict(state='held', name='occupied China', cells=occupied(less=WEST_YUNNAN.union(SOUTH_OF_QIANTANG)), terr=('china',), pointsAndLines=True,
             sources=[S_ATLAS4, {'id': 'romanus-1953', 'where': 'Map 1, Japanese Plan, December 1941 (Imperial GHQ Army Order No. 575): the areas held'},
                      {'id': 'jm-70', 'where': 'ch. 3: Hainan, Swatow, Nanchang and Ichang taken in 1939 and 1940; Chekiang south of Hangchow in April 1941 (pp. 66–68)'}]),
        dict(state='held', name='occupied China: the Nanning area', region=NANNING, terr=('china',), pointsAndLines=True,
             sources=[{'id': 'jm-70', 'where': 'pp. 62–65: the 22d Army in the Chinhsien–Nanning area until November 1940, and the advance into northern French Indo-China'}]),
        dict(state='garrisoned', name='Tonkin (French Indochina)', region=tonkin, terr=('indochina',),
             sources=[{'id': 'peace-and-war-1943', 'where': 'p. 96: the agreement of 22 September 1940, three airfields and the transit of troops'},
                      {'id': 'morton-1962', 'where': 'ch. II and IV: the right to occupy Tonkin Province'},
                      {'id': 'jm-70', 'where': 'p. 64, Advance into Northern French Indo-China'}]),
        KW,
    ],
    '1941-07-31': [
        dict(state='held', name='occupied China', cells=occupied(less=WEST_YUNNAN), terr=('china',), pointsAndLines=True,
             sources=[S_ATLAS4, {'id': 'romanus-1953', 'where': 'Map 1, Japanese Plan, December 1941 (Imperial GHQ Army Order No. 575): the areas held'},
                      {'id': 'jm-70', 'where': 'pp. 66–68 and Map 3: Chuchi, Ningpo, Yuyao, Linhai and Yungchia taken in April 1941'}]),
        KW,
    ],
}


def prologue_cells(r, G):
    terr = G.inside & np.isin(G.tid, list(r['terr']))
    if 'cells' in r:
        return terr & r['cells'](G)
    region = r['region'](G) if callable(r['region']) else r['region']
    return terr & shapely.contains_xy(region, G.LON, G.LAT)


def prologue_sources(kf, st, nm):
    """a prologue keyframe's sources for a territory drawn by its holder on the date"""
    if nm == 'French Indochina':
        if kf >= '1941-07-31':
            return [{'id': 'peace-and-war-1943', 'where': 'p. 123: the right to keep troops and bases in southern Indochina, about 22 July 1941'},
                    {'id': 'morton-1962', 'where': 'ch. IV: the move into southern Indochina'}, {'id': 'jm-70', 'where': 'p. 69, Advance into Southern French Indo-China'}]
        if kf >= '1940-09-30':
            return [{'id': 'morton-1962', 'where': 'ch. II: "in southern Indochina, where there were no Japanese troops"'}, {'id': 'peace-and-war-1943', 'where': 'p. 96'}]
        return [S_MORTON_2]
    if nm == 'Manchukuo':
        return [S_JM144_1, S_PAW_2, S_MORTON_2]
    if nm == 'Free China':
        return [S_ATLAS4, S_JM70_MAPS]
    return [{'id': 'morton-1962', 'where': 'ch. I–II and Map 1: the territories by date'}]


# General Order No. 1's zones (keyframe 1945-09-02): what Japanese forces surrendered to whom, by territory
# and the two parallels
GO1 = {
    'china': ('zone-cks', 'to Chiang Kai-shek'), 'taiwan': ('zone-cks', 'to Chiang Kai-shek'), 'hongkong': ('zone-cks', 'to Chiang Kai-shek'),
    'manchukuo': ('zone-soviet', 'to the Soviet Far East command'),
    'burma': ('zone-seac', 'to South East Asia Command'), 'thailand': ('zone-seac', 'to South East Asia Command'),
    'andamans': ('zone-seac', 'to South East Asia Command'), 'karafuto': ('zone-soviet', 'to the Soviet Far East command'),
    'malaya': ('zone-seac', 'to South East Asia Command'),
    'borneo': ('zone-swpa', 'to the Australian forces'), 'papua': ('zone-swpa', 'to the Australian forces'), 'solomons': ('zone-swpa', 'to the Australian forces'),
    'philippines': ('zone-swpa', 'to the US Army Forces, Pacific'), 'japan': ('zone-swpa', 'to the US Army Forces, Pacific'),
    'ptimor': ('zone-swpa', 'to the Australian forces'),
}
# Sumatra, Java and Bali to South East Asia Command; Borneo and the islands east to the Australian forces
SEAC_NEI = unary_union([box(94.0, -6.2, 106.4, 6.5), box(104.5, -9.6, 115.8, -5.6)])


def go1_zone(tid, lon, lat):
    if tid == 'korea':
        return ('zone-soviet', 'to the Soviet Far East command') if lat >= 38.0 else ('zone-swpa', 'to the US Army Forces, Pacific')
    if tid == 'indochina':
        return ('zone-cks', 'to Chiang Kai-shek') if lat >= 16.0 else ('zone-seac', 'to South East Asia Command')
    if tid == 'nei':
        return ('zone-seac', 'to South East Asia Command') if SEAC_NEI.contains(shapely.Point(lon, lat)) else ('zone-swpa', 'to the Australian forces')
    return GO1.get(tid)


# --- the grid ----------------------------------------------------------------------------------------
def grid_over(land):
    lon = np.arange(W0 + D / 2, E0, D)
    lat = np.arange(N0 - D / 2, S0, -D)
    LON, LAT = np.meshgrid(lon, lat)
    inside = shapely.contains_xy(land.buffer(GROW), LON, LAT)
    return lon, lat, LON, LAT, inside


def territory_grid(terrs, LON, LAT, inside):
    tid = np.full(LON.shape, '', dtype=object)
    ys, xs = np.nonzero(inside)
    pts_lon, pts_lat = LON[ys, xs], LAT[ys, xs]
    for k, (name, g) in terrs.items():
        if g.is_empty:
            continue
        gb = g.buffer(GROW)  # the coast's grown margin belongs to the territory beside it
        x0, y0, x1, y1 = gb.bounds
        m = (pts_lon >= x0) & (pts_lon <= x1) & (pts_lat >= y0) & (pts_lat <= y1)
        hit = np.zeros(len(pts_lon), bool)
        hit[m] = shapely.contains_xy(gb, pts_lon[m], pts_lat[m])
        free = hit & (tid[ys, xs] == '')
        tid[ys[free], xs[free]] = k
    return tid


def fill_unknown(c, inside, iters=40):
    """class 0 cells inside the page's coverage take their neighbours' class, ring by ring"""
    c = c.copy()
    for _ in range(iters):
        z = (c == 0) & inside
        if not z.any():
            break
        best = np.zeros_like(c)
        for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0)):
            sh = np.roll(np.roll(c, dy, 0), dx, 1)
            best = np.where((best == 0) & (sh != 0), sh, best)
        c = np.where(z, best, c)
    return c


def majority(c, valid, r=1):
    """each valid cell takes the most common class in its (2r+1)² window (noise from lettering and line work)"""
    out = c.copy()
    counts = []
    for k in range(5):
        m = (c == k).astype(np.int32)
        s = np.zeros_like(m)
        for dy in range(-r, r + 1):
            for dx in range(-r, r + 1):
                s += np.roll(np.roll(m, dy, 0), dx, 1)
        counts.append(s)
    counts = np.stack(counts, -1)
    counts[..., 0] = 0
    best = counts.argmax(-1)
    has = counts.max(-1) > 0
    out[valid & has] = best[valid & has]
    return out


def cells_to_geom(mask, lon, lat, D=D):
    """the union of a mask's cells, by row runs"""
    rects = []
    for j in range(mask.shape[0]):
        row = mask[j]
        if not row.any():
            continue
        d = np.diff(np.r_[0, row.astype(np.int8), 0])
        starts = np.nonzero(d == 1)[0]
        ends = np.nonzero(d == -1)[0]
        y0 = lat[j] - D / 2
        for a, b in zip(starts, ends):
            rects.append(box(lon[a] - D / 2, y0, lon[b - 1] + D / 2, y0 + D))
    return unary_union(rects) if rects else Polygon()


def r4(g):
    """coordinates to 2 decimals (1.1 km): the table rasterises the front at about 14 km"""
    return shapely.set_precision(g, 0.01)


def build():
    print('land and territories')
    land = load_land()
    countries = load_countries()
    terrs = territories(countries)
    lon, lat, LON, LAT, inside = grid_over(land)
    tid = territory_grid(terrs, LON, LAT, inside)
    landg = land.buffer(GROW).simplify(SIMPLIFY / 2)
    print('cells on land', int(inside.sum()), 'without a territory', int(((tid == '') & inside).sum()))

    china1942 = atlas_grid(CHINA_1942, LON, LAT, inside)
    # what the prologue's hand regions read (PROLOGUE, prologue_cells)
    G = types.SimpleNamespace(LON=LON, LAT=LAT, inside=inside, tid=tid, countries=countries, occ1941=(china1942 == 1) | (china1942 == 4))
    manifest = {'keyframes': [], 'lines': 'fronts/lines.geojson'}
    stats = {}
    only = [k for k in os.environ.get('FRONTS_ONLY', '').split(',') if k]  # FRONTS_ONLY=1937-12-31,1938-12-31 writes only those
    for kf in [k for k in KF if not only or k in only]:
        leaf = ATLAS.get(kf)
        cls = atlas_grid(leaf, LON, LAT, inside) if leaf else None
        state = np.full(LON.shape, '', dtype=object)
        name = np.full(LON.shape, '', dtype=object)
        pal = np.zeros(LON.shape, bool)
        mapped = np.zeros(LON.shape, bool)
        for k, (tname, _) in terrs.items():
            m = inside & (tid == k)
            if not m.any():
                continue
            st = default_state(k, kf)
            state[m] = st if st else 'allied'
            name[m] = tname
            if k == 'manchukuo' and st == 'allied':
                name[m] = 'China'  # Manchuria before Manchukuo
            if cls is not None:
                c = cls[m]
                s = state[m]
                n = name[m]
                jp = (c == 1) | (c == 4)
                al = c == 2
                ne = c == 3
                # Japan's side on the page: the territory says which of Japan's states
                jst = {'thailand': 'allied-with-japan', 'indochina': 'garrisoned' if kf < '1945-03-09' else 'held'}.get(k, 'held')
                if k not in FORCED:
                    s = np.where(jp, jst, s)
                    s = np.where(al, 'allied', s)
                    s = np.where(ne & (k == 'ptimor'), 'neutral', s)
                if k in ('thailand', 'indochina'):
                    s = np.where(al, jst, s)  # no Allied army held ground here: the page's pink at the coast is the sea's
                if k == 'china':
                    n = np.where(jp, 'occupied China', 'Free China')
                if k == 'ptimor':
                    s = np.where(jp, 'held', s)
                state[m] = s
                name[m] = n
                mapped[m] = (c != 0) & (k not in FORCED)
            elif k == 'china' and kf < EVE:
                # the prologue: China, Free China once the war of 1937 has begun; occupied China is PROLOGUE's
                state[m] = 'allied'
                name[m] = 'China' if kf < '1937-07-07' else 'Free China'
            elif k == 'china':
                c = china1942[m]
                jp = (c == 1) | (c == 4)
                state[m] = np.where(jp, 'held', 'allied')
                name[m] = np.where(jp, 'occupied China', 'Free China')
        # occupied China's points and lines
        pal = (name == 'occupied China') & (state == 'held')
        # hand regions of 1942
        for st, nm, poly in HAND.get(kf, []):
            m = inside & shapely.contains_xy(poly, LON, LAT)
            state[m] = st
            name[m] = nm
        # where the record overrides the trace
        rec_src = {}
        over = np.full(LON.shape, '', dtype=object)
        # the prologue's hand regions, each with its own sources
        for r in PROLOGUE.get(kf, []):
            m = prologue_cells(r, G)
            if not m.any():
                sys.exit(f'PROLOGUE {kf} {r["name"]}: no cells')
            state[m] = r['state']
            name[m] = r['name']
            pal[m] = bool(r.get('pointsAndLines'))
            mapped[m] = False
            rec_src[r['name']] = list(r['sources'])
        for r in RECORD.get(kf, []):
            m = record_cells(r, land, LON, LAT, inside, tid, state)
            if not m.any():
                sys.exit(f'RECORD {kf} {r["name"]}: no cells')
            state[m] = r['state']
            name[m] = r['name']
            pal[m] = bool(r.get('pointsAndLines'))
            mapped[m] = False
            over[m] = r['name']
            rec_src[r['name']] = r['sources'](kf)
        # General Order No. 1
        if kf == '1945-09-02':
            ys, xs = np.nonzero(inside & np.isin(state, ['held', 'garrisoned', 'allied-with-japan', 'contested']))
            for y, x in zip(ys, xs):
                z = go1_zone(tid[y, x], LON[y, x], LAT[y, x])
                if z:
                    state[y, x] = z[0]
                    name[y, x] = f'{terrs[tid[y, x]][0]}: {z[1]}' if tid[y, x] not in ('china',) else f'China: {z[1]}'
                    if over[y, x]:
                        name[y, x] = f'{over[y, x]}: {z[1]}'
                        rec_src[name[y, x]] = rec_src[over[y, x]]
            # Manchuria, north Korea, Karafuto and the Kurils: occupied by the Soviet forces by 2 September, all in the Soviet zone
            for k in ('manchukuo',):
                m = inside & (tid == k)
                state[m] = 'zone-soviet'
                name[m] = 'Manchuria: to the Soviet Far East command'
            pal[:] = False
        feats = []
        keys = {}
        ys, xs = np.nonzero(inside & (state != ''))
        for y, x in zip(ys, xs):
            keys.setdefault((state[y, x], name[y, x], bool(pal[y, x])), []).append((y, x))
        for (st, nm, pl), cells in sorted(keys.items()):
            mask = np.zeros(LON.shape, bool)
            yy, xx = zip(*cells)
            mask[list(yy), list(xx)] = True
            g = cells_to_geom(mask, lon, lat)
            g = g.buffer(0.06, join_style='mitre').buffer(-0.06, join_style='mitre')  # the grid's steps smoothed
            g = g.intersection(landg).simplify(SIMPLIFY, preserve_topology=True)
            g = r4(g.buffer(0))
            polys = [p for p in (g.geoms if hasattr(g, 'geoms') else [g]) if isinstance(p, Polygon) and area_km2(p) >= 300]
            if not polys:
                continue
            g = MultiPolygon(polys) if len(polys) > 1 else polys[0]
            precise = 'mapped' if (leaf and mapped[mask].mean() > 0.6 and not st.startswith('zone-')) else 'schematic'
            props = {'state': st, 'name': nm, 'precision': precise}
            if pl:
                props['pointsAndLines'] = True
            props['sources'] = feature_sources(kf, st, nm, precise)
            if nm in rec_src:  # the record's own sources, before the coast's
                props['sources'] = [s for s in props['sources'] if s['id'] == 'go1-1945'] + rec_src[nm] + [{'id': 'natural-earth', 'where': '1:50m land and admin-0 countries'}]
            feats.append({'type': 'Feature', 'properties': props, 'geometry': mapping(g)})
        feats += perimeters(kf, land, ATLAS, ATLAS_WHERE, (majority, fill_unknown, cells_to_geom))
        for nm in rec_src:
            if not any(f['properties'].get('name') == nm for f in feats) and not any(f['properties'].get('name', '').startswith(nm + ': ') for f in feats):
                sys.exit(f'RECORD {kf} {nm}: no feature survived (under 300 km² once clipped to the land?)')
        fc = {'type': 'FeatureCollection', 'features': feats}
        with open(OUT + f'{kf}.geojson', 'w') as f:
            json.dump(fc, f, separators=(',', ':'), ensure_ascii=False)
        npoly = sum(1 for ft in feats if ft['properties'].get('state'))
        nverts = sum(len(shapely.get_coordinates(shape(ft['geometry']))) for ft in feats)
        stats[kf] = (npoly, len(feats) - npoly, nverts)
        print(kf, 'polygon features', npoly, 'perimeters', len(feats) - npoly, 'vertices', nverts)
    json.dump(stats, open(VIEW + 'fronts-stats.json', 'w'))


def atlas_grid(leaf, LON, LAT, inside):
    """the page's classes on the grid's land cells (0 off the page), cleaned and filled"""
    c = np.zeros(LON.shape, np.int8)
    ys, xs = np.nonzero(inside)
    # the page's map frame, less the binding's shadow at its right edge
    c[ys, xs] = classify_leaf(leaf, LON[ys, xs], LAT[ys, xs], region=(30, 2300, 300, 2735))
    on = np.zeros(LON.shape, bool)
    on[ys, xs] = True
    page = c != 0
    c = majority(c, page, r=1)
    c = fill_unknown(c, inside & near(page, 6))
    return c


def near(m, r):
    out = m.copy()
    for _ in range(r):
        out = out | np.roll(out, 1, 0) | np.roll(out, -1, 0) | np.roll(out, 1, 1) | np.roll(out, -1, 1)
    return out


def feature_sources(kf, st, nm, precise):
    if kf < EVE:
        return prologue_sources(kf, st, nm) + [{'id': 'natural-earth', 'where': '1:50m land and admin-0 countries'}]
    leaf = ATLAS.get(kf)
    src = []
    if leaf:
        src.append({'id': 'atlas-battle-fronts-1945', 'where': ATLAS_WHERE[kf]})
    else:
        src.append({'id': 'atlas-battle-fronts-1945', 'where': 'p. 4, the period ending 1 July 1943: occupied China'} if 'China' in nm else {'id': 'morton-1962', 'where': 'Maps I and 9'})
    if st.startswith('zone-'):
        src = [{'id': 'go1-1945', 'where': 'paragraph 1 (a)–(e)'}] + src
    src.append({'id': 'natural-earth', 'where': '1:50m land and admin-0 countries'})
    return src


ATLAS_WHERE = {
    '1943-11-01': 'p. 20, the period ending 1 November 1943',
    '1944-08-15': 'p. 58, the period ending 15 August 1944',
    '1945-01-15': 'p. 78, the period ending 15 January 1945',
    '1945-07-01': 'p. 98, the period to 1 July 1945',
    '1945-09-02': 'p. 100, the period to 1 August 1945',
}




if __name__ == '__main__':
    build()
