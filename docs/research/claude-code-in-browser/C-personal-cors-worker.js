// Personal CORS proxy for a browser-hosted Claude Code. Deploy on YOUR OWN
// Cloudflare account (wrangler deploy / dashboard "Quick edit"); never share it.
// Point the in-browser CLI at it: ANTHROPIC_BASE_URL=https://<name>.<you>.workers.dev
const ALLOWED_ORIGIN = 'https://kumavis.github.io';
const UPSTREAM = { '/v1/oauth/token': 'https://platform.claude.com' }; // else api.anthropic.com

export default {
  async fetch(req) {
    const origin = req.headers.get('origin');
    if (origin !== ALLOWED_ORIGIN) return new Response('origin not allowed', { status: 403 });
    const cors = {
      'access-control-allow-origin': origin,
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': req.headers.get('access-control-request-headers') ?? '',
      'access-control-expose-headers': '*',
      'access-control-max-age': '86400',
      vary: 'Origin',
    };
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    const url = new URL(req.url);
    const target = (UPSTREAM[url.pathname] ?? 'https://api.anthropic.com') + url.pathname + url.search;
    const headers = new Headers(req.headers);
    for (const h of [...headers.keys()])
      if (/^(origin|referer|cookie|host|cf-|x-forwarded-|x-real-ip)/i.test(h)) headers.delete(h);
    const res = await fetch(target, {
      method: req.method, headers, redirect: 'manual',
      body: req.method === 'GET' || req.method === 'HEAD' ? undefined : await req.arrayBuffer(),
    });
    const out = new Headers(res.headers);
    for (const [k, v] of Object.entries(cors)) out.set(k, v);
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: out }); // streams SSE
  },
};
