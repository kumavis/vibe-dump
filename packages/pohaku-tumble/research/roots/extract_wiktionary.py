"""Pull every Hawaiian word Wiktionary analyses as parts (af/compound templates)
out of the Kaikki dump, and classify it: two-root compound, prefixed, suffixed,
three-plus parts. Also index every headword with its glosses, so roots can be
looked up."""
import json, re, collections, sys, unicodedata

SRC = sys.argv[1] if len(sys.argv) > 1 else ".cache/kaikki-haw.jsonl"
OUT = sys.argv[2] if len(sys.argv) > 2 else ".cache/wiktionary.json"
rows = [json.loads(l) for l in open(SRC, encoding='utf-8')]

def nfc(s): return unicodedata.normalize('NFC', s)
def clean_part(p):
    p = re.sub(r'<[^>]*>', '', p)          # inline modifiers <t:...>, <pos:...>
    p = p.split('#')[0]
    return nfc(p.strip())

def cats_of(r):
    out = set()
    for c in (r.get('categories') or []):
        out.add(c if isinstance(c, str) else c.get('name'))
    for s in r.get('senses', []):
        for c in (s.get('categories') or []):
            out.add(c if isinstance(c, str) else c.get('name'))
    return out

heads = collections.defaultdict(list)   # word -> list of {pos, glosses, etym}
analyses = {}                           # word -> list of part-lists
for r in rows:
    w = nfc(r['word'])
    glosses = []
    for s in r.get('senses', []):
        for g in s.get('glosses', []) or s.get('raw_glosses', []) or []:
            glosses.append(g)
    heads[w].append({'pos': r['pos'], 'glosses': glosses, 'etym': r.get('etymology_text', ''),
                     'cats': sorted(c for c in cats_of(r) if c and 'Hawaiian' in c and 'entries' not in c and 'Pages' not in c),
                     'templates': [t['name'] for t in r.get('etymology_templates') or []]})
    for t in r.get('etymology_templates') or []:
        if t['name'] in ('af', 'affix', 'compound', 'com', 'prefix', 'pre', 'suffix', 'suf', 'confix'):
            a = t['args']
            parts = []
            i = 2
            while str(i) in a:
                parts.append(clean_part(a[str(i)]))
                i += 1
            # gloss args t1=, t2=, or <t:...>
            gl = []
            for k in range(1, len(parts) + 1):
                raw = a.get(str(k + 1), '')
                m = re.search(r'<t:([^>]*)>', raw)
                gl.append(a.get(f't{k}') or a.get(f'gloss{k}') or (m.group(1) if m else ''))
            if t['name'] in ('prefix', 'pre'):
                parts = [parts[0] + '-' if not parts[0].endswith('-') else parts[0]] + parts[1:]
            analyses.setdefault(w, []).append({'tpl': t['name'], 'parts': parts, 'part_glosses': gl, 'expansion': t.get('expansion', '')})

def kind(parts):
    if any(p == '' for p in parts): return 'odd'
    aff = [p.endswith('-') or p.startswith('-') for p in parts]
    if len(parts) == 2 and not any(aff): return 'compound2'
    if len(parts) >= 3 and not any(aff): return 'compound3+'
    if aff[0] and len(parts) == 2 and not aff[1]: return 'prefixed'
    if aff[-1] and not aff[0]: return 'suffixed'
    return 'mixed'

out = []
for w, alist in analyses.items():
    for an in alist:
        out.append({'word': w, 'kind': kind(an['parts']), **an})
json.dump({'heads': heads, 'analyses': out}, open(OUT, 'w'), ensure_ascii=False, indent=0)
c = collections.Counter(x['kind'] for x in out)
print("analyses:", len(out), dict(c))
print("distinct words analysed:", len(analyses))
comp = [x for x in out if x['kind'] == 'compound2']
lower = [x for x in comp if x['word'][:1].islower() or x['word'][:1] == 'ʻ' and x['word'][1:2].islower()]
single = [x for x in lower if ' ' not in x['word'] and '-' not in x['word']]
print("compound2:", len(comp), "lowercase:", len(lower), "single-word lowercase:", len(single))
