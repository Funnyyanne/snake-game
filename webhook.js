const http = require('http');
const { exec } = require('child_process');

const server = http.createServer((req, res) => {
  if (req.url === '/hooks/deploy' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        if (payload.event === 'deploy') {
          // 执行更新脚本
          exec('bash /home/ubuntu/snake-game/update_my_service.sh', (error, stdout, stderr) => {
            if (error) {
              console.error(`Error executing script: ${error}`);
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Script execution failed');
              return;
            }
            console.log(`Script output: ${stdout}`);
            if (stderr) console.error(`Script stderr: ${stderr}`);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Deployment triggered successfully');
          });
        } else {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Invalid event');
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid payload');
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(9000, '0.0.0.0', () => {
  console.log('Webhook server running on http://0.0.0.0:9000');
});