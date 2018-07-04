import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema({
  serialPart: { type: Schema.Types.ObjectId, ref: "SerialPart" },
  user: { type: Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.model("Like", LikeSchema);
