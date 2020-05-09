const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// FIXME: Change serial_id to parentSerial

/**
 * Defines a single part of a serial story
 */
const SerialPartSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  creation_date: {
    type: Date,
    required: true,
  },
  last_updated: {
    type: Date,
    required: true,
  },
  serial_id: {
    type: Schema.Types.ObjectId,
    ref: "Serial",
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  part_number: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("SerialPart", SerialPartSchema);
