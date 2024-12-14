// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./db");
const userRoutes = require("./routes/userRoutes"); // Подключаем роуты

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Подключение к MongoDB
connectDB();

// Использование роутов для пользователей
app.use("/api/users", userRoutes);

// WebSocket handlers
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Обработчик для пересылки сигналов WebRTC
  socket.on("signal", (data) => {
    io.to(data.target).emit("signal", {
      sender: socket.id,
      signal: data.signal,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
