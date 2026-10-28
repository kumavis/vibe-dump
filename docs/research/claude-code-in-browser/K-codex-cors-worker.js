// Personal CORS relay for a browser-hosted "Codex subscription" client.
// Deploy on YOUR OWN Cloudflare account; never share it, never run one for others.
//   wrangler secret put RELAY_KEY      # any long random string; the page sends it as x-relay-key
// Point the page's Codex base URL at https://<name>.<you>.workers.dev/backend-api/codex
//
// Only chatgpt.com/backend-api/codex/* needs this: auth.openai.com (token, refresh,
// device code) already answers any origin with ACAO:* (probed 2026-10-28), so the
// page should call it directly and keep refresh tokens out of the relay.
const ALLOWED_ORIGINS = new Set(['https://kumavis.github.io']);
const UPSTREAM = 'https://chatgpt.com';           // pinned: never taken from the request
const ALLOWED_PATH = /^\/backend-api\/codex\/(responses|models)$/;
const DROP = /^(origin|referer|cookie|host|x-relay-key|cf-|x-forwarded-|x-real-ip|sec-fetch-|forwarded)/i;

export default {
  async fetch(req, env) {
    const origin = req.headers.get('origin');
    if (!ALLOWED_ORIGINS.has(origin)) return new Response('origin not allowed', { status: 403 });
    const cors = {
      'access-control-allow-origin': origin,
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': req.headers.get('access-control-request-headers') ?? '',
      'access-control-expose-headers': '*',
      'access-control-max-age': '600',
      vary: 'Origin',
    };
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (!env.RELAY_KEY || req.headers.get('x-relay-key') !== env.RELAY_KEY)
      return new Response('bad relay key', { status: 401, headers: cors });
    const url = new URL(req.url);
    if (!ALLOWED_PATH.test(url.pathname) || !['GET', 'POST'].includes(req.method))
      return new Response('path not relayed', { status: 404, headers: cors });
    const headers = new Headers();
    for (const [k, v] of req.headers) if (!DROP.test(k)) headers.set(k, v);
    const res = await fetch(UPSTREAM + url.pathname + url.search, {
      method: req.method, headers, redirect: 'manual',
      body: req.method === 'POST' ? req.body : undefined,   // streamed through, not buffered
      ...(req.method === 'POST' ? { duplex: 'half' } : {}),
    });
    const out = new Headers(res.headers);
    out.delete('set-cookie');                                // never hand chatgpt.com cookies to the page
    for (const [k, v] of Object.entries(cors)) out.set(k, v);
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: out }); // SSE streams
  },
};
