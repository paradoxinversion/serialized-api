const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RoleSchema = new Schema({
  role: {
    type: String,
    required: true,
    unique: true,
  },
  accessLevel: {
    type: Number,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Role", RoleSchema);
