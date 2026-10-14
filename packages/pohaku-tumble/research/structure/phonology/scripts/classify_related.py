#!/usr/bin/env python3
"""Hand classification (by me, from the glosses and Wiktionary etymologies shown
in minpairs.tsv) of every Wiktionary content-word minimal pair that the
automatic test flagged as related (shared gloss stem, tf-idf cos >= .25, shared
POLLEX etymon, or a Wiktionary cross-link).  Categories:
  PROP    proportional morphology: same expression difference = same content
          difference across a series (plural by vowel lengthening)
  LEN1    one-off derivation by lengthening (Wiktionary: "emphatic form")
  AFFIX   the pair straddles an affix/compound/clipping boundary or a prefix
          variant (not a phonological opposition)
  VAR     variant / doublet: the two forms mean (nearly) the same thing - the
          segment change carries NO content difference
  SPLIT   one etymon (per Wiktionary/POLLEX), meanings since diverged
  FIELD   chance: same lexical field / one shared gloss word, no relation
          asserted by any source (incl. possible but unverified root variants)
  DATA    artefact of the sources
"""
import os, csv, collections
HERE = os.path.dirname(os.path.abspath(__file__))
C = {}
for p in ['kahiko/kāhiko', 'kahuna/kāhuna', 'kaikamahine/kaikamāhine', 'kanaka/kānaka', 'luahine/luāhine', 'makua/mākua',
          'makuahine/mākuahine', 'wahine/wāhine', 'ʻaumakua/ʻaumākua', 'ʻelemakule/ʻelemākule', 'kupuna/kūpuna']:
    C[p] = 'PROP'
C['nauki/nāuki'] = 'LEN1'
for p in ['kuhi/kuhia', 'niho/nihoa', 'wai/waiū', 'aliʻi/liʻi', 'lono/lonoā', 'kāʻalo/māʻalo', 'mālualua/ʻālualua',
          'ʻāpikipiki/ʻōpikipiki', 'holoholo/hoʻoholo', 'kāne/ʻāne']:
    C[p] = 'AFFIX'
for p in ['hākiʻi/nākiʻi', 'hīkiʻi/nīkiʻi', 'hākiʻi/hīkiʻi', 'nākiʻi/nīkiʻi', 'mūkiʻi/pūkiʻi', 'huaʻi/puaʻi', 'luaʻi/puaʻi',
          'kāhei/kāʻei', 'kāʻai/kāʻei', 'kāʻai/kōʻai', 'pōhai/pōʻai', 'kōʻai/pōʻai', 'ʻali/ʻeli', 'ʻaki/ʻali', 'lomi/lumi',
          'moku/muku', 'walu/waʻu', 'nene/neʻe', 'lawe/ʻawe', 'kaha/kahi', 'henua/honua', 'lepa/lepe', 'kikī/kīkī',
          'male/wale', 'ākala/ʻākala', 'alani/ʻalani', 'lehu/ʻehu']:
    C[p] = 'VAR'
for p in ['ʻona/ʻono', 'mele/meli', 'pua/puna']:
    C[p] = 'SPLIT'
for p in ['hāʻuke/hāʻule', 'ai/wai']:
    C[p] = 'DATA'
rows = list(csv.DictReader(open(os.path.join(HERE, 'minpairs.tsv')), delimiter='\t'))
flag = [r for r in rows if r['gloss_overlap'] == '1' or r['shared_pollex_id'] == '1' or r['link'] == '1' or float(r['cos']) >= 0.25]
fam_tot = collections.Counter(r['family'] for r in rows)
tab = collections.defaultdict(collections.Counter)
out = []
for r in flag:
    key = r['a'] + '/' + r['b']
    cat = C.get(key, 'FIELD')
    tab[r['family']][cat] += 1
    out.append((key, r['opposition'], r['family'], cat))
with open(os.path.join(HERE, 'related_pairs_classified.tsv'), 'w') as fh:
    fh.write('pair\topposition\tfamily\tcategory\n')
    for o in out:
        fh.write('\t'.join(o) + '\n')
cats = ['PROP', 'LEN1', 'AFFIX', 'VAR', 'SPLIT', 'FIELD', 'DATA']
print(f'flagged {len(flag)} of {len(rows)} minimal pairs')
print('| family | all pairs | flagged | ' + ' | '.join(cats) + ' | unrelated |')
print('|---|---|---|' + '---|' * len(cats) + '---|')
tot = collections.Counter()
for fam in sorted(fam_tot, key=lambda f: -fam_tot[f]):
    n = fam_tot[fam]; fl = sum(tab[fam].values())
    tot.update(tab[fam])
    print(f'| {fam} | {n} | {fl} | ' + ' | '.join(str(tab[fam][c]) for c in cats) + f' | {n - fl} |')
print(f'| **all** | {len(rows)} | {len(flag)} | ' + ' | '.join(str(tot[c]) for c in cats) + f' | {len(rows) - len(flag)} |')
unknown = [k for k in C if k not in {o[0] for o in out}]
print('classified keys not found among flagged pairs:', unknown)
