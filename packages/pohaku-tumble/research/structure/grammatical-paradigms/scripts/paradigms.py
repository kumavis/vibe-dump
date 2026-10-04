"""The closed paradigms analysed here, as data: form -> features.
Forms are in Pukui-Elbert-style modern spelling (as given by POLLEX / Wiktionary
where they exist). Features are my structural analysis, not a source's."""

# ---------------------------------------------------------------- personal pronouns
# person: 1in (inclusive) 1ex (exclusive) 1 (singular speaker) 2 3 ; number sg du pl
PRONOUNS = [
    ('au',      {'person': '1',   'number': 'sg'}),
    ('wau',     {'person': '1',   'number': 'sg', 'variant_of': 'au'}),
    ('ʻoe',     {'person': '2',   'number': 'sg'}),
    ('ia',      {'person': '3',   'number': 'sg'}),
    ('kāua',    {'person': '1in', 'number': 'du'}),
    ('māua',    {'person': '1ex', 'number': 'du'}),
    ('ʻolua',   {'person': '2',   'number': 'du'}),
    ('lāua',    {'person': '3',   'number': 'du'}),
    ('kākou',   {'person': '1in', 'number': 'pl'}),
    ('mākou',   {'person': '1ex', 'number': 'pl'}),
    ('ʻoukou',  {'person': '2',   'number': 'pl'}),
    ('lākou',   {'person': '3',   'number': 'pl'}),
]

# ---------------------------------------------------------------- singular possessive grid
# onset: Ø (after prepositions), k (determiner), n (benefactive/agentive predicate);
# class: a / o / neutral ; person 1 2 3
POSSESSIVES = [
    ('aʻu',  {'onset': 'Ø', 'class': 'a', 'person': '1'}),
    ('āu',   {'onset': 'Ø', 'class': 'a', 'person': '2'}),
    ('āna',  {'onset': 'Ø', 'class': 'a', 'person': '3'}),
    ('oʻu',  {'onset': 'Ø', 'class': 'o', 'person': '1'}),
    ('ou',   {'onset': 'Ø', 'class': 'o', 'person': '2'}),
    ('ona',  {'onset': 'Ø', 'class': 'o', 'person': '3'}),
    ('kaʻu', {'onset': 'k', 'class': 'a', 'person': '1'}),
    ('kāu',  {'onset': 'k', 'class': 'a', 'person': '2'}),
    ('kāna', {'onset': 'k', 'class': 'a', 'person': '3'}),
    ('koʻu', {'onset': 'k', 'class': 'o', 'person': '1'}),
    ('kou',  {'onset': 'k', 'class': 'o', 'person': '2'}),
    ('kona', {'onset': 'k', 'class': 'o', 'person': '3'}),
    ('naʻu', {'onset': 'n', 'class': 'a', 'person': '1'}),
    ('nāu',  {'onset': 'n', 'class': 'a', 'person': '2'}),
    ('nāna', {'onset': 'n', 'class': 'a', 'person': '3'}),
    ('noʻu', {'onset': 'n', 'class': 'o', 'person': '1'}),
    ('nou',  {'onset': 'n', 'class': 'o', 'person': '2'}),
    ('nona', {'onset': 'n', 'class': 'o', 'person': '3'}),
    ('kuʻu', {'onset': 'k', 'class': 'neutral', 'person': '1'}),
    ('kō',   {'onset': 'k', 'class': 'neutral', 'person': '2'}),
]
# possessive particles used with nouns, names and non-singular pronouns
POSS_PARTICLES = [
    ('a',  {'onset': 'Ø', 'class': 'a'}), ('o',  {'onset': 'Ø', 'class': 'o'}),
    ('kā', {'onset': 'k', 'class': 'a'}), ('ko', {'onset': 'k', 'class': 'o'}),
    ('na', {'onset': 'n', 'class': 'a'}), ('no', {'onset': 'n', 'class': 'o'}),
]

# ---------------------------------------------------------------- deixis
# series: kē (determiner), pē (manner), ʻa/ʻo (locative noun), e/a (presentative),
#         post (postposed particle), Ø (preposed intimate demonstrative)
# column: 1 (near speaker) 2 (near addressee) 3 (distal) Q (interrogative) ana (anaphoric)
DEIXIS = [
    ('kēia',   {'series': 'kē', 'col': '1'}),
    ('kēnā',   {'series': 'kē', 'col': '2'}),
    ('kēlā',   {'series': 'kē', 'col': '3'}),
    ('pēia',   {'series': 'pē', 'col': '1'}),
    ('penei',  {'series': 'pē', 'col': '1'}),
    ('pēnā',   {'series': 'pē', 'col': '2'}),
    ('pēlā',   {'series': 'pē', 'col': '3'}),
    ('pehea',  {'series': 'pē', 'col': 'Q'}),
    ('nei',    {'series': 'post', 'col': '1'}),
    ('nā',     {'series': 'post', 'col': '2'}),
    ('lā',     {'series': 'post', 'col': '3'}),
    ('ala',    {'series': 'post', 'col': '3'}),
    ('ʻaneʻi', {'series': 'loc', 'col': '1'}),
    ('ʻoneʻi', {'series': 'loc', 'col': '1'}),
    ('ʻanā',   {'series': 'loc', 'col': '2'}),
    ('ʻonā',   {'series': 'loc', 'col': '2'}),
    ('ʻō',     {'series': 'loc', 'col': '3'}),
    ('laila',  {'series': 'loc', 'col': 'ana'}),
    ('hea',    {'series': 'loc', 'col': 'Q'}),
    ('eia',    {'series': 'pres', 'col': '1'}),
    ('aia',    {'series': 'pres', 'col': '3'}),
    ('ia',     {'series': 'det', 'col': 'ana'}),
    ('ua',     {'series': 'det', 'col': 'ana'}),
    ('nēia',   {'series': 'Ø', 'col': '1'}),
]

DIRECTIONALS = [
    ('mai',  {'axis': 'deictic',  'value': 'toward deictic centre'}),
    ('aku',  {'axis': 'deictic',  'value': 'away from deictic centre'}),
    ('aʻe',  {'axis': 'vertical', 'value': 'up / sideways / next'}),
    ('iho',  {'axis': 'vertical', 'value': 'down / self / thereupon'}),
    ('maila', {'axis': 'deictic', 'value': 'mai + lā'}),
    ('akula', {'axis': 'deictic', 'value': 'aku + lā'}),
    ('aʻela', {'axis': 'vertical', 'value': 'aʻe + lā'}),
    ('ihola', {'axis': 'vertical', 'value': 'iho + lā'}),
]

ARTICLES = [
    ('ka',     {'def': '+', 'number': 'sg'}),
    ('ke',     {'def': '+', 'number': 'sg'}),
    ('nā',     {'def': '+', 'number': 'pl'}),
    ('he',     {'def': '-', 'number': 'unmarked'}),
    ('kekahi', {'def': 'specific-indef', 'number': 'sg (pl with mau)'}),
    ('mau',    {'def': None, 'number': 'pl marker'}),
    ('ia',     {'def': 'anaphoric', 'number': 'unmarked'}),
    ('ua',     {'def': 'anaphoric (+nei/lā)', 'number': 'unmarked'}),
]

ALL = {'pronouns': PRONOUNS, 'possessives': POSSESSIVES, 'poss_particles': POSS_PARTICLES,
       'deixis': DEIXIS, 'directionals': DIRECTIONALS, 'articles': ARTICLES}
