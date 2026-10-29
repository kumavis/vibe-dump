// Doc systems are ES-module strings exporting one object (design §7.1). They are
// lowered by one anchored regex (export default -> return) into a script whose
// completion value is that object, then evaluated in a Compartment. No imports:
// a system gets `world` and `log` and nothing else.
const EXPORT_DEFAULT = /^([ \t]*)export\s+default\s+/m
const EXPORT_DEFAULT_ALL = /^[ \t]*export\s+default\b/gm
const OTHER_EXPORT = /^[ \t]*export\s+(?!default\b)/m
const IMPORT = /^[ \t]*import\s*(?:[\w*{'"]|\()/m

function body (source) {
  const src = String(source ?? '')
  if (IMPORT.test(src)) throw new SyntaxError('doc systems cannot import: they get `world` and `log` only')
  if (OTHER_EXPORT.test(src)) throw new SyntaxError('only `export default { … }` is supported')
  const n = (src.match(EXPORT_DEFAULT_ALL) ?? []).length
  if (n === 0) throw new SyntaxError('system source must contain `export default { update(world, dt) { … } }`')
  if (n > 1) throw new SyntaxError('more than one `export default`')
  return src.replace(EXPORT_DEFAULT, '$1return ')
}

// -> an expression-statement script evaluating to the exported object
export function lowerModule (source, { name } = {}) {
  const tag = name ? `\n//# sourceURL=mm-system:${String(name).replace(/[^\w.-]/g, '_')}` : ''
  return `(function () {\n'use strict';\n${body(source)}\n})()${tag}`
}

// -> the same function, not invoked: evaluating it parses the body without running it
export function lowerForCheck (source) {
  return `(function () {\n'use strict';\n${body(source)}\n})`
}

// -> a FunctionBody ('use strict' + the lowered body) for the Function
// constructor: it parses as a body on its own, so a source cannot close a
// wrapper early and run statements while it is only being checked
export function lowerBody (source) {
  return `'use strict';\n${body(source)}\n`
}

// FNV-1a: a cheap identity for "has this source changed"
export function sourceHash (s) {
  let h = 2166136261
  const str = String(s ?? '')
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  return (h >>> 0).toString(36)
}
