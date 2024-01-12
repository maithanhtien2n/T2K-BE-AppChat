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
  router.post(
    `${commonRoute}/room`,
    authenticateToken,
    controller.createRoomCT
  );

  // API cập nhật thông tin phòng
  router.put(
    `${commonRoute}/room/update`,
    authenticateToken,
    controller.updateRoomCT
  );

  // API lấy thông tin phòng
  router.get(`${commonRoute}/room`, authenticateToken, controller.getRoomCT);

  // API lấy danh sách tin nhắn theo id người dùng
  router.get(
    `${commonRoute}/rooms/:id`,
    authenticateToken,
    controller.getRoomsCT
  );

  // API tham gia phòng
  router.put(`${commonRoute}/room`, authenticateToken, controller.joinRoomCT);

  // API tạo mới bài viết
  router.post(
    `${commonRoute}/posts`,
    authenticateToken,
    controller.createPostsCT
  );

  // API lấy danh sách bài viết
  router.get(
    `${commonRoute}/posts`,
    authenticateToken,
    controller.getAllPostsCT
  );

  // API lấy chi tiết bài viết
  router.get(
    `${commonRoute}/posts/:id`,
    authenticateToken,
    controller.getPostsDetailCT
  );

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

    // Xử lý tính năng like
    socket.on(`like-posts`, async (data) => {
      if (data) {
        const res = await controller.likePostsCT(data);
        io.emit(`like-posts`, {
          allPosts: res?.allPosts,
          postsDetail: res?.postsDetail,
        });
      }
    });
  });
};
