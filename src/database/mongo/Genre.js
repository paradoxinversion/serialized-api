import mongoose, { Schema } from "mongoose";

const GenreSchema = new Schema({
  name: { type: String },
  description: { type: String }
});

export default mongoose.model("Genre", GenreSchema);
