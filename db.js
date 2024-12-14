const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://2ilhomovabubakir2:abubakir@cluster0.ujuxz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log(`MongoDB подключена: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Ошибка подключения: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;