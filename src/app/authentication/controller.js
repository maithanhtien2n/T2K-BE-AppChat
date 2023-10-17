const model = require("./model");
const { onResponse } = require("../../utils/index");

module.exports = {
  registerCT: async (req, res) => {
    await onResponse(req, res, model.registerMD, {
      checkData: ["user_name", "password"],
      data: ({ user_name, password } = req.body),
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

  // Socket.io -------------------------------------------

  createMessageCT: async (data) => {
    try {
      const { room_id, sender, content } = data;
      return await model.createMessageMD({ room_id, sender, content });
    } catch (error) {
      throw error;
    }
  },
};
