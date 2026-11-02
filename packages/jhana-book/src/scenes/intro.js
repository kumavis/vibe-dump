// intro — Breath. Placeholder: replace `build` with the real pop-up (see DESIGN.md).
import { placeholderBuild } from './_placeholder.js'

export default {
  id: 'intro',
  label: '',
  title: 'Breath',
  pali: 'ānāpānasati',
  line: 'Sit. Let the breath find you.',
  palette: { bg: '#15120f', paper: '#ebe2d1', ink: '#3d352d', accent: '#f0c98a' },
  audio: { root: 98, intervals: [0, 7, 12], brightness: 0.35, shimmer: 0.2, breathe: 0.7 },
  build: placeholderBuild,
}
