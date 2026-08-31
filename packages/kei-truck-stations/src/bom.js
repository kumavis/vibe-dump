// ---------------------------------------------------------------------------
// The bill of materials
//
// Every functional component in this project is a product somebody can order.
// Custom fabrication is allowed for exactly two things — the plywood and
// aluminium framing, and the hinges — because those are what a fabricator makes
// anyway. Everything else (the speakers, the griddle, the water tanks, the
// slides, the jacks, the masts, the gas struts) is a catalogue part with a model
// number, a price and a shop in Tokyo that stocks it.
//
// THIS FILE IS ALSO THE DIMENSION SOURCE. The geometry imports from here, so
// the bass bin in the scene is the size of the bass bin on the invoice. That
// matters more than it sounds: it is the only way the packing check means
// anything. A module that fits in the bed with imaginary boxes has not been
// checked, it has been drawn.
//
// THE MOUNTING FIELD IS THE POINT OF THE WHOLE EXERCISE. You cannot bolt a
// hinge to the side of a loudspeaker, or to a rotomoulded water tank, or to an
// LP cylinder — most of the things a module carries have no fixing points at
// all. So every item says exactly what holds it: a named threaded insert, an
// M20 pole socket, a rack ear, a bolt pattern — or, far more often, "no mount
// points: capture in a cradle", and then what the cradle has to grip. Anything
// captured rather than bolted needs a custom timber or aluminium part, and
// those appear in the list too, priced as fabrication.
//
// Prices are Japanese street prices in yen, tax included where known, gathered
// from Soundhouse, Monotaro, Misumi, Amazon.co.jp, Yodobashi, Kohnan and the
// makers' own trade lists. They are researched, not quoted: treat them as an
// order of magnitude for a build sheet, not as a purchase order.
// ---------------------------------------------------------------------------

/** millimetres, as the catalogues quote them. */
const mm = (v) => v

/**
 * @typedef {object} Item
 * @property {string} cat        category, used to group the readout
 * @property {string} maker
 * @property {string} model      the actual model / part number
 * @property {[number,number,number]} [size]  w x h x d in mm, as installed
 * @property {number} kg         each
 * @property {number} jpy        each
 * @property {number} qty
 * @property {string} where      a shop in Tokyo that stocks it
 * @property {string} mount      how it is held. This is the important one.
 * @property {'high'|'medium'|'low'} conf
 * @property {string} [note]
 */

// --- YATAI -------------------------------------------------------------------
// Three findings from the research drive this list, and all three are about the
// truck rather than the food.
//
// THE WATER TIER IS SET BY PAYLOAD. Japan's mobile-food-vehicle licence has
// 40 / 80 / 200 L supply tiers, and waste has to match. Water alone is 80 kg at
// 40 L, 160 kg at 80 L, and 400 kg at 200 L — which is more than the entire
// payload before a single screw. The 200 L tier is physically impossible on a
// kei truck and 80 L leaves nothing for the canopy. So this is a 40 L vehicle,
// which permits reheating and assembling pre-prepped food in disposable
// containers: takoyaki, yakisoba, karaage, oden. Which is a yatai menu, so the
// constraint costs nothing at all.
//
// THREE BOWLS, NOT TWO. Two wash compartments plus a SEPARATE hand-wash basin.
// The separate basin is the requirement people most often miss.
//
// THE GAS BOTTLE CANNOT BE ON THE DECK. It has to be outdoors, upright, vented
// at low level (propane sinks) and 2 m from any flame. On a 1940 mm deck with a
// griddle on it, 2 m does not exist — so the external rear locker is not
// styling, it is the only compliant answer.
export const YATAI = [
  {
    cat: 'cooking', maker: 'IKK (伊東金属工業所)', model: 'TKO18321 てっぱんたこ焼 3連式 LPガス',
    size: [595, 190, 358], kg: 38, jpy: 67880, qty: 1, where: 'テンポスバスターズ / 厨房卸売センター',
    mount: 'NO mount points — a sheet-steel case on four 30 mm feet. Captured: a 605 × 368 well cut through the 24 mm ply worktop, lined with calcium-silicate board and stainless (bare ply against a cast-iron gas griddle is a fire), with two straps over the case ends.',
    conf: 'medium',
    note: 'The cast plates lift straight out of the frame. Roughly 20 kg of loose iron unless they are removed and stowed for transit — the single most dangerous item in the module.',
  },
  {
    cat: 'cooking', maker: '岩谷産業 (Iwatani)', model: 'CB-ETK-2 プロたこマルチ',
    size: [346, 135, 278], kg: 3.4, jpy: 9800, qty: 1, where: 'ヨドバシ / Amazon.co.jp',
    mount: 'Four rubber feet, no fixings. A 3 mm ply rebate 350 × 282 with a hinged retaining bar across the front, so it locates positively and still lifts out.',
    conf: 'medium',
  },
  {
    cat: 'water', maker: '汎用 SUS304', model: '角型シンクボウル 450 × 390 × 深180',
    size: [450, 180, 390], kg: 2, jpy: 6800, qty: 2, where: 'モノタロウ / 合羽橋',
    mount: 'Drop-in, no fixings supplied. The rolled rim sits on the worktop over a 430 × 370 cut-out, bedded in food-grade silicone and pulled down by four stainless under-clips.',
    conf: 'medium',
  },
  {
    cat: 'water', maker: '汎用 SUS304', model: '手洗い用シンクボウル 320 × 230 × 深120',
    size: [320, 120, 230], kg: 1.2, jpy: 3900, qty: 1, where: 'モノタロウ / 合羽橋',
    mount: 'Same rim-and-underclip, 300 × 210 cut-out. Sited at the serving end, physically separated from the wash pair, with its own tap — the inspector checks that it is separate.',
    conf: 'medium',
  },
  {
    cat: 'water', maker: 'スイコー (Suiko)', model: 'HLT-50 ホームローリータンク 50 L',
    size: [400, 500, 380], kg: 3.5, jpy: 9000, qty: 2, where: 'モノタロウ / コーナン',
    mount: 'ZERO mount points — rotomoulded PE, smooth radiused body, one 100 mm filler and one 38 mm cock boss. Cannot be bolted anywhere. Captured in a three-sided ply well 405 × 505 with two cam straps over the shoulder.',
    conf: 'high',
    note: 'One supply, one waste, filled to 40 L each = 80 kg of water. That is 23% of the payload.',
  },
  {
    cat: 'water', maker: '汎用 (キャンピングカー部品)', model: 'DC12V 水中ポンプ 10 L/min',
    size: [50, 95, 50], kg: 0.4, jpy: 3500, qty: 1, where: 'Amazon.co.jp',
    mount: 'A hanging loop and nothing else. Drops into the supply tank through the filler and hangs on its own hose; the drilled tank cap is the restraint.',
    conf: 'medium',
  },
  {
    cat: 'water', maker: 'SANEI', model: '自在水栓 泡沫キャップ付 呼13',
    size: [150, 230, 60], kg: 0.5, jpy: 3200, qty: 3, where: 'コーナン / モノタロウ',
    mount: 'Deck-mount shank with a backnut through the worktop.',
    conf: 'medium',
  },
  {
    cat: 'cold', maker: '山善 (Yamazen)', model: 'YFR-AC252(B) 車載用冷凍冷蔵庫 25 L',
    size: [593, 410, 345], kg: 11.2, jpy: 34800, qty: 1, where: 'ヨドバシ / Amazon.co.jp',
    mount: 'Moulded case with recessed side handles, no threaded inserts. A ply cradle gripping the base rim, plus one cam strap through the handle recesses.',
    conf: 'medium',
  },
  {
    cat: 'gas', maker: 'LPガス販売事業者', model: 'LPガス容器 8 kg (内容積 19 L)',
    size: [290, 500, 290], kg: 18, jpy: 12000, qty: 1, where: '岩谷産業 販売店 (充填契約)',
    mount: 'LITERALLY no mount points — a smooth barrel with a foot skirt and a neck guard. Barrel bands are the only restraint that exists. Lives in an external vented locker off the rear crossmember, upright, vented at the BOTTOM because propane sinks.',
    conf: 'high',
  },
  {
    cat: 'gas', maker: 'I・T・O (伊藤工機)', model: 'HS-5BP 単段式調整器 + ホース口',
    size: [110, 95, 80], kg: 0.8, jpy: 5800, qty: 1, where: 'モノタロウ',
    mount: 'Screws onto the cylinder valve; the hose is band-clamped to the burner tail.',
    conf: 'medium',
  },
  {
    cat: 'gas', maker: 'custom (アルミ)', model: 'ボンベ庫 — vented cylinder locker 340 × 340 × 620 internal',
    size: [380, 680, 380], kg: 8.5, jpy: 28000, qty: 1, where: 'fabrication',
    mount: 'Bolted M10 to the rear crossmember, outboard of the tail. Low-level louvres.',
    conf: 'low',
  },
  {
    cat: 'extract', maker: '三菱電機', model: 'EWF-20YSA 産業用有圧換気扇 200 mm',
    size: [300, 250, 300], kg: 7.5, jpy: 17173, qty: 1, where: 'モノタロウ / ヨドバシ',
    mount: 'Four corner flange holes into a ply bulkhead on the flue.',
    conf: 'medium',
  },
  {
    cat: 'extract', maker: '汎用 SUS304 + アルミフレキ', model: '排気フード + グリスフィルター + φ150 ダクト + ベントキャップ',
    size: [700, 450, 300], kg: 8.5, jpy: 31700, qty: 1, where: '合羽橋 / モノタロウ',
    mount: 'Hood riveted to the worktop backsplash; the flexible duct compresses to a quarter of its length, which is what lets the flue telescope.',
    conf: 'low',
  },
  {
    cat: 'front of house', maker: '高山商店 (上野) / 高橋提燈', model: '尺3丸 和紙提灯 380φ × 430h (文字入れ)',
    size: [380, 430, 380], kg: 0.35, jpy: 12000, qty: 1, where: '上野 / 浅草',
    mount: 'Wire hoops top and bottom; hangs from a hook.',
    conf: 'high',
  },
  {
    cat: 'front of house', maker: '和光産業', model: '9号丸型 ビニール提灯 260φ × 330h',
    size: [260, 330, 260], kg: 0.12, jpy: 1200, qty: 4, where: 'Amazon.co.jp / 浅草',
    mount: 'Hook through the top hoop, tied down at the bottom so it does not fly.',
    conf: 'high',
  },
  {
    cat: 'front of house', maker: '水野染工場', model: 'オーダー暖簾 一間巾 1800 × 600 三巾 乳付',
    size: [1800, 600, 5], kg: 0.9, jpy: 24000, qty: 1, where: 'made to order',
    mount: 'Sewn loops (乳) over a 25 mm aluminium rod in two clamps.',
    conf: 'medium',
  },
  {
    cat: 'prep', maker: '住べテクノプラスチック', model: '20SWK 抗菌スーパー耐熱まな板 600 × 300 × 20',
    size: [600, 20, 300], kg: 3.4, jpy: 8253, qty: 1, where: '合羽橋 / モノタロウ',
    mount: 'Loose on the worktop; stowed in a slot beside the tank well for transit.',
    conf: 'high',
  },
  {
    cat: 'power', maker: '汎用 LiFePO4 + 正弦波インバーター', model: '12V 100Ah + 1500 W インバーター + 分電盤',
    size: [330, 215, 175], kg: 16, jpy: 68000, qty: 1, where: 'Amazon.co.jp / オートバックス',
    mount: 'Battery case has M6 hold-down lugs at the base; bolted to the subframe with a strap over the top.',
    conf: 'low',
  },
]

// --- SOUND SYSTEM ------------------------------------------------------------
// Filled from the gear research. Until it lands this is the shape the readout
// expects, and the geometry keeps its own dimensions.
export const SOUND = []

// --- HOKORA ------------------------------------------------------------------
export const HOKORA = []

// --- CABIN -------------------------------------------------------------------
export const CABIN = []

// --- SHARED HARDWARE ---------------------------------------------------------
// The mechanical parts every module uses. Priced once, since only one module is
// on the truck at a time and the jacks, the subframe and the tie-downs stay.
export const SHARED = []

export const BOM = {
  'sound-system': SOUND,
  yatai: YATAI,
  hokora: HOKORA,
  cabin: CABIN,
  shared: SHARED,
}

/** Totals for a module's list, plus the shared hardware. */
export function bomTotals(items) {
  let jpy = 0
  let kg = 0
  let lines = 0
  for (const i of items) {
    jpy += i.jpy * i.qty
    kg += i.kg * i.qty
    lines += 1
  }
  return { jpy, kg, lines }
}

/** Group a list by category, preserving first-seen order. */
export function byCategory(items) {
  const out = new Map()
  for (const i of items) {
    if (!out.has(i.cat)) out.set(i.cat, [])
    out.get(i.cat).push(i)
  }
  return out
}

/** How many items in a list have no fixing points of their own. */
export function captureCount(items) {
  return items.filter((i) => /no mount points|zero mount points|no fixings|literally no/i.test(i.mount)).length
}

export { mm }
