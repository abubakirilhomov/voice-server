// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// Express setup
const app = express();
const server = http.createServer(app);

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "https://voice-front-three.vercel.app"], // Frontend origins
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});

const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// WebSocket logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle signaling
  socket.on("signal", (data) => {
    const { target, signal } = data;
    if (target && signal) {
      io.to(target).emit("signal", {
        sender: socket.id,
        signal,
      });
    } else {
      console.error("Invalid signal data:", data);
    }
  });

  // Broadcast connected users
  const broadcastUsers = () => {
    const clients = Array.from(io.sockets.sockets.values()).map((s) => ({
      id: s.id,
    }));
    io.emit("users", clients);
  };

  broadcastUsers();

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    broadcastUsers();
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
