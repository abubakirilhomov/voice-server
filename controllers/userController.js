const User = require("../models/User");

// Регистрация
const registerUser = async (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({ message: "Пожалуйста, заполните все поля" });
  }

  try {
    // Проверка на существующего пользователя
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Пользователь с таким юзернеймом уже существует" });
    }

    // Создание нового пользователя
    const newUser = await User.create({ name, username, password });
    res.status(201).json({ message: "Регистрация успешна!", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

// Вход
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Пожалуйста, заполните все поля" });
  }

  try {
    // Поиск пользователя
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: "Неверный юзернейм или пароль" });
    }

    res.status(200).json({ message: "Вход выполнен успешно!", user });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

module.exports = { registerUser, loginUser };
