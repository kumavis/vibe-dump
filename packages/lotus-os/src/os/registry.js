// registry.js — every program the machine can run, by id.
//
// The shell looks programs up here and nowhere else; the filesystem refers to
// them by the same ids, so adding a program means adding one line to this map.

import explorer from './apps/explorer.js'
import reader from './apps/reader.js'
import terminal from './apps/terminal.js'
import settings from './apps/settings.js'
import motifs from './apps/motif-viewer.js'
import about from './apps/about.js'

export const APPS = {
  explorer,
  reader,
  terminal,
  settings,
  motifs,
  about,
}
