const http = require('http');
const https = require('https');
const url = require('url');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const parsed = url.parse(req.url, true);
  const target = parsed.query.url;

  if (!target) {
    res.writeHead(400);
    return res.end("Missing url parameter");
  }

  https.get(target, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
    proxyRes.pipe(res);
  }).on('error', (e) => {
    res.writeHead(500);
    res.end(e.message);
  });
});

server.listen(3000, '0.0.0.0', () => console.log('Proxy running on port 3000'));
