#!/usr/bin/env node
/**
 * Simple HTTP server for dashboard testing
 * Usage: node server.js
 * Visit: http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HOSTNAME = 'localhost';

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.url === '/' || req.url === '/dashboard.html') {
    const filePath = path.join(__dirname, 'dashboard.html');
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Dashboard not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
  } else if (req.url.endsWith('.css')) {
    res.writeHead(200, { 'Content-Type': 'text/css' });
    res.end('');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`\n✨ 2050 NEXUS SYSTEM ONLINE ✨`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🌌 Dashboard: http://${HOSTNAME}:${PORT}`);
  console.log(`📡 Status: ACTIVE`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  console.log(`Press Ctrl+C to stop the server\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.error(`Try: lsof -i :${PORT} (Mac/Linux) or netstat -ano | findstr :${PORT} (Windows)`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
