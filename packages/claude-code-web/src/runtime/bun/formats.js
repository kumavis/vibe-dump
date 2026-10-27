// Bun.YAML, Bun.TOML, Bun.JSONL and Bun.semver.
//
// YAML and semver sit on the vendored `yaml` and `semver` packages (YAML
// backs skill / command / agent frontmatter, where a toy parser loses
// list-valued fields; the FreeBSD port made the same switch for that reason).
import { parseTOML } from './toml.js'
import { parse as parseJSONL, parseChunk } from './jsonl.js'

export function makeYAML(vendor) {
  const lib = () => {
    if (!vendor?.YAML?.parseAllDocuments) throw new Error('Bun.YAML: vendor.YAML is missing')
    return vendor.YAML
  }
  return {
    // A stream of several documents parses to an array of them, a single
    // document to its value, an empty one to null. Errors throw (YAMLParseError
    // is a SyntaxError-like Error with line/column in its message).
    parse(input) {
      const docs = lib().parseAllDocuments(String(input), { prettyErrors: true })
      if (!docs.length) return null
      for (const d of docs) if (d.errors?.length) throw d.errors[0]
      return docs.length === 1 ? docs[0].toJS() : docs.map((d) => d.toJS())
    },
    // stringify(value, replacer?, space?): JSON.stringify's signature. With an
    // indent it is block style; without one, flow style on one line. No
    // trailing newline: the bundle writes `stringify(x, null, 2) + "\n"` before
    // a closing `---`. Long strings are not folded.
    stringify(value, replacer, space) {
      const indent = typeof space === 'number' ? Math.min(10, Math.max(0, Math.floor(space))) : typeof space === 'string' ? space.length : 0
      const options = indent > 0 ? { indent, lineWidth: 0 } : { collectionStyle: 'flow', lineWidth: 0 }
      const out = lib().stringify(value, replacer ?? undefined, options)
      return typeof out === 'string' ? out.replace(/\n$/, '') : out
    },
  }
}

export function makeSemver(vendor) {
  const lib = () => {
    if (!vendor?.semver?.compare) throw new Error('Bun.semver: vendor.semver is missing')
    return vendor.semver
  }
  return {
    // -1 / 0 / 1; throws on an invalid version (the bundle wraps it in try).
    order: (a, b) => lib().compare(String(a), String(b)),
    // npm semantics: a prerelease only satisfies a range naming a prerelease
    // of the same major.minor.patch.
    satisfies: (version, range) => lib().satisfies(String(version), String(range)),
  }
}

export const makeTOML = () => ({ parse: parseTOML })

export const makeJSONL = () => ({ parse: parseJSONL, parseChunk })
