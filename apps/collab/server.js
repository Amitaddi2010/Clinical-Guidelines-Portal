const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const setupWSConnection = require('y-websocket/bin/utils').setupWSConnection;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (conn, req) => {
    // Pass WebSocket connection to y-websocket handler
    // Document name is derived from the URL (e.g., ws://localhost:1234/guideline-123)
    const docName = req.url.slice(1).split('?')[0];
    setupWSConnection(conn, req, { docName });
});

app.get('/health', (req, res) => {
    res.status(200).send('Collab server is running');
});

// Parse command line arguments
const args = process.argv.slice(2);
const portArgIndex = args.indexOf('--port');
const portArg = portArgIndex !== -1 ? args[portArgIndex + 1] : null;

const PORT = portArg || process.env.PORT || 1234;

server.listen(PORT, () => {
    console.log(`Yjs WebSocket Collaboration Server running on port ${PORT}`);
});
