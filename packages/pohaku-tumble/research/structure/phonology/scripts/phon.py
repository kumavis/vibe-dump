#!/usr/bin/env python3
"""Inventory, phonotactics, mora structure and segment frequencies.
Reads lexicon.json (Wiktionary) + corpus_counts.json (Hawaiian Wikipedia).
Writes phon_stats.json and prints tables used in NOTES.md.
"""
import json, os, collections, re

HERE = os.path.dirname(os.path.abspath(__file__))
OK = 'ʻ'
CONS = list('pkhmnlw') + [OK]
SV = list('aeiou')
LV = list('āēīōū')
LONG2SHORT = dict(zip(LV, SV))


def is_v(s):
    return s in SV or s in LV


def moras(segs):
    return sum(2 if s in LV else 1 for s in segs if is_v(s))


def main():
    lex = json.load(open(os.path.join(HERE, 'lexicon.json')))
    corpus = json.load(open(os.path.join(HERE, 'corpus_counts.json')))
    out = {}
    # ---------- non-native spellings
    allforms = [r for r in lex.values()]
    single = [r for r in allforms if ' ' not in r['form'] and '-' not in r['form']]
    nonnative = [r for r in single if not r['native']]
    out['single_word_forms'] = len(single)
    out['nonnative_forms'] = len(nonnative)
    out['nonnative_by_pos'] = collections.Counter(p for r in nonnative for p in r['pos_set'] or ['?']).most_common()
    out['nonnative_loanflag'] = sum(1 for r in nonnative if r['loan'] or any(e['pos'] == 'name' for e in r['entries']))
    # ---------- phonotactics over native single-word forms (all POS except proper names/letters)
    nat = [r for r in single if r['native'] and r['form'] and not r['proper']
           and not all(e['pos'] in ('character', 'prefix', 'suffix', 'infix', 'interfix') for e in r['entries'])]
    out['native_forms_checked'] = len(nat)
    viol = collections.Counter()
    viol_ex = collections.defaultdict(list)
    for r in nat:
        s = r['segs']
        for i in range(len(s) - 1):
            if s[i] in CONS and s[i + 1] in CONS:
                viol['CC'] += 1; viol_ex['CC'].append(r['form']); break
        if s and s[-1] in CONS:
            viol['final C'] += 1; viol_ex['final C'].append(r['form'])
    out['phonotactic_violations'] = dict(viol)
    out['phonotactic_violation_examples'] = {k: v[:20] for k, v in viol_ex.items()}
    # corpus check
    cv = re.compile(r"^(?:[%s]?[%s])+$" % (''.join(CONS), ''.join(SV + LV)))
    # ---------- content forms
    content = [r for r in nat if r['content']]
    out['content_forms'] = len(content)
    # initial segment class
    init = collections.Counter()
    for r in content:
        s = r['segs'][0]
        init['ʻ' if s == OK else ('V' if is_v(s) else 'C(other)')] += 1
    out['content_initial'] = dict(init)
    # segment type frequencies (over content forms) and token frequencies (corpus)
    tf = collections.Counter()
    for r in content:
        for s in r['segs']:
            tf[s] += 1
    tok = collections.Counter()
    for w, n in corpus.items():
        for ch in w:
            tok[ch] += n
    order = CONS + SV + LV
    tot_t = sum(tf.values()); tot_k = sum(tok.values())
    out['segment_freq'] = [(s, tf[s], round(100 * tf[s] / tot_t, 2), tok[s], round(100 * tok[s] / tot_k, 2)) for s in order]
    # consonant share
    out['C_share_type'] = round(100 * sum(tf[c] for c in CONS) / tot_t, 1)
    out['C_share_token'] = round(100 * sum(tok[c] for c in CONS) / tot_k, 1)
    # long vowel share among vowels
    out['long_share_type'] = round(100 * sum(tf[v] for v in LV) / sum(tf[v] for v in SV + LV), 1)
    out['long_share_token'] = round(100 * sum(tok[v] for v in LV) / sum(tok[v] for v in SV + LV), 1)
    # ---------- vowel sequences (VV) in content forms
    vv = collections.Counter()
    vvv = 0
    for r in content:
        s = r['segs']
        for i in range(len(s) - 1):
            if is_v(s[i]) and is_v(s[i + 1]):
                vv[s[i] + s[i + 1]] += 1
        for i in range(len(s) - 2):
            if is_v(s[i]) and is_v(s[i + 1]) and is_v(s[i + 2]):
                vvv += 1
    out['VV_top'] = vv.most_common(40)
    out['VV_types'] = len(vv)
    out['VVV_count'] = vvv
    # identical short vowels adjacent (aa) -- should be absent if length is written with macron
    out['identical_VV'] = {k: v for k, v in vv.items() if len(k) == 2 and k[0] == k[1]}
    # short-short VV by quality: rising/falling sonority (diphthong candidates)
    height = {'a': 3, 'e': 2, 'o': 2, 'i': 1, 'u': 1}
    falling = collections.Counter(); level = collections.Counter(); rising = collections.Counter()
    for k, n in vv.items():
        a, b = k[0], k[1]
        A = LONG2SHORT.get(a, a); B = LONG2SHORT.get(b, b)
        if b in LV:
            continue
        if height[A] > height[B]:
            falling[k] += n
        elif height[A] == height[B]:
            level[k] += n
        else:
            rising[k] += n
    out['VV_falling_sonority'] = sum(falling.values())
    out['VV_level_sonority'] = sum(level.values())
    out['VV_rising_sonority'] = sum(rising.values())
    # ---------- moras and syllables
    mdist = collections.Counter(moras(r['segs']) for r in content)
    out['mora_dist_content'] = sorted(mdist.items())
    out['monomoraic_content'] = [r['form'] for r in content if moras(r['segs']) == 1]
    # all forms incl. function words
    func = [r for r in nat if not r['content']]
    out['monomoraic_noncontent'] = sorted(r['form'] for r in func if moras(r['segs']) == 1)
    # corpus token mora distribution for content vs function?  just overall
    cm = collections.Counter()
    for w, n in corpus.items():
        segs = list(w)
        cm[moras(segs)] += n
    out['mora_dist_corpus_tokens'] = sorted(cm.items())[:12]
    # V vs CV syllable shares (count nuclei with/without onset)
    onset = collections.Counter()
    for r in content:
        s = r['segs']
        for i, x in enumerate(s):
            if is_v(x):
                onset['C' if i > 0 and s[i - 1] in CONS else 'Ø'] += 1
    out['nucleus_onset'] = dict(onset)
    # ---------- w distribution by preceding vowel (allophony context, not tested)
    wctx = collections.Counter()
    for r in content:
        s = r['segs']
        for i, x in enumerate(s):
            if x == 'w':
                wctx[LONG2SHORT.get(s[i - 1], s[i - 1]) if i > 0 else '#'] += 1
    out['w_preceding'] = dict(wctx)
    json.dump(out, open(os.path.join(HERE, 'phon_stats.json'), 'w'), ensure_ascii=False, indent=1)
    for k, v in out.items():
        print(k, ':', v if not isinstance(v, list) or len(v) < 60 else v[:60])


if __name__ == '__main__':
    main()
