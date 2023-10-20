module.exports = (router, io) => {
  const commonRoute = "/api/v1";
  const controller = require("./controller");
  const { authenticateToken } = require("../middlewares/index");

  // API mở file ảnh hoặc video
  const onApiOpenFile = (folderName = "") => {
    router.get(`/uploads${folderName}:name`, (req, res) => {
      const fileName = req.params.name;
      const options = {
        root: `uploads${folderName}`,
        headers: {
          "Content-Type": fileName.endsWith(".mp4") ? "video/mp4" : "image",
        },
      };
      res.sendFile(fileName, options, (err) => {
        if (err) {
          console.error(err);
          res.status(500).end();
        }
      });
    });
  };
  onApiOpenFile("/");
  onApiOpenFile("/files-message/");

  // API đăng ký tài khoản
  router.post(`${commonRoute}/account/register`, controller.registerCT);

  // API đăng nhập tài khoản
  router.post(`${commonRoute}/account/login`, controller.loginCT);

  // API lấy thông tin người dùng
  router.get(`${commonRoute}/user`, authenticateToken, controller.userInfoCT);

  // API tạo phòng
  router.post(`${commonRoute}/room`, controller.createRoomCT);

  // API lấy thông tin phòng
  router.get(`${commonRoute}/room`, controller.getRoomCT);

  // API lấy danh sách tin nhắn theo id người dùng
  router.get(`${commonRoute}/rooms/:id`, controller.getRoomsCT);

  // API tham gia phòng
  router.put(`${commonRoute}/room`, controller.joinRoomCT);

  // Socket.io -------------------------------------------

  io.on("connection", (socket) => {
    console.log("Đã kết nối!");

    socket.on(`chat-message`, async (data) => {
      if (data?.content || data?.image) {
        const res = await controller.createMessageCT(
          data,
          socket.request.headers.host
        );
        io.emit(`chat-message-${data?.room_id}`, { message: res, data });
      }
    });
  });
};
