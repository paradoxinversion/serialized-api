const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const mongoose, { Schema } = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  joinDate: {
    type: Date,
    required: true,
  },
  biography: {
    type: String,
    required: false,
  },
  token: {
    type: String,
    required: false,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  likes: {
    type: Schema.Types.ObjectId,
    ref: "Like",
  },
  viewNSFW: {
    type: Boolean,
    default: false,
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
