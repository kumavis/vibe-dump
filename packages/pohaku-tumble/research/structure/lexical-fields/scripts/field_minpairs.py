#!/usr/bin/env python3
"""Inside each field: are any two terms phonemic minimal pairs (one segment, incl. okina and
vowel length), and if so is the difference a field feature?  Plus the plural-by-lengthening
series among human/kin nouns (Wiktionary 'plural of')."""
from lex import *
import itertools
FIELDS = {
 'kinship': ['kupuna', 'makua', 'makuahine', 'kaikuaʻana', 'kaikaina', 'kaikunāne', 'kaikuahine', 'kaikoʻeke', 'keiki', 'kaikamahine', 'moʻopuna', 'kāne', 'wahine', 'hoahānau', 'kama', 'kamaliʻi', 'pōkiʻi', 'hiapo', 'muli', 'hūnōna', 'punalua', 'ʻohana'],
 'space': ['luna', 'lalo', 'loko', 'waho', 'mua', 'hope', 'uka', 'kai', 'waena', 'muli', 'ʻō', 'laila', 'ʻaneʻi', 'ʻākau', 'hema', 'hikina', 'komohana', 'mauka', 'makai', 'alo', 'kua', 'koʻolau', 'kona', 'hoʻolua', 'malanai'],
 'count': ['kāuna', 'kaʻau', 'kanahā', 'ʻiako', 'lau', 'mano', 'kini', 'lehu', 'kahi', 'lua', 'kolu', 'hā', 'lima', 'ono', 'hiku', 'walu', 'iwa', 'ʻumi', 'iwakālua'],
 'time': ['ao', 'pō', 'lā', 'kau', 'hoʻoilo', 'kauwela', 'kakahiaka', 'awakea', 'ahiahi', 'aumoe', 'mahina', 'makahiki', 'anahulu', 'pule', 'hilo', 'hoaka', 'kū', 'ʻole', 'huna', 'mōhalu', 'hua', 'akua', 'hoku', 'māhealani', 'kulua', 'lāʻau', 'kāloa', 'kāne', 'lono', 'mauli', 'muku'],
 'colour': ['keʻokeʻo', 'ʻeleʻele', 'ʻulaʻula', 'uliuli', 'melemele', 'lenalena', 'ʻōmaʻomaʻo', 'ʻāhinahina', 'poni', 'ʻākala', 'mākuʻe', 'polū', 'ʻalani', 'kea', 'ʻula', 'uli', 'mele', 'keʻo', 'ʻele', 'maʻo', 'hina', 'lena', 'lehu', 'pano', 'lipo'],
 'body': ['poʻo', 'maka', 'ihu', 'waha', 'lae', 'alo', 'kua', 'lima', 'wāwae', 'piko', 'naʻau', 'puʻuwai', 'ʻāʻī', 'poʻohiwi', 'kino', 'umauma', 'ʻōpū', 'niho', 'nuku', 'pepeiao', 'lauoho', 'hulu', 'iwi', 'ʻili', 'kuli', 'kuʻekuʻe', 'manamana', 'alelo', 'koko', 'ʻiʻo', 'kapuaʻi', 'ake', 'ʻēheu', 'huelo', 'ʻūhā'],
}
LONG = {'ā': 'a', 'ē': 'e', 'ī': 'i', 'ō': 'o', 'ū': 'u'}
def segs(w):
    return list(w)
def onediff(a, b):
    a, b = segs(a), segs(b)
    if len(a) == len(b):
        d = [(x, y) for x, y in zip(a, b) if x != y]
        return d if len(d) == 1 else None
    if abs(len(a) - len(b)) == 1:
        s, l = (a, b) if len(a) < len(b) else (b, a)
        for i in range(len(l)):
            if l[:i] + l[i + 1:] == s:
                return [('Ø', l[i])]
    return None
tot = 0
for f, ts in FIELDS.items():
    prs = [(a, b, onediff(a, b)) for a, b in itertools.combinations(sorted(set(ts)), 2) if onediff(a, b)]
    tot += len(prs)
    print(f, 'terms', len(set(ts)), 'pairs', len(set(ts)) * (len(set(ts)) - 1) // 2, 'minimal pairs:', [(a, b, d[0]) for a, b, d in prs])
print('total minimal pairs inside fields:', tot)
print('\nplural by lengthening among Wiktionary "plural of" entries:')
pl = []
for w, es in W().items():
    for e in es:
        for g in e['glosses']:
            if g.startswith('plural of '):
                base = norm(g[len('plural of '):].split()[0].strip('.,'))
                d = onediff(base, w)
                if d and d[0][1] in LONG and LONG[d[0][1]] == d[0][0]:
                    pl.append((base, w, wgloss(base, 2)[:50]))
for x in sorted(set(pl)):
    print('  ', x, 'C=', count(x[0]), '/', count(x[1]))
print('n =', len(set(pl)))
