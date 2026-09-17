// The model lives in here rather than on the main thread, so a slow generation
// never stalls the clock, the walk cycles or the renderer.
//
// WebLLM itself is loaded at runtime from the URL the main thread hands over in
// the first message — the same vendored copy the page uses, so the browser
// fetches and compiles those six megabytes once for both sides rather than
// having Vite bundle a second copy into this worker. See scripts/vendor-webllm.mjs.

let handler = null
const queued = []

self.onmessage = (event) => {
  if (event.data?.kind === 'simville-init') {
    import(/* @vite-ignore */ event.data.lib).then((webllm) => {
      handler = new webllm.WebWorkerMLCEngineHandler()
      // Anything the engine sent while the import was in flight, in order.
      for (const pending of queued.splice(0)) handler.onmessage(pending)
    })
    return
  }
  if (handler) handler.onmessage(event)
  else queued.push(event)
}
