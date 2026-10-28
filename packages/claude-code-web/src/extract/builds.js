// The official Claude Code 2.1.311 platform packages, as data: where to fetch
// them and how to recognise them. Hashes only; no Anthropic code lives here.
//
// Measured 2026-10-27 from `npm pack @anthropic-ai/claude-code-<platform>@2.1.311`
// (every tarball matched the registry's dist.integrity):
//   binarySha256  sha256 of package/claude (claude.exe on win32)
//   treeSha256    hash.js treeSha256 of the parsed module tree before any
//                 rewrite (names relative to /$bunfs/, e.g. "root/cli"), the
//                 same value `find . -type f -printf '%P\n' | LC_ALL=C sort |
//                 xargs sha256sum | sha256sum` gives over an unhare extraction
//   modules       entries in the Bun module table
//
// Each package is a separate Bun build: chunk names are content hashes and
// differ between all eight (even linux-x64 vs linux-arm64), the darwin builds
// carry computer-use-*.node addons, the win32 ones embed "B:/~BUN/root/"
// paths. The rewrite counts are shared per flavor (rewrites.js `expect`).

import { PINNED_VERSION } from './rewrites.js'

export const NPM_REGISTRY = 'https://registry.npmjs.org'
/** The platform the in-page download fetches (the runtime presents itself as linux/x64). */
export const DEFAULT_PLATFORM = 'linux-x64'

export const KNOWN_BUILDS = [
  {
    platform: 'linux-x64', flavor: 'linux', container: 'elf', modules: 2848,
    binarySha256: '86dc1fcc69498159eaf15f446613e847010f9036bfbbdffd4c49350be8489ada',
    treeSha256: '5f161a84cd957f4f882bb91e9d717fc632a8160ece7c8613feafa6cd9d822447',
    integrity: 'sha512-dk1lVMt7n+NlYucKM7dLp/PfrK32pa/4oKQkacfazlSj8rG+hkH67wnDnaFG9Gs2al3OjK8PTVHgZ2WGHXoWUg=='
  },
  {
    platform: 'linux-arm64', flavor: 'linux', container: 'elf', modules: 2848,
    binarySha256: '2e2496c9a8065df93acb0fca2d341f59a6b8777649b2e025ab8c9bcd5eef61f3',
    treeSha256: '000324670351072e6c43f2efeb20162b6fc76fd87b932ca8ef8310ff5de9e53b',
    integrity: 'sha512-yZwDmtXmoZcFcCjCaoznOKqjrjjdQyc6PVuh6brANqQcaKpP+WZGuFlgUjgQh86u8HBybHZBB60WWOumKpO6uQ=='
  },
  {
    platform: 'linux-x64-musl', flavor: 'linux', container: 'elf', modules: 2848,
    binarySha256: 'cd40dd327145ee47aa0deacd571801c1d782388f709d71242eee6b91de8ed11f',
    treeSha256: 'ec3d1d1952e8ceb52df8706b902ff2fde8a9e6e05a2643ba1894341775ff28e8',
    integrity: 'sha512-/SY8KhtVq5HRIdJu6Ow1ImkAplgL46J88j8vhH5FTZaNPVBjyk4A4yuIFMgyy8dVaNgVXxlpjXIEnfX39uDq5Q=='
  },
  {
    platform: 'linux-arm64-musl', flavor: 'linux', container: 'elf', modules: 2848,
    binarySha256: '172150e3f9ea07e8e2e2e29862d7d9a25f5c234d8e909e4063df237665bf09b9',
    treeSha256: 'fd7cf596154bce383966d7cd876391f2ed0de7ba4e8dfde8027439697b69f522',
    integrity: 'sha512-ymSGc6vv0QCcVQZCC2JG03P/upLraox+iXAG1DfnUU1OZBCIR9QncxINBEp6QgnKbqywwR2/ic3GD8hAz0Tiow=='
  },
  {
    platform: 'darwin-arm64', flavor: 'darwin', container: 'macho', modules: 2866,
    binarySha256: '85d8c08707fcfd1e78ffa0204eefbc6ec9e4fe22f375fb2767ef85d957ed3161',
    treeSha256: '748d866c897d8120f50a00f2e641c06c749f78504060442504f979b96599ceb6',
    integrity: 'sha512-PHxqWpXJ7ED6ZD+2xNiTfiPoK9Aq5siPMhZ2lLHwA1HB10XluHP4dSJ6YSA24Hb4cD/P3nTlhFMauk2VPdMMNA=='
  },
  {
    platform: 'darwin-x64', flavor: 'darwin', container: 'macho', modules: 2866,
    binarySha256: 'd34e1cb82015b050471a97574aa6ea6f698ecf3a97a61c980961f43ad9f838f5',
    treeSha256: '3d1554358a338f43a36ec18f889d04c7d554d7a69748cc0e02658f73df670835',
    integrity: 'sha512-DEMAnoIk6qVaZ7r+o/QsFH532HOO9c6I+0mE2WuTygq5H8Gr7jgzpK7HVB6d1xzAuliu6MEw32G+oo//gYuvqw=='
  },
  {
    platform: 'win32-x64', flavor: 'win32', container: 'pe', modules: 2845,
    binarySha256: '966f4b2ce962298f5dee6a942e8c47c8f97392e69e728e622319a98b259c0680',
    treeSha256: 'e00de23a92bba98e08b42a296e2c31630404684800845ea13eb718132a8e3977',
    integrity: 'sha512-fKXnBqsAPxVeIc20kCdzI4GznhuCJxumy1ZbwkyIfgZRsZXKHzMaayrJ/Ro2O+Dfb/s9rG/gAqGkqJCsA3FgJg=='
  },
  {
    platform: 'win32-arm64', flavor: 'win32', container: 'pe', modules: 2845,
    binarySha256: '951b5d94bf2a5296db2c442784e68d18fa04dec2d7d2e805aa50e75d618aad5e',
    treeSha256: '00dcd5d3b3b26cfc748f8a0855d03d37306072c7de152b5dd97db1572b964a64',
    integrity: 'sha512-Gc9o60Ji5RuP6xm7MBJsLUJE/AGymq8HF11idETBANHnLqg4uITD4O3tdOFE0yR7y6zEz2wl5D/7n4NlrY16Yg=='
  }
].map((b) => Object.freeze({ version: PINNED_VERSION, package: `@anthropic-ai/claude-code-${b.platform}`, ...b }))

/** Container -> rewrite flavor ('linux' | 'darwin' | 'win32' | null). */
export function flavorOf (container) {
  return { elf: 'linux', macho: 'darwin', 'macho-fat': 'darwin', pe: 'win32' }[container] ?? null
}

/** The KNOWN_BUILDS entry whose pre-rewrite tree hash matches, else null. */
export function identifyBuild (treeSha256) {
  return KNOWN_BUILDS.find((b) => b.treeSha256 === treeSha256) ?? null
}

/**
 * registry.npmjs.org tarball URL for a platform package (served with
 * Access-Control-Allow-Origin: *, research report C).
 */
export function npmTarballUrl (platform = DEFAULT_PLATFORM, version = PINNED_VERSION, registry = NPM_REGISTRY) {
  return `${registry}/@anthropic-ai/claude-code-${platform}/-/claude-code-${platform}-${version}.tgz`
}
