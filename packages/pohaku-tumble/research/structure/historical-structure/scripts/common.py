"""Shared helpers: load POLLEX Hawaiian reflexes, tokenize Polynesian forms into (C)V units.

Every form is reduced to a common phonemic alphabet:
  vowels a e i o u (long vowels = two identical units, as POLLEX writes them doubled)
  consonants p t k q(=ʔ in reflexes written 'ʔ' is mapped to 'ʔ') m n ŋ f s h w v l r
Proto forms keep *q (PPN glottal) distinct from reflex ʔ.
"""
import json, re, unicodedata

POLLEX = 'roots/.cache/pollex/hawaiian-reflexes.json'
WIKT = 'roots/.cache/wiktionary.json'
KAIKKI = 'roots/.cache/kaikki-haw.jsonl'
COMPOUNDS = 'roots/compounds.tsv'
ROOTS = 'roots/roots.tsv'
REVIEW_GLOB = 'review/(scratch) review/batch-*.json'
OUT = 'structure/historical-structure'

VOW = set('aeiou')

def load_pollex():
    return json.load(open(POLLEX))

def to_okina(raw):
    """POLLEX Hawaiian (ʔ, doubled vowels) -> modern spelling (ʻ, precomposed kahakō)."""
    s = raw.replace('ʔ', 'ʻ').replace('’', 'ʻ')
    mac = {'aa': 'ā', 'ee': 'ē', 'ii': 'ī', 'oo': 'ō', 'uu': 'ū'}
    out = ''
    i = 0
    low = s
    while i < len(low):
        pair = low[i:i+2].lower()
        if pair in mac and low[i] == low[i+1].lower() or (pair in mac and low[i].lower() == low[i+1]):
            ch = mac[pair]
            out += ch.upper() if low[i].isupper() else ch
            i += 2
        else:
            out += low[i]
            i += 1
    return unicodedata.normalize('NFC', out)

# language-specific normalisation to the common alphabet ---------------------------------
def norm(form, lang):
    f = form.strip().lower()
    f = f.replace('’', 'ʔ').replace("'", 'ʔ')
    if lang in ('Maori',):
        f = f.replace('ng', 'ŋ').replace('wh', 'f')
    elif lang == 'Tongan':
        f = f.replace('ng', 'ŋ')
    elif lang == 'Samoan':
        f = f.replace('g', 'ŋ')
    elif lang == 'proto':
        f = f.lstrip('*')
    return f

CONS = {
    'proto': set('ptkqmnŋfshwvlr'),
    'Hawaiian': set('pkʔmnhwlv'),
    'Maori': set('ptkmnŋfhwr'),
    'Tahitian': set('pʔmnfhvrt'),
    'Samoan': set('ptkʔmnŋfsvlh'),
    'Tongan': set('ptkʔmnŋfhvls'),
}

def units(f, lang):
    """Split a cleaned form into [(onset, vowel), ...]; None if not strictly (C)V."""
    cons = CONS[lang]
    out = []
    onset = ''
    for ch in f:
        if ch in VOW:
            out.append((onset, ch))
            onset = ''
        elif ch in cons:
            if onset:  # cluster
                return None
            onset = ch
        else:
            return None
    if onset:  # word-final consonant
        return None
    return out

def clean_strict(form, lang):
    """Only forms made purely of the language's letters (no slash, brackets, spaces, accents)."""
    f = norm(form, lang)
    if lang == 'proto':
        f = f.replace('-', '')
    if not f or re.search(r'[^a-zʔŋ]', f):
        return None
    u = units(f, lang)
    return u
