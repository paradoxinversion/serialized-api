const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const GenreSchema = new Schema({
  name: { type: String },
  description: { type: String },
});

module.exports = mongoose.model("Genre", GenreSchema);
