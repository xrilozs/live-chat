const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Store connected clients
const clients = new Set();

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('New client connected');
    clients.add(ws);

    // Send welcome message
    ws.send(JSON.stringify({
        type: 'system',
        message: 'Welcome to the WebSocket chat!',
        timestamp: new Date().toISOString()
    }));

    // Broadcast to all clients that a new user joined
    broadcastToAll({
        type: 'system',
        message: 'A new user joined the chat',
        timestamp: new Date().toISOString()
    }, ws);

    // Handle incoming messages
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            console.log('Received:', message);

            // Broadcast message to all connected clients, including clientId
            broadcastToAll({
                type: 'message',
                user: message.user || 'Anonymous',
                message: message.message,
                timestamp: new Date().toISOString(),
                clientId: message.clientId || null
            });
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
        
        // Broadcast to remaining clients
        broadcastToAll({
            type: 'system',
            message: 'A user left the chat',
            timestamp: new Date().toISOString()
        });
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clients.delete(ws);
    });
});

// Function to broadcast message to all connected clients
function broadcastToAll(data, excludeWs = null) {
    clients.forEach((client) => {
        if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        connections: clients.size,
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`WebSocket server is ready on ws://localhost:${PORT}`);
}); 