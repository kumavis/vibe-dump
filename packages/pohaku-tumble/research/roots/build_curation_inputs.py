"""Inputs for curating the stones (root glossary) and reviewing full repeats.

  .cache/glossary-in/batch-NN.json   one entry per root spelling used by a shipped word:
                                     its homographs (Wiktionary), POLLEX rows (Pukui & Elbert-
                                     sourced forms, glosses, protoforms, cognates), Andrews–Parker
                                     entries, and every shipped word using it (stone id, gloss)
  .cache/repeats-in/batch-NN.json    full repeats X·X (waiwai): the doubled word's Wiktionary,
                                     POLLEX and Andrews entries, the base's, and Hawaiian Wikipedia use
Run after build_words.py (it reads ../review/wordlist.tsv).
"""
import collections
import csv
import html
import json
import os
import re
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
C = os.path.join(HERE, '.cache')
LEXPOS = {'noun', 'verb', 'adj', 'adv', 'num'}


def nfc(s):
    return unicodedata.normalize('NFC', s or '')


def strip(s):
    s = unicodedata.normalize('NFD', (s or '').lower())
    return ''.join(c for c in s if unicodedata.category(c) != 'Mn').replace('ʻ', '').replace(' ', '')


W = json.load(open(os.path.join(C, 'wiktionary.json')))
heads = W['heads']
POLLEX = json.load(open(os.path.join(C, 'pollex', 'hawaiian-reflexes.json')))
px_by = collections.defaultdict(list)
for x in POLLEX:
    for f in (x.get('haw_forms') or [x.get('haw')]):
        if f:
            px_by[nfc(f.lower())].append({k: x.get(k) for k in ('haw', 'haw_gloss', 'proto_ng', 'proto', 'level', 'proto_gloss', 'cognates', 'haw_flags')})

text = open(os.path.join(C, 'andrews-parker1922.txt'), encoding='utf-8').read()
marks = list(re.finditer(r'(?m)^([A-Z][A-Za-z\-\']{0,30})\s+\(\s*([^)]{1,70})\)\s*[,.]?\s*([a-zA-Z]{1,5})\.', text))
andrews = collections.defaultdict(list)
for i, m in enumerate(marks):
    end = marks[i + 1].start() if i + 1 < len(marks) else len(text)
    andrews[strip(m.group(1))].append(re.sub(r'\s+', ' ', text[m.start():end]).strip()[:600])


def homographs(word):
    groups = collections.OrderedDict()
    for h in heads.get(word, []):
        if h['pos'] in LEXPOS:
            groups.setdefault(h['etym'], []).append(h)
    return [{'id': f'{word}#{i}' if len(groups) > 1 else word, 'etymology': et[:300],
             'senses': [{'pos': h['pos'], 'glosses': h['glosses'][:10]} for h in hs]} for i, (et, hs) in enumerate(groups.items())]


# ── glossary inputs ──────────────────────────────────────────────────────
# A second pass (--provisional <dry-run dir>) covers only the stones a dry run of
# build_words.py still marks provisional: roots of words the rulings restored, and
# the bases of reviewed repeats, with each repeat's review row.
import sys
SECOND = sys.argv[1] if len(sys.argv) > 2 and sys.argv[1] == '--provisional' else None
DRY = sys.argv[2] if SECOND else None
wordlist = os.path.join(DRY, 'wordlist.tsv') if DRY else os.path.join(HERE, '..', 'review', 'wordlist.tsv')
want = None
if DRY:
    src = open(os.path.join(DRY, 'roots.js'), encoding='utf-8').read()
    want = set(re.findall(r'"([^"]+)": \{[^}]*"provisional": true', src))
    rep_rows = {r['word']: r for r in csv.DictReader(open(os.path.join(HERE, '..', 'review', 'repeats.tsv'), encoding='utf-8'), delimiter='\t')}
use = collections.defaultdict(list)
for r in csv.DictReader(open(wordlist, encoding='utf-8'), delimiter='\t'):
    for side in ('stone_a', 'stone_b'):
        sid = r[side]
        if want is not None and sid not in want:
            continue
        root = re.split(r'[#?]', sid)[0]
        u = {'word': r['word'], 'form': r['form'], 'stone': sid, 'side': side[-1], 'gloss': r['gloss'], 'verdict': r['verdict']}
        if DRY and r['word'] in rep_rows:
            u['repeat_review'] = rep_rows[r['word']]
        use[root].append(u)
if DRY:
    # repeats held back only because their base had no stone: offer them for a new one
    for w, r in rep_rows.items():
        if r['verdict'] in ('keep', 'keep-pending') and r['sense'] in ('', 'unresolved') and r['is_repeat_of_base'] != 'no' and r['exclusion_flag'] != 'True':
            use[r["base"]].append({'word': w, 'form': r['form'], 'stone': 'unresolved', 'side': 'ab', 'gloss': r['gloss'], 'verdict': r['verdict'], 'repeat_review': r})
entries = []
for root in sorted(use):
    entries.append({'root': root, 'homographs': homographs(root), 'pollex': px_by.get(root, [])[:8],
                    'andrews': andrews.get(strip(root), [])[:5], 'used_by': use[root]})
out = os.path.join(C, 'glossary-in2' if DRY else 'glossary-in')
os.makedirs(out, exist_ok=True)
for f in os.listdir(out):
    os.remove(os.path.join(out, f))
N = 36 if not DRY else 20
for i in range(0, len(entries), N):
    json.dump(entries[i:i + N], open(os.path.join(out, f'batch-{i // N:02d}.json'), 'w'), ensure_ascii=False, indent=1)
print(f'glossary: {len(entries)} root spellings, {sum(len(e["used_by"]) for e in entries)} uses → {(len(entries) + N - 1) // N} batches')

if DRY:
    sys.exit(0)

# ── repeats ──────────────────────────────────────────────────────────────
xml = open(os.path.join(C, 'hawwiki.xml'), encoding='utf-8').read()
corpus = nfc(html.unescape(' '.join(re.findall(r'<text[^>]*>(.*?)</text>', xml, re.S))))
for ch in ["'", '‘', '’', 'ʼ', '`']:
    corpus = corpus.replace(ch, 'ʻ')
low = corpus.lower()


def contexts(phrase, k=5):
    out = []
    for m in re.finditer(r'(?<![a-zāēīōūʻ])' + re.escape(phrase) + r'(?![a-zāēīōūʻ])', low):
        out.append('…' + corpus[max(0, m.start() - 80):m.end() + 80].strip() + '…')
        if len(out) >= k:
            break
    return out


cands = set()
for w, hs in heads.items():
    if re.fullmatch(r'[a-zāēīōūʻ]+', w) and len(w) % 2 == 0 and w[:len(w) // 2] == w[len(w) // 2:] and any(h['pos'] in LEXPOS for h in hs):
        cands.add(w)
for f in px_by:
    if re.fullmatch(r'[a-zāēīōūʻ]+', f) and len(f) % 2 == 0 and f[:len(f) // 2] == f[len(f) // 2:]:
        cands.add(f)
reps = []
for w in sorted(cands):
    base = w[:len(w) // 2]
    if len(base) < 2 and base not in ('ū', 'ā', 'ō', 'ē', 'ī'):
        continue
    reps.append({'word': w, 'base': base,
                 'wiktionary': [{'pos': h['pos'], 'glosses': h['glosses'][:10], 'etymology': h['etym'][:300], 'cats': h['cats']} for h in heads.get(w, [])],
                 'pollex': px_by.get(w, [])[:5], 'andrews': andrews.get(strip(w), [])[:3],
                 'base_homographs': homographs(base), 'base_pollex': px_by.get(base, [])[:6], 'base_andrews': andrews.get(strip(base), [])[:4],
                 'hawwiki': contexts(w)})
out = os.path.join(C, 'repeats-in')
os.makedirs(out, exist_ok=True)
for f in os.listdir(out):
    os.remove(os.path.join(out, f))
N = 20
for i in range(0, len(reps), N):
    json.dump(reps[i:i + N], open(os.path.join(out, f'batch-{i // N:02d}.json'), 'w'), ensure_ascii=False, indent=1)
print(f'repeats: {len(reps)} candidates → {(len(reps) + N - 1) // N} batches')
