# Draw the fronts' keyframes as a contact sheet to look at (equirectangular, the table's colours, hatched
# points-and-lines, perimeters in red, declared lines in sand), from FRONTS_OUT (default public/data/fronts)
# to FRONTS_VIEW/fronts.png, or to --out. --bbox=w,s,e,n and --k=<px per degree> draw one place up close.
#
#   python3 -I tools/fronts/preview.py [keyframe ...] [--bbox=149.5,-7,156.5,-2] [--k=60] [--out=x.png]
import sys, json, glob
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from paths import OUT, VIEW
from PIL import Image, ImageDraw
COL = {'held': (170, 58, 46), 'garrisoned': (190, 104, 70), 'allied-with-japan': (200, 146, 72), 'contested': (196, 120, 88), 'allied': (84, 124, 178),
       'neutral': (150, 150, 146), 'soviet': (150, 84, 118), 'zone-cks': (176, 150, 84), 'zone-soviet': (150, 84, 118), 'zone-seac': (104, 146, 108),
       'zone-cincpac': (104, 150, 190), 'zone-swpa': (86, 110, 160)}
opt = {a[2:].split('=', 1)[0]: a.split('=', 1)[1] for a in sys.argv[1:] if a.startswith('--') and '=' in a}
args = [a for a in sys.argv[1:] if not a.startswith('--')]
BW, BS, BE, BN = map(float, opt['bbox'].split(',')) if 'bbox' in opt else (75.0, -45.0, 210.0, 60.0)
W0, N0, K = BW, BN, float(opt.get('k', 4.0))  # px per degree
WW, HH = int((BE - W0) * K), int((N0 - BS) * K)
px = lambda c: ((c[0] - W0) * K, (N0 - c[1]) * K)
lines = json.load(open(OUT + 'lines.geojson')) if glob.glob(OUT + 'lines.geojson') else {'features': []}
tiles = []
kfs = args or [p.split('/')[-1][:10] for p in sorted(glob.glob(OUT + '19*.geojson'))]
for kf in kfs:
    fc = json.load(open(OUT + f'{kf}.geojson'))
    im = Image.new('RGB', (WW, HH), (215, 225, 232))
    d = ImageDraw.Draw(im)
    for f in fc['features']:
        p = f['properties']
        g = f['geometry']
        if p.get('state'):
            polys = [g['coordinates']] if g['type'] == 'Polygon' else g['coordinates']
            for poly in polys:
                d.polygon([px(c) for c in poly[0]], fill=COL.get(p['state'], (255, 0, 255)), outline=(40, 40, 40))
                for h in poly[1:]:
                    d.polygon([px(c) for c in h], fill=(215, 225, 232))
                if p.get('pointsAndLines'):
                    xs = [px(c)[0] for c in poly[0]]
                    ys = [px(c)[1] for c in poly[0]]
                    mask = Image.new('L', (WW, HH), 0)
                    ImageDraw.Draw(mask).polygon([px(c) for c in poly[0]], fill=255)
                    hat = Image.new('L', (WW, HH), 0)
                    hd = ImageDraw.Draw(hat)
                    for k in range(-HH, WW, max(7, int(K / 2))):
                        hd.line([(k, 0), (k + HH, HH)], fill=255, width=1)
                    im.paste((90, 20, 10), (0, 0), Image.fromarray(__import__('numpy').minimum(__import__('numpy').asarray(mask), __import__('numpy').asarray(hat))))
    for f in fc['features']:
        if f['properties'].get('kind') == 'perimeter':
            g = f['geometry']
            ls = [g['coordinates']] if g['type'] == 'LineString' else g['coordinates']
            for l in ls:
                d.line([px(c) for c in l], fill=(220, 30, 20), width=2)
    for f in lines['features']:
        p = f['properties']
        if p['from'] <= kf <= p['to']:
            d.line([px(c) for c in f['geometry']['coordinates']], fill=(230, 180, 60), width=2)
    d.text((6, 6), kf, fill=(0, 0, 0))
    tiles.append(im)
cols = int(opt.get('cols', 2))
sheet = Image.new('RGB', (cols * WW, ((len(tiles) + cols - 1) // cols) * HH), 'white')
for i, t in enumerate(tiles):
    sheet.paste(t, ((i % cols) * WW, (i // cols) * HH))
sheet.save(opt.get('out') or VIEW + 'fronts.png')
print(sheet.size)
