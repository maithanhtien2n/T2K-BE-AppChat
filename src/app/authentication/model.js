const { Account, Room, Message, Posts } = require("./config");
const { throwError } = require("../../utils/index");
const {
  onUrlFile,
  onImagePath,
  onSaveFile,
  onDeleteFile,
} = require("../../utils/upload");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  registerMD: async ({ user_name, password }) => {
    // Mã hóa mật khẩu
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
      const accountInfo = await Account.findOne({ user_name });

      if (accountInfo) {
        throwError(210, "Tên người dùng đã tồn tại!");
      }

      await Account.create({
        user_name,
        password: hashedPassword,
        role: "USER",
      });

      return "Đăng ký tài khoản thành công!";
    } catch (error) {
      throw error;
    }
  },

  loginMD: async ({ user_name, password }) => {
    try {
      const account = await Account.findOne({ user_name });

      if (!account || !bcrypt.compareSync(password, account.password)) {
        throwError(205, "Tên tài khoản hoặc mật khẩu không chính xác!");
      }

      const userInfo = {
        account_id: account?._id,
        user_name: account?.user_name,
        role: account?.role,
        createdAt: account?.createdAt,
        updatedAt: account?.updatedAt,
      };

      return {
        user_info: userInfo,
        accessToken: jwt.sign(userInfo, process.env.JWT_SECRET, {
          expiresIn: "1h",
        }),
      };
    } catch (error) {
      throw error;
    }
  },

  userInfoMD: async ({ data }) => {
    try {
      return data;
    } catch (error) {
      throw error;
    }
  },

  createRoomMD: async ({ room_name, members }) => {
    try {
      const room = await Room.create({
        room_name,
        room_admin: members,
        members,
      });

      const message = await Message.create({
        sender: members,
        content: "Xin chào, đây là tin nhắn đầu tiên!",
      });

      await Room.updateOne(
        { _id: room._id },
        { $push: { messages: message?._id } }
      );

      return room;
    } catch (error) {
      throw error;
    }
  },

  updateRoomMD: async ({ room_id, room_name, room_image, host }) => {
    try {
      const filePath = room_image
        ? onImagePath(room_image.name, "files-message/")
        : undefined;

      const room = await Room.findOne({ _id: room_id });

      if (room.room_image && room_image) {
        onDeleteFile(room.room_image, "files-message/");
      }

      let body = {};

      if (room_name) {
        body.room_name = room_name;
      }

      if (room_image) {
        body.room_image = room_image ? onUrlFile(host, filePath) : undefined;
      }

      const roomUpdate = await Room.updateOne({ _id: room_id }, body);

      if (room_image) onSaveFile(filePath, room_image.base64);

      return roomUpdate;
    } catch (error) {
      throw error;
    }
  },

  getRoomMD: async ({ account_id, room_id }) => {
    try {
      let checkAccountId = {};

      if (account_id) {
        checkAccountId = { members: { $in: [account_id] } };
      }

      const room = await Room.findOne({
        _id: room_id,
        ...checkAccountId,
      })
        .populate({
          path: "members",
          model: Account,
          select: "user_name",
        })
        .populate({
          path: "messages",
          model: Message,
          select: "sender content image createdAt",
          populate: {
            path: "sender",
            model: Account,
            select: "user_name",
          },
        });

      if (!room) {
        throwError(201, "Bạn không có quyền truy cập vào phòng!");
      }

      return room;
    } catch (error) {
      if (error?.stringValue) {
        throwError(201, "ID phòng không tồn tại!");
      }
      throw error;
    }
  },

  getRoomsMD: async ({ account_id }) => {
    try {
      const rooms = await Room.find({
        members: { $in: [account_id] },
      });

      return rooms.reverse();
    } catch (error) {
      throw error;
    }
  },

  joinRoomMD: async ({ account_id, room_id }) => {
    try {
      const room = await Room.findOne({
        _id: room_id,
        members: { $in: [account_id] },
      });

      if (room) {
        return room_id;
      }

      await Room.updateOne(
        { _id: room_id },
        { $push: { members: account_id } }
      );

      return room_id;
    } catch (error) {
      throw error;
    }
  },

  createPostsMD: async ({ account_id, content, room_id, file, host }) => {
    try {
      const filePath = file
        ? onImagePath(file.name, "files-message/")
        : undefined;

      const posts = await Posts.create({
        poster: account_id,
        content,
        room_id: room_id || "",
        file: file ? onUrlFile(host, filePath) : "",
        type: file ? file.type : "",
      });

      if (file) onSaveFile(filePath, file.base64);

      return posts;
    } catch (error) {
      throw error;
    }
  },

  getAllPostsMD: async () => {
    try {
      const posts = await Posts.find().populate({
        path: "poster",
        model: Account,
        select: "user_name",
      });
      return posts.reverse();
    } catch (error) {
      throw error;
    }
  },

  getPostsDetailMD: async ({ posts_id }) => {
    try {
      const postsDetail = await Posts.findOne({ _id: posts_id }).populate({
        path: "poster",
        model: Account,
        select: "user_name",
      });

      return postsDetail;
    } catch (error) {
      if (error?.stringValue) {
        throwError(201, "Bài viết không tồn tại!");
      }
      throw error;
    }
  },

  // Socket.io -------------------------------------------

  createMessageMD: async ({ room_id, sender, content, image, host }) => {
    try {
      if (content === "focus") {
        return {
          type: "sending",
          active: true,
          sender,
        };
      }

      if (content === "unfocus") {
        return {
          type: "sending",
          active: false,
          sender,
        };
      }

      const filePath = image
        ? onImagePath(image.name, "files-message/")
        : undefined;

      const message = await Message.create({
        sender,
        content,
        image: image ? onUrlFile(host, filePath) : undefined,
      });

      if (image) onSaveFile(filePath, image.base64);

      await Room.updateOne(
        { _id: room_id },
        { $push: { messages: message?._id } }
      );

      const room = await Room.findOne({ _id: room_id })
        .populate({
          path: "members",
          model: Account,
          select: "user_name",
        })
        .populate({
          path: "messages",
          model: Message,
          select: "sender content image createdAt",
          populate: {
            path: "sender",
            model: Account,
            select: "user_name",
          },
        });

      return room;
    } catch (error) {
      throw error;
    }
  },

  likePostsMD: async ({ posts_id, people_like }) => {
    try {
      const post = await Posts.findOne({
        _id: posts_id,
        likes: { $in: [people_like] },
      });

      if (post) {
        await Posts.updateOne(
          { _id: posts_id },
          {
            $pull: { likes: people_like },
          }
        );
      } else {
        await Posts.updateOne(
          { _id: posts_id },
          {
            $push: { likes: people_like },
          }
        );
      }

      const posts = await Posts.find().populate({
        path: "poster",
        model: Account,
        select: "user_name",
      });

      const postsDetail = await Posts.findOne({ _id: posts_id }).populate({
        path: "poster",
        model: Account,
        select: "user_name",
      });

      return {
        allPosts: posts.reverse(),
        postsDetail,
      };
    } catch (error) {
      throw error;
    }
  },
};
