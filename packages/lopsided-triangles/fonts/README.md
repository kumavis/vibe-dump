# Fonts

Subsets of the Computer Modern Unicode fonts (Knuth's Computer Modern and
Concrete, Walter Schmidt's CM Bright), cut down to the Latin, Greek, arrow and
math-operator ranges this page uses and converted to WOFF2. The SIL Open Font
License treats a subset as a Modified Version, which may not carry the Reserved
Font Name "Computer Modern Unicode fonts", so the families are renamed `LT …`
inside the files. The license is in `OFL.txt`.

| file                 | source face                       | used for            |
| -------------------- | --------------------------------- | ------------------- |
| `lt-serif-bx.woff2`  | CMU Serif Bold Extended           | headings            |
| `lt-serif-b.woff2`   | CMU Serif Bold Nonextended        | hero title          |
| `lt-serif.woff2`     | CMU Serif Roman                   | math, big numbers   |
| `lt-serif-it.woff2`  | CMU Serif Italic                  | math variables      |
| `lt-concrete*.woff2` | CMU Concrete Roman, Italic, Bold  | running text        |
| `lt-bright*.woff2`   | CMU Bright Roman, SemiBold        | controls and charts |
| `lt-tt.woff2`        | CMU Typewriter Text               | strings of terms    |
| `lt-math.woff2`      | MathJax_Main (TeX)                | ≤ ≈ ≡ ⌊ ⌋ and kin   |
| `lt-math-it.woff2`   | MathJax_Math Italic (TeX)         | math variables      |

The Computer Modern Unicode text fonts carry no mathematical operators, and
their italic Greek is text Greek, whose α is hard to tell from an a. So two
faces come from MathJax's TeX fonts, which are Knuth's math fonts:
`lt-math.woff2` (a subset of MathJax_Main) for operators and
`lt-math-it.woff2` (a subset of MathJax_Math Italic) for variables, Latin and
Greek. They are also under the SIL Open Font License, with Reserved Font Names
"MathJax_Main" and "MathJax_Math", and are renamed `LT Math` and
`LT Math Italic` for the same reason; their license is in `OFL-MathJax.txt`.
