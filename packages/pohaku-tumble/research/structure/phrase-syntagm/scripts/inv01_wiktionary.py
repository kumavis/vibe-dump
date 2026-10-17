"""Inventory of multiword lexical units in Wiktionary, and the one-word compounds
Wiktionary analyses, for comparison.  Writes ../tables/wikt_multiword.tsv."""
import json, re, os, collections
import common as C, lex

OUT = os.path.join(os.path.dirname(__file__), '..', 'tables')
heads, derived = lex.wikt()
raw_entries = [json.loads(l) for l in open(f'{C.CACHE}/kaikki-haw.jsonl', encoding='utf-8')]

# unique multiword headword strings (case-sensitive raw, collapsed by norm)
mw = collections.OrderedDict()
for e in raw_entries:
    w = e['word']
    if ' ' not in w.strip():
        continue
    n = C.norm(w)
    mw.setdefault(n, {'raw': w, 'pos': set(), 'gloss': [], 'etym': ''})
    mw[n]['pos'].add(e.get('pos'))
    mw[n]['gloss'] += [g for s in e.get('senses', []) for g in s.get('glosses', [])]
    mw[n]['etym'] = mw[n]['etym'] or (e.get('etymology_text') or '')

FUNC = set('ka ke nā na o a i ma me no e ʻo he ua ʻia ia ʻana ana mai aku iho aʻe ai pū nō paha kēia kēlā au ʻoe wai ... ʻole loa nui'.split())

def kind(n, d):
    toks = n.split()
    if any(p in d['pos'] for p in ('phrase', 'intj', 'prep', 'conj', 'pron', 'adv', 'particle')):
        return 'phrase/function'
    if d['raw'][0].isupper() or 'name' in d['pos']:
        return 'proper name'
    if len(toks) >= 3:
        return '3+ words'
    if 'alternative spelling' in ' '.join(d['gloss']) or 'plural of' in ' '.join(d['gloss']):
        return 'variant'
    return '2-word common'

rows = []
for n, d in mw.items():
    k = kind(n, d)
    toks = n.split()
    h, m = (toks + [''])[:2]
    hpos = sorted({x['pos'] for x in heads.get(h, [])})
    mpos = sorted({x['pos'] for x in heads.get(m, [])})
    calque = bool(re.search(r'[Cc]alque|[Bb]orrowed', d['etym']))
    solid = n.replace(' ', '')
    rows.append({'unit': n, 'kind': k, 'pos': '/'.join(sorted(p for p in d['pos'] if p)),
                 'head': h, 'head_pos_W': '/'.join(hpos), 'mod': m, 'mod_pos_W': '/'.join(mpos),
                 'solid_also_W': solid in heads, 'calque_or_loan': calque,
                 'gloss': '; '.join(d['gloss'])[:120]})

with open(os.path.join(OUT, 'wikt_multiword.tsv'), 'w') as f:
    ks = list(rows[0].keys())
    f.write('\t'.join(ks) + '\n')
    for r in rows:
        f.write('\t'.join(str(r[k]) for k in ks) + '\n')

print('multiword headword strings (norm):', len(rows))
print(collections.Counter(r['kind'] for r in rows))
two = [r for r in rows if r['kind'] == '2-word common']
print('2-word common: with noun POS', sum('noun' in r['pos'] for r in two), 'verb-only', sum(r['pos'] == 'verb' for r in two))
print('  head is a W headword', sum(bool(r['head_pos_W']) for r in two), '; head has noun POS', sum('noun' in r['head_pos_W'] for r in two))
print('  mod is a W headword', sum(bool(r['mod_pos_W']) for r in two))
mp = collections.Counter()
for r in two:
    if 'noun' not in r['pos']:
        continue
    p = r['mod_pos_W']
    mp['noun' if p == 'noun' else 'verb(incl. stative)' if 'verb' in p and 'noun' not in p else 'noun+verb' if 'verb' in p and 'noun' in p else 'adj/other' if p else 'not a W headword'] += 1
print('  noun units: modifier POS in W:', dict(mp))
print('  also written solid as a W headword:', sum(r['solid_also_W'] for r in two), [r['unit'] for r in two if r['solid_also_W']])
print('  calque/loan etymology:', sum(r['calque_or_loan'] for r in two))
hc = collections.Counter(r['head'] for r in two if 'noun' in r['pos'])
print('  heads with >=3 noun units:', [(h, c) for h, c in hc.most_common() if c >= 3])
# one-word compounds analysed by Wiktionary
wj = json.load(open(f'{C.CACHE}/wiktionary.json'))
print('Wiktionary analyses by kind:', collections.Counter(a['kind'] for a in wj['analyses']))
