const mongoose = require("mongoose");
const SerialSchema = require("./SerialSchema");

module.exports = mongoose.model("Serial", SerialSchema);
