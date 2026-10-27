// Bun.stringWidth / stripANSI / wrapAnsi / sliceAnsi.
//
// Bun ships stringWidth and stripANSI as drop-in replacements for the npm
// string-width and strip-ansi, and wrapAnsi / sliceAnsi take wrap-ansi's and
// slice-ansi's arguments, so these delegate to the vendored packages rather
// than approximating them. The
// FreeBSD port arrived at the same choice after its own approximations broke
// SGR re-opening across wrapped lines.
//
// Known difference: wrap-ansi 9 NFC-normalizes its input, so for text holding
// decomposed sequences (e + U+0301) the output's string offsets differ from
// the input's. The bundle re-applies styling at offsets it computed on the
// input, which would then land a little off. Rare; left as is.

const str = (s) => (typeof s === 'string' ? s : String(s))

export function makeText(vendor) {
  const lib = (name) => {
    const f = vendor?.[name]
    if (typeof f !== 'function') throw new Error(`Bun polyfill: vendor.${name} is missing`)
    return f
  }
  const width = lib('stringWidth')
  const strip = lib('stripAnsi')
  const wrap = lib('wrapAnsi')
  const slice = lib('sliceAnsi')

  return {
    // Bun.stringWidth(s, { ambiguousIsNarrow = true, countAnsiEscapeCodes = false })
    stringWidth(s, options) {
      return s == null ? 0 : width(str(s), options)
    },

    stripANSI(s) {
      return s == null ? '' : strip(str(s))
    },

    // Bun.wrapAnsi(s, columns, { hard, wordWrap, trim, ambiguousIsNarrow })
    //
    // Tabs are carried through as \x01 (another zero-width control): some
    // wrap-ansi releases expand tabs to spaces, which shifts every offset the
    // caller re-applies styling at (the FreeBSD port hit this with 10.x; 9.x
    // leaves tabs alone, so this is insurance against a vendor upgrade).
    wrapAnsi(s, columns, options) {
      if (!s) return s
      const text = str(s)
      if (!text.includes('\t') || text.includes('\x01')) return wrap(text, columns, options)
      return wrap(text.replaceAll('\t', '\x01'), columns, options).replaceAll('\x01', '\t')
    },

    // Bun.sliceAnsi(s, startColumn, endColumn?): slice by visible columns,
    // keeping the escape codes that style the kept part.
    sliceAnsi(s, start, end) {
      return s == null ? '' : slice(str(s), start, end)
    },
  }
}
