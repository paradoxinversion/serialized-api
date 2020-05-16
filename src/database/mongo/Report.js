const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/**
 * Defines user-generated moderation reports
 */
const ReportSchema = new Schema({
  report_type: { type: String, required: true },
  reported_item: { type: Schema.Types.ObjectId, required: true },
  extra_details: { type: String },
  reporting_user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Report", ReportSchema);
