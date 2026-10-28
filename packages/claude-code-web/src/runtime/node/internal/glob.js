// Glob -> RegExp, gitignore/ripgrep flavoured: `*` and `?` stop at `/`, `**`
// spans directories (`**/` may match nothing), `[...]`/`[!...]` classes,
// `{a,b}` alternation (nestable), `\` escapes.
export function globToRegExpSource(glob) {
  let re = '';
  let depth = 0; // inside {...}
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '\\' && i + 1 < glob.length) { re += escapeChar(glob[++i]); continue; }
    if (c === '*') {
      if (glob[i + 1] === '*') {
        const atSegStart = i === 0 || glob[i - 1] === '/';
        let j = i + 2;
        if (atSegStart && glob[j] === '/') { re += '(?:.*/)?'; i = j; continue; }
        if (atSegStart && j >= glob.length) { re += '.*'; i = j; continue; }
        re += '[^/]*'; i = j - 1; continue; // `a**b` behaves like `a*b`
      }
      re += '[^/]*';
      continue;
    }
    if (c === '?') { re += '[^/]'; continue; }
    if (c === '[') {
      const end = glob.indexOf(']', i + 2);
      if (end === -1) { re += '\\['; continue; }
      let body = glob.slice(i + 1, end);
      if (body[0] === '!' || body[0] === '^') body = '^' + body.slice(1);
      re += `[${body.replace(/\\/g, '\\\\')}]`;
      i = end;
      continue;
    }
    if (c === '{') { depth++; re += '(?:'; continue; }
    if (c === '}' && depth > 0) { depth--; re += ')'; continue; }
    if (c === ',' && depth > 0) { re += '|'; continue; }
    re += escapeChar(c);
  }
  while (depth-- > 0) re += ')';
  return re;
}

function escapeChar(c) {
  return /[.+^${}()|[\]\\/*?]/.test(c) ? `\\${c}` : c;
}

export function globToRegExp(glob, { caseInsensitive = false } = {}) {
  return new RegExp(`^${globToRegExpSource(glob)}$`, caseInsensitive ? 'i' : '');
}

// A compiled ripgrep-style override glob: `!` negates, a leading `/` anchors to
// the search root, a trailing `/` matches directories only, and a pattern
// without any `/` matches the basename at any depth.
export function compileRgGlob(raw, { caseInsensitive = false } = {}) {
  let g = raw;
  const negated = g.startsWith('!');
  if (negated) g = g.slice(1);
  const dirOnly = g.endsWith('/') && g.length > 1;
  if (dirOnly) g = g.slice(0, -1);
  if (g.startsWith('./')) g = g.slice(2);
  let anchored = false;
  if (g.startsWith('/')) { anchored = true; g = g.slice(1); }
  const basenameOnly = !anchored && !g.includes('/');
  const re = globToRegExp(g, { caseInsensitive });
  return {
    raw,
    negated,
    test(relPath, isDir) {
      if (dirOnly && !isDir) return false;
      if (basenameOnly) return re.test(relPath.slice(relPath.lastIndexOf('/') + 1));
      return re.test(relPath);
    },
  };
}
