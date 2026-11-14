// PatinaMaterial — MeshStandardMaterial + a layered burial-corrosion model
// (research/02 §2–§6 is the authority for every colour and number here).
//
// A Shang bronze out of the ground is a stack, built from the metal outward
// (research/02 §3.1–3.2):
//   metal (Cu–Sn–Pb: F0 from the tin table, lead dulls it) → tarnish film →
//   [black inlay paste in the sunk lines, as made] → cuprite Cu₂O (liver /
//   oxblood, sub-metallic sheen, on the metal everywhere) → EITHER the noble
//   tin-oxide sheet (Type I: black / olive / grey, glossy, keeps the cast
//   surface) OR the carbonate crust (Type II: malachite, botryoidal and
//   banded, with azurite islands), per territory → soot low on the body →
//   chloride pustules punched through from the metal → burial earth and a
//   calcareous film packed into recesses and onto the side that lay down.
// Handling and cleaning then ERASE from the top down on convex arrises
// (§3.4.9): earth → crust → noble sheet → cuprite → burnished warm metal.
//
// Every mesh of a vessel shares ONE uniform set (`patina`), so a single slider
// re-ages the whole vessel. Per-material state is only the relief textures and
// two small hints (constant cavity, interior). Noise runs in VESSEL space, mm:
// positions go through a shared matrix the stage sets from the vessel root
// (`setPatinaVessel`), so territories run continuously across separately built
// parts and stay put if the vessel is turned.

import * as THREE from 'three'
import { noiseChunk } from './noise.glsl.js'

/**
 * Parameter metadata — the Patina drawer is generated from this. Grouped the
 * way a conservator would describe a surface. Defaults are a mid excavated look.
 * Physical units where research/02 §6 gives them (tin / lead as weight
 * fractions, thicknesses and scales in mm).
 */
export const PATINA_PARAMS = {
  age: { group: 'master', label: 'Time in the ground', min: 0, max: 1, step: 0.005, default: 1 },
  // Alloy
  tin: { group: 'Alloy', label: 'Tin (Sn wt)', min: 0, max: 0.3, step: 0.005, default: 0.14, hint: 'F0 from the §1.2 table: copper-pink → warm gold (0.12) → pale gold → speculum' },
  lead: { group: 'Alloy', label: 'Lead (Pb wt)', min: 0, max: 0.25, step: 0.005, default: 0.03, hint: 'greys and dulls the metal' },
  polish: { group: 'Alloy', label: 'Polish', min: 0, max: 1, step: 0.01, default: 0.6, hint: 'abraded fields / relief tops: roughness 0.40 → 0.12; recesses stay as-cast' },
  tarnish: { group: 'Alloy', label: 'Tarnish', min: 0, max: 1, step: 0.01, default: 0.5, hint: 'thin oxide film: gold → brown-gold' },
  // Carbonates & blue — malachite, the blue-green (chrysocolla-like) phase and azurite are
  // separate minerals in separate territories: the balance moves area between them, it never
  // hue-rotates one colour
  malachite: { group: 'Carbonates & blue', key: true, label: 'Carbonate crust', min: 0, max: 1, step: 0.01, default: 0.6, hint: 'how much of the surface the copper carbonates take' },
  carbonate: { group: 'Carbonates & blue', key: true, label: 'Carbonate balance', min: 0, max: 1, step: 0.01, default: 0, hint: '0 malachite green · 0.5 pale blue-green / turquoise phase · 1 azurite blue — by territory, never a teal blend' },
  azurite: { group: 'Carbonates & blue', key: true, label: 'Azurite', min: 0, max: 0.6, step: 0.01, default: 0.05, hint: 'blue islands on top of / among the carbonates' },
  azuriteDepth: { group: 'Carbonates & blue', label: 'Depth of blue', min: 0, max: 1, step: 0.01, default: 0.5, hint: 'pale powdery sky blue → deep crystalline ultramarine' },
  azuriteScale: { group: 'Carbonates & blue', label: 'Azurite patch', min: 3, max: 60, step: 0.5, default: 14, unit: 'mm' },
  blueHabitat: { group: 'Carbonates & blue', label: 'Blue lives in', min: 0, max: 1, step: 0.01, default: 0.5, hint: '0 recesses and grooves · 1 open crust patches' },
  turquoiseTone: { group: 'Carbonates & blue', label: 'Blue-green tone', min: 0, max: 1, step: 0.01, default: 0.3, hint: 'the turquoise / chrysocolla-like phase: pale chalky → deep sea blue-green' },
  malachiteHue: { group: 'Carbonates & blue', label: 'Malachite hue', min: 0, max: 1, step: 0.01, default: 0.45, hint: 'blue-green → yellow-green' },
  malachiteTone: { group: 'Carbonates & blue', label: 'Malachite tone', min: 0, max: 1, step: 0.01, default: 0.5, hint: 'dark compact wet-looking → pale earthy crust' },
  islands: { group: 'Carbonates & blue', label: 'Film ↔ islands', min: 0, max: 1, step: 0.01, default: 0.6, hint: '0 thin translucent films that fade out · 1 sharp-edged crust islands' },
  malachiteScale: { group: 'Carbonates & blue', label: 'Crust grain', min: 0.5, max: 8, step: 0.1, default: 2, unit: 'mm', hint: 'botryoidal dome size' },
  crust: { group: 'Carbonates & blue', label: 'Crust thickness', min: 0, max: 4, step: 0.05, default: 1, unit: 'mm', hint: 'thick crust fills the line work' },
  // Other corrosion
  tinOxide: { group: 'Other corrosion', label: 'Noble patina', min: 0, max: 1, step: 0.01, default: 0.2, hint: 'Type I tin-oxide skin territories (water patina): dark, smooth, keeps the cast surface' },
  tinOxideTone: { group: 'Other corrosion', label: 'Noble tone', min: 0, max: 2, step: 0.01, default: 1, hint: '0 black 黑漆古 · 1 olive · 2 grey 水银古' },
  nobleRelief: { group: 'Other corrosion', label: 'Noble on raised décor', min: -1, max: 1, step: 0.01, default: 1, hint: 'how much paler the noble skin is on raised décor than on the ground: 1 paler plateaus · 0 the field tone · −1 darker plateaus (Houmuwu: friezes read darker than the plain field)' },
  nobleWarmth: { group: 'Other corrosion', label: 'Noble warmth', min: 0, max: 1, step: 0.01, default: 0, hint: 'olive-green skin → warm grey-brown (a thin sheet with the cuprite glowing through)' },
  cuprite: { group: 'Other corrosion', label: 'Cuprite', min: 0, max: 1, step: 0.01, default: 0.7, hint: 'red-brown Cu₂O on the metal, shows where the crust is thin or worn' },
  cupriteTone: { group: 'Other corrosion', label: 'Cuprite tone', min: 0, max: 1, step: 0.01, default: 0, hint: '0 compact liver / oxblood · 1 pale powdery brick-pink, unveiled (cuprite blotches under a lime bloom, Houmuwu fields)' },
  chloride: { group: 'Other corrosion', label: 'Chloride', min: 0, max: 1, step: 0.01, default: 0.08, hint: 'bronze disease: pale powdery pustules over pits' },
  soot: { group: 'Other corrosion', label: 'Soot', min: 0, max: 1, step: 0.01, default: 0, hint: 'tenorite/soot on the lower body and legs (fire)' },
  crevice: { group: 'Other corrosion', label: 'Crevice bias', min: 0, max: 1, step: 0.01, default: 0.7, hint: 'how strongly crust prefers recesses' },
  patchScale: { group: 'Other corrosion', label: 'Territory size', min: 20, max: 200, step: 1, default: 70, unit: 'mm' },
  mottleScale: { group: 'Other corrosion', label: 'Mottle size', min: 3, max: 40, step: 0.5, default: 12, unit: 'mm' },
  patchiness: { group: 'Other corrosion', label: 'Territories ↔ fine mottle', min: 0, max: 1, step: 0.01, default: 1, hint: '1 broad territories and crust islands · 0 every layer breaks up at the mottle size instead (a fine speckled skin, no large blotches)' },
  softness: { group: 'Other corrosion', label: 'Soft mottle', min: 0, max: 1, step: 0.01, default: 0, hint: '0 crisp layer edges · 1 every layer edge feathers into the next and the fine grain drops to a whisper: low-contrast blended mottle, no dots' },
  drift: { group: 'Other corrosion', label: 'Slow tone drift', min: 0, max: 1, step: 0.01, default: 0, hint: 'a slow drift of lightness and warmth across the skin at the territory size (50–200 mm)' },
  lowerBody: { group: 'Other corrosion', label: 'Lower body', min: 0, max: 1, step: 0.01, default: 0, hint: 'legs and foot below the lower-body height: darker and greener skin (Houmuwu legs)' },
  lowerHeight: { group: 'Other corrosion', label: 'Lower body height', min: 0, max: 1, step: 0.01, default: 0.35, hint: 'fraction of the vessel height where the lower-body skin fades out' },
  lowerColor: { group: 'Other corrosion', label: 'Lower body tint', type: 'color', default: '#a1bea3', hint: 'multiplies the lower-body skin: green-grey darkens and greens it (Houmuwu legs), a warm tint gives a red-brown foot band (Met fangyi)' },
  plainTone: { group: 'Other corrosion', label: 'Plain parts tone', min: 0.2, max: 1.5, step: 0.01, default: 1, hint: 'multiplies the skin on plain, undecorated surfaces (knob stem, neck band, plain fields): < 1 darker than the décor (Nezu)' },
  upperTone: { group: 'Other corrosion', label: 'Upper body tone', min: 0.4, max: 1.4, step: 0.01, default: 1, hint: 'multiplies the skin above the upper-body height: < 1 a darker lid (fangyi) or trumpet (gu) than the body' },
  upperHeight: { group: 'Other corrosion', label: 'Upper body height', min: 0, max: 1, step: 0.01, default: 0.65, hint: 'fraction of the vessel height where the upper-body tone starts' },
  rimCalm: { group: 'Other corrosion', label: 'Calm rim & handles', min: 0, max: 1, step: 0.01, default: 0, hint: 'the upper part of the vessel (above ~60 % of its height): plain parts (rim, handles) and up-facing faces lose the wall mottle: one worn skin; plain parts anywhere (flanges, legs) also lose the fine speckle' },
  // Grain & crust (round 4b): the mm-scale texture of a real excavated skin. Each is thresholded
  // (hard-edged up close) and filtered to its mean coverage once its grain drops under a pixel,
  // so at vessel distance it reads as a mixed tone, never as dots
  speckle: { group: 'Grain & crust', key: true, label: 'Fine speckle', min: 0, max: 1, step: 0.01, default: 0, hint: 'a dense mm-scale speckle of a second mineral interleaved with the skin (Houmuwu red cuprite, Met fangyi dark-green specks); amount ≈ area' },
  speckleScale: { group: 'Grain & crust', label: 'Speckle grain', min: 0.5, max: 8, step: 0.1, default: 2, unit: 'mm' },
  speckleColor: { group: 'Grain & crust', label: 'Speckle colour', type: 'color', default: '#8f5a48' },
  speckleDecor: { group: 'Grain & crust', label: 'Speckle avoids décor', min: 0, max: 1, step: 0.01, default: 0, hint: '0 everywhere · 1 only on the plain fields, off the décor bands (Houmuwu: red panels, greyer friezes)' },
  crustIsles: { group: 'Grain & crust', key: true, label: 'Crust islands', min: 0, max: 1, step: 0.01, default: 0, hint: 'hard-edged, ragged, fully matte islands of pale earthy crust (grey-green, buff); amount ≈ area where they live' },
  crustScale: { group: 'Grain & crust', label: 'Crust island size', min: 2, max: 30, step: 0.5, default: 8, unit: 'mm' },
  crustColor: { group: 'Grain & crust', label: 'Crust colour', type: 'color', default: '#8b8e78' },
  crustPlace: { group: 'Grain & crust', label: 'Crust lives on', min: 0, max: 1, step: 0.01, default: 0.6, hint: '0 décor recesses and friezes · 1 arrises, plain bands, rim, flanges and the lower body' },
  pustules: { group: 'Grain & crust', label: 'Malachite pustules', min: 0, max: 1, step: 0.01, default: 0, hint: 'saturated emerald pustules (2–10 mm) in clusters, weighted to the rim lip, the foot and recesses' },
  pustuleScale: { group: 'Grain & crust', label: 'Pustule size', min: 2, max: 14, step: 0.5, default: 5, unit: 'mm' },
  pustuleColor: { group: 'Grain & crust', label: 'Pustule colour', type: 'color', default: '#2e7658' },
  grain: { group: 'Grain & crust', label: 'Skin grain', min: 0, max: 1, step: 0.01, default: 0, hint: 'soft multi-scale breathing of lightness, hue and roughness at 2–10 mm on every surface (no dots): plain walls stop reading as dead-flat paint' },
  tint: { group: 'Grain & crust', label: 'Skin tint', type: 'color', default: '#ffffff', hint: 'multiplies the whole corroded skin: a last hue correction (white = none)' },
  // Surface
  matte: { group: 'Surface', key: true, label: 'Matte (dry skin)', min: 0, max: 1, step: 0.01, default: 0, hint: 'micro-pitted, dusty excavated skin: no broad glossy highlights. 0 keeps each layer’s own sheen (as-cast, heirloom)' },
  dulling: { group: 'Surface', label: 'Dulling', min: 0, max: 1, step: 0.01, default: 0, hint: 'dust, old wax and fine soil in the pores grey every mineral colour down' },
  tops: { group: 'Surface', key: true, label: 'Relief tops', min: 0, max: 1, step: 0.01, default: 0, hint: 'relief tops rubbed clean: darker, warmer, smoother skin — the décor reads' },
  topsTone: { group: 'Surface', label: 'Relief tops tone', min: 0, max: 1, step: 0.01, default: 0, hint: '0 rubbed darker & warmer · 1 paler silvery-grey bands (flush décor read by colour: Met zun / gu, Houmuwu plateaus)' },
  earth: { group: 'Surface', label: 'Burial soil', min: 0, max: 1, step: 0.01, default: 0.3 },
  earthColor: { group: 'Surface', label: 'Soil colour', type: 'color', default: '#8f7048' },
  calcite: { group: 'Surface', label: 'Calcareous film', min: 0, max: 1, step: 0.01, default: 0.15, hint: 'whitish lime dusting that pales the crust' },
  streaks: { group: 'Surface', label: 'Streaks & tide line', min: 0, max: 1, step: 0.01, default: 0, hint: 'runs of groundwater down the walls, one pale tide line' },
  burialSide: { group: 'Surface', label: 'Burial side', min: 0, max: 1, step: 0.01, default: 0.3, hint: 'one side lay in the soil' },
  recessDirt: { group: 'Surface', label: 'Recess dirt', min: 0, max: 1, step: 0.01, default: 0.3 },
  ledgeMatte: { group: 'Surface', label: 'Dusty ledges', min: 0, max: 1, step: 0.01, default: 0, hint: 'up-facing ledges and eaves hold dust: fully matte, no glossy sheen catching the lights (never brighter than the lit walls)' },
  interiorTone: { group: 'Surface', label: 'Interior skin', min: 0, max: 1, step: 0.01, default: 0.3, hint: 'inside the vessel: dark grey-brown → pale green corroded skin' },
  wax: { group: 'Surface', label: 'Museum wax', min: 0, max: 1, step: 0.01, default: 0 },
  inlay: { group: 'Surface', label: 'Black inlay', min: 0, max: 1, step: 0.01, default: 0, hint: 'paste in the sunk lines (as made)' },
  inlayGround: { group: 'Surface', label: 'Inlay fills the ground', min: 0, max: 1, step: 0.01, default: 0, hint: 'the black paste fills the whole sunk ground of the décor, not only the lines: flush bands read light on black (Met zun)' },
  wear: { group: 'Surface', key: true, label: 'Wear', min: 0, max: 1, step: 0.01, default: 0.2, hint: 'erases from the top down on arrises' },
  seed: { group: 'Surface', label: 'Seed', min: 0, max: 99, step: 1, default: 7 },
}

/**
 * Presets, calibrated against photographs (research/02 §4 and each vessel's dossier, the
 * dossier winning). Each is a complete look AT age = 1; the age dial walks it back to the
 * as-cast metal. Parameters a preset leaves out take their PATINA_PARAMS default.
 * Grouped for the drawer by PATINA_PRESET_GROUPS.
 */
export const PATINA_PRESETS = {
  // ---- looks
  // fresh from the mould: warm golden bronze, black paste in the line work
  'as-cast': {
    age: 1, tin: 0.14, lead: 0.03, polish: 0.65, tarnish: 0.12, cuprite: 0, tinOxide: 0, malachite: 0, azurite: 0, chloride: 0, soot: 0,
    earth: 0, calcite: 0, recessDirt: 0.15, wax: 0, inlay: 0.85, wear: 0, crust: 0,
  },
  // a generic Anyang excavation: dark, quiet grey-olive skin; pale green packed into the
  // recesses and a few crusted territories; red-brown where the crust is thin; tops rubbed dark
  'excavated-green': {
    age: 1, tin: 0.13, lead: 0.04, polish: 0.4, tarnish: 0.7, cuprite: 0.75, tinOxide: 0.75, tinOxideTone: 0.8,
    malachite: 0.45, carbonate: 0.15, azurite: 0.03, azuriteScale: 10, blueHabitat: 0.3, turquoiseTone: 0.15,
    malachiteHue: 0.45, malachiteTone: 0.6, islands: 0.55, malachiteScale: 2, crust: 0.6,
    chloride: 0.08, soot: 0.05, crevice: 0.85, patchScale: 70, mottleScale: 10, patchiness: 0.6,
    earth: 0.1, earthColor: '#7d6a50', calcite: 0.2, streaks: 0.35, burialSide: 0.3, recessDirt: 0.2, interiorTone: 0.3,
    wax: 0, inlay: 0, wear: 0.2, dulling: 0.5, tops: 0.45, nobleWarmth: 0.4, matte: 0.6,
  },
  // Freer F1915.136: vivid, thick, waxy emerald crust; red-brown on arrises
  'malachite-crust': {
    age: 1, tin: 0.14, lead: 0.03, polish: 0.4, tarnish: 0.6, cuprite: 0.9, tinOxide: 0, tinOxideTone: 1, malachite: 0.95, malachiteHue: 0.42, malachiteTone: 0.12,
    malachiteScale: 1.6, crust: 0.9, islands: 0.8, azurite: 0.05, chloride: 0.03, soot: 0, crevice: 0.6, patchScale: 60, mottleScale: 10,
    earth: 0.08, earthColor: '#6e5b42', calcite: 0, burialSide: 0.2, recessDirt: 0.45, wax: 0.2, inlay: 0, wear: 0.3, dulling: 0.3, tops: 0.3, matte: 0.4,
  },
  // cleaned and waxed Western-collection look: smooth olive-grey, green in recesses
  'olive-museum': {
    age: 1, tin: 0.14, lead: 0.05, polish: 0.5, tarnish: 0.8, cuprite: 0.45, tinOxide: 0.88, tinOxideTone: 1.25, malachite: 0.35, malachiteHue: 0.4,
    malachiteTone: 0.55, malachiteScale: 1.5, crust: 0.2, islands: 0.4, azurite: 0.02, chloride: 0.02, soot: 0, crevice: 0.95, patchScale: 80, mottleScale: 9, patchiness: 0.5,
    earth: 0.1, earthColor: '#6b5a42', calcite: 0.12, burialSide: 0.1, recessDirt: 0.55, wax: 0.25, inlay: 0, wear: 0.25, dulling: 0.25, tops: 0.2, streaks: 0.15, matte: 0.45, nobleWarmth: 0.3,
  },
  // 黑漆古 / Met fanglei 55.160: glossy black noble skin, red-brown blotches, lime streaks
  'water-black': {
    age: 1, tin: 0.16, lead: 0.02, polish: 0.5, tarnish: 0.9, cuprite: 0.7, tinOxide: 0.8, tinOxideTone: 0, malachite: 0.08, malachiteHue: 0.35,
    malachiteScale: 1.5, crust: 0.1, islands: 0.5, azurite: 0, chloride: 0.03, soot: 0, crevice: 0.6, patchScale: 110, mottleScale: 16,
    earth: 0.05, earthColor: '#5a4a38', calcite: 0.12, streaks: 0.4, burialSide: 0.2, recessDirt: 0.4, wax: 0.15, inlay: 0, wear: 0.15, dulling: 0.15, matte: 0.3,
  },
  // active chlorides: pale chalky bluish-green pustules in pits, clustered low and on seams
  'bronze-disease': {
    age: 1, tin: 0.13, lead: 0.05, polish: 0.4, tarnish: 0.7, cuprite: 0.8, tinOxide: 0.55, tinOxideTone: 1.2, malachite: 0.45, malachiteHue: 0.45,
    malachiteScale: 2, crust: 0.6, azurite: 0.03, chloride: 0.7, soot: 0, crevice: 0.8, patchScale: 70, mottleScale: 10, patchiness: 0.7,
    earth: 0.15, earthColor: '#7a6548', calcite: 0.1, burialSide: 0.3, recessDirt: 0.45, wax: 0, inlay: 0, wear: 0.15, dulling: 0.35, tops: 0.3, matte: 0.65, nobleWarmth: 0.3,
  },
  // kept above ground and handled: warm metal on every high point, near-black recesses
  'heirloom': {
    age: 1, tin: 0.13, lead: 0.04, polish: 0.7, tarnish: 0.75, cuprite: 0.5, tinOxide: 0.8, tinOxideTone: 0.25, malachite: 0.1, malachiteHue: 0.5,
    malachiteScale: 1.5, crust: 0.15, azurite: 0, chloride: 0, soot: 0.05, crevice: 0.9, patchScale: 80, mottleScale: 12,
    earth: 0, calcite: 0, burialSide: 0, recessDirt: 0.8, wax: 0.3, inlay: 0.2, wear: 0.75,
  },

  // ---- blue
  // the classic "fresh from a wet tomb": pale turquoise / blue-green crust over red cuprite
  'blue-green-excavated': {
    age: 1, tin: 0.13, lead: 0.04, polish: 0.4, tarnish: 0.7, cuprite: 0.9, tinOxide: 0.35, tinOxideTone: 1.3,
    malachite: 0.82, carbonate: 0.52, azurite: 0.06, azuriteDepth: 0.35, azuriteScale: 10, blueHabitat: 0.35, turquoiseTone: 0.12,
    malachiteHue: 0.3, malachiteTone: 0.75, islands: 0.45, malachiteScale: 2.2, crust: 0.9,
    chloride: 0.1, soot: 0, crevice: 0.75, patchScale: 65, mottleScale: 10, patchiness: 0.6,
    earth: 0.3, earthColor: '#8a7354', calcite: 0.35, streaks: 0.3, burialSide: 0.3, recessDirt: 0.15, interiorTone: 0.4,
    wax: 0, inlay: 0, wear: 0.15, dulling: 0.25, tops: 0.5, matte: 0.65, nobleWarmth: 0.3,
  },
  // strong deep-blue crystalline islands on green and brown (display variety; > 25 % blue is rare)
  'azurite-bloom': {
    age: 1, tin: 0.13, lead: 0.04, polish: 0.4, tarnish: 0.6, cuprite: 0.9, tinOxide: 0.3, tinOxideTone: 1,
    malachite: 0.8, carbonate: 0.65, azurite: 0.28, azuriteDepth: 0.8, azuriteScale: 18, blueHabitat: 0.8, turquoiseTone: 0.5,
    malachiteHue: 0.42, malachiteTone: 0.45, islands: 0.85, malachiteScale: 2.2, crust: 1.2,
    chloride: 0.08, soot: 0, crevice: 0.7, patchScale: 70, mottleScale: 12,
    earth: 0.25, earthColor: '#8a7354', calcite: 0.2, streaks: 0.2, burialSide: 0.3, recessDirt: 0.25, interiorTone: 0.3,
    wax: 0, inlay: 0, wear: 0.15, dulling: 0.1, tops: 0.35, matte: 0.55, nobleWarmth: 0.3,
  },

  // ---- vessels (calibrated against reference/<id>/ photographs and dossier §d; round 3: zones
  // sampled in photo and render, medians and p10/p90 contrast — see each comment)
  // Houmuwu (NMC), round 4: a low-contrast grey-green noble skin with soft red cuprite mottle at
  // 10–40 mm blended into it (softness 1: no dots), a slow tone drift, friezes darker than the plain
  // field (nobleRelief < 0, black grooves), legs darker and greener (lowerBody), calm rim and handles
  'houmuwu': {
    age: 1, tin: 0.12, lead: 0.04, polish: 0.3, tarnish: 0.6, cuprite: 1, cupriteTone: 0.25, tinOxide: 0.7,
    tinOxideTone: 1.45, malachite: 0, carbonate: 0.4, azurite: 0, azuriteScale: 8, blueHabitat: 0.3,
    turquoiseTone: 0.2, malachiteHue: 0.3, malachiteTone: 0.5, islands: 0, malachiteScale: 1, crust: 0.2,
    chloride: 0, soot: 0, crevice: 0.5, patchScale: 110, mottleScale: 30, patchiness: 0.3, softness: 1,
    drift: 0.5, lowerBody: 0.9, lowerHeight: 0.38, lowerColor: '#bcc4b0', rimCalm: 0.8, earth: 0,
    earthColor: '#857256', calcite: 0, streaks: 0.15, burialSide: 0.2, recessDirt: 0.6, interiorTone: 0.35,
    wax: 0, inlay: 0.7, wear: 0.1, dulling: 0.1, tops: 0.15, matte: 1, topsTone: 0, ledgeMatte: 0.5,
    nobleRelief: -1, speckle: 0.42, speckleScale: 1.6, speckleColor: '#c07078', speckleDecor: 0.5,
    crustIsles: 0.2, crustScale: 14, crustColor: '#b8a8a4', crustPlace: 0.65, plainTone: 1.0, tint: '#bfeee4',
    grain: 1,
  },
  // Met 1974.268.2: one even olive yellow-green-brown noble skin (lid only a little lighter),
  // dark recesses without verdigris, red-brown in slots and low on the foot, sparse green specks
  'met-fangyi': {
    age: 1, tin: 0.14, lead: 0.05, polish: 0.4, tarnish: 0.8, cuprite: 0.8, cupriteTone: 0.3, tinOxide: 0.95,
    tinOxideTone: 1.0, malachite: 0, carbonate: 0.05, azurite: 0, malachiteHue: 0.7, malachiteTone: 0.4,
    islands: 0.3, malachiteScale: 1, crust: 0.1, chloride: 0, soot: 0, crevice: 0.9, patchScale: 80,
    mottleScale: 14, patchiness: 0.6, softness: 0.8, drift: 0.25, earth: 0.05, earthColor: '#6a4a2c', calcite: 0,
    streaks: 0.1, burialSide: 0.05, recessDirt: 0.9, interiorTone: 0.6, wax: 0.1, inlay: 0, wear: 0.1,
    dulling: 0.05, tops: 0.25, nobleWarmth: 0.35, matte: 1, topsTone: 0.05, ledgeMatte: 1, lowerBody: 0.35,
    lowerHeight: 0.1, lowerColor: '#d89a78', upperTone: 0.9, upperHeight: 0.66, speckle: 0.13, speckleScale: 1.2,
    speckleColor: '#3c4630', pustules: 0.06, pustuleScale: 3, pustuleColor: '#3e5a36', tint: '#dfe8cc',
    grain: 0.8, crustIsles: 0, crustScale: 6, crustColor: '#5a3426', crustPlace: 0, nobleRelief: 0.2,
  },
  // Met 43.25.1: silver-grey 水银古 bands on a black-filled ground (inlayGround), fine blue-green
  // malachite and chalky speckle, no khaki
  'met-zun': {
    age: 1, tin: 0.14, lead: 0.05, polish: 0.45, tarnish: 0.2, cuprite: 0.45, cupriteTone: 0, tinOxide: 0.65,
    tinOxideTone: 0.7, malachite: 0.2, carbonate: 0.2, azurite: 0.02, azuriteDepth: 0.4, azuriteScale: 10,
    blueHabitat: 0.5, turquoiseTone: 0.5, malachiteHue: 0.35, malachiteTone: 0.35, islands: 0.35,
    malachiteScale: 1.5, crust: 0.15, chloride: 0, soot: 0, crevice: 0.6, patchScale: 40, mottleScale: 22,
    patchiness: 0.6, softness: 0.75, drift: 0.4, earth: 0.05, earthColor: '#9a978c', calcite: 0.05, streaks: 0.1,
    burialSide: 0.1, recessDirt: 0.6, interiorTone: 0.5, wax: 0, inlay: 1, inlayGround: 0.65, wear: 0.2,
    dulling: 0.8, tops: 0.85, nobleWarmth: 0, matte: 1, topsTone: 1, ledgeMatte: 1, tint: '#d4e6f2', speckle: 0,
    speckleScale: 1.5, speckleColor: '#3d5a48', crustIsles: 0.15, crustScale: 14, crustColor: '#a2a69e',
    crustPlace: 0.8, pustules: 0.15, pustuleScale: 5, pustuleColor: '#2a6e50', lowerBody: 1, lowerHeight: 0.1,
    lowerColor: '#cccccc', plainTone: 1.12, grain: 0.5,
  },
  // Met 49.135.2 fangding: pale grey-green plateaus and plain bands on a black-filled leiwen ground,
  // emerald malachite specks and small crusts on plain parts, red-brown cuprite blotches (rim, legs)
  'met-fangding': {
    age: 1, tin: 0.14, lead: 0.05, polish: 0.4, tarnish: 0.25, cuprite: 0.85, cupriteTone: 0.2, tinOxide: 0.7,
    tinOxideTone: 1.1, malachite: 0.42, carbonate: 0.1, azurite: 0, azuriteScale: 10, blueHabitat: 0.5,
    turquoiseTone: 0.4, malachiteHue: 0.3, malachiteTone: 0.3, islands: 0.6, malachiteScale: 1.4, crust: 0.2,
    chloride: 0, soot: 0, crevice: 0.6, patchScale: 45, mottleScale: 16, patchiness: 0.8, softness: 0.7,
    drift: 0.3, earth: 0.08, earthColor: '#7a5a40', calcite: 0.04, streaks: 0.1, burialSide: 0.1, recessDirt: 0.6,
    interiorTone: 0.45, wax: 0, inlay: 1, inlayGround: 0.7, wear: 0.15, dulling: 0.55, tops: 0.8, nobleWarmth: 0.1,
    matte: 1, topsTone: 1, ledgeMatte: 1, tint: '#bed2be', speckle: 0.06, speckleScale: 1.4, speckleColor: '#7a4a38',
    crustIsles: 0.14, crustScale: 4, crustColor: '#2f8a5a', crustPlace: 0.7, pustules: 0.06, pustuleScale: 3,
    pustuleColor: '#1f8a52', lowerBody: 0.6, lowerHeight: 0.35, lowerColor: '#c8bca8', plainTone: 0.9, grain: 0.6,
  },
  // Met 1985.214.4: grey-olive trumpet, neutral silvery décor bands with dark leiwen, a dark
  // green-black mottled ring with emerald spots and small pale crust islands
  'met-gu': {
    age: 1, tin: 0.14, lead: 0.05, polish: 0.4, tarnish: 0.4, cuprite: 0.4, cupriteTone: 0.3, tinOxide: 0.9,
    tinOxideTone: 1.8, malachite: 0.02, carbonate: 0.05, azurite: 0, malachiteHue: 0.45, malachiteTone: 0.3,
    islands: 0.5, malachiteScale: 1.2, crust: 0.2, chloride: 0, soot: 0.3, crevice: 0.9, patchScale: 45,
    mottleScale: 14, patchiness: 1, softness: 1, drift: 0.2, earth: 0.1, earthColor: '#6b5a42', calcite: 0.05,
    streaks: 0.45, burialSide: 0.05, recessDirt: 0.9, interiorTone: 0.6, wax: 0, inlay: 0.85, inlayGround: 0.15,
    wear: 0.2, dulling: 0.25, tops: 1.0, nobleWarmth: 0.1, matte: 1, topsTone: 1, ledgeMatte: 1, lowerBody: 0.7,
    lowerHeight: 0.1, lowerColor: '#7a7468', upperTone: 0.5, upperHeight: 0.55, tint: '#c4d0b8', speckle: 0.14,
    speckleScale: 1.5, speckleColor: '#7d4a3e', crustIsles: 0.18, crustScale: 10, crustColor: '#8a8578',
    crustPlace: 0.9, pustules: 0.12, pustuleScale: 4, pustuleColor: '#2e6f4a', grain: 0.5,
  },
  // Met gui 62.217: dark grey-green skin with soft pale-green malachite territories and small
  // red-brown cuprite blotches (rim, foot), dark brown dirt in the leiwen, silvery worn bands
  'met-gui': {
    age: 1, tin: 0.14, lead: 0.06, polish: 0.35, tarnish: 0.5, cuprite: 0.75, cupriteTone: 0.3, tinOxide: 0.85,
    tinOxideTone: 1.15, malachite: 0.32, carbonate: 0.06, azurite: 0, malachiteHue: 0.5, malachiteTone: 0.6,
    islands: 0.1, malachiteScale: 2.5, crust: 0.1, chloride: 0, soot: 0, crevice: 0.9, patchScale: 30,
    mottleScale: 15, patchiness: 0.85, softness: 0.95, drift: 0.3, earth: 0.15, earthColor: '#6a4428', calcite: 0,
    streaks: 0.05, burialSide: 0.05, recessDirt: 1, interiorTone: 0.55, wax: 0.05, inlay: 0, wear: 0.15,
    dulling: 0.15, tops: 0.55, nobleWarmth: 0.25, matte: 1, topsTone: 0.35, ledgeMatte: 1, lowerBody: 0.25,
    lowerHeight: 0.18, lowerColor: '#b9a88e', speckle: 0, speckleScale: 1.3, speckleColor: '#6a3a30',
    crustIsles: 0, crustScale: 8, crustColor: '#7fa060', crustPlace: 0.6, pustules: 0, pustuleScale: 3,
    pustuleColor: '#3f7a40', tint: '#c2c6aa', grain: 0.7, nobleRelief: 0.35,
  },

  // Nezu fangyi (owner's photo): warm olive-brown handled skin, plateaus a little lighter than a
  // DARK ground, almost no powder (it lives only in fine grooves), warm cuprite showing low
  'nezu-olive': {
    age: 1, tin: 0.15, lead: 0.06, polish: 0.55, tarnish: 0.9, cuprite: 0.7, cupriteTone: 0.4, tinOxide: 0.88,
    tinOxideTone: 0.8, malachite: 0, carbonate: 0.1, azurite: 0, malachiteHue: 0.6, malachiteTone: 0.8,
    islands: 0.1, malachiteScale: 1.5, crust: 0.1, chloride: 0, soot: 0.25, crevice: 1, patchScale: 60,
    mottleScale: 14, patchiness: 0.9, softness: 0.8, drift: 0.2, earth: 0, earthColor: '#8a8270', calcite: 0,
    streaks: 0.1, burialSide: 0.15, recessDirt: 0.8, interiorTone: 0.2, wax: 0, inlay: 0, inlayGround: 0.1,
    wear: 0.1, dulling: 0, tops: 0.15, matte: 1, nobleWarmth: 0.75, topsTone: 0.25, ledgeMatte: 1,
    nobleRelief: 1, tint: '#c8cac4', upperTone: 0.55, upperHeight: 0.62, speckle: 0.08, speckleScale: 1.5,
    speckleColor: '#6e4535', crustIsles: 0.25, crustScale: 6, crustColor: '#686656', crustPlace: 1,
    plainTone: 0.2, lowerHeight: 0.15, grain: 0.8,
  },

  // the owner's bluer reading of the Nezu vessel: the same warm dark skin and light plateaus,
  // blue-green and azurite powder bound to the recesses (the real powder is pale grey-green — this is a request)
  'nezu-blue': {
    age: 1, tin: 0.15, lead: 0.05, polish: 0.45, tarnish: 0.85, cuprite: 0.6, cupriteTone: 0.3, tinOxide: 0.95,
    tinOxideTone: 0.6, malachite: 0.3, carbonate: 0.6, azurite: 0.12, azuriteDepth: 0.6, azuriteScale: 8,
    blueHabitat: 0.05, turquoiseTone: 0.6, malachiteHue: 0.12, malachiteTone: 0.55, islands: 0.25,
    malachiteScale: 1.2, crust: 0.2, chloride: 0.03, soot: 0, crevice: 0.9, patchScale: 55, mottleScale: 10,
    patchiness: 0.8, softness: 0.7, earth: 0.05, earthColor: '#5f6460', calcite: 0, streaks: 0.15,
    burialSide: 0.2, recessDirt: 0.3, interiorTone: 0.2, wax: 0.05, inlay: 0, wear: 0.1, dulling: 0.35,
    tops: 0.8, nobleWarmth: 0.8, matte: 0.5, topsTone: 0.6, ledgeMatte: 1,
  },
}

/** How the drawer groups the preset chips. Every key of PATINA_PRESETS appears once. */
export const PATINA_PRESET_GROUPS = {
  Vessels: ['houmuwu', 'met-fangyi', 'met-zun', 'met-gu', 'nezu-olive', 'met-fangding', 'met-gui'],
  Looks: ['excavated-green', 'olive-museum', 'malachite-crust', 'water-black', 'bronze-disease', 'heirloom', 'as-cast'],
  Blue: ['nezu-blue', 'blue-green-excavated', 'azurite-bloom'],
}

const U = (name) => 'u' + name[0].toUpperCase() + name.slice(1)

/** The shared uniform set. patina.<param>.value — one object for every PatinaMaterial. */
export const patina = {}
for (const [k, d] of Object.entries(PATINA_PARAMS)) {
  patina[k] = { value: d.type === 'color' ? new THREE.Color(d.default) : d.default }
}
// 0 beauty · 1 clay (neutral grey: relief only) · 2 height · 3 mask (layer coverages, false colour)
patina.mode = { value: 0 }
// vessel space: world → vessel matrix, and the vessel's bbox in that space (mm)
patina.vesselInverse = { value: new THREE.Matrix4() }
patina.vesselMin = { value: new THREE.Vector3(-150, 0, -150) }
patina.vesselSize = { value: new THREE.Vector3(300, 300, 300) }

/** Set any subset of parameters (colours as '#rrggbb' or THREE.Color). */
export function setPatina(values = {}) {
  for (const [k, v] of Object.entries(values)) {
    if (!patina[k] || !(k in PATINA_PARAMS)) continue
    if (patina[k].value instanceof THREE.Color) patina[k].value.set(v)
    else patina[k].value = v
  }
}

/** Current parameters as plain values (colours as hex strings). */
export function getPatina() {
  const out = {}
  for (const k of Object.keys(PATINA_PARAMS)) {
    const v = patina[k].value
    out[k] = v instanceof THREE.Color ? '#' + v.getHexString() : v
  }
  return out
}

export const PATINA_MODES = { beauty: 0, clay: 1, height: 2, mask: 3 }

export function setPatinaMode(mode) {
  patina.mode.value = PATINA_MODES[mode] ?? 0
}

/**
 * Tell the patina what it is on: the vessel root (its world matrix defines
 * vessel space, its bbox the size) or an explicit { min, max } box in mm.
 * The stage calls this whenever it shows a new subject. Noise stays in mm, so
 * scales are physical; the box gives height-above-base (soot, soil), the axis
 * (interior / inward faces) and a gentle size bias on territory size.
 */
export function setPatinaVessel(target) {
  if (!target) return
  if (target.isObject3D) {
    target.updateMatrixWorld(true)
    patina.vesselInverse.value.copy(target.matrixWorld).invert()
    const box = new THREE.Box3()
    const inv = patina.vesselInverse.value
    target.traverse((o) => {
      if (!o.isMesh || !o.geometry) return
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox()
      const b = o.geometry.boundingBox.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld))
      box.union(b)
    })
    if (box.isEmpty()) return
    patina.vesselMin.value.copy(box.min)
    box.getSize(patina.vesselSize.value)
  } else {
    patina.vesselInverse.value.identity()
    patina.vesselMin.value.fromArray(target.min)
    patina.vesselSize.value.fromArray(target.max).sub(patina.vesselMin.value)
  }
}

export class PatinaMaterial extends THREE.MeshStandardMaterial {
  /**
   * @param {object} o
   * @param {import('../relief/bake.js').ReliefMap|null} [o.relief]
   * @param {boolean} [o.cavityAttribute] read a per-vertex `cavity` attribute (0 recess → 1 exposed)
   * @param {number} [o.cavity] constant cavity for plain meshes (0 recess → 1 exposed), default 0.8
   * @param {number} [o.interior] 0..1: this mesh is an inside surface (bowl, inner wall): one calm corroded skin (interiorTone), no speckle, no wear
   * @param {number} [o.normalStrength] scales the relief normal map
   */
  constructor({ relief = null, cavityAttribute = false, cavity = 0.8, interior = 0, normalStrength = 1, ...params } = {}) {
    super({ color: 0xffffff, roughness: 0.5, metalness: 1, envMapIntensity: 1, ...params })
    this.isPatinaMaterial = true
    this.relief = relief
    this.cavityAttribute = cavityAttribute
    this.defines = this.defines || {}
    if (relief) {
      this.normalMap = relief.normalTexture
      this.normalScale = new THREE.Vector2(normalStrength, normalStrength)
      this.defines.PATINA_RELIEF = ''
    }
    if (cavityAttribute) this.defines.PATINA_CAVITY_ATTR = ''
    this.local = {
      uReliefData: { value: relief ? relief.dataTexture : null },
      uReliefRange: { value: new THREE.Vector2(relief ? relief.min : 0, relief ? relief.max : 1) },
      uConstCavity: { value: cavity },
      uInterior: { value: interior },
    }
    this.onBeforeCompile = (shader) => patchShader(shader, this)
  }

  customProgramCacheKey() {
    return 'patina2:' + (this.relief ? 'R' : '') + (this.cavityAttribute ? 'C' : '')
  }
}

// ----------------------------------------------------------------- shader

function patchShader(shader, mat) {
  for (const k of Object.keys(PATINA_PARAMS)) shader.uniforms[U(k)] = patina[k]
  shader.uniforms.uPatinaMode = patina.mode
  shader.uniforms.uVesselInv = patina.vesselInverse
  shader.uniforms.uVesselMin = patina.vesselMin
  shader.uniforms.uVesselSize = patina.vesselSize
  Object.assign(shader.uniforms, mat.local)

  shader.vertexShader = shader.vertexShader
    .replace(
      '#include <common>',
      `#include <common>
uniform mat4 uVesselInv;
varying vec3 vPatinaPos;
varying vec3 vPatinaNrm;
#ifdef PATINA_CAVITY_ATTR
attribute float cavity;
varying float vCavity;
#endif`,
    )
    .replace(
      '#include <project_vertex>',
      `#include <project_vertex>
{
  mat4 tt_m = uVesselInv * modelMatrix;
  vPatinaPos = (tt_m * vec4(transformed, 1.0)).xyz;
  vPatinaNrm = normalize(mat3(tt_m) * objectNormal);
}
#ifdef PATINA_CAVITY_ATTR
vCavity = cavity;
#endif`,
    )

  const decl = Object.entries(PATINA_PARAMS)
    .map(([k, d]) => `uniform ${d.type === 'color' ? 'vec3' : 'float'} ${U(k)};`)
    .join('\n')

  shader.fragmentShader = shader.fragmentShader
    .replace(
      '#include <common>',
      `#include <common>
${decl}
uniform float uPatinaMode;
uniform sampler2D uReliefData;
uniform vec2 uReliefRange;
uniform float uConstCavity;
uniform float uInterior;
uniform vec3 uVesselMin;
uniform vec3 uVesselSize;
varying vec3 vPatinaPos;
varying vec3 vPatinaNrm;
#ifdef PATINA_CAVITY_ATTR
varying float vCavity;
#endif
${noiseChunk}
${LAYERS}`,
    )
    .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>\n${APPLY}`)
    // dielectric corrosion products have their own F0 (cuprite ≈ 0.2, SnO₂ ≈ 0.08)
    .replace('#include <lights_physical_fragment>', `#include <lights_physical_fragment>\nmaterial.specularColor = mix(vec3(ttF0), diffuseColor.rgb, metalnessFactor);`)
}

// Surface description + one function per layer. Each layer returns a coverage
// 0..1 from the shared `Surf`, so a specialist can retune one in isolation.
const LAYERS = /* glsl */ `
struct Surf {
  vec3 p;        // vessel-space position, mm
  vec3 n;        // vessel-space geometric normal
  float up;      // n.y
  float hgt;     // height above the base, 0..1 of the vessel
  float h01;     // relief height, 0..1 over the panel's range (0.5 on plain meshes)
  float cav;     // 0 deep recess → 1 fully exposed
  float edge;    // 1 on sharp raised arrises (relief edge channel ∪ geometric convexity)
  float groove;  // 1 inside sunk line work
  float rec;     // recess preference after crevice bias, 0..1
  float inside;  // 0..1 interior / sheltered (inward-facing, interior flag)
  float calm;    // 0..1 a true interior surface (per-mesh hint): one quiet corroded skin
  float burial;  // -1..1 facing the side that lay in the soil
  float T;       // territory field 0..1 (patchScale, domain-warped)
  float T2;      // second, independent territory field 0..1 (azurite, noble-vs-crust split)
  float K;       // territory KIND, 0..1, constant per warped cell: sharp-edged regions that differ in kind
  float A;       // azurite field 0..1 (azuriteScale, warped)
  float st;      // gravity streaks ~-1..1 (vertical runs), LOD-faded to 0
  float M;       // mottle 0..1 (mottleScale)
  float G;       // speckle 0..1 (≈ grain size), LOD-faded to 0.5
  float B;       // botryoidal dome height 0..1 (malachiteScale), LOD-faded
  float px;      // pixel footprint, mm
};

float tt_ss(float a, float b, float x) { return smoothstep(a, b, x); }
// remap an amount (0..1) into a coverage of field f: amount ≈ area fraction
float tt_cover(float amount, float f, float soft) {
  return amount <= 0.001 ? 0.0 : smoothstep(1.0 - amount - soft, 1.0 - amount + soft, f);
}
// fades a band of noise to its mean once it drops under ~1.5 px
float tt_lod(float scaleMM, float px) { return 1.0 - smoothstep(0.25, 0.75, px / max(scaleMM, 1e-3)); }

vec3 tt_pal(vec3 dark, vec3 mid, vec3 light, float t) {
  return t < 0.5 ? mix(dark, mid, t * 2.0) : mix(mid, light, t * 2.0 - 1.0);
}
float tt_lum(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

// research/02 §1.2: F0 vs Sn wt, linear, rows every 5 %
vec3 tt_metalF0(float sn, float pb) {
  float x = clamp(sn, 0.0, 0.3) * 20.0;
  vec3 c;
  if (x < 1.0) c = mix(vec3(0.955, 0.638, 0.538), vec3(0.940, 0.660, 0.500), x);
  else if (x < 2.0) c = mix(vec3(0.940, 0.660, 0.500), vec3(0.910, 0.700, 0.470), x - 1.0);
  else if (x < 3.0) c = mix(vec3(0.910, 0.700, 0.470), vec3(0.860, 0.725, 0.510), x - 2.0);
  else if (x < 4.0) c = mix(vec3(0.860, 0.725, 0.510), vec3(0.800, 0.735, 0.590), x - 3.0);
  else if (x < 5.0) c = mix(vec3(0.800, 0.735, 0.590), vec3(0.740, 0.720, 0.655), x - 4.0);
  else c = mix(vec3(0.740, 0.720, 0.655), vec3(0.700, 0.690, 0.660), x - 5.0);
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  return mix(c, vec3(l) * 0.92, clamp(pb * 2.0, 0.0, 0.5));
}

// §2.5 noble patina palettes, tone 0 black · 1 olive · 2 grey; t = dark → light.
// Olive is the research's olive / green-grey (#39402F · #5C6448 · #838B6A): brown-olive, not green.
vec3 tt_nobleColor(float tone, float t) {
  vec3 blk = tt_pal(vec3(0.006, 0.007, 0.006), vec3(0.014, 0.017, 0.012), vec3(0.030, 0.037, 0.024), t);
  vec3 olv = tt_pal(vec3(0.036, 0.042, 0.026), vec3(0.098, 0.110, 0.066), vec3(0.215, 0.235, 0.150), t);
  vec3 gry = tt_pal(vec3(0.070, 0.082, 0.076), vec3(0.150, 0.170, 0.160), vec3(0.315, 0.345, 0.320), t);
  return tone < 1.0 ? mix(blk, olv, tone) : mix(olv, gry, tone - 1.0);
}

// §2.3 malachite: hue 0 blue-green · 0.5 the research's malachite · 1 yellow-green
vec3 tt_malachiteColor(float hue, float t) {
  vec3 bg = tt_pal(vec3(0.012, 0.070, 0.064), vec3(0.045, 0.185, 0.170), vec3(0.200, 0.400, 0.380), t);
  vec3 gr = tt_pal(vec3(0.013, 0.102, 0.045), vec3(0.047, 0.254, 0.107), vec3(0.205, 0.479, 0.287), t);
  vec3 yg = tt_pal(vec3(0.030, 0.090, 0.025), vec3(0.100, 0.225, 0.062), vec3(0.290, 0.440, 0.170), t);
  return hue < 0.5 ? mix(bg, gr, hue * 2.0) : mix(gr, yg, hue * 2.0 - 1.0);
}

// the blue-green phase (chrysocolla / basic copper salts, Houmuwu's "#8fc0bf pale blue-green"):
// tone 0 pale chalky turquoise → 1 deep sea blue-green. Its own mineral, not a malachite hue.
vec3 tt_turquoiseColor(float tone, float t) {
  vec3 pale = tt_pal(vec3(0.080, 0.160, 0.160), vec3(0.170, 0.310, 0.300), vec3(0.330, 0.500, 0.490), t);
  vec3 deep = tt_pal(vec3(0.008, 0.055, 0.068), vec3(0.030, 0.150, 0.180), vec3(0.120, 0.330, 0.370), t);
  return mix(pale, deep, tone);
}

// §2.4 azurite: depth 0 pale powdery sky blue → 0.5 the research's azure → 1 deep crystalline ultramarine
vec3 tt_azuriteColor(float depth, float t) {
  vec3 pale = tt_pal(vec3(0.090, 0.170, 0.330), vec3(0.200, 0.320, 0.560), vec3(0.380, 0.520, 0.740), t);
  vec3 mid = tt_pal(vec3(0.012, 0.036, 0.162), vec3(0.026, 0.098, 0.392), vec3(0.144, 0.287, 0.631), t);
  vec3 deep = tt_pal(vec3(0.005, 0.018, 0.100), vec3(0.014, 0.052, 0.260), vec3(0.070, 0.165, 0.480), t);
  return depth < 0.5 ? mix(pale, mid, depth * 2.0) : mix(mid, deep, depth * 2.0 - 1.0);
}

// softness: every layer edge feathers (cover soft band widened toward 0.3)
float tt_soft(float sharp) { return mix(sharp, max(sharp, 0.3), clamp(uSoftness, 0.0, 1.0)); }

float layerCuprite(Surf S, float amt) {
  // a near-continuous film on the metal: territory only thins it at low amounts
  return tt_cover(amt, 0.5 * S.T + 0.3 * S.M + 0.2 * S.rec + 0.08 * (S.G - 0.5), tt_soft(0.18));
}

float layerNoble(Surf S, float amt) {
  // Type I sheet: broad smooth territories, indifferent to relief, better on the exterior;
  // kind-0 cells are noble-skin territories, kind-2 cells crust territories
  // (with fine mottle — patchiness < 1 — the kind borders soften: speckle has no cut edges)
  float kw = 0.22 * (1.0 - clamp(uPatchiness, 0.0, 1.0));
  float kNob = 1.0 - tt_ss(0.25 - kw, 0.4 + kw, S.K);
  float f = 0.5 * (1.0 - S.T) + 0.22 * S.T2 + 0.24 * (S.M - 0.5) + 0.12 - 0.15 * S.inside + 0.2 * kNob - 0.12 * tt_ss(0.62 - kw, 0.75 + kw, S.K) + 1.6 * kw * (S.G - 0.5);
  return tt_cover(amt, f, tt_soft(0.12));
}

// the carbonate-crust field: territories + strong recess preference, up-facing and burial-side
// bias, thinner on convex arrises, a kind bias (crust cells take more), fractal-edged boundaries
float malachiteField(Surf S) {
  float kw = 0.22 * (1.0 - clamp(uPatchiness, 0.0, 1.0));
  return 0.42 * S.T + 0.78 * S.rec * (0.3 + 0.7 * uCrevice) + 0.12 * max(S.up, 0.0)
       + 0.15 * uBurialSide * S.burial - 0.3 * S.edge + 0.22 * (S.M - 0.5) + 0.06 * (S.G - 0.5) + 0.1 * S.inside
       + 0.16 * (tt_ss(0.62 - kw, 0.75 + kw, S.K) - 0.5) - 0.3 * (1.0 - S.rec) * uCrevice
       + 0.38 * tt_ss(0.66 - kw, 0.74 + kw, S.K) * tt_ss(0.3, 0.75, S.T)
       + kw * (1.4 * (1.0 - S.rec) + 2.0 * (S.G - 0.5)); // fine mottle: skin-wide, not recess-bound, granular edges // a few crust territories on open walls
}
// crust ISLANDS: sharp-edged, a little dependent on the cell kind
float layerMalachite(Surf S, float amt) {
  float soft = tt_soft(mix(0.12, 0.022, uIslands));
  return tt_cover(amt * mix(0.55, 1.0, uIslands), malachiteField(S), soft);
}
// thin FILM: gradual, translucent, wider than the islands
float layerCarbonateFilm(Surf S, float amt) {
  return tt_cover(min(amt * 1.35, 1.0), malachiteField(S) + 0.1 * S.st, 0.32) * mix(0.62, 0.3, uIslands);
}

// which carbonate a crust pixel is: 1 = the blue-green phase, 0 = malachite. Per territory
// (warped cells + territory field), thresholded, never a blend; habitat 0 pulls it into recesses
float layerBlueGreen(Surf S, float frac) {
  float hab = uBlueHabitat;
  float f = 0.5 * S.K + 0.28 * S.T2 + 0.14 * S.M + 0.08 * (S.G - 0.5)
          + mix(0.55 * (S.rec - 0.45), 0.0, hab);
  return tt_cover(frac, f, tt_soft(0.03));
}

float layerAzurite(Surf S, float amt) {
  // discrete islands from a thresholded warped field at the azurite patch scale; habitat
  // 0 binds them to the recesses / grooves, 1 lets them sit as open crust patches
  float hab = uBlueHabitat;
  float f = 0.62 * S.A + 0.16 * S.T2 + 0.12 * S.M + 0.08 * S.inside + 0.05 * (S.G - 0.5)
          + mix(0.6 * (S.rec - 0.5), 0.0, hab) - mix(0.25 * S.edge, 0.0, hab);
  return tt_cover(amt, f, tt_soft(0.025));
}

float layerSoil(Surf S, float amt) {
  // packed into recesses, onto up-facing ledges, the burial side, underside and interior
  float f = 0.75 * S.rec + 0.22 * max(S.up, 0.0) * (1.0 - S.edge) + 0.3 * uBurialSide * max(S.burial, 0.0)
          + 0.35 * S.inside * (1.0 - S.calm) + 0.3 * max(-S.up, 0.0) * (1.0 - tt_ss(0.0, 0.25, S.hgt)) + 0.2 * (S.M - 0.5) - 0.25 * S.edge
          + 0.22 * (1.0 - tt_ss(0.02, 0.16, S.hgt)) * (1.0 - S.inside); // an earthy accretion low on the foot
  return tt_cover(amt, f, 0.09);
}

float layerSoot(Surf S, float amt) {
  float low = 1.0 - tt_ss(0.0, 0.4, S.hgt);
  return amt * clamp(low * (0.6 + 0.4 * S.M) + 0.5 * max(-S.up, 0.0) * low, 0.0, 1.0) * (1.0 - S.inside);
}

// erase driver: convex arrises, rims and handles first (handling), noisy
float layerWear(Surf S, float amt) {
  float hi = S.edge * 0.9 + 0.3 * tt_ss(0.7, 1.0, S.h01) * tt_ss(0.75, 1.0, S.cav) + 0.15 * tt_ss(0.9, 1.0, S.hgt) * (1.0 - S.inside);
  float e = amt * tt_ss(0.15, 0.85, hi + 0.35 * (S.M - 0.5) + 0.25 * (S.G - 0.5));
  return clamp(e * (1.0 - 0.8 * S.inside), 0.0, 1.0);
}

// bump from a scalar height (mm) via screen-space derivatives (Mikkelsen)
vec3 tt_bump(vec3 n, float h, vec3 viewPos) {
  vec3 sx = dFdx(viewPos), sy = dFdy(viewPos);
  vec3 r1 = cross(sy, n), r2 = cross(n, sx);
  float det = dot(sx, r1);
  vec3 grad = sign(det) * (dFdx(h) * r1 + dFdy(h) * r2);
  return normalize(abs(det) * n - grad);
}
`

const APPLY = /* glsl */ `
float ttF0 = 0.04;
{
  Surf S;
  S.p = vPatinaPos;
  S.n = normalize(vPatinaNrm) * (gl_FrontFacing ? 1.0 : -1.0);
  S.up = S.n.y;
  S.hgt = clamp((S.p.y - uVesselMin.y) / max(uVesselSize.y, 1.0), 0.0, 1.0);
  S.px = max(length(fwidth(vPatinaPos)), 1e-3);

  // geometric curvature (signed, 1/mm) from the interpolated normal: + convex arris, − concave crease
  vec3 vp = -vViewPosition;
  vec3 dpx = dFdx(vp), dpy = dFdy(vp);
  float kx = dot(dFdx(nonPerturbedNormal), dpx) / max(dot(dpx, dpx), 1e-6);
  float ky = dot(dFdy(nonPerturbedNormal), dpy) / max(dot(dpy, dpy), 1e-6);
  float kc = 0.5 * (kx + ky);
  float gEdge = tt_ss(0.06, 0.35, kc);
  float gCrease = tt_ss(0.03, 0.25, -kc);

  // shelter from the vessel's own shape: faces turned toward the axis (inner walls,
  // the inner sides of legs), undersides, and the per-mesh interior hint
  vec3 axis = uVesselMin + 0.5 * uVesselSize;
  vec2 rad = S.p.xz - axis.xz;
  float inward = max(0.0, -dot(normalize(S.n.xz + 1e-5), normalize(rad + 1e-5))) * length(S.n.xz);
  S.inside = clamp(max(uInterior, inward * 0.55 * tt_ss(0.2, 0.6, S.hgt)), 0.0, 1.0);
  // (a cup seen through the mouth passes interior ≈ 0.45: that is already mostly the calm skin)
  S.calm = clamp(uInterior * 1.8, 0.0, 1.0);

  bool plain = true;
  float decorD = 0.0; // local décor density (blurred grooves + arrises, ~50 mm), 0 on plain fields
  #ifdef PATINA_RELIEF
    if (vNormalMapUv.x > -0.5) {
      vec4 rd = texture2D(uReliefData, vNormalMapUv);
      S.h01 = rd.r; S.cav = rd.g; S.edge = rd.b; S.groove = rd.a;
      vec4 rdB = texture2D(uReliefData, vNormalMapUv, 6.0); // a far mip: the neighbourhood
      decorD = tt_ss(0.03, 0.22, rdB.a + 0.6 * rdB.b + 0.8 * (1.0 - rdB.g));
      // a map with nothing raised (a flange's incised faces): its lands are the wall (0.5, as a
      // plain mesh), not the tops of décor — otherwise they come out paler than the body
      S.h01 = mix(0.5 * S.h01, S.h01, tt_ss(0.03, 0.1, uReliefRange.y));
      plain = false;
    }
  #endif
  if (plain) {
    #ifdef PATINA_CAVITY_ATTR
      S.cav = vCavity;
    #else
      S.cav = uConstCavity;
    #endif
    S.h01 = 0.5; S.edge = 0.0; S.groove = 0.0;
    #ifdef PATINA_RELIEF
      S.inside = max(S.inside, 0.7); // the inner wall of a decorated panel (uv = -1)
      S.calm = max(S.calm, 0.7);
    #endif
  }
  S.edge = max(S.edge, gEdge);
  S.cav = clamp(S.cav - 0.45 * gCrease - 0.25 * max(-S.up, 0.0) - 0.3 * S.inside, 0.0, 1.0);
  S.rec = clamp((1.0 - S.cav) * mix(0.55, 1.35, uCrevice), 0.0, 1.0);
  S.burial = dot(S.n, normalize(vec3(0.3, -0.2, 0.93)));

  // ---- noise fields, vessel space mm
  vec3 so = vec3(uSeed * 17.13, uSeed * -9.71, uSeed * 5.37);
  float sizeBias = clamp(pow(max(uVesselSize.y, 50.0) / 300.0, 0.3), 0.75, 1.6);
  float tS = max(uPatchScale * sizeBias, 5.0);
  vec3 w = tt_warp(S.p / (tS * 1.6) + so);
  S.T = clamp(0.5 + 0.75 * fbm3(S.p / tS + 0.4 * w - so), 0.0, 1.0);
  S.T2 = clamp(0.5 + 0.8 * snoise(S.p / (tS * 0.55) + 1.4 * w + so.zxy), 0.0, 1.0);
  // territory kind: warped Voronoi cells (~0.5 territory across), one value per cell — sharp,
  // folded borders between regions that are different in kind (noble skin / cuprite film / crust)
  float mS = max(uMottleScale, 1.0);
  S.M = clamp(0.5 + 0.75 * tt_lod(mS, S.px) * fbm2(S.p / mS + 0.6 * w * (tS / mS) * 0.08 + so.yzx), 0.0, 1.0);
  float aS = max(uAzuriteScale, 1.0);
  S.A = clamp(0.5 + 0.85 * snoise(S.p / aS + 0.5 * w + so.zyx * 1.3), 0.0, 1.0);
  // gravity: runs ~6 mm wide, ~120 mm long, straight down the walls
  S.st = tt_lod(6.0, S.px) * snoise(vec3(S.p.x / 6.0, S.p.y / 120.0, S.p.z / 6.0) + so.yxz);
  float gS = max(uMalachiteScale, 0.3);
  float gLod = tt_lod(gS, S.px);
  S.G = clamp(0.5 + 0.6 * gLod * snoise(S.p / (gS * 0.6) - so), 0.0, 1.0);
  vec2 wb = worley8(S.p / gS + so.zyx);
  S.B = mix(0.5, clamp(1.0 - wb.x * wb.x * 1.6, 0.0, 1.0), gLod);
  // (looked up through the mottle, the second territory and the grain so the cell borders
  // are ragged at every scale instead of Voronoi-straight)
  S.K = worley8(S.p / (tS * 0.5) + 0.7 * w + vec3(0.9 * (S.M - 0.5), 0.7 * (S.T2 - 0.5), 0.45 * (S.G - 0.5) + 0.5 * (S.M - 0.5)) + so.xzy).y;
  // patchiness < 1: the territory fields break up at the mottle scale instead (fine speckled
  // skin, no 100 mm islands); the territory KIND too. Costs one simplex tap.
  float Tb = S.T, T2b = S.T2; // the broad territory fields, kept for the slow tone drift
  float pat = clamp(uPatchiness, 0.0, 1.0);
  if (pat < 0.999) {
    float fS = max(mS * 0.7, 0.8);
    float Fn = tt_lod(fS, S.px) * snoise(S.p / fS + so.zxy * 0.7);
    // (the broad territory field still modulates the speckle's density: clusters, not a carpet)
    float Tf = clamp(0.5 + 0.8 * (S.M - 0.5) + 0.3 * Fn + 0.35 * (S.T - 0.5), 0.0, 1.0);
    float T2f = clamp(0.5 + 0.55 * Fn - 0.45 * (S.M - 0.5) + 0.12 * (S.G - 0.5), 0.0, 1.0);
    // kind at the speckle scale too: fine flecks of noble skin / cuprite / crust, not one wash
    float Kf = clamp(0.5 + 0.8 * Fn + 0.5 * (S.M - 0.5) + 0.15 * (S.G - 0.5) + 0.3 * (S.T2 - 0.5), 0.0, 1.0);
    S.T = mix(Tf, S.T, pat); S.T2 = mix(T2f, S.T2, pat); S.K = mix(Kf, S.K, pat);
  }
  // rimCalm: rim, handles (plain parts) and up-facing faces high on the vessel: one worn skin
  float rimK = clamp(uRimCalm, 0.0, 1.0) * (plain ? 1.0 : tt_ss(0.55, 0.85, S.up)) * tt_ss(0.55, 0.75, S.hgt) * (1.0 - S.calm);
  S.M = mix(S.M, 0.5 + 0.25 * (S.M - 0.5), rimK); S.T = mix(S.T, 0.5 + 0.2 * (S.T - 0.5), rimK);
  S.T2 = mix(S.T2, 0.5, 0.8 * rimK); S.K = mix(S.K, 0.45, rimK);
  // softness: the grain that ragged every layer edge into dots drops to a whisper
  float soft = clamp(uSoftness, 0.0, 1.0);
  S.G = mix(S.G, 0.5, 0.9 * max(soft, rimK));
  // (the territory KIND is a cell id — a step at every Voronoi border: soft mottle swaps it for a
  // continuous field so no layer is cut along a cell edge)
  S.K = mix(S.K, clamp(0.5 + 0.7 * (S.T2 - 0.5) + 0.5 * (S.M - 0.5), 0.0, 1.0), soft);
  // an interior is one quiet skin: no speckle, mottle only at territory scale
  S.M = mix(S.M, 0.5 + 0.2 * (S.T - 0.5), 0.9 * S.calm);
  S.G = mix(S.G, 0.5, 0.9 * S.calm);
  S.B = mix(S.B, 0.5, 0.9 * S.calm);
  S.st *= 1.0 - S.calm;

  // ---- the master dial: each layer arrives at its own point in the burial
  float a = clamp(uAge, 0.0, 1.0);
  float aT = tt_ss(0.0, 0.25, a);    // use-life tarnish
  float aC = tt_ss(0.08, 0.5, a);    // early cuprite
  float aN = tt_ss(0.3, 0.8, a);     // noble sheet
  float aM = tt_ss(0.35, 0.92, a);   // carbonate crust and film
  float aL = tt_ss(0.6, 1.0, a);     // late: azurite, blue-green phase, chlorides, soil, lime, streaks
  float aW = tt_ss(0.05, 0.6, a);    // handling / cleaning

  // ---- carbonate balance: area moves malachite → blue-green phase → azurite
  float bal = clamp(uCarbonate, 0.0, 1.0);
  float fracBG = (0.85 * tt_ss(0.0, 0.5, bal) - 0.15 * tt_ss(0.6, 1.0, bal)) * aL;
  float azAmt = clamp(uAzurite * (0.5 + 0.5 * bal) + 0.45 * tt_ss(0.5, 1.0, bal), 0.0, 0.85) * aL;

  float cCup = layerCuprite(S, uCuprite * aC);
  // a buried bronze has no bare metal under its patina: wherever a noble skin or carbonates
  // formed, the metal beneath them is corroded too (shows as the veiled brown skin, not gold)
  cCup = max(cCup, clamp(max(0.95 * uTinOxide * aN, 0.85 * uMalachite * aM), 0.0, 1.0));
  float cNob = layerNoble(S, uTinOxide * aN);
  float cMalR = layerMalachite(S, uMalachite * aM);
  float cFilm = layerCarbonateFilm(S, uMalachite * aM) * (1.0 - cMalR);
  float cBG = layerBlueGreen(S, fracBG);           // phase selector within the carbonates
  // azurite needs carbonate water: islands on the crust, or (recess-bound) in the grooves
  float azHost = clamp(cMalR + 0.6 * cFilm + 0.5 * S.rec * (1.0 - uBlueHabitat) + 0.3, 0.0, 1.0);
  float cAz = layerAzurite(S, azAmt) * tt_ss(0.15, 0.6, azHost);
  float cSoot = layerSoot(S, uSoot * aL);
  float cSoil = layerSoil(S, uEarth * aL) * (1.0 - 0.75 * S.calm);
  // chloride pustules: Poisson clusters (mottle × territory), denser low on the body,
  // at creases and on the burial side; each a spot of the crust-grain size over a pit
  float clus = tt_ss(0.6, 0.9, 0.55 * S.M + 0.45 * S.T2 + 0.25 * (1.0 - S.hgt) + 0.2 * gCrease + 0.1 * S.burial);
  vec2 wc = worley8(S.p / max(gS * 1.6, 0.6) - so.yxz);
  float spotR = 0.08 + 0.2 * uChloride;
  float cChlRaw = uChloride * (1.0 - 0.75 * soft) * aL * clus * step(wc.y, 0.15 + 0.45 * uChloride) * (1.0 - S.calm);
  float cChl = cChlRaw * (1.0 - tt_ss(spotR, spotR + 0.12, wc.x)) * gLod;
  float pitRing = cChlRaw * (tt_ss(spotR, spotR + 0.08, wc.x) - tt_ss(spotR + 0.1, spotR + 0.3, wc.x)) * gLod;
  // calcareous film: whitish dusting within soil territories, on up-facing crust, along the runs
  // — mostly sharp crusty islands (amount ≈ area), plus a faint general dust
  float calF = 0.45 * S.M + 0.3 * S.T2 + 0.2 * max(S.up, 0.0) + 0.15 * S.rec + 0.1 * uStreaks * S.st + 0.05 * (S.G - 0.5);
  float cCal = clamp(tt_cover(uCalcite * aL * 0.8, calF + 0.15, mix(0.05, 0.12, clamp(uSoftness, 0.0, 1.0))) * 0.9 + 0.2 * uCalcite * aL * tt_ss(0.3, 0.8, calF), 0.0, 1.0);

  // occlusion: crust occludes the noble sheet (alternatives per territory); cuprite rim
  // where a malachite island thins out
  cNob *= 1.0 - cMalR;
  float malRim = tt_ss(0.02, 0.2, cMalR) - tt_ss(0.25, 0.6, cMalR);

  // ---- relief tops rubbed clean (handling / old cleaning): darker, warmer skin on the plateaus
  // (raised = real mm above the L0 ground from the panel's range, so a 0.12 mm flush band
  // counts as much as a 2 mm plateau, and a tall boss does not squash every other top)
  float hMM = mix(uReliefRange.x, uReliefRange.y, S.h01);
  // (a map with nothing raised above L0 — a flange's incised faces — has no tops: its lands are
  // the wall, not décor bands; plain meshes only get the warm rubbing on arrises, never pale bands)
  float hasTops = tt_ss(0.03, 0.1, uReliefRange.y);
  float topK = plain ? 0.6 * S.edge * (1.0 - uTopsTone) : max(tt_ss(0.04, 0.22, hMM), 0.6 * tt_ss(0.6, 0.9, S.h01) * hasTops) * tt_ss(0.55, 0.9, S.cav) * (1.0 - S.groove);
  // the décor's sunk ground (not raised, on a panel that has raised décor) — for inlayGround
  float groundM = plain ? 0.0 : hasTops * (1.0 - tt_ss(0.02, 0.12, hMM)) * (1.0 - S.calm);
  topK *= uTops * aW * (1.0 - S.calm);

  // ---- wear / cleaning erase, top down (§3.4.9)
  float e = layerWear(S, uWear * aW);
  float kSoil = 1.0 - tt_ss(0.0, 0.15, e);
  float kCrust = (1.0 - tt_ss(0.1, 0.4, e)) * (1.0 - 0.85 * topK);
  float kNoble = 1.0 - tt_ss(0.35, 0.65, e);
  float kCup = 1.0 - tt_ss(0.6, 0.9, e);
  cSoil *= kSoil * (1.0 - topK); cCal *= kSoil * (1.0 - 0.7 * topK);
  float cMal = cMalR * kCrust; cFilm *= kCrust; cAz *= kCrust; cChl *= kCrust;
  cNob *= kNoble;
  cCup = max(cCup, malRim * uCuprite * aC * 0.8) * kCup;

  // crust thickness, mm: malachite deeper in recesses, botryoidal; soil lumps; chloride powder
  float tMal = cMal * uCrust * (0.3 + 0.7 * S.rec) * (0.55 + 0.45 * S.B);
  float tAz = cAz * uCrust * 0.7 * (0.6 + 0.4 * S.B) * mix(0.5, 1.0, uAzuriteDepth);
  float tSoil = cSoil * (0.4 + 1.6 * S.rec) * (0.6 + 0.4 * S.M);
  float thick = max(max(tMal, tAz), tSoil) + cChl * 0.25;

  // ---- L0 metal: F0 from tin, lead-dulled; tarnish browns it (§1.2); as-cast skin in recesses
  float tarn = clamp(uTarnish * aT + 0.15 * a * (1.0 - e), 0.0, 1.0) * (1.0 - 0.6 * tt_ss(0.7, 1.0, e));
  vec3 F0m = tt_metalF0(uTin, uLead);
  vec3 col = F0m * mix(vec3(1.0), vec3(0.78, 0.60, 0.45), tarn);
  col *= 1.0 - 0.35 * tarn * S.rec; // the film is darker where it is not polished off
  float polishR = mix(0.40, 0.12, uPolish);
  float rough = mix(polishR, 0.47, tt_ss(0.25, 0.8, S.rec)) + 0.06 * tarn;
  // burnished by handling where wear reached the metal; micro-pitted elsewhere once corroded
  rough = mix(rough, 0.24, tt_ss(0.7, 1.0, e) * (1.0 - uPolish * 0.5));
  rough += 0.12 * aC * uCuprite * (1.0 - e) * (S.G - 0.3);
  float metal = 1.0;
  float f0 = 0.04;

  // ---- inlay paste in the sunk lines (on the metal, under all corrosion)
  // (the sunk ground of a relief panel holds paste too, where the bake marks no groove)
  float cInl = uInlay * max(tt_ss(0.25, 0.7, S.groove), plain ? 0.0 : tt_ss(0.5, 0.8, 1.0 - S.cav));
  col = mix(col, vec3(0.007, 0.006, 0.005) * (0.8 + 0.4 * S.G), cInl);
  rough = mix(rough, 0.6, cInl); metal = mix(metal, 0.0, cInl);
  cCup *= 1.0 - cInl * 0.85; cNob *= 1.0 - cInl * 0.85;
  cMal *= 1.0 - cInl * 0.7; cFilm *= 1.0 - cInl * 0.8; cAz *= 1.0 - cInl * 0.5;

  // ---- L1 cuprite: liver / oxblood, compact & sub-metallic sheen (F0 ≈ 0.2)
  float cupT = clamp(0.45 * S.M + 0.35 * S.G + 0.3 * (1.0 - S.rec) - 0.1, 0.0, 1.0);
  vec3 cupCol = tt_pal(vec3(0.042, 0.012, 0.008), vec3(0.080, 0.024, 0.015), vec3(0.135, 0.045, 0.027), cupT * 0.8);
  // cupriteTone: compact liver/oxblood → pale powdery brick-pink (cuprite under a lime bloom, Houmuwu)
  cupCol = mix(cupCol, tt_pal(vec3(0.150, 0.068, 0.050), vec3(0.290, 0.150, 0.112), vec3(0.420, 0.250, 0.205), cupT), clamp(uCupriteTone, 0.0, 1.0));
  cupCol = mix(cupCol, cupCol * vec3(0.7, 0.62, 0.62), S.rec); // darker, browner in recesses
  col = mix(col, cupCol, cCup); rough = mix(rough, mix(0.38, 0.62, S.G), cCup); metal = mix(metal, 0.0, cCup); f0 = mix(f0, 0.18, cCup);

  // ---- L2 noble tin-oxide sheet: glossy, conformal, lighter on high points; gravity runs
  float nobT = clamp(0.36 + 0.12 * (S.M - 0.5) + 0.5 * uNobleRelief * (1.0 - S.rec) * (S.h01 - 0.4) - 0.25 * S.rec + 0.12 * (S.T2 - 0.5) - 0.12 * uStreaks * aL * S.st, 0.0, 1.0);
  vec3 nobCol = tt_nobleColor(uTinOxideTone, nobT);
  nobCol = mix(nobCol, vec3(tt_lum(nobCol)) * vec3(1.32, 0.98, 0.76), 0.9 * uNobleWarmth);
  col = mix(col, nobCol, cNob); rough = mix(rough, 0.2 + 0.12 * S.rec + 0.06 * S.M, cNob); metal = mix(metal, 0.0, cNob); f0 = mix(f0, 0.075, cNob);
  // outside the sheet a thinner, browner skin still veils the cuprite: warm brown, not raw red
  float veil = (1.0 - cNob) * cCup * uTinOxide * aN * (0.65 - 0.35 * S.rec) * (0.6 + 0.4 * S.M) * (1.0 - 0.75 * uCupriteTone);
  // (a grey, tin-rich 水银古 skin veils it greyer: less of the cuprite's warmth comes through)
  float veilCup = 0.45 * (1.0 - 0.7 * clamp(uTinOxideTone - 1.0, 0.0, 1.0));
  col = mix(col, nobCol * (1.2 - veilCup) + cupCol * veilCup, veil); rough = mix(rough, 0.32, veil);

  // ---- L3 soot / tenorite low on the body
  col = mix(col, vec3(0.022, 0.018, 0.014), cSoot * 0.85); rough = mix(rough, 0.8, cSoot * 0.85); metal = mix(metal, 0.0, cSoot * 0.85);

  // ---- L4 carbonates. Malachite: dark & compact under thin crust, banded light on domes,
  // a paler powder packed in the recesses. The blue-green phase replaces it per territory.
  float band = tt_ridged(S.p / (gS * 2.2) + w * 0.6);
  float malT = clamp(0.5 + 0.4 * (S.M - 0.5) + 0.12 * (S.B - 0.5) * tt_ss(0.0, 0.8, uCrust) + 0.12 * (band - 0.5) + 0.12 * S.rec + 0.3 * (S.T - 0.5) - 0.1 + 0.7 * (uMalachiteTone - 0.5), 0.0, 1.0);
  vec3 malCol = tt_malachiteColor(uMalachiteHue, malT);
  vec3 tqCol = tt_turquoiseColor(uTurquoiseTone, clamp(malT + 0.08 + 0.15 * (S.G - 0.5), 0.0, 1.0));
  vec3 carbCol = mix(malCol, tqCol, cBG);
  // thin crust lets the cuprite through: red-brown show-through
  float thin = 1.0 - tt_ss(0.05, 0.45, tMal + 0.25 * cMal * (1.0 - uCrust * 0.3));
  carbCol = mix(carbCol, cupCol + carbCol * 0.25, thin * 0.5 * uCuprite);
  // the film: a thin translucent stain over whatever is below — darkens and tints, no body
  // (a pale, earthy carbonate is a chalky powder film instead: it lightens what it veils)
  vec3 filmTint = mix(malCol, tqCol, cBG);
  vec3 filmCol = mix(mix(col, col * 0.55 + filmTint * 0.45, 0.85), mix(col, filmTint, 0.75), tt_ss(0.5, 1.0, uMalachiteTone));
  col = mix(col, filmCol, cFilm); rough = mix(rough, rough + 0.12, cFilm);
  col = mix(col, carbCol, cMal);
  rough = mix(rough, mix(0.45, 0.8, tt_ss(0.2, 2.0, uCrust)) - 0.1 * S.B + 0.12 * cBG, cMal); metal = mix(metal, 0.0, max(cMal, cFilm * 0.6)); f0 = mix(f0, 0.065, cMal);

  // ---- L5 azurite islands: thresholded, never blended into teal. Deep = crystalline, glassy
  float azT = clamp(0.4 + 0.5 * (S.B - 0.5) + 0.4 * (S.M - 0.5) + 0.25 * (S.G - 0.5) - 0.2 * S.rec, 0.0, 1.0);
  vec3 azCol = tt_azuriteColor(uAzuriteDepth, azT);
  col = mix(col, azCol, cAz);
  rough = mix(rough, mix(0.85, 0.32, uAzuriteDepth) + 0.15 * (S.G - 0.5) * uAzuriteDepth, cAz); metal = mix(metal, 0.0, cAz); f0 = mix(f0, mix(0.04, 0.075, uAzuriteDepth), cAz);

  // ---- L6 chlorides: pale chalky bluish green over a pit, dark ring of cuprite
  col = mix(col, cupCol * 0.55, pitRing * 0.8);
  vec3 chlCol = tt_pal(vec3(0.159, 0.423, 0.238), vec3(0.314, 0.597, 0.381), vec3(0.546, 0.761, 0.597), S.G);
  col = mix(col, chlCol, cChl); rough = mix(rough, 0.97, cChl); metal = mix(metal, 0.0, cChl);

  // ---- L7 relief tops: rubbed to a darker, warmer, smoother skin
  vec3 topWarm = mix(col, col * vec3(0.62, 0.52, 0.42) + cupCol * 0.35, 0.8);
  // or paler: a thinner, abraded noble skin over the metal reads silvery grey against a dark ground
  vec3 topPale = mix(col, vec3(tt_lum(col)) * vec3(0.97, 1.0, 0.98) * 1.9 + vec3(0.024, 0.027, 0.025), 0.85);
  vec3 topCol = mix(topWarm, topPale, clamp(uTopsTone, 0.0, 1.0));
  col = mix(col, topCol, topK * 0.75); rough = mix(rough, rough * 0.75, topK);

  // ---- L8 soil and calcareous film
  vec3 soilCol = uEarthColor * uEarthColor; // sRGB pick → ~linear
  soilCol = mix(soilCol * 0.62, mix(soilCol, vec3(0.644, 0.509, 0.301), 0.4), clamp(S.M * 0.8 + 0.4 * (S.G - 0.5), 0.0, 1.0));
  col = mix(col, soilCol, cSoil); rough = mix(rough, 0.95, cSoil); metal = mix(metal, 0.0, cSoil); f0 = mix(f0, 0.04, cSoil);
  vec3 calCol = tt_pal(vec3(0.470, 0.455, 0.400), vec3(0.640, 0.630, 0.585), vec3(0.820, 0.810, 0.770), S.G);
  float calA = cCal * (0.5 + 0.35 * cSoil) * (1.0 - cChl);
  // lime film: lightens and greys what it sits on rather than painting it beige
  float lumC = tt_lum(col);
  vec3 film = mix(calCol * 0.7, mix(col, vec3(lumC), 0.55) * 1.5 + vec3(lumC) * 0.6, 0.65);
  col = mix(col, film, calA); rough = mix(rough, 0.88, calA); metal = mix(metal, 0.0, calA);

  // ---- gravity: darker runs down the walls, one pale tide line where the water stood
  float runs = uStreaks * aL * (1.0 - S.inside) * tt_ss(0.25, 0.85, S.st) * (0.5 + 0.5 * tt_ss(-0.2, 0.6, S.T2 - 0.3 + S.M * 0.6));
  col *= 1.0 - 0.28 * runs * (1.0 - metal);
  float tideH = 0.22 + 0.3 * fract(uSeed * 0.618);
  float tide = uStreaks * aL * (1.0 - tt_ss(0.0, 0.012, abs(S.hgt - tideH + 0.03 * (S.M - 0.5)))) * (1.0 - S.inside) * (0.4 + 0.6 * S.M);
  col = mix(col, mix(col, vec3(tt_lum(col)) * 1.6 + calCol * 0.12, 0.7), tide * 0.6 * (1.0 - metal));

  // ---- an interior: one calm corroded skin — dark grey-brown → pale green (interiorTone)
  // (only a slow, low-contrast breathing of the tone: no territories, no speckle; a little
  // paler on up-facing floors where fine silt settled, darker deep down)
  vec3 skin = mix(vec3(0.026, 0.025, 0.020), vec3(0.075, 0.098, 0.068), uInteriorTone) * (0.9 + 0.16 * S.T + 0.06 * S.T2 + 0.08 * max(S.up, 0.0));
  skin = mix(skin, cupCol * 0.55, 0.1 * (1.0 - uInteriorTone));
  float skinK = tt_ss(0.0, 0.7, S.calm) * tt_ss(0.2, 0.7, a) * 0.96;
  col = mix(col, skin, skinK); rough = mix(rough, 0.8, skinK); metal = mix(metal, 0.0, skinK); f0 = mix(f0, 0.045, skinK);

  // ---- inlayGround: black paste (or packed dark dirt) fills the whole sunk ground of the décor —
  // the lands of the leiwen too — so flush bands read light on a black field (Met zun). It is what
  // shows after cleaning, so it sits over the corrosion, under the dust
  float cGnd = uInlayGround * groundM * (0.85 + 0.15 * S.G) * (1.0 - 0.6 * cSoil);
  col = mix(col, vec3(0.010, 0.010, 0.009) * (0.8 + 0.5 * S.M), cGnd * 0.92);
  rough = mix(rough, 0.62, cGnd); metal = mix(metal, 0.0, cGnd); f0 = mix(f0, 0.045, cGnd);
  cInl = max(cInl, cGnd);

  // ---- grain & crust (round 4b). (colour uniforms are linear already: THREE.Color converts the sRGB pick) Each layer is thresholded (hard-edged close up) and blended to
  // its local mean coverage once its grain is under ~a pixel, so at vessel distance it is a tone
  float hiZ = tt_ss(0.86, 0.99, S.hgt);                                        // rim lip / top
  float loZ = 1.0 - tt_ss(0.6 * max(uLowerHeight, 0.08), max(uLowerHeight, 0.08), S.hgt); // foot / legs
  float cSpk = 0.0, cIsl = 0.0, cPus = 0.0;
  if (uSpeckle > 0.001) {
    float sS = max(uSpeckleScale, 0.3);
    float sl = 1.0 - tt_ss(0.5, 1.5, S.px / sS);
    float fine = 0.5 + 0.5 * (0.7 * snoise(S.p / sS + so.zxy) + 0.3 * sl * snoise(S.p / (sS * 0.45) - so.yzx));
    float dens = 0.75 * fbm2(S.p / (sS * 6.0) + so) + 0.25 * (S.M - 0.5) * 2.0; // clumps 10–40 mm
    // (round 4c: thinner on the lower body — it read as a red camouflage on the Houmuwu legs —
    // and, with softness, a feathered stipple that blends rather than a hard-edged dot)
    float loc = clamp(uSpeckle * aL * (1.0 + 1.5 * dens) * (1.0 - uSpeckleDecor * decorD) * (1.0 - 0.6 * S.rec) * (1.0 - 0.8 * hiZ) * (1.0 - 0.75 * loZ * uLowerBody) * (plain ? 1.0 - 0.8 * clamp(uRimCalm, 0.0, 1.0) : 1.0), 0.0, 1.0);
    float sw = mix(0.07, 0.15, soft);
    cSpk = mix(loc, tt_ss(1.0 - loc - sw, 1.0 - loc + sw, fine), sl) * mix(1.0, 0.8, soft);
    vec3 sc = uSpeckleColor * (0.8 + 0.4 * fine);
    col = mix(col, sc, cSpk); rough = mix(rough, 0.85, cSpk); metal = mix(metal, 0.0, cSpk); f0 = mix(f0, 0.05, cSpk);
  }
  if (uCrustIsles > 0.001) {
    float cS = max(uCrustScale, 1.0);
    float il = 1.0 - tt_ss(0.35, 1.2, S.px / cS);
    // (round 4c: multi-octave — patches 0.5–3× the island size — and, with softness, a feathered
    // edge several mm wide: a bloom that fades into the skin, not a camouflage cut-out)
    float fi = 0.5 + 0.5 * (0.55 * snoise(S.p / cS + 0.25 * w - so.zyx) + 0.3 * snoise(S.p / (cS * 2.7) + so.yzx) + 0.2 * il * snoise(S.p / (cS * 0.45) + so.xzy));
    float pl = clamp(uCrustPlace, 0.0, 1.0);
    float wLo = clamp(0.15 + 0.8 * S.rec + 0.5 * decorD, 0.0, 1.0);
    // (lives on up-facing flats — ledges, steps, the lid's lower edge — more than on raised arrises:
    // arris weighting traced plateau rims with lines of green)
    float wHi = clamp(0.1 + mix(0.6, 0.2, soft) * S.edge + 0.45 * soft * tt_ss(0.35, 0.8, S.up) * (1.0 - S.edge) + 0.35 * (1.0 - decorD) * (plain ? 1.0 : 0.5) + hiZ * (1.0 - S.inside) + loZ, 0.0, 1.0);
    // clustered: crusted territories (~5 islands across) and clean ones between them
    float clu = tt_ss(0.2, 0.7, 0.5 + 0.5 * snoise(S.p / (cS * 5.0) + so.yxz) + 0.35 * (S.T2 - 0.5));
    float loc = clamp(uCrustIsles * aL * tt_ss(0.25, 0.7, mix(wLo, wHi, pl)) * 1.8 * clu * (1.0 - 0.6 * cInl), 0.0, 0.95);
    float iw = mix(0.025, 0.2, soft);
    cIsl = mix(loc * mix(1.0, 0.8, soft), tt_ss(1.0 - loc - iw, 1.0 - loc + iw, fi) * mix(1.0, 0.85, soft), il);
    float ct = clamp(0.5 + mix(1.4, 0.6, soft) * (fi - 0.5) + 0.3 * (S.G - 0.5), 0.0, 1.0);
    vec3 cc = uCrustColor * (0.78 + 0.4 * ct);
    col = mix(col, cc, cIsl); rough = mix(rough, 0.97, cIsl); metal = mix(metal, 0.0, cIsl); f0 = mix(f0, 0.035, cIsl);
  }
  if (uPustules > 0.001) {
    float pS = max(uPustuleScale, 1.0);
    float pl2 = 1.0 - tt_ss(0.4, 1.3, S.px / pS);
    vec2 wp = worley8(S.p / pS + 0.15 * w + so.yzx);
    // (round 4c: lodged in recesses and along flange / rim edges, never on a plateau top like a decal)
    float clu = tt_ss(0.35, 0.75, 0.5 + 0.5 * snoise(S.p / (pS * 7.0) - so.zxy) + 0.5 * hiZ + 0.35 * loZ + 0.45 * S.rec + 0.25 * S.edge - 0.25);
    float loc = clamp(uPustules * aL * 2.2 * clu * (1.0 - 0.85 * (plain ? 0.0 : tt_ss(0.04, 0.22, hMM) * (1.0 - S.edge))), 0.0, 1.0);
    float rr = 0.3 + 0.12 * snoise(S.p / (pS * 0.4));
    float disc = (1.0 - tt_ss(rr - 0.06, rr + 0.06, wp.x)) * step(wp.y, loc);
    cPus = mix(loc * 0.28, disc, pl2);
    vec3 pc = uPustuleColor * (0.75 + 0.5 * clamp(1.0 - wp.x / max(rr, 0.05), 0.0, 1.0));
    col = mix(col, pc, cPus); rough = mix(rough, 0.8, cPus); metal = mix(metal, 0.0, cPus); f0 = mix(f0, 0.06, cPus);
  }
  // ---- grain (round 4c): the soft, multi-scale breathing of a real skin — 2.5 mm and 9 mm octaves of
  // lightness, a little warm↔cool hue at 9 mm, roughness following the grain. Smooth noise, no
  // threshold: it can never read as dots, and it fades to its mean under a pixel. Two simplex taps.
  if (uGrain > 0.001) {
    float g1 = tt_lod(2.5, S.px) * snoise(S.p / 2.5 + so.yzx * 1.7);
    float g2 = tt_lod(9.0, S.px) * snoise(S.p / 9.0 - so.zxy * 1.3);
    float gk = uGrain * a * (1.0 - S.calm) * (1.0 - 0.7 * cInl);
    col *= (1.0 + gk * (0.2 * g1 + 0.2 * g2)) * (vec3(1.0) + gk * 0.08 * g2 * vec3(1.0, -0.15, -0.9));
    rough += gk * 0.1 * g1;
  }

  // ---- slow tone drift (50–200 mm): lightness and warmth breathe across the skin
  float dr = clamp(uDrift, 0.0, 1.0) * a * (1.0 - S.calm);
  col *= (1.0 + 0.9 * dr * (Tb - 0.5)) * mix(vec3(1.0), vec3(1.08, 1.0, 0.88), dr * clamp(1.6 * (T2b - 0.5), -1.0, 1.0));

  // ---- dulling: dust, old wax and fine soil in the pores grey the minerals down
  float dull = uDulling * a * (1.0 - metal) * (1.0 - 0.8 * cPus); // (crystalline pustules stay saturated: round 4c)
  float lumD = tt_lum(col);
  col = mix(col, vec3(lumD) * vec3(1.0, 1.01, 0.985), dull * 0.72);

  // ---- lower body: legs and foot carry a darker, greener skin (closer to the ground water)
  float lowK = clamp(uLowerBody, 0.0, 1.0) * a * (1.0 - tt_ss(uLowerHeight - 0.06, uLowerHeight + 0.06, S.hgt)) * (1.0 - S.calm);
  col = mix(col, col * uLowerColor, lowK);
  float upK = a * (1.0 - S.calm) * tt_ss(uUpperHeight - 0.04, uUpperHeight + 0.04, S.hgt);
  col *= mix(1.0, uUpperTone, upK);
  col *= mix(1.0, uPlainTone, (plain ? 1.0 : 1.0 - decorD) * (1.0 - S.calm) * a);
  col *= uTint; // (after the dulling, which would grey a tint away)

  // ---- dirt and wax in recesses on cleaned pieces (§3.4.10), museum wax sheen
  float dirt = uRecessDirt * pow(S.rec, 1.5) * (1.0 - cSoil);
  col *= 1.0 - 0.7 * dirt; rough = min(1.0, rough + 0.3 * dirt);
  rough = mix(rough, min(rough, 0.34), uWax * (1.0 - metal) * (1.0 - cChl)); f0 += 0.02 * uWax * (1.0 - metal);

  // ---- matte: an excavated skin is micro-pitted and dusty — a soft sheen at most, never a
  // broad glossy highlight. Raises the roughness floor (wax included), more in recesses;
  // even metal rubbed bare stays satin; dielectric F0 eased toward 0.045
  float mt = clamp(uMatte, 0.0, 1.0) * tt_ss(0.1, 0.6, a);
  rough = mix(rough, max(rough, mix(0.6, 0.82, S.rec) + 0.06 * (S.G - 0.5)), mt * (1.0 - 0.35 * metal));
  f0 = mix(f0, min(f0, 0.05), 0.6 * mt);
  // dusty ledges: up-facing faces are fully matte (dust kills the grazing sheen that read as white lines)
  float ldg = clamp(uLedgeMatte, 0.0, 1.0) * tt_ss(0.45, 0.8, S.up) * (1.0 - S.calm) * tt_ss(0.1, 0.6, a);
  col = mix(col, col * 0.3, ldg * metal); // (bare worn metal under the dust: a dark diffuse grey, not a mirror)
  rough = mix(rough, 0.98, ldg); f0 = mix(f0, 0.02, ldg); metal = mix(metal, 0.0, ldg);

  ttF0 = f0;
  if (uPatinaMode > 0.5) {
    if (uPatinaMode > 2.5) {
      // mask: which layer is on top, false colour, unlit
      vec3 m = mix(vec3(0.85, 0.65, 0.25), vec3(1.0), tt_ss(0.7, 1.0, e));           // metal (white = worn bright)
      m = mix(m, vec3(0.75, 0.10, 0.05), cCup);                                       // cuprite red
      m = mix(m, vec3(0.55, 0.25, 0.75), cNob);                                       // noble sheet violet
      m = mix(m, vec3(0.05, 0.05, 0.05), max(cInl, cSoot * 0.85));                    // inlay / soot black
      m = mix(m, vec3(0.35, 0.55, 0.35), cFilm);                                      // carbonate film grey-green
      m = mix(m, mix(vec3(0.10, 0.80, 0.25), vec3(0.10, 0.75, 0.70), cBG), cMal);     // malachite green / blue-green phase teal
      m = mix(m, vec3(0.10, 0.30, 1.00), cAz);                                        // azurite blue
      m = mix(m, vec3(0.20, 1.00, 1.00), cChl);                                       // chloride cyan
      m = mix(m, vec3(1.00, 0.85, 0.10), cSoil);                                      // soil yellow
      m = mix(m, vec3(1.00, 0.70, 0.80), calA);                                       // calcite pink
      m = mix(m, vec3(0.80, 0.35, 0.30), cSpk);                                       // fine speckle salmon
      m = mix(m, vec3(0.80, 0.80, 0.60), cIsl);                                       // crust islands buff
      m = mix(m, vec3(0.00, 0.55, 0.20), cPus);                                       // pustules emerald
      m = mix(m, vec3(0.45, 0.30, 0.20), skinK);                                      // interior skin brown
      m *= 0.55 + 0.45 * clamp(1.0 - thick * 0.25, 0.0, 1.0);                         // darker = thicker crust
      totalEmissiveRadiance = m;
      col = vec3(0.0); rough = 1.0; metal = 0.0;
    } else {
      // clay / height: relief only, no patina
      float g = uPatinaMode > 1.5 ? 0.0 : 0.42;
      col = vec3(g); rough = 0.62; metal = 0.0; ttF0 = 0.04;
      if (uPatinaMode > 1.5) totalEmissiveRadiance = plain ? vec3(0.12) : vec3(S.h01);
    }
  } else {
    // encrustation softens the cast line work: flatten the relief normal under thick crust
    // (and in grooves filled flush with paste), then add the crust's own lumps and pits
    float flatK = clamp(tt_ss(0.0, 1.4, thick) * 0.9 + cInl * 0.6, 0.0, 0.95);
    normal = normalize(mix(normal, nonPerturbedNormal, flatK));
    float bumpH = (tMal * 0.35 * (S.B - 0.5) + tSoil * 0.4 * (S.M - 0.5) + tAz * 0.3 * S.B + cChl * 0.15 - pitRing * 0.25) * gLod
                + 0.02 * aC * (S.G - 0.5) * gLod;
    bumpH *= 1.0 - 0.75 * soft; // soft mottle: no grain-sized glints either
    normal = tt_bump(normal, bumpH, vp);
  }

  diffuseColor.rgb = col;
  roughnessFactor = clamp(rough, 0.04, 1.0);
  metalnessFactor = clamp(metal, 0.0, 1.0);
}
`
