const model = require("./model");
const { onResponse } = require("../../utils/index");

module.exports = {
  registerCT: async (req, res) => {
    await onResponse(req, res, model.registerMD, {
      checkData: ["user_name", "password"],
      data: ({ user_name, password } = req.body),
      message: "Đăng ký tài khoản thành công!",
    });
  },

  loginCT: async (req, res) => {
    await onResponse(req, res, model.loginMD, {
      checkData: ["user_name", "password"],
      data: ({ user_name, password } = req.body),
      message: "Đăng nhập thành công!",
    });
  },

  userInfoCT: async (req, res) => {
    await onResponse(req, res, model.userInfoMD, {
      data: { data: req.data },
    });
  },

  createRoomCT: async (req, res) => {
    const { room_name, members } = req.body;
    await onResponse(req, res, model.createRoomMD, {
      checkData: ["room_name", "members"],
      data: { room_name, members },
      message: "Tạo phòng thành công!",
    });
  },

  updateRoomCT: async (req, res) => {
    const { room_id, room_name, room_image } = req.body;
    await onResponse(req, res, model.updateRoomMD, {
      checkData: ["room_id"],
      data: { room_id, room_name, room_image, host: req.headers.host },
      message: "Cập nhật thông tin phòng thành công!",
    });
  },

  getRoomCT: async (req, res) => {
    const { account_id, room_id } = req.query;
    await onResponse(req, res, model.getRoomMD, {
      data: { account_id, room_id },
    });
  },

  getRoomsCT: async (req, res) => {
    const { id } = req.params;
    await onResponse(req, res, model.getRoomsMD, {
      data: { account_id: id },
    });
  },

  joinRoomCT: async (req, res) => {
    const { account_id, room_id } = req.query;
    await onResponse(req, res, model.joinRoomMD, {
      data: { account_id, room_id },
    });
  },

  createPostsCT: async (req, res) => {
    const { account_id, content, room_id, file } = req.body;
    await onResponse(req, res, model.createPostsMD, {
      checkData: ["account_id", "content"],
      data: {
        account_id,
        content,
        room_id,
        file,
        host: req.headers.host,
      },
      message: "Bài viết của bạn đã được tải lên thành công!",
    });
  },

  getAllPostsCT: async (req, res) => {
    await onResponse(req, res, model.getAllPostsMD, {
      data: {},
    });
  },

  getPostsDetailCT: async (req, res) => {
    const posts_id = req.params.id;
    await onResponse(req, res, model.getPostsDetailMD, {
      data: { posts_id },
    });
  },

  // Socket.io -------------------------------------------

  createMessageCT: async (data, host) => {
    try {
      const { room_id, sender, content, image } = data;
      return await model.createMessageMD({
        room_id,
        sender,
        content,
        image,
        host,
      });
    } catch (error) {
      throw error;
    }
  },

  likePostsCT: async (data) => {
    try {
      return await model.likePostsMD(data);
    } catch (error) {
      throw error;
    }
  },
};
