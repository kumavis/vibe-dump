"""Refinements of correspondences.py.
(a) restrict to PPN/PNP-level protoforms (POLLEX writes PCE/PEP *h for the merger of PPN *s and *h);
(b) conditioning of *f in Māori/Tahitian/Hawaiian by following vowel;
(c) whole-word regularity: share of aligned Hawaiian reflexes whose every onset is the textbook reflex;
(d) list the Hawaiian irregulars (for doublet / borrowing analysis).
"""
import collections, json
from common import *

d = load_pollex()
EXPECT_HAW = {'p': 'p', 't': 'k', 'k': 'ʔ', 'q': 'Ø', 'm': 'm', 'n': 'n', 'ŋ': 'n', 'f': 'h', 's': 'h',
              'h': 'Ø', 'w': 'w', 'l': 'l', 'r': 'l', 'Ø': 'Ø', 'v': 'w'}
LANGS = ['Hawaiian', 'Maori', 'Tahitian', 'Samoan', 'Tongan']

def aligned(x, L):
    pu = clean_strict(x['proto_ng'], 'proto')
    if not pu:
        return None, []
    forms = [f.strip() for f in x['haw_raw'].split(',')] if L == 'Hawaiian' else [f for f, g in x['cognates'][L]]
    out = []
    for f in forms:
        u = clean_strict(f, L)
        if u and len(u) == len(pu):
            out.append((f, u))
    return pu, out

out = []
# (a) PPN-level only, *h and *s
for level_set, label in [({'PPN', 'PNP'}, 'PPN+PNP'), ({'PCE', 'PEP', 'PMQ', 'PTA', 'PEC'}, 'PCE and below')]:
    c = {L: collections.defaultdict(collections.Counter) for L in LANGS}
    seen = set()
    for x in d:
        if x['level'] not in level_set:
            continue
        for L in LANGS:
            pu, al = aligned(x, L)
            for f, u in al:
                if (x['pollex_id'], L, f) in seen:
                    continue
                seen.add((x['pollex_id'], L, f))
                for (po, _), (ro, _) in zip(pu, u):
                    c[L][po or 'Ø'][ro or 'Ø'] += 1
    out.append(f'\n### {label}: *h and *s\n')
    for P in ['h', 's', 'f', 'k', 'ŋ']:
        out.append(f'- *{P}: ' + ' | '.join(f"{L}: " + ', '.join(f'{r} {v}' for r, v in c[L][P].most_common(4)) for L in LANGS))

# (b) *f conditioning by following vowel
out.append('\n### *f by following vowel (PPN+PNP rows)\n')
for L in ['Hawaiian', 'Maori', 'Tahitian']:
    cc = collections.defaultdict(collections.Counter)
    seen = set()
    for x in d:
        if x['level'] not in {'PPN', 'PNP'}:
            continue
        pu, al = aligned(x, L)
        for f, u in al:
            if (x['pollex_id'], L, f) in seen:
                continue
            seen.add((x['pollex_id'], L, f))
            for (po, pv), (ro, rv) in zip(pu, u):
                if po == 'f':
                    cc[pv][ro or 'Ø'] += 1
    out.append(f'- {L}: ' + '; '.join(f"_{v}: " + ', '.join(f'{r} {n}' for r, n in cc[v].most_common()) for v in 'aeiou'))

# (c) whole-word regularity for Hawaiian
reg = 0; irr = []; tot = 0
seen = set()
for x in d:
    pu, al = aligned(x, 'Hawaiian')
    for f, u in al:
        if (x['pollex_id'], f) in seen:
            continue
        seen.add((x['pollex_id'], f))
        tot += 1
        bad = [(po or 'Ø', ro or 'Ø') for (po, _), (ro, _) in zip(pu, u) if EXPECT_HAW.get(po or 'Ø') != (ro or 'Ø')]
        # PCE-level *h may be PPN *s -> Hawaiian h; accept h for *h at PCE and below
        if x['level'] not in {'PPN', 'PNP'}:
            bad = [b for b in bad if b != ('h', 'h')]
        badv = [(pv, rv) for (_, pv), (_, rv) in zip(pu, u) if pv != rv]
        if not bad and not badv:
            reg += 1
        else:
            irr.append({'haw': to_okina(f), 'proto': x['proto_ng'], 'level': x['level'], 'cons': bad, 'vow': badv,
                        'flags': x['haw_flags'], 'gloss': x['haw_gloss'][:60]})
out.append(f'\n### Whole-word regularity (Hawaiian)\n\n{reg}/{tot} = {100*reg/tot:.1f}% of aligned Hawaiian reflexes are '
           'fully regular (every onset the textbook reflex, every vowel identical).')
kinds = collections.Counter()
for r in irr:
    for b in r['cons']:
        kinds['C ' + '>'.join(b)] += 1
    for b in r['vow']:
        kinds['V ' + '>'.join(b)] += 1
out.append('Most common irregularities: ' + ', '.join(f'{k} ({v})' for k, v in kinds.most_common(20)))
json.dump(irr, open(f'{OUT}/hawaiian_irregulars.json', 'w'), ensure_ascii=False, indent=1)
txt = '\n'.join(out)
open(f'{OUT}/correspondences2.md', 'w').write(txt)
print(txt)
