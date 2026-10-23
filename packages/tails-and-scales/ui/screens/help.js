// The rules screen (DESIGN §1.3): the HUD's ? opens it, its ✕ closes it.
const $ = (s) => document.querySelector(s)

export function wireHelp() {
  $('#helpBtn').onclick = () => $('#help').classList.remove('hidden')
  $('#helpClose').onclick = () => $('#help').classList.add('hidden')
}
