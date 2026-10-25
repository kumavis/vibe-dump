"""Check the generated corpus and its review export together."""
import csv
import json
from pathlib import Path
import os
import subprocess
import sys
import tempfile
import unittest

HERE = Path(__file__).resolve().parent
PACKAGE = HERE.parent.parent


class WordBuildTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.output = tempfile.TemporaryDirectory()
        cls.addClassCleanup(cls.output.cleanup)
        cls.path = Path(cls.output.name)
        subprocess.run(
            [sys.executable, str(HERE / 'build_words.py')],
            env={**os.environ, 'POHAKU_OUT': str(cls.path)},
            check=True, capture_output=True, text=True,
        )
        cls.words = json.loads((cls.path / 'words.js').read_text().split('export const WORDS = ', 1)[1])
        cls.roots = json.loads((cls.path / 'roots.js').read_text().split('export const ROOTS = ', 1)[1])
        cls.by_word = {word['w']: word for word in cls.words}

    def test_review_export_matches_runtime_values(self):
        with (self.path / 'wordlist.tsv').open() as f:
            rows = list(csv.DictReader(f, delimiter='\t'))
        self.assertEqual(len(rows), len(self.words))
        for row in rows:
            with self.subTest(word=row['form']):
                word = self.by_word[row['form']]
                self.assertEqual(
                    [row[key] for key in ('stone_a', 'stone_b', 'gloss', 'field')],
                    [word[key] for key in ('a', 'b', 'g', 'f')],
                )

    def test_attested_senses_and_open_analyses(self):
        expected = {
            'heiheinalu': ('to race on surfboards', 'heihei', 'nalu#0'),
            'hoakipa': ('visitor', 'hoa#0', 'kipa#0'),
            'hākō': ('sugar-cane leaf', 'hā#2', 'kō#0'),
            'kōkō': ('to fulfill; to be pregnant', 'kō#1', 'kō#1'),
        }
        for name, (gloss, a, b) in expected.items():
            with self.subTest(word=name):
                word = self.by_word[name]
                self.assertEqual((word['g'], word['a'], word['b'], word['ev']), (gloss, a, b, 'keep'))
        for sid in ('poi?hiʻipoi', 'ʻau?ʻauwai', 'paʻi?paʻiaʻa', 'olo?olokaʻa'):
            with self.subTest(stone=sid):
                self.assertEqual(self.roots[sid]['g'], '')
        self.assertEqual(self.by_word['pekupeku']['ev'], 'pending')
        self.assertEqual(self.by_word['pīpī wai']['g'], 'to ooze or percolate; sprinkle water')

    def test_stones_spell_each_unique_word(self):
        self.assertEqual(len(self.by_word), len(self.words))
        for word in self.words:
            with self.subTest(word=word['w']):
                self.assertEqual(self.roots[word['a']]['s'] + self.roots[word['b']]['s'], word['w'].replace(' ', ''))

    def test_committed_outputs_are_reproducible(self):
        for name in ('words.js', 'roots.js', 'wordlist.tsv'):
            target = PACKAGE / 'src' / 'data' / name if name.endswith('.js') else HERE.parent / 'review' / name
            with self.subTest(output=name):
                self.assertEqual((self.path / name).read_bytes(), target.read_bytes())


if __name__ == '__main__':
    unittest.main()
