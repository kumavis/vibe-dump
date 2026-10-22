// Decode a PNG to exact 8-bit pixels. createImageBitmap with no colour-space
// conversion and no premultiplication, drawn 1:1 into a 2D canvas and read
// back, gives the bytes in the file: no gamma, no ICC, no blending. (DATA.md
// §2 asks for exactly this; a 16-bit PNG would be cut to 8 bits on the way,
// which is why the heights come split across two channels.) Copied as it is
// from holo-i-ke-au's data/image.js (b480c27).

export async function decodeImage(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`)
  const blob = await res.blob()
  const bmp = await createImageBitmap(blob, { colorSpaceConversion: 'none', premultiplyAlpha: 'none' })
  const W = bmp.width
  const H = bmp.height
  let canvas
  if (typeof OffscreenCanvas !== 'undefined') canvas = new OffscreenCanvas(W, H)
  else {
    canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
  }
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(bmp, 0, 0)
  const px = ctx.getImageData(0, 0, W, H).data
  bmp.close?.()
  return { px, W, H }
}
