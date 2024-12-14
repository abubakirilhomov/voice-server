// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Temporary in-memory storage for users
let users = [];

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

// Register endpoint
app.post("/register", (req, res) => {
  const { name, username, password } = req.body;

  // Check if all fields are provided
  if (!name || !username || !password) {
    return res.status(400).json({ message: "Пожалуйста, заполните все поля" });
  }

  // Check if the username already exists
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(409).json({ message: "Пользователь с таким юзернеймом уже существует" });
  }

  // Add the user to the in-memory database
  const newUser = { name, username, password };
  users.push(newUser);

  res.status(201).json({ message: "Регистрация успешна!", user: newUser });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if all fields are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Пожалуйста, заполните все поля" });
  }

  // Find the user in the in-memory database
  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Неверный юзернейм или пароль" });
  }

  res.status(200).json({ message: "Вход выполнен успешно!", user });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
