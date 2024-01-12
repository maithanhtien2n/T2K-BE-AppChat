const mongoose = require("../../configs/connectDatabase");
const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    user_name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const roomSchema = new Schema(
  {
    room_name: { type: String, required: true },
    room_image: { type: String, required: false },
    room_admin: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "Account" }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  {
    timestamps: true,
  }
);

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "Account" },
    content: { type: String, required: false },
    image: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const postsSchema = new Schema(
  {
    poster: { type: Schema.Types.ObjectId, ref: "Account" },
    content: { type: String, required: true },
    room_id: { type: String, required: false },
    file: { type: String, required: false },
    type: { type: String, required: false },
    likes: [{ type: Schema.Types.ObjectId, ref: "Account" }],
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model("Account", accountSchema);
const Room = mongoose.model("Room", roomSchema);
const Message = mongoose.model("Message", messageSchema);
const Posts = mongoose.model("Posts", postsSchema);

module.exports = {
  Account,
  Room,
  Message,
  Posts,
};
