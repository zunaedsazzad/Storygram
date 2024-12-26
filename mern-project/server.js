const express = require('express');
const http = require('http'); // Import the HTTP module
const socketIo = require('socket.io'); // Import Socket.IO
const { createAuction, getActiveAuctions, placeBid } = require('./app/api/auction'); // Adjust the path if needed

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = socketIo(server); // Attach Socket.IO to the server

// Middleware to parse JSON
app.use(express.json());

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Function to broadcast auction updates
const broadcastAuctionUpdate = (auction) => {
  io.emit('auction-update', auction);
};

// Define Auction Routes
app.post('/api/auctions', (req, res) => {
  const auction = createAuction(req, res);
  broadcastAuctionUpdate(auction); // Broadcast the new auction
});
app.get('/api/auctions', getActiveAuctions);
app.post('/api/auctions/bid', (req, res) => {
  const updatedAuction = placeBid(req, res);
  broadcastAuctionUpdate(updatedAuction); // Broadcast the updated auction
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
