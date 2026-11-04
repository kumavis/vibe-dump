// The spreads, in reading order. Spread k is the back of leaf k and the front
// of leaf k + 1 (leaf 0 = front cover). Scene authors own their own module.
import intro from './intro.js'
import jhana1 from './jhana-1.js'
import jhana2 from './jhana-2.js'
import jhana3 from './jhana-3.js'
import jhana4 from './jhana-4.js'
import jhana5 from './jhana-5.js'
import jhana6 from './jhana-6.js'
import jhana7 from './jhana-7.js'
import jhana8 from './jhana-8.js'
import outro from './outro.js'

export default [intro, jhana1, jhana2, jhana3, jhana4, jhana5, jhana6, jhana7, jhana8, outro]

// Printed small on the outside of the back cover (DESIGN.md, the story layer).
export const colophon = [
  'Similes from the Sāmaññaphala Sutta, DN 2.',
  'Instructions after Leigh Brasington, Right Concentration.',
  'The formless bases are counted as jhānas five to eight by convention.',
]
