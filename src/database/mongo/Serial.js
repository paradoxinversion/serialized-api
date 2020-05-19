const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Defines a serial story
 */
const SerialSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  synopsis: {
    type: String,
    required: true,
  },
  genre: {
    type: Schema.Types.ObjectId,
    ref: "Genre",
    required: true,
  },
  nsfw: {
    type: Boolean,
    required: true,
  },
  creation_date: {
    type: Date,
    required: Date.now(),
  },
  last_modified: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Serial", SerialSchema);
