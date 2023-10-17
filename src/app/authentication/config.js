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
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model("Account", accountSchema);
const Room = mongoose.model("Room", roomSchema);
const Message = mongoose.model("Message", messageSchema);

module.exports = {
  Account,
  Room,
  Message,
};
