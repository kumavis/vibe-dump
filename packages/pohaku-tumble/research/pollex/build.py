"""Stage 3: parse cached pages (no network) and write the JSON outputs."""
import collections
import json
import os
import re
import unicodedata

from fetch import _cache_path
from parse_lib import rows, clean, split_desc, anchor, content

BASE = 'https://pollex.eva.mpg.de'
HERE = os.path.dirname(os.path.abspath(__file__))
# Fetched pages and the built tables live outside git (POLLEX states no open licence):
# research/roots/.cache/pollex/, or $POLLEX_DATA.
DATA = os.environ.get('POLLEX_DATA') or os.path.join(HERE, '..', 'roots', '.cache', 'pollex')

TARGETS = {  # POLLEX language slug -> output key
    'maori': 'Maori',            # POLLEX: "New Zealand Maori"
    'samoan': 'Samoan',
    'tahitian': 'Tahitian',
    'tongan': 'Tongan',
    'easter-island': 'Easter Island',
    'marquesas': 'Marquesas',
}

# POLLEX distribution code -> proto-language label (per /about/).
# AN/MP/OC/EO/CP/FJ: "the form shown in the head line is reconstructed as PPN,
# but can be regularly derived from an earlier ... form".
LEVEL_MAP = {
    'PN': 'PPN', 'AN': 'PPN', 'MP': 'PPN', 'OC': 'PPN', 'EO': 'PPN', 'CP': 'PPN', 'FJ': 'PPN',
    'NP': 'PNP', 'EP': 'PEP', 'CE': 'PCE', 'TA': 'PTA', 'MQ': 'PMQ', 'SO': 'PSO', 'EC': 'PEC',
}

GLOTTALS = {'ʔ': 'ʔ (U+0294 LATIN LETTER GLOTTAL STOP)',
            '’': '’ (U+2019 RIGHT SINGLE QUOTATION MARK)',
            "'": "' (U+0027 APOSTROPHE)",
            '‘': '‘ (U+2018)', 'ʻ': 'ʻ (U+02BB okina)', 'ʼ': 'ʼ (U+02BC)'}
OKINA = 'ʻ'
MACRON = {'a': 'ā', 'e': 'ē', 'i': 'ī', 'o': 'ō', 'u': 'ū',
          'A': 'Ā', 'E': 'Ē', 'I': 'Ī', 'O': 'Ō', 'U': 'Ū'}


def cached(url):
    with open(_cache_path(url), encoding='utf-8') as f:
        return f.read()


def to_okina(s):
    for g in GLOTTALS:
        if g != OKINA:
            s = s.replace(g, OKINA)
    return s


def macronise(seg):
    # POLLEX writes long vowels doubled (aa = ā). Applied within one
    # slash-delimited segment so a morpheme boundary is never merged.
    return re.sub(r'([aeiouAEIOU])\1', lambda m: MACRON[m.group(1)], seg)


def lower_first(s):
    # POLLEX capitalises the first letter of every item. Undo that unless the
    # form has other capitals (then it is probably a proper name).
    letters = [i for i, c in enumerate(s) if c.isupper() or c.islower()]  # cased letters only (skips ʔ, ʻ)
    if not letters:
        return s
    first = letters[0]
    if any(s[i].isupper() for i in letters[1:]):
        return s
    return s[:first] + s[first].lower() + s[first + 1:]


def norm_form(f):
    f = lower_first(to_okina(f.strip()))
    f = ''.join(macronise(seg) for seg in f.split('/'))  # drops the '/' marks
    return unicodedata.normalize('NFC', f.strip())


TRAIL_NOTE = re.compile(r'\s+\(([^()]*)\)\s*\.?\s*$')


def top_level_split(s):
    """Split on , ; ~ and sentence-final '. ' only outside parentheses."""
    parts, buf, depth, i = [], '', 0, 0
    while i < len(s):
        c = s[i]
        if c == '(':
            depth += 1
        elif c == ')':
            depth = max(0, depth - 1)
        if depth == 0 and (c in ',;~' or (c == '.' and s[i - 1:i] != '.' and s[i + 1:i + 2] in (' ', '')
                                            and not s[i - 2:i + 1].endswith('..'))):
            parts.append(buf)
            buf = ''
        else:
            buf += c
        i += 1
    parts.append(buf)
    return [p.strip() for p in parts]


def split_item(raw):
    """Return (forms, notes) from a POLLEX item string."""
    notes = []
    forms = []
    for p in top_level_split(raw.strip()):
        while True:
            m = TRAIL_NOTE.search(p)
            if not m:
                break
            notes.insert(0, m.group(1))
            p = p[:m.start()].strip()
        if p:
            forms.append(norm_form(p))
    return forms, notes


def proto_from_id(pid):
    base = pid.strip()
    # strip POLLEX homonym/sense suffixes: .1  .1A  .A  .*  .*A  .A1  .2*  and stray trailing dots,
    # but never the dots of a discontinuous form like E...ANA
    while True:
        b2 = re.sub(r'(?<!\.)\.[0-9*]*[A-Z]?[0-9*]*$', '', base)
        if b2 == base or not b2:
            break
        base = b2
    return '*' + base.lower()


def parse_entry(page):
    c = content(page)
    h1 = clean(re.search(r'<h1>(.*?)</h1>', c, re.S).group(1))
    m = re.match(r'Protoform:\s*(.*?)\s*\[([^\]]*)\]\s*(.*)$', h1)
    pid, code, head = m.group(1), m.group(2), m.group(3)
    desc = re.search(r'<th>Description:</th>\s*<td>(.*?)</td>', c, re.S)
    desc = clean(desc.group(1)) if desc else head
    lvl = re.search(r'<th>Reconstruction:</th>\s*<td>(.*?)</td>', c, re.S)
    lvl = clean(lvl.group(1)).replace('Reconstructs to', '').strip() if lvl else None
    reflexes = []
    for _, tds in rows(page):
        if len(tds) != 4:
            continue
        la = anchor(tds[0][1])
        if not la or not la['href'].startswith('/language/'):
            continue
        gloss, flags = split_desc(tds[2][1])
        sa = anchor(tds[3][1])
        reflexes.append({'lang_slug': la['href'].strip('/').split('/')[-1], 'lang': la['text'],
                         'item': clean(tds[1][1]), 'gloss': gloss, 'flags': flags,
                         'source': sa['title'] if sa else clean(tds[3][1])})
    return {'id': pid, 'code': code, 'heading': head, 'desc': desc, 'level_name': lvl,
            'reflexes': reflexes}


def main():
    raw_rows = json.load(open(os.path.join(DATA, 'raw', 'haw_rows_raw.json')))
    status = json.load(open(os.path.join(DATA, 'raw', 'entries_status.json')))
    entries, problems = {}, []
    for h in dict.fromkeys(r['proto_a']['href'] for r in raw_rows):
        url = BASE + h
        try:
            page = cached(url)
        except FileNotFoundError:
            problems.append({'href': h, 'problem': 'entry page not fetched'})
            continue
        e = parse_entry(page)
        for n in status.get('extra_pages', {}).get(h, []):
            if n > 1:
                e['reflexes'] += parse_entry(cached(f'{url}?page={n}'))['reflexes']
        entries[h] = e

    glottal_seen = collections.Counter()
    out, unparsed = [], []
    for r in raw_rows:
        h = r['proto_a']['href']
        raw = r['item']
        for g in GLOTTALS:
            if g in raw:
                glottal_seen[GLOTTALS[g]] += raw.count(g)
        forms, notes = split_item(raw)
        e = entries.get(h)
        title = r['proto_a']['title']
        tm = re.match(r'^Entries for (.*?)\s*\[([^\]]*)\]\s*(.*)$', title)
        pid = e['id'] if e else (tm.group(1) if tm else r['proto_a']['text'])
        code = e['code'] if e else (tm.group(2) if tm else None)
        pdesc = e['desc'] if e else (tm.group(3) if tm else '')
        # the description sometimes carries a fuller reconstruction: "Yes: *a(a)e"
        vm = re.search(r'[:\s]\s*(\*\S.*)$', pdesc)
        variant = vm.group(1).strip() if vm else None
        pgloss = pdesc[:vm.start()].strip(' :') if vm else pdesc
        proto = proto_from_id(pid)
        rec = {
            'haw': forms[0] if forms else None,
            'haw_raw': raw,
            'haw_okina': to_okina(raw),
            'haw_gloss': r['gloss'],
            'proto': proto,
            'level': LEVEL_MAP.get(code, code),
            'proto_gloss': pgloss,
            'proto_url': BASE + h,
            'source': r['src']['title'] if r['src'] else r['src_raw'],
            'cognates': {},
            # extras
            'haw_forms': forms,
            'haw_flags': r['flags'],
            'proto_ng': proto.replace('g', 'ŋ'),
            'proto_variant': variant,
            'pollex_id': pid,
            'level_code': code,
            'level_name': e['level_name'] if e else None,
            'source_code': r['src']['text'] if r['src'] else None,
            'source_url': BASE + r['src']['href'] if r['src'] else None,
        }
        if notes:
            rec['haw_notes'] = notes
        if not forms:
            unparsed.append({'raw': raw, 'why': 'no form extracted'})
        odd = set(re.sub(r'[aeiouāēīōūhklmnpwʻ()\-\s.]', '', ''.join(forms).lower()))
        if odd:
            rec['haw_anomalous_chars'] = ''.join(sorted(odd))
        if re.search(r'([aeiou])\1', ''.join(forms)):
            rec.setdefault('haw_notes', []).append('identical vowels across a POLLEX "/" boundary left unmerged')
        if e:
            for t in TARGETS.values():
                rec['cognates'][t] = []
            for x in e['reflexes']:
                key = TARGETS.get(x['lang_slug'])
                if key:
                    g = x['gloss'] + (' [' + '; '.join(x['flags']) + ']' if x['flags'] else '')
                    rec['cognates'][key].append([lower_first(x['item']), g])
            # cross-check: is this Hawaiian row on the entry page too?
            hw = [x for x in e['reflexes'] if x['lang_slug'] == 'hawaii']
            if not any(x['item'] == raw for x in hw):
                problems.append({'href': h, 'problem': f'Hawaiian item {raw!r} not found on entry page'})
        else:
            rec['cognates'] = None
        out.append(rec)

    json.dump(out, open(os.path.join(DATA, 'hawaiian-reflexes.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)

    # sources
    src = {}
    for r in raw_rows:
        s = r['src']
        if not s:
            continue
        d = src.setdefault(s['href'], {'code': s['text'], 'short': s['title'], 'url': BASE + s['href'],
                                       'hawaiian_reflex_count': 0})
        d['hawaiian_reflex_count'] += 1
    for h, d in src.items():
        page = cached(BASE + h)
        c = content(page)
        ref = re.search(r'<p class="ref">(.*?)</p>', c, re.S)
        d['citation'] = clean(ref.group(1)) if ref else None
        d['heading'] = clean(re.search(r'<h1>(.*?)</h1>', c, re.S).group(1))
    sources = sorted(src.values(), key=lambda d: -d['hawaiian_reflex_count'])
    json.dump(sources, open(os.path.join(DATA, 'sources.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)

    stats = {
        'rows': len(out),
        'distinct_protoform_entries': len(entries),
        'distinct_proto_strings': len({o['proto'] for o in out}),
        'glottal_chars': dict(glottal_seen),
        'levels': collections.Counter(o['level'] for o in out).most_common(),
        'level_codes': collections.Counter(o['level_code'] for o in out).most_common(),
        'rows_with_cognates': {k: sum(1 for o in out if o['cognates'] and o['cognates'][k]) for k in TARGETS.values()},
        'entries_with_any_target_cognate': sum(1 for e in entries.values() if any(x['lang_slug'] in TARGETS for x in e['reflexes'])),
        'multi_form_rows': sum(1 for o in out if len(o['haw_forms']) > 1),
        'rows_with_notes': sum(1 for o in out if o.get('haw_notes')),
        'anomalous': [(o['haw_raw'], o['haw_anomalous_chars']) for o in out if o.get('haw_anomalous_chars')],
        'flags': collections.Counter(f for o in out for f in o['haw_flags']).most_common(),
        'unparsed': unparsed,
        'problems': problems,
        'not_found': status.get('not_found'),
        'extra_pages': status.get('extra_pages'),
    }
    json.dump(stats, open(os.path.join(DATA, 'raw', 'stats.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    print(json.dumps({k: v for k, v in stats.items() if k not in ('anomalous',)}, ensure_ascii=False, indent=1)[:4000])


if __name__ == '__main__':
    main()
