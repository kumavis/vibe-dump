"""(1) Regular sound correspondences Hawaiian : Māori : Tahitian : Samoan : Tongan, via POLLEX.

Method
- For every POLLEX row (2,258 Hawaiian reflexes), take the protoform (proto_ng, morpheme hyphens removed)
  and each reflex: Hawaiian (haw_raw, comma-split) and each cognate form in the 4 comparison languages.
- STRICT forms only: letters of the language's alphabet, no slash (POLLEX's mark for non-cognate material),
  no brackets, spaces, accents (old-source spellings) or clusters.
- Tokenize into (C)V units. Pair a reflex with the protoform only when both have the same number of
  vowel units (long vowels = 2), then align onsets and vowels position by position.
- Count proto segment -> reflex segment.  'Ø' = no onset.
- Regularity of a proto phoneme in a language = share of its aligned tokens that show the modal reflex.
- Dedup: one count per (pollex_id, language, reflex form) so a protoform cited twice is not double counted.
"""
import collections, csv, json
from common import *

LANGS = ['Hawaiian', 'Maori', 'Tahitian', 'Samoan', 'Tongan']
d = load_pollex()

cons_counts = {L: collections.defaultdict(collections.Counter) for L in LANGS}
vow_counts = {L: collections.Counter() for L in LANGS}
examples = {L: collections.defaultdict(list) for L in LANGS}
pairs_used = collections.Counter(); pairs_skipped = collections.Counter()
seen = set()
# per-row per-position tuples for cross-language sets
pos_tuples = collections.defaultdict(collections.Counter)

for x in d:
    pu = clean_strict(x['proto_ng'], 'proto')
    if not pu:
        continue
    refl = {'Hawaiian': [f.strip() for f in x['haw_raw'].split(',')]}
    for L in LANGS[1:]:
        refl[L] = [f for f, g in x['cognates'][L]]
    aligned = {}
    for L in LANGS:
        for f in refl[L]:
            key = (x['pollex_id'], L, f)
            if key in seen:
                continue
            seen.add(key)
            u = clean_strict(f, L)
            if not u or len(u) != len(pu):
                pairs_skipped[L] += 1
                continue
            pairs_used[L] += 1
            aligned.setdefault(L, u)
            for (po, pv), (ro, rv) in zip(pu, u):
                P = po or 'Ø'; R = ro or 'Ø'
                cons_counts[L][P][R] += 1
                if len(examples[L][(P, R)]) < 4:
                    examples[L][(P, R)].append(f"{f} < *{x['proto_ng'].lstrip('*')}")
                vow_counts[L][(pv, rv)] += 1
    # cross-language tuple per position, only where all five aligned
    if all(L in aligned for L in LANGS):
        for i, (po, pv) in enumerate(pu):
            P = po or 'Ø'
            tup = tuple((aligned[L][i][0] or 'Ø') for L in LANGS)
            pos_tuples[P][tup] += 1

# textbook expectations (Hawaiian: Elbert & Pukui 1979; Māori etc.: standard Polynesian comparative grammar)
PROTO_ORDER = ['p', 't', 'k', 'q', 'm', 'n', 'ŋ', 'f', 's', 'h', 'w', 'l', 'r', 'Ø']

rows = []
for P in PROTO_ORDER:
    row = {'proto': '*' + P if P != 'Ø' else 'Ø (no onset)'}
    for L in LANGS:
        c = cons_counts[L][P]
        n = sum(c.values())
        if n == 0:
            row[L] = '—'; continue
        modal, k = c.most_common(1)[0]
        others = ', '.join(f'{r} {v}' for r, v in c.most_common()[1:4])
        row[L] = f'{modal} {k}/{n} ({100*k/n:.0f}%)' + (f' [{others}]' if others else '')
    rows.append(row)

with open(f'{OUT}/correspondences.tsv', 'w') as fh:
    w = csv.DictWriter(fh, fieldnames=['proto'] + LANGS, delimiter='\t')
    w.writeheader(); w.writerows(rows)

# vowel identity
vrows = []
for L in LANGS:
    tot = sum(vow_counts[L].values()); same = sum(v for (a, b), v in vow_counts[L].items() if a == b)
    vrows.append((L, same, tot))

# cross-language modal sets
sets = []
for P in PROTO_ORDER:
    c = pos_tuples[P]
    n = sum(c.values())
    if not n:
        continue
    top, k = c.most_common(1)[0]
    sets.append((P, n, top, k, c.most_common(3)))

with open(f'{OUT}/correspondences.md', 'w') as fh:
    fh.write('| proto | ' + ' | '.join(LANGS) + ' |\n|' + '---|' * (len(LANGS) + 1) + '\n')
    for r in rows:
        fh.write('| ' + ' | '.join(r[k] for k in ['proto'] + LANGS) + ' |\n')
    fh.write('\nPairs aligned (used / skipped as unequal-length or non-strict):\n')
    for L in LANGS:
        fh.write(f'- {L}: {pairs_used[L]} used, {pairs_skipped[L]} skipped\n')
    fh.write('\nVowel identity (proto vowel = reflex vowel):\n')
    for L, s, t in vrows:
        fh.write(f'- {L}: {s}/{t} = {100*s/t:.1f}%\n')
    fh.write('\nCorrespondence sets (rows where all five languages align; Haw Mao Tah Sam Ton):\n\n')
    fh.write('| proto | n positions | modal set | share | next |\n|---|---|---|---|---|\n')
    for P, n, top, k, mc in sets:
        fh.write(f"| {P} | {n} | {' : '.join(top)} | {100*k/n:.0f}% | {'; '.join(' : '.join(t)+f' ({v})' for t, v in mc[1:])} |\n")

json.dump({L: {f'{P}>{R}': ex for (P, R), ex in examples[L].items()} for L in LANGS},
          open(f'{OUT}/correspondence_examples.json', 'w'), ensure_ascii=False, indent=1)
print(open(f'{OUT}/correspondences.md').read())
