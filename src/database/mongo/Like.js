const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const LikeSchema = new Schema({
  serialPart: { type: Schema.Types.ObjectId, ref: "SerialPart" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Like", LikeSchema);
