const http = require('http');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const server = http.createServer((req, res) => {
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${req.method} ${req.url}`);

  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', timestamp }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Portainer Test</title>
      <style>
        body { font-family: sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        .success { color: green; }
        pre { background: #f4f4f4; padding: 10px; overflow-x: auto; }
      </style>
    </head>
    <body>
      <h1 class="success">Container is running! (v2)</h1>
      <p>Your Portainer stack deployed successfully on ASUSTOR 5405T.</p>
      <p><strong>CI/CD Test:</strong> This update was deployed automatically via Portainer polling.</p>
      <h3>Environment Info:</h3>
      <pre>
Hostname: ${process.env.HOSTNAME || 'unknown'}
Node Version: ${process.version}
Platform: ${process.platform}
Architecture: ${process.arch}
Uptime: ${Math.floor(process.uptime())}s
Timestamp: ${timestamp}
      </pre>
      <p><a href="/health">Health check endpoint</a></p>
    </body>
    </html>
  `);
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
  console.log('Press Ctrl+C to stop');
});
