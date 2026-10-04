"""Commutation analysis inside the closed grids.

Each cell = (form, features, morph segmentation).  The segmentation is my analysis;
sources supporting it are cited in NOTES.md (Alexander §35-37, Wilson 1980 §3.5.4,
Wiktionary etymologies, POLLEX protoforms).

For every pair of attested cells that differ in exactly ONE feature, record which
morph slot(s) differ and how.  A feature opposition is *proportional* to the degree
that the same expression difference recurs for the same pair of feature values
(a : b :: c : d).  Output: tables/grids.txt
"""
import os, itertools, collections
import common

HERE = common.HERE

PRON = [  # form, {person, number}, morphs (stem, number-suffix)
    ('kāua', {'person': '1in', 'number': 'du'}, ('kā', 'ua')),
    ('māua', {'person': '1ex', 'number': 'du'}, ('mā', 'ua')),
    ('ʻolua', {'person': '2', 'number': 'du'}, ('ʻo', 'lua')),
    ('lāua', {'person': '3', 'number': 'du'}, ('lā', 'ua')),
    ('kākou', {'person': '1in', 'number': 'pl'}, ('kā', 'kou')),
    ('mākou', {'person': '1ex', 'number': 'pl'}, ('mā', 'kou')),
    ('ʻoukou', {'person': '2', 'number': 'pl'}, ('ʻou', 'kou')),
    ('lākou', {'person': '3', 'number': 'pl'}, ('lā', 'kou')),
    ('au', {'person': '1', 'number': 'sg'}, ('au', '')),
    ('ʻoe', {'person': '2', 'number': 'sg'}, ('ʻoe', '')),
    ('ia', {'person': '3', 'number': 'sg'}, ('ia', '')),
]
POSS = []  # onset, class vowel, person suffix
for onset, oc in (('Ø', ''), ('k', 'k'), ('n', 'n')):
    for cls, v1, v23 in (('a', 'a', 'ā'), ('o', 'o', 'o')):
        for person, suf in (('1', 'ʻu'), ('2', 'u'), ('3', 'na')):
            v = v1 if person == '1' else v23
            POSS.append((oc + v + suf, {'onset': onset, 'class': cls, 'person': person}, (onset, v, suf)))
POSS += [('kuʻu', {'onset': 'k', 'class': 'neutral', 'person': '1'}, ('k', 'u', 'ʻu')),
         ('kō', {'onset': 'k', 'class': 'neutral', 'person': '2'}, ('k', 'ō', ''))]
DEIX = [  # series prefix, deictic root ; only cells attested in P&E (POLLEX) or Lyon 2018
    ('kēia', {'series': 'kē', 'col': '1'}, ('kē', 'ia')),
    ('kēnā', {'series': 'kē', 'col': '2'}, ('kē', 'nā')),
    ('kēlā', {'series': 'kē', 'col': '3'}, ('kē', 'lā')),
    ('pēia', {'series': 'pē', 'col': '1'}, ('pē', 'ia')),
    ('penei', {'series': 'pē', 'col': '1b'}, ('pe', 'nei')),
    ('pēnā', {'series': 'pē', 'col': '2'}, ('pē', 'nā')),     # P&E "rare", E&P "obsolete"
    ('pēlā', {'series': 'pē', 'col': '3'}, ('pē', 'lā')),
    ('pehea', {'series': 'pē', 'col': 'Q'}, ('pe', 'hea')),
    ('nei', {'series': 'post', 'col': '1b'}, ('', 'nei')),
    ('nā', {'series': 'post', 'col': '2'}, ('', 'nā')),        # E&P 1979:112 "probably obsolete"
    ('lā', {'series': 'post', 'col': '3'}, ('', 'lā')),
    ('hea', {'series': 'post', 'col': 'Q'}, ('', 'hea')),
    ('eia', {'series': 'pres', 'col': '1'}, ('e', 'ia')),
    ('aia', {'series': 'pres', 'col': '3?'}, ('a', 'ia')),
    ('ʻaneʻi', {'series': 'loc', 'col': '1b'}, ('ʻa', 'neʻi')),
    ('ʻanā', {'series': 'loc', 'col': '2'}, ('ʻa', 'nā')),
    ('ʻoneʻi', {'series': 'loc-o', 'col': '1b'}, ('ʻo', 'neʻi')),   # Niʻihau / Nakuina 1902
    ('ʻonā', {'series': 'loc-o', 'col': '2'}, ('ʻo', 'nā')),         # Nakuina 1902 via Lyon n.7
]


def analyse(name, cells, out):
    out.append(f'\n=== {name}: {len(cells)} cells')
    feats = list(cells[0][1].keys())
    by = collections.defaultdict(list)
    for (f1, d1, m1), (f2, d2, m2) in itertools.combinations(cells, 2):
        diff = [k for k in feats if d1[k] != d2[k]]
        if len(diff) != 1:
            continue
        k = diff[0]
        slots = tuple(i for i in range(len(m1)) if m1[i] != m2[i])
        vals = tuple(sorted([d1[k], d2[k]]))
        a, b = (m1, m2) if d1[k] == vals[0] else (m2, m1)
        expr = ' / '.join(f'{a[i] or "Ø"}~{b[i] or "Ø"}' for i in slots) if slots else '(same)'
        by[(k, vals)].append((f1, f2, slots, expr))
    tot = prop = 0
    for (k, vals), lst in sorted(by.items()):
        ex = collections.Counter(e for *_, e in lst)
        modal, n = ex.most_common(1)[0]
        tot += len(lst)
        prop += n
        out.append(f'  {k} {vals[0]}:{vals[1]}  pairs {len(lst)}  modal expression [{modal}] x{n}  '
                   f'others {dict((e, c) for e, c in ex.items() if e != modal)}')
        for f1, f2, slots, e in lst:
            out.append(f'       {f1} : {f2}   slot {slots}  {e}')
    out.append(f'  ONE-FEATURE PAIRS {tot}; carrying the modal expression difference for their feature-value pair: '
               f'{prop} ({100*prop/tot:.0f}%)')
    return tot, prop


def main():
    out = []
    analyse('pronouns, non-singular (8 cells)', PRON[:8], out)
    analyse('pronouns, all 11', PRON, out)
    analyse('possessive grid, 18 regular cells', POSS[:18], out)
    analyse('possessive grid + kuʻu, kō', POSS, out)
    analyse('deixis', DEIX, out)
    open(os.path.join(HERE, 'tables', 'grids.txt'), 'w').write('\n'.join(out) + '\n')
    print('\n'.join(l for l in out if not l.startswith('       ')))


if __name__ == '__main__':
    main()
