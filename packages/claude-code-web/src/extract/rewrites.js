// THE list of edits this app makes to Claude Code's extracted JavaScript.
//
// This file is the single place the "modification" lives (ARCHITECTURE.md,
// policy posture). Every entry is a mechanical loader rewrite mirroring the
// FreeBSD port's scripts/post-extract (misc/claude-code 2.1.310) as re-run on
// 2.1.311 in research report E §2. None of them touches identity, the system
// prompt, the cch= billing line, entitlements or telemetry.
//
// Kept from the port (they matter in a browser):
//   bunfs-root, import-meta-require, import-meta-dir, builtin-hooks-helper,
//   shell-search-gate, path-completer-readdir.
// Dropped:
//   - /usr/local -> PREFIX: only re-points documentation at a FreeBSD prefix.
//   - the prepended `import "<APPDIR>/bun-polyfill.cjs"`: boot.js installs
//     Bun before it imports the entry, and a Worker never self-respawns.
//   - the .zst round trip: on 2.1.311 none of the 137 compressed assets
//     contains a rewrite target, so they are stored byte-for-byte; given a
//     zstd decompressor, apply-rewrites.js checks every one of them against
//     ZST_CHECK_IDS below and throws (code 'zst-needs-rewrite') if a future
//     release changes that.
// Changed from the port (the port's Node-only targets do not exist here):
//   - import.meta.dir becomes the module's directory as a string literal,
//     not import.meta.dirname (browsers do not define import.meta.dirname).
//   - the readdir follow-links helper is inlined instead of loading the
//     port's own follow-dir-links.cjs.
//
// Shape of an entry:
//   id          stable name, used in reports and errors
//   files       (name) => boolean, name as parseBunfs returns it ("/$bunfs/root/x.js")
//   pattern     a global RegExp
//   replacement a string using $1..$9 for groups, or (ctx) => string giving a
//               literal (no $-expansion). ctx = { appDir, fileDir, file }
//   expect      exact counts on PINNED_VERSION per build flavor, {matches, files}.
//               Every platform package is its own Bun build with its own
//               chunk graph (see builds.js); the four linux packages share
//               one set of counts and the two darwin packages another.
//               Windows builds embed "B:/~BUN/root/" instead of
//               "/$bunfs/root/" and are not supported. A mismatch is a
//               RewriteDriftError, never a silent skip.
//   portExpect  the release-independent check the FreeBSD port enforces (used
//               only with strict:false for an unpinned build): {matches, files}
//               exact, {min} for "at least", or null for "any".

export const PINNED_VERSION = '2.1.311'

const ID = '[A-Za-z0-9_$]+'

/** find -name '*.js' -o -name cli -o -name '*.md' -o -name '*.txt' */
export const portTextFiles = (name) => /\.(js|md|txt)$/.test(name) || name === 'cli' || name.endsWith('/cli')
/** find -name '*.js' */
export const jsFiles = (name) => name.endsWith('.js')

export const REWRITES = [
  {
    id: 'bunfs-root',
    description: 'Absolute "/$bunfs/root/..." paths (static imports, asset paths, the hooks-worker URL) point at the app directory, which is both the URL the service worker serves the tree under and the VFS mount point, so one string works as an import specifier and as an fs path. sed: s|/*$bunfs/root/*|APPDIR/|g',
    files: portTextFiles,
    pattern: /\/*\$bunfs\/root\/*/g,
    replacement: (ctx) => ctx.appDir + '/',
    expect: {
      linux: { matches: 241429, files: 2391 },
      darwin: { matches: 243276, files: 2404 }
    },
    portExpect: { min: 1 }
  },
  {
    id: 'import-meta-require',
    description: 'Bun\'s synchronous import.meta.require -> the registry-backed globalThis.__bunRequire that boot.js installs. sed: s|import\\.meta\\.require|globalThis.__bunRequire|g',
    files: portTextFiles,
    pattern: /import\.meta\.require/g,
    replacement: 'globalThis.__bunRequire',
    expect: {
      linux: { matches: 529, files: 115 },
      darwin: { matches: 531, files: 115 }
    },
    portExpect: null
  },
  {
    id: 'import-meta-dir',
    description: 'Bun\'s import.meta.dir (the module\'s directory) -> that directory as a string literal. The port writes import.meta.dirname, which Node has and browsers do not; without a value, every built-in hooks plugin is registered from path.join(undefined, ...). The word boundary keeps .dirname untouched.',
    files: portTextFiles,
    pattern: /import\.meta\.dir\b/g,
    replacement: (ctx) => JSON.stringify(ctx.fileDir),
    expect: {
      linux: { matches: 9, files: 9 },
      darwin: { matches: 9, files: 9 }
    },
    portExpect: null
  },
  {
    id: 'builtin-hooks-helper',
    description: 'The helper that declares built-in hooks-module plugins takes the bundled module only when Bun.isStandaloneExecutable, else looks for TypeScript sources that do not ship. Make it always take the bundled module, by shape (minified names vary): =(a,b,c)=>isExe()?load(b,c(),a):{module:b,folder:a} -> =(a,b,c)=>load(b,c(),a). (Grzegorz Junka\'s rewrite, as the port applies it; fatal unless it matches exactly once.)',
    files: jsFiles,
    pattern: new RegExp(`=\\((${ID}),(${ID}),(${ID})\\)=>${ID}\\(\\)\\?(${ID})\\((${ID}),(${ID})\\(\\),(${ID})\\):\\{module:${ID},folder:${ID}\\}`, 'g'),
    replacement: '=($1,$2,$3)=>$4($5,$6(),$7)',
    expect: {
      linux: { matches: 1, files: 1 },
      darwin: { matches: 1, files: 1 }
    },
    portExpect: { matches: 1, files: 1 }
  },
  {
    id: 'shell-search-gate',
    description: 'Force the shell-search-tools gate off. With it on, Claude Code assumes CLAUDE_CODE_EXECPATH is the multi-call Bun binary (embedded ugrep/bfs picked by argv0) and hides the Grep and Glob tools. Neither exists here, and with no Bash tool the model needs Grep/Glob. Matched by shape, ending in the stable CLAUDE_CODE_ENTRYPOINT!=="local-agent" comparison: function g(){if(!f(...))return!1;if(h())return!1;return env.CLAUDE_CODE_ENTRYPOINT!=="local-agent"} -> function g(){return!1}',
    files: jsFiles,
    pattern: new RegExp(`function (${ID})\\(\\)\\{if\\(!${ID}\\([^()]*\\)\\)return!1;if\\(${ID}\\(\\)\\)return!1;return ${ID}\\.CLAUDE_CODE_ENTRYPOINT!=="local-agent"\\}`, 'g'),
    replacement: 'function $1(){return!1}',
    expect: {
      linux: { matches: 1, files: 1 },
      darwin: { matches: 1, files: 1 }
    },
    portExpect: { matches: 1, files: 1 }
  },
  {
    id: 'path-completer-readdir',
    description: 'Upstream bug, kept apart from the loader rewrites so it can be dropped on its own: both path completers classify readdir() entries with Dirent.isDirectory(), which is false for a symlink to a directory. Pass the listing through an inline helper that reports such links as directories (same behaviour as the port\'s follow-dir-links.cjs, written here as an expression so nothing extra has to be loadable).',
    files: jsFiles,
    pattern: new RegExp(`\\(await (${ID})\\(\\)\\.readdir\\((${ID})\\)\\)(\\.filter\\(\\((${ID})\\)=>((${ID})\\.isDirectory\\(\\)&&)?!(${ID})\\.name\\.startsWith\\("\\."\\)\\))`, 'g'),
    replacement:
      '(await ((d,p,f)=>Promise.all(d.map(async(e)=>{try{if(e.isSymbolicLink?.()&&(await f.stat((p.endsWith("/")?p:p+"/")+e.name)).isDirectory())return Object.create(e,{isDirectory:{value:()=>!0}})}catch{}return e})))' +
      '(await $1().readdir($2),$2,$1()))$3',
    expect: {
      linux: { matches: 2, files: 1 },
      darwin: { matches: 2, files: 1 }
    },
    portExpect: { matches: 2, files: 1 }
  }
]

/**
 * Compressed assets are stored as shipped; with a decompressor the engine
 * checks that none of them contains a target of these rewrites (the port's
 * sed script minus /usr/local). Any hit is a RewriteDriftError.
 */
export const ZST_CHECK_IDS = ['bunfs-root', 'import-meta-require', 'import-meta-dir']
