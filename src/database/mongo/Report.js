const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/**
 * Defines user-generated moderation reports
 */
const ReportSchema = new Schema({
  serialPart: { type: Schema.Types.ObjectId, ref: "SerialPart" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  serial: { type: Schema.Types.ObjectId, ref: "Serial" },
  reportType: { type: Number, required: true },
  extraDetails: { type: String },
  reportingUser: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Report", ReportSchema);
