#!/usr/bin/env python3
"""nezu-fanghu — the décor TRACED off the developed photographs, previewed over them.

    python3 reference/nezu-fanghu/trace.py [zone …]       (default: every faces/dev-*.trace.json)

Coordinates everywhere: DEVELOPED body coordinates (s, y) — s = mm along the section from the side's centre line
(left → right seen from outside), y = vessel height in mm. faces/dev-<zone>.jpg is photo-08 resampled onto the
model's own surface through the assumed camera (.work/r8-fanghu/solve/develop.py), so a point read off it lands on
the same spot of the model, and src/artifacts/nezu-fanghu/decor.js imports faces/dev-<zone>.trace.json as is.

The Western Zhou ribbon style (photo-08): the surface is ONE broad flat level — straps, field and bird alike — and
the drawing is CUT into it: wide channels with rounded shoulders separate fat flat ribbons (the bird's crest, body,
wing and tail plumes), a few hollows are cut deeper and packed with fine spirals (leiwen), the eyes are round bosses.

faces/dev-<zone>.trace.json:
  { "frame": [s0, y0, s1, y1] (the developed image's extent), "ppmm": its px/mm,
    "channels": [{ "line": [[s, y]…], "w": mm (channel width at the surface), "d": mm depth (optional) }],
    "hollows":  [{ "poly": [[s, y]…], "d": mm }]       cut flat-bottomed recesses (leiwen packed in them when "leiwen": true)
    "raised":   [{ "poly": [[s, y]…], "h": mm }]       the few things that stand proud (frames, ridges)
    "bosses":   [{ "c": [s, y], "r": mm }] }
Writes .work/r8-fanghu/trace/dev-<zone>.png: the developed photo ×2 with a 5/10 mm grid, channels in magenta,
hollows in cyan, raised in yellow, bosses in green. Every input and output carries no metadata.
"""
import json, os, sys
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', '..', '.work', 'r8-fanghu', 'trace')


def run(zone, k=2):
    H = json.load(open(os.path.join(HERE, 'faces', f'dev-{zone}.trace.json')))
    fr, pp = H['frame'], H['ppmm']
    im = Image.open(os.path.join(HERE, 'faces', f'dev-{zone}.jpg')).convert('RGB')
    im = im.resize((im.size[0] * k, im.size[1] * k))
    d = ImageDraw.Draw(im)
    P = lambda p: ((p[0] - fr[0]) * pp * k, (fr[3] - p[1]) * pp * k)
    for gy in range(int(fr[1]) + 1, int(fr[3]) + 1):
        if gy % 5 == 0:
            y = P((0, gy))[1]; d.line([(0, y), (im.size[0], y)], fill=(255, 60, 60) if gy % 10 == 0 else (110, 40, 40))
            if gy % 10 == 0: d.text((3, y - 12), str(gy), fill=(255, 255, 0))
    for gx in range(int(fr[0]) + 1, int(fr[2]) + 1):
        if gx % 5 == 0:
            x = P((gx, 0))[0]; d.line([(x, 0), (x, im.size[1])], fill=(60, 160, 255) if gx % 10 == 0 else (40, 70, 120))
            if gx % 10 == 0: d.text((x + 2, 3), str(gx), fill=(255, 255, 0))
    for h in H.get('hollows', []):
        d.line([P(q) for q in h['poly']] + [P(h['poly'][0])], fill=(0, 255, 255), width=2)
    for h in H.get('raised', []):
        d.line([P(q) for q in h['poly']] + [P(h['poly'][0])], fill=(255, 230, 0), width=2)
    for c in H.get('channels', []):
        w = max(1, int(c.get('w', 1.6) * pp * k * 0.5))
        d.line([P(q) for q in c['line']], fill=(255, 0, 255), width=w, joint='curve')
    for b in H.get('bosses', []):
        cx, cy = P(b['c']); r = b['r'] * pp * k
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(0, 255, 0), width=2)
    os.makedirs(OUT, exist_ok=True)
    im.save(os.path.join(OUT, f'dev-{zone}.png'))
    n = sum(len(c['line']) for c in H.get('channels', []))
    print(f'{zone}: {len(H.get("channels", []))} channels ({n} points), {len(H.get("hollows", []))} hollows, {len(H.get("bosses", []))} bosses')


if __name__ == '__main__':
    zones = sys.argv[1:] or sorted(f[4:-11] for f in os.listdir(os.path.join(HERE, 'faces')) if f.startswith('dev-') and f.endswith('.trace.json'))
    for z in zones:
        run(z)
