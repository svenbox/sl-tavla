// proxy.js – Kör med: node proxy.js
// API-nyckel sätts som env-variabel: TL_API_KEY=xxxx node proxy.js

const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3000;
const TL_API_KEY = process.env.TL_API_KEY || '';

if (!TL_API_KEY) {
  console.warn('⚠️  TL_API_KEY saknas – Trafiklab-anrop kommer misslyckas');
}

const ALLOWED_HOSTS = [
  'realtime-api.trafiklab.se',
  'transport.integration.sl.se',
];

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const parsed = url.parse(req.url, true);
  const target = parsed.query.url;

  if (!target) { res.writeHead(400); res.end(JSON.stringify({ error: 'Saknar ?url=' })); return; }

  let targetUrl;
  try { targetUrl = new URL(target); } catch(e) {
    res.writeHead(400); res.end(JSON.stringify({ error: 'Ogiltig URL' })); return;
  }

  // Säkerhetskoll – tillåt bara kända hosts
  if (!ALLOWED_HOSTS.includes(targetUrl.hostname)) {
    res.writeHead(403); res.end(JSON.stringify({ error: 'Host ej tillåten: ' + targetUrl.hostname })); return;
  }

  // Injicera API-nyckel för Trafiklab
  if (targetUrl.hostname === 'realtime-api.trafiklab.se') {
    targetUrl.searchParams.set('key', TL_API_KEY);
  }

  console.log(`[proxy] → ${targetUrl.hostname}${targetUrl.pathname}`);

  const options = {
    hostname: targetUrl.hostname,
    path: targetUrl.pathname + targetUrl.search,
    method: 'GET',
    headers: { 'Accept': 'application/json', 'User-Agent': 'avgangstavla-proxy/1.0' }
  };

  const proxyReq = https.request(options, (proxyRes) => {
    console.log(`[proxy] ← ${proxyRes.statusCode}`);
    res.writeHead(proxyRes.statusCode, {
      'Content-Type': proxyRes.headers['content-type'] || 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (e) => {
    console.error('[proxy] Fel:', e.message);
    res.writeHead(502); res.end(JSON.stringify({ error: e.message }));
  });

  proxyReq.end();
});

server.listen(PORT, () => {
  console.log(`✅ Proxy körs på http://localhost:${PORT}`);
  console.log(`   TL_API_KEY: ${TL_API_KEY ? TL_API_KEY.slice(0,8)+'…' : 'SAKNAS'}`);
});
