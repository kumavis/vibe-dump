// Keyboard shortcuts and the cheat sheet dialog.
import { h, icon } from './dom.js'

export const SHORTCUTS = [
  ['Execution', [
    ['→', 'Step one instruction'],
    ['←', 'Step back'],
    ['O', 'Step over a call'],
    ['U', 'Step out of the current function'],
    ['Space', 'Run / pause'],
    ['R', 'Restart the current call'],
    ['[  ]', 'Slower / faster'],
    ['B', 'Toggle a breakpoint on the next instruction'],
  ]],
  ['View', [
    ['M', 'Machine / Binary view'],
    ['H', 'Hex / decimal values'],
    ['G', 'Go to a memory address'],
    ['A', 'Animations on / off'],
    ['T', 'Light / dark theme'],
  ]],
  ['Tutorial', [
    ['N  P', 'Next / previous lesson'],
    ['E', 'Edit the WAT source'],
    ['?', 'This cheat sheet'],
  ]],
]

export function cheatSheet(onClose) {
  const body = h('div', { class: 'keys-grid' })
  for (const [group, list] of SHORTCUTS) {
    body.appendChild(h('div', { class: 'keys-group' }, h('div', { class: 'keys-h' }, group),
      list.map(([k, d]) => h('div', { class: 'keys-r' }, h('span', { class: 'keys-k' }, k.split(/\s{2}/).map((x) => h('kbd', {}, x))), h('span', {}, d)))))
  }
  const dlg = h('dialog', { class: 'keys', 'aria-label': 'Keyboard shortcuts' },
    h('div', { class: 'keys-top' }, h('h2', {}, 'Keyboard shortcuts'), h('button', { type: 'button', class: 'ibtn', 'aria-label': 'Close', onclick: () => dlg.close() }, icon('close', 16))),
    body,
    h('p', { class: 'dim keys-foot' }, 'Click a line number in the code to toggle a breakpoint there. Click a lower call frame to see its caller\'s position.'))
  dlg.addEventListener('close', () => onClose && onClose())
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) dlg.close()
  })
  return dlg
}
