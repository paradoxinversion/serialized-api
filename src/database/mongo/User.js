const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  birth_date: {
    type: Date,
    required: true,
  },
  join_date: {
    type: Date,
    required: true,
  },
  biography: {
    type: String,
    required: false,
  },
  role: {
    type: Number,
    required: true,
  },
  likes: {
    type: Schema.Types.ObjectId,
    ref: "Like",
  },
  view_nsfw: {
    type: Boolean,
    default: false,
  },
  account_status: {
    type: Number,
    default: 0,
  },
});

UserSchema.methods.validatePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model("User", UserSchema);
