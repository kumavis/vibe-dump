// dims.js — the book's physical constants (book units ≈ metres on a desk).
// Re-exported from book.js, which is where DESIGN.md tells scenes to find them.

export const W = 1.0 // width of one page, spine to outer edge
export const H = 1.4 // height of a page, far edge to near edge
export const LEAF = 0.012 // thickness of one leaf (card stock)
export const COVER = 0.03 // thickness of a cover board
export const OVERHANG = 0.03 // covers overhang the pages by this much
export const LEAVES = 10 // paper leaves between the covers
export const T = 2 * COVER + LEAVES * LEAF // thickness of the closed book
