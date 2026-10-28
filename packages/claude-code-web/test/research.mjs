// Where the tests find their read-only research inputs: the official
// platform packages, the reference extraction (spike-E) and the Agent SDK.
// Nothing of Anthropic's is kept in this repository, so every test that
// needs one of these reads it from here and skips when it is absent.
//
//   CC_RESEARCH_DIR   the research directory (default: the scratchpad of the
//                     session that built this package)
//   CC_BINARY         the `claude` binary the e2e drops (default: its
//                     linux-x64 copy under CC_RESEARCH_DIR)
import { join } from 'node:path'

export const DEFAULT_RESEARCH_DIR = '/tmp/claude-0/-home-user-vibe-dump/5b506f29-8275-5bfc-ac58-3487cb33f8da/scratchpad/research'

export const RESEARCH_DIR = process.env.CC_RESEARCH_DIR || DEFAULT_RESEARCH_DIR

/** <research>/pkg-linux-x64/package/claude: the linux-x64 2.1.311 binary. */
export const LINUX_X64_BINARY = join(RESEARCH_DIR, 'pkg-linux-x64', 'package', 'claude')
