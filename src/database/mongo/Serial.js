// import {Schema} from "mongoose";
import mongoose, { Schema } from "mongoose";
const SerialSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  synopsis: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  nsfw: {
    type: Boolean,
    required: true
  },
  creation_date: {
    type: Date,
    required: true
  },
  author_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  serialParts: [
    {
      type: Schema.Types.ObjectId,
      ref: "SerialPart",
      required: false
    }
  ]
});

export default mongoose.model("Serial", SerialSchema);
