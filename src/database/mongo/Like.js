const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Defines likes related to serials
 */
const LikeSchema = new Schema({
  serialPart: { type: Schema.Types.ObjectId, ref: "SerialPart" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Like", LikeSchema);
