// The whole palette (DESIGN §6). Warm paper and kukui-soot ink, one ʻalaea red
// used for boundaries only, and basalt for the stones. No teal, no coral.

export const PAPER = '#e8dcc3' // the map: old survey paper, beaten bark cloth
export const PAPER_2 = '#efe6d3' // card stock
export const INK = '#2a211b' // kukui-soot brown-black
export const INK_2 = '#5a4c40' // secondary text
export const INK_3 = '#8d7d6c' // contours, quiet labels
export const OCHRE = '#9c3f24' // ʻalaea: ahupuaʻa and moku boundaries, the active field line
export const STONE = '#33302c' // basalt body
export const STONE_LIGHT = '#b3aca1' // pecked letter, where the dark skin is broken
export const SHADOW = '#4a3a2c' // warm brown shadows on the paper

// Canvas font strings. The CSS @font-face in style.css registers these families.
export const SERIF = "'PT Alegreya'"
export const font = (px, { weight = 400, italic = false } = {}) => `${italic ? 'italic ' : ''}${weight} ${px}px ${SERIF}, serif`
