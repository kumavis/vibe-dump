// A ripgrep subset over the virtual filesystem, registered as the `rg`
// command in child_process. Claude Code finds `rg` by name (USE_BUILTIN_RIPGREP
// is off) and uses it for skills discovery (`--files --glob *.md`), the Glob
// tool (`--files --null --glob P --sort=modified`) and the Grep tool (content
// search with -l / -c / --json). Synchronous: it works for spawnSync too.
//
// Not supported: .gitignore/.ignore files (everything behaves like
// --no-ignore), encodings other than UTF-8, --replace, --pcre2.
import { compileRgGlob } from './glob.js';

const VERSION = 'ripgrep 14.1.1 (claude-code-web VFS shim)\n\nfeatures:-simd-accel,-pcre2\n';

const TYPES = {
  c: ['*.c', '*.h'], cpp: ['*.cpp', '*.cc', '*.cxx', '*.hpp', '*.hh', '*.hxx', '*.h'],
  cs: ['*.cs'], css: ['*.css', '*.scss', '*.sass', '*.less'], go: ['*.go'], html: ['*.html', '*.htm'],
  java: ['*.java'], js: ['*.js', '*.mjs', '*.cjs', '*.jsx'], json: ['*.json', '*.jsonl', '*.json5'],
  kotlin: ['*.kt', '*.kts'], lua: ['*.lua'], markdown: ['*.md', '*.markdown', '*.mdx'],
  md: ['*.md', '*.markdown', '*.mdx'], php: ['*.php'], py: ['*.py', '*.pyi'], python: ['*.py', '*.pyi'],
  rb: ['*.rb'], ruby: ['*.rb'], rust: ['*.rs'], sh: ['*.sh', '*.bash', '*.zsh'], sql: ['*.sql'],
  svelte: ['*.svelte'], swift: ['*.swift'], toml: ['*.toml'], ts: ['*.ts', '*.tsx', '*.mts', '*.cts'],
  typescript: ['*.ts', '*.tsx', '*.mts', '*.cts'], txt: ['*.txt'], vue: ['*.vue'], xml: ['*.xml'],
  yaml: ['*.yml', '*.yaml'],
};

const VALUE_FLAGS = new Set([
  '-g', '--glob', '--iglob', '-d', '--max-depth', '--maxdepth', '-e', '--regexp', '-A', '--after-context',
  '-B', '--before-context', '-C', '--context', '-M', '--max-columns', '-m', '--max-count', '-t', '--type',
  '-T', '--type-not', '--sort', '--sortr', '--max-filesize', '-j', '--threads', '--color', '--colors',
  '--path-separator', '--type-add', '--ignore-file', '-E', '--encoding', '--context-separator',
  '--field-match-separator', '--field-context-separator', '-r', '--replace', '-f', '--file', '--pre',
  '--pre-glob', '--engine', '--dfa-size-limit', '--regex-size-limit', '--max-columns-preview',
]);

function parseArgs(args) {
  const o = {
    files: false, hidden: false, follow: false, nul: false, mode: 'lines', json: false,
    lineNumber: false, withFilename: null, ignoreCase: false, smartCase: false, fixed: false,
    multiline: false, dotall: false, onlyMatching: false, invert: false, word: false, line: false,
    quiet: false, maxDepth: Infinity, globs: [], types: [], typesNot: [], patterns: [], paths: [],
    after: 0, before: 0, maxColumns: 0, maxCount: Infinity, sort: null, sortReverse: false, version: false,
  };
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    let a = String(args[i]);
    let val;
    if (a === '--') { positional.push(...args.slice(i + 1).map(String)); break; }
    if (a.startsWith('--') && a.includes('=')) { val = a.slice(a.indexOf('=') + 1); a = a.slice(0, a.indexOf('=')); }
    else if (/^-[A-Za-z]\d+$/.test(a) && VALUE_FLAGS.has(a.slice(0, 2))) { val = a.slice(2); a = a.slice(0, 2); }
    if (VALUE_FLAGS.has(a) && val === undefined) val = String(args[++i] ?? '');
    switch (a) {
      case '--files': o.files = true; break;
      case '--hidden': case '-.': o.hidden = true; break;
      case '-u': case '--unrestricted': break; // = --no-ignore, which is always the case here
      case '-uu': case '-uuu': o.hidden = true; break;
      case '-L': case '--follow': o.follow = true; break;
      case '-0': case '--null': o.nul = true; break;
      case '-l': case '--files-with-matches': o.mode = 'files'; break;
      case '--files-without-match': o.mode = 'files-without'; break;
      case '-c': case '--count': o.mode = 'count'; break;
      case '--count-matches': o.mode = 'count-matches'; break;
      case '--json': o.json = true; break;
      case '-n': case '--line-number': o.lineNumber = true; break;
      case '-N': case '--no-line-number': o.lineNumber = false; break;
      case '-H': case '--with-filename': o.withFilename = true; break;
      case '-I': case '--no-filename': o.withFilename = false; break;
      case '-i': case '--ignore-case': o.ignoreCase = true; o.smartCase = false; break;
      case '-S': case '--smart-case': o.smartCase = true; break;
      case '-s': case '--case-sensitive': o.ignoreCase = false; o.smartCase = false; break;
      case '-F': case '--fixed-strings': o.fixed = true; break;
      case '-U': case '--multiline': o.multiline = true; break;
      case '--multiline-dotall': o.dotall = true; break;
      case '-o': case '--only-matching': o.onlyMatching = true; break;
      case '-v': case '--invert-match': o.invert = true; break;
      case '-w': case '--word-regexp': o.word = true; break;
      case '-x': case '--line-regexp': o.line = true; break;
      case '-q': case '--quiet': o.quiet = true; break;
      case '-V': case '--version': o.version = true; break;
      case '-g': case '--glob': o.globs.push({ glob: val, ci: false }); break;
      case '--iglob': o.globs.push({ glob: val, ci: true }); break;
      case '-d': case '--max-depth': case '--maxdepth': o.maxDepth = Number(val); break;
      case '-e': case '--regexp': o.patterns.push(val); break;
      case '-A': case '--after-context': o.after = Number(val); break;
      case '-B': case '--before-context': o.before = Number(val); break;
      case '-C': case '--context': o.after = o.before = Number(val); break;
      case '-M': case '--max-columns': o.maxColumns = Number(val); break;
      case '-m': case '--max-count': o.maxCount = Number(val); break;
      case '-t': case '--type': o.types.push(val); break;
      case '-T': case '--type-not': o.typesNot.push(val); break;
      case '--sort': o.sort = val; o.sortReverse = false; break;
      case '--sortr': o.sort = val; o.sortReverse = true; break;
      case '--sort-files': o.sort = 'path'; break;
      default:
        if (VALUE_FLAGS.has(a) || a.startsWith('-') && a.length > 1) break; // accepted and ignored
        positional.push(a);
    }
  }
  if (!o.files && !o.version && o.patterns.length === 0) {
    if (positional.length) o.patterns.push(positional.shift());
  }
  o.paths = positional;
  return o;
}

// rg prints paths under the search path as given ('.' -> './x'); with no
// path argument it prints them bare ('x').
function joinPath(a, b) {
  return a.endsWith('/') ? a + b : `${a}/${b}`;
}

function absolute(cwd, p) {
  const parts = [];
  for (const seg of (p.startsWith('/') ? p : `${cwd}/${p}`).split('/')) {
    if (!seg || seg === '.') continue;
    if (seg === '..') parts.pop(); else parts.push(seg);
  }
  return `/${parts.join('/')}`;
}

// Yields { display, abs, rel, mtimeMs } for every file under each search path.
function* walkFiles(fs, cwd, o, matcher) {
  const targets = o.paths.length ? o.paths : [null];
  for (const target of targets) {
    const abs = absolute(cwd, target ?? '.');
    let st;
    try { st = fs.statSync(abs); } catch {
      throw Object.assign(new Error(`${target}: No such file or directory (os error 2)`), { rgSoft: true });
    }
    if (!st.isDirectory()) { yield { display: target, abs, rel: target.split('/').pop(), mtimeMs: st.mtimeMs }; continue; }
    const stack = [{ dir: abs, rel: '', depth: 1 }];
    const out = [];
    while (stack.length) {
      const { dir, rel, depth } = stack.pop();
      let names;
      try { names = fs.readdirSync(dir); } catch { continue; }
      for (const name of names) {
        if (!o.hidden && name.startsWith('.')) continue;
        const childAbs = dir === '/' ? `/${name}` : `${dir}/${name}`;
        const childRel = rel ? `${rel}/${name}` : name;
        let s;
        try { s = fs.lstatSync(childAbs); } catch { continue; }
        if (s.isSymbolicLink()) {
          if (!o.follow) continue;
          try { s = fs.statSync(childAbs); } catch { continue; }
        }
        if (s.isDirectory()) {
          if (matcher.excludeDir(childRel)) continue;
          if (depth < o.maxDepth) stack.push({ dir: childAbs, rel: childRel, depth: depth + 1 });
        } else if (s.isFile()) {
          if (!matcher.includeFile(childRel)) continue;
          out.push({ display: target === null ? childRel : joinPath(target, childRel), abs: childAbs, rel: childRel, mtimeMs: s.mtimeMs });
        }
      }
    }
    out.sort((a, b) => (a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0));
    yield* out;
  }
}

function makeMatcher(o) {
  const globs = o.globs.map(({ glob, ci }) => compileRgGlob(glob, { caseInsensitive: ci }));
  const typeGlobs = (names) => names.flatMap((t) => TYPES[t] || []).map((g) => compileRgGlob(g));
  const types = typeGlobs(o.types);
  const typesNot = typeGlobs(o.typesNot);
  const hasPositive = globs.some((g) => !g.negated);
  return {
    excludeDir(rel) {
      for (let i = globs.length - 1; i >= 0; i--) {
        if (globs[i].test(rel, true)) return globs[i].negated;
      }
      return false;
    },
    includeFile(rel) {
      let verdict = null;
      for (let i = globs.length - 1; i >= 0 && verdict === null; i--) {
        if (globs[i].test(rel, false)) verdict = !globs[i].negated;
      }
      if (verdict === false) return false;
      if (verdict === null && hasPositive) return false;
      if (types.length && !types.some((g) => g.test(rel, false))) return false;
      if (typesNot.some((g) => g.test(rel, false))) return false;
      return true;
    },
  };
}

// Rust-regex syntax that JS spells differently.
function translateRegex(src) {
  let flags = '';
  let s = src.replace(/^\(\?([imsx]+)\)/, (_, f) => { flags += f.replace(/x/g, ''); return ''; });
  s = s.replace(/\(\?P</g, '(?<').replace(/\\A/g, '^').replace(/\\z/g, '$')
    .replace(/\[\[:(alpha|digit|alnum|space|upper|lower|punct|xdigit|word):\]\]/g, (_, c) => ({
      alpha: '[A-Za-z]', digit: '[0-9]', alnum: '[A-Za-z0-9]', space: '\\s', upper: '[A-Z]',
      lower: '[a-z]', punct: '[!-/:-@[-`{-~]', xdigit: '[0-9A-Fa-f]', word: '\\w',
    })[c]);
  return { source: s, flags };
}

function buildRegex(o) {
  const escape = (p) => p.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
  let parts = o.patterns.map((p) => (o.fixed ? { source: escape(p), flags: '' } : translateRegex(p)));
  let extra = parts.map((p) => p.flags).join('');
  let source = parts.map((p) => `(?:${p.source})`).join('|');
  if (o.word) source = `(?<![\\w])(?:${source})(?![\\w])`;
  if (o.line) source = `^(?:${source})$`;
  const insensitive = o.ignoreCase || extra.includes('i') || (o.smartCase && !/[A-Z]/.test(o.patterns.join('')));
  let flags = 'g' + (insensitive ? 'i' : '') + (o.multiline || extra.includes('m') || o.line ? 'm' : '') + (o.dotall || extra.includes('s') ? 's' : '');
  try { return new RegExp(source, flags + 'u'); } catch { /* fall back to non-unicode syntax */ }
  return new RegExp(source, flags);
}

function lineStarts(text) {
  const starts = [0];
  for (let i = text.indexOf('\n'); i !== -1; i = text.indexOf('\n', i + 1)) starts.push(i + 1);
  return starts;
}

function lineIndexAt(starts, offset) {
  let lo = 0, hi = starts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (starts[mid] <= offset) lo = mid; else hi = mid - 1;
  }
  return lo;
}

const enc = new TextEncoder();
const byteLen = (s) => enc.encode(s).length;

// Find matching "records": { first, last (line indexes), submatches: [{text, start, end}] }
function searchText(text, re, o) {
  const starts = lineStarts(text);
  const lineText = (i) => text.slice(starts[i], i + 1 < starts.length ? starts[i + 1] : text.length);
  const records = [];
  if (o.multiline && !o.invert) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text)) && records.length < o.maxCount) {
      if (m[0] === '') { re.lastIndex++; continue; }
      const first = lineIndexAt(starts, m.index);
      const last = lineIndexAt(starts, m.index + m[0].length - 1);
      const prev = records[records.length - 1];
      const base = starts[first];
      const sub = { text: m[0], start: byteLen(text.slice(base, m.index)), end: byteLen(text.slice(base, m.index + m[0].length)) };
      if (prev && first <= prev.last) { prev.last = Math.max(prev.last, last); prev.submatches.push({ ...sub, start: byteLen(text.slice(starts[prev.first], m.index)), end: byteLen(text.slice(starts[prev.first], m.index + m[0].length)) }); }
      else records.push({ first, last, submatches: [sub] });
    }
    return { records, starts, lineText };
  }
  const n = text.endsWith('\n') ? starts.length - 1 : starts.length;
  for (let i = 0; i < n && records.length < o.maxCount; i++) {
    const raw = lineText(i);
    const line = raw.replace(/\r?\n$/, '');
    re.lastIndex = 0;
    const subs = [];
    let m;
    while ((m = re.exec(line))) {
      if (m[0] === '' && re.lastIndex === m.index) re.lastIndex++;
      subs.push({ text: m[0], start: byteLen(line.slice(0, m.index)), end: byteLen(line.slice(0, m.index + m[0].length)) });
    }
    const hit = subs.length > 0;
    if (hit !== o.invert) records.push({ first: i, last: i, submatches: o.invert ? [] : subs });
  }
  return { records, starts, lineText };
}

function isBinary(buf) {
  const n = Math.min(buf.length, 8192);
  for (let i = 0; i < n; i++) if (buf[i] === 0) return true;
  return false;
}

export function rg(ctx) {
  const { fs } = ctx;
  const cwd = ctx.cwd || '/';
  let o;
  try { o = parseArgs(ctx.args); } catch (err) { return { status: 2, stdout: '', stderr: `rg: ${err.message}\n` }; }
  if (o.version) return { status: 0, stdout: VERSION, stderr: '' };

  const matcher = makeMatcher(o);
  const sep = o.nul ? '\0' : '\n';
  const out = [];
  let stderr = '';
  let found = false;

  const files = [];
  // Like rg with a non-tty stdin and no path: search what was piped in.
  const stdinBytes = ctx.input && ctx.input.length && !o.files && o.paths.length === 0 ? ctx.input : null;
  if (stdinBytes) files.push({ display: '<stdin>', bytes: stdinBytes, mtimeMs: 0 });
  else try {
    for (const f of walkFiles(fs, cwd, o, matcher)) files.push(f);
  } catch (err) {
    if (!err.rgSoft) throw err;
    stderr += `rg: ${err.message}\n`;
  }
  if (o.sort === 'modified' || o.sort === 'accessed' || o.sort === 'created') files.sort((a, b) => a.mtimeMs - b.mtimeMs);
  else if (o.sort === 'path') files.sort((a, b) => (a.display < b.display ? -1 : 1));
  if (o.sortReverse) files.reverse();

  if (o.files) {
    for (const f of files) out.push(f.display + sep);
    return { status: files.length ? 0 : 1, stdout: o.quiet ? '' : out.join(''), stderr };
  }

  if (o.patterns.length === 0) return { status: 2, stdout: '', stderr: 'rg: no pattern given\n' };
  let re;
  try { re = buildRegex(o); } catch (err) { return { status: 2, stdout: '', stderr: `rg: regex parse error:\n    ${err.message}\n` }; }

  const singleFile = stdinBytes || (files.length === 1 && o.paths.length === 1 && files[0].display === o.paths[0]);
  const withName = o.withFilename ?? !singleFile;
  const nameSep = o.nul ? '\0' : ':';
  const stats = { matched_lines: 0, matches: 0, searches: 0, searches_with_match: 0 };

  for (const f of files) {
    let buf;
    try { buf = f.bytes || fs.readFileSync(f.abs); } catch { continue; }
    stats.searches++;
    if (isBinary(buf)) continue;
    const text = new TextDecoder().decode(buf);
    const { records, starts, lineText } = searchText(text, re, o);
    const matched = records.length > 0;
    if (matched) { found = true; stats.searches_with_match++; }
    stats.matched_lines += records.reduce((n, r) => n + (r.last - r.first + 1), 0);
    stats.matches += records.reduce((n, r) => n + r.submatches.length, 0);
    if (o.quiet) { if (found) break; continue; }

    if (o.mode === 'files') { if (matched) out.push(f.display + sep); continue; }
    if (o.mode === 'files-without') { if (!matched) { found = true; out.push(f.display + sep); } continue; }
    if (o.mode === 'count' || o.mode === 'count-matches') {
      if (!matched) continue;
      const n = o.mode === 'count' ? records.length : records.reduce((k, r) => k + r.submatches.length, 0);
      out.push(withName ? `${f.display}${nameSep}${n}\n` : `${n}\n`);
      continue;
    }

    if (!matched) continue;
    // Context: which lines to print, tagging matches vs context.
    const lastLine = text.endsWith('\n') ? starts.length - 2 : starts.length - 1;
    const show = new Map(); // line index -> record | 'context'
    for (const r of records) {
      for (let i = Math.max(0, r.first - o.before); i < r.first; i++) if (!show.has(i)) show.set(i, 'context');
      show.set(r.first, r);
      for (let i = r.first + 1; i <= r.last; i++) show.set(i, 'cont');
      for (let i = r.last + 1; i <= Math.min(lastLine, r.last + o.after); i++) if (!show.has(i)) show.set(i, 'context');
    }
    const lines = [...show.keys()].sort((a, b) => a - b);

    if (o.json) {
      out.push(JSON.stringify({ type: 'begin', data: { path: { text: f.display } } }) + '\n');
      for (const i of lines) {
        const tagged = show.get(i);
        if (tagged === 'cont') continue;
        if (tagged === 'context') {
          out.push(JSON.stringify({ type: 'context', data: { path: { text: f.display }, lines: { text: lineText(i) }, line_number: i + 1, absolute_offset: byteLen(text.slice(0, starts[i])), submatches: [] } }) + '\n');
        } else {
          const t = text.slice(starts[tagged.first], tagged.last + 1 < starts.length ? starts[tagged.last + 1] : text.length);
          out.push(JSON.stringify({ type: 'match', data: { path: { text: f.display }, lines: { text: t }, line_number: i + 1, absolute_offset: byteLen(text.slice(0, starts[i])), submatches: tagged.submatches.map((s) => ({ match: { text: s.text }, start: s.start, end: s.end })) } }) + '\n');
        }
      }
      out.push(JSON.stringify({ type: 'end', data: { path: { text: f.display }, binary_offset: null, stats: { matched_lines: records.length, matches: records.reduce((n, r) => n + r.submatches.length, 0) } } }) + '\n');
      continue;
    }

    let prev = null;
    for (const i of lines) {
      if (prev !== null && i > prev + 1 && (o.before || o.after)) out.push('--\n');
      prev = i;
      const tagged = show.get(i);
      const isMatch = tagged !== 'context';
      const prefix = (withName ? f.display + (o.nul ? '\0' : isMatch ? ':' : '-') : '') + (o.lineNumber ? `${i + 1}${isMatch ? ':' : '-'}` : '');
      if (o.onlyMatching && typeof tagged === 'object') {
        for (const s of tagged.submatches) out.push(prefix + s.text + '\n');
        continue;
      }
      let body = lineText(i).replace(/\r?\n$/, '');
      if (o.maxColumns > 0 && body.length > o.maxColumns) {
        const k = typeof tagged === 'object' ? tagged.submatches.length : 0;
        body = `[Omitted long line with ${k} matches]`;
      }
      out.push(prefix + body + '\n');
    }
  }

  if (o.json && !o.quiet) {
    out.push(JSON.stringify({ type: 'summary', data: { elapsed_total: { secs: 0, nanos: 0, human: '0s' }, stats: { ...stats, bytes_searched: 0, bytes_printed: 0, elapsed: { secs: 0, nanos: 0, human: '0s' } } } }) + '\n');
  }
  return { status: found ? 0 : 1, stdout: out.join(''), stderr };
}
