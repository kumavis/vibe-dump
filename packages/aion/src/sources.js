// Where every statement in the film comes from. Cue text carries [[id]]
// markers that resolve to entries here. `read` records how the source was
// checked: 'full' means the article text was read for this project; 'summary'
// means only a search-engine summary was seen and it still needs reading.

export const SOURCES = [
  { id: 'ew', read: 'full',
    title: 'EyeWiki (American Academy of Ophthalmology): Non-Arteritic Anterior Ischemic Optic Neuropathy (NAION)',
    url: 'https://eyewiki.org/Non-Arteritic_Anterior_Ischemic_Optic_Neuropathy_(NAION)',
    took: 'Incidence and age; the small “disc at risk” (cup-to-disc ratio under 0.2, small discs in up to 97% of patients) and that its role is unclear; the compartment-syndrome idea and that no mechanism is established; the IONDT not confirming the night-time theory; lower-field loss most common; worsening over two weeks, stabilising within two months; nerve-fibre-layer thinning at 2–3 months, plateau at 6; recovery of three lines in 13–43%; fellow eye 15–24% over five years, recurrence 3–8%; no effective treatment and no trial evidence for risk-factor control; medicines debate, including advice not to stop semaglutide on one study; testing for giant cell arteritis when suspected.' },
  { id: 'hay', read: 'full',
    title: 'Hayreh SS. Anterior Ischemic Optic Neuropathy, Part 2: a discussion for physicians (and Part 1, for patients). EyeRounds, University of Iowa',
    url: 'https://eyerounds.org/article/AION/AION-part2.htm',
    took: 'Nerve head supplied mainly by the posterior ciliary arteries (lateral and medial); perfusion pressure = mean blood pressure − eye pressure; autoregulation and its critical range; the night-time blood-pressure theory, bedtime tablets, and 73% noticing loss on waking; temporary under-perfusion rather than a clot as the usual cause; the small cup as a secondary factor; stalled transport in starved fibres causing the disc swelling; swollen fibres compressing the capillaries among them, and the vicious circle; swelling present from onset, splinter bleeds, pallor from 2–3 weeks, swelling gone in about 2 months; lower-field loss with a denser patch toward the nose; presenting sharpness of vision; the steroid study and its lack of randomisation; aspirin; advice on evening blood-pressure doses.' },
  { id: 'atk', read: 'full',
    title: 'Atkins EJ, Bruce BB, Newman NJ, Biousse V. Treatment of nonarteritic anterior ischemic optic neuropathy. Survey of Ophthalmology 2010;55(1):47–63',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3721361',
    took: 'An arterial circle from the short posterior ciliary arteries with distinct upper and lower halves, consistent with half-field loss; choroidal supply of the laminar and prelaminar layers; post-mortem series (193 eyes) with no blocked or inflamed vessels and infarcts mainly behind the lamina; small-vessel insufficiency as the accepted cause; conflicting night-pressure studies; stalled transport, swelling in a restricted space, compressed capillaries, “compartment syndrome”; risk factors (60% with at least one; hypertension 47%, diabetes 24%); sharpness of vision at presentation; swelling lasting a median 7.9 weeks, pallor by 4–6 weeks; the decompression trial (32.6% vs 42.7% improved; 23.9% vs 12.4% worsened); steroids, aspirin; fellow eye about 15% in five years, recurrence under 5%; fluid under the fovea as a source of reversible loss; the venous and vitreous-traction hypotheses.' },
  { id: 'berry', read: 'full',
    title: 'Berry S, Lin WV, Sadaka A, Lee AG. Nonarteritic anterior ischemic optic neuropathy: cause, effect, and management. Eye and Brain 2017;9:23–28',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5628702',
    took: 'Short posterior ciliary arteries supply the front of the nerve head; capillaries more easily compressed in the fixed space in front of the rigid lamina; pathogenesis unproven and probably multifactorial; atrophy within 6–11 weeks; visual-field loss less likely to improve than sharpness; no high-grade evidence for any treatment.' },
  { id: 'wang', read: 'full',
    title: 'Wang B, Nevins JE, Nadler Z, et al. In vivo lamina cribrosa micro-architecture in healthy and glaucomatous eyes as assessed by optical coherence tomography. Invest Ophthalmol Vis Sci 2013;54(13):8270–8274',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3869422',
    took: 'The lamina cribrosa as a meshwork of collagen through which all retinal axons pass; in healthy human eyes, mean pore diameter 24.6 µm and beam thickness 46.7 µm (the model is drawn to these).' },
  { id: 'yang', read: 'full',
    title: 'Yang H, Reynaud J, Lockwood H, et al. The connective tissue phenotype of glaucomatous cupping in the monkey eye. Progress in Retinal and Eye Research 2017;59:1–52',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5603293',
    took: 'Monkey eyes: each laminar beam contains a capillary; capillaries in the septa in front of and behind the lamina; the lamina as a site of axonal-transport blockade; high energy demand of axon mitochondria; myelin beginning at the back of the lamina.' },
  { id: 'ken', read: 'full',
    title: 'Kenhub anatomy library: The optic nerve',
    url: 'https://www.kenhub.com/en/library/anatomy/the-optic-nerve',
    took: 'Nerve length 35–55 mm and its four segments; fibres bare in front of the lamina and myelinated behind it, by oligodendrocytes; no regeneration after severe damage; the three meningeal sheaths and the fluid space; ophthalmic artery from the internal carotid, giving the central retinal and posterior ciliary arteries; the circle of Zinn–Haller being inconsistent; nerve twice as wide behind the eye.' },
  { id: 'wpn', read: 'full',
    title: 'Wikipedia: Optic nerve',
    url: 'https://en.wikipedia.org/wiki/Optic_nerve',
    took: 'Fibre count (770,000–1.7 million); segment lengths; width 1.6 mm in the eye and 3.5 mm in the orbit; a myelinated tract of the central nervous system; about 53% of fibres cross at the chiasm; relay in the lateral geniculate nucleus and on to the visual cortex.' },
  { id: 'wpd', read: 'full',
    title: 'Wikipedia: Optic disc',
    url: 'https://en.wikipedia.org/wiki/Optic_disc',
    took: 'Disc dimensions (1.76 mm × 1.92 mm); 1–1.2 million fibres; the disc lies 3–4 mm to the nasal side of the fovea; it corresponds to the blind spot.' },
  { id: 'wpb', read: 'full',
    title: 'Wikipedia: Blind spot (vision)',
    url: 'https://en.wikipedia.org/wiki/Blind_spot_(vision)',
    took: 'No photoreceptors on the disc; the blind spot lies about 12–15° to the temple side and 1.5° below the horizontal, roughly 7.5° high and 5.5° wide (used for the field plot).' },
  { id: 'wpc', read: 'full',
    title: 'Wikipedia: Optic chiasm',
    url: 'https://en.wikipedia.org/wiki/Optic_chiasm',
    took: 'Fibres from the nasal retina cross; the retinal image is inverted.' },
  { id: 'aaion', read: 'summary',
    title: 'EyeWiki (American Academy of Ophthalmology): Arteritic Anterior Ischemic Optic Neuropathy (AAION)',
    url: 'https://eyewiki.org/Arteritic_Anterior_Ischemic_Optic_Neuropathy_(AAION)',
    took: 'The arteritic form is caused by giant cell arteritis and is treated urgently with steroids to protect the other eye.' },
  { id: 'hay90', read: 'summary',
    title: 'Hayreh SS. Anterior ischaemic optic neuropathy: differentiation of arteritic from non-arteritic type and its management. Eye 1990;4:25–41',
    url: 'https://www.nature.com/articles/eye19904',
    took: 'Telling the two forms apart: symptoms of giant cell arteritis, blood tests, artery biopsy.' },
  { id: 'std', read: 'none',
    title: 'General anatomy and physiology',
    url: '',
    took: 'Statements marked with this number are standard textbook material that was not checked against a specific source for this project: the layers of the eye wall, axon and red-cell sizes, axonal transport and its need for energy, and the mapping of the upper retina to the lower visual field.' },
]

export const CAVEATS = [
  'Time is compressed. The fall in blood flow takes hours, the swelling days, the wasting of fibres weeks to months.',
  'The model always damages the upper half of the nerve head, because loss in the lower visual field is the most common pattern. A real eye may lose a different part, or all of it.',
  'The mechanism shown — under-perfusion, stalled transport, swelling, squeezed capillaries — is the leading account. It is unproven. Post-mortem studies found infarcts mainly behind the lamina, which the model does not show; venous and vitreous-traction explanations also exist.',
  'Capillary layout, the arterial circle and the laminar pores are drawn from descriptions, not traced from one specimen. Pore and beam sizes follow human measurements; capillaries inside beams are documented in monkeys.',
  'Dimensions not tied to a citation are round textbook values: wall thicknesses, lamina thickness (0.3 mm), axon diameter (about 1 µm), capillary and red-cell size (about 8 µm).',
  'The section shows 11 bundles per half of the nerve; the real nerve has several hundred pores and about a million fibres. At the finest scale two dozen axons stand in for the hundreds in each bundle.',
  'The head is a stylised model. Positions of the chiasm, thalamus and visual cortex are schematic.',
  'Gauge readings and the autoregulation curve are illustrative. The sources give no numerical limits.',
  'This is an explanation, not a diagnosis, and not medical advice.',
]

const index = new Map(SOURCES.map((s, i) => [s.id, i + 1]))
export const sourceNumber = id => index.get(id)

/** `text[[id]]` -> HTML with numbered citation marks */
export function cite(text) {
  return text.replace(/\[\[([\w-]+)\]\]/g, (_, id) => {
    const n = index.get(id)
    if (!n) throw new Error(`unknown source: ${id}`)
    return `<sup><a href="#" data-src="${id}">${n}</a></sup>`
  })
}
