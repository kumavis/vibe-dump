"""Attestation of every paradigm cell in each local source.

Output: tables/attestation.tsv and tables/attestation.md
Columns:
  W     Wiktionary (kaikki dump): entries with a grammatical POS (pron/det/article/
        particle/prep/conj/adv) and their first gloss; 'lex-only' if the spelling
        exists only as a content word.
  P     POLLEX Hawaiian reflexes (98% cited to Pukui & Elbert 1986): every row whose
        Hawaiian form equals the cell, as protoform 'gloss'.  Grammatical rows are
        picked out by a keyword screen on the POLLEX gloss (printed in full anyway).
  AP    Andrews-Parker 1922 OCR: headword entries (POS abbreviation) for the
        undiacritised spelling (so homographs collapse).
  G54   number of whole-word hits of the undiacritised spelling in Andrews' 1854
        Grammar OCR (homographs collapse; a crude presence check only).
  WP    Hawaiian Wikipedia tokens spelled exactly so (any case), and tokens of the
        same undiacritised spelling written differently (diacritic variants or
        homographs).
"""
import re, os, json
from collections import Counter
import common
from paradigms import ALL

HERE = common.HERE
os.makedirs(os.path.join(HERE, 'tables'), exist_ok=True)

GRAM_POS = {'pron', 'det', 'article', 'particle', 'prep', 'conj', 'adv'}
GRAM_KW = re.compile(r'pronoun|posses|demonstr|plural|article|direction|hither|away|'
                     r'upward|downward|\bthis\b|\bthat\b|there|here|like th|how\?|where|'
                     r'\bwe\b|\byou\b|\bthey\b|\bhe\b|\bmy\b|\bthy\b|\byour\b|\bhis\b|'
                     r'dominant|subordinate|of \(|aspect|definite|aforementioned|'
                     r'a certain|towards|thus|in that way|first person|second person|'
                     r'third person|\bme\b|\bus\b|\bthem\b|\bof\b|\bfor\b|\bby\b', re.I)


def main():
    k = common.load_kaikki()
    px, _ = common.load_pollex()
    sents, npages = common.corpus()
    uni = common.unigram_counts(sents)
    by_strip = Counter()
    for t, n in uni.items():
        by_strip[common.strip_marks(t)] += n
    g54 = open(os.path.join(HERE, 'src', 'andrews1854.txt'), encoding='utf-8', errors='ignore').read().lower()
    g54 = g54.replace("'", '').replace('‘', '').replace('’', '')

    rows = []
    for par, cells in ALL.items():
        for form, feat in cells:
            f = common.norm(form)
            s = common.strip_marks(f)
            wg = [(e['pos'], (e['glosses'] or [''])[0][:60]) for e in k.get(f, []) if e['pos'] in GRAM_POS]
            wl = [e['pos'] for e in k.get(f, []) if e['pos'] not in GRAM_POS]
            W = '; '.join(f'{p}: {g}' for p, g in wg) if wg else ('lex-only' if wl else '—')
            prow = px.get(f, [])
            pg = [r for r in prow if GRAM_KW.search(r.get('haw_gloss', '') + ' ' + r.get('proto_gloss', ''))]
            P = '; '.join(f"{r['proto']} '{r['haw_gloss'][:45]}'" for r in pg) if pg else ('lex-only' if prow else '—')
            ap = common.andrews_parker(f)
            AP = ', '.join(sorted({a[0] for a in ap})) if ap else '—'
            G = len(re.findall(r'(?<![a-z])%s(?![a-z])' % re.escape(s), g54))
            wp = uni.get(f, 0)
            wpv = by_strip.get(s, 0) - wp
            rows.append({'paradigm': par, 'form': form, 'features': json.dumps(feat, ensure_ascii=False),
                         'W': W, 'P': P, 'AP': AP, 'G54': G, 'WP': wp, 'WP_variants': wpv})
    with open(os.path.join(HERE, 'tables', 'attestation.tsv'), 'w') as fh:
        cols = list(rows[0].keys())
        fh.write('\t'.join(cols) + '\n')
        for r in rows:
            fh.write('\t'.join(str(r[c]) for c in cols) + '\n')
    with open(os.path.join(HERE, 'tables', 'attestation.md'), 'w') as fh:
        cur = None
        for r in rows:
            if r['paradigm'] != cur:
                cur = r['paradigm']
                fh.write(f"\n### {cur}\n\n| form | Wiktionary (grammatical sense) | POLLEX / P&E | A–P 1922 POS | Andrews 1854 hits | hawwiki exact | hawwiki same-letters other spelling |\n|---|---|---|---|---|---|---|\n")
            fh.write(f"| {r['form']} | {r['W']} | {r['P']} | {r['AP']} | {r['G54']} | {r['WP']} | {r['WP_variants']} |\n")
    print(open(os.path.join(HERE, 'tables', 'attestation.md')).read())


if __name__ == '__main__':
    main()
