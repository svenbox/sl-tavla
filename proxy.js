// proxy.js – Kör med: node proxy.js
// Startar en lokal proxy på http://localhost:3000
// som vidarebefordrar anrop till Trafiklab & SL utan CORS-problem

const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3000;

const server = http.createServer((req, res) => {
  // CORS-headers – tillåt anrop från localhost
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Förväntat format: GET /proxy?url=https://...
  const parsed = url.parse(req.url, true);
  const target = parsed.query.url;

  if (!target) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: 'Saknar ?url= parameter' }));
    return;
  }

  console.log(`[proxy] → ${target}`);

  try {
    const targetUrl = new URL(target);
    const options = {
      hostname: targetUrl.hostname,
      path: targetUrl.pathname + targetUrl.search,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'avgangstavla-proxy/1.0',
      }
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
      res.writeHead(502);
      res.end(JSON.stringify({ error: e.message }));
    });

    proxyReq.end();
  } catch(e) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: 'Ogiltig URL: ' + e.message }));
  }
});

server.listen(PORT, () => {
  console.log(`✅ Proxy körs på http://localhost:${PORT}`);
  console.log(`   Använd: http://localhost:${PORT}/proxy?url=https://...`);
  console.log(`   Stoppa med Ctrl+C`);
});
