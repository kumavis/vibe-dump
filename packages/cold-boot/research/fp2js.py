#!/usr/bin/env python3
"""Convert a researched floorplan JSON into packages/cold-boot/src/floorplan.js.

usage (from packages/cold-boot): python3 research/fp2js.py research/floorplan.json src/floorplan.js

Renames blocks to the canonical ids the walkthrough content uses and adds the
mirror flags implied by the research notes (bottom-row P-cores are the top-row
layout rotated 180 degrees, and so are the bottom E-clusters). Drops the
blocks the reconciled floorplan keeps only as containers or placeholders.
"""
import json
import sys

src, dst = sys.argv[1], sys.argv[2]
d = json.load(open(src))

RENAME = {
    'ddr_phy': 'ddrphy',
    'dmi_phy': 'dmi',
    'pcie5_phy': 'pcie5',
    'pcie4_phy': 'pcie4',
    'system_agent': 'sa',
}
for n in range(4):
    RENAME[f'ecluster{n}'] = f'ecl{n}'
    RENAME[f'ecore_cluster{n}'] = f'ecl{n}'


def rid(i):
    return RENAME.get(i, i)


def r4(v):
    return round(float(v), 4)


# 'pcu' is a low-confidence placeholder identical to the System Agent box, and
# 'ring_band' is the union of the ring_* stops; neither adds anything to draw.
DROP = {'pcu', 'ring_band'}
blocks = []
for b in d['blocks']:
    if b['id'] in DROP:
        continue
    nb = {
        'id': rid(b['id']),
        'kind': b['kind'],
        'label': b['label'],
        'x': r4(b['x']), 'y': r4(b['y']), 'w': r4(b['w']), 'h': r4(b['h']),
        'confidence': b.get('confidence', ''),
    }
    if b.get('lanes'):
        nb['lanes'] = b['lanes']
    if b.get('units'):
        nb['units'] = b['units']
    if b.get('parent'):
        nb['parent'] = rid(b['parent'])
    if b.get('children_tile') is not None:
        nb['children_tile'] = b['children_tile']
    # notched blocks: their outline as rects (normalized x,y,w,h) — the rect
    # above stays the bounding box
    if b.get('outline_rects'):
        nb['outline_rects'] = [[r4(v) for v in r] for r in b['outline_rects']]
    i = nb['id']
    if i.startswith('pcore') and int(i[5:]) >= 4:
        nb['mirror'] = {'x': True, 'y': True}
    if i in ('ecl2', 'ecl3'):
        nb['mirror'] = {'x': True, 'y': True}
    blocks.append(nb)

ci = d.get('core_internals', {})


def poly_rects(poly):
    """Rectilinear polygon -> rects [x, y, w, h]: horizontal bands, merged where equal."""
    ys = sorted(set(p[1] for p in poly))
    edges = [(poly[i], poly[(i + 1) % len(poly)]) for i in range(len(poly))]
    vert = [(a[0], min(a[1], b[1]), max(a[1], b[1])) for a, b in edges if a[0] == b[0] and a[1] != b[1]]
    bands = []
    for y0, y1 in zip(ys, ys[1:]):
        xs = sorted(x for x, lo, hi in vert if lo < (y0 + y1) / 2 < hi)
        iv = [(xs[i], xs[i + 1]) for i in range(0, len(xs) - 1, 2)]
        if bands and bands[-1][2] == iv and bands[-1][1] == y0:
            bands[-1][1] = y1
        else:
            bands.append([y0, y1, iv])
    return [[r4(x0), r4(y0), r4(x1 - x0), r4(y1 - y0)] for y0, y1, iv in bands for x0, x1 in iv]


def subs(lst):
    out = []
    for s in lst or []:
        o = {k: (r4(v) if k in 'xywh' and len(k) == 1 else v) for k, v in s.items() if k in ('id', 'label', 'x', 'y', 'w', 'h', 'kind')}
        if s.get('outline'):
            o['outline_rects'] = poly_rects(s['outline'])
        out.append(o)
    return out


ring = d.get('ring', {})
stops = []
for s in ring.get('stops', []):
    serves = [rid(x) for x in s.get('serves', []) if x not in DROP]
    stops.append({'id': s['id'], 'x': r4(s['x']), 'y': r4(s['y']), 'serves': serves})
stops.sort(key=lambda s: next((t.get('order', 0) for t in ring.get('stops', []) if t['id'] == s['id']), 0))
fp = {
    'chip': d['chip'],
    'die_mm': d['die_mm'],
    'area_mm2': d.get('area_mm2'),
    'blocks': blocks,
    'core_internals': {'pcore': subs(ci.get('pcore')), 'ecore_cluster': subs(ci.get('ecore_cluster'))},
    'ring': {'path': [[r4(x), r4(y)] for x, y in ring.get('path', [])], 'closed': True, 'stops': stops},
}
# Packet wiring and how the die is mounted: from the research JSON (ports
# renamed to app ids), or from an extra JSON given as the third argument,
# which wins (it is where the app-side fields such as each exit's board bus live).
if d.get('wiring'):
    # (the research notes on each node stay in the research JSON)
    w = {k: v for k, v in d['wiring'].items() if k in ('nodes', 'edges', 'ports', 'exits')}
    w['ports'] = {rid(k): v for k, v in (w.get('ports') or {}).items() if k not in DROP}
    fp['wiring'] = w
if d.get('mounting'):
    fp['mounting'] = {k: v for k, v in d['mounting'].items() if k in ('mirrored', 'note', 'die_center_offset_mm')}
if len(sys.argv) > 3:
    fp.update(json.load(open(sys.argv[3])))
if fp['ring']['path'] and fp['ring']['path'][0] == fp['ring']['path'][-1]:
    fp['ring']['path'] = fp['ring']['path'][:-1]

sources = d.get('sources', [])
header = '''// The Raptor Lake-S 8P+16E (Core i9-13900K) die floorplan, measured block by
// block on Fritzchens Fritz's CC0 die photograph and checked by overlaying the
// blocks back onto it, then audited block by block a second time with every
// correction verified independently. Coordinates are fractions of the die (x
// across the long edge from the PCIe/DMI side, y down from the DDR PHY edge) —
// the photograph's frame, i.e. the die seen from its transistor side. Notched
// blocks carry `outline_rects` (x/y/w/h stays the block's core rectangle, which
// a notch or a corner piece can reach past). `wiring` is
// the graph packets travel; `mounting` says how the die sits in the socket.
//
// GENERATED from research/floorplan.json by research/fp2js.py: edit that and
// regenerate (research/FLOORPLAN.md says how it was measured).
//
// Sources:
''' + ''.join(f'//   {s.get("what", "")[:110]}\n//     {s.get("url", "")} ({s.get("license", "")})\n' for s in sources) + '\n'
open(dst, 'w').write(header + 'export const FLOORPLAN = ' + json.dumps(fp, indent=1, ensure_ascii=False) + '\n')
print('blocks', len(blocks), 'stops', len(stops), 'pcore subs', len(fp['core_internals']['pcore']), 'ecl subs', len(fp['core_internals']['ecore_cluster']))
