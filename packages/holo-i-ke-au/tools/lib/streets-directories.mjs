// The towns' directories (DATA.md, "Streets, dated"): a street a dated
// directory lists by name stood by the directory's year. The directories give
// the name, not the stretch: today's King Street runs to Kaimukī, the King
// Street of 1869 did not. So a directory dates only those stretches of a
// street that a map of the town drawn within `within` years after it already
// shows (a map's date, pushed back to the directory's), and never a stretch
// first shown later.
//
// Each directory lists today's names (the county layer's, with or without
// its N or S) for the street names it prints, read off its own pages; a name
// it prints that today's layer lacks, or has under another name no source
// read here resolves, is kept in `lost`, as a candidate for a street closed
// or renamed (a `to` year, or a rename, for whoever reads the cross-lists of
// Thrum's Annual or the later directories).
export const DIRECTORIES = [
  {
    source: 'bennett-1869-honolulu-directory',
    town: 'honolulu',
    year: 1869,
    within: 20,
    // the names printed as addresses at least twice in the OCR text of the
    // Internet Archive's copy (bub_gb_2R1AAAAAYAAJ), and today's for each
    streets: {
      'Nuuanu Street': ['NUUANU AVE'],
      'King Street': ['KING ST'],
      'Fort Street': ['FORT ST', 'FORT ST MALL'],
      'Beretania Street': ['BERETANIA ST'],
      'Hotel Street': ['HOTEL ST'],
      'Queen Street': ['QUEEN ST'],
      'Merchant Street': ['MERCHANT ST'],
      'School Street': ['SCHOOL ST'],
      'Liliha Street': ['LILIHA ST'],
      'Alakea Street': ['ALAKEA ST'],
      'Punchbowl Street': ['PUNCHBOWL ST'],
      'Richard Street': ['RICHARDS ST'],
      'Maunakea Street': ['MAUNAKEA ST'],
      'Smith Street': ['SMITH ST'],
      'Adams Lane': ['ADAMS LN'],
      'Kukui Street': ['KUKUI ST'],
      'Judd Street': ['JUDD ST'],
      'Chaplin Street': ['CHAPLAIN LN'],
    },
    lost: ['Emma Street', 'Kaahumanu Street', 'Union Street', 'Garden Lane', 'Port Street'],
  },
]

const bare = (n) => n.replace(/^[NSEW] /, '').trim()

/** The directory that dates a run of street `name` first shown in `year`, if any: the earliest that lists it within its reach. */
export function directoryFor(town, name, year) {
  let best = null
  for (const d of DIRECTORIES) {
    if (d.town !== town.id || year < d.year || year > d.year + d.within) continue
    if (!Object.values(d.streets).some((list) => list.includes(bare(name)))) continue
    if (!best || d.year < best.year) best = d
  }
  return best
}
