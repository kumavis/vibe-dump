#!/usr/bin/env python3
"""Build a phonological lexicon from the local Wiktionary (kaikki) Hawaiian dump
and the POLLEX Hawaiian reflexes (Pukui & Elbert spellings).

Outputs (in this directory):
  lexicon.json   {form: {...}}   one record per distinct normalised spelling
  pollex_forms.json {form: [{proto, gloss, level}]}

Normalisation: NFC; every okina look-alike (' ‘ ’ ʼ `) -> U+02BB; lowercase.
A form is "native-segmental" when it is spelled only with the 13 letters of
modern orthography (p k ʻ h m n l w a e i o u, with kahakō).
"""
import json, re, unicodedata, collections, os

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = 'roots/.cache'
OK = 'ʻ'
OKINA_LIKE = "'‘’ʼ`ʽ"
CONS = set('pkhmnlw' + OK)
VOW = set('aeiouāēīōū')
LONG = {'ā': 'a', 'ē': 'e', 'ī': 'i', 'ō': 'o', 'ū': 'u'}
CONTENT_POS = {'noun', 'verb', 'adj', 'adv'}


def norm(w):
    w = unicodedata.normalize('NFC', w)
    for c in OKINA_LIKE:
        w = w.replace(c, OK)
    return w.lower().strip()


def segments(w):
    """Return list of segments or None if the form is not native-segmental."""
    out = []
    for c in w:
        if c in CONS or c in VOW:
            out.append(c)
        else:
            return None
    return out


PROTO_LANGS = {'poz-pol-pro': 'PPN', 'poz-pnp-pro': 'PNP', 'poz-pep-pro': 'PEP',
               'poz-cet-pro': 'PCEMP', 'poz-oce-pro': 'POc', 'poz-pro': 'PMP',
               'map-pro': 'PAn', 'pqe-pro': 'PEMP', 'poz-cpa-pro': 'PCP'}


def protos_of(e):
    out = []
    for t in e.get('etymology_templates', []):
        a = t.get('args', {})
        if t['name'] in ('inh', 'der', 'inh+', 'der+'):
            lang = a.get('2', '')
            if lang in PROTO_LANGS:
                f = a.get('3', '')
                if f:
                    out.append((PROTO_LANGS[lang], f if f.startswith('*') else '*' + f))
        if t['name'] == 'ety':
            for k, v in a.items():
                m = re.match(r'(poz-[a-z]+-pro|map-pro|pqe-pro):(\*?\S+)', str(v))
                if m and m.group(1) in PROTO_LANGS:
                    f = m.group(2)
                    out.append((PROTO_LANGS[m.group(1)], f if f.startswith('*') else '*' + f))
    return out


def main():
    lex = {}
    n_entries = 0
    for line in open(os.path.join(CACHE, 'kaikki-haw.jsonl')):
        e = json.loads(line)
        n_entries += 1
        raw = e['word']
        w = norm(raw)
        cats = set()
        glosses, alt_targets, formof_targets, tags = [], [], [], set()
        for s in e.get('senses', []):
            st = set(s.get('tags', []))
            tags |= st
            for c in s.get('categories', []):
                cats.add(c['name'])
            g = ' ; '.join(s.get('glosses', []))
            alts = [norm(x['word']) for x in s.get('alt_of', [])]
            fos = [norm(x['word']) for x in s.get('form_of', [])]
            if re.match(r'^\s*The name of the Latin[- ]?(script )?letter', g) or re.match(r'^\s*(name of the )?letter\b', g, re.I):
                tags.add('letter-name')
                continue
            dm = re.match(r"^\s*(Niʻihau|Ni'ihau|Lānaʻi|Lāna'i|Kauaʻi|Maui|Molokaʻi|Hawaiʻi|archaic|obsolete|dialectal|rare|old|alternative)\s+(spelling|form)\s+of\s+([^\s(“\"]+)", g)
            if dm:
                alts.append(norm(dm.group(3)))
                tags.add('dialect-or-variant:' + dm.group(1))
            if alts or 'alt-of' in st or 'misspelling' in st or 'abbreviation' in st:
                alt_targets += alts
                continue
            if fos or 'form-of' in st:
                formof_targets += fos
                # keep the gloss text too (e.g. "plural of kanaka")
            glosses.append(g)
        etym = e.get('etymology_text', '') or ''
        loan = any(t['name'] in ('bor', 'bor+', 'lbor') for t in e.get('etymology_templates', []))
        loan = loan or any('borrowed from' in c.lower() for c in cats)
        forms = [(norm(f['form']), f.get('tags', [])) for f in e.get('forms', [])]
        rec = lex.setdefault(w, {'form': w, 'raw': set(), 'entries': []})
        rec['raw'].add(raw)
        hlinks = [norm(a[0]) for a in e.get('etymology_links', []) if len(a) > 1 and a[1].endswith('#Hawaiian')]
        rec['entries'].append({
            'etym_haw_links': hlinks,
            'variant_tags': sorted(t for t in tags if t.startswith('dialect-or-variant') or t == 'letter-name'),
            'pos': e['pos'], 'glosses': glosses, 'alt_of': alt_targets,
            'form_of': formof_targets, 'etym': etym, 'protos': protos_of(e),
            'loan': loan, 'cats': sorted(cats), 'forms': forms,
            'etymology_number': e.get('etymology_number'),
            'redup': any(t['name'] in ('redup', 'reduplication', 'rdp') for t in e.get('etymology_templates', []))
                     or 'Hawaiian reduplications' in cats,
            'af': [t.get('args', {}) for t in e.get('etymology_templates', []) if t['name'] in ('af', 'affix', 'compound', 'prefix', 'suffix')],
        })
    for w, rec in lex.items():
        rec['raw'] = sorted(rec['raw'])
        segs = segments(w)
        rec['segs'] = segs
        rec['native'] = segs is not None
        rec['proper'] = all(any(ch.isupper() for ch in r[:1]) for r in rec['raw']) and \
            all(en['pos'] == 'name' for en in rec['entries'])
        content = [en for en in rec['entries'] if en['pos'] in CONTENT_POS]
        rec['content'] = bool(content) and any(en['glosses'] for en in content)
        rec['only_alt'] = all(not en['glosses'] for en in rec['entries'])
        rec['loan'] = all(en['loan'] for en in rec['entries']) if rec['entries'] else False
        rec['pos_set'] = sorted({en['pos'] for en in rec['entries'] if en['glosses']})
        rec['protos'] = sorted({p for en in rec['entries'] for p in map(tuple, en['protos'])})
    # POLLEX
    px = json.load(open(os.path.join(CACHE, 'pollex', 'hawaiian-reflexes.json')))
    pforms = collections.defaultdict(list)
    for r in px:
        forms = r.get('haw_forms') or [r['haw']]
        for f in forms:
            f = norm(f)
            pforms[f].append({'proto': r['proto_ng'], 'pollex_id': r.get('pollex_id'), 'gloss': r['haw_gloss'], 'level': r['level'],
                              'proto_gloss': r['proto_gloss'], 'source': r.get('source')})
    for w, rec in lex.items():
        rec['pollex'] = pforms.get(w, [])
    json.dump(lex, open(os.path.join(HERE, 'lexicon.json'), 'w'), ensure_ascii=False, indent=0)
    json.dump(pforms, open(os.path.join(HERE, 'pollex_forms.json'), 'w'), ensure_ascii=False, indent=0)
    c = collections.Counter()
    for rec in lex.values():
        c['forms'] += 1
        if rec['native']: c['native'] += 1
        if rec['native'] and rec['content']: c['native_content'] += 1
        if rec['native'] and rec['content'] and not rec['loan']: c['native_content_nonloan'] += 1
        if rec['native'] and rec['content'] and rec['pollex']: c['native_content_in_pollex'] += 1
    print('kaikki entries', n_entries)
    print(dict(c))
    print('pollex distinct forms', len(pforms))


if __name__ == '__main__':
    main()
