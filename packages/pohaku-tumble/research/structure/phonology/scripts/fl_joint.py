#!/usr/bin/env python3
"""One table per opposition: minimal pairs in Wiktionary content words (W),
in POLLEX/P&E forms (P), share of W pairs with a shared gloss stem, Hockett FL.
Vowel-quality rows pool short-short and long-long pairs; length rows per vowel."""
import csv, json, os, collections
HERE = os.path.dirname(os.path.abspath(__file__))
W = list(csv.DictReader(open(os.path.join(HERE, 'minpairs.tsv')), delimiter='\t'))
P = list(csv.DictReader(open(os.path.join(HERE, 'pollex_minpairs.tsv')), delimiter='\t'))
fl = json.load(open(os.path.join(HERE, 'fl.json')))
flr = {r[0]: (r[1], r[2]) for r in fl['rows']}
def key(op):
    if op.startswith('VQː:'):
        return 'VQ:' + op[4:]
    return op
wc = collections.Counter(key(r['opposition']) for r in W)
wg = collections.Counter(key(r['opposition']) for r in W if r['gloss_overlap'] == '1')
pc = collections.Counter(key(r['opposition']) for r in P)
def flname(op):
    if op == 'DEL:ʻ/Ø': return 'ʻokina vs Ø (delete ʻ)'
    if op == 'DEL:h/Ø': return 'h vs Ø'
    if op.startswith('LEN:'):
        v = op[4]; return f'length {v}/{dict(zip("aeiou","āēīōū"))[v]}'
    if op.startswith('C:'):
        x, y = op[2:].split('/')
        for n in (f'C {x}/{y}', f'C {y}/{x}'):
            if n in flr: return n
    if op.startswith('VQ:'):
        x, y = op[3:].split('/')
        for n in (f'V {x}/{y} (short+long)', f'V {y}/{x} (short+long)'):
            if n in flr: return n
    return None
ops = sorted(set(wc) | set(pc), key=lambda o: -(wc[o] + pc[o]))
print('| opposition | W content pairs | of which share a gloss stem | P (P&E via POLLEX) pairs | Hockett FL, all tokens | FL, content tokens |')
print('|---|---|---|---|---|---|')
for o in ops:
    if o.startswith('VQ+LEN') or o == 'C~V':
        continue
    n = flname(o)
    a, c = flr.get(n, (None, None)) if n else (None, None)
    fa = f'{100*a:.2f}%' if a is not None else '–'
    fc = f'{100*c:.2f}%' if c is not None else '–'
    print(f'| {o} | {wc[o]} | {wg[o]} | {pc[o]} | {fa} | {fc} |')
tot_len_w = sum(v for k, v in wc.items() if k.startswith('LEN')); tot_len_p = sum(v for k, v in pc.items() if k.startswith('LEN'))
print(f'| LEN (all five) | {tot_len_w} | {sum(v for k,v in wg.items() if k.startswith("LEN"))} | {tot_len_p} | {100*flr["vowel length (all five)"][0]:.2f}% | {100*flr["vowel length (all five)"][1]:.2f}% |')
