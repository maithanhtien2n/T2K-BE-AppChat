const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors"); // Import cors module

const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {},
});

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "500MB" })); // Tăng giới hạn kích thước lên 500MB (tuỳ chỉnh kích thước)

// Định tuyến các API endpoint
require("./src/app/authentication/router")(app, io);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
