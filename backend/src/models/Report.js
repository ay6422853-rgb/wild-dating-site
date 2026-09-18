import mongoose from "mongoose";

const schema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reported: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String, required: true, maxlength: 200 },
  details: { type: String, maxlength: 2000, default: "" },
  status: { type: String, enum: ["OPEN", "REVIEWED", "RESOLVED"], default: "OPEN" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Report", schema);