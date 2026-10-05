"""Hand classification (mine, from the Wikipedia context) of every token whose a/o
class goes against the grammars' prediction for its noun (tables/minority_raw.tsv).

Codes
  M  meaningful: the choice is what the control rule predicts once the actual sense or
     possessor is taken into account (inanimate possessor -> o; product made by the
     possessor -> a; business premises are not 'spatial use' -> a; image / history /
     story *about* the possessor -> o; sweetheart = person -> a; acting role taken on
     -> a; 'waiwai' = value of a thing -> o; style/method of the possessor's own
     activity -> a)
  E  apparent error: the sense is the one the grammars name and the class is the other
  U  unclear: sense or possessor undecidable from the snippet, homograph, English
     compound, garbled text
Rules are (noun, substring of context) -> (code, reason); first match wins, then a
per-noun default.
"""
import os, collections

HERE = os.path.dirname(os.path.abspath(__file__))
RULES = [
    ('aloha', 'aloha mua', 'M', 'sweetheart (a person loved) -> a'),
    ('hale', '', 'M', 'business premises (restaurant, printing house) are not spatial use -> a'),
    ('hana', 'hana ʻia ʻana', 'M', 'patient of passive nominalisation -> o'),
    ('haumāna', 'kula', 'M', 'inanimate possessor (a school) -> o'),
    ('home', 'home run', 'U', 'English compound'),
    ('kaʻa', 'carl benz', 'M', 'a car he built (product) -> a'),
    ('kaʻa', 'haleʻaina', 'U', 'garbled'),
    ('kiʻi', 'kfc', 'M', 'his image used in advertising (image of possessor) -> o'),
    ('kiʻi', 'kikako', 'M', 'inanimate possessor (a city) -> o'),
    ('kiʻi', 'mea loiloi', 'M', 'inanimate possessor (a film) -> o'),
    ('kiʻi', 'kāʻeʻaʻeʻa', 'M', 'his image / persona -> o'),
    ('kūlana', '', 'M', 'acting role taken on (vs status) -> a'),
    ('moʻolelo', 'haʻawina', 'U', ''),
    ('moʻolelo', '', 'M', 'story / history about the possessor, or of an inanimate (game, film) -> o'),
    ('noho', 'noho aliʻi', 'M', 'reign (an activity he performed) -> a'),
    ('pule', '', 'U', 'homograph: pule "week"'),
    ('waiwai', 'ma luna o', 'U', ''),
    ('waiwai', '', 'M', '"value, worth" of a thing or animal (inherent quality) -> o'),
    ('ʻano', 'ʻano ʻona', 'U', ''),
    ('ʻano', 'carcharodon', 'U', ''),
    ('ʻano', '', 'M', 'style / method of the possessor\'s own activity -> a'),
    ('ʻili', '', 'U', 'video-game "skin"'),
    ('mele', 'honehone', 'U', ''),
    ('mele', 'uaʻike', 'U', 'garbled'),
    ('mele', 'kona mele', 'U', 'could be a song about him'),
    ('mele', '', 'E', 'songs he composed -> a expected'),
    ('kaʻa', '', 'E', 'his own car -> o expected (vehicle)'),
    ('manaʻo', '', 'U', 'ideas he advanced vs his mind: not decidable from the grammars consulted'),
    ('makemake', 'ʻahaʻōlelo', 'E', 'desire -> o expected'),
]
DEFAULT = {
    'kaikuaʻana': ('E', 'sibling -> o expected'), 'kaikuahine': ('E', 'sibling -> o expected'),
    'kūpuna': ('E', 'ancestors -> o expected'), 'lima': ('E', 'body part -> o expected'),
    'mōʻī': ('E', 'ruler -> o expected'), 'kaikamahine': ('E', 'daughter -> a expected'),
    'keiki': ('E', 'child -> a expected'), 'keikikāne': ('E', 'son -> a expected'),
    'kamaliʻi': ('E', 'children -> a expected'), 'moʻopuna': ('E', 'grandchild -> a expected'),
    'kāne': ('E', 'husband -> a expected'), 'wahine': ('E', 'wife -> a expected'),
    'limahana': ('E', 'workers -> a expected'), 'puke': ('E', 'books he wrote -> a expected'),
}


def main():
    rows = [l.rstrip('\n').split('\t') for l in open(os.path.join(HERE, 'tables', 'minority_raw.tsv'))]
    out = []
    for noun, cat, pred, cls, ctx in rows:
        code, why = None, ''
        for n, sub, c, w in RULES:
            if n == noun and sub in ctx:
                code, why = c, w
                break
        if code is None:
            code, why = DEFAULT.get(noun, ('U', 'sense or possessor not decidable from snippet'))
        out.append((noun, cat, pred, cls, code, why, ctx))
    with open(os.path.join(HERE, 'tables', 'minority_coded.tsv'), 'w') as fh:
        fh.write('noun\tcategory\tpredicted\tobserved\tcode\treason\tcontext\n')
        for r in out:
            fh.write('\t'.join(r) + '\n')
    c = collections.Counter(r[4] for r in out)
    print('minority tokens', len(out), dict(c))
    for code in 'MEU':
        print(code, collections.Counter(r[0] for r in out if r[4] == code).most_common())


if __name__ == '__main__':
    main()
