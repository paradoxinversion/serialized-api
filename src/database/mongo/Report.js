import mongoose, { Schema } from "mongoose";

const ReportSchema = new Schema({
  serialPart: { type: Schema.Types.ObjectId, ref: "SerialPart" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  serial: { type: Schema.Types.ObjectId, ref: "Serial" },
  reportType: { type: Number, required: true },
  extraDetails: { type: String },
  reportingUser: { type: Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.model("Report", ReportSchema);
