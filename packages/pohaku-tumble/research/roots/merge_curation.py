"""Merge the curation runs into the review inputs build_words.py reads.

  <curation>/overrides.json          → ../review/overrides.json   (DECISIONS.md defaults)
  <curation>/glossary/batch-NN.json  → ../review/glossary.json    ({stones, words}, renames applied)
  <curation>/repeats/batch-NN.json   → ../review/repeats.tsv      (reviewed full repeats)

Usage: python3 merge_curation.py <curation dir>
Conflicts (one stone id curated two ways, one word re-sensed two ways) are
resolved first-batch-wins and printed, never silently.
"""
import csv
import glob
import json
import os
import re
import sys
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
REVIEW = os.path.join(HERE, '..', 'review')
SRC = sys.argv[1]


def nfc(s):
    return unicodedata.normalize('NFC', s or '')


def okina(s):
    return nfc(re.sub("['‘’ʼ`ʔ]", "ʻ", s or ''))


# ── overrides ────────────────────────────────────────────────────────────
p = os.path.join(SRC, 'overrides.json')
if os.path.exists(p):
    ov = json.load(open(p, encoding='utf-8'))
    json.dump(ov, open(os.path.join(REVIEW, 'overrides.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1, sort_keys=True)
    print(f'overrides: {len(ov)} words')

# ── glossary ─────────────────────────────────────────────────────────────
stones, words, renames, conflicts = {}, {}, {}, []
for f in sorted(glob.glob(os.path.join(SRC, 'glossary', 'batch-*.json'))):
    g = json.load(open(f, encoding='utf-8'))
    tag = os.path.basename(f)
    for old, new in (g.get('renames') or {}).items():
        old, new = okina(old), okina(new)
        if old in renames and renames[old] != new:
            conflicts.append(f'{tag}: rename {old} → {new} vs {renames[old]}')
            continue
        renames[old] = new
    for sid, v in (g.get('stones') or {}).items():
        sid = okina(sid)
        v = {**v, 'spelling': okina(v.get('spelling')),
             'cognates': [[lang, okina(form)] for lang, form in (v.get('cognates') or [])]}
        if sid in stones and stones[sid] != v:
            conflicts.append(f'{tag}: stone {sid} curated twice')
            continue
        stones[sid] = v
    for w, v in (g.get('words') or {}).items():
        v = {k: okina(x) if k.startswith('sense_') else x for k, x in v.items()}
        if w in words:
            # one batch curates side a, another side b: combine
            prev = words[w]
            for k in ('sense_a', 'sense_b'):
                if k in v and k in prev and v[k] != prev[k]:
                    conflicts.append(f'{tag}: {w} {k} {v[k]} vs {prev[k]}')
                elif k in v:
                    prev[k] = v[k]
            continue
        words[w] = dict(v)


def follow(sid):
    seen = set()
    while sid in renames and sid not in seen:
        seen.add(sid)
        sid = renames[sid]
    return sid


for w in words.values():
    for k in ('sense_a', 'sense_b'):
        if k in w:
            w[k] = follow(w[k])
for old in list(stones):
    new = follow(old)
    if new != old:
        stones.setdefault(new, stones[old])
        del stones[old]
if stones or words:
    json.dump({'stones': stones, 'words': words, 'renames': renames},
              open(os.path.join(REVIEW, 'glossary.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1, sort_keys=True)
    print(f'glossary: {len(stones)} stones, {len(words)} word re-sensings, {len(renames)} renames')

# ── repeats ──────────────────────────────────────────────────────────────
rows = []
for f in sorted(glob.glob(os.path.join(SRC, 'repeats', 'batch-*.json'))):
    for r in json.load(open(f, encoding='utf-8')):
        rows.append(r)
if rows:
    cols = ['word', 'base', 'sense', 'verdict', 'exclusion_flag', 'transparency', 'form', 'gloss', 'field',
            'is_repeat_of_base', 'sense_kept', 'spelling_confidence', 'gloss_source', 'exclusion_reasons', 'verdict_reason']
    with open(os.path.join(REVIEW, 'repeats.tsv'), 'w', encoding='utf-8', newline='') as fh:
        wr = csv.writer(fh, delimiter='\t', lineterminator='\n')
        wr.writerow(cols)
        for r in sorted(rows, key=lambda r: r['word']):
            out = []
            for c in cols:
                x = r.get(c, '')
                if c == 'exclusion_flag':
                    x = 'True' if x in (True, 'True', 'true', 'yes') else 'False'
                elif c in ('sense', 'form', 'base'):
                    x = follow(okina(x)) if c == 'sense' else okina(x)
                elif isinstance(x, list):
                    x = '; '.join(map(str, x))
                out.append(re.sub(r'[\t\n]+', ' ', str(x or '')))
            wr.writerow(out)
    v = {}
    for r in rows:
        v[r.get('verdict')] = v.get(r.get('verdict'), 0) + 1
    print(f'repeats: {len(rows)} reviewed {v}')

for c in conflicts:
    print('CONFLICT', c)
