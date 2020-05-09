const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/**
 * Defines serial story genres
 */
const GenreSchema = new Schema({
  name: { type: String, unique: true },
  description: { type: String },
});

module.exports = mongoose.model("Genre", GenreSchema);
