// The service worker's one transformation of served JavaScript (public/sw.js):
// Node built-in specifiers in import positions ("fs", "node:fs", "ws", ...)
// become absolute URLs of our shims. Import maps are not available to
// Workers, and the cached tree stays exactly as extracted.
//
// Plain data in, string out, so it is unit-tested under Node
// (test/unit/I-runtime.test.mjs).
import { SPECIFIER_MAP } from '../node/BUILTINS.js'

// `from "x"`, `import "x"` and `import("x")` with a string literal. A prose
// string such as 'imported from "claude-code"' can also match the shape, but
// only names in SPECIFIER_MAP are touched, and replacing one string literal
// with another never changes the syntax.
const SPECIFIER_RE = /\b(from|import)(\s*\(?\s*)"([^"\n]{1,40})"/g

/**
 * @param {string} src        module source
 * @param {string} shimPath   pathname of the shim directory, e.g. '/vibe-dump/claude-code-web/runtime/node/'
 * @param {Record<string, string>} [map]  specifier -> shim file (default: BUILTINS.js SPECIFIER_MAP)
 * @returns {string}
 */
export function rewriteSpecifiers (src, shimPath, map = SPECIFIER_MAP) {
  return src.replace(SPECIFIER_RE, (whole, kw, gap, spec) => {
    const file = Object.prototype.hasOwnProperty.call(map, spec) ? map[spec] : null
    return file ? `${kw}${gap}"${shimPath}${file}"` : whole
  })
}
