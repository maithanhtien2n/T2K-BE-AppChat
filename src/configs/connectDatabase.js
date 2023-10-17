const mongoose = require("mongoose");

// Thay đổi thông tin kết nối tại đây
const dbURI =
  "mongodb+srv://maithanhtien2n:tien2000@t2k.tjn3wmq.mongodb.net/db-tchat?retryWrites=true&w=majority"; // Thay đổi tên cơ sở dữ liệu

// Kết nối đến MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Sự kiện kết nối thành công
mongoose.connection.on("connected", () => {
  console.log("Kết nối đến MongoDB thành công");
});

// Sự kiện lỗi kết nối
mongoose.connection.on("error", (err) => {
  console.error("Kết nối đến MongoDB lỗi:", err);
});

// Sự kiện ngắt kết nối
mongoose.connection.on("disconnected", () => {
  console.log("Ngắt kết nối đến MongoDB");
});

module.exports = mongoose;
