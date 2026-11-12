// Every factual sentence in the app carries [[id]] markers that resolve to
// entries here, so the text can always be traced back to where it came from.
// `took` records what we actually relied on each source for.

export const SOURCES = [
  {
    id: 'eyewiki-naion',
    title: 'EyeWiki (American Academy of Ophthalmology): Non-Arteritic Anterior Ischemic Optic Neuropathy (NAION)',
    url: 'https://eyewiki.org/Non-Arteritic_Anterior_Ischemic_Optic_Neuropathy_(NAION)',
    took: 'Blood supply of the nerve head; the small-cup “disc at risk” and how common it is; painless loss noticed on waking; the compartment-syndrome idea and that it is unproven; lower-half field loss being most common; swelling followed by pallor; stabilisation, recovery range, fellow-eye and recurrence figures; no effective treatment; when giant cell arteritis is tested for. Read in full November 2026.',
  },
  {
    id: 'eyerounds-aion',
    title: 'EyeRounds, University of Iowa (S. S. Hayreh): Ischemic Optic Neuropathies, part 2',
    url: 'https://eyerounds.org/article/AION/AION-part2.htm',
    took: 'The night-time blood-pressure-dip theory of NAION and the view that it matters more than the small cup.',
  },
  {
    id: 'pathology-ion',
    title: 'Pathology of Ischemic Optic Neuropathy. Archives of Pathology & Laboratory Medicine 2017;141(1):162',
    url: 'https://meridian.allenpress.com/aplm/article/141/1/162/66019/Pathology-of-Ischemic-Optic-Neuropathy',
    took: 'Tissue evidence that the short posterior ciliary arteries are the vessels that matter in anterior ischemic optic neuropathy.',
  },
  {
    id: 'eyewiki-aaion',
    title: 'EyeWiki (American Academy of Ophthalmology): Arteritic Anterior Ischemic Optic Neuropathy (AAION)',
    url: 'https://eyewiki.org/Arteritic_Anterior_Ischemic_Optic_Neuropathy_(AAION)',
    took: 'The rarer arteritic kind is caused by giant cell arteritis and is treated urgently with steroids to protect the other eye.',
  },
  {
    id: 'hayreh-1990',
    title: 'Hayreh SS. Anterior ischaemic optic neuropathy: differentiation of arteritic from non-arteritic type and its management. Eye 1990;4:25–41',
    url: 'https://www.nature.com/articles/eye19904',
    took: 'How the two kinds are told apart: symptoms of giant cell arteritis, blood tests, and artery biopsy.',
  },
]

export const STAGES = [
  {
    key: 'healthy',
    title: 'A healthy nerve head',
    text: 'Every nerve fibre in the retina leaves the eye through one small opening, the optic disc. This first stretch of the optic nerve gets its blood from tiny branches of the short posterior ciliary arteries — not from the main artery of the retina.[[eyewiki-naion]][[pathology-ion]]',
  },
  {
    key: 'crowded',
    title: 'A crowded disc',
    text: 'Almost everyone who gets NAION has a small disc with little or no central dip (the “cup”), so the fibres are packed in tightly. Doctors call this a “disc at risk”. It is simply how the eye is built — and exactly how much it matters is still unclear.[[eyewiki-naion]]',
  },
  {
    key: 'dip',
    title: 'Blood flow dips',
    text: 'Something lowers the blood flow to the nerve head. A long-standing theory blames the natural fall in blood pressure during sleep: more than two thirds of people first notice the problem on waking. A large trial did not confirm it.[[eyerounds-aion]][[eyewiki-naion]]',
  },
  {
    key: 'squeeze',
    title: 'Swelling in a tight space',
    text: 'Fibres that are short of blood swell. In a crowded disc there is nowhere for the swelling to go, so it presses on the small vessels and cuts the flow further — a vicious circle, like a compartment syndrome. This is the leading explanation, but it has not been proven.[[eyewiki-naion]]',
  },
  {
    key: 'loss',
    title: 'Part of the picture goes missing',
    text: 'The starved fibres stop carrying signals. The loss is usually painless and often takes the top or bottom half of what that eye sees — most often the bottom half, which is carried by fibres in the upper part of the disc. It can get worse over the first two weeks.[[eyewiki-naion]]',
  },
  {
    key: 'after',
    title: 'The weeks after',
    text: 'The swelling settles and the damaged part of the disc turns pale. Vision usually stops changing within about two months; in studies, 13–43% of people regained three lines on the eye chart. No treatment has been shown to work. The other eye is affected in roughly 15–24% of people over five years.[[eyewiki-naion]]',
  },
]

export const SAFETY =
  'Sudden vision loss always needs to be seen urgently. A rarer kind of AION is caused by giant cell arteritis — inflamed arteries, usually with headache, scalp tenderness or jaw pain on chewing — and is treated straight away to protect the other eye.[[eyewiki-aaion]][[hayreh-1990]]'

export const CAVEATS = [
  'The timeline is compressed: the first three steps are years or hours, the last is weeks.',
  'The model always damages the upper part of the disc because that is the most common pattern; a real eye may lose a different part.',
  'The “roomy disc” in the doorway view is an illustration of the compartment idea, not a measured result.',
  'The whole-head view is a stylised head; the route of the nerves to the back of the brain is standard anatomy rather than a cited claim, and the dimmed signals are an illustration.',
  'Shapes, sizes and colours are schematic. The link between upper-disc fibres and the lower half of vision is standard anatomy rather than a cited claim.',
]

const index = new Map(SOURCES.map((s, i) => [s.id, i + 1]))

/** Turn `text[[id]]` into HTML with numbered, clickable citation marks. */
export function cite(text) {
  return text.replace(/\[\[([\w-]+)\]\]/g, (_, id) => {
    const n = index.get(id)
    if (!n) throw new Error(`unknown source: ${id}`)
    return `<sup><a href="#" data-src="${id}">${n}</a></sup>`
  })
}
