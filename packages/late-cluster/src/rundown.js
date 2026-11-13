// The running order: segment ids, played back-to-back. Each id is a folder src/segments/<id>/
// with an index.js (the segment module) and, once its audio is rendered, cues.json. Ids without a
// folder yet show a short "in production" card and are skipped. `demo` (the reference segment)
// stays loadable with ?seg=demo but isn't in the show.
export default ['cold-open', 'monologue', 'weather', 'top-chicken', 'built-or-bit', 'panel', 'song', 'goodnight']
