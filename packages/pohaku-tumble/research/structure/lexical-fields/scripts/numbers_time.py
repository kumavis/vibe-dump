#!/usr/bin/env python3
"""Counting & time fields: the traditional NUM4 units (homography), and every numeral frame
in which the digit commutes: kana-N, ʻumi kūmā N, ʻe-/ʻa- N, hapa-N, pā-N, Pōʻa-N, Kū N (moon), kau-N."""
from lex import *
import csv
out = []
def P_(*a):
    s = ' '.join(str(x) for x in a); print(s); out.append(s)
DIG = ['kahi', 'lua', 'kolu', 'hā', 'lima', 'ono', 'hiku', 'walu', 'iwa']

P_('## 1. traditional units (Beckwith 1932:113 via Shionoya 2010; Andrews 1854 §116; Alexander 1920 §29-30)')
units = [('kāuna', 4), ('kaʻau', 40), ('kanahā', 40), ('ʻiako', 40), ('lau', 400), ('mano', 4000), ('kini', 40000), ('lehu', 400000), ('nalowale', 4000000)]
with open(OUT + '/num4_units.tsv', 'w') as f:
    w = csv.writer(f, delimiter='\t')
    w.writerow(['form', 'value', 'W numeral sense?', 'W senses (all)', 'POLLEX (P&E)', 'A entries', 'C tokens', 'other senses = homographs/polysemes'])
    for u, v in units:
        ws = wgloss(u, 10)
        num = any(e['pos'] == 'num' or any(str(v) in g.replace(',', '') or 'forty' in g or 'four' in g for g in e['glosses']) for e in wikt(u))
        row = [u, v, int(num), ws[:200], pgloss(u)[:200], len(andrews(u)), count(u)]
        w.writerow(row); P_('\t'.join(map(str, row)))
for u in ['kauna', 'kaau', 'lau', 'mano', 'kini', 'lehu', 'nalowale', 'iako']:
    for b in andrews(u):
        if any(k in b.lower() for k in ['number', 'four', 'forty', '400', '4,000', '40,000', 'count']):
            P_('A>', b[:240])
P_('corpus: multiplier + unit', phrases(['ʻelua kāuna', 'ʻekolu kāuna', 'hoʻokahi kāuna', 'ʻelua kaʻau', 'hoʻokahi kaʻau', 'ʻelua lau', 'ʻekolu lau', 'hoʻokahi lau', 'kāuna', 'kaʻau']))

P_('\n## 2. digit frames: for each frame, which of the 9 digit cells are attested (W headword / hawwiki tokens)')
frames = {
    'kana- (tens 30-90)': lambda d: 'kana' + d,
    'ʻe- (cardinal)': lambda d: 'ʻe' + d,
    'ʻa- (serial/ordinal)': lambda d: 'ʻa' + d,
    'hapa- (fraction 1/N)': lambda d: 'hapa' + d,
    'pā- (distributive/times)': lambda d: 'pā' + d,
    'Pōʻa- (weekday N)': lambda d: 'pōʻa' + d,
    'ʻumi kūmā- (11-19)': lambda d: 'ʻumikūmā' + d,
    'iwakālua kūmā- (21-29)': lambda d: 'iwakāluakūmā' + d,
    'kau- (N-hulled canoe)': lambda d: 'kau' + d,
}
with open(OUT + '/num_frames.tsv', 'w') as f:
    w = csv.writer(f, delimiter='\t')
    w.writerow(['frame'] + DIG + ['cells W', 'cells C>0'])
    for name, fn in frames.items():
        cells, nw, nc = [], 0, 0
        for d in DIG:
            form = fn(d)
            spaced = None
            cw = bool(wikt(form))
            cc = count(form)
            if name.startswith('ʻumi') or name.startswith('iwak'):
                cc = max(cc, phrase(form.replace('kūmā', ' kūmā ')), count(form.replace('kūmā', 'kumamā')))
            cells.append('%s%s' % ('W' if cw else '-', cc))
            nw += cw; nc += cc > 0
        row = [name] + cells + [nw, nc]
        w.writerow(row); P_('\t'.join(map(str, row)))
P_('glosses:')
for name, fn in frames.items():
    for d in ['lua', 'kolu', 'hā']:
        g = wgloss(fn(d), 3)
        if g:
            P_('  ', fn(d), '=', g[:90])
P_('iwakālua', wgloss('iwakālua'), count('iwakālua'), '| ʻumi', wgloss('ʻumi')[:80], count('ʻumi'), '| kanahā', count('kanahā'))
P_('irregulars: hoʻokahi', count('hoʻokahi'), 'ʻekahi', count('ʻekahi'), 'ʻakahi', count('ʻakahi'), '| hapalua', wgloss('hapalua'), '| kaukahi', wgloss('kaukahi'), '| kaulua', wgloss('kaulua'))

P_('\n## 3. moon-night frame [phase] x [kahi | lua | kolu | pau]  (attested in POLLEX = P&E; Hōkūleʻa list)')
phases = ['kū', 'ʻole kū', 'lāʻau kū', 'kāloa kū', 'ʻole', 'lāʻau', 'kāloa']
ords = ['kahi', 'lua', 'kolu', 'pau']
forms = []
for p in phases:
    for o in ords:
        forms += [p + ' ' + o, (p + o).replace(' ', ''), p + o]
cm = phrases(forms)
for p in phases:
    P_(p, {o: (cm[p + ' ' + o], cm[(p + o).replace(' ', '')], len(andrews(p + o))) for o in ords})
P_('night names in hawwiki:', {n: count(n) for n in ['hilo', 'hoaka', 'kūkahi', 'kūlua', 'kūkolu', 'kūpau', 'huna', 'mōhalu', 'hua', 'akua', 'hoku', 'māhealani', 'kulua', 'kāne', 'lono', 'mauli', 'muku']})

P_('\n## 4. time-of-day / season pairs')
for t in ['ao', 'pō', 'lā', 'kau', 'hoʻoilo', 'kauwela', 'kakahiaka', 'awakea', 'ahiahi', 'aumoe', 'wanaʻao', 'mahina', 'makahiki', 'anahulu', 'pule', 'hebedoma']:
    P_(t, count(t), '|', wgloss(t, 6)[:150], '|', pgloss(t)[:160])
P_(phrases(['ao a pō', 'pō a ao', 'i ke ao', 'i ka pō', 'ka pō a me ke ao', 'ke ao a me ka pō', 'kau wela', 'kau hoʻoilo', 'ka pō nei', 'kēia pō']))
open(OUT + '/numbers_time_report.txt', 'w').write('\n'.join(out))
