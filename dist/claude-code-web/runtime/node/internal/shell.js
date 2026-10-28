// A tiny command-line runner for exec()/execSync()/spawn({shell:true}).
//
// There is no shell in this runtime (and none is exposed to the model). This
// only lets the startup probes the bundle runs through exec — e.g.
// `ps aux | grep ...`, `which x || true`, `cmd 2>/dev/null` — reach the command
// table and fail or succeed the way they would under /bin/sh.
//
// Supported: words with '…' / "…" / \ quoting, $VAR and ${VAR}, leading ~,
// VAR=value prefixes, pipelines, && || ; &, redirections to/from files
// (N>file N>>file <file 2>&1 >&2 &>file >|file). Builtins: true false : echo
// exit cd command -v / type.
// Not supported (exit status 2): $(…), `…`, (…), {…}, here-docs, globbing.

const OPS = ['&&', '||', '|', ';', '&'];

export class ShellSyntaxError extends Error {}

function expandVar(name, env) {
  return env[name] ?? '';
}

export function tokenize(line, env = {}) {
  const tokens = [];
  let i = 0;
  const n = line.length;
  const isSpace = (c) => c === ' ' || c === '\t' || c === '\n';
  while (i < n) {
    const c = line[i];
    if (isSpace(c)) { i++; continue; }
    if (c === '#') break;
    // redirections: [N]>, [N]>>, <, >&N, &>, >|
    const redir = /^(\d?)(>>|>\||>&|<&|>|<)/.exec(line.slice(i)) || /^(&)(>>|>)/.exec(line.slice(i));
    if (redir) {
      const fd = redir[1] === '&' ? 'both' : redir[1] ? Number(redir[1]) : (redir[2][0] === '<' ? 0 : 1);
      const op = redir[2];
      i += redir[0].length;
      while (i < n && isSpace(line[i])) i++;
      const { word, next } = readWord(line, i, env);
      if (word === null) throw new ShellSyntaxError('syntax error near unexpected token `newline\'');
      i = next;
      tokens.push({ type: 'redir', fd, op, target: word });
      continue;
    }
    const op = OPS.find((o) => line.startsWith(o, i));
    if (op) { tokens.push({ type: 'op', value: op }); i += op.length; continue; }
    if (c === '(' || c === ')' || c === '`' || c === '{' && (i + 1 >= n || isSpace(line[i + 1]))) {
      throw new ShellSyntaxError(`unsupported shell syntax: ${c}`);
    }
    const { word, next } = readWord(line, i, env);
    tokens.push({ type: 'word', value: word });
    i = next;
  }
  return tokens;
}

function readWord(line, start, env) {
  let i = start;
  let out = '';
  let any = false;
  const n = line.length;
  if (line[i] === '~' && (i + 1 >= n || line[i + 1] === '/' || /\s/.test(line[i + 1]))) { out += env.HOME || '/home/user'; i++; any = true; }
  while (i < n) {
    const c = line[i];
    if (/\s/.test(c) || '|&;<>()'.includes(c)) break;
    any = true;
    if (c === '\\') { if (i + 1 < n) out += line[i + 1]; i += 2; continue; }
    if (c === "'") {
      const end = line.indexOf("'", i + 1);
      if (end === -1) throw new ShellSyntaxError('unterminated quoted string');
      out += line.slice(i + 1, end);
      i = end + 1;
      continue;
    }
    if (c === '"') {
      i++;
      while (i < n && line[i] !== '"') {
        if (line[i] === '\\' && '"\\$`'.includes(line[i + 1])) { out += line[i + 1]; i += 2; continue; }
        if (line[i] === '`' || (line[i] === '$' && line[i + 1] === '(')) throw new ShellSyntaxError('command substitution is not supported');
        if (line[i] === '$') { const r = readVar(line, i, env); out += r.value; i = r.next; continue; }
        out += line[i++];
      }
      if (i >= n) throw new ShellSyntaxError('unterminated quoted string');
      i++;
      continue;
    }
    if (c === '`' || (c === '$' && line[i + 1] === '(')) throw new ShellSyntaxError('command substitution is not supported');
    if (c === '$') { const r = readVar(line, i, env); out += r.value; i = r.next; continue; }
    out += c;
    i++;
  }
  return { word: any ? out : null, next: i };
}

function readVar(line, i, env) {
  if (line[i + 1] === '{') {
    const end = line.indexOf('}', i + 2);
    if (end === -1) throw new ShellSyntaxError('bad substitution');
    const name = line.slice(i + 2, end).replace(/:?-.*$/, '');
    const dflt = /:?-(.*)$/.exec(line.slice(i + 2, end));
    const v = expandVar(name, env);
    return { value: v === '' && dflt ? dflt[1] : v, next: end + 1 };
  }
  const m = /^[A-Za-z_][A-Za-z0-9_]*|^[?$#0-9]/.exec(line.slice(i + 1));
  if (!m) return { value: '$', next: i + 1 };
  const name = m[0];
  const value = name === '?' ? String(env['?'] ?? 0) : name === '$' ? '42' : expandVar(name, env);
  return { value, next: i + 1 + name.length };
}

// -> [{ pipeline: [{ argv, assigns, redirs }], connector }]
export function parse(line, env = {}) {
  const tokens = tokenize(line, env);
  const lists = [];
  let pipeline = [];
  let cmd = { argv: [], assigns: {}, redirs: [] };
  const endCmd = () => {
    if (cmd.argv.length || Object.keys(cmd.assigns).length || cmd.redirs.length) pipeline.push(cmd);
    else if (pipeline.length) throw new ShellSyntaxError('syntax error: empty command in pipeline');
    cmd = { argv: [], assigns: {}, redirs: [] };
  };
  for (const t of tokens) {
    if (t.type === 'word') {
      const asg = cmd.argv.length === 0 && /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/s.exec(t.value);
      if (asg) cmd.assigns[asg[1]] = asg[2];
      else cmd.argv.push(t.value);
    } else if (t.type === 'redir') {
      cmd.redirs.push(t);
    } else if (t.value === '|') {
      endCmd();
    } else {
      endCmd();
      if (pipeline.length) lists.push({ pipeline, connector: t.value });
      pipeline = [];
    }
  }
  endCmd();
  if (pipeline.length) lists.push({ pipeline, connector: null });
  return lists;
}

const enc = new TextEncoder();
const toBytes = (v) => (v == null ? new Uint8Array(0) : typeof v === 'string' ? enc.encode(v) : v instanceof Uint8Array ? v : new Uint8Array(v));
const concat = (a, b) => { const o = new Uint8Array(a.length + b.length); o.set(a); o.set(b, a.length); return o; };

function resolvePath(cwd, p) {
  return p.startsWith('/') ? p : `${cwd.replace(/\/$/, '')}/${p}`;
}

// Generator: yields { argv, env, cwd, input } command requests, receives
// { status, stdout, stderr } results, returns the final result. Lets one
// implementation serve both execSync (sync driver) and exec (async driver).
export function* runLine(line, { cwd, env = {}, fs, input, isCommand = () => false }) {
  let lists;
  try { lists = parse(line, env); } catch (err) {
    return { status: 2, stdout: new Uint8Array(0), stderr: toBytes(`sh: ${err.message}\n`) };
  }
  let status = 0;
  let stdoutAll = new Uint8Array(0);
  let stderrAll = new Uint8Array(0);
  let curCwd = cwd;
  let skip = false;
  for (const { pipeline, connector } of lists) {
    if (!skip) {
      let pipeIn = input ? toBytes(input) : new Uint8Array(0);
      for (let k = 0; k < pipeline.length; k++) {
        const c = pipeline[k];
        const cmdEnv = { ...env, ...c.assigns, '?': status };
        let stdin = pipeIn;
        let res;
        try {
          for (const r of c.redirs) if (r.op === '<') stdin = toBytes(fs.readFileSync(resolvePath(curCwd, r.target)));
        } catch (err) {
          res = { status: 1, stdout: '', stderr: `sh: ${c.redirs.find((r) => r.op === '<').target}: No such file or directory\n` };
        }
        if (!res) {
          const [name, ...args] = c.argv;
          if (name === undefined) res = { status: 0 };
          else if (name === 'true' || name === ':') res = { status: 0 };
          else if (name === 'false') res = { status: 1 };
          else if (name === 'echo') {
            const noNl = args[0] === '-n';
            res = { status: 0, stdout: (noNl ? args.slice(1) : args).join(' ') + (noNl ? '' : '\n') };
          } else if (name === 'exit') {
            return { status: Number(args[0] ?? status) | 0, stdout: stdoutAll, stderr: stderrAll };
          } else if (name === 'cd') {
            const target = resolvePath(curCwd, args[0] ?? env.HOME ?? '/');
            let ok = false;
            try { ok = fs.statSync(target).isDirectory(); } catch { ok = false; }
            if (ok) { curCwd = target; res = { status: 0 }; } else res = { status: 1, stderr: `sh: cd: ${args[0]}: No such file or directory\n` };
          } else if ((name === 'command' && args[0] === '-v') || name === 'type') {
            const target = name === 'type' ? args[0] : args[1];
            const builtin = ['true', 'false', ':', 'echo', 'exit', 'cd', 'command', 'type'].includes(target);
            res = builtin || isCommand(target) ? { status: 0, stdout: `${target}\n` } : { status: 1, stderr: name === 'type' ? `sh: type: ${target}: not found\n` : '' };
          } else {
            res = yield { argv: c.argv, env: cmdEnv, cwd: curCwd, input: stdin };
          }
        }
        let out = toBytes(res.stdout);
        let err = toBytes(res.stderr);
        for (const r of c.redirs) {
          if (r.op === '<') continue;
          if (r.op === '>&' || r.op === '<&') {
            if (r.fd === 2 && r.target === '1') { out = concat(out, err); err = new Uint8Array(0); }
            else if (r.fd === 1 && r.target === '2') { err = concat(err, out); out = new Uint8Array(0); }
            continue;
          }
          const data = r.fd === 'both' ? concat(out, err) : r.fd === 2 ? err : out;
          if (r.fd === 'both') { out = new Uint8Array(0); err = new Uint8Array(0); }
          else if (r.fd === 2) err = new Uint8Array(0);
          else out = new Uint8Array(0);
          if (r.target === '/dev/null') continue;
          const file = resolvePath(curCwd, r.target);
          if (r.op === '>>') fs.appendFileSync(file, data); else fs.writeFileSync(file, data);
        }
        status = res.status ?? 0;
        stderrAll = concat(stderrAll, err);
        if (k < pipeline.length - 1) pipeIn = out;
        else stdoutAll = concat(stdoutAll, out);
      }
    }
    if (connector === '&&') skip = status !== 0;
    else if (connector === '||') skip = status === 0;
    else skip = false;
  }
  return { status, stdout: stdoutAll, stderr: stderrAll };
}

export function runLineSync(line, opts, run) {
  const gen = runLine(line, opts);
  let step = gen.next();
  while (!step.done) step = gen.next(run(step.value));
  return step.value;
}

export async function runLineAsync(line, opts, run) {
  const gen = runLine(line, opts);
  let step = gen.next();
  while (!step.done) step = gen.next(await run(step.value));
  return step.value;
}
