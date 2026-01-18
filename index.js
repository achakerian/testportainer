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

  const containerStartTime = Date.now() - (process.uptime() * 1000);

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Portainer Test</title>
      <meta http-equiv="refresh" content="30">
      <style>
        body { font-family: sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        .success { color: green; }
        .version { background: #007bff; color: white; padding: 2px 8px; border-radius: 4px; }
        pre { background: #f4f4f4; padding: 10px; overflow-x: auto; }
        .timer { font-size: 1.2em; margin: 20px 0; padding: 15px; background: #e8f4e8; border-radius: 8px; }
        .refresh-note { color: #666; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <h1 class="success">Container is running! <span class="version">v3</span></h1>
      <p>Your Portainer stack deployed successfully on ASUSTOR 5405T.</p>

      <div class="timer">
        <strong>Container uptime:</strong> <span id="uptime">0s</span><br>
        <strong>Page auto-refresh in:</strong> <span id="countdown">30</span>s
      </div>
      <p class="refresh-note">Page refreshes every 30s. When version number changes, CI/CD worked!</p>

      <h3>Environment Info:</h3>
      <pre>
Hostname: ${process.env.HOSTNAME || 'unknown'}
Node Version: ${process.version}
Platform: ${process.platform}
Architecture: ${process.arch}
Container Started: ${new Date(containerStartTime).toISOString()}
      </pre>
      <p><a href="/health">Health check endpoint</a></p>

      <script>
        const startTime = ${containerStartTime};
        let refreshCountdown = 30;

        function formatUptime(ms) {
          const seconds = Math.floor(ms / 1000);
          const mins = Math.floor(seconds / 60);
          const secs = seconds % 60;
          if (mins > 0) return mins + 'm ' + secs + 's';
          return secs + 's';
        }

        setInterval(() => {
          document.getElementById('uptime').textContent = formatUptime(Date.now() - startTime);
          refreshCountdown--;
          if (refreshCountdown < 0) refreshCountdown = 30;
          document.getElementById('countdown').textContent = refreshCountdown;
        }, 1000);
      </script>
    </body>
    </html>
  `);
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
  console.log('Press Ctrl+C to stop');
});
