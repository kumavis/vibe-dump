"""Turn the word review into Pōhaku Tumble's data files.

Inputs:
  ../review/review.tsv             the word-by-word review (first + second reading, adjudication)
  ../review/overrides.json         optional: verdict changes applying DECISIONS.md defaults
  ../review/glossary.json          optional: curated stones — per sense id: spelling, card gloss,
                                   Proto-Polynesian ancestor, cognates; plus per-word sense fixes
  ../review/repeats.tsv            optional: reviewed full repeats (waiwai = wai·wai)
  .cache/wiktionary.json, .cache/pollex/hawaiian-reflexes.json, compounds.tsv
Outputs:
  ../../src/data/words.js          WORDS: [{w, a, b, g, f, ev, nodeal}]
  ../../src/data/roots.js          ROOTS: {id: {s, g, pp, cog}}
  ../review/wordlist.tsv           the shipped list with its provenance

A word ships when its final verdict is keep or keep-pending, it carries no
§4.3 exclusion, it is not opaque, and both stones are 8 letters or fewer.
Final verdict = adjudication if any; else, where the blind second reading
split from the first on whether the word survives, 'doubtful'; else the
first reading. Overrides apply last.
"""
import collections
import csv
import json
import os
import re
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
REVIEW = os.path.join(HERE, '..', 'review')
# POHAKU_OUT=<dir> writes everything there instead, for a dry run beside a live build
OUT = os.environ.get('POHAKU_OUT')
DATA = OUT or os.path.join(HERE, '..', '..', 'src', 'data')
C = os.path.join(HERE, '.cache')


def nfc(s):
    return unicodedata.normalize('NFC', s or '')


def okina(s):
    """Every glottal-stop look-alike to U+02BB."""
    return nfc(re.sub("['‘’ʼ`ʔ]", "ʻ", s or ''))


def load_opt(name):
    p = os.path.join(REVIEW, name)
    return json.load(open(p, encoding='utf-8')) if os.path.exists(p) else None


rows = list(csv.DictReader(open(os.path.join(REVIEW, 'review.tsv'), encoding='utf-8'), delimiter='\t'))
compounds = {r['word']: r for r in csv.DictReader(open(os.path.join(HERE, 'compounds.tsv'), encoding='utf-8'), delimiter='\t')}
overrides = load_opt('overrides.json') or {}
glossary = load_opt('glossary.json') or {}
W = json.load(open(os.path.join(C, 'wiktionary.json'), encoding='utf-8'))
heads = W['heads']
POLLEX = json.load(open(os.path.join(C, 'pollex', 'hawaiian-reflexes.json'), encoding='utf-8'))
LEXPOS = {'noun', 'verb', 'adj', 'adv', 'num'}
STOP = set('the a an to of in on at as for and or is be by it with from that this which'.split())


def toks(s):
    return {x.rstrip('s') for x in re.findall(r'[a-z]+', (s or '').lower()) if x not in STOP and len(x) > 2}


def homographs(word):
    groups = collections.OrderedDict()
    for h in heads.get(word, []):
        if h['pos'] in LEXPOS:
            groups.setdefault(h['etym'], []).extend(h['glosses'])
    return list(groups.values())


def short(gloss, n=3):
    """A card-sized gloss: the first sense, first few words, no parentheticals."""
    g = re.sub(r'\([^)]*\)', '', gloss or '').strip()
    g = re.split(r'[;,.]', g)[0].strip()
    g = re.sub(r'^(to be|to|a|an|the)\s+', lambda m: 'to ' if m.group(1) in ('to', 'to be') else '', g)
    return ' '.join(g.split()[:n])


def final_verdict(r):
    if r['word'] in overrides:
        return overrides[r['word']]['verdict']
    if r['adjudicated_verdict']:
        return r['adjudicated_verdict']
    sv = r['second_verdict']
    if sv and (sv in ('keep', 'keep-pending')) != (r['verdict'] in ('keep', 'keep-pending')):
        return 'doubtful'
    return r['verdict']


def excluded(r):
    if r['word'] in overrides and 'exclude' in overrides[r['word']]:
        return overrides[r['word']]['exclude']
    return r['exclusion_flag'] == 'True'


# ── which words ship ──────────────────────────────────────────────────────

ship = []
dropped = collections.Counter()
for r in rows:
    v = final_verdict(r)
    if v not in ('keep', 'keep-pending'):
        dropped[f'verdict {v}'] += 1
        continue
    if excluded(r):
        dropped['§4.3 exclusion'] += 1
        continue
    if r['transparency'] == 'opaque':
        dropped['opaque'] += 1
        continue
    a, b = r['split'].split('·')
    fix = (glossary.get('words') or {}).get(r['word'], {})
    sa, sb = fix.get('sense_a', r['sense_a']), fix.get('sense_b', r['sense_b'])
    if max(len(a), len(b)) > 8:
        dropped['stone over 8 letters'] += 1
        continue
    ship.append({'row': r, 'a': a, 'b': b, 'sa': sa, 'sb': sb, 'verdict': v})

reps = []
rp = os.path.join(REVIEW, 'repeats.tsv')
if os.path.exists(rp):
    for r in csv.DictReader(open(rp, encoding='utf-8'), delimiter='\t'):
        # a repeat ships only as its base doubled in a sense the base keeps (owner, B7 overridden)
        if (r.get('verdict') in ('keep', 'keep-pending') and r.get('exclusion_flag') != 'True' and r.get('transparency') != 'opaque'
                and r.get('is_repeat_of_base', 'yes') != 'no' and r.get('sense') not in ('', 'unresolved')):
            base = okina(r['base'])
            ship.append({'row': {**r, 'split': f'{base}·{base}'}, 'a': base, 'b': base, 'sa': r['sense'], 'sb': r['sense'], 'verdict': r['verdict']})
            reps.append(r['word'])

# B6, one form per word: a shipped repeat (waiʻeleʻele's ʻeleʻele) is a two-stone
# word, so no other word may carry it as a single stone (research default)
rep_forms = {okina(s['row'].get('form') or s['row']['word']).replace(' ', '') for s in ship if s['a'] == s['b'] and s['row'].get('base')}
kept = []
for s in ship:
    if not s['row'].get('base') and (okina(s['a']) in rep_forms or okina(s['b']) in rep_forms):
        dropped['B6 stone is a shipped repeat'] += 1
        continue
    kept.append(s)
ship = kept

# ── stones: one id per root in sense ─────────────────────────────────────

RENAMES = {okina(k): okina(v) for k, v in (glossary.get('renames') or {}).items()}


def renamed(sid):
    """A curator's split or merge, followed to its end."""
    seen = set()
    while sid in RENAMES and sid not in seen:
        seen.add(sid)
        sid = RENAMES[sid]
    return sid


def stone_id(root, sense, word):
    """'unresolved' senses become a stone of their own, so they never draw a false line."""
    if not sense or sense == 'unresolved':
        return f'{root}?{word}'
    return renamed(okina(sense))


roots = {}
for s in ship:
    for root, sense, side in ((s['a'], s['sa'], 'a'), (s['b'], s['sb'], 'b')):
        sid = stone_id(okina(root), sense, s['row']['word'])
        s['id_' + side] = sid
        if sid in roots:
            continue
        g = glossary.get('stones', {}).get(sid)
        if g:
            roots[sid] = {'s': okina(g['spelling']), 'g': g['gloss'], 'pp': g.get('protoform', ''), 'cog': g.get('cognates', [])}
            continue
        # provisional: Wiktionary homograph gloss, POLLEX protoform by gloss overlap
        base = okina(root)
        hs = homographs(base)
        m = re.search(r'#(\d+)$', sid)
        k = int(m.group(1)) if m else 0
        gl = hs[k] if k < len(hs) else (hs[0] if hs else [])
        cr = compounds.get(s['row']['word'], {})
        fallback = (cr.get('root_a') if side == 'a' else cr.get('root_b')) or ''
        gloss = short(gl[0] if gl else fallback.split(':', 1)[-1].lstrip(' ?'))
        best, bs = None, -1
        for x in POLLEX:
            if okina(x.get('haw')) != base:
                continue
            sc = len(toks(' '.join(gl)) & toks((x.get('haw_gloss') or '') + ' ' + (x.get('proto_gloss') or '')))
            if sc > bs:
                best, bs = x, sc
        pp, cog = '', []
        if best and bs > 0:
            pp = best.get('proto_ng') or best.get('proto') or ''
            for lang, label in (('Maori', 'Māori'), ('Tahitian', 'Tahitian'), ('Samoan', 'Sāmoan')):
                forms = (best.get('cognates') or {}).get(lang) or []
                if forms:
                    f = forms[0][0].split(',')[0].strip()
                    f = re.sub(r'([aeiou])\1', lambda mm: {'a': 'ā', 'e': 'ē', 'i': 'ī', 'o': 'ō', 'u': 'ū'}[mm.group(1)], okina(f))
                    if re.fullmatch(r"[a-zāēīōūʻ]+", f):
                        cog.append([label, f])
        roots[sid] = {'s': base, 'g': gloss, 'pp': pp, 'cog': cog, 'provisional': True}


# ── words ─────────────────────────────────────────────────────────────────

FIELDS = {'lani', 'kai', 'ʻāina', 'ulu', 'kanaka', 'hana', 'naʻau', 'hele'}
words = []
seen = set()
misspelt = []
for s in ship:
    r = s['row']
    # §4.4: common nouns in lower case (Hōkūloa the star is written hōkūloa on a stone pair)
    form = okina(r.get('form') or r['word']).lower()
    if form in seen:
        continue
    # the two stones must spell the word, or a turn would print letters the word does not have
    if roots[s['id_a']]['s'] + roots[s['id_b']]['s'] != form.replace(' ', ''):
        misspelt.append(f"{form} ≠ {roots[s['id_a']]['s']}·{roots[s['id_b']]['s']}")
        dropped['stones do not spell the word'] += 1
        continue
    seen.add(form)
    s['shipped'] = True
    field = okina(r.get('field'))
    words.append({
        'w': form,
        'a': s['id_a'],
        'b': s['id_b'],
        # English possessives take a typographic apostrophe; Hawaiian never does (§4.4)
        'g': nfc((r.get('gloss') or '').strip()).replace("'", '’'),
        'f': field if field in FIELDS else 'hele',
        'ev': 'keep' if s['verdict'] == 'keep' else 'pending',
        'nodeal': bool((overrides.get(r.get('word', '')) or {}).get('nodeal')),
    })

used = {x['a'] for x in words} | {x['b'] for x in words}
roots = {k: v for k, v in roots.items() if k in used}
ship = [s for s in ship if s.get('shipped')]

# §4.4: the Hawaiian fields (the word, the stone spellings) use U+02BB only, NFC
APOS = re.compile("['‘’ʼ`]")
bad = [x['w'] for x in words if APOS.search(x['w']) or nfc(x['w']) != x['w']]
bad += [v['s'] for v in roots.values() if APOS.search(v['s']) or nfc(v['s']) != v['s']]
assert not bad, f'apostrophe or non-NFC in Hawaiian data: {bad[:5]}'

# F1: English that must never reach a card (Andrews' 1922 wording, §4.3 senses, put-downs)
BANNED = re.compile(r'\b(idol|heathen|holy water|astrolog|mistress|dumb|negro|black-skinned|hell|sex|penis|vagin|genital'
                    r'|testic|excre|dung|f(a)?ec|urin|menstru|copulat|fornicat|lewd|obscen|adulter|harlot|prostitut|whore'
                    r'|idiot|stupid|crazy|insane|savage|pagan|sorcer|bastard|buttock|anus|fart|semen|lust\b|lustful|erect|orgasm)', re.I)
bad = [f"{x['w']}: {x['g']}" for x in words if BANNED.search(x['g'])]
bad += [f"{k}: {v['g']}" for k, v in roots.items() if BANNED.search(v['g'])]
assert not bad, f'banned English in a gloss (DECISIONS F1): {bad[:5]}'

os.makedirs(DATA, exist_ok=True)
head = ('// Generated by packages/pohaku-tumble/research/roots/build_words.py from the word review.\n'
        '// Do not edit by hand: change the review, the overrides or the glossary and regenerate.\n')
with open(os.path.join(DATA, 'words.js'), 'w', encoding='utf-8') as f:
    f.write(head + '// w: the word as written; a, b: stone ids (root in sense); g: card gloss; f: field;\n'
            '// ev: keep | pending (pending = not yet confirmed in Pukui & Elbert); nodeal: never an opening word.\n')
    f.write('export const WORDS = ' + json.dumps(words, ensure_ascii=False, indent=0).replace('\n', '') .replace('},{', '},\n{') + '\n')
with open(os.path.join(DATA, 'roots.js'), 'w', encoding='utf-8') as f:
    f.write(head + '// id: root in sense ("wai#0"); s: spelling on the stone; g: gloss; pp: Proto-Polynesian ancestor;\n'
            '// cog: cognates [[language, form]]; provisional: gloss and ancestor picked by script, not yet curated.\n')
    f.write('export const ROOTS = ' + json.dumps(roots, ensure_ascii=False, indent=0).replace('\n', '').replace('},"', '},\n"') + '\n')
with open(os.path.join(OUT or REVIEW, 'wordlist.tsv'), 'w', encoding='utf-8') as f:
    f.write('word\tform\tstone_a\tstone_b\tgloss\tfield\tevidence\tverdict\n')
    for s in ship:
        r = s['row']
        f.write('\t'.join([r['word'], okina(r.get('form') or r['word']).lower(), s['id_a'], s['id_b'], r.get('gloss', ''), r.get('field', ''), r.get('evidence', ''), s['verdict']]) + '\n')

print(f'{len(words)} words ({sum(x["ev"] == "keep" for x in words)} keep, {sum(x["ev"] == "pending" for x in words)} pending, {len(reps)} repeats); '
      f'{len(roots)} stones ({sum(1 for k in roots if "?" in k)} isolated unresolved, {sum(1 for v in roots.values() if v.get("provisional"))} provisional)')
print('not shipped:', dict(dropped))
if misspelt:
    print('stones do not spell:', '; '.join(misspelt))
